import { Box, Typography,Fade,Grid,Skeleton,Stack,Paper,Button,Tooltip,Modal,IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Dialog,AppBar,Toolbar,Slide, TextField} from '@mui/material';
import React, { useEffect,useRef,useState } from 'react';
import { checkPermission } from '../permissionrequest/permissionRequest';
import { approvedCOCApplication, disapprovedCOCApplication, getAllCOCData, getCOCEarningHistory } from './COCRequest';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import ReactToPrint,{useReactToPrint} from 'react-to-print';

//icon
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FeedIcon from '@mui/icons-material/Feed';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import AddCOCForm from './Modal/AddCOCForm';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import axios from 'axios';
import TableLoader from '../dashboard/tableloader/TableLoader';
import { PrintForm } from './PrintForm';
import DashboardLoading from '../loader/DashboardLoading';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
import { PrintFormHistory } from './PrintFormHistory';
import Swal from 'sweetalert2';
import {blue,orange,green} from '@mui/material/colors';
import EarningDetails from './Dialog/EarningDetails';
import { viewFileAPI } from '../../../viewfile/ViewFileRequest';
import DisapprovedModal from '../../../modalcomponents/disapproved/DisapprovedModal';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ManageCOCApproval(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // navigate
    const addModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':350,
            // width: '100%',

        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
    };
    const navigate = useNavigate()
    const customStyle = {
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
    const [isLoading,setisLoading] = React.useState(true)
    const [addModal,setAddModal] = React.useState(false)
    const [data,setData] = React.useState([])
    const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
    const [printInfo,setPrintInfo] = useState([])
    const [historyData,setHistoryData] = useState([])
    const [applicationData,setApplicationData] = useState([])
    const [dateEarned,setDateEarned] = useState()
    const [hours,setHours] = useState()
    const [memoID,setMemoID] = useState()
    const [employeeInfoPrint,setEmployeeInfoPrint] = useState({
        data:{
            name:'',
            position_name:'',
            month_name:'',
            year:'',
            expiration:''
        },
        ledger:[],
        balance:0
    })
    const [employeeInfoReview,setEmployeeInfoReview] = useState({
        data:{
            name:'',
            position_name:'',
            month_name:'',
            year:'',
            expiration:''
        },
        ledger:[],
        balance:0
    })
    const printHistoryRef = useRef();
    const fetchUsers = async page => {
		setLoading(true);

		const response = await axios.get(`api/managecoc/getPaginateCOCData?page=${page}&per_page=${perPage}`);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		fetchUsers(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setLoading(true);
        
		const response = await axios.get(`api/managecoc/getPaginateCOCData?page=${page}&per_page=${newPerPage}`);

		setData(response.data.data);
		setPerPage(newPerPage);
		setLoading(false);
	};
    useEffect(()=>{
        checkPermission(66)
        .then((response)=>{
            // console.log(response.data)
            setisLoading(false)
            if(response.data){
                fetchUsers(1)
                var t_data = {
                    type:'approved'
                }
                getCOCEarningHistory(t_data)
                .then(res=>{
                    console.log(res.data)
                    setHistoryData(res.data.data)
                    setApplicationData(res.data.application)
                }).catch(err=>{
                    console.log(err)
                })
                // getAllCOCData()
                // .then(respo=>{
                //    const data = respo.data
                //    setData(data)
                //    console.log(data)
                // }).catch(err=>{
                //     console.log(err)
                // })
            }else{
                navigate('/')
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const columns = [
        {
            name:'COC ID',
            selector:row => row.coc_id
        },
        {
            name:'Employee ID',
            selector:row => row.employee_id
        },
        {
            name:'Name',
            selector:row => row.fname+' '+row.mname.charAt(0)+'. '+row.lname
        },
        {
            name:'Hours Earned',
            selector:row => row.hours_earned
        },
        {
            name:'Date Earned',
            selector:row => moment(row.date_earned).format('MMMM DD,YYYY')
        },
        {
            name:'Valid Until',
            selector:row => moment(row.expiration).format('MMMM DD,YYYY')
        },
        {
            name:'Added By',
            selector:row => row.added_by
        },
        {
            name:'Action',
            selector:row =>
            <Tooltip title='Print'><LocalPrintshopOutlinedIcon sx={{borderRadius:'50%',cursor:'pointer',color:'#0077d6','&:hover':{color:'#209cff'}}} onClick = {()=>printForm(row)}/>
            </Tooltip>
        },
    ]
    const printForm = (data) =>{
        setPrintInfo(data)
        console.log(data)
    }
    const insertNewData = (value)=>{
        data.push(value)
    }
    const handlePrint = (row)=>{
        console.log(row)
        var temp = {...employeeInfoPrint}
        temp.ledger = JSON.parse(row.data)
        temp.data = {
            name:row.name,
            position_name:row.position_name,
            month_name:row.month_name,
            year:row.year,
            expiration:row.expiration,
            dept_head_name:row.dept_head_name,
            dept_head_pos:row.dept_head_pos,
            date_earned:row.created_at,
        }
        setEmployeeInfoPrint(temp)
        setDateEarned(row.created_at)
        setHours(row.earned)
    }
    useEffect(()=>{
        if(employeeInfoPrint.ledger.length !==0){
            reactToPrintCOCHistory()
        }
    },[employeeInfoPrint])
    const reactToPrintCOCHistory  = useReactToPrint({
        content: () => printHistoryRef.current,
        documentTitle:'COC '+employeeInfoPrint.data.name+' '+employeeInfoPrint.data.month_name+'-'+employeeInfoPrint.data.year
    });
    
    const [open, setOpen] = React.useState(false);
    const [openEarningDtls, setOpenEarningDtls] = React.useState(false);
    const [dateEarnedReview,setDateEarnedReview] = useState('')
    const [hoursReview,setHoursReview] = useState('')
    const [selectedReviewID,setSelectedReviewID] = useState('');
    const [earningDtl,setEarningDtl] = useState([])
    const handleClickOpen = () => {
    };
    const handlePreview = (row)=>{
        console.log(row)
        var temp = {...employeeInfoPrint}
        temp.ledger = JSON.parse(row.data)
        temp.data = {
            name:row.name,
            position_name:row.position_name,
            month_name:row.month_name,
            year:row.year,
            expiration:row.expiration,
            dept_head_name:row.dept_head_name,
            dept_head_pos:row.dept_head_pos,
            date_earned:row.created_at,
            file_ids:row.file_ids
        }
        console.log(temp)
        setEarningDtl(row)
        setEmployeeInfoReview(temp)
        setDateEarnedReview(row.created_at)
        setHoursReview(row.earned)
        setSelectedReviewID(row.coc_application_id)
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseEarningDtls = () => {
        setOpenEarningDtls(false);
    };
    const handleApproved = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'question',
            title:'Confirm approved ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Approving COC application',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var t_data = {
                    id:row.coc_application_id,
                    data:employeeInfoReview,
                    application:row,
                    type:'approver'
                }
                console.log(t_data)
                approvedCOCApplication(t_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                        setHistoryData(res.data.data)
                        setApplicationData(res.data.application)
                        setOpen(false);

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
        })
        
    }
    
    const [openDisapprovalModal,setOpenDisapprovalModal] = useState(false)
    const handleDisApproved = ()=> {
        setOpenDisapprovalModal(true)
    }
    const handleCloseDisapprovalModal = ()=>{
        setOpenDisapprovalModal(false)
    }
    const saveDisapproved = (reason)=>{
        console.log(reason)
        var t_data = {
            id:selectedReviewID,
            reason:reason
        }
        console.log(t_data)
        disapprovedCOCApplication(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                setHistoryData(res.data.data.data)
                setApplicationData(res.data.data.application)
                handleClose();

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
            console.log(err)
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const [searchValue,setSearchValue] = useState('')
    const [searchHistoryValue,setSearchHistoryValue] = useState('')
    const cocApplication = applicationData.filter((el)=>{
            return el.name.includes(searchValue.toUpperCase());
    })
    const cocApplicationHistory = historyData.filter((el)=>{
            return el.name.includes(searchHistoryValue.toUpperCase());
    })
    return(
        <Box sx={{margin:matches?'0 5px 5px 5px':'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
                isLoading
                ?
                <DashboardLoading actionButtons={1}/>
                :
                <Fade in={!isLoading}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title ='Manage COC Approval'/>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                <IconButton onClick ={()=> setAddModal(true)} color='success' className=' custom-iconbutton'><AddIcon/></IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'5px'}}>
                            <Typography sx={{background:blue[900],padding:'10px',color:'#fff'}}>COC Application </Typography>
                            <Paper sx={{mt:1}}>
                                <TextField label ='Seach' placeholder='Firstname | Lastname' size='small' value={searchValue} onChange = {(val)=>setSearchValue(val.target.value)}/>
                                <TableContainer sx={{maxHeight:'50vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Name
                                                </TableCell>
                                                <TableCell>
                                                    Month
                                                </TableCell>
                                                <TableCell>
                                                    Year
                                                </TableCell>
                                                <TableCell>
                                                    To Earned
                                                </TableCell>
                                                <TableCell align='center'>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                applicationData.length !==0
                                                ?
                                                cocApplication.map((row,key)=>
                                                    <TableRow key = {key}>
                                                        <TableCell>
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.month_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.year}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.earned}
                                                        </TableCell>
                                                        <TableCell sx={{display:'flex',gap:1,justifyContent:'center'}} align='center'>
                                                            {/* <Tooltip title='Review COC Application'><IconButton color='primary' onClick={()=>handlePreview(row)} className='custom-iconbutton' sx={{'&:hover':{background:blue[800],color:'#fff'}}}><RateReviewIcon/></IconButton></Tooltip> */}
                                                            <Tooltip title='Approved'><IconButton color='success' className='custom-iconbutton' onClick={()=>handleApproved(row)}><ThumbUpIcon/></IconButton></Tooltip>
                                                            {/* <Tooltip title='Disapproved' className='custom-iconbutton'><IconButton color='error' onClick={()=>handleDisApproved(row)}><ThumbUpIcon/></IconButton></Tooltip> */}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={5} align='center'>
                                                        No Application as of the moment
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                            <Typography sx={{background:blue[500],padding:'10px',color:'#fff'}}>COC Application History</Typography>
                            <Paper sx={{mt:1}}>
                                <TextField label ='Seach' placeholder='Firstname | Lastname' size='small' value={searchHistoryValue} onChange = {(val)=>setSearchHistoryValue(val.target.value)}/>
                                <TableContainer sx={{maxHeight:'50vh'}}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Name
                                                </TableCell>
                                                <TableCell>
                                                    Month
                                                </TableCell>
                                                <TableCell>
                                                    Year
                                                </TableCell>
                                                <TableCell>
                                                    Earned
                                                </TableCell>
                                                <TableCell>
                                                    Status
                                                </TableCell>
                                                {/* <TableCell>
                                                    Actions
                                                </TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                historyData.length !==0
                                                ?
                                                cocApplicationHistory.map((row,key)=>
                                                    <TableRow key = {key}>
                                                        <TableCell>
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.month_name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.year}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.earned}
                                                        </TableCell>
                                                        <TableCell>
                                                            <em><span style={{color:row.status === 'APPROVED'?'green':'red'}}>
                                                            {row.status}
                                                            {row.status === 'APPROVED'?null:<span><em> ({row.remarks})</em></span>}
                                                            </span>
                                                            </em>
                                                        </TableCell>
                                                        {/* <TableCell>
                                                            {
                                                                row.status === 'APPROVED'
                                                                ?
                                                                <Tooltip title='Print COC certificate'><IconButton color='primary' onClick={()  =>handlePrint(row)} className='custom-iconbutton' sx={{'&:hover':{background:blue[800],color:'#fff'}}}><PrintIcon/></IconButton></Tooltip>
                                                                :
                                                                <IconButton color='primary' className='custom-iconbutton' disabled><PrintIcon/></IconButton>
                                                            }
                                                        </TableCell> */}
                                                    </TableRow>
                                                )
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={5} align='center'>
                                                        No Application history as of the moment
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        <Dialog
                            fullScreen
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'sticky',top:0 }}>
                            <Toolbar>
                                <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                                >
                                <CloseIcon />
                                </IconButton>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Review Application
                                </Typography>
                                <Button autoFocus color="inherit" onClick={handleClose}>
                                close
                                </Button>
                            </Toolbar>

                            </AppBar>
                            <Grid container sx={{pl:2,pr:2,pb:2}}>
                                <Grid item xs={12} sx={{mt:1}}>
                                    <Button variant='contained' startIcon={<AccessTimeIcon/>} onClick={()=>setOpenEarningDtls(true)}>Review COC earning details</Button>
                                </Grid>
                                <Grid item xs={12} sx={{mt:1,display:'flex',flexDirection:matches?'column':'row',alignItems:'center',gap:1}}>
                                    <Typography>File Attachment:</Typography>
                                    <Box sx={{display:'flex',gap:1}}>
                                    {
                                        earningDtl.file_ids
                                        ?
                                        JSON.parse(earningDtl.file_ids).map((row,key)=>
                                            <Tooltip title={`View File # ${key+1}`} key={key}><IconButton className='custom-iconbutton' onClick={()=>viewFileAPI(row)}><AttachmentIcon sx={{rotate:'320deg'}}/></IconButton></Tooltip>
                                        )
                                        :
                                        null
                                    }
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center',gap:1}}>
                                    <Typography>Memorandum Order File:</Typography>
                                    <Tooltip title='View File'><IconButton className='custom-iconbutton' onClick={()=>viewFileAPI(earningDtl.file_id)}><AttachmentIcon sx={{rotate:'320deg'}}/></IconButton></Tooltip>
                                </Grid>
                                <Grid item xs={12}>
                                    <hr/>

                                </Grid>
                                <Grid item xs={12}>
                                    <PrintFormHistory employeeInfo={employeeInfoReview} dateEarned={dateEarnedReview} hours ={hoursReview}/>
                                </Grid>
                                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',position:'sticky',bottom:0,background:'#fff'}}>
                                    <Tooltip title='Approved'><IconButton color='success' className='custom-iconbutton' onClick={handleApproved}><ThumbUpIcon/></IconButton></Tooltip>
                                    &nbsp;
                                    <Tooltip title='Disapproved'><IconButton color='error' className='custom-iconbutton' onClick={handleDisApproved}><ThumbDownIcon/></IconButton></Tooltip>
                                    {/** Modal */}
                                    <DisapprovedModal open = {openDisapprovalModal} handleClose = {handleCloseDisapprovalModal} save = {saveDisapproved}/>
                                </Grid>
                            
                            </Grid>
                            

                        </Dialog>
                        <Dialog
                            fullScreen
                            open={openEarningDtls}
                            onClose={handleCloseEarningDtls}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'sticky',top:0 }}>
                            <Toolbar>
                                <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleCloseEarningDtls}
                                aria-label="close"
                                >
                                <CloseIcon />
                                </IconButton>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                COC Earning Details
                                </Typography>
                                <Button autoFocus color="inherit" onClick={handleCloseEarningDtls}>
                                close
                                </Button>
                            </Toolbar>

                            </AppBar>
                            <Grid container>
                                <EarningDetails data={earningDtl} />
                            
                            </Grid>
                            

                        </Dialog>
                        <Modal
                            open={addModal}
                            onClose={()=> setAddModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={addModalStyle}>
                                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setAddModal(false)}/>
                                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                                Adding COC
                                </Typography>
                                <Box sx={{m:2,overflow:'scroll',maxHeight:'70vh'}}>
                                    <AddCOCForm close = {()=> setAddModal(false)} insertNewData = {insertNewData}/>
                                </Box>

                            </Box>
                        </Modal>
                        <div style={{display:'none'}}>
                            <PrintFormHistory ref={printHistoryRef} employeeInfo={employeeInfoPrint} dateEarned={dateEarned} hours ={hours}/>
                        </div>
                    </Grid>
                </Fade>
            }
        </Box>
    )
}