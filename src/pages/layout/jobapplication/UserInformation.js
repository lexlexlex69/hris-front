import React from 'react'
import {Box, TextField,Tooltip,Grid,Button} from '@mui/material'
import { useSelector,useDispatch } from 'react-redux'
import {setEmail,setInfo} from '../../../redux/slice/emailVerificationSlice'
import Swal from 'sweetalert2'
export default function UserInformation(props){
    const dispatch = useDispatch();
    const handleDataChange = (event) => {
        /**
         * Set Value to data object
         */
        dispatch(setInfo(event))
    }
    const saveData = () =>{
        /**
         * check if required data was empty
         */
        if(data.username.length === 0 || data.fname.length === 0 || data.lname.length === 0 || data.password.length === 0 || data.email.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Please input all required field'
            })
        }else{
            props.setInformation(data)
        }
    }
    return(
        <Grid container spacing={2}>
            <Grid item lg={12}>
            <TextField label="Username" variant='outlined' fullWidth required value = {info.username} name = "username" onChange={handleDataChange}/>
            </Grid>
            <Grid item lg={12}>
            <TextField label="First Name" variant='outlined' fullWidth required value = {info.fname}  name = "fname" onChange={handleDataChange}/>
            </Grid>
            <Grid item lg={12}>
            <TextField label="Middle Name" variant='outlined' fullWidth value = {info.mname}  name = "mname" onChange={handleDataChange}/>
            </Grid>
            <Grid item lg={12}>
            <TextField label="Last Name" variant='outlined' fullWidth required value = {info.lname}  name = "lname" onChange={handleDataChange}/>
            </Grid>
            <Grid item lg={12}>
            <TextField label="Password" variant='outlined' fullWidth type="password" value = {info.password}  required name = "password" onChange={handleDataChange}/>
            </Grid>
            <Grid item lg={12}>
            <Tooltip title="Where Verification Code will be sent" placement="top">
                <TextField label="Email Address" variant='outlined' fullWidth required value = {info.email} name = "email" onChange = {handleDataChange}/>
            </Tooltip>
            </Grid>
            <Grid item lg={12}>
                <Button
                    variant="contained"
                    sx={{ mt: 1, mr: 1 }}
                    onClick = {saveData}
                >
                    Continue
                </Button>
                <Button
                    disabled={props.activeStep === 0}
                    onClick={props.handleBack}
                    sx={{ mt: 1, mr: 1 }}
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    )
}