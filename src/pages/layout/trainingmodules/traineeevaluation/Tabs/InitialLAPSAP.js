import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {green,orange,grey,blue,red} from '@mui/material/colors';
import { approvedInitalLAPSAP, disapprovedInitalLAPSAP, getInitalLAPSAP } from "../TraineeEvaluationRequest";
import moment from "moment";
import FullModal from "../../../custommodal/FullModal";
import { formatExtName, formatMiddlename } from "../../../customstring/CustomString";
import DefaultRequirementsPreviewDeptHead from "../../traineedashboard/TabsComponent/CustomComponents/DefaultRequirementsPreviewDeptHead";
//Icons
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { APILoading } from "../../../apiresponse/APIResponse";
import Swal from "sweetalert2";
import MediumModal from "../../../custommodal/MediumModal";
import LargeModal from "../../../custommodal/LargeModal";
import { Reviewed } from "../components/Reviewed";
import SmallModal from "../../../custommodal/SmallModal";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        padding:10,
        color: theme.palette.common.white,
        fontFamily:'latoreg'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        padding:10
    },
  }));
export const InitialLAPSAP = () => {
    const [data,setData] = useState([])
    const [openPending,setOpenPending] = useState(false)
    const [openReview,setOpenReview] = useState(false)
    useEffect(()=>{
        _init();
    },[])
    const [reqData,setReqData] = useState();
    const [pendingList,setPendingList] = useState([]);
    // const [reviewData,setPendingList] = useState([]);
    const _init = async () =>{
        const res = await getInitalLAPSAP();
        // console.log(res.data)
        setData(res.data.data)
    }
    const handleViewPending = (item)=>{
        // console.log(item.pending)
        setPendingList(JSON.parse(item.pending))
        setOpenPending(true)
        // setReqData(item.pending)
    }
    const handleReview = (item) => {
        // console.log(item)
        setReqData(item)
        setOpenReview(true)
    }
    const handleApproved = async () =>{
        console.log(reqData)
        try{
            APILoading('info','Approving LAP/SAP','Please wait...')
            const res = await approvedInitalLAPSAP({id:reqData.trainee_training_app_req_id})
            if(res.data.status === 200){
                //remove from pending list
                let temp = [...pendingList];
                var index = temp.findIndex(x => x.trainee_training_app_req_id === reqData.trainee_training_app_req_id);
                temp.splice(index,1);
                setPendingList(temp);
                setData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1000

                })
                setOpenReview(false)
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
    const [reviewedList,setReviewedList] = useState([])
    const [openReviewed,setOpenReviewed] = useState(false)
    const handleViewReviewed = (item) => {
        // console.log(item.approved)
        setReviewedList(JSON.parse(item.approved))
        setOpenReviewed(true)
    }
    const [openRemarks,setOpenRemarks] = useState(false)
    const [remarks,setRemarks] = useState('')
    const handleRemarks = ()=>{
        setOpenRemarks(true)
    }
    const handleDisapproved = async ()=>{
        try{

            APILoading('info','Disapproving LAP/SAP','Please wait...')
            var t_data = {
                id:reqData.trainee_training_app_req_id,
                remarks:remarks
            }   
            const res = await disapprovedInitalLAPSAP(t_data)
            if(res.data.status === 200){
                //remove from pending list
                let temp = [...pendingList];
                var index = temp.findIndex(x => x.trainee_training_app_req_id === reqData.trainee_training_app_req_id);
                temp.splice(index,1);
                setPendingList(temp);
                setData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1000

                })
                setOpenRemarks(false)
                setOpenReview(false)
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
    return (
        <Box>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell rowSpan={2}>
                                    Training Name
                                </StyledTableCell>
                                <StyledTableCell colSpan={2} align="center">
                                    Training Period
                                </StyledTableCell>
                                <StyledTableCell rowSpan={2}>
                                    Training Application
                                </StyledTableCell>
                                <StyledTableCell rowSpan={2} align="center">
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell align="center">
                                    From
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    To
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.length>0
                                ?
                                    data.map((item)=>{
                                        return(
                                            <TableRow key={item.training_details_id}>
                                                <StyledTableCell>{item.training_name}</StyledTableCell>
                                                <StyledTableCell align="center">{moment(item.period_from,'YYYY-MM-DD').format('MMMM DD, YYYY')}</StyledTableCell>
                                                <StyledTableCell align="center">{moment(item.period_to,'YYYY-MM-DD').format('MMMM DD, YYYY')}</StyledTableCell>
                                                <StyledTableCell>{item.training_app}</StyledTableCell>
                                                <StyledTableCell sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                    <Button variant="contained" color="info" onClick={()=>handleViewPending(item)} disabled = {item.pending?false:true}>Pending</Button>
                                                    <Button variant="contained" color="success" disabled = {item.approved?false:true} onClick={()=>handleViewReviewed(item)}>Reviewed</Button>
                                                </StyledTableCell>
                                            </TableRow>

                                        )
                                    })
                                :
                                <TableRow>
                                    <StyledTableCell colSpan={4} align="center">No data</StyledTableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <FullModal open = {openPending} close = {()=>setOpenPending(false)} title='LAP/SAP Pending for Approval'>
                <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Name
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    pendingList.length>0
                                    ?
                                    pendingList.map((item)=>{
                                        return(
                                            <TableRow key={item.training_shortlist_id}>
                                                <StyledTableCell>{`${item.fname} ${formatMiddlename(item.mname)} ${item.lname} ${formatExtName(item.extname)}`}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button variant="contained" onClick={()=>handleReview(item)}>Review</Button>
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    <TableRow>
                                        <StyledTableCell colSpan={2} align="center">No Data</StyledTableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </FullModal>
            <FullModal open={openReview} close = {()=>setOpenReview(false)} title='Reviewing LAP/SAP'>
                <DefaultRequirementsPreviewDeptHead reqData = {reqData}/>
                <Box sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant="contained" color="success" startIcon={<ThumbUpIcon/>} onClick={handleApproved}>Approved</Button>
                    <Button variant="contained" color="error" startIcon={<ThumbDownIcon/>} onClick={handleRemarks}>Disapproved</Button>
                </Box>
            </FullModal>
            <LargeModal open = {openReviewed} close = {()=>setOpenReviewed(false)} title='Reviewed LAP/SAP'>
                <Reviewed data = {reviewedList}/>
             
            </LargeModal>
            <SmallModal open = {openRemarks} close = {()=>setOpenRemarks(false)} title='Disapproved LAP/SAP'>
                <Grid container sx={{p:1}} spacing={1}>
                    <Grid item xs={12}>
                        <TextField label= 'Remarks for disapproval' value={remarks} onChange={(val)=>setRemarks(val.target.value)} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant="contained" className="custom-roundbutton" size="small" color='success' onClick={handleDisapproved}>Submit</Button>
                        <Button variant="contained" className="custom-roundbutton" size="small" onClick={()=>setOpenRemarks(false)} color="error">Cancel</Button>
                    </Grid>
                </Grid>
            
            </SmallModal>
        </Box>
    )
    
}