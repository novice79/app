import { Book } from 'epubjs';
import _ from 'lodash'
import util from "./util";
class EpubParser {
    constructor() {
      this.files = []
      this.book = null
      _.bindAll(this, ['book_metadata', 'check_epub'])
      this.check_epub()
      setInterval(this.check_epub, 2000)
    }
    async book_metadata(url, path) {
        console.log(`new Book(${url})`)
        if(this.book) this.book.destroy()
        this.book = new Book(url);
        await this.book.ready
        const meta = this.book.package.metadata;
        let cover = await this.book.coverUrl();
        // console.log(cover)
        if(cover) cover = await util.resize_img_file(cover)

        const info = {
            title: meta.title,
            author: meta.creator,
            publisher: meta.publisher,
            cover,
        };
        const uri = import.meta.env.DEV ?
            `${debugUrl}/save_epub`
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
    async check_epub() {       
        try {
            // console.log(`this.files.length=${this.files.length}`);
            for (const fi of this.files) {
                // console.log(fi);
                if (
                    fi.epub 
                    || ! fi.type.includes("epub")
                ) continue;
                let url = import.meta.env.DEV ?
                    `${debugUrl}/store/${fi.name}`
                    : `/store/${fi.name}`;
        
                await this.book_metadata( url, fi.path);
            }
        } catch (error) {
            console.log(`parse epub error`, error)
        } 
    }
}

export default new EpubParser;