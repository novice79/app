import { useState, useEffect, useRef } from 'react'
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import AppBar from './AppBar'
import Books from './Notes'
import _ from 'lodash'
import { useAtom } from 'jotai'
import { noteAtom, uploadAtom, uploadCountAtom } from './atom'
import './App.css'
import util from "./util";
import WS from "./ws";


function progress_cap(f) {
  return `${util.truncate(f.name)}${util.formatFileSize(f.size)}`
}

function App() {
  const [, setFile] = useAtom(noteAtom)

  const [upload, setUpload] = useAtom(uploadAtom)
  const [count, setCount] = useAtom(uploadCountAtom)
  const [lng, setLng] = useState(navigator.language);
  const { t, i18n } = useTranslation();
  // const [count, setCount] = useState(_.size(upload));
  const uploadRef = useRef();
  uploadRef.current = upload;
  useEffect(() => {
    window.onlanguagechange = (event) => {
      const l = navigator.language.split('-')[0]
      setLng(l)
      // console.log(`l=${l}`)
    }
    return () => window.onlanguagechange = null
  }, []);
  useEffect(() => {
    document.title = t('html-title')
    // console.log(`document.title=${document.title}`)
  }, [lng]);
  
  useEffect(() => {
    const ws = new WS('/note', msg=>{
      const data = JSON.parse(msg)
      setFile(data)
    })
    //clean up function
    return ws.close;
  }, []);
  // do not use brace
  const progressBars = _.map(uploadRef.current, f =>
    <div className="progressbar" key={f.name}>
      <div style={{ width: f.progress }}></div>
      <div className="cap">{`${progress_cap(f)}(${f.progress})`}</div>
    </div>
  )
  // console.log(`progressBars=`,progressBars)
  return (
    <Box sx={{backgroundColor: 'lightgray', minHeight: '100vh'}}>
      <AppBar />
      <Books />
      <Drawer
        anchor='bottom'
        open={count > 0}
        onClose={() => {
          console.log(`count=${count}`)
        }}
      >
        <Box sx={{
          overflow: 'auto', width: '100%',
          backgroundColor: 'rgba(0, 0, 0, .25)', maxHeight: '80vh'
        }}>
          {progressBars}
        </Box>
      </Drawer>
    </Box>
  )
}

export default App
