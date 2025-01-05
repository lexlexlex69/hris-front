import { React, useState, useRef, useContext, useEffect } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { PersonOutline } from '@mui/icons-material';

import axios from 'axios';

import Warnings from '../receivingApplicants/Warnings';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import CommonBackdrop from '../../../../../../common/Backdrop';
import { green, orange, blue } from '@mui/material/colors';
import { MenuItem } from '@mui/material';
import moment from 'moment';

const label = { inputProps: { 'aria-label': 'Checkbox appoint' } };

const MprIssuanceAppointment = ({ data, closeDialog, vacancyStatus, currentPositionInfo }) => {
    const [applicants, setApplicants] = useState([])
    const [toAppoint, setToAppoint] = useState([])
    const [headCount, setHeadCount] = useState(currentPositionInfo?.head_count || 0)
    const [isAppoint, setIsAppoint] = useState(false)

    const [cbd, setCbd] = useState(false)
    // pagination
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const perPage = 5
    const [tableLoader, setTableLoader] = useState(true)
    const [selected, setSelected] = useState([])

    // appointed pagination
    const [appointedPage, setApointedPage] = useState(1)
    const [appointedTotal, setAppointedTotal] = useState(1)
    const appointedPerPage = 2
    const [currTableData, setCurrTableData] = useState([])

    const fetchAppointee = async (pager) => {
        setTableLoader(true)
        let res = await axios.get(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-get-appointee?page=${pager}&&vacancy_id=${data}&&perPage=${perPage}`)
        console.log('appointee', res)
        if (res.data.employees.length > 0) {
            // let selectedCurrData = res.data.applicants.data.filter(x => res.data.employees.some(y => y.profile_id === x.id))
            setSelected(res.data.employees)
            setIsAppoint(true)
        }
        else {
            let applicantAddIsChecked = []
            if (selected.length > 0) {
                // applicantAddIsChecked = res.data.applicants.data.map(item => selected.some(y => item.id === y.id )   ? ({ ...item, is_checked: true }) : ({ ...item, is_checked: false }))
                applicantAddIsChecked = res.data.applicants.data.map(x => {
                    let xy = selected.filter(y => y.id === x.id)
                    if (xy.length) {
                        return { ...x, is_checked: true, nature: xy[0].nature, period_from: xy[0].period_from, period_to: xy[0].period_to, effectivity: xy[0].effectivity }
                    }
                    else {
                        return { ...x, is_checked: false, nature: '', period_from: '', period_to: '', effectivity: '' }
                    }
                })
            }
            else {
                applicantAddIsChecked = res.data.applicants.data.map((item, i) => ({ ...item, is_checked: false, nature: '', period_from: '', period_to: '', effectivity: '' })) // set is check when after data is return by api
            }
            setApplicants(applicantAddIsChecked)
            setTotal(res.data.applicants.total)
            setPage(res.data.applicants.current_page)
            setTableLoader(false)
        }

    }

    const handlePaginate = (e, v) => {
        if (v === page)
            return
        else {
            fetchAppointee(v)
        }
    }

    const appointedhandlePaginate = (e, v) => {
        if (v === appointedPage)
            return
        else {
            setCurrTableData(selected?.slice((v - 1) * appointedPerPage, v * appointedPerPage))
            setApointedPage(v)
        }
    }

    const handleCheckBox = (e, row) => {

        if (e.target.checked) {
            if (selected.length >= headCount) {
                toast.warning('Reach the max number to appoint.')
                return
            }
            setSelected(prev => [...prev, row])
            let checked = applicants.map((item) => item.id === row.id ? ({ ...item, is_checked: true }) : item)
            setApplicants(checked)
        }
        else {
            let filtered = selected.filter(item => item.id !== row.id)
            setSelected(filtered)
            let checked = applicants.map((item) => item.id === row.id ? ({ ...item, is_checked: false }) : item)
            setApplicants(checked)
        }
    }

    const handleAppoint = async () => {
        if (selected.length < headCount) {
            toast.warning(`Please select ${headCount - selected.length} more applicant(s)`)
            return
        }
        Swal.fire({
            title: 'Appoint applicant(s)?',
            text: "Appointed outsider data will be transferred as insider employee.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setCbd(true)
                let res = await axios.post(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-appoint`, { data: selected, vacancy_id: data })
                console.log(res)
                setCbd(false)
                setToAppoint(selected)
                setIsAppoint(true)
                console.log(res)
            }
        })
    }

    const handleChangeInputs = (e, item) => {
        if (e.target.name === 'period_from') {
            let addedApplicants = applicants.map((x) => x.id === item.id ? ({ ...x, [e.target.name]: e.target.value, effectivity: e.target.value }) : x)
            setApplicants(addedApplicants)
        }
        else {
            let addedApplicants = applicants.map((x) => x.id === item.id ? ({ ...x, [e.target.name]: e.target.value }) : x)
            setApplicants(addedApplicants)
        }

    }


    useEffect(() => {
        fetchAppointee(page)
    }, [])

    useEffect(() => {
        if (isAppoint) {
            setCurrTableData(selected?.slice(0, appointedPerPage))
        }
    }, [isAppoint])
    return (
        <Box width='100%' height='100%'>
            <CommonBackdrop open={cbd} title="Processing request . . ." />
            <Typography variant="body2" color="primary" align='center'>MPR Issuance of appointment</Typography>
            {!isAppoint ? (
                <>
                    <Box mt={2}>
                        <Typography variant="body2" sx={{ color: 'warning.main' }}>Head Count: {headCount}</Typography>
                        <Typography variant="body2" sx={{ color: 'success.main' }}>Selected: {selected.length}</Typography>
                        <Box display='flex' justifyContent='space-between'>
                            <Warnings arr={[
                                { text: 'insider applicant', color: 'primary.main' },
                                { text: 'outsider applicant', color: 'warning.main' },
                            ]} />
                        </Box>
                        <TableContainer component={Paper} sx={{ maxHeight: 'calc(80vh - 66px)' }}>
                            <Table sx={{ minWidth: 700 }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Appoint
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            #
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Full name
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Email address
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Telephone / CP number
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Nature of appointment
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Period of appointment
                                        </TableCell>
                                        <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                            Effectivity date
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableLoader ? (
                                        <>
                                            {Array.from(Array(5)).map((item, i) => (
                                                <>
                                                    <TableRow key={i}>
                                                        {Array.from(Array(8)).map((x, i2) => (
                                                            <TableCell>
                                                                <Skeleton key={i2} variant='text' />
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </>
                                            ))}
                                        </>
                                    ) :
                                        (
                                            <>
                                                {applicants && applicants.map((item, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell><Checkbox {...label} disabled={item.nature !== '' && item.period_from !== '' && item.period_to !== '' && item.effectivity !== '' ? false : true} checked={item.is_checked} onChange={(e) => handleCheckBox(e, item)} /></TableCell>
                                                        <TableCell>{i + 1}</TableCell>
                                                        <TableCell sx={{ color: item?.employee_id ? 'primary.main' : item?.applicant_id ? 'warning.main' : '' }}>{item?.info?.fname} {item?.info?.mname} {item?.info?.lname}</TableCell>
                                                        <TableCell>{item?.info?.emailadd}</TableCell>
                                                        <TableCell>{item?.info?.cpno}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <TextField select fullWidth label=" " size='small' value={item.nature} sx={{ width: '20ch' }} name='nature' onChange={(e) => handleChangeInputs(e, item)}>
                                                                <MenuItem value="RENEWAL">ORIGINAL</MenuItem>
                                                                <MenuItem value="RE-APPOINTMENT">RE-APPOINTMENT</MenuItem>
                                                                <MenuItem value="RE-EMPLOYMENT">RE-EMPLOYMENT</MenuItem>
                                                                <MenuItem value="RENEWAL">RENEWAL</MenuItem>
                                                            </TextField>
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Box display='flex' gap={1}>
                                                                    <DatePicker
                                                                        // views={['year']}
                                                                        label="FROM"
                                                                        value={item.period_from}
                                                                        name="period_from"
                                                                        onChange={(newValue) => handleChangeInputs({
                                                                            target: {
                                                                                name: 'period_from',
                                                                                value: moment(newValue, "YYYY-MM-DD").format("YYYY-MM-DD")
                                                                            }
                                                                        }, item)}
                                                                        renderInput={(params) => <TextField fullWidth size='small' sx={{ width: '20ch' }} required {...params} helperText={null} />}
                                                                    />
                                                                    <DatePicker
                                                                        label="TO"
                                                                        value={item.period_to}
                                                                        name="period_to"
                                                                        onChange={(newValue) => handleChangeInputs({
                                                                            target: {
                                                                                name: 'period_to',
                                                                                value: moment(newValue, "YYYY-MM-DD").format("YYYY-MM-DD")
                                                                            }
                                                                        }, item)}
                                                                        // }}
                                                                        renderInput={(params) => <TextField fullWidth sx={{ width: '20ch' }} size='small' required {...params} helperText={null} />}
                                                                    />
                                                                </Box>
                                                            </LocalizationProvider>
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <DatePicker
                                                                    // views={['year']}
                                                                    label="Date"
                                                                    value={item.effectivity}
                                                                    onChange={(newValue) => handleChangeInputs({
                                                                        target: {
                                                                            name: 'effectivity',
                                                                            value: moment(newValue, "YYYY-MM-DD").format("YYYY-MM-DD")
                                                                        }
                                                                    }, item)}
                                                                    renderInput={(params) => <TextField sx={{ width: '20ch' }} fullWidth size='small' required {...params} helperText={null} />}
                                                                />
                                                            </LocalizationProvider>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination color='primary' size='small' count={Math.ceil(total / perPage)} page={page} sx={{ mt: 1 }} onChange={handlePaginate} />
                        <Box display='flex' justifyContent='flex-end'>
                            <Button startIcon={<PersonOutline />} variant='contained' onClick={handleAppoint} >Appoint</Button>
                        </Box>
                    </Box>
                </>
            ) : (
                <Box pt={2}>
                    <Typography variant="body1" align='left' color="#5C5C5C">Department / Office: <span style={{ color: "#5C5C5C" }}>{currentPositionInfo?.dept_title}</span> </Typography>
                    <Typography variant="body1" align='left' color="#5C5C5C">Position title: <span style={{ color: "#5C5C5C" }}>{currentPositionInfo?.position_name}</span></Typography>
                    <Typography variant="body1" align='left' color="#5C5C5C">Employment status: <span style={{ color: "#5C5C5C" }}>{currentPositionInfo?.emp_status === 'CS' ? 'CASUAL' : currentPositionInfo?.emp_status === 'JO' ? 'JOB ORDER' : currentPositionInfo?.emp_status === 'COS' ? 'CONTRACT OF SERVICE' : ''}</span></Typography>
                    <Typography variant="body1" align='left' color="#5C5C5C">Head count: <span style={{ color: "#5C5C5C" }}>{currentPositionInfo?.head_count}</span> </Typography>
                    <Typography variant="body2" color="#5C5C5C" align='left' sx={{ mt: 1 }}>List of appointed applicants</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} rowSpan={2}>Name</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} rowSpan={2}>Applicant status</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} rowSpan={2}>Email address</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} rowSpan={2}>Telephone / CP number</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} rowSpan={2}>Nature of work</TableCell>
                                    <TableCell className='cgb-color-table' colSpan={2} sx={{ color: '#fff' }}>Period of appointment</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} rowSpan={2}>Effectivity Date</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>From</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>To</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currTableData.length && currTableData.map((item, i) => (
                                    <TableRow>
                                        <TableCell>{item?.info?.fname} {item?.info?.mname} {item?.info?.lname}</TableCell>
                                        <TableCell>{item?.applicant_id ? 'Applicant' : item?.employee_id ? 'Employee' : ''}</TableCell>
                                        <TableCell>{item?.info?.emailadd}</TableCell>
                                        <TableCell>{item?.info?.cpno}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="initial"> {item?.nature}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="initial">{moment(item?.period_from, "YYYY-MM-DD").format("MM/DD/YYYY")}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="initial">{moment(item?.period_to, "YYYY-MM-DD").format("MM/DD/YYYY")}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="initial"> {moment(item?.effectivity, "YYYY-MM-DD").format("MM/DD/YYYY")}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination color='primary' size='small' sx={{ mt: 1 }} count={Math.ceil(selected.length / appointedPerPage)} page={appointedPage} onChange={appointedhandlePaginate} />
                </Box>
            )}

        </Box>
    );
};

export default MprIssuanceAppointment;