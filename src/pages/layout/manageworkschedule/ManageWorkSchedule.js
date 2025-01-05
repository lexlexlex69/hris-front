import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography,Button,Box, Paper, Modal,Skeleton,InputLabel ,MenuItem ,FormControl,Select,Alert,FormGroup,FormControlLabel,Checkbox,Autocomplete,TextField, Tooltip,Fade,Stack} from '@mui/material';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import AddTemplate from './AddTemplate';
import { getWorkScheduleTemplate,getOffices,searchFilter,addEmployeeWorkSched,getScheduleData,deleteScheduleData,searchDepartmentFilter,showTemplateEmployeeList, getAddedWorkSched, getRequestedDelWorkSched, getRequestedUpdateWorkSched, getApproverType } from './WorkScheduleRequest';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue, green, orange, red, yellow } from '@mui/material/colors'
//icon
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Badge from '@mui/material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';import moment from 'moment';
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
import NewAddedWorkSchedule from './Dialog/NewAddedWorkSchedule';
// var moment2 = require('moment-business-days');
import './ManageWorkSchedule.css';
import RequestDeleteWorkSchedule from './Dialog/RequestDeleteWorkSchedule';
import RequestUpdateWorkSchedule from './Dialog/RequestUpdateWorkSchedule';
import { APIError } from '../customstring/CustomString';

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
  
export default function ManageWorkSchedule(){
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
    const [showNewAddedScheduleModal,setShowNewAddedScheduleModal] = React.useState(false)
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
    const [newAddWorkScheduleData,setNewAddWorkScheduleData] = useState([])
    const [reqDelData,setReqDelData] = useState([])
    const [reqUpdateData,setReqUpdateData] = useState([])
    const [approverType,setApproverType] = useState([])
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
                APIError(err)
                console.log(err)
            })
        })
        getAddedWorkSched()
        .then(res=>{
            // console.log(res.data)
            setNewAddWorkScheduleData(res.data.data)
        }).catch(err=>{
            console.log(err)
            APIError(err)
        })
        getRequestedDelWorkSched()
        .then(res=>{
            // console.log(res.data)
            setReqDelData(res.data.data)
        }).catch(err=>{
            console.log(err)
            APIError(err)

        })
        getRequestedUpdateWorkSched()
        .then(res=>{
            // console.log(res.data)
            setReqUpdateData(res.data.data)
        }).catch(err=>{
            console.log(err)
            APIError(err)

        })
        _init()
    },[])
    const _init = async () =>{
        //check if approver type
        const res = await getApproverType();
        setApproverType(res.data.data)
    }
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
        }
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
                        <li key = {key}>{data.day} <em><small style={{color:blue[800],fontWeight:'bold'}}>({data.whrs_desc})</small></em></li>
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
        if(filterDepartment !== null){
            setEmpListModalName(filterDepartment.short_name)
        }
        if(type === 'all'){
            setShowAllEmpList(true)
        }else{
            setShowAllEmpList(false)
        }
        // setPending(true)
        Swal.fire({
            icon:'info',
            title:'Loading Employee List',
            html:'Please wait...'
        })
        Swal.showLoading()
        if(allDepartmentFilter){
            var data2 = {
                all_department:allDepartmentFilter,
                template_id:row.template_id,
                // month:row.month,
                year:row.year,
            }
            console.log(data2)
            showTemplateEmployeeList(data2)
            .then(res=>{
                setData(res.data)
                // setPending(false)
                Swal.close()
                setEmpListModal(true)
    
            }).catch(err=>{
                Swal.close()

                console.log(err)
            })
        }else{
            var data2 = {
                all_department:allDepartmentFilter,
                template_id:row.template_id,
                // month:row.month,
                year:row.year,
                dept_code:filterDepartment?.dept_code,
                admin:approverType?.admin
            }
            showTemplateEmployeeList(data2)
            .then(res=>{
                setData(res.data.data)
                // setPending(false)
                Swal.close()
                setEmpListModal(true)
    
            }).catch(err=>{
                console.log(err)
            })
        }
        
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
                fontSize:'1.2rem',
                background:blue[500],
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
            setAllDepartmentFilter(allDepartment)
            if(allDepartment){
                var data2 = {
                    all_department:allDepartment,
                    // month:moment(selectedYear).format('MM'),
                    year:selectedYear
                }
                searchDepartmentFilter(data2)
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
            }else{
                var data2 = {
                    all_department:allDepartment,
                    dept_code:filterDepartment?.dept_code,
                    // month:moment(selectedYear).format('MM'),
                    year:selectedYear,
                    admin:approverType?.admin
                }
                console.log(data2)
                searchDepartmentFilter(data2)
                .then(res=>{
                    const data = res.data.data
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
        
    }
    useEffect(()=>{
        if(workScheduleDays.length ===0){
            // console.log(moment(new Date()).format('MMMM DD YYYY'))
        }else{
            if(isWorkingDays){
                var custom_date = workScheduleDays[0].format('01-MM-YYYY')
                var working_days = moment(custom_date, 'DD-MM-YYYY').monthBusinessDays()
                working_days.forEach(el => {
                    console.log(el.format('MM-DD-YYYY'))
                });
            }
        }
        // console.log(isWorkingDays)
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
    const [showRequestDeleteScheduleModal,setShowRequestDeleteScheduleModal] = useState(false)
    const [showRequestUpdateScheduleModal,setShowRequestUpdateScheduleModal] = useState(false)
    const [pending, setPending] = React.useState(false);
    const [pendingTemplate, setPendingTemplate] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
	const handleAllDepartment = () =>{
        setAllDepartment(!allDepartment)
    }
    const ExpandedComponent = ({ data }) =>
    <pre style={{background:'#f5f5f5',padding:'10px'}}>
        <Typography sx={{paddingLeft:'40px',fontWeight:'bold'}}>Employees Per Department</Typography>
        <Box  style={{display:'flex', flexDirection:'column',justifyContent:'center',width:'300px'}}>
        {data.dept_info.map((data2,key)=>
                <Typography sx={{ml:10,display:'flex',flexDirection:'row',justifyContent:'space-between',padding:'5px','&:hover':{background:'#dddddd',borderRadius:'5px'}}} key={key}>{data2.short_name} / <PersonOutlineOutlinedIcon color='primary'/> <em>{data2.dept_total}</em> &nbsp;
                    <Tooltip title = {'View '+data2.short_name+' List Schedule'}>
                    <Button onClick = {()=>showEmployeePerDeptListAction(data,data2)} sx={{'&:hover':{color:'#fff',background:blue[800]}}} size='small'><ListOutlinedIcon/></Button></Tooltip>
                    <Tooltip title = {(<Box sx={{mb:'-15px'}}><Typography sx={{fontSize:'1.2rem',color:'#ff8100',fontWeight:'bold'}}>Employment Status Details</Typography><ul style={{fontSize:'1rem'}}>{data2.emp_status_number.map((data2,key)=>
                        <li key ={key}>{data2.description} - {data2.total}</li>
                    )}</ul></Box>)}><ContactPageOutlinedIcon color='primary' sx={{'&:hover':{cursor:'pointer'}}}/></Tooltip>
                </Typography>
                
                
            )}
        </Box>
        
    </pre>
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

                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title ='Manage Work Schedule'/>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:1}}>
                                    {/* <Tooltip title='Manage Template'><IconButton className='custom-iconbutton' color='success' onClick={()=>setManageTemplateModal(true)} sx={{'&:hover':{color:'#fff',background:green[800]}}}><DesignServicesOutlinedIcon/></IconButton></Tooltip> */}


                                    {/* <Button variant = 'outlined' color='success' onClick={()=>setManageTemplateModal(true)} startIcon={<DesignServicesOutlinedIcon/>} sx={{'&:hover':{color:'#fff',background:green[800]}}}>Manage Template</Button> */}

                                    {/* <Tooltip title='Add / Update Schedule'><IconButton className='custom-iconbutton' color='primary' onClick={()=>setShowAddScheduleModal(true)} sx={{'&:hover':{color:'#fff',background:blue[800]}}}><AddTaskOutlinedIcon/></IconButton></Tooltip> */}

                                    {/* <Button variant = 'outlined' onClick={()=>setShowAddScheduleModal(true)} startIcon={<AddTaskOutlinedIcon/>} sx={{'&:hover':{color:'#fff',background:blue[800]}}}>Add / Update Schedule</Button> */}

                                    {
                                        matches
                                        ?
                                        <>
                                        <Badge badgeContent={newAddWorkScheduleData.length} color="primary"><Tooltip title='Manage newly added work schedule'><IconButton className='custom-iconbutton' color='info' sx={{'&:hover':{color:'#fff',background:blue[600]}}} onClick={()=>setShowNewAddedScheduleModal(true)}><CalendarMonthIcon/></IconButton></Tooltip></Badge>

                                        <Badge badgeContent={reqUpdateData.length} color="primary"><Tooltip title='Manage request for update of work schedule'><IconButton className='custom-iconbutton' color='primary' sx={{'&:hover':{color:'#fff',background:blue[400]}}} onClick={()=>setShowRequestUpdateScheduleModal(true)}><CalendarTodayIcon/></IconButton></Tooltip></Badge>

                                        <Badge badgeContent={reqDelData.length} color="primary"><Tooltip title='Manage request for deletion of work schedule'><IconButton className='custom-iconbutton' color='error' sx={{'&:hover':{color:'#fff',background:red[600]}}} onClick={()=>setShowRequestDeleteScheduleModal(true)}><DeleteIcon/></IconButton></Tooltip></Badge>

                                       
                                        </>
                                        :
                                        <>
                                        <Badge badgeContent={newAddWorkScheduleData.length} color="primary">
                                        <Tooltip title='Manage newly added work schedule'><Button variant='outlined' className='custom-roundbutton' color='info' onClick={()=>setShowNewAddedScheduleModal(true)} startIcon={<CalendarMonthIcon/>}>Newly Added</Button></Tooltip>
                                        </Badge>
                                        
                                        <Badge badgeContent={reqUpdateData.length} color="primary"><Tooltip title='Manage request for update of work schedule'><Button variant='outlined' className='custom-roundbutton' color='primary' onClick={()=>setShowRequestUpdateScheduleModal(true)} startIcon={<CalendarTodayIcon/>}>To Update</Button></Tooltip></Badge>

                                        <Badge badgeContent={reqDelData.length} color="info"><Tooltip title='Manage request for deletion of work schedule'><Button variant='outlined' className='custom-roundbutton' color='error' onClick={()=>setShowRequestDeleteScheduleModal(true)} startIcon={<DeleteIcon/>}>To Delete</Button></Tooltip></Badge>

                                        
                                        </>
                                    }
                                    

                                    {/* <Badge badgeContent={newAddWorkScheduleData.length} color="primary"><Tooltip title='Manage newly added work schedule'><IconButton className='custom-iconbutton' color='info' sx={{'&:hover':{color:'#fff',background:blue[600]}}} onClick={()=>setShowNewAddedScheduleModal(true)}><CalendarMonthIcon/></IconButton></Tooltip></Badge>
                                    <Badge badgeContent={reqDelData.length} color="primary"><Tooltip title='Manage request for deletion of work schedule'><IconButton className='custom-iconbutton' color='error' sx={{'&:hover':{color:'#fff',background:red[600]}}} onClick={()=>setShowRequestDeleteScheduleModal(true)}><DeleteIcon/></IconButton></Tooltip></Badge>
                                    <Badge badgeContent={reqUpdateData.length} color="primary"><Tooltip title='Manage request for update of work schedule'><IconButton className='custom-iconbutton' color='primary' sx={{'&:hover':{color:'#fff',background:blue[400]}}} onClick={()=>setShowRequestUpdateScheduleModal(true)}><CalendarTodayIcon/></IconButton></Tooltip></Badge> */}
                            </Box> 
                            <hr/>
                        </Grid>
                        {
                            approverType?.admin
                            ?
                            <>
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked = {allDepartment} onChange = {handleAllDepartment} />} label="All Department" />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <form onSubmit = {submitSearchFilter} style={filterStyle}>
                                <Autocomplete
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
                                    &nbsp;
                                    <TextField type = 'text' label='Year' value = {selectedYear} onChange = {(value)=>setSelectedYear(value.target.value)} inputProps={{maxLength:4}} required/>
                                    &nbsp;
                                    <Tooltip title ='Search Filter'><Button variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip>
                                </form>
                            </Grid>
                            </>
                            :
                            <>
                            <Grid item xs={12}>
                                <form onSubmit = {submitSearchFilter} style={filterStyle}>
                                    <TextField type = 'text' label='Year' value = {selectedYear} onChange = {(value)=>setSelectedYear(value.target.value)} inputProps={{maxLength:4}} required/>
                                    &nbsp;
                                    <Tooltip title ='Search Filter'><Button variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip>
                                </form>
                            </Grid>
                            </>
                        }
                        
                        
                        {
                            pendingTemplate
                            ?
                            <Grid item xs={12}>

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
                            <Typography sx={{fontSize:'1.5rem',fontWeight:'bold'}}><span style ={{color:green[800]}}>List of Template Schedule</span></Typography>
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
                                <UpdateSelectedEmployeeEmpSched data = {selectedEmpSchedData} emp={selectedEmp}/>

                            </Box>
                        </Box>

                    </Modal>
                    <Modal
                        open={empListModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box sx={empListStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setEmpListModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Employee List
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
                    <Dialog
                        fullScreen
                        open={showNewAddedScheduleModal}
                        onClose={()=>setShowNewAddedScheduleModal(false)}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={()=>setShowNewAddedScheduleModal(false)}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Newly Added Employee Work Schedule
                            </Typography>
                            <Button autoFocus color="inherit" onClick={()=>setShowNewAddedScheduleModal(false)}>
                            Close
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <Box sx={{maxHeight:'100%',overflowY:'scroll'}}>
                            <NewAddedWorkSchedule data = {newAddWorkScheduleData} close = {()=>setShowNewAddedScheduleModal(false)} setNewAddWorkScheduleData = {setNewAddWorkScheduleData}/>
                        </Box>
                    </Dialog>
                    <Dialog
                        fullScreen
                        open={showRequestDeleteScheduleModal}
                        onClose={()=>setShowRequestDeleteScheduleModal(false)}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={()=>setShowRequestDeleteScheduleModal(false)}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Requested Deletion of Employee's Work Schedule
                            </Typography>
                            <Button autoFocus color="inherit" onClick={()=>setShowRequestDeleteScheduleModal(false)}>
                            Close
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <Box sx={{maxHeight:'100%',overflowY:'scroll'}}>
                            <RequestDeleteWorkSchedule close = {()=>setShowRequestDeleteScheduleModal(false)} data = {reqDelData} setReqDelData = {setReqDelData}/>
                        </Box>
                    </Dialog>
                    <Dialog
                        fullScreen
                        open={showRequestUpdateScheduleModal}
                        onClose={()=>setShowRequestUpdateScheduleModal(false)}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={()=>setShowRequestUpdateScheduleModal(false)}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Requested Update of Employee's Work Schedule
                            </Typography>
                            <Button autoFocus color="inherit" onClick={()=>setShowRequestUpdateScheduleModal(false)}>
                            Close
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <Box sx={{maxHeight:'100%',overflowY:'scroll'}}>
                            <RequestUpdateWorkSchedule close = {()=>setShowRequestUpdateScheduleModal(false)} data = {reqUpdateData} setReqUpdateData = {setReqUpdateData}/>
                        </Box>
                    </Dialog>
                    </Grid>
                </Fade>
            }
            
            
        </Box>
    )
}
