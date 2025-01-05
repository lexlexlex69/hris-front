import { Box, Divider, Grid, Tooltip, Typography,TableContainer,Paper,Table,TableHead,TableRow,TableBody, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import '.././Style.css';
import moment from "moment";
import { displayLatesUndertime } from "../../../customprocessdata/CustomProcessData";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { autoCapitalizeFirstLetter, formatDatePeriod, formatExtName, formatOfficeName } from "../../../customstring/CustomString";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {grey} from '@mui/material/colors';


import { deleteRequestedRectification, getLogsAdjustmentAPI, getRequestedOBOFTRectification } from "../../onlinedtr/DTRRequest";
import { api_url } from "../../../../../request/APIRequestURL";
import Swal from "sweetalert2";


export const PrintForm = ({data,rowsToAdd,empInfo,signatory,from,to,alreadyAppliedRectification,setAlreadyAppliedRectification,updateAppliedRectification,type})=>{
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
        
        // console.log(empInfo)
    },[data])
    const themeFont = createTheme({
        typography: {
            fontFamily: 'Times New Roman',
        },
    });
    const defaultRow = (item) =>{
        return(<>
                {
                    item.time_in?.log
                    ?
                    <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto'}}>{item.time_in?.log} </span></td>
                    :
                    <td></td>
                }

                {
                    item.break_out?.log
                    ?
                    <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto'}}>{item.break_out?.log} </span></td>
                    :
                    <td></td>
                }

                {
                    item.break_in?.log
                    ?
                    <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto'}}>{item.break_in?.log} </span></td>
                    :
                    <td></td>
                }

                {
                    item.time_out?.log
                    ?
                    <td><span style={{color:item?.holiday_period === 'AM'?'red':item?.leave_period === 'AM'?'green':'auto'}}>{item.time_out?.log} </span></td>
                    :
                    <td></td>
                }
            </>
        )
    }

    return (
    <Box>
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
                <Typography sx={{textAlign:'center',borderBottom:'solid 1px',fontSize:'.7rem'}}>{formatOfficeName(empInfo.info.officeassign)}</Typography>
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
                Official Hours of arrival<br/> and departure days ________
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
            <table className="table-dtr-v2-print">
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
                                <td>{moment(item.date).format('D')}</td>
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
                                               <td><span style={{color:'green',fontWeight:'bold'}}>{item.time_in?.log}</span></td>
                                                <td><span style={{color:'green',fontWeight:'bold'}}>{item.break_out?.log}</span></td>
                                                <td><span style={{color:'green',fontWeight:'bold'}}>{item.break_in?.log}</span></td>
                                                <td><span style={{color:'green',fontWeight:'bold'}}>{item.time_out?.log}</span></td>
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
        <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>I certify on my honor that the above is true and correct record of the hours of work performed, record or which was made daily at the time of arrival and departure from the office</Typography>
            <Typography sx={{borderBottom:'solid 1px',marginTop:'30px'}}></Typography>
            <Typography sx={{fontSize:'10px',textAlign:'center',fontFamily:'Times New Roman'}}>(Signature of Employee)</Typography>
            <Typography sx={{fontSize:'12px',fontFamily:'Times New Roman'}}>VERIFIED as to the prescribed office hours:</Typography><br/>
            <Typography sx={{fontSize:'12px',textAlign:'center',fontWeight:'bold',fontFamily:'Times New Roman'}}>{signatory?.head_name === null ?'N/A':signatory?.head_name?signatory?.head_name.toUpperCase():''}</Typography>
            <Typography sx={{fontSize:'12px',textAlign:'center',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{signatory?.head_pos}</Typography>
        <br/>
        {
            type === 1
            ?
            <Typography sx={{fontSize: '0.5em',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{autoCapitalizeFirstLetter(empInfo.info.fname.toLowerCase())+' '+(empInfo.info.mname&&empInfo.info.mname.charAt(0).toUpperCase())+'. '+autoCapitalizeFirstLetter(empInfo.info.lname.toLowerCase())} {formatExtName(empInfo.info.extname)}, {moment().format('MM/DD/YYYY h:mma')}</Typography>
            :
            <Typography sx={{fontSize: '0.5em',fontStyle: 'italic',fontFamily:'Times New Roman'}}>{autoCapitalizeFirstLetter(empInfo.info.fname.toLowerCase())+' '+(empInfo.info.mname&&empInfo.info.mname.charAt(0).toUpperCase())+'. '+autoCapitalizeFirstLetter(empInfo.info.lname.toLowerCase())}, {moment().format('MM/DD/YYYY h:mma')}</Typography>

        }
        </Grid>
    </Grid>
    </Box>
    )
}