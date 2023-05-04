import { atom } from 'jotai'
const isListAtom = atom(false)
const fileAtom = atom([])
const filterAtom = atom('')
const currentBookAtom = atom(null)
const BookAtom = atom( get => {
    const books = get(fileAtom).reduce((epubs, fi) => {
        if(fi.epub){
            const b = JSON.parse(fi.epub);
            const keyWord = get(filterAtom)
            const pass = keyWord ? b.title.includes(keyWord) : true;
            if(pass){
                const url = import.meta.env.DEV ?
                `${debugUrl}/store/${fi.name}`
                : `/store/${fi.name}`;
                b.url = url;
                epubs.push(b)
            }
        }
        return epubs
    }, [])
    // console.log(books)
    return books
},[])
const uploadAtom = atom({})
const uploadCountAtom = atom(0)
export {
    isListAtom,
    fileAtom,
    uploadAtom,
    uploadCountAtom,
    filterAtom,
    BookAtom,
    currentBookAtom,
}
