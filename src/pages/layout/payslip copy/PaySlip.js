import { Box, Fade,Stack,Skeleton,Grid,Paper,Typography,Alert, Button,Tooltip } from '@mui/material';
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
import UnderDev from '../alert/UnderDev';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import Logo from '../../.././assets/img/bl.png'
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { PrintPaySlip } from './PrintPaySlip';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import moment from 'moment';
import { api_url2, getEmpInfo, getPaySlip } from './PayslipRequest';
import Swal from 'sweetalert2';
import { ViewPaySlip } from './ViewPaySlip';
import axios from 'axios';
import { auditLogs } from '../auditlogs/Request';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
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
    const printPaySlip = useRef();

    const [empInfo,setEmpInfo] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [year, setYear] = useState('');
    const [yearData, setYearData] = useState('');
    const [month, setMonth] = useState('');
    const [monthData, setMonthData] = useState('');
    const [data, setData] = useState([]);
    const [showPS,setShowPS] = useState(false)
    const [dateTime,setDateTime] = useState('')

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
    const beforePrint = () => {
        var logs = {
            action:'PRINT PAYSLIP',
            action_dtl:'MONTH = '+moment().month(month).format("MMMM")+' | YEAR = '+year,
            module:'PAYSLIP'
        }
        auditLogs(logs)
        reactToPrintPaySlip()
        // console.log(moment(new Date()).format('MM/DD/YYYY h:mm: a'))
    }
    const submitSearch = (event) =>{
        event.preventDefault();
        var info={

            timeOpened:new Date(),
            timezone:(new Date()).getTimezoneOffset()/60,
        
            pageon(){return window.location.pathname},
        
        
        };
        console.log(info)
        var data2 = {
            key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
            emp_no:empInfo.emp_no,
            year:year,
            month:parseInt(moment().month(month).format("M"))
        }
        Swal.fire({
            icon:'info',
            title:'Retrieving records',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var logs = {
            action:'VIEW PAYSLIP',
            action_dtl:'MONTH = '+moment().month(month).format("MMMM")+' | YEAR = '+year,
            module:'PAYSLIP'
        }
        auditLogs(logs)
        getPaySlip(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                setData(res.data.data)
                setShowPS(true)
                setDateTime(moment(new Date()).format('MM/DD/YYYY h:mm: a'))

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
            window.open(api_url2)
        })
    }
    const [isLoadingData,setIsLoadingData] = useState(false)
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
                        <form style = {{width:'100%'}} onSubmit = {submitSearch}>
                        {
                            matches
                            ?
                            <React.Fragment>
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',mt:1}}>
                            <FormControl
                                sx = {{width:'150px'}}
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
                            &nbsp;
                            <FormControl
                                sx = {{width:'150px'}}
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
                            &nbsp;
                            <Tooltip title='View Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} size='large' variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                            {
                                showPS
                                ?
                                <>
                                &nbsp;
                                <Tooltip title='Print Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} onClick = {beforePrint} variant='outlined' fullWidth><LocalPrintshopOutlinedIcon /></Button>
                                </Tooltip>
                                </>
                                :
                                ''
                            }
                            
                            </Grid>
                            </React.Fragment>
                            :
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mt:1}}>
                            <FormControl
                                sx = {{width:'150px'}}
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
                            &nbsp;
                            <FormControl
                                sx = {{width:'150px'}}
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
                            &nbsp;
                            <Tooltip title='View Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} size='large' variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip>
                            {
                                showPS
                                ?
                                <>
                                &nbsp;
                                <Tooltip title='Print Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} onClick = {beforePrint} variant='outlined'><LocalPrintshopOutlinedIcon /></Button>
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
                            <ViewPaySlip data = {data} emp_info = {empInfo} datetime={dateTime}/>
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
                    <PrintPaySlip ref={printPaySlip} data = {data} emp_info = {empInfo} datetime={dateTime}/>
                    :
                    ''
                }
            </div>
        </Box>
        </React.Fragment>

    )
}