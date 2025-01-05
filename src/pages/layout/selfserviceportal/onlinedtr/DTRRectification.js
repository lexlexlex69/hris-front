import { Grid, Typography,Fade,Stack,Skeleton,Box,Paper, Button, Tooltip,IconButton } from '@mui/material';
import React,{useEffect, useState} from 'react';
import {
    useNavigate
} from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { getApprovedRectificationRequest,postDTRRectification,postAPIDTRRectification, disapprovalRectificationRequest, disapprovalRectifierRequest } from './DTRRequest';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import moment from 'moment';
import Swal from 'sweetalert2';
import { blue,green,red } from '@mui/material/colors';
import RectificationHistoryTable from './Table/RectificationHistoryTable';
import axios from 'axios';
//icon
import AttachmentIcon from '@mui/icons-material/Attachment';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CachedIcon from '@mui/icons-material/Cached';

import { auditLogs } from '../../auditlogs/Request';
import DashboardLoading from '../../loader/DashboardLoading';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import { newPreViewFileAPI, viewFileAPI } from '../../../../viewfile/ViewFileRequest';
import { api_url } from '../../../../request/APIRequestURL';
import PreviewFileModal from '../../custommodal/PreviewFileModal';
import LargeModal from '../../custommodal/LargeModal';
import { FilePanZoom } from '../../customstring/CustomString';
import RectificationDisapprovedHistoryTable from './Table/RectificationDisapprovedHistoryTable';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

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
                navigate(`/${process.env.REACT_APP_HOST}`)
            }else{
                getApprovedRectificationRequest()
                .then(res=>{
                    const r = res.data
                    setData(r.approved)
                    setUserinfo(r.userinfo)
                    // console.log(r.userinfo[0])
                    
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
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname?row.emp_mname.charAt(0):' ')+'.'
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
            selector:row=>row.reason,
            style: {
                wordWrap:'break-word',
                overflow:'auto'
            },
        },
        {
            name:'Attachment',
            selector:row=>
            <Box sx={{p:1,display:'flex',gap:1,flexWrap:'wrap'}}>
            {
                JSON.parse(row.file_id).map((row2,key)=>
                    <Tooltip title='View uploaded file'><IconButton onClick={()=>handleViewFile(row2)} color='primary' className='custom-iconbutton' sx={{'&:hover':{background:blue[800],color:'#ffff'}}}><AttachmentIcon/></IconButton></Tooltip>
                )
            }
            
            </Box>

        },
        {
            name:'Action',
            selector:row=>
            <Box sx={{p:1,display:'flex',gap:1}}>
            <Tooltip title='Proceed rectification'><IconButton onClick = {()=>rectifyAction(row)}className='custom-iconbutton' color='success' sx={{'&:hover':{background:green[800],color:'#ffff'}}}><AutoFixHighOutlinedIcon/></IconButton></Tooltip>
            <Tooltip title='Disapproved request'><IconButton onClick = {()=>disapprovedAction(row)}className='custom-iconbutton' color='error'sx={{'&:hover':{background:red[800],color:'#ffff'}}}><ThumbDownIcon/></IconButton></Tooltip>
            </Box>
        },
    ]
    const disapprovedAction = (row)=>{
        Swal.fire({
            icon:'question',
            title:'Reason for disapproval',
            input:'text',
            showCancelButton:true,
            inputValidator: (value) => {
                if (!value) {
                return 'Please input reason !'
                }
            }
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Disapproving request',
                    html:'Please wait...'
                })
                Swal.showLoading();
                var t_data = {
                    reason:res.value,
                    id:row.rectify_id
                }
                disapprovalRectifierRequest(t_data)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                    
                        setData(res.data.data.approved)
                        setUserinfo(res.data.data.userinfo)
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
                    Swal.close();
                    console.log(err)
                })
            }
        })
    }
    const viewFile = (id) => {
        // console.log(row)
        // var file_id = row.file_id;
        // var logs = {
        //     action:'VIEW ONLINE DTR RECTIFICATION ATTACHMENT',
        //     action_dtl:'NAME = '+ row.emp_fname+ ' ' +row.emp_mname.charAt(0)+'. '+row.emp_lname+' | ADJUST NO = '+ row.adjst_no,
        //     module:'ONLINE DTR RECTIFICATION'
        // }
        // auditLogs(logs)
        // Swal.fire({
        //     icon:'info',
        //     title:'Loading file...',
        // })
        // Swal.showLoading()
        viewFileAPI(id)
        // axios({
        //     url: 'api/fileupload/viewFile/'+file_id, //your url
        //     method: 'GET',
        //     responseType: 'blob', // important
        // }).then((response) => {
        //     Swal.close()
        //     const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('target', '_BLANK'); //or any other extension
        //     document.body.appendChild(link);
        //     link.click();
        // });
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
            icon:'question',
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
                fullname:row.emp_lname+' '+(row.emp_mname?row.emp_mname.charAt(0):' ')+'. '+row.emp_lname
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
              }).catch(err=>{
                window.open(api_url)
              })
            }
          })
    }
    const tableStyle = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                // background:'#f4f4f4',
                // fontSize: matches?'10px':'0.875rem',
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
    const refreshData = ()=>{
        Swal.fire({
            icon:'info',
            title:'Reloading data'
        })
        Swal.showLoading()
        getApprovedRectificationRequest()
        .then(res=>{
            const r = res.data
            setData(r.approved)
            setUserinfo(r.userinfo)
            console.log(r.userinfo[0])
            Swal.close();
        }).catch(err=>{
            console.log(err)
            Swal.close()
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
        // console.log(file)
        if(file.type.includes('pdf')){
            setFileType('pdf')
            setPreviewFile(true)
        }else{
            setFileType('img')
            setPreviewFileImg(true)
        }
        setPreviewFileData(file.url)
    }
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return(
        <Box sx={{margin:'0 10px 10px 10px'}}>
            {
                isLoading
                ?
                <Stack spacing={1}>
                    <DashboardLoading/>
                </Stack>
                :
                <Fade in ={!isLoading}>
                    <Grid container>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                            <ModuleHeaderText title='DTR Rectification'/>
                        </Grid> */}
                        <Grid item xs={12}>
                            <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} variant="scrollable" scrollButtons allowScrollButtonsMobile sx={{'.Mui-selected':{fontWeight:'bold'}}} aria-label="lab API tabs example">
                                <Tab label="Pending" value="1" />
                                <Tab label="Disapproved" value="2" />
                                <Tab label="History" value="3" />
                            </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Grid item xs={12}>
                                {/* <Box sx={{mb:1,display:'flex',justifyContent:'space-between'}}>
                                    <Typography sx={{fontSize:'.9rem'}}><em style={{color:'#fff',background:blue[900],padding:'10px 15px 10px 10px',borderTopRightRadius:'20px',borderBottomRightRadius:'20px'}}>Pending for Rectification</em></Typography>
                                    <Tooltip title='Reload data'><IconButton color='primary' className='custom-iconbutton' onClick={refreshData} sx={{'&:hover':{background:blue[800],color:'#ffff'}}}><CachedIcon/></IconButton></Tooltip>
                                </Box> */}
                                <Paper>
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
                                    highlightOnHover
                                />
                                </DataTableExtensions>
                                </Paper>
                            </Grid>
                            </TabPanel>
                            <TabPanel value="2">
                                <Grid item xs={12}>
                                    <RectificationDisapprovedHistoryTable/>
                            </Grid>
                            </TabPanel>
                            <TabPanel value="3">
                                <Grid item xs={12}>
                                    <RectificationHistoryTable/>
                                </Grid>
                            </TabPanel>
                        </TabContext>
                        </Grid>
                        
                        
                        
                        <PreviewFileModal open = {previewFile} close = {handleClosePreviewFile} file={previewFileData} fileType={fileType}>
                        
                        </PreviewFileModal>
                        <LargeModal open = {previewFileImg} close = {()=>setPreviewFileImg(false)} title = 'Preview File'>
                            <FilePanZoom img={previewFileData}/>
                        </LargeModal>
                    </Grid>
                </Fade>
                }
        </Box>
    )
}