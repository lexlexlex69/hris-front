import React,{useState,useEffect} from 'react';
import {Box,Grid,Typography,Stack,Skeleton,Paper,Table,TableContainer,TableHead,TableRow, TableBody,IconButton,Tooltip,Dialog,Button,TextField,TablePagination,Modal} from '@mui/material';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../permissionrequest/permissionRequest';
import {toast} from 'react-toastify'
import { getAllApprovedTrainee, getAllRequestedReplacement, getAllShortlistTraineeHRDC, getApprovedTrainee, getTraineeApprovalHRDC, officialApprovedTraineeHRDC, updateApprovedTraineeHRDC, updateResolution } from './TraineeApprovalHRDCRequest';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green,orange, grey} from '@mui/material/colors'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Slide from '@mui/material/Slide';
import Swal from 'sweetalert2';
import CustomDataTable from './DataTable/CustomDataTable';

//Icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PeopleIcon from '@mui/icons-material/People';
import UpdateDataTable from './DataTable/UpdateDataTable';
import ApprovedDatatable from './DataTable/ApprovedDataTable';
import ReplayIcon from '@mui/icons-material/Replay';
import DashboardLoading from '../loader/DashboardLoading';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import AttachmentIcon from '@mui/icons-material/Attachment';

import ApprovedModal from './Modal/ApprovedModal';
import ManualApprovedTraineeDataTable from './DataTable/ManualApprovedTraineeDataTable';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
import { APILoading } from '../apiresponse/APIResponse';
import LargeModal from '../custommodal/LargeModal';
import AllRequestedReplacement from './Modal/AllRequestedReplacement';
import FullModal from '../custommodal/FullModal';
import MediumModal from '../custommodal/MediumModal';
import AddRemoveTrainee from './Modal/AddRemoveTrainee';
import SmallModal from '../custommodal/SmallModal';
import { AttachFile } from '@mui/icons-material';
import { viewFileAPI } from '../../../viewfile/ViewFileRequest';
const Input = styled('input')({
    display: 'none',
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      padding:10,
      fontSize: 13,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }));
export default function TraineeApprovalHRDC(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? '100%':350,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };

    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    const [approvedTraineeData,setApprovedTraineeData] = useState([])
    const [updateTraineeData,setUpdateTraineeData] = useState([])
    const [showApprovedTrainee,setShowApprovedTrainee] = useState(false)
    const [showUpdateTrainee,setShowUpdateTrainee] = useState(false)
    const [selectedTraining,setSelectedTraining] = useState([])
    const [selectedUpdateTrainee,setSelectedUpdateTrainee] = useState([])
    const [openApprovedModal,setOpenApprovedModal] = useState(false)
    const [openManualApprovedModal,setOpenManualApprovedModal] = useState(false)
    const [deptInfo,setDeptInfo] = useState([])
    const [selectedShortlistDetailsData,setSelectedShortlistDetailsData] = useState([])
    useEffect(()=>{
        checkPermission(45)
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
        console.log(data)
        setSelectedTraining(data)
        Swal.fire({
            icon:'info',
            title:'Loading data',
            html:'Please wait...',
        })
        Swal.showLoading()
        var data2 = {
            id:id
        }
        getAllApprovedTrainee(data2)
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
            if(res.data.length === 0){
                Swal.fire({
                    icon:'error',
                    title:'Notice !',
                    html:'As of the moment, none of the trainees were approved by the department head/incharge. Please try again later.'
                })
            }else{
                setUpdateTraineeData(res.data.data)
                setDeptInfo(res.data.dept_info)
                Swal.close()
                setShowUpdateTrainee(true)
            }
            
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const manualAddAction = (data) =>{
        setSelectedTraining(data)
        setOpenManualApprovedModal(true)
    }
    const approvedAction = (data) => {
        setSelectedTraining(data)
        console.log(data)
        setOpenApprovedModal(true)
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
                added:data.added,
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
    const [openAllRequestedReplacementModal,setOpenAllRequestedReplacementModal] = useState(false)
    const [allRequestedReplacementData,setAllRequestedReplacementData] = useState([])
    const handleCloseAllRequestedReplacementModal = () =>{
        setOpenAllRequestedReplacementModal(false)
    }
    const viewRequestedReplacement = async (id) =>{
        try{
            APILoading('info','Loading data','Please wait...')
            var t_data = {
                id:id
            }
            const res = await getAllRequestedReplacement(t_data)
            if(res.data.status === 200){
                setAllRequestedReplacementData(res.data.data)
                setOpenAllRequestedReplacementModal(true)
                Swal.close()
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
    const [openAddRemoveModal,setOpenAddRemoveModal] = useState(false)
    const handleCloseAddRemoveModal = () =>{
        setOpenAddRemoveModal(false)
    }
    const handleAddRemoveTrainee = (row) => {
        setSelectedShortlistDetailsData(row)
        setOpenAddRemoveModal(true)
    }
    const closeAfterAddRemoved = () => {
        handleCloseAddRemoveModal()
    }
    const [resolutionData,setResolutionData] = useState([])
    const [openUploadedResoModal,setOpenUploadedResoModal] = useState(false)
    const handleCloseResolutionModal = () => {
        setOpenUploadedResoModal(false)
        setFile('')
    }
    const handleViewResolution = (data) =>{
        setResolutionData(data)
        setOpenUploadedResoModal(true)
    }
    const [file, setFile] = useState('')
    const handleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                file = fileReader.result;
                setFile(file)
                // setsingleFile(fileReader.result)
            }
            setResoName(file.split('.').slice(0, -1).join('.'))

        }else{
            file = '';
            setFile(file)

            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF/Image file.'
            })
        }
    }
    const handleSaveUpdateResolution = async () =>{
        try{
            if(file){
                APILoading('info','Saving update','Please wait')
                var t_data = {
                    file:file,
                    id:resolutionData.training_details_id,
                    reso_name:resoName
                }
                const res = await updateResolution(t_data)
                if(res.data.status === 200){
                    setResolutionData(res.data.data)
                    setFile('')
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
                console.log(res)
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Please upload file'
                })
            }
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
        
    }
    const [resoName,setResoName] = useState('')
    const [searchVal,setSearchVal] = useState('');
    const filterList = data.filter(el=>el.training_name.toUpperCase().includes(searchVal.toUpperCase()))
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
                    <Grid item xs={12} className='flex-row-flex-end' sx={{display:'flex',justifyContent:'space-between',mb:1}}>
                        <TextField label='Search' value={searchVal} onChange ={(val)=>setSearchVal(val.target.value)} size='small'/>
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
                                        data.length === 0
                                        ?
                                        <TableRow>
                                            <TableCell align='center' colSpan={9}> No Data</TableCell>
                                        </TableRow>
                                        :
                                        filterList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
                                            <TableRow key = {key} hover>
                                                <StyledTableCell>
                                                    {data.training_name}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {data.venue}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {moment(data.period_from).format('MMMM DD,YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {moment(data.period_to).format('MMMM DD,YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                {
                                                    data.approved
                                                    ?
                                                    <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                    <Tooltip title='View Approved List'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>viewAction(data,data.training_details_id)}><PeopleIcon/></IconButton></Tooltip>

                                                    <Tooltip title='View Requested Replacement'><IconButton color='info' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[600]}}} onClick={()=>viewRequestedReplacement(data.training_details_id)}><SwapHorizIcon/></IconButton></Tooltip>

                                                    <Tooltip title='Add/Remove Trainee'><IconButton className='custom-iconbutton' sx={{color:orange[800],'&:hover':{color:'#fff',background:orange[800]}}} onClick={()=>handleAddRemoveTrainee(data)}><ManageAccountsIcon/></IconButton></Tooltip>

                                                    <Tooltip title='View uploaded Resolution'><IconButton className='custom-iconbutton' sx={{color:green[900],'&:hover':{color:'#fff',background:green[900]}}} onClick={()=>handleViewResolution(data)}><FileOpenIcon/></IconButton></Tooltip>
                                                    </Box>

                                                    :
                                                    <React.Fragment>
                                                    <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                    {/* <Tooltip title='Update List'><IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>updateAction(data)}><GroupAddOutlinedIcon/></IconButton></Tooltip>
                                                    &nbsp; */}
                                                    <Tooltip title='Manual Approved Trainee'><IconButton className='custom-iconbutton' sx={{color:orange[900],'&:hover':{color:'#fff',background:orange[900]}}} onClick={()=>manualAddAction(data)}><PersonAddIcon/></IconButton></Tooltip>

                                                    <Tooltip title='Officially approved trainees'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>approvedAction(data)}><HowToRegIcon/></IconButton></Tooltip>

                                                    <Tooltip title='View Requested Replacement'><IconButton color='info' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[600]}}} onClick={()=>viewRequestedReplacement(data.training_details_id)}><SwapHorizIcon/></IconButton></Tooltip>
                                                    
                                                    </Box>
                                                    </React.Fragment>
                                                }
                                                    
                                                </StyledTableCell>
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
                <SmallModal open = {openUploadedResoModal} close = {handleCloseResolutionModal} title='Uploaded Resolution'>
                    <Box sx={{p:1}}>
                        <Box sx={{display:'flex',flexDirection:'row'}}>
                            <Tooltip title='View file'><Button variant='contained' onClick={()=>viewFileAPI(resolutionData.file_id)} fullWidth startIcon={<AttachFile/>}>View File</Button></Tooltip>

                            {/* <Tooltip title='Update file'><Button variant='outlined' onClick={()=>viewFileAPI(resolutionData.file_id)}><EditIcon/></Button></Tooltip> */}

                            <label htmlFor="contained-button-file">
                                <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={handleFile} />
                                <Tooltip title='Update File'><Button variant="outlined" component="span" sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' } }}>
                                    <EditIcon />
                                </Button></Tooltip>
                            </label>
                        </Box>
                        {
                            file
                            ?
                            <>
                                <TextField label='File Name' value = {resoName} onChange={(val)=>setResoName(val.target.value)} sx={{mt:1}} fullWidth/>

                                <Tooltip title='Save update'><Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                                    <Button  variant='contained' color='success' className='custom-roundbutton' size='small' onClick={handleSaveUpdateResolution}>Save</Button>
                                </Box>
                                </Tooltip>
                            </>
                            :
                            null
                        }
                        <Box sx={{mt:1}}>
                            <Paper sx={{p:1}}>
                                <Typography><HistoryIcon color='info'/> Update history</Typography>
                                <Box sx={{maxHeight:'55vh',overflowY:'scroll'}}>
                                {
                                    // JSON.stringify(resolutionData)
                                    resolutionData.hasOwnProperty('update_trail')
                                    ?
                                    JSON.parse(resolutionData.update_trail).length>0
                                    ?
                                        JSON.parse(resolutionData.update_trail).map((item,key)=>
                                            <Box key={key} sx={{padding:'10px',background:grey[200],mb:1,borderRadius:'5px'}}>
                                                <Typography>Date: {moment(item.DATETIME).format('MMMM DD, YYYY HH:mm a')}</Typography>
                                                <Box>
                                                    <Typography>File Name: {item.FILE_NAME}</Typography>
                                                    <Typography>File: <Tooltip title='View File'><IconButton onClick={()=>viewFileAPI(item.FILE_ID)}><AttachmentIcon/></IconButton></Tooltip></Typography>
                                                    <Typography>Action: {item.ACTION}</Typography>
                                                    <Typography>Action By: {item.ACTION_BY}</Typography>
                                                </Box>
                                            </Box>                                        
                                        )
                                    :
                                    <small>No History</small>
                                    :
                                    <small>No History</small>

                                }
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </SmallModal>
                <FullModal open={openAllRequestedReplacementModal} close = {handleCloseAllRequestedReplacementModal} title='List of all requested replacement'>
                    <AllRequestedReplacement data = {allRequestedReplacementData}/>
                </FullModal>
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
                                        <Grid item xs={12} md={3} lg={2}>
                                            <TextField label='Participants' defaultValue={selectedTraining.participants} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={3} lg={2}>
                                            <TextField label='From' defaultValue={moment(selectedTraining.period_from).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={3} lg={2}>
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
                <Dialog
                    fullScreen
                    open={openManualApprovedModal}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={()=>setOpenManualApprovedModal(false)}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Manual Trainee Nomination Approval
                        </Typography>
                        <Button autoFocus color="inherit" onClick={()=>setOpenManualApprovedModal(false)}>
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
                                        <Grid item xs={12} md={3} lg={2}>
                                            <TextField label='Participants' defaultValue={selectedTraining.participants} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={3} lg={2}>
                                            <TextField label='From' defaultValue={moment(selectedTraining.period_from).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={3} lg={2}>
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
                                    <ManualApprovedTraineeDataTable
                                        close={()=>setOpenManualApprovedModal(false)}
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
                <Dialog
                    fullScreen
                    open={showApprovedTrainee}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={()=>setShowApprovedTrainee(false)}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Approved Trainees
                        </Typography>
                        <Button autoFocus color="inherit" onClick={()=>setShowApprovedTrainee(false)}>
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
                                        <Grid item xs={12} md={2} lg={2}>
                                            <TextField label='Participants' defaultValue={selectedTraining.participants} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={2}>
                                            <TextField label='From' defaultValue={moment(selectedTraining.period_from).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={2}>
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
                                    <ApprovedDatatable
                                        data={approvedTraineeData}
                                        selectedTraining ={selectedTraining}
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
                
                <Modal
                    open={openApprovedModal}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        {/* <CancelOutlinedIcon/> */}
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenApprovedModal(false)}/>

                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Approving trainees
                        </Typography>
                        <Box sx={{m:1}}>
                            {/* <AddTraineeApproverModal close={()=> setOpenApprovedModal(false)} setData = {setData}/> */}
                            <ApprovedModal
                                close={()=> setOpenApprovedModal(false)}
                                updateTraineeData={updateTraineeData}
                                selectedTraining ={selectedTraining}
                                selectedUpdateTrainee = {selectedUpdateTrainee}
                                setSelectedUpdateTrainee = {setSelectedUpdateTrainee}
                                saveUpdateTrainee = {saveUpdateTrainee}
                                handleReload = {handleReload}/>
                                
                        </Box>
                    </Box>
                </Modal>
                <MediumModal open = {openAddRemoveModal} close = {handleCloseAddRemoveModal} title='Add/Remove Trainee'>
                    <AddRemoveTrainee data = {selectedShortlistDetailsData} close = {closeAfterAddRemoved}/>
                </MediumModal>
            </Box>
        }
        </React.Fragment>
    )
}