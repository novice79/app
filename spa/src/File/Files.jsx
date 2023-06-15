import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { fileAtom } from '../atom'
import Box from '@mui/material/Box';

import FileItem from './Item';
import util from "../util";
import _ from 'lodash'
import { useTranslation } from 'react-i18next';
import Drag from '../Drag'

export default function Files() {
    const [files] = useAtom(fileAtom)
    const selFiles = useMemo(() => files.filter(fi => fi.type.includes('video/')), [files])
    const { t } = useTranslation();

    useEffect(() => {
        const draggie = new Drag('#movable', {
            containment: '#content',
            handle: '#handle',
            onClick: toggleMultiSel
        });
        return () => draggie.dispose()
    }, [])
    const listItems = selFiles.map(fi =>
        <React.Fragment key={fi.path}>
            <FileItem {...fi} />
        </React.Fragment>
    );

    return (
        <Box id='movable' sx={{
            position: 'fixed', fontSize: '2rem',
            top: '40%', left: '60%', cursor: 'pointer'
        }}>
            <Box id="handle" sx={{
                display: 'flex',
                backgroundColor: 'lightGrey', p: .5, borderRadius: '1em'
            }}>
                {listItems}
            </Box>

        </Box>
    );
}
