import { useState, useEffect, useRef } from 'react'
import { Folder, Image, Audiotrack, OndemandVideo, InsertDriveFile,
    MoreVert, Download, Delete, CreateNewFolder }  from '@mui/icons-material';

import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import util from "../util";
import FileMenu from './FileMenu'
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
import { useAtom } from 'jotai'
import { fileAtom, dirAtom, dirStrAtom } from '../atom'
export default function FileItem(props) {
    const { 
        name, time, path, type, size, ext, open, setOpenMenuId, 
        delCB, multiSel, checked, doCheck 
    } = props;
    const [preview, setPreview] = useState(false);
    const [ , setFile] = useAtom(fileAtom)
    const [ , setDir ] = useAtom(dirAtom)
    const [ dirStr ] = useAtom(dirStrAtom)
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
            {multiSel && <Checkbox checked={checked} onChange={e=>doCheck(path, e.target.checked)} />}
            <ItemIcon type={type}/>
            <div style={{flex: 1, margin: '0 0.4em'}} onClick={ async ()=>{
                if(type == 'dir') {
                    setDir(d=> d.push(name) && [...d])                   
                    return
                }
                setPreview(p=>!p)
            }}>
                <div style={{wordBreak: 'break-all'}}>{name}</div>
                <div style={{display: 'flex', fontSize: '0.7rem'}}>
                    <div>{time}</div>
                    {type != 'dir' && <div style={{marginLeft: 'auto'}}>{util.formatFileSize(size)}</div>}
                </div>
                {preview && <Preview {...{type, path}}/>}
            </div>
            <div style={{position: 'relative'}} onClick={()=>setOpenMenuId(path)}>
                <div style={{
                    fontSize: '1.7em', 
                    padding: '0.1em 0.5em',
                    cursor: 'pointer'
                }}>&#8942;</div>
                {open && <FileMenu {...props}/>}
            </div>
        </Box>
    )
}