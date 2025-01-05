import React,{useEffect, useState} from 'react';
import {Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,TableFooter, Typography,Paper, Stack, Skeleton} from '@mui/material'
import Swal from 'sweetalert2';
import { getDTRAPI } from '../EarnCOCRequest';
import moment from 'moment';
import { timeDiff } from '../../../timediff/TimeDiff';
import {green} from '@mui/material/colors';
import '.././EarnCOC.css';
import { api_url } from '../../../../../request/APIRequestURL';
import { formatTimeWithPeriod, formatTimeWithoutPeriod, truncateToDecimals } from '../../../customstring/CustomString';

export default function ApplicableData(props){
    const [weekDaysEarnedWpayData,setWeekDaysEarnedWpayData] = useState([]);
    const [weekDaysEarnedCOCData,setWeekDaysEarnedCOCData] = useState([]);
    const [weekEndsEarnedWpayData,setWeekEndsEarnedWpayData] = useState([]);
    const [holidaysEarnedWpayData,setHolidaysEarnedWpayData] = useState([]);
    const [weekEndsEarnedCOCData,setWeekEndsEarnedCOCData] = useState([]);
    const [holidaysEarnedCOCData,setHolidaysEarnedCOCData] = useState([]);
    const [totalWeekDaysWpay,setTotalWeekDaysWpay] = useState(0);
    const [totalWeekDaysCOC,setTotalWeekDaysCOC] = useState(0);
    const [totalWeekEndsWpay,setTotalWeekEndsWpay] = useState(0);
    const [totalWeekEndsCOC,setTotalWeekEndsCOC] = useState(0);
    const [totalHolidaysWpay,setTotalHolidaysWpay] = useState(0);

    const [totalHolidaysCOC,setTotalHolidaysCOC] = useState(0);
    const [loadingData,setLoadingData] = useState(true)
    const [overAllCOC,setOverAllCOC] = useState(0)
    useEffect(()=>{
        console.log(props.data)
        Swal.fire({
            icon:'info',
            title:'Fetching available Overtime details',
            html:'Please wait...',
            showConfirmButton:false,
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        var t_data = {
            dates:props.data.date_period,
            emp_no:props.data.emp_no
        }
        getDTRAPI(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.response.length === 0){
            Swal.close()
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:'DTR not Found !'
                })
            }else{
                var t_weekdays = [];
                var t_weekends = [];
                var t_holidays = [];
                var t_overall_coc = 0;
                if(props.data.weekdays_from !== null){
                    /**
                    Get data if scheduled overtime is weekdays
                     */
                    /**
                    Skip work date that has late and undertime
                     */
                    t_weekdays = res.data.response.filter((el)=>{
                        return moment(el.work_date, 'YYYY-MM-DD').isBusinessDay() && parseInt(el.late_minutes) === 0 && parseInt(el.under_time) === 0 && parseInt(el.leave_day) === 0 && parseInt(el.day_type) !== 2
                    })
                   
                    /**
                    compute total hours duration of schedule overtime
                    */
                    
                    /**
                     * convert time to hours via total minutes
                     */
                    var t_time  = (timeDiff(props.data.weekdays_from,props.data.weekdays_to)).split(':')
                    var t_duration_hours = parseInt(t_time[0]);
                    var t_duration_minutes = parseInt(t_time[1]);
                    var t_overtime_minutes = (parseInt(t_duration_hours)*60)+parseInt(t_duration_minutes);
                    var t_overtime_weekdays_arr = [];
                    var t_total_weekdays_wpay = 0;
                    var t_total_weekdays_coc = 0;
                    var t_total_weekends_wpay = 0;
                    var t_total_weekends_coc = 0;
                    var t_weekdays_wpay_details = [];
                    var t_weekdays_coc_details = [];
                    t_weekdays.forEach(el=>{
                        var actual_out = el.adjust_out?el.adjust_out:el.actual_out
                        // console.log(el)
                        var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(actual_out, 'H:mm').format('H:mm'));
                        if(isValid && (el.time_out.includes('am')|| el.time_out.includes('pm'))){

                            /**
                            Check if actual out counted as overtime
                             */
                            if(moment(actual_out, 'H:mm').format('H:mm')>=moment(props.data.weekdays_from, 'H:mm').format('H:mm')){
                                var t_calc_overtime = (timeDiff(props.data.weekdays_from,actual_out)).split(':')
                                var t_total_minutes = (parseInt(t_calc_overtime[0])*60)+parseInt(t_calc_overtime[1])
                                /**
                                Credits to COC
                                */
                                if(props.data.weekdays_max_ot === null){
                                    
                                    if(t_total_minutes>=t_overtime_minutes){
                                        t_total_weekdays_coc+=t_overtime_minutes;
                                        var p_break = el.Actual_Break.split(';')
                                        t_weekdays_coc_details.push({
                                            'date':el.work_date,
                                            'time_in':el.actual_in,
                                            'break_out':p_break[0],
                                            'break_in':p_break[1],
                                            'time_out':actual_out,
                                            'earned':t_overtime_minutes
                                        })
                                    }else{
                                        if(t_total_minutes>=60){
                                            t_total_weekdays_coc+=t_total_minutes;
                                            var p_break = el.Actual_Break.split(';')
                                            t_weekdays_coc_details.push({
                                                'date':el.work_date,
                                                'time_in':el.actual_in,
                                                'break_out':p_break[0],
                                                'break_in':p_break[1],
                                                'time_out':actual_out,
                                                'earned':t_total_minutes
                                            })
                                        }
                                    }
                                }else{
                                    /**
                                    Credits to with pay if at least 2 hours rendered
                                    */
                                    if(t_total_minutes>=120){
                                        if(t_total_minutes>=t_overtime_minutes){
                                            t_total_weekdays_wpay+=t_overtime_minutes;
                                            var p_break = el.Actual_Break.split(';')
                                            t_weekdays_wpay_details.push({
                                                'date':el.work_date,
                                                'time_in':el.actual_in,
                                                'break_out':p_break[0],
                                                'break_in':p_break[1],
                                                'time_out':actual_out,
                                                'earned':t_overtime_minutes
                                            })
                                        }else{
                                            t_total_weekdays_wpay+=t_total_minutes;
                                            var p_break = el.Actual_Break.split(';')
                                            t_weekdays_wpay_details.push({
                                                'date':el.work_date,
                                                'time_in':el.actual_in,
                                                'break_out':p_break[0],
                                                'break_in':p_break[1],
                                                'time_out':actual_out,
                                                'earned':t_total_minutes
                                            })
                                        }
                                    }else{
                                        if(t_total_minutes>=60){
                                            t_total_weekdays_coc+=t_total_minutes;
                                            var p_break = el.Actual_Break.split(';')
                                            t_weekdays_coc_details.push({
                                                'date':el.work_date,
                                                'time_in':el.actual_in,
                                                'break_out':p_break[0],
                                                'break_in':p_break[1],
                                                'time_out':actual_out,
                                                'earned':t_total_minutes
                                            })
                                        }
                                    }

                                }
                                t_overtime_weekdays_arr.push(el)
                                
                            }
                            
                        }
                        
                    })
                    /**
                    Check if max ot is set
                     */
                    if(props.data.weekdays_max_ot !== null){
                        var t_max_ot_minutes = props.data.weekdays_max_ot*60;
                        var to_coc;
                        var weekdays_wpay_factor = props.data.weekdays_wpay_cfactor;
                        if(t_total_weekdays_wpay>=t_max_ot_minutes){
                            to_coc = t_total_weekdays_wpay-t_max_ot_minutes;
                            // console.log(t_total_weekdays_wpay)
                            setTotalWeekDaysCOC(t_total_weekdays_coc+(to_coc*weekdays_wpay_factor))
                            props.setTotalWeekDaysCOC(t_total_weekdays_coc+(to_coc*weekdays_wpay_factor))
                            
                            setTotalWeekDaysWpay(t_max_ot_minutes)
                            props.setTotalWeekDaysWpay(t_max_ot_minutes)
                            t_overall_coc+=t_total_weekdays_coc+(to_coc*weekdays_wpay_factor)
                            // setTotalWeekDaysWpay(t_total_weekdays_wpay)
                        }else{
                            // setTotalWeekDaysWpay(t_total_weekdays_wpay)
                            setTotalWeekDaysCOC(t_total_weekdays_coc)
                            props.setTotalWeekDaysCOC(t_total_weekdays_coc)
                            t_overall_coc+=t_total_weekdays_coc
                        }
                    }else{
                        /**
                        Recalculate total weekdays to avoid auto roundoff
                        */
                        var t_total_weekdays_coc2 = 0;
                        var t_total_weekdays_coc_final = 0;
                        t_weekdays_coc_details.forEach(el=>{
                            t_total_weekdays_coc2+= truncateToDecimals(parseFloat((el.earned/60)))
                            t_total_weekdays_coc_final+=truncateToDecimals(el.earned/60)
                        })
                        setTotalWeekDaysCOC(t_total_weekdays_coc2)
                        props.setTotalWeekDaysCOC(t_total_weekdays_coc_final)

                        t_overall_coc+=t_total_weekdays_coc
                    }
                    setWeekDaysEarnedWpayData(t_weekdays_wpay_details)
                    props.setWeekDaysEarnedWpayData(t_weekdays_wpay_details)
                    
                    setWeekDaysEarnedCOCData(t_weekdays_coc_details)
                    props.setWeekDaysEarnedCOCData(t_weekdays_coc_details)

                }

                if(props.data.weekends_from !== null){
                    /**
                    Get data if scheduled overtime is weekends
                     */
                    t_weekends = res.data.response.filter((el)=>{
                        return !moment(el.work_date, 'YYYY-MM-DD').isBusinessDay() && parseInt(el.day_type) === 1
                    })
                    /**
                        Get data if scheduled overtime is weekdays
                    */
                   
                    /**
                    compute total hours duration of schedule overtime
                    */
                    
                    /**
                     * convert time to hours via total minutes
                     */
                    var t_time  = (timeDiff(props.data.weekends_from,props.data.weekends_to)).split(':')
                    var t_duration_hours = parseInt(t_time[0]);
                    var t_duration_minutes = parseInt(t_time[1]);
                    var t_overtime_minutes = (parseInt(t_duration_hours)*60)+parseInt(t_duration_minutes);

                    var t_overtime_weekdays_arr = [];
                    var t_total_weekends_wpay = 0;
                    var t_total_weekends_coc = 0;
                    var t_weekends_wpay_details = [];
                    var t_weekends_coc_details = [];
                    var t_d_from = new Date();
                    t_d_from.setHours((props.data.weekends_from.split(':'))[0]);
                    t_d_from.setMinutes((props.data.weekends_from.split(':'))[1]);


                    var t_d_to = new Date();
                    t_d_to.setHours((props.data.weekends_to.split(':'))[0]);
                    t_d_to.setMinutes((props.data.weekends_to.split(':'))[1]);

                    /**
                    Set break time
                     */

                    
                    var t_break1 = new Date();
                    t_break1.setHours(13,0)

                    var t_break2 = new Date();
                    t_break2.setHours(18,0)

                    var count_break_hours = 0;
                    if(moment(t_d_from).format('H:mm') > moment(t_break1).format('H:mm') && moment(t_break1).format('H:mm') < moment(t_d_to).format('H:mm')){
                        count_break_hours++;
                    }
                    if(moment(t_d_from).format('H:mm') > moment(t_break2).format('H:mm') && moment(t_break2).format('H:mm') < moment(t_d_to).format('H:mm')){
                        count_break_hours++;
                    }
                    t_weekends.forEach(el=>{
                        var actual_out = el.adjust_out?el.adjust_out:el.actual_out

                        var is_coc = false;
                        var is_wpay = false;
                        /**
                        check if has time in
                         */
                        
                        var t_bin_bout = el.Actual_Break.split(';');
                        // var t_bin = t_bin_bout[1];
                        // var t_bout = t_bin_bout[0];
                        var t_bin = el.adjust_break2?el.adjust_break2:t_bin_bout[1];
                        var t_bout = el.adjust_break1?el.adjust_break1:t_bin_bout[0];
                        var t_diff_from_am =0;
                        var t_diff_from_pm =0;
                        var t_diff_from_total_minutes;
                        if(el.time_in !== ''){
                            /**
                            Check if break out is not null and between of overtime sched
                             */
                            if(t_bout !== ''){
                                var t_bout_arr = t_bout.split(':');

                                var t_timein_arr = el.actual_in.split(':');

                                var t_timein_format = new Date();
                                t_timein_format.setHours(t_timein_arr[0],t_timein_arr[1],0)

                                var t_break1 = new Date();
                                t_break1.setHours(8,0,0);

                                var t_break2 = new Date();
                                t_break2.setHours(13,0,0);

                                var t_format_breakout = new Date();
                                t_format_breakout.setHours(t_bout_arr[0],t_bout_arr[1])
                                
                                /**
                                Check if from period is AM, if AM break hours 7-8, 12-1
                                 */
                                /**
                                Check which break between the overtime period
                                 */
                                // console.log(moment(t_d_from).format('H:mm') < moment(t_break1).format('H:mm') )
                                // console.log(moment(t_d_from).format('H:mm') > moment(t_break2).format('H:mm') )
                                if(moment(t_d_from).format('H:mm') < moment(t_break1).format('H:mm')){

                                }
                                if(moment(t_d_from).format('H:mm') > moment(t_break2).format('H:mm')){
                                    console.log(moment(t_d_from).format('H:mm'))
                                    console.log(moment(t_timein_format).format('H:mm'))
                                    /**
                                    Check if break out is greater than 12, then timeDiff function second param will be 12
                                     */
                                    if(t_bout_arr[0]>=12){
                                        /**
                                         * 
                                         Check if time in is earlier
                                         */
                                        if(el.actual_in>=props.data.weekends_from){
                                            var t_diff_from = (timeDiff(el.actual_in,'12:00')).split(':')

                                        }else{
                                            var t_diff_from = (timeDiff(props.data.weekends_from,'12:00')).split(':')
                                        }
                                    }else{
                                        var t_diff_from = (timeDiff(props.data.weekends_from,t_bout)).split(':')
                                    }
                                    var t_diff_from_hours = parseInt(t_diff_from[0]);
                                    var t_diff_from_minutes = parseInt(t_diff_from[1]);
                                    t_diff_from_am = (t_diff_from_hours*60)+t_diff_from_minutes;
                                    console.log(t_diff_from)

                                    /**
                                    Check if set max ot, if null credits to coc
                                     */
                                    if(props.data.weekends_max_ot === null){
                                        if(t_diff_from_am>=60){
                                            t_total_weekends_coc+=t_diff_from_am;
                                            is_coc = true;
                                        }
                                    }else{
                                        if(t_diff_from_am>=120){
                                            t_total_weekends_wpay+=t_diff_from_am;
                                            is_wpay = true;

                                        }else{
                                            if(t_diff_from_am>=60){
                                                t_total_weekends_coc+=t_diff_from_am;
                                                is_coc = true;

                                            }
                                        }
                                    }
                                }
                            }
                        // console.log(el.work_date)
                        // console.log(t_diff_from_total_minutes)

                        }
                        if(t_bin !== ''){
                            /**
                            Check if time out is not null and between of overtime sched
                             */
                            if(el.time_out !== ''){
                                var t_bin_arr = t_bin.split(':');
                                var t_timeout_arr = actual_out.split(':');

                                var t_break1 = new Date();
                                t_break1.setHours(13,0,0);

                                var t_break2 = new Date();
                                t_break2.setHours(18,0,0);

                                var t_format_breakin = new Date();
                                t_format_breakin.setHours(t_bin_arr[0],t_bin_arr[1])

                                var t_format_timeout = new Date();
                                t_format_timeout.setHours(t_timeout_arr[0],t_timeout_arr[1])
                                
                                /**
                                Check if from period is AM, if AM break hours 7-8, 12-1
                                 */
                                /**
                                Check which break between the overtime period
                                 */
                                // console.log(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm') )
                                if(moment(t_d_to).format('H:mm') > moment(t_break1).format('H:mm')){
                                    var t_diff_from;
                                     if(t_bin_arr[0]<=13){
                                        if(t_bin_arr[1]>0 && t_bin_arr[0]>=13){
                                            /**
                                            Check if timeout is greater than period to
                                            */
                                            console.log(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm'))
                                            if(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm')){
                                                t_diff_from = (timeDiff(t_bin,props.data.weekends_to)).split(':')
                                            }else{
                                                t_diff_from = (timeDiff(t_bin,actual_out)).split(':')
                                            }
                                        }else{
                                            /**
                                            Check if timeout is greater than period to
                                            */
                                            if(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm')){
                                                t_diff_from = (timeDiff('13:00',props.data.weekends_to)).split(':')
                                            }else{
                                                t_diff_from = (timeDiff('13:00',actual_out)).split(':')
                                            }
                                        }
                                        
                                    }else{
                                        if(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm')){
                                            t_diff_from = (timeDiff(t_bin,props.data.weekends_to)).split(':')
                                        }else{
                                            t_diff_from = (timeDiff(t_bin,actual_out)).split(':')
                                        }
                                    }
                                    var t_diff_from_hours = parseInt(t_diff_from[0]);
                                    var t_diff_from_minutes = parseInt(t_diff_from[1]);
                                    t_diff_from_pm = (t_diff_from_hours*60)+t_diff_from_minutes;
                                    console.log(t_diff_from)

                                    /**
                                    Check if set max ot, if null credits to coc
                                     */
                                    if(props.data.weekends_max_ot === null){
                                        if(t_diff_from_pm>=60){
                                            t_total_weekends_coc+=t_diff_from_pm;
                                            is_coc = true;

                                        }
                                    }else{
                                        if(t_diff_from_pm>=120){
                                            t_total_weekends_wpay+=t_diff_from_pm;
                                            is_wpay = true;

                                        }else{
                                            if(t_diff_from_pm>=60){
                                                t_total_weekends_coc+=t_diff_from_pm;
                                                is_coc = true;

                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        if(is_coc){
                            var p_break = el.Actual_Break.split(';')
                            t_weekends_coc_details.push({
                                'date':el.work_date,
                                'time_in':el.actual_in?el.actual_in:formatTimeWithoutPeriod(el.time_in),
                                'break_out':p_break[0]?p_break[0]:el.adjust_break1,
                                'break_in':p_break[1]?p_break[1]:el.adjust_break2,
                                'time_out':actual_out,
                                'earned':t_diff_from_am+t_diff_from_pm
                            })
                        }
                        if(is_wpay){
                            var p_break = el.Actual_Break.split(';');
                            if((t_diff_from_am+t_diff_from_pm)>=(t_duration_hours*60+t_duration_minutes)){
                            }
                            t_weekends_wpay_details.push({
                                'date':el.work_date,
                                'time_in':el.actual_in?el.actual_in:formatTimeWithoutPeriod(el.time_in),
                                'break_out':p_break[0]?p_break[0]:el.adjust_break1,
                                'break_in':p_break[1]?p_break[1]:el.adjust_break2,
                                'time_out':actual_out,
                                'earned':t_diff_from_am+t_diff_from_pm
                            })
                        }

                    })
                    /**
                    Check if max ot is set
                     */
                    if(props.data.weekends_max_ot !== null){
                        var t_max_ot_minutes = props.data.weekends_max_ot*60;
                        var to_coc;
                        var weekends_wpay_factor = props.data.weekends_wpay_cfactor;
                        if(t_total_weekends_wpay>=t_max_ot_minutes){
                            to_coc = t_total_weekends_wpay-t_max_ot_minutes;
                            console.log(to_coc)
                            setTotalWeekEndsCOC(t_total_weekends_coc+(to_coc*weekends_wpay_factor))
                            props.setTotalWeekEndsCOC(t_total_weekends_coc+(to_coc*weekends_wpay_factor))
                            
                            setTotalWeekEndsWpay(t_max_ot_minutes)
                            props.setTotalWeekEndsWpay(t_max_ot_minutes)
                            t_overall_coc+=t_total_weekends_coc+(to_coc*weekends_wpay_factor)

                        }else{
                            // setTotalWeekEndsWpay(t_total_weekends_wpay)
                            setTotalWeekEndsWpay(t_total_weekends_coc)
                            props.setTotalWeekEndsWpay(t_total_weekends_coc)
                        }
                    }else{
                        /**
                        Recalculate total weekdays to avoid auto roundoff
                        */
                        var t_total_weekends_coc2 = 0;
                        var t_total_weekdays_coc_final = 0;
                        var weekends_coc_factor = props.data.weekends_coc_cfactor;

                        t_weekends_coc_details.forEach(el=>{
                            t_total_weekends_coc2+= truncateToDecimals(parseFloat((el.earned/60)))
                            t_total_weekdays_coc_final+=truncateToDecimals(el.earned/60)

                        })
                        setTotalWeekEndsCOC(t_total_weekends_coc2*weekends_coc_factor)
                        props.setTotalWeekEndsCOC(t_total_weekdays_coc_final*weekends_coc_factor)
                        t_overall_coc+=t_total_weekends_coc
                    }
                    setWeekEndsEarnedWpayData(t_weekends_wpay_details)
                    props.setWeekEndsEarnedWpayData(t_weekends_wpay_details)
                    setWeekEndsEarnedCOCData(t_weekends_coc_details)
                    props.setWeekEndsEarnedCOCData(t_weekends_coc_details)
                    setLoadingData(false)
                    Swal.close()

                }
                if(props.data.holidays_from !== null){
                    /**
                    Get data if scheduled overtime is weekends
                     */
                    t_holidays = res.data.response.filter((el)=>{
                        return parseInt(el.day_type) === 2 || parseInt(el.day_type) === 3
                    })
                    /**
                        Get data if scheduled overtime is weekdays
                    */
                   
                    /**
                    compute total hours duration of schedule overtime
                    */
                    
                    /**
                     * convert time to hours via total minutes
                     */
                    var t_time  = (timeDiff(props.data.holidays_from,props.data.holidays_to)).split(':')
                    var t_duration_hours = parseInt(t_time[0]);
                    var t_duration_minutes = parseInt(t_time[1]);
                    var t_overtime_minutes = (parseInt(t_duration_hours)*60)+parseInt(t_duration_minutes);

                    var t_overtime_holidays_arr = [];
                    var t_total_holidays_wpay = 0;
                    var t_total_holidays_coc = 0;
                    var t_holidayss_wpay_details = [];
                    var t_holidays_coc_details = [];
                    var t_d_from = new Date();
                    t_d_from.setHours((props.data.holidays_from.split(':'))[0]);
                    t_d_from.setMinutes((props.data.holidays_from.split(':'))[1]);


                    var t_d_to = new Date();
                    t_d_to.setHours((props.data.holidays_to.split(':'))[0]);
                    t_d_to.setMinutes((props.data.holidays_to.split(':'))[1]);

                    /**
                    Set break time
                     */

                    
                    var t_break1 = new Date();
                    t_break1.setHours(13,0)

                    var t_break2 = new Date();
                    t_break2.setHours(18,0)

                    var count_break_hours = 0;
                    if(moment(t_d_from).format('H:mm') > moment(t_break1).format('H:mm') && moment(t_break1).format('H:mm') < moment(t_d_to).format('H:mm')){
                        count_break_hours++;
                    }
                    if(moment(t_d_from).format('H:mm') > moment(t_break2).format('H:mm') && moment(t_break2).format('H:mm') < moment(t_d_to).format('H:mm')){
                        count_break_hours++;
                    }
                    t_holidays.forEach(el=>{
                        var actual_out = el.adjust_out?el.adjust_out:el.actual_out

                        var is_coc = false;
                        var is_wpay = false;
                        /**
                        check if has time in
                         */
                        
                        var t_bin_bout = el.Actual_Break.split(';');
                        // var t_bin = t_bin_bout[1];
                        // var t_bout = t_bin_bout[0];
                        var t_bin = el.adjust_break2?el.adjust_break2:t_bin_bout[1];
                        var t_bout = el.adjust_break1?el.adjust_break1:t_bin_bout[0];
                        var t_diff_from_am =0;
                        var t_diff_from_pm =0;
                        var t_diff_from_total_minutes;
                        if(el.time_in !== ''){
                            /**
                            Check if break out is not null and between of overtime sched
                             */
                            if(t_bout !== ''){
                                var t_bout_arr = t_bout.split(':');

                                var t_timein_arr = el.actual_in.split(':');

                                var t_timein_format = new Date();
                                t_timein_format.setHours(t_timein_arr[0],t_timein_arr[1],0)

                                var t_break1 = new Date();
                                t_break1.setHours(8,0,0);

                                var t_break2 = new Date();
                                t_break2.setHours(13,0,0);

                                var t_format_breakout = new Date();
                                t_format_breakout.setHours(t_bout_arr[0],t_bout_arr[1])
                                
                                /**
                                Check if from period is AM, if AM break hours 7-8, 12-1
                                 */
                                /**
                                Check which break between the overtime period
                                 */
                                // console.log(moment(t_d_from).format('H:mm') < moment(t_break1).format('H:mm') )
                                // console.log(moment(t_d_from).format('H:mm') > moment(t_break2).format('H:mm') )
                                if(moment(t_d_from).format('H:mm') < moment(t_break1).format('H:mm')){

                                }
                                if(moment(t_d_from).format('H:mm') > moment(t_break2).format('H:mm')){
                                    console.log(moment(t_d_from).format('H:mm'))
                                    console.log(moment(t_timein_format).format('H:mm'))
                                    /**
                                    Check if break out is greater than 12, then timeDiff function second param will be 12
                                     */
                                    if(t_bout_arr[0]>=12){
                                        /**
                                         * 
                                         Check if time in is earlier
                                         */
                                        if(el.actual_in>=props.data.holidays_from){
                                            var t_diff_from = (timeDiff(el.actual_in,'12:00')).split(':')

                                        }else{
                                            var t_diff_from = (timeDiff(props.data.holidays_from,'12:00')).split(':')
                                        }
                                    }else{
                                        var t_diff_from = (timeDiff(props.data.holidays_from,t_bout)).split(':')
                                    }
                                    var t_diff_from_hours = parseInt(t_diff_from[0]);
                                    var t_diff_from_minutes = parseInt(t_diff_from[1]);
                                    t_diff_from_am = (t_diff_from_hours*60)+t_diff_from_minutes;
                                    console.log(t_diff_from)

                                    if(t_diff_from_am>=60){
                                        t_total_holidays_coc+=t_diff_from_am;
                                        is_coc = true;
                                    }
                                }
                            }
                        // console.log(el.work_date)
                        // console.log(t_diff_from_total_minutes)

                        }
                        console.log(t_bin)
                        if(t_bin !== ''){
                            /**
                            Check if time out is not null and between of overtime sched
                             */
                            if(el.time_out !== ''){
                                var t_bin_arr = t_bin.split(':');
                                var t_timeout_arr = actual_out.split(':');

                                var t_break1 = new Date();
                                t_break1.setHours(13,0,0);

                                var t_break2 = new Date();
                                t_break2.setHours(18,0,0);

                                var t_format_breakin = new Date();
                                t_format_breakin.setHours(t_bin_arr[0],t_bin_arr[1])

                                var t_format_timeout = new Date();
                                t_format_timeout.setHours(t_timeout_arr[0],t_timeout_arr[1])
                                
                                /**
                                Check if from period is AM, if AM break hours 7-8, 12-1
                                 */
                                /**
                                Check which break between the overtime period
                                 */
                                // console.log(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm') )
                                if(moment(t_d_to).format('H:mm') > moment(t_break1).format('H:mm')){
                                    var t_diff_from;
                                     if(t_bin_arr[0]<=13){
                                        if(t_bin_arr[1]>0 && t_bin_arr[0]>=13){
                                            /**
                                            Check if timeout is greater than period to
                                            */
                                            console.log(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm'))
                                            if(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm')){
                                                t_diff_from = (timeDiff(t_bin,props.data.holidays_to)).split(':')
                                            }else{
                                                t_diff_from = (timeDiff(t_bin,actual_out)).split(':')
                                            }
                                        }else{
                                            /**
                                            Check if timeout is greater than period to
                                            */
                                            if(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm')){
                                                t_diff_from = (timeDiff('13:00',props.data.holidays_to)).split(':')
                                            }else{
                                                t_diff_from = (timeDiff('13:00',actual_out)).split(':')
                                            }
                                        }
                                        
                                    }else{
                                        if(moment(t_format_timeout).format('H:mm') > moment(t_d_to).format('H:mm')){
                                            t_diff_from = (timeDiff(t_bin,props.data.holidays_to)).split(':')
                                        }else{
                                            t_diff_from = (timeDiff(t_bin,actual_out)).split(':')
                                        }
                                    }
                                    var t_diff_from_hours = parseInt(t_diff_from[0]);
                                    var t_diff_from_minutes = parseInt(t_diff_from[1]);
                                    t_diff_from_pm = (t_diff_from_hours*60)+t_diff_from_minutes;
                                    if(t_diff_from_pm>=60){
                                        t_total_holidays_coc+=t_diff_from_pm;
                                        is_coc = true;

                                    }
                                }
                            }
                        }
                        
                        if(is_coc){
                            var p_break = el.Actual_Break.split(';')
                            t_holidays_coc_details.push({
                                'date':el.work_date,
                                'time_in':el.actual_in?el.actual_in:formatTimeWithoutPeriod(el.time_in),
                                'break_out':p_break[0]?p_break[0]:el.adjust_break1,
                                'break_in':p_break[1]?p_break[1]:el.adjust_break2,
                                'time_out':actual_out,
                                'earned':t_diff_from_am+t_diff_from_pm
                            })
                        }

                    })
                    /**
                    Recalculate total weekdays to avoid auto roundoff
                    */
                    var t_total_holidays_coc2 = 0;
                    var t_total_holidays_coc_final = 0;
                    // var holidays_coc_factor = props.data.weekends_coc_cfactor;
                    var holidays_coc_factor = 1.5;
                    console.log(t_holidays_coc_details);
                    t_holidays_coc_details.forEach(el=>{
                        t_total_holidays_coc2+= truncateToDecimals(parseFloat((el.earned/60)))
                        t_total_holidays_coc_final+=truncateToDecimals(el.earned/60)

                    })
                    console.log(t_total_holidays_coc)
                    setTotalHolidaysCOC(t_total_holidays_coc2*holidays_coc_factor)
                    props.setTotalHolidaysCOC(t_total_holidays_coc_final*holidays_coc_factor)
                    t_overall_coc+=t_total_holidays_coc
                    
                    setHolidaysEarnedCOCData(t_holidays_coc_details)
                    props.setHolidaysEarnedCOCData(t_holidays_coc_details)
                    setLoadingData(false)
                    Swal.close()

                }
                /**
                credits to Hours with pay if rendered atleast 2 hours, else to COC
                */
                console.log(t_weekdays)
                console.log(t_weekends)
                console.log(t_overall_coc)
                setOverAllCOC(t_overall_coc)
            }
            
            /**
                separate weekdays and weekends
             */
            
        }).catch(err=>{
            Swal.close()
            console.log(err)
            window.open(api_url)
        })
        console.log(props.data)
    },[])
    useEffect(()=>{
        /**
         * Check if to earned COC is greater than to 120 hrs 
         */
        var t_total = props.balance+truncateToDecimals(parseFloat((((totalWeekDaysCOC+totalWeekEndsCOC)/60))))
        if(t_total >=120){
            var t_to_earn = 120-props.balance;

            if(truncateToDecimals(((totalWeekDaysCOC+totalWeekEndsCOC+totalHolidaysCOC)/60))>=40){
                props.setCocEarned(truncateToDecimals(60*40))
            }else{
                props.setCocEarned(truncateToDecimals(t_to_earn*60))
            }
        }else{
            if(truncateToDecimals(((totalWeekDaysCOC+totalWeekEndsCOC+totalHolidaysCOC)/60))>=40){
                props.setCocEarned(truncateToDecimals(60*40))
            }else{
                props.setCocEarned(truncateToDecimals(truncateToDecimals(totalWeekDaysCOC)+truncateToDecimals(totalWeekEndsCOC)+truncateToDecimals(totalHolidaysCOC)))
            }
        }
        
    },[totalWeekDaysCOC,totalWeekEndsCOC,totalHolidaysCOC])
    const formatTime = (time)=>{
        if(time){
            if(time.trim().length !==0){
                var date = new Date();
                var t_time = time.split(':');
                
                // date.setHours(t_time[0],t_time[1],t_time[2])
                date.setHours(t_time[0],t_time[1])
                return moment(date).format('h:mm a')
            }else{
                return null;
            }
        }else{
            return null;
        }
        
    }
    const formatDate = (date)=>{
        if(date.length !==0){
            return moment(date).format('MMMM DD,YYYY')
        }else{
            return null
        }
    }
    const totalEarn = (data,type)=>{
        var t_count=0;
        /**
        0 - weekdays coc , 1 - weekdays with pay, 2 - weekends coc, 3 - weekends with pay, 4 - holidays coc
         */
        switch(type){
            case 0:
                data.forEach(el=>{
                    t_count+=el.earned
                })
                if(t_count>0){
                    // var total  = ((t_count/60)*1).toFixed(2)
                    return truncateToDecimals(totalWeekDaysCOC)+ ' x 1 = '+truncateToDecimals(totalWeekDaysCOC)*1;
                }else{
                    return 0;
                }
            break;
            case 1:
                var weekdays_wpay_factor = props.data.weekdays_wpay_cfactor;
                data.forEach(el=>{
                    t_count+=el.earned
                })
                if(t_count>0){
                    var total  = truncateToDecimals(truncateToDecimals(t_count/60)*weekdays_wpay_factor)
                    return truncateToDecimals(t_count/60)+ ' x '+weekdays_wpay_factor+' = '+total;
                }else{
                    return 0;
                }
            break;
            case 2:
                var weekends_wpay_cfactor = props.data.weekends_wpay_cfactor;
                data.forEach(el=>{
                    t_count+=el.earned
                })
                if(t_count>0){
                    var total  = truncateToDecimals(truncateToDecimals(t_count/60)*weekends_wpay_cfactor)
                    return truncateToDecimals(t_count/60)+ ' x '+weekends_wpay_cfactor+' = '+total;
                }else{
                    return 0;
                }
            break;
            case 3:
                var weekends_coc_cfactor = props.data.weekends_coc_cfactor;
                data.forEach(el=>{
                    t_count+=el.earned
                })
                if(t_count>0){
                    var total  = truncateToDecimals(truncateToDecimals(t_count/60)*weekends_coc_cfactor)
                    return truncateToDecimals(t_count/60)+ ' x '+weekends_coc_cfactor+' = '+total;
                }else{
                    return 0;
                }
            break;
            case 4:
                var weekends_coc_cfactor = 1.5;
                data.forEach(el=>{
                    t_count+=el.earned
                })
                if(t_count>0){
                    var total  = truncateToDecimals(truncateToDecimals(t_count/60)*weekends_coc_cfactor)
                    return truncateToDecimals(t_count/60)+ ' x '+weekends_coc_cfactor+' = '+total;
                }else{
                    return 0;
                }
            break;
        }
        // if(type === 0){
            
        // }
        // if(type === 1){
            
            
        // }
        
        // if(type=== 2){
            
        // }
        // if(type=== 3){
            
        // }
       
    }
    return(
        <>
            {
                loadingData
                ?
                <Stack spacing={1}>
                    <Skeleton variant='rounded' height={50}/>
                    <Skeleton variant='rounded' height={50}/>
                    <Skeleton variant='rounded' height={50}/>
                </Stack>
                :
                <Grid container sx={{p:2}} id='earn-coc'>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Typography className='header-text1'>Date Period : {props.data.period_date_text}</Typography>
                        <Typography sx={{background: green[800],color: '#fff',padding: '5px 10px',borderTopLeftRadius: '20px',borderBottomLeftRadius: '20px'}}>Total COC to be earned : {truncateToDecimals(props.cocEarned)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography><strong>Weekdays Time Schedule</strong></Typography>
                        <Grid item container row> 
                        <Typography>From :{props.data.weekdays_from?formatTime(props.data.weekdays_from):'N/A'}</Typography>
                        
                        <Typography sx={{ml:2}}>To :{props.data.weekdays_to?formatTime(props.data.weekdays_to):'N/A'}</Typography>

                        <Typography sx={{ml:2}}>Max OT W/Pay: {props.data.weekdays_max_ot?props.data.weekdays_max_ot+' hrs.':'N/A'}</Typography>
                        
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography className='header-text'>Weekdays</Typography>
                    <Paper sx={{p:1}}>
                        <Grid item container sx={{display:'flex',flexDirection:'row'}}>
                            <Grid item xs={12}>
                            <Typography className='header-text2'>With Pay : {totalWeekDaysWpay>0?totalWeekDaysWpay+' (*1.5 = '+truncateToDecimals((totalWeekDaysWpay/60)*1.25)+') hrs':'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                Time In
                                            </TableCell>
                                            <TableCell>
                                                Break Out
                                            </TableCell>
                                            <TableCell>
                                                Break In
                                            </TableCell>
                                            <TableCell>
                                                Time Out
                                            </TableCell>
                                            <TableCell>
                                                Hour/s Earned
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            weekDaysEarnedWpayData.length === 0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                            :
                                            weekDaysEarnedWpayData.map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {formatDate(row.date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.time_out}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truncateToDecimals(row.earned/60)}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                            Total Hour/s
                                            </TableCell>
                                            <TableCell>
                                                <strong>{totalEarn(weekDaysEarnedWpayData,1)}</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            </Paper>
                            </Grid>
                            
                        </Grid>
                        <Grid item container sx={{display:'flex',flexDirection:'row',mt:1}}>
                            <Grid item xs={12}>
                            <Typography className='header-text2'>COC: {totalWeekDaysCOC>0?truncateToDecimals(totalWeekDaysCOC)+' hrs':'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                Time In
                                            </TableCell>
                                            <TableCell>
                                                Break Out
                                            </TableCell>
                                            <TableCell>
                                                Break In
                                            </TableCell>
                                            <TableCell>
                                                Time Out
                                            </TableCell>
                                            <TableCell>
                                                Hour/s Earned
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            weekDaysEarnedCOCData.length === 0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                            :
                                            weekDaysEarnedCOCData.map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {formatDate(row.date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_out)}

                                                    </TableCell>
                                                    <TableCell>
                                                        {truncateToDecimals(row.earned/60)}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                            Total Hour/s
                                            </TableCell>
                                            <TableCell>
                                                <strong>{totalEarn(weekDaysEarnedCOCData,0)}</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            </Paper>
                            </Grid>
                            
                        </Grid>
                    </Paper>
                    </Grid>

                    <Grid item xs={12} sx={{mt:3}}>
                    <hr/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography><strong>Weekends Time Schedule</strong></Typography>
                        <Grid item container row> 
                        <Typography>From: {props.data.weekends_from?formatTime(props.data.weekends_from):'N/A'}</Typography>
                        
                        <Typography sx={{ml:2}}>To: {props.data.weekends_to?formatTime(props.data.weekends_to):'N/A'}</Typography>

                        <Typography sx={{ml:2}}>Max OT W/Pay: {props.data.weekends_max_ot?props.data.weekends_max_ot+' hrs.':'N/A'}</Typography>
                        
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography className='header-text'>Weekends</Typography>
                    <Paper sx={{p:1}}>
                        <Grid item container sx={{display:'flex',flexDirection:'row'}}>
                            <Grid item xs={12}>
                            <Typography className='header-text2'>With Pay : {totalWeekEndsWpay>0?truncateToDecimals(totalWeekEndsWpay/60)+' (*1.5 = '+truncateToDecimals((totalWeekEndsWpay/60)*1.25)+') hrs':'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                Time In
                                            </TableCell>
                                            <TableCell>
                                                Break Out
                                            </TableCell>
                                            <TableCell>
                                                Break In
                                            </TableCell>
                                            <TableCell>
                                                Time Out
                                            </TableCell>
                                            <TableCell>
                                                Hour/s Earned
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            weekEndsEarnedWpayData.length === 0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                            :
                                            weekEndsEarnedWpayData.map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {formatDate(row.date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truncateToDecimals(row.earned/60)}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                            Total Hour/s
                                            </TableCell>
                                            <TableCell>
                                                <strong>{totalEarn(weekEndsEarnedWpayData,2)}</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            </Paper>
                            </Grid>
                            
                        </Grid>
                        <Grid item container sx={{display:'flex',flexDirection:'row',mt:1}}>
                            <Grid item xs={12}>
                            <Typography className='header-text2'>COC: {totalWeekEndsCOC>0?truncateToDecimals(totalWeekEndsCOC)+' hrs':'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                Time In
                                            </TableCell>
                                            <TableCell>
                                                Break Out
                                            </TableCell>
                                            <TableCell>
                                                Break In
                                            </TableCell>
                                            <TableCell>
                                                Time Out
                                            </TableCell>
                                            <TableCell>
                                                Hour/s Earned
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            weekEndsEarnedCOCData.length === 0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                            :
                                            weekEndsEarnedCOCData.map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {formatDate(row.date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truncateToDecimals(row.earned/60)}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                            Total Hour/s
                                            </TableCell>
                                            <TableCell>
                                                <strong>{totalEarn(weekEndsEarnedCOCData,3)}</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            </Paper>
                            </Grid>
                            
                        </Grid>
                    </Paper>
                    </Grid>

                    <Grid item xs={12} sx={{mt:3}}>
                    <hr/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography><strong>Holidays Time Schedule</strong></Typography>
                        <Grid item container row> 
                        <Typography>From: {props.data.holidays_from?formatTime(props.data.holidays_from):'N/A'}</Typography>
                        
                        <Typography sx={{ml:2}}>To: {props.data.holidays_to?formatTime(props.data.holidays_to):'N/A'}</Typography>

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography className='header-text'>Holidays</Typography>
                    <Paper sx={{p:1}}>
                        <Grid item container sx={{display:'flex',flexDirection:'row'}}>
                            <Grid item xs={12}>
                            <Typography className='header-text2'>With Pay : {totalWeekEndsWpay>0?truncateToDecimals(totalWeekEndsWpay/60)+' (*1.5 = '+truncateToDecimals((totalWeekEndsWpay/60)*1.25)+') hrs':'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                Time In
                                            </TableCell>
                                            <TableCell>
                                                Break Out
                                            </TableCell>
                                            <TableCell>
                                                Break In
                                            </TableCell>
                                            <TableCell>
                                                Time Out
                                            </TableCell>
                                            <TableCell>
                                                Hour/s Earned
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            holidaysEarnedWpayData.length === 0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                            :
                                            holidaysEarnedWpayData.map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {formatDate(row.date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truncateToDecimals(row.earned/60)}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                            Total Hour/s
                                            </TableCell>
                                            <TableCell>
                                                <strong>{totalEarn(holidaysEarnedWpayData,2)}</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            </Paper>
                            </Grid>
                            
                        </Grid>
                        <Grid item container sx={{display:'flex',flexDirection:'row',mt:1}}>
                            <Grid item xs={12}>
                            <Typography className='header-text2'>COC: {totalHolidaysCOC>0?truncateToDecimals(totalHolidaysCOC)+' hrs':'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                Time In
                                            </TableCell>
                                            <TableCell>
                                                Break Out
                                            </TableCell>
                                            <TableCell>
                                                Break In
                                            </TableCell>
                                            <TableCell>
                                                Time Out
                                            </TableCell>
                                            <TableCell>
                                                Hour/s Earned
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            holidaysEarnedCOCData.length === 0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'>
                                                    No Data
                                                </TableCell>
                                            </TableRow>
                                            :
                                            holidaysEarnedCOCData.map((row,key)=>
                                                <TableRow key = {key} hover>
                                                    <TableCell>
                                                        {formatDate(row.date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.break_in)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatTime(row.time_out)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truncateToDecimals(row.earned/60)}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                            Total Hour/s
                                            </TableCell>
                                            <TableCell>
                                                <strong>{totalEarn(holidaysEarnedCOCData,4)}</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            </Paper>
                            </Grid>
                            
                        </Grid>
                    </Paper>
                    </Grid>
                    {/* End Holidays */}

                </Grid>
            }
        </>
        
    )
}