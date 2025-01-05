import React,{useEffect, useState} from 'react';
import {Grid,TextField,Paper,Typography,Stack,Chip,Avatar,IconButton,Box,Tooltip,TableContainer,Table,TableRow,TableHead,TableBody,Modal,Dialog,Button,Backdrop } from '@mui/material';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {blue,red,orange,green} from '@mui/material/colors'
import { getDeptDetails, getTrainerSchedule, getTrainingDetailsRqmt, getTrainingRqmt, getTrainingVenueList, getUpdateTrainerByMetaTags, getUpdateTrainerSched, updateTrainingDetails } from '../TrainingRequest';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {toast} from 'react-toastify';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import UpdateTrainer from '../Modal/UpdateTrainer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AssignTrainer from './AssignTrainer';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import UpdateAssignTrainer from './UpdateAssignTrainer';
import moment from 'moment';
const filter = createFilterOptions();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    //   paddingTop:'10px',
    //   paddingBottom:'5px',
    },
  }));
export default function UpdateTrainingDetails(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 345:600,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    const [isLoading,setIsLoading] = useState(true);
    const [selectedTrainer,setSelectedTrainer] = useState([]);
    const [trainerData,setTrainerData] = useState({trainer:[]});
    const [participants,setParticipants] = useState(props.data.participants)
    const [venue,setVenue] = useState(null)
    const [periodFrom,setPeriodFrom] = useState(props.data.period_from)
    const [periodTo,setPeriodTo] = useState(props.data.period_to)
    const [nomApprovalDeadline,setNomApprovalDeadline] = useState(props.data.nom_approval_deadline)
    const [deptDetails,setDeptDetails] = useState([]);
    const [remainingSlot,setRemainingSlot] = useState(0);
    const [updateTrainerModal,setUpdateTrainerModal] = useState(false);
    const [trainerSchedDialog,setTrainerSchedDialog] = useState(false);
    const [trainerScheduleData,setTrainerScheduleData] = useState([])
    const [rqmtData,setRqmtData] = useState([])
    const [rqmt, setRqmt] = useState([]);
    const [oldRqmt, setOldRqmt] = useState([]);
    const [trainingVenueData, setTrainingVenueData] = useState([]);
    const [open, toggleOpen] = useState(false);
    const [assignTrainerData, setAssignTrainerData] = useState([]);
    const [updatedAssignTrainer,setUpdatedAssignTrainer] = useState(false)
    const [dialogValue, setDialogValue] = useState({
        rqmt_name: ''
    });
    useEffect(()=>{
        // var temp_rqmts = []
        // JSON.parse(props.data.training_rqmts).forEach(el=>{
        //     temp_rqmts.push({
        //         rqmt_name:el,
        //         rqmt_temp:el,
        //     })
        // })
        // console.log(temp_rqmts)
        // setRqmt(temp_rqmts)
        // console.log(rqmt)
    },[])
    const handleUpdatePeriodFrom = (data)=>{
        setPeriodFrom(data.target.value)
        setUpdatedAssignTrainer(true)
    }
    const handleUpdatePeriodTo = (data)=>{
        setPeriodTo(data.target.value)
        setUpdatedAssignTrainer(true)
    }
    useEffect(async()=>{
        
        var data2 = {
            training_id:props.data.training_id
        }
        var t_selectedTrainer;
        await getUpdateTrainerByMetaTags(data2)
        .then(res=>{
            let temp = [...selectedTrainer]
            res.data.forEach(element => {
                if(props.data.trainer_ids.includes(element.trainer_id)){
                    temp.push(element);
                }
            });
            setSelectedTrainer(temp)
            t_selectedTrainer = temp;
            setTrainerData({trainer:res.data})
        }).catch(err=>{
            console.log(err)
        })
        var data3 = {
            training_details_id:props.data.training_details_id
        }
        await getDeptDetails(data3)
        .then(res=>{
            console.log(res.data)
            setDeptDetails(res.data)
        }).catch(err=>{
            console.log(err)
        })
        await getUpdateTrainerSched(data3)
        .then(res=>{
            // setTrainerScheduleData(res.data)
            /**
            * 
            get all dates assign
            */
            var t_dates = [];
            var t_trainer_ids = [];
            var t_trainer_sched_data = [];
            
            t_selectedTrainer.forEach(el=>{
                t_trainer_ids.push(el.trainer_id)
            })
            var t_trainerScheduleData = res.data

            t_trainerScheduleData.forEach(el=>{
                if(t_trainer_ids.includes(el.trainer_id)){
                    t_trainer_sched_data.push(el)
                }
            })

            t_trainer_sched_data.forEach(el=>{
                t_dates.push(el.training_date)
            })
            let unique = [...new Set(t_dates)];
            console.log(unique)

            var from = new Date(periodFrom);
            var to = new Date(periodTo);
            // var days = to.diff(from, 'days')+1;
            var arr = [];
            /**
                * get dates from date range
                */
            while(moment(from).format('YYYY-MM-DD') <= moment(to).format('YYYY-MM-DD')){
            if(moment(from).isBusinessDay()){
                if(unique.includes(moment(from).format('YYYY-MM-DD'))){
                    arr.push({
                        date:moment(from).format('YYYY-MM-DD'),
                        details:[]
                    })
                }else{
                    arr.push({
                        date:moment(from).format('YYYY-MM-DD'),
                        details:[{
                            date:'',
                            period:'',
                            trainer_id:'',
                            trainer_name:'',
                            topic:'',
                        }]
                    })
                }
                
            }
            
            from.setDate(from.getDate()+1)
            }
            var arr2 = [];
            arr.forEach(el => {
                t_trainer_sched_data.forEach(el2=>{
                    if(el.date === el2.date && t_trainer_ids.includes(el2.trainer_id)){
                        el.details.push({
                            date:el2.date,
                            period:el2.period,
                            trainer_id:el2.trainer_id,
                            trainer_name:el2.lname+', '+el2.fname,
                            topic:el2.topic,
                        })
                    }
                })
            });
            // console.log(arr)
            setTrainerScheduleData(arr)
        }).catch(err=>{
            console.log(err)
        })
        await getTrainingVenueList()
        .then(res=>{
            console.log(res.data)
            setTrainingVenueData(res.data)
            res.data.forEach(el=>{
                if(el.training_venue_list_id === props.data.training_venue_list_id){
                    setVenue(el)
                }
            })
        }).catch(err=>{
            console.log(err)
        })
        var t_rqmtData = [];
        var t_s_rqmtData = [];

        await getTrainingRqmt()
        .then(res=>{
            console.log(res.data)
            setRqmtData(res.data)
            t_rqmtData = res.data;
        }).catch(err=>{
            console.log(err)
        })
        await getTrainingDetailsRqmt(data3)
        .then(res=>{
            console.log(res.data)
            // setRqmtDetailsData(res.data)
            setOldRqmt(res.data)
            t_s_rqmtData = res.data;
        }).catch(err=>{
            console.log(err)
        })
        var t_rqmt = [];
        t_rqmtData.forEach(el=>{
            t_s_rqmtData.forEach(el2=>{
                if(el.training_rqmt_id === el2.training_rqmt_id){
                    t_rqmt.push(el)
                }
            })
        })
        setRqmt(t_rqmt)
        
        setIsLoading(false)

    },[props.data])
    const handleClose = () => {
        setDialogValue({
          rqmt_name: ''
        });
    
        toggleOpen(false);
    };
    const handleRemainingSlot = () =>{
        var temp = 0;
        deptDetails.forEach(el=>{
            if(el.slot){
                temp+=parseInt(el.slot)
            }
        })
        var remaining = participants - temp
        setRemainingSlot(remaining)
    }
    const handleUpdateRemainingSlot = (value)=>{
        if(value.target.value !== ''){
            var remaining = parseInt(value.target.value)+parseInt(remainingSlot)
            setRemainingSlot(remaining)
        }

    }
    const handleSetParticipants = (value)=>{
        setParticipants(value.target.value)
        // setRemainingSlot(value.target.value)
        // var temp = [...deptDetails];
        // temp.forEach(el=>{
        //     el.slot = 0;
        // })
        var temp = 0;
        deptDetails.forEach(el=>{
            if(el.slot){
                temp+=parseInt(el.slot)
            }
        })
        var remaining = value.target.value - temp
        setRemainingSlot(remaining)
    }
    const handleUpdateSlot = (value,index,total_selected)=>{
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
            if(value.target.value === ''){
                var temp = [...deptDetails];
                temp[index].slot = value.target.value;
                setDeptDetails(temp)
    
                var remaining = 0+remainingSlot
                setRemainingSlot(remaining)
            }else{
                if(participants <= 0){
                    toast.warning('Please input first the number of participants')
                    document.getElementById('number-participants').focus();
                }else{
                    console.log(remainingSlot)

                    if(value.target.value > remainingSlot){
                        toast.warning('Remaining slot: ' +remainingSlot)
                        var temp = [...deptDetails];
                        temp[index].slot = remainingSlot;
                        setDeptDetails(temp)
                        
                    }else{
                        var temp = [...deptDetails];
                        temp[index].slot = value.target.value;
                        setDeptDetails(temp)
                    }
                    
                }
            }
        }
    }
    const handleUpdateTrainer = (data)=>{
        // setTrainerScheduleData([])
        setUpdatedAssignTrainer(true)
        setUpdateTrainerModal(false)
        setSelectedTrainer(data)
        // setTrainerData({trainer:data})
    }
    const handleOpenTrainerSchedDialog = () =>{
        setTrainerSchedDialog(true)
    }
    const handleCloseTrainerSchedDialog = () =>{
        setTrainerSchedDialog(false)
    }
    const handleSaveUpdate = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'warning',
            title: 'Save training details update ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor:green[800],
            cancelButtonColor:red[800],
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire({
                icon:'info',
                title:'Updating training details',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
              })
              Swal.showLoading();
            //   Swal.close();

              let tem_details = [...deptDetails]
                tem_details.forEach(el=>{
                    delete el['total_approved']
                })
                var t_rqmt = [];
                
                rqmt.forEach(el=>{
                    t_rqmt.push(el.training_rqmt_id)
                })
                var data2 = {
                    participants:participants,
                    training_venue_list_id:venue.training_venue_list_id,
                    period_from:periodFrom,
                    trainer_schedule:trainerScheduleData,
                    period_to:periodTo,
                    nom_approval_deadline:nomApprovalDeadline,
                    dept_details:tem_details,
                    training_details_id:props.data.training_details_id,
                    rqmt:t_rqmt
                }
                console.log(data2)
                updateTrainingDetails(data2)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        // props.setTrainingDetailsData(res.data.data);
                        props.init()
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
    return(
        <Paper sx={{p:2}}>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',flexDirection:'row'}}
            open={isLoading}
            // onClick={handleClose}
            >
                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <CircularProgress color="inherit" /> &nbsp;
                <Typography>Loading Data. Please wait...</Typography>
                </Box>
        </Backdrop>
        <form onSubmit={handleSaveUpdate}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={ 6}>
                <TextField defaultValue={props.data.training_name} label='Training Name' fullWidth inputProps={{readOnly:true}}/>
            </Grid>
            <Grid item xs={12} lg={6} md={6} sx={{position:'relative'}}>
                <Typography sx={{position: 'absolute',color: '#00000099',fontSize: '.75rem',top: '8px',left: '25px',background: '#fff',padding: '0 5px 0 5px'}}>Trainer</Typography>
                <Stack direction="row" spacing={1} sx={{border:'solid 1px #c4c4c4',padding:'11px',borderRadius:'4px',overflow:'auto',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <Box>
                {
                    selectedTrainer.map((data,key)=>
                    <Chip key={key} sx={{marginRight:1}} avatar={<Avatar><AccountCircle sx={{color:blue[800],background:'#fff'}}/></Avatar>} label={data.lname+', '+data.fname}/>
                    )
                }
                </Box>
                <Box>
                <Tooltip title='Update Trainer'><IconButton sx={{float:'right'}} color='success' onClick={()=>setUpdateTrainerModal(true)} className='custom-iconbutton'><ModeEditOutlineOutlinedIcon/></IconButton></Tooltip>
                </Box>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                <TextField label='Number of Participants' fullWidth type='number' value = {participants} onChange={handleSetParticipants} id='number-participants' required/>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                {/* <TextField label='Training Venue' fullWidth value = {venue} onChange={(value)=>setVenue(value.target.value)}/> */}
                <Autocomplete
                    disablePortal
                    id="venue-box"
                    options={trainingVenueData}
                    getOptionLabel={(option) => option.venue_name}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Training Venue" required/>}
                    value={venue}
                    onChange={(event,newValue)=>{
                        setVenue(newValue)
                    }}
                    required
                />
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',mb:1}}>
                <Typography sx={{fontWeight: 'bold',color: blue[800]}}>Training Period</Typography>
                {
                    periodFrom.length !==0 && periodTo.length !==0
                    ?
                    <Tooltip title='Assign Trainer Schedule'><IconButton size='small' sx={{color:blue[800],'&:hover':{background:blue[800],color:'#fff'},marginTop:'-12px'}} onClick={handleOpenTrainerSchedDialog} className='custom-iconbutton'><ManageAccountsOutlinedIcon/></IconButton></Tooltip>
                    :
                    ''
                }
                </Box>
                
                <Grid container spacing={1} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Grid item xs={12} md = {4} lg= {4}>
                        <TextField label='Period From' fullWidth type='date' InputLabelProps={{shrink:true}} value = {periodFrom} onChange={handleUpdatePeriodFrom} required/>
                    </Grid>
                    <Grid item xs={12} md = {4} lg= {4}>
                        <TextField label='Period To' fullWidth type='date' InputLabelProps={{shrink:true}} value = {periodTo} onChange={handleUpdatePeriodTo} required/>
                    </Grid>
                    <Grid item xs={12} md = {4} lg= {4}>
                        {/* <Typography  sx={{mb:1,fontWeight: 'bold',color: '#0073cd'}}>Nomination Approval Deadline</Typography> */}
                        <TextField label='Nomination Approval Deadline' fullWidth type='date' InputLabelProps={{shrink:true}} value = {nomApprovalDeadline} onChange={(value)=>setNomApprovalDeadline(value.target.value)} required/>
                    </Grid>
                </Grid>
                
            </Grid>
            <Grid item xs={6} sx={{mt:matches?'auto':4}}>
                    {/* <Autocomplete
                        value={rqmt}
                        onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                            // toggleOpen(true);
                            setDialogValue({
                                rqmt_temp: newValue
                            });
                            });
                        } else if (newValue && newValue.inputValue) {
                            // toggleOpen(true);
                            setDialogValue({
                                rqmt_temp: newValue.inputValue
                            });
                        } else {
                            setRqmt(newValue);
                        }
                        }}
                        filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        if (params.inputValue !== '') {
                            filtered.push({
                            rqmt_temp: params.inputValue,
                            rqmt_name: `Add "${params.inputValue}"`,
                            });
                        }

                        return filtered;
                        }}
                        id="rqmt-dialog-demo"
                        options={rqmtData}
                        getOptionLabel={(option) => {
                            // e.g value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            return option.rqmt_temp;
                            }}
                        isOptionEqualToValue={(option, value) => option.rqmt_temp === value.rqmt_temp}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderOption={(props, option) => <li {...props}>{option.rqmt_name}</li>}
                        fullWidth
                        multiple
                        renderInput={(params) => <TextField {...params} label="Requirements"/>}
                        required
                        disableCloseOnSelect
                    /> */}
                    <Autocomplete
                        disablePortal
                        id="rqmt-box"
                        options={rqmtData}
                        getOptionLabel={(option) => option.rqmt_name}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Requirements *"/>}
                        disableCloseOnSelect
                        multiple
                        value={rqmt}
                        onChange={(event,newValue)=>{
                            setRqmt(newValue)
                        }}
                        required
                    />
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',mt:1}}>
                <Typography>Generated Shortlist Summary</Typography>
                <Typography sx={{color:orange[800],fontWeight:'bold'}}>Remaining Slot: {remainingSlot}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Department Name
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>
                                        Match	
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>
                                        Selected
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>
                                        Approved Nominee
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>
                                        Remaining Slot
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>
                                        Slot Allocation
                                    </StyledTableCell>
                                    
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    deptDetails.map((row,key)=>
                                    <TableRow key = {key}>
                                        <StyledTableCell>
                                            {row.dept_name}
                                        </StyledTableCell>
                                        <StyledTableCell align='right'>
                                            {row.total_search}
                                        </StyledTableCell>
                                        <StyledTableCell align='right'>
                                            {row.total_selected}
                                        </StyledTableCell>
                                        <StyledTableCell align='right'>
                                            {row.total_approved}
                                        </StyledTableCell>
                                        <StyledTableCell align='right'>
                                            {row.slot-row.total_approved}
                                        </StyledTableCell>
                                        <StyledTableCell align='right'>
                                            <TextField label = {row.dept_name+' Slot'} value={row.slot} onChange = {(value)=>handleUpdateSlot(value,key,row.total_selected)} onBlur = {handleRemainingSlot} onFocus={(value)=>handleUpdateRemainingSlot(value)} InputProps={{inputProps: {inputMode: 'numeric', pattern: '[0-9]*',min:0}}} disabled = {row.total_selected === 0 ? true:false}/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button variant='contained' startIcon={<SaveIcon/>} color='success' className='custom-roundbutton' type='submit'>Save Update</Button>
            </Grid>
            
        </Grid>
        </form>
        <Modal
            open={updateTrainerModal}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/* <CancelOutlinedIcon/> */}
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setUpdateTrainerModal(false)}/>

                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Updating Trainer
                </Typography>
                <Box sx={{mt:2,pt:0,pl:matches?2:4,pr:matches?2:4,pb:2,maxHeight:'70vh',overflowY:'scroll'}}>
                    <UpdateTrainer trainerData = {trainerData} selectedTrainer={selectedTrainer} setSelectedTrainer = {setSelectedTrainer} handleUpdateTrainer = {handleUpdateTrainer}/>
                </Box>
            </Box>
        </Modal>
        <Dialog
            fullScreen
            sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}
            open={trainerSchedDialog}
            // onClose={handleCloseDialog}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'sticky',top:0 }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseTrainerSchedDialog}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Assigning Trainer Schedule
                </Typography>
                <Button autoFocus color="inherit" onClick={handleCloseTrainerSchedDialog}>
                close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
                <UpdateAssignTrainer close = {handleCloseTrainerSchedDialog} from = {periodFrom} to ={periodTo} trainer={trainerData} setTrainerScheduleData = {setTrainerScheduleData} trainerScheduleData = {trainerScheduleData} selectedTrainer = {selectedTrainer} updatedAssignTrainer = {updatedAssignTrainer} setUpdatedAssignTrainer = {setUpdatedAssignTrainer}/>
            </Box>

        </Dialog>
        </Paper>
    )
}