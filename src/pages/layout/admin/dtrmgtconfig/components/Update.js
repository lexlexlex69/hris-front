import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, TextField, Tooltip } from "@mui/material";
import React, { useState } from "react";
import SearchEmpModal from "../../../custommodal/SearchEmpModal";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { formatMiddlename } from "../../../customstring/CustomString";
import Swal from "sweetalert2";
import { addDTRConfig, updateDTRConfig } from "../DTRMgtConfigRequests";
import { APILoading } from "../../../apiresponse/APIResponse";
export const Update = ({offices,updateData,selectedUpdate,close})=>{
    const [data,setData] = useState({
        emp_info:{
            fname:selectedUpdate.fname,
            mname:selectedUpdate.mname,
            lname:selectedUpdate.lname,
            emp_id:selectedUpdate.emp_id
        },
        offices:JSON.parse(selectedUpdate.offices),
        actions:JSON.parse(selectedUpdate.actions)
    })
    const [searchOpen,setSearchOpen] = useState(false);
    const [allOffices,setAllOffices] = useState(false) 
    const updateSelect = (row)=>{
        setData({
            ...data,
            emp_info:row
        })
        console.log(row)
    }
    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        if(allOffices){
            if(data.actions?.length>0){
                APILoading('info','Updating info','Please wait');
                let offices_arr= [];

                offices.forEach(el=>{
                    offices_arr.push({
                        'dept_code':el.dept_code,
                        'dept_title':el.dept_title
                    })
                })
                
                var t_data = {
                    emp_id:data.emp_info.emp_id,
                    offices:offices_arr,
                    actions:data.actions
                }
                const res = await updateDTRConfig(t_data);
                if(res.data.status === 200){
                    updateData(res.data.data)
                    close();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1000
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    text:'Please provide data to all required fields'
                })
            }
            
        }else{
            if(data.emp_info?.lname && data.offices?.length>0 && data.actions?.length>0){
                APILoading('info','Updating info','Please wait');
                let offices= [];
                data.offices.forEach(el=>{
                    offices.push({
                        'dept_code':el.dept_code,
                        'dept_title':el.dept_title
                    })
                })
                var t_data = {
                    emp_id:data.emp_info.emp_id,
                    offices:offices,
                    actions:data.actions,
                }
                const res = await updateDTRConfig(t_data);
                if(res.data.status === 200){
                    updateData(res.data.data)
                    close();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1000
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    text:'Please provide data to all required fields'
                })
            }
        }
        
    }
    return(
        <Box>
        <form onSubmit={handleSubmitUpdate}>
            <Grid container sx={{p:1}} spacing={1}>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                    <TextField label = 'Employee Name' value={`${data.emp_info?.fname} ${formatMiddlename(data.emp_info?.mname)} ${data.emp_info?.lname}`} InputProps={{readOnly:true}} fullWidth/>
                    {/* <Tooltip title='Search Employee'><Button variant="outlined" onClick={()=>setSearchOpen(true)}><PersonSearchIcon/></Button></Tooltip> */}
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox checked={allOffices} onChange={()=>setAllOffices((prev)=>!prev)} fullWidth/>} label="All Department/Office" />
                </Grid>
                {
                    allOffices
                    ?
                    null
                    :
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id={"combo-box-offices"}
                            options={offices}
                            getOptionLabel={(option) => option.dept_title}
                            isOptionEqualToValue={(option, value) => option.dept_title === value.dept_title}
                            sx={{ maxHeight: '40vh',overflow:'auto',pt:1}}
                            fullWidth
                            value = {data.offices}
                            required
                            onChange={(event, newValue) => {
                                setData({
                                    ...data,
                                    offices:newValue
                                })
                            }}
                            multiple
                            disableCloseOnSelect

                            renderInput={(params) => <TextField {...params} label='Office/s *'/>}
                        />
                    </Grid>
                    
                }
                
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id={"combo-box-actions"}
                        options={['PRINT','UPDATE','PROCESS']}
                        // getOptionLabel={(option) => option}
                        // isOptionEqualToValue={(option, value) => option.dept_title === value.dept_title}
                        sx={{ maxHeight: '40vh',overflow:'auto',pt:1}}
                        fullWidth
                        value = {data.actions}
                        onChange={(event, newValue) => {
                            setData({
                                ...data,
                                actions:newValue
                            })
                        }}
                        multiple
                        required
                        renderInput={(params) => <TextField {...params} label='Actions *'/>}
                    />
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant="contained" className="custom-roundbutton" color='success' type="submit">Submit Update</Button>
                    <Button variant="contained" className="custom-roundbutton" color='error' onClick={close}>Cancel</Button>
                </Grid>

                
            </Grid>
        </form>
        <SearchEmpModal open={searchOpen} close = {()=>setSearchOpen(false)} title='Searching Employee' updateSelect={updateSelect} type={1}>
        </SearchEmpModal>
        </Box>
    )
}