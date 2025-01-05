import { Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { formatMiddlename } from '../../../../../customstring/CustomString';
import { updateWTax } from '../../SetupPayrollRequests';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { APILoading } from '../../../../../apiresponse/APIResponse';

export const UpdateWTax = ({selectedData,close}) =>{
    const [data,setData] = useState({
        fixed_tax:selectedData.fixed_tax,
        name:selectedData.fname+' '+(formatMiddlename(selectedData.mname))+' '+selectedData.lname
    })
    const handleSave = async (e) => {
        e.preventDefault();
        try{
            APILoading('info','Updating data','Please wait...')
            let t_data = {
                emp_id:selectedData.employee_id,
                emp_no:selectedData.emp_no,
                tax:data.fixed_tax
            }
            const res = await updateWTax(t_data);
            if(res.data.status === 200){
                close();
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    text:'Please reprocess data to take effect'
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
            console.log(res.data)
        }catch(err){
            toast(err)
        }
        
    }
    return (
        <form onSubmit={handleSave}>
        <Grid container spacing={2} sx={{p:1}}>
            <Grid item xs={12}>
                <TextField label = 'Name' value={data.name} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='number' label='Percentage' value={data.fixed_tax} onChange={(val)=>setData({...data,fixed_tax:val.target.value})} fullWidth required/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant='contained' color='success' size='small' className='custom-roundbutton' type='submit'>Save</Button>
                <Button variant='contained' color='error' size='small' className='custom-roundbutton' onClick={close}>Cancel</Button>
            </Grid>
        </Grid>
        </form>
    )
}