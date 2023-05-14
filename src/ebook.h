#pragma once

#include <bhttp/app.hpp>

class Ebook : public BH
{
private:
    fs::path www_path_, data_path_, cache_path_;
    fs::path store_path_;
    std::string time_to_str(std::time_t t);
    void file_to_db(std::string path);
    json::array files()
    {
        return db->exec_sql("select * from files;")["result"].as_array();
    }
    void check_file_del();
    void check_file_update();
    void broadcast(bool immediate = false);
public:
    Ebook(fs::path www_path, fs::path data_path, fs::path cache_path)
    :www_path_(std::move(www_path)),
    data_path_(std::move(data_path)), 
    cache_path_(std::move(cache_path)),
    store_path_(data_path_ / "store"), 
    BH({
        .log_path = cache_path / "log",
        .db_path = data_path / "app.db",
        .magic_path = www_path / "magic.mgc"
    })
    {}
    void start(int port = 7777);
};


