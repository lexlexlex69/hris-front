import React,{useState} from 'react';
import { Container, Grid, TextField, Typography,Box,Button,FormControl,InputLabel,Select,MenuItem, Paper,Tooltip, Modal,IconButton,Table,TableHead,TableContainer,TableRow,TableBody,TablePagination,TableCell,TableFooter} from '@mui/material';
import DatePicker from 'react-multi-date-picker';
// import TimePicker from "react-multi-date-picker/plugins/time_picker";
//icon
import InputIcon from 'react-multi-date-picker/components/input_icon';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import CachedIcon from '@mui/icons-material/Cached';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import Swal from 'sweetalert2';
import { AttachFile } from '@mui/icons-material';
import { blue, green, red, yellow,orange } from '@mui/material/colors'
import AddDTRRectificationRequest from './AddDTRRectificationRequest';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    marginBottom: 0,
    background: '#fff',
    border: '2px solid #fff',
    borderRadius:10, 
    boxShadow: 24,
    p: 4
};
export default function DTRRectificationRequest(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?11:14,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize:matches?10: 12,
        },
    }));
    const Input = styled('input')({
        display: 'none',
    });
    const [addRequestModal,setAddRequestModal] = React.useState(false)

    const formatTime = (row) => {
        
        var date = moment(row.date+' '+row.rectified_time).format('h:mm:ss A')
        return date;
    }
    const [isAllRequest,setIsAllRequest] = React.useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const showAllRectificationRequest2 = ()=>{
        setIsAllRequest(true)
        props.showAllRectificationRequest()
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return(
        <Grid container spacing={1}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={props.isRequestAllLoading}
                >
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <CircularProgress color="inherit" />
                    <Typography sx={{textAlign:'center'}}>Loading all rectification request data. <br/> Please wait...</Typography>
                    </Box>
                </Backdrop>
                <Grid item xs = {12} sx={{marginBottom:'5px'}}>
                    <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>

                    <Grid item xs={12} sm = {12} md={6} lg={6} sx={{marginBottom:matches?'5px':0}}>
                        <Typography>Showing {isAllRequest?<em><strong>All</strong></em>:<em><strong> {props.period}</strong></em>} records:</Typography>
                    </Grid>
                    <Grid item xs={12} sm = {12} md={6} lg={6}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:1}}>
                            <Tooltip title='Show all applied rectification request' placement='top'>
                            <Button variant='contained' size='small' onClick = {showAllRectificationRequest2} sx={{fontSize:matches?'10px':'auto',width:matches?'100%':'auto'}} className='custom-roundbutton'> Show All Request</Button>
                            </Tooltip>

                            <Tooltip title='Add request' placement='top'>
                                <Button variant='contained' color='success' className='custom-roundbutton' onClick={props.openAddModal} startIcon={<AddIcon/>}>Add</Button>
                            </Tooltip>
                            <Tooltip title='Refresh Data' placement='top'>
                                <IconButton onClick={props.refreshData} sx={{'&:hover':{color:'#fff',background:blue[800]}}} className='custom-iconbutton' color='primary'><CachedIcon sx={{transition:'0.4s ease-in-out','&:hover':{transform:'rotate(-180deg)'}}} /> </IconButton>
                            </Tooltip>
                            
                        </Box>

                    </Grid>
                    </Box>

                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Date of Request</StyledTableCell>
                                        <StyledTableCell>Rectified Date</StyledTableCell>
                                        <StyledTableCell>Rectified Time</StyledTableCell>
                                        <StyledTableCell>Nature</StyledTableCell>
                                        <StyledTableCell>Reason</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Remarks</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.pendingRectificationData.length === 0
                                        ?
                                        <TableRow><StyledTableCell align='center' colSpan={8}>No Data</StyledTableCell></TableRow>
                                        :
                                        props.pendingRectificationData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                            <TableRow hover key ={key}>
                                                <StyledTableCell>{moment(row.created_at).format('MMMM DD, YYYY h:mm:ss A')}</StyledTableCell>
                                                <StyledTableCell>{moment(row.date).format('MMMM DD, YYYY')}</StyledTableCell>
                                                <StyledTableCell>{formatTime(row)}</StyledTableCell>
                                                <StyledTableCell>{row.nature}</StyledTableCell>
                                                <StyledTableCell>{row.reason}</StyledTableCell>
                                                <StyledTableCell>{row.status ==='FOR REVIEW' || row.status ==='FOR APPROVAL' ? <span style={{color:'blue'}}><em>{row.status}</em></span>:row.status ==='APPROVED' ?<span style={{color:'green'}}><em>{row.status}</em></span>:<span style={{color:'red'}}><em>{row.status}</em></span>}</StyledTableCell>
                                                <StyledTableCell>{<small><em>{row.remarks}</em></small>}</StyledTableCell>
                                                <StyledTableCell>{<Tooltip title = 'Cancel Application'><span>
                                                <IconButton size='small' color='error' onClick={()=>props.cancelApplication(row)} disabled = {row.status === 'FOR REVIEW' || row.status === 'DISAPPROVED' || row.remarks === 'FOR HR APPROVAL' ? false:true} className='custom-iconbutton'><DeleteForeverIcon/></IconButton></span>
                                                </Tooltip>}</StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                    <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, 100]}
                                            colSpan={8}
                                            count={props.pendingRectificationData.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        
                    </Paper>

                </Grid>
                <Modal
                    open={props.addModal}
                    // onClose={()=>setAddRequestModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box style = {style}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {props.closeAddModal}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase',fontSize:matches?'1rem':'1.2rem'}}>
                        Adding Rectification Request
                    </Typography>
                        {/* <Box>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'20px',color:'#2196F3'}} variant="h6">
                        Adding Rectification Request
                        </Typography>
                        </Box> */}
                        <Box sx={{m:1,maxHeight:'80vh'}}>
                            <AddDTRRectificationRequest handleClose = {props.closeAddModal} submitRectificationRequest = {props.submitRectificationRequest} appliedDates = {props.appliedDates}/>
                        </Box>

                    </Box>
                </Modal>
    </Grid>
    )
}