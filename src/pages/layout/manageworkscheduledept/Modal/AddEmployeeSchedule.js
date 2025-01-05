import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography,Button,Box, Paper, Modal,Skeleton,InputLabel ,MenuItem ,FormControl,Select,Alert,FormGroup,FormControlLabel,Checkbox,Autocomplete,TextField, Tooltip, Fade    } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DataTable from 'react-data-table-component';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { getWorkScheduleTemplate,getOffices,searchFilter,addEmployeeWorkSched,getScheduleData,deleteScheduleData, postWorkSchedAPI, searchFilterDept, addEmployeeWorkSchedDept, deleteScheduleDataDept, requestDelSchedDataDept } from '.././WorkScheduleRequest';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue, green, red, yellow } from '@mui/material/colors'
//icon
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import moment from 'moment';
import Swal from 'sweetalert2';
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import UpdateEmployeeSchedule from './UpdateEmployeeSchedule';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import HasSchedule from '.././DataTable/HasSchedule';
import NoSchedule from '.././DataTable/NoSchedule';
import UpdateSelectedEmployeeEmpSched from './UpdateSelectedEmpSched';
import AddMultipleSchedModal from './AddMultipleSchedModal';
import LargeModal from '../../custommodal/LargeModal';
import { APILoading } from '../../apiresponse/APIResponse';
var moment2 = require('moment-business-days');

const templateStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    minWidth:'330px',
    maxWidth:'90vw',
    marginBottom: 0,
    bgcolor: '#fff',
    border: '2px solid #fff',
    borderRadius:3, 
    boxShadow: 24,
    p: 4,
  };
  
export default function AddEmployeeSchedule(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const updateEmployeeTimeStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:900,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    const addMultipleSchedStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:900,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    const filterStyle = {
        display:'flex',
        flexDirection:matches?'column':'row',
        justifyContent:'flex-end',
        mt:2
    }
    const updateSchedStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':900,
        // height:matches?'90%':'auto',
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    const styleMonthModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        borderRadius:'5px'
    };
    const [openTemplate,setopenTemplate] = React.useState(false)
    const [templateData,setTemplateData] = React.useState([])
    const [selectedTemplate, setSelectedTemplate] = React.useState('');
    const [selectedTemplateWorkingDaysDetails,setSelectedTemplateWorkingDaysDetails] = React.useState([])
    const [selectedTemplateRestDaysDetails,setSelectedTemplateRestDaysDetails] = React.useState([])

    const [employeeData,setEmployeeData] = React.useState([])
    const [deptData,setDeptData] = React.useState([])
    const [filterDepartment,setFilterDepartment] = React.useState(null)

    const [data,setData] = React.useState([]);
    const [hasScheduledata,setHasScheduledata] = React.useState([]);
    const [workScheduleDays,setWorkScheduleDays] = useState([])
    const [isWorkingDays,setIsWorkingDays] = useState(false)
    const [selectedEmployees,setSelectedEmployees] = useState([])
    const [selectedHasScheduleEmployees,setSelectedHasScheduleEmployees] = useState([])
    const [selectedYear,setSelectedYear] = useState('')
    const [filterYear,setFilterYear] = useState('')
    const [toggledClearNoScheduleRows,setToggledClearNoScheduleRows] = useState(false)
    const [toggledClearHasScheduleRows,setToggledClearHasScheduleRows] = useState(false)
    const [selectedEmpSchedData,setSelectedEmpSchedData] = useState([])
    const [selectedEmp,setSelectedEmp] = useState('')
    const [showUpdateSchedModal,setShowUpdateSchedModal] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(false)
    const [multipleAddModal,setMultipleAddModal] = useState(false)
    const [showData,setShowData] = useState(false)
    const [isRequested,setIsRequested] = useState(false)

    
    const deleteAction = (data,reason)=>{
        Swal.fire({
            icon:'info',
            title:'Deleting Schedule',
            html:'Please wait...',
            // allowEscapeKey:false,
            // allowOutsideClick:false
        })
        Swal.showLoading()
        setSelectedEmp(data)
        var data2 ={
            emp_no:data,
            // month:moment(selectedYear).format('MM'),
            // year:selectedYear,
            // dept_code:filterDepartment.dept_code,
            reason:reason
        }
        console.log(data2)
        requestDelSchedDataDept(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                // setHasScheduledata(res.data.has_schedule)
                // setData(res.data.no_schedule)
                setToggledClearHasScheduleRows(!toggledClearHasScheduleRows)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    html:res.data.message2,
                    // showConfirmButton:false,
                    // timer:3500
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })

        // Swal.fire({
        //     icon:'warning',
        //     title: "Request to delete selected employee's work schedule for the year "+selectedYear+"?",
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes',
        //   }).then((result) => {
        //     /* Read more about isConfirmed, isDenied below */
        //     if (result.isConfirmed) {
        //         Swal.fire({
        //             icon:'info',
        //             title:'Deleting Schedule',
        //             html:'Please wait...',
        //             allowEscapeKey:false,
        //             allowOutsideClick:false
        //         })
        //         Swal.showLoading()
        //         setSelectedEmp(data)
        //         var data2 ={
        //             emp_no:data,
        //             month:moment(selectedYear).format('MM'),
        //             year:selectedYear,
        //             dept_code:filterDepartment.dept_code
        //         }
        //         // console.log(data2)
        //         deleteScheduleData(data2)
        //         .then(res=>{
        //             // console.log(res.data)
        //             if(res.data.status === 200){
        //                 setHasScheduledata(res.data.has_schedule)
        //                 setData(res.data.no_schedule)
        //                 setToggledClearHasScheduleRows(!toggledClearHasScheduleRows)
        //                 Swal.fire({
        //                     icon:'success',
        //                     title:res.data.message,
        //                     showConfirmButton:false,
        //                     timer:1500
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
    const updateAction = (data,requested)=>{
        APILoading('info','Loading Data','Please wait...')
        setSelectedEmp(data[0])
        setIsRequested(requested)
        var data2 ={
            emp_no:data[0].emp_no,
            month:moment(filterYear).format('MM'),
            year:moment(filterYear).format('YYYY')
        }
        getScheduleData(data2)
        .then(res=>{
            setSelectedEmpSchedData(res.data)
            setShowUpdateSchedModal(true)
            Swal.close()
        }).catch(err=>{
            console.log(err)
            Swal.close()

        })
    }
    const [multipleMonth,setMultiple] = useState([
        {
            'month':'',
            'days':[]
        }
    ])
    const addMonth = () => {
        var temp = [...multipleMonth];

        temp.push({
            'month':'',
            'days':[]
        })
        setMultiple(temp)
    }
    const handleSetTemplate = (event) => {
        var data = event.target.value
        var working_days = JSON.parse(data.working_days)
        var rest_days = JSON.parse(data.rest_days)
        setSelectedTemplateWorkingDaysDetails(working_days)
        setSelectedTemplateRestDaysDetails(rest_days)
        setSelectedTemplate(event.target.value);
    };
    useEffect(()=>{
        getWorkScheduleTemplate()
        .then(response=>{
            const data2 = response.data;
            setTemplateData(data2)
        }).catch(error=>{
            console.log(error)
        })
        var i = 0;
        var temp_employee = [];
        while(i<=10){
            temp_employee.push('Employee '+i)
            i++
        }
        setEmployeeData(temp_employee)
        getOffices()
        .then(res=>{
            const data = res.data
            setDeptData(data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname === null ?'':row.emp_mname.charAt(0)+'.')
        }
    ]
    const hasScheduleColumns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname === null ?'':row.emp_mname.charAt(0)+'.')
        }
    ]
    const  yearValidation = (year) => {

        var text = /^[0-9]+$/;
        if (year != 0) {
            if ((year != "") && (!text.test(year))) {
    
                // alert("Please Enter Numeric Values Only");
                return false;
            }
    
            if (year.length != 4) {
                // alert("Year is not proper. Please check");
                return false;
            }
            // var current_year=new Date().getFullYear();
            // if((year < 1920) || (year > current_year))
            //     {
            //     // alert("Year should be in range 1920 to current year");
            //     return false;
            //     }
            return true;
        }
      }
    const submitSearchFilter = (event) =>{
        event.preventDefault();
        console.log('here')
        if(!yearValidation(selectedYear)){
            Swal.fire({
                icon:'info',
                title:'Please input valid year !'
            })
        }else{
            setIsLoadingData(true)
            var data2 = {
                // dept_code:filterDepartment.dept_code,
                // month:moment(selectedYear).format('M'),
                year:selectedYear
            }
            searchFilterDept(data2)
            .then(res=>{
                const data = res.data
                setFilterYear(selectedYear)
                setHasScheduledata(data.has_schedule)
                setData(data.no_schedule)
                setToggledClearNoScheduleRows(!toggledClearNoScheduleRows)
                setToggledClearHasScheduleRows(!toggledClearHasScheduleRows)
                setIsLoadingData(false)
                setShowData(true)
            }).catch(err=>{
                setIsLoadingData(false)
                console.log(err)
            })
        }
        
    }
    // useEffect(()=>{
    //     if(filterDepartment && selectedYear){
    //         var data2 = {
    //             dept_code:filterDepartment.dept_code,
    //             month:moment(selectedYear).format('M'),
    //             year:selectedYear
    //         }
    //         searchFilter(data2)
    //         .then(res=>{
    //             const data = res.data
    //             setFilterYear(selectedYear)
    //             setHasScheduledata(data.has_schedule)
    //             setData(data.no_schedule)
    //         }).catch(err=>{
    //             console.log(err)
    //         })
    //     }
    // },[filterDepartment,selectedYear])
    // useEffect(()=>{
    //     if(workScheduleDays.length ===0){
    //         console.log(moment(new Date()).format('MMMM DD YYYY'))
    //     }else{
    //         if(isWorkingDays){
    //             var custom_date = workScheduleDays[0].format('01-MM-YYYY')
    //             var working_days = moment(custom_date, 'DD-MM-YYYY').monthBusinessDays()
    //             working_days.forEach(el => {
    //                 console.log(el.format('MM-DD-YYYY'))
    //             });
    //         }
    //     }
    //     console.log(isWorkingDays)
    // },[isWorkingDays])
    const setWorkScheduleWorkingDays = ()=>{
        setIsWorkingDays(!isWorkingDays)
    }
    const saveData = ()=>{
        if(selectedEmployees.length === 0 ){
            Swal.fire({
                icon:'info',
                title:'Please select employee'
            })
        }else{
            var emp_list = [];
            selectedEmployees.forEach(el => {
                emp_list.push({emp_no:el.emp_no,dept_code:el.dept_reassigned})
            });
            var data2 = {
                emp_list:emp_list,
                months:isSpecificMonth?selectedMonths:[],
                template_id:selectedTemplate.template_id,
                year:filterYear,
            }
            let fin_sched_days = [];

            if(isSpecificMonth){
                console.log('here')
                selectedMonths.forEach(el=>{
                    let start_date = new Date(filterYear,moment().month(el).format('M')-1,1);
                    let end_date = new Date(filterYear,moment().month(el).format('M'),0);
                    console.log(start_date +' - '+end_date)

                    let days = JSON.parse(selectedTemplate.working_days)
                    /**
                    * Get day names
                    */
                    let temp_d_name = [];
                    days.forEach(el=>{
                        temp_d_name.push(el.day);
                    })
                    let sched_days = [];

                    while(moment(start_date,'MM-DD-YYYY').format('YYYY-MM') <= moment(end_date,'MM-DD-YYYY').format('YYYY-MM')){
                        if(temp_d_name.includes(moment(start_date,'MM-DD-YYYY').format('dddd'))){

                            for(var i = 0 ;i<days.length ;i++){
                                if(days[i].day === moment(start_date,'MM-DD-YYYY').format('dddd')){
                                    var sched_data = {
                                        whrs_code:days[i].whrs_code,
                                        date1:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                        date2:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                    }
                                    sched_days.push(sched_data)
                                } 
                            }
                        }
                        start_date.setDate(start_date.getDate()+1)
                        // console.log(moment(start_date,'MM-DD-YYYY').format('dddd'))
                    }
                    selectedEmployees.forEach(el => {
                        sched_days.forEach(el2=>{
                            var d = {
                                emp_no:el.emp_no,
                                whrs_code:el2.whrs_code,
                                date1:el2.date1,
                                date2:el2.date2,
                            }
                            fin_sched_days.push(d)
                        })
                    });
                })
            }else{
                let start_date = new Date(filterYear,0,1);
                let end_date = new Date(filterYear,12,1);
                let days = JSON.parse(selectedTemplate.working_days)
                /**
                * Get day names
                */
                let temp_d_name = [];
                days.forEach(el=>{
                    temp_d_name.push(el.day);
                })
                let sched_days = [];

                while(parseInt(moment(start_date,'MM-DD-YYYY').format('YYYY')) <= filterYear){
                    if(temp_d_name.includes(moment(start_date,'MM-DD-YYYY').format('dddd'))){

                        for(var i = 0 ;i<days.length ;i++){
                            if(days[i].day === moment(start_date,'MM-DD-YYYY').format('dddd')){
                                var sched_data = {
                                    whrs_code:days[i].whrs_code,
                                    date1:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                    date2:moment(start_date,'MM-DD-YYYY').format('YYYY-MM-DD'),
                                }
                                sched_days.push(sched_data)
                            } 
                        }
                    }
                    start_date.setDate(start_date.getDate()+1)
                    // console.log(moment(start_date,'MM-DD-YYYY').format('dddd'))
                }
                selectedEmployees.forEach(el => {
                    sched_days.forEach(el2=>{
                        var d = {
                            emp_no:el.emp_no,
                            whrs_code:el2.whrs_code,
                            date1:el2.date1,
                            date2:el2.date2,
                        }
                        fin_sched_days.push(d)
                    })
                });
            }
            
            var d2 = {
                'data':fin_sched_days,
                'key':'b9e1f8a0553623f1:639a3e:17f68ea536b',
                'year':filterYear,
                'emp_list':emp_list
            }
            console.log(d2)
            Swal.fire({
                icon:'info',
                title:'Saving work schedule',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading()
            addEmployeeWorkSchedDept(data2)
            .then(res=>{
                const result = res.data
                if(result.status === 200){
                    setHasScheduledata(result.has_schedule)
                    setData(result.no_schedule)
                    setSelectedEmployees([])
                    setToggledClearNoScheduleRows(!toggledClearNoScheduleRows)
                    Swal.fire({
                        icon:'success',
                        title:result.message+'. Please wait for the approval from your Admin.',
                        showConfirmButton:false,
                        timer:2000
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

            // postWorkSchedAPI(d2)
            // .then(res=>{
            //     console.log(res.data)
            //     if(res.data.status === 200){
            //         addEmployeeWorkSchedDept(data2)
            //         .then(res=>{
            //             const result = res.data
            //             if(result.status === 200){
            //                 setHasScheduledata(result.has_schedule)
            //                 setData(result.no_schedule)
            //                 setSelectedEmployees([])
            //                 setToggledClearNoScheduleRows(!toggledClearNoScheduleRows)
            //                 Swal.fire({
            //                     icon:'success',
            //                     title:result.message,
            //                     showConfirmButton:false,
            //                     timer:1500
            //                 })
                            
            //             }else{
            //                 Swal.fire({
            //                     icon:'error',
            //                     title:result.message
            //                 })
            //             }
            //         }).catch(err=>{
            //             Swal.close()
            //             console.log(err)
            //         })
            //     }else{
            //         Swal.fire({
            //             icon:'error',
            //             title:res.data.message
            //         })
            //     }
            // }).catch(err=>{
            //     Swal.close();
            //     console.log(err)
            // })
            
            
        }
        


    }
    const handleChange = ({ selectedRows }) => {
        setSelectedEmployees(selectedRows)
    };
    const hasScheduleHandleChange = ({ selectedRows }) => {
        setSelectedHasScheduleEmployees(selectedRows)
    };
    const [showUpdateEmployeeModal,setShowUpdateEmployeeModal] = useState(false)
    const handleSelectYear = (value) =>{
        setSelectedYear(value.target.value)
        setShowData(false);
    }
    const [openMonthModal,setOpenMonthModal] = useState(false)
    const [isSpecificMonth,setIsSpecificMonth] = useState(false)
    const [selectedMonths,setSelectedMonths] = useState([])
    const [monthsData,setMonthsData] = useState(moment.months())
    const handleOpenMonthModal = ()=>{
        setOpenMonthModal(true)
    }
    const handleCloseMonthModal = ()=>{
        setOpenMonthModal(false)
        setSelectedMonths([])
    }
    const handleSetIsSpecificMonth = () => {
        setIsSpecificMonth((current)=>!current)
    }
    const handleSaveMonths = () => {
        setOpenMonthModal(false)
    }
    useEffect(()=>{
        if(isSpecificMonth){
            handleOpenMonthModal()
        }
    },[isSpecificMonth])
    return(
        <Fade in>
        <Box sx={{margin:'20px'}}> 
            <Grid container>
                {/* <Grid item xs={12} sx={{mb:1}}>
                    <Tooltip title = 'Add Multiple Work Schedule'><Button sx={{float:'right'}} onClick ={()=>setMultipleAddModal(true)} variant='outlined'><LibraryAddOutlinedIcon/></Button></Tooltip>
                </Grid> */}
                <Grid item xs={12} >
                    <form onSubmit={submitSearchFilter} style={filterStyle}>
                        <TextField type = 'text' label='Year' value = {selectedYear} onChange = {handleSelectYear} inputProps = {{maxLength:4}} required/>
                        {/* <DatePicker
                            multiple
                            onlyMonthPicker 
                            /> */}
                        &nbsp;
                        <Tooltip title ='Search Filter'><Button variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip>
                        </form>
                    
                    </Grid>
                <Grid item xs={12}>
                    <hr/>
                </Grid>
                    
                {
                    showData
                    ?
                    <Fade in>
                        <Box sx={{width:'100%',display:'flex',flexDirection:matches?'column':'row'}}>
                        <Grid item xs={12} md ={4} lg ={4} sx={{p:1}}>
                            <HasSchedule
                                data = {hasScheduledata}
                                toggledClearHasScheduleRows = {toggledClearHasScheduleRows}
                                filterYear = {filterYear}
                                updateAction = {updateAction}
                                deleteAction = {deleteAction}
                                setData = {setData}
                                setHasScheduledata = {setHasScheduledata}
                                setToggledClearHasScheduleRows = {setToggledClearHasScheduleRows}
                            />
                        </Grid>
                        <Grid item xs={12} md ={4} lg ={4} sx={{p:1}}>
                            <NoSchedule
                                filterYear = {filterYear}
                                data = {data}
                                columns={columns}
                                handleChange = {handleChange}
                                toggledClearNoScheduleRows = {toggledClearNoScheduleRows}
                            />
                        </Grid>
                        <Grid item xs={12} md ={4} lg ={4} sx={{p:1}}>
                        <Grid item xs={12} sx={{padding:'5px'}}>
                                    <Grid item xs={12}>
                                        {/* <Typography sx={{background: blue[800],padding: '10px',textAlign: 'center',color: '#fff'}}>Selecting Template</Typography> */}
                                        {/* <br/> */}
                                        <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Work Schedule Template</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedTemplate}
                                        label="Work Schedule Template"
                                        onChange={handleSetTemplate}
                                        >
                                        {templateData.map((data,key)=>
                                            <MenuItem value={data} key={key}>{data.template_name}</MenuItem>
                                        )}
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                    {
                                        selectedTemplate.length !==0
                                        ?
                                        <Grid item xs={12} sx={{p:2,margin:'10px 0 10px 0',border:'solid 1px #c4c4c4',borderRadius:'5px'}}>
                                            {/* <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                                <Typography sx={{fontWeight:'bold',marginBottom:'5px'}}>Schedule Details:
                                                </Typography>
                                                <FormControlLabel control={<Checkbox checked={isSpecificMonth} onChange={handleSetIsSpecificMonth}/>} label="Specific Month" />
                                            </Box> */}
                                            <Box severity="info" sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-start',flexWrap:'wrap'}}>
                                                {selectedTemplateWorkingDaysDetails.map((data,key)=>
                                                    <Typography key = {key} sx={{background:'#e4e4e4',p:1,mr:1,borderRadius:'20px',fontSize:'.8rem',mb:1,'&:hover':{background:'#c4c4c4'}}}>{data.day} - {data.whrs_desc}</Typography>
                                                )}
                                            </Box>
                                            {/* <Typography sx={{fontSize:'1.2em',mt:2}}>Month</Typography> */}
                                                {/* <FormGroup>
                                                    <FormControlLabel control={<Checkbox onChange = {setWorkScheduleWorkingDays} checked={isWorkingDays}/>} label="Working Days" />
                                                </FormGroup>
                                            <Button onClick={addMonth}>+</Button> */}
                                            <Box sx={{mt:2,display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                                <Tooltip title='Save Work Schedule'><Button className='custom-roundbutton' variant='contained'  onClick ={saveData} color='success'> Save</Button></Tooltip>

                                            </Box>
                                            {/* {multipleMonth.map((data,key)=>
                                                <Box key={key}>
                                                    <DatePicker
                                                        onlyMonthPicker
                                                        multiple
                                                        value ={data.month}
                                                    />
                                                </Box>
                                            )

                                            } */}
                                            {/* <DatePicker
                                                onlyMonthPicker
                                            />
                                            <DatePicker
                                                multiple
                                                value ={workScheduleDays}
                                                onChange = {(value)=>setWorkScheduleDays(value)}
                                                
                                            /> */}
                                        </Grid>  
                                        :
                                        ''
                                    }
                                    
                                </Grid>
                            </Grid>
                            </Box>
                        </Fade>
                        :
                        ''
                }
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 ,display:'flex',flexDirection:'row'}}
                open={isLoadingData}
                // onClick={handleClose}
                >
                    <CircularProgress color="inherit" /> &nbsp;
                    <Typography>Loading Work Schedule List...</Typography>
                </Backdrop>
                
            </Grid>
            <LargeModal open = {showUpdateSchedModal} close={()=> setShowUpdateSchedModal(false)} title={`Updating ${selectedEmp.emp_lname}'s Work Schedule`}>
                <Box sx={{maxHeight:'85dvh',overflow:'auto'}}>
                    <UpdateSelectedEmployeeEmpSched data = {selectedEmpSchedData} emp={selectedEmp} date = {new Date(moment(filterYear))} close = {()=> setShowUpdateSchedModal(false)} isRequested = {isRequested}/>
                </Box>
            </LargeModal>
            <Modal
                open={showUpdateEmployeeModal}
                onClose={()=>setShowUpdateEmployeeModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={updateEmployeeTimeStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setShowUpdateEmployeeModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Update Employee Schedule
                    </Typography>
                    <Box sx={{ p:2}}>
                        <UpdateEmployeeSchedule deptData = {deptData}/>
                    </Box>
                </Box>
            </Modal>
            {/* <Modal
                open={showUpdateSchedModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={updateSchedStyle}>
                    {
                        matches
                        ?
                        <>
                        <CancelOutlinedIcon sx={{fontSize:'.8rem'}} className='custom-close-icon-btn' onClick = {()=> setShowUpdateSchedModal(false)}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase',fontSize:'1rem'}} variant="h6" component="h2">
                        Updating <strong>{selectedEmp.emp_lname}'s</strong> Time Schedule
                        </Typography>
                        </>
                        :
                        <>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setShowUpdateSchedModal(false)}/>
                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Updating <strong>{selectedEmp.emp_lname}'s</strong> Time Schedule
                        </Typography>
                        </>
                    }
                    
                    <Box sx={{maxHeight:'75vh',overflow:'scroll'}}>
                        <UpdateSelectedEmployeeEmpSched data = {selectedEmpSchedData} emp={selectedEmp} date = {new Date(moment(filterYear))} close = {()=> setShowUpdateSchedModal(false)} isRequested = {isRequested}/>

                    </Box>
                </Box>

            </Modal> */}
            <Modal
                open={multipleAddModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={addMultipleSchedStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setMultipleAddModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Adding Multiple Employee Schedule
                    </Typography>
                    <Box sx={{ p:2,maxHeight:'70vh',overflowY:'scroll',mt:2,mb:2}}>
                        <AddMultipleSchedModal deptData = {deptData} templateData = {templateData} close = {()=> setMultipleAddModal(false)}/>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={openMonthModal}
                onClose={handleCloseMonthModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleMonthModal}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Selecting Specific Month
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                   <Autocomplete
                        sx={{}}
                        disablePortal
                        id="combo-box-demo"
                        value={selectedMonths}
                        options={monthsData}
                        onChange={(event,newValue)=>{
                            setSelectedMonths(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label="Months" />}
                        multiple
                        disableCloseOnSelect
                    />
                </Typography>
                <Box sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                    <Button variant='contained' color='success' className='custom-roundbutton' size='small' onClick={handleSaveMonths}>Save</Button>
                    <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCloseMonthModal}>Cancel</Button>
                </Box>
                </Box>
            </Modal>
        </Box>
        </Fade>
    )
}