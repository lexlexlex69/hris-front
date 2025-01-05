import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography,Button,Box, Paper, Modal,Skeleton,InputLabel ,MenuItem ,FormControl,Select,Alert,FormGroup,FormControlLabel,Checkbox,Autocomplete,TextField, Tooltip,Fade,Stack, TableContainer, Table,TableHead, TableRow, TableCell, TableBody, Fab} from '@mui/material';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import AddTemplate from './AddTemplate';
import { getWorkScheduleTemplate,getOffices,searchFilter,addEmployeeWorkSched,getScheduleData,deleteScheduleData,searchDepartmentFilter,showTemplateEmployeeList, searchDepartmentFilterDept, showTemplateEmployeeListDept, getRequestedUpDelData } from './WorkScheduleRequest';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue, green, orange, red, yellow } from '@mui/material/colors'
//icon
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import moment from 'moment';
import Swal from 'sweetalert2';
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import UpdateEmployeeSchedule from './Modal/UpdateEmployeeSchedule';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import HasSchedule from './DataTable/HasSchedule';
import NoSchedule from './DataTable/NoSchedule';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import UpdateSelectedEmployeeEmpSched from './Modal/UpdateSelectedEmpSched';
import AddEmployeeSchedule from './Modal/AddEmployeeSchedule';
import DataTableLoader from '../loader/DataTableLoader';
import WideDataTableLoader from '../loader/WideDataTableLoader';
import ViewEmpList from './Modal/ViewEmpList';
import ManageTemplateModal from './Modal/ManageTemplateModal';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
// var moment2 = require('moment-business-days');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const manageTemplateStyle = {
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
  };
  
export default function ManageWorkScheduleDept(){
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
    const addScheduleStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?300:'100%',
        height:'80vh',
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
    };
    const templateDetailsStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    const empListStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:'70vw',
        minHeight:450,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    const [manageTemplateModal,setManageTemplateModal] = React.useState(false)
    const [showAddScheduleModal,setShowAddScheduleModal] = React.useState(false)
    const [showTemplateDetailsModal,setShowTemplateDetailsModal] = React.useState(false)
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
    const [searchFilterData,setSearchFilterData] = useState([])
    const [templateDetailsName,setTemplateDetailsName] = useState([])
    const [templateDetailsWorkSched,setTemplateDetailsWorkSched] = useState([])
    const [templateDetailsRestSched,setTemplateDetailsRestSched] = useState([])
    const [allDepartment,setAllDepartment] = useState(false)
    const [allDepartmentFilter,setAllDepartmentFilter] = useState(false)
    const [searchFilterDataLoading,setSearchFilterDataLoading] = useState(false)
    const [empListModal,setEmpListModal] = useState(false)
    const [empListModalName,setEmpListModalName] = useState(false)
    const [showAllEmpList,setShowAllEmpList] = useState(false)
    const [requestData,setRequestData] = useState([])
    const [requestData1,setRequestData1] = useState([])
    const [filterRequestData,setFilterRequestData] = useState(['FOR REVIEW','APPROVED','DISAPPROVED'])
    const [selectedFilterRequest,setSelectedFilterRequest] = useState('')
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
    useEffect(()=>{
        getWorkScheduleTemplate()
        .then(response=>{
            const data2 = response.data;
            setTemplateData(data2)

        }).then(res=>{
            getOffices()
            .then(res=>{
                const data = res.data
                setDeptData(data)
                setIsLoading(false)
            }).catch(err=>{
                console.log(err)
            })
        })
        getRequestedUpDelData()
        .then(res=>{
            console.log(res.data)
            setRequestData(res.data)
            setRequestData1(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const searchAllFilterDataColumns = [
        {
            name:'Template Name',
            selector:row=>row.template_name
        },
        // {
        //     name:'Employees per Dept.',
        //     selector:row=>deptInfo(row)
        // },
        {
            name:'Total Employees',
            selector:row=>row.total
        },
        {
            name:'Template Details',
            selector:row=>showTemplateDetails(row)
        },
        {
            name:'',
            selector:row=>
            <Box>
                {/* <Tooltip title ='View Template Details'><Button onClick={()=>showTempDetailsAction(row)}><InfoOutlinedIcon/></Button></Tooltip> */}
                <Tooltip title ='View All Employee List of this template'><Button onClick = {()=>showEmployeeListAction(row,'all')}><ListOutlinedIcon/></Button></Tooltip>
            </Box>
        }
    ]
    const searchFilterDataColumns = [
        {
            name:'Template Name',
            selector:row=>row.template_name
        },
        {
            name:'Total Employees',
            selector:row=>row.total
        },
        {
            name:'Template Details',
            selector:row=>showTemplateDetails(row)
        },
        {
            name:'',
            selector:row=>
            <Box>
                {/* <Tooltip title ='View Template Details'><Button onClick={()=>showTempDetailsAction(row)}><InfoOutlinedIcon/></Button></Tooltip> */}
                <Tooltip title ='View All Employee List of this template'><Button onClick = {()=>showEmployeeListAction(row,'default')} sx={{'&:hover':{color:'#fff',background:blue[800]}}}><ListOutlinedIcon/></Button></Tooltip>
            </Box>
        },
        {
            name:'Status',
            selector:row=><span style={{color:row.status==='FOR REVIEW'?blue[800]:row.status==='APPROVED'?green[800]:red[800]}}>{row.status}</span>
        },
        {
            name:'Remarks',
            selector:row=>row.remarks
        },
    ]
    // const deptInfo = (row)=>{
    //     return(
    //         <Box>
    //         {row.dept_info.map((data,key)=>
    //             <Box key={key} style={{display:'flex', flexDirection:'row',justifyContent:'flex-end'}}>
    //             <Typography >{data.short_name} - {data.dept_total} &nbsp;
    //                 <Tooltip title = {'View '+data.short_name+' List Schedule'}>
    //                 <Button onClick = {()=>showEmployeePerDeptListAction(row,data)} sx={{'&:hover':{color:'#fff',background:blue[800]}}} size='small'><ListOutlinedIcon/></Button></Tooltip>
    //                 <Tooltip title = {(<Box sx={{mb:'-15px'}}><Typography sx={{fontSize:'1.2rem',color:'#ff8100',fontWeight:'bold'}}>Employment Status Details</Typography><ul style={{fontSize:'1rem'}}>{data.emp_status_number.map((data,key)=>
    //                     <li key ={key}>{data.description} - {data.total}</li>
    //                 )}</ul></Box>)}><ContactPageOutlinedIcon color='primary' sx={{'&:hover':{cursor:'pointer'}}}/></Tooltip>
    //             </Typography>
                
    //             </Box>
                
    //         )}
    //         </Box>
    //     )
    // }
    const showEmployeePerDeptListAction = (row,data) => {
        // setPending(true)
        setShowAllEmpList(false)
        Swal.fire({
            icon:'info',
            title:'Loading Employee List',
            html:'Please wait...'
        })
        Swal.showLoading()
        setEmpListModalName(data.short_name)
        var data2 = {
            all_department:false,
            template_id:row.template_id,
            // month:row.month,
            year:row.year,
            dept_code:data.dept_code
        }
        console.log(data2)
        showTemplateEmployeeList(data2)
        .then(res=>{
            setData(res.data)
            Swal.close()
            setEmpListModal(true)
            // setPending(false)

        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const showTemplateDetails = (row)=>{
        var working_days = JSON.parse(row.working_days)
        var rest_days = JSON.parse(row.rest_days)
        return(
            <Box>
                <Typography sx={{fontSize:'.9rem',fontWeight:'bold'}}>Working Days</Typography>
                <ul style={{fontSize:'.8rem'}}>
                    {working_days.map((data,key)=>
                        <li key = {key}>{data.day} - <small style={{color:blue[800],fontWeight:'bold'}}>{data.whrs_desc}</small></li>
                    )}
                </ul>
                <Typography sx={{fontSize:'.9rem',fontWeight:'bold'}}>Rest Days</Typography>
                <ul style={{fontSize:'.8rem'}}>
                    {rest_days.map((data,key)=>
                        <li key = {key}>{data.day}</li>
                    )}
                </ul>
            </Box>
        )

    }
    const showEmployeeListAction = (row,type)=>{
        // Swal.fire({
        //     icon:'info',
        //     title:'Loading Employee List',
        //     html:'Please wait...'
        // })
        // Swal.showLoading()
        console.log(row)
        setData(JSON.parse(row.emp_details))
        // Swal.close()
        setEmpListModal(true)
        // var data2 = {
        //     template_id:row.template_id,
        //     year:row.year,
        // }
        // console.log(data2)
        // showTemplateEmployeeListDept(data2)
        // .then(res=>{
        //     setData(res.data)
        //     // setPending(false)
        //     Swal.close()
        //     setEmpListModal(true)

        // }).catch(err=>{
        //     Swal.close()

        //     console.log(err)
        // })
        
    }
    const showTempDetailsAction = (row)=>{
        setTemplateDetailsName(row.template_name)
        setTemplateDetailsWorkSched(JSON.parse(row.working_days))
        setTemplateDetailsRestSched(JSON.parse(row.rest_days))
        setShowTemplateDetailsModal(true)
    }
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname === null ?'':row.emp_mname.charAt(0)+'.')
        },
        {
            name:'Template Name',
            selector:row=>row.template_name
        },
        // {
        //     name:'Action',
        //     selector:row=><Box><Tooltip title ='Delete Schedule'><Button color='error'><DeleteOutlineOutlinedIcon/></Button></Tooltip></Box>
        // }
    ]
    const tableData = {
        data,
        columns
    }
    const customStyles = {
        rows: {
            style: {
                minHeight: '50px', // override the row height
            },
        },
        headCells: {
            style: {
                fontSize:'.9rem',
                background:blue[800],
                color:'#fff',
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',

            },
        },
        cells: {
            style: {
                fontSize:'1rem'

            },
        },
    };
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
        
        if(!yearValidation(selectedYear)){
            Swal.fire({
                icon:'warning',
                title:'Please input a valid year'
            })
        }
        else{
            setFilterYear(selectedYear)
            setPendingTemplate(true)
            setSearchFilterData([])
            var data2 = {
                year:selectedYear
            }
            searchDepartmentFilterDept(data2)
            .then(res=>{
                const data = res.data.data
                console.log(data)
                if(data.length === 0){
                    Swal.fire({
                        icon:'error',
                        title:'No Data Found !'
                    })
                    setSearchFilterData([])
                }else{
                    setSearchFilterData(data)
                }
                setData([])
                setPendingTemplate(false)
            }).catch(err=>{
                console.log(err)
            })
        }
        
    }
    useEffect(()=>{
        if(workScheduleDays.length ===0){
            console.log(moment(new Date()).format('MMMM DD YYYY'))
        }else{
            if(isWorkingDays){
                var custom_date = workScheduleDays[0].format('01-MM-YYYY')
                var working_days = moment(custom_date, 'DD-MM-YYYY').monthBusinessDays()
                working_days.forEach(el => {
                    console.log(el.format('MM-DD-YYYY'))
                });
            }
        }
        console.log(isWorkingDays)
    },[isWorkingDays])
    const setWorkScheduleWorkingDays = ()=>{
        setIsWorkingDays(!isWorkingDays)
    }
    const handleChange = ({ selectedRows }) => {
        setSelectedEmployees(selectedRows)
    };
    const hasScheduleHandleChange = ({ selectedRows }) => {
        setSelectedHasScheduleEmployees(selectedRows)
    };
    const [showUpdateEmployeeModal,setShowUpdateEmployeeModal] = useState(false)
    const [pending, setPending] = React.useState(false);
    const [pendingTemplate, setPendingTemplate] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
	const handleAllDepartment = () =>{
        setAllDepartment(!allDepartment)
    }
    const ExpandedComponent = ({ data }) =>
    <pre style={{background:'#bff4ff',padding:'10px'}}>
        <Typography sx={{paddingLeft:'40px',fontWeight:'bold'}}>Employees Per Department</Typography>
        <Box  style={{display:'flex', flexDirection:'column',justifyContent:'center',width:'300px'}}>
        {data.dept_info.map((data2,key)=>
                <Typography sx={{ml:10,display:'flex',flexDirection:'row',justifyContent:'space-between',padding:'5px','&:hover':{background:'#00d3ff',borderRadius:'5px'}}} key={key}>{data2.short_name} / <PersonOutlineOutlinedIcon color='primary'/> <em>{data2.dept_total}</em> &nbsp;
                    <Tooltip title = {'View '+data2.short_name+' List Schedule'}>
                    <Button onClick = {()=>showEmployeePerDeptListAction(data,data2)} sx={{'&:hover':{color:'#fff',background:blue[800]}}} size='small'><ListOutlinedIcon/></Button></Tooltip>
                    <Tooltip title = {(<Box sx={{mb:'-15px'}}><Typography sx={{fontSize:'1.2rem',color:'#ff8100',fontWeight:'bold'}}>Employment Status Details</Typography><ul style={{fontSize:'1rem'}}>{data2.emp_status_number.map((data2,key)=>
                        <li key ={key}>{data2.description} - {data2.total}</li>
                    )}</ul></Box>)}><ContactPageOutlinedIcon color='primary' sx={{'&:hover':{cursor:'pointer'}}}/></Tooltip>
                </Typography>
                
                
            )}
        </Box>
        
    </pre>
    const handleFilterRequest = (val)=>{
        setSelectedFilterRequest(val.target.value)
        var t_arr = requestData1.filter((el)=>{
            return el.status === val.target.value
        })
        setRequestData(t_arr)
    }
    const handleRefresh = ()=>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading()
        getRequestedUpDelData()
        .then(res=>{
            console.log(res.data)
            setRequestData(res.data)
            setRequestData1(res.data)
            Swal.close();
        }).catch(err=>{
            console.log(err)
            Swal.close();

        })
    }
    const formatDetails = (row) =>{

       if(row.action === 'UPDATE'){
        var t_update1 = JSON.parse(row.updated_sched)
        var t_update2 = JSON.parse(row.updated_sched_old)
        return <Box sx={{display:'flex',flexDirection:'row'}}>
            <Box sx={{p:1}}>
            <small>Old</small>
            {t_update2.map((r,key)=>
                <div  key={key}>
                <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                <li>{r.whrs_desc}</li>
                </div>
            )}
            </Box>
            <Box sx={{p:1}}>
            <small>New</small>
            {t_update1.map((r,key)=>
                <div  key={key}>
                <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                <li>{r.whrs_desc}</li>
                </div>
            )}
            </Box>
        </Box>
       }
       if(row.action === 'REMOVE'){
        var t_remove = JSON.parse(row.removed_sched)
        return <Box sx={{display:'flex',flexDirection:'row'}}>
            <Box sx={{p:1}}>
            <small>To remove</small>
            {t_remove.map((r,key)=>
                <div  key={key}>
                <li>{moment(r.date).format('MMMM DD, YYYY')}</li>
                </div>
            )}
            </Box>
        </Box>
       }
    }
    return(
        <Box sx={{margin:'0 10px'}}>
            {
                isLoading
                ?
                <Stack spacing={2}>
                        <Skeleton variant="text" height={'70px'} animation="wave"/>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Skeleton variant="text" height={'70px'} width='200px' animation="wave"/> &nbsp;
                            <Skeleton variant="text" height={'70px'} width='200px' animation="wave"/>
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Skeleton variant="text" height={'90px'} width='300px' animation="wave"/> &nbsp;
                            <Skeleton variant="text" height={'90px'} width='200px' animation="wave"/> &nbsp;
                            <Skeleton variant="text" height={'90px'} width='60px' animation="wave"/>
                        </Box>
                </Stack>
                :
                <Fade in = {!isLoading}>
                    <Grid container>
                        <Grid item xs={12}>
                        <Alert severity="info"><ConstructionOutlinedIcon fontSize='small'/> This module is under development. Some functionality will be available soon. </Alert>

                        </Grid>

                        {/* <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                            <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                    <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                                    &nbsp;
                                    Manage Work Schedule
                                </Typography>

                            </Box>
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title ='Manage Work Schedule (Dept)'/>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:1}}>
                                    <Tooltip title='Manage Template'><Button color='primary' variant='contained' onClick={()=>setManageTemplateModal(true)} className='custom-roundbutton' startIcon={<DesignServicesOutlinedIcon/>} size='large'>Template</Button></Tooltip>

                                    <Tooltip title='Add / Update Schedule'><Button color='success' variant='contained' onClick={()=>setShowAddScheduleModal(true)} className='custom-roundbutton' startIcon={<AddTaskOutlinedIcon/>} size='large'>Schedule</Button></Tooltip>
                                    {/* <Fab variant="extended" color="primary" onClick={()=>setManageTemplateModal(true)}>
                                        <DesignServicesOutlinedIcon sx={{ mr: 1 }} />
                                        Template
                                    </Fab> */}
                                    {/* <Button variant = 'outlined' color='success' onClick={()=>setManageTemplateModal(true)} startIcon={<DesignServicesOutlinedIcon/>} sx={{'&:hover':{color:'#fff',background:green[800]}}}>Manage Template</Button> */}
                                    {/* <Fab variant="extended" color="success" onClick={()=>setShowAddScheduleModal(true)}>
                                        <AddTaskOutlinedIcon sx={{ mr: 1 }} />
                                        Schedule
                                    </Fab> */}
                                    
                                    {/* <Button variant = 'outlined' onClick={()=>setShowAddScheduleModal(true)} startIcon={<AddTaskOutlinedIcon/>} sx={{'&:hover':{color:'#fff',background:blue[800]}}}>Add / Update Schedule</Button> */}
                                    {/* <Button variant = 'outlined' onClick = {()=>setShowUpdateEmployeeModal(true)} startIcon={<EditOutlinedIcon/>}>Update Schedule</Button> */}
                            </Box> 
                            <hr/>
                        </Grid>
                        {/* <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked = {allDepartment} onChange = {handleAllDepartment} />} label="All Department" />
                            </FormGroup>
                        </Grid> */}
                        <Grid item xs={12}>
                            <form onSubmit = {submitSearchFilter} style={filterStyle}>
                            {/* <Autocomplete
                                disablePortal
                                id="combo-box-dept"
                                options={deptData}
                                sx={{minWidth:300}}
                                value = {filterDepartment}
                                getOptionLabel={(option) => option.dept_title}
                                onChange={(event,newValue) => {
                                    setFilterDepartment(newValue);
                                    }}
                                renderInput={(params) => <TextField {...params} label="Department" required ={allDepartment?false:true}/>}
                                />
                                &nbsp; */}
                                <TextField type = 'text' label='Year' value = {selectedYear} onChange = {(value)=>setSelectedYear(value.target.value)} inputProps={{maxLength:4}} required/>
                                &nbsp;
                                <Tooltip title ='Search Added Work Schedule'><Button variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip>
                            </form>
                        </Grid>
                        
                        {
                            pendingTemplate
                            ?
                            <Grid xs={12}>

                            <WideDataTableLoader/>
                            </Grid>
                            :
                        ''

                        }
                        {
                            searchFilterData.length !==0
                            ?
                            <>
                            <Grid item xs={12} md ={12} lg={12}sx={{p:2,mt:2}}>
                            {/* <Typography sx={{fontWeight:'bold'}}><span style ={{color:green[800]}}>Added Work Schedule</span></Typography> */}
                                    <DataTable
                                        // title={<Typography sx={{color:blue[800],fontSize:'1.2rem',fontWeight:'bold'}}>List of template assign to employees</Typography>}
                                        data = {searchFilterData}
                                        columns = {allDepartmentFilter?searchAllFilterDataColumns:searchFilterDataColumns}
                                        paginationPerPage={5}
                                        paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                        paginationComponentOptions={{
                                            rowsPerPageText: 'Records per page:',
                                            rangeSeparatorText: 'out of',
                                        }}
                                        pagination
                                        highlightOnHover
                                        progressPending={pendingTemplate}
                                        progressComponent={<DataTableLoader />}
                                        customStyles = {customStyles}
                                        fixedHeader
                                        fixedHeaderScrollHeight="400px"
                                        expandableRows = {allDepartmentFilter?true:false}
                                        expandableRowsComponent={ExpandedComponent}

                                    />               
                            </Grid>
                            </>
                            :
                            ''
                        }
                        <Grid item xs={12} sx={{mt:2}}>
                            <hr/>
                            <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',alignItems:matches?'auto':'center',mb:1}}>
                                <Typography sx={{padding: '10px',background: blue[800],color: '#fff',borderTopRightRadius: '20px',fontSize:matches?'.8rem':'auto',mb:matches?1:0}}>List of requested delete/update work sched</Typography>
                                <Box sx={{display:'flex',alignItems:'center'}}>
                                    <FormControl sx={{width:300}}>
                                        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedFilterRequest}
                                        label="Filtewr"
                                        onChange={handleFilterRequest}
                                        >
                                        {
                                            filterRequestData.map((row,key)=>
                                                <MenuItem value={row} key={key}>{row}</MenuItem>
                                            )
                                        }
                                    
                                        </Select>
                                    </FormControl>
                                    &nbsp;
                                    <Tooltip title='Refresh data'><IconButton className='custom-iconbutton' color='primary' onClick={handleRefresh}><RefreshIcon/></IconButton></Tooltip>
                                </Box>
                                

                            </Box>
                            <Paper>
                                <TableContainer sx={{maxHeight:'50vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Employee Name
                                                </TableCell>
                                                <TableCell>
                                                    Action
                                                </TableCell>
                                                <TableCell>
                                                    Year
                                                </TableCell>
                                                <TableCell>
                                                    Status
                                                </TableCell>
                                                <TableCell>
                                                    Disapproved Reason
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                requestData.length>0
                                                ?
                                                requestData.map((row,key)=>
                                                    <TableRow key={key} hover>
                                                        <TableCell>
                                                            {row.emp_lname}, {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+',':''}
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong style={{color:row.action==='REMOVE'?red[800]:green[800]}}>{row.action}</strong>
                                                            {
                                                                row.action === 'DELETE'
                                                                ?
                                                                null
                                                                :
                                                                // <Tooltip title={formatDetails(row)}><IconButton color='primary' size='small'><InfoOutlinedIcon/></IconButton></Tooltip>
                                                                formatDetails(row)
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>{row.year}</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <em>
                                                            <span style={{fontWeight:'bold',color:row.status==='FOR REVIEW'?blue[800]:row.status==='DISAPPROVED'?red[800]:green[800]}}>{row.status}</span></em>
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.reason}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                                :
                                                <TableRow><TableCell colSpan={5} align='center'>No data...</TableCell></TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    {/* <Modal
                        open={manageTemplateModal}
                        onClose={()=>setManageTemplateModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={manageTemplateStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setManageTemplateModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Manage Template Schedule
                            </Typography>
                            <Box sx={{height:'80vh',p:2}}>
                                <ManageTemplateModal close = {()=>setManageTemplateModal(false)}/>
                            </Box>
                        </Box>
                    </Modal> */}
                    {/* <Modal
                        open={showAddScheduleModal}
                        onClose={()=>setShowAddScheduleModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={addScheduleStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setShowAddScheduleModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Adding Employee Work Schedule
                            </Typography>
                            <Box sx={{maxHeight:'70vh',overflowY:'scroll'}}>
                                <AddEmployeeSchedule close = {()=>setShowAddScheduleModal(false)}/>
                            </Box>
                        </Box>
                    </Modal> */}
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
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setShowUpdateSchedModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Updating <strong>{selectedEmp.emp_lname}'s</strong> Time Schedule
                            </Typography>
                            <Box>
                                <UpdateSelectedEmployeeEmpSched data = {selectedEmpSchedData} emp={selectedEmp}/>

                            </Box>
                        </Box>

                    </Modal> */}
                    <Modal
                        open={empListModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box sx={empListStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setEmpListModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">Employee List
                            </Typography>
                            <Box>
                                <ViewEmpList data = {data} emp={selectedEmp}/>

                            </Box>
                        </Box>

                    </Modal>
                    <Modal
                        open={showTemplateDetailsModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box sx={templateDetailsStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setShowTemplateDetailsModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Template details for <strong>{templateDetailsName}</strong>
                            </Typography>
                            <Box sx={{m:2}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                    <Typography sx={{fontSize: '1.1rem',background: '#ff8100',color: '#fff',textAlign: 'center',borderRadius: '5px'}}>Working Days</Typography>
                                    <ul>
                                        {templateDetailsWorkSched.map((data,key)=>
                                            <li key = {key} style={{fontSize:'.8rem'}}>{data.day}</li>
                                        )}
                                    </ul>

                                    </Grid>
                                    <Grid item xs={6}>
                                    <Typography sx={{fontSize: '1.1rem',background: '#ff8100',color: '#fff',textAlign: 'center',borderRadius: '5px'}}>Rest Days</Typography>
                                    <ul>
                                        {templateDetailsRestSched.map((data,key)=>
                                            <li key = {key} style={{fontSize:'.8rem'}}>{data.day}</li>
                                        )}
                                    </ul>

                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                    </Modal>
                    <Dialog
                        fullScreen
                        open={showAddScheduleModal}
                        onClose={()=>setShowAddScheduleModal(false)}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={()=>setShowAddScheduleModal(false)}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Add / Update Employee Work Schedule
                            </Typography>
                            <Button autoFocus color="inherit" onClick={()=>setShowAddScheduleModal(false)}>
                            Close
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <Box sx={{maxHeight:'100%',overflowY:'scroll'}}>
                            <AddEmployeeSchedule close = {()=>setShowAddScheduleModal(false)}/>
                        </Box>
                    </Dialog>
                    <Dialog
                        fullScreen
                        open={manageTemplateModal}
                        onClose={()=>setManageTemplateModal(false)}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={()=>setManageTemplateModal(false)}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Manage Template
                            </Typography>
                            <Button autoFocus color="inherit" onClick={()=>setManageTemplateModal(false)}>
                            Close
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <Box sx={{maxHeight:'100%',overflowY:'scroll',p:2}}>
                            <ManageTemplateModal close = {()=>setManageTemplateModal(false)}/>
                        </Box>
                    </Dialog>
                    </Grid>
                </Fade>
            }
            
            
        </Box>
    )
}
