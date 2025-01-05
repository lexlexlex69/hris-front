import React,{useEffect, useState} from 'react';
import {Box,Grid,Typography,Paper,Stack,Skeleton,Button,TextField,Modal,IconButton,Tooltip} from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllLeaveInCharge,deleteLeaveInCharge, getEmpStatus, getAllOffices, getUniqueLeaveIncharge } from './LeaveInchargeRequest';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {red,blue,green} from '@mui/material/colors'
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AddDialog from './Dialog/AddDialog';

import UpdateDialog from './Dialog/UpdateDialogIncharge';
import { auditLogs } from '../../auditlogs/Request';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import HRApprovalAssignTable from './Table/HRApprovalAssignTable';
import AddHRApproval from './Dialog/AddHRApproval';
import { APIError, formatExtName, formatMiddlename } from '../../customstring/CustomString';
import { Settings } from '@mui/icons-material';
import { APILoading } from '../../apiresponse/APIResponse';
import MediumModal from '../../custommodal/MediumModal';
import { InchargeSignatory } from './components/InchargeSignatory';
import LargeModal from '../../custommodal/LargeModal';
import UpdateDialogIncharge from './Dialog/UpdateDialogIncharge';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
export default function LeaveInchargeConfig(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true);
    const [data,setData] = useState([])
    const [hrApprovlAssignData,setHrApprovlAssignData] = useState([])
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openAddHRApprovalDialog,setOpenAddHRApprovalDialog] = useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [empstatusData,setEmpstatusData] = useState([])
    const [officesData,setOfficesData] = useState([])
    const [selectedUpdateData,setSelectedUpdateData] = useState([])

    
    useEffect(()=>{
        setIsLoading(false)
        var logs = {
            action:'ACCESS LEAVE INCHARGE CONFIG',
            action_dtl:'ACCESS LEAVE INCHARGE CONFIG MODULE',
            module:'LEAVE INCHARGE CONFIG'
        }
        auditLogs(logs)
        getAllLeaveInCharge()
        .then(res=>{
            console.log(res.data)
            setData(res.data.leave_incharge)
            setHrApprovlAssignData(res.data.hr_approval_assign)
        }).catch(err=>{
            console.log(err)
        })
        getEmpStatus()
        .then(res=>{
            setEmpstatusData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        getAllOffices()
        .then(res=>{
            console.log(res.data)
            setOfficesData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[]) 
    const columns = [
        {
            name:'Name',
            selector:row=>`${row.lname}, ${row.fname} ${formatExtName(row.extname)} ${formatMiddlename(row.mname)}`,
            style:{
                textTransform:'uppercase'
            }
        },
        {
            name:'Assign Emp. Status',
            selector:row=>row.description
        },
        {
            name:'Office',
            selector:row=>row.office_code
        },
        {
            name:'Action',
            selector:row=><Box sx={{display:'flex',gap:1}}>
                
                <Button color='info' className='custom-roundbutton' onClick = {()=>updateAction(row)} variant='contained' size='small' startIcon={<EditIcon/>}>
                    Update
                </Button>
                <Button color='error' className='custom-roundbutton' onClick = {()=>deleteAction(row)} size='small' startIcon={<DeleteIcon/>} variant='contained'>
                    Delete
                </Button>
            </Box>
        },
    ]
    const tableData = {
        columns,
        data
    }
    const deleteAction = (row)=>{
        Swal.fire({
            icon:'warning',
            title: 'Confirm delete ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Deleting data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2= {
                    id:row.leave_verification_incharge_id
                }
                deleteLeaveInCharge(data2)
                .then(res=>{
                    // console.log(res.data)
                    // Swal.close();
                    if(res.data.status === 200){
                        setData(res.data.data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            showConfirmButton:false,
                            timer:1500
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
          })
    }
    const addAction = () =>{
        setOpenAddDialog(true)
    }
    const updateAction = (row)=>{
        setOpenUpdateDialog(true)
        setSelectedUpdateData(row)
        console.log(row)
    }
    const updateData = (data2) =>{
        setData(data2)
    }
    const [openSig,setOpenSig] = useState(false)
    const [sigData,setSigData] = useState([])
    const handleSetSignatory = async () => {
        try{
            APILoading('info','Loading data','Please wait...')
            const res = await getUniqueLeaveIncharge();
            console.log(res.data.data)
            setSigData(res.data.data)
            Swal.close();
            setOpenSig(true)
        }catch(err){
            APIError(err)
        }
        
    }
    return(
        <>
        {
            isLoading
            ?
            <Stack sx={{margin:'20px'}}>
                <Skeleton variant="rounded" width='100%' height={60}/>
            </Stack>
            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container spacing={1}>
                    {/* <Grid item xs={12}>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}  >
                                Leave Incharge Configuration
                                </Typography>
                            </Box> 
                            <ModuleHeaderText title='Leave Incharge Configuration'/>
                        </Grid>
                    </Grid> */}

                    <Grid item xs={12}>
                        <Box sx={{display:'flex',justifyContent:'space-between',background:blue[900],padding:'5px'}}>
                        <Typography sx={{p:1,color:'#fff'}}>Leave Incharge</Typography>
                            <Box sx={{display:'flex',gap:1}}>
                                <Tooltip title='Add Leave Incharge'><Button variant='contained' sx={{borderRadius:'20px'}} color='success' onClick = {addAction} startIcon={<AddOutlinedIcon/>}>Add</Button></Tooltip>
                                <Tooltip title='Leave In Charge Signatory'>
                                <Button color ='secondary' sx={{borderRadius:'20px'}} startIcon={<Settings/>} variant='contained' onClick={handleSetSignatory}> Signatory
                                </Button>
                                </Tooltip>
                            </Box>
                        </Box>
                        <DataTableExtensions
                            {...tableData}
                            export={false}
                            print={false}
                        >
                        <DataTable
                            data = {data}
                            columns = {columns}
                            highlightOnHover
                            pagination
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                        />
                        </DataTableExtensions>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{display:'flex',justifyContent:'space-between',background:blue[900],padding:'5px'}}>
                        <Typography sx={{p:1,color:'#fff'}}>HR Approval Assigned</Typography>
                        <Tooltip title='Add HR Approval Assigned'><Button variant='contained' sx={{borderRadius:'20px'}} onClick = {()=>setOpenAddHRApprovalDialog(true)} color='success' startIcon={<AddOutlinedIcon/>}>Add</Button></Tooltip>
                        </Box>
                        <HRApprovalAssignTable data = {hrApprovlAssignData} setHrApprovlAssignData = {setHrApprovlAssignData} empstatusData = {empstatusData} officesData = {officesData}/>
                    </Grid>
                    
                </Grid>
                <Dialog
                    fullScreen
                    sx={{width:matches?'100%':'50vw',left:'auto'}}
                    open={openAddDialog}
                    // onClose={()=>setOpenAddDialog(false)}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        {/* <IconButton
                        edge="start"
                        color="inherit"
                        onClick={()=>setOpenAddDialog(false)}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton> */}
                        <Typography sx={{flex: 1 }} variant="h6" component="div">
                        Adding Leave In Charge
                        </Typography>
                        <Button autoFocus color="inherit" onClick={()=>setOpenAddDialog(false)}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <AddDialog empstatusData = {empstatusData} officesData = {officesData} close = {()=>setOpenAddDialog(false)} setData = {setData}/>
                </Dialog>

                <Dialog
                    fullScreen
                    sx={{width:matches?'100%':'50vw',left:'auto'}}
                    open={openAddHRApprovalDialog}
                    // onClose={()=>setOpenAddDialog(false)}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        {/* <IconButton
                        edge="start"
                        color="inherit"
                        onClick={()=>setOpenAddHRApprovalDialog(false)}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton> */}
                        <Typography sx={{flex: 1 }} variant="h6" component="div">
                        Adding HR Approval Assigned
                        </Typography>
                        <Button autoFocus color="inherit" onClick={()=>setOpenAddHRApprovalDialog(false)}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <AddHRApproval empstatusData = {empstatusData} officesData = {officesData} close = {()=>setOpenAddHRApprovalDialog(false)} setHrApprovlAssignData = {setHrApprovlAssignData}/>
                </Dialog>
                <Dialog
                    fullScreen
                    sx={{width:matches?'100%':'50vw',left:'auto'}}
                    open={openUpdateDialog}
                    // onClose={()=>setOpenAddDialog(false)}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        {/* <IconButton
                        edge="start"
                        color="inherit"
                        onClick={()=>setOpenUpdateDialog(false)}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton> */}
                        <Typography sx={{flex: 1 }} variant="h6" component="div">
                        Updating Data
                        </Typography>
                        <Button autoFocus color="inherit" onClick={()=>setOpenUpdateDialog(false)}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <UpdateDialogIncharge data = {selectedUpdateData} empstatusData = {empstatusData} officesData = {officesData} close = {()=>setOpenUpdateDialog(false)} setData = {setData} />
                </Dialog>
            </Box>
        }
        <LargeModal open = {openSig} close = {()=>setOpenSig(false)} title='Leave In Charge Signatory'>
            <InchargeSignatory data = {sigData} setData = {setSigData}/>
        </LargeModal>
        </>
        
    )
}