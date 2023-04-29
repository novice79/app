import React from 'react'
import { useAtom } from 'jotai'
import { fileAtom, filterAtom } from './atom'
import Box from '@mui/material/Box';
import { Download, Delete } from '@mui/icons-material';
import DeleteDialog from './DeleteDialog'
import util from "./util";
import { useTranslation } from 'react-i18next';

export default function Files() {
    const [ files, setFile ] = useAtom(fileAtom)
    const [ filterTxt, setFilterTxt ] = useAtom(filterAtom)
    const { t, i18n } = useTranslation();
    const listItems = files
        .filter(fi=>filterTxt? fi.name.includes(filterTxt) && fi : fi)
        .map( fi =>
        <React.Fragment key={fi.name}>
            <Box sx={{ 
                width: '100%', 
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                backgroundColor: 'rgb(177, 250, 250)',
                border: '.3rem groove',
                marginTop: '.4rem' }}>
                <Box sx={{ width: '60%', overflowWrap: 'break-word' }}>{fi.name}</Box>
                <Box sx={{ width: '20%', overflowWrap: 'break-word' }}>{util.formatFileSize(fi.size)}</Box>
                <Box sx={{ 
                    width: '20%',
                    display: 'flex', 
                    justifyContent: 'flex-end'
                    }}>
                    <a href={import.meta.env.DEV? 
                        `http://192.168.0.60:8888/store/${fi.name}` 
                        :`/store/${fi.name}`} download={fi.name}
                        target="_blank" rel="noopener noreferrer"><Download sx={{ mr: 1 }}/></a>
                    <DeleteDialog title={t("you-sure")} content={fi.name} 
                        okCB={()=>{
                            const url = import.meta.env.DEV? 
                            `http://192.168.0.60:8888/del` 
                            :`/del`
                            util.post_data(url, fi.path);
                    }}/>
       
                </Box>
            </Box>
        </React.Fragment>
    );
    return (
        <Box sx={{ width: '100%', pt: '3rem'}}>
            {listItems}
        </Box>
    );
}
