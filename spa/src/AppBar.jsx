import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import { Store, Upload, List, GetApp } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useAtom } from 'jotai'
import { isListAtom, uploadAtom, uploadCountAtom } from './atom'
import SearchBar from './SearchBar'
import _ from 'lodash'
import util from "./util";
export default function IconAppBar() {
  const [appUrl, setAppUrl] = useState("");
  const inputFileRef = useRef( null );
  const [ isList, setIsList ] = useAtom(isListAtom)
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
    util.post_data(import.meta.env.DEV? `${debugUrl}/app_url`:'/app_url')
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
    <Box sx={{
      bgcolor: '#222', height: '3rem', color: 'white',
      display: 'flex', alignItems: 'center',
      position: 'fixed', width: '100%', zIndex: 9
      }}>
        {appUrl 
          && 
          <a href={appUrl} style={{display: 'block'}}
            download={util.get_name_from_path(appUrl)}
            target="_blank" rel="noopener noreferrer">
              <GetApp  size="large" sx={{ transform: 'translateY(14%)', color: 'white', m: 1 }}/>
          </a>
          || 
          <Store sx={{ fontSize: '2.5rem', pr : 1.7 }} />
        }
        
        <SearchBar/>
        <Box sx={{ 
          flexGrow: 1, mr: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}
          onClick={()=>{
            setIsList(l=> !l)
          }}
        >
          <List sx={ isList && {
            border: '3px inset',
            backgroundColor: 'grey'
          } || {cursor: 'pointer'}} size="large"/>
        </Box>
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
          accept=".epub"
          ref={inputFileRef} 
          onChange={processFile}
          hidden
        />
    </Box>
  );
}