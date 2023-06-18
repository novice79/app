import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import Box from '@mui/material/Box';
import { ArrowBack, Done, Store, ClearAll } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { noteAtom, currentNoteAtom } from './atom'
import { Toolbar } from './style'
import util from "./util";
import Files from "./File/Files";
import ConfirmDialog from './ConfirmDialog'

export default function Editor() {
  const [notes] = useAtom(noteAtom)
  const [currentNote, setCurrentNote] = useAtom(currentNoteAtom)
  const [content, setContent] = useState(currentNote && currentNote.content || '')
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState(false);
  const [ctrl_s, setCtrl_s] = useState('');
  const taRef = useRef();
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [changed, setChanged] = useState(false)
  useEffect(() => {
    saveNote()
  }, [ctrl_s]);
  const keydownHandler = (e) => {
    // console.log(e)
    if(e.key === 's' && e.ctrlKey) {
      // console.log('ctrl+s')
      setCtrl_s(`${Date.now()}`)
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => document.removeEventListener('keydown', keydownHandler);
  }, []);
  function insertText(txt) {
    const selectionStart = taRef.current.selectionStart;
    const selectionEnd = taRef.current.selectionEnd;

    const newValue = content.substring(0, selectionStart) 
                  + txt 
                  + content.substring(selectionEnd, content.length);
    setContent(newValue);
    setChanged(true)
  }
  function saveNote(e, cb) {
    if (!changed) return
    const data = { content }
    if (currentNote) data.id = currentNote.id
    // console.log(`saveNote, data=`, data)
    util.post_data(getUrl('/save'), JSON.stringify(data), { "Content-Type": "application/json" })
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
      <Box sx={{ ...Toolbar }}>
        <div style={{ padding: '0 1rem', cursor: 'pointer' }}
          onClick={() => {
            if (changed) {
              setOpen(true)
            } else {
              navigate('/view')
            }
          }}>
          <ArrowBack />
        </div>

        <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
          <div style={{ padding: '0 1.0rem 0', cursor: 'pointer' }}
            onClick={() => setContent('')}>
            <ClearAll />
          </div>
          <div style={{ padding: '0 1.0rem 0', cursor: 'pointer' }}
            onClick={saveNote}>
            <Done sx={{ color: `${changed ? 'green' : 'grey'}` }} />
          </div>
          <div style={{ padding: '0 1rem 0 .5rem', cursor: 'pointer' }} onClick={() => setStore(p => !p)}>
            <Store />
          </div>


        </Box>

      </Box>
      <Box id={'content'} sx={{
        position: 'fixed', top: '3rem', backgroundColor: 'grey',
        width: '100%', height: 'calc(100vh - 3rem)', overflow: 'auto'
      }}>
        <textarea ref={taRef}
          onDragOver={e=>{e.preventDefault();e.stopPropagation()}}
          onDrop={e=>{
            e.preventDefault()
            e.stopPropagation()
            const data = e.dataTransfer.getData("text")
            // console.log(`onDrop, data=${data}`)
            insertText(data)
          }}
          style={{ width: '100%', height: '99%', fontSize: '1.5em' }}
          value={content}
          onChange={e => {            
            if(currentNote){
              if(currentNote.content == e.target.value) return
            } else{
              if (!e.target.value) return
            }
            setContent(e.target.value)
            setChanged(true)
          }}
        />
      </Box>
      {
        store && <Files insertText={insertText} />
      }
      <ConfirmDialog open={open}
        title={t("not-saved")} content={t("leave-msg")}
        okCB={() => {
          navigate('/view')
        }} cancelCB={() => setOpen(false)} />
    </>
  );
}