
#include "store.h"

using namespace std;
std::string Store::time_to_str(std::time_t t)
{
    std::tm tm = *std::localtime(&t);
    std::ostringstream ss;
    ss << std::put_time(&tm, "%F %T");
    return ss.str();
}
void Store::broadcast(bool immediate)
{
    if(immediate)
    {
        store_bc("");
        return;
    }
    // throttle broadcast 1s
    static std::atomic<bool> busy(false), pending(false);
    if(busy) 
    {
        pending = true;
        return;
    }
    busy = true;
    cron_job([this](auto* app){
        if(pending)
        {
            store_bc("");
            pending = false;
        }
        busy = false;
    }, bpt::seconds(1) );
    store_bc("");
}

void Store::start(int port)
{
    cors()
    .serve_dir("*", www_path_)
    .serve_dir("/store", store_path_)
    .serve_dir("/cache", cache_path_)
    .upload("^/upload$", store_path_, [this](auto *app, auto path) { 
        ws_broadcast("^/store$", path); 
    })
    .post("^/unzip$", [this](auto *app, auto res, auto req) {
        try {
            // cout << req->content.string() << endl;
            fs::path p{req->content.string()};
            if( !fs::exists(p) ) throw p.string() + " does not exist";
            fm->uncompress(p.string(), p.parent_path().string());
            res->write(SimpleWeb::StatusCode::success_ok); 
        }
        catch(const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    })
    .post("^/zip$", [this](auto *app, auto res, auto req) {
        try {
            fs::path p{req->content.string()};
            if( !fs::exists(p) ) throw p.string() + " does not exist";
            fm->compress(p.append(".7z").string(), p.string());
            res->write(SimpleWeb::StatusCode::success_ok); 
        }
        catch(const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    })
    .post("^/del$", [this](auto *app, auto res, auto req) {
        try {
            auto data = json::parse(req->content.string()).as_array();
            // data supposed to be list of path that need to be deleted
            for (auto&& p : data)
            {
                string path = p.as_string().c_str();
                fs::remove_all(path);
            }
            broadcast(true);
            res->write(SimpleWeb::StatusCode::success_ok); 
        }
        catch(const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    })
    .post("^/move$", [this](auto *app, auto res, auto req) {
        try {
            auto data = json::parse(req->content.string()).as_object();
            fs::path to_path{json::value_to<std::string>(data["to_path"])}; 
            for (auto&& p : data["files"].as_array())
            {
                fs::path from{p.as_string().c_str()};
                fs::path to{to_path / from.filename()};
                fs::rename(from, to );
            }
            broadcast(true);
            res->write(SimpleWeb::StatusCode::success_ok); 
        }
        catch(const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    })
    .post("^/files$", [this](auto *app, auto res, auto req) {
        try {
            // cout << req->content.string() << endl;
            fs::path p{req->content.string()};
            p = store_path_ / p;
            if( !fs::exists(p) ) throw p.string() + " does not exist";
            res->write(json::serialize( fm->file_info(p) )); 
        }
        catch(const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    })
    .post("^/app_url$", [this](auto *app, auto res, auto req) {
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .ws("^/store$", {})
    .threads(std::thread::hardware_concurrency())
    .listen(port)
    .run([](auto port) { 
        printf("http server listen on: %d\n", port); 
    });
}