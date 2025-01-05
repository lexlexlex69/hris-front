import React, { useEffect } from "react";
import { Container, Typography,Grid, TextField, Button,Box,InputLabel,MenuItem ,FormControl,Radio,RadioGroup,FormControlLabel,FormLabel,Checkbox} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { updateTypeOfLeave } from "./Request";
import Swal from "sweetalert2";
export default function UpdateLeaveType(props){
    const [leaveName,setLeaveName] = React.useState('')
    const [leaveDescription,setLeaveDescription] = React.useState('')
    const [leaveDays,setLeaveDays] = React.useState(0)
    const [leaveFiling,setLeaveFiling] = React.useState(0)
    const [leaveApplicable,setLeaveApplicable] = React.useState('')
    const [leaveEnabled,setLeaveEnabled] = React.useState('')
    const [includeToForm,setIncludeToForm] = React.useState(false)
    useEffect(()=>{
        setLeaveName(props.info.leave_type_name)
        setLeaveDescription(props.info.leave_desc)
        setLeaveDays(props.info.days)
        setLeaveFiling(props.info.filing_period)
        setLeaveApplicable(props.info.applicable_for)
        setLeaveEnabled(props.info.enabled)
        setLeaveEnabled(props.info.enabled)
        setIncludeToForm(props.info.include_to_form)
        console.log(props.info)
    },[])
    const saveData = () => {
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data = {
                    'id':props.info.leave_type_id,
                    'leave_name':leaveName,
                    'leave_description':leaveDescription,
                    'leave_days':leaveDays,
                    'leave_filing_days':leaveFiling,
                    'leave_applicable':leaveApplicable,
                    'leave_enabled':leaveEnabled,
                    'include_to_form':includeToForm
                }
                updateTypeOfLeave(data)
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
                    Swal.close()
                    console.log(error)
                })
            }
          })
        
    }
    return(
        <Box sx={{maxHeight:'80vh',overflow:'auto',p:1}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField type='text' label='Leave Name *' variant="outlined" fullWidth value = {leaveName} onChange = {(value)=>setLeaveName(value.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type='text' label='Description' variant="outlined" fullWidth value = {leaveDescription} onChange = {(value)=>setLeaveDescription(value.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type='number' label='Leave Days' variant="outlined" fullWidth value = {leaveDays} onChange = {(value)=>setLeaveDays(value.target.value)} InputProps={{ inputProps: { min:0}}}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField type='number' label='Filing Period' variant="outlined" fullWidth value = {leaveFiling} onChange = {(value)=>setLeaveFiling(value.target.value)} InputProps={{ inputProps: { min:0}}}/>
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
                <Grid item xs={12}>
                <FormLabel id="enabled-radio-buttons-group-label">Enable</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="enabled-radio-buttons-group-label"
                    name="enabled-radio-buttons-group"
                >
                    <FormControlLabel value={true} checked={leaveEnabled?true:false} onChange={()=>setLeaveEnabled(true)} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} checked={leaveEnabled?false:true} onChange={()=>setLeaveEnabled(false)} control={<Radio />} label="No" />
                </RadioGroup>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Button variant="contained" color="success" onClick = {saveData} className='custom-roundbutton'>Save</Button> &nbsp;
                        <Button variant="contained" color="error" onClick = {props.handleClose} className="custom-roundbutton">Cancel</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
} 