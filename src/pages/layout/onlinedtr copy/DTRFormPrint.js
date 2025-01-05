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
import { getOfficeHeadName } from './DTRRequest';
export const DTRFormPrint = React.forwardRef((props,ref)=>{
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
        var adjust_break_in = false;
        var adjust_break_out = false;
        props.dtrdata.forEach(element => {
            if(moment(date).format('YYYY-MM-DD') === element.work_date){
                var break_data = element.half_break.split(';');
                
                var schedin_isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(element.sched_in, 'H:mm').format('H:mm'));
                var schedout_isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(element.sched_out, 'H:mm').format('H:mm'));
                
                if(element.sched_in === 'SATURDAY' || element.sched_in === 'SUNDAY'){
                    under_time = '-';
                    late_minutes = '-';
                    is_weekend = true;
                    sched_in = element.sched_in+'S';
                }else if(element.sched_in === 'NATIONAL' || element.sched_out === 'HOLIDAY' && (element.time_in.length ===0 || element.time_out.length ===0 || break_data[0].length === 0 || break_data[1].length ===0)){
                    under_time = '-';
                    late_minutes = '-';
                    is_holiday = true;
                    sched_in = element.sched_in+' '+element.sched_out;
                }else if(element.sched_in === 'LOCAL' || element.sched_out === 'HOLIDAY' && (element.time_in.length ===0 || element.time_out.length ===0 || break_data[0].length === 0 || break_data[1].length ===0)){
                    under_time = '-';
                    late_minutes = '-';
                    is_holiday = true;
                    sched_in = element.sched_in+' '+element.sched_out;
                }else{
                    if(schedin_isValid){
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
                        break_in = break_data[1];
                    }else{
                        under_time = '-';
                        late_minutes = '-';
                        time_in = element.sched_in;
                        break_out = element.sched_in;
                    }
                    if(schedout_isValid){
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
                        break_in = break_data[1];
                    }else{
                        under_time = '-';
                        late_minutes = '-';
                        break_in = element.sched_out;
                        time_out = element.sched_out;
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
                    <td><span style ={{fontWeight:adjust_in?'bold':'auto'}}> {time_in}</span></td>
                    <td><span style ={{fontWeight:adjust_break_out?'bold':'auto'}}> {break_out}</span></td>
                    <td><span style ={{fontWeight:adjust_break_in?'bold':'auto'}}> {break_in}</span></td>
                    <td><span style ={{fontWeight:adjust_out?'bold':'auto'}}> {time_out} </span> </td>
                    <td>{under_time}</td>
                    <td>{late_minutes}</td>
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
    return(
        <>
            <Typography sx={{fontSize:'13px',fontFamily:'Times New Roman'}}>CS Form 48</Typography>
            <Typography sx={{fontSize:'16px',fontWeight:'bold',textAlign:'center'}}>DAILY TIME RECORD</Typography>
            <Typography sx={{fontSize:'13px',borderBottom:'solid 1px',textAlign:'center',fontFamily:'Times New Roman'}}>
                    {props.info.lname+', '+props.info.fname+' '+props.info.mname.charAt(0).toUpperCase()+'.'}
            </Typography>
                <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>
                    Name in Print
                </Typography>
                <Typography sx={{fontSize:'13px',borderBottom:'solid 1px',textAlign:'center',marginTop:'5px',fontFamily:'Times New Roman'}}>
                    {props.info.officeassign === null ?'N/A':props.info.officeassign.toUpperCase()}

                </Typography>
                <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>
                    OFFICE
                </Typography>
                <Grid item xs = {12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Grid item xs = {4}>
                    <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>
                    For the period of
                    </Typography>
                    </Grid>
                    <Grid item xs = {8}>
                        <Typography sx={{fontSize:'12px',textAlign:'center',borderBottom:'solid 1px',fontFamily:'Times New Roman'}}>
                        {props.period}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs = {12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Grid item xs = {6}>
                        <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>
                        Official Hours of arrival<br/> and departure days
                        </Typography>
                    </Grid>

                    <Grid item xs = {6}>
                        <Typography sx={{fontSize:'12px',textAlign:'right',fontFamily:'Times New Roman'}}>
                        (Regular days)<span style={{paddingLeft:'30px',paddingRight:'30px',borderBottom:'solid 1px'}}>{props.regularDays}</span> <br/>
                        (Saturdays)<span style={{paddingLeft:'30px',paddingRight:'30px',borderBottom:'solid 1px'}}></span>
                        </Typography>
                    </Grid>
                </Grid>
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
                        <tr key={key}>
                            <td>{moment(data.work_date).format('D')}</td>
                            {getDayInfo(data.work_date)}
                        </tr>
                    )}
                    {
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
                    )}
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
            {/* <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell rowSpan={2} sx={{textAlign:'center'}}>Day</TableCell>
                                <TableCell colSpan={2} sx={{textAlign:'center'}}>AM</TableCell>
                                <TableCell colSpan={2} sx={{textAlign:'center'}}>PM</TableCell>
                                <TableCell colSpan={2}  sx={{textAlign:'center'}}>Undertime / Tardiness</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Arrival</TableCell>
                                <TableCell>Departure</TableCell>
                                <TableCell>Arrival</TableCell>
                                <TableCell>Departure</TableCell>
                                <TableCell>Hours</TableCell>
                                <TableCell>Minutes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.days.map((data,key)=>
                                <TableRow key = {key}>
                                    <TableCell>{moment(data).format('D')}</TableCell>
                                    {getDayInfo(data)}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
            </TableContainer> */}
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>I certify on my honor that the above is true and correct record of the hours of work performed, record or which was made daily at the time of arrival and departure from the office</Typography>
            <Typography sx={{borderBottom:'solid 1px',marginTop:'30px'}}></Typography>
            <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>(Signature of Employee)</Typography>
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>VERIFIED as to the prescribed office hours:</Typography><br/>
            <Typography sx={{fontSize:'12px',textAlign:'right',paddingRight:'80px',fontWeight:'bold',fontFamily:'Times New Roman'}}>{props.officeHead.office_head === null ?'N/A' :props.officeHead.office_head.toUpperCase()}</Typography>
            <Typography sx={{fontSize:'12px',textAlign:'right',paddingRight:'50px',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{props.officeHead.office_head_pos}</Typography>
            <Typography sx={{fontSize: '0.5em',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{capitalizeFirstLetter(props.info.fname.toLowerCase())+' '+props.info.mname.charAt(0).toUpperCase()+'. '+capitalizeFirstLetter(props.info.lname.toLowerCase())}, {moment(timeStamp).format('MM/DD/YYYY h:mma')}</Typography>
    </>
    )
})
export default DTRFormPrint