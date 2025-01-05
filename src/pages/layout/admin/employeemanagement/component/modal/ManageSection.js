import { Button, Grid, Paper, Table, TableContainer, TableHead, TableRow, TextField, Backdrop,CircularProgress, TableBody, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { APIError, APISuccess, StyledTableCell } from '../../../../customstring/CustomString';
import AddIcon from '@mui/icons-material/Add';
import { deleteDivSection, getDivSecList } from '../../EmpManagementRequest';
import SmallModal from '../../../../custommodal/SmallModal';
import { AddSection } from './AddSection';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import { ViewSectionEmpList } from './ViewSectionEmpList';
import Swal from 'sweetalert2';
import { APILoading } from '../../../../apiresponse/APIResponse';

export const ManageSection = ({selectedDiv,updateData}) =>{
    const [openAdd,setOpenAdd] = useState(false)
    const [data,setData] = useState([])
    const [openLoadingData,setOpenLoadingData] = useState(false);
    const [openSecList,setOpenSecList] = useState(false);
    const [selectedSection,setSelectedSection] = useState([])
    useEffect(()=>{
        _init();
    },[])
    const _init = async () =>{
        setOpenLoadingData(true)
        const res = await getDivSecList({id:selectedDiv.dept_div_id})
        // console.log(res.data)
        setData(res.data.data)
        setOpenLoadingData(false)
    }
    const handleViewList = (item) => {
        console.log(item)
        setSelectedSection(item)
        setOpenSecList(true)
    }
    const handleDelete = async(item)=>{
        Swal.fire({
            icon:'warning',
            title:'Confirm delete ?',
            showCancelButton:true,
            confirmButtonText:'Yes'
        }).then(async (res)=>{
            if(res.isConfirmed){
                APILoading('info','Deleting Section','Please wait...')
                const res = await deleteDivSection({id:item.dept_div_section_id,dept_div_id:item.dept_div_id})
                if(res.data.status === 200){
                    APISuccess(res.data.message)
                    setData(res.data.data)
                }else{
                    APIError(res.data.message)
                }
            }
        })
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button variant='contained' color='success' startIcon={<AddIcon/>} onClick={()=>setOpenAdd(true)} className='custom-roundbutton'>Add</Button>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Section Name
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.length>0
                                    ?
                                        data.map((item)=>{
                                            return (
                                                <TableRow key = {item.dept_div_section_id}>
                                                    <StyledTableCell>
                                                        {item.section_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{display:'flex',gap:1}}>
                                                        <Tooltip title = 'View Employee List'><Button variant='outlined' startIcon={<PeopleIcon/>} onClick={()=>handleViewList(item)} className='custom-roundbutton'>View List</Button></Tooltip>
                                                        <Tooltip title = 'Delete Section'><Button variant='outlined' startIcon={<DeleteIcon/>} color='error' onClick={()=>handleDelete(item)} className='custom-roundbutton'>Delete</Button></Tooltip>
                                                    </StyledTableCell>
                                                </TableRow>
                                            )
                                        })
                                    :
                                    <TableRow>
                                        <StyledTableCell align='center' colSpan={2}>
                                            No Data
                                        </StyledTableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <SmallModal open = {openAdd} close = {()=>setOpenAdd(false)} title='Adding new Section'>
                <AddSection selectedDiv={selectedDiv} updateData={setData}  close = {()=>setOpenAdd(false)} setOpenLoadingData = {setOpenLoadingData}/>
            </SmallModal>
            <SmallModal open = {openSecList} close = {()=>setOpenSecList(false)} title='Employee List'>
                <ViewSectionEmpList selectedSection={selectedSection}/>
            </SmallModal>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoadingData}
                onClick={()=>setOpenLoadingData(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid>
    )
}