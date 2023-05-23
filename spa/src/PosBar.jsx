import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import { Store, CreateNewFolder, KeyboardBackspace } from '@mui/icons-material';

import { useAtom } from 'jotai'
import { dirAtom, dirStrAtom } from './atom'

import _ from 'lodash'
import util from "./util";
import CreateFolderDialog from "./CreateFolderDialog";
export default function PosBar() {
  const [ dir, setDir ] = useAtom(dirAtom)
  const [ dirStr ] = useAtom(dirStrAtom)
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{
      bgcolor: 'rgb(177, 250, 250)', height: '2.5rem', color: 'black',
      display: 'flex', alignItems: 'center', 
      position: 'fixed', width: '100%', zIndex: 4
      }}>
        <Store sx={{ fontSize: '2.5rem', pr : 1.7 }} />
        

        <Box sx={{ flexGrow: 1, overflow: 'auto'}}>
        {dirStr}
        </Box>
        <KeyboardBackspace sx={{mr: '1rem'}}/>
        <CreateNewFolder sx={{mr: '1rem'}} onClick={e=>setOpen(true)}/>
        <CreateFolderDialog open={open} handleClose={handleClose}/>
    </Box>
  );
}