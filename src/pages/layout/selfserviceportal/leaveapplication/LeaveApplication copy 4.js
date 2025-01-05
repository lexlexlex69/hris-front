import { Typography,Grid,Box, Button,InputLabel,MenuItem,FormControl,Select,Modal,TextField,FormControlLabel,FormGroup,LinearProgress,Tooltip,Checkbox,Radio,FormLabel,RadioGroup,Alert,Fab,Fade,CircularProgress, Stack,Skeleton,Badge, TableFooter,Popover} from '@mui/material';
import {blue,red,green,orange} from '@mui/material/colors'
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import React, { useEffect,useLayoutEffect,useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// leave application request
import { getTypesOfLeave,getEmployeeInfo,addLeaveApplication,getLeaveApplicationData,cancelLeaveApplication,refreshData,getMonetizationInfo,getLastDayOfDuty,getCTOAlreadyAppliedHours,getLeaveBalance,updateLeaveBalance,isBalanceUpdatedToday,getLeaveLedger,getWorkSchedule, getAllTypeOfLeave, getPresentDTRDays, getEmpLeaveBalance, requestRescheduleLeave, getRequestedRescheduleData, deleteRequestedRescheduleLeave, deleteRequestedCancelledLeave, getCOCEarnedInfo } from './LeaveApplicationRequest';
// import DatePicker from 'react-date-picker';
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
//icon
import InputIcon from "react-multi-date-picker/components/input_icon"
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';


import moment from 'moment';

import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { PreviewLeaveApplicationForm } from './PreviewLeaveApplicationForm';
import { PreviewLeaveApplication} from './PreviewLeaveApplication'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {
    useNavigate
} from "react-router-dom";
//icon
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PrintIcon from '@mui/icons-material/Print';
import CachedIcon from '@mui/icons-material/Cached';
import InfoIcon from '@mui/icons-material/Info';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AttachmentIcon from '@mui/icons-material/Attachment';
import PendingIcon from '@mui/icons-material/Pending';
import AddIcon from '@mui/icons-material/Add';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{ tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import {createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { PreviewCTOApplicationForm } from './PreviewCTOApplicationForm';
import axios from 'axios';
import AllocationOfMaternityLeaveFillout from './AllocationOfMaternityLeaveFillout';
import { DeleteForever } from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import $ from 'jquery'
//animation css
import 'animate.css';
import LeaveApplicationForm from './LeaveApplicationForm';
import BugsForm from '../../bugs/BugsForm';
import LeaveLedgerModal from './Modal/LeaveLedgerModal';
import { auditLogs } from '../../auditlogs/Request';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { viewFileAPI } from '../../../../viewfile/ViewFileRequest';
import EarnMaternityCreditsDialog from './Dialog/EarnMaternityCreditsDialog';
import UpdateIcon from '@mui/icons-material/Update';
import RequestDailytEarnedLeave from './Modal/RequestDailyEarnedLeave';
import { api_url } from '../../../../request/APIRequestURL';
import CancelLeaveApplication from './Modal/CancelLeaveApplication';
import ReschedDateModal from './Modal/ReschedDateModal';
import ViewRequestedReschedModal from './Modal/ViewRequestedReschedModal';
import SmallModal from '../../custommodal/SmallModal';
import MediumModal from '../../custommodal/MediumModal';
var momentBusinessDays = require("moment-business-days");
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 13,
        padding:10,
        // fontFamily:'latoreg'
      
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding:13,
        // fontFamily:'latoreg'
    
    },
  }));
const headerTheme = createTheme({
  typography: {
    fontSize:14,
    fontFamily:'latoreg'
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
  const Transition2 = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function LeaveApplication(props,ref){
    // navigate
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledBalanceTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.info.dark,
          color: theme.palette.common.white,
          fontSize:13,
        //   fontFamily:'latoreg'

        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            // fontFamily:'latoreg'

        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
    const [isLoading,setIsLoading] = React.useState(true)
    const historyColumnsStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                // background:'#f4f4f4',
                // textAlign:'center',
                fontSize: matches?'11px':'14px',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
            },
        },
        headCells: {
            style: {
                // padding:'15px 0 15px 15px',
                background:'#2196f3',
                color:'#fff',
                fontSize:matches?'13px':'16px',
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
    const pendingCustomStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                // background:'#f4f4f4',
                fontSize: matches?'11px':'14px',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
    
            },
        },
        headCells: {
            style: {
                // padding:'15px 0 15px 15px',
                background:'#fda400',
                color:'#fff',
                fontSize:matches?'13px':'16px',
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
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            },
        },
    };
    const [inclusiveDatesOpen,setInclusiveDatesOpen] = React.useState(false)

    //all balance fetch from DB
    const [balanceData,setBalanceData] = React.useState([]);

    //types of leave fetch from DB
    const [typeOfLeaveData,setTypeOfLeaveData] = React.useState([]);

    //all types of leave fetch from DB
    const [allTypeOfLeaveData,setAllTypeOfLeaveData] = React.useState([]);

    //employee info fetch from DB
    const [employeeInfo,setEmployeeInfo] = React.useState([]);

    //signatory data fetch from DB
    const [signatory,setSignatory] = React.useState([]);

    //all pending application data fetch from DB
    const [pendingLeaveApplicationData,setPendingLeaveApplicationData] = React.useState([]);

    //all application history data fetch from DB
    const [historyLeaveApplicationData,setHistoryLeaveApplicationData] = React.useState([]);

    const [selectedCTOInclusiveDates, setCTOInclusiveDates] = React.useState([]);
    const [tempSelectedCTOInclusiveDates, setTempSelectedCTOInclusiveDates] = React.useState([]);
    const [tempSelectedSPLInclusiveDates, setTempSelectedSPLInclusiveDates] = React.useState([]);

    //officehead of officeassign
    const [officeHead,setOfficeHead] = React.useState([]);
    //admin officer of officeassign
    const [officeAO,setOfficeAO] = React.useState([]);

    const specifyRef = useRef('');
    const [alreadyAppliedDays,setAlreadyAppliedDays] = React.useState([]);
    const [alreadyAppliedDaysPeriod,setAlreadyAppliedDaysPeriod] = React.useState([]);
    const [onProcess,setonProcess] = React.useState([]);
    const [availableVL,setavailableVL] = React.useState(0)
    const [availableSL,setavailableSL] = React.useState(0)
    const [availableCOC,setavailableCOC] = React.useState(0)
    const [lastDayOfDuty,setlastDayOfDuty] = React.useState('')
    const [slNoPay,setslNoPay] = React.useState('')
    const [slWithPay,setslWithPay] = React.useState('')
    const [slRangeDatesWithPay,setslRangeDatesWithPay] = React.useState([])
    const [isBalanceUpdated,setIsBalanceUpdated] = React.useState(false);
    const [authInfo,setAuthInfo] = React.useState([]);
    const [openApplicationDialog, setOpenApplicationDialog] = React.useState(false);
    const [openLeaveLedgerDialog, setOpenLeaveLedgerDialog] = React.useState(false);
    const [openRequestDialog, setOpenRequestDialog] = React.useState(false);
    const [totalForReview,setTotalForReview] = useState(0);
    const [maternityBal,setMaternityBal] = useState(0);
    const [maternityOnProcess,setMaternityOnProcess] = useState(0);
    const [appliedExtendedMaternity,setAppliedExtendedMaternity] = useState([]);
    const [SLPReasonsData,setSLPReasonsData] = useState([]);
    const [ctoInfo,setCtoInfo] = useState([{
        cto_hr_name:'',
        cto_hr_name_pos:'',
        cto_cmo_name:'',
        cto_cmo_name_pos:''
    }]);
    const [allTypesOfLeave,setAllTypesOfLeave] = useState([])
    const [empNo,setEmpNo] = useState('')
    //fetch data from DB when component rendered
    const [requestedRescheduleData,setRequestedRescheduleData] = useState([])
    const [requestedCancelledData,setRequestedCancelledData] = useState([])
    useEffect(()=>{
        var logs = {
            action:'ACCESS ONLINE LEAVE APPLICATION',
            action_dtl:'ACCESS ONLINE LEAVE APPLICATION MODULE',
            module:'ONLINE LEAVE'
        }
        auditLogs(logs)        //request to get the info of current employee login
        checkPermission(3)
        .then((response)=>{
            // console.log(response.data)
            if(response.data === 1){
                let appliedDays;
                /**
                 * Check if balance updated today
                 */
                isBalanceUpdatedToday()
                .then(respo=>{
                    /**
                     * If already updated today
                     */
                    if(respo.data.status){
                        getEmployeeInfo()
                            .then((response)=>{
                                const data = response.data
                                setRequestedRescheduleData(data.reschedule_data)
                                setRequestedCancelledData(data.cancelled_data)
                                setCtoInfo(data.cto_info)
                                setEmployeeInfo(data.info)
                                setSignatory(data.signatory)
                                setonProcess(data.on_process)
                                // console.log(data.on_process)
                                setBalanceData(data.balance)
                                setOfficeHead(data.office_assign_info)
                                setOfficeAO(data.office_ao_info)
                                setAlreadyAppliedDays(data.applied_dates)
                                setAlreadyAppliedDaysPeriod(data.dates_has_period)
                                setAvailabelSPL(data.spl_days_balance)
                                setOnprocessSPL(data.spl_days_onprocess)
                                setMaternityBal(data.maternity_bal)
                                setMaternityOnProcess(data.maternity_on_process)
                                setAppliedExtendedMaternity(data.applied_extended_maternity)
                                setSLPReasonsData(data.slp_reasons)
                                setAuthInfo(data.auth_info)
                                appliedDays = data.applied_dates;
                                var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
                                var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
                                var coc = data.balance[0].coc_bal-data.on_process.vl < 0 ?0:data.balance[0].coc_bal-data.on_process.coc
                                setavailableVL(vl)
                                setavailableSL(sl)
                                // setavailableCOC(coc)
                                setavailableCOC(data.coc_bal)
                                let currDate = new Date();
                                var date = new Date();
                                var start = 0;
                                var end = 5;
                                var toAdd = 0;
                                var slRangeDatesWP =[];
                                // while(start <= end){
                                //     let temp = [];
                                //     let temp2 = [];
                                    
                                //     for(var w=0;w<data.work_sched.length;w++){
                                //         if(data.work_sched[w].month === parseInt(moment(date).format('M')) && data.work_sched[w].year === parseInt(moment(date).format('YYYY'))){
                                //             temp=data.work_sched[w].details;
                                //             break;
                                //         }
                                //     }
                                //     if(temp.length !==0){
                                //         JSON.parse(temp).forEach(el2=>{
                                //             temp2.push(el2.day)
                                //         })
                                //     }
                                //     if(appliedDays.includes(moment(date).format('MM-DD-YYYY'))){
                                //         toAdd++;
                                //     }else{
                                //         if(moment(date).isBusinessDay()){
                                //             if(!temp2.includes(moment(date).format('D'))){
                                //                 toAdd++;
                                //             }
                                //             slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                //             start++;
                                            
                                //         }
                                //     }
                                //     date.setDate(date.getDate() - 1);
                                // }
                                // let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                // let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d
                                // console.log(toAdd)
                                // console.log(finalWithPay)
    
                                // setslRangeDatesWithPay(slRangeDatesWP)
                                // setslNoPay(finalNoPay)
                                // setslWithPay(finalWithPay)
                                
                                setIsLoading(false)
                                // console.log(data.applied_dates)
                                setEmpNo(data.emp_no)
                            }).catch((error)=>{
                                // toast(error)
                                console.log(error)
                            })
                    }else{
                        Swal.fire({
                            icon:'info',
                            title:'Updating Current Leave Balance',
                            html:'Please wait...',
                            allowEscapeKey:false,
                            allowOutsideClick:false
                        })
                        Swal.showLoading()
                        var t_data_emp = {
                            id:respo.data.id_no,
                            api_url:api_url
                        }
                        getEmpLeaveBalance(t_data_emp)
                        .then(response=>{
                            const response_data = response.data.response;
                            if(response_data.length !==0){
                                var data2 = {
                                    vl:response_data[0].VL,
                                    sl:response_data[0].SL,
                                    as_of:response_data[0].as_date
                                }
                                updateLeaveBalance(data2)
                                .then(response=>{
                                    getEmployeeInfo()
                                    .then((response)=>{
                                        const data = response.data
                                        setRequestedRescheduleData(data.reschedule_data)
                                        setRequestedCancelledData(data.cancelled_data)

                                        setCtoInfo(data.cto_info)

                                        setEmployeeInfo(data.info)
                                        setSignatory(data.signatory)
                                        setonProcess(data.on_process)
                                        setBalanceData(data.balance)
                                        setOfficeHead(data.office_assign_info)
                                        setOfficeAO(data.office_ao_info)
                                        setAlreadyAppliedDays(data.applied_dates)
                                        setAlreadyAppliedDaysPeriod(data.dates_has_period)
                                        setAvailabelSPL(data.spl_days_balance)
                                        setOnprocessSPL(data.spl_days_onprocess)
                                        setMaternityBal(data.maternity_bal)
                                        setMaternityOnProcess(data.maternity_on_process)
                                        setAuthInfo(data.auth_info)
                                        setSLPReasonsData(data.slp_reasons)
                                        appliedDays = data.applied_dates;
                                        var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
                                        var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
                                        var coc = data.balance[0].coc_bal-data.on_process.vl < 0 ?0:data.balance[0].coc_bal-data.on_process.coc
                                        setavailableVL(vl)
                                        setavailableSL(sl)
                                        // setavailableCOC(coc)
                                        setavailableCOC(data.coc_bal)
                                        let currDate = new Date();
                                        var date = new Date();
                                        var start = 0;
                                        var end = 5;
                                        var toAdd = 0;
                                        var slRangeDatesWP =[];
                                        while(start <= end){
                                            if(appliedDays.includes(moment(date).format('MM-DD-YYYY'))){
                                                toAdd++;
                                            }else{
                                                if(moment(date).isBusinessDay()){
                                                    slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                                    start++;
                                                }
                                            }
                                            date.setDate(date.getDate() - 1);
                                        }
                                        let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                        let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d
                                        setslRangeDatesWithPay(slRangeDatesWP)
                                        setslNoPay(finalNoPay)
                                        setslWithPay(finalWithPay)
                                        setIsLoading(false)
                                        Swal.close()
                                        setEmpNo(data.emp_no)

                                        // console.log(data.applied_dates)
                                    }).catch((error)=>{
                                        // toast(error)
                                        Swal.close()
    
                                        console.log(error)
                                    })
                                }).catch(error=>{
                                    Swal.close()
    
                                    console.log(error)
                                })
                            }
                        }).catch(error=>{
                            window.open(api_url)

                            Swal.close()
                            toast.error(error.message+'. Loading local DB.')
                            getEmployeeInfo()
                            .then((response)=>{
                                const data = response.data
                                setRequestedRescheduleData(data.reschedule_data)
                                setRequestedCancelledData(data.cancelled_data)
                                setCtoInfo(data.cto_info)
                                setEmployeeInfo(data.info)
                                setSignatory(data.signatory)
                                setonProcess(data.on_process)
                                setBalanceData(data.balance)
                                setOfficeHead(data.office_assign_info)
                                setOfficeAO(data.office_ao_info)
                                setAlreadyAppliedDays(data.applied_dates)
                                setAlreadyAppliedDaysPeriod(data.dates_has_period)
                                setAvailabelSPL(data.spl_days_balance)
                                setOnprocessSPL(data.spl_days_onprocess)
                                setMaternityBal(data.maternity_bal)
                                setMaternityOnProcess(data.maternity_on_process)
                                setAuthInfo(data.auth_info)
                                setSLPReasonsData(data.slp_reasons)
                                appliedDays = data.applied_dates;
                                var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
                                var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
                                var coc = data.balance[0].coc_bal-data.on_process.vl < 0 ?0:data.balance[0].coc_bal-data.on_process.coc
                                setavailableVL(vl)
                                setavailableSL(sl)
                                // setavailableCOC(coc)
                                setavailableCOC(data.coc_bal)
                                let currDate = new Date();
                                var date = new Date();
                                var start = 0;
                                var end = 5;
                                var toAdd = 0;
                                var slRangeDatesWP =[];
                                while(start <= end){
                                    if(appliedDays.includes(moment(date).format('MM-DD-YYYY'))){
                                        toAdd++;
                                    }else{
                                        if(moment(date).isBusinessDay()){
                                            slRangeDatesWP.push(moment(date).format('MM-DD-YYYY'))
                                            start++;
                                        }
                                    }
                                    date.setDate(date.getDate() - 1);
                                }
                                let finalNoPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(6+toAdd)._d
                                let finalWithPay = momentBusinessDays(moment(currDate).format('YYYY-MM-DD'), 'YYYY-MM-DD').businessSubtract(5+toAdd)._d
    
                                setslRangeDatesWithPay(slRangeDatesWP)
                                setslNoPay(finalNoPay)
                                setslWithPay(finalWithPay)
                                setIsLoading(false)
                                setEmpNo(data.emp_no)

                            }).catch((error)=>{
                                // toast(error)
                                console.log(error)
                            })
                        })
                            }
                        }).catch(err=>{
                            console.log(err)
                        })
                        //request to get the list of types of leave
                        getTypesOfLeave()
                        .then((response)=>{
                            const data = response.data
                            setTypeOfLeaveData(data.type_of_leave)
                            setAllTypeOfLeaveData(data.all_type_of_leave)
                        }).catch((error)=>{
                            console.log(error)
                        })
    
                        
                        getLeaveApplicationData()
                        .then((response)=>{
                            const data = response.data;
                            var temp = 0;
                            data.pending.forEach(el => {
                                if(el.status=== 'FOR REVIEW' && el.leave_type_id === 14){
                                    temp+=el.days_hours_applied
                                }
                            });
                            setTotalForReview(temp)
                            setPendingLeaveApplicationData(data.pending)
                            setHistoryLeaveApplicationData(data.history)
                        }).catch((error)=>{
                            toast(error.message)
                            
    
                        })
                getAllTypeOfLeave()
                .then(res=>{
                    setAllTypesOfLeave(res.data)
                }).catch(err=>{
                    console.log(err)
                })

            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }

               
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const [presentDaysData,setPresentDaysData] = useState([])
    // useEffect(()=>{
    //     if(empNo){
    //         var t_data = {
    //             emp_no:empNo,
    //             from:moment(new Date()).subtract(20,'days').format('YYYY-MM-DD'),
    //             to:moment(new Date()).format('YYYY-MM-DD')
    //         }
    //         // console.log(t_data)
    //         getPresentDTRDays(t_data)
    //         .then(res=>{
    //             var t_arr = [];
    //             res.data.forEach(el=>{
    //                 t_arr.push(el.work_date)
    //             })
    //             setPresentDaysData(t_arr)
    //             // console.log(res.data)
    //         }).catch(err=>{
    //             console.log(err)
    //         })
    //     }
        
    // },[empNo])
    
    /**
     * Modal application state
     */
    const [open,setOpen] = React.useState(false);

    const [leaveType,setLeaveType] = React.useState('');

    /**
     * Modal style
     */
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 345:600,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
      const previewStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 300:800,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
      const bugsModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
      const requestModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':350,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    /**
     * leave details based on selected leave type
     */
    const [leaveDetails,setLeaveDetails] = React.useState('');

    

    /**
     * specify details state
     */
    const [specifyDetails,setSpecifyDetails] = React.useState('');
    
    const [appliedOthersDays,setappliedOthersDays] = React.useState(0)
    const [hasAppliedVL,sethasAppliedVL] = React.useState(false);
    const [isInludeSLMonetization,setisInludeSLMonetization] = React.useState(false);
    const [daysOfMonetization,setdaysOfMonetization] = React.useState(0);
    /**
     * handler after leave details select change
     */
    useEffect(()=>{
        if(leaveDetails === 9){
            getMonetizationInfo()
            .then(response=>{
                const data = response.data
                if(data.length ===0){
                    sethasAppliedVL(0)
                }else{
                    sethasAppliedVL(data[0].total)
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    },[leaveDetails])
    const selectLeaveDetails = (event) => {
        setLeaveDetails(event.target.value);
        if(event.target.value === 10){
            setappliedOthersDays(availableVL+availableSL)
        }
    };
    const [selectedSPL,setselectedSPL] = React.useState(0.5);
    const [daysPeriod,setdaysPeriod] = React.useState(0);
    const [availableSPL,setAvailabelSPL] = React.useState('');
    const [onprocessSPL,setOnprocessSPL] = React.useState('');
    /**
     * state for multiple selected inclusive dates except for CTO
     */
    const [selectedInclusiveDates, setInclusiveDates] = React.useState([]);

    /**
     * state for selected inclusive dates for maternity leave
     */
     const [selectedInclusiveMaternityDates, setInclusiveMaternityDates] = React.useState('');
     const [selectedInclusiveMaternityDatesRange, setInclusiveMaternityDatesRange] = React.useState([]);

    /**
     * state for selected inclusive dates for VAWC leave
     */
    const [selectedInclusiveVAWCDates, setInclusiveVAWCDates] = React.useState('');
    const [selectedInclusiveVAWCDatesRange, setInclusiveVAWCDatesRange] = React.useState([]);


    /**
     * handler for updating the selectedInclusiveDates state
     */
    const handleSetInclusiveDates = (value) => {
        setInclusiveDates(value)
        if(leaveType === 6){
            setTempSelectedSPLInclusiveDates([])
        }
    }
    /**
     * handler for updating the handleSetCTOInclusiveDates state
     */
    const handleSetCTOInclusiveDates = (value) => {
        setCTOInclusiveDates(value)
    }

    /**
     * function use for disabling the dates before filing days
     */
    const inclusiveMinDate = () => {
        // var d = new Date();
        // var disabled = d.setDate(d.getDate() + 5);
        var startDate = new Date();
        // startDate = new Date(startDate.replace(/-/g, "/"));
        var endDate = "", noOfDaysToAdd = 0, count = 0;
        var tol_len = typeOfLeaveData.length;
        for(var x= 0 ;x<tol_len ; x++){
            if(typeOfLeaveData[x].leave_type_id === leaveType){
                noOfDaysToAdd = typeOfLeaveData[x].filing_period
                break;
            }
        }
        // switch(leaveType){
        //     /**
        //      * Vacation leave / force leave
        //      */
        //     case 1:
        //     case 2:
        //         noOfDaysToAdd = 5
        //         break;
        //     /** Special Privilege Leave
        //      * 
        //      */
        //     case 6:
        //         noOfDaysToAdd = 7
        //         break;

        //     /** Solo Parent Leave
        //      * 
        //      */
        //      case 7:
        //         noOfDaysToAdd = 6
        //         break;

        //     /**
        //      * CTO
        //      */
        //     case 14:
        //         noOfDaysToAdd = 5
        //         break;
        // }
        while(count < noOfDaysToAdd){
            endDate = new Date(startDate.setDate(startDate.getDate() + 1));
            if(endDate.getDay() != 0 && endDate.getDay() != 6){
            count++;
            }
        }
        switch(leaveType){
            case 1:
            case 2:
            case 3:
            case 6:
            case 7:
            case 14:
                return endDate
            default:
                return new Date()
        }
    }
    const inclusiveSPLMinDate = () => {
        var startDate = new Date();
        var endDate = "", noOfDaysToMinus = 5, count = 0;
       
        while(count < noOfDaysToMinus){
            endDate = new Date(startDate.setDate(startDate.getDate() - 1));
            if(endDate.getDay() != 0 && endDate.getDay() != 6 && !alreadyAppliedDays.includes(moment(endDate).format('MM-DD-YYYY'))){
                count++;
            }
            
        }
        return endDate
    }
    const inclusiveSPLMaxDate = () => {
        var startDate = new Date();
        var endDate = "", noOfDaysToAdd = 5, count = 0;
       
        while(count < noOfDaysToAdd){
            endDate = new Date(startDate.setDate(startDate.getDate() + 1));
            
            if(endDate.getDay() != 0 && endDate.getDay() != 6 && !alreadyAppliedDays.includes(moment(endDate).format('MM-DD-YYYY'))){
            count++;
            }
        }
        return endDate
    }


    //value for selected sorted inclusive dates
    const [previewInclusiveDates,setPreviewInclusiveDates] = React.useState('');

    //reference for leave application print preview
    const leaveRef = useRef();

    //reference for CTO application print preview
    const cocRef = useRef();

    

    
    const [isAppliedAllocationOfMaternityLeave,setisAppliedAllocationOfMaternityLeave] = React.useState(false)
    const [allocationInfo,setallocationInfo] = React.useState({
        employee_contact_details:'',
        allocated_days:1,
        fullname:'',
        position:'',
        home_address:'',
        contact_details:'',
        agency_address:'',
        relationship_to_employee:'',
        relationship_to_employee_details:'',
        relationship_to_employee_details_specify:'',
        relationship_to_employee_proof:'',
        relationship_to_employee_proof_file:'',
        esignature:''

    })
    const saveAllocationForm = (data) => {
        // console.log(data)
        setallocationInfo(data)
    }
    const [selectedRehabilitationDates,setRehabilitationDates] = React.useState('');
    const [selectedBenefitForWomenDates,setselectedBenefitForWomenDates] = React.useState('');
    const [selectedStudyDates,setSelectedStudyDates] = React.useState('');
    const [selectedAdoptionDates,setSelectedAdoptionDates] = React.useState('');


    useEffect(()=>{
        if(selectedInclusiveMaternityDates.length !==0){
            // let toDate = momentBusinessDays(selectedInclusiveMaternityDates.toDate(), 'DD-MM-YYYY').businessAdd(105)._d
            const from = selectedInclusiveMaternityDates.toDate();
            let to;
            var end = daysPeriod;
            if(isAppliedAllocationOfMaternityLeave){
                end = end-allocationInfo.allocated_days;
            }
            // var inclusiveDates = moment(selectedInclusiveMaternityDates.toDate()).format('MMMM DD, YYYY')+' - ' +moment(toDate).format('MMMM DD, YYYY');
            const date = selectedInclusiveMaternityDates.toDate()
            const dates = [];
            var start = 1;
            while(start <= end){
                var exclude = alreadyAppliedDays.includes(moment(date).format('MM-DD-YYYY'))

                if(exclude){
                    date.setDate(date.getDate() + 1);
                }else{
                    dates.push(moment(new Date(date)).format('MM-DD-YYYY'));
                    date.setDate(date.getDate() + 1);
                    start++;
                }
            }
            var inclusiveDates = moment(dates[0]).format('MMMM DD,YYYY') + ' - ' + moment(dates[dates.length-1]).format('MMMM DD,YYYY')
            setPreviewInclusiveDates(inclusiveDates)
            // const exclude_days =[];
            // dates.forEach(el=>{
            //     alreadyAppliedDays.forEach(el2=>{
            //         if(moment(el).format('MM-DD-YYYY') === moment(el2).format('MM-DD-YYYY')){
            //             exclude_days.push(moment(el).format('MM-DD-YYYY'))
            //         }
            //     })
            // })
            // console.log(exclude_days)
            setInclusiveMaternityDatesRange(dates)
        }
    },[selectedInclusiveMaternityDates,isAppliedAllocationOfMaternityLeave,allocationInfo])
    useEffect(()=>{
        if(selectedInclusiveVAWCDates.length !==0){
            var end = daysPeriod;
            const date = selectedInclusiveVAWCDates.toDate()
            const dates = [];
            var start = 1;
            while(start <= end){
                var exclude = alreadyAppliedDays.includes(moment(date).format('MM-DD-YYYY'))
                if(exclude){
                    date.setDate(date.getDate() + 1);
                }else if(moment(date).isBusinessDay()){
                    dates.push(moment(new Date(date)).format('MM-DD-YYYY'));
                    date.setDate(date.getDate() + 1);
                    start++;
                }
                else{
                    date.setDate(date.getDate() + 1);
                }
            }
            var inclusiveDates = moment(dates[0]).format('MMMM DD,YYYY') + ' - ' + moment(dates[dates.length-1]).format('MMMM DD,YYYY')
            setPreviewInclusiveDates(inclusiveDates)
            setInclusiveVAWCDatesRange(dates)
        }
    },[selectedInclusiveVAWCDates])
    useEffect(()=>{
        if(selectedRehabilitationDates.length >1){
            var dates = selectedRehabilitationDates[0].format('MMMM DD,YYYY')+' - '+selectedRehabilitationDates[1].format('MMMM DD,YYYY')
            // allDates.forEach( el =>
            //     console.log(moment(el.toDate()).format('MM-DD-YYYY'))
            // )
            setPreviewInclusiveDates(dates)
        }
    },[selectedRehabilitationDates])
    useEffect(()=>{
        if(selectedBenefitForWomenDates.length >1){
            var dates = selectedBenefitForWomenDates[0].format('MMMM DD,YYYY')+' - '+selectedBenefitForWomenDates[1].format('MMMM DD,YYYY')
            setPreviewInclusiveDates(dates)
        }
    },[selectedBenefitForWomenDates])
    useEffect(()=>{
        if(selectedStudyDates.length >1){
            var dates = selectedStudyDates[0].format('MMMM DD,YYYY')+' - '+selectedStudyDates[1].format('MMMM DD,YYYY')
            setPreviewInclusiveDates(dates)
        }
    },[selectedStudyDates])
   
    
    const cancelApplication = (row) =>{
        Swal.fire({
            icon:'warning',
            title: 'Are you sure to cancel your application ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data = {
                    leave_application_id:row.leave_application_id,
                    leave_type_id:row.leave_type_id,
                    leave_type:row.leave_type,
                    leave_type_details:row.leave_type_details,
                    days_with_pay:row.days_with_pay,
                    days_without_pay:row.days_without_pay,
                    inclusive_dates_text:row.inclusive_dates_text,
                    inclusive_dates_text:row.inclusive_dates_text,
                    specify_details:row.specify_details
                }
                cancelLeaveApplication(data)
                .then(response=>{
                    if(response.data.status==='success'){
                        const data = response.data
                        setLeaveType('');
                        var temp = 0;
                        data.pending.forEach(el => {
                            if(el.status=== 'FOR REVIEW' && el.leave_type_id === 14){
                                temp+=el.days_hours_applied
                            }
                        });
                        setTotalForReview(temp)
                        setPendingLeaveApplicationData(data.pending)
                        setonProcess(data.on_process)
                        setAlreadyAppliedDays(data.applied_dates)
                        setAlreadyAppliedDaysPeriod(data.dates_has_period)
                        setMaternityBal(data.maternity_bal)
                        setMaternityOnProcess(data.maternity_on_process)
                        setAvailabelSPL(data.spl_days_balance)
                        setOnprocessSPL(data.spl_days_onprocess)
                        var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
                        var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
                        var coc = data.balance[0].coc_bal-data.on_process.coc < 0 ?0:data.balance[0].coc_bal-data.on_process.coc
                        setavailableVL(vl)
                        setavailableSL(sl)
                        // setavailableCOC(coc)
                        setavailableCOC(coc)
                        Swal.fire({
                            icon:'success',
                            title:response.data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                        
                    }else{
                        const data = response.data
                        var temp = 0;
                            data.pending.forEach(el => {
                                if(el.status=== 'FOR REVIEW' && el.leave_type_id === 14){
                                    temp+=el.days_hours_applied
                                }
                            });
                        setTotalForReview(temp)
                        setPendingLeaveApplicationData(data.pending)
                        setAlreadyAppliedDays(data.applied_dates)
                        setAlreadyAppliedDaysPeriod(data.dates_has_period)
                        Swal.fire({
                            icon:'error',
                            title:'Oops...',
                            html:response.data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                       
                    }
                    
                }).catch(error=>{
                    console.log(error)
                    Swal.close();
                })
            }
          })
    }
    const [printPendingInfo,setPrintPendingInfo] = React.useState([]);
    const [previewPendingInfo,setPreviewPendingInfo] = React.useState([]);
    //reference for leave application print preview on pending application
    const printLeaveRef = useRef();

    //reference for CTO print preview on pending application
    const printLeaveCTORef = useRef();
    
    //reference for allocation of maternity leave
    const printMaternityAllocationLeaveRef = useRef();

    const reactToPrint  = useReactToPrint({
        content: () => printLeaveRef.current,
        documentTitle: 'Leave Application '+employeeInfo.lname

    });
    const reactToPrintCTO  = useReactToPrint({
        content: () => printLeaveCTORef.current,
        documentTitle:'CTO '+employeeInfo.lname
    });
    const [printCount,setPrintCount] = React.useState(0);
    
    const [pendingBalance,setPendingBalance] = React.useState('');
    const [previewBalance,setPreviewBalance] = React.useState('');
    const [previewModal,setPreviewModal] = React.useState(false);
    const previewPending = (row)=>{
        var bal,bal2;
        /**
         * Post Audit Logs
         */
        var action_dtl = 'LEAVE NAME = '+row.leave_type+' | LEAVE DETAILS = '+row.leave_type_details+' | SPECIFY DETAILS = '+row.specify_details+' | DWP = '+row.days_with_pay+' | DWOP = '+row.days_without_pay+' | INCLUSIVE DATES = '+row.inclusive_dates_text;

        var data2 = {
            action:'VIEW FILED LEAVE APPLICATION',
            action_dtl:action_dtl,
            module:'ONLINE LEAVE'
        }
        auditLogs(data2)
        balanceData.forEach(element => {
            switch(row.leave_type_id){
                /**
                 * vacation leave/force leave/ special privilege leave
                 */
                case 1:
                case 2:
                    bal2 = element.vl_bal-onProcess.vl
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = element.vl_bal-onProcess.vl
                    }
                    break;
                /**
                 * sick leave
                 */
                case 3:
                    bal2 = element.sl_bal-onProcess.sl
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = element.sl_bal-onProcess.sl
                    }
                    break;
                /**
                 *  CTO
                 */
                case 14:
                    bal2 = element.coc_bal-onProcess.coc
                    if(bal2<0){
                        bal = 0
                    }else{
                        bal = element.coc_bal-onProcess.coc
                    }
                    break;
            }
        });
        setPreviewBalance(bal)
        setPreviewPendingInfo(row)
        setPreviewModal(true)
    }
    const printPending = (row)=>{
        console.log(row)
        // var t_dtl = 'LEAVE NAME = '+row.leave_type+' | LEAVE DETAILS = '+row.leave_type_details+' | SPECIFY DETAILS = '+row.specify_details+' | DWP = '+row.days_with_pay+' | DWOP = '+row.days_without_pay+' | INCLUSIVE DATES = '+row.inclusive_dates_text;
        // var logs = {
        //     action:'PRINT ONLINE LEAVE APPLICATION',
        //     action_dtl:t_dtl,
        //     module:'ONLINE LEAVE'
        // }
        // auditLogs(logs)

        setPrintCount(printCount+1);
        var bal,bal2;
        // balanceData.forEach(element => {
        //     switch(row.leave_type_id){
        //         /**
        //          * vacation leave/force leave/ special privilege leave
        //          */
        //         case 1:
        //         case 2:
        //             bal2 = element.vl_bal-onProcess.vl
        //             if(bal2<0){
        //                 bal = 0
        //             }else{
        //                 bal = element.vl_bal-onProcess.vl
        //             }
        //             break;
        //         /**
        //          * sick leave
        //          */
        //         case 3:
        //             bal2 = element.sl_bal-onProcess.sl
        //             if(bal2<0){
        //                 bal = 0
        //             }else{
        //                 bal = element.sl_bal-onProcess.sl
        //             }
        //             break;
        //         /**
        //          *  CTO
        //          */
        //         case 14:
        //             bal2 = element.coc_bal-onProcess.coc
        //             if(bal2<0){
        //                 bal = 0
        //             }else{
        //                 bal = element.coc_bal-onProcess.coc
        //             }
        //             break;
        //     }
        // });
        bal = row.bal_before_process;
        setPendingBalance(bal)
        setPrintPendingInfo(row)
        var action_dtl = 'LEAVE NAME = '+row.leave_type+' | LEAVE DETAILS = '+row.leave_type_details+' | SPECIFY DETAILS = '+row.specify_details+' | DWP = '+row.days_with_pay+' | DWOP = '+row.days_without_pay+' | INCLUSIVE DATES = '+row.inclusive_dates_text;

        var data2 = {
            action:'PRINT LEAVE APPLICATION',
            action_dtl:action_dtl,
            module:'ONLINE LEAVE'
        }
        auditLogs(data2)

        // reactToPrint()
    }
    useEffect(()=>{
        if(printPendingInfo.length !==0){
            if(printPendingInfo.leave_type_id === 14){
                reactToPrintCTO()
                // setPrintPendingInfo([])
            }else{
                reactToPrint()
                // setPrintPendingInfo([])

            }
        }
    },[printCount])
    
        
    
    const refreshPendingApplication = () =>{
        Swal.fire({
            icon:'info',
            title:'Please wait...',
            html:'Refreshing data...'
        })
        Swal.showLoading()
       
        refreshData()
        .then((response)=>{
            const data = response.data
            var temp = 0;
            data.pending.forEach(el => {
                if(el.status=== 'FOR REVIEW' && el.leave_type_id === 14){
                    temp+=el.days_hours_applied
                }
            });
            setTotalForReview(temp)
            setRequestedRescheduleData(data.reschedule_data)
            setRequestedCancelledData(data.cancelled_data)
            setPendingLeaveApplicationData(data.pending)
            setHistoryLeaveApplicationData(data.history)
            setAlreadyAppliedDays(data.applied_dates)
            setAlreadyAppliedDaysPeriod(data.dates_has_period)
            setonProcess(data.on_process)
            setBalanceData(data.balance)
            setAvailabelSPL(data.spl_days_balance)
            setOnprocessSPL(data.spl_days_onprocess)
            setMaternityBal(data.maternity_bal)
            setMaternityOnProcess(data.maternity_on_process)
            var bal,bal2;
            balanceData.forEach(element => {
                switch(data.balance){
                    /**
                     * vacation leave/force leave/ special privilege leave
                     */
                    case 1:
                    case 2:
                        bal2 = element.vl_bal-onProcess.vl
                        if(bal2<0){
                            bal = 0
                        }else{
                            bal = element.vl_bal-onProcess.vl
                        }
                        break;
                    /**
                     * sick leave
                     */
                    case 3:
                        bal2 = element.sl_bal-onProcess.sl
                        if(bal2<0){
                            bal = 0
                        }else{
                            bal = element.sl_bal-onProcess.sl
                        }
                        break;
                    /**
                     *  CTO
                     */
                    case 14:
                        bal2 = element.coc_bal-onProcess.coc
                        if(bal2<0){
                            bal = 0
                        }else{
                            bal = element.coc_bal-onProcess.coc
                        }
                        var coc = bal
                        var result = [];
                        
                        //limit only 5 days equals to 40 HRS per application
                        var x=0;
                        for(var i = 4 ; x < 10 ;){
                            if(i>coc){
                                break;
                            }else{
                                result.push(i)
                                i = i +4;
                                x++;
                            }
                        
                        }
                        break;
                }
            });
            setPendingBalance(bal)
            var vl = data.balance[0].vl_bal-data.on_process.vl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,Math.floor(data.balance[0].vl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].vl_bal,data.on_process.vl)
            var sl = data.balance[0].sl_bal-data.on_process.sl < 0 ?formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,Math.floor(data.balance[0].sl_bal)):formatSubtractCreditAvailableDecimal(data.balance[0].sl_bal,data.on_process.sl)
            var coc = data.balance[0].coc_bal< 0 ?0:data.balance[0].coc_bal-data.on_process.coc
            

            setavailableVL(vl)
            setavailableSL(sl)
            // setavailableCOC(coc)
            setavailableCOC(data.coc_bal)
            console.log(data.coc_bal)
            Swal.close()

        }).catch((error)=>{
            // console.log(error)
            toast(error.message)
                            window.open(api_url)

            Swal.close();

        })
    }
    const showFileAttachment = (row) => {
        switch(row.leave_type_id){
            case 4:
                var id = row.leave_application_id;
                // viewFileAPI(id)
                axios({
                    url: 'api/fileupload/viewAllocationFile/'+id, //your url
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('target', '_BLANK'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                }).catch(error=>{
                    toast.error(error.message+'. Access denied.')
                });
                break;
            default:
                // var file_id = JSON.parse(row.file_ids);
                viewFileAPI(row)

                // axios({
                //     url: 'api/fileupload/viewFile/'+file_id, //your url
                //     method: 'GET',
                //     responseType: 'blob', // important
                // }).then((response) => {
                //     const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
                //     const link = document.createElement('a');
                //     link.href = url;
                //     link.setAttribute('target', '_BLANK'); //or any other extension
                //     document.body.appendChild(link);
                //     link.click();
                // }).catch(error=>{
                //     toast.error(error.message+'. Access denied.')
                // });
                break;
        }
    }
    const [accordionCB,setAccordionCB] = React.useState(true)
    const [accordionPending,setAccordionPending] = React.useState(false)
    const [accordionExtendedMaternity,setAccordionExtendedMaternity] = React.useState(false)
    const [accordionHistory,setAccordionHistory] = React.useState(false)
    const [accordionReschedule,setAccordionReschedule] = React.useState(false)
    const [accordionCancelled,setAccordionCancelled] = React.useState(false)
    useEffect(()=>{
        if(accordionPending){
            $('html, body').animate({
                scrollTop: $("#pending-header").offset().top
            }, 500);
        }
    },[accordionPending])
    useEffect(()=>{
        if(accordionExtendedMaternity){
            $('html, body').animate({
                scrollTop: $("#extended-maternity-header").offset().top
            }, 500);
        }
    },[accordionExtendedMaternity])
    useEffect(()=>{
        if(accordionReschedule){
            $('html, body').animate({
                scrollTop: $("#requested-reschedule-header").offset().top
            }, 500);
        }
    },[accordionReschedule])
    useEffect(()=>{
        if(accordionCancelled){
            $('html, body').animate({
                scrollTop: $("#requested-cancelled-header").offset().top
            }, 500);
        }
    },[accordionCancelled])
    useEffect(()=>{
        if(accordionHistory){
            $('html, body').animate({
                scrollTop: $("#history-header").offset().top
            }, 500);
        }
    },[accordionHistory])
    const formatSubtractCreditAvailableDecimal = (leaveBalance,onProcess) => {
        let tens = [10,100,1000,10000,100000];
        let b1 = leaveBalance.toString().split('.');
        let b1_max = 0;
        if(b1.length===2){
            b1_max=b1[1].length
        }else{
            b1_max=1
        }
        let tens_mult = tens[b1_max-1]
        let b1_fin = Math.floor(leaveBalance * tens_mult);
        let b2 = onProcess * tens_mult;
        
        if(onProcess>leaveBalance){
            let b1_fin2 = Math.floor(leaveBalance) * tens_mult;
            let comp = (b1_fin - b1_fin2 ) / tens_mult
            return comp;
        }else{
            let comp = (b1_fin - b2 ) / tens_mult
            return comp;
        }
        
        // {balanceData[0].vl_bal-onProcess.vl < 0 ?(Math.round((balanceData[0].vl_bal-Math.floor(balanceData[0].vl_bal)) * 100) / 100):(Math.round((balanceData[0].vl_bal-onProcess.vl) * 100) / 100)} 
    }
    const updatesetPendingLeaveApplicationData = (data) =>{
        var temp = 0;
        data.forEach(el => {
            if(el.status=== 'FOR REVIEW' && el.leave_type_id === 14){
                temp+=el.days_hours_applied
            }
        });
        setTotalForReview(temp)
        setPendingLeaveApplicationData(data)
    }
    const updatesetavailableVL = (data) => {
        setavailableVL(data)
    }
    const updatesetavailableSL = (data) => {
        setavailableSL(data)
    }
    const updatesetavailableCOC = (data) => {
        setavailableCOC(data)
    }
    const updatesetOpen = (data) => {
        setOpen(data)
    }
    const updatesetonProcess = (data)=>{
        setonProcess(data)
    }
    const updatesetAvailabelSPL = (data)=>{
        setAvailabelSPL(data)
    }
    const updatesetOnprocessSPL = (data)=>{
        setOnprocessSPL(data)
    }
    const updatesetAlreadyAppliedDays = (data)=>{
        setAlreadyAppliedDays(data)
    }
    const [bugsModal,setBugsModal] = React.useState(false)
    const submitBugs = () =>{
        setBugsModal(true)
    }
    const [leaveLedgerModal,setLeaveLedgerModal] = useState(false)
    const leaveLedger = () =>{
        
    }
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pageHistory, setPageHistory] = useState(0);
    const [pageReschedule, setPageReschedule] = useState(0);
    const [pageCancelled, setPageCancelled] = useState(0);
    const [rowsPerPageHistory, setRowsPerPageHistory] = useState(5);
    const [rowsPerPageReschedule, setRowsPerPageReschedule] = useState(5);
    const [rowsPerPageCancelled, setRowsPerPageCancelled] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChangePageHistory = (event, newPage) => {
        setPageHistory(newPage);
    };
    
    const handleChangeRowsPerPageHistory = (event) => {
        setRowsPerPageHistory(+event.target.value);
        setPageHistory(0);
    };
    
    const handleChangePageReschedule = (event, newPage) => {
        setPageReschedule(newPage);
    };

    const handleChangePageCancelled = (event, newPage) => {
        setPageCancelled(newPage);
    };
    
    const handleChangeRowsPerPageReschedule = (event) => {
        setRowsPerPageReschedule(+event.target.value);
        setPageReschedule(0);
    };
    const handleChangeRowsPerPageCancelled = (event) => {
        setRowsPerPageCancelled(+event.target.value);
        setPageCancelled(0);
    };
    const [openEarnMaternityCreditsDialog,setOpenEarnMaternityCreditsDialog] = useState(false)
    const styleCancelModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':500,
        bgcolor: 'background.paper',
        // border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:'5px',
        // p: 2,
    };
    const [openCancelModal,setOpenCancelModal] = useState(false)
    const [selectedCancelData,setSelectedCancelData] = useState([])
    const handleCloseCancelModal = () => {
        setOpenCancelModal(false)
        setSelectedCancelData([])
    }
    const handleCancelAppplication = (row) =>{
        console.log(row)
        setSelectedCancelData(row)
        setOpenCancelModal(true)
    }
    const styleReschedModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':400,
        bgcolor: 'background.paper',
        border: '2px solid #ff',
        boxShadow: 24,
        borderRadius:'5px',
        p: 2,
    };
    const styleViewReschedModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':600,
        bgcolor: 'background.paper',
        border: '2px solid #ff',
        boxShadow: 24,
        borderRadius:'5px',
        p: 2,
    };
    const [reschedDateData,setReschedDateData] = useState([])
    const [selectedReschedData,setSelectedReschedData] = useState([])
    const [openReschedModal,setOpenReschedModal] = useState(false)
    const [openViewReschedModal,setOpenViewReschedModal] = useState(false)
    const handleCloseReschedModal = () => {
        setOpenReschedModal(false)
        setReschedDateData([])
    }
    const handleCloseViewReschedModal = () => {
        setOpenViewReschedModal(false)

    }
    const handleViewRequestedReschedule = () =>{
        console.log(selectedReschedPopover)
        var info = JSON.parse(selectedReschedPopover.resched_info)
        if(info[0].details===null){
            Swal.fire({
                icon:'warning',
                title:'No data'
            })
        }else{
            setOpenViewReschedModal(true)
        }
    }
    const handleDeleteReschedule = (data,temp) =>{
        selectedReschedPopover.resched_info = JSON.stringify(temp)
        setHistoryLeaveApplicationData(data)
    }
    const checkApplicableReschedule = () => {
        console.log(selectedReschedPopover)
        var dwpay = JSON.parse(selectedReschedPopover.inclusive_dates);
        var dwopay = selectedReschedPopover.inclusive_dates_without_pay !== null && selectedReschedPopover.inclusive_dates_without_pay !== 'null' ?JSON.parse(selectedReschedPopover.inclusive_dates_without_pay):[];
        var merge  = dwpay.concat(dwopay)
        console.log(merge)
        var currDate = new Date();
        var applicableDates = merge.filter((el=>{
            return moment(el.date).format('MM-DD-YYYY') > moment(currDate).format('MM-DD-YYYY')
        }))
        if(applicableDates.length === 0){
            Swal.fire({
                icon:'warning',
                title:'No applicable dates can be reschedule',
                html:'Leave date must be advanced from current date.'
            })
        }else{
            /**
            Get existing requested reschedule
            */
            var t_details = JSON.parse(selectedReschedPopover.resched_info);
            var t_date = [];
            console.log(t_details)

            
            t_details.forEach(el=>{
                if(el.details !== null && (el.status === 'FOR REVIEW' || el.status === 'APPROVED')){
                    JSON.parse(el.details).forEach(el2=>{
                        t_date.push(el2)
                    })
                }
            })
            console.log(t_date)
            applicableDates = applicableDates.filter(o=>!t_date.some(i=>i.date === o.date))
            console.log(applicableDates)
            if(applicableDates.length === 0){
                Swal.fire({
                    icon:'warning',
                    title:'All dates were already requested for reschedule'
                })
            }else{
                applicableDates.forEach(el=>{
                    el.new_date = '';
                })
                console.log(applicableDates)
                setReschedDateData(applicableDates)

                setOpenReschedModal(true)
                var t_data = {
                    leave_application_id:selectedReschedPopover.leave_application_id,
                    employee_id:selectedReschedPopover.employee_id,
                    leave_name:selectedReschedPopover.leave_type,
                    leave_type_id:selectedReschedPopover.leave_type_id,
                    name:selectedReschedPopover.name,
                    ref_no:selectedReschedPopover.ref_no
                }
                setSelectedReschedData(t_data)
            }
            
            // var r_data = {
            //     id:row.leave_application_id
            // }
            // getRequestedRescheduleData(r_data)
            // .then(res=>{
            //     console.log(res.data)
            //     /**
            //     Get existing requested reschedule
            //      */
            //     var t_date = [];
            //     res.data.forEach(el=>{
            //         JSON.parse(el.details).forEach(el2=>{
            //             t_date.push(el2)
            //         })
            //     })
            //     console.log(t_date)
            //     applicableDates = applicableDates.filter(o=>!t_date.some(i=>i.date === o.date))
            //     console.log(applicableDates)
            //     if(applicableDates.length === 0){
            //         Swal.fire({
            //             icon:'warning',
            //             title:'All dates were already requested for reschedule'
            //         })
            //     }else{
            //         applicableDates.forEach(el=>{
            //             el.new_date = '';
            //         })
            //         console.log(applicableDates)
            //         setReschedDateData(applicableDates)

            //         setOpenReschedModal(true)
            //         var t_data = {
            //             leave_application_id:row.leave_application_id,
            //             employee_id:row.employee_id,
            //             leave_name:row.leave_type,
            //             leave_type_id:row.leave_type_id,
            //             name:row.name,
            //             ref_no:row.ref_no
            //         }
            //         setSelectedReschedData(t_data)
            //     }
                
            // })


        }

    }
    const [selectedReschedPopover,setSelectedReschedPopover] = useState([])
    const [anchorElResched, setAnchorElResched] = React.useState(null);

    const handleOpenReschedPopover = (event,row) => {
        setSelectedReschedPopover(row)
        setAnchorElResched(event.currentTarget);
    };

    const handleCloseReschedPopover = () => {
        setSelectedReschedPopover([])
        setAnchorElResched(null);
    };

    const openReschedPopover = Boolean(anchorElResched);
    const reschedId = openReschedPopover ? 'simple-popover' : undefined;

    const handleSaveReschedLeave = (data,reason) => {
        Swal.fire({
            icon:'info',
            title:'Submitting reschedule request',
            html:'Please wait...'
        })
        Swal.showLoading();

        selectedReschedData.details = data;
        selectedReschedData.reason = reason;
        console.log(selectedReschedData)
        requestRescheduleLeave(selectedReschedData)
        .then(res=>{
            if(res.data.status === 200){
                handleCloseReschedModal()
                setHistoryLeaveApplicationData(res.data.data)
                setRequestedRescheduleData(res.data.reschedule_data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:res.data.message
                })
            }
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const formatReschedDetails = (row) =>{
        var arr = JSON.parse(row);
        if(arr.length>0){
            return (
                <ul>
                    {
                        arr.map((item,key)=>
                            <li key={key}> {moment(item.date).format('MMMM DD, YYYY')} <ArrowRightAltIcon color='error'/> {moment(item.new_date).format('MMMM DD, YYYY')}</li>
                        )
                    }
                </ul>
            )
        }else{
            return null;
        }
    }
    const formatCancelledDetails = (row) =>{
        var arr = JSON.parse(row);
        if(arr.length>0){
            return (
                <ul>
                    {
                        arr.map((item,key)=>
                            <li key={key}> {moment(item.date).format('MMMM DD, YYYY')}</li>
                        )
                    }
                </ul>
            )
        }else{
            return null;
        }
    }
    const handleDeleteMainReschedule = (row,index)=>{
        console.log(row)
        Swal.fire({
            icon:'question',
            title:'Confirm delete request?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Deleting request',
                    html:'Please wait'
                })
                Swal.showLoading();
                var t_data = {
                    id:row.leave_application_reschedule_id,
                    type:1
                }
                deleteRequestedRescheduleLeave(t_data)
                .then(res=>{
                    if(res.data.status === 200){
                        setRequestedRescheduleData(res.data.reschedule_data)
                        setHistoryLeaveApplicationData(res.data.data)
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
                    Swal.fire({
                        icon:'success',
                        title:err
                    })
                })
                
            }
        })
    }
    const handleDeleteCancelled = (row,key)=>{
        Swal.fire({
            icon:'question',
            title:'Confirm delete request?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Deleting request',
                    html:'Please wait'
                })
                Swal.showLoading();
                var t_data = {
                    id:row.leave_cancellation_request_id,
                    employee_id:row.employee_id
                }
                deleteRequestedCancelledLeave(t_data)
                .then(res=>{
                    if(res.data.status === 200){
                        setRequestedCancelledData(res.data.data)
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
                    Swal.fire({
                        icon:'success',
                        title:err
                    })
                })
                
            }
        })
    }
    const COCEarnedInfostyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
    };
    const [openCOCInfo, setOpenCOCInfo] = React.useState(false);
    const handleOpenCOCInfo = () => setOpenCOCInfo(true);
    const handleCloseCOCInfo = () => setOpenCOCInfo(false);
    const [COCearnedInfoData,setCOCEarnedInfoData] = useState([])
    const handleViewCOCInfo = async () => {
        Swal.fire({
            icon:'info',
            title:'Loading COC earned info',
            html:'Please wait...',
            showConfirmButton:false
        })
        Swal.showLoading()
        await getCOCEarnedInfo()
        .then(res=>{
            console.log(res.data)
            if(res.data.length>0){
                setCOCEarnedInfoData(res.data)
                Swal.close();
                handleOpenCOCInfo()
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Data not found'
                })
            }
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    return(
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {isLoading
            ?
            <DashboardLoading actionButtons={4}/>
            :
            <Fade in={!isLoading}>
                <Grid container>
                    <Grid item xs={12} sx={{mb:1}}>
                        <Alert severity="info"><ConstructionOutlinedIcon fontSize='small'/> <strong>Beta test</strong> only. All records will be updated soon. </Alert>

                        </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756',borderBottomLeftRadius:'20px',borderTopRightRadius:'20px'}} className='custom-boxshadow'> */}
                            {/* <Typography variant='h5' sx={{fontSize:matches?'18px':'auto',color:'#fff',textAlign:matches?'center':'left',pt:1,pb:1,pl:matches?0:2,borderBottomLeftRadius:'20px',borderTopRightRadius:'20px'}} className='custom-boxshadow-header'>
                            Online Leave Application
                            </Typography> */}
                            <ModuleHeaderText title ='Online Leave Application'/>
                            
                        {/* </Box> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:matches?'space-evenly':'flex-end',mt:1,gap:1}}>
                        
                        {/* <Tooltip title='Apply Leave Application'>
                        <Button variant='contained' className='custom-roundbutton' onClick = {()=>setOpenApplicationDialog(true)} sx={{fontSize:matches?'13px':'auto','&:hover':{color:'#fff',background:green[900]}}} color='success' startIcon={<AddIcon/>}> Apply</Button>
                        </Tooltip> */}
                        <Tooltip title='Apply Leave Application'>
                        <IconButton onClick = {()=>setOpenApplicationDialog(true)} sx={{'&:hover':{color:'#fff',background:green[800]}}}color='success'  className='custom-iconbutton'><AddIcon/></IconButton>
                        </Tooltip>

                        {/* <Tooltip title='Earn Maternity Credits'>
                        <Button variant='contained' className='custom-roundbutton' onClick = {()=>setOpenEarnMaternityCreditsDialog(true)} sx={{background:blue[600],fontSize:matches?'13px':'auto','&:hover':{color:'#fff',background:blue[700]}}} startIcon={<ChildCareIcon/>}> Maternity Credits</Button>
                        </Tooltip> */}

                        <Tooltip title='Earn Maternity Credits'>
                        <IconButton onClick = {()=>setOpenEarnMaternityCreditsDialog(true)} sx={{color:blue[500],'&:hover':{color:'#fff',background:blue[800]}}}className='custom-iconbutton'><ChildCareIcon/></IconButton>
                        </Tooltip>

                        {/* <Tooltip title='Leave Ledger'>
                        <Button variant='contained' className='custom-roundbutton' onClick = {()=>setOpenEarnMaternityCreditsDialog(true)} sx={{background:blue[700],fontSize:matches?'13px':'auto','&:hover':{color:'#fff',background:blue[800]}}} startIcon={<TextSnippetOutlinedIcon/>}>Ledger</Button>
                        </Tooltip> */}
                        <Tooltip title='Leave Ledger'>
                        <IconButton onClick = {()=>setOpenLeaveLedgerDialog(true)} sx={{color:blue[500],'&:hover':{color:'#fff',background:blue[800]}}}className='custom-iconbutton'><TextSnippetOutlinedIcon/></IconButton>
                        </Tooltip>

                        <Tooltip title='Request Daily Earned Leaves'>
                        <IconButton onClick = {()=>setOpenRequestDialog(true)} sx={{color:blue[500],'&:hover':{color:'#fff',background:blue[800]}}}className='custom-iconbutton'><UpdateIcon/></IconButton>
                        </Tooltip>

                        <Tooltip title="Refresh Data">
                        <IconButton onClick = {refreshPendingApplication} className='custom-iconbutton'><CachedIcon sx={{color:blue[800],transition:'0.4s ease-in-out','&:hover':{transform:'rotate(-180deg)'}}}/></IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sx={{mt:2}}>
                    <Accordion expanded = {accordionCB}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="credit-content"
                        id="credit-header"
                        onClick={()=>setAccordionCB(!accordionCB)}
                        sx={{'&:hover':{background:'#f2f2f2'}}}
                        >
                        <ThemeProvider theme={headerTheme}>
                            <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b',fontWeight:'bold'}}>Leave Balance</Typography>
                        </ThemeProvider>
                        </AccordionSummary>
                        <AccordionDetails>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <StyledBalanceTableCell>Type of Leave</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">Balance</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">On Review</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">Available</StyledBalanceTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <StyledBalanceTableCell component="th" scope="row">
                                        Vacation Leave
                                    </StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{(balanceData[0].vl_bal).toFixed(3)}</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{onProcess.vl}</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">
                                        {(balanceData[0].vl_bal-onProcess.vl).toFixed(3)}
                                    </StyledBalanceTableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <StyledBalanceTableCell component="th" scope="row">
                                        Sick Leave
                                    </StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{balanceData[0].sl_bal}</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{onProcess.sl}</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">
                                        {
                                            balanceData[0].sl_bal>=onProcess.sl
                                            ?
                                            (balanceData[0].sl_bal-onProcess.sl).toFixed(3)
                                            :
                                            0
                                        }
                                </StyledBalanceTableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <StyledBalanceTableCell component="th" scope="row">
                                        COC <Tooltip title='View COC earned info'><IconButton color='info' size='small' onClick={handleViewCOCInfo}><InfoOutlinedIcon/></IconButton></Tooltip>
                                    </StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">
                                    {(parseFloat(availableCOC-totalForReview)+parseFloat(onProcess.coc)).toFixed(3)} <small>hr/s</small>
                                    </StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{onProcess.coc}</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{parseFloat(availableCOC-totalForReview).toFixed(3)}</StyledBalanceTableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <StyledBalanceTableCell component="th" scope="row">
                                        Special Privilege Leave
                                    </StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{availableSPL}</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{onprocessSPL}</StyledBalanceTableCell>
                                    <StyledBalanceTableCell align="right">{availableSPL-onprocessSPL}</StyledBalanceTableCell>
                                </TableRow>
                                {
                                    maternityBal === 0
                                    ?
                                    null
                                    :
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <StyledBalanceTableCell component="th" scope="row">
                                            Expanded Maternity Leave 
                                        </StyledBalanceTableCell>
                                        <StyledBalanceTableCell align="right">{maternityBal}</StyledBalanceTableCell>
                                        <StyledBalanceTableCell align="right">{maternityOnProcess}</StyledBalanceTableCell>
                                        <StyledBalanceTableCell align="right">{maternityBal-maternityOnProcess}</StyledBalanceTableCell>
                                    </TableRow>
                                }
                                {/* {balanceData.map((row,key) => (
                                    <TableRow
                                    key={key}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {row.vl_bal}
                                    </TableCell>
                                    <TableCell align="right">{row.sl_bal}</TableCell>
                                    <TableCell align="right">{row.coc_bal}</TableCell>
                                    </TableRow>
                                ))} */}
                                </TableBody>
                                {/* <TableFooter>
                                    <TableRow>
                                        <TableCell>
                                        
                                        </TableCell>
                                    </TableRow>
                                </TableFooter> */}
                            </Table>
                            </TableContainer>
                            <Alert severity="info"><Typography sx={{fontStyle:'italic',fontSize:matches?'.8rem':'.9rem',textAlign:'justify'}}>The Leave credits indicated above are subject for further adjustment upon subsequent review of other pertinent records, if warranted.</Typography></Alert>
                            {/* <Typography sx={{fontStyle:'italic',fontSize:matches?'.8rem':'.9rem',color:'#8d8d8d',textAlign:'justify'}}>* The Leave credits indicated above are subject for further adjustment upon subsequent review of other pertinent records, if warranted.</Typography> */}
                            <SmallModal open = {openCOCInfo} close = {handleCloseCOCInfo} title = 'COC earned history' >
                                <Box sx={{mt:1}}>
                                    <Paper>
                                        <TableContainer sx={{maxHeight:'60vh'}}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>
                                                            Hours Earned
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            Used Hours
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            Expiration
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        COCearnedInfoData.map((item,key)=>
                                                            <TableRow>
                                                                <StyledTableCell>
                                                                    {item.hours_earned}
                                                                </StyledTableCell>
                                                                <StyledTableCell>
                                                                    {item.used}
                                                                </StyledTableCell>
                                                                <StyledTableCell>
                                                                    <span style={{color:moment(item.expiration).format('YYYY-MM-DD')< moment().format('YYYY-MM-DD')?'red':'green'}}>{moment(item.expiration).format('MMMM DD, YYYY')}</span>
                                                                </StyledTableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Box>
                            </SmallModal>
                            {/* <Modal
                                open={openCOCInfo}
                                onClose={handleCloseCOCInfo}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={COCEarnedInfostyle}>
                                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <Typography id="modal-modal-title">
                                        COC earned history
                                    </Typography>
                                        <Tooltip title='Close'><IconButton color='error' onClick={handleCloseCOCInfo}><CloseIcon/></IconButton></Tooltip>
                                    </Box>

                                    <Box sx={{mt:1}}>
                                        <Paper>
                                            <TableContainer sx={{maxHeight:'60vh'}}>
                                                <Table stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>
                                                                Hours Earned
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Used Hours
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Expiration
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            COCearnedInfoData.map((item,key)=>
                                                                <TableRow>
                                                                    <StyledTableCell>
                                                                        {item.hours_earned}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {item.used}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        <span style={{color:moment(item.expiration).format('YYYY-MM-DD')< moment().format('YYYY-MM-DD')?'red':'green'}}>{moment(item.expiration).format('MMMM DD, YYYY')}</span>
                                                                    </StyledTableCell>
                                                                </TableRow>
                                                            )
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                    </Box>
                                
                                </Box>
                            </Modal> */}
                        </AccordionDetails>
                    </Accordion>
                    </Grid>
                    {pendingLeaveApplicationData.length !==0
                    ?
                    <Accordion expanded={accordionPending} sx={{marginTop:'10px',width:'100%'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="pending-content"
                        id="pending-header"
                        onClick = {()=>setAccordionPending(!accordionPending)}
                        sx={{'&:hover':{background:'#f2f2f2'}}}
                        >
                        <ThemeProvider theme={headerTheme}>
                        <Typography color={orange[900]} sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold'}}>Pending Application</Typography>
                        </ThemeProvider> &nbsp;
                        {
                            accordionPending
                            ?
                            ''
                            :
                            <Fade in={!accordionPending}>
                            <Badge badgeContent={pendingLeaveApplicationData.length} color="primary" className = 'animate__animated animate__tada'>
                                <PendingIcon color="action" />
                            </Badge>
                            </Fade>
                        }
                        </AccordionSummary>
                        <AccordionDetails>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Date Filed</StyledTableCell>
                                        <StyledTableCell>Inclusive Dates</StyledTableCell>
                                        <StyledTableCell>Type of Leave</StyledTableCell>
                                        <StyledTableCell>Details of Leave</StyledTableCell>
                                        <StyledTableCell>No. of Days/Hours Applied</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Remarks</StyledTableCell>
                                        <StyledTableCell align='center'>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        pendingLeaveApplicationData.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((row,key)=>
                                        <TableRow key = {key} hover>
                                            <StyledTableCell>{moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}</StyledTableCell>
                                            <StyledTableCell>{row.inclusive_dates_text}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type_details}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type_id === 14?<span>{row.days_hours_applied} <small><em>hours</em> </small></span>:<span>{row.days_hours_applied} <small><em>{row.days_hours_applied>1?'days':'day'}</em></small></span>}</StyledTableCell>
                                            <StyledTableCell><em>{row.status === 'FOR REVIEW' ? <span style={{color:orange[900],fontSize:matches?'10px':'13px'}}>{row.status}</span>:<span style={{color:'green',fontSize:matches?'10px':'13px'}}>{row.status}</span>}</em></StyledTableCell>
                                            <StyledTableCell><em>{row.remarks}</em></StyledTableCell>

                                            <StyledTableCell align='center'>
                                            <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                            <Tooltip title = 'View Application'><IconButton color="primary" aria-label="view" onClick = {()=>previewPending(row)} size="small" className='custom-iconbutton' sx={{'&:hover': { bgcolor: blue[800], color: '#fff' }}}>
                                                <VisibilityOutlinedIcon />
                                            </IconButton>
                                            </Tooltip>
                                            {
                                                row.file_ids !==null || row.leave_type_id === 4
                                                ?
                                                JSON.parse(row.file_ids).map((row2,key)=>
                                                    <Tooltip title = {'View Attachment #'+(key+1)} key={key}><IconButton aria-label="viewfile" onClick = {()=>showFileAttachment(row2)} size="small" className='custom-iconbutton' sx={{color:blue[300],'&:hover':{color:'#fff',background:blue[300]}}}>
                                                        <AttachmentIcon  />
                                                    </IconButton>
                                                    </Tooltip>
                                                )
                                                :
                                                ''
                                            }
                                            {
                                                row.status === 'FOR REVIEW' || row.status === 'FOR UPDATING'
                                                ?
                                                null
                                                :
                                                <Tooltip title = 'Print Application Form' placement='top'><IconButton color='primary' size='small' onClick = {()=>printPending(row)} sx={{'&:hover':{color:'#fff',background:blue[800]}}} className='custom-iconbutton'><PrintIcon/></IconButton></Tooltip>
                                            }
                                            <Tooltip title = 'Delete Application'><span><IconButton aria-label="delete" color="error" size="small" sx={{'&:hover': { bgcolor: red[800], color: '#fff' }}} disabled = {row.status === 'FOR REVIEW' ? false:true} onClick = {()=>cancelApplication(row)} className='custom-iconbutton'><DeleteForever/></IconButton></span></Tooltip>
                                            </Box>

                                            </StyledTableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={pendingLeaveApplicationData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        {/* <DataTable
                            columns={pendingColumns}
                            data = {pendingLeaveApplicationData}
                            customStyles={pendingCustomStyles}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                            pagination
                            highlightOnHover
                        />  */}
                        </AccordionDetails>
                    </Accordion>
                    :
                    ''
                    }
                    {
                    appliedExtendedMaternity.length !==0
                    ?
                    <Accordion expanded={accordionExtendedMaternity} sx={{marginTop:'10px',width:'100%'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="pending-content"
                        id="extended-maternity-header"
                        onClick = {()=>setAccordionExtendedMaternity(!accordionExtendedMaternity)}
                        sx={{'&:hover':{background:'#f2f2f2'}}}
                        >
                        <ThemeProvider theme={headerTheme}>
                        <Typography color="#ff6c25" sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold'}}>Extended Maternity Application</Typography>
                        </ThemeProvider> &nbsp;
                        {
                            accordionExtendedMaternity
                            ?
                            ''
                            :
                            <Fade in={!accordionExtendedMaternity}>
                            <Badge badgeContent={appliedExtendedMaternity.length} color="primary" className = 'animate__animated animate__tada'>
                                <PendingIcon color="action" />
                            </Badge>
                            </Fade>
                        }
                        </AccordionSummary>
                        <AccordionDetails>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                       <StyledBalanceTableCell>
                                        Benefactor
                                       </StyledBalanceTableCell>
                                       <StyledBalanceTableCell>
                                        Allocated Days
                                       </StyledBalanceTableCell>
                                       <StyledBalanceTableCell>
                                        Status
                                       </StyledBalanceTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        appliedExtendedMaternity.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((row,key)=>
                                        <TableRow key = {key} hover>
                                            <StyledTableCell>
                                                {row.fname}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.allocation_number_days}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.status}
                                            </StyledTableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={appliedExtendedMaternity.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        {/* <DataTable
                            columns={pendingColumns}
                            data = {pendingLeaveApplicationData}
                            customStyles={pendingCustomStyles}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                            pagination
                            highlightOnHover
                        />  */}
                        </AccordionDetails>
                    </Accordion>
                    :
                    ''
                    }
                    {
                    requestedRescheduleData.length !==0
                    ?
                    <Accordion expanded={accordionReschedule} sx={{marginTop:'10px',width:'100%'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="reschedule-content"
                        id="requested-reschedule-header"
                        onClick = {()=>setAccordionReschedule(!accordionReschedule)}
                        sx={{'&:hover':{background:'#f2f2f2'}}}
                        >
                        <ThemeProvider theme={headerTheme}>
                            <Typography color={green[800]} sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold'}}>Requested Reschedule</Typography>
                        </ThemeProvider>
                         &nbsp;
                        {
                            accordionReschedule
                            ?
                            ''
                            :
                            <Fade in={!accordionReschedule}>
                            <Badge badgeContent={requestedRescheduleData.length} color="primary" className = 'animate__animated animate__tada'>
                                <PendingIcon color="action" />
                            </Badge>
                            </Fade>
                        }
                        </AccordionSummary>
                        <AccordionDetails>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                       <StyledBalanceTableCell>
                                        Leave Name
                                       </StyledBalanceTableCell>
                                       <StyledBalanceTableCell>
                                        Details
                                       </StyledBalanceTableCell>
                                       <StyledBalanceTableCell>
                                        Reason
                                       </StyledBalanceTableCell>
                                       <StyledBalanceTableCell>
                                        Status
                                       </StyledBalanceTableCell>
                                       <StyledBalanceTableCell>
                                        Action
                                       </StyledBalanceTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        requestedRescheduleData.slice(page*rowsPerPageReschedule,page*rowsPerPageReschedule+rowsPerPageReschedule).map((row,key)=>
                                        <TableRow key = {key} hover>
                                            <StyledTableCell>
                                                {row.leave_name}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {formatReschedDetails(row.details)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.reason}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <span style={{color:row.status === 'APPROVED'?'green':row.status === 'DISAPPROVED'?'red':'blue',fontWeight:'bold',fontStyle:'italic'}}>{row.status}</span>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title = 'Delete request'><span><IconButton color='error' disabled={row.status==='FOR REVIEW'?false:true} onClick={()=>handleDeleteMainReschedule(row,key)} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}}><DeleteForever/></IconButton></span></Tooltip>
                                            </StyledTableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={requestedRescheduleData.length}
                            rowsPerPage={rowsPerPageReschedule}
                            page={pageReschedule}
                            onPageChange={handleChangePageReschedule}
                            onRowsPerPageChange={handleChangeRowsPerPageReschedule}
                        />
                        </AccordionDetails>
                    </Accordion>
                    :
                    ''
                    }
                    {
                    requestedCancelledData.length !==0
                    ?
                    <Accordion expanded={accordionCancelled} sx={{marginTop:'10px',width:'100%'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="reschedule-content"
                        id="requested-cancelled-header"
                        onClick = {()=>setAccordionCancelled(!accordionCancelled)}
                        sx={{'&:hover':{background:'#f2f2f2'}}}
                        >
                        <ThemeProvider theme={headerTheme}>
                        <Typography color={green[800]} sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold',fontSize:matches?'.9rem':'auto'}}>Requested Cancellation</Typography>
                        </ThemeProvider> &nbsp;
                        {
                            accordionCancelled
                            ?
                            ''
                            :
                            <Fade in={!accordionCancelled}>
                            <Badge badgeContent={requestedCancelledData.length} color="primary" className = 'animate__animated animate__tada'>
                                <PendingIcon color="action" />
                            </Badge>
                            </Fade>
                        }
                        </AccordionSummary>
                        <AccordionDetails>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                       <StyledTableCell>
                                        Leave Name
                                       </StyledTableCell>
                                       <StyledTableCell>
                                        Date/s
                                       </StyledTableCell>
                                       <StyledTableCell>
                                        Reason
                                       </StyledTableCell>
                                       <StyledTableCell>
                                        Status
                                       </StyledTableCell>
                                       <StyledTableCell>
                                        Action
                                       </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        requestedCancelledData.slice(page*rowsPerPageCancelled,page*rowsPerPageCancelled+rowsPerPageCancelled).map((row,key)=>
                                        <TableRow key = {key} hover>
                                            <StyledTableCell>
                                                {row.leave_type_name}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {formatCancelledDetails(row.date_details)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.reason}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <span style={{color:row.status === 'APPROVED'?'green':row.status === 'DISAPPROVED'?'red':'blue',fontWeight:'bold',fontStyle:'italic'}}>{row.status}</span>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title = 'Delete request'><span><IconButton color='error' disabled={row.status==='FOR REVIEW'?false:true} onClick={()=>handleDeleteCancelled(row,key)} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}}><DeleteForever/></IconButton></span></Tooltip>
                                            </StyledTableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={requestedCancelledData.length}
                            rowsPerPage={rowsPerPageCancelled}
                            page={pageCancelled}
                            onPageChange={handleChangePageCancelled}
                            onRowsPerPageChange={handleChangeRowsPerPageCancelled}
                        />
                        </AccordionDetails>
                    </Accordion>
                    :
                    ''
                    }
                    {historyLeaveApplicationData.length !==0
                    ?
                    <Accordion expanded={accordionHistory} sx={{marginTop:'10px',width:'100%'}}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="history-content"
                        id="history-header"
                        onClick = {()=>setAccordionHistory(!accordionHistory)}
                        sx={{'&:hover':{background:'#f2f2f2'}}}
                        >
                        <ThemeProvider theme={headerTheme}>
                        <Typography color="#2196f3" sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',fontWeight:'bold'}}>Application History</Typography>
                        </ThemeProvider> &nbsp;
                        {accordionHistory
                        ?
                        ''
                        :
                        <Fade in={!accordionHistory}>
                            <Badge badgeContent={historyLeaveApplicationData.length} color="primary" className = 'animate__animated animate__tada'>
                            <PendingIcon color="action"/>
                            </Badge>
                        </Fade>
                        }
                        
                        </AccordionSummary>
                        <AccordionDetails>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Date Filed</StyledTableCell>
                                        <StyledTableCell>Inclusive Dates</StyledTableCell>
                                        <StyledTableCell>Type of Leave</StyledTableCell>
                                        <StyledTableCell>Details of Leave</StyledTableCell>
                                        <StyledTableCell>No. of Days/Hours Applied</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Remarks</StyledTableCell>
                                        <StyledTableCell>Disapproved by</StyledTableCell>
                                        <StyledTableCell align='center'>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        historyLeaveApplicationData.slice(pageHistory*rowsPerPageHistory,pageHistory*rowsPerPageHistory+rowsPerPageHistory).map((row,key)=>
                                        <TableRow key = {key} hover>
                                            <StyledTableCell>{moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}</StyledTableCell>
                                            <StyledTableCell>{row.inclusive_dates_text}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type_details}</StyledTableCell>
                                            <StyledTableCell>{row.leave_type_id === 14?<span>{row.days_hours_applied} <small><em>hr/s</em> </small></span>:<span>{row.days_hours_applied} <small><em>day/s</em></small></span>}</StyledTableCell>
                                            <StyledTableCell>{<em>{row.status === 'FOR REVIEW' ? <span style={{color:'orange',fontSize:matches?'10px':'13px'}}>{row.status}</span>:row.status === 'DISAPPROVED'?<span style={{color:'red',fontSize:matches?'10px':'13px'}}>{row.status}</span>:<span style={{color:'green',fontSize:matches?'10px':'13px'}}>{row.status}</span>}</em>}</StyledTableCell>
                                            <StyledTableCell><em>{row.remarks}</em></StyledTableCell>
                                            <StyledTableCell><em>{row.disapproved_type}</em></StyledTableCell>
                                            <StyledTableCell align='center'>
                                            <Box sx={{display:'flex',gap:1}}>
                                            <Tooltip title = 'Print Application Form' placement='top'><IconButton color='primary' size='small' onClick = {()=>printPending(row)} sx={{'&:hover':{color:'#fff',background:blue[800]}}} className='custom-iconbutton'><PrintIcon/></IconButton></Tooltip>

                                            <Tooltip title='Request to reschedule leave'><span><IconButton color='info' className='custom-iconbutton' size='small' sx={{'&:hover':{color:'#fff',background:blue[500]}}} disabled = {row.status ==='DISAPPROVED'?true:false} onClick={(event)=>handleOpenReschedPopover(event,row)} aria-describedby={row.leave_application_id}><EditCalendarIcon/></IconButton></span></Tooltip>

                                            <Tooltip title='Cancel Leave'><span><IconButton color='error' className='custom-iconbutton' size='small' sx={{'&:hover':{color:'#fff',background:red[800]}}} disabled = {row.status ==='DISAPPROVED'?true:false} onClick={()=>handleCancelAppplication(row)}><CancelIcon/></IconButton></span></Tooltip>
                                            </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, 100]}
                                        count={historyLeaveApplicationData.length}
                                        rowsPerPage={rowsPerPageHistory}
                                        page={pageHistory}
                                        onPageChange={handleChangePageHistory}
                                        onRowsPerPageChange={handleChangeRowsPerPageHistory}
                                    />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        <Popover
                            id={reschedId}
                            open={openReschedPopover}
                            anchorEl={anchorElResched}
                            onClose={handleCloseReschedPopover}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                        >
                            <Box sx={{p:1,display:'flex',flexDirection:'column',gap:1}}>
                                <Button variant='contained' color='success' onClick={handleViewRequestedReschedule}>View requested reschedule</Button>
                                <Button variant='contained' onClick={checkApplicableReschedule}>Request reschedule</Button>
                            </Box>
                        </Popover>
                        {/* <DataTable
                            columns={historyColumns}
                            data = {historyLeaveApplicationData}
                            customStyles={historyColumnsStyles}
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 15, 25, 50]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Records per page:',
                                rangeSeparatorText: 'out of',
                            }}
                            pagination
                            highlightOnHover
                        />  */}
                        <MediumModal open = {openCancelModal} close = {handleCloseCancelModal} title='Requesting cancellation of leave application'>
                            <CancelLeaveApplication data = {selectedCancelData} close={handleCloseCancelModal} setData = {setRequestedCancelledData}/>
                        </MediumModal>
                        {/* <Modal
                            open={openCancelModal}
                            onClose={handleCloseCancelModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={styleCancelModal}>
                            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',background:blue[800],p:1}}>
                                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color:'#fff'}}>
                                Requesting cancellation of leave application
                                </Typography>
                                <Tooltip><IconButton size='small' color='error' sx={{background:'#fff','&:hover':{background:'#e5e5e5'}}} onClick={handleCloseCancelModal}><CloseIcon/></IconButton></Tooltip>
                            </Box>
                            <Box sx={{p:2}}>
                                <CancelLeaveApplication data = {selectedCancelData} close={handleCloseCancelModal} setData = {setRequestedCancelledData}/>
                            </Box>

                            </Box>
                        </Modal> */}
                        </AccordionDetails>
                    </Accordion>
                    :
                    ''
                    }
                </Grid>
            </Fade>
            }
           
        <Dialog
            fullScreen
            // maxWidth='lg'
            // fullWidth
            sx={{width:matches?'100%':'40vw',height:'100%',right:0,left:'auto'}}
            open={openApplicationDialog}
            // onClose={()=>setOpenApplicationDialog(false)}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'sticky',top:0 ,zIndex:'2'}}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={()=>setOpenApplicationDialog(false)}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 ,fontSize:matches?'1.1rem':'1.2rem'}} variant='h6' component="div">
                Application for Leave
                </Typography>
                <Button autoFocus color="inherit" onClick={()=>setOpenApplicationDialog(false)}>
                Close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
            <LeaveApplicationForm
                presentDaysData = {presentDaysData}
                allTypesOfLeave = {allTypesOfLeave}
                ctoInfo = {ctoInfo}
                employeeInfo = {employeeInfo}
                authInfo = {authInfo}
                signatory = {signatory}
                onProcess = {onProcess}
                balanceData = {balanceData}
                officeAO = {officeAO}
                officeHead = {officeHead}
                alreadyAppliedDays = {alreadyAppliedDays}
                availableSPL = {availableSPL}
                onprocessSPL = {onprocessSPL}
                typeOfLeaveData = {typeOfLeaveData}
                allTypeOfLeaveData = {allTypeOfLeaveData}
                availableVL = {availableVL}
                availableSL = {availableSL}
                availableCOC = {availableCOC-totalForReview}
                slRangeDatesWithPay = {slRangeDatesWithPay}
                slNoPay = {slNoPay}
                slWithPay = {slWithPay}

                updatesetPendingLeaveApplicationData = {updatesetPendingLeaveApplicationData}
                updatesetavailableVL = {updatesetavailableVL}
                updatesetavailableSL = {updatesetavailableSL}
                updatesetavailableCOC = {updatesetavailableCOC}
                updatesetOpen = {updatesetOpen}
                updatesetonProcess = {updatesetonProcess}
                updatesetAvailabelSPL = {updatesetAvailabelSPL}
                updatesetOnprocessSPL = {updatesetOnprocessSPL}
                updatesetAlreadyAppliedDays = {updatesetAlreadyAppliedDays}
                setTotalForReview = {setTotalForReview}
                maternityBal = {maternityBal}
                setMaternityBal = {setMaternityBal}
                setMaternityOnProcess = {setMaternityOnProcess}
                alreadyAppliedDaysPeriod = {alreadyAppliedDaysPeriod}
                SLPReasonsData = {SLPReasonsData}
                close = {()=>setOpenApplicationDialog(false)}
                vl_bal={balanceData.length!==0?balanceData[0].vl_bal:0}
            />
            </Box>
        </Dialog>
        <Dialog
            fullScreen
            // maxWidth='lg'
            // fullWidth
            sx={{width:matches?'100%':'40vw',height:'100%',right:0,left:'auto'}}
            open={openEarnMaternityCreditsDialog}
            // onClose={()=>setOpenApplicationDialog(false)}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'sticky',top:0 }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={()=>setOpenEarnMaternityCreditsDialog(false)}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Earn Maternity Credits
                </Typography>
                <Button autoFocus color="inherit" onClick={()=>setOpenEarnMaternityCreditsDialog(false)}>
                Close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
                <EarnMaternityCreditsDialog mainClose = {()=>setOpenEarnMaternityCreditsDialog(false)}/>
            </Box>
        </Dialog>
        <Modal
            open={open}
            // onClose={()=> setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            {/* <CancelOutlinedIcon/> */}
            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpen(false)}/>

            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Application for Leave
            </Typography>
            <Box sx={{mt:2,pt:0,pl:matches?2:4,pr:matches?2:4,pb:2}}>
            <LeaveApplicationForm
                employeeInfo = {employeeInfo}
                authInfo = {authInfo}
                signatory = {signatory}
                onProcess = {onProcess}
                balanceData = {balanceData}
                officeAO = {officeAO}
                officeHead = {officeHead}
                alreadyAppliedDays = {alreadyAppliedDays}
                availableSPL = {availableSPL}
                onprocessSPL = {onprocessSPL}
                typeOfLeaveData = {typeOfLeaveData}
                allTypeOfLeaveData = {allTypeOfLeaveData}
                availableVL = {availableVL}
                availableSL = {availableSL}
                availableCOC = {availableCOC}
                slRangeDatesWithPay = {slRangeDatesWithPay}
                slNoPay = {slNoPay}
                slWithPay = {slWithPay}

                updatesetPendingLeaveApplicationData = {updatesetPendingLeaveApplicationData}
                updatesetavailableVL = {updatesetavailableVL}
                updatesetavailableSL = {updatesetavailableSL}
                updatesetavailableCOC = {updatesetavailableCOC}
                updatesetOpen = {updatesetOpen}
                updatesetonProcess = {updatesetonProcess}
                updatesetAvailabelSPL = {updatesetAvailabelSPL}
                updatesetOnprocessSPL = {updatesetOnprocessSPL}
                updatesetAlreadyAppliedDays = {updatesetAlreadyAppliedDays}
            />
            </Box>
            {/* <Button variant="contained" color="success" size="large" fullWidth ><CheckIcon/> &nbsp; Confirm Update</Button>
            <br/>
            <Button variant="contained" color="error" size="large" fullWidth ><CancelIcon/> &nbsp; Cancel</Button> */}
            

            </Box>

        </Modal>
        
        <Modal
            open={previewModal}
            onClose={()=> setPreviewModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={previewStyle}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setPreviewModal(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Preview leave application
                </Typography>
                <Box sx={{maxHeight:'60vh',overflowY:'scroll',mt:2,mb:2}}>
                <div style = {{position:'relative'}}>
                {previewPendingInfo.leave_type_id === 14
                ?
                <PreviewCTOApplicationForm info={employeeInfo} auth_info = {authInfo} pendinginfo = {previewPendingInfo} bal_before_review = {previewPendingInfo.bal_before_review} bal_after_review = {previewPendingInfo.bal_after_review}coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} CTOHours = {previewPendingInfo.days_hours_applied} cto_dates = {previewPendingInfo.inclusive_dates_text} date_of_filing ={previewPendingInfo.date_of_filing} status = {previewPendingInfo.status} cto_info = {ctoInfo} office_head={officeHead}  office_ao = {officeAO}/>
                :
                <PreviewLeaveApplication data={allTypeOfLeaveData} auth_info = {authInfo} leaveType = {previewPendingInfo.leave_type_id} info={employeeInfo} pendinginfo = {previewPendingInfo} applied_days = {previewPendingInfo.days_hours_applied} leaveDetails = {previewPendingInfo.details_of_leave_id} specifyDetails = {previewPendingInfo.specify_details} inclusiveDates = {previewPendingInfo.inclusive_dates_text} balance = {pendingBalance} signatory={signatory} vl = {balanceData.length !==0 ? balanceData[0].vl_bal:0} sl = {balanceData.length !==0 ? balanceData[0].sl_bal:0} coc = {balanceData.length !==0 ? balanceData[0].coc_bal:0} office_head = {officeHead} office_ao = {officeAO} commutation = {previewPendingInfo.commutation} status = {previewPendingInfo.status} maternity_days = {previewPendingInfo.days_with_pay}  asOf = {balanceData.length !==0 ?balanceData[0].as_of:new Date()}/>
                }
                
                </div>

                </Box>

            </Box>
        </Modal>
        <Modal
            open={bugsModal}
            onClose={()=> setBugsModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={bugsModalStyle}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setBugsModal(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Submit Issues and Concerns
                </Typography>
                <Box sx={{m:4}}>
                    <BugsForm close={()=> setBugsModal(false)}/>
                </Box>

            </Box>
        </Modal>
        <Dialog
            fullScreen
            open={openLeaveLedgerDialog}
            // onClose={()=>setOpenApplicationDialog(false)}
            TransitionComponent={Transition2}
        >
            <AppBar sx={{ position: 'sticky',top:0 }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={()=>setOpenLeaveLedgerDialog(false)}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Employee's Leave Ledger Card
                </Typography>
                <Button autoFocus color="inherit" onClick={()=>setOpenLeaveLedgerDialog(false)}>
                Close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
            <LeaveLedgerModal close2={()=> setLeaveLedgerModal(false)} vl = {availableVL} sl={availableSL} coc={availableCOC} info={employeeInfo} close= {()=>setOpenLeaveLedgerDialog(false)}/>
            </Box>
        </Dialog>
        <Modal
            open={openRequestDialog}
            onClose={()=> setOpenRequestDialog(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={requestModalStyle}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenRequestDialog(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Daily Earned Leaves Details
                </Typography>
                <Box sx={{m:1,pb:1,maxHeight:matches?'50vh':'70vh',overflowY:'auto'}}>
                    <RequestDailytEarnedLeave balance = {balanceData} close = {()=> setOpenRequestDialog(false)}/>
                </Box>

            </Box>
        </Modal>
        <Modal
            open={openReschedModal}
            onClose={handleCloseReschedModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleReschedModal}>
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Reschedule leave date/s
                    </Typography>
                    <Tooltip title='Close'><IconButton size='small' color='error' onClick={handleCloseReschedModal}><CloseIcon/></IconButton></Tooltip>
                </Box>
                <Box>
                    <ReschedDateModal data = {reschedDateData} handleSave = {handleSaveReschedLeave} close={handleCloseReschedModal}/>
                </Box>
            </Box>
        </Modal>

        <Modal
            open={openViewReschedModal}
            onClose={handleCloseViewReschedModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleViewReschedModal}>
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Requested for reschedule
                    </Typography>
                    <Tooltip title='Close'><IconButton size='small' color='error' onClick={handleCloseViewReschedModal}><CloseIcon/></IconButton></Tooltip>
                </Box>
            
                <Box>
                    <ViewRequestedReschedModal data = {selectedReschedPopover} handleDeleteReschedule = {handleDeleteReschedule} setRequestedRescheduleData = {setRequestedRescheduleData}/>
                </Box>
            </Box>
        </Modal>

        {/* <ReactToPrint
            trigger={() => <button>Preview</button>}
            content={() => componentRef.current}
        /> */}
        {/* <div style={{ display: "none" }}><PreviewLeaveApplicationForm ref={componentRef} /></div> */}
        
        {/* <ToastContainer /> */}

        <div style={{ display: "none" }}><PreviewLeaveApplicationForm ref={printLeaveRef} auth_info={authInfo} data={allTypesOfLeave} leaveType = {printPendingInfo.leave_type_id} info={employeeInfo} pendinginfo = {printPendingInfo} applied_days = {printPendingInfo.days_hours_applied} leaveDetails = {printPendingInfo.details_of_leave_id} specifyDetails = {printPendingInfo.specify_details} inclusiveDates = {printPendingInfo.inclusive_dates_text} balance = {pendingBalance} signatory={signatory} vl = {printPendingInfo.vl_before_review} sl = {printPendingInfo.sl_before_review} coc = {printPendingInfo.bal_before_review} office_head = {officeHead} office_ao = {officeAO} commutation = {printPendingInfo.commutation} status = {printPendingInfo.status} maternity_days = {printPendingInfo.days_with_pay}  asOf = {balanceData.length !==0 ?balanceData[0].as_of:new Date()}/></div>
        
        <div style={{ display: "none" }}>
            <PreviewCTOApplicationForm ref={printLeaveCTORef} auth_info={authInfo} info={employeeInfo} pendinginfo = {printPendingInfo} bal_before_review = {printPendingInfo.bal_before_review} bal_after_review = {printPendingInfo.bal_after_review} coc = {printPendingInfo.bal_before_review} CTOHours = {printPendingInfo.days_hours_applied} cto_dates = {printPendingInfo.inclusive_dates_text} date_of_filing ={employeeInfo.date_of_filing} status = {printPendingInfo.status} cto_info = {ctoInfo} office_head={officeHead}  office_ao = {officeAO}/>
        </div>
        
        </Box>
    )
}
