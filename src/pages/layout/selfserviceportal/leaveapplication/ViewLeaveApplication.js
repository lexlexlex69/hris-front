import React, { useEffect,useRef } from 'react';
import { Grid, Typography,Container,Paper,Box, Button,FormControl,InputLabel,Select,MenuItem,Fade,CircularProgress,Modal, TextField  } from '@mui/material';
//icon
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import VisibilityIcon from '@mui/icons-material/Visibility';

//leave application request
import { getManageLeaveApplicationData,getFilterManageLeaveApplicationData } from './LeaveApplicationRequest';
//check permission request
import { checkPermission } from '../permissionrequest/permissionRequest';
import { submitLeaveApplicationReview } from './LeaveApplicationRequest';

import LinearProgress from '@mui/material/LinearProgress';

import DataTable from 'react-data-table-component';
import moment from 'moment';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PreviewLeaveApplicationForm from './PreviewLeaveApplicationForm';
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import { getTypesOfLeave } from './LeaveApplicationRequest';
import { PreviewCTOApplicationForm } from './PreviewCTOApplicationForm';
import Swal from 'sweetalert2';
import axios from 'axios';
export default function ManageLeaveApplication(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

    // navigate
    const navigate = useNavigate()
    const [isLoading,setisLoading] = React.useState(true);
    const [leaveApplicationData,setLeaveApplicationData] = React.useState([])

    //all types of leave fetch from DB
    const [typeOfLeaveData,setTypeOfLeaveData] = React.useState([]);

    const [modalOpen,setmodalOpen] = React.useState(false)
    const [viewModalOpen,setmodalViewOpen] = React.useState(false)
    //all balance fetch from DB
    const [balanceData,setBalanceData] = React.useState([]);

    //reference for leave application print preview
    const leaveRef = useRef();
    //reference for CTO application print preview
    const cocRef = useRef();

    //loading
    const [loading,setLoading] = React.useState(true);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 400: matchesMD?400:'80%',
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        p: 4,
        overflow:'scroll',
        height:'100%',
        // display:'block'
      };
    
    const [aoAssign,setaoAssign] = React.useState({
        office_ao:'',
        office_ao_assign:''
    });
    const [officeHead,setofficeHead] = React.useState({
        office_head:'',
        office_name:''
    });
    const [action,setAction] = React.useState([]);
    useEffect(()=>{
        checkPermission(8)
        .then((response)=>{
            // console.log(response.data)
            setisLoading(false)
            if(response.data){
                getManageLeaveApplicationData()
                .then((response)=>{
                    console.log(response.data)
                    setLeaveApplicationData(response.data.data)
                    setAction(response.data.actions)
                }).catch((error)=>{
                    console.log(error)
                })

                //request to get the list of types of leave
                getTypesOfLeave()
                .then((response)=>{
                    const data = response.data
                    setTypeOfLeaveData(data.type_of_leave)
                }).catch((error)=>{
                    console.log(error)
                })
            }else{
                navigate('/')
            }
            setLoading(false)
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                // background:'#f4f4f4',
                // textAlign:'center',
                fontSize: matches?'11px':'0.875rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                background:'#2196f3',
                color:'#fff',
                fontSize:matches? '13px':'17px',
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
    const column = [
        {
            name: 'Employee Name',
            selector: row => row.fullname,
        },
        {
            name: 'Type of Leave',
            selector: row => row.leave_type_name,
        },
        {
            name: 'Date Filed',
            selector: row => moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A'),
        },
        {
            name: 'No. of Days/Hours Applied',
            selector: row => row.days_hours_applied,
        },
        {
            name: 'Action',
            selector: row =><Box>
                
                {action.map((data,key)=>
                    data.menu_name === 'REVIEW'
                    ?
                    <Button key = {key} variant="outlined" sx={{fontSize:matches?'9px':'auto',margin:'10px 0 0 0'}}size='small' onClick={()=>setInfo(row)} startIcon={<EditIcon/>} fullWidth color="success">REVIEW</Button>
                    :
                        data.menu_name === 'VIEW'
                        ?
                        <Button key = {key} variant="outlined" sx={{fontSize:matches?'9px':'auto',margin:'10px 0 0 0'}}size='small' onClick={()=>viewInfo(row)} startIcon={<VisibilityIcon/>} fullWidth >VIEW</Button>
                        :
                            data.menu_name === 'CANCEL'
                            ?
                            <Button  key = {key}  fullWidth variant='outlined' size = "small" color="error" startIcon={<CancelIcon/>}sx={{fontSize:matches?'9px':'auto',margin:'10px 0 10px 0'}} >Cancel</Button>
                            :
                            ''
                )}
                </Box>
                
        },
    ]
    const historyColumn = [
        {
            name: 'Employee Name',
            selector: row => row.fullname,
        },
        {
            name: 'Type of Leave',
            selector: row => row.leave_type_name,
        },
        {
            name: 'Date Filed',
            selector: row => moment(row.date_of_filing).format('MMMM DD, YYYY h:mm:ss A'),
        },
        {
            name: 'No. of Days/Hours Applied',
            selector: row => row.days_hours_applied,
        },
        {
            name: 'Status',
            selector: row => <em>{row.status === 'DISAPPROVED' ? <span style={{color:'red'}}>{row.status}</span> : <span style={{color:'green'}}>{row.status}</span>}</em>,
        },
        {
            name: 'Remarks',
            selector: row => row.remarks,
        },
        {
            name: 'Action',
            selector: row => <Box><Button fullWidth variant='outlined' size = "small" startIcon={<PrintIcon/>} sx={{fontSize:matches?'9px':'auto',margin:'10px 0 10px 0'}} onClick = {()=>printPending(row)}>Print</Button><Button fullWidth variant='outlined' size = "small" color="error" startIcon={<CancelIcon/>}sx={{fontSize:matches?'9px':'auto',margin:'0 0 10px 0'}} >Cancel</Button></Box>
        }
    ]
    const [printPendingInfo,setPrintPendingInfo] = React.useState([]);
    //reference for leave application print preview on pending application
    // const printLeaveRef = useRef();

    //reference for CTO print preview on pending application
    // const printLeaveCTORef = useRef();

    const reactToPrint  = useReactToPrint({
        content: () => leaveRef.current,
    });
    const reactToPrintCTO  = useReactToPrint({
        content: () => cocRef.current,
    });
    const [printCount,setPrintCount] = React.useState(0);
    useEffect(()=>{
        if(employeeInfo.length !==0){
            if(employeeInfo.leave_type_id === 14){
                reactToPrintCTO()
                // setPrintPendingInfo([])
            }else{
                reactToPrint()
                // setPrintPendingInfo([])

            }
        }
    },[printCount])
    const [pendingBalance,setPendingBalance] = React.useState('');

    const printPending = (data)=>{
        setEmployeeInfo(data)
        setPrintCount(printCount+1);
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_name:data.office_head_position,
        })
        // var bal;
        // balanceData.forEach(element => {
        //     switch(row.leave_type_id){
        //         /**
        //          * vacation leave/force leave/ special privilege leave
        //          */
        //         case 1:
        //         case 2:
        //         case 6:
        //             bal = element.vl_bal
        //             break;
        //         /**
        //          * sick leave
        //          */
        //         case 3:
        //             bal = element.sl_bal
        //             break;
        //         /**
        //          *  CTO
        //          */
        //         case 14:
        //             bal = element.coc_bal
        //             break;
        //     }
        // });
        // setPendingBalance(bal)
        // setPrintPendingInfo(row)
        // reactToPrint()
    }
    const [filter,setFilter] = React.useState('');
    const [employeeInfo,setEmployeeInfo] = React.useState([])
    const setInfo = (data) => {
        setmodalOpen(true)

        setEmployeeInfo(data)
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_name:data.office_head_position,
        })
    }
    const viewInfo = (data) => {
        setmodalViewOpen(true)

        setEmployeeInfo(data)
        setaoAssign({...aoAssign,
            office_ao:data.ao_assign,
            office_ao_assign:data.ao_position,
        })
        setofficeHead({
            ...officeHead,
            office_head:data.office_head,
            office_name:data.office_head_position,
        })
    }
    const handleFilterChange = (value)=>{
        setLoading(true)
        setFilter(value.target.value)
        getFilterManageLeaveApplicationData(value.target.value)
        .then((response) =>{
            setLeaveApplicationData(response.data.data)
            setAction(response.data.actions)
            setLoading(false)

        }).catch((error)=>{
            console.log(error)
        })
    }
    const showLeaveTypePreview = () =>{
        switch(employeeInfo.leave_type_id){
            case 1:
            case 2:
            case 3:
            case 6:
                return(
                    <ReactToPrint
                            trigger={() => <Button fullWidth variant='outlined' sx={{margin:'0 20px 20px 0'}} startIcon={<PrintIcon/>}>PRINT</Button>}
                            content={() => leaveRef.current}
                            documentTitle={'Application Leave '+employeeInfo.fname}
                        />
                );
                break;
            case 14:
                return(
                    <ReactToPrint
                            trigger={() => <Button fullWidth variant='outlined' sx={{margin:'0 20px 20px 0'}} startIcon={<PrintIcon/>}>PRINT</Button>}
                            content={() => cocRef.current}
                            documentTitle={'CTO '+employeeInfo.fname}
                        />
                );
                break;
        }
    }
    const submitReviewApplication = () =>{
        if(recommendation.length ===0){
            Swal.fire({
                icon:'warning',
                title:'Please select a Recommendation'
            })
        }else{
            var data = {
                leave_application_id:employeeInfo.leave_application_id,
                review:recommendation,
                disapproval:disapproval,
                perm_id:8
            }
            Swal.fire({
                icon:'info',
                title: 'Confirm submit ?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Swal.fire({
                        icon:'info',
                        title:'Saving data',
                        html:'Please wait...',
                        allowEscapeKey:false,
                        allowOutsideClick:false
                    })
                    Swal.showLoading()
                    submitLeaveApplicationReview(data)
                    .then((response)=>{
                        setmodalOpen(false)
                        if(response.data.status === 'success'){
                            setLeaveApplicationData(response.data.data)
                            Swal.fire({
                                icon:'success',
                                title:response.data.message
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:response.data.message
                            })
                        }
                    }).catch((error)=>{
                        console.log(error)
                    })
                }
              })
            
        }

    }
    const [recommendation,setRecommendation] = React.useState('');
    const handleRecommendation = (value) =>{
        setRecommendation(value.target.value)
    }
    const [disapproval,setDisapproval] = React.useState('');
    const viewCOCFile = () =>{
        // alert(JSON.parse(employeeInfo.file_ids))
        const file_id = JSON.parse(employeeInfo.file_ids);
        // window.open('localhost:8000/api/fileupload/viewFile/'+file_id);
        // axios.get('api/fileupload/viewFile/'+file_id)
        // .then((response)=>{
        // }).catch((error)=>{
        //     console.log(error)
        // })
        axios({
            url: 'api/fileupload/viewFile/'+file_id, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            console.log(response.data)
            const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('target', '_BLANK'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }
    return(
        <Container>
        {isLoading
        ?
        <Box sx={{ display: 'flex',justifyContent:'center'}}>
            <CircularProgress />
        </Box>
        :
        <Fade in>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'orange',textAlign:'center',margin:'20px',padding:'10px'}}  component={Paper}>
                        <StickyNote2Icon/> Manage Leave Application
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>

                    <FormControl sx = {{width:matches?'100%':'150px'}}>
                    <InputLabel id="select-filter">Filter</InputLabel>
                    <Select
                        labelId="select-filter"
                        id="select-filter"
                        value={filter}
                        label="Filter"
                        onChange={handleFilterChange}
                    >
                        <MenuItem value={'For Review'}>For Review</MenuItem>
                        <MenuItem value={'Approved'}>Approved</MenuItem>
                        <MenuItem value={'For Approval'}>For Approval</MenuItem>
                        <MenuItem value={'Disapproved'}>Disapproved</MenuItem>
                    </Select>
                    </FormControl>
                    </Box>

                </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
               
                <Box component = {Paper}>
                {  
                    loading
                    ?
                    <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                    </Box>
                    :
                    filter === 'For Review' || filter === ''
                    ?
                    <DataTable
                        columns={column}
                        data={leaveApplicationData}
                        customStyles={customStyles}
                        pagination
                    />
                    :
                    <DataTable
                        columns={historyColumn}
                        data={leaveApplicationData}
                        customStyles={customStyles}
                        pagination
                    />
                }
                
                </Box>

            </Grid>
        </Grid>
        
        
        </Fade>
        }
        <Modal
            open={modalOpen}
            onClose={()=> setmodalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant={matches?"h6":"h5"} component={matches?"h3":"h2"}>
                REVIEWING LEAVE APPLICATION
            </Typography>
            {/* <hr/> */}
            <br/>
                <Grid container component = {Paper} sx={{padding:matchesMD?'5px':''}}>
                {
                    employeeInfo.leave_type_id === 14
                    ?
                        matches || matchesMD
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        {employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
                                ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available VL Balance: {employeeInfo.vl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    :
                                    employeeInfo.leave_type_id === 3
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                    <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available SL Balance: {employeeInfo.sl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    
                                    :
                                    employeeInfo.leave_type_id === 14
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available COC Balance: {employeeInfo.coc_bal}.00 HOURS
                                        </Typography>
                                    </Grid>
                                    :
                                    ''
                                }
                            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Date Filed
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Name
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.fullname}
                                    </Typography>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Office/Department
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.officeCode}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Application Type
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    CTO
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        No. of {employeeInfo.leave_type_id === 14?'Hours':'Days'} Applied
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_hours_applied}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Inclusive Dates
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.inclusive_dates_text}
                                    </Typography>
                                </Grid>

                            </Box>
                        </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Recommendation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Recommendattion"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Approval</MenuItem>
                                    <MenuItem value={2}>Disapproval</MenuItem>
                                </Select>
                                </FormControl>
                            {recommendation.length !==0
                            ?
                                recommendation === 1
                                ?
                                ''
                                :
                                <>
                                <br/>
                                <br/>
                                <TextField label = "Disapproval due to" fullWidth value = {disapproval} onChange = {(value)=>setDisapproval(value.target.value)}/>
                                </>
                                
                            :
                            ''
                            }
                        </Grid>
                        </>
                        :
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            
                            <PreviewCTOApplicationForm info={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing}/>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'flex-end',margin:'0 17px 10px 0'}}>
                                    <Button variant='outlined' onClick = {viewCOCFile}>View COC File Attachement</Button>
                                </Box>
                            </Grid>
                            <br/>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Recommendation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Recommendattion"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Approval</MenuItem>
                                    <MenuItem value={2}>Disapproval</MenuItem>
                                </Select>
                                </FormControl>
                            {recommendation.length !==0
                            ?
                                recommendation === 1
                                ?
                                ''
                                :
                                <>
                                <br/>
                                <br/>
                                <TextField label = "Disapproval due to" fullWidth value = {disapproval} onChange = {(value)=>setDisapproval(value.target.value)}/>
                                </>
                                
                            :
                            ''
                            }
                        </Grid>
                        </Grid>
                    :
                    matches || matchesMD
                    ?
                        employeeInfo.length !==0
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        {employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
                                ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available VL Balance: {employeeInfo.vl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    :
                                    employeeInfo.leave_type_id === 3
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                    <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available SL Balance: {employeeInfo.sl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    
                                    :
                                    employeeInfo.leave_type_id === 14
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available COC Balance: {employeeInfo.coc_bal}.00 HOURS
                                        </Typography>
                                    </Grid>
                                    :
                                    ''
                                }
                            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Date Filed
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Name
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.fullname}
                                    </Typography>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Office/Department
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.officeCode}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Application Type
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.leave_type_name}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Details
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.details_name}
                                    </Typography>
                                </Grid>
                                <br/>

                                
                                {employeeInfo.specify_details.length !==0
                                    ?
                                    <>
                                    <Grid item lg = {2} sm = {12} xs = {12}>
                                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                            Specify Details
                                        </Typography>
                                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                        {employeeInfo.specify_details}
                                        </Typography>
                                    </Grid>
                                    <br/>
                                    </>
                                    :
                                    ''
                                }
                                {
                                    employeeInfo.commutation.length !==0
                                    ?
                                    <>
                                    <Grid item lg = {2} sm = {12} xs = {12}>
                                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                            Commutation
                                        </Typography>
                                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                        {employeeInfo.commutation}
                                        </Typography>
                                    </Grid>
                                    <br/>
                                    </>
                                    :
                                    ''
                                }
                                

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        No. of {employeeInfo.leave_type_id === 14?'Hours':'Days'} Applied
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_hours_applied}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Inclusive Dates
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.inclusive_dates_text}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Days with Pay
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_with_pay}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Days without Pay
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_without_pay}
                                    </Typography>
                                </Grid>
                            </Box>
                            
                            
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Recommendation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Recommendattion"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Approval</MenuItem>
                                    <MenuItem value={2}>Disapproval</MenuItem>
                                </Select>
                                </FormControl>
                            {recommendation.length !==0
                            ?
                                recommendation === 1
                                ?
                                ''
                                :
                                <>
                                <br/>
                                <br/>
                                <TextField label = "Disapproval due to" fullWidth value = {disapproval} sx={{margin:'0 17px 0 0'}} onChange = {(value)=>setDisapproval(value.target.value)}/>
                                </>
                                
                            :
                            ''
                            }
                        </Grid>
                        </>
                        :
                        ''
                    :
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        <PreviewLeaveApplicationForm data={typeOfLeaveData} leaveType = {employeeInfo.leave_type_id} info={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
                        employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
                        ?
                            employeeInfo.vl_bal
                        :
                            employeeInfo.leave_type_id === 3
                            ?
                            employeeInfo.vl_bal
                            :
                                employeeInfo.leave_type_id === 14
                                ?
                                employeeInfo.coc_bal
                                :
                                0
                        } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation}/>
                        </Grid>
                        <br/>
                        <br/>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Recommendation</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={recommendation}
                                label="Recommendattion"
                                onChange={handleRecommendation}
                            >
                                <MenuItem value={1}>For Approval</MenuItem>
                                <MenuItem value={2}>For Disapproval</MenuItem>
                            </Select>
                            </FormControl>
                        {recommendation.length !==0
                        ?
                            recommendation === 1
                            ?
                            ''
                            :
                            <TextField label = "Disapproval due to" fullWidth value = {disapproval} onChange = {(value)=>setDisapproval(value.target.value)}/>
                            
                        :
                        ''
                        }

                    </Grid>
                    </>

                }
                
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <br/>

                        {showLeaveTypePreview()}
                        {/* <Button fullWidth variant='outlined' sx={{margin:'0 20px 20px 0'}}>sdf</Button> */}
                    </Grid>
                    
                </Grid>
                <br/>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box sx={{display:'flex',justifyContent:'space-between'}}>
                            <Button variant='contained' color="success" onClick = {submitReviewApplication}>SUBMIT </Button><br/>
                            <Button variant='contained' color="error" onClick={()=> setmodalOpen(false)}>CANCEL</Button>
                        </Box>
                    </Grid>
                </Grid>
            {/* <Button variant="contained" color="success" size="large" fullWidth ><CheckIcon/> &nbsp; Confirm Update</Button>
            <br/>
            <Button variant="contained" color="error" size="large" fullWidth ><CancelIcon/> &nbsp; Cancel</Button> */}
            

            </Box>

        </Modal>
        {/* View Modal */}
        <Modal
            open={viewModalOpen}
            onClose={()=> setmodalViewOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant={matches?"h6":"h5"} component={matches?"h3":"h2"}>
                REVIEWING LEAVE APPLICATION
            </Typography>
            {/* <hr/> */}
            <br/>
                <Grid container component = {Paper} sx={{padding:matchesMD?'5px':''}}>
                {
                    employeeInfo.leave_type_id === 14
                    ?
                        matches || matchesMD
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        {employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
                                ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available VL Balance: {employeeInfo.vl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    :
                                    employeeInfo.leave_type_id === 3
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                    <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available SL Balance: {employeeInfo.sl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    
                                    :
                                    employeeInfo.leave_type_id === 14
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available COC Balance: {employeeInfo.coc_bal}.00 HOURS
                                        </Typography>
                                    </Grid>
                                    :
                                    ''
                                }
                            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Date Filed
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Name
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.fullname}
                                    </Typography>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Office/Department
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.officeCode}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Application Type
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    CTO
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        No. of {employeeInfo.leave_type_id === 14?'Hours':'Days'} Applied
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_hours_applied}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Inclusive Dates
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.inclusive_dates_text}
                                    </Typography>
                                </Grid>

                            </Box>
                        </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Recommendation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Recommendattion"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Approval</MenuItem>
                                    <MenuItem value={2}>Disapproval</MenuItem>
                                </Select>
                                </FormControl>
                            {recommendation.length !==0
                            ?
                                recommendation === 1
                                ?
                                ''
                                :
                                <>
                                <br/>
                                <br/>
                                <TextField label = "Disapproval due to" fullWidth value = {disapproval} onChange = {(value)=>setDisapproval(value.target.value)}/>
                                </>
                                
                            :
                            ''
                            }
                        </Grid>
                        </>
                        :
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            
                            <PreviewCTOApplicationForm info={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing}/>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'flex-end',margin:'0 17px 10px 0'}}>
                                    <Button variant='outlined' onClick = {viewCOCFile}>View COC File Attachement</Button>
                                </Box>
                            </Grid>
                            <br/>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Recommendation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recommendation}
                                    label="Recommendattion"
                                    onChange={handleRecommendation}
                                >
                                    <MenuItem value={1}>Approval</MenuItem>
                                    <MenuItem value={2}>Disapproval</MenuItem>
                                </Select>
                                </FormControl>
                            {recommendation.length !==0
                            ?
                                recommendation === 1
                                ?
                                ''
                                :
                                <>
                                <br/>
                                <br/>
                                <TextField label = "Disapproval due to" fullWidth value = {disapproval} onChange = {(value)=>setDisapproval(value.target.value)}/>
                                </>
                                
                            :
                            ''
                            }
                        </Grid>
                        </Grid>
                    :
                    matches || matchesMD
                    ?
                        employeeInfo.length !==0
                        ?
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        {employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
                                ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available VL Balance: {employeeInfo.vl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    :
                                    employeeInfo.leave_type_id === 3
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                    <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available SL Balance: {employeeInfo.sl_bal} DAYS
                                        </Typography>
                                    </Grid>
                                    
                                    :
                                    employeeInfo.leave_type_id === 14
                                    ?
                                    <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                            Available COC Balance: {employeeInfo.coc_bal}.00 HOURS
                                        </Typography>
                                    </Grid>
                                    :
                                    ''
                                }
                            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Date Filed
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Name
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.fullname}
                                    </Typography>
                                </Grid>
                                <br/>
                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Office/Department
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.officeCode}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Application Type
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.leave_type_name}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Leave Details
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.details_name}
                                    </Typography>
                                </Grid>
                                <br/>

                                
                                {employeeInfo.specify_details.length !==0
                                    ?
                                    <>
                                    <Grid item lg = {2} sm = {12} xs = {12}>
                                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                            Specify Details
                                        </Typography>
                                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                        {employeeInfo.specify_details}
                                        </Typography>
                                    </Grid>
                                    <br/>
                                    </>
                                    :
                                    ''
                                }
                                {
                                    employeeInfo.commutation.length !==0
                                    ?
                                    <>
                                    <Grid item lg = {2} sm = {12} xs = {12}>
                                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                            Commutation
                                        </Typography>
                                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                        {employeeInfo.commutation}
                                        </Typography>
                                    </Grid>
                                    <br/>
                                    </>
                                    :
                                    ''
                                }
                                

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        No. of {employeeInfo.leave_type_id === 14?'Hours':'Days'} Applied
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_hours_applied}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Inclusive Dates
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.inclusive_dates_text}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Days with Pay
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_with_pay}
                                    </Typography>
                                </Grid>
                                <br/>

                                <Grid item lg = {2} sm = {12} xs = {12}>
                                    <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                        Days without Pay
                                    </Typography>
                                    <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                                    {employeeInfo.days_without_pay}
                                    </Typography>
                                </Grid>
                            </Box>
                            
                            
                        </Grid>
                        </>
                        :
                        ''
                    :
                        <>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                        <PreviewLeaveApplicationForm data={typeOfLeaveData} leaveType = {employeeInfo.leave_type_id} info={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
                        employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
                        ?
                            employeeInfo.vl_bal
                        :
                            employeeInfo.leave_type_id === 3
                            ?
                            employeeInfo.vl_bal
                            :
                                employeeInfo.leave_type_id === 14
                                ?
                                employeeInfo.coc_bal
                                :
                                0
                        } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation}/>
                        </Grid>
                    </>

                }
                
                    
                        {action.map((data,key)=>
                            data.menu_name === 'PRINT'
                            ?
                            <Grid item xs={12} sm={12} md={12} lg={12} key={key}>
                            <br/>
                                {showLeaveTypePreview()}
                            </Grid>

                            :
                            ''
                        )}
                        {/* <Button fullWidth variant='outlined' sx={{margin:'0 20px 20px 0'}}>sdf</Button> */}
                    
                </Grid>
                <br/>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                            <Button variant='contained' color="error" onClick={()=> setmodalViewOpen(false)}>CANCEL</Button>
                        </Box>
                    </Grid>
                </Grid>
            {/* <Button variant="contained" color="success" size="large" fullWidth ><CheckIcon/> &nbsp; Confirm Update</Button>
            <br/>
            <Button variant="contained" color="error" size="large" fullWidth ><CancelIcon/> &nbsp; Cancel</Button> */}
            

            </Box>

        </Modal>
        <div style={{ display: "none" }}>
            <PreviewLeaveApplicationForm ref={leaveRef} data={typeOfLeaveData} leaveType = {employeeInfo.leave_type_id} info={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
            employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
            ?
                employeeInfo.vl_bal
            :
                employeeInfo.leave_type_id === 3
                ?
                employeeInfo.vl_bal
                :
                    employeeInfo.leave_type_id === 14
                    ?
                    employeeInfo.coc_bal
                    :
                    0
            } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation} disapproval={employeeInfo.remarks}/></div>
        <div style={{ display: "none" }}>
            <PreviewCTOApplicationForm ref={cocRef} info={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval    } date_of_filing ={employeeInfo.date_of_filing}/>
        </div>
        </Container>
    )
}