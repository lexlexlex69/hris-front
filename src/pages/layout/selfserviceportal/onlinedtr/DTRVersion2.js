import { Container, Typography ,Box, Paper, Grid,InputLabel ,MenuItem ,FormControl,Button,Modal, Table, TableHead, TableRow, TableCell,Stack,Skeleton,Fade,Alert, Tooltip,TextField,Backdrop, Divider } from '@mui/material';
import React, { useEffect, useRef,useState } from 'react';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DatePicker from 'react-multi-date-picker';
import InputIcon from "react-multi-date-picker/components/input_icon"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getDTR,getEmployeeInfo,addRectificationRequest, getRectificationRequestData,cancelRectificationRequest,insertDTR, getRectificationRequestPeriod,getDTRAPI,getOfficeHeadName, getEmpDTR, getRequestedOBOFTRectification, getLogsAdjustmentAPI } from './DTRRequest';
import { auditLogs } from '../../auditlogs/Request';
import moment from 'moment';
import { blue, green, orange, red, yellow } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DTRForm from './DTRForm';
//icon
import CircularProgress from '@mui/material/CircularProgress';
import PrintIcon from '@mui/icons-material/Print';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import SaveIcon from '@mui/icons-material/Save';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import StickyNote2 from '@mui/icons-material/StickyNote2';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import SendIcon from '@mui/icons-material/Send';
import PostAddIcon from '@mui/icons-material/PostAdd';
import HelpIcon from '@mui/icons-material/Help';

import ReactToPrint,{useReactToPrint} from 'react-to-print';
import DTRFormPrint from './DTRFormPrint';
import Swal from 'sweetalert2';
import DTRRectificationRequest from './DTRRectificationRequest';
import { ToastContainer,toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import Slide from '@mui/material/Slide';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DTRInstruction from './Dialog/DTRInstruction';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { api_url2 } from '../../admin/payslip/PayslipRequest';
import Error1 from '../../../.././assets/img/network error 1.png';
import Error2 from '../../../.././assets/img/network error 2.png';
import { api_url } from '../../../../request/APIRequestURL';
import ReactPlayer from 'react-player';
import DTRError from '../../../../assets/video/dtr.mp4'
import RequestOBOFT from './Dialog/RequestOBOFT';
import OBOFTInstruction from './Carousel/OBOFTInstruction';
import RequestedOBOFT from './Modal/RequestedOBOFT';
import DTRLeaveSurvey from '../../survey/DTRLeaveSurvey';
import { formatDatePeriod } from '../../customstring/CustomString';
import Version2 from './Version/Version2';
import ActionButtons from './buttons/ActionButtons';
import LargeModal from '../../custommodal/LargeModal';
import FullModal from '../../custommodal/FullModal';
import { APILoading } from '../../apiresponse/APIResponse';
import Joyride from "react-joyride";
const steps = [
  {
    target: "#OB-OFT-ID",
    content: "To Apply OB-OFT. Click this button",
    disableBeacon: true,
  },
  {
    target: "#TIME-RECTIFICATION-ID",
    content: "To Apply Time Rectification, Click this button",
  },
]
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
export default function DTRVersion2(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = React.useState(true)
    const [pendingRectificationData,setPendingRectificationData] = React.useState([])
    const [appliedDates,setAppliedDates] = React.useState([])
    const [underDevelopment,setUnderDevelopment] = React.useState(false)
    const [officeHead,setOfficeHead] = useState('')
    const [addModal,setAddModal] = useState(false)
    const [dtrInfoDialog,setDtrInfoDialog] = useState(false)
    const tutorialStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':'auto',
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
    
    const [requestedOBOFTData,setRequestedOBOFTData] = useState([])
    const [adjustmentLogsData,setAdjustmentLogsData] = React.useState([])

    useEffect(()=>{
        var logs = {
            action:'ACCESS DTR',
            action_dtl:'ACCESS DTR MODULE',
            module:'DTR'
        }
        console.log('logss',logs)
        auditLogs(logs)
        
        var currYear = moment(year).format('YYYY')
        setselectedYear(currYear)
        getEmployeeInfo()
        .then(response=>{
            const data = response.data
            setEmployeeInfo(data.info)
            setSignatory(data.signatory)
            setOfficeHead(data.office_assign_info)

            setIsLoading(false)

            // if(data.involved_survey){
            //     setOpenSurvey(true)
            // }else{
            // }
            // getOfficeHeadName(data.info.id)
            // .then(res=>{
            //     const r = res.data
            //     // console.log(r)
            //     setOfficeHead(r)
            // }).catch(err=>{
            //     console.log(err)
            // })

        }).catch(error=>{
            console.log(error)
        })
        getRequestedOBOFTRectification()
        .then(res=>{
            setRequestedOBOFTData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        var t_data = {
            api_url:api_url+'/getAdjType/b9e1f8a0553623f1:639a3e:17f68ea536b'
        }
        getLogsAdjustmentAPI(t_data)
        .then(response=>{
            if(response.data.response){
                const data = response.data.response
                var new_data = [];
                data.forEach(el=>{
                    new_data.push({
                        'label':el.atype_desc,
                        'atype_code':el.atype_code,
                        'atype_desc':el.atype_desc,
                        // 'type_code':el.type_code
                    })
                })
                var duplicate = Object.values(data.reduce((c, v) => {
                    let k = v.atype_code;
                    c[k] = c[k] || [];
                    c[k].push(v);
                    return c;
                }, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
                setAdjustmentLogsData(new_data)
                // setLoadingAdjst(false)
            }else{
                toast.error("Can't connect to server")
            }
            
        }).catch(error=>{
            console.log(error)
        })

    },[])
    // media query
    const printDTR = useRef();
    
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
    const [isRequestAllLoading,setIsRequestAllLoading] = useState(false)
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
    const [selectedCurrentMonth,setSelectedCurrentMonth] = useState('');
    const [isLoadingRectificationData,setIsLoadingRectificationData] = useState(false)
    const handleFileRetrification = async(type) => {
        setIsLoadingRectificationData(true)
        if(type === 'default'){
            if(flexiFromDate.length !== 0  && flexiToDate.length !== 0){
                var data2 = {
                    is_displayed:true,
                    from:flexiFromDate,
                    to:flexiToDate,
                }
                await getRectificationRequestPeriod(data2)
                .then(response=>{
                    const data = response.data
                    setPeriod(moment(flexiFromDate,'YYYY-MM-DD').format('MMMM DD')+'-'+moment(flexiToDate,'YYYY-MM-DD').format('MMMM DD, YYYY'))
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
                from:flexiFromDate,
                to:flexiToDate,
            }
            getRectificationRequestPeriod(data2)
            .then(response=>{
                const data = response.data
                setPeriod(moment(flexiFromDate,'YYYY-MM-DD').format('MMMM DD')+'-'+moment(flexiToDate,'YYYY-MM-DD').format('DD, YYYY'))
                setPendingRectificationData(data)
                setIsLoadingRectificationData(false)
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
    const [isFlexDate,setIsFlexDate] = useState(false)
    const [flexiFromDate,setFlexiFromDate] = useState('')
    const [flexiToDate,setFlexiToDate] = useState('');
    const [rawLogs,setRawLogs] = useState([]);
    const [officeHeadPos,setOfficeHeadPos] = useState({
        head_name:null,
        head_pos:null
    });
    const [loadingData,setLoadingData] = useState(false)

    const displayDTR = (data) =>{
        var flexiFromDate = data.from
        var flexiToDate = data.to

        // if(data.isCustom){
        //     var flexiToDate = data.from
        //     var flexiFromDate = data.to
        // }else{

        // }
        // event.preventDefault()
        setFlexiFromDate(data.from)
        setFlexiToDate(data.to)
        if(moment(flexiToDate).format('MM-DD-YYYY') < moment(flexiFromDate).format('MM-DD-YYYY')){
            toast.warning('From Date value should be less than To Date',{
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                })
        }
        else{
            // Swal.fire({
            //     icon:'info',
            //     title:'Retrieving DTR',
            //     html:'Please wait...',
            //     allowEscapeKey:false,
            //     allowOutsideClick:false      
            // })
            // Swal.showLoading()
            var data2 = {
                from:flexiFromDate,
                to:flexiToDate,
                emp_id:employeeInfo.id_no,
                api_url:api_url
            }
            setLoadingData(true)
            var total_weekdays = moment(flexiToDate).businessDiff(moment(flexiFromDate));
            setRegularDays(total_weekdays)
    
            getDTR(data2)
            .then(response=>{
                const result1 = response.data
                var days = [];
                setAlreadyAppliedRectification(result1.applied_days)
                
                getEmpDTR(data2)
                .then(respo=>{
                    if(respo.data.data){
                        const result = respo.data.data
                        if(result.code === '301'){
                            setshowDTR(false)
                            // toast.error(`${result.message}. Please visit HR office to process your DTR`)
                            Swal.fire({
                                icon:'error',
                                title:result.message,
                                html:'Please visit HR office to process your DTR'
                            })
                        }else{
                            var undertime=0;
                            var late=0;
                            var work_hours;
                            var work_sched;
                            setOfficeHeadPos(result.signatory?.head_name?result.signatory:signatory)
                            if(result.work_dtl.work_hrs.length ===0){
                                work_hours = ['8am-5pm']
                                }else{
                                    work_hours = result.work_dtl.work_hrs
                                }
                                if(result.work_dtl.work_sched ===''){
                                    work_sched = 'Monday-Friday'
                                }else{
                                    /**
                                    Manipulate days
                                    */
                                    /**
                                    Store to array
                                    */
                                    var t_arr_sched = result.work_dtl.work_sched.split(';')
                                    /**
                                    Identify first the day of first day of the month
                                    */
                                    var t_range = moment(moment(flexiFromDate).startOf('day')).day();
                                    t_arr_sched.splice(0,6);
                                    /**
                                    Loop month date to get schedule days , zero value means restdays
                                    */
                                    var t_start_date = new Date(flexiFromDate)
                                    var t_end_date = new Date(flexiToDate)
                                    var t_date_index =0;
                                    var t_date_days = [];
                                    while(t_start_date<=t_end_date){
                                        if(parseInt(t_arr_sched[t_date_index]) !== 0 && t_arr_sched[t_date_index]){
                                            t_date_days.push(moment(t_start_date).format('ddd'));
                                        }
                                        // console.log(moment(t_start_date).format('MM-DD-YYYY'))
                                        t_start_date.setDate(t_start_date.getDate()+1)
                                        t_date_index++
                                    }
                                    const unique_days = t_date_days.filter((item, index) =>
                                        t_date_days.indexOf(item) === index
                                    );
                                }
                                result.data.response.forEach(element => {
                                    late += parseInt(element.late_minutes)
                                    undertime += parseInt(element.under_time)
                                    // if(parseInt(element.day_type) === 0){
                                    //     reg_days++;
                                    // }
                                    // if(parseInt(element.leave_day) === 1){
                                    //     /**
                                    //     Check if saturday or sunday
                                    //      */
                                    //     if(moment(element.work_date).format('dddd').toUpperCase() !== 'SATURDAY' && moment(element.work_date).format('dddd').toUpperCase() !== 'SUNDAY'){
                                    //         reg_days++;
                                    //     console.log(element.work_date)

                                    //     }
                                    // }
                                    // if(moment(element.work_date).format('dddd').toUpperCase() === 'SATURDAY'){
                                    //     sat_days++;
                                    // }
                                    /**
                                    get all sched
                                    */

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
                                setdtrdata(result.data.response)
                                setRawLogs(result.raw_logs.logs)
                                setPeriod(formatDatePeriod(flexiFromDate,flexiToDate))
                                // setPeriod(moment(flexiFromDate).format('MMMM DD')+' - '+moment(flexiToDate).format(' DD, YYYY'))
                                // setPeriod(moment(flexiFromDate).format('MMMM DD')+' - '+moment(flexiToDate).format('MMMM DD, YYYY'))
            
                                setshowDTR(true)
                                Swal.close()
                                
                            }
                    }else{
                        toast.error("Can't connect to server")
                        setLoadingData(false)
                    }
                    
                    setLoadingData(false)
                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                    toast.error(err.message)
                    // window.open(api_url2)
                    // window.open(api_url)
                    setLoadingData(false)


                })
                
            }).catch(error=>{
                Swal.close()
                setshowDTR(false)
                toast.error(error.message)
                setLoadingData(false)

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
    const reactToPrintDTR = useReactToPrint({
        onBeforePrint: ()=> APILoading('info','Loading DTR for Printing','Please wait...'),
        content: () => printDTR.current,
        documentTitle:selectedMonth.length !==0||selectedYear.length !==0?employeeInfo.lname+' DTR '+selectedMonth+' '+period+','+selectedYear:'',
        onAfterPrint: ()=> Swal.close()
    })
   
    const beforePrint = () =>{
        // APILoading('info','Loading DTR for Printing','Please wait...')
        var logs = {
            action:'PRINT DTR',
            action_dtl:'FROM = '+flexiFromDate+' | TO = '+flexiToDate,
            module:'DTR'
        }
        auditLogs(logs)
        reactToPrintDTR()
    }
    const [openTutorial,setOpenTutorial] = useState(false)
    const [openOBOFT,setOpenOBOFT] = useState(false);
    const handleOpenOBOFT = () =>{
        setOpenOBOFT(true)
    }
    const handleCloseOBOFT = () =>{
        setOpenOBOFT(false)
    }
    const [openInstruction,setOpenInstruction] = useState(false)
    const [openRequestedOBOFTModal,setOpenRequestedOBOFTModal] = useState(false)
    const handleCloseSurvey = () => {
        // setOpenSurvey(false)
        setIsLoading(false)
        
    }
    return(
        <>
        
        {isLoading
        ?
            <Box sx={{padding:'5px 10px 10px 10pxx'}}>
                <Grid container spacing={2}>
                    {/* <Grid item xs={12} sx={{m:1}}>
                        <Skeleton variant='rounded' height={50} animation='wave'/>
                    </Grid> */}
                    <Grid item xs={12}>
                    <Paper sx={{p:1}}>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1,mb:1}}>
                            <Skeleton variant='rounded' sx={{borderRadius:'20px'}} height={45} width={100} animation='wave'/>
                            <Skeleton variant='rounded' sx={{borderRadius:'20px'}} height={45} width={100} animation='wave'/>
                            {/* <Skeleton variant='rounded' sx={{borderRadius:'20px'}} height={45} width={100} animation='wave'/> */}
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'center',gap:1}}>
                            <Skeleton variant='rounded' height={45} width={200} animation='wave'/>
                            <Skeleton variant='rounded' height={45} width={200} animation='wave'/>
                            <Skeleton variant='rounded' height={45} width={200} animation='wave'/>
                            <Skeleton variant='rounded' height={45} width={200} animation='wave'/>
                        </Grid>
                        <Grid item xs={12} sx={{mt:3,mb:3}}>
                            <Divider/>
                        </Grid>
                        {/* <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                            <Skeleton variant='rounded' sx={{borderRadius:'20px'}} height={45} width={100} animation='wave'/>
                            <Skeleton variant='rounded' sx={{borderRadius:'20px'}} height={45} width={100} animation='wave'/>
                            <Skeleton variant='rounded' sx={{borderRadius:'20px'}} height={45} width={100} animation='wave'/>
                        </Grid> */}
                        {/* <Grid item container spacing={2}>
                            <Grid item xs={12}>
                                <Skeleton variant='rounded' height={3} animation='wave'/>
                            </Grid>
                            <Grid item xs={12}>
                                <Skeleton variant='text' height={10} animation='wave'/>
                            </Grid>
                            <Grid item xs={5}>
                                <Skeleton variant='rounded' height={45} animation='wave' sx={{borderRadius:'3px'}}/>
                            </Grid>
                            <Grid item xs={5}>
                                <Skeleton variant='rounded' height={45} animation='wave' sx={{borderRadius:'3px'}}/>
                            </Grid>
                            <Grid item xs={2}>
                                <Skeleton variant='rounded' height={45} animation='wave' sx={{borderRadius:'3px'}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Skeleton variant='rounded' height={3} animation='wave'/>
                            </Grid>
                            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                <Skeleton variant='rounded' height={45} width={70} animation='wave'sx={{borderRadius:'3px'}}/>
                            </Grid>
                        </Grid> */}
                    </Paper>
                    </Grid>
                    
                </Grid>
            </Box>
        :
        <Fade in>
            <Box sx={{margin:'0 10px 10px 10px'}}>
            {/* <Joyride
                steps={steps}
                continuous={true}
            /> */}
            {/* <Alert severity="info"><ConstructionOutlinedIcon fontSize='small'/> This module is under development. Some functionality will be available soon. </Alert> */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoadingRectificationData}
            >
                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <CircularProgress color="inherit" />
                <Typography sx={{textAlign:'center'}}>Loading rectification request data. <br/> Please wait...</Typography>
                </Box>
            </Backdrop>
                <Box sx={{pointerEvents:underDevelopment?'none':'',opacity:underDevelopment?'0.4':'1'}}>
                    <Grid container component={Paper} sx={{padding:'10px'}}>
                        <Grid item xs={12} sx={{display:'flex',gap:1,flexDirection:'row',justifyContent:matches?'center':'flex-end'}}>
                        {
                            matches
                            ?
                            <Box sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Tooltip title='File OB-OFT Rectification'><IconButton color='primary' size='large' onClick={handleOpenOBOFT} className='custom-iconbutton'><PostAddIcon/></IconButton></Tooltip>
                            {
                                showDTR
                                ?
                                <Box sx={{display:'flex',gap:1}}>
                                <Tooltip title='File Rectification Request'><IconButton sx={{'&:hover':{color:'#fff',background:green[800]}}} size='large' onClick={()=>handleFileRetrification('period')} color='success' className='custom-iconbutton'><AutoFixHighOutlinedIcon/></IconButton>
                                </Tooltip>
                                <Tooltip title='Print DTR'><IconButton size='large' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick = {beforePrint} className='custom-iconbutton' color='primary'><PrintIcon/></IconButton></Tooltip>
                                </Box>
                                
                            :
                                <Box sx={{display:'flex',gap:1}}>
                                <Tooltip title='File Time Rectification Request'><IconButton onClick={()=>handleFileRetrification('default')} size='large' sx={{'&:hover':{color:'#fff',background:green[800]}}} color='success' className='custom-iconbutton'><AutoFixHighOutlinedIcon/></IconButton>
                                </Tooltip>
                                </Box>
                            }
                            </Box>
                            
                            :
                            <Box sx={{display:'flex',flexDirection:'row',gap:1}}>
                            <Tooltip title='File OB-OFT Rectification'><Button variant='contained' color='secondary' id= 'OB-OFT-ID' startIcon={<PostAddIcon/>} onClick={handleOpenOBOFT} className='custom-roundbutton' size='large'>OB/OFT</Button></Tooltip>
                            {
                                showDTR
                                ?
                                <Box sx={{display:'flex',gap:1}}>
                                <Tooltip title='File Time Rectification Request'><Button variant ='contained' onClick={()=>handleFileRetrification('period')} color='primary' startIcon={<AutoFixHighOutlinedIcon/>}  className='custom-roundbutton'>Rectification</Button>
                                </Tooltip>
                                <Tooltip title='Print DTR'><Button variant='contained' onClick = {beforePrint} color='info' startIcon={<PrintIcon/>}  className='custom-roundbutton'>Print DTR</Button></Tooltip>
                                </Box>
                                
                            :
                                <Tooltip title='File Rectification Request'><Button variant ='contained' id='TIME-RECTIFICATION-ID' onClick={()=>handleFileRetrification('default')} color='primary' startIcon={<AutoFixHighOutlinedIcon/>}  className='custom-roundbutton'>Time Rectification</Button>
                                </Tooltip>
                            }
                            </Box>

                        }
                        </Grid>
                        
                        
                        <Grid item xs={12} sx={{m:matches?0:2}}>
                            <Version2 displayDTR = {displayDTR} loadingData={loadingData}/>
                        </Grid>
                        {showDTR
                        ?
                        <Grid item xs={12} sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'center'}}>
                            <Grid item sx={{display:'flex',flexDirection:matches?'column':'row',justifyItems:'center',marginTop:'20px',width:matches?'100%':'80%'}}>
                                <Grid item xs={12} sm={12} md ={6} lg={6} sx={{background:'#fff'}}>
                                    <div style={{width:matches?'100%':'99%',overflow:matches?'scroll':'auto',p:1}} id = 'dtr-form' className='custom-paper'>
                                    <DTRForm  days = {days} dtrdata = {dtrdata} rawLogs={rawLogs} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification = {setAlreadyAppliedRectification}updateAppliedRectification = {updateAppliedRectification} regularDays = {regularDays} officeHead={officeHeadPos} adjustmentLogsData = {adjustmentLogsData}/>
                                    
                                    </div>

                                </Grid>
                                <Grid item xs={12} sm={12} md ={6} lg={6} sx={{background:'#fff',display:matches?'none':'auto'}} >
                                    <div style={{width:'99%',overflow:matches?'scroll':'auto'}} id = 'dtr-form' className='custom-paper'>
                                    <DTRForm  days = {days} dtrdata = {dtrdata} rawLogs={rawLogs} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} alreadyAppliedRectification = {alreadyAppliedRectification} setAlreadyAppliedRectification = {setAlreadyAppliedRectification}updateAppliedRectification = {updateAppliedRectification} regularDays = {regularDays} officeHead={officeHeadPos} adjustmentLogsData = {adjustmentLogsData}/>
                                    </div>
                                </Grid>

                            </Grid>
                        </Grid>
                        :
                        ''
                        }
                        {/* <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#e5f6fd'}}>
                        <Alert severity="info" sx={{fontSize:'.7rem'}}><em>* Please select <strong>From Date</strong> and <strong>To Date</strong> before clicking the <strong>"DISPLAY DTR"</strong> button</em></Alert>
                        <Typography sx={{fontSize:'.9rem',mr:1}}>Network Error ? <a href='#' onClick={()=>setOpenTutorial(true)}>click here </a></Typography>
                        </Grid>
                    
                        <form onSubmit={displayDTR} style ={{width:'100%'}}>
                            <Grid item xs={12} sx={{marginTop:'20px',display:'flex',gap:1,flexDirection:matches?'column':'row'}}>
                                <Grid item lg={5} md={5} sm = {12} xs={12}>
                                <TextField type='date' label='From' InputLabelProps={{shrink:true}} required value = {flexiFromDate} onChange = {(value)=>setFlexiFromDate(value.target.value)} fullWidth/>
                                </Grid>
                                <Grid item lg={5} md={5} sm = {12} xs={12}>
                                <TextField fullWidth sx={{marginTop:matches?'10px':'0'}} type='date' label='To' InputLabelProps={{shrink:true}} required value = {flexiToDate} onChange = {(value)=>setFlexiToDate(value.target.value)}/>
                                </Grid>
                                <Grid item lg={2} md={2} sm = {12} xs={12}>
                                <Button fullWidth sx={{marginTop:matches?'10px':'0',height:'55px','&:hover':{color:'#fff',background:blue[800]}}} variant='contained' type='submit' endIcon={<SendIcon/>}>View DTR</Button>
                                </Grid>
                            </Grid>
                        </form> */}

                        <Grid item xs={12}>
                        <Modal
                            open={openTutorial}
                            // onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            
                            <Box sx={tutorialStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenTutorial(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Encounter Network Error
                        </Typography>
                                <Box sx={{p:matches?0:4}}>
                                    <ReactPlayer url={DTRError} controls={true} width={matches?'100%':'auto'}/>
                                </Box>
                            </Box>
                        </Modal>
                        <hr/>
                        </Grid>
                        
                        

                    </Grid>
                </Box>
                {showDTR
                    ?
                    <Grid container>
                        <div style={{display:'none'}}>
                        <div ref = {printDTR} style={{width:'100%',overflow:matches?'scroll':'auto'}} id = 'dtr-form'>
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',margin:'20px'}}>
                                <Grid item xs={6} sx={{margin:'0 10px'}}>
                                    <DTRFormPrint  days = {days} dtrdata = {dtrdata} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} officeHead={officeHeadPos} regularDays = {regularDays}/>
                                </Grid>
                                <Grid item xs={6} sx={{margin:'0 10px'}}>
                                    <DTRFormPrint  days = {days} dtrdata = {dtrdata} period={period} info = {employeeInfo} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes} officeHead={officeHeadPos} regularDays = {regularDays}/>
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
            {/* <ToastContainer/> */}

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
                open={dtrInfoDialog}
                onClose={()=>setDtrInfoDialog(false)}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={()=>setDtrInfoDialog(false)}
                    aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    How to use Online DTR
                    </Typography>
                    <Button autoFocus color="inherit" onClick={()=>setDtrInfoDialog(false)}>
                    Close
                    </Button>
                </Toolbar>
                </AppBar>
                <DTRInstruction/>
            </Dialog>
            
            {/* Footer */}

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
            <FullModal open = {openRequestedOBOFTModal} close={()=>setOpenRequestedOBOFTModal(false)} title='List of Requested OB-OFT'>
                <Box>
                    <RequestedOBOFT data = {requestedOBOFTData} setData = {setRequestedOBOFTData}/>
                </Box>
            </FullModal>
            {/* <Modal
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
            </Modal> */}

            

            {/* <Box id='dtr-footer'>
                <div className='wave-container'>
                
                </div>
            </Box> */}
        </Box>
        </Fade>
        }
        
    </>
    );
}