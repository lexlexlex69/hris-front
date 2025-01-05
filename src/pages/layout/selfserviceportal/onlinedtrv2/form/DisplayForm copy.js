import { Box, Divider, Grid, Tooltip, Typography,TableContainer,Paper,Table,TableHead,TableRow,TableBody, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import '.././Style.css';
import moment from "moment";
import { displayLatesUndertime } from "../../../customprocessdata/CustomProcessData";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatDatePeriod, formatExtName } from "../../../customstring/CustomString";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import MediumModal from "../../../custommodal/MediumModal";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {grey,blue,red, orange, green} from '@mui/material/colors';
//Icons
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PendingIcon from '@mui/icons-material/Pending';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DeleteIcon from '@mui/icons-material/Delete';

import AddDTRSpecificDateRequest from "../../onlinedtr/AddDTRSpecificDateRequest";
import { deleteRequestedRectification, getLogsAdjustmentAPI, getRequestedOBOFTRectification } from "../../onlinedtr/DTRRequest";
import { api_url } from "../../../../../request/APIRequestURL";
import Swal from "sweetalert2";

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

export const DisplayForm = ({data,rowsToAdd,empInfo,signatory,from,to,alreadyAppliedRectification,setAlreadyAppliedRectification,updateAppliedRectification})=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [totalUndertimeHours,setTotalUndertimeHours] = useState(0);
    const [totalUndertimeMinutes,setTotalUndertimeMinutes] = useState(0);
    const [totalLateHours,setTotalLateHours] = useState(0);
    const [totalLateMinutes,setTotalLateMinutes] = useState(0);
    const [adjustmentLogsData,setAdjustmentLogsData] = useState([])
    const [requestedOBOFTData,setRequestedOBOFTData] = useState([])
    useEffect(()=>{
        getRequestedOBOFTRectification()
        .then(res=>{
            setRequestedOBOFTData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        var t_data = {
            api_url:api_url+'/getAdjType/b9e1f8a0553623f1:639a3e:17f68ea536b'
        }
        getLogsAdjustmentAPI(t_data)
        .then(response=>{
            const data = response.data.response
            var new_data = [];
            data.forEach(el=>{
                new_data.push({
                    'label':el.atype_desc,
                    'atype_code':el.atype_code,
                    'atype_desc':el.atype_desc,
                    // 'type_code':el.type_code
                })
            })
            var duplicate = Object.values(data.reduce((c, v) => {
                let k = v.atype_code;
                c[k] = c[k] || [];
                c[k].push(v);
                return c;
              }, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
            setAdjustmentLogsData(new_data)
            // setLoadingAdjst(false)
        }).catch(error=>{
            console.log(error)
        })
    },[])
    useEffect(()=>{
        let t_undertime = 0;
        let t_late = 0;
        let late_arr = [];
        data.forEach(el=>{
            t_undertime+=el.late_undertime.undertime_minutes
            t_late+=el.late_undertime.late_minutes
            late_arr.push(el.late_undertime.late_minutes)
        })
        setTotalUndertimeHours(Math.floor(t_undertime/60))
        setTotalUndertimeMinutes(Math.floor(t_undertime%60))
        setTotalLateHours(Math.floor(t_late/60))
        setTotalLateMinutes(Math.floor(t_late%60))
        
    },[data])
    const [selectedRawLogsDate,setSelectedRawLogsDate] = useState('')
    const [selectedRawLogs,setSelectedRawLogs] = useState([])
    const [openRawLogs,setOpenRawLogs] = useState(false)
    const themeFont = createTheme({
        typography: {
            fontFamily: 'Times New Roman',
        },
    });
    const rectificationDtl = createTheme({
        typography: {
            fontSize:11,
        },
    });
    const formatDays = () =>{
        
    }
    const handleViewRawLogs = (item)=>{
        if(item.raw_logs){
            var sorted = item.raw_logs.sort((a, b) => moment(a.timein,'HH:mm') - moment(b.timein,'HH:mm'));
            
            setSelectedRawLogsDate(item.date)
            setSelectedRawLogs(sorted)
            setOpenRawLogs(true)
        }else{
            toast.warning('No Biometric Logs')
        }
    }
    const [onclickDTR,setOnClickDTR] = useState(false)
    const checkRectification = (date,nature)=>{
        let check = alreadyAppliedRectification.filter(el=>moment(el.date,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(date,'YYYY-MM-DD').format('YYYY-MM-DD') && el.nature === nature)
        if(check.length>0){
            return {is_rectification:true,details:check[0]}
        }else{
            return {is_rectification:false,details:[]}
        }
    }
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
            var t_data = {
                date:date,
                nature:nature
            }
            deleteRequestedRectification(t_data)
            .then(res=>{
                if(res.data.status===200){
                    updateAppliedRectification(res.data.data)
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        showConfirmButton:false,
                        timer:1000
                    })
                }else{
                    updateAppliedRectification(res.data.data)
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
    const defaultRow = (item) =>{
        let time_in_rec = item.time_in?.log?[]:checkRectification(item.date,'Time In');
        let break_out_rec = item.break_out?.log?[]:checkRectification(item.date,'Break Out');
        let break_in_rec = item.break_in?.log?[]:checkRectification(item.date,'Break In');
        let time_out_rec = item.time_out?.log?[]:checkRectification(item.date,'Time Out');
        return(<>
                {
                    item.time_in?.log
                    ?
                    <td><span className={item?.holiday_period === 'AM' || item.time_in.type === 0?'red':item?.leave_period === 'AM'?'green':'auto'}>{item.time_in?.log} </span></td>
                    :
                        moment(item.date,'YYYY-MM-DD').isSameOrBefore(moment().format('YYYYY-MM-DD'))
                        ?
                            time_in_rec.is_rectification
                            ?
                            <td style={{padding:0}}><Tooltip title={<Stack spacing={1}>
                            <Typography>Rectification request details</Typography>
                            <Divider/>
                            <ThemeProvider theme={rectificationDtl}>
                            <Typography>Date: {moment(time_in_rec.details.date).format('MMMM DD, YYYY')}</Typography>
                            <Typography>Nature: {time_in_rec.details.nature}</Typography>
                            <Typography>Time: {moment(time_in_rec.details.rectified_time,'HH:mm').format('hh:mm A')}</Typography>
                            <Typography>Reason: {time_in_rec.details.reason}</Typography>
                            <Typography>Status: {time_in_rec.details.status}</Typography>
                            {
                                time_in_rec.details.status === 'FOR REVIEW' || time_in_rec.details.status === 'DISAPPROVED'
                                ?
                                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',}}>
                                <Tooltip title='Delete Request'><IconButton className="custom-iconbutton" color='error' sx={{background:'#fff','&:hover':{color:'#fff',background:red[800]}}} onClick ={()=>delRequest(item.date,'Time In')}><DeleteIcon/></IconButton>
                                </Tooltip>
                                </Box>
                                :
                                null
                            }
                            </ThemeProvider>
                            </Stack>}><IconButton sx={{color:time_in_rec.details.status==='FOR REVIEW'?orange[800]:time_in_rec.details.status==='DISAPPROVED'?red[800]:green[800]}}><FilePresentIcon/></IconButton></Tooltip>
                            </td>
                            :
                            <Tooltip title = {' Click to Request Time-In Rectification for '+moment(item.date).format('MMMM DD, YYYY')}><td className = 'on-hover-dtr' style={{background:red[200]}} onClick={()=>clickDate(item.date,'Time In')}></td></Tooltip>
                        :
                        <td></td>
                }

                {
                    item.break_out?.log
                    ?
                    <td><span className={item?.holiday_period === 'AM' || item.break_out.type === 0 ?'red':item?.leave_period === 'AM'?'green':'auto'}>{item.break_out?.log} </span></td>
                    :
                        moment(item.date,'YYYY-MM-DD').isSameOrBefore(moment().format('YYYYY-MM-DD'))
                        ?
                            break_out_rec.is_rectification
                            ?
                            <td style={{padding:0}}><Tooltip title={<Stack spacing={1}>
                            <Typography>Rectification request details</Typography>
                            <Divider/>
                            <ThemeProvider theme={rectificationDtl}>
                            <Typography>Date: {moment(break_out_rec.details.date).format('MMMM DD, YYYY')}</Typography>
                            <Typography>Nature: {break_out_rec.details.nature}</Typography>
                            <Typography>Time: {moment(break_out_rec.details.rectified_time,'HH:mm').format('hh:mm A')}</Typography>
                            <Typography>Reason: {break_out_rec.details.reason}</Typography>
                            <Typography>Status: {break_out_rec.details.status}</Typography>
                            {
                                break_out_rec.details.status === 'FOR REVIEW' || break_out_rec.details.status === 'DISAPPROVED'
                                ?
                                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',}}>
                                <Tooltip title='Delete Request'><IconButton className="custom-iconbutton" color='error' sx={{background:'#fff','&:hover':{color:'#fff',background:red[800]}}} onClick ={()=>delRequest(item.date,'Break Out')}><DeleteIcon/></IconButton>
                                </Tooltip>
                                </Box>
                                :
                                null
                            }
                            </ThemeProvider>
                            </Stack>}><IconButton sx={{color:break_out_rec.details.status==='FOR REVIEW'?orange[800]:break_out_rec.details.status==='DISAPPROVED'?red[800]:green[800]}}><FilePresentIcon/></IconButton></Tooltip>
                            </td>
                            :
                            <Tooltip title = {' Click to Request Break-Out Rectification for '+moment(item.date).format('MMMM DD, YYYY')}><td className = 'on-hover-dtr' style={{background:red[200]}} onClick={()=>clickDate(item.date,'Break Out')}></td></Tooltip>
                        :
                        <td></td>
                }

                {
                    item.break_in?.log
                    ?
                    <td><span className={item?.holiday_period === 'PM' || item.break_in.type === 0 ?'red':item?.leave_period === 'PM'?'green':'auto'}>{item.break_in?.log} </span></td>
                    :
                        moment(item.date,'YYYY-MM-DD').isSameOrBefore(moment().format('YYYYY-MM-DD'))
                        ?
                        break_in_rec.is_rectification
                            ?
                            <td style={{padding:0}}><Tooltip title={<Stack spacing={1}>
                            <Typography>Rectification request details</Typography>
                            <Divider/>
                            <ThemeProvider theme={rectificationDtl}>
                            <Typography>Date: {moment(break_in_rec.details.date).format('MMMM DD, YYYY')}</Typography>
                            <Typography>Nature: {break_in_rec.details.nature}</Typography>
                            <Typography>Time: {moment(break_in_rec.details.rectified_time,'HH:mm').format('hh:mm A')}</Typography>
                            <Typography>Reason: {break_in_rec.details.reason}</Typography>
                            <Typography>Status: {break_in_rec.details.status}</Typography>
                            {
                                break_in_rec.details.status === 'FOR REVIEW' || break_in_rec.details.status === 'DISAPPROVED'
                                ?
                                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',}}>
                                <Tooltip title='Delete Request'><IconButton className="custom-iconbutton" color='error' sx={{background:'#fff','&:hover':{color:'#fff',background:red[800]}}} onClick ={()=>delRequest(item.date,'Break In')}><DeleteIcon/></IconButton>
                                </Tooltip>
                                </Box>
                                :
                                null
                            }
                            </ThemeProvider>
                            </Stack>}><IconButton sx={{color:break_in_rec.details.status==='FOR REVIEW'?orange[800]:break_in_rec.details.status==='DISAPPROVED'?red[800]:green[800]}}><FilePresentIcon/></IconButton></Tooltip>
                            </td>
                            :
                            <Tooltip title = {' Click to Request Break-In Rectification for '+moment(item.date).format('MMMM DD, YYYY')}><td className = 'on-hover-dtr' style={{background:red[200]}} onClick={()=>clickDate(item.date,'Break In')}></td></Tooltip>
                        :
                        <td></td>
                }

                {
                    item.time_out?.log
                    ?
                    <td><span className={item?.holiday_period === 'PM' || item.time_out.type === 0 ?'red':item?.leave_period === 'PM'?'green':'black'}>{item.time_out?.log} </span></td>
                    :
                        moment(item.date,'YYYY-MM-DD').isSameOrBefore(moment().format('YYYYY-MM-DD'))
                        ?
                            time_out_rec.is_rectification
                            ?
                            <td style={{padding:0}}><Tooltip title={<Stack spacing={1}>
                            <Typography>Rectification request details</Typography>
                            <Divider/>
                            <ThemeProvider theme={rectificationDtl}>
                            <Typography>Date: {moment(time_out_rec.details.date).format('MMMM DD, YYYY')}</Typography>
                            <Typography>Nature: {time_out_rec.details.nature}</Typography>
                            <Typography>Time: {moment(time_out_rec.details.rectified_time,'HH:mm').format('hh:mm A')}</Typography>
                            <Typography>Reason: {time_out_rec.details.reason}</Typography>
                            <Typography>Status: {time_out_rec.details.status}</Typography>
                            {
                                time_out_rec.details.status === 'FOR REVIEW' || time_out_rec.details.status === 'DISAPPROVED'
                                ?
                                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',}}>
                                <Tooltip title='Delete Request'><IconButton className="custom-iconbutton" color='error' sx={{background:'#fff','&:hover':{color:'#fff',background:red[800]}}} onClick ={()=>delRequest(item.date,'Time Out')}><DeleteIcon/></IconButton>
                                </Tooltip>
                                </Box>
                                :
                                null
                            }
                            </ThemeProvider>
                            </Stack>}><IconButton sx={{color:time_out_rec.details.status==='FOR REVIEW'?orange[800]:time_out_rec.details.status==='DISAPPROVED'?red[800]:green[800]}}><FilePresentIcon/></IconButton></Tooltip>
                            </td>
                            :
                            <Tooltip title = {' Click to Request Time-Out Rectification for '+moment(item.date).format('MMMM DD, YYYY')}><td className = 'on-hover-dtr' style={{background:red[200]}} onClick={()=>clickDate(item.date,'Time Out')}></td></Tooltip>
                        :
                        <td></td>
                }
                

                {/* <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto'}}>{item.break_out?.log}</span></td>

                <td><span style={{color:item?.holiday_period === 'PM'?'red':item?.leave_period === 'PM'?'green':'auto'}}>{item.break_in?.log}</span></td>

                <td><span style={{color:item?.holiday_period === 'PM'?'red':item?.leave_period === 'PM'?'green':'auto'}}>{item.time_out?.log}</span></td> */}
            </>
        ) 
    }
    const [date,setDate] = React.useState('')
    const [nature,setNature] = React.useState('')
    const clickDate = (data,type) =>{
        // alert('Under Development')
        setDate(data)
        setNature(type)
        setOnClickDTR(true)
    }
    return (
    <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyItems:'center',marginTop:'20px',width:matches?'100%':'80%'}}>
    <Grid container spacing={0}>
        <Grid item xs={12}>
        {
            empInfo.info.description === 'Permanent' || empInfo.info.description === 'Casual'
            ?
            <Typography sx={{fontSize:'13px'}}>CS Form 48</Typography>
            :
            ''
        }
        {
            empInfo.info.description === 'Permanent' || empInfo.info.description === 'Casual'
            ?
            <Typography sx={{fontWeight:'bold',textAlign:'center'}} className={matches?'dtr-header-sm':'dtr-header'}>DAILY TIME RECORD</Typography>
            :
            <Typography sx={{fontWeight:'bold',textAlign:'center'}} className={matches?'dtr-header-sm':'dtr-header'}>DAILY ATTENDANCE RECORD</Typography>
            
        }
        </Grid>
        <Grid item xs={12} sx={{mt:1}}>
            <ThemeProvider theme={themeFont}>
                <Typography sx={{textAlign:'center',borderBottom:'solid 1px',fontSize:'.7rem'}}>{`${empInfo.info.lname}, ${empInfo.info.fname} ${formatExtName(empInfo.info.extname)} ${empInfo.info.mname}.`}</Typography>
                <Typography sx={{textAlign:'center',fontSize:'.6rem'}}>Name in Print</Typography>
            </ThemeProvider>
        </Grid>
        <Grid item xs={12} sx={{mt:1}}>
            <ThemeProvider theme={themeFont}>
                <Typography sx={{textAlign:'center',borderBottom:'solid 1px',fontSize:'.7rem'}}>{`${empInfo.info.officeassign}`}</Typography>
                <Typography sx={{textAlign:'center',fontSize:'.6rem'}}>OFFICE</Typography>
            </ThemeProvider>
        </Grid>
        <Grid item xs = {12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Grid item xs = {4}>
                    <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>
                    For the period of
                    </Typography>
                    </Grid>
                    <Grid item xs = {8}>
                        <Typography sx={{fontSize:'12px',textAlign:'center',borderBottom:'solid 1px',fontFamily:'Times New Roman'}}>
                        {formatDatePeriod(from,to)}
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
        <Grid item xs={12} id ='dtr-v2'>
            <table className={matches?"table-dtr-v2-sm":"table-dtr-v2"}>
                <thead>
                    <tr>
                        <td rowSpan={2} style={{fontWeight:'bold'}}>
                            Day
                        </td>
                        <td colSpan={2} style={{fontWeight:'bold'}}>
                            AM
                        </td>
                        <td colSpan={2} style={{fontWeight:'bold'}}>
                            PM
                        </td>
                        <td colSpan={2} style={{fontWeight:'bold'}}>
                            Undertime / Tardiness
                        </td>
                    </tr>
                    <tr>
                        <td style={{fontWeight:'bold'}}>
                            Arrival
                        </td>
                        <td style={{fontWeight:'bold'}}>
                            Departure
                        </td>
                        <td style={{fontWeight:'bold'}}>
                            Arrival
                        </td>
                        <td style={{fontWeight:'bold'}}>
                            Departure
                        </td>
                        <td style={{fontWeight:'bold'}}>
                            Hours
                        </td>
                        <td style={{fontWeight:'bold'}}>
                            Minutes
                        </td>
                    </tr>
                </thead>
                <tbody>
                {
                    data&&data.map((item,key)=>{
                        return(
                            <tr key={key}>
                                <Tooltip title='View Biometric Logs' placement='top'><td className='hover-date' style={{color:'#fff',background:blue[500],cursor:'pointer'}} onClick={()=>handleViewRawLogs(item)}>{moment(item.date).format('D')}</td></Tooltip>
                                {
                                    item.day_type === 3
                                    ?
                                        item.time_in?.log === item.time_out?.log
                                        ?
                                        (
                                            <td colSpan={4}><span style={{color:'red'}}>{item.time_in?.log}</span></td>
                                        )
                                        :
                                        defaultRow(item)
                                    :
                                        item.day_type === 2
                                        ?
                                            item.time_in?.log === item.time_out?.log
                                            ?
                                            (
                                            <>
                                               <td><span style={{color:'green'}}>{item.time_in?.log}</span></td>
                                                <td><span style={{color:'green'}}>{item.break_out?.log}</span></td>
                                                <td><span style={{color:'green'}}>{item.break_in?.log}</span></td>
                                                <td><span style={{color:'green'}}>{item.time_out?.log}</span></td>
                                             </> 
                                            )
                                            :
                                            defaultRow(item)
                                            // (
                                            //     <>
                                            //         <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto'}}>{item.time_in?.log}</span></td>

                                            //         <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto'}}>{item.break_out?.log}</span></td>

                                            //         <td><span style={{color:item?.holiday_period === 'PM'?'red':item?.leave_period === 'PM'?'green':'auto'}}>{item.break_in?.log}</span></td>

                                            //         <td><span style={{color:item?.holiday_period === 'PM'?'red':item?.leave_period === 'PM'?'green':'auto'}}>{item.time_out?.log}</span></td>
                                            //     </>
                                            // )
                                        :
                                            item.day_type === 0
                                            ?
                                                item.time_in?.log === item.time_out?.log
                                                ?
                                                (
                                                    <td colSpan={4}>{item.time_in?.log}</td>
                                                )
                                                :
                                                (
                                                <>
                                                    <td colSpan={4}>{item.time_in?.log}</td>
                                                    <td colSpan={4}>{item.break_out?.log}</td>
                                                    <td colSpan={4}>{item.break_in?.log}</td>
                                                    <td colSpan={4}>{item.time_out?.log}</td>
                                                </>
                                                )
                                            :
                                            defaultRow(item)
                                            // (
                                            // <>
                                            //     <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto',fontWeight:item.time_in?.type===5?'bold':'auto'}}>{item.time_in?.log}</span></td>

                                            //     <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto',fontWeight:item.break_out?.type===5?'bold':'auto'}}>{item.break_out?.log}</span></td>

                                            //     <td><span style={{color:item?.holiday_period === 'PM'?'red':item?.leave_period === 'PM'?'green':'auto',fontWeight:item.break_in?.type===5?'bold':'auto'}}>{item.break_in?.log}</span></td>

                                            //     <td><span style={{color:item?.holiday_period === 'PM'?'red':item?.leave_period === 'PM'?'green':'auto',fontWeight:item.time_out?.type===5?'bold':'auto'}}>{item.time_out?.log}</span></td>
                                            // </>
                                            // )
                                }
                                <td>
                                    {displayLatesUndertime(item.late_undertime.undertime_late,1)}
                                </td>
                                <td>
                                    {displayLatesUndertime(item.late_undertime.undertime_late,2)}

                                </td>  
                            
                            </tr>
                        )
                    })
                }
                {
                    rowsToAdd.map((item,key)=>{
                        return(
                            <tr key={key}>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        )
                    })
                }
                <tr>
                    <td rowSpan={2} colSpan={2}>Total</td>
                    <td colSpan={3}>Undertime</td>
                    <td>{totalUndertimeHours>0?totalUndertimeHours:'-'}</td>
                    <td>{totalUndertimeMinutes>0?totalUndertimeMinutes:'-'}</td>
                </tr>
                <tr>
                    <td colSpan={3}>Tardiness</td>
                    <td>{totalLateHours>0?totalLateHours:'-'}</td>
                    <td>{totalLateMinutes>0?totalLateMinutes:'-'}</td>
                </tr>
                </tbody>
        </table>
        <br/>
        <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>I certify on my honor that the above is true and correct record of the hours of work performed, record or which was made daily at the time of arrival and departure from the office</Typography>
            <Typography sx={{borderBottom:'solid 1px',marginTop:'30px'}}></Typography>
            <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>(Signature of Employee)</Typography>
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>VERIFIED as to the prescribed office hours:</Typography><br/>
            <Typography sx={{fontSize:'12px',textAlign:'center',fontWeight:'bold',fontFamily:'Times New Roman'}}>{signatory?.head_name === null ?'N/A':signatory?.head_name?signatory?.head_name.toUpperCase():''}</Typography>
            <Typography sx={{fontSize:'12px',textAlign:'center',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{signatory?.head_pos}</Typography>
        </Grid>
        <MediumModal open = {openRawLogs} close = {()=>setOpenRawLogs(false)} title=''>
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
                                                        {row.suffix === 0 ? 'Time-In':row.suffix === 1 ? 'Time-Out':row.suffix === 2?'Break-Out':row.suffix===3?'Break-In':''}
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
        </MediumModal>
        <MediumModal open={onclickDTR} close = {()=> setOnClickDTR(false)} title='Rectification Request'>
            <Box sx={{p:1,mt:matches?1:0}}>
                <AddDTRSpecificDateRequest
                    date = {date}
                    nature = {nature}
                    onClose = {()=> setOnClickDTR(false)}
                    updateAppliedRectification = {updateAppliedRectification}
                    adjustmentLogsData = {adjustmentLogsData}
                />  
            </Box>
        </MediumModal>
    </Grid>
    </Box>
    )
}