import React,{useState,useEffect,useRef} from 'react';
import {Box,Grid,Fade,Autocomplete,TextField,CircularProgress,Typography,Backdrop,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TableFooter,Paper,IconButton,Tooltip,Checkbox,Modal, Button,Dialog ,AppBar , Toolbar,Menu,MenuItem  } from '@mui/material';
import DashboardLoading from '../../loader/DashboardLoading';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//icons
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrintIcon from '@mui/icons-material/Print';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getDTRAPIForEarnLeave, getEarnTable, getEmpDTRAPIForRATU, getEmpList, getEmpListMRATU, getUploadedLetterHead, uploadLetterHead,searchEmployeePerDept, getMRATUSignatories } from './MRATURequest';

import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
//custom css
import './MRATU.css';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import MRATUView from './MRATUView';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import MRATUPrint from './MRATUPrint';
import { getFileAPI, preViewFileAPI } from '../../../../viewfile/ViewFileRequest';
import SearchEmployee from './Modal/SearchEmployee';
import { api_url } from '../../../../request/APIRequestURL';
import SmallModal from '../../custommodal/SmallModal';
import SmallestModal from '../../custommodal/SmallestModal';
const Input = styled('input')({
    display: 'none',
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MRATU(){
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        borderRadius:'5px'
    };
    const modalSignatoryStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        borderRadius:'5px'
    };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        // fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        // fontSize: 13,
        },
    }));
    const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[700],
        color: theme.palette.common.white,
        // fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        // fontSize: 13,
        },
    }));
    const [isLoading,setIsLoading] = useState(true)
    const [fetchLoading,setFetchLoading] = useState(false)
    const [selectedMonthYear,setSelectedMonthYear] = useState('')
    const [data,setData] = useState([])
    const [regularData,setRegularData] = useState([])
    const [casualData,setCasualData] = useState([])
   
    const [earnTableDailyData,setEarnTableDailyData] = useState([]);
    const [earnTableMinutesData,setEarnTableMinutesData] = useState([]);
    const [earnTableHoursData,setEarnTableHoursData] = useState([]);
    const [earnTableMonthsData,setEarnTableMonthsData] = useState([]);
    const [earnTableWOPayData,setEarnTableWOPayData] = useState([]);
    const [currFetchEmpStatus,setCurrFetchEmpStatus] = useState([]);
    const [letterHeadID,setLetterHeadID] = useState('');
    const [letterHeadReports,setLetterHeadReports] = useState('');
    const [mratuPreparedByName,setMratuPreparedByName] = useState('');
    const [mratuPreparedByPos,setMratuPreparedByPos] = useState('');
    const [mratuDeptHeadName,setMratuDeptHeadName] = useState('');
    const [mratuDeptHeadPos,setMratuDeptHeadPos] = useState('');
    useEffect(()=>{
        checkPermission(52)
        .then((response)=>{
            setIsLoading(false)
            if(response.data){
                // getOffices()
                // .then(res=>{
                //     console.log(res.data)
                //     setOfficeData(res.data)
                // }).catch(err=>{
                //     console.log(err)
                // })
                getEarnTable()
                .then(res=>{
                    setEarnTableDailyData(res.data.daily);
                    setEarnTableMinutesData(res.data.minutes);
                    setEarnTableHoursData(res.data.hours);
                    setEarnTableMonthsData(res.data.months);
                    setEarnTableWOPayData(res.data.wopay);
                })
                 /**
                Get uploaded letter head
                */
                getUploadedLetterHead()
                .then(res=>{
                    if(res.data){
                        setLetterHeadID(res.data.file_id)
                        console.log(res.data)
                        getFileAPI(res.data.file_id)
                        .then(res=>{
                            setLetterHeadReports(res)
                        }).catch(err=>{
                            Swal.fire({
                                icon:'error',
                                title:err
                            })
                        })
                    }
                    
                }).catch(err=>{
                    console.log(err)
                })
                getMRATUSignatories()
                .then(res=>{
                    setMratuPreparedByName(res.data.prepared_by_name);
                    setMratuPreparedByPos(res.data.prepared_by_pos);
                    setMratuDeptHeadName(res.data.dept_head_name);
                    setMratuDeptHeadPos(res.data.dept_head_pos);
                })
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const parseDecimal = (numberVal) => {
        return (numberVal / 100).toFixed(2);
    }

    const getMinutesVal = (val)=>{
        var t_arr = earnTableMinutesData.filter((el)=>{
            return el.minutes === Math.abs(val);
        })
        if(t_arr.length>0){
            return t_arr;
        }else{
            return {equivalent:0};
        }
    }
    const getHoursVal = (val)=>{
        var t_arr = earnTableHoursData.filter((el)=>{
            return el.hours === Math.abs(val);
        })
        if(t_arr.length>0){
            return t_arr;
        }else{
            return {equivalent:0};
        }
    }
    const getNoBalanceVal = (val)=>{
        var t_arr = earnTableWOPayData.filter((el)=>{
            return val === el.days_absent;
        })
        return t_arr;
    }
    const getDaysVal = (val)=>{
        var t_arr = earnTableDailyData.filter((el)=>{
            return val ===el.days;
        })
        return t_arr;
    }
    const handleSelectMonthYear = (val)=>{
        setSelectedMonthYear(val)
        setRegularData([])
        setCasualData([])
    }
    const handleGenerateReports = async()=>{
        if(!selectedMonthYear){
            Swal.fire({
                icon:'error',
                title:'Oops...',
                html:'Please select month and year first !'
            })
        }else{
            
            // var date = new Date(), y = date.getFullYear(), m = date.getMonth()-2;
            var firstDay = moment(new Date(selectedMonthYear.year, selectedMonthYear.month.number-1, 1)).format('YYYY-MM-DD');
            var lastDay =  moment(new Date(selectedMonthYear.year, selectedMonthYear.month.number, 0)).format('YYYY-MM-DD');
            setFetchLoading(true)
            await getEmpListMRATU()
            .then(res=>{
                console.log(res.data)
                let regular_list = [];
                let casual_list = [];
                res.data.regular.forEach(el=>{
                    regular_list.push({
                        emp_no:el.emp_no,
                        rate:el.actl_salary,
                        fname:el.emp_fname,
                        lname:el.emp_lname,
                        mname:el.emp_mname
                    })
                })
                res.data.casual.forEach(el=>{
                    casual_list.push({
                        emp_no:el.emp_no,
                        rate:el.actl_salary,
                        fname:el.emp_fname,
                        lname:el.emp_lname,
                        mname:el.emp_mname
                    })
                })
                var t_regular_data = {
                    emp_data:regular_list,
                    from:firstDay,
                    to:lastDay,
                    key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                    api_url:api_url
                }

                getEmpDTRAPIForRATU(t_regular_data)
                .then(res2=>{
                    console.log(res2.data)
                    var t_data = [];
                    if(res2.data.code === 200){
                        res2.data.data.forEach(el=>{
                            var total_late = 0;
                            var total_undertime = 0;
                            var late_freq = 0;
                            var undertime_freq = 0;
                            var sl_wpay_arr = [];
                            var sl_wopay_arr = [];
                            var vl_wpay_arr = [];
                            // var vl_wpay_arr = [];
                            var vl_wopay_arr = [];
                            var slp_arr = [];
                            var cto_arr = [];
                            if(el.data.length>0){
                                el.data.forEach(el2=>{
                                    
                                    // if(parseFloat(el2.reg_hrs)<8){
                                    //     total_late+=parseInt(el2.late_minutes);
                                    //     total_undertime+=parseInt(el2.under_time);

                                    //     if(parseInt(el2.late_minutes) !==0){
                                    //         late_freq++;
                                    //     }
                                    //     if(parseInt(el2.under_time) !==0){
                                    //         undertime_freq++;
                                    //     }
                                    // }
                                    total_late+=parseInt(el2.late_minutes);
                                    total_undertime+=parseInt(el2.under_time);

                                    if(parseInt(el2.late_minutes) !==0){
                                        late_freq++;
                                    }
                                    if(parseInt(el2.under_time) !==0){
                                        undertime_freq++;
                                    }

                                    if(parseFloat(el2.leave_day) > 0){
                                        /**
                                        get leave With Pay */
                                        if(el2.sched_in === 'SL' && el2.sched_out === 'SL'){
                                            sl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                        if(el2.sched_in === 'SL W/Pay' && el2.sched_out === 'SL W/Pay'){
                                            sl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                        if(el2.sched_in === 'SL' && el2.sched_out !== 'SL'){
                                            sl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }

                                        if(el2.sched_in ==='SL W/Pay' && el2.sched_out !=='SL W/Pay'){
                                            sl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_in !=='SL W/Pay' && el2.sched_out ==='SL W/Pay'){
                                            sl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }

                                        if(el2.sched_in === 'VL'  && el2.sched_out === 'VL'){
                                            vl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                        if(el2.sched_in === 'FL' && el2.sched_out === 'FL'){
                                            vl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                        if(el2.sched_in === 'SLP' && el2.sched_out === 'SLP'){
                                            slp_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                        if(el2.sched_in === 'SLP W/Pay' && el2.sched_out !== 'SLP W/Pay'){
                                            slp_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_in !== 'SLP W/Pay' && el2.sched_out === 'SLP W/Pay'){
                                            slp_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }

                                        if(el2.sched_in === 'CTO' && el2.sched_out === 'CTO'){
                                            cto_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                    
                                        if(el2.sched_in === 'CTO W/Pay' && el2.sched_out !== 'CTO W/Pay'){
                                            cto_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_in !== 'CTO W/Pay' && el2.sched_out === 'CTO W/Pay'){
                                            cto_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }
                                        /**
                                        End get leave with pay  */

                                        /**
                                        Get days without pay
                                        */
                                        /**
                                        Check number of leave day*/
                                        if(parseFloat(el2.leave_day) === 1){
                                            if(el2.sched_in === 'SL W/O Pay' && el2.sched_out === 'SL W/O Pay'){
                                                sl_wopay_arr.push({
                                                    date:el2.work_date,
                                                    period:'NONE'
                                                })
                                            }
                                            if(el2.sched_in === 'SL W/O Pay' && el2.sched_out === 'SL W/Pay'){
                                                sl_wopay_arr.push({
                                                    date:el2.work_date,
                                                    period:'AM'
                                                })
                                            }
                                            if(el2.sched_in === 'SL W/Pay' && el2.sched_out === 'SL W/O Pay'){
                                                sl_wopay_arr.push({
                                                    date:el2.work_date,
                                                    period:'PM'
                                                })
                                            }
                                            if(el2.sched_in === 'VL W/O Pay' && el2.sched_out === 'VL W/O Pay'){
                                                vl_wopay_arr.push({
                                                    date:el2.work_date,
                                                    period:'NONE'
                                                })
                                            }
                                            if(el2.sched_in === 'VL W/O Pay' && el2.sched_out === 'VL W/Pay'){
                                                vl_wopay_arr.push({
                                                    date:el2.work_date,
                                                    period:'AM'
                                                })
                                            }
                                            if(el2.sched_in === 'VL W/Pay' && el2.sched_out === 'VL W/O Pay'){
                                                vl_wopay_arr.push({
                                                    date:el2.work_date,
                                                    period:'PM'
                                                })
                                            }
                                        }
                                    }else{
                                        if(el2.sched_in ==='SL W/Pay'){
                                            sl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_out ==='SL W/Pay'){
                                            sl_wpay_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }
                                        if(el2.sched_in ==='CTO W/Pay'){
                                            cto_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_out ==='CTO W/Pay'){
                                            cto_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }
                                        if(el2.sched_in ==='SLP W/Pay'){
                                            slp_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_out ==='SLP W/Pay'){
                                            slp_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }

                                        /**
                                        Without pay
                                        */
                                        if(el2.sched_in ==='SL W/O Pay'){
                                            sl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_out ==='SL W/O Pay'){
                                            sl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }
                                        if(el2.sched_in ==='VL W/O Pay'){
                                            vl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_out ==='VL W/O Pay'){
                                            vl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }
                                    }
                                    
                                    
                                })
                                var late_hours = Math.floor((total_late) / 60);
                                var late_days = Math.floor(late_hours/8);
                                var late_minutes = (total_late) % 60;

                                var undertime_hours = Math.floor((total_undertime) / 60);
                                var undertime_days = Math.floor(undertime_hours/8);
                                var undertime_minutes = (total_undertime) % 60;
                                if(late_days>0){
                                    late_hours = late_hours-(late_days*8);
                                    // for(var i=0;i<late_hours;i++){
                                    //     console.log(late_hours)
                                    //     late_hours-=8;
                                    // }
                                }
                                if(undertime_days>0){   
                                    undertime_hours = undertime_hours-(undertime_days*8);

                                    // for(var i=0;i<undertime_hours;i++){
                                    //     undertime_hours-=8;
                                    // }
                                }
                                // const t_late_days_val = getDaysVal(late_days)
                                // const late_days_val = t_late_days_val[0].vl

                                const t_late_hours_val = getHoursVal(late_hours)
                                const late_hours_val = t_late_hours_val[0]?.equivalent
                                
                                const t_late_minutes_val = getMinutesVal(late_minutes)
                                const late_minutes_val = t_late_minutes_val[0]?.equivalent

                                const total_late_deduct = (late_days+late_hours_val+late_minutes_val).toFixed(3)

                                // const t_undertime_days_val = getDaysVal(undertime_days)
                                // const undertime_days_val = t_undertime_days_val[0].vl

                                const t_undertime_hours_val = getHoursVal(undertime_hours)
                                // console.log(undertime_hours)
                                const undertime_hours_val = t_undertime_hours_val[0].equivalent
                                
                                const t_undertime_minutes_val = getMinutesVal(undertime_minutes)
                                const undertime_minutes_val = t_undertime_minutes_val[0].equivalent

                                const total_undertime_deduct = (undertime_days+undertime_hours_val+undertime_minutes_val).toFixed(3)

                                /**
                                Compute total days with pay
                                */
                                var days_with_pay = 0;
                                var days_with_out_pay = 0;
                                sl_wpay_arr.forEach(el=>{
                                    if(el.period === 'NONE'){
                                        days_with_pay+=1;
                                    }else{
                                        days_with_pay+=.5;
                                    }
                                })
                                vl_wpay_arr.forEach(el=>{
                                    if(el.period === 'NONE'){
                                        days_with_pay+=1;
                                    }else{
                                        days_with_pay+=.5;
                                    }
                                })
                                vl_wpay_arr.forEach(el=>{
                                    if(el.period === 'NONE'){
                                        days_with_pay+=1;
                                    }else{
                                        days_with_pay+=.5;
                                    }
                                })
                                slp_arr.forEach(el=>{
                                    if(el.period === 'NONE'){
                                        days_with_pay+=1;
                                    }else{
                                        days_with_pay+=.5;
                                    }
                                })
                                cto_arr.forEach(el=>{
                                    if(el.period === 'NONE'){
                                        days_with_pay+=1;
                                    }else{
                                        days_with_pay+=.5;
                                    }
                                })
                                sl_wopay_arr.forEach(el=>{
                                    if(el.period === 'NONE'){
                                        days_with_out_pay+=1;
                                    }else{
                                        days_with_out_pay+=.5;
                                    }
                                })
                                vl_wopay_arr.forEach(el=>{
                                    if(el.period === 'NONE'){
                                        days_with_out_pay+=1;
                                    }else{
                                        days_with_out_pay+=.5;
                                    }
                                })
                                t_data.push({
                                    emp_no:el.emp_no,
                                    fname:el.fname,
                                    lname:el.lname,
                                    mname:el.mname,
                                    late_days:late_days,
                                    late_hours:late_hours,
                                    late_minutes:late_minutes,
                                    late_freq:late_freq,
                                    total_late_deduct:total_late_deduct,
                                    undertime_days:undertime_days,
                                    undertime_hours:undertime_hours,
                                    undertime_minutes:undertime_minutes,
                                    undertime_freq:undertime_freq,
                                    total_undertime_deduct:total_undertime_deduct,
                                    total_late:total_late,
                                    total_undertime:total_undertime,
                                    sl_wpay_arr:sl_wpay_arr,
                                    vl_wpay_arr:vl_wpay_arr,
                                    // fl_wpay_arr:fl_wpay_arr,
                                    slp_arr:slp_arr,
                                    cto_arr:cto_arr,
                                    days_with_pay:days_with_pay,
                                    days_with_out_pay:days_with_out_pay,
                                    sl_wopay_arr:sl_wopay_arr,
                                    vl_wopay_arr:vl_wopay_arr,
                                    remarks_text:'',

                                    e_late_days:null,
                                    e_late_hours:null,
                                    e_late_minutes:null,
                                    e_late_freq:null,
                                    e_total_late_deduct:null,
                                    e_undertime_days:null,
                                    e_undertime_hours:null,
                                    e_undertime_minutes:null,
                                    e_undertime_freq:null,
                                    editable:false

                                })
                            }else{
                                t_data.push({
                                    emp_no:el.emp_no,
                                    fname:el.fname,
                                    lname:el.lname,
                                    mname:el.mname,
                                    late_days:late_days,
                                    late_hours:late_hours,
                                    late_minutes:late_minutes,
                                    late_freq:late_freq,
                                    total_late_deduct:0,
                                    undertime_days:undertime_days,
                                    undertime_hours:undertime_hours,
                                    undertime_minutes:undertime_minutes,
                                    undertime_freq:undertime_freq,
                                    total_undertime_deduct:0,
                                    total_late:total_late,
                                    total_undertime:total_undertime,
                                    sl_wpay_arr:sl_wpay_arr,
                                    vl_wpay_arr:vl_wpay_arr,
                                    // vl_wpay_arr:vl_wpay_arr,
                                    slp_arr:slp_arr,
                                    cto_arr:cto_arr,
                                    days_with_pay:days_with_pay,
                                    days_with_out_pay:days_with_out_pay,
                                    sl_wopay_arr:sl_wopay_arr,
                                    vl_wopay_arr:vl_wopay_arr,
                                    remarks_text:'',

                                    e_late_days:null,
                                    e_late_hours:null,
                                    e_late_minutes:null,
                                    e_late_freq:null,
                                    e_total_late_deduct:null,
                                    e_undertime_days:null,
                                    e_undertime_hours:null,
                                    e_undertime_minutes:null,
                                    e_undertime_freq:null,
                                    editable:false


                                })
                            }
                            
                        })
                    }
                    
                    console.log(t_data)
                    setRegularData(t_data)

                    // setFetchLoading(false)
                    // handleClickOpen()


                }).catch(err=>{
                    console.log(err)
                    setFetchLoading(false)
                    // window.open(api_url)

                })
                var t_casual_data = {
                    emp_data:casual_list,
                    from:firstDay,
                    to:lastDay,
                    key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                    api_url:api_url

                }

                getEmpDTRAPIForRATU(t_casual_data)
                .then(res2=>{
                    console.log(res2.data)

                    var t_data = [];
                    if(res2.data.code === 200){
                        res2.data.data.forEach(el=>{
                            var total_late = 0;
                            var total_undertime = 0;
                            var late_freq = 0;
                            var undertime_freq = 0;
                            var sl_wpay_arr = [];
                            var sl_wopay_arr = [];
                            var vl_wpay_arr = [];
                            var vl_wopay_arr = [];
                            // var vl_wpay_arr = [];
                            var fl_wopay_arr = [];
                            var slp_arr = [];
                            var cto_arr = [];
                            el.data.forEach(el2=>{
                                if(parseInt(el2.late_minutes) !==0){
                                    late_freq++;
                                }
                                if(parseInt(el2.under_time) !==0){
                                    undertime_freq++;
                                }
                                total_late+=parseInt(el2.late_minutes);
                                total_undertime+=parseInt(el2.under_time);
                                if(parseFloat(el2.leave_day) > 0){
                                    /**
                                    get leave With Pay */
                                    if(el2.sched_in === 'SL' && el2.sched_out === 'SL'){
                                        sl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'NONE'
                                        })
                                    }
                                    if(el2.sched_in === 'SL W/Pay' && el2.sched_out === 'SL W/Pay'){
                                        sl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'NONE'
                                        })
                                    }
                                    if(el2.sched_in === 'SL' && el2.sched_out !== 'SL'){
                                        sl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }

                                    if(el2.sched_in ==='SL W/Pay' && el2.sched_out !=='SL W/Pay'){
                                        sl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_in !=='SL W/Pay' && el2.sched_out ==='SL W/Pay'){
                                        sl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }

                                    if(el2.sched_in === 'VL' && el2.sched_out === 'VL'){
                                        vl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'NONE'
                                        })
                                    }
                                    if(el2.sched_in === 'FL' && el2.sched_out === 'FL'){
                                        vl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'NONE'
                                        })
                                    }
                                    if(el2.sched_in === 'SLP' && el2.sched_out === 'SLP'){
                                        slp_arr.push({
                                            date:el2.work_date,
                                            period:'NONE'
                                        })
                                    }
                                    if(el2.sched_in === 'SLP W/Pay' && el2.sched_out !== 'SLP W/Pay'){
                                        slp_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_in !== 'SLP W/Pay' && el2.sched_out === 'SLP W/Pay'){
                                        slp_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }

                                    if(el2.sched_in === 'CTO' && el2.sched_out === 'CTO'){
                                        cto_arr.push({
                                            date:el2.work_date,
                                            period:'NONE'
                                        })
                                    }

                                    if(el2.sched_in === 'CTO W/Pay' && el2.sched_out !== 'CTO W/Pay'){
                                        cto_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_in !== 'CTO W/Pay' && el2.sched_out === 'CTO W/Pay'){
                                        cto_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }
                                    /**
                                    End get leave with pay  */

                                    /**
                                    Get days without pay
                                    */
                                    /**
                                    Check number of leave day*/
                                    if(parseFloat(el2.leave_day) === 1){
                                        if(el2.sched_in === 'SL W/O Pay' && el2.sched_out === 'SL W/O Pay'){
                                            sl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                        if(el2.sched_in === 'SL W/O Pay' && el2.sched_out === 'SL W/Pay'){
                                            sl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_in === 'SL W/Pay' && el2.sched_out === 'SL W/O Pay'){
                                            sl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }
                                        if(el2.sched_in === 'VL W/O Pay' && el2.sched_out === 'VL W/O Pay'){
                                            vl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'NONE'
                                            })
                                        }
                                        if(el2.sched_in === 'VL W/O Pay' && el2.sched_out === 'VL W/Pay'){
                                            vl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'AM'
                                            })
                                        }
                                        if(el2.sched_in === 'VL W/Pay' && el2.sched_out === 'VL W/O Pay'){
                                            vl_wopay_arr.push({
                                                date:el2.work_date,
                                                period:'PM'
                                            })
                                        }
                                    }
                                }else{
                                    if(el2.sched_in ==='SL W/Pay'){
                                        sl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_out ==='SL W/Pay'){
                                        sl_wpay_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }
                                    if(el2.sched_in ==='CTO W/Pay'){
                                        cto_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_out ==='CTO W/Pay'){
                                        cto_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }
                                    if(el2.sched_in ==='SLP W/Pay'){
                                        slp_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_out ==='SLP W/Pay'){
                                        slp_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }

                                    /**
                                    Without pay
                                    */
                                    if(el2.sched_in ==='SL W/O Pay'){
                                        sl_wopay_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_out ==='SL W/O Pay'){
                                        sl_wopay_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }
                                    if(el2.sched_in ==='VL W/O Pay'){
                                        vl_wopay_arr.push({
                                            date:el2.work_date,
                                            period:'AM'
                                        })
                                    }
                                    if(el2.sched_out ==='VL W/O Pay'){
                                        vl_wopay_arr.push({
                                            date:el2.work_date,
                                            period:'PM'
                                        })
                                    }
                                }
                                
                            })
                            var late_hours = Math.floor((total_late) / 60);
                            var late_days = Math.floor(late_hours/8);
                            var late_minutes = (total_late) % 60;

                            var undertime_hours = Math.floor((total_undertime) / 60);
                            var undertime_days = Math.floor(undertime_hours/8);
                            var undertime_minutes = (total_undertime) % 60;
                            
                            if(late_days>0){
                                late_hours = late_hours-(late_days*8);
                                // for(var i=0;i<late_hours;i++){
                                //     console.log(late_hours)
                                //     late_hours-=8;
                                // }
                            }
                            if(undertime_days>0){
                                undertime_hours = undertime_hours-(undertime_days*8);

                                // for(var i=0;i<undertime_hours;i++){
                                //     undertime_hours-=8;
                                // }
                            }
                            // const t_late_days_val = getDaysVal(late_days)
                            // const late_days_val = t_late_days_val[0].vl

                            const t_late_hours_val = getHoursVal(late_hours)
                            const late_hours_val = t_late_hours_val[0]?.equivalent
                            
                            const t_late_minutes_val = getMinutesVal(late_minutes)
                            const late_minutes_val = t_late_minutes_val[0]?.equivalent

                            const total_late_deduct = (late_days+late_hours_val+late_minutes_val).toFixed(3)

                            // const t_undertime_days_val = getDaysVal(undertime_days)
                            // const undertime_days_val = t_undertime_days_val[0].vl

                            const t_undertime_hours_val = getHoursVal(undertime_hours)
                            // console.log(undertime_hours)
                            const undertime_hours_val = t_undertime_hours_val[0]?.equivalent
                            
                            const t_undertime_minutes_val = getMinutesVal(undertime_minutes)
                            const undertime_minutes_val = t_undertime_minutes_val[0]?.equivalent

                            const total_undertime_deduct = (undertime_days+undertime_hours_val+undertime_minutes_val).toFixed(3)

                            /**
                            Compute total days with pay
                            */
                            var days_with_pay = 0;
                            var days_with_out_pay = 0;
                            sl_wpay_arr.forEach(el=>{
                                if(el.period === 'NONE'){
                                    days_with_pay+=1;
                                }else{
                                    days_with_pay+=.5;
                                }
                            })
                            vl_wpay_arr.forEach(el=>{
                                if(el.period === 'NONE'){
                                    days_with_pay+=1;
                                }else{
                                    days_with_pay+=.5;
                                }
                            })
                            vl_wpay_arr.forEach(el=>{
                                if(el.period === 'NONE'){
                                    days_with_pay+=1;
                                }else{
                                    days_with_pay+=.5;
                                }
                            })
                            slp_arr.forEach(el=>{
                                if(el.period === 'NONE'){
                                    days_with_pay+=1;
                                }else{
                                    days_with_pay+=.5;
                                }
                            })
                            cto_arr.forEach(el=>{
                                if(el.period === 'NONE'){
                                    days_with_pay+=1;
                                }else{
                                    days_with_pay+=.5;
                                }
                            })
                            sl_wopay_arr.forEach(el=>{
                                if(el.period === 'NONE'){
                                    days_with_out_pay+=1;
                                }else{
                                    days_with_out_pay+=.5;
                                }
                            })
                            vl_wopay_arr.forEach(el=>{
                                if(el.period === 'NONE'){
                                    days_with_out_pay+=1;
                                }else{
                                    days_with_out_pay+=.5;
                                }
                            })

                            t_data.push({
                                emp_no:el.emp_no,
                                fname:el.fname,
                                lname:el.lname,
                                mname:el.mname,
                                late_days:late_days,
                                late_hours:late_hours,
                                late_minutes:late_minutes,
                                late_freq:late_freq,
                                total_late_deduct:total_late_deduct,
                                undertime_days:undertime_days,
                                undertime_hours:undertime_hours,
                                undertime_minutes:undertime_minutes,
                                undertime_freq:undertime_freq,
                                total_undertime_deduct:total_undertime_deduct,
                                total_late:total_late,
                                total_undertime:total_undertime,
                                sl_wpay_arr:sl_wpay_arr,
                                vl_wpay_arr:vl_wpay_arr,
                                // vl_wpay_arr:vl_wpay_arr,
                                slp_arr:slp_arr,
                                cto_arr:cto_arr,
                                days_with_pay:days_with_pay,
                                days_with_out_pay:days_with_out_pay,
                                sl_wopay_arr:sl_wopay_arr,
                                vl_wopay_arr:vl_wopay_arr,
                                remarks_text:''
                            })
                        })
                    }
                    
                    console.log(t_data)
                    setCasualData(t_data)

                    setFetchLoading(false)
                    // handleClickOpen()



                }).catch(err=>{
                    console.log(err)
                    setFetchLoading(false)
                    // window.open(api_url)


                })
            }).catch(err=>{
                console.log(err)
                setFetchLoading(false)

            })


        }
    }
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const printRegularMRATURef = useRef();
    const printCasualMRATURef = useRef();
    const beforePrintRegular = ()=>{
        if(letterHeadReports){
            printRegular();
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                text:'Please upload first a Letterhead ! Click settings Icon to Configure'
            })
        }
    }
    const beforePrintCasual = ()=>{
        if(letterHeadReports){
            printCasual();
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                text:'Please upload first a Letterhead ! Click settings Icon to Configure'
            })
        }
    }
    const printRegular  = useReactToPrint({
        content: () => printRegularMRATURef.current,
        documentTitle: 'MRATU'

    });
    const printCasual  = useReactToPrint({
        content: () => printCasualMRATURef.current,
        documentTitle: 'MRATU'

    });
    const [openLetterHead,setOpenLetterHead] = useState(false);
    const [openSignatorySettings,setOpenSignatorySettings] = useState(false);
    const [openSearchEmployee,setOpenSearchEmployee] = useState(false);
    const handleCloseLetterHead = () =>{
        setOpenLetterHead(false)
    }
    const handleCloseSignatory = () =>{
        setOpenSignatorySettings(false)
    }
    const handleLetterHead = ()=>{
        /**
        Get letter head
         */
        getUploadedLetterHead()
        .then(res=>{
            if(res.data){
                setLetterHeadID(res.data.file_id)
                preViewFileAPI(res.data.file_id)
                .then(res=>{
                    setLetterHeadFile(res)
                    setOpenLetterHead(true)

                }).catch(err=>{
                    Swal.fire({
                        icon:'error',
                        title:err
                    })
                })
            }else{
                setOpenLetterHead(true)
            }
            
            
        }).catch(err=>{
            console.log(err)
        })
        
        
    }
    const [letterHeadFile,setLetterHeadFile] = useState('');
    const [letterHeadFileName,setLetterHeadFileName] = useState('');

    const handleFile = (e) =>{
        var file = e.target.files[0].name;
        setLetterHeadFileName(file)
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                file = fileReader.result;
                setLetterHeadFile(file)
                // setsingleFile(fileReader.result)
            }
        }else{
            file = '';
            setLetterHeadFile(file)

            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload Image file.'
            })
        }
    }
    const handleSaveLetterHead = () =>{
        Swal.fire({
            icon:'info',
            title:'Uploading File',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading();
        var t_data = {
            file:letterHeadFile
        }
        uploadLetterHead(t_data)
        .then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                setLetterHeadReports(letterHeadFile)
                setLetterHeadFileName('')
                setLetterHeadFile('')
                handleCloseLetterHead()
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
            console.log(err)
        })
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleSignatories = ()=>{
        setOpenSignatorySettings(true)
    }
    const [infoAction,setInfoAction] = useState(0);

    const handleSetSignatories = (val)=>{
        setInfoAction(val)
        setOpenSearchEmployee(true)
    }
    useEffect(()=>{
        console.log(regularData)
    },[regularData])
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading/>
                :
                <Fade in>
                    <Grid container>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={fetchLoading}
                            // onClick={loadingFilter}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <Typography>Loading records. Please wait...</Typography>

                                <CircularProgress color="inherit" />

                            </Box>
                        </Backdrop>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Monthly Summary Report on Absences, Tardiness and Undertime'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',gap:1}}>
                            <DatePicker
                                value = {selectedMonthYear}
                                onChange={handleSelectMonthYear}
                                onlyMonthPicker
                                inputClass="custom-input"
                                placeholder='Month | Year'
                                />
                            <Tooltip title='Generate reports'><Button color='primary' variant='contained' startIcon={<AssessmentIcon/>} onClick={handleGenerateReports} className='custom-roundbutton'>Generate</Button></Tooltip>

                            <Tooltip title='Report Settings (Letterhead/Signatories)' placement='top'>
                            <IconButton
                                id="basic-button"
                                aria-controls={openMenu ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenu ? 'true' : undefined}
                                onClick={handleClickMenu}
                                className='custom-iconbutton'
                            >
                                <SettingsIcon/>
                            </IconButton>
                            </Tooltip>

                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleLetterHead}>Letterhead</MenuItem>
                                <MenuItem onClick={handleSignatories}>Signatories</MenuItem>
                            </Menu>
                            {/* <Tooltip title='Letterhead'><IconButton className='custom-iconbutton' color='info' onClick={handleLetterHead}><ImageIcon/></IconButton></Tooltip> */}

                            <SmallModal open = {openLetterHead} close = {handleCloseLetterHead} title ='Letterhead Settings'>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                        <span>{letterHeadFileName}</span>
                                        <label htmlFor={"contained-button-file"} style={{display:'flex',justifyContent:'flex-end'}}>
                                        <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)}/>
                                        <Tooltip title='Upload Letter Head'><IconButton color='primary' className='custom-iconbutton' component="span"><UploadIcon/></IconButton></Tooltip>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <img src={letterHeadFile} width='100%' height='100%'/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <hr/>
                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                                        <Button variant='contained' color='success' className='custom-roundbutton' size='small' onClick={handleSaveLetterHead}>Save</Button>
                                        <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCloseLetterHead}>Cancel</Button>
                                    </Grid>
                                </Grid>
                            </SmallModal>
                            <SmallModal open={openSignatorySettings} close = {handleCloseSignatory} title='Signatories Settings'>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography sx={{fontSize:'1.1rem',fontWeight:'bold'}}>Prepared By:</Typography>
                                    </Grid>
                                     <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <Typography>
                                        {mratuPreparedByName} <br/>
                                        {mratuPreparedByPos}
                                        </Typography>

                                        <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick = {()=>handleSetSignatories(1)}><EditIcon/></IconButton></Tooltip>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <hr/>

                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                                        <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCloseSignatory}>Cancel</Button>
                                    </Grid>
                                </Grid>
                            </SmallModal>
                            <SmallestModal open = {openSearchEmployee} close = {()=>setOpenSearchEmployee(false)} title='Search Employee'>
                                <SearchEmployee setOpenSearchEmployee = {setOpenSearchEmployee} infoAction = {infoAction} setMratuPreparedByName = {setMratuPreparedByName} setMratuPreparedByPos = {setMratuPreparedByPos} setMratuDeptHeadName = {setMratuDeptHeadName} setMratuDeptHeadPos = {setMratuDeptHeadPos}/>
                            </SmallestModal>
                        </Grid>
                        {
                            regularData.length !== 0 || casualData.length !==0
                            ?
                            <Grid item xs={12}>
                                <div style={{display:'flex',position:'relative',flexDirection:'row',justifyContent:'center',alignItems:''}}>
                                <div>
                                    <img src={letterHeadReports} height='100px' width='100%'/>

                                <p style={{textAlign:'center',lineHeight:'15px'}}>
                                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>MONTHLY SUMMARY REPORT ON ABSENCES, TARDINESS AND UNDERTIME</span><br/>
                                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Month of {selectedMonthYear?selectedMonthYear.month.name:null} <u>{selectedMonthYear?selectedMonthYear.year:null}</u>
                                    </span><br/>
                                </p>
                                <p style={{position:'absolute',right:100,top:'50%'}}>CGB.F.037.REV00 <br/>
                                    03/03/2022
                                </p>
                                </div>
                                
                                </div>
                            </Grid>
                            :
                            null
                            
                        }
                        
                        {
                            regularData.length !==0
                            ?
                            <Grid item xs={12} sx={{mt:1}}>
                            

                            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mt:1}}>
                            {/* <Typography sx={{fontSize:'.9rem',marginLeft:'10px',background:blue[800],color: '#fff',padding: '5px 10px 5px 5px',borderTopRightRadius:'15px',borderBottomRightRadius: '15px'}}>{selectedMonthYear?selectedMonthYear.month.name:null} {selectedMonthYear?selectedMonthYear.year:null}</Typography> */}
                            <Typography sx={{marginLeft:'10px',background:blue[900],color:'#fff',padding:'5px',borderRadius:'5px',width:'fit-content'}}>Regular Employee/s</Typography>
                            <Tooltip title='Print Regular Report'><IconButton color="primary" className='custom-iconbutton' onClick={beforePrintRegular}>
                                    <PrintIcon/>
                                </IconButton></Tooltip>
                            </Box>
                            <Box sx={{minWidth:'320px',overflow:matches?'scroll':'auto'}}>
                            <MRATUView data={regularData} updateData = {setRegularData} selectedMonthYear = {selectedMonthYear} emp_status = 'Permanent'/>
                            </Box>
                            <hr/>
                            </Grid>
                            :
                            null
                        }

                        {
                            casualData.length !==0
                            ?
                            <Grid item xs={12} sx={{mt:1}}>
                            

                            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mt:1}}>
                            {/* <Typography sx={{fontSize:'.9rem',marginLeft:'10px',background:blue[800],color: '#fff',padding: '5px 10px 5px 5px',borderTopRightRadius:'15px',borderBottomRightRadius: '15px'}}>{selectedMonthYear?selectedMonthYear.month.name:null} {selectedMonthYear?selectedMonthYear.year:null}</Typography> */}
                            <Typography sx={{marginLeft:'10px',background:blue[900],color:'#fff',padding:'5px',borderRadius:'5px',width:'fit-content'}}>Casual Employee/s</Typography>
                            <Tooltip title='Print Casual Report'><IconButton color="primary" className='custom-iconbutton' onClick={beforePrintCasual}>
                                    <PrintIcon/>
                                </IconButton></Tooltip>
                            </Box>
                            <Box sx={{minWidth:'320px',overflow:matches?'scroll':'auto'}}>
                            <MRATUView data={casualData} updateData = {setCasualData} selectedMonthYear = {selectedMonthYear} emp_status = 'Permanent'/>
                            </Box>
                            </Grid>
                            :
                            null
                        }

                        
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
                                {selectedMonthYear?selectedMonthYear.month.name:null} {selectedMonthYear?selectedMonthYear.year:null}
                                </Typography>
                                
                                <Button autoFocus color="inherit" onClick={handleClose}>
                                close
                                </Button>
                            </Toolbar>
                            </AppBar>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sx={{m:2}}>
                                    <Paper>
                                    <TableContainer sx={{maxHeight:'80vh'}}>
                                    <Table>
                                    <TableHead sx={{position:'sticky',top:0,background:'#fff'}}>
                                        <TableRow>
                                            <StyledTableCell rowSpan={2} >
                                                No.
                                            </StyledTableCell>
                                            <StyledTableCell rowSpan={2}>
                                                Name of Employee
                                            </StyledTableCell>
                                            <StyledTableCell colSpan={5} align='center'>
                                                Tardiness
                                            </StyledTableCell>
                                            <StyledTableCell colSpan={5} align='center'>
                                                Undertime
                                            </StyledTableCell>
                                            <StyledTableCell colSpan={2} align='center'>
                                                Leave of Absences
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                Remarks
                                            </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell2>
                                                Days
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Hrs.
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Min.
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Freq.
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Total *(day)
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Days
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Hrs.
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Min.
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Freq.
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                Total *(day)
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                               
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                                No. of Days with Pay
                                            </StyledTableCell2>
                                            <StyledTableCell2>
                                               
                                            </StyledTableCell2>
                                        </TableRow>
                                    </TableHead>
                                <TableBody>
                                    {
                                        data.map((row,key)=>
                                            <TableRow key={key} hover>
                                                <StyledTableCell>
                                                    {key+1}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.late_days>0?row.late_days:null}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.late_hours>0?row.late_hours:null}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.late_minutes>0?row.late_minutes:null}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {
                                                    row.late_freq>0
                                                    ?
                                                    <span style={{color:row.late_freq>=10?'red':'blue'}}>
                                                    {row.late_freq}
                                                    </span>
                                                    :
                                                    null
                                                }
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {parseFloat(row.total_late_deduct)>0?row.total_late_deduct:'-'}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.undertime_days>0?row.under_time:null}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.undertime_hours>0?row.undertime_hours:null}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.undertime_minutes>0?row.undertime_minutes:null}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {
                                                    row.undertime_freq>0
                                                    ?
                                                    <span style={{color:row.undertime_freq>=10?'red':'blue'}}>
                                                    {row.undertime_freq}
                                                    </span>
                                                    :
                                                    null
                                                }
                                                
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {parseFloat(row.total_undertime_deduct)>0?row.total_undertime_deduct:'-'}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {
                                                        row.sl_wpay_arr.length !==0 || row.sl_wopay_arr.length !==0
                                                        ?
                                                            <Box>
                                                            SL -&nbsp;
                                                            {
                                                                row.sl_wpay_arr.map((row2,key2)=>
                                                                    key2===row.sl_wpay_arr.length-1
                                                                    ?
                                                                    <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                                    :
                                                                    <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                                                )
                                                            }
                                                            {
                                                                row.sl_wopay_arr.length !==0
                                                                ?
                                                                    row.sl_wpay_arr.length !==0
                                                                    ?
                                                                    ','
                                                                    :null
                                                                :null}
                                                            {
                                                                row.sl_wopay_arr.map((row2,key2)=>
                                                                    key2===row.sl_wopay_arr.length-1
                                                                    ?
                                                                    <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                                    :
                                                                    <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                                                )
                                                            }
                                                            </Box>

                                                        :
                                                        null
                                                    }
                                                    {
                                                        row.vl_wpay_arr.length !==0
                                                        ?
                                                            <Box>
                                                            VL -&nbsp;
                                                            {
                                                                row.vl_wpay_arr.map((row2,key2)=>
                                                                    key2===row.vl_wpay_arr.length-1
                                                                    ?
                                                                    <span>{moment(row2.date).format('D')}</span>
                                                                    :
                                                                    <span>{moment(row2.date).format('D')},</span>
                                                                )
                                                            }
                                                            </Box>

                                                        :
                                                        null
                                                    }
                                                    {
                                                        row.vl_wpay_arr.length !==0
                                                        ?
                                                            <Box>
                                                            FL -&nbsp;
                                                            {
                                                                row.vl_wpay_arr.map((row2,key2)=>
                                                                    key2===row.vl_wpay_arr.length-1
                                                                    ?
                                                                    <span>{moment(row2.date).format('D')}</span>
                                                                    :
                                                                    <span>{moment(row2.date).format('D')},</span>
                                                                )
                                                            }
                                                            </Box>

                                                        :
                                                        null
                                                    }
                                                    {
                                                        row.slp_arr.length !==0
                                                        ?
                                                            <Box>
                                                            SLP -&nbsp;
                                                            {
                                                                row.slp_arr.map((row2,key2)=>
                                                                    key2===row.slp_arr.length-1
                                                                    ?
                                                                    <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                                    :
                                                                    <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                                                )
                                                            }
                                                            </Box>

                                                        :
                                                        null
                                                    }
                                                    {
                                                        row.cto_arr.length !==0
                                                        ?
                                                            <Box>
                                                            CTO -&nbsp;
                                                            {
                                                                row.cto_arr.map((row2,key2)=>
                                                                    key2===row.cto_arr.length-1
                                                                    ?
                                                                    <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                                    :
                                                                    <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                                                )
                                                            }
                                                            </Box>

                                                        :
                                                        null
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {row.days_with_pay}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {
                                                        <Box>
                                                        {
                                                            row.days_with_out_pay>0
                                                            ?
                                                                <Box>
                                                                <span>{row.days_with_out_pay} day/s w/out pay - </span>
                                                                <span>SL(
                                                                {
                                                                    row.sl_wopay_arr.map((row3,key3)=>
                                                                    <span key={key3}>
                                                                        {
                                                                            key3 === row.sl_wopay_arr.length-1
                                                                            ?
                                                                            <span>{moment(row3.date).format('D')}</span>
                                                                            :
                                                                            <span>{moment(row3.date).format('D')},</span>

                                                                        }
                                                                    </span>
                                                                )
                                                                }
                                                                )
                                                                </span>
                                                                </Box>
                                                            :
                                                            null
                                                        }
                                                        </Box>
                                                    } 
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
                        </Dialog>
                        
                    </Grid>
                    
                </Fade>
            }
        {
            regularData.length !==0
            ?
            <div style={{ display: "none" }}>
                <MRATUPrint ref={printRegularMRATURef} data={regularData} selectedMonthYear = {selectedMonthYear} letterHead = {letterHeadReports} mratuPreparedByName = {mratuPreparedByName} mratuPreparedByPos = {mratuPreparedByPos} mratuDeptHeadName = {mratuDeptHeadName} mratuDeptHeadPos ={mratuDeptHeadPos}/>
            </div>
            :
            null
        }
        {
            casualData.length !==0
            ?
            <div style={{ display: "none" }}>
                <MRATUPrint ref={printCasualMRATURef} data={casualData} selectedMonthYear = {selectedMonthYear} letterHead = {letterHeadReports} mratuPreparedByName = {mratuPreparedByName} mratuPreparedByPos = {mratuPreparedByPos} mratuDeptHeadName = {mratuDeptHeadName} mratuDeptHeadPos ={mratuDeptHeadPos}/>
            </div>
            :
            null
        }
        
        </Box>
    )
}