import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Store, Image, Audiotrack, OndemandVideo } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function TypeSelect({type, setType}) {
    const { t } = useTranslation();
    const handleChange = (event) => {
        setType(event.target.value);
    };

    return (
        <div style={{ 
            color: 'white'
            // backgroundColor: 'white'
            // transform: 'translateY(.2rem)'
            }}>
            <FormControl sx={{ m: '0.1rem', minWidth: 100 }} size="small">
                <InputLabel id="file-type">{t('Type')}</InputLabel>
                <Select
                    labelId="file-type"
                    value={type}
                    label="Type"
                    onChange={handleChange}
                >
                    <MenuItem value={'all'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Store sx={{ mr: 1 }} /><div>{t('All')}</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'image'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Image sx={{ mr: 1 }} /><div>{t('Image')}</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'audio'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Audiotrack sx={{ mr: 1 }} /><div>{t('Audio')}</div>
                        </Box>
                    </MenuItem>
                    <MenuItem value={'video'}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <OndemandVideo sx={{ mr: 1 }} /><div>{t('Video')}</div>
                        </Box>
                    </MenuItem>
                </Select>
            </FormControl>

        </div>
    );
}