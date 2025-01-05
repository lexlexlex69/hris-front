import { Box, Grid, Paper, TableContainer,Table,TableHead,TableRow,TableCell,TableBody, Tooltip, IconButton,FormControl,FormLabel,Select,InputLabel,MenuItem, TextField, Button } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { formatExtName, formatMiddlename } from "../../customstring/CustomString";
//Icons
import AttachmentIcon from '@mui/icons-material/Attachment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { viewFileAPI } from "../../../../viewfile/ViewFileRequest";
import {blue,green,red} from '@mui/material/colors';
import { actionRequestedReplacement, disapprovedTraineeReplacement } from "../TraineeApprovalHRDCRequest";
import Swal from "sweetalert2";
import { APILoading, APIresult } from "../../apiresponse/APIResponse";
import SmallestModal from "../../custommodal/SmallestModal";

export default function AllRequestedReplacement(props){
    const [data,setData] = useState(props.data);
    const [status,setStatus] = useState('FOR REVIEW')
    const formatArr = (row) => {
        var temp = JSON.parse(row)
        return (
            <ul>
                {
                temp.map((item,key)=>
                    <li key={key}>{`${item.fname} ${formatMiddlename(item.mname)} ${item.lname} ${formatExtName(item.extname)}`}</li>

                )}
            </ul>
        )
    }
    const handleChange = (event) => {
        setStatus(event.target.value);
    };
    const filterStatus = data.filter(el=> el.status === status)
    const handleApproved = async (row) => {
        try{
            APILoading('info','Approving data','Please wait...')
            var t_data = {
                type:1,
                data:row
            }
            console.log(t_data)
            const res = await actionRequestedReplacement(t_data)
            console.log(res.data)
            if(res.data.status === 200){
                setData(res.data.data)
            }
            APIresult(res)
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
    }
    const [openDisapprovalModal,setOpenDisapprovalModal] = useState(false)
    const [disapprovalData,setDisapprovalData] = useState()
    const [reason,setReason] = useState('')
    const handlCloseDisapprovalModal = () => {
        setOpenDisapprovalModal(false)
    }
    const handleDisApproved  = async (row) => {
        console.log(row)
        setDisapprovalData(row)
        setOpenDisapprovalModal(true)
    }
    const submitDisapproval = async (e) => {
        e.preventDefault();
        APILoading('info','Disapproving request','Please wait...')
        try{
            var t_data = {
                data:disapprovalData,
                reason:reason
            }
            const res = await disapprovedTraineeReplacement(t_data)
            if(res.data.status===200){
                setData(res.data.data)
                handlCloseDisapprovalModal()
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
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
    }

    return(
        <Box sx={{p:1}}>
            <Grid container>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Status"
                        onChange={handleChange}
                        >
                        <MenuItem value='FOR REVIEW'>FOR REVIEW</MenuItem>
                        <MenuItem value='APPROVED'>APPROVED</MenuItem>
                        <MenuItem value='DISAPPROVED'>DISAPPROVED</MenuItem>
                        </Select>
                    </FormControl>
                    <Paper>
                        <TableContainer sx={{maxHeight:'60vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Office</TableCell>
                                        <TableCell>To Replace</TableCell>
                                        <TableCell>Replacement</TableCell>
                                        <TableCell>Attachment</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date Requested</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        filterStatus.length>0
                                        ?
                                        filterStatus.map((item,key)=>
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {item.short_name}
                                                </TableCell>
                                                <TableCell>
                                                    {formatArr(item.replace_info)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatArr(item.replacement_info)}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title='View attachment'><IconButton onClick={()=>viewFileAPI(item.file_id)} color='primary'><AttachmentIcon/></IconButton></Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    {item.status === 'DISAPPROVED'?item.status+' ('+item.reason+')':item.status}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(item.created_at).format('MMMM DD, YYYY | hh:mma')}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.status === 'FOR REVIEW'
                                                        ?
                                                        <Box sx={{display:'flex',gap:1}}>
                                                            <Tooltip title='Approved'><IconButton color='success' className="custom-iconbutton" sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleApproved(item)}><ThumbUpIcon/></IconButton></Tooltip>

                                                            <Tooltip title='Disapproved'><IconButton color='error' className="custom-iconbutton" sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDisApproved(item)}><ThumbDownIcon/></IconButton></Tooltip>
                                                        </Box>
                                                        :
                                                        null
                                                    }
                                                    
                                                </TableCell>
                                            </TableRow>
                                        )

                                            :
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    No data
                                                </TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <SmallestModal open = {openDisapprovalModal} close={handlCloseDisapprovalModal} title='Reason for disapproval'>
                            <Box sx={{p:1}}>
                                <form onSubmit={submitDisapproval}>
                                    <TextField label='Reason' value = {reason} onChange={(val)=>setReason(val.target.value)} fullWidth required/>
                                    <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                                        <Button variant="contained" color="success" className="custom-roundbutton" type="submit">Submit</Button>
                                    </Box>
                                </form>
                            </Box>
                        </SmallestModal>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}