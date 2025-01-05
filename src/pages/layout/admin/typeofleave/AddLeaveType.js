import React, { useState } from "react";
import { Container, Typography,Grid, TextField, Button,Box,InputLabel,MenuItem ,FormControl,FormControlLabel,Checkbox  } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { addNewTypeOfLeave } from "./Request";
import Swal from "sweetalert2";
export default function AddLeaveType(props){
    const [leaveCode,setLeaveCode] = React.useState('')
    const [leaveName,setLeaveName] = React.useState('')
    const [leaveShortName,setLeaveShortName] = React.useState('')
    const [leaveDescription,setLeaveDescription] = React.useState('')
    const [leaveDays,setLeaveDays] = React.useState(0)
    const [leaveFiling,setLeaveFiling] = React.useState(0)
    const [leaveApplicable,setLeaveApplicable] = React.useState('')
    const saveData = (event) => {
        event.preventDefault()
        Swal.fire({
            icon:'info',
            title:'Saving data',
            text:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var data = {
            'leave_code':leaveCode,
            'leave_name':leaveName,
            'leave_short_name':leaveShortName,
            'leave_description':leaveDescription,
            'leave_days':leaveDays,
            'leave_filing_days':leaveFiling,
            'leave_applicable':leaveApplicable,
            'include_to_form':includeToForm
        }
        // console.log(data)
        addNewTypeOfLeave(data)
        .then(response=>{
            const data = response.data
            if(data.status === 'success'){
                props.updateData()
                Swal.fire({
                    icon:'success',
                    title:data.message,
                    timer:1500
                })
                props.handleClose()
            }else{
                Swal.fire({
                    icon:'error',
                    title:data.message
                })
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    const [includeToForm,setIncludeToForm] = useState(false)
    return(
        <form onSubmit={saveData}>
        <Grid container spacing={2} sx={{maxHeight:'60dvh',overflowY:'scroll',pl:2,pr:2,pb:1}}>
            <Grid item xs={12}>
                <TextField type='text' label='Leave Code' placeholder="eGAPS leave code" variant="outlined" fullWidth value = {leaveCode} onChange = {(value)=>setLeaveCode(value.target.value)} required/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='text' label='Leave Name' variant="outlined" fullWidth value = {leaveName} onChange = {(value)=>setLeaveName(value.target.value)} required/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='text' label='Short Name' variant="outlined" fullWidth value = {leaveShortName} onChange = {(value)=>setLeaveShortName(value.target.value)}/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='text' label='Description' variant="outlined" fullWidth value = {leaveDescription} onChange = {(value)=>setLeaveDescription(value.target.value)}/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='number' label='Leave Days' variant="outlined" fullWidth value = {leaveDays} onChange = {(value)=>setLeaveDays(value.target.value)} InputProps={{ inputProps: { min:0}}} required/>
            </Grid>
            <Grid item xs={12}>
                <TextField type='number' label='Filing Period' variant="outlined" fullWidth value = {leaveFiling} onChange = {(value)=>setLeaveFiling(value.target.value)} InputProps={{ inputProps: { min:0}}} required/>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Applicable for *</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={leaveApplicable}
                    label="Applicable for *"
                    onChange={(value)=>setLeaveApplicable(value.target.value)}
                    required
                    >
                    <MenuItem value={'MALE'}>MALE</MenuItem>
                    <MenuItem value={'FEMALE'}>FEMALE</MenuItem>
                    <MenuItem value={'BOTH'}>BOTH</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel control={<Checkbox checked={includeToForm} onChange={()=>setIncludeToForm(!includeToForm)} />} label="Include to Form" />
            </Grid>
        </Grid>
        <Grid container>
        <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Button variant="contained" color="success" type = 'submit' className="custom-roundbutton">Save</Button> &nbsp;
                    <Button variant="contained" color="error" onClick = {props.handleClose} className="custom-roundbutton">Cancel</Button>
                </Box>
            </Grid>
        </Grid>

        </form>
    )
} 