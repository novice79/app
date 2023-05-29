import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAtom } from 'jotai'
import { inputAtom } from './atom'
export default function InputDialog() {
  const [ input, setInput ] = useAtom(inputAtom)
  const [value, setValue] = useState('');
  if(input.length == 0) return <></>
  const [title, label, text, handleOk] = [...input]
  function handleClose(){
    setInput([])
    setValue('')
  }
  return (
    <div>
      <Dialog open={input.length > 0} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}            
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="value"
            label={label}
            fullWidth
            variant="standard"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>{
            handleOk(value)
            handleClose()
          }}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}