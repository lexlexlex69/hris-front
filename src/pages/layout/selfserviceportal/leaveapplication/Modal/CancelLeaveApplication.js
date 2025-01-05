import { Box, FormControlLabel, Grid, TextField,Checkbox, Button, Typography } from '@mui/material';
import moment from 'moment';
import React,{useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import { requestLeaveCancellation } from '../LeaveApplicationRequest';

export default function CancelLeaveApplication (props){
    const [dates,setDates] = useState([]);
    const [reason,setReason] = useState('');
    const [selectedDates,setSelectedDates] = useState([]);
    useEffect(()=>{
        // var arr = JSON.parse(props.data.inclusive_dates)
        // arr.forEach(el=>{
        //     el.selected=false
        // })
        // setDates(arr)

        let applied = [];
        JSON.parse(props.data.req_cancelled_dates)?.forEach(el=>{
            JSON.parse(el.date).forEach(el2=>{
                applied.push({
                    'date':el2.date,
                    'period':el2.period
                })
            })
        });
        var t_inc_dates = JSON.parse(props.data.inclusive_dates);
        var t_cancelled_dates = JSON.parse(props.data.cancel_details);

        // var f_filter = t_inc_dates.filter((el)=>{
        //     return this.indexOf(el.date) < 0;
        // },t_cancelled_dates)

        // var elmts = t_inc_dates.filter( 
        //     function(i) {
        //         console.log(this)
        //         return this.indexOf(i.date) < 0;
        //     }, 
        //     applied
        // ); 

        // console.log(elmts)

        var temp = [];
        var temp2 = [];
        t_inc_dates.forEach(el=>{
            var index = applied.map(function(e) { return e.date; }).indexOf(el.date);
            if(index > -1){
                // t_inc_dates.splice(index,1)
                // console.log(el.date)
            }else{
                temp.push(el)
            }
        })
        if(t_cancelled_dates.length>0){
            t_inc_dates.forEach(el=>{
                var index = t_cancelled_dates.map(function(e) { return e.date; }).indexOf(el.date);
                if(index > -1){
                    // t_inc_dates.splice(index,1)
                    // console.log(el.date)
                }else{
                    temp2.push(el)
                }
            })
        }else{
            temp2 = temp;
        }
        // console.log(temp2)
        setDates(temp2)
        // console.log(props.data.req_cancelled_dates)
            
    },[])
    const handleSetReason = (e) =>{
        setReason(e.target.value)
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        var temp = dates.filter((el)=>{
            return el.selected
        })
        if(temp.length===0){
            Swal.fire({
                icon:'error',
                title:'Please select a date.'
            })
        }else{
            var t_data = {
                id:props.data.leave_application_id,
                leave_type_id:props.data.leave_type_id,
                employee_id:props.data.employee_id,
                dates:temp,
                reason:reason
            }
            requestLeaveCancellation(t_data)
            .then(res=>{
                if(res.data.status === 200){
                    props.close()
                    props.setData(res.data.data)
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
                Swal.fire({
                    icon:'error',
                    title:err
                })
            })
        }
        console.log(temp)
    }
    const handleSelectDate = (index) =>{
        var temp = [...dates];
        temp[index].selected = !temp[index].selected
        setDates(temp)
    }
    return (
        <form onSubmit={handleSubmit}>
        <Box sx={{mt:1}}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <TextField label = 'Reason for cancellation' value={reason} onChange={handleSetReason} fullWidth required/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'column'}}>
                    <Typography>Dates:</Typography>
                    {
                        dates.length>0
                        ?
                        dates.map((item,key)=>
                            <FormControlLabel key={key} control={<Checkbox checked={item.selected} onChange={()=>handleSelectDate(key)}/>} label={`${moment(item.date).format('MMMM DD, YYYY')+' '+(item.period ==='NONE'?'':item.period)}`}/>
                        )
                        :
                        <Typography sx={{fontSize:'.8rem',fontStyle:'italic',textAlign:'center'}}>No date/ available...</Typography>
                    }
                    <hr/>

                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant='contained' size='small' color='success' className='custom-roundbutton' type='submit'>Submit request</Button>
                    <Button variant='contained' size='small' color='error' className='custom-roundbutton' onClick={props.close}>Cancel</Button>
                </Grid>
            </Grid>
        </Box>
        </form>
    )
}