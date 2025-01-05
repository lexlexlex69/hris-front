import { Alert, Box, Button, Divider, Fade, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography,Tooltip,IconButton,Dialog,AppBar,Slide,Toolbar,Modal, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { api_url } from "../../../../request/APIRequestURL";
import { getAllHolidays, getEmpOBOFT, getLeaveDays, getEmpRawLogs, getWorkSched, tempHolidays, getEmpRectification, getEmpDTRV2 } from "./DTRV2Requests";
import moment from "moment";
import './Style.css';
import { computeLate, displayLatesUndertime, displayTotalLatesUndertime, getTimeLogs, getTimePunch } from "../../customprocessdata/CustomProcessData";
import { DisplayForm } from "./form/DisplayForm";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Version3 from "../onlinedtr/Version/Version3";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import DashboardLoading from "../../loader/DashboardLoading";
import { addRectificationRequest, cancelRectificationRequest, getEmployeeInfo, getRectificationRequestData, getRectificationRequestPeriod, getRequestedOBOFTRectification } from "../onlinedtr/DTRRequest";
//Icons
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import PrintIcon from '@mui/icons-material/Print';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

import Swal from "sweetalert2";
import { APILoading } from "../../apiresponse/APIResponse";
import { green,blue } from "@mui/material/colors";
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { auditLogs } from "../../auditlogs/Request";
import RequestOBOFT from "../onlinedtr/Dialog/RequestOBOFT";
import OBOFTInstruction from "../onlinedtr/Carousel/OBOFTInstruction";
import FullModal from "../../custommodal/FullModal";
import RequestedOBOFT from "../onlinedtr/Modal/RequestedOBOFT";
import { PrintForm } from "./form/PrintForm";
import DTRRectificationRequest from "../onlinedtr/DTRRectificationRequest";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
var mo
const DTRV2 = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [rawLogs,setRawlogs] = useState([]);
    const [daysNumber,setDaysNumber] = useState([])
    const [rowsToAdd,setRowsToAdd] = useState([])
    const [workSchedData,setWorkSchedData] = useState([]);
    const [dtrData,setDTRData] = useState([])
    const [empInfo,setEmpInfo] = useState([])
    const [dateFrom,setDateFrom] = useState('')
    const [dateTo,setDateTo] = useState('')
    const [signatory,setSignatory] = useState([])
    const [alreadyAppliedRectification,setAlreadyAppliedRectification] = useState([])
    const [open, setOpen] = useState(false);
    const [showDTR,setShowDTR] = useState(false);
    const [selectedMonth,setSelectedMonth] = useState('');
    const [selectedYear,setSelectedYear] = useState(moment().format('YYYY'))
    const printDTR = useRef();
    const [employeeInfo,setEmployeeInfo] = useState([])
    const [openInstruction,setOpenInstruction] = useState(false)

    const [openRequestedOBOFTModal,setOpenRequestedOBOFTModal] = useState(false)
    const [requestedOBOFTData,setRequestedOBOFTData] = useState([])
    const [viewDTR,setViewDTR] = useState(false)
    const [rectificationData,setRectificationData] = useState([])
    const instructionModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':'80%',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
    };
    const requestedOBOFTModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
    };

    // const [totalLateMinutes,setTotalLateMinutes] = useState(0)
    useEffect(()=>{
        _init();
         var logs = {
            action:'ACCESS DTR V2',
            action_dtl:'ACCESS DTR MODULE',
            module:'DTR'
        }
        auditLogs(logs)

    },[])
    const _init = async() => {
        const res = await getEmployeeInfo();
        setEmpInfo(res.data)
        setIsLoading(false)
        setEmployeeInfo(res.data.info)

        const res2 = getRequestedOBOFTRectification()
        setRequestedOBOFTData(res2.data?res2.data:[])
    }
    // const _init =  async () => {
    //     let t_data = {
    //         year:moment(fromDate).format('YYYY'),
    //         year2:moment(toDate).format('YYYY')
    //     }
    //     const work_sched = await getWorkSched(t_data)
    //     console.log(work_sched.data)
    //     setWorkSchedData(work_sched.data.data)
    // }
    const submit = async (data) => {
       APILoading('info','Retrieving DTR','Please wait...')
        // e.preventDefault();
        // _init()
        var fromDate = data.from;
        var toDate = data.to;
        setDateFrom(fromDate);
        setDateTo(toDate)
        let t_data1 = {
            year:moment(fromDate).format('YYYY'),
            year2:moment(toDate).format('YYYY'),
            from:fromDate,
            to:toDate,
            api_url:api_url
        }
        //get work sched
        const work_sched = await getWorkSched(t_data1)
        setWorkSchedData(work_sched.data.data)
        console.log(work_sched.data.data)
        
        if(work_sched.data.data.length>0){
            //get leave days
            // const leave_days = await getLeaveDays(t_data1);
            // console.log(leave_days.data.data)
            
            //get holidays
            // const holidays = await getAllHolidays();
            // const holidays = tempHolidays();
            // console.log(holidays.data.response)

            // const ob_oft = await getEmpOBOFT(t_data1)
            // console.log(ob_oft.data.data);

            let t_data = {
                from:fromDate,
                to:toDate,
                api_url:api_url
            }
            const res = await getEmpDTRV2(t_data);
            console.log(res.data)

            // const rawlogs = await getEmpRawLogs(t_data);
            setRawlogs(res.data.raw_logs)
            setSignatory(res.data.signatory)

            // const rectification = await getEmpRectification(t_data);
            // console.log(rectification.data)
            setAlreadyAppliedRectification(res.data.rectification_data)
            setRectificationData(res.data.rectification_pending)

            var start = new Date(fromDate);
            var end = toDate;
            var arrDays = [];
        
            while(moment(start).format('YYYY-MM-DD') <= (moment(end).format('YYYY-MM-DD'))){
                arrDays.push(moment(start).format('YYYY-MM-DD'));
                start.setDate(start.getDate()+1);
            }
            setDaysNumber(arrDays)
            var start = arrDays.length;
            var end = parseInt(moment().endOf(dateTo).format('D'));
            var row_number = [];
            var count = 0;
            while(start < end){
                row_number.push(count);
                start++;
                count++;
            }
            setRowsToAdd(row_number)
            // /**
            // Set up processed DTR 
            // */
            // let dtr = [];
            // arrDays.forEach(el=>{
            //     var time_logs = getTimeLogs(work_sched.data.data,res.data.data,el,leave_days.data.data,holidays.data.response,ob_oft.data.data,rectification.data.data);
            //     dtr.push(time_logs)
            // })
            // console.log(dtr)
            setDTRData(res.data.data)
            setViewDTR(true)
            Swal.close();
        }else{
            Swal.fire({
                icon:'error',
                title:'Oops...',
                text:'Work Schedule not found ! Please contact your AO.'
            })
        }
        
    }
    const updateAppliedRectification = (value)=>{
        setAlreadyAppliedRectification(value)
    }
    const [openOBOFT,setOpenOBOFT] = useState(false);
    const [pendingRectificationData,setPendingRectificationData] = React.useState([])
    const [isRequestAllLoading,setIsRequestAllLoading] = useState(false)


    const handleOpenOBOFT = () =>{
        setOpenOBOFT(true)
    }
    const handleCloseOBOFT = () =>{
        setOpenOBOFT(false)
    }
    const [isLoadingRectificationData,setIsLoadingRectificationData] = useState(false)
    const [period, setPeriod] = React.useState('');
    const [appliedDates,setAppliedDates] = React.useState([])
    const [addModal,setAddModal] = useState(false)


    const handleFileRetrification = async(type) => {
        setIsLoadingRectificationData(true)
        if(type === 'default'){
            if(dateFrom.length !== 0  && dateTo.length !== 0){
                var data2 = {
                    is_displayed:true,
                    from:dateFrom,
                    to:dateTo,
                }
                await getRectificationRequestPeriod(data2)
                .then(response=>{
                    const data = response.data
                    setPeriod(moment(dateFrom,'YYYY-MM-DD').format('MMMM DD')+'-'+moment(dateTo,'YYYY-MM-DD').format('MMMM DD, YYYY'))
                    setPendingRectificationData(data)
                    return data
                }).then(res=>{
                    setIsLoadingRectificationData(false)

                    setOpen(true)
                })
                .catch(error=>{
                    console.log(error)
                })
            }else{
                var month = moment(new Date(),'YYYY-MM-DD').format('MM');
                var year = moment(new Date(),'YYYY-MM-DD').format('YYYY');
    
                var from_period = new Date(year, month-1, 1);
                var to_period = new Date(year, month, 0);
                var data2 = {
                    is_displayed:false,
                    month:month,
                    year:year,
                    period:moment(from_period,'YYYY-MM-DD').format('DD')+'-'+moment(to_period,'YYYY-MM-DD').format('DD')
                }
                await getRectificationRequestPeriod(data2)
                .then(response=>{
                    const data = response.data
                    setPendingRectificationData(data)
                    // setselectedMonth(moment(new Date()).format('MMMM'))
                    // setselectedYear(moment(new Date()).format('YYYY'))
                    setPeriod(moment(new Date(),'YYYY-MM-DD').format('MMMM YYYY'))
                    return data

                }).then(res=>{
                    setIsLoadingRectificationData(false)
                    setOpen(true)

                })
                .catch(error=>{
                    console.log(error)
                })
            }
            
        }else{
            var data2 = {
                is_displayed:true,
                from:dateFrom,
                to:dateTo,
            }
            getRectificationRequestPeriod(data2)
            .then(response=>{
                const data = response.data
                setPeriod(moment(dateFrom,'YYYY-MM-DD').format('MMMM DD')+'-'+moment(dateTo,'YYYY-MM-DD').format('DD, YYYY'))
                setPendingRectificationData(data)
                setIsLoadingRectificationData(false)
                setOpen(true)
            }).catch(error=>{
                console.log(error)
            })
            
        }
        
    };
    const reactToPrintDTR = useReactToPrint({
        content: () => printDTR.current,
        documentTitle:selectedMonth.length !==0||selectedYear.length !==0?employeeInfo.lname+' DTR '+selectedMonth+' '+period+','+selectedYear:''
    })
    const beforePrint = () =>{
        var logs = {
            action:'PRINT DTR',
            action_dtl:'FROM = '+dateFrom+' | TO = '+dateTo,
            module:'DTR'
        }
        auditLogs(logs)
        reactToPrintDTR()
    }
    const handleClose = () => setOpen(false);
    const showAllRectificationRequest = () => {
        setIsRequestAllLoading(true)
        getRectificationRequestData()
        .then(response=>{
            const data = response.data;
            // console.log(data)
            setPendingRectificationData(data.data)
            setAppliedDates(data.applied_dates)
            setIsRequestAllLoading(false)
            // setIsLoading(false)
        }).catch(error=>{
            console.log(error)
        })
    }
    const submitRectificationRequest = (data) => {
        Swal.fire({
            icon:'info',
            title:'Saving data please wait...',
        })
        Swal.showLoading()
        
        addRectificationRequest(data)
        .then(response=>{
            const data = response.data
            if(data.status === 'success'){
                setPendingRectificationData(data.data)
                setAppliedDates(data.applied_dates)
                if(data.already_exist.length !==0 || data.max_missed_logs.length !==0){
                    // console.log(data)
                    var tr = "";
                    var tr2 = "";
                    var already_exist_html = "";
                    var max_missed_logs_html = "";
                    if(data.already_exist.length !==0){
                        data.already_exist.forEach(el=>
                        tr+="<tr><td>"+el.date+"</td>"+"<td>"+el.nature+"</td></tr>"
                        )
                        already_exist_html = "<table class='table table-bordered'><thead><tr><th colspan=2>Already Exists</tr><tr><th>Date</th><th>Nature</th></tr></thead><tbody>"+tr+"</tbody></table>";
                    }
                    if(data.max_missed_logs.length !==0){
                        data.max_missed_logs.forEach(el=>
                        tr2+="<tr><td>"+el.date+"</td>"+"<td>"+el.nature+"</td></tr>"
                        )
                        var max_missed_logs_html = "<table class='table table-bordered'><thead><tr><th colspan=2>Not submitted (max missed logs reached)</tr><tr><th>Date</th><th>Nature</th></tr></thead><tbody>"+tr2+"</tbody></table>";
                    }
                    
                    

                    Swal.fire({
                        icon:'warning',
                        title:'Rectification request notice.',
                        html:"<div>"+already_exist_html+max_missed_logs_html+"</div><span>Please review again your application.</span>"
                    })
                    setAddModal(false)

                }else{
                    setAddModal(false)
                    Swal.fire({
                        icon:'success',
                        title:response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                
            }else{
                Swal.fire({
                    icon:'error',
                    title:response.data.message
                })
            }
            
        }).catch(error=>{
            Swal.close()
            console.log(error)
        })       
    }
    const cancelRectificationRequestApplication = (row) => {
        Swal.fire({
            icon:'warning',
            title:'Cancel this rectification request ?',
            showCancelButton:true,
            confirmButtonText:'Yes',
            cancelButtonText:'No'
        }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                  icon:'info',
                  title:'Please wait...',
                  allowEscapeKey:false,
                  allowOutsideClick:false
              })
              Swal.showLoading()
              cancelRectificationRequest(row.rectify_id)
              .then(response=>{
                const data = response.data

                if(data.status === 'success'){
                    Swal.fire({
                        icon:'success',
                        title:data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setPendingRectificationData(data.data)
                    setAppliedDates(data.applied_dates)
                    setAlreadyAppliedRectification(data.already_applied_rectification)
                }else{
                    Swal.fire({
                        icon:'error',
                        title:data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                  
              }).catch(error=>{
                    Swal.close()
                  console.log(error)
              })

            }
          })
    }
    const refreshData = ()=>{
        Swal.fire({
            icon:'info',
            title:'Please wait...',
            html:'Refreshing data...'
        })
        Swal.showLoading()
        getRectificationRequestData()
        .then(response=>{
            const data = response.data;
            setPendingRectificationData(data.data)
            setAppliedDates(data.applied_dates)
            Swal.close()
        }).catch(error=>{
            console.log(error)
        })
    }
    return (
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
            isLoading
            ?
                <DashboardLoading/>
            :
            <Fade in>
                <Box>
                <Grid container>
                    <Grid item xs={12} sx={{mb:1}}>
                        <Alert severity="info"><ConstructionOutlinedIcon fontSize='small'/> <strong>Beta test</strong> only. All records will be updated soon. </Alert>

                        </Grid>
                </Grid>

                <Grid item xs={12} sx={{display:'flex',gap:1,flexDirection:'row',justifyContent:matches?'center':'flex-end',mb:2}}>
                        {
                        matches
                        ?
                        <Box sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Tooltip title='File OB-OFT Rectification'><IconButton color='primary' size='large' onClick={handleOpenOBOFT} className='custom-iconbutton'><PostAddIcon/></IconButton></Tooltip>
                        {
                            viewDTR
                            ?
                            <Box sx={{display:'flex',gap:1}}>
                            <Tooltip title='File Rectification Request'><IconButton sx={{'&:hover':{color:'#fff',background:green[800]}}} size='large' onClick={()=>handleFileRetrification('period')} color='success' className='custom-iconbutton'><AutoFixHighOutlinedIcon/></IconButton>
                            </Tooltip>
                            <Tooltip title='Print DTR'><IconButton size='large' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick = {beforePrint} className='custom-iconbutton' color='primary'><PrintIcon/></IconButton></Tooltip>
                            </Box>
                            
                        :
                            <Box sx={{display:'flex',gap:1}}>
                            <Tooltip title='File Rectification Request'><IconButton onClick={()=>handleFileRetrification('default')} size='large' sx={{'&:hover':{color:'#fff',background:green[800]}}} color='success' className='custom-iconbutton'><AutoFixHighOutlinedIcon/></IconButton>
                            </Tooltip>
                            </Box>
                        }
                        </Box>
                        
                        :
                        <Box sx={{display:'flex',flexDirection:'row',gap:1}}>
                        <Tooltip title='File OB-OFT Rectification'><Button variant='contained' startIcon={<PostAddIcon/>} onClick={handleOpenOBOFT}>File OB-OFT</Button></Tooltip>
                        {
                            viewDTR
                            ?
                            <Box sx={{display:'flex',gap:1}}>
                            <Tooltip title='File Rectification Request'><Button variant ='contained' onClick={()=>handleFileRetrification('period')} color='success' className='custom-iconbutton' startIcon={<AutoFixHighOutlinedIcon/>}>File Rectification</Button>
                            </Tooltip>
                            <Tooltip title='Print DTR'><Button variant='contained' onClick = {beforePrint} className='custom-iconbutton' color='info' startIcon={<PrintIcon/>}>Print My DTR</Button></Tooltip>
                            </Box>
                            
                        :
                            <Tooltip title='File Rectification Request'><Button variant ='contained' onClick={()=>handleFileRetrification('default')} color='success' className='custom-iconbutton' startIcon={<AutoFixHighOutlinedIcon/>}>File Rectification</Button>
                            </Tooltip>
                        }
                        </Box>

                    }
                    </Grid>
                <Version3 displayDTR = {submit}/>
                
                <Grid item xs={12} sx={{mt:5,mb:5}}>
                    {/* <Divider/> */}
                </Grid>
                {
                    viewDTR
                    ?
                    (
                    <>
                    {
                        matches
                        ?
                        <Grid container sx={{p:1}}>
                            <Grid item xs={12} sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'center'}}>
                                <DisplayForm data = {dtrData} rowsToAdd = {rowsToAdd} empInfo={empInfo} signatory={signatory} from ={dateFrom} to = {dateTo} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification ={setAlreadyAppliedRectification} updateAppliedRectification = {updateAppliedRectification} rectificationData = {rectificationData} rawLogs = {rawLogs} daysNumber={daysNumber} />
                            </Grid>
                        </Grid>
                        :
                        <Paper>
                        <Grid container spacing={1}>
                        
                            <Grid item xs={12} md={6} lg={6} sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'center'}}>
                                <DisplayForm data = {dtrData} rowsToAdd = {rowsToAdd} empInfo={empInfo} signatory={signatory} from ={dateFrom} to = {dateTo} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification ={setAlreadyAppliedRectification} updateAppliedRectification = {updateAppliedRectification} rectificationData = {rectificationData} rawLogs= {rawLogs} daysNumber={daysNumber}/>
                            </Grid>
                            
                            <Grid item xs={12} md={6} lg={6}>
                                <DisplayForm data = {dtrData} rowsToAdd = {rowsToAdd} empInfo={empInfo} signatory={signatory} from ={dateFrom} to = {dateTo} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification ={setAlreadyAppliedRectification} updateAppliedRectification = {updateAppliedRectification}  rectificationData = {rectificationData} rawLogs = {rawLogs} daysNumber={daysNumber}/>
                            </Grid>
                        </Grid>
                        </Paper>
                        }
                    
                    
                    <Grid container>
                        <div style={{display:'none'}}>
                            <div ref = {printDTR} style={{width:'100%'}}>
                            {/* <Grid item xs={6} md={6} lg={6} sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'center'}}>
                                
                            </Grid>
                            
                            <Grid item xs={6} md={6} lg={6}>
                                <PrintForm data = {dtrData} rowsToAdd = {rowsToAdd} empInfo={empInfo} signatory={signatory} from ={dateFrom} to = {dateTo} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification ={setAlreadyAppliedRectification} updateAppliedRectification = {updateAppliedRectification}/>
                            </Grid> */}
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',margin:'20px'}}>
                                <Grid item xs={6} sx={{margin:'0 10px'}}>
                                    <PrintForm data = {dtrData} rowsToAdd = {rowsToAdd} empInfo={empInfo} signatory={signatory} from ={dateFrom} to = {dateTo} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification ={setAlreadyAppliedRectification} updateAppliedRectification = {updateAppliedRectification}  rectificationData = {rectificationData} rawLogs = {rawLogs} daysNumber={daysNumber}/>
                                </Grid>
                                <Grid item xs={6} sx={{margin:'0 10px'}}>
                                    <PrintForm data = {dtrData} rowsToAdd = {rowsToAdd} empInfo={empInfo} signatory={signatory} from ={dateFrom} to = {dateTo} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification ={setAlreadyAppliedRectification} updateAppliedRectification = {updateAppliedRectification}  rectificationData = {rectificationData} rawLogs = {rawLogs} daysNumber={daysNumber}/>
                                </Grid>
                            </Grid>
                            </div>
                        </div>
                    </Grid>
                    </>)
                    :
                    null
                }
                
                <Dialog
                    fullScreen
                    open={openOBOFT}
                    onClose={handleCloseOBOFT}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseOBOFT}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} component="div">
                        OB-OFT Rectification Request
                        </Typography>
                        {
                            matches
                            ?
                            <Box>
                            <IconButton color="inherit" onClick={()=>setOpenInstruction(true)}><InfoIcon/></IconButton>
                            &nbsp;
                            <IconButton color="inherit" onClick={()=>setOpenRequestedOBOFTModal(true)}><PostAddIcon/></IconButton>
                            <Button autoFocus color="inherit" onClick={handleCloseOBOFT}>
                            Close
                            </Button>
                            </Box>
                            :
                            <Box>
                            <Button color="inherit" variant='outlined' startIcon={<InfoIcon/>} onClick={()=>setOpenInstruction(true)}>Instruction</Button>
                            &nbsp;
                            <Button color="inherit" variant='outlined' startIcon={<PostAddIcon/>} onClick={()=>setOpenRequestedOBOFTModal(true)}>View Requested OB-OFT</Button>
                            <Button autoFocus color="inherit" onClick={handleCloseOBOFT}>
                            Close
                            </Button>
                            </Box>
                        }
                        
                        
                        
                    </Toolbar>
                    </AppBar>
                    <Box sx={{maxHeight:'100%',overflowY:'scroll',p:2}}>
                        <RequestOBOFT employeeInfo= {employeeInfo} close = {handleCloseOBOFT} setRequestedOBOFTData ={setRequestedOBOFTData}/>
                    </Box>
                </Dialog>
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
                        <Typography sx={{ ml: 2, flex: 1 }} component="div">
                        DTR Rectification Request
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                        Close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{maxHeight:'100%',overflowY:'scroll',p:2}}>
                        <DTRRectificationRequest handleClose = {handleClose} submitRectificationRequest = {submitRectificationRequest} pendingRectificationData = {pendingRectificationData} appliedDates = {appliedDates} cancelApplication = {cancelRectificationRequestApplication} refreshData={refreshData} year ={selectedYear} month={selectedMonth} period={period} showAllRectificationRequest = {showAllRectificationRequest} addModal = {addModal} closeAddModal={()=>setAddModal(false)} openAddModal = {()=>setAddModal(true)} isRequestAllLoading = {isRequestAllLoading}/>
                        
                        {/* <Grid container>
                            <Grid item xs={12} sx={{p:2}}>
                                <Box>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                        <Button color='error' variant='contained' startIcon={<CloseIcon/>} onClick={handleClose} size='small'>Close</Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Dialog>
                {/* <FullModal open = {openInstruction} close = {()=>setOpenInstruction(false)} title='How to use OB-OFT rectification request'>
                    <Box sx={{maxHeight:'80vh',overflowY:'scroll',scale:'.9'}}>
                        <OBOFTInstruction/>
                    </Box>
                </FullModal> */}
                <Modal
                    open={openInstruction}
                    onClose={()=>setOpenInstruction(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={instructionModalStyle}>
                    <Box sx={{display:'flex',justifyContent:'space-between'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                        How to use OB-OFT rectification request
                        </Typography>
                        <IconButton color='error' onClick={()=>setOpenInstruction(false)}><CloseIcon/></IconButton>
                    </Box>
                    
                    <Box>
                        <OBOFTInstruction/>
                    </Box>
                    </Box>
                </Modal>
                <Modal
                    open={openRequestedOBOFTModal}
                    onClose={()=>setOpenRequestedOBOFTModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={requestedOBOFTModalStyle}>
                    <Box sx={{display:'flex',justifyContent:'space-between'}}>
                        <Typography id="modal-modal-title" sx={{color:'#fff',fontWeight:500,fontSize:matches?'1rem':'1.1rem',background:blue[800],p:1,position:'relative',top:'-40px'}}>
                        List of Requested OB-OFT
                        </Typography>
                        <Tooltip title='Close'><IconButton color='error' onClick={()=>setOpenRequestedOBOFTModal(false)}><CloseIcon/></IconButton></Tooltip>
                    </Box>
                    
                    <Box>
                        <RequestedOBOFT data = {requestedOBOFTData} setData = {setRequestedOBOFTData}/>
                    </Box>
                    </Box>
                </Modal>
                </Box>
            </Fade>

            }
            
        </Box>
    )
}
export default DTRV2;