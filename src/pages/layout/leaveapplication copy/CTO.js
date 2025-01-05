import React,{useEffect, useState} from 'react';
import {Grid,Box,Stack,Skeleton,Typography,Fade,Table,TableHead,TableContainer,TableRow,TableBody,IconButton,Paper,Accordion,AccordionSummary,AccordionDetails,Badge,Tooltip,Dialog,Button} from '@mui/material';
import {blue,red,green,orange} from '@mui/material/colors';
import { checkPermission } from '../permissionrequest/permissionRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    useNavigate
} from "react-router-dom";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deleteCTOApplication, getCTOLeaveDetails, getLeaveBalance, isBalanceUpdatedToday, updateCTOLeaveDetails } from './LeaveApplicationRequest';
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
import $ from 'jquery'
import { DeleteOutline } from '@mui/icons-material';
import DashboardLoading from '../loader/DashboardLoading';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

export default function CTO(){
    // navigate
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true);
    const [balance,setBalance] = useState();
    const [COCUsed,setCOCUsed] = useState();
    const [onProcess,setOnProcess] = useState();
    const [pendingData,setPendingData] = useState();
    const [historyData,setHistoryData] = useState();
    const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
    const [totalForReview,setTotalForReview] = useState(0);
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
                    if(res.data.status){
                        getCTOLeaveDetails()
                        .then(res=>{
                            setBalance(res.data.coc[0].coc_bal)
                            setCOCUsed(res.data.coc.coc_used)
                            var temp = 0;
                            res.data.pending.forEach(el => {
                                if(el.status=== 'FOR REVIEW'){
                                    temp+=el.days_hours_applied
                                }
                            });
                            setTotalForReview(temp)
                            setPendingData(res.data.pending)
                            setHistoryData(res.data.history)
                            setOnProcess(res.data.pending_hrs_applied)
                            setIsLoading(false)
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
                            setIsLoading(false)
                        }).catch(err=>{
                            Swal.close();
                            console.log(err)
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate('/hris')
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
            setTotalForReview(temp)
            setBalance(res.data.coc[0].coc_bal)
            setCOCUsed(res.data.coc.coc_used)
            setPendingData(res.data.pending)
            setHistoryData(res.data.history)
            setOnProcess(res.data.pending_hrs_applied)
            setOpenApplicationDialog(false)
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
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Compensatory Time Off
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Tooltip title='Apply CTO'><IconButton color='success' onClick={handleAddCTO} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}}><AddIcon/></IconButton></Tooltip>
                        &nbsp;
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
                            <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b',fontWeight:'bold'}}><em>Leave Balance</em></Typography>
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
                                        <StyledTableCell>{balance} hr/s</StyledTableCell>
                                        <StyledTableCell align="right">{onProcess} hr/s</StyledTableCell>
                                        <StyledTableCell align="right">{totalForReview<=balance?balance-totalForReview:0} hr/s</StyledTableCell>
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
                            <Typography color="#fda400" sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold',fontSize:matches?'.9rem':'auto'}}><em>Pending Application</em></Typography> &nbsp;
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
                                            <StyledTableCell align="right"><Tooltip title='Cancel Application'><IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} disabled={row.status ==='FOR REVIEW'?false:true} onClick={()=>handleDeleteCTO(row)}><DeleteOutline/></IconButton></Tooltip></StyledTableCell>
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
                            <Typography color="#2196f3" sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold'}}><em>History</em></Typography> &nbsp;
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
                    <AppBar sx={{ position: 'sticky',top:0 }}>
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
                        <AddCTO availableCOC = {totalForReview<=balance?balance-totalForReview:0} handleUpdateData = {handleUpdateData}/>
                    </Box>
                </Dialog>
            </Box>
            </Fade>
        }
        </>
    )
}