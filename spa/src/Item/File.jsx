import { Folder, Image, Audiotrack, OndemandVideo, InsertDriveFile,
    MoreVert, Download, Delete, CreateNewFolder } 
from '@mui/icons-material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
function ItemIcon(type) {
    if(type == 'dir') return <Folder/>
    if(type.includes('image/')) return <Image/>
    if(type.includes('audio/')) return <Audiotrack/>
    if(type.includes('video/')) return <OndemandVideo/>
    return <InsertDriveFile/>
}
export default function FileItem(props) {
    const { name, time, path, type, size, ext } = props;
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            
        </>
    )
}