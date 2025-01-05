import React, { useEffect,useRef,useState } from 'react';
import {  Typography,Grid,Box, Button,InputLabel,MenuItem,FormControl,Select,TextField,FormControlLabel,FormGroup,LinearProgress,Tooltip,Checkbox,Alert,Fab,CircularProgress,Modal,Stack,Skeleton, IconButton,Autocomplete,Popover} from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// leave application request
import { getLeaveDetails,addLeaveApplication,cancelLeaveApplication,refreshData,getMonetizationInfo,getCTOAlreadyAppliedHours,getWorkSchedule, getRequestedEarnedLeaveInfo, getHolidays, getAllHolidays, getCurrentMonthCOC, getRemainingPaternityCredits } from './LeaveApplicationRequest';
// import DatePicker from 'react-date-picker';
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
//icon
import InputIcon from "react-multi-date-picker/components/input_icon"
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HelpIcon from '@mui/icons-material/Help';
import TaskIcon from '@mui/icons-material/Task';
import SendIcon from '@mui/icons-material/Send';

import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { PreviewLeaveApplicationForm } from './PreviewLeaveApplicationForm';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { blue, green, orange, red, yellow } from '@mui/material/colors'

//icon
import PrintIcon from '@mui/icons-material/Print';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import { PreviewCTOApplicationForm } from './PreviewCTOApplicationForm';
import {PreviewLeaveApplication} from './PreviewLeaveApplication'

import AllocationOfMaternityLeaveFillout from './AllocationOfMaternityLeaveFillout'
import axios from 'axios';
import { ConnectingAirportsOutlined, DeleteForever } from '@mui/icons-material';
import $ from 'jquery'
//animation css
import 'animate.css';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { styled } from '@mui/material/styles';
import { convertTo64 } from '../onlinedtr/convertfile/ConvertFile';

const Input = styled('input')({
    display: 'none',
});
var momentBusinessDays = require("moment-business-days");

export default function LeaveApplicationForm(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    //all balance fetch from DB
    const [balanceData,setBalanceData] = React.useState([]);

    //all types of leave fetch from DB
    const [typeOfLeaveData,setTypeOfLeaveData] = React.useState([]);
    const [allTypeOfLeaveData,setAllTypeOfLeaveData] = React.useState([]);

    //employee info fetch from DB
    const [employeeInfo,setEmployeeInfo] = React.useState([]);

    //signatory data fetch from DB
    const [signatory,setSignatory] = React.useState([]);

    //all application history data fetch from DB
    const [historyLeaveApplicationData,setHistoryLeaveApplicationData] = React.useState([]);

    const [selectedCTOInclusiveDates, setCTOInclusiveDates] = React.useState([]);
    const [tempSelectedCTOInclusiveDates, setTempSelectedCTOInclusiveDates] = React.useState([]);
    const [tempSelectedSPLInclusiveDates, setTempSelectedSPLInclusiveDates] = React.useState([]);

    //officehead of officeassign
    const [officeHead,setOfficeHead] = React.useState([]);
    //admin officer of officeassign
    const [officeAO,setOfficeAO] = React.useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [requestEarnedLeaveAnchor, setRequestEarnedLeaveAnchor] = React.useState(null);
    const [balAsOf,setBalAsOf] = useState(moment().subtract(1,'months').format('MMMM YYYY'))

    const handleClickShowLeaveInfo = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseLeaveInfo = () => {
        setAnchorEl(null);
    };
    const [loadingRequestEarning,setLoadingRequestEarning] = useState(false)
    const handleClickShowRequestEarnedLeave = (event) => {
        let ev = event;
        setLoadingRequestEarning(true)
        getRequestedEarnedLeaveInfo()
        .then(res=>{
            if(res.data.status === 200){
                setRequestEarnedLeaveAnchor(ev.target);
                setLoadingRequestEarning(false)
            }else{
                toast.warning('You have pending request !')
                setLoadingRequestEarning(false)
            }
        }).catch(err=>{
            console.log(err)
        })

    };

    const handleCloseRequestEarnedLeave= () => {
        setRequestEarnedLeaveAnchor(null);
    };
    const openLeaveInfo = Boolean(anchorEl);
    const id = openLeaveInfo ? 'simple-popover' : undefined;
    
    const openRequestEarnedLeave = Boolean(requestEarnedLeaveAnchor);

    const requestid = openRequestEarnedLeave ? 'simple-popover' : undefined;

    const specifyRef = useRef('');
    const [CTOHoursDropdown,setCTOHoursDropdown] = React.useState([]);
    const [alreadyAppliedDays,setAlreadyAppliedDays] = React.useState([]);
    const [alreadyAppliedDaysPeriod,setAlreadyAppliedDaysPeriod] = React.useState([]);
    const [onProcess,setonProcess] = React.useState([]);
    const [availableVL,setavailableVL] = React.useState(0)
    const [availableSL,setavailableSL] = React.useState(0)
    const [availableCOC,setavailableCOC] = React.useState(0)
    const [lastDayOfDuty,setlastDayOfDuty] = React.useState('')
    const [slNoPay,setslNoPay] = React.useState('')
    const [slWithPay,setslWithPay] = React.useState('')
    const [slRangeDatesWithPay,setslRangeDatesWithPay] = React.useState([])
    const [workScheduleData,setWorkScheduleData] = React.useState([])
    const [workScheduleDataLoaded,setWorkScheduleDataLoaded] = React.useState(false)
    const [maternityBal,setMaternityBal] = React.useState(props.maternityBal)
    const [SLHasPeriodDays,setSLHasPeriodDays] = useState(false)
    const [SLPeriodDays,setSLPeriodDays] = useState([])
    const [SLPeriodDaysWpay,setSLPeriodDaysWpay] = useState([])
    const [totalSLPeriodDays,setTotalSLPeriodDays] = useState(0)
    const [SLPReasonsData,setSLPReasonsData] = useState([])
    const [SLPReason,setSLPReason] = useState('')
    const [assignWorkingHrsDays,setAssignWorkingHrsDays] = useState([])
    const [ctoInfo,setCtoInfo] = useState([{
        cto_hr_name:'',
        cto_hr_name_pos:'',
        cto_cmo_name:'',
        cto_cmo_name_pos:''
    }]);
    const [openSLExplainModal,setOpenSLExplainModal] = useState(false)
    const [holidays,setHolidays] = useState([])
    const explainSLModalstyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'98%':400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 2,
    };
    const [SLPEndDate,setSLPEndDate] = useState('')
    const [cancelledDates,setCancelledDates] = useState([])
    //fetch data from DB when component rendered
    useEffect( async()=>{
        setCancelledDates(props.cancelledDates)
        //request to get the info of current employee login
        let appliedDays;
        setCtoInfo(props.ctoInfo)
        setTypeOfLeaveData(props.typeOfLeaveData)
        setAllTypeOfLeaveData(props.allTypesOfLeave)
        setEmployeeInfo(props.employeeInfo)
        setSignatory(props.signatory)
        setonProcess(props.onProcess)
        setBalanceData(props.balanceData)
        setOfficeHead(props.officeHead)
        setOfficeAO(props.officeAO)
        setAlreadyAppliedDays(props.alreadyAppliedDays)
        setAlreadyAppliedDaysPeriod(props.alreadyAppliedDaysPeriod)
        // console.log(props.alreadyAppliedDaysPeriod)
        setAvailabelSPL(props.availableSPL)
        setOnprocessSPL(props.onprocessSPL)
        setavailableVL(props.availableVL)
        setavailableSL(props.availableSL)
        setavailableCOC(props.availableCOC)
        setSLPReasonsData(props.SLPReasonsData)
        // setslRangeDatesWithPay(props.slRangeDatesWithPay)
        // setslNoPay(props.slNoPay)
        setslWithPay(props.slWithPay)
        const holiday = await getAllHolidays()
        setHolidays(holiday.data.response)
        let holidays = holiday.data.response
        getWorkSchedule()
        .then(res=>{
            if(res.data.length !==0){
                /**
                 * Check if has schedule for current year
                 */
                var current_year = moment(new Date()).format('YYYY');
                var has_current_year = false;
                res.data.new.forEach(el=>{
                    if(el.year === parseInt(current_year)){
                        has_current_year = true;
                    }
                })
                // console.log(has_current_year)
                if(has_current_year){
                    var template_days = []
                    var schedule_data = [];
                    
                    /**
                    * Loop work schedule data per year
                    */
                    res.data.new.forEach(el3=>{
                        /**
                        * Get the removed date
                        */
                        var removed = JSON.parse(el3.removed_sched)
                        var updated = JSON.parse(el3.updated_sched)
        
                        /**
                        * Initialized temp remove array
                        */
                        var rem_arr = [];
                        var updated_arr = [];
        
                        /**
                        * Loop removed sched data and push into temp array. Using this will easily lookup data using "includes" function
                        */
                        removed.forEach(rem =>{
                            rem_arr.push(moment(rem.date,'YYYY-MM-DD').format('MM-DD-YYYY'))
                        })

                        updated.forEach(up=>{
                            updated_arr.push(moment(up.date,'YYYY-MM-DD').format('MM-DD-YYYY'))
                        })
                        // console.log(updated_arr)
                        /**
                        * Loop template days data and push into temp array. Using this will easily lookup data using "includes" function
                        */
                        JSON.parse(el3.working_days).forEach(el=>{
                            template_days.push(el.day)
                        })
        
                        /**
                        * Initialized year based on current loop
                        */
                        var year  = el3.year;
        
                        /**
                        * Get all months
                        */
                        moment.months().forEach(element => {
                            var schedule = [];
                            /**
                            * Convert month to new Date
                            */
                            var month_start = moment().month(element)
                            var month = moment(month_start,'YYYY-MM-DD').format('MM')-1;
        
                            /**
                            * Initialized start date of month to loop
                            */
                            var from_period = new Date(year, month, 1);
        
                            /**
                            * Loop days for current month
                            */
                            while (moment(from_period).format('MMMM') === element) {
                                /**
                                * Check if month day exist in template days
                                */
                                if(template_days.includes(moment(from_period).format('dddd'))){
                                    /**
                                    * If month day exist in template days get the template details
                                    */
                                    JSON.parse(el3.working_days).forEach(el2=>{
                                        /**
                                        * Check if template days inludes in removed date,if not removed push data to array
                                        */
                                        if(el2.day === moment(from_period).format('dddd') && !rem_arr.includes(moment(from_period).format('MM-DD-YYYY'))){
                                            schedule.push({
                                                'day':moment(from_period).format('D'),
                                                'whrs_code':el2.whrs_code,
                                                'whrs_desc':el2.whrs_desc,
                                            });
                                        }
                                    })
                                }else{
                                    JSON.parse(el3.working_days).forEach(el2=>{
                                    /**
                                    * Check if template days inludes in removed date,if not removed push data to array
                                    */
                                        if(updated_arr.includes(moment(from_period).format('MM-DD-YYYY'))){
                                            schedule.push({
                                                'day':moment(from_period).format('D'),
                                                'whrs_code':el2.whrs_code,
                                                'whrs_desc':el2.whrs_desc,
                                            });
                                        }
                                    })
                                }
                                /**
                                * Increment loop contidtion
                                */
                                from_period.setDate(from_period.getDate() + 1);
                            }
                            /**
                            * After looping days in every month, push data into array
                            */
                            schedule_data.push({
                                month:parseInt(moment(month_start).format('M')),
                                year:year,
                                details:schedule
                            })    
                        });
                    })
                    // console.log(schedule_data)
                        
                    /**
                    * Set state the workschedule data
                    */
                    let currDate = new Date();
                    var date = new Date();
                    var start = 0;
                    var end = 5;
                    let toAdd = 0;
                    var slRangeDatesWP =[];
                    while(start <= end){
                        let temp = [];
                        let temp2 = [];
                        
                        for(var w=0;w<schedule_data.length;w++){
                            if(schedule_data[w].month === parseInt(moment(date).format('M')) && schedule_data[w].year === parseInt(moment(date).format('YYYY'))){
                                temp=schedule_data[w].details;
                                break;
                            }
                        }
                        if(temp){
                            temp.forEach(el2=>{
                                temp2.push(el2.day)
                            })
                        }
                        // if(props.alreadyAppliedDays.includes(moment(date).format('MM-DD-YYYY')) || props.presentDaysData.includes(moment(date).format('YYYY-MM-DD'))){
                        //     toAdd++;
                        // }else{
                        //     if(moment(date).isBusinessDay()){
                        //         if(!temp2.includes(moment(date).format('D'))){
                        //             toAdd++;
                        //         }
                        //         slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                        //         start++;
                                
                        //     }
                        // }
                        //check if fall to holidays
                        var f_holidays = holidays.filter(el=>moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')>=(moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD')) && moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')<=(moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD')));
                        if(props.alreadyAppliedDays.includes(moment(date).format('MM-DD-YYYY'))){
                            toAdd++;
                        }else if(f_holidays.length>0){
                            toAdd++;
                        }else{
                            var temp3;
                            schedule_data.forEach(el=>{
                            if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp3=el.details;
                                }
                            })
                            if(temp3){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                        start++;
                                    }
                                })
                            }
                            // if(moment(date).isBusinessDay()){
                            //     if(!temp2.includes(moment(date).format('D'))){
                            //         toAdd++;
                            //     }
                            //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                            //     start++;
                                
                            // }
                        }
                        date.setDate(date.getDate() - 1)
                    }
                    /**
                     * set SL without pay based on work schedule
                     */
                    var t_limit = 5+toAdd;
                    var t_limit_count=0;
                    var t_limit_date = currDate;
                    for(t_limit_count;t_limit_count<t_limit;){
                        /**
                        Check if current limit date value exist in work schedule 
                         */
                        var month_arr = schedule_data.filter((el=>{
                            return el.month === parseInt(moment(t_limit_date).format('M')) && el.year === parseInt(moment(t_limit_date).format('YYYY'))
                        }))
                        if(month_arr.length>0){
                            var has_sched = false;
                            var day_arr = month_arr[0].details.filter((el2)=>{
                                return parseInt(el2.day) === parseInt(moment(t_limit_date).format('D'))
                            })
                            // console.log(month_arr[0].details)
                            // console.log(moment(t_limit_date).format('D'))
                            // console.log(day_arr)
                            if(day_arr.length>0){
                                t_limit_count++
                            }
                        }
                    t_limit_date.setDate(t_limit_date.getDate()-1)

                    }
                    // console.log(t_limit_date)
                    // console.log(slRangeDatesWP)

                    // let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                    let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d
                    setslNoPay(t_limit_date)
                    setslWithPay(finalWithPay)
                    setslRangeDatesWithPay(slRangeDatesWP)

                    setWorkScheduleData(schedule_data)
                    setWorkScheduleDataLoaded(true)

                    /**
                    Array for equivalent hours to deduct credits
                     */
                    var t_arr_hours_eq = [{
                        hours:1,
                        value:0.125,
                    },
                    {
                        hours:2,
                        value:0.25,
                    },
                    {
                        hours:3,
                        value:0.375,
                    },
                    {
                        hours:4,
                        value:0.5,
                    },
                    {
                        hours:5,
                        value:0.625,
                    },
                    {
                        hours:6,
                        value:0.75,
                    },
                    {
                        hours:7,
                        value:0.875,
                    },
                    {
                        hours:8,
                        value:1,
                    }
                    ]
                    /**
                    Get working days
                     */
                    var t_working_days = [];
                    // console.log(res.data.new)
                    res.data.new.forEach(el=>{
                        JSON.parse(el.working_days).forEach(el2=>{
                            /**
                            Compute hours
                             */
                            /**
                            Loop working days to get the working hours
                            */
                            var am_total = 0;
                            var pm_total = 0;
                            var am_pm_total = 0;

                            /**
                                check if working hours is equal or greater than to 40hrs (days*working hrs)
                                */
                                var h1=moment(el2.time_in,'hh:mm:ss');
                                var h2=moment(el2.break_out,'hh:mm:ss');
                                var h3=moment(el2.break_in,'hh:mm:ss');
                                var h4=moment(el2.time_out,'hh:mm:ss');


                                /**
                                check if has break out and break in
                                */
                                
                                
                                if(el2.time_in === el2.break_out && el2.break_in === el2.time_out){
                                    var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                                    var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                                    am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                                }else if(el2.time_in && el2.break_in){
                                    var am_hrs = (moment(h2).diff(h1,'hours'))*60;
                                    var pm_hrs = (moment(h4).diff(h3,'hours'))*60;
                                    var am_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                                    var pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                                    am_total = parseInt(am_hrs)+parseInt(am_mins);
                                    pm_total = parseInt(pm_hrs)+parseInt(pm_mins);
                                    am_pm_total = am_total+pm_total;

                                }else if(el2.time_in && el2.break_out){
                                    var am_pm_hrs = (moment(h1).diff(h2,'hours'))*60;

                                    var am_pm_mins = moment.utc(moment(h1, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                                    am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);

                                }else if(el2.break_out && el2.break_in){
                                    if(el2.break_out>el2.break_in){
                                        var am_pm_hrs = (moment(h2).diff(h3,'hours'))*60;
                                        var am_pm_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                                    }else{
                                        var am_pm_hrs = (moment(h3).diff(h2,'hours'))*60;
                                        var am_pm_mins = moment.utc(moment(h3, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                                    }
                                    am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                                }
                                else{
                                    var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                                    var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                                    am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                                }
                            /**
                            Compute total hours per week base on selected working hours and days
                            */
                            var arr_hours_val = t_arr_hours_eq.filter((val)=>{
                                return val.hours === am_pm_total/60;
                            })
                            t_working_days.push({
                                year:el.year,
                                day:el2.day,
                                hours:arr_hours_val[0].value
                            })
                            
                        })
                    })
                    
                    // console.log(t_working_days)
                    setAssignWorkingHrsDays(t_working_days)

                }else{
                    toast.error('No Work schedule found in this Year, please contact HR admin')
                }
                
            }else{
                toast.error('No Work schedule found, please contact HR admin')
            }

        }).catch(err=>{
            console.log(err)
        })
        
    },[])
    

    /**
     * trigger when selectedCTOInclusiveDates changed
     */
    useEffect(()=>{
        var days = Math.round(CTOHours/8);
        // console.log(selectedCTOInclusiveDates.length)

        /**
         * check if selected dates is equal to number of hours applied
         */
        if(selectedCTOInclusiveDates.length > days){
            toast.warning('Inclusive dates is greater than applied hours ! Please select inclusive dates corresponds to your applied hours.',{
                position:'top-center'
            })
        }
        
    },[selectedCTOInclusiveDates])
    /**
     * Modal style
     */
     const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 400:600,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        p: 4,
      };
      const previewStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? '100%':800,
        height:matches?'85%':'auto',
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    /**
     * Modal application state
     */
    
    const [open,setOpen] = React.useState(false);

    const [leaveType,setLeaveType] = React.useState('');
    useEffect(()=>{
        if(leaveType === 14){
            /**
            Gel all active coc credits, current month
             */
            var t_data = {
                date:moment().endOf('month').format('YYYY-MM-DD')
            }
            getCurrentMonthCOC(t_data)
            .then(res=>{
                setBalance(res.data)
            })
        }
    },[leaveType])
    
    /**
     * leave details based on selected leave type
     */
    const [leaveDetails,setLeaveDetails] = React.useState('');

    /**
     * leave details data based on selected leave type
     */
    const [leaveDetailsData,setLeaveDetailsData] = React.useState([]);

    /**
     * specify details state
     */
    const [specifyDetails,setSpecifyDetails] = React.useState('');
    
    const [appliedOthersDays,setappliedOthersDays] = React.useState(0)
    const [hasAppliedVL,sethasAppliedVL] = React.useState(0);
    const [isInludeSLMonetization,setisInludeSLMonetization] = React.useState(false);
    const [daysOfMonetization,setdaysOfMonetization] = React.useState(0);
    /**
     * handler after leave details select change
     */
    useEffect(()=>{
        if(leaveDetails === 9){
            getMonetizationInfo()
            .then(response=>{
                const data = response.data
                if(data.length ===0){
                    sethasAppliedVL(0)
                }else{
                    sethasAppliedVL(data[0].total)
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    },[leaveDetails])
    const selectLeaveDetails = (event) => {
        setLeaveDetails(event.target.value);
        if(event.target.value === 10){
            setappliedOthersDays(availableVL+availableSL)
        }
    };

    const [isApplicableForFiling,setisApplicableForFiling] = React.useState(null);
    /**
     * handlert for type of leave select change
     */
    const [applicableDaysLoading,setapplicableDaysLoading] = React.useState(false)
    const [applicableDays,setapplicableDays] = React.useState(0);
    const [splDropdown,setsplDropdown] = React.useState([]);
    const [selectedSPL,setselectedSPL] = React.useState(0.5);
    const [daysPeriod,setdaysPeriod] = React.useState(0);
    const [availableSPL,setAvailabelSPL] = React.useState('');
    const [onprocessSPL,setOnprocessSPL] = React.useState('');
    const [currentMonthCTO,setCurrentMonthCTO] = React.useState('');
    const [leaveCode,setLeaveCode] = React.useState('');
    const [ctoFilingPeriod,setctoFilingPeriod] = React.useState('');
    const [SLHalfDays,setSLHalfDays] = useState(false)
    const [paternityChildDOB,setPaternityChildDOB] = useState(null)
    const [canApplyPaternity,setCanApplyPaternity] = useState(true)
    const handleSetTypeOfLeave = (value) =>{
        // console.log(props.onProcess)
        setMultipleFileUpload([])
        setLeaveDetailsData([]);
        setInclusiveDates([]);
        setSLPeriodDays([]);
        setSLHasPeriodDays(false);
        setslTotalWithoutPay(0);
        setPreviewInclusiveDates('');
        setLeaveType(value.target.value)
        let temp_days;
        for(var x = 0 ; x <typeOfLeaveData.length ; x++){
            if(typeOfLeaveData[x].leave_type_id === value.target.value){
                setdaysPeriod(typeOfLeaveData[x].days)
                setctoFilingPeriod(typeOfLeaveData[x].filing_period)
                temp_days = typeOfLeaveData[x].filing_period
                break;
            }
        }
        if(value.target.value === 14){
            let minDate = new Date();
            let endDate;
            let start = 0;
            while(start<temp_days){
                endDate = minDate;
                if(moment(endDate).isBusinessDay()){
                    // console.log(moment(endDate).format('MM-DD-YYYY'))
                    start++;
                }
                if(start !== temp_days){
                    endDate.setDate(endDate.getDate()+1)
                }
            }
            // console.log(endDate)
            
            setMinCTODate(endDate)
        }
        var bal = 0;
        var bal2 = 0;
        /**
         * loop to set the available balance based on selected leave type
         */
        balanceData.forEach(element => {
            // if(element.id === value.target.value){
            //     bal = element.leave_balance
            // }
            switch(value.target.value){
                /**
                 * vacation leave/force leave/ special privilege leave
                 */
                case 1:
                case 2:
                    bal2 = (element.vl_bal-onProcess.vl).toFixed(3)
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = (element.vl_bal-onProcess.vl).toFixed(3)
                    }
                    break;
                /**
                 * sick leave
                 */
                case 3:
                    if(element.sl_bal<=0){
                        bal=0;
                    }else{
                        bal2 = element.sl_bal>0?(element.sl_bal-onProcess.sl):0
                        if(bal2<0){
                            bal = 0
                        }else{
                            bal = element.sl_bal>0?(element.sl_bal-onProcess.sl):0
                        }
                    }
                    
                    break;
                /**
                 *  CTO
                 */
                case 14:
                    bal2 = props.availableCOC
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = props.availableCOC
                    }
                    // loop for CTO dropdown hours based on available balance
                    var coc = bal;
                    var result = [];
                    
                    /**
                     * Check if has already applied 40 hrs
                     */
                    getCTOAlreadyAppliedHours(currentMonth.format('MM-YYYY'))
                    .then(response=>{
                        var data;
                        //  console.log(response.data)
                        setTotalMonthHours(response.data.total)
                        if(response.data.length !==0){
                            data = response.data.total
                        }else{
                            data = 0;
                        }
                        /**
                         * Check if current month hours is greater than 40
                         */
                        if(data>=40){
                            /**
                             * Can't applied CTO
                             */
                            setCTOHoursDropdown([])
                        }else{
                            if(data === 0){
                                //limit only 5 days equals to 40 HRS per application
                                var x=0;
                                var start = data;
                                for(var i = 4 ; x < 10 ;){
                                    if(i>coc){
                                        break;
                                    }else{
                                        result.push(i)
                                        i = i +4;
                                        x++;
                                    }
                                
                                }
                                setCTOHoursDropdown(result)
                            }else{
                                //limit only remaining CTO hours per month
                                var total=0;
                                for(var i = 4 ; i <= coc;){
                                    if(i>coc){
                                        break;
                                    }else{
                                        result.push(i)
                                        total = i+data;
                                        i = i +4;
                                        if(total>=40){
                                            break;
                                        }
                                    }
                                
                                }
                                setCTOHoursDropdown(result)
                            }
                            
                        }
                        setCurrentMonthCTO(data)
                        setCTOInclusiveDates([])
                        setCTOHours('')
                        })
                        .catch(error=>{
                            console.log(error)
                        })
                        
                    break;
                }
            });
        /**
         * reset leave details value
         */
        setLeaveDetails('');
        /**
         * reset leave specify value
         */
        setSpecifyDetails('');

        /**
         * request to get the leave details based on leave type selected
         */
        // setapplicableDaysLoading(true)
        getLeaveDetails(value.target.value)
        .then((response)=>{
            /**
             * update leave details state
             */
            const data = response.data
            if(value.target.value === 6){
                setTempSelectedSPLInclusiveDates([])
                setLeaveDetailsData(data.data)
                setisApplicableForFiling(data.is_applicable)
                setapplicableDays(data.applicable_days)
                var bal = data.applicable_days;
                var result = [];
                
                //limit only 5 days equals to 40 HRS per application
                var x=0;
                // for(var i = .5 ; i <= bal ;){
                //     if(i>bal){
                //         break;
                //     }else{
                //         result.push(i)
                //         i = i +.5;
                //     }
                
                // }
                for(var i = 1 ; i <= bal ;){
                    if(i>bal){
                        break;
                    }else{
                        result.push(i)
                        i++;
                    }
                
                }
                setsplDropdown(result)
            }else if(value.target.value === 5){
                setCanApplyPaternity(data.is_applicable)
                setLeaveDetailsData(data.data)
            }else{

                setLeaveDetailsData(data.data)
            }
            // setapplicableDaysLoading(false)


        }).catch((error)=>{
            console.log(error)
        })
        /**
         * update balance state
         */
        setBalance(bal)

        switch(value.target.value){
            case 15:
                setCommutation('Requested');
                break;
            default:
                setCommutation('Not Requested');
                break;
        }
    }
    
    /**
     * state for multiple selected inclusive dates except for CTO
     */
    const [selectedInclusiveDates, setInclusiveDates] = React.useState([]);

    /**
     * state for selected inclusive dates for maternity leave
     */
     const [selectedInclusiveMaternityDates, setInclusiveMaternityDates] = React.useState('');
     const [selectedInclusiveMaternityDatesRange, setInclusiveMaternityDatesRange] = React.useState([]);

    /**
     * state for selected inclusive dates for VAWC leave
     */
    const [selectedInclusiveVAWCDates, setInclusiveVAWCDates] = React.useState('');
    const [selectedInclusiveVAWCDatesRange, setInclusiveVAWCDatesRange] = React.useState([]);


    /**
     * handler for updating the selectedInclusiveDates state
     */
    const handleSetInclusiveDates = (value) => {
       
        // if(value.length>0){
        //     // check if holiday
        //     var hol = holidays.filter(el=> moment(value[value.length-1].toDate()).format('YYYY-MM-DD')>=moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD') && moment(value[value.length-1].toDate()).format('YYYY-MM-DD')<=moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD'));
        //     // console.log(holidays)
        //     if(hol.length<=0){
        //         // setInclusiveDates(value)
        //     }
        // }
        setInclusiveDates(value)

        if(leaveType === 6){
            setTempSelectedSPLInclusiveDates([])
        }
    }
    
    /**
     * handler for updating the handleSetCTOInclusiveDates state
     */
    const handleSetCTOInclusiveDates = (value) => {
        setCTOInclusiveDates(value)
    }

    /**
     * function use for disabling the dates before filing days
     */
    const inclusiveMinDate = () => {
        // var d = new Date();
        // var disabled = d.setDate(d.getDate() + 5);
        var startDate = new Date();
        // startDate = new Date(startDate.replace(/-/g, "/"));
        var endDate = "", noOfDaysToAdd = 0, count = 0;
        
        for(var x= 0 ;x<typeOfLeaveData.length ; x++){
            if(typeOfLeaveData[x].leave_type_id === leaveType){
                noOfDaysToAdd = typeOfLeaveData[x].filing_period
                break;
            }
        }
        /**
        Check if how many holidays within range of number of days to add
         */
        var t_holidays = []
        holidays.forEach(el=>{
            t_holidays.push(el.holiday_date1)
        })
        
        var t_start = new Date();
        if(leaveType === 1 || leaveType === 2){
            var t_end = t_start

        }else{
            var t_end = momentBusinessDays(t_start).businessAdd(noOfDaysToAdd)
        }

        var num_holidays=0;
        while(moment(t_start).format('YYYY-MM-DD') < moment(t_end).format('YYYY-MM-DD')){
            if(t_holidays.includes(moment(t_start).format('YYYY-MM-DD'))){
                num_holidays++;
            }
            t_start.setDate(t_start.getDate()+1);
        }
        noOfDaysToAdd = noOfDaysToAdd+num_holidays;

        // console.log(leaveType)
        // console.log(noOfDaysToAdd)
        // switch(leaveType){
        //     /**
        //      * Vacation leave / force leave
        //      */
        //     case 1:
        //     case 2:
        //         noOfDaysToAdd = 5
        //         break;
        //     /** Special Privilege Leave
        //      * 
        //      */
        //     case 6:
        //         noOfDaysToAdd = 7
        //         break;

        //     /** Solo Parent Leave
        //      * 
        //      */
        //      case 7:
        //         noOfDaysToAdd = 6
        //         break;

        //     /**
        //      * CTO
        //      */
        //     case 14:
        //         noOfDaysToAdd = 5
        //         break;
        // }

        /**
         * Loop to identify how many days to add base on work schedule
         */
        
        switch(leaveType){
            case 1:
            case 2:
                while(count < noOfDaysToAdd){
                    endDate = new Date(startDate.setDate(startDate.getDate() + 1));
                    // let temp = [];
                    // let temp2 = [];
                    
                    // for(var w=0;w<workScheduleData.length;w++){
                    //     if(workScheduleData[w].month === parseInt(moment(endDate).format('M')) && workScheduleData[w].year === parseInt(moment(endDate).format('YYYY'))){
                    //         temp=workScheduleData[w].details;
                    //         break;
                    //     }
                    // }
                    // if(temp){
                    //     temp.forEach(el2=>{
                    //         temp2.push(el2.day)
                    //     })
                    // }
                    // if(temp2.includes(moment(endDate).format('D'))){
                    //         count++;
                    // }
                    // if(endDate.getDay() != 0 && endDate.getDay() != 6){
                    //     if(temp2.includes(moment(endDate).format('D'))){
                    //         count++;
                    //     }
                    // }
                    count++;
                }
                return endDate;
            case 3:
            case 6:
            case 7:
            case 14:
                while(count < noOfDaysToAdd){
                    endDate = new Date(startDate.setDate(startDate.getDate() + 1));
                    let temp = [];
                    let temp2 = [];
                    
                    for(var w=0;w<workScheduleData.length;w++){
                        if(workScheduleData[w].month === parseInt(moment(endDate).format('M')) && workScheduleData[w].year === parseInt(moment(endDate).format('YYYY'))){
                            temp=workScheduleData[w].details;
                            break;
                        }
                    }
                    if(temp){
                        temp.forEach(el2=>{
                            temp2.push(el2.day)
                        })
                    }
                    if(endDate.getDay() != 0 && endDate.getDay() != 6){
                        if(temp2.includes(moment(endDate).format('D'))){
                            count++;
                        }
                    }
                }
                return endDate;
            default:
                return new Date()
        }
    }
    const [SLPminDate1,setSLPminDate1] = useState([]);
    const [SLPminDate,setSLPminDate] = useState([]);
    const [SLPmaxDate,setSLPmaxDate] = useState();
    const [SLPReasonType,setSLPReasonType] = useState('');
    useEffect(()=>{
        if(leaveType === 6){
            if(selectedInclusiveDates.length >0){
                 var date = moment(selectedInclusiveDates[0].toDate()).format('YYYY-MM-DD');
                 var curr_date = moment(new Date()).format('YYYY-MM-DD');

                if(date>curr_date){
                    /**
                    Check if one day advance
                     */
                    if(moment(date).diff(curr_date,'days') === 1){
                        var t_t_date = new Date();
                        t_t_date.setDate(t_t_date.getDate()+1)
                        setSLPmaxDate(t_t_date)
                    }else{
                        var t_t_date = new Date();
                        t_t_date.setDate(t_t_date.getDate()+2)
                        setSLPminDate(t_t_date)
                    }
                    setSLPReasonType('before');

                    
                }else{
                    setSLPmaxDate(new Date())
                    setSLPReasonType('after');
                }
                var t_inc_dates = [];
                var has_half = false;
                selectedInclusiveDates.forEach(el=>{
                    var t_arr = alreadyAppliedDaysPeriod.filter(el2=>{
                        return el2.date === el.format('MM-DD-YYYY')
                    })
                    if(t_arr.length !==0){
                        has_half = true;
                        var period = t_arr[0].period;
                        if(period === 'AM'){
                            t_inc_dates.push({
                                date:el,
                                period:'PM',
                                disabled:true
                            })
                        }else{
                            t_inc_dates.push({
                                date:el,
                                period:'AM',
                                disabled:true
                            })
                        }
                    }else{
                        t_inc_dates.push({
                            date:el,
                            period:'',
                            disabled:true
                        })
                    }
                })
                var f_slp = 0;
                if(has_half){
                    t_inc_dates.forEach(el=>{
                    if(el.period !==''){
                        f_slp+=.5;
                        }else{
                            f_slp+=1;
                        }
                    })
                    // console.log()
                    setselectedSPL(f_slp)
                    setTempSelectedSPLInclusiveDates(t_inc_dates)
                    var temp = [];
                    var temp2 = [];
                    var sorted = selectedInclusiveDates.sort();
                    for(var i = 0; i <sorted.length ; i++){
                            //check if increment equals to sorted length
                            if(i+1 !== sorted.length){
                                // check if same month and year
                                if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                                    // check if consecutive dates
                                    if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                                        temp2.push(sorted[i].toDate())
                                    }else{
                                        temp2.push(sorted[i].toDate())
                                        temp.push(temp2)
                                        temp2 = []
                                    }
                                }else{
                                    temp2.push(sorted[i].toDate())
                                    temp.push(temp2)
                                    temp2 = []
                                }
                            }else{
                                temp2.push(sorted[i].toDate())
                                temp.push(temp2)
                            }
                    }
                    var inclusiveDates = '';
                    for(var x = 0 ; x<temp.length; x++){
                        /**
                        if counter is not terminated
                        */
                        if(x+1 !== temp.length){
                            if(temp[x].length !==1){
                                if(x ===0 ){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_inc_dates)+'-'

                                        inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_inc_dates)
                                    }else{
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_inc_dates)+'-'

                                        inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_inc_dates)+moment(temp[x][temp[x].length-1]).format(' YYYY, ')
                                    }
                                }else{
                                    // check if next and before array month and year is equal to current data
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                                    moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD-')

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')

                                    }else{
                                        //check if before array month and year is equal to current data
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format(',DD-')

                                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                                        }
                                    }
                                }
                            }else{
                                if(x ===0){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format(',DD')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                                        }
                                    }else{
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                        }
                                    }
                                }
                                
                            }
                        }else{
                            if(temp.length !== 1){
                                if(temp[x].length !== 1){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_inc_dates)+'-'

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_inc_dates)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }else{
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_inc_dates)+'-'
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_inc_dates)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_inc_dates)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_inc_dates)+moment(temp[x][0]).format(' YYYY')
                                    }
                                }
                            }else{
                                if(temp[x].length !== 1){
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_inc_dates)+'-'

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_inc_dates)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }else{
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_inc_dates)+moment(temp[x][0]).format(', YYYY')
                                }
                            }
                        }
                    }
                    // console.log(inclusiveDates)
                    setPreviewInclusiveDates(inclusiveDates)

                }else{
                    var sortedTemp = selectedInclusiveDates.sort()
                    var days = Math.round(selectedSPL/1);
                    if(selectedInclusiveDates.length > days){
                        for (var i = selectedInclusiveDates.length -1; i >= days; i--)
                        sortedTemp.splice(i, 1);
                    }
                    var newTemp = [];
                    sortedTemp.forEach(el=> {
                        var t = {
                            date:el,
                            period:''
                        };
                        newTemp.push(t)
                    })
                    setTempSelectedSPLInclusiveDates(newTemp)
                    var temp = [];
                    var temp2 = [];
                    var sorted = selectedInclusiveDates.sort();
                    for(var i = 0; i <sorted.length ; i++){
                            //check if increment equals to sorted length
                            if(i+1 !== sorted.length){
                                // check if same month and year
                                if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                                    // check if consecutive dates
                                    if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                                        temp2.push(sorted[i].toDate())
                                    }else{
                                        temp2.push(sorted[i].toDate())
                                        temp.push(temp2)
                                        temp2 = []
                                    }
                                }else{
                                    temp2.push(sorted[i].toDate())
                                    temp.push(temp2)
                                    temp2 = []
                                }
                            }else{
                                temp2.push(sorted[i].toDate())
                                temp.push(temp2)
                            }
                    }
                    var inclusiveDates = '';
                    for(var x = 0 ; x<temp.length; x++){
                        /**
                        if counter is not terminated
                        */
                        if(x+1 !== temp.length){
                            if(temp[x].length !==1){
                                if(x ===0 ){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),newTemp)+'-'

                                        inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),newTemp)
                                    }else{
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),newTemp)+'-'

                                        inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),newTemp)+moment(temp[x][temp[x].length-1]).format(' YYYY, ')
                                    }
                                }else{
                                    // check if next and before array month and year is equal to current data
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                                    moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD-')

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')

                                    }else{
                                        //check if before array month and year is equal to current data
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format(',DD-')

                                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                                        }
                                    }
                                }
                            }else{
                                if(x ===0){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format(',DD')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                                        }
                                    }else{
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                        }
                                    }
                                }
                                
                            }
                        }else{
                            if(temp.length !== 1){
                                if(temp[x].length !== 1){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),newTemp)+'-'

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),newTemp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }else{
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),newTemp)+'-'
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),newTemp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),newTemp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),newTemp)+moment(temp[x][0]).format(' YYYY')
                                    }
                                }
                            }else{
                                if(temp[x].length !== 1){
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),newTemp)+'-'

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),newTemp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }else{
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),newTemp)+moment(temp[x][0]).format(', YYYY')
                                }
                            }
                        }
                    }
                    setPreviewInclusiveDates(inclusiveDates)
                }
                
            }else{
                setSLPminDate(SLPminDate1)
                setSLPmaxDate()
                setSLPReasonType('');
                setSLPReason('');
            }
            
            /**
            Check if selected SLP date is greater to current date, then set mindate to current date*/
            
            // console.log(selectedInclusiveDates)

        }
    },[selectedInclusiveDates])
    useEffect(()=>{
        if(workScheduleDataLoaded){
            var startDate = new Date();
            var endDate = "", noOfDaysToMinus = 5, count = 0;   
            // console.log(noOfDaysToMinus)         
            while(count < noOfDaysToMinus){
                endDate = new Date(startDate.setDate(startDate.getDate() - 1));

                let temp = [];
                let temp2 = [];
                
                for(var w=0;w<workScheduleData.length;w++){
                    if(workScheduleData[w].month === parseInt(moment(endDate).format('M')) && workScheduleData[w].year === parseInt(moment(endDate).format('YYYY'))){
                        temp=workScheduleData[w].details;
                        break;
                    }
                }
                if(temp){
                    temp.forEach(el2=>{
                        temp2.push(el2.day)
                    })
                }
                
                if(endDate.getDay() != 0 && endDate.getDay() != 6 && !alreadyAppliedDays.includes(moment(endDate).format('MM-DD-YYYY'))){
                    if(temp2.includes(moment(endDate).format('D'))){
                        count++;
                    }

                }
            }
            // return endDate
            setSLPminDate(endDate)
            setSLPminDate1(endDate)
        }
        
    },[workScheduleDataLoaded])
    
    const inclusiveSPLMinDate = () => {
        var startDate = new Date();
        var endDate = "", noOfDaysToMinus = 5, count = 0;            
        while(count < noOfDaysToMinus){
            endDate = new Date(startDate.setDate(startDate.getDate() - 1));

            let temp = [];
            let temp2 = [];
            
            for(var w=0;w<workScheduleData.length;w++){
                if(workScheduleData[w].month === parseInt(moment(endDate).format('M')) && workScheduleData[w].year === parseInt(moment(endDate).format('YYYY'))){
                    temp=workScheduleData[w].details;
                    break;
                }
            }
            if(temp){
                temp.forEach(el2=>{
                    temp2.push(el2.day)
                })
            }
            
            if(endDate.getDay() != 0 && endDate.getDay() != 6 && !alreadyAppliedDays.includes(moment(endDate).format('MM-DD-YYYY'))){
                if(temp2.includes(moment(endDate).format('D'))){
                    count++;
                }

            }
        }
        return endDate
        // console.log(endDate)
    }
    const inclusiveSPLMaxDate = () => {
        var startDate = new Date();
        var endDate = "", noOfDaysToAdd = 5, count = 0;
        var count_end = 0;

        while(count < noOfDaysToAdd){
            endDate = new Date(startDate.setDate(startDate.getDate() + 1));
            let temp = [];
            let temp2 = [];
            
            for(var w=0;w<workScheduleData.length;w++){
                if(workScheduleData[w].month === parseInt(moment(endDate).format('M')) && workScheduleData[w].year === parseInt(moment(endDate).format('YYYY'))){
                    temp=workScheduleData[w].details;
                    break;
                }
            }
            if(temp){
                temp.forEach(el2=>{
                    temp2.push(el2.day)
                })
            }
            if(endDate.getDay() != 0 && endDate.getDay() != 6 && !alreadyAppliedDays.includes(moment(endDate).format('MM-DD-YYYY'))){
                if(temp2.includes(moment(endDate).format('D'))){
                    count++;
                }
            }else{
                // var diff = moment(workScheduleData[workScheduleData.length-1], 'MM-DD-YYYY').businessDiff(moment('05-08-2017','MM-DD-YYYY'));
                if(moment(endDate).format('YYYY')>moment(new Date()).format('YYYY')){
                    count=5;
                }
            }

            count_end++;

        }
        return endDate
    }
    //credit balance state
    const [balance,setBalance] = React.useState('')
    // const [finalSortedInclusiveDates,setFinalSortedInclusiveDates] = React.useState([]);

    //value for selected sorted inclusive dates
    const [previewInclusiveDates,setPreviewInclusiveDates] = React.useState('');

    //reference for leave application print preview
    const leaveRef = useRef();

    //reference for CTO application print preview
    const cocRef = useRef();

    

    //value for CTO hours
    const [CTOHours,setCTOHours] = React.useState('');
    /**
     * trigger when CTOHours changed
     */
    useEffect(()=>{
        /**
         * check if number of inclusive dates is greater than applied hours
         */
        if(selectedCTOInclusiveDates.length !==0){
            var sortedTemp = selectedCTOInclusiveDates.sort()
            var days = Math.round(CTOHours/8);
            /**
             * if inclusive dates greater than applied hours then remove the oldest date
             */
            if(selectedCTOInclusiveDates.length > days){
                for (var i = selectedCTOInclusiveDates.length -1; i >= days; i--)
                sortedTemp.splice(i, 1);
            }
            var newTemp = [];
            sortedTemp.forEach(el=> {
                var t = {
                    date:el,
                    period:''
                };
                newTemp.push(t)
            })
            setTempSelectedCTOInclusiveDates(newTemp)
        }
    },[CTOHours])
    useEffect(()=>{
        /**
         * check if number of inclusive dates is greater than applied hours
         */
        if(selectedInclusiveDates.length !==0){
            var sortedTemp = selectedInclusiveDates.sort()
            var days = Math.round(selectedSPL/1);
            /**
             * if inclusive dates greater than applied hours then remove the oldest date
             */
            // if(selectedInclusiveDates.length > days){
            //     for (var i = selectedInclusiveDates.length -1; i >= days; i--)
            //     sortedTemp.splice(i, 1);
            // }
            // var newTemp = [];
            // sortedTemp.forEach(el=> {
            //     var t = {
            //         date:el,
            //         period:''
            //     };
            //     newTemp.push(t)
            // })
            // setTempSelectedSPLInclusiveDates(newTemp)
            if(selectedInclusiveDates.length > days){
                setTempSelectedSPLInclusiveDates([])
                setPreviewInclusiveDates('')
                setInclusiveDates([])
            }
        }
        // console.log(selectedSPL)
    },[selectedSPL])
    const [isAppliedAllocationOfMaternityLeave,setisAppliedAllocationOfMaternityLeave] = React.useState(false)
    const [openAllocation,setOpenAllocation] = React.useState(false);
    const [allocationInfo,setallocationInfo] = React.useState({
        employee_contact_details:'',
        same_agency:true,
        allocated_days:1,
        emp_no:'',
        fname:'',
        mname:'',
        lname:'',
        // relationship_to_employee:'',
        // relationship_to_employee_details:'',
        // relationship_to_employee_details_specify:'',
        // relationship_to_employee_proof:'',
        // relationship_to_employee_proof_file:'',

    })
    const saveAllocationForm = (data) => {
        // console.log(data)
        setallocationInfo(data)
    }
    const [selectedRehabilitationDates,setRehabilitationDates] = React.useState('');
    const [selectedBenefitForWomenDates,setselectedBenefitForWomenDates] = React.useState('');
    const [selectedStudyDates,setSelectedStudyDates] = React.useState('');
    const [selectedAdoptionDates,setSelectedAdoptionDates] = React.useState('');


    useEffect(()=>{
        if(selectedInclusiveMaternityDates.length !==0){
            // let toDate = momentBusinessDays(selectedInclusiveMaternityDates.toDate(), 'DD-MM-YYYY').businessAdd(105)._d
            const from = selectedInclusiveMaternityDates.toDate();
            let to;
            var end = daysPeriod;
            if(isAppliedAllocationOfMaternityLeave){
                end = end-allocationInfo.allocated_days;
            }
            // var inclusiveDates = moment(selectedInclusiveMaternityDates.toDate()).format('MMMM DD, YYYY')+' - ' +moment(toDate).format('MMMM DD, YYYY');
            const date = selectedInclusiveMaternityDates.toDate()
            const dates = [];
            var start = 1;
            while(start <= end){
                var exclude = alreadyAppliedDays.includes(moment(date).format('MM-DD-YYYY'))
                let isHoliday = false;
                let holiday_desc;

                holidays.forEach(hol=>{
                    let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                    let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                    let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                    if(target_date >=date_1 && target_date <= date_2){
                        isHoliday = true;
                        holiday_desc = hol.holiday_desc
                    }

                })

                if(exclude){
                    date.setDate(date.getDate() + 1);
                }else{
                    if(isHoliday){
                        date.setDate(date.getDate() + 1);
                    }else{
                        dates.push({
                            date:moment(new Date(date)).format('MM-DD-YYYY'),
                            period:'NONE'
                        });
                        date.setDate(date.getDate() + 1);
                        start++;
                    }
                    
                }   
            }
            var inclusiveDates = moment(dates[0].date,'MM-DD-YYYY').format('MMMM DD,YYYY') + ' - ' + moment(dates[dates.length-1].date,'MM-DD-YYYY').format('MMMM DD,YYYY')
            setPreviewInclusiveDates(inclusiveDates)
            // const exclude_days =[];
            // dates.forEach(el=>{
            //     alreadyAppliedDays.forEach(el2=>{
            //         if(moment(el).format('MM-DD-YYYY') === moment(el2).format('MM-DD-YYYY')){
            //             exclude_days.push(moment(el).format('MM-DD-YYYY'))
            //         }
            //     })
            // })
            // console.log(exclude_days)
            setInclusiveMaternityDatesRange(dates)
        }
    },[selectedInclusiveMaternityDates,isAppliedAllocationOfMaternityLeave,allocationInfo])
    useEffect(()=>{
        if(selectedInclusiveVAWCDates.length !==0){
            var end = daysPeriod;
            const date = selectedInclusiveVAWCDates.toDate()
            const dates = [];
            var start = 1;
            while(start <= end){
                var exclude = alreadyAppliedDays.includes(moment(date).format('MM-DD-YYYY'))
                if(exclude){
                    date.setDate(date.getDate() + 1);
                }else if(moment(date).isBusinessDay()){
                    dates.push(moment(new Date(date)).format('MM-DD-YYYY'));
                    date.setDate(date.getDate() + 1);
                    start++;
                }
                else{
                    date.setDate(date.getDate() + 1);
                }
            }
            var inclusiveDates = moment(dates[0]).format('MMMM DD,YYYY') + ' - ' + moment(dates[dates.length-1]).format('MMMM DD,YYYY')
            setPreviewInclusiveDates(inclusiveDates)
            setInclusiveVAWCDatesRange(dates)
        }
    },[selectedInclusiveVAWCDates])
    useEffect(()=>{
        if(selectedRehabilitationDates.length >1){
            var dates = selectedRehabilitationDates[0].format('MMMM DD,YYYY')+' - '+selectedRehabilitationDates[1].format('MMMM DD,YYYY')
            // allDates.forEach( el =>
            //     console.log(moment(el.toDate()).format('MM-DD-YYYY'))
            // )
            setPreviewInclusiveDates(dates)
        }
    },[selectedRehabilitationDates])
    useEffect(()=>{
        if(selectedBenefitForWomenDates.length >1){
            var dates = selectedBenefitForWomenDates[0].format('MMMM DD,YYYY')+' - '+selectedBenefitForWomenDates[1].format('MMMM DD,YYYY')
            setPreviewInclusiveDates(dates)
        }
    },[selectedBenefitForWomenDates])
    useEffect(()=>{
        if(selectedStudyDates.length >1){
            var dates = selectedStudyDates[0].format('MMMM DD,YYYY')+' - '+selectedStudyDates[1].format('MMMM DD,YYYY')
            setPreviewInclusiveDates(dates)
        }
    },[selectedStudyDates])
    const [slTotalWithoutPay,setslTotalWithoutPay] = React.useState(0);
    const [slAutoWithoutPay,setslAutoWithoutPay] = React.useState(0);
    const [daysWithoutPay,setDaysWithoutPay] = React.useState([]);
    const [daysWithoutPay2,setDaysWithoutPay2] = React.useState([]);
    
    /**
     * used for sorting the inclusive dates selected
     */
    const [borrowedVL,setBorrowedVL] = useState(0);
    const [usedSL,setUsedSL] = useState(0);
    const [isLateFiling,setIsLateFiling] = useState(false);
    useEffect(()=>{
        // console.log(daysWithoutPay)
        if(daysWithoutPay.length ===0){
            setIsLateFiling(false)
        }else{
            daysWithoutPay.forEach(el=>{
                if(el.late_filing){
                    setIsLateFiling(true)
                }
            })
        }
        // console.log(daysWithoutPay)
    },[SLPeriodDays])
    const [defaultHours,setDefaultHours] = useState(1)

    const handleSortInclusiveDates = () => {
        var sorted = selectedInclusiveDates.sort()
        var sortedTemp = selectedInclusiveDates.sort();
        setDaysWithoutPay([])
        setDaysWithoutPay2([])
        if(leaveType === 3){
            setSLAttachment(false)
            var slAutoWithoutPay = 0;
            var isWithPay = false;
            var daysWOP = [];
            
            var t_date = null;
            var n_days_covered = 0;
            
            var t_dates_not_covered = [];
            var t_dates_temp = [];
            /**
            Loop to get dates covered in withpay
             */
            
            selectedInclusiveDates.forEach(el=>{
                if(slRangeDatesWithPay.includes(moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))){
                    isWithPay = true;
                    /**
                    Get number of days covered in sl range with pay
                    */
                    n_days_covered++;
                }else{
                    /**
                    if not covered in sl range with pay, push to dates not covered array;
                     */
                    t_dates_not_covered.push(el)
                }
            })
            t_dates_not_covered = t_dates_not_covered.sort()
            var len = t_dates_not_covered.length;
            var i = len-1;
            
            // console.log(slRangeDatesWithPay.sort())
            var t_dwp = slRangeDatesWithPay.sort();
            var t_dwp_len = t_dwp.length;
            if(t_dates_not_covered.length !== 0){
                alreadyAppliedDays.forEach(el=>{
                if(moment(t_dates_not_covered[0].toDate(),'MM-DD-YYYY').format('YYYY-MM-DD') <= moment(el,'MM-DD-YYYY').format('YYYY-MM-DD') && moment(new Date(),'MM-DD-YYYY').format('YYYY-MM-DD') >= moment(el,'MM-DD-YYYY').format('YYYY-MM-DD')){
                    n_days_covered++;
                }
                })
                var t_sl_period_days = [];
                t_dates_not_covered.forEach(el=>{
                    t_sl_period_days.push({
                        date:moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'),
                        period:'NONE',
                        late_filing:true
                    })
                })
                setDaysWithoutPay(t_sl_period_days)
                setSLPeriodDays(t_sl_period_days)
                setslTotalWithoutPay(t_dates_not_covered.length)
                setslAutoWithoutPay(t_dates_not_covered.length)
                // setTotalSLPeriodDays(t_dates_not_covered.length)
                var inclusiveDates = '';
                var temp = [];
                var temp2 = [];
                var sorted = t_dates_not_covered;
                for(var i = 0; i <sorted.length ; i++){
                    //check if increment equals to sorted length
                    if(i+1 !== sorted.length){
                        // check if same month and year
                        if(moment(sorted[i].toDate(),'MM-DD-YYYY').format('MMMM YYYY') === moment(sorted[i+1].toDate(),'MM-DD-YYYY').format('MMMM YYYY')){
                            // check if consecutive dates
                            if(moment(sorted[i+1].toDate(),'MM-DD-YYYY').diff(moment(sorted[i].toDate()),'days') === 1){
                                temp2.push(sorted[i].toDate())
                            }else{
                                temp2.push(sorted[i].toDate())
                                temp.push(temp2)
                                temp2 = []
                            }
                        }else{
                            temp2.push(sorted[i].toDate())
                            temp.push(temp2)
                            temp2 = []
                        }
                    }else{
                        temp2.push(sorted[i].toDate())
                        temp.push(temp2)
                    }
                }
                for(var x = 0 ; x<temp.length; x++){
                    /**
                    if counter is not terminated
                    */
                    if(x+1 !== temp.length){
                        if(temp[x].length !==1){
                            if(x ===0 ){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                    inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)
                                }else{
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                    inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(' YYYY, ')
                                }
                            }else{
                                // check if next and before array month and year is equal to current data
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                                moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD-')

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')

                                }else{
                                    //check if before array month and year is equal to current data
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD-')

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                                    }
                                }
                            }
                        }else{
                            if(x ===0){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                }
                            }else{
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                    }
                                }
                            }
                            
                        }
                    }else{
                        if(temp.length !== 1){
                            if(temp[x].length !== 1){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }else{
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'
                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }
                            }else{
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][0]).format(' YYYY')
                                }
                            }
                        }else{
                            if(temp[x].length !== 1){
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                            }else{
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][0]).format(', YYYY')
                            }
                        }
                    }
                }
                setPreviewInclusiveDates(inclusiveDates)

            }else{
                for(i;i>=0;i--){
                    var interval = momentBusinessDays(moment(new Date(),'MM-DD-YYYY').format('MM-DD-YYYY')).businessDiff(momentBusinessDays(moment(t_dates_not_covered[i].toDate()).format('MM-DD-YYYY')),true)
                    if((interval-n_days_covered) <= 5){
                        // console.log(moment(t_dates_not_covered[i].toDate()).format('MM-DD-YYYY'))
                        n_days_covered++;
                    }else{
                        daysWOP.push(moment(t_dates_not_covered[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))
                    }

                }
                if(!isWithPay){
                    /**
                    * get all dates without pay
                    */
                    selectedInclusiveDates.forEach(el=>{
                        if(moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY') <= moment(slNoPay,'MM-DD-YYYY').format('MM-DD-YYYY')){
                            daysWOP.push(moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))
                        }

                    })
                }

                // if(!isWithPay){
                //     daysWOP = [...new Set(daysWOP)];
                // }
                daysWOP = [...new Set(daysWOP)];

                // console.log(daysWOP)
                let totalWithoutPay=0,finalTotal=0,t_total_has_period=0;
                var t_var_min=.5;
                var t_var_default_hours =.0;

                if(selectedInclusiveDates.length>0){
                    var min_credits = assignWorkingHrsDays.filter((el2)=>{
                        return el2.year === parseInt(selectedInclusiveDates[0].format('YYYY')) && el2.day === selectedInclusiveDates[0].format('dddd')
                    })
                    t_var_min = min_credits[0].hours/2;
                    t_var_default_hours = min_credits[0].hours;
                }
                setDefaultHours(t_var_default_hours)

                var t_total_default_hours = selectedInclusiveDates.length*t_var_default_hours;
                /**
                get  groupings by t_var_min
                */
                var t_group=balance;
                var t_count=0;
                
                
                selectedInclusiveDates.forEach(el=>{
                    var t_period = alreadyAppliedDaysPeriod.filter((el2)=>{
                        return el2.date === moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY')
                    })
                    if(t_period.length >0){
                        t_total_has_period+=t_var_min;
                    }
                })
                var totalWithPay=0;
                var totalWithoutPayCredits=0;
                var totalWithPayCredits=0;
                if(daysWOP.length === 0 ){
                    // console.log(t_total_default_hours)
                    if((t_total_default_hours-t_total_has_period) > balance){
                        totalWithoutPay = (t_total_default_hours-t_total_has_period)/t_var_default_hours
                        if(balance>=0){
                            /**
                            * Check first if total of SL and VL bal is greater of equal to total credits to deduct
                            */
                            if(availableVL+availableSL >= t_total_default_hours){
                                totalWithoutPay = 0;
                                var t_borrow = t_total_default_hours - balance;
                                // console.log(t_borrow.toFixed(3))
                                // console.log(t_total_default_hours)
                                setSlCreditsWpay(balance)
                                setUsedSL(balance/t_var_default_hours)
                                setBorrowedVL(t_borrow/t_var_default_hours)
                                setBorrowedVLCredits(t_borrow)
                                

                            }else{
                                // console.log('here')
                                var t_bal = balance;
                                var t_count=0;
                                while(t_bal>=t_var_min){
                                    t_bal=t_bal-t_var_min;
                                    t_count+=t_var_min;
                                }
                                totalWithPayCredits = t_count
                                var t_eq_with_pay_days = t_count/t_var_default_hours;

                                totalWithoutPay = totalWithoutPay-(t_count/t_var_default_hours);

                                var t_remaining_bal = balance-t_count;
                                var t_borrow = (t_total_default_hours-t_count).toFixed(3)
                                
                                /**
                                Borrow credits from VL, check first if vl is greater to .5
                                */
                                // console.log(t_borrow)
                                // console.log(t_remaining_bal)
                                if(availableVL>=t_var_min){
                                    if(availableVL>=t_borrow){
                                        // console.log('here')
                                        var t_vl_bal = availableVL-t_borrow;
                                        setBorrowedVL(t_borrow)
                                        setUsedSL(balance)
                                        totalWithoutPay = 0;
                                        totalWithPay = balance+t_borrow
                                    }else{
                                        /**
                                        add sl remaining bal to vl balance
                                        */
                                        var t_sl_vl = balance+availableVL;
                                        /**
                                        get maximum groupings by t_var_min
                                        */
                                        var t_t_sl_vl = t_sl_vl;
                                        var t_sl_vl_count = 0;
                                        while(t_t_sl_vl>=t_var_min){
                                            t_t_sl_vl = t_t_sl_vl - t_var_min
                                            t_sl_vl_count+=t_var_min
                                        }
                                        setBorrowedVL((t_sl_vl_count-balance)/t_var_default_hours)
                                        setBorrowedVLCredits(t_sl_vl_count-balance)
                                        setSlCreditsWpay(balance)
                                        setUsedSL(balance/t_var_default_hours)

                                        totalWithPay = (t_sl_vl_count/t_var_default_hours)
                                        // totalWithoutPay = totalWithoutPay - t_sl_vl_count
                                        totalWithoutPay = (t_total_default_hours-t_sl_vl_count)/t_var_default_hours
                                        // console.log(balance)
                                    }
                                    
                                }else{
                                    setSlCreditsWpay(t_count)
                                    setUsedSL(t_eq_with_pay_days)
                                    setBorrowedVL(0)
                                    
                                }
                            }
                            
                        }else{
                            var t_borrow = totalWithoutPay.toFixed(3)
                            /**
                            Borrow credits from VL, check first if vl is greater to .5
                            */
                            if(availableVL>=.5){
                                if(availableVL>=t_borrow){
                                    var t_vl_bal = availableVL-t_borrow;
                                    setBorrowedVL(t_borrow)
                                    setUsedSL(balance)
                                    totalWithoutPay = 0;
                                    totalWithPay = parseFloat(t_borrow)+parseFloat(balance);
                                    setVlWpay(totalWithPay.toFixed(0))

                                }else{
                                    /**
                                    add sl remaining bal to vl balance
                                    */
                                    var t_sl_vl = balance+availableVL;
                                    /**
                                    get maximum groupings by .5
                                    */
                                    var t_t_sl_vl = t_sl_vl;
                                    var t_sl_vl_count = 0;
                                    while(t_t_sl_vl>=.5){
                                        t_t_sl_vl = t_t_sl_vl - .5
                                        t_sl_vl_count+=.5
                                    }
                                    setBorrowedVL((t_sl_vl_count-balance).toFixed(3))
                                    setUsedSL(balance.toFixed(3))

                                    totalWithoutPay = totalWithoutPay - t_sl_vl_count
                                    totalWithPay = totalWithPay + t_sl_vl_count;
                                    setVlWpay(totalWithPay)
                                }
                                
                            }else{
                                setUsedSL(0)
                                setBorrowedVL(0)
                            }
                        }
                    }else{
                        setSlCreditsWpay(selectedInclusiveDates.length*t_var_default_hours)
                        setUsedSL(selectedInclusiveDates.length-t_total_has_period)
                        setBorrowedVL(0)
                        totalWithoutPay = 0;
                    }
                }else{
                    // if((selectedInclusiveDates.length - daysWOP.length) > balance){
                    //     totalWithoutPay = (selectedInclusiveDates.length - daysWOP.length)-Math.floor(balance)
                    // }else{
                    //     totalWithoutPay = 0;
                    // }
                    
                    /**
                    Check if dates has with pay
                    */
                    //  console.log(selectedInclusiveDates)
                    //  console.log(daysWOP)
                    selectedInclusiveDates.forEach(el=>{
                        // if(slRangeDatesWithPay.includes(el.format('MM-DD-YYYY')) || !daysWOP.includes(el.format('MM-DD-YYYY'))){
                        //     totalWithoutPay++
                        // }
                        if(daysWOP.includes(el.format('MM-DD-YYYY'))){
                            totalWithoutPay++
                        }
                    })
                    //  console.log(totalWithoutPay)

                    /**
                    check if sl val is greater than to with pay
                    */
                    if(availableSL>totalWithoutPay){
                        // setUsedSL(totalWithoutPay)
                        setUsedSL(0)
                        setBorrowedVL(0)
                        // totalWithoutPay = selectedInclusiveDates.length-totalWithoutPay;
                        // totalWithPay = totalWithoutPay;
                        totalWithPay = 0;
                        // console.log(totalWithPay)
                    }else{
                        // console.log(totalWithoutPay)
                        if(availableSL>=totalWithoutPay){
                        
                        }else{
                            if(availableSL>=t_var_min){
                                var t_t_sl = availableSL;
                                var t_sl_count=0;
                                var t_vl_count=0;
                                while(t_t_sl>=.5){
                                    t_t_sl = t_t_sl - t_var_min
                                    t_sl_count+=t_var_min
                                }
                                setUsedSL(availableSL);
                                var t_to_borrow = totalWithoutPay-availableSL;
                                if(availableVL>=t_to_borrow){
                                    // console.log('here')
                                    setBorrowedVL(t_to_borrow)
                                    totalWithoutPay = (totalWithoutPay - (availableSL+t_to_borrow))+ daysWOP.length
                                }else{
                                    /**
                                    add sl remaining bal to vl balance
                                    */
                                    var t_sl_vl = balance+availableVL;
                                    /**
                                    get maximum groupings by .5
                                    */
                                    var t_t_sl_vl = t_sl_vl;
                                    var t_sl_vl_count = 0;
                                    while(t_t_sl_vl>=t_var_min){
                                        t_t_sl_vl = t_t_sl_vl - t_var_min
                                        t_sl_vl_count+=t_var_min
                                    }
                                    setBorrowedVL((t_sl_vl_count-balance).toFixed(3))
                                    setUsedSL(balance.toFixed(3))

                                    totalWithoutPay = (totalWithoutPay - t_sl_vl_count)+daysWOP.length
                                    totalWithPay = totalWithPay + t_sl_vl_count;
                                    setVlWpay(totalWithPay)
                                    // console.log(totalWithoutPay)
                                    // console.log(totalWithPay)
                                }
                            }
                        }
                        
                    }
                    // setUsedSL(0)
                    // setBorrowedVL(0)
                    // totalWithoutPay = selectedInclusiveDates.length


                }

                var t_daysWOP = [];
                // console.log(slNoPay)
                // console.log(totalWithoutPay)
                // console.log(daysWOP)

                if(daysWOP.length>0){
                    if(totalWithoutPay>0){
                        var i=selectedInclusiveDates.length-1;
                        var t_daysWOP_2 = [];

                            var t_counter = totalWithoutPay-daysWOP.length;
                            for(i;t_counter>0;t_counter--){
                                t_daysWOP_2.push(moment(selectedInclusiveDates[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))
                                i--;
                            }
                            daysWOP.forEach(el=>{
                                t_daysWOP_2.push(el)
                            })
                            t_daysWOP_2.forEach((el,key)=>{
                                if(moment(el,'MM-DD-YYYY').format('YYYY-MM-DD')<=moment(slNoPay,'MM-DD-YYYY').format('YYYY-MM-DD')){
                                    var late_filing = true;
                                }else{
                                    var late_filing = false;
                                }
                                // console.log(late_filing)
                                if(key===0){
                                    if((totalWithPay/0.5)%2!==0|| (totalWithoutPay/0.5)%2!==0){
                                        t_daysWOP.push({
                                            date:el,
                                            period:'PM',
                                            late_filing:late_filing
                                        })
                                    }else{
                                        t_daysWOP.push({
                                            date:el,
                                            period:'NONE',
                                            late_filing:late_filing
                                        })
                                    }
                                }else{
                                    var t_has_applied = alreadyAppliedDaysPeriod.filter((el2)=>{
                                        return moment(el2.date,'MM-DD-YYYY').format('MM-DD-YYYY') === el
                                    })
                                    if(t_has_applied.length >0){
                                        if(t_has_applied[0].period === 'AM'){
                                            t_daysWOP.push({
                                                date:el,
                                                period:'PM',
                                                late_filing:late_filing

                                            })
                                        }
                                        if(t_has_applied[0].period === 'PM'){
                                            t_daysWOP.push({
                                                date:el,
                                                period:'AM',
                                                late_filing:late_filing

                                            })
                                        }
                                    }else{
                                        t_daysWOP.push({
                                            date:el,
                                            period:'NONE',
                                            late_filing:late_filing

                                        })
                                    }
                                }
                                
                            })
                            // alreadyAppliedDaysPeriod.forEach(el=>{
                            //     if(daysWOP.includes(moment(el.date).format('MM-DD-YYYY'))){
                            //         if(el.period === 'AM'){
                            //             t_daysWOP.push({
                            //                 date:moment(el.date).format('MM-DD-YYYY'),
                            //                 period:'PM'
                            //             })
                            //         }
                            //         if(el.period === 'PM'){
                            //             t_daysWOP.push({
                            //                 date:moment(el.date).format('MM-DD-YYYY'),
                            //                 period:'AM'
                            //             })
                            //         }
                            //     }
                            // })
                            setDaysWithoutPay(t_daysWOP)
                            // console.log(t_daysWOP)
                            setDaysWithoutPay2(t_daysWOP)

                    }else{
                        // setDaysWithoutPay(daysWOP)

                        alreadyAppliedDaysPeriod.forEach(el=>{
                            
                            if(daysWOP.includes(moment(el.date,'MM-DD-YYYY').format('MM-DD-YYYY'))){
                                if(moment(el.date,'MM-DD-YYYY').format('YYYY-MM-DD')<=moment(slNoPay,'MM-DD-YYYY').format('YYYY-MM-DD')){
                                    var late_filing = true;
                                }else{
                                    var late_filing = false;
                                }
                                if(el.period === 'AM'){
                                    t_daysWOP.push({
                                        date:moment(el.date).format('MM-DD-YYYY'),
                                        period:'PM',
                                        late_filing:late_filing
                                    })
                                }
                                if(el.period === 'PM'){
                                    t_daysWOP.push({
                                        date:moment(el.date).format('MM-DD-YYYY'),
                                        period:'AM',
                                        late_filing:late_filing

                                    })
                                }
                            }
                        })
                        setDaysWithoutPay(t_daysWOP)
                        setDaysWithoutPay2(t_daysWOP)

                    }
                }else{
                    // console.log(totalWithoutPay)
                    if(totalWithoutPay>0){
                        var i=selectedInclusiveDates.length-1;
                        var t_counter = totalWithoutPay;
                        var t_counter2 = totalWithoutPay;
                        for(i;t_counter>0;){
                            var t_check = alreadyAppliedDaysPeriod.filter((el2)=>{
                                return el2.date === moment(selectedInclusiveDates[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY')
                            })
                            if(t_check.length === 0){
                                daysWOP.push(moment(selectedInclusiveDates[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))
                                t_counter--;
                            }
                            i--;

                        }
                        daysWOP.sort();
                        daysWOP.reverse();
                        // setDaysWithoutPay(daysWOP)
                        daysWOP.forEach((el,key)=>{
                                if(moment(el,'MM-DD-YYYY').format('YYYY-MM-DD')<=moment(slNoPay,'MM-DD-YYYY').format('YYYY-MM-DD')){
                                    var late_filing = true;
                                }else{
                                    var late_filing = false;
                                }
                                var t_check = alreadyAppliedDaysPeriod.filter((el2)=>{
                                    return el2.date === el
                                })
                                if(key ===0){
                                    if(t_check.length === 0){
                                        /**
                                        Check if odd when divided by 0.5, meaning theres halfday with pay and without pay
                                        */
                                        if((totalWithPay/0.5)%2!==0|| (totalWithoutPay/0.5)%2!==0){
                                            t_daysWOP.push({
                                                date:el,
                                                period:'PM',
                                                late_filing:late_filing
                                            })
                                        }else{
                                            t_daysWOP.push({
                                            date:el,
                                            period:'NONE',
                                            late_filing:late_filing
                                            })
                                        }
                                        
                                    }else{
                                        if(t_check[0].period === 'AM'){
                                            t_daysWOP.push({
                                                date:el,
                                                period:'PM',
                                                late_filing:late_filing
                                            })
                                        }
                                        if(t_check[0].period === 'PM'){
                                            t_daysWOP.push({
                                                date:el,
                                                period:'AM',
                                                late_filing:late_filing
                                            })
                                        }
                                    }
                                }else{
                                    if(t_check.length === 0){
                                    t_daysWOP.push({
                                        date:el,
                                        period:'NONE',
                                        late_filing:late_filing
                                        })
                                    }else{
                                        if(t_check[0].period === 'AM'){
                                            t_daysWOP.push({
                                                date:el,
                                                period:'PM',
                                                late_filing:late_filing
                                            })
                                        }
                                        if(t_check[0].period === 'PM'){
                                            t_daysWOP.push({
                                                date:el,
                                                period:'AM',
                                                late_filing:late_filing
                                            })
                                        }
                                    }
                                }
                                
                                
                        })
                        setDaysWithoutPay(t_daysWOP)
                        setDaysWithoutPay2(t_daysWOP)
                    }
                }
                var t_final_total = 0;
                // console.log(t_daysWOP)
                t_daysWOP.forEach(el=>{
                    if(el.period !== 'NONE'){
                        t_final_total+=0.5;
                    }else{
                        t_final_total+=1;
                    }
                })
                // console.log('set sl wopay')
                setslTotalWithoutPay(t_final_total)
                // setslTotalWithoutPay(t_final_total)
                // setslAutoWithoutPay(Math.floor(daysWOP.length));

                // if(t_final_total>0){
                //     setslTotalWithoutPay(t_final_total)
                // }else{
                //     finalTotal = daysWOP.length+totalWithoutPay;
                //     setslTotalWithoutPay(finalTotal)
                // }
                
                /**
                Check if selected dates has already applied period
                */
                var has_period = [];
                var w_schedule = [];
                var selected_has_period = [];
                alreadyAppliedDaysPeriod.forEach(el=>{
                    has_period.push(el.date)
                })
                // workScheduleData.forEach(el=>{
                //     w_schedule.push(el.day)
                // })
                var t_sl_period_days = [];
                var t_sl_period_days_wpay = [];
                var prev_date_has_period = false;
                var prev_date_period = '';
                var has_sl_has_period = false;
                var total_days_period = 0;
                var t_sorted = [];
                var t_count_with_pay=totalWithPay;
                sorted.forEach(el=>{
                    if(totalWithPay>0){
                        if(t_count_with_pay !== 0.5){
                            if(!daysWOP.includes(moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))){
                                t_sorted.push(el)
                            }
                        }else{
                            t_sorted.push(el)
                        }
                        t_count_with_pay--;
                    }else{
                    if(!daysWOP.includes(moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))){
                            t_sorted.push(el)
                        } 
                    }
                    
                    
                })
                var t_count_with_pay2=totalWithPay;
                t_sorted.forEach(el=>{
                    if(has_period.includes(moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'))){
                        // console.log('here')
                        total_days_period+=0.5;
                        has_sl_has_period = true;
                        prev_date_has_period = true;
                        var t_applied_days_period = alreadyAppliedDaysPeriod.filter((el2)=>{
                            return moment(el2.date,'MM-DD-YYYY').format('MM-DD-YYYY') === moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY')
                        })
                        if(t_applied_days_period[0].period === 'AM'){
                            t_sl_period_days.push({
                                date:moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'),
                                period:'PM',
                                disabled:true
                            })
                            t_sl_period_days_wpay.push({
                                date:moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'),
                                period:'PM',
                                disabled:true
                            })
                            prev_date_period = 'PM';
                        }else{
                            t_sl_period_days.push({
                                date:moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'),
                                period:'AM',
                                disabled:true
                            })
                            t_sl_period_days_wpay.push({
                                date:moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'),
                                period:'AM',
                                disabled:true
                            })
                            prev_date_period = 'AM';
                        }
                        /**
                        Get next day
                        */
                        var new_schedule = workScheduleData.filter((el2)=>{
                            return parseInt(moment(el.toDate(),'MM-DD-YYYY').format('M')) === el2.month && parseInt(moment(el.toDate(),'MM-DD-YYYY').format('YYYY')) === el2.year
                        })
                        /**
                        Check if last day of month, then get next month sched
                        */
                        var is_last_day = false;
                        if(new_schedule[0].details[new_schedule[0].details.length-1].day === moment(el.toDate(),'MM-DD-YYYY').format('D')){
                            is_last_day = true;
                            new_schedule = workScheduleData.filter((el2)=>{
                                return parseInt(moment(el.toDate(),'MM-DD-YYYY').format('M'))+1 === el2.month && parseInt(moment(el.toDate(),'MM-DD-YYYY').format('YYYY')) === el2.year
                        })
                        }
                        /**
                        Check if has selected next day of sched,if last day start with 1
                        */
                        var len = selectedInclusiveDates.length
                        var i = 0;

                        if(is_last_day){
                            /**
                            Get first day of work sched if AM
                            */
                            if(t_applied_days_period[0].period === 'AM'){
                                var s_date = moment(new_schedule[0].month+'-'+new_schedule[0].details[0].day+'-'+new_schedule[0].year).format('MM-DD-YYYY');
                                var has_found = false;
                                for(i;i<len;i++){
                                    if(moment(selectedInclusiveDates[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY') === s_date){
                                        has_found = true;
                                        break;
                                    }
                                }
                                if(!has_found){
                                    toast.warning('Please select the next day of '+moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY')+'. To accumulate 1 day')
                                }
                            }else{
                                var s_date =moment(new Date(el.toDate().setDate(el.toDate().getDate() + 1)),'MM-DD-YYYY').format('MM-DD-YYYY');
                                var has_found = false;
                                for(i;i<len;i++){
                                    if(moment(selectedInclusiveDates[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY') === s_date){
                                        has_found = true;
                                        break;
                                    }
                                }
                                if(!has_found){
                                    toast.warning('Please select the next day of '+moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY')+'. To accumulate 1 day')
                                }
                            }
                            
                        }else{
                            /**
                            Get next day of work sched if AM
                            */
                            /**
                            Get index of work sched
                            */
                            // new_schedule[0].details.forEach((eldays)=>{
                            //     index_arr = eldays.day.indexOf(moment(el.toDate()).format('D'))
                            // })
                            var index_arr = new_schedule[0].details.map(function(e) { return e.day; }).indexOf(moment(el.toDate()).format('D'));
                            if(prev_date_period === 'PM'){
                                var s_date = moment(new_schedule[0].month+'-'+new_schedule[0].details[index_arr+1].day+'-'+new_schedule[0].year).format('MM-DD-YYYY');
                                var has_found = false;

                                for(i;i<len;i++){
                                    if(moment(selectedInclusiveDates[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY') === s_date){
                                        has_found = true;
                                        break;
                                    }
                                }
                                if(!has_found){
                                    toast.warning('Please select '+moment(new_schedule[0].month+'-'+new_schedule[0].details[index_arr+1].day+'-'+new_schedule[0].year,'MM-DD-YYYY').format('MM-DD-YYYY')+'. To accumulate 1 day')
                                }
                            }else{
                                var s_date = moment(new_schedule[0].month+'-'+new_schedule[0].details[index_arr-1].day+'-'+new_schedule[0].year,'MM-DD-YYYY').format('MM-DD-YYYY');
                                var has_found = false;

                                for(i;i<len;i++){
                                    if(moment(selectedInclusiveDates[i].toDate(),'MM-DD-YYYY').format('MM-DD-YYYY') === s_date){
                                        has_found = true;
                                        break;
                                    }
                                }
                                if(!has_found){
                                    toast.warning('Please select '+moment(new_schedule[0].month+'-'+new_schedule[0].details[index_arr-1].day+'-'+new_schedule[0].year,'MM-DD-YYYY').format('MM-DD-YYYY')+'. To accumulate 1 day')
                                }
                            }
                            
                        
                        }
                        t_count_with_pay2-=0.5
                    }else{
                        // if(totalWithPay === 0.5){
                        //     t_sl_period_days.push({
                        //         date:moment(el.toDate()).format('MM-DD-YYYY'),
                        //         period:'NONE',
                        //         disabled:true
                        //     })
                        //     total_days_period+=0.5;
                        //     if(totalWithPay>0){
                        //         totalWithPay-=.5
                        //     }
                            
                        // }else{
                        //     t_sl_period_days.push({
                        //         date:moment(el.toDate()).format('MM-DD-YYYY'),
                        //         period:'NONE',
                        //         disabled:false
                        //     })
                        
                        //     total_days_period+=1;
                        //     if(totalWithPay>0){
                        //         totalWithPay--;
                        //     }
                        // }
                        if(t_count_with_pay2 !== 0.5){
                            t_sl_period_days.push({
                                date:moment(el.toDate()).format('MM-DD-YYYY'),
                                period:'NONE',
                                disabled:false
                            })
                            total_days_period++;
                        }else{
                            t_sl_period_days.push({
                                date:moment(el.toDate()).format('MM-DD-YYYY'),
                                period:'AM',
                                disabled:false
                            })
                            total_days_period+=0.5;
                        }
                        
                        prev_date_has_period = false
                        t_count_with_pay2--;
                        
                    }
                })
                if(totalWithPay>0){
                    var t_t_wpay=totalWithPay;
                    
                    t_sorted.forEach((el,key)=>{
                        var t_exists = t_sl_period_days.filter((el2)=>{
                            return el2.date === moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY')
                        })
                        if(t_exists.length ===0){
                            if(t_t_wpay>=0){
                                if(t_t_wpay === 0.5 || totalWithoutPay === 0.5){
                                    t_sl_period_days.push({
                                        date:moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'),
                                        period:'AM',
                                        disabled:false
                                    })
                                    t_t_wpay-=0.5;
                                }else{
                                    t_sl_period_days.push({
                                        date:moment(el.toDate(),'MM-DD-YYYY').format('MM-DD-YYYY'),
                                        period:'NONE',
                                        disabled:false
                                    })
                                    t_t_wpay--;
                                }
                            }
                        }else{

                        }
                        
                        
                    })
                }
                setTotalSLPeriodDays(total_days_period)
                setSLHasPeriodDays(has_sl_has_period)
                console.log(t_sl_period_days)
                // setSLPeriodDaysWpay(t_sl_period_days_wpay)
                setSLPeriodDays(t_sl_period_days)
                setslAutoWithoutPay(totalWithoutPay);
                var t_comp = total_days_period+t_final_total
                /**
                Store workschedule day
                */
                // console.log(workScheduleData)
            

                // if(selectedInclusiveDates.length >5){
                //     setSLAttachment(true)
                // }else{
                //     setSLAttachment(false)
                // }
                // if(selectedInclusiveDates.length !==0){
                //     if(moment(sorted[0].toDate()).format('YYYY-MM-DD') > moment(new Date).format('YYYY-MM-DD')){
                //         setSLAttachment(true)
                //     }
                // }else{
                //     setSLAttachment(false)
                // }
                /**
                Check if date is current or future
                */
                
                /**
                Check if continuous 5 days
                */
                /**
                Get unique month and year from selected period days
                */
                var t_arr = [];
                SLPeriodDays.forEach(el=>{
                    t_arr.push(moment(el.date,'MM-DD-YYYY').format('MM-YYYY'))
                })
                /**
                    * Set unique month number and year
                    */
                var t_unique_arr = [...new Set(t_arr)]
                /**
                Get workschedule from that month number and year
                    */
                var t_sched = [];
                t_unique_arr.forEach(el=>{
                    var t_split = el.split('-');
                    var month = t_split[0];
                    var year = t_split[1];
                    workScheduleData.forEach(el2=>{
                        if(el2.month === parseInt(month) && el2.year === parseInt(year)){
                            t_sched.push(el2)
                        }
                    })
                })
                /**
                Loop sched to remove the already applied days
                    */
                var t_sched2 = [];
                t_sched.forEach(el=>{
                    var d = []
                    el.details.forEach(el2=>{
                        if(!alreadyAppliedDays.includes(moment(el.month+'-'+el2.day+'-'+el.year,'MM-DD-YYYY').format('MM-DD-YYYY'))){
                            d.push(moment(el.month+'-'+el2.day+'-'+el.year,'MM-DD-YYYY').format('MM-DD-YYYY'))
                        }
                    })
                    t_sched2 = t_sched2.concat(d)
                })
                /**
                get sl days period to check if continuous date based on work schedule
                    */
                
                /**
                we will used for loop, to break anytime if we found sl not continuous 
                    */
                var t_sl_len = sorted.length;
                var t_sl_counter = 0;
                var t_sl_index; 
                var t_sl_is_continuous = true;
                var t_sl_date_text_html = '';
                for(t_sl_counter;t_sl_counter<t_sl_len;t_sl_counter++){
                    /**
                    get index of first sl days period, then we will start there
                    */
                    if(t_sl_counter === 0){
                        t_sl_index = t_sched2.indexOf(sorted[t_sl_counter].format('MM-DD-YYYY'));
                        t_sl_index++;

                        // t_sl_date_text_html+='<span>'+moment(SLPeriodDays[t_sl_counter].date).format('MMMM DD,YYYY')+',</span>';
                    }else{
                    
                        if(sorted[t_sl_counter].format('MM-DD-YYYY') !== moment(t_sched2[t_sl_index],'MM-DD-YYYY').format('MM-DD-YYYY')){
                            t_sl_is_continuous = false;
                            // t_sl_date_text_html+='<span style="color:red;">'+moment(SLPeriodDays[t_sl_counter].date).format('MMMM DD,YYYY')+'</span>';
                            break;
                        }
                        // t_sl_date_text_html+='<span>'+moment(SLPeriodDays[t_sl_counter].date).format('MMMM DD,YYYY')+',</span>';
                        t_sl_index++;
                    }
                }
                // if(selectedInclusiveDates.length>5){
                //     setSLAttachment(true)
                // }else{
                    
                //     // setSLAttachment(false)
                // }
                selectedInclusiveDates.forEach(el=>{
                    if(moment(el.toDate(),'MM-DD-YYYY').format('YYYY-MM-DD')>moment(new Date(),'MM-DD-YYYY').format('YYYY-MM-DD')){
                        setSLAttachment(true)
                    }
                })
            var temp = [];
            var temp2 = [];
            for(var i = 0; i <sorted.length ; i++){
                //check if increment equals to sorted length
                if(i+1 !== sorted.length){
                    // check if same month and year
                    if(moment(sorted[i].toDate(),'MM-DD-YYYY').format('MMMM YYYY') === moment(sorted[i+1].toDate(),'MM-DD-YYYY').format('MMMM YYYY')){
                        // check if consecutive dates
                        if(moment(sorted[i+1].toDate(),'MM-DD-YYYY').diff(moment(sorted[i].toDate()),'days') === 1){
                            temp2.push(sorted[i].toDate())
                        }else{
                            temp2.push(sorted[i].toDate())
                            temp.push(temp2)
                            temp2 = []
                        }
                    }else{
                        temp2.push(sorted[i].toDate())
                        temp.push(temp2)
                        temp2 = []
                    }
                }else{
                    temp2.push(sorted[i].toDate())
                    temp.push(temp2)
                }
            }
                // setFinalSortedInclusiveDates(temp)
                var inclusiveDates = '';
                

                /**
                new
                */
                for(var x = 0 ; x<temp.length; x++){
                    /**
                    if counter is not terminated
                    */
                    if(x+1 !== temp.length){
                        if(temp[x].length !==1){
                            if(x ===0 ){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                    inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)
                                }else{
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                    inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(' YYYY, ')
                                }
                            }else{
                                // check if next and before array month and year is equal to current data
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                                moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD-')

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')

                                }else{
                                    //check if before array month and year is equal to current data
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD-')

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                                    }
                                }
                            }
                        }else{
                            if(x ===0){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                }
                            }else{
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                    }
                                }
                            }
                            
                        }
                    }else{
                        if(temp.length !== 1){
                            if(temp[x].length !== 1){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }else{
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'
                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }
                            }else{
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][0]).format(' YYYY')
                                }
                            }
                        }else{
                            if(temp[x].length !== 1){
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+'-'

                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod2(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                            }else{
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod2(moment(temp[x][0]).format('MM-DD-YYYY'),t_sl_period_days)+moment(temp[x][0]).format(', YYYY')
                            }
                        }
                    }
                }
                // console.log(inclusiveDates)
                setPreviewInclusiveDates(inclusiveDates)
            }
            

            
        }
        else if(leaveType === 6){
            
        }else{
            var temp = [];
            var temp2 = [];
            for(var i = 0; i <sorted.length ; i++){
                //check if increment equals to sorted length
                if(i+1 !== sorted.length){
                    // check if same month and year
                    if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                        // check if consecutive dates
                        if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                            temp2.push(sorted[i].toDate())
                        }else{
                            temp2.push(sorted[i].toDate())
                            temp.push(temp2)
                            temp2 = []
                        }
                    }else{
                        temp2.push(sorted[i].toDate())
                        temp.push(temp2)
                        temp2 = []
                    }
                }else{
                    temp2.push(sorted[i].toDate())
                    temp.push(temp2)
                }
            }
            var inclusiveDates = '';
            for(var x = 0 ; x<temp.length; x++){
                if(x+1 !== temp.length){
                    if(temp[x].length !==1){
                        if(x ===0 ){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                                inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')
                            }else{
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                                inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD YYYY, ')
                            }
                        }else{
                            // check if next and before array month and year is equal to current data
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                            moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')
                            }else{
                                //check if before array month and year is equal to current data
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD-')
                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                                }
                            }
                        }
                    }else{
                        if(x ===0){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                            }
                        }else{
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                                }
                            }else{
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                }
                            }
                        }
                        
                    }
                }else{
                    if(temp.length !== 1){
                        if(temp[x].length !== 1){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                            }else{
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                            }
                        }else{
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD,YYYY')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY')
                            }
                        }
                    }else{
                        if(temp[x].length !== 1){
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD, YYYY')
                        }
                    }
                }
            }
            setPreviewInclusiveDates(inclusiveDates)
         }
        // if(leaveType === 6){
        //     var days = Math.round(selectedSPL/1);
        //     if(selectedInclusiveDates.length > days){
        //         for (var i = selectedInclusiveDates.length -1; i >= days; i--)
        //         sortedTemp.splice(i, 1);
        //     }
        //     var newTemp = [];
        //     sortedTemp.forEach(el=> {
        //         var t = {
        //             date:el,
        //             period:''
        //         };
        //         newTemp.push(t)
        //     })
        //     setTempSelectedSPLInclusiveDates(newTemp)
        //     console.log(newTemp)
        // }

        
        
    }
    useEffect(()=>{
        if(SLHalfDays){
            var t_total = 0;
            var t_total_wopay = 0;
            SLPeriodDays.forEach(el=>{
                if(el.period !=='NONE'){
                    t_total+=0.5;
                }else{
                    t_total++;
                }
            })
            setTotalSLPeriodDays(t_total)
            daysWithoutPay.forEach(el=>{
                if(el.period !=='NONE'){
                    t_total_wopay+=0.5;
                }else{
                    t_total_wopay++;
                }
            })
            /**
            * Check if updated period covered with without pay
            */
            // console.log(t_total)
            // console.log(SLPeriodDays)
            setSlCreditsWpay(t_total*defaultHours)
            /**
            * Check if days wopay period is same with withpay
            */
            SLPeriodDays.forEach(el=>{
                var t_same = daysWithoutPay.filter((el2,key)=>{
                    return el.date === el2.date && el.period === el2.period && key === daysWithoutPay.length-1
                })
                if(t_same.length>0){
                    /**
                    get index of dwopay to remove
                    */
                    const index = daysWithoutPay.findIndex(item => item.date === el.date);
                    // console.log(index)
                    var t_temp = [...daysWithoutPay];
                    t_temp.splice(index,1);
                    // console.log(t_temp)
                    setDaysWithoutPay(t_temp)
                    // console.log('set sl wopay')
                    setslTotalWithoutPay(prevItem => prevItem-0.5)
                    setslAutoWithoutPay(prevItem => prevItem-0.5)
                    /**
                    Update to borrow
                    */
                    if(t_total>=availableSL){
                        var t_to_borrow = t_total-availableSL
                        setBorrowedVL(parseFloat(t_to_borrow).toFixed(3))
                        setUsedSL(availableSL)
                        setVlWpay(t_to_borrow)
                        // console.log(availableSL)
                    }else{
                        setUsedSL(t_total)
                        setVlWpay(0)
                        setBorrowedVL(0)
                    }
                }else{
                    if(el.period !== 'NONE'){
                        if(slTotalWithoutPay>=.5){
                            // console.log('set sl wopay')
                            setslTotalWithoutPay(prevItem => prevItem-0.5)
                            setslAutoWithoutPay(prevItem => prevItem-0.5)
                        }
                        /**
                        Update to borrow
                        */
                        if(t_total>=availableSL){
                            var t_to_borrow = t_total-availableSL
                            setBorrowedVL(parseFloat(t_to_borrow).toFixed(3))
                            setBorrowedVLCredits(parseFloat(t_to_borrow).toFixed(3))
                            setUsedSL(availableSL)
                            setVlWpay(t_to_borrow)
                            // console.log(availableSL)
                        }else{
                            // console.log(availableSL)
                            setUsedSL(t_total)
                            setVlWpay(0)
                            setBorrowedVL(0)
                            setBorrowedVLCredits(0)
                        }
                    }
                }
            })
            // console.log(usedSL)
            var t_sl = availableSL;
            var t_vl = availableVL;

            
            // if(availableSL>=t_total){
            //     setUsedSL(t_total)
            //     setBorrowedVL(0)
            // }else{
            //     var t_borrow = (t_total-availableSL).toFixed(3);
            //     console.log(t_borrow)
            //     if(availableVL>=t_borrow){
            //         setUsedSL(availableSL)
            //         setBorrowedVL(t_borrow)
            //     }else{
            //         console.log('here')
            //         // if(availableVL>=0.5){

            //         // }
            //     }
            // }
            var inclusiveDates = '';
            var sorted = selectedInclusiveDates.sort();
            var temp = [];
            var temp2 = [];
            for(var i = 0; i <sorted.length ; i++){
                //check if increment equals to sorted length
                if(i+1 !== sorted.length){
                    // check if same month and year
                    if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                        // check if consecutive dates
                        if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                            temp2.push(sorted[i].toDate())
                        }else{
                            temp2.push(sorted[i].toDate())
                            temp.push(temp2)
                            temp2 = []
                        }
                    }else{
                        temp2.push(sorted[i].toDate())
                        temp.push(temp2)
                        temp2 = []
                    }
                }else{
                    temp2.push(sorted[i].toDate())
                    temp.push(temp2)
                }
            }
            for(var x = 0 ; x<temp.length; x++){
                /**
                if counter is not terminated
                */
                if(x+1 !== temp.length){
                /**check if counter is not reached the length of array */
                    if(temp[x].length !==1){
                        /**if current loop length is not equal to 0, then get the zero index and last index value */
                        if(x ===0 ){
                            /**if first loop, add prefix month */
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                /**if first date month and year is equal to suceeding date, get month name and day*/
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                                inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))
                            }else{
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                                inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(' YYYY, ')
                            }
                        }else{
                            // check if next and before array month and year is equal to current data
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                            moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD-')

                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')

                            }else{
                                //check if before array month and year is equal to current data
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD-')

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                                }
                            }
                        }
                    }else{
                        if(x ===0){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+moment(temp[x][0]).format(' YYYY, ')
                            }
                        }else{
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format(',DD')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                                }
                            }else{
                                if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                }else{
                                    inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                }
                            }
                        }
                        
                    }
                }else{
                    if(temp.length !== 1){
                        if(temp[x].length !== 1){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(',YYYY')
                            }else{
                                inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(', YYYY')
                            }
                        }else{
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(',YYYY')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+moment(temp[x][0]).format(' YYYY')
                            }
                        }
                    }else{
                        if(temp[x].length !== 1){
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(',YYYY')
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+moment(temp[x][0]).format(', YYYY')
                        }
                    }
                }
            }
            setPreviewInclusiveDates(inclusiveDates)
        }else{
            if(SLPeriodDays.length>0){
                if(SLPeriodDays[0].disabled && SLPeriodDays[0].period !== 'NONE'){
                    var t_total = 0;
                    var t_total_wopay = 0;
                    SLPeriodDays.forEach(el=>{
                        if(el.period !=='NONE'){
                            t_total+=0.5;
                        }else{
                            t_total++;
                        }
                    })
                    setTotalSLPeriodDays(t_total)
                    daysWithoutPay.forEach(el=>{
                        if(el.period !=='NONE'){
                            t_total_wopay+=0.5;
                        }else{
                            t_total_wopay++;
                        }
                    })
                    /**
                    * Check if updated period covered with without pay
                    */
                    // console.log(t_total)
                    setSlCreditsWpay(t_total*defaultHours)
                    /**
                    * Check if days wopay period is same with withpay
                    */
                    SLPeriodDays.forEach(el=>{
                        var t_same = daysWithoutPay.filter((el2,key)=>{
                            return el.date === el2.date && el.period === el2.period && key === daysWithoutPay.length-1
                        })
                        if(t_same.length>0){
                            /**
                            get index of dwopay to remove
                            */
                            const index = daysWithoutPay.findIndex(item => item.date === el.date);
                            // console.log(index)
                            var t_temp = [...daysWithoutPay];
                            t_temp.splice(index,1);
                            // console.log(t_temp)
                            setDaysWithoutPay(t_temp)
                            // console.log('set sl wopay')
                            setslTotalWithoutPay(prevItem => prevItem-0.5)
                            setslAutoWithoutPay(prevItem => prevItem-0.5)
                            /**
                            Update to borrow
                            */
                            if(t_total>=availableSL){
                                var t_to_borrow = t_total-availableSL
                                setBorrowedVL(parseFloat(t_to_borrow).toFixed(3))
                                setUsedSL(availableSL)
                                setVlWpay(t_to_borrow)
                                // console.log(availableSL)
                            }else{
                                setUsedSL(t_total)
                                setVlWpay(0)
                                setBorrowedVL(0)
                            }
                        }else{
                            if(el.period !== 'NONE'){
                                if(slTotalWithoutPay>=.5){
                                    // console.log('set sl wopay')
                                    setslTotalWithoutPay(prevItem => prevItem-0.5)
                                    setslAutoWithoutPay(prevItem => prevItem-0.5)
                                }
                                /**
                                Update to borrow
                                */
                                if(t_total>=availableSL){
                                    var t_to_borrow = t_total-availableSL
                                    setBorrowedVL(parseFloat(t_to_borrow).toFixed(3))
                                    setUsedSL(availableSL)
                                    setVlWpay(t_to_borrow)
                                    // console.log(availableSL)
                                }else{
                                    setUsedSL(t_total)
                                    setVlWpay(0)
                                    setBorrowedVL(0)
                                }
                            }
                        }
                    })
                    // console.log(usedSL)
                    var t_sl = availableSL;
                    var t_vl = availableVL;

                    
                    // if(availableSL>=t_total){
                    //     setUsedSL(t_total)
                    //     setBorrowedVL(0)
                    // }else{
                    //     var t_borrow = (t_total-availableSL).toFixed(3);
                    //     console.log(t_borrow)
                    //     if(availableVL>=t_borrow){
                    //         setUsedSL(availableSL)
                    //         setBorrowedVL(t_borrow)
                    //     }else{
                    //         console.log('here')
                    //         // if(availableVL>=0.5){

                    //         // }
                    //     }
                    // }
                    var inclusiveDates = '';
                    var sorted = selectedInclusiveDates.sort();
                    var temp = [];
                    var temp2 = [];
                    for(var i = 0; i <sorted.length ; i++){
                        //check if increment equals to sorted length
                        if(i+1 !== sorted.length){
                            // check if same month and year
                            if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                                // check if consecutive dates
                                if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                                    temp2.push(sorted[i].toDate())
                                }else{
                                    temp2.push(sorted[i].toDate())
                                    temp.push(temp2)
                                    temp2 = []
                                }
                            }else{
                                temp2.push(sorted[i].toDate())
                                temp.push(temp2)
                                temp2 = []
                            }
                        }else{
                            temp2.push(sorted[i].toDate())
                            temp.push(temp2)
                        }
                    }
                    for(var x = 0 ; x<temp.length; x++){
                        /**
                        if counter is not terminated
                        */
                        if(x+1 !== temp.length){
                        /**check if counter is not reached the length of array */
                            if(temp[x].length !==1){
                                /**if current loop length is not equal to 0, then get the zero index and last index value */
                                if(x ===0 ){
                                    /**if first loop, add prefix month */
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        /**if first date month and year is equal to suceeding date, get month name and day*/
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                                        inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))
                                    }else{
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                                        inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(' YYYY, ')
                                    }
                                }else{
                                    // check if next and before array month and year is equal to current data
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                                    moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD-')

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')

                                    }else{
                                        //check if before array month and year is equal to current data
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format(',DD-')

                                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                                        }
                                    }
                                }
                            }else{
                                if(x ===0){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+moment(temp[x][0]).format(' YYYY, ')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format(',DD')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                                        }
                                    }else{
                                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                                        }else{
                                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                                        }
                                    }
                                }
                                
                            }
                        }else{
                            if(temp.length !== 1){
                                if(temp[x].length !== 1){
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][0]).format(',DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }else{
                                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(', YYYY')
                                    }
                                }else{
                                    if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                        inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                    }else{
                                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+moment(temp[x][0]).format(' YYYY')
                                    }
                                }
                            }else{
                                if(temp[x].length !== 1){
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+'-'

                                    inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriod(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'))+moment(temp[x][temp[x].length-1]).format(',YYYY')
                                }else{
                                    inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriod(moment(temp[x][0]).format('MM-DD-YYYY'))+moment(temp[x][0]).format(', YYYY')
                                }
                            }
                        }
                    }
                    setPreviewInclusiveDates(inclusiveDates)
                }
            }
        }
        


    },[SLPeriodDays])
    const sortDateHasPeriodSLP = (date,data) =>{
        // console.log(date)
        // console.log(data)
        var t_slpdays = data.filter((el)=>{
            return el.date.format('MM-DD-YYYY') === date
        });
        // console.log(t_sldays)

        if(t_slpdays.length>0){
            if(t_slpdays[0].period !== ''){
                return '('+t_slpdays[0].period.toLowerCase()+')'
            }else{
                return '';
            }
        }else{
            return '';
        }
        
    }
    const sortDateHasPeriod2 = (date,data) =>{
        // console.log(date)
        var t_sldays = data.filter((el)=>{
            return el.date === date
        });
        // console.log(t_sldays)

        if(t_sldays.length>0){
            var t_check_wopay = daysWithoutPay.filter((el)=>{
                return el.date === date
            })
            // console.log(t_check_wopay)
            if(t_check_wopay.length>0){
                return '';
            }else{
                if(t_sldays[0].period !== 'NONE'){
                    return '('+t_sldays[0].period.toLowerCase()+')'
                }else{
                    return '';
                }
            }
          
        }else{
            return '';
        }
        
    }
    const sortDateHasPeriod = (date) =>{
        // console.log(date)
        var t_sldays = SLPeriodDays.filter((el)=>{
            return el.date === date
        });
        // console.log(t_sldays)

        if(t_sldays.length>0){
            var t_check_wopay = daysWithoutPay.filter((el)=>{
                return el.date === date
            })
            // console.log(t_check_wopay)
            if(t_check_wopay.length>0){
                return '';
            }else{
                if(t_sldays[0].period !== 'NONE'){
                    return '('+t_sldays[0].period.toLowerCase()+')'
                }else{
                    return '';
                }
            }
        }else{
            return '';
        }
        
    }
    const [slAttachment,setSLAttachment] = React.useState(false);
    const handleSortCTOInclusiveDates = () => {
        var sorted = selectedCTOInclusiveDates.sort()
        var sortedTemp = selectedCTOInclusiveDates.sort()

        var days = Math.round(CTOHours/8);
        if(selectedCTOInclusiveDates.length > days){
            for (var i = selectedCTOInclusiveDates.length -1; i >= days; i--)
            sortedTemp.splice(i, 1);
        }
        var newTemp = [];
        sortedTemp.forEach(el=> {
            var t = {
                date:el,
                period:''
            };
            newTemp.push(t)
        })
        setTempSelectedCTOInclusiveDates(newTemp)
        var temp = [];
        var temp2 = [];
        for(var i = 0; i <sorted.length ; i++){
            //check if increment equals to sorted length
            if(i+1 !== sorted.length){
                // check if same month and year
                if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                    // check if consecutive dates
                    if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                        temp2.push(sorted[i].toDate())
                    }else{
                        temp2.push(sorted[i].toDate())
                        temp.push(temp2)
                        temp2 = []
                    }
                }else{
                    temp2.push(sorted[i].toDate())
                    temp.push(temp2)
                    temp2 = []
                }
            }else{
                temp2.push(sorted[i].toDate())
                temp.push(temp2)
            }
        }
        // console.log(temp)
        // setFinalSortedInclusiveDates(temp)
        var inclusiveDates = '';
        for(var x = 0 ; x<temp.length; x++){
            if(x+1 !== temp.length){
                if(temp[x].length !==1){
                    if(x ===0 ){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                            inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                            inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD YYYY, ')
                        }
                    }else{
                        // check if next and before array month and year is equal to current data
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                        moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format(',DD-')
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')
                        }else{
                            //check if before array month and year is equal to current data
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                            }
                        }
                    }
                }else{
                    if(x ===0){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                        }else{
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                        }
                    }else{
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                            }
                        }else{
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                            }
                        }
                    }
                    
                }
            }else{
                if(temp.length !== 1){
                    if(temp[x].length !== 1){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format(',DD-')
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD-')
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                        }
                    }else{
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD,YYYY')
                        }else{
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY')
                        }
                    }
                }else{
                    if(temp[x].length !== 1){
                        inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD,YYYY')
                    }else{
                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD, YYYY')
                    }
                }
            }
        }
        // console.log(inclusiveDates)
        setctodatestext(inclusiveDates)
    }
    const [ctodatestext,setctodatestext] = React.useState('');
    const printWarning = ()=>{
        alert('warning')
    }
    const submitApplication = () =>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
          }).then((result) => {
            /**
             * if click save on confirmation
             */
            if (result.isConfirmed) {
                var format_date = [];
                var format_date_wop = [];
                var cto_dates = '';
                /**
                 * switch action based on leave type selected
                 */
                switch(leaveType){
                    /**
                     * Vacation Leave & Mandatory Forced Leave
                     */
                    case 1:
                    case 2:
                        if(leaveDetails.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select details of leave.'
                            })
                        }else{
                            if(specifyDetails.length ===0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:'Please specify details of leave.'
                                })
                            }else{
                                if(selectedInclusiveDates.length ===0){
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Oops...',
                                        html:'Please select a date.'
                                    })
                                }else{
                                    if(commutation.length === 0){
                                        Swal.fire({
                                            icon:'warning',
                                            title:'Oops...',
                                            html:'Please select commutation.'
                                        })
                                    }else{
                                        selectedInclusiveDates.forEach((el,key)=>{
                                            // format_date.push({
                                            //     date:moment(el.toDate()).format('MM-DD-YYYY'),
                                            //     period:'NONE'
                                            // })
                                            if(key ===0){
                                                if(selectedInclusiveDates.length>Math.floor(balance)){
                                                    if(balance>=.5){
                                                        format_date.push({
                                                            date:moment(el.toDate()).format('MM-DD-YYYY'),
                                                            period:'AM'
                                                        })
                                                        format_date.push({
                                                            date:moment(el.toDate()).format('MM-DD-YYYY'),
                                                            period:'PM'
                                                        })
                                                    }else{
                                                        format_date.push({
                                                            date:moment(el.toDate()).format('MM-DD-YYYY'),
                                                            period:'NONE'
                                                        })
                                                    }
                                                }else{
                                                    format_date.push({
                                                    date:moment(el.toDate()).format('MM-DD-YYYY'),
                                                    period:'NONE'
                                                })
                                                }
                                            }else{
                                                format_date.push({
                                                    date:moment(el.toDate()).format('MM-DD-YYYY'),
                                                    period:'NONE'
                                                })
                                            }
                                            
                                            
                                        })
                                        var data = {
                                            leave_type_id:leaveType,
                                            details_of_leave_id:leaveDetails,
                                            specify_details:specifyDetails,
                                            days_hours_applied:selectedInclusiveDates.length,
                                            inclusive_dates:format_date,
                                            days_with_pay:vlWpay,
                                            credits_vl_val:vlCreditsWpay,
                                            credits_sl_val:0,
                                            // days_with_pay:vlWpay,
                                            days_without_pay:selectedInclusiveDates.length>vlWpay?selectedInclusiveDates.length-vlWpay:0,
                                            // days_without_pay:selectedInclusiveDates.length>Math.floor(balance) ? balance>=.5?selectedInclusiveDates.length-.5:selectedInclusiveDates.length - Math.floor(balance):0,
                                            balance:balance,
                                            inclusive_dates_text:previewInclusiveDates,
                                            commutation:commutation,
                                            sl_bal:availableSL,
                                            bal_as_of:balAsOf
                                        }
                                        // console.log(data)
                                        Swal.fire({
                                            icon:'info',
                                            title:'Saving data',
                                            html:'Please wait...',
                                            allowEscapeKey:false,
                                            allowOutsideClick:false
                                        })
                                        Swal.showLoading()
                                        addLeaveApplication(data)
                                        .then((response)=>{
                                            if(response.data.status === 'success'){
                                                
                                                const data = response.data;
                                                Swal.fire({
                                                    icon:'success',
                                                    title:data.message,
                                                    showConfirmButton: false,
                                                    timer: 2500
                                                })
                                                setLeaveType('');
                                                setLeaveDetails('')
                                                setSpecifyDetails('')
                                                setCommutation('')
                                                setInclusiveDates([])
                                                setPreviewInclusiveDates('')
                                                // setPendingLeaveApplicationData(data.pending)
                                                setAlreadyAppliedDays(data.applied_dates)
                                                setAlreadyAppliedDaysPeriod(data.dates_has_period)
                                                setonProcess(data.on_process)
                                                
                                                // toast.success(response.data.message)
                                                var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                                var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                                var coc = balanceData[0].coc_bal-data.on_process.vl < 0 ?0:balanceData[0].coc_bal-data.on_process.coc
                                                setavailableVL(vl)
                                                setavailableSL(sl)
                                                setavailableCOC(coc)
                                                

                                                props.updatesetPendingLeaveApplicationData(data.pending)
                                                props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                props.updatesetonProcess(data.on_process)
                                                props.updatesetavailableVL(vl)
                                                props.updatesetavailableSL(sl)
                                                // props.updatesetavailableCOC(coc)
                                                
                                                props.updatesetOpen(false)
                                                props.close()
                                                // setOpen(false)
                                            }else{
                                                Swal.close()
                                                toast.error(response.data.message)
                                            }
                                        }).catch((error)=>{
                                            Swal.close()
                                            toast.error(error)
                                            console.log(error)
                
                                        })
                                    }
                                }
                            }
                        }
                        break;

                    /**
                     * Sick Leave
                     */
                    case 3:
                        
                        /**
                         * check if selected inclusive dates is null
                         */

                        if(selectedInclusiveDates.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select inclusive dates.'
                            })
                        }else{
                            /**
                             * if exceed 5 days, it must have an attachment
                             */
                            var has_attachment = false;
                            var sorted = selectedInclusiveDates.sort();
                            console.log(slAttachment)
                            if(slAttachment){
                                if(slFile.length === 0){
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Oops...',
                                        html:'Please upload a valid Medical Cert. or Affidavit.'
                                    })
                                }else{
                                    
                                //         selectedInclusiveDates.forEach(el=>{
                                //             if(!daysWithoutPay.includes(moment(el.toDate()).format('MM-DD-YYYY'))){
                                //                 format_date.push({
                                //                 date:moment(el.toDate()).format('MM-DD-YYYY'),
                                //                 period:'NONE'
                                //                 })
                                //             }
                                //         })
                                //         daysWithoutPay.forEach(el=>{
                                //             format_date_wop.push({
                                //                 date:el,
                                //                 period:'NONE'
                                //             })
                                //         })
                                //         if(specifyDetails.length !==0){
                                //             var data = {
                                //                 has_attachment:has_attachment,
                                //                 leave_type_id:leaveType,
                                //                 details_of_leave_id:leaveDetails,
                                //                 specify_details:specifyDetails,
                                //                 days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                //                 inclusive_dates:SLPeriodDays,
                                //                 inclusive_dates_wop:daysWithoutPay,
                                //                 days_with_pay:totalSLPeriodDays,
                                //                 days_without_pay:slTotalWithoutPay,
                                //                 balance:balance,
                                //                 inclusive_dates_text:previewInclusiveDates,
                                //                 commutation:commutation,
                                //                 sl_file:slFile
                                //             }
                                //             console.log(data)
                                //             Swal.fire({
                                //                 icon:'info',
                                //                 title:'Saving data',
                                //                 html:'Please wait...',
                                //                 allowEscapeKey:false,
                                //                 allowOutsideClick:false
                                //             })
                                //             Swal.showLoading()
                                //             addLeaveApplication(data)
                                //             .then((response)=>{
                                //                 // console.log(response.data)
                                //                 if(response.data.status === 'success'){
                                //                     // Swal.close()
                                //                     const data = response.data;
                                //                     Swal.fire({
                                //                         icon:'success',
                                //                         title:data.message,
                                //                         showConfirmButton: false,
                                //                         timer: 2500
                                //                     })
                                //                     setLeaveType('');
                                //                     setLeaveDetails('')
                                //                     setSpecifyDetails('')
                                //                     setCommutation('')
                                //                     setInclusiveDates([])
                                //                     setPreviewInclusiveDates('')
                                //                     // setPendingLeaveApplicationData(data.pending)
                                //                     setAlreadyAppliedDays(data.applied_dates)
                                //                     setonProcess(data.on_process)
                                //                     setslAutoWithoutPay(0)
                                //                     setslTotalWithoutPay(0)
                                //                     // toast.success(response.data.message)
                                //                     setOpen(false)
                                //                     var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                //                     var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                //                     var coc = balanceData[0].coc_bal-data.on_process.vl < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                //                     setavailableVL(vl)
                                //                     setavailableSL(sl)
                                //                     setavailableCOC(coc)
                                //                     props.updatesetPendingLeaveApplicationData(data.pending)
                                //                     props.updatesetAlreadyAppliedDays(data.applied_dates)
                                //                     props.updatesetonProcess(data.on_process)
                                //                     props.updatesetavailableVL(vl)
                                //                     props.updatesetavailableSL(sl)
                                //                     props.updatesetavailableCOC(coc)
                                //                     props.updatesetOpen(false)
                                //                     props.close()
                                //                     let currDate = new Date();
                                //                     var date = new Date();
                                //                     var start = 0;
                                //                     var end = 5;
                                //                     var toAdd = 0;
                                //                     var slRangeDatesWP =[];
                                //                     while(start <= end){
                                //                         let temp = [];
                                //                         let temp2 = [];
                                                        
                                //                         for(var w=0;w<workScheduleData.length;w++){
                                //                             if(workScheduleData[w].month === parseInt(moment(date).format('M')) && workScheduleData[w].year === parseInt(moment(date).format('YYYY'))){
                                //                                 temp=workScheduleData[w].details;
                                //                                 break;
                                //                             }
                                //                         }
                                //                         if(temp){
                                //                             temp.forEach(el2=>{
                                //                                 temp2.push(el2.day)
                                //                             })
                                //                         }
                                //                         if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                //                             toAdd++;
                                //                         }else{
                                //                             if(moment(date).isBusinessDay()){
                                //                                 if(!temp2.includes(moment(date).format('D'))){
                                //                                     toAdd++;
                                //                                 }
                                //                                 slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                //                                 start++;
                                                                
                                //                             }
                                //                         }
                                //                         date.setDate(date.getDate() - 1);

                                //                     }
                                //                     let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                //                     let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                //                     setslRangeDatesWithPay(slRangeDatesWP)
                                //                     setslNoPay(finalNoPay)
                                //                     setslWithPay(finalWithPay)
                                //                 }else{
                                //                     Swal.close()
                                //                     toast.error(response.data.message)
                                //                 }
                                //             }).catch((error)=>{
                                //                 Swal.close()
                                //                 toast.error(error)
                                //                 console.log(error)
                    
                                //             })
                                //         }else{
                                //             Swal.fire({
                                //                 icon:'warning',
                                //                 title:'Oops...',
                                //                 html:'Please specify details of leave.'
                                //             })
                                //         }
                                /**
                                End Old */

                                /**
                                Start New */
                                /**
                                    
                                /**
                                if selected dates has already applied AM or PM and length equal or less than 1
                                 */
                                if(totalSLPeriodDays <= 1 && !SLHalfDays){
                                    // console.log(totalSLPeriodDays)
                                    selectedInclusiveDates.forEach(el=>{
                                    if(!daysWithoutPay.includes(moment(el.toDate()).format('MM-DD-YYYY'))){
                                            format_date.push({
                                            date:moment(el.toDate()).format('MM-DD-YYYY'),
                                            period:'NONE'
                                            })
                                        }
                                    })
                                    // daysWithoutPay.forEach(el=>{
                                    //     format_date_wop.push({
                                    //         date:el,
                                    //         period:'NONE'
                                    //     })
                                    // })

                                    if(specifyDetails.length !==0){
                                        var data = {
                                            has_attachment:has_attachment,
                                            leave_type_id:leaveType,
                                            details_of_leave_id:leaveDetails,
                                            specify_details:specifyDetails,
                                            days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                            inclusive_dates:SLPeriodDays,
                                            inclusive_dates_wop:daysWithoutPay,
                                            days_with_pay:totalSLPeriodDays,
                                            days_without_pay:slTotalWithoutPay,
                                            balance:balance,
                                            inclusive_dates_text:previewInclusiveDates,
                                            commutation:commutation,
                                            sl_file:slFile,
                                            borrowed_vl:borrowedVLCredits,
                                            used_sl:slCreditsWpay>availableSL?availableSL:slCreditsWpay,
                                            vl_bal:availableVL,
                                            is_late_filing:isLateFiling,
                                            credits_vl_val:borrowedVLCredits,
                                            credits_sl_val:slCreditsWpay,
                                            bal_as_of:balAsOf


                                        }
                                        // console.log('here')
                                        // console.log(data)
                                        Swal.fire({
                                            icon:'info',
                                            title:'Saving data',
                                            html:'Please wait...',
                                            allowEscapeKey:false,
                                            allowOutsideClick:false
                                        })
                                        Swal.showLoading()
                                        addLeaveApplication(data)
                                        .then((response)=>{
                                            // console.log(response.data)
                                            if(response.data.status === 'success'){
                                                // Swal.close()
                                                const data = response.data;
                                                Swal.fire({
                                                    icon:'success',
                                                    title:data.message,
                                                    showConfirmButton: false,
                                                    timer: 2500
                                                })
                                                setLeaveType('');
                                                setLeaveDetails('')
                                                setSpecifyDetails('')
                                                setCommutation('')
                                                setInclusiveDates([])
                                                setPreviewInclusiveDates('')
                                                // setPendingLeaveApplicationData(data.pending)
                                                setAlreadyAppliedDays(data.applied_dates)
                                                setonProcess(data.on_process)
                                                // toast.success(response.data.message)
                                                setOpen(false)
                                                setslAutoWithoutPay(0)
                                                setslTotalWithoutPay(0)

                                                var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                                var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                                var coc = balanceData[0].coc_bal-data.on_process.coc < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                                props.updatesetPendingLeaveApplicationData(data.pending)
                                                props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                props.updatesetonProcess(data.on_process)
                                                props.updatesetavailableVL(vl)
                                                props.updatesetavailableSL(sl)
                                                props.updatesetavailableCOC(coc)
                                                props.updatesetOpen(false)
                                                props.close()
                                                let currDate = new Date();
                                                var date = new Date();
                                                var start = 0;
                                                var end = 5;
                                                var toAdd = 0;
                                                var slRangeDatesWP =[];
                                                while(start <= end){
                                                    var f_holidays = holidays.filter(el=>moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')>=(moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD')) && moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')<=(moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD')));

                                                    if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                        toAdd++;
                                                    }else if(f_holidays.length>0){
                                                        toAdd++;
                                                    }else{
                                                        // if(moment(date).isBusinessDay()){
                                                        //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                        //     start++;
                                                        // }
                                                        var temp;
                                                            workScheduleData.forEach(el=>{
                                                            if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                                                    temp=el.details;
                                                                }
                                                            })
                                                            if(temp){
                                                                temp.forEach(el2=>{
                                                                    if(el2.day ===moment(new Date(date)).format('D')){
                                                                        slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                        start++;
                                                                    }
                                                                })
                                                            }
                                                    }
                                                    date.setDate(date.getDate() - 1);
                                                }
                                                let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                                let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                                setslRangeDatesWithPay(slRangeDatesWP)
                                                setslNoPay(finalNoPay)
                                                setslWithPay(finalWithPay)
                                            }else{
                                                Swal.close()
                                                toast.error(response.data.message)
                                            }
                                        }).catch((error)=>{
                                            Swal.close()
                                            toast.error(error)
                                            console.log(error)
                
                                        })
                                    }else{
                                        Swal.fire({
                                            icon:'warning',
                                            title:'Oops...',
                                            html:'Please specify details of leave.'
                                        })
                                    }
                                    // if(totalSLPeriodDays+slAutoWithoutPay<1){
                                    //      Swal.fire({
                                    //         icon:'warning',
                                    //         title:'Notice !',
                                    //         html:'SL should be applied atleast 1 day'
                                    //     })
                                    // }else{
                                    //     /**
                                    //     Check if inclusive dates are continuous
                                    //     */
                                    //     console.log('here')
                                    //     console.log(SLPeriodDays)
                                    //     if(SLPeriodDays[0].period === 'AM'){
                                    //         if(SLPeriodDays[1].period !== 'PM'){
                                    //             Swal.fire({
                                    //                 icon:'warning',
                                    //                 title:'Notice !',
                                    //                 html:'Please select a continuous days period'
                                    //             })
                                    //         }else{
                                    //             console.log('ok')
                                    //         }
                                    //     }
                                    //     if(SLPeriodDays[0].period === 'PM'){
                                    //         if(SLPeriodDays[1].period !== 'AM'){
                                    //             Swal.fire({
                                    //                 icon:'warning',
                                    //                 title:'Notice !',
                                    //                 html:'Please select a continuous days period'
                                    //             })
                                    //         }else{
                                    //             // daysWithoutPay.forEach(el=>{
                                    //             // format_date_wop.push({
                                    //             //     date:el,
                                    //             //     period:'NONE'
                                    //             //     })
                                    //             // })

                                    //             if(specifyDetails.length !==0){
                                    //                 var data = {
                                    //                     has_attachment:slAttachment,
                                    //                     leave_type_id:leaveType,
                                    //                     details_of_leave_id:leaveDetails,
                                    //                     specify_details:specifyDetails,
                                    //                     days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                    //                     inclusive_dates:SLPeriodDays,
                                    //                     inclusive_dates_wop:daysWithoutPay,
                                    //                     days_with_pay:totalSLPeriodDays,
                                    //                     days_without_pay:slTotalWithoutPay,
                                    //                     balance:balance,
                                    //                     inclusive_dates_text:previewInclusiveDates,
                                    //                     commutation:commutation,
                                    //                     sl_file:slFile,
                                    //                     borrowed_vl:borrowedVL,
                                    //                     used_sl:usedSL,
                                    //                     is_late_filing:isLateFiling,
                                    //                     credits_vl_val:borrowedVLCredits,
                                    //                     credits_sl_val:slCreditsWpay,
                                    //                 }
                                    //                 console.log(data)
                                    //                 Swal.fire({
                                    //                     icon:'info',
                                    //                     title:'Saving data',
                                    //                     html:'Please wait...',
                                    //                     allowEscapeKey:false,
                                    //                     allowOutsideClick:false
                                    //                 })
                                    //                 Swal.showLoading()
                                    //                 addLeaveApplication(data)
                                    //                 .then((response)=>{
                                    //                     // console.log(response.data)
                                    //                     if(response.data.status === 'success'){
                                    //                         // Swal.close()
                                    //                         const data = response.data;
                                    //                         Swal.fire({
                                    //                             icon:'success',
                                    //                             title:data.message,
                                    //                             showConfirmButton: false,
                                    //                             timer: 2500
                                    //                         })
                                    //                         setLeaveType('');
                                    //                         setLeaveDetails('')
                                    //                         setSpecifyDetails('')
                                    //                         setCommutation('')
                                    //                         setInclusiveDates([])
                                    //                         setPreviewInclusiveDates('')
                                    //                         // setPendingLeaveApplicationData(data.pending)
                                    //                         setAlreadyAppliedDays(data.applied_dates)
                                    //                         setonProcess(data.on_process)
                                    //                         // toast.success(response.data.message)
                                    //                         setOpen(false)
                                    //                         setslAutoWithoutPay(0)
                                    //                         setslTotalWithoutPay(0)

                                    //                         var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                    //                         var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                    //                         var coc = balanceData[0].coc_bal-data.on_process.coc < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                    //                         props.updatesetPendingLeaveApplicationData(data.pending)
                                    //                         props.updatesetAlreadyAppliedDays(data.applied_dates)
                                    //                         props.updatesetonProcess(data.on_process)
                                    //                         props.updatesetavailableVL(vl)
                                    //                         props.updatesetavailableSL(sl)
                                    //                         props.updatesetavailableCOC(coc)
                                    //                         props.updatesetOpen(false)
                                    //                         props.close()
                                    //                         let currDate = new Date();
                                    //                         var date = new Date();
                                    //                         var start = 0;
                                    //                         var end = 5;
                                    //                         var toAdd = 0;
                                    //                         var slRangeDatesWP =[];
                                    //                         while(start <= end){
                                    //                             if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                    //                                 toAdd++;
                                    //                             }else{
                                    //                                 // if(moment(date).isBusinessDay()){
                                    //                                 //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                    //                                 //     start++;
                                    //                                 // }
                                    //                                 var temp;
                                    //                                 workScheduleData.forEach(el=>{
                                    //                                 if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    //                                         temp=el.details;
                                    //                                     }
                                    //                                 })
                                    //                                 if(temp){
                                    //                                     temp.forEach(el2=>{
                                    //                                         if(el2.day ===moment(new Date(date)).format('D')){
                                    //                                             slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                    //                                             start++;
                                    //                                         }
                                    //                                     })
                                    //                                 }
                                    //                             }
                                    //                             date.setDate(date.getDate() - 1);
                                                                
                                    //                         }
                                    //                         let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                    //                         let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                    //                         setslRangeDatesWithPay(slRangeDatesWP)
                                    //                         setslNoPay(finalNoPay)
                                    //                         setslWithPay(finalWithPay)
                                    //                     }else{
                                    //                         Swal.close()
                                    //                         toast.error(response.data.message)
                                    //                     }
                                    //                 }).catch((error)=>{
                                    //                     Swal.close()
                                    //                     toast.error(error)
                                    //                     console.log(error)
                            
                                    //                 })
                                    //             }else{
                                    //                 Swal.fire({
                                    //                     icon:'warning',
                                    //                     title:'Oops...',
                                    //                     html:'Please specify details of leave.'
                                    //                 })
                                    //             }


                                    //         }
                                    //     }
                                    //     if(SLPeriodDays[0].period === 'NONE' || SLPeriodDays[1].period === 'NONE'){
                                    //         console.log(SLPeriodDays)
                                    //         selectedInclusiveDates.forEach(el=>{
                                    //             if(!daysWithoutPay.includes(moment(el.toDate()).format('MM-DD-YYYY'))){
                                    //                 format_date.push({
                                    //                 date:moment(el.toDate()).format('MM-DD-YYYY'),
                                    //                 period:'NONE'
                                    //                 })
                                    //             }
                                    //         })
                                    //         // daysWithoutPay.forEach(el=>{
                                    //         //     format_date_wop.push({
                                    //         //         date:el,
                                    //         //         period:'NONE'
                                    //         //     })
                                    //         // })

                                    //         if(specifyDetails.length !==0){
                                    //             var data = {
                                    //                 has_attachment:slAttachment,
                                    //                 leave_type_id:leaveType,
                                    //                 details_of_leave_id:leaveDetails,
                                    //                 specify_details:specifyDetails,
                                    //                 days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                    //                 inclusive_dates:SLPeriodDays,
                                    //                 inclusive_dates_wop:daysWithoutPay,
                                    //                 days_with_pay:totalSLPeriodDays,
                                    //                 days_without_pay:slTotalWithoutPay,
                                    //                 balance:usedSL,
                                    //                 inclusive_dates_text:previewInclusiveDates,
                                    //                 commutation:commutation,
                                    //                 sl_file:slFile,
                                    //                 vl_bal:availableVL,
                                    //                 borrowed_vl:borrowedVL,
                                    //                 used_sl:usedSL,
                                    //                 is_late_filing:isLateFiling,
                                    //                 credits_vl_val:borrowedVLCredits,
                                    //                 credits_sl_val:slCreditsWpay,

                                    //             }
                                    //             console.log('here')
                                    //             console.log(data)
                                    //             Swal.fire({
                                    //                 icon:'info',
                                    //                 title:'Saving data',
                                    //                 html:'Please wait...',
                                    //                 allowEscapeKey:false,
                                    //                 allowOutsideClick:false
                                    //             })
                                    //             Swal.showLoading()
                                    //             addLeaveApplication(data)
                                    //             .then((response)=>{
                                    //                 // console.log(response.data)
                                    //                 if(response.data.status === 'success'){
                                    //                     // Swal.close()
                                    //                     const data = response.data;
                                    //                     Swal.fire({
                                    //                         icon:'success',
                                    //                         title:data.message,
                                    //                         showConfirmButton: false,
                                    //                         timer: 2500
                                    //                     })
                                    //                     setLeaveType('');
                                    //                     setLeaveDetails('')
                                    //                     setSpecifyDetails('')
                                    //                     setCommutation('')
                                    //                     setInclusiveDates([])
                                    //                     setPreviewInclusiveDates('')
                                    //                     // setPendingLeaveApplicationData(data.pending)
                                    //                     setAlreadyAppliedDays(data.applied_dates)
                                    //                     setonProcess(data.on_process)
                                    //                     // toast.success(response.data.message)
                                    //                     setOpen(false)
                                    //                     setslAutoWithoutPay(0)
                                    //                     setslTotalWithoutPay(0)

                                    //                     var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                    //                     var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                    //                     var coc = balanceData[0].coc_bal-data.on_process.coc < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                    //                     props.updatesetPendingLeaveApplicationData(data.pending)
                                    //                     props.updatesetAlreadyAppliedDays(data.applied_dates)
                                    //                     props.updatesetonProcess(data.on_process)
                                    //                     props.updatesetavailableVL(vl)
                                    //                     props.updatesetavailableSL(sl)
                                    //                     props.updatesetavailableCOC(coc)
                                    //                     props.updatesetOpen(false)
                                    //                     props.close()
                                    //                     let currDate = new Date();
                                    //                     var date = new Date();
                                    //                     var start = 0;
                                    //                     var end = 5;
                                    //                     var toAdd = 0;
                                    //                     var slRangeDatesWP =[];
                                    //                     while(start <= end){
                                    //                         if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                    //                             toAdd++;
                                    //                         }else{
                                    //                             // if(moment(date).isBusinessDay()){
                                    //                             //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                    //                             //     start++;
                                    //                             // }
                                    //                             var temp;
                                    //                                 workScheduleData.forEach(el=>{
                                    //                                 if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    //                                         temp=el.details;
                                    //                                     }
                                    //                                 })
                                    //                                 if(temp){
                                    //                                     temp.forEach(el2=>{
                                    //                                         if(el2.day ===moment(new Date(date)).format('D')){
                                    //                                             slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                    //                                             start++;
                                    //                                         }
                                    //                                     })
                                    //                                 }
                                    //                         }
                                    //                         date.setDate(date.getDate() - 1);
                                    //                     }
                                    //                     let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                    //                     let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                    //                     setslRangeDatesWithPay(slRangeDatesWP)
                                    //                     setslNoPay(finalNoPay)
                                    //                     setslWithPay(finalWithPay)
                                    //                 }else{
                                    //                     Swal.close()
                                    //                     toast.error(response.data.message)
                                    //                 }
                                    //             }).catch((error)=>{
                                    //                 Swal.close()
                                    //                 toast.error(error)
                                    //                 console.log(error)
                        
                                    //             })
                                    //         }else{
                                    //             Swal.fire({
                                    //                 icon:'warning',
                                    //                 title:'Oops...',
                                    //                 html:'Please specify details of leave.'
                                    //             })
                                    //         }
                                    //     }
                                        
                                        

                                    // }
                                   
                                        
                                /**
                                End totalSLPeriodDays <=1
                                 */
                                }else{
                                    // console.log(SLHalfDays)
                                    /**
                                    Get unique month and year from selected period days
                                     */
                                    var t_arr = [];
                                    SLPeriodDays.forEach(el=>{
                                        t_arr.push(moment(el.date).format('MM-YYYY'))
                                    })
                                    daysWithoutPay.forEach(el=>{
                                        t_arr.push(moment(el.date).format('MM-YYYY'))
                                    })
                                    t_arr.sort((a,b)=>{
                                        return new Date(a) - new Date(b)
                                    })
                                    // console.log(t_arr)
                                    /**
                                     * Set unique month number and year
                                     */
                                    var t_unique_arr = [...new Set(t_arr)]
                                    /**
                                    Get workschedule from that month number and year
                                     */
                                    var t_sched = [];
                                    t_unique_arr.forEach(el=>{
                                        var t_split = el.split('-');
                                        var month = t_split[0];
                                        var year = t_split[1];
                                        workScheduleData.forEach(el2=>{
                                            if(el2.month === parseInt(month) && el2.year === parseInt(year)){
                                                t_sched.push(el2)
                                            }
                                        })
                                    })
                                    /**
                                    Loop sched to remove the already applied days
                                     */
                                    var t_sched2 = [];
                                    var t_sl_period = [...SLPeriodDays];
                                    daysWithoutPay.forEach(el=>{
                                        t_sl_period.push({
                                            date:el.date,
                                            period:el.period
                                        })
                                    })
                                    t_sl_period.sort((a,b)=>{
                                        return new Date(a.date) - new Date(b.date)
                                    })
                                    // console.log(t_sl_period)

                                    t_sched.forEach(el=>{
                                        var d = []
                                        el.details.forEach(el2=>{
                                            var t_arr = t_sl_period.filter((el3)=>{
                                                return el3.date === moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY') && el3.period !== 'NONE'
                                            })
                                            if(t_arr.length >0){
                                                d.push(moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY'))
                                            }else{
                                                if(!alreadyAppliedDays.includes(moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY'))){
                                                d.push(moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY'))
                                                }
                                            }
                                           
                                            
                                        })
                                        t_sched2 = t_sched2.concat(d)
                                    })
                                    /**
                                    get sl days period to check if continuous date based on work schedule
                                     */
                                    
                                    /**
                                    we will used for loop, to break anytime if we found sl not continuous 
                                     */
                                    var t_sl_len = t_sl_period.length;
                                    var t_sl_counter = 0;
                                    var t_sl_index; 
                                    var t_sl_is_continuous = true;
                                    var t_sl_date_text_html = '';
                                    // console.log(t_sched2)
                                    for(t_sl_counter;t_sl_counter<t_sl_len;t_sl_counter++){
                                        /**
                                        get index of first sl days period, then we will start there
                                        */
                                        if(t_sl_counter === 0){
                                            t_sl_index = t_sched2.indexOf(t_sl_period[t_sl_counter].date);
                                            t_sl_index++;
                                            t_sl_date_text_html+='<span>'+moment(t_sl_period[t_sl_counter].date).format('MMMM DD,YYYY')+',</span>';
                                        }else{
                                            if(moment(t_sl_period[t_sl_counter].date).format('MM-DD-YYYY') !== moment(t_sched2[t_sl_index]).format('MM-DD-YYYY')){
                                                t_sl_is_continuous = false;
                                                t_sl_date_text_html+='<span style="color:red;">'+moment(t_sl_period[t_sl_counter].date).format('MMMM DD,YYYY')+'</span>';
                                                // console.log(moment(t_sl_period[t_sl_counter].date).format('MM-DD-YYYY'))
                                                // console.log(moment(t_sched2[t_sl_index]).format('MM-DD-YYYY'))
                                                break;
                                            }
                                            t_sl_date_text_html+='<span>'+moment(t_sl_period[t_sl_counter].date).format('MMMM DD,YYYY')+',</span>';
                                            t_sl_index++;
                                        }
                                    }
                                    // console.log(t_sl_is_continuous)

                                    if(t_sl_is_continuous){
                                        SLPeriodDays.forEach(el=>{
                                            if(!daysWithoutPay.includes(moment(el.date).format('MM-DD-YYYY'))){
                                                format_date.push({
                                                date:moment(el.date).format('MM-DD-YYYY'),
                                                period:el.period
                                                })
                                            }
                                        })
                                        daysWithoutPay.forEach(el=>{
                                            format_date_wop.push({
                                                date:el,
                                                period:'NONE'
                                            })
                                        })
                                        /**
                                        Check if continuous date period
                                        */
                                        var is_continuous = true;
                                        var i = 0;
                                        // console.log(SLPeriodDays)
                                        if(SLPeriodDays.length !== 1){
                                            SLPeriodDays.forEach(el=>{
                                                if(i === 0){
                                                    i++;
                                                }else if(i==SLPeriodDays.length-1){
                                                    if(SLPeriodDays[i-1].period === 'AM'){
                                                        is_continuous = false;
                                                    }else if(SLPeriodDays[i-1].period === 'PM'){
                                                        if(el.period === 'NONE'){

                                                        }else if(el.period === 'AM'){

                                                        }else{
                                                            is_continuous = false;
                                                        }
                                                    }else{
                                                        if(el.period !== 'NONE'){
                                                            if(el.period !== 'AM'){
                                                                is_continuous = false;
                                                            }
                                                        }
                                                        
                                                    }
                                                    i++;

                                                }else{
                                                    if(SLPeriodDays[i-1].period === 'AM'){
                                                        is_continuous = false;
                                                    }else if(SLPeriodDays[i-1].period === 'PM'){
                                                        if(el.period !== 'NONE'){
                                                            is_continuous = false;
                                                        }
                                                    }else{
                                                        if(el.period !== 'NONE'){
                                                            if(el.period === 'AM'){
                                                                is_continuous = false;
                                                            }
                                                            if(el.period === 'PM'){
                                                                is_continuous = false;
                                                            }
                                                        }
                                                        
                                                    }
                                                    i++;
                                                }
                                                
                                            })
                                        }
                                        if(is_continuous){
                                            if(specifyDetails.length !==0){
                                                var data = {
                                                   has_attachment:has_attachment,
                                                    leave_type_id:leaveType,
                                                    details_of_leave_id:leaveDetails,
                                                    specify_details:specifyDetails,
                                                    days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                                    inclusive_dates:SLPeriodDays,
                                                    inclusive_dates_wop:daysWithoutPay,
                                                    days_with_pay:totalSLPeriodDays,
                                                    days_without_pay:slTotalWithoutPay,
                                                    balance:balance,
                                                    inclusive_dates_text:previewInclusiveDates,
                                                    commutation:commutation,
                                                    sl_file:slFile,
                                                    borrowed_vl:borrowedVLCredits,
                                                    used_sl:slCreditsWpay>availableSL?availableSL:slCreditsWpay,
                                                    vl_bal:availableVL,
                                                    is_late_filing:isLateFiling,
                                                    credits_vl_val:borrowedVLCredits,
                                                    credits_sl_val:slCreditsWpay,
                                                    bal_as_of:balAsOf
                                                    
                                                }
                                                // console.log(data)
                                                Swal.fire({
                                                    icon:'info',
                                                    title:'Saving data',
                                                    html:'Please wait...',
                                                    allowEscapeKey:false,
                                                    allowOutsideClick:false
                                                })
                                                Swal.showLoading()
                                                addLeaveApplication(data)
                                                .then((response)=>{
                                                    // console.log(response.data)
                                                    if(response.data.status === 'success'){
                                                        // Swal.close()
                                                        const data = response.data;
                                                        Swal.fire({
                                                            icon:'success',
                                                            title:data.message,
                                                            showConfirmButton: false,
                                                            timer: 2500
                                                        })
                                                        setLeaveType('');
                                                        setLeaveDetails('')
                                                        setSpecifyDetails('')
                                                        setCommutation('')
                                                        setInclusiveDates([])
                                                        setPreviewInclusiveDates('')
                                                        // setPendingLeaveApplicationData(data.pending)
                                                        setAlreadyAppliedDays(data.applied_dates)
                                                        setonProcess(data.on_process)
                                                        // toast.success(response.data.message)
                                                        setOpen(false)
                                                        setslAutoWithoutPay(0)
                                                        setslTotalWithoutPay(0)

                                                        var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                                        var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                                        var coc = balanceData[0].coc_bal-data.on_process.vl < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                        props.updatesetonProcess(data.on_process)
                                                        props.updatesetavailableVL(vl)
                                                        props.updatesetavailableSL(sl)
                                                        props.updatesetavailableCOC(coc)
                                                        props.updatesetOpen(false)
                                                        props.close()
                                                        let currDate = new Date();
                                                        var date = new Date();
                                                        var start = 0;
                                                        var end = 5;
                                                        var toAdd = 0;
                                                        var slRangeDatesWP =[];
                                                        while(start <= end){
                                                            var f_holidays = holidays.filter(el=>moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')>=(moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD')) && moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')<=(moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD')));
                                                            if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                                toAdd++;
                                                            }else if(f_holidays.length>0){
                                                                toAdd++;
                                                            }else{
                                                                // if(moment(date).isBusinessDay()){
                                                                //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                //     start++;
                                                                // }
                                                                var temp;
                                                                    workScheduleData.forEach(el=>{
                                                                    if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                                                            temp=el.details;
                                                                        }
                                                                    })
                                                                    if(temp){
                                                                        temp.forEach(el2=>{
                                                                            if(el2.day ===moment(new Date(date)).format('D')){
                                                                                slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                                start++;
                                                                            }
                                                                        })
                                                                    }
                                                            }
                                                            date.setDate(date.getDate() - 1);
                                                        }
                                                        let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                                        let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                                        setslRangeDatesWithPay(slRangeDatesWP)
                                                        setslNoPay(finalNoPay)
                                                        setslWithPay(finalWithPay)
                                                    }else{
                                                        Swal.close()
                                                        toast.error(response.data.message)
                                                    }
                                                }).catch((error)=>{
                                                    Swal.close()
                                                    toast.error(error)
                                                    console.log(error)
                        
                                                })
                                            }else{
                                                Swal.fire({
                                                    icon:'warning',
                                                    title:'Oops...',
                                                    html:'Please specify details of leave.'
                                                })
                                            }
                                        }else{
                                            if(SLPeriodDays.length === 2){
                                                var t_suggested = '';
                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=moment(SLPeriodDays[1].date).format('MMMM DD,YYYY')+' - AM</p>';
                                                t_suggested+='<p style="font-size:.9rem;"><strong>OR</strong></p>'

                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=moment(SLPeriodDays[1].date).format('MMMM DD,YYYY')+' - NONE</p>';
                                                t_suggested+='<p style="font-size:.9rem;"><strong>OR</strong></p>'

                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - NONE <br/>';
                                                t_suggested+=moment(SLPeriodDays[1].date).format('MMMM DD,YYYY')+' - AM</p>';
                                                
                                                Swal.fire({
                                                    icon:'warning',
                                                    title:'Notice',
                                                    html:'Selected period are not continuous. System Suggestions:'+'<br/>'+t_suggested
                                                })
                                            }else{
                                                var t_suggested = '';
                                                var t_suggested_mid = '';
                                                SLPeriodDays.forEach((el,key)=>{
                                                    // console.log(key)
                                                    if(key !==0){
                                                        if(key !== SLPeriodDays.length-1){
                                                            t_suggested_mid+=moment(el.date).format('MMMM DD,YYYY')+' - NONE </br>';
                                                        }
                                                    }
                                                })
                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=t_suggested_mid;
                                                t_suggested+=moment(SLPeriodDays[SLPeriodDays.length-1].date).format('MMMM DD,YYYY')+' - AM</p>';

                                                t_suggested+='<p style="font-size:.9rem;"><strong>OR</strong></p>'

                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=t_suggested_mid;
                                                t_suggested+=moment(SLPeriodDays[SLPeriodDays.length-1].date).format('MMMM DD,YYYY')+' - NONE</p>';

                                              
                                                
                                                Swal.fire({
                                                    icon:'warning',
                                                    title:'Notice',
                                                    html:'Selected period are not continuous. System Suggestions:'+'<br/>'+t_suggested
                                                })
                                            }
                                        }
                                        
                                    }else{
                                        
                                        Swal.fire({
                                            icon:'warning',
                                            title:'Notice !',
                                            html:'The selected dates are not continuous. Please check again the selected date:'+'<br/>'+t_sl_date_text_html
                                        })
                                    }
                                    
                                }
                                /**
                                End New */
                                /**
                                End if has attachment
                                */
                                    }
                            }else{
                                console.log('here')
                                /**
                                if selected dates has already applied AM or PM and length equal or less than 1
                                 */
                                if(totalSLPeriodDays <= 1 || !SLHalfDays){
                                    // console.log(SLPeriodDays)
                                    if(totalSLPeriodDays+slAutoWithoutPay+slTotalWithoutPay<1){
                                         Swal.fire({
                                            icon:'warning',
                                            title:'Notice !',
                                            html:'SL should be applied atleast 1 day'
                                        })
                                    }else{
                                        /**
                                        Check if inclusive dates is continuous
                                        */
                                        
                                        if(SLPeriodDays.length !==0){
                                            // console.log('SL period not zero')
                                            if(SLPeriodDays[0].period === 'AM'){
                                                if(SLPeriodDays[1].period !== 'PM'){
                                                    Swal.fire({
                                                        icon:'warning',
                                                        title:'Notice !',
                                                        html:'Please select a continuous days period'
                                                    })
                                                }else{
                                                    // console.log('ok')
                                                }
                                            }
                                            if(SLPeriodDays[0].period === 'PM'){
                                                if(SLPeriodDays[1].period !== 'AM'){
                                                    Swal.fire({
                                                        icon:'warning',
                                                        title:'Notice !',
                                                        html:'Please select a continuous days period'
                                                    })
                                                }else{
                                                    // daysWithoutPay.forEach(el=>{
                                                    // format_date_wop.push({
                                                    //     date:el,
                                                    //     period:'NONE'
                                                    //     })
                                                    // })

                                                    if(specifyDetails.length !==0){
                                                        var data = {
                                                            has_attachment:has_attachment,
                                                            leave_type_id:leaveType,
                                                            details_of_leave_id:leaveDetails,
                                                            specify_details:specifyDetails,
                                                            days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                                            inclusive_dates:SLPeriodDays,
                                                            inclusive_dates_wop:daysWithoutPay,
                                                            days_with_pay:totalSLPeriodDays,
                                                            days_without_pay:slTotalWithoutPay,
                                                            balance:balance,
                                                            inclusive_dates_text:previewInclusiveDates,
                                                            commutation:commutation,
                                                            sl_file:slFile,
                                                            borrowed_vl:borrowedVLCredits,
                                                            used_sl:slCreditsWpay>availableSL?availableSL:slCreditsWpay,
                                                            vl_bal:availableVL,
                                                            is_late_filing:isLateFiling,
                                                            credits_vl_val:borrowedVLCredits,
                                                            credits_sl_val:slCreditsWpay,
                                                            bal_as_of:balAsOf

                                                        }
                                                        console.log(data)
                                                        Swal.fire({
                                                            icon:'info',
                                                            title:'Saving data',
                                                            html:'Please wait...',
                                                            allowEscapeKey:false,
                                                            allowOutsideClick:false
                                                        })
                                                        Swal.showLoading()
                                                        addLeaveApplication(data)
                                                        .then((response)=>{
                                                            // console.log(response.data)
                                                            if(response.data.status === 'success'){
                                                                // Swal.close()
                                                                const data = response.data;
                                                                Swal.fire({
                                                                    icon:'success',
                                                                    title:data.message,
                                                                    showConfirmButton: false,
                                                                    timer: 2500
                                                                })
                                                                setLeaveType('');
                                                                setLeaveDetails('')
                                                                setSpecifyDetails('')
                                                                setCommutation('')
                                                                setInclusiveDates([])
                                                                setPreviewInclusiveDates('')
                                                                // setPendingLeaveApplicationData(data.pending)
                                                                setAlreadyAppliedDays(data.applied_dates)
                                                                setonProcess(data.on_process)
                                                                // toast.success(response.data.message)
                                                                setOpen(false)
                                                                setslAutoWithoutPay(0)
                                                                setslTotalWithoutPay(0)

                                                                var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                                                var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                                                var coc = balanceData[0].coc_bal-data.on_process.coc < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                                                props.updatesetPendingLeaveApplicationData(data.pending)
                                                                props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                                props.updatesetonProcess(data.on_process)
                                                                props.updatesetavailableVL(vl)
                                                                props.updatesetavailableSL(sl)
                                                                props.updatesetavailableCOC(coc)
                                                                props.updatesetOpen(false)
                                                                props.close()
                                                                let currDate = new Date();
                                                                var date = new Date();
                                                                var start = 0;
                                                                var end = 5;
                                                                var toAdd = 0;
                                                                var slRangeDatesWP =[];
                                                                while(start <= end){
                                                                    var f_holidays = holidays.filter(el=>moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')>=(moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD')) && moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')<=(moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD')));
                                                                    if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                                        toAdd++;
                                                                    }else if(f_holidays.length>0){
                                                                        toAdd++;
                                                                    }else{
                                                                        // if(moment(date).isBusinessDay()){
                                                                        //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                        //     start++;
                                                                        // }
                                                                        var temp;
                                                                        workScheduleData.forEach(el=>{
                                                                        if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                                                                temp=el.details;
                                                                            }
                                                                        })
                                                                        if(temp){
                                                                            temp.forEach(el2=>{
                                                                                if(el2.day ===moment(new Date(date)).format('D')){
                                                                                    slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                                    start++;
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                    date.setDate(date.getDate() - 1);
                                                                }
                                                                let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                                                let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                                                setslRangeDatesWithPay(slRangeDatesWP)
                                                                setslNoPay(finalNoPay)
                                                                setslWithPay(finalWithPay)
                                                            }else{
                                                                Swal.close()
                                                                toast.error(response.data.message)
                                                            }
                                                        }).catch((error)=>{
                                                            Swal.close()
                                                            toast.error(error)
                                                            console.log(error)
                                
                                                        })
                                                    }else{
                                                        Swal.fire({
                                                            icon:'warning',
                                                            title:'Oops...',
                                                            html:'Please specify details of leave.'
                                                        })
                                                    }


                                                }
                                            }
                                            if(SLPeriodDays[0].period === 'NONE' || SLPeriodDays[1].period === 'NONE'){
                                               
                                                selectedInclusiveDates.forEach(el=>{
                                                    if(!daysWithoutPay.includes(moment(el.toDate()).format('MM-DD-YYYY'))){
                                                        format_date.push({
                                                        date:moment(el.toDate()).format('MM-DD-YYYY'),
                                                        period:'NONE'
                                                        })
                                                    }
                                                })
                                                // daysWithoutPay.forEach(el=>{
                                                //     format_date_wop.push({
                                                //         date:el,
                                                //         period:'NONE'
                                                //     })
                                                // })

                                                if(specifyDetails.length !==0){

                                                    var data = {
                                                        has_attachment:has_attachment,
                                                        leave_type_id:leaveType,
                                                        details_of_leave_id:leaveDetails,
                                                        specify_details:specifyDetails,
                                                        days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                                        inclusive_dates:SLPeriodDays,
                                                        inclusive_dates_wop:daysWithoutPay,
                                                        days_with_pay:totalSLPeriodDays,
                                                        days_without_pay:slTotalWithoutPay,
                                                        balance:balance,
                                                        inclusive_dates_text:previewInclusiveDates,
                                                        commutation:commutation,
                                                        sl_file:slFile,
                                                        borrowed_vl:borrowedVLCredits,
                                                        used_sl:slCreditsWpay>availableSL?availableSL:slCreditsWpay,
                                                        vl_bal:availableVL,
                                                        is_late_filing:isLateFiling,
                                                        credits_vl_val:borrowedVLCredits,
                                                        credits_sl_val:slCreditsWpay,
                                                        bal_as_of:balAsOf


                                                    }
                                                    console.log(data)
                                                    Swal.fire({
                                                        icon:'info',
                                                        title:'Saving data',
                                                        html:'Please wait...',
                                                        allowEscapeKey:false,
                                                        allowOutsideClick:false
                                                    })
                                                    Swal.showLoading()
                                                    addLeaveApplication(data)
                                                    .then((response)=>{
                                                        // console.log(response.data)
                                                        if(response.data.status === 'success'){
                                                            // Swal.close()
                                                            const data = response.data;
                                                            Swal.fire({
                                                                icon:'success',
                                                                title:data.message,
                                                                showConfirmButton: false,
                                                                timer: 2500
                                                            })
                                                            setLeaveType('');
                                                            setLeaveDetails('')
                                                            setSpecifyDetails('')
                                                            setCommutation('')
                                                            setInclusiveDates([])
                                                            setPreviewInclusiveDates('')
                                                            // setPendingLeaveApplicationData(data.pending)
                                                            setAlreadyAppliedDays(data.applied_dates)
                                                            setonProcess(data.on_process)
                                                            // toast.success(response.data.message)
                                                            setOpen(false)
                                                            setslAutoWithoutPay(0)
                                                            setslTotalWithoutPay(0)

                                                            var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                                            var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                                            var coc = balanceData[0].coc_bal-data.on_process.coc < 0 ?0:balanceData[0].coc_bal-data.on_process.coc
                                                            // console.log(balanceData[0].coc_bal)
                                                            // console.log(data.on_process.coc)
                                                            props.updatesetPendingLeaveApplicationData(data.pending)
                                                            props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                            props.updatesetonProcess(data.on_process)
                                                            props.updatesetavailableVL(vl)
                                                            props.updatesetavailableSL(sl)
                                                            props.updatesetavailableCOC(coc)
                                                            props.updatesetOpen(false)
                                                            props.close()
                                                            let currDate = new Date();
                                                            var date = new Date();
                                                            var start = 0;
                                                            var end = 5;
                                                            var toAdd = 0;
                                                            var slRangeDatesWP =[];
                                                            while(start <= end){
                                                                var f_holidays = holidays.filter(el=>moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')>=(moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD')) && moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')<=(moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD')));

                                                                if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                                    toAdd++;
                                                                }else if(f_holidays.len>0){
                                                                    toAdd++;
                                                                }else{
                                                                    // if(moment(date).isBusinessDay()){
                                                                    //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                    //     start++;
                                                                    // }
                                                                    var temp;
                                                                    workScheduleData.forEach(el=>{
                                                                    if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                                                            temp=el.details;
                                                                        }
                                                                    })
                                                                    if(temp){
                                                                        temp.forEach(el2=>{
                                                                            if(el2.day ===moment(new Date(date)).format('D')){
                                                                                slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                                start++;
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                                date.setDate(date.getDate() - 1);
                                                            }
                                                            let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                                            let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                                            setslRangeDatesWithPay(slRangeDatesWP)
                                                            setslNoPay(finalNoPay)
                                                            setslWithPay(finalWithPay)
                                                        }else{
                                                            Swal.close()
                                                            toast.error(response.data.message)
                                                        }
                                                    }).catch((error)=>{
                                                        Swal.close()
                                                        toast.error(error)
                                                        console.log(error)
                            
                                                    })
                                                }else{
                                                    Swal.fire({
                                                        icon:'warning',
                                                        title:'Oops...',
                                                        html:'Please specify details of leave.'
                                                    })
                                                }
                                            }
                                        }else{
                                            if(specifyDetails.length !==0){
                                                var data = {
                                                    has_attachment:has_attachment,
                                                    leave_type_id:leaveType,
                                                    details_of_leave_id:leaveDetails,
                                                    specify_details:specifyDetails,
                                                    days_hours_applied:parseFloat(usedSL)+parseFloat(slTotalWithoutPay)+parseFloat(borrowedVL),
                                                    inclusive_dates:SLPeriodDays,
                                                    inclusive_dates_wop:daysWithoutPay,
                                                    days_with_pay:slCreditsWpay+borrowedVLCredits,
                                                    days_without_pay:slTotalWithoutPay,
                                                    balance:balance,
                                                    inclusive_dates_text:previewInclusiveDates,
                                                    commutation:commutation,
                                                    sl_file:slFile,
                                                    borrowed_vl:borrowedVLCredits,
                                                    used_sl:slCreditsWpay>availableSL?availableSL:slCreditsWpay,
                                                    vl_bal:availableVL,
                                                    is_late_filing:isLateFiling,
                                                    credits_vl_val:borrowedVLCredits,
                                                    credits_sl_val:slCreditsWpay,
                                                    bal_as_of:balAsOf



                                                }
                                                console.log(data)
                                                Swal.fire({
                                                    icon:'info',
                                                    title:'Saving data',
                                                    html:'Please wait...',
                                                    allowEscapeKey:false,
                                                    allowOutsideClick:false
                                                })
                                                Swal.showLoading()
                                                addLeaveApplication(data)
                                                .then((response)=>{
                                                    // console.log(response.data)
                                                    if(response.data.status === 'success'){
                                                        // Swal.close()
                                                        const data = response.data;
                                                        Swal.fire({
                                                            icon:'success',
                                                            title:data.message,
                                                            showConfirmButton: false,
                                                            timer: 2500
                                                        })
                                                        setLeaveType('');
                                                        setLeaveDetails('')
                                                        setSpecifyDetails('')
                                                        setCommutation('')
                                                        setInclusiveDates([])
                                                        setPreviewInclusiveDates('')
                                                        // setPendingLeaveApplicationData(data.pending)
                                                        setAlreadyAppliedDays(data.applied_dates)
                                                        setonProcess(data.on_process)
                                                        // toast.success(response.data.message)
                                                        setOpen(false)
                                                        setslAutoWithoutPay(0)
                                                        setslTotalWithoutPay(0)

                                                        var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                                        var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                                        var coc = balanceData[0].coc_bal-data.on_process.coc < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                        props.updatesetonProcess(data.on_process)
                                                        props.updatesetavailableVL(vl)
                                                        props.updatesetavailableSL(sl)
                                                        props.updatesetavailableCOC(coc)
                                                        props.updatesetOpen(false)
                                                        props.close()
                                                        let currDate = new Date();
                                                        var date = new Date();
                                                        var start = 0;
                                                        var end = 5;
                                                        var toAdd = 0;
                                                        var slRangeDatesWP =[];
                                                        while(start <= end){
                                                            var f_holidays = holidays.filter(el=>moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')>=(moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD')) && moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')<=(moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD')));
                                                            if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                                toAdd++;
                                                            }else if(f_holidays.length>0){
                                                                toAdd++;
                                                            }else{
                                                                // if(moment(date).isBusinessDay()){
                                                                //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                //     start++;
                                                                // }
                                                                var temp;
                                                                    workScheduleData.forEach(el=>{
                                                                    if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                                                            temp=el.details;
                                                                        }
                                                                    })
                                                                    if(temp){
                                                                        temp.forEach(el2=>{
                                                                            if(el2.day ===moment(new Date(date)).format('D')){
                                                                                slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                                start++;
                                                                            }
                                                                        })
                                                                    }
                                                            }
                                                            date.setDate(date.getDate() - 1);
                                                        }
                                                        let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                                        let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                                        setslRangeDatesWithPay(slRangeDatesWP)
                                                        setslNoPay(finalNoPay)
                                                        setslWithPay(finalWithPay)
                                                    }else{
                                                        Swal.close()
                                                        toast.error(response.data.message)
                                                    }
                                                }).catch((error)=>{
                                                    Swal.close()
                                                    toast.error(error)
                                                    console.log(error)
                        
                                                })
                                            }else{
                                                Swal.fire({
                                                    icon:'warning',
                                                    title:'Oops...',
                                                    html:'Please specify details of leave.'
                                                })
                                            }
                                        }
                                        
                                        
                                        

                                    }
                                   
                                        
                                /**
                                End totalSLPeriodDays <=1
                                 */
                                }else{
                                    console.log('here')
                                    // console.log(SLHalfDays)
                                    /**
                                    Get unique month and year from selected period days
                                     */
                                    var t_arr = [];
                                    SLPeriodDays.forEach(el=>{
                                        t_arr.push(moment(el.date).format('MM-YYYY'))
                                    })
                                    /**
                                     * Set unique month number and year
                                     */
                                    var t_unique_arr = [...new Set(t_arr)]
                                    /**
                                    Get workschedule from that month number and year
                                     */
                                    var t_sched = [];
                                    t_unique_arr.forEach(el=>{
                                        var t_split = el.split('-');
                                        var month = t_split[0];
                                        var year = t_split[1];
                                        workScheduleData.forEach(el2=>{
                                            if(el2.month === parseInt(month) && el2.year === parseInt(year)){
                                                t_sched.push(el2)
                                            }
                                        })
                                    })
                                    /**
                                    Loop sched to remove the already applied days
                                     */
                                    var t_sched2 = [];
                                    // console.log(SLPeriodDays)
                                    t_sched.forEach(el=>{
                                        var d = []
                                        el.details.forEach(el2=>{
                                            var t_arr = SLPeriodDays.filter((el3)=>{
                                                return el3.date === moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY') && el3.period !== 'NONE'
                                            })
                                            if(t_arr.length >0){
                                                d.push(moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY'))
                                            }else{
                                                if(!alreadyAppliedDays.includes(moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY'))){
                                                d.push(moment(el.month+'-'+el2.day+'-'+el.year).format('MM-DD-YYYY'))
                                                }
                                            }
                                           
                                            
                                        })
                                        t_sched2 = t_sched2.concat(d)
                                    })
                                    /**
                                    get sl days period to check if continuous date based on work schedule
                                     */
                                    
                                    /**
                                    we will used for loop, to break anytime if we found sl not continuous 
                                     */
                                    var t_sl_len = SLPeriodDays.length;
                                    var t_sl_counter = 0;
                                    var t_sl_index; 
                                    var t_sl_is_continuous = true;
                                    var t_sl_date_text_html = '';
                                    // console.log(t_sched2)
                                    for(t_sl_counter;t_sl_counter<t_sl_len;t_sl_counter++){
                                        /**
                                        get index of first sl days period, then we will start there
                                        */
                                        if(t_sl_counter === 0){
                                            t_sl_index = t_sched2.indexOf(SLPeriodDays[t_sl_counter].date);
                                            t_sl_index++;
                                            t_sl_date_text_html+='<span>'+moment(SLPeriodDays[t_sl_counter].date,'MM-DD-YYYY').format('MMMM DD,YYYY')+',</span>';
                                        }else{
                                            if(moment(SLPeriodDays[t_sl_counter].date,'MM-DD-YYYY').format('MM-DD-YYYY') !== moment(t_sched2[t_sl_index]).format('MM-DD-YYYY')){
                                                t_sl_is_continuous = false;
                                                t_sl_date_text_html+='<span style="color:red;">'+moment(SLPeriodDays[t_sl_counter].date).format('MMMM DD,YYYY')+'</span>';
                                                // console.log(moment(SLPeriodDays[t_sl_counter].date).format('MM-DD-YYYY'))
                                                // console.log(moment(t_sched2[t_sl_index]).format('MM-DD-YYYY'))
                                                break;
                                            }
                                            t_sl_date_text_html+='<span>'+moment(SLPeriodDays[t_sl_counter].date,'MM-DD-YYYY').format('MMMM DD,YYYY')+',</span>';
                                            t_sl_index++;
                                        }
                                    }
                                    // console.log(t_sl_is_continuous)

                                    if(t_sl_is_continuous){
                                        SLPeriodDays.forEach(el=>{
                                            if(!daysWithoutPay.includes(moment(el.date,'MM-DD-YYYY').format('MM-DD-YYYY'))){
                                                format_date.push({
                                                date:moment(el.date,'MM-DD-YYYY').format('MM-DD-YYYY'),
                                                period:el.period
                                                })
                                            }
                                        })
                                        daysWithoutPay.forEach(el=>{
                                            format_date_wop.push({
                                                date:el,
                                                period:'NONE'
                                            })
                                        })
                                        /**
                                        Check if continuous date period
                                        */
                                        var is_continuous = true;
                                        var i = 0;
                                        if(SLPeriodDays.length !== 1){
                                            SLPeriodDays.forEach(el=>{
                                                if(i === 0){
                                                    i++;
                                                }else if(i==SLPeriodDays.length-1){
                                                    if(SLPeriodDays[i-1].period === 'AM'){
                                                        is_continuous = false;
                                                    }else if(SLPeriodDays[i-1].period === 'PM'){
                                                        if(el.period === 'NONE'){

                                                        }else if(el.period === 'AM'){

                                                        }else{
                                                            is_continuous = false;
                                                        }
                                                    }else{
                                                        if(el.period !== 'NONE'){
                                                            if(el.period !== 'AM'){
                                                                is_continuous = false;
                                                            }
                                                        }
                                                        
                                                    }
                                                    i++;

                                                }else{
                                                    if(SLPeriodDays[i-1].period === 'AM'){
                                                        is_continuous = false;
                                                    }else if(SLPeriodDays[i-1].period === 'PM'){
                                                        if(el.period !== 'NONE'){
                                                            is_continuous = false;
                                                        }
                                                    }else{
                                                        if(el.period !== 'NONE'){
                                                            if(el.period === 'AM'){
                                                                is_continuous = false;
                                                            }
                                                            if(el.period === 'PM'){
                                                                is_continuous = false;
                                                            }
                                                        }
                                                        
                                                    }
                                                    i++;
                                                }
                                                
                                            })
                                        }
                                        if(is_continuous){
                                            if(specifyDetails.length !==0){
                                                var data = {
                                                    has_attachment:has_attachment,
                                                    leave_type_id:leaveType,
                                                    details_of_leave_id:leaveDetails,
                                                    specify_details:specifyDetails,
                                                    days_hours_applied:totalSLPeriodDays+slTotalWithoutPay,
                                                    inclusive_dates:SLPeriodDays,
                                                    inclusive_dates_wop:daysWithoutPay,
                                                    days_with_pay:totalSLPeriodDays,
                                                    days_without_pay:slTotalWithoutPay,
                                                    balance:balance,
                                                    inclusive_dates_text:previewInclusiveDates,
                                                    commutation:commutation,
                                                    sl_file:slFile,
                                                    borrowed_vl:borrowedVLCredits,
                                                    used_sl:slCreditsWpay>availableSL?availableSL:slCreditsWpay,
                                                    vl_bal:availableVL,
                                                    is_late_filing:isLateFiling,
                                                    credits_vl_val:borrowedVLCredits,
                                                    credits_sl_val:slCreditsWpay,
                                                    bal_as_of:balAsOf

                                                }
                                                console.log(data)
                                                Swal.fire({
                                                    icon:'info',
                                                    title:'Saving data',
                                                    html:'Please wait...',
                                                    allowEscapeKey:false,
                                                    allowOutsideClick:false
                                                })
                                                Swal.showLoading()
                                                addLeaveApplication(data)
                                                .then((response)=>{
                                                    // console.log(response.data)
                                                    if(response.data.status === 'success'){
                                                        // Swal.close()
                                                        const data = response.data;
                                                        Swal.fire({
                                                            icon:'success',
                                                            title:data.message,
                                                            showConfirmButton: false,
                                                            timer: 2500
                                                        })
                                                        setLeaveType('');
                                                        setLeaveDetails('')
                                                        setSpecifyDetails('')
                                                        setCommutation('')
                                                        setInclusiveDates([])
                                                        setPreviewInclusiveDates('')
                                                        // setPendingLeaveApplicationData(data.pending)
                                                        setAlreadyAppliedDays(data.applied_dates)
                                                        setonProcess(data.on_process)
                                                        // toast.success(response.data.message)
                                                        setOpen(false)
                                                        setslAutoWithoutPay(0)
                                                        setslTotalWithoutPay(0)

                                                        var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl
                                                        var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl
                                                        var coc = balanceData[0].coc_bal-data.on_process.coc < 0 ?0:balanceData[0].coc_bal-data.on_process.coc

                                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                        props.updatesetonProcess(data.on_process)
                                                        props.updatesetavailableVL(vl)
                                                        props.updatesetavailableSL(sl)
                                                        props.updatesetavailableCOC(coc)
                                                        props.updatesetOpen(false)
                                                        props.close()
                                                        let currDate = new Date();
                                                        var date = new Date();
                                                        var start = 0;
                                                        var end = 5;
                                                        var toAdd = 0;
                                                        var slRangeDatesWP =[];
                                                        while(start <= end){
                                                            var f_holidays = holidays.filter(el=>moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')>=(moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD')) && moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')<=(moment(el.holiday_date2,'YYYY-MM-DD').format('YYYY-MM-DD')));
                                                            if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                                toAdd++;
                                                            }else if(f_holidays.length>0){
                                                                toAdd++;
                                                            }else{
                                                                // if(moment(date).isBusinessDay()){
                                                                //     slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                //     start++;
                                                                // }
                                                                var temp;
                                                                    workScheduleData.forEach(el=>{
                                                                    if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                                                            temp=el.details;
                                                                        }
                                                                    })
                                                                    if(temp){
                                                                        temp.forEach(el2=>{
                                                                            if(el2.day ===moment(new Date(date)).format('D')){
                                                                                slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                                                start++;
                                                                            }
                                                                        })
                                                                    }
                                                            }
                                                            date.setDate(date.getDate() - 1);
                                                        }
                                                        let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                                        let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                                                        setslRangeDatesWithPay(slRangeDatesWP)
                                                        setslNoPay(finalNoPay)
                                                        setslWithPay(finalWithPay)
                                                    }else{
                                                        Swal.close()
                                                        toast.error(response.data.message)
                                                    }
                                                }).catch((error)=>{
                                                    Swal.close()
                                                    toast.error(error)
                                                    console.log(error)
                        
                                                })
                                            }else{
                                                Swal.fire({
                                                    icon:'warning',
                                                    title:'Oops...',
                                                    html:'Please specify details of leave.'
                                                })
                                            }
                                        }else{
                                            if(SLPeriodDays.length === 2){
                                                var t_suggested = '';
                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=moment(SLPeriodDays[1].date).format('MMMM DD,YYYY')+' - AM</p>';
                                                t_suggested+='<p style="font-size:.9rem;"><strong>OR</strong></p>'

                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=moment(SLPeriodDays[1].date).format('MMMM DD,YYYY')+' - NONE</p>';
                                                t_suggested+='<p style="font-size:.9rem;"><strong>OR</strong></p>'

                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - NONE <br/>';
                                                t_suggested+=moment(SLPeriodDays[1].date).format('MMMM DD,YYYY')+' - AM</p>';
                                                
                                                Swal.fire({
                                                    icon:'warning',
                                                    title:'Notice',
                                                    html:'Selected period are not continuous. System Suggestions:'+'<br/>'+t_suggested
                                                })
                                            }else{
                                                var t_suggested = '';
                                                var t_suggested_mid = '';
                                                SLPeriodDays.forEach((el,key)=>{
                                                    // console.log(key)
                                                    if(key !==0){
                                                        if(key !== SLPeriodDays.length-1){
                                                            t_suggested_mid+=moment(el.date).format('MMMM DD,YYYY')+' - NONE </br>';
                                                        }
                                                    }
                                                })
                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=t_suggested_mid;
                                                t_suggested+=moment(SLPeriodDays[SLPeriodDays.length-1].date).format('MMMM DD,YYYY')+' - AM</p>';

                                                t_suggested+='<p style="font-size:.9rem;"><strong>OR</strong></p>'

                                                t_suggested+='<p style="font-size:.9rem;color:blue;">'+moment(SLPeriodDays[0].date).format('MMMM DD,YYYY')+' - PM <br/>';
                                                t_suggested+=t_suggested_mid;
                                                t_suggested+=moment(SLPeriodDays[SLPeriodDays.length-1].date).format('MMMM DD,YYYY')+' - NONE</p>';

                                              
                                                
                                                Swal.fire({
                                                    icon:'warning',
                                                    title:'Notice',
                                                    html:'Selected period are not continuous. System Suggestions:'+'<br/>'+t_suggested
                                                })
                                            }
                                        }
                                        
                                    }else{
                                        
                                        Swal.fire({
                                            icon:'warning',
                                            title:'Notice !',
                                            html:'The selected dates are not continuous. Please check again the selected date:'+'<br/>'+t_sl_date_text_html
                                        })
                                    }
                                    
                                }
                                
                            }
                        }
                        
                        
                    break;
                /**
                 * Maternity Leave
                 */
                    case 4:
                    
                    /**
                     * check if selected inclusive dates is null
                     */
                    if(selectedInclusiveMaternityDates.length ===0){
                        Swal.fire({
                            icon:'warning',
                            title:'Oops...',
                            html:'Please select inclusive dates.'
                        })
                    }else{
                        /**
                         * Check if has selected date
                         */
                        if(selectedInclusiveMaternityDates.length === 0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select start date.'
                            })
                        }else{
                            if(singleFile.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:'Please upload a valid Proof of pregnancy.'
                                })
                            }else{
                                if(isAppliedAllocationOfMaternityLeave){
                                    if(allocationInfo.same_agency){
                                        if(allocationInfo.emp_no.length === 0 ||
                                        allocationInfo.fname.length === 0 ||
                                        allocationInfo.mname.length === 0 ||
                                        allocationInfo.lname.length === 0 ){
                                            Swal.fire({
                                                icon:'warning',
                                                title:'Please fill out necessary allocation info'
                                            })
                                        }
                                        else{
                                            var data = {
                                            is_applied_allocation:true,
                                            leave_type_id:leaveType,
                                            days_hours_applied:daysPeriod-allocationInfo.allocated_days,
                                            inclusive_dates:selectedInclusiveMaternityDatesRange,
                                            days_with_pay:daysPeriod-allocationInfo.allocated_days,
                                            days_without_pay:0,
                                            balance:balance,
                                            inclusive_dates_text:previewInclusiveDates,
                                            commutation:commutation,
                                            maternity_file:singleFile,
                                            employee_contact_details:employeeInfo.cpno+' - '+employeeInfo.emailadd,
                                            allocated_days:allocationInfo.allocated_days,
                                            allocated_emp_no:allocationInfo.emp_no.emp_no,
                                            allocated_same_agency:allocationInfo.same_agency,
                                            benefit_fullname:allocationInfo.fname+' '+allocationInfo.mname.charAt(0)+'. '+allocationInfo.lname,
                                            bal_as_of:balAsOf,
                                            sl:availableSL,
                                            vl:availableVL

                                        }
                                        Swal.fire({
                                            icon:'info',
                                            title:'Saving data',
                                            html:'Please wait...',
                                            // allowEscapeKey:false,
                                            // allowOutsideClick:false
                                        })
                                        // console.log(data)
                                        Swal.showLoading()
                                        addLeaveApplication(data)
                                        .then((response)=>{
                                            const data = response.data;
                                            // console.log(data)
                                            if(response.data.status === 'success'){
                                                // Swal.close()
                                                Swal.fire({
                                                    icon:'success',
                                                    title:data.message,
                                                    showConfirmButton: false,
                                                    timer: 2500
                                                })
                                                setLeaveType('');
                                                setPreviewInclusiveDates('')
                                                setInclusiveMaternityDates('')
                                                setInclusiveMaternityDatesRange([])
                                                // setPendingLeaveApplicationData(data.pending)
                                                setAlreadyAppliedDays(data.applied_dates)
                                                setisAppliedAllocationOfMaternityLeave(false)
                                                setonProcess(data.on_process)
                                                setallocationInfo({
                                                    // employee_contact_details:'',
                                                    same_agency:false,
                                                    allocated_days:1,
                                                    emp_no:'',
                                                    fname:'',
                                                    mname:'',
                                                    lname:'',
                                                });
                                                // toast.success(response.data.message)
                                                // setOpen(false)
                                                props.updatesetPendingLeaveApplicationData(data.pending)
                                                props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                props.updatesetonProcess(data.on_process)
                                                props.updatesetOpen(false)
                                                props.close()

                                            }else{
                                                Swal.close()
                                                toast.error(data.message)
                                            }
                                        }).catch((error)=>{
                                            Swal.close()
                                            toast.error(error)
                                            console.log(error)
                
                                        })
                                        }
                                    }else{
                                        var data = {
                                            is_applied_allocation:true,
                                            leave_type_id:leaveType,
                                            days_hours_applied:daysPeriod-allocationInfo.allocated_days,
                                            inclusive_dates:selectedInclusiveMaternityDatesRange,
                                            days_with_pay:daysPeriod-allocationInfo.allocated_days,
                                            days_without_pay:0,
                                            balance:balance,
                                            inclusive_dates_text:previewInclusiveDates,
                                            commutation:commutation,
                                            maternity_file:singleFile,
                                            employee_contact_details:employeeInfo.cpno+' - '+employeeInfo.emailadd,
                                            allocated_days:allocationInfo.allocated_days,
                                            allocated_emp_no:allocationInfo.emp_no.emp_no,
                                            allocated_same_agency:allocationInfo.same_agency,
                                            benefit_fullname:allocationInfo.fname+' '+allocationInfo.mname.charAt(0)+'. '+allocationInfo.lname,
                                            bal_as_of:balAsOf,
                                            sl:availableSL,
                                            vl:availableVL
                                            // benefit_position:allocationInfo.position,
                                            // benefit_home_address:allocationInfo.home_address,
                                            // benefit_contact_details:allocationInfo.contact_details,
                                            // benefit_agency_address:allocationInfo.agency_address,
                                            // benefit_relationship:allocationInfo.relationship_to_employee,
                                            // benefit_relationship_details:allocationInfo.relationship_to_employee_details,
                                            // benefit_relationship_details_specify:allocationInfo.relationship_to_employee_details_specify,
                                            // benefit_proof_relationship:allocationInfo.relationship_to_employee_proof,
                                            // relationship_to_employee_proof_file:allocationInfo.relationship_to_employee_proof_file,
                                            // esignature:allocationInfo.esignature
                                        }
                                        Swal.fire({
                                            icon:'info',
                                            title:'Saving data',
                                            html:'Please wait...',
                                            // allowEscapeKey:false,
                                            // allowOutsideClick:false
                                        })
                                        // console.log(data)
                                        Swal.showLoading()
                                        addLeaveApplication(data)
                                        .then((response)=>{
                                            const data = response.data;
                                            // console.log(data)
                                            if(response.data.status === 'success'){
                                                // Swal.close()
                                                Swal.fire({
                                                    icon:'success',
                                                    title:data.message,
                                                    showConfirmButton: false,
                                                    timer: 2500
                                                })
                                                setLeaveType('');
                                                setPreviewInclusiveDates('')
                                                setInclusiveMaternityDates('')
                                                setInclusiveMaternityDatesRange([])
                                                // setPendingLeaveApplicationData(data.pending)
                                                setAlreadyAppliedDays(data.applied_dates)
                                                setisAppliedAllocationOfMaternityLeave(false)
                                                setonProcess(data.on_process)
                                                setallocationInfo({
                                                    // employee_contact_details:'',
                                                    same_agency:false,
                                                    allocated_days:1,
                                                    emp_no:'',
                                                    fname:'',
                                                    mname:'',
                                                    lname:'',
                                                    // relationship_to_employee:'',
                                                    // relationship_to_employee_details:'',
                                                    // relationship_to_employee_details_specify:'',
                                                    // relationship_to_employee_proof:'',
                                                    // relationship_to_employee_proof_file:'',
                                                });
                                                // toast.success(response.data.message)
                                                // setOpen(false)
                                                props.updatesetPendingLeaveApplicationData(data.pending)
                                                props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                props.updatesetonProcess(data.on_process)
                                                props.updatesetOpen(false)
                                                props.close()

                                            }else{
                                                Swal.close()
                                                toast.error(data.message)
                                            }
                                        }).catch((error)=>{
                                            Swal.close()
                                            toast.error(error)
                                            console.log(error)
                
                                        })
                                    }
                                    
                                }else{
                                    var data = {
                                        is_applied_allocation:false,
                                        leave_type_id:leaveType,
                                        days_hours_applied:daysPeriod,
                                        inclusive_dates:selectedInclusiveMaternityDatesRange,
                                        days_with_pay:daysPeriod,
                                        days_without_pay:0,
                                        balance:balance,
                                        inclusive_dates_text:previewInclusiveDates,
                                        commutation:commutation,
                                        maternity_file:singleFile,
                                        bal_as_of:balAsOf,
                                        sl:availableSL,
                                        vl:availableVL


                                    }
                                    Swal.fire({
                                        icon:'info',
                                        title:'Saving data',
                                        html:'Please wait...',
                                        allowEscapeKey:false,
                                        allowOutsideClick:false
                                    })
                                    Swal.showLoading()
                                    addLeaveApplication(data)
                                    .then((response)=>{
                                        if(response.data.status === 'success'){
                                            // Swal.close()
                                            const data = response.data;
                                            Swal.fire({
                                                icon:'success',
                                                title:data.message,
                                                showConfirmButton: false,
                                                timer: 2500
                                            })
                                            setLeaveType('');
                                            setLeaveDetails('')
                                            setSpecifyDetails('')
                                            setInclusiveMaternityDates('')
                                            setInclusiveMaternityDatesRange([])
                                            setPreviewInclusiveDates('')
                                            // setPendingLeaveApplicationData(data.pending)
                                            setAlreadyAppliedDays(data.applied_dates)
                                            setonProcess(data.on_process)
                                            props.updatesetAlreadyAppliedDays(data.applied_dates)
                                            props.updatesetPendingLeaveApplicationData(data.pending)
                                            props.updatesetonProcess(data.on_process)
                                            props.updatesetOpen(false)
                                            props.close()

                                            // toast.success(response.data.message)
                                        }else{
                                            Swal.close()
                                            toast.error(response.data.message)
                                        }
                                    }).catch((error)=>{
                                        Swal.close()
                                        toast.error(error)
                                        alert(error.message)
            
                                    })
                                }
                                
                            }
                        }
                        
                    }
                    
                    
                    break;
                /**
                 * Paternity Leave
                 */
                     case 5:
                    
                        /**
                         * check if selected inclusive dates is null
                         */
                        if(selectedInclusiveDates.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select atleast 1 day.'
                            })
                        }else{
                            if(multipleFileUpload.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:"Please upload a valid Proof of child's delivery / Marriage Certificate"
                                })
                            }else{
                                selectedInclusiveDates.forEach(el=>
                                    format_date.push({
                                        date:moment(el.toDate()).format('MM-DD-YYYY'),
                                        period:'NONE'
                                    })
                                )
                                var data = {
                                    leave_type_id:leaveType,
                                    days_hours_applied:selectedInclusiveDates.length,
                                    inclusive_dates:format_date,
                                    days_with_pay:selectedInclusiveDates.length,
                                    days_without_pay:0,
                                    inclusive_dates_text:previewInclusiveDates,
                                    commutation:commutation,
                                    paternity_file:multipleFileUpload,
                                    child_birthdate:paternityChildDOB,
                                    vl_bal:availableVL,
                                    sl_bal:availableSL,
                                    bal_as_of:balAsOf

                                }
                                // console.log(data)
                                // return 0;
                                Swal.fire({
                                    icon:'info',
                                    title:'Saving data',
                                    html:'Please wait...',
                                    allowEscapeKey:false,
                                    allowOutsideClick:false
                                })
                                Swal.showLoading()
                                addLeaveApplication(data)
                                .then((response)=>{
                                    // console.log(response.data)
                                    if(response.data.status === 'success'){
                                        // Swal.close()
                                        const data = response.data;
                                        Swal.fire({
                                            icon:'success',
                                            title:data.message,
                                            showConfirmButton: false,
                                            timer: 2500
                                        })
                                        setLeaveType('');
                                        setCommutation('')
                                        setInclusiveDates('')
                                        setPreviewInclusiveDates('')
                                        // setPendingLeaveApplicationData(data.pending)
                                        setAlreadyAppliedDays(data.applied_dates)
                                        setonProcess(data.on_process)
                                        // toast.success(response.data.message)
                                        setsingleFile('')
                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                        props.updatesetonProcess(data.on_process)
                                        props.updatesetOpen(false)
                                        props.close()

                                    }else if(response.data.status === "warning"){
                                        Swal.fire({
                                            icon:'warning',
                                            title:'Oops...',
                                            html:response.data.message
                                        })
                                    }else{
                                        Swal.close()
                                        toast.error(response.data.message)
                                    }
                                }).catch((error)=>{
                                    Swal.close()
                                    toast.error(error)
                                    console.log(error)
        
                                })
                            }
                            
                        }
                        break;
                    /**
                     * Special Privilege Leave
                     */
                    case 6:

                        if(leaveDetails.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select details of leave.'
                            })
                        }else{
                            if(specifyDetails.length ===0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:'Please specify reason of leave.'
                                })
                            }else{
                                if(selectedInclusiveDates.length ===0){
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Oops...',
                                        html:'Please select date.'
                                    })
                                }else{
                                    if(commutation.length === 0){
                                        Swal.fire({
                                            icon:'warning',
                                            title:'Oops...',
                                            html:'Please select commutation.'
                                        })
                                    }else{
                                        var has_period = false;

                                        if(selectedSPL%1){
                                            for(var c = 0; c<tempSelectedSPLInclusiveDates.length ; c++){
                                                if(tempSelectedSPLInclusiveDates[c].period !== ''){
                                                    has_period = true;
                                                }
                                            }
                                        }else{
                                            has_period = true;
                                        }
                                        // tempSelectedSPLInclusiveDates.forEach(el=>
                                        //     format_date.push(moment(el.date.toDate()).format('MM-DD-YYYY'))
                                        // )
                                        if(!has_period){
                                            Swal.fire({
                                                icon:'warning',
                                                title:'Oops...',
                                                html:'Please select a date period (AM,PM). This is required if inclusive dates has half-day.'
                                            })
                                        }else{
                                            tempSelectedSPLInclusiveDates.forEach(el=>
                                                format_date.push({
                                                    date:el.date.format('MM-DD-YYYY'),
                                                    period:el.period===''?'NONE':el.period
                                                })
                                            )
                                            var data = {
                                                leave_type_id:leaveType,
                                                details_of_leave_id:leaveDetails,
                                                specify_details:specifyDetails,
                                                days_hours_applied:selectedSPL,
                                                inclusive_dates:format_date,
                                                days_with_pay:selectedSPL,
                                                days_without_pay:0,
                                                balance:balance,
                                                inclusive_dates_text:previewInclusiveDates,
                                                commutation:commutation,
                                                slp_before:applicableDays,
                                                slp_after:applicableDays-selectedSPL,
                                                vl_bal:availableVL,
                                                sl_bal:availableSL,
                                                bal_as_of:balAsOf

                                            }
                                            // console.log(data)
                                            Swal.fire({
                                                icon:'info',
                                                title:'Saving data',
                                                html:'Please wait...',
                                                allowEscapeKey:false,
                                                allowOutsideClick:false,
                                            })
                                            Swal.showLoading()
                                            addLeaveApplication(data)
                                            .then((response)=>{
                                                // console.log(response.data)
                                                if(response.data.status === 'success'){
                                                    // Swal.close()
                                                    const data = response.data;
                                                    Swal.fire({
                                                        icon:'success',
                                                        title:data.message,
                                                        showConfirmButton: false,
                                                        timer: 2500
                                                    })
                                                    setLeaveType('');
                                                    setLeaveDetails('')
                                                    setSpecifyDetails('')
                                                    setCommutation('')
                                                    setPreviewInclusiveDates('')
                                                    setselectedSPL(0.5)
                                                    setTempSelectedSPLInclusiveDates([]);
                                                    // setPendingLeaveApplicationData(data.pending)
                                                    setAlreadyAppliedDays(data.applied_dates)
                                                    setonProcess(data.on_process)
                                                    setAvailabelSPL(data.spl_days_balance)
                                                    setOnprocessSPL(data.spl_days_onprocess)                                              // toast.success(response.data.message)
                                                    props.updatesetPendingLeaveApplicationData(data.pending)
                                                    props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                    props.updatesetonProcess(data.on_process)
                                                    props.updatesetOpen(false)
                                                    props.updatesetAvailabelSPL(data.spl_days_balance)
                                                    props.updatesetOnprocessSPL(data.spl_days_onprocess)
                                                    props.close()

                                                }else{
                                                    Swal.close()
                                                    toast.error(response.data.message)
                                                }
                                            }).catch((error)=>{
                                                Swal.close()
                                                toast.error(error)
                                                console.log(error)
                    
                                            })
                                        }
                                        
                                    }
                                }
                            }
                        }
                        
                        break;
                    /**
                     * Solo Parent Leave
                     */
                     case 7:
                        // if(selectedInclusiveDates.length ===0 || selectedInclusiveDates.length<7){
                        if(selectedInclusiveDates.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select atleast 1 day.'
                            })
                        }else{
                            if(singleFile.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:'Please upload solo parent ID'
                                })
                            }else{
                                selectedInclusiveDates.forEach(el=>
                                format_date.push({
                                    date:moment(el.toDate()).format('MM-DD-YYYY'),
                                    period:'NONE'
                                })
                                )
                                var data = {
                                    leave_type_id:leaveType,
                                    days_hours_applied:selectedInclusiveDates.length,
                                    inclusive_dates:format_date,
                                    days_with_pay:selectedInclusiveDates.length,
                                    days_without_pay:0,
                                    balance:balance,
                                    inclusive_dates_text:previewInclusiveDates,
                                    commutation:commutation,
                                    file:singleFile,
                                    bal_as_of:balAsOf,
                                    vl_bal:availableVL,
                                    sl_bal:availableSL,

                                }
                                Swal.fire({
                                    icon:'info',
                                    title:'Saving data',
                                    html:'Please wait...',
                                    allowEscapeKey:false,
                                    allowOutsideClick:false,
                                })
                                Swal.showLoading()
                                // console.log(data)
                                addLeaveApplication(data)
                                .then((response)=>{
                                    // console.log(response.data)
                                    if(response.data.status === 'success'){
                                        // Swal.close()
                                        const data = response.data;
                                        Swal.fire({
                                            icon:'success',
                                            title:data.message,
                                            showConfirmButton: false,
                                            timer: 2500
                                        })
                                        setLeaveType('');
                                        setCommutation('')
                                        setInclusiveDates('')
                                        setPreviewInclusiveDates('')
                                        // setPendingLeaveApplicationData(data.pending)
                                        setAlreadyAppliedDays(data.applied_dates)
                                        setonProcess(data.on_process)
                                        // toast.success(response.data.message)
                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                        props.updatesetonProcess(data.on_process)
                                        props.updatesetOpen(false)
                                        props.close()

                                    }else{
                                        Swal.close()
                                        toast.error(response.data.message)
                                    }
                                }).catch((error)=>{
                                    Swal.close()
                                    toast.error(error)
                                    console.log(error)
        
                                })
                            }
                            
                        }
                        
                        break;
            /**
             * Study leave
             */
                case 8:
                
                /**
                 * check if selected inclusive dates is null
                 */
                if(selectedStudyDates.length ===0){
                    Swal.fire({
                        icon:'warning',
                        title:'Oops...',
                        html:'Please select inlcusive dates.'
                    })
                }else{
                    if(singleFile.length === 0){
                        Swal.fire({
                            icon:'warning',
                            title:'Oops...',
                            html:"Please upload a supporting document."
                        })
                    }else{
                       
                        var from =selectedStudyDates[0].toDate();
                        var to =selectedStudyDates[1].toDate();
                        var dates = []
                        while(from <= to){
                            var exclude = alreadyAppliedDays.includes(moment(from).format('MM-DD-YYYY'))
                            if(exclude){
                                from.setDate(from.getDate()+1)
                            }else{
                                dates.push(moment(new Date(from)).format('MM-DD-YYYY'));
                                from.setDate(from.getDate() + 1);
                            }

                        }
                        // selectedInclusiveDates.forEach(el=>
                        //     format_date.push(moment(el.toDate()).format('MM-DD-YYYY'))
                        // )
                        var data = {
                            leave_type_id:leaveType,
                            days_hours_applied:dates.length,
                            inclusive_dates:dates,
                            days_with_pay:dates.length,
                            days_without_pay:0,
                            inclusive_dates_text:previewInclusiveDates,
                            commutation:commutation,
                            study_file:singleFile,
                            bal_as_of:balAsOf

                        }
                        Swal.fire({
                            icon:'info',
                            title:'Saving data',
                            html:'Please wait...',
                            allowEscapeKey:false,
                            allowOutsideClick:false
                        })
                        Swal.showLoading()
                        addLeaveApplication(data)
                        .then((response)=>{
                            // console.log(response.data)
                            if(response.data.status === 'success'){
                                // Swal.close()
                                const data = response.data;
                                Swal.fire({
                                    icon:'success',
                                    title:data.message,
                                    showConfirmButton: false,
                                    timer: 2500
                                })
                                setLeaveType('');
                                setCommutation('')
                                setSelectedStudyDates('')
                                setPreviewInclusiveDates('')
                                setsingleFile('')
                                // setPendingLeaveApplicationData(data.pending)
                                setAlreadyAppliedDays(data.applied_dates)
                                setonProcess(data.on_process)
                                props.updatesetPendingLeaveApplicationData(data.pending)
                                props.updatesetAlreadyAppliedDays(data.applied_dates)
                                props.updatesetonProcess(data.on_process)
                                props.updatesetOpen(false)
                                props.close()

                            }else{
                                Swal.close()
                                toast.error(response.data.message)
                            }
                        }).catch((error)=>{
                            Swal.close()
                            toast.error(error)
                            console.log(error)

                        })
                    }
                    
                }
                break;
                /**
                 * VAWC Leave
                 */
                     case 9:
                        /**
                         * check if selected inclusive dates is null
                         */
                        if(selectedInclusiveDates.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select start dates.'
                            })
                        }else{
                            if(singleFile.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:'Please upload a supporting document.'
                                })
                            }else{
                                var format_date = [];
                                selectedInclusiveDates.forEach(el=>
                                    format_date.push({
                                        date:moment(el.toDate()).format('MM-DD-YYYY'),
                                        period:'NONE'
                                    })
                                )   
                                var data = {
                                    leave_type_id:leaveType,
                                    days_hours_applied:selectedInclusiveDates.length,
                                    inclusive_dates:format_date,
                                    days_with_pay:selectedInclusiveDates.length,
                                    days_without_pay:0,
                                    balance:balance,
                                    inclusive_dates_text:previewInclusiveDates,
                                    commutation:commutation,
                                    vawc_file:singleFile,
                                    bal_as_of:balAsOf

                                }
                                Swal.fire({
                                    icon:'info',
                                    title:'Saving data',
                                    html:'Please wait...',
                                    allowEscapeKey:false,
                                    allowOutsideClick:false
                                })
                                Swal.showLoading()
                                addLeaveApplication(data)
                                .then((response)=>{
                                    // console.log(response.data)
                                    if(response.data.status === 'success'){
                                        // Swal.close()
                                        const data = response.data;
                                        Swal.fire({
                                            icon:'success',
                                            title:data.message,
                                            showConfirmButton: false,
                                            timer: 2500
                                        })
                                        setLeaveType('');
                                        setLeaveDetails('')
                                        setSpecifyDetails('')
                                        setCommutation('')
                                        setInclusiveVAWCDates('')
                                        setsingleFile('')
                                        setInclusiveVAWCDatesRange([])
                                        setPreviewInclusiveDates('')
                                        // setPendingLeaveApplicationData(data.pending)
                                        setAlreadyAppliedDays(data.applied_dates)
                                        setonProcess(data.on_process)
                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                        props.updatesetonProcess(data.on_process)
                                        props.updatesetOpen(false)
                                        props.close()

                                    }else{
                                        Swal.close()
                                        toast.error(response.data.message)
                                    }
                                }).catch((error)=>{
                                    Swal.close()
                                    toast.error(error)
                                    alert(error.message)
        
                                })                                    
                            }
                            
                        }
                        
                        
                        break;
                /**
                 * Rehabilitation Leave
                 */
                     case 10:
                    
                        /**
                         * check if selected inclusive dates is null
                         */
                        if(selectedRehabilitationDates.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select inlcusive dates.'
                            })
                        }else{
                            if(singleFile.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:"Please upload a supporting document."
                                })
                            }else{
                                // var allDates = getAllDatesInRange(selectedRehabilitationDates)
                                // allDates.forEach(el=>
                                //     format_date.push(el.format('MM-DD-YYYY'))
                                // )
                                
                                var from =selectedRehabilitationDates[0].toDate();
                                var to =selectedRehabilitationDates[1].toDate();
                                var dates = [];
                                var dates_wop = [];
                                var count = 0;
                                while(from <= to){
                                    var exclude = alreadyAppliedDays.includes(moment(from).format('MM-DD-YYYY'))
                                    if(exclude){
                                        from.setDate(from.getDate()+1)
                                    }else{
                                        if(count<30){
                                            var temp_dates = {
                                            date:moment(new Date(from)).format('MM-DD-YYYY'),
                                            period:'NONE'
                                            }
                                            dates.push(temp_dates);
                                        }else{
                                            var temp_dates = {
                                            date:moment(new Date(from)).format('MM-DD-YYYY'),
                                            period:'NONE'
                                            }
                                            dates_wop.push(temp_dates);
                                        }
                                        
                                        from.setDate(from.getDate() + 1);
                                        count++;
                                    }

                                }
                                // selectedInclusiveDates.forEach(el=>
                                //     format_date.push(moment(el.toDate()).format('MM-DD-YYYY'))
                                // )
                                var data = {
                                    leave_type_id:leaveType,
                                    days_hours_applied:dates.length+dates_wop.length,
                                    inclusive_dates:dates,
                                    inclusive_dates_wop:dates_wop,
                                    days_with_pay:dates.length,
                                    days_without_pay:dates_wop.length,
                                    inclusive_dates_text:previewInclusiveDates,
                                    commutation:commutation,
                                    rehabilitation_file:singleFile,
                                    bal_as_of:balAsOf
                                }
                                Swal.fire({
                                    icon:'info',
                                    title:'Saving data',
                                    html:'Please wait...',
                                    allowEscapeKey:false,
                                    allowOutsideClick:false
                                })
                                Swal.showLoading()
                                addLeaveApplication(data)
                                .then((response)=>{
                                    if(response.data.status === 'success'){
                                        // Swal.close()
                                        const data = response.data;
                                        Swal.fire({
                                            icon:'success',
                                            title:data.message,
                                            showConfirmButton: false,
                                            timer: 2500
                                        })
                                        setLeaveType('');
                                        setCommutation('')
                                        setRehabilitationDates('')
                                        setPreviewInclusiveDates('')
                                        setsingleFile('')
                                        // setPendingLeaveApplicationData(data.pending)
                                        setAlreadyAppliedDays(data.applied_dates)
                                        setonProcess(data.on_process)
                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                        props.updatesetonProcess(data.on_process)
                                        props.updatesetOpen(false)
                                        props.close()

                                    }else{
                                        Swal.close()
                                        toast.error(response.data.message)
                                    }
                                }).catch((error)=>{
                                    Swal.close()
                                    toast.error(error)
                                    console.log(error)
        
                                })
                            }
                            
                        }
                        break;
                /**
                 * Special Leave benefits for women
                 */
                     case 11:
                    
                        /**
                         * check if selected inclusive dates is null
                         */
                        if(selectedBenefitForWomenDates.length ===0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select inlcusive dates.'
                            })
                        }else{
                            if(specifyDetails.length ===0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:'Please specify illness.'
                                })
                            }else{
                                if(singleFile.length === 0){
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Oops...',
                                        html:"Please upload a supporting document."
                                    })
                                }else{
                                    // var allDates = getAllDatesInRange(selectedBenefitForWomenDates)
                                    // allDates.forEach(el=>
                                    //     format_date.push(el.format('MM-DD-YYYY'))
                                    // )
                                    var from =selectedBenefitForWomenDates[0].toDate();
                                    var to =selectedBenefitForWomenDates[1].toDate();
                                    var dates = []
                                    while(from <= to){
                                        var exclude = alreadyAppliedDays.includes(moment(from).format('MM-DD-YYYY'))
                                        if(exclude){
                                            from.setDate(from.getDate()+1)
                                        }else{
                                            var temp_dates = {
                                                date:moment(new Date(from)).format('MM-DD-YYYY'),
                                                period:'NONE'
                                            }
                                            dates.push(temp_dates);
                                            from.setDate(from.getDate() + 1);
                                        }

                                    }
                                    // selectedInclusiveDates.forEach(el=>
                                    //     format_date.push(moment(el.toDate()).format('MM-DD-YYYY'))
                                    // )
                                    var data = {
                                        leave_type_id:leaveType,
                                        days_hours_applied:dates.length,
                                        inclusive_dates:dates,
                                        days_with_pay:dates.length,
                                        days_without_pay:0,
                                        inclusive_dates_text:previewInclusiveDates,
                                        commutation:commutation,
                                        specialleavewomen_file:singleFile,
                                        bal_as_of:balAsOf
                                    }
                                    Swal.fire({
                                        icon:'info',
                                        title:'Saving data',
                                        html:'Please wait...',
                                        allowEscapeKey:false,
                                        allowOutsideClick:false
                                    })
                                    Swal.showLoading()
                                    addLeaveApplication(data)
                                    .then((response)=>{
                                        if(response.data.status === 'success'){
                                            // Swal.close()
                                            const data = response.data;
                                            Swal.fire({
                                                icon:'success',
                                                title:data.message,
                                                showConfirmButton: false,
                                                timer: 2500
                                            })
                                            setLeaveType('');
                                            setCommutation('')
                                            setselectedBenefitForWomenDates('')
                                            setPreviewInclusiveDates('')
                                            setsingleFile('')
                                            // setPendingLeaveApplicationData(data.pending)
                                            setAlreadyAppliedDays(data.applied_dates)
                                            setonProcess(data.on_process)
                                            props.updatesetPendingLeaveApplicationData(data.pending)
                                            props.updatesetAlreadyAppliedDays(data.applied_dates)
                                            props.updatesetonProcess(data.on_process)
                                            props.updatesetOpen(false)
                                            props.close()

                                        }else{
                                            Swal.close()
                                            toast.error(response.data.message)
                                        }
                                    }).catch((error)=>{
                                        Swal.close()
                                        toast.error(error)
                                        console.log(error)
            
                                    })
                                }
                            }
                            
                            
                        }
                        break;
                /**
                 * Special emergency Leave
                 */
                     case 12:
                    
                        /**
                         * check if selected inclusive dates is null
                         */
                        if(selectedInclusiveDates.length ===0 || selectedInclusiveDates.length > 5){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please maximum of 5 days.'
                            })
                        }else{
                            if(singleFile.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:"Please upload a supporting document."
                                })
                            }else{
                                selectedInclusiveDates.forEach(el=>
                                    format_date.push({
                                        date:moment(el.toDate()).format('MM-DD-YYYY'),
                                        period:'NONE'
                                    })
                                )
                                var data = {
                                    leave_type_id:leaveType,
                                    days_hours_applied:selectedInclusiveDates.length,
                                    inclusive_dates:format_date,
                                    days_with_pay:selectedInclusiveDates.length,
                                    days_without_pay:0,
                                    inclusive_dates_text:previewInclusiveDates,
                                    commutation:commutation,
                                    specialemergency_file:singleFile,
                                    bal_as_of:balAsOf
                                }
                                Swal.fire({
                                    icon:'info',
                                    title:'Saving data',
                                    html:'Please wait...',
                                    allowEscapeKey:false,
                                    allowOutsideClick:false
                                })
                                Swal.showLoading()
                                addLeaveApplication(data)
                                .then((response)=>{
                                    if(response.data.status === 'success'){
                                        // Swal.close()
                                        const data = response.data;
                                        Swal.fire({
                                            icon:'success',
                                            title:data.message,
                                            showConfirmButton: false,
                                            timer: 2500
                                        })
                                        setLeaveType('');
                                        setCommutation('')
                                        setInclusiveDates('')
                                        setPreviewInclusiveDates('')
                                        setsingleFile('')
                                        // setPendingLeaveApplicationData(data.pending)
                                        setAlreadyAppliedDays(data.applied_dates)
                                        setonProcess(data.on_process)
                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                        props.updatesetonProcess(data.on_process)
                                        props.updatesetOpen(false)
                                        props.close()

                                    }else{
                                        Swal.close()
                                        toast.error(response.data.message)
                                    }
                                }).catch((error)=>{
                                    Swal.close()
                                    toast.error(error)
                                    console.log(error)
        
                                })
                            }
                            
                        }
                        break;
                /**
                 * Others
                 */
                 case 15:
                    if(specifyDetails.length ===0){
                        // document.getElementById("specify-details").focus();
                        Swal.fire({
                            icon:'warning',
                            title:'Oops...',
                            html:'Please input specify details '
                        })
                    }else{
                        switch(leaveDetails){
                            /**
                             * Monetization of leave credits
                             */
                            case 9:
                                /**
                                 * check if selected number of days for monetization
                                 */
                                var isRequiredMonetizationFile = false;
                                // var monetization = availableVL/2;
                                var monetization;
                                
                                // if(hasAppliedVL >= 5){
                                //     monetization = (formatSubtractCreditAvailableDecimal(availableVL,5)+availableSL)/2
                                // }else{
                                //     monetization = (formatSubtractCreditAvailableDecimal(availableVL,5-hasAppliedVL)+availableSL)/2
                                // }
                                // var total_vl_sl = ((availableVL-5)+availableSL)/2
                                var total_sl_vl = (availableVL+availableSL)/2;

                                if(parseInt(daysOfMonetization)>=total_sl_vl || totalSL>0){
                                    isRequiredMonetizationFile = true;
                                }else{
                                    isRequiredMonetizationFile = false;
                                }
                                // if(daysOfMonetization>=total_vl_sl){
                                //     isRequiredMonetizationFile = true;
                                // }else{
                                //     isRequiredMonetizationFile = false;
                                // }
                                if(parseInt(daysOfMonetization) === 0){
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Oops...',
                                        html:'Please select a number of days.'
                                    })
                                }else{
                                    if(isRequiredMonetizationFile){
                                        if(singleFile.length === 0){
                                            Swal.fire({
                                                icon:'warning',
                                                title:'Oops...',
                                                html:"Please upload a supporting document."
                                            })
                                        }else{
                                            // var total_vl;
                                            // var total_sl;
                                            /**
                                             * check if has applied VL within the current year
                                             */
                                            // if(hasAppliedVL){
                                            //     /**
                                            //      * Check if tick the checkbox for include SL for deduction
                                            //      */
                                            //     if(isInludeSLMonetization){
                                            //         /**
                                            //          * check again if selected number of days of monenitization is greater than to available vl, if greater than means include SL for deduction
                                            //          */
                                            //         if(daysOfMonetization>availableVL){
                                            //             total_vl = availableVL;
                                            //             total_sl = daysOfMonetization-availableVL
                                            //         }else{
                                            //             total_vl = daysOfMonetization;
                                            //             total_sl = 0;
                                            //         }
                                                    
                                            //     }else{
    
                                            //         if(daysOfMonetization>(availableVL-5)){
                                            //             total_vl = availableVL-5;
                                            //             total_sl = daysOfMonetization-availableVL
                                            //         }else{
                                            //             total_vl = daysOfMonetization;
                                            //             total_sl = 0;
                                            //         }
                                            //     }
    
                                            // }else{
                                            //     if(daysOfMonetization>(availableVL-5)){
                                            //         total_vl = availableVL-5;
                                            //         total_sl = daysOfMonetization-(availableVL-5)
                                            //     }else{
                                            //         total_vl = daysOfMonetization;
                                            //         total_sl = 0;
                                            //     }
                                            // }
                                            
                                            var data = {
                                                has_required_file:isRequiredMonetizationFile,
                                                leave_type_id:leaveType,
                                                details_of_leave_id:9,
                                                days_hours_applied:daysOfMonetization,
                                                days_with_pay:daysOfMonetization,
                                                days_without_pay:0,
                                                commutation:commutation,
                                                monetization_file:singleFile,
                                                available_vl:availableVL,
                                                available_sl:availableSL,
                                                specify_details:specifyDetails,
                                                total_vl:totalVL,
                                                total_sl:totalSL,
                                                bal_as_of:balAsOf,
                                                vl_bal:availableVL,
                                                sl_bal:availableSL,
                                                credits_vl_val:totalVL,
                                                credits_sl_val:totalSL
                                            }
                                            console.log(data)
                                            Swal.fire({
                                                icon:'info',
                                                title:'Saving data',
                                                html:'Please wait...',
                                                allowEscapeKey:false,
                                                allowOutsideClick:false
                                            })
                                            Swal.showLoading()
                                            addLeaveApplication(data)
                                            .then((response)=>{
                                                if(response.data.status === 'success'){
                                                    // Swal.close()
                                                    const data = response.data;
                                                    Swal.fire({
                                                        icon:'success',
                                                        title:data.message,
                                                        showConfirmButton: false,
                                                        timer: 2500
                                                    })
                                                    setLeaveType('');
                                                    setCommutation('')
                                                    setsingleFile('')
                                                    setdaysOfMonetization(1)
                                                    // setPendingLeaveApplicationData(data.pending)
                                                    setAlreadyAppliedDays(data.applied_dates)
                                                    setonProcess(data.on_process)
        
                                                    var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
                                                    var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
                                                    var coc = data.balance[0].coc_bal< 0 ?0:data.balance[0].coc_bal-data.on_process.coc
                                                    setavailableVL(vl)
                                                    setavailableSL(sl)
                                                    setavailableCOC(coc)

                                                    props.updatesetPendingLeaveApplicationData(data.pending)
                                                    props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                    props.updatesetonProcess(data.on_process)
                                                    props.updatesetOpen(false)
                                                    props.updatesetavailableVL(vl)
                                                    props.updatesetavailableSL(sl)
                                                    props.updatesetavailableCOC(coc)
                                                    props.close()

                                                }else{
                                                    Swal.close()
                                                    toast.error(response.data.message)
                                                }
                                            }).catch((error)=>{
                                                Swal.close()
                                                toast.error(error)
                                                console.log(error)
                    
                                            })
                                        }
                                    }else{
                                        // var total_vl;
                                        // var total_sl;
                                            /**
                                             * check if has applied VL within the current year
                                             */
                                            // if(hasAppliedVL >= 5){
                                            //     /**
                                            //      * Check if tick the checkbox for include SL for deduction
                                            //      */
                                            //     if(isInludeSLMonetization){
                                            //         /**
                                            //          * check again if selected number of days of monenitization is greater than to available vl, if greater than means include SL for deduction
                                            //          */
                                            //         if(daysOfMonetization>availableVL){
                                            //             total_vl = availableVL;
                                            //             total_sl = daysOfMonetization-availableVL
                                            //         }else{
                                            //             total_vl = daysOfMonetization;
                                            //             total_sl = 0;
                                            //         }
                                                    
                                            //     }else{
                                            //         if(daysOfMonetization>(availableVL-5)){
                                            //             total_vl = availableVL-5;
                                            //             total_sl = (daysOfMonetization-availableVL)-5
                                            //         }else{
                                            //             total_vl = daysOfMonetization;
                                            //             total_sl = 0;
                                            //         }
                                            //     }
    
                                            // }else{
                                            //     if(daysOfMonetization>(availableVL-5)){
                                            //         total_vl = availableVL-5;
                                            //         total_sl = (daysOfMonetization-availableVL)-5
                                            //     }else{
                                            //         total_vl = daysOfMonetization;
                                            //         total_sl = 0;
                                            //     }
                                            // }
                                        var data = {
                                            has_required_file:isRequiredMonetizationFile,
                                            leave_type_id:leaveType,
                                            details_of_leave_id:9,
                                            days_hours_applied:daysOfMonetization,
                                            days_with_pay:daysOfMonetization,
                                            days_without_pay:0,
                                            commutation:commutation,
                                            specify_details:specifyDetails,
                                            available_vl:availableVL,
                                            available_sl:availableSL,
                                            total_vl:totalVL,
                                            total_sl:totalSL,
                                            bal_as_of:balAsOf,
                                            credits_vl_val:totalVL,
                                            credits_sl_val:totalSL
                                        }
                                        Swal.fire({
                                            icon:'info',
                                            title:'Saving data',
                                            html:'Please wait...',
                                            allowEscapeKey:false,
                                            allowOutsideClick:false
                                        })
                                        Swal.showLoading()
                                        addLeaveApplication(data)
                                        .then((response)=>{
                                            if(response.data.status === 'success'){
                                                // Swal.close()
                                                const data = response.data;
                                                Swal.fire({
                                                    icon:'success',
                                                    title:data.message,
                                                    showConfirmButton: false,
                                                    timer: 2500
                                                })
                                                setLeaveType('');
                                                setCommutation('')
                                                setsingleFile('')
                                                setdaysOfMonetization(1)
                                                // setPendingLeaveApplicationData(data.pending)
                                                setAlreadyAppliedDays(data.applied_dates)
                                                setonProcess(data.on_process)
                                                // toast.success(response.data.message)
    
                                                var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
                                                var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
                                                var coc = data.balance[0].coc_bal-data.on_process.vl < 0 ?0:data.balance[0].coc_bal-data.on_process.coc
                                                setavailableVL(vl)
                                                setavailableSL(sl)
                                                setavailableCOC(coc)

                                                props.updatesetPendingLeaveApplicationData(data.pending)
                                                props.updatesetAlreadyAppliedDays(data.applied_dates)
                                                props.updatesetonProcess(data.on_process)
                                                props.updatesetOpen(false)
                                                props.updatesetavailableVL(vl)
                                                props.updatesetavailableSL(sl)
                                                props.updatesetavailableCOC(coc)
                                                props.close()

                                            }else{
                                                Swal.close()
                                                toast.error(response.data.message)
                                            }
                                        }).catch((error)=>{
                                            Swal.close()
                                            toast.error(error)
                                            console.log(error)
                
                                        })
                                    }
                                    
                                }
                            break;
                            case 10:
                                if(singleFile.length === 0){
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Oops...',
                                        html:"Please upload a supporting document."
                                    })
                                }else{
                                    var data = {
                                        leave_type_id:leaveType,
                                        details_of_leave_id:10,
                                        days_hours_applied:availableVL+availableSL,
                                        days_with_pay:availableVL+availableSL,
                                        days_without_pay:0,
                                        commutation:commutation,
                                        specify_details:specifyDetails,
                                        terminal_file:singleFile,
                                        available_vl:availableVL,
                                        available_sl:availableSL,
                                        inclusive_dates:[{'date':'?','period':'NONE'}],
                                        bal_as_of:balAsOf
                                    }
                                    Swal.fire({
                                        icon:'info',
                                        title:'Saving data',
                                        html:'Please wait...',
                                        allowEscapeKey:false,
                                        allowOutsideClick:false
                                    })
                                    Swal.showLoading()
                                    addLeaveApplication(data)
                                    .then((response)=>{
                                        if(response.data.status === 'success'){
                                            // Swal.close()
                                            const data = response.data;
                                            Swal.fire({
                                                icon:'success',
                                                title:data.message,
                                                showConfirmButton: false,
                                                timer: 2500
                                            })
                                            setLeaveType('');
                                            setCommutation('')
                                            setsingleFile('')
                                            // setPendingLeaveApplicationData(data.pending)
                                            setAlreadyAppliedDays(data.applied_dates)
                                            setonProcess(data.on_process)
                                            // toast.success(response.data.message)
    
                                            var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
                                            var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
                                            var coc = data.balance[0].coc_bal-data.on_process.vl < 0 ?0:data.balance[0].coc_bal-data.on_process.coc
                                            setavailableVL(vl)
                                            setavailableSL(sl)
                                            setavailableCOC(coc)

                                            props.updatesetPendingLeaveApplicationData(data.pending)
                                            props.updatesetAlreadyAppliedDays(data.applied_dates)
                                            props.updatesetonProcess(data.on_process)
                                            props.updatesetOpen(false)
                                            props.updatesetavailableVL(vl)
                                            props.updatesetavailableSL(sl)
                                            props.updatesetavailableCOC(coc)
                                            props.close()

                                        }else{
                                            Swal.close()
                                            toast.error(response.data.message)
                                        }
                                    }).catch((error)=>{
                                        Swal.close()
                                        toast.error(error)
                                        console.log(error)
            
                                    })
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    
                    break;
                    /**
                     * CTO
                     */
                    case 14:
                        var has_period = false;

                        if(CTOHours%8){
                            for(var c = 0; c<tempSelectedCTOInclusiveDates.length ; c++){
                                if(tempSelectedCTOInclusiveDates[c].period !== ''){
                                    has_period = true;
                                }
                            }
                        }else{
                            has_period = true;
    
                        }
                        tempSelectedCTOInclusiveDates.forEach(el=>
                            format_date.push({
                                date:moment(el.date.toDate()).format('MM-DD-YYYY'),
                                period:el.period.length === 0 ?'NONE':el.period
                            })
                        )
                        // for (var i = 0 ; i <tempSelectedCTOInclusiveDates.length ; i++){
                        //     var period = '';
                        //     if(tempSelectedCTOInclusiveDates[i].period.length !==0){
                        //         period = '-'+tempSelectedCTOInclusiveDates[i].period;
                        //     }else{
                        //         period = tempSelectedCTOInclusiveDates[i].period;
                        //     }
    
                        //     if(i === tempSelectedCTOInclusiveDates.length - 1){
                        //         cto_dates += moment(tempSelectedCTOInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period;
    
                        //     }else{
                        //         cto_dates += moment(tempSelectedCTOInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period+', ';
    
                        //     }
    
                        // }
                        if(CTOHours.length === 0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops..',
                                html:'Please select no. of hours to apply.'
                            })
                        }else if(tempSelectedCTOInclusiveDates.length === 0){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops..',
                                html:'Please select Inclusive dates.'
                            })
                        }else if(!has_period){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select a date period (AM,PM). This is required if inclusive dates has half-day.'
                            })
                        }else{
                            if(multipleFileUpload.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops..',
                                    html:'Please upload Certificate of COC.'
                                })
                            }else{
                                let days = CTOHours/8;
                                var data = {
                                    leave_type_id:leaveType,
                                    details_of_leave_id:leaveDetails,
                                    specify_details:specifyDetails,
                                    days_hours_applied:CTOHours ,
                                    inclusive_dates:format_date,
                                    days_with_pay:days,
                                    days_without_pay:0,
                                    balance:balance,
                                    inclusive_dates_text:ctodatestext,
                                    commutation:'',
                                    coc_file:multipleFileUpload,
                                    bal_as_of:balAsOf
                                }
                                Swal.fire({
                                    icon:'info',
                                    title:'Saving data',
                                    html:'Please wait...',
                                    allowEscapeKey:false,
                                    allowOutsideClick:false
                                })
                                Swal.showLoading()
                                addLeaveApplication(data)
                                .then((response)=>{
                                    const data = response.data;
                                    if(data.status === 'success'){
                                        // Swal.close()
                                        Swal.fire({
                                            icon:'success',
                                            title:data.message,
                                            showConfirmButton: false,
                                            timer: 2500
                                        })
                                        setLeaveType('');
                                        setCOCFile('');
                                        setctodatestext('');
                                        setLeaveDetails('')
                                        setCommutation('')
                                        setPreviewInclusiveDates('')
                                        setCTOHours('')
                                        setCTOInclusiveDates([])
                                        setTempSelectedCTOInclusiveDates([])
                                        // setPendingLeaveApplicationData(data.pending)
                                        setAlreadyAppliedDays(data.applied_dates)
                                        setonProcess(data.on_process)

                                        var vl = balanceData[0].vl_bal-data.on_process.vl < 0 ?0:balanceData[0].vl_bal-data.on_process.vl

                                        var sl = balanceData[0].sl_bal-data.on_process.sl < 0 ?0:balanceData[0].sl_bal-data.on_process.sl

                                        var coc = balanceData[0].coc_bal-data.on_process.vl < 0 ?0:balanceData[0].coc_bal-data.on_process.coc
                                        

                                        setavailableVL(vl)
                                        setavailableSL(sl)
                                        setavailableCOC(coc)
                                        var temp = 0;
                                        data.pending.forEach(el => {
                                            if(el.status=== 'FOR REVIEW' && el.leave_type_id === 14){
                                                temp+=el.days_hours_applied
                                            }
                                        });
                                        props.setTotalForReview(temp)
                                        props.updatesetavailableCOC(data.coc_bal)

                                        props.updatesetPendingLeaveApplicationData(data.pending)
                                        props.updatesetAlreadyAppliedDays(data.applied_dates)
                                        props.updatesetonProcess(data.on_process)
                                        props.updatesetOpen(false)
                                        props.updatesetavailableVL(vl)
                                        props.updatesetavailableSL(sl)
                                        // props.updatesetavailableCOC(coc)
                                        props.close()

                                    }else{
                                        Swal.close()
                                        toast.error(response.data.message)
                                    }
                                }).catch((error)=>{
                                    Swal.close()
                                    toast.error(error)
                                    console.log(error)
                                })
                            }
                        }
                        break;
                        case 22:
                            selectedInclusiveDates.forEach(el=>
                                format_date.push({
                                    date:moment(el.toDate()).format('MM-DD-YYYY'),
                                    period:'NONE'
                                })
                            )
                            var data = {
                                leave_type_id:leaveType,
                                details_of_leave_id:leaveDetails,
                                specify_details:specifyDetails,
                                days_hours_applied:selectedInclusiveDates.length,
                                inclusive_dates:format_date,
                                days_with_pay:selectedInclusiveDates.length,
                                days_without_pay:0,
                                balance:balance,
                                inclusive_dates_text:previewInclusiveDates,
                                commutation:commutation,
                                bal_as_of:balAsOf
                            }
                            Swal.fire({
                                icon:'info',
                                title:'Saving data',
                                html:'Please wait...',
                                allowEscapeKey:false,
                                allowOutsideClick:false
                            })
                            Swal.showLoading()
                            addLeaveApplication(data)
                            .then((response)=>{
                                if(response.data.status === 'success'){
                                    
                                    const data = response.data;
                                    Swal.fire({
                                        icon:'success',
                                        title:data.message,
                                        showConfirmButton: false,
                                        timer: 2500
                                    })
                                    setLeaveType('');
                                    setLeaveDetails('')
                                    setSpecifyDetails('')
                                    setCommutation('')
                                    setInclusiveDates([])
                                    setPreviewInclusiveDates('')
                                    // setPendingLeaveApplicationData(data.pending)
                                    // setAlreadyAppliedDays(data.applied_dates)
                                    // setonProcess(data.on_process)
                                    props.setMaternityBal(data.maternity_bal)
                                    props.setMaternityOnProcess(data.maternity_on_process)
                                    

                                    props.updatesetPendingLeaveApplicationData(data.pending)
                                    props.updatesetAlreadyAppliedDays(data.applied_dates)
                                    // props.updatesetavailableCOC(coc)
                                    
                                    props.updatesetOpen(false)
                                    props.close()
                                    // setOpen(false)
                                }else{
                                    Swal.close()
                                    toast.error(response.data.message)
                                }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                
            }
          })
        
    }
    const balanceUponApproval = (row) =>{
        if(row.status === 'FOR REVIEW'){
            if(row.leave_type_id.length !==0){
                switch(row.leave_type_id){
                    case 1:
                    case 2:
                        if(row.days_hours_applied>balanceData[0].vl_bal){
                            return 0;
                        }else{
                            return balanceData[0].vl_bal-row.days_hours_applied;
                        }
                        break;
                    case 3:
                        if(row.days_hours_applied>balanceData[0].sl_bal){
                            return 0;
                        }else{
                            return balanceData[0].sl_bal-row.days_hours_applied;
                        }
                        break;
                    case 14:
                        if(row.days_hours_applied>balanceData[0].coc_bal){
                            return 0;
                        }else{
                            return balanceData[0].coc_bal-row.days_hours_applied;
                        }
                        break;
                }
            }else{
                return 0;
            }
        }else{
            if(row.leave_type_id.length !==0){
                switch(row.leave_type_id){
                    case 1:
                    case 2:
                        return <span>{row.bal_after_review} <small>day/s</small> <br/><small style={{color:'orange'}}><em>(already deducted)</em></small></span>;
                        break;
                    case 3:
                        return <span>{row.bal_after_review} <small>day/s</small> <br/><small style={{color:'orange'}}><em>(already deducted)</em></small></span>;
                        break;
                    case 14:
                        return <span>{row.bal_after_review} <small>hr/s</small> <br/><small style={{color:'orange'}}><em>(already deducted)</em></small></span>;

                        break;
                }
            }else{
                return 0;
            }
        }
        
        
        // return JSON.stringify(row.days_hours_applied);
    }
    const [previewApplicationInfo,setPreviewApplicationInfo] = React.useState([])
    const [previewModal,setPreviewModal] = React.useState(false)
    const showLeaveTypePreview = () =>{
        
        switch(leaveType){
            case 14:
                return (<Button fullWidth variant='outlined' disabled = {ctodatestext.length ===0 ? true:false} startIcon={<VisibilityOutlined/> } onClick = {()=>setPreviewModal(true)}>PREVIEW</Button>)
                // return(
                //     <ReactToPrint
                //         trigger={() => <Button fullWidth variant='outlined' disabled = {ctodatestext.length ===0 ? true:false} startIcon={<PrintIcon/>}>PRINT</Button>}
                //         content={() => cocRef.current}
                //         documentTitle={'CTO '+employeeInfo.lname}
                //     />
                // );
            case 15:
                return (<Button fullWidth variant='outlined' disabled = {availableVL+availableSL===0?true:false} startIcon={<VisibilityOutlined/>} onClick = {()=>setPreviewModal(true)}>PREVIEW</Button>)
                // return(
                //     <ReactToPrint
                //             trigger={() => <Button fullWidth variant='outlined' disabled = {availableVL+availableSL===0?true:false} startIcon={<PrintIcon/>}>PRINT</Button>}
                //             content={() => leaveRef.current}
                //             documentTitle={'Leave Application '+employeeInfo.lname}
                //         />
                // );
                break;
            default:
                return(<Button fullWidth variant='outlined' disabled = {previewInclusiveDates.length !==0 ? false:true} startIcon={<VisibilityOutlined/>} onClick = {()=>setPreviewModal(true)}>PREVIEW</Button>)
                // return(
                //     <ReactToPrint
                //             trigger={() => <Button fullWidth variant='outlined' disabled = {previewInclusiveDates.length !==0 ? false:true} startIcon={<PrintIcon/>}>PRINT</Button>}
                //             content={() => leaveRef.current}
                //             documentTitle={'Leave Application '+employeeInfo.lname}
                //         />
                // );
                break;
        }
    }
    const handleSetCTOHours = (value) =>{
        setCTOHours(value.target.value)
        setTempSelectedCTOInclusiveDates([])
    }

    const [printPendingInfo,setPrintPendingInfo] = React.useState([]);
    //reference for leave application print preview on pending application
    const printLeaveRef = useRef();

    //reference for CTO print preview on pending application
    const printLeaveCTORef = useRef();
    
    //reference for allocation of maternity leave
    const printMaternityAllocationLeaveRef = useRef();

    const reactToPrint  = useReactToPrint({
        content: () => printLeaveRef.current,
        documentTitle: 'Leave Application '+employeeInfo.lname

    });
    const reactToPrintCTO  = useReactToPrint({
        content: () => printLeaveCTORef.current,
        documentTitle:'CTO '+employeeInfo.lname
    });
    const [printCount,setPrintCount] = React.useState(0);
    useEffect(()=>{
        if(printPendingInfo.length !==0){
            if(printPendingInfo.leave_type_id === 14){
                reactToPrintCTO()
                // setPrintPendingInfo([])
            }else{
                reactToPrint()
                // setPrintPendingInfo([])

            }
        }
    },[printCount])
    const [pendingBalance,setPendingBalance] = React.useState('');
    const printPending = (row)=>{
        setPrintCount(printCount+1);
        var bal,bal2;
        balanceData.forEach(element => {
            switch(row.leave_type_id){
                /**
                 * vacation leave/force leave/ special privilege leave
                 */
                case 1:
                case 2:
                    bal2 = element.vl_bal-onProcess.vl
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = element.vl_bal-onProcess.vl
                    }
                    break;
                /**
                 * sick leave
                 */
                case 3:
                    bal2 = element.sl_bal-onProcess.sl
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = element.sl_bal-onProcess.sl
                    }
                    break;
                /**
                 *  CTO
                 */
                case 14:
                    bal2 = element.coc_bal-onProcess.coc
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = element.coc_bal-onProcess.coc
                    }
                    break;
            }
        });
        setPendingBalance(bal)
        setPrintPendingInfo(row)
        // reactToPrint()
    }
        
    const handlePeriodChange = (data,key) => {
        // tempSelectedCTOInclusiveDates[key].period = data
        var temp = [...tempSelectedCTOInclusiveDates];
        temp[key].period = data;

        if(data === ''){
            for(var i = 0; i <temp.length ; i++){ 
                temp[i].disabled = false;
            }
        }else{
            for(var i = 0; i <temp.length ; i++){
                if(i === key){
                    temp[i].disabled = false;
                }else{
                    temp[i].disabled = true;
                }
            }
        }
        setTempSelectedCTOInclusiveDates(temp);

        var cto_dates = '';
        for (var i = 0 ; i <temp.length ; i++){
            var period = '';
            if(tempSelectedCTOInclusiveDates[i].period.length !==0){
                period = '-'+tempSelectedCTOInclusiveDates[i].period;
            }else{
                period = tempSelectedCTOInclusiveDates[i].period;
            }

            if(i === tempSelectedCTOInclusiveDates.length - 1){
                cto_dates += moment(tempSelectedCTOInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period;

            }else{
                cto_dates += moment(tempSelectedCTOInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period+', ';

            }

        }
        setctodatestext(cto_dates)
    }
    const handleSPLPeriodChange = (data,key) => {
        // tempSelectedCTOInclusiveDates[key].period = data
        var t_temp = [...tempSelectedSPLInclusiveDates];
        t_temp[key].period = data;

        if(data === ''){
            for(var i = 0; i <t_temp.length ; i++){ 
                t_temp[i].disabled = false;
            }
        }else{
            for(var i = 0; i <t_temp.length ; i++){
                if(i === key){
                    t_temp[i].disabled = false;
                }else{
                    t_temp[i].disabled = true;
                }
            }
        }
        setTempSelectedSPLInclusiveDates(t_temp);

        // var spl_dates = '';
        // for (var i = 0 ; i <temp.length ; i++){
        //     var period = '';
        //     if(tempSelectedSPLInclusiveDates[i].period.length !==0){
        //         period = '-'+tempSelectedSPLInclusiveDates[i].period;
        //     }else{
        //         period = tempSelectedSPLInclusiveDates[i].period;
        //     }

        //     if(i === tempSelectedSPLInclusiveDates.length - 1){
        //         spl_dates += moment(tempSelectedSPLInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period;

        //     }else{
        //         spl_dates += moment(tempSelectedSPLInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period+', ';

        //     }

        // }
    
        // setPreviewInclusiveDates(spl_dates)
        var temp = [];
        var temp2 = [];
        var sorted = selectedInclusiveDates.sort();
        for(var i = 0; i <sorted.length ; i++){
                //check if increment equals to sorted length
                if(i+1 !== sorted.length){
                    // check if same month and year
                    if(moment(sorted[i].toDate()).format('MMMM YYYY') === moment(sorted[i+1].toDate()).format('MMMM YYYY')){
                        // check if consecutive dates
                        if(moment(sorted[i+1].toDate()).diff(moment(sorted[i].toDate()),'days') === 1){
                            temp2.push(sorted[i].toDate())
                        }else{
                            temp2.push(sorted[i].toDate())
                            temp.push(temp2)
                            temp2 = []
                        }
                    }else{
                        temp2.push(sorted[i].toDate())
                        temp.push(temp2)
                        temp2 = []
                    }
                }else{
                    temp2.push(sorted[i].toDate())
                    temp.push(temp2)
                }
        }
        var inclusiveDates = '';
        for(var x = 0 ; x<temp.length; x++){
            /**
            if counter is not terminated
            */
            if(x+1 !== temp.length){
                if(temp[x].length !==1){
                    if(x ===0 ){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_temp)+'-'

                            inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_temp)
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_temp)+'-'

                            inclusiveDates +=moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_temp)+moment(temp[x][temp[x].length-1]).format(' YYYY, ')
                        }
                    }else{
                        // check if next and before array month and year is equal to current data
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY') &&
                        moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format(',DD-')

                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')

                        }else{
                            //check if before array month and year is equal to current data
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD-')

                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD YYYY,')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD-')
                                inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD ')
                            }
                        }
                    }
                }else{
                    if(x ===0){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                        }else{
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                        }
                    }else{
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format(',DD')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format(',DD YYYY,')
                            }
                        }else{
                            if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x+1][0]).format('MMMM YYYY')){
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD')
                            }else{
                                inclusiveDates += moment(temp[x][0]).format('MMMM DD YYYY, ')
                            }
                        }
                    }
                    
                }
            }else{
                if(temp.length !== 1){
                    if(temp[x].length !== 1){
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][0]).format(',DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_temp)+'-'

                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_temp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                        }else{
                            inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_temp)+'-'
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_temp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                        }
                    }else{
                        if(moment(temp[x][0]).format('MMMM YYYY') === moment(temp[x-1][0]).format('MMMM YYYY')){
                            inclusiveDates += moment(temp[x][temp[x].length-1]).format(',DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_temp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                        }else{
                            inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_temp)+moment(temp[x][0]).format(' YYYY')
                        }
                    }
                }else{
                    if(temp[x].length !== 1){
                        inclusiveDates += moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_temp)+'-'

                        inclusiveDates += moment(temp[x][temp[x].length-1]).format('DD')+sortDateHasPeriodSLP(moment(temp[x][temp[x].length-1]).format('MM-DD-YYYY'),t_temp)+moment(temp[x][temp[x].length-1]).format(',YYYY')
                    }else{
                        inclusiveDates +=moment(temp[x][0]).format('MMMM DD')+sortDateHasPeriodSLP(moment(temp[x][0]).format('MM-DD-YYYY'),t_temp)+moment(temp[x][0]).format(', YYYY')
                    }
                }
            }
        }
        setPreviewInclusiveDates(inclusiveDates)

    }
    const [commutation,setCommutation] = React.useState('');
    const handleChangeCommutation = (value) =>{
        setCommutation(value.target.value)
    }
    const [cocFile,setCOCFile] = React.useState('');
    const [slFile,setSLFile] = React.useState('');
    
    const handleCOCFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'||extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setCOCFile(fileReader.result)
            }
        }else{
            setCOCFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload a PDF or Image file.'
            })
        }
        
    }
    const handleSLFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setSLFile(fileReader.result)
            }
        }else{
            setSLFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const [singleFile,setsingleFile] = React.useState('');

    const handleSingleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setsingleFile(fileReader.result)
            }
        }else{
            setsingleFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    useEffect(()=>{
        if(isAppliedAllocationOfMaternityLeave){
            setOpenAllocation(true)
        }
    },[isAppliedAllocationOfMaternityLeave])
    const handleIsAppliedAllocation = () => {
        setisAppliedAllocationOfMaternityLeave(!isAppliedAllocationOfMaternityLeave);
    }
    const [totalVL,settotalVL] = React.useState(0);
    const [totalSL,settotalSL] = React.useState(0);
    useEffect(()=>{
        if(parseInt(daysOfMonetization) ===0){
            settotalVL(0)
            settotalSL(0)
        }else{
            var vl = 0;
            var sl = 0;
            if(availableVL>5){
                vl = Math.floor(availableVL)-(5-hasAppliedVL);
            }
            if(daysOfMonetization>=vl){
                settotalVL(vl);
                // to borrow
                var to_borrow = daysOfMonetization-Math.floor(vl);
                if(to_borrow<=availableSL){
                    sl = parseFloat((to_borrow).toFixed(3))
                    settotalSL(sl)
                    setappliedOthersDays(sl)

                }else{
                    sl = availableSL
                    settotalSL(sl)
                    setappliedOthersDays(sl)
                }
            }else{
                settotalVL(parseInt(daysOfMonetization));
                settotalSL(sl)
                setappliedOthersDays(sl)
            }
            // console.log(vl)
            // settotalVL(vl)
            // if(daysOfMonetization-vl !==0){
            //     /**
            //     used Sl
            //      */
            //     var total_sl_vl = (vl+availableSL)/2;
            //     if(daysOfMonetization-vl >=total_sl_vl){

            //     }else{

            //     }
            //     sl = daysOfMonetization-vl
            //     setappliedOthersDays(sl)
            //     settotalSL(sl)
            // }else{
            //     settotalSL(0)
            // }
        }
        
        // var limit = 5;
        // if(hasAppliedVL >= 5){
        //     console.log(hasAppliedVL)

        //     var total_maximum = (Math.floor(formatSubtractCreditAvailableDecimal(availableVL,0))+Math.floor(availableSL))/2
        //     if(daysOfMonetization>total_maximum){
        //         setdaysOfMonetization((Math.floor(availableVL+availableSL))/2)
        //         Swal.fire({
        //             icon:'warning',
        //             title:'Oops...',
        //             html:'Number of applied days exceed to limit !'
        //         })
        //     }
        // }else{
        //     var total_maximum;
        //     if(availableVL>=limit){
        //         total_maximum = (formatSubtractCreditAvailableDecimal(availableVL,limit)+availableSL)/2;
        //     }else{
        //         total_maximum = Math.floor(availableSL)/2
        //     }
        //     if(daysOfMonetization>total_maximum){
        //         setdaysOfMonetization(Math.floor(total_maximum))
        //         Swal.fire({
        //             icon:'warning',
        //             title:'Oops...',
        //             html:'Number of applied days exceed to limit !'
        //         })
        //     }
        // }
        // var total_maximum2 = Math.floor(availableVL)>=limit?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0;
        // if(total_maximum2 >0){
        //     var total_vl;
        //     var total_sl;
        //     /**
        //      * check if has applied VL within the current year
        //      */
        //     if(hasAppliedVL >= 5){
        //         /**
        //          * check again if selected number of days of monenitization is greater than to available vl, if greater than means include SL for deduction
        //          */
        //         if(daysOfMonetization>availableVL){
        //             total_vl = Math.floor(availableVL);
        //             total_sl = daysOfMonetization-Math.floor(availableVL)
        //         }else{
        //             total_vl = daysOfMonetization;
        //             total_sl = 0;
        //         }

        //     }else{
        //         if(daysOfMonetization>(Math.floor(availableVL)>=5?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0)){
        //             total_vl = Math.floor(availableVL)>=limit?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0;
        //             total_sl = daysOfMonetization-(availableVL>=5?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0)
        //         }else{
        //             total_vl = daysOfMonetization;
        //             total_sl = 0;
        //         }
        //     }
        //     settotalVL(total_vl)
        //     settotalSL(total_sl)
        // }
        // setappliedOthersDays(daysOfMonetization)
    },[daysOfMonetization])
    const checkMonetizationAboveHalf = () => {
        // var total_maximum;
        // var limit = hasAppliedVL>=5?0:5-hasAppliedVL;
        
        // if(hasAppliedVL >= 5){
        //     // var total_maximum = Math.floor((availableVL+availableSL)/2);
        //     var total_maximum = (Math.floor(formatSubtractCreditAvailableDecimal(availableVL,0))+Math.floor(availableSL))/2
            
        // }else{
        //     var total_maximum;
        //     if(availableVL>=limit){
        //         total_maximum = (Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit))+Math.floor(availableSL))/2;
        //     }else{
        //         total_maximum = Math.floor(availableSL)/2
        //     }
            
        // }
        // var monetization = total_maximum;

        // if(daysOfMonetization>=monetization){
        //     return(
        //         <Grid item xs={12} sm={12} md={12} lg={12}>
        //             <Tooltip title="Please upload a PDF/Image File" placement='top'>
        //             <TextField type = "file" label="Letter of Request *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'}}}/>
        //             </Tooltip>
        //         </Grid>
        //     )
        // }else{
        //     return null
        // }
        var total_sl_vl = (availableVL+availableSL)/2;
        // var total_sl_vl = ((availableVL-(totalVL+5))+availableSL)/2;
        var t_total_sl_vl = totalVL+totalSL;
        if(parseInt(daysOfMonetization)>=total_sl_vl || totalSL>0){
            return(
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Tooltip title="Please upload a PDF/Image File" placement='top'>
                    <TextField type = "file" label="Letter of Request *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'}}}/>
                    </Tooltip>
                </Grid>
            )
        }else{
            return null
        }
    }
    const handlesetisInludeSLMonetization = ()=>{
        setisInludeSLMonetization(!isInludeSLMonetization)
        if(hasAppliedVL >= 5){
            setdaysOfMonetization(Math.floor(availableVL))
        }else{
            if(availableVL>=5){
                setdaysOfMonetization(Math.floor(formatSubtractCreditAvailableDecimal(availableVL,5)))
            }else{
                setdaysOfMonetization(0);
            }
            // setdaysOfMonetization(availableVL>=5?availableVL-5:0)
        }
    }
    const monetizationVLFormat = () => {
        // var hasAppliedVL = hasAppliedVL?availableVL:availableVL>=5?availableVL-5:0}
        if(hasAppliedVL >= 5){
            return availableVL;
        }else{
            var limit = 5 - hasAppliedVL
            if(availableVL>=limit){
                return formatSubtractCreditAvailableDecimal(availableVL,limit)
            }else{
             return 0;
            }
        }
        // if(availableVL<=5){
        //     return 0;
        // }else{
        //     return (Math.floor(availableVL-5))
        // }
    }
    const handleMonetizationValue = (value) =>{
        if(value.target.value >=0){
            var arr = value.target.value.split('.')
            setdaysOfMonetization(arr[0])
        }else{
            setdaysOfMonetization(0)
        }
    }
    const handleRehabDates = (data)=>{
        setRehabilitationDates(data)
        
    }
    const paternityMaxDate = ()=>{
        let temp;
        let hasSched;
        let date = new Date(paternityChildDOB);
        let count = 0;
        while(count<=60){
            workScheduleData.forEach(el=>{
                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                    temp=el.details;
                }
            })
            if(temp){
                temp.forEach(el2=>{
                    if(el2.day ===moment(new Date(date)).format('D')){
                        count++;
                    }
                })
            }
            date.setDate(date.getDate()+1)
        }
        // let endDate = moment(paternityChildDOB).businessAdd(60)._d;
        return date
    }
    const handleChangeSLPeriod = (value,index)=>{
        var temp = [...SLPeriodDays];
        // if(value.target.value === 'AM'){
        //     /**
        //      * Check if doubled AM period for the date
        //      */
        //     var has_doubled = false;
        //     temp.forEach(el=>{
        //         if(el.date === temp[index].date && el.period === 'AM'){
        //             has_doubled = true;
        //         }
        //     })
        //     console.log(has_doubled)
        //     // var t_arr = temp.filter((el)=>{
        //     //     return el.date === temp[index].date && el.period === 'AM'
        //     // })
        //     if(!has_doubled){
        //         temp.splice(index+1,0,{date:temp[index].date,period:'PM',disabled:true})
        //     }
        //     temp[index].period = value.target.value;

        // }else{
        //     temp[index].period = value.target.value;
        // }
        temp[index].period = value.target.value;
        setSLPeriodDays(temp)

        if(value.target.value === 'NONE'){
            /**
            check if old without pay date
             */
            var t_old_wopay = daysWithoutPay2.filter((el)=>{
                return temp[index].date === el.date
            })
            if(t_old_wopay.length >0){
                handleSortInclusiveDates()
            }
        }
    }
    const handleSetSLHalfDay = ()=>{
        setSLHalfDays(!SLHalfDays)
    }
    useEffect(()=>{
        if(!SLHalfDays){
            // setTotalSLPeriodDays(selectedInclusiveDates.length)
            handleSortInclusiveDates()
        }
    },[SLHalfDays])
    const handleSetSLPReason = (value)=>{
        setSLPReason(value);
        if(value){
            setSpecifyDetails(value.reason);
        }else{
            setSpecifyDetails('');
        }
    }
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
    }
    const handleRemoveFile = (index)=>{
        var t_file = [...multipleFileUpload];
        t_file.splice(index,1);
        setMultipleFileUpload(t_file)
    }
    const handleChildDOB = (val)=>{
        setPaternityChildDOB(val.target.value)
        var t_date = Date.parse(val.target.value);
        if(isNaN(t_date) === false){
            /**
                Check remaining credits base on date of birth of the child
            */
            var t_data = {
                dob:val.target.value
            }
            setapplicableDaysLoading(true)

            getRemainingPaternityCredits(t_data)
            .then(res=>{
                if(7-res.data === 0){
                    setisApplicableForFiling(false)
                }else{
                    setInclusiveDates([])
                    setPreviewInclusiveDates('')
                    setdaysPeriod(7-res.data)
                    setapplicableDays(7-res.data)
                    setisApplicableForFiling(true)
                }
                setapplicableDaysLoading(false)

            })
        }
    }
    const showLeaveDetailsApplication = ()=>{
        switch(leaveType){
            /**
             * Vacation Leave
             * Force Leave
             * 
             */
            case 1:
            case 2:
            return(
            <>
            {/* <TextField type = 'date' label='No. of Days to Apply' InputLabelProps={{ shrink: true }} fullWidth/> */}
            {/* <DatePicker onChange={onChange} value={value} /> */}
            {
                leaveType === 2 && props.appliedFL === 5
                ?
                null
                :
                <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                <br/>
                <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                        Details of Application
                </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <DatePicker
                        value = {selectedInclusiveDates}
                        onChange = {handleSetInclusiveDates}
                        multiple
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        // style={{
                        //     width: "100%",
                        //     boxSizing: "border-box",
                        //     height: "26px"
                        //   }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{

                                hasSched = false;
                            }
                            
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            if(!hasSched) props.disabled=true
                            if(leaveType===2){
                                if(selectedInclusiveDates.length>=balance-1) props.disabled=true
                            }
                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        disabled = {leaveType ===2? parseInt(balance)<=0 ?true:false:false}
                        
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedInclusiveDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    {previewInclusiveDates.length !==0
                    ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    :
                    ''
                    }
                    </>
            }
            
            </>
            )
            break;
            /**
             * Sick Leave
             */
            case 3:
                return(
                <>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{mt:1}}>
                        <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                            Details of Application
                        </Typography>
                        <Box sx={{display:'flex',alignItems:'center'}}>
                        <Alert severity="error" sx={{mt:1,textAlign:'justify'}}>Please seperate the application of late filing from with pay and with out pay.</Alert>
                        </Box>
                </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    {/* <TextField type = 'date' label='No. of Days to Apply' InputLabelProps={{ shrink: true }} fullWidth/> */}
                    {/* <DatePicker onChange={onChange} value={value} /> */}
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <DatePicker
                        value = {selectedInclusiveDates}
                        onChange = {handleSetInclusiveDates}
                        multiple
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        // style={{
                        //     width: "100%",
                        //     boxSizing: "border-box",
                        //     height: "26px"
                        //   }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            // let isWeekend = [0, 6].includes(date.weekDay.index)
                            // if (isWeekend) props.className = "highlight highlight-red"
                            let isHoliday = false;
                            let holiday_desc;
                            if(moment(new Date(date)).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')){
                                 props.disabled=true;
                            }
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }

                            var len = alreadyAppliedDaysPeriod.length;
                            var i = 0;
                            var period='';
                            var t_period = 0;
                            for(i;i<len;i++){
                                if(moment(alreadyAppliedDaysPeriod[i].date).format('MM-DD-YYYY') === moment(new Date(date)).format('MM-DD-YYYY')){
                                    period = alreadyAppliedDaysPeriod[i].period;
                                    t_period++;
                                }
                            }
                            if(period !== '' ){
                                if(t_period<=1){
                                    props.disabled=false;
                                    props.title='already applied - '+period;
                                    props.className = "highlight-orange"
                                }else{
                                    props.disabled=true;
                                    props.title='already applied - AM PM';
                                    // props.className = "highlight-orange"
                                }
                                

                            }else{
                                // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                                /**
                                * 
                                Check if cancelled dates
                                */
                                let isDisabled = false;
                                if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                    isDisabled = false;
                                }else{
                                    isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                                }
                                if(isDisabled) props.disabled=true
                                if(isDisabled) props.title='already applied'
                                
                                if(isDisabled) props.disabled=true
                            }
                            if(moment(slNoPay,'YYYY-MM-DD').format('YYYY-MM-DD')>=moment(new Date(date),'YYYY-MM-DD').format('YYYY-MM-DD')){
                                    props.className = "highlight highlight-red"
                                    props.title ='Without Pay'
                            }

                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{
                                hasSched = false;
                            }
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(!hasSched) props.disabled=true
                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedInclusiveDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid> */}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {parseFloat(usedSL)+parseFloat(slTotalWithoutPay)+parseFloat(borrowedVL)} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    {/* {
                        selectedInclusiveDates.length >5
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Tooltip title="Please upload a PDF/Image File" placement='top'>
                            <TextField type = "file" label="Medical Certificate / Affidavit*" fullWidth InputLabelProps={{shrink:true}} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} onChange = {handleSLFile} disabled={leaveDetails.length !== 0 ?false:true}/>
                            </Tooltip>
                        </Grid> 
                        :
                        ''
                    } */}
                    {
                        slAttachment || (usedSL+slTotalWithoutPay+borrowedVL)>5
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Tooltip title="Please upload a PDF/Image File" placement='top'>
                            <TextField type = "file" label="Medical Certificate / Affidavit*" fullWidth InputLabelProps={{shrink:true}} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} onChange = {handleSLFile} disabled={leaveDetails.length !== 0 ?false:true}/>
                            </Tooltip>
                        </Grid> 
                        :
                        ''

                    }
                    {previewInclusiveDates.length !==0
                    ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    :
                    ''
                    }
                    
                    {
                        SLHasPeriodDays
                        ?
                        <Grid item xs={12}>
                        <small style={{color:'green',fontWeight:'bold'}}><em>Inclusive dates with pay</em></small>
                        {
                            // SLPeriodDays.map((row,key)=>
                            // <Typography key = {key}>{moment(row.date).format('MMMM DD,YYYY')} - {row.period}</Typography>
                            
                            // )
                            SLPeriodDays.map((row,key)=>
                                <FormControl fullWidth key = {key} sx={{mt:1}}>
                                    <InputLabel id="sl-half-day-label">{moment(row.date,'MM-DD-YYYY').format('MMMM DD,YYYY')}</InputLabel>
                                    <Select
                                    labelId="sl-half-day-label"
                                    id="sl-half-day-label"
                                    value={row.period}
                                    label={moment(row.date,'MM-DD-YYYY').format('MMMM DD,YYYY')}
                                    onChange={(value)=>handleChangeSLPeriod(value,key)}
                                    disabled={row.disabled}

                                    >
                                    <MenuItem value={'AM'}>AM</MenuItem>
                                    <MenuItem value={'PM'}>PM</MenuItem>
                                    <MenuItem value={'NONE'}>NONE</MenuItem>
                                    </Select>
                                </FormControl>
                            

                            )
                        }
                        </Grid>

                        :
                        SLPeriodDays.length !==0
                        ?
                            totalSLPeriodDays > 1 || SLHalfDays
                            ?
                            <Grid item xs={12} sx ={{display:'flex',justifyContent:'space-between'}}>

                                <FormControlLabel control={<Checkbox checked={SLHalfDays} onChange = {handleSetSLHalfDay}/>} label="Select half day/s" />
                                <Tooltip title = 'Explain this'><IconButton color='primary' onClick={()=>setOpenSLExplainModal(true)}><HelpIcon/></IconButton></Tooltip>
                                <Modal
                                    open={openSLExplainModal}
                                    onClose={()=>setOpenSLExplainModal(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={explainSLModalstyle}>
                                    {/* <Typography id="modal-modal-title">
                                        NOTE: Follow this instruction to avoid disapproval of leave.
                                    </Typography> */}
                                    <Typography id="modal-modal-description" sx={{ mt: 2 ,textAlign:'justify'}}>
                                        Instruction: Please select a <strong>continuous date period </strong> <em>(based on your work schedule)</em> when selecting half day/s.
                                    </Typography>
                                    <Typography sx={{mt:1, fontSize:'.9rem',color:blue[800]}}>
                                    <strong>Ex. dates selected:</strong><br/>
                                        January 1, {moment(new Date()).format('YYYY')}, January 2, {moment(new Date()).format('YYYY')}, January 3, {moment(new Date()).format('YYYY')}
                                    </Typography>
                                    <Box sx={{display:'flex',justifyContent:'space-between'}}>
                                        <Box>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 ,fontSize:'.8rem'}}>
                                                <span style={{color:green[800]}}><strong>Do this</strong></span><CheckIcon color='success'/> <br/>
                                                January 1, {moment(new Date()).format('YYYY')} - PM <br/>
                                                January 2, {moment(new Date()).format('YYYY')} - NONE <br/>
                                                January 3, {moment(new Date()).format('YYYY')} - NONE <br/>
                                                <strong>= 2.5 days</strong>
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 ,fontSize:'.8rem'}}>
                                                <span style={{color:green[800]}}><strong>Do this</strong></span><CheckIcon color='success'/> <br/>
                                                January 1, {moment(new Date()).format('YYYY')} - PM <br/>
                                                January 2, {moment(new Date()).format('YYYY')} - NONE <br/>
                                                January 3, {moment(new Date()).format('YYYY')} - AM <br/>
                                                <strong>= 2 days</strong>
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                    <Box sx={{display:'flex',justifyContent:'space-between'}}>
                                        <Box>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 ,fontSize:'.8rem'}}>
                                                <span style={{color:red[800]}}><strong>Don't do this</strong></span> <CloseIcon color='error'/> <br/>
                                                January 1, {moment(new Date()).format('YYYY')} - AM <br/>
                                                January 2, {moment(new Date()).format('YYYY')} - AM <br/>
                                                January 3, {moment(new Date()).format('YYYY')} - NONE
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 ,fontSize:'.8rem'}}>
                                                <span style={{color:red[800]}}><strong>Don't do this</strong></span> <CloseIcon color='error'/> <br/>
                                                January 1, {moment(new Date()).format('YYYY')} - PM <br/>
                                                January 2, {moment(new Date()).format('YYYY')} - NONE <br/>
                                                January 3, {moment(new Date()).format('YYYY')} - PM
                                            </Typography>
                                        </Box>
                                    </Box>
                                    </Box>
                                </Modal>
                            </Grid>
                            :
                            null
                        :
                        null
                    }
                    
                    {
                        totalSLPeriodDays > 1 || SLHalfDays
                        ?
                        SLHalfDays
                        ?
                        <Grid item xs={12}>
                            <small style={{color:'green',fontWeight:'bold'}}><em>Inclusive dates with pay</em></small>

                            {
                                SLPeriodDays.map((row,key)=>
                                    <FormControl fullWidth key = {key} sx={{mb:1,mt:1}}>
                                        <InputLabel id="sl-half-day-label">{moment(row.date).format('MMMM DD,YYYY')}</InputLabel>
                                        <Select
                                        labelId="sl-half-day-label"
                                        id="sl-half-day-label"
                                        value={row.period}
                                        label={moment(row.date).format('MMMM DD,YYYY')}
                                        onChange={(value)=>handleChangeSLPeriod(value,key)}
                                        disabled={row.disabled}

                                        >
                                        <MenuItem value={'AM'}>AM</MenuItem>
                                        <MenuItem value={'PM'}>PM</MenuItem>
                                        <MenuItem value={'NONE'}>NONE</MenuItem>
                                        </Select>
                                    </FormControl>

                                )
                            }
                    
                        </Grid>
                        :
                        null
                        :
                        null
                    }
                    {
                        daysWithoutPay.length !==0
                        ?
                        <Grid item xs={12}>
                        <small style={{color:'red',fontWeight:'bold'}}><em>Inclusive dates without pay</em></small>
                        <br/>
                        {
                            daysWithoutPay.map((row,key)=>
                            <FormControl fullWidth key = {key} sx={{mb:1,mt:1}}>
                                <InputLabel id="sl-half-day-label">{moment(row.date,'MM-DD-YYYY').format('MMMM DD,YYYY')}</InputLabel>
                                <Select
                                labelId="sl-half-day-label"
                                id="sl-half-day-label"
                                value={row}
                                label={moment(row.date,'MM-DD-YYYY').format('MMMM DD,YYYY')}
                                // onChange={(value)=>handleChangeSLPeriod(value,key)}
                                disabled
                                >
                                <MenuItem value={row}>{row.period}</MenuItem>
                                </Select>
                            </FormControl>
                        )
                        }
                        </Grid>
                        :
                        null
                    }
                </>
                )
                break;
            /**
             * Maternity leave
             */
            case 4:
                return(
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    {/* <TextField type = 'date' label='No. of Days to Apply' InputLabelProps={{ shrink: true }} fullWidth/> */}
                    {/* <DatePicker onChange={onChange} value={value} /> */}
                    <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Start Date*</Typography>
                    <Tooltip title="Calendar Days" placement='left'><InfoIcon sx={{color:'#609df7'}}/></Tooltip>
                    </Box>
                    <DatePicker
                        value = {selectedInclusiveMaternityDates}
                        onChange = {(val)=>setInclusiveMaternityDates(val)}
                        // plugins={[
                        // <DatePanel />
                        // ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            if (isWeekend) props.className = "highlight highlight-red"
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if(isDisabled) props.disabled=true
                            return props
                        }}
                        // onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {isAppliedAllocationOfMaternityLeave?daysPeriod-allocationInfo.allocated_days:daysPeriod} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    {previewInclusiveDates.length !==0
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                        </Grid>
                        :
                        ''
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload a PDF/Image File" placement='top'>
                        <TextField type = "file" label="Proof of pregnancy *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*,.pdf'} }} disabled={selectedInclusiveMaternityDates.length !== 0 ?false:true}/>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <FormGroup>
                    <FormControlLabel control={<Checkbox onChange = {handleIsAppliedAllocation}/>} label="Apply allocation of maternity leave" />
                    </FormGroup>
                    <Tooltip title ="Can be applied later, after approval of application." placement='left'>
                        <InfoIcon sx={{color:'#609df7'}}/>
                    </Tooltip>
                    </Grid>
                   
                    {
                        isAppliedAllocationOfMaternityLeave
                        ?
                        <>
                        <Grid item xs={12}>
                            <Button variant='outlined' fullWidth onClick = {()=>setOpenAllocation(true)}> Fillout Allocation Form</Button>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Tooltip title="Please upload a PDF/Image File" placement='top'>
                            <TextField type = "file" label="Accomplished Notice of Allocation of Maternity Leave Form*" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }}/>
                            </Tooltip>
                        </Grid> */}
                        </>

                        :
                        ''
                    }
                    
                    
                    </>
                    )
                    break;
            /**
             * Paternity Leave
             */
            case 5:
                return(
                    <>
                    {
                    canApplyPaternity
                    ?
                    <Grid item xs={12}>
                        <TextField type='date' label ="Child's date of birth" fullWidth InputLabelProps={{shrink:true}} value = {paternityChildDOB} onChange = {handleChildDOB}/>
                    </Grid>
                    :
                    null
                    }
                    
                    {
                    canApplyPaternity
                    ?
                    applicableDaysLoading
                    ?
                    <Grid item xs={12} sx={{ width:'100%'}}>
                        <Typography sx={{textAlign:'center'}}>Checking information. Please wait...</Typography>
                        <LinearProgress />
                    </Grid>
                    :
                        isApplicableForFiling === false
                        ?
                        <Grid item xs = {12}>
                            <Alert sx={{textAlign:'center'}} severity="warning">Maximum paternity leave limit reached !</Alert>
                        </Grid>
                        :
                        isApplicableForFiling === true
                            ?
                            <>
                                <Grid item xs={12}>
                                    <Typography sx={{background:blue[900],color:'#fff',padding:'10px 15px',boxShadow: '3px 5px 10px #08449d'}}>
                                    <span style={{display:'flex',gap:1,justifyContent:'center',alignItems:'center'}}> 
                                    Available Remaining Days: <strong> {applicableDays} </strong> Day/s<Tooltip title='Remaining days may vary on the specified birth of date'><IconButton color='info'><InfoIcon/></IconButton></Tooltip></span>
                                
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                <br/>
                                <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                                <DatePicker
                                    value = {selectedInclusiveDates}
                                    onChange = {handleSetInclusiveDates}
                                    multiple
                                    plugins={[
                                    <DatePanel />
                                    ]}
                                    // minDate={inclusiveMinDate()}
                                    // minDate={paternityChildDOB}
                                    minDate={new Date(moment(new Date()).add(1,'days').format('MM-DD-YYYY'))}
                                    maxDate={paternityMaxDate()}
                                    // render={<InputIcon/>}
                                    render={(value, openCalendar) => {
                                        return (
                                        <button onClick={openCalendar} className = "custom-inclusive-dates">
                                            <InputIcon/>
                                        </button>
                                        )
                                    }}
                                    // style={{
                                    //     width: "100%",
                                    //     boxSizing: "border-box",
                                    //     height: "26px"
                                    //   }}
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    mapDays={({ date }) => {
                                        let props = {}
                                        
                                        let isWeekend = [0, 6].includes(date.weekDay.index)
                                        // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                                        /**
                                        * 
                                        Check if cancelled dates
                                        */
                                        let isDisabled = false;
                                        if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                            isDisabled = false;
                                        }else{
                                            isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                                        }

                                        if (isWeekend) props.className = "highlight highlight-red"
                                        if(isDisabled) props.disabled=true
                                        if(selectedInclusiveDates.length >=daysPeriod) props.disabled=true
                                        
                                        let isHoliday = false;
                                        let holiday_desc;
                                        holidays.forEach(hol=>{
                                            let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                            let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                            let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                            if(target_date >=date_1 && target_date <= date_2){
                                                isHoliday = true;
                                                holiday_desc = hol.holiday_desc
                                            }

                                        })
                                        if (isHoliday){
                                            props.className = "highlight highlight-red holiday"
                                            props.title=holiday_desc
                                        }
                                        let temp;
                                        let hasSched;
                                        workScheduleData.forEach(el=>{
                                            if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                                temp=el.details;
                                            }
                                        })
                                        if(temp){
                                            temp.forEach(el2=>{
                                                if(el2.day ===moment(new Date(date)).format('D')){
                                                    hasSched = true
                                                }
                                            })
                                        }else{
                                            hasSched = false;
                                        }
                                        // if(isWeekend) props.className = "highlight highlight-red"
                                        if(!hasSched) props.disabled=true
                                        return props
                                    }}
                                    onClose = {handleSortInclusiveDates}
                                    // onOpen = {()=>setInclusiveDatesOpen(true)}
                                    
                                />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField label='No. of Days Applied' fullWidth  value = {selectedInclusiveDates.length} InputLabelProps={{ shrink: true }} readOnly />
                                </Grid>
                                {previewInclusiveDates.length !==0
                                ?
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                                </Grid>
                                :
                                ''
                                }
                                
                                {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Tooltip title="Please upload a PDF/Image File" placement='top'>
                                    <TextField type = "file" label="Proof of child's delivery / Marriage Certificate *" fullWidth InputLabelProps={{shrink:true}} InputProps={{ inputProps: { accept:'image/*,.pdf'}}} disabled={selectedInclusiveDates.length !== 0 ?false:true}/>
                                    </Tooltip>
                                </Grid> */}
                                <Grid item xs={12}>
                        <Typography sx={{fontSize:'.8rem'}}>Proof of child's delivery / Marriage Certificate *</Typography>
                        <label htmlFor={"contained-button-file"} style={{width:'100%'}} required>
                        <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)} multiple/>
                        
                        <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' }, flex: 1 ,height:55}}> {multipleFileUpload.length ===0?<Tooltip title='No file uploaded'><WarningAmberOutlinedIcon size='small' color='error'/></Tooltip>:''} <AttachFileOutlinedIcon fontSize='small'/>Upload File </Button>
                        </label>
                        {
                            multipleFileUpload.length>0
                            ?
                            <Grid item container sx={{display:'flex',justifyContent:'space-between'}}>
                            {
                                multipleFileUpload.map((row,key)=>
                                <Grid item xs={6} lg={4} sx={{border:'solid 1px #e9e9e9',borderRadius:'20px',pl:1}}>
                                <small style={{display:'flex',justifyContent:'space-between',alignItems:'center', fontSize:'.7rem'}} key={key}>{row.filename} <Tooltip title='Remove file'><IconButton onClick={()=>handleRemoveFile(key)}><DeleteIcon color='error' sx={{fontSize:'15px'}}/></IconButton></Tooltip></small>
                                </Grid>
                                
                            )}
                            </Grid>
                            :
                            null
                        }
                        </Grid>
                                </>
                            :
                            ''
                            // <Grid item xs={12} sx={{ display: 'flex',flexDirection:'row',justifyContent:'center' }}>
                            //     <CircularProgress />
                            // </Grid>
                    :
                    <Grid item xs = {12}>
                        <Alert sx={{textAlign:'center'}} severity="warning">Paternity is only available for married men. Please update your PDS.</Alert>
                    </Grid>
                    }
                    </>
                    )
                break;
            /**
             * Special Privilege Leave
             */
            case 6:
                return(
                <>
                {
                applicableDaysLoading
                ?
                <Grid item xs={12} sx={{ width:'100%'}}>
                    <Typography sx={{textAlign:'center'}}>Checking information. Please wait...</Typography>
                    <LinearProgress />
                </Grid>
                :
                isApplicableForFiling === false
                ?
                <Grid item xs = {12}>
                        <Alert sx={{textAlign:'center'}} severity="warning">You have already reach the limit number of days per year for Special Privilege Leave ! Please cancel your application if you want to change your application (this is only applicable if the status of your application is 'FOR REVIEW')</Alert>
                    </Grid>
                :
                    isApplicableForFiling === true
                    ?
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                            <br/>
                            <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label={'No. of available days for the year '+moment(new Date()).format('YYYY')} fullWidth  value = {applicableDays} InputLabelProps={{ shrink: true }} readOnly/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl fullWidth>
                            <InputLabel id="slp-hours-select-label">No. of Days to Apply</InputLabel>
                            <Select
                                labelId="slp-hours-select-label"
                                id="slp-hours-select"
                                value={selectedSPL}
                                label="No. of Days to Apply"
                                // onChange={handleChange}
                                onChange={(value) => setselectedSPL(value.target.value)}
                                // onBlur ={(val)=>checkCTOHours(val.target.value)}
                            >
                                {splDropdown.map((data,key)=>
                                    <MenuItem key = {key} value ={data}>{data}</MenuItem>
                                )}
                            </Select>
                            </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <DatePicker
                        value = {selectedInclusiveDates}
                        onChange = {handleSetInclusiveDates}
                        multiple
                        plugins={[
                        <DatePanel />
                        ]}
                        // minDate={inclusiveSPLMinDate()}
                        minDate={SLPminDate}

                        maxDate={SLPmaxDate}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        // style={{
                        //     width: "100%",
                        //     boxSizing: "border-box",
                        //     height: "26px"
                        //   }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            /**
                             * 
                             Check if cancelled dates
                             */
                            
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if(moment(new Date(date)).format('MM-DD-YYYY') === moment().format('MM-DD-YYYY')){
                                isDisabled = true;
                            }
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            
                            var len = alreadyAppliedDaysPeriod.length;
                            var i = 0;
                            var period='';
                            var t_period = 0;
                            for(i;i<len;i++){
                                if(moment(alreadyAppliedDaysPeriod[i].date).format('MM-DD-YYYY') === moment(new Date(date)).format('MM-DD-YYYY')){
                                    period = alreadyAppliedDaysPeriod[i].period;
                                    t_period++;
                                }
                            }
                            if(period !== '' ){
                                if(t_period<=1){
                                    props.disabled=false;
                                    props.title='already applied - '+period;
                                    props.className = "highlight-orange"
                                }else{
                                    props.disabled=true;
                                    props.title='already applied - AM PM';
                                    // props.className = "highlight-orange"
                                }
                                

                            }else{
                                // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                                /**
                                * 
                                Check if cancelled dates
                                */
                                let isDisabled = false;
                                if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                    isDisabled = false;
                                }else{
                                    isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                                }
                                if(isDisabled) props.disabled=true
                                if(isDisabled) props.title='already applied'
                                
                                if(isDisabled) props.disabled=true
                            }
                            var days = Math.round(selectedSPL/1);
                            if(splDropdown.length ===0){
                                props.disabled = true;
                            }else{
                                if(selectedInclusiveDates.length>=days)
                                props.disabled = true;
                            }
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{
                                hasSched = false;
                            }
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(!hasSched) props.disabled=true

                            /**
                            disable dates from current date to 5 days based on work schedule
                             */
                            // var t_date_start = moment(new Date()).format('YYYY-MM-DD');
                            // var t_date_end = moment(inclusiveMinDate()).format('YYYY-MM-DD');
                            // // console.log(inclusiveMinDate())
                            // if(moment(new Date(date)).format('YYYY-MM-DD')>=t_date_start && moment(new Date(date)).format('YYYY-MM-DD')<t_date_end){
                            //     props.disabled=true
                            // }
                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                   <Grid item xs={12}>
                    <FormControl fullWidth>
                        {/* <InputLabel id="slp-reason-label">Specify Reason *</InputLabel>
                            <Select
                            labelId="slp-reason-label"
                            id="slp-reason-label"
                            value={SLPReason}
                            label="Specify Reason *"
                            onChange={(value)=>setSLPReason(value.target.value)}
                            >
                            {
                                SLPReasonsData.map((data,key)=>
                                    <MenuItem value={data} key = {key}>{data.reason}&nbsp; <small style={{color:orange[800],display:data.reason_desc?'block':'none'}}>({data.reason_desc})</small></MenuItem>
                                )
                            }
                            </Select> */}
                             <Autocomplete
                                id="slp-reason-select"
                                // sx={{ width: 300 }}
                                options={SLPReasonsData}
                                value={SLPReason}
                                onChange={(event, newValue) => {
                                    handleSetSLPReason(newValue)
                                }}
                                freeSolo
                                getOptionLabel={(option) =>
                                    option.reason
                                    ?
                                    option.reason
                                    :
                                    'Select reason...'
                                }
                                isOptionEqualToValue={(option, value) => option.slp_reason_id === value.slp_reason_id }
                                renderOption={(props, option) => (
                                    option.type === SLPReasonType
                                    ?
                                    <Box {...props}>
                                    {option.reason}&nbsp; <small style={{color:orange[800],display:option.reason_desc?'block':'none'}}>({option.reason_desc})</small>
                                    </Box>
                                    :
                                    ''
                                )}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Specify Reason *"d
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    }}
                                    />
                                )}
                                disabled = {SLPReasonType.length === 0?true:false}
                                inputProps={{required:true}}
                                />
                        </FormControl>
                   </Grid>
                    {previewInclusiveDates.length !==0
                    ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    :
                    ''
                    }
                    {/* {
                    tempSelectedSPLInclusiveDates.length !==0
                    ?
                        selectedSPL%1
                        ?
                            tempSelectedSPLInclusiveDates.map((data,key)=>
                            <Grid item xs={12} sm={12} md = {12} lg ={12} key = {key}>
                                {
                                    key === 0
                                    ?
                                    <Typography sx={{color:'#353232',fontSize:'.8em',marginBottom:'7px'}}>Select date period *</Typography>
                                    :
                                    ''
                                }
                                <FormControl fullWidth disabled = {data.disabled ? true:false}>
                                <InputLabel id="demo-simple-select-label"> {moment(data.date.toDate()).format('MMMM DD, YYYY')} Period</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.period}
                                    label={moment(data.date.toDate()).format('MMMM DD, YYYY')+" Period"}
                                    onChange={(value) => handleSPLPeriodChange(value.target.value,key)}
                                >
                                    <MenuItem value='AM'>AM</MenuItem>
                                    <MenuItem value='PM'>PM</MenuItem>
                                    <MenuItem value=''>NONE</MenuItem>
                                </Select>
                                </FormControl>
                            </Grid>

                            )
                        :
                        ''
                        
                    :
                    ''
                    } */}
                    </>
                    :
                    <Grid item xs={12} sx={{ display: 'flex',flexDirection:'row',justifyContent:'center' }}>
                        <CircularProgress />
                    </Grid>

                }
                
                
                </>
                )
                break;
            /**
             * Solo Parent Leave
             */
            case 7:
                    return(
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    {/* <TextField type = 'date' label='No. of Days to Apply' InputLabelProps={{ shrink: true }} fullWidth/> */}
                    {/* <DatePicker onChange={onChange} value={value} /> */}
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <DatePicker
                        value = {selectedInclusiveDates}
                        onChange = {handleSetInclusiveDates}
                        multiple
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        // style={{
                        //     width: "100%",
                        //     boxSizing: "border-box",
                        //     height: "26px"
                        //   }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            if(selectedInclusiveDates.length>=daysPeriod) props.disabled=true
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{
                                hasSched = false;
                            }
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(!hasSched) props.disabled=true
                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedInclusiveDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload the latest ID with PDF/Image file format" placement='top'>
                        <TextField type = "file" label="Solo Parent ID *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} disabled={selectedInclusiveDates.length !== 0 ?false:true}/>
                        </Tooltip>
                    </Grid>
                    {previewInclusiveDates.length !==0
                    ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    :
                    ''
                    }
                    </>
                    )
                    break;
            /**
             * Study leave
             */
             case 8:
                return(
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <Tooltip title="Calendar Days" placement='left'><InfoIcon sx={{color:'#609df7'}}/></Tooltip>
                    </Box>
                    <DatePicker
                        value = {selectedStudyDates}
                        onChange = {(val)=>setSelectedStudyDates(val)}
                        range
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            return props
                        }}
                        // onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedRehabilitationDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid> */}
                    {previewInclusiveDates.length !==0
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                        </Grid>
                        :
                        ''
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload a PDF/Image File" placement='top'>
                        <TextField type = "file" label="Supporting Document *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*,.pdf'} }} disabled={selectedStudyDates.length >1 ?false:true}/>
                        </Tooltip>
                    </Grid>
                    </>
                    )
                    break;
            /**
             * VAWC leave
             */
            case 9:
                return(
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Start Date*</Typography>
                    <Tooltip title="Working Days" placement='left'><InfoIcon sx={{color:'#609df7'}}/></Tooltip>
                    </Box>
                    <DatePicker
                        value = {selectedInclusiveDates}
                        onChange = {handleSetInclusiveDates}
                        // value = {selectedInclusiveVAWCDates}
                        // onChange = {(val)=>setInclusiveVAWCDates(val)}
                        multiple
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if (isWeekend) props.disabled=true
                            if(isDisabled) props.disabled=true
                            if(selectedInclusiveDates.length >=daysPeriod) props.disabled=true
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{
                                hasSched = false;
                            }
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(!hasSched) props.disabled=true
                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedInclusiveDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    {previewInclusiveDates.length !==0
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                        </Grid>
                        :
                        ''
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload a PDF/Image File" placement='top'>
                        <TextField type = "file" label="Supporting Document *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*,.pdf'} }} disabled={selectedInclusiveDates.length !== 0 ?false:true}/>
                        </Tooltip>
                    </Grid>
                    </>
                    )
                    break;
            /**
             * Rehabilitation leave
             */
             case 10:
                return(
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <Tooltip title="Calendar Days" placement='left'><InfoIcon sx={{color:'#609df7'}}/></Tooltip>
                    </Box>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}><small><em>Please select two dates (from and to)</em></small></Typography>

                    <DatePicker
                        value = {selectedRehabilitationDates}
                        onChange = {(val)=>handleRehabDates(val)}
                        // multiple
                        range
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{
                                hasSched = false;
                            }
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(!hasSched) props.disabled=true
                            // if(selectedInclusiveMaternityDates.length >=10) props.disabled=true
                            return props
                        }}
                        // onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedRehabilitationDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid> */}
                    {previewInclusiveDates.length !==0
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                        </Grid>
                        :
                        ''
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload a PDF/Image File" placement='top'>
                        <TextField type = "file" label="Supporting Document *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*,.pdf'} }} disabled={selectedRehabilitationDates.length >1 ?false:true}/>
                        </Tooltip>
                    </Grid>
                    </>
                    )
                    break;
            /**
             * Special leave benefits for women
             */
             case 11:
                return(
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <Tooltip title="Calendar Days" placement='left'><InfoIcon sx={{color:'#609df7'}}/></Tooltip>
                    </Box>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}><small><em>Please select two dates (from and to)</em></small></Typography>

                    <DatePicker
                        value = {selectedBenefitForWomenDates}
                        onChange = {(val)=>setselectedBenefitForWomenDates(val)}
                        // multiple
                        range
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{
                                hasSched = false;
                            }
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(!hasSched) props.disabled=true
                            // if(selectedInclusiveMaternityDates.length >=10) props.disabled=true
                            return props
                        }}
                        // onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedRehabilitationDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid> */}
                    {previewInclusiveDates.length !==0
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                        </Grid>
                        :
                        ''
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload a PDF/Image File" placement='top'>
                        <TextField type = "file" label="Supporting Document *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*,.pdf'} }} disabled={selectedBenefitForWomenDates.length >1 ?false:true}/>
                        </Tooltip>
                    </Grid>
                    </>
                    )
                    break;
            /**
             * Special emergency Leave
             */
             case 12:
                return(
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <DatePicker
                        value = {selectedInclusiveDates}
                        onChange = {handleSetInclusiveDates}
                        multiple
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        // style={{
                        //     width: "100%",
                        //     boxSizing: "border-box",
                        //     height: "26px"
                        //   }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            /**
                             * 
                             Check if cancelled dates
                             */
                            let isDisabled = false;
                            if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                                isDisabled = false;
                            }else{
                                isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            }
                            if (isWeekend) props.disabled = true
                            if(isDisabled) props.disabled=true
                            if(selectedInclusiveDates.length >=daysPeriod) props.disabled=true
                            let isHoliday = false;
                            let holiday_desc;
                            holidays.forEach(hol=>{
                                let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                                let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                                let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                                if(target_date >=date_1 && target_date <= date_2){
                                    isHoliday = true;
                                    holiday_desc = hol.holiday_desc
                                }

                            })
                            if (isHoliday){
                                props.className = "highlight highlight-red holiday"
                                props.title=holiday_desc
                            }
                            let temp;
                            let hasSched;

                            workScheduleData.forEach(el=>{
                                if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                    temp=el.details;
                                }
                            })
                            if(temp){
                                temp.forEach(el2=>{
                                    if(el2.day ===moment(new Date(date)).format('D')){
                                        hasSched = true
                                    }
                                })
                            }else{
                                hasSched = false;
                            }
                            // if(isWeekend) props.className = "highlight highlight-red"
                            if(!hasSched) props.disabled=true
                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedInclusiveDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    {previewInclusiveDates.length !==0
                    ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    :
                    ''
                    }
                    
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload a PDF/Image File" placement='top'>
                        <TextField type = "file" label="Supporting Document *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} disabled={selectedInclusiveDates.length !== 0 ?false:true}/>
                        </Tooltip>
                    </Grid>
                    </>
                    )
                break;
            /**
             * Others
             */
            case 15:
                /**
                 * Monetization
                 */
                if(leaveDetails === 9){
                    return(
                        <>
                        {availableVL+availableSL === 0
                        ?
                        ''
                        :
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        <br/>
                        <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                        </Grid>
                        <Grid item xs ={12}>
                            <table className='table'>
                                <thead style={{background:'#1976d2',color:'#fff',border:'solid 2px #fff'}}>
                                    <tr>
                                        <th>
                                        Type of Leave 
                                        </th>
                                        <th>
                                            Available
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Vacation Leave
                                        </td>
                                        <td>
                                        {monetizationVLFormat()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Sick Leave
                                        </td>
                                        <td>
                                        {availableSL}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        {/* {hasAppliedVL >= 5
                        ?
                        ''
                        :
                        <Grid item xs={12}>
                            <Alert severity="info"><small><em> <strong>Note:</strong> You still have not availed a {5-hasAppliedVL} VL/FL (Approved application) as of today, so a number of {5-hasAppliedVL} day/s will be reserved for your <strong>Force Leave</strong>.</em></small></Alert>
                        </Grid>
                        } */}
                        
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                        <FormGroup>
                        <FormControlLabel control={<Checkbox onChange = {handlesetisInludeSLMonetization}/>} label="Include SL from deduction" />
                        </FormGroup>
                        </Grid> */}
                        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='No. of Days To Apply' type='number' fullWidth InputProps={{ inputProps: { inputMode: 'numeric', pattern: '[0-9]*',
                            max:
                            hasAppliedVL >= 5
                            ?
                                isInludeSLMonetization
                                ?
                                availableVL+availableSL
                                :
                                availableVL
                            :
                                isInludeSLMonetization
                                ?
                                (Math.floor(formatSubtractCreditAvailableDecimal(availableVL,5))+Math.floor(availableSL))/2
                                :
                                availableVL-5
                            ,min:0} }} onChange = {(val)=>setdaysOfMonetization(val.target.value)} value = {daysOfMonetization}/>
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {/* <TextField label='No. of Days To Apply' type='number' fullWidth InputProps={{ inputProps: { inputMode: 'numeric', pattern: '[0-9]*',
                            max:
                            hasAppliedVL >= 5
                            ?
                            (formatSubtractCreditAvailableDecimal(availableVL,5)+availableSL)/2
                            :
                            (formatSubtractCreditAvailableDecimal(availableVL,5-hasAppliedVL)+availableSL)/2
                            ,min:0}}} onChange = {handleMonetizationValue} value = {daysOfMonetization}/> */}
                            <TextField label='No. of Days To Apply' type='number' fullWidth InputProps={{ inputProps: { inputMode: 'numeric', pattern: '[0-9]*',
                            max:
                            hasAppliedVL >= 5
                            ?
                            (formatSubtractCreditAvailableDecimal(availableVL,5)+availableSL)
                            :
                            (formatSubtractCreditAvailableDecimal(availableVL,5-hasAppliedVL)+availableSL)
                            ,min:0}}} onChange = {handleMonetizationValue} value = {daysOfMonetization}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{background:'#d32f2f',color:'#fff',textAlign:'center',padding:'10px',borderTopLeftRadius: '10px',borderTopRightRadius: '10px'}}>Leave Credits Deduction Table</Typography>
                            <table className='table table-bordered'>
                                <thead style={{textAlign:'center'}}>
                                    <tr>
                                        <th>
                                            VL
                                        </th>
                                        <th>
                                            SL
                                        </th>
                                    </tr>
                                </thead>
                                <tbody style={{textAlign:'center'}}>
                                    <tr>
                                        <td>{totalVL}</td>
                                        <td>{totalSL}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        {checkMonetizationAboveHalf()}
                        </>
                        }
                        
                        </>
                        )
                }else if(leaveDetails === 10){
                    /**
                     * Terminal Leave
                     */
                    return(
                        <>
                        {
                            availableVL+availableSL === 0
                            ?
                            ''
                            :
                            <>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <br/>
                                <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                                </Grid>
                                <Grid item xs ={12}>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>
                                                    Leave Type
                                                </th>
                                                <th>
                                                    Available
                                                </th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    Vacation Leave
                                                </td>
                                                <td>
                                                {availableVL}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Sick Leave
                                                </td>
                                                <td>
                                                {availableSL}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField label='Total Leave Balance' value={availableVL+availableSL} fullWidth InputLabel={{shrink:true}} readOnly/>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Tooltip title="Please upload a PDF/Image File" placement='top'>
                                    <TextField type = "file" label="Supporting Docs *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'}}}/>
                                    </Tooltip>
                                </Grid>
                            </>
                        }
                        
                        </>
                        )
                }else{
                    return null;
                }
                
                break;
            /**
             * CTO
             */
            case 14:
                return(
                <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                <Grid item xs={12}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Select Month to Apply *</Typography>
                    <DatePicker
                        onlyMonthPicker
                        value = {currentMonth}
                        onChange={handleCurrentMonth}
                        containerStyle={{
                            width: "100%"
                        }}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            
                            )
                        }}
                        minDate = {new Date()}
                    />
                </Grid>   
                
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormControl fullWidth>
                        <InputLabel id="cto-hours-select-label">No. of Hours to Apply</InputLabel>
                        <Select
                            labelId="cto-hours-select-label"
                            id="cto-hours-select"
                            value={CTOHours}
                            label="No. of Hours to Apply"
                            // onChange={handleChange}
                            onChange={handleSetCTOHours}
                            // onBlur ={(val)=>checkCTOHours(val.target.value)}
                        >
                            {CTOHoursDropdown.map((data,key)=>
                                <MenuItem key = {key} value ={data}>{data} {CTOHoursToDays(data)}</MenuItem>
                            )}
                        </Select>
                        </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                <DatePicker
                    value = {selectedCTOInclusiveDates}
                    onChange = {handleSetCTOInclusiveDates}
                    multiple
                    plugins={[
                    <DatePanel />
                    ]}
                    minDate={minCTODate}
                    maxDate={maxCTODate}
                    currentDate={currentMonth}
                    // render={<InputIcon/>}
                    render={(value, openCalendar) => {
                        return (
                        <button onClick={openCalendar} className = "custom-inclusive-dates">
                            <InputIcon/>
                        </button>
                        
                        )
                    }}
                    // style={{
                    //     width: "100%",
                    //     boxSizing: "border-box",
                    //     height: "26px"
                    //   }}
                    containerStyle={{
                        width: "100%"
                    }}
                    mapDays={({ date }) => {
                        let props = {}
                        let isWeekend = [0, 6].includes(date.weekDay.index)
                        // let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                        /**
                        * 
                        Check if cancelled dates
                        */
                        let isDisabled = false;
                        if(cancelledDates?.includes(moment(new Date(date)).format('MM-DD-YYYY'))){
                            isDisabled = false;
                        }else{
                            isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                        }
                        // if (isWeekend) props.className = "disabled-date"
                        if (isWeekend) props.className = "highlight highlight-red"

                        var days = Math.round(CTOHours/8);
                        // if(CTOHoursDropdown.length ===0){
                        //     props.disabled = true;
                        // }else{
                            
                        // }
                        let isHoliday = false;
                        let holiday_desc;
                        holidays.forEach(hol=>{
                            let date_1 = moment(new Date(hol.holiday_date1)).format('YYYY-MM-DD');
                            let date_2 = moment(new Date(hol.holiday_date2)).format('YYYY-MM-DD');
                            let target_date = moment(new Date(date)).format('YYYY-MM-DD');

                            if(target_date >=date_1 && target_date <= date_2){
                                isHoliday = true;
                                holiday_desc = hol.holiday_desc
                            }

                        })
                        if (isHoliday){
                            props.className = "highlight highlight-red holiday"
                            props.title=holiday_desc
                        }
                        let temp;
                        let hasSched;

                        workScheduleData.forEach(el=>{
                            if(el.month === parseInt(moment(new Date(date)).format('M')) && el.year === parseInt(moment(new Date(date)).format('YYYY'))){
                                temp=el.details;
                            }
                        })
                        if(temp){
                            temp.forEach(el2=>{
                                if(el2.day ===moment(new Date(date)).format('D')){
                                    hasSched = true
                                }
                            })
                        }else{
                            hasSched = false;
                        }
                        if(selectedCTOInclusiveDates.length>=5){
                            props.disabled = true;
                        }else{
                            if(selectedCTOInclusiveDates.length>=days){
                                props.disabled = true;
                            }
                        }
                        if(isDisabled) props.disabled=true;
                        if(!hasSched) props.disabled=true;
                        
                        // for(var i = 0 ;i<alreadyAppliedDays.length;i++){
                        //     if(moment(new Date(date)).format('MM-DD-YYYY') === alreadyAppliedDays[i]){
                        //         props.disabled = true;
                        //     }
                        // }
                        
                        return props
                    }}
                    onClose = {handleSortCTOInclusiveDates}
                    // disabled = {CTOHours !== '0' ? false:true}
                />
                </Grid>
                {/* <Grid item xs={12}>
                    <small style={{fontSize:'10px',float:'right'}}><em>*maximum of 40 hours per application</em></small>
                    <table className='table' style = {{fontSize:'12px'}}>
                        <thead style={{background:'#1976d2',color:'#fff',border:'solid 2px #fff'}}>
                            <tr>
                                <th>Selected Month</th>
                                <th>Already Applied</th>
                                <th>Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{currentMonth.format('MMMM YYYY')}</td>
                                <td>{totalMonthHours}</td>
                                <td>{40-totalMonthHours}</td>
                            </tr>
                            
                        </tbody>
                        
                    </table>

                </Grid> */}
                {
                    tempSelectedCTOInclusiveDates.length !==0
                    ?
                        CTOHours%8
                        ?
                            tempSelectedCTOInclusiveDates.map((data,key)=>
                            <Grid item xs={12} sm={12} md = {12} lg ={12}
                                key = {key}>
                                {
                                    key === 0
                                    ?
                                    <Typography sx={{color:'#353232',fontSize:'.8em',marginBottom:'7px'}}>Select date period *</Typography>
                                    :
                                    ''
                                }
                                <FormControl fullWidth disabled = {data.disabled ? true:false}>
                                <InputLabel id="demo-simple-select-label"> {moment(data.date.toDate()).format('MMMM DD, YYYY')} Period</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.period}
                                    label={moment(data.date.toDate()).format('MMMM DD, YYYY')+" Period"}
                                    onChange={(value) => handlePeriodChange(value.target.value,key)}
                                >
                                    <MenuItem value='AM'>AM</MenuItem>
                                    <MenuItem value='PM'>PM</MenuItem>
                                    <MenuItem value=''>NONE</MenuItem>
                                </Select>
                                </FormControl>
                            </Grid>

                            )
                        :
                        ''
                        
                    :
                    ''
                    
                }
                
                {ctodatestext.length !==0
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Inclusive Dates Selected' fullWidth  value = {ctodatestext} InputLabelProps={{ shrink: true }} readOnly />
                        </Grid>
                        :
                        ''
                }
                {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Tooltip title="Please upload a PDF / Image File" placement='top'>
                    <TextField type = "file" label="Certificate of COC *" fullWidth InputLabelProps={{shrink:true}} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }}onChange = {handleCOCFile} disabled={CTOHoursDropdown.length ===0 || CTOHours === '0' ?  true:false}/>
                    </Tooltip>
                </Grid> */}
                <Grid item xs={12}>
                    <Typography sx={{fontSize:'.8rem'}}>Certificate of COC *</Typography>
                    <label htmlFor={"contained-button-file"} style={{width:'100%'}} required>
                    <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)} multiple/>
                    
                    <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' }, flex: 1 ,height:55}}> {multipleFileUpload.length ===0?<Tooltip title='No file uploaded'><WarningAmberOutlinedIcon size='small' color='error'/></Tooltip>:''} <AttachFileOutlinedIcon fontSize='small'/>Upload File </Button>
                    </label>
                    {
                        multipleFileUpload.length>0
                        ?
                        <Grid item container sx={{display:'flex',justifyContent:'space-between'}}>
                        {
                            multipleFileUpload.map((row,key)=>
                            <Grid item xs={6} lg={4} sx={{border:'solid 1px #e9e9e9',borderRadius:'20px',pl:1}}>
                            <small style={{display:'flex',justifyContent:'space-between',alignItems:'center', fontSize:'.7rem'}} key={key}>{row.filename} <Tooltip title='Remove file'><IconButton onClick={()=>handleRemoveFile(key)}><DeleteIcon color='error' sx={{fontSize:'15px'}}/></IconButton></Tooltip></small>
                            </Grid>
                            
                        )}
                        </Grid>
                        :
                        null
                    }
                    </Grid>
                </>
                )
                break;
                /**
             * Extended Maternity Leave
             */
             case 22:
                return(
                    <>
                    <Grid item xs={12}>

                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:blue[500],fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography sx={{color:'#353232',fontSize:'.8em'}}>Inclusive Dates *</Typography>
                    <DatePicker
                        value = {selectedInclusiveDates}
                        onChange = {handleSetInclusiveDates}
                        multiple
                        plugins={[
                        <DatePanel />
                        ]}
                        minDate={inclusiveMinDate()}
                        // render={<InputIcon/>}
                        render={(value, openCalendar) => {
                            return (
                            <button onClick={openCalendar} className = "custom-inclusive-dates">
                                <InputIcon/>
                            </button>
                            )
                        }}
                        // style={{
                        //     width: "100%",
                        //     boxSizing: "border-box",
                        //     height: "26px"
                        //   }}
                        containerStyle={{
                            width: "100%"
                        }}
                        mapDays={({ date }) => {
                            let props = {}
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            if (isWeekend) props.disabled = true
                            if(isDisabled) props.disabled=true
                            if(selectedInclusiveDates.length >= maternityBal) props.disabled=true

                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='No. of Days Applied' fullWidth  value = {selectedInclusiveDates.length} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    {previewInclusiveDates.length !==0
                    ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    :
                    ''
                    }
                    
                    {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Tooltip title="Please upload a PDF/Image File" placement='top'>
                        <TextField type = "file" label="Supporting Document *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} disabled={selectedInclusiveDates.length !== 0 ?false:true}/>
                        </Tooltip>
                    </Grid> */}
                    </>
                    )
                break;
        }
    }
    const CTOHoursToDays = (data) =>{
        var days = data/8;
        return <em style={{color:red[800]}}><small>&nbsp;({days} {days<=1?'day':'days'})</small></em>;
    }
    const handleCurrentMonth = (date) => {
        setCurrentMonth(date)
    }
    const [currentMonth,setCurrentMonth] = React.useState(new DateObject())
    const [totalMonthHours,setTotalMonthHours] = React.useState('');
    const [minCTODate,setMinCTODate] = React.useState('')
    const [maxCTODate,setMaxCTODate] = React.useState('')
    useEffect(()=>{
        if(leaveType === 14){
            // loop for CTO dropdown hours based on available balance
            /**
            Gel all active coc credits, current month
                */
            var year = currentMonth.format('YYYY');
            var month = currentMonth.format('MM')-1;
            var t_data = {
                date:moment(new Date(year,month+1,0)).format('YYYY-MM-DD')
            }
            getCurrentMonthCOC(t_data)
            .then(res=>{
                setBalance(res.data)

                let coc = res.data;
                let result = [];
                let minDate = new Date();
                let endDate;
                let start = 0;
                let fin_minDate;
                while(start<=ctoFilingPeriod){
                    endDate = minDate;
                    if(moment(endDate).isBusinessDay()){
                        start++;
                    }
                    if(start !== ctoFilingPeriod){
                        endDate.setDate(endDate.getDate()+1)
                    }
                }
                // setMinCTODate(endDate)
                /**
                Check if selected current month and year
                 */
                if(currentMonth.format('MM') === moment().format('MM') && currentMonth.format('YYYY') === moment().format('YYYY')){
                    setMinCTODate(moment(new Date()).add(1,'days').format('YYYY-MM-DD'))

                }else{
                    setMinCTODate(moment(new Date(year,month,1)).format('YYYY-MM-DD'))
                }

                var maxCTODate = new Date(year,month+1,0)
                // var d = new Date(, month + 1, 0);
                // setMinCTODate(minCTODate)
                setMaxCTODate(maxCTODate)

                var data =0;
                setTotalMonthHours(res.data)
                //limit only remaining CTO hours per month
                var total=0;
                for(var i = 4 ; i <= coc;){
                    if(i>coc){
                        break;
                    }else{
                        result.push(i)
                        total = i+data;
                        i = i +4;
                        if(total>=40){
                            break;
                        }
                    }
                
                }
                setCTOHoursDropdown(result)
                setCurrentMonthCTO(data)
                setCTOInclusiveDates([])
                setCTOHours('')

            })
        }
        
        
        
    },[currentMonth])
    const showFileAttachment = (row) => {
        switch(row.leave_type_id){
            case 4:
                var id = row.leave_application_id;
                axios({
                    url: 'api/fileupload/viewAllocationFile/'+id, //your url
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('target', '_BLANK'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                }).catch(error=>{
                    toast.error(error.message+'. Access denied.')
                });
                break;
            default:
                var file_id = JSON.parse(row.file_ids);
                axios({
                    url: 'api/fileupload/viewFile/'+file_id, //your url
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('target', '_BLANK'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                }).catch(error=>{
                    toast.error(error.message+'. Access denied.')
                });
                break;
        }
    }
    const handleSetSpecifyDetails = React.useCallback(state=>{
        setSpecifyDetails(state.target.value)
    },[specifyDetails])
    const [accordionCB,setAccordionCB] = React.useState(true)
    const [accordionPending,setAccordionPending] = React.useState(false)
    const [accordionHistory,setAccordionHistory] = React.useState(false)
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
    const formatSubtractCreditAvailableDecimal = (leaveBalance,onProcess) => {
        if(leaveBalance === 0){
            return 0;
        }else{
            let tens = [10,100,1000,10000,100000];
            let b1 = leaveBalance.toString().split('.');
            let b1_max = 0;
            if(b1.length===2){
                b1_max=b1[1].length
            }
            let tens_mult = tens[b1_max-1]
            let b1_fin = Math.floor(leaveBalance * tens_mult);
            let b2 = onProcess * tens_mult;
            
            if(onProcess>leaveBalance){
                let b1_fin2 = Math.floor(leaveBalance) * tens_mult;
                let comp = (b1_fin - b1_fin2 ) / tens_mult
                return comp;
            }else{
                let comp = (b1_fin - b2 ) / tens_mult
                return comp;
            }
        }
        
        
        // {balanceData[0].vl_bal-onProcess.vl < 0 ?(Math.round((balanceData[0].vl_bal-Math.floor(balanceData[0].vl_bal)) * 100) / 100):(Math.round((balanceData[0].vl_bal-onProcess.vl) * 100) / 100)} 
    }
    const formatAddCreditAvailableDecimal = (a,b) => {
        let tens = [10,100,1000,10000,100000];
        let b1 = a.toString().split('.');
        let b1_max = 0;
        if(b1.length===2){
            b1_max=b1[1].length
        }
        let tens_mult = tens[b1_max-1]
        let b1_fin = Math.floor(a * tens_mult);
        let b2 = b * tens_mult;
        
        let comp = (b1_fin + b2 ) / tens_mult
        return comp;
        
        // {balanceData[0].vl_bal-onProcess.vl < 0 ?(Math.round((balanceData[0].vl_bal-Math.floor(balanceData[0].vl_bal)) * 100) / 100):(Math.round((balanceData[0].vl_bal-onProcess.vl) * 100) / 100)} 
    }
    const [vlWpay,setVlWpay] = useState('');
    const [vlCreditsWpay,setVlCreditsWpay] = useState(0);
    const [slCreditsWpay,setSlCreditsWpay] = useState(0);
    const [borrowedVLCredits,setBorrowedVLCredits] = useState(0);
    const handleVLWOPAY = (bal)=>{
        var t_var_min=.5;
        var t_var_default_hours =.0;

        if(selectedInclusiveDates.length>0){
            var min_credits = assignWorkingHrsDays.filter((el2)=>{
                return el2.year === parseInt(selectedInclusiveDates[0].format('YYYY')) && el2.day === selectedInclusiveDates[0].format('dddd')
            })
            t_var_min = min_credits[0].hours/2;
            t_var_default_hours = min_credits[0].hours;
        }
        var t_total_default_hours = selectedInclusiveDates.length*t_var_default_hours;
        if(bal<t_total_default_hours){
            /**
            get  groupings by t_var_min
            */
            var t_group=bal;
            var t_count=0;
            while(t_group>t_var_min){
                t_group = t_group-t_var_min;
                t_count+=t_var_min;
            }
            var withpay_credits = t_count;
            var withpay_credits_to_days = t_count/t_var_default_hours;
            var withoutpay_credits_to_days = (t_total_default_hours-withpay_credits)/t_var_default_hours
            // return withoutpay_credits_to_days;
            return <Typography sx={{padding:'5px',color:'#d32f2f',textAlign:'center'}}className='animate__animated animate__headShake'> <PriorityHighIcon fontSize='small' /> Days Without Pay: {withoutpay_credits_to_days}</Typography>
        }else{
            return null;
        }
        
        /**
        Count total days equivalent
         */
        var t_total_end_count = 0;
        var t_total_days_eq = 0;
        while(t_total_end_count<selectedInclusiveDates.length){
            var t_eq = assignWorkingHrsDays.filter((el2)=>{
                return el2.year === parseInt(selectedInclusiveDates[t_total_end_count].format('YYYY')) && el2.day === selectedInclusiveDates[t_total_end_count].format('dddd')
            })
            if(t_eq.length>0){
                t_total_days_eq+=t_eq[0].hours
            }
            
            t_total_end_count++;
        }

        /**
        Get days with pay
            */
        var t_dwpay = 0;
        if(t_total_days_eq>t_count){
            t_dwpay = t_count;
        }else{
            t_dwpay = t_total_days_eq
        }
        /**
        * 
        Get dates with pay
        */
        var t_end_count = 0;
        var t_total_eq = 0;
        var t_days_val = 0;
        while(t_end_count<t_dwpay){
            var t_eq = assignWorkingHrsDays.filter((el2)=>{
                return el2.year === parseInt(selectedInclusiveDates[t_end_count].format('YYYY')) && el2.day === selectedInclusiveDates[t_end_count].format('dddd')
            })
            if(t_eq.length>0){
                t_total_eq+=t_eq[0].hours;
                t_days_val = t_eq[0].hours;
            }
            
            t_end_count++;
        }
        
        /**
        Check if total days 
         */
        return t_total_days_eq+' '+t_total_eq
        if(bal<t_total_days_eq){
            return bal
        }else{
            if(bal>t_var_min){
                if(t_total_eq>=t_total_days_eq){
                    return t_total_eq+' '+t_total_days_eq
                }else{
                    var t_eq_wopay = (t_total_days_eq - t_total_eq);
                    return <Typography sx={{padding:'5px',color:'#d32f2f',textAlign:'center'}}className='animate__animated animate__headShake'> <PriorityHighIcon fontSize='small' /> Days Without Pay: {t_eq_wopay}</Typography>
                }
            }else{
                return selectedInclusiveDates.length-Math.floor(bal)
            }
        }
        
    }
    useEffect(()=>{
        if(leaveType === 1 || leaveType === 2){
            var t_var_min=.5;
            var t_var_default_hours =.0;

            if(selectedInclusiveDates.length>0){
                var min_credits = assignWorkingHrsDays.filter((el2)=>{
                    return el2.year === parseInt(selectedInclusiveDates[0].format('YYYY')) && el2.day === selectedInclusiveDates[0].format('dddd')
                })
                t_var_min = min_credits[0].hours/2;
                t_var_default_hours = min_credits[0].hours;
            }
            var t_total_default_hours = selectedInclusiveDates.length*t_var_default_hours;
            /**
            get  groupings by t_var_min
            */
            var t_group=balance;
            var t_count=0;
            
            if(balance<t_total_default_hours){
                while(t_group>t_var_min){
                    t_group = t_group-t_var_min;
                    t_count+=t_var_min;
                }
                var withpay_credits = t_count;
                var withpay_credits_to_days = t_count/t_var_default_hours;
                var withoutpay_credits_to_days = (t_total_default_hours-withpay_credits)/t_var_default_hours
                setVlCreditsWpay(withpay_credits)
                setVlWpay(withpay_credits_to_days)

            }else{
                setVlCreditsWpay(t_total_default_hours)
                setVlWpay(selectedInclusiveDates.length)
            }
        }
    },[selectedInclusiveDates])
    const handleLeaveInfo = ()=>{
        switch(leaveType){
            case 1:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold'}}>Vacation Leave</Typography>
                <Typography sx={{ p: 2 }}>It shall be filed five (5) days in advance, whenever possible, of the effective date of such leave. Vacation leave within in the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from money and work accountabilities.</Typography>
                </Box>
            break;
            case 2:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Force Leave</Typography>
                <Typography sx={{ p: 2 }}>Annual five-day vacation leave shall be forfeited if not taken during the year. In case the scheduled leave has been cancelled in the exigency of the service by the head of agency, it shall no longer be deducted from the accumulated vacation leave. Availment of one (1) day or more Vacation Leave (VL) shall be considered for complying the mandatory/forced leave subject to the conditions under Section 25, Rule XVI of the Omnibus Rules Implementing E.O. No. 292.</Typography>
                </Box>
            break;
            case 3:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Sick Leave</Typography>
                <ul>
                <li>
                <Typography sx={{ p: 2 }}>It shall be filed immediately upon employee's return from such leave.</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>If filed in advance or exceeding five (5) days, application shall be accompanied by a <u>medical certificate</u>. In case medical consultation was not availed of, an <u>affidavit</u> should be executed by an applicant.</Typography>
                </li>
                </ul>
                </Box>
            break;
            case 4:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Maternity leave - 105 days</Typography>
                <ul>
                <li>
                <Typography sx={{ p: 2 }}>Proof of pregnancy e.g. ultrasound, doctor’s certificate on the expected date of delivery</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>Accomplished Notice of Allocation of Maternity Leave Credits (CS Form No. 6a), if needed</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>Seconded female employees shall enjoy maternity leave with full pay in the recipient agency.</Typography>
                </li>
                </ul>
                </Box>
            break;
            case 5:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Paternity Leave - 7 days</Typography>
                <Typography sx={{ p: 2 }}>Proof of child’s delivery e.g. birth certificate, medical certificate and marriage contract</Typography>
                </Box>
            break;
            case 6:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Special Leave Privilege - 3 days</Typography>
                <Typography sx={{ p: 2 }}>It shall be filed/approved for at least one (1) week prior to availment, except on emergency cases. Special privilege leave within the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from money and work accountabilities.</Typography>
                </Box>
            break;
            case 7:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Solo Parent leave - 7 days</Typography>
                <Typography sx={{ p: 2 }}>It shall be filed in advance or whenever possible five (5) days before going on such leave with updated Solo Parent Identification Card.</Typography>
                </Box>
            break;
            case 9:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>VAWC leave - 10 days</Typography>
                <ul>
                <li>
                <Typography sx={{ p: 2 }}>It shall be filed in advance or immediately upon the woman employee’s return from such leave.</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>It shall be accompanied by any of the following supporting documents:</Typography>
                </li>
                    <ol type='a'>
                        <li>Barangay Protection Order (BPO) obtained from the barangay;</li>
                        <li>Temporary/Permanent Protection Order (TPO/PPO) obtained from the court;</li>
                        <li>If the protection order is not yet issued by the barangay or the court, a certification issued by the Punong Barangay/Kagawad or Prosecutor or the Clerk of Court that the application for the BPO, TPO or PPO has been filed with the said office shall be sufficient to support the application for the ten-day leave; or</li>
                        <li>In the absence of the BPO/TPO/PPO or the certification, a police report specifying the details of the occurrence of violence on the victim and a medical certificate may be considered, at the discretion of the immediate supervisor of the woman employee concerned.</li>
                    </ol>
                </ul>
                </Box>
            break;
            case 10:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Rehabilitation leave* - up to 6 months</Typography>
                <ul>
                <li>
                <Typography sx={{ p: 2 }}>Application shall be made within one (1) week from the time of the accident except when a longer period is warranted.</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>Letter request supported by relevant reports such as the police report, if any,</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>Medical certificate on the nature of the injuries, the course of treatment involved, and the need to undergo rest, recuperation, and rehabilitation, as the case may be.</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>Written concurrence of a government physician should be obtained relative to the recommendation for rehabilitation if the attending physician is a private practitioner, particularly on the duration of the period of rehabilitation.</Typography>
                </li>
                </ul>
                </Box>
            break;
            case 11:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Special leave benefits for women* - up to 2 months</Typography>
                <ul>
                <li>
                <Typography sx={{ p: 2 }}>The application may be filed in advance, that is, at least five (5) days prior to the scheduled date of the gynecological surgery that will be undergone by the employee. In case of emergency, the application for special leave shall be filed immediately upon employee’s return but during confinement the agency shall be notified of said surgery.</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>The application shall be accompanied by a medical certificate filled out by the proper medical authorities, e.g. the attending surgeon accompanied by a clinical summary reflecting the gynecological disorder which shall be addressed or was addressed by the said surgery; the histopathological report; the operative technique used for the surgery; the duration of the surgery including the peri-operative period (period of confinement around surgery); as well as the employees estimated period of recuperation for the same.</Typography>
                </li>
                </ul>
                </Box>
            break;
            case 12:
                return <Box>
                <Typography sx={{ p: 2,fontWeight:'bold' }}>Special Emergency (Calamity) leave - up to 5 days</Typography>
                <ul>
                <li>
                <Typography sx={{ p: 2 }}>The special emergency leave can be applied for a maximum of five (5) straight working days or staggered basis within thirty (30) days from the actual occurrence of the natural calamity/disaster. Said privilege shall be enjoyed once a year, not in every instance of calamity or disaster.</Typography>
                </li>
                <li>
                <Typography sx={{ p: 2 }}>The head of office shall take full responsibility for the grant of special emergency leave and verification of the employee’s eligibility to be granted thereof. Said verification shall include: validation of place of residence based on latest available records of the affected employee; verification that the place of residence is covered in the declaration of calamity area by the proper government agency; and such other proofs as may be necessary.</Typography>
                </li>
                </ul>
                </Box>
            break;
            case 15:
                if(leaveDetails === 9){
                    return <Box>
                    <Typography sx={{ p: 2,fontWeight:'bold' }}>Monetization of leave credits</Typography>
                    
                    <Typography sx={{ p: 2 }}>Application for monetization of fifty percent (50%) or more of the accumulated leave credits shall be accompanied by letter request to the head of the agency stating the valid and justifiable reasons.</Typography>
                    
                    </Box>
                }
                if(leaveDetails === 10){
                    return <Box>
                    <Typography sx={{ p: 2,fontWeight:'bold' }}>Terminal leave</Typography>
                    
                    <Typography sx={{ p: 2 }}>Proof of employee’s resignation or retirement or separation from the service.</Typography>
                    
                    </Box>
                }
                
            break;
            default:
            return <Typography sx={{ p: 2 }}>No information available as of the moment</Typography>
        }
    }
    const handleFileSickLeave = (sl_bal,vl_bal,date)=>{
        return date;
    }
    return(
        <>
        {
            workScheduleDataLoaded
            ?
            <Box>
                <Box sx={{padding:'20px 5px 20px 5px'}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label"><Box>Type of Leave to be Availed of * {leaveType &&<Tooltip title='Click to show Leave Info'><IconButton onClick={handleClickShowLeaveInfo} color='primary'><InfoOutlinedIcon/></IconButton></Tooltip>}</Box></InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={leaveType}
                                    label={<Box>Type of Leave to be Availed of * {leaveType && <Tooltip title='Click to show Leave Info'><IconButton onClick={handleClickShowLeaveInfo} color='primary'><InfoOutlinedIcon/></IconButton></Tooltip>}</Box>}
                                    onChange={handleSetTypeOfLeave}
                                    >
                                    {typeOfLeaveData.map((data,index)=>
                                    <MenuItem value={data.leave_type_id} key = {index}>{data.leave_type_name} {data.desc_name}</MenuItem>
                                )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* {leaveType === 15
                            ?
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                            <TextField variant='outlined' label="Others *" fullWidth/>
                            </Grid>
                            :
                            ''
                            } */}
                        
                            {
                                leaveType.length !==0 &&  (leaveType === 1 ||  leaveType ===2 ||  leaveType ===3 ||  leaveType === 6 || leaveType ===15)
                                ?
                                <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Details of Leave *</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={leaveDetails}
                                    label="Details of Leave *"
                                    onChange={selectLeaveDetails}
                                    >
                                    {
                                        leaveDetailsData.map((data,key)=>
                                            <MenuItem value={data.details_of_leave_id } key = {key}>{data.details_name}</MenuItem>
                                        )
                                    }
                                    
                                
                                    </Select>
                                    {leaveType === 3
                                        ?
                                            <TextField label='Specify Illness *' sx={{marginTop:'15px'}} value = {specifyDetails} onChange={handleSetSpecifyDetails} color={specifyDetails.length ===0 ?'error':'primary'} InputProps={{inputProps:{maxLength:40}}} helperText="Max of 40 characters"/>
                                        :
                                            leaveType === 1 || leaveType === 2 || leaveType === 15
                                            ?
                                            <TextField label='Specify *' sx={{marginTop:'15px'}} value = {specifyDetails} onChange={handleSetSpecifyDetails} color={specifyDetails.length ===0 ?'error':'primary'} InputProps={{inputProps:{maxLength:40}}} helperText="Max of 40 characters"/>
                                            // <TextField label='Specify' sx={{marginTop:'15px'}} ref={specifyRef} onChange={(val) => specifyRef.current.value = val.target.value} value = {specifyRef.current.value}/>
                                            :
                                            ''
                                    }
                                    </FormControl>
                                </Grid>
                                :
                                    leaveType === 11
                                    ?
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <TextField label='Specify Illness *' sx={{marginTop:'15px'}} value = {specifyDetails} onChange={(value)=>setSpecifyDetails(value.target.value)} fullWidth InputProps={{inputProps:{maxLength:40}}} helperText="Max of 40 characters"/>
                                    </Grid>
                                    :
                                    leaveType.length !==0
                                    ?
                                    ''
                                    :
                                    <Grid item xs={12}>
                                        <Skeleton
                                        variant="rounded"
                                        width='100%'
                                        height={matches?'55vh':'70vh'}
                                        animation="wave"
                                        />
                                    </Grid>
                                    
                            }
                            {
                                leaveType === 2
                                ?
                                <Grid item xs={12}>
                                    <Typography sx={{color:red[800]}}>Total VL/FL filed: {props.appliedFL}</Typography>
                                    {
                                        props.appliedFL ===5
                                        ?
                                        <Alert severity="error" sx={{mt:1,textAlign:'justify'}}>You already filed 5 FL this year. Please select VL instead. </Alert>
                                        :
                                        null
                                    }
                                </Grid>
                                :
                                null
                            }
                            {/* {
                                leaveType
                                ?
                                    leaveType !==14
                                    ?
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Commutation *</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={commutation}
                                                label="Commutation *"
                                                onChange={handleChangeCommutation}
                                            >
                                                <MenuItem value={'Requested'}>Requested</MenuItem>
                                                <MenuItem value={'Not Requested'}>Not Requested</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    :
                                    ''
                                :
                                ''
                            } */}
                            {
                                leaveType
                                ?
                                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                    {
                                        leaveType === 3
                                        ?
                                            <Box sx={{position:'relative'}}>
                                            <Box sx={{position:'relative'}}>
                                            <Popover
                                                id={requestid}
                                                open={openRequestEarnedLeave}
                                                anchorEl={requestEarnedLeaveAnchor}
                                                onClose={handleCloseRequestEarnedLeave}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <Grid container sx={{p:2}}>
                                                    <Grid item xs={12}>
                                                    <Typography><small>Last Earned date: date</small></Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                                    <Tooltip title='Proceed request'><IconButton className='custom-roundbutton' color='success'><SendIcon/></IconButton></Tooltip>
                                                    </Grid>
                                                
                                                </Grid>
                                                
                                            </Popover>
                                            </Box>
                                            {/* <Tooltip title='Request Earned leave'><IconButton sx={{color:orange[800]}} onClick={handleClickShowRequestEarnedLeave}><TaskIcon/></IconButton></Tooltip>
                                            {loadingRequestEarning && (
                                                <CircularProgress
                                                    size={40}
                                                    sx={{
                                                    color: green[500],
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    zIndex: 10,
                                                    }}
                                                />
                                                )} */}
                                            </Box>
                                        :
                                        null
                                    }
                                    
                                    <Box>
                                    <Box sx={{position:'relative'}}>
                                    <Popover
                                        id={id}
                                        open={openLeaveInfo}
                                        anchorEl={anchorEl}
                                        onClose={handleCloseLeaveInfo}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                    >
                                        {handleLeaveInfo()}
                                        
                                    </Popover>
                                    </Box>

                                    </Box>
                                
                                </Grid>
                                :
                                null
                            }
                            
                            {
                                leaveType === 1 || leaveType === 2 || leaveType === 3 || leaveType === 14 || leaveType === 22
                                ?
                                <Grid item xs={12} sx = {{textAlign:'center'}} >
                                {/* <Typography sx={{fontWeight:'bold',color:'#00ac10',padding:'10px',borderRadius:'5px',borderTop:'solid 1px',borderBottom:'solid 1px'}}
                                > */}
                                <Typography sx={{background:blue[900],color:'#fff',padding:'10px 15px',boxShadow: '3px 5px 10px #08449d'}}
                                >
                                {balance.length !==0
                                ?   
                                    leaveType === 14
                                    ?
                                    <span style={{display:'flex',justifyContent:'center',alignItems:'center'}}> 
                                    Available Balance: <strong>{parseFloat(balance).toFixed(3)} Hour/s </strong> <Tooltip title='Credits may vary on selected month'><IconButton color='info'><InfoIcon/></IconButton></Tooltip></span>
                                    :
                                        leaveType === 3
                                        ?
                                        <span> 
                                    Available Credit Balance: <strong>{parseFloat(balance).toFixed(3)}</strong></span>
                                        :
                                            leaveType === 1 || leaveType === 2 || leaveType === 6
                                            ?
                                            <span> 
                                    Available Credit Balance: <strong>{balance}</strong></span>
                                            :
                                            leaveType === 22
                                            ?
                                            <span>Available Credit Balance: <strong>{maternityBal}</strong> Day/s </span>
                                            :
                                            ''
                                :
                                ''
                                }
                                </Typography>
                                </Grid>
                                :
                                ''
                            }
                            
                            {leaveType
                            ?
                            <>
                            {
                                showLeaveDetailsApplication()
                            }
                            
                            </>
                            :
                            ''
                            }
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                            {
                            leaveType === 1 || leaveType === 2
                            ?
                                // selectedInclusiveDates.length >Math.floor(balance)
                                // ?
                                // <Typography sx={{padding:'5px',color:'#d32f2f',textAlign:'center'}}className='animate__animated animate__headShake'> <PriorityHighIcon fontSize='small' /> Days Without Pay: {handleVLWOPAY(balance)}</Typography>
                                // :
                                // ''
                                handleVLWOPAY(balance)
                                
                            :
                                leaveType === 14
                                ?
                                 selectedInclusiveDates.length >Math.floor(balance)
                                    ?
                                    <Typography sx={{padding:'5px',color:'#d32f2f',textAlign:'center'}}className='animate__animated animate__headShake'> <PriorityHighIcon fontSize='small' /> Days Without Pay: {selectedInclusiveDates.length-Math.floor(balance)}</Typography>
                                    :
                                    ''
                                :
                                leaveType === 3
                                ?
                                    slTotalWithoutPay ===0
                                    ?
                                    ''
                                    :
                                    <Typography sx={{padding:'5px',color:'#d32f2f',textAlign:'center'}} className='animate__animated animate__headShake'><PriorityHighIcon fontSize='small'/> Days Without Pay: {slTotalWithoutPay}</Typography>
                                :
                                ''
                            }
                            </Grid>
                            
                            
                        </Grid>
                    </Box>
                        {leaveType
                            ?
                            <>
                            <br/>

                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                {/* <Button fullWidth variant='outlined'>Preview</Button> */}
                                {showLeaveTypePreview()}
                            </Grid>
                            <br/>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                            <hr/>

                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            
                            <Tooltip title ='Save Leave Application'><Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='contained' color="success" className='custom-roundbutton' onClick = {submitApplication} disabled = {
                                leaveType === 14
                                ?
                                    CTOHoursDropdown.length ===0
                                    ?
                                    true
                                    :
                                    false
                                :
                                    leaveType === 5
                                    ?
                                    isApplicableForFiling === true
                                        ?
                                        false
                                        :
                                        true
                                    :
                                        leaveType === 2
                                        ?
                                        parseInt(balance)<=0
                                        ?
                                        true
                                        :
                                    false
                                    :
                                    false
                                } size={'small'} >Save </Button></Tooltip>
                                &nbsp;
                            {/* <Button sx={{'&:hover':{color:'white',background:red[800]}}} variant='outlined' color="error" onClick={()=> props.updatesetOpen(false)} startIcon={<CancelOutlinedIcon/>}size={'small'}>CANCEL</Button> */}
                            <Button sx={{'&:hover':{color:'white',background:red[800]}}} variant='contained' color="error" onClick={props.close} className='custom-roundbutton' size={'small'}>CANCEL</Button>
                            </Box>
                            </Grid>
                            </>
                            :
                            ''
                            }
                <Modal
                    open={openAllocation}
                    onClose={()=> setOpenAllocation(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                        NOTICE OF ALLOCATION OF MATERNITY LEAVE FORM
                    </Typography>
                    <Box sx ={{maxHeight:'70vh',overflowY:'scroll',padding:'5px'}}>
                        <Grid container spacing={2}>
                            <AllocationOfMaternityLeaveFillout employeeInfo = {employeeInfo} onClose = {()=> setOpenAllocation(false)} save = {saveAllocationForm} allocationInfo = {allocationInfo}/>
                        </Grid>
                    </Box>
                    </Box>
                </Modal>

                <Modal
                    open={previewModal}
                    onClose={()=> setPreviewModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={previewStyle}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setPreviewModal(false)}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Preview leave application
                    </Typography>
                        <Box sx={{maxHeight:'60vh',overflowY:'scroll',mt:2,mb:2}}>
                        {
                        leaveType === 14
                        ?
                        <div>
                            <PreviewCTOApplicationForm info={employeeInfo} auth_info={props.authInfo} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} CTOHours = {CTOHours} cto_dates = {ctodatestext} date_of_filing ={new Date()} office_head={officeHead} cto_info = {ctoInfo} onProcess = {props.onProcess} balance = {balance} office_ao = {officeAO}/>
                        </div>
                        :
                        <div style = {{position:'relative'}}>
                        <PreviewLeaveApplication ref={leaveRef} data={allTypeOfLeaveData} auth_info = {props.authInfo} leaveType = {leaveType} info={employeeInfo} applied_days = {leaveType === 1 || leaveType === 2 ?selectedInclusiveDates.length:leaveType === 3 ? totalSLPeriodDays+slTotalWithoutPay: leaveType === 5 ? selectedInclusiveDates.length:leaveType === 6 ? selectedSPL:leaveType===9?10:leaveType===10?getAllDatesInRange(selectedRehabilitationDates).length:leaveType===11?getAllDatesInRange(selectedBenefitForWomenDates).length:leaveType===15?totalVL+totalSL:selectedInclusiveDates.length} leaveDetails = {leaveDetails} specifyDetails = {specifyDetails} inclusiveDates = {previewInclusiveDates} balance = {balance} signatory={signatory} vl = {balanceData.length !==0 ? balanceData[0].vl_bal:0} sl = {balanceData.length !==0 ? balanceData[0].sl_bal:0} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} office_head = {officeHead} office_ao = {officeAO} commutation = {commutation} maternity_days = {isAppliedAllocationOfMaternityLeave?105-allocationInfo.allocated_days:105} previewType='applicant' availableVL = {availableVL} availableSL = {availableSL} totalVL ={totalVL} totalSL = {totalSL} slTotalWithoutPay = {slTotalWithoutPay} slAutoWithoutPay = {slAutoWithoutPay} vlWpay = {vlWpay} borrowedVL = {borrowedVL} usedSL = {usedSL} isLateFiling = {isLateFiling} vlCreditsWpay = {vlCreditsWpay}
                         slCreditsWpay = {slCreditsWpay} borrowedVLCredits = {borrowedVLCredits} applicableDays = {applicableDays}/>
                        </div>
                        }
                        </Box>
                        <hr/>
                        <Button variant='contained' sx={{m:matches?0:2,mt:matches?'-10px':0,mr:1,float:'right'}} onClick = {()=> setPreviewModal(false)}>OK</Button>

                    </Box>
                </Modal>
                <div style={{ display: "none" }}><PreviewLeaveApplicationForm auth_info={props.authInfo} ref={leaveRef} data={typeOfLeaveData} leaveType = {leaveType} info={employeeInfo} applied_days = {leaveType === 1 || leaveType === 2 || leaveType === 3 ? selectedInclusiveDates.length: leaveType === 5 ? 7:leaveType === 6 ? selectedSPL:leaveType===9?10:leaveType===10?getAllDatesInRange(selectedRehabilitationDates).length:leaveType===11?getAllDatesInRange(selectedBenefitForWomenDates).length:leaveType===15?appliedOthersDays:selectedInclusiveDates.length} leaveDetails = {leaveDetails} specifyDetails = {specifyDetails} inclusiveDates = {previewInclusiveDates} balance = {balance} signatory={signatory} vl = {balanceData.length !==0 ? balanceData[0].vl_bal:0} sl = {balanceData.length !==0 ? balanceData[0].sl_bal:0} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} office_head = {officeHead} office_ao = {officeAO} commutation = {commutation} maternity_days = {isAppliedAllocationOfMaternityLeave?105-allocationInfo.allocated_days:105} previewType='applicant' availableVL = {availableVL} availableSL = {availableSL} totalVL ={totalVL} totalSL = {totalSL} slTotalWithoutPay = {slTotalWithoutPay} slAutoWithoutPay = {slAutoWithoutPay}/></div>
                <div style={{ display: "none" }}>
                    <PreviewCTOApplicationForm ref={cocRef} info={employeeInfo} auth_info={props.authInfo} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} CTOHours = {CTOHours} cto_dates = {ctodatestext} date_of_filing ={new Date()} cto_info = {ctoInfo} office_ao = {officeAO} office_head={officeHead}/>
                </div>
                </Box>
            :
            <Stack>
                <Skeleton variant="text" width={'100%'} height={'90px'} animation="wave"/>
                <Skeleton
                variant="rounded"
                width='100%'
                height={matches?'55vh':'70vh'}
                animation="wave"
                />
            </Stack>
        }
        </>
        
    )
}