import React, { useEffect,useLayoutEffect,useRef,useState } from 'react';
import {  Typography,Grid,Box, Button,InputLabel,MenuItem,FormControl,Select,TextField,FormControlLabel,FormGroup,LinearProgress,Tooltip,Checkbox,Alert,Fab,CircularProgress,Modal,Stack,Skeleton    } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// leave application request
import { getLeaveDetails,addLeaveApplication,cancelLeaveApplication,refreshData,getMonetizationInfo,getCTOAlreadyAppliedHours,getWorkSchedule } from './LeaveApplicationRequest';
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

import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { PreviewLeaveApplicationForm } from './PreviewLeaveApplicationForm';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { blue, green, red, yellow } from '@mui/material/colors'

//icon
import PrintIcon from '@mui/icons-material/Print';
import InfoIcon from '@mui/icons-material/Info';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

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

    const specifyRef = useRef('');
    const [CTOHoursDropdown,setCTOHoursDropdown] = React.useState([]);
    const [alreadyAppliedDays,setAlreadyAppliedDays] = React.useState([]);
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
    const [ctoInfo,setCtoInfo] = useState([{
        cto_hr_name:'',
        cto_hr_name_pos:'',
        cto_cmo_name:'',
        cto_cmo_name_pos:''
    }]);

    //fetch data from DB when component rendered
    useEffect(()=>{
        //request to get the info of current employee login
        // console.log(props)
        let appliedDays;
        setCtoInfo(props.ctoInfo)
        setTypeOfLeaveData(props.typeOfLeaveData)
        setAllTypeOfLeaveData(props.allTypeOfLeaveData)
        setEmployeeInfo(props.employeeInfo)
        setSignatory(props.signatory)
        setonProcess(props.onProcess)
        setBalanceData(props.balanceData)
        setOfficeHead(props.officeHead)
        setOfficeAO(props.officeAO)
        setAlreadyAppliedDays(props.alreadyAppliedDays)
        setAvailabelSPL(props.availableSPL)
        setOnprocessSPL(props.onprocessSPL)
        setavailableVL(props.availableVL)
        setavailableSL(props.availableSL)
        setavailableCOC(props.availableCOC)

        setslRangeDatesWithPay(props.slRangeDatesWithPay)
        // setslNoPay(props.slNoPay)
        setslWithPay(props.slWithPay)
        getWorkSchedule()
        .then(res=>{
            // console.log(res.data)
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
        
                        /**
                        * Initialized temp remove array
                        */
                        var rem_arr = []
        
                        /**
                        * Loop removed sched data and push into temp array. Using this will easily lookup data using "includes" function
                        */
                        removed.forEach(rem =>{
                            rem_arr.push(moment(rem.date,'YYYY-MM-DD').format('MM-DD-YYYY'))
                        })
        
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
                        
                    /**
                    * Set state the workschedule data
                    */
                    let currDate = new Date();
                    var date = new Date();
                    var start = 0;
                    var end = 5;
                    var toAdd = 0;
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
                        if(props.alreadyAppliedDays.includes(moment(date).format('MM-DD-YYYY'))){
                            toAdd++;
                        }else{
                            if(moment(date).isBusinessDay()){
                                if(!temp2.includes(moment(date).format('D'))){
                                    toAdd++;
                                }
                                slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                start++;
                                
                            }
                        }
                        date.setDate(date.getDate() - 1);
        
                    }
                    let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                    let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d

                    setslNoPay(finalNoPay)
                    setslWithPay(finalWithPay)
                    setslRangeDatesWithPay(slRangeDatesWP)

                    setWorkScheduleData(schedule_data)
                    setWorkScheduleDataLoaded(true)
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
        width: matches? 345:800,
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
    const [hasAppliedVL,sethasAppliedVL] = React.useState(false);
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
    const handleSetTypeOfLeave = (value) =>{
        console.log(props.onProcess)
        setLeaveDetailsData([]);
        setInclusiveDates([]);
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
                    console.log(moment(endDate).format('MM-DD-YYYY'))
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
                    bal2 = formatSubtractCreditAvailableDecimal(element.vl_bal,onProcess.vl)
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = formatSubtractCreditAvailableDecimal(element.vl_bal,onProcess.vl)
                    }
                    break;
                /**
                 * sick leave
                 */
                case 3:
                    bal2 = formatSubtractCreditAvailableDecimal(element.sl_bal,onProcess.sl)
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = formatSubtractCreditAvailableDecimal(element.sl_bal,onProcess.sl)
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
        setapplicableDaysLoading(true)
        getLeaveDetails(value.target.value)
        .then((response)=>{
            /**
             * update leave details state
             */
            const data = response.data
            if(value.target.value === 5){
                setLeaveDetailsData(data.data)
                setisApplicableForFiling(data.is_applicable)
                setapplicableDays(data.applicable_days)
            }else if(value.target.value === 6){
                setTempSelectedSPLInclusiveDates([])
                setLeaveDetailsData(data.data)
                setisApplicableForFiling(data.is_applicable)
                setapplicableDays(data.applicable_days)
                var bal = data.applicable_days;
                var result = [];
                
                //limit only 5 days equals to 40 HRS per application
                var x=0;
                for(var i = .5 ; i <= bal ;){
                    if(i>bal){
                        break;
                    }else{
                        result.push(i)
                        i = i +.5;
                    }
                
                }
                setsplDropdown(result)
            }else{
                setLeaveDetailsData(data.data)
            }
            setapplicableDaysLoading(false)


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
        switch(leaveType){
            case 1:
            case 2:
            case 3:
            case 6:
            case 7:
            case 14:
                return endDate
            default:
                return new Date()
        }
    }
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
            var days = Math.round(CTOHours/1);
            /**
             * if inclusive dates greater than applied hours then remove the oldest date
             */
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
        }
        // console.log(selectedSPL)
    },[selectedSPL])
    const [isAppliedAllocationOfMaternityLeave,setisAppliedAllocationOfMaternityLeave] = React.useState(false)
    const [openAllocation,setOpenAllocation] = React.useState(false);
    const [allocationInfo,setallocationInfo] = React.useState({
        employee_contact_details:'',
        allocated_days:1,
        fullname:'',
        position:'',
        home_address:'',
        contact_details:'',
        agency_address:'',
        relationship_to_employee:'',
        relationship_to_employee_details:'',
        relationship_to_employee_details_specify:'',
        relationship_to_employee_proof:'',
        relationship_to_employee_proof_file:'',
        esignature:''

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

                if(exclude){
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
            var inclusiveDates = moment(dates[0].date).format('MMMM DD,YYYY') + ' - ' + moment(dates[dates.length-1].date).format('MMMM DD,YYYY')
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
    
    /**
     * used for sorting the inclusive dates selected
     */
    const handleSortInclusiveDates = () => {
        var sorted = selectedInclusiveDates.sort()
        var sortedTemp = selectedInclusiveDates.sort()

        if(leaveType === 3){
            var slAutoWithoutPay = 0;
            var isWithPay = false;
            var daysWOP = []
            selectedInclusiveDates.forEach(el=>{
                if(slRangeDatesWithPay.includes(moment(el.toDate()).format('MM-DD-YYYY'))){
                    isWithPay = true;
                }
            })
            if(!isWithPay){
                /**
                 * get all dates without pay
                 */
                 selectedInclusiveDates.forEach(el=>{
                    if(moment(el.toDate()).format('MM-DD-YYYY') <= moment(slNoPay).format('MM-DD-YYYY')){
                        daysWOP.push(moment(el.toDate()).format('MM-DD-YYYY'))
                    }
                })
            }
            let totalWithoutPay=0,finalTotal=0;
            if(daysWOP.length === 0 ){
                if(selectedInclusiveDates.length >Math.floor(balance)){
                    totalWithoutPay = selectedInclusiveDates.length-Math.floor(balance)
                }else{
                    totalWithoutPay = 0;
                }
            }else{
                if((selectedInclusiveDates.length - daysWOP.length) > Math.floor(balance)){
                    totalWithoutPay = (selectedInclusiveDates.length - daysWOP.length)-Math.floor(balance)
                }else{
                    totalWithoutPay = 0;
                }
            }
            setslAutoWithoutPay(Math.floor(daysWOP.length));
            finalTotal = daysWOP.length+totalWithoutPay;
            setslTotalWithoutPay(Math.floor(finalTotal))
            // let to = new Date();
            // // let from = to.setDate(to.getDate()-5);
            // let from = momentBusinessDays(new Date(), 'DD-MM-YYYY').businessSubtract(5)._d

            // const date = from;
            // const dates = [];
            // while(date <= to){
            //     var tempDate = moment(date).format('MM-DD-YYYY')
            //     if(moment(tempDate, 'MM-DD-YYYY').isBusinessDay()){
            //         dates.push(tempDate);
            //     }
            //     date.setDate(date.getDate() + 1);
            // }
            // // setInclusiveMaternityDatesRange(dates)
            // let withPay = 0,withoutPay = 0,tempWOP;
            // sorted.forEach(el=> {
            //     let isWithPay = dates.includes(moment(el.toDate()).format('MM-DD-YYYY'))
            //     if(isWithPay){
            //         withPay++;
            //     }else{
            //         if(moment(from).format('MM-DD-YYYY') > moment(el.toDate()).format('MM-DD-YYYY')){
            //             withoutPay++;
            //         }
            //     }
            // })
            // let totalWithoutPay=0,finalTotal=0;
            // if(withoutPay === 0 ){
            //     if(selectedInclusiveDates.length >balance){
            //         totalWithoutPay = selectedInclusiveDates.length-balance
            //     }else{
            //         totalWithoutPay = 0;
            //     }
            // }else{
            //     if((selectedInclusiveDates.length - withoutPay) > balance){
            //         totalWithoutPay = (selectedInclusiveDates.length - withoutPay)-balance
            //     }else{
            //         totalWithoutPay = 0;
            //     }
            // }
            // setslAutoWithoutPay(withoutPay);
            // finalTotal = withoutPay+totalWithoutPay;
            // setslTotalWithoutPay(finalTotal)
        }
        if(leaveType === 6){
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
        }
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
        setPreviewInclusiveDates(inclusiveDates)
        if(selectedInclusiveDates.length >5){
            setSLAttachment(true)
        }else{
            setSLAttachment(false)
        }
        if(selectedInclusiveDates.length !==0){
            if(moment(sorted[0].toDate()).format('YYYY-MM-DD') > moment(new Date).format('YYYY-MM-DD')){
                setSLAttachment(true)
            }
        }else{
            setSLAttachment(false)
        }
        selectedInclusiveDates.forEach(el=>{
            if(moment(el.toDate()).format('YYYY-MM-DD')>=moment(new Date()).format('YYYY-MM-DD')){
                setSLAttachment(true)
            }
        })
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
                                            days_with_pay:selectedInclusiveDates.length>Math.floor(balance) ? Math.floor(balance):selectedInclusiveDates.length,
                                            days_without_pay:selectedInclusiveDates.length>Math.floor(balance) ? selectedInclusiveDates.length - Math.floor(balance):0,
                                            balance:balance,
                                            inclusive_dates_text:previewInclusiveDates,
                                            commutation:commutation,
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
                                                    timer: 1500
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
                            if(selectedInclusiveDates.length >5){
                                has_attachment = true;
                            }
                            if(selectedInclusiveDates.length !==0){
                                if(moment(sorted[0].toDate()).format('MM-DD-YYYY') > moment(new Date).format('MM-DD-YYYY')){
                                    has_attachment = true
                                }
                            }
                            if(has_attachment){
                                if(slFile.length === 0){
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Oops...',
                                        html:'Please upload a valid Medical Cert. or Affidavit.'
                                    })
                                }else{
                                    selectedInclusiveDates.forEach(el=>
                                        format_date.push({
                                            date:moment(el.toDate()).format('MM-DD-YYYY'),
                                            period:'NONE'
                                        })
                                    )
                                    if(specifyDetails.length !==0){
                                        var data = {
                                            has_attachment:has_attachment,
                                            leave_type_id:leaveType,
                                            details_of_leave_id:leaveDetails,
                                            specify_details:specifyDetails,
                                            days_hours_applied:selectedInclusiveDates.length,
                                            inclusive_dates:format_date,
                                            days_with_pay:selectedInclusiveDates.length-slAutoWithoutPay>balance ? balance:selectedInclusiveDates.length-slAutoWithoutPay,
                                            days_without_pay:slTotalWithoutPay,
                                            balance:balance,
                                            inclusive_dates_text:previewInclusiveDates,
                                            commutation:commutation,
                                            sl_file:slFile
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
                                                    timer: 1500
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
                                                setslAutoWithoutPay(0)
                                                setslTotalWithoutPay(0)
                                                // toast.success(response.data.message)
                                                setOpen(false)
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
                                                    let temp = [];
                                                    let temp2 = [];
                                                    
                                                    for(var w=0;w<workScheduleData.length;w++){
                                                        if(workScheduleData[w].month === parseInt(moment(date).format('M')) && workScheduleData[w].year === parseInt(moment(date).format('YYYY'))){
                                                            temp=workScheduleData[w].details;
                                                            break;
                                                        }
                                                    }
                                                    if(temp){
                                                        temp.forEach(el2=>{
                                                            temp2.push(el2.day)
                                                        })
                                                    }
                                                    if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                        toAdd++;
                                                    }else{
                                                        if(moment(date).isBusinessDay()){
                                                            if(!temp2.includes(moment(date).format('D'))){
                                                                toAdd++;
                                                            }
                                                            slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                            start++;
                                                            
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
                                selectedInclusiveDates.forEach(el=>
                                    format_date.push({
                                        date:moment(el.toDate()).format('MM-DD-YYYY'),
                                        period:'NONE'
                                    })
                                )
                                if(specifyDetails.length !==0){
                                    var data = {
                                        has_attachment:has_attachment,
                                        leave_type_id:leaveType,
                                        details_of_leave_id:leaveDetails,
                                        specify_details:specifyDetails,
                                        days_hours_applied:selectedInclusiveDates.length,
                                        inclusive_dates:format_date,
                                        days_with_pay:selectedInclusiveDates.length-slAutoWithoutPay>balance ? balance:selectedInclusiveDates.length-slAutoWithoutPay,
                                        days_without_pay:slTotalWithoutPay,
                                        balance:balance,
                                        inclusive_dates_text:previewInclusiveDates,
                                        commutation:commutation,
                                        sl_file:slFile
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
                                                timer: 1500
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
                                                if(data.applied_dates.includes(moment(date).format('MM-DD-YYYY'))){
                                                    toAdd++;
                                                }else{
                                                    if(moment(date).isBusinessDay()){
                                                        slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                        start++;
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
                                    if(
                                    allocationInfo.fullname.length === 0 ||
                                    allocationInfo.position.length === 0 ||
                                    allocationInfo.home_address.length === 0 ||
                                    allocationInfo.contact_details.length === 0 ||
                                    allocationInfo.agency_address.length === 0 ||
                                    allocationInfo.relationship_to_employee.length === 0 ||
                                    allocationInfo.relationship_to_employee_proof.length === 0 ||
                                    allocationInfo.relationship_to_employee_proof_file.length === 0 ||
                                    allocationInfo.esignature.length === 0){
                                        Swal.fire({
                                            icon:'warning',
                                            title:'Please fill out necessary allocation info'
                                        })
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
                                            benefit_fullname:allocationInfo.fullname,
                                            benefit_position:allocationInfo.position,
                                            benefit_home_address:allocationInfo.home_address,
                                            benefit_contact_details:allocationInfo.contact_details,
                                            benefit_agency_address:allocationInfo.agency_address,
                                            benefit_relationship:allocationInfo.relationship_to_employee,
                                            benefit_relationship_details:allocationInfo.relationship_to_employee_details,
                                            benefit_relationship_details_specify:allocationInfo.relationship_to_employee_details_specify,
                                            benefit_proof_relationship:allocationInfo.relationship_to_employee_proof,
                                            relationship_to_employee_proof_file:allocationInfo.relationship_to_employee_proof_file,
                                            esignature:allocationInfo.esignature
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
                                            if(response.data.status === 'success'){
                                                // Swal.close()
                                                Swal.fire({
                                                    icon:'success',
                                                    title:data.message,
                                                    showConfirmButton: false,
                                                    timer: 1500
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
                                                    employee_contact_details:'',
                                                    allocated_days:1,
                                                    fullname:'',
                                                    position:'',
                                                    home_address:'',
                                                    contact_details:'',
                                                    agency_address:'',
                                                    relationship_to_employee:'',
                                                    relationship_to_employee_details:'',
                                                    relationship_to_employee_details_specify:'',
                                                    relationship_to_employee_proof:'',
                                                    relationship_to_employee_proof_file:'',
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
                                                timer: 1500
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
                        if(selectedInclusiveDates.length ===0 || selectedInclusiveDates.length < 7){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select a total of 7 days.'
                            })
                        }else{
                            if(singleFile.length === 0){
                                Swal.fire({
                                    icon:'warning',
                                    title:'Oops...',
                                    html:"Please upload a valid Proof of child's delivery"
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
                                    paternity_file:singleFile
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
                                            timer: 1500
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
                                    html:'Please specify details of leave.'
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
                                                        timer: 1500
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
                        if(selectedInclusiveDates.length ===0 || selectedInclusiveDates.length<7){
                            Swal.fire({
                                icon:'warning',
                                title:'Oops...',
                                html:'Please select a total of 7 days.'
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
                                days_hours_applied:7,
                                inclusive_dates:format_date,
                                days_with_pay:7,
                                days_without_pay:0,
                                balance:balance,
                                inclusive_dates_text:previewInclusiveDates,
                                commutation:commutation,
                            }
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
                                        timer: 1500
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
                            study_file:singleFile
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
                                    timer: 1500
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
                                            timer: 1500
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
                                    rehabilitation_file:singleFile
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
                                            timer: 1500
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
                                        specialleavewomen_file:singleFile
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
                                                timer: 1500
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
                                    specialemergency_file:singleFile
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
                                            timer: 1500
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
                                
                                if(hasAppliedVL >= 5){
                                    monetization = (formatSubtractCreditAvailableDecimal(availableVL,5)+availableSL)/2
                                }else{
                                    monetization = (formatSubtractCreditAvailableDecimal(availableVL,5-hasAppliedVL)+availableSL)/2
                                }
                               
                                if(daysOfMonetization>=Math.floor(monetization)){
                                    isRequiredMonetizationFile = true;
                                }else{
                                    isRequiredMonetizationFile = false;
                                }
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
                                                total_sl:totalSL
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
                                                console.log(response.data)
                                                if(response.data.status === 'success'){
                                                    // Swal.close()
                                                    const data = response.data;
                                                    Swal.fire({
                                                        icon:'success',
                                                        title:data.message,
                                                        showConfirmButton: false,
                                                        timer: 1500
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
                                            total_sl:totalSL
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
                                                    timer: 1500
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
                                        inclusive_dates:[{'date':'?','period':'NONE'}]
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
                                                timer: 1500
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
                            if(cocFile.length === 0){
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
                                    coc_file:cocFile
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
                                    // console.log(data)
                                    if(data.status === 'success'){
                                        // Swal.close()
                                        Swal.fire({
                                            icon:'success',
                                            title:data.message,
                                            showConfirmButton: false,
                                            timer: 1500
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
                                        // console.log(balanceData)
                                        var temp = 0;
                                        data.pending.forEach(el => {
                                            if(el.status=== 'FOR REVIEW'){
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
        // console.log(row)
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
        var temp = [...tempSelectedSPLInclusiveDates];
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
        setTempSelectedSPLInclusiveDates(temp);

        var spl_dates = '';
        for (var i = 0 ; i <temp.length ; i++){
            var period = '';
            if(tempSelectedSPLInclusiveDates[i].period.length !==0){
                period = '-'+tempSelectedSPLInclusiveDates[i].period;
            }else{
                period = tempSelectedSPLInclusiveDates[i].period;
            }

            if(i === tempSelectedSPLInclusiveDates.length - 1){
                spl_dates += moment(tempSelectedSPLInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period;

            }else{
                spl_dates += moment(tempSelectedSPLInclusiveDates[i].date.toDate()).format('MMMM DD, YYYY') + period+', ';

            }

        }
        setPreviewInclusiveDates(spl_dates)
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
    useLayoutEffect(()=>{
        var limit = hasAppliedVL>=5?0:5-hasAppliedVL;
        if(hasAppliedVL >= 5){
            var total_maximum = (Math.floor(formatSubtractCreditAvailableDecimal(availableVL,0))+Math.floor(availableSL))/2
            if(daysOfMonetization>total_maximum){
                setdaysOfMonetization((Math.floor(availableVL+availableSL))/2)
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Number of applied days exceed to limit !'
                })
            }
        }else{
            var total_maximum;
            if(availableVL>=limit){
                total_maximum = (formatSubtractCreditAvailableDecimal(availableVL,limit)+availableSL)/2;
            }else{
                total_maximum = Math.floor(availableSL)/2
            }
            if(daysOfMonetization>total_maximum){
                setdaysOfMonetization(Math.floor(total_maximum))
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Number of applied days exceed to limit !'
                })
            }
        }
        var total_maximum2 = Math.floor(availableVL)>=limit?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0;
        if(total_maximum2 >0){
            var total_vl;
            var total_sl;
            /**
             * check if has applied VL within the current year
             */
            if(hasAppliedVL >= 5){
                /**
                 * Check if tick the checkbox for include SL for deduction
                 */
                // if(isInludeSLMonetization){
                //     /**
                //      * check again if selected number of days of monenitization is greater than to available vl, if greater than means include SL for deduction
                //      */
                //     if(daysOfMonetization>availableVL){
                //         total_vl = Math.floor(availableVL);
                //         total_sl = daysOfMonetization-Math.floor(availableVL)
                //     }else{
                //         total_vl = daysOfMonetization;
                //         total_sl = 0;
                //     }
                    
                // }else{

                //     if(daysOfMonetization>(availableVL>=limit?availableVL-limit:0)){
                //         total_vl = Math.floor(availableVL)>=limit?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0;
                //         total_sl = daysOfMonetization-Math.floor(availableVL)
                //     }else{
                //         total_vl = daysOfMonetization;
                //         total_sl = 0;
                //     }
                // }
                /**
                 * check again if selected number of days of monenitization is greater than to available vl, if greater than means include SL for deduction
                 */
                if(daysOfMonetization>availableVL){
                    total_vl = Math.floor(availableVL);
                    total_sl = daysOfMonetization-Math.floor(availableVL)
                }else{
                    total_vl = daysOfMonetization;
                    total_sl = 0;
                }

            }else{
                if(daysOfMonetization>(Math.floor(availableVL)>=5?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0)){
                    total_vl = Math.floor(availableVL)>=limit?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0;
                    total_sl = daysOfMonetization-(availableVL>=5?Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit)):0)
                }else{
                    total_vl = daysOfMonetization;
                    total_sl = 0;
                }
            }
            settotalVL(total_vl)
            settotalSL(total_sl)
        }
        setappliedOthersDays(daysOfMonetization)
    },[daysOfMonetization])
    const checkMonetizationAboveHalf = () => {
        var total_maximum;
        var limit = hasAppliedVL>=5?0:5-hasAppliedVL;
        
        if(hasAppliedVL >= 5){
            // var total_maximum = Math.floor((availableVL+availableSL)/2);
            var total_maximum = (Math.floor(formatSubtractCreditAvailableDecimal(availableVL,0))+Math.floor(availableSL))/2
            
        }else{
            var total_maximum;
            if(availableVL>=limit){
                total_maximum = (Math.floor(formatSubtractCreditAvailableDecimal(availableVL,limit))+Math.floor(availableSL))/2;
            }else{
                total_maximum = Math.floor(availableSL)/2
            }
            
        }
        var monetization = total_maximum;

        if(daysOfMonetization>=monetization){
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
        // {hasAppliedVL?availableVL:availableVL>=5?availableVL-5:0}
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
    }
    const handleMonetizationValue = (value) =>{
        if(value.target.value >=0){
            var arr = value.target.value.split('.')
            setdaysOfMonetization(arr[0])
        }else{
            setdaysOfMonetization(0)
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
            <Grid item xs={12} sm={12} md={12} lg={12}>
            <br/>
            <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                    let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
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
            </>
            )
            break;
            /**
             * Sick Leave
             */
            case 3:
                return(
                <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                        let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                        if (isWeekend) props.className = "highlight highlight-red"
                        if(isDisabled) props.disabled=true
                        if(isDisabled) props.title='already applied'
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
                        if(isDisabled) props.disabled=true
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
                {
                    slAttachment
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                            let isWeekend = [0, 6].includes(date.weekDay.index)
                            let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            if (isWeekend) props.className = "highlight highlight-red"
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
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                <br/>
                                <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                                        if (isWeekend) props.className = "highlight highlight-red"
                                        if(isDisabled) props.disabled=true
                                        if(selectedInclusiveDates.length >=daysPeriod) props.disabled=true
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
                                    <TextField type = "file" label="Proof of child's delivery *" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }} disabled={selectedInclusiveDates.length !== 0 ?false:true}/>
                                    </Tooltip>
                                </Grid>
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
                        <Alert sx={{textAlign:'center'}} severity="warning">You have already reach the limit number of days per year for Special Privilege Leave ! Please cancel your application if you want to change your application (this is only applicable if the status of your applicantion is 'FOR REVIEW')</Alert>
                    </Grid>
                :
                    isApplicableForFiling === true
                    ?
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                            <br/>
                            <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
                                    Details of Application
                                </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label={'No. of available days for the year '+moment(new Date()).format('YYYY')} fullWidth  value = {applicableDays} InputLabelProps={{ shrink: true }} readOnly/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl fullWidth>
                            <InputLabel id="cto-hours-select-label">No. of Days to Apply</InputLabel>
                            <Select
                                labelId="cto-hours-select-label"
                                id="cto-hours-select"
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
                        minDate={inclusiveSPLMinDate()}
                        maxDate={inclusiveSPLMaxDate()}
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
                            
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            
                            var days = Math.round(selectedSPL/1);
                            if(splDropdown.length ===0){
                                props.disabled = true;
                            }else{
                                if(selectedInclusiveDates.length>=days)props.disabled = true;
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
                            // if(isDisabled) props.disabled=true
                            if(!hasSched) props.disabled=true
                            return props
                        }}
                        onClose = {handleSortInclusiveDates}
                        // onOpen = {()=>setInclusiveDatesOpen(true)}
                        
                    />
                    </Grid>
                   
                    {previewInclusiveDates.length !==0
                    ?
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField label='Inclusive Dates Selected' fullWidth  value = {previewInclusiveDates} InputLabelProps={{ shrink: true }} readOnly />
                    </Grid>
                    :
                    ''
                    }
                    {
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
                    }
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                            let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
                            if(selectedInclusiveDates.length>=daysPeriod) props.disabled=true
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                            let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                            let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            if (isWeekend) props.disabled=true
                            if(isDisabled) props.disabled=true
                            if(selectedInclusiveDates.length >=daysPeriod) props.disabled=true
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                        onChange = {(val)=>setRehabilitationDates(val)}
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
                            let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                            let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                            if (isWeekend) props.className = "highlight highlight-red"
                            if(isDisabled) props.disabled=true
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                            if(selectedInclusiveDates.length >=daysPeriod) props.disabled=true
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
                        <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                        {hasAppliedVL >= 5
                        ?
                        ''
                        :
                        <Grid item xs={12}>
                            <Alert severity="info"><small><em> <strong>Note:</strong> You still have not availed a {5-hasAppliedVL} VL/FL (Approved application) as of today, so a number of {5-hasAppliedVL} day/s will be reserved for your <strong>Force Leave</strong>.</em></small></Alert>
                        </Grid>
                        }
                        
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
                            <TextField label='No. of Days To Apply' type='number' fullWidth InputProps={{ inputProps: { inputMode: 'numeric', pattern: '[0-9]*',
                            max:
                            hasAppliedVL >= 5
                            ?
                            (formatSubtractCreditAvailableDecimal(availableVL,5)+availableSL)/2
                            :
                            (formatSubtractCreditAvailableDecimal(availableVL,5-hasAppliedVL)+availableSL)/2
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
                                <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                    <Typography sx={{color:'orange',fontSize:'17px',borderBottom:'solid 2px',paddingBottom:'10px'}}>
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
                        let isDisabled = alreadyAppliedDays.includes(moment(new Date(date)).format('MM-DD-YYYY'))
                        // if (isWeekend) props.className = "disabled-date"
                        if (isWeekend) props.className = "highlight highlight-red"

                        var days = Math.round(CTOHours/8);
                        // if(CTOHoursDropdown.length ===0){
                        //     props.disabled = true;
                        // }else{
                            
                        // }
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
                <Grid item xs={12}>
                    <small style={{fontSize:'10px',float:'right'}}><em>*maximum of 40 hours per month</em></small>
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

                </Grid>
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
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Tooltip title="Please upload a PDF / Image File" placement='top'>
                    <TextField type = "file" label="Certificate of COC *" fullWidth InputLabelProps={{shrink:true}} InputProps={{ inputProps: { accept:'image/*    ,.pdf'} }}onChange = {handleCOCFile} disabled={CTOHoursDropdown.length ===0 || CTOHours === '0' ?  true:false}/>
                    {/* <input type = "file" onChange = {handleCOCFile}/> */}
                    </Tooltip>
                </Grid>
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
        // loop for CTO dropdown hours based on available balance
        let coc = availableCOC;
        let result = [];

        /**
         * Check if has already applied 40 hrs based on month year calendar
         */
         getCTOAlreadyAppliedHours(currentMonth.format('MM-YYYY'))
         .then(response=>{
             var data;
             setTotalMonthHours(response.data.total)
             data = response.data.total

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
                     //if available COC is greater than or equal to 40 limit only 5 days equals to 40 HRS per application
                     if(coc>=40){
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
        var year = currentMonth.format('YYYY');
        var month = currentMonth.format('MM')-1;
        // var minCTODate = new Date(year,month,1)
        // if(moment(minCTODate).format('MM-DD-YYYY') < moment(new Date()).format('MM-DD-YYYY')){
        //     var new_date = new Date();
        //     var fin_date = new Date(new_date.setDate(new_date.getDate() + 1));
        //     // setMinCTODate()
        //     setMinCTODate(fin_date)


        // }else{
        //     setMinCTODate(minCTODate)
        // }
        let minDate = new Date();
        let endDate;
        let start = 0;
        let fin_minDate;
        while(start<ctoFilingPeriod){
            endDate = minDate;
            if(moment(endDate).isBusinessDay()){
                console.log(moment(endDate).format('MM-DD-YYYY'))
                start++;
            }
            if(start !== ctoFilingPeriod){
                endDate.setDate(endDate.getDate()+1)
            }
        }
        // console.log(endDate)
        setMinCTODate(endDate)
        var maxCTODate = new Date(year,month+1,0)
        // var d = new Date(, month + 1, 0);
        // setMinCTODate(minCTODate)
        setMaxCTODate(maxCTODate)
        
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
                                    <InputLabel id="demo-simple-select-label">Type of Leave to be Availed of *</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={leaveType}
                                    label="Type of Leave to be Availed of *"
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
                                            <TextField label='Specify Illness *' sx={{marginTop:'15px'}} value = {specifyDetails} onChange={handleSetSpecifyDetails} color={specifyDetails.length ===0 ?'error':'primary'}/>
                                        :
                                            leaveType === 1 || leaveType === 2 || leaveType === 6 || leaveType === 15
                                            ?
                                            <TextField label='Specify *' sx={{marginTop:'15px'}} value = {specifyDetails} onChange={handleSetSpecifyDetails} color={specifyDetails.length ===0 ?'error':'primary'}/>
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
                                    <TextField label='Specify Illness *' sx={{marginTop:'15px'}} value = {specifyDetails} onChange={(value)=>setSpecifyDetails(value.target.value)} fullWidth/>
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
                                        height='70vh'
                                        animation="wave"
                                        />
                                    </Grid>
                                    
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
                                leaveType === 1 || leaveType === 2 || leaveType === 3 || leaveType === 14
                                ?
                                <Grid item xs={12} sm={12} md={12} lg={12} sx = {{textAlign:'center'}} >
                                <br/>
                                <Typography sx={{fontWeight:'bold',color:'#00ac10',padding:'10px',borderRadius:'5px',borderTop:'solid 1px',borderBottom:'solid 1px'}}
                                >
                                {balance.length !==0
                                ?   
                                    leaveType === 14
                                    ?
                                    <span> 
                                    AVAILABLE BALANCE: <strong>{balance} HOURS </strong></span>
                                    :
                                        leaveType === 3
                                        ?
                                        <span> 
                                    AVAILABLE BALANCE: <strong>{balance}</strong></span>
                                        :
                                            leaveType === 1 || leaveType === 2 || leaveType === 6
                                            ?
                                            <span> 
                                    AVAILABLE BALANCE: <strong>{balance}</strong> </span>
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
                            leaveType === 1 || leaveType === 2 || leaveType === 14
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
                                    false
                                } size={'small'} >Save</Button></Tooltip>
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
                            <PreviewCTOApplicationForm info={employeeInfo} auth_info={props.authInfo} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} CTOHours = {CTOHours} cto_dates = {ctodatestext} date_of_filing ={new Date()} office_head={officeHead} cto_info = {ctoInfo} onProcess = {props.onProcess} balance = {balance}/>
                        </div>
                        :
                        <div style = {{position:'relative'}}>
                        <PreviewLeaveApplication ref={leaveRef} data={allTypeOfLeaveData} auth_info = {props.authInfo} leaveType = {leaveType} info={employeeInfo} applied_days = {leaveType === 1 || leaveType === 2 || leaveType === 3 ? selectedInclusiveDates.length: leaveType === 5 ? 7:leaveType === 6 ? selectedSPL:leaveType===9?10:leaveType===10?getAllDatesInRange(selectedRehabilitationDates).length:leaveType===11?getAllDatesInRange(selectedBenefitForWomenDates).length:leaveType===15?appliedOthersDays:selectedInclusiveDates.length} leaveDetails = {leaveDetails} specifyDetails = {specifyDetails} inclusiveDates = {previewInclusiveDates} balance = {balance} signatory={signatory} vl = {balanceData.length !==0 ? balanceData[0].vl_bal:0} sl = {balanceData.length !==0 ? balanceData[0].sl_bal:0} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} office_head = {officeHead} office_ao = {officeAO} commutation = {commutation} maternity_days = {isAppliedAllocationOfMaternityLeave?105-allocationInfo.allocated_days:105} previewType='applicant' availableVL = {availableVL} availableSL = {availableSL} totalVL ={totalVL} totalSL = {totalSL} slTotalWithoutPay = {slTotalWithoutPay} slAutoWithoutPay = {slAutoWithoutPay}/>
                        </div>
                        }
                        </Box>
                        <hr/>
                        <Button variant='contained' sx={{m:2,float:'right'}} onClick = {()=> setPreviewModal(false)}>OK</Button>

                    </Box>
                </Modal>
                <div style={{ display: "none" }}><PreviewLeaveApplicationForm auth_info={props.authInfo} ref={leaveRef} data={typeOfLeaveData} leaveType = {leaveType} info={employeeInfo} applied_days = {leaveType === 1 || leaveType === 2 || leaveType === 3 ? selectedInclusiveDates.length: leaveType === 5 ? 7:leaveType === 6 ? selectedSPL:leaveType===9?10:leaveType===10?getAllDatesInRange(selectedRehabilitationDates).length:leaveType===11?getAllDatesInRange(selectedBenefitForWomenDates).length:leaveType===15?appliedOthersDays:selectedInclusiveDates.length} leaveDetails = {leaveDetails} specifyDetails = {specifyDetails} inclusiveDates = {previewInclusiveDates} balance = {balance} signatory={signatory} vl = {balanceData.length !==0 ? balanceData[0].vl_bal:0} sl = {balanceData.length !==0 ? balanceData[0].sl_bal:0} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} office_head = {officeHead} office_ao = {officeAO} commutation = {commutation} maternity_days = {isAppliedAllocationOfMaternityLeave?105-allocationInfo.allocated_days:105} previewType='applicant' availableVL = {availableVL} availableSL = {availableSL} totalVL ={totalVL} totalSL = {totalSL} slTotalWithoutPay = {slTotalWithoutPay} slAutoWithoutPay = {slAutoWithoutPay}/></div>
                <div style={{ display: "none" }}>
                    <PreviewCTOApplicationForm ref={cocRef} info={employeeInfo} auth_info={props.authInfo} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} CTOHours = {CTOHours} cto_dates = {ctodatestext} date_of_filing ={new Date()} cto_info = {ctoInfo}/>
                </div>
                </Box>
            :
            <Stack>
                <Skeleton variant="text" width={'100%'} height={'90px'} animation="wave"/>
                <Skeleton
                variant="rounded"
                width='100%'
                height='70vh'
                animation="wave"
                />
            </Stack>
        }
        </>
        
    )
}