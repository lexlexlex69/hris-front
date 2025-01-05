import { React, useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { handleChangeStatusMpr } from '../Controller'
import { RecruitmentContext } from '../../RecruitmentContext';
import CustomBackdrop from '../CustomBackdrop';
import Warnings from '../receivingApplicants/Warnings';
import { Add, AttachFileOutlined, Delete, ForwardToInboxOutlined, Search } from '@mui/icons-material';
import { blue, red } from '@mui/material/colors';
import { Pagination, Skeleton, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import MprCasualEmployeeSelect from './MprCasualEmployeeSelect';
import CommonModal from '../../../../../../common/Modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';
import ApplicationLetterIpcr from '../receivingApplicants/ApplicationLetterIpcr';
import EmailTemplates from '../receivingApplicants/EmailTemplates';


const label = { inputProps: { 'aria-label': 'send notification to' } };

let controller = new AbortController()
const MprCasualReceiving = ({ data, closeDialog, vacancyStatus }) => {
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


    const [employee, setEmployee] = useState({
        employee_id: ''
    })

    const [toSendNotif, setToSendNotif] = useState([])

    const [tableLoader, setTableLoader] = useState(true)
    const [appLetter, setAppLetter] = useState(false)
    const [appLetterData, setAppLetterData] = useState('')
    const [emailTemp, setEmailTemp] = useState(false)
    const [emailTempData, setEmailTempData] = useState('')
    const [snackbarState, setSnackbarState] = useState(false)
    const [snackbarReason, setSnackbarReason] = useState(false)
    const [filter, setFilter] = useState({
        name: ''
    })

    const handleOpenEmailTemp = (item) => {
        setEmailTempData(item)
        setEmailTemp(true)
    }

    const handleCloseEmail = () => {
        setEmailTemp(false)
    }

    const handleOpenAppLetter = (item) => {
        console.log(item)
        setAppLetterData(item)
        setAppLetter(true)
    }
    const handlePaginate = (e, v) => {
        if (v === page)
            return
        else {
            getCasualApplicants(v)
            console.log(toSendNotif)
        }
    }

    const getCasualApplicants = async (pager) => {
        setTableLoader(true)
        let res = await axios.get(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants?page=${pager}&&vacancy_id=${data}&&per_page=${perPage}`)
        console.log(res)
        setTotal(res.data.total)
        let setIsSelectedFalse = res.data.data.map(x => ({ ...x, is_selected: false }))
        let selectedApplicants = setIsSelectedFalse.map(x => toSendNotif.some(y => y.id === x.id) ? ({ ...x, is_selected: true }) : x)
        setApplicant(selectedApplicants)
        setPage(res.data.current_page)
        setTableLoader(false)
    }

    const handleAddEmployee = async () => {
        if (!employee.id) {
            toast.warning('Select employee to add.')
            return
        }
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/add-to-applicant-list`, { employee_id: employee.id, vacancy_id: data })
        console.log(res)
        if (res.data.status === 200) {
            setApplicant(prev => [{ ...res.data?.profile, info: res.data.employee }, ...prev]?.slice(0, perPage))
            setTotal(prev => prev + 1)
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        setStatusBackdrop(false)
    }

    const handleChangeCheckBox = (e, row) => {
        console.log(e, row)
        if (e.target.checked) {
            let selected = applicant.map(x => x.id === row.id ? ({ ...x, is_selected: true }) : x)
            setApplicant(selected)
            setToSendNotif(prev => [...prev, row])
        }

        else {
            let selected = applicant.map(x => x.id === row.id ? ({ ...x, is_selected: false }) : x)
            setApplicant(selected)
            let filterToSend = toSendNotif.filter(x => x.id !== row.id)
            setToSendNotif(filterToSend)
        }
    }

    const handleSendNotif = async () => {
        if (toSendNotif.length === 0)
            toast.warning('Nothing to Notify!')
        else {
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-review-notif`, { data: toSendNotif })
            console.log(res)
            if (res.data.status === 200) {
                let notified = applicant.map(x => toSendNotif.some(y => y.id === x.id) ? ({ ...x, review_notif: 1, is_selected: false }) : x)
                setApplicant(notified)
                setToSendNotif([])
                setSnackbarReason('Notification sent!')
                setSnackbarState(true)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            setStatusBackdrop(false)
        }
    }

    const handleDelete = async (row) => {
        console.log(row)
        Swal.fire({
            title: 'Remove applicant?',
            text: "Remove this from the list!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setStatusBackdrop(true)
                let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-delete-applicant`, { profile_id: row.id })
                console.log(res)
                if (res.data.status === 200) {
                    getCasualApplicants(1)
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
                setStatusBackdrop(false)
            }
        })
    }

    useEffect(() => {
        getCasualApplicants(page)
    }, [])

    useEffect(() => {
        if (snackbarState) {
            setTimeout(() => setSnackbarState(false), 2000)
        }
    }, [snackbarState])

    return (
        <Box height='100%' width='100%'>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={snackbarState}
            // message={snackbarReason}
            >
                <Alert sx={{ width: '100%',bgcolor:'success.dark',color:'#fff' }}>
                    {snackbarReason}
                </Alert>
            </Snackbar>
            <CommonModal open={emailTemp} setOpen={setEmailTemp} customWidth="40%" >
                <EmailTemplates data={emailTempData} handleCloseModal={handleCloseEmail} />
            </CommonModal>
            <CommonModal open={appLetter} setOpen={setAppLetter} title="Application letter / IPCR">
                <ApplicationLetterIpcr data={appLetterData} />
            </CommonModal>
            <CustomBackdrop open={statusBackdrop} title='Processing request. . . ' />
            <Typography variant="body2" color="initial" gutterBottom sx={{ color: 'primary.main', textAlign: 'center', width: '100%' }}>CASUAL RECEIVING OF APPLICANTS</Typography>
            <Box display='flex' alignItems='center' mb={2} mt={2}>
                <MprCasualEmployeeSelect componentTitle='Search employee name to add' optionTitle='fullname' url='/api/recruitment/mpr/job-posting/receiving/employee-select' setTitle={setEmployee} />
                <Tooltip title="Add employee">
                    <Add sx={{ fontSize: '4ch', border: `2px solid ${blue[500]}`, borderRadius: 1, bgcolor: blue[500], ml: 1, color: '#fff', transition: 'all .2s', cursor: 'pointer', '&:hover': { border: `2px solid ${blue[800]}`, bgcolor: blue[800] } }} onClick={handleAddEmployee} />
                </Tooltip>
            </Box >
            <Box display="flex" width='100%'>
                <Warnings arr={[
                    { text: 'Invalid / No email', color: 'error.main' },
                    { text: 'Insider employee', color: 'primary.main' },
                    { text: 'Notified applicant', color: 'success.main' },
                ]} />
            </Box>
            <Typography variant="body2" gutterBottom fontWeight={700} sx={{ color: 'success.main' }}>Selected: {toSendNotif.length}</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Send to</TableCell>
                            <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Name</TableCell>
                            <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Email address</TableCell>
                            <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Telephone / Cell number</TableCell>
                            <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableLoader ? (<>
                            {Array.from(Array(5)).map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {Array.from(Array(5)).map((item, i) => <TableCell key={i}> <Skeleton variant='text' /></TableCell>)}
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
                                            <Checkbox {...label} checked={row?.is_selected} disabled={!row?.info?.emailadd} onChange={(e) => handleChangeCheckBox(e, row)} />
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ color: row?.review_notif ? 'success.main' : row?.employee_id ? 'primary.main' : row?.applicant_id ? 'warning.main' : '' }}>
                                            {row?.info?.fname} {row?.info?.mname} {row?.info?.lname}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.info?.emailadd}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row?.info?.cpno}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Box display='flex' justifyContent='flex-end' gap={1}>
                                                <Tooltip title="Application letter/ OPCR/IPCR">
                                                    <AttachFileOutlined color="success" sx={{ cursor: 'pointer' }} onClick={() => handleOpenAppLetter(row)} />
                                                </Tooltip>
                                                <Tooltip title="Application letter/ OPCR/IPCR">
                                                    <ForwardToInboxOutlined color="warning" sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailTemp(row)} />
                                                </Tooltip>
                                                <Tooltip title="View pds">
                                                    <Link to={`evaluate-pds/${row?.applicant_id ? row?.applicant_id : row?.employee_id}_${data}: ${row?.employee_id ? 'employee' : 'applicant'}`} target={"_blank"}>
                                                        <PersonOutlineIcon />
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip title="Delete row">
                                                    <Delete sx={{ color: row?.is_selected ? '#BEBEBE' : 'error.main', cursor: 'pointer', '&:hover': { color: red[800] }, pointerEvents: row?.is_selected ? 'none' : '' }} onClick={() => handleDelete(row)} />
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination count={Math.ceil(total / perPage)} page={page} onChange={handlePaginate} color='primary' size='small' sx={{ mt: 1 }} />
            <Box display='flex' justifyContent='space-between' alignItems='flex-end' mb={2}>
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
                            <FormControlLabel componentsProps={{ typography: { fontSize: 12 } }} value="SET-EXAM" control={<Radio />} label="EXAMINATION" />
                            <FormControlLabel componentsProps={{ typography: { fontSize: 12 } }} value="SET-INTERVIEW" control={<Radio />} label="INTERVIEW" />
                            <FormControlLabel componentsProps={{ typography: { fontSize: 12 } }} value="ISSUANCE-APPOINTMENT" control={<Radio />} label="ISSUANCE APPOINTMENT" />
                        </RadioGroup>
                    </FormControl>
                    <Button variant='contained' disabled={!proceedStat} color='primary' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={() => handleChangeStatusMpr({}, proceedStat,'RECEIVING', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed next step / status</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default MprCasualReceiving;