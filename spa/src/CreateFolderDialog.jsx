import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAtom } from 'jotai'
import { dirStrAtom } from './atom'
export default function CreateFolderDialog({open, handleClose, handleCreate}) {
  const [ dirStr ] = useAtom(dirStrAtom)
  const [name, setName] = useState('');
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Current Directory:             
          </DialogContentText>
          <div style={{overflow: 'auto'}}>{dirStr}</div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Folder Name"
            fullWidth
            variant="standard"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>handleCreate(name)}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}