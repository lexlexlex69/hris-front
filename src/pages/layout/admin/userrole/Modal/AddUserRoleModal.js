import { Grid, Typography,Autocomplete,TextField, Button } from '@mui/material'
import React,{useState} from 'react'
import Swal from 'sweetalert2';
import { adduserRole } from '../Request';
export default function AddUserRoleModal(props){
    const [selectedRole,setSelectedRole] = useState([])
    const submitData = (event)=>{
        event.preventDefault();
        if(selectedRole.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Please select user role.'
            })
        }else{
            Swal.fire({
                icon:'info',
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                confirmButtonText: 'Save',
              }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon:'info',
                        title:'Adding User Role',
                        html:'Please wait...'
                    })
                    Swal.showLoading()
                    var user_role = [];
                    var user_role_name = '';
                    selectedRole.forEach(el => {
                        user_role.push(el.role_id)
                        user_role_name+=el.role_name+','
                    });
                    var data2 = {
                        user_role:user_role,
                        emp_no:props.emp_no,
                        role_names:user_role_name
                    }
                    console.log(data2)
                    adduserRole(data2)
                    .then(res=>{
                        const result = res.data
                        if(result.status === 200){
                            props.onAddUserRole(result.new_data)
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
                    }).catch(err=>{
                        Swal.close()
                        console.log(err)
                    })
                }
              })
           
        }
    }
    return(
        <form onSubmit={submitData}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        id="multiple-limit-tags"
                        options={props.data}
                        getOptionLabel={(option) => option.role_name}
                        value={selectedRole}
                        onChange={(event, newValue) => {
                            setSelectedRole(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="User Role *"/>
                        )}
                    // sx={{ width: '500px' }}
                    />
                </Grid>
                <Grid item xs={12}>
                        <hr/>
                        <Button variant='outlined' sx={{float:'right'}} type='submit'>Submit</Button>
                </Grid>
            </Grid>
            
        </form>
    )
}