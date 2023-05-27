import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
export default function DeleteDialog(props) {
    const { open, handleClose, title, content, okCB } = props;
    const { t, i18n } = useTranslation();
    // useEffect(() => {
    //     console.log(`open=${open}`)
    //   }, [open]);
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent dividers={false}>
                    {
                        content && content.map(i=>
                            <div key={i}>{i}</div>
                        )
                    }
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