import { atom } from 'jotai'
const isListAtom = atom(false)
const fileAtom = atom([])
const filterAtom = atom('')
const currentBookAtom = atom(null)
const bp = localStorage.getItem('progress')
const progressAtom = atom(bp ? JSON.parse(bp) : {})
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
    return books.sort( (a, b)=>{
        const progress = get(progressAtom)
        const aKey = `${a.title}-${a.author}`
        const bKey = `${b.title}-${b.author}`
        const aValue = progress[aKey] || ''
        const bValue = progress[bKey] || ''
        if( aValue > bValue ) return -1;
        if( bValue > aValue ) return 1;
        return 0
    })
})
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
    progressAtom,
}
