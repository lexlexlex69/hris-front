import React,{useState,useEffect} from 'react';
import {Box,Grid,Typography,Stack,Skeleton,Paper,Table,TableContainer,TableHead,TableRow, TableBody,IconButton,Tooltip,Dialog,Button,TextField,TablePagination} from '@mui/material';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../permissionrequest/permissionRequest';
import {toast} from 'react-toastify'
import { getAllShortlistTraineeHRDC, getApprovedTrainee, getTraineeApprovalHRDC, officialApprovedTraineeHRDC, updateApprovedTraineeHRDC } from './TraineeApprovalCMORequest';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Swal from 'sweetalert2';
import CustomDataTable from './DataTable/CustomDataTable';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import UpdateDataTable from './DataTable/UpdateDataTable';
import ApprovedDatatable from './DataTable/ApprovedDataTable';
import ReplayIcon from '@mui/icons-material/Replay';
import DashboardLoading from '../loader/DashboardLoading';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
export default function TraineeApprovalCMO(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    const [approvedTraineeData,setApprovedTraineeData] = useState([])
    const [updateTraineeData,setUpdateTraineeData] = useState([])
    const [showApprovedTrainee,setShowApprovedTrainee] = useState(false)
    const [showUpdateTrainee,setShowUpdateTrainee] = useState(false)
    const [selectedTraining,setSelectedTraining] = useState([])
    const [selectedUpdateTrainee,setSelectedUpdateTrainee] = useState([])
    useEffect(()=>{
        checkPermission(38)
        .then((response)=>{
            if(response.data){
                setIsLoading(false)
                getTraineeApprovalHRDC()
                .then(res=>{
                    console.log(res.data)
                    setData(res.data)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])
    const viewAction = (data,id,dept_code) =>{
        setSelectedTraining(data)
        Swal.fire({
            icon:'info',
            title:'Loading data',
            html:'Please wait...',
        })
        Swal.showLoading()
        var data2 = {
            id:id,
            dept_code:dept_code
        }
        getApprovedTrainee(data2)
        .then(res=>{
            console.log(res.data)
            setApprovedTraineeData(res.data)
            Swal.close()
            setShowApprovedTrainee(true)
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const updateAction = (data) =>{
        setSelectedTraining(data)
        Swal.fire({
            icon:'info',
            title:'Loading data',
            html:'Please wait...',
        })
        Swal.showLoading()
        var data2 = {
            id:data.training_details_id
        }
        getAllShortlistTraineeHRDC(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.data.length === 0){
                Swal.fire({
                    icon:'error',
                    title:'Notice !',
                    html:'As of the moment, none of the trainees were approved by the department head/incharge. Please try again later.'
                })
            }else{
                setUpdateTraineeData(res.data.data)
                Swal.close()
                setShowUpdateTrainee(true)
            }
            
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const approvedAction = (data) => {
        Swal.fire({
            icon:'info',
            title:'Approving trainees',
            html:'Please wait...',
            showConfirmButton:false,
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading()
        var data2 = {
            training_details_id:data.training_details_id,
            training_app:data.training_app,
            is_cmo:true
        }
        // console.log(data2)
        officialApprovedTraineeHRDC(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
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
            Swal.close()
            console.log(err)
        })
    }
    const handleCloseShowApprovedTrainee = ()=>{
        setShowApprovedTrainee(false)
    }
    const handleCloseShowUpdateTrainee = ()=>{
        setShowUpdateTrainee(false)
    }
    const handleChange = ({selectedRows})=>{
        setSelectedUpdateTrainee(selectedRows.map(row => row.training_shortlist_id))
		// setSelectedUpdateTrainee(selectedRows.training_shortlist_id);
    }
    const saveUpdateTrainee = (data)=>{
        Swal.fire({
            icon:'warning',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Saving data',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading()
            var data2 = {
                training_details_id:selectedTraining.training_details_id,
                removed:data.removed,
                added:data.added
            }
            updateApprovedTraineeHRDC(data2)
            .then(res=>{
                // console.log(res.data)
                // Swal.close();
                if(res.data.status === 200){
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                    handleCloseShowUpdateTrainee()
                    // setData(res.data.data)
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close()
                console.log(err)
            })
        }
        })
        
    }
    const handleUpdateTrainee = () =>{
        handleCloseShowApprovedTrainee()
        updateAction(selectedTraining)
    }
    const handleReload = () =>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        getTraineeApprovalHRDC()
        .then(res=>{
            Swal.close();
            setData(res.data)
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return(
        <React.Fragment>
        {
            isLoading
            ?
            <Box sx={{margin:'0 10px 10px 10px'}}>
            <DashboardLoading actionButtons={1}/>
            </Box>

            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Trainee Nomination Approval (CMO)
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Trainee Nomination Approval (CMO)'/>
                    </Grid>
                    <Grid item xs={12} className='flex-row-flex-end' sx={{mb:1}}>
                        <Tooltip title = 'Reload data'><IconButton className='custom-iconbutton' color='primary' onClick={handleReload}><ReplayIcon/></IconButton></Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell rowSpan={2}>
                                            Training Name
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2}>
                                            Training Venue
                                        </StyledTableCell>
                                        <StyledTableCell colSpan={2} align='center'>
                                            Training Period
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2} align='center'>
                                            Action
                                        </StyledTableCell>

                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell align='center'>
                                            From
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            To
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((data,key)=>
                                            <TableRow key = {key} hover>
                                                <TableCell>
                                                    {data.training_name}
                                                </TableCell>
                                                <TableCell>
                                                    {data.venue}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {moment(data.period_from).format('MMMM DD,YYYY')}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    {moment(data.period_to).format('MMMM DD,YYYY')}
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Tooltip title='Update List'><IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>updateAction(data)}><GroupAddOutlinedIcon/></IconButton></Tooltip>
                                                    &nbsp;
                                                    <Tooltip title='Officially approved trainees'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>approvedAction(data)}><HowToRegIcon/></IconButton></Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog
                    fullScreen
                    open={showUpdateTrainee}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseShowUpdateTrainee}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Update Trainee Nomination Approval
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseShowUpdateTrainee}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                            {
                                selectedTraining.length !==0
                                ?
                                <Paper sx={{p:2}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs= {12} md={3} lg={3}>
                                            <TextField label='Training Name' defaultValue={selectedTraining.training_name} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs= {12} md={3} lg={3}>
                                            <TextField label='Training Venue' defaultValue={selectedTraining.venue} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={3} lg={3}>
                                            <TextField label='From' defaultValue={moment(selectedTraining.period_from).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={3} lg={3}>
                                            <TextField label='To' defaultValue={moment(selectedTraining.period_to).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid> 

                                    </Grid>
                                </Paper>
                                :
                                ''
                            }
                            </Grid>
                            <Grid item xs={12}>
                                <Box>
                                    <UpdateDataTable
                                        data={updateTraineeData}
                                        selectedTraining ={selectedTraining}
                                        selectedUpdateTrainee = {selectedUpdateTrainee}
                                        setSelectedUpdateTrainee = {setSelectedUpdateTrainee}
                                        saveUpdateTrainee = {saveUpdateTrainee}
                                    />
                                    {/* <DataTable
                                        data={approvedTraineeData}
                                        columns={columns}
                                    /> */}
                                </Box>
                            </Grid>
                        </Grid>
                        
                        
                        
                    </Box>

                </Dialog>
            </Box>
        }
        </React.Fragment>
    )
}