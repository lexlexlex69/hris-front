import { Container, Grid, Typography,Box, Modal, TextField,InputLabel,Select,MenuItem,FormControl,Button,Tooltip } from '@mui/material';
import React from 'react';
import moment from 'moment';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';

import './DTR.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Swal from 'sweetalert2';

//icon
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddDTRSpecificDateRequest from './AddDTRSpecificDateRequest';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
const Input = styled('input')({
    display: 'none',
});
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    marginBottom: 0,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius:3, 
    boxShadow: 24,
    // p: 4,
    // height:'100%',
    // overflow:'scroll'
  };
export const DTRForm = React.forwardRef((props,ref)=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [onclickDTR,setOnClickDTR] = React.useState(false)
    const [date,setDate] = React.useState('')
    const [nature,setNature] = React.useState('')

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
        var sched_in = ''
        var hasMatch =false;
        var date_nature = [];
        var timein_info = []
        var breakout_info = []
        var breakin_info = []
        var timeout_info = []
        var adjust_in = false;
        var adjust_out = false;
        var adjust_break_in = false;
        var adjust_break_out = false;
        props.dtrdata.forEach(element => {
            
            if(moment(date).format('YYYY-MM-DD') === element.work_date){
                var break_data = element.half_break.split(';');
                if(element.sched_in === 'SATURDAY' || element.sched_in === 'SUNDAY'){
                    under_time = '-';
                    late_minutes = '-';
                    is_weekend = true;
                    sched_in = element.sched_in+'S';
                }else if(element.sched_in === 'SL'&& element.sched_out === 'SL'){
                    under_time = '-';
                    late_minutes = '-';
                    time_in = 'SL';
                    break_out = 'SL';
                    break_in = 'SL';
                    time_out = 'SL';
                }else if(element.sched_in=== 'SL'){
                    under_time = '-';
                    late_minutes = '-';
                    time_in = 'SL';
                    break_out = 'SL';
                }else if(element.sched_out === 'SL'){
                    under_time = '-';
                    late_minutes = '-';
                    break_in = 'SL';
                    time_out = 'SL';
                }else if(element.sched_in === 'VL'&& element.sched_out === 'VL'){
                    under_time = '-';
                    late_minutes = '-';
                    time_in = 'VL';
                    break_out = 'VL';
                    break_in = 'VL';
                    time_out = 'VL';
                }else if(element.sched_in=== 'VL'){
                    under_time = '-';
                    late_minutes = '-';
                    time_in = 'VL';
                    break_out = 'VL';
                }else if(element.sched_out === 'VL'){
                    under_time = '-';
                    late_minutes = '-';
                    break_in = 'VL';
                    time_out = 'VL';
                }else if(element.sched_in === 'SLP'&& element.sched_out === 'SLP'){
                    under_time = '-';
                    late_minutes = '-';
                    time_in = 'SLP';
                    break_out = 'SLP';
                    break_in = 'SLP';
                    time_out = 'SLP';
                }else if(element.sched_in=== 'SLP'){
                    under_time = '-';
                    late_minutes = '-';
                    time_in = 'SLP';
                    break_out = 'SLP';
                }else if(element.sched_out === 'SLP'){
                    under_time = '-';
                    late_minutes = '-';
                    break_in = 'SLP';
                    time_out = 'SLP';
                }else if(element.sched_in === 'NATIONAL' && element.sched_out === 'HOLIDAY' && (element.time_in.length ===0 || element.time_out.length ===0 || break_data[0].length === 0 || break_data[1].length ===0)){
                    under_time = '-';
                    late_minutes = '-';
                    is_holiday = true;
                    sched_in = element.sched_in+' '+element.sched_out;
                }else if(element.sched_in === 'LOCAL' && element.sched_out === 'HOLIDAY' && (element.time_in.length ===0 || element.time_out.length ===0 || break_data[0].length === 0 || break_data[1].length ===0)){
                    under_time = '-';
                    late_minutes = '-';
                    is_holiday = true;
                    sched_in = element.sched_in+' '+element.sched_out;
                }else{
                    var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                    var hours = (num / 60);
                    var rhours = Math.floor(hours);
                    var minutes = (hours - rhours) * 60;
                    var rminutes = Math.round(minutes);
                    
                    for (var index = 0; index < props.alreadyAppliedRectification.length; ++index) {

                        var date2 = props.alreadyAppliedRectification[index];

                        // console.log(date2.date)
                        // console.log('element' +element.work_date)
                        if(date2.date === element.work_date){
                            // date_nature = props.alreadyAppliedRectification[index]
                            if(date2.nature === 'Time In'){
                                date_nature.push(1)
                                timein_info = date2;
                            }else if(date2.nature === 'Break Out'){
                                date_nature.push(2)
                                breakout_info = date2;
                            }else if(date2.nature === 'Break In'){
                                date_nature.push(3)
                                breakin_info = date2;
                            }
                            else if(date2.nature === 'Time Out'){
                                date_nature.push(4)
                                timeout_info = date2;
                            }
                        }
                    }
                    
                    if(element.adjust_in){
                        adjust_in = true;
                    }
                    if(element.adjust_out){
                        adjust_out = true;
                    }
                    if(element.adjust_break2){
                        adjust_break_in = true;
                    }
                    if(element.adjust_break1){
                        adjust_break_out = true;
                    }

                    time_in = element.time_in;
                    time_out = element.time_out;
                    // var break_data = element.half_break.split(';');
                    break_out = break_data[0].length ===0 ?null:break_data[0];
                    break_in = break_data[1].length ===0 ?null:break_data[1];
                    late_minutes = rminutes;
                    under_time = rhours;
                    
                }
            }
        });
        console.log(props.dtrdata.length)
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
            if(props.dtrdata.length ===0){
                return(
                    <>
                        <td>{time_in}</td>
                        <td>{break_out}</td>
                        <td>{break_in}</td>
                        <td>{time_out}</td>
                        <td>{under_time}</td>
                        <td>{late_minutes}</td>
                    </>
                )
                
            }else{
                return(
                    <>
                        {
                            time_in === null || time_in.trim() === ''
                            ?
                                moment(date).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')
                                ?
                                    date_nature.includes(1)
                                    ?
                                    <td><Tooltip arrow title={(<Box><Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(timein_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {timein_info.nature}</Typography><Typography>Reason: {timein_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(timein_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {timein_info.status}</Typography></Box>)}><EventNoteOutlinedIcon className = {timein_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip></td>
                                    :
                                    <td title = {' Click to Request Time-In Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Time In')} className = 'on-hover-dtr'> {time_in}</td>
                                :
                                <td></td>
                            :
                            <td><span style ={{fontWeight:adjust_in?'bold':'auto'}}> {time_in}</span></td>
                        }
                        
                        {
                            break_out === null || break_out.trim() === ''
                            ?
                                moment(date).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')
                                ?
                                    date_nature.includes(2)
                                    ?
                                    <td><Tooltip arrow title={(<Box><Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(breakout_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {breakout_info.nature}</Typography><Typography>Reason: {breakout_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(breakout_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {breakout_info.status}</Typography></Box>)}><EventNoteOutlinedIcon className = {breakout_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip></td>
                                    :
                                    <td title = {'Click to Request Break-Out Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Break Out')} className ='on-hover-dtr'>{break_out}</td>
                                :
                                <td></td>
                            :
                            <td><span style ={{fontWeight:adjust_break_out?'bold':'auto'}}> {break_out}</span></td>
                        }
    
                        {
                            break_in === null || break_in.trim() === ''
                            ?
                                moment(date).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')
                                ?
                                    date_nature.includes(3)
                                    ?
                                    <td><Tooltip arrow title={(<Box><Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(breakin_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {breakin_info.nature}</Typography><Typography>Reason: {breakin_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(breakin_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {breakin_info.status}</Typography>
                                    <Typography className ='rectification-details'>{breakin_info.remarks === null && breakin_info.status==='APPROVED' ? 'Pending For Rectification' :''} {breakin_info.remarks}</Typography></Box>)}><EventNoteOutlinedIcon className = {breakin_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip></td>
                                    :
                                    <td title = {'Click to Request Break-Out Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Break In')} className ='on-hover-dtr'>{break_in}</td>
                                :
                                <td></td>
                            :
                            <td><span style ={{fontWeight:adjust_break_in?'bold':'auto'}}> {break_in}</span></td>
                            
                                
    
                        }
    
                        {
                            time_out === null || time_out.trim() === ''
                            ?
                                moment(date).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')
                                ?
                                    date_nature.includes(4)
                                    ?
                                    <td><Tooltip arrow title={(<Box><Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(timeout_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {timeout_info.nature}</Typography><Typography>Reason: {timeout_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(timeout_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {timeout_info.status}</Typography></Box>)}><EventNoteOutlinedIcon className = {timeout_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip></td>
                                    :
                                    <td title = {'Click to Request Break-Out Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Time Out')} className ='on-hover-dtr'>{time_out}</td>
                                :
                                <td></td>
                            :
                            <td><span style ={{fontWeight:adjust_out?'bold':'auto'}}> {time_out} </span> </td>
                            
                                
                        }
                        <td>{under_time}</td>
                        <td>{late_minutes}</td>
                    </>
                )
            }
            
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
    const formatAMPM = (time)=>{
        var split_time = time.split(':');
        var hours = split_time[0];
        var minutes = split_time[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const clickDate = (data,type) =>{
        // alert('Under Development')
        setDate(data)
        setNature(type)
        setOnClickDTR(true)
    }
    const capitalizeFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return(
        <>
            <Typography sx={{fontSize:'13px'}}>CS Form 48</Typography>
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
                        (Regular days)___<u>{props.regularDays}</u>______ <br/>
                        (Saturdays) _______________
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
                    {
                        props.days.map((data,key)=>
                        <tr key={key}>
                            <td>{moment(data).format('D')}</td>
                            {getDayInfo(data)}
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
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>I certify on my honor that the above is true and correct record of the hours of work performed, record or which was made daily at the time of arrival and departure from the office</Typography>
            <Typography sx={{borderBottom:'solid 1px',marginTop:'30px'}}></Typography>
            <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>(Signature of Employee)</Typography>
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>VERIFIED as to the prescribed office hours:</Typography><br/>
            <Typography sx={{fontSize:'12px',textAlign:'right',paddingRight:'100px',fontWeight:'bold',fontFamily:'Times New Roman'}}>{props.officeHead[0].office_division_assign === null ?'N/A':props.officeHead[0].office_division_assign.toUpperCase()}</Typography>
            <Typography sx={{fontSize:'12px',textAlign:'right',paddingRight:'50px',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{props.officeHead[0].position_name}</Typography>
            
        <Modal
            open={onclickDTR}
            // onClose={()=>setOnClickDTR(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOnClickDTR(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Rectification Request For <strong>{moment(date).format('MMMM DD, YYYY')}</strong>
                </Typography>
                <Box sx={{m:4}}>
                    <AddDTRSpecificDateRequest
                        date = {date}
                        nature = {nature}
                        onClose = {()=> setOnClickDTR(false)}
                        updateAppliedRectification = {props.updateAppliedRectification}
                    />  
                </Box>
            
            </Box>
        </Modal>
    </>
    )
})
export default DTRForm