import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import moment from 'moment';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteRequestedOBOFTRectification } from '../DTRRequest';
import Swal from 'sweetalert2';
import { blue } from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
export default function RequestedOBOFT(props){
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
    const formatDaysDetails = (data) => {
        var arr = JSON.parse(data)

        return (
            <ul style={{maxHeight:'20dvh',overflow:'auto'}}>
                {
                    arr.map((item,key)=>
                    <li key={key} style={{display:'flex',flexDirection:'column',marginBottom:'10px'}}>
                    <span style={{display:'flex',justifyContent:'space-between'}}><strong>Date:</strong> <span style={{color:blue[800]}}>{moment(item.date).format('MMMM DD, YYYY')}</span></span>
                    {
                        item.time_in
                        ?
                        <span style={{display:'flex',justifyContent:'space-between'}}><strong>Time In:</strong> {moment(item.time_in,['h:m']).format('hh:mm a')}</span>
                        :
                        ''
                    }
                    {
                        item.break_out
                        ?
                        <span style={{display:'flex',justifyContent:'space-between'}}><strong>Break Out:</strong> {moment(item.break_out,['h:m']).format('hh:mm a')}</span>
                        :
                        ''
                    }
                    {
                        item.break_in
                        ?
                        <span style={{display:'flex',justifyContent:'space-between'}}><strong>Break In:</strong> {moment(item.break_in,['h:m']).format('hh:mm a')}</span>
                        :
                        ''
                    }
                    {
                        item.time_out
                        ?
                        <span style={{display:'flex',justifyContent:'space-between'}}><strong>Time Out:</strong> {moment(item.time_out,['h:m']).format('hh:mm a')}</span>
                        :
                        ''
                    }
                    <span style={{display:'flex',justifyContent:'space-between'}}><strong>Remarks: {item.remarks}</strong></span>
                    </li>
                    )
                }
            </ul>
        )
    }
    const handleDelete = (row) =>{
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
                    html:'Please wait...'
                })
                Swal.showLoading()
                console.log(row)
                var t_data = {
                    id:row.hris_ob_ot_id
                }
                deleteRequestedOBOFTRectification(t_data)
                .then(res=>{
                    if(res.data.status === 200){
                        props.setData(res.data.data)
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
    const handleViewFile = (item) => {
        // console.log(item)
        viewFileAPI(item)
    }
    return (
        <Grid container sx={{mt:0}}>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Date Filed
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Date From
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Date To
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Details
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Remarks
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        File
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Action
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.data.map((item,key)=>
                                        <TableRow key={key} hover>
                                            <StyledTableCell>
                                                {moment(item.created_at).format('MMMM DD, YYYY hh:mm a')}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {moment(item.date_from).format('MMMM DD, YYYY')}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {moment(item.date_to).format('MMMM DD, YYYY')}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {formatDaysDetails(item.days_details)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {item.ob_oft_remarks}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {
                                                    JSON.parse(item.file_id).map((item2,key2)=>{
                                                        return (
                                                            <Tooltip title={`View File #${key2+1}`}>
                                                            <IconButton key={item2} color='info' onClick={()=>handleViewFile(item2)}><AttachmentIcon/></IconButton>
                                                            </Tooltip>
                                                        )
                                                    })
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <span style={{color:item.status === 'APPROVED'?'green':item.status==='DISAPPROVED'?'red':'blue'}}><em>{item.status}</em></span>
                                                {
                                                    item.remarks
                                                    ?
                                                    <span>&nbsp;<em>({item.remarks})</em></span>
                                                    :
                                                    ''
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title='Delete request'><span><IconButton color='error' className='custom-iconbutton' disabled={item.status==='FOR REVIEW'?false:true} onClick={()=>handleDelete(item)}><DeleteIcon/></IconButton></span></Tooltip>
                                            </StyledTableCell>
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