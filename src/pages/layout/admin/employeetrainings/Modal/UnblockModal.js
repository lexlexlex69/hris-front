import React,{useState} from 'react';
import {Grid,Button,IconButton,Tooltip,Typography,Alert, TextField,FormControl,FormLabel,Radio,RadioGroup,FormControlLabel} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Swal from 'sweetalert2';
import { unblockEmployee } from '../EmployeeTrainingsRequest';
const Input = styled('input')({
    display: 'none',
});
export default function UnblockModal(props){
    const [fileData,setFileData] = useState(null);
    const [fileName,setFileName] = useState('');
    const [remarks,setRemarks] = useState('Fully Implemented');
    const [comments,setComments] = useState('');
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','ppt','pptx','xls','xlsx','doc','docx',
    ])
    const handleSetFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        // console.log(file)
        if(fileExtensions.includes(extension.toLowerCase())){
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setFileData(fileReader.result)
            }
            setFileName(file)
        }else{
            setFileData(null);
            setFileName('')
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const handleSave = ()=>{
        // console.log(props.selectedEmp)
        Swal.fire({
        icon:'info',
        title: 'Confirm unblock ?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Unblocking employee',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading();
            var data2 = {
                file:fileData,
                employee_id:props.selectedEmp.id,
                training_details_id:props.selectedEmp.training_details_id,
                per_page:props.rowsPerPage,
                search_value:props.searchValue,
                comments:comments,
                remarks:remarks
            }
            console.log(data2)
            unblockEmployee(data2)
            .then(res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    props.setData(res.data.data.data)
                    props.close();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:'Oops...!',
                        html:res.data.message,
                    })
                }
            }).catch(err=>{
                Swal.close();
                console.log(err)
            })
        }
        })
        
    }
    const handleSetRemarks = (value)=>{
        setRemarks(value.target.value)
    }
    const handleSetComments = (value)=>{
        setComments(value.target.value)
    }
    return(
        <Grid container spacing={1}>
            <Grid item xs={12} >
                <Alert severity="info">Please attached MOV file</Alert>
            </Grid>
            
            <Grid item xs={12}>
                        
                 <FormControl>
                    <FormLabel id="remarks-radio-buttons-group-label">Remarks *</FormLabel>
                    <RadioGroup
                        // row
                        aria-labelledby="remarks-radio-buttons-group-label"
                        name="remarks-radio-buttons-group-label"
                        aria-required
                        value={remarks}
                        onChange={handleSetRemarks}
                        row
                    >
                        <FormControlLabel value="Fully Implemented" control={<Radio size="small"/>} label="Fully Implemented" componentsProps={{typography:{fontSize:'.8rem'}}}/>
                        <FormControlLabel value="Partially Implemented" control={<Radio size="small"/>} label="Partially Implemented" componentsProps={{typography:{fontSize:'.8rem'}}}/>
                    </RadioGroup>
                    </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Comments' fullWidth value = {comments} onChange = {handleSetComments} required/>
            </Grid>
            <Grid item xs={12} >
                <label htmlFor={"contained-attachment-file"} style={{width:'100%'}}>
                    <Input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" id={"contained-attachment-file"} type="file" onChange = {(value)=>handleSetFile(value)}/>
                    <Tooltip title='Upload Attachment' component="span"><Button variant='outlined' color='primary' fullWidth><FileUploadOutlinedIcon/></Button></Tooltip>
                </label>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-start'}}>
                <small><em>{fileName}</em></small>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button className='custom-roundbutton' variant='contained' color='success' disabled={fileData && comments?false:true} onClick={handleSave}>Save</Button>
                
            </Grid>
        </Grid>
    )
}