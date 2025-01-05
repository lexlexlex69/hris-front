import React, { useState, useEffect } from 'react'
import 'animate.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { orange, red } from '@mui/material/colors';

import moment from 'moment'
import axios from 'axios'

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

import CommonDialog from '../../../../common/CommonDialog'
import AddMpr from './AddMpr';
import Update from './Update';
import Tooltip from '@mui/material/Tooltip'



const Mpr = () => {
    const [openAdd, setOpenAdd] = useState(false)
    const handleCloseAdd = () => setOpenAdd(false)
    const [tableLoader, setTableLoader] = useState(true)
    const [total, setTotal] = useState(0)
    // pagination 
    const perPage = 5
    const [page, setPage] = useState(1)
    const [mpr, setMpr] = useState([])
    const [mprFilters, setMprFilters] = useState({
        mpr_no: '',
        pos: '',
        dept: '',
        status: ''
    })

    const [openUpdate, setOpenUpdate] = useState(false)
    const [updateData, setUpdateData] = useState(null)
    const handleOpenUpdate = (item) => {
        let temp = { ...item }
        temp.employment_status = temp.employment_status.toString()
        setUpdateData(temp)
        setOpenUpdate(true)
    }

    const handleCloseUpdate = () => setOpenUpdate(false)
    const fetchMpr = async (pager) => {
        let res = await axios.get(`/api/recruitment/mpr/get-mpr?page=${pager}&&perPage=${perPage}&&mpr_no=${mprFilters.mpr_no}&&pos=${mprFilters.pos}&&dept=${mprFilters.dept}&&status=${mprFilters.status}`)
        console.log(res)
        setMpr(res.data.data)
        setTotal(res.data.total)
        setTableLoader(false)
        setPage(pager)
    }
    const filterMpr = () => {
        setTableLoader(true)
        fetchMpr(1)
    }
    const mprFiltersOnChange = (e) => {
        setMprFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handlePagination = async (e, v) => {
        if (page === v)
            return
        else {
            setTableLoader(true)
            fetchMpr(v)
            setPage(v)
        }
    }
    useEffect(() => {
        fetchMpr(page)
    }, [])
    return (
        <Box sx={{ px: 2, width: '100%' }}>
            {/* filters */}
            <CommonDialog open={openAdd} handleClose={handleCloseAdd} title='New Man Power Request' customWidth='40%' ><AddMpr mpr={mpr} setMpr={setMpr} handleClose={handleCloseAdd} setTotal={setTotal} /></CommonDialog>
            <CommonDialog open={openUpdate} handleClose={handleCloseUpdate} title='Update MPR' bgcolor="warning.main" customWidth='40%' ><Update mprUpdate={updateData} mpr={mpr} setMpr={setMpr} handleClose={handleCloseUpdate} /></CommonDialog>
            <Box display='flex' gap={2} alignItems='center' justifyContent='space-between'>
                <Button variant='contained' sx={{ borderRadius: '2rem' }} startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>new Mpr</Button>
                <Box display='flex' gap={1}>
                    <TextField size='small' label="MPR NO" value={mprFilters.mpr_no} name='mpr_no' onChange={mprFiltersOnChange}></TextField>
                    <TextField size='small' label="POSITION" value={mprFilters.pos} name='pos' onChange={mprFiltersOnChange}></TextField>
                    <TextField size='small' label="DEPARTMENT" value={mprFilters.dept} name='dept' onChange={mprFiltersOnChange}></TextField>
                    <TextField size='small' label="STATUS" value={mprFilters.status} name='status' sx={{ width: '12rem' }} onChange={mprFiltersOnChange} select>
                        <MenuItem value={1}>CASUAL</MenuItem>
                        <MenuItem value={2}>JOB ORDER</MenuItem>
                        <MenuItem value={3}>CONTRACT OF SERVICE</MenuItem>
                    </TextField>
                    <SearchIcon sx={{ fontSize: 35, color: 'primary.main', cursor: 'pointer' }} onClick={filterMpr} />
                </Box>

            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>MPR NO</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>APPOINTED</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>DEPARTMENT</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>POSITION</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>DATE REQUESTED</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>DATE NEEDED</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>BUDGET</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>HEAD COUNT</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>PROPOSED RATE</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>STATUS</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>JUSTIFICATION</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>DETAILS</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>QUALIFICATION</TableCell>
                            <TableCell align="center" className='cgb-color-table' sx={{ color: '#fff' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableLoader ? (
                            <>
                                {Array.from(Array(5)).map((item, i) => (
                                    <TableRow key={i}>
                                        {Array.from(Array(14)).map((item2, i2) => (
                                            <TableCell align="center" key={i2} sx={{ fontSize: '12px' }}> <Skeleton variant='text' height={30} /></TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        ) :
                            (
                                <>
                                    {mpr.map((row) => (
                                        <TableRow
                                            key={row.mpr_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{ fontSize: '12px' }} >
                                                {row.mpr_no}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}></TableCell>
                                            <TableCell align="center" sx={{ fontSize: '10px' }}>{row.dept_title}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '10px' }}>{row.position_name}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{moment(row.date_requested, "MMM-DD-YYYY").format("MMM DD, YYYY")}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{moment(row.date_needed, "MMM-DD-YYYY").format("MMM DD, YYYY")}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{row.budget === 1 ? 'Budgeted' : 'Unbudgeted'}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{row.head_count}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{row.proposed_rate}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{row?.status_others ? row?.status_others : row.employment_status === 1 ? 'CASUAL' : row.employment_status === 2 ? 'JO' : row.employment_status === 3 ? 'COS' : ''}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{row?.mpr_justification_others ? row?.mpr_justification_others : row?.mpr_justification === 1 ? 'NEW POSITION' : row?.mpr_justification === 2 ? 'ADDITIONAL HC' : row?.mpr_justification === 3 ? 'REPLACEMENT' : row?.mpr_justification === 4 ? 'UPGRADE' : ''}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{row.mpr_details}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px' }}>{row.mpr_qualification}</TableCell>
                                            <TableCell align="center">
                                                <Box display='flex' gap={1}>
                                                    <Tooltip title="Update MPR">
                                                        <Edit onClick={() => handleOpenUpdate(row)} sx={{ transition: `all .2s`, border: `2px solid ${orange[500]}`, borderRadius: '100%', p: .5, fontSize: 35, color: 'warning.main', cursor: 'pointer', '&:hover': { color: orange[800], border: `2px solid ${orange[800]}`, } }} />
                                                    </Tooltip>
                                                    <Tooltip title="Delete MPR">
                                                        <Delete sx={{ border: `2px solid ${red[500]}`, borderRadius: '100%', p: .5, fontSize: 35, color: 'error.main' }} />
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
            <Pagination count={Math.ceil(total / perPage)} sx={{ mt: 1 }} size='small' page={page} onChange={handlePagination} color='primary' />
        </Box>
    );
};

export default Mpr;