import { useState, useRef } from 'react'
import { useAtom } from 'jotai'
import { notesAtom, } from './atom'
import Box from '@mui/material/Box';

import NoteItem from "./NoteItem"
import { useTranslation } from 'react-i18next';
import ConfirmDialog from './ConfirmDialog'
import util from "./util";


export default function Notes() {
    const [notes] = useAtom(notesAtom)
    const [toBedel, setToBedel] = useState();
    const { t } = useTranslation();
    const onNoteLongPress = (id, content) => {
        console.log('longpress is triggered');
        setToBedel({id, content})
    };
    return (
        <Box id='content' sx={{
            width: '100%', pt: '4.1rem', alignItems: 'flex-start',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around',
        }}>
            {notes.map(n => <NoteItem key={`${n.id}`} {...n} onNoteLongPress={onNoteLongPress}/>)}
        {toBedel && <ConfirmDialog open={true}
        title={t("you-sure")} content={toBedel.content}
        okCB={() => {
          util.post_data(getUrl('/del'), toBedel.id)
          setToBedel(null)
        }} cancelCB={()=>setToBedel(null)}/>}
        </Box>
    );
}
