import { useState, useEffect, useRef } from 'react'
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import AppBar from './AppBar'
import Files from './Files'
import Books from './Books'
import _ from 'lodash'
import { useAtom } from 'jotai'
import { isListAtom, fileAtom, uploadAtom, uploadCountAtom } from './atom'
import './App.css'
import util from "./util";
import handle_epub from "./EpubInfo";

let ws;
function ws_uri() {
  let loc = window.location, ws_uri, h = loc.host;
  if (loc.protocol === "https:") {
    ws_uri = "wss:";
  } else if (loc.protocol === "http:") {
    ws_uri = "ws:";
  } else {
    ws_uri = "ws:";
    h = `localhost:7777`;
  }
  if (import.meta.env.DEV) {
    h = `192.168.0.60:7777`;
    // console.log(`[ws_uri] app is running in development mode`)
  } else {
    // console.log(`[ws_uri] app is running in production mode`)
  }

  ws_uri += "//" + h + "/store";
  console.log(ws_uri)
  return ws_uri;
}
function progress_cap(f) {
  return `${util.truncate(f.name)}${util.formatFileSize(f.size)}`
}

function App() {
  const [, setFile] = useAtom(fileAtom)
  const [isList] = useAtom(isListAtom)
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
  function ws_connect(){
    ws = new WebSocket(ws_uri());
    ws.onmessage = function (event) {
      try {
        // console.log('recieved data from ws')
        const data = JSON.parse(event.data)
        // console.log(data)
        handle_epub(data)
        setFile(data)
      } catch (err) {
        console.log(err, event.data)
      }
    };
    ws.onclose = ()=>setTimeout(ws_connect, 100)
  }
  useEffect(() => {
    ws_connect()
    //clean up function
    return () => ws.close();
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
      {isList ? <Files /> : <Books />}
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
