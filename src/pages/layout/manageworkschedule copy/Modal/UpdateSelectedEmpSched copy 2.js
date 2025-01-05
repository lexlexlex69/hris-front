import { Box, Grid,TextField,Typography,Button,Modal,Autocomplete } from '@mui/material';
import React,{useEffect, useState} from 'react';
import Datetime from "react-datetime";
import moment from 'moment';
import { getScheduleData,getWorkSchedule,updateEmpScheduleData,removeEmpScheduleData } from '../WorkScheduleRequest';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';
const updateTimeStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    marginBottom: 0,
    bgcolor: '#fff',
    border: '2px solid #fff',
    borderRadius:3, 
    boxShadow: 24,
  };
export default function UpdateSelectedEmployeeEmpSched(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedUpdateDate,setSelectedUpdateDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [scheduleUpdateData,setScheduleUpdateData] = useState([])
    const [scheduleUpdateData2,setScheduleUpdateData2] = useState([])
    const [selectedEmployeeUpdate,setSelectedEmployeeUpdate] = useState([])
    const [navigateDate,setNavigateDate] = useState(moment(props.date).format('YYYY-MM-DD'));
    const [showUpdateTimeModal,setShowUpdateModal] = useState(false)
    const [workSchedData,setWorkSchedData] = useState([])
    const [selectedWorkSched,setSelectedWorkSched] = useState(null)
    const [selectedDateHasSchedule,setSelectedDateHasSchedule] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(false)
    const [selectedIndex,setSelectedIndex] = useState('')
    const [selectedDateHasSched,setSelectedDateHasSched] = useState(false)
    useEffect(()=>{
        if(props.data.length !==0){
            setScheduleUpdateData(JSON.parse(props.data[0].details))
            setScheduleUpdateData2(props.data[0])
        }else{
            setScheduleUpdateData([])
            setScheduleUpdateData2([])

        }
        setSelectedEmployeeUpdate(props.emp.emp_no)
        getWorkSchedule()
        .then(res=>{
            setWorkSchedData(res.data.response)
            console.log()
        }).catch(err=>{
            console.log(err)
        })

    },[])
    const clickDate = (value) =>{
        /**
         * Check if data exist to current sched
         */
        const index = scheduleUpdateData.findIndex(object => {
            return object.day === moment(value._d).format('D');
        });
        setSelectedIndex(index)
        setNavigateDate(value)
        setShowUpdateModal(true)
        setSelectedUpdateDate(value._d)
        var has_sched = false;
        scheduleUpdateData.forEach(element=>{
            if(element.day ===  moment(value._d).format('D') && scheduleUpdateData2.month == moment(value._d).format('M')){
                has_sched = true;
                setSelectedDateHasSched(true)
            }
        })
        setSelectedDateHasSchedule(has_sched)

        setIsLoadingData(true)
        var currentDate = moment(value._d).format('YYYY-MM-DD');
        setNavigateDate(moment(value._d))
        var data2 = {
            emp_no:selectedEmployeeUpdate,
            month:moment(currentDate).format('MM'),
            year:moment(currentDate).format('YYYY'),
        }
        getScheduleData(data2)
        .then(res=>{
            if(res.data.length !== 0){
                setScheduleUpdateData(JSON.parse(res.data[0].details))
                setScheduleUpdateData2(res.data[0])
            }else{
                setSelectedDateHasSched(false)
                setScheduleUpdateData(res.data)
            }
            setIsLoadingData(false)

        }).catch(err=>{
            console.log(err)
        })
    }
    const renderDay = (props, currentDate, selectedDate) => {
        var {key, ...other} = props;
        

        var day = moment(currentDate._d).format('MM-DD-YYYY')

        var schedule = '';
        scheduleUpdateData.forEach(element => {
            if(element.day ===  moment(currentDate._d).format('D') && scheduleUpdateData2.month == moment(currentDate._d).format('M')){
                schedule = element.whrs_desc;
            }
        });
        
        // var schedule ='';
        // for(var i = 0; i<scheduleUpdateData.length;i++){
        //     if(moment(scheduleUpdateData[i].date).format('MM-DD-YYYY') === moment(currentDate._d).format('MM-DD-YYYY')){
        //         schedule = scheduleUpdateData[i].whrs_desc;
        //         break;
        //     }
        // }

        if(schedule.length === 0){
            return <td {...props} style={{padding:'10px'}}>{currentDate.date()}</td>
        }else{
            return <td {...props} style={{padding:'10px'}}>{currentDate.date()} <br/> <span style={{background: '#ee782a',
                borderRadius: '10px',padding: '3px',color:'#fff',fontSize:'.7rem'}} {...other}>{schedule}</span></td>
        }
    }
    const onNavigateBack = (nextView, currentView) =>{
        if(currentView === 'months'){
            setIsLoadingData(true)
            var currentDate = moment(navigateDate).format('YYYY-MM-DD');
            var futureMonth = moment(currentDate).subtract(1, 'M');
            var new_date = new Date(moment(futureMonth).format('YYYY'),moment(futureMonth).format('MM')-1,1)
            setNavigateDate(new_date)
            var data2 = {
                emp_no:selectedEmployeeUpdate,
                month:moment(new_date).format('MM'),
                year:moment(new_date).format('YYYY'),
            }
            getScheduleData(data2)
            .then(res=>{
                if(res.data.length !== 0){
                    setScheduleUpdateData(JSON.parse(res.data[0].details))
                    setScheduleUpdateData2(res.data[0])
                }else{
                    setSelectedDateHasSched(false)
                    setScheduleUpdateData(res.data)
                }
                setIsLoadingData(false)

            }).catch(err=>{
                console.log(err)
            })
        }
        
    }
    const onNavigateForward = (nextView, currentView) =>{
        if(currentView === 'months'){
            setIsLoadingData(true)

            var currentDate = moment(navigateDate).format('YYYY-MM-DD');
            var futureMonth = moment(currentDate).add(1, 'M');
            var new_date = new Date(moment(futureMonth).format('YYYY'),moment(futureMonth).format('MM')-1,1)
            setNavigateDate(new_date)
            var data2 = {
                emp_no:selectedEmployeeUpdate,
                month:moment(new_date).format('MM'),
                year:moment(new_date).format('YYYY'),
            }
            getScheduleData(data2)
            .then(res=>{
                console.log(res.data)
                if(res.data.length !== 0){
                    setScheduleUpdateData(JSON.parse(res.data[0].details))
                    setScheduleUpdateData2(res.data[0])
                }else{
                    setScheduleUpdateData(res.data)
                    setSelectedDateHasSched(false)
                }
                setIsLoadingData(false)


            }).catch(err=>{
                console.log(err)
            })
        }
        
    }
    const submitUpdate = ()=>{
        if(selectedWorkSched === null){
            Swal.fire({
                icon:'warning',
                title:'Please select Time Schedule'
            })
        }else{
            Swal.fire({
                icon:'warning',
                title: 'Do you want to save the changes?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
              }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon:'info',
                        title:'Saving data',
                        html:'Please wait...'
                    })
                    Swal.showLoading()
                    if(selectedDateHasSched){
                        scheduleUpdateData.splice(selectedIndex, 1);
                    }
                    var temp_data = scheduleUpdateData;
                    var temp_insert = {
                        day:moment(selectedUpdateDate).format('D'),
                        whrs_code:selectedWorkSched.whrs_code,
                        whrs_desc:selectedWorkSched.whrs_desc,
                    }
                    temp_data.push(temp_insert);
                    var data2 ={
                        emp_no:props.emp.emp_no,
                        dept_code:props.emp.dept_code,
                        data:temp_data,
                        month:moment(selectedUpdateDate).format('M'),
                        year:moment(selectedUpdateDate).format('YYYY')
                    }
                    updateEmpScheduleData(data2)
                    .then(res=>{
                        const result = res.data
                        console.log(result)
                        if(result.status === 200){
                            setScheduleUpdateData(JSON.parse(result.schedule[0].details))
                            setScheduleUpdateData2(result.schedule[0])
                            setShowUpdateModal(false)
                            setSelectedWorkSched(null)
                            setSelectedDateHasSched(false)
                            Swal.fire({
                                icon:'success',
                                title:result.message,
                                showConfirmButton:false,
                                timer:1500
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:result.message
                            })
                        }
                        setIsLoadingData(false)
        
                    }).catch(err=>{
                        Swal.close()
                        console.log(err)
                    })
                }
              })
            
        }
        
    }
    const handleCloseModal = () =>{
        setShowUpdateModal(false)
        setSelectedWorkSched(null)
        setSelectedDateHasSched(false)
    }
    const submitRemove = () =>{
        Swal.fire({
            icon:'warning',
            title:'Do you want to remove this work schedule?',
            showCancelButton: true,
            confirmButtonText: 'Save',

        }).then((result) => {
            if (result.isConfirmed) {
                if(selectedDateHasSched){
                    scheduleUpdateData.splice(selectedIndex, 1);
                }
                var data2 ={
                    emp_no:props.emp.emp_no,
                    data:scheduleUpdateData,
                    month:moment(selectedUpdateDate).format('MM'),
                    year:moment(selectedUpdateDate).format('YYYY')
                }
                Swal.fire({
                    icon:'info',
                    title:'Removing schedule',
                    html:'Please wait...'
                })
                Swal.showLoading()
                removeEmpScheduleData(data2)
                .then(res=>{
                    const result = res.data
                    if(result.status === 200){
                        setScheduleUpdateData(JSON.parse(result.schedule[0].details))
                        setScheduleUpdateData2(result.schedule[0])
                        setShowUpdateModal(false)
                        setSelectedWorkSched(null)
                        setSelectedDateHasSched(false)
                        Swal.fire({
                            icon:'success',
                            title:result.message,
                            showConfirmButton:false,
                            timer:1500
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:result.message
                        })
                    }
                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                })

                // var data2 ={
                //     emp_no:props.emp.emp_no,
                //     date:moment(selectedUpdateDate).format('YYYY-MM-DD'),
                //     month:moment(selectedUpdateDate).format('MM'),
                //     year:moment(selectedUpdateDate).format('YYYY')
                // }
                // removeEmpScheduleData(data2)
                // .then(res=>{
                //     const result = res.data
                //     if(result.status === 200){
                //         setScheduleUpdateData(result.schedule)
                //         setShowUpdateModal(false)
                //         setSelectedWorkSched(null)
                //         Swal.fire({
                //             icon:'success',
                //             title:result.message,
                //             showConfirmButton:false,
                //             timer:1500
                //         })
                //     }else{
                //         Swal.fire({
                //             icon:'error',
                //             title:result.message
                //         })
                //     }
                // }).catch(err=>{
                //     console.log(err)
                // })
            }
        })
        
    }
    const handleOnBeforeNavigate = (nextView, currentView, viewDate) => {
        // console.log(nextView)
        // console.log(currentView)
        // console.log(viewDate)
        if(nextView === 'days'){
            setIsLoadingData(true)

            setNavigateDate(viewDate)
            var data2 = {
                emp_no:selectedEmployeeUpdate,
                month:moment(viewDate).format('MM'),
                year:moment(viewDate).format('YYYY'),
            }
            getScheduleData(data2)
            .then(res=>{
                if(res.data.length !== 0){
                    setScheduleUpdateData(JSON.parse(res.data[0].details))
                    setScheduleUpdateData2(res.data[0])
                }else{
                    setScheduleUpdateData(res.data)
                    setSelectedDateHasSched(false)
                }
                // setScheduleUpdateData(res.data)
                // setScheduleUpdateData2(res.data[0])
                // console.log(res.data)
                setIsLoadingData(false)

            }).catch(err=>{
                console.log(err)
            })
            // console.log(viewDate)
        }
        return nextView
        
        // setSelectedWorkSched(val)
    }
    return(
        <Grid container>
            <Grid item xs={12}>

            <Datetime
                input = {false}
                timeFormat={false}
                renderDay={renderDay}
                value = {selectedUpdateDate}
                onChange = {clickDate}
                dateFormat = 'MMMM DD, YYYY'
                initialViewDate = {props.date}
                onNavigateBack={onNavigateBack}
                onNavigateForward = {onNavigateForward}
                onBeforeNavigate={handleOnBeforeNavigate}
            />
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',flexDirection:'row'}}
                open={isLoadingData}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit" /> &nbsp;
                <Typography>Loading Work Schedule Data...</Typography>
            </Backdrop>
            <Modal
                open={showUpdateTimeModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={updateTimeStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {handleCloseModal}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Updating Time Schedule
                    </Typography>
                    <Grid container spacing={2} sx={{p:2}}>
                        <Grid item xs={12}>
                            <TextField value = {moment(selectedUpdateDate).format('MMMM DD, YYYY')} label ='Date' fullWidth readOnly/>
                        </Grid>
                        <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-work-sched"
                            options={workSchedData}
                            sx={{minWidth:250}}
                            value = {selectedWorkSched}
                            getOptionLabel={(option) => option.whrs_desc}
                            onChange={(event,newValue) => {
                                setSelectedWorkSched(newValue);
                                }}
                            renderInput={(params) => <TextField {...params} label="Time" required/>}
                            />

                        </Grid>
                        <Grid item xs={12}>
                            <hr/>

                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            {
                                selectedDateHasSchedule
                                ?
                                <>
                                <Button variant='outlined' color='error' onClick={submitRemove}>Remove</Button>
                                &nbsp;
                                <Button variant='outlined' color='success' onClick={submitUpdate}>Update</Button>

                                </>
                                :
                                <Button variant='outlined' color='success' onClick={submitUpdate}>Update</Button>
                            }
                            


                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
    )
}