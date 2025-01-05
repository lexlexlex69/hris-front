import React,{useEffect, useRef, useState} from 'react';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { Box, Fade, Grid, Typography,IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Paper } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { addCOCApplication, deleteCOCApplication, getBalance, getEmpCOCLedger, getOvertimeDetails, getSignatory } from './EarnCOCRequest';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
//icons
import AddIcon from '@mui/icons-material/Add';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import ReactToPrint,{useReactToPrint} from 'react-to-print';

import moment from 'moment';
import ApplicableData from './Dialog/ApplicableCOC';
import Swal from 'sweetalert2';
import { PrintFormCOC } from './PrintFormCOC';
import { PrintFormHistory } from './PrintFormHistory';
import {blue,green, red} from '@mui/material/colors';
import { getEmpInfo } from '../../selfserviceportal/payslip/PayslipRequest';
import { styled } from '@mui/material/styles';
import { convertTo64 } from '../../selfserviceportal/onlinedtr/convertfile/ConvertFile';
import { formatExtName, truncateToDecimalsCOC } from '../../customstring/CustomString';
import { auditLogs } from '../../auditlogs/Request';
import PrintFormCOC2 from './PrintFormCOC2';
import { PrintFormCOC2History } from './PrintFormCOC2History';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Input = styled('input')({
    display: 'none',
});
export default function EarnCOC(){

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()
    const [isLoading,setisLoading] = React.useState(true)
    const [balance,setBalance] = useState();
    const [applicableData,setApplicableData] = useState([]);
    const [appliedData,setAppliedData] = useState([])
    const [open, setOpen] = React.useState(false);
    const [openFileCOC, setOpenFileCOC] = React.useState(false);
    const [cocEarned, setCocEarned] = useState(0);
    const [weekDaysEarnedWpayData,setWeekDaysEarnedWpayData] = useState([]);
    const [weekDaysEarnedCOCData,setWeekDaysEarnedCOCData] = useState([]);
    const [weekEndsEarnedWpayData,setWeekEndsEarnedWpayData] = useState([]);
    const [weekEndsEarnedCOCData,setWeekEndsEarnedCOCData] = useState([]);
    const [holidaysEarnedCOCData,setHolidaysEarnedCOCData] = useState([]);
    const [totalWeekDaysWpay,setTotalWeekDaysWpay] = useState(0);
    const [totalWeekDaysCOC,setTotalWeekDaysCOC] = useState(0);
    const [totalHolidaysCOC,setTotalHolidaysCOC] = useState(0);
    const [totalWeekEndsWpay,setTotalWeekEndsWpay] = useState(0);
    const [totalWeekEndsCOC,setTotalWeekEndsCOC] = useState(0);
    const [empStatus,setEmpStatus] = useState('');
    const [earnedInfo,setEarnedInfo] = useState({
        'beginning_balance':'',
        'month_name':'',
        'year':'',
        'remaining_coc':'',
        'date_of_cto':'',
        'earned':'',
        'period':'',
        'used_coc':''
    })
    const [employeeInfo,setEmployeeInfo] = useState({
            data:{
                name:'',
                fname:'',
                mname:'',
                lname:'',
                extname:'',
                position_name:'',
                month_name:'',
                year:'',
                expiration:''
            },
            ledger:[],
            balance:0
        })
    const [employeeInfoPrint,setEmployeeInfoPrint] = useState({
        data:{
            name:'',
            fname:'',
            mname:'',
            lname:'',
            extname:'',
            position_name:'',
            month_name:'',
            year:'',
            expiration:''
        },
        ledger:[],
        balance:0
    })
    const [alreadyApplied,setAlreadyApplied] = useState(false)
    const [deptHeadInfo,setDeptInfo] = useState({
        head_name:'',
        head_pos:''
    })
    const [updatedLedgerData,setUpdatedLedgerData] = useState([]);
    // const [currDate,setCurrDate] = useState(moment(new Date()).subtract(1,'months'))
    const [currDate,setCurrDate] = useState('')
    const [deptName,setDeptName] = useState('')
    useEffect(()=>{
         /**
        get previous month data
        */
        var prev_month = moment(new Date()).subtract(2,'months').date(1);
        // console.log(moment().month('JULY').format('MMMM DD,YYYY'))
        
        checkPermission(56)
        .then((response)=>{
            // console.log(response.data)
            if(response.data){
                var logs = {
                    action:'ACCESS EARN COC MODULE',
                    action_dtl:'ACCESS EARN COC MODULE',
                    module:'EARN COC'
                }
                auditLogs(logs)
                getBalance()
                .then(res=>{
                    // console.log(res.data)
                    setBalance(res.data.total_coc)
                    if(res.data.has_manual){
                        var temp_currDate = moment().month(res.data.month)
                        setCurrDate(temp_currDate)

                        var month = moment(temp_currDate).format('MMMM');
                        var year = moment(temp_currDate).format('YYYY');
                    }else{
                    
                        var temp_currDate = moment(new Date()).subtract(1,'months')
                        setCurrDate(temp_currDate)

                        var month = moment(temp_currDate).format('MMMM');
                        var year = moment(temp_currDate).format('YYYY');
                    }
                    var t_data = {
                        month:month,
                        year:year
                    }
                    return getOvertimeDetails(t_data);
                })
                .then(res=>{
                    console.log(res.data)
                    setUpdatedLedgerData(res.data.ledger);
                    setAppliedData(res.data.applied);
                    var month = res.data.month;
                    var year = res.data.year;
                    /**
                     * 
                     Check if already applied
                     */
                    var t_applied = res.data.applied.filter((el)=>{
                        return el.month_name === month.toUpperCase() && parseInt(el.year) === parseInt(year) && el.status === 'FOR REVIEW'
                    })
                    console.log(t_applied)
                    if(t_applied.length >0){
                        setAlreadyApplied(true)
                        setisLoading(false)

                    }else{
                        var t_new_data = res.data.details.filter((el)=>{
                            return el.months_name.includes(month) && el.year.includes(year)
                        })
                        console.log(t_new_data)
                        var t_date_period = [];

                        if(t_new_data.length >0){
                            /**
                            get date period
                            */
                            JSON.parse(t_new_data[0].date_period).forEach(el=>{
                                if(moment(el).format('MMMM') === month && moment(el).format('YYYY')){
                                    t_date_period.push(el)
                                }
                            })
                            var t_final_data = [{
                                overtime_id:res.data.details[0].overtime_id,
                                file_id:res.data.details[0].file_id,
                                month:month,
                                year:year,
                                weekdays_from:res.data.details[0].weekdays_from,
                                weekdays_to:res.data.details[0].weekdays_to,
                                weekends_from:res.data.details[0].weekends_from,
                                weekends_to:res.data.details[0].weekends_to,
                                holidays_from:res.data.details[0].holidays_from,
                                holidays_to:res.data.details[0].holidays_to,

                                weekdays_max_ot:res.data.details[0].weekdays_max_ot,
                                weekends_max_ot:res.data.details[0].weekends_max_ot,
                                date_period:t_date_period,
                                employee_id:res.data.details[0].emp_no,
                                emp_no:res.data.details[0].empno,
                                period_type:res.data.details[0].period_type,
                                period_date_text:res.data.details[0].period_date_text,

                                weekdays_wpay_cfactor:res.data.details[0].weekdays_wpay_cfactor,
                                weekdays_coc_cfactor:res.data.details[0].weekdays_coc_cfactor,
                                weekends_wpay_cfactor:res.data.details[0].weekends_wpay_cfactor,
                                weekends_coc_cfactor:res.data.details[0].weekends_coc_cfactor,

                            }]
                            setApplicableData(t_final_data);
                            console.log(t_final_data)
                            setisLoading(false)

                        }else{
                            Swal.fire({
                                icon:'error',
                                title:'You have no overtime schedule last month'
                            })
                            setisLoading(false)
                        }
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
                getEmpInfo()
                .then(res=>{
                    console.log(res.data)
                    setDeptName(res.data[0].dept_title)
                    setEmpStatus(res.data[0].emp_status)
                    return getSignatory(res.data[0].emp_no)
                }).then(res=>{
                    console.log(res.data)
                    setDeptInfo(res.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            }else{
                navigate('/')
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const handleClickOpen = () => {
        console.log(applicableData)
        if(alreadyApplied){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Already submitted COC application.'
            })
        }else{
            if(applicableData.length >0){
                setOpen(true);
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'No available COC can be earned. Please make sure you have overtime from previous month '
                })
            }
        }
        
    };
    const handleClickOpenFileCOC = ()=>{
        var t_data = {
            month_name:moment(currDate).format('MMMM'),
            year:moment(currDate).format('MMMM'),
        }
        getEmpCOCLedger(t_data)
        .then(res=>{
            console.log(res.data)
            // setEmployeeInfoPrint(res.data)
            if(res.data.status === 200){
                var remaining_coc;
                var t_data = [];
                
                
                // if(res.data.ledger2.length !==0){
                //     remaining_coc = (parseFloat(res.data.balance)+parseFloat(cocEarned)).toFixed(2);
                // }else{
                //     remaining_coc = cocEarned.toFixed(2);
                // }
                if(res.data.ledger.length>0){
                    var temp  = {
                        beginning_balance:'',
                        month_name:moment(currDate).subtract(1,'months').format('MMMM'),
                        year:moment(updatedLedgerData[0].date).format('YYYY'),
                        remaining_coc:updatedLedgerData[0].balance,
                        date_of_cto:'',
                        earned:'',
                        period:'',
                        used_coc:''
                    }
                }else{
                    var temp = {};
                }
                
                setEarnedInfo(temp)
                var t_data = {...employeeInfo}
                t_data.data = {
                    name:res.data.data.fname+' '+(res.data.data.mname?res.data.data.mname.charAt(0)+'. ':' ')+res.data.data.lname+' '+res.data.data.extname,
                    fname:res.data.data.fname,
                    mname:res.data.data.mname,
                    lname:res.data.data.lname,
                    extname:res.data.data.extname,
                    position_name:res.data.data.position_name,
                    month_name:'',
                    year:'',
                    expiration:'',
                    dept_head_name:res.data.data.head_name,
                    dept_head_pos:res.data.data.head_pos,
                    date_earned:res.data.data.created_at,
                    dept:res.data.data.dept_title
                }
                t_data.ledger = res.data.ledger
                t_data.balance = res.data.balance
                setEmployeeInfo(t_data)
                setOpenFileCOC(true)
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
            
        }).catch(err=>{
            console.log(err)
            Swal.close()
        })
        
    }
    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseFileCOC = () => {
        setOpenFileCOC(false);
    };
    
    const handleSubmitApplication = ()=>{
        if(cocEarned<=0){
            Swal.fire({
                icon:'error',
                title:'Oops...',
                html:'Please earned first COC !'
            })
        }else{
            if(multipleFileUpload.length === 0){
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:'Please upload requirements to earn COC !'
                })
            }else{
                console.log(updatedLedgerData)
                let t_ledger = [];
                if(updatedLedgerData.length>0){
                    t_ledger.push({
                        beginning_balance:'',
                        month_name:moment(currDate).subtract(1,'months').format('MMMM').toUpperCase(),
                        year:moment(currDate).format('YYYY'),
                        remaining_coc:truncateToDecimalsCOC(updatedLedgerData[0].balance),
                        date_of_cto:'',
                        earned:'',
                        period:'',
                        used_coc:''
                    },{
                        beginning_balance:truncateToDecimalsCOC(cocEarned),
                        month_name:moment(currDate).format('MMMM').toUpperCase(),
                        year:moment(currDate).format('YYYY'),
                        remaining_coc:truncateToDecimalsCOC(updatedLedgerData[0].balance+cocEarned),
                        date_of_cto:'',
                        earned:truncateToDecimalsCOC(cocEarned),
                        period:'',
                        used_coc:''
                    }             )
                }else{
                    t_ledger.push({
                        beginning_balance:'',
                        month_name:moment(currDate).format('MMMM'),
                        year:moment(currDate).add(1,'years').format('YYYY'),
                        remaining_coc:cocEarned.toFixed(3),
                        date_of_cto:'',
                        earned:truncateToDecimalsCOC(cocEarned),
                        period:'',
                        used_coc:''
                    })
                }
                
                // employeeInfo.ledger.forEach(el=>{
                //     t_ledger.push({
                //         beginning_balance:el.beginning_balance,
                //         month_name:el.month_name,
                //         year:el.year,
                //         remaining_coc:el.remaining_coc,
                //         date_of_cto:el.date_of_cto,
                //         earned:el.earned,
                //         period:el.period,
                //         used_coc:el.used_coc
                //     })
                // })
                /**
                Push to earned data
                */
                // t_ledger.push(earnedInfo)
                var date_exp = empStatus === 'RE' || empStatus === 'CS' ? moment(currDate).add(1,'months').add(1,'years').date(0).format('YYYY-MM-DD'):moment(employeeInfo.data.date).add(6,'months').date(0).format('YYYY-MM-DD')
                var t_data = {
                    name:employeeInfo.data.fname+' '+(employeeInfo.data.mname?employeeInfo.data.mname.charAt(0)+'. ':' ')+employeeInfo.data.lname+' '+(formatExtName(employeeInfo.data.extname)),
                    earned:truncateToDecimalsCOC(cocEarned),
                    position_name:employeeInfo.data.position_name,
                    data:t_ledger,
                    month_name:(moment(currDate).format('MMMM')).toUpperCase(),
                    year:moment(currDate).format('YYYY'),
                    expiration:date_exp,
                    overtime_id:applicableData[0].overtime_id,
                    file_id:applicableData[0].file_id,
                    dept_head_name:deptHeadInfo.head_name,
                    dept_head_pos:deptHeadInfo.head_pos,
                    file_ids:multipleFileUpload,
                    weekdays_wpay:weekDaysEarnedWpayData,
                    weekdays_coc:weekDaysEarnedCOCData,
                    weekends_coc:weekEndsEarnedWpayData,
                    weekends_coc:weekEndsEarnedCOCData,
                    total_weekdays_wpay:truncateToDecimalsCOC(totalWeekDaysWpay),
                    total_weekdays_coc:truncateToDecimalsCOC(totalWeekDaysCOC),
                    total_weekends_wpay:truncateToDecimalsCOC(totalWeekEndsWpay),
                    total_weekends_coc:truncateToDecimalsCOC(totalWeekEndsCOC),
                    total_holidays_coc:truncateToDecimalsCOC(totalHolidaysCOC),
                    earning_details:{
                        weekdays_wpay:weekDaysEarnedWpayData,
                        weekdays_coc:weekDaysEarnedCOCData,
                        weekends_wpay:weekEndsEarnedWpayData,
                        weekends_coc:weekEndsEarnedCOCData,
                        holidays_coc:holidaysEarnedCOCData,
                        total_weekdays_wpay:truncateToDecimalsCOC(totalWeekDaysWpay),
                        total_weekdays_coc:truncateToDecimalsCOC(totalWeekDaysCOC),
                        total_weekends_wpay:truncateToDecimalsCOC(totalWeekEndsWpay),
                        total_weekends_coc:truncateToDecimalsCOC(totalWeekEndsCOC),
                        total_holidays_coc:truncateToDecimalsCOC(totalHolidaysCOC),
                    }
                }
                // console.log(employeeInfo)
                console.log(t_data)
                
                Swal.fire({
                    icon:'info',
                    title:'Submitting COC application',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                addCOCApplication(t_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        var prev_month = moment(new Date()).subtract(1,'months').date(1);
                        var month = moment(prev_month).format('MMMM');
                        var year = moment(prev_month).format('YYYY');
                        Swal.fire({
                            icon:'success',
                            title:res.data.message
                        })
                        setAppliedData(res.data.data.applied);
                        setAlreadyApplied(true)
                        setOpenFileCOC(false);
                        setOpen(false);
                        setMultipleFileUpload([])
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                    Swal.close();
                })
            }
            
        }
        
    }
    
    const [dateEarned,setDateEarned] = useState('');
    const [hours,setHours] = useState('');
    const handlePrint = (row)=>{
        console.log(row)
        var temp = {...employeeInfoPrint}
        temp.ledger = JSON.parse(row.data)
        temp.data = {
            name:row.name,
            position_name:row.position_name,
            month_name:row.month_name,
            year:row.year,
            expiration:row.expiration,
            head_name:row.dept_head_name,
            head_pos:row.dept_head_pos,
            date_earned:row.created_at,

        }
        console.log(temp)
        setEmployeeInfoPrint(temp)
        setDateEarned(row.created_at)
        setHours(row.earned)
        var action_dtl = 'MONTH = '+row.month_name+' | YEAR = '+row.year+' | EARNED = '+row.earned
        var logs = {
            action:'PRINT COC CERTIFICATE',
            action_dtl:action_dtl,
            module:'EARN COC'
        }
        auditLogs(logs)
    }
    const printHistoryRef = useRef();
    useEffect(()=>{
        if(employeeInfoPrint.ledger.length !==0){
            reactToPrintCOCHistory()
        }
    },[employeeInfoPrint])
    const reactToPrintCOCHistory  = useReactToPrint({
        content: () => printHistoryRef.current,
        documentTitle:'COC '+employeeInfoPrint.data.name+' '+employeeInfoPrint.data.month_name+'-'+employeeInfoPrint.data.year
    });
    const [multipleFileUpload,setMultipleFileUpload] = useState([])
    const handleFile = async (e) =>{
        var len = e.target.files.length;
        var i = 0;
        var files = [...multipleFileUpload];
        for(i;i<len;i++){
            var file = e.target.files[i].name;
            var extension = file.split('.').pop();
            if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
                var t_filename = file.split('.');
                var f_filename;
                if(t_filename[0].length>10){
                    f_filename = t_filename[0].substring(0,10)+'...'+t_filename[1];
                }else{
                    f_filename = file;
                }
                files.push({
                    data:await convertTo64(e.target.files[i]),
                    filename:f_filename
                });
                // // setCOCFile(event.target.files[0])
                // // let files = e.target.files;
                
                // let fileReader = new FileReader();
                // fileReader.readAsDataURL(e.target.files[i]);
                
                // fileReader.onload = (event) => {
                //     multipleFileUpload.push({
                //         filename:file,
                //         data:fileReader.result
                //     })
                //     // setMultipleFileUpload(fileReader.result)
                //     // setsingleFile(fileReader.result)
                // }
            }else{
                // setMultipleFileUpload('')
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Please upload PDF or Image file.'
                })
            }
        }
        setMultipleFileUpload(files)
        console.log(files)
    }
    const handleRemoveFile = (index)=>{
        var t_file = [...multipleFileUpload];
        t_file.splice(index,1);
        setMultipleFileUpload(t_file)
    }
    const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        // maxWidth: 220,
        maxWidth:'100%',
        maxHeight:'90%',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
    }));
    const previewUploaded = (data) =>{
        var ext = data.filename.split('...');
        if(ext[1] === 'pdf'){
            return (
                <Box sx={{maxHeight:'80vh',overflow:'scroll'}}>
                <iframe src={data.data} style={{height:'100%',width:'100%'}}>
                </iframe>
                </Box>

            )
        }else{
            return (
                <Box sx={{maxHeight:'50vh',overflow:'scroll'}}>
                <img src={data.data} style={{width:'100%'}}/>
                </Box>
            )
        }
    }
    const handleDeleteApplication = (row)=>{
        console.log(row)
        var t_data = {
            id:row.coc_application_id
        }
        Swal.fire({
            icon:'info',
            title:'Deleting COC application',
            html:'Please wait...'
        })
        Swal.showLoading()
        deleteCOCApplication(t_data)
        .then(res=>{
            if(res.data.status === 200){
                var temp = [...appliedData];
                var index = temp.findIndex(object=>{
                    return object.coc_application_id === row.coc_application_id
                })
                temp.splice(index,1);
                setAppliedData(temp)
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
             Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    return(
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading actionButtons={1}/>
                :
                <Fade in={!isLoading}>
                    <Grid container>
                       
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title ='Earn COC'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Tooltip title ='File COC earning'><IconButton color='success' className='custom-iconbutton' onClick={handleClickOpen}><AddIcon/></IconButton></Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{background: green[800],width: 'fit-content',padding: '5px 10px',color: '#fff',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>COC Balance: {truncateToDecimalsCOC(balance)} hr/s</Typography>
                        </Grid>
                         <Grid item xs={12} sx={{mt:2}}>
                            <Typography sx={{background: blue[600],padding: '5px 10px',color: '#fff'}}>COC Application</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Date Filed
                                            </TableCell>
                                            <TableCell>
                                                Month Name
                                            </TableCell>
                                            <TableCell>
                                                Year
                                            </TableCell>
                                            <TableCell>
                                                To Earn
                                            </TableCell>
                                            <TableCell>
                                                Expiration
                                            </TableCell>
                                             <TableCell>
                                                Status
                                            </TableCell>
                                            <TableCell>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                       
                                    </TableHead>
                                     <TableBody>
                                            {
                                                appliedData.map((row,key)=>
                                                    <TableRow key={key} hover>
                                                        <TableCell>
                                                            {moment(row.created_at).format('MMMM DD, YYYY hh:mma')}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.month_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.year}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.earned} hr/s
                                                        </TableCell>
                                                        <TableCell>
                                                            {moment(row.expiration).format('MMMM YYYY')}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span style={{color:row.status==='APPROVED'?green[600]:row.status==='FOR REVIEW' || row.status==='FOR APPROVAL'?blue[600]:red[600]}}>
                                                                <em>{row.status}</em>
                                                                {row.status === 'DISAPPROVED'?<span><em> ({row.remarks})</em></span>:null}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                            <Tooltip title='Print'><span><IconButton disabled={row.status === 'FOR REVIEW'|| row.status === 'DISAPPROVED'?true:false} className='custom-iconbutton' color='primary' onClick={()=>handlePrint(row)}><PrintIcon/></IconButton></span></Tooltip>
                                                             <Tooltip title='Delete application'><span><IconButton className='custom-iconbutton' color='error' onClick={()=>handleDeleteApplication(row)} disabled={row.status==='FOR REVIEW'?false:true}><DeleteIcon/></IconButton></span></Tooltip>
                                                             </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Grid>
                        <Dialog
                            fullScreen
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'sticky',top:0}}>
                            <Toolbar>
                                <Box sx={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',gap:1}}>
                                        <IconButton
                                        edge="start"
                                        color="inherit"
                                        onClick={handleClose}
                                        aria-label="close"
                                        >
                                        <CloseIcon />
                                        </IconButton>
                                        <Typography sx={{ ml: 2 }} variant="h6" component="div">
                                        Overtime details
                                        </Typography>

                                        {/* <Tooltip title='File COC application'><Button color="info" variant='contained' onClick={handleClickOpenFileCOC} startIcon={<FileOpenIcon/>}>File COC Application</Button></Tooltip> */}
                                    </Box>
                                    <Tooltip title='File COC application'><Button color="info" variant='contained' onClick={handleClickOpenFileCOC} startIcon={<FileOpenIcon/>}>File COC Application</Button></Tooltip>
                                    {/* <Button autoFocus color="inherit" onClick={handleClose}>
                                    close
                                    </Button> */}
                                </Box>
                                
                            </Toolbar>
                            </AppBar>
                            <ApplicableData data = {applicableData[0]} cocEarned = {cocEarned} setCocEarned = {setCocEarned} balance = {balance} setWeekDaysEarnedWpayData = {setWeekDaysEarnedWpayData} setWeekDaysEarnedCOCData = {setWeekDaysEarnedCOCData} setWeekEndsEarnedWpayData = {setWeekEndsEarnedWpayData} setWeekEndsEarnedCOCData={setWeekEndsEarnedCOCData} setHolidaysEarnedCOCData={setHolidaysEarnedCOCData} setTotalWeekDaysWpay = {setTotalWeekDaysWpay} setTotalWeekDaysCOC = {setTotalWeekDaysCOC} setTotalWeekEndsWpay = {setTotalWeekEndsWpay} setTotalWeekEndsCOC = {setTotalWeekEndsCOC} setTotalHolidaysCOC = {setTotalHolidaysCOC}/>
                        </Dialog>
                        <Dialog
                            fullScreen
                            open={openFileCOC}
                            onClose={handleCloseFileCOC}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'sticky',top:0}}>
                            <Toolbar>
                                <Box sx={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',gap:1}}>
                                    <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleCloseFileCOC}
                                    aria-label="close"
                                    >
                                    <CloseIcon />
                                    </IconButton>
                                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div"> COC Application Preview
                                    </Typography>
                                    {/* <Tooltip title='Submit COC application'><Button color="info" variant='contained' onClick={handleSubmitApplication} startIcon={<SendIcon/>}>Submit COC application</Button></Tooltip> */}
                                </Box>
                                <Tooltip title='Submit COC application'><Button color="info" variant='contained' onClick={handleSubmitApplication} startIcon={<SendIcon/>}>Submit COC application</Button></Tooltip>
{/* 
                                <Button autoFocus color="inherit" onClick={handleCloseFileCOC}>
                                close
                                </Button> */}
                                </Box>

                            </Toolbar>
                            </AppBar>
                            <Box sx={{m:2}}>
                            <Grid container>
                                <Grid item xs={12}>
                                <Typography sx={{fontSize:'.8rem'}}>File Attachment *</Typography>
                                <label htmlFor={"contained-button-file"} style={{width:'100%'}} required>
                                <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)} multiple/>
                                
                                <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' }, flex: 1 ,height:55}}> {multipleFileUpload.length ===0?<Tooltip title='No file uploaded'><WarningAmberOutlinedIcon size='small' color='error'/></Tooltip>:''} <AttachFileOutlinedIcon fontSize='small'/>Upload File </Button>
                                </label>
                                {
                                    multipleFileUpload.length>0
                                    ?
                                    <Grid item container sx={{display:'flex',justifyContent:'space-between',mt:1}}>
                                    {
                                        multipleFileUpload.map((row,key)=>
                                        <Grid item xs={6} lg={4} sx={{border:'solid 1px #e9e9e9',borderRadius:'20px',pl:1,background:'#e9e9e9'}}>
                                        <small style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} key={key}>
                                        <HtmlTooltip
                                            title={
                                            <React.Fragment>
                                                {/* <Typography color="inherit">Previewing uploaded file</Typography> */}
                                                {previewUploaded(row)}
                                            </React.Fragment>
                                            }
                                        >
                                            <Typography sx={{fontSize:'.8rem',fontStyle:'italic',color:red[800],textTransform:'lowercase'}}>{row.filename}</Typography>
                                        </HtmlTooltip> <Tooltip title='Remove file'><IconButton onClick={()=>handleRemoveFile(key)}><DeleteIcon color='error' sx={{fontSize:'15px'}}/></IconButton></Tooltip></small>
                                        </Grid>
                                        
                                    )}
                                    </Grid>
                                    :
                                    null
                                }
                                </Grid>
                            </Grid>
                            </Box>
                            {
                                empStatus === 'RE' || empStatus === 'CS'
                                ?
                                <PrintFormCOC employeeInfo = {employeeInfo} dateEarned={moment(new Date()).subtract(1,'months')} hours ={cocEarned} earnedInfo = {earnedInfo} deptHeadInfo={deptHeadInfo} updatedLedgerData = {updatedLedgerData} date = {currDate}/>
                                :
                                <PrintFormCOC2 employeeInfo = {employeeInfo} dateEarned={moment(new Date()).subtract(1,'months')} hours ={cocEarned} earnedInfo = {earnedInfo} deptHeadInfo={deptHeadInfo} updatedLedgerData = {updatedLedgerData} date = {currDate}/>
                            }
                        </Dialog>
                        <div style={{display:'none'}}>
                            {
                              empStatus === 'RE' || empStatus === 'CS'
                              ?
                                <PrintFormHistory ref={printHistoryRef} employeeInfo={employeeInfoPrint} dateEarned={dateEarned} hours ={hours} deptHeadInfo={deptHeadInfo} updatedLedgerData = {updatedLedgerData}/>
                            :
                                <PrintFormCOC2History ref={printHistoryRef} employeeInfo={employeeInfoPrint} dateEarned={dateEarned} hours ={hours} deptHeadInfo={deptHeadInfo} updatedLedgerData = {updatedLedgerData} deptName={deptName}/>

                            }
                        </div>
                    </Grid>
                </Fade>
            }
        </Box>
    )
}