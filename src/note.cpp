
#include "note.h"

using namespace std;
std::string Note::time_to_str(std::time_t t)
{
    std::tm tm = *std::localtime(&t);
    std::ostringstream ss;
    ss << std::put_time(&tm, "%F %T");
    return ss.str();
}
void Note::broadcast(bool immediate)
{
    if(immediate)
    {
        note_bc(json::serialize( notes() ));
        return;
    }
    // throttle broadcast 2s
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
            note_bc(json::serialize( notes() ));
            pending = false;
        }
        busy = false;
    }, bpt::seconds(2) );
    note_bc(json::serialize( notes() ));
}

void Note::start(int port)
{
    cors()
    .use([this](auto *app) {
        db->exec_sql(R"(
            create table if not exists notes (
                id integer primary key autoincrement not null,
                content text,
                time date default (datetime('now','localtime'))
            );
            create view if not exists note as
            select id, substr(content, 0, 80), time from notes;
        )"); 
    })
    // .schema notes
    .serve_dir("*", www_path_)
    .serve_dir("/store", store_path_, true)
    .serve_dir("/cache", cache_path_)
    .upload("^/upload$", store_path_, [this](auto *app, auto path) { 

        ws_broadcast("^/note$", json::serialize(notes())); 
    })
    .post("^/get$", [this](auto *app, auto res, auto req) {
        auto id = req->content.string();
        auto sql{boost::format("select * from notes where id=%1%") % id};
        db->exec_sql( sql.str() );
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .post("^/del$", [this](auto *app, auto res, auto req) {
        auto id = req->content.string();
        auto sql{boost::format("delete from notes where id=%1%") % id};
        db->exec_sql( sql.str() );
        broadcast(true);
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .post("^/save$", [this](auto *app, auto res, auto req) {
        try {
            // cout << req->content.string() << endl;
            auto data = json::parse(req->content.string()).as_object();
            if( data.contains("id") )
            {
                db->exec_sql( 
                    (boost::format("replace into notes (id, content) values (%1%, '%2%');") 
                        % data.at("id").as_uint64()
                        % json::value_to<std::string>(data.at("content"))
                    ).str() 
                );
            }
            else
            {
                db->exec_sql( 
                    (boost::format("replace into notes (content) values ('%1%');") 
                        % json::value_to<std::string>(data.at("content"))
                    ).str() 
                );
            }
            broadcast();
            res->write(SimpleWeb::StatusCode::success_ok); 
        }
        catch(const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    })
    .post("^/app_url$", [this](auto *app, auto res, auto req) {
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .ws("^/note$", {
        .on_open = [this](auto *app, auto conn)
        {
            using namespace std::chrono;
            auto js{json::serialize( notes() )};
            conn->send(js);
        }
    })
    .cron_job([this](auto* app){

    }, 
    bpt::seconds(2), 
    0)
    .threads(std::thread::hardware_concurrency())
    .listen(port)
    .run([](auto port) { 
        printf("http server listen on: %d\n", port); 
    });
}