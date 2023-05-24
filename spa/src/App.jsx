import { useState, useEffect, useRef } from 'react'
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import AppBar from './AppBar'
import PosBar from './PosBar'
import Files from './Files'

import _ from 'lodash'
import { useAtom } from 'jotai'
import { fileAtom, uploadAtom, uploadCountAtom, dirStrAtom } from './atom'
import './App.css'
import util from "./util";
import WS from "./ws";

function progress_cap(f) {
  return `${util.truncate(f.name)}${util.formatFileSize(f.size)}`
}

function App() {
  const [, setFile] = useAtom(fileAtom)
  const [ dirStr ] = useAtom(dirStrAtom)
  const [upload] = useAtom(uploadAtom)
  const [count] = useAtom(uploadCountAtom)
  const [lng, setLng] = useState(navigator.language);
  const [changed, setChanged] = useState('');
  const { t } = useTranslation();

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
    (async ()=>{
      console.log(`ws or dir changed trigger; curDir=${dirStr}`)
      setFile(await util.get_files(dirStr) )
    })()
  }, [changed, dirStr]);
  useEffect(() => {
    util.get_files().then( files=>setFile(files) )
    const ws = new WS( '/store', async msg=>{
      // console.log(`ws on_message, msg=${msg}; curDir=${dirStr}`)
      setChanged(`${Date.now()}`)
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
    <Box sx={{backgroundColor: 'white', minHeight: '100vh'}}>
      <PosBar/>
      <AppBar />
      {
        {
          'files': <Files />,
          // 'audio': <Audio />
        }['files']
      }
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
