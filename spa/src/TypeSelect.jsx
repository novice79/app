import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Store, Folder, Image, Audiotrack, OndemandVideo, InsertDriveFile } from '@mui/icons-material';
export default function TypeSelect() {
    const [type, setType] = React.useState('all');

    const handleChange = (event) => {
        setType(event.target.value);
    };

    return (
        <div style={{transform: 'translateY(.2rem)'}}>
            <FormControl sx={{ m: '0.1rem', minWidth: 100 }} size="small">
                <InputLabel id="file-type">Type</InputLabel>
                <Select
                    labelId="file-type"
                    value={type}
                    label="Type"
                    onChange={handleChange}
                >
                    <MenuItem value={'all'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Store sx={{ mr: 1 }} /><div>All</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'image'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Image sx={{ mr: 1 }} /><div>Image</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'audio'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Audiotrack sx={{ mr: 1 }} /><div>Audio</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'video'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <OndemandVideo sx={{ mr: 1 }} /><div>Video</div>
                        </Box>
                    </MenuItem>
                </Select>
            </FormControl>

        </div>
    );
}