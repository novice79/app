import { useState } from 'react'
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Download, Delete, DriveFileMove, FolderZip, Archive, Unarchive } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai'
import { fileToBeMovedAtom } from '../atom'
import util from "../util";
export default function FileMenu({ name, time, path, type, size, delCB }) {
    const { t, i18n } = useTranslation();
    const [ fileToBeMoved, setFileToBeMoved ] = useAtom(fileToBeMovedAtom)
    return (
        <Paper sx={{ position: 'absolute', right: "1rem", zIndex: 2 }}>
            <MenuList dense>
                <MenuItem dense={true} divider={false} onClick={() => {
                    let url = util.get_store_path(path)
                    if (import.meta.env.DEV) url = debugUrl + url
                    const a = document.createElement('a')
                    a.href = url
                    a.download = url.split('/').pop()
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                }}>
                    <ListItemIcon>
                        <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
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
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <Archive fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Unarchive fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Unarchive</ListItemText>
                </MenuItem>
            </MenuList>
        </Paper>
    );
}