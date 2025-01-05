import { Container, Grid, Typography,Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import './DTR.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
export const ViewDTR = React.forwardRef((props,ref)=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [timeStamp,setTimeStamp] = useState(new Date());
    const [rowToAdd,setRowToAdd] = React.useState([])
    useEffect(() => {
        const timer = setInterval(() => { // Creates an interval which will update the current data every minute
        // This will trigger a rerender every component that uses the useDate hook.
        setTimeStamp(new Date());
        // console.log(new Date())
      }, 1000);
      return () => {
        clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
      }
    }, []);
    useEffect(()=>{
        var start = props.dtrdata.length;
        var end = 31;
        var row_number = [];
        var count = 0;
        while(start < end){
            row_number.push(count);
            start++;
            count++;
        }
        setRowToAdd(row_number);
        // console.log(row_number)
    },[props.dtrdata])
    const getDayInfo = (date)=>{
        var time_in = '';
        var break_out = '';
        var break_in = '';
        var time_out = '';
        var half_break = '';
        var late_minutes = '';
        var under_time = '';
        var is_weekend = false;
        var is_holiday = false;
        var sched_in = '';
        var adjust_in = false;
        var adjust_out = false;
        var is_schedin_leave = false;
        var is_schedout_leave = false;
        var adjust_out = false;
        var adjust_break_in = false;
        var adjust_break_out = false;
        props.dtrdata.forEach(element => {
            if(moment(date).format('YYYY-MM-DD') === element.work_date){
                var break_data = element.half_break.split(';');
                
                var schedin_isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(element.sched_in, 'H:mm').format('H:mm'));
                var schedout_isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(element.sched_out, 'H:mm').format('H:mm'));
                
                if(element.sched_out === 'REST DAY'){
                    if(element.time_in.length ===0 && element.time_out.length ===0 && break_data[0].length === 0 && break_data[1].length ===0){
                        under_time = '-';
                        late_minutes = '-';
                        is_weekend = true;
                        sched_in = element.sched_in+'S';
                    }else{
                        var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                        var hours = (num / 60);
                        var rhours = Math.floor(hours);
                        var minutes = (hours - rhours) * 60;
                        var rminutes = Math.round(minutes);
    
                        if(element.adjust_in){
                            adjust_in = true;
                        }
                        if(element.adjust_out){
                            adjust_out = true;
                        }
                        if(element.adjust_break_in){
                            adjust_break_in = true;
                        }
                        if(element.adjust_break_out){
                            adjust_break_out = true;
                        }
    
                        time_in = element.time_in;
                        time_out = element.time_out;
                        break_out = break_data[0].length ===0 ?null:break_data[0];
                        break_in = break_data[1].length ===0 ?null:break_data[1];
                        if(late_minutes === 0){
                            late_minutes = '-';

                        }else{
                            late_minutes = rminutes;
                        }
                        if(under_time === 0){
                            under_time = '-';
                        }else{
                            under_time = rhours;
                        }
                        // var break_data = element.half_break.split(';');
                        break_out = break_data[0];
                        break_in = break_data[1];
                    }
                    
                }else if(element.sched_in === 'NATIONAL' || element.sched_out === 'HOLIDAY'){
                    // under_time = '-';
                    // late_minutes = '-';
                    // is_holiday = true;
                    // sched_in = element.sched_in+' '+element.sched_out;
                    if(element.time_in.length ===0 && break_data[0].length === 0 && element.time_out.length ===0 &&break_data[1].length ===0){
                        sched_in = element.sched_in+' '+element.sched_out
                        under_time = '-';
                        late_minutes = '-';
                        is_holiday = true;
                    }else{
                        time_in = element.time_in.length?element.time_in:null;
                        break_out = break_data[0].length ===0 ?null:break_data[0];
                        break_in = break_data[1].length ===0 ?null:break_data[1];
                        time_out = element.time_out.length?element.time_out:null;
                        
                        var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                        var hours = (num / 60);
                        var rhours = Math.floor(hours);
                        var minutes = (hours - rhours) * 60; 
                        var rminutes = Math.round(minutes);

                        if(late_minutes === 0){
                            late_minutes = '-';

                        }else{
                            late_minutes = rminutes;
                        }
                        if(under_time === 0){
                            under_time = '-';
                        }else{
                            under_time = rhours;
                        }
                    }
                }else if(element.sched_in === 'LOCAL' || element.sched_out === 'HOLIDAY'){
                    // under_time = '-';
                    // late_minutes = '-';
                    // is_holiday = true;
                    // sched_in = element.sched_in+' '+element.sched_out;
                    if(element.time_in.length ===0 && break_data[0].length === 0 && element.time_out.length ===0 &&break_data[1].length ===0){
                        sched_in = element.sched_in+' '+element.sched_out
                        under_time = '-';
                        late_minutes = '-';
                        is_holiday = true;
                    }else{
                        time_in = element.time_in.length?element.time_in:null;
                        break_out = break_data[0].length ===0 ?null:break_data[0];
                        break_in = break_data[1].length ===0 ?null:break_data[1];
                        time_out = element.time_out.length?element.time_out:null;
                        
                        var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                        var hours = (num / 60);
                        var rhours = Math.floor(hours);
                        var minutes = (hours - rhours) * 60; 
                        var rminutes = Math.round(minutes);

                        if(late_minutes === 0){
                            late_minutes = '-';

                        }else{
                            late_minutes = rminutes;
                        }
                        if(under_time === 0){
                            under_time = '-';
                        }else{
                            under_time = rhours;
                        }
                    }
                }else{
                    if(schedin_isValid || (element.time_in.trim().length !== 0 && break_data[0].trim().length !==0)){
                        var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                        var hours = (num / 60);
                        var rhours = Math.floor(hours);
                        var minutes = (hours - rhours) * 60;
                        var rminutes = Math.round(minutes);
    
                        if(element.adjust_in){
                            adjust_in = true;
                        }
                        if(element.adjust_out){
                            adjust_out = true;
                        }
                        if(element.adjust_break_in){
                            adjust_break_in = true;
                        }
                        if(element.adjust_break_out){
                            adjust_break_out = true;
                        }
    
                        time_in = element.time_in;
                        time_out = element.time_out;
    
                        if(late_minutes === 0){
                            late_minutes = '-';

                        }else{
                            late_minutes = rminutes;
                        }
                        if(under_time === 0){
                            under_time = '-';
                        }else{
                            under_time = rhours;
                        }
                        // var break_data = element.half_break.split(';');
                        break_out = break_data[0];
                        // break_in = break_data[1];
                    }else{
                        under_time = '-';
                        late_minutes = '-';
                        time_in = element.sched_in;
                        break_out = element.sched_in;
                        is_schedin_leave = true;
                    }
                    if(schedout_isValid || (element.time_out.trim().length !== 0 && break_data[1].trim().length !==0)){
                        var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                        var hours = (num / 60);
                        var rhours = Math.floor(hours);
                        var minutes = (hours - rhours) * 60;
                        var rminutes = Math.round(minutes);
    
                        if(element.adjust_in){
                            adjust_in = true;
                        }
                        if(element.adjust_out){
                            adjust_out = true;
                        }
                        if(element.adjust_break_in){
                            adjust_break_in = true;
                        }
                        if(element.adjust_break_out){
                            adjust_break_out = true;
                        }
    
                        // time_in = element.time_in;
                        time_out = element.time_out;
    
                        if(late_minutes === 0){
                            late_minutes = '-';

                        }else{
                            late_minutes = rminutes;
                        }
                        if(under_time === 0){
                            under_time = '-';
                        }else{
                            under_time = rhours;
                        }
                        // var break_data = element.half_break.split(';');
                        // break_out = break_data[0];
                        break_in = break_data[1];
                    }else{
                        under_time = '-';
                        late_minutes = '-';
                        break_in = element.sched_out;
                        time_out = element.sched_out;
                        is_schedout_leave = true
                    }
                    
                }
            }
        });
        if(is_weekend){
            return(
                <>
                    <td colSpan={4}>{sched_in}</td>
                    <td>{under_time}</td>
                    <td>{late_minutes}</td>
                </>
            )
        }else if(is_holiday){
            return(
                <>
                    <td colSpan={4}><span style = {{color:'red'}}>{sched_in}</span></td>
                    <td>{under_time}</td>
                    <td>{late_minutes}</td>
                </>
            )
        }else{
            return(
                <>
                    <td><span style ={{fontWeight:adjust_in || is_schedin_leave?'bold':'auto'}} className={is_schedin_leave?time_in.length >3?'leave-text':'':''}> {time_in}</span></td>
                    <td><span style ={{fontWeight:adjust_break_out || is_schedin_leave?'bold':'auto'}} className={is_schedin_leave?time_in.length >3?'leave-text':'':''}> {break_out}</span></td>
                    <td><span style ={{fontWeight:adjust_break_in || is_schedout_leave?'bold':'auto'}} className={is_schedout_leave?time_in.length >3?'leave-text':'':''}> {break_in}</span></td>
                    <td><span style ={{fontWeight:adjust_out || is_schedout_leave?'bold':'auto'}} className={is_schedout_leave?time_in.length >3?'leave-text':'':''}> {time_out} </span> </td>
                    <td>{under_time>0 ?under_time:'-'}</td>
                    <td>{late_minutes>0 ?late_minutes:'-'}</td>
                </>
            )
        }
        // if(is_weekend){
        //     return(
        //         <>
        //             <TableCell colSpan={4}>{sched_in}</TableCell>
        //             <TableCell>{under_time}</TableCell>
        //             <TableCell>{late_minutes}</TableCell>
        //         </>
        //     )
        // }else{
        //     return(
        //         <>
        //             <TableCell>{time_in}</TableCell>
        //             <TableCell>{break_out}</TableCell>
        //             <TableCell>{break_in}</TableCell>
        //             <TableCell>{time_out}</TableCell>
        //             <TableCell>{under_time}</TableCell>
        //             <TableCell>{late_minutes}</TableCell>
        //         </>
        //     )
        // }
        
    }
    const capitalizeFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const isValidTime = (time)=>{
        return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(time, 'H:mm').format('H:mm'))
    }
    return(
        <div>
            <table className='table table-bordered custom-table'>
                <thead>
                    <tr style={{textAlign:'center',verticalAlign:'center'}}>
                        <th rowSpan={2} style ={{verticalAlign:'middle'}}>
                            Day
                        </th>
                        <th colSpan={2} >
                            AM
                        </th>
                        <th colSpan={2}>
                            PM
                        </th>
                        <th colSpan={2}>
                            Undertime / Tardiness
                        </th>
                    </tr>
                    <tr style={{textAlign:'center'}}>
                        <th>Arrival</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Departure</th>
                        <th>Hours</th>
                        <th>Minutes</th>
                    </tr>
                </thead>
                <tbody>
                    {props.dtrdata.map((data,key)=>
                        <tr key={key} className='hover-row'>
                            <td>{moment(data.work_date).format('D')}</td>
                            {getDayInfo(data.work_date)}
                        </tr>
                    )}
                    {/* {
                        rowToAdd.map((data,key)=>
                        <tr key={key}>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                    )} */}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2} rowSpan={2}>Total</td>
                        <td colSpan={3} style={{textAlign:'left'}}>Undertime</td>
                        <td>{props.totalUndertimeHours !== 0 ? props.totalUndertimeHours:'-'}</td>
                        <td>{props.totalUndertimeMinutes !== 0 ? props.totalUndertimeMinutes:'-'}</td>
                    </tr>
                    <tr>
                        <td colSpan={3} style={{textAlign:'left'}}>Tardiness</td>
                        <td>{props.totalLateHours !== 0 ? props.totalLateHours:'-'}</td>
                        <td>{props.totalLateMinutes !== 0 ? props.totalLateMinutes:'-'}</td>

                    </tr>
                </tfoot>
            </table>
            
    </div>
    )
})
export default ViewDTR