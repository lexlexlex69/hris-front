import React,{useState,useEffect,useRef} from 'react';
import {Box,Grid,Fade,Autocomplete,TextField,CircularProgress,Typography,Backdrop,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TableFooter,Paper,IconButton,Tooltip,Checkbox,Modal, Button,Dialog ,AppBar , Toolbar , Menu,MenuItem } from '@mui/material';
import DashboardLoading from '../../loader/DashboardLoading';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
//icons
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../../../.././assets/img/bl.png'

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import moment from 'moment';

import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
//custom css
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { getEmpDTRAPIForRATU, getEmpListSRATU, getSRATUSignatories, getUploadedLetterHead } from './SRATURequest';
import SRATUView from './SRATUView';
import { getFileAPI, preViewFileAPI } from '../../../../viewfile/ViewFileRequest';
import { uploadLetterHead } from '../MRATU/MRATURequest';
import SearchEmployee from './Modal/SearchEmployee';
import { SRATUPrint } from './SRATUPrint';
import { api_url } from '../../../../request/APIRequestURL';
import { SRATUViewJO } from './SRATUViewJO';
import SRATUPrintJO from './SRATUPrintJO';
import { APIError } from '../../customstring/CustomString';
const Input = styled('input')({
    display: 'none',
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SRATU(){
    // media query
    const navigate = useNavigate()

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        borderRadius:'5px'

    };
    const modalSignatoryStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 2,
        borderRadius:'5px'
    };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        // fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        // fontSize: 13,
        },
    }));
    const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[700],
        color: theme.palette.common.white,
        // fontSize: 15,
        },
        [`&.${tableCellClasses.body}`]: {
        // fontSize: 13,
        },
    }));
    const [isLoading,setIsLoading] = useState(true)
    const [fetchLoading,setFetchLoading] = useState(false)
    const [selectedMonthYear,setSelectedMonthYear] = useState('')
    const [cosData,setCosData] = useState([])
    const [joData,setJoData] = useState([])
    const [letterHeadID,setLetterHeadID] = useState('');
    const [letterHeadReports,setLetterHeadReports] = useState('');
    const [sratuPreparedByName,setSratuPreparedByName] = useState('');
    const [sratuPreparedByPos,setSratuPreparedByPos] = useState('');
    const [sratuDeptHeadName,setSratuDeptHeadName] = useState('');
    const [sratuDeptHeadPos,setSratuDeptHeadPos] = useState('');
    useEffect(()=>{
        checkPermission(54)
        .then((response)=>{
            setIsLoading(false)
            if(response.data){
                // getOffices()
                // .then(res=>{
                //     console.log(res.data)
                //     setOfficeData(res.data)
                // }).catch(err=>{
                //     console.log(err)
                // })
                
                /**
                Get uploaded letter head
                */
                getUploadedLetterHead()
                .then(res=>{
                    if(res.data){
                        setLetterHeadID(res.data.file_id)
                        getFileAPI(res.data.file_id)
                        .then(res=>{
                            setLetterHeadReports(res)
                        }).catch(err=>{
                            Swal.fire({
                                icon:'error',
                                title:err
                            })
                        })
                    }
                }).catch(err=>{
                    APIError(err)
                    console.log(err)
                })
                getSRATUSignatories()
                .then(res=>{
                    setSratuPreparedByName(res.data.prepared_by_name);
                    setSratuPreparedByPos(res.data.prepared_by_pos);
                    setSratuDeptHeadName(res.data.dept_head_name);
                    setSratuDeptHeadPos(res.data.dept_head_pos);
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
            APIError(error)
        })
    },[])
    const handleSelectMonthYear = (val)=>{
        setSelectedMonthYear(val)
    }
    const [isGeneratedReports,setIsGeneratedReports] = useState(false)
    const handleGenerateReports = ()=>{
        if(typeof(selectedMonthYear[0]) === 'undefined' || typeof(selectedMonthYear[1]) === 'undefined'){
            Swal.fire({
                icon:'error',
                title:'Oops...',
                html:'Please select complete the date period !'
            })
        }else{
            setFetchLoading(true)
            var firstDay = selectedMonthYear[0].format('YYYY-MM-DD');
            var lastDay =  selectedMonthYear[1].format('YYYY-MM-DD');
            
            getEmpListSRATU()
            .then(res=>{
                let cos_list = [];
                let jo_list = [];
                let list = [];
                res.data.cos.forEach(el=>{
                    cos_list.push({
                        emp_no:el.emp_no,
                        rate:el.actl_salary,
                        fname:el.emp_fname,
                        lname:el.emp_lname,
                        mname:el.emp_mname
                    })
                })
                res.data.jo.forEach(el=>{
                    jo_list.push({
                        emp_no:el.emp_no,
                        rate:el.actl_salary,
                        fname:el.emp_fname,
                        lname:el.emp_lname,
                        mname:el.emp_mname
                    })
                })
                var t_cos_data = {
                    emp_data:cos_list,
                    from:firstDay,
                    to:lastDay,
                    key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                    api_url:api_url
                }
                getEmpDTRAPIForRATU(t_cos_data)
                .then(res2=>{
                    // console.log(res2.data)
                    var t_data = [];
                    if(res2.data.code === 200){
                        res2.data.data.forEach(el=>{
                            var total_late = 0;
                            var total_undertime = 0;
                            var total_absent = 0;
                            var late_hours = 0;
                            var late_minutes = 0;
                            var undertime_hours = 0;
                            var undertime_minutes = 0;
                            var total_late_undertime = 0;
                            var total_late_undertime_hours = 0;
                            var total_late_undertime_minutes = 0;
                            var total = 0;
                            if(el.data.length>0){
                                el.data.forEach(el2=>{
                                    total_late+=parseInt(el2.late_minutes);
                                    total_undertime+=parseInt(el2.under_time);
                                    total_absent+=parseInt(el2.absent_day)
                                })
                                
                                total_late_undertime = total_late+total_undertime;
                                total_late_undertime_hours = parseInt(total_late_undertime/ 60);
                                total_late_undertime_minutes = parseInt(total_late_undertime)% 60;
                                var t_late_undertime_days =  parseInt(total_late_undertime_hours/8)

                                if(t_late_undertime_days>0){
                                    total_absent+=t_late_undertime_days;
                                    total_late_undertime_hours = total_late_undertime_hours-(t_late_undertime_days*8);
                                    total_late_undertime_minutes = total_late_undertime_minutes-(total_late_undertime*60);
                                    total = (total_late_undertime_hours*60)+total_late_undertime_minutes
                                }else{
                                    total = total_late_undertime
                                }

                                t_data.push({
                                    fname:el.fname,
                                    mname:el.mname,
                                    lname:el.lname,
                                    emp_no:el.emp_no,
                                    rate:el.rate,
                                    total_absent:total_absent,
                                    total_late_undertime_hours:total_late_undertime_hours,
                                    total_late_undertime_minutes:total_late_undertime_minutes,
                                    total_late:total_late,
                                    total_undertime:total_undertime,
                                    total_late_undertime:total_late_undertime,
                                    total:total
                                })
                            }else{
                                t_data.push({
                                    fname:el.fname,
                                    mname:el.mname,
                                    lname:el.lname,
                                    emp_no:el.emp_no,
                                    rate:el.rate,
                                    total_absent:0,
                                    total_late_undertime_hours:0,
                                    total_late_undertime_minutes:0,
                                    total_late:0,
                                    total_undertime:0,
                                    total_late_undertime:0,
                                    total:total

                                })
                            }
                        })
                    }
                    
                    setCosData(t_data)
                    setFetchLoading(false)
                }).catch(err=>{
                    // window.open(api_url)
                    // console.log(err)
                    APIError(err)
                    setFetchLoading(false)

                })
                var t_jo_data = {
                    emp_data:jo_list,
                    from:firstDay,
                    to:lastDay,
                    key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                    api_url:api_url
                }
                getEmpDTRAPIForRATU(t_jo_data)
                .then(res2=>{
                    var t_data = [];
                    if(res2.data.code === 200){
                        res2.data.data.forEach(el=>{
                            var total_late = 0;
                            var total_undertime = 0;
                            var total_absent = 0;
                            var late_hours = 0;
                            var late_minutes = 0;
                            var undertime_hours = 0;
                            var undertime_minutes = 0;
                            var total_late_undertime = 0;
                            var total_late_undertime_hours = 0;
                            var total_late_undertime_minutes = 0;
                            var total = 0;
                            if(el.data.length>0){
                                el.data.forEach(el2=>{
                                    total_late+=parseInt(el2.late_minutes);
                                    total_undertime+=parseInt(el2.under_time);
                                    total_absent+=parseInt(el2.absent_day)
                                })
                                
                                total_late_undertime = total_late+total_undertime;
                                total_late_undertime_hours = parseInt(total_late_undertime/ 60);
                                total_late_undertime_minutes = parseInt(total_late_undertime)% 60;
                                var t_late_undertime_days =  parseInt(total_late_undertime_hours/8)

                                
                                // console.log(total_late_undertime)
                                // console.log(t_late_undertime_days)
                                if(t_late_undertime_days>0){
                                    total_absent+=t_late_undertime_days;
                                    total_late_undertime_hours = total_late_undertime_hours-(t_late_undertime_days*8);
                                    total_late_undertime_minutes = total_late_undertime_minutes-(total_late_undertime*60);
                                    total = (total_late_undertime_hours*60)+total_late_undertime_minutes
                                    // console.log(total)
                                }else{
                                    total = total_late_undertime
                                }

                            
                                t_data.push({
                                    fname:el.fname,
                                    mname:el.mname,
                                    lname:el.lname,
                                    emp_no:el.emp_no,
                                    rate:el.rate,
                                    total_absent:total_absent,
                                    total_late_undertime_hours:total_late_undertime_hours,
                                    total_late_undertime_minutes:total_late_undertime_minutes,
                                    total_late:total_late,
                                    total_undertime:total_undertime,
                                    total_late_undertime:total_late_undertime,
                                    total:total
                                })
                            }else{
                                t_data.push({
                                    fname:el.fname,
                                    mname:el.mname,
                                    lname:el.lname,
                                    emp_no:el.emp_no,
                                    rate:el.rate,
                                    total_absent:0,
                                    total_late_undertime_hours:0,
                                    total_late_undertime_minutes:0,
                                    total_late:0,
                                    total_undertime:0,
                                    total_late_undertime:0,
                                    total:total

                                })
                            }
                            
                            
                        })
                    }
                    
                    setJoData(t_data)
                    setFetchLoading(false)
                    setIsGeneratedReports(true)


                }).catch(err=>{
                    // window.open(api_url)
                    console.log(err)
                    APIError(err)
                    setFetchLoading(false)

                })
            }).catch(err=>{
                console.log(err)
            })
        }
    }
    const printReportRefCOS = useRef();
    const printReportRefJO = useRef();
   
    const printReportCOS  = useReactToPrint({
        content: () => printReportRefCOS.current,
        documentTitle: 'SRATU'

    });
    const printReportJO  = useReactToPrint({
        content: () => printReportRefJO.current,
        documentTitle: 'SRATU'

    });
    const [openLetterHead,setOpenLetterHead] = useState(false);
    const [openSignatorySettings,setOpenSignatorySettings] = useState(false);
    const [openSearchEmployee,setOpenSearchEmployee] = useState(false);
    const handleCloseLetterHead = () =>{
        setOpenLetterHead(false)
    }
    const handleCloseSignatory = () =>{
        setOpenSignatorySettings(false)
    }
    const handleLetterHead = ()=>{
        /**
        Get letter head
         */
        getUploadedLetterHead()
        .then(res=>{
            // console.log(res.data)
            if(res.data){
                setLetterHeadID(res.data.file_id)
                preViewFileAPI(res.data.file_id)
                .then(res=>{
                    setLetterHeadFile(res)

                }).catch(err=>{
                    Swal.fire({
                        icon:'error',
                        title:err
                    })
                })
            }else{
                setOpenLetterHead(true)
            }
            setOpenLetterHead(true)

        }).catch(err=>{
            console.log(err)
        })
        
        
    }
    const [letterHeadFile,setLetterHeadFile] = useState('');
    const [letterHeadFileName,setLetterHeadFileName] = useState('');

    const handleFile = (e) =>{
        var file = e.target.files[0].name;
        setLetterHeadFileName(file)
        var extension = file.split('.').pop();
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                file = fileReader.result;
                setLetterHeadFile(file)
                // setsingleFile(fileReader.result)
            }
        }else{
            file = '';
            setLetterHeadFile(file)

            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload Image file.'
            })
        }
    }
    const handleSaveLetterHead = () =>{
        Swal.fire({
            icon:'info',
            title:'Uploading File',
            html:'Please wait...',
            allowOutsideClick:false,
            allowEscapeKey:false
        })
        Swal.showLoading();
        var t_data = {
            file:letterHeadFile
        }
        uploadLetterHead(t_data)
        .then(res=>{
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                setLetterHeadReports(letterHeadFile)
                setLetterHeadFileName('')
                setLetterHeadFile('')
                handleCloseLetterHead()
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.fire({
                    icon:'error',
                    title:err
                })
            console.log(err)
        })
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleSignatories = ()=>{
        setOpenSignatorySettings(true)
    }
    const [infoAction,setInfoAction] = useState(0);

    const handleSetSignatories = (val)=>{
        setInfoAction(val)
        setOpenSearchEmployee(true)
    }
    const periodOf = ()=>{
        var t_date = [];
        var year;
        if(selectedMonthYear.length !==0){
            selectedMonthYear.forEach((el,key)=>{
                if(key === 0){
                    t_date.push(el.format('MMMM')+ ' ' + selectedMonthYear[key].format('DD - '));
                }else{
                    if(key === selectedMonthYear.length-1){
                        if(el.format('MMMM') === selectedMonthYear[key-1].format('MMMM')){
                            t_date.push(selectedMonthYear[key].format('DD,'));
                        }else{
                            t_date.push(el.format('MMMM')+ ' ' + selectedMonthYear[key].format('DD,'));
                        }
                    }else{
                        if(el.format('MMMM') === selectedMonthYear[key-1].format('MMMM')){
                            t_date.push(selectedMonthYear[key].format('DD'));
                        }else{
                            t_date.push(el.format('MMMM')+ ' ' + selectedMonthYear[key].format('DD - '));
                        }
                    }
                    
                }
                year = el.format('YYYY')
            })

            var t_new_arr = [... new Set(t_date)]
            return (
                <span><u>{t_new_arr} {year}</u></span>
            );
        }
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading/>
                :
                <Fade in>
                    <Grid container>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={fetchLoading}
                            // onClick={loadingFilter}
                        >
                            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <Typography>Loading records. Please wait...</Typography>

                                <CircularProgress color="inherit" />

                            </Box>
                        </Backdrop>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='Summary Report on Absences, Tardiness and Undertime'/>
                        </Grid> */}
                        
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',gap:1}}>
                            <DatePicker
                                value = {selectedMonthYear}
                                onChange={handleSelectMonthYear}
                                range
                                plugins={[
                                    <DatePanel />
                                ]}
                                inputClass="custom-input"
                                rangeHover
                                placeholder='Date Period'
                                />
                            <Tooltip title='Generate reports'><Button color='primary' variant='contained' startIcon={<AssessmentIcon/>} onClick={handleGenerateReports} className='custom-roundbutton'>Generate</Button></Tooltip>
                            <Tooltip title='Report Settings (Letterhead/Signatories)' placement='top'>
                            <IconButton
                                id="basic-button"
                                aria-controls={openMenu ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenu ? 'true' : undefined}
                                onClick={handleClickMenu}
                                className='custom-iconbutton'
                            >
                                <SettingsIcon/>
                            </IconButton>
                            </Tooltip>

                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleLetterHead}>Letterhead</MenuItem>
                                <MenuItem onClick={handleSignatories}>Signatories</MenuItem>
                            </Menu>

                            <Modal
                                open={openLetterHead}
                                onClose={handleCloseLetterHead}
                                aria-labelledby="parent-modal-title"
                                aria-describedby="parent-modal-description"
                            >
                                <Box sx={{ ...modalStyle, width: 400 }}>
                                <h4 id="parent-modal-title">Letterhead Settings</h4>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                        <span>{letterHeadFileName}</span>
                                        <label htmlFor={"contained-button-file"} style={{display:'flex',justifyContent:'flex-end'}}>
                                        <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange = {(value)=>handleFile(value)}/>
                                        <Tooltip title='Upload Letter Head'><IconButton color='primary' className='custom-iconbutton' component="span"><UploadIcon/></IconButton></Tooltip>
                                        </label>
                                        {/* <Tooltip title='Update Letter Head'><IconButton color='primary' className='custom-iconbutton'><UploadIcon/></IconButton></Tooltip> */}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <img src={letterHeadFile} width='100%' height='100%'/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <hr/>
                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                                        <Button variant='contained' color='success' className='custom-roundbutton' size='small' onClick={handleSaveLetterHead}>Save</Button>
                                        <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCloseLetterHead}>Cancel</Button>
                                    </Grid>
                                </Grid>
                                </Box>
                            </Modal>
                            <Modal
                                open={openSignatorySettings}
                                onClose={handleCloseSignatory}
                                aria-labelledby="parent-modal-title"
                                aria-describedby="parent-modal-description"
                            >
                                <Box sx={{ ...modalSignatoryStyle, width: 400 }}>
                                <h4 id="parent-modal-title">Signatories Settings</h4>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography sx={{fontSize:'1.1rem',fontWeight:'bold'}}>Prepared By:</Typography>
                                    </Grid>
                                     <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <Typography>
                                        {sratuPreparedByName} <br/>
                                        {sratuPreparedByPos}
                                        </Typography>

                                        <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick = {()=>handleSetSignatories(1)}><EditIcon/></IconButton></Tooltip>
                                    </Grid>

                                    {/* <Grid item xs={12}>
                                        <Typography sx={{fontSize:'1.1rem',fontWeight:'bold'}}>Department Head:</Typography>
                                    </Grid>
                                     <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <Typography>
                                        {sratuDeptHeadName} <br/>
                                        {sratuDeptHeadPos}
                                        </Typography>

                                        <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick = {()=>handleSetSignatories(2)}><EditIcon/></IconButton></Tooltip>
                                    </Grid> */}
                                    <Grid item xs={12}>
                                        <hr/>

                                    </Grid>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                                        {/* <Button variant='contained' color='success' className='custom-roundbutton' size='small' onClick={handleSaveSignaty}>Save</Button> */}
                                        <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={handleCloseSignatory}>Cancel</Button>
                                    </Grid>
                                </Grid>
                                </Box>
                            </Modal>
                            <Modal
                                open={openSearchEmployee}
                                onClose={()=>setOpenSearchEmployee(false)}
                                aria-labelledby="parent-modal-title"
                                aria-describedby="parent-modal-description"
                            >
                                <Box sx={{ ...modalSignatoryStyle,width:400}}>
                                <h4 id="parent-modal-title">Search Employee</h4>
                                    <SearchEmployee setOpenSearchEmployee = {setOpenSearchEmployee} infoAction = {infoAction} setSratuPreparedByName = {setSratuPreparedByName} setSratuPreparedByPos = {setSratuPreparedByPos} setSratuDeptHeadName = {setSratuDeptHeadName} setSratuDeptHeadPos = {setSratuDeptHeadPos}/>
                                </Box>
                            </Modal>
                        </Grid>
                        {
                            isGeneratedReports
                            ?
                            <Grid item xs={12}>
                                <Fade in>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:''}}>
                                    <div style={{paddingRight:'20px',display:'flex',justifyContent:'center'}}>
                                        <img src={letterHeadReports} alt="" height={100}/>
                                    </div>
                                    <div>
                                    <p style={{textAlign:'center',lineHeight:'15px'}}>
                                        {/* <span style={{fontSize:'.9rem'}}>Republic of the Philippines</span> <br/>
                                        <span style={{fontSize:'.9rem',fontWeight:'bold'}}>CITY HUMAN RESOURCE MANAGEMENT OFFICE</span><br/>
                                        <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Butuan City</span> <br/><br/> */}
                                        <span style={{fontSize:'.9rem',fontWeight:'bold'}}>SUMMARY REPORT ON ABSENCES, TARDINESS AND UNDERTIME (SRATU)</span><br/>
                                        <span style={{fontSize:'.9rem',fontWeight:'bold'}}>PERIOD OF {periodOf()}
                                        </span>
                                        <br/>
                                        
                                    </p>
                                    </div>

                                </div>
                                </Fade>
                            
                            </Grid>
                            :
                            null
                        }
                        
                        {
                            cosData.length>0
                            ?
                            <Fade in>
                                <Grid item xs={12}>
                                    <SRATUView empStatus='Contract of Service' data = {cosData} setData = {setCosData} date={selectedMonthYear} print = {printReportCOS} letterHead = {letterHeadReports}/>
                                </Grid>
                            </Fade>
                            :
                            null
                        }
                        
                        {
                            joData.length>0
                            ?
                            <Fade in>
                                <Grid item xs={12}>
                                    <SRATUViewJO empStatus='Job Order' data = {joData} setData = {setCosData} date={selectedMonthYear} print = {printReportJO} letterHead = {letterHeadReports}/>
                                </Grid>
                            </Fade>
                            :
                            null
                        }
                        
                    </Grid>
                    
                </Fade>
            }

        <div style={{ display: "none" }}>
            <SRATUPrint empStatus='Contract of Service' ref={printReportRefCOS} data = {cosData} date={selectedMonthYear} letterHead = {letterHeadReports} sratuPreparedByName = {sratuPreparedByName} sratuPreparedByPos = {sratuPreparedByPos} sratuDeptHeadName = {sratuDeptHeadName} sratuDeptHeadPos ={sratuDeptHeadPos}/>
        </div>
        <div style={{ display: "none" }}>
            <SRATUPrintJO empStatus='Job Order' ref={printReportRefJO} data = {joData} date={selectedMonthYear} letterHead = {letterHeadReports} sratuPreparedByName = {sratuPreparedByName} sratuPreparedByPos = {sratuPreparedByPos} sratuDeptHeadName = {sratuDeptHeadName} sratuDeptHeadPos ={sratuDeptHeadPos}/>
        </div>
        </Box>
    )
}