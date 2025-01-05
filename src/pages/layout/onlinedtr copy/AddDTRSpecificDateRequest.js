import React, { useEffect } from 'react';
import { Container, Grid, Typography,Box, Modal, TextField,InputLabel,Select,MenuItem,FormControl,Button,Tooltip,Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import moment from 'moment';
//icon
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { addRectificationRequest } from './DTRRequest';
import { blue, green, red, yellow } from '@mui/material/colors'
import { getLogAdjustmentData } from './DTRRequest';
import { ToastContainer, toast } from 'react-toastify';
const Input = styled('input')({
    display: 'none',
});
export default function AddDTRSpecificDateRequest(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [date,setDate] = React.useState('')
    const [nature,setNature] = React.useState('')
    const [time, setTime] = React.useState('');
    const [adjustmentType, setAdjustmentType] = React.useState(null);
    const [file, setFile] = React.useState('');
    const [adjustmentLogsData,setAdjustmentLogsData] = React.useState([])

    useEffect(()=>{
        setDate(props.date)
        setNature(props.nature)
        getLogAdjustmentData()
        .then(response=>{
            const data = response.data.response
            var new_data = [];
            data.forEach(el=>{
                new_data.push({
                    'label':el.atype_desc,
                    'atype_code':el.atype_code,
                    'atype_desc':el.atype_desc,
                    // 'type_code':el.type_code
                })
            })
            var duplicate = Object.values(data.reduce((c, v) => {
                let k = v.atype_code;
                c[k] = c[k] || [];
                c[k].push(v);
                return c;
              }, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
              console.log(duplicate)
            setAdjustmentLogsData(new_data)
        }).catch(error=>{
            console.log(error)
        })
        },[])
    const handleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setFile(fileReader.result)
                // setsingleFile(fileReader.result)
            }
        }else{
            setFile('')
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const submitData = (event) =>{
        event.preventDefault()
        if(!file){
            toast.warning('Please upload a file !', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined}
            )
        }else{
            Swal.fire({
                icon:'warning',
                title:'Confirm submit request ?',
                showCancelButton:true,
                confirmButtonText:'Yes',
                cancelButtonText:'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    if(adjustmentType.length ===0){
                        Swal.fire({
                            icon:'warning',
                            title:'Oops...',
                            html:'Please select adjustment type'
                        })
                    }else if(time.length ===0){
                        Swal.fire({
                            icon:'warning',
                            title:'Oops...',
                            html:'Please select rectified time'
                        })
                    }else if(file.length ===0){
                        Swal.fire({
                            icon:'warning',
                            title:'Oops...',
                            html:'Please upload file'
                        })
                    }else{
                        var data = [{
                            date:moment(date).format('YYYY-MM-DD'),
                            nature:nature,
                            reason:adjustmentType.atype_desc,
                            adj_type:adjustmentType.atype_code,
                            rectified_time:time,
                            file:file,
                        }]
                        Swal.fire({
                            icon:'info',
                            title:'Saving data please wait...',
                        })
                        // console.log(data)
                        Swal.showLoading()
                        addRectificationRequest(data)
                        .then(response=>{
                            const data = response.data
                            if(data.status === 'success'){
                                console.log(data)
                                if(data.max_missed_logs.length !==0){
                                    var tr = ""
                                    data.max_missed_logs.forEach(el=>
                                        tr+="<tr><td>"+el.date+"</td>"+"<td>"+el.nature+"</td></tr>"
                                    );
                                    Swal.fire({
                                        icon:'warning',
                                        title:'Maximum missed logs reached.',
                                        html:"<table class='table table-bordered'><thead><tr><th>Date</th><th>Nature</th></tr></thead><tbody>"+tr+"</tbody></table><span>Please review again your application.</span>"
                                    })
                                }else{
                                    Swal.fire({
                                        icon:'success',
                                        title:response.data.message,
                                        showConfirmButton: false,
                                        timer: 1500,
                                    })
                                }
                                
                                
                                props.updateAppliedRectification(data.applied_dates_dtr)
                                props.onClose()
                            }else{
                                Swal.fire({
                                    icon:'error',
                                    title:response.data.message
                                })
                            }
                            
                        }).catch(error=>{
                            Swal.close()
                            console.log(error)
                        })  
                    }
                     
                }
    
            })
        }
        
    }
    return(
        <Box sx={{mt:1,p:1}}>
        <form onSubmit={submitData}>
        <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField value={moment(date).format('MMMM DD, YYYY')} label ='Date' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField value={nature} label ='Nature' fullWidth InputLabelProps={{shrink:true}}/>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-demo"
                    options={adjustmentLogsData}
                    getOptionLabel={(option) => option.atype_desc}
                    value = {adjustmentType}
                    onChange={(event,newValue) => {
                        setAdjustmentType(newValue);
                        }}
                    renderInput={(params) => <TextField {...params} label="Adjustment Type" required/>}
                />

                </Grid>
                <Grid item xs={12}>
                <TextField type='time' label = "Specify Rectified Time" InputLabelProps={{shrink:true}} value = {time} onChange = {(value)=>setTime(value.target.value)} fullWidth required/>
                    
                </Grid>
                <Grid item xs={12}>
 
                <label htmlFor={"contained-button-file"} style={{width:'100%'}} required>
                    <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)}/>
                    
                    <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' }, flex: 1 ,height:55}}> {file.length ===0?<Tooltip title='No file uploaded'><WarningAmberOutlinedIcon size='small' color='error'/></Tooltip>:''} <AttachFileOutlinedIcon fontSize='small'/>Upload File </Button>
                </label>
                </Grid>
                <Grid item xs={12}>
                <hr/>

                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Button variant ='contained' color='success'type='submit' sx={{'&:hover':{color:'#fff',background:green[800]}}} className='custom-roundbutton' size='small'>Submit</Button> &nbsp;
                    <Button variant ='contained' color='error' onClick =  {props.onClose}sx={{'&:hover':{color:'#fff',background:red[800]}}}  className='custom-roundbutton' size='small'>Cancel</Button>
                </Box>
                </Grid>
            </Grid>
            </form>
        
        </Box>
    )
}