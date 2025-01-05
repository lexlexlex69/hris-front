import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CustomCalendar } from './CustomCalendar';
export const PrintSchedule = ({list}) => {
    const [currMonth,setCurrMonth] = useState(1);
    useEffect(()=>{
        // let d_arr = getDaysArray(2024,currMonth);

        // // const cols = [];

        // // setDays(d_arr)
        // console.log(d_arr)
        // let new_arr = [];
        // let temp_arr = [];

        // d_arr.forEach((el,key)=>{
        //     if(el.dayname === 'sat' || key === d_arr.length-1){
        //         console.log(temp_arr)
        //         temp_arr.push(el)
        //         new_arr.push(temp_arr)
        //         temp_arr = [];
        //     }else{
        //         temp_arr.push(el)
        //     }
        // })
        // console.log(new_arr)
        // setDays(new_arr)
        // // setTCalendar(cols)

    },[])
    const [tCalendar,setTCalendar] = useState([])
    const getDaysArray = (year, month) => {
        var monthIndex = month - 1; // 0..11 instead of 1..12
        var names = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
        var date = new Date(year, monthIndex, 1);
        var result = [];
        while (date.getMonth() == monthIndex) {
            result.push({
                day:date.getDate(),
                date:moment(date).format('YYYY-MM-DD'),
                dayname:names[date.getDay()]
            
            });
            date.setDate(date.getDate() + 1);
        }
        return result;
    }
    const [days,setDays] = useState([]);

    const [header,setHeader] = useState(moment.weekdays())
    const [schedule,setSchedule] = useState([
        {
            date:'2024-01-01',
            time:'8am-12nn && 1pm-5pm'
        },
        {
            date:'2024-01-02',
            time:'8am-12nn && 1pm-5pm'
        },
        {
            date:'2024-01-04',
            time:'8am-12nn && 1pm-5pm'
        }
    ])
    const [mFrom,setmFrom] = useState('');
    const [mTo,setmTo] = useState('');
    const handleProceed = () => {
        let start = moment(mFrom,'YYYY-MM');
        let end = moment(mTo,'YYYY-MM');
        let arr_months = [];
        let arr_months_days = [];
        while(moment(start,'YYYY-MM').format('YYYY-MM') <= moment(end,'YYYY-MM').format('YYYY-MM')){
            arr_months.push(moment(start,'YYYY-MM').format('YYYY-MM'))
            start = moment(start,'YYYY-MM').add('months',1).format('YYYY-MM-DD');
        }

        arr_months.forEach(el=>{
            let d_arr = getDaysArray(moment(el,'YYYY-MM').format('YYYY'),moment(el,'YYYY-MM').format('M'));
            let new_arr = [];
            let temp_arr = [];

            d_arr.forEach((el2,key)=>{
                if(el2.dayname === 'sat' || key === d_arr.length-1){
                    temp_arr.push(el2)
                    new_arr.push(temp_arr)
                    temp_arr = [];
                }else{
                    temp_arr.push(el2)
                }
            })
            arr_months_days.push({
                month:el,
                data:new_arr
            })

        })
        setTCalendar(arr_months_days)
        
    }
    return (
        <Grid container spacing={1} sx={{p:1}}>
            <Grid item xs={12} sx={{display:'flex',gap:1,alignItems:'center'}}>
                <Grid item xs={4}>
                    <TextField label='From' type='month' value={mFrom} onChange={(val)=>setmFrom(val.target.value)} InputLabelProps={{shrink:true}} fullWidth/>
                </Grid>
                <Grid item xs={4}>
                    <TextField label='To' type='month' value={mTo} onChange={(val)=>setmTo(val.target.value)}  InputLabelProps={{shrink:true}} fullWidth/>
                </Grid>
                <Grid item xs={4}>
                    <Button variant='contained' size='large' fullWidth onClick={handleProceed}>Proceed</Button>
                </Grid>
            </Grid>
            
            <Grid item xs={12} sx={{maxHeight:'60vh',overflow:'auto'}}>
                {
                    tCalendar.map((item,key)=>{
                        return (
                            <Paper key={key}>
                                <CustomCalendar days = {item.data} monthName = {moment(item.month,'YYYY-MM').format('MMMM YYYY')} schedule = {schedule}/>
                            </Paper>
                        )
                    })
                }
                
                
            </Grid>
        </Grid>
    )
}