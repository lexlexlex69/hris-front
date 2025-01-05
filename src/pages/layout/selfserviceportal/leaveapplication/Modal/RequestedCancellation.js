import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import moment from "moment";
import React,{useState} from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { green, red, blue } from "@mui/material/colors";
import { requestLeaveCancellationAction } from "../LeaveApplicationRequest";
import Swal from "sweetalert2";
import { api_url } from "../../../../../request/APIRequestURL";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

export default function RequestedCancellation(props){
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[600],
        color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        paddingTop:5,
        paddingBottom:5,
        },
    }));
    const handleApproved = (data) =>{
        Swal.fire({
            icon:'question',
            title:'Confirm approved cancellation ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Approving cancellation of leave',
                    html:'Please wait...'
                })
                Swal.showLoading()
                var applied = 0;
                switch(data.leave_type_id){
                    case 14:
                        JSON.parse(data.date_details).forEach(el=>{
                            if(el.period === 'NONE'){
                                applied+=8;
                            }else{
                                applied+=4;
                            }
                        })
                    break;
                    default:
                        JSON.parse(data.date_details).forEach(el=>{
                            if(el.period === 'NONE'){
                                applied+=1;
                            }else{
                                applied+=.5;
                            }
                        })
                    break;
                }
                
                var t_data = {
                    applied:applied,
                    leave_application_id:data.leave_application_id,
                    leave_type_id:data.leave_type_id,
                    date:data.date_details,
                    reason:data.reason,
                    leave_cancellation_request_id:data.leave_cancellation_request_id,
                    employee_id:data.employee_id,
                    api_url:api_url
                }
                console.log(t_data)
                requestLeaveCancellationAction(t_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        props.updateData(res.data.data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
        
    }
    return(
        <Box sx={{mt:1}}>
            <Grid container>
                <Grid item xs={12}>
                    <Paper>
                    <TableContainer sx={{maxHeight:'50vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <StyledTableCell>
                                    Name
                                </StyledTableCell>
                                <StyledTableCell>
                                    Type of leave
                                </StyledTableCell>
                                <StyledTableCell>
                                    Date
                                </StyledTableCell>
                                <StyledTableCell>
                                    Reason
                                </StyledTableCell>
                                <StyledTableCell>
                                    Action
                                </StyledTableCell>
                            </TableHead>
                            <TableBody>
                                {
                                    props.data.length>0
                                    ?
                                    props.data.map((item,key)=>
                                        <TableRow>
                                            <StyledTableCell>{item.requested_by}</StyledTableCell>
                                            <StyledTableCell>{item.short_name}</StyledTableCell>
                                            <StyledTableCell>
                                                <ul>{JSON.parse(item.date_details).map((item2,key2)=>
                                                <li key={key2}>{moment(item2.date).format('MMMM DD, YYYY')} {item2.period==='NONE'?'':item.period}</li>
                                                    )}
                                                </ul>
                                            </StyledTableCell>
                                            <StyledTableCell>{item.reason}</StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{display:'flex',gap:1}}>
                                                    <Tooltip title='Approved'>
                                                        <IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{background:green[800],color:'#fff'}}} onClick={()=>handleApproved(item)}><ThumbUpIcon /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title='Disapproved'>
                                                        <IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{background:red[800],color:'#fff'}}}><ThumbDownIcon/></IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                    :
                                    <TableRow>
                                        <TableCell align='center' colSpan={5}>No request as of the moment ...</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}