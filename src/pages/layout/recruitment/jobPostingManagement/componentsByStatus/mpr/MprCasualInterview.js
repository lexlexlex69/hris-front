import { React, useState, useRef, useContext, useEffect } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';

import { Add, Close, CloseFullscreen, Delete, DisabledByDefault, Edit, InterpreterMode } from '@mui/icons-material';

import { handleChangeStatusMpr } from '../Controller'
import { RecruitmentContext } from '../../RecruitmentContext';
import CustomBackdrop from '../CustomBackdrop';
import Warnings from '../receivingApplicants/Warnings';
import MprCasualEmployeeSelect from './MprCasualEmployeeSelect';

import Checkbox from '@mui/material/Checkbox';

import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Tooltip } from '@mui/material';
import { orange } from '@mui/material/colors';

const label = { inputProps: { 'aria-label': 'send notification to' } };

let controller = new AbortController()
const MprCasualInterview = ({ data, closeDialog, vacancyStatus }) => {

    // state
    const [applicant, setApplicant] = useState([])
    // context for handling changes to status when clicking proceed to next status
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)
    const [proceedStat, setProceedStat] = useState('')
    // backdrop
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    // pagination
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const perPage = 5
    const [dontShowNotif, setDontShowNotif] = useState(false)
    const [venueList, setVenueList] = useState([])
    const [tableLoader, setTableLoader] = useState(true)
    const [selectedForNotif, setSelectedForNotif] = useState([])

    // for interview assessment form states
    const [interviewAssessmentForm, setInterviewAssessmentForm] = useState({
        human_resource: '',
        Immediate_head: '',
        next_level_head: ''
    })

    const [hrEmployee, setHrEmployee] = useState({
        id: '',
        fullname: ''
    })
    const [imEmployee, setImEmployee] = useState({
        id: '',
        fullname: ''
    })
    const [nlhEmployee, setNlhEmployee] = useState({
        id: '',
        fullname: ''
    })

    const [updateRater, setUpdateRater] = useState(false)

    const [venue, setVenue] = useState([
        {
            interview_venue: '',
            interview_date: '',
            uid: Date.now().toString(36) + Math.random().toString(36).substring(2)
        }
    ])

    // FNs

    const handleSubmitRater = async () => {
        if (!hrEmployee.id && !imEmployee.id && !nlhEmployee.id) {
            toast.warning('Nothing to set as Rater')
            return
        }
        else {
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-set-rater`, { hr: hrEmployee, im: imEmployee, nlh: nlhEmployee, vacancy_id: data })
            console.log(res)
            setStatusBackdrop(false)
        }
    }

    const handleCheckBoxChange = (e, item) => {
        if (e.target.checked) {
            setSelectedForNotif(prev => [...prev, item])
        }
        else {
            let checkIfAdded = selectedForNotif.filter(x => x.id !== item.id)
            setSelectedForNotif(checkIfAdded)
        }
    }

    const handlePaginate = (e, v) => {
        if (page === v)
            return
        else {
            if (dontShowNotif) {
                getCasualApplicants(v)
            }
            else {
                Swal.fire({
                    title: 'Make sure to send notification to this batch.',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Continue',
                    denyButtonText: `Don't show this message`,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        getCasualApplicants(v)
                    } else if (result.isDenied) {
                        setDontShowNotif(true)
                        getCasualApplicants(v)
                    }
                })
            }

        }
    }


    const handleAddRowVenue = () => {
        setVenue(prev => [...prev, {
            interview_venue: '',
            interview_date: '',
            uid: Date.now().toString(36) + Math.random().toString(36).substring(2)
        }])
    }

    const handleRemoveVenue = (uid) => {
        let filteredVenue = venue.filter((item) => item.uid !== uid)
        setVenue(filteredVenue)
        let deleteVenueFromApplicants = applicant.map((item) => {
            if (item.place_date_uid) {
                if (item.place_date_uid === uid) {
                    return { ...item, interview_date: '', interview_venue: '', place_date_uid: '' }
                }
                else {
                    return item
                }
            }
            else
                return item
        })
        setApplicant(deleteVenueFromApplicants)
    }


    const getCasualApplicants = async (pager) => {
        setTableLoader(true)
        let res = await axios.get(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-interview?page=${pager}&&vacancy_id=${data}&&per_page=${perPage}`)
        setTotal(res.data.total)
        setApplicant(res.data.data)
        setPage(res.data.current_page)
        setTableLoader(false)
    }

    const handleChangeVenue = (e, uid) => {
        let addedVenueData = venue.map((item, i) => item.uid === uid ? ({ ...item, [e.target.name]: e.target.value }) : item)
        setVenue(addedVenueData)
    }

    const handleChangePlaceDateApplicants = (e, id) => {
        let addedDataApplicants = applicant.map((item) => {
            if (item.id === id) {
                if (e.target.name !== 'place_date_uid') {
                    return { ...item, [e.target.name]: e.target.value }
                }
                else {
                    let venueExist = venue.filter((x) => x.uid === e.target.value)
                    if (venueExist.length > 0) {
                        return { ...item, interview_venue: venueExist[0].interview_venue, interview_date: venueExist[0].interview_date, place_date_uid: e.target.value }
                    }
                    else {
                        return item
                    }
                }
            }
            else {
                return item
            }
        })
        setApplicant(addedDataApplicants)
    }

    const fetchVenue = async (controller) => {
        const res = await axios.post(`/api/recruitment/jobPosting/getVenue`, {}, { signal: controller.signal })
        setVenueList(res.data)
    }

    const handleSendNotif = async () => {
        if (selectedForNotif.length === 0) {
            toast.warning('Nothing to notify!')
            return
        }
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-send-interview-notif`, { data: selectedForNotif,vacancy_id:data })
        console.log(res)
        if (res.data.status === 200) {
            getCasualApplicants(1)
            setSelectedForNotif([])
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        setStatusBackdrop(false)
    }

    const fetchRater = async () => {
        let res = await axios.get(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-get-rater?vacancy_id=${data}`)
        if (res.data.length > 0) {
            let hr = res.data.filter(x => x.type === 'hr')
            if (hr.length > 0) {
                setHrEmployee(hr[0])
            }

            let im = res.data.filter(x => x.type === 'im')
            if (im.length > 0) {
                setImEmployee(im[0])
            }

            let nlh = res.data.filter(x => x.type === 'nlh')
            if (nlh.length > 0) {
                setNlhEmployee(nlh[0])
            }

            console.log(hr, im, nlh)

        }
    }


    // effects

    useEffect(() => {
        let controller = new AbortController()
        getCasualApplicants(page)
        fetchVenue(controller)
        fetchRater()
    }, [])

    return (
        <Box height='100%' width='100%'>
            <CustomBackdrop open={statusBackdrop} title='Processing request. . . ' />
            <Typography variant="body2" color="initial" sx={{ color: 'primary.main', textAlign: 'center', width: '100%', mb: 2 }}>SET INTERVIEW FOR CASUAL APPLICANTS</Typography>
            <Box display='flex' gap={1}>
                <Box flex={1}  >
                    <Button variant="contained" size='small' color="primary" sx={{ mb: 2, borderRadius: '2rem' }} endIcon={<Add />} onClick={handleAddRowVenue}>
                        PLACE DATE
                    </Button>
                    <Box sx={{ overflowY: 'scroll', maxHeight: '70vh', px: 5, py: 2 }}>
                        <Box display='flex' flexDirection='column' gap={1} >
                            {venue && venue.map((item, i) => (
                                <Card raised>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box display='flex' justifyContent='space-between'>
                                            <Typography variant="body2" color="warning.main">Venue {i + 1}</Typography>
                                            {i > 0 &&
                                                <Close color='error' sx={{ cursor: 'pointer' }} onClick={() => handleRemoveVenue(item.uid)} />
                                            }
                                        </Box>
                                        <TextField size='small' fullWidth label="VENUE / PLACE" defaultValue='' value={venue.interview_venue} select name='interview_venue' onChange={(e) => handleChangeVenue(e, item.uid)} >
                                            {venueList && venueList.map((venue, i) => (
                                                <MenuItem key={i} value={venue.venue_name}>{venue.venue_name}</MenuItem>
                                            )
                                            )}
                                        </TextField>
                                        <TextField type='date' label="DATE" value={venue.interview_date} size='small' name='interview_date' focused fullWidth onChange={(e) => handleChangeVenue(e, item.uid)} />
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Box>
                <Box flex={1} width='80%'>
                    <Card sx={{ p: 2, mb: 1 }} elevation={2}>
                        <Typography variant="body2" color="primary" gutterBottom>Set interview assessment rater</Typography>
                        <Box display='flex' justifyContent='flex-end' gap={1} >
                            {!updateRater ? (
                                <>
                                    <TextField fullWidth size='small' label="Human resource rater" value={hrEmployee?.fullname}></TextField>
                                    <TextField fullWidth size='small' label="Immediate head rater" value={imEmployee?.fullname}></TextField>
                                    <TextField fullWidth size='small' label="Next level head rater" value={nlhEmployee?.fullname}></TextField>
                                </>
                            ) : (<>
                                <MprCasualEmployeeSelect componentTitle='Human resource rater' defaultValue={hrEmployee?.fullname} rater optionTitle='fullname' url='/api/recruitment/mpr/job-posting/receiving/employee-select' setTitle={setHrEmployee} />
                                <MprCasualEmployeeSelect componentTitle='Immediate head rater' defaultValue={imEmployee?.fullname} rater optionTitle='fullname' url='/api/recruitment/mpr/job-posting/receiving/employee-select' setTitle={setImEmployee} />
                                <MprCasualEmployeeSelect componentTitle='Next level head rater' defaultValue={nlhEmployee?.fullname} rater optionTitle='fullname' url='/api/recruitment/mpr/job-posting/receiving/employee-select' setTitle={setNlhEmployee} />
                            </>)}

                        </Box>
                        <Box display='flex' justifyContent='space-between' sx={{ mt: 1 }}>
                            <Button variant='contained' sx={{ borderRadius: '2rem' }} color={updateRater ? 'error' : 'warning'} startIcon={updateRater ? <Close /> : <Edit />} onClick={() => setUpdateRater(prev => !prev)} >{updateRater ? 'CLOSE' : 'UPDATE'}</Button>
                            {updateRater &&
                                <Button variant='contained' sx={{ borderRadius: '2rem' }} startIcon={<ArrowForward />} onClick={handleSubmitRater} >submit</Button>
                            }
                        </Box>
                    </Card>
                    <Box>
                        <Warnings arr={[
                            { text: 'Invalid / No email', color: 'error.main' },
                            { text: 'Insider employee', color: 'primary.main' }
                        ]} />
                    </Box>
                    <TableContainer component={Paper} >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Send to</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Name</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Email address</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Telephone / Cell number</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'> Time</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'> Venue</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableLoader ? (<>
                                    {Array.from(Array(5)).map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {Array.from(Array(6)).map((item, i) => <TableCell key={i}> <Skeleton variant='text' /></TableCell>)}
                                        </TableRow>
                                    ))}
                                </>) : (
                                    <>
                                        {applicant && applicant.map((row, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>
                                                    <Checkbox {...label} disabled={row?.place_date_uid && row?.interview_time ? false : true} onChange={(e) => handleCheckBoxChange(e, row)} />
                                                </TableCell>
                                                <TableCell component="th" scope="row" sx={{ color: !row.info?.emailadd ? 'error.main' : row?.employee_id ? 'primary.main' : row?.applicant_id ? 'warning.main' : '' }}>
                                                    {row?.info?.fname} {row?.info?.mname} {row?.info?.lname}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row?.info?.emailadd}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row?.info?.cpno}
                                                </TableCell>
                                                <TableCell>
                                                    <TextField size='small' label=' ' disabled={!row?.info?.emailadd} type='time' name='interview_time' onChange={(e) => handleChangePlaceDateApplicants(e, row.id)} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField select size='small' fullWidth defaultValue='' disabled={!row?.info?.emailadd} name='place_date_uid' onChange={(e) => handleChangePlaceDateApplicants(e, row.id)}>
                                                        <MenuItem value={''}>NONE</MenuItem>
                                                        {venue && venue.map((item, i) => item.interview_date && item.interview_venue && (
                                                            <MenuItem value={item.uid}>Venue {i + 1}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination count={Math.ceil(total / perPage)} page={page} color='primary' size='small' sx={{ mt: 1 }} onChange={handlePaginate} />
                    <Box display='flex' justifyContent='space-between' alignItems='flex-end'>
                        <Button variant='contained' color='warning' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={handleSendNotif}>Send Notifications</Button>
                        <Box display='flex' alignItems='flex-end' flexDirection='column'>
                            <FormControl>
                                <FormLabel id="status-choices">PROCEED TO</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="status-choices"
                                    name="row-radio-status-choices"
                                    value={proceedStat}
                                    onChange={(e) => setProceedStat(e.target.value)}
                                >
                                    <FormControlLabel componentsProps={{ typography: { fontSize: 10 } }} value="INTERVIEW-RESULT" control={<Radio />} label="INTERVIEW-RESULT" />
                                    <FormControlLabel componentsProps={{ typography: { fontSize: 10 } }} value="ISSUANCE-APPOINTMENT" control={<Radio />} label="ISSUANCE APPOINTMENT" />
                                </RadioGroup>
                            </FormControl>
                            <Button variant='contained' disabled={!proceedStat} color='primary' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={() => handleChangeStatusMpr({}, proceedStat,'SET-INTERVIEW', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed next step / status</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MprCasualInterview;