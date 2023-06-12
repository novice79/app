import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import Box from '@mui/material/Box';
import { ArrowBack, DeleteForever, Edit } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { useTranslation } from 'react-i18next';
import { noteAtom, currentNoteAtom } from './atom'
import { Toolbar } from './style'
import DeleteDialog from './DeleteDialog'
import util from "./util";
export default function Viewer() {
  const [notes] = useAtom(noteAtom)
  const [currentNote, setCurrentNote] = useAtom(currentNoteAtom)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  if (!currentNote) return <Navigate to='/' />

  // useEffect(() => {
  //   if(!currentNote) return;
  //   setCurrentNote(notes.find( n => n.id === currentNote.id ))
  // }, [notes]);
  return (
    <>
      <Box sx={{ ...Toolbar }}>
        <div style={{ padding: '0 1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ArrowBack />
        </div>

        <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
          <div style={{ padding: '0 1.5rem 0', cursor: 'pointer' }} onClick={() => navigate('/edit')}>
            <Edit />
          </div>
          <div style={{ padding: '0 1.5rem 0', cursor: 'pointer' }} onClick={() => setOpen(true)}>
            <DeleteForever/>
          </div>
        </Box>

      </Box>
      <Box sx={{
        position: 'fixed', top: '3rem', margin: '.5rem 1rem',
        width: '100%', height: 'calc(100vh - 3rem)', overflow: 'auto'
      }} >
        <ReactMarkdown
          linkTarget={'_blank'}
          children={currentNote.content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        />
      </Box>
      <DeleteDialog open={open}
        title={t("you-sure")} content={currentNote.content}
        okCB={() => {
          util.post_data(getUrl('/del'), currentNote.id)
          navigate('/')
        }} cancelCB={()=>setOpen(false)}/>

    </>
  );
}