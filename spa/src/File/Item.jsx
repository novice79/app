import { useState, useEffect, useRef } from 'react'
import { Folder, Image, Audiotrack, OndemandVideo, InsertDriveFile, 
    ContentCopy, Delete }  from '@mui/icons-material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import util from "../util";
import DeleteDialog from './DeleteDialog'

function ItemIcon({type}) {
    if(type == 'dir') return <Folder sx={{ color: 'rgb(199, 173, 87)' }}/>
    if(type.includes('image/')) return <Image color="secondary" />
    if(type.includes('audio/')) return <Audiotrack color="primary" />
    if(type.includes('video/')) return <OndemandVideo color="success" />
    return <InsertDriveFile/>
}
function Preview({type, path}) {
    const props = {
        src: getUrl(util.get_store_path(path)),
        style: {
            width: '100%'
        },
        onClick: e=>e.stopPropagation()
    }
    if(type.includes('image/')) return <img {...props} />
    if(type.includes('audio/')) return <audio {...props} controls/>
    if(type.includes('video/')) return <video {...props} controls/>
    return <div/>
}

export default function FileItem(props) {
    const { name, time, path, type, size, insertText } = props;
    const [preview, setPreview] = useState(false);

    const { t } = useTranslation();
    
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'left',
            backgroundColor: 'rgb(177, 250, 250)',
            margin: '0.3em 0',
            border: '2px inset black',
            maxWidth: '100%',
          }}>

            <ItemIcon type={type}/>
            <div style={{flex: 1, margin: '0 0.4em'}} onClick={ ()=>{
                setPreview(p=>!p)
            }}>
                <div style={{wordBreak: 'break-all'}}>{name}</div>
                <div style={{display: 'flex', fontSize: '0.7rem'}}>
                    <div>{time}</div>
                    <div style={{marginLeft: 'auto'}}>{util.formatFileSize(size)}</div>
                </div>
                {preview && <Preview {...{type, path}}/>}
            </div>
            <div style={{padding: '.5rem 1rem', cursor: 'pointer', transform: 'translateY(.1rem)'}} 
                onClick={()=>{
                    // console.log(`navigator.clipboard=${navigator.clipboard}; 
                    // window.isSecureContext=${window.isSecureContext}`)
                    let content = getUrl(util.get_store_path(path))
                    content += '\r\n'
                    insertText(content)
                    // navigator.clipboard.writeText(content)
                }}>
                <ContentCopy/>
            </div>
            <DeleteDialog title={t("you-sure")} content={name} 
                okCB={()=>util.post_data(getUrl('/del_file'), path)}/>
        </Box>
    )
}