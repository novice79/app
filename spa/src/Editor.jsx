import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import Box from '@mui/material/Box';
import { ArrowBack, Done, Store } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { noteAtom, currentNoteAtom } from './atom'
import {Toolbar} from './style'
import util from "./util";
import ConfirmDialog from './ConfirmDialog'

export default function Editor() {
  const [ notes ] = useAtom(noteAtom)
  const [ currentNote, setCurrentNote ] = useAtom(currentNoteAtom)
  const [content, setContent] = useState(currentNote && currentNote.content || '')
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [changed, setChanged] = useState(false)
  useEffect(() => {

  }, []);
  function saveNote(e, cb){
    if(!changed) return
    const data = {content}
    if(currentNote) data.id = currentNote.id
    util.post_data(getUrl('/save'), JSON.stringify(data), {"Content-Type": "application/json"})
    .then((res) => res.text())
    .then(id => {
      setCurrentNote({
        id: currentNote ? currentNote.id : id,
        content
      })
      setChanged(false)
      cb && cb()
    })
    .catch((err) => console.log('error', err))
  }
  return (
    <>
      <Box sx={{...Toolbar}}>
        <div style={{padding: '0 1rem', cursor: 'pointer'}} 
          onClick={()=>{
            if(changed){
              setOpen(true)
            } else{
              navigate('/view')
            }           
          }}>
          <ArrowBack />
        </div>
        
        <Box sx={{marginLeft: 'auto', display: 'flex'}}>
        <div style={{padding: '0 1.5rem 0', cursor: 'pointer'}} 
          onClick={saveNote}>
          <Done sx={{color: `${changed ? 'green': 'grey'}`}}/>
        </div>
        <div style={{padding: '0 2rem 0 .5rem', cursor: 'pointer'}} onClick={()=>navigate('/')}>
          <Store />
        </div>

        
        </Box>
        
      </Box>
      <Box id={'content'} sx={{position: 'fixed', top: '3rem', backgroundColor: 'grey',
        width: '100%', height: 'calc(100vh - 3rem)', overflow: 'auto'}}>
        <textarea style={{width: '100%', height: '99.5%', fontSize: '1.5em'}}
        value={content}
        onChange={e=>{
          if(!e.target.value) return
          setContent(e.target.value)
          setChanged(true)
        }}
        />
      </Box>
      <ConfirmDialog open={open}
        title={t("not-saved")} content={t("leave-msg")}
        okCB={() => {
          navigate('/view')
        }} cancelCB={()=>setOpen(false)}/>
    </>
  );
}