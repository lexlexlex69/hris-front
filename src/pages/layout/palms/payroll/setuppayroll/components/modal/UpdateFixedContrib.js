import { Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { APIError, APISuccess, formatExtName, formatMiddlename } from '../../../../../customstring/CustomString';
import { updateFixContrib } from '../../SetupPayrollRequests';
import { APILoading } from '../../../../../apiresponse/APIResponse';
export const UpdateFixedContrib = ({selectedData,updateData,close}) => {
    const [data,setData] = useState(selectedData);
    const handleSave = async (e)=>{
        try{
            e.preventDefault();
            APILoading('info','Updating Data','Please wait...')
            const res = await updateFixContrib({data:data})
            if(res.data.status === 200){
                updateData(res.data.data)
                APISuccess(res.data.message);
                close();
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }

    }
    return(
        <form onSubmit={handleSave}>
        <Grid item container spacing={2} sx={{p:1}}>
            <Grid item xs={12}>
                <TextField label='Name' value={`${data.fname} ${formatMiddlename(data.mname)} ${data.lname} ${formatExtName(data.extname)}`} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <TextField label='SSS' type='number' value={`${data.sss}`} onChange={(val)=>setData({...data,sss:val.target.value})} fullWidth required/>
            </Grid>
            <Grid item xs={12}>
                <TextField label='PagIbig' type='number' value={`${data.pagibig}`} onChange={(val)=>setData({...data,pagibig:val.target.value})} fullWidth required/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant='contained' size='small' color='success' type='submit' className='custom-roundbutton'>Save</Button>
                <Button variant='contained' size='small' color='error' onClick={close} className='custom-roundbutton'>Cancel</Button>
            </Grid>
        </Grid>
        </form>
    )
}