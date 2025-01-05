import React,{useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {Box,Grid,Typography,Paper,Autocomplete,TextField,Button,Select,FormControl,InputLabel,MenuItem,TableContainer,Table,TableRow,TableHead,TableBody,Checkbox,IconButton,Fade,Alert,Tooltip} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { addTrainingAttendance, getTrainingParticipants } from '../TrainingAttendanceRequest';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import PrintIcon from '@mui/icons-material/Print';
import Swal from 'sweetalert2';
import {green,blue} from '@mui/material/colors';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from 'react-toastify';
import '.././Custom.css';
import { DownloadTableExcel } from 'react-export-table-to-excel';

export default function AddAttendance(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [selectedID,setSelectedID] = useState([])
    const [showLoading,setShowLoading] = useState(true)
    const [dateData,setDateData] = useState([])
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?12:'auto',
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?11:14,
        },
    }));
    useEffect(()=>{
        var f_date = new Date(props.data.period_from)
        var t_date = new Date(props.data.period_to)
        var d_arr=[];
        while(moment(f_date,'YYYY-MM-DD').format('YYYY-MM-DD') <= moment(t_date,'YYYY-MM-DD').format('YYYY-MM-DD')){
            if(moment(f_date,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD')){
                d_arr.push(moment(f_date,'YYYY-MM-DD').format('YYYY-MM-DD'))
            }
            f_date.setDate(f_date.getDate()+1);
            
        }
        setDateData(d_arr);
        console.log(d_arr)
        var data2 = {
            id:props.data.training_details_id
        }
        getTrainingParticipants(data2)
        .then(res=>{
            setData(res.data)
            setShowLoading(false)
        }).catch(err=>{
            console.log(err)
            setShowLoading(false)
            toast.error(err.message)
        })
    },[props.data])
    
    const [dateTime,setDateTime] = useState(new Date())
    const [selectedDate,setSelectedDate] = useState('')
    const handleSelectDate = (value) => {
        setSelectedDate(value.target.value);
    };
    const handleChangeDateTime = (newValue) => {
        setDateTime(newValue);
    };
    const [period, setPeriod] = useState('');
    const [periodData,setPeriodData] = useState([
        {period:'AM-IN',sort:1},
        {period:'AM-OUT',sort:2},
        {period:'PM-IN',sort:3},
        {period:'PM-OUT',sort:4},
        {period:'AM-IN-OUT',sort:5},
        {period:'PM-IN-OUT',sort:6},
        {period:'AM-PM-IN-OUT',sort:7},
    ])
    const handleChangePeriod = (event) => {
        setPeriod(event.target.value);
    };
    const handleSelectID = (id)=>{
        var temp = [...selectedID];
        if(temp.includes(id)){
           var index = temp.indexOf(id);
           if(index >-1){
                temp.splice(index,1);
                setSelectedID(temp)
           }
        }else{
            temp.push(id);
            setSelectedID(temp)
        }
    }
    const handleSave = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Saving data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var data2 = {
            ids:selectedID,
            date:selectedDate,
            period:period,
            training_details_id:props.data.training_details_id
        }
        // console.log(data2)
        addTrainingAttendance(data2)
        .then(res=>{
            if(res.data.status === 200){
                setSelectedID([])
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
            }else if(res.data.status === 201){
                Swal.fire({
                    icon:'warning',
                    title:res.data.message,
                    html:'To update the attendance, click the update button.',
                    showCancelButton:true,
                    cancelButtonText:'Ok',
                    confirmButtonText:'Update',
                    confirmButtonColor:green[800]
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            icon:'info',
                            title:'redirecting'
                        })
                    }
                  })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const printAttendance = useRef();
    const formatExtName = (val)=>{
        var ext_names = ['JR.','JR','SR','SR.','I','II','III','IV','V','VI','VII','VIII'];
        if(val){
            if(ext_names.includes(val.toUpperCase())){
                return ', '+val;
            }else{
                return null
            }
        }
        return null
        
    }
    return(
        <>
        {
            showLoading
            ?
            // <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
            //     <DataTableLoader/>
            // </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showLoading}
            >
                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <CircularProgress color="inherit" />
                    <Typography>Loading Data. Please wait...</Typography>
                </Box>

            </Backdrop>
            :
                data.length === 0
                ?
                <Grid container>
                    <Grid item xs={12}>
                        <Alert severity="info">No data. None of the trainee was approved in this training. Please contact nomination approver incharge !</Alert>
                    </Grid>
                </Grid>
                :
                dateData.length ===0
                ?
                <Grid container>
                    <Grid item xs={12}>
                        <Alert severity="warning">No available date/s !</Alert>
                    </Grid>
                </Grid>
                :
                <Fade in>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                    <DownloadTableExcel
                        filename='Attendance'
                        sheet="Evaluation"
                        currentTableRef={printAttendance.current}
                        style={{cursor:'d'}}
                    >

                    <Tooltip title='Download List of Attendance'><Button variant='contained' startIcon={<PrintIcon/>}>Print Attendance</Button></Tooltip>
                    </DownloadTableExcel>
                    
                    </Box>
                    <form onSubmit={handleSave}>
                    <Paper sx={{width:'100%',p:1}}>
                        <Grid item container spacing={1}>
                            <Grid item xs = {12} md = {4} lg={4}>
                                <TextField label='Training Name' value={props.data.training_name} fullWidth readOnly/>
                            </Grid>
                            <Grid item xs = {12} md = {4} lg={4}>
                                <TextField label='Training Venue' value={props.data.venue} fullWidth readOnly/>
                            </Grid>
                            {/* <Grid item xs = {12} md = {2} lg={2}>
                                <TextField label='From' value={props.data.period_from} fullWidth readOnly/>
                            </Grid>
                            <Grid item xs = {12} md = {2} lg={2}>
                                <TextField label='To' fullWidth value={props.data.period_to} readOnly/>
                            </Grid> */}
                            <Grid item xs = {12} md = {2} lg={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Date</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedDate}
                                    label="Date"
                                    onChange={handleSelectDate}
                                    required
                                    >
                                    {
                                        dateData.map((row,key)=>
                                        <MenuItem value={row} key={key}>{moment(row).format('MMMM DD, YYYY')}</MenuItem>
                                        )
                                    }
                                    </Select>
                                </FormControl>
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Date & Time"
                                    value={dateTime}
                                    onChange={handleChangeDateTime}
                                    renderInput={(params) => <TextField {...params} fullWidth/>}
                                    readOnly
                                />
                                </LocalizationProvider> */}
                            </Grid>
                            <Grid item xs = {12} md = {2} lg={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="select-period">Period *</InputLabel>
                                    <Select
                                    labelId="select-period"
                                    id="select-period"
                                    value={period}
                                    label="Period"
                                    onChange={handleChangePeriod}
                                    required
                                    >
                                    {
                                        periodData.map((row,key)=>
                                        <MenuItem value={row} key={key}>{row.period}</MenuItem>
                                        )
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                            <TableContainer sx={{ maxHeight: 350 }}>
                                <Table stickyHeader aria-label="sticky table" hover>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>Department</StyledTableCell>
                                            <StyledTableCell>Position</StyledTableCell>
                                            <StyledTableCell>Select</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data.map((row,key)=>
                                                <TableRow key={key} hover={true} onClick = {()=>handleSelectID(row.emp_id)} sx={{'&:hover':{cursor:'pointer'}}}>
                                                    <StyledTableCell>{row.lname}, {row.fname}</StyledTableCell>
                                                    <StyledTableCell>{row.short_name}</StyledTableCell>
                                                    <StyledTableCell>{row.position_name}</StyledTableCell>
                                                    <StyledTableCell><Checkbox checked = {selectedID.includes(row.emp_id)} onChange = {()=>handleSelectID(row.emp_id)}/></StyledTableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2,display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Button variant='contained' color='success' type='submit' disabled={selectedID.length === 0 ?true:false} className='custom-roundbutton'>Save</Button>
                        </Grid>
                    </Paper>
                    </form>
                </Grid>
                </Fade>
            
        }
        <div style={{display:'none'}} id='print-attendance-table'>
            <table ref={printAttendance} className='table'>
                
                <thead>
                    <tr>
                        <td>
                            No.
                        </td>
                        <td>
                            Name
                        </td>
                        <td>
                            Gender
                        </td>
                        <td>
                            Position
                        </td>
                        <td>
                            Office
                        </td>
                        <td>
                            Mobile No.
                        </td>
                        <td>
                            Signature
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((row,key)=>
                            <tr key={key}>
                                <td>
                                    {key+1}
                                </td>
                                <td>
                                    {row.lname}, {row.fname}{formatExtName(row.extname)} {row.mname?row.mname.charAt(0)+'.':''}
                                </td>
                                <td>
                                    {row.sex}
                                </td>
                                <td>
                                    {row.position_name}
                                </td>
                                <td>
                                    {row.dept_title}
                                </td>
                                <td>
                                    {row.cpno}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
        </>
    )
}