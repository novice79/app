#pragma once

#include <bhttp/app.hpp>

class Ebook : public BH
{
private:
    fs::path exe_path;
    fs::path store;
    std::string time_to_str(std::time_t t);
    void file_to_db(std::string path);
    json::array files()
    {
        return db->exec_sql("select * from files;")["result"].as_array();
    }
public:
    Ebook(const char* argv0)
    :exe_path{pyu::exe_path(argv0)}, store(exe_path / "store"), 
    BH({
        .log_path = pyu::exe_path(argv0) / "log",
        .db_path = pyu::exe_path(argv0) / "app.db",
        .magic_path = pyu::exe_path(argv0) / "magic.mgc"
    })
    {}
    void start();
};


