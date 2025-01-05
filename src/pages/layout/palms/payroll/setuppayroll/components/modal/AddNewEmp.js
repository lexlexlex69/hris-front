import { Button, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formatExtName, formatMiddlename } from '../../../../../customstring/CustomString';
import { addEmpPayrollGroup } from '../../SetupPayrollRequests';
import { APILoading } from '../../../../../apiresponse/APIResponse';
import Swal from 'sweetalert2';
import { blue } from '@mui/material/colors';

export const AddNewEmp = ({empList,close,selectedGroup,setSelectedGroup}) =>{
    const [data,setData] = useState(empList)
    const [selectAll,setSelectAll] = useState(false)
    const handleSelect = (item) => {
        let temp = [...data];
        let index = temp.findIndex(el=>el.id === item.id);

        temp[index].selected = !temp[index].selected;
        setData(temp)
    }
    useEffect(()=>{
        if(selectAll){
            let temp = [...data];
            temp.forEach(el=>{
                el.selected = true;
            })
            setData(temp)
        }else{
            let temp = [...data];
            temp.forEach(el=>{
                el.selected = false;
            })
            setData(temp)
        }
    },[selectAll])
    const handleSave = async () => {
        try{
            APILoading('info','Saving data','Please wait')
            const ids = data.filter(el=>el.selected === true).map(el2=>el2.id)
            const sel_ids = data.filter(el=>el.selected === true);
            var t_data = {
                payroll_group_id:selectedGroup.payroll_group_id,
                ids:ids
            }
            const res = await addEmpPayrollGroup(t_data);
            if(res.data.status === 200){
                let temp = {...selectedGroup};
                let e_list = JSON.parse(temp.emp_list)
                sel_ids.forEach(el=>{
                    e_list.push(el)
                })
                e_list.sort((a,b) => (a.lname > b.lname) ? 1 : ((b.lname > a.lname) ? -1 : 0))
                temp.emp_list = JSON.stringify(e_list)
                setSelectedGroup(temp)
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
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }

    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'65vh'}}>
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
                                        Select <br/>
                                        <Checkbox checked={selectAll} onChange={()=>setSelectAll(!selectAll)}/>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.length>0
                                    ?
                                    data.map((item)=>{
                                        return (
                                            <TableRow key = {item.id}>
                                                <TableCell>
                                                    {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                                </TableCell>
                                                <TableCell>
                                                    {item.position}
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox checked = {item.selected} onChange={()=>handleSelect(item)}/>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={2}>
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
                <Button variant='contained' size='small' color='success' onClick={handleSave} className='custom-roundbutton'>Save</Button>
                <Button variant='contained' size='small' color='error' onClick={close} className='custom-roundbutton'>Cancel</Button>
            </Grid>
        </Grid>
    )
}