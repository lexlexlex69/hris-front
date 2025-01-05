import React,{useEffect, useState} from 'react';
import {Typography,Grid,Paper,IconButton,Tooltip,Button,Fade,Box, TextField} from '@mui/material';
import {deleteTraineeMOVFiles, getTraineeMOVFiles, uploadTraineeMOVFile } from '../TraineeDashboardRequest';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {TableHead} from '@mui/material';
import {green,orange,grey,blue,red} from '@mui/material/colors';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

//Icons
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DeleteIcon from '@mui/icons-material/Delete';

import Swal from 'sweetalert2';
import axios from 'axios';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import moment from 'moment';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TableLoading from '../../../loader/TableLoading';
var business = require('moment-business-days');
const Input = styled('input')({
    display: 'none',
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function EvaluationMOV(props){
    const [data,setData] = useState([]);
    const [reqData,setReqData] = useState([]);
    const [file,setFile] = useState(null);
    const [fileName,setFileName] = useState('');
    const [fileDescription,setFileDescription] = useState('');
    const [hasChange,setHasChange] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(true);
    const [isAlreadyEvaluated,setIsAlreadyEvaluated] = useState(false);
    const [remDays,setRemDays] = useState(0);
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','ppt','pptx','xls','xlsx','doc','docx',
    ])
    useEffect(()=>{
        console.log(props.data)
        var t_data= {
            id:props.data.training_shortlist_id
        }
        getTraineeMOVFiles(t_data)
        .then(res=>{
            console.log(res.data)
            setData(res.data.data)
            setIsAlreadyEvaluated(res.data.evaluated)
            setIsLoadingData(false)
        }).catch(err=>{
            console.log(err)
        })
        
    },[props.data])
    const handleFile = (e) =>{
        setHasChange(true)
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(fileExtensions.includes(extension.toLowerCase())){
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                // data.file = fileReader.result;
                setFile(fileReader.result)
                setFileName(file)
            }
        }else{
            // data2[index].file = '';
            setFile('')
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const viewFile = (id) => {
        viewFileAPI(id)
    }
    const handleRefresh = () => {
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data= {
            id:props.data.training_shortlist_id
        }
        getTraineeMOVFiles(t_data)
        .then(res=>{
            console.log(res.data)
            setData(res.data.data)
            setIsAlreadyEvaluated(res.data.evaluated)
            setIsLoadingData(false)
            Swal.fire({
                icon:'success',
                showConfirmButton:false
            });
            
        }).catch(err=>{
            console.log(err)
            Swal.close();
        })
    }
    const handleRemoveFile = () =>{
        setFile('');
        setFileName('')
    }
    const handleSaveFile = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Uploading file',
            html:'Please wait'
        })
        Swal.showLoading();
        var t_data = {
            file:file,
            description:fileDescription,
            training_details_id:props.data.training_details_id,
            training_shortlist_id:props.data.training_shortlist_id,

        }
        console.log(t_data)
        uploadTraineeMOVFile(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                setData(res.data.data)
                setFile('');
                setFileName('');
                setFileDescription('');
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
        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const handleDeleteFile = (row,id)=>{
        console.log(row)
        Swal.fire({
            icon:'question',
            title:'Confirm delete file ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Deleting file',
                    html:'Please wait...'
                })
                Swal.showLoading()
                /**
                Remove file from JSON base in selectd file_id
                */
                var temp = JSON.parse(data.file_details);
                var new_arr = temp.filter((el)=>{
                    return el.file_id !== id
                });

                // temp.forEach(el=>{
                //     if(el.file_id !== id){
                //         new_arr.push(el);
                //     }
                // })
                var t_data = {
                    id:row.training_shortlist_id,
                    file_details:new_arr
                }
                deleteTraineeMOVFiles(t_data)
                .then(res=>{
                    console.log(res.data)
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
                }).catch(err=>{
                    Swal.fire({
                        icon:'error',
                        title:err
                    })
                })
            }
        })
        
    }
    return(
        <>
            {
                isLoadingData
                ?
                <TableLoading actionButtons={1}/>
                :
                <Fade in>
                    {
                        <Grid container spacing={2}>
                        <Grid item xs={12} sx={{display:'flex',gap:1,flexDirection:'row',justifyContent:'flex-end'}}>
                            <label htmlFor={"contained-mov-file"}>
                                <Input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" id={"contained-mov-file"} type="file" onChange ={(value)=>handleFile(value)} disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') < moment(props.data.period_from,'YYYY-MM-DD').format('YYYY-MM-DD')?true:false}/>
                                <Tooltip title="Upload MOV's" component="span"><IconButton className='custom-iconbutton' color='primary'disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') < moment(props.data.period_from,'YYYY-MM-DD').format('YYYY-MM-DD')?true:false} ><FileUploadOutlinedIcon/></IconButton></Tooltip>
                            </label>
                            <Tooltip title = 'Refresh'><span><IconButton className='custom-iconbutton' onClick = {handleRefresh} sx={{color:blue[800]}}><RefreshOutlinedIcon/></IconButton></span></Tooltip>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
                            {
                                file
                                ?
                                <Box>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',gap:4}}>
                                        <Box sx={{display:'flex',gap:1,flexDirection:'row'}}>
                                            <AttachmentIcon color='info'/>
                                            <Typography>{fileName}</Typography>
                                        </Box>
                                        <Box>
                                            <Tooltip title='Remove File'><IconButton color='error' onClick={handleRemoveFile}><DeleteIcon/></IconButton></Tooltip>
                                        </Box>
                                    </Box>
                                <form onSubmit={handleSaveFile}>
                                <Box sx={{display:'flex',gap:1}}>
                                    <TextField label='File description' value={fileDescription} onChange={(val)=>setFileDescription(val.target.value)} required/>
                                    <Button variant='contained' type='submit'>Save</Button>
                                </Box>
                                </form>
                                </Box>
                                :
                                null
                            }
                            
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    File Description
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    Actions
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.length === 0
                                                ?
                                                null
                                                :
                                                JSON.parse(data.file_details).map((item,key) =>
                                                        <TableRow key={key}>
                                                            <StyledTableCell>
                                                                {item.description}
                                                            </StyledTableCell>
                                                            <StyledTableCell align='center'>
                                                                <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                                    <Tooltip title='View File'><IconButton color='info' className='custom-iconbutton' onClick={()=>viewFile(item.file_id)}><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                                    <Tooltip title='Delete File'><span><IconButton color='error' className='custom-iconbutton' onClick={()=>handleDeleteFile(data,item.file_id)} disabled={isAlreadyEvaluated}><DeleteIcon/></IconButton></span></Tooltip>
                                                                </Box>
                                                                
                                                            </StyledTableCell>
                                                        </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Paper>
                        </Grid>
                        </Grid>
                    }
                    
                </Fade>
            }
        </>
        

    )
}