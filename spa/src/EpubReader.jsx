import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { BookAtom, currentBookAtom } from './atom'
import Reader from './epub/Reader'
export default function EpubReader() {
  const [ currentBook, setCurrentBook ] = useAtom(currentBookAtom)
  const [ books ] = useAtom(BookAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if(!currentBook) return;
    setCurrentBook(books.find(
      b => b.title === currentBook.title 
        && b.author === currentBook.author))
  }, [books]);
  return (
    <>
      {
        currentBook ?
        <div style={{ height: '100vh' }}>
          <Reader 
            currentBook={currentBook} 
            backClicked={()=>navigate('/')}
          />
        </div>
        :<Navigate to='/' />
      }
    </>
  );
}