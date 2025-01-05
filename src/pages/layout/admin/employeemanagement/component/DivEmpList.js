import { Button, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography,TextField, Checkbox } from '@mui/material';
import React, { useState,useEffect } from 'react';
import { APIError, APISuccess, APIWarning, StyledTableCell, formatExtName, formatMiddlename } from '../../../customstring/CustomString';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { addDivEmpList, deleteDivEmpList, getEmpListGroupings } from '../EmpManagementRequest';
import { APILoading } from '../../../apiresponse/APIResponse';
import SmallModal from '../../../custommodal/SmallModal';
export const DivEmpList = ({list,selectedDiv,updateData,close})=>{
    const [data,setData] = useState(list)
    const [empList,setEmpList] = useState([])
    const [openAdd,setOpenAdd] = useState(false)
    const [selectAll,setSelectAll] = useState(false)
    const [searchVal,setSearchVal] = useState('')
    const [searchVal2,setSearchVal2] = useState('')
    const handleDelete = async (item) =>{
        try{
            APILoading('info','Deleting from list','Please wait...')
            const res = await deleteDivEmpList({emp_no:item.emp_no});
            if(res.data.status === 200){
                let temp = [...data]
                let index = temp.findIndex(el=>el.emp_no === item.emp_no);
                temp.splice(index,1);
                setData(temp)
                APISuccess(res.data.message)

            }else{
                APIError(res.data.message)
            }
        }catch(err){
            APIError(err)
        }
    }
    useEffect(()=>{
        if(selectAll){
            let temp = [...empList];
            temp.forEach(el=>{
                el.selected = true;
            })
            setEmpList(temp)
        }else{
            let temp = [...empList];
            temp.forEach(el=>{
                el.selected = false;
            })
            setEmpList(temp)
        }
    },[selectAll])
    const handleSelect = (id) => {
        let temp = [...empList];
        let index = temp.findIndex(el=>el.id === id);
        temp[index].selected = !temp[index].selected;
        setEmpList(temp)
    }
    const handleAdd = async () => {
        const res = await getEmpListGroupings({dept_code:selectedDiv.dept_code})
        res.data.data.forEach(el=>{
            el.selected = false
        })
        
        setEmpList(res.data.data)
        setOpenAdd(true)
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            APILoading('info','Adding data','Please wait...')
            let ids = empList.filter(el=>el.selected).map(el2=>el2.emp_no);
            if(ids.length>0){
                const res = await addDivEmpList({ids:ids,div_code:selectedDiv.dept_div_id})
                if(res.data.status === 200){
                    setData(res.data.data)
                    APISuccess(res.data.message)
                    setOpenAdd(false)
                }else{
                    APIError(res.data.message)
                }
            }else{
                APIWarning('Please select employee')
            }
        }catch(err){
            APIError(err)
        }
    }
    const filter = data.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase()))
    const filter2 = empList.filter(el=>el.fname.toUpperCase().includes(searchVal2.toUpperCase()) || el.lname.toUpperCase().includes(searchVal2.toUpperCase()))
    return (
        <Grid container spacing ={1}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button variant='contained' color='success' startIcon={<AddIcon/>} onClick={handleAdd} className='custom-roundbutton'>Add</Button>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Search Employee' value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} fullWidth size='small'/>
            </Grid>
            <Grid item xs={12}>
                {/* <Typography><strong>Division Name:</strong> {selectedDiv?.div_name}</Typography> */}
                <Paper>
                    <TableContainer sx={{maxHeight:'70vh'}}>
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
                                        Action
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    filter.length>0
                                    ?
                                    filter.map((item)=>{
                                        return(
                                            <TableRow key = {item.emp_no}>
                                                <StyledTableCell>
                                                    {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {item.position_name}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Button variant='contained' startIcon={<DeleteIcon/>} color='error' onClick={()=>handleDelete(item)} className='custom-roundbutton'>Delete</Button>
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                        
                                    })
                                    :
                                    <TableRow>
                                        <StyledTableCell align='center' colSpan={3}>No Data</StyledTableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <SmallModal open = {openAdd} close = {()=>setOpenAdd(false)} title={`Adding to ${selectedDiv.div_name}`}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField label = 'Search Employee' value={searchVal2} onChange={(val)=>setSearchVal2(val.target.value)} fullWidth size='small'/>
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
                                                    Position
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Select <br/>
                                                    <Checkbox checked={selectAll} onChange={()=>setSelectAll((prev)=>!prev)}/>
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                filter2.length>0
                                                ?
                                                filter2.map((item)=>{
                                                    return (
                                                        <TableRow key = {item.id}>
                                                            <StyledTableCell>
                                                                {`${item.lname} ${formatExtName(item.extname)}, ${item.fname} ${formatMiddlename(item.mname)}`}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.position_name}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Checkbox checked = {item.selected} onChange={()=>handleSelect(item.id)}/>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <StyledTableCell colSpan={3} align='center'>No Data</StyledTableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sx={{display:'flex',gap:1,justifyContent:'flex-end'}}>
                            <Button variant='contained' className='custom-roundbutton' color='success' type='submit'>Submit</Button>
                            <Button variant='contained' className='custom-roundbutton' color='error' onClick={close}>Cancel</Button>
                        </Grid>
                    </Grid>
                    </form>
            </SmallModal>
        </Grid>
    )
}