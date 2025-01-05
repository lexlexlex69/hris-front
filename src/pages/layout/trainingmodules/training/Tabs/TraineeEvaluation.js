import React,{useEffect, useState} from 'react';
import {Box,Grid,Paper,TableContainer,Table,TableRow,TableHead,TableBody,TablePagination,IconButton,Tooltip,Typography,Button,FormControl,FormControlLabel,Radio,RadioGroup,TextField} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue,red} from '@mui/material/colors';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import Swal from 'sweetalert2';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import moment from 'moment';
import { addSanctionDate, getTraineeEvaluation } from '../TrainingRequest';
import TableLoading from '../../../loader/TableLoading';
import SmallestModal from '../../../custommodal/SmallestModal';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { APILoading, APIresult } from '../../../apiresponse/APIResponse';
import FullModal from '../../../custommodal/FullModal';
import { toast } from 'react-toastify';
import { getMyRqmt } from '../../traineedashboard/TraineeDashboardRequest';
import DefaultRequirementsPreview from '../../traineedashboard/TabsComponent/CustomComponents/DefaultRequirementsPreview';
import DefaultRequirementsPreviewDeptHead from '../../traineedashboard/TabsComponent/CustomComponents/DefaultRequirementsPreviewDeptHead';
const Input = styled('input')({
    display: 'none',
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function TraineeEvaluation(props){
    const [data,setData] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectedData,setSelectedData] = useState()
    const [sanctionDate,setSanctionDate] = useState('')
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
    useEffect(()=>{
        var data2 = {
            id:props.selectedTrainingID
        }
        getTraineeEvaluation(data2)
        .then(res=>{
            setData(res.data)
            setShowLoading(false)
        }).catch(err=>{
            console.log(err)
        })
    },[props.data])
    const handleViewFile = (id,row_data) =>{
        let fileName = row_data.lname+', '+row_data.fname+' '+row_data.training_app;
        viewFileAPI(id,fileName)
    }
    const [openSanction,setOpenSanction] = useState(false);
    const handleOpenSanction = (row) =>{
        console.log(row)
        if(row.sanction_date){
            setSanctionDate(row.sanction_date)
        }else{
            setSanctionDate(moment().add('1','year').format('YYYY-MM-DD'))
        }
        setSelectedData(row)
        setOpenSanction(true)
    }
    const handleCloseSanction = () =>{
        setOpenSanction(false)
    }
    const handleSaveSactionDate = (e) =>{
        e.preventDefault();
        // console.log(selectedData)
        APILoading('info','Saving data','Please wait...')
        var t_data = {
            id:selectedData.trainee_evaluation_id,
            training_details_id:selectedData.training_details_id,
            sanction_date:sanctionDate,
            emp_id:selectedData.emp_id
        }
        addSanctionDate(t_data)
        .then(res=>{
            if(res.data.status === 200){
                setData(res.data.data);
                handleCloseSanction()
            }
            APIresult(res);
        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
            console.log(err)
        })
        // console.log(t_data)
    }
    const [openPreviewLAPSAP,setOpenPreviewLAPSAP] = useState(false);
    const [reqData,setReqData] = useState([]);
    const handleOpenPreviewLAPSAP = async (row) =>{

        const id = toast.loading('Retrieving LAP/SAP')


        let data2 = {
            id:row.training_shortlist_id
        }
        const res = await getMyRqmt(data2);
        console.log(res.data)

        if(res.data.req_rqmt.is_final){
            toast.update(id,{
                render:'LAP/SAP Loaded',
                type:'success',
                autoClose:true,
                isLoading:false

            })
            setReqData(res.data.req_rqmt)

            setOpenPreviewLAPSAP(true)
            
        }else{
            toast.update(id,{
                render:'No final LAP/SAP submitted',
                type:'error',
                autoClose:true,
                isLoading:false
            })
        }
        
    }
    return(
        <React.Fragment>
        {
            showLoading
            ?
            <TableLoading/>
            :
            <Grid container spacing={1}>
                    <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Position</StyledTableCell>
                                        <StyledTableCell>Training Application</StyledTableCell>
                                        <StyledTableCell>Remarks</StyledTableCell>
                                        <StyledTableCell align='center'>Sanction Date</StyledTableCell>
                                        <StyledTableCell>Evaluated By</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.length === 0
                                        ?
                                        <TableRow> <StyledTableCell colSpan={7} align='center'>No data</StyledTableCell></TableRow>
                                        :
                                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                            <TableRow key = {key}>
                                                <StyledTableCell>{row.lname+', '+row.fname}</StyledTableCell>
                                                <StyledTableCell>{row.position_name}</StyledTableCell>
                                                <StyledTableCell>
                                                {row.training_app}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                {row.remarks !== 'Not Implemented' ? <span style={{color:green[800],fontWeight:'bold'}}>{row.remarks}</span>:<span style={{color:red[800],fontWeight:'bold'}}>{row.remarks}</span>}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                <span>{row.sanction_date?moment(row.sanction_date).format('MMMM DD,YYYY'):''}</span>
                                                {
                                                    row.remarks === 'Not Implemented'
                                                    ?
                                                    <Tooltip title='Update training sanction'><IconButton className='custom-iconbutton' color='primary' onClick={()=>handleOpenSanction(row)} sx={{'&:hover':{color:'#fff',background:blue[600]}}}><EditCalendarIcon/></IconButton></Tooltip>
                                                    :
                                                    ''
                                                }

                                                </StyledTableCell>
                                                <StyledTableCell>{row.evaluated_by}</StyledTableCell>
                                                <StyledTableCell>
                                                {
                                                    row?.evaluated_by
                                                    ?
                                                    <Tooltip title='View LAP/SAP'><IconButton color= 'primary' onClick={()=>handleOpenPreviewLAPSAP(row)} className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                    :
                                                        row?.file_id
                                                        ?
                                                        <Tooltip title='View LAP/SAP'><IconButton color= 'primary' onClick={()=>viewFileAPI(row.file_id)} className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                        :
                                                        null

                                                }
                                                
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            data.length ===0
                            ?
                            null
                            :
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        }
                        
                    </Paper>
                    
                    <SmallestModal open={openSanction} close={handleCloseSanction} title='Sanction Date'>
                        <form onSubmit={handleSaveSactionDate}>
                        <Box sx={{p:1}}>
                            <TextField type='date' label='Sanction Date' InputLabelProps={{shrink:true}} value = {sanctionDate} onChange={(val)=>setSanctionDate(val.target.value)} fullWidth required/>
                            <Box sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                                <Button variant='contained' className='custom-roundbutton' color='success' size='small' type='submit'>Save</Button>
                                <Button variant='contained' className='custom-roundbutton' color='error' size='small' onClick={handleCloseSanction}>Cancel</Button>
                            </Box>
                        </Box>
                        </form>
                    </SmallestModal>
                    </Grid>
                    <FullModal open = {openPreviewLAPSAP} close = {()=>setOpenPreviewLAPSAP(false)} title='Preview LAP/SAP'>
                        <DefaultRequirementsPreviewDeptHead reqData={reqData} printable={true}/>
                    </FullModal>
            </Grid>
        }
        </React.Fragment>
    )
}