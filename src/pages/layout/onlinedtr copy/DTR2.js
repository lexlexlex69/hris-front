import { Container, Typography ,Box, Paper, Grid,InputLabel ,MenuItem ,FormControl,Button,Modal, Table, TableHead, TableRow, TableCell,Stack,Skeleton,Fade,Alert, Tooltip } from '@mui/material';
import React, { useEffect, useRef,useState } from 'react';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DatePicker from 'react-multi-date-picker';
import InputIcon from "react-multi-date-picker/components/input_icon"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getDTR,getEmployeeInfo,addRectificationRequest, getRectificationRequestData,cancelRectificationRequest,insertDTR, getRectificationRequestPeriod,getDTRAPI,getOfficeHeadName } from './DTRRequest';
import moment from 'moment';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DTRForm from './DTRForm';
//icon
import PrintIcon from '@mui/icons-material/Print';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import SaveIcon from '@mui/icons-material/Save';
import ArticleIcon from '@mui/icons-material/Article';
import StickyNote2 from '@mui/icons-material/StickyNote2';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ReactToPrint from 'react-to-print';
import DTRFormPrint from './DTRFormPrint';
import Swal from 'sweetalert2';
import DTRRectificationRequest from './DTRRectificationRequest';
import { ToastContainer,toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
var moment2 = require('moment-business-days');
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    // height:500,
    marginBottom: 0,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius:3, 
    boxShadow: 24,
    // p: 4,
    // height:'100%',
    // overflow:'scroll'
  };
export default function DTR(){
    const [isLoading,setIsLoading] = React.useState(true)
    const [pendingRectificationData,setPendingRectificationData] = React.useState([])
    const [appliedDates,setAppliedDates] = React.useState([])
    const [underDevelopment,setUnderDevelopment] = React.useState(false)
    const [officeHead,setOfficeHead] = useState('')
    const [addModal,setAddModal] = useState(false)

    useEffect(()=>{
        var currYear = moment(year).format('YYYY')
        setselectedYear(currYear)
        getEmployeeInfo()
        .then(response=>{
            const data = response.data
            // console.log(data)
            setEmployeeInfo(data.info)
            setSignatory(data.signatory)
            setIsLoading(false)
                getOfficeHeadName(data.info.id)
                .then(res=>{
                    const r = res.data
                    // console.log(r)
                    setOfficeHead(r)
                }).catch(err=>{
                    console.log(err)
                })
        }).catch(error=>{
            console.log(error)
        })
        
    },[])
    // media query
    const printDTR = useRef();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [period, setPeriod] = React.useState('');
    const handleChangePeriod = (event) => {
        setshowDTR(false)
        setPeriod(event.target.value);
    };
    const [JSON,setJSON] = React.useState([])
    const [dtrdata,setdtrdata] = React.useState([])
    const [daysPeriod,setdaysPeriod] = React.useState([])
    const [year,setyear] = React.useState([])
    const [days,setDays] = React.useState([]);
    const [selectedYear,setselectedYear] = React.useState('');
    const [selectedMonth,setselectedMonth] = React.useState('')
    const [yearArray,setyearArray] = React.useState([])
    const [monthArray,setmonthArray] = React.useState([])
    const [employeeInfo,setEmployeeInfo] = React.useState([])
    const [signatory,setSignatory] = React.useState([])
    const [addStatus,setAddStatus] = React.useState(true)
    const [isNavigateDTR,setIsNavigateDTR] = React.useState(false)
    
    const showAllRectificationRequest = () => {
        getRectificationRequestData()
        .then(response=>{
            const data = response.data;
            // console.log(data)
            setPendingRectificationData(data.data)
            setAppliedDates(data.applied_dates)
            // setIsLoading(false)
        }).catch(error=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        // setdtrdata(JSON.response)
        // console.log(JSON.response)
        /**
         * Setting year array data
         */
        var year = new Date()
        var yearArray = [];
        var currYear = moment(year).format('YYYY')
        for(var y=0 ;y<=2;y++){
            yearArray.push(currYear-y)
        }
        setyearArray(yearArray)

        /**
         * Setting month array data
         */
        moment.locale('en');
        setmonthArray(moment.months())
        
        /**
         * Reset period value
         */
        if(selectedYear.length !==0 && selectedMonth.length !==0){
            setIsNavigateDTR(false)
            var year = selectedYear;
            // var month = selectedMonth.format('MM')-1;
            var month = moment().month(selectedMonth).format('MM')-1
            var date = new Date(year, month, 1);
            var days = [];
            while (date.getMonth() === month) {
                days.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }
            var temp = []
            var last_day;
            last_day = moment(days[days.length-1]).format('D')
            temp.push('01-'+last_day);
            temp.push('01-15');
            temp.push('16-'+last_day)
            setdaysPeriod(temp)
            setDays(days)
        }
        if(!isNavigateDTR){
            setPeriod('')
        }
        
    },[selectedMonth,selectedYear])
    const [showDTR,setshowDTR] = React.useState(false)
    const [open, setOpen] = React.useState(false);
    const [currRectificationPeriodData,setCurrRectificationPeriodData] = React.useState([]);
    const [selectedCurrentMonth,setSelectedCurrentMonth] = useState('')
    const handleFileRetrification = (type) => {
        if(type === 'default'){
            var month = moment(new Date()).format('MM');
            var year = moment(new Date()).format('YYYY');

            var from_period = new Date(year, month-1, 1);
            var to_period = new Date(year, month, 0);
            var data2 = {
                month:month,
                year:year,
                period:moment(from_period).format('DD')+'-'+moment(to_period).format('DD')
            }
            getRectificationRequestPeriod(data2)
            .then(response=>{
                const data = response.data
                setPendingRectificationData(data)
                setselectedMonth(moment(new Date()).format('MMMM'))
                setselectedYear(moment(new Date()).format('YYYY'))
                setPeriod(moment(from_period).format('DD')+'-'+moment(to_period).format('DD'))
                setOpen(true)
            }).catch(error=>{
                console.log(error)
            })
        }else{
            var month = moment().month(selectedMonth).format('MM')
            // console.log(month)
            // console.log(selectedYear)
            // console.log(period)
            var data2 = {
                month:month,
                year:selectedYear,
                period:period
            }
            getRectificationRequestPeriod(data2)
            .then(response=>{
                const data = response.data
                setPendingRectificationData(data)
                setOpen(true)
            }).catch(error=>{
                console.log(error)
            })
        }
        
    };
    const handleClose = () => setOpen(false);
    const [totalUndertimeHours,settotalUndertimeHours] = React.useState(0);
    const [totalUndertimeMinutes,settotalUndertimeMinutes] = React.useState(0);
    const [totalLateHours,settotalLateHours] = React.useState(0);
    const [totalLateMinutes,settotalLateMinutes] = React.useState(0);
    const [alreadyAppliedRectification,setAlreadyAppliedRectification] = React.useState([]);
    const [regularDays,setRegularDays] = React.useState('')
    const [monthPeriod,setMonthPeriod] = useState('')
    const displayDTR = () =>{
        // setshowDTR(true)
        
        Swal.fire({
            icon:'info',
            title:'Retrieving Data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false      
        })
        Swal.showLoading()
        if(selectedYear.length ===0 || selectedMonth.length ===0 || period.length ===0 ){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please select Year / Month / Period'
            })
        }else{
            var splitPeriod = period.split('-');

            var laborDay = '07-01-2022';
 
            // moment2.updateLocale('us', {
            //     holidays: [laborDay],
            //     holidayFormat: 'MM-DD-YYYY'
            // });

            var temp_date = splitPeriod[0]+'-'+moment().month(selectedMonth).format('MM')+'-'+selectedYear;
            var total_regular_days = moment2(temp_date, 'DD-MM-YYYY').monthBusinessDays()
            setRegularDays(total_regular_days.length)
            
            var data = {
                from:selectedYear+'-'+moment().month(selectedMonth).format('MM')
                +'-'+splitPeriod[0],
                to:selectedYear+'-'+moment().month(selectedMonth).format('MM')+'-'+splitPeriod[1],
                emp_id:employeeInfo.id_no
            }
            setSelectedCurrentMonth(selectedYear+'-'+moment().month(selectedMonth).format('MM')
            +'-'+splitPeriod[0])
            setMonthPeriod(selectedMonth+' '+period+','+selectedYear)
            getDTR(data)
            .then(response=>{
                const result1 = response.data
                // console.log(result1.applied_days)
                setAlreadyAppliedRectification(result1.applied_days)
                var data2 = {
                    from:selectedYear+'-'+moment().month(selectedMonth).format('MM')
                    +'-'+splitPeriod[0],
                    to:selectedYear+'-'+moment().month(selectedMonth).format('MM')+'-'+splitPeriod[1],
                    emp_id:employeeInfo.id_no
                }
                getDTRAPI(data2)
                .then(respo=>{
                    const result = respo.data
                    if(result.code === '301'){
                        setshowDTR(false)
                        Swal.fire({
                            icon:'error',
                            title:result.message
                        })
                    }else{
                        var undertime=0;
                        var late=0;
                        result.response.forEach(element => {
                            // console.log(element.late_minutes)
                            late += parseInt(element.late_minutes)
                            undertime += parseInt(element.under_time)
                        });
                        // console.log(late)
                        // console.log(undertime)
                        var total_undertime = undertime;
                        if(total_undertime>=1){
                            var undertime_hours = (total_undertime / 60);
                            var undertime_rhours = Math.floor(undertime_hours);
                            var undertime_minutes = (undertime_hours - undertime_rhours) * 60;
                            var undertime_rminutes = Math.round(undertime_minutes);
                            settotalUndertimeHours(undertime_rhours)
                            settotalUndertimeMinutes(undertime_rminutes)
                        }else{
                            settotalUndertimeHours(0)
                            settotalUndertimeMinutes(0)
                        }
    
                        var total_late = late;
                        if(total_late>=1){
                            var late_hours = (total_late / 60);
                            var late_rhours = Math.floor(late_hours);
                            var late_minutes = (late_hours - late_rhours) * 60;
                            var late_rminutes = Math.round(late_minutes);
    
                            settotalLateHours(late_rhours)
                            settotalLateMinutes(late_rminutes)
                        }else{
                            settotalLateHours(0)
                            settotalLateMinutes(0)
                        }
                        setdtrdata(result.response)
                        // setdtrdata(tempdata)
                        setshowDTR(true)
                        Swal.close()
                        
                    }
                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                    toast.error(err.message)
                })
                
            }).catch(error=>{
                Swal.close()
                setshowDTR(false)
                toast.error(error.message)
            })
        }
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
                console.log(data)
                setPendingRectificationData(data.data)
                setAppliedDates(data.applied_dates)
                if(data.already_exist.length !==0){
                    // console.log(data)
                    var tr = ""
                    data.already_exist.forEach(el=>
                        tr+="<tr><td>"+el.date+"</td>"+"<td>"+el.nature+"</td></tr>"
                    )
                    Swal.fire({
                        icon:'warning',
                        title:'Rectification request already exist.',
                        html:"<table class='table table-bordered'><thead><tr><th>Date</th><th>Nature</th></tr></thead><tbody>"+tr+"</tbody></table><span>Please review again your application.</span>"
                    })
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
    const updateAppliedRectification = (value)=>{
        setAlreadyAppliedRectification(value)
    }
    const navigateMonth = (type)=>{
        if(type==='prev'){
            var navMonth = moment(selectedCurrentMonth).subtract(1, 'months').calendar();
        }else{
            var navMonth = moment(selectedCurrentMonth).add(1, 'months').calendar();
        }
        setSelectedCurrentMonth(navMonth);
        setIsNavigateDTR(true)
        
        Swal.fire({
            icon:'info',
            title:'Loading Data...',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        
        var from = new Date(moment(navMonth).format('YYYY'),moment(navMonth).format('MM')-1,1)
        var to = new Date(moment(navMonth).format('YYYY'),moment(navMonth).format('MM'),0)
        setselectedYear(moment(from).format('YYYY'))
        setselectedMonth(moment(from).format('MMMM'))
        setPeriod(moment(from).format('DD')+'-'+moment(to).format('DD'))

        var temp_date = moment(from).format('DD-MM-YYY');
        var total_regular_days = moment2(temp_date, 'DD-MM-YYYY').monthBusinessDays()
        setRegularDays(total_regular_days.length)
        
        var data = {
            from:moment(from).format('YYYY-MM-DD'),
            to:moment(to).format('YYYY-MM-DD'),
            emp_id:employeeInfo.id_no
        }
        /**
         * Set Days to DTR form
         */
         var year = moment(from).format('YYYY');
         // var month = selectedMonth.format('MM')-1;
         var month = moment().month(moment(from).format('MMMM')).format('MM')-1
         var date = new Date(year, month, 1);
         var days = [];
         while (date.getMonth() === month) {
             days.push(new Date(date));
             date.setDate(date.getDate() + 1);
         }
         
         setDays(days)

        
        setSelectedCurrentMonth(from)
        setMonthPeriod(moment(from).format('MMMM')+' '+moment(from).format('DD')+'-'+moment(to).format('DD') + ', '+moment(from).format('YYYY'))

        getDTR(data)
        .then(response=>{
            const result1 = response.data
            // console.log(result1.applied_days)
            setAlreadyAppliedRectification(result1.applied_days)
            var data2 = {
                from:moment(from).format('YYYY-MM-DD'),
                to:moment(to).format('YYYY-MM-DD'),
                emp_id:employeeInfo.id_no
            }
            getDTRAPI(data2)
            .then(respo=>{
                const result = respo.data
                if(result.code === '301'){
                    // setshowDTR(true)
                    Swal.fire({
                        icon:'error',
                        title:result.message
                    })
                }else{
                    var undertime=0;
                    var late=0;
                    result.response.forEach(element => {
                        late += parseInt(element.late_minutes)
                        undertime += parseInt(element.under_time)
                    });
                    var total_undertime = undertime;
                    if(total_undertime>=1){
                        var undertime_hours = (total_undertime / 60);
                        var undertime_rhours = Math.floor(undertime_hours);
                        var undertime_minutes = (undertime_hours - undertime_rhours) * 60;
                        var undertime_rminutes = Math.round(undertime_minutes);
                        settotalUndertimeHours(undertime_rhours)
                        settotalUndertimeMinutes(undertime_rminutes)
                    }else{
                        settotalUndertimeHours(0)
                        settotalUndertimeMinutes(0)
                    }

                    var total_late = late;
                    if(total_late>=1){
                        var late_hours = (total_late / 60);
                        var late_rhours = Math.floor(late_hours);
                        var late_minutes = (late_hours - late_rhours) * 60;
                        var late_rminutes = Math.round(late_minutes);

                        settotalLateHours(late_rhours)
                        settotalLateMinutes(late_rminutes)
                    }else{
                        settotalLateHours(0)
                        settotalLateMinutes(0)
                    }
                    setdtrdata(result.response)
                    // setdtrdata(tempdata)
                    // setshowDTR(true)
                    Swal.close()
                    
                }
            }).catch(err=>{
                Swal.close()
                console.log(err)
                toast.error(err.message)
            })
            
        }).catch(error=>{
            Swal.close()
            setshowDTR(false)
            toast.error(error.message)
        })

    }
    return(
        <>
        {isLoading
        ?
            <Box sx={{padding:'20px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'10px 0 10px 0'}}>
                            <Box sx={{display:'flex',flexDirection:'row'}}>
                            <Skeleton variant='text'  width={'100%'} height={'70px'} animation="wave"/>
                            </Box>
                        </Grid>
                    </Grid>
                <Grid container component={Paper} sx={{padding:'10px',marginTop:'-15px'}}>
                    <Grid item xs={12}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Skeleton variant='text'  width={'270px'} height={'70px'} animation="wave" sx={{marginTop:'-15px'}}/>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                    <Skeleton variant='text'  height={'5px'} animation="wave"/>
                    </Grid>
                    <Grid item xs={12} sx={{marginTop:'20px',display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                        <Grid item xs = {12} sm={12} md={3} lg={3} sx={{marginTop:'-20px'}}>
                            <Skeleton variant='text'  height={'90px'} animation="wave"/>
                        </Grid>
                        <Grid item xs = {12} sm={12} md={3} lg={3} sx={{marginTop:'-20px'}}>
                            <Skeleton variant='text' height={'90px'} animation="wave"/>
                        </Grid>
                        <Grid item xs = {12} sm={12} md={3} lg={3} sx={{marginTop:'-20px'}}>
                            <Skeleton variant='text' height={'90px'} animation="wave"/>
                        </Grid>
                        <Grid item xs = {12} sm={12} md={2} lg={2} sx={{marginTop:'-20px'}}>
                            <Skeleton variant='text' height={'90px'} animation="wave"/>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                    <Skeleton variant='text'  height={'5px'} animation="wave"/>
                    </Grid>
                </Grid>
            </Box>
        :
        <Fade in={!isLoading}>
            <Box sx={{margin:'20px'}}>
            {/* <Alert severity="info"><ConstructionOutlinedIcon fontSize='small'/> This module is under development. Some functionality will be available soon. </Alert> */}
                <Box sx={{pointerEvents:underDevelopment?'none':'',opacity:underDevelopment?'0.4':'1'}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                                <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                    <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                                    {/* <StickyNote2 fontSize='large'/> */}
                                    &nbsp;
                                    Online Daily Time Record
                                </Typography>

                                </Box>
                            </Grid>
                    </Grid>
                        
                    <Grid container component={Paper} sx={{padding:'10px'}}>
                        
                        <Grid item xs={12}>
                        <hr/>
                        <Typography sx={{fontSize:'.7rem'}}><em>* Please select a <strong>Year</strong>, <strong>Month</strong>, and <strong>Period</strong> before clicking the <strong>"DISPLAY DTR"</strong> button</em></Typography>
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'20px',display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                            <Grid item xs = {12} sm={12} md={3} lg={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Year *</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedYear}
                                    label="Year"
                                    onChange={(value)=>setselectedYear(value.target.value)}
                                    >
                                    {yearArray.map((data,key)=>
                                        <MenuItem key ={key} value={data}>{data}</MenuItem>
                                    )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs = {12} sm={12} md={3} lg={3} sx={{marginTop:matches?'10px':'0'}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Month *</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedMonth}
                                    label="Month"
                                    onChange={(value) => setselectedMonth(value.target.value)}
                                    >
                                    {monthArray.map((data,key)=>
                                        <MenuItem key ={key} value={data}>{data}</MenuItem>
                                    )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs = {12} sm={12} md={3} lg={3} sx={{marginTop:matches?'10px':'0'}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Period *</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={period}
                                    label="Period"
                                    onChange={handleChangePeriod}
                                    >
                                    {daysPeriod.map((data,key)=>
                                        <MenuItem key ={key} value={data}>{data}</MenuItem>
                                    )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs = {12} sm={12} md={2} lg={2} sx={{marginTop:matches?'10px':'0'}}>
                                <Button fullWidth variant='outlined' sx={{height:'55px'}} onClick={displayDTR} startIcon={<ArticleIcon/>}>Display DTR</Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                        <hr/>
                        </Grid>
                        {
                            showDTR
                            ?
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Tooltip title='File Rectification Request'><Button variant='outlined' sx={{width:matches?'100%':'auto'}} onClick={()=>handleFileRetrification('period')} color='success'><AutoFixHighOutlinedIcon/></Button>
                                </Tooltip>
                                <ReactToPrint
                                trigger={() => <Tooltip title='Print DTR'><Button variant='outlined'><PrintIcon/></Button></Tooltip>}
                                content={() => printDTR.current}
                                documentTitle={selectedMonth.length !==0||selectedYear.length !==0?employeeInfo.lname+' DTR '+selectedMonth+' '+period+','+selectedYear:''}
                                />
                                
                            </Grid>
                            
                            :
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Tooltip title='File Rectification Request'><Button variant='outlined' sx={{width:matches?'100%':'auto'}} onClick={()=>handleFileRetrification('default')} color='success'><AutoFixHighOutlinedIcon/></Button>
                                </Tooltip>
                            </Grid>
                        }
                        
                        {showDTR
                        ?
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'center',marginTop:'20px'}}>
                            <Grid item xs={12} sm={12} md ={7} lg={7} sx={{background:'#fff',padding:'10px'}} className='custom-paper'>
                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                {/* <Tooltip title='Show Previous Month'><Button onClick = {()=>navigateMonth('prev')}><ChevronLeftOutlinedIcon/>Prev</Button></Tooltip>
                                <Tooltip title='Show Next Month'><Button onClick = {()=>navigateMonth('next')}>Next <ChevronRightOutlinedIcon/></Button></Tooltip> */}


                                </Box>
                                <div style={{width:'100%',overflow:matches?'scroll':'auto'}} id = 'dtr-form'>
                                <DTRForm  days = {days} dtrdata = {dtrdata} period={monthPeriod} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} alreadyAppliedRectification = {alreadyAppliedRectification} updateAppliedRectification = {updateAppliedRectification} regularDays = {regularDays} officeHead={officeHead}/>
                                </div>


                            </Grid>

                        </Grid>
                        :
                        ''
                        }
                        

                    </Grid>
                </Box>
                {showDTR
                    ?
                    <Grid container>
                        <div style={{display:'none'}}>
                        <div ref = {printDTR} style={{width:'100%',overflow:matches?'scroll':'auto'}} id = 'dtr-form'>
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',marginTop:'10px'}}>
                                <Grid item xs={6} sx={{margin:'10px'}}>
                                    <DTRFormPrint  days = {days} dtrdata = {dtrdata} period={selectedMonth.length !==0||selectedYear.length !==0?selectedMonth+' '+period+','+selectedYear:''} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} officeHead={officeHead} regularDays = {regularDays}/>
                                </Grid>
                                <Grid item xs={6} sx={{margin:'10px'}}>
                                    <DTRFormPrint  days = {days} dtrdata = {dtrdata} period={selectedMonth.length !==0||selectedYear.length !==0?selectedMonth+' '+period+','+selectedYear:''} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} officeHead={officeHead} regularDays = {regularDays}/>
                                </Grid>
                            </Grid>
                            
                        </div>
                        </div>  
                    </Grid>
                    :
                    ''
                }
                
                
            {/* <Modal
                open={open}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                
                <Box sx={style}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpen(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                DTR Rectification Request
            </Typography>
                    <Box sx={{p:4}}>
                    <DTRRectificationRequest handleClose = {handleClose} submitRectificationRequest = {submitRectificationRequest} pendingRectificationData = {pendingRectificationData} appliedDates = {appliedDates} cancelApplication = {cancelRectificationRequestApplication} refreshData={refreshData} year ={selectedYear} month={selectedMonth} period={period} showAllRectificationRequest = {showAllRectificationRequest} addModal = {addModal} closeAddModal={()=>setAddModal(false)} openAddModal = {()=>setAddModal(true)}/>
                    </Box>
                    
                    <Grid container>
                        <Grid item xs={12} sx={{p:2}}>
                            <Box>
                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                    <Button color='error' variant='contained' startIcon={<CloseIcon/>} onClick={handleClose} size='small'>Close</Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            </Modal> */}
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
                    DTR Rectification Request
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                    Close
                    </Button>
                </Toolbar>
                </AppBar>
                <Box sx={{maxHeight:'100%',overflowY:'scroll',p:2}}>
                    <DTRRectificationRequest handleClose = {handleClose} submitRectificationRequest = {submitRectificationRequest} pendingRectificationData = {pendingRectificationData} appliedDates = {appliedDates} cancelApplication = {cancelRectificationRequestApplication} refreshData={refreshData} year ={selectedYear} month={selectedMonth} period={period} showAllRectificationRequest = {showAllRectificationRequest} addModal = {addModal} closeAddModal={()=>setAddModal(false)} openAddModal = {()=>setAddModal(true)}/>
                    
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
            <ToastContainer/>
        </Box>
        </Fade>
        }
    </>
    );
}