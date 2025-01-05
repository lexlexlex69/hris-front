import React,{useState,useEffect,useMemo} from 'react';
import { Grid, Typography,Box,Paper, Button,FormControlLabel ,Switch,Modal, Tooltip, Fade,IconButton  } from '@mui/material';
import { checkPermission } from '../../permissionrequest/permissionRequest';
import { getAllHeadOfOfficeData,getAllOfficeData,deleteHeadOfficeOIC, getOfficeNotAdded } from './HeadOfOfficeConfigRequest';
import {
    useNavigate
} from "react-router-dom";

import DataTable from 'react-data-table-component';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//icon
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MinimizeOutlinedIcon from '@mui/icons-material/MinimizeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import AddHeadOfficeOICForm from './AddHeadOfficeOICForm';
import Swal from 'sweetalert2';
import HeadOfOfficeDataTable from './HeadOfOfficeDataTable';
import UpdateOICActionForm from './UpdateOICActionForm';
import { auditLogs } from '../../auditlogs/Request';
import ModuleHeaderText from '../../moduleheadertext/ModuleHeaderText';
import SmallModal from '../../custommodal/SmallModal';
import SmallestModal from '../../custommodal/SmallestModal';
import { green } from '@mui/material/colors';
import { AddHeadOfOffice } from './Modal/AddHeadOfOffice';
import MediumModal from '../../custommodal/MediumModal';

const updateModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    // marginBottom: matches? 20:0,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius:3,
    boxShadow: 24,
    // p: 4,
  };
export default function HeadOfOfficeConfig(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate()
    const [oicdata,setOICData] = useState([])
    const [officeHeadData,setOfficeHeadData] = useState([])
    const [updateModal,setUpdateModal] = useState(false)
    const [addModal,setAddModal] = useState(false)
    const [updateInfo,setUpdateInfo] = useState([])
    const [officeData,setOfficeData] = useState([])
    const [officeArr,setOfficeArr] = useState('')
    const [officeNotAddedData,setOfficeNotAddedData] = useState([])
    const [addNewHeadOffice,setAddNewHeadOffice] = useState(false)
    useEffect(()=>{
        checkPermission(23)
        .then((response)=>{
            if(response.data){
                var logs = {
                    action:'ACCESS HEAD OF OFFICE CONFIG',
                    action_dtl:'ACCESS HEAD OF OFFICE CONFIG MODULE',
                    module:'HEAD OF OFFICE OIC CONFIGURATION'
                }
                auditLogs(logs)
                getAllHeadOfOfficeData()
                .then(response=>{
                    const data = response.data
                    setOICData(data.oic_data)
                    setOfficeHeadData(data.officehead_data)
                }).catch(error=>{
                    console.log(error)
                })
                getAllOfficeData()
                .then(respo=>{
                    const data = respo.data
                    setOfficeData(data)
                })
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
            _init();
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    const _init = async ()=>{
        const res = await getOfficeNotAdded()
        setOfficeNotAddedData(res.data.data)
    }
    const oiccolumns = [
        {
            name:'Name',
            selector:row=>row.fname+' '+(row.mname?row.mname.charAt(1)+'. ':' ')+row.lname
        },
        {
            name:'Office',
            selector:row=>row.office_division_name
        },
        {
            name:'Office Head',
            selector:row=>row.office_division_assign
        },
        {
            name:'Designation Until',
            selector:row=>moment(row.expiration).format('MMMM DD, YYYY h:mm:ss a')
        },
        {
            name:'Status',
            selector:row=>moment(row.expiration).diff(new Date(), 'hours')<0 ? <span style={{color:'red',fontWeight:'bold'}}>Expired {formatExpired(row)} </span>:<span style={{color:'green',fontWeight:'bold'}}>Active</span>
        },
        {
            name:'Action',
            selector:row=> <Box sx={{display:'flex',gap:1,p:1,flexWrap:'wrap'}}>
                <Tooltip title = 'Update' placement='top'>
                <Button variant='contained' color='primary' className='custom-roundbutton' onClick = {()=>updateOICAction(row)}startIcon={<EditOutlinedIcon/>}>Update</Button></Tooltip>
                <Tooltip title = 'Delete' placement='top'><Button variant='contained' color='error' onClick = {()=>deleteOICAction(row)} className='custom-roundbutton' startIcon={<DeleteOutlineOutlinedIcon/>}>Delete</Button></Tooltip>
                </Box>
        },
    ]
    const formatExpired = (row)=>{
        if(Math.abs(moment(row.expiration).diff(new Date(), 'hours')) > 24){
            if(Math.abs(moment(row.expiration).diff(new Date(), 'days'))>31){
                if(Math.abs(moment(row.expiration).diff(new Date(), 'months'))>12){
                    var years = Math.abs(moment(row.expiration).diff(new Date(), 'years'));
                    return years>1?years+' years ago':years+' year ago';
                }else{
                    var months = Math.abs(moment(row.expiration).diff(new Date(), 'months'));
                    return months>1?months+' months ago':months+' month ago';
                }
            }else{
                var days = Math.abs(moment(row.expiration).diff(new Date(), 'days'));
                return days>1?days+' days ago':days+' day ago';
            }
        }else{
            var hours = Math.abs(moment(row.expiration).diff(new Date(), 'hours'));
            return hours>1?hours+' hours ago':hours+' hour ago';
        }
    }
    const updateOICAction = (row)=>{
        officeData.forEach(element => {
            if(element.head_office_designation_id === row.head_office_designation_id){
                setOfficeArr(element)
            }
        });
        setUpdateInfo(row)
        setUpdateModal(true)
    }
    const deleteOICAction = (row)=>{
        Swal.fire({
            icon:'question',
            title: 'Confirm delete?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            if (result.isConfirmed) {
                deleteHeadOfficeOIC(row.head_office_designations_oic_id)
                .then(respo=>{
                    const data = respo.data
                    if(data.status === 200){
                        setOICData(data.data)
                        // setOfficeHeadData(data.officehead_data)
                        Swal.fire({
                            icon:'success',
                            title:data.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:data.message,
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
          })
    }
    const onUpdateInfo = (value)=>{
        setOICData(value)
    }
    const handleAddOfficeHead = () => {
        setAddNewHeadOffice(true)
    }
    return(
        <Box sx={{margin:'0 10px 10px 10px'}}>
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                    <ModuleHeaderText title='Head of Office Configuration'/>
                </Grid>

                <Grid item xs={12} sx={{mt:2,mb:2,display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{borderLeft:'solid 5px',paddingLeft:'20px',color:'#01579b',fontWeight:'bold'}}>Office Head</Typography>
                    <Button variant='contained' className='custom-roundbutton' color = 'success' startIcon={<AddIcon/>} onClick = {handleAddOfficeHead}>
                        Add
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Box component={Paper}>
                        <HeadOfOfficeDataTable
                            data = {officeHeadData}
                            setOfficeHeadData = {setOfficeHeadData}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{mt:2,mb:2,display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <Typography sx={{borderLeft:'solid 5px',paddingLeft:'20px',color:'#01579b',fontWeight:'bold'}}>Office OIC</Typography>
                    <Tooltip title='Add Office OIC'>
                    <Button variant='contained' className ='custom-roundbutton' onClick = {()=>setAddModal(true)} color='success' startIcon={<AddIcon/>}>Add</Button></Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <Box  component={Paper}>
                    <DataTable
                        data = {oicdata}
                        columns = {oiccolumns}
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 15, 25, 50]}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Records per page:',
                            rangeSeparatorText: 'out of',
                        }}
                        pagination
                        highlightOnHover
                    />
                    </Box>
                </Grid>
            </Grid>
            <SmallestModal open = {updateModal} close = {()=> setUpdateModal(false)} title='Updating Office OIC Info'>
                <Box sx={{m:1}}>
                    <UpdateOICActionForm data = {updateInfo} officeData = {officeData} onUpdateInfo = {onUpdateInfo} close = {()=> setUpdateModal(false)} officeArr = {officeArr}/>
                </Box>
            </SmallestModal>
            <SmallestModal open = {addModal} close = {()=> setAddModal(false)} title='Adding Office OIC'>
                <Box sx={{mt:1}}>
                <AddHeadOfficeOICForm close = {()=> setAddModal(false)} officeData={officeData} onUpdateInfo = {onUpdateInfo}/>
                </Box>
            </SmallestModal>
            <MediumModal open = {addNewHeadOffice} close={()=>setAddNewHeadOffice(false)} title='Adding New Head of Office'>
                <AddHeadOfOffice officeData={officeNotAddedData} setOfficeData = {setOfficeNotAddedData} setData = {setOfficeHeadData} close={()=>setAddNewHeadOffice(false)}/>
            </MediumModal>
        </Box>
    )
}