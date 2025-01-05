import { Grid, TextField , Autocomplete, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Select, Checkbox, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { addPayrollGroupPerOffice, getEmpPerDeptStatus, getEmpStatus } from '../../SetupPayrollRequests';
import { formatExtName, formatMiddlename } from '../../../../../customstring/CustomString';
import Swal from 'sweetalert2';
import { APILoading } from '../../../../../apiresponse/APIResponse';

export const AddGroupName = ({setData,selectedOffice,emp_status,close}) =>{
    const [empStatus,setEmpStatus] = useState([]);
    const [selectedEmpStatus,setSelectedEmpStatus] = useState(null);
    const [empList,setEmpList] = useState([])
    const [selectAll,setSelectAll] = useState(false)
    const [groupName,setGroupName] = useState()
    const [groupSubName,setGroupSubName] = useState()
    const [groupNo,setGroupNo] = useState()
    useEffect(()=>{
        _init();
    },[])
    const _init = async ()=>{
        const res = await getEmpPerDeptStatus({dept_code:selectedOffice.dept_code,emp_status:emp_status})
        res.data.data.forEach(el=>{
            el.selected = false
        })
        setEmpList(res.data.data)
        // const res = await getEmpStatus()
        // setEmpStatus(res.data.data)
    }
    // useEffect( async()=>{
    //     const res = await getEmpPerDeptStatus({dept_code:selectedOffice.dept_code,emp_status:emp_status})
    //     console.log(res.data.data)
    // },[selectedEmpStatus])
    useEffect(()=>{
        if(selectAll){
            let temp = [...empList];
            temp.forEach(el=>{
                el.selected = true
            })
            console.log(temp)
            setEmpList(temp)
        }else{
            let temp = [...empList];
            temp.forEach(el=>{
                el.selected = false
            })
            setEmpList(temp)
        }
    },[selectAll])
    const handleSelect = (item) =>{
        let index = empList.findIndex(el=>el.id === item.id);
        let temp = [...empList];
        temp[index].selected = !temp[index].selected;
        setEmpList(temp)
    }
    const handleSave = async (e)=>{
        try{
            APILoading('info','Adding new group','Please wait')
            e.preventDefault();
            let selected = empList.filter(el=>el.selected === true);
            let ids =  selected.map(el=>el.id)
            if(ids.length>0){
                let t_data = {
                    group_name:groupName,
                    group_subname:groupSubName,
                    group_no:groupNo,
                    dept_code:selectedOffice.dept_code,
                    emp_status:emp_status,
                    ids:ids
                }
                const res = await addPayrollGroupPerOffice(t_data);
                if(res.data.status === 200){
                    setData(res.data.data)
                    close();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1000
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Oops...',
                    text:'Please select at least 1 employee !'
                })
            }
        }catch(err){
            Swal.fire({
                icon:'error',
                title:'Oops...',
                text:err
            })  
        }
        
    }
    return (
        <form onSubmit={handleSave}>
        <Grid container spacing={2} sx={{p:1}}>
            <Grid item xs={12}>
                <TextField label = 'Group Name' value = {groupName} onChange={(val)=>setGroupName(val.target.value)} fullWidth size='small' required/>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Group Sub Name' value = {groupSubName} onChange={(val)=>setGroupSubName(val.target.value)} fullWidth size='small' required/>
            </Grid>
            <Grid item xs={12}>
                <TextField label = 'Payroll Group Number' value = {groupNo} onChange={(val)=>setGroupNo(val.target.value)} fullWidth size='small' placeholder='Payroll Group Number from eGAPS' required/>
            </Grid>
            {/* <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-empstatus"
                    options={empStatus}
                    getOptionLabel={(option) => option.description}
                    // sx={{ width: 500 }}
                    fullWidth
                    size="small"
                    value = {selectedEmpStatus}
                    onChange={(event,newValue)=>{
                        setSelectedEmpStatus(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Payroll Group" required/>}
                    />
            </Grid> */}
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'55vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Select <br/>
                                        <Checkbox checked = {selectAll} onChange={()=>setSelectAll(!selectAll)}/>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    empList.length>0
                                    ?
                                        empList.map((item)=>{
                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox checked={item.selected} onChange={()=>handleSelect(item)}/>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={2} align='center'>
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant='contained' size='small' color='success' type='submit' className='custom-roundbutton'>Save</Button>
                <Button variant='contained' size='small' color='error' onClick={close} className='custom-roundbutton'>Cancel</Button>
            </Grid>
        
        </Grid>
        </form>
    )
}