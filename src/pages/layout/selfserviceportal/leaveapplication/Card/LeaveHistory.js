import React,{useEffect, useState} from "react";
import {Paper,Typography,Box,Grid,SpeedDial,SpeedDialAction, Tooltip, IconButton, Stack, Skeleton, Fade} from '@mui/material';
import {createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,green,red,grey, orange} from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import './CardStyle.css';
import moment from "moment";
//Icons
import PrintIcon from '@mui/icons-material/Print';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CancelIcon from '@mui/icons-material/Cancel';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import InfoIcon from '@mui/icons-material/Info';

import PaginationOutlined from "../../../custompagination/PaginationOutlined";
import PaginateCard from "./PaginateCard";
import CardHeaderText from "./CardHeaderText";
import { RotateLeft } from "@mui/icons-material";

export default function LeaveHistory(props,ref){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(()=>{
        console.log(props)
    },[])
    const [page,setPage] = useState(1);
    const [rowsPerPage,setRowsPerPage] = useState(5)
    const handleChagePage = (e,page) =>{
        setPage(page)
    }
    return (
        <Box sx={{margin:matches?0:'0 20px 0 20px',mt:1,mb:1}}>
            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{p:1}}>
                    <Box>
                        <CardHeaderText color={blue[600]} title='Application History'/>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}} id='card-div'>
                        <div style={{overflowX:'auto',width:'100%'}}>
                        <table id='card-table'>
                            <thead>
                                <tr>
                                    <th>
                                        Date Filed
                                    </th>
                                    <th>
                                        Inclusive Dates
                                    </th>
                                    <th>
                                        Type of Leave
                                    </th>
                                    <th>
                                        Days/Hours Applied
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>
                                        Remarks
                                    </th>
                                    <th>
                                        Cancelled/Recalled Dates
                                    </th>
                                    <th>
                                        Disapproved By
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                                
                            </thead>
                            <tbody>
                               {
                                props.data.length>0
                                ?
                                props.data.slice((page-1)*rowsPerPage,(page-1)*rowsPerPage+rowsPerPage).map((item,key)=>
                                    
                                    <Fade in key={key}>
                                    <tr className="hover-row">
                                        <td>{moment(item.date_of_filing).format('MMMM DD, YYYY | hh:mm:ss A')}</td>
                                        <td>{item.inclusive_dates_text}</td>
                                        <td>{item.leave_type}</td>
                                        <td>{item.leave_type_id === 14?<span>{item.days_hours_applied} <small>hrs. </small></span>:<span>{item.days_hours_applied} <small>{item.days_hours_applied>1?'days':'day'}</small></span>}</td>
                                        <td>{<em style={{fontSize:'.7rem'}}>{item.status === 'FOR REVIEW' ? <span style={{color:'orange'}}>{item.status}</span>:item.status === 'DISAPPROVED'?<span style={{color:'red'}}>{item.status}</span>:<span style={{color:'green'}}>{item.status}</span>}</em>}
                                        </td>
                                        <td><small style={{color:grey[600]}}>{item.remarks}</small></td>
                                        <td>
                                            <ul>
                                            {
                                                JSON.parse(item.cancel_details).map((item2,key2)=>
                                                    <li key={key2} style={{fontSize:'.8rem',color:red[800]}}>{moment(item2.date).format('MMMM DD, YYYY')}</li>
                                                )
                                            }
                                            </ul>
                                        </td>
                                        <td><small style={{color:grey[600]}}>{item.disapproved_type}</small></td>
                                        <td align='center'>
                                        <Box sx={{display:'flex',gap:1,justifyContent:'flex-end'}}>
                                        <Tooltip title = 'Print Application Form' placement='top'><IconButton color='primary' disabled = {item.status==='APPROVED'?false:true} size='small' onClick = {()=>props.printPending(item)} sx={{'&:hover':{color:'#fff',background:blue[800]}}} className='custom-iconbutton'><PrintIcon/></IconButton></Tooltip>

                                        <Tooltip title='Request to reschedule leave'><span><IconButton color='info' className='custom-iconbutton' size='small' sx={{'&:hover':{color:'#fff',background:blue[500]}}} disabled = {item.status ==='DISAPPROVED'?true:false} onClick={(event)=>props.handleOpenReschedPopover(event,item)} aria-describedby={item.leave_application_id}><EditCalendarIcon/></IconButton></span></Tooltip>

                                        <Tooltip title='Cancel Leave'><span><IconButton color='error' className='custom-iconbutton' size='small' sx={{'&:hover':{color:'#fff',background:red[800]}}} disabled = {item.status ==='DISAPPROVED'?true:false} onClick={()=>props.handleCancelAppplication(item)}><CancelIcon/></IconButton></span></Tooltip>

                                        {/* <Tooltip title='Recall Leave'><span><IconButton color='success' className='custom-iconbutton' size='small' sx={{'&:hover':{color:'#fff',background:green[800]}}} disabled = {item.status ==='DISAPPROVED'?true:false} onClick={()=>props.handleRecallAppplication(item)}><RotateLeft/></IconButton></span></Tooltip> */}

                                        </Box>
                                        </td>

                                    </tr>
                                    </Fade>
                                )
                                :
                                <tr>
                                    <td colSpan={8} style={{textAlign:'center',color:red[800]}}>No Data</td>
                                </tr>
                               }
                            </tbody>
                        </table>
                        </div>
                    </Box>
                </Paper>
                {
                    props.data.length>0
                    ?
                    <Grid item xs={12} sx={{display:'flex',justifyContent:matches?'center':'flex-end',mt:1}}>
                        <PaginateCard data = {props.data} page={page} rowsPerPage={rowsPerPage} handleChagePage = {handleChagePage}/>
                    </Grid>
                    :
                    null
                }
                </Grid>
            </Grid>
        </Box>
        
    )
}