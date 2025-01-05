import { Grid, Typography,Button, Tooltip, Modal,Box,IconButton } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { getAllPermissions,getAllRoles,deleteRole } from '../Request';
import DataTable from 'react-data-table-component';
import { data } from 'jquery';
import SettingsAccessibilityOutlinedIcon from '@mui/icons-material/SettingsAccessibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import AddNewRoleModal from './AddNewRoleModal';
import UpdateRoleModal from './UpdateRoleModal';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {red,green,blue} from '@mui/material/colors';
import SmallModal from '../../../custommodal/SmallModal';

const addNewRoleModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: '#fff',
    border: '2px solid #fff',
    borderRadius:3,
    boxShadow: 24,
  };
export default function ManageRoleModal(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [userPermissionData,setUserPermissionData] = useState([])
    const [userRoleData,setUserRoleData] = useState([])
    const [addNewRoleModal,setAddNewRoleModal] = useState(false)
    const [updateRoleModal,setUpdateRoleModal] = useState(false)
    const [updateInfo,setUpdateInfo] = useState([])
    useEffect(()=>{
        // Swal.fire({
        //     icon:'info',
        //     title:'Loading Roles',
        //     html:'Please wait...'
        // })
        // Swal.showLoading()
        getAllRoles()
        .then(res=>{
            const result = res.data
            setUserRoleData(result)
            Swal.close()

        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    },[])
    const userRoleColumns = [
        {
            name:'Role Name',
            selector:row=>row.data.role_name
        },
        {
            name:'Description',
            selector:row=>row.data.description
        },
        {
            name:'Permission',
            selector:row=><Box sx={{p:1}}><Tooltip title = {(formatPermission(row.permission))}><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}}><SettingsAccessibilityOutlinedIcon/></IconButton></Tooltip></Box>
        },
        {
            name:'Action',
            selector:row=><Box sx={{p:1}}><Tooltip title='Update Role'><IconButton color='success' className='custom-iconbutton' onClick={()=>updateRoleAction(row)} sx={{'&:hover':{color:'#fff',background:green[800]}}}><EditOutlinedIcon/></IconButton></Tooltip>&nbsp;<Tooltip title='Delete Role'><IconButton color='error' className='custom-iconbutton' onClick={()=>deleteRoleAction(row)} sx={{'&:hover':{color:'#fff',background:red[800]}}}><DeleteIcon/></IconButton></Tooltip></Box>
        }
    ]
    const updateRoleAction = (row)=>{
        console.log(row)
        setUpdateInfo(row)
        setUpdateRoleModal(true)
    }
    const deleteRoleAction = (row)=>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to delete this role?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            if (result.isConfirmed) {
                deleteRole(row.data.role_id)
                .then(res=>{
                    const result = res.data
                    if(result.status === 200){
                        setUserRoleData(result.new_data)
                        Swal.fire({
                            icon:'success',
                            title:result.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:result.message
                        })
                    }
                })
            }
          })
    }
    const formatPermission = (row)=>{
        if(row.length ===0){
            return <Typography>No Permission has been added</Typography>
        }else{
            return(
                <Box sx={{maxHeight:'50vh',overflowY:'scroll'}}>
                <Typography>List of Permission:</Typography>
                <ul>
                    {row.map((data,key) => 
                        <li key={key} style={{'&:hover':{background:'#c4c4c4 !important'}}}><Typography sx={{fontSize:'.98em','&:hover':{background:'#c4c4c4',cursor:'pointer',color:'#000'}}}>{data.menu_name}</Typography></li>
                    )}
                </ul>
                </Box>
            )
        }
        
    }
    const updateRoleData = (newdata)=>{
        setUserRoleData(newdata)
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Tooltip title = 'Add New Role'><Button variant='contained' color='success' className='custom-roundbutton' sx={{float:'right','&:hover':{color:'#fff',background:green[800]}}} onClick={()=>setAddNewRoleModal(true)} startIcon={<AddOutlinedIcon/>}>Add</Button></Tooltip>
            </Grid>
            <Grid item xs={12}>
                <DataTable
                    data = {userRoleData}
                    columns = {userRoleColumns}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 15, 25, 50]}
                    paginationComponentOptions={{
                        rowsPerPageText: 'Records per page:',
                        rangeSeparatorText: 'out of',
                    }}
                    highlightOnHover
                    fixedHeader
                    fixedHeaderScrollHeight="60dvh"
                />
            </Grid>
            <SmallModal open={addNewRoleModal} close={()=> setAddNewRoleModal(false)} title='Adding New Role'>
                <AddNewRoleModal updateRoleData = {updateRoleData} close = {()=> setAddNewRoleModal(false)}/>
            </SmallModal>
            <SmallModal open={updateRoleModal} close={()=> setUpdateRoleModal(false)} title='Updating Roles'>
                <UpdateRoleModal updateRoleData = {updateRoleData} close = {()=> setUpdateRoleModal(false)} data = {updateInfo}/>
            </SmallModal>
            {/* <Modal
                open={addNewRoleModal}
                onClose={()=> setAddNewRoleModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={addNewRoleModalStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setAddNewRoleModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Adding New Role
                    </Typography>
                    <Box sx={{m:4}}>
                        <AddNewRoleModal updateRoleData = {updateRoleData} close = {()=> setAddNewRoleModal(false)}/>
                    </Box>

                </Box>
            </Modal> */}

            {/* <Modal
                open={updateRoleModal}
                onClose={()=> setUpdateRoleModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={addNewRoleModalStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setUpdateRoleModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Adding New Role
                    </Typography>
                    <Box sx={{m:4}}>
                        <UpdateRoleModal updateRoleData = {updateRoleData} close = {()=> setUpdateRoleModal(false)} data = {updateInfo}/>
                    </Box>

                </Box>
            </Modal> */}
        </Grid>
    )
}