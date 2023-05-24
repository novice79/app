import React from 'react'
import { useState } from 'react'
import { useAtom } from 'jotai'
import { fileAtom, ascendAtom, sortTypeAtom } from './atom'
import Box from '@mui/material/Box';
import { Download, Delete } from '@mui/icons-material';
import DeleteDialog from './DeleteDialog'
import FileItem from './Item/File';
import util from "./util";
import { useTranslation } from 'react-i18next';

export default function Files() {
    const [ files, setFile ] = useAtom(fileAtom)
    const [ ascend ] = useAtom(ascendAtom)
    const [ sortType ] = useAtom(sortTypeAtom)
    const [id, setId] = useState('');
    const [delOpen, setDelOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [filePath, setFilePath] = useState('');
    const { t, i18n } = useTranslation();
    const listItems = files
        // .filter(fi=>filterTxt? fi.name.includes(filterTxt) && fi : fi)
        .sort((a,b)=>{
            // console.log('a=',a)
            // console.log('b=',b)
            const p1 = sortType == 'size' ? parseInt(a[sortType]) : a[sortType]
            const p2 = sortType == 'size' ? parseInt(b[sortType]) : b[sortType]
            return ascend ? p1 > p2 : p1 < p2
        })
        .map( fi =>
        <React.Fragment key={fi.path}>
            <FileItem {...fi} open={fi.path == id} 
            setOpenMenuId={filePath=>{
                id == filePath ? setId(''): setId(filePath)
            }}
            delCB={(name, path)=>{
                setFileName(name)
                setFilePath(path)
                setDelOpen(true)
            }}
            />
        </React.Fragment>
    );
    // setId(`${Date.now()}`)
    return (
        <Box sx={{ width: '100%', position: 'fixed', top: '6rem', 
            height: 'calc(100vh - 6rem)', overflow: 'auto'
        }} onClick={e=>{
            // console.log(e.target.getAttribute("style").includes('cursor: pointer'))
            const s = e.target.getAttribute("style")
            s && s.includes('cursor: pointer') || setId('')
        }}>
            {listItems}
            <DeleteDialog title={t("you-sure")} content={fileName} open={delOpen}
                handleClose={()=>setDelOpen(false)}
                okCB={()=>{
                    const url = getUrl('/del')
                    util.post_data(url, JSON.stringify([filePath]), 
                    {'Content-Type': 'application/json'} );
            }}/>
        </Box>
    );
}
