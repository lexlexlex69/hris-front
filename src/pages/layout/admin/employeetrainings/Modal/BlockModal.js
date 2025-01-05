import React,{useState} from 'react';
import {Grid,Button,IconButton,Tooltip,Typography,Alert, TextField,FormControl,FormLabel,Radio,RadioGroup,FormControlLabel} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Swal from 'sweetalert2';
import { blockEmployee, unblockEmployee } from '../EmployeeTrainingsRequest';
import moment from 'moment';
const Input = styled('input')({
    display: 'none',
});
export default function BlockModal(props){
    const [fileData,setFileData] = useState(null);
    const [fileName,setFileName] = useState('');
    const [remarks,setRemarks] = useState('Fully Implemented');
    const [comments,setComments] = useState('');
    const [blockDate,setBlockDate] = useState(null);
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','ppt','pptx','xls','xlsx','doc','docx',
    ])
    const handleSetFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        console.log(file)
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
    const handleSave = (event)=>{
        event.preventDefault();
        Swal.fire({
        icon:'info',
        title: 'Confirm block ?',
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
                employee_id:props.selectedEmp.id,
                training_details_id:props.selectedEmp.training_details_id,
                per_page:props.rowsPerPage,
                search_value:props.searchValue,
                comments:comments,
                date_block:blockDate
            }
            console.log(data2)
            blockEmployee(data2)
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
    return(
    <form onSubmit = {handleSave}>
        <Grid container spacing={2}>
             <Grid item xs={12} >
                <Alert severity="warning">After blocking, must attached MOV to unblock.</Alert>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Comments' fullWidth value = {comments} onChange = {(value)=>setComments(value.target.value)} required/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-start'}}>
                <TextField label='Block until' type='date' InputLabelProps={{shrink:true}} InputProps={{inputProps:{min:moment(new Date()).format('YYYY-MM-DD')}}} fullWidth value = {blockDate} onChange = {(value)=>setBlockDate(value.target.value)} required/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button className='custom-roundbutton' variant='contained' color='success' type='submit'>Save</Button>
            </Grid>
        </Grid>
    </form>
    )
}