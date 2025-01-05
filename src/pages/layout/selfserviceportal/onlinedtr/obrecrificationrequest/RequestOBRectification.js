import React,{useEffect, useState} from 'react';
import { Grid,Box,Skeleton,Paper,Fade,Typography,Button, TextField,Autocomplete,FormGroup,FormControlLabel,Checkbox,Tooltip, breadcrumbsClasses,Dialog ,AppBar,Toolbar,IconButton,Slide,TableContainer,Table,TableHead,TableRow,TableBody,TableCell} from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { blue, green, red, yellow } from '@mui/material/colors';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getOffices, getOfficeEmployee, getEmployeeSchedule, postOBRectification, postOBScheduleAPI,updateOBInserted, cancelOBRectificationRequest } from '../DTRRequest';
import { ThemeProvider , createTheme } from '@mui/material/styles';
import moment from 'moment';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Swal from 'sweetalert2';
import { checkPermission } from '../../../permissionrequest/permissionRequest';
import {useNavigate}from "react-router-dom";
import { toast } from 'react-toastify';
import { getDTREmplist, getRequestedOBRectification } from './Request';
import DashboardLoading from '../../../loader/DashboardLoading';
import CloseIcon from '@mui/icons-material/Close';
import ModuleHeaderText from '../../../moduleheadertext/ModuleHeaderText';
import AddIcon from '@mui/icons-material/Add';
import RequestOB from './Dialog/RequestOB';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DeleteIcon from '@mui/icons-material/Delete';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import PaginationOutlined from '../../../custompagination/PaginationOutlined';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CUSTOMTHEME = createTheme({
    typography: {
        allVariants:{
            // fontSize: '.9rem',
            color:blue[800]
        }
    }
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
export default function RequestOBRectification(){
    const navigate = useNavigate()
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [isLoading,setIsLoading] = useState(true);
    const [openDialog,setOpenDialog] = useState(false);
    const [pendingData,setPendingData] = useState([]);
    const [historyData,setHistoryData] = useState([]);
    useEffect(()=>{
        checkPermission(59)
        .then(res=>{
            if(res.data){
                return getRequestedOBRectification()
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).then(res=>{
            setPendingData(res.data.pending)
            setHistoryData(res.data.history)
            setIsLoading(false)
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])


    const handleCloseDialog = ()=>{
        setOpenDialog(false)
    }
    const formatDaysDetails = (row)=>{
        var t_data = JSON.parse(row);
        return(
            
            t_data.map((row,key)=>
            <Box key={key}>
                <span><strong>{moment(row.date).format('MMMM DD, YYYY')}</strong></span>
                <Box>
                    {row.time_in && <li>
                    <small>
                    {moment(moment(new Date()).format('YYYY-MM-DD ')+row.time_in).format('hh:mm a')} - {row.remarks}
                    </small>
                    </li>}
                    
                    {row.break_out && <li>
                    <small>
                    {moment(moment(new Date()).format('YYYY-MM-DD ')+row.break_out).format('hh:mm a')} - {row.remarks}
                    </small>
                    </li>}

                    {row.break_in && <li>
                    <small>
                    {moment(moment(new Date()).format('YYYY-MM-DD ')+row.break_in).format('hh:mm a')} - {row.remarks}
                    </small>
                    </li>}

                    {row.time_out && <li>
                    <small>
                    {moment(moment(new Date()).format('YYYY-MM-DD ')+row.time_out).format('hh:mm a')} - {row.remarks}
                    </small>
                    </li>}
                </Box>
                {/* <Tooltip title={<Box>
                {row.time_in && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.time_in).format('hh:mm a')} - {row.remarks}</li>}
                
                {row.break_out && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.break_out).format('hh:mm a')} - {row.remarks}</li>}

                {row.break_in && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.break_in).format('hh:mm a')} - {row.remarks}</li>}

                {row.time_out && <li>{moment(moment(new Date()).format('YYYY-MM-DD ')+row.time_out).format('hh:mm a')} - {row.remarks}</li>}</Box>}><IconButton size='small' color='primary'><InfoOutlinedIcon/></IconButton></Tooltip> */}
                
            </Box>
            
            )

        )
    }
    const handleRefreshData = async()=>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...',
            showConfirmButton:false
        })
        Swal.showLoading()
        await getRequestedOBRectification()
        .then(res=>{
            setPendingData(res.data.pending)
            setHistoryData(res.data.history)
            setHistoryPage(1)
            Swal.close()
        }).catch(err=>{
            console.log(err)
            Swal.close()

        })
    }
    const handleViewFile = (id)=>{
        viewFileAPI(id)
    }
    const handleCancelRequest = (id)=>{
        console.log(id)
        Swal.fire({
            icon:'warning',
            title:'Confirm cancel request ?',
            showCancelButton:true,
            confirmButtonText:'Yes',
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Cancelling request',
                    html:'Please wait...'
                })
                Swal.showLoading()
                var t_data = {
                    id:id
                }
                cancelOBRectificationRequest(t_data)
                .then(res=>{
                    if(res.data.status===200){
                        setPendingData(res.data.data.pending)
                        setHistoryData(res.data.data.history)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showCancelButton:false
                        })
                    }else{
                        setPendingData(res.data.data.pending)
                        setHistoryData(res.data.data.history)
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                    Swal.fire({
                        icon:'error',
                        title:err
                    })
                })
            }
        })
    }
    const [historyPage,setHistoryPage] = useState(1);
    const changeHistoryPage = (e,value)=>{
        setHistoryPage(value)
    }
    return (
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading actionButtons={2}/>
                :
                <Fade in>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title ='Request OB Rectification'/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Tooltip title='Request OB rectification' onClick={()=>setOpenDialog(true)}><IconButton className='custom-iconbutton' color='success'><AddIcon/></IconButton></Tooltip>
                        &nbsp;
                        <Tooltip title='Reload data' onClick={()=>handleRefreshData()}><IconButton className='custom-iconbutton' color='primary'><RefreshIcon/></IconButton></Tooltip>
                    </Grid>
                    <Grid item xs={12} sx={{mt:1}}>
                        <Typography sx={{p:1,background:blue[900],color:'#fff'}}>Pending Request</Typography>

                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Employee Name
                                            </TableCell>
                                            <TableCell>
                                                Details
                                            </TableCell>
                                            <TableCell>
                                                Remarks
                                            </TableCell>
                                            <TableCell>
                                                Status
                                            </TableCell>
                                            <TableCell  align='center'>
                                                Action
                                            </TableCell>
                                            </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            pendingData.length>0
                                            ?
                                            pendingData.map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDaysDetails(row.days_details)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.ob_oft_remarks}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.status}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                        {
                                                            JSON.parse(row.file_id).map((row2,key2)=>
                                                                <Tooltip key={key2} title='View file attachment'><IconButton color='primary' className='custom-iconbutton' onClick={()=>handleViewFile(row2)}><AttachmentIcon/></IconButton></Tooltip>
                                                            )
                                                        }
                                                        <Tooltip title='Cancel request'><IconButton color='error' className='custom-iconbutton' onClick={()=>handleCancelRequest(row.hris_ob_ot_id)}><DeleteIcon/></IconButton></Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            
                                            :
                                            <TableRow>
                                                <TableCell align='center' colSpan={4}>
                                                    No data as of the moment...
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sx={{mt:2}}>
                        <Typography sx={{p:1,background:blue[500],color:'#fff'}}>History</Typography>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Employee Name
                                            </TableCell>
                                            <TableCell>
                                                Details
                                            </TableCell>
                                            <TableCell>
                                                Status
                                            </TableCell>
                                            <TableCell>
                                                Remarks
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            historyData.length>0
                                            ?
                                            historyData.slice((historyPage-1) * 3,(historyPage-1) * 3 + 3).map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDaysDetails(row.days_details)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            row.status === 'DISAPPROVED'
                                                            ?
                                                            <span style={{color:'red'}}>{row.status}</span>
                                                            :
                                                            row.status === 'APPROVED'
                                                            ?
                                                            <span style={{color:'green'}}>{row.status}</span>
                                                            :
                                                            <span style={{color:'blue'}}>{row.status}</span>
                                                            
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.remarks}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            
                                            :
                                            <TableRow>
                                                <TableCell align='center' colSpan={4}>
                                                    No data as of the moment...
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <Box sx={{mt:1,display:'flex',justifyContent:'flex-end'}}>
                            <PaginationOutlined count={Math.floor((historyData.length)%3==0?(historyData.length)/3:((historyData.length)/3)+1)} color='primary' page={historyPage} onChange = {changeHistoryPage}/>
                        </Box>

                    </Grid>
                <Dialog
                    fullScreen
                    open={openDialog}
                    onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Adding OB / OFT Rectification
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                        Close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <RequestOB setPendingData = {setPendingData}/>

                </Dialog>
                
                </Grid>
                </Fade>
            }
        </Box>
        
    )
}