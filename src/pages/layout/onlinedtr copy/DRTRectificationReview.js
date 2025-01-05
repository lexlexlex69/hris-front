import { Container, Grid ,Box, Button,Typography,Paper, Tooltip,Skeleton,Stack,Fade} from '@mui/material';
import React, { useEffect } from 'react';
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

export default function DTRRectificationReview(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [reviewData,setreviewData] = React.useState([])
    const [officeName,setofficeName] = React.useState('')
    const [isLoading,setIsLoading] = React.useState(true)

    useEffect(()=>{
        getRectificationRequestReviewData()
        .then(response=>{
            // console.log(response.data)
            const data = response.data
            setreviewData(data.data)
            // setofficeName(data.officename.office_division_acronym)
            setIsLoading(false)

        }).catch(error=>{
            console.log(error)
        })
    },[])
    const reviewColumns = [
        {
            name:'Employee Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+row.emp_mname.charAt(0)+'.'
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
            matches
            ?
            <Button variant = 'outlined'  sx={{'&:hover': { bgcolor: blue[800], color: '#fff'}}} onClick={()=>viewFile(row)}><AttachmentIcon/></Button>

            :
            <Button variant = 'outlined' sx={{'&:hover': { bgcolor: blue[800], color: '#fff'}}} startIcon={<AttachmentIcon/>} onClick={()=>viewFile(row)}>View File</Button>

        },
        {
            name:'Action',
            selector:row=>
            <Grid container spacing={1}>
                <Grid item xs={12} sx={{marginTop:'10px'}}>
                <Tooltip title ='Approved'placement='left'>
                <Button variant='outlined' color='success' fullWidth onClick={()=>approvedRequest(row)} sx={{'&:hover': { bgcolor: green[800], color: '#fff'}}}><ThumbUpIcon/></Button>
                </Tooltip>
                </Grid>
                <Grid item xs={12} sx={{marginBottom:'10px'}}>
                <Tooltip title ='Disapproved' placement='left'>
                <Button variant='outlined' color='error' fullWidth onClick = {()=>disapprovedRequest(row)} sx={{'&:hover': { bgcolor: red[800], color: '#fff'}}}><ThumbDown/></Button>
                </Tooltip>
                </Grid>
            </Grid>
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
                fontSize: matches?'10px':'0.875rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
    
            },
        },
        headCells: {
            style: {
                padding:'15px 0 15px 15px',
                background:blue[800],
                color:'#fff',
                fontSize:matches?'12px':'17px',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                fontWeight: '500'
                // textAlign:'center',
    
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                textAlign:'left'
    
            },
        }
    }
    const viewFile = (row) => {
        var file_id = row.file_id;
        Swal.fire({
            icon:'info',
            title:'Loading file...',
        })
        Swal.showLoading()
        axios({
            url: 'api/fileupload/viewFile/'+file_id, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            Swal.close()
            const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('target', '_BLANK'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }
    const approvedRequest = (row)=>{
        console.log(row)
        Swal.fire({
            icon:'info',
            title:'Confirm submit for approval ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
        }).then((result) => {
            if (result.isConfirmed) {
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
                    remarks:result.value
                }
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

        getRectificationRequestReviewData()
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
    return(
        <Box sx={{margin:'20px',paddingBottom:'20px'}}>
            {
            isLoading
            ?
            <Stack spacing={1}>
                <Skeleton variant="text" width={'100%'} height={'70px'} animation="wave"/>
            </Stack>
            :
            <Fade in ={!isLoading}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                        <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                            <Typography variant='h6' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                            {/* <StickyNote2 fontSize='large'/> */}
                            &nbsp;
                            DTR Rectification Request Verification
                        </Typography>

                        </Box>
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
                            <Button variant='outlined' onClick = {refreshData} sx={{width:matches?'100%':'auto',minWidth:'20vh'}}><CachedIcon sx={{transition:'0.4s ease-in-out','&:hover':{transform:'rotate(-180deg)'}}}/> </Button>
                            </Tooltip>
                    </Box>

                    </Grid>
                </Fade>
                }
                
                <Box sx={{boxShadow:'0 0 5px #acacac',padding:'10px',width:'100%'}}>
                
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
                        <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b'}}><em>List of DTR Rectification Request</em></Typography>

                        </Grid>
                        <Grid item xs={12}>
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
                    </Grid>

                </Fade>

                }
                
                </Box>
            </Grid>
        </Box>
    )
}