import { atom } from 'jotai'

const fileAtom = atom([])
const fileToBeMovedAtom = atom([])
const dirAtom = atom([])
const dirStrAtom = atom(get=> get(dirAtom).join("/"))
const ascendAtom = atom(true)
const sortTypeAtom = atom('name')
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
    filterTypeAtom,
    uploadAtom,
    uploadCountAtom,
}
