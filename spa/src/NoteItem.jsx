import { useState, useRef } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from "react-router-dom";
import { currentNoteAtom } from './atom'
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import "./Note.css"
import useLongPress from "./useLongPress";
import util from "./util";


export default function NoteItem({id, content, time, onNoteLongPress}) {
    const [, setCurrentNote] = useAtom(currentNoteAtom)
    const navigate = useNavigate()

    const onNoteClick = () => {
        util.post_data(getUrl('/get'), id)
        .then((res) => res.json())
        .then(n => {
            // console.log(`id=${n.id}; content=${n.content}`)
            setCurrentNote(n)
            navigate("/view");
        })
        .catch((err) => {
            console.log('error', err)
            navigate("/");
        })
    }
    const longPressEvent = useLongPress(onNoteLongPress.bind(null, id, content), onNoteClick, {
        shouldPreventDefault: false,
        delay: 1500,
    })

    return (
        <Box 
            className="note"
            {...longPressEvent}
            sx={{
                // border: '2px outset white', 
                borderRadius: '.7rem',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                margin: '.4rem', width: '250px', height: 'auto', backgroundColor: 'var(--color-note)',
                position: 'relative',
                // p: 1,
                // maxHeight: '250px', 
                // overflow: 'hidden'
                overflowWrap: 'break-word'
            }}>
            <div style={{ borderBottom: '1px dotted black' }}>
                <ReactMarkdown
                    linkTarget={'_blank'}
                    children={content}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                />
            </div>
            <div style={{}}>
                {time}
            </div>
        </Box>
    );
}
