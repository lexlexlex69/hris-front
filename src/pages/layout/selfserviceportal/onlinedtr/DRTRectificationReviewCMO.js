import { Container, Grid ,Box, Button,Typography,Paper, Tooltip,Skeleton,Stack,Fade,IconButton,Modal} from '@mui/material';
import React, { useEffect,useState } from 'react';
import { getRectificationRequestReviewData,approvedReviewRectificationRequest,disapprovedReviewRectificationRequest } from './DTRRequest';
import DataTable from 'react-data-table-component';
import moment from 'moment';
//icon
import AttachmentIcon from '@mui/icons-material/Attachment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {  StickyNote2,ThumbDown } from '@mui/icons-material';
import CachedIcon from '@mui/icons-material/Cached';
import { blue, green, red, yellow } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { newPreViewFileAPI, preViewFileAPI, viewFileAPI } from '../../../../viewfile/ViewFileRequest';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {useNavigate}from "react-router-dom";
import { toast } from 'react-toastify';
import VerificationHistoryTable from './Table/VerificationHistoryTable';
import PreviewFileModal from '../../custommodal/PreviewFileModal';
import LargeModal from '../../custommodal/LargeModal';
import { FilePanZoom } from '../../customstring/CustomString';

export default function DTRRectificationReviewCMO(){
    const navigate = useNavigate()
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [reviewData,setreviewData] = React.useState([])
    const [officeName,setofficeName] = React.useState('')
    const [isLoading,setIsLoading] = React.useState(true)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?300:'90%',
        height:matches?300:'90%',
        bgcolor: 'background.paper',
        // border: '2px solid #fff',
        boxShadow: 24,
        // p: 4,
    };
    const [openFile, setOpenFile] = React.useState(false);
    const [fileName, setFileName] = React.useState('');
    const handleOpenFile = () => setOpenFile(true);
    const handleCloseFile = () => setOpenFile(false);
    useEffect(()=>{
        checkPermission(68)
        .then(response=>{
            if(response.data){
                setIsLoading(false)
                var t_data  = {
                    type:'CMO'
                }
                return getRectificationRequestReviewData(t_data)
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).then(response=>{
            const data = response.data
            setreviewData(data.data)
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
    },[])
    const reviewColumns = [
        {
            name:'Employee Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname?row.emp_mname.charAt(0):' ')+'.'
        },
        {
            name:'Office Name',
            selector:row=>row.short_name
        },
        {
            name: 'Date of Request',
            sortable:true,
            selector: row => moment(row.created_at).format('MMMM DD, YYYY h:mm:ss A')
        },
        {
            name:'Reason',
            selector:row=>row.reason
        },
        {
            name:'Rectified Date',
            selector:row=>moment(row.date).format('MMMM DD,YYYY')
        },
        {
            name:'Rectified Time',
            selector:row=>formatTime(row)
        },
        {
            name:'Attachment',
            selector:row=>
            <Box sx={{p:2}}>
            {
                JSON.parse(row.file_id).map((row2,key)=>
                    <Tooltip title='View uploaded file'><IconButton onClick={()=>handleViewFile(row2)} color='primary' className='custom-iconbutton'><AttachmentIcon/></IconButton></Tooltip>
                )
            }
            
            </Box>

        },
        {
            name:'Action',
            selector:row=>
            <Box sx={{p:2}}>
                <Tooltip title ='Approved'>
                <IconButton variant='outlined' color='success' onClick={()=>approvedRequest(row)} sx={{'&:hover': { bgcolor: green[800], color: '#fff'}}} className='custom-iconbutton'><ThumbUpIcon/></IconButton>
                </Tooltip>
                &nbsp;
                <Tooltip title ='Disapproved'>
                <IconButton variant='outlined' color='error' onClick = {()=>disapprovedRequest(row)} sx={{'&:hover': { bgcolor: red[800], color: '#fff'}}} className='custom-iconbutton'><ThumbDown/></IconButton>
                </Tooltip>
            </Box>
            // <Grid container spacing={1}>
            //     <Grid item xs={12} sx={{marginTop:'10px'}}>
            //     <Button variant='outlined' color='success' fullWidth startIcon={<ThumbUpIcon/>} sx={{'&:hover': { bgcolor: green[800], color: '#fff'}}} onClick={()=>approvedRequest(row)}> Approved</Button>
            //     </Grid>
            //     <Grid item xs={12} sx={{marginBottom:'10px'}}>
            //     <Button variant='outlined' color='error' fullWidth startIcon={<ThumbDown/>} sx={{'&:hover': { bgcolor: red[800], color: '#fff'}}} onClick = {()=>disapprovedRequest(row)}> Disapproved</Button>
            //     </Grid>
            // </Grid>
            
        },
    ]
    const formatTime = (row) => {
        
        var date = moment(row.date+' '+row.rectified_time).format('h:mm:ss A')
        return date;
    }
    const reviewStyle = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                // background:'#f4f4f4',
                // fontSize: matches?'9px':'0.875rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
    
            },
        },
        headCells: {
            style: {
                padding:'15px 0 15px 15px',
                background:blue[800],
                color:'#fff',
                // fontSize:matches?'12px':'17px',
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
                fontSize: '0.7rem',

    
            },
        }
    }
    const viewFile = (id) => {
        viewFileAPI(id)
    }
    const approvedRequest = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'question',
            title:'Confirm submit for approval ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Confirming approval',
                    html:'Please wait....',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading();
                approvedReviewRectificationRequest(row.rectify_id)
                .then(response=>{
                    const data = response.data
                    
                    if(data.status === 'success'){
                        setreviewData(data.data.data)
                        Swal.fire({
                            icon:'success',
                            title:data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }

                }).catch(error=>{
                    console.log(error)
                })
            }
          })
    }
    const disapprovedRequest = (row)=>{
        console.log(row)
        Swal.fire({
            title: 'Confirm disapproved request?',
            html:'Remarks for disapproval',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            inputValidator: (value) => {
                if (!value) {
                  return 'Please input remarks !'
                }
              }
          }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    id:row.rectify_id,
                    remarks:result.value,
                    type:'CMO'
                }
                Swal.fire({
                    icon:'info',
                    title:'Processing disapproval',
                    html:'Please wait...'
                })
                Swal.showLoading();
                console.log(data)
                disapprovedReviewRectificationRequest(data)
                .then(response=>{
                    const data = response.data
                    setreviewData(data.data.data)
                    if(data.status === 'success'){
                        Swal.fire({
                            icon:'success',
                            title:data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:data.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
                
            }
          })
    }
    const refreshData = () => {
        Swal.fire({
            icon:'info',
            title:'Please wait...',
            html:'Refreshing data...'
        })
        Swal.showLoading()
        setIsLoading(true)
        var t_data = {
            type:'CMO'
        }
        getRectificationRequestReviewData(t_data)
        .then(response=>{
            const data = response.data
            // console.log(data)
            setreviewData(data.data)
            // setofficeName(data.officename.office_division_acronym)
            Swal.close()
            setIsLoading(false)
        }).catch(error=>{
            console.log(error)
        })
    }
    const [previewFile,setPreviewFile] = useState(false)
    const [previewFileImg,setPreviewFileImg] = useState(false)
    const [previewFileData,setPreviewFileData] = useState('');
    const [fileType,setFileType] = useState('')
    const handleClosePreviewFile = () =>{
        setPreviewFile(false)
    }
    const handleViewFile = async (id) => {
        // console.log(id)
        // viewFileAPI(id)
        const file = await newPreViewFileAPI(id)
        console.log(file)
        if(file.type.includes('pdf')){
            setFileType('pdf')
            setPreviewFile(true)
        }else{
            setFileType('img')
            setPreviewFileImg(true)
        }
        setPreviewFileData(file.url)
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px',paddingBottom:'20px'}}>
            {
            isLoading
            ?
            <Stack spacing={1}>
                <Skeleton variant="text" width={'100%'} height={'70px'} animation="wave"/>
            </Stack>
            :
            <Fade in>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h6' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                            &nbsp;
                            DTR Rectification Request Verification
                        </Typography>

                        </Box> */}
                        <ModuleHeaderText title='DTR Rectification Request Verification (CMO)'/>
                    </Grid>
                </Grid>
            </Fade>
            }
            
            <Grid container>
                {isLoading
                ?
                <Grid item xs={12}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Skeleton variant="text" width={'150px'} height={'60px'} animation="wave" sx={{marginTop:'-15px'}}/>
                    </Box>

                </Grid>
                :
                <Fade in={!isLoading}>
                    <Grid item xs={12} sx={{marginBottom:'10px'}}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                            <Tooltip title='Refresh Data' placement='left'>
                            {/* <Button variant='outlined' onClick = {refreshData} sx={{width:matches?'100%':'auto',minWidth:'20vh'}}><CachedIcon sx={{transition:'0.4s ease-in-out','&:hover':{transform:'rotate(-180deg)'}}}/> </Button> */}
                            <IconButton color='primary' onClick = {refreshData} className='custom-iconbutton'><CachedIcon sx={{transition:'0.4s ease-in-out','&:hover':{transform:'rotate(-180deg)'}}}/></IconButton>
                            </Tooltip>
                    </Box>

                    </Grid>
                </Fade>
                }
                
                <Box sx={{width:'100%'}}>
                
                {
                isLoading
                ?
                <Stack spacing={1}>
                <Skeleton variant="text" width={'350px'} height={'50px'} animation="wave"/>
                <Skeleton variant="rectangular" width={'100%'} height={'45px'} animation="wave"/>
                <Skeleton variant="rectangular" width={'100%'} height={'175px'} animation="wave"/>
                </Stack>
                :
                <Fade in = {!isLoading}>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                        {/* <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b'}}><em>List of DTR Rectification Request</em></Typography> */}
                        <Typography sx={{fontSize:'.9rem'}}><em style={{color:'#fff',background:blue[900],padding:'10px 15px 10px 10px',borderTopRightRadius:'20px',borderBottomRightRadius:'20px'}}>List of DTR Rectification Request</em></Typography>

                        </Grid>
                        <Grid item xs={12} component={Paper} sx={{mt:2}}>
                            <DataTable
                                columns={reviewColumns}
                                data ={reviewData}
                                paginationPerPage={5}
                                    paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                    paginationComponentOptions={{
                                        rowsPerPageText: 'Records per page:',
                                        rangeSeparatorText: 'out of',
                                    }}
                                    pagination
                                    customStyles={reviewStyle}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                            <VerificationHistoryTable cat='verification' type='CMO'/>
                        </Grid>
                        <Modal
                            open={openFile}
                            onClose={handleCloseFile}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                            <iframe src={fileName} width={matches?300:'100%'} height={matches?300:'100%'}>

                            </iframe>
                            </Box>
                        </Modal>
                    </Grid>

                </Fade>

                }
                
                </Box>
            </Grid>
            <PreviewFileModal open = {previewFile} close = {handleClosePreviewFile} file={previewFileData} fileType={fileType}/>
            <LargeModal open = {previewFileImg} close = {()=>setPreviewFileImg(false)} title = 'Preview File'>
                <FilePanZoom img={previewFileData}/>
            </LargeModal>
        </Box>
    )
}