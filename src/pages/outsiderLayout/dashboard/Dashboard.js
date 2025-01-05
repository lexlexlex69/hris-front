import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Box, Card, CardContent, Typography, TextField, Fade, Button, CircularProgress, Skeleton } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import moment from 'moment'
import Qs from './qs/Qs';
import MainDashboard from './mainDashboard/MainDashboard';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// images
// mui icons
import DraftsIcon from '@mui/icons-material/Drafts';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'

function Dashboard(props) {

    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // redux
    const dispatch = useDispatch()
    const darkmodeRedux = useSelector(state => state.darkmode)
    const [userStatus, setUserStatus] = useState(1)

    const [applicantStatus, setApplicantStatus] = useState('')

    const checkApplicantStatus = async (controller) => {
        let res = await axios.get('/api/recruitment/applicant/dashboard/checkApplicantStatus', {}, { signal: controller.signal })
        setApplicantStatus(res.data.status)
        if (res.data.status === 3)
            navigate('applicantPds')
    }
    useEffect(() => {
        let controller = new AbortController()
        checkApplicantStatus(controller)
        return () => controller.abort()
    }, [])
    return (
        <Fade in >
            <Grid container spacing={1} sx={{ p: 1 }} className='darkmodeTransition' >
                <CssBaseline />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {applicantStatus === 1 ? <MainDashboard setApplicantStatus={setApplicantStatus} /> : applicantStatus === 0 ? <Qs setApplicantStatus={setApplicantStatus} /> :
                        <Box sx={{ display: 'flex', gap: 2, px: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="80%" height="" animation="pulse" />
                                <Skeleton variant="text" width="80%" height="" animation="pulse" />
                                <Skeleton variant="text" width="60%" height="" animation="pulse" />
                                <Skeleton variant="text" width="60%" height="" animation="pulse" />
                                <Skeleton variant="text" width="60%" height="" animation="pulse" />
                                <Skeleton variant="text" width="70%" height="" animation="pulse" />
                                <Skeleton variant="text" width="70%" height="" animation="pulse" />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                <Skeleton variant="text" width="80%" height="" animation="pulse" />
                                <Skeleton variant="text" width="80%" height="" animation="pulse" />
                                <Skeleton variant="text" width="60%" height="" animation="pulse" />
                                <Skeleton variant="text" width="60%" height="" animation="pulse" />
                                <Skeleton variant="text" width="60%" height="" animation="pulse" />
                                <Skeleton variant="text" width="70%" height="" animation="pulse" />
                                <Skeleton variant="text" width="70%" height="" animation="pulse" />
                            </Box>
                        </Box>}
                </Grid>
            </Grid>
        </Fade>
    )
}

export default Dashboard