import React,{useEffect, useState} from 'react';
import {Box,Grid,Typography,Stack,Skeleton,Paper,TableContainer,Table,TableHead,TableRow,TableBody,Tooltip,IconButton,Button,Switch,FormControlLabel,TablePagination  } from '@mui/material';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {toast} from 'react-toastify'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue,red} from '@mui/material/colors';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import ThreePOutlinedIcon from '@mui/icons-material/ThreePOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Evaluate from './Dialog/Evaluate';
import Evaluated from './Dialog/Evaluated';
import DashboardLoading from '../../loader/DashboardLoading';
import moment from 'moment';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { getTrainees } from './TraineeEvaluationRequest';
import { evaluationDaysLeft, evaluationDaysLeftNumber } from '../../customstring/CustomString';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Complete } from './Tabs/Complete';
import { InComplete } from './Tabs/InComplete';
import { InitialLAPSAP } from './Tabs/InitialLAPSAP';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        padding:10,
        color: theme.palette.common.white,
        fontFamily:'latoreg'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        padding:10
    },
  }));
export default function TraineeEvaluation(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true);
    const [data,setData] = useState([])
    const [selectedTraining,setSelectedTraining] = useState([]);
    const [openEvaluateDialog,setOpenEvaluateDialog] = useState(false);
    const [openEvaluatedDialog,setOpenEvaluatedDialog] = useState(false);
    const [evaluationDate,setEvaluationDate] = useState(90);
    const [evaluationDatePeriod,setEvaluationDatePeriod] = useState(105);
    const [testEvaluation,setTestEvaluation] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(()=>{
        checkPermission(41)
        .then((response)=>{
            if(response.data){
                setIsLoading(false)
                getTrainees()
                .then(res=>{

                    setData(res.data.data)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])
    const handleRefresh = () =>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        getTrainees()
        .then(res=>{
            setData(res.data.data)
            Swal.fire({
                icon:'success',
                showConfirmButton:false,
                timer:1000
            })
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const handleOpnEvaluateDialog = (row)=>{
        setSelectedTraining(row)
        setOpenEvaluateDialog(true)
    }
    const handleCloseEvaluateDialog = ()=>{
        setOpenEvaluateDialog(false)
    }
    const handleOpenEvaluatedDialog = (row)=>{
        setSelectedTraining(row)
        setOpenEvaluatedDialog(true)
    }
    const handleCloseEvaluatedDialog = ()=>{
        setOpenEvaluatedDialog(false)
    }
    const daysLeft = (date)=>{
        /**
         * implementation of LAP/SAP/REAP 90 days
         */
        var d_range = 90;

        /**
         * 15 days period for submission of LAP/SAP/REAP, 90+15=105
         */
        var u_range = 105;

        var curr_date = moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD');
        var e_date = moment(date,'YYYY-MM-DD').add(d_range,'days').format('YYYY-MM-DD')
        var e_date2 = moment(date,'YYYY-MM-DD').add(d_range,'days').format('MMMM DD,YYYY')

        /**
         * evaluation until closed
         */
        var until_date = moment(date,'YYYY-MM-DD').add(u_range,'days').format('YYYY-MM-DD');

        /**
         * remaining days until evaluation
         */
        var d_left = (moment(date,'YYYY-MM-DD').add(d_range,'days')).diff(curr_date,'days')
        /**
         * remaining days until evaluation closed 
         */
        var r_left = (moment(until_date).diff(curr_date,'days'))+1
        if(curr_date < e_date){
            return <em>{e_date2} ({d_left} day/s left)</em>
        }
        else if(curr_date === e_date){
            return <em>{e_date2} (Today) <br/>(evaluation until: {moment(until_date).format('MMMM DD,YYYY')})</em>
        }else if(curr_date > e_date && curr_date <=until_date){
            return <em>{e_date2} ({r_left} day/s left) <br/>(evaluation until: {moment(until_date).format('MMMM DD,YYYY')})</em>
        }else{
            return <em style={{color:red[800]}}>Evaluation closed <br/>(evaluation until: {moment(until_date).format('MMMM DD,YYYY')})</em>
        }
        
    }
    const isEvaluation = (date)=>{
        var d_range = evaluationDate;
        var u_range = evaluationDatePeriod;
        var curr_date = moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD');
        var e_date = moment(date,'YYYY-MM-DD').add(d_range,'days').format('YYYY-MM-DD');
        var until_date = moment(date,'YYYY-MM-DD').add(u_range,'days').format('YYYY-MM-DD');
        if(curr_date >= e_date && curr_date <= until_date){
            return false;
        }else{
            return true;
        }
    }
    const handleTestEvaluation = ()=>{
        setTestEvaluation(!testEvaluation)
    }
    const [tabValue,setTabValue] = useState(0)
    const [tabValueMain,setTabValueMain] = useState(0)
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleChangeTabMain = (event, newValue) => {
        setTabValueMain(newValue);
    };
    return(
        <React.Fragment>
        {
            isLoading
            ?
            <Box sx={{margin:'0 10px 10px 10px'}}>
            <DashboardLoading actionButtons={1}/>
            </Box>
            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Trainee Evaluation
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Trainee Evaluation'/>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={tabValueMain} onChange={handleChangeTabMain} aria-label="basic tabs example" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{'.Mui-selected':{fontWeight:'bold'}}}>
                                <Tab label="Initial LAP/SAP" {...a11yProps(0)}/>
                                <Tab label="Final LAP/SAP" {...a11yProps(1)}/>
                                </Tabs>
                            </Box>
                                <TabPanel value={tabValueMain} index={0}>
                                    <InitialLAPSAP/>
                                </TabPanel>
                                <TabPanel value={tabValueMain} index={1}>
                                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mb:1,mt:1}}>
                                        <Tooltip title='Refresh data'><IconButton color='primary' onClick={handleRefresh} className='custom-iconbutton'><RefreshOutlinedIcon/></IconButton></Tooltip>
                                        {/* <FormControlLabel control={<Switch checked={testEvaluation} onChange={handleTestEvaluation} />} label="Enable (for testing)" /> */}
                                        
                                    </Grid>
                                    <Grid item xs={12}>
                                    <Paper>
                                        <TableContainer sx={{maxHeight:'60vh'}}>
                                            <Table>
                                            <TableHead sx={{position:'sticky',top:0,zIndex:1000}}>
                                                <TableRow>
                                                    <StyledTableCell rowSpan={2}>Training Name</StyledTableCell>
                                                    <StyledTableCell colSpan={2} align='center'>Training Period</StyledTableCell>
                                                    <StyledTableCell rowSpan={2}>Training Application</StyledTableCell>
                                                    <StyledTableCell rowSpan={2}>Evaluation Info</StyledTableCell>
                                                    <StyledTableCell rowSpan={2} align='center'>Participants</StyledTableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <StyledTableCell align='center'>From</StyledTableCell>
                                                    <StyledTableCell align='center'>To</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    data.length === 0
                                                    ?
                                                    <TableRow><StyledTableCell colSpan={5} align='center'>No data</StyledTableCell></TableRow>
                                                    :
                                                    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                                        <TableRow key={key} hover>
                                                            <StyledTableCell>{row.training_name}</StyledTableCell>
                                                            <StyledTableCell>{moment(row.period_from).format('MMMM DD, YYYY')}</StyledTableCell>
                                                            <StyledTableCell>{moment(row.period_to).format('MMMM DD, YYYY')}</StyledTableCell>
                                                            <StyledTableCell>{row.training_app}</StyledTableCell>
                                                            <StyledTableCell>
                                                            <em>
                                                            {
                                                                evaluationDaysLeft(row.period_to)
                                                            }
                                                            </em>
                                                            </StyledTableCell>

                                                            <StyledTableCell>
                                                                {
                                                                    matches
                                                                    ?
                                                                    <Box sx={{display:'flex',justifyContent:'center',gap:1}}>
                                                                        {/* {
                                                                            moment(row.period_to).businessAdd(11).isSameOrAfter(moment())
                                                                            ?
                                                                            <Tooltip title='Evaluate'><span><IconButton color='primary' className='custom-iconbutton' disabled><ThreePOutlinedIcon/></IconButton></span>
                                                                            </Tooltip>
                                                                            :
                                                                            <Tooltip title='Evaluate'><span><IconButton color='primary' onClick={()=>handleOpnEvaluateDialog(row)} className='custom-iconbutton' disabled={testEvaluation?false:isEvaluation(row.period_to)}><ThreePOutlinedIcon/></IconButton></span>
                                                                            </Tooltip>
                                                                        } */}

                                                                        <Tooltip title='Evaluate'><span><IconButton color='primary' onClick={()=>handleOpnEvaluateDialog(row)} className='custom-iconbutton' ><ThreePOutlinedIcon/></IconButton></span>
                                                                            </Tooltip>
                                                                        {/* <Tooltip title='View Evaluated'><span><IconButton onClick={()=>handleOpenEvaluatedDialog(row)} sx={{color:blue[500]}} className='custom-iconbutton' disabled={testEvaluation?false:isEvaluation(row.period_to)}><PersonSearchOutlinedIcon/></IconButton></span></Tooltip> */}
                                                                        <Tooltip title='View Evaluated'><span><IconButton onClick={()=>handleOpenEvaluatedDialog(row)} sx={{color:blue[500]}} className='custom-iconbutton'><PersonSearchOutlinedIcon/></IconButton></span></Tooltip>
                                                                    </Box>
                                                                    :
                                                                    <Box sx={{display:'flex',justifyContent:'center',gap:1,alignItems:'center'}}>
                                                                        {/* {
                                                                            moment().format('YYYY-MM-DD') >= (moment(row.period_to).businessAdd(11).format('YYYY-MM-DD'))
                                                                            ?
                                                                                moment().format('YYYY-MM-DD') > moment(row.period_to).businessAdd(11).add(105,'days').format('YYYY-MM-DD')
                                                                                ?
                                                                                <Tooltip title='Evaluate'><span><Button variant='contained' color='primary' disabled startIcon={<ThreePOutlinedIcon sx={{transform:'scale(-1,1)'}}/>} className='custom-roundbutton'>Evaluate Trainee
                                                                                </Button></span>
                                                                                </Tooltip>
                                                                                :
                                                                                <Tooltip title='Evaluate'><span><Button variant='contained' color='primary' onClick={()=>handleOpnEvaluateDialog(row)} startIcon={<ThreePOutlinedIcon sx={{transform:'scale(-1,1)'}}/>} className='custom-roundbutton'>Evaluate Trainee</Button></span>
                                                                                </Tooltip>
                                                                            :
                                                                            <Tooltip title='Evaluate'><span><Button variant='contained' color='primary' disabled startIcon={<ThreePOutlinedIcon sx={{transform:'scale(-1,1)'}}/>} className='custom-roundbutton'>Evaluate Trainee</Button></span>
                                                                            </Tooltip>
                                                                            

                                                                        } */}
            {/*                                                             
                                                                        <Tooltip title='View Evaluated'><span><Button variant='contained' color='info' onClick={()=>handleOpenEvaluatedDialog(row)} disabled={testEvaluation?false:isEvaluation(row.period_to)} startIcon={<PersonSearchOutlinedIcon/>} className='custom-roundbutton'>View Evaluated</Button></span></Tooltip> */}
                                                                        <Tooltip title='Evaluate'><span><Button variant='contained' color='primary' onClick={()=>handleOpnEvaluateDialog(row)} startIcon={<ThreePOutlinedIcon sx={{transform:'scale(-1,1)'}}/>} className='custom-roundbutton'>Evaluate</Button></span>
                                                                        </Tooltip>

                                                                        <Tooltip title='View Evaluated'><span><Button variant='contained' color='info' onClick={()=>handleOpenEvaluatedDialog(row)} startIcon={<PersonSearchOutlinedIcon/>} className='custom-roundbutton'>Evaluated</Button></span></Tooltip>
                                                                    </Box>
                                                                }
                                                                

                                                            </StyledTableCell>
                                                            
                                                        </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                            </Table>
                                            {
                                                data.length ===0
                                                ?
                                                null
                                                :
                                                <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, 100]}
                                                    component="div"
                                                    count={data.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            }
                                        </TableContainer>
                                    </Paper>
                                </Grid>
                            </TabPanel>
                        </Box>
                    </Grid>
                    
                </Grid>
                <Dialog
                    fullScreen
                    open={openEvaluateDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseEvaluateDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Evaluation of Trainee
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseEvaluateDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example 2" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{'.Mui-selected':{fontWeight:'bold'}}}>
                                    {/* <Tab label="All" {...a11yProps2(0)}/> */}
                                    <Tab label="Complete" {...a11yProps2(0)}/>
                                    <Tab label="Incomplete" {...a11yProps2(1)}/>
                                    </Tabs>
                                </Box>
                                {/* <TabPanel value={tabValue} index={0}>
                                    <Evaluate data = {selectedTraining}/>
                                </TabPanel> */}
                                <TabPanel value={tabValue} index={0}>
                                    <Complete data = {selectedTraining}/>
                                </TabPanel>
                                <TabPanel value={tabValue} index={1}>
                                    <InComplete data = {selectedTraining}/>
                                </TabPanel>
                            </Box>
                        </Box>
                </Dialog>
                <Dialog
                    fullScreen
                    open={openEvaluatedDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseEvaluatedDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Evaluated Trainee
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseEvaluatedDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Box>
                            <Evaluated data = {selectedTraining}/>
                        </Box>
                    </Box>

                </Dialog>
            </Box>
        }
        </React.Fragment>
    )
}
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
function a11yProps(index) {
return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
};
}
function a11yProps2(index) {
    return {
        id: `simple-tab-2-${index}`,
        'aria-controls': `simple-tabpanel-2-${index}`,
    };
}