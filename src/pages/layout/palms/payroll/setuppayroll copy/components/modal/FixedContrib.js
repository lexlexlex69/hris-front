import { Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { APIError, APISuccess, StyledTableCell, formatExtName, formatMiddlename } from '../../../../../customstring/CustomString';
import AddIcon from '@mui/icons-material/Add';
import SearchEmpModal from '../../../../../custommodal/SearchEmpModal';
import SmallModal from '../../../../../custommodal/SmallModal';
import { AddFixedContrib } from './AddFixedContrib';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UpdateFixedContrib } from './UpdateFixedContrib';
import Swal from 'sweetalert2';
import { deleteFixContrib } from '../../SetupPayrollRequests';
import { APILoading } from '../../../../../apiresponse/APIResponse';
export const FixedContrib = ({data,updateData,close}) =>{
    const [openAdd,setOpenAdd] = useState(false)
    const [selectedData,setSelectedData] = useState([]);
    const [openUpdate,setOpenUpdate] = useState(false);
    const handleUpdate = (item)=>{
        setSelectedData(item)
        setOpenUpdate(true)
    }
    const handleDelete = async (item)=>{
        try{
            Swal.fire({
                icon:'question',
                title:'Confirm delete?',
                confirmButtonText:'Yes',
                showCancelButton:true
            }).then(async res =>{
                if(res.isConfirmed){
                    APILoading('info','Deleting data','Please wait...')
                    const res = await deleteFixContrib({id:item.fixed_contributions_id})
                    if(res.data.status === 200){
                        updateData(res.data.data)
                        APISuccess(res.data.message)
                    }else{
                        APIError(res.data.message)
                    }
                }
            })
        }catch(err){
            APIError(err)
        }
        
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button variant='contained' color='info' startIcon={<AddIcon/>} onClick={()=>setOpenAdd(true)}>Add</Button>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'65vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Name
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Position
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Department
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        SSS
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        PagIbig
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.length >0
                                    ?
                                        data.map((item)=>{
                                            return(
                                                <TableRow key = {item.fixed_contributions_id}>
                                                    <StyledTableCell>{`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.position_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.short_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.sss}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.pagibig}
                                                    </StyledTableCell>
                                                    <StyledTableCell align='center' sx={{display:'flex',justifyContent:'center',gap:1}}>
                                                        <Tooltip title='Update'><IconButton size='small' color='success' className='custom-iconbutton' onClick = {()=>handleUpdate(item)}><EditIcon/></IconButton></Tooltip>
                                                        <Tooltip title='Delete'><IconButton size='small' color='error' className='custom-iconbutton' onClick = {()=>handleDelete(item)}><DeleteIcon/></IconButton></Tooltip>
                                                    </StyledTableCell>
                                                </TableRow>
                                            )
                                        })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={6} align='center'>
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <SmallModal open = {openAdd} close = {()=>setOpenAdd(false)} title='Adding new fixed contributions'>
                <AddFixedContrib updateData = {updateData} close = {()=>setOpenAdd(false)}/>
            </SmallModal>
            <SmallModal open = {openUpdate} close={()=>setOpenUpdate(false)} title='Updating Fixed Contributions'>
                <UpdateFixedContrib selectedData={selectedData} updateData = {updateData} close={()=>setOpenUpdate(false)}/>
            </SmallModal>
            
        </Grid>
    )
}