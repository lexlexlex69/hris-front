import React,{useEffect, useState} from 'react';
import {Box,Grid,Typography,Button,TextField,Modal,Tooltip, Autocomplete} from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { searchEmployee,addLeaveInCharge } from '.././LeaveInchargeRequest';
import 'react-data-table-component-extensions/dist/index.css';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {red,blue,green} from '@mui/material/colors'
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import SmallModal from '../../../custommodal/SmallModal';
export default function AddDialog(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [searchModal, setSearchModal] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [resultData,setResultData] = React.useState([])
    const [empid,setEmpid] = React.useState('')
    const [empstatus,setEmpstatus] = React.useState('')
    const [office,setOffice] = React.useState(null)

    const searchModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    useEffect(()=>{
    },[]) 
    
    const submitSearch = (event)=>{
        event.preventDefault();
        searchEmployee(searchData)
        .then(respo=>{
            const data = respo.data
            setResultData(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const selectRow = (data) =>{
        setEmpid(data.id)
        setSearchModal(false)
    }
    const saveData = (event)=>{
        event.preventDefault()
        Swal.fire({
            icon:'warning',
            title: 'Confirm add ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Adding data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2 = {
                    emp_no:empid,
                    emp_status:empstatus,
                    dept_code:office.dept_code,
                    dept_shortname:office.short_name,
                }
                addLeaveInCharge(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        props.setData(res.data.data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            showConfirmButton:false,
                            timer:1500
                        })
                        props.close()
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
    return(
        <>
        <form onSubmit = {saveData}>
            <Grid container spacing={2} sx={{p:2}}>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',flexDirection:'row',width:'100%'}}> 
                        <TextField label ='Employee ID' fullWidth value = {empid} onChange = {(value)=>setEmpid(value.target.value)} type='number' required/>
                        &nbsp;
                        <Tooltip title = 'Search employee'><Button variant='outlined' onClick={()=>setSearchModal(true)}><SearchOutlinedIcon/></Button></Tooltip>
                        
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Emp. Status *</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={empstatus}
                        label="Emp. Status *"
                        onChange={(value)=>setEmpstatus(value.target.value)}
                        required
                        >
                        {
                            props.empstatusData.map((data,key)=>
                            <MenuItem value={data.code} key = {key}>{data.description}</MenuItem>
                            )
                        }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={props.officesData}
                        getOptionLabel={(option) => option.dept_title}
                        isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code }
                        // sx={{ width: 300 }}
                        fullWidth
                        // size="small"
                        value = {office}
                        onChange={(e,newVal)=>setOffice(newVal)}
                        renderInput={(params) => <TextField {...params} label="Office/Department" required/>}
                        />
                    {/* <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Office/Department *</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={office}
                        label="Office/Department *"
                        onChange={(value)=>setOffice(value.target.value)}
                        required
                        >
                        {
                            props.officesData.map((data,key)=>
                            <MenuItem value={data} key = {key}>{data.dept_title}</MenuItem>
                            )
                        }
                        </Select>
                    </FormControl> */}
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Button variant='contained' color='success' type ='submit' className='custom-roundbutton'>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
        <SmallModal open = {searchModal} close = {()=> setSearchModal(false)} title='Search Employee'>
            <Box sx={{m:1}}>
                <form onSubmit={submitSearch}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField label='e.g. lastname,firstname' fullWidth required value = {searchData} onChange = {(value)=>setSearchData(value.target.value)} InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <AccountCircle />
                                </InputAdornment>
                            ),
                            }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant='outlined' size='small' sx={{float:'right'}}type = 'submit'>Search</Button>
                        </Grid>
                    </Grid>
                </form>
                {resultData.length !==0
                ?
                <Box sx={{mt:2}}>
                <small style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',fontSize:'12px'}}><em>* click row to select <strong>Employee ID</strong></em></small>
                <Box sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                <table className='table table-bordered table-hover' style={{marginTop:'5px'}}>
                    <thead style={{position:'sticky',top:'-3px',background:'#fff'}}>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultData.map((data,key)=>
                            <tr key = {key} onClick = {()=>selectRow(data)} style={{cursor:'pointer'}}>
                                <td>{data.id}</td>
                                <td>{data.fname +' '+data.lname}</td>
                                <td><span style={{color:data.has_account==='Has Account' ?'green':'red'}}>{data.has_account}</span></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </Box>
                </Box>
                :
                ''
                }
            </Box>
        </SmallModal>
        {/* <Modal
            open={searchModal}
            onClose={()=> setSearchModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={searchModalStyle}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setSearchModal(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Searching Employee
                </Typography>
                <Box sx={{m:4}}>
                <form onSubmit={submitSearch}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField label='e.g. lastname,firstname' fullWidth required value = {searchData} onChange = {(value)=>setSearchData(value.target.value)} InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <AccountCircle />
                                </InputAdornment>
                            ),
                            }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant='outlined' size='small' sx={{float:'right'}}type = 'submit'>Search</Button>
                        </Grid>
                    </Grid>
                </form>
                {resultData.length !==0
                ?
                <Box sx={{mt:2}}>
                <small style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',fontSize:'12px'}}><em>* click row to select <strong>Employee ID</strong></em></small>
                <Box sx={{maxHeight:'40vh',overflowY:'scroll'}}>
                <table className='table table-bordered table-hover' style={{marginTop:'5px'}}>
                    <thead style={{position:'sticky',top:'-3px',background:'#fff'}}>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultData.map((data,key)=>
                            <tr key = {key} onClick = {()=>selectRow(data)} style={{cursor:'pointer'}}>
                                <td>{data.id}</td>
                                <td>{data.fname +' '+data.lname}</td>
                                <td><span style={{color:data.has_account==='Has Account' ?'green':'red'}}>{data.has_account}</span></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </Box>
                </Box>
                :
                ''
                }
                </Box>



            </Box>
        </Modal> */}
        </>
        
    )
}