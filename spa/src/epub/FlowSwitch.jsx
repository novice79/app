
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next'; 
export default function FlowSwitch(props) {
    const { flow, flowChanged } = props
    const { t, i18n } = useTranslation();
    const handleChange = (event) => {
        const flow = event.target.checked ? 'scrolled-continuous' : 'paginated'
        flowChanged(flow)
    };

    return (
        <FormGroup sx={{ whiteSpace: 'nowrap'}}>
            <FormControlLabel control={
                <Switch
                    checked={flow == 'scrolled-continuous'}
                    onChange={handleChange}
                />}
                label={t('Scrolled')}
            />
        </FormGroup>
    );
}