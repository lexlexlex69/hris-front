import React,{useEffect, useState} from 'react';
import {Grid,TextField,Typography,Button} from '@mui/material'
import { addTrainingRequirements, updateTrainingRequirements } from '../ManageTrainingRequirementsRequest';
import Swal from 'sweetalert2';
export default function UpdateRequirementsModal(props){
    const [name,setName] = useState('');
    const [desc,setDesc] = useState('');
    useEffect(()=>{
        setName(props.data.rqmt_name)
        setDesc(props.data.rqmt_desc)
    },[props.data])
    const handleSubmit = (event) =>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Saving data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        var data2 = {
            id:props.data.training_rqmt_id,
            name:name,
            desc:desc
        }
        updateTrainingRequirements(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setData(res.data.data)
                props.setData(res.data.data)
                props.close();
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    return(
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField label='Name' fullWidth required value={name} onChange = {(value)=>setName(value.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Description' fullWidth value={desc} onChange = {(value)=>setDesc(value.target.value)}/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                    <Button variant='contained' color='success' className='custom-roundbutton' type='submit'>Save</Button> &nbsp;
                    <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                </Grid>
            </Grid>
        </form>
    )
}