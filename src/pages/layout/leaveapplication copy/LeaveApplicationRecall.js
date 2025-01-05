import { Box,Fade,Stack,Skeleton,Typography,Grid,Paper,Button, Tooltip } from '@mui/material';
import React,{useEffect, useState} from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    useNavigate
} from "react-router-dom";
import { checkPermission } from '../permissionrequest/permissionRequest';
import { getAllApprovedLeave, recallLeaveApplication, recallLeaveApplicationAPI } from './LeaveApplicationRequest';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import {blue,red,yellow,green} from '@mui/material/colors'
import Swal from 'sweetalert2';
import { auditLogs } from '../auditlogs/Request';
import CancelledApplication from './Table/CancelledApplication';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
export default function LeaveApplicationRecall(){
    const navigate = useNavigate()
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    const [historyData,setHistoryData] = useState([])
    useEffect(()=>{
        var logs = {
            action:'ACCESS ONLINE LEAVE RECALL',
            action_dtl:'ACCESS ONLINE LEAVE RECALL MODULE',
            module:'ONLINE LEAVE RECALL'
        }
        auditLogs(logs)
        checkPermission(28)
        .then((response)=>{
            // console.log(response.data)
            if(response.data){
                setIsLoading(false)
                getAllApprovedLeave()
                .then(res=>{
                    console.log(res.data)
                    setData(res.data.approved)
                    setHistoryData(res.data.cancelled)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                navigate('/hris')
            }
            setIsLoading(false)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const columns = [
        {
            name:'Employee Name',
            selector:row=>row.fullname
        },
        {
            name:'Leave Name',
            selector:row=>row.leave_type_name
        },
        {
            name:'Inclusive Dates',
            selector:row=>row.inclusive_dates_text
        },
        {
            name:'Days Applied',
            selector:row=>row.days_hours_applied
        },
        {
            name:'Action',
            selector:row=><Tooltip title='Recall Leave Application'>
                <Button variant='outlined' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={()=>recallAction(row)}><RotateLeftOutlinedIcon/></Button></Tooltip>
        }
        
    ];
    const recallAction = (row) => {
        console.log(row)
        Swal.fire({
            icon:'info',
            title: 'Cancel leave application ?',
            html:'Reason for cancellation',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            inputValidator: (value) => {
                if (!value) {
                  return 'Please input reason !'
                }
              }
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Cancelling leave application',
                    html:'Please wait...',
                    allowOutsideClick:false,
                    allowEscapeKey:false
                })
                Swal.showLoading();
                var data2 = {
                    emp_id:row.employee_id,
                    leave_id:row.leave_application_id,
                    leave_type_id:row.leave_type_id,
                    dwp:row.days_with_pay,
                    reason:result.value,
                }
                console.log(data2)
                recallLeaveApplication(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        setData(res.data.data.approved)
                        setHistoryData(res.data.data.cancelled)
                        Swal.fire({
                            icon:'info',
                            title:'Cancelling leave application',
                            html:"Updating data to e-GAPS... Please don't close this page.",
                            allowOutsideClick:false,
                            allowEscapeKey:false
                        })
                        Swal.showLoading();
                        var data3 ={
                            key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                            ref_no:row.ref_no,
                            info:res.data.info,
                            dwp:row.days_with_pay,
                            leave_type_id:row.leave_type_id
                        }
                        recallLeaveApplicationAPI(data3)
                        .then(res=>{
                            if(res.data.status === 200){
                                Swal.fire({
                                    icon:'success',
                                    title:res.data.message
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
    const tableData = {
        columns,
        data,
      };
    const reloadData = () =>{
        var logs = {
            action:'RELOAD ONLINE LEAVE RECALL',
            action_dtl:'RELOAD ONLINE LEAVE RECALL DATA',
            module:'ONLINE LEAVE RECALL'
        }
        auditLogs(logs)
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false,
            showConfirmButton:false
        })
        Swal.showLoading()
        getAllApprovedLeave()
        .then(res=>{
            setData(res.data.approved)
            setHistoryData(res.data.cancelled)
            Swal.close();

        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    return(
        <Box sx={{margin:'20px',paddingBottom:'20px'}}>
            {isLoading
            ?
            <Stack spacing={2}>
                        <Skeleton variant="text" height={'70px'} animation="wave"/>
            </Stack>
            :
            <Fade in={!isLoading}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                        <Box sx={{display:'flex',flexDirection:'row',background:'#008756',justifyContent:'space-between'}}>
                            <Typography variant='h5' sx={{fontSize:matches?'18px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                            &nbsp;
                            Leave Application Recall
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <Tooltip title ='Reload data'><Button variant='outlined' sx={{'&:hover':{color:'#fff',background:blue[800]}}} size='large' onClick={reloadData}><CachedOutlinedIcon/></Button></Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <DataTableExtensions
                             {...tableData}
                             export={false}
                             print={false}
                             filterPlaceholder='Filter Approved Table'
                        >
                        <DataTable
                            title ={<Typography sx={{background:green[800],color:'#fff',padding:'10px'}}>Approved Leave Application</Typography>}
                            data={data}
                            columns={columns}
                            
                        />
                        </DataTableExtensions>
                    </Grid>
                    <Grid item xs={12} sx={{m:2}}>
                    <hr/>
                    </Grid>
                    <Grid item xs={12}>
                        <CancelledApplication data = {historyData}/>
                    </Grid>
                </Grid>
            </Fade>
            }
        </Box>
    )
}