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

let timerr = null
let controller = new AbortController()
const MprCasualExamResult = ({ data, closeDialog, vacancyStatus }) => {
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


    const getCasualApplicants = async (pager) => {
        setTableLoader(true)
        let res = await axios.get(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-exam-result?page=${pager}&&vacancy_id=${data}&&per_page=${perPage}`)
        console.log(res)
        setTotal(res.data.total)
        setApplicant(res.data.data)
        setPage(res.data.current_page)
        setTableLoader(false)
    }


    const handleSendNotif = async () => {
        if (selectedForNotif.length === 0) {
            toast.warning('Nothing to notify!')
            return
        }
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-send-result-notif`, { data: selectedForNotif })
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

    const handleChangeApplicantRating = (e, row) => {
        let applicantUpdate = applicant.map((x) => x.id === row.id ? ({ ...x, [e.target.name]: e.target.value }) : x)
        setApplicant(applicantUpdate)
        clearTimeout(timerr)
        timerr = setTimeout(async () => {
            if (isNaN(e.target.value)) {
                toast.error('Rating must be a number with value >  0 and <= to 100')
                return
            }
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-update-exam-score`, { data: row, score: e.target.value })
            console.log(res)
            setStatusBackdrop(false)
        }, 600)
    }

    // effects

    useEffect(() => {
        let controller = new AbortController()
        getCasualApplicants(page)
    }, [])

    return (
        <Box height='100%' width='100%'>
            <CustomBackdrop open={statusBackdrop} title='Processing request. . . ' />
            <Typography variant="body2" color="initial" sx={{ color: 'primary.main', textAlign: 'center', width: '100%', mb: 2 }}>SET EXAMINATION FOR CASUAL APPLICANTS</Typography>
            <Box display='flex' gap={1}>
                <Box flex={1} width='80%'>
                    <Box>
                        <Warnings arr={[
                            { text: 'Invalid / No email', color: 'error.main' },
                            { text: 'Insider employee', color: 'primary.main' }
                        ]} />
                    </Box>
                    <TableContainer component={Paper} >
                        <Table sx={{ minWidth: 400 }} aria-label="simple table" size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Send to</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Name</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Email address</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Telephone / Cell number</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'> Rating</TableCell>
                                    <TableCell sx={{ color: '#fff' }} className='cgb-color-table'> Actions</TableCell>
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
                                                    <Checkbox {...label} disabled={!row?.exam_score} onChange={(e) => handleCheckBoxChange(e, row)} />
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
                                                    <TextField
                                                        id=""
                                                        label=" "
                                                        size='small'
                                                        value={row?.exam_score}
                                                        name='exam_score'
                                                        onChange={(e) => handleChangeApplicantRating(e, row)}
                                                        sx={{ maxWidth: '10ch' }}
                                                    />
                                                </TableCell>
                                                <TableCell>

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
                                    <FormControlLabel componentsProps={{ typography: { fontSize: 12 } }} value="SET-INTERVIEW" control={<Radio />} label="INTERVIEW" />
                                    <FormControlLabel componentsProps={{ typography: { fontSize: 12 } }} value="ISSUANCE-APPOINTMENT" control={<Radio />} label="ISSUANCE APPOINTMENT" />
                                </RadioGroup>
                            </FormControl>
                            <Button variant='contained' disabled={!proceedStat} color='primary' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={() => handleChangeStatusMpr({}, proceedStat,'EXAM-RESULT', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed next step / status</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MprCasualExamResult;