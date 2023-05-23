import React from 'react'
import { useAtom } from 'jotai'
import { fileAtom } from './atom'
import Box from '@mui/material/Box';
import { Download, Delete } from '@mui/icons-material';
import DeleteDialog from './DeleteDialog'
import util from "./util";
import FileItem from './Item/File';
import { useTranslation } from 'react-i18next';

export default function Files() {
    const [ files, setFile ] = useAtom(fileAtom)
    const { t, i18n } = useTranslation();
    const listItems = files
        // .filter(fi=>filterTxt? fi.name.includes(filterTxt) && fi : fi)
        .map( fi =>
        <React.Fragment key={fi.path}>
            <FileItem {...fi}/>
        </React.Fragment>
    );
    return (
        <Box sx={{ width: '100%', pt: '3rem'}}>
            {listItems}
        </Box>
    );
}
