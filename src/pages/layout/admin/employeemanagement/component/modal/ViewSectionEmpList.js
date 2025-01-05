import { Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Backdrop,CircularProgress, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { deleteDivSecEmpList, getDivSecEmpList } from '../../EmpManagementRequest';
import { APIError, APISuccess, StyledTableCell, formatExtName, formatMiddlename } from '../../../../customstring/CustomString';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { APILoading } from '../../../../apiresponse/APIResponse';
import SmallModal from '../../../../custommodal/SmallModal';
import { AddSectionEmp } from './AddSectionEmp';
export const ViewSectionEmpList = ({selectedSection}) => {
    const [empList,setEmpList] = useState([])
    const [openLoadingData,setOpenLoadingData] = useState(false)
    const [openAdd,setOpenAdd] = useState(false)
    useEffect(()=>{
        _init();
    },[])
    const _init = async () => {
        setOpenLoadingData(true)
        const res = await getDivSecEmpList({dept_code:selectedSection.dept_code,id:selectedSection.dept_div_section_id})
        setEmpList(res.data.data)
        setOpenLoadingData(false)

    }
    const [searchVal,setSearchVal] = useState('')

    const filter = empList.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase()))
    const handleDelete = async (item) =>{
        APILoading('info','Deleting employee from this section','Please wait...')
        const res = await deleteDivSecEmpList({emp_no:item.emp_no})
        if(res.data.status === 200){
            let temp = [...empList];
            let index = temp.findIndex(el=>el.emp_no === item.emp_no);
            temp.splice(index,1);
            setEmpList(temp)
            APISuccess(res.data.message);
        }else{
            APIError(res.data.message)
        }
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}> 
                <Button variant='contained' color='success' startIcon={<AddIcon/>} onClick={()=>setOpenAdd(true)}>Add</Button>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Search Employee' value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} fullWidth size='small'/>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'60vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Name
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Position Name
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Action
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    filter.length>0
                                    ?
                                        filter.map((item)=>{
                                            return (
                                                <TableRow key = {item.id}>
                                                    <StyledTableCell>
                                                    {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.position_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Button variant='contained' color='error' startIcon={<DeleteIcon/>} onClick={()=>handleDelete(item)} className='custom-roundbutton'>Delete</Button>
                                                    </StyledTableCell>
                                                </TableRow>
                                            )
                                        })
                                    :
                                    <TableRow>
                                        <StyledTableCell align='center' colSpan={2}>No Data</StyledTableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <SmallModal open = {openAdd} close = {()=>setOpenAdd(false)} title='Adding employee to selected section'>
                <AddSectionEmp selectedSection={selectedSection} close = {()=>setOpenAdd(false)} updateData = {setEmpList}/>
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