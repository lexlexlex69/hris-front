import { Button, Grid, TextField, Typography } from '@mui/material';
import React,{useState} from 'react';
import Swal from 'sweetalert2';
import { addUndertimePermit } from '../PassSlipUndertimeRequest';
export default function AddUndertimePermitModal(props){
    const [time,setTime] = useState('');
    const [reason,setReason] = useState('');
    const submitData = (event)=>{
        event.preventDefault();
        var data2 = {
            time:time,
            reason:reason
        }
        addUndertimePermit(data2)
        .then(res=>{
            const result = res.data
            if(result.status === 200){
                props.onAddUndertimePermit(result.new_data)
                props.close()
                Swal.fire({
                    icon:'success',
                    title:result.message,
                    timer:1500,
                    showConfirmButton:false
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:result.message
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <form onSubmit={submitData}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField type='time' label='Time' fullWidth InputLabelProps={{shrink:true}} required value = {time} onChange={(value)=>setTime(value.target.value)}/>

                </Grid>
                <Grid item xs={12}>
                <TextField type='text' label='Reason' fullWidth required value = {reason} onChange={(value)=>setReason(value.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <hr/>
                    <Button variant='outlined' sx={{float:'right'}} type='submit'>Submit</Button>
                </Grid>
            </Grid>
        </form>
    )
}