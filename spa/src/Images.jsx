import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { sortedFileAtom } from './atom'
import Box from '@mui/material/Box';

// import FileItem from './Item/File';
import util from "./util";
import _ from 'lodash'
import ImageItem from './Item/Image'
import { useTranslation } from 'react-i18next';
import Draggabilly from 'draggabilly'

export default function Audio() {

    const [ sortedFile ] = useAtom(sortedFileAtom)

    const { t, i18n } = useTranslation();
    return (
        <Box id='content' sx={{ width: '100%', position: 'fixed', top: '6rem', 
            height: 'calc(100vh - 6rem)', overflow: 'auto'
        }} >
        {
            sortedFile
            .filter(fi=>fi.type.includes('image/'))
            .map( fi =><ImageItem key={fi.path} {...fi} /> )
        }
            
        </Box>
    );
}
