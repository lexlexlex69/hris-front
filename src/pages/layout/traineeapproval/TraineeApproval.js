import React,{useState,useEffect} from 'react';
import {Box,Grid,Typography,Stack,Skeleton,Paper,Table,TableContainer,TableHead,TableRow, TableBody,IconButton,Tooltip,Dialog,Button,TextField,TablePagination,TableFooter, Menu, MenuItem, ListItemIcon, ListItemText} from '@mui/material';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../permissionrequest/permissionRequest';
import {toast} from 'react-toastify'
import { getAllShortlistTrainee, getApprovedTrainee, getRequestedTraineeReplacement, getTraineeApproval, updateApprovedTrainee } from './TraineeApprovalRequest';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green, purple} from '@mui/material/colors'
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
import AttachmentIcon from '@mui/icons-material/Attachment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { viewFileAPI } from '../../../viewfile/ViewFileRequest';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
import { APILoading } from '../apiresponse/APIResponse';
import RequestedReplacement from './DataTable/RequestedReplacement';
import LargeModal from '../custommodal/LargeModal';
import SmallModal from '../custommodal/SmallModal';
import SmallestModal from '../custommodal/SmallestModal';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        padding:8,
        fontSize: 13,
        },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        padding:8
    },
}));
export default function TraineeApproval(){
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
    const [deptHead,setDeptHead] = useState([])
    
    const [anchorEl2, setAnchorEl2] = useState([]);
    const open = Boolean(anchorEl2);
    const handleClick2 = (id,event) => {
        let temp = [...anchorEl2];
        temp[id] = event.currentTarget
        setAnchorEl2(temp);
    };
    const handleClose2 = (id,event) => {
        let temp = [...anchorEl2];
        temp[id] = null
        setAnchorEl2(temp);
        // setAnchorEl([]);
    };
    
    useEffect(()=>{
        checkPermission(38)
        .then((response)=>{
            if(response.data){
                setIsLoading(false)
                getTraineeApproval()
                .then(res=>{
                    console.log(res.data)
                    if(res.data){
                        setData(res.data)
                    }
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
    const [unapprovedReservedTrainee,setUnapprovedReservedTrainee] = useState([])
    const [replaceData,setReplaceData] = useState([])
    const [replacementData,setReplacementData] = useState([])
    const viewAction = (data,id,dept_code) =>{
        setSelectedTraining(data)
        console.log(data)
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
            setApprovedTraineeData(res.data.data)
            setDeptHead(res.data.dept_head)
            setUnapprovedReservedTrainee(res.data.reserved_trainee)

            var r1 = [];
            var r2 = [];
            res.data.requested_info.forEach(el=>{
                var t_r1 = JSON.parse(el.replace_info);
                var t_r2 = JSON.parse(el.replacement_info);
                t_r1.forEach(el2=>{
                    r1.push(el2.training_shortlist_id)
                })
                // t_r2.forEach(el2=>{
                //     r2.push(el2.training_shortlist_id)
                // })
            })
            setReplaceData(r1)
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
            id:data.training_details[0].training_details_id,
            dept_code:data.dept_code
        }
        getAllShortlistTrainee(data2)
        .then(res=>{
            console.log(res.data)
            setUpdateTraineeData(res.data)
            Swal.close()
            setShowUpdateTrainee(true)
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
            icon:'info',
            title:'Saving data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var data2 = {
            dept_code:selectedTraining.dept_code,
            training_details_id:selectedTraining.training_details[0].training_details_id,
            ids:data.preselect,
            reserve:data.reserve,
            memo_file:data.memo_file
        }
        updateApprovedTrainee(data2)
        .then(res=>{
            console.log(res.data)
            Swal.close();
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                handleCloseShowUpdateTrainee()
                setData(res.data.data)
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
        getTraineeApproval()
        .then(res=>{
            Swal.close();
            if(res.data){
                setData(res.data)
            }
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
    const viewFile = (id,name)=>{
        if(id){
            viewFileAPI(id,name)
        }
    }
    const [requestedReplacementData,setRequestedReplacementData] = useState([]);
    const [openRequestedReplacement,setOpenRequestedReplacement] = useState(false);
    const [selectedTrainingDetails,setSelectedTrainingDetails] = useState([]);
    const [deptHeadData,setDeptHeadData] = useState([]);
    const handleCloseRequestedReplacement = () =>{
        setOpenRequestedReplacement(false)
    }
    const viewRequestedReplacement = async (row) => {
        try{
            setSelectedTrainingDetails(row)
            APILoading('info','Loading data','Please wait...')
            var t_data = {
                dept_code:row.dept_code,
                training_details_id:row.training_details[0].training_details_id
            }
            const res = await getRequestedTraineeReplacement(t_data)
            if(res.data.status === 200){
                setRequestedReplacementData(res.data.data)
                setDeptHeadData(res.data.dept_head)
                Swal.close();

                setOpenRequestedReplacement(true)
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
    const [selectedReso,setSelectedReso] = useState([]);
    const [openReso,setOpenReso] = useState(false)
    const handleOpenReso = (row) =>{
        console.log(JSON.parse(row))
        setSelectedReso(JSON.parse(row))
        setOpenReso(true)
    }
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
                                        <StyledTableCell rowSpan={2}>
                                            Alloted Slot
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2}>
                                            Confirmed
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2}>
                                            Available Slot
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2}>
                                            Nomination Deadline
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2} align='center' sx={{minWidth:150}}>
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
                                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
                                            <TableRow key = {data.training_details_id} hover>
                                                <StyledTableCell>
                                                    {data.training_details[0].training_name}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {data.training_details[0].venue}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {moment(data.training_details[0].period_from).format('MMMM DD, YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {moment(data.training_details[0].period_to).format('MMMM DD, YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {data.slot}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {data.alloted_slot}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {
                                                        data.alloted_slot>=data.slot
                                                        ?
                                                        0
                                                        :
                                                        data.slot-data.alloted_slot
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell sx={{color:moment().isBefore(data.training_details[0].nom_approval_deadline)?'black':red[800],fontWeight:'bold'}}>
                                                    {moment(data.training_details[0].nom_approval_deadline).format('MMMM DD,YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    <Tooltip title='More Actions'>
                                                    <IconButton
                                                        id={data.training_details_id}
                                                        aria-controls={Boolean(data.training_details_id)}
                                                        aria-haspopup="true"
                                                        aria-modal = "true"
                                                        aria-expanded={Boolean(data.training_details_id)}
                                                        onClick={(e)=>handleClick2(data.training_details_id,e)}
                                                        variant="contained"
                                                        color="secondary"
                                                        // size="small"
                                                        className="custom-iconbutton"
                                                        // endIcon={<ArrowDropDownIcon/>}
                                                        sx={{'&:hover':{color:'#fff',background:purple[800]}}}
                                                    >
                                                        <MoreVertIcon/>
                                                    </IconButton>
                                                    </Tooltip>
                                                    <Menu
                                                        id={data.training_details_id}
                                                        anchorEl={anchorEl2[data.training_details_id]}
                                                        open={Boolean(anchorEl2[data.training_details_id])}
                                                        onClose={(e)=>handleClose2(data.training_details_id,e)}
                                                        MenuListProps={{
                                                            'aria-labelledby': `basic-button-${data.training_details_id}`,
                                                        }}
                                                        keepMounted
                                                    >
                                                        <Tooltip title='View Approved Trainee'>
                                                        <span>
                                                        <MenuItem size='small' onClick={()=>viewAction(data,data.training_details[0].training_details_id,data.dept_code)} disabled = {data.alloted_slot === 0 ? true:false}>
                                                            <ListItemIcon>
                                                                <PeopleOutlinedIcon color='primary' fontSize="small"/>
                                                            </ListItemIcon>
                                                            <ListItemText>View Approved Trainee</ListItemText>
                                                        </MenuItem>
                                                        </span>
                                                        </Tooltip>

                                                        <Tooltip title='Update Nomination'>
                                                        <span>
                                                        <MenuItem size='small' onClick={()=>updateAction(data)} disabled={moment(data.training_details[0].nom_approval_deadline).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD') || data.training_details[0].approved ? true:false}>
                                                            <ListItemIcon>
                                                                <GroupAddOutlinedIcon color="success" fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText>Update Nomination</ListItemText>
                                                        </MenuItem>
                                                        </span>
                                                        </Tooltip>

                                                        <Tooltip title='View Memo'>
                                                        <span>
                                                        <MenuItem size='small' onClick={()=>viewFile(data.training_details[0].dept_slot_memo_file_id,'Dept Allocation Memo')}>
                                                            <ListItemIcon>
                                                                <AttachmentIcon color='secondary' fontSize='small'/>
                                                            </ListItemIcon>
                                                            <ListItemText>Memo</ListItemText>
                                                        </MenuItem>
                                                        </span>
                                                        </Tooltip>
                                                        {
                                                            JSON.parse(data.resolution).length>0
                                                            ?
                                                            
                                                            <Tooltip title='View Resolution'>
                                                            <MenuItem size='small' onClick={()=>handleOpenReso(data.resolution)}>
                                                                <ListItemIcon>
                                                                    <AttachmentIcon color='secondary' fontSize='small'/>
                                                                </ListItemIcon>
                                                                <ListItemText>Resolution</ListItemText>
                                                            </MenuItem>
                                                            </Tooltip>
                                                            :
                                                            null
                                                        }
                                                        <Tooltip title='View Replacement'>
                                                        <MenuItem size='small' onClick={()=>viewRequestedReplacement(data)}>
                                                            <ListItemIcon>
                                                                <SwapHorizIcon color='info' fontSize='small'/>
                                                            </ListItemIcon>
                                                            <ListItemText>Replacement</ListItemText>
                                                        </MenuItem>
                                                        </Tooltip>
                                                    </Menu>
                                                    {
                                                        // matches
                                                        // ?
                                                        // <Box sx={{display:'flex',gap:1}}>
                                                        // <Tooltip title = 'View Approved Trainee'><IconButton onClick={()=>viewAction(data,data.training_details[0].training_details_id,data.dept_code)} disabled = {data.alloted_slot === 0 ? true:false} className='custom-iconbutton' size='small'><PeopleOutlinedIcon color='primary'/></IconButton></Tooltip>

                                                        // <Tooltip title = 'Update Approved Trainee'><span><IconButton onClick={()=>updateAction(data)} disabled={moment(data.training_details[0].nom_approval_deadline).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD') || data.training_details[0].approved ? true:false} className='custom-iconbutton' size='small'><GroupAddOutlinedIcon color={moment(data.training_details[0].nom_approval_deadline).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD') || data.training_details[0].approved ? 'disabled':'success'}/></IconButton></span></Tooltip>

                                                        // <Tooltip title='View Dept Allocation Memo'><IconButton color='secondary' className='custom-iconbutton' size='small' onClick={()=>viewFile(data.training_details[0].dept_slot_memo_file_id,'Dept Allocation Memo')}><AttachmentIcon/></IconButton></Tooltip>

                                                        // <Tooltip title='View Requeted Replacement'><IconButton color='info' className='custom-iconbutton' size='small' onClick={()=>viewRequestedReplacement(data)}><SwapHorizIcon/></IconButton></Tooltip>
                                                        // </Box>
                                                        // :
                                                        // <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                                                        // <Tooltip title = 'View Approved Trainee'><span><Button size='small'variant='contained' color='primary' className='custom-roundbutton' onClick={()=>viewAction(data,data.training_details[0].training_details_id,data.dept_code)} disabled = {data.alloted_slot === 0 ? true:false} startIcon={<PeopleOutlinedIcon/>} fullWidth>Approved</Button></span></Tooltip>

                                                        // <Tooltip title = 'Update Approved Trainee'><span><Button size='small'variant='contained' className='custom-roundbutton' onClick={()=>updateAction(data)} disabled={moment(data.training_details[0].nom_approval_deadline).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD') || data.training_details[0].approved ? true:false} startIcon={<GroupAddOutlinedIcon/>} fullWidth>Update</Button></span></Tooltip>

                                                        // <Tooltip title='View Dept Allocation Memo'><Button size='small'variant='contained' color='secondary' className='custom-roundbutton' onClick={()=>viewFile(data.training_details[0].dept_slot_memo_file_id,'Dept Allocation Memo')} startIcon={<AttachmentIcon/>}>Memo</Button></Tooltip>
                                                        // {
                                                        //     JSON.parse(data.resolution).length>0
                                                        //     ?
                                                        //     <Tooltip title='Resolution'><Button size='small'variant='contained' color='secondary' className='custom-roundbutton' onClick={()=>handleOpenReso(data.resolution)} startIcon={<AttachmentIcon/>}>Resolution</Button></Tooltip>
                                                        //     :
                                                        //     null
                                                        // }
                                                        

                                                        // <Tooltip title='View Requeted Replacement'><Button size='small' variant='contained' color='info' className='custom-roundbutton' onClick={()=>viewRequestedReplacement(data)} startIcon={<SwapHorizIcon/>}>Replacement</Button></Tooltip>
                                                        // </Box>

                                                    }

                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={9} >
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, 100]}
                                                component="div"
                                                count={data.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        
                        </Paper>
                    </Grid>
                </Grid>
                <SmallestModal open = {openReso} close = {()=>setOpenReso(false)} title='Resolution'>
                    <ul>
                        {selectedReso.map((item)=>{
                            return(
                                <li key={item.FILE_ID}>{item.FILE_NAME} <Tooltip title='View File'><IconButton color='info' onClick={()=>viewFileAPI(item.FILE_ID)}><AttachmentIcon/></IconButton></Tooltip></li>
                            )
                        })}
                    </ul>
                </SmallestModal>

                <LargeModal open={openRequestedReplacement} close={handleCloseRequestedReplacement} title='Requested Trainee Replacement'>
                    <RequestedReplacement data = {requestedReplacementData} selectedTrainingDetails = {selectedTrainingDetails} deptHead={deptHeadData}/>
                </LargeModal>
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
                        onClick={handleCloseShowApprovedTrainee}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 ,fontSize:matches?'.9rem':'auto' }} variant="h6" component="div">
                        List of Approved Trainee
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseShowApprovedTrainee}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Grid container spacing={2}>
                            {
                                selectedTraining.length !==0
                                ?
                                <Grid item xs={12}>
                                    <Paper sx={{p:2}}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md = {3} lg={3}>
                                                <TextField label='Training Name' defaultValue={selectedTraining.training_details[0].training_name} inputProps={{readOnly:true}} fullWidth/>
                                            </Grid>
                                            <Grid item xs={12} md = {3} lg={3}>
                                                <TextField label='Training Venue' defaultValue={selectedTraining.training_details[0].venue} inputProps={{readOnly:true}} fullWidth/>
                                            </Grid>
                                            <Grid item xs={12} md = {4} lg={4}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} md = {6} lg={6}>
                                                        <TextField label='From' defaultValue={moment(selectedTraining.training_details[0].period_from).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                                    </Grid>
                                                    <Grid item xs={12} md = {6} lg={6}>
                                                        <TextField label='To' defaultValue={moment(selectedTraining.training_details[0].period_to).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                                    </Grid> 
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} md = {2} lg={2}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField label='Slot' defaultValue={selectedTraining.slot} inputProps={{readOnly:true}}/>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField label='Available Slot' defaultValue={selectedTraining.alloted_slot>=selectedTraining.slot?0:selectedTraining.slot-selectedTraining.alloted_slot} inputProps={{readOnly:true}}/>
                                                    </Grid> 
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </Paper>
                                </Grid>

                                :
                                ''
                            }
                            {
                                selectedTraining.length !==0
                                ?
                                <Grid item xs={12}>
                                    <Paper>
                                        <ApprovedDatatable
                                            data={approvedTraineeData}
                                            handleUpdateTrainee = {handleUpdateTrainee}
                                            selectedTraining ={selectedTraining}
                                            deptHead={deptHead}
                                            unapprovedReservedTrainee = {unapprovedReservedTrainee}
                                            replaceData = {replaceData}
                                        />
                                        {/* <DataTable
                                            data={approvedTraineeData}
                                            columns={columns}
                                        /> */}
                                    </Paper>
                                </Grid>
                                :
                                ''
                            }
                            
                        </Grid>
                        
                        
                        
                    </Box>

                </Dialog>
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
                        <Typography sx={{ ml: 2, flex: 1,fontSize:matches?'.9rem':'auto' }} variant="h6" component="div">
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
                                            <TextField label='Training Name' defaultValue={selectedTraining.training_details[0].training_name} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs= {12} md={3} lg={3}>
                                            <TextField label='Training Venue' defaultValue={selectedTraining.training_details[0].venue} inputProps={{readOnly:true}} fullWidth/>
                                        </Grid>
                                        <Grid item xs= {12} md={5} lg={5}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <TextField label='From' defaultValue={moment(selectedTraining.training_details[0].period_from).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <TextField label='To' defaultValue={moment(selectedTraining.training_details[0].period_to).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                                </Grid> 
                                            </Grid>
                                        </Grid>
                                        <Grid item xs= {12} md={1} lg={1}>
                                        <TextField label='Slot' defaultValue={selectedTraining.slot} inputProps={{readOnly:true}} fullWidth/>

                                        </Grid>

                                    </Grid>
                                </Paper>
                                :
                                ''
                            }
                            </Grid>
                            <Grid item xs={12}>
                                <UpdateDataTable
                                    data={updateTraineeData}
                                    selectedTraining ={selectedTraining}
                                    selectedUpdateTrainee = {selectedUpdateTrainee}
                                    setSelectedUpdateTrainee = {setSelectedUpdateTrainee}
                                    saveUpdateTrainee = {saveUpdateTrainee}
                                />
                                    
                            </Grid>
                        </Grid>
                        
                        
                        
                    </Box>

                </Dialog>
            </Box>
        }
        </React.Fragment>
    )
}