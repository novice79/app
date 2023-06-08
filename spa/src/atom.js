import { atom } from 'jotai'
const noteAtom = atom([])
const keyWordAtom = atom('')
const currentNoteAtom = atom(null)

const uploadAtom = atom({})
const uploadCountAtom = atom(0)
export {
    noteAtom,
    uploadAtom,
    uploadCountAtom,
    keyWordAtom,
    currentNoteAtom,
}
