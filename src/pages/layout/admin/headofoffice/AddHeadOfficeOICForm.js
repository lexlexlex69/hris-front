import { Box, Button, Grid, TextField, Typography,Tooltip,Modal,Autocomplete} from '@mui/material';
import React, { useState } from 'react';
import SearchEmployee from './SearchEmployee';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addHeadOfficeOIC } from './HeadOfOfficeConfigRequest'; 
import moment from 'moment';
import Swal from 'sweetalert2';
import './HeadOffice.css';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchEmpModal from '../../custommodal/SearchEmpModal';
import { formatExtName, formatMiddlename } from '../../customstring/CustomString';

export default function AddHeadOfficeOICForm(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchModal,setSearchModal]= React.useState(false)
    const [emp,setEmp] = React.useState({
        fname:'',
        mname:'',
        lname:'',
        extname:'',
    })
    const [fullname,setFullname] = useState('');
    const [position,setPosition] = useState('');
    const [expiration,setExpiration] = React.useState('')
    const [office,setOffice] = React.useState(null)
    const searchModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:matches?350:450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
    };

    const submitData = (event)=>{
        event.preventDefault()
        if(emp?.fname.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please input Employee'
            })
        }else if(moment(expiration).format('YYYY-MM-DD H:mm:s') === 'Invalid date'){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please input a valid designation Expiration date.'
            })
        }else if(office.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please office.'
            })
        }else{
            Swal.fire({
                icon:'info',
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: 'Save',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Swal.fire({
                        icon:'info',
                        title:'Adding data',
                        html:'Please wait...',
                        allowEnterKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading();
                    var data = {
                        employee_id:emp.id,
                        expiration:moment(expiration).format('YYYY-MM-DD H:mm:s'),
                        office:office.head_office_designation_id,
                        fullname:fullname,
                        position:position
                    }
                    addHeadOfficeOIC(data)
                    .then(respo=>{
                        const data = respo.data
                        if(data.status === 200){
                            props.onUpdateInfo(data.data)
                            props.close()
                            Swal.fire({
                                icon:'success',
                                title:data.message,
                                timer:1500,
                                showConfirmButton:false
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:data.message,
                            })
                        }
                    }).catch(err=>{
                        Swal.close();
                        console.log(err)
                    })
                }
              })
            // console.log(expiration.trim())
            // addHeadOfficeOIC(data)
            // .then(respo=>{
            //     const data = respo.data
            //     props.onUpdateInfo(data.data)
            //     props.close()
            // }).catch(err=>{
            //     console.log(err)
            // })
        }
        
    }
    const handleSearchData = (data) =>{
        console.log(data)
        setEmp(data)
        setFullname(`${data.fname} ${formatMiddlename(data.mname)} ${data.lname} ${formatExtName(data.extname)}`)
        setPosition(data.position_name)
        setSearchModal(false)
    }
    return(
        <Box>
            <form onSubmit={submitData}>
            <Grid container spacing = {2}>
                <Grid item xs={12} sx={{display:'flex',gap:1}}>
                        <TextField label ='Employee Name' fullWidth required value = {`${emp.fname} ${formatMiddlename(emp.mname)} ${emp.lname}`}  InputProps={{readOnly:true}}/>
                        <Tooltip title='Search Employee'>
                        <Button sx={{float:'right'}} variant='outlined'onClick={()=>setSearchModal(true)} className='search-btn'><SearchOutlinedIcon /></Button>
                        </Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Name (Actual name to reflect)' value={fullname} onChange={(val)=>setFullname(val.target.value)} InputLabelProps={{shrink:true}} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label = 'Position' value={position} onChange={(val)=>setPosition(val.target.value)} InputLabelProps={{shrink:true}} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={props.officeData}
                    value = {office}
                    getOptionLabel={(option) => option.dept_title}
                    onChange={(event,newValue) => {
                        setOffice(newValue);
                        }}
                    renderInput={(params) => <TextField {...params} label="Office/Department" required/>}
                />
                </Grid>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Designation Expiration"
                        renderInput={(params) => <TextField {...params} fullWidth required/>}
                        value={expiration}
                        onChange={(newValue) => {
                            setExpiration(newValue);
                        }}
                        
                    />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant='contained' color='success' className='custom-roundbutton' type ='submit'> Save</Button>
                    <Button variant='contained' color='error' className='custom-roundbutton' onClick={props.close}> Cancel</Button>
                </Grid>
            </Grid>
        </form>
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
                    <SearchEmployee close = {()=> setSearchModal(false)} handleSearchData = {handleSearchData}/>

                </Box>
            </Modal> */}
            <SearchEmpModal open = {searchModal} close = {()=> setSearchModal(false)} title='Search Employee' type={1} updateSelect = {handleSearchData}>
            </SearchEmpModal>
        </Box>

    )
}