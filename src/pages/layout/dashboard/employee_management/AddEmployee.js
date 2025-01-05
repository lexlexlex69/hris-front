import { Alert } from '@mui/lab';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CommonBackdrop from '../../../../common/Backdrop';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddEmployee = ({ loadOffices,closeModal,employees,setEmployees,setTotalPage,totalPage,setPage,perPage }) => {
    const [inputState, setInputState] = useState({
        fname: '',
        mname: '',
        lname: '',
        dob: '',
        empStatus: '',
        referenceId: '',
        office: ''
    })
    const [commonBackdrop, setCommonBackdrop] = useState(false)
    const handleChange = (e) => {
        setInputState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCommonBackdrop(true)
        try {
            let res = await axios.post(`/api/dashboard/employee_management/storeEmployeeInfo`, inputState)
            setCommonBackdrop(false)
            console.log(res)
            if (res.data.status === 200) {
                toast.success('Employee information added!')
                closeModal(false)
                let tempEmp = [...employees]
                tempEmp.push({
                    employee_id:'',
                    emp_fname:inputState.fname,
                    emp_mname:inputState.mname,
                    emp_lname:inputState.lname,
                    emp_dob:inputState.dob,
                    dept_code:inputState.office,
                    hris_test_lyxs_emp_no:inputState.referenceId,
                    dept_title: loadOffices.find((x) => x.dept_code ===inputState.office).dept_title
                })
                if(tempEmp.length > 10)
                {
                    tempEmp = tempEmp.slice(1,tempEmp.length)
                    setPage(Math.ceil((totalPage+1)/perPage))
                    setTotalPage(prev => prev + 1)
                }
                setEmployees(tempEmp)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
        catch (err) {
            toast.error(err.message)
        }

    }
    return (
        <Box>
            <CommonBackdrop open={commonBackdrop} title="Saving information to Lysx reference table." />
            <form onSubmit={handleSubmit}>
                <Alert severity='warning'>Note: Make sure the employee  id reference to leyxs system is correct!</Alert>
                <Alert severity='info'>New account will be first added to Lyxs reference table. You can then add it to employee and make a user's account later, on table's Actions.</Alert>
                <Box display='flex' gap={1} mt={2} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        id=""
                        label="FIRST NAME"
                        size='small'
                        fullWidth
                        required
                        name="fname"
                        value={inputState.fname}
                        onChange={handleChange}
                    />
                    <TextField
                        id=""
                        label="MIDDLE NAME"
                        size='small'
                        fullWidth
                        required
                        name="mname"
                        value={inputState.mname}
                        onChange={handleChange}
                    />
                    <TextField
                        id=""
                        label="LAST NAME"
                        size='small'
                        fullWidth
                        required
                        name="lname"
                        value={inputState.lname}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">STATUS</InputLabel>
                        <Select
                            size="small"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            variant="outlined"
                            label="STATUS"
                            name="empStatus"
                            value={inputState.empStatus}
                            defaultValue=''
                            required
                            onChange={handleChange}
                        >
                            <MenuItem value='RE'>PERMANENT</MenuItem>
                            <MenuItem value='TE'>TEMPORARY</MenuItem>
                            <MenuItem value='PA'>PRESIDENTIAL APPOINTEE</MenuItem>
                            <MenuItem value='CT'>CO-TERMINOS</MenuItem>
                            <MenuItem value='CR'>CONTRACTUAL</MenuItem>
                            <MenuItem value='CS'>CASUAL</MenuItem>
                            <MenuItem value='JO'>JOB ORDER</MenuItem>
                            <MenuItem value='CT'>CONSULTANT</MenuItem>
                            <MenuItem value='COS'>CONTRACT OF SERVICE</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box display='flex' gap={1} mt={2} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        id=""
                        label="LEXES ID NO REFERENCE"
                        size='small'
                        fullWidth
                        required
                        value={inputState.referenceId}
                        name="referenceId"
                        onChange={handleChange}
                    />
                    <TextField
                        id=""
                        focused
                        label="date of birth"
                        type='date'
                        size='small'
                        fullWidth
                        name="dob"
                        value={inputState.dob}
                        required
                        onChange={handleChange}
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">OFFICE</InputLabel>
                        <Select
                            size="small"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={inputState.office}
                            variant="outlined"
                            label="OFFICE"
                            required
                            name="office"
                            onChange={handleChange}
                        >
                            {loadOffices && loadOffices.map((item, index) => (
                                <MenuItem key={index} value={item.dept_code}>{item.dept_title}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Box>
                <Box display='flex' justifyContent='flex-end' mt={2}>
                    <Button variant='contained' type='submit' sx={{ borderRadius: '2rem' }} startIcon={<ArrowForward />}>Submit</Button>
                </Box>
            </form>
        </Box>
    );
};

export default AddEmployee;