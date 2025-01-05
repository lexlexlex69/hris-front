import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useState } from 'react';
import { formatExtName, formatMiddlename } from '../../../customstring/CustomString';
import EditIcon from '@mui/icons-material/Edit';

export const EmpList = ({empList,handleSelectEmp}) => {
    const [searchVal,setSearchVal] = useState('')
    const filterList = empList.filter(el=>el.fname?.toUpperCase().includes(searchVal.toUpperCase()) || el.lname?.toUpperCase().includes(searchVal.toUpperCase()))
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <TextField label ='Search Employee' value = {searchVal} onChange={(val)=>setSearchVal(val.target.value)} size='small' fullWidth/>

            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TableContainer sx={{maxHeight:'65dvh'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filterList.length>0
                                ?
                                    filterList.map((item)=>{
                                        return(
                                            <TableRow key = {item.id} onClick={()=>handleSelectEmp(item)} sx={{'&:hover':{cursor:'pointer'}}} hover>
                                                <TableCell sx={{fontSize:'.7rem',padding:1,textTransform:'uppercase'}}>
                                                    {item.lname} {formatExtName(item.extname)}, {item.fname} {formatMiddlename(item.mname)} 
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                :
                                <TableRow>
                                    <TableCell align='center'>
                                        No Data
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}