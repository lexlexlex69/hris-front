import React,{useEffect, useState} from 'react';
import {Grid,Typography,TextField,Box,Paper,FormControl,InputLabel,Input,InputAdornment,Chip,Stack,Avatar,Button,IconButton,Tooltip,Dialog,AppBar, Toolbar,Autocomplete} from '@mui/material';
import { styled } from '@mui/material/styles';
import {blue,red,orange} from '@mui/material/colors'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AssignTrainer from './AssignTrainer';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useNavigate}from "react-router-dom";
import { addTrainingDetails, getTrainingVenueList } from '../TrainingRequest';
import Swal from 'sweetalert2';
import moment from 'moment';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

export default function Summary(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?13:15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?12:14,
        },
    }));
    const [trainingVenue,setTrainingVenue] = useState(null);
    const [trainingPeriodFrom,setTrainingPeriodFrom] = useState('');
    const [trainingPeriodTo,setTrainingPeriodTo] = useState('');
    const [participants,setParticipants] = useState(0);
    const [nominationDeadline,setNominationDeadline] = useState('')
    const [deptInfo,setDeptInfo] = useState([]);
    const [remainingSlot,setRemainingSlot] = useState(0);
    const [openDialog,setOpenDialog] = useState(false);
    const [trainingVenueData,setTrainingVenueData] = useState([]);
    const [testData,setTestData] = useState([
        {
            name:'',
            value:''
        }
    ])
    const addTestData = () =>{
        var temp = [...testData];
        temp.push({
            name:'',
            value:''
        })
        setTestData(temp)
    }
    const handleOpenDialog = () =>{
        setOpenDialog(true)
    }
    const handleCloseDialog = () =>{
        setOpenDialog(false)
    }
    useEffect(()=> {
        props.setTrainerScheduleData([])

        var temp = [];
        /**
         * Set summary details
         */
        for(var i=0;i<props.shortListDetails.total_search_results.length;i++){
            for(var x=0;x<props.shortListDetails.total_selected_per_dept.length;x++){
                if(props.shortListDetails.total_search_results[i].short_name === props.shortListDetails.total_selected_per_dept[x].dept_name){
                    temp.push({
                        dept_name:props.shortListDetails.total_search_results[i].short_name,
                        total_search:props.shortListDetails.total_search_results[i].total,
                        total_selected:props.shortListDetails.total_selected_per_dept[i].total,
                        slot:0
                    })
                    break;
                }
            }
        }
        setDeptInfo(temp)
        getTrainingVenueList()
        .then(res=>{
            console.log(res.data)
            setTrainingVenueData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[props.shortListDetails])
    const handleSetSlot = (value,index,total_selected)=>{
        /**
         * Check if selected from shortlist is greater than or equal to input
         */
        if(value.target.value > total_selected){
            if(total_selected === 0){
                toast.warning('No selected shortlist from this department')
            }else{
                toast.warning('Slot must be equal or less than to the selected shortlist')
            }
        }else{
            console.log(value.target.value)
            console.log(remainingSlot)

            if(value.target.value === ''){
                var temp = [...deptInfo];
                temp[index].slot = value.target.value;
                setDeptInfo(temp)
    
                // var remaining = remainingSlot
                // setRemainingSlot(remaining)
            }else{
                if(participants <= 0){
                    toast.warning('Please input first the number of participants')
                    document.getElementById('number-participants').focus();
                }else{

                    if(parseInt(value.target.value) > parseInt(remainingSlot)){
                        console.log(value.target.value)
                        console.log(remainingSlot)
                        toast.warning('Remaining slot: ' +remainingSlot)
                        var temp = [...deptInfo];
                        temp[index].slot = remainingSlot;
                        setDeptInfo(temp)
                        // var temp = [...deptInfo];
                        // temp[index].slot = remainingSlot;
                        // setDeptInfo(temp)
                        
                    }else{
                        var temp = [...deptInfo];
                        var temp2 = 0;
                        deptInfo.forEach(el=>{
                            if(el.dept_name !== temp[index].dept_name){
                                temp2+=parseInt(el.slot)
                            }
                            
                        })
                        var remaining = participants - temp2
                        // console.log(remaining)
                        // console.log(value.target.value)
                        if(parseInt(value.target.value)<=parseInt(remaining)){
                            temp[index].slot = value.target.value;
                        }else if(parseInt(remaining) === 0){
                             toast.warning('Remaining slot:'+remaining)
                             temp[index].slot = 0;
                        }else{
                            toast.warning('Remaining slot:'+remaining)
                        }
                        setDeptInfo(temp)
                    }
                    // if(remainingSlot === 0){
                    //     if(value.target.value > participants){
                    //         toast.warning('Remaining slot: ' +remainingSlot)
                    //     }else{
                    //         var temp = [...deptInfo];
                    //         temp[index].slot = value.target.value;
                    //         setDeptInfo(temp)
                    //     }
                    // }else{
                        
                    // }
                    
                }
            }
        }
        
        
    }
    const handleRemainingSlot = (value,dept_name) =>{
        var temp = 0;
        deptInfo.forEach(el=>{
            if(el.dept_name !== dept_name){
                if(el.slot){
                    temp+=parseInt(el.slot)
                }
            }
            
        })
        var remaining = participants - temp
        console.log(remaining)
        // setRemainingSlot(remaining)
    }
    const handleUpdateRemainingSlot = (value,dept_name)=>{
        if(value.target.value !== ''){
            var remaining = remainingSlot+parseInt(value.target.value)
            // console.log()
            setRemainingSlot(remaining)
            console.log(remaining)
        }

    }
    const handleSetParticipants = (value)=>{
        setParticipants(value.target.value)
        // setRemainingSlot(value.target.value)
    }
    const submit = (event)=>{
        event.preventDefault()

        Swal.fire({
            title: 'Confirm submit?',
            icon:'info',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Saving data.',
                    html:'Please wait...',
                    allowOutsideClick:false,
                    allowEnterKey:false
                })
                Swal.showLoading()
                var summaryDetails = {
                    participants:participants,
                    training_venue_list_id:trainingVenue.training_venue_list_id,
                    period_from:trainingPeriodFrom,
                    period_to:trainingPeriodTo,
                    nomination_deadline:nominationDeadline
                }
                var data2 = {
                    training_details:props.trainingDetails,
                    shortlist_details:props.shortListDetails,
                    trainer_schedule_data:props.trainerScheduleData,
                    summary_details:summaryDetails,
                    dept_info:deptInfo
                }
                console.log(data2)
                // Swal.close()

                addTrainingDetails(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        props.closeModal()
                        props.closeSummary()
                        props.closeShortList()
                        props.setTrainingDetailsData(res.data.data)
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
                    console.log(res.data)
                }).catch(err=>{
                    Swal.close();
                    console.log(err)
                })
            }
        })
        
    }
    const handleNominationDeadline = (value) =>{
        if(trainingPeriodTo){
            if(moment(value.target.value,'YYYY-MM-DD').format('MM-DD-YYYY')>moment(trainingPeriodTo,'YYYY-MM-DD').format('MM-DD-YYYY')){
                toast.warning('Deadline must before training period to.')
            }else{
                setNominationDeadline(value.target.value)
            }
        }else{
            toast.warning('Please set traininig period from first')
        }
    }
    useEffect(()=>{
        var temp2 = 0;
        deptInfo.forEach(el=>{
            temp2+=el.slot === '' ?0:parseInt(el.slot)
        })
        var remaining = participants - temp2
        setRemainingSlot(remaining)
    },[deptInfo,participants])
    return(
        <Box sx={{p:2}} component={Paper}>
        <form onSubmit={submit}>
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6} md={6}>
                <TextField defaultValue={props.trainingDetails.training_name.training_name} label='Training Name' fullWidth inputProps={{readOnly:true}} Input/>
            </Grid>
            {/* <Grid item xs={6}>
                <TextField defaultValue={props.trainingDetails.trainer_name} label='Trainer' fullWidth inputProps={{readOnly:true}}/>
            </Grid> */}
            <Grid item xs={12} lg={6} md={6} sx={{position:'relative'}}>
                <Typography sx={{position: 'absolute',color: '#00000099',fontSize: '.75rem',top: '8px',left: '25px',background: '#fff',padding: '0 5px 0 5px'}}>Trainer</Typography>
                <Stack direction="row" spacing={1} sx={{border:'solid 1px #c4c4c4',padding:'11px',borderRadius:'4px',overflow:'auto'}}>
                {
                    props.trainingDetails.trainer.map((data,key)=>
                    <Chip key={key} avatar={<Avatar><AccountCircle sx={{color:blue[800],background:'#fff'}}/></Avatar>} label={data.lname+', '+data.fname} />
                    )
                }
                </Stack>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                <TextField label='Number of Participants' fullWidth type ='number' value = {participants} onChange = {handleSetParticipants} id='number-participants' required/>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                {/* <TextField label='Training Venue' fullWidth value = {trainingVenue} onChange = {(value)=>setTrainingVenue(value.target.value)} required/> */}
                <Autocomplete
                    disablePortal
                    id="rqmt-box"
                    options={trainingVenueData}
                    getOptionLabel={(option) => option.venue_name}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Training Venue" required/>}
                    value={trainingVenue}
                    onChange={(event,newValue)=>{
                        setTrainingVenue(newValue)
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',p:1}}>
                <Typography sx={{fontWeight: 'bold',color: blue[800]}}>Training Period</Typography>
                {
                    trainingPeriodFrom.length !==0 && trainingPeriodTo.length !==0
                    ?
                    <Tooltip title='Assign Trainer Schedule'><IconButton size='small' sx={{color:blue[800],'&:hover':{background:blue[800],color:'#fff'},marginTop:'-12px'}} onClick={handleOpenDialog} className='custom-iconbutton'><ManageAccountsOutlinedIcon/></IconButton></Tooltip>
                    :
                    ''
                }
                
                </Box>
                <Grid item container xs={12} spacing={1}>
                    <Grid item xs={12} lg={6} md={6}>
                        <TextField label = 'From' type = 'date' fullWidth InputLabelProps={{shrink:true}} value = {trainingPeriodFrom} onChange = {(value)=>setTrainingPeriodFrom(value.target.value)} required InputProps={{inputProps: { min: moment(new Date()).format('YYYY-MM-DD')} }}/>
                    </Grid>
                    <Grid item xs={12} lg={6} md={6}>
                        <TextField label = 'To' type = 'date' fullWidth InputLabelProps={{shrink:true}} value = {trainingPeriodTo} onChange = {(value)=>setTrainingPeriodTo(value.target.value)} required InputProps={{inputProps: { min: moment(new Date()).format('YYYY-MM-DD')} }}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                <Box sx={{display:'flex',flexDirection:'column',p:1}}>
                    <Typography sx={{fontWeight: 'bold',color: blue[800]}}>Nomination Approval Deadline</Typography>
                </Box>

                <Grid item xs={12}>
                    <Grid item xs={12}>
                    <TextField label = 'Date' type = 'date' fullWidth InputLabelProps={{shrink:true}} value = {nominationDeadline} onChange = {handleNominationDeadline} required InputProps={{inputProps: { min: moment(new Date()).format('YYYY-MM-DD')} }}/>
                    </Grid>
                </Grid>
                
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',mt:1,alignItems:'center'}}>
                <Typography>Generated Shortlist Summary</Typography>
                <Box sx={{display:'flex',flexDirection:'column'}}>
                <Typography sx={{color:orange[800],fontWeight:'bold',textAlign:'right'}}>Slot: {participants}</Typography>
                <Typography sx={{color:red[500],textAlign:'right'}}>Remaining Slot: {remainingSlot}</Typography>

                </Box>
            </Grid>
            <Grid item xs={12}>
            <Paper>
                <TableContainer sx={{ maxHeight: '60vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Department Name</StyledTableCell>
                            <StyledTableCell align="right">Match</StyledTableCell>
                            <StyledTableCell align="right">Selected From Shortlist</StyledTableCell>
                            <StyledTableCell align="right">Slot Allocation</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            deptInfo.map((row,key)=>
                                <TableRow key ={key}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.dept_name}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="right">
                                        {row.total_search}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="right">
                                        {row.total_selected}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="right">
                                        {/* <TextField label={row.dept_name+' Slot'} type='number' value ={row.slot} onChange = {(value)=>handleSetSlot(value,key,row.total_selected)} onBlur = {handleRemainingSlot} onFocus={(value)=>handleUpdateRemainingSlot(value)} InputProps={{inputProps: {inputMode: 'numeric', pattern: '[0-9]*',min:0}}} disabled = {row.total_selected === 0 ? true:false}/> */}
                                         {/* <TextField label={row.dept_name+' Slot'} type='number' value ={row.slot} onChange = {(value)=>handleSetSlot(value,key,row.total_selected)} InputLabelProps={{shrink:true}} InputProps={{inputProps: {inputMode: 'numeric', pattern: '[0-9]*',min:0}}} disabled = {row.total_selected === 0 ? true:false}/> */}
                                         <SlotField row={row} handleSetSlot = {(value)=>handleSetSlot(value,key,row.total_selected)}/>
                                    </StyledTableCell>
                                </TableRow>
                            )
                        }
                        <TableRow></TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                <Button variant='contained' sx={{float:'right'}} onClick={props.closeSummary} startIcon={<KeyboardArrowLeftOutlinedIcon/>}> Back</Button>
                <Button variant='contained' color='success' sx={{float:'right'}} type='submit' disabled={props.trainerScheduleData.length ===0 ? true:false}>Submit</Button>
            </Grid>
        </Grid>
        </form>

        <Dialog
            fullScreen
            sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}
            open={openDialog}
            // onClose={handleCloseDialog}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'sticky',top:0 }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Assigning Trainer Schedule
                </Typography>
                <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
                <AssignTrainer close = {handleCloseDialog} from = {trainingPeriodFrom} to ={trainingPeriodTo} trainer={props.trainingDetails} setTrainerScheduleData = {props.setTrainerScheduleData} trainerScheduleData = {props.trainerScheduleData}/>
            </Box>

        </Dialog>
        </Box>
    )
}
function SlotField(props){
    const {row,handleSetSlot} = props;
    return(
        <React.Fragment>
        <TextField label={row.dept_name+' Slot'} type='number' value ={row.slot} onChange = {handleSetSlot} InputLabelProps={{shrink:true}} InputProps={{inputProps: {inputMode: 'numeric', pattern: '[0-9]*',min:0}}} disabled = {row.total_selected === 0 ? true:false}/>
        </React.Fragment>
    )
}