import {useState, useEffect, useMemo} from 'react';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Folder, KeyboardBackspace } from '@mui/icons-material';
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next';
import { fileToBeMovedAtom } from './atom'
import util from "./util";
export default function ToFolderDialog() {
  const [toDir, setToDir] = useState([]);
  const toDirStr = useMemo(()=>toDir.join('/'), [toDir])
  const [folders, setFolders] = useState([]);
  const { t } = useTranslation();
  const [ fileToBeMoved, setFileToBeMoved ] = useAtom(fileToBeMovedAtom)
  function handleClose(){
    console.log(`handleClose`)
    setFileToBeMoved([])
  }
  function handleMove(){
    const data = {
      to_path: toDirStr,
      files: fileToBeMoved
    }
    // console.log(data)
    util.post_data( getUrl('/move'), JSON.stringify(data) )
    handleClose()
  }
  useEffect(() => {
    console.log(`get_folders, toDir=${toDir}`)
    util.get_folders(toDirStr).then(f=>setFolders(f))
  }, [toDir]);

  return (
    <div style={{}}>
      <Dialog open={true} 
        fullWidth={true} 
        // maxWidth='md' 
        onClose={handleClose}>
        <DialogTitle sx={{display: 'flex', alignItems: 'center'}}>
          <div>{t('To')} <i style={{color: 'purple'}}>{toDirStr}</i></div>
          <KeyboardBackspace sx={{mr: '1rem', color: `${toDirStr? 'green' : 'grey'}`, marginLeft: 'auto', cursor: 'pointer'}} 
            onClick={()=>{
              toDir.pop() 
              setToDir([...toDir])
            }}/>
        </DialogTitle>
        <DialogContent>
          {folders.map(f=>
            <div key={f} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}
            onClick={()=>{
              const name = util.get_name_from_path(f)
              // console.log(`name=${name}`)
              toDir.push(name) 
              setToDir([...toDir])
            }}>
              <Folder sx={{ color: 'rgb(199, 173, 87)', mr: 1 }}/> <div>{util.get_name_from_path(f)}</div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
          <Button onClick={()=>handleMove()}>{t('Move')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}