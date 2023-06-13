
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
export default function DeleteDialog(props) {
    let { open, title, content, okCB, cancelCB } = props;
    const { t } = useTranslation();
    if(content.length > 150){
        content = `${content.slice(0, 150)} ...`
    }
    return (
        <Dialog
            open={open}
            onClose={cancelCB}           
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent dividers={false} 
            // sx={{textOverflow: 'ellipsis'}}
            >
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelCB}>{t('cancel')}</Button>
                <Button onClick={() => {
                    okCB()
                    cancelCB()
                }} autoFocus>
                    {t('yes')}
                </Button>
            </DialogActions>
        </Dialog>

    )
}