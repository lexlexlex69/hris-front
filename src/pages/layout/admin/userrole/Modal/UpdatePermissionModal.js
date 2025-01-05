import { Grid, TextField, Typography,Button,IconButton,Autocomplete } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { getEmpStatus, updatePermissionMenu } from '../Request';
import Swal from 'sweetalert2';
export default function UpdatePermissionModal(props){
    const [menuName,setMenuName] = useState('')
    const [location,setLocation] = useState('')
    const [uri,setURI] = useState('')
    const [empStatus,setEmpStatus] = useState([])
    const [preSelectEmpStat,setPreSelectEmpStat] = useState([])
    useEffect(()=>{
        getEmpStatus()
        .then(res=>{
            console.log(res.data)
            console.log(props.data)
            var t_empstat_arr = props.data.emp_status.split(',');

            var t_empstat = [];

            res.data.forEach(el=>{
                t_empstat_arr.forEach(el2 => {
                    if(el2 === el.code){
                        t_empstat.push(el)
                    }
                });
            })
            setEmpStatus(res.data)
            setPreSelectEmpStat(t_empstat)
        }).catch(err=>{
            console.log(err)
        })
        
        setMenuName(props.data.menu_name)
        setLocation(props.data.location)
        setURI(props.data.uri)
    },[])
    const saveData = (event) =>{
        event.preventDefault()
        Swal.fire({
            icon:'question',
            title:'Save changes ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Saving update',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var t_emp_status = '';
                preSelectEmpStat.forEach((el,key)=>{
                    if(key === preSelectEmpStat.length-1){
                        t_emp_status+=el.code
                    }else{
                        t_emp_status+=el.code+','
                    }
                })
                var data2 = {
                    perm_menu_id:props.data.perm_menu_id,
                    menu_name:menuName,
                    location:location,
                    uri:uri,
                    emp_status:t_emp_status
                }
                updatePermissionMenu(data2)
                .then(res=>{
                    const result =res.data
                    if(result.status === 200){
                        props.onUpdateData(result.new_data)
                        props.close()
                        Swal.fire({
                            icon:'success',
                            title:result.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'success',
                            title:result.message
                        })
                    }
                }).catch(err=>{
                    Swal.fire({
                        icon:'error',
                        title:err
                    })
                    console.log(err)
                })
            }
        })
        
    }
    return(
        <form onSubmit={saveData}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField value = {menuName} onChange = {(value)=>setMenuName(value.target.value)} label='Menu Name' required fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField value = {location} onChange = {(value)=>setLocation(value.target.value)} label='Location' required fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={empStatus}
                        getOptionLabel={(option) => option.description}
                        value={preSelectEmpStat}
                        onChange={(event, newValue) => {
                            setPreSelectEmpStat(newValue);
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Employment Status"
                            placeholder="Employment Status"
                        />
                        )}
                        sx={{pt:2,maxHeight:100,overflowY:'scroll'}}                       
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField value = {uri} onChange = {(value)=>setURI(value.target.value)} label='Path' required fullWidth/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <hr/>
                    <Button variant='contained' color = 'success' size='small' type='submit' className='custom-roundbutton'>Save</Button>
                    <Button variant='contained' color = 'error' size='small' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                </Grid>
            </Grid>
        </form>
    )
}