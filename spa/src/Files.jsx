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
import Drag from './Drag'
import MuiAlert from '@mui/material/Alert';
import { content } from './props';
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
        setSelected({})
    }
    useEffect(unSelAll, [files])
    useEffect(()=>{
        const draggie = new Drag('#movable', {
            containment: '#content', 
            handle: '#handle',
            onClick: toggleMultiSel
        });
        return ()=>draggie.dispose()
    }, [])
    const listItems = 
        sortedFile
        .map( fi =>
        <React.Fragment key={fi.path}>
            <FileItem multiSel={multiSel} doCheck={doCheck} checked={!!selected[fi.path]}
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
        <Box {...content} onClick={e=>{
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
                position: 'fixed', fontSize: '2rem',
                top: '40%', left: '60%', cursor: 'pointer' }}>
                <Box id="handle" sx={{
                    display: 'flex',
                    backgroundColor: 'lightGrey', p: .5, borderRadius: '1em'
                }}>
                    <Menu sx={{fontSize: '1.1em', 
                        border: `${multiSel? '2px inset' : ''}`, borderRadius: '1.0em'}}/>
                </Box>
                <div style={{position: 'absolute', display: 'flex', borderRadius: '.5em',
                    left: '100%', top: '0.15em', backgroundColor: 'rgba(211,211,211, 0.7)',
                    overflow: 'hidden', width: `${multiSel? 'auto': '0'}`
                    }}>
                    <SelectAll color="black" sx={{ml: 2, fontSize: '1em'}} 
                    onClick={e=>{
                        for(const fi of sortedFile){
                            selected[fi.path] = true
                        }
                        setSelected({...selected})
                    }}/>
                    <Deselect color="black" sx={{ml: 2, mr: 1, fontSize: '1em'}}  onClick={unSelAll}/>
                </div>
                <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', borderRadius: '.5em',
                    transform: 'translate(0.15em, -4.5em)', 
                    backgroundColor: 'rgba(211,211,211, 0.7)',
                    overflow: 'hidden', height: `${multiSel? 'auto': '0'}`
                    }}>
                    <DriveFileMove color="black" sx={{mb: 2, mt: 1, fontSize: '1em'}} onClick={()=>{
                        const chosen = _.keys(selected)
                        // console.log('chosen=', chosen)
                        if(chosen.length == 0) return showMsg('No files selected')
                        setFileToBeMoved(chosen)
                        // unSelAll()
                    }}/>
                    <DeleteForever color="black" sx={{mb: 2, fontSize: '1em'}} onClick={()=>{
                        const chosen = _.keys(selected)
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
