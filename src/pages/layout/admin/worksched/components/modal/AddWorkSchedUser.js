import { Grid,InputLabel,Select,MenuItem,FormControl, TextField, Button, Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchEmpModal from '../../../../custommodal/SearchEmpModal';
import { APIError, APISuccess, formatExtName, formatMiddlename } from '../../../../customstring/CustomString';
import { addApprover, addEncoder, getAllOffices, getDivisions } from '../../WorkSchedConfigRequests';
import { APILoading } from '../../../../apiresponse/APIResponse';
export const AddWorkSchedUser = ({close,updateEncoder,updateApprover}) => {
    const [type,setType] = useState(['ENCODER','APPROVER']);
    const [selectedType, setSelectedType] = useState('');
    const [selectedEmployee,setSelectedEmployee] = useState('')
    const [empName,setEmpName] = useState('')
    const [openSearch,setOpenSearch] = useState(false)
    const [offices,setOffices] = useState([]);
    const [selectedOffice,setSelectedOffice] = useState(null);
    const [divisionsData,setDivisionsData] = useState([])
    const [selectedDivision,setSelectedDivision] = useState(null)
    useEffect(()=>{
        _init();
    },[])
    const _init = async () =>{
        const res = await getAllOffices();
        setOffices(res.data)
    }
    const handleChangeType = (event) => {
        setSelectedType(event.target.value);
    };
    const updateSelect = (data)=>{
        setSelectedEmployee(data)
        setEmpName(`${data.fname} ${formatMiddlename(data.mname)} ${data.lname} ${formatExtName(data.extname)}`)
        console.log(data)
        let t_office = offices.filter(el=>el.dept_code === data.dept_code);
        if(t_office.length>0){
            setSelectedOffice(t_office[0])
        }
    }
    const handleSelectOffice = async (val) => {
        setSelectedOffice(val)
        if(val){
            //get divisions
            const res = await getDivisions({dept_code:val.dept_code})
            console.log(res.data)
            setDivisionsData(res.data.data)
        }
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            if(selectedType === 'ENCODER'){
                APILoading('info','Adding new Encoder','Please wait...')
                let t_data = {
                    emp_id:selectedEmployee.id,
                    dept_code:selectedOffice.dept_code,
                    div_code:selectedDivision?.dept_div_id
                }
                const res = await addEncoder(t_data)
                if(res.data.status === 200){
                    updateEncoder(res.data.data)
                    APISuccess(res.data.message)
                }else{
                    APIError(res.data.message)
                }
            }else{
                APILoading('info','Adding new Approver','Please wait...')
                let t_data = {
                    emp_id:selectedEmployee.id,
                    dept_code:selectedOffice.dept_code
                }
                const res = await addApprover(t_data)
                if(res.data.status === 200){
                    updateApprover(res.data.data)
                    APISuccess(res.data.message)
                }else{
                    APIError(res.data.message)
                }
                console.log(t_data)
            }
            
        }catch(err){
            APIError(err)
        }
    }
    return(
        <>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{display:'flex'}}>
                    <TextField label = 'Employee Name' value = {empName} InputProps={{readOnly:true}} fullWidth/>
                    <Button variant='outlined' onClick={()=>setOpenSearch(true)}>Search</Button>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="user-type-select-label">User Type</InputLabel>
                        <Select
                        labelId="user-type-select-label"
                        id="user-type-select-label"
                        value={selectedType}
                        label="User Type"
                        onChange={handleChangeType}
                        required
                        >
                        {
                            type.map((item)=>{
                                return (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="dept-box"
                        options={offices}
                        getOptionLabel={(option) => option.dept_title}
                        isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code}

                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Department" required/>}
                        value={selectedOffice}
                        onChange={(event,newValue)=>{
                            handleSelectOffice(newValue)
                        }}
                        required
                    />
                
                </Grid>
                {   selectedType === 'ENCODER'
                    ?
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id="div-box"
                            options={divisionsData}
                            getOptionLabel={(option) => option.div_name}
                            isOptionEqualToValue={(option, value) => option.dept_div_id === value.dept_div_id}

                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Division"/>}
                            value={selectedDivision}
                            onChange={(event,newValue)=>{
                                setSelectedDivision(newValue)
                            }}
                        />
                    
                    </Grid>
                    :
                    null
                }
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant='contained' className='custom-roundbutton' color='success' type='submit'>Submit</Button>
                    <Button variant='contained' className='custom-roundbutton' color='error' type='submit' onClick={close}>Cancel</Button>
                </Grid>

                
            </Grid>
        </form>

        <SearchEmpModal open = {openSearch} close = {()=>setOpenSearch(false)} title='Searching Employee' updateSelect = {updateSelect} type={1}>
            </SearchEmpModal>
        </>

    )
}