import { Container, Grid, Typography,Paper,Box,Button,Modal, Tooltip,IconButton } from "@mui/material";
import React, { useEffect } from "react";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DataTable from "react-data-table-component";
import { getAllTypesOfLeave,deleteTypeOfLeave } from "./Request";

//icon
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import AddLeaveType from "./AddLeaveType";
import UpdateLeaveType from "./UpdateLeaveType";
import Swal from "sweetalert2";
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { auditLogs } from "../../auditlogs/Request";
import {red,green} from '@mui/material/colors';
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import SmallModal from "../../custommodal/SmallModal";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:345,
    marginBottom: 0,
    background: '#fff',
    border: '2px solid #fff',
    borderRadius:3,
    boxShadow: 24,
    // p: 4,
  };
export default function TypeOfLeaveConfig(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(()=>{
        var logs = {
            action:'ACCESS TYPE OF LEAVE CONFIG',
            action_dtl:'ACCESS TYPE OF LEAVE CONFIG MODULE',
            module:'TYPE OF LEAVE CONFIG'
        }
        auditLogs(logs)
        getAllTypesOfLeave()
        .then(response=>{
            setData(response.data)
        }).catch(error=>{
            console.log(error)
        })
    },[])
    const updateData = () => {
        getAllTypesOfLeave()
        .then(response=>{
            setData(response.data)
        }).catch(error=>{
            console.log(error)
        })
    }
    const [addLeaveModal,setAddLeaveModal] = React.useState(false)
    const [updateLeaveModal,setUpdateLeaveModal] = React.useState(false)
    const [data,setData] = React.useState([])
    const [info,setInfo] = React.useState([])
    const columns = [
        {
            name:'Leave Name',
            selector:row=>row.leave_type_name
        },
        {
            name:'Filing Period',
            selector:row=>row.filing_period
        },
        {
            name:'Leave Days',
            selector:row=>row.days
        },
        {
            name:'Is Enabled',
            selector:row=>row.enabled?'YES':'NO'
        },
        {
            name:'Action',
            selector:row=><Box sx={{p:1}}><Tooltip title = 'Update Leave Type'>
                <IconButton color='success' className="custom-iconbutton" onClick = {()=>updateLeaveType(row)} sx={{'&:hover':{color:'#fff',background:green[800]}}}><EditIcon/></IconButton>
                </Tooltip>&nbsp;
                <Tooltip title = 'Delete Leave Type'>
                <IconButton color="error" className="custom-iconbutton" onClick = {()=>deleteLeaveType(row)} sx={{'&:hover':{color:'#fff',background:red[800]}}}><DeleteIcon/></IconButton>
                </Tooltip>
            </Box>
            
        },
    ]
    const tableData = {
        columns,
        data,
      };
    const updateLeaveType = (row)=>{
        setInfo(row)
        setUpdateLeaveModal(true)
        console.log(row)
    }
    const deleteLeaveType = (row) => {
        Swal.fire({
            icon:'warning',
            title: 'Do you want to delete this Type of Leave?',
            showCancelButton:true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
                deleteTypeOfLeave(row.leave_type_id)
                .then(response=>{
                    const data = response.data
                    if(data.status === 'success'){
                        updateData()
                        Swal.fire({
                            icon:'success',
                            title:data.message,
                            timer:1500
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:data.message
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            } 
          })
    }
    return (
        <Box sx={{margin:'0 10px 10px 10px'}}>
            <Grid container>
                <Grid item xs={12}>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}  >
                            Type Of Leave Configuration
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Type Of Leave Configuration'/>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{marginBottom:'10px'}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Tooltip title ='Add Leave Type'><IconButton color= 'success' className="custom-iconbutton" onClick = {()=>setAddLeaveModal(true)}><AddIcon/></IconButton></Tooltip>
                    </Box>
                </Grid>
                <Grid item xs = {12} component={Paper}>
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
                    />
                </DataTableExtensions>
                </Grid>
            </Grid>
            {/* <Modal
                open={addLeaveModal}
                onClose = {()=>setAddLeaveModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx ={style}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=>setAddLeaveModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Adding new type of leave
                    </Typography>
                    <Box sx={{mt:2,p:2}}>
                        <AddLeaveType handleClose = {()=>setAddLeaveModal(false)} updateData = {updateData}/>
                    </Box>
                </Box>
            </Modal> */}
            {/* <Modal
                open={updateLeaveModal}
                onClose = {()=>setUpdateLeaveModal(false)}
            >
                <Box style ={style}>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'20px',color:'#2196F3'}} variant="h6">
                        Update type of leave
                    </Typography>
                    <hr/>
                    <UpdateLeaveType handleClose = {()=>setUpdateLeaveModal(false)} info = {info} updateData = {updateData}/>
                    </Box>
            </Modal> */}
            <SmallModal open = {updateLeaveModal} close = {()=>setUpdateLeaveModal(false)} title= 'Updating type of leave'>
                    <UpdateLeaveType handleClose = {()=>setUpdateLeaveModal(false)} info = {info} updateData = {updateData}/>
            </SmallModal>
            <SmallModal open = {addLeaveModal} close = {()=>setAddLeaveModal(false)} title='Adding new type of leave'>
                <Box sx={{mt:1}}>
                    <AddLeaveType handleClose = {()=>setAddLeaveModal(false)} updateData = {updateData}/>
                </Box>
            </SmallModal>
        </Box>
    )
}