import React, { useEffect,useRef, useState } from 'react';
import { Grid, Typography,Container,Paper,Box, Button,FormControl,InputLabel,Select,MenuItem,Fade,CircularProgress,Modal, TextField,Tooltip,Skeleton, Stack,TableContainer,Table,TableHead,TableRow,TableBody,TableCell,TableFooter,TablePagination,IconButton,Pagination,InputAdornment,Autocomplete   } from '@mui/material';
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
import ClearIcon from '@mui/icons-material/Clear';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import RateReviewIcon from '@mui/icons-material/RateReview';

import Backdrop from '@mui/material/Backdrop';
import { green,red,blue } from '@mui/material/colors';
//leave application request
import { getVerifyLeaveApplicationData,getFilterVerifyLeaveApplicationData,getMaternityAllocationInfo, postReviewApplicLeaveAPI, getSPLBal,submitLeaveApplicationReview,getTypesOfLeave, getAllTypeOfLeave, postUpdatingReviewApplicLeaveAPI, submitLeaveApplicationUpdate } from '../LeaveApplicationRequest';
//check permission request
import { checkPermission } from '../../../permissionrequest/permissionRequest';
import LinearProgress from '@mui/material/LinearProgress';


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
import PreviewLeaveApplicationForm from '../PreviewLeaveApplicationForm';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { PreviewCTOApplicationForm } from '../PreviewCTOApplicationForm';
import Swal from 'sweetalert2';
import axios from 'axios';
import AllocationOfMaternityLeaveForm from '../AllocationOfMaternityLeaveForm';
import DataTableLoader from '../../../loader/DataTableLoader';
import { auditLogs } from '../../../auditlogs/Request';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import DashboardLoading from '../../../loader/DashboardLoading';
import ModuleHeaderText from '../../../moduleheadertext/ModuleHeaderText';
import UpdatingLeaveApplication from '../Modal/UpdatingLeaveApplication';
import { approvedHRReview, getHRForApproval, submitHRApprovalForUpdatingReview, submitHRApprovalForUpdatingReviewAPI, submitLeaveApplicationUpdateCTO } from './HRApprovalRequest';
import { APILoading, APIresult } from '../../../apiresponse/APIResponse';
import UpdateDates from './Modal/UpdateDates';
import { api_url } from '../../../../../request/APIRequestURL';
import { UpdateCTO } from './Component/UpdateCTO';
import SmallModal from '../../../custommodal/SmallModal';
export default function HRApproval(){
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
    const updateDateStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        borderRadius:1
    };
    // navigate
    const navigate = useNavigate()
    const [isLoading,setisLoading] = React.useState(true);
    const [leaveApplicationData,setLeaveApplicationData] = React.useState([])
    const [leaveApplicationData1,setLeaveApplicationData1] = React.useState([])
    const [originalLeaveApplicationData,setOriginalLeaveApplicationData] = React.useState([])

    //all types of leave fetch from DB
    const [typeOfLeaveData,setTypeOfLeaveData] = React.useState([]);

    const [modalOpen,setmodalOpen] = React.useState(false)
    const [modalUpdatingOpen,setmodalUpdatingOpen] = React.useState(false)
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
    const [offices,setOffices] = useState([]);
    const [filterOffice,setFilterOffice] = useState(null);
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
    const updateStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':400,
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
            // var logs = {
            //     action:'ACCESS ONLINE LEAVE VERIFICATION',
            //     action_dtl:'ACCESS ONLINE LEAVE VERIFICATION MODULE',
            //     module:'ONLINE LEAVE VERIFICATION'
            // }
            // auditLogs(logs)
            setisLoading(false)
            if(response.data){
                getHRForApproval()
                .then((response)=>{
                    console.log(response.data)
                    setLeaveApplicationData(response.data.data)
                    setLeaveApplicationData1(response.data.data)
                    setOriginalLeaveApplicationData(response.data.data)
                    setAuthInfo(response.data.auth_info)
                    setCtoInfo(response.data.cto_info)
                    const uniqueOffice = Array.from(new Set(response.data.data.map(obj => obj.officeassign)));
                    setOffices(uniqueOffice)
                    // setAction(response.data.actions)
                    setPending(false)
                    setIsisLoadingData(false)
                }).catch((error)=>{
                    console.log(error)
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
            setLoading(false)

        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const _init = () =>{
        getHRForApproval()
        .then((response)=>{
            setLeaveApplicationData(response.data.data)
            setLeaveApplicationData1(response.data.data)
            setOriginalLeaveApplicationData(response.data.data)
            setAuthInfo(response.data.auth_info)
            setCtoInfo(response.data.cto_info)
            const uniqueOffice = Array.from(new Set(response.data.data.map(obj => obj.officeassign)));
            setOffices(uniqueOffice)
            setPending(false)
            setIsisLoadingData(false)
        }).catch((error)=>{
            console.log(error)
        })
    }
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
    const [filter,setFilter] = React.useState('For Review');
    const [employeeInfo,setEmployeeInfo] = React.useState([])
    const [vlEarned,setVLEarned] = useState(0);
    const [slEarned,setSLEarned] = useState(0);
    const [slpEarned,setSLPEarned] = useState(0);
    const [vlBal,setVLBal] = useState(0);
    const [slBal,setSLBal] = useState(0);
    const [slpBal,setSLPBal] = useState(0);
    const [lessVL,setLessVL] = useState(0);
    const [lessSL,setLessSL] = useState(0);
    const [lessSLP,setLessSLP] = useState(0);
    const [dwpay,setDwpay] = useState(0);
    const [dwopay,setDwopay] = useState(0);
    const setInfo = (data,type) => {
        console.log(data)
        setEmployeeInfo(data)
        setUpdatedDWPAY(JSON.parse(data.inclusive_dates))
        setDwpay(data.days_with_pay)
        setDwopay(data.days_without_pay)
        switch(data.leave_type_id){
            //VL FL
            case 1:
            case 2:
                setVLEarned(data.bal_before_process)
                setVLBal(data.bal_after_process)
                setLessVL(data.days_with_pay)

                setSLEarned(data.sl_before_review)
                setSLBal(data.sl_after_review)
                setLessSL(data.used_sl)
            break;
            case 3:
                setSLEarned(data.bal_before_process)
                setSLBal(data.bal_after_process)
                setLessSL(data.used_sl)

                setVLEarned(data.vl_before_review)
                setVLBal(data.vl_after_review)
                setLessVL(data.borrowed_vl)
            break;
            case 6:
                setSLPEarned(data.bal_before_process)
                setSLPBal(data.bal_after_process)
                setLessSLP(data.days_hours_applied)

                setSLEarned(data.sl_before_review)
                setSLBal(data.sl_after_review)
                setLessSL(0)

                setVLEarned(data.vl_before_review)
                setVLBal(data.vl_after_review)
                setLessVL(0)
            break;
            default:
                setSLEarned(data.sl_before_review)
                setSLBal(data.sl_after_review)
                setLessSL(0)

                setVLEarned(data.vl_before_review)
                setVLBal(data.vl_after_review)
                setLessVL(0)
            break;

        }
        if(type === 'updating'){
            setEmployeeInfo(data)
            setmodalUpdatingOpen(true)

        }else{
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
            setLeaveApplicationData1(response.data.data)
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
    const formatPos  = (val)=>{
        if(val.includes('(')){
            var t_arr = val.split('(');
            return t_arr[0];
        }else{
            return val;
        }
    }
    const submitReviewApplication = (event) =>{
        event.preventDefault();
        Swal.fire({
            icon:'question',
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
                if(recommendation === 'Certified Correct'){
                    /**
                     Post data to eGAPS* 
                     */
                    employeeInfo.key = 'b9e1f8a0553623f1:639a3e:17f68ea536b';
                    employeeInfo.applic_year = parseInt(moment(employeeInfo.date_of_filing).format('YYYY'));
                    employeeInfo.applic_month = parseInt(moment(employeeInfo.date_of_filing).format('M'));
                    employeeInfo.date_of_filing = moment(employeeInfo.date_of_filing).format('YYYY-MM-DD');
                    employeeInfo.auth_name = authInfo[0].auth_name;
                    employeeInfo.auth_pos = formatPos(authInfo[0].auth_pos);
                    // employeeInfo.office_head_pos = formatPos(employeeInfo.office_head_pos)
                    if(employeeInfo.details_of_leave_id === 9){
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
                        // let dwpay = Math.round(employeeInfo.days_with_pay);
                        let dwpay_days = [];
                        // let dwopay_days = [];
                    
                        if(employeeInfo.leave_type_id === 14 || employeeInfo.leave_type_id === 23 || employeeInfo.leave_type_id === 6){
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
                            employeeInfo.inc_dates = JSON.stringify(temp_inc_date_arr);
                            // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                            employeeInfo.inc_dates_arr = JSON.stringify(fin_inc_date_arr);
                            
                            employeeInfo.inc_mat_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            if(employeeInfo.leave_type_id === 10){
                                var t_wop = JSON.parse(employeeInfo.inclusive_dates_without_pay)
                                if(t_wop.length !==0){
                                    employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') +moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                                    employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                    employeeInfo.inc_dates2 = moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                }else{
                                    employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                                    employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                    employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                }
                            }else{
                                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                            }
                            employeeInfo.inc_cto_dates_arr = JSON.stringify(dwpay_days);

                        }else{
                            if(temp_inc_date.length>0){
                                console.log(temp_inc_date[0].date)
                                employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                                employeeInfo.inc_dates_arr = JSON.stringify(fin_inc_date_arr);
                                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            }else{
                                var temp_inc_date = JSON.parse(employeeInfo.inclusive_dates_without_pay);
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
                                console.log(temp_inc_date[0].date)
                                employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                                employeeInfo.inc_dates_arr = JSON.stringify(fin_inc_date_arr);
                                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            }
                            employeeInfo.inc_cto_dates_arr = JSON.stringify(dwpay_days);

                        }
                    }
                    console.log(employeeInfo)
                    // Swal.close();
                    var t_data_leave = {
                        data:employeeInfo,
                        api_url:api_url+'/postReviewApplicLeaveAPI'
                    }
                    postReviewApplicLeaveAPI(t_data_leave)
                    .then(res=>{
                        console.log(res.data)
                        // Swal.close();
                        if(res.data.status === 200){
                            // var data = {
                            //     leave_type_id:employeeInfo.leave_type_id,
                            //     details_of_leave_id:employeeInfo.details_of_leave_id,
                            //     others_vl:employeeInfo.others_vl,
                            //     others_sl:employeeInfo.others_sl,
                            //     days_hours_applied:employeeInfo.days_hours_applied,
                            //     days_with_pay:employeeInfo.days_with_pay,
                            //     emp_id:employeeInfo.employee_id,
                            //     inclusive_dates:employeeInfo.inclusive_dates_text,
                            //     review:recommendation,
                            //     perm_id:8,
                            //     used_sl:employeeInfo.used_sl,
                            //     borrowed_vl:employeeInfo.borrowed_vl,
                            // }
                            var t_data = {
                                id:employeeInfo.leave_application_id,
                                leave_type_id:employeeInfo.leave_type_id,
                                employee_id:employeeInfo.employee_id,
                                dwpay:employeeInfo.days_with_pay,
                                ref_no:res.data.ref_no,
                                api_url:api_url
                            }
                            approvedHRReview(t_data)
                            .then(res=>{
                                APIresult(res)
                                setmodalOpen(false)
                                setLeaveApplicationData(res.data.data)
                                setLeaveApplicationData1(res.data.data)
                            }).catch(err=>{
                                Swal.close();
                                console.log(err)
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
                        window.open(api_url)
                    })
                }else{
                
                    switch(employeeInfo.leave_type_id){
                        case 1:
                        case 2:
                            employeeInfo.bal_before_process = parseFloat(vlEarned);
                            employeeInfo.bal_after_process = parseFloat(vlBal);
                            employeeInfo.sl_before_review = parseFloat(slEarned);
                            employeeInfo.sl_after_review = parseFloat(slBal);
                            employeeInfo.days_with_pay = parseFloat(dwpay);
                            employeeInfo.days_without_pay = parseFloat(dwopay);
                        break;
                        case 3:
                            employeeInfo.bal_before_process = parseFloat(slEarned);
                            employeeInfo.bal_after_process = parseFloat(slBal);
                            employeeInfo.vl_before_review = parseFloat(vlEarned);
                            employeeInfo.vl_after_review = parseFloat(vlBal);
                            employeeInfo.days_with_pay = parseFloat(dwpay);
                            employeeInfo.borrowed_vl = parseFloat(lessVL);
                            employeeInfo.days_without_pay = parseFloat(dwopay);
                            employeeInfo.used_sl = parseFloat(lessSL);
                        break;
                        case 6:
                            employeeInfo.bal_before_process = parseFloat(slpEarned);
                            employeeInfo.bal_after_process = parseFloat(slpBal);
                            employeeInfo.vl_before_review = parseFloat(vlEarned);
                            employeeInfo.vl_after_review = parseFloat(vlBal);
                            employeeInfo.sl_before_review = parseFloat(slEarned);
                            employeeInfo.sl_after_review = parseFloat(slBal);
                            employeeInfo.days_with_pay = parseFloat(dwpay);
                            employeeInfo.days_without_pay = parseFloat(dwopay);

                        break;
                        case 15:
                            employeeInfo.vl_before_review = parseFloat(vlEarned);
                            employeeInfo.vl_after_review = parseFloat(vlBal);
                            employeeInfo.sl_before_review = parseFloat(slEarned);
                            employeeInfo.sl_after_review = parseFloat(slBal);
                            employeeInfo.days_hours_applied = parseFloat(lessSL)+parseFloat(lessVL);
                            employeeInfo.days_with_pay = parseFloat(lessSL)+parseFloat(lessVL);
                            employeeInfo.days_without_pay = parseFloat(dwopay);
                            employeeInfo.others_vl = parseFloat(lessVL);
                            employeeInfo.others_sl = parseFloat(lessSL);
                        break;
                        default:
                            employeeInfo.vl_before_review = parseFloat(vlEarned);
                            employeeInfo.vl_after_review = parseFloat(vlBal);
                            employeeInfo.sl_before_review = parseFloat(slEarned);
                            employeeInfo.sl_after_review = parseFloat(slBal);
                            employeeInfo.days_with_pay = parseFloat(dwpay);
                            employeeInfo.days_without_pay = parseFloat(dwopay);
                        break;

                    }

                    if(updatedDWOPAY.length>0){
                        if(employeeInfo.inclusive_dates.toString() !== JSON.stringify(updatedDWPAY)){
                            employeeInfo.inclusive_dates = JSON.stringify(updatedDWPAY)
                        }
                    }
                    if(updatedDWOPAY.length>0){
                        if(employeeInfo.inclusive_dates_without_pay.toString() !== JSON.stringify(updatedDWOPAY)){
                            employeeInfo.inclusive_dates_without_pay = JSON.stringify(updatedDWOPAY)
                        }
                    }
                    employeeInfo.key = 'b9e1f8a0553623f1:639a3e:17f68ea536b';
                    employeeInfo.applic_year = parseInt(moment(employeeInfo.date_of_filing).format('YYYY'));
                    employeeInfo.applic_month = parseInt(moment(employeeInfo.date_of_filing).format('M'));
                    employeeInfo.date_of_filing = moment(employeeInfo.date_of_filing).format('YYYY-MM-DD');
                    // employeeInfo.auth_name = employeeInfo.incharge_name;
                    // employeeInfo.auth_pos = employeeInfo.incharge_pos;
                    employeeInfo.auth_name = authInfo[0].auth_name;
                    employeeInfo.auth_pos = formatPos(authInfo[0].auth_pos);
                    if(employeeInfo.details_of_leave_id === 9){
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
                            
                            employeeInfo.inc_mat_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            if(employeeInfo.leave_type_id === 10){
                                var t_wop = JSON.parse(employeeInfo.inclusive_dates_without_pay)
                                if(t_wop.length !==0){
                                    employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') +moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                                    employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                    employeeInfo.inc_dates2 = moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                }else{
                                    employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                                    employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                    employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                }
                            }else{
                                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                            }
                            employeeInfo.inc_cto_dates_arr = dwpay_days;

                        }else{
                            if(temp_inc_date.length>0){
                                console.log(temp_inc_date[0].date)
                                employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                                employeeInfo.inc_dates_arr = fin_inc_date_arr;
                                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            }else{
                                var temp_inc_date = JSON.parse(employeeInfo.inclusive_dates_without_pay);
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
                                console.log(temp_inc_date[0].date)
                                employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                                employeeInfo.inc_dates_arr = fin_inc_date_arr;
                                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                            }
                            

                            employeeInfo.inc_cto_dates_arr = dwpay_days;

                        }
                    }
                    if(employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 3){
                        if(updatedDWPAY.length>0){
                            if(employeeInfo.inclusive_dates.toString() !== JSON.stringify(updatedDWPAY)){
                                employeeInfo.inclusive_dates = JSON.stringify(updatedDWPAY)
                            }
                        }else{
                            if(employeeInfo.inclusive_dates.toString() !== JSON.stringify(updatedDWPAY)){
                                employeeInfo.inclusive_dates = []
                            }
                        }
                        if(updatedDWOPAY.length>0){
                            if(employeeInfo.inclusive_dates_without_pay.toString() !== JSON.stringify(updatedDWOPAY)){
                                employeeInfo.inclusive_dates_without_pay = JSON.stringify(updatedDWOPAY)
                            }
                        }
                        // else{
                        //     if(employeeInfo.inclusive_dates_without_pay.toString() !== JSON.stringify(updatedDWOPAY)){
                        //         employeeInfo.inclusive_dates_without_pay = 'null'
                        //     }
                        // }
                    }
                    
                    // Swal.close();
                    var t_data;

                    if(employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2){
                        t_data = {
                            employee_id:employeeInfo.employee_id,
                            id:employeeInfo.leave_application_id,
                            days:parseFloat(dwpay)+parseFloat(dwopay),
                            wpay:dwpay,
                            wopay:dwopay,
                            before_process:vlEarned,
                            after_process:vlBal,
                            sl_before:slEarned,
                            sl_after:slBal,
                            leave_type_id:employeeInfo.leave_type_id,
                            // ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:employeeInfo.inclusive_dates,
                            inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                            used_sl:lessSL
                        }
                    }else if(employeeInfo.leave_type_id === 3){
                        t_data = {
                            employee_id:employeeInfo.employee_id,
                            id:employeeInfo.leave_application_id,
                            days:parseFloat(dwpay)+parseFloat(dwopay),
                            wpay:dwpay,
                            wopay:dwopay,
                            before_process:slEarned,
                            after_process:slBal,
                            vl_before:vlEarned,
                            vl_after:vlBal,
                            leave_type_id:employeeInfo.leave_type_id,
                            // ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:employeeInfo.inclusive_dates,
                            inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                            used_sl:lessSL,
                            borrowed_vl:lessVL
                        }
                    }else if(employeeInfo.leave_type_id === 15){
                        t_data = {
                            employee_id:employeeInfo.employee_id,
                            id:employeeInfo.leave_application_id,
                            days:parseFloat(lessSL)+parseFloat(lessVL),
                            wpay:parseFloat(lessSL)+parseFloat(lessVL),
                            wopay:0,
                            sl_before:slEarned,
                            sl_after:slBal,
                            vl_before:vlEarned,
                            vl_after:vlBal,
                            leave_type_id:employeeInfo.leave_type_id,
                            // ref_no:res.data.ref_no,
                            bal_as_of:asOf,
                            inclusive_dates:employeeInfo.inclusive_dates,
                            inclusive_dates_without_pay:employeeInfo.inclusive_dates_without_pay,
                            others_sl:lessSL,
                            others_vl:lessVL,
                            borrowed_vl:lessVL
                        }
                    }else if(employeeInfo.leave_type_id === 6){
                        t_data = {
                            employee_id:employeeInfo.employee_id,
                            id:employeeInfo.leave_application_id,
                            days:employeeInfo.days_with_pay,
                            days_hours_applied:employeeInfo.days_hours_applied,
                            wpay:dwpay,
                            wopay:dwopay,
                            before_process:slpEarned,
                            after_process:slpBal,
                            vl_before:vlEarned,
                            vl_after:vlBal,
                            sl_before:slEarned,
                            sl_after:slBal,
                            leave_type_id:employeeInfo.leave_type_id,
                            // ref_no:res.data.ref_no,
                            bal_as_of:asOf

                        }
                    }else{
                        t_data = {
                            employee_id:employeeInfo.employee_id,
                            id:employeeInfo.leave_application_id,
                            days:employeeInfo.days_with_pay,
                            days_hours_applied:employeeInfo.days_hours_applied,
                            wpay:dwpay,
                            wopay:dwopay,
                            // before_process:coc,
                            // after_process:balCOC,
                            vl_before:vlEarned,
                            vl_after:vlBal,
                            sl_before:slEarned,
                            sl_after:slBal,
                            leave_type_id:employeeInfo.leave_type_id,
                            // ref_no:res.data.ref_no,
                            bal_as_of:asOf

                        }
                    }
                    // Swal.fire({
                    //     icon:'info',
                    //     title:'Updating leave application',
                    //     html:'Please wait...',
                    //     allowEscapeKey:false,
                    //     allowOutsideClick:false
                    // })
                    // Swal.close();
                    console.log(t_data);
                    submitHRApprovalForUpdatingReview(t_data)
                    .then(res=>{
                        console.log(res.data)
                        if(res.data.status === 200){
                            setmodalOpen(false)
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
                    }).catch(err=>{
                        Swal.close();
                        console.log(err)
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
            getHRForApproval(filter)
            .then((response) =>{
                setLeaveApplicationData(response.data.data)
                setLeaveApplicationData1(response.data.data)
                const uniqueOffice = Array.from(new Set(response.data.data.map(obj => obj.officeassign)));
                setOffices(uniqueOffice)
                Swal.close()
            }).catch((error)=>{
                console.log(error)
                Swal.close()
            })
        }else{
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterTextReview('');
            getHRForApproval()
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
                                {/* <tr>
                                    <td>
                                    <em>Proof of Relationship</em>
                                    </td>
                                    <td>
                                    <Button variant='outlined' onClick = {()=>viewFileAttachment('maternity')} startIcon={<VisibilityIcon/>} fullWidth>View </Button>
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                        </div>
                        {/* <br/>
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
                        </div> */}
                        {/* <Modal
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
                        </Modal> */}
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
            case 7:
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
                                <em>Solo Parent ID</em>
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
    const handleFilterOffice = (data)=>{
        setFilterOffice(data)
        if(data){
            var t_arr = leaveApplicationData1.filter((el)=>{
                return el.officeassign === data

            })
            console.log(data)
            console.log(t_arr)
            setLeaveApplicationData(t_arr)
        }else{
            setLeaveApplicationData(leaveApplicationData1)
        }
    }
    useEffect(()=>{
        if(lessVL>=0){
            var bal = vlEarned-lessVL;
            setVLBal(bal)
        }
    },[vlEarned,lessVL])
    useEffect(()=>{
        if(lessSL>=0){
            var bal = slEarned-lessSL;
            setSLBal(bal)
        }
    },[slEarned,lessSL])
    useEffect(()=>{
        if(lessSLP>=0){
            var bal = slpEarned-lessSLP;
            setSLPBal(bal)
        }
    },[slpEarned,lessSLP])
    const [asOf,setAsOf] = useState(moment().format('MMMM YYYY'))
    const forUpdating = () =>{
        return (
            <Grid item xs={12}>
                {
                recommendation === 'For Updating'
                ?
                <Paper sx={{m:1,p:1}}>
                <Typography sx={{fontStyle:'italic',color:blue[900],fontWeight:'bold'}}>Updating Table Balance:</Typography>
                <TextField label = 'As of' value = {asOf} onChange={(val)=>setAsOf(val.target.value)} fullWidth sx={{mt:1}} required/>
                <TableContainer sx={{mt:1}}>
                    <Table>
                        <TableHead sx={{background:blue[800]}}>
                            <TableRow>
                                <TableCell>

                                </TableCell>
                                <TableCell sx={{color:'#fff'}}>
                                    Vacation Leave
                                </TableCell>
                                <TableCell sx={{color:'#fff'}}>
                                    Sick Leave
                                </TableCell>
                            </TableRow>
                        
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Total Earned
                                </TableCell>
                                <TableCell>
                                    <TextField label='' value = {vlEarned} onChange={(val)=>setVLEarned(val.target.value)} type='number' inputProps={{min:0,step:'0.001'}} required/>
                                </TableCell>
                                <TableCell>
                                    <TextField label='' value = {slEarned} onChange={(val)=>setSLEarned(val.target.value)} type='number' inputProps={{min:0,step:'0.001'}} required/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Less this application
                                </TableCell>
                                <TableCell>
                                    <TextField label='' value = {lessVL} onChange={(val)=>setLessVL(val.target.value)} type='number' inputProps={{min:0,step:'0.001'}} required/>
                                </TableCell>
                                <TableCell>
                                    <TextField label='' value = {lessSL} onChange={(val)=>setLessSL(val.target.value)} type='number' inputProps={{min:0,step:'0.001'}} required/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Balance
                                </TableCell>
                                <TableCell>
                                    <TextField label='' value = {vlBal} InputLabelProps={{readOnly:true}}/>
                                </TableCell>
                                <TableCell>
                                    <TextField label='' value = {slBal} InputLabelProps={{readOnly:true}}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{display:'flex',justifyContent:'space-between',flexDirection:'row',gap:1,mt:1}}>
                <TextField label = 'Days with pay' value = {dwpay} onChange={(val)=>setDwpay(val.target.value)} type='number' inputProps={{min:0,step:'0.5'}} fullWidth required
                InputProps={{
                    endAdornment: (
                    employeeInfo.leave_type_id !== 15
                    ?
                    <InputAdornment position="end">
                    <Tooltip title='Update date/s with pay'>
                    <IconButton sx={{color:blue[700]}} onClick={()=>handleOpenUpdateDatesModal('dwpay')}>
                    <EditIcon />
                    </IconButton>
                    </Tooltip>
                    </InputAdornment>
                    :
                    null
                ),
                }}
                />
                <TextField label = 'Days without pay' value = {dwopay} onChange={(val)=>setDwopay(val.target.value)}type='number'inputProps={{min:0,step:'0.5'}} fullWidth required
                InputProps={{
                    endAdornment: (employeeInfo.leave_type_id !== 15
                    ?
                    <InputAdornment position="end">
                    <Tooltip title='Update date/s without pay'>
                    <IconButton sx={{color:blue[700]}} onClick={()=>handleOpenUpdateDatesModal('dwopay')}>
                    <EditIcon />
                    </IconButton>
                    </Tooltip>
                    </InputAdornment>
                    :
                    null
                ),
                }}
                />
                </Box>
                {
                    employeeInfo.leave_type_id === 6
                    ?
                    <Grid container sx={{mt:2}}>
                        <Grid item xs={12}>
                            <Typography sx={{fontStyle:'italic',color:blue[900],fontWeight:'bold'}}>Updating SLP Balance:</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label ='SLP' type='number' value={slpEarned} onChange={(val)=>setSLPEarned(val.target.value)} inputProps={{max:3}}/>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label ='Less this Application' type='number' value={lessSLP} onChange={(val)=>setLessSLP(val.target.value)}/>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label ='Balance' type='number' value={slpBal} inputProps={{readOnly:true}}/>
                        </Grid>
                    
                    </Grid>
                    :
                    null
                }
                
                </Paper>
                :
                null
            }
        </Grid>
        )
    }
    const [openUpdateDatesModal, setOpenUpdateDatesModal] = useState(false);
    const [updateType, setUpdateType] = useState('');
    const [updatedDWPAY,setUpdatedDWPAY] = useState([])
    const [updatedDWOPAY,setUpdatedDWOPAY] = useState([])
    const handleOpenUpdateDatesModal = (type) => {
        setUpdateType(type)

        setOpenUpdateDatesModal(true)
    }
    const handleCloseUpdateDatesModal = () =>   {
        setOpenUpdateDatesModal(false)
    }
    const handleSaveUpdatedDates = (data)=>{
        console.log(employeeInfo)
        handleCloseUpdateDatesModal()
        if(updateType === 'dwopay'){
            var temp = 0;
            data.forEach(el=>{
                if(el.period === 'NONE'){
                    temp++;
                }else{
                    temp+=.5
                }
            })
            /**
            get date with pay
             */
            // var t_dwopay = employeeInfo.inclusive_dates_without_pay === 'null' || !employeeInfo.inclusive_dates_without_pay?[]:JSON.parse(employeeInfo.inclusive_dates_without_pay);
            // var t_dwpay = JSON.parse(employeeInfo.inclusive_dates);

            // var merge = t_dwopay.concat(t_dwpay)
            // var uniqueResultOne = merge.filter(function(obj) {
            //     return !data.some(function(obj2) {
            //         return obj.date == obj2.date;
            //     });
            // });
            // var temp2 = 0;
            // uniqueResultOne.forEach(el=>{
            //     if(el.period === 'NONE'){
            //         temp2++;
            //     }else{
            //         temp2+=.5
            //     }
            // })
            // setDwopay(temp)
            // setDwpay(temp2)
            setUpdatedDWOPAY(data)
            // setUpdatedDWPAY(uniqueResultOne)
        }else{
            var temp = 0;
            data.forEach(el=>{
                if(el.period === 'NONE'){
                    temp++;
                }else{
                    temp+=.5
                }
            })
            /**
            get date with pay
             */
            // var t_dwopay = employeeInfo.inclusive_dates_without_pay === 'null' || !employeeInfo.inclusive_dates_without_pay?[]:JSON.parse(employeeInfo.inclusive_dates_without_pay);
            // var t_dwpay = JSON.parse(employeeInfo.inclusive_dates);

            // var merge = t_dwopay.concat(t_dwpay)
            // var uniqueResultOne = merge.filter(function(obj) {
            //     return !data.some(function(obj2) {
            //         return obj.date == obj2.date;
            //     });
            // });
            // var temp2 = 0;
            // uniqueResultOne.forEach(el=>{
            //     if(el.period === 'NONE'){
            //         temp2++;
            //     }else{
            //         temp2+=.5
            //     }
            // })
            // setDwpay(temp)
            // setDwopay(temp2)

            setUpdatedDWPAY(data)
            // setUpdatedDWOPAY(uniqueResultOne)

        }
    }
    useEffect(()=>{
        if(recommendation === 'For Updating'){
            setOpenCTOUpdate(true)
        }
    },[recommendation])
    const [openCTOUpdate,setOpenCTOUpdate] = useState(false);

    const handleUpdateCTO = (item) =>{
        APILoading('info','Submitting update','Please wait...');

        employeeInfo.days_with_pay = parseFloat(item.days_hours_applied/8);
        employeeInfo.days_without_pay = 0;
        employeeInfo.days_hours_applied = item.days_hours_applied;
        employeeInfo.bal_before_process = item.bal_before_process;
        employeeInfo.bal_after_process = item.bal_after_process;
        employeeInfo.days_hours_applied = item.days_hours_applied;
        employeeInfo.credits_sl_val = 0;
        employeeInfo.sl_before_review = 0;
        employeeInfo.sl_after_review = 0;
        employeeInfo.used_sl = 0;
        employeeInfo.vl_before_review = 0;
        employeeInfo.vl_after_review = 0;
        employeeInfo.key = 'b9e1f8a0553623f1:639a3e:17f68ea536b';
        employeeInfo.applic_year = parseInt(moment(employeeInfo.date_of_filing).format('YYYY'));
        employeeInfo.applic_month = parseInt(moment(employeeInfo.date_of_filing).format('M'));
        employeeInfo.date_of_filing = moment(employeeInfo.date_of_filing).format('YYYY-MM-DD');
        employeeInfo.auth_name = authInfo[0].auth_name;
        // employeeInfo.auth_name = employeeInfo.incharge_name;
        employeeInfo.auth_pos = formatPos(authInfo[0].auth_pos);

        // employeeInfo.auth_pos = 'City';

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
        let dwpay_days = [];
    
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
            
            employeeInfo.inc_mat_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
            if(employeeInfo.leave_type_id === 10){
                var t_wop = JSON.parse(employeeInfo.inclusive_dates_without_pay)
                if(t_wop.length !==0){
                    employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') +moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                    employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                    employeeInfo.inc_dates2 = moment(t_wop[t_wop.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                }else{
                    employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD to ') + moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('MM/DD/YYYY')
                    employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                    employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                }
            }else{
                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_dates2 = moment(temp_inc_date[temp_inc_date.length-1].date,'MM-DD-YYYY').format('YYYY-MM-DD');
            }
            employeeInfo.inc_cto_dates_arr = dwpay_days;

        }else{
            if(temp_inc_date.length>0){
                console.log(temp_inc_date[0].date)
                employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                employeeInfo.inc_dates_arr = fin_inc_date_arr;
                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
            }else{
                var temp_inc_date = JSON.parse(employeeInfo.inclusive_dates_without_pay);
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
                console.log(temp_inc_date[0].date)
                employeeInfo.inc_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY');          
                // employeeInfo.inc_dates_arr = temp_fin_inc_date_arr;
                employeeInfo.inc_dates_arr = fin_inc_date_arr;
                employeeInfo.inc_dates1 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_dates2 = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('YYYY-MM-DD');
                employeeInfo.inc_rehab_dates = moment(temp_inc_date[0].date,'MM-DD-YYYY').format('MM/DD/YYYY')
            }
            

            employeeInfo.inc_cto_dates_arr = dwpay_days;

        }
        postUpdatingReviewApplicLeaveAPI(employeeInfo)
        .then(res=>{
            console.log(res.data)
            // Swal.close();
            if(res.data.status === 200){
                var t_data = {
                        employee_id:employeeInfo.employee_id,
                        dept_code:employeeInfo.dept_code,
                        id:employeeInfo.leave_application_id,
                        days:employeeInfo.days_with_pay,
                        days_hours_applied:employeeInfo.days_hours_applied,
                        wpay:employeeInfo.days_with_pay,
                        wopay:0,
                        before_process:employeeInfo.bal_before_process,
                        after_process:employeeInfo.bal_after_process,
                        vl_before:0,
                        vl_after:0,
                        sl_before:0,
                        sl_after:0,
                        leave_type_id:employeeInfo.leave_type_id,
                        ref_no:res.data.ref_no,
                        bal_as_of:asOf,
                        inclusive_dates:employeeInfo.inclusive_dates

                }
                console.log(t_data)
                submitLeaveApplicationUpdateCTO(t_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        _init();

                        // props.handleAfterUpdateReview(employeeInfo.leave_application_id)
                        // props.close()
                        setmodalOpen(false);
                        setOpenCTOUpdate(false);
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
                }).catch(err=>{
                    console.log(err)
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
            window.open(api_url);
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
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                      <ModuleHeaderText title ='Leave Application (HR Approval)'/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{mt:1,marginBottom:'10px'}}>
                    {/* <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Button variant='outlined' size='large'><HistoryOutlinedIcon/></Button>
                    </Box> */}
                    <Box sx={{display:'flex',justifyContent:'space-between'}}>
                    <Box>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={offices}
                        sx={{ width: 300 }}
                        value = {filterOffice}
                        onChange={(event, newValue) => {
                            handleFilterOffice(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Filter Office" />}
                        />
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                    <Tooltip title="Refresh Data" placement='top'>
                    <IconButton className='custom-iconbutton' color='primary' onClick = {refreshData}><CachedIcon/></IconButton>
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
                    <React.Fragment>
                    
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Employee name</StyledTableCell>
                                    <StyledTableCell>Office</StyledTableCell>
                                    <StyledTableCell>Type of leave</StyledTableCell>
                                    <StyledTableCell>Inclusive Dates</StyledTableCell>
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
                                    <StyledTableCell colSpan={7}>
                                    <Stack>
                                        <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                    </Stack>
                                    </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                    <StyledTableCell colSpan={7}>
                                    <Stack>
                                        <Skeleton variant='round' height={'8vh'} animation='wave'/>
                                    </Stack>
                                    </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                    <StyledTableCell colSpan={7}>
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
                                            <StyledTableCell>{row.officeassign}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type_name}</StyledTableCell>
                                            <StyledTableCell>{row.inclusive_dates_text}</StyledTableCell>
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
                }
                
                </Box>

                </Grid>
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
                                        
                                        <PreviewCTOApplicationForm info={employeeInfo} auth_info = {authInfo} pendinginfo={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing} status = {employeeInfo.status} cto_info = {ctoInfo} office_head={officeHead}/>
                                        
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
                                
                                {/* {
                                    recommendation === 'For Updating'
                                    ?
                                    
                                    :
                                    null
                                } */}
                                <SmallModal open = {openCTOUpdate} close = {()=>setOpenCTOUpdate(false)} title='Updating COC Balance'>
                                    <UpdateCTO pendingInfo = {employeeInfo} handleUpdateCTO = {handleUpdateCTO} close = {()=>setOpenCTOUpdate(false)}/>
                                </SmallModal>
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
                                                <MenuItem value={'Certified Correct'}>Certified Correct</MenuItem>
                                                <MenuItem value={'For Updating'}>For Updating</MenuItem>
                                            </Select>
                                            </FormControl>
                                    </Grid>
                                    {/* {
                                        forUpdating()
                                    } */}
                                   
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
                                    {/* {
                                        forUpdating()
                                    } */}
                                  
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
                     <Modal
                        open={modalUpdatingOpen}
                        onClose={()=> setmodalUpdatingOpen(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={updateStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setmodalUpdatingOpen(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Updating LEAVE APPLICATION Info
                            </Typography>
                            <Box sx={{m:1}}>
                            <UpdatingLeaveApplication data = {employeeInfo} close = {()=> setmodalUpdatingOpen(false)}/>
                            
                            </Box>

                        </Box>
                    </Modal>

                    <Modal
                        open={openUpdateDatesModal}
                        onClose={handleCloseUpdateDatesModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={updateDateStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Updating date/s {updateType === 'dwopay'? 'without pay':'with pay'}
                        </Typography>
                        <Box>
                            <UpdateDates info = {employeeInfo} close = {handleCloseUpdateDatesModal} save = {handleSaveUpdatedDates} updateType = {updateType}/>
                        </Box>
                        </Box>
                    </Modal>
        
        
        {/* <div style={{ display: "none" }}>
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
        </div> */}
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
                </Grid>
            </Fade>
            }
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