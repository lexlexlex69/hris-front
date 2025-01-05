import { Container, Typography,Grid,FormGroup ,FormControlLabel ,Checkbox,Box,Radio,FormControl,FormLabel,RadioGroup, TextField,Button,InputLabel,Select,MenuItem,Tooltip  } from '@mui/material';
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
import { getWorkSchedule,addWorkScheduleTemplate } from './WorkScheduleRequest';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlined from '@mui/icons-material/CancelOutlined';

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
    const [selectedGroupWorkingHours,setSelectedGroupWorkingHours] = React.useState('')
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
        getWorkSchedule()
        .then(response=>{
            const data = response.data.response
            // console.log(data)
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
    const saveTemplate = (event)=>{
        event.preventDefault();
        var data;
        if(templateName.length === 0){
            Swal.fire({
                icon:'info',
                title:'Please input template name'
            })
        }
        else if(workingDayScheduleType === 'Individual'){
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
                template_name:templateName
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
                template_name:templateName
            }
        }
        console.log(data)
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
                            <FormControlLabel value="Group" control={<Radio />} label="Group" onChange = {(value)=>setWorkingDayScheduleType(value.target.value)}/>
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
                                <InputLabel id="schedule-time">Working Hours</InputLabel>
                                <Select
                                    labelId="schedule-time"
                                    id="schedule-time"
                                    label="Working Hours"
                                    value = {selectedGroupWorkingHours}
                                    onChange = {(value)=>setSelectedGroupWorkingHours(value.target.value)}
                                >
                                    {workScheduleData.map((data,key)=>
                                        <MenuItem value={data} key={key}>{data.whrs_desc}</MenuItem>

                                    )}
                                </Select>
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
            <Box sx ={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Tooltip title ='Save Schedule'><Button sx={{'&:hover':{color:'white',background:green[800]}}}variant='outlined' type='submit' startIcon={<SaveOutlinedIcon/>} color='success'>Save</Button></Tooltip>
                &nbsp;
                <Button sx={{'&:hover':{color:'white',background:red[800]}}} variant='outlined' color='error' onClick={props.close} startIcon={<CancelOutlined/>}>Cancel</Button>
            </Box>
            </form>
        </Container>
    )
}