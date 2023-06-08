#pragma once

#include <bhttp/app.hpp>

class Note : public BH
{
private:
    fs::path www_path_, data_path_, cache_path_;
    fs::path store_path_;
    std::string time_to_str(std::time_t t);
    json::array notes()
    {
        return db->exec_sql("select * from note;")["result"].as_array();
    }
    void note_bc(std::string msg)
    {
        ws_broadcast("^/note$", msg);
    }
    void broadcast(bool immediate = false);
public:
    Note(fs::path www_path, fs::path data_path, fs::path cache_path)
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
    void start(int port = 7779);
};


