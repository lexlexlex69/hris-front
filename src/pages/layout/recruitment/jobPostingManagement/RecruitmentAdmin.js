import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { blue, red, green, orange, deepPurple, yellow } from '@mui/material/colors'
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
import CssBaseline from '@mui/material/CssBaseline';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Modal from '@mui/material/Modal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// mui icons
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ReplayIcon from '@mui/icons-material/Replay';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

// context
import { RecruitmentContext } from './RecruitmentContext';
import { useReactToPrint } from 'react-to-print';
// components

import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '@mui/material/Tooltip'
import moment from 'moment';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// custom components
import ClosedPositionNotif from './ClosedPositionNotif';
import CustomDialog from '../components/CustomDialog';
import CscForm9 from './printables/CscForm9';
import Form1 from './printables/CscForm1';
import { getAllJobPost, handlePostPosition, handleReOpenPosition, revertStatus } from './Controller';
import { customSorting } from '../CommonFunctions';
import AddPosition from './AddPosting';
import CustomBackdrop from './componentsByStatus/CustomBackdrop';

// for status dialogs permanent
import StatusPending from './componentsByStatus/StatusPending';
import ReceivingApplicants from './componentsByStatus/ReceivingApplicants';
import ExamShortlist from './componentsByStatus/ExamShortlist';
import SetExam from './componentsByStatus/SetExam';
import ExamResult from './componentsByStatus/ExamResult';
import SetInterview from './componentsByStatus/SetInterview';
import PositionPanelist from './componentsByStatus/PositionPanelist';
import InterviewResult from './componentsByStatus/InterviewResult';
import InterviewShortlist from './componentsByStatus/InterviewShortlist';
import IssuanceAppointment from './componentsByStatus/IssuanceAppointment';
import IssuanceShortlist from './componentsByStatus/IssuanceShortlist';
import DetailsPage from './DetailsPage';
import Venue from './Venue';

// for status mpr
import MprCasualPending from './componentsByStatus/mpr/MprCasualPending';
import MprCasualReceiving from './componentsByStatus/mpr/MprCasualReceiving';
import MprCasualSetExam from './componentsByStatus/mpr/MprCasualSetExam';
import MprCasualExamResult from './componentsByStatus/mpr/MprCasualExamResult';
import MprCasualInterview from './componentsByStatus/mpr/MprCasualInterview';
import MprCasualInterviewResult from './componentsByStatus/mpr/MprCasualInterviewResult';
import MprIssuanceAppointment from './componentsByStatus/mpr/MprIssuanceAppointment';
import MprJoCosPending from './componentsByStatus/mpr/MprJoCosPending';
import MprJoCosReceiving from './componentsByStatus/mpr/MprJoCosReceiving';


const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function RecruitmentAdmin() {
    // select
    const [form, setForm] = React.useState('');
    const handleChangePrintForm = (event) => {
        setForm(event.target.value);
    };
    // for printing state
    const printCsForm9 = useRef();
    const handlePrintCsForm9 = useReactToPrint({
        content: () => printCsForm9.current,
    });
    const printCsForm1 = useRef();
    const handlePrintCsForm1 = useReactToPrint({
        content: () => printCsForm1.current,
    });

    // details modal
    const [openDetails, setOpenDetails] = useState(false);
    const [detailsModalState, setDetailsModalState] = useState('')
    const handleOpenDetails = row => {
        setDetailsModalState(row)
        setOpenDetails(true)
    };
    const handleCloseDetails = () => setOpenDetails(false);

    // venue modal
    const [openVenue, setOpenVenue] = useState(false)
    const handleCloseVenue = () => setOpenVenue(false)

    // add new position dialog
    const [openPosition, setOpenPosition] = useState(false)
    const handleOpenPosition = () => setOpenPosition(true)
    const handleClosePosition = () => setOpenPosition(false)

    // csc form 9 modal
    const [openform9, setOpenForm9] = useState(false)
    const handleCloseForm9 = () => setOpenForm9(false)
    // status dialog
    const [openStatus, setOpenStatus] = useState(false)
    const [vacancyStatus, setVacancyStatus] = useState('')
    const [vacancyData, setVacancyData] = useState(false)
    const [currentPositionInfo, setCurrentPositionInfo] = useState('')
    const handleOpenStatus = (row, status) => {
        setCurrentPositionInfo(row)
        setVacancyData(row.job_vacancies_id)
        setVacancyStatus(status)
        setOpenStatus(true)
    }
    const handleCloseStatus = () => setOpenStatus(false)
    // 
    const [triggerfilter, setTriggerFilter] = useState(false)
    // panelist dialog
    const [openPanelist, setOpenPanelist] = useState(false)
    const handleOpenPanelist = (row, status) => {
        setVacancyData(row)
        setOpenPanelist(true)
    }
    const handleClosePanelist = () => setOpenPanelist(false)
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // navigate
    const navigate = useNavigate()
    const [loader, setLoader] = useState(null)
    const [pos, setPos] = useState([])

    const [closedPostionTrigger, setClosePositionTrigger] = useState(false)
    // pagination
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const perPage = 5
    const handlePaginate = (e, v) => {
        if (page === v) {
            return
        }
        let controller = new AbortController()
        setLoader(false)
        setPage(v)
        getAllJobPost(setPos, setLoader, controller, filters, v, setPage, setTotal, perPage)
    }

    const [filters, setFilters] = useState({
        posting_date: '',
        closing_date: '',
        emp_status: '',
        position_name: '',
        vacancy_status: ''
    })

    // reopen position handle Function
    const handleReOpenPositionFn = (item) => {
        Swal.fire({
            text: "Proceed re-opening position?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then((result) => {
            if (result.isConfirmed) {
                handleReOpenPosition(item, setReOpenTrigger)
            }
        })
    }

    // reopen position trigger state
    const [reopenTrigger, setReOpenTrigger] = useState(false)

    // checkbox state
    const [checkBoxData, setCheckBoxData] = useState([])

    const handleCheckBox = (e, item) => {
        if (e.target.checked) {
            let tempCheckBoxData = [...checkBoxData]
            tempCheckBoxData.push(item)
            setCheckBoxData(tempCheckBoxData)
        }
        else {
            let tempData = checkBoxData.filter(x => x.job_vacancies_id !== item.job_vacancies_id)
            setCheckBoxData(tempData)
        }
    }

    // context
    const handleVacancyStatusContext = (id, status) => {
        let updatePos = [...pos]
        let newPos = updatePos.map(x => x.job_vacancies_id === id ? ({ ...x, vacancy_status: status }) : x)
        setPos(newPos)
    }

    const handleChangeFilters = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handlePrintCscForms = async () => {
        Swal.fire({
            text: 'processing, please wait . . .',
            icon: 'warning'
        })
        Swal.showLoading()
        if (form === "csc-9") {
            // handlePrintCsForm9()
            setOpenForm9(true)
        }
        else if (form === 'csc-1') {
            handlePrintCsForm1()
        }
        else if (form === 'csc-11') {

        }
        Swal.close()
    }

    // for mpr 


    // 

    const [mprSubmitTrigger, setMprSubmitTrigger] = useState(false)
    const mprSubmitTriggerRef = useRef(true)

    useEffect(() => {
        if (mprSubmitTriggerRef.current) {
            mprSubmitTriggerRef.current = false
        }
        else {
            setLoader(false)
            let controller = new AbortController()
            getAllJobPost(setPos, setLoader, controller, filters, page, setPage, setTotal, perPage)
        }
    }, [mprSubmitTrigger])

    useEffect(() => {
        setLoader(false)
        let controller = new AbortController()
        getAllJobPost(setPos, setLoader, controller, filters, page, setPage, setTotal, perPage)
        return () => controller.abort()
    }, [triggerfilter, closedPostionTrigger])

    // reopen trigger to fetch all posted jobs
    useEffect(() => {
        let controller = new AbortController()
        if (reopenTrigger) {
            getAllJobPost(setPos, setLoader, controller, filters, 1, setPage, setTotal, perPage)
            setReOpenTrigger(false)
        }
    }, [reopenTrigger])

    return (
        <RecruitmentContext.Provider value={{ handleVacancyStatusContext }}>
            {/* details modal */}
            <Modal
                open={openDetails}
                onClose={handleCloseDetails}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    height: '90%',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    pt: 2,
                }}>
                    <DetailsPage data={detailsModalState} />
                </Box>
            </Modal>
            <CustomDialog open={openform9} handleClose={handleCloseForm9} fullScreen={true}>
                <CscForm9 vacancyList={checkBoxData} handleCloseDialog={handleClosePosition} />
            </CustomDialog>
            <div style={{ display: 'none' }}>
                <div ref={printCsForm9}>

                </div>
            </div>
            <div style={{ display: 'none' }}>
                <div ref={printCsForm1}>
                    <Form1 vacancyList={checkBoxData} />
                </div>
            </div>

            <Box sx={{ flexGrow: 1, backgroundSize: '100% 100%', backgroundPosition: 'center', overflow: 'hidden', height: matches ? 'calc(100vh - 66px)' : 'auto' }}>
                <CustomDialog open={openPosition} handleClose={handleClosePosition} fullScreen={false}>
                    <AddPosition pos={pos} setPos={setPos} handleCloseDialog={handleClosePosition} setMprSubmitTrigger={setMprSubmitTrigger} />
                </CustomDialog>
                <CustomDialog open={openPanelist} handleClose={handleClosePanelist} fullScreen={false} specifyWidth='80vw'>
                    <PositionPanelist data={vacancyData} handleCloseDialog={handleClosePosition} />
                </CustomDialog>
                <CustomDialog open={openVenue} handleClose={handleCloseVenue} fullScreen={false} specifyWidth='60vw'>
                    <Venue handleCloseDialog={handleClosePosition} />
                </CustomDialog>
                {/* for status dialog */}
                <CustomDialog open={openStatus} jobPostingModal handleClose={handleCloseStatus} fullScreen={false} specifyWidth={vacancyStatus === 'SET-INTERVIEW' ? '95vw' : '95vw'} currentPositionInfo={currentPositionInfo} >
                    {currentPositionInfo?.plantilla_id ? (<>
                        <Box display='flex' justifyContent="flex-end" pt="10px" sx={{ pr: { xs: '10px', md: '100px' }, mb: '-15px' }}>
                            {vacancyStatus !== 'PENDING' && vacancyStatus !== 'RANKING' &&
                                <Tooltip title={
                                    vacancyStatus === 'RECEIVING' ? 'GO BACK TO RANKING' :
                                        vacancyStatus === 'EXAM-SHORTLIST' ? 'GO BACK TO RECEIVING' :
                                            vacancyStatus === 'SET-EXAM' ? 'GO BACK TO EXAM-SHORTLIST' :
                                                vacancyStatus === 'EXAM-RESULT' ? 'GO BACK TO SET-EXAM' :
                                                    vacancyStatus === 'INTERVIEW-SHORTLIST' ? 'GO BACK TO EXAM-SHORTLIST' :
                                                        vacancyStatus === 'SET-INTERVIEW' ? 'GO BACK TO INTERVIEW-SHORTLIST' :
                                                            vacancyStatus === 'INTERVIEW-RESULT' ? 'GO BACK TO SET-INTERVIEW' :
                                                                vacancyStatus === 'ISSUANCE-SHORTLIST' ? 'GO BACK TO INTERVIEW-RESULT' :
                                                                    vacancyStatus === 'ISSUANCE-APPOINTMENT' ? 'GO BACK TO INTERVIEW-SHORTLIST' : 'INTERVIEW-RESULT'
                                }>
                                    <span>
                                        <KeyboardBackspaceIcon sx={{ fontSize: 50, cursor: 'pointer' }} color='error'
                                            onClick={() => revertStatus(
                                                vacancyStatus === 'RECEIVING' ? 'RANKING' : vacancyStatus === 'EXAM-SHORTLIST' ? 'SET-EXAM' : vacancyStatus === 'SET-EXAM' ? 'RECEIVING' : vacancyStatus === 'EXAM-RESULT' ? 'EXAM-SHORTLIST' : vacancyStatus === 'INTERVIEW-SHORTLIST' ? 'EXAM-SHORTLIST' : vacancyStatus === 'SET-INTERVIEW' ? 'INTERVIEW-SHORTLIST' : vacancyStatus === 'INTERVIEW-RESULT' ? 'SET-INTERVIEW' : vacancyStatus === 'ISSUANCE-SHORTLIST' ? 'INTERVIEW-RESULT' : vacancyStatus === 'ISSUANCE-APPOINTMENT' ? 'ISSUANCE-SHORTLIST' : ''
                                                , vacancyData, pos, setPos, handleCloseStatus)} />
                                    </span>
                                </Tooltip>
                            }
                        </Box>
                        {vacancyStatus === 'PENDING' && <StatusPending data={vacancyData} closeDialog={handleCloseStatus} vacancyStatus={vacancyStatus} />}
                        {vacancyStatus === 'RANKING' && <StatusPending data={vacancyData} closeDialog={handleCloseStatus} vacancyStatus={vacancyStatus} />}
                        {vacancyStatus === 'RECEIVING' && <ReceivingApplicants data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'EXAM-SHORTLIST' && <ExamShortlist data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'SET-EXAM' && <SetExam data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'EXAM-RESULT' && <ExamResult data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'SET-INTERVIEW' && <SetInterview data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'INTERVIEW-RESULT' && <InterviewResult data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'INTERVIEW-SHORTLIST' && <InterviewShortlist data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'ISSUANCE-SHORTLIST' && <IssuanceShortlist data={vacancyData} closeDialog={handleCloseStatus} />}
                        {vacancyStatus === 'ISSUANCE-APPOINTMENT' && <IssuanceAppointment data={vacancyData} closeDialog={handleCloseStatus} />}
                    </>) : currentPositionInfo.mpr_id ? (
                        <>
                            <Box display='flex' justifyContent="center" pt="10px" sx={{ px: { xs: '10px', md: '100px' }, mb: '-15px' }}>
                                {vacancyStatus === 'PENDING' && currentPositionInfo.emp_status === 'CS' && <MprCasualPending data={vacancyData} closeDialog={handleCloseStatus} />}
                                {vacancyStatus === 'PENDING' && (currentPositionInfo.emp_status === 'JO' || currentPositionInfo.emp_status === 'COS') && <MprJoCosPending data={vacancyData} closeDialog={handleCloseStatus} />}
                                {vacancyStatus === 'RECEIVING' && currentPositionInfo.emp_status === 'CS' && <MprCasualReceiving data={vacancyData} closeDialog={handleCloseStatus} />}
                                {vacancyStatus === 'RECEIVING' && (currentPositionInfo.emp_status === 'JO' || currentPositionInfo.emp_status === 'COS') && <MprJoCosReceiving data={vacancyData} closeDialog={handleCloseStatus} />}
                                {vacancyStatus === 'SET-EXAM' && currentPositionInfo.emp_status !== 'RE' && <MprCasualSetExam data={vacancyData} closeDialog={handleCloseStatus} />}
                                {vacancyStatus === 'EXAM-RESULT' && currentPositionInfo.emp_status !== 'RE' && <MprCasualExamResult data={vacancyData} closeDialog={handleCloseStatus} />}
                                {vacancyStatus === 'SET-INTERVIEW' && currentPositionInfo.emp_status !== 'RE' && <MprCasualInterview data={vacancyData} closeDialog={handleCloseStatus} />}
                                {vacancyStatus === 'INTERVIEW-RESULT' && currentPositionInfo.emp_status !== 'RE' && <MprCasualInterviewResult data={vacancyData} closeDialog={handleCloseStatus} currentPositionInfo={currentPositionInfo} />}
                                {vacancyStatus === 'ISSUANCE-APPOINTMENT' && currentPositionInfo.emp_status !== 'RE' && <MprIssuanceAppointment data={vacancyData} currentPositionInfo={currentPositionInfo} closeDialog={handleCloseStatus} />}
                            </Box>
                        </>
                    ) : ''}

                </CustomDialog>
                <Grid container sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', px: 2, pt: 2 }} >
                    <CssBaseline />
                    <Box display='flex' justifyContent='flex-end' mb={2} mr={2} width='100%'>
                        <ClosedPositionNotif setClosePositionTrigger={setClosePositionTrigger} />
                        <Tooltip title="Set examination/interview venue">
                            <CorporateFareIcon color='warning' sx={{ fontSize: 40, cursor: 'pointer' }} onClick={() => setOpenVenue(true)} />
                        </Tooltip>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexDirection: matches ? 'column' : 'row' }}>
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                                {loader ? (
                                    <Button startIcon={<AddIcon />} sx={{ maxWidth: '150px' }} fullWidth variant='contained' size='small' onClick={handleOpenPosition}>Add posting</Button>
                                ) : (
                                    <Skeleton width="15%" height={25} />
                                )}


                                {loader ? (
                                    <>
                                        <FormControl sx={{ ml: 3, mr: 1 }} fullWidth>
                                            <InputLabel id="demo-simple-select-label">CSC FORMS</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={form}
                                                label="CSC FORMS"
                                                onChange={handleChangePrintForm}
                                                size="small"
                                            >
                                                <MenuItem value="csc-9">CSC FORM 9</MenuItem>
                                                <MenuItem value="csc-1">CSC FORM 1</MenuItem>
                                                <MenuItem value="csc-2">CSC FORM 2</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button variant='contained' onClick={(e) => handlePrintCscForms(e)}><LocalPrintshopIcon /></Button>
                                    </>
                                ) : (
                                    <Skeleton width="15%" height={25} />
                                )}

                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                                <Tooltip title="clear filters">
                                    <IconButton aria-label="" onClick={() => setFilters({
                                        posting_date: '',
                                        closing_date: '',
                                        emp_status: '',
                                        position_name: ''
                                    })}>
                                        <FilterAltOffIcon />
                                    </IconButton>
                                </Tooltip>

                                <TextField
                                    fullWidth
                                    size='small'
                                    label="Publication Date"
                                    focused
                                    name="posting_date"
                                    value={filters.posting_date}
                                    onChange={handleChangeFilters}
                                    id="outlined-start-adornment"
                                    type="date"
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label="Publication End-Date"
                                    focused
                                    name="closing_date"
                                    value={filters.closing_date}
                                    onChange={handleChangeFilters}
                                    id="outlined-start-adornment"
                                    type="date"
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Employment status</InputLabel>
                                    <Select
                                        fullWidth
                                        size='small'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Employment status"
                                        name="emp_status"
                                        value={filters.emp_status}
                                        onChange={handleChangeFilters}
                                    >
                                        <MenuItem value=''>NONE</MenuItem>
                                        <MenuItem value='RE'>PERMANENT</MenuItem>
                                        <MenuItem value='JO'>JO</MenuItem>
                                        <MenuItem value='COS'>COS</MenuItem>
                                        <MenuItem value='CA'>CASUAL</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    size='small'
                                    fullWidth
                                    label="search position"
                                    id="outlined-start-adornment"
                                    name="position_name"
                                    value={filters.position_name}
                                    onChange={handleChangeFilters}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start"></InputAdornment>,
                                    }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                    <Select
                                        fullWidth
                                        size='small'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Status"
                                        name="vacancy_status"
                                        value={filters.vacancy_status}
                                        onChange={handleChangeFilters}
                                    >
                                        <MenuItem value=''>ALL</MenuItem>
                                        <MenuItem value='PENDING'>PENDING</MenuItem>
                                        <MenuItem value='RANKING'>RANKING</MenuItem>
                                        <MenuItem value='RECEIVING'>RECEIVING</MenuItem>
                                        <MenuItem value='EXAM-SHORTLIST'>EXAM-SHORTLIST</MenuItem>
                                        <MenuItem value='SET-EXAM'>SET-EXAM</MenuItem>
                                        <MenuItem value='EXAM-RESULT'>EXAM-RESULT</MenuItem>
                                        <MenuItem value='INTERVIEW-SHORTLIST'>INTERVIEW-SHORTLIST</MenuItem>
                                        <MenuItem value='SET-INTERVIEW'>SET-INTERVIEW</MenuItem>
                                        <MenuItem value='INTERVIEW-RESULT'>INTERVIEW-RESULT</MenuItem>
                                        <MenuItem value='INTERVIEW-SHORTLIST'>INTERVIEW-SHORTLIST</MenuItem>
                                        <MenuItem value='CLOSED'>CLOSED</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box display='flex' alignItems='center'>
                                    <SearchIcon color={!loader ? '#5C5C5C' : 'primary'} sx={{ pointerEvents: !loader ? 'none' : '', fontSize: 35 }} onClick={e => setTriggerFilter(prev => !prev)} />
                                </Box>
                            </Box>
                        </Box>
                        <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                            <Table size="small" stickyHeader >
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Post job
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box>
                                                    Position title (Parenthetical title, If applicable)
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', m: 0, p: 0 }}>
                                                    <ArrowDropUpIcon onClick={() => customSorting('asc', pos, 'position_title', setPos)} sx={{ cursor: 'pointer', mb: -.5, '&:hover': { color: 'blue' }, transition: 'all .3s' }} />
                                                    <ArrowDropDownIcon onClick={() => customSorting('desc', pos, 'position_title', setPos)} sx={{ cursor: 'pointer', mt: -.5, '&:hover': { color: 'blue' }, transition: 'all .3s' }} />
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Plantilla item No. / MPR No.</TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box>
                                                    Salary/ Job/ Pay Grade
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', m: 0, p: 0 }}>
                                                    <ArrowDropUpIcon onClick={() => customSorting({ order: 'asc', type: 'number' }, pos, 'salary_grade', setPos)} sx={{ cursor: 'pointer', mb: -.5, '&:hover': { color: 'blue' }, transition: 'all .3s' }} />
                                                    <ArrowDropDownIcon onClick={() => customSorting({ order: 'desc', type: 'number' }, pos, 'salary_grade', setPos)} sx={{ cursor: 'pointer', mt: -.5, '&:hover': { color: 'blue' }, transition: 'all .3s' }} />
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box>
                                                    Monthly salary
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', m: 0, p: 0 }}>
                                                    <ArrowDropUpIcon onClick={() => customSorting({ order: 'asc', type: 'number' }, pos, 'monthly_salary', setPos)} sx={{ cursor: 'pointer', mb: -.5, '&:hover': { color: 'blue' }, transition: 'all .3s' }} />
                                                    <ArrowDropDownIcon onClick={() => customSorting({ order: 'desc', type: 'number' }, pos, 'monthly_salary', setPos)} sx={{ cursor: 'pointer', mt: -.5, '&:hover': { color: 'blue' }, transition: 'all .3s' }} />
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">
                                            <Typography>Publication date</Typography>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">
                                            <Typography>Publication end-date</Typography>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">
                                            <Typography>Publication expiry-date</Typography>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">
                                            <Typography>Position Status</Typography>
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">More details</TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Panelists</TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loader ? (
                                        <>
                                            {pos && pos.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: '2px solid black', bgcolor: row?.vacancy_status === 'CLOSED' ? red[200] : Math.ceil(moment.duration(moment(row?.expiry_date, 'YYYY-MM-DD').diff(moment(new Date(), 'YYYY-MM-DD'))).asMonths()) <= 1 ? yellow[300] : row?.is_hidden === 1 ? green[100] : 'none', '&:hover': { bgcolor: row?.vacancy_status === 'CLOSED' ? red[300] : Math.ceil(moment.duration(moment(row?.expiry_date, 'YYYY-MM-DD').diff(moment(new Date(), 'YYYY-MM-DD'))).asDays()) < 30 ? yellow[500] : '#e8eaf6' }, cursor: 'pointer' }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <Box display="flex" justifyContent="" alignItems="center">
                                                            {index + 1} <Checkbox {...label} checked={checkBoxData.find(x => x.job_vacancies_id === row.job_vacancies_id)?.job_vacancies_id === row.job_vacancies_id ? true : false} onChange={(e) => handleCheckBox(e, row)} />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <Box display="flex" justifyContent="flex-end">
                                                            <Button fullWidth variant='contained' sx={{ borderRadius: '1rem' }} color={row?.vacancy_status === 'CLOSED' ? 'secondary' : row?.is_hidden === 1 ? 'error' : 'primary'} size="small" startIcon={row?.vacancy_status === 'CLOSED' ? <LockOpenIcon /> : row?.is_hidden === 1 ? <ReplayIcon /> : <LaunchIcon />} onClick={() => row?.vacancy_status === 'CLOSED' ? handleReOpenPositionFn(row) : handlePostPosition(row, pos, setPos)} > {row?.vacancy_status === 'CLOSED' ? 'OPEN' : row?.is_hidden === 1 ? 'CANCEL' : 'POST'}</Button>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row?.position_name}
                                                    </TableCell>
                                                    <TableCell align="left">{row?.plantilla_item && row?.plantilla_item?.toUpperCase()} {row?.mpr_no && <>{row?.mpr_no?.toUpperCase()}</>}</TableCell>
                                                    <TableCell align="left">{row?.plantilla_id ? row?.plantilla_sg : row?.mpr_id ? <>{row?.emp_status === 'CS' ? <>{row?.plantilla_casual_sg}</> : <>NONE</>}</> : ''}</TableCell>
                                                    <TableCell align="left"> {row?.plantilla_id ? <>{f.format(row?.monthly_salary)}</> : <>{isNaN(row?.proposed_rate) ? '' : f.format(row?.proposed_rate)}</>} </TableCell>
                                                    <TableCell align="left">{moment(row?.posting_date).format('MM/DD/YYYY')}</TableCell>
                                                    <TableCell align="left">{moment(row?.closing_date).format('MM/DD/YYYY')}</TableCell>
                                                    <TableCell align="left">{moment(row?.expiry_date).format('MM/DD/YYYY')}</TableCell>
                                                    <TableCell align="left">{row?.emp_status === 'RE' ? 'PERMANENT' : row?.emp_status === 'CS' ? 'CASUAL' : row?.emp_status === 'JO' ? 'JOB-ORDER' : row?.emp_status === 'COS' ? 'CONTRACT OF SERVICE' : row?.emp_status}</TableCell>
                                                    <TableCell align="left">
                                                        <Button variant='contained'
                                                            startIcon={<InfoIcon />}
                                                            sx={{ borderRadius: '2rem' }}
                                                            size='small'
                                                            color="warning"
                                                            onClick={() => handleOpenDetails(row)}
                                                        >
                                                            details
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Button variant='contained'
                                                            startIcon={<GroupIcon />}
                                                            sx={{ borderRadius: '2rem' }}
                                                            size='small'
                                                            color="success"
                                                            onClick={() => handleOpenPanelist(row)}
                                                            disabled={row?.vacancy_status === 'CLOSED' ? true : false}
                                                        >
                                                            Panels
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Box display="flex" gap={1}>
                                                            <Button variant='contained'
                                                                disabled={row?.vacancy_status === 'CLOSED' ? true : false}
                                                                sx={{
                                                                    width: '+15rem',
                                                                    borderRadius: '2rem',
                                                                    bgcolor: row?.vacancy_status === 'PENDING' ? orange[500] :
                                                                        row?.vacancy_status === 'RANKING' ? deepPurple[500] :
                                                                            row?.vacancy_status === 'RECEIVING' ? red[400] :
                                                                                row?.vacancy_status === 'SET-EXAM' ? green[500] :
                                                                                    row?.vacancy_status === 'EXAM-SHORTLIST' ? green[500] :
                                                                                        row?.vacancy_status === 'EXAM-RESULT' ? orange[500] :
                                                                                            row?.vacancy_status === 'SET-INTERVIEW' ? green[500] :
                                                                                                row?.vacancy_status === 'INTERVIEW-RESULT' ? blue[500] :
                                                                                                    row?.vacancy_status === 'INTERVIEW-SHORTLIST' ? orange[500] :
                                                                                                        row?.vacancy_status === 'ISSUANCE-SHORTLIST' ? green[500] :
                                                                                                            'primary.main',
                                                                    '&:hover': {
                                                                        bgcolor: row?.vacancy_status === 'PENDING' ? orange[800] :
                                                                            row?.vacancy_status === 'RANKING' ? deepPurple[500] :
                                                                                row?.vacancy_status === 'RECEIVING' ? red[400] :
                                                                                    row?.vacancy_status === 'EXAM-SHORTLIST' ? green[800] :
                                                                                        row?.vacancy_status === 'SET-EXAM' ? green[500] :
                                                                                            row?.vacancy_status === 'EXAM-RESULT' ? orange[700] :
                                                                                                row?.vacancy_status === 'SET-INTERVIEW' ? green[700] :
                                                                                                    row?.vacancy_status === 'INTERVIEW-RESULT' ? blue[700] :
                                                                                                        row?.vacancy_status === 'INTERVIEW-SHORTLIST' ? orange[700] :
                                                                                                            row?.vacancy_status === 'ISSUANCE-SHORTLIST' ? green[500] :
                                                                                                                row?.vacancy_status === 'ISSUANCE-APPOINTMENT' ? blue[500] :
                                                                                                                    'primary.main'
                                                                    }
                                                                }}
                                                                startIcon={<TimelineIcon />}
                                                                onClick={() => handleOpenStatus(row, row?.vacancy_status)}
                                                                size='small'
                                                            >{row?.vacancy_status}
                                                            </Button>
                                                            {/* <Button variant='contained' color="warning" sx={{borderRadius:'2rem'}} startIcon={<EditIcon />}>Update</Button> */}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {Array.from(Array(5)).map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <Skeleton height={20} width='100%' />
                                                    </TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                    <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack spacing={2} sx={{ mt: .5 }}>
                            <Pagination count={Math.ceil(total / perPage)} page={page} size='small' color="primary" onChange={handlePaginate} />
                        </Stack>
                    </Box>
                </Grid>
            </Box>
        </RecruitmentContext.Provider>
    )
}

export default RecruitmentAdmin