import React,{useEffect, useState} from 'react';
import {Grid, Typography,Skeleton,Stack,Box,Paper,IconButton,Modal,Table,TableHead,TableContainer,TableRow,TableBody,TableFooter,TablePagination, Tooltip} from '@mui/material';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {blue,red,green,orange} from '@mui/material/colors'
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {toast} from 'react-toastify'
import { deleteTraineeApprover, getApproverData } from './TraineeApproverRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
//icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddTraineeApproverModal from './Modal/AddTraineeApproverModal';
import Swal from 'sweetalert2';
import UpdateTraineeApproverModal from './Modal/UpdateTraineeApproverModal';
import DataTableLoader from '../../loader/DataTableLoader';
import { auditLogs } from '../../auditlogs/Request';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { Evaluator } from './components/Evaluator';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[700],
      color: theme.palette.common.white,
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
export default function TraineeApprover(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? '100%':600,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };

    const [isLoading,setIsLoading] = useState(true)
    const [loadingData,setLoadingData] = useState(true)
    const [data,setData] = useState([])
    const [openAddModal,setOpenAddModal] = useState(false)
    const [openUpdateModal,setOpenUpdateModal] = useState(false)
    const [selectedToUpdateData,setSelectedToUpdateData] = useState([])
    useEffect(()=>{
        checkPermission(43)
        .then((response)=>{
            if(response.data){
                var logs = {
                    action:'ACCESS MANAGE TRAINEE APPROVER',
                    action_dtl:'ACCESS MANAGE TRAINEE APPROVER MODULE',
                    module:'MANAGE TRAINEE APPROVER'
                }
                auditLogs(logs)
                getApproverData()
                .then(res=>{
                    console.log(res.data)
                    setData(res.data)
                    setLoadingData(false)
                }).catch(err=>{
                    console.log(err)
                })
                setIsLoading(false)
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
    },[])
    const handleDelete = (row) =>{
        Swal.fire({
            icon:'warning',
            title: 'Confirm delete approver?',
            showCancelButton:true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    var data2 = {
                        emp_id:row.emp_no,
                        trainee_approver_id:row.trainee_approver_id,
                        dept_code:row.dept_code,
                    }
                    Swal.fire({
                        icon:'info',
                        title:'Deleting data',
                        html:'Please wait...',
                        allowEscapeKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading()
                    deleteTraineeApprover(data2)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 200){
                            setData(res.data.data)
                            Swal.fire({
                                icon:'success',
                                title:res.data.message,
                                timer:1500,
                                showConfirmButton:false
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:res.data.message
                            })
                        }
                    }).catch(err=>{
                        Swal.close();
                        console.log(err)
                    })
            }
        })
        
    }
    const handleUpdate = (row)=>{
        setSelectedToUpdateData(row)
        setOpenUpdateModal(true)
    }
    return(
        <React.Fragment>
        {
                isLoading
                ?
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                <DashboardLoading actionButtons={1}/>
                </Box>
                :
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                    <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',padding:'15px'}}>
                                    Manage Trainee Nomination Approver
                                    </Typography>
                                </Box> */}
                            <ModuleHeaderText title = 'Manage Trainee Approver'/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Tooltip title='Add'><IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>setOpenAddModal(true)}><AddIcon/></IconButton></Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Typography sx={{background:blue[900],color:'#fff',p:1,mb:1}}>Nomination Approver</Typography>

                            <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Office Assign</StyledTableCell>
                                        {/* <StyledTableCell>Added By</StyledTableCell>
                                        <StyledTableCell>Last Updated By</StyledTableCell> */}
                                        <StyledTableCell align='center'>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        loadingData
                                        ?
                                        <TableRow><StyledTableCell align='center' colSpan={5}><DataTableLoader/></StyledTableCell></TableRow>
                                        :
                                        data.length !==0
                                        ?
                                            data.map((row,key)=>
                                                <TableRow key= {key}>
                                                    <StyledTableCell>{row.fname + ' ' + (row.mname?row.mname.charAt(0):'') + '. '+ row.lname}</StyledTableCell>
                                                    <StyledTableCell>{row.short_name}</StyledTableCell>
                                                    {/* <StyledTableCell>{row.added_by}</StyledTableCell>
                                                    <StyledTableCell>{row.updated_by?row.updated_by:'N/A'}</StyledTableCell> */}
                                                    <StyledTableCell><Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleUpdate(row)}><EditIcon/></IconButton></Tooltip> &nbsp; <Tooltip title='Update'><IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDelete(row)}><DeleteIcon/></IconButton></Tooltip></StyledTableCell>
                                                </TableRow>
                                            )
                                     
                                        :
                                        <TableRow><StyledTableCell align='center' colSpan={5}>No Data</StyledTableCell></TableRow>
                                    }
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Evaluator/>
                    </Grid>
                    </Grid>
                    <Modal
                        open={openAddModal}
                        // onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            {/* <CancelOutlinedIcon/> */}
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenAddModal(false)}/>

                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                                Adding Trainee Nomination Approver
                            </Typography>
                            <Box sx={{mt:2,pt:0,pl:matches?2:4,pr:matches?2:4,pb:2,maxHeight:'70vh',overflowY:'scroll'}}>
                                <AddTraineeApproverModal close={()=> setOpenAddModal(false)} setData = {setData} data={data}/>
                            </Box>
                        </Box>
                    </Modal>
                    <Modal
                        open={openUpdateModal}
                        // onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            {/* <CancelOutlinedIcon/> */}
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenUpdateModal(false)}/>

                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                                Updating Trainee Nomination Approver
                            </Typography>
                            <Box sx={{mt:2,pt:0,pl:matches?2:4,pr:matches?2:4,pb:2,maxHeight:'70vh',overflowY:'scroll'}}>
                                <UpdateTraineeApproverModal close={()=> setOpenUpdateModal(false)} setData = {setData} data = {selectedToUpdateData}/>
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            }
        
        </React.Fragment>
    )
}