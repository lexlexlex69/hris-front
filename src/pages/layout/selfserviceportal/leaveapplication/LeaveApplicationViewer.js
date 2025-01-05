import { Grid,Box,Fade ,FormControl,InputLabel,Select,MenuItem, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,TextField, IconButton, Tooltip, Button} from '@mui/material';
import React,{useEffect, useState} from 'react';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { auditLogs } from '../../auditlogs/Request';
import { getAllLeaveApplication, getAllTypeOfLeave, updateLeaveStatus } from './LeaveApplicationRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import {blue,red,green, orange} from '@mui/material/colors';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { color } from 'highcharts';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Padding, RotateRight } from '@mui/icons-material';
import SmallestModal from '../../custommodal/SmallestModal';
import { APIError, APISuccess } from '../../customstring/CustomString';
import { api_url } from '../../../../request/APIRequestURL';
import { APILoading } from '../../apiresponse/APIResponse';
import LargeModal from '../../custommodal/LargeModal';
import PreviewLeaveApplicationForm from './PreviewLeaveApplicationForm';
export default function LeaveApplicationViewer(){
     // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 14,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        },
    }));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([]);
    const [data1,setData1] = useState([]);
    const [authInfo,setAuthInfo] = useState([])
    const [ctoInfo,setCtoInfo] = useState([{
        cto_hr_name:'',
        cto_hr_name_pos:'',
        cto_cmo_name:'',
        cto_cmo_name_pos:''
    }]);
    const [typeOfLeaveData,setTypeOfLeaveData] = useState([]);
    useEffect(()=>{
        checkPermission(15)
        .then((response)=>{
            // console.log(response.data)
            var logs = {
                action:'ACCESS ONLINE LEAVE VIEWER',
                action_dtl:'ACCESS ONLINE LEAVE VIEWER MODULE',
                module:'ONLINE LEAVE VIEWER'
            }
            auditLogs(logs)
            setIsLoading(false)
            if(response.data){
                getAllLeaveApplication()
                .then(res=>{
                    setData(res.data.data)
                    setData1(res.data.data)
                    setAuthInfo(res.data.auth_info)
                    setCtoInfo(res.data.cto_info)
                }).catch(err=>{

                })
                //request to get the list of types of leave
                getAllTypeOfLeave()
                .then((response)=>{
                    const data = response.data
                    setTypeOfLeaveData(data)
                }).catch((error)=>{
                    console.log(error)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }

        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const [filter,setFilter] = useState('');
    const handleFilterChange = (val)=>{
        setFilter(val.target.value)
        if(val.target.value === 'DEFAULT'){
            setData(data1)
        }else if(val.target.value === 'FOR REVIEW HR'){
            var t_arr = data1.filter((el)=>{
                return el.status === 'FOR REVIEW' && el.remarks === 'FOR HR APPROVAL'
            })
            setData(t_arr)
        }else{
            var t_arr = data1.filter((el)=>{
                return el.status === val.target.value
            })
            setData(t_arr)
        }
        
    }
    const [searchVal,setSearchVal] = useState('');
    // const filterData = data.filter(el=>el.fullname?.toUpperCase().trim().includes(searchVal.toUpperCase().trim()));
    const columns = [
        {
            name: 'Employee Name',
            selector: row => row.fullname,
            style:{
                textTransform:'uppercase'
            }
        },
        {
            name: 'Office/Department',
            selector: row => row.officedepartment
        },
        {
            name: 'Type of Leave',
            selector: row => row.short_name
        },
        {
            name: 'Inclusive Dates',
            selector: row => row.inclusive_dates_text
        },
        {
            name: 'No. of days/hours applied',
            selector: row => (row.leave_type_id === 14? `${row.days_hours_applied} hrs.`: `${row.days_hours_applied} ${row.days_hours_applied>1?'days':'day'}`)
        },
        {
            name: 'Date filed',
            selector: row => (row.date_of_filing && moment(row.date_of_filing).format('MMMM DD, YYYY h:mm A'))
        },
        {
            name: 'Date AO reviewed',
            selector: row => (row.reviewed_at && moment(row.reviewed_at).format('MMMM DD, YYYY h:mm A'))
        },
        {
            name: 'Date HR reviewed',
            selector: row => (row.hr_approval_at && moment(row.hr_approval_at).format('MMMM DD, YYYY h:mm A'))
        },
        {
            name: 'Date Dept reviewed',
            selector: row => (row.recommendation_at && moment(row.recommendation_at).format('MMMM DD, YYYY h:mm A'))
        },
        {
            name: 'Status',
            selector: row => row.status,
            style:{
                fontStyle:'itatic'
            },
            conditionalCellStyles:[
                {
                    when:row=>row.status === 'FOR REVIEW',
                    style:{
                        color:blue[800]
                    },
                },
                {
                    when:row=>row.status === 'FOR RECOMMENDATION',
                    style:{
                        color:blue[700]
                    },
                },
                {
                    when:row=>row.status === 'FOR APPROVAL',
                    style:{
                        color:orange[800]
                    },
                },
                {
                    when:row=>row.status === 'APPROVED',
                    style:{
                        color:green[800]
                    },
                }
                ,
                {
                    when:row=>row.status === 'DISAPPROVED' || row.status === 'CANCELLED',
                    style:{
                        color:red[800]
                    },
                }
            ]
        },
        {
            name: 'Remarks',
            selector: row => (row.remarks&&row.remarks)
        },
        {
            name: 'Date Printed',
            selector: row => formatPrintDate(row)
        },
        {
            name:'Action',
            selector:row=>(
                <Box sx={{display:'flex',p:1,flexWrap:'wrap',gap:1}}>
                
                <Tooltip title='View Application Form'>
                    <IconButton color='info' size='small' className='custom-iconbutton' onClick={()=>showLeaveForm(row)}><VisibilityIcon/></IconButton>
                </Tooltip>
                <Tooltip title='Update Status'>
                    <IconButton color='secondary' size='small' className='custom-iconbutton' onClick={()=>handleOpenUpdateStat(row)}>
                    <RotateRight/>
                    </IconButton>
                </Tooltip>
                </Box>
            )
        }
    ];
    const [employeeInfo,setEmployeeInfo] = useState([])
    const [previewModalOpen,setPreviewModalOpen] = useState(false)
    const showLeaveForm = (data) => {
        setPreviewModalOpen(true)

        setEmployeeInfo(data)
        console.log(data)
        setaoAssign({...aoAssign,
            office_ao:data.ao_name,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.dept_head_name,
            office_head_pos:data.dept_head_position,
        })
    }
    const [openSeeMore,setOpenSeeMore] = useState(false);
    const [seeMoreData,setSeeMoreData] = useState([])
    const handleSeeMore = (item)=>{
        setSeeMoreData(item);
        setOpenSeeMore(true);
    }
    const handleCloseSeeMore = ()=>{
        setSeeMoreData([])
        setOpenSeeMore(false)
    }
    const formatPrintDate = (item) => {
        let arr = JSON.parse(item.print_history)
        if(arr.length>1){
            return (
                <Box>
                {
                    <small>{arr[0].date_time_format}</small>
                }
                <br/>
                <a href='#' onClick={()=>handleSeeMore(arr)}>See more...</a>
                </Box>
            )
        }else{
            return (
                arr.map((row,key)=>{
                return (
                    <small key = {key}>{row.date_time_format}</small>
                )
                })
            )
        }
        
    }
    const tableData = {
        columns,
        data,
    };
    const customStyles = {
        rows: {
            style: {
                // minHeight: '50px', // override the row height
                // fontSize:'.7rem'
            },
        },
        headCells: {
            style: {
                // paddingLeft: '5px', // override the cell padding for head cells
                // paddingRight: '5px',
                background:blue[800],
                padding:'10px',
                color:'#fff'
            },
        }
       
    };
    const [openUpdateStat,setOpenUpdateStat] = useState(false);
    const [selectedUpdate,setSelectedUpdate] = useState();
    
    const handleOpenUpdateStat = (item) => {
        console.log(item)
        const {leave_application_id,days_with_pay,status,emp_no,ref_no,dept_code,leave_type_id,employee_id} = item
        setSelectedUpdate({
            id:leave_application_id,
            days:days_with_pay,
            old_status:status,
            emp_no:emp_no,
            dept_code:dept_code,
            leave_type_id:leave_type_id,
            employee_id:employee_id,
            ref_no:ref_no
        })
        setOpenUpdateStat(true)
    }
    const [status,setStatus] = useState('')
    const handleSaveUpdate = async () =>{
        try{
            APILoading('info','Updating Leave Status','Please wait...')
            const res = await updateLeaveStatus({
                data:selectedUpdate,
                type:status,
                api_url:api_url
            })
            console.log(res.data)
            if(res.data.status === 200){
                //update leave application data
                let temp = [...data];
                let index = temp.findIndex(el=>el.leave_application_id === selectedUpdate.id)
                temp[index].status = res.data.leave_status;
                temp[index].remarks = res.data.leave_remarks;
                setData(temp);
                setOpenUpdateStat(false)
                setStatus('')
                APISuccess(res.data.message)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    const handleCloseUpdateStat = ()=>{
        setStatus('')
        setOpenUpdateStat(false)
    }
    const [aoAssign,setaoAssign] = useState({
        office_ao:'',
        office_ao_assign:''
    });
    const [officeHead,setofficeHead] = useState({
        office_head:'',
        office_name:''
    });
    return (
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading actionButtons={1}/>
                :
                <Fade in>
                    <Grid container>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        <ModuleHeaderText title ='Leave Application Viewer'/>
                        </Grid> */}
                    <Grid item xs={12} sx={{mt:1,display:'flex',justifyContent:'space-between'}}>
                        <FormControl sx = {{width:matches?'100%':'400px'}}>
                        <InputLabel id="select-filter">Filter Status</InputLabel>
                        <Select
                            labelId="select-filter"
                            id="select-filter"
                            value={filter}
                            label="Filter Status"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={'FOR REVIEW'}>For Review</MenuItem>
                            <MenuItem value={'FOR REVIEW HR'}>For Review (HR APPROVAL)</MenuItem>
                            <MenuItem value={'FOR APPROVAL'}>For Approval</MenuItem>
                            <MenuItem value={'FOR RECOMMENDATION'}>For Recommendation</MenuItem>
                            <MenuItem value={'APPROVED'}>Approved</MenuItem>
                            <MenuItem value={'DISAPPROVED'}>Disapproved</MenuItem>
                            <MenuItem value={'CANCELLED'}>Cancelled</MenuItem>
                            <MenuItem value={'DEFAULT'}>Default</MenuItem>
                        </Select>
                        </FormControl>
                        {/* <TextField label='Search Employee' value ={searchVal} onChange = {(val)=>setSearchVal(val.target.value)}/> */}

                    </Grid>
                    <Grid item xs={12} sx={{mt:1}}>
                        <Paper>
                            <DataTableExtensions
                                {...tableData}
                                export={false}
                                print={false}
                            >
                            <DataTable
                                columns={columns}
                                data={data}
                                paginationPerPage={5}
                                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Records per page:',
                                    rangeSeparatorText: 'out of',
                                }}
                                pagination
                                highlightOnHover
                                customStyles = {customStyles}

                            />
                            </DataTableExtensions>
                            {/* <TableContainer sx={{maxHeight:'60dvh',mt:1}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Employee name</StyledTableCell>
                                            <StyledTableCell>Office/Department</StyledTableCell>
                                            <StyledTableCell>Type of leave</StyledTableCell>
                                            <StyledTableCell>Inclusive Dates</StyledTableCell>
                                            <StyledTableCell>No. of days/hours applied</StyledTableCell>
                                            <StyledTableCell>Date filed</StyledTableCell>
                                            <StyledTableCell>Date <br/>AO reviewed</StyledTableCell>
                                            <StyledTableCell>Date <br/>HR reviewed</StyledTableCell>
                                            <StyledTableCell>Date <br/>Dept reviewed</StyledTableCell>
                                            
                                            <StyledTableCell>Status</StyledTableCell>
                                            <StyledTableCell>Remarks</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {   
                                            filterData.length>0
                                            ?
                                            filterData.map((row,key)=>{
                                                return (
                                                    <TableRow hover key={key}>
                                                        <StyledTableCell>{row.fullname}</StyledTableCell>
                                                        <StyledTableCell>{row.officedepartment}</StyledTableCell>
                                                        <StyledTableCell>{row.short_name}</StyledTableCell>
                                                        <StyledTableCell>{row.inclusive_dates_text}</StyledTableCell>
                                                        <StyledTableCell>{row.leave_type_id === 14?  row.days_hours_applied+' hr/s': row.days_hours_applied+' day/s'}</StyledTableCell>
                                                        <StyledTableCell>{moment(row.date_of_filing).format('MMMM DD, YYYY h:mm A')}</StyledTableCell>
                                                        <StyledTableCell>{row.reviewed_at&&moment(row.reviewed_at).format('MMMM DD, YYYY h:mm A')}</StyledTableCell>
                                                        <StyledTableCell>{row.hr_approval_at&&moment(row.hr_approval_at).format('MMMM DD, YYYY h:mm A')}</StyledTableCell>
                                                        <StyledTableCell>{row.recommendation_at&&moment(row.recommendation_at).format('MMMM DD, YYYY h:mm A')}</StyledTableCell>
                                                        <StyledTableCell sx={{color:row.status === 'DISAPPROVED' || row.status === 'CANCELLED'?red[800]:row.status === 'APPROVED'?green[800]:blue[800]}}>{row.status}</StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.remarks&&row.remarks}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                    )
                                            })
                                            :
                                            <TableRow>
                                                <StyledTableCell align='center' colSpan={11}> No data...</StyledTableCell>
                                            </TableRow>

                                             
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer> */}
                        </Paper>
                    </Grid>
                    </Grid>

                
                </Fade>
            }
            <SmallestModal open={openUpdateStat} close = {handleCloseUpdateStat} title='Updating Status'>

                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        {
                            selectedUpdate?.old_status === 'APPROVED'
                            ?
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Staus"
                                onChange={(val)=>setStatus(val.target.value)}
                            >
                                
                                <MenuItem value={1}>For Review</MenuItem>
                                <MenuItem value={2}>For Review (HR Approval)</MenuItem>
                                <MenuItem value={3}>For Recommendation</MenuItem>
                                <MenuItem value={4}>For Approval</MenuItem>
                            </Select>
                            :
                            selectedUpdate?.old_status === 'FOR APPROVAL'
                            ?
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Staus"
                                onChange={(val)=>setStatus(val.target.value)}
                            >
                                
                                <MenuItem value={1}>For Review</MenuItem>
                                <MenuItem value={2}>For Review (HR Approval)</MenuItem>
                                <MenuItem value={3}>For Recommendation</MenuItem>
                            </Select>
                            :
                            selectedUpdate?.old_status === 'FOR RECOMMENDATION'
                            ?
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Staus"
                                onChange={(val)=>setStatus(val.target.value)}
                            >
                                
                                <MenuItem value={1}>For Review</MenuItem>
                                <MenuItem value={2}>For Review (HR Approval)</MenuItem>
                            </Select>
                            :
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Staus"
                                onChange={(val)=>setStatus(val.target.value)}
                                disabled
                            >
                                
                                <MenuItem value={1}>For Review</MenuItem>
                            </Select>
                        }
                        
                        </FormControl>  
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant='contained' size='small' className='custom-roundbutton' color ='success' onClick={handleSaveUpdate} disabled={status?false:true}>Save</Button>
                        <Button variant='contained' size='small' className='custom-roundbutton' color ='error' onClick = {handleCloseUpdateStat}>Cancel</Button>
                    </Grid>
                </Grid>
               
            </SmallestModal>
            <SmallestModal open ={openSeeMore} close={handleCloseSeeMore} title='Printing Details'>
                <ul style={{fontSize:'.9rem'}}>
                {
                    seeMoreData.map((row,key)=>{
                    return (
                        <li key = {key}>{row.date_time_format}</li>
                    )
                    })
                }
                </ul>
            </SmallestModal>
            <LargeModal open = {previewModalOpen} close = {()=>setPreviewModalOpen(false)} title='Previewing Leave Application'>
                <Box sx={{maxHeight:'80dvh',overflow:'auto'}}>
                <PreviewLeaveApplicationForm data={typeOfLeaveData} leaveType = {employeeInfo.leave_type_id} auth_info = {authInfo} info={employeeInfo} pendinginfo={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
                    employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
                    ?
                        employeeInfo.vl_bal
                    :
                        employeeInfo.leave_type_id === 3
                        ?
                        employeeInfo.sl_bal
                        :
                            employeeInfo.leave_type_id === 14
                            ?
                            employeeInfo.coc_bal
                            :
                            0
                    } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation} is_preview={true}/>
                </Box>
                
            </LargeModal>
        </Box>
    )
}