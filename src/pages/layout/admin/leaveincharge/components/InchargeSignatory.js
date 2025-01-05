import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { APIError, APISuccess, formatMiddlename } from '../../../customstring/CustomString';
import EditIcon from '@mui/icons-material/Edit';
import SearchEmpModal from '../../../custommodal/SearchEmpModal';
import { APILoading } from '../../../apiresponse/APIResponse';
import { postLeaveInchargeSignatory } from '../LeaveInchargeRequest';
export const InchargeSignatory = ({data,setData}) => {
    const [openSearch,setOpenSearch] = useState(false);
    const [empID,setEmpID] = useState('')
    const updateSelect = async (data)=>{
        console.log(data)
        try{
            APILoading('info','Updating signatory','Please wait...')
            const res = await postLeaveInchargeSignatory({emp_id:empID,id:data})
            if(res.data.status === 200){
                setData(res.data.data)
                APISuccess(res.data.message)
            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    const handleOpenSearch = (item)=>{
        setEmpID(item.employee_id)
        setOpenSearch(true)
    }
    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'60dvh',overflow:'auto'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Leave In Charge
                                    </TableCell>
                                    <TableCell>
                                        Signatory
                                    </TableCell>
                                    <TableCell>
                                    
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.length>0
                                    ?
                                        data.map((item)=>{
                                            return (
                                                <TableRow key = {item.employee_id}>
                                                    <TableCell>
                                                        {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {`${item.assigned_lname}, ${item.assigned_fname} ${formatMiddlename(item.assigned_mname)}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton className='custom-iconbutton' color='primary' onClick={()=>handleOpenSearch(item)}>
                                                        <EditIcon/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    :
                                    <TableRow>
                                        <TableCell align='center' colSpan={3}>No Data</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <SearchEmpModal open = {openSearch} close = {()=>setOpenSearch(false)} title='Search Employee' updateSelect = {updateSelect}>
            </SearchEmpModal>
        </Grid>
    )
}