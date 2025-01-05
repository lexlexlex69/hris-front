import { Grid, Typography,TextField,Autocomplete,Button,IconButton } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { getAllPermissions,updateRole } from '../Request';
import Swal from 'sweetalert2';
export default function UpdateRoleModal(props){
    const [selectedPermissions,setSelectedPermissions] = useState([]);
    const [permissionData,setPermissionData] = useState([]);
    const [roleName,setRoleName] = useState('')
    const [description,setDescription] = useState('')
    useEffect(()=>{
        setRoleName(props.data.data.role_name)
        setDescription(props.data.data.description)
        setSelectedPermissions(props.data.permission)
        getAllPermissions()
        .then(res=>{
            const result = res.data
            setPermissionData(result)
            console.log(result)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const submitData = (event)=>{
        event.preventDefault()
        var perm_ids = [];
        selectedPermissions.forEach(el => {
            perm_ids.push(el.perm_menu_id.toString())
        });
        var data2 = {
            role_id:props.data.data.role_id,
            role_name:roleName,
            permission_menu_ids:perm_ids,
            description:description
        }
        updateRole(data2)
        .then(res=>{
            const result = res.data
            if(result.status === 200){
                props.updateRoleData(result.new_data);
                props.close();
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
        })
    }
    return(
        <form onSubmit={submitData}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField type = 'text' fullWidth label='Role Name' required value = {roleName} onChange = {(value)=>setRoleName(value.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type = 'text' fullWidth label='Description' value = {description} onChange = {(value)=>setDescription(value.target.value)}/>
                </Grid>
                <Grid item xs={12} >
                    <Autocomplete
                        disablePortal
                        multiple
                        id="multiple-limit-tags"
                        options={permissionData}
                        getOptionLabel={(option) => option.menu_name}
                        isOptionEqualToValue={(option, value) => option.perm_menu_id === value.perm_menu_id}
                        value={selectedPermissions}
                        onChange={(event, newValue) => {
                            setSelectedPermissions(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Permission *"/>
                        )}
                        sx={{pt:2,maxHeight:100,overflowY:'scroll'}}
                        ListboxProps={{ style: {overflow: 'auto' } }}
                    />
                </Grid>
                <Grid item xs={12} >
                    <hr/>
                    <Button sx={{float:'right'}} type='submit'>Save</Button>
                </Grid>
            </Grid>
        </form>
    )
}