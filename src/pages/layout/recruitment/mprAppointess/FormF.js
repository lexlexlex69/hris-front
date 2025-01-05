import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Card, Paper, CardContent, Skeleton, TextField, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';

import moment from 'moment';
import { Print, Search } from '@mui/icons-material';

import EasyAccess from './EasyAccess';
import EasyAccessCards from './EasyAccessCards';
import { toast } from 'react-toastify';
import { blue } from '@mui/material/colors';

const FormF = ({ dept_id, offices }) => {
    const [tableLoader, setTableLoader] = useState(true)
    const [appointees, setAppointees] = useState({})
    const [tableData, setTableData] = useState({})
    const [dateFrom, setDateFrom] = useState(new Date())
    const [dateTo, setDateTo] = useState(new Date())
    const getAppointees = async () => {
        setTableLoader(true)
        let res = await axios.get(`/api/recruitment/mpr-appointees/get-mpr-appointees?dept_id=${dept_id}&&fetchAll=1`)
        let tmp = []
        if (res?.data?.length) {
            let tmp2 = []
            res.data.forEach(x => {
                if (x?.appointed_arr?.length) {
                    let tmpX = x.appointed_arr.map(y => ({ ...y, position_name: x.position_name, propose_budget_sg: x.propose_budget_sg, proposed_rate: x.proposed_rate, is_remove: false }))
                    if (Array.isArray(tmpX) && tmpX.length) {
                        let tmpY = tmpX.filter(x => x.nature.trim() === "RENEWAL")
                        tmp2 = [...tmp2, ...tmpY]
                    }
                }
            })
            tmp = [...tmp, ...tmp2]
        }
        let sp = tmp.reduce((acc, cur) => {
            acc[cur['effectivity']] = [...acc[cur['effectivity']] || [], cur]
            return acc
        }, {})
        setAppointees(sp)
        setTableData(sp)
        setTableLoader(false)
    }

    function handlePrint() {
        let toPrint = []
        Object.entries(tableData).forEach(([k, v], i) => {
            if (v.length) {
                v?.forEach(item => {
                    if (!item.is_remove)
                        toPrint.push(item)
                })
            }
        })

        if (!toPrint.length) {
            toast.warning('Nothing to generate/print')
        }
        else {
            toast.success('Yay!')
        }
    }

    function handleRemove(key, value) {
        let tempObj = Object.assign({}, tableData)
        if (!value.is_remove) {
            let markRemove = tempObj[key].map(x => x.id === value.id ? ({ ...x, is_remove: true }) : x)
            tempObj[key] = markRemove
            setTableData(tempObj)
        }
        else {
            let markRemove = tempObj[key].map(x => x.id === value.id ? ({ ...x, is_remove: false }) : x)
            tempObj[key] = markRemove
            setTableData(tempObj)
        }
    }

    function handleFilter() {
        let temp = []
        Object.entries(appointees).map(([k, v], i) => {
            if ((moment(dateFrom).format("YYYY-MM-DD") <= moment(v[0]?.effectivity).format("YYYY-MM-DD")) && (moment(dateTo).format("YYYY-MM-DD") >= moment(v[0]?.effectivity).format("YYYY-MM-DD"))) {
                let temp2 = [...appointees[k]]
                temp = [...temp, ...temp2]
            }
        })
        console.log(temp)
        let sp = temp.reduce((acc, cur) => {
            acc[cur['effectivity']] = [...acc[cur['effectivity']] || [], cur]
            return acc
        }, {})
        setTableData(sp)
    }

    useEffect(() => {
        getAppointees()
    }, [])

    return (
        <Box p={3} bgcolor='#D3D3D3' minHeight='calc(100vh - 66px)'>
            <EasyAccess showSelected={false}>
                <EasyAccessCards onClick={handlePrint} icon={<DescriptionIcon sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} />} title='Generate report' shortText='Form 34-F' />
            </EasyAccess>
            <Typography variant="body2" sx={{ color: '#5C5C5C' }} align='left'>PLANTILLA OF CASUAL APPOINTMENT</Typography>
            <Typography variant="body2" sx={{ color: '#5C5C5C' }} color="primary" align='left'>( RE-APPOINTMENT RENEWAL )</Typography>
            <Typography variant="body2" sx={{ color: '#5C5C5C' }} color="primary" align='left'>{offices.find(a => a.dept_code === dept_id)?.dept_title}</Typography>
            <Box bgcolor='#fff' p={2} borderRadius={'5px'} display='flex' gap={2} alignItems='center' mt={2}>
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
            </Box>

            {tableLoader ? (
                <>
                    {Array.from(Array(3)).map((z, i) => (
                        <Card key={i} sx={{ my: 3 }}>
                            <CardContent>
                                <Skeleton variant="text" minWidth="100%"></Skeleton>
                                {Array.from(Array(3)).map(x =>
                                    <Box mt={2} display='flex' gap={3} width='100%'>
                                        {Array.from(Array(4)).map(y =>
                                            <Skeleton variant="text" sx={{ width: '100%' }}></Skeleton>
                                        )}
                                    </Box>
                                )}

                            </CardContent>
                        </Card>
                    ))}
                </>
            ) : (
                <>
                    {tableData && Object.entries(tableData).map(([k, v], i) =>
                    (
                        <Box key={i} sx={{ my: 5 }}>
                            <Box display='flex' justifyContent='flex-start'>
                                <Typography variant='body2' color='#5C5C5C'>Effectivity date: {moment(k, "YYYY-MM-DD").format("MM/DD/YYYY")}</Typography>
                            </Box>
                            <TableContainer component={Paper} >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell rowSpan={2} align="left">EXCLUDE</TableCell>
                                            <TableCell colSpan={4} align="center">NAME OF APPOINTEES</TableCell>
                                            <TableCell rowSpan={2} align="right">POSITION TITLE</TableCell>
                                            <TableCell rowSpan={2} align="right">NATURE OF APPOINTMENT</TableCell>
                                            <TableCell rowSpan={2} align="right">EQUIVALENT SAARY/ JOB/ PAY GRADE</TableCell>
                                            <TableCell rowSpan={2} align="right">DAILY WAGE</TableCell>
                                            <TableCell colSpan={2} align="right">PERIOD OF EMPLOYMENT</TableCell>
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
                                                <TableCell align='left'>
                                                    {row?.is_remove ? (
                                                        <>
                                                            <Tooltip title="cancel">
                                                                <HighlightOffIcon sx={{ cursor: 'pointer', color: 'error.main' }} onClick={() => handleRemove(k, row)} />
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Tooltip title="Remove">
                                                                <RemoveCircleOutlineIcon sx={{ cursor: 'pointer' }} onClick={() => handleRemove(k, row)} />
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </TableCell>
                                                <TableCell component="th" scope="row" sx={{ color: row?.is_remove ? '#BEBEBE' : '' }}>
                                                    {row?.lname}
                                                </TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="right">{row?.fname}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="right">{row?.extn}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="right">{row?.mname}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="right">{row?.position_name}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="right">{row?.nature}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="right">SG {row?.propose_budget_sg}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="right">{row?.proposed_rate ? ((row?.proposed_rate / 12) / (moment(new Date(), "YYYY-MM").daysInMonth() - 8)).toFixed(2) : ''}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="center">{row?.period_from ? moment(row?.period_from, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</TableCell>
                                                <TableCell sx={{ color: row?.is_remove ? '#BEBEBE' : '' }} align="center">{row?.period_to ? moment(row?.period_to, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )
                    )}
                </>
            )}
        </Box>
    );
};

export default React.memo(FormF);