import { useState, useEffect, useRef } from 'react'
import { Folder, Image, Audiotrack, OndemandVideo, InsertDriveFile,
    MoreVert, Download, Delete, CreateNewFolder } 
from '@mui/icons-material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import util from "../util";
import FileMenu from './FileMenu'
function ItemIcon({type}) {
    if(type == 'dir') return <Folder/>
    if(type.includes('image/')) return <Image/>
    if(type.includes('audio/')) return <Audiotrack/>
    if(type.includes('video/')) return <OndemandVideo/>
    return <InsertDriveFile/>
}
let orig = false
export default function FileItem(props) {
    const { name, time, path, type, size, ext, open, setOpenMenuId, delCB } = props;
    
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
            <div style={{flex: 1, margin: '0 0.4em'}}>
                <div style={{wordBreak: 'break-all'}}>{name}</div>
                <div style={{display: 'flex', fontSize: '0.7rem'}}>
                    <div>{time}</div>
                    {type != 'dir' && <div style={{marginLeft: 'auto'}}>{util.formatFileSize(size)}</div>}
                </div>
            </div>
            <div style={{position: 'relative'}} onClick={()=>setOpenMenuId(path)}>
                <div style={{
                    fontSize: '1.7em', 
                    margin: '0.1em 0.5em',
                    cursor: 'pointer'
                }}>&#8942;</div>
                {open && <FileMenu {...props}/>}
            </div>
        </Box>
    )
}