import { Book } from 'epubjs';
import util from "./util";

function handle_epub(files) {
    files.forEach(fi => {
        if(fi.epub) return;
        let url = import.meta.env.DEV ?
            `http://192.168.0.60:8888/store/${fi.name}`
            : `/store/${fi.name}`;
        // console.log(`handle_epub ${url}`)
        // url = encodeURIComponent(url)
        // console.log(`handle_epub ${url}`)
        const book = new Book(url);
        book.ready
            .then(async() => {
                const meta = book.package.metadata;
                let cover = await book.coverUrl();
                // console.log(cover)
                cover = await util.resize_img_file(cover)
                // console.log(cover)
                const info = {
                    title: meta.title,
                    author: meta.creator,
                    publisher: meta.publisher,
                    cover,
                };
                const uri = import.meta.env.DEV ?
                `http://192.168.0.60:8888/save_epub`
                : `/save_epub`;
                const data = JSON.stringify({
                    path: fi.path, 
                    epub: JSON.stringify(info)
                });
                // console.log(data)
                util.post_data(uri, data,{
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                });
            })
    })
}
export default handle_epub;