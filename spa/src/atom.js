import { atom } from 'jotai'
const noteAtom = atom([])
const keyWordAtom = atom('')
const currentNoteAtom = atom(null)
const notesAtom = atom( get => {
    return get(noteAtom).reduce((notes, n) => {
        const keyWord = get(keyWordAtom)
        if(!keyWord || n.content.includes(keyWord)){
            notes.push(n)
        }
        return notes
    }, []).sort( (a, b)=>b.time.localeCompare(a.time) )
})
const uploadAtom = atom({})
const uploadCountAtom = atom(0)
export {
    noteAtom,
    notesAtom,
    uploadAtom,
    uploadCountAtom,
    keyWordAtom,
    currentNoteAtom,
}
