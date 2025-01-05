import React,{useState,useEffect} from 'react';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box,Stack,Skeleton,Grid,Typography,Paper,Autocomplete,TextField,Button,Select,FormControl,InputLabel,MenuItem,TableContainer,Table,TableRow,TableHead,TableBody,Checkbox,IconButton,Dialog,Tooltip} from '@mui/material'
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {toast} from 'react-toastify'
import { getAllTrainingDetails } from './TrainingAttendanceRequest';
import moment from 'moment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue} from '@mui/material/colors';
//Icons
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import Slide from '@mui/material/Slide';
import AddAttendance from './Dialog/AddAttendance';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageAttendance from './Dialog/ManageAttendance';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AttendanceSummary from './Dialog/AttendanceSummary';
import Swal from 'sweetalert2';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import SmallModal from '../../custommodal/SmallModal';
import UnAttendedModal from './Modal/UnAttendedModal';
import DashboardLoading from '../../loader/DashboardLoading';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function TrainingAttendance(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [isLoadingData,setIsLoadingData] = useState(true)
    const [trainingData,setTrainingData] = useState([])
    const [selectedTraining,setSelectedTraining] = useState(null)
    const [addAttendanceDialog,setAddAttendanceDialog] = useState(false)
    const [manageAttendanceDialog,setManageAttendanceDialog] = useState(false)
    const [attendanceSummaryDialog,setAttendanceSummaryDialog] =useState(false)
    const [selectedAttendanceSummary,setSelectedAttendanceSummary] = useState([])
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
    const ResponsiveTheme = createTheme({
        components: {
            MuiIconButton: {
                defaultProps: {
                    size: matches?'small':'auto',
                },
            },
            MuiTypography:{
                defaultProps: {
                    fontSize: matches?'.9rem':'auto',
                },
            }
        }
    })
    useEffect(()=>{
        checkPermission(40)
        .then((response)=>{
            if(response.data){
                setIsLoading(false)
                getAllTrainingDetails()
                .then(res=>{
                    setTrainingData(res.data)
                    setIsLoadingData(false)
                }).catch(err=>{
                    console.log(err)
                })
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
      
    },[])
    
    const handleAddAttendance =(row)=>{
        setSelectedTraining(row)
        setAddAttendanceDialog(true)
    }
    const handleCloseAddAttendance = ()=>{
        setAddAttendanceDialog(false)
    }
    const handleManageAttendance =(row)=>{
        setSelectedTraining(row)
        setManageAttendanceDialog(true)
    }
    const handleCloseManagAttendance = ()=>{
        setManageAttendanceDialog(false)
    }
    const handleGetAttendanceSummary = (row)=>{
       
    }
    const handleOpenAttendanceSummary = (row)=>{
        setSelectedAttendanceSummary(row)
        setAttendanceSummaryDialog(true)
    }
    const handleCloseAttendanceSummary = ()=>{
        setAttendanceSummaryDialog(false)
    }
    const handleReload = () =>{
        Swal.fire({
            icon:'info',
            title:'Reloading Data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        getAllTrainingDetails()
        .then(res=>{
            Swal.close();
            setTrainingData(res.data)
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    const [openNotAttendingParticipantsModal,setOpenNotAttendingParticipantsModal] = useState(false)
    const [trainingDetailsID,setTrainingDetailsID] = useState()
    const handleOpenNotAttendingParticipantsModal = (row) => {
        setTrainingDetailsID(row.training_details_id)
        setOpenNotAttendingParticipantsModal(true)
    }
    const handleCloseNotAttendingParticipantsModal = () => {
        setOpenNotAttendingParticipantsModal(false)
    }
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{margin:'0 10px 10px 10px'}}>
            <DashboardLoading actionButtons={1}/>
            </Box>
            :
            <ThemeProvider theme={ResponsiveTheme}>
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Training Attendance
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Training Attendance'/>
                    </Grid>
                    <br/>
                    <Grid item xs={12} className='flex-row-flex-end' sx={{mb:1}}>
                        <Tooltip title='Reload Data'><IconButton color='primary' className='custom-iconbutton' onClick={handleReload}><ReplayIcon/></IconButton></Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                    <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Training Name</StyledTableCell>
                                    <StyledTableCell>Training Venue</StyledTableCell>
                                    <StyledTableCell>From</StyledTableCell>
                                    <StyledTableCell>To</StyledTableCell>
                                    <StyledTableCell align='center'>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    isLoadingData
                                    ?
                                    <React.Fragment>
                                    <TableRow>
                                        <StyledTableCell colSpan={5} align='center'>
                                            <Skeleton variant='rounded' height={40} animation='wave' />
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell colSpan={5} align='center'>
                                            <Skeleton variant='rounded' height={40} animation='wave' />
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell colSpan={5} align='center'>
                                            <Skeleton variant='rounded' height={40} animation='wave' />
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell colSpan={5} align='center'>
                                            <Skeleton variant='rounded' height={40} animation='wave' />
                                        </StyledTableCell>
                                    </TableRow>
                                    </React.Fragment>
                                    :
                                    trainingData.length ===0
                                    ?
                                    <TableRow>
                                        <StyledTableCell colSpan={4} align='center'>
                                            No Data
                                        </StyledTableCell>
                                    </TableRow>
                                    :
                                    trainingData.map((row,key)=>
                                        <TableRow key={key} hover>
                                            <StyledTableCell>{row.training_name}</StyledTableCell>
                                            <StyledTableCell>{row.venue}</StyledTableCell>
                                            <StyledTableCell>{moment(row.period_from).format('MMMM DD,YYYY')}</StyledTableCell>
                                            <StyledTableCell>{moment(row.period_to).format('MMMM DD,YYYY')}</StyledTableCell>
                                            <StyledTableCell align='center'>
                                            <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                            {
                                               moment(row.period_to).diff(new Date(), 'days') < -5
                                                ?
                                                <Tooltip title = 'Unavailable'><span><IconButton className='custom-iconbutton' color='primary' disabled><GroupAddOutlinedIcon/></IconButton></span></Tooltip>
                                                :
                                                <Tooltip title = 'Add Attendance'><span><IconButton onClick={()=>handleAddAttendance(row)} className='custom-iconbutton' color='primary' disabled = {moment(new Date()).format('YYYY-MM-DD')< moment(row.period_from).format('YYYY-MM-DD') ? true:false}><GroupAddOutlinedIcon/></IconButton></span></Tooltip>
                                            }
                                            <Tooltip title = 'Manage Attendance' ><IconButton onClick={()=>handleManageAttendance(row)} color='success' className='custom-iconbutton' disabled = {moment(new Date()).format('YYYY-MM-DD')< moment(row.period_from).format('YYYY-MM-DD') ? true:false}><ManageAccountsOutlinedIcon/></IconButton></Tooltip>

                                            <Tooltip title = 'Attendance Summary'><IconButton onClick={()=>handleOpenAttendanceSummary(row)} className='custom-iconbutton' sx={{color:orange[800]}} disabled = {moment(new Date()).format('YYYY-MM-DD')< moment(row.period_from).format('YYYY-MM-DD') ? true:false}><AssessmentOutlinedIcon/></IconButton></Tooltip>
                                            
                                            <Tooltip title='View not attending participants'><IconButton className='custom-iconbutton' onClick={()=>handleOpenNotAttendingParticipantsModal(row)}><PersonOffIcon/></IconButton></Tooltip>
                                            </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Paper>
                    </Grid>
                </Grid>
                <Dialog
                    fullScreen
                    open={addAttendanceDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <GroupAddOutlinedIcon/>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Adding Attendance
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseAddAttendance}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <AddAttendance data = {selectedTraining}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={manageAttendanceDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <ManageAccountsOutlinedIcon/>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Manage Attendance
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseManagAttendance}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <ManageAttendance data = {selectedTraining}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={attendanceSummaryDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <ManageAccountsOutlinedIcon/>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Attendance Summary
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseAttendanceSummary}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <AttendanceSummary data = {selectedAttendanceSummary}/>
                    </Box>

                </Dialog>
                <SmallModal open = {openNotAttendingParticipantsModal} close = {handleCloseNotAttendingParticipantsModal} title='List of not attending trainee'>
                    <UnAttendedModal id = {trainingDetailsID}/>
                </SmallModal>
            </Box>
            </ThemeProvider>
        }
        </>
    )
}