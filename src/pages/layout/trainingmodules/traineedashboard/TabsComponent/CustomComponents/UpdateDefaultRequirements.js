import React, { useEffect, useRef, useState } from "react";
import {Box,Grid,Typography,Button,TextField,Paper,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,Fade,Tooltip,IconButton, Checkbox, FormControlLabel} from '@mui/material';
import LetterHeadHR from "../../../../forms/letterhead/LetterHeadHR";
import { createTheme, ThemeProvider,styled } from '@mui/material/styles';
import { formatExtName, formatMiddlename } from "../../../../customstring/CustomString";
import moment from "moment";
//Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import HelpIcon from '@mui/icons-material/Help';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { tableCellClasses } from '@mui/material/TableCell';
import {blue,red} from '@mui/material/colors';
import { addTrainingAppRequirements, updateFinalLAPSAP } from "../../TraineeDashboardRequest";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";
import { convertTo64 } from "../../../../selfserviceportal/onlinedtr/convertfile/ConvertFile";
import { handleMultipleFile } from "../../../../customprocessdata/CustomProcessData";
const Input = styled('input')({
    display: 'none',
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[900],
        color: theme.palette.common.white,
        fontSize: 13,
        padding:10,
        textAlign:'center'
        // fontFamily:'latoreg'
      
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding:13,
        // fontFamily:'latoreg'
    
    },
  }));
const UpdateDefaultRequirements = (props) =>{
    console.log(props)
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const themeHeader = createTheme({
        typography: {
            fontFamily: 'gotham',
        }
    });
    
    const [toEnhance,setToEnhance] = useState('')
    const [data,setData] = useState([])
    const [fileExtensions,setFileExtensions] = useState(['pdf','png','jpeg','jpg'])
    useEffect(()=>{
        let temp = JSON.parse(props.reqData.details)?.length>0?JSON.parse(props.reqData.details):[
            {
                learning_acquired:'',
                plans_activities:'',
                target_date:'',
                mov:'',
                actual_accomplishment:'',
                date_accomplishment:''
            }
        ]
        temp.forEach(el=>{
            el.file_upload=[]
        })
        setData(temp)
        setReviewedBy(props.reqData.reviewed_by)
        setNotedBy(props.reqData.noted_by)
        setToEnhance(props.reqData.to_enhance_develop)
    },[])
    const [remarks,setRemarks] = useState('');
    const [preparedBy,setPreparedBy] = useState(props.reqData.name);
    const [reviewedBy,setReviewedBy] = useState('');
    const [notedBy,setNotedBy] = useState('');
    const [fileUpload,setFileUpload] = useState([])
    const [isFinal,setIsFinal] = useState(true)

    const handleChange = (index,id,val)=>{
        let temp = [...data];
        temp[index][id] = val.target.value;
        setData(temp)
    }
    const addRow = () =>{
        let temp = [...data];
        temp.push({
            learning_acquired:'',
            plans_activities:'',
            target_date:'',
            mov:'',
            actual_accomplishment:'',
            date_accomplishment:'',
            file_upload:[]
        })
        setData(temp)
    }
    const deleteRow = (index) => {
        let temp = [...data];
        temp.splice(index,1);
        setData(temp)
    }
    const handleSubmit = async (e,is_final)=>{
        e.preventDefault();
        if(isFinal){
            Swal.fire({
                icon:'question',
                title:'Confirmation',
                html:'Submit LAP/SAP as Final?',
                cancelButtonText:'Cancel',
                showCancelButton:true,
                confirmButtonText:'Yes'
            }).then(res=>{
                if(res.isConfirmed){
                    confirmSubmit()
                }
            })
        }else{
            confirmSubmit()
        }
        
    } 
    const [submitLoading,setSubmitLoading] = useState(false)
    const confirmSubmit = async()=>{
        setSubmitLoading(true)
        const id = toast.loading('Submitting data')
        
        try{
            // APILoading('info','Submitting update','Please wait...')
            let data2= {
                training_details_id:props.data.training_details_id,
                training_shortlist_id:props.data.training_shortlist_id,
                training_title:props.data.training_title,
                training_date:moment(props.data?.period_from).format('MMMM DD, YYYY')+' to '+moment(props.data?.period_to).format('MMMM DD, YYYY'),
                name:props.data.name,
                position_designation:props.data.position_designation,
                office:props.data.office,
                details:data,
                to_enhance_develop:toEnhance,
                remarks:remarks,
                reviewed_by:reviewedBy,
                noted_by:notedBy,
                noted_by_position:props.data.noted_by_position,
                emp_id:props.data.emp_id,
                type:props.data.type,
                is_final:isFinal
            }
            console.log(data2)
        
            console.log(props.data)
            const res = await updateFinalLAPSAP(data2)
            console.log(res.data)
            if(res.data.status === 200){
                props.close()

                toast.update(id,
                    {
                    render:res.data.message,
                    type:'success',
                    isLoading:false,
                    closeOnClick: true,
                    autoClose:true
                })
                props.setReqData(res.data.data)
            }else{
                toast.update(id,
                    {
                    render:res.data.message,
                    type:'warning',
                    isLoading:false,
                    closeOnClick: true,
                    autoClose:true
                })
            }
        }catch(err){
            toast.update(id,
                {
                render:err,
                type:'error',
                isLoading:false,
                closeOnClick: true,
                autoClose:true
            })
        }
    }
    const handleFile = async (e,index) =>{
        let temp = [...data];
        temp[index].file_upload = await handleMultipleFile(e,fileExtensions,temp[index].file_upload);
        
        setData(temp)
    }
    const handleRemoveFile = (index,index2)=>{
        let temp = [...data];
        let t_file = [...temp[index].file_upload];
        t_file.splice(index2,1);
        temp[index].file_upload = t_file;
        setData(temp)
    }
    return (
        <form onSubmit={handleSubmit}>
        <Box sx={{m:2,p:1,maxHeight:'78vh',overflowY:'scroll'}}>
            <Grid container spacing={1}>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
                    <Typography>LEARNING/SKILLS ACTION PLAN</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label='Training Title' defaultValue={props.reqData.training_title} InputProps={{readOnly:true}} fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Training Date' defaultValue={`${moment(props.reqData?.period_from).format('MMMM DD, YYYY')} to ${moment(props.reqData?.period_to).format('MMMM DD, YYYY')}`} InputProps={{readOnly:true}} fullWidth/>
                            {/* <TextField label='Training Date' defaultValue={`${moment(props.reqData?.period_from).format('MMMM DD, YYYY')} to ${moment(props.reqData?.period_to).format('MMMM DD, YYYY')}`} InputProps={{readOnly:true}} fullWidth/> */}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Name' defaultValue={`${props.reqData.name}`} InputProps={{readOnly:true}} fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Office' defaultValue={props.reqData.office} InputProps={{readOnly:true}} fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Specific Competency to develop/enhance:' value = {toEnhance} onChange={(val)=>setToEnhance(val.target.value)} fullWidth/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                        <Paper sx={{mb:1}}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            LEARNINGS ACQUIRED
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            PLANS AND/OR ACTIVITIES
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            TARGET DATE/TIMELINE <br/> (within 3 months after the conduct of intervention)
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            MEANS OF VERIFICATION <br/>(MOV)
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            ACTUAL ACCOMPLISHMENT
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            DATE OF ACCOMPLISHMENT
                                        </StyledTableCell>
                                        {
                                            data.length>1
                                            ?
                                            <StyledTableCell>
                                            </StyledTableCell>
                                            :
                                            null
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.map((item,key)=>
                                            <TableRow hover key={key}>
                                                <StyledTableCell>
                                                    <TextField color='error' label=' ' value={item.learning_acquired} onChange={(val)=>handleChange(key,'learning_acquired',val)} multiline maxRows={3} fullWidth required placeholder="required"/>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <TextField color='error' label=' ' value={item.plans_activities} onChange={(val)=>handleChange(key,'plans_activities',val)} multiline maxRows={3} fullWidth required placeholder="required"/>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <TextField color='error' label=' ' value={item.target_date} onChange={(val)=>handleChange(key,'target_date',val)} multiline maxRows={3} fullWidth required placeholder="required"/>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <TextField value={item.mov} onChange={(val)=>handleChange(key,'mov',val)} multiline maxRows={3} fullWidth sx={{mb:1}}/>
                                                    <label htmlFor={`contained-rqmt-file-${key}`} style={{width:'100%'}}>
                                                         <Input accept="image/*,.pdf" id={`contained-rqmt-file-${key}`} type="file" onChange ={(e)=>handleFile(e,key)} multiple/>
                                                         <Tooltip title={`Upload File`} component="span"><Button variant='outlined'color='primary' fullWidth><FileUploadOutlinedIcon/></Button></Tooltip>
                                                    </label>
                                                    {
                                                        item.file_upload.length>0
                                                        ?
                                                        <Grid item container sx={{display:'flex',justifyContent:'space-between'}}>
                                                        {
                                                            item.file_upload.map((row,key2)=>
                                                            <Grid item xs={6} lg={4} sx={{border:'solid 1px #e9e9e9',borderRadius:'20px',pl:1}}>
                                                            <small style={{display:'flex',justifyContent:'space-between',alignItems:'center', fontSize:'.7rem'}} key={key2}>{row.filename} <Tooltip title='Remove file'><IconButton onClick={()=>handleRemoveFile(key,key2)}><DeleteIcon color='error' sx={{fontSize:'15px'}}/></IconButton></Tooltip></small>
                                                            </Grid>
                                                            
                                                        )}
                                                        </Grid>
                                                        :
                                                        null
                                                    }
                                                    
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <TextField value={item.actual_accomplishment} onChange={(val)=>handleChange(key,'actual_accomplishment',val)} multiline maxRows={3} fullWidth/>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <TextField type="date" value={item.date_accomplishment} onChange={(val)=>handleChange(key,'date_accomplishment',val)} fullWidth/>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {
                                                        data.length>1
                                                        ?
                                                        <Button color="error" variant="outlined" startIcon={<DeleteIcon/>} onClick={()=>deleteRow(key)} size="small">Delete row</Button>
                                                        :
                                                        null
                                                    }
                                                    
                                                </StyledTableCell>
                                            </TableRow>

                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </Paper>
                        <Grid item xs={12}>
                            <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                                <Button variant="contained" startIcon={<AddIcon/>} onClick={addRow}>Add Row</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} container spacing={2} sx={{mt:1}}>
                            <Grid item xs={12}>
                                <TextField label='Immediate Supervisor’s Remarks/Comments/Suggestions:' value ={remarks} onChange={(val)=>setRemarks(val.target.value)} fullWidth multiline maxRows={4}/>
                            </Grid>
                            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',flexDirection:matches?'column':'row'}}>
                                <TextField label='Prepared by (Participant):' defaultValue ={preparedBy} InputProps={{readOnly:true}} sx={{width:matches?'100%':'30%'}}/>
                                <TextField label={<Box>Reviewed by (Immediate Supervisor): <Tooltip title='Encode position name inside parenthesis "()"'><HelpIcon color="info"/></Tooltip></Box>} value ={reviewedBy} onChange={(val)=>setReviewedBy(val.target.value)} multiline maxRows={4} required sx={{width:matches?'100%':'30%'}}/>
                                <TextField label='Noted by (Department Head):' defaultValue ={notedBy} InputProps={{readOnly:true}} multiline maxRows={4} required sx={{width:matches?'100%':'30%'}}/>
                            </Grid>
                        </Grid>
                        <Box sx={{display:'flex',justifyContent:'flex-end',mb:1,mt:1}}>
                            <FormControlLabel control={<Checkbox check={isFinal} onChange = {()=>setIsFinal(!isFinal)}/>} label="Save as draft" />
                            <Button className="custom-roundbutton" variant="contained" type="submit" color='success' disabled={submitLoading?true:false}>Submit Update</Button>
                        </Box>
                </Grid>
            </Grid>
        </Box>
        </form>
    )
}
export default UpdateDefaultRequirements;