import {useState, useRef} from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from "react-router-dom";
import { notesAtom, currentNoteAtom } from './atom'
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

import { Menu } from '@mui/icons-material';
import util from "./util";


export default function Notes() {
    const [ notes ] = useAtom(notesAtom)
    const [ , setCurrentNote ] = useAtom(currentNoteAtom)
    const [multiSel, setMultiSel] = useState(false);
    const navigate = useNavigate()
    
    const listItems = notes.map( n =>
        <Box key={`${n.id}`}
        onClick={e=>{
            util.post_data(getUrl('/get'), n.id)
            .then((res) => res.json())
            .then(n => {
              setCurrentNote(n)
              navigate("/view");
            })
            .catch((err) => {
                console.log('error', err)
                navigate("/");
            })           
        }}
        sx={{ 
            border: '3px outset', cursor: 'pointer', display: 'flex', flexDirection: 'column',
            margin: '.4rem', width: '200px', height: 'auto'
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
            width: '100%', pt: '4.1rem', alignItems: 'flex-start',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'
        }}>
            {listItems}
           
        </Box>
    );
}
