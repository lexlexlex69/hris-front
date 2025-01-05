import { Box, Button, Grid, Paper, TextField, Tooltip, CircularProgress, Typography, IconButton  } from "@mui/material";
import React, { useEffect,useState } from "react";
import Swal from "sweetalert2";
import { getInfoNotAttendedTraining, postNotAttendedTraining } from "../TraineeDashboardRequest";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AttachmentIcon from '@mui/icons-material/Attachment';

import { customSetFile } from "../../../customprocessdata/CustomProcessData";
import { APILoading } from "../../../apiresponse/APIResponse";
import { grey } from "@mui/material/colors";
import { viewFileAPI } from "../../../../../viewfile/ViewFileRequest";
const Input = styled('input')({
    display: 'none',
});
export default function NotAttendedTrainingModal(props){
    const [data,setData] = useState([])
    const [hasUploaded,setHasUploaded] = useState(false)
    const [loading,setLoading] = useState(true)
    const [reason,setReason] = useState('')
    const [fileData,setFileData] = useState(null)
    useEffect(async()=>{
        try{
            var t_data = {
                id:props.id
            }
            const res = await getInfoNotAttendedTraining(t_data)
            console.log(res.data)
            if(res.data.data){
                setHasUploaded(true)
                setLoading(false)
                setData(res.data.data)


            }else{
                setHasUploaded(false)
                setData(res.data.data)
                setLoading(false)
            }
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
    },[])
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','doc','docx',
    ])
    const handleSetFile = (e) => {
        // console.log(await customSetFile(e,fileExtensions))
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        // console.log(file)
        if(fileExtensions.includes(extension.toLowerCase())){
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setFileData(fileReader.result)
            }
        }else{
            setFileData(null);
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF | DOC | Image file.'
            })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            APILoading('info','Submitting data','Please wait...')
            var t_data = {
                reason:reason,
                file:fileData,
                id:props.id
            }
            const res = await postNotAttendedTraining(t_data)
            console.log(res.data)
            if(res.data.status === 200){
                props.close();
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
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
    }
    return(
        <Box sx={{p:1}}>
            <Grid container>
                {
                    loading
                    ?
                    <Grid item xs={12}>
                        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            <CircularProgress/>
                            <Typography>Loading info. Please wait...</Typography>
                        </Box>
                    </Grid>
                    
                    :
                        hasUploaded
                        ?
                        <Grid item xs={12}>
                            <Typography sx={{color:grey[700],fontStyle:'italic',mb:1}}>Uploaded info:</Typography>
                            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                <TextField label='Reason' value = {data.reason} InputProps={{readOnly:true}} fullWidth/>
                                <Tooltip title='View uploaded file'><IconButton className="custom-iconbutton" onClick={()=>viewFileAPI(data.file_id)}><AttachmentIcon/></IconButton></Tooltip>
                            </Box>

                        </Grid>
                        :
                        <Grid item xs={12}>
                        <form onSubmit={handleSubmit}>
                            <TextField label ='Reason' value = {reason} onChange={(val)=>setReason(val.target.value)}fullWidth required/>
                            <Box sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                                <label htmlFor={"contained-attachment-file"}>
                                    <Input accept="image/*,.pdf,.doc,.docx" id={"contained-attachment-file"} type="file" onChange = {(value)=>handleSetFile(value)}/>
                                    <Tooltip title='Upload Attachment' component="span"><Button variant='outlined' color='primary' className="custom-roundbutton" startIcon={<AttachFileIcon/>}>Upload File</Button></Tooltip>
                                </label>
                                <Button variant="contained" color="success" className="custom-roundbutton" type="submit" disabled = {fileData ? false:true}>
                                    Submit
                                </Button>
                            </Box>
                        </form>
                        
                        </Grid>
                }
                
            </Grid>
        </Box>
    )
}