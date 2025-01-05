import { Container, Typography,Grid,FormGroup ,FormControlLabel ,Checkbox,Box,Radio,FormControl,FormLabel,RadioGroup, TextField,Button,InputLabel,Select,MenuItem,Tooltip, Autocomplete  } from '@mui/material';
import React, { useEffect } from 'react';
import moment from 'moment';
// import DatePicker from 'react-multi-date-picker';
// import DatePanel from "react-multi-date-picker/plugins/date_panel"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { blue, green, red, yellow } from '@mui/material/colors'

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';
import { getWorkSchedule,addWorkScheduleTemplate, getWorkScheduleAPI } from './WorkScheduleRequest';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { api_url } from '../../../request/APIRequestURL';
import { toast } from 'react-toastify';

var momentBusinessDays = require('moment-business-days');
export default function AddTemplate(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [templateName,setTemplateName] = React.useState('')
    const [selectedDate, setSelectedDate] = React.useState([]);
    const [plotType,setPlotType] = React.useState('specificdate');
    const [daysType,setDaysType] = React.useState('weekdays');
    const [specificDatesValue,setSpecificDatesValue] = React.useState([])
    const [multipleMonthsValue,setMultipleMonthsValue] = React.useState([])
    const [scheduleIn,setScheduleIn] = React.useState('08:00')
    const [scheduleOut,setScheduleOut] = React.useState('17:00')
    const [workScheduleData,setWorkScheduleData] = React.useState([])
    const [selectedGroupWorkingHours,setSelectedGroupWorkingHours] = React.useState(null)
    const [disableSubmit,setDisableSubmit] = React.useState(false)
    useEffect(()=>{
        // var date = new Date();
        // var from = new Date();
        // var to = date.setDate(date.getDate()+5);
        // var dates = [];
        // while(from <= to){
        //     dates.push(moment(from).format('MMMM DD YYYY'));
        //     from.setDate(from.getDate() + 1);
        // }
        // setSelectedDate(dates)
        
        // var current_date = new Date()
        // var date = new Date(moment(current_date).format('YYYY'), moment(current_date).format('MM')-1, 1);
        // var month = moment(date).format('MM')-1;
        // var year = moment(date).format('YYYY');
        // var days = []
        // while(date.getMonth() === month){
        //     days.push(moment(date).format('MM-DD-YYYY'))
        //     date.setDate(date.getDate()+1)
        // }
        // setSelectedDate(days)
        var t_data = {
            api_url:api_url
        }
        getWorkScheduleAPI(t_data)
        .then(response=>{
            const data = response.data.response
            console.log(data)
            setWorkScheduleData(data)
        }).catch(error=>{
            console.log(error)
        })
        
    },[])
    const setDates = (dates) => {
        setSelectedDate(dates)
    };
    const handleSetSpecificDates = (value) => {
        setSpecificDatesValue(value)
    }
    const handleSetMultipleMonths = (value) => {
        setMultipleMonthsValue(value)
    }
    
    const [startDate, setStartDate] = React.useState(new Date());
    const [workingDays,setWorkingDays] = React.useState({
        Sunday:false,
        Monday:false,
        Tuesday:false,
        Wednesday:false,
        Thursday:false,
        Friday:false,
        Saturday:false,
    })
    const [restDays,setRestDays] = React.useState({
        Sunday:false,
        Monday:false,
        Tuesday:false,
        Wednesday:false,
        Thursday:false,
        Friday:false,
        Saturday:false,
    })
    const handleSetWorkingDays = (event)=>{
        setWorkingDays({
            ...workingDays,
            [event.target.name]: event.target.checked,
          });
    }
    useEffect(()=>{
        if(workingDayScheduleType){
            if(workingDayScheduleType === 'Group')
            if(selectedGroupWorkingHours){
                /**
                check if working hours is equal or greater than to 40hrs (days*working hrs)
                */
                var h1=moment(selectedGroupWorkingHours.whrs_time1,'hh:mm:ss');
                var h2=moment(selectedGroupWorkingHours.whrs_time2,'hh:mm:ss');
                var h3=moment(selectedGroupWorkingHours.whrs_time3,'hh:mm:ss');
                var h4=moment(selectedGroupWorkingHours.whrs_time4,'hh:mm:ss');


                /**
                check if has break out and break in
                */
                var am_total = 0;
                var pm_total = 0;
                var am_pm_total = 0;
                
                if(selectedGroupWorkingHours && selectedGroupWorkingHours.whrs_time3){
                    var am_hrs = (moment(h2).diff(h1,'hours'))*60;
                    var pm_hrs = (moment(h4).diff(h3,'hours'))*60;
                    var am_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                    var pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                    am_total = parseInt(am_hrs)+parseInt(am_mins);
                    pm_total = parseInt(pm_hrs)+parseInt(pm_mins);
                    am_pm_total = am_total+pm_total;

                }else{
                    var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                    var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                    am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                }
                var t_total_days = 0;
                if(workingDays.Sunday === true){
                    t_total_days+=1;
                }
                if(workingDays.Monday === true){
                    t_total_days+=1;
                }
                if(workingDays.Tuesday === true){
                    t_total_days+=1;
                }
                if(workingDays.Wednesday === true){
                    t_total_days+=1;
                }
                if(workingDays.Thursday === true){
                    t_total_days+=1;
                }
                if(workingDays.Friday === true){
                    t_total_days+=1;
                }
                if(workingDays.Saturday === true){
                    t_total_days+=1;
                }
                /**
                Compute total hours per week base on selected working hours and days
                */
                var t_total_working_hrs = (am_pm_total*t_total_days);
                if(t_total_working_hrs<2400){
                    toast.warning('Work schedule is less than to 40 hours per week.')
                    // Swal.fire({
                    //     icon:'warning',
                    //     title:'Oops...',
                    //     html:'Work schedule is less than to 40 hours per week. Please review working days and working hours.'
                    // })
                    // setDisableSubmit(true)
                }else{
                    // setDisableSubmit(false)
                }
                    setDisableSubmit(false)

            }else{
                /**
                Check if all working days was set
                */
                var t_total = workingDaysArray.filter((el)=>{
                    return el.whrs_data !==''
                })
                if(t_total.length === workingDaysArray.length){
                    /**
                    Loop working days to get the working hours
                    */
                    var am_total = 0;
                    var pm_total = 0;
                    var am_pm_total = 0;
                    var t_total_days = workingDaysArray.length;

                    workingDaysArray.forEach(el => {
                        /**
                        check if working hours is equal or greater than to 40hrs (days*working hrs)
                        */
                        var h1=moment(el.whrs_data.whrs_time1,'hh:mm:ss');
                        var h2=moment(el.whrs_data.whrs_time2,'hh:mm:ss');
                        var h3=moment(el.whrs_data.whrs_time3,'hh:mm:ss');
                        var h4=moment(el.whrs_data.whrs_time4,'hh:mm:ss');


                        /**
                        check if has break out and break in
                        */
                        
                        
                        if(el.whrs_data.whrs_time1 === el.whrs_data.whrs_time2 && el.whrs_data.whrs_time3 === el.whrs_data.whrs_time4){
                            var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                            var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                            am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                        }else if(el.whrs_data.whrs_time1 && el.whrs_data.whrs_time3){
                            var am_hrs = (moment(h2).diff(h1,'hours'))*60;
                            var pm_hrs = (moment(h4).diff(h3,'hours'))*60;
                            var am_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                            var pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                            am_total = parseInt(am_hrs)+parseInt(am_mins);
                            pm_total = parseInt(pm_hrs)+parseInt(pm_mins);
                            am_pm_total = am_total+pm_total;

                        }else if(el.whrs_data.whrs_time1 && el.whrs_data.whrs_time2){
                            var am_pm_hrs = (moment(h1).diff(h2,'hours'))*60;
                            console.log(am_pm_hrs)

                            var am_pm_mins = moment.utc(moment(h1, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                            am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);

                        }else if(el.whrs_data.whrs_time2 && el.whrs_data.whrs_time3){
                           if(el.whrs_data.whrs_time2>el.whrs_data.whrs_time3){
                                var am_pm_hrs = (moment(h2).diff(h3,'hours'))*60;
                                var am_pm_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                            }else{
                                var am_pm_hrs = (moment(h3).diff(h2,'hours'))*60;
                                var am_pm_mins = moment.utc(moment(h3, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                            }
                            am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                        }else{
                            var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                            var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                            am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                        }
                    });
                    console.log(am_pm_total)
                    /**
                    Compute total hours per week base on selected working hours and days
                    */
                    var t_total_working_hrs = (am_pm_total*t_total_days);
                    console.log(t_total_working_hrs)

                    if(t_total_working_hrs<2400){
                        toast.warning('Work schedule is less than to 40 hours per week.')
                        // Swal.fire({
                        //     icon:'warning',
                        //     title:'Oops...',
                        //     html:'Work schedule is less than to 40 hours per week. Please review working days and working hours.'
                        // })
                        // setDisableSubmit(true)
                    }else{
                        // setDisableSubmit(false)
                    }
                    setDisableSubmit(false)

                }
            }
        }
        
    },[workingDays])
    const handleSetRestDays = (event)=>{
        setRestDays({
            ...restDays,
            [event.target.name]: event.target.checked,
          });
    }
    const [workingDaysArray,setWorkingDaysArray] = React.useState([])
    const [restDaysArray,setRestDaysArray] = React.useState([])
    const [workingDayScheduleType,setWorkingDayScheduleType] = React.useState('')
    useEffect(()=>{
        var tempArr = {...workingDays};
        var work_days = [];
        var rest_days = [];
        // tempArr.forEach(el=>{
        //     if(el){
        //         temp.push(el)
        //     }
        // })
        for(var key in tempArr){
            if(tempArr[key]){
                work_days.push({
                    day:key,
                    whrs_data:''
                })
            }else{
                rest_days.push({
                    day:key
                })
            }
        }
        setWorkingDaysArray(work_days)
        setRestDaysArray(rest_days)
    },[workingDays])
    const handleIndividualWorkSchedule = (key,value) =>{

        var data = [...workingDaysArray];
        data[key].whrs_data = value;
        setWorkingDaysArray(data)
    }
    useEffect(()=>{
        if(workingDayScheduleType){
            /**
            Check if all working days was set
            */
            var t_total = workingDaysArray.filter((el)=>{
                return el.whrs_data !==''
            })
            console.log(workingDaysArray)
            if(t_total.length === workingDaysArray.length){
                /**
                Loop working days to get the working hours
                */
                var am_total = 0;
                var pm_total = 0;
                var am_pm_total = 0;
                var t_total_days = workingDaysArray.length;

                workingDaysArray.forEach(el => {
                    /**
                    check if working hours is equal or greater than to 40hrs (days*working hrs)
                    */
                    var h1=moment(el.whrs_data.whrs_time1,'hh:mm:ss');
                    var h2=moment(el.whrs_data.whrs_time2,'hh:mm:ss');
                    var h3=moment(el.whrs_data.whrs_time3,'hh:mm:ss');
                    var h4=moment(el.whrs_data.whrs_time4,'hh:mm:ss');


                    /**
                    check if has break out and break in
                    */
                    
                    
                    if(el.whrs_data.whrs_time1 === el.whrs_data.whrs_time2 && el.whrs_data.whrs_time3 === el.whrs_data.whrs_time4){
                        var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                        var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                        am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                    }else if(el.whrs_data.whrs_time1 && el.whrs_data.whrs_time3){
                        var am_hrs = (moment(h2).diff(h1,'hours'))*60;
                        var pm_hrs = (moment(h4).diff(h3,'hours'))*60;
                        var am_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                        var pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                        am_total = parseInt(am_hrs)+parseInt(am_mins);
                        pm_total = parseInt(pm_hrs)+parseInt(pm_mins);
                        am_pm_total = am_total+pm_total;

                    }else if(el.whrs_data.whrs_time1 && el.whrs_data.whrs_time2){
                        var am_pm_hrs = (moment(h1).diff(h2,'hours'))*60;
                        console.log(am_pm_hrs)

                        var am_pm_mins = moment.utc(moment(h1, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                        am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);

                    }else if(el.whrs_data.whrs_time2 && el.whrs_data.whrs_time3){
                        if(el.whrs_data.whrs_time2>el.whrs_data.whrs_time3){
                            var am_pm_hrs = (moment(h2).diff(h3,'hours'))*60;
                            var am_pm_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                        }else{
                            var am_pm_hrs = (moment(h3).diff(h2,'hours'))*60;
                            var am_pm_mins = moment.utc(moment(h3, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                        }
                        am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                    }else{
                        // var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                        var am_pm_hrs =parseInt(moment.utc(moment(h4, "HH:mm").diff(moment(h1, "HH:mm"))).format("HH"))*60
                        console.log('here')
                        var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                        am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
                    }
                });
                /**
                Compute total hours per week base on selected working hours and days
                */
                console.log(am_pm_total)
                console.log(t_total_working_hrs)
                var t_total_working_hrs = (am_pm_total*t_total_days);
                if(t_total_working_hrs<2400){
                    toast.warning('Work schedule is less than to 40 hours per week.')
                    // Swal.fire({
                    //     icon:'warning',
                    //     title:'Oops...',
                    //     html:'Work schedule is less than to 40 hours per week. Please review working days and working hours.'
                    // })
                    // setDisableSubmit(true)
                }else{
                    // setDisableSubmit(false)
                }
                    setDisableSubmit(false)

            }
        }
        
    },[workingDaysArray])
    const saveTemplate = (event)=>{
        event.preventDefault();
        var data;
        console.log(workingDaysArray)
        if(templateName.length === 0){
            Swal.fire({
                icon:'error',
                title:'Please input template name'
            })
        }
        else if(workingDaysArray.length === 0){
            Swal.fire({
                icon:'error',
                title:'Please select working days'
            })
        }else{
            if(workingDayScheduleType){
                if(workingDayScheduleType === 'Individual'){
                    var temp_work_days = []
                    workingDaysArray.forEach(el=>{
                        temp_work_days.push(
                            {
                                day:el.day,
                                whrs_desc:el.whrs_data.whrs_desc,
                                whrs_code:el.whrs_data.whrs_code,
                                time_in:el.whrs_data.whrs_time1,
                                break_out:el.whrs_data.whrs_time2,
                                break_in:el.whrs_data.whrs_time3,
                                time_out:el.whrs_data.whrs_time4,
                            }
                        )
                    })
                    data  = {
                        work_days:temp_work_days,
                        rest_days:restDaysArray,
                        template_name:templateName,
                        adjust_sched_min:selectedGroupWorkingHours?selectedGroupWorkingHours.adjust_sched_min?selectedGroupWorkingHours.adjust_sched_min:0:0
                    }
                }else{
                    var temp_work_days = [];
                    workingDaysArray.forEach(el=>{
                        temp_work_days.push({
                            day:el.day,
                            whrs_code:selectedGroupWorkingHours.whrs_code,
                            whrs_desc:selectedGroupWorkingHours.whrs_desc,
                            time_in:selectedGroupWorkingHours.whrs_time1,
                            break_out:selectedGroupWorkingHours.whrs_time2,
                            break_in:selectedGroupWorkingHours.whrs_time3,
                            time_out:selectedGroupWorkingHours.whrs_time4,

                        })
                    })
                    data = {
                        work_days:temp_work_days,
                        rest_days:restDaysArray,
                        template_name:templateName,
                        adjust_sched_min:selectedGroupWorkingHours?selectedGroupWorkingHours.adjust_sched_min?selectedGroupWorkingHours.adjust_sched_min:0:0
                    }
                }
                console.log(data)
                Swal.fire({
                    icon:'info',
                    title:'Saving new template',
                    html:'Please wait...'
                })
                Swal.showLoading()
                addWorkScheduleTemplate(data)
                .then(response=>{
                    const data = response.data
                    console.log(data)
                    if(response.data.status === 200){
                        props.close()
                        props.onUpdateTemplate()
                        setTemplateName('')
                        Swal.fire({
                            icon:'success',
                            title:response.data.message,
                            showConfirmButton:false,
                            timer:1500
                        })
                    }else{
                        setTemplateName('')
                        Swal.fire({
                            icon:'error',
                            title:response.data.message
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Please select working days schedule type'
                })
            }
            
        }
        

        
    }
    const handleWorkingHours = (val)=>{
        console.log(val)
        if(!val){
            setSelectedGroupWorkingHours(val)
        }else{
            /**
            check if working hours is equal or greater than to 40hrs (days*working hrs)
            */
            var h1=moment(val.whrs_time1,'hh:mm:ss');
            var h2=moment(val.whrs_time2,'hh:mm:ss');
            var h3=moment(val.whrs_time3,'hh:mm:ss');
            var h4=moment(val.whrs_time4,'hh:mm:ss');

            /**
            check if has break out and break in
            */
            var am_total = 0;
            var pm_total = 0;
            var am_pm_total = 0;
            console.log(val.whrs_time2)
            console.log(val.whrs_time3)
            if(val.whrs_time1 === val.whrs_time2 && val.whrs_time3 === val.whrs_time4){
                var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
            }else if(val.whrs_time1 && val.whrs_time3){
                var am_hrs = (moment(h2).diff(h1,'hours'))*60;
                var pm_hrs = (moment(h4).diff(h3,'hours'))*60;
                var am_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                var pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                am_total = parseInt(am_hrs)+parseInt(am_mins);
                pm_total = parseInt(pm_hrs)+parseInt(pm_mins);
                am_pm_total = am_total+pm_total;
            }else if(val.whrs_time1 &&val.whrs_time2){
                var am_pm_hrs = (moment(h1).diff(h2,'hours'))*60;
                var am_pm_mins = moment.utc(moment(h1, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);

            }else if(val.whrs_time2 &&val.whrs_time3){
                if(val.whrs_time2>val.whrs_time3){
                    var am_pm_hrs = (moment(h2).diff(h3,'hours'))*60;
                    var am_pm_mins = moment.utc(moment(h2, "HH:mm:ss").diff(moment(h3, "HH:mm:ss"))).format("mm")
                }else{
                    var am_pm_hrs = (moment(h3).diff(h2,'hours'))*60;
                    var am_pm_mins = moment.utc(moment(h3, "HH:mm:ss").diff(moment(h2, "HH:mm:ss"))).format("mm")
                }
                am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
            }else{
                // var am_pm_hrs = (moment(h4).diff(h1,'hours'))*60;
                var am_pm_hrs = parseInt(moment.utc(moment(h4, "HH:mm").diff(moment(h1, "HH:mm"))).format('HH'))*60
                var am_pm_mins = moment.utc(moment(h4, "HH:mm:ss").diff(moment(h1, "HH:mm:ss"))).format("mm")
                am_pm_total = parseInt(am_pm_hrs)+parseInt(am_pm_mins);
            }

            var t_total_days = 0;
            if(workingDays.Sunday === true){
                t_total_days+=1;
            }
            if(workingDays.Monday === true){
                t_total_days+=1;
            }
            if(workingDays.Tuesday === true){
                t_total_days+=1;
            }
            if(workingDays.Wednesday === true){
                t_total_days+=1;
            }
            if(workingDays.Thursday === true){
                t_total_days+=1;
            }
            if(workingDays.Friday === true){
                t_total_days+=1;
            }
            if(workingDays.Saturday === true){
                t_total_days+=1;
            }
            /**
            Compute total hours per week base on selected working hours and days
            */
            var t_total_working_hrs = (am_pm_total*t_total_days);
            if(t_total_working_hrs>=2400){
                // setSelectedGroupWorkingHours(val)
                // setDisableSubmit(false)
            }else{
                // Swal.fire({
                //     icon:'warning',
                //     title:'Oops...',
                //     html:'Work schedule is less than to 40 hours per week. Please review working days and working hours.'
                // })
                toast.warning('Work schedule is less than to 40 hours per week.')
                // setDisableSubmit(true) 
            }
            setSelectedGroupWorkingHours(val)

            setDisableSubmit(false)

        }
        
        console.log(t_total_working_hrs)
        // console.log(workingDays.length)
        // console.log(am_pm_total)
    }
    return(
        <Container>
            <form onSubmit={saveTemplate}>
            <Box sx={{height:'60vh',maxHeight:'70vh',overflowY:'scroll',marginTop:'20px',padding:'10px'}}>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                        <TextField type='text' variant='outlined' label='Template Name' fullWidth value = {templateName} onChange = {(value)=>setTemplateName(value.target.value)} required/>
                </Grid>
                <Grid item xs={12}>
                    <FormLabel id="enabled-radio-buttons-group-label">Working Days</FormLabel>
                    <FormGroup
                        sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-around'}}
                        required
                    >
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Sunday}
                            onChange={handleSetWorkingDays}
                            disabled={restDays.Sunday?true:false}
                            name="Sunday"
                            />
                            }
                            label="Sunday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Monday}
                            onChange={handleSetWorkingDays}
                            disabled={restDays.Monday?true:false}
                            name="Monday"/>
                            }
                            label="Monday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Tuesday}
                            onChange={handleSetWorkingDays}
                            disabled={restDays.Tuesday?true:false}
                            name="Tuesday"/>
                            }
                            label="Tuesday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Wednesday}
                            onChange={handleSetWorkingDays}
                            disabled={restDays.Wednesday?true:false}
                            name="Wednesday"/>
                            }
                            label="Wednesday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Thursday}
                            onChange={handleSetWorkingDays}
                            disabled={restDays.Thursday?true:false}
                            name="Thursday"/>
                            }
                            label="Thursday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Friday}
                            onChange={handleSetWorkingDays}
                            disabled={restDays.Friday?true:false}
                            name="Friday"/>
                            }
                            label="Friday"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                            checked={workingDays.Saturday}
                            onChange={handleSetWorkingDays}
                            disabled={restDays.Saturday?true:false}
                            name="Saturday"/>
                            }
                            label="Saturday"
                        />
                    </FormGroup>
                </Grid>
                {
                    workingDaysArray.length !==0
                    ?
                    <Grid item xs={12}>
                        <FormLabel id="schedule-type">Working Days Schedule Type</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="schedule-type"
                            name="schedule-type-radio"
                        >
                            <FormControlLabel value="Individual" control={<Radio />} label="Individual" onChange = {(value)=>setWorkingDayScheduleType(value.target.value)}/>
                            <FormControlLabel value="Group" control={<Radio />} label="Group" onChange = {(value)=>setWorkingDayScheduleType(value.target.value)} required/>
                        </RadioGroup>
                    </Grid>
                    :
                    ''
                }
                
                {
                
                    workingDayScheduleType.length !==0
                    ?
                        workingDayScheduleType === 'Individual'
                        ?
                        <Grid item xs={12}>
                        {
                        workingDaysArray.map((data,key)=>
                        <FormControl fullWidth key = {key} sx={{marginBottom:'10px'}}>
                            <InputLabel id={"schedule-time"+key}>{data.day}</InputLabel>
                            <Select
                                labelId={"schedule-time"+key}
                                id={"schedule-time"+key}
                                label={data.day}
                                value={data.whrs_data}
                                onChange = {(value)=>handleIndividualWorkSchedule(key,value.target.value)}
                                required
                            >
                                {workScheduleData.map((data,key)=>
                                    <MenuItem value={data} key={key}>{data.whrs_desc}</MenuItem>

                                )}
                            </Select>
                            </FormControl>
                        )}
                        </Grid>
                        :
                            workingDayScheduleType === 'Group'
                            ?
                            <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    disablePortal
                                    id="whrs-box"
                                    options={workScheduleData}
                                    getOptionLabel={(option) => option.whrs_desc}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} label="Working Hours" required/>}
                                    value={selectedGroupWorkingHours}
                                    onChange={(event,newValue)=>{
                                        handleWorkingHours(newValue)
                                    }}
                                    required
                                />
                                {/* <InputLabel id="schedule-time">Working Hours</InputLabel>
                                <Select
                                    labelId="schedule-time"
                                    id="schedule-time"
                                    label="Working Hours"
                                    value = {selectedGroupWorkingHours}
                                    onChange = {handleWorkingHours}
                                    required
                                >
                                    {workScheduleData.map((data,key)=>
                                        <MenuItem value={data} key={key}>{data.whrs_desc}</MenuItem>

                                    )}
                                </Select> */}
                                </FormControl>
                            </Grid>
                            :
                            ''
                    :
                    ''
                }
            </Grid>
            </Box>
            <hr/>
            <Box sx ={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:1}}>
                <Tooltip title ='Save Schedule'><span><Button variant='contained' className='custom-roundbutton' type='submit' color='success' disabled={disableSubmit}>Save</Button></span></Tooltip>
                <Button variant='contained' className='custom-roundbutton' color='error' onClick={props.close} >Cancel</Button>
            </Box>
            </form>
        </Container>
    )
}