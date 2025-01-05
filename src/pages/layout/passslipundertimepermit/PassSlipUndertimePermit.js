import { Grid, Typography,Box,Skeleton,Paper,Fade, Button,Modal, Tooltip } from '@mui/material';
import React, { useEffect,useState} from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddPassSlipModal from './Modal/AddPassSlipModal';
//icon
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import DataTable from 'react-data-table-component';
import { getAllPassSlipData,deletePassSlip,getAllUndertimePermitData,deleteUndertimePermit} from './PassSlipUndertimeRequest';
import moment from 'moment';
import './PassSlipUndertime.css'
import ScanModal from './Modal/ScanModal';
import { blue, green, red, yellow } from '@mui/material/colors'
import SquareIcon from '@mui/icons-material/Square';
import Swal from 'sweetalert2';
import AddUndertimePermitModal from './Modal/AddUndertimePermitModal';
import ModuleHeaderText from '../moduleheadertext/ModuleHeaderText';
export default function PassSlipUndertimePermit(){
    //media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const addPassSlipModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:500,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
      const addUndertimePermitModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:500,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
      const scanModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
      const customStyles = {
        rows: {
            style: {
                minHeight: '45px', // override the row height
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                '&:hover':{
                    color:'#d2d2d2 !important',
                    cursor:'pointer'
                },


            },
        },
        headCells: {
            style: {
                fontSize:'1.3em',
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                // background:'rgb(127 137 148)'
                border:'solid 1px #c4c4c4',

            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif'

            },
        },
    };
    const [isLoading,setIsLoading] = React.useState(true)
    const [addPassSlipModal,setAddPassSlipModal] = React.useState(false)
    const [addUndertimePermitModal,setAddUndertimePermitModal] = React.useState(false)
    const [scanModal,setScanModal] = React.useState(false)
    const [passSlipData,setPassSlipData] = useState([])
    const [undertimePermitData,setUndertimePermitData] = useState([])
    const [hasPending,setHasPending] = useState(false)
    useEffect(()=>{
        setIsLoading(false)
        getAllPassSlipData()
        .then(res=>{
            const result = res.data
            setPassSlipData(result)
            result.forEach(el => {
                if(moment(el.date).format('MM-DD-YYYY') === moment(new Date()).format('MM-DD-YYYY')){
                    if(el.actual_departure_time === null || el.actual_departure_time === null){
                        if(el.status !== 'DISAPPROVED'){
                            setHasPending(true);
                        }
                    }
                }
            });
        }).catch(err=>{
            console.log(err)
        })
        getAllUndertimePermitData()
        .then(res=>{
            const result2 = res.data
            setUndertimePermitData(result2)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const passSlipColumns = [
        {
            name:'Date',
            selector:row=>moment(row.date).format('MMMM DD, YYYY'),
            sortable:true
        },
        {
            name:'Departure Time / Actual Departure',
            selector:row=>formatAMPM(row.departure_time)+' / '+(row.actual_departure_time === null ?'N/A' :formatAMPM(row.actual_departure_time))
        },
        {
            name:'Expected Time of Return / Actual Return',
            selector:row=>formatAMPM(row.return_time)+' / '+(row.actual_return_time === null ?'N/A' :formatAMPM(row.actual_return_time))
        },
        {
            name:'Purpose Type',
            selector:row=>row.purpose_type
        },
        {
            name:'Purpose',
            selector:row=>row.purpose
        },
        {
            name:'Destination',
            selector:row=>row.destination
        },
        {
            name:'Action',
            selector:row=><Button variant='contained' disabled= {row.status === 'FOR REVIEW' ? false:true} color='error' onClick={()=>deleteActionPassSlip(row)}><DeleteOutlinedIcon/></Button>,
        },
    ]
    const undertimePermitColumns = [
        {
            name:'Date',
            selector:row=>moment(row.created_at).format('MMMM DD, YYYY'),
            sortable:true
        },
        {
            name:'Time',
            selector:row=>formatAMPM(row.time)
        },
        {
            name:'Reason',
            selector:row=>row.reason
        },
        {
            name:'Action',
            selector:row=><Button variant='contained' disabled= {row.status === 'FOR APPROVAL' ? false:true} color='error' onClick={()=>deleteActionUndertimePermit(row)}><DeleteOutlinedIcon/></Button>
        }
    ]
    const deleteActionPassSlip = (row)=>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to delete?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            if (result.isConfirmed) {
                deletePassSlip(row.pass_slip_id)
                .then(res=>{
                    const result =res.data
                    if(result.status === 200){
                        if(result.new_data.length === 0){
                            setHasPending(false);
                        }else{
                            result.new_data.forEach(el => {
                                if(moment(el.date).format('MM-DD-YYYY') === moment(new Date()).format('MM-DD-YYYY')){
                                    if(el.actual_departure_time === null || el.actual_departure_time === null){
                                        if(el.status !== 'DISAPPROVED'){
                                            setHasPending(true);
                                        }
                                    }
                                }
                            });
                        }
                        setPassSlipData(result.new_data)
                        Swal.fire({
                            icon:'success',
                            title:result.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:result.message,
                        })
                    }
                    console.log(result)
                }).catch(err=>{
                    console.log(err)
                })
            }
          })
    }
    const deleteActionUndertimePermit = (row)=>{
        Swal.fire({
            icon:'info',
            title: 'Do you want to delete?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            if (result.isConfirmed) {
                deleteUndertimePermit(row.undertime_permit_id)
                .then(res=>{
                    const result = res.data
                    console.log(result)
                    if(result.status === 200){
                        setUndertimePermitData(result.new_data)
                        Swal.fire({
                            icon:'success',
                            title:result.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:result.message
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }

        })
    }
    const conditionalRowStyles = [
        {
            when: row => row.status === 'DISAPPROVED',
                style: {
                backgroundColor: red[800],
                color: 'white',
                '&:hover': {
                    cursor: 'pointer',
                },
            }
        },
        {
            when: row => row.status === 'APPROVED',
            style: {
            backgroundColor: green[800],
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
            },
        },
        {
            when: row => row.status === 'FOR REVIEW',
            style: {
            backgroundColor: blue[800],
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
            },
        },
        {
            when: row => row.status === 'FOR APPROVAL',
            style: {
            backgroundColor: blue[500],
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
            },
        }
      ];
    const formatAMPM = (time)=>{
        var split_time = time.split(':');
        var hours = split_time[0];
        var minutes = split_time[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const onAddPassSlip = () =>{
        getAllPassSlipData()
        .then(res=>{
            const result = res.data
            setPassSlipData(result)
            result.forEach(el => {
                if(moment(el.date).format('MM-DD-YYYY') === moment(new Date()).format('MM-DD-YYYY')){
                    if(el.actual_departure_time === null || el.actual_departure_time === null){
                        if(el.status !== 'DISAPPROVED'){
                            setHasPending(true);
                        }
                    }
                }})
        }).catch(err=>{
            console.log(err)
        })
        
    }
    const refreshPassSlipData = () => {
        Swal.fire({
            icon:'info',
            title:'Please wait',
            html:'Reloading Pass Slip Data'
        })
        Swal.showLoading()
        getAllPassSlipData()
        .then(res=>{
            const result = res.data
            if(result.length ===0){
                setHasPending(false);
            }else{
                setPassSlipData(result)
                result.forEach(el => {
                    if(moment(el.date).format('MM-DD-YYYY') === moment(new Date()).format('MM-DD-YYYY')){
                        if(el.actual_departure_time === null || el.actual_departure_time === null){
                            if(el.status !== 'DISAPPROVED'){
                                setHasPending(true);
                            }
                        }
                    }
                });
            }
            
            Swal.close();
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    const refreshUndertimePermitData = () => {
        Swal.fire({
            icon:'info',
            title:'Please wait',
            html:'Reloading Undertime Data'
        })
        Swal.showLoading()
        getAllUndertimePermitData()
        .then(res=>{
            const result2 = res.data
            setUndertimePermitData(result2)
            Swal.close()
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    const onAddUndertimePermit = (data)=>{
        setUndertimePermitData(data)
    }
    return(
        <>
        {
            isLoading
            ?
            <Box sx={{padding:'20px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'10px 0 10px 0'}}>
                            <Box sx={{display:'flex',flexDirection:'row'}}>
                            <Skeleton variant='text'  width={'100%'} height={'70px'} animation="wave"/>
                            </Box>
                        </Grid>
                    </Grid>
                <Grid container component={Paper} sx={{padding:'10px',marginTop:'-15px'}}>
                    <Grid item xs={12}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Skeleton variant='text'  width={'50px'} height={'70px'} animation="wave" sx={{marginTop:'-15px'}}/>
                        <Skeleton variant='text'  width={'50px'} height={'70px'} animation="wave" sx={{marginTop:'-15px'}}/>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            :
            <Fade in={!isLoading}>
                <Box sx={{margin:'0 10px 10px 10px'}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                                &nbsp;
                                Pass Slip / Undertime Permit
                                </Typography>

                            </Box> */}
                            <ModuleHeaderText title='Pass Slip / Undertime Permit'/>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Tooltip title='Add Pass Slip'><Button variant='outlined' onClick = {()=>setAddPassSlipModal(true)} disabled = {hasPending}>Pass Slip</Button></Tooltip>
                            <Button variant='outlined' onClick={()=>setAddUndertimePermitModal(true)}>Undertime Permit</Button>
                            <Button variant='outlined' onClick = {()=>setScanModal(true)}><DocumentScannerOutlinedIcon/></Button>
                        </Grid>
                        <Grid item xs={12} component={Paper} sx={{marginTop:'15px',p:2}}>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b',fontWeight:'bold'}}><em>Pass Slip Records</em></Typography>

                                <Tooltip title ='Refresh Pass Slip Records'><Button variant='outlined' onClick ={refreshPassSlipData}><ReplayOutlinedIcon sx={{'&:hover':{color:blue[500]}}}/></Button></Tooltip>

                            </Box>

                            <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-start',mt:2,mb:1}}>
                                <Typography sx={{fontSize:'.9em',fontWeight:'bold'}}>Status</Typography>
                                <Typography sx={{fontSize:'.8em',fontStyle:'italic'}}><SquareIcon sx={{color:blue[800],ml:2}}/> - For Review</Typography>
                                <Typography sx={{fontSize:'.8em',fontStyle:'italic'}}><SquareIcon sx={{color:blue[500],ml:2}}/> - For Approval</Typography>
                                <Typography sx={{fontSize:'.8em',fontStyle:'italic'}}><SquareIcon sx={{color:green[800],ml:2}}/> - Approved</Typography>
                                <Typography sx={{fontSize:'.8em',fontStyle:'italic'}}><SquareIcon sx={{color:red[800],ml:2}}/> - Disapproved</Typography>

                            </Box>
                            <DataTable
                                // title={(<Typography className='table-data-header'>Pass Slip Records</Typography>)}
                                data={passSlipData}
                                columns={passSlipColumns}
                                conditionalRowStyles={conditionalRowStyles}
                                paginationPerPage={5}
                                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Records per page:',
                                    rangeSeparatorText: 'out of',
                                }}
                                pagination
                                // highlightOnHover
                                customStyles={customStyles}
                            />
                        </Grid>

                        <Grid item xs={12} component={Paper} sx={{marginTop:'15px',p:2}}>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b',fontWeight:'bold'}}><em>Undertime Permit Records</em></Typography>

                                <Tooltip title ='Refresh Pass Slip Records'><Button variant='outlined' onClick ={refreshUndertimePermitData}><ReplayOutlinedIcon sx={{'&:hover':{color:blue[500]}}}/></Button></Tooltip>

                            </Box>

                            <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'flex-start',mt:2,mb:1}}>
                                <Typography sx={{fontSize:'.9em',fontWeight:'bold'}}>Status</Typography>
                                <Typography sx={{fontSize:'.8em',fontStyle:'italic'}}><SquareIcon sx={{color:blue[500],ml:2}}/> - For Approval</Typography>
                                <Typography sx={{fontSize:'.8em',fontStyle:'italic'}}><SquareIcon sx={{color:green[800],ml:2}}/> - Approved</Typography>
                                <Typography sx={{fontSize:'.8em',fontStyle:'italic'}}><SquareIcon sx={{color:red[800],ml:2}}/> - Disapproved</Typography>

                            </Box>
                            <DataTable
                                // title={(<Typography className='table-data-header'>Pass Slip Records</Typography>)}
                                data={undertimePermitData}
                                columns={undertimePermitColumns}
                                conditionalRowStyles={conditionalRowStyles}
                                paginationPerPage={5}
                                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Records per page:',
                                    rangeSeparatorText: 'out of',
                                }}
                                pagination
                                // highlightOnHover
                                customStyles={customStyles}
                            />
                        </Grid>
                    </Grid>
                    <Modal
                        open={addPassSlipModal}
                        onClose={()=> setAddPassSlipModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={addPassSlipModalStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setAddPassSlipModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Adding Pass Slip
                            </Typography>
                            <Box sx={{m:4}}>
                                <AddPassSlipModal onAddPassSlip = {onAddPassSlip} close = {()=> setAddPassSlipModal(false)}/>
                            </Box>

                        </Box>
                    </Modal>
                    <Modal
                        open={addUndertimePermitModal}
                        onClose={()=> setAddUndertimePermitModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={addUndertimePermitModalStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setAddUndertimePermitModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Adding Undertime Permit
                            </Typography>
                            <Box sx={{m:4}}>
                                <AddUndertimePermitModal onAddUndertimePermit = {onAddUndertimePermit} close = {()=> setAddUndertimePermitModal(false)}/>
                            </Box>

                        </Box>
                    </Modal>
                    <Modal
                        open={scanModal}
                        onClose={()=> setScanModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={scanModalStyle}>
                            <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setScanModal(false)}/>
                            <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                            Scan Pass Slip
                            </Typography>
                            <Box sx={{m:4}}>
                                <ScanModal close = {()=> setScanModal(false)}/>
                            </Box>

                        </Box>
                    </Modal>
                </Box>
            </Fade>
        }
        </>
    )
}