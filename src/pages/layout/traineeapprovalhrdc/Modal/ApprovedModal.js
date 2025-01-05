import React,{useState} from 'react';
import Alert from '@mui/material/Alert';
import {Grid,Stack,Tooltip,Button,IconButton,Dialog,Box,AppBar,Toolbar,Typography,TextField,Slide,Paper} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { officialApprovedTraineeHRDC } from '../TraineeApprovalHRDCRequest';
import UpdateApprovedDataTable from '../DataTable/UpdateApprovedDataTable';
import moment from 'moment';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const Input = styled('input')({
    display: 'none',
});
export default function ApprovedModal(props){
    const [fileData,setFileData] = useState(null);
    const [fileName,setFileName] = useState(null);
    const [fileExtensions,setFileExtensions] = useState([
        'pdf','jpg','png','jpeg'
    ])
    const [showUpdateTrainee,setShowUpdateTrainee] = useState(false)
    const [resoName,setResoName] = useState('')
    const handleSetFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        // console.log(file.split('.').slice(0, -1).join('.'))
        if(fileExtensions.includes(extension.toLowerCase())){
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setFileData(fileReader.result)
            }
            setFileName(file)
            setResoName(file.split('.').slice(0, -1).join('.'))
        }else{
            setFileData(null);
            setFileName('')
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF/Image file.'
            })
        }
    }
    const clearFile = () =>{
        setFileData(null)
        setFileName('')
    }
    const handleSave = () =>{
        Swal.fire({
            icon:'warning',
            title: 'Do you want to save the changes?',
            html:'<strong>Note:</strong> <span style="color:red;">The training details shall not be editable after the approval. Please make sure to finalize the training details before doing so.</span>',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire({
            icon:'info',
            title:'Approving trainees',
            html:'Please wait...',
            showConfirmButton:false,
            allowOutsideClick:false,
            allowEscapeKey:false
            })
            Swal.showLoading()
            var data2 = {
                training_details_id:props.selectedTraining.training_details_id,
                training_app:props.selectedTraining.training_app,
                fileData:fileData,
                reso_name:resoName
            }
            // console.log(data2)
            officialApprovedTraineeHRDC(data2)
            .then(res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    props.close();
                    props.handleReload();
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
                Swal.close()
                console.log(err)
            })
        }
        })
        
    }
    const handleUpdateList = () =>{
        setShowUpdateTrainee(true)
    }
    return(
    <Grid container spacing={1}>
        <Grid item xs={12}>
            <Alert severity="info">Please upload a resolution.</Alert>
        </Grid>
        <Grid item xs={12}>
            <label htmlFor={"contained-attachment-file"} style={{width:'100%'}}>
                <Input accept=".png,.jpg,.jpeg,.pdf" id={"contained-attachment-file"} type="file" onChange = {(value)=>handleSetFile(value)}/>
                <Tooltip title='Upload Resolution' component="span"><Button variant='outlined' color='primary' fullWidth  size='large'><FileUploadIcon/></Button></Tooltip>
            </label>
        </Grid>
        {
            fileData
            ?
            <Grid item xs={12}>
            <small><em>{fileName}</em></small> <Tooltip title='Clear file uploaded'><IconButton color='error' onClick={clearFile}><CancelIcon/></IconButton></Tooltip>
            <TextField label='File Name' value = {resoName} onChange={(val)=>setResoName(val.target.value)} fullWidth/>
            </Grid>
            :
            null
        }
        <Grid item xs={12} sx={{display:'flex',}}>
            <Tooltip title='Update Trainee List'><Button variant = 'outlined' color='success' startIcon={<ManageAccountsIcon/>} fullWidth onClick = {handleUpdateList} size='large'></Button></Tooltip>
        </Grid>
        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
            <Button variant='contained' color='success' className='custom-roundbutton' disabled={fileData?false:true} onClick  = {handleSave}>Save</Button>
        </Grid>
        <Dialog
            fullScreen
            open={showUpdateTrainee}
            // onClose={handleCloseDialog}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'sticky',top:0 }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={()=>setShowUpdateTrainee(false)}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Update Trainee Nomination Approval
                </Typography>
                <Button autoFocus color="inherit" onClick={()=>setShowUpdateTrainee(false)}>
                close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    {
                        props.selectedTraining.length !==0
                        ?
                        <Paper sx={{p:2}}>
                            <Grid container spacing={2}>
                                <Grid item xs= {12} md={3} lg={3}>
                                    <TextField label='Training Name' defaultValue={props.selectedTraining.training_name} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <Grid item xs= {12} md={3} lg={3}>
                                    <TextField label='Training Venue' defaultValue={props.selectedTraining.venue} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <Grid item xs={12} md={2} lg={2}>
                                    <TextField label='Participants' defaultValue={props.selectedTraining.participants} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <Grid item xs={12} md={2} lg={2}>
                                    <TextField label='To' defaultValue={moment(props.selectedTraining.period_to).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                </Grid> 
                                <Grid item xs={12} md={2} lg={2}>
                                    <TextField label='To' defaultValue={moment(props.selectedTraining.period_to).format('MMMM DD, YYYY')} inputProps={{readOnly:true}} fullWidth/>
                                </Grid> 

                            </Grid>
                        </Paper>
                        :
                        ''
                    }
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <UpdateApprovedDataTable
                                close= {()=>setShowUpdateTrainee(false)}
                                // data={props.updateTraineeData}
                                selectedTraining ={props.selectedTraining}
                                selectedUpdateTrainee = {props.selectedUpdateTrainee}
                                setSelectedUpdateTrainee = {props.setSelectedUpdateTrainee}
                                saveUpdateTrainee = {props.saveUpdateTrainee}
                            />
                            {/* <DataTable
                                data={approvedTraineeData}
                                columns={columns}
                            /> */}
                        </Box>
                    </Grid>
                </Grid>
                
                
                
            </Box>

        </Dialog>
    </Grid>
    )
}