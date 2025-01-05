import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography,Button,Box, Paper, Modal,Skeleton,InputLabel ,MenuItem ,FormControl,Select,Alert,FormGroup,FormControlLabel,Checkbox,Autocomplete,TextField, Tooltip    } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DataTable from 'react-data-table-component';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { getWorkScheduleTemplate,getOffices,searchFilter,addEmployeeWorkSched,getScheduleData,deleteScheduleData } from '.././WorkScheduleRequest';
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
import UpdateEmployeeSchedule from './UpdateEmployeeSchedule';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import HasSchedule from '.././DataTable/HasSchedule';
import NoSchedule from '.././DataTable/NoSchedule';
import UpdateSelectedEmployeeEmpSched from './UpdateSelectedEmpSched';
import AddMultipleSchedModal from './AddMultipleSchedModal';
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
        width: matches?300:900,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
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
    const [selectedMonths,setSelectedMonths] = useState(moment(new Date()).format('YYYY-MM'))
    const [filterMonth,setFilterMonth] = useState('')
    const [toggledClearNoScheduleRows,setToggledClearNoScheduleRows] = useState(false)
    const [toggledClearHasScheduleRows,setToggledClearHasScheduleRows] = useState(false)
    const [selectedEmpSchedData,setSelectedEmpSchedData] = useState([])
    const [selectedEmp,setSelectedEmp] = useState('')
    const [showUpdateSchedModal,setShowUpdateSchedModal] = useState(false)
    const [isLoadingData,setIsLoadingData] = useState(false)
    const [multipleAddModal,setMultipleAddModal] = useState(false)
    const [showData,setShowData] = useState(false)

    
    const deleteAction = (data)=>{
        
        Swal.fire({
            icon:'warning',
            title: "Delete employee's work schedule for the month of "+moment(filterMonth).format('MMMM')+" ?",
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Deleting Schedule',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                setSelectedEmp(data)
                var data2 ={
                    emp_no:data,
                    month:moment(selectedMonths).format('MM'),
                    year:moment(selectedMonths).format('YYYY'),
                    dept_code:filterDepartment.dept_code
                }
                // console.log(data2)
                deleteScheduleData(data2)
                .then(res=>{
                    // console.log(res.data)
                    if(res.data.status === 200){
                        setHasScheduledata(res.data.has_schedule)
                        setData(res.data.no_schedule)
                        setToggledClearHasScheduleRows(!toggledClearHasScheduleRows)
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
                }).catch(err=>{
                    Swal.close();
                    console.log(err)
                })
            }
          })
        
    }
    const updateAction = (data)=>{
        setSelectedEmp(data[0])
        var data2 ={
            emp_no:data[0].emp_no,
            month:moment(filterMonth).format('MM'),
            year:moment(filterMonth).format('YYYY')
        }
        getScheduleData(data2)
        .then(res=>{
            setSelectedEmpSchedData(res.data)
            setShowUpdateSchedModal(true)
        }).catch(err=>{
            console.log(err)
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
    const submitSearchFilter = (event) =>{
        event.preventDefault();
        setIsLoadingData(true)
        if(filterDepartment.length ===0){
            Swal.fire({
                icon:'info',
                title:'Please select Department !'
            })
        }else{
            var data2 = {
                dept_code:filterDepartment.dept_code,
                month:moment(selectedMonths).format('M'),
                year:moment(selectedMonths).format('YYYY')
            }
            searchFilter(data2)
            .then(res=>{
                const data = res.data
                setFilterMonth(selectedMonths)
                setHasScheduledata(data.has_schedule)
                setData(data.no_schedule)
                setToggledClearNoScheduleRows(!toggledClearNoScheduleRows)
                setToggledClearHasScheduleRows(!toggledClearHasScheduleRows)
                setIsLoadingData(false)
                setShowData(true)


    
            }).catch(err=>{
                console.log(err)
            })
        }
        
    }
    // useEffect(()=>{
    //     if(filterDepartment && selectedMonths){
    //         var data2 = {
    //             dept_code:filterDepartment.dept_code,
    //             month:moment(selectedMonths).format('M'),
    //             year:moment(selectedMonths).format('YYYY')
    //         }
    //         searchFilter(data2)
    //         .then(res=>{
    //             const data = res.data
    //             setFilterMonth(selectedMonths)
    //             setHasScheduledata(data.has_schedule)
    //             setData(data.no_schedule)
    //         }).catch(err=>{
    //             console.log(err)
    //         })
    //     }
    // },[filterDepartment,selectedMonths])
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
                emp_list.push(el.emp_no)
            });
            var template_days = []
            var template_days_time = []
            JSON.parse(selectedTemplate.working_days).forEach(el=>{
                template_days.push(el.day)
            })
            var schedule = [];
            var month = moment(selectedMonths).format('MM')-1;
            var year = moment(selectedMonths).format('YYYY');

            var from_period = new Date(year, month, 1);
            var to_period = new Date(year, month, 0);

            var days = [];
            while (from_period.getMonth() === month) {
                if(template_days.includes(moment(from_period).format('dddd'))){
                    JSON.parse(selectedTemplate.working_days).forEach(el2=>{
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
            var data2 = {
                emp_list:emp_list,
                schedule:schedule,
                month:moment(selectedMonths).format('M'),
                year:moment(selectedMonths).format('YYYY'),
                template_id:selectedTemplate.template_id,
                dept_code:filterDepartment.dept_code
            }
            // console.log(data2)
            Swal.fire({
                icon:'info',
                title:'Saving work schedule',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading()
            addEmployeeWorkSched(data2)
            .then(res=>{
                const result = res.data
                if(result.status === 200){
                    var data2 = {
                        dept_code:filterDepartment.dept_code,
                        month:moment(selectedMonths).format('M'),
                        year:moment(selectedMonths).format('YYYY')
                    }
                    searchFilter(data2)
                    .then(res=>{
                        const data = res.data
                        setFilterMonth(selectedMonths)
                        setHasScheduledata(data.has_schedule)
                        setData(data.no_schedule)
                        setSelectedEmployees([])
                        setToggledClearNoScheduleRows(!toggledClearNoScheduleRows)
                        Swal.fire({
                            icon:'success',
                            title:result.message,
                            showConfirmButton:false,
                            timer:1500
                        })
                    }).catch(err=>{
                        console.log(err)
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
        


    }
    const handleChange = ({ selectedRows }) => {
        setSelectedEmployees(selectedRows)
    };
    const hasScheduleHandleChange = ({ selectedRows }) => {
        setSelectedHasScheduleEmployees(selectedRows)
    };
    const [showUpdateEmployeeModal,setShowUpdateEmployeeModal] = useState(false)
    const handleSelectMonth = (value) =>{
        setSelectedMonths(value.target.value)
        setShowData(false);
    }
    return(
        <Box sx={{margin:'20px'}}> 
            <Grid container>
                <Grid item xs={12}>
                    <Button sx={{float:'right'}} onClick ={()=>setMultipleAddModal(true)}><LibraryAddOutlinedIcon/></Button>
                </Grid>
                <Grid item xs={12} >
                    <form onSubmit={submitSearchFilter} style={filterStyle}>

                    <Autocomplete
                        disablePortal
                        id="combo-box-dept"
                        options={deptData}
                        sx={{minWidth:250}}
                        value = {filterDepartment}
                        getOptionLabel={(option) => option.dept_title}
                        onChange={(event,newValue) => {
                            setFilterDepartment(newValue);
                            setShowData(false);

                            }}
                        renderInput={(params) => <TextField {...params} label="Department" required/>}
                        />
                        &nbsp;
                        
                        <TextField type = 'month' label='Month' value = {selectedMonths} onChange = {handleSelectMonth} InputLabelProps={{shrink:true}}/>
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
                    <>
                    <Grid item xs={12} md ={4} lg ={4} sx={{p:1}}>
                        <HasSchedule
                            data = {hasScheduledata}
                            toggledClearHasScheduleRows = {toggledClearHasScheduleRows}
                            filterMonth = {filterMonth}
                            updateAction = {updateAction}
                            deleteAction = {deleteAction}
                        />
                </Grid>
                <Grid item xs={12} md ={4} lg ={4} sx={{p:1}}>
                    <NoSchedule
                        filterMonth = {filterMonth}
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
                                    <Typography sx={{fontWeight:'bold',marginBottom:'5px'}}>Schedule Details:</Typography>
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
                                        <Button variant='outlined'  onClick ={saveData}> Save</Button>

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
                    </>
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
            <Modal
                open={showUpdateSchedModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={updateSchedStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setShowUpdateSchedModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Updating <strong>{selectedEmp.emp_lname}'s</strong> Time Schedule
                    </Typography>
                    <Box>
                        <UpdateSelectedEmployeeEmpSched data = {selectedEmpSchedData} emp={selectedEmp} date = {new Date(moment(filterMonth))}/>

                    </Box>
                </Box>

            </Modal>
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
                    <Box sx={{ p:2,maxHeight:'50vh',overflowY:'scroll'}}>
                        <AddMultipleSchedModal deptData = {deptData} templateData = {templateData}/>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}