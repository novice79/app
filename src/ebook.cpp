
#include "ebook.h"


std::string Ebook::time_to_str(std::time_t t)
{
    std::tm tm = *std::localtime(&t);
    std::ostringstream ss;
    ss << std::put_time(&tm, "%F %T");
    return ss.str();
}
void Ebook::file_to_db(std::string path)
{
    auto fi{fm->file_info(path)[0].as_object()};
    boost::format sql(R"(
        replace into files ( path ,name, type, time, size, ext)
        values (%1%, %2%, %3%, %4%, %5%, %6%);
    )");

    db->exec_sql(boost::str(
        sql 
        % fi["path"]
        % fi["name"]
        % fi["type"]
        % fi["time"]
        % fi["size"]
        % fi["ext"]
    ));
}
void Ebook::start()
{
    cors()
    .use([this](auto *app) {
        db->exec_sql(R"(
        create table if not exists files (
            path text primary key not null,
            name text,
            type text,
            time text,
            size int,
            ext text
            );
        )"); 
    })
    // .schema files
    .serve_dir("*", exe_path / "www")
    .serve_dir("/store", store)
    .upload("^/upload$", store, [this](auto *app, auto path) { 
        // logger->debug("upload %s completed\n", path);
        file_to_db(path);
        // logger->debug( json::serialize(files()) ); 
        ws_broadcast("^/store$", json::serialize(files())); 
    })
    .post("^/del$", [this](auto *app, auto res, auto req) {
        auto path = req->content.string();
        fs::remove_all(path);
        auto sql{boost::format("delete from files where path='%1%'") % path};
        // cout << sql.str() << endl;
        db->exec_sql( sql.str() );
        ws_broadcast("^/store$", json::serialize( files() ) );
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .ws("^/store$", {
        .on_open = [this](auto *app, auto conn)
        {
            // string fi{json::serialize(fm->file_info(store))};
            conn->send(json::serialize( files() ));
        }
    })
    .cron_job([this](auto* app){
        for (auto& fi : files())
        {
            auto path{json::value_to<std::string>( fi.at("path") )};
            if ( ! fs::exists(path) ) 
            {
                auto sql{boost::format("delete from files where path='%1%'") % path};
                db->exec_sql( sql.str() );
                ws_broadcast("^/store$", json::serialize( files() ) );
            }
        }
        for(auto &x : fs::recursive_directory_iterator(store)) 
        {
            auto& p{x.path()};
            if( !fs::is_regular_file(p)) continue;
            auto sql{boost::format("select time from files where path=%1%") % p};
            auto r{db->exec_sql(sql.str())["result"].as_array()};
            // File creation
            if(r.empty()) {
                file_to_db(p.string());
                ws_broadcast("^/store$", json::serialize( files() ) );
            } else {
                auto time_in_db{json::value_to<std::string>( r[0].as_object().at("time") )};
                auto time_on_file{time_to_str(fs::last_write_time(p))};
                // File modification
                if(time_in_db != time_on_file) {
                    file_to_db(p.string());
                    ws_broadcast("^/store$", json::serialize( files() ) );
                }
            }
        }
    }, 
    bpt::seconds(2), 
    0)
    .threads(std::thread::hardware_concurrency())
    .listen(8888)
    .run([](auto port) { 
        printf("http server listen on: %d\n", port); 
    });
}