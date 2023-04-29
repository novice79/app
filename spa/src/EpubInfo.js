import { Book } from 'epubjs';
import util from "./util";

async function book_metadata(url, path) {
    const book = new Book(url);
    await book.ready
    const meta = book.package.metadata;
    let cover = await book.coverUrl();
    // console.log(cover)
    if(cover) cover = await util.resize_img_file(cover)
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
        path,
        epub: JSON.stringify(info)
    });
    // console.log(data)
    return util.post_data(uri, data, {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    });
}
async function handle_epub(files) {
    for (const fi of files) {
        // console.log(fi);
        if (fi.epub) continue;
        let url = import.meta.env.DEV ?
            `http://192.168.0.60:8888/store/${fi.name}`
            : `/store/${fi.name}`;
        // console.log(`handle_epub ${url}`)
        // url = encodeURIComponent(url)
        // console.log(`handle_epub ${url}`)
        // const span = util.randomInt(1, 7)
        // setTimeout(book_metadata.bind(null, url, fi.path), span)
        await book_metadata( url, fi.path);
    }
}
export default handle_epub;