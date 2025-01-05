import { Box, Fade,Stack,Skeleton,Grid,Paper,Typography,Alert, Button,Tooltip,IconButton,Modal } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React,{useEffect, useState,useRef} from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue, green, red, yellow } from '@mui/material/colors'
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import UnderDev from '../../alert/UnderDev';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { PrintPaySlip } from './PrintPaySlip';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import moment from 'moment';
import { api_url2, getEmpInfo, getEmpPaySlip, getPaySlip, getPaySlip2, postPaySlipHistory } from './PayslipRequest';
import Swal from 'sweetalert2';
import { ViewPaySlip } from './ViewPaySlip';
import axios from 'axios';
import { auditLogs } from '../../auditlogs/Request';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { encryptFile } from '../../fileencrypt/FileEncrypt';
import { api_url } from '../../../../request/APIRequestURL';
import InfoIcon from '@mui/icons-material/Info';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReactPlayer from 'react-player';
import PaySlipErr from '../../../../assets/video/payslip.mp4'
import { formatExtName } from '../../customstring/CustomString';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
export default function PaySlip(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const theme2 = createTheme ({
        typography: {
            fontFamily:'Times New Roman',
            fontSize:11,

        }
    })
    const tableFont = createTheme ({
        typography: {
            fontSize:10,
            fontFamily:'Times New Roman'

        }
    })
    const tutorialStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':'auto',
        // height:500,
        marginBottom: 0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
        // p: 4,
        // height:'100%',
        // overflow:'scroll'
    };
    const printPaySlip = useRef();

    const [empInfo,setEmpInfo] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [year, setYear] = useState('');
    const [yearData, setYearData] = useState('');
    const [month, setMonth] = useState('');
    const [monthData, setMonthData] = useState('');
    const [data, setData] = useState([]);
    const [showPS,setShowPS] = useState(false)
    const [dateTime,setDateTime] = useState('');
    const [loadingData,setLoadingData] = useState(false)

    useEffect(()=>{
        let year = parseInt(moment(new Date()).format('YYYY'))
        let start = 0;
        let year_arr = [];
        while(start < 3){
            year_arr.push(year)
            year--;
            start++;
        }
        setYearData(year_arr)
        setIsLoading(false)
        setMonthData(moment.months())
        getEmpInfo()
        .then(res=>{
            setEmpInfo(res.data[0])
        }).catch(err=>{
            console.log(err)
        })
        var logs = {
            action:'ACCESS PAYSLIP',
            action_dtl:'ACCESS PAYSLIP MODULE',
            module:'PAYSLIP'
        }
        auditLogs(logs)
    },[])
    useEffect(()=>{
        setShowPS(false)
    },[month,year])
    const reactToPrintPaySlip  = useReactToPrint({
        content: () => printPaySlip.current,
        documentTitle:data.length>0?data[0].emp_name+' Pay Slip ':''+' Pay Slip '
    });
    const beforePrint = async () => {
        var logs = {
            action:'PRINT PAYSLIP',
            action_dtl:'MONTH = '+moment().month(month).format("MMMM")+' | YEAR = '+year,
            module:'PAYSLIP'
        }
        await auditLogs(logs)
        reactToPrintPaySlip()

        
        var data3 = {
            data:data,
            year:year,
            month:parseInt(moment().month(month).format("M")),
            emp_no:empInfo.emp_no,
            dept_name:empInfo.dept_title,
            position_name:empInfo.position_name
        }
        // console.log(data3)
        await postPaySlipHistory(data3)
        .then(res2=>{
            // console.log(res2.data)
            // console.log(encryptFile(res2.data))
        }).catch(err2=>{
            console.log(err2)
        })
        // console.log(moment(new Date()).format('MM/DD/YYYY h:mm: a'))
    }
    const submitSearch = async (event) =>{
        event.preventDefault();
        var info={

            timeOpened:new Date(),
            timezone:(new Date()).getTimezoneOffset()/60,
        
            pageon(){return window.location.pathname},
        
        
        };
        console.log(info)
        if(empInfo.emp_no){
                var data2 = {
                key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                emp_no:empInfo.emp_no,
                year:year,
                month:parseInt(moment().month(month).format("M")),
                api_url:api_url+'/getPaySlip'
            }
            setLoadingData(true)
            // Swal.fire({
            //     icon:'info',
            //     title:'Retrieving records',
            //     html:'Please wait...',
            //     allowEscapeKey:false,
            //     allowOutsideClick:false
            // })
            // Swal.showLoading()
            var logs = {
                action:'VIEW PAYSLIP',
                action_dtl:'MONTH = '+moment().month(month).format("MMMM")+' | YEAR = '+year,
                module:'PAYSLIP'
            }
            await auditLogs(logs)
            await getEmpPaySlip(data2)
            .then(async res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    setData(res.data.data)
                    setDateTime(moment(new Date()).format('MM/DD/YYYY h:mm: a'))


                    var data = res.data.data[0];
                    let temp_amtAccrued = parseFloat(data.gross_amount);
                    let total = 0,f_total,total_contributin;
                    let accrued;

                    if(data.adjust_dtl.length !==0){
                        data.adjust_dtl.forEach(el=>{
                            if(el.adjust_type == 2 
                                || el.adjust_type == 3 ){
                                    temp_amtAccrued -= parseFloat(el.adjust_amt)
                            }else{
                                temp_amtAccrued += parseFloat(el.adjust_amt)
                            }
                            total +=parseFloat(el.adjust_amt)
                        })
                        temp_amtAccrued = temp_amtAccrued - parseFloat(data.absent)
                        accrued = formatNumber(temp_amtAccrued.toFixed(2))
                        f_total = formatNumber(total.toFixed(2))
                    }else{
                        accrued = formatNumber(temp_amtAccrued.toFixed(2))
                        f_total = formatNumber(total.toFixed(2))

                    }

                    
                    setShowPS(true)

                    Swal.close();
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
                var logs = {
                    action:'VIEW PAYSLIP',
                    action_dtl:'FAILED TO VIEW - MONTH = '+moment().month(month).format("MMMM")+' | YEAR = '+year,
                    module:'PAYSLIP'
                }
                auditLogs(logs)
            })
            setLoadingData(false)
        }else{
            Swal.fire({
                icon:'error',
                title:'Oops.. Error code 419',
                html:'Something went wrong, please contac HR system admin.'
            })
            setLoadingData(false)
        }
        
    }
    const formatNumber = (x) => {
        // return x;
        if(x<=0 || x === null || x === ''){
            return '-';
        }else{
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    const [isLoadingData,setIsLoadingData] = useState(false)
    const [openTutorial,setOpenTutorial] = useState(false)

    return(
        <React.Fragment>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoadingData}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{margin:'0 10px 10px 10px'}} id ='font'>
            {
                isLoading
                ?
                <Stack spacing={2}>
                    <Skeleton variant='rounded' height={60} animation='wave' />
                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Skeleton variant='rounded' height={60} width={150} animation='wave' sx={{borderRadius:'3px'}} />
                        &nbsp;
                        <Skeleton variant='rounded' height={60} width={150}animation='wave' sx={{borderRadius:'3px'}}/>
                        &nbsp;
                        <Skeleton variant='rounded' height={60} width={60} animation='wave' sx={{borderRadius:'3px'}}/>
                    </Box>
                </Stack>
                :
                <Fade in ={!isLoading}>
                    <Grid container sx={{
                        fontFamily: 'Raleway',
                    }}>
                        {/* <Grid item xs={12}>
                            <UnderDev/>
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                    <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                                    &nbsp;
                                    Pay Slip
                                </Typography>

                            </Box> */}
                            <ModuleHeaderText title='Pay Slip'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#e5f6fd'}}>
                            <Alert severity="info" sx={{fontSize:matches?'.8rem':'1rem'}}>Should there be any concern about your payslip, please contact HR (Total Rewards division)</Alert>
                            {/* <Typography sx={{fontSize:matches?'.7rem':'.9rem',mr:1}}>Network Error ? <a href='#' onClick={()=>setOpenTutorial(true)}>click here </a></Typography> */}

                            {/* <Tooltip title='Network Error? Click here'><IconButton onClick={()=>setOpenTutorial(true)}><InfoIcon/></IconButton></Tooltip> */}

                        </Grid>
                        <form style = {{width:'100%'}} onSubmit = {submitSearch}>
                        {
                            
                            <Grid item xs={12} sx={{display:'flex',flexDirection:matches?'column':'row',gap:1,justifyContent:'center',mt:1}}>
                            <FormControl
                                sx = {{width:matches?'100%':'150px'}}
                                >
                                <InputLabel id="demo-simple-select-label">Month</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={month}
                                label="Month"
                                onChange={(value)=>setMonth(value.target.value)}
                                required
                                >
                                {
                                    monthData.map((data,key)=>
                                    <MenuItem value={data} key={key}>{data}</MenuItem>

                                    )
                                }
                                </Select>
                            </FormControl>
                            <FormControl
                                sx = {{width:matches?'100%':'150px'}}
                                >
                                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={year}
                                label="Year"
                                onChange={(value)=>setYear(value.target.value)}
                                required
                                >
                                {
                                    yearData.map((data,key)=>
                                    <MenuItem value={data} key={key}>{data}</MenuItem>

                                    )
                                }
                                </Select> 
                            </FormControl>
                            <LoadingButton
                                loading = {loadingData}
                                loadingPosition="start"
                                startIcon={<SendIcon/>}
                                variant="outlined"
                                type='submit'
                            >
                                Display PaySlip
                            </LoadingButton>    
                            {/* <Tooltip title='View Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} size='large' variant='contained' type='submit' startIcon={<ManageSearchOutlinedIcon/>}>Display PaySlip</Button></Tooltip> */}
                            {
                                showPS
                                ?
                                <>
                                <Tooltip title='Print Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[600]}}} onClick = {beforePrint} variant='outlined' startIcon={<LocalPrintshopOutlinedIcon />}>Print</Button>
                                </Tooltip>
                                </>
                                :
                                ''
                            }
                            </Grid>
                        }
                        
                        
                        </form>
                        {
                            showPS
                            ?
                            <ViewPaySlip data = {data} emp_info = {empInfo} datetime={dateTime} emp_no={empInfo.emp_no} 
                                year = {year} month = {parseInt(moment().month(month).format("M"))}/>
                            :
                            ''
                        }
                    </Grid>
                </Fade>
            }
            <div style={{display:'none'}}>
                {
                    showPS
                    ?
                    <PrintPaySlip ref={printPaySlip} data = {data} emp_info = {empInfo} datetime={dateTime} emp_no={empInfo.emp_no} 
                                year = {year} month = {parseInt(moment().month(month).format("M"))}/>
                    :
                    ''
                }
            </div>
            {/* <Modal
                open={openTutorial}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                
                <Box sx={tutorialStyle}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenTutorial(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Encounter Network Error
            </Typography>
                    <Box sx={{p:matches?0:4}}>
                        <ReactPlayer url={PaySlipErr} controls={true} width={matches?'100%':'auto'}/>
                    </Box>
                </Box>
            </Modal> */}
        </Box>
        </React.Fragment>

    )
}