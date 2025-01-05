import { Box,Fade,Stack,Skeleton,Typography,Grid,Paper,Button, Tooltip,IconButton,Modal,TextField,Badge  } from '@mui/material';
import React,{useEffect, useState} from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    useNavigate
} from "react-router-dom";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { getAllApprovedLeave, recallLeaveApplication, recallLeaveApplicationAPI } from './LeaveApplicationRequest';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import {blue,red,yellow,green} from '@mui/material/colors'
import Swal from 'sweetalert2';
import { auditLogs } from '../../auditlogs/Request';
import CancelledApplication from './Table/CancelledApplication';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import CancelLeaveHoliday from './Dialog/CancelLeaveHoliday';
import { api_url } from '../../../../request/APIRequestURL';
import moment from 'moment';
import MultipleDatesRecall from './Dialog/MultipleDatesRecall';
import RequestedCancellation from './Modal/RequestedCancellation';
import RequestedRescheduleModal from './Modal/RequestedRescheduleModal';
import SmallModal from '../.././custommodal/SmallModal';
import MediumModal from '../../custommodal/MediumModal';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Transition2 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
export default function LeaveApplicationRecall(){
    const navigate = useNavigate()
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    const [historyData,setHistoryData] = useState([])
    const [requestedRescheduleData,setRequestedRescheduleData] = useState([])
    const [requestedCancellationData,setRequestedCancellationData] = useState([])
    useEffect(()=>{
        var logs = {
            action:'ACCESS ONLINE LEAVE RECALL',
            action_dtl:'ACCESS ONLINE LEAVE RECALL MODULE',
            module:'ONLINE LEAVE RECALL'
        }
        auditLogs(logs)
        checkPermission(28)
        .then((response)=>{
            // console.log(response.data)
            if(response.data){
                setIsLoading(false)
                getAllApprovedLeave()
                .then(res=>{
                    console.log(res.data)
                    setData(res.data.approved)
                    setHistoryData(res.data.cancelled)
                    setRequestedCancellationData(res.data.requested)
                    setRequestedRescheduleData(res.data.reschedule)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
            setIsLoading(false)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const columns = [
        {
            name:'Employee Name',
            selector:row=>row.fullname
        },
        {
            name:'Leave Name',
            selector:row=>row.leave_type_name
        },
        {
            name:'Inclusive Dates',
            selector:row=>row.inclusive_dates_text
        },
        {
            name:'Days Applied',
            selector:row=>row.days_hours_applied
        },
        {
            name:'Cancelled details',
            selector:row=>formatCancelDtl(row)
        },
        {
            name:'Action',
            selector:row=>
            <Box sx={{padding:'12px'}}>
            <Tooltip title='Recall Leave Application'>
                <IconButton className='custom-iconbutton' color='error' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>recallAction(row)}><RotateLeftOutlinedIcon/></IconButton></Tooltip>
            </Box>
        }
        
    ];
    const formatCancelDtl = (data)=>{
        var dtl = JSON.parse(data.cancel_details)
        if(dtl.length >0){
            return (
            <ul>
                {
                    dtl.map((row,key)=>
                    <li key = {key}>{moment(row.date).format('MMMM DD,YYYY')} - <span style={{color:'red'}}>{row.reason}</span></li>
                    )
                }
            </ul>
        )
        }else{
            return 'N/A'

        }
    }
    const [selectedLeaveApplication,setSelectedLeaveApplication] = useState([])
    const [openRecallModal,setOpenRecallModal] = useState(false);
    const [selectedApplication,setSelectedApplication] = useState([])
    const recallAction = (row) => {
        console.log(row)
        setSelectedLeaveApplication(row)

        /**
        Check number days of inclusive dates
         */
        var t_inc_dates = JSON.parse(row.inclusive_dates);
        var t_cancelled_dates = JSON.parse(row.cancel_details);
        var temp = [];
        if(t_inc_dates.length >1){
            t_inc_dates.forEach(el=>{
                var index = t_cancelled_dates.map(function(e) { return e.date; }).indexOf(el.date);
                if(index > -1){
                    // t_inc_dates.splice(index,1)
                    // console.log(el.date)
                }else{
                    temp.push(el)
                }
            })
            // console.log(temp)
            if(temp.length>1){
                setOpenCancelApplication(true)
                setMultipleIncDates(temp);
            }else{
                if(temp.length === 0){
                    Swal.fire({
                        icon:'warning',
                        title:'Oops...',
                        text:'No available dates to recall'
                    })            
                }else{
                    setOpenRecallModal(true)
                }
                
                
            //     Swal.fire({
            //     icon:'info',
            //     title: 'Cancel leave application ?',
            //     html:'Reason for cancellation',
            //     input: 'text',
            //     inputAttributes: {
            //     autocapitalize: 'off'
            //     },
            //     showCancelButton: true,
            //     confirmButtonText: 'Submit',
            //     inputValidator: (value) => {
            //         if (!value) {
            //         return 'Please input reason !'
            //         }
            //     }
            // }).then((result) => {
            //     if (result.isConfirmed) {
            //         Swal.fire({
            //             icon:'info',
            //             title:'Cancelling leave application',
            //             html:'Please wait...',
            //             allowOutsideClick:false,
            //             allowEscapeKey:false
            //         })
            //         Swal.showLoading();
            //         var data2 = {
            //             emp_id:row.employee_id,
            //             leave_id:row.leave_application_id,
            //             leave_type_id:row.leave_type_id,
            //             dwp:row.days_with_pay,
            //             reason:result.value,
            //             type:1, // 0 - one inclusive dates on application, 1 - more than one inclusive dates on application
            //             api_url:api_url+'/cancelLeaveApplication',
            //             date:moment(t_inc_dates[0].date).format('YYYY-MM-DD')
            //         }
            //         console.log(data2)
            //         recallLeaveApplication(data2)
            //         .then(res=>{
            //             if(res.data.status === 200){
            //                 Swal.fire({
            //                     icon:'success',
            //                     title:res.data.message,
            //                     timer:1500,
            //                     showConfirmButton:false
            //                 })
            //                 console.log(res.data.cancelled)
            //                 setData(res.data.data.approved)
            //                 setHistoryData(res.data.data.cancelled)
            //                 // Swal.fire({
            //                 //     icon:'info',
            //                 //     title:'Cancelling leave application',
            //                 //     html:"Updating data to e-GAPS... Please don't close this page.",
            //                 //     allowOutsideClick:false,
            //                 //     allowEscapeKey:false
            //                 // })
            //                 // Swal.showLoading();
            //                 // var data3 ={
            //                 //     key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
            //                 //     ref_no:row.ref_no,
            //                 //     info:res.data.info,
            //                 //     dwp:row.days_with_pay,
            //                 //     leave_type_id:row.leave_type_id
            //                 // }
            //                 // recallLeaveApplicationAPI(data3)
            //                 // .then(res=>{
            //                 //     if(res.data.status === 200){
            //                 //         Swal.fire({
            //                 //             icon:'success',
            //                 //             title:res.data.message
            //                 //         })
            //                 //     }else{
            //                 //         Swal.fire({
            //                 //             icon:'error',
            //                 //             title:res.data.message
            //                 //         })
            //                 //     }
            //                 // }).catch(err=>{
            //                 //     Swal.close()
            //                 //     console.log(err)
            //                 // })
            //             }else{
            //                 Swal.fire({
            //                     icon:'error',
            //                     title:res.data.message
            //                 })
            //             }
            //         }).catch(err=>{
            //             Swal.close()
            //             console.log(err)
            //         })
            //     }
            // })
            }   
        }else{
            setOpenRecallModal(true)
        //     Swal.fire({
        //     icon:'info',
        //     title: 'Cancel leave application ?',
        //     html:'Reason for cancellation',
        //     input: 'text',
        //     inputAttributes: {
        //       autocapitalize: 'off'
        //     },
        //     showCancelButton: true,
        //     confirmButtonText: 'Submit',
        //     inputValidator: (value) => {
        //         if (!value) {
        //           return 'Please input reason !'
        //         }
        //       }
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //         Swal.fire({
        //             icon:'info',
        //             title:'Cancelling leave application',
        //             html:'Please wait...',
        //             allowOutsideClick:false,
        //             allowEscapeKey:false
        //         })
        //         Swal.showLoading();
        //         var data2 = {
        //             emp_id:row.employee_id,
        //             leave_id:row.leave_application_id,
        //             leave_type_id:row.leave_type_id,
        //             dwp:row.days_with_pay,
        //             reason:result.value,
        //             type:0 // 0 - one inclusive dates on application, 1 - more than one nclusive dates on application

        //         }
        //         console.log(data2)
        //         recallLeaveApplication(data2)
        //         .then(res=>{
        //             if(res.data.status === 200){
        //                 setData(res.data.data.approved)
        //                 setHistoryData(res.data.data.cancelled)
        //                 Swal.fire({
        //                     icon:'info',
        //                     title:'Cancelling leave application',
        //                     html:"Updating data to e-GAPS... Please don't close this page.",
        //                     allowOutsideClick:false,
        //                     allowEscapeKey:false
        //                 })
        //                 Swal.showLoading();
        //                 var data3 ={
        //                     key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
        //                     ref_no:row.ref_no,
        //                     info:res.data.info,
        //                     dwp:row.days_with_pay,
        //                     dwopay:row.days_without_pay,
        //                     leave_type_id:row.leave_type_id,
        //                     date:row.inclusive_dates_text,
        //                     leave_name:row.leave_type_name
        //                 }
        //                 recallLeaveApplicationAPI(data3)
        //                 .then(res=>{
        //                     if(res.data.status === 200){
        //                         Swal.fire({
        //                             icon:'success',
        //                             title:res.data.message
        //                         })
        //                     }else{
        //                         Swal.fire({
        //                             icon:'error',
        //                             title:res.data.message
        //                         })
        //                     }
        //                 }).catch(err=>{
        //                     Swal.close()
        //                     console.log(err)
        //                 })
        //             }else{
        //                 Swal.fire({
        //                     icon:'error',
        //                     title:res.data.message
        //                 })
        //             }
        //         }).catch(err=>{
        //             Swal.close()
        //             console.log(err)
        //         })
        //     }
        //   })
        }
        
        
    }
    const tableData = {
        columns,
        data,
      };
    const reloadData = () =>{
        var logs = {
            action:'RELOAD ONLINE LEAVE RECALL',
            action_dtl:'RELOAD ONLINE LEAVE RECALL DATA',
            module:'ONLINE LEAVE RECALL'
        }
        auditLogs(logs)
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false,
            showConfirmButton:false
        })
        Swal.showLoading()
        getAllApprovedLeave()
        .then(res=>{
            setData(res.data.approved)
            setHistoryData(res.data.cancelled)
            Swal.close();

        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [multipleIncDates,setMultipleIncDates] = useState([])
    const [openCancelApplication,setOpenCancelApplication] = useState(false)
    const handleCloseCancelApplication = ()=>{
        setOpenCancelApplication(false)
    }
    const [openRequestedCancellation,setOpenRequestedCancellation] = useState(false)
    const [openRequestedReschedule,setOpenRequestedReschedule] = useState(false)
    const styleRequestedCancellation = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':600,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:'5px',
        p: 2,
    };
    const styleRequestedReschedule = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':600,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:'5px',
        p: 2,
    };
    const handleOpenRequestedCancellation = () =>{
        setOpenRequestedCancellation(true)
    }
    const handleCloseRequestedCancellation = () =>{
        setOpenRequestedCancellation(false)
    }
    const handleOpenRequestedReschedule = () =>{
        setOpenRequestedReschedule(true)
    }
    const handleCloseRequestedReschedule = () =>{
        setOpenRequestedReschedule(false)
    }
    const handleUpdateReschedAction = (data) =>{
        setRequestedRescheduleData(data)
    }
    const [reason,setReason] = useState('');
    const [singleFile,setsingleFile] = React.useState('');
    
    const handleSingleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setsingleFile(fileReader.result)
            }
        }else{
            setsingleFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const handleSubmit = (e)=>{
        e.preventDefault();

        /**
        Check number days of inclusive dates
         */
        var t_inc_dates = JSON.parse(selectedLeaveApplication.inclusive_dates);
        var t_cancelled_dates = JSON.parse(selectedLeaveApplication.cancel_details);
        var temp = [];
        t_inc_dates.forEach(el=>{
            var index = t_cancelled_dates.map(function(e) { return e.date; }).indexOf(el.date);
            if(index > -1){
                // t_inc_dates.splice(index,1)
                // console.log(el.date)
            }else{
                temp.push(moment(el.date).format('YYYY-MM-DD'))
            }
        })
        Swal.fire({
            icon:'info',
            title:'Recalling leave application',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading();
        var data2 = {
            emp_id:selectedLeaveApplication.employee_id,
            leave_id:selectedLeaveApplication.leave_application_id,
            leave_type_id:selectedLeaveApplication.leave_type_id,
            dwp:selectedLeaveApplication.days_with_pay,
            reason:reason,
            date:temp,
            type:1, // 0 - one inclusive dates on application, 1 - more than one inclusive dates on application
            api_url:api_url+'/cancelLeaveApplication',
            file:singleFile
        }
        // console.log(data2)
        recallLeaveApplication(data2)
        .then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                console.log(res.data.cancelled)
                setData(res.data.data.approved)
                setHistoryData(res.data.data.cancelled)
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
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {isLoading
            ?
            <Stack spacing={2}>
                        <Skeleton variant="text" height={'70px'} animation="wave"/>
            </Stack>
            :
            <Fade in={!isLoading}>
                <Grid container>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:1}}>
                        
                        <Badge badgeContent={requestedRescheduleData.length} color="primary">
                            {/* <Tooltip title=' Leave reschedule requests'><IconButton color='primary' className='custom-iconbutton' onClick={handleOpenRequestedReschedule} sx={{'&:hover':{color:'#fff',background:blue[800]}}} size='large'><EditCalendarIcon/></IconButton></Tooltip> */}
                            <Tooltip title='Leave reschedule requests'>
                            <Button variant='contained' color='primary' className='custom-roundbutton' onClick={handleOpenRequestedReschedule} size='small' startIcon={<EditCalendarIcon/>}> Reschedule
                            </Button></Tooltip>
                        </Badge>
                        <Badge badgeContent={requestedCancellationData.length} color="primary">
                            {/* <Tooltip title=' Leave cancellation requests'><IconButton color='error' className='custom-iconbutton' onClick={handleOpenRequestedCancellation} sx={{'&:hover':{color:'#fff',background:red[600]}}} size='large'><EventBusyIcon/></IconButton></Tooltip> */}
                            <Tooltip title=' Leave cancellation requests'><Button variant='contained' color='error' className='custom-roundbutton' onClick={handleOpenRequestedCancellation} size='small' startIcon={<EventBusyIcon/>}>Cancellation</Button></Tooltip>
                        </Badge>
                        

                        <Tooltip title='Cancel leave by holiday'><IconButton color='error' className='custom-iconbutton' onClick={handleClickOpen } sx={{'&:hover':{color:'#fff',background:red[800]}}} ><CalendarMonthIcon/></IconButton></Tooltip>
                        <Tooltip title ='Reload data'><IconButton color='primary' className='custom-iconbutton' onClick={reloadData} sx={{'&:hover':{color:'#fff',background:blue[800]}}}><CachedOutlinedIcon/></IconButton></Tooltip>

                        <MediumModal open = {openRequestedReschedule} close = {handleCloseRequestedReschedule} title='List of the requested reschedule of leave'>
                            <RequestedRescheduleModal data = {requestedRescheduleData} handleUpdate = {handleUpdateReschedAction}/>
                        </MediumModal>
                        <MediumModal open = {openRequestedCancellation} close = {handleCloseRequestedCancellation} title='List of the requested cancellation of leave'>
                             <RequestedCancellation data= {requestedCancellationData} close={setRequestedCancellationData} updateData = {setRequestedCancellationData}/>
                        </MediumModal>
                    </Grid>
                    <Grid item xs={12}>
                        <DataTableExtensions
                             {...tableData}
                             export={false}
                             print={false}
                             filterPlaceholder='Filter Approved Table'
                        >
                        <DataTable
                            title ={<Typography sx={{background:green[800],color:'#fff',padding:'10px',borderTopRightRadius:'20px'}}>Approved Leave Application</Typography>}
                            data={data}
                            columns={columns}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                            pagination
                            highlightOnHover
                            
                        />
                        </DataTableExtensions>
                    </Grid>
                    <Grid item xs={12} sx={{m:2}}>
                    <hr/>
                    </Grid>
                    <Grid item xs={12}>
                        <CancelledApplication data = {historyData}/>
                    </Grid>
                    <Dialog
                        fullScreen
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Cancel leave application (Holiday)
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleClose}>
                            close
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <CancelLeaveHoliday/>
                    </Dialog>

                    <Dialog
                        fullScreen
                        sx={{width:matches?'100%':'40vw',height:'100%',right:0,left:'auto'}}
                        open={openCancelApplication}
                        onClose={handleCloseCancelApplication}
                        TransitionComponent={Transition2}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseCancelApplication}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Cancel leave application (multiple inclusive dates detected)
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleCloseCancelApplication}>
                            close
                            </Button>
                        </Toolbar>
                        </AppBar>
                            <MultipleDatesRecall dates = {multipleIncDates} row = {selectedLeaveApplication}/>

                    </Dialog>
                    <SmallModal open = {openRecallModal} close = {()=>setOpenRecallModal(false)} title='Recall Application'>
                        <Box sx={{m:1}}>
                            <form onSubmit={handleSubmit}>
                            {/* <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:1}}>
                                Please specify reason for cancellation
                            </Typography> */}
                            <TextField label='Reason' value = {reason} onChange={(val)=>setReason(val.target.value)} fullWidth required sx={{mb:2}}/>
                            
                            <TextField type = "file" label="Approved letter*" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'}}} required/>
                            
                            <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                                <Button color='success' variant='contained' className='custom-roundbutton' size='small' type='submit'>Submit</Button>
                                &nbsp;
                                <Button color='error' variant='contained' className='custom-roundbutton'  size='small' onClick={()=>setOpenRecallModal(false)}>Cancel</Button>
                            </Box>
                        </form>
                        </Box>
                    </SmallModal>
                </Grid>
            </Fade>
            }
        </Box>
    )
}