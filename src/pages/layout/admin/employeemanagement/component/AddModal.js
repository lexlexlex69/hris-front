import { Box, Button, Grid, TextField,Alert, Tooltip, IconButton,Select,MenuItem ,InputLabel,FormControl, FormControlLabel, Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import { addNewEmployeeInfo, updateEmployeeBasicInfo } from "../EmpManagementRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../apiresponse/APIResponse";
import InfoIcon from '@mui/icons-material/Info';
export const AddModal = ({data,selectedData,close,setData,empStatusData,officesData})=>{
    const [tempData,setTempData] = useState({
        fname:'',
        mname:'',
        lname:'',
        dob:'',
        id_no:'',
        dept_code:'',
        dept_reassigned:'',
        bio_id:'',
        position_code:'',
        emp_status:'',
        salary:'',
    })
    const [reassigned,setReassigned] = useState(false)
    const updateData = (val,name)=>{
        if(name === 'dept_code'){
            setTempData({
                ...tempData,
                [name]:val.target.value
            })
        }else if(name === 'dept_reassigned'){
            setTempData({
                ...tempData,
                [name]:val.target.value
            })
        }else{
            setTempData({
                ...tempData,
                [name]:val.target.value.toUpperCase()
            })
        }
        
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        APILoading('info','Adding Data','Please wait...')
        const res = await addNewEmployeeInfo(tempData);
        if(res.data.status === 200){
            close();
            Swal.fire({
                icon:'success',
                title:res.data.message
            })
        }else{
            Swal.fire({
                icon:'warning',
                title:res.data.message
            })
        }
    }
    useEffect(()=>{
        if(!reassigned){
            setTempData({
                ...tempData,
                dept_reassigned:tempData.dept_code
            })
        }
    },[reassigned,tempData.dept_code])
    return (
        <Box sx={{p:1}}>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{maxHeight:'80vh',overflowY:'scroll'}}>
                <Grid item xs={12}>
                    <Alert severity="info">Please input "N/A" to Name if not applicable.</Alert>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'First Name' fullWidth value={tempData.fname} onChange={(val)=>updateData(val,'fname')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Middle Name' fullWidth value={tempData.mname} onChange={(val)=>updateData(val,'mname')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Last Name' fullWidth value={tempData.lname} onChange={(val)=>updateData(val,'lname')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Date of Birth' type='date' fullWidth value={tempData.dob} onChange={(val)=>updateData(val,'dob')} required InputLabelProps={{shrink:true}}/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    {/* <TextField label = 'Employment Status' fullWidth value={tempData.emp_status} onChange={(val)=>updateData(val,'emp_status')} required/>
                    <Tooltip title='RE = Regular, CS = Casual, CT = Co-Terminous, COS = Contract of Service, JO = Job Order'><IconButton color="info"><InfoIcon/></IconButton></Tooltip> */}
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Employment Status</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tempData.emp_status}
                        label="Employment Status"
                        onChange={(val)=>updateData(val,'emp_status')}
                        >
                        {
                            empStatusData.map((item,key)=>{
                                return(
                                    <MenuItem value={item.code} key={key}>{item.description}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Monthly Salary' type='number' fullWidth value={tempData.salary} onChange={(val)=>updateData(val,'salary')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Employee ID From Lexsys' fullWidth value={tempData.id_no} onChange={(val)=>updateData(val,'id_no')} required/>
                </Grid>
                <Grid item xs={12}>
                    {/* <TextField label = 'Dept. Code' fullWidth value={tempData.dept_code} onChange={(val)=>updateData(val,'dept_code')} required/> */}
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Mother Department/Office</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tempData.dept_code}
                        label="Mother Department/Office"
                        onChange={(val)=>updateData(val,'dept_code')}
                        >
                        {
                            officesData.map((item,key)=>{
                                return(
                                    <MenuItem value={item.dept_code} key={key}>{item.dept_title}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox checked = {reassigned} onChange = {()=>setReassigned((prev)=>!prev)} />} label="Reassigned" />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Assign Department/Office</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tempData.dept_reassigned}
                        label="Assign Department/Office"
                        onChange={(val)=>updateData(val,'dept_reassigned')}
                        disabled={reassigned?false:true}
                        >
                        {
                            officesData.map((item,key)=>{
                                return(
                                    <MenuItem value={item.dept_code} key={key}>{item.dept_title}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'BIO ID' fullWidth value={tempData.bio_id} onChange={(val)=>updateData(val,'bio_id')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Position Code' fullWidth value={tempData.position_code} onChange={(val)=>updateData(val,'position_code')} required/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1,position:'sticky',bottom:0,background:'#fff',zIndex:2}}>
                    <Button variant="contained" color="success" type="submit" className="custom-roundbutton">Submit</Button>
                    <Button variant="contained" color="error" onClick={close} className="custom-roundbutton">Cancel</Button>
                </Grid>
            </Grid>
            </form>
        </Box>
    )
}