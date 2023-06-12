import { useRef } from 'react'
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from './AppBar'
import Notes from './Notes'
import _ from 'lodash'
import { useAtom } from 'jotai'
import { uploadAtom, uploadCountAtom } from './atom'

import util from "./util";

function progress_cap(f) {
  return `${util.truncate(f.name)}${util.formatFileSize(f.size)}`
}

function Home() {

  const [upload, setUpload] = useAtom(uploadAtom)
  const [count, setCount] = useAtom(uploadCountAtom)
  
  // const [count, setCount] = useState(_.size(upload));
  const uploadRef = useRef();
  uploadRef.current = upload;
  
  // do not use brace
  const progressBars = _.map(uploadRef.current, f =>
    <div className="progressbar" key={f.name}>
      <div style={{ width: f.progress }}></div>
      <div className="cap">{`${progress_cap(f)}(${f.progress})`}</div>
    </div>
  )
  // console.log(`progressBars=`,progressBars)
  return (
    <Box sx={{backgroundColor: 'lightgray', minHeight: '100vh'}}>
      <AppBar />
      <Notes />
      <Drawer
        anchor='bottom'
        open={count > 0}
        onClose={() => {
          console.log(`count=${count}`)
        }}
      >
        <Box sx={{
          overflow: 'auto', width: '100%',
          backgroundColor: 'rgba(0, 0, 0, .25)', maxHeight: '80vh'
        }}>
          {progressBars}
        </Box>
      </Drawer>
    </Box>
  )
}

export default Home
