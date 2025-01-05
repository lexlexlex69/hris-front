import React,{useEffect, useRef, useState} from 'react';
import {Grid,Box,Stack,Skeleton,Typography,Fade,Table,TableHead,TableContainer,TableRow,TableBody,IconButton,Paper,Accordion,AccordionSummary,AccordionDetails,Badge,Tooltip,Dialog,Button,Modal} from '@mui/material';
import {blue,red,green,orange} from '@mui/material/colors';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    useNavigate
} from "react-router-dom";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deleteCTOApplication, getCOCEarnedInfo, getCTOLeaveDetails, getCurrentMonthCOC, getEmployeeInfo, getLeaveBalance, isBalanceUpdatedToday, updateCTOLeaveDetails } from './LeaveApplicationRequest';
import PendingIcon from '@mui/icons-material/Pending';
import Swal from 'sweetalert2';
import moment from 'moment';
//icons
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AddCTO from './Dialog/AddCTO';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import PrintIcon from '@mui/icons-material/Print';
import PreviewCTOApplicationForm2 from './PreviewCTOApplicationForm2';
import ReactToPrint,{useReactToPrint} from 'react-to-print';

import $ from 'jquery'
import { DeleteOutline } from '@mui/icons-material';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import SmallModal from '../../custommodal/SmallModal';
import { toast } from 'react-toastify';
import LargeModal from '../../custommodal/LargeModal';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 13,
        padding:10,
        // fontFamily:'latoreg'
      
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding:13,
        // fontFamily:'latoreg'
    
    },
  }));
const headerTheme = createTheme({
  typography: {
    fontSize:14,
    fontFamily:'latoreg'
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

export default function CTO(){
    // navigate
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 816,
        bgcolor: 'background.paper',
        border: '2px solid #ff',
        boxShadow: 24,
        borderRadius:1,
        p: 2,
    };

    const [isLoading,setIsLoading] = useState(true);
    const [balance,setBalance] = useState();
    const [COCUsed,setCOCUsed] = useState();
    const [onProcess,setOnProcess] = useState();
    const [pendingData,setPendingData] = useState();
    const [historyData,setHistoryData] = useState();
    const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
    const [totalForReview,setTotalForReview] = useState(0);
    const [empInfo,setEmpInfo] = useState([]);
    const [alreadyAppliedDays,setAlreadyAppliedDays] = React.useState([]);
    const [alreadyAppliedDaysPeriod,setAlreadyAppliedDaysPeriod] = React.useState([]);
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?13:15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?11:13,
        },
    }));
    useEffect(()=>{
        checkPermission(2)
        .then((response)=>{
            if(response.data === 1){
                isBalanceUpdatedToday()
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status){
                        getCTOLeaveDetails()
                        .then(res=>{
                            setBalance(res.data.coc[0].coc_bal)
                            setCOCUsed(res.data.coc.coc_used)
                            var temp = 0;
                            res.data.pending.forEach(el => {
                                if(el.status=== 'FOR REVIEW' || el.status=== 'FOR UPDATING'){
                                    temp+=el.days_hours_applied
                                }
                            });
                            console.log(res.data)
                            setTotalForReview(temp)
                            setPendingData(res.data.pending)
                            setHistoryData(res.data.history)
                            setOnProcess(res.data.pending_hrs_applied)
                            setAlreadyAppliedDays(res.data.applied_dates)
                            setAlreadyAppliedDaysPeriod(res.data.dates_has_period)
                            getEmployeeInfo()
                            .then(res=>{
                                setEmpInfo(res.data)
                                setIsLoading(false)

                            })
                        }).catch(err=>{
                            console.log(err)
                        })
                       
                        
                    }else{
                        Swal.fire({
                            icon:'info',
                            title:'Updating Current Leave Balance',
                            html:'Please wait...',
                            allowEscapeKey:false,
                            allowOutsideClick:false
                        })
                        Swal.showLoading()
                        var id_no = {
                            id:res.data.id_no
                        }
                        updateCTOLeaveDetails(id_no)
                        .then(res2=>{
                            Swal.close();
                            console.log(res2.data)
                            setBalance(res2.data.coc.coc_bal)
                            setCOCUsed(res2.data.coc.coc_used)
                            setPendingData(res2.data.pending)
                            setHistoryData(res2.data.history)
                            setOnProcess(res2.data.pending_hrs_applied)
                            setAlreadyAppliedDays(res.data.applied_dates)
                            setAlreadyAppliedDaysPeriod(res.data.dates_has_period)
                            getEmployeeInfo()
                            .then(res=>{
                                setEmpInfo(res.data)
                                setIsLoading(false)

                            })
                        }).catch(err=>{
                            Swal.close();
                            console.log(err)
                        })
                       
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch()
    },[])
    
    const [accordionCB,setAccordionCB] = useState(true)
    const [accordionPending,setAccordionPending] = useState(false)
    const [accordionHistory,setAccordionHistory] = useState(false)
    const handleUpdateData = () =>{
        getCTOLeaveDetails()
        .then(res=>{
            var temp = 0;
            res.data.pending.forEach(el => {
                if(el.status=== 'FOR REVIEW'){
                    temp+=el.days_hours_applied
                }
            });
            setTotalForReview(temp)
            setBalance(res.data.coc[0].coc_bal)
            setCOCUsed(res.data.coc.coc_used)
            setPendingData(res.data.pending)
            setHistoryData(res.data.history)
            setOnProcess(res.data.pending_hrs_applied)
            setOpenApplicationDialog(false)
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleReloadCTO = () =>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading();
        getCTOLeaveDetails()
        .then(res=>{
            var temp = 0;
            res.data.pending.forEach(el => {
                if(el.status=== 'FOR REVIEW'){
                    temp+=el.days_hours_applied
                }
            });
            console.log(res.data)
            setTotalForReview(temp)
            setBalance(res.data.coc[0].coc_bal)
            setCOCUsed(res.data.coc.coc_used)
            setPendingData(res.data.pending)
            setHistoryData(res.data.history)
            setOnProcess(res.data.pending_hrs_applied)
            setOpenApplicationDialog(false)
            setAlreadyAppliedDays(res.data.applied_dates)
            setAlreadyAppliedDaysPeriod(res.data.dates_has_period)
            Swal.close();
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    useEffect(()=>{
        if(accordionPending){
            $('html, body').animate({
                scrollTop: $("#pending-header").offset().top
            }, 500);
        }
    },[accordionPending])
    useEffect(()=>{
        if(accordionHistory){
            $('html, body').animate({
                scrollTop: $("#history-header").offset().top
            }, 500);
        }
    },[accordionHistory])
    const handleAddCTO = ()=>{
        // var temp_bal = balance-onProcess>0?balance-onProcess:0
        if(parseInt(balance)-parseInt(totalForReview)<4){
            Swal.fire({
                icon:'warning',
                title:'Notice !',
                html:'Available balance must equal or greater than to 4 hours. Please earned COC first.'
            })
        }else{
            setOpenApplicationDialog(true)
        }
    }
    const handleDeleteCTO = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'warning',
            title: 'Do you want to cancel this application?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
            }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Cancelling application',
                    html:'Please wait...'
                })
                Swal.showLoading();
                var data2 = {
                    id:row.leave_application_id,
                    employee_id:row.employee_id
                }
                deleteCTOApplication(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        console.log(res.data)
                        var temp = 0;
                        res.data.data.pending.forEach(el => {
                            if(el.status=== 'FOR REVIEW'){
                                temp+=el.days_hours_applied
                            }
                        });
                        setTotalForReview(temp)
                        setBalance(res.data.data.coc[0].coc_bal)
                        setCOCUsed(res.data.data.coc.coc_used)
                        setPendingData(res.data.data.pending)
                        setHistoryData(res.data.data.history)
                        setOnProcess(res.data.data.pending_hrs_applied)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        var temp = 0;
                        res.data.data.pending.forEach(el => {
                            if(el.status=== 'FOR REVIEW'){
                                temp+=el.days_hours_applied
                            }
                        });
                        setTotalForReview(temp)
                        setBalance(res.data.data.coc[0].coc_bal)
                        setCOCUsed(res.data.data.coc.coc_used)
                        setPendingData(res.data.data.pending)
                        setHistoryData(res.data.data.history)
                        setOnProcess(res.data.data.pending_hrs_applied)
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
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [selectedPreview,setSelectedPreview] = useState([])
    const [selectedPrint,setSelectedPrint] = useState([])
    const handlePreview = (row)=>{
        console.log(row)
        setSelectedPreview(row)
        handleOpen()
    }
    const printRef = useRef('');
    const [printCount,setPrintCount] = useState(0);
    const handlePrintApplication = (row)=>{
        setSelectedPrint(row)
        setPrintCount(printCount+1)
    }
    useEffect(()=>{
        if(printCount>0){
            reactToPrint()
        }   
    },[printCount])
    const reactToPrint  = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Leave Application '

    });
    const [openCOCInfo, setOpenCOCInfo] = React.useState(false);
    const handleOpenCOCInfo = () => setOpenCOCInfo(true);
    const handleCloseCOCInfo = () => setOpenCOCInfo(false);
    const [COCearnedInfoData,setCOCEarnedInfoData] = useState([])

    const handleViewCOCInfo = async () =>{
        const id = toast.loading('Processing data')
       
        const res = await getCOCEarnedInfo()
        if(res.data.length>0){
            setCOCEarnedInfoData(res.data)
            toast.update(id,{
                render:'Successfully loaded',
                type:'success',
                autoClose:true,
                isLoading:false
            })
            handleOpenCOCInfo()

        }else{
            toast.update(id,{
                render:'COC data not found',
                type:'error',
                autoClose:true,
                isLoading:false
            })
        }
    }
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{margin:'0px 10px 10px 10px'}}>
                <DashboardLoading actionButtons={2}/>
            </Box>

            :
            <Fade in = {!isLoading}>
            <Box sx={{margin:'0px 10px 10px 10px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Tooltip title='Apply CTO'>
                        <Button color='success' onClick={handleAddCTO} className='custom-roundbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} variant='outlined' startIcon={<AddIcon/>}>Apply</Button></Tooltip>
                        <Tooltip title='Reload data'><IconButton color='primary' onClick={handleReloadCTO} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}}><ReplayIcon/></IconButton></Tooltip>
                        
                        
                    </Grid>
                    {
                        matches
                        ?
                        <Grid item xs={12} sx={{ml:2,mt:1,display:'flex',flexDirection:'row',justifyContent:'space-evenly',background:blue[800]}}>
                            <Typography sx={{color:'#fff',fontWeight:'bold',textAlign:'center',fontSize:'.9rem'}}><em>Balance <br/><span style={{fontSize:'.8rem',fontWeight:'normal'}}>{balance} hr/s</span></em></Typography>
                            <Typography sx={{color:'#fff',fontWeight:'bold',textAlign:'center',fontSize:'.9rem'}}><em>On Process <br/> <span style={{fontSize:'.8rem',fontWeight:'normal'}}>{onProcess} hr/s</span></em></Typography>
                            <Typography sx={{color:'#fff',fontWeight:'bold',textAlign:'center',fontSize:'.9rem'}}><em>Available <br/> <span style={{fontSize:'.8rem',fontWeight:'normal'}}>{totalForReview<=balance?balance-totalForReview:0}hr/s</span></em></Typography>
                        </Grid>
                        :
                        <Grid item xs={12}>

                            <Accordion expanded = {accordionCB}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="credit-content"
                            id="credit-header"
                            onClick={()=>setAccordionCB(!accordionCB)}
                            sx={{'&:hover':{background:'#f2f2f2'}}}
                            >
                            <ThemeProvider theme={headerTheme}>
                                <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b',fontWeight:'bold'}}>Leave Balance</Typography>
                            </ThemeProvider>
                            </AccordionSummary>
                            <AccordionDetails>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Balance</StyledTableCell>
                                        <StyledTableCell align='right'>On Process</StyledTableCell>
                                        <StyledTableCell align='right'>Available</StyledTableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        {/* <StyledTableCell>{onProcess>=balance?balance:parseInt(balance-totalForReview)+parseInt(onProcess)} hr/s</StyledTableCell> */}
                                        <StyledTableCell>{balance.toFixed(3)} hr/s <Tooltip title='View COC earned info'><IconButton color='info' size='small' onClick={handleViewCOCInfo}><InfoOutlinedIcon/></IconButton></Tooltip></StyledTableCell>
                                        <StyledTableCell align="right">{onProcess.toFixed(3)} hr/s</StyledTableCell>
                                        <StyledTableCell align="right">{totalForReview<=balance?(balance-totalForReview).toFixed(3):0} hr/s
                                        
                                        </StyledTableCell>
                                        {/* <TableCell align="right">{(balance+onProcess)-onProcess}</TableCell> */}
                                    </TableRow>
                                    
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                        </Grid>

                    }
                    
                    {
                        pendingData.length !==0
                        ?
                        <Grid item xs={12}>
                            <Accordion expanded = {accordionPending}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="credit-content"
                            id="pending-header"
                            onClick={()=>setAccordionPending(!accordionPending)}
                            sx={{'&:hover':{background:'#f2f2f2'}}}
                            >
                            <ThemeProvider theme={headerTheme}>
                            <Typography color={orange[900]} sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold',fontSize:matches?'.9rem':'auto'}}>Pending Application</Typography>
                            </ThemeProvider> &nbsp;
                            {
                                accordionPending
                                ?
                                ''
                                :
                                <Fade in={!accordionPending}>
                                <Badge badgeContent={pendingData.length} color="primary" className = 'animate__animated animate__tada'>
                                    <PendingIcon color="action" />
                                </Badge>
                                </Fade>
                            }
                            </AccordionSummary>
                            <AccordionDetails>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        {/* <StyledTableCell>Type of Leave</StyledTableCell> */}
                                        <StyledTableCell>Inclusive Dates</StyledTableCell>
                                        <StyledTableCell align='right'>Hours Applied</StyledTableCell>
                                        <StyledTableCell align='right'>Date Filed</StyledTableCell>
                                        <StyledTableCell align='right'>Status</StyledTableCell>
                                        <StyledTableCell align='right'>Remarks</StyledTableCell>
                                        <StyledTableCell align='center'>Action</StyledTableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        pendingData.map((row,key)=>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            hover
                                            key={key}
                                            >
                                            {/* <StyledTableCell component="th" scope="row">
                                                COC
                                            </StyledTableCell> */}
                                            <StyledTableCell component="th" scope="row">
                                                {row.inclusive_dates_text}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{row.days_hours_applied} hour/s</StyledTableCell>
                                            <StyledTableCell align="right">{moment(row.date_of_filing,'YYYY-MM-DD').format('MMMM DD, YYYY')}</StyledTableCell>
                                            <StyledTableCell align="right">{row.status}</StyledTableCell>
                                            <StyledTableCell align="right">{row.remarks}</StyledTableCell>
                                            <StyledTableCell align="center" sx={{display:'flex',flexDirection:'row',gap:1,justifyContent:'center'}}>
                                            <Tooltip title='Preview Application'>
                                            <IconButton className='custom-iconbutton' color='info' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>handlePreview(row)}><VisibilityIcon/></IconButton></Tooltip>
                                            
                                            {
                                                row.status === 'FOR REVIEW' || row.status === 'FOR UPDATING'
                                                ?
                                                null
                                                :
                                                <Tooltip title='Print Application'>
                                                <IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>handlePrintApplication(row)}><PrintIcon/></IconButton></Tooltip>
                                            }
                                            

                                            <Tooltip title='Cancel Application'><span>
                                            <IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} disabled={row.status ==='FOR REVIEW'?false:true} onClick={()=>handleDeleteCTO(row)}><DeleteOutline/></IconButton></span></Tooltip></StyledTableCell>
                                        </TableRow>
                                        )
                                    }
                                    
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                        </Grid>
                        :
                        null
                    }
                    
                    {
                        historyData.length !==0
                        ?
                        <Grid item xs={12}>
                            <Accordion expanded = {accordionHistory}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="credit-content"
                            id="history-header"
                            onClick={()=>setAccordionHistory(!accordionHistory)}
                            sx={{'&:hover':{background:'#f2f2f2'}}}
                            >
                            <ThemeProvider theme={headerTheme}>
                            <Typography color="#2196f3" sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold'}}>History</Typography>
                            </ThemeProvider> &nbsp;
                            {
                                accordionHistory
                                ?
                                ''
                                :
                                <Fade in={!accordionHistory}>
                                <Badge badgeContent={historyData.length} color="primary" className = 'animate__animated animate__tada'>
                                    <PendingIcon color="action" />
                                </Badge>
                                </Fade>
                            }
                            </AccordionSummary>
                            <AccordionDetails>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        {/* <StyledTableCell>Type of Leave</StyledTableCell> */}
                                        <StyledTableCell>Inclusive Dates</StyledTableCell>
                                        <StyledTableCell align='right'>Hours Applied</StyledTableCell>
                                        <StyledTableCell align='right'>Date Filed</StyledTableCell>
                                        <StyledTableCell align='right'>Status</StyledTableCell>
                                        <StyledTableCell align='right'>Remarks</StyledTableCell>
                                        {/* <StyledTableCell align='center'>Action</StyledTableCell> */}
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        historyData.map((row,key)=>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            hover
                                            key={key}
                                            >
                                            {/* <TableCell component="th" scope="row">
                                                CTO
                                            </TableCell> */}
                                            <TableCell component="th" scope="row">
                                                {row.inclusive_dates_text}
                                            </TableCell>
                                            <TableCell align="right">{row.days_hours_applied} hour/s</TableCell>
                                            <TableCell align="right">{moment(row.date_of_filing,'YYYY-MM-DD').format('MMMM DD, YYYY')}</TableCell>
                                            <TableCell align="right"><span style={{color:row.status==='DISAPPROVED'?red[800]:green[800]}}>{row.status}</span></TableCell>
                                            <TableCell align="right">{row.remarks}</TableCell>
                                            {/* <TableCell align="right">Action</TableCell> */}
                                        </TableRow>
                                        )
                                    }
                                    
                                    
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                        </Grid>
                        :
                        null
                    }
                    
                </Grid>
                <Dialog
                    fullScreen
                    // maxWidth='lg'
                    // fullWidth
                    sx={{width:matches?'100%':'40vw',height:'100%',right:0,left:'auto'}}
                    open={openApplicationDialog}
                    // onClose={()=>setOpenApplicationDialog(false)}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0,zIndex:2 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={()=>setOpenApplicationDialog(false)}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }}>
                        Application for Leave
                        </Typography>
                        <Button autoFocus color="inherit" onClick={()=>setOpenApplicationDialog(false)}>
                        Close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <AddCTO availableCOC = {totalForReview<=balance?balance-totalForReview:0} handleUpdateData = {handleUpdateData} empInfo = {empInfo} alreadyAppliedDays = {alreadyAppliedDays} alreadyAppliedDaysPeriod = {alreadyAppliedDaysPeriod}/>
                    </Box>
                </Dialog>
                <LargeModal open={open} close={handleClose} title='Preview TO Application'>
                    <Box sx={{maxHeight:'80vh',overflowY:'scroll',mb:1,pb:1}}>
                        <PreviewCTOApplicationForm2 info = {empInfo.info} authInfo = {empInfo.auth_info} aoInfo ={empInfo.office_ao_info} deptHead = {empInfo.office_assign_info} hours={selectedPreview.days_hours_applied} dates={selectedPreview.inclusive_dates_text} availableCOC  = {selectedPreview.bal_before_process} dateOfFiling = {selectedPreview.date_of_filing}/>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Button variant='contained' color='primary' onClick={handleClose}>Ok</Button>
                    </Box>
                </LargeModal>
                {/* <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Preview Application
                        </Typography>
                        <Box sx={{maxHeight:'80vh',overflowY:'scroll',mb:1,pb:1}}>
                            <PreviewCTOApplicationForm2 info = {empInfo.info} authInfo = {empInfo.auth_info} aoInfo ={empInfo.office_ao_info} deptHead = {empInfo.office_assign_info} hours={selectedPreview.days_hours_applied} dates={selectedPreview.inclusive_dates_text} availableCOC  = {selectedPreview.bal_before_process} dateOfFiling = {selectedPreview.date_of_filing}/>
                        </Box>
                        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Button variant='contained' color='primary' onClick={handleClose}>Ok</Button>
                        </Box>
                    </Box>
                </Modal> */}
               <div style={{display:'none'}}>
                    <PreviewCTOApplicationForm2 ref = {printRef} info = {empInfo.info} authInfo = {empInfo.auth_info} aoInfo ={empInfo.office_ao_info} deptHead = {empInfo.office_assign_info} hours={selectedPrint.days_hours_applied} dates={selectedPrint.inclusive_dates_text} availableCOC  = {selectedPrint.bal_before_process} dateOfFiling = {selectedPrint.date_of_filing}/>
                </div>
                
            </Box>
            </Fade>
        }
        <SmallModal open = {openCOCInfo} close = {handleCloseCOCInfo} title = 'COC earned history' >
            <Box sx={{mt:1}}>
                <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Hours Earned
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Used Hours
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Remaining
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Expiration
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    COCearnedInfoData.map((item,key)=>
                                        <TableRow>
                                            <StyledTableCell>
                                                {item.hours_earned}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {item.used}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {(item.hours_earned-item.used).toFixed(2)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <span style={{color:moment(item.expiration).format('YYYY-MM-DD')< moment().format('YYYY-MM-DD')?'red':'green'}}>{moment(item.expiration).format('MMMM DD, YYYY')}</span>
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </SmallModal>
        </>
    )
}