import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import { NoteAdd, Upload, GetApp } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useAtom } from 'jotai'
import { Navigate, useNavigate } from 'react-router-dom';
import { currentNoteAtom, uploadAtom, uploadCountAtom } from './atom'
import SearchBar from './SearchBar'
import _ from 'lodash'
import util from "./util";
import {Toolbar} from './style'
export default function IconAppBar() {
  const [appUrl, setAppUrl] = useState("");
  const [, setCurrentNote] = useAtom(currentNoteAtom)
  const navigate = useNavigate()
  const inputFileRef = useRef( null );
  const [ upload, setUpload ] = useAtom(uploadAtom)
  const [ count, setCount ] = useAtom(uploadCountAtom)
  let url = '/upload';
  if( import.meta.env.DEV ) {
    url = `${debugUrl}/upload`;
    // console.log(`[IconAppBar] app is running in development mode`)
  } else {
    // console.log(`[IconAppBar] app is running in production mode`)
  }
  useEffect(() => {
    if(count == 0) setUpload({})
  }, [count]);
  useEffect(() => {
    util.post_data(getUrl('/app_url'))
    .then((res) => res.text())
    .then(url => {
      // console.log(url)
      setAppUrl(url)
    })
    .catch((err) => console.log('error', err))
  }, []);
  function processFile(e){
    if (e.target.files.length == 0) return;
    setCount(e.target.files.length)
    // console.log(`111 : e.target.files.length=${e.target.files.length}`)
    // console.log(`111 : count=${count}`)
    _.each(e.target.files, f => {
      // console.log('in _.each, f=', f)
      setUpload(o=>{return {...o,[f.name]:{ progress: "0%", size: f.size, name: f.name }}});
      util.upload_file(f, (f, percent)=>{
        // console.log(`${f.name}:${percent}%`)
        setUpload(o=>{
          if( !(o && o[f.name]) ) return;
          o[f.name].progress = `${percent}%`
          return {...o}
        });
      }, f=>{
        setCount(cnt=> cnt - 1)
      }, url);
    });
    e.target.files = null
  }
  return (
    <Box sx={{...Toolbar}}>
        {appUrl 
          && 
          <a href={appUrl} style={{display: 'block'}}
            download={util.get_name_from_path(appUrl)}
            target="_blank" rel="noopener noreferrer">
              <GetApp  size="large" sx={{ transform: 'translateY(14%)', color: 'white', m: 1 }}/>
          </a>
        }
        
        <Box sx={{ 
          flexGrow: 1, margin: '.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}
          onClick={()=>{

          }}
        >
          <SearchBar />
        </Box>
        <NoteAdd sx={{mr: 2}} onClick={()=>{
          setCurrentNote(null)
          navigate('/edit')
        }}/>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          // sx={{ mr: 1.5 }}
          onClick={()=>{
            inputFileRef.current.click();
          }}
        >
          <Upload/>
        </IconButton>
        
        <input type="file" multiple
          ref={inputFileRef} 
          onChange={processFile}
          hidden
        />
    </Box>
  );
}