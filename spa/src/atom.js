import { atom } from 'jotai'

const fileAtom = atom([])
const dirAtom = atom([])
const dirStrAtom = atom(get=> get(dirAtom).join("/"))
const uploadAtom = atom({})
const uploadCountAtom = atom(0)
export {
    fileAtom,
    dirAtom,
    dirStrAtom,
    uploadAtom,
    uploadCountAtom,
}
