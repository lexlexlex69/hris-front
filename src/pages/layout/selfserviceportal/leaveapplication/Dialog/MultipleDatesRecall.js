import { Grid, Typography,Box, Tooltip, IconButton,Modal,TextField,Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import moment from 'moment';
import React,{useEffect, useState} from 'react';
import { api_url } from '../../../../../request/APIRequestURL';
import Swal from 'sweetalert2';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { red } from '@mui/material/colors';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { recallLeaveApplication } from '../LeaveApplicationRequest';
import { toast } from 'react-toastify';

export default function MultipleDatesRecall(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [singleFile,setsingleFile] = React.useState('');
    
    const handleSingleFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setsingleFile(fileReader.result)
            }
        }else{
            setsingleFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    useEffect(()=>{
        console.log(props.dates)
        
    },[])
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:'10px',
        boxShadow: 24,
        p:2,
    };
    const [selectedDate,setSelectedDate] = useState('');
    const [openReasonModal,setOpenReasonModal] = useState(false);
    const [reason,setReason] = useState('');
    const handleCancel = (val)=>{
        if(selectedDates.length>0){
            // setSelectedDate(val)
            setOpenReasonModal(true);
        }else{
            toast.warning('Please select date/s')
        }
        
    }
    const handleCloseReasonModal = ()=>{
        setOpenReasonModal(false);
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Cancelling leave application',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading();
        var data2 = {
            emp_id:props.row.employee_id,
            leave_id:props.row.leave_application_id,
            leave_type_id:props.row.leave_type_id,
            dwp:props.row.days_with_pay,
            reason:reason,
            type:1, // 0 - one inclusive dates on application, 1 - more than one nclusive dates on application
            api_url:api_url+'/cancelLeaveApplication',
            date:selectedDates,
            file:singleFile
        }
        console.log(data2)
        // Swal.close();
        recallLeaveApplication(data2)
        .then(res=>{
            if(res.data.status === 200){
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
            }
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const [selectedAll,setSelectedAll] = useState(false);
    const [selectedDates,setSelectedDates] = useState([]);
    
    useEffect(()=>{
        if(selectedAll){
            let temp = []
            props.dates.forEach(el=>{
                temp.push(moment(el.date).format('YYYY-MM-DD'))
            })
            console.log(temp)
            setSelectedDates(temp)
        }else{
            setSelectedDates([])
        }
    },[selectedAll])
    const handleSelectDate = (date)=>{
        let temp = [...selectedDates];
        let index = temp.indexOf(moment(date).format('YYYY-MM-DD'));

        if(index>-1){
            temp.splice(index,1);
            setSelectedDates(temp)
        }else{
            temp.push(moment(date).format('YYYY-MM-DD'));
            setSelectedDates(temp)
        }
    }
    return(
        <Box sx={{mt:2,mb:2,ml:4,mr:4}}>
        
        <Grid container>
            <Grid item xs={12}>
                <Box sx={{display:'flex',justifyContent:'space-between'}}>
                    <FormControlLabel control={<Checkbox checked={selectedAll} />} label="Select All" onChange={()=>setSelectedAll(!selectedAll)}/>
                    <Tooltip title='Recall application'><Button variant='outlined' onClick={()=>handleCancel()} color='error' className='custom-roundbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}} startIcon={<RotateLeftIcon/>}> Recall Dates</Button></Tooltip>
                </Box>
                <FormGroup>
                {
                    props.dates.map((row,key)=>
                        <FormControlLabel control={<Checkbox checked={selectedDates.includes(moment(row.date).format('YYYY-MM-DD'))} />} label={moment(row.date,'MM-DD-YYYY').format('MMMM DD, YYYY')} onChange={()=>handleSelectDate(row.date)} />
                        // <Box key={key} sx={{display:'flex',justifyContent:'space-between',border: 'solid 1px #c5c5c5',    borderRadius: '5px',padding: '5px',alignItems:'center',mb:1}}>
                        //     <Typography>
                        //         {moment(row.date,'MM-DD-YYYY').format('MMMM DD, YYYY')}
                        //     </Typography>
                        //     <Tooltip title='Recall application'><IconButton onClick={()=>handleCancel(row.date)} color='error' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}}><RotateLeftIcon/></IconButton></Tooltip>
                        // </Box>
                    )
                }
                </FormGroup>

            </Grid>
            <Modal
                open={openReasonModal}
                onClose={handleCloseReasonModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <form onSubmit={handleSubmit}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb:1}}>
                        Please specify reason for cancellation
                    </Typography>
                    <TextField label='Reason' value = {reason} onChange={(val)=>setReason(val.target.value)} fullWidth required sx={{mb:2}}/>
                    
                    <TextField type = "file" label="Approved letter*" fullWidth InputLabelProps={{shrink:true}} onChange = {handleSingleFile} InputProps={{ inputProps: { accept:'image/*    ,.pdf'}}} required/>
                    
                    <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                        <Button color='success' variant='contained' className='custom-roundbutton' size='small' type='submit'>Submit</Button>
                        &nbsp;
                        <Button color='error' variant='contained' className='custom-roundbutton'  size='small' onClick={handleCloseReasonModal}>Cancel</Button>
                    </Box>
                </form>
                </Box>
            </Modal>
        </Grid>
        </Box>
    )
}