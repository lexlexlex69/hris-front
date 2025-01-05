import { Grid, TextField, Typography,Autocomplete,Box,Tooltip,Button, Modal } from '@mui/material';
import React, {useState} from 'react';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import { searchFilterUpdate } from '../WorkScheduleRequest';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import UpdateSelectedEmployeeEmpSched from './UpdateSelectedEmpSched';
import { getEmpScheduleData,getScheduleData,deleteEmpScheduleData,deleteMultipleEmpScheduleData } from '../WorkScheduleRequest';
import moment from 'moment';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';
export default function UpdateEmployeeSchedule(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [filterDepartment,setFilterDepartment] = useState(null);
    const [data,setData] = useState([]);
    const [selectedUpdate,setSelectedUpdate] = useState([]);
    const [showUpdateSchedModal,setShowUpdateSchedModal] = useState(false)
    const [selectedEmpSchedData,setSelectedEmpSchedData] = useState([])
    const [selectedEmp,setSelectedEmp] = useState('')
    const updateSchedStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?300:900,
        marginBottom: 0,
        bgcolor: '#fff',
        border: '2px solid #fff',
        borderRadius:3, 
        boxShadow: 24,
      };
    const submitSearchFilter = () => {
        var data2 = {
            dept_code:filterDepartment.dept_code
        }
        searchFilterUpdate(filterDepartment)
        .then(res=>{
            setData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+row.emp_mname.charAt(0)+'.'
        },
        {
            name:'Department',
            selector:row=>row.dept_title
        },
        {
            name:'Action',
            selector:row=><Box>
                {/* <Button size='small' color='error' sx={{'&:hover':{background:'red',color:'white'}}}><DeleteOutlineOutlinedIcon sx={{fontSize:'1rem'}}/></Button>
                <Button variant='outlined' size='small' color='success' onClick={()=>updateAction(row)}><EditOutlinedIcon sx={{fontSize:'1rem'}}/></Button> */}
                <Button variant='outlined' size='small' color='error' onClick={()=>deleteSpecificAction(row)}><DeleteOutlineOutlinedIcon/></Button>
                <Button variant='outlined' size='small' color='success' onClick={()=>updateAction(row)}><EditOutlinedIcon/></Button>
            </Box>
        }
    ]
    const handleSelectedUpdate = ({ selectedRows }) => {
        setSelectedUpdate(selectedRows)
    };
    const tableData ={
        columns,
        data
    }
    const deleteSpecificAction = (row) => {
        Swal.fire({
            icon:'warning',
            title: 'Delete work schedule ?',
            html:'<em>By confirming <strong>Yes</strong>, all work schedule of the selected employee will be deleted.</em>',
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                deleteEmpScheduleData(row.emp_no)
                .then(res=>{
                    if(res.data === 0){
                        Swal.fire({
                            icon:'info',
                            title:'Work Schedule Already deleted'
                        })
                    }else{
                        Swal.fire({
                            icon:'success',
                            title:'Work Schedule Successfully deleted'
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
          })
        
    }
    const deleteAction = ()=>{
        Swal.fire({
            icon:'warning',
            title: 'Delete work schedule ?',
            html:'<em>By confirming <strong>Yes</strong>, all work schedule of the selected employees will be deleted.</em>',
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var ids = []
                selectedUpdate.forEach(el=>{
                    ids.push(el.emp_no)
                })
                deleteMultipleEmpScheduleData(ids)
                .then(res=>{
                    if(res.data.status === 200){
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            html:'No. of records deleted: <strong>'+res.data.deleted+'</strong>'
                        })
                    }else{
                        Swal.fire({
                            icon:'info',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
          })
        
    }
    const updateAction = (row)=>{
        setSelectedEmp(row)
        var data2 ={
            emp_no:row.emp_no,
            month:moment(new Date()).format('MM'),
            year:moment(new Date()).format('YYYY')
        }
        getScheduleData(data2)
        .then(res=>{
            setSelectedEmpSchedData(res.data)
            setShowUpdateSchedModal(true)
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-dept"
                        options={props.deptData}
                        sx={{minWidth:250}}
                        value = {filterDepartment}
                        getOptionLabel={(option) => option.dept_title}
                        onChange={(event,newValue) => {
                            setFilterDepartment(newValue);
                            }}
                        renderInput={(params) => <TextField {...params} label="Department" required/>}
                        />
                        &nbsp;
                        <Tooltip title ='Search Filter'><Button variant='outlined' onClick={submitSearchFilter}><ManageSearchOutlinedIcon/></Button></Tooltip>
                </Box>
            </Grid>
            <Grid item xs={12} sx={{maxHeight:'60vh',overflowY:'scroll',m:2}}>
            <DataTableExtensions
                {...tableData}
                export={false}
                print={false}
                >

                <DataTable
                    title={(
                        data.length !==0
                        ?
                        <Typography>List of employees</Typography>
                        :
                        ''
                    )}
                    data={data}
                    columns={columns}
                    onSelectedRowsChange = {handleSelectedUpdate}
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 15, 25, 50]}
                    paginationComponentOptions={{
                        rowsPerPageText: 'Records per page:',
                        rangeSeparatorText: 'out of',
                    }}
                    pagination
                    highlightOnHover
                    selectableRows
                    contextActions ={
                        (
                        <Box>
                            <Button onClick ={deleteAction}>Delete</Button>
                        </Box>
                    
                    )
                    }
                />
            </DataTableExtensions>
            </Grid>
            <Modal
                open={showUpdateSchedModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={updateSchedStyle}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setShowUpdateSchedModal(false)}/>
                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                    Updating <strong>{selectedEmp.emp_lname}'s</strong> Work Schedule
                    </Typography>
                    <Box>
                        <UpdateSelectedEmployeeEmpSched data = {selectedEmpSchedData} emp={selectedEmp} date ={moment(new Date()).format('YYYY-MM-DD')}/>

                    </Box>
                </Box>

            </Modal>
        </Grid>
    )
}