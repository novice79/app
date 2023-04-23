#include "ebook.h"

using namespace std;

int main(int argc, char **argv)
{
    auto exe_path{pyu::exe_path(argv[0])};
    auto www_path{exe_path / "www"}, 
         app_path{exe_path / "app"},
         cache_path{exe_path / "tmp"};
    Ebook(std::move(www_path), std::move(app_path), std::move(cache_path))
    .start();
    return 0;
}