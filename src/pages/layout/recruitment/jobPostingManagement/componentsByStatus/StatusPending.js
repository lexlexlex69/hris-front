import React, { useState, useEffect, useContext } from 'react'
import { red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton'
import FunctionsIcon from '@mui/icons-material/Functions';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add'

import axios from 'axios';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

import AddEmployeeApplicant from './status-pending/AddEmployeeApplicant';
import { handleChangeStatus } from './Controller'
import { RecruitmentContext } from '../RecruitmentContext';
import CustomBackdrop from './CustomBackdrop';
import Warnings from './receivingApplicants/Warnings';

const StatusPending = ({ data, closeDialog, vacancyStatus }) => {
    // backdrop state
    const [open, setOpen] = useState(true);
    const [loader, setLoader] = useState({
        internal: true,
        external: true
    });
    const handleClose = () => {
        setOpen(false);
    };

    const [statusBackdrop, setStatusBackdrop] = useState(false)
    // context
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)

    // dialog states for adding employee and applicant
    const [openEmployee, setOpenEmployee] = useState(false)
    const handleOpenEmployee = () => setOpenEmployee(true)
    const handleCloseEmployee = () => setOpenEmployee(false)

    const [openApplicant, setOpenApplicant] = useState(false)
    const handleOpenApplicant = () => setOpenApplicant(true)
    const handleCloseApplicant = () => setOpenApplicant(false)
    // 

    const [employeeList, setEmployeeList] = useState([])
    const [applicantList, setApplicantList] = useState([])

    const perPage = 5

    const [page, setPage] = useState({
        internal: 1,
        external: 1
    })
    const [total, setTotal] = useState({
        internal: 0,
        external: 0
    })

    const handleInternalPaginate = (e, v) => {
        if (page.internal === v) {
            return
        }
        setPage(prev => ({ ...prev, internal: v }))
        let controller = new AbortController()
        setLoader(prev => ({ ...prev, internal: true }))
        fetchShortListInternal(controller, v)
    }

    const handleExternalPaginate = (e, v) => {
        if (page.external === v) {
            return
        }
        setPage(prev => ({ ...prev, external: v }))
        let controller = new AbortController()
        setLoader(prev => ({ ...prev, external: true }))
        setLoader(prev => ({ ...prev, external: true }))
        fetchShortListExternal(controller, v)
    }

    const fetchShortListInternal = async (controller, pager) => {
        let internal = await axios.post('/api/recruitment/fetchShortListToNotifyForVacancy', { vacancy_id: data, page: pager ? pager : page.internal, category: 0, perPage }, { signal: controller.signal })
        Swal.close()
        if (internal) {
            setOpen(false)
            setEmployeeList(internal.data?.data)
            setTotal(prev => ({ ...prev, internal: internal.data.total }))
            setLoader(prev => ({ ...prev, internal: false }))
        }

    }

    const fetchShortListExternal = async (controller, pager) => {
        let external = await axios.post('/api/recruitment/fetchShortListToNotifyForVacancy', { vacancy_id: data, page: pager ? pager : page.external, category: 1, perPage }, { signal: controller.signal })
        Swal.close()
        if (external) {
            setOpen(false)
            setApplicantList(external.data?.data)
            setTotal(prev => ({ ...prev, external: external.data.total }))
            setLoader(prev => ({ ...prev, external: false }))
        }
    }

    const handleSendNotif = async (category) => {
        Swal.fire({
            text: "Send Notices?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({ text: 'Sending notifications..., please wait!', icon: 'info' })
                Swal.showLoading()
                if (category === 0) {
                    let internal = await axios.post(`/api/recruitment/sendNotifToShortlisted`, { category: 0, data: employeeList, vacancyId: data })
                    if (internal.data.status === 200) {
                        toast.success('Notification sent', { autoClose: 2000 })
                        setLoader(prev => ({ ...prev, internal: true }))
                        let controller = new AbortController()
                        fetchShortListInternal(controller)
                    }
                    Swal.close()
                }
                else if (category === 1) {
                    let external = await axios.post(`/api/recruitment/sendNotifToShortlisted`, { category: 1, data: applicantList, vacancyId: data })
                    if (external.data.status === 200) {
                        toast.success('Notification sent', { autoClose: 2000 })
                        setLoader(prev => ({ ...prev, external: true }))
                        let controller = new AbortController()
                        fetchShortListExternal(controller)
                    }
                    Swal.close()
                }
            }
        })
    }

    const handleRecalculate = async () => {
        Swal.fire({
            text: "Manually added employee/applicant will be removed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: 'Deleting ranking records . . .',
                    icon: 'warning',
                    allowOutsideClick: false
                })
                Swal.showLoading()
                const res = await axios.post(`/api/recruitment/jobPosting/status/pending/reCalculate`, { id: data })
                Swal.close()
                Swal.fire({
                    text: 'Re-calculating ranking, please wait . . .',
                    icon: 'info',
                    allowOutsideClick: false
                })
                Swal.showLoading()
                fetchShortListInternal(controller)
                fetchShortListExternal(controller)
            }
        })
    }

    let controller = new AbortController()

    useEffect(() => {
        fetchShortListInternal(controller)
        fetchShortListExternal(controller)
        if (vacancyStatus === 'PENDING') {
            handleChangeStatus('RANKING', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)
        }
        return () => controller.abort()
    }, [data])


    return (
        <Grid container spacing={2} sx={{ px: 2, py: 1, position: 'relative', height: 'calc(100vh - 66px)' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomBackdrop title='please wait . . . ' open={statusBackdrop} />
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
                    open={open}
                >
                    <Typography variant="h5" color="#fff">Generating the list</Typography>
                    <Typography variant="h6" color="#fff">This may take few moments</Typography>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Typography
                    variant="body1"
                    align="center"
                    sx={{ color: 'warning.main' }}
                >
                    <b>Insider / Outsider applicants short list</b>
                </Typography>
                <Box display="flex" justifyContent='flex-end'>
                    <Button variant='contained' startIcon={<RefreshIcon />} sx={{ borderRadius: '2rem' }} size="small" color="warning" onClick={() => handleRecalculate()}>Refresh (short listed)</Button>
                </Box>
                <Warnings arr={[
                    { color: red[500], text: 'No  email address' }
                ]} />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                <Card variant="outlined" sx={{ width: { xs: '100%', md: '50%' } }}>
                    <Typography variant="body1" color="initial" align="center" sx={{ p: 1 }}>INTERNAL</Typography>
                    <CardContent sx={{ pt: 0 }}>

                        <AddEmployeeApplicant openDialog={openEmployee} handleClose={handleCloseEmployee} type='employee' vacancyId={data} fetchShortList={fetchShortListInternal} setLoader2={setLoader} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" size='small' sx={{ borderRadius: '2rem', px: 2 }} startIcon={<AddIcon />} onClick={handleOpenEmployee}>
                                Employee
                            </Button>
                        </Box>

                        <TableContainer component={Paper} sx={{ height: '350px', maxHeight: '350px' }}>
                            <Table aria-label="external list table" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Firstname</TableCell>
                                        <TableCell align="left">Middlename</TableCell>
                                        <TableCell align="left">Lastname</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="left">Contact</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        !loader.internal ?
                                            <>
                                                {employeeList.map((employee, i) => (
                                                    <TableRow key={i} sx={{ bgcolor: employee.emailadd ? '' : red[300] }}>
                                                        <TableCell component="th" scope="row">{employee.fname}</TableCell>
                                                        <TableCell align="left">{employee.mname}</TableCell>
                                                        <TableCell align="left">{employee.lname}</TableCell>
                                                        <TableCell align="left">{employee?.emailadd}</TableCell>
                                                        <TableCell align="left">{employee.cpno}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                            :
                                            <>
                                                {Array.from(Array(5)).map((x, i) => (
                                                    <Fade in>
                                                        <TableRow key={i}>
                                                            <TableCell component="th" scope="row"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                        </TableRow>
                                                    </Fade>
                                                ))}
                                            </>
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack sx={{ mt: 1 }}>
                            <Pagination count={Math.ceil(total.internal / perPage)} page={page.internal} onChange={handleInternalPaginate}></Pagination>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            endIcon={<ArrowForwardIcon />}
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={e => handleSendNotif(0)}
                            sx={{ borderRadius: '2rem' }}
                            disabled={employeeList.length !== 0 ? false : true}
                        >
                            send notification
                        </Button>
                    </CardActions>
                </Card>
                <Card variant="outlined" sx={{ width: { xs: '100%', md: '50%' } }}>
                    <Typography variant="body1" color="initial" align="center" sx={{ p: 1 }}>EXTERNAL</Typography>
                    <CardContent sx={{ pt: 0 }}>
                        <AddEmployeeApplicant openDialog={openApplicant} handleClose={handleCloseApplicant} type='applicant' vacancyId={data} fetchShortList={fetchShortListExternal} setLoader2={setLoader} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" size='small' sx={{ borderRadius: '2rem', px: 2 }} startIcon={<AddIcon />} onClick={handleOpenApplicant}>
                                Applicant
                            </Button>
                        </Box>
                        <TableContainer component={Paper} sx={{ height: '350px', maxHeight: '350px' }}>
                            <Table aria-label="external list table" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Firstname</TableCell>
                                        <TableCell align="left">Middlename</TableCell>
                                        <TableCell align="left">Lastname</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="left">Contact</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        !loader.external ?
                                            <>
                                                {applicantList.map((employee, i) => (
                                                    <TableRow key={i} sx={{ bgcolor: employee.emailadd ? '' : red[300] }}>
                                                        <TableCell component="th" scope="row">{employee.fname}</TableCell>
                                                        <TableCell align="left">{employee.mname}</TableCell>
                                                        <TableCell align="left">{employee.lname}</TableCell>
                                                        <TableCell align="left">{employee.emailadd}</TableCell>
                                                        <TableCell align="left">{employee.cpno}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                            :
                                            <>
                                                {Array.from(Array(5)).map((x, i) => (
                                                    <Fade in>
                                                        <TableRow key={i}>
                                                            <TableCell component="th" scope="row"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                            <TableCell align="right"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                        </TableRow>
                                                    </Fade>
                                                ))}
                                            </>
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack sx={{ mt: 1 }}>
                            <Pagination count={Math.ceil(total.external / perPage)} page={page.external} onChange={handleExternalPaginate}></Pagination>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            endIcon={<ArrowForwardIcon />}
                            variant="contained"
                            color="warning"
                            size="small"
                            sx={{ borderRadius: '2rem' }}
                            disabled={applicantList.length !== 0 ? false : true}
                            onClick={e => handleSendNotif(1)}
                        >
                            send notification
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Button variant="contained" color="primary" sx={{ borderRadius: '2rem', mt: 1 }} endIcon={<ArrowForwardIcon />} onClick={() => handleChangeStatus({
                        empArr: employeeList,
                        appArr: applicantList
                    },'RECEIVING', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>
                    proceed to next step/status
                </Button>
            </Grid>
        </Grid>
    );
};

export default React.memo(StatusPending);