import React,{useEffect, useRef, useState} from 'react';
import { deleteSpecificDatePeriodAttendance, getAllAttendance } from '../TrainingAttendanceRequest';
import {TableContainer,Table,TableRow,TableHead,TableBody,Fade,Paper,IconButton,Tooltip,Box,Typography,Dialog,Button} from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Swal from 'sweetalert2';
import {green,blue,red} from '@mui/material/colors';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import Slide from '@mui/material/Slide';
import moment from 'moment';
import ViewAttendanceList from './ViewAttendanceList';
import ReactExport from "react-export-excel";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from 'react-toastify';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ManageAttendance(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] =useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [viewAttendanceListDialog,setViewAttendanceListDialog] = useState(false);
    const [attendanceData,setAttendanceData] = useState([]);
    const [printData,setPrintData] = useState([])
    useEffect(()=>{
        console.log(props.data)
        var data2 = {
            training_details_id:props.data.training_details_id
        }
        getAllAttendance(data2)
        .then(res=>{
            setData(res.data)
            setShowLoading(false)
        }).catch(err=>{
            console.log(err)
            setShowLoading(false)
            toast.error(err.message)

        })
    },[props.data])
    const handleOpenViweAttendanceList = (row) =>{
        console.log(row)
        setAttendanceData(row)
        setViewAttendanceListDialog(true)
    }
    const handleCloseViweAttendanceList = () =>{
        setViewAttendanceListDialog(false)
    }
    const handleUpdateOnDelete = (id) =>{
        var data2 = {
            training_details_id:props.data.training_details_id
        }
        getAllAttendance(data2)
        .then(res=>{
            setData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    // const printButtonRef = useRef();
    // const handlePrint = (row)=>{
    //     setPrintData(JSON.parse(row.emp_info))
    //     // if (printButtonRef.current !== null) {
    //     // }
    // }
    // useEffect(()=>{
    //     if(printData.length !==0){
    //         if (printButtonRef.current !== null) {
    //             printButtonRef.current.click();
    //         }
    //     }
        
    // },[printData])
    const sortPrintData = (row) =>{
        var temp = JSON.parse(row.emp_info)
        temp.sort((a,b) => (a.lname > b.lname) ? 1 : ((b.lname > a.lname) ? -1 : 0))
        return temp;
    }
    const handleDeleteAttendance = (row)=>{
        Swal.fire({
            icon:'warning',
            title: 'Do you want to delete this attendance?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
            }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Deleting attendance',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2 = {
                    training_details_id:row.training_details_id,
                    date:row.date,
                    period:row.period
                }
                deleteSpecificDatePeriodAttendance(data2)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        setData(res.data.data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    Swal.close();
                    console.log(err)
                })
            } 
        })
        
    }
    return(
        <>
        {  
            showLoading
            ?
                // <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                // <DataTableLoader/>
                // </Box>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={showLoading}
                >
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <CircularProgress color="inherit" />
                        <Typography>Loading attendance data. Please wait...</Typography>
                    </Box>

                </Backdrop>
            :
                data.length === 0
                ?
                <Box>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                        <Typography>No data</Typography>
                    </Box>
                </Box>
                :
                <Fade in>
                <Box>
                    <Box className='flex-row-flex-end' sx={{mb:1}}>
                    <ExcelFile filename={'Attendance for '+props.data.training_name+' '+props.data.period_from+' to '+props.data.period_to} element={<Tooltip title='Download All Attendance'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}}><DownloadIcon/></IconButton></Tooltip>}>
                        {
                            data.map((row,key)=>
                                <ExcelSheet data={()=>sortPrintData(row)} name={moment(row.date,'YYYY-MM-DD').format('MMMM DD, YYYY')+' '+row.period} key={key}>
                                    <ExcelColumn label="First Name" value={(col)=>col.lname+', '+col.fname}/>
                                    <ExcelColumn label="Department" value="dept_name"/>
                                    <ExcelColumn label="Position" value="position_name"/>
                                </ExcelSheet>
                            )
                        }
                        
                    </ExcelFile>
                    
                    </Box>
                    <Paper>
                        
                        <TableContainer>
                                
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Date</StyledTableCell>
                                        <StyledTableCell>Period</StyledTableCell>
                                        <StyledTableCell align='center'>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((row,key)=>
                                            <TableRow key={key} hover>
                                                <StyledTableCell>{moment(row.date,'YYYY-MM-DD').format('MMMM DD, YYYY')}</StyledTableCell>
                                                <StyledTableCell>{row.period}</StyledTableCell>
                                                <StyledTableCell  align='center'>
                                                    <Tooltip title='Delete this attendance'><IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDeleteAttendance(row)}><DeleteIcon/></IconButton></Tooltip>
                                                    &nbsp;
                                                    {/* <Tooltip title='Update Attendance'><IconButton color='success' className='custom-iconbutton'><EditOutlinedIcon/></IconButton></Tooltip>
                                                    &nbsp; */}
                                                    <ExcelFile filename={'Attendance ' + row.date+' '+row.period} element={<Tooltip title='Download Attendance List'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}}><DownloadIcon/></IconButton></Tooltip>}>
                                                        <ExcelSheet data={()=>sortPrintData(row)} name='Participants'>
                                                            <ExcelColumn label="First Name" value={(col)=>col.lname+', '+col.fname}/>
                                                            <ExcelColumn label="Department" value="dept_name"/>
                                                            <ExcelColumn label="Position" value="position_name"/>
                                                        </ExcelSheet>
                                                    </ExcelFile>
                                                    &nbsp;
                                                    <Tooltip title='View Attendance List'><IconButton color='info' onClick={()=>handleOpenViweAttendanceList(row)} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[500]}}}><ListOutlinedIcon/></IconButton></Tooltip>
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Dialog
                            fullScreen
                            open={viewAttendanceListDialog}
                            // sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}

                            // onClose={handleCloseDialog}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'sticky',top:0 }}>
                            <Toolbar>
                                {
                                    matches
                                    ?
                                    null
                                    :
                                    <ListOutlinedIcon/>

                                }
                                <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component="div">
                                Viewing Attendance List
                                </Typography>
                                <Button autoFocus color="inherit" onClick={handleCloseViweAttendanceList}>
                                close
                                </Button>
                            </Toolbar>
                            </AppBar>
                            <Box sx={{m:2}}>
                                <ViewAttendanceList data = {attendanceData} handleUpdateOnDelete = {handleUpdateOnDelete} trainingDetails = {props.data} setData ={setData}/>
                            </Box>

                        </Dialog>
                    </Paper>
                </Box>

            </Fade>
        }
        </>
        
    )
}