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

import PaginateCard from "./PaginateCard";
import CardHeaderText from "./CardHeaderText";

export default function PendingLeave(props,ref){
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
            <Grid container sx={{mb:1}}>
                <Grid item xs={12}>
                    <Paper sx={{p:1}}>
                    <Box>
                        <CardHeaderText color={red[700]} title='Pending Application'/>
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
                                        <td>{moment(item.date_of_filing).format('MMMM DD, YYYY | hh:mm A')}</td>
                                        <td>{item.inclusive_dates_text}</td>
                                        <td>{item.leave_type}</td>
                                        <td>{item.leave_type_id === 14?<span>{item.days_hours_applied} hrs.</span>:<span>{item.days_hours_applied} {item.days_hours_applied>1?'days':'day'}</span>}</td>
                                        <td><em style={{fontSize:'.7rem'}}>{item.status === 'FOR REVIEW' ? <span style={{color:orange[900]}}>{item.status}</span>:<span style={{color:'green'}}>{item.status}</span>}</em>
                                        </td>
                                        <td><small style={{color:grey[600]}}>{item.remarks}</small></td>
                                        <td>
                                        <Box sx={{display:'flex',gap:1,justifyContent:'flex-end'}}>
                                            <Tooltip title='View Application'><IconButton color='info' className="custom-iconbutton" size="small" sx={{'&:hover':{background:blue[600],color:'#fff'}}} onClick={()=>props.previewPending(item)}><VisibilityIcon/></IconButton></Tooltip>
                                            {
                                                item.file_ids !==null || item.leave_type_id === 4
                                                ?
                                                JSON.parse(item.file_ids).map((row2,key)=>
                                                    <Tooltip title = {'View Attachment #'+(key+1)} key={key}><IconButton aria-label="viewfile" onClick = {()=>props.showFileAttachment(row2)} size="small" className='custom-iconbutton' sx={{color:blue[300],'&:hover':{color:'#fff',background:blue[300]}}}>
                                                        <AttachmentIcon  />
                                                    </IconButton>
                                                    </Tooltip>
                                                )
                                                :
                                                ''
                                            }
                                            {
                                                props.employeeInfo.dept_code === 12
                                                ?
                                                <>
                                                {/* <Tooltip title='Print Application'><span><IconButton color='primary' className="custom-iconbutton" size="small" sx={{'&:hover':{background:blue[800],color:'#fff'}}} disabled = {item.status === 'FOR REVIEW' || item.status === 'FOR UPDATING'?true:false} onClick={()=>props.printPending(item)}><PrintIcon/></IconButton></span></Tooltip> */}
                                                <Tooltip title='Print Application'><span><IconButton color='primary' className="custom-iconbutton" size="small" sx={{'&:hover':{background:blue[800],color:'#fff'}}} disabled = {item.status === 'FOR APPROVAL'?false:true} onClick={()=>props.printPending(item)}><PrintIcon/></IconButton></span></Tooltip>
                                                </>
                                                :
                                                    item.status === 'FOR APPROVAL'
                                                    ?
                                                    <Tooltip title='Print Application'><span><IconButton color='primary' className="custom-iconbutton" size="small" sx={{'&:hover':{background:blue[800],color:'#fff'}}} onClick={()=>props.printPending(item)}><PrintIcon/></IconButton></span></Tooltip>
                                                    :
                                                    <Tooltip title='Print Application'><span><IconButton color='primary' className="custom-iconbutton" size="small" sx={{'&:hover':{background:blue[800],color:'#fff'}}} disabled><PrintIcon/></IconButton></span></Tooltip>
                                            }
                                            {/* {
                                                item.status === 'FOR APPROVAL' || item.status === 'FOR RECOMMENDATION'
                                                ?
                                                <Tooltip title='Cancel Leave'><span><IconButton color='error' className='custom-iconbutton' size='small' sx={{'&:hover':{color:'#fff',background:red[800]}}} disabled = {item.status ==='DISAPPROVED'?true:false} onClick={()=>props.handleCancelAppplication(item)}><CancelIcon/></IconButton></span></Tooltip>
                                                :
                                                null

                                            } */}

                                            <Tooltip title = 'Delete Application'><span><IconButton aria-label="delete" color="error" size="small" sx={{'&:hover': { bgcolor: red[800], color: '#fff' }}} disabled = {item.status === 'FOR REVIEW' && item.is_incharge ? false : item.status === 'FOR REVIEW' && !item.remarks? false:true} onClick = {()=>props.cancelApplication(item)} className='custom-iconbutton'><DeleteIcon/></IconButton></span></Tooltip>
                                        </Box>
                                        {/* <SpeedDial
                                            ariaLabel={`speedial-${key}`}
                                            icon={<SpeedDialIcon/>}
                                            direction='left'
                                            sx={{position:'relative','& .MuiFab-primary': { width: 40, height: 40 ,'& .MuiSpeedDialIcon-icon': { fontSize: 20 } } }}
                                        >
                                            <SpeedDialAction
                                                key='view'
                                                icon={<PrintIcon/>}
                                                tooltipTitle='View Application'
                                                // sx={{position:'absolute',right:40,top:0}}
                                            />
                                            <SpeedDialAction
                                                key='view'
                                                icon={<PrintIcon/>}
                                                tooltipTitle='View Application'
                                                // sx={{position:'absolute',right:80}}
                                            />

                                        </SpeedDial> */}
                                        </td>

                                    </tr>
                                    </Fade>
                                )
                                :
                                <tr>
                                    <td colSpan={7} style={{textAlign:'center',color:red[800]}}>No Data</td>
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