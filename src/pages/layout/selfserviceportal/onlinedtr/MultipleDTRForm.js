import { Container, Grid, Typography,Box, Modal, TextField,InputLabel,Select,MenuItem,FormControl,Button,Tooltip,IconButton } from '@mui/material';
import React, { useState } from 'react';
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
import { useEffect } from 'react';
import NewspaperIcon from '@mui/icons-material/Newspaper';

import {blue,grey, red} from '@mui/material/colors'
import { DeleteForever } from '@mui/icons-material';
import { deleteRequestedRectification } from './DTRRequest';
import { formatOfficeName, formatTimeWithPeriod } from '../../customstring/CustomString';
import MediumModal from '../../custommodal/MediumModal';
const Input = styled('input')({
    display: 'none',
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: grey[200],
    //   color: theme.palette.common.white,
      fontSize: 13,
      padding:10
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding:10
    },
  }));

export const MultipleDTRForm = React.forwardRef((props,ref)=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'95%':500,
        marginBottom: 0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
        // p: 4,
        // height:'100%',
        // overflow:'scroll'
      };
    const [onclickDTR,setOnClickDTR] = React.useState(false)
    const [date,setDate] = React.useState('')
    const [nature,setNature] = React.useState('')
    const [rowToAdd,setRowToAdd] = React.useState([])
    const [viewRawLogs,setViewRawLogs] = useState(false);
    const [selectedRawLogs,setSelectedRawLogs] = useState([]);
    const [selectedRawLogsDate,setSelectedRawLogsDate] = useState([]);
    useEffect(()=>{
        document.addEventListener('contextmenu', event => event.preventDefault());
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
        console.log(props.dtrdata)
    },[props.dtrdata])
    const delRequest = (date,nature)=>{
        Swal.fire({
            icon:'question',
            title:'Confirm delete ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                icon:'info',
                title:'Deleting request',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading()
            console.log(date)
            console.log(nature)
            var t_data = {
                date:date,
                nature:nature
            }
            deleteRequestedRectification(t_data)
            .then(res=>{
                console.log(res.data)
                if(res.data.status===200){
                    props.setAlreadyAppliedRectification(res.data.data)
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
        })
        
    }
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
        var is_schedin_leave = false;
        var is_schedout_leave = false;
        var sched_in = ''
        var hasMatch =false;
        var date_nature = [];
        var timein_info = []
        var breakout_info = []
        var breakin_info = []
        var timeout_info = []
        let adjust_in = false;
        let adjust_out = false;
        var adjust_break_in = false;
        let adjust_break_out = false;
        let ob_oft_time_in = false;
        let ob_oft_break_out = false;
        let ob_oft_break_in = false;
        let ob_oft_time_out = false;
        let tran_type;
        let special = false;
        props.dtrdata.forEach(element => {
            
            if(moment(date).format('YYYY-MM-DD') === element.work_date){
                if(element.day_type === "3"){
                    special = true;
                }
                var break_data = element.half_break.split(';');
                var schedin_isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(element.sched_in, 'H:mm').format('H:mm'));
                var schedout_isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(moment(element.sched_out, 'H:mm').format('H:mm'));
                
                if(element.sched_out === 'REST DAY'){
                    if(element.time_in.length ===0 && element.time_out.length ===0 && break_data[0].length === 0 && break_data[1].length ===0){
                        under_time = '-';
                        late_minutes = '-';
                        is_weekend = true;
                        sched_in = element.sched_in;
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
                    
                }else if(element.sched_in === 'NATIONAL' || element.sched_out === 'HOLIDAY'){
                    // element.sched_in === 'NATIONAL' || element.sched_out === 'HOLIDAY' && (element.time_in.length ===0 || element.time_out.length ===0 || break_data[0].length === 0 || break_data[1].length ===0)
                    if(element.time_in.length ===0 && break_data[0].length === 0 && element.time_out.length ===0 &&break_data[1].length ===0){
                        sched_in = element.sched_in+' '+element.sched_out
                        under_time = '-';
                        late_minutes = '-';
                        is_holiday = true;

                    }else{
                        if(element.day_type === "3"){
                            special = true;
                        }
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
                    }
                    // under_time = '-';
                    // late_minutes = '-';
                    // sched_in = element.sched_in+' '+element.sched_out;
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
                    }
                }else if(element.sched_in.includes(':am') ||element.sched_out.includes(':am')){
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
                }else{
                    if(schedin_isValid || (element.time_in.trim().length !== 0 && break_data[0].trim().length !==0)){
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
                        // break_in = break_data[1].length ===0 ?null:break_data[1];
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
                    }else{
                        //tran-type -> 1. 2 - OB-OFT 3. 4. 5 -Leave
                        /**
                         * 
                         Check if OB-OFT
                         */
                        // is_schedin_leave = true;
                        // under_time = '-';
                        // late_minutes = '-';
                        // time_in = element.sched_in;
                        // break_out = element.sched_in;
                        var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                        var hours = (num / 60);
                        var rhours = Math.floor(hours);
                        var minutes = (hours - rhours) * 60; 
                        var rminutes = Math.round(minutes);
                        
                        if(num>0){
                            is_schedin_leave = true;
                            under_time = rhours;
                            late_minutes = rminutes;
                            time_in = element.sched_in;
                            break_out = element.sched_in;
                        }else{
                            is_schedin_leave = true;
                            under_time = '-';
                            late_minutes = '-';
                            time_in = element.sched_in;
                            break_out = element.sched_in;
                        }
                       
                    }
                    if(schedout_isValid || (element.time_out.trim().length !== 0 && break_data[1].trim().length !==0)){
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

                        // time_in = element.time_in;
                        time_out = element.time_out;
                        // var break_data = element.half_break.split(';');
                        // break_out = break_data[0].length ===0 ?null:break_data[0];
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
                    }else{
                        var num = parseInt(element.under_time)+parseInt(element.late_minutes);
                        var hours = (num / 60);
                        var rhours = Math.floor(hours);
                        var minutes = (hours - rhours) * 60; 
                        var rminutes = Math.round(minutes);
                        
                        if(num>0){
                            is_schedout_leave = true;
                            under_time = rhours;
                            late_minutes = rminutes;
                            break_in = element.sched_out;
                            time_out = element.sched_out;
                        }else{
                            is_schedout_leave = true;
                            under_time = '-';
                            late_minutes = '-';
                            break_in = element.sched_out;
                            time_out = element.sched_out;
                        }
                        
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
                                    <td><Tooltip arrow title={(<Box><Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(timein_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {timein_info.nature}</Typography><Typography>Reason: {timein_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(timein_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {timein_info.status}</Typography>
                                    <Typography className ='rectification-details'>{timeout_info.remarks === null && timein_info.status==='APPROVED' ? 'Pending For Rectification' :''} {'Remarks: '+timein_info.remarks}</Typography>
                                    {timein_info.status === 'FOR REVIEW' || timein_info.status === 'DISAPPROVED'?<Tooltip title=
                                    'Click to Delete Request and request a new one'><IconButton color='error' sx={{background:'#fff','&:hover':{background:'#fff'}}} onClick ={()=>delRequest(date,'Time In')}><DeleteForever/></IconButton></Tooltip>:null}
                                    </Box>)}><EventNoteOutlinedIcon className = {timein_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip></td>
                                    :
                                        props.type === 'viewing'
                                        ?
                                        <td></td>
                                        :
                                        <td title = {' Click to Request Time-In Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Time In')} className = 'on-hover-dtr' style={{background:red[200]}}>{time_in}</td>
                                :
                                <td></td>
                            :
                                is_schedin_leave
                                ?
                                <td><span style ={{fontWeight:'bold',color:'green'}}> {time_in}</span></td>
                                :
                                <td><span style={{color:special?'red':'auto'}}>{adjust_in?<strong>{formatTimeWithPeriod(time_in)}</strong>:time_in === 'OB' || time_in === 'OFT'?<strong>{time_in}</strong>:formatTimeWithPeriod(time_in)}</span>
                                </td>
                        }
                        
                        {
                            break_out === null || break_out.trim() === '' && !is_schedin_leave
                            ?
                                moment(date).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')
                                ?
                                    date_nature.includes(2)
                                    ?
                                    <td>
                                    {/* <Tooltip arrow title={(
                                    <Box>
                                    <Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(breakout_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {breakout_info.nature}</Typography><Typography>Reason: {breakout_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(breakout_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {breakout_info.status}</Typography>
                                    <Typography className ='rectification-details'>{breakout_info.remarks === null && breakout_info.status==='APPROVED' ? 'Pending For Rectification' :''} {breakout_info.remarks}</Typography>
                                    {breakout_info.status === 'FOR REVIEW' || breakout_info.status === 'DISAPPROVED'?<Tooltip title=
                                    'Delete Request'><IconButton color='error' sx={{background:'#fff','&:hover':{background:'#fff'}}} onClick ={()=>delRequest(date,'Break Out')}><DeleteForever/></IconButton></Tooltip>:null}</Box>)}><EventNoteOutlinedIcon className = {breakout_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip> */}
                                    <Tooltip arrow title={(
                                    <Box>
                                    <Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(breakout_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {breakout_info.nature}</Typography><Typography>Reason: {breakout_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(breakout_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {breakout_info.status}</Typography>
                                    <Typography className ='rectification-details'>{timeout_info.remarks === null && breakout_info.status==='APPROVED' ? 'Pending For Rectification' :''} {'Remarks: '+breakout_info.remarks}</Typography>
                                    {breakout_info.status === 'FOR REVIEW' || breakout_info.status === 'DISAPPROVED'?<Tooltip title=
                                    'Click to Delete Request and request a new one'><IconButton color='error' sx={{background:'#fff','&:hover':{background:'#fff'}}} onClick ={()=>delRequest(date,'Break Out')}><DeleteForever/></IconButton></Tooltip>:null}
                                    </Box>)}><EventNoteOutlinedIcon className = {breakout_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip>
                                    </td>
                                    :
                                        props.type === 'viewing'
                                        ?
                                        <td></td>
                                        :
                                        <td title = {'Click to Request Break-Out Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Break Out')} className ='on-hover-dtr' style={{background:red[200]}}>{formatTimeWithPeriod(break_out)}</td>
                                :
                                <td></td>
                            :
                                is_schedin_leave
                                ?
                                <td><span style ={{fontWeight:'bold',color:'green'}}>{break_out}</span></td>
                                :
                                <td><span style={{color:special?'red':'auto'}}>{adjust_break_out?<strong>{formatTimeWithPeriod(break_out)}</strong>:break_out === 'OB' || break_out === 'OFT'?<strong>{break_out}</strong>:formatTimeWithPeriod(break_out)}</span></td>
                        }
    
                        {
                            break_in === null || break_in.trim() === ''
                            ?
                                moment(date).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')
                                ?
                                    date_nature.includes(3)
                                    ?
                                    <td><Tooltip arrow title={(<Box><Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(breakin_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {breakin_info.nature}</Typography><Typography>Reason: {breakin_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(breakin_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {breakin_info.status}</Typography>
                                    <Typography className ='rectification-details'>{timeout_info.remarks === null && breakin_info.status==='APPROVED' ? 'Pending For Rectification' :''} {'Remarks: '+breakin_info.remarks}</Typography>
                                    {breakin_info.status === 'FOR REVIEW' || breakin_info.status === 'DISAPPROVED'?<Tooltip title=
                                    'Click to Delete Request and request a new one'><IconButton color='error' sx={{background:'#fff','&:hover':{background:'#fff'}}} onClick ={()=>delRequest(date,'Break In')}><DeleteForever/></IconButton></Tooltip>:null}
                                    </Box>)}><EventNoteOutlinedIcon className = {breakin_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/></Tooltip></td>
                                    :
                                        props.type === 'viewing'
                                        ?
                                        <td></td>
                                        :
                                        <td title = {'Click to Request Break-In Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Break In')} className ='on-hover-dtr' style={{background:red[200]}}>{formatTimeWithPeriod(break_in)}</td>
                                :
                                <td></td>
                            :
                                is_schedout_leave
                                ?
                                <td><span style ={{fontWeight:'bold',color:'green'}}> {break_in}</span></td>
                                :
                                <td><span style={{color:special?'red':'auto'}}>{adjust_break_in?<strong>{formatTimeWithPeriod(break_in)}</strong>:break_in === 'OB' || break_in === 'OFT'?<strong>{break_in}</strong>:formatTimeWithPeriod(break_in)}</span></td>
                        }
    
                        {
                            time_out === null || time_out.trim() === ''
                            ?
                                moment(date).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')
                                ?
                                    date_nature.includes(4)
                                    ?
                                    <td>
                                    <Tooltip arrow title={(<Box><Typography>Rectification Request details: </Typography><Typography sx={{borderTop:'solid 1px',color:'#c4c4c4',mb:1}}></Typography><Typography className ='rectification-details'>Date: {moment(timeout_info.date).format('MMMM DD, YYYY')}</Typography><Typography className ='rectification-details'>Nature: {timeout_info.nature}</Typography><Typography>Reason: {timeout_info.reason}</Typography><Typography className ='rectification-details'>Rectified Time: {formatAMPM(timeout_info.rectified_time)}</Typography><Typography className ='rectification-details'>Status: {timeout_info.status}</Typography>
                                    <Typography className ='rectification-details'>{timeout_info.remarks === null && timeout_info.status==='APPROVED' ? 'Pending For Rectification' :''} {'Remarks: '+timeout_info.remarks}</Typography>
                                    {timeout_info.status === 'FOR REVIEW' || timeout_info.status === 'DISAPPROVED'?<Tooltip title=
                                    'Click to Delete Request and request a new one'><IconButton color='error' sx={{background:'#fff','&:hover':{background:'#fff'}}} onClick ={()=>delRequest(date,'Time Out')}><DeleteForever/></IconButton></Tooltip>:null}
                                    </Box>)}><EventNoteOutlinedIcon className = {timeout_info.status === 'APPROVED'?'approved-rectification-icon' :'pending-rectification-icon'}/>
                                    
                                    </Tooltip></td>
                                    :
                                        props.type === 'viewing'
                                        ?
                                        <td></td>
                                        :
                                        <td title = {'Click to Request Time-Out Rectification for '+moment(date).format('MMMM DD, YYYY')} onClick ={()=>clickDate(date,'Time Out')} className ='on-hover-dtr' style={{background:red[200]}}>{formatTimeWithPeriod(time_out)}</td>
                                :
                                <td></td>
                            :
                                is_schedout_leave
                                ?
                                <td><span style ={{fontWeight:'bold',color:'green'}}> {time_out}</span></td>
                                :
                                <td><span style={{color:special?'red':'auto'}}> {adjust_out?<strong>{formatTimeWithPeriod(time_out)}</strong>:time_out === 'OB' || time_out === 'OFT'?<strong>{time_out}</strong>:formatTimeWithPeriod(time_out)}</span> </td>
                            
                                
                        }
                        <td>{under_time>0 ?under_time:'-'}</td>
                        <td>{late_minutes>0 ?late_minutes:'-'}</td>
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
    const handleViewRawLogs = (tdate)=>{
        var arr = props.rawLogs.filter((el)=>{
            return moment(el.trandate).format('YYYY-MM-DD') === moment(tdate).format('YYYY-MM-DD')
        })
        if(arr.length!==0){
            setSelectedRawLogs(arr)
            setViewRawLogs(true)
            setSelectedRawLogsDate(tdate)
        }else{
            alert('No Logs')
        }
    }
    const formatExtName = (val)=>{
        var ext_names = ['JR.','JR','SR','SR.','I','II','III','IV','V','VI','VII','VIII'];
        if(val){
            if(ext_names.includes(val.toUpperCase())){
                return val.toUpperCase();
            }else{
                return null
            }
        }
        return null
        
    }
    return(
        <Box sx={{p:1}} className='contextmenu'>
            {
                props.info.description === 'Permanent' || props.info.description === 'Casual'
                ?
                <Typography sx={{fontSize:'13px'}}>CS Form 48</Typography>
                :
                ''
            }
            {
                props.info.description === 'Permanent' || props.info.description === 'Casual'
                ?
                <Typography sx={{fontWeight:'bold',textAlign:'center'}} className={matches?'dtr-header-sm':'dtr-header'}>DAILY TIME RECORD</Typography>
                :
                <Typography sx={{fontWeight:'bold',textAlign:'center'}} className={matches?'dtr-header-sm':'dtr-header'}>DAILY ATTENDANCE RECORD</Typography>
                
            }
            <Typography sx={{borderBottom:'solid 1px',textAlign:'center',fontFamily:'Times New Roman'}} className={matches?'dtr-header1-sm':'dtr-header1'}>
                    {props.info.lname.toUpperCase()+', '+props.info.fname.toUpperCase()} {formatExtName(props.info.extname)} {(props.info.mname?props.info.mname.toUpperCase():props.info.mname)+'.'}
            </Typography>
                <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>
                    Name in Print
                </Typography>
                <Typography sx={{borderBottom:'solid 1px',textAlign:'center',marginTop:'5px',fontFamily:'Times New Roman'}} className={matches?'dtr-header1-sm':'dtr-header1'}>
                    {formatOfficeName(props.info.officeassign)}
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
                        Official Hours of arrival<br/> and departure days _____________
                        </Typography>
                    </Grid>

                    <Grid item xs = {6}>
                        <Typography sx={{fontSize:'12px',textAlign:'right',fontFamily:'Times New Roman'}}>
                        {/* (Regular days)<span style={{paddingLeft:'30px',paddingRight:'30px',borderBottom:'solid 1px'}}>{props.regularDays}</span> <br/> */}
                        (Regular days)<span style={{paddingLeft:'30px',paddingRight:'30px',borderBottom:'solid 1px'}}></span><br/>
                        (Saturdays)<span style={{paddingLeft:'30px',paddingRight:'30px',borderBottom:'solid 1px'}}></span>
                        </Typography>
                    </Grid>
                </Grid>
            <table className='table table-bordered custom-table' id = 'dtr-table'>
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
                        props.dtrdata.map((data,key)=>
                        <tr key={key}>
                            <Tooltip title = 'View Raw Biometric Logs'><td onClick={()=>handleViewRawLogs(data.work_date)} className='hover-date' style={{background:blue[200],fontWeight:'bold'}}>{moment(data.work_date).format('D')}</td>
                            </Tooltip>
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
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>I certify on my honor that the above is true and correct record of the hours of work performed, record or which was made daily at the time of arrival and departure from the office</Typography>
            <Typography sx={{borderBottom:'solid 1px',marginTop:'30px'}}></Typography>
            <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>(Signature of Employee)</Typography>
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>VERIFIED as to the prescribed office hours:</Typography><br/>
            <Typography sx={{fontSize:'12px',textAlign:'center',fontWeight:'bold',fontFamily:'Times New Roman'}}>{props.officeHead.head_name === null ?'N/A':props.officeHead.head_name.toUpperCase()}</Typography>
            <Typography sx={{fontSize:'12px',textAlign:'center',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{props.officeHead.head_pos}</Typography>

        <MediumModal open={onclickDTR} close = {()=> setOnClickDTR(false)} title='Rectification Request'>
            <Box sx={{p:1,mt:matches?1:0}}>
                <AddDTRSpecificDateRequest
                    date = {date}
                    nature = {nature}
                    onClose = {()=> setOnClickDTR(false)}
                    updateAppliedRectification = {props.updateAppliedRectification}
                    adjustmentLogsData = {props.adjustmentLogsData}
                />  
            </Box>
        </MediumModal>
        {/* <Modal
            open={onclickDTR}
            // onClose={()=>setOnClickDTR(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOnClickDTR(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Rectification Request
                </Typography>
                <Box>
                    <AddDTRSpecificDateRequest
                        date = {date}
                        nature = {nature}
                        onClose = {()=> setOnClickDTR(false)}
                        updateAppliedRectification = {props.updateAppliedRectification}
                        adjustmentLogsData = {props.adjustmentLogsData}
                    />  
                </Box>
            
            </Box>
        </Modal> */}
        <Modal
            open={viewRawLogs}
            onClose={()=>setViewRawLogs(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Box sx={{m:matches?1:2,overflowY:matches?'scroll':'auto'}}>
                    <Grid container spacing={1}>
                        {/* <Grid item xs={12}>
                        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                        <IconButton><NewspaperIcon/></IconButton>
                        </Box>
                        </Grid> */}
                        <Grid item xs={12}>

                            <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                            <Typography sx={{background:blue[800],borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px',color:'#fff',padding:'5px 10px 5px 10px'}}><NewspaperIcon/> Biometric Raw Logs</Typography>
                            </Box>
                            <Typography sx={{background:blue[900],padding:'5px',color:'#fff'}}>Date: {moment(selectedRawLogsDate).format('MM/DD/YYYY')}</Typography>


                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {/* <TableCell>
                                                Date
                                            </TableCell> */}
                                            <StyledTableCell>
                                                Time Log
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                Type
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            selectedRawLogs.map((row,key)=>
                                                <TableRow hover key={key}>
                                                    {/* <TableCell>
                                                        {moment(row.trandate).format('MM/DD/YYYY')}
                                                    </TableCell> */}
                                                    <StyledTableCell>
                                                        {moment(row.trandate+' '+row.timein).format('h:mm:ss A')}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {row.suffix === '0' ? 'Time-In':row.suffix === '1' ? 'Time-Out':row.suffix === '2'?'Break-Out':row.suffix==='3'?'Break-In':''}
                                                    </StyledTableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
                            <small style={{color:red[800],fontWeight:'bold'}}><em> - Should there be any concern about your DTR, please visit HR Office.</em></small>
                        </Grid>
                    </Grid>
                
                    
                </Box>
            
            </Box>
        </Modal>

    </Box>
    )
})
export default DTRForm