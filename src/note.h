#pragma once

#include <bhttp/app.hpp>

class Note : public BH
{
private:
    fs::path www_path_, data_path_, cache_path_;
    fs::path store_path_;
    json::array notes()
    {
        return db->exec_sql("select id, substr(content, 0, 150) as content, time from notes;")["result"].as_array();
    }

    void broadcast_debounce(std::function<void()> bc, int seconds = 2);
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


