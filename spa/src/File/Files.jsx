import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { fileAtom } from '../atom'
import Box from '@mui/material/Box';

import FileItem from './Item';
import TypeSelect from './TypeSelect';
import util from "../util";
import _ from 'lodash'
import { useTranslation } from 'react-i18next';
import Drag from '../Drag'

export default function Files({insertText}) {
    const [files] = useAtom(fileAtom)
    const [type, setType] = useState('all');
    const selFiles = useMemo(() => files.filter(fi => 
        type == 'all' || fi.type.includes(`${type}/`)), 
        [files, type])
    const { t } = useTranslation();

    useEffect(() => {
        const draggie = new Drag('#movable', {
            containment: '#content',
            handle: '#handle',
        });
        return () => draggie.dispose()
    }, [])
    const listItems = selFiles.map(fi =>
        <React.Fragment key={fi.path}>
            <FileItem {...fi} insertText={insertText}/>
        </React.Fragment>
    );

    return (
        <Box id='movable' sx={{
            position: 'fixed', fontSize: '1rem', borderRadius: '.5rem',
            top: '30%', left: '30%', height: '60vh', 
            overflow: 'auto'
        }}>
            <Box id="handle" sx={{
                display: 'flex',
                alignItems: 'center',
                height: '3.5rem',
                padding: '0 1em',
                color: 'white',
                backgroundColor: '#ddd',
                textAlign: 'left',
                // fontSize: '0.8rem',
                opacity: '0.79',
                cursor: 'pointer'
            }} >
                <TypeSelect type={type} setType={setType}/>
                <div style={{marginLeft: 'auto'}}>
                &nbsp;&nbsp;
                    <b style={{ color: 'red' }}>{t("Drag this title to move")}</b>
                </div>
            </Box>
            <div style={{
                height: 'calc(60vh - 3.5rem)', 
                overflow: 'auto'}}>
                {listItems}
            </div>
        </Box>
    );
}
