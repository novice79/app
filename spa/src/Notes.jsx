import {useState, useRef} from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from "react-router-dom";
import { noteAtom, currentNoteAtom } from './atom'
import Box from '@mui/material/Box';
import { Menu } from '@mui/icons-material';
import util from "./util";
import Draggable, {DraggableCore} from 'react-draggable'

export default function Books() {
    const [ note ] = useAtom(noteAtom)
    const [ , setCurrentBook ] = useAtom(currentNoteAtom)
    const [multiSel, setMultiSel] = useState(false);
    const navigate = useNavigate()
    const nodeRef = useRef(null);
    let drag = false;
    function handleMouseDown(e){
        // console.log('handleMouseDown')
        drag = false
    }
    function handleMouseMove(){
        // console.log('handleMouseMove')
        drag = true
    }
    function handleMouseUp(){
        if(!drag) setMultiSel(p=>!p)
        // console.log('handleMouseUp')
    }
    // useEffect(()=>{
    //     const draggie = new Draggabilly('#movable', {
    //         containment: '#content', 
    //         handle: '#handle'
    //     });
    //     draggie.on( 'staticClick', toggleMultiSel);
    //     return ()=>draggie.off( 'staticClick', toggleMultiSel)
    // }, [])

    const listItems = note.map( n =>
        <Box key={`${n.id}`}
        onClick={e=>{
            setCurrentBook(n)
            navigate("/view");
        }}
        sx={{ 
            border: '3px outset', cursor: 'pointer',
            position: 'relative', margin: '.4rem', maxHeight: '290px', maxWidth: '200px' 
        }}>
            
            
        </Box>

    );
    return (
        <Box id='content' sx={{ 
            width: '100%', pt: '4.1rem', height: '100vh',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'
        }}>
            {listItems}
            {/* <Draggable handle=".handle" nodeRef={nodeRef}>
            <Menu ref={nodeRef} sx={{marginTop: 'auto', fontSize: '1.1em', borderRadius: '1.0em'}}/>
            <Box ref={nodeRef} sx={{ 
                position: 'absolute', fontSize: '2rem',
                top: '40%', left: '60%', cursor: 'pointer' }}>
                <Box id="handle" sx={{
                    display: 'flex',
                    backgroundColor: 'lightGrey', p: .5, borderRadius: '1em'
                }}>
                    <Menu sx={{marginTop: 'auto', fontSize: '1.1em', borderRadius: '1.0em'}}/>
                </Box>
                
            </Box>
            </Draggable> */}
                <Draggable nodeRef={nodeRef} bounds='#content'>
                <div ref={nodeRef} style={{position: 'absolute'}} >
                    <Menu  
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    sx={{marginTop: 'auto', fontSize: '1.1em', 
                    border: `${multiSel? '2px inset' : ''}`, borderRadius: '1.0em'}}/>
                </div>
                </Draggable>
        </Box>
    );
}
