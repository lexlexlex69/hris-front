import { Fade, Grid, Paper, Typography,Button } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {green,orange,grey,blue,red} from '@mui/material/colors';
//Icons
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';

import { getMyRqmt, getUpdatedLAPSAP } from "../../TraineeDashboardRequest";
import { toast } from "react-toastify";
import FullModal from "../../../../custommodal/FullModal";
import AddDefaultRequirements from "./AddDefaultRequirements";
import UpdateDefaultRequirements from "./UpdateDefaultRequirements";
import DefaultRequirementsPreview from "./DefaultRequirementsPreview";
import { APILoading } from "../../../../apiresponse/APIResponse";
import Swal from "sweetalert2";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function UpdateLAPSAP(props){
    console.log(props)
    const [updateDateStart,setUpdateDateStart] = useState('');
    const [updateDateEnd,setUpdateDateEnd] = useState('');
    useEffect(()=>{
        /**
        Set date to enable updating of LAP/SAP 1 day before evaluation of dept head 89 days
         */
        let date = moment(props.reqData.period_to).add(11,'days');
        let date_end = moment(props.reqData.period_to).add(105,'days');
        setUpdateDateStart(date)
        setUpdateDateEnd(date_end)
    },[])
    const [openUpdateLAPSAP,setOpenUpdateLAPSAP] = useState(false)
    const handleUpdateLAPSAP = async () =>{
        /**
        Get previous submitted LAP SAP
         */
        // const id = toast.loading('Retrieving LAP/SAP')
        APILoading('info','Retrieving LAP/SAP','Please wait...')
        try{
            let req_data = {
                id:props.reqData.training_shortlist_id
            }
            const res = await getUpdatedLAPSAP(req_data);
            // toast.update(id,
            //     {
            //     render:'Successfully retrieved',
            //     type:'success',
            //     isLoading:false,
            //     autoClose:true
            // })
            props.setReqData(res.data.req_rqmt)
            setOpenUpdateLAPSAP(true)
            Swal.close();
        }catch(err){
            // toast.update(id,
            //     {
            //     render:err,
            //     type:'error',
            //     isLoading:false,
            //     autoClose:true
            // })
            Swal.fire({
                icon:'error',
                text:err
            })
        }
        
    }
    const [openViewTrainingApp,setOpenViewTrainingApp] = useState(false)
    const handleViewTrainingApp = () =>{
        setOpenViewTrainingApp(true)
    }
    return(
        <Grid container>
            {/* {evaluationDate} */}
            {
                moment().format('YYYY-MM-DD') < moment(updateDateStart).format('YYYY-MM-DD')
                ?
                null
                :
                    moment().format('YYYY-MM-DD') >= moment(updateDateStart).format('YYYY-MM-DD') && moment().format('YYYY-MM-DD') <= moment(updateDateEnd).format('YYYY-MM-DD') || props.reqData
                    ?
                    <Fade in>
                        <Grid item xs={12}>
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    Training App
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Submission deadline
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Evaluation Status
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    Action
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <StyledTableCell>
                                                    {props.reqData.type}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {moment(updateDateEnd).format('MMMM DD, YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <strong>{props.reqData?.status}</strong>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {
                                                        props.reqData.is_final
                                                        ?
                                                        <>
                                                        <Button variant='contained' color='info' className="custom-roundbutton" startIcon={<ContentPasteSearchIcon/>} onClick={handleViewTrainingApp}> View LAP/SAP</Button>
                                                            <FullModal open ={openViewTrainingApp} close = {()=>setOpenViewTrainingApp(false)} title={`Viewing ${props.reqData.type}`}>
                                                            <DefaultRequirementsPreview reqData = {props.reqData}/>
                                                        </FullModal>
                                                        </>
                                                        :
                                                        <>
                                                        <Button variant='contained' color='info' className="custom-roundbutton" startIcon={<EditIcon/>} onClick={handleUpdateLAPSAP}> Update Final LAP/SAP</Button>
                                                        <FullModal open={openUpdateLAPSAP} close = {()=>setOpenUpdateLAPSAP(false)} title='Updating Final LAP/SAP'>
                                                            <UpdateDefaultRequirements data={props.reqData} close = {()=>setOpenUpdateLAPSAP(false)} type={props.reqData.training_app} reqData = {props.reqData}/>
                                                        </FullModal>
                                                        </>
                                                    }
                                                    
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        </Grid>
                    </Fade>
                    :
                    <Grid item xs={12}>
                    <Typography sx={{textAlign:'center',fontSize:'1.1rem',color:red[800],fontWeight:'bold'}}>Oops... Submission cut off</Typography>
                    <Typography sx={{textAlign:'center',fontStyle:'italic'}}>Please contact HR Office (Learning and Development Division)</Typography>
                    </Grid>
            }
        </Grid>
    )
}