import { useState, useEffect, useRef, useMemo } from 'react'
import { useAtom } from 'jotai'
import { sortedFileAtom } from './atom'
import Box from '@mui/material/Box';

import VideoItem from './Item/Video'
import util from "./util";
import _ from 'lodash'

import { useTranslation } from 'react-i18next';
import Draggabilly from 'draggabilly'
import { content } from './props';
export default function Videos() {
    const [ sortedFile ] = useAtom(sortedFileAtom)
    const videoFiles = useMemo(() => sortedFile.filter(fi => fi.type.includes('video/')), [sortedFile])
    const [currentVideo, setCurrentVideo] = useState('');
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const draggie = new Draggabilly('#movable', {
            containment: '#content',
            handle: '#handle'
        });
    }, [])
    const listItems = videoFiles.map( fi =>
        <VideoItem key={fi.path} {...fi}
            chosen={fi.path == currentVideo}
            handleClick={p => setCurrentVideo(p)}
        />)

    return (
        <Box {...content}>
            {listItems}
            <Box id='movable' sx={{ position: 'absolute', top: '30%', left: '1rem', cursor: 'pointer' }}>
                <Box id="handle" sx={{
                    padding: '0 1em',
                    color: 'white',
                    backgroundColor: 'black',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    opacity: '0.79'
                }} onClick={e=>e.detail === 3 && setCurrentVideo('')}>
                    <div><b style={{ color: 'red' }}>Drag this title to move</b></div>
                    <div style={{margin: '.5rem 0'}}>Current Playback: &nbsp;&nbsp;
                        <i>{currentVideo ? util.get_name_from_path(currentVideo) : 'None'}</i>
                    </div>
                </Box>
                <div>
                    {currentVideo &&
                    <video style={{width: '100%'}}
                        src={getUrl(util.get_store_path(currentVideo))} 
                        controls autoPlay preload="metadata"
                    />
                    }
                </div>
            </Box>
        </Box>
    );
}
