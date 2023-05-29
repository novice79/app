import React from 'react'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { fileAtom, fileToBeMovedAtom, sortedFileAtom } from './atom'
import Box from '@mui/material/Box';
import { Menu, SelectAll, Deselect, DriveFileMove, DeleteForever } from '@mui/icons-material';
import DeleteDialog from './DeleteDialog'
import FileItem from './Item/File';
import util from "./util";
import _ from 'lodash'
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { useTranslation } from 'react-i18next';
import Draggabilly from 'draggabilly'
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Files() {
    const [ files, setFile ] = useAtom(fileAtom)
    const [ fileToBeMoved, setFileToBeMoved ] = useAtom(fileToBeMovedAtom)
    const [ sortedFile ] = useAtom(sortedFileAtom)
    const [id, setId] = useState('');
    const [delOpen, setDelOpen] = useState(false);
    const [multiSel, setMultiSel] = useState(false);
    const [fileName, setFileName] = useState('');
    const [filePath, setFilePath] = useState('');

    const [selAll, setSelAll] = useState(false);
    const [selected, setSelected] = useState({});
    const [toast, setToast] = useState(false);
    const [msg, setMsg] = useState('');
    const { t, i18n } = useTranslation();
    
    function showMsg(msg){
        setMsg(msg)
        setToast(true)
    }
    function toggleMultiSel(){
        setMultiSel(p=>!p)
    }
    function doCheck(path, checked){
        // console.log(`doCheck, path=${path}; checked=${checked}`)
        if(checked){
            selected[path] = checked
        } else {
            delete selected[path]
        }
        setSelected({...selected})
    }
    function unSelAll(){
        setSelAll(false)
        setSelected({})
    }
    useEffect(unSelAll, [files])
    useEffect(()=>{
        const draggie = new Draggabilly('#movable', {
            containment: '#content', 
            handle: '#handle'
        });
        draggie.on( 'staticClick', toggleMultiSel);
        return ()=>draggie.off( 'staticClick', toggleMultiSel)
    }, [])
    const listItems = 
        sortedFile
        .map( fi =>
        <React.Fragment key={fi.path}>
            <FileItem multiSel={multiSel} doCheck={doCheck} checked={selected[fi.path] || selAll}
            {...fi} open={fi.path == id} 
            setOpenMenuId={filePath=>{
                id == filePath ? setId(''): setId(filePath)
            }}
            delCB={(name, path)=>{
                setFileName([name])
                setFilePath([path])
                setDelOpen(true)
            }}
            />
        </React.Fragment>
    );
    // setId(`${Date.now()}`)
    return (
        <Box id='content' sx={{ width: '100%', position: 'fixed', top: '6rem', 
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
                    util.post_data(url, JSON.stringify(filePath), 
                    {'Content-Type': 'application/json'} );
                    // unSelAll()
            }}/>
            
            <Box id='movable' sx={{
                position: 'absolute', fontSize: '2rem',
                top: '40%', left: '60%', cursor: 'pointer' }}>
                <Box id="handle" sx={{
                    display: 'flex',
                    backgroundColor: 'lightGrey', p: .5, borderRadius: '1em'
                }}>
                    <Menu sx={{marginTop: 'auto', fontSize: '1em'}}/>
                </Box>
                <div style={{position: 'absolute', display: 'flex', borderRadius: '.5em',
                    left: '100%', top: '0.15em', backgroundColor: 'rgba(211,211,211, 0.7)',
                    overflow: 'hidden', width: `${multiSel? 'auto': '0'}`
                    }}>
                    <SelectAll color="black" sx={{ml: 2, fontSize: '1em'}} onClick={e=>setSelAll(true)}/>
                    <Deselect color="black" sx={{ml: 2, fontSize: '1em'}}  onClick={unSelAll}/>
                </div>
                <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', borderRadius: '.5em',
                    transform: 'translate(0.13em, -4.2em)', 
                    backgroundColor: 'rgba(211,211,211, 0.7)',
                    overflow: 'hidden', height: `${multiSel? 'auto': '0'}`
                    }}>
                    <DriveFileMove color="black" sx={{mb: 2, fontSize: '1em'}} onClick={()=>{
                        const chosen = selAll ? _.map(files, 'path') : _.keys(selected)
                        // console.log('chosen=', chosen)
                        if(chosen.length == 0) return showMsg('No files selected')
                        setFileToBeMoved(chosen)
                        // unSelAll()
                    }}/>
                    <DeleteForever color="black" sx={{mb: 2, fontSize: '1em'}} onClick={()=>{
                        const chosen = selAll ? _.map(files, 'path') : _.keys(selected)
                        if(chosen.length == 0) return showMsg('No files selected')
                        setFileName(chosen.map(p=>util.get_name_from_path(p)))
                        setFilePath(chosen)
                        setDelOpen(true)                       
                    }}/>
                </div>
            </Box>
            <Snackbar 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                open={toast}
                autoHideDuration={2000} 
                TransitionComponent={Slide}
                onClose={()=>setToast(false)}
                key={'top-center'}
            >
                <Alert severity="info" sx={{ width: '100%' }}>
                {msg}
                </Alert>
            </Snackbar>

        </Box>
    );
}
