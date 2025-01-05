import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table';
import { blue, green, orange, red } from '@mui/material/colors';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { Add, Delete, Edit, Search } from '@mui/icons-material';

import CommonDialog from '../../../../common/CommonDialog'
import AddPlantillaCasual from './AddPlantillaCasual';
import UpdatePlantillaCasual from './UpdatePlantillaCasual';
import CollapsePlantilla from './CollapsePlantilla';
import MergePlantilla from './MergePlantilla';
import QuestionIcon from './QuestionIcon';
import Warnings from '../jobPostingManagement/componentsByStatus/receivingApplicants/Warnings';

const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })

const PlantillaCasual = () => {
    const [plantillaCs, setPlantillaCs] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [openCollapse, setOpenCollapse] = useState(false)
    const [collapseData, setCollapseData] = useState(false)
    const [updateData, setUpdateData] = useState({})
    const [openToMerge, setOpenToMerge] = useState(false)
    const [toMerge, setToMerge] = useState([])
    // pagination
    const perPage = 5
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(1)
    const [loader, setLoader] = useState(true)
    const [filters, setFilters] = useState({
        dept: '',
        pos: ''
    })

    const [years, setYears] = useState({
        authorize: [],
        propose: [],
        revise: []
    })

    const [yearsFilter, setYearsFilter] = useState({
        authorize: '',
        propose: '',
        revise: ''
    })
    const [officeFilterList, setOfficeFilterList] = useState(false)
    const [officeFilter, setOfficeFilter] = useState(false)
    const handlePaginate = (e, v) => {
        fetchPlantillaCasual(v)
    }

    const handleOpenCollapse = (param) => {
        setOpenCollapse(true)
        setCollapseData(param)
    }
    const handleOpenUpdate = (param) => {
        setUpdateData(param)
        setOpenUpdate(true)
    }

    const handleCloseToMerge = () => setOpenToMerge(false)
    const handleOpenToMerge = () => {
        if (toMerge.length < 2)
            toast.warning('minimum of 2 plantilla needed.')
        else {
            let temp = toMerge.filter(a => (a.propose_budget_amount === '' || a.propose_budget_amount === null || a.propose_budget_amount === undefined) && (a === a.revise_budget_amount === '' || a.revise_budget_amount === null || a.revise_budget_amount === undefined) || a.curr_authorized_amount === '')
            if (temp?.length > 0) {
                toast.warning(`[ ${temp?.length} ] selected for merging 'propose budget amount' doesn't have value${temp?.length > 1 ? 's.' : '.'}`)
                return
            }
            else {
                setOpenToMerge(true)
            }
        }
    }

    const handleCloseAdd = () => setOpenAdd(false)
    const handleCloseUpdate = () => setOpenUpdate(false)
    const handleCloseCollapse = () => setOpenCollapse(false)

    const fetchPlantillaCasual = async (pager) => {
        setLoader(true)
        let res = await axios.get(`/api/recruitment/plantilla-casual/plantilla-casual?page=${pager}&&perPage=${perPage}&&dept=${officeFilter}&&pos=${filters.pos}&&authorize=${yearsFilter.authorize}&&propose=${yearsFilter.propose}&&revise=${yearsFilter.revise}`)
        console.log(res)
        setPlantillaCs(res.data.data)
        setTotal(res.data.total)
        setPage(res.data.current_page)
        setLoader(false)
    }

    const handleSearch = () => {
        fetchPlantillaCasual()
    }

    const handleToMerge = (e, item) => {
        if (e.target.checked) {
            if (!toMerge.find(a => a.plantilla_id === item.plantilla_id)) {
                setToMerge(prev => [...prev, item])
            }
        }
        else {
            let filtered = toMerge.filter((x) => x.plantilla_id !== item.plantilla_id)
            setToMerge(filtered)
        }
    }

    const fetchOffices = async () => { // fetch offices and salary grades
        let controller = new AbortController()
        let offices = await axios.get(`/api/recruitment/plantilla/getOffices`, {}, { signal: controller.signal })
        if (offices.data.status === 200) {
            setOfficeFilterList(offices.data.dept)
        }
    }

    // fetch offices
    useEffect(() => {
        fetchOffices()
    }, [])

    // if officeList if filled after fetching from api, fetch plantilla casual base on the first department / office
    // useEffect(() => {
    //     if (officeFilterList.length)
    //         setOfficeFilter(officeFilterList[0].dept_code)
    // }, [officeFilterList])

    // fetch years use for crrnt year authorize etc.
    const fetchYears = async (dept_id) => {
        let res = await axios.post(`/api/recruitment/plantilla-casual/get-plantilla-years`, { dept_id: dept_id })
        console.log('YEARS', res)
        setYears({
            authorize: res.data?.authorize?.sort((a, b) => a.year > b.year ? 1 : -1),
            propose: res.data?.propose?.sort((a, b) => a.year > b.year ? 1 : -1),
            revise: res.data?.revise?.sort((a, b) => a.year > b.year ? 1 : -1)
        })
    }

    // side effect for office to fetch plantilla base on office
    const firstRenderRef = useRef(true)
    useEffect(() => {
        // if (firstRenderRef.current) {
        fetchPlantillaCasual(1)
        firstRenderRef.current = false
        fetchYears(officeFilter)
        // }
    }, [officeFilter])

    useEffect(() => {
        fetchPlantillaCasual(1)
    }, [yearsFilter.authorize, yearsFilter.propose, yearsFilter.revise])



    return (
        <Box sx={{ p: 2 }}>
            <CommonDialog open={openAdd} handleClose={handleCloseAdd} title='New Plantilla Casual' customWidth='40%' > <AddPlantillaCasual setPlantillaCs={setPlantillaCs} handleCloseAdd={handleCloseAdd} /> </CommonDialog>
            <CommonDialog open={openUpdate} handleClose={handleCloseUpdate} title='Update Plantilla Casual' bgcolor='warning.main' customWidth='40%' > <UpdatePlantillaCasual data={updateData} setPlantillaCs={setPlantillaCs} plantillaCs={plantillaCs} handleClose={handleCloseUpdate} /> </CommonDialog>
            <CommonDialog open={openCollapse} handleClose={handleCloseCollapse} title='Collapse Plantilla' bgcolor='primary.main' customWidth='80%' > <CollapsePlantilla setTotal={setTotal} perPage={perPage} data={collapseData} setPlantillaCs={setPlantillaCs} plantillaCs={plantillaCs} handleClose={handleCloseCollapse} /> </CommonDialog>
            <CommonDialog open={openToMerge} handleClose={handleCloseToMerge} title='Merge Plantilla Casual' bgcolor='primary.main' customWidth='80%' > <MergePlantilla data={toMerge} setPlantillaCs={setPlantillaCs} plantillaCs={plantillaCs} handleClose={handleCloseToMerge} /> </CommonDialog>
            <Box display='flex' justifyContent='space-between'>
                <Button variant='contained' sx={{ borderRadius: '2rem' }} startIcon={<Add />} onClick={() => setOpenAdd(true)}>NEW PLANTILLA FOR CASUAL</Button>
                <Box display='flex' gap={1} alignItems='center'>
                    <TextField
                        id=""
                        size='small'
                        label="Position"
                        value={filters.pos}
                        onChange={(e) => setFilters(prev => ({ ...prev, pos: e.target.value }))}
                    />
                    <Tooltip title="search">
                        <Search color='primary' sx={{ fontSize: 35, cursor: 'pointer' }} onClick={handleSearch} />
                    </Tooltip>
                </Box>
            </Box>

            <Box mt={2}>
                <Warnings arr={[
                    { text: 'Collapsed Plantilla', color: 'red' },
                    { text: 'Reference collapse', color: 'blue' },
                    { text: 'Merged Plantilla', color: 'orange' },
                    { text: 'Reference merge', color: 'green' },
                ]} />
                <TextField required sx={{ width: '30ch', mt: 2 }} size='small' label="OFFICE / DEPARTMENT" name='dept_id'
                    select
                    defaultValue=' '
                    value={officeFilter}
                    onChange={(e) => setOfficeFilter(e.target.value)}>
                    {officeFilterList.length > 0 && officeFilterList.map((item, i) => (
                        <MenuItem key={i} value={item?.dept_code}>
                            {item?.dept_title}
                        </MenuItem>
                    ))}
                </TextField>
                <TableContainer component={Paper}>
                    <Box display='flex' gap={1} alignItems='flex-end' p={1}>
                        {toMerge.length ? <>
                            <Typography variant="body2" sx={{ m: .5, color: 'success.main' }}> {toMerge.length} Selected for merging </Typography>
                            <Tooltip title="click to merge plantilla">
                                <AutoAwesomeMotionIcon sx={{ border: `2px solid ${green[500]}`, borderRadius: '50%', fontSize: 35, p: .5, color: green[500], cursor: 'pointer', '&:hover': { bgcolor: green[500], color: '#fff' }, transition: 'all .1s' }} onClick={handleOpenToMerge} />
                            </Tooltip>
                        </> : ''}

                    </Box>
                    <Table sx={{ minWidth: 650 }} aria-label="plantilla casual" size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell rowSpan={3} className='cgb-color-table text-white' align="center">MERGE</TableCell>
                                <TableCell rowSpan={3} className='cgb-color-table text-white' align="center">OFFICE / DEPARTMENT</TableCell>
                                <TableCell rowSpan={3} className='cgb-color-table text-white' align="center">SEQUENCE</TableCell>
                                <TableCell rowSpan={3} className='cgb-color-table text-white' align="center">POSITION TITLE</TableCell>
                                <TableCell rowSpan={3} className='cgb-color-table text-white' align="center">NAME OF INCUMBENT</TableCell>
                                <TableCell rowSpan={3} className='cgb-color-table text-white' align="center">DATE OF ASSUMPTION TO PRESENT POSTION</TableCell>
                                <TableCell align="center" className='cgb-color-table text-white' colSpan={2}>CURRENT YEAR AUTHORIZED <br />
                                    <TextField sx={{ width: '15ch' }} size='small' label=" " name='dept_id'
                                        select
                                        defaultValue=' '
                                        InputProps={{ inputProps: { sx: { color: '#fff' } } }}
                                        value={yearsFilter.authorize}
                                        onChange={(e) => setYearsFilter(prev => ({ ...prev, authorize: e.target.value }))}>
                                        <MenuItem value=''>
                                            NONE
                                        </MenuItem>
                                        {years?.authorize?.length > 0 && years?.authorize?.map((item, i) => (
                                            <MenuItem key={i} value={item.year}>
                                                {item.year}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </TableCell>
                                <TableCell align="center" className='cgb-color-table text-white' colSpan={2}>BUDGET YEAR  <br />  PROPOSED  <br />
                                    <TextField sx={{ width: '15ch' }} size='small' label=" " name='dept_id'
                                        select
                                        defaultValue=' '
                                        InputProps={{ inputProps: { sx: { color: '#fff' } } }}
                                        value={yearsFilter.propose}
                                        onChange={(e) => setYearsFilter(prev => ({ ...prev, propose: e.target.value }))}>
                                        <MenuItem value=''>
                                            NONE
                                        </MenuItem>
                                        {years?.propose?.length > 0 && years?.propose?.map((item, i) => (
                                            <MenuItem key={i} value={item.year}>
                                                {item.year}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </TableCell>
                                <TableCell align="center" className='cgb-color-table text-white' colSpan={2}>REVISE <br />  BUDGET <br />
                                    <TextField sx={{ width: '15ch' }} size='small' label=" " name='dept_id'
                                        select
                                        defaultValue=' '
                                        InputProps={{ inputProps: { sx: { color: '#fff' } } }}
                                        value={yearsFilter.revise}
                                        onChange={(e) => setYearsFilter(prev => ({ ...prev, revise: e.target.value }))}>
                                        <MenuItem value=''>
                                            NONE
                                        </MenuItem>
                                        {years?.revise?.length > 0 && years?.revise?.map((item, i) => (
                                            <MenuItem key={i} value={item.year}>
                                                {item.year}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </TableCell>
                                <TableCell align="center" className='cgb-color-table text-white' rowSpan={3} >INCREASE / DECREASE</TableCell>
                                <TableCell align="center" className='cgb-color-table text-white' rowSpan={3}>ACTIONS</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell rowSpan={1} colSpan={2} className='cgb-color-table text-white' align='center'>RATE/ANNUM</TableCell>
                                <TableCell rowSpan={1} colSpan={2} className='cgb-color-table text-white' align='center'>RATE/ANNUM</TableCell>
                                <TableCell rowSpan={1} colSpan={2} className='cgb-color-table text-white' align='center'>RATE/ANNUM</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='cgb-color-table text-white' align='center'>SG</TableCell>
                                <TableCell className='cgb-color-table text-white' align='center'>AMOUNT</TableCell>
                                <TableCell className='cgb-color-table text-white' align='center'>SG</TableCell>
                                <TableCell className='cgb-color-table text-white' align='center'>AMOUNT</TableCell>
                                <TableCell className='cgb-color-table text-white' align='center'>SG</TableCell>
                                <TableCell className='cgb-color-table text-white' align='center'>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loader ? (
                                <>
                                    {Array.from(Array(5)).map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {Array.from(Array(14)).map((item2, i2) => (
                                                <TableCell key={i2}> <Skeleton variant='text' /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {plantillaCs && plantillaCs.map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                <Checkbox disabled={row.is_collapse} checked={toMerge.find(a => a.plantilla_id === row.plantilla_id)} onChange={(e) => handleToMerge(e, row)} />
                                            </TableCell>
                                            <TableCell align="center" >{row.dept_title ? row.dept_title : <QuestionIcon />}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.sequence ? row.sequence : <QuestionIcon />}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: row?.is_collapse ? 'red' : row?.is_collapse_reference ? 'blue' : row?.is_merge ? 'orange' : row?.is_merge_reference ? 'green' : '' }}><b>{row.position_name}</b></TableCell>
                                            <TableCell align="center">{row.employee_id ? row.employee_id : <QuestionIcon />}</TableCell>
                                            <TableCell align="center">{row.date_assumption_position ? moment(row.date_assumption_position, "YYYY-MM-DD").format('YYYY-MM-DD') : <QuestionIcon />}</TableCell>
                                            <TableCell align="center"> {row.curr_authorized_sg && row.curr_authorized_step ? <>{row.curr_authorized_sg} - {row.curr_authorized_step}</> : <QuestionIcon />}</TableCell>
                                            <TableCell align="center" sx={{ color: row?.is_merge_reference ? '#BEBEBE' : '' }}>{row.curr_authorized_amount ? row?.is_merge_reference ? <>({f.format(row.curr_authorized_amount)})</> : f.format(row.curr_authorized_amount) : <QuestionIcon />}</TableCell>
                                            <TableCell align="center">{row.propose_budget_sg && row.propose_budget_step ? <>{row.propose_budget_sg} - {row.propose_budget_step}</> : <QuestionIcon />}</TableCell>
                                            <TableCell align="center" sx={{ color: row?.is_collapse || row?.is_merge_reference ? '#BEBEBE' : '' }}>{row.propose_budget_amount ? row?.is_collapse ? <>({f.format(row.propose_budget_amount)})</> : f.format(row.propose_budget_amount) : <QuestionIcon />}</TableCell>
                                            <TableCell align="center">{row.revise_budget_sg && row.revise_budget_step ? <>{row.revise_budget_sg} - {row.revise_budget_step}</> : <QuestionIcon />}</TableCell>
                                            <TableCell align="center" sx={{ color: row?.is_collapse || row?.is_merge_reference ? '#BEBEBE' : '' }}>{row.revise_budget_amount ? f.format(row.revise_budget_amount) : <QuestionIcon />}</TableCell>
                                            <TableCell align="center">{row.increase_decrease ? <>({f.format(row.increase_decrease)})</> : ''}</TableCell>
                                            <TableCell align="center">
                                                <Box display='flex' justifyContent='flex-end' gap={1}>
                                                    {!row?.is_collapse && (
                                                        <Tooltip title="Collapse position">
                                                            <CallSplitIcon color='primary' sx={{ transform: 'rotate(270DEG)', border: `2px solid ${blue[500]}`, borderRadius: '50%', p: .5, fontSize: 35, cursor: 'pointer' }} onClick={() => handleOpenCollapse(row)} />
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip title="Update">
                                                        <Edit color='warning' sx={{ border: `2px solid ${orange[500]}`, borderRadius: '50%', p: .5, fontSize: 35, cursor: 'pointer' }} onClick={() => handleOpenUpdate(row)} />
                                                    </Tooltip>
                                                    <Tooltip title="Mark removed">
                                                        <Delete color='error' sx={{ border: `2px solid ${red[500]}`, borderRadius: '50%', p: .5, fontSize: 35, cursor: 'pointer' }} />
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
                <Box sx={{ mt: 1 }}>
                    <Pagination count={Math.ceil(total / perPage)} page={page} onChange={handlePaginate} color='primary' size='small' />
                </Box>
            </Box>
        </Box>
    );
};

export default PlantillaCasual;