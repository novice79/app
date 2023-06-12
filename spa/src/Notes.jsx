import {useState, useRef} from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from "react-router-dom";
import { noteAtom, currentNoteAtom } from './atom'
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

import { Menu } from '@mui/icons-material';
import util from "./util";


export default function Notes() {
    const [ note ] = useAtom(noteAtom)
    const [ , setCurrentBook ] = useAtom(currentNoteAtom)
    const [multiSel, setMultiSel] = useState(false);
    const navigate = useNavigate()
    
    const listItems = note.map( n =>
        <Box key={`${n.id}`}
        onClick={e=>{
            setCurrentBook(n)
            navigate("/view");
        }}
        sx={{ 
            border: '3px outset', cursor: 'pointer', display: 'flex', flexDirection: 'column',
            position: 'relative', margin: '.4rem', width: '200px', 
            // maxHeight: '250px', overflow: 'auto'
        }}>
            <div style={{borderBottom: '1px dotted black'}}>
            <ReactMarkdown
                linkTarget={'_blank'}
                children={n.content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
            />
            </div>
            <div style={{}}>
                {n.time}
            </div>
        </Box>

    );
    return (
        <Box id='content' sx={{ 
            width: '100%', pt: '4.1rem',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'
        }}>
            {listItems}
           
        </Box>
    );
}
