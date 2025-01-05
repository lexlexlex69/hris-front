import { TextField, Typography,Box,Grid,Button,FormControl,Select,InputLabel,MenuItem,Autocomplete } from '@mui/material';
import React, { useEffect,memo, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getAllOfficeData,updateHeadOfficeOIC } from './HeadOfOfficeConfigRequest';
import Swal from 'sweetalert2';
import moment from 'moment';

function UpdateOICActionForm(props){
    const [expiration,setExpiration] = useState('');
    const [office,setOffice] = useState(null);
    const [fullname,setFullname] = useState('');
    const [position,setPosition] = useState('');
    useEffect(()=>{
        setExpiration(props.data.expiration)
        setOffice(props.officeArr)
        setFullname(props.data.fullname)
        setPosition(props.data.position)
    },[props])
    const saveData = (event) => {
        event.preventDefault();
        if(expiration.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please input a valid designation Expiration date.'
            })
        }else{
            Swal.fire({
                icon:'warning',
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: 'Save',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Swal.fire({
                        icon:'info',
                        title:'Updating data',
                        html:'Please wait...',
                        allowEnterKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading();
                    var data = {
                        employee_id:props.data.employee_id,
                        expiration:moment(expiration).format('YYYY-MM-DD H:mm:s'),
                        head_office_designation_id:office.head_office_designation_id,
                        fullname:fullname,
                        position:position
                    }
                    updateHeadOfficeOIC(data)
                    .then(respo=>{
                        const data = respo.data
                        if(data.status === 200){
                            props.onUpdateInfo(data.data)
                            props.close()
                            Swal.fire({
                                icon:'success',
                                title:data.message,
                                timer:1500,
                                showConfirmButton:false
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:data.message,
                            })
                        }
                    }).catch(err=>{
                        Swal.close();
                        console.log(err)
                    })
                }
              })
            
        }
    }
    return(
        <form onSubmit={saveData}>
            <Grid container spacing={2}>

            <Grid item xs={12}>
                <TextField type = 'text' defaultValue={props.data.fname+' '+props.data.mname.charAt(1)+'. '+props.data.lname} label='Name' fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Name (Actual name to reflect)' value={fullname} onChange={(val)=>setFullname(val.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Position' value={position} onChange={(val)=>setPosition(val.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label="Designation Expiration"
                    renderInput={(params) => <TextField {...params} fullWidth required/>}
                    value={expiration}
                    onChange={(newValue) => {
                        setExpiration(newValue);
                    }}
                    
                />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={props.officeData}
                        value = {office}
                        getOptionLabel={(option) => option.office_division_name}
                        onChange={(event,newValue) => {
                            setOffice(newValue);
                            }}
                        isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code}
                        renderInput={(params) => <TextField {...params} label="Department/Office" required/>}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant='contained' color='success' className='custom-roundbutton' type ='submit'> Save</Button>
                    <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}> Cancel</Button>
            </Grid>
        </Grid>
        </form>

    )
}
export default memo(UpdateOICActionForm)