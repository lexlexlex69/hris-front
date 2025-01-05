import { Autocomplete, Backdrop, Box, Button, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
// media query
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// api request
import { deleteEmpPayrollGroup, deletePayGroup, getEmpPerDeptStatus, getPayrollGroupPerOffice, getPayrollGroupings } from '../../SetupPayrollRequests';
// custom component
import { APIError, APISuccess, formatExtName, formatMiddlename } from '../../../../../customstring/CustomString';
import SmallModal from "../../../../../custommodal/SmallModal";
import { AddGroupName } from '../modal/AddGroupName';
import { DeleteGroupname } from '../modal/DeleteGroupName';
import { AddNewEmp } from '../modal/AddNewEmp';
import { APILoading } from '../../../../../apiresponse/APIResponse';

export const Groupings = ({offices,emp_status})=>{
    const [selectedOffice,setSelectedOffice] = useState(null)
    const [data,setData] = useState([])
    const [selectedGroup,setSelectedGroup] = useState(null)
    const [openAddGroupName,setOpenAddGroupName] = useState(false)
    const [openDeleteGroupName,setOpenDeleteGroupName] = useState(false)
    const [openAddNewEmp,setOpenAddNewEmp] = useState(false)
    const [empList,setEmpList] = useState([])
    const [openLoading, setOpenLoading] = React.useState(false);
    const handleCloseLoading = () => {
        setOpenLoading(false);
    };
    const handleOpenLoading = () => {
        setOpenLoading(true);
    };
    useEffect( async()=>{
        if(selectedOffice){
            handleGetGroupingsPerOffice();
        }
    },[selectedOffice])
    const handleGetGroupingsPerOffice = async () => {
        handleOpenLoading();
        const res = await getPayrollGroupPerOffice({
            dept_code:selectedOffice.dept_code,
            emp_status:emp_status
        })
        setData(res.data.data)
        handleCloseLoading();
    }

    const toastDeleteId = React.useRef(null);

    const notify = () => toastDeleteId.current = toast("Deleting data",{isLoading:true,autoClose:false});

    const dismiss = () =>  toast.dismiss(toastDeleteId.current);
    
    const handleRemove = async (item)=>{
        notify();
        const res = await deleteEmpPayrollGroup({payroll_group_dtl_id:item.payroll_group_dtl_id})
        if(res.data.status === 200){
            let temp = {...selectedGroup}
            let temp2 = JSON.parse(temp.emp_list);
            let index = temp2.findIndex(el=>el.id === item.id)
            temp2.splice(index,1);
            temp.emp_list = JSON.stringify(temp2);
            setSelectedGroup(temp)
            dismiss();
        }else{
            toast(`${res.data.message}`);
        }
        // console.log(res.data)
        console.log(item)
    }
    const handleAddNewEmp = async () => {
        handleOpenLoading();
        const res = await getEmpPerDeptStatus({dept_code:selectedOffice.dept_code,emp_status:emp_status})
        res.data.data.forEach(el=>{
            el.selected = false
        })
        setEmpList(res.data.data)
        handleCloseLoading()
        setOpenAddNewEmp(true)
    }
    const [searchVal,setSearchVal] = useState('')
    const filterData = selectedGroup?JSON.parse(selectedGroup.emp_list).filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase())):[]
    const handleDeleteGroup = async () => {
        Swal.fire({
            icon:'question',
            title:'Confirm delete?',
            text:'Action can not be reverted ',
            showCancelButton:true,
            confirmButtonText:'Yes, Confirm'
        }).then(async res=>{
            if(res.isConfirmed){
                APILoading('info','Deleting Group Name','Please wait...');
                let t_data = {
                    payroll_group_id:selectedGroup.payroll_group_id
                }
                const res = await deletePayGroup(t_data)
                console.log(res)
                if (res.data.status === 500) {
                    APIError('Error Deleting Group', res.data.message);
                }
                if (res.data.status === 200) {
                    APISuccess('Deleted Group', res.data.message);
                    handleGetGroupingsPerOffice();
                }
            }
        }).catch((err) => {
            APIError('Error Deleting Group', err.data.message);
        })
        // console.log(selectedGroup)
    }
    return (
        <Grid container spacing={2} sx={{p:1}}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-offices"
                    options={offices}
                    getOptionLabel={(option) => option.dept_title}
                    // sx={{ width: 300 }}
                    fullWidth
                    size="small"
                    value = {selectedOffice}
                    onChange={(event,newValue)=>{
                        setSelectedOffice(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Filter Office" required/>}
                />  
            </Grid>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:1,alignItems:'center'}}>
                <Autocomplete
                    disablePortal
                    id="combo-box-offices"
                    options={data}
                    getOptionLabel={(option) => option.group_name}
                    // sx={{ width: 300 }}
                    fullWidth
                    size="small"
                    value = {selectedGroup}
                    onChange={(event,newValue)=>{
                        setSelectedGroup(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Group Name" required/>}
                />
                <Tooltip title='Add new group name'>
                <span>
                <Button variant='contained' startIcon={<AddCircleIcon/>} onClick={()=>setOpenAddGroupName(true)}sx={{minWidth:'auto',pl:2,pr:2}} className='custom-roundbutton' disabled={selectedOffice?false:true}>Add</Button></span>
                </Tooltip>
                
                {
                    selectedGroup
                    ?
                    <Tooltip title='Delete this group name'><Button variant='contained' startIcon={<DeleteIcon/>} color='error' onClick={handleDeleteGroup}sx={{minWidth:'auto',pl:2,pr:2}} className='custom-roundbutton'>Delete</Button>
                    </Tooltip>
                    :
                    null
                }
                
            </Grid>

            <Grid item xs={12}>
                <Paper>
                {
                    selectedGroup
                    ?
                    <>
                    <Tooltip title={`Add data to ${selectedGroup?.group_name}`}><Button variant='outlined' fullWidth startIcon={<AddCircleIcon/>} onClick={handleAddNewEmp}>Add</Button></Tooltip>
                    <TextField sx={{mt:1}} label = 'Search' value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} size='small' fullWidth/>
                    </>
                    :
                    null
                }

                <TableContainer sx={{maxHeight:'50vh'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Position
                                </TableCell>
                                <TableCell>
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                selectedGroup
                                ?
                                    JSON.parse(selectedGroup.emp_list).length>0
                                    ?
                                    filterData.map((item)=>{
                                        return(
                                            <TableRow key={item.id}>
                                                <TableCell sx={{textTransform:'uppercase'}}>
                                                    {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                                </TableCell>
                                                <TableCell>
                                                    {item.position}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title='Remove from group list'>
                                                    <Button variant='contained' color = 'error' startIcon={<DeleteIcon/>}onClick = {()=>handleRemove(item)} size='small' className='custom-roundbutton'>Remove</Button>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={3} align='center'>No Data</TableCell>
                                    </TableRow>
                                
                                :
                                <TableRow>
                                    <TableCell colSpan={3} align='center'>No Data</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                
                </TableContainer>   
                </Paper>
            </Grid>
            <SmallModal open = {openAddGroupName} close = {()=>setOpenAddGroupName(false)} title='Adding new Group Name'>
                <AddGroupName setData = {setData} selectedOffice = {selectedOffice} emp_status = {emp_status} close = {()=>setOpenAddGroupName(false)}/>
            </SmallModal>
            <SmallModal open = {openDeleteGroupName} close = {()=>setOpenDeleteGroupName(false)} title='Deleting Group Name'>
                <DeleteGroupname data = {data} setData = {setData} />
            </SmallModal>
            <SmallModal open = {openAddNewEmp} close = {()=>setOpenAddNewEmp(false)} title={`Adding New Employee to ${selectedGroup?.group_name}`}>
                <AddNewEmp empList = {empList} close = {()=>setOpenAddNewEmp(false)} selectedGroup = {selectedGroup} setSelectedGroup={setSelectedGroup}/>
            </SmallModal>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoading}
                onClick={handleCloseLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid>
    )
}