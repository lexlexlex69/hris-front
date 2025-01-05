import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Card, Paper, CardContent, Skeleton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { Search } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DescriptionIcon from '@mui/icons-material/Description';

import EasyAccess from './EasyAccess';
import EasyAccessCards from './EasyAccessCards';

import moment from 'moment';
const f = new Intl.NumberFormat('EN', { style: 'currency', currency: 'PHP' })

const FormC = ({ dept_id, arr, offices }) => {
    const [segrtd, setSgrtd] = useState({})
    // const [tableData, setTableData] = useState({})
    const [dateFrom, setDateFrom] = useState(new Date())
    const [dateTo, setDateTo] = useState(new Date())
    useEffect(() => {
        let segregated = arr.reduce((acc, curr) => {
            acc[curr['effectivity']] = [...acc[curr['effectivity']] || [], curr]
            return acc
        }, [])
        console.log('seg', segregated)
        setSgrtd(segregated)
    }, [arr])

    function handlePrint() {
    }
    return (
        <Box p={2} bgcolor="#D3D3D3" minHeight='calc(100vh - 66px)'>
            <EasyAccess showSelected={false}>
                <EasyAccessCards onClick={handlePrint} icon={<DescriptionIcon sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} />} title='Generate report' shortText='Form 34-F' />
            </EasyAccess>
            <Typography variant="body2" sx={{ color: '#5C5C5C' }}>
                PLANTILLA OF CASUAL APPOINTMENT
            </Typography>
            <Typography variant="body2" sx={{ color: '#5C5C5C' }}>
                Department/Office: {offices.find(a => a.dept_code === dept_id)?.dept_title}
            </Typography>
            {segrtd && Object.entries(segrtd).map(([k, v], i) => (
                <Box sx={{ my: 5 }}>
                    <Box display='flex' justifyContent='flex-start'>
                        <Typography variant="body2" color="#5C5C5C">Effectivity date: {moment(k, "YYYY-MM-DD").format("MM/DD/YYYY")}</Typography>
                    </Box>
                    {/* <Box bgcolor='#fff' p={2} borderRadius={'5px'} display='flex' gap={2} alignItems='center' mt={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="FROM"
                                value={dateFrom}
                                onChange={(newValue) => {
                                    setDateFrom(newValue)
                                }}
                                renderInput={(params) => <TextField size='small' sx={{ width: '20ch' }} required {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="TO"
                                value={dateTo}
                                onChange={(newValue) => {
                                    setDateTo(newValue)
                                }}
                                renderInput={(params) => <TextField sx={{ width: '20ch' }} size='small' required {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                        <Tooltip title="Search ">
                            <Search color='primary' sx={{ fontSize: 40, cursor: 'pointer', '&"hover': { color: blue[800] } }} onClick={handleFilter} />
                        </Tooltip>
                    </Box> */}
                    <TableContainer component={Paper} >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={4} align="center">NAME OF APPOINTEES</TableCell>
                                    <TableCell rowSpan={2} align="right">POSITION TITLE</TableCell>
                                    <TableCell rowSpan={2} align="right">EQUIVALENT SAARY/ JOB/ PAY GRADE</TableCell>
                                    <TableCell rowSpan={2} align="right">DAILY WAGE</TableCell>
                                    <TableCell colSpan={2} align="right">PERIOD OF EMPLOYMENT</TableCell>
                                    <TableCell rowSpan={2} align="center">NATURE OF APPOINTMENT</TableCell>
                                </TableRow>
                                <TableRow>
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
                                {Array.isArray(v) && v.length && v.map(row => (
                                    <TableRow
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row?.lname}
                                        </TableCell>
                                        <TableCell align="right">{row?.fname}</TableCell>
                                        <TableCell align="right">{row?.extn}</TableCell>
                                        <TableCell align="right">{row?.mname}</TableCell>
                                        <TableCell align="right">{row?.position_name}</TableCell>
                                        <TableCell align="right">SG {row?.propose_budget_sg}</TableCell>
                                        <TableCell align="right">{row?.proposed_rate ? f.format(((row?.proposed_rate / 12) / (moment(new Date(), "YYYY-MM").daysInMonth() - 8)).toFixed(2)) : ''}</TableCell>
                                        <TableCell align="center">{row?.period_from ? moment(row?.period_from, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</TableCell>
                                        <TableCell align="center">{row?.period_to ? moment(row?.period_to, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</TableCell>
                                        <TableCell align="center">{row?.nature}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ))}
        </Box>
    );
};

export default FormC;