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

import { Add, Close, Delete } from '@mui/icons-material';

import { handleChangeStatusMpr } from '../Controller'
import { RecruitmentContext } from '../../RecruitmentContext';
import CustomBackdrop from '../CustomBackdrop';
import Warnings from '../receivingApplicants/Warnings';

import Checkbox from '@mui/material/Checkbox';

import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const label = { inputProps: { 'aria-label': 'send notification to' } };

let controller = new AbortController()
const MprCasualSetExam = ({ data, closeDialog, vacancyStatus }) => {
    console.log(data)

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


    // FNs

    const handleCheckBoxChange = (e, item) => {
        console.log(e.target.checked)
        console.log(item)
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

    const [venue, setVenue] = useState([
        {
            exam_venue: '',
            exam_date: '',
            uid: Date.now().toString(36) + Math.random().toString(36).substring(2)
        }
    ])

    const handleAddRowVenue = () => {
        setVenue(prev => [...prev, {
            exam_venue: '',
            exam_date: '',
            uid: Date.now().toString(36) + Math.random().toString(36).substring(2)
        }])
    }

    const handleRemoveVenue = (uid) => {
        let filteredVenue = venue.filter((item) => item.uid !== uid)
        setVenue(filteredVenue)
        let deleteVenueFromApplicants = applicant.map((item) => {
            if (item.place_date_uid) {
                if (item.place_date_uid === uid) {
                    return { ...item, exam_date: '', exam_venue: '', place_date_uid: '' }
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
        let res = await axios.get(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-exam?page=${pager}&&vacancy_id=${data}&&per_page=${perPage}`)
        console.log(res)
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
                        return { ...item, exam_venue: venueExist[0].exam_venue, exam_date: venueExist[0].exam_date, place_date_uid: e.target.value }
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
        console.log(res)
        setVenueList(res.data)
    }

    const handleSendNotif = async () => {
        if (selectedForNotif.length === 0) {
            toast.warning('Nothing to notify!')
            return
        }
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-send-exam-notif`, { data: selectedForNotif })
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

    // effects

    useEffect(() => {
        let controller = new AbortController()
        getCasualApplicants(page)
        fetchVenue(controller)
    }, [])

    return (
        <Box height='100%' width='100%'>
            <CustomBackdrop open={statusBackdrop} title='Processing request. . . ' />
            <Typography variant="body2" color="initial" sx={{ color: 'primary.main', textAlign: 'center', width: '100%', mb: 2 }}>SET EXAMINATION FOR CASUAL APPLICANTS</Typography>
            <Box display='flex' gap={1}>
                <Box flex={1}  >
                    <Button variant="contained" size='small' color="primary" sx={{ mb: 2 }} endIcon={<Add />} onClick={handleAddRowVenue}>
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
                                        <TextField size='small' fullWidth label="VENUE / PLACE" defaultValue='' value={venue.exam_venue} select name='exam_venue' onChange={(e) => handleChangeVenue(e, item.uid)} >
                                            {venueList && venueList.map((venue, i) => (
                                                <MenuItem key={i} value={venue.venue_name}>{venue.venue_name}</MenuItem>
                                            )
                                            )}
                                        </TextField>
                                        <TextField type='date' label="DATE" value={venue.exam_date} size='small' name='exam_date' focused fullWidth onChange={(e) => handleChangeVenue(e, item.uid)} />
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Box>
                <Box flex={1} width='80%'>
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
                                                    <Checkbox {...label} disabled={row?.place_date_uid && row?.exam_time ? false : true} onChange={(e) => handleCheckBoxChange(e, row)} />
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
                                                    <TextField size='small' label=' ' disabled={!row?.info?.emailadd} type='time' name='exam_time' onChange={(e) => handleChangePlaceDateApplicants(e, row.id)} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField select size='small' fullWidth defaultValue='' disabled={!row?.info?.emailadd} name='place_date_uid' onChange={(e) => handleChangePlaceDateApplicants(e, row.id)}>
                                                        <MenuItem value={''}>NONE</MenuItem>
                                                        {venue && venue.map((item, i) => item.exam_date && item.exam_venue && (
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
                    <Box display='flex' justifyContent='space-between' alignItems='flex-end' width='100%'>
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
                                    <FormControlLabel componentsProps={{ typography: { fontSize: 10 } }} value="EXAM-RESULT" control={<Radio />} label="EXAM-RESULT" />
                                    <FormControlLabel componentsProps={{ typography: { fontSize: 10 } }} value="SET-INTERVIEW" control={<Radio />} label="INTERVIEW" />
                                    <FormControlLabel componentsProps={{ typography: { fontSize: 10 } }} value="ISSUANCE-APPOINTMENT" control={<Radio />} label="ISSUANCE APPOINTMENT" />
                                </RadioGroup>
                            </FormControl>
                            <Button variant='contained' disabled={!proceedStat} color='primary' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={() => handleChangeStatusMpr({}, proceedStat,'SET-EXAM', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed next step / status</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MprCasualSetExam;