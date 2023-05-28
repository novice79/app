import { useState, useEffect, useRef } from 'react'
import util from "../util";
export default function VideoItem(props) {
    const {name, time, path, type, size, chosen, handleClick} = props
    const [duration, setDuration] = useState('');
    useEffect(()=>{
        const video = document.createElement("video")
        video.onloadedmetadata = (event) => {
            const dur = util.toHHMMSS(video.duration);
            setDuration(dur)
        }
        video.src = getUrl(util.get_store_path(path))
        return ()=>video.onloadedmetadata=null
    },[])
    return(
        <div style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'left',
            backgroundColor: `${chosen ? 'aqua' : 'rgb(177, 250, 250)'}`,
            fontSize: `${chosen ? '1.1rem' : '1rem'}`,
            margin: '0.3em 0',
            border: '2px inset black',
            cursor: 'pointer'
        }} onClick={()=>handleClick(path)}>
            <div style={{flex: 1, margin: '0 0.4em'}}>
                <div>{name}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem'}}>
                    <div>{time}</div>
                    <div>{util.formatFileSize(size)}</div>
                    <div>{duration}</div>
                </div>

                
            </div>
        </div>
    )
}