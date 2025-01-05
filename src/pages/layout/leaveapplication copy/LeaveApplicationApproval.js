import React, { useEffect,useRef,useState } from 'react';
import { Grid, Typography,Container,Paper,Box, Button,FormControl,InputLabel,Select,MenuItem,Fade,CircularProgress,Modal, TextField,Tooltip,Skeleton,Backdrop,Stack,InputAdornment,IconButton,TableContainer,Table,TableHead,TableRow,TableBody,TableCell,TableFooter,TablePagination  } from '@mui/material';
//icon
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CachedIcon from '@mui/icons-material/Cached';
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

//mui colors
import { blue, green, red, yellow } from '@mui/material/colors'
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//leave application request
import { getApprovalLeaveApplicationData,getFilterApprovalLeaveApplicationData,postApprovedApplicLeaveAPI,postDisApprovalApplicLeaveAPI,submitLeaveApplicationApproval } from './LeaveApplicationRequest';
//check permission request
import { checkPermission } from '../permissionrequest/permissionRequest';

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
import { auditLogs } from '../auditlogs/Request';
var momentBusinessDays = require("moment-business-days");

export default function LeaveApplicationApproval(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
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
    const [employeeInfo,setEmployeeInfo] = React.useState([])

    //reference for leave application print preview
    const leaveRef = useRef();
    //reference for CTO application print preview
    const cocRef = useRef();

    //loading
    const [loading,setLoading] = React.useState(true);
    const [ctoInfo,setCtoInfo] = useState([{
        cto_hr_name:'',
        cto_hr_name_pos:'',
        cto_cmo_name:'',
        cto_cmo_name_pos:''
    }]);
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
            action:'ACCESS ONLINE LEAVE APPROVAL',
            action_dtl:'ACCESS ONLINE LEAVE APPROVAL MODULE',
            module:'ONLINE LEAVE APPROVAL'
        }
        auditLogs(logs)
        checkPermission(17)
        .then((response)=>{
            // console.log(response.data)
            setisLoading(false)
            if(response.data){
                getApprovalLeaveApplicationData()
                .then((response)=>{
                    console.log(response.data.data)
                    setLeaveApplicationData(response.data.data)
                    setAuthInfo(response.data.auth_info)
                    setCtoInfo(response.data.cto_info)
                    setisLoadingData(false)
                    // setAction(response.data.actions)
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
                navigate('/hris')
            }
            setLoading(false)
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                // background:'#f4f4f4',
                // textAlign:'center',
                fontSize: matches?'11px':'0.875rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
            },
        },
        headCells: {
            style: {
                minHeight:'70px',
                // paddingLeft: '8px', // override the cell padding for head cells
                // paddingRight: '8px',
                background:blue[800],
                color:'#fff',
                fontSize:matches? '13px':'16px',
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
            name: 'Employee Name',
            selector: row => row.fullname,
        },
        {
            name: 'Type of Leave',
            selector: row => row.leave_type_name,
        },
        {
            name: 'Date Filed',
            selector: row => moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A'),
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
            selector: row => row.remarks,
        },
        {
            name: 'Action',
            selector: row => <Box><Button fullWidth variant='outlined' size = "small" startIcon={<PrintIcon/>} sx={{fontSize:matches?'9px':'auto',margin:'10px 0 10px 0'}} onClick = {()=>printPending(row)}>Print</Button><Button fullWidth variant='outlined' size = "small" color="error" startIcon={<CancelIcon/>}sx={{fontSize:matches?'9px':'auto',margin:'0 0 10px 0'}} disabled>Cancel</Button></Box>
        }
    ]
    const [printPendingInfo,setPrintPendingInfo] = React.useState([]);
    //reference for leave application print preview on pending application
    // const printLeaveRef = useRef();

    //reference for CTO print preview on pending application
    // const printLeaveCTORef = useRef();
    const beforePrint = () =>{
        var logs = {
            action:'PRINT LEAVE APPLICATION',
            action_dtl:'NAME = '+printPendingInfo.fullname,
            module:'ONLINE LEAVE APPROVAL'
        }
        auditLogs(logs)
        reactToPrint();
    }
    const reactToPrint  = useReactToPrint({
        content: () => leaveRef.current,
        // documentTitle: 'Leave Application '+printPendingInfo.fullname
        documentTitle: 'Leave Application '+employeeInfo.fullname
        
    });
    const reactToPrintCTO  =  useReactToPrint({
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
                beforePrint()
                // setPrintPendingInfo([])
            }
        }
    },[printCount])
    const [pendingBalance,setPendingBalance] = React.useState('');

    const printPending = (data)=>{
        // console.log(data)
        setEmployeeInfo(data)
        setPrintCount(printCount+1);
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_head_pos:data.office_head_position,
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
        setPrintPendingInfo(data)
        // reactToPrint()
    }
    const [filter,setFilter] = React.useState('');
    const showLeaveForm = (data) => {
        setmodalOpen(true)

        setEmployeeInfo(data)
        console.log(data)
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_head_pos:data.office_head_position,
        })
    }
    // const setInfo = (data) => {
    //     setmodalOpen(true)

    //     setEmployeeInfo(data)
    //     console.log(data)
    //     setaoAssign({...aoAssign,
    //         office_ao:data.ao_assign,
    //         office_ao_assign:data.ao_position,
    //     })
    //     setofficeHead({
    //         ...officeHead,
    //         office_head:data.office_head,
    //         office_name:data.office_head_position,
    //     })
    // }
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
            office_head_pos:data.office_head_position,
        })
    }
    const handleFilterChange = (value)=>{
        var logs = {
            action:'FILTER LEAVE APPROVAL',
            action_dtl:'FILTER = '+value.target.value,
            module:'ONLINE LEAVE APPROVAL'
        }
        auditLogs(logs)
        setLoading(true)
        setFilter(value.target.value)
        setFilterTextReview('');
		setResetPaginationToggle(!resetPaginationToggle);

        getFilterApprovalLeaveApplicationData(value.target.value)
        .then((response) =>{
            setLeaveApplicationData(response.data.data)
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
                            documentTitle={'Application Leave '+employeeInfo.fname}
                        />
                );
                break;
            case 14:
                return(
                    <ReactToPrint
                            trigger={() => <Button fullWidth variant='outlined' startIcon={<PrintIcon/>}>PRINT</Button>}
                            content={() => cocRef.current}
                            documentTitle={'CTO '+employeeInfo.fname}
                        />
                );
                break;
        }
    }
    const submitApprovedApplication = (row)=>{
        console.log(row)
        if(row.leave_type_id === 15){
            var data2 = {
                key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                ref_no:row.ref_no,
                emp_no:row.emp_no,
                leave_type_id:row.leave_type_id,
                others_vl:row.others_vl,
                others_sl:row.others_sl,
                leave_name:row.short_name,
                date_filed:moment(row.created_at).format('YYYY-MM-DD'),
                leave_type_details:row.details_of_leave_id,
                days_hours_applied:row.days_hours_applied,
                employee_id:row.employee_id,

            }
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
            var data2 = {
                key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                ref_no:row.ref_no,
                emp_no:row.emp_no,
                leave_type_id:row.leave_type_id,
                dwpay:dwpay_days,
                dwopay:dwopay_days,
                leave_name:row.short_name,
                range_dates_arr:range_dates_arr,
                date_arr:fin_inc_date_arr,
                date_filed:moment(row.created_at).format('YYYY-MM-DD'),
                leave_type_details:row.details_of_leave_id,
                employee_id:row.employee_id,
            }
        }
        var data = {
            leave_application_id:row.leave_application_id,
            perm_id:17,
            review:1,
            days_hours_applied:row.days_hours_applied,
            leave_type_id:row.leave_type_id,
            employee_id:row.employee_id,
            days_with_pay:row.days_with_pay,
            inclusive_dates:row.inclusive_dates_text,

        }
        console.log(data2)
        Swal.fire({
            icon:'info',
            title: 'Confirm approved?',
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
                
                console.log(data2)
                postApprovedApplicLeaveAPI(data2)
                .then(res=>{
                    // console.log(res.data)
                    // Swal.close();
                    if(res.data.status === 200){
                        submitLeaveApplicationApproval(data)
                        .then((response)=>{
                            setmodalOpen(false)
                            console.log(response.data)
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
                            title:res.data.message,
                            showConfirmButton:false,
                            timer:1500
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                    Swal.close();

                })
                
            }
          })
    }
    const submitDispprovedApplication = (row)=>{
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
                var data = {
                    ref_no:row.ref_no,
                    emp_no:row.emp_no,
                    key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                    reason:result.value
                }
                postDisApprovalApplicLeaveAPI(data)
                .then(res=>{
                    if(res.data.status===200){
                        var data2 = {
                            leave_application_id:row.leave_application_id,
                            perm_id:8,
                            review:2,
                            disapproval:result.value,
                            days_hours_applied:row.days_hours_applied,
                            days_with_pay:row.days_with_pay,
                            leave_type_id:row.leave_type_id,
                            employee_id:row.employee_id,
                            emp_no:row.emp_no,

                        }
                        submitLeaveApplicationApproval(data2)
                        .then((response)=>{
                            setmodalOpen(false)
                            console.log(response.data)
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
                
            }
        })
    }
    // const submitApproveApplication = () =>{
    //     if(recommendation.length !==0){
    //         if(recommendation === 1){
    //             var data = {
    //                 leave_application_id:employeeInfo.leave_application_id,
    //                 perm_id:8,
    //                 review:recommendation,
    //                 disapproval:disapproval
    //             }
    //             Swal.fire({
    //                 icon:'info',
    //                 title: 'Confirm approved?',
    //                 showCancelButton: true,
    //                 confirmButtonText: 'Yes',
    //               }).then((result) => {
    //                 /* Read more about isConfirmed, isDenied below */
    //                 if (result.isConfirmed) {
    //                     Swal.fire({
    //                         icon:'info',
    //                         title:'Saving data',
    //                         html:'Please wait...',
    //                         allowEscapeKey:false,
    //                         allowOutsideClick:false
    //                     })
    //                     Swal.showLoading()
    //                     submitLeaveApplicationApproval(data)
    //                     .then((response)=>{
    //                         setmodalOpen(false)
    //                         if(response.data.status === 'success'){
    //                             setLeaveApplicationData(response.data.data)
    //                             setRecommendation('')
    //                             setDisapproval('')
    //                             Swal.fire({
    //                                 icon:'success',
    //                                 title:response.data.message
    //                             })
    //                         }else{
    //                             Swal.fire({
    //                                 icon:'error',
    //                                 title:response.data.message
    //                             })
    //                         }
    //                     }).catch((error)=>{
    //                         console.log(error)
    //                     })
    //                 }
    //               })
    //         }else{
    //             if(disapproval.length !== 0){
    //                 var data = {
    //                     leave_application_id:employeeInfo.leave_application_id,
    //                     perm_id:8,
    //                     review:recommendation,
    //                     disapproval:disapproval,
    //                     leave_type_id:employeeInfo.leave_type_id,
    //                     days_hours_applied:employeeInfo.days_hours_applied
    //                 }
    //                 Swal.fire({
    //                     icon:'info',
    //                     title: 'Confirm submit?',
    //                     showCancelButton: true,
    //                     confirmButtonText: 'Yes',
    //                   }).then((result) => {
    //                     /* Read more about isConfirmed, isDenied below */
    //                     if (result.isConfirmed) {
    //                         Swal.fire({
    //                             icon:'info',
    //                             title:'Saving data',
    //                             html:'Please wait...',
    //                             allowEscapeKey:false,
    //                             allowOutsideClick:false
    //                         })
    //                         Swal.showLoading()
    //                         submitLeaveApplicationApproval(data)
    //                         .then((response)=>{
    //                             setmodalOpen(false)
    //                             if(response.data.status === 'success'){
    //                                 setLeaveApplicationData(response.data.data)
    //                                 setRecommendation('')
    //                                 setDisapproval('')
    //                                 Swal.fire({
    //                                     icon:'success',
    //                                     title:response.data.message
    //                                 })
    //                             }else{
    //                                 Swal.fire({
    //                                     icon:'error',
    //                                     title:response.data.message
    //                                 })
    //                             }
    //                         }).catch((error)=>{
    //                             console.log(error)
    //                         })
    //                     }
    //                   })
    //             }else{
    //                 Swal.fire({
    //                     icon:'warning',
    //                     title:'Oops...',
    //                     html:'Please specify reason for disapproval.'
    //                 })
    //             }
    //         }
            
    //     }else{
    //         Swal.close();
    //         Swal.fire({
    //             icon:'warning',
    //             title:'Oops...',
    //             html:'Please select value for Action'
    //         })
    //     }
        

    // }
    const [recommendation,setRecommendation] = React.useState('');
    const handleRecommendation = (value) =>{
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

            getFilterApprovalLeaveApplicationData(filter)
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
            getApprovalLeaveApplicationData()
            .then((response)=>{
                setLeaveApplicationData(response.data.data)
                Swal.close()

            }).catch((error)=>{
                console.log(error)
                Swal.close()
            })
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
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}  >
            {isLoading
            ?
            <Skeleton variant="text" height={'70px'} animation="wave"/>
            :
            <Fade in={!isLoading}>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}} className='custom-boxshadow'>
                    <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',padding:'15px 0 15px 0'}}  >
                    {/* <StickyNote2 fontSize='large'/> */}
                    &nbsp;
                    Leave Application Approval
                </Typography>

                </Box>
            </Grid>
            </Fade>
            }
        {isLoading
        ?
        <Grid container>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Skeleton animation="wave" height={'70px'} width={'200px'}/>
                    <Skeleton animation="wave" height={'70px'} width={'70px'}/>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Skeleton animation="wave" height={'70px'} width={'250px'}/>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <Skeleton animation="wave" height={'70px'} width={'100%'}/>
                <Skeleton animation="wave" height={'40vh'} width={'100%'} sx={{marginTop:'-70px'}}/>
            </Grid>
            
        </Grid>
        :
        <Fade in>
            <Grid container sx={{mt:2}}>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{marginBottom:'10px'}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>

                    <FormControl sx = {{width:matches?'100%':'250px'}}>
                    <InputLabel id="select-filter">Filter</InputLabel>
                    <Select
                        labelId="select-filter"
                        id="select-filter"
                        value={filter}
                        label="Filter"
                        onChange={handleFilterChange}
                    >
                        <MenuItem value={'For Approval'}>For Approval</MenuItem>
                        <MenuItem value={'Approved'}>Approved</MenuItem>
                        <MenuItem value={'Disapproved'}>Disapproved</MenuItem>
                    </Select>
                    </FormControl>

                    <Tooltip title="Refresh Data" placement='top'>
                    <Button variant = "outlined" onClick = {refreshData}><CachedIcon/></Button>

                    </Tooltip>
                    </Box>

                </Grid>
            <Grid component={Paper} item xs={12} sm={12} md={12} lg={12}>
               <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>       
                {
                    leaveApplicationData.length ===0
                    ?
                    null
                    :
                    searchComponent
                }

                </Box>
                <Box component = {Paper}>
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
                    filter === 'For Approval' || filter === ''
                    ?
                    
                    <React.Fragment>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Employee name</StyledTableCell>
                                    <StyledTableCell>Type of leave</StyledTableCell>
                                    <StyledTableCell>Date filed</StyledTableCell>
                                    <StyledTableCell>No. of days/hours applied</StyledTableCell>
                                    <StyledTableCell>Form</StyledTableCell>
                                    <StyledTableCell align='center'>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                
                                {
                                    isLoadingData
                                    ?
                                    <React.Fragment>
                                    <TableRow>
                                    <StyledTableCell colSpan={6}>
                                    <Stack>
                                        <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                    </Stack>
                                    </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                    <StyledTableCell colSpan={6}>
                                    <Stack>
                                        <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                    </Stack>
                                    </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                    <StyledTableCell colSpan={6}>
                                    <Stack>
                                        <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                    </Stack>
                                    </StyledTableCell>
                                    </TableRow>
                                    </React.Fragment>
                                    :
                                    filteredItems.length === 0
                                    ?
                                    <TableRow><StyledTableCell colSpan={5} align='center'>No Data</StyledTableCell></TableRow>
                                    :
                                    filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                        <TableRow hover key={key}>
                                            <StyledTableCell>{row.fullname}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type_name}</StyledTableCell>
                                            <StyledTableCell>{moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type_id === 14?  row.days_hours_applied+' hr/s': row.days_hours_applied+' day/s'}</StyledTableCell>
                                            <StyledTableCell><IconButton onClick = {()=>showLeaveForm(row)} className='custom-iconbutton' color='primary'> <VisibilityOutlinedIcon/></IconButton></StyledTableCell>
                                            <StyledTableCell sx={{minWidth:130}} align='center'>
                                                <Tooltip title ='Approved'>
                                                <IconButton color='success' onClick = {()=>submitApprovedApplication(row)} sx={{'&:hover': { bgcolor: green[800], color: '#fff'}}} className='custom-iconbutton'><ThumbUpOutlinedIcon/></IconButton>
                                                </Tooltip>
                                                &nbsp;
                                                <Tooltip title ='Disapproved'>
                                                <IconButton color='error' onClick = {()=>submitDispprovedApplication(row)} sx={{'&:hover': { bgcolor: red[800], color: '#fff'}}} className='custom-iconbutton'><ThumbDownOutlinedIcon/></IconButton>
                                                </Tooltip>
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
        <Modal
            open={modalOpen}
            onClose={()=> setmodalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            {/* <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant={matches?"h6":"h5"} component={matches?"h3":"h2"}>
                VIEWING LEAVE APPLICATION FORM
            </Typography> */}
            {/* <CancelOutlinedIcon/> */}
            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setmodalOpen(false)}/>

            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Viewing leave application
            </Typography>
            <Box sx={{mt:2,pt:0,pl:2,pr:2,pb:2,maxHeight:'70vh',overflow:'scroll'}}>
                <Grid container component = {Paper} sx={{padding:matchesMD?'5px':''}}>
                {
                    employeeInfo.leave_type_id === 14
                    ?
                        matches || matchesMD
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'20px':'auto'}}>
                            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Date Filed
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Name
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.fullname}
                                    </Typography>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Office/Department
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.officeCode}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Application Type
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    CTO
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        No. of {employeeInfo.leave_type_id === 14?'Hours':'Days'} Applied
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_hours_applied}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Inclusive Dates
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.inclusive_dates_text}
                                    </Typography>
                                </Grid>

                            </Box>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Action"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Approved</MenuItem>
                                    <MenuItem value={2}>Disapproved</MenuItem>
                                </Select>
                                </FormControl>
                            {recommendation.length !==0
                            ?
                                recommendation === 1
                                ?
                                ''
                                :
                                <>
                                <br/>
                                <br/>
                                <TextField label = "Disapproved due to" fullWidth value = {disapproval} onChange = {(value)=>setDisapproval(value.target.value)}/>
                                </>
                                
                            :
                            ''
                            }
                        </Grid>
                        </Grid>
                        </>
                        :
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            
                            <PreviewCTOApplicationForm auth_info = {authInfo} info={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {1} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing} cto_info ={ctoInfo} pendinginfo = {employeeInfo}/>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'flex-end',margin:'0 17px 10px 0'}}>
                                    <Button variant='outlined' onClick = {viewCOCFile} startIcon={<AttachFileIcon/>}>View COC File Attachement</Button>
                                </Box>
                            </Grid>
                            
                        </Grid>
                        </>
                    :
                    matches || matchesMD
                    ?
                        employeeInfo.length !==0
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'20px':'auto'}}>
                            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Date Filed
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Name
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.fullname}
                                    </Typography>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Office/Department
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.officeCode}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Application Type
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.leave_type_name}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Details
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.details_name}
                                    </Typography>
                                </Grid>
                                <br/>

                                
                                {employeeInfo.specify_details.length !==0
                                    ?
                                    <>
                                    <Grid item lg = {2} sm = {12} xs = {12}>
                                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                            Specify Details
                                        </Typography>
                                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                        {employeeInfo.specify_details}
                                        </Typography>
                                    </Grid>
                                    <br/>
                                    </>
                                    :
                                    ''
                                }
                                {
                                    employeeInfo.commutation.length !==0
                                    ?
                                    <>
                                    <Grid item lg = {2} sm = {12} xs = {12}>
                                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                            Commutation
                                        </Typography>
                                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                        {employeeInfo.commutation}
                                        </Typography>
                                    </Grid>
                                    <br/>
                                    </>
                                    :
                                    ''
                                }
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        No. of {employeeInfo.leave_type_id === 14?'Hours':'Days'} Applied
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_hours_applied}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Inclusive Dates
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.inclusive_dates_text}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Days with Pay
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_with_pay}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Days without Pay
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_without_pay}
                                    </Typography>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        CERTIFICATION OF LEAVE CREDITS
                                        </Typography>
                                        <Typography sx={{fontSize:'11px',textAlign:'center',borderBottom:'solid 1px',marginBottom:'10px'}}>As of {moment(new Date()).format('MMMM YYYY')}</Typography>
                                        <table className='table table-bordered' style = {{fontSize:'12px'}}>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>VL</th>
                                                        <th>SL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><em>Total Earned</em></td>
                                                        <td>{employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 1 ?employeeInfo.bal_before_review:employeeInfo.vl_bal}</td>
                                                        <td>{employeeInfo.leave_type_id === 3 ?employeeInfo.bal_before_review:employeeInfo.sl_bal}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><em>Less this Application</em></td>
                                                        <td>{employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 1 ?employeeInfo.days_hours_applied:''}</td>
                                                        <td>{employeeInfo.leave_type_id === 3 ?employeeInfo.days_hours_applied:''}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><em>Balance</em></td>
                                                        <td>{employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 1 ?employeeInfo.bal_after_review:''}</td>
                                                        <td>{employeeInfo.leave_type_id === 3 ?employeeInfo.bal_after_review:''}</td>
                                                    </tr>
                                                </tbody>
                                        </table>
                                </Grid>
                            </Box>
                            
                        </Grid>
                        </>
                        :
                        ''
                    :
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
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
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Action"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Approved</MenuItem>
                                    <MenuItem value={2}>Disapproved</MenuItem>
                                </Select>
                                </FormControl>
                            {recommendation.length !==0
                            ?
                                recommendation === 1
                                ?
                                ''
                                :
                                <>
                                <br/>
                                <br/>
                                <TextField label = "Disapproved due to" fullWidth value = {disapproval} onChange = {(value)=>setDisapproval(value.target.value)}/>
                                </>
                                
                            :
                            ''
                            }
                        </Grid> */}
                    </>

                }
                
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'20px':'auto'}}>
                <br/>

                    {showLeaveTypePreview()}
                    {/* <Button fullWidth variant='outlined' sx={{margin:'0 20px 20px 0'}}>sdf</Button> */}
                </Grid>
                <br/>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'25px':'auto'}}>
                        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                            {/* <Button variant='contained' color="success" onClick = {submitApproveApplication}>SUBMIT</Button><br/> */}
                            <Button variant='contained' color="error" onClick={()=> setmodalOpen(false)}>CANCEL</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            </Box>

        </Modal>
        
        <div style={{ display: "none" }}>
            <PreviewLeaveApplicationForm ref={leaveRef} data={typeOfLeaveData} leaveType = {employeeInfo.leave_type_id} auth_info = {authInfo} info={employeeInfo} pendinginfo={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
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
            <PreviewCTOApplicationForm ref={cocRef} auth_info = {authInfo} info={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {1} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing} cto_info ={ctoInfo} pendinginfo = {employeeInfo}/>
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
        // <TextField value={props.filterText} onChange={props.onFilter} label={
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