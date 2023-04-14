import { atom } from 'jotai'
import { Book } from 'epubjs';
const fileAtom = atom([])
const BookAtom = atom(async (get) => {
    const books = await Promise.all( get(fileAtom).map(fi => {
        const url = import.meta.env.DEV ?
            `http://192.168.0.60:8888/store/${fi.name}`
            : `/store/${fi.name}`;
        const book = new Book(url);
        return book.ready
            .then(() => book.locations.generate())
            .then(async locations => {
                const meta = book.package.metadata;
                const info = {
                    title: meta.title,
                    author: meta.creator,
                    publisher: meta.publisher,
                    url,
                    cover: await book.coverUrl(),
                    toc: parshToc(book),
                    locations,
                };
                return info;
            })
    }))
    console.log(books)
    return books
})
const uploadAtom = atom({})
const filterAtom = atom('')
const uploadCountAtom = atom(0)
export {
    fileAtom,
    uploadAtom,
    uploadCountAtom,
    filterAtom,
    BookAtom
}

function parshToc(book) {
    const { toc } = book.navigation;
    const { spine } = book;

    /**
     * some epubs not uese standerd href or epubjs fails to process them
     * @param {String} href  The href to validate
     * @returns {String} href
     */
    const validateHref = href => {
        if (href.startsWith('..')) {
            href = href.substring(2);
        }
        if (href.startsWith('/')) {
            href = href.substring(1);
        }
        return href;
    };

    /**
     * Return spin part from href
     *
     * TL;DR
     * Toc item points exact postion of chapter or subChapter by using hase ID
     * in href. In more genrale href looks like ch001#title.
     * The ch001 is spine item and title is element id for which tocitem is.
     * We can get cfi of toc from this two item.
     *
     * @param {String} href - The herf to get spine component
     * @returns {String} - The Spine item href
     */
    const getSpineComponent = href => {
        return href.split('#')[0];
    };

    /**
     * Returns elementId part of href
     * @param {String} href
     */
    const getPositonComponent = href => {
        return href.split('#')[1];
    };

    const tocTree = [];

    /**
     * recursively go through toc and parsh it
     * @param {toc} toc
     * @param {parrent} parrent
     */
    const createTree = (toc, parrent) => {
        for (let i = 0; i < toc.length; i += 1) {
            // get clean href
            const href = validateHref(toc[i].href);

            // get spin and elementId part from href
            const spineComponent = getSpineComponent(href);
            const positonComponent = getPositonComponent(href);

            // get spinItem from href
            const spineItem = spine.get(spineComponent);

            // load spin item
            spineItem.load(book.load.bind(book)).then(() => {
                // get element by positionComponent which is basically elementId
                const el = spineItem.document.getElementById(positonComponent);
                // get cfi from element
                const cfi = spineItem.cfiFromElement(el);
                // get percent from cfi
                const percentage = book.locations.percentageFromCfi(cfi);
                // toc item which has
                parrent[i] = {
                    label: toc[i].label.trim(),
                    children: [],
                    href,
                    cfi,
                    percentage,
                };

                // if toc has subitems recursively parsh it
                if (toc[i].subitems) {
                    createTree(toc[i].subitems, parrent[i].children);
                }
            });
        }
    };

    createTree(toc, tocTree);
    return tocTree;
}
