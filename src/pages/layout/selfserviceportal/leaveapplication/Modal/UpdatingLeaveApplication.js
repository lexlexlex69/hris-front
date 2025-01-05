import React,{useEffect, useState} from 'react';
import {Grid,Typography,Paper,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TextField,Button,InputAdornment,IconButton,Tooltip,Modal, Box,FormControlLabel,Checkbox } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {red} from '@mui/material/colors';
import { postReviewApplicLeaveAPI, postUpdatingReviewApplicLeaveAPI, submitLeaveApplicationUpdate } from '../LeaveApplicationRequest';
import moment from 'moment';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import { api_url } from '../../../../../request/APIRequestURL';
import UpdateDates from './UpdateDates';
import { APIError } from '../../../customstring/CustomString';

export default function UpdatingLeaveApplication(props){
     // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [vl,setVL] = useState('');
    const [sl,setSL] = useState('');
    const [coc,setCOC] = useState('');
    const [slp,setSLP] = useState('');
    const [soloParent,setSoloParent] = useState('');
    const [lessVL,setLessVL] = useState(0);
    const [lessSL,setLessSL] = useState(0);
    const [lessCOC,setLessCOC] = useState(0);
    const [lessSLP,setLessSLP] = useState(0);
    const [lessSoloParent,setLessSoloParent] = useState(0);
    const [balVL,setBalVL] = useState('');
    const [balSL,setBalSL] = useState('');
    const [balCOC,setBalCOC] = useState('');
    const [balSLP,setBalSLP] = useState('');
    const [balSoloParent,setBalSoloParent ] = useState('');
    const [daysWP,setDaysWP] = useState('');
    const [daysWPCOC,setDaysWPCOC] = useState('');
    const [daysWOP,setDaysWOP] = useState('');
    const [employeeInfo,setEmployeeInfo] = useState([])
    const [asOf,setAsOf] = useState('');
    const [isLateFiling,setIsLateFiling] = useState(props.data.is_late_filing);
    const formatPos  = (val)=>{
        if(val.includes('(')){
            var t_arr = val.split('(');
            return t_arr[0];
        }else{
            return val;
        }
    }
    useEffect(()=>{
        setEmployeeInfo(props.data)
        setDaysWP(props.data.days_with_pay)
        setDaysWOP(props.data.days_without_pay)
        setAsOf(props.data.bal_as_of)
        switch(props.data.leave_type_id){
            case 1:
            case 2:
                setVL(props.data.bal_before_process)
                setSL(props.data.sl_before_review)
                setLessVL(props.data.days_with_pay)
                setBalVL(props.data.bal_after_process)
                setBalSL(props.data.sl_after_review)
                setLessSL(0)
                break;
            case 3:
                setVL(props.data.vl_before_review)
                setSL(props.data.bal_before_process)
                var t_borrowed_vl = 0;
                var t_used_sl = 0;
                if(props.data.borrowed_vl){
                    t_borrowed_vl = props.data.borrowed_vl
                }
                if(props.data.used_sl){
                    t_used_sl = props.data.used_sl
                }
                if(t_borrowed_vl+t_used_sl === 0){
                    setLessSL(props.data.days_with_pay)
                }else{
                    setLessSL(props.data.used_sl)
                }
                setBalSL(props.data.bal_after_process)
                setBalVL(props.data.vl_after_review)

                setLessVL(props.data.borrowed_vl);
                break;
            case 14:
            case 23:
                setCOC(props.data.bal_before_process)
                setBalCOC(props.data.bal_after_process)
                setLessCOC(props.data.days_hours_applied)
            break;
            case 15:
                setVL(props.data.vl_before_review)
                setSL(props.data.sl_before_review)
                setLessVL(props.data.credits_vl_val)
                setLessSL(props.data.credits_sl_val)
                setBalVL(props.data.vl_after_review)
                setBalSL(props.data.sl_after_review)
            break;
            case 6:
                //SL
                setVL(props.data.vl_before_review)
                setSL(props.data.sl_before_review)
                setLessVL(0)
                setLessSL(0)
                setBalVL(props.data.vl_after_review)
                setBalSL(props.data.sl_after_review)
                //VL

                setSLP(props.data.bal_before_process)
                setBalSLP(props.data.bal_after_process)
                setLessSLP(props.data.days_hours_applied)
            break;
            case 7:
                //SL
                setVL(props.data.vl_before_review)
                setSL(props.data.sl_before_review)
                setLessVL(0)
                setLessSL(0)
                setBalVL(props.data.vl_after_review)
                setBalSL(props.data.sl_after_review)
                //VL

                setSoloParent(props.data.bal_before_process)
                setBalSoloParent(props.data.bal_after_process)
                setLessSoloParent(props.data.days_hours_applied)
            break;
            default:
                setVL(props.data.vl_before_review)
                setSL(props.data.sl_before_review)
                setLessVL(0)
                setLessSL(0)
                setBalVL(props.data.vl_after_review)
                setBalSL(props.data.sl_after_review)
            break;

        }
    },[])
    const handleSave = (e) =>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Saving update',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            employee_id:props.data.employee_id,
            id:props.data.leave_application_id,
            days:props.data.days_with_pay,
            wpay:daysWP,
            wopay:daysWOP,
            before_process:sl,
            after_process:balSL,
            vl_before:vl,
            vl_after:balVL,
            leave_type_id:props.data.leave_type_id,
            // ref_no:res.data.ref_no,
            bal_as_of:asOf
        }
        console.log(t_data)
        if(employeeInfo.dept_code === 12){
            switch(employeeInfo.leave_type_id){
                case 1:
                case 2:
                    employeeInfo.days_with_pay = parseFloat(daysWP);
                    employeeInfo.days_without_pay = parseFloat(daysWOP);
                    employeeInfo.bal_before_process = parseFloat(vl);
                    employeeInfo.bal_after_process = parseFloat(balVL);
                    employeeInfo.credits_vl_val = parseFloat(lessVL);
                    employeeInfo.vl_before_review = parseFloat(vl);
                    employeeInfo.vl_after_review = parseFloat(balVL);

                break;
                case 3:
                    employeeInfo.days_with_pay = parseFloat(daysWP);
                    employeeInfo.days_without_pay = parseFloat(daysWOP);
                    employeeInfo.bal_before_process = parseFloat(sl);
                    employeeInfo.bal_after_process = parseFloat(balSL);
                    employeeInfo.credits_sl_val = parseFloat(lessSL);
                    employeeInfo.sl_before_review = parseFloat(sl);
                    employeeInfo.sl_after_review = parseFloat(balSL);
                    employeeInfo.used_sl = parseFloat(lessSL);
                    employeeInfo.vl_before_review = parseFloat(vl);
                    employeeInfo.vl_after_review = parseFloat(balVL);

                break;
                case 6:
                    employeeInfo.days_with_pay = parseFloat(daysWP);
                    employeeInfo.days_without_pay = parseFloat(daysWOP);
                    employeeInfo.bal_before_process = parseFloat(slp);
                    employeeInfo.bal_after_process = parseFloat(balSLP);
                    employeeInfo.sl_before_review = parseFloat(sl);
                    employeeInfo.sl_after_review = parseFloat(balSL);
                    employeeInfo.used_sl = 0;
                    employeeInfo.vl_before_review = parseFloat(vl);
                    employeeInfo.vl_after_review = parseFloat(balVL);
                    employeeInfo.others_vl = parseFloat(lessVL);
                    employeeInfo.others_sl = parseFloat(lessSL);
                    employeeInfo.vl_after_review = parseFloat(balVL);

                break;
                case 7:
                    employeeInfo.days_with_pay = parseFloat(daysWP);
                    employeeInfo.days_without_pay = parseFloat(daysWOP);
                    employeeInfo.bal_before_process = parseFloat(soloParent);
                    employeeInfo.bal_after_process = parseFloat(balSoloParent);
                    employeeInfo.sl_before_review = parseFloat(sl);
                    employeeInfo.sl_after_review = parseFloat(balSL);
                    employeeInfo.used_sl = 0;
                    employeeInfo.vl_before_review = parseFloat(vl);
                    employeeInfo.vl_after_review = parseFloat(balVL);
                    employeeInfo.others_vl = parseFloat(lessVL);
                    employeeInfo.others_sl = parseFloat(lessSL);
                    employeeInfo.vl_after_review = parseFloat(balVL);

                break;
                case 15:
                    employeeInfo.days_with_pay = parseFloat(daysWP);
                    employeeInfo.days_without_pay = parseFloat(daysWOP);
                    // employeeInfo.bal_before_process = 0;
                    // employeeInfo.bal_after_process = 0;
                    employeeInfo.credits_sl_val = 0;
                    employeeInfo.sl_before_review = parseFloat(sl);
                    employeeInfo.sl_after_review = parseFloat(balSL);
                    employeeInfo.used_sl = 0;
                    employeeInfo.vl_before_review = parseFloat(vl);
                    employeeInfo.vl_after_review = parseFloat(balVL);
                    employeeInfo.others_vl = parseFloat(lessVL);
                    employeeInfo.others_sl = parseFloat(lessSL);
                    employeeInfo.vl_after_review = parseFloat(balVL);
                    employeeInfo.remarks = 'Certified Correct';

                default:
                    employeeInfo.days_with_pay = parseFloat(daysWP);
                    employeeInfo.days_without_pay = parseFloat(daysWOP);
                    // employeeInfo.bal_before_process = 0;
                    // employeeInfo.bal_after_process = 0;
                    employeeInfo.credits_sl_val = 0;
                    employeeInfo.sl_before_review = parseFloat(sl);
                    employeeInfo.sl_after_review = parseFloat(balSL);
                    employeeInfo.used_sl = 0;
                    employeeInfo.vl_before_review = parseFloat(vl);
                    employeeInfo.vl_after_review = parseFloat(balVL);

            }
            employeeInfo.key = 'b9e1f8a0553623f1:639a3e:17f68ea536b';
            employeeInfo.applic_year = parseInt(moment(employeeInfo.date_of_filing).format('YYYY'));
            employeeInfo.applic_month = parseInt(moment(employeeInfo.date_of_filing).format('M'));
            employeeInfo.date_of_filing = moment(employeeInfo.date_of_filing).format('YYYY-MM-DD');
            employeeInfo.auth_name = props.authInfo[0].auth_name;
            // employeeInfo.auth_name = employeeInfo.incharge_name;
            employeeInfo.auth_pos = formatPos(props.authInfo[0].auth_pos);
            employeeInfo.remarks = 'Certified Correct';


            // employeeInfo.auth_pos = 'City';
            if(employeeInfo.details_of_leave_id === 9){
                employeeInfo.inc_dates = null;
                employeeInfo.inc_dates1 = null;
                employeeInfo.inc_dates2 = null;
                employeeInfo.leave_code = employeeInfo.leave_code2;
            }else{
                var temp_inc_date = JSON.parse(employeeInfo.inclusive_dates);
                var temp_inc_date_arr = '';
                var temp_inc_date_arr2 = '';
                temp_inc_date.forEach((el,key) => {
                    if(key === 0){
                        if(temp_inc_date.length === key+1){
                            temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY');
                            temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY ')+ moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');

                        }else{
                            temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('MM/DD ');
                            temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY ');
                        }
                    }else if(temp_inc_date.length === key+1){
                        var interval = moment(el.date,'MM-DD-YYYY').diff(moment(temp_inc_date[key-1].date,'MM-DD-YYYY'), 'days');
                        /**
                            * If day interval is 1, means consecutive dates
                            */
                        if(interval === 1){
                            temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                            temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                        }else{
                            temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY');
                            temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY');

                        }
                    }
                    else{
                        var interval = moment(el.date).diff(moment(temp_inc_date[key-1].date), 'days');

                        if(interval !== 1){
                            temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format(';MM/DD ');
                            temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY ');

                        }else{
                            var interval2 = moment(temp_inc_date[key+1].date,'MM-DD-YYYY').diff(moment(el.date,'MM-DD-YYYY'), 'days');
                            if(interval2 !== 1){

                                temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('to MM/DD');
                                temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                            }
                        }
                    }
                });
                let dwpay = Math.round(employeeInfo.days_with_pay);
                let dwpay_days = [];
                let dwopay_days = [];
            
                if(employeeInfo.leave_type_id === 14 || employeeInfo.leave_type_id === 23 || employeeInfo.leave_type_id === 6){
                    temp_inc_date.forEach(el=>{
                        dwpay_days.push(el);
                    })
                }
                var temp_fin_inc_date_arr = temp_inc_date_arr2.split(';');
                var fin_inc_date_arr = [];
                temp_fin_inc_date_arr.forEach(el=>{
                    let dates_arr = el.split('to');
                    let date1 = dates_arr[0];
                    let date2_temp = dates_arr[1];
                    let date2;
                    if(date2_temp){
                        date2 = dates_arr[1];
                    }else{
                        date2 = dates_arr[0];
                    }
                    let total_days = moment(date2,'MM-DD-YYYY').diff(moment(date1,'MM-DD-YYYY'),'days')+1;
                    fin_inc_date_arr.push({
                        'date':el,
                        'date1':date1,
                        'date2':date2,
                        'total_days':total_days
                    })

                })
            
                if(temp_inc_date.length > 1){
                    // employeeInfo.inc_dates = moment(temp_inc_date[0].date).format('MM/DD; ')+moment(temp_inc_date[temp_inc_date.length-1].date).format('MM/DD/YYYY');
                    employeeInfo.inc_dates = temp_inc_date_arr;
                    // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                    employeeInfo.inc_dates_arr = fin_inc_date_arr;
                    
                    employeeInfo.inc_mat_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                    if(employeeInfo.leave_type_id === 10){
                        var t_wop = JSON.parse(employeeInfo.inclusive_dates_without_pay)
                        if(t_wop.length !==0){
                            employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') +moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                            employeeInfo.inc_dates2 = moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                        }else{
                            employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                            employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                        }
                    }else{
                        employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                        employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                    }
                    employeeInfo.inc_cto_dates_arr = dwpay_days;

                }else{
                    if(temp_inc_date.length>0){
                        console.log(temp_inc_date[0].date)
                        employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                        // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                        employeeInfo.inc_dates_arr = fin_inc_date_arr;
                        employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                        employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                        employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                    }else{
                        var temp_inc_date = JSON.parse(employeeInfo.inclusive_dates_without_pay);
                        var temp_inc_date_arr = '';
                        var temp_inc_date_arr2 = '';
                        temp_inc_date.forEach((el,key) => {
                            if(key === 0){
                                if(temp_inc_date.length === key+1){
                                    temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY');
                                    temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY ')+ moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');

                                }else{
                                    temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('MM/DD ');
                                    temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY ');
                                }
                            }else if(temp_inc_date.length === key+1){
                                var interval = moment(el.date,'MM-DD-YYYY').diff(moment(temp_inc_date[key-1].date,'MM-DD-YYYY'), 'days');
                                /**
                                    * If day interval is 1, means consecutive dates
                                    */
                                if(interval === 1){
                                    temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                                    temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                                }else{
                                    temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY');
                                    temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY');

                                }
                            }
                            else{
                                var interval = moment(el.date).diff(moment(temp_inc_date[key-1].date), 'days');

                                if(interval !== 1){
                                    temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format(';MM/DD ');
                                    temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY ');

                                }else{
                                    var interval2 = moment(temp_inc_date[key+1].date,'MM-DD-YYYY').diff(moment(el.date,'MM-DD-YYYY'), 'days');
                                    if(interval2 !== 1){

                                        temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('to MM/DD');
                                        temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                                    }
                                }
                            }
                        });
                        console.log(temp_inc_date[0].date)
                        employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                        // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                        employeeInfo.inc_dates_arr = fin_inc_date_arr;
                        employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                        employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                        employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                    }
                    

                    employeeInfo.inc_cto_dates_arr = dwpay_days;

                }
            }
            console.log(employeeInfo)
            // var t_data = {
            //     employee_id:props.data.employee_id,
            //     id:props.data.leave_application_id,
            //     days:parseInt(daysWP)+parseInt(daysWOP),
            //     wpay:daysWP,
            //     wopay:daysWOP,
            //     before_process:sl,
            //     after_process:balSL,
            //     vl_before:vl,
            //     vl_after:balVL,
            //     leave_type_id:props.data.leave_type_id,
            //     // ref_no:res.data.ref_no,
            //     bal_as_of:asOf,
            //     inclusive_dates:employeeInfo.inclusive_dates,
            //     borrowed_vl:lessVL,
            //     used_sl:lessSL,
            //     inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
            // }
            // console.log(t_data)
            let t_data = {
                data:employeeInfo,
                api_url:api_url
            }
            postUpdatingReviewApplicLeaveAPI(t_data)
            .then(res=>{
                console.log(res.data)
                // Swal.close();
                if(res.data.status === 200){
                    var t_data;
                    if(props.data.leave_type_id === 1 || props.data.leave_type_id === 2){
                        t_data = {
                            employee_id:props.data.employee_id,
                            dept_code:props.data.dept_code,
                            id:props.data.leave_application_id,
                            days:parseFloat(daysWP)+parseFloat(daysWOP),
                            wpay:daysWP,
                            wopay:daysWOP,
                            before_process:vl,
                            after_process:balVL,
                            sl_before:sl,
                            sl_after:balSL,
                            leave_type_id:props.data.leave_type_id,
                            ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:employeeInfo.inclusive_dates,
                            inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,

                        }
                    }else if(props.data.leave_type_id === 3){
                        t_data = {
                            employee_id:props.data.employee_id,
                            dept_code:props.data.dept_code,
                            id:props.data.leave_application_id,
                            days:parseFloat(daysWP)+parseFloat(daysWOP),
                            wpay:daysWP,
                            wopay:daysWOP,
                            before_process:sl,
                            after_process:balSL,
                            vl_before:vl,
                            vl_after:balVL,
                            leave_type_id:props.data.leave_type_id,
                            ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:employeeInfo.inclusive_dates,
                            borrowed_vl:lessVL,
                            used_sl:lessSL,
                            inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                            is_late_filing:isLateFiling
                        }
                    }else if(props.data.leave_type_id === 15){
                            t_data = {
                                employee_id:props.data.employee_id,
                                dept_code:props.data.dept_code,
                                id:props.data.leave_application_id,
                                days:props.data.days_with_pay,
                                days_hours_applied:props.data.days_hours_applied,
                                wpay:daysWP,
                                wopay:daysWOP,
                                before_process:coc,
                                after_process:balCOC,
                                vl_before:vl,
                                vl_after:balVL,
                                sl_before:sl,
                                sl_after:balSL,
                                leave_type_id:props.data.leave_type_id,
                                ref_no:res.data.ref_no,
                                bal_as_of:asOf,
                                inclusive_dates:props.data.inc,
                                others_vl:lessVL,
                                others_sl:lessSL

                            }
                    }else if(props.data.leave_type_id === 6){
                        t_data = {
                            employee_id:props.data.employee_id,
                            dept_code:props.data.dept_code,
                            id:props.data.leave_application_id,
                            days:parseFloat(daysWP)+parseFloat(daysWOP),
                            wpay:daysWP,
                            wopay:daysWOP,
                            before_process:slp,
                            after_process:balSLP,
                            vl_before:vl,
                            vl_after:balVL,
                            sl_before:sl,
                            sl_after:balSL,
                            leave_type_id:props.data.leave_type_id,
                            ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:employeeInfo.inclusive_dates,
                            borrowed_vl:lessVL,
                            used_sl:lessSL,
                            inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                            is_late_filing:isLateFiling
                        }
                    }else if(props.data.leave_type_id === 7){
                        t_data = {
                            employee_id:props.data.employee_id,
                            dept_code:props.data.dept_code,
                            id:props.data.leave_application_id,
                            days:parseFloat(daysWP)+parseFloat(daysWOP),
                            wpay:daysWP,
                            wopay:daysWOP,
                            before_process:soloParent,
                            after_process:balSoloParent,
                            vl_before:vl,
                            vl_after:balVL,
                            sl_before:sl,
                            sl_after:balSL,
                            leave_type_id:props.data.leave_type_id,
                            ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:employeeInfo.inclusive_dates,
                            borrowed_vl:lessVL,
                            used_sl:lessSL,
                            inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                            is_late_filing:isLateFiling
                        }
                    }else{
                        t_data = {
                            employee_id:props.data.employee_id,
                            dept_code:props.data.dept_code,
                            id:props.data.leave_application_id,
                            days:props.data.days_with_pay,
                            days_hours_applied:props.data.days_hours_applied,
                            wpay:daysWP,
                            wopay:daysWOP,
                            before_process:coc,
                            after_process:balCOC,
                            vl_before:vl,
                            vl_after:balVL,
                            sl_before:sl,
                            sl_after:balSL,
                            leave_type_id:props.data.leave_type_id,
                            ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:props.data.inc

                        }
                    }
                    submitLeaveApplicationUpdate(t_data)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 200){
                            props.handleAfterUpdateReview(employeeInfo.leave_application_id)
                            props.close()
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
                    })
                    
                }else{
                    if(res.data.includes('Failure getting record lock')){
                        Swal.fire({
                            icon:'warning',
                            title:'Failed to update balance',
                            text:'eGAPS table locked. Please close the tab Leave Credits Beginning Balances, and retry again'
                        })
                    }else{
                        APIError(res.data.message)
                    }
                    // Swal.fire({
                    //     icon:'error',
                    //     title:res.data.message
                    // })
                }
            }).catch(err=>{
                Swal.close();
                console.log(err)
                APIError(err)
                // window.open(api_url);
            })
        }else{
            var t_data;
            if(props.data.leave_type_id === 1 || props.data.leave_type_id === 2){
                t_data = {
                    employee_id:props.data.employee_id,
                    dept_code:props.data.dept_code,
                    id:props.data.leave_application_id,
                    days:parseFloat(daysWP)+parseFloat(daysWOP),
                    wpay:daysWP,
                    wopay:daysWOP,
                    before_process:vl,
                    after_process:balVL,
                    sl_before:sl,
                    sl_after:balSL,
                    leave_type_id:props.data.leave_type_id,
                    // ref_no:res.data.ref_no,
                    bal_as_of:asOf,
                    inclusive_dates:employeeInfo.inclusive_dates,
                    inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                    filter:props.filter


                }
            }else if(props.data.leave_type_id === 3){
                t_data = {
                    employee_id:props.data.employee_id,
                    dept_code:props.data.dept_code,
                    id:props.data.leave_application_id,
                    days:parseFloat(daysWP)+parseFloat(daysWOP),
                    wpay:daysWP,
                    wopay:daysWOP,
                    before_process:sl,
                    after_process:balSL,
                    vl_before:vl,
                    vl_after:balVL,
                    leave_type_id:props.data.leave_type_id,
                    // ref_no:res.data.ref_no,
                    bal_as_of:asOf,
                    inclusive_dates:employeeInfo.inclusive_dates,
                    borrowed_vl:lessVL,
                    used_sl:lessSL,
                    inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                    is_late_filing:isLateFiling,
                    filter:props.filter

                }
            }else if(props.data.leave_type_id === 6){
                t_data = {
                    employee_id:props.data.employee_id,
                    dept_code:props.data.dept_code,
                    id:props.data.leave_application_id,
                    days:parseFloat(daysWP)+parseFloat(daysWOP),
                    wpay:daysWP,
                    wopay:daysWOP,
                    before_process:slp,
                    after_process:balSLP,
                    vl_before:vl,
                    vl_after:balVL,
                    sl_before:sl,
                    sl_after:balSL,
                    leave_type_id:props.data.leave_type_id,
                    // ref_no:res.data.ref_no,
                    bal_as_of:asOf,
                    inclusive_dates:employeeInfo.inclusive_dates,
                    borrowed_vl:lessVL,
                    used_sl:lessSL,
                    inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                    is_late_filing:isLateFiling,
                    filter:props.filter

                }
            }else if(props.data.leave_type_id === 7){
                t_data = {
                    employee_id:props.data.employee_id,
                    dept_code:props.data.dept_code,
                    id:props.data.leave_application_id,
                    days:parseFloat(daysWP)+parseFloat(daysWOP),
                    wpay:daysWP,
                    wopay:daysWOP,
                    before_process:soloParent,
                    after_process:balSoloParent,
                    vl_before:vl,
                    vl_after:balVL,
                    sl_before:sl,
                    sl_after:balSL,
                    leave_type_id:props.data.leave_type_id,
                    // ref_no:res.data.ref_no,
                    bal_as_of:asOf,
                    inclusive_dates:employeeInfo.inclusive_dates,
                    borrowed_vl:lessVL,
                    used_sl:lessSL,
                    inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                    is_late_filing:isLateFiling,
                    filter:props.filter

                }
            }else if(props.data.leave_type_id === 14 || props.data.leave_type_id === 23){
                t_data = {
                    employee_id:props.data.employee_id,
                    dept_code:props.data.dept_code,
                    id:props.data.leave_application_id,
                    days:props.data.days_with_pay,
                    days_hours_applied:props.data.days_hours_applied,
                    wpay:daysWP,
                    wopay:daysWOP,
                    before_process:coc,
                    after_process:balCOC,
                    sl_before:sl,
                    sl_after:balSL,
                    sl_before:vl,
                    sl_after:balVL,
                    leave_type_id:props.data.leave_type_id,
                    // ref_no:res.data.ref_no,
                    bal_as_of:asOf,
                    inclusive_dates:employeeInfo.inclusive_dates,
                    inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                    filter:props.filter

                }
            }else{
                t_data = {
                    employee_id:props.data.employee_id,
                    dept_code:props.data.dept_code,
                    id:props.data.leave_application_id,
                    days:props.data.days_with_pay,
                    days_hours_applied:props.data.days_hours_applied,
                    wpay:daysWP,
                    wopay:daysWOP,
                    before_process:coc,
                    after_process:balCOC,
                    vl_before:vl,
                    vl_after:balVL,
                    sl_before:sl,
                    sl_after:balSL,
                    leave_type_id:props.data.leave_type_id,
                    // ref_no:res.data.ref_no,
                    bal_as_of:asOf,
                    inclusive_dates:props.data.inc,
                    filter:props.filter
                }
            }
            submitLeaveApplicationUpdate(t_data)
            .then(res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    props.handleAfterUpdateReview(employeeInfo.leave_application_id)
                    props.close()
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
            })
        }   
        
        
    }
    
    const handleVLEarned = (val)=>{
        if(val.target.value<0){
            setVL(0)
        }else{
            setVL(val.target.value)
        }
    }
    const handleLessVL = (val)=>{
        if(val.target.value<0){
            setLessVL(0)
        }else{
            setLessVL(val.target.value)
        }
    }

    /**
    Handle balance when vl and less vl change 
     */
    useEffect(()=>{
        if(vl>=0 || lessVL>=0){
            if(parseFloat(lessVL)>=parseFloat(vl)){
                var result = 0
            }else{
                var result =(vl-lessVL).toFixed(3)
            }
            setBalVL(result)
        }
    },[vl,lessVL])

    const handleSLEarned = (val)=>{
        if(val.target.value<0){
            setSL(0)
        }else{
            setSL(val.target.value)
        }
    }
    const handleLessSL = (val)=>{
        if(val.target.value<0){
            setLessSL(0)
        }else{
            setLessSL(val.target.value)
        }
    }

    /**
    Handle balance when sl and less sl change 
     */
    useEffect(()=>{
        if(sl>=0 || lessSL>=0){
            if(parseFloat(lessSL)>=parseFloat(sl)){
                var result = 0
            }else{
                var result =(sl-lessSL).toFixed(3)
            }
            setBalSL(result)
        }
    },[sl,lessSL])

    const handleCOCEarned = (val)=>{
        if(val.target.value<0){
            setCOC(0)
        }else{
            setCOC(val.target.value)
        }
    }
    const handleLessCOC = (val)=>{
        if(val.target.value<0){
            setLessCOC(0)
        }else{
            setLessCOC(val.target.value)
        }
    }
    useEffect(()=>{
        if(coc>=0 || lessCOC>=0){
            if(parseFloat(lessCOC)>=parseFloat(coc)){
                var result = 0
            }else{
                var result =(coc-lessCOC).toFixed(3)
            }
            setBalCOC(result)
        }
    },[coc,lessCOC])
    useEffect(()=>{
        if(slp>=0 || lessSLP>=0){
            if(parseFloat(lessSLP)>=parseFloat(slp)){
                var result = 0
            }else{
                var result =(slp-lessSLP).toFixed(3)
            }
            setBalSLP(result)
        }
    },[slp,lessSLP])
    useEffect(()=>{
        if(soloParent>=0 || lessSoloParent>=0){
            if(parseFloat(lessSoloParent)>=parseFloat(soloParent)){
                var result = 0
            }else{
                var result =(soloParent-lessSoloParent).toFixed(3)
            }
            setBalSoloParent(result)
        }
    },[soloParent,lessSoloParent])
    const [allDates,setAllDates] = useState([]);
    const [openUpdateDates,setOpenUpdateDates] = useState(false);
    const [updateType,setUpdateType] = useState('');
    const handleOpenUpdateDates = () =>{
        setOpenUpdateDates(true)
    }
    const handleCloseUpdateDates = () => {
        setOpenUpdateDates(false)
    }
    const styleUpdateDates = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:'5px',
        boxShadow: 24,
        p: 2,
    };
    const handleUpdateDates = (type) =>{
        var dwpay = JSON.parse(props.data.inclusive_dates);
        var dwopay = props.data.inclusive_dates_without_pay !== null && props.data.inclusive_dates_without_pay !== 'null' ?JSON.parse(props.data.inclusive_dates_without_pay):[];
        console.log(dwopay)
        var merge  = dwpay.concat(dwopay)
        // const unique = [...new Set(merge.map(item => item.date))];
        const unique = [...new Map(merge.map(item =>[item['date'], item])).values()];
        setAllDates(unique)
        console.log(unique)
        handleOpenUpdateDates()
        setUpdateType(type)
    }
    const handleUpdateDWOP = () =>{
        console.log(props)
    }
    const [updatedDatesDWP,setUpdatedDatesDWP] = useState([])
    const [updatedDatesDWOP,setUpdatedDatesDWOP] = useState([])
    const handleSaveUpdateDates = (data) => {
        if(updateType === 0){
            var newArr  = allDates.filter(o=> !data.some(i=> i.date === o.date));
            var daysWPay = 0;
            var daysWOPay = 0;
            data.forEach(el=>{
                if(el.period === 'NONE'){
                    daysWPay++;
                }else{
                    daysWPay+=.5;
                }
            })

            newArr.forEach(el=>{
                if(el.period === 'NONE'){
                    daysWOPay++;
                }else{
                    daysWOPay+=.5;
                }
            })
            setDaysWP(daysWPay)
            setDaysWOP(daysWOPay)
            setUpdatedDatesDWP(data)
            setUpdatedDatesDWOP(newArr)

            employeeInfo.inclusive_dates = JSON.stringify(data)
            employeeInfo.inclusive_dates_without_pay = JSON.stringify(newArr)

        }else{
            var newArr  = allDates.filter(o=> !data.some(i=> i.date === o.date));

            var daysWPay = 0;
            var daysWOPay = 0;

            data.forEach(el=>{
                if(el.period === 'NONE'){
                    daysWOPay++;
                }else{
                    daysWOPay+=.5;
                }
            })

            newArr.forEach(el=>{
                if(el.period === 'NONE'){
                    daysWPay++;
                }else{
                    daysWPay+=.5;
                }
            })
            setDaysWP(daysWPay)
            setDaysWOP(daysWOPay)

            setUpdatedDatesDWOP(data)
            setUpdatedDatesDWP(newArr)

            employeeInfo.inclusive_dates = JSON.stringify(newArr)
            employeeInfo.inclusive_dates_without_pay = JSON.stringify(data)
        }
    }
    const handleLateFiling = () =>{
        setIsLateFiling(!isLateFiling)
    }
    const submitSLPUpdate = async () => {
        
    }
    return (
        <React.Fragment>
            
            <Grid container>
                <Grid item xs={12} sx={{mt:1}}>
                    <TextField label='As of' value={asOf} onChange={(val)=>setAsOf(val.target.value)} fullWidth required/>
                </Grid>
                {
                    props.data.leave_type_id === 3
                    ?
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <FormControlLabel control={<Checkbox checked={isLateFiling} onChange={handleLateFiling} />} label="Late Filing" />
                    </Grid>
                    :
                    null
                }
                
            </Grid>
            {   
                /**
                COC
                 */
                props.data.leave_type_id === 14 || props.data.leave_type_id === 23
                ?
                <Grid container sx={{maxHeight:'60vh',overflow:matches?'scroll':'auto'}}>
                    <Grid item xs={12}>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>

                                            </TableCell>
                                            <TableCell>
                                                COC
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    Total Earned
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='Hours' type='number'  value={coc} onChange = {handleCOCEarned} inputProps={{min:0,step:'0.001'}} required/>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Less this application
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='Hours'  type='number' value={lessCOC} onChange = {handleLessCOC} inputProps={{min:0,step:'0.001'}} required/>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Balance
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='Hours'  value={balCOC} InputProps={{readOnly:true}}/>
                                                </TableCell>
                                            </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sx={{mt:2,display:'flex',justifyContent:'space-between',gap:1}}>
                        <TextField label='Days with pay' fullWidth value = {daysWP} onChange = {(val)=>setDaysWP(val.target.value)} required/>
                    </Grid>
                    {/* <Grid item xs={12}>
                        <Typography sx={{color:red[800],textAlign: 'justify',fontStyle: 'italic',fontWeight: 'bold',fontSize: '.8rem'}}>* After submission, remarks will be updated to "Certified Correct" and will be forwarded to Department Head</Typography>
                    </Grid> */}
                    <Grid item xs={12} sx={{mt:1,mb:1,display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant='contained' color = 'success' className='custom-roundbutton' onClick={handleSave}>Save</Button>
                        <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                    </Grid>
                    
                </Grid>
                /**
                End COC
                 */
                :
                /**
                Start SLP
                 */
                props.data.leave_type_id === 6
                ?
                <form onSubmit={handleSave}>
                    <Grid container spacing={2} sx={{mt:1,maxHeight:'60vh',overflow:'auto'}}>
                        <Grid item xs={12}>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>

                                            </TableCell>
                                            <TableCell>
                                                Vacation Leave
                                            </TableCell>
                                            <TableCell>
                                                Sick Leave
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    Total Earned
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='VL' type='number'  value={vl} onChange = {handleVLEarned} inputProps={{min:0,step:'0.001'}}/>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='SL' type='number' value={sl} onChange = {handleSLEarned} inputProps={{min:0,step:'0.001'}}/>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Less this application
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='VL'  type='number' value={lessVL} onChange = {handleLessVL} required/>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='SL' type='number' value={lessSL} onChange = {handleLessSL} required/>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Balance
                                                </TableCell>
                                                <TableCell>
                                                    {/* <TextField label='VL'  value={balVL} onChange = {(val)=>setBalVL(val.target.value)} InputProps={{readOnly:true}}/> */}
                                                    <TextField label='VL'  value={balVL} InputProps={{readOnly:true}}/>
                                                </TableCell>
                                                <TableCell>
                                                    {/* <TextField label='SL' value={balSL} onChange = {(val)=>setBalSL(val.target.value)}/> */}
                                                    <TextField label='SL' value={balSL} InputProps={{readOnly:true}}/>
                                                </TableCell>
                                            </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label = 'SLP' type='number' value={slp} onChange={(val)=>setSLP(val.target.value)} inputProps={{max:3}} fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label = 'Less this application' type='number' value={lessSLP} onChange={(val)=>setLessSLP(val.target.value)} fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label = 'Balance' value={balSLP} type='number' onChange={(val)=>setBalSLP(val.target.value)} fullWidth InputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant='contained' color = 'success' className='custom-roundbutton' type='submit'>Save</Button>
                        <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                    </Grid>
                </Grid>
                </form>
                /**
                End SLP
                 */
                :
                /**
                Start Solo Parent
                 */
                props.data.leave_type_id === 7
                ?
                <form onSubmit={handleSave}>
                    <Grid container spacing={2} sx={{mt:1,maxHeight:'60dvh',overflow:'auto'}}>
                        <Grid item xs={12}>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>

                                            </TableCell>
                                            <TableCell>
                                                Vacation Leave
                                            </TableCell>
                                            <TableCell>
                                                Sick Leave
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    Total Earned
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='VL' type='number'  value={vl} onChange = {handleVLEarned} inputProps={{min:0,step:'0.001'}}/>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='SL' type='number' value={sl} onChange = {handleSLEarned} inputProps={{min:0,step:'0.001'}}/>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Less this application
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='VL'  type='number' value={lessVL} onChange = {handleLessVL} required/>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField label='SL' type='number' value={lessSL} onChange = {handleLessSL} required/>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Balance
                                                </TableCell>
                                                <TableCell>
                                                    {/* <TextField label='VL'  value={balVL} onChange = {(val)=>setBalVL(val.target.value)} InputProps={{readOnly:true}}/> */}
                                                    <TextField label='VL'  value={balVL} InputProps={{readOnly:true}}/>
                                                </TableCell>
                                                <TableCell>
                                                    {/* <TextField label='SL' value={balSL} onChange = {(val)=>setBalSL(val.target.value)}/> */}
                                                    <TextField label='SL' value={balSL} InputProps={{readOnly:true}}/>
                                                </TableCell>
                                            </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label = 'Solo Parent' type='number' value={soloParent} onChange={(val)=>setSoloParent(val.target.value)} inputProps={{max:7}} fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label = 'Less this application' type='number' value={lessSoloParent} onChange={(val)=>setLessSoloParent(val.target.value)} inputProps={{min:1}} fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label = 'Balance' value={balSoloParent} type='number' onChange={(val)=>setBalSoloParent(val.target.value)} fullWidth InputProps={{readOnly:true}}/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant='contained' color = 'success' className='custom-roundbutton' type='submit'>Save</Button>
                        <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                    </Grid>
                </Grid>
                </form>
                /**
                End Solo Parent
                 */
                :
                <form onSubmit = {handleSave}>
                <Grid container sx={{maxHeight:'65dvh',overflow:matches?'scroll':'auto'}}>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>

                                        </TableCell>
                                        <TableCell>
                                            Vacation Leave
                                        </TableCell>
                                        <TableCell>
                                            Sick Leave
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Total Earned
                                            </TableCell>
                                            <TableCell>
                                                <TextField label='VL' type='number'  value={vl} onChange = {handleVLEarned} inputProps={{min:0,step:'0.001'}}/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField label='SL' type='number' value={sl} onChange = {handleSLEarned} inputProps={{min:0,step:'0.001'}}/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Less this application
                                            </TableCell>
                                            <TableCell>
                                                <TextField label='VL'  type='number' value={lessVL} onChange = {handleLessVL} required/>
                                            </TableCell>
                                            <TableCell>
                                                <TextField label='SL' type='number' value={lessSL} onChange = {handleLessSL} required/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Balance
                                            </TableCell>
                                            <TableCell>
                                                {/* <TextField label='VL'  value={balVL} onChange = {(val)=>setBalVL(val.target.value)} InputProps={{readOnly:true}}/> */}
                                                <TextField label='VL'  value={balVL} InputProps={{readOnly:true}}/>
                                            </TableCell>
                                            <TableCell>
                                                {/* <TextField label='SL' value={balSL} onChange = {(val)=>setBalSL(val.target.value)}/> */}
                                                <TextField label='SL' value={balSL} InputProps={{readOnly:true}}/>
                                            </TableCell>
                                        </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{mt:2,display:'flex',justifyContent:'space-between',gap:1}}>
                    <TextField label='Days with pay' fullWidth value = {daysWP} onChange = {(val)=>setDaysWP(val.target.value)} required
                    InputProps={{endAdornment: (
                        <InputAdornment position="end">
                        <Tooltip title='Update days without pay'>
                        <IconButton color='success' onClick={()=>handleUpdateDates(0)}>
                        <EditIcon />
                        </IconButton>
                        </Tooltip>
                        </InputAdornment>
                    ),
                    }} />
                    <TextField label='Days without pay' fullWidth value = {daysWOP}  onChange = {(val)=>setDaysWOP(val.target.value)} required
                    InputProps={{endAdornment: (
                        <InputAdornment position="end">
                        <Tooltip title='Update days without pay'>
                        <IconButton color='success' onClick={()=>handleUpdateDates(1)}>
                        <EditIcon />
                        </IconButton>
                        </Tooltip>
                        </InputAdornment>
                    ),
                    }}/>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{color:red[800],textAlign: 'justify',fontStyle: 'italic',fontWeight: 'bold',fontSize: '.8rem'}}>* After submission, remarks will be updated to "Certified Correct" and will be forwarded to Department Head</Typography>
                </Grid>
                <Grid item xs={12} sx={{mt:1,mb:1,display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant='contained' color = 'success' className='custom-roundbutton' type='submit'>Save</Button>
                    <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                </Grid>
                
            </Grid>
            </form>
            }
            
            <Modal
                open={openUpdateDates}
                onClose={handleCloseUpdateDates}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleUpdateDates}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Updating {updateType === 0 ? 'date/s with pay':'date/s without pay'}
                </Typography>
                <Box>
                    <UpdateDates data = {allDates} close={handleCloseUpdateDates} handleSave = {handleSaveUpdateDates}/>
                </Box>
                </Box>
            </Modal>
        </React.Fragment>
        
    )
 }