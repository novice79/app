import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { ArrowUpward, ArrowDownward, SelectAll } from '@mui/icons-material';
export default function SortSelect() {
    const [type, setType] = React.useState('name');

    const handleChange = (event) => {
        setType(event.target.value);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', transform: 'translateY(.2rem)'}}>
            <FormControl sx={{ m: '0.1rem', minWidth: 100 }} size="small">
                <InputLabel id="sort-by">SortBy</InputLabel>
                <Select
                    labelId="sort-by"
                    value={type}
                    label="SortBy"
                    onChange={handleChange}
                >
                    <MenuItem value={'name'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <div>Name</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'time'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <div>Time</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'type'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <div>Type</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'size'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <div>Size</div>
                        </Box>
                    </MenuItem>
                </Select>
            </FormControl>
            {true 
            ? <ArrowUpward sx={{ml: 1.5, cursor: 'pointer'}}/> 
            : <ArrowDownward sx={{ml: 1.5, cursor: 'pointer'}}/> }
        </div>
    );
}