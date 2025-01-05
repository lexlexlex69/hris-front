import { Grid,InputLabel,Select,MenuItem,FormControl, TextField, Button, Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchEmpModal from '../../../../custommodal/SearchEmpModal';
import { APIError, APISuccess, formatExtName, formatMiddlename, formatName } from '../../../../customstring/CustomString';
import { addApprover, addEncoder, getAllOffices, getDivisions, updateApproverData, updateEncoderData } from '../../WorkSchedConfigRequests';
import { APILoading } from '../../../../apiresponse/APIResponse';
export const UpdateWorkSchedUser = ({close,updateEncoder,updateApprover,type,selectedUpdate}) => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedEmployee,setSelectedEmployee] = useState('')
    const [empName,setEmpName] = useState('')
    const [openSearch,setOpenSearch] = useState(false)
    const [offices,setOffices] = useState([]);
    const [selectedOffice,setSelectedOffice] = useState(null);
    const [divisionsData,setDivisionsData] = useState([])
    const [selectedDivision,setSelectedDivision] = useState(null)
    useEffect(()=>{
        console.log(selectedUpdate)
        setEmpName(formatName(selectedUpdate.fname,selectedUpdate.mname,selectedUpdate.lname,selectedUpdate.extname))
        setSelectedType(type)
        _init();
    },[])
    const _init = async () =>{
        const res = await getAllOffices();
        setOffices(res.data)
        const office = res.data.filter(el=>el.dept_code === selectedUpdate.dept_code);
        setSelectedOffice(office[0]);
        if(type === 'ENCODER'){
            //get divisions
            const res2 = await getDivisions({dept_code:office[0].dept_code})
            console.log(res2.data)
            setDivisionsData(res2.data.data)
            if(selectedUpdate.div_code){
                const division = res2.data.data.filter(el=>el.dept_div_id === selectedUpdate.div_code);
                setSelectedDivision(division[0])
            }
            

        }
    }
    const handleChangeType = (event) => {
        setSelectedType(event.target.value);
    };
    const updateSelect = (data)=>{
        setSelectedEmployee(data)
        setEmpName(`${data.fname} ${formatMiddlename(data.mname)} ${data.lname} ${formatExtName(data.extname)}`)
        console.log(data)
    }
    const handleSelectOffice = async (val) => {
        setSelectedOffice(val)
        if(val){
            //get divisions
            const res = await getDivisions({dept_code:val.dept_code})
            setDivisionsData(res.data.data)
        }
        setSelectedDivision(null)

    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            if(selectedType === 'ENCODER'){
                APILoading('info','Updating Encoder','Please wait...')
                let t_data = {
                    id:selectedUpdate.emp_sched_encoder_id,
                    dept_code:selectedOffice.dept_code,
                    div_code:selectedDivision?.dept_div_id
                }
                const res = await updateEncoderData(t_data)
                if(res.data.status === 200){
                    updateEncoder(res.data.data)
                    APISuccess(res.data.message)
                    close()
                }else{
                    APIError(res.data.message)
                }
            }else{
                APILoading('info','Updating Approver','Please wait...')
                let t_data = {
                    id:selectedUpdate.emp_sched_approver_id,
                    dept_code:selectedOffice.dept_code
                }
                const res = await updateApproverData(t_data)
                if(res.data.status === 200){
                    updateApprover(res.data.data)
                    APISuccess(res.data.message)
                    close()
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
                    {/* <Button variant='outlined' onClick={()=>setOpenSearch(true)}>Search</Button> */}
                </Grid>
                <Grid item xs={12}>
                    <TextField label='User Type' value={type} InputProps={{readOnly:true}} fullWidth/>
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