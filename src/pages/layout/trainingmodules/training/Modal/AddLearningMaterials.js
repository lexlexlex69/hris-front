import React,{useState}  from 'react';
import {Grid,TextField,Tooltip,Button,IconButton} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Swal from 'sweetalert2';
import { addLearningMaterials } from '../TrainingRequest';
import { toast } from 'react-toastify';
const Input = styled('input')({
    display: 'none',
});
export default function AddLearningMaterials(props){
    const [data,setData] = useState({
        'name':'',
        'description':'',
        'file':''
    })
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','png','jpg','jpeg','ppt','pptx','xls','xlsx','doc','docx',
    ])
    const handleChange = (name,value)=>{
        var temp = {...data}
        temp[name] = value.target.value
        setData(temp)
    }
    const handleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        // console.log(extension)
        let data2 = {...data};
        // if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg' || extension === 'PPTX' || extension === 'pptx' || extension === 'PPTM' || extension === 'pptm' || extension === 'PPT' || extension === 'ppt')
        if(fileExtensions.includes(extension.toLowerCase())){
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                data2.file = fileReader.result;
                setData(data2)
            }
        }else{
            data2.file = '';
            setData(data2)
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Only file accepted '+JSON.stringify(fileExtensions)
            })
        }
    }
    const [fileUploading,setFileUploading] = useState(false)
    const handleSave = async (event)=>{
        event.preventDefault();
        setFileUploading(true)
        const id = toast.loading('Uploading learning materials')
        var data2 = {
            training_details_id:props.data.training_details_id,
            data:data
        }
        const res = await addLearningMaterials(data2)
        if(res.data.status === 200){
            props.updateData(res.data)
            toast.update(id,{
                render:res.data.message,
                type:'success',
                autoClose:true,
                isLoading:false
            })
        }else{
            toast.update(id,{
                render:res.data.message,
                type:'error',
                autoClose:true,
                isLoading:false
            })
        }
        // Swal.fire({
        //     icon:'info',
        //     title: 'Do you want to save the changes?',
        //     showCancelButton: true,
        //     confirmButtonText: 'Save',
        //     cancelButtonText:`Don't Save` 
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //         Swal.fire({
        //             icon:'info',
        //             title:'Saving data',
        //             html:'Please wait...',
        //             allowEscapeKey:false,
        //             allowOutsideClick:false
        //         })
        //         Swal.showLoading()
        //         // console.log(props.data)
        //         var data2 = {
        //             training_details_id:props.data.training_details_id,
        //             data:data
        //         }
        //         console.log(data2)
        //         // Swal.close();
        //         addLearningMaterials(data2)
        //         .then(res=>{
        //             // console.log(res.data)
        //             if(res.data.status === 200){
        //                 props.updateData(res.data)
        //                 Swal.fire({
        //                     icon:'success',
        //                     title:res.data.message,
        //                     timer:1500,
        //                     showConfirmButton:false
        //                 })
        //             }else{
        //                 Swal.fire({
        //                     icon:'error',
        //                     title:res.data.message
        //                 })
        //             }
        //         }).catch(err=>{
        //             Swal.close();
        //             console.log(err)
        //         })
        //     }
        //   })
        
    }
    return(
        <form onSubmit={handleSave}>
        <Grid container spacing={2} sx={{p:1}}>
            <Grid item xs={12}>
                <TextField label='Name' fullWidth value = {data.name} onChange={(value)=>handleChange('name',value)} required/>
            </Grid>
            <Grid item xs={12}>
                <TextField label='Description' placeholder='example: Day 1 - John Doe Powerpoint' fullWidth value = {data.description} onChange={(value)=>handleChange('description',value)} required/>
            </Grid>
            <Grid item xs={12}> 
                <label htmlFor={"contained-materials"} style={{width:'100%'}}>
                    <Input accept="image/*,.pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx" id={"contained-materials"} type="file" onChange= {handleFile}/>
                    <Tooltip title='Upload File' component="span"><Button color='primary' variant='outlined' fullWidth sx={{height:'56px'}}><FileUploadOutlinedIcon/></Button></Tooltip>
                </label>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Button variant = 'contained' color='success' type='submit' disabled={data.file.length ===0 || fileUploading ? true:false} className='custom-roundbutton'>Save</Button>&nbsp;
                <Button variant = 'contained' color='error' onClick={props.close} className='custom-roundbutton'>Cancel</Button>
            </Grid>
        </Grid>
        </form>
    )
}