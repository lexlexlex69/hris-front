import { Grid,Box,Typography, Button, Tooltip,Modal,Backdrop,Fade } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { getWorkScheduleTemplate,deleteTemplate,getWorkSchedule } from '../WorkScheduleRequest';
import DataTable from 'react-data-table-component'
import { blue, green, red, yellow } from '@mui/material/colors'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import WideDataTableLoader from '../../loader/WideDataTableLoader';
import Swal from 'sweetalert2';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';

import { faListNumeric } from '@fortawesome/free-solid-svg-icons';
import UpdateTemplateModal from './UpdateTemplateModal';
import AddTemplate from '../AddTemplate';

const updateStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    minWidth:'330px',
    maxWidth:'90vw',
    marginBottom: 0,
    bgcolor: '#fff',
    border: '2px solid #fff',
    borderRadius:3, 
    boxShadow: 24,
  };
const addStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    minWidth:'330px',
    maxWidth:'90vw',
    marginBottom: 0,
    bgcolor: '#fff',
    border: '2px solid #fff',
    borderRadius:3, 
    boxShadow: 24,
  };
const customStyles = {
    rows: {
        style: {
            minHeight: '50px', // override the row height
        },
    },
    headCells: {
        style: {
            fontSize:'1.2rem',
            background:blue[500],
            color:'#fff',
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',

        },
    },
    cells: {
        style: {
            fontSize:'.8rem'

        },
    },
};
export default function ManageTemplateModal(props){
    const [data,setData] = useState([])
    const [loadingData,setLoadingData] = useState([])
    const [updateData,setUpdateData] = useState(false)
    const [updateModal,setUpdateModal] = useState(false)
    const [addModal,setAddModal] = useState(false)
    const [workScheduleData,setWorkScheduleData] = useState([])
    useEffect(()=>{
        getWorkScheduleTemplate()
        .then(res=>{
            setData(res.data)
            setLoadingData(false)
        }).then(res=>{
            getWorkSchedule()
            .then(response=>{
                const data = response.data.response
                setWorkScheduleData(data)
            }).catch(error=>{
                console.log(error)
            })
        })
        
    },[])
    const columns = [
        {
            name:'Template Name',
            selector:row=><Typography>{row.template_name}</Typography>
        },
        {
            name:'Details',
            selector:row=>showTemplateDetails(row)
        },
        {
            name:'Action',
            selector:row=><Box>
                <Tooltip title = 'Delete template' placement='left'><Button variant = 'outlined' color='error' sx={{'&:hover':{background:red[800],color:'#fff'}}} onClick={()=>deleteAction(row)}><DeleteOutlinedIcon/></Button></Tooltip><br/>
                <Tooltip title = 'Update template' placement='left'><Button variant = 'outlined' color='success' sx={{mt:1,'&:hover':{background:green[800],color:'#fff'}}} onClick={()=>updateAction(row)}><EditOutlinedIcon/></Button></Tooltip>
            </Box>
        },

    ]
    const deleteAction = (row) =>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to delete this template ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Deleting template',
                    html:'Please wait..',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                deleteTemplate(row.template_id)
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
                    Swal.close()
                    console.log(err)
                })
            }
          })
       
    }
    const updateAction = (row) =>{
        setUpdateData(row)
        setUpdateModal(true)
    }
    const showTemplateDetails = (row)=>{
        var working_days = JSON.parse(row.working_days)
        var rest_days = JSON.parse(row.rest_days)
        return(
            <Box>
                <Typography sx={{fontSize:'1rem',fontWeight:'bold'}}>Working Days</Typography>
                <ul style={{fontSize:'.9rem'}}>
                    {working_days.map((data,key)=>
                        <li key = {key} style ={{color:'#0082c1'}}>{data.day} <strong>({data.whrs_desc})</strong></li>
                    )}
                </ul>
                <Typography sx={{fontSize:'1rem',fontWeight:'bold'}}>Rest Days</Typography>
                <ul style={{fontSize:'.9rem'}}>
                    {rest_days.map((data,key)=>
                        <li key = {key} style ={{color:'#0082c1'}}>{data.day}</li>
                    )}
                </ul>
            </Box>
        )

    }
    const onUpdateTemplate = () => {
        getWorkScheduleTemplate()
        .then(res=>{
            setData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Tooltip title='Add New Template'>
                    <Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='outlined' onClick = {()=>setAddModal(true)} color='success'><AddOutlinedIcon/></Button>
                </Tooltip>
            </Grid>
                {
                    loadingData
                    ?
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',flexDirection:'row'}}
                        open={loadingData}
                        // onClick={handleClose}
                    >
                        <CircularProgress color="inherit" /> &nbsp;
                        <Typography>Loading Template Schedule Data...</Typography>
                    </Backdrop>
                    :
                    <Fade in={!loadingData}>
                        <Box sx={{width:'100%',m:1}}>
                        <Grid item xs={12}>

                        <DataTable
                            data = {data}
                            columns = {columns}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                            pagination
                            highlightOnHover
                            fixedHeader
                            fixedHeaderScrollHeight="65vh"
                            customStyles={customStyles}
                        />
                        </Grid>
                        {/* <Grid item xs={12}  sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Tooltip title='Close Modal'><Button sx={{'&:hover':{color:'white',background:red[800]}}} variant='outlined' color='error' startIcon={<CancelOutlinedIcon/>} onClick ={props.close}>Close</Button>
                            </Tooltip>
                        </Grid> */}
                        </Box>
                    </Fade>
                }
                
            
            <Modal
                open={updateModal}
                // onClose={()=>setUpdateModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={updateStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setUpdateModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Updating Template Schedule
                    </Typography>
                    <Box sx={{ p:2,mb:2}}>
                        <UpdateTemplateModal data = {updateData} close={()=> setUpdateModal(false)} workScheduleData = {workScheduleData} onUpdateTemplate = {onUpdateTemplate}/>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={addModal}
                // onClose={()=>setUpdateModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={addStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setAddModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Adding Template Schedule
                    </Typography>
                    <Box sx={{p:2,mb:2}}>
                        <AddTemplate close={()=> setAddModal(false)} onUpdateTemplate = {onUpdateTemplate}/>
                    </Box>
                </Box>
            </Modal>
        </Grid>
    )
}