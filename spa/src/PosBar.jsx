import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import { Store, CreateNewFolder, KeyboardBackspace } from '@mui/icons-material';

import { useAtom } from 'jotai'
import { dirAtom, dirStrAtom } from './atom'

import _ from 'lodash'
import util from "./util";
import CreateFolderDialog from "./CreateFolderDialog";
import InputDialog from "./InputDialog";
export default function PosBar() {
  const [ dir, setDir ] = useAtom(dirAtom)
  const [ dirStr ] = useAtom(dirStrAtom)
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  function handleCreate(name){
    const url = getUrl('/create_dir')
    const data = `${dirStr}/${name}`
    console.log(`url=${url}; data=${data}`)
    util.post_data(url, data)
    handleClose()
  }
  return (
    <Box sx={{
      bgcolor: 'rgb(177, 250, 250)', height: '2.5rem', color: 'black',
      display: 'flex', alignItems: 'center', 
      position: 'fixed', width: '100%', zIndex: 4
      }}>
        <Store sx={{ color: '#007DCD', fontSize: '2.5rem', pr : 1.7 }} />
        <Box sx={{ flexGrow: 1, overflow: 'auto'}}>
        <b style={{color: 'purple'}}>{dirStr}</b>
        </Box>
        <KeyboardBackspace sx={{mr: '1rem', color: `${dirStr? 'green' : 'grey'}`, cursor: `${dirStr && 'pointer'}`}} 
          onClick={()=>dirStr && setDir(d=>d.pop() && [...d] || [])}/>
        <CreateNewFolder sx={{mr: '1rem', color: 'rgb(199, 173, 87)', cursor: 'pointer'}} onClick={e=>setOpen(true)}/>
        <CreateFolderDialog open={open} handleClose={handleClose} handleCreate={handleCreate}/>
        <InputDialog/>
    </Box>
  );
}