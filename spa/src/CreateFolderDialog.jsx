import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next';
import { dirStrAtom } from './atom'
export default function CreateFolderDialog({open, handleClose, handleCreate}) {
  const [ dirStr ] = useAtom(dirStrAtom)
  const [name, setName] = useState('');
  const { t } = useTranslation();
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Create New Folder')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t('Current Directory:')}            
          </DialogContentText>
          <div style={{overflow: 'auto'}}>{dirStr}</div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={t("Folder Name")}
            fullWidth
            variant="standard"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button onClick={()=>handleCreate(name)}>{t("Create")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}