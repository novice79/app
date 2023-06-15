import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
export default function DeleteDialog(props) {
    const { sx, title, content, okCB } = props;
    const [open, setOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <DeleteIcon sx={{
                ...{ mr: 1, cursor: 'pointer' },
                ...sx
            }}
                onClick={handleClickOpen}>
            </DeleteIcon>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent dividers={false}>
                    <DialogContentText>
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('cancel')}</Button>
                    <Button onClick={()=>{
                        okCB()
                        handleClose()
                    }} autoFocus>
                        {t('yes')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}