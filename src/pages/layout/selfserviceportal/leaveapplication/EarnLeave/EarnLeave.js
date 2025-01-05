import React,{useState,useEffect} from 'react';
import {Box,Grid,Fade,Autocomplete,TextField,CircularProgress,Typography,Backdrop,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TableFooter,Paper,IconButton,Tooltip,Checkbox,Modal,InputLabel,FormControl,Select,MenuItem,Button, InputAdornment } from '@mui/material';
import DashboardLoading from '../../../loader/DashboardLoading';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../../permissionrequest/permissionRequest';
import ModuleHeaderText from '../../../moduleheadertext/ModuleHeaderText';
import { executeForfeiture, getOffices, getOfficesLeaveDtl } from '../LeaveApplicationRequest';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//icons
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CancelIcon from '@mui/icons-material/Cancel';
import CalculateIcon from '@mui/icons-material/Calculate';
import HelpIcon from '@mui/icons-material/Help';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SearchIcon from '@mui/icons-material/Search';
import CachedIcon from '@mui/icons-material/Cached';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import moment from 'moment';
import { approvedEarnedLeaveRequest, getAllDailyEarnLeaveDetails, getDailyEarnedLeaveRequest, getDailyEarnLeaveDetails, getDTRAPIForDailyEarn, getDTRAPIForEarnLeave, getEarnTable, getEmpList, postDailyEarnLeaveDetails, postEarnLeave, submitDisapprovedRequest, viewDTR } from './EarnLeaveRequest';
import { api_url } from '../../../../../request/APIRequestURL';
import { getEmpDTR } from '../../onlinedtr/DTRRequest';
import { ViewDTR } from './table/ViewDTR';
import FullModal from '../../../custommodal/FullModal';
export default function EarnLeave(){
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
    };
    const dailyEarnModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':600,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        overflow:matches?'scroll':'auto',
        maxHeight:matches?'90vh':'auto',
        borderRadius:'5px'
    };
    const dtrModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':600,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        overflow:matches?'scroll':'auto',
        maxHeight:matches?'90vh':'auto',
        borderRadius:'5px'

    };
    const disapprovedModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':600,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        overflow:matches?'scroll':'auto',
        maxHeight:matches?'90vh':'auto',
        borderRadius:'5px'

    };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: blue[800],
            color: theme.palette.common.white,
            fontSize: 13,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        },
    }));
    const [isLoading,setIsLoading] = useState(true)
    const [fetchLoading,setFetchLoading] = useState(false)
    const [fetchEarnLeaveLoading,setFetchEarnLeaveLoading] = useState(false)
    const [officeData,setOfficeData] = useState([]);
    const [selectedOffice,setSelectedOffice] = useState(null);
    const [data,setData] = useState([]);
    const [data1,setData1] = useState([]);
    const [selectedIDs,setSelectedIDs] = useState([]);
    const [selectedAll,setSelectAll] = useState(false);
    const [openProcessModal,setOpenProcessModal] = useState(false);
    const [currentEmployee,setCurrentEmployee] = useState('...');
    const [earnData,setEarnData] = useState([]);
    const [earnTableDailyData,setEarnTableDailyData] = useState([]);
    const [earnTableMinutesData,setEarnTableMinutesData] = useState([]);
    const [earnTableHoursData,setEarnTableHoursData] = useState([]);
    const [earnTableMonthsData,setEarnTableMonthsData] = useState([]);
    const [earnTableWOPayData,setEarnTableWOPayData] = useState([]);
    const [months,setMonths] = useState([]);
    const [selectedMonth,setSelectedMonth] = useState('')
    const [openDailyEarnModal,setOpenDailyEarnModal] = useState(false)
    const [openReviewDailyEarnModal,setOpenReviewDailyEarnModal] = useState(false)
    const [openDTRModal,setOpenDTRModal] = useState(false)
    const [openDisapprovedModal,setOpenDisapprovedModal] = useState(false)
    const [currDate,setCurrDate] = useState('')
    const [prevDailyEarnData,setPrevDailyEarnData] = useState({
        date:'',
        earned:0,
        emp_no:'',
        daily_basis_value:0
    })
    const [dailyEarnData,setDailyEarnData] = useState({
        date:'',
        earned:0,
        emp_no:'',
        days:0,
        dept_code:0,
        lwopay:0,
        lwopay_value:0,
        daily_basis_value:0,
        vl_earned:0,
        sl_earned:0,


    })
    const [selectedEmpNameDailyEarn,setSelectedEmpNameDailyEarn] = useState('')
    const [selectedEmpNo,setSelectedEmpNo] = useState()
    const [pendingRequest,setPendingRequest] = useState([])
    const [historyRequest,setHistoryRequest] = useState([])
    // const [isFirstDay,setIsFirstDay] = useState(false)
    useEffect(()=>{
        checkPermission(50)
        .then((response)=>{
            setIsLoading(false)
            if(response.data){
                /**
                For testing date purposes */
                /**
                if first day of the month, get last day from previous month
                 */
                // var t_date = moment(new Date()).dates(1);
                // console.log(t_date)
                // if(moment(t_date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')){
                //     /**
                //     get last day of the previous month
                //      */
                //     setIsFirstDay(true)
                // }
                // setCurrDate(moment(new Date('2022-05-01')).subtract(0,'days'))
                var curr_date = moment(new Date()).subtract(0,'days')
                // var curr_date = moment(new Date('2023-06-01')).subtract(0,'days')
                // setCurrDate(moment(new Date()).subtract(0,'days'))
                setCurrDate(curr_date)
                // setCurrDate(moment(moment(new Date()).subtract(1,'months')).subtract(5,'days'))
                getOffices()
                .then(res=>{
                    console.log(res.data)
                    setOfficeData(res.data)
                }).catch(err=>{
                    console.log(err)
                })
                getEarnTable()
                .then(res=>{
                    setEarnTableDailyData(res.data.daily);
                    setEarnTableMinutesData(res.data.minutes);
                    setEarnTableHoursData(res.data.hours);
                    setEarnTableMonthsData(res.data.months);
                    setEarnTableWOPayData(res.data.wopay);
                })
                var months_arr = moment.months()
                // var date = new Date('2023-01-01');
                var date = new Date(curr_date);
                // var date = new Date('2022-05-01');
                if(parseInt(moment(date).format('M')) === 1){
                    var month_num = 12;
                    var t_months = [];
                    for(var i = 0 ;i<month_num;i++){
                        t_months.push({
                            month_num:i+1,
                            month_name:months_arr[i],
                            month_shortname:moment().month(i).format('MMM'),
                        })
                    }
                    setMonths(t_months)
                }else{
                    // var date = new Date();
                    var month_num = moment(date).format('M')-1;
                    var t_months = [];
                    for(var i = 0 ;i<month_num;i++){
                        t_months.push({
                            month_num:i+1,
                            month_name:months_arr[i],
                            month_shortname:moment().month(i).format('MMM'),
                        })
                    }
                    setMonths(t_months)
                }
                getDailyEarnedLeaveRequest()
                .then(res=>{
                    console.log(res.data)
                    setPendingRequest(res.data.pending)
                    setHistoryRequest(res.data.history)
                }).catch(err=>{
                    console.log(err)
                })
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const handleSelectOffice = async(data)=>{
        console.log(data)
        setSelectedOffice(data)
        if(data){
            console.log(data)
            var t_data = {
                dept_code:data.dept_code
            }
            getEmpList(t_data)
            .then(res=>{
                console.log(res.data)
                setData(res.data)
                setData1(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }else{
            setData([])
        }
        
    }
    const handleSelect = (id)=>{
        var temp = [...selectedIDs];
        /**
        Check if alread selected
        */
        var index = temp.indexOf(id);
        console.log(index)
        if(index !== -1){
            /**
            exist
             */
            temp.splice(index,1);
            setSelectedIDs(temp);
        }else{
            temp.push(id);
            setSelectedIDs(temp);
        }
    }
    useEffect(()=>{
        if(selectedAll){
            var temp = [];
            data.forEach(el=>{
                temp.push(el.emp_no)
            })
            setSelectedIDs(temp)
        }else{
            setSelectedIDs([])
        }
    },[selectedAll])
    const handleProcessEarnLeave = async ()=>{
        console.log(data)
        if(selectedIDs.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please select employee'
            })
        }else{
            if(selectedMonth.length === 0){
               Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Please select month'
                }) 
            }else{
                /**
                Check if January
                 */
                if(parseInt(moment(currDate).format('M')) === 1){
                
                    var date = new Date(moment(currDate).subtract(1,'months').format('YYYY-MM-DD'))
                    console.log('here')
                }else{
                    var date = new Date(moment(currDate).format('YYYY-MM-DD'))
                }
                console.log(date)
                var y = date.getFullYear();
                var firstDay = moment(new Date(y, selectedMonth.month_num-1, 1)).format('YYYY-MM-DD');
                var lastDay =  moment(new Date(y, selectedMonth.month_num, 0)).format('YYYY-MM-DD');
                // console.log(firstDay)
                // console.log(lastDay)
                var t_earn_data = [];
                var t_data = {
                    emp_ids:selectedIDs,
                    from:firstDay,
                    to:lastDay,
                    key:'b9e1f8a0553623f1:639a3e:17f68ea536b'
                }
                // var total_wopay = 0;
                // var total_wpay = 0;
                // var total_undertime = 0;
                // var total_late = 0;
                setFetchEarnLeaveLoading(true)
                /**
                Get earning details from selected month
                */
                var t_details_data = {
                    month_name:selectedMonth.month_name,
                    year:moment(currDate).format('YYYY'),
                    monthly:true
                }
                console.log(t_details_data)
                var t_prev_earning_dtl;
                var total_days = 0;
                await getAllDailyEarnLeaveDetails(t_details_data)
                .then(res=>{
                    console.log(res.data)
                    t_prev_earning_dtl = res.data
                    return getDTRAPIForEarnLeave(t_data)
                }).then(res=>{
                    console.log(t_prev_earning_dtl)
                    console.log(res.data)
                    setFetchEarnLeaveLoading(false)
                    total_days = res.data[0].data.length;
                    
                    res.data.forEach(el=>{
                        /**
                        get employee id
                        */
                        var t_emp_id = data1.filter((
                        el2)=>{
                            return el2.emp_no === el.emp_no;
                        })
                        var t_emp_daily_earn_dtl = [
                            {
                                emp_no:'',
                                sl_earned:0,
                                vl_earned:0
                            }
                        ]
                        var t_emp_daily_earn_dtl2 = t_prev_earning_dtl.filter((el2)=>{
                            return el2.emp_no === t_emp_id[0].employee_id
                        })
                        var t_total_daily_earn = 0;
                        if(t_emp_daily_earn_dtl2.length>0){
                            t_emp_daily_earn_dtl = t_emp_daily_earn_dtl2;
                            t_emp_daily_earn_dtl2.forEach(el2=>{
                                t_total_daily_earn+=el2.sl_earned
                            })
                        }
                        // console.log(t_emp_daily_earn_dtl)
                        // console.log(t_total_daily_earn)
                        var vl_bal = parseFloat(el.vl_bal);
                        var sl_bal = parseFloat(el.sl_bal);
                        var total_wopay = 0;
                        var total_wpay = 0;
                        var total_undertime = 0;
                        var total_late = 0;
                        var absent = 0;
                        var vl_sl_earned_deduct_late = 0;
                        var vl_sl_earned_deduct_undertime = 0;
                        var vl_sl_earned_after_deduct = 0;
                        var to_minus = 0;
                        var vl_earned = 0;
                        var sl_earned = 1.250;
                        var daily_earned = 0;
                        var total_hours_mins = 0;
                        var t_daily_hours = 0;
                        var t_daily_minutes = 0;
                        var total_regular_hours= 0;
                        var t_total_days= 0;
                        var vl_bal_after= 0;
                        var m_earning= 0;
                        var late_undertime_arr= [];
                        if(el.data.length ===0 || t_total_daily_earn === 1.25){
                            var t_new_data = data1.filter((el3)=>{
                                return el3.emp_no === el.emp_no
                            })
                            t_earn_data.push({
                                emp_no:el.emp_no,
                                emp_name:t_new_data[0].emp_lname+', '+t_new_data[0].emp_fname+ ' '+(t_new_data[0].emp_mname?t_new_data[0].emp_mname.charAt(0):''),
                                undertime:0,
                                late:0,
                                total_wpay:0,
                                total_wopay:0,
                                total_late_hours:0 ,
                                total_late_minutes:  0,
                                total_undertime_hours:0,
                                total_undertime_minutes:0,
                                vl_bal:vl_bal,
                                sl_bal:sl_bal,
                                vl_bal_after:vl_bal,
                                sl_bal_after:sl_bal,
                                vl_sl_earned_deduct_late:0,
                                vl_sl_earned_deduct_undertime:0,
                                vl_sl_earned_after_deduct:sl_bal,
                                total_days:0,
                                // vl_sl_earned_after_deduct:vl_sl_earned_after_deduct,
                                absent:0,
                                vl_earned:0,
                                sl_earned:0,
                                late_undertime_arr:0,
                                month:selectedMonth.month_name,
                                month_shortname:selectedMonth.month_shortname+'.',
                                date_earned:moment(currDate).format('YYYY-MM-DD')

                            })
                        }else{
                            el.data.forEach(el2=>{
                                if(parseInt(el2.late_minutes)>0 || parseInt(el2.under_time)>0){
                                    late_undertime_arr.push(el2.work_date)
                                }
                                // if(parseInt(el2.under_time)>0){
                                //     undertime_arr.push(el2.work_date)
                                // }
                                total_late += parseInt(el2.late_minutes);
                                total_undertime += parseInt(el2.under_time);
                                /**
                                check if sched in is with out pay
                                    */
                                var t_break = el2.half_break.split(';');
                                
                                if(el2.sched_in.includes('W/O Pay')){
                                    /**
                                    if with out pay check again if has time log
                                        */
                                    if(el2.time_in ==='' || t_break[0] === ''){
                                        total_wopay++;
                                    }
                                }
                                else if(el2.sched_out.includes('W/O Pay')){
                                    /**
                                    if with out pay check again if has time log
                                        */
                                    if(el2.time_in ===''  && t_break[1] === ''){
                                        total_wopay++;
                                    }
                                }else{
                                    total_wpay++;
                                    // total_regular_hours+=8;
                                    // total_wopay+=parseInt(el2.absent_day)
                                }
                                total_wopay+=parseInt(el2.absent_day)
                                absent+=parseInt(el2.absent_day)
                                /**
                                For regular working days
                                */
                                if(el2.sched_out === 'REST DAY'){
                                    total_regular_hours+=8;
                                    var reg_hrs = '8.00';
                                }else{
                                    if(parseInt(el2.leave_day) === 1 && parseInt(el2.absent_day) !== 1){
                                        total_regular_hours+=8;

                                    }else{
                                        // total_regular_hours+=parseFloat(el2.reg_hrs)
                                        total_regular_hours+=8;
                                    }
                                }
                        })
                        // console.log(t_daily_hours)
                        // console.log(t_daily_minutes)
                        // console.log(total_regular_hours/8)
                        
                        // console.log(total_regular_hours.toFixed(3))
                            var t_new_data = data1.filter((el3)=>{
                                return el3.emp_no === el.emp_no
                            })
                            const late_hours = Math.floor((total_late) / 60);
                            const undertime_hours = Math.floor((total_undertime) / 60);

                            const late_minutes = (total_late) % 60;
                            const undertime_minutes = (total_undertime) % 60;
                            
                            if(vl_bal<=0){
                                /**
                                If VL is equal to zero, deduct earn leave
                                */
                                if(late_hours>=1){
                                    var len = late_hours;
                                    var i = 1;
                                    for(i;i<=len;i++){
                                        var hours_eq = getHoursVal(1);
                                        vl_sl_earned_deduct_late+=hours_eq[0].equivalent;
                                    }
                                    

                                }
                                if(late_minutes>=1){
                                    var minutes_eq = getMinutesVal(late_minutes);
                                    vl_sl_earned_deduct_late+=minutes_eq[0].equivalent;
                                    console.log(minutes_eq[0].equivalent)
                                }
                                if(undertime_hours>=1){
                                    var len = undertime_hours;
                                    var i = 0;
                                    for(i;i<len;i++){
                                        var hours_eq = getHoursVal(1);
                                        vl_sl_earned_deduct_undertime+=hours_eq[0].equivalent;
                                    }
                                    

                                }
                                if(undertime_minutes>=1){
                                    var minutes_eq = getMinutesVal(undertime_minutes);
                                    vl_sl_earned_deduct_undertime+=minutes_eq[0].equivalent;
                                }
                                // vl_sl_earned_deduct+=absent;
                                var t_vl_sl_earned = getNoBalanceVal(absent);
                                // console.log(t_vl_sl_earned)
                                // vl_earned = t_vl_sl_earned[0].earned
                                // console.log(vl_sl_earned_deduct_late)
                                // console.log(vl_sl_earned_deduct_undertime)
                                
                            }else{
                                if(late_hours>=1){
                                    var len = late_hours;
                                    var i = 0;
                                    for(i;i<len;i++){
                                        var hours_eq = getHoursVal(1);
                                        vl_sl_earned_deduct_late+=hours_eq[0].equivalent;
                                    }

                                }
                                if(late_minutes>=1){
                                    var minutes_eq = getMinutesVal(late_minutes);
                                    vl_sl_earned_deduct_late+=minutes_eq[0].equivalent;
                                }

                                if(undertime_hours>=1){
                                    var len = undertime_hours;
                                    var i = 0;
                                    for(i;i<len;i++){
                                        var hours_eq = getHoursVal(1);
                                        vl_sl_earned_deduct_undertime+=hours_eq[0].equivalent;
                                    }

                                }
                                if(undertime_minutes>=1){
                                    var minutes_eq = getMinutesVal(undertime_minutes);
                                    vl_sl_earned_deduct_undertime+=minutes_eq[0].equivalent;
                                }
                               
                                // var t_vl_sl_earned = getNoBalanceVal(absent);

                                // vl_sl_earned_deduct+=absent;

                                /**
                                Check if total deduct is greater than to vl bal,if greater than, remaining deduct will deduct to monthly earned leave
                                */
                                var total_late_undertime = vl_sl_earned_deduct_late+vl_sl_earned_deduct_undertime;
                                if(total_late_undertime<vl_bal){
                                    vl_sl_earned_after_deduct = vl_bal-total_late_undertime;
                                    vl_earned = 1.250;
                                    console.log(vl_earned)

                                }else{
                                    vl_sl_earned_after_deduct = 0;
                                    to_minus = total_late_undertime - vl_bal;
                                    vl_earned = 1.250-to_minus;
                                    console.log(vl_earned)

                                }
                            }
                            /**
                            check month days is greater than to 30
                            */
                            var total_late_undertime = vl_sl_earned_deduct_late+vl_sl_earned_deduct_undertime;
                            if(parseInt(moment(lastDay).format('DD'))>=30){
                                if(vl_bal<=0){
                                    /**
                                    * no vl bal
                                    */
                                    console.log(total_days)
                                    console.log(absent)
                                    console.log(total_wopay)
                                    var t_earned_val = getNoBalanceVal(absent)
                                    var final_earned = t_earned_val[0].earned-total_late_undertime;
                                    var final_earned2 = t_earned_val[0].earned-t_total_daily_earn;
                                    
                                    var total_days = parseInt(total_regular_hours/8);
                                    t_total_days = total_days;
                                    vl_bal_after = final_earned2;
                                    m_earning = 1.250-t_total_daily_earn

                                }else{
                                        var total_days = parseInt(total_regular_hours/8);
                                        t_total_days = total_days;

                                        // console.log(total_days)
                                        // console.log(total_late_undertime)
                                        // console.log(total_regular_hours)
                                        // console.log(total_regular_hours/8)

                                        if(total_days>=30){
                                            if(vl_bal>total_late_undertime){
                                                // console.log(t_total_daily_earn)
                                                if(total_wopay>0){
                                                    var t_earned_val = getNoBalanceVal(absent)
                                                    var final_earned = t_earned_val[0].earned;
                                                    vl_bal_after = ((vl_bal-total_late_undertime)+final_earned).toFixed(3);
                                                    m_earning = t_earned_val[0].earned-t_total_daily_earn;
                                                }else{
                                                    var final_earned = 1.250-t_total_daily_earn;
                                                    vl_bal_after = ((vl_bal-total_late_undertime)+final_earned).toFixed(3);
                                                    m_earning = 1.250-t_total_daily_earn;

                                                }
                                                

                                            }else{
                                                // var f_vl_bal = total_late_undertime-vl_bal;
                                                // var final_earned = 1.250-f_vl_bal;
                                                // vl_bal_after = final_earned.toFixed(3);

                                                /**
                                                * if vl bal is less than to late/undertime, earn first
                                                */
                                                /**
                                                * add 1.250 to vl bal
                                                */
                                                var t_vl_bal = 1.250+vl_bal;

                                                /**
                                                * minus total late undertime
                                                */
                                                console.log(t_vl_bal)
                                                var t_res = (t_vl_bal-t_total_daily_earn)-total_late_undertime;
                                                console.log(t_res)
                                                if(t_vl_bal<total_late_undertime){
                                                    if(t_res<1){
                                                        /**
                                                        if less than to 1 then check if greater than to .5 (mimimum wopay) 
                                                        */
                                                        console.log(t_res)
                                                        if(Math.abs(t_res)<=.5){
                                                            absent+= .5;
                                                            /**
                                                            re calculate since we get the number of without pay, get from table month that equivalent to .5 leave without pay
                                                            */
                                                            var t_arr = earnTableWOPayData.filter((el)=>{
                                                                return t_res <= el.days_absent && el.days_absent >0;
                                                            })
                                                            console.log(t_res)
                                                            console.log(t_arr[0])
                                                            var t_to_earn = t_arr[0];
                                                            var to_earn_vl = t_to_earn.earned+vl_bal;
                                                            var f_to_minus = to_earn_vl-(total_late_undertime-t_to_earn.days_absent);
                                                            var final_earned = f_to_minus-(vl_bal-t_total_daily_earn);
                                                            console.log(final_earned)
                                                            m_earning = t_to_earn.earned;
                                                            vl_bal_after = final_earned+(vl_bal-t_total_daily_earn)
                                                        }else{
                                                            /**
                                                            re calculate since we get the number of without pay, get from table month that equivalent to .5 leave without pay
                                                            */
                                                            var t_to_earn = getNoBalanceVal(0)
                                                            
                                                            var to_earn_vl = t_to_earn[0].earned+vl_bal;
                                                            var f_to_minus = to_earn_vl-(total_late_undertime);
                                                            console.log(to_earn_vl)
                                                            console.log(f_to_minus)
                                                            var final_earned = t_to_earn[0].earned-t_total_daily_earn;
                                                            var final_earned2 = f_to_minus;
                                                            vl_bal_after = final_earned2
                                                            m_earning = t_to_earn[0].earned-t_total_daily_earn;

                                                            console.log(final_earned)
                                                        }
                                                    }else{
                                                        var final_earned = 1.250-t_total_daily_earn;
                                                        vl_bal_after = (t_vl_bal-total_late_undertime).toFixed(3)
                                                        console.log(final_earned)
                                                    }
                                                }else{
                                                    /**
                                                    re calculate since we get the number of without pay, get from table month that equivalent to .5 leave without pay
                                                    */
                                                    // var t_to_earn = getNoBalanceVal(0)
                                                    
                                                    // var to_earn_vl = t_to_earn[0].earned+vl_bal;
                                                    // var f_to_minus = to_earn_vl-(total_late_undertime);
                                                    // console.log(t_total_daily_earn)
                                                    // console.log(to_earn_vl)
                                                    // console.log(f_to_minus)
                                                    // var final_earned = f_to_minus;
                                                    // vl_bal_after = final_earned
                                                    // console.log(final_earned)
                                                    if(t_res<1){
                                                        /**
                                                        if less than to 1 then check if greater than to .5 (mimimum wopay) 
                                                        */
                                                        console.log(t_res)
                                                        if(Math.abs(t_res)<=.5){
                                                            absent+= .5;
                                                            /**
                                                            re calculate since we get the number of without pay, get from table month that equivalent to .5 leave without pay
                                                            */
                                                            var t_arr = earnTableWOPayData.filter((el)=>{
                                                                return t_res <= el.days_absent && el.days_absent >0;
                                                            })
                                                            console.log(t_res)
                                                            console.log(t_arr[0])
                                                            var t_to_earn = t_arr[0];
                                                            // var to_earn_vl = t_to_earn.earned+vl_bal;
                                                            var to_earn_vl = t_to_earn.earned+vl_bal;
                                                            console.log(to_earn_vl)
                                                            var f_to_minus = to_earn_vl-(total_late_undertime-t_to_earn.days_absent);
                                                            var final_earned = t_to_earn.earned;
                                                            var final_earned2 = f_to_minus-(vl_bal-t_total_daily_earn);
                                                            console.log(f_to_minus)
                                                            console.log(final_earned)
                                                            m_earning = t_to_earn.earned
                                                            vl_bal_after = final_earned2+(vl_bal-t_total_daily_earn)
                                                        }else{
                                                            /**
                                                            re calculate since we get the number of without pay, get from table month that equivalent to .5 leave without pay
                                                            */
                                                            var t_to_earn = getNoBalanceVal(0)
                                                            
                                                            var to_earn_vl = t_to_earn[0].earned+vl_bal;
                                                            var f_to_minus = to_earn_vl-(total_late_undertime);
                                                            console.log(to_earn_vl)
                                                            console.log(f_to_minus)
                                                            var final_earned = (t_to_earn[0].earned-total_late_undertime)-t_total_daily_earn;
                                                            var final_earned2 = f_to_minus;
                                                            vl_bal_after = final_earned2
                                                            m_earning = t_to_earn[0].earned-t_total_daily_earn
                                                            console.log(final_earned)
                                                        }
                                                    }else{
                                                        var final_earned = (1.250-total_late_undertime)-t_total_daily_earn;
                                                        m_earning = 1.250-t_total_daily_earn
                                                        vl_bal_after = (t_vl_bal-total_late_undertime).toFixed(3)
                                                    }
                                                }
                                                

                                            }
                                            
                                        }else{
                                            
                                            if(vl_bal>total_late_undertime){
                                                var t_earned_val = getDaysVal(total_days)
                                                var final_earned = t_earned_val[0].vl;

                                                vl_bal_after = ((vl_bal-total_late_undertime)+final_earned).toFixed(3);
                                                m_earning = t_earned_val[0].vl-t_total_daily_earn

                                            }else{
                                                var f_vl_bal = total_late_undertime-vl_bal;

                                                var t_earned_val = getDaysVal(total_days)

                                                var final_earned = t_earned_val[0].vl-f_vl_bal;

                                                vl_bal_after = final_earned.toFixed(3);
                                                m_earning = t_earned_val[0].vl-t_total_daily_earn

                                                // var final_earned = 1.250-f_vl_bal;
                                            }
                                        }


                                    }
                                // var total_days = parseInt(total_regular_hours/8);
                                // t_total_days = total_days;
                                // if(total_days>=30){
                                //     var final_earned = 1.250-total_late_undertime;
                                //     if(vl_bal<=0){
                                //         vl_bal_after = final_earned.toFixed(3);
                                //     }else{
                                //         vl_bal_after = (vl_bal-total_late_undertime).toFixed(3);
                                //     }

                                // }else if(total_days === 0){
                                //     var final_earned = 0;

                                // }else{
                                //     if(vl_bal<=0){
                                        
                                //         /**
                                //         * no vl bal
                                //         */
                                //         var t_earned_val = getNoBalanceVal(absent)
                                //         var final_earned = t_earned_val[0].earned-total_late_undertime;
                                //         vl_bal_after =final_earned;
                                //     }else{
                                //         var t_earned_val = getDaysVal(total_days)
                                //         console.log(t_earned_val)
                                //         console.log(total_days)
                                //         var final_earned = t_earned_val[0].vl-total_late_undertime;
                                //         vl_bal_after = vl_bal-total_late_undertime;
                                //     }
                                    

                                // }

                            }else{
                                if(vl_bal<=0){
                                    /**
                                    * no vl bal
                                    */
                                    var t_earned_val = getNoBalanceVal(absent)
                                    var final_earned = (t_earned_val[0].earned-total_late_undertime)-t_total_daily_earn;
                                    
                                    var to_add =30-parseInt(moment(lastDay).format('DD'))
                                    var total_days = parseInt(total_regular_hours/8)+to_add;
                                    t_total_days = total_days;
                                    vl_bal_after =final_earned.toFixed(3);
                                    m_earning = 1.250-t_total_daily_earn;

                                }else{
                                    var to_add =30-parseInt(moment(lastDay).format('DD'))
                                    var total_days = parseInt(total_regular_hours/8)+to_add;
                                    t_total_days = total_days;

                                    console.log(total_days)
                                    // console.log(total_regular_hours)
                                    // console.log(total_regular_hours/8)
                                    if(total_days>=30){
                                        if(vl_bal>total_late_undertime){
                                            var final_earned = 1.250-t_total_daily_earn;
                                            vl_bal_after = ((vl_bal-total_late_undertime)+final_earned).toFixed(3);
                                            m_earning = 1.250-t_total_daily_earn
                                        }else{
                                            var f_vl_bal = total_late_undertime-vl_bal;
                                            var final_earned = 1.250-f_vl_bal;
                                            vl_bal_after = final_earned.toFixed(3);
                                            m_earning = 1.250-t_total_daily_earn
                                        }
                                    }else{
                                        if(vl_bal>total_late_undertime){
                                            var t_earned_val = getDaysVal(total_days)
                                            var final_earned = t_earned_val[0].vl;

                                            vl_bal_after = ((vl_bal-total_late_undertime)+final_earned).toFixed(3);
                                            m_earning = 1.250-t_total_daily_earn


                                        }else{
                                            /**
                                             * if vl bal is less than to late/undertime, earn first
                                             */
                                            /**
                                             * add 1.250 to vl bal
                                             */
                                            var t_vl_bal = 1.250+vl_bal;
                                            /**
                                             * minus total late undertime
                                             */
                                            var t_res = t_vl_bal-total_late_undertime;
                                            if(t_res<1){
                                                /**
                                                if less than to 1 then check if greater than to .5 (mimimum wopay) 
                                                 */
                                                if(Math.abs(t_res)<=.5){
                                                    absent+= .5;
                                                    /**
                                                    re calculate since we get the number of without pay, get from table month that equivalent to .5 leave without pay
                                                     */
                                                    var t_to_earn = getNoBalanceVal(.5)
                                                    var to_earn_vl = t_to_earn[0].earned+vl_bal;
                                                    var f_to_minus = to_earn_vl-(total_late_undertime-.5);
                                                    var final_earned = f_to_minus;

                                                }
                                            }
                                            // var f_vl_bal = total_late_undertime-vl_bal;

                                            // var t_earned_val = getDaysVal(total_days)

                                            // var final_earned = t_earned_val[0].vl-f_vl_bal;

                                            // if(final_earned<.5){
                                            //     vl_bal_after = final_earned.toFixed(3);
                                            // }else{

                                            // }


                                            // var final_earned = 1.250-f_vl_bal;
                                        }
                                    }


                                }
                                
                            }
                            console.log(m_earning)
                            t_earn_data.push({
                                emp_no:el.emp_no,
                                emp_name:t_new_data[0].emp_lname+', '+t_new_data[0].emp_fname+ ' '+(t_new_data[0].emp_mname?t_new_data[0].emp_mname.charAt(0):''),
                                undertime:total_undertime,
                                late:total_late,
                                total_wpay:total_wpay,
                                total_wopay:total_wopay,
                                total_late_hours:late_hours,
                                total_late_minutes:late_minutes,
                                total_undertime_hours:undertime_hours,
                                total_undertime_minutes:undertime_minutes,
                                vl_bal:vl_bal,
                                sl_bal:sl_bal,
                                vl_bal_after:(parseFloat(vl_bal_after)-t_total_daily_earn).toFixed(3),
                                sl_bal_after:parseFloat(sl_bal+m_earning).toFixed(3),
                                vl_sl_earned_deduct_late:vl_sl_earned_deduct_late,
                                vl_sl_earned_deduct_undertime:vl_sl_earned_deduct_undertime,
                                vl_sl_earned_after_deduct:(vl_sl_earned_after_deduct).toFixed(3),
                                total_days:t_total_days,
                                // vl_sl_earned_after_deduct:vl_sl_earned_after_deduct,
                                absent:absent,
                                vl_earned:(final_earned-t_total_daily_earn).toFixed(3),
                                sl_earned:m_earning.toFixed(3),
                                late_undertime_arr:late_undertime_arr,
                                month:selectedMonth.month_name,
                                month_shortname:selectedMonth.month_shortname+'.',
                                date_earned:moment(currDate).format('YYYY-MM-DD')
                            })
                        }
                        
                        // t_earn_data.push({
                        //     emp_no:el.emp_no,
                        //     emp_name:el.emp_lname+', '+el.emp_fname+ ' '+(el.emp_mname?el.emp_mname.charAt(0):''),
                        //     undertime:total_undertime,
                        //     late:total_late
                        // })
                        
                    })
                    setEarnData(t_earn_data)
                    setFetchEarnLeaveLoading(false)
                    setOpenProcessModal(true)

                    console.log(t_earn_data)
                })
                .catch(err=>{
                    setFetchEarnLeaveLoading(false)
                    console.log(err)
                })
            }
            
        }
        
    }
    const parseDecimal = (numberVal) => {
        return (numberVal / 100).toFixed(2);
    }

    const getMinutesVal = (val)=>{
        var t_arr = earnTableMinutesData.filter((el)=>{
            return el.minutes === val;
        })
        return t_arr;
    }
    const getHoursVal = (val)=>{
        var t_arr = earnTableHoursData.filter((el)=>{
            return el.hours === val;
        })
        return t_arr;
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
    const handleSelectMonth = (val)=>{
        console.log(val.target.value)
        setSelectedMonth(val.target.value)
    }
    const handleEarnLeaves = (data)=>{
        console.log(data)
        data.api_url = api_url+'/updateMonthlyEarning'
        postEarnLeave(data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
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
            console.log(err)
            Swal.fire({
                icon:'success',
                title:err
            })
        })
    }
    const formatTotalLateHoursMinutes = (row)=>{
        var text = '';
        if(row.total_late_hours>0){
            if(row.total_late_hours>1){
                var t_text = ' hours';
            }else{
                var t_text = ' hour';
            }

            if(row.total_late_minutes>0){
                text+=row.total_late_hours+t_text+' and '
            }else{
                text+=row.total_late_hours+t_text
            }
        }
        if(row.total_late_minutes>0){
             if(row.total_late_minutes>1){
                var t_text = ' minutes';
            }else{
                var t_text = ' minute';
            }

            if(row.total_late_minutes>0){
                text+=row.total_late_minutes+t_text
            }else{
                text+=row.total_late_minutes+t_text
            }
        }
        return text;
        
    }
    const formatTotalUndertimeHoursMinutes = (row)=>{
        var text = '';
        if(row.total_undertime_hours>0){
            if(row.total_undertime_hours>1){
                var t_text = ' hours';
            }else{
                var t_text = ' hour';
            }

            if(row.total_undertime_minutes>0){
                text+=row.total_undertime_hours+t_text+' and '
            }else{
                text+=row.total_undertime_hours+t_text
            }
        }
        if(row.total_undertime_minutes>0){
             if(row.total_undertime_minutes>1){
                var t_text = ' minutes';
            }else{
                var t_text = ' minute';
            }

            if(row.total_undertime_minutes>0){
                text+=row.total_undertime_minutes+t_text
            }else{
                text+=row.total_undertime_minutes+t_text
            }
        }
        return text;
        
    }
    const handleDailyEarn = async (row)=>{
        console.log(row)
        setOpenLoadDailyEarn(true)

        var isFirstDay = false
        var t_date = currDate;

        

        /**
        Check if first day
        */
        if(parseInt(moment(currDate).format('D')) === 1){
            isFirstDay = true;
        }

        var fname = row.emp_fname;
        var mname = row.emp_mname?row.emp_mname.charAt(0)+'.':'';
        var lname = row.emp_lname;
        setSelectedEmpNameDailyEarn(fname+' '+mname+' '+lname)
        setPrevDailyEarnData({
            date:'',
            earned:0,
            emp_no:'',
            daily_basis_value:0
        })
        /**
        if first day, get the last day of the previous month */

        if(isFirstDay){
            var t_data = {
                month:moment(t_date).dates(0).format('MMMM'),
                year:moment(t_date).format('YYYY'),
                emp_no:row.employee_id,
            }
        }else{
            var t_data = {
                month:moment(t_date).format('MMMM'),
                year:moment(t_date).format('YYYY'),
                emp_no:row.employee_id,
            }
        }
        var t_prev_day = moment(currDate).subtract(1,'days');
        
        var t_total_lwopay=0;
        
        await getDailyEarnLeaveDetails(t_data)
        .then(res=>{
            console.log(res.data)
            var t_date_last_earned = res.data.date_earned;

            
            if(t_date_last_earned){
                var t_from = t_date_last_earned;
            }else{
                var t_from = moment(currDate).dates(1);
            }
            

        
            /**
            Get DTR records
            */
            var dtr_data = {
                api_url:api_url,
                emp_id:row.emp_no,
                from:moment(t_from).format('YYYY-MM-DD'),
                to:moment(t_prev_day).format('YYYY-MM-DD')
            }
            console.log(dtr_data)

            /**
            get total leave without pay
            */
            getDTRAPIForDailyEarn(dtr_data)
            .then(res=>{
                console.log(res.data)
                if(res.data.code !== '301'){
                    var t_temp = 0
                    res.data.data.response.forEach(el=>{
                        if(el.sched_in.includes('W/O Pay') && el.sched_out.includes('W/O Pay')){
                            t_total_lwopay++;
                            console.log('here')
                        }
                    })
                    return t_total_lwopay;
                }

            }).catch(err=>{
                setOpenLoadDailyEarn(false)
                console.log(err)
            }).then(res=>{
                console.log(res)
                /**
                get without pay value
                */
                var t_minus_lwopay = 0;
                if(res>0){
                    t_minus_lwopay = (getDaysVal(res))[0].vl
                }
                if(res.data){
                    if(isFirstDay){
                        if(moment(res.data.date_earned).format('YYYY-MM-DD') >= moment(t_date).dates(0).format('YYYY-MM-DD')){
                            console.log(moment(res.data.date_earned).format('YYYY-MM-DD'))
                            console.log(moment(t_date).dates(0).format('YYYY-MM-DD'))
                            Swal.fire({
                                icon:'error',
                                title:'Oops...',
                                html:moment(t_date).dates(0).format('MMMM')+' already earned !'
                            })
                            setOpenLoadDailyEarn(false)
                        }else{
                        // var t_date_last_earned = res.data.date_earned;

                            if(moment(t_date_last_earned).format('YYYY-MM-DD') === moment(t_date).format('YYYY-MM-DD')){
                                Swal.fire({
                                    icon:'error',
                                    title:'Oops...',
                                    html:moment(t_date).format('MMMM DD,YYYY')+' already earned !'
                                })
                                setOpenLoadDailyEarn(false)

                            }else{
                                var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                                
                                /**
                                get date last earning and earned
                                */
                                var t_last_earn = res.data.vl_earned;

                                /**
                                get previuos day
                                    */

                                // var t_daily_val = earnTableDailyData.filter((el)=>{
                                //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                                // })
                                var t_daily_val = earnTableDailyData.filter((el)=>{
                                    return el.days === 30
                                })
                                var to_earn = t_daily_val[0].vl-res.data.vl_earned
                                console.log(t_date_last_earned);
                                console.log(t_prev_day);
                                console.log(t_daily_val);
                                console.log('to earned: '+ to_earn);
                                var t_temp = {...prevDailyEarnData};
                                var t_temp2 = {...dailyEarnData};

                                t_temp.date = t_date_last_earned;
                                t_temp.earned = t_last_earn;
                                t_temp.emp_no = res.data.emp_no;
                                t_temp.daily_basis_value = res.data.daily_basis_value;

                                t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                                t_temp2.emp_id = res.data.emp_no;
                                t_temp2.emp_no = row.emp_no;
                                t_temp2.days = 30;
                                t_temp2.dept_code = row.dept_code;
                                t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                                t_temp2.lwopay = t_total_lwopay;
                                t_temp2.lwopay_value = t_minus_lwopay;
                                t_temp2.daily_basis_value = t_daily_val[0].vl;                                setPrevDailyEarnData(t_temp);
                                setDailyEarnData(t_temp2);
                                setOpenDailyEarnModal(true)                
                                setOpenLoadDailyEarn(false)
                            }
                                
                        }
                    }
                    else{
                        /**
                        * Check if day is greater than to 30, then currDate set to last day of the month
                        */
                        console.log(t_date)
                        if(parseInt(moment(t_date).format('DD')) >30){
                            console.log('greater to 30')
                            if(moment(t_date_last_earned).format('YYYY-MM-DD') === moment(t_date).format('YYYY-MM-DD')){
                                Swal.fire({
                                    icon:'error',
                                    title:'Oops...',
                                    html:moment(t_date).format('MMMM DD,YYYY')+' already earned !'
                                })
                                setOpenLoadDailyEarn(false)

                            }else{
                                var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                            
                                /**
                                get date last earning and earned
                                */
                                var t_last_earn = res.data.vl_earned;

                                /**
                                get previuos day
                                    */

                                // var t_daily_val = earnTableDailyData.filter((el)=>{
                                //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                                // })
                                var t_daily_val = earnTableDailyData.filter((el)=>{
                                    return el.days === 30
                                })
                                var to_earn = t_daily_val[0].vl-res.data.vl_earned
                                console.log(t_date_last_earned);
                                console.log(t_prev_day);
                                console.log(t_daily_val);
                                console.log('to earned: '+ to_earn);
                                var t_temp = {...prevDailyEarnData};
                                var t_temp2 = {...dailyEarnData};

                                t_temp.date = t_date_last_earned;
                                t_temp.earned = t_last_earn;
                                t_temp.emp_no = res.data.emp_no;
                                t_temp.daily_basis_value = res.data.daily_basis_value;

                                t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                                t_temp2.emp_id = res.data.emp_no;
                                t_temp2.emp_no = row.emp_no;
                                t_temp2.days = 30;
                                t_temp2.dept_code = row.dept_code;
                                t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                                t_temp2.lwopay = t_total_lwopay;
                                t_temp2.lwopay_value = t_minus_lwopay;
                                t_temp2.daily_basis_value = t_daily_val[0].vl;
                                setPrevDailyEarnData(t_temp);
                                setDailyEarnData(t_temp2);
                                setOpenDailyEarnModal(true)                
                                setOpenLoadDailyEarn(false)
                            }
                        }else{
                            // var t_date_last_earned = res.data.date_earned;

                            if(moment(t_date_last_earned).format('YYYY-MM-DD') === moment(t_date).format('YYYY-MM-DD')){
                                Swal.fire({
                                    icon:'error',
                                    title:'Oops...',
                                    html:moment(t_date).format('MMMM DD,YYYY')+' already earned !'
                                })
                                setOpenLoadDailyEarn(false)

                            }else{
                                if(isFirstDay){
                                    var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                                
                                    /**
                                    get date last earning and earned
                                    */
                                    var t_last_earn = res.data.vl_earned;

                                    /**
                                    get previuos day
                                        */

                                    // var t_daily_val = earnTableDailyData.filter((el)=>{
                                    //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                                    // })
                                    var t_daily_val = earnTableDailyData.filter((el)=>{
                                        return el.days === 30
                                    })
                                    var to_earn = t_daily_val[0].vl-res.data.vl_earned
                                    console.log(t_date_last_earned);
                                    console.log(t_prev_day);
                                    console.log(t_daily_val);
                                    console.log('to earned: '+ to_earn);
                                    var t_temp = {...prevDailyEarnData};
                                    var t_temp2 = {...dailyEarnData};

                                    t_temp.date = t_date_last_earned;
                                    t_temp.earned = t_last_earn;
                                    t_temp.emp_no = res.data.emp_no;
                                    t_temp.daily_basis_value = res.data.daily_basis_value;

                                    t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                                    t_temp2.emp_id = res.data.emp_no;
                                    t_temp2.emp_no = row.emp_no;
                                    t_temp2.days = 30;
                                    t_temp2.dept_code = row.dept_code;
                                    t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                                    t_temp2.lwopay = t_total_lwopay;
                                    t_temp2.lwopay_value = t_minus_lwopay;
                                    t_temp2.daily_basis_value = t_daily_val[0].vl;
                                    setPrevDailyEarnData(t_temp);
                                    setDailyEarnData(t_temp2);
                                    setOpenDailyEarnModal(true)                
                                    setOpenLoadDailyEarn(false)
                                }else{
                                    var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                                    // if(t_last_day === moment(t_date).format('YYYY-MM-DD')){
                                    //     console.log('last day')
                                    // }else{

                                    // }
                                    /**
                                    get date last earning and earned
                                    */
                                    var t_last_earn = res.data.vl_earned;

                                    /**
                                    get previuos day
                                        */

                                    // var t_daily_val = earnTableDailyData.filter((el)=>{
                                    //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                                    // })
                                    var t_daily_val = earnTableDailyData.filter((el)=>{
                                        return el.days === parseInt(moment(t_prev_day).format('D'))
                                    })
                                    var to_earn = t_daily_val[0].vl-res.data.vl_earned
                                    console.log(t_date_last_earned);
                                    console.log(t_prev_day);
                                    console.log(t_daily_val);
                                    console.log('to earned: '+ to_earn);
                                    var t_temp = {...prevDailyEarnData};
                                    var t_temp2 = {...dailyEarnData};

                                    t_temp.date = t_date_last_earned;
                                    t_temp.earned = t_last_earn;
                                    t_temp.emp_no = res.data.emp_no;
                                    t_temp.daily_basis_value = res.data.daily_basis_value;

                                    t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                                    t_temp2.emp_id = res.data.emp_no;
                                    t_temp2.emp_no = row.emp_no;
                                    t_temp2.days = moment(t_date).subtract(1,'days').format('D');
                                    t_temp2.dept_code = row.dept_code;
                                    t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                                    t_temp2.lwopay = t_total_lwopay;
                                    t_temp2.lwopay_value = t_minus_lwopay;
                                    t_temp2.daily_basis_value = t_daily_val[0].vl;
                                    setPrevDailyEarnData(t_temp);
                                    setDailyEarnData(t_temp2);
                                    setOpenDailyEarnModal(true)                
                                    setOpenLoadDailyEarn(false)
                                }
                                }
                                
                        }
                        /**
                        Get leave without pay between previous date earn to previous date
                        */
                        // var t_dtr_data = {
                        //     emp_id:row.emp_no,
                        //     from:moment(t_date_last_earned).format('YYYY-MM-DD'),
                        //     to:moment(t_date).subtract(1,'days').format('YYYY-MM-DD')
                        // }
                        // console.log(t_dtr_data)
                        // getDTRAPIForDailyEarn(t_dtr_data)
                        // .then(res=>{
                        //     console.log(res.data)
                        // }).catch(err=>{
                        //     console.log(err)
                        // })
                    }
                    
                    

                }else{
                    /**
                    if no data return, means not no daily earn for the current month and year
                    */
                    /**
                    Check if first day of the month
                    */
                    if(isFirstDay){
                        console.log('first day')
                        /**
                        * get daily basis of 30 days
                        */
                        var t_daily_val = earnTableDailyData.filter((el)=>{
                            return el.days === 30
                        })
                        var t_d_earned_data = {...dailyEarnData}
                        t_d_earned_data.date = moment(t_date).format('MMMM DD,YYYY');
                        t_d_earned_data.emp_id = row.employee_id;
                        t_d_earned_data.emp_no = row.emp_no;
                        t_d_earned_data.days = 30;
                        t_d_earned_data.dept_code = row.dept_code;
                        t_d_earned_data.earned = t_daily_val[0].vl-t_minus_lwopay;
                        t_d_earned_data.lwopay = t_total_lwopay;
                        t_d_earned_data.lwopay_value = t_minus_lwopay;
                        t_d_earned_data.daily_basis_value = t_daily_val[0].vl;
                        setDailyEarnData(t_d_earned_data)
                        setOpenDailyEarnModal(true)
                        setOpenLoadDailyEarn(false)

                    }else{
                        /**
                        Check if last day of the current month
                        */
                        var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                        // if(t_last_day === moment(t_date).format('YYYY-MM-DD')){
                        //     console.log('last day')
                        //     setOpenLoadDailyEarn(false)

                        // }else{
                        if(parseInt(moment(t_date).format('DD')) >30){
                            console.log('no previous earned, greater than 30 days')
                            /**
                            * get daily basis of 30 days
                            */
                            var t_daily_val = earnTableDailyData.filter((el)=>{
                                return el.days === 30
                            })
                            var t_d_earned_data = {...dailyEarnData}
                            t_d_earned_data.date = moment(t_date).format('MMMM DD,YYYY');
                            t_d_earned_data.emp_id = row.employee_id;
                            t_d_earned_data.emp_no = row.emp_no;
                            t_d_earned_data.days = 30;
                            t_d_earned_data.dept_code = row.dept_code;
                            t_d_earned_data.earned = t_daily_val[0].vl-t_minus_lwopay;
                            t_d_earned_data.lwopay = t_total_lwopay;
                            t_d_earned_data.lwopay_value = t_minus_lwopay;
                            t_d_earned_data.daily_basis_value = t_daily_val[0].vl;
                            setDailyEarnData(t_d_earned_data)
                            setOpenDailyEarnModal(true)
                            setOpenLoadDailyEarn(false)
                        }else{
                            /**
                            get previuos day
                            */
                            // var t_prev_day = moment(t_date).subtract(1,'days');
                            var t_daily_val = earnTableDailyData.filter((el)=>{
                                return el.days === parseInt(moment(t_prev_day).format('D'))
                            })
                            var t_d_earned_data = {...dailyEarnData}
                            t_d_earned_data.date = moment(t_date).format('MMMM DD,YYYY');
                            t_d_earned_data.emp_id = row.employee_id;
                            t_d_earned_data.emp_no = row.emp_no;
                            t_d_earned_data.days = moment(t_date).subtract(1,'days').format('D');
                            t_d_earned_data.dept_code = row.dept_code;
                            t_d_earned_data.earned = t_daily_val[0].vl-t_minus_lwopay;
                            t_d_earned_data.lwopay = t_total_lwopay;
                            t_d_earned_data.lwopay_value = t_minus_lwopay;
                            t_d_earned_data.daily_basis_value = t_daily_val[0].vl;
                            setDailyEarnData(t_d_earned_data)
                            setOpenDailyEarnModal(true)
                            setOpenLoadDailyEarn(false)
                        }
                    }
                    
                        

                    // }
                }

            })
            
        }).catch(err=>{
            setOpenLoadDailyEarn(false)
            console.log(err)
        })
    }
    const handlePostDailyEarn = () =>{
        var t_date = currDate;
        var isFirstDay = false;
        console.log(dailyEarnData)
        // var t_date1 = moment(currDate).dates(1);
        if(parseInt(moment(currDate).format('D')) === 1){
            isFirstDay = true;
        }
        if(isFirstDay){
            var t_data = {
                dept_code:dailyEarnData.dept_code,
                month:moment(t_date).dates(0).format('MMMM'),
                year:moment(t_date).dates(0).format('YYYY'),
                emp_no:dailyEarnData.emp_no,
                emp_id:dailyEarnData.emp_id,
                date:moment(t_date).format('YYYY-MM-DD'),
                earned:(dailyEarnData.earned-prevDailyEarnData.earned).toFixed(3),
                daily_basis_value:dailyEarnData.daily_basis_value,
                api_url:api_url+'/updateBalanceByEarning',
                first_day:isFirstDay
            }
        }else{

            var t_data = {
                dept_code:dailyEarnData.dept_code,
                month:moment(t_date).format('MMMM'),
                year:moment(t_date).format('YYYY'),
                emp_no:dailyEarnData.emp_no,
                emp_id:dailyEarnData.emp_id,
                date:moment(t_date).format('YYYY-MM-DD'),
                earned:(dailyEarnData.earned-prevDailyEarnData.earned).toFixed(3),
                daily_basis_value:dailyEarnData.daily_basis_value,
                api_url:api_url+'/updateBalanceByEarning',
                first_day:isFirstDay
            }
        }
        
        console.log(t_data)
        Swal.fire({
            icon:'info',
            title:'Posting daily earn leaves',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        postDailyEarnLeaveDetails(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                });
                setOpenDailyEarnModal(false)
            }else{
                 Swal.fire({
                    icon:'error',
                    title:res.data.message
                });
            }
        }).catch(err=>{
            console.log(err)
            Swal.close()

        })
    }
    const formatDate = (date)=>{
        return moment(date).format('MMMM DD, YYYY')
    }
    const [searchValue,setSearchValue] = useState('')
    const handleSearch = (val)=>{
        setSearchValue(val.target.value);

        if(val.target.value !== ''){
            var t_arr = data1.filter((el)=>{
                return el.emp_fname.includes(val.target.value.toUpperCase()) || el.emp_lname.includes(val.target.value.toUpperCase())
            })
            setData(t_arr)
        }else{
            setData(data1)
        }
    }
    const [openLoadDailyEarn,setOpenLoadDailyEarn] = useState(false);
    const [reviewData,setReviewData] = useState(false);
    const handleReviewRequest = async(row)=>{
        console.log(row)
        setOpenLoadDailyEarn(true)
        setReviewData(row)
        var isFirstDay = false
        var t_date = row.date_earned;
        var currDate = row.date_earned;

        

        /**
        Check if first day
        */
        if(parseInt(moment(currDate).format('D')) === 1){
            isFirstDay = true;
        }

        var fname = row.fname;
        var mname = row.mname?row.mname.charAt(0)+'.':'';
        var lname = row.lname;
        setSelectedEmpNameDailyEarn(fname+' '+mname+' '+lname)
        setPrevDailyEarnData({
            date:'',
            earned:0,
            emp_no:'',
            daily_basis_value:0
        })
        /**
        if first day, get the last day of the previous month */

        if(isFirstDay){
            var t_data = {
                month:moment(t_date).dates(0).format('MMMM'),
                year:moment(t_date).format('YYYY'),
                emp_no:row.emp_no,
            }
        }else{
            var t_data = {
                month:moment(t_date).format('MMMM'),
                year:moment(t_date).format('YYYY'),
                emp_no:row.emp_no,
            }
        }
        var t_prev_day = moment(currDate).subtract(1,'days');
        
        await getDailyEarnLeaveDetails(t_data)
        .then(res=>{
            console.log(res.data)
            var t_date_last_earned = res.data.date_earned;

            
            if(t_date_last_earned){
                var t_from = moment(currDate).dates(1);
            }else{
                var t_from = t_date_last_earned;
            }
            

        
            /**
            Get DTR records
            */
            var dtr_data = {
                emp_id:row.emp_no,
                from:moment(t_from).format('YYYY-MM-DD'),
                to:moment(t_prev_day).format('YYYY-MM-DD'),
                api_url:api_url+'/getempDtr2'
            }
            /**
            get total leave without pay
            */
            let t_total_lwopay=0;
            getDTRAPIForDailyEarn(dtr_data)
            .then(res=>{
                console.log(res.data)
                if(res.data.code !== '301'){
                    var t_temp = 0
                    res.data.data.response.forEach(el=>{
                        if(el.sched_in.includes('W/O Pay') && el.sched_out.includes('W/O Pay')){
                            t_total_lwopay++;
                            console.log('here')
                        }
                    })
                }

            }).catch(err=>{
                console.log(err)
            })
            /**
            get without pay value
            */
            var t_minus_lwopay = 0;
            
            if(t_total_lwopay>0){
                t_minus_lwopay = (getDaysVal(t_total_lwopay))[0].vl
            }
            if(res.data){
                if(isFirstDay){
                    if(moment(res.data.date_earned).format('YYYY-MM-DD') >= moment(t_date).dates(0).format('YYYY-MM-DD')){
                        console.log(moment(res.data.date_earned).format('YYYY-MM-DD'))
                        console.log(moment(t_date).dates(0).format('YYYY-MM-DD'))
                        Swal.fire({
                            icon:'error',
                            title:'Oops...',
                            html:moment(t_date).dates(0).format('MMMM')+' already earned !'
                        })
                        setOpenLoadDailyEarn(false)
                    }else{
                       // var t_date_last_earned = res.data.date_earned;

                        if(moment(t_date_last_earned).format('YYYY-MM-DD') === moment(t_date).format('YYYY-MM-DD')){
                            Swal.fire({
                                icon:'error',
                                title:'Oops...',
                                html:moment(t_date).format('MMMM DD,YYYY')+' already earned !'
                            })
                            setOpenLoadDailyEarn(false)

                        }else{
                            var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                            
                            /**
                            get date last earning and earned
                            */
                            var t_last_earn = res.data.vl_earned;

                            /**
                            get previuos day
                                */

                            // var t_daily_val = earnTableDailyData.filter((el)=>{
                            //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                            // })
                            var t_daily_val = earnTableDailyData.filter((el)=>{
                                return el.days === 30
                            })
                            var to_earn = t_daily_val[0].vl-res.data.vl_earned
                            console.log(t_date_last_earned);
                            console.log(t_prev_day);
                            console.log(t_daily_val);
                            console.log('to earned: '+ to_earn);
                            var t_temp = {...prevDailyEarnData};
                            var t_temp2 = {...dailyEarnData};

                            t_temp.date = t_date_last_earned;
                            t_temp.earned = t_last_earn;
                            t_temp.emp_no = res.data.emp_no;
                            t_temp.daily_basis_value = res.data.daily_basis_value;

                            t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                            t_temp2.emp_id = res.data.emp_no;
                            t_temp2.emp_no = row.emp_no;
                            t_temp2.days = 30;
                            t_temp2.dept_code = row.dept_code;
                            t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                            t_temp2.lwopay = t_total_lwopay;
                            t_temp2.lwopay_value = t_minus_lwopay;
                            t_temp2.daily_basis_value = t_daily_val[0].vl;
                            t_temp2.vl_earned = row.vl_earned;
                            t_temp2.sl_earned = row.sl_earned;
                            t_temp2.vl_bal = row.vl_bal;
                            t_temp2.sl_bal = row.sl_bal;
                            setPrevDailyEarnData(t_temp);
                            setDailyEarnData(t_temp2);
                            setOpenReviewDailyEarnModal(true)                
                            setOpenLoadDailyEarn(false)
                        }
                            
                    }
                }
                else{
                    /**
                    * Check if day is greater than to 30, then currDate set to last day of the month
                    */
                    console.log(t_date)
                    if(parseInt(moment(t_date).format('DD')) >30){
                        console.log('greater to 30')
                        if(moment(t_date_last_earned).format('YYYY-MM-DD') === moment(t_date).format('YYYY-MM-DD')){
                            Swal.fire({
                                icon:'error',
                                title:'Oops...',
                                html:moment(t_date).format('MMMM DD,YYYY')+' already earned !'
                            })
                            setOpenLoadDailyEarn(false)

                        }else{
                            var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                        
                            /**
                            get date last earning and earned
                            */
                            var t_last_earn = res.data.vl_earned;

                            /**
                            get previuos day
                                */

                            // var t_daily_val = earnTableDailyData.filter((el)=>{
                            //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                            // })
                            var t_daily_val = earnTableDailyData.filter((el)=>{
                                return el.days === 30
                            })
                            var to_earn = t_daily_val[0].vl-res.data.vl_earned
                            console.log(t_date_last_earned);
                            console.log(t_prev_day);
                            console.log(t_daily_val);
                            console.log('to earned: '+ to_earn);
                            var t_temp = {...prevDailyEarnData};
                            var t_temp2 = {...dailyEarnData};

                            t_temp.date = t_date_last_earned;
                            t_temp.earned = t_last_earn;
                            t_temp.emp_no = res.data.emp_no;
                            t_temp.daily_basis_value = res.data.daily_basis_value;

                            t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                            t_temp2.emp_id = res.data.emp_no;
                            t_temp2.emp_no = row.emp_no;
                            t_temp2.days = 30;
                            t_temp2.dept_code = row.dept_code;
                            t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                            t_temp2.lwopay = t_total_lwopay;
                            t_temp2.lwopay_value = t_minus_lwopay;
                            t_temp2.daily_basis_value = t_daily_val[0].vl;
                            t_temp2.vl_earned = row.vl_earned;
                            t_temp2.sl_earned = row.sl_earned;
                            t_temp2.vl_bal = row.vl_bal;
                            t_temp2.sl_bal = row.sl_bal;
                            setPrevDailyEarnData(t_temp);
                            setDailyEarnData(t_temp2);
                            setOpenReviewDailyEarnModal(true)                
                            setOpenLoadDailyEarn(false)
                        }
                    }else{
                        // var t_date_last_earned = res.data.date_earned;

                        if(moment(t_date_last_earned).format('YYYY-MM-DD') === moment(t_date).format('YYYY-MM-DD')){
                            Swal.fire({
                                icon:'error',
                                title:'Oops...',
                                html:moment(t_date).format('MMMM DD,YYYY')+' already earned !'
                            })
                            setOpenLoadDailyEarn(false)

                        }else{
                            if(isFirstDay){
                                var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                              
                                /**
                                get date last earning and earned
                                */
                                var t_last_earn = res.data.vl_earned;

                                /**
                                get previuos day
                                    */

                                // var t_daily_val = earnTableDailyData.filter((el)=>{
                                //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                                // })
                                var t_daily_val = earnTableDailyData.filter((el)=>{
                                    return el.days === 30
                                })
                                var to_earn = t_daily_val[0].vl-res.data.vl_earned
                                console.log(t_date_last_earned);
                                console.log(t_prev_day);
                                console.log(t_daily_val);
                                console.log('to earned: '+ to_earn);
                                var t_temp = {...prevDailyEarnData};
                                var t_temp2 = {...dailyEarnData};

                                t_temp.date = t_date_last_earned;
                                t_temp.earned = t_last_earn;
                                t_temp.emp_no = res.data.emp_no;
                                t_temp.daily_basis_value = res.data.daily_basis_value;

                                t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                                t_temp2.emp_id = res.data.emp_no;
                                t_temp2.emp_no = row.emp_no;
                                t_temp2.days = 30;
                                t_temp2.dept_code = row.dept_code;
                                t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                                t_temp2.lwopay = t_total_lwopay;
                                t_temp2.lwopay_value = t_minus_lwopay;
                                t_temp2.daily_basis_value = t_daily_val[0].vl;
                                t_temp2.vl_earned = row.vl_earned;
                                t_temp2.sl_earned = row.sl_earned;
                                t_temp2.vl_bal = row.vl_bal;
                                t_temp2.sl_bal = row.sl_bal;
                                setPrevDailyEarnData(t_temp);
                                setDailyEarnData(t_temp2);
                                setOpenReviewDailyEarnModal(true)                
                                setOpenLoadDailyEarn(false)
                            }else{
                                var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                                // if(t_last_day === moment(t_date).format('YYYY-MM-DD')){
                                //     console.log('last day')
                                // }else{

                                // }
                                /**
                                get date last earning and earned
                                */
                                var t_last_earn = res.data.vl_earned;

                                /**
                                get previuos day
                                    */

                                // var t_daily_val = earnTableDailyData.filter((el)=>{
                                //     return el.days <= parseInt(moment(t_prev_day).format('D')) && el.days >parseInt(moment(t_date_last_earned).format('D'))
                                // })
                                var t_daily_val = earnTableDailyData.filter((el)=>{
                                    return el.days === parseInt(moment(t_prev_day).format('D'))
                                })
                                var to_earn = t_daily_val[0].vl-res.data.vl_earned
                                console.log(t_date_last_earned);
                                console.log(t_prev_day);
                                console.log(t_daily_val);
                                console.log('to earned: '+ to_earn);
                                var t_temp = {...prevDailyEarnData};
                                var t_temp2 = {...dailyEarnData};

                                t_temp.date = t_date_last_earned;
                                t_temp.earned = t_last_earn;
                                t_temp.emp_no = res.data.emp_no;
                                t_temp.daily_basis_value = res.data.daily_basis_value;

                                t_temp2.date = moment(t_date).format('YYYY-MM-DD');
                                t_temp2.emp_id = res.data.emp_no;
                                t_temp2.emp_no = row.emp_no;
                                t_temp2.days = moment(t_date).subtract(1,'days').format('D');
                                t_temp2.dept_code = row.dept_code;
                                t_temp2.earned = t_daily_val[0].vl-t_minus_lwopay;
                                t_temp2.lwopay = t_total_lwopay;
                                t_temp2.lwopay_value = t_minus_lwopay;
                                t_temp2.daily_basis_value = t_daily_val[0].vl;
                                t_temp2.vl_earned = row.vl_earned;
                                t_temp2.sl_earned = row.sl_earned;
                                t_temp2.vl_bal = row.vl_bal;
                                t_temp2.sl_bal = row.sl_bal;
                                setPrevDailyEarnData(t_temp);
                                setDailyEarnData(t_temp2);
                                setOpenReviewDailyEarnModal(true)                
                                setOpenLoadDailyEarn(false)
                            }
                            }
                            
                    }
                    /**
                    Get leave without pay between previous date earn to previous date
                    */
                    // var t_dtr_data = {
                    //     emp_id:row.emp_no,
                    //     from:moment(t_date_last_earned).format('YYYY-MM-DD'),
                    //     to:moment(t_date).subtract(1,'days').format('YYYY-MM-DD')
                    // }
                    // console.log(t_dtr_data)
                    // getDTRAPIForDailyEarn(t_dtr_data)
                    // .then(res=>{
                    //     console.log(res.data)
                    // }).catch(err=>{
                    //     console.log(err)
                    // })
                }
                
                

            }else{
                /**
                if no data return, means not no daily earn for the current month and year
                */
                /**
                Check if first day of the month
                 */
                if(isFirstDay){
                    console.log('first day')
                    /**
                    * get daily basis of 30 days
                    */
                    var t_daily_val = earnTableDailyData.filter((el)=>{
                        return el.days === 30
                    })
                    var t_d_earned_data = {...dailyEarnData}
                    t_d_earned_data.date = moment(t_date).format('MMMM DD,YYYY');
                    t_d_earned_data.emp_id = row.employee_id;
                    t_d_earned_data.emp_no = row.emp_no;
                    t_d_earned_data.days = 30;
                    t_d_earned_data.dept_code = row.dept_code;
                    t_d_earned_data.earned = t_daily_val[0].vl-t_minus_lwopay;
                    t_d_earned_data.lwopay = t_total_lwopay;
                    t_d_earned_data.lwopay_value = t_minus_lwopay;
                    t_d_earned_data.daily_basis_value = t_daily_val[0].vl;
                    t_d_earned_data.vl_earned = row.vl_earned;
                    t_d_earned_data.sl_earned = row.sl_earned;
                    t_d_earned_data.vl_bal = row.vl_bal;
                    t_d_earned_data.sl_bal = row.sl_bal;
                    setDailyEarnData(t_d_earned_data)
                    setOpenReviewDailyEarnModal(true)
                    setOpenLoadDailyEarn(false)

                }else{
                    /**
                    Check if last day of the current month
                    */
                    var t_last_day = moment(t_date).add(1,'months').dates(0).format('YYYY-MM-DD');
                    // if(t_last_day === moment(t_date).format('YYYY-MM-DD')){
                    //     console.log('last day')
                    //     setOpenLoadDailyEarn(false)

                    // }else{
                    if(parseInt(moment(t_date).format('DD')) >30){
                        console.log('no previous earned, greater than 30 days')
                        /**
                        * get daily basis of 30 days
                        */
                        var t_daily_val = earnTableDailyData.filter((el)=>{
                            return el.days === 30
                        })
                        var t_d_earned_data = {...dailyEarnData}
                        t_d_earned_data.date = moment(t_date).format('MMMM DD,YYYY');
                        t_d_earned_data.emp_id = row.employee_id;
                        t_d_earned_data.emp_no = row.emp_no;
                        t_d_earned_data.days = 30;
                        t_d_earned_data.dept_code = row.dept_code;
                        t_d_earned_data.earned = t_daily_val[0].vl-t_minus_lwopay;
                        t_d_earned_data.lwopay = t_total_lwopay;
                        t_d_earned_data.lwopay_value = t_minus_lwopay;
                        t_d_earned_data.daily_basis_value = t_daily_val[0].vl;
                        t_d_earned_data.vl_earned = row.vl_earned;
                        t_d_earned_data.sl_earned = row.sl_earned;
                        t_d_earned_data.vl_bal = row.vl_bal;
                        t_d_earned_data.sl_bal = row.sl_bal;
                        setDailyEarnData(t_d_earned_data)
                        setOpenReviewDailyEarnModal(true)
                        setOpenLoadDailyEarn(false)
                    }else{
                        /**
                        get previuos day
                        */
                        // var t_prev_day = moment(t_date).subtract(1,'days');
                        var t_daily_val = earnTableDailyData.filter((el)=>{
                            return el.days === parseInt(moment(t_prev_day).format('D'))
                        })
                        var t_d_earned_data = {...dailyEarnData}
                        t_d_earned_data.date = moment(t_date).format('MMMM DD,YYYY');
                        t_d_earned_data.emp_id = row.employee_id;
                        t_d_earned_data.emp_no = row.emp_no;
                        t_d_earned_data.days = moment(t_date).subtract(1,'days').format('D');
                        t_d_earned_data.dept_code = row.dept_code;
                        t_d_earned_data.earned = t_daily_val[0].vl-t_minus_lwopay;
                        t_d_earned_data.lwopay = t_total_lwopay;
                        t_d_earned_data.lwopay_value = t_minus_lwopay;
                        t_d_earned_data.daily_basis_value = t_daily_val[0].vl;
                        t_d_earned_data.vl_earned = row.vl_earned;
                        t_d_earned_data.sl_earned = row.sl_earned;
                        t_d_earned_data.vl_bal = row.vl_bal;
                        t_d_earned_data.sl_bal = row.sl_bal;
                        setDailyEarnData(t_d_earned_data)
                        setOpenReviewDailyEarnModal(true)
                        setOpenLoadDailyEarn(false)
                    }
                }
                
                    

                // }
            }
        }).catch(err=>{
            setOpenLoadDailyEarn(false)
            console.log(err)
        })
        
    }
    const handleApprovedReview = ()=>{
        Swal.fire({
            icon:'warning',
            title:'Confirm approved request ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                console.log(reviewData)
        
                console.log(dailyEarnData)
                // var t_date1 = moment(currDate).dates(1);
                var t_data = {
                    request_id:reviewData.request_earned_leave_id,
                    dept_code:reviewData.dept_code,
                    month:moment(reviewData.date_earned).format('MMMM'),
                    year:moment(reviewData.date_earned).format('YYYY'),
                    emp_no:reviewData.id_no,
                    emp_id:reviewData.emp_no,
                    date:moment(reviewData.date_earned).format('YYYY-MM-DD'),
                    sl_earned:reviewData.sl_earned,
                    vl_earned:reviewData.vl_earned,
                    daily_basis_value:dailyEarnData.daily_basis_value,
                    api_url:api_url+'/updateBalanceByEarning'
                }
                
                console.log(t_data)
                Swal.fire({
                    icon:'info',
                    title:'Approving request daily earned leaves',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                approvedEarnedLeaveRequest(t_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showConfirmButton:false
                        });
                        setPendingRequest(res.data.data.pending);
                        setHistoryRequest(res.data.data.history)
                        setOpenReviewDailyEarnModal(false)
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        });
                    }
                }).catch(err=>{
                    console.log(err)
                    Swal.close()

                })
            }
        })
        
    }
    const [dtrData,setDTRData] = useState([])
    const [totalUndertimeHours,settotalUndertimeHours] = useState(0)
    const [totalUndertimeMinutes,settotalUndertimeMinutes] = useState(0)
    const [totalLateHours,settotalLateHours] = useState(0)
    const [totalLateMinutes,settotalLateMinutes] = useState(0)
    const handleViewDTR = () =>{
        Swal.fire({
            icon:'info',
            title:'Retrieving DTR',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            emp_id:reviewData.id_no,
            from:moment(reviewData.date_earned).startOf('month').format('YYYY-MM-DD'),
            to:reviewData.date_earned,
            api_url:api_url
        }
        getEmpDTR(t_data)
        .then(res=>{
            console.log(res.data)
            var late=0;
            var undertime=0;
            res.data.data.response.forEach(element => {
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
                setDTRData(res.data.data.response)
                Swal.close()
                setOpenDTRModal(true)
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleDisapprovedReview = (row)=>{
        console.log(reviewData)
        setOpenDisapprovedModal(true)
    }
    const [remarks,setRemarks] = useState('');
    const handleSubmitDisapproval = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Submitting remarks',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            id:reviewData.request_earned_leave_id,
            remarks:remarks
        }
        submitDisapprovedRequest(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
                setOpenDisapprovedModal(false)
                setOpenReviewDailyEarnModal(false)
                setPendingRequest(res.data.data.pending)
                setHistoryRequest(res.data.data.history)
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
                                <Typography>Loading data</Typography>
                                <CircularProgress color="inherit" />

                            </Box>
                        </Backdrop>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={fetchEarnLeaveLoading}
                            // onClick={loadingFilter}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <Typography>Calculating earn leave data</Typography>
                                <CircularProgress color="inherit" />

                            </Box>
                        </Backdrop>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Earn Leave'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Autocomplete
                                disablePortal
                                id="offices-box"
                                options={officeData}
                                getOptionLabel={(option) => option.dept_title}
                                sx={{width:matches?'100%':300,mb:matches?1:0,mr:matches?0:1}}
                                isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code}
                                value={selectedOffice}
                                onChange={(event, newValue) => {
                                    handleSelectOffice(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Office Name *"/>
                                )}
                            />
                            <FormControl
                                sx={{minWidth:matches?'100%':150,mb:matches?1:0,mr:matches?0:1}}
                            >
                                <InputLabel id="month-select-label">Month</InputLabel>
                                <Select
                                labelId="month-select-label"
                                id="month-select-label"
                                value={selectedMonth}
                                label="Month"
                                onChange={handleSelectMonth}
                                >
                                {
                                    months.map((row,key)=>
                                        <MenuItem value={row} key={key}>{row.month_name}</MenuItem>
                                    )
                                }
                                {/* <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem> */}
                                </Select>
                            </FormControl>
                            {
                                matches
                                ?
                                <Tooltip title='Process Monthly Earn leave'><Button color='primary' variant='outlined' sx={{width:'100%'}} onClick = {handleProcessEarnLeave}><CachedIcon/></Button></Tooltip>
                                :
                                <Tooltip title='Process Monthly Earn leave'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{background:blue[800],color:'#fff'}}} onClick = {handleProcessEarnLeave}><CachedIcon/></IconButton></Tooltip>
                            }

                        </Grid>

                        <Grid item xs={12} sx={{mt:1}}>
                            <Box sx={{display:'flex',justifyContent:'flex-end',mb:1,alignItems:'center'}}>
                            
                            <FullModal open={openProcessModal} close={()=>setOpenProcessModal(false)} title='Processing Earn Leave Modal'>
                                <Paper>
                                    <TableContainer sx={{maxHeight:'80vh'}}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    {/* <TableCell>
                                                        Emp Number
                                                    </TableCell> */}
                                                    <StyledTableCell>
                                                        Emp Name
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        VL Balance
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        VL After
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        SL Balance
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        SL After
                                                    </StyledTableCell>
                                                    {/* <TableCell>
                                                        Total Late/Undertime
                                                    </TableCell> */}
                                                    <StyledTableCell sx={{color:'#f96c6c !important'}}>
                                                        Total W/O Pay (day/s)
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Total Undertime
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Undertime Value
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Total Tardiness
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Tardiness Value
                                                    </StyledTableCell>
                                                    {/* <TableCell>
                                                        VL After Deduct
                                                    </TableCell> */}
                                                    <StyledTableCell sx={{color:'#9fffa4 !important'}}>
                                                        VL Earned
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{color:'#9fffa4 !important'}}>
                                                        SL Earned
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Actions
                                                    </StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    earnData.length !==0
                                                    ?
                                                    earnData.map((row,key)=>
                                                        <TableRow key = {key} hover>
                                                            {/* <TableCell>
                                                                {row.emp_no}
                                                            </TableCell> */}
                                                            <StyledTableCell>
                                                                {row.emp_name}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.vl_bal.toFixed(3)}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.vl_bal_after}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.sl_bal.toFixed(3)}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.sl_bal_after}
                                                            </StyledTableCell>
                                                            <StyledTableCell sx={{color:red[800]}}>
                                                                {row.absent>0?row.absent>1?row.absent+' days':row.absent+' day':''}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.total_undertime_hours === 0 && row.total_undertime_minutes === 0
                                                                ?
                                                                '-'
                                                                :
                                                                formatTotalUndertimeHoursMinutes(row)
                                                                }
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.vl_sl_earned_deduct_undertime > 0 ?row.vl_sl_earned_deduct_undertime.toFixed(3):'-'}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.total_late_hours === 0 && row.total_late_minutes === 0
                                                                ?
                                                                '-'
                                                                :
                                                                formatTotalLateHoursMinutes(row)
                                                                }
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.vl_sl_earned_deduct_late >0?row.vl_sl_earned_deduct_late.toFixed(3):'-'}
                                                            </StyledTableCell>
                                                            {/* <TableCell>
                                                                {row.vl_sl_earned_after_deduct.toFixed(3)}
                                                            </TableCell> */}
                                                            <StyledTableCell sx={{color:green[800]}}>
                                                                {row.vl_earned}
                                                            </StyledTableCell>
                                                            <StyledTableCell sx={{color:green[800]}}>
                                                                {row.sl_earned}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Tooltip title ='Process Earn Leaves'><IconButton color='success' className='custom-iconbutton' onClick ={()=>handleEarnLeaves(row)} sx={{'&:hover':{color:'#fff',background:green[800]}}}><UploadFileIcon/></IconButton></Tooltip>
                                                            </StyledTableCell>
                                                                
                                                        </TableRow>
                                                    )
                                                    :
                                                    null
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </FullModal>
                            {/* <Modal
                                open={openProcessModal}
                                // onClose={()=>setOpenProcessModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={modalStyle}>
                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Processing Earn Leave Modal
                                </Typography>
                                <Tooltip title='Close'><IconButton color='error' onClick={()=>setOpenProcessModal(false)}><CancelIcon/></IconButton></Tooltip>
                                </Box>
                                
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    
                                    
                                </Typography>
                                </Box>
                            </Modal> */}
                            </Box>
                            <TextField label='Search' value = {searchValue} onChange = {handleSearch} placeholder='Employee Name' InputProps={{
                                endAdornment:(
                                    <InputAdornment position="end">
                                        <SearchIcon/>
                                    </InputAdornment>
                                )
                            }} sx={{width:matches?'100%':'auto'}}/>
                            <Paper sx={{mt:1}}>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Employee Name
                                            </TableCell>
                                            <TableCell>
                                                Actions
                                            </TableCell>
                                            <TableCell>
                                                Select <br/>
                                                <Checkbox checked = {selectedAll} onChange = {()=>setSelectAll(!selectedAll)}/>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data.length>0
                                            ?
                                            data.map((row,key)=>
                                                <TableRow key={key}>
                                                    <TableCell>
                                                        {row.emp_lname}, {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+'.':''}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title='Daily Earning'><span><IconButton color='primary' className='custom-iconbutton' onClick={()=>handleDailyEarn(row)} disabled = {parseInt(moment(currDate).format('D')) === 1?true:false}><CalculateIcon/></IconButton></span></Tooltip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox checked = {selectedIDs.includes(row.emp_no)} onChange = {()=>handleSelect(row.emp_no)}/>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            :
                                            <TableRow>
                                                <TableCell align='center' colSpan={3}>
                                                    No data
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                            <hr/>
                            <Typography sx={{background: blue[900],padding: '5px 20px',color: '#fff',width: 'fit-content',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>Pending request</Typography>
                            <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Employee Name
                                            </TableCell>
                                            <TableCell>
                                                To earned
                                            </TableCell>
                                            <TableCell>
                                                Date Requested
                                            </TableCell>
                                            <TableCell>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            pendingRequest.length>0
                                            ?
                                            pendingRequest.map((row,key)=>
                                                <TableRow key = {key}>
                                                    <TableCell>
                                                        {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                                    </TableCell>
                                                    <TableCell>
                                                        VL <em>({row.vl_earned})</em> SL <em>({row.sl_earned})</em>
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(row.created_at).format('MMMM DD, YYYY h:m a')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title='Review request'><IconButton color='primary' className='custom-iconbutton' onClick={()=>handleReviewRequest(row)}><RateReviewIcon/></IconButton></Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            :
                                            <TableRow>
                                            <TableCell colSpan={4} align='center'>No pending request as of the moment</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sx={{mt:2}}>
                            <Typography sx={{background: blue[600],padding: '5px 20px',color: '#fff',width: 'fit-content',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>History of request</Typography>
                            <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Employee Name
                                            </TableCell>
                                            <TableCell>
                                                To earned
                                            </TableCell>
                                            <TableCell>
                                                Date Requested
                                            </TableCell>
                                            <TableCell>
                                                Status
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            historyRequest.length>0
                                            ?
                                            historyRequest.map((row,key)=>
                                                <TableRow key = {key}>
                                                    <TableCell>
                                                        {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                                    </TableCell>
                                                    <TableCell>
                                                        VL <em>({row.vl_earned})</em> SL <em>({row.sl_earned})</em>
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(row.date_earned).format('MMMM DD, YYYY h:m a')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.status}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            :
                                            <TableRow>
                                            <TableCell colSpan={4} align='center'>No history as of the moment</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Grid>
                        <Modal
                                open={openDailyEarnModal}
                                // onClose={()=>setOpenProcessModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={dailyEarnModalStyle}>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Daily Earning <small style={{fontSize:'.9rem'}}><em>({selectedEmpNameDailyEarn})</em></small>
                                    </Typography>
                                    <Tooltip title='Close'><IconButton color='error' onClick={()=>setOpenDailyEarnModal(false)}><CancelIcon/></IconButton></Tooltip>
                                    </Box>
                                    <Grid container>
                                        <Grid xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Typography sx={{fontWeight: 'bold',color: '#fff',background: green[800],width: 'fit-content',padding: '3px 10px',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>To be earned: {(dailyEarnData.earned-prevDailyEarnData.daily_basis_value).toFixed(3)}</Typography>
                                            <Tooltip title='Current daily basis minus Previous daily basis(if available)'><IconButton color='primary'><HelpIcon/></IconButton></Tooltip>
                                        </Grid>
                                        {
                                            prevDailyEarnData.date !== ''
                                            ?
                                            <Grid item xs={12} sx={{mb:1}}>
                                                <small><em>(Previous date earned)</em></small>

                                                <Paper>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell align='right'>Earned</TableCell>
                                                            <TableCell align='center'>Daily Basis Value <br/>
                                                                <small>({parseInt(moment(prevDailyEarnData.date).format('D'))-1}) day/s</small>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                       <TableRow>
                                                        <TableCell>{formatDate(prevDailyEarnData.date)}</TableCell>
                                                        <TableCell align='right'>{prevDailyEarnData.earned}</TableCell>
                                                        <TableCell align='center'>{prevDailyEarnData.daily_basis_value.toFixed(3)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                </Paper>

                                            </Grid>
                                            :
                                            null
                                        }
                                        
                                        <Grid item xs={12}>
                                            <small><em>(Current date to earn)</em></small>
                                            <Paper>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell align='right'>Leave W/O Pay</TableCell>
                                                        <TableCell align='right'>To be earned</TableCell>
                                                        <TableCell align='center'>Daily Basis Value <br/>
                                                                <small>({dailyEarnData.days}) day/s </small></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>{formatDate(dailyEarnData.date)}</TableCell>
                                                        <TableCell>
                                                        {
                                                            dailyEarnData.lwopay>0
                                                            ?
                                                               dailyEarnData.lwopay+(dailyEarnData.lwopay>1?' days':' day')+ '('+dailyEarnData.lwopay_value.toFixed(3)+')'
                                                            :
                                                            null
                                                            
                                                        }
                                                        </TableCell>
                                                        <TableCell align='right'>{(dailyEarnData.earned-prevDailyEarnData.daily_basis_value).toFixed(3)}</TableCell>
                                                        <TableCell align='center'>{dailyEarnData.daily_basis_value.toFixed(3)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            </Paper>

                                        </Grid>
                                        <Grid item xs={12} sx={{mt:1,display:'flex', justifyContent:'flex-end'}}>
                                            <Button color='success' className='custom-roundbutton' onClick={handlePostDailyEarn}>Post</Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                        </Modal>

                        <Modal
                                open={openReviewDailyEarnModal}
                                // onClose={()=>setOpenProcessModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={dailyEarnModalStyle}>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Review Daily Earning <small style={{fontSize:'.9rem'}}><em>({selectedEmpNameDailyEarn})</em></small>
                                    </Typography>
                                    <Tooltip title='Close'><IconButton color='error' onClick={()=>setOpenReviewDailyEarnModal(false)}><CancelIcon/></IconButton></Tooltip>
                                    </Box>
                                    <Grid container>
                                        <Grid xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Typography sx={{fontWeight: 'bold',color: '#fff',background: green[800],width: 'fit-content',padding: '3px 10px',borderTopRightRadius: '20px',borderBottomRightRadius: '20px'}}>To be earned: {(dailyEarnData.earned-prevDailyEarnData.daily_basis_value).toFixed(3)}</Typography>
                                            <Box>

                                            <Tooltip title='View DTR'><IconButton color='primary' onClick={handleViewDTR}><AccessTimeFilledIcon/></IconButton></Tooltip>
                                            <Tooltip title='Current daily basis minus Previous daily basis(if available)'><IconButton color='info'><HelpIcon/></IconButton></Tooltip>

                                            </Box>
                                        </Grid>
                                        {
                                            prevDailyEarnData.date !== ''
                                            ?
                                            <Grid item xs={12} sx={{mb:1}}>
                                                <small><em>(Previous date earned)</em></small>

                                                <Paper>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell align='right'>Earned</TableCell>
                                                            <TableCell align='center'>Daily Basis Value <br/>
                                                                <small>({parseInt(moment(prevDailyEarnData.date).format('D'))-1}) day/s</small>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                       <TableRow>
                                                        <TableCell>{formatDate(prevDailyEarnData.date)}</TableCell>
                                                        <TableCell align='right'>{prevDailyEarnData.earned}</TableCell>
                                                        <TableCell align='center'>{prevDailyEarnData.daily_basis_value.toFixed(3)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                </Paper>

                                            </Grid>
                                            :
                                            null
                                        }
                                        
                                        <Grid item xs={12}>
                                            <small><em>(Requested to earn)</em></small>
                                            <Paper>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell align='right'>Leave W/O Pay</TableCell>
                                                        <TableCell align='right'>To be earned</TableCell>
                                                        <TableCell align='center'>Daily Basis Value <br/>
                                                                <small>({dailyEarnData.days}) day/s </small></TableCell>
                                                        <TableCell align='right'>Balance After</TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>{formatDate(dailyEarnData.date)}</TableCell>
                                                        <TableCell>
                                                        {
                                                            dailyEarnData.lwopay>0
                                                            ?
                                                               dailyEarnData.lwopay+(dailyEarnData.lwopay>1?' days':' day')+ '('+dailyEarnData.lwopay_value.toFixed(3)+')'
                                                            :
                                                            null
                                                            
                                                        }
                                                        </TableCell>
                                                        {/* <TableCell align='right'>{(dailyEarnData.earned-prevDailyEarnData.daily_basis_value).toFixed(3)}</TableCell> */}
                                                        <TableCell align='right'>VL - {dailyEarnData.vl_earned.toFixed(3)} <br/> SL - {dailyEarnData.sl_earned.toFixed(3)}</TableCell>
                                                        <TableCell align='center'>{dailyEarnData.daily_basis_value.toFixed(3)}</TableCell>
                                                        <TableCell align='right'>VL - {(dailyEarnData.vl_earned+dailyEarnData.vl_bal).toFixed(3)} <br/> SL - {(dailyEarnData.sl_earned+dailyEarnData.sl_bal).toFixed(3)}</TableCell>

                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            </Paper>

                                        </Grid>
                                        <Grid item xs={12} sx={{mt:1,display:'flex', justifyContent:'flex-end'}}>
                                            {/* <Button color='success' className='custom-roundbutton' onClick={handlePostDailyEarn}>Post</Button> */}
                                            <Tooltip title='Approved request'><IconButton color='success' className='custom-iconbutton' onClick={handleApprovedReview}><ThumbUpIcon/></IconButton></Tooltip>
                                            &nbsp;
                                            <Tooltip title='Disapproved request'><IconButton color='error' className='custom-iconbutton' onClick={handleDisapprovedReview}><ThumbDownIcon/></IconButton></Tooltip>
                                        </Grid>
                                    </Grid>
                                </Box>
                        </Modal>
                         <Modal
                                open={openDTRModal}
                                onClose={()=>setOpenDTRModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={dtrModalStyle}>
                                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',position:'sticky',top:0,background:'#fff'}}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            <small style={{fontSize:'.9rem'}}><em>{selectedEmpNameDailyEarn}'s DTR</em></small>
                                        </Typography>
                                        <Tooltip title='Close'><IconButton color='error' onClick={()=>setOpenDTRModal(false)}><CancelIcon/></IconButton></Tooltip>
                                    </Box>
                                    <Box sx={{maxHeight:'60vh'}}>
                                        <ViewDTR dtrdata={dtrData} totalUndertimeHours = {totalUndertimeHours} totalUndertimeMinutes={totalUndertimeMinutes} totalLateHours={totalLateHours} totalLateMinutes={totalLateMinutes}/>
                                    </Box>
                                </Box>
                        </Modal>
                        <Modal
                            open={openDisapprovedModal}
                            onClose={()=>setOpenDisapprovedModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={disapprovedModalStyle}>
                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',position:'sticky',top:0,background:'#fff'}}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        <small>Remarks for disapproval</small>
                                    </Typography>
                                    <Tooltip title='Close'><IconButton color='error' onClick={()=>setOpenDisapprovedModal(false)}><CancelIcon/></IconButton></Tooltip>
                                </Box>
                                <Box sx={{maxHeight:'60vh'}}>
                                    <form onSubmit={handleSubmitDisapproval}>
                                    <TextField label = 'Remarks' fullWidth value={remarks} onChange={(val)=>setRemarks(val.target.value)} required/>
                                    <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                                        <Button variant='contained' color='success' className='custom-roundbutton' type='submit' >Submit</Button>
                                    </Box>
                                    </form>
                                </Box>
                            </Box>
                        </Modal>
                        <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openLoadDailyEarn}
                        // onClick={handleCloseLoadDailyEarn}
                        >
                        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <CircularProgress color="inherit" />
                        <Typography>Loading data. Please wait...</Typography>
                        </Box>
                        </Backdrop>
                    </Grid>
                </Fade>
            }
        </Box>
    )
}