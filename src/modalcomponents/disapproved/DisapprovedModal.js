import { Box, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import React,{useState} from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


//icons
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';

import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
export default function DisapprovedModal(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [reason,setReason] = useState('')
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:1,
        boxShadow: 24,
        p: 2,
    };
    return(
        <Box>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* Header */}
                        
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-start',mb:1}}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Disapproval
                            </Typography>
                                {/* <Tooltip title='Close'><IconButton color='error'><CloseIcon/></IconButton></Tooltip> */}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={reason}
                                onChange={(val)=>setReason(val.target.value)}
                                label = 'Reason for disapproval'
                                fullWidth
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><Tooltip title='Clear text'><IconButton size='small' color='error' onClick={()=>setReason('')}><CancelIcon/></IconButton></Tooltip></InputAdornment>,
                                }}/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                            <Button variant='contained' className='custom-roundbutton' size='small' color='success' onClick={()=>props.save(reason)}>Save</Button>
                            <Button variant='contained' className='custom-roundbutton' size='small' color='error' onClick={props.handleClose}>Cancel</Button>
                        </Grid>
                    </Grid>
                    </Box>
                </Modal>
        </Box>
    )
}