import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { reExecBioLogs } from '../DTRManagementRequests';
import { APIError, APISuccess } from '../../../../customstring/CustomString';
import { APILoading } from '../../../../apiresponse/APIResponse';
export const API_KEY = process.env.REACT_APP_KEY_BIO
export const ReExecute = ({list,close}) => {
    const [selectedDevice,setSelectedDevice] = useState(null);
    const [from,setFrom] = useState('');
    const [to,setTo] = useState('');
    const handleSave = async (e) =>{
        e.preventDefault();
        try{
            APILoading('info','Processing request','Please wait...')
            let t_data = {
                device_id:selectedDevice.id,
                from:from,
                to:to
            }
            console.log(t_data)
            const res = await reExecBioLogs(t_data);
            if(res.data[0].status === 'Success'){
                APISuccess(res.data[0].remarks)
            }else{
                APIError(res.data[0].remarks)
            }
        }catch(err){
            APIError(err)
        }
    }
    return (
        <form onSubmit={handleSave}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id={"combo-box-devices"}
                    options={list}
                    getOptionLabel={(option) => option.description}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    // sx={{ minWidth: 300,maxWidth:'100%'}}
                    fullWidth
                    // size="small"
                    value = {selectedDevice}
                    onChange={(event, newValue) => {
                        setSelectedDevice(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label='Bio Device' required/>}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField type='date' label='From' fullWidth InputLabelProps={{shrink:true}} value = {from} onChange={(val)=>setFrom(val.target.value)} required/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='date' label='To' fullWidth InputLabelProps={{shrink:true}} value = {to} onChange={(val)=>setTo(val.target.value)} required/>
            </Grid>
            <Grid item xs={12}>
                
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant='contained' className='custom-roundbutton' color='success' type='submit'>Save</Button>
                <Button variant='contained' className='custom-roundbutton' color='error' onClick={close}>Cancel</Button>
            </Grid>
        </Grid>
        </form>
    )
}