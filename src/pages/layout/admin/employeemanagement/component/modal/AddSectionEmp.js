import { Button, Grid, Checkbox, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField,Backdrop,CircularProgress  } from '@mui/material';
import React,{useEffect,useState} from 'react';
import { addDivSecEmpList, getDivSecUnsetEmp } from '../../EmpManagementRequest';
import { APIError, APISuccess, APIWarning, StyledTableCell, formatExtName, formatMiddlename } from '../../../../customstring/CustomString';
import { APILoading } from '../../../../apiresponse/APIResponse';
export const AddSectionEmp = ({selectedSection,close,updateData}) => {
    const [openLoadingData,setOpenLoadingData] = useState(false)
    const [empList,setEmpList] = useState([]);
    const [searchVal,setSearchVal] = useState('')
    const [selectAll,setSelectAll] = useState(false)
    useEffect(async ()=>{
        setOpenLoadingData(true)
        const res = await getDivSecUnsetEmp({dept_code:selectedSection.dept_code,dept_div_id:selectedSection.dept_div_id})
        res.data.data.forEach(el=>{
            el.selected = false;
        })
        setEmpList(res.data.data)
        setOpenLoadingData(false)
    },[])
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
    const filter = empList.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase()))
    const handleSelect = (id) => {
        let temp = [...empList];
        let index = temp.findIndex(el=>el.id === id);
        temp[index].selected = !temp[index].selected;
        setEmpList(temp)
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            APILoading('info','Adding new employee section','Please wait...')
            let ids = empList.filter(el=>el.selected).map(el2=>el2.emp_no);
            if(ids.length>0){
                const res = await addDivSecEmpList({dept_code:selectedSection.dept_code,dept_div_section_id:selectedSection.dept_div_section_id,ids:ids})
                if(res.data.status === 200){
                    updateData(res.data.data)
                    APISuccess(res.data.message)
                    close();
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
    return (
        <>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
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
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant='contained' color='success' className='custom-roundbutton' type='submit'>Submit</Button>
                <Button variant='contained' color='error' className='custom-roundbutton' onClick={close}>Cancel</Button>
            </Grid>
        </Grid>
        </form>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openLoadingData}
            onClick={()=>setOpenLoadingData(false)}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        </>

    )
}