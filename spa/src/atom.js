import { atom } from 'jotai'

const fileAtom = atom([])

const fileToBeMovedAtom = atom([])
const dirAtom = atom([])
const dirStrAtom = atom(get=> get(dirAtom).join("/"))
const ascendAtom = atom(true)
const pendingAtom = atom(false)
const sortTypeAtom = atom('name')
const sortedFileAtom = atom(get=> {
    const sortType = get(sortTypeAtom)
    const ascend = get(ascendAtom)
    const sorted = get(fileAtom).sort((a,b)=>{
        let p1 = a[sortType]
        let p2 = b[sortType]
        if(sortType == 'size'){
            p1 = parseInt(a[sortType]) 
            p2 = parseInt(b[sortType])
            return ascend ? p1 - p2 : p2 - p1
        }
        return ascend ? p1.localeCompare(p2) : p2.localeCompare(p1)
    })
    // console.log(`sortType=${sortType};ascend=${ascend};sorted=`, sorted)
    // array/object need reset to deep clone
    return [...sorted]
})
const filterTypeAtom = atom('all')
const uploadAtom = atom({})
const uploadCountAtom = atom(0)
const inputAtom = atom([])
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
    pendingAtom,
    inputAtom,
}
