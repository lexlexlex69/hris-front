import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import React,{useEffect, useState} from "react";
//Icons
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import moment from "moment";
import { green, red, blue } from "@mui/material/colors";
import { requestedRescheduleLeaveAction } from "../LeaveApplicationRequest";
import { api_url } from "../../../../../request/APIRequestURL";
import Swal from "sweetalert2";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
export default function RequestedRescheduleModal(props){
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
    useEffect(()=>{
        console.log(props.data)
    },[])
    const formatDetails = (row) =>{
        var arr = JSON.parse(row);
        if(arr.length>0){
            return (
                <ul>
                    {
                        arr.map((item,key)=>
                            <li key={key}> {moment(item.date).format('MMMM DD, YYYY')} <ArrowRightAltIcon color='error'/> {moment(item.new_date).format('MMMM DD, YYYY')}</li>
                        )
                    }
                </ul>
            )
        }else{
            return null;
        }
    }
    const handleApproved = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'info',
            title:'Approving request',
            html:'Please wait...'
        })
        Swal.showLoading();

        row.type = 1;
        row.api_url = api_url;
        console.log(row)
        requestedRescheduleLeaveAction(row)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.handleUpdate(res.data.data)
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
            console.log(err)
        })
    }
    const handleDisApproved = (row) =>{
        console.log(row)
        Swal.fire({
            icon:'info',
            title:'Approving request',
            html:'Please wait...'
        })
        Swal.showLoading();

        row.type = 0;
        requestedRescheduleLeaveAction(row)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.handleUpdate(res.data.data)
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
            console.log(err)
        })
    }
    return(
        <Grid container sx={{mt:1}}>
            <Grid item xs={12}>
                <Paper>
                <TableContainer sx={{maxHeight:'60vh'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Name
                                </StyledTableCell>
                                <StyledTableCell>
                                    Details
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    Action
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.length>0
                                ?
                                props.data.map((item,key)=>
                                    <TableRow key ={key}>
                                        <StyledTableCell>
                                            {item.requested_by}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatDetails(item.details)}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                <Tooltip title='Approved'><IconButton color='success' className="custom-iconbutton" sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleApproved(item)}><ThumbUpIcon/></IconButton></Tooltip>
                                                <Tooltip title='Disapproved' ><IconButton color='error' className="custom-iconbutton" sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDisApproved(item)}><ThumbDownIcon/></IconButton></Tooltip>
                                            </Box>
                                        </StyledTableCell>
                                    </TableRow>
                                )
                                :
                                <TableRow>
                                        <TableCell align='center' colSpan={3}>No request as of the moment ...</TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}