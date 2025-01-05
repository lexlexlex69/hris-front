import React,{useEffect, useState} from 'react';
import {Box,Grid,Paper,TableContainer,Table,TableRow,TableHead,TableBody,TablePagination,IconButton,Tooltip,Typography,Button,FormControl,FormControlLabel,Radio,RadioGroup,TextField} from '@mui/material';
import { addTraineeEvaluation, getEvaluatedTrainees, getEvaluateTrainees } from '../TraineeEvaluationRequest';
import DataTableLoader from '../../../loader/DataTableLoader';
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
import { toast } from 'react-toastify';
import { getMyRqmt } from '../../traineedashboard/TraineeDashboardRequest';
import FullModal from '../../../custommodal/FullModal';
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
export default function Evaluated(props){
    const [data,setData] = useState([]);
    const [showLoading,setShowLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };
    useEffect(()=>{
        var data2 = {
            id:props.data.training_details_id,
            dept_code:props.data.dept_code,
            training_app:props.data.training_app
        }
        getEvaluatedTrainees(data2)
        .then(res=>{
            setData(res.data)
            setShowLoading(false)
        }).catch(err=>{
            console.log(err)
        })
    },[props.data])
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
            <Box sx={{display:'flex',justifyContent:'center'}}>
                <DataTableLoader/>
            </Box>
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
                                        <StyledTableCell>Sanction Date</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.length === 0
                                        ?
                                        <TableRow> <StyledTableCell colSpan={6} align='center'>No data</StyledTableCell></TableRow>
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
                                                <StyledTableCell>{row.sanction_date?moment(row.sanction_date).format('MMMM DD,YYYY'):''}</StyledTableCell>
                                                <StyledTableCell>
                                                {
                                                    row?.evaluated_by
                                                    ?
                                                    <Tooltip title={`View ${row.training_app}`}><IconButton color= 'primary' onClick={()=>handleOpenPreviewLAPSAP(row)} className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                    :
                                                        row?.file_id
                                                        ?
                                                        <Tooltip title={`View ${row.training_app}`}><IconButton color= 'primary' onClick={()=>viewFileAPI(row.file_id)} className='custom-iconbutton'><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
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

                    </Grid>
                    <FullModal open = {openPreviewLAPSAP} close = {()=>setOpenPreviewLAPSAP(false)} title='Preview LAP/SAP'>
                        <DefaultRequirementsPreviewDeptHead reqData={reqData} printable={true}/>
                    </FullModal>
            </Grid>
        }
        </React.Fragment>
    )
}