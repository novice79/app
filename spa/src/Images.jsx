import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { sortedFileAtom } from './atom'
import Box from '@mui/material/Box';

// import FileItem from './Item/File';
import util from "./util";
import _ from 'lodash'
import ImageItem from './Item/Image'
import { useTranslation } from 'react-i18next';
import { content } from './props';

export default function Audio() {

    const [ sortedFile ] = useAtom(sortedFileAtom)

    const { t, i18n } = useTranslation();
    return (
        <Box {...content}>
        {
            sortedFile
            .filter(fi=>fi.type.includes('image/'))
            .map( fi =><ImageItem key={fi.path} {...fi} /> )
        }
            
        </Box>
    );
}
