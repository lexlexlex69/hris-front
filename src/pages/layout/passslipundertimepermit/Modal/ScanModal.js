import { Box, Button, Grid, TextField } from '@mui/material';
import React,{useState} from 'react';
import Swal from 'sweetalert2';
import { scanPassSlip } from '../PassSlipUndertimeRequest';
export default function ScanModal(){
    const [empno,setEmpno] = useState('')
    const submitScan = (event)=>{
        event.preventDefault();
        scanPassSlip(empno)
        .then(res=>{
            const result = res.data
            if(result.status ===200){
                Swal.fire({
                    icon:'success',
                    title:result.message,
                    timer:1500
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:result.message,
                    timer:2000
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <Box>
            <form onSubmit={submitScan}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField fullWidth label='Employee ID' required value = {empno} onChange={(value)=>setEmpno(value.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <Button variant='outlined' sx={{float:'right'}} type='submit'>submit</Button>
                </Grid>
            </Grid>
            </form>
        </Box>
    )
}