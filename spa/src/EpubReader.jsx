import { Navigate, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai'
import { currentBookAtom } from './atom'
import Reader from './epub/Reader'
export default function EpubReader() {
  const [ currentBook ] = useAtom(currentBookAtom)
  const navigate = useNavigate()
  if (!currentBook) {
    return <Navigate to='/' />
  }
  return (
    <>
      <div style={{ height: '100vh' }}>
        <Reader 
          currentBook={currentBook} 
          backClicked={()=>navigate('/')}
        />
      </div>
    </>
  );
}