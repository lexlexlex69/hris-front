import { Box, Button, Grid, TextField,Alert,Tooltip,IconButton,Select,MenuItem ,InputLabel,FormControl, FormControlLabel, Switch, Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getDivisions, getSections, updateEmployeeBasicInfo } from "../EmpManagementRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../apiresponse/APIResponse";
import InfoIcon from '@mui/icons-material/Info';
import { faL } from "@fortawesome/free-solid-svg-icons";

export const UpdateModal = ({data,selectedData,close,setData,empStatusData,officesData})=>{
    const [tempData,setTempData] = useState(selectedData)
    const [divisionsData,setDivisionsData] = useState([]);
    const [selectedDivision,setSelectedDivision] = useState(null);
    const [sectionsData,setSectionsData] = useState([]);
    const [selectedSection,setSelectedSection] = useState(null);
    
    useEffect(async()=>{
        //get Division
        if(tempData.div_code !==0){
            const res = await getDivisions({dept_code:tempData.dept_code})
            let div = res.data.data.filter(el=>el.dept_div_id === tempData.div_code);
            if(div.length>0){
                setSelectedDivision(div[0])
            }
            setDivisionsData(res.data.data)
        }
        if(tempData.section_code !== 0){
            const res = await getSections({dept_code:tempData.dept_code,id:tempData.div_code})
            let sec = res.data.data.filter(el=>el.dept_div_section_id === tempData.section_code);
            console.log(res.data.data)
            if(sec.length>0){
                setSelectedSection(sec[0])
            }
            setSectionsData(res.data.data)
        }
        
    },[])
    // useEffect(async ()=>{
    //     //get Division
    //     const res = await getDivisions({dept_code:tempData.dept_code})
    //     setDivisionsData(res.data.data)
    // },[tempData.dept_code])
    // useEffect(async ()=>{
    //     if(selectedDivision){
    //         const res = await getSections({dept_code:tempData.dept_code,id:selectedDivision.dept_div_id})
    //         console.log(res.data.data)
    //         setSectionsData(res.data.data)
    //     }
    // },[selectedDivision])
    const updateData = async (val,name)=>{
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
            const res = await getDivisions({dept_code:val.target.value})
            setDivisionsData(res.data.data)
            setSelectedSection(null)
        }else{
            setTempData({
                ...tempData,
                [name]:val.target.value.toUpperCase()
            })
        }
        
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        APILoading('info','Update Info','Please wait...')
        tempData.div_code = selectedDivision?selectedDivision.dept_div_id:null
        tempData.section_code = selectedSection?selectedSection.dept_div_section_id:0
        const res = await updateEmployeeBasicInfo(tempData);
        if(res.data.status === 200){
            var temp = [...data]
            temp.forEach(el => {
                if(el.id === tempData.id){
                    el.fname = tempData.fname
                    el.mname = tempData.mname
                    el.lname = tempData.lname
                    el.dob = tempData.dob
                    el.id_no = tempData.id_no
                    el.bio_id = tempData.bio_id
                    el.position_code = tempData.position_code
                    el.emp_status = tempData.emp_status
                    el.salary = tempData.salary
                    el.dept_code = tempData.dept_code
                    el.dept_reassigned = tempData.dept_reassigned
                    el.inactive = tempData.inactive
                    el.date_hired = tempData.date_hired
                    el.div_code = tempData.div_code
                    el.section_code = tempData.section_code
                    
                }
            });
            setData(temp)
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
    const handleActive = () => {
        let temp = {...tempData};
        temp.inactive = !temp.inactive;
        setTempData(temp)
    }
    const handleSetDivision = async (val)=>{
        setSelectedDivision(val)
        setSelectedSection(null)
        if(val){
            const res = await getSections({dept_code:tempData.dept_code,id:val.dept_div_id})
            setSectionsData(res.data.data)
        }
    }
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
                    
                
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Monthly Salary' fullWidth value={tempData.salary} onChange={(val)=>updateData(val,'salary')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Employee ID' fullWidth value={tempData.id_no} onChange={(val)=>updateData(val,'id_no')} required/>
                </Grid>
                <Grid item xs={12}>
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
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Reassigned Department/Office</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tempData.dept_reassigned}
                        label="Reassigned Department/Office"
                        onChange={(val)=>updateData(val,'dept_reassigned')}
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
                    <Autocomplete
                        disablePortal
                        id="division-box"
                        options={divisionsData}
                        getOptionLabel={(option) => option.div_name}
                        isOptionEqualToValue={(option, value) => option.dept_div_code === value.dept_div_code}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Division"/>}
                        value={selectedDivision}
                        onChange={(event,newValue)=>{
                            handleSetDivision(newValue)
                        }}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="division-box"
                        options={sectionsData}
                        getOptionLabel={(option) => option.section_name}
                        isOptionEqualToValue={(option, value) => option.dept_div_section_code === value.dept_div_section_code}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Section"/>}
                        value={selectedSection}
                        onChange={(event,newValue)=>{
                            setSelectedSection(newValue)
                        }}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'BIO ID' fullWidth value={tempData.bio_id} onChange={(val)=>updateData(val,'bio_id')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Position Code' fullWidth value={tempData.position_code} onChange={(val)=>updateData(val,'position_code')} required/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Date Hired' type='date' fullWidth value={tempData.date_hired} onChange={(val)=>updateData(val,'date_hired')} InputLabelProps={{shrink:true}}/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                     <FormControlLabel control={<Switch checked={tempData.inactive?false:true} onChange={handleActive}/>} label="Active" />
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1,position:'sticky',bottom:0,background:'#fff'}}>
                    <Button variant="contained" size="small" color="success" type="submit" className="custom-roundbutton">Submit Update</Button>
                    <Button variant="contained" size="small" color="error" onClick={close} className="custom-roundbutton">Cancel</Button>
                </Grid>
            </Grid>
            </form>
        </Box>
    )
}