import { useState } from 'react'
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import { Download, Delete, DriveFileMove, FolderZip, 
    Archive, Unarchive, DriveFileRenameOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai'
import { fileToBeMovedAtom, pendingAtom, inputAtom } from '../atom'
import util from "../util";

export default function FileMenu({ name, time, path, type, size, delCB }) {
    const { t, i18n } = useTranslation();
    const [ fileToBeMoved, setFileToBeMoved ] = useAtom(fileToBeMovedAtom)
    const [ , setPending ] = useAtom(pendingAtom)
    const [ , setInput ] = useAtom(inputAtom)

    function handleRename(new_name) {
        const data = {
            path,
            new_name
        }
        setPending(true)
        util.post_data(getUrl('/rename'), JSON.stringify(data))
        .then(res=>setPending(false))
    }
    return (
        <Paper sx={{ position: 'absolute', right: "1rem", zIndex: 2 }}>
            <MenuList dense>
                {type != 'dir' &&
                <MenuItem onClick={() => {
                    const url = getUrl(util.get_store_path(path))
                    util.download(url)
                }}>
                    <ListItemIcon>
                        <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                </MenuItem>
                }
                <MenuItem onClick={()=>setInput(['Rename', "New Name", name, handleRename])}>
                    <ListItemIcon>
                        <DriveFileRenameOutline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    delCB(name, path)
                }}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    setFileToBeMoved([path])
                }}>
                    <ListItemIcon>
                        <DriveFileMove fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Move</ListItemText>
                </MenuItem>
                {(type == 'dir' || util.is_zip_file(type)) &&<Divider />}
                {type == 'dir' &&
                <MenuItem onClick={()=>{
                    setPending(true)
                    util.post_data(getUrl('/zip'), path)
                    .then(res=>setPending(false))}
                }>
                    <ListItemIcon>
                        <Archive fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive</ListItemText>
                </MenuItem>
                }
                { util.is_zip_file(type) &&
                <MenuItem  onClick={()=>{
                    setPending(true)
                    util.post_data(getUrl('/unzip'), path)
                    .then(res=>setPending(false))}
                }>
                    <ListItemIcon>
                        <Unarchive fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Unarchive</ListItemText>
                </MenuItem>
                }
            </MenuList>

        </Paper>
    );
}