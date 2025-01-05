import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Pagination, Skeleton } from '@mui/lab';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import axios from 'axios';
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { ArrowBack } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import moment from 'moment';

import EasyAccess from './EasyAccess';
import { Tooltip } from '@mui/material';
import EasyAccessCards from './EasyAccessCards';
import CommonDialog from '../../../../common/CommonDialog/index'
import FormF from './FormF';
import FormC from './FormC';
import Cert from './Cert';
import EmpNotice from './EmpNotice';
import AssumptionDuty from './AssumptionDuty';
import { filterFn } from './Controller';
import { toast } from 'react-toastify';

const MprAppointees = () => {
    const [offices, setOffices] = useState([])
    const [selectedOffice, setSelectedOffice] = useState(null)
    const [tableLoader, setTableLoader] = useState(false)
    const [appointees, setAppointees] = useState([])

    const perPage = 5
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const [selected, setSelected] = useState([])

    const getAppointees = async (pager) => {
        setTableLoader(true)
        let res = await axios.get(`/api/recruitment/mpr-appointees/get-mpr-appointees?page=${pager}&&dept_id=${selectedOffice}&&per_page=${perPage}`)
        console.log(res)
        if (res.data.data.length) {
            let addRowsItemsToAppArr = res.data.data.map((x) => {
                return { ...x, appointed_arr: x?.appointed_arr?.map(y => ({ ...y, mpr_id: x?.mpr_id, plantilla_casual_id: x?.plantilla_casual_id, position_name: x?.position_name, propose_budget_sg: x?.propose_budget_sg, proposed_rate: x?.proposed_rate })) }
            })
            setAppointees(addRowsItemsToAppArr)
            console.log(addRowsItemsToAppArr)
        }
        else {
            setAppointees([])
        }

        // setState(mutateRow)
        setTableLoader(false)
        setPage(res.data.current_page)
        setTotal(res.data.total)
    }

    const handlePaginate = (e, v) => {
        console.log(v)
        if (page !== v) {
            getAppointees(v)
            setPage(v)
        }

    }

    const fetchOffices = async () => {
        let controller = new AbortController()
        let res = await axios.get(`/api/recruitment/plantilla/getOffices`, { signal: controller.signal })
        console.log(res)
        setOffices(res.data.dept)
    }

    // actions forms
    const [openForm, setOpenForm] = useState({
        open: false,
        category: ''
    })
    const [formData, setFormData] = useState({
        dept_id: '',
        appointees: []
    })
    const handleOpenForms = (bol, cat) => {
        if (cat === 'formF') {
            if (!selectedOffice)
                toast.warning('Please select office')
            else {
                setOpenForm(prev => ({ ...prev, open: bol, category: cat }))
            }

        }
        else if (cat === 'formC') {
            if (selected.length <= 0) {
                toast.warning('Please select items from the table')
                return
            }
            else {
                setFormData(prev => ({ ...prev, appointees: selected }))
                setOpenForm(prev => ({ ...prev, open: bol, category: cat }))
            }
        }
        else if (cat === 'cert') {
            if (selected.length <= 0) {
                toast.warning('Please select items from the table')
                return
            }
            else {
                setFormData(prev => ({ ...prev, appointees: selected }))
                setOpenForm(prev => ({ ...prev, open: bol, category: cat }))
            }
        }
        else if (cat === 'empNotice') {
            if (selected.length <= 0) {
                toast.warning('Please select items from the table')
                return
            }
            else {
                setFormData(prev => ({ ...prev, appointees: selected }))
                setOpenForm(prev => ({ ...prev, open: bol, category: cat }))
            }
        }
        else if (cat === 'assmpt') {
            if (selected.length <= 0) {
                toast.warning('Please select items from the table')
                return
            }
            else {
                setFormData(prev => ({ ...prev, appointees: selected }))
                setOpenForm(prev => ({ ...prev, open: bol, category: cat }))
            }
        }
    }

    const renderRef = useRef(true)
    useEffect(() => {
        if (renderRef.current) {
            renderRef.current = false
        }
        else {
            getAppointees(page)
        }
    }, [selectedOffice])

    useEffect(() => {
        fetchOffices()
    }, [])

    return (
        <Box sx={{ width: '100vw', height: 'calc(100vh - 100px)', position: 'relative', overflowX: 'hidden' }}>
            <CommonDialog open={openForm.open} handleClose={() => setOpenForm(prev => ({ ...prev, open: false }))} title='' >
                {openForm?.category === 'formF' && <FormF dept_id={selectedOffice} offices={offices} />}
                {openForm?.category === 'formC' && <FormC dept_id={selectedOffice} arr={formData.appointees} offices={offices} />}
                {openForm?.category === 'cert' && <Cert dept_id={selectedOffice} arr={formData.appointees} offices={offices} />}
                {openForm?.category === 'empNotice' && <EmpNotice dept_id={selectedOffice} arr={formData.appointees} offices={offices} />}
                {openForm?.category === 'assmpt' && <AssumptionDuty dept_id={selectedOffice} arr={formData.appointees} offices={offices} />}
            </CommonDialog>
            <EasyAccess selected={selected.length} showSelected>
                <EasyAccessCards icon={<InsertDriveFileIcon sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} />} onClick={() => handleOpenForms(true, 'formF')} title='generate Casual appointment template 34-f' shortText='Form 34-f' />
                <EasyAccessCards icon={<InsertDriveFileIcon sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} />} onClick={() => handleOpenForms(true, 'formC')} title='generate Casual appointment template 34-c' shortText='Form 34-c' />
                <EasyAccessCards icon={<InsertDriveFileIcon sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} />} onClick={() => handleOpenForms(true, 'empNotice')} title='Employment Notice' shortText='Emp. Notice' />
                <EasyAccessCards icon={<InsertDriveFileIcon sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} />} onClick={() => handleOpenForms(true, 'cert')} title='Certification' shortText='Certification' />
                <EasyAccessCards icon={<InsertDriveFileIcon sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} />} onClick={() => handleOpenForms(true, 'assmpt')} title='Assumption to duty' shortText='Assmpt. to duty' />
            </EasyAccess>
            <Box px={2} width='100vw' position='relative' overflowX='hidden'>
                <Typography variant='body1' gutterBottom color='primary'>MPR Appointees</Typography>
                <Box display='flex' justifyContent='space-between' alignItems='flex-end'>
                    <TextField
                        label=" Select Office/Department"
                        select
                        sx={{ minWidth: '20rem', mb: 1 }}
                        size='small'
                        defaultValue=' '
                        value={selectedOffice}
                        onChange={(e) => setSelectedOffice(e.target.value)}
                    >
                        {offices && offices.map((item, i) => (
                            <MenuItem key={i} value={item?.dept_code} >{item?.dept_title}</MenuItem>
                        ))}
                    </TextField>
                </Box>

                <TableContainer component={Paper}>
                    <Table aria-label="mpr appointees table" size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>MPR Number</TableCell>
                                <TableCell align="left">Position</TableCell>
                                <TableCell align="left">Proposed rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableLoader ? (
                                <>
                                    {Array.from(Array(5)).map((item, i) =>
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {Array.from(Array(4)).map((x, i) =>
                                                <TableCell key={i} component="th" scope="row">
                                                    <Skeleton height={30} />
                                                </TableCell>

                                            )}
                                        </TableRow>
                                    )}
                                </>
                            ) : (
                                <>
                                    {appointees && appointees.map((row, i) => (
                                        <Row key={i} row={row} setState={setAppointees} state={appointees} setSelected={setSelected} selected={selected} />
                                    ))}
                                </>
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination count={Math.ceil(total / perPage)} page={page} size='small' color='primary' sx={{ mt: 1 }} onChange={handlePaginate} />
            </Box>
        </Box>
    );
};

export default MprAppointees;

function Row({ row, setState, state, selected, setSelected }) {
    const [open, setOpen] = React.useState(false);

    const handleFilterFn = (param, arr, direction) => {
        const result = filterFn(param, arr, direction)
        const sortedArr = state.map((x, i) => x.mpr_id === row.mpr_id ? ({ ...x, appointed_arr: result }) : x)
        setState(sortedArr)
    }
    // onchange event for checkbox, checking the checkbox triggers is_selected to be true and add item to selected state, if not is_selected is set to false and remove item from selected state
    const handleCheckBox = (e, item) => {
        if (!item.is_selected) {
            console.log(item)
            setSelected(prev => [...prev, item])
            const mutateState = row.appointed_arr.map(x => x.id === item.id ? ({ ...x, is_selected: true }) : x)
            const mutateRow = state.map(x => x.mpr_id === row.mpr_id ? ({ ...x, appointed_arr: mutateState }) : x)
            setState(mutateRow)

        }
        else {
            let filtered = selected.filter(x => x.id !== item.id)
            setSelected(filtered)
            const mutateState = row.appointed_arr.map(x => x.id === item.id ? ({ ...x, is_selected: false }) : x)
            const mutateRow = state.map(x => x.mpr_id === row.mpr_id ? ({ ...x, appointed_arr: mutateState }) : x)
            setState(mutateRow)
        }
    }
    // set is_selected true for items previously selected when navigating, and false for not selected items, also set necessary properties from row

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ color: blue[500] }}>
                    {row?.mpr_no}
                </TableCell>
                <TableCell align="left" sx={{ color: blue[500] }}>{row?.position_name}</TableCell>
                <TableCell align="left"></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="body1" color='primary' gutterBottom component="div">
                                Details
                            </Typography>
                            <TableContainer sx={{ bgcolor: blue[50] }} >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={6} textAlign="center">NAME OF APPOINTEES</TableCell>
                                            <TableCell rowSpan={2} align="right">POSITION TITLE</TableCell>
                                            <TableCell rowSpan={2} align="right">
                                                <Box display='flex' alignItems='center'>
                                                    NATURE OF APPOINTMENT
                                                    <Box>
                                                        <ArrowDropUpIcon sx={{ cursor: 'pointer', '&:hover': { color: blue[800] }, color: blue[500] }} onClick={() => handleFilterFn('nature', row.appointed_arr, 'up')} />
                                                        <ArrowDropDownIcon sx={{ cursor: 'pointer', '&:hover': { color: blue[800] }, color: blue[500] }} onClick={() => handleFilterFn('nature', row.appointed_arr, 'down')} />
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell rowSpan={2} align="right">
                                                <Box display='flex' alignItems='center'>
                                                    EFFECTIVITY DATE
                                                    <Box>
                                                        <ArrowDropUpIcon sx={{ cursor: 'pointer', '&:hover': { color: blue[800] }, color: blue[500] }} onClick={() => handleFilterFn('effectivity', row.appointed_arr, 'up')} />
                                                        <ArrowDropDownIcon sx={{ cursor: 'pointer', '&:hover': { color: blue[800] }, color: blue[500] }} onClick={() => handleFilterFn('effectivity', row.appointed_arr, 'down')} />
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell rowSpan={2} align="right">EQUIVALENT SAARY/ JOB/ PAY GRADE</TableCell>
                                            <TableCell rowSpan={2} align="right">DAILY WAGE</TableCell>
                                            <TableCell colSpan={2} align="right">PERIOD OF EMPLOYMENT</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell  ></TableCell>
                                            <TableCell  >#</TableCell>
                                            <TableCell align="right">Last name</TableCell>
                                            <TableCell align="right">First name</TableCell>
                                            <TableCell align="right">Name Extension</TableCell>
                                            <TableCell align="right">Middle name</TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1" textAlign='center'>From</Typography>
                                                <Typography variant="body1" textAlign='center'>(mm/dd/yyyy)</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1" textAlign='center' >To</Typography>
                                                <Typography variant="body1" textAlign='center'>(mm/dd/yyyy)</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row?.appointed_arr && row?.appointed_arr?.map((x, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: blue[200] }, cursor: 'pointer' }}
                                            >
                                                <TableCell align="right"><Checkbox checked={x?.is_selected} onChange={(e) => handleCheckBox(e, x)} /></TableCell>
                                                <TableCell align="right">{i + 1}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    {x?.lname}
                                                </TableCell>
                                                <TableCell align="right">{x?.fname}</TableCell>
                                                <TableCell align="right">{x?.extn}</TableCell>
                                                <TableCell align="right">{x?.mname}</TableCell>
                                                <TableCell align="right">{row?.position_name}</TableCell>
                                                <TableCell align="right">{x?.nature}</TableCell>
                                                <TableCell align="center">{x?.effectivity ? moment(x?.effectivity, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</TableCell>
                                                <TableCell align="right">SG {row?.propose_budget_sg}</TableCell>
                                                <TableCell align="right">{row?.proposed_rate ? ((row?.proposed_rate / 12) / 22).toFixed(2) : ''}</TableCell>
                                                <TableCell align="center">{x?.period_from ? moment(x?.period_from, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</TableCell>
                                                <TableCell align="center">{x?.period_to ? moment(x?.period_to, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}