import { Box, Button, Grid, Typography,Modal,Tooltip,IconButton } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { getAllPermissions } from '../Request';
import DataTable from 'react-data-table-component'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import UpdatePermissionModal from './UpdatePermissionModal';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {green,red} from '@mui/material/colors';

const updatePermissionModalStyle = {
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
export default function ManagePermissionModal(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [updateInfo,setUpdateInfo] = useState([])
    const [updatePermissionModal,setUpdatePermissionModal] = useState(false)
    useEffect(()=>{
        getAllPermissions()
        .then(res=>{
            const result = res.data
            setData(result)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const columns = [
        {
            name:'Permission Name',
            selector:row=>row.menu_name
        },
        {
            name:'Available For',
            selector:row=>row.emp_status
        },
        {
            name:'Location',
            selector:row=>row.location
        },
        {
            name:'Path',
            selector:row=>row.uri
        },
        {
            name:'Action',
            selector:row=><Box sx={{p:1}}><Tooltip title = 'Update Permission Menu'><IconButton color = 'success' className='custom-iconbutton' onClick={()=>updatePermissionAction(row)} sx={{'&:hover': { bgcolor: green[800], color: '#fff' }}}><EditOutlinedIcon/></IconButton></Tooltip>&nbsp;<Tooltip title = 'Delete Permission Menu'><IconButton onClick={()=>deletePermissionAction(row)} color='error' className='custom-iconbutton' sx={{'&:hover': { bgcolor: red[800], color: '#fff' }}}><DeleteIcon/></IconButton></Tooltip></Box>
        }
    ]
    const updatePermissionAction = (row)=>{
        setUpdateInfo(row)
        setUpdatePermissionModal(true)
    }
    const deletePermissionAction = (row)=>{
        
    }
    const onUpdateData = (newdata)=>{
        setData(newdata)
    }
    return(
        <Grid container spacing={2}>
            {/* <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Tooltip title='Add Permission Menu'><IconButton color='success' className='custom-iconbutton'><AddOutlinedIcon/></IconButton></Tooltip>
            </Grid> */}
            <Grid item xs={12}>
                <DataTable
                    data={data}
                    columns={columns}
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
            <Modal
                open={updatePermissionModal}
                onClose={()=> setUpdatePermissionModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={updatePermissionModalStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setUpdatePermissionModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Update Role Permission Menu
                    </Typography>
                    <Box sx={{m:4}}>
                        <UpdatePermissionModal onUpdateData = {onUpdateData} close = {()=> setUpdatePermissionModal(false)} data = {updateInfo}/>
                    </Box>

                </Box>
            </Modal>
        </Grid>
    )
}