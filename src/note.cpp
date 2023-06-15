
#include "note.h"

using namespace std;

void Note::broadcast_debounce(std::function<void()> bc, int seconds)
{
    // throttle broadcast ns
    static std::atomic<bool> busy(false), pending(false);
    if(busy) 
    {
        pending = true;
        return;
    }
    busy = true;
    cron_job([this, bc](auto* app){
        if(pending)
        {
            bc();
            pending = false;
        }
        busy = false;
    }, bpt::seconds(seconds) );
    bc();
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
        )"); 
    })
    // .schema notes
    .serve_dir("*", www_path_)
    .serve_dir("/store", store_path_, true)
    .serve_dir("/cache", cache_path_)
    .upload("^/upload$", store_path_, [this](auto *app, auto path) { 
        broadcast_debounce([this](){ws_broadcast("^/store$", json::serialize(fm->file_info(store_path_)));}); 
    })
    .post("^/get$", [this](auto *app, auto res, auto req) {
        auto id = req->content.string();
        auto sql{boost::format("select * from notes where id=%1%") % id};
        auto r = db->exec_sql( sql.str() );      
        if(r["ret"].as_int64() == 0)
        {
            auto n = r["result"].as_array()[0];
            res->write(json::serialize(n));
        }
        else
        {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, boost::lexical_cast<std::string>(r["msg"]) ); 
        }      
    })
    .post("^/del_file$", [this](auto *app, auto res, auto req) {
        auto path = req->content.string();
        fs::remove_all(path);
        ws_broadcast("^/store$", json::serialize(fm->file_info(store_path_)));
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .post("^/del$", [this](auto *app, auto res, auto req) {
        auto id = req->content.string();
        auto sql{boost::format("delete from notes where id=%1%") % id};
        db->exec_sql( sql.str() );
        ws_broadcast("^/note$", json::serialize( notes() ));
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .post("^/save$", [this](auto *app, auto res, auto req) {
        try {
            // cout << req->content.string() << endl;
            auto data = json::parse(req->content.string()).as_object();
            string c = json::value_to<std::string>(data.at("content"));
            boost::replace_all(c , "'" , "''");
            if( data.contains("id") )
            {
                db->exec_sql( 
                    (boost::format("replace into notes (id, content) values (%1%, '%2%');") 
                        % boost::lexical_cast<std::string>(data.at("id"))
                        % c
                    ).str() 
                );
                res->write(SimpleWeb::StatusCode::success_ok); 
            }
            else
            {               
                auto sql = (boost::format("replace into notes (content) values ('%1%');") % c ).str();
                // cout<<"sql=" << sql << endl;
                auto r0 = db->exec_sql( sql );
                // cout<< "r0=" << r0 << endl;
                // or: select seq from sqlite_sequence where name="note";
                auto r = db->exec_sql("select last_insert_rowid() as id;")["result"];
                auto o = r.as_array()[0].as_object();
                // auto-increment id's json:value can : as_int64() but not as_uint64()
                // also can directly boost::lexical_cast to string
                auto id = boost::lexical_cast<std::string>(o.at("id"));
                cout<< "last_insert_rowid()=" << id << endl;
                res->write(id); 
            }
            ws_broadcast("^/note$", json::serialize( notes() ));         
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
    .ws("^/store$", {
        .on_open = [this](auto* app, auto conn){
            string fi{json::serialize( fm->file_info(store_path_) )};
            conn->send( fi );
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