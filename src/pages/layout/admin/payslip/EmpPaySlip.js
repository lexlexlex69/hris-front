import { Box, Fade,Stack,Skeleton,Grid,Paper,Typography,Alert, Button,Tooltip,Autocomplete,TextField, TableContainer, Table, TableRow, TableHead, TableCell, TableBody, IconButton } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React,{useEffect, useState,useRef, useCallback} from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue, green, red, yellow } from '@mui/material/colors'
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import UnderDev from '../../alert/UnderDev';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import Logo from '../../../.././assets/img/bl.png'
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { PrintPaySlip } from './PrintPaySlip';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import moment from 'moment';
import { api_url2, getAllOffices, getEmpInfo, getEmpList, getPaySlip } from './PayslipRequest';
import Swal from 'sweetalert2';
import { ViewPaySlip } from './ViewPaySlip';
import axios from 'axios';
import { auditLogs } from '../../auditlogs/Request';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import PrintIcon from '@mui/icons-material/Print';
import {
    useNavigate
} from "react-router-dom";
import { postPaySlipHistory } from '../../selfserviceportal/payslip/PayslipRequest';
import SearchBar from './Component/SearchBar';
export default function EmpPaySlip(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()
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
    const [paySlipData, setPaySlipData] = useState([]);
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [showPS,setShowPS] = useState(false)
    const [dateTime,setDateTime] = useState('')
    const [officeData,setOfficeData] = useState([])
    const [selectedOffice,setSelectedOffice] = useState(null)
    useEffect(()=>{
        checkPermission(48)
        .then((response)=>{
            if(response.data){
                getAllOffices()
                .then(res=>{
                    console.log(res.data)
                    setOfficeData(res.data)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            console.log(error)
        })
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
        // getEmpInfo()
        // .then(res=>{
        //     console.log(res.data)
        //     setEmpInfo(res.data[0])
        // }).catch(err=>{
        //     console.log(err)
        // })
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
        documentTitle:data.length>0?empInfo.fullname+' Pay Slip ':''+' Pay Slip '
    });
    const beforePrint = () => {
        var logs = {
            action:'PRINT PAYSLIP',
            action_dtl:'MONTH = '+moment().month(month).format("MMMM")+' | YEAR = '+year,
            module:'PAYSLIP'
        }
        auditLogs(logs)
        console.log(empInfo)
        reactToPrintPaySlip()
        // console.log(moment(new Date()).format('MM/DD/YYYY h:mm: a'))
    }
    const handlePrintPaySlip = (row) =>{
        if(month.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Please select a month !'
            })
        }else if(year.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Please select a year !'
            })  

        }else{
            var t_info = {
                dept_title:selectedOffice.dept_title,
                emp_no:row.emp_no,
                fullname:row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname?row.emp_mname.charAt(0)+'. ':' ')+(row.emp_extname?row.emp_extname:''),
                position_name:row.position_name,
                short_name:selectedOffice.short_name
            }
            console.log(t_info)
            setEmpInfo(t_info)
            console.log(row)
            // var info={

            //     timeOpened:new Date(),
            //     timezone:(new Date()).getTimezoneOffset()/60,
            
            //     pageon(){return window.location.pathname},
            
            
            // };
            // console.log(info)
            var data2 = {
                key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                emp_no:row.emp_no,
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
                action:'PRINT PAYSLIP',
                action_dtl:'NAME = '+row.emp_lname+', '+row.emp_fname+' MONTH = '+moment().month(month).format("MMMM")+' | YEAR = '+year,
                module:'PAYSLIP'
            }
            auditLogs(logs)
            getPaySlip(data2)
            .then(res=>{
                // console.log(res.data)
                if(res.data.status === 200){
                    setPaySlipData(res.data.data)
                    setShowPS(true)
                    setDateTime(moment(new Date()).format('MM/DD/YYYY h:mm: a'))

                    Swal.close();
                    var data3 = {
                        data:res.data.data,
                        year:year,
                        month:parseInt(moment().month(month).format("M")),
                        emp_no:row.emp_no,
                        dept_name:selectedOffice.dept_title,
                        position_name:row.position_name
                    }
                    console.log(data3)
                    return postPaySlipHistory(data3)
                }else{
                    // console.log('error')
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                    return {data:[],status:500};
                }
            })
            .then(res=>{
                // console.log(res.data)
                // if(res.data.status === 200){
                //     console.log(res.data)
                //     beforePrint()
                // }
                beforePrint()
                
            })
            .catch(err=>{
                Swal.close();
                console.log(err)
                window.open(api_url2)
            })
        }
        
    }
    const [isLoadingData,setIsLoadingData] = useState(false)
    const handleSelectOffice = async(data)=>{
        console.log(data)
        setSelectedOffice(data)
        if(data){
            console.log(data)
            var t_data = {
                dept_code:data.dept_code
            }
            getEmpList(t_data)
            .then(res=>{
                console.log(res.data)
                setData(res.data)
                setData1(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }else{
            setData([])
        }
        
    }

    const handleSearch = (val)=>{
        setSearchVal(val.target.value)

        if(val.target.value !== ''){
            var t_arr = data1.filter((el)=>{
                return el.emp_fname.includes(val.target.value.toUpperCase()) || el.emp_lname.includes(val.target.value.toUpperCase())
            })
            setData(t_arr);
        }else{
            setData(data1)
        }
    }
    const [testVal,setTestVal] = useState([
        {
            name:'',
            val:''
        },
         {
            name:'',
            val:''
        },
         {
            name:'',
            val:''
        },
        ])
    const handleTest = useCallback((id,value)=>{
        var temp = [...testVal];
        temp[id].val = value;
        console.log(temp)
        setTestVal(temp)
    },[])
    const [searchVal,setSearchVal] = useState('')
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
                            <ModuleHeaderText title='Employee Pay Slip'/>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2,display:'flex',flexDirection:'row',alignItems:'center'}} container>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disablePortal
                                    id="offices-box"
                                    options={officeData}
                                    getOptionLabel={(option) => option.dept_title}
                                    sx={{width:300}}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={selectedOffice}
                                    onChange={(event, newValue) => {
                                        handleSelectOffice(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Office Name *"/>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <form style = {{width:'100%'}} onSubmit = {handlePrintPaySlip}>
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
                                    {/* &nbsp;
                                    <Tooltip title='View Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} size='large' variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip> */}
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
                                    {/* &nbsp;
                                    <Tooltip title='View Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} size='large' variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button></Tooltip> */}
                                    {/* {
                                        showPS
                                        ?
                                        <>
                                        &nbsp;
                                        <Tooltip title='Print Pay Slip'><Button sx={{'&:hover':{color:'white',background:blue[800]}}} onClick = {beforePrint} variant='outlined'><LocalPrintshopOutlinedIcon /></Button>
                                        </Tooltip>
                                        </>
                                        :
                                        ''
                                    } */}
                                    
                                    </Grid>
                                }
                                
                                
                                </form>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                            <TextField label = 'Search Employee' value = {searchVal} onChange = {(val)=>setSearchVal(val.target.value)}/>
                            <Paper>
                            <TableContainer sx={{maxHeight:'50vh'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Name
                                            </TableCell>
                                            <TableCell>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data.length>0
                                            ?
                                            data.map((row,key)=>{
                                                if(row.emp_lname.includes(searchVal.toUpperCase()) || row.emp_fname.includes(searchVal.toUpperCase())){
                                                    return(
                                                        <TableRow key = {key}>
                                                            <TableCell>
                                                                {row.emp_lname}, {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+'. ':''}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip title='Print payslip'><IconButton color='primary' className='custom-iconbutton' onClick={()=>handlePrintPaySlip(row)}><PrintIcon/></IconButton></Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                                
                                            })
                                            :
                                            <TableRow>
                                                    <TableCell colSpan={2} align='center'>
                                                       No Data available...
                                                    </TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Grid>
                        
                        {/* {
                            showPS
                            ?
                            <ViewPaySlip data = {paySlipData} emp_info = {empInfo} datetime={dateTime}/>
                            :
                            ''
                        } */}
                    </Grid>
                </Fade>
            }
            <div style={{display:'none'}}>
                {
                    showPS
                    ?
                    <PrintPaySlip ref={printPaySlip} data = {paySlipData} emp_info = {empInfo} datetime={dateTime} emp_no={empInfo.emp_no} year = {year} month = {parseInt(moment().month(month).format("M"))}/>
                    :
                    ''
                }
            </div>
        </Box>
        </React.Fragment>

    )
}