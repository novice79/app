import { useState, useEffect, useRef } from 'react'
import { Image }  from '@mui/icons-material'
import util from "../util";
export default function ImageItem(props) {
    const {name, time, path, type, size} = props
    const [origSize, setOrigSize] = useState(false);

    return(
        <div style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'left',
            backgroundColor: 'rgb(177, 250, 250)',
            margin: '0.3em 0',
            border: '2px inset black',
        }}>
            <div style={{flex: 1, margin: '0 0.4em'}}>
                <div>{name}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem'}}>
                    <div>{time}</div>
                    <div>{util.formatFileSize(size)}</div>
                </div>
                <div style={{overflow: 'auto'}}>
                    <img style={{width: `${origSize ? 'auto' : '100%'}`}}
                    onClick={()=>setOrigSize(p=>!p)} src={getUrl(util.get_store_path(path))} />
                </div>
                
            </div>
        </div>
    )
}