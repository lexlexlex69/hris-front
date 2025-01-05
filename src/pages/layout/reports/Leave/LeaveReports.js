import React,{useEffect, useState} from 'react';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid,Stack,Skeleton, Fade,Box,Paper,Typography,Button,FormControl,Select,InputLabel,MenuItem, TextField,Modal } from '@mui/material';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import moment from 'moment';
import { getLeaveRep, getLeaveRepDetails } from './ReportsRequest';
import { ReactGoogleChartEvent, Chart } from "react-google-charts";
import LeaveDetailsModal from './Modal/LeaveDetailsModal';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
const options = {
    title: {
      text: 'My chart'
    },
    series: [{
      data: [1, 2, 3]
    }]
  }
export default function LeaveReports(){
    // navigate
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [reptype,setRepType] = useState([{type:'APPROVED',name:'Approved Applications'},{type:'FOR REVIEW',name:'Pending Applications'},{type:'DISAPPROVED',name:'Disapproved Application'}]);
    const [repYear,setRepYear] = useState([]);
    const [selectedRepYear,setSelectedRepYear] = useState('');

    const [selectedRepType,setSelectedRepType] = useState('')
    const [selectedFromDate,setSelectedFromDate] = useState('')
    const [selectedToDate,setSelectedToDate] = useState('')
    const [selectedDetailsFromDate,setSelectedDetailsFromDate] = useState('')
    const [selectedDetailsToDate,setSelectedDetailsToDate] = useState('')
    const [data,setData] = useState([]);
    const [repData,setRepData] = useState([]);
    const [showDetailsModal,setShowDetailsModal] = useState(false);
    const [detailsData,setDetailsData] = useState([]);
    const showDetailsStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:900,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    useEffect(()=>{
        checkPermission(30)
        .then((response)=>{
            if(response.data !== 1){
                navigate(`/${process.env.REACT_APP_HOST}`)
            }else{
                var year = parseInt(moment(new Date()).format('YYYY'));
                var temp = [];
                for(var i = 0 ; i<3 ; i++){
                    temp.push(year-i);
                }
                setRepYear(temp);
                setIsLoading(false);
            }
        })
    },[])
    const submitReports = (event)=>{
        event.preventDefault();
        // var data2 = {
        //     type:selectedRepType.type,
        //     year:selectedRepYear
        // }
        setSelectedDetailsFromDate(selectedFromDate)
        setSelectedDetailsToDate(selectedToDate)
        var data = {
            from_date:selectedFromDate,
            to_date:selectedToDate,
        }
        // console.log(data)
        getLeaveRep(data)
        .then(res=>{
            console.log(res.data)
            var temp = [
                ["Department"],
                [moment(selectedFromDate).format('MM-DD-YYYY')+' - '+moment(selectedToDate).format('MM-DD-YYYY')]
            ]
            res.data.forEach(el=>{
                temp[0].push(el.short_name);
                temp[1].push(el.total);
            })
            setData(temp)
            setRepData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    // const options = {
    //     title: "Leave Applications",
    //     chartArea: { width: "50%" },
    //     hAxis: {
    //       title: "Total Application",
    //       minValue: 0,
    //     },
    //     vAxis: {
    //       title: "Date",
    //       minValue: 0,

    //     },
    //     animation: {
    //         startup: true,
    //         easing: "linear",
    //         duration: 1000,
    //       },
    //   };
    const showMoreDetails = (dept) => {
        var dept_code;
        for(var i=0;i<repData.length;i++){
            if(repData[i].short_name === dept){
                dept_code = repData[i].dept_code;
                break;
            }
        }
        var data2 = {
            from_date:selectedDetailsFromDate,
            to_date:selectedDetailsToDate,
            dept_code:dept_code
        }
        getLeaveRepDetails(data2)
        .then(res=>{
            // console.log(res.data)
            setDetailsData(res.data)
            setShowDetailsModal(true)
        }).catch(err=>{
            console.log(err)
        })
        
    }
    const chartEvents = [
        {
            eventName: "select",
            callback: function (_a) {
                var chartWrapper = _a.chartWrapper;
                var chart = chartWrapper.getChart();
                var selection = chart.getSelection();
                if(selection.length === 1 && selection[0].row === null){
                    var selectedItem = selection[0];
                    var dataTable = chartWrapper.getDataTable();
                    var row = 0, column = selectedItem.column;
                    console.log("You selected:", {
                        row: row,
                        column: column,
                        value: dataTable === null || dataTable === void 0 ? void 0 : dataTable.getValue(row, column),
                    });
                }
                if(selection.length === 1 && selection[0].row !== null){
                    var selectedItem = selection[0];
                    var dataTable = chartWrapper.getDataTable();
                    var row = selectedItem.row, column = selectedItem.column;
                    // console.log(selectedItem)
                    // console.log(dataTable.bf[column].label)
                    showMoreDetails(dataTable.bf[column].label)
                    // console.log("You selected:", {
                    //     row: row,
                    //     column: column,
                    //     value: dataTable === null || dataTable === void 0 ? void 0 : dataTable.getValue(row, column),
                    // });
                }
            },
        },
    ];
    return(
        <Box sx={{margin:'20px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <Stack spacing={2}>
                        <Skeleton variant="text" height={'80px'} animation="wave"/>
                </Stack>
                :
                <Fade in = {!isLoading}>
                    <form onSubmit={submitReports}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                        <Box sx={{background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'18px':'auto',color:'#fff',padding:'15px 0 15px 0'}}  >
                                &nbsp;
                                Leave Reports
                            </Typography>
                        </Box>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            {/* <FormControl sx={{width:'220px'}}>
                                <InputLabel id="select-type">Type of Reports *</InputLabel>
                                <Select
                                labelId="select-type"
                                id="select-type"
                                value={selectedRepType}
                                label="Type of Reports *"
                                onChange={(value)=>setSelectedRepType(value.target.value)}
                                required
                                >
                                {reptype.map((data,key)=>
                                    <MenuItem key = {key} value={data}>{data.name}</MenuItem>
                                )}
                                </Select>
                            </FormControl>
                            &nbsp;
                            <FormControl sx={{width:'220px'}}>
                                <InputLabel id="select-year">Year *</InputLabel>
                                <Select
                                labelId="select-year"
                                id="select-year"
                                value={selectedRepYear}
                                label="Year *"
                                onChange={(value)=>setSelectedRepYear(value.target.value)}
                                required
                                >
                                {repYear.map((data,key)=>
                                    <MenuItem key = {key} value={data}>{data}</MenuItem>
                                )}
                                </Select>
                            </FormControl> */}
                            <TextField type = 'date' label='From' required value={selectedFromDate} onChange = {(value)=>setSelectedFromDate(value.target.value)} InputLabelProps={{shrink:true}}/>
                            &nbsp;
                            <TextField type = 'date' label='To' required value={selectedToDate} onChange = {(value)=>setSelectedToDate(value.target.value)} InputLabelProps={{shrink:true}}/>
                            &nbsp;

                            <Button variant='outlined' type='submit'><ManageSearchOutlinedIcon/></Button>
                        </Grid>
                        <Grid item xs={12}>
                            {/* {
                                data.length !==0
                                ?
                                <Chart
                                    chartType="BarChart"
                                    width="100%"
                                    height="400px"
                                    data={data}
                                    options={options}
                                    chartEvents = {chartEvents}
                                />
                                :
                                ''
                            } */}
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                            />
                            
                        </Grid>

                    </Grid>
                    
                    </form>
                </Fade>
            }
            <Modal
                open={showDetailsModal}
                onClose={()=>setShowDetailsModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={showDetailsStyle}>
                    <Box id="modal-modal-title" sx={{padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography>Report Details</Typography>
                    <Button variant='outlined' sx={{color:'white'}} size='small' onClick = {()=>setShowDetailsModal(false)}><CloseOutlinedIcon/></Button>
                    </Box>
                    <Box sx={{ p:2}}>
                        <LeaveDetailsModal
                            data = {detailsData}
                            from_date = {selectedDetailsFromDate}
                            to_date = {selectedDetailsToDate}
                        />
                    </Box>
                </Box>
            </Modal>
        </Box>
        
    )
}