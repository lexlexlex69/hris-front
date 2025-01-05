import React,{useEffect, useState} from 'react';
import {Typography,Grid,Paper,IconButton,Tooltip,Button,Fade,Box} from '@mui/material';
import { getMyRqmt, getMyTrainings, updateRqmt, updateRqmtTrainingApp } from '../TraineeDashboardRequest';
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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';


import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Swal from 'sweetalert2';
import axios from 'axios';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import moment from 'moment';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TableLoading from '../../../loader/TableLoading';
import FullModal from '../../../custommodal/FullModal';
import AddDefaultRequirements from './CustomComponents/AddDefaultRequirements';
import LargeModal from '../../../custommodal/LargeModal';
import DefaultRequirementsPreview from './CustomComponents/DefaultRequirementsPreview';
import UpdateLAPSAP from './CustomComponents/UpdateLAPSAP';
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
export default function Requirements(props){
    const [data,setData] = useState([]);
    const [reqData,setReqData] = useState([]);
    const [trainingAppFile,setTrainingAppFile] = useState(null);
    const [hasChange,setHasChange] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(true);
    const [remDays,setRemDays] = useState(0);
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','ppt','pptx','xls','xlsx','doc','docx',
    ])
    const [deptHead,setDeptHead] = useState()
    useEffect(()=>{
        console.log(props.data)
        var data2= {
            id:props.data.training_shortlist_id
        }
        getMyRqmt(data2)
        .then(res=>{
            console.log(res.data)
            setDeptHead(res.data.dept_head)
            setData(res.data.opt_rqmt)
            setReqData(res.data.req_rqmt)
            setIsLoadingData(false)
            var temp = res.data.req_rqmt.period_to
            var t_deadline = moment(temp,'YYYY-MM-DD').businessAdd(10)._d;

            // var temp2 = moment(t_deadline,'YYYY-MM-DD').businessDiff(moment(new Date(),'YYYY-MM-DD'))
            var temp2 = moment(moment(t_deadline,'YYYY-MM-DD')).diff(moment(new Date()).format('YYYY-MM-DD'),'days')
            console.log(temp2)

            setRemDays(temp2)
        }).catch(err=>{
            console.log(err)
        })
    },[props.data])
    const handleFile = (index,e) =>{
        setHasChange(true)
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        let data2 = [...data];
        if(fileExtensions.includes(extension.toLowerCase())){
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                data2[index].file = fileReader.result;
                setData(data2)
            }
        }else{
            data2[index].file = '';
            setData(data2)
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const handleFileTrainingApp = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(fileExtensions.includes(extension.toLowerCase())){
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setTrainingAppFile(fileReader.result)
            }
        }else{
            setTrainingAppFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const handleSave = (data,index,filedata)=>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText:`Don't Save` 
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Saving data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2 = {
                    trainee_rqmts_id:data.trainee_rqmts_id,
                    training_shortlist_id:props.data.training_shortlist_id,
                    filedata:filedata,
                    index:index
                }
                console.log(data2)
                // Swal.close();
                updateRqmt(data2)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status===200){
                        setData(res.data.data.opt_rqmt)
                        setReqData(res.data.data.req_rqmt)
                        // props.updateRqmt()
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
                        // setData(res.data.data)

                    }

                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                })
            }
          })
        
    }
    const handleSaveTrainingAppFile = (data)=>{
        
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText:`Don't Save` 
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Saving data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2 = {
                    filedata:trainingAppFile,
                    training_shortlist_id:data.training_shortlist_id,
                    trainee_app_file_id:data.trainee_app_file_id,
                }
                console.log(data2)
                // Swal.close();
                updateRqmtTrainingApp(data2)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status===200){
                        setReqData(res.data.data.req_rqmt)
                        // props.updateRqmt()
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
                        // setData(res.data.data)

                    }

                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                })
            }
          })
    }
    const viewFile = (id,row_data) => {
        // console.log(row_data)
        viewFileAPI(id,row_data.training_app)
    }
    const handleRefresh = ()=>{
        // console.log(props.data)
        // props.refreshRqmt()
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading()
        var data2= {
            id:props.data.training_shortlist_id
        }
        getMyRqmt(data2)
        .then(res=>{
            console.log(res.data)
            setData(res.data.opt_rqmt)
            setReqData(res.data.req_rqmt)
            setIsLoadingData(false)
            var temp = res.data.req_rqmt.period_to
            var t_deadline = moment(temp,'YYYY-MM-DD').businessAdd(5)._d;

            // var temp2 = moment(t_deadline,'YYYY-MM-DD').businessDiff(moment(new Date(),'YYYY-MM-DD'))
            var temp2 = moment(moment(t_deadline,'YYYY-MM-DD')).diff(moment(new Date()).format('YYYY-MM-DD'),'days')
            console.log(temp2)

            setRemDays(temp2)
            Swal.fire({
                icon:'success',
                timer:1000,
                showConfirmButton:false
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    const [openUpdateTrainingApp,setOpenUpdateTrainingApp] = useState(false)
    const handleUpdateTrainingApp = () =>{
        setOpenUpdateTrainingApp(true)
    }
    const [openViewTrainingApp,setOpenViewTrainingApp] = useState(false)
    const handleViewTrainingApp = () =>{
        setOpenViewTrainingApp(true)
    }
    return(
        <>
            {
                isLoadingData
                ?
                <TableLoading actionButtons={1}/>
                :
                data.length === 0 && reqData.length === 0
                ?
                <Alert severity="info">No requirements available.</Alert>
                :
                <Fade in>
                    {
                        <Grid container spacing={2}>
                            {
                                remDays<=0
                                ?
                                <Grid item xs={12}>
                                    <UpdateLAPSAP reqData = {reqData} setReqData = {setReqData}/>
                                </Grid>
                                :
                                <>
                                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                {/* <Tooltip title = 'Refresh'><span><IconButton className='custom-iconbutton' onClick = {handleRefresh} sx={{color:blue[800]}}><RefreshOutlinedIcon/></IconButton></span></Tooltip> */}
                                </Grid>
                                <Grid item xs={12}>
                                <Paper>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>
                                                        Training App
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Status
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Remarks
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Submission deadline
                                                    </StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        Action
                                                    </StyledTableCell>
                                                </TableRow>
                                                
                                            </TableHead>
                                            <TableBody>
                                                <TableRow hover={remDays <=0 ?false:true} sx={{background:remDays <=0 ?red[500]:'auto'}}>
                                                    <StyledTableCell sx={{color:remDays <=0 ?'#fff':'auto'}}>
                                                        {reqData.type} *
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{color:remDays <=0 ?'#fff':'auto'}}>
                                                        {reqData.verified?<span style={{color:green[800]}}>VERIFIED</span>:''}
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{color:remDays <=0 ?'#fff':'auto'}}>
                                                        {reqData.remarks}
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{color:remDays <=0 ?'#fff':'auto'}}>
                                                        {
                                                            remDays <=0
                                                            ?
                                                            <em>submission cut off</em>
                                                            :
                                                            remDays>1
                                                            ?
                                                            <em>{moment(moment(reqData.period_to,'YYYY-MM-DD').businessAdd(10)._d).format('MMMM DD, YYYY')} ({remDays} days left)</em>
                                                            :
                                                            <em>{moment(moment(reqData.period_to,'YYYY-MM-DD').businessAdd(10)._d).format('MMMM DD, YYYY')} ({remDays} day left)</em>


                                                        }
                                                    </StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                    
                                                    {
                                                    remDays <=0
                                                    ?
                                                    null
                                                    :
                                                    reqData.verified
                                                    ?
                                                        <Tooltip title={`View ${reqData.type}`} component="span"><IconButton className='custom-iconbutton' color='primary' onClick={handleViewTrainingApp}><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                    :
                                                    <>
                                                    {
                                                        reqData.name
                                                        ?
                                                        <Box sx={{display:'flex',justifyContent:'center',gap:1}}>
                                                            {
                                                                reqData.dept_approved
                                                                ?
                                                                null
                                                                :
                                                                <Tooltip title={`Update ${reqData.type}`} component="span"><Button variant='contained' className='custom-roundbutton' color='success' disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') < moment(props.data.period_to,'YYYY-MM-DD').format('YYYY-MM-DD')?true:false} onClick={handleUpdateTrainingApp} startIcon={<EditIcon/>}>Update</Button></Tooltip>
                                                            }

                                                            <Tooltip title={`View ${reqData.type}`} component="span"><Button variant='contained' className='custom-roundbutton' color='primary' disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') < moment(props.data.period_to,'YYYY-MM-DD').format('YYYY-MM-DD')?true:false} onClick={handleViewTrainingApp} startIcon={<ContentPasteSearchOutlinedIcon/>}>View</Button></Tooltip>
                                                        </Box>
                                                        :
                                                        <Tooltip title={`Add ${reqData.type}`}><Button variant='outlined' color='success' disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') >= moment(props.data.period_to,'YYYY-MM-DD').format('YYYY-MM-DD')?false:true} onClick={handleUpdateTrainingApp} startIcon={<AddIcon/>}> Add</Button></Tooltip>
                                                    }
                                                    <FullModal open={openUpdateTrainingApp} close = {()=>setOpenUpdateTrainingApp(false)} title={`Updating ${reqData.type}`}>
                                                        <AddDefaultRequirements data={props.data} close = {()=>setOpenUpdateTrainingApp(false)} type={reqData.training_app} reqData = {reqData} setReqData = {setReqData} deptHead={deptHead}/>
                                                    </FullModal>
                                                    </>
                                                    
                                                    }
                                                    {/* &nbsp;
                                                    {
                                                    remDays <=0
                                                    ?
                                                    null
                                                    :
                                                        reqData.file_id !==null
                                                        ?
                                                        <Tooltip title='View Uploaded Requirements'><IconButton className='custom-iconbutton' onClick ={()=>viewFile(reqData.file_id,reqData)} sx={{color:blue[500]}}><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                        :
                                                        null
                                                    }
                                                    &nbsp;
                                                    {
                                                    remDays <=0
                                                    ?
                                                    null
                                                    :
                                                    <Tooltip title = 'Save'><span><IconButton color='success' onClick = {()=>handleSaveTrainingAppFile(reqData)} disabled={trainingAppFile === null?true:false} className='custom-iconbutton'><SaveOutlinedIcon/></IconButton></span></Tooltip>
                                                    } */}
                                                    </StyledTableCell>
                                                </TableRow>
                                                {
                                                    data.length !==0
                                                    ?
                                                    data.map((row,key)=>
                                                        <TableRow key = {key} hover>
                                                            <StyledTableCell>
                                                                {row.rqmt_name}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.verified?<span style={{color:green[800]}}>VERIFIED</span>:''}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {row.remarks}
                                                            </StyledTableCell>
                                                            <StyledTableCell/>
                                                            <StyledTableCell align='center'>
                                                            {
                                                            row.verified
                                                            ?
                                                            ''
                                                            :
                                                            <label htmlFor={"contained-rqmt-file"+key}>
                                                                <Input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" id={"contained-rqmt-file"+key} type="file" onChange ={(value)=>handleFile(key,value)} disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') < moment(props.data.period_from,'YYYY-MM-DD').format('YYYY-MM-DD')?true:false}/>
                                                                <Tooltip title='Upload Requirements' component="span"><IconButton className='custom-iconbutton' color='primary'disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') < moment(props.data.period_from,'YYYY-MM-DD').format('YYYY-MM-DD')?true:false} ><FileUploadOutlinedIcon/></IconButton></Tooltip>
                                                            </label>
                                                            
                                                            }
                                                            &nbsp;
                                                            {
                                                                row.file_id !==null
                                                                ?
                                                                <Tooltip title='View Uploaded Requirements'><IconButton className='custom-iconbutton' onClick ={()=>viewFile(row.file_id,row)} sx={{color:blue[500]}}><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                                :
                                                                null
                                                            }
                                                            {/* {
                                                                row.file !==null
                                                                ?
                                                                <TaskOutlinedIcon sx={{color:blue[500]}}/>
                                                                :
                                                                ''
                                                            } */}
                                                            &nbsp;
                                                            <Tooltip title = 'Save'><span><IconButton color='success' onClick = {()=>handleSave(row,key,row.file)} disabled={row.file === null?true:false} className='custom-iconbutton'><SaveOutlinedIcon/></IconButton></span></Tooltip>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    )
                                                    // data.map((row,key)=>
                                                    // <TableRow key={key}>
                                                    //     <TableCell>
                                                    //     {row.rqmt}
                                                    //     </TableCell>
                                                    //     <TableCell>
                                                    //     {row.verified? 'Verified':''}
                                                    //     </TableCell>
                                                    //     <TableCell>
                                                    //     {row.remarks}
                                                    //     </TableCell>
                                                    //     <TableCell align='center'>
                                                    //     {
                                                    //         row.verified
                                                    //         ?
                                                    //         ''
                                                    //         :
                                                    //         <label htmlFor={"contained-rqmt-file"+key}>
                                                    //             <Input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" id={"contained-rqmt-file"+key} type="file" onChange ={(value)=>handleFile(key,value)}/>
                                                    //             <Tooltip title='Upload Requirements' component="span"><IconButton className='custom-iconbutton' color='primary' ><FileUploadOutlinedIcon/></IconButton></Tooltip>
                                                    //         </label>
                                                            
                                                    //     }
                                                    //     &nbsp;
                                                    //     {
                                                    //         row.file_id !==null
                                                    //         ?
                                                    //         <Tooltip title='View Uploaded Requirements'><IconButton className='custom-iconbutton' onClick ={()=>viewFile(row.file_id,row)} sx={{color:blue[500]}}><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                    //         :
                                                    //         null
                                                    //     }
                                                    //     {/* {
                                                    //         row.file !==null
                                                    //         ?
                                                    //         <TaskOutlinedIcon sx={{color:blue[500]}}/>
                                                    //         :
                                                    //         ''
                                                    //     } */}
                                                    //     &nbsp;
                                                    //     <Tooltip title = 'Save'><span><IconButton color='success' onClick = {()=>handleSave(key,row.file)} disabled={row.file === null?true:false} className='custom-iconbutton'><SaveOutlinedIcon/></IconButton></span></Tooltip>
                                                    //     </TableCell>
                                                    // </TableRow>
                                                    // )
                                                    :
                                                    null
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                                </Grid>
                                </>
                            }
                        <FullModal open ={openViewTrainingApp} close = {()=>setOpenViewTrainingApp(false)} title={`Viewing ${reqData.type}`}>
                            <DefaultRequirementsPreview reqData = {reqData}/>
                        </FullModal>
                        </Grid>
                    }
                    
                </Fade>
            }
        </>
        

    )
}