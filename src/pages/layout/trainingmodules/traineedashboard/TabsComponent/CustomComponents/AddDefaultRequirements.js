import React, { useEffect, useRef, useState } from "react";
import {Box,Grid,Typography,Button,TextField,Paper,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,Fade} from '@mui/material';
import LetterHeadHR from "../../../../forms/letterhead/LetterHeadHR";
import { createTheme, ThemeProvider,styled } from '@mui/material/styles';
import { formatExtName, formatMiddlename, formatTwoDateToText } from "../../../../customstring/CustomString";
import moment from "moment";
//Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { tableCellClasses } from '@mui/material/TableCell';
import {blue,red} from '@mui/material/colors';
import { addTrainingAppRequirements } from "../../TraineeDashboardRequest";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { APILoading } from "../../../../apiresponse/APIResponse";

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
const AddDefaultRequirements = (props) =>{
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
    const [commentsSuggestions,setCommentsSuggestions] = useState('')
    const [data,setData] = useState([])
    useEffect(()=>{
        setData(JSON.parse(props.reqData.details)?.length>0?JSON.parse(props.reqData.details):[
            {
                learning_acquired:'',
                plans_activities:'',
                target_date:'',
                mov:'',
                actual_accomplishment:'',
                date_accomplishment:'',
            }
        ])
        setReviewedBy(props.reqData.reviewed_by)
        setNotedBy(props.deptHead.office_division_assign)
        setToEnhance(props.reqData.to_enhance_develop)
        setCommentsSuggestions(props.reqData.comments_suggestions)
    },[])
    const [preparedBy,setPreparedBy] = useState(props.data.fname+' '+formatMiddlename(props.data.mname)+ ' '+props.data.lname+' '+formatExtName(props.data.extname));
    const [reviewedBy,setReviewedBy] = useState('');
    const [notedBy,setNotedBy] = useState('');

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
        })
        setData(temp)
    }
    const deleteRow = (index) => {
        let temp = [...data];
        temp.splice(index,1);
        setData(temp)
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        try{
            if(data.length>0){
                // APILoading('info','Submitting update','Please wait...')
                let data2= {
                    training_details_id:props.data.training_details_id,
                    training_title:props.data.training_name,
                    training_date:formatTwoDateToText(props.data.period_from,props.data.period_to),
                    name:props.data.fname+' '+formatMiddlename(props.data.mname)+ ' '+props.data.lname+' '+formatExtName(props.data.extname),
                    position_designation:props.data.position_name,
                    office:props.data.dept_title,
                    details:data,
                    to_enhance_develop:toEnhance,
                    reviewed_by:reviewedBy,
                    noted_by:notedBy.toUpperCase(),
                    noted_by_pos:props.deptHead.position,
                    emp_id:props.data.emp_id,
                    comments_suggestions:commentsSuggestions
                }
                const id = toast.loading('Submitting data')
                const res = await addTrainingAppRequirements(data2)
                if(res.data.status === 200){
                    toast.update(id,
                        {
                        render:res.data.message,
                        type:'success',
                        isLoading:false,
                        closeOnClick: true,
                        autoClose:true
                    })
                    props.setReqData(res.data.data)
                    props.close()
                    // toast.success(res.data.message)
                    
                    // Swal.fire({
                    //     icon:'success',
                    //     title:res.data.message
                    // })
                }else if(res.data.status===300){
                    toast.update(id,
                        {
                        render:res.data.message,
                        type:'warning',
                        isLoading:false,
                        closeOnClick: true,
                        autoClose:true
                    })
                    props.setReqData(res.data.data)
                    props.close()
                }else{
                    toast.update(id,
                        {
                        render:res.data.message,
                        type:'warning',
                        isLoading:false,
                        closeOnClick: true,
                        autoClose:true
                    })                // Swal.fire({
                    //     icon:'warning',
                    //     title:res.data.message
                    // })
                }
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    text:'Please input atleast 1 target'
                })
            }
            
        }catch(err){
            toast(err)
        }
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
                            <TextField label='Training Title' defaultValue={props.data.training_name} InputProps={{readOnly:true}} fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Training Date' defaultValue={`${formatTwoDateToText(props.data.period_from,props.data.period_to)}`} InputProps={{readOnly:true}} fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Name' defaultValue={`${props.data.fname} ${formatMiddlename(props.data.mname)} ${props.data.lname} ${formatExtName(props.data.extname)}`} InputProps={{readOnly:true}} fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Office' defaultValue={props.data.dept_title} InputProps={{readOnly:true}} fullWidth/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Specific Competency to develop/enhance:' value = {toEnhance} onChange={(val)=>setToEnhance(val.target.value)} fullWidth required multiline maxRows={2}/>
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
                                                    <TextField value={item.mov} onChange={(val)=>handleChange(key,'mov',val)} multiline maxRows={3} fullWidth/>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <TextField value={item.actual_accomplishment} onChange={(val)=>handleChange(key,'actual_accomplishment',val)} multiline maxRows={3} fullWidth/>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <TextField value={item.date_accomplishment} onChange={(val)=>handleChange(key,'date_accomplishment',val)} multiline maxRows={3} fullWidth/>
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
                                <TextField label='Immediate Supervisor’s Remarks/Comments/Suggestions:' value={commentsSuggestions} onChange={(val)=>setCommentsSuggestions(val.target.value)} fullWidth/>
                            </Grid>
                            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',flexDirection:matches?'column':'row'}}>
                                <TextField label='Prepared by (Participant):' defaultValue ={preparedBy} InputProps={{readOnly:true}} sx={{width:matches?'100%':'30%'}}/>
                                <TextField label='Reviewed by (Immediate Supervisor):' value ={reviewedBy} onChange={(val)=>setReviewedBy(val.target.value)} multiline maxRows={4} required sx={{width:matches?'100%':'30%'}}/>
                                <TextField label='Noted by (Department Head):' defaultValue ={notedBy} InputProps={{readOnly:true}} multiline maxRows={4} required sx={{width:matches?'100%':'30%'}}/>
                            </Grid>
                        </Grid>
                        <Box sx={{display:'flex',justifyContent:'flex-end',mb:1,mt:1}}>
                            <Button className="custom-roundbutton" variant="contained" type="submit" color='success'>Submit</Button>
                        </Box>
                </Grid>
            </Grid>
        </Box>
        </form>
    )
}
export default AddDefaultRequirements;