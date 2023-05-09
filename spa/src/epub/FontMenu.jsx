import { useState, useEffect, useRef } from 'react'
import { FormatSize, Settings, TextIncrease, TextDecrease } from '@mui/icons-material';

import FontSelect from './FontSelect'
import FlowSwitch from './FlowSwitch'
export default function FontMenu(props) {
    const {
        size, changeSize, themeSelected, fontFamilySelected,
        showMenu, fontIconClicked, flow, flowChanged
    } = props
    

    return (
        <div style={{ position: 'relative'}}>
            <Settings sx={{ 
              fontSize: '1.7rem', mr: 3, color: 'white', cursor: 'pointer',
              transform: 'translateY(0.1rem)' }} 
              onClick={fontIconClicked}
            />
            <div style={{ position: 'absolute', 
                backgroundColor: 'lightgray',
                transform: 'translate(-70%, 0.5rem)',
                opacity: 1, zIndex: 9, padding: '1rem', borderRadius: '.3rem',
                display: `${showMenu? 'block': 'none'}`
            }}
            >
                <div style={{display: 'flex', alignItems: 'center', 
                    marginBottom: '.8rem', 
                    // border: 'solid 2px red'
                    }}>
                    <TextDecrease sx={{mr:2}} onClick={() => changeSize(Math.max(70, size - 10))}/>
                    <div>{size}%</div>
                    <TextIncrease sx={{ml:2}} onClick={() => changeSize(Math.min(250, size + 10))}/>
                </div>
                <hr/>
                <div style={{
                    display: 'flex', alignItems: 'center', 
                    justifyContent: 'space-between', backgroundColor: 'lightGrey',
                    marginTop: '.8rem'
                    }}>
                    <div onClick={()=>themeSelected('white')}
                        style={{
                        width: '2rem', height: '2rem', backgroundColor: 'white',
                        borderRadius: '1rem'
                        }}
                    />

                    <div onClick={()=>themeSelected('burlywood')}
                        style={{
                        width: '2rem', height: '2rem', backgroundColor: 'burlywood',
                        borderRadius: '1rem'
                        }}
                    />
                    <div onClick={()=>themeSelected('black')}
                        style={{
                        width: '2rem', height: '2rem', backgroundColor: 'black',
                        borderRadius: '1rem'
                        }}
                    />
                
                </div>
                <hr/>
                <FontSelect fontFamilySelected={fontFamilySelected}/>
                <hr/>
                <FlowSwitch flow={flow} flowChanged={flowChanged}/>
            </div>
        </div>
    )
}