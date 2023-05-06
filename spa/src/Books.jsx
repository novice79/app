import React from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from "react-router-dom";
import { BookAtom, currentBookAtom, progressAtom } from './atom'
import Box from '@mui/material/Box';
import util from "./util";


export default function Books() {
    const [ books ] = useAtom(BookAtom)
    const [ progress, setProgress ] = useAtom(progressAtom)
    const [ , setCurrentBook ] = useAtom(currentBookAtom)
    const navigate = useNavigate()

    const listItems = books
        .map( fi =>
        <React.Fragment key={`${fi.title}-${fi.author}`}>
            <Box 
            onClick={e=>{
                setCurrentBook(fi)
                progress[`${fi.title}-${fi.author}`] = util.now_str()
                localStorage.setItem('progress', JSON.stringify(progress))
                setProgress(progress)
                navigate("/reader");
            }}
            sx={{ 
                border: '3px outset', cursor: 'pointer',
                position: 'relative', margin: '.4rem', maxHeight: '290px', maxWidth: '200px' 
            }}>
                <img style={{maxWidth: 200, maxHeight: 200}} src={fi.cover?fi.cover:'/cover.jpg'}></img>
                <Box sx={{ 
                    position: 'absolute', bottom: 0, textAlign: 'center', 
                    backgroundColor: 'black', color: 'white', opacity: 0.7,
                    width: '100%', height: '20%', overflowWrap: 'break-word',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    overflow: 'auto'
                }}>
                    {fi.title}
                </Box>
            </Box>
        </React.Fragment>
    );
    return (
        <Box sx={{ 
            width: '100%', pt: '4.1rem',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'
        }}>
            {listItems}
        </Box>
    );
}
