import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { noteAtom, currentNoteAtom } from './atom'

export default function Viewer() {
  const [ notes ] = useAtom(noteAtom)
  const [ currentNote, setCurrentNote ] = useAtom(currentNoteAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if(!currentNote) return;
    setCurrentNote(notes.find( n => n.id === currentNote.id ))
  }, [notes]);
  return (
    <>
      {
        currentNote ?
        <div style={{ height: '100vh' }}>
          {/* <Reader 
            currentNote={currentNote} 
            backClicked={()=>navigate('/')}
          /> */}
        </div>
        :<Navigate to='/' />
      }
    </>
  );
}