import { Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import SearchEmpModal from '../../../../../custommodal/SearchEmpModal';
import { APIError, APISuccess, formatExtName, formatMiddlename } from '../../../../../customstring/CustomString';
import { addFixContrib } from '../../SetupPayrollRequests';
import { APILoading } from '../../../../../apiresponse/APIResponse';

export const AddFixedContrib = ({updateData,close}) => {
    const [openSearch,setOpenSearch] = useState(false)
    const [data,setData] = useState({
        emp_name:'',
        emp_no:'',
        pagibig:'',
        provident:'',
        sss:'',
    })
    const updateSelect = (data) =>{
        setData({
            ...data,
            emp_name:`${data.fname} ${formatMiddlename(data.mname)} ${data.lname} ${formatExtName(data.extname)}`,
            emp_no:data.id_no,
        })
    }
    const handleSave = async (e) => {
        e.preventDefault();
        try{
            APILoading('info','Adding new data','Please wait...')
            const res = await addFixContrib({data:data})
            if(res.data.status === 200){
                updateData(res.data.data)
                APISuccess(res.data.message)
                close();
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
        

    }
    return (
        <>
        <form onSubmit={handleSave}>
        <Grid container spacing={1} sx={{p:1}}>
            <Grid item xs={12} sx={{display:'flex'}}>
                <TextField label='Employee Name' value={data.emp_name} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth/>
                <Button variant='contained' onClick={()=>setOpenSearch(true)}>Search</Button>
            </Grid>
            <Grid item xs={12}>
                <TextField type='number' label='SSS' value={data.sss} onChange={(val)=>setData({...data,sss:val.target.value})} fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='number' label='PagIbig' value={data.pagibig} onChange={(val)=>setData({...data,pagibig:val.target.value})} fullWidth/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant='contained' size='small' color='success' type='submit' className='custom-roundbutton'>Save</Button>
                <Button variant='contained' size='small' color='error' onClick={close} className='custom-roundbutton'>Cancel</Button>
            </Grid>
            
        </Grid>
        </form>
        <SearchEmpModal open = {openSearch} close = {()=>setOpenSearch(false)} title='Search Employee' updateSelect={updateSelect} type={1}>
        </SearchEmpModal>
        </>
    )
}