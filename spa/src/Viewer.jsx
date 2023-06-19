import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import Box from '@mui/material/Box';
import { ArrowBack, DeleteForever, Edit, Fullscreen } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { useTranslation } from 'react-i18next';
import { noteAtom, currentNoteAtom } from './atom'
import { Toolbar } from './style'
import ConfirmDialog from './ConfirmDialog'
import util from "./util";
function exitFullscreen(e){
  switch (e.detail) {
    case 1: {
      // console.log('single click');
      break;
    }
    case 2: {
      // console.log('double click');
      util.exitFullscreen()
      break;
    }
    case 3: {
      // console.log('triple click');
      break;
    }
    default: {
      break;
    }
  }
}
export default function Viewer() {
  const [notes] = useAtom(noteAtom)
  const viewerRef = useRef( null );
  const [currentNote, setCurrentNote] = useAtom(currentNoteAtom)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.onfullscreenchange = (event) => {
      if (document.fullscreenElement) {
        // console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`);
        setFullscreen(true)
      } else {
        setFullscreen(false)
        console.log("Leaving fullscreen mode.");
      }
    }
    return ()=>document.onfullscreenchange = null
  }, []);
  useEffect(() => {
    if(!currentNote) return;
    // console.log(currentNote)
    // console.log(notes)
    const n = notes.find( n => n.id == currentNote.id )
    if(n){
      util.post_data(getUrl('/get'), n.id)
        .then((res) => res.json())
        .then(n => {
            setCurrentNote(n)
        })
        .catch((err) => {
            console.log('error', err)
            navigate("/");
        })
    }else{
      setCurrentNote(null)
    }
    
  }, [notes]);
  if (!currentNote) return <Navigate to='/' />
  return (
    <>
      <Box sx={{ ...Toolbar, display: `${fullscreen ? 'none' : 'flex'}` }}>
        <div style={{ padding: '0 1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ArrowBack />
        </div>

        <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
        
          <div style={{ padding: '0 1.0rem 0 .5rem', cursor: 'pointer' }} 
            onClick={() => util.enterFullscreen(viewerRef.current)}>
            <Fullscreen />
          </div>
          <div style={{ padding: '0 1.0rem 0 .5rem', cursor: 'pointer' }} onClick={() => navigate('/edit')}>
            <Edit />
          </div>
          <div style={{ padding: '0 1.0rem 0 .5rem', cursor: 'pointer' }} onClick={() => setOpen(true)}>
            <DeleteForever/>
          </div>
        </Box>

      </Box>
      <Box ref={viewerRef} sx={{
        position: 'fixed', top: '3rem', 
        // margin: '.5rem 1rem',
        width: '100%', height: 'calc(100vh - 3rem)', overflow: 'auto'
      }} onClick={exitFullscreen} >
        <ReactMarkdown
          linkTarget={'_blank'}
          children={currentNote.content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        />
      </Box>
      <ConfirmDialog open={open}
        title={t("you-sure")} content={currentNote.content}
        okCB={() => {
          util.post_data(getUrl('/del'), currentNote.id)
          navigate('/')
        }} cancelCB={()=>setOpen(false)}/>

    </>
  );
}