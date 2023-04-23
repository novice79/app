import CircularProgress from '@mui/material/CircularProgress';
export default function LoadingView(props){
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            color: '#ccc',
            textAlign: 'center',
            margintop: '-.5em'
        }}>
            <CircularProgress/>
        </div>
        
    )
}