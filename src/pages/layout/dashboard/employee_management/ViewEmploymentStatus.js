import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import TourIcon from '@mui/icons-material/Tour';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { getEmployeeStatus } from './Controller'

function ViewEmploymentStatus() {
    const empParam = useParams()
    const [employee, setEmployee] = useState('')
    useEffect(() => {
        getEmployeeStatus(empParam.id, setEmployee)
    }, [])
    return (
        <Box sx={{ flex: 1, px: 2 }}>
            {/* <Typography sx={{ color: 'primary.main' }}>
                Employment status
            </Typography> */}
            <Grid container spacing={2}>
                <Grid item xs={12} xm={12} md={3} lg={3}>
                    <Card raised sx={{ p: 2, height: '85vh' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <AccountCircleIcon sx={{ fontSize: '7rem', color: 'primary.main' }} />
                            {employee ? (<Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', color: 'primary.main', alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', color: 'primary.main', alignItems: 'flex-start' }}>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>NAME: {employee.emp_fname} {employee.emp_mname} {employee.emp_lname}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>GENDER: {employee.sex}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>OFFICE: {employee.dept_title}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>EMP_STATUS: {employee.emp_type === 1 ? 'PERMANENT' : null}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>ITEM NO: {employee.item_no}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>STATUS: {employee.inactive === 0 ? 'ACTIVE' : 'INACTIVE'}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>BIO ID: {employee.bio_id}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>ACTL SALARY: {employee.actl_salary}</Typography>
                                        <Typography variant="p" sx={{ textAlign: 'center' }}>AUTH SALARY: {employee.auth_salary}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', color: 'primary.main', alignItems: 'flex-start',width:'100%',mt:1 }}>
                                        <Typography sx={{bgcolor:'primary.main',width:'100%',px:1,color:'#fff',textAlign:'center'}}>ACTIONS</Typography>
                                        <Box sx={{mt:2,display:'flex',gap:1}}>
                                            <Button variant="contained" color="warning" size="small">transfer office</Button>
                                            <Button variant="contained" color="warning" size="small">transfer office</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>) : (
                                <>
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                    <Skeleton variant='text' height={25} width="80%" />
                                </>
                            )}
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} xm={12} md={9} lg={9}>

                </Grid>
            </Grid>

        </Box>
    )
}

export default ViewEmploymentStatus