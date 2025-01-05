import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
//Icons
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';

import {red} from '@mui/material/colors';
import Swal from "sweetalert2";
import { useState } from "react";
import { deleteRequestedRescheduleLeave } from "../LeaveApplicationRequest";

export default function ViewRequestedReschedModal(props){
    const [data,setData] = useState([])
    useEffect(()=>{
        setData(JSON.parse(props.data.resched_info))
    },[])
    const formatDetails = (row) =>{
        var arr = JSON.parse(row);
        if(arr.length>0){
            return (
                <ul>
                    {
                        arr.map((item,key)=>
                            <li key={key}> {moment(item.date).format('MMMM DD, YYYY')} <ArrowRightAltIcon color='error'/> {moment(item.new_date).format('MMMM DD, YYYY')}
                            </li>
                        )
                    }
                </ul>
            )
        }else{
            return null;
        }
    }
    const handleDelete = (row,index)=>{
        console.log(row)
        Swal.fire({
            icon:'question',
            title:'Confirm delete request?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Deleting request',
                    html:'Please wait'
                })
                Swal.showLoading();
                var t_data = {
                    id:row.leave_application_reschedule_id
                }
                deleteRequestedRescheduleLeave(t_data)
                .then(res=>{
                    if(res.data.status === 200){
                        var temp = [...data];
                        temp.splice(index,1);
                        setData(temp)
                        props.handleDeleteReschedule(res.data.data,temp)
                        props.setRequestedRescheduleData(res.data.reschedule_data)
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
                        icon:'success',
                        title:err
                    })
                })
                
            }
        })
    }
    return(
        <Grid container>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Details
                                    </TableCell>
                                    <TableCell>
                                        Status
                                    </TableCell>
                                    <TableCell>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map((item,key)=>
                                        <TableRow key={key} hover>
                                            <TableCell>
                                                {formatDetails(item.details)}
                                            </TableCell>
                                            <TableCell>
                                                {item.status}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title='Delete request'><span><IconButton className="custom-iconbutton" color="error" sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDelete(item,key)} disabled={item.status==='FOR REVIEW'?false:true}><DeleteIcon/></IconButton></span></Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}