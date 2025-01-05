import React,{useEffect, useState} from 'react';
import {Grid,Typography,Skeleton,Box,Paper,Button,Modal,Table,TableHead,TableContainer,TableRow,TableBody,IconButton,TextField,Tabs,TableFooter,TablePagination} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import {blue,red,green,orange, purple} from '@mui/material/colors'
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Shortlist from './Dialog/Shortlist';
import Add from './Modal/Add';
import { deleteTrainingDetails, generateShortlist, getAllAssignTrainer, getAvailableTrainings, getCompletedTrainee, getMetaTagsData, getTrainingEmpNames, getTrainings, getTrainingsDetails, getTrainingsDetailsTrainer, getTrainingTrainers, updateToEvaluateIDs } from './TrainingRequest';
import moment from 'moment';
import PrintIcon from '@mui/icons-material/Print';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import './Training.css'
import Swal from 'sweetalert2';
import Summary from './Dialog/Summary';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {toast} from 'react-toastify'
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ListIcon from '@mui/icons-material/List';
import PlaceIcon from '@mui/icons-material/Place';

import Shortlisted from './TablePagination/Shortlisted';
import Participants from './TablePagination/Participants';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import LearningMaterials from './Dialog/LearningMaterials';
import UpdateTrainingDetails from './Dialog/UpdateTrainingDetails';
import ReplayIcon from '@mui/icons-material/Replay';
import PreviewTraineeList from './Dialog/PreviewTraineeList';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import EnableEvaluation from './Tabs/EnableEvaluation';
import EvaluationResults from './Tabs/EvaluationResults';
import NominationApproval from './Dialog/NominationApproval';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { auditLogs } from '../../auditlogs/Request';
import DashboardLoading from '../../loader/DashboardLoading';
import TraineeEvaluation from './Tabs/TraineeEvaluation';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { viewFileAPI } from '../../../../viewfile/ViewFileRequest';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import AddTraining from './Modal/AddTraining';
import MediumModal from '../../custommodal/MediumModal';
import ExistingTrainingName from './Modal/ExistingTrainingName';
import LargeModal from '../../custommodal/LargeModal';
import { TrainingVenue } from './Modal/TrainingVenue';
// import TabPanel from '@mui/lab/TabPanel';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { APIError, APIWarning } from '../../customstring/CustomString';
import LoadingBackdrop from '../../customloading/LoadingBackdrop';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const InfoTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 13,
        paddingTop:'10px',
        paddingBottom:'10px',
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        },
    }));
export default function Training(){
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
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
    
    const [isLoading,setIsLoading] = useState(true)
    const [isLoadingData,setIsLoadingData] = useState(true)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [colSpan, setColSpan] = useState([]);
    const [filterDeptData, setFilterDeptData] = useState([]);
    const [selectedFilterDept, setSelectedFilterDept] = useState('');
    const [generatedShortlistData,setGeneratedShortlistData] = useState([])
    const [generatedShortlistTotalResData,setGeneratedShortlistTotalResData] = useState([])
    const [trainerScheduleData,setTrainerScheduleData] = useState([]);
    const [trainingDetailsData,setTrainingDetailsData] = useState([]);
    const [updateTrainingDialog,setUpdateTrainingDialog] = useState(false)
    const [openPrintInfoDialog,setOpenPrintInfoDialog] = useState(false)
    const [metaTagsData,setMetaTagsData] = useState([])
    const [existingTrainingData,setExistingTrainingData] = useState([])
    const [totalRecords,setTotalRecords] = useState(0)
    const [anchorEl2, setAnchorEl2] = useState([]);

    const handleClick2 = (item,id,event) => {
        console.log(item)
        let temp = [...anchorEl2];
        temp[id] = event.currentTarget
        setAnchorEl2(temp);
    };
    const handleClose2 = (id,event) => {
        let temp = [...anchorEl2];
        temp[id] = null
        setAnchorEl2(temp);
        // setAnchorEl([]);
    };
    useEffect(()=>{
        checkPermission(35)
        .then((response)=>{
            if(response.data){
                var logs = {
                    action:'ACCESS MANAGE TRAINING DETAILS',
                    action_dtl:'ACCESS MANAGE TRAINING DETAILS MODULE',
                    module:'MANAGE TRAINING DETAILS'
                }
                auditLogs(logs)
                setIsLoading(false)
                _init();

                getMetaTagsData()
                .then(res=>{
                    // console.log(res.data)
                    setMetaTagsData(res.data)
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
       
        // getTrainings()
        // .then(res=>{
        //     console.log(res.data)
        //     setData1(res.data)
        //     setData(res.data)
        //     const uniqueDept = [...new Set(res.data.map(item => item.short_name))];
        //     setFilterDeptData(uniqueDept);
            
        // }).catch(err=>{
        //     console.log(err)
        // })
    },[])
    const _init = () =>{
        var data2 = {
            page:page+1,
            perPage:rowsPerPage
        }
        getTrainingsDetails(data2)
        .then(res=>{
            console.log(res.data.data)
            setTrainingDetailsData(res.data.data.data)
            setTotalRecords(res.data.records.total)
            setIsLoadingData(false)

            Swal.close();

        }).catch(err=>{
            console.log(err)
        })    
    }
    const [open, setOpen] = useState(false);
    const [openAddTraining, setOpenAddTraining] = useState(false);
    const [data,setData] = useState([])
    const [data1,setData1] = useState([])
    const [trainingDetails,setTrainingDetails] = useState([])
    const [shortListDetails,setShortListDetails] = useState([])
    const [infoDialog,setInfoDialog] = useState(false)
    const [learningMaterialsDialog,setLearningMaterialsDialog] = useState(false)
    const [participantsDialog,setParticipantsDialog] = useState(false)
    const [participantsData,setParticipantsData] = useState([])
    const [selectedData,setSelectedData] = useState([])
    const handleOpen = () => {
        setOpen(true);

        /**
         * Check if has available training
         */
        // getAvailableTrainings()
        // .then(res=>{
        //     if(res.data.length === 0){
        //         Swal.fire({
        //             icon:'warning',
        //             title:'No Trainings Available',
        //             html:'All trainings may have been created.'
        //         })
        //     }else{
        //         setOpen(true);
        //     }
        // }).catch(err=>{
        //     console.log(err)
        // })
    }
    const handleOpenAddTraining = () =>{
        setOpenAddTraining(true)
    }
    const handleClose = () => setOpen(false);
    const handleCloseAddTraiing = () => setOpenAddTraining(false);
    const handleOpenLearningMaterials = (data) => {
        setSelectedData(data)
        setLearningMaterialsDialog(true)
    };
    const handleCloseLearningMaterials = () => setLearningMaterialsDialog(false);
    const handleInfoDialogOpen = async (data) => {
        console.log(data)
        try{
            setIsFetchingData(true)
            const res = await getTrainingTrainers({id:data.training_details_id});

            if(res.data.data.length>0){
                var temp = {
                    'cat':data.training_cat,
                    'type':data.training_type,
                    'app':data.training_app,
                    'trainers':res.data.data,
                    'rqmts':JSON.parse(data.training_rqmts),
                    'dept_slot_file':data.dept_slot_memo_file_id,
                    'memo_file':data.file_id,
                    'dept_info':JSON.parse(data.shortlist_details)
                }
                setInfo(temp)
                setIsFetchingData(false)
                setInfoDialog(true)
            }else{
                APIWarning('Trainer not found')
            }
        }catch(err){
            setIsFetchingData(false)
            APIError(err)
        }
    };
    const handleCloseInfoDialog = () => {
        setInfo({
            'cat':'',
            'type':'',
            'app':'',
            'rqmts':[],
            'trainers':[],
            'dept_slot_file':'',
            'memo_file':'',
            'dept_info':[]
        })
        setInfoDialog(false)
    };
    const [isFetchingData,setIsFetchingData] = useState(false)

    const handleOpenParticipantsDialog = async (data)=>{
        try{
            setIsFetchingData(true)
            const res = await getTrainingEmpNames({id:data.training_details_id})
            if(res.data.data.length>0){
                setSelectedTrainingID(data.training_details_id)
                setParticipantsData(res.data.data)
                setParticipantsDialog(true)
                setIsFetchingData(false)
            }else{
                APIWarning('List of trainee not found !')
                setIsFetchingData(false)
            }
            
        }catch(err){
            APIError(err)
            setIsFetchingData(false)

        }
        
    }
    const handleCloseParticipantsDialog = () =>{
        setParticipantsDialog(false)
    }
    const handleDialogOpen = (data) =>{
        // event.preventDefault();
        var trainer_name = '';
        console.log(data)
        data.trainer.forEach(el => {
            trainer_name = trainer_name+el.lname+', '+el.fname+' ;'
        });
        data.trainer_name = trainer_name
        setTrainingDetails(data)
        Swal.fire({
            icon:'info',
            title:'Generating Shortlist',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        generateShortlist(data)
        .then(res=>{
            if(res.data.total_result.length ===0){
                Swal.fire({
                    icon:'error',
                    title:'No data found',
                    html:'Please try different meta tags'
                })
            }else{
                // setGeneratedShortlistData(res.data.data)
                setGeneratedShortlistTotalResData(res.data.total_result)
                console.log(res.data.total_result)
                Swal.close()
                setOpenDialog(true);
            }
            // console.log(res.data) 
            
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })

    }
    const handleSaveShortlist = (data)=>{
        setShortListDetails(data)
        setOpenSummaryDialog(true)
        // console.log(data)
        // var temp = [];
        // for(var x=0;x<data.total_selected_per_dept.length;x++){
        //     if(data.total_selected_per_dept[x].total>0){
        //         temp.push({
        //             dept_name:data.total_selected_per_dept[x].dept_name,
        //             // total_search:props.shortListDetails.total_search_results[x].total,
        //             total_selected:data.total_selected_per_dept[x].total,
        //             slot:0
        //         })
        //         break;
        //     }
        // }
        // console.log(temp)
    }
    const [openDialog, setOpenDialog] = useState(false);
    const [openSummaryDialog, setOpenSummaryDialog] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleCloseSummaryDialog = () => {
        setOpenSummaryDialog(false);
    };
    
    const handleChangePage = async (event, newPage) => {
        setIsLoadingData(true)
        setPage(newPage);
        var data2 = {
            page:newPage+1,
            perPage:rowsPerPage
        }
        const res = await getTrainingsDetails(data2)
        setTrainingDetailsData(res.data.data.data)
        setIsLoadingData(false)
        // setTotalRecords(res.data.records.total)

    };
    
    const handleChangeRowsPerPage = async (event) => {
        setIsLoadingData(true)
        setRowsPerPage(event.target.value);
        setPage(0);
        var data2 = {
            page:1,
            perPage:event.target.value
        }
        const res = await getTrainingsDetails(data2)
        setTrainingDetailsData(res.data.data.data)
        setIsLoadingData(false)
    };
    const [info,setInfo] = useState({
        'cat':'',
        'type':'',
        'app':'',
        'rqmts':[],
        'trainers':[],
        'dept_slot_file':'',
        'memo_file':'',
        'dept_info':[]

    })
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const [openEnableEvaluationDialog,setOpenEnableEvaluationDialog] = useState(false)
    const [enabledIds,setEnabledIds] = useState([])
    const [trainerData,setTrainerData] = useState([])
    const [selectedTrainingID,setSelectedTrainingID] = useState('')
    const [selectedTrainingName,setSelectedTrainingName] = useState('')
    const [lastDayEvaluation,setLastDayEvaluation] = useState(false)
    const handleOpenEnableEvaluaDialog = (data)=>{
        console.log(data)
        setLoadingEnableEvaluation(true);
        setSelectedTrainingID(data.training_details_id)
        setSelectedTrainingName(data.training_name)
        setOpenEnableEvaluationDialog(true)
        getAllAssignTrainer(data.training_details_id)
        .then(res=>{
            // setEnabledIds(res.data.enabled_ids)
            setTrainerData(res.data.trainer_data)
            var temp=[];
            res.data.trainer_data.forEach(el => {
                if(el.enabled_evaluation){
                    temp.push(el.trainer_schedule_id);
                }
            });
            console.log(temp)
            setEnabledIds(temp)
            setLastDayEvaluation(res.data.last_day_evaluation === 0?false:true)
            console.log(res.data)
            setLoadingEnableEvaluation(false)
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleCloseEnableEvaluaDialog = ()=>{
        setOpenEnableEvaluationDialog(false)
    }
    const handleSetEnabled = (id) =>{
        if(enabledIds.includes(id)){
            var temp = [...enabledIds];
            var index = temp.indexOf(id);

            temp.splice(index,1);
            setEnabledIds(temp)
        }else{
            var temp = [...enabledIds];
            temp.push(id)
            setEnabledIds(temp)
        }
    }
    const handleSaveEnabled = ()=>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText:'No'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Saving data',
                    html:'Please wait...',
                    allowOutsideClick:false,
                    allowEscapeKey:false
                })
                Swal.showLoading();
                var data2 = {
                    data:enabledIds,
                    id:selectedTrainingID,
                    last_day_evaluation:lastDayEvaluation
                }
                console.log(data2)
                // Swal.close();
                updateToEvaluateIDs(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        // setEnabledIds(res.data.data.enabled_ids)
                        var temp=[];
                        res.data.data.trainer_data.forEach(el => {
                            if(el.enabled_evaluation){
                                temp.push(el.trainer_schedule_id);
                            }
                        });
                        // console.log(temp)
                        setEnabledIds(temp)
                        setTrainerData(res.data.data.trainer_data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                })
            } 
          })
        
    }
    const [selectedTrainingToUpdate,setSelectedTrainingToUpdate] = useState([])
    const handleUpdateTrainingDetails = (row)=>{
        console.log(row)
        setSelectedTrainingToUpdate(row)
        setUpdateTrainingDialog(true)
    }
    const handleCloseUpdateTrainingDialog = ()=>{
        setUpdateTrainingDialog(false)
    }
    const handleDeleteTrainingDetails = (data)=>{
        Swal.fire({
            icon:'warning',
            title: 'Do you want to delete this training details ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor:green[800],
            cancelButtonColor:red[800],
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire({
                icon:'info',
                title:'Deleting training details',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
              })
              Swal.showLoading();

              var data2 = {
                training_details_id:data.training_details_id,
                training_id:data.training_id,
              }
              deleteTrainingDetails(data2)
              .then(res=>{
                if(res.data.status === 200){
                    // setTrainingDetailsData(res.data.data)
                    _init();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message,
                    })
                }
              }).catch(err=>{
                Swal.close();
                console.log(err)
              })
            }
          })
    }
    const handleReloadData = () =>{
        Swal.fire({
            icon:'info',
            title:'Reloading Data',
            html:'Please wait...'
        })
        Swal.showLoading()
        
        var data2 = {
            page:page+1,
            perPage:rowsPerPage
        }
        _init();
        // getTrainingsDetails(data2)
        // .then(res=>{
        //     setTrainingDetailsData(res.data.data)
        //     setTotalRecords(res.data.records.total)
        //     setIsLoadingData(false)
        // }).catch(err=>{
        //     console.log(err)
        // })
    }
    const [loadingEnableEvaluation,setLoadingEnableEvaluation] = useState(true);
    const [traineeNames,setTraineeNames] = useState([]);
    const [traineeIds,setTraineeIds] = useState([]);
    const [compRqmt,setCompRqmt] = useState([]);
    const [compEvaluation,setCompEvaluation] = useState([]);
    const handleClosePrintInfoDialog = () =>{
        setOpenPrintInfoDialog(false)
    }
    const handlePreviewPrint = (data)=>{
        // console.log(data)
        Swal.fire({
            icon:'info',
            title:'Loading data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        var data2 = {
            training_details_id:data.training_details_id,
            training_rqmts:data.training_rqmts,
            trainer_ids:data.trainer_ids,
        }
        console.log(data2)
        getCompletedTrainee(data2)
        .then(res=>{
            // setTraineeList(res.data)
            setTraineeNames(res.data)
            // setTraineeIds(res.data.comp_ids)
            // setCompRqmt(res.data.comp_rqmt)
            // setCompEvaluation(res.data.comp_evaluation)
            setOpenPrintInfoDialog(true)
            Swal.close();

        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    
    const [evaluationTabValue, setEvaluationTabValue] = useState(0);

    const handleChangeEvaluationTab = (event, newValue) => {
        setEvaluationTabValue(newValue);
    };
    const viewFile = (id,name)=>{
        viewFileAPI(id,name);
    }
    const [openListOfTrainingModal,setOpenListOfTrainingModal] = useState(false)
    const handleOpenViewTraining = () =>{
        setOpenListOfTrainingModal(true)
    }
    const handleCloseViewTraining = () =>{
        setOpenListOfTrainingModal(false)
    }
    const [openVenue,setOpenVenue] = useState(false);
    const handleOpenViewLocations = () => {
        setOpenVenue(true)
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    return(
        <Box>
        {
            isLoading
            ?
            <Box sx={{margin:'0 10px 10px 10px'}}>
            <DashboardLoading actionButtons={3}/>
            </Box>
            :
            <Box sx={{margin:'0 10px 10px 10px'}}>
                <Grid container>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                    
                        <ModuleHeaderText title='Manage Training'/>
                    </Grid>
                    <br/> */}
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:1,gap:1}}>
                         <Button
                            id="basic-button"
                            aria-controls={openMenu ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenu ? 'true' : undefined}
                            onClick={handleClickMenu}
                            variant='contained'
                            endIcon={<ArrowDropDownIcon/>}
                            className='custom-roundbutton'
                            // color='secondary'
                        >
                            Actions
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleCloseMenu}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                    
                        >
                            <MenuItem onClick={handleOpen}>
                                <ListItemIcon color="success">
                                    <AddOutlinedIcon color="success" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Create Training Details</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleOpenViewTraining}>
                                <ListItemIcon color="success">
                                    <ModelTrainingIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>View Trainings</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleOpenViewLocations}>
                                <ListItemIcon color="success">
                                    <PlaceIcon color="info" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Training Venue</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleReloadData}>
                                <ListItemIcon color="success">
                                    <ReplayIcon color="info" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Reload Data</ListItemText>
                            </MenuItem>
                        </Menu>
                        {/* <Tooltip title = 'Create Training Details'><IconButton sx={{color:green[800],'&:hover':{color:'#fff',background:green[800]}}} onClick={handleOpen}className='custom-iconbutton'><AddOutlinedIcon/></IconButton></Tooltip>

                        <Tooltip title = 'View Trainings'><IconButton sx={{color:blue[800],'&:hover':{color:'#fff',background:blue[800]}}}onClick={handleOpenViewTraining} className='custom-iconbutton'><ModelTrainingIcon/></IconButton></Tooltip>

                        <Tooltip title = 'Training Venue'><IconButton sx={{color:blue[800],'&:hover':{color:'#fff',background:blue[800]}}} onClick={handleOpenViewLocations} className='custom-iconbutton'><PlaceIcon/></IconButton></Tooltip>

                        <Tooltip title = 'Reload Data'><IconButton variant='outlined' sx={{color:blue[600],'&:hover':{color:'#fff',background:blue[600]}}} onClick={handleReloadData} className='custom-iconbutton'><ReplayIcon/></IconButton></Tooltip> */}
                    </Grid>
                    <Paper sx={{ width: '100%',mt:2}}>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell rowSpan={2}>
                                            Training Name
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2}>
                                            Training Venue
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2}>
                                            Participants
                                        </StyledTableCell>
                                        <StyledTableCell colSpan={2} align='center'>
                                            Training Period
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2} align='center'>
                                            Action
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell align='center'>From</StyledTableCell>
                                        <StyledTableCell align='center'>To</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        isLoadingData
                                        ?
                                        <React.Fragment>
                                        <TableRow>
                                            <TableCell align='center' colSpan={6}>
                                                <Skeleton variant='rounded' height={40} animation='wave'/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='center' colSpan={6}>
                                                <Skeleton variant='rounded' height={40} animation='wave'/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='center' colSpan={6}>
                                                <Skeleton variant='rounded' height={40} animation='wave'/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='center' colSpan={6}>
                                                <Skeleton variant='rounded' height={40} animation='wave'/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='center' colSpan={6}>
                                                <Skeleton variant='rounded' height={40} animation='wave'/>
                                            </TableCell>
                                        </TableRow>
                                        
                                        </React.Fragment>
                                        :
                                        trainingDetailsData.length > 0
                                        ?
                                        trainingDetailsData.map((item)=>
                                            <TableRow key = {item.training_details_id} hover>
                                                <StyledTableCell>
                                                    {item.training_name}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {item.venue}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {item.participants}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {moment(item.period_from).format('MMMM DD, YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {moment(item.period_to).format('MMMM DD, YYYY')}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>

                                                    <Box sx={{display:'flex',justifyContent:'space-around'}}>
                                                    {/* <Tooltip title='Update Training Details'><span><IconButton onClick={()=>handleUpdateTrainingDetails(item)} className='custom-iconbutton' disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') >= moment(item.period_to,'YYYY-MM-DD').format('YYYY-MM-DD') || item.approved ? true:false} ><EditOutlinedIcon color={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') >= moment(item.period_to,'YYYY-MM-DD').format('YYYY-MM-DD') || item.approved ? 'disabled':'success'}/></IconButton></span>
                                                    </Tooltip> */}

                                                    {/* <Tooltip title="Can't Delete Approved Training Details"><span>
                                                        <IconButton onClick={()=>handleDeleteTrainingDetails(data)} className='custom-iconbutton' disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') >= moment(data.period_from,'YYYY-MM-DD').format('YYYY-MM-DD') || data.approved? true:false}><DeleteOutlineOutlinedIcon color={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') >= moment(data.period_from,'YYYY-MM-DD').format('YYYY-MM-DD') || data.approved ? 'disabled':'error'}/></IconButton></span></Tooltip> */}

                                                    {/* {
                                                        item.approved
                                                        ?
                                                      
                                                        <Tooltip title="Can't Delete Approved Training Details"><span>
                                                        <IconButton disabled><DeleteOutlineOutlinedIcon color={item.approved ? 'disabled':'error'}/></IconButton></span></Tooltip>
                                                        :
                                                        <Tooltip title='Delete Training Details'><span>
                                                        <IconButton onClick={()=>handleDeleteTrainingDetails(item)} className='custom-iconbutton'><DeleteOutlineOutlinedIcon color='error'/></IconButton></span></Tooltip>
                                                    } */}
                                                    
                                                     

                                                    {/* <Tooltip title={<Box><ul className='ul-list'><li>View Shortlist</li><li>View Approved Shortlist</li><li>View Requirements</li><li>Print Trainee List</li><li>Post Training to employee PDS</li></ul></Box>}><IconButton onClick={()=>handleOpenParticipantsDialog(item)} className='custom-iconbutton'><PeopleOutlinedIcon color='primary'/></IconButton></Tooltip>
                                                    <Tooltip title={<Box><ul className='ul-list'><li>Enable Speaker Evaluation</li><li>View Evaluation Results</li><li>View Trainee Evaluation</li></ul></Box>}><IconButton onClick={()=>handleOpenEnableEvaluaDialog(item)} className='custom-iconbutton'><FactCheckOutlinedIcon/></IconButton></Tooltip> */}
                                                    {/* <Tooltip title ='Learning Materials'>
                                                        <IconButton sx={{color:orange[800]}} onClick={()=>handleOpenLearningMaterials(item)} className='custom-iconbutton'>
                                                            <DesignServicesOutlinedIcon/>
                                                        </IconButton>
                                                    </Tooltip> */}
                                                    {/* <Tooltip title='View Training Info'><IconButton onClick={()=>handleInfoDialogOpen(item)} className='custom-iconbutton'><InfoOutlinedIcon color='primary'/></IconButton></Tooltip>
                                                    <Tooltip title='Print List of Trainee'><IconButton onClick={()=>handlePreviewPrint(item)} className='custom-iconbutton'><PrintIcon color='primary'/></IconButton></Tooltip> */}
                                                    </Box>

                                                    <IconButton
                                                        id={item.training_details_id}
                                                        aria-controls={Boolean(item.training_details_id)}
                                                        aria-haspopup="true"
                                                        aria-modal = "true"
                                                        aria-expanded={Boolean(item.training_details_id)}
                                                        onClick={(e)=>handleClick2(item,item.training_details_id,e)}
                                                        variant="contained"
                                                        color="secondary"
                                                        // size="small"
                                                        className="custom-iconbutton"
                                                        // endIcon={<ArrowDropDownIcon/>}
                                                        sx={{'&:hover':{color:'#fff',background:purple[800]}}}
                                                    >
                                                        <MoreVertIcon/>
                                                    </IconButton>
                                                    <Menu
                                                        id={item.training_details_id}
                                                        anchorEl={anchorEl2[item.training_details_id]}
                                                        open={Boolean(anchorEl2[item.training_details_id])}
                                                        onClose={(e)=>handleClose2(item.training_details_id,e)}
                                                        MenuListProps={{
                                                            'aria-labelledby': `basic-button-${item.training_details_id}`,
                                                        }}
                                                        keepMounted
                                                    >
                                                        <Tooltip title='View Approved Trainee'>
                                                        <span>
                                                        <MenuItem size='small' onClick={()=>handleUpdateTrainingDetails(item)}disabled={moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD') >= moment(item.period_to,'YYYY-MM-DD').format('YYYY-MM-DD') || item.approved ? true:false}>
                                                            <ListItemIcon>
                                                                <EditOutlinedIcon color='success' fontSize="small"/>
                                                            </ListItemIcon>
                                                            <ListItemText>Update Training Details</ListItemText>
                                                        </MenuItem>
                                                        </span>
                                                        </Tooltip>

                                                        {
                                                            item.approved
                                                            ?
                                                            <Tooltip title="Can't Delete Approved Training Details">
                                                            <span>
                                                            <MenuItem size='small' disabled>
                                                                <ListItemIcon>
                                                                    <DeleteOutlineOutlinedIcon color='error' fontSize="small"/>
                                                                </ListItemIcon>
                                                                <ListItemText>Delete</ListItemText>
                                                            </MenuItem>
                                                            </span>
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title='Delete Approved Training Details'>
                                                            <span>
                                                            <MenuItem size='small' onClick={()=>handleDeleteTrainingDetails(item)}>
                                                                <ListItemIcon>
                                                                    <DeleteOutlineOutlinedIcon color='error' fontSize="small"/>
                                                                </ListItemIcon>
                                                                <ListItemText>Delete</ListItemText>
                                                            </MenuItem>
                                                            </span>
                                                            </Tooltip>
                                                        }
                                                        <Tooltip title={<Box><ul className='ul-list'><li>View Shortlist</li><li>View Approved Shortlist</li><li>View Requirements</li><li>Print Trainee List</li><li>Post Training to employee PDS</li></ul></Box>}>
                                                        <MenuItem size='small' onClick={()=>handleOpenParticipantsDialog(item)}>
                                                            <ListItemIcon>
                                                                <PeopleOutlinedIcon color='primary' fontSize="small"/>
                                                            </ListItemIcon>
                                                            <ListItemText>Trainee's</ListItemText>
                                                        </MenuItem>
                                                        </Tooltip>

                                                        <Tooltip title={<Box><ul className='ul-list'><li>Enable Speaker Evaluation</li><li>View Evaluation Results</li><li>View Trainee Evaluation</li></ul></Box>}>
                                                        <MenuItem size='small' onClick={()=>handleOpenEnableEvaluaDialog(item)}>
                                                            <ListItemIcon>
                                                                <FactCheckOutlinedIcon color='primary' fontSize="small"/>
                                                            </ListItemIcon>
                                                            <ListItemText>Evaluation</ListItemText>
                                                        </MenuItem>
                                                        </Tooltip> 
                                                        
                                                        <Tooltip title='View Learning Materials'>
                                                        <MenuItem size='small' onClick={()=>handleOpenLearningMaterials(item)}>
                                                            <ListItemIcon>
                                                                <DesignServicesOutlinedIcon sx={{color:orange[800]}} fontSize="small"/>
                                                            </ListItemIcon>
                                                            <ListItemText>Learning Materials</ListItemText>
                                                        </MenuItem>
                                                        </Tooltip>

                                                        <Tooltip title='View Training Info'>
                                                        <MenuItem size='small' onClick={()=>handleInfoDialogOpen(item)}>
                                                            <ListItemIcon>
                                                                <InfoOutlinedIcon color='info' fontSize="small"/>
                                                            </ListItemIcon>
                                                            <ListItemText>Training Info</ListItemText>
                                                        </MenuItem>
                                                        </Tooltip>

                                                        <Tooltip title='Print List of Trainee'>
                                                        <MenuItem size='small' onClick={()=>handlePreviewPrint(item)}>
                                                            <ListItemIcon>
                                                                <PrintIcon color='info' fontSize="small"/>
                                                            </ListItemIcon>
                                                            <ListItemText>Print</ListItemText>
                                                        </MenuItem>
                                                        </Tooltip>
                                                    </Menu>
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                        
                                        :
                                        <TableRow>
                                            <TableCell align='center' colSpan={6}>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                        
                                    }
                                    
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={6}
                                        count={totalRecords}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                            'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                        />

                                    </TableRow>
                                    </TableFooter>
                            </Table>
                        </TableContainer>
                    </Grid>
                    </Paper>
                </Grid>
                <MediumModal open={openListOfTrainingModal} close ={handleCloseViewTraining} title='List of Trainings'>
                    <ExistingTrainingName metaTagsData = {metaTagsData}/>
                </MediumModal>
                {/* <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpen(false)}/>

                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Create training Details
                        </Typography>
                        <Box sx={{mt:2,pt:0,pl:matches?2:4,pr:matches?2:4,pb:2,maxHeight:'70vh',overflowY:'scroll'}}>
                            <Add handleDialogOpen = {handleDialogOpen}/>
                        </Box>
                    </Box>
                </Modal> */}
                <MediumModal open={open} close = {()=> setOpen(false)} title='Create training Details'>
                    <Box sx={{m:1,p:1,maxHeight:'70vh',overflowY:'scroll'}}>
                        <Add handleDialogOpen = {handleDialogOpen}/>
                    </Box>
                </MediumModal>
                <MediumModal open = {openAddTraining} close = {()=> setOpenAddTraining(false)} title='Adding Training'>
                    <Box sx={{m:1}}>
                    <AddTraining metaTagsData = {metaTagsData} close = {()=> setOpenAddTraining(false)} setExistingTrainingData = {setExistingTrainingData}/>
                    </Box>

                </MediumModal>
                <MediumModal open = {openVenue} close = {()=>setOpenVenue(false)} title='List of Trainings Venue'>
                    <TrainingVenue close = {()=>setOpenVenue(false)}/>
                </MediumModal>
                {/* <Modal
                    open={openAddTraining}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setOpenAddTraining(false)}/>

                        <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Adding Training
                        </Typography>
                        <Box sx={{p:2}}>
                            <AddTraining metaTagsData = {metaTagsData} close = {()=> setOpenAddTraining(false)}/>
                        </Box>
                    </Box>
                </Modal> */}
                <Dialog
                    fullScreen
                    open={openDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Generated Shortlist
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Shortlist data = {generatedShortlistData} total_results = {generatedShortlistTotalResData} handleSaveShortlist = {handleSaveShortlist} setTrainerScheduleData ={setTrainerScheduleData} close={handleCloseDialog} />
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={openSummaryDialog}
                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseSummaryDialog}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Training Details Summary
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseSummaryDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Summary trainingDetails = {trainingDetails} shortListDetails = {shortListDetails} setTrainerScheduleData={setTrainerScheduleData} trainerScheduleData = {trainerScheduleData} closeSummary = {handleCloseSummaryDialog} closeShortList = {handleCloseDialog} closeModal = {handleClose} setTrainingDetailsData = {setTrainingDetailsData} init = {_init}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={infoDialog}
                    sx={{width:matches?'100%':'25vw',height:'100%',right:0,left:'auto'}}

                    onClose={handleCloseInfoDialog}
                    TransitionComponent={InfoTransition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <InfoOutlinedIcon/>

                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Training Info
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseInfoDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField label='Training/Scholarship' defaultValue={info.cat} inputProps={{readOnly:true}} fullWidth/>
                                {/* <Typography><ArrowRightOutlinedIcon/>{info.cat}</Typography> */}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Training Type' defaultValue={info.type} inputProps={{readOnly:true}} fullWidth/>
                                {/* <Typography><ArrowRightOutlinedIcon/>{info.type}</Typography> */}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Training Application' defaultValue={info.app} inputProps={{readOnly:true}} fullWidth/>
                                {/* <Typography><ArrowRightOutlinedIcon/>{info.app}</Typography> */}
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Typography><ArrowRightOutlinedIcon/>Requirements</Typography>
                                {
                                info.rqmts.map((data,key)=>
                                <Typography key ={key} sx={{fontSize:'.8rem',ml:3}}>
                                    <CircleOutlinedIcon sx={{fontSize:'.8rem',color:'#000'}}/> {data}
                                </Typography>
                                )
                                }
                            </Grid> */}
                            <Grid item xs={12}>
                                <Typography><ArrowRightOutlinedIcon/>Department/Slot</Typography>
                                {
                                info.dept_info.map((data,key)=>
                                <Typography key ={key} sx={{fontSize:'.8rem',ml:3}}>
                                    <CircleOutlinedIcon sx={{fontSize:'.8rem',color:'#000'}}/> {data.dept_name} - {data.slot}
                                </Typography>
                                )
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Typography><ArrowRightOutlinedIcon/>Trainer/s</Typography>
                                {
                                info.trainers.map((data,key)=>
                                <Typography key ={key} sx={{fontSize:'.8rem',ml:3}}>
                                    <CircleOutlinedIcon sx={{fontSize:'.8rem',color:'#000'}}/> {data.lname}, {data.fname}
                                </Typography>
                                )
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='outlined' fullWidth startIcon={<AttachmentIcon/>} onClick={()=>viewFile(info.dept_slot_file,'Dept Slot Memo')} disabled={info.dept_slot_file?false:true}>Dept Slot Memo</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='outlined' fullWidth startIcon={<AttachmentIcon/>} onClick={()=>viewFile(info.memo_file,'Nomination Approval Memo')} disabled={info.memo_file?false:true}>Nomination Approval Memo</Button>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Button variant='outlined' sx={{float:'right'}} fullWidth>Enable Evaluation</Button>
                            </Grid> */}
                        </Grid>
                            
                            
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={openEnableEvaluationDialog}
                    // sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}

                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <FactCheckOutlinedIcon/>

                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Manage Evaluation
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseEnableEvaluaDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={evaluationTabValue} onChange={handleChangeEvaluationTab} aria-label="manage evaluation tabs" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{'.Mui-selected':{fontWeight:'bold'}}}>
                                <Tab label="Enable Speaker Evaluation" {...a11yProps(0)} />
                                <Tab label="Evaluation Results" {...a11yProps(1)} />
                                <Tab label="Trainee Evaluation" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={evaluationTabValue} index={0}>
                                <EnableEvaluation trainerData = {trainerData} handleSetEnabled = {handleSetEnabled} lastDayEvaluation = {lastDayEvaluation} setLastDayEvaluation = {setLastDayEvaluation} enabledIds = {enabledIds}  handleSaveEnabled = {handleSaveEnabled} loadingEnableEvaluation = {loadingEnableEvaluation}/>
                            </TabPanel>
                            <TabPanel value={evaluationTabValue} index={1}>
                                <EvaluationResults selectedTrainingID = {selectedTrainingID} selectedTrainingName = {selectedTrainingName}/>
                            </TabPanel>
                            <TabPanel value={evaluationTabValue} index={2}>
                                <TraineeEvaluation selectedTrainingID = {selectedTrainingID}/>
                            </TabPanel>
                        </Box>

                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={participantsDialog}
                    // sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}

                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <PeopleOutlinedIcon/>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Shortlist Info
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseParticipantsDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:1}}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box component={Paper}>
                                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="shortlist info tabs" variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{'.Mui-selected':{fontWeight:'bold'}}}>
                                        <Tab label="Shortlisted" {...a11yProps(0)}/>
                                        <Tab label="Approved Shortlist" {...a11yProps(1)} />
                                        {/* <Tab label="Nomination Approval" {...a11yProps(2)} /> */}
                                        
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={tabValue} index={0}>
                                        <Shortlisted rows = {participantsData} id = {selectedTrainingID}/>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <Participants rows = {participantsData} />
                                    </TabPanel>
                                    {/* <TabPanel value={tabValue} index={2}>
                                        <NominationApproval id = {selectedTrainingID}/>
                                    </TabPanel> */}
                                    
                                </Box>
                            </Grid>
                        </Grid>
                            
                            
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={learningMaterialsDialog}
                    // sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}

                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <DesignServicesOutlinedIcon/>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Learning Materials
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseLearningMaterials}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <LearningMaterials data = {selectedData}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={updateTrainingDialog}
                    // sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}

                    // onClose={handleCloseDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <EditOutlinedIcon/>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Updating Training Details
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleCloseUpdateTrainingDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <UpdateTrainingDetails close = {handleCloseUpdateTrainingDialog} data = {selectedTrainingToUpdate} setTrainingDetailsData = {setTrainingDetailsData} init = {_init}/>
                    </Box>

                </Dialog>
                <Dialog
                    fullScreen
                    open={openPrintInfoDialog}

                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'sticky',top:0 }}>
                    <Toolbar>
                        <PrintIcon/>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Preview Trainee List Info
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClosePrintInfoDialog}>
                        close
                        </Button>
                    </Toolbar>
                    </AppBar>
                    <Box sx={{m:2}}>
                        <PreviewTraineeList traineeNames = {traineeNames}/>
                    </Box>

                </Dialog>
                <LoadingBackdrop title = 'Loading Data' open = {isFetchingData}/>
            </Box>
        }
        </Box>
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
            {children}
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
  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
      
    );
  }