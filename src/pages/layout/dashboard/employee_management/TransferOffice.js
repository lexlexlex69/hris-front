import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import axios from 'axios'
import Swal from 'sweetalert2'

import { convertTo64 } from '../../pds/customFunctions/CustomFunctions'

function TransferOffice({ offices, item, handleCloseTransfer, employees, setEmployees }) {
    const [defaultOffice, setDefaultOffice] = useState('')
    const [newOffice, setNewOffice] = useState('')
    const [dateEffective,setDateEffective] = useState('')
    const [file, setFile] = useState('')

    const handleSubmitReassign = async (e) => {
        e.preventDefault()
        Swal.fire('please wait . . .')
        Swal.showLoading()
        let isFile = await convertTo64(file)
        axios.post(`/api/dashboard/employee_management/transferOffice`, {
            old_office: defaultOffice.dept_code,
            office: newOffice,
            emp_no: item.emp_no,
            filer: isFile,
            date_reassign: dateEffective
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    let filterEmployee = employees.filter(x => x.emp_no === item.emp_no)
                    let new_re_assign = []
                    if (filterEmployee.re_assign) {
                        new_re_assign = filterEmployee.re_assign.push({
                            new_dept_id: newOffice,
                            old_dept_id:  defaultOffice.dept_code
                        })
                    }
                    else {
                        new_re_assign.push({
                            new_dept_id: newOffice,
                            old_dept_id:  defaultOffice.dept_code
                        })
                    }

                    let mapEmployee = employees.map(x => {
                        if (x.emp_no === item.emp_no) {
                            return { ...x, re_assign: new_re_assign }
                        }
                        else {
                            return x
                        }
                    })

                    setEmployees(mapEmployee)
                    handleCloseTransfer()
                }
                Swal.close()
            })
            .catch(err => {
                Swal.close()
                console.log(err)
            })
    }
    useEffect(() => { // to check the office of employee
        console.log('offices', offices)
        console.log('offices', item)
        let defOffice = offices.filter(x => x.dept_code === item.dept_code)
        setDefaultOffice(defOffice[0])
    }, [])
    return (
        <Box >
            <form onSubmit={handleSubmitReassign} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography align='center'><u>{item.fname} {item.mname} {item.lname}</u></Typography>
                <Typography sx={{ mt: -1 }} align='center'><small>Employee</small></Typography>
                <hr />
                <Typography sx={{ color: 'primary.main' }} align='center'>Default Office</Typography>
                <Typography sx={{ color: 'primary.main', bgcolor: 'warning.main', color: '#fff', p: .5, borderRadius: '.2rem' }} align='center'>{defaultOffice.dept_title}</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="demo-simple-select-label">ASSIGN TO</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={newOffice}
                        label="ASSIGN TO"
                        defaultValue=''
                        required
                        onChange={(e) => setNewOffice(e.target.value)}
                    >
                        {offices && offices.map((x, index) => (
                            <MenuItem key={index} value={x.dept_code}>{x.dept_title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField sx={{ mt: 1 }} fullWidth  type="date" label="Effective date of re-assignment" value={dateEffective} onChange={(e) => setDateEffective(e.target.value)} focused/>
                <TextField sx={{ mt: 1 }} fullWidth required type="file" label="attachment/memo"  onChange={(e) => setFile(e.target.files[0])} focused />
                <Box sx={{ width: '100%' }}>
                    <Button sx={{ mt: 1, color: '#fff' }} fullWidth variant='contained' color="success" type="submit">Re-assign</Button>
                </Box>
            </form>
        </Box>
    )
}

export default TransferOffice