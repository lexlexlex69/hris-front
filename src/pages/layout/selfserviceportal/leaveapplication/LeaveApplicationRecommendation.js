import React, { useEffect,useRef,useState } from 'react';
import { Grid, Typography,Container,Paper,Box, Button,FormControl,InputLabel,Select,MenuItem,Fade,CircularProgress,Modal, TextField,Tooltip,Skeleton,Backdrop, Stack,InputAdornment, IconButton,TableContainer,Table,TableHead,TableRow,TableBody,TableCell,TableFooter,TablePagination  } from '@mui/material';
//icon
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CachedIcon from '@mui/icons-material/Cached';
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreIcon from '@mui/icons-material/Restore';

//mui colors
import { blue, green, red, yellow } from '@mui/material/colors'
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//leave application request
import { getRecommendationLeaveApplicationData,getFilterRecommendationLeaveApplicationData,submitLeaveApplicationRecommendation, postApprovalApplicLeaveAPI, postDisApprovalApplicLeaveAPI, postApprovedApplicLeaveAPI, revertLeaveApplicationStatus } from './LeaveApplicationRequest';
//check permission request
import { checkPermission } from '../../permissionrequest/permissionRequest';

import LinearProgress from '@mui/material/LinearProgress';

//Data table
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
// import FilterComponent from 'react-data-table-component'

import moment from 'moment';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PreviewLeaveApplicationForm from './PreviewLeaveApplicationForm';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { getTypesOfLeave } from './LeaveApplicationRequest';
import { PreviewCTOApplicationForm } from './PreviewCTOApplicationForm';
import Swal from 'sweetalert2';
import axios from 'axios';
import { auditLogs } from '../../auditlogs/Request';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { api_url } from '../../../../request/APIRequestURL';
var momentBusinessDays = require("moment-business-days");

export default function LeaveApplicationRecommendation(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
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
    // navigate
    const navigate = useNavigate()
    const [isLoading,setisLoading] = React.useState(true);
    const [isLoadingData,setisLoadingData] = React.useState(true);
    const [leaveApplicationData,setLeaveApplicationData] = React.useState([])

    //all types of leave fetch from DB
    const [typeOfLeaveData,setTypeOfLeaveData] = React.useState([]);

    const [modalOpen,setmodalOpen] = React.useState(false)
    const [viewModalOpen,setmodalViewOpen] = React.useState(false)
    //all balance fetch from DB
    const [balanceData,setBalanceData] = React.useState([]);
    const [authInfo,setAuthInfo] = React.useState([]);

    //reference for leave application print preview
    const leaveRef = useRef();
    //reference for CTO application print preview
    const cocRef = useRef();

    //loading
    const [loading,setLoading] = React.useState(true);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 400: matchesMD?400:900,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        p: 4,
        overflow:'scroll',
        height:'100%',
        // display:'block'
      };
    
    const [aoAssign,setaoAssign] = React.useState({
        office_ao:'',
        office_ao_assign:''
    });
    const [officeHead,setofficeHead] = React.useState({
        office_head:'',
        office_name:''
    });
    const [action,setAction] = React.useState([]);
    useEffect(()=>{
        var logs = {
            action:'ACCESS ONLINE LEAVE RECOMMENDATION',
            action_dtl:'ACCESS ONLINE LEAVE RECOMMENDATION MODULE',
            module:'ONLINE LEAVE RECOMMENDATION'
        }
        auditLogs(logs)
        checkPermission(16)
        .then((response)=>{
            // console.log(response.data)
            setisLoading(false)
            if(response.data){
                getRecommendationLeaveApplicationData()
                .then((response)=>{
                    setLeaveApplicationData(response.data.data)
                    setAuthInfo(response.data.auth_info)
                    // setAction(response.data.actions)
                    setisLoadingData(false)
                }).catch((error)=>{
                    console.log(error)
                })

                //request to get the list of types of leave
                getTypesOfLeave()
                .then((response)=>{
                    const data = response.data
                    setTypeOfLeaveData(data.type_of_leave)
                }).catch((error)=>{
                    console.log(error)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
            setLoading(false)
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const customStyles = {
        rows: {
            style: {
                minHeight: '65px', // override the row height
                // background:'#f4f4f4',
                // textAlign:'center',
                fontSize: matches?'11px':'12px',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
            },
        },
        headCells: {
            style: {
                minHeight:'70px',
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                background:blue[800],
                color:'#fff',
                fontSize:matches? '13px':'15px',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                fontWeight: '500'
                // textAlign:'center',
    
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                textAlign:'left',
                
    
            },
        },
    };
    const historyColumn = [
        {
            name: 'Date Filed',
            selector: row => moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A'),
            sortable:true
        },{
            name: 'Employee Name',
            selector: row => row.fullname,
        },
        {
            name: 'Type of Leave',
            selector: row => `${row.leave_type_name} ${row.leave_type_id} ${row.leave_type_id === 15?'('+row.leave_details_name+')':''} `,
        },
        {
            name: 'Inclusive Date/s',
            selector: row => row.inclusive_dates_text,
        },
        {
            name: 'No. of Days/Hours Applied',
            selector: row => row.days_hours_applied,
        },
        {
            name: 'Status',
            selector: row => <em>{row.status === 'DISAPPROVED' ? <span style={{color:'red'}}>{row.status}</span> : <span style={{color:'green'}}>{row.status}</span>}</em>,
        },
        {
            name: 'Remarks',
            selector: row => <Box>{row.remarks} {row.hr_approved?'(HR APPROVED)':null}</Box>,
        },
        {
            name: 'Action',
            selector: row => 
                    row.dept_code === 12
                    ?
                    <Box sx={{p:1}}>
                        <Tooltip title='Cancel Application'><span><IconButton color='error' className='custom-iconbutton' onClick = {()=>handleRevertStatus(row,'delete')} disabled={row.status==='FOR REVIEW' || row.status === 'APPROVED' || row.status === 'DISAPPROVED' ?true:false}><DeleteForeverIcon/></IconButton></span></Tooltip>
                        &nbsp;
                        <Tooltip title='Revert status to FOR REVIEW'><span><IconButton color='primary' className='custom-iconbutton' disabled={row.status==='FOR REVIEW' || row.status === 'APPROVED' || row.status === 'DISAPPROVED' ?true:false} onClick={()=>handleRevertStatus(row,'revert')}><RestoreIcon/></IconButton></span></Tooltip>
                    </Box>
                    :
                    <Box sx={{p:1}}>
                        <Tooltip title='Cancel Application'><span><IconButton color='error' className='custom-iconbutton' onClick = {()=>handleRevertStatus(row,'delete')} disabled={row.status==='FOR REVIEW' || row.status === 'APPROVED' || row.status === 'DISAPPROVED' || row.hr_approved ?true:false}><DeleteForeverIcon/></IconButton></span></Tooltip>
                        &nbsp;
                        <Tooltip title='Revert status to FOR REVIEW'><span><IconButton color='primary' className='custom-iconbutton' disabled={row.status==='FOR REVIEW' || row.status === 'APPROVED' || row.status === 'DISAPPROVED' || row.hr_approved ?true:false} onClick={()=>handleRevertStatus(row,'revert')}><RestoreIcon/></IconButton></span></Tooltip>
                    </Box>

                ,
        },
        // {
        //     name: 'Action',
        //     selector: row => <Box><Button fullWidth variant='outlined' size = "small" startIcon={<PrintIcon/>} sx={{fontSize:matches?'9px':'auto',margin:'10px 0 10px 0'}} onClick = {()=>printPending(row)}>Print</Button><Button fullWidth variant='outlined' size = "small" color="error" startIcon={<CancelIcon/>}sx={{fontSize:matches?'9px':'auto',margin:'0 0 10px 0'}} >Cancel</Button></Box>
        // }
    ]
    const handleCancelApplication = (row) =>{
        var t_data = {
            id:row.leave_application_id,
            ref_no:row.ref_no,

        }
        console.log(t_data)
    }
    const [printPendingInfo,setPrintPendingInfo] = React.useState([]);
    //reference for leave application print preview on pending application
    // const printLeaveRef = useRef();

    //reference for CTO print preview on pending application
    // const printLeaveCTORef = useRef();

    const reactToPrint  = useReactToPrint({
        content: () => leaveRef.current,
        documentTitle: 'Leave Application '+printPendingInfo.lname
    });
    const reactToPrintCTO  = useReactToPrint({
        content: () => cocRef.current,
        documentTitle: 'CTO '+printPendingInfo.lname
    });
    const [printCount,setPrintCount] = React.useState(0);
    useEffect(()=>{
        if(employeeInfo.length !==0){
            if(employeeInfo.leave_type_id === 14){
                reactToPrintCTO()
                // setPrintPendingInfo([])
            }else{
                reactToPrint()
                // setPrintPendingInfo([])

            }
        }
    },[printCount])
    const [pendingBalance,setPendingBalance] = React.useState('');

    const printPending = (data)=>{
        setEmployeeInfo(data)
        setPrintCount(printCount+1);
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_name:data.office_head_position,
        })
        // var bal;
        // balanceData.forEach(element => {
        //     switch(row.leave_type_id){
        //         /**
        //          * vacation leave/force leave/ special privilege leave
        //          */
        //         case 1:
        //         case 2:
        //         case 6:
        //             bal = element.vl_bal
        //             break;
        //         /**
        //          * sick leave
        //          */
        //         case 3:
        //             bal = element.sl_bal
        //             break;
        //         /**
        //          *  CTO
        //          */
        //         case 14:
        //             bal = element.coc_bal
        //             break;
        //     }
        // });
        // setPendingBalance(bal)
        // setPrintPendingInfo(row)
        // reactToPrint()
    }
    const [filter,setFilter] = React.useState('');
    const [employeeInfo,setEmployeeInfo] = React.useState([])
    const setInfo = (data) => {
        console.log(data)
        setmodalOpen(true)

        setEmployeeInfo(data)
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_name:data.office_head_position,
        })
    }
    const viewInfo = (data) => {
        setmodalViewOpen(true)

        setEmployeeInfo(data)
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_name:data.office_head_position,
        })
    }
    const handleFilterChange = (value)=>{
        var logs = {
            action:'FILTER LEAVE VERIFICATION',
            action_dtl:'FILTER = '+value.target.value,
            module:'ONLINE LEAVE VERIFICATION'
        }
        auditLogs(logs)
        setLoading(true)
        setFilter(value.target.value)
        setFilterTextReview('');
		setResetPaginationToggle(!resetPaginationToggle);

        getFilterRecommendationLeaveApplicationData(value.target.value)
        .then((response) =>{
            setLeaveApplicationData(response.data.data)
            console.log(response.data)
            setLoading(false)

        }).catch((error)=>{
            console.log(error)
        })
    }
    const showLeaveTypePreview = () =>{
        switch(employeeInfo.leave_type_id){
            case 1:
            case 2:
            case 3:
            case 6:
                return(
                    <ReactToPrint
                            trigger={() => <Button fullWidth variant='outlined'startIcon={<PrintIcon/>}>PRINT</Button>}
                            content={() => leaveRef.current}
                            documentTitle={'Application Leave '+employeeInfo.lname}
                        />
                );
                break;
            case 14:
                return(
                    <ReactToPrint
                            trigger={() => <Button fullWidth variant='outlined' startIcon={<PrintIcon/>}>PRINT</Button>}
                            content={() => cocRef.current}
                            documentTitle={'CTO '+employeeInfo.lname}
                        />
                );
                break;
        }
    }
    const submitApprovedApplication = (row)=>{
        
        console.log(row)
        console.log(row.emp_status)
        Swal.fire({
            icon:'question',
            title: 'Confirm approved?',
            html:"<em><small>By confirming Yes, this leave application will be forwarded to CMO.</small></em>",
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Saving data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                if(row.emp_status === 'RE' || row.emp_status === 'CS' || row.emp_status === 'CT' || row.emp_status === 'COS' ||row.emp_status === 'JO'){
                    var data = {
                        ref_no:row.ref_no,
                        emp_no:row.emp_no,
                        key:'b9e1f8a0553623f1:639a3e:17f68ea536b'
                    }
                    var data2 = {
                        leave_application_id:row.leave_application_id,
                        perm_id:16,
                        review:1,
                        days_hours_applied:row.days_hours_applied,
                        days_with_pay:row.days_with_pay,
                        leave_type_id:row.leave_type_id,
                        employee_id:row.employee_id,
                        emp_no:row.emp_no,
                        inclusive_dates:row.inclusive_dates_text,
                        emp_status:row.emp_status,
                        ref_no:row.ref_no,
                        api_url:api_url
                    }
                    submitLeaveApplicationRecommendation(data2)
                    .then((response)=>{
                        setmodalOpen(false)
                        console.log(response.data.data)
                        if(response.data.status === 'success'){
                            setLeaveApplicationData(response.data.data)
                            setRecommendation('')
                            setDisapproval('')
                            Swal.fire({
                                icon:'success',
                                title:response.data.message,
                                showConfirmButton:false,
                                timer:1500
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:response.data.message
                            })
                        }
                    }).catch((error)=>{
                        console.log(error)
                        Swal.close();
                    })
                    // postApprovalApplicLeaveAPI(data)
                    // .then(res=>{
                    //     if(res.data.status === 200){
                    //         submitLeaveApplicationRecommendation(data2)
                    //         .then((response)=>{
                    //             setmodalOpen(false)
                    //             console.log(response.data.data.data)
                    //             if(response.data.status === 'success'){
                    //                 setLeaveApplicationData(response.data.data.data)
                    //                 setRecommendation('')
                    //                 setDisapproval('')
                    //                 Swal.fire({
                    //                     icon:'success',
                    //                     title:response.data.message,
                    //                     showConfirmButton:false,
                    //                     timer:1500
                    //                 })
                    //             }else{
                    //                 Swal.fire({
                    //                     icon:'error',
                    //                     title:response.data.message
                    //                 })
                    //             }
                    //         }).catch((error)=>{
                    //             console.log(error)
                    //             Swal.close();
                    //         })
                    //     }else{
                    //         Swal.fire({
                    //             icon:'error',
                    //             title:res.data.message
                    //         })
                    //     }
                    // }).catch(err=>{
                    //     console.log(err);
                    //     Swal.close()
                    //     window.open(api_url)
                    // })
                }else{
                    let inc_dates = JSON.parse(row.inclusive_dates)
                    let dwpay = Math.round(row.days_with_pay);
                    let dwpay_days = [];
                    let dwopay_days = [];
                    for(var i = 0 ; i<inc_dates.length ; i++){
                        if(i+1<=dwpay){
                            dwpay_days.push(inc_dates[i]);
                        }else{
                            dwopay_days.push(inc_dates[i]);
                        }
                    }
                    let range_dates_arr = []
                    inc_dates.forEach(el=>{
                        if(momentBusinessDays(moment(el.date, 'MM-DD-YYYY')).isBusinessDay()){
                            range_dates_arr.push(el);
                        }
                    })
                    var temp_inc_date_arr2 = '';
                    inc_dates.forEach((el,key) => {
                        if(key === 0){
                            if(inc_dates.length === key+1){
                                temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY')+ moment(el.date,'MM-DD-YYYY').format(' to MM/DD/YYYY');
                            }else{
                                temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY ');
                            }
                        }else if(inc_dates.length === key+1){
                            var interval = moment(el.date,'MM-DD-YYYY').diff(moment(inc_dates[key-1].date,'MM-DD-YYYY'), 'days');
                            /**
                            * If day interval is 1, means consecutive dates
                            */
                            if(interval === 1){
                                temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                            }else{
                                temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY');
            
                            }
                        }
                        else{
                            var interval = moment(el.date).diff(moment(inc_dates[key-1].date), 'days');
            
                            if(interval !== 1){
                                temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY ');
            
                            }else{
                                var interval2 = moment(inc_dates[key+1].date,'MM-DD-YYYY').diff(moment(el.date,'MM-DD-YYYY'), 'days');
                                if(interval2 !== 1){
            
                                    temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                                }
                            }
                        }
                    });
                    var temp_fin_inc_date_arr = temp_inc_date_arr2.split(';');
                    var fin_inc_date_arr = [];
                    temp_fin_inc_date_arr.forEach(el=>{
                        let dates_arr = el.split('to');
                        let date1 = dates_arr[0];
                        let date2_temp = dates_arr[1];
                        let date2;
                        if(date2_temp){
                            date2 = dates_arr[1];
                            let to_sub = 0;
                            inc_dates.forEach(el=>{
                                if(el.period !== 'NONE'){
                                    to_sub = to_sub + .5;
                                }
                            })
                            if(moment(date1,'MM-DD-YYYY').format('MM-DD-YYYY') === moment(date2,'MM-DD-YYYY').format('MM-DD-YYYY')){
                                
                                let total_days = (moment(date2,'MM-DD-YYYY').diff(moment(date1,'MM-DD-YYYY'),'days')+1)-to_sub;
            
                                fin_inc_date_arr.push({
                                    'date':el,
                                    'inc_dates':moment(date1,'MM-DD-YYYY').format('MMM DD'),
                                    'total_days':total_days,
                                    'short_name':row.short_name+' ('+total_days+' 00 00)'
                                })
                            }else{
                                let total_days = (moment(date2,'MM-DD-YYYY').diff(moment(date1,'MM-DD-YYYY'),'days')+1)-to_sub;
            
                                fin_inc_date_arr.push({
                                    'date':el,
                                    'inc_dates':moment(date1,'MM-DD-YYYY').format('MMM DD')+' - '+moment(date2,'MM-DD-YYYY').format('DD'),
                                    'total_days':total_days,
                                    'short_name':row.short_name+' ('+total_days+' 00 00)'
                                })
                            }
                        
                        }else{
                            date2 = dates_arr[0];
                            let total_days = moment(date2,'MM-DD-YYYY').diff(moment(date1,'MM-DD-YYYY'),'days')+1;
            
                            fin_inc_date_arr.push({
                                'date':el,
                                'inc_dates':moment(date1,'MM-DD-YYYY').format('MMM DD'),
                                'total_days':total_days,
                                'short_name':row.short_name+' ('+total_days+' 00 00)'
                            })
                        
                        }
                        
            
                    })
                    
                    var approved_data = {
                        ref_no:row.ref_no,
                        emp_no:row.emp_no,
                        key:'b9e1f8a0553623f1:639a3e:17f68ea536b'
                    }
                    submitLeaveApplicationRecommendation(data2)
                    .then((response)=>{
                        setmodalOpen(false)
                        console.log(response.data.data)
                        if(response.data.status === 'success'){
                            setLeaveApplicationData(response.data.data)
                            setRecommendation('')
                            setDisapproval('')
                            Swal.fire({
                                icon:'success',
                                title:response.data.message,
                                showConfirmButton:false,
                                timer:1500
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:response.data.message
                            })
                        }
                    }).catch((error)=>{
                        console.log(error)
                        Swal.close();
                    })
                    // postApprovalApplicLeaveAPI(approved_data)
                    //         .then(res=>{
                    //             if(res.data.status === 200){
                    //             var data2 = {
                    //                 leave_application_id:row.leave_application_id,
                    //                 perm_id:16,
                    //                 review:1,
                    //                 days_hours_applied:row.days_hours_applied,
                    //                 days_with_pay:row.days_with_pay,
                    //                 leave_type_id:row.leave_type_id,
                    //                 employee_id:row.employee_id,
                    //                 emp_no:row.emp_no,
                    //                 inclusive_dates:row.inclusive_dates_text,
                    //                 emp_status:row.emp_status
                    //             }
                    //             submitLeaveApplicationRecommendation(data2)
                    //             .then((response)=>{
                    //                 setmodalOpen(false)
                    //                 console.log(response.data.data.data)
                    //                 if(response.data.status === 'success'){
                    //                     setLeaveApplicationData(response.data.data.data)
                    //                     setRecommendation('')
                    //                     setDisapproval('')
                    //                     Swal.fire({
                    //                         icon:'success',
                    //                         title:response.data.message,
                    //                         showConfirmButton:false,
                    //                         timer:1500
                    //                     })
                    //                 }else{
                    //                     Swal.fire({
                    //                         icon:'error',
                    //                         title:response.data.message
                    //                     })
                    //                 }
                    //             }).catch((error)=>{
                    //                 console.log(error)
                    //                 Swal.close();
                    //             })
                                
                    //     }else{
                    //         Swal.fire({
                    //             icon:'error',
                    //             title:res.data.message
                    //         })
                    //     }
                    // }).catch(err=>{
                    //     window.open(api_url)
                    //     Swal.close();
                    //     console.log(err)
                    // })
                    
                    
                }
            }
          })
    }
    const submitDisApprovedApplication = (row)=>{
        Swal.fire({
            title: 'Confirm disapproved request?',
            html:'Remarks for disapproval',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            inputValidator: (value) => {
                if (!value) {
                  return 'Please input remarks !'
                }
              }
          }).then((result) => {
            if (result.isConfirmed) {
                
                Swal.fire({
                    icon:'info',
                    title:'Saving data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                if(row.ref_no){
                        var data = {
                            ref_no:row.ref_no,
                            emp_no:row.emp_no,
                            employee_id:row.employee_id,
                            leave_type_id:row.leave_type_id,
                            dwp:row.days_with_pay,
                            key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                            reason:result.value
                        }
                        postDisApprovalApplicLeaveAPI(data)
                        .then(res=>{
                            if(res.data.status === 200){
                                var data2 = {
                                    leave_application_id:row.leave_application_id,
                                    perm_id:8,
                                    review:2,
                                    disapproval:result.value,
                                    days_hours_applied:row.days_hours_applied,
                                    leave_type_id:row.leave_type_id,
                                    days_with_pay:row.days_with_pay,
                                    employee_id:row.employee_id,
                                    emp_no:row.emp_no,
                                    inclusive_dates:row.inclusive_dates_text,

                                }
                                console.log(data2)
                                submitLeaveApplicationRecommendation(data2)
                                .then((response)=>{
                                    setmodalOpen(false)
                                    // console.log(response.data)
                                    if(response.data.status === 'success'){
                                        setLeaveApplicationData(response.data.data.data)
                                        setRecommendation('')
                                        setDisapproval('')
                                        Swal.fire({
                                            icon:'success',
                                            title:response.data.message,
                                            timer:1500,
                                            showConfirmButton: false,
                                        })
                                    }else{
                                        Swal.fire({
                                            icon:'error',
                                            title:response.data.message
                                        })
                                    }
                                }).catch((error)=>{
                                    console.log(error)
                                    Swal.close();
                                })
                            }else{
                                Swal.fire({
                                    icon:'error',
                                    title:res.data.message
                                })
                            }
                        }).catch(err=>{
                            console.log(err);
                            Swal.close()
                        })

                }else{
                    var data2 = {
                        leave_application_id:row.leave_application_id,
                        perm_id:8,
                        review:2,
                        disapproval:result.value,
                        days_hours_applied:row.days_hours_applied,
                        leave_type_id:row.leave_type_id,
                        days_with_pay:row.days_with_pay,
                        employee_id:row.employee_id,
                        emp_no:row.emp_no,
                        inclusive_dates:row.inclusive_dates_text,

                    }
                    submitLeaveApplicationRecommendation(data2)
                    .then((response)=>{
                        setmodalOpen(false)
                        // console.log(response.data)
                        if(response.data.status === 'success'){
                            setLeaveApplicationData(response.data.data.data)
                            setRecommendation('')
                            setDisapproval('')
                            Swal.fire({
                                icon:'success',
                                title:response.data.message,
                                timer:1500,
                                showConfirmButton: false,
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:response.data.message
                            })
                        }
                    }).catch((error)=>{
                        console.log(error)
                        Swal.close();
                    })
                }
                
                
            }
        })
    }
    const [recommendation,setRecommendation] = React.useState('');
    const handleAction = (value) =>{
        setRecommendation(value.target.value)
    }
    const [disapproval,setDisapproval] = React.useState('');
    const viewCOCFile = () =>{
        // alert(JSON.parse(employeeInfo.file_ids))
        const file_id = JSON.parse(employeeInfo.file_ids);
        // window.open('localhost:8000/api/fileupload/viewFile/'+file_id);
        // axios.get('api/fileupload/viewFile/'+file_id)
        // .then((response)=>{
        // }).catch((error)=>{
        //     console.log(error)
        // })
        axios({
            url: 'api/fileupload/viewFile/'+file_id, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            console.log(response.data)
            const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('target', '_BLANK'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }
    const [filterTextReview, setFilterTextReview] = React.useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
	const filteredItems = leaveApplicationData.filter(
		item => item.fullname && item.fullname.toLowerCase().includes(filterTextReview.toLowerCase()),
	);

	const searchComponent = React.useMemo(() => {
		const handleClear = () => {
			if (filterTextReview) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterTextReview('');
			}
		};

		return (
			<FilterComponent onFilter={e => setFilterTextReview(e.target.value)} onClear={handleClear} filterText={filterTextReview} />
		);
	}, [filterTextReview, resetPaginationToggle]);
    const refreshData = () =>{
        Swal.fire({
            icon:'info',
            title:'Please wait...',
            html:'Refreshing data...'
        })
        Swal.showLoading()
        if(filter.length !==0){
            setFilterTextReview('');
            setResetPaginationToggle(!resetPaginationToggle);

            getFilterRecommendationLeaveApplicationData(filter)
            .then((response) =>{
                setLeaveApplicationData(response.data.data)
                Swal.close()

            }).catch((error)=>{
                console.log(error)
                Swal.close()

            })
        }else{
            setFilterTextReview('');
            setResetPaginationToggle(!resetPaginationToggle);
            getRecommendationLeaveApplicationData()
            .then((response)=>{
                setLeaveApplicationData(response.data.data)
                Swal.close()

            }).catch((error)=>{
                console.log(error)
                Swal.close()
            })
        }
    }
    const showFileAttachment = () => {
        switch(employeeInfo.leave_type_id){
            case 3:
                return (
                    // <Grid item xs={12} sm={12} md={12} lg={12}>
                    //     <Grid item xs={12} sm={12} md={12} lg={12}>
                    //         <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'flex-start',margin:'0 17px 10px 0'}}>
                    //             <Button variant='outlined' onClick = {viewFileAttachment} startIcon={<AttachFileIcon/>}>View SL File Attachment</Button>
                    //         </Box>
                    //     </Grid>
                    // </Grid>
                    // <Grid item xs={12} sm={12} md={12} lg={12}>
                    // <Button variant='outlined' sx={{width:matches?'100%':'auto',marginTop:matches?'15px':'auto'}} onClick = {viewFileAttachment} startIcon={<AttachFileIcon/>}>View SL File Attachment</Button>

                    // </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                    <hr/>
                    <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
                        <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold'}}><AttachFileIcon/> File Attachment</Typography>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <em>Medical Certificate / Affidavit</em>
                                </td>
                                <td>
                                <Button variant='outlined' onClick = {()=>viewFileAttachment('default')} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </Grid>
                );
                break;
            case 4:
                if(employeeInfo.days_hours_applied<105){
                    return(
                        <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                            <hr/>
                        <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
                        <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold'}}><AttachFileIcon/> File Attachment</Typography>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <em>Proof of Pregnancy</em>
                                    </td>
                                    <td>
                                    <Button variant='outlined' onClick = {()=>viewFileAttachment('default')} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    <em>Notice of Allocation of Maternity Leave</em>
                                    </td>
                                    <td>
                                    <Button variant='outlined' onClick = {viewFileAttachment} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    <em>Proof of Relationship</em>
                                    </td>
                                    <td>
                                    <Button variant='outlined' onClick = {()=>viewFileAttachment('maternity')} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        
                    </Grid>
                    );
                }else{
                    return(
                        <Grid item xs={12} sm={12} md={12} lg={12}  sx = {{margin:matches?'0':'10px'}}>
                            <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
                        <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold'}}><AttachFileIcon/> File Attachment</Typography>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <em>Proof of Pregnancy</em>
                                    </td>
                                    <td>
                                    <Button variant='outlined' onClick = {()=>viewFileAttachment('default')} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        </Grid>
                    );
                }
                break;
            case 14:
                return(
                // <Grid item xs={12} sm={12} md={12} lg={12}>
                // <Button variant='outlined' sx={{width:matches?'100%':'auto',marginTop:matches?'15px':'auto'}} onClick = {viewFileAttachment} startIcon={<AttachFileIcon/>}>View COC File Attachment</Button>

                // </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                    <hr/>
                    <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
                    <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold'}}><AttachFileIcon/> File Attachment</Typography>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <em>COC Certificate</em>
                                </td>
                                <td>
                                <Button variant='outlined' onClick = {()=>viewFileAttachment('default')} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </Grid>
                );
                break;
        }
    }
    const viewFileAttachment = (type) =>{
        switch(type){
            case 'default':
                var file_id = JSON.parse(employeeInfo.file_ids);
                switch(employeeInfo.leave_type_id){
                    case 3:
                    case 4:
                    case 14:
                        axios({
                            url: 'api/fileupload/viewFile/'+file_id, //your url
                            method: 'GET',
                            responseType: 'blob', // important
                        }).then((response) => {
                            console.log(response.data)
                            const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('target', '_BLANK'); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                        });
                    break;
                    default:
                        alert('default')
                        break;
                }
                break;
            case 'maternity':
                console.log('proof of relationship')
                var file_id = employeeInfo.benefit_relationship_proof_fileid;
                axios({
                    url: 'api/fileupload/viewFile/'+file_id, //your url
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    console.log(response.data)
                    const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('target', '_BLANK'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
                break;
        }
        
    }
    const [rowsPerPage,setRowsPerPage] = useState(5);
    const [page,setPage] = useState(0)
    const handleChangePage = (event,page) =>{
        setPage(page)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleRevertStatus = (row,type) =>{
        console.log(row)
        if(type === 'revert'){
            var title = 'Confirm revert the status to FOR REVIEW ?'
            var title2 = 'Reverting status'
            var html = ''
        }else{
            var title = 'Confirm cancel/delete this leave application ?'
            var title2 = 'Cancelling/Deleting leave application'
            var html = '<strong>Warning:</strong> Leave application will be permanently deleted.'
        }
        Swal.fire({
            icon:'question',
            title:title,
            html:html,
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:title2,
                    html:'Please wait...'
                })
                Swal.showLoading();
                var t_data = {
                    id:row.leave_application_id,
                    ref_no:row.ref_no,
                    api_url:api_url,
                    status:row.status,
                    filter:filter,
                    emp_no:row.emp_no,
                    employee_id:row.employee_id,
                    leave_type_id:row.leave_type_id,
                    days_with_pay:row.days_with_pay,
                    type:type,
                    leave_info:row
                }
                console.log(t_data)
                revertLeaveApplicationStatus(t_data)
                .then(res=>{
                    if(res.data.status === 200){
                        setLeaveApplicationData(res.data.data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                })
            }
        })
        

    }
    return(
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {isLoading
            ?
            <DashboardLoading actionButtons={1}/>
            :
            <Fade in>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{marginBottom:'10px'}}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

                        <FormControl sx = {{width:matches?'100%':'250px'}}>
                        <InputLabel id="select-filter">Filter</InputLabel>
                        <Select
                            labelId="select-filter"
                            id="select-filter"
                            value={filter}
                            label="Filter"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value={'For Review'}>For Review</MenuItem>
                            <MenuItem value={'For Approval'}>For Approval</MenuItem>
                            <MenuItem value={'For Recommendation'}>For Recommendation</MenuItem>
                            <MenuItem value={'Approved'}>Approved</MenuItem>
                            <MenuItem value={'Disapproved'}>Disapproved</MenuItem>
                        </Select>
                        </FormControl>
                        <Tooltip title ='Reload data'><IconButton color='primary' className='custom-iconbutton' onClick={refreshData}><CachedIcon/></IconButton></Tooltip>
                        {/* <Tooltip title="Refresh Data" placement='top'>
                        <Button variant = "outlined" onClick = {refreshData}><CachedIcon/></Button>

                        </Tooltip> */}
                        </Box>
                    

                    </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                    {
                        leaveApplicationData.length ===0
                        ?
                        null
                        :
                        searchComponent
                    }

                    </Box>
                    <Box component={Paper}>
                    {  
                        loading
                        ?
                        <Box>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                            // onClick={handleClose}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <CircularProgress color="inherit" />
                            <Typography>Loading data. Please wait...</Typography>
                            </Box>
                        </Backdrop>
                        <Stack>
                            <Skeleton variant='rounded' height={'40vh'} animation='wave'/>
                        </Stack>
                        </Box>
                        
                        :
                        filter === 'For Recommendation' || filter === ''
                        ?
                        <React.Fragment>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Date filed</StyledTableCell>
                                        <StyledTableCell>Employee name</StyledTableCell>
                                        <StyledTableCell>Type of leave</StyledTableCell>
                                        <StyledTableCell>Leave reason</StyledTableCell>
                                        <StyledTableCell>Inclusive Date/s</StyledTableCell>
                                        <StyledTableCell>No. of days/hours applied</StyledTableCell>
                                        <StyledTableCell>Remarks</StyledTableCell>
                                        <StyledTableCell align='center'>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    
                                    {
                                        isLoadingData
                                        ?
                                        <React.Fragment>
                                        <TableRow>
                                        <StyledTableCell colSpan={8}>
                                        <Stack>
                                            <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                        </Stack>
                                        </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                        <StyledTableCell colSpan={8}>
                                        <Stack>
                                            <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                        </Stack>
                                        </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                        <StyledTableCell colSpan={8}>
                                        <Stack>
                                            <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                        </Stack>
                                        </StyledTableCell>
                                        </TableRow>
                                        </React.Fragment>
                                        :
                                        filteredItems.length === 0
                                        ?
                                        <TableRow><StyledTableCell colSpan={8} align='center'>No Data</StyledTableCell></TableRow>
                                        :
                                        filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                            <TableRow hover key={key}>
                                                <StyledTableCell>{moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}</StyledTableCell>
                                                <StyledTableCell>{row.fullname}</StyledTableCell>
                                                <StyledTableCell>{row.leave_type_name} {row.leave_type_id===15?'('+row.details_name+')':''}</StyledTableCell>
                                                <StyledTableCell>{row.specify_details}</StyledTableCell>
                                                <StyledTableCell>{row.inclusive_dates_text}</StyledTableCell>
                                                <StyledTableCell>{row.leave_type_id === 14?  row.days_hours_applied+' hr/s': row.days_hours_applied+' day/s'}</StyledTableCell>

                                                <StyledTableCell>{row.remarks}</StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    <Box  sx={{display:'flex',gap:1}}>
                                                    <Tooltip title ='Approved'>
                                                    <IconButton color='success' onClick = {()=>submitApprovedApplication(row)} sx={{'&:hover': { bgcolor: green[800], color: '#fff'}}} className='custom-iconbutton'><ThumbUpOutlinedIcon/></IconButton>
                                                    </Tooltip>

                                                    <Tooltip title ='Disapproved'>
                                                    <IconButton color='error' onClick = {()=>submitDisApprovedApplication(row,'delete')} sx={{'&:hover': { bgcolor: red[800], color: '#fff'}}} className='custom-iconbutton'><ThumbDownOutlinedIcon/></IconButton>
                                                    </Tooltip>

                                                    <Tooltip title='Cancel Application'><span><IconButton color='error' className='custom-iconbutton' onClick = {()=>handleRevertStatus(row,'delete')}><DeleteForeverIcon/></IconButton></span></Tooltip>

                                                    <Tooltip title ='Revert status to FOR REVIEW'>
                                                    <IconButton color='primary' onClick={()=>handleRevertStatus(row,'revert')} sx={{'&:hover': { bgcolor: blue[800], color: '#fff'}}} className='custom-iconbutton' ><RestoreIcon/></IconButton>
                                                    </Tooltip>

                                                   
                                                    </Box>

                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter>
                                    {
                                        filteredItems.length === 0
                                        ?
                                        null
                                        :
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, 100]}
                                                count={filteredItems.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </TableRow>
                                    }
                                    
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        </React.Fragment>
                        :
                        <DataTable
                            columns={historyColumn}
                            // data={leaveApplicationData}
                            data = {filteredItems}
                            noHeader
                            customStyles={customStyles}
                            pagination
                            highlightOnHover
                            paginationResetDefaultPage={resetPaginationToggle}
                            // subHeader
                            // subHeaderComponent={searchComponent}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                            persistTableHead

                        />
                    }
                    
                    </Box>

                </Grid>
            </Grid>
            
            
            </Fade>
            }
        
        <div style={{ display: "none" }}>
            <PreviewLeaveApplicationForm ref={leaveRef} data={typeOfLeaveData} leaveType = {employeeInfo.leave_type_id} auth_info ={authInfo} info={employeeInfo} pendinginfo={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
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
            } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation} disapproval={employeeInfo.remarks}/></div>
        <div style={{ display: "none" }}>
            {/* <PreviewCTOApplicationForm ref={cocRef} auth_info ={authInfo} info={employeeInfo} pendinginfo={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval    } date_of_filing ={employeeInfo.date_of_filing} status = {employeeInfo.status}/> */}
        </div>
        </Box>
    )
}
function FilterComponent(props){
    const handleEscape = (event) =>{
        if (event.key === "Escape") {
            props.onClear()
        }
    }
    return (
        <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:2}}>
            <TextField label='Search table' InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                <Tooltip title='Clear search'><IconButton color='error' onClick={props.onClear}><HighlightOffRoundedIcon /></IconButton></Tooltip>
                </InputAdornment>
            ),
            }} value={props.filterText} onChange={props.onFilter} fullWidth/>
        </Grid>
        // <Grid item xs={12} sm={12} md = {2} lg={2}>
        // <Tooltip title="Search Name" placement="top">
        // <TextField value={props.filterText} onChange={props.onFilter}label={
        //     <Box sx = {{display:'flex',flexDirection:'row'}}>
        //         <SearchIcon fontSize="small"/>
        //         <Typography>
        //         Search  
        //         </Typography>
        //     </Box>
        // } fullWidth onKeyDown = {handleEscape}/>
        // </Tooltip>
        // <Button size="small"onClick={props.onClear} sx={{position:'absolute',right:'16px',top:'16px',textAlign:'center'}}><HighlightOffRoundedIcon/></Button>

        // </Grid>

    )
}