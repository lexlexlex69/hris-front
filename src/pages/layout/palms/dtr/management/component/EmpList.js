import { Box, Button, Checkbox, Grid, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { formatExtName, formatMiddlename, isValidTime } from "../../../../customstring/CustomString";
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import { api_url } from "../../../../../../request/APIRequestURL";
import moment from "moment";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue, grey } from "@mui/material/colors";
import { tableCellClasses } from '@mui/material/TableCell';
import UpdateIcon from '@mui/icons-material/Update';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import PrintIcon from '@mui/icons-material/Print';
import SmallModal from "../../../../custommodal/SmallModal";
import { RawLogs } from "./RawLogs";
import { getAllRectification, processDTR, processDTR2 } from "../DTRManagementRequests";
import SmallestModal from "../../../../custommodal/SmallestModal";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { PrintForm } from "../../../../selfserviceportal/onlinedtrv2/form/PrintForm";
import { auditLogs } from "../../../../auditlogs/Request";
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { ProcessType } from "./ProcessType";

export const EmpList = ({ from, to, data, setData, actions, deptCode }) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: blue[900],
            // backgroundColor:grey[400],
            color: theme.palette.common.white,
            fontSize: matches ? '.7rem' : '.8rem',
            padding: 10
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: matches ? '.6rem' : '.8rem',
            padding: 10
        },
    }));
    useEffect(() => {
        setSelectedData({
            details: "[]"
        })
    }, [data])
    const [selectedData, setSelectedData] = useState({
        details: "[]"
    })
    const [rawLogsData, setRawLogsData] = useState([])
    const [workSchedData, setWorkSchedData] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const [selectedRow, setSelectedRow] = useState([])
    const filter = data.filter(el => el.fname?.toUpperCase().includes(searchVal.toUpperCase()) || el.lname?.toUpperCase().includes(searchVal.toUpperCase()))
    const [requestedOBOFTData, setRequestedOBOFTData] = useState([]);
    const [rectificationData, setRectificationData] = useState([]);
    const [alreadyAppliedRectification, setAlreadyAppliedRectification] = useState([]);
    const [signatory, setSignatory] = useState([]);
    const [rowsToAdd, setRowsToAdd] = useState([])
    const [daysNumber, setDaysNumber] = useState([])
    const [dtrData, setDTRData] = useState([]);
    const [empInfo, setEmpInfo] = useState({
        info: {
            fname: '',
            mname: '',
            lname: '',
            dept_title: '',
            description: ''
        }
    })
    const printDTR = useRef();
    const handleViewDTR = async (row) => {
        console.log(row)
        console.log(JSON.parse(row.details))

        if (row.details) {
            setSelectedData(row)
        }

        // APILoading('info','Processing data','Please wait...')
        // e.preventDefault();
        // _init()
        // var fromDate = data.from;
        // var toDate = data.to;
        // setDateFrom(fromDate);
        // setDateTo(toDate)
        // let t_data = {
        //     year:moment(from).format('YYYY'),
        //     year2:moment(to).format('YYYY'),
        //     from:from,
        //     to:to,
        //     api_url:api_url,
        //     emp_id:row.id,
        //     type:1
        // }
        // const res = await fetchEmpDTR(t_data);
        // console.log(res.data);
        // Swal.close();
        //get work sched
        // const work_sched = await getWorkSched(t_data)
        // setWorkSchedData(work_sched.data.data)

        // if(res.data.work_sched.length>0){
        //     setWorkSchedData(res.data.work_sched);
        //     setRawLogsData(res.data.raw_logs)
        //     //get leave days
        //     // const leave_days = await getLeaveDays(t_data);
        //     // console.log(leave_days.data.data)

        //     //get holidays
        //     // const holidays = await getAllHolidays();
        //     const holidays = tempHolidays();
        //     // console.log(holidays)

        //     // const ob_oft = await getEmpOBOFT(t_data)
        //     // console.log(ob_oft.data.data);

        //     // let t_data = {
        //     //     from:from,
        //     //     to:to,
        //     //     api_url:api_url
        //     // }


        //     // const res = await getEmpRawLogs(t_data);
        //     // setRawLogsData(res.data)
        //     // setRawlogs(res.data)
        //     // console.log(res.data)
        //     // setSignatory(res.data.signatory)

        //     // const rectification = await getEmpRectification(t_data);
        //     // console.log(rectification.data)
        //     // setAlreadyAppliedRectification(rectification.data.pending)

        //     var start = new Date(from);
        //     var end = to;
        //     var arrDays = [];

        //     while(moment(start).format('YYYY-MM-DD') <= (moment(end).format('YYYY-MM-DD'))){
        //         arrDays.push(moment(start).format('YYYY-MM-DD'));
        //         start.setDate(start.getDate()+1);
        //     }
        //     // setDaysNumber(arrDays)
        //     var start = arrDays.length;
        //     var end = 31;
        //     var row_number = [];
        //     var count = 0;
        //     while(start < end){
        //         row_number.push(count);
        //         start++;
        //         count++;
        //     }
        //     // setRowsToAdd(row_number)
        //     /**
        //     Set up processed DTR 
        //     */
        //     let dtr = [];
        //     arrDays.forEach(el=>{
        //         var time_logs = getTimeLogs(res.data.work_sched,res.data.raw_logs,el,res.data.leave_days,holidays,res.data.ob_oft,res.data.rectification);
        //         dtr.push(time_logs)
        //     })
        //     console.log(dtr)
        //     setSelectedData(dtr)
        //     // setDTRData(dtr)
        //     // setViewDTR(true)
        //     Swal.close();
        // }else{
        //     Swal.fire({
        //         icon:'error',
        //         title:'Oops...',
        //         text:'Work Schedule not found ! Please contact your AO.'
        //     })
        // }
    }
    const formatWorkSched = (date, type) => {
        var work_days = JSON.parse(workSchedData[0].working_days);
        var day = work_days.filter(el => el.day === moment(date, 'YYYY-MM-DD').format('dddd'));
        console.log(day)
        if (day.length > 0) {
            if (type === 1) {
                return moment(day[0].time_in, 'HH:mm').format('hh:mm a');
            } else {
                return moment(day[0].time_out, 'HH:mm').format('hh:mm a');
            }
        }
    }
    const reactToPrintDTR = useReactToPrint({
        content: () => printDTR.current,
        documentTitle: ''
    })
    const handlePrint = async (row) => {
        if (JSON.parse(row.details).length > 0) {
            APILoading('info', 'Processing DTR', 'Please wait')
            setEmpInfo({
                info: {
                    fname: row.fname,
                    mname: row.mname,
                    lname: row.lname,
                    extname: row.extname,
                    description: row.description,
                    officeassign: row.dept_title
                }
            })
            setDTRData(JSON.parse(row.details))
            //get ob-oft ,rectification
            const res = await getAllRectification({ emp_no: row.emp_no, emp_id: row.id, from: from, to: to, api_url: api_url })
            console.log(res.data)
            setAlreadyAppliedRectification(res.data.rect_approved)
            setRectificationData(res.data.rect_pending)
            setSignatory(res.data.signatory)
            var start = new Date(from);
            var end = to;
            var arrDays = [];

            while (moment(start).format('YYYY-MM-DD') <= (moment(end).format('YYYY-MM-DD'))) {
                arrDays.push(moment(start).format('YYYY-MM-DD'));
                start.setDate(start.getDate() + 1);
            }

            setDaysNumber(arrDays)

            var start = arrDays.length;
            var end = parseInt(moment().endOf(to).format('D'));
            var row_number = [];
            var count = 0;
            while (start < end) {
                row_number.push(count);
                start++;
                count++;
            }
            setRowsToAdd(row_number)
            var logs = {
                action: 'PRINT DTR',
                action_dtl: 'NAME = ' + row.fname + ' ' + row.mname + ' ' + row.lname + ' ' + row.extname + ' | FROM = ' + from + ' | TO = ' + to,
                module: 'DTR'
            }
            auditLogs(logs)
            reactToPrintDTR()
            Swal.close();
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'No Records can be printed'
            })
        }
    }
    const isRectified = (row, nature) => {
        return JSON.parse(row.rectified_logs).includes(nature);
    }
    const [selectedRawLogs, setSelectedRawLogs] = useState([])
    const [openRawLogs, setOpenRawlogs] = useState(false)
    const handleViewRawLogs = (row) => {
        let logs = JSON.parse(row.raw_logs)
        if (logs.length > 0) {
            console.log(row)
            setSelectedRow(row)
            logs.sort((a, b) => moment(a.timein, 'HH:mm:ss') - moment(b.timein, 'HH:mm:ss'))
            // const unique = [...new Set(logs.map(item => moment(item.timein,'HH:mm:ss').format('HH:mm')))];
            // const unique = [...new Map(logs.map(item =>
            // [moment(item['timein'],'HH:mm:ss').format('HH:mm'), item])).values()];
            // console.log(unique)

            //unique values based on timein and log type
            const t_u = logs.filter(function (a) {
                var key = moment(a.timein, 'HH:mm:ss').format('HH:mm') + '|' + a.suffix;
                if (!this[key]) {
                    this[key] = true;
                    return true;
                }
            }, Object.create(null));
            console.log(t_u)

            setSelectedRawLogs(t_u)

            setOpenRawlogs(true)
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'No Available Logs'
            })
        }
    }
    const [openProcessType, setOpenProcessType] = useState(false);
    const handleProcessType = () => {
        setOpenProcessType(true)
    }
    const [processType, setProcessType] = useState(0);
    const handleProcessDTR = () => {
        var t_data = {
            type: parseInt(processType),
            from: from,
            to: to,
            dept_code: deptCode
        }
        console.log(t_data) // test

        APILoading('info', 'Processing DTR', 'Please wait...')
        try {
            if (parseInt(processType) === 1) {
                if (selectedIDS > 0) {
                    var t_data = {
                        type: parseInt(processType),
                        from: from,
                        to: to,
                        emp_list: selectedIDS,
                        dept_code: deptCode
                    }
                    proceedProcessDTR(t_data)
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'No employee selected'
                    })
                }
            } else {
                var t_data = {
                    type: parseInt(processType),
                    from: from,
                    to: to,
                    emp_list: data.map(el => el.id),
                    dept_code: deptCode
                }
                proceedProcessDTR(t_data)
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: err
            })
        }
    }
    const proceedProcessDTR = async (data) => {
        // const res = await processDTR(data)
        const res = await processDTR2(data)
        if (res.data.status === 200) {
            setData(res.data.data)
            setOpenProcessType(false)
            Swal.fire({
                icon: 'success',
                title: res.data.message,
                // timer:1000
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: res.data.message
            })
        }
    }
    const [selectedIDS, setSelectedIDS] = useState([])
    const handleSelect = (id) => {
        var index = selectedIDS.indexOf(id);
        var temp = [...selectedIDS];
        if (index >= 0) {
            //remove id
            temp.splice(index, 1);
            setSelectedIDS(temp)
        } else {
            temp.push(id);
            setSelectedIDS(temp)
        }
    }
    return (
        <Box>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Paper sx={{ p: 1 }}>
                        <Box>
                            <TextField label='Filter Employee' type='text' value={searchVal} onChange={(val) => setSearchVal(val.target.value)} fullWidth InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }} size="small" placeholder="Firstname | Lastname" />
                            <Typography sx={{ color: '#fff', fontSize: '.9rem', mt: 1, background: blue[900], p: 1 }}>Employee List</Typography>
                        </Box>
                        <Box>
                            <List sx={{ height: '40vh', overflowY: 'scroll' }}>
                                {
                                    filter.map((item) => {
                                        return (
                                            <ListItem disablePadding key={item.id} sx={{
                                                '&:hover': {
                                                    background: blue[200
                                                    ]
                                                }, background: selectedData.id === item.id || selectedIDS.includes(item.id) ? blue[200] : '#fff'
                                            }}
                                                secondaryAction={
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        {
                                                            actions.includes('PRINT')
                                                                ?
                                                                <Tooltip title='Print DTR'>
                                                                    <IconButton sx={{ background: '#fff', '&:hover': { background: '#fff' }, padding: .5 }} edge="end" aria-label="print" color="info" onClick={() => handlePrint(item)}>
                                                                        <PrintIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            actions.includes('PROCESS')
                                                                ?
                                                                <Checkbox checked={selectedIDS.includes(item.id) ? true : false} onClick={() => handleSelect(item.id)} />
                                                                :
                                                                null
                                                        }

                                                    </Box>

                                                }
                                            >
                                                <ListItemButton onClick={() => handleViewDTR(item)} sx={{ color: selectedData.id === item.id || selectedIDS.includes(item.id) ? '#fff' : 'auto' }}>
                                                    {/* <ListItemIcon>
                                                    <PersonIcon />
                                                </ListItemIcon> */}
                                                    <ListItemText primary={`${item.lname}, ${item.fname} ${formatExtName(item.extname)} ${formatMiddlename(item.mname)}`} sx={{ '.MuiListItemText-primary': { fontSize: '.8rem', textTransform: 'uppercase' } }} />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    })
                                }

                            </List>
                        </Box>
                        {
                            actions.includes('PROCESS')
                                ?
                                <Box>
                                    <Button variant="contained" size="small" startIcon={<UpdateIcon />} sx={{ fontSize: '.7rem' }} onClick={handleProcessType} className="custom-roundbutton">Process</Button>
                                </Box>
                                :
                                null
                        }

                        <SmallModal open={openRawLogs} close={() => setOpenRawlogs(false)} title='Adjust Biometric Raw Logs'>
                            <RawLogs selectedRowDTR={selectedRow} selectedRawLogs={selectedRawLogs} from={from} to={to} setSelectedData={setSelectedData} actions={actions} />
                        </SmallModal>
                    </Paper>
                </Grid>
                <Grid item xs={8} sx={{ mt: 1 }}>
                    <Paper>
                        <TableContainer sx={{ maxHeight: '60vh', minHeight: '60vh' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            Date
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Schedule In
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Schedule Out
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Time In
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Break Out
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Break In
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Time Out
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Late <br />
                                            (minute/s)
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Undertime <br />
                                            (minute/s)
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        JSON.parse(selectedData.details).length > 0
                                            ?
                                            JSON.parse(selectedData.details).map((item, key) => {
                                                return (
                                                    <TableRow key={key} sx={{ '&:hover': { background: grey[300] } }}>
                                                        <StyledTableCell>
                                                            {moment(item.date, 'YYYY-MM-DD').format('MM-DD-YYYY')}
                                                        </StyledTableCell>
                                                        <StyledTableCell sx={{ textTransform: 'uppercase', color: isValidTime(item.sched_in) ? 'black' : item.day_type === 0 ? blue[800] : 'red' }}>
                                                            {isValidTime(item.sched_in) ? moment(item.sched_in, 'HH:mm').format('hh:mm A') : item.sched_in}
                                                        </StyledTableCell>

                                                        <StyledTableCell sx={{ textTransform: 'uppercase', color: isValidTime(item.sched_in) ? 'black' : item.day_type === 0 ? blue[800] : 'red' }}>
                                                            {isValidTime(item.sched_out) ? moment(item.sched_out, 'HH:mm').format('hh:mm A') : item.sched_out}
                                                        </StyledTableCell>

                                                        <StyledTableCell sx={{ fontWeight: isRectified(item, 'Time In') ? 'bold' : 'normal' }}>
                                                            {isValidTime(item.time_in) ? moment(item.time_in, 'HH:mm').format('hh:mm A') : item.time_in}
                                                        </StyledTableCell>

                                                        <StyledTableCell sx={{ fontWeight: isRectified(item, 'Break Out') ? 'bold' : 'normal' }}>
                                                            {isValidTime(item.break_out) ? moment(item.break_out, 'HH:mm').format('hh:mm A') : item.break_out}
                                                        </StyledTableCell>

                                                        <StyledTableCell sx={{ fontWeight: isRectified(item, 'Break In') ? 'bold' : 'normal' }}>
                                                            {isValidTime(item.break_in) ? moment(item.break_in, 'HH:mm').format('hh:mm A') : item.break_in}
                                                        </StyledTableCell>

                                                        <StyledTableCell sx={{ fontWeight: isRectified(item, 'Time Out') ? 'bold' : 'normal' }}>
                                                            {isValidTime(item.time_out) ? moment(item.time_out, 'HH:mm').format('hh:mm A') : item.time_out}

                                                        </StyledTableCell>

                                                        <StyledTableCell align="center">
                                                            {item.late > 0 ? item.late : '-'}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            {item.undertime > 0 ? item.undertime : '-'}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            {/* <Button variant="contained" size="small" startIcon={<UpdateIcon/>}>ReProcess</Button> */}
                                                            <Button variant="contained" size="small" startIcon={<HistoryToggleOffIcon />} onClick={() => handleViewRawLogs(item)} className="custom-roundbutton">Logs</Button>
                                                        </StyledTableCell>
                                                    </TableRow>
                                                )
                                            })
                                            :
                                            <TableRow>
                                                <StyledTableCell colSpan={9} align="center">No Employee Selected</StyledTableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <ProcessType openProcessType={openProcessType} setOpenProcessType={() => setOpenProcessType(false)} handleProcessDTR={handleProcessDTR} processType={processType} setProcessType={setProcessType} />
                {/* <SmallestModal open={openProcessType} close = {()=>setOpenProcessType(false)} title='Process Options'>
                    <Grid container spacing={2} sx={{p:1}}>
                        <Grid item xs={12}>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={processType}
                                    name="radio-buttons-group"
                                    onChange={(val)=>setProcessType(val.target.value)}
                                >
                                    <FormControlLabel value={0} control={<Radio />} label="Selected Department" />
                                    <FormControlLabel value={1} control={<Radio />} label="Selected Employee" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                            <Button variant="contained" color="success" size='small' className="custom-roundbutton" onClick={handleProcessDTR}>Proceed</Button>
                            <Button variant="contained" color="error" size='small' className="custom-roundbutton" onClick={()=>setOpenProcessType(false)}>cancel</Button>
                        </Grid>
                    </Grid>
                </SmallestModal> */}
                <Grid item xs={12}>
                    <div style={{ display: 'none' }}>
                        <div ref={printDTR} style={{ width: '100%' }}>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', margin: '20px' }}>
                                <Grid item xs={6} sx={{ margin: '0 10px' }}>
                                    <PrintForm data={dtrData} rowsToAdd={rowsToAdd} empInfo={empInfo} signatory={signatory} from={from} to={to} alreadyAppliedRectification={alreadyAppliedRectification} rectificationData={rectificationData} daysNumber={daysNumber} />
                                </Grid>
                                <Grid item xs={6} sx={{ margin: '0 10px' }}>
                                    <PrintForm data={dtrData} rowsToAdd={rowsToAdd} empInfo={empInfo} signatory={signatory} from={from} to={to} alreadyAppliedRectification={alreadyAppliedRectification} rectificationData={rectificationData} daysNumber={daysNumber} />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Grid>
            </Grid>


        </Box>
    )
}