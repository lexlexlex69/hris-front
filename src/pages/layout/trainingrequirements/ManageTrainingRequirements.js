import React,{useEffect, useState} from 'react';
import {Grid,Stack,Box,Skeleton,Typography,Paper,IconButton,Modal,Table,TableHead,TableContainer,TableRow,TableBody,TableFooter,TablePagination, Tooltip} from '@mui/material'
import { checkPermission } from '../permissionrequest/permissionRequest';
import {blue,red,green,orange} from '@mui/material/colors'
import { auditLogs } from '../auditlogs/Request';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {toast} from 'react-toastify';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
//icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { deleteTrainingRequirements, getTrainingRequirements } from './ManageTrainingRequirementsRequest';
import DataTableLoader from '../loader/DataTableLoader';
import AddRequirementsModal from './Modal/AddRequirementsModal';
import Swal from 'sweetalert2';
import DashboardLoading from '../loader/DashboardLoading';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
import UpdateRequirementsModal from './Modal/UpdateRequirementsModal';
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
export default function ManageTrainingRequirements(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 345,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    const [isLoading,setIsLoading] = useState(true);
    const [isLoadingData,setIsLoadingData] = useState(true);
    const [data,setData] = useState([])
    const [openAddModal,setOpenAddModal] = useState(false);
    const [openUpdateModal,setOpenUpdateModal] = useState(false);
    const [selectedUpdateData,setSelectedUpdateData] = useState([])
    useEffect(()=>{
        checkPermission(44)
        .then((response)=>{
            if(response.data){
                // var logs = {
                //     action:'ACCESS MANAGE TRAINING REQUIREMENTS',
                //     action_dtl:'ACCESS TRAINING REQUIREMENTS MODULE',
                //     module:'MANAGE TRAINING REQUIREMENTS'
                // }
                // auditLogs(logs)
                getTrainingRequirements()
                .then(res=>{
                    setData(res.data)
                    setIsLoadingData(false)
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
    const handleUpdate = (row) =>{
        console.log(row)
        setSelectedUpdateData(row)
        setOpenUpdateModal(true)
    }
    const handleDelete = (row) =>{
        Swal.fire({
            icon:'warning',
            title: 'Confirm delete requirement?',
            showCancelButton:true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    var data2 = {
                        training_rqmt_id:row.training_rqmt_id,
                        name:row.rqmt_name,
                        desc:row.rqmt_desc,
                    }
                    Swal.fire({
                        icon:'info',
                        title:'Deleting data',
                        html:'Please wait...',
                        allowEscapeKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading()
                    deleteTrainingRequirements(data2)
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
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',padding:'15px'}}>
                            Manage Training Requirements
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Manage Training Requirements'/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Tooltip title= 'Add'><IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick = {()=> setOpenAddModal(true)}><AddIcon/></IconButton></Tooltip>
                    </Grid>
                    <Grid item xs={12} sx={{mt:1}}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Description</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        isLoadingData
                                        ?
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={3}><DataTableLoader/></StyledTableCell>
                                        </TableRow>
                                        :
                                        data.length !==0
                                        ?
                                        data.map((row,key)=>
                                            <TableRow key={key} hover>
                                                <StyledTableCell>{row.rqmt_name}</StyledTableCell>
                                                <StyledTableCell>{row.rqmt_desc}</StyledTableCell>
                                                <StyledTableCell><Tooltip title = 'Update'><IconButton color='success' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:green[800]}}} onClick={()=>handleUpdate(row)}><EditIcon/></IconButton></Tooltip> &nbsp;<Tooltip title = 'Delete'><IconButton color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDelete(row)}><DeleteIcon/></IconButton></Tooltip></StyledTableCell>
                                            </TableRow>
                                        )
                                        :
                                        <TableRow>
                                            <StyledTableCell align='center' colSpan={3}>No Data</StyledTableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                            Adding Training Requirements
                        </Typography>
                        <Box sx={{m:2}}>
                            <AddRequirementsModal close={()=> setOpenAddModal(false)} setData = {setData}/>
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
                            Updating Training Requirements
                        </Typography>
                        <Box sx={{m:2}}>
                            <UpdateRequirementsModal close={()=> setOpenUpdateModal(false)} setData = {setData} data = {selectedUpdateData}/>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            
        }
        </React.Fragment>
    )
}