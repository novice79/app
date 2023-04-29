import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
export default function FontSelect(props) {
    const {fontFamilySelected} = props;
    const { t, i18n } = useTranslation();
    const [font, setFont] = useState(
        localStorage.getItem('font-family') || 'default');

    const handleChange = (event) => {
        fontFamilySelected(event.target.value == 'default' ? "" : event.target.value)
        setFont(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120, mt: '1rem' }}>
            <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">{t('Font')}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={font}
                    label="Font"
                    onChange={handleChange}
                >
                    <MenuItem value={'default'}>{t('default')}</MenuItem>
                    <MenuItem value={'serif'}>serif</MenuItem>
                    {/* <MenuItem value={'sans-serif'}>sans-serif</MenuItem> */}
                    <MenuItem value={'monospace'}>monospace</MenuItem>
                    <MenuItem value={'cursive'}>cursive</MenuItem>
                    <MenuItem value={'fantasy'}>fantasy</MenuItem>
                    <MenuItem value={'LiSu'}>隸書</MenuItem>
                    <MenuItem value={'AaQLJSXLS'}>小隸</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}