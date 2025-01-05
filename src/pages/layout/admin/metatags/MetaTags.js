import React,{useState,useEffect} from 'react';
import {Grid,Box,Stack,Skeleton,Typography,IconButton,Button,TextField,Paper,Tooltip} from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useNavigate}from "react-router-dom";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { ToastContainer, toast } from 'react-toastify';
import { addMetaTags, deleteMetaTags, getMetaTagsData, updateMetaTags } from './MetaTagsRequest';
import DataTable from 'react-data-table-component';
import { Rowing } from '@mui/icons-material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {blue,red,green} from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Swal from 'sweetalert2';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
export default function MetaTags(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true); 
    const [data,setData] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [name,setName] = useState('')
    const [desc,setDesc] = useState('')
    const [updateName,setUpdateName] = useState('')
    const [updateDesc,setUpdateDesc] = useState('')
    const [updateID,setUpdateID] = useState('')

    useEffect(()=>{
        checkPermission(37)
        .then((response)=>{
            if(response.data){
                setIsLoading(false)
                getMetaTagsData()
                .then(res=>{
                    setData(res.data)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])
    const handleDialogOpen = (event) =>{
        event.preventDefault();
        setOpenDialog(true);

    }
    const handleCloseDialog = () =>{
        setOpenDialog(false);
    }
    const handleCloseUpdateDialog = () =>{
        setUpdateDialog(false);
    }
    
    const columns = [
        {
            name:'Name',
            selector:row=>row.meta_name
        },
        {
            name:'Description',
            selector:row=>row.meta_tags_desc
        },
        {
            name:'Action',
            selector:row=>
            <Box sx={{p:1}}>
            {/* <Tooltip title='Update meta tags'><IconButton sx={{border:'solid 1px',borderColor:green[800],color:green[800],'&:hover':{color:'white',background:green[800]}}} onClick={()=>updateAction(row)}><EditOutlinedIcon/></IconButton></Tooltip> */}
            <Tooltip title='Update meta tag'><IconButton sx={{'&:hover':{color:'white',background:green[800]}}} onClick={()=>updateAction(row)} className='custom-iconbutton' color='success'><EditOutlinedIcon/></IconButton></Tooltip>
            &nbsp;
            <Tooltip title='Delete meta tag'><IconButton sx={{'&:hover':{color:'white',background:red[800]}}} onClick={()=>deleteAction(row)} className='custom-iconbutton' color='error'><DeleteOutlineOutlinedIcon/></IconButton></Tooltip>
            {/* <Tooltip title='Delete meta tags'><IconButton sx={{border:'solid 1px',borderColor:red[800],color:red[800],'&:hover':{color:'white',background:red[800]}}}onClick={()=>deleteAction(row)}><DeleteOutlineOutlinedIcon/></IconButton></Tooltip> */}
            </Box>
        }
    ]
    const submit = (event)=>{
        event.preventDefault()
        Swal.fire({
            icon:'info',
            title:'Adding Data',
            html:'Please wait...'
        })
        Swal.showLoading()
        var data2 = {
            meta_tags_name:name,
            meta_tags_desc:desc
        }
        addMetaTags(data2)
        .then(res=>{
            if(res.data.status === 200){
                setName('')
                setDesc('')
                setData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                handleCloseDialog()
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
    const updateAction = (row)=>{
        setUpdateID(row.meta_tags_id)
        setUpdateName(row.meta_name)
        setUpdateDesc(row.meta_tags_desc?row.meta_tags_desc:'')
        setUpdateDialog(true);
    }
    const deleteAction = (row)=>{
        Swal.fire({
            icon:'warning',
            title: 'Confirm delete?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                icon:'info',
                title:'Deleting data',
                html:'Please wait...'
              })
              Swal.showLoading()
              var data2 = {
                meta_tags_id:row.meta_tags_id
              }
              deleteMetaTags(data2)
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
                Swal.close()
                console.log(err)
              })
            } 
          })
    }
    const submitUpdate = (event)=>{
        event.preventDefault()
        Swal.fire({
            icon:'info',
            title:'Updating data',
            html:'Please wait...'
          })
        Swal.showLoading()
        var data2 = {
            meta_tags_id:updateID,
            meta_name:updateName,
            meta_tags_desc:updateDesc,
        }
        updateMetaTags(data2)
        .then(res=>{
            if(res.data.status === 200){
                setData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                setUpdateDialog(false);
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
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{margin:'20px'}}>
            <Stack sx={{marginTop:'-10px'}}>
                <Skeleton variant="text" height={'110px'} animation="wave"/>
            </Stack>
            </Box>
            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Meta Tags Settings
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Meta Tags Settings'/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Tooltip title='Add new meta tags'><IconButton sx={{'&:hover':{color:'white',background:green[800]}}} onClick={handleDialogOpen} className='custom-iconbutton' color='success'><AddOutlinedIcon/></IconButton></Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                            
                        <Grid item container component={Paper} sx={{p:2}}>
                            <DataTable
                                data={data}
                                columns={columns}
                            />
                        </Grid>

                    </Grid>
                </Grid>
                <Dialog
                    fullScreen
                    sx={{width:matches?'100%':'40vw',height:'100%',right:0,left:'auto'}}
                    open={openDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Adding Meta Tags
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:4}}>
                        <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField label='Name' fullWidth value = {name} onChange={(value)=>setName(value.target.value)} required/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Description' fullWidth value = {desc} onChange={(value)=>setDesc(value.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                               <Button variant='contained' color='success' sx={{float:'right'}} type='submit'>Save</Button>
                            </Grid>
                        </Grid>
                        </form>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    sx={{width:matches?'100%':'40vw',height:'100%',right:0,left:'auto'}}
                    open={updateDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseUpdateDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Updating Meta Tags
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseUpdateDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:4}}>
                        <form onSubmit={submitUpdate}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField label='Name' fullWidth value = {updateName} onChange={(value)=>setUpdateName(value.target.value)} required/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Description' fullWidth value = {updateDesc} onChange={(value)=>setUpdateDesc(value.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                               <Button variant='contained' color='success' sx={{float:'right'}} type='submit'>Save update</Button>
                            </Grid>
                        </Grid>
                        </form>
                    </Box>

                </Dialog>
            </Box>
        }
        </>
    )
}