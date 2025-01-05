import React, { useEffect,useRef, useState } from 'react';
import { Grid, Typography,Container,Paper,Box, Button,FormControl,InputLabel,Select,MenuItem,Fade,CircularProgress,Modal, TextField,Tooltip,Skeleton, Stack,TableContainer,Table,TableHead,TableRow,TableBody,TableCell,TableFooter,TablePagination,IconButton,Pagination,InputAdornment} from '@mui/material';
//icon
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CachedIcon from '@mui/icons-material/Cached';
import ArticleIcon from '@mui/icons-material/Article';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Backdrop from '@mui/material/Backdrop';
import { green,red,blue } from '@mui/material/colors';
//leave application request
import { getVerifyLeaveApplicationData,getFilterVerifyLeaveApplicationData,getMaternityAllocationInfo, postReviewApplicLeaveAPI, getSPLBal } from './LeaveApplicationRequest';
//check permission request
import { checkPermission } from '../permissionrequest/permissionRequest';
import { submitLeaveApplicationReview } from './LeaveApplicationRequest';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import ClearIcon from '@mui/icons-material/Clear';
//Data table
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
// import FilterComponent from 'react-data-table-component'
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
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
import AllocationOfMaternityLeaveForm from './AllocationOfMaternityLeaveForm';
import DataTableLoader from '../loader/DataTableLoader';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { auditLogs } from '../auditlogs/Request';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { viewFileAPI } from '../../../viewfile/ViewFileRequest';
export default function LeaveApplicationVerification(){
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
    const [leaveApplicationData,setLeaveApplicationData] = React.useState([])
    const [originalLeaveApplicationData,setOriginalLeaveApplicationData] = React.useState([])

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

    const [pending, setPending] = React.useState(true);


    //loading
    const [loading,setLoading] = React.useState(true);
    const [isLoadingData,setIsisLoadingData] = React.useState(true);
    const [SPLBal,setSPLBal] = useState(0)
    const [filterChange,setFilterChange] = useState(false);
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
        width: matches||matchesMD? 300:900,
        marginBottom: '20px',
        marginTop: '10px',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 2,
        // overflow:'scroll',
        // height:'100%',
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
        checkPermission(8)
        .then((response)=>{
            // console.log(response.data)
            var logs = {
                action:'ACCESS ONLINE LEAVE VERIFICATION',
                action_dtl:'ACCESS ONLINE LEAVE VERIFICATION MODULE',
                module:'ONLINE LEAVE VERIFICATION'
            }
            auditLogs(logs)
            setisLoading(false)
            if(response.data){
                getVerifyLeaveApplicationData()
                .then((response)=>{
                    console.log(response.data)
                    setLeaveApplicationData(response.data.data)
                    setOriginalLeaveApplicationData(response.data.data)
                    setAuthInfo(response.data.auth_info)
                    setCtoInfo(response.data.cto_info)
                    // setAction(response.data.actions)
                    setPending(false)
                    setIsisLoadingData(false)
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
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                background:blue[800],
                color:'#fff',
                fontSize:matches? '13px':'17px',
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
    const column = [
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
            selector: row => row.leave_type_id === 14?  row.days_hours_applied+' hr/s': row.days_hours_applied+' day/s',
        },
        {
            name: 'Action',
            selector: row =>
                <Button variant="outlined" sx={{fontSize:matches?'9px':'auto',margin:'10px 0 0 0','&:hover':{color:'#fff',background:green[800]}}}size='small' onClick={()=>setInfo(row)} startIcon={<EditIcon/>} fullWidth color="success">REVIEW</Button>
                
        },
    ]
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
            name: 'Inclusive Dates',
            selector: row => row.inclusive_dates_text,
        },
        {
            name: 'Date Filed',
            selector: row => moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A'),
        },
        {
            name: 'No. of Days/Hours Applied',
            selector: row =>  row.leave_type_id === 14? row.days_hours_applied+' hr/s':row.days_hours_applied+' day/s',
        },
        {
            name: 'Status',
            selector: row => <em>{row.status === 'DISAPPROVED' ? <span style={{color:'red'}}>{row.status}</span> : <span style={{color:'green'}}>{row.status}</span>}</em>,
        },
        {
            name: 'Remarks',
            selector: row => row.remarks,
        },
        // {
        //     name: 'Action',
        //     selector: row =>
        //         row.status === 'APPROVED'
        //         ?
        //         <Box>
        //             <Button fullWidth variant='outlined' size = "small" startIcon={<PrintIcon/>} sx={{fontSize:matches?'9px':'auto',margin:'10px 0 10px 0'}} onClick = {()=>printPending(row)}>Print</Button>
        //         </Box>
        //         :
        //         ''
        // }
    ]
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
            office_head_pos:data.office_head_pos,
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
    const [filter,setFilter] = React.useState('For Review');
    const [employeeInfo,setEmployeeInfo] = React.useState([])
    const setInfo = (data) => {
        var logs = {
            action:'REVIEW LEAVE APPLICATION',
            action_dtl:'EMPLOYEE ID = '+data.employee_id+' | LEAVE ID = '+ data.leave_type_id+' | LEAVE DETAILS ID = '+ data.details_of_leave_id+' | INCLUSIVE DATES = '+ data.inclusive_dates_text+ ' | DWP = '+data.days_with_pay+' | DWOP = '+ data.days_without_pay,
            module:'ONLINE LEAVE VERIFICATION'
        }
        auditLogs(logs)
        console.log(data)
        if(data.leave_type_id === 6){
            var data2 = {
                employee_id:data.employee_id
            }
            getSPLBal(data2)
            .then(res=>{
                setSPLBal(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }
        setmodalOpen(true)

        setEmployeeInfo(data)
        setaoAssign({...aoAssign,
            office_ao:data.incharge_name,
            office_ao_assign:data.incharge_pos,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_head_pos:data.office_head_pos,
        })
    }
    const viewInfo = (data) => {
        setmodalViewOpen(true)

        setEmployeeInfo(data)
        setaoAssign({...aoAssign,
            office_ao:data.incharge_name,
            office_ao_assign:data.incharge_pos,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_name:data.office_head_position,
        })
    }
    const handleFilterChange = (value)=>{
        setFilterChange(true)
        // setLoading(true)
        var logs = {
            action:'FILTER LEAVE VERIFICATION',
            action_dtl:'FILTER = '+value.target.value,
            module:'ONLINE LEAVE VERIFICATION'
        }
        auditLogs(logs)
        setFilter(value.target.value)
        setFilterTextReview('');
		setResetPaginationToggle(!resetPaginationToggle);

        getFilterVerifyLeaveApplicationData(value.target.value)
        .then((response) =>{
            setLeaveApplicationData(response.data.data)
            // console.log(response.data)
            // setLoading(false)
            setFilterChange(false)


        }).catch((error)=>{
            console.log(error)
        })
    }
    const showLeaveTypePreview = () =>{
        switch(employeeInfo.leave_type_id){
            case 1:
            case 2:
            case 3:
            case 4:
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
    const submitReviewApplication = (event) =>{
        console.log(employeeInfo)
        event.preventDefault();
        
        employeeInfo.key = 'b9e1f8a0553623f1:639a3e:17f68ea536b';
        employeeInfo.applic_year = parseInt(moment(employeeInfo.date_of_filing).format('YYYY'));
        employeeInfo.applic_month = parseInt(moment(employeeInfo.date_of_filing).format('M'));
        employeeInfo.date_of_filing = moment(employeeInfo.date_of_filing).format('YYYY-MM-DD');
        employeeInfo.auth_name = authInfo[0].auth_name;
        employeeInfo.auth_pos = authInfo[0].auth_pos;
        if(employeeInfo.details_of_leave_id === 9 ||employeeInfo.details_of_leave_id === 9){
            employeeInfo.inc_dates = null;
            employeeInfo.inc_dates1 = null;
            employeeInfo.inc_dates2 = null;
            employeeInfo.leave_code = employeeInfo.leave_code2;
        }else{
            var temp_inc_date = JSON.parse(employeeInfo.inclusive_dates);
            var temp_inc_date_arr = '';
            var temp_inc_date_arr2 = '';
            temp_inc_date.forEach((el,key) => {
                if(key === 0){
                    if(temp_inc_date.length === key+1){
                        temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY');
                        temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY ')+ moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');

                    }else{
                        temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('MM/DD ');
                        temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('MM/DD/YYYY ');
                    }
                }else if(temp_inc_date.length === key+1){
                    var interval = moment(el.date,'MM-DD-YYYY').diff(moment(temp_inc_date[key-1].date,'MM-DD-YYYY'), 'days');
                    /**
                        * If day interval is 1, means consecutive dates
                        */
                    if(interval === 1){
                        temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                        temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                    }else{
                        temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY');
                        temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY');

                    }
                }
                else{
                    var interval = moment(el.date).diff(moment(temp_inc_date[key-1].date), 'days');

                    if(interval !== 1){
                        temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format(';MM/DD ');
                        temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format(';MM/DD/YYYY ');

                    }else{
                        var interval2 = moment(temp_inc_date[key+1].date,'MM-DD-YYYY').diff(moment(el.date,'MM-DD-YYYY'), 'days');
                        if(interval2 !== 1){

                            temp_inc_date_arr = temp_inc_date_arr + moment(el.date,'MM-DD-YYYY').format('to MM/DD');
                            temp_inc_date_arr2 = temp_inc_date_arr2 + moment(el.date,'MM-DD-YYYY').format('to MM/DD/YYYY');
                        }
                    }
                }
            });
            let dwpay = Math.round(employeeInfo.days_with_pay);
            let dwpay_days = [];
            let dwopay_days = [];
        
            if(employeeInfo.leave_type_id === 14 || employeeInfo.leave_type_id === 6){
                temp_inc_date.forEach(el=>{
                    dwpay_days.push(el);
                })
            }
            var temp_fin_inc_date_arr = temp_inc_date_arr2.split(';');
            var fin_inc_date_arr = [];
            temp_fin_inc_date_arr.forEach(el=>{
                let dates_arr = el.split('to');
                let date1 = dates_arr[0];
                let date2_temp = dates_arr[1];
                let date2;
                if(date2_temp){
                    date2 = dates_arr[1];
                }else{
                    date2 = dates_arr[0];
                }
                let total_days = moment(date2,'MM-DD-YYYY').diff(moment(date1,'MM-DD-YYYY'),'days')+1;
                fin_inc_date_arr.push({
                    'date':el,
                    'date1':date1,
                    'date2':date2,
                    'total_days':total_days
                })

            })
        
            if(temp_inc_date.length > 1){
                // employeeInfo.inc_dates = moment(temp_inc_date[0].date).format('MM/DD; ')+moment(temp_inc_date[temp_inc_date.length-1].date).format('MM/DD/YYYY');
                employeeInfo.inc_dates = temp_inc_date_arr;
                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                employeeInfo.inc_dates_arr = fin_inc_date_arr;
                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_mat_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                employeeInfo.inc_cto_dates_arr = dwpay_days;

            }else{
                console.log(temp_inc_date[0].date)
                employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                employeeInfo.inc_dates_arr = fin_inc_date_arr;
                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')

                employeeInfo.inc_cto_dates_arr = dwpay_days;

            }
        }
        
        console.log(employeeInfo)
        Swal.fire({
            icon:'info',
            title: 'Confirm submit ?',
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
                // console.log(employeeInfo)
                if(employeeInfo.emp_status === 'RE' || employeeInfo.emp_status === 'CS' || employeeInfo.emp_status === 'COS'){
                    postReviewApplicLeaveAPI(employeeInfo)
                    .then(res=>{
                        console.log(res.data)
                        // Swal.close();
                        if(res.data.status === 200){
                            var data = {
                                leave_application_id:employeeInfo.leave_application_id,
                                leave_type_id:employeeInfo.leave_type_id,
                                days_hours_applied:employeeInfo.days_hours_applied,
                                days_with_pay:employeeInfo.days_with_pay,
                                emp_id:employeeInfo.employee_id,
                                inclusive_dates:employeeInfo.inclusive_dates_text,
                                review:recommendation,
                                perm_id:8,
                                ref_no:res.data.ref_no
                            }
                            submitLeaveApplicationReview(data)
                            .then((response)=>{
                                if(response.data.status === 'success'){
                                    setLeaveApplicationData(response.data.data.data)
                                    setRecommendation('')
                                    setDisapproval('')
                                    setmodalOpen(false)
                                    Swal.fire({
                                        icon:'success',
                                        title:response.data.message,
                                        showConfirmButton:false,
                                        timer:1500
                                    })
                                }else{
                                    setLeaveApplicationData(response.data.data.data)
                                    setRecommendation('')
                                    setDisapproval('')
                                    setmodalOpen(false)
                                    Swal.fire({
                                        icon:'error',
                                        title:'Oops...',
                                        html:response.data.message
                                    })
                                }
                            }).catch((error)=>{
                                console.log(error)
                                Swal.close()
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
                }else{
                    var data = {
                        leave_application_id:employeeInfo.leave_application_id,
                        leave_type_id:employeeInfo.leave_type_id,
                        days_hours_applied:employeeInfo.days_hours_applied,
                        days_with_pay:employeeInfo.days_with_pay,
                        emp_id:employeeInfo.employee_id,
                        inclusive_dates:employeeInfo.inclusive_dates_text,
                        review:recommendation,
                        perm_id:8,
                        ref_no:null
                    }
                    submitLeaveApplicationReview(data)
                    .then((response)=>{
                        if(response.data.status === 'success'){
                            setLeaveApplicationData(response.data.data.data)
                            setRecommendation('')
                            setDisapproval('')
                            setmodalOpen(false)
                            Swal.fire({
                                icon:'success',
                                title:response.data.message,
                                showConfirmButton:false,
                                timer:1500
                            })
                        }else{
                            // console.log(response.data.data.data)
                            setLeaveApplicationData(response.data.data.data)
                            setRecommendation('')
                            setDisapproval('')
                            setmodalOpen(false)
                            Swal.fire({
                                icon:'error',
                                title:'Oops...',
                                html:response.data.message
                            })
                        }
                    }).catch((error)=>{
                        console.log(error)
                        Swal.close()
                    })
                }
                
                
            }
        })
       

    }
    const [recommendation,setRecommendation] = React.useState('');
    const handleRecommendation = (value) =>{
        setRecommendation(value.target.value)
    }
    const [disapproval,setDisapproval] = React.useState('');
    const viewFileAttachment = (type) =>{
        switch(type){
            // case 'default':
            //     var file_id = JSON.parse(employeeInfo.file_ids);
            //     switch(employeeInfo.leave_type_id){
            //         case 3:
            //         case 4:
            //         case 5:
            //         case 14:
            //             axios({
            //                 url: 'api/fileupload/viewFile/'+file_id, //your url
            //                 method: 'GET',
            //                 responseType: 'blob', // important
            //             }).then((response) => {
            //                 console.log(response.data)
            //                 const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
            //                 const link = document.createElement('a');
            //                 link.href = url;
            //                 link.setAttribute('target', '_BLANK'); //or any other extension
            //                 document.body.appendChild(link);
            //                 link.click();
            //             });
            //         break;
            //         default:
            //             alert('default')
            //             break;
            //     }
            //     break;
            case 'maternity':
                // console.log('proof of relationship')
                var file_id = employeeInfo.benefit_relationship_proof_fileid;
                viewFileAPI(file_id)
                // axios({
                //     url: 'api/fileupload/viewFile/'+file_id, //your url
                //     method: 'GET',
                //     responseType: 'blob', // important
                // }).then((response) => {
                //     console.log(response.data)
                //     const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                //     const link = document.createElement('a');
                //     link.href = url;
                //     link.setAttribute('target', '_BLANK'); //or any other extension
                //     document.body.appendChild(link);
                //     link.click();
                // });
                break;
            default:
                var file_id = JSON.parse(employeeInfo.file_ids);
                viewFileAPI(file_id)

                // axios({
                //     url: 'api/fileupload/viewFile/'+file_id, //your url
                //     method: 'GET',
                //     responseType: 'blob', // important
                // }).then((response) => {
                //     console.log(response.data)
                //     const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                //     const link = document.createElement('a');
                //     link.href = url;
                //     link.setAttribute('target', '_BLANK'); //or any other extension
                //     document.body.appendChild(link);
                //     link.click();
                // });
                break;
        }
        
    }
    const [filterTextReview, setFilterTextReview] = React.useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
	const filteredItems = leaveApplicationData.filter(
		item => item.fname && item.fullname.toLowerCase().includes(filterTextReview.toLowerCase()) || item.lname && item.lname.toLowerCase().includes(filterTextReview.toLowerCase()),
	);

	const searchComponent = React.useMemo(() => {
		const handleClear = () => {
			if (filterTextReview) {
				// setResetPaginationToggle(!resetPaginationToggle);
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
			setResetPaginationToggle(!resetPaginationToggle);
            setFilterTextReview('');
            getFilterVerifyLeaveApplicationData(filter)
            .then((response) =>{
                setLeaveApplicationData(response.data.data)
                Swal.close()
            }).catch((error)=>{
                console.log(error)
                Swal.close()
            })
        }else{
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterTextReview('');
            getVerifyLeaveApplicationData()
            .then((response)=>{
                setLeaveApplicationData(response.data.data)
                setAuthInfo(response.data.auth_info)

                Swal.close()

            }).catch((error)=>{
                console.log(error)
                Swal.close()
            })
        }
    }
    const [allocationModalOpen,setAllocationModalOpen] = React.useState(false)
    const [allocationInfo,setAllocationInfo] = React.useState([])
    const [allocationInfoSignature,setAllocationInfoSignature] = React.useState('')
    const handleAllocationForm = () => {
        console.log(employeeInfo)

        getMaternityAllocationInfo(employeeInfo.leave_application_id)
        .then(response=>{
            const data = response.data
            var benefit_sig = data.benefit_fullname.split(',');
            var temp;
            if(benefit_sig.length === 3){
                temp = benefit_sig[1].trim()+' '+benefit_sig[2].trim().charAt(0)+'. '+ benefit_sig[0].trim()
            }
            if(benefit_sig.length === 4){
                temp = benefit_sig[1].trim()+' '+benefit_sig[3].trim().charAt(0)+'. '+ benefit_sig[0].trim()+' '+benefit_sig[2].trim()
            }
            setAllocationInfoSignature(temp.toUpperCase())
            setAllocationInfo(data)
            setAllocationModalOpen(true)
        }).catch(error=>{
            console.log(error)
        })
    }
    const showFileAttachment = () => {
        switch(employeeInfo.leave_type_id){
            case 3:
                return (
                    <>
                        {
                        employeeInfo.file_ids !== null
                        ?
                        <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                            <hr/>
                            <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold',background:'#006fe9',padding:'5px',color:'#fff'}}><AttachFileIcon/> File Attachment</Typography>
                            <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
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
                        :
                        ''
                        }
                    </>
                    
                );
                break;
            case 4:
                if(employeeInfo.days_hours_applied<105){
                    return(
                        <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                            <hr/>
                        <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold',background:'#006fe9',padding:'5px',color:'#fff'}}><AttachFileIcon/> File Attachment</Typography>
                        <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
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
                                    <em>Proof of Relationship</em>
                                    </td>
                                    <td>
                                    <Button variant='outlined' onClick = {()=>viewFileAttachment('maternity')} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <br/>
                        <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold',background:'#006fe9',padding:'5px',color:'#fff'}}><ArticleIcon/> Form</Typography>
                        <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Form Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                    <em>Notice of Allocation of Maternity Leave</em>
                                    </td>
                                    <td>
                                    <Button variant='outlined' onClick = {handleAllocationForm} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <Modal
                            open={allocationModalOpen}
                            onClose={()=> setAllocationModalOpen(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                            <Box>
                            <AllocationOfMaternityLeaveForm info = {employeeInfo} employeeContactDetails = {allocationInfo.employee_contact_details}
                            maternityRelationship = {allocationInfo.benefit_relationship} maternityRelationshipDetails={allocationInfo.benefit_relationship_details} maternityRelationshipSpecifyDetails = {allocationInfo.benefit_relationship_details_specify} allocate_days ={allocationInfo.allocation_number_days} allocatePersonFullname = {allocationInfo.benefit_fullname} allocatePersonPosition = {allocationInfo.benefit_position} allocatePersonHomeAddress = {allocationInfo.benefit_home_address} allocatePersonAgencyAddress = {allocationInfo.benefit_agency_address} allocatePersonContactDetails = {allocationInfo.benefit_contact_details} benefitsignature = {allocationInfoSignature} maternityRelationshipProof = {allocationInfo.benefit_proof_relationship}/>
                            </Box>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Button variant="contained" color="error" onClick={()=> setAllocationModalOpen(false)}>Close</Button>
                            </Box>
                            </Box>
                        </Modal>
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
            case 5:
                return (
                    <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                    <hr/>
                    <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold',background:'#006fe9',padding:'5px',color:'#fff'}}><AttachFileIcon/> File Attachment</Typography>
                    <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
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
                                    <em>Proof of Child's Delivery</em>
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
            case 9:
            case 10:
            case 11:
            case 12:
            case 15:
                if(employeeInfo.file_ids === null){
                    return null;
                }else{
                    return (
                    <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                    <hr/>
                    <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold',background:'#006fe9',padding:'5px',color:'#fff'}}><AttachFileIcon/> File Attachment</Typography>
                    <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
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
                                    <em>Supporting Document</em>
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
                <Grid item xs={12} sm={12} md={12} lg={12} sx = {{margin:matches?'0':'10px'}}>
                    <hr/>
                    <Typography sx={{textAlign:'center',fontSize:'20px',fontWeight:'bold',background:'#006fe9',padding:'5px',color:'#fff'}}><AttachFileIcon/> File Attachment</Typography>
                    <div style={{background:'#ECF9FF',padding:'10px',borderRadius:'5px'}}>
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
    const [rowsPerPage,setRowsPerPage] = useState(5);
    const [page,setPage] = useState(0)
    const handleChangePage = (event,page) =>{
        setPage(page)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleSearch = (value)=>{
        // const filteredRows = leaveApplicationData.filter((row) => {
        // return row.fullname.toLowerCase().includes(value.toLowerCase());
        // });
        const filteredRows = leaveApplicationData.filter( item =>
            item.fname && item.fname.toLowerCase().includes(value.toLowerCase())
	    )
        console.log(filteredRows)
        setLeaveApplicationData(filteredRows);
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
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
                    Leave Application Verification
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
                    {/* <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Button variant='outlined' size='large'><HistoryOutlinedIcon/></Button>
                    </Box> */}
                    <Box sx={{display:'flex',justifyContent:'space-between'}}>
                    <Box>
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
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Tooltip title="Refresh Data" placement='top'>
                    <Button variant = "outlined" onClick = {refreshData}><CachedIcon/></Button>
                    </Tooltip>
                    {/* &nbsp;
                    <Tooltip title="Refresh Data" placement='top'>
                    <Button variant = "outlined" onClick = {refreshData}><CachedIcon/></Button>
                    </Tooltip> */}
                    </Box>
                    </Box>

                </Grid>
            <Grid  item xs={12} sm={12} md={12} lg={12}>
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
                    <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                    </Box>
                    :
                    filter === 'For Review' || filter === ''
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
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                
                                {
                                    isLoadingData
                                    ?
                                    <React.Fragment>
                                    <TableRow>
                                    <StyledTableCell colSpan={5}>
                                    <Stack>
                                        <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                    </Stack>
                                    </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                    <StyledTableCell colSpan={5}>
                                    <Stack>
                                        <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                    </Stack>
                                    </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                    <StyledTableCell colSpan={5}>
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
                                            <StyledTableCell><Tooltip title='Review application'><IconButton color='success' sx={{'&:hover':{color:'#fff',background:green[800]}}} size={matches?'small':'large'} onClick={()=>setInfo(row)} className='custom-iconbutton'><RateReviewIcon/></IconButton></Tooltip>
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
                        progressPending={pending}
			            progressComponent={<DataTableLoader />}

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
            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setmodalOpen(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                REVIEWING LEAVE APPLICATION
                </Typography>
                <form onSubmit={submitReviewApplication}>
                <Box sx={{m:1,maxHeight:matches?'50vh':'70vh',overflowY:'scroll'}}>
                <Grid container>
                <div style={{position:'relative'}}>
                {
                    employeeInfo.leave_type_id === 14
                    ?
                        matches || matchesMD
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'10px':'auto'}}>
                        <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                            <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                Available COC Balance: {employeeInfo.bal_before_process}.00 HOURS
                            </Typography>
                        </Grid>
                            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                                <Grid item container spacing={1}>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <TextField label='Date Filed' defaultValue={moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY')} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <TextField label='Employee Name' defaultValue={employeeInfo.fullname} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <TextField label='Office/Department' defaultValue={employeeInfo.officedepartment} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <TextField label='Leave Application Type' defaultValue='CTO' InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <TextField label="No. of Hours Applied" defaultValue={employeeInfo.days_hours_applied} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <TextField label="Inclusive Dates" defaultValue={employeeInfo.inclusive_dates_text} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                                </Grid>
                                </Grid>

                            </Box>
                            {showFileAttachment()}
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Action"
                                    onChange={handleRecommendation}
                                    required
                                >
                                    <MenuItem value={'Certified Correct'}>Certified Correct</MenuItem>
                                    <MenuItem value={'For Updating'}>For Updating</MenuItem>
                                </Select>
                                </FormControl>
                        </Grid>
                        </Grid>
                        </>
                        // End of CTO if sm
                        :
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            
                            <PreviewCTOApplicationForm info={employeeInfo} auth_info = {authInfo} pendinginfo={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing} status = {employeeInfo.status} cto_info = {ctoInfo}/>
                            
                        </Grid>
                        {showFileAttachment()}

                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px'}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Action</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={recommendation}
                                label="Action"
                                onChange={handleRecommendation}
                                required
                            >
                                <MenuItem value={'Certified Correct'}>Certified Correct</MenuItem>
                                <MenuItem value={'For Updating'}>For Updating</MenuItem>
                            </Select>
                            </FormControl>
                    </Grid>
                    </>
                    // End of CTO
                    :
                    matches || matchesMD
                    ?
                        employeeInfo.length !==0
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'20px':'auto'}}>
                        {employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 4
                                ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available VL Balance: {employeeInfo.vl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    :
                                    employeeInfo.leave_type_id === 3
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                    <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available SL Balance: {employeeInfo.sl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    
                                    :
                                    employeeInfo.leave_type_id === 14
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available COC Balance: {employeeInfo.coc_bal}.00 HOURS
                                        </Typography>
                                    </Grid>
                                    :
                                    employeeInfo.leave_type_id === 6
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available SPL Balance: {SPLBal} DAY/S
                                        </Typography>
                                    </Grid>
                                    :
                                    ''
                        }
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
                                    {employeeInfo.officedepartment}
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
                                    {employeeInfo.details_name ?employeeInfo.details_name  : ''}
                                    </Typography>
                                </Grid>
                                <br/>

                                
                                {employeeInfo.specify_details
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
                            </Box>
                            {showFileAttachment()}

                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}} id ='request-action'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Action"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Certified Correct</MenuItem>
                                    <MenuItem value={2}>For Updating</MenuItem>
                                </Select>
                                </FormControl>
                        </Grid>
                        </Grid>
                        </>
                        :
                        ''
                    :
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        <PreviewLeaveApplicationForm data={typeOfLeaveData} auth_info = {authInfo} leaveType = {employeeInfo.leave_type_id} info={employeeInfo} pendinginfo={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
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
                        } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation} is_preview={true} maternity_days = {employeeInfo.days_hours_applied}/>
                        </Grid>
                        {showFileAttachment()}

                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 15px 15px 15px'}} id ='request-action'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Action"
                                    onChange={handleRecommendation}
                                    required
                                >
                                    <MenuItem value={'Certified Correct'}>Certified Correct</MenuItem>
                                    <MenuItem value={'For Updating'}>For Updating</MenuItem>
                                </Select>
                                </FormControl>
                            
                        </Grid>
                    </>

                }
                </div>
                </Grid>
                </Box>
                <Box sx={{m:2}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'5px':'auto'}}>
                            <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                                <Button variant='contained' color="success" startIcon={<CheckOutlinedIcon/>} size='small' sx = {{'&:hover':{color:'#fff',background:green[800]}}}type='submit' className='custom-roundbutton'>SUBMIT</Button>&nbsp;
                                <Button variant='contained' color="error" onClick={()=> setmodalOpen(false)}startIcon={<CloseIcon/>} size='small' sx = {{'&:hover':{color:'#fff',background:red[800]}}} className='custom-roundbutton'>CANCEL</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                </form>
            
            </Box>

        </Modal>
        
        
        <div style={{ display: "none" }}>
            <PreviewLeaveApplicationForm ref={leaveRef} data={typeOfLeaveData} auth_info = {authInfo} leaveType = {employeeInfo.leave_type_id} info={employeeInfo} pendinginfo={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
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
            } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation} disapproval={employeeInfo.remarks} maternity_days = {employeeInfo.days_hours_applied}/></div>
        <div style={{ display: "none" }}>
            <PreviewCTOApplicationForm ref={cocRef} info={employeeInfo} auth_info = {authInfo} pendinginfo={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing} status = {employeeInfo.status} cto_info = {ctoInfo}/>
        </div>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={filterChange}
            // onClick={handleClose}
        >
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <CircularProgress color="inherit" />
            <Typography>Loading data. Please wait...</Typography>
            </Box>
        </Backdrop>
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
                <Tooltip title='Clear search'><IconButton color='error' onClick={props.onClear}><ClearIcon /></IconButton></Tooltip>
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