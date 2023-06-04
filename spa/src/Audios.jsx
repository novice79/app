import { useState, useEffect, useRef, useMemo } from 'react'
import { useAtom } from 'jotai'
import { sortedFileAtom } from './atom'
import Box from '@mui/material/Box';
import { Folder, LooksOne, RepeatOne, South, Repeat } from '@mui/icons-material'
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import AudioItem from './Item/Audio'
import util from "./util";
import _ from 'lodash'
import { content } from './props';
import { useTranslation } from 'react-i18next';
import Draggabilly from 'draggabilly'

export default function Audio() {
    const [sortedFile] = useAtom(sortedFileAtom)
    const [currentAudio, setCurrentAudio] = useState('');
    const savedRepeatMode = localStorage.getItem('repeatMode')
    const [repeatMode, setRepeatMode] = useState(savedRepeatMode ? parseInt(savedRepeatMode) : 1);
    const audioRef = useRef();
    const audioFiles = useMemo(() => sortedFile.filter(fi => fi.type.includes('audio/')), [sortedFile])
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const draggie = new Draggabilly('#movable', {
            containment: '#content',
            handle: '#handle'
        });
    }, [])
    const listItems = audioFiles.map(fi =>
        <AudioItem key={fi.path} {...fi}
            chosen={fi.path == currentAudio}
            handleClick={p => setCurrentAudio(p)}
        />)
    function handleEnded() {
        switch (repeatMode) {
            case 1: {
                // do nothing
                break;
            }
            case 2: {
                audioRef.current.play();
                break;
            }
            case 3: {
                const i = audioFiles.findIndex(f => f.path == currentAudio);
                if (i >= 0 && i < audioFiles.length - 1) {
                    setCurrentAudio(audioFiles[i + 1].path);
                }
                break;
            }
            case 4: {
                const i = audioFiles.findIndex(f => f.path == currentAudio);
                if (i >= 0) {
                    if (i < audioFiles.length - 1) {
                        setCurrentAudio(audioFiles[i + 1].path)
                    } else {
                        setCurrentAudio(audioFiles[0].path)
                    }
                }
                break;
            }
        }
    }
    function selRepeatMode(n) {
        localStorage.setItem('repeatMode', `${n}`)
        setRepeatMode(n)
    }
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
                }}>
                    <div><b style={{ color: 'red' }}>{t("Drag this title to move")}</b></div>
                    <div>{t("Current Playback")}: &nbsp;&nbsp;
                        <i>{currentAudio ? util.get_name_from_path(currentAudio) : t("None")}</i>
                    </div>
                </Box>
                <div>
                    <audio src={currentAudio && getUrl(util.get_store_path(currentAudio))} 
                        controls autoPlay
                        ref={audioRef} onEnded={handleEnded} />
                    <Box sx={{ transform: 'translateX(-1rem)', display: 'flex', justifyContent: 'space-around' }}>
                        <Box sx={{ position: 'relative' }} onClick={() => selRepeatMode(1)}>
                            <Folder sx={{
                                fontSize: '2rem',
                                color: `${1 == repeatMode ? 'rgb(199, 173, 87)' : 'black'}`, position: 'absolute'
                            }} />
                            <LooksOneOutlinedIcon sx={{ position: 'absolute', color: 'white', top: '.25rem', left: '.25rem' }} />
                        </Box>
                        <Box sx={{ position: 'relative' }} onClick={() => selRepeatMode(2)}>
                            <Folder sx={{
                                fontSize: '2rem',
                                color: `${2 == repeatMode ? 'rgb(199, 173, 87)' : 'black'}`, position: 'absolute'
                            }} />
                            <RepeatOne sx={{ position: 'absolute', color: 'white', top: '.25rem', left: '.25rem' }} />
                        </Box>
                        <Box sx={{ position: 'relative' }} onClick={() => selRepeatMode(3)}>
                            <Folder sx={{
                                fontSize: '2rem',
                                color: `${3 == repeatMode ? 'rgb(199, 173, 87)' : 'black'}`, position: 'absolute'
                            }} />
                            <South sx={{ position: 'absolute', color: 'white', top: '.25rem', left: '.25rem' }} />
                        </Box>

                        <Box sx={{ position: 'relative' }} onClick={() => selRepeatMode(4)}>
                            <Folder sx={{
                                fontSize: '2rem',
                                color: `${4 == repeatMode ? 'rgb(199, 173, 87)' : 'black'}`, position: 'absolute'
                            }} />
                            <Repeat sx={{ position: 'absolute', color: 'white', top: '.25rem', left: '.25rem' }} />
                        </Box>

                    </Box>

                </div>
            </Box>
        </Box>
    );
}
