import { Box,Chip,IconButton,Typography,Button, Grid, TextField,Tooltip, Modal,Autocomplete } from '@mui/material';
import React,{useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

//Icons
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import {red,blue} from '@mui/material/colors';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import SearchEmployee from '../../../reports/SRATU/Modal/SearchEmployee';
import CustomSearchEmployee from '../../../searchemployee/CustomSearchEmployee';
import { deleteHRApprovalAssigned, updateHRApprovalAssigned } from '../LeaveInchargeRequest';
import Swal from 'sweetalert2';
import { APILoading } from '../../../apiresponse/APIResponse';
import { APIError, APISuccess, formatExtName, formatMiddlename } from '../../../customstring/CustomString';
import UpdateDialog from '../Dialog/UpdateDialog';
import { wrap } from 'highcharts';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
export default function HRApprovalAssignTable(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState();
    const [empid,setEmpid] = useState();
    const [selectedData,setSelectedData] = useState();
    const searchModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:450,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        p: 2,
      };
    useEffect(()=>{
        setData(props.data)
    },[props.data])
    const columns = [
        {
            name:'Name',
            selector:row=>`${row.lname}, ${row.fname} ${formatExtName(row.extname)} ${formatMiddlename(row.mname)}`,
            style:{
                textTransform:'uppercase'
            }
        },
        // {
        //     name:'Assigned Emp. Status',
        //     selector:row=>formatEmpStatus(row.emp_status)
        // },
        // {
        //     name:'Assigned Department',
        //     selector:row=><Box sx={{maxWidth:'200px',overflow:'scroll'}}>
        //         {formatDeptCode(row.dept_code)}
        //     </Box>
        // },
        {
            name:'Assigned Details',
            selector:row=>formatAssignedDtl(row),
            style:{
            //     padding:'10px 0 10px 0',
                maxHeight:100,
                overflowY:'auto',
                flexWrap:'wrap'
            //     display:'flex'
            }
        },
        {
            name:'Action',
            selector:row=><Box sx={{display:'flex',gap:1}}>
                <Button color='info' className='custom-roundbutton' onClick = {()=>updateAction(row)} size='small' startIcon={<EditIcon/>} variant='contained'>
                    Update
                </Button>
                <Button color='error' className='custom-roundbutton' onClick = {()=>deleteAction(row)} size='small' startIcon={<DeleteIcon/>} variant='contained'>
                    Delete
                </Button>
            </Box>
        },
    ]
    const tableData = {
        columns,
        data
    }
    const formatAssignedDtl = (row) => {
        console.log(JSON.parse(row.dtl))
        let dtl = JSON.parse(row.dtl)
        return (
            <Box sx={{pt:1,pb:1,display:'flex',flexDirection:'column',gap:1}}>
            {
                dtl.map((item)=>{
                    return (
                        <Box key={item.dept_code.dept_code} sx={{display:'flex',alignItems:'center',gap:1}}>
                            <Chip label={item.dept_code.short_name}/>

                            <small style={{background:blue[800],color:'#fff',padding:'5px',borderRadius:'15px'}}>
                            {
                                item.emp_status.map((item2,key2)=>{
                                return (
                                        key2 === 0
                                        ?
                                        <span key ={key2}>{item2.description}</span>
                                        :
                                        <span key ={key2}>, {item2.description}</span>
                                )
                                })
                            }
                            </small>
                            
                        </Box>
                    )
                })
            }
            </Box>
        )

    }
    const formatEmpStatus = (row) => {
        var temp = row.split(',');
        var t_data = [];
        props.empstatusData.forEach((el,key)=>{
            if(temp.includes(el.code)){
                t_data.push(el.description)
            }
        })
        return (
            <Box sx={{display:'flex',gap:1}}>
                {
                    t_data.map((item,key)=>
                    <Chip label={`${item}`} key ={key}/>
                )}
            </Box>
        );
    }
    const formatDeptCode = (row)=>{
        var temp = row.split(',');
        if(temp)
        var t_data = [];

        props.officesData.forEach(el=>{
            if(temp.includes(el.dept_code.toString())){
                t_data.push(el.short_name)
            }
        })

        return (
            <Tooltip title={t_data.map((item,key)=>
                    <Chip sx={{background:'#fff'}} label={`${item}`} key ={key}/>
                )}><Box sx={{display:'flex',gap:1}}>
                {
                    t_data.map((item,key)=>
                    <Chip label={`${item}`} key ={key}/>
                )}
            </Box>
            </Tooltip>
        );
    }
    const deleteAction = (row) =>{
        Swal.fire({
            icon:'question',
            title:'Confirm delete?',
            text:'Action can not be reverted',
            showCancelButton:true,
            confirmButtonText:'Yes'
        }).then(async res=>{
            if(res.isConfirmed){
                try{
                    APILoading('info','Deleting data','Please wait...');
                    const res = await deleteHRApprovalAssigned({id:row.leave_hr_approval_incharge_id});
                    if(res.data.status === 200){
                        props.setHrApprovlAssignData(res.data.data)

                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                }catch(err){
                    APIError(err)
                }
            }
        })
    }
    const [preselectEmpStatus,setPreselectEmpStatus] = useState([])
    const [preselectDeptCode,setPreselectDeptCode] = useState([])
    const updateAction = (row) =>{
        // console.log(row)
        // var temp_emp_stat = [];
        // var temp_dept_code = [];
        // var temp_empstat_arr = row.emp_status.split(',');
        // props.empstatusData.forEach(el=>{
        //     if(temp_empstat_arr.includes(el.code)){
        //         temp_emp_stat.push(el)
        //     }
        // })

        // var temp_deptcode_arr = row.dept_code.split(',');
        // props.officesData.forEach(el=>{
        //     if(temp_deptcode_arr.includes(el.dept_code.toString())){
        //         temp_dept_code.push(el)
        //     }
        // })
        // setPreselectEmpStatus(temp_emp_stat)
        // setPreselectDeptCode(temp_dept_code)
        console.log(row)
        setSelectedData(row)
        setOpenUpdateDialog(true)
        setEmpid(row.employee_id)
    }
    const [openUpdateDialog,setOpenUpdateDialog] = useState(false)
    const [searchModal,setSearchModal] = useState(false)
    const handleSelect = (data) =>{
        console.log(data)
        setEmpid(parseInt(data.id))
        setSearchModal(false)
    }
    const handleSave = (e)=>{
        e.preventDefault();
        Swal.fire({
            icon:'info',
            title:'Updating data',
            html:'Please wait...'
        })
        Swal.showLoading();
        var emp_status = '';
        var dept_code = '';
        preselectEmpStatus.forEach(el=>{
            emp_status+=el.code+',';
        })
        preselectDeptCode.forEach(el=>{
            dept_code+=el.dept_code+',';
        })
        var t_data = {
            id:selectedData.leave_hr_approval_incharge_id,
            emp_id:empid,
            emp_status:emp_status,
            dept_code:dept_code
        }
        updateHRApprovalAssigned(t_data)
        .then(res=>{
            if(res.data.status=== 200){
                props.setHrApprovlAssignData(res.data.data)
                setOpenUpdateDialog(false)
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
            Swal.fire({
                icon:'error',
                title:err
            })
        })
        console.log(t_data)
    }
    return  (
        <React.Fragment>
            <DataTableExtensions
                {...tableData}
                export={false}
                print={false}
            >
            <DataTable
                data = {data}
                columns = {columns}
                highlightOnHover
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                }}
            />
            </DataTableExtensions>
            <Dialog
                fullScreen
                sx={{width:matches?'100%':'50vw',left:'auto'}}
                open={openUpdateDialog}
                // onClose={()=>setOpenAddDialog(false)}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    {/* <IconButton
                    edge="start"
                    color="inherit"
                    onClick={()=>setOpenUpdateDialog(false)}
                    aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton> */}
                    <Typography sx={{flex: 1 }} variant="h6" component="div">
                    Updating Data
                    </Typography>
                    <Button autoFocus color="inherit" onClick={()=>setOpenUpdateDialog(false)}>
                    close
                    </Button>
                </Toolbar>
                </AppBar>
                    <UpdateDialog data = {selectedData} empstatusData = {props.empstatusData} officesData = {props.officesData} close = {()=>setOpenUpdateDialog(false)} setHrApprovlAssignData = {props.setHrApprovlAssignData}/>
                {/* <Box sx={{m:2}}>
                    <form onSubmit={handleSave}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between'}}>
                            <TextField label ='Employee ID' fullWidth value = {empid} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} type='number' required read/>
                        &nbsp;
                        <Tooltip title = 'Search employee'><Button variant='outlined' onClick={()=>setSearchModal(true)}><SearchOutlinedIcon/></Button></Tooltip>
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-empstatus"
                                value = {preselectEmpStatus}
                                options={props.empstatusData}
                                getOptionLabel={(option) => option.description}
                                onChange={(event,newValue)=>{
                                    setPreselectEmpStatus(newValue)
                                }}
                                renderInput={(params) => <TextField {...params} label="Employee Status *"/>}
                                multiple
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-empstatus"
                                value = {preselectDeptCode}
                                options={props.officesData}
                                getOptionLabel={(option) => option.dept_title}
                                onChange={(event,newValue)=>{
                                    setPreselectDeptCode(newValue)
                                }}
                                renderInput={(params) => <TextField {...params} label="Office/Department" />}
                                multiple
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',gap:1,justifyContent:'flex-end'}}>
                            <Button variant='contained' color='success' className='custom-roundbutton' type='submit'>Save Update</Button>
                            <Button variant='contained' color='error' className='custom-roundbutton' onClick={()=>setOpenUpdateDialog(false)}>Cancel</Button>
                        </Grid>
                    </Grid>
                    </form>
                    
                </Box> */}
            </Dialog>
            <Modal
                open={searchModal}
                onClose={()=> setSearchModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={searchModalStyle}>
                    <CustomSearchEmployee handleSelect = {handleSelect}/>
                </Box>
            </Modal>
        </React.Fragment>
    )
}