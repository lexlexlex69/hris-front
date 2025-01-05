import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';

import axios from 'axios';
import { toast } from 'react-toastify';

import OrgCard from './organization/OrgCard';
import CommonBackdrop from '../../../../common/Backdrop';

const OrgStruc = () => {
    const [dept, setDept] = useState([])
    const [org, setOrg] = useState(null)
    const [selectedDept, setSelectedDept] = useState('')
    const [loader, setLoader] = useState(false)

    // functions
    const fetchDept = async () => {
        let res = await axios.get(`/api/dashboard/employee_management/fetch-department-org`)
        setDept(res.data)
    }

    const searchOrg = async () => {
        setLoader(true)
        try {
            let res = await axios.post(`/api/dashboard/employee_management/fetch-search-org`, { dept_code: selectedDept })
            setOrg(res.data)
            console.log(res)
        }
        catch (err) {
            toast.error(err)
        }
        setLoader(false)
    }

    useEffect(() => {
        let controller = new AbortController()
        fetchDept()
        return (() => controller.abort())
    }, [])

    return (
        <Box sx={{ height: '85vh' }} >
            <CommonBackdrop open={loader} setOpen={setLoader} title="Preparing the organizational structure..." />
            <Typography color='primary' align='center' >Department / Offices / Section / Unit plotting</Typography>
            <Box display='flex' justifyContent='center' alignItems='flex-start'>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-helper-label">Select department</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Select departments"
                        value={selectedDept}
                        size='small'
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        {dept && dept.map((item, i) => (
                            <MenuItem value={item.dept_code}>{item.title}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>select department to view organization structure</FormHelperText>
                </FormControl>
                <SearchIcon color='primary' sx={{ fontSize: '2rem', cursor: 'pointer', '&:hover': { color: 'primary.dark' }, marginTop: 1.5 }} onClick={searchOrg} />
            </Box>
            {org && (
                <Box display='flex' justifyContent='center'  >
                    <OrgCard data={org} searchOrg={searchOrg} />
                </Box>
            )}

        </Box>
    );
};


export default OrgStruc;