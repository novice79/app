#include "note.h"

using namespace std;

int main(int argc, char **argv)
{
    int port = 7779;
    if( argc > 1)
    {
        int t = std::atoi(argv[1]);
        if(t < 1024 || t > 65535) 
            cout << "Invalid port number, use default port: " << port << endl;
        else
            port = t;
    }
    auto exe_path{pyu::exe_path(argv[0])};
    auto www_path{exe_path / "www"}, 
         data_path{exe_path / "data"},
         cache_path{exe_path / "tmp"};
    Note(std::move(www_path), std::move(data_path), std::move(cache_path))
    .start(port);
    return 0;
}