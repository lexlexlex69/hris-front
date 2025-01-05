import { Button, Grid, TextField, Typography,Autocomplete } from '@mui/material';
import React,{useEffect, useState} from 'react';
import {getAllPermissions,addNewRole} from '.././Request'
import Swal from 'sweetalert2';
export default function AddNewRoleModal(props){
    const [permissionData,setPermissionData] = useState([])
    const [roleName,setRoleName] = useState('')
    const [description,setDescription] = useState('')
    const [selectedPermissions,setSelectedPermissions] = useState([])
    useEffect(()=>{
        getAllPermissions()
        .then(res=>{
            const result = res.data
            setPermissionData(result)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const submitData = (event)=>{
        event.preventDefault();
        var perm_ids = []
        selectedPermissions.forEach(el => {
            perm_ids.push(el.perm_menu_id.toString())
        });
        var data2 = {
            role_name:roleName,
            permission_menu_ids:perm_ids.sort(),
            description:description
        }
        addNewRole(data2)
        .then(res=>{
            const result = res.data
            if(result.status === 200){
                props.close()
                props.updateRoleData(result.new_data)
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
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <TextField type = 'text' fullWidth label='Role Name' required value = {roleName} onChange = {(value)=>setRoleName(value.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type = 'text' fullWidth label='Description' value = {description} onChange = {(value)=>setDescription(value.target.value)}/>
                </Grid>
                <Grid item xs={12} >
                    <Autocomplete
                        multiple
                        id="multiple-limit-tags"
                        options={permissionData}
                        getOptionLabel={(option) => option.menu_name}
                        value={selectedPermissions}
                        onChange={(event, newValue) => {
                            setSelectedPermissions(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Permission *"/>
                        )}
                        sx={{pt:2,maxHeight:200,overflowY:'scroll'}}
                    />
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                    <hr/>
                    <Button variant='contained' color = 'success' className='custom-roundbutton' type='submit' disabled={selectedPermissions.length ===0 ?true:false}>save</Button> &nbsp;
                    <Button variant='contained' color = 'error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                </Grid>
            </Grid>
        </form>
    )
}