import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { blue, red, orange } from '@mui/material/colors'
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
import Skeleton from '@mui/material/Skeleton';
import Checkbox, { checkboxClasses } from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Modal from '@mui/material/Modal';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FormControlLabel from '@mui/material/FormControlLabel'
import Tooltip from '@mui/material/Tooltip'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify'

import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';
import EmailTemplates from './receivingApplicants/EmailTemplates'
import CustomBackdrop from './CustomBackdrop';
import ProfileApplicants from './receivingApplicants/ProfileApplicants';
import CommonModal from '../../../../../common/Modal';
import ApplicationLetterIpcr from './receivingApplicants/ApplicationLetterIpcr';
import Warnings from './receivingApplicants/Warnings';


const ReceivingApplicants = ({ data, closeDialog }) => {

    let controller = new AbortController()

    const [loader, setLoader] = useState(true)
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState('')
    const handleOpenModal = (item) => {
        setModalData(item)
        setOpenModal(true)
    }
    const handleCloseModal = () => setOpenModal(false)

    const [employee, setEmployee] = useState([])
    const [applicant, setApplicant] = useState([])
    const [defaultEmployee, setDefaultEmployee] = useState([])
    const [defaultApplicant, setDefaultApplicant] = useState([])
    const [employeePage, setEmployeePage] = useState(1)
    const [applicantPage, setApplicantPage] = useState(1)
    const [employeeTotal, setEmployeeTotal] = useState(0)
    const [applicantTotal, setApplicantTotal] = useState(0)
    const [employeeToSend, setEmployeeToSend] = useState([])
    const [applicantToSend, setApplicantToSend] = useState([])

    const [closingDate, setClosingDate] = useState('')
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)
    const perPage = 5 // number of pages/rows to allow for pagination

    // 

    // printing pds for evaluation

    // 

    // modal for applicantion letter
    const [appLetterModal, setAppLetterModal] = useState(false)
    const [appLetter, setAppLetter] = useState(false)
    const [loadAppLetter, setLoadAppLetter] = useState(true)
    const [appLetterModalData, setAppLetterModalData] = useState('')
    const handleOpenAppLetter = (param) => {
        setAppLetterModalData(param)
        setAppLetterModal(true)
    }

    // modal for applicantion letter


    const [openProfileModal, setOpenProfileModal] = useState(false)
    const [profileModalData, setProfileModalData] = useState('')
    const handleOpenProfileModal = async (param, vacancy) => {
        setProfileModalData(param)
        setOpenProfileModal(true)
    }

    const handleCloseProfileModal = () => setOpenProfileModal(false)

    const handleEmployeePaginationPage = (e, v) => {
        if (v === employeePage) {
            return
        }
        let pageStart = (v - 1) * perPage
        let pagEnd = (v - 1) + perPage
        let newTable = defaultEmployee.slice(pageStart, pagEnd)
        setEmployeePage(v)
        setEmployee(newTable)
    }

    const handleApplicantPaginationPage = (e, v) => {
        if (v === applicantPage) {
            return
        }
        let pageStart = (v - 1) * perPage
        let pagEnd = (v - 1) + perPage
        let newTable = defaultApplicant.slice(pageStart, pagEnd)
        setApplicantPage(v)
        setApplicant(newTable)
    }

    const handleCheckBox = (e, item, category) => {
        if (category === 'employee') {
            if (e.target.checked) {
                setEmployeeToSend(prev => [...prev, item])
            }
            else {
                let filtered = employeeToSend.filter((x) => x.applicant_id !== item.applicant_id)
                setEmployeeToSend(filtered)
            }
        }
        else if (category === 'applicant') {
            if (e.target.checked) {
                setApplicantToSend(prev => [...prev, item])
            }
            else {
                let filtered = applicantToSend.filter((x) => x.applicant_id !== item.applicant_id)
                setApplicantToSend(filtered)
            }
        }
    }

    const handleSendNotif = async (category) => {
        if (category === 'employee') {
            if (employeeToSend.length === 0) {
                toast.warning('Please select applicant as recepient!')
                return
            }
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/sendNotification`, { data: employeeToSend, category })
            setStatusBackdrop(false)
            if (res.data.status === 500) {
                toast.error(res.data.message)
                return
            }
            if (res.data.status === 200) {
                let toFilter = [...defaultEmployee]
                res.data.sent_ids.forEach(element => {
                    let index = toFilter.findIndex(x => x.applicant_id === element)
                    toFilter.splice(index, 1)
                });
                let newEmp = employee.map((x) => res.data.sent_ids.some(y => x.applicant_id === y) ? ({ ...x, review_notif: 1 }) : x)
                setEmployee(newEmp)
                if (res.data.failed_ids.length > 0) {
                    toast.error('Some notification were not sent!')
                }
            }
        }
        else if (category === 'applicant') {
            if (applicantToSend.length === 0) {
                toast.warning('Please select applicant as recepient!')
                return
            }
            setStatusBackdrop(true)
            // let filteredApplicant = applicant.filter(item => item.emailadd)
            let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/sendNotification`, { data: applicantToSend, category })
            setStatusBackdrop(false)
            if (res.data.status === 500) {
                toast.error(res.data.message)
                return
            }
            if (res.data.status === 200) {
                let toFilter = [...defaultApplicant]
                res.data.ids.forEach(element => {
                    let index = toFilter.findIndex(x => x.applicant_id === element)
                    toFilter.splice(index, 1)
                });
                let newApp = applicant.map((x) => res.data.sent_ids.some(y => x.applicant_id === y) ? ({ ...x, review_notif: 1 }) : x)
                setApplicant(newApp)
                if (res.data.failed_ids.length > 0) {
                    toast.error('Some notification were not sent!')
                }
            }
        }

    }

    const getVacancyInfo = async () => {
        let res = await axios.get(`/api/recruitment/jobPosting/jobVacancyInfo?vacancyId=${data}`)
        setClosingDate(res.data?.closing_date)
    }

    const getShortList = async (controller) => {
        let res = await axios.get(`/api/recruitment/jobPosting/status/receiving-applicants/getShortList?vacancyId=${data}`, { signal: controller.signal })
        setLoader(false)
        let employees = res.data.filter(item => item.xType === 'Employee')
        let applicants = res.data.filter(item => item.xType === 'Applicant')
        setDefaultEmployee(employees)
        setDefaultApplicant(applicants)
        setEmployeeTotal(employees.length)
        setApplicantTotal(applicants.length)
        setEmployee(employees.slice(0, perPage))
        setApplicant(applicants.slice(0, perPage))
    }

    useEffect(() => {
        getShortList(controller)
        getVacancyInfo(controller)
        return () => controller.abort()
    }, [])

    return (
        <Grid container spacing={2} sx={{ px: 2, py: 1 }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Modal
                    open={openModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: 400 },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '20px',
                        p: 2,
                        pt: 2,
                    }}>
                        <Box display="flex" sx={{ justifyContent: 'flex-end', mb: 0 }}>
                            <CloseIcon onClick={handleCloseModal} color="error" sx={{ cursor: 'pointer' }} />
                        </Box>
                        <EmailTemplates data={modalData} handleCloseModal={handleCloseModal} />
                    </Box>
                </Modal>

                {/* modal for profile setting of educ,train and exp */}
                <CommonModal open={openProfileModal} setOpen={setOpenProfileModal}>
                    <ProfileApplicants data={profileModalData} handleCloseModal={setOpenProfileModal} employee={employee} applicant={applicant} setEmployee={setEmployee} setApplicant={setApplicant} />
                </CommonModal>
                {/* <Modal
                    open={openProfileModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: 500 },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '20px',
                        p: 4,
                        pt: 2,
                    }}>
                        <Box display="flex" sx={{ justifyContent: 'flex-end', mb: 5 }}>
                            <Tooltip title="close" placement="bottom">
                                <Button variant="contained" color="error" onClick={handleCloseProfileModal}>
                                    <CloseIcon />
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                </Modal> */}

                {/* application letter and ipcr modal */}
                <CommonModal open={appLetterModal} setOpen={setAppLetterModal} title="Application Letter/IPCR" customWidth='40%' >
                    <ApplicationLetterIpcr data={appLetterModalData} />
                </CommonModal>

                <CustomBackdrop title='please wait . . . ' open={statusBackdrop} />
                <Typography variant="body1" align="center" sx={{ color: 'warning.main' }}><b>Evaluate Applicants</b></Typography>
                <Warnings arr={[
                    { color: red[500], text: 'No email address' },
                    { color: 'warning.main', text: 'Late application' },
                    { color: 'success.main', text: 'Notified' }
                ]} />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card variant="outlined">
                    <Typography variant="body2" color="initial" align="center" sx={{ p: 1 }}>INTERNAL</Typography>
                    <CardContent>
                        <TableContainer component={Paper} sx={{ height: '300px', maxHeight: '350px' }}>
                            <Table aria-label="internal list table" size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>

                                        </TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}></TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>FULL NAME</TableCell>
                                        <TableCell align="right" sx={{ bgcolor: 'primary.main', color: '#fff' }}>ACTION</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!loader ? (
                                        <>
                                            {employee && employee.map((item, i) => (
                                                <TableRow key={item.id} sx={{ bgcolor: !item.emailadd ? red[500] : Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? orange[200] : '', }}>
                                                    <TableCell component="th" scope="row">
                                                        <FormControlLabel
                                                            size='small'
                                                            label=""
                                                            control={
                                                                <Checkbox
                                                                    size='small'
                                                                    value=""
                                                                    onChange={(e) => handleCheckBox(e, item, 'employee')}
                                                                    color="primary"
                                                                    sx={{
                                                                        [`&, &.${checkboxClasses.checked}`]: {
                                                                            color: item.emailadd ? 'primary.main' : '#fff',
                                                                        },
                                                                    }}
                                                                    disabled={(!item.emailadd) ? true : Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? true : false}

                                                                />
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant="body2" sx={{ color: item.review_notif === 1 ? "success.main" : "" }}>{(((employeePage - 1) * perPage) + (i + 1))}</Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant="body2" sx={{ color: item.review_notif === 1 ? "success.main" : "" }} >{item?.fname?.toLowerCase()} {item?.mname?.toLowerCase()} {item?.lname?.toLowerCase()}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box display="flex" sx={{ justifyContent: 'flex-end', gap: 1 }}>
                                                            <Tooltip title="Application letter / IPCR">
                                                                <AttachFileIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer', pointerEvents: Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? 'none' : '' }}
                                                                    onClick={() => handleOpenAppLetter(item)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title={"Set education,experience and training"}>
                                                                <AccountTreeIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer', pointerEvents: Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? 'none' : '' }}
                                                                    onClick={() => Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? () => { } : handleOpenProfileModal(item, data)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="EMAIL TEMPLATES">
                                                                <ForwardToInboxIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer' }}
                                                                    onClick={() => handleOpenModal(item, 'employee')}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title={Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? "Disabled for late application" : "check information"}>
                                                                <Link to={`evaluate-pds/${item?.applicant_id}_${data}:employee`} target={"_blank"} style={{ pointerEvents: Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? 'none' : '' }}>
                                                                    <PersonIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer' }}
                                                                    />
                                                                </Link>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {employee && employee.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography sx={{ p: .5, bgcolor: 'error.light', borderRadius: .5 }} align="center" color="#fff">Empty!</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {Array.from(Array(5)).map((item, index) => (
                                                <TableRow>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack sx={{ mt: 1 }}>
                            <Pagination count={Math.ceil(employeeTotal / perPage)} page={employeePage} onChange={handleEmployeePaginationPage}></Pagination>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            endIcon={<ArrowForwardIcon />}
                            variant="contained"
                            color="warning"
                            size="small"
                            disabled={employee.length === 0 ? true : false}
                            sx={{ borderRadius: '2rem' }}
                            onClick={() => handleSendNotif('employee')}
                        >
                            send notification / For Examination
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card variant="outlined">
                    <Typography variant="body2" color="initial" align="center" sx={{ p: 1 }}>EXTERNAL</Typography>
                    <CardContent>
                        <TableContainer component={Paper} sx={{ height: '300px', maxHeight: '350px' }}>
                            <Table aria-label="external list table" size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>
                                        </TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}></TableCell>
                                        <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>FULL NAME</TableCell>
                                        <TableCell align="right" sx={{ bgcolor: 'primary.main', color: '#fff' }}>ACTION</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!loader ? (
                                        <>
                                            {applicant && applicant.map((item, i) => (
                                                <TableRow key={item.id} sx={{ bgcolor: !item.emailadd ? red[500] : Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? orange[200] : '' }}>
                                                    <TableCell component="th" scope="row">
                                                        <FormControlLabel
                                                            size='small'
                                                            label=""
                                                            control={
                                                                <Checkbox
                                                                    size='small'
                                                                    value=""
                                                                    onChange={(e) => handleCheckBox(e, item, 'applicant')}
                                                                    sx={{
                                                                        [`&, &.${checkboxClasses.checked}`]: {
                                                                            color: item.emailadd ? 'primary.main' : '#fff',
                                                                        },
                                                                    }}
                                                                    disabled={!item.emailadd ? true : Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? true : false}
                                                                />
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant="body2" sx={{ color: item.review_notif === 1 ? "success.main" : "" }}>{(((applicantPage - 1) * perPage) + (i + 1))}</Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant="body2" sx={{ color: item.review_notif === 1 ? "success.main" : "" }}>{item?.fname?.toLowerCase()} {item?.mname?.toLowerCase()} {item?.lname?.toLowerCase()}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box display="flex" sx={{ justifyContent: 'flex-end', gap: 1 }}>
                                                            <Tooltip title="Application letter / IPCR">
                                                                <AttachFileIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer', pointerEvents: Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? 'none' : '' }}
                                                                    onClick={() => handleOpenAppLetter(item)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Set education,experience and training">
                                                                <AccountTreeIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer', pointerEvents: Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? 'none' : '' }}
                                                                    onClick={() => handleOpenProfileModal(item, data)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Email Templates">
                                                                <ForwardToInboxIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer' }}
                                                                    onClick={() => handleOpenModal(item, 'applicant')}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="check information">
                                                                <Link to={`evaluate-pds/${item?.applicant_id}_${data}:applicant`} target={"_blank"} style={{ pointerEvents: Math.ceil(moment.duration(moment(item.date_applied, 'YYYY-MM-DD').diff(moment(closingDate, 'YYYY-MM-DD'))).asDays()) > 0 ? 'none' : '' }}>
                                                                    <PersonIcon sx={{ border: `2px solid ${!item.emailadd ? '#fff' : blue[500]}`, color: `${!item.emailadd ? '#fff' : blue[500]}`, '&:hover': { color: `${!item.emailadd ? '#BEBEBE' : blue[800]}`, border: `2px solid ${!item.emailadd ? '#BEBEBE' : blue[800]}`, }, p: .5, fontSize: 30, borderRadius: 1, cursor: 'pointer' }}
                                                                    // onClick={() => {
                                                                    //     Swal.fire({
                                                                    //         text: 'Redirecting, please wait . . .',
                                                                    //         icon: 'info'
                                                                    //     })
                                                                    //     Swal.showLoading()
                                                                    //     setTimeout(() => {
                                                                    //         Swal.close()
                                                                    //         // navigate(`/hris/homepage/view-pds/${item.applicant_id}`)
                                                                    //         navigate(`evaluate-pds/${item.applicant_id}`)
                                                                    //     }, 1000)
                                                                    // }}
                                                                    // onClick={() => handleViewPds(item?.applicant_id)}
                                                                    />
                                                                </Link>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {applicant && applicant.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography sx={{ p: .5, bgcolor: 'error.light', borderRadius: .5 }} align="center" color="#fff">Empty!</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {Array.from(Array(5)).map((item, index) => (
                                                <TableRow>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack sx={{ mt: 1 }}>
                            <Pagination count={Math.ceil(applicantTotal / perPage)} page={applicantPage} onChange={handleApplicantPaginationPage}></Pagination>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            endIcon={<ArrowForwardIcon />}
                            variant="contained"
                            color="warning"
                            size="small"
                            disabled={applicant.length === 0 ? true : false}
                            sx={{ borderRadius: '2rem' }}
                            onClick={() => handleSendNotif('applicant')}
                        >
                            send notification / For Examination
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button disabled={employee.length === 0 && applicant.length === 0 ? true : false} variant="contained" color="primary" sx={{ borderRadius: '2rem', mt: 1 }} endIcon={<ArrowForwardIcon />} onClick={e => handleChangeStatus({
                    empArr: employee,
                    appArr: applicant
                }, 'SET-EXAM', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>
                    proceed to next step/status
                </Button>
            </Grid>
        </Grid>
    );
};

export default React.memo(ReceivingApplicants);