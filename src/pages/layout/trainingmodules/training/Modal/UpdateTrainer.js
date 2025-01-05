import React,{useState} from 'react';
import {Grid,Box,Typography,Autocomplete,TextField,Button,IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
export default function UpdateTrainer(props){
    const [selectedTrainer,setSelectedTrainer] = useState(props.selectedTrainer);

    const handleSubmit = (event)=>{
        event.preventDefault();

        if(selectedTrainer.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Please select a trainer.'
            })
        }else{
            props.handleUpdateTrainer(selectedTrainer);
        }
    }
    return(
        <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
            <Grid item xs={12} sx={{mt:1}}>
                <Autocomplete
                    disablePortal
                    id="trainer-box"
                    options={props.trainerData.trainer}
                    getOptionLabel={(option) => option.lname+', '+option.fname}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Trainer *"/>}
                    disableCloseOnSelect
                    multiple
                    value={selectedTrainer}
                    onChange={(event,newValue)=>{
                        setSelectedTrainer(newValue)
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Button variant='contained' color='success' startIcon={<SaveIcon/>} type='submit' className='custom-roundbutton'>Save</Button>
            </Grid>
        </Grid>
        </form>
    )
}