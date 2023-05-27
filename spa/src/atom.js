import { atom } from 'jotai'

const fileAtom = atom([])

const fileToBeMovedAtom = atom([])
const dirAtom = atom([])
const dirStrAtom = atom(get=> get(dirAtom).join("/"))
const ascendAtom = atom(true)
const sortTypeAtom = atom('name')
const sortedFileAtom = atom(get=> get(fileAtom).sort((a,b)=>{
    const sortType = get(sortTypeAtom)
    const ascend = get(ascendAtom)
    const p1 = sortType == 'size' ? parseInt(a[sortType]) : a[sortType]
    const p2 = sortType == 'size' ? parseInt(b[sortType]) : b[sortType]
    return ascend ? p1 > p2 : p1 < p2
}))
const filterTypeAtom = atom('all')
const uploadAtom = atom({})
const uploadCountAtom = atom(0)
export {
    fileAtom,
    fileToBeMovedAtom,
    dirAtom,
    dirStrAtom,
    ascendAtom,
    sortTypeAtom,
    sortedFileAtom,
    filterTypeAtom,
    uploadAtom,
    uploadCountAtom,
}
