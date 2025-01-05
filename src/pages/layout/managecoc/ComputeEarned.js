import { Grid, TextField } from '@mui/material';
import React, {useEffect, useState} from 'react';
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import InputIcon from "react-multi-date-picker/components/input_icon"
import Typography from '@mui/material/Typography';
import moment from 'moment';

export default function ComputeEarned(){
    const [overTimeDates,setOverTimeDates] = useState([])
    const [weekDayFrom,setWeekDayFrom] = useState('')
    const [weekDayTo,setWeekDayTo] = useState('')
    const [weekEndFrom,setWeekEndFrom] = useState('')
    const [weekEndTo,setWeekEndTo] = useState('')
    const handleSetoverTimeDates = (value) =>{
        setOverTimeDates(value)
    }
    useEffect(()=>{
        console.log(moment(new Date()).subtract(1,'months').date(1))
        console.log(moment(new Date()).date(0))
    },[])
    return(
        <Grid container sx={{p:2}}>
            <Grid item xs={12}> 
                <Typography>Overtime Dates</Typography>
                <DatePicker
                value = {overTimeDates}
                onChange = {handleSetoverTimeDates}
                multiple
                plugins={[
                <DatePanel />
                ]}
                minDate={moment(moment(new Date()).subtract(1,'months').date(1)).format('YYYY-MM-DD')}
                maxDate={moment(moment(new Date()).date(0)).format('YYYY-MM-DD')}
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
                // mapDays={({ date }) => {
                    
                //     return props
                // }}
                
            />
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textAlign:'center'}}>Time Schedule</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Weekdays</Typography>
                <Grid item container>
                    <Grid item xs={6}>
                        <TextField type='time' label='From' fullWidth InputLabelProps={{shrink
                        :true}} value = {weekDayFrom} onChange = {(value)=>setWeekDayFrom(value.target.value)}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField type='time' label='To' fullWidth InputLabelProps={{shrink
                        :true}} value = {weekDayTo} onChange = {(value)=>setWeekDayTo(value.target.value)}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography>Weekends</Typography>

                <Grid item container>
                    <Grid item xs={6}>
                        <TextField type='time' label='From' fullWidth InputLabelProps={{shrink
                        :true}} value = {weekEndFrom} onChange = {(value)=>setWeekEndFrom(value.target.value)}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField type='time' label='To' fullWidth InputLabelProps={{shrink
                        :true}} value = {weekEndTo} onChange = {(value)=>setWeekEndTo(value.target.value)}/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}