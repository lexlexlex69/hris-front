import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography,Box, Modal, TextField,InputLabel,Select,MenuItem,FormControl,Button,Tooltip,Autocomplete,CircularProgress, IconButton  } from '@mui/material';
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
import DeleteIcon from '@mui/icons-material/Delete';

import { addRectificationRequest, checkMaximumMissedLogs, getLogsAdjustmentAPI } from './DTRRequest';
import { blue, green, red, yellow } from '@mui/material/colors'
import { getLogAdjustmentData } from './DTRRequest';
import { ToastContainer, toast } from 'react-toastify';
import { convertTo64 } from './convertfile/ConvertFile';
import { api_url } from '../../../../request/APIRequestURL';
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
    const [fileUpload, setFileUpload] = React.useState([]);
    const [adjustmentLogsData,setAdjustmentLogsData] = React.useState([])
    // const [loadingAdjst,setLoadingAdjst] = useState(true)
    useEffect(async()=>{
        setDate(props.date)
        setNature(props.nature)
        setAdjustmentLogsData(props.adjustmentLogsData)

        // var t_data = {
        //     api_url:api_url+'/getAdjType/b9e1f8a0553623f1:639a3e:17f68ea536b'
        // }
        // await getLogsAdjustmentAPI(t_data)
        // .then(response=>{
        //     const data = response.data.response
        //     var new_data = [];
        //     data.forEach(el=>{
        //         new_data.push({
        //             'label':el.atype_desc,
        //             'atype_code':el.atype_code,
        //             'atype_desc':el.atype_desc,
        //             // 'type_code':el.type_code
        //         })
        //     })
        //     var duplicate = Object.values(data.reduce((c, v) => {
        //         let k = v.atype_code;
        //         c[k] = c[k] || [];
        //         c[k].push(v);
        //         return c;
        //       }, {})).reduce((c, v) => v.length > 1 ? c.concat(v) : c, []);
        //     setAdjustmentLogsData(new_data)
        //     setLoadingAdjst(false)
        // }).catch(error=>{
        //     console.log(error)
        // })
    },[])
    const handleFile = async (e) =>{
        var len = e.target.files.length;
        var i = 0;
        var files = [...fileUpload];
        for(i;i<len;i++){
            var file = e.target.files[i].name;
            var extension = file.split('.').pop();
            if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
                var t_filename = file.split('.');
                var f_filename;
                if(t_filename[0].length>10){
                    f_filename = t_filename[0].substring(0,10)+'...'+t_filename[1];
                }else{
                    f_filename = file;
                }
                files.push({
                    data:await convertTo64(e.target.files[i]),
                    filename:f_filename
                });
                // // setCOCFile(event.target.files[0])
                // // let files = e.target.files;
                
                // let fileReader = new FileReader();
                // fileReader.readAsDataURL(e.target.files[i]);
                
                // fileReader.onload = (event) => {
                //     fileUpload.push({
                //         filename:file,
                //         data:fileReader.result
                //     })
                //     // setFileUpload(fileReader.result)
                //     // setsingleFile(fileReader.result)
                // }
            }else{
                // setFileUpload('')
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    html:'Please upload PDF or Image file.'
                })
            }
        }
        setFileUpload(files)
        console.log(files)
    }
    const handleRemoveFile = (index)=>{
        var t_file = [...fileUpload];
        t_file.splice(index,1);
        setFileUpload(t_file)
    }
    const submitData = (event) =>{
        event.preventDefault()
        if(!fileUpload){
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
                    }else if(fileUpload.length ===0){
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
                            file:fileUpload,
                        }]
                        Swal.fire({
                            icon:'info',
                            title:'Saving data please wait...',
                        })
                        console.log('rec_specific_data',data)
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
    const setReason = (value) => {
        /**
        * Check if reach maximum missed logs Permanent/Casual 3 per month , COS/JO 3 per half month
        */
        /**
         * Check if selected date
         */
        if(value){
            if(value.atype_desc.toUpperCase().includes('MISSED')){
                var data3 = {
                    date:date,
                    day:parseInt(moment(date).format('DD')),
                    month:parseInt(moment(date).format('MM')),
                    monthname:moment(date).format('MMMM'),
                    year:parseInt(moment(date).format('YYYY')),
                    from:new Date(parseInt(moment(date).format('YYYY')),parseInt(moment(date).format('MM'))-1,1),
                    to:new Date(parseInt(moment(date).format('YYYY')),parseInt(moment(date).format('MM')),0),

                }
                console.log(data3)
                checkMaximumMissedLogs(data3)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 500){
                        Swal.fire({
                            icon:'error',
                            title:'Oops...',
                            html:res.data.message
                        })
                        // toast.warning(res.data.message)
                        setAdjustmentType(null)
                    }else{
                        setAdjustmentType(value)

                    }
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                setAdjustmentType(value)
            }
        }
        
        
    }
    return(
        <form onSubmit={submitData}>
            <Grid container spacing={2}>
                <Grid item container sx={{p:matches?1:0,maxHeight:matches?'60vh':'auto',overflowY:matches?'scroll':'auto'}}>
                    <Grid item xs={12} sx={{mb:2}}>
                        <TextField value={moment(date).format('MMMM DD, YYYY')} label ='Date' fullWidth/>
                    </Grid>
                    <Grid item xs={12} sx={{mb:2}}>
                        <TextField value={nature} label ='Nature' fullWidth InputLabelProps={{shrink:true}}/>
                    </Grid>
                    <Grid item xs={12} sx={{position:'relative',mb:2}}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            id="combo-box-demo"
                            options={adjustmentLogsData}
                            getOptionLabel={(option) => option.atype_desc}
                            value = {adjustmentType}
                            onChange={(event,newValue) => {
                                setReason(newValue);
                                }}
                            renderInput={(params) => <TextField {...params} label="Adjustment Type" required/>}
                            // disabled={loadingAdjst}
                        />
                        {/* {
                            loadingAdjst
                            ?
                            <Box sx={{position: 'absolute',top: '13px',right: '5px'}}>
                                <CircularProgress size={30}/>
                            </Box>
                            :
                            null
                        } */}
                        
                    </Grid>
                    <Grid item xs={12} sx={{mb:2}}>
                    <TextField type='time' label = "Specify Rectified Time" InputLabelProps={{shrink:true}} value = {time} onChange = {(value)=>setTime(value.target.value)} fullWidth required/>
                        
                    </Grid>
                    <Grid item xs={12}>
    
                    <label htmlFor={"contained-button-file"} style={{width:'100%'}} required>
                        <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)} multiple/>
                        
                        <Button variant='outlined' color='primary' size='small' component="span"fullWidth sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' }, flex: 1 ,height:55}}> {fileUpload.length ===0?<Tooltip title='No file uploaded'><WarningAmberOutlinedIcon size='small' color='error'/></Tooltip>:''} <AttachFileOutlinedIcon fontSize='small'/>Upload File </Button>
                    </label>
                    {
                        fileUpload.length>0
                        ?
                        <Grid item container sx={{display:'flex',justifyContent:'space-between'}}>
                        {
                            fileUpload.map((row,key)=>
                            <Grid item xs={6} lg={4} sx={{border:'solid 1px #e9e9e9',borderRadius:'20px',pl:1}}>
                            <small style={{display:'flex',justifyContent:'space-between',alignItems:'center', fontSize:'.7rem'}} key={key}>{row.filename} <Tooltip title='Remove file'><IconButton onClick={()=>handleRemoveFile(key)}><DeleteIcon color='error' sx={{fontSize:'15px'}}/></IconButton></Tooltip></small>
                            </Grid>
                            
                        )}
                        </Grid>
                        :
                        null
                    }
                    </Grid>
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
    )
}