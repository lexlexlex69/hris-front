import React,{useState,useEffect} from 'react';
import {Grid,Typography,Box,Stack,Skeleton,Tabs,Tab,IconButton,Button,Tooltip} from '@mui/material';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {toast} from 'react-toastify'
import Requirements from './TabsComponent/Requirements';
import { getMyTrainings } from './TraineeDashboardRequest';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {TableHead} from '@mui/material';
import Paper from '@mui/material/Paper';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import {green,orange,grey,blue} from '@mui/material/colors';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Swal from 'sweetalert2';
import DailyOutput from './TabsComponent/DailyOutput';
import Evaluation from './TabsComponent/Evaluation';
import LearningMaterials from './TabsComponent/LearningMaterials';
import MenuIcon from '@mui/icons-material/Menu';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DataTableLoader from '../../loader/DataTableLoader';
import DashboardLoading from '../../loader/DashboardLoading';
import moment from 'moment';
import { viewFileAPI } from '../../../../viewfile/ViewFileRequest';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import EvaluationMOV from './TabsComponent/EvaluationMOV';
import SmallModal from '../../custommodal/SmallModal';
import NotAttendedTrainingModal from './Modal/NotAttendedTrainingModal';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function TraineeDashboard(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [isLoadingData,setIsLoadingData] = useState(true)
    const [value, setValue] = useState(0);
    const [data,setData] = useState([])
    const [openTrainingDialog,setOpenTrainingDialog] = useState(false);
    const [selectedData,setSelectedData] = useState([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleCloseTrainingDialog = () =>{
        setOpenTrainingDialog(false)
    }
    useEffect(()=>{
        checkPermission(39)
        .then((response)=>{
            if(response.data){
                setIsLoading(false)
                getMyTrainings()
                .then(res=>{
                    setData(res.data)
                    setIsLoadingData(false)
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
    const handleTraining = (data)=>{
        setSelectedData(data)
        console.log(data)
        setOpenTrainingDialog(true)
    }
    const updateRqmt = ()=>{
        getMyTrainings()
        .then(res=>{
            var temp;
            setData(res.data)
            res.data.forEach(element => {
                if(element.training_details_id === selectedData.training_details_id){
                    temp=element
                }
            });
            setSelectedData(temp)
        }).catch(err=>{
            console.log(err)
        })
    }
    const refreshRqmt = ()=>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading()
        getMyTrainings()
        .then(res=>{
            var temp;
            setData(res.data)
            res.data.forEach(element => {
                if(element.training_details_id === selectedData.training_details_id){
                    temp=element
                }
            });
            setSelectedData(temp)
            Swal.close()

        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const viewFile = (id,name)=>{
        viewFileAPI(id,name)
    }
    const [openNotAttendedModal,setOpenNotAttendedModal] = useState(false)
    const [trainingDetailsID,setTrainingDetailsID] = useState()
    const handleCloseNotAttendedModal = () => {
        setOpenNotAttendedModal(false)
    }
    const handleOpenNotAttended = (row)=>{
        setTrainingDetailsID(row.training_details_id)
        setOpenNotAttendedModal(true)

        console.log(row)
    }
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{margin:'0 10px 10px 10px'}}>
            <DashboardLoading/>
            </Box>

            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px'}}>
                            Trainee Dashboard
                            </Typography>
                        </Box> */}
                        <ModuleHeaderText title='Trainee Dashboard'/>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <TableContainer sx={{maxHeight:'60vh'}}>
                                <Table>
                                    <TableHead sx={{position:'sticky',top:0,zIndex:1000}}>
                                        <TableRow>
                                            <StyledTableCell rowSpan={2}>
                                                Training Name
                                            </StyledTableCell>
                                            <StyledTableCell  rowSpan={2}>
                                                Venue
                                            </StyledTableCell>
                                            <StyledTableCell  colSpan={2} align='center'>
                                                Training Period
                                            </StyledTableCell>
                                            <StyledTableCell  rowSpan={2}>
                                                Training Application
                                            </StyledTableCell>
                                            <StyledTableCell  rowSpan={2} sx={{width:120}} align='center'>
                                                Action
                                            </StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell align='center'>
                                                From
                                            </StyledTableCell>
                                            <StyledTableCell align='center'>
                                                To
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            isLoadingData
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'><DataTableLoader/></TableCell>
                                            </TableRow>
                                            :
                                            data.length === 0
                                            ?
                                            <TableRow>
                                                <TableCell colSpan={6} align='center'>No Available Trainings</TableCell>
                                            </TableRow>
                                            :
                                            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                                                <TableRow key = {key}>
                                                    <TableCell>{row.training_name}</TableCell>
                                                    <TableCell>{row.venue}</TableCell>
                                                    <TableCell align='center'>{moment(row.period_from).format('MMMM DD,YYYY')}</TableCell>
                                                    <TableCell align='center'>{moment(row.period_to).format('MMMM DD,YYYY')}</TableCell>
                                                    <TableCell>{row.training_app}</TableCell>
                                                    <TableCell align='center'>
                                                    
                                                    {
                                                        matches
                                                        ?
                                                        <Box sx={{display:'flex',justifyContent:'center',gap:1}}>
                                                            <Tooltip title='View Dashboard Menu'><IconButton onClick={()=>handleTraining(row)}sx={{color:blue[800]}}className='custom-iconbutton'><DashboardCustomizeOutlinedIcon/></IconButton></Tooltip>

                                                            <Tooltip title='View Memo'><IconButton onClick={()=>viewFile(row.file_id,'Nomination Approval Memo')} color='secondary' className='custom-iconbutton'><AttachmentIcon/></IconButton></Tooltip>

                                                            <Tooltip title='Upload letter for not attending the training'><IconButton className='custom-iconbutton' onClick={()=>handleOpenNotAttended(row)}><PersonOffIcon/></IconButton></Tooltip>
                                                        </Box>
                                                        :
                                                        <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',gap:1}}>
                                                            <Tooltip title='View Dashboard Menu'><Button variant='contained' onClick={()=>handleTraining(row)}  startIcon={<DashboardCustomizeOutlinedIcon/>} className='custom-roundbutton'>Menu</Button></Tooltip>

                                                            <Tooltip title='View Memo'><Button variant='contained' onClick={()=>viewFile(row.file_id,'Nomination Approval Memo')} color='secondary' startIcon={<AttachmentIcon/>} className='custom-roundbutton'>Memo</Button></Tooltip>

                                                            <Tooltip title='Upload letter for not attending the training'><Button variant='contained' onClick={()=>handleOpenNotAttended(row)} startIcon={<PersonOffIcon/>}className='custom-roundbutton'>Absent</Button></Tooltip>
                                                        </Box>
                                                    }
                                                    

                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                        </Paper>
                    </Grid>
                    
                </Grid>
                <Dialog
                    fullScreen
                    open={openTrainingDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseTrainingDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Training Dashboard
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseTrainingDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        {
                            selectedData.training_type === 'In House'
                            ?
                            <Box sx={{ width: '100%' }} component={Paper}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        
                                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{'.Mui-selected':{fontWeight:'bold'}}}>
                                        <Tab label="Daily Output" {...a11yProps(0)}/>
                                        <Tab label="Evaluation" {...a11yProps(1)} />
                                        <Tab label="Learning Materials" {...a11yProps(2)} />
                                        <Tab label="Requirements" {...a11yProps(3)} />
                                        </Tabs>
                                    {/* <Tab label="Daily Output" {...a11yProps(0)}/>
                                    <Tab label="Evaluation" {...a11yProps(1)} />
                                    <Tab label="Learning Materials" {...a11yProps(2)} />
                                    <Tab label="Requirements" {...a11yProps(3)} /> */}
                                    {/* <Tab label="Evaluation MOV's" {...a11yProps(3)} /> */}
                                    {/* </Tabs> */}
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <DailyOutput data = {selectedData}/>
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <Evaluation data = {selectedData}/>
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <LearningMaterials data = {selectedData}/>
                                </TabPanel>
                                <TabPanel value={value} index={3}>
                                    <Requirements data = {selectedData} updateRqmt = {updateRqmt} refreshRqmt={refreshRqmt}/>
                                </TabPanel>
                                {/* <TabPanel value={value} index={4}>
                                    <EvaluationMOV data = {selectedData}/>
                                </TabPanel> */}
                            </Box>
                            
                            :
                            <Box sx={{ width: '100%' }} component={Paper}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        
                                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{'.Mui-selected':{fontWeight:'bold'}}}>
                                        <Tab label="Requirements" {...a11yProps(0)} />
                                        </Tabs>
                                    {/* <Tab label="Daily Output" {...a11yProps(0)}/>
                                    <Tab label="Evaluation" {...a11yProps(1)} />
                                    <Tab label="Learning Materials" {...a11yProps(2)} />
                                    <Tab label="Requirements" {...a11yProps(3)} /> */}
                                    {/* <Tab label="Evaluation MOV's" {...a11yProps(3)} /> */}
                                    {/* </Tabs> */}
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <Requirements data = {selectedData} updateRqmt = {updateRqmt} refreshRqmt={refreshRqmt}/>
                                </TabPanel>
                                {/* <TabPanel value={value} index={4}>
                                    <EvaluationMOV data = {selectedData}/>
                                </TabPanel> */}
                            </Box>
                        }
                        
                    </Box>

                </Dialog>
                <SmallModal open = {openNotAttendedModal} close = {handleCloseNotAttendedModal} title = 'Info'>
                    <NotAttendedTrainingModal id = {trainingDetailsID} close = {handleCloseNotAttendedModal}/>
                </SmallModal>
            </Box>
        }
        </>
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