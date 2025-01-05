import { Grid, Typography,Fade,Stack,Skeleton,Box,Paper, Button, Tooltip } from '@mui/material';
import React,{useEffect, useState} from 'react';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../permissionrequest/permissionRequest';
import { getApprovedRectificationRequest,postDTRRectification,postAPIDTRRectification } from './DTRRequest';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import moment from 'moment';
import Swal from 'sweetalert2';
import { blue } from '@mui/material/colors';
import RectificationHistoryTable from './Table/RectificationHistoryTable';
import axios from 'axios';
//icon
import AttachmentIcon from '@mui/icons-material/Attachment';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import { auditLogs } from '../auditlogs/Request';
import DashboardLoading from '../loader/DashboardLoading';

export default function DTRRectification(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()
    const [data,setData] = useState([])
    const [historyData,setHistoryData] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [userinfo,setUserinfo] = useState([])
    useEffect(()=>{
        var logs = {
            action:'ACCESS ONLINE DTR RECTIFICATION',
            action_dtl:'ACCESS ONLINE DTR RECTIFICATION MODULE',
            module:'ONLINE DTR RECTIFICATION'
        }
        auditLogs(logs)
        checkPermission(27)
        .then((response)=>{
            if(!response.data){
                navigate('/hris')
            }else{
                getApprovedRectificationRequest()
                .then(res=>{
                    const r = res.data
                    setData(r.approved)
                    setUserinfo(r.userinfo)
                    console.log(r.userinfo[0])
                    
                }).catch(err=>{
                    console.log(err)
                })
                setIsLoading(false)
                // fetchHistoryData(1)
            }
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    // const fetchHistoryData = async page => {

	// 	const response = await axios.get(`/api/DTR/rectHistoryPagination?page=${page}&per_page=${5}`);

	// 	setHistoryData(response.data.data);
	// };
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+row.emp_mname.charAt(0)+'.'
        },
        {
            name:'Department',
            selector:row=>row.short_name
        },
        {
            name:'Date of Request',
            selector:row=>moment(row.created_at).format('MMMM DD, YYYY h:mm:ss A')
        },
        {
            name:'Rectified Date',
            selector:row=>moment(row.date).format('MMMM DD, YYYY')
        },
        {
            name:'Nature',
            selector:row=>row.nature
        },
        {
            name:'Time',
            selector:row=>formatTime(row)
        },
        {
            name:'Reason',
            selector:row=>row.reason
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
            selector:row=><Tooltip title='Rectify now'><Button onClick = {()=>rectifyAction(row)}variant='outlined'><AutoFixHighOutlinedIcon/></Button></Tooltip>
        },
    ]
    const viewFile = (row) => {
        console.log(row)
        var file_id = row.file_id;
        var logs = {
            action:'VIEW ONLINE DTR RECTIFICATION ATTACHMENT',
            action_dtl:'NAME = '+ row.emp_fname+ ' ' +row.emp_mname.charAt(0)+'. '+row.emp_lname+' | ADJUST NO = '+ row.adjst_no,
            module:'ONLINE DTR RECTIFICATION'
        }
        auditLogs(logs)
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
    const tableData = {
        columns,
        data,
      };
    
    const formatTime = (row) => {
        var date = moment(row.date+' '+row.rectified_time).format('h:mm:ss A')
        return date;
    }
    const rectifyAction =(row)=>{
        Swal.fire({
            icon:'info',
            title: 'Confirm rectification ?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          }).then((result) => {
            if (result.isConfirmed) {
            // console.log(row)
              var data2 = {
                key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
                rectifyId:row.rectify_id,
                empNo:row.emp_no,
                logDate:row.date,
                inputtedBy:userinfo[0].name,
                inputtedPos:userinfo[0].position_name,
                nature:row.nature,
                reason:row.reason,
                adjustType:row.adjustment_type,
                deptCode:row.dept_code,
                bioId:row.bio_id,
                rectifiedTime:row.rectified_time,
                fullname:row.emp_lname+' '+row.emp_mname.charAt(0)+'. '+row.emp_lname
              }
            //   console.log(data2)
              Swal.fire({
                icon:'info',
                title:'Saving data.',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
              })
              Swal.showLoading()
              postAPIDTRRectification(data2)
              .then(res=>{
                // Swal.close();
                const result = res.data
                // console.log(result);
                if(result.status === 200){
                    data2.is_posted = res.data.is_posted;
                    data2.adjst_no = res.data.adjust_no;
                    postDTRRectification(data2)
                    .then(res=>{
                        if(res.data.status === 200){
                            console.log(res.data)
                            setData(res.data.data.approved)
                            Swal.fire({
                                icon:'success',
                                title:'Successfully rectified',
                                timer:1500
                            })
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:'Failed to rectified',
                            })
                        }
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:'Failed to rectified API',
                    })
                }
              })
            }
          })
    }
    const tableStyle = {
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
    
    return(
        <Box sx={{margin:'5px 20px 20px 20px'}}>
            {
                isLoading
                ?
                <Stack spacing={1}>
                    <DashboardLoading/>
                </Stack>
                :
                <Fade in ={!isLoading}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                            <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                <Typography variant='h6' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                                {/* <StickyNote2 fontSize='large'/> */}
                                &nbsp;
                                DTR Rectification
                            </Typography>

                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                        <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#01579b',fontWeight:'bold'}}><em>Pending Rectification Request</em></Typography>
                            <DataTableExtensions
                                {...tableData}
                                export={false}
                                print={false}
                                filterPlaceholder = 'Search ...'
                            >
                            <DataTable
                                data = {data}
                                columns = {columns}
                                customStyles={tableStyle}
                                paginationPerPage={5}
                                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Records per page:',
                                    rangeSeparatorText: 'out of',
                                }}
                                pagination
                            />
                            </DataTableExtensions>
                        </Grid>
                        <Grid item xs={12} sx={{mt:2}}>
                                <RectificationHistoryTable/>
                        </Grid>
                    </Grid>
                </Fade>
                }
        </Box>
    )
}