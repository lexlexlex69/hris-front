import { Box, Grid,TextField,Typography,Button,Modal,Autocomplete,Tooltip, Fade } from '@mui/material';
import React,{useEffect, useState} from 'react';
import Datetime from "react-datetime";
import moment from 'moment';
import { getScheduleData,getWorkSchedule,updateEmpScheduleData,removeEmpScheduleData } from '../WorkScheduleRequest';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { blue, green, red, yellow, deepOrange } from '@mui/material/colors'
import CircleIcon from '@mui/icons-material/Circle';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';
import { api_url } from '../../../../request/APIRequestURL';
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
    const [selectedDateHasUpdated,setSelectedDateHasUpdated] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(false)
    const [selectedIndex,setSelectedIndex] = useState(-1)
    const [selectedDateHasSched,setSelectedDateHasSched] = useState(false)
    const [selectedDateIsRemoved,setSelectedDateIsRemoved] = useState(false)
    const [updatedSched,setUpdatedSched] = useState([])
    const [removedSched,setRemovedSched] = useState([])
    const [hasAssignTemplate,setHasAssignTemplate] = useState(true)
    useEffect(()=>{
        /**
         * Set updated sched date from template
         */
        if(props.data.length === 0){
            setHasAssignTemplate(false)
        }else{
            setHasAssignTemplate(true)
            // console.log(props.data[0].removed_sched)
            setRemovedSched(JSON.parse(props.data[0].removed_sched))
            setUpdatedSched(JSON.parse(props.data[0].updated_sched))

            var template_days = []
            JSON.parse(props.data[0].working_days).forEach(el=>{
                template_days.push(el.day)
            })
            var year  = props.data[0].year;

            var schedule_data = [];
            var schedule = [];
            /**
             * Convert month to new Date
             */
            // var month_start = moment().month(element)
            var month = moment(props.date).format('MM')-1;
            // var year = moment(month_start).format('YYYY');
            var from_period = new Date(year, month, 1);

            var to_period = new Date(year, month+1, -1);

            /**
             * Loop days for current month
             */
            while (moment(from_period).format('MMMM') === moment(props.date).format('MMMM')) {
                /**
                 * Check if month day exist in template days
                 */
                if(template_days.includes(moment(from_period).format('dddd'))){
                    /**
                     * If month day exist in template days get the template details
                     */
                    JSON.parse(props.data[0].working_days).forEach(el2=>{
                        if(el2.day === moment(from_period).format('dddd')){
                            schedule.push({
                                'day':moment(from_period).format('D'),
                                'whrs_code':el2.whrs_code,
                                'whrs_desc':el2.whrs_desc,
                            });
                        }
                    })
                }
                from_period.setDate(from_period.getDate() + 1);
            }
            schedule_data.push({
                month:moment(props.date).format('M'),
                year:moment(props.date).format('YYYY'),
                schedule:schedule
            })    
            // console.log(props.date)
            console.log(schedule_data[0])
            if(props.data.length !==0){
                setScheduleUpdateData(schedule_data[0].schedule)
                setScheduleUpdateData2(schedule_data[0])
            }else{
                setScheduleUpdateData([])
                setScheduleUpdateData2([])

            }
        }
        
        setSelectedEmployeeUpdate(props.data[0].emp_no)
        let t_data = {
            api_url:api_url,
            key:'b9e1f8a0553623f1:639a3e:17f68ea536b'
        }
        getWorkSchedule(t_data)
        .then(res=>{
            setWorkSchedData(res.data.response)
        }).catch(err=>{
            console.log(err)
        })

    },[])
    const clickDate = (value) =>{
        /**
         * Check if data exist to current sched
         */
        // const index = scheduleUpdateData.findIndex(object => {
        //     return object.day === moment(value._d).format('D');
        // });
        // updatedSched.forEach(el=>{
        //     if(moment(el.date).format('MM-DD-YYYY') === moment(value._d).format('MM-DD-YYYY')){
                
        //         console.log(index)
        //     }
        // })
        // const index = updatedSched.findIndex(object => {
        //     return moment(object.date).format('MM-DD-YYYY') === moment(value._d).format('MM-DD-YYYY');
        // });
        // console.log(index)
        // setSelectedIndex(index)
        setNavigateDate(value)
        setShowUpdateModal(true)
        setSelectedUpdateDate(value._d)
        var has_sched = false;
        var is_removed = false;
        var has_updated = false;
        removedSched.forEach(el=>{
            if(moment(el.date).format('MM-DD-YYYY') === moment(value._d).format('MM-DD-YYYY')){
                is_removed = true;
            }
        })
        if(!is_removed){
            scheduleUpdateData.forEach(element=>{
                if(element.day ===  moment(value._d).format('D') && scheduleUpdateData2.month == moment(value._d).format('M')){
                    has_sched = true;
                    setSelectedDateHasSched(true)
                }
            })
        }else{
            setSelectedDateHasSched(false)
            setSelectedDateIsRemoved(true)
        }
        updatedSched.forEach(el=>{
            if(moment(el.date).format('MM-DD-YYYY') === moment(value._d).format('MM-DD-YYYY')){
                has_updated = true;
            }
        })
        setSelectedDateHasSchedule(has_sched)
        setSelectedDateHasUpdated(has_updated)

        
        // if(!moment(value._d).format('MM-YYYY') === moment(navigateDate).format('MM-YYYY')){
        //     setIsLoadingData(true)
        //     var new_date = moment(value._d).format('YYYY-MM-DD');
        //     setNavigateDate(moment(value._d))
        //     var data2 = {
        //         emp_no:selectedEmployeeUpdate,
        //         month:moment(new_date).format('MM'),
        //         year:moment(new_date).format('YYYY'),
        //     }
        //     getScheduleData(data2)
        //     .then(res=>{
        //         if(res.data.length !== 0){
        //             setHasAssignTemplate(true)
        //             var template_days = []
        //             JSON.parse(res.data[0].working_days).forEach(el=>{
        //                 template_days.push(el.day)
        //             })
        //             var year  = data2.year;

        //             var schedule_data = [];
        //             var schedule = [];
        //             /**
        //              * Convert month to new Date
        //              */
        //             // var month_start = moment().month(element)
        //             var month = moment(new_date).format('MM')-1;
        //             // var year = moment(month_start).format('YYYY');
        //             var from_period = new Date(year, month, 1);

        //             var to_period = new Date(year, month+1, -1);

        //             /**
        //              * Loop days for current month
        //              */
        //             while (moment(from_period).format('MMMM') === moment(new_date).format('MMMM')) {
        //                 /**
        //                  * Check if month day exist in template days
        //                  */
        //                 if(template_days.includes(moment(from_period).format('dddd'))){
        //                     /**
        //                      * If month day exist in template days get the template details
        //                      */
        //                     JSON.parse(res.data[0].working_days).forEach(el2=>{
        //                         if(el2.day === moment(from_period).format('dddd')){
        //                             schedule.push({
        //                                 'day':moment(from_period).format('D'),
        //                                 'whrs_code':el2.whrs_code,
        //                                 'whrs_desc':el2.whrs_desc,
        //                             });
        //                         }
        //                     })
        //                 }
        //                 from_period.setDate(from_period.getDate() + 1);
        //             }
        //             schedule_data.push({
        //                 month:moment(new_date).format('M'),
        //                 year:moment(new_date).format('YYYY'),
        //                 schedule:schedule
        //             })
        //             setUpdatedSched(JSON.parse(res.data[0].updated_sched))
        //             setRemovedSched(JSON.parse(res.data[0].removed_sched))
        //             setScheduleUpdateData(schedule_data[0].schedule)
        //             setScheduleUpdateData2(schedule_data[0])

        //         }else{
        //             setHasAssignTemplate(false)
        //             setSelectedDateHasSched(false)
        //             setScheduleUpdateData(res.data)
        //         }
        //         setIsLoadingData(false)

        //     }).catch(err=>{
        //         console.log(err)
        //     })
        // }
        
    }
    const renderDay = (props, currentDate, selectedDate) => {

        var {key, ...other} = props;
        

        var day = moment(currentDate._d).format('MM-DD-YYYY')

        var schedule = '';
        var is_removed = false;
        var has_updated = false;
        
        removedSched.forEach(el=>{
            if(moment(el.date).format('MM-DD-YYYY') === moment(currentDate._d).format('MM-DD-YYYY')){
                is_removed = true;
            }
        })
        if(!is_removed){
            scheduleUpdateData.forEach(element => {
                if(element.day ===  moment(currentDate._d).format('D') && scheduleUpdateData2.month == moment(currentDate._d).format('M')){
                    schedule = element.whrs_desc;
                }
            });
            updatedSched.forEach(el=>{
                if(moment(el.date).format('MM-DD-YYYY') === moment(currentDate._d).format('MM-DD-YYYY')){
                    schedule = el.whrs_desc;
                    has_updated = true;
                }
            })
        }else{
            schedule = '';
        }
        // var schedule ='';
        // for(var i = 0; i<scheduleUpdateData.length;i++){
        //     if(moment(scheduleUpdateData[i].date).format('MM-DD-YYYY') === moment(currentDate._d).format('MM-DD-YYYY')){
        //         schedule = scheduleUpdateData[i].whrs_desc;
        //         break;
        //     }
        // }
        if(moment(currentDate).format('MM-YYYY') === moment(navigateDate).format('MM-YYYY')){
            if(schedule.length === 0){
                if(scheduleUpdateData.length !==0){
                    return <td {...props} style={{padding:'5px'}}>{currentDate.date()}</td>
                }else{
                    return <td {...props} title='Please select tempalte for this year first' style={{padding:'5px',pointerEvents:'none'}}>{currentDate.date()} <br/> <span style={{background: red[800],
                    borderRadius: '10px',padding: '3px',color:'#fff',fontSize:'.7rem'}} {...other} >No Template</span></td>
                }
            }else{
                return <td {...props} style={{padding:'5px'}}>{currentDate.date()} <br/> <span style={{background:has_updated?'#f00': '#ee782a',
                    borderRadius: '10px',padding: '3px',color:'#fff',fontSize:'.7rem'}} {...other}>{schedule}</span></td>
                
                
            }
        }else{
            return <td {...props} style={{padding:'5px',pointerEvents:'none'}}></td>
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
                    setHasAssignTemplate(true)
                    var template_days = []
                    JSON.parse(res.data[0].working_days).forEach(el=>{
                        template_days.push(el.day)
                    })
                    var year  = data2.year;

                    var schedule_data = [];
                    var schedule = [];
                    /**
                     * Convert month to new Date
                     */
                    // var month_start = moment().month(element)
                    var month = moment(new_date).format('MM')-1;
                    // var year = moment(month_start).format('YYYY');
                    var from_period = new Date(year, month, 1);

                    var to_period = new Date(year, month+1, -1);

                    /**
                     * Loop days for current month
                     */
                    while (moment(from_period).format('MMMM') === moment(new_date).format('MMMM')) {
                        /**
                         * Check if month day exist in template days
                         */
                        if(template_days.includes(moment(from_period).format('dddd'))){
                            /**
                             * If month day exist in template days get the template details
                             */
                            JSON.parse(res.data[0].working_days).forEach(el2=>{
                                if(el2.day === moment(from_period).format('dddd')){
                                    schedule.push({
                                        'day':moment(from_period).format('D'),
                                        'whrs_code':el2.whrs_code,
                                        'whrs_desc':el2.whrs_desc,
                                    });
                                }
                            })
                        }
                        from_period.setDate(from_period.getDate() + 1);
                    }
                    schedule_data.push({
                        month:moment(new_date).format('M'),
                        year:moment(new_date).format('YYYY'),
                        schedule:schedule
                    })
                    setUpdatedSched(JSON.parse(res.data[0].updated_sched))
                    setScheduleUpdateData(schedule_data[0].schedule)
                    setScheduleUpdateData2(schedule_data[0])
                }else{
                    setHasAssignTemplate(false)
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
                if(res.data.length !== 0){
                    setHasAssignTemplate(true)
                    var template_days = []
                    JSON.parse(res.data[0].working_days).forEach(el=>{
                        template_days.push(el.day)
                    })
                    var year  = data2.year;

                    var schedule_data = [];
                    var schedule = [];
                    /**
                     * Convert month to new Date
                     */
                    // var month_start = moment().month(element)
                    var month = moment(new_date).format('MM')-1;
                    // var year = moment(month_start).format('YYYY');
                    var from_period = new Date(year, month, 1);

                    var to_period = new Date(year, month+1, -1);

                    /**
                     * Loop days for current month
                     */
                    while (moment(from_period).format('MMMM') === moment(new_date).format('MMMM')) {
                        /**
                         * Check if month day exist in template days
                         */
                        if(template_days.includes(moment(from_period).format('dddd'))){
                            /**
                             * If month day exist in template days get the template details
                             */
                            JSON.parse(res.data[0].working_days).forEach(el2=>{
                                if(el2.day === moment(from_period).format('dddd')){
                                    schedule.push({
                                        'day':moment(from_period).format('D'),
                                        'whrs_code':el2.whrs_code,
                                        'whrs_desc':el2.whrs_desc,
                                    });
                                }
                            })
                        }
                        from_period.setDate(from_period.getDate() + 1);
                    }
                    schedule_data.push({
                        month:moment(new_date).format('M'),
                        year:moment(new_date).format('YYYY'),
                        schedule:schedule
                    })
                    setUpdatedSched(JSON.parse(res.data[0].updated_sched))
                    setScheduleUpdateData(schedule_data[0].schedule)
                    setScheduleUpdateData2(schedule_data[0])
                }else{
                    setHasAssignTemplate(false)
                    setSelectedDateHasSched(false)
                    setScheduleUpdateData(res.data)
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
                    // if(selectedDateHasSched){
                    //     scheduleUpdateData.splice(selectedIndex, 1);
                    // }
                    const index = updatedSched.findIndex(object => {
                        return moment(object.date).format('MM-DD-YYYY') === moment(selectedUpdateDate).format('MM-DD-YYYY');
                    });

                    if(index !== -1){
                        updatedSched.splice(index, 1);
                    }
                    const removed_index = removedSched.findIndex(object => {
                        return moment(object.date).format('MM-DD-YYYY') === moment(selectedUpdateDate).format('MM-DD-YYYY');
                    });
                    console.log(index)

                    if(removed_index !== -1){
                        removedSched.splice(removed_index, 1);
                    }
                    var temp_data = updatedSched;
                    var temp_insert = {
                        date:moment(selectedUpdateDate).format('YYYY-MM-DD'),
                        whrs_code:selectedWorkSched.whrs_code,
                        whrs_desc:selectedWorkSched.whrs_desc,
                        time_in:selectedWorkSched.whrs_time1,
                        break_out:selectedWorkSched.whrs_time2,
                        break_in:selectedWorkSched.whrs_time3,
                        time_out:selectedWorkSched.whrs_time4,
                    }
                    temp_data.push(temp_insert);
                    var data2 ={
                        emp_no:props.emp.emp_no,
                        dept_code:props.emp.dept_code,
                        data:temp_data,
                        removed_sched:removedSched,
                        year:moment(selectedUpdateDate).format('YYYY'),
                        is_requested:false
                    }
                    // console.log(data2)
                    updateEmpScheduleData(data2)
                    .then(res=>{
                        console.log(res.data.data[0])
                        if(res.data.status === 200){
                            setHasAssignTemplate(true)
                            var new_date = navigateDate;
                            var template_days = []
                            JSON.parse(res.data.data[0].working_days).forEach(el=>{
                                template_days.push(el.day)
                            })
                            var year  = data2.year;

                            var schedule_data = [];
                            var schedule = [];
                            /**
                             * Convert month to new Date
                             */
                            // var month_start = moment().month(element)
                            var month = moment(new_date).format('MM')-1;
                            // var year = moment(month_start).format('YYYY');
                            var from_period = new Date(year, month, 1);

                            var to_period = new Date(year, month+1, -1);

                            /**
                             * Loop days for current month
                             */
                            while (moment(from_period).format('MMMM') === moment(new_date).format('MMMM')) {
                                /**
                                 * Check if month day exist in template days
                                 */
                                if(template_days.includes(moment(from_period).format('dddd'))){
                                    /**
                                     * If month day exist in template days get the template details
                                     */
                                    JSON.parse(res.data.data[0].working_days).forEach(el2=>{
                                        if(el2.day === moment(from_period).format('dddd')){
                                            schedule.push({
                                                'day':moment(from_period).format('D'),
                                                'whrs_code':el2.whrs_code,
                                                'whrs_desc':el2.whrs_desc,
                                            });
                                        }
                                    })
                                }
                                from_period.setDate(from_period.getDate() + 1);
                            }
                            schedule_data.push({
                                month:moment(new_date).format('M'),
                                year:moment(new_date).format('YYYY'),
                                schedule:schedule
                            })
                            setUpdatedSched(JSON.parse(res.data.data[0].updated_sched))
                            setRemovedSched(JSON.parse(res.data.data[0].removed_sched))
                            setScheduleUpdateData(schedule_data[0].schedule)
                            setScheduleUpdateData2(schedule_data[0])
                            setShowUpdateModal(false)
                            setSelectedWorkSched(null)
                            setSelectedDateHasSched(false)
                            handleCloseModal()
                            Swal.fire({
                                icon:'success',
                                title:res.data.message,
                                showConfirmButton:false,
                                timer:1500
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:res.data.message
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
    const submitRemove = (type) =>{
        var rem_title;
        var rem_header;
        var rem_type;
        if(type === 'default'){
            rem_header = 'Confirm delete'
            rem_title = 'Do you want to remove this work schedule?'
            rem_type = 0;
        }
        if(type === 'custom1'){
            rem_header = 'Confirm delete'
            rem_title = "Do you want to remove this work schedule and <strong><em>don't use the default template schedule</em></strong> ?"
            rem_type = 0;
        }
        if(type === 'custom2'){
            rem_header = 'Confirm delete'
            rem_title = "Do you want to remove this work schedule and <strong><em>use the default template schedule</em></strong> ?"
            rem_type = 1;
        }
        if(type === 'custom3'){
            rem_header = 'Confirm update'
            rem_title = "Do you want to <strong><em>use the default template schedule</em></strong> ?"
            rem_type = 2;
        }
        Swal.fire({
            icon:'warning',
            title:rem_header,
            html:rem_title,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor:green[800],
            cancelButtonColor:red[800]

        }).then((result) => {
            if (result.isConfirmed) {
                var remove_sched = []

                const index = updatedSched.findIndex(object => {
                    return moment(object.date).format('MM-DD-YYYY') === moment(selectedUpdateDate).format('MM-DD-YYYY');
                });
                if(index !== -1){
                    updatedSched.splice(index, 1);
                }

                /**
                 * if removed type is Delete current schedule
                 */
                if(rem_type === 0){
                    var rem_sched ={
                        date:moment(selectedUpdateDate).format('YYYY-MM-DD')
                    }
                    /**
                     * Push selected date to removeSched Array
                     */
                    removedSched.push(rem_sched)
                }
                /**
                 * if removed type is Update current schedule to template schedule
                 */
                if(rem_type === 2){
                    const rem_index = removedSched.findIndex(object => {
                        return moment(object.date).format('MM-DD-YYYY') === moment(selectedUpdateDate).format('MM-DD-YYYY');
                    });
                    if(rem_index !== -1){
                        removedSched.splice(rem_index, 1);
                    }
                }
                // remove_sched.push(rem_sched)
                var data2 ={
                    emp_no:props.emp.emp_no,
                    update_data:updatedSched,
                    remove_data:removedSched,
                    year:moment(selectedUpdateDate).format('YYYY'),
                    is_requested:false
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
                        // setScheduleUpdateData(JSON.parse(result.schedule[0].details))
                        // setScheduleUpdateData2(result.schedule[0])
                        // setShowUpdateModal(false)
                        // setSelectedWorkSched(null)
                        // setSelectedDateHasSched(false)
                        handleCloseModal()
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
            var new_date = viewDate;
            var data2 = {
                emp_no:selectedEmployeeUpdate,
                month:moment(viewDate).format('MM'),
                year:moment(viewDate).format('YYYY'),
            }
            getScheduleData(data2)
            .then(res=>{
                if(res.data.length !== 0){
                    setHasAssignTemplate(true)
                    var template_days = []
                    JSON.parse(res.data[0].working_days).forEach(el=>{
                        template_days.push(el.day)
                    })
                    var year  = data2.year;

                    var schedule_data = [];
                    var schedule = [];
                    /**
                     * Convert month to new Date
                     */
                    // var month_start = moment().month(element)
                    var month = moment(new_date).format('MM')-1;
                    // var year = moment(month_start).format('YYYY');
                    var from_period = new Date(year, month, 1);

                    var to_period = new Date(year, month+1, -1);

                    /**
                     * Loop days for current month
                     */
                    while (moment(from_period).format('MMMM') === moment(new_date).format('MMMM')) {
                        /**
                         * Check if month day exist in template days
                         */
                        if(template_days.includes(moment(from_period).format('dddd'))){
                            /**
                             * If month day exist in template days get the template details
                             */
                            JSON.parse(res.data[0].working_days).forEach(el2=>{
                                if(el2.day === moment(from_period).format('dddd')){
                                    schedule.push({
                                        'day':moment(from_period).format('D'),
                                        'whrs_code':el2.whrs_code,
                                        'whrs_desc':el2.whrs_desc,
                                    });
                                }
                            })
                        }
                        from_period.setDate(from_period.getDate() + 1);
                    }
                    schedule_data.push({
                        month:moment(new_date).format('M'),
                        year:moment(new_date).format('YYYY'),
                        schedule:schedule
                    })
                    setUpdatedSched(JSON.parse(res.data[0].updated_sched))
                    setScheduleUpdateData(schedule_data[0].schedule)
                    setScheduleUpdateData2(schedule_data[0])
                }else{
                    setHasAssignTemplate(false)
                    setSelectedDateHasSched(false)
                    setScheduleUpdateData(res.data)
                }
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
        <Fade in>
        <Grid container>
            <Grid item xs={12} sx={{m:2}}>
                <Typography sx={{fontWeight:'bold'}}>Date Legend:</Typography>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-start'}}>
                <Typography><CircleOutlinedIcon sx={{color:'#c4c4c4'}}/><em> No Sched</em></Typography>
                <Typography sx={{ml:2}}><CircleIcon sx={{color:'#ee782a'}}/><em> Template Sched</em></Typography>
                <Typography sx={{ml:2}}><CircleIcon sx={{color:'#f00'}}/><em> Updated Sched</em></Typography>
                </Box>
            </Grid>
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
                                    {
                                        selectedDateHasUpdated
                                        ?
                                        <>
                                        <Tooltip title="Remove and don't use the default template schedule"><Button sx={{'&:hover':{color:'white',background:red[800]}}} variant='outlined' color='error' onClick={()=>submitRemove('custom1')}><DeleteForeverOutlinedIcon/></Button></Tooltip>
                                        &nbsp;
                                        <Tooltip title='Remove and use the default template schedule'><Button sx={{'&:hover':{color:'white',background:deepOrange[800]}}} variant='outlined' color='error' onClick={()=>submitRemove('custom2')}><DeleteOutlineOutlinedIcon/></Button></Tooltip>
                                        </>
                                        :
                                        <Tooltip title="Remove schedule"><Button sx={{'&:hover':{color:'white',background:red[800]}}} variant='outlined' color='error' onClick={()=>submitRemove('default')}><DeleteForeverOutlinedIcon/></Button></Tooltip>
                                    }
                                &nbsp;
                                <Tooltip title='Save Update'><Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='outlined' color='success' onClick={submitUpdate}><SaveAsOutlinedIcon/></Button></Tooltip>
                                </>
                                :
                                    selectedDateIsRemoved
                                    ?
                                    <>
                                    <Tooltip title='Use the default template schedule'><Button sx={{'&:hover':{color:'white',background:deepOrange[800]}}} variant='outlined' color='error' onClick={()=>submitRemove('custom3')}><DeleteOutlineOutlinedIcon/></Button></Tooltip>
                                    &nbsp;
                                    <Tooltip title='Save Update'><Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='outlined' color='success' onClick={submitUpdate}><SaveAsOutlinedIcon/></Button></Tooltip>
                                    </>
                                    :
                                    <Tooltip title='Save Update'><Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='outlined' color='success' onClick={submitUpdate}><SaveAsOutlinedIcon/></Button></Tooltip>
                                
                            }
                            


                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
        </Fade>
    )
}