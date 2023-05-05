
#include "ebook.h"

using namespace std;
std::string Ebook::time_to_str(std::time_t t)
{
    std::tm tm = *std::localtime(&t);
    std::ostringstream ss;
    ss << std::put_time(&tm, "%F %T");
    return ss.str();
}
void Ebook::broadcast()
{
    static auto bc = std::bind(&Ebook::ws_broadcast, this, "^/store$", ph::_1);
    static std::atomic<bool> pending(false);
    if(pending) return;
    pending = true;
    cron_job([this](auto* app){
        bc(json::serialize( files() ));
        pending = false;
    }, bpt::seconds(2) );
    // bc(json::serialize( files() ));
}
void Ebook::check_file_del()
{
    for (auto& fi : files())
    {
        auto path{json::value_to<std::string>( fi.at("path") )};
        if ( ! fs::exists(path) ) 
        {
            logger->debug( "【%1%】no longer exist, delete it from db\n", path );
            auto sql{boost::format("delete from files where path='%1%'") % path};
            db->exec_sql( sql.str() );
            broadcast();
        }
    }
}
void Ebook::check_file_update()
{
    for(auto &x : fs::recursive_directory_iterator(store_path_)) 
    {
        auto& p{x.path()};
        if( !fs::is_regular_file(p)) continue;
        // format fs::path not need quote, where std::string need quote
        auto sql{boost::format("select name, time from files where path=%1%") % p};
        auto r = db->exec_sql(sql.str())["result"].as_array();
        
        // File creation
        if(r.empty()) {
            logger->debug( "【%1%】not exist in DB, insert it\n", p.string() );
            file_to_db(p.string());
            broadcast();
        } else {
            // logger->debug( "【%1%】exist in DB, compare time\n", p.string() );
            auto time_in_db{json::value_to<std::string>( r[0].as_object().at("time") )};
            auto time_on_file{time_to_str(fs::last_write_time(p))};
            // File modification
            if(time_in_db != time_on_file) {
                // logger->debug( "【%3%】changed time_in_db=%1%; time_on_file=%2%. Update info in DB", 
                //     time_in_db, time_on_file, p.string() );
                file_to_db(p.string());
                broadcast();
            }
        }
    }
}
void Ebook::file_to_db(std::string path)
{
    // cout<< fm->file_info(path) <<endl;
    auto fi{fm->file_info(path)[0].as_object()};
    boost::format sql(R"(
        replace into files ( path ,name, type, time, size, ext)
        values ('%1%', '%2%', '%3%', '%4%', %5%, '%6%');
    )");
    auto sql_str{boost::str(
        sql 
        % json::value_to<std::string>(fi["path"])
        % json::value_to<std::string>(fi["name"])
        % json::value_to<std::string>(fi["type"])
        % json::value_to<std::string>(fi["time"])
        % json::value_to<uint64_t>(fi["size"])
        % json::value_to<std::string>(fi["ext"])
    )};
    // cout<<"sql_str="<< sql_str << endl;
    db->exec_sql(sql_str);
}
void Ebook::start(int port)
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
            ext text,
            epub text
            );
        )"); 
    })
    // .schema files
    .serve_dir("*", www_path_)
    .serve_dir("/store", store_path_)
    .serve_dir("/cache", cache_path_)
    .upload("^/upload$", store_path_, [this](auto *app, auto path) { 
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
        broadcast();
        res->write(SimpleWeb::StatusCode::success_ok); 
    })
    .post("^/save_epub$", [this](auto *app, auto res, auto req) {
        try {
            // cout << req->content.string() << endl;
            auto data = json::parse(req->content.string());
            auto sql{(
                boost::format("update files set epub='%s' where path='%s';") 
                % json::value_to<std::string>(data.at("epub"))
                % json::value_to<std::string>(data.at("path"))
            ).str()};
            // cout <<"sql length="<< sql.length() << endl;
            // logger->debug("sql= %1%\n", sql);
            db->exec_sql( sql );
            broadcast();
            res->write(SimpleWeb::StatusCode::success_ok); 
        }
        catch(const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    })
    .post("^/app_url$", [this](auto *app, auto res, auto req) {
        res->write(SimpleWeb::StatusCode::success_ok); 
        // res->write("https://github.com/novice79/app/releases/download/v1.0-ebook/ebook-linux-x86_64.7z");
    })
    .ws("^/store$", {
        .on_open = [this](auto *app, auto conn)
        {
            using namespace std::chrono;
            // string fi{json::serialize(fm->file_info(store_path_))};
            // cout<< "boost version: " << BOOST_LIB_VERSION << endl;
            // auto start = high_resolution_clock::now();
            auto js{json::serialize( files() )};
            // auto stop = high_resolution_clock::now();
            // auto duration = duration_cast<milliseconds>(stop - start);
            // cout << "json::serialize take: " << duration.count() << " milliseconds" << endl;
            // start = high_resolution_clock::now();
            conn->send(js);
            // cout << "send js: " << js << endl;
            // stop = high_resolution_clock::now();
            // duration = duration_cast<milliseconds>(stop - start);
            // cout << "ws send take: " << duration.count() << " milliseconds" << endl;
/*
on macos:
boost_1_81_0
send 53files
json::serialize take: 8185 milliseconds
ws send take: 2 milliseconds

boost version: 1_82
send 53files
json::serialize take: 6 milliseconds
ws send take: 1 milliseconds
*/
        }
    })
    .cron_job([this](auto* app){
        // todo: need to check file changed?
        check_file_del();
        check_file_update();
    }, 
    bpt::seconds(2), 
    0)
    .threads(std::thread::hardware_concurrency())
    .listen(port)
    .run([](auto port) { 
        printf("http server listen on: %d\n", port); 
    });
}