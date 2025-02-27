import { Box, Divider, Grid, Tooltip, Typography,TableContainer,Paper,Table,TableHead,TableRow,TableBody, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import '.././Style.css';
import moment from "moment";
import { displayLatesUndertime } from "../../../customprocessdata/CustomProcessData";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatDatePeriod, formatExtName, isValidTime } from "../../../customstring/CustomString";
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

export const PrintForm = ({data,rowsToAdd,empInfo,signatory,from,to,alreadyAppliedRectification,rectificationData,daysNumber,type,footerName})=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [totalUndertimeHours,setTotalUndertimeHours] = useState(0);
    const [totalUndertimeMinutes,setTotalUndertimeMinutes] = useState(0);
    const [totalLateHours,setTotalLateHours] = useState(0);
    const [totalLateMinutes,setTotalLateMinutes] = useState(0);
    const [adjustmentLogsData,setAdjustmentLogsData] = useState([])
    const [requestedOBOFTData,setRequestedOBOFTData] = useState([])
    useEffect(()=>{
        console.log(signatory)
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
            t_undertime+=el.undertime
            t_late+=el.late
            late_arr.push(el.late_undertime)
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
    
    const [onclickDTR,setOnClickDTR] = useState(false)
    const checkRectification = (date,nature)=>{
        let check = alreadyAppliedRectification.filter(el=>moment(el.date,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(date,'YYYY-MM-DD').format('YYYY-MM-DD') && el.nature === nature)
        if(check.length>0){
            return {is_rectification:true,details:check[0]}
        }else{
            return {is_rectification:false,details:[]}
        }
    }
    const checkRectification2 = (date,nature)=>{
        let check = rectificationData.filter(el=>moment(el.date,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(date,'YYYY-MM-DD').format('YYYY-MM-DD') && el.nature === nature)
        if(check.length>0){
            return {is_rectification:true,details:check[0]}
        }else{
            return {is_rectification:false,details:[]}
        }
    }
    
    const defaultRow = (item) =>{
        let time_in_rec2 = checkRectification(item.date,'Time In').is_rectification;
        let break_out_rec2 = checkRectification(item.date,'Break Out').is_rectification;
        let break_in_rec2 = checkRectification(item.date,'Break In').is_rectification;
        let time_out_rec2 = checkRectification(item.date,'Time Out').is_rectification;                   
        return(<>
                {
                    item.time_in
                    ?
                    <td><span style={{fontWeight:time_in_rec2 ? 'bold' :'normal'}} className={item.day_type === 0 ? isValidTime(item.time_in)?'red':'auto':item.day_type === 2 ? !isValidTime(item.time_in)?'green':'auto':'auto'}>{isValidTime(item.time_in)?moment(item.time_in,'H:m').format('hh:mm A'):item.time_in} </span></td>
                    :
                    <td></td>
                }

                {
                    item.break_out
                    ?
                    <td><span style={{fontWeight:break_out_rec2 ? 'bold' :'normal'}} className={item.day_type === 0 ? isValidTime(item.break_out)?'red':'auto':item.day_type === 2 ? !isValidTime(item.break_out)?'green':'auto':'auto'}>{isValidTime(item.break_out)?moment(item.break_out,'H:m').format('hh:mm A'):item.break_out}</span></td>
                    :
                    <td></td>
                }

                {
                    item.break_in
                    ?
                    <td><span style={{fontWeight:break_in_rec2 ? 'bold' :'normal'}} className={item.day_type === 0 ? isValidTime(item.break_in)?'red':'auto':item.day_type === 2 ? !isValidTime(item.break_in)?'green':'auto':'auto'}>{isValidTime(item.break_in)?moment(item.break_in,'H:m').format('hh:mm A'):item.break_in}</span></td>
                    :
                    <td></td>
                }

                {
                    item.time_out
                    ?
                    <td><span style={{fontWeight:time_out_rec2 ? 'bold' :'normal'}} className={item.day_type === 0 ? isValidTime(item.time_out)?'red':'auto':item.day_type === 2 ? !isValidTime(item.time_out)?'green':'auto':'auto'}>{isValidTime(item.time_out)?moment(item.time_out,'H:m').format('hh:mm A'):item.time_out}</span></td>
                    :
                    <td></td>
                }
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
    const matchDay = (date) =>{
        var items = data.filter(el=>moment(el.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'));
        if(items.length>0){
            let item = items[0]
            return (
                <tr>
                <td>{moment(date).format('D')}
                </td>
                {
                    item.day_type === 1
                    ?
                    defaultRow(item)
                    :
                        item.day_type === 0
                                ?
                                item.time_in || item.break_out || item.break_in || item.time_out
                                ?
                                defaultRow(item)
                                :
                                <>
                                <td colSpan={4}>
                                    <span>{item.sched_in.toUpperCase()}</span>
                                </td>
                                </>
                        :
                            item.day_type === 2
                            ?
                            defaultRow(item)
                        :
                            item.day_type === 3
                            ?
                            item.time_in || item.break_out || item.break_in || item.time_out
                            ?
                            defaultRow(item)
                            :
                            <>
                                <td colSpan={4}>
                                <span className = 'red'>{`${item.sched_in.toUpperCase()} ${item.sched_out.toUpperCase()}`}</span>
                            </td>
                            </>
                        :
                    <>
                    <td></td>
                    </>
                }
                <td>
                    {displayLatesUndertime(item.late_undertime,1)}
                </td>
                <td>
                    {displayLatesUndertime(item.late_undertime,2)}
                </td>  
            
            </tr>
            )
        }else{
            return (
                <tr>
                    <td>{moment(date).format('D')}</td>
                    {defaultRow({date:date,time_in:'',break_out:'',break_in:'',time_out:''})}
                </tr>
            )
        }
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
                    daysNumber.map((item,key)=>{
                        return (
                            matchDay(item)
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
        {
            type ===1
            ?
            <Grid item xs={12} sx={{mt:1}}>
                <Typography sx={{fontSize:'.5rem',fontStyle:'italic'}}>{footerName} {moment().format('MM/DD/YYY hh:mm A')}</Typography>
            </Grid>
            :
            null

        }
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
    </Grid>
    </Box>
    )
}