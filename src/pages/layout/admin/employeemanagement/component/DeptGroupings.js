import { Grid,Autocomplete, TextField, Button, Paper, TableContainer, Table, TableHead, TableRow, TableBody, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getDeptDiv, getDeptDivList } from '../EmpManagementRequest';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import { StyledTableCell } from '../../../customstring/CustomString';
import SmallModal from '../../../custommodal/SmallModal';
import { AddDivision } from './AddDivision';
import { DivEmpList } from './DivEmpList';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { ManageSection } from './modal/ManageSection';
export const DeptGroupings = ({offices}) =>{
    const [selectedOffice,setSelectedOffice] = useState(null);
    const [deptDiv,setDeptDiv] = useState([])
    const [openAddDiv,setOpenAddDiv] = useState(false)
    const [openDivEmpList,setOpenDivEmpList] = useState(false)
    const [divEmpList,setDivEmpList] = useState([])
    const [openLoadingData,setOpenLoadingData] = useState(false)
    const [selectedDiv,setSelectedDiv] = useState()
    const [openSection,setOpenSection] = useState(false)
    useEffect(async ()=>{
        if(selectedOffice){
            const res = await getDeptDiv({dept_code:selectedOffice.dept_code})
            console.log(res.data)
            setDeptDiv(res.data.data)
        }
    },[selectedOffice])
    const handleViewList = async (item)=>{
        console.log(item)
        setSelectedDiv(item)
        setOpenLoadingData(true)
        const res = await getDeptDivList({id:item.dept_div_id,dept_code:item.dept_code});
        console.log(res.data)
        setDivEmpList(res.data.data)
        setOpenDivEmpList(true)
        setOpenLoadingData(false)

    }
    const handleSection = (item) => {
        setSelectedDiv(item)
        setOpenSection(true)
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="whrs-box"
                    options={offices}
                    getOptionLabel={(option) => option.dept_title}
                    isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code}

                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Department" required/>}
                    value={selectedOffice}
                    onChange={(event,newValue)=>{
                        setSelectedOffice(newValue)
                    }}
                    required
                />
            </Grid>
            {
                selectedOffice
                ?
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Tooltip title='Add New Division'><Button variant='contained' color='success' startIcon={<AddIcon/>} onClick={()=>setOpenAddDiv(true)} className='custom-roundbutton'>Add</Button></Tooltip>
                    </Grid>
                :
                null
            }
            {
                deptDiv.length>0
                ?
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer sx={{maxHeight:'70vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            Division
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Section/s
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Employee List
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Action
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        deptDiv.map((item)=>{
                                            return (
                                                <TableRow key = {item.dept_div_id}>
                                                    <StyledTableCell>
                                                        {item.div_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Tooltip title='View Section List'><Button color='info' variant='outlined' fullWidth onClick={()=>handleSection(item)}>View</Button></Tooltip>
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Tooltip title='View Employee List'><Button color='info' variant='outlined' startIcon={<PeopleIcon/>} fullWidth onClick={()=>handleViewList(item)}>List</Button></Tooltip>
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{display:'flex',gap:1}}>
                                                        <Tooltip title='Update'><Button color='success' variant='outlined' startIcon={<EditIcon/>} fullWidth>Update</Button></Tooltip>
                                                        
                                                    </StyledTableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                :
                null
            }
            
            <SmallModal open = {openAddDiv} close = {()=>setOpenAddDiv(false)} title = {`Adding New Division to ${selectedOffice?.short_name}`}>
                <AddDivision selectedOffice = {selectedOffice} updateData = {setDeptDiv} close = {()=>setOpenAddDiv(false)}/>
            </SmallModal>
            <SmallModal open = {openDivEmpList} close = {()=>setOpenDivEmpList(false)} title = {`${selectedDiv?.div_name} Division`}>
                <DivEmpList list = {divEmpList} selectedDiv = {selectedDiv} updateData = {setDivEmpList} close = {()=>setOpenDivEmpList(false)}/>
            </SmallModal>
            <SmallModal open = {openSection} close = {()=>setOpenSection(false)} title={`${selectedDiv?.div_name} Section/s`}>
                <ManageSection selectedDiv = {selectedDiv} close = {()=>setOpenSection(false)} setOpenLoadingData = {setOpenLoadingData} />
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