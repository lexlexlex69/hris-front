import { Container, Grid, Typography,Button,Modal, TextField,Paper, Tooltip, Fade,IconButton } from '@mui/material';
import React, { useEffect,useState } from 'react';
import { getAllUser,getUserRoles,deleteUserRole,getDistinctUserRoles,checkPassword, resetUserPassword, deleteUser, resetDateUpdatedBal, temporaryChangePassword, rollbackPassword, updateUserToEmployee, getActionPerm } from './Request';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { Box } from '@mui/system';
import { blue, green, grey, orange, red, yellow } from '@mui/material/colors'
//icon
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SettingsAccessibilityOutlinedIcon from '@mui/icons-material/SettingsAccessibilityOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import PasswordIcon from '@mui/icons-material/Password';
import ReplayIcon from '@mui/icons-material/Replay';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import Swal from 'sweetalert2';
import AddUserRoleModal from './Modal/AddUserRoleModal';
import ManageRoleModal from './Modal/ManageRoleModal';
import ManagePermissionModal from './Modal/ManagePermissionModal';
import axios from 'axios';
import { auditLogs } from '../../auditlogs/Request';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import moment from 'moment';
import SearchEmpModal from '../../custommodal/SearchEmpModal';
import { APILoading } from '../../apiresponse/APIResponse';
import LargeModal from '../../custommodal/LargeModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SmallestModal from '../../custommodal/SmallestModal';
import SmallModal from '../../custommodal/SmallModal';
const addUserRoleModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    // marginBottom: matches? 20:0,
    bgcolor: '#fff',
    border: '2px solid #fff',
    borderRadius:3,
    boxShadow: 24,
    // p: 4,
  };

export default function UserRole(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:600,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
        // height:'100%',
        // overflow:'scroll'
      };
    const enterPassWordModalStyle = {
        position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches?350:500,
            bgcolor: '#fff',
            border: '2px solid #fff',
            borderRadius:3,
            boxShadow: 24,
        };
    const manageRoleModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:700,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
    };
    const managePermissionModalStyle = {
        position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches?350:700,
            bgcolor: '#fff',
            border: '2px solid #fff',
            borderRadius:3,
            boxShadow: 24,
        };
    // navigate
    const navigate = useNavigate()
    const [data,setData] = React.useState([])
    const [showUserRole,setshowUserRole] = React.useState(false)
    const [addUserRoleModal,setAddUserRoleModal] = useState(false)
    const [manageRoleModal,setManageRoleModal] = useState(false)
    const [managePermissionModal,setManagePermissionModal] = useState(false)
    const [enterPasswordModal,setEnterPasswordModal] = useState(true)
    const [loadPage,setLoadPage] = useState(true)
    const [actions,setActions] = useState('');
    useEffect(()=>{
        var logs = {
            action:'ACCESS USER ROLE MANAGEMENT',
            action_dtl:'ACCESS USER ROLE MODULE MANAGEMENT',
            module:'USER ROLE MANAGEMENT'
        }
        auditLogs(logs)
        checkPermission(20)
        .then((response)=>{
            if(!response.data){
                var logs = {
                    action:'ACCESS USER ROLE MANAGEMENT',
                    action_dtl:'PERMISSION DENIED TO ACCESS USER ROLE MANAGEMENT MODULE',
                    module:'USER ROLE MANAGEMENT'
                }
                auditLogs(logs)
                navigate(`/${process.env.REACT_APP_HOST}`)
            }else{
                //get action permissions
                _init();
            }
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const _init = async () => {
        const res = await getActionPerm();
        setActions(res.data.data.access);
    }
    const [password,setPassword] = useState('')
    const [passwordMessage,setPasswordMessage] = useState('')
    const submitEnterPassword = (event) =>{
        event.preventDefault()
        Swal.fire({
            icon:'info',
            title:'Verifying password',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading();
        checkPassword(password)
        .then(res=>{
            const result = res.data
            if(result.status === 200){
                
                var logs = {
                    action:'ENTER PASSWORD TO ACCESS USER ROLE MANAGEMENT',
                    action_dtl:'SUCCESS TO ACCESS USER ROLE MODULE MANAGEMENT',
                    module:'USER ROLE MANAGEMENT'
                }
                auditLogs(logs)
                getAllUser()
                .then(response=>{
                    const data = response.data
                    console.log(data)
                    setData(data)
                    setLoadPage(false)
                    Swal.fire({
                        icon:'success',
                        title:'Password verified',
                        timer:1500,
                        showConfirmButton:false
                    })
                }).catch(error=>{
                    Swal.close();
                    console.log(error)
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Invalid Password !',
                    timer:1500,
                    showConfirmButton:false
                })
                var logs = {
                    action:'ENTER PASSWORD TO ACCESS USER ROLE MANAGEMENT',
                    action_dtl:'INVALID PASSWORD TO ACCESS USER ROLE MODULE MANAGEMENT',
                    module:'USER ROLE MANAGEMENT'
                }
                auditLogs(logs)
                setPasswordMessage('Invalid Password,please try again.')
            }
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    const handleResetPassword = (row)=>{
        Swal.fire({
        icon:'warning',
        title: 'Do you want to reset the password?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Resetting password',
                html:'Please wait...'
            })
            Swal.showLoading();
            var data2 = {
                employee_id:row.employee_id,
                name:row.name
            }
            resetUserPassword(data2)
            .then(res=>{
                if(res.data.status === 200){
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
    const columns = [
        {
            name:'Name',
            selector:row=>row.name
        },
        {
            name:'Office',
            selector:row=>row.short_name
        },
        {
            name:'Username',
            selector:row=>row.username,
        },
        
        {
            name:'Employee ID',
            selector:row=>row.employee_id,
        },
        {
            name:'Email',
            selector:row=>row.email ?row.email:'',
            sortable:true
        },
        {
            name:'Verification Code',
            selector:row=>row.verification_code?row.verification_code:'',
            sortable:true
        },
        {
            name:'User Type',
            selector:row=>row.type_of_user,
            sortable:true
        },
        {
            name:'Datetime Created',
            selector:row=>moment(row.created_at).format('MMMM DD, YYYY | hh:m a'),
            sortable:true
        },
        {
            name:'Action',
            selector:row=><Box sx={{display:'flex',gap:1,alignItems:"center",p:1,flexWrap:'wrap'}}>
            
            {
                actions.includes('RESET')
                &&
                <Tooltip title='Reset Password'><IconButton className='custom-iconbutton' sx={{color:orange[800],'&:hover': { bgcolor: orange[800], color: '#fff' }}} onClick={()=>handleResetPassword(row)} size='small'><RestartAltIcon/></IconButton></Tooltip>
            }
            {
                actions.includes('DELETE')
                &&
                <Tooltip title='Delete User'><IconButton className='custom-iconbutton' sx={{color:red[800],'&:hover': { bgcolor: red[800], color: '#fff' }}} onClick={()=>handleDeleteUser(row)} size='small'><DeleteIcon/></IconButton></Tooltip>
            }
            {
                actions.includes('UPDATE')
                &&
                <Tooltip title='Update User Roles'>
                <IconButton color='primary' className='custom-iconbutton' sx={{'&:hover': { bgcolor: blue[800], color: '#fff' }}} onClick={()=>showUseRolesModal(row)} size='small'><ManageAccountsIcon/></IconButton></Tooltip>
            }

            <Tooltip title='Reset date updated balance'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover': { bgcolor: blue[800], color: '#fff' }}} onClick={()=>handleResetDateUpdatedBal(row)} size='small'><RotateLeftIcon/></IconButton></Tooltip>
            {
                row.type_of_user === 'Applicant'
                ?
                <Tooltip title='Update to Employee User'><IconButton className='custom-iconbutton' sx={{'&:hover':{background:grey[800],color:'#fff'}}} onClick={()=>handleUpdateToEmployee(row.id)}><SwapHorizIcon/></IconButton></Tooltip>
                :
                null
            }
            {/* &nbsp;
            <Tooltip title={<Box><Button variant='contained' color='error' onClick={()=>handleChangePass(row)}>CP</Button>&nbsp;<Button variant='contained' color='info'  onClick={()=>handleRollbackPass(row)}>RP</Button></Box>}><IconButton className='custom-iconbutton' size='small'><PasswordIcon/></IconButton></Tooltip> */}
            </Box>
        }
    ]
    
    const handleChangePass = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'infor',
            title:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            id:row.id,
            // username:row.username,
            // employee_id:row.employee_id,
            // password:row.password
        }
        temporaryChangePassword(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message,
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:'success',
                title:err,
            })
        })

    }
    const handleRollbackPass = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'infor',
            title:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            id:row.id
        }
        rollbackPassword(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message,
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:'success',
                title:err,
            })
        })
    }
    const handleResetDateUpdatedBal = (row)=>{
        Swal.fire({
            icon:'info',
            title:'Updating data',
            html:'Please wait...'
        })
        Swal.showLoading();
        var t_data = {
            id:row.employee_id,
            date:moment().subtract(1,'days').format('YYYY-MM-DD H:mm:ss')
        }
        resetDateUpdatedBal(t_data)
        .then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'warning',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const userRoleColumns = [
        {
            name:'Role Name',
            selector:row=>row.role_name
        },
        {
            name:'Action',
            selector:row=><Box sx={{p:1}}><Tooltip title = 'Delete User Role'><IconButton color='error' className='custom-iconbutton' onClick={()=>deleteUserRoleAction(row)}><DeleteIcon/> </IconButton></Tooltip></Box>
        }
    ]
    const handleDeleteUser = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'question',
            title:'Confirm delete ?',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Please input master password',
                    input:'password',
                    showCancelButton:true,
                    confirmButtonText:'Proceed',
                    inputValidator: (value) => {
                        if (!value) {
                        return 'Please input the master password !'
                        }
                    }
                }).then(res=>{
                    if(res.value !== 'HRIS@Passw0rd'){
                        Swal.fire({
                            icon:'error',
                            title:'Invalid Master password',
                            html:'Please contact system admin'
                        })
                    }else{
                        Swal.fire({
                            icon:'info',
                            title:'Deleting user',
                            html:'Please wait...',
                            allowEscapeKey:false,
                            allowOutsideClick:false
                        })
                        Swal.showLoading();
                        var t_data = {
                            id:row.id,
                            name:row.name
                        }
                        deleteUser(t_data)
                        .then(res=>{
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
                            Swal.fire({
                                    icon:'error',
                                    title:err
                            })
                            console.log(err)
                        })
                        
                    }
                })
            }
        })
    }
    const deleteUserRoleAction = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'info',
            title: 'Do you want to delete this role?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Deleting User Role',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading()
              var data2 = {
                emp_no:selectedEmpNo,
                role_id:row.role_id,
                role_name:row.role_name
              }
              deleteUserRole(data2)
              .then(res=>{
                const result = res.data
                if(result.status === 200){
                    setuserRoleData(result.new_data)
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
              }).catch(err=>{
                Swal.close()
                console.log(err)
              })
            }
          })
    }
    const [selectedUser,setselectedUser] = React.useState([])
    const [userRoleData,setuserRoleData] = React.useState([])
    const [selectedEmpNo,setSelectedEmpNo] = React.useState('')

    const showUseRolesModal = (row) =>{
        console.log(row)
        var logs = {
            action:'VIEW USER ROLE',
            action_dtl:'USERNAME = '+row.username,
            module:'USER ROLE'
        }
        auditLogs(logs)
        Swal.fire({
            icon:'info',
            title:'Loading User Role',
            html:'Please wait...'
        })
        Swal.showLoading()
        setSelectedEmpNo(row.employee_id)
        getUserRoles(row.employee_id)
        .then(response=>{
            const data = response.data
            setuserRoleData(response.data)
            setselectedUser(row)
            Swal.close();
            setshowUserRole(true)
        }).catch(error=>{
            Swal.close();
            console.log(error)
        })
       
    }

    const tableData = {
        columns,
        data,
      };
    const [distinctuserRole,setDistinctUserRole] = useState([])
    const addUserRoleAction = () =>{
        getDistinctUserRoles(selectedEmpNo)
        .then(res=>{
            const result = res.data
            setDistinctUserRole(result)
        }).catch(err=>{
            console.log(err)
        })
        setAddUserRoleModal(true)
    }
    const onAddUserRole = (newdata) =>{
        setuserRoleData(newdata)
    }
    const handleReloadData = async () => {
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading();
        await getAllUser()
        .then(response=>{
            const data = response.data
            setData(data)
            Swal.close();
        }).catch(error=>{
            Swal.close();
        })
    }
    const [openSearchEmp,setOpenSearchEmp] = useState(false)
    const [selectedUserID,setSelectedUserID] = useState('')
    const handleUpdateToEmployee = (id) => {
        console.log(id)
        setSelectedUserID(id)
        setOpenSearchEmp(true)
    }
    const updateSelect = async (emp_id)=>{
        try{
            APILoading('info','Updating info','Please wait...')
            var t_data = {
                id:selectedUserID,
                emp_id:emp_id,

            }
            const res = await updateUserToEmployee(t_data);
            if(res.data.status === 200){
                setData(res.data.data)
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
        }catch(error){
            Swal.fire({
                icon:'success',
                title:error
            })
        }
        
    }
    return(
        <>
        {
            loadPage
            ?
            <Modal
                open={enterPasswordModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={enterPassWordModalStyle}>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Enter Password to proceed
                    </Typography>
                    <Box sx={{m:4}}>
                        <form onSubmit = {submitEnterPassword}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField type='password' label='Password' fullWidth required value = {password} onChange = {(value)=>setPassword(value.target.value)}/>
                            </Grid>
                            {
                                passwordMessage.length !==0
                                ?
                                <Grid item xs={12}>
                                    <Typography sx={{color:'red',textAlign:'center'}}><PriorityHighOutlinedIcon/> {passwordMessage}</Typography>
                                </Grid>
                                :
                                ''
                            }
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Button variant='contained' color='success' type='submit' className='custom-roundbutton'>SUBMIT</Button> &nbsp;
                                <Button variant='contained' color='error' onClick = {()=>setEnterPasswordModal(false)} className='custom-roundbutton'>Close</Button>

                            </Grid>
                        </Grid>
                        </form>
                    </Box>

                </Box>
            </Modal>
            :
            <Fade in={!loadPage}>
                    <Box sx={{margin:'0 10px 10px 10px'}}>
                        <Grid container>
                            {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title='User Role Management'/>

                            </Grid> */}
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end', mb:2,gap:1}}>
                                    {
                                        actions.includes('CONFIG')
                                        &&
                                        <>
                                        <Tooltip title='Manage Role'><IconButton className='custom-iconbutton' color='primary' onClick = {()=>setManageRoleModal(true)} sx={{'&:hover': { bgcolor: blue[800], color: '#fff' }}}><SettingsOutlinedIcon/></IconButton></Tooltip>

                                        <Tooltip title='Manage Role Permission Menu'><IconButton color='info' className='custom-iconbutton' onClick = {()=>setManagePermissionModal(true)}sx={{'&:hover': { bgcolor: blue[700], color: '#fff' }}}><SettingsAccessibilityOutlinedIcon/></IconButton></Tooltip>
                                        </>
                                    }
                                    

                                    <Tooltip title='Reload data'><IconButton color='primary' className='custom-iconbutton' onClick = {()=>handleReloadData()}sx={{'&:hover': { bgcolor: blue[800], color: '#fff' }}}><ReplayIcon/></IconButton></Tooltip>
                            </Grid> 
                        </Grid>

                        <Box component={Paper}>
                        <Grid container>
                            <Grid item xs={12}>
                            <DataTableExtensions
                                {...tableData}
                                filterPlaceholder = 'Search User'
                                export = {false}
                                print = {false}
                                >
                                <DataTable
                                    columns={columns}
                                    data={data}

                                    // subHeader
                                    // selectableRows
                                    // contextActions={contextActions}
                                    // onSelectedRowsChange={handleRowSelected}
                                    // clearSelectedRows={toggleCleared}
                                    pagination
                                    paginationPerPage={5}
                                    paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                    paginationComponentOptions={{
                                        rowsPerPageText: 'Records per page:',
                                        rangeSeparatorText: 'out of',
                                    }}
                                    highlightOnHover
                                />
                                </DataTableExtensions>
                            </Grid>
                        </Grid>
                        </Box>
                        <SmallModal open={showUserRole} close={()=>setshowUserRole(false)} title="Updating User's Role">
                            <Grid container>
                                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                    <Typography><AccountCircleIcon/> {selectedUser.name}</Typography>
                                    <Tooltip title='Add User Role'><IconButton color='success' className='custom-iconbutton' onClick={addUserRoleAction}><AddIcon/></IconButton></Tooltip>
                                </Grid>
                                <Grid item xs={12} sx={{mt:2}}>
                                    <DataTable
                                        columns={userRoleColumns}
                                        data={userRoleData}
                                        pagination
                                        fixedHeader
                                        // fixedHeaderScrollHeight="40vh"
                                        paginationPerPage={5}
                                        paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                        paginationComponentOptions={{
                                            rowsPerPageText: 'Records per page:',
                                            rangeSeparatorText: 'out of',
                                        }}

                                    />
                                </Grid>
                            </Grid>
                        </SmallModal>
                        {/* <Modal
                            open={showUserRole}
                            onClose={()=>setshowUserRole(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            
                            <Box sx={style}>
                                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setshowUserRole(false)}/>
                                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                                Manage User Role
                                </Typography>
                                <Box sx={{p:4}}>
                                    <Grid container>
                                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                            <Typography><AccountCircleIcon/> {selectedUser.name}</Typography>
                                            <Tooltip title='Add User Role'><IconButton color='success' className='custom-iconbutton' onClick={addUserRoleAction}><AddIcon/></IconButton></Tooltip>
                                        </Grid>
                                        <Grid item xs={12} sx={{mt:2}}>
                                            <DataTable
                                                columns={userRoleColumns}
                                                data={userRoleData}
                                                pagination
                                                fixedHeader
                                                // fixedHeaderScrollHeight="40vh"
                                                paginationPerPage={5}
                                                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                                paginationComponentOptions={{
                                                    rowsPerPageText: 'Records per page:',
                                                    rangeSeparatorText: 'out of',
                                                }}

                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                            </Box>
                        </Modal> */}

                        <LargeModal open={manageRoleModal} close = {()=> setManageRoleModal(false)} title='Manage Roles'>
                            <ManageRoleModal close = {()=> setManageRoleModal(false)}/>
                        </LargeModal>
                        <LargeModal open={addUserRoleModal} close = {()=> setAddUserRoleModal(false)} title='Manage Roles'>
                            <AddUserRoleModal onAddUserRole = {onAddUserRole} close = {()=> setAddUserRoleModal(false)} data = {distinctuserRole} emp_no = {selectedEmpNo}/>
                        </LargeModal>
                        <LargeModal open={managePermissionModal} close = {()=> setManagePermissionModal(false)} title='Manage Roles Permission Menu'>
                            <ManagePermissionModal close = {()=> setManagePermissionModal(false)}/>
                        </LargeModal>
                        {/* <Modal
                            open={manageRoleModal}
                            onClose={()=> setManageRoleModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={manageRoleModalStyle}>
                                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setManageRoleModal(false)}/>
                                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                                Manage Role
                                </Typography>
                                <Box sx={{m:2}}>
                                    <ManageRoleModal close = {()=> setManageRoleModal(false)}/>
                                </Box>

                            </Box>
                        </Modal> */}
                        
                        {/* <Modal
                            open={addUserRoleModal}
                            onClose={()=> setAddUserRoleModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={addUserRoleModalStyle}>
                                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setAddUserRoleModal(false)}/>
                                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                                Adding User Role
                                </Typography>
                                <Box sx={{m:2}}>
                                    <AddUserRoleModal onAddUserRole = {onAddUserRole} close = {()=> setAddUserRoleModal(false)} data = {distinctuserRole} emp_no = {selectedEmpNo}/>
                                </Box>

                            </Box>
                        </Modal> */}
                        {/* <Modal
                            open={managePermissionModal}
                            onClose={()=> setManagePermissionModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={managePermissionModalStyle}>
                                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setManagePermissionModal(false)}/>
                                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                                Manage Role Permission Menu
                                </Typography>
                                <Box sx={{m:2}}>
                                    <ManagePermissionModal close = {()=> setManagePermissionModal(false)}/>
                                </Box>

                            </Box>
                        </Modal> */}
                        <SearchEmpModal open = {openSearchEmp} close = {()=>setOpenSearchEmp(false)} title = 'Search Employee' updateSelect={updateSelect}>

                        </SearchEmpModal>
                    </Box>
            </Fade>
        }
        </>
        
    )
}