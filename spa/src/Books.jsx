import React from 'react'
import { useAtom } from 'jotai'
import { BookAtom, filterAtom } from './atom'
import Box from '@mui/material/Box';
import { Download, Delete } from '@mui/icons-material';
import util from "./util";
import { Book, Rendition } from 'epubjs';

export default function Books() {
    const [ books] = useAtom(BookAtom)
    const [ filterTxt ] = useAtom(filterAtom)
    const listItems = books
        .filter(b=>filterTxt? b.title.includes(filterTxt) && b : b)
        .map( fi =>
        <React.Fragment key={fi.title}>
            <Box sx={{ 
                width: '100%', 
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                backgroundColor: 'rgb(177, 250, 250)',
                border: '.3rem groove',
                marginTop: '.4rem' }}>
                <Box sx={{ width: '40%',}}><img src={fi.cover}></img></Box>
                <Box sx={{ width: '20%', overflowWrap: 'break-word' }}>{fi.title}</Box>
                <Box sx={{ width: '20%', overflowWrap: 'break-word' }}>{fi.author}</Box>
                <Box sx={{ width: '20%', overflowWrap: 'break-word' }}>{fi.publisher}</Box>
            </Box>
        </React.Fragment>
    );
    return (
        <Box sx={{ width: '100%', marginTop: '4.1rem'}}>
            {listItems}
        </Box>
    );
}
