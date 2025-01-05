import { Alert, Autocomplete, Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SearchEmpModal from '../../../custommodal/SearchEmpModal';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { APIError, APISuccess, formatExtName, formatMiddlename } from '../../../customstring/CustomString';
import { addNewOfficeHead } from '../HeadOfOfficeConfigRequest';
import { APILoading } from '../../../apiresponse/APIResponse';
export const AddHeadOfOffice = ({officeData,setOfficeData,setData,close}) => {
    const [office,setOffice] = useState(null)
    const [employeeInfo,setEmployeeInfo] = useState();
    const [position,setPosition] = useState();
    const [searchModal,setSearchModal] = useState(false)
    const [empName,setEmpName] = useState('')
    const handleSearchData  = (data) => {
        setEmployeeInfo(data)
        setEmpName(`${data.fname} ${formatMiddlename(data.mname)} ${data.lname} ${formatExtName(data.extname)}`)
        setPosition(data.position_name)
        console.log(data)
    }
    const handleSave = async (e) => {
        e.preventDefault();
        try{
            APILoading('info','Saving data','Please wait...')
            let t_data = {
                dept_code:office.dept_code,
                dept_title:office.dept_title,
                short_name:office.short_name,
                emp_id:employeeInfo.id,
                emp_name:empName,
                position:position
            }
            const res = await addNewOfficeHead(t_data)
            if(res.data.status===200){
                APISuccess(res.data.message)
                setData(res.data.data)
                setOfficeData(res.data.data2)
                close()
            }else{
                APIError(res.data.message)
            }
            console.log(t_data)
        }catch(err){
            APIError(err)
        }
        
        
    }
    return (
        <>
        <form onSubmit={handleSave}>
        <Grid container sx={{p:1,gap:1}} spacing={1}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={officeData}
                    value = {office}
                    getOptionLabel={(option) => option.dept_title}
                    onChange={(event,newValue) => {
                        setOffice(newValue);
                        }}
                    renderInput={(params) => <TextField {...params} label="Office/Department" required/>}
                />
            </Grid>
            <Grid item xs={12}>
                <Alert severity="info"><small>Please search the employee first, to be able to get the employee's ID</small></Alert>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                <TextField label='Name' value= {empName} onChange={(val)=>setEmpName(val.target.value)} fullWidth InputLabelProps={{shrink:true}} required/>
                <Button variant='outlined' startIcon={<SearchIcon/>} onClick={()=>setSearchModal(true)}>Search</Button>
            </Grid>
            <Grid item xs={12}>
                <TextField label='Position' value={position} onChange={(val)=>setPosition(val.target.value)} fullWidth InputLabelProps={{shrink:true}} required/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button startIcon={<SaveAltIcon/>} variant='contained' color='success' className='custom-roundbutton' type='submit'>Save</Button>
            </Grid>
        </Grid>
        </form>
        <SearchEmpModal open = {searchModal} close = {()=> setSearchModal(false)} title='Search Employee' type={1} updateSelect = {handleSearchData}/>
        </>
    )
}