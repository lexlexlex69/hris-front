import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography,Checkbox,Fade,Box } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { deleteMultipleRequestedDelWorkSched, deleteRequestedDelWorkSched, getRequestedDelWorkSched } from '../WorkScheduleRequest';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import Swal from 'sweetalert2';
export default function RequestDeleteWorkSchedule(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [multipleDeleteData,setMultipleDeleteData] = useState([])
    const [selectAll,setSelectAll] = useState(false)
    const handleDelete = (row) =>{
        Swal.fire({
            icon:'info',
            title:'Deleting',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            id:row.work_sched_id,
            request_id:row.work_sched_request_id
        }
        deleteRequestedDelWorkSched(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                props.setReqDelData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1000,
                    showConfirmButton:false
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message,
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleSelectID = (id)=>{
        var t_data = [...multipleDeleteData];
        var index = t_data.indexOf(id)
        console.log(index)
        if(index === -1){
            t_data.push(id);
            setMultipleDeleteData(t_data)
        }else{
            t_data.splice(index,1);
            setMultipleDeleteData(t_data)
        }
    }
    useEffect(()=>{
        if(selectAll){
            var t_data = [];
            props.data.forEach(el=>{
                t_data.push(el.work_sched_id)
            })
            // console.log(t_data)
            setMultipleDeleteData(t_data)
        }else{
            setMultipleDeleteData([])
        }
    },[selectAll])
    const handleMultipleDelete = ()=>{
        Swal.fire({
            icon:'info',
            title:'Deleting',
            html:'Please wait...'
        })
        Swal.showLoading()
        var t_data = {
            ids:multipleDeleteData
        }
        deleteMultipleRequestedDelWorkSched(t_data)
        .then(res=>{
            if(res.data.status === 200){
                props.setReqDelData(res.data.data)
                setSelectAll(false)
                setMultipleDeleteData([])
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1000,
                    showConfirmButton:false
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message,
                })
            }

        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <Grid container sx={{p:1}}>
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{maxHeight:'80vh'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>
                                        <Box sx={{display:'flex',flexDirection:'column',alignContent:'center',alignItems:'center'}}>
                                        
                                        {
                                            multipleDeleteData.length>0
                                            ?
                                            <Fade in>
                                            <Tooltip title='Delete selected'><IconButton color='error' onClick={handleMultipleDelete}><DeleteIcon/></IconButton></Tooltip>
                                            </Fade>
                                            :
                                            <Fade in>
                                            <IconButton color='error' disabled><DeleteIcon/></IconButton>
                                            </Fade>
                                        }
                                        <Checkbox checked={selectAll} onChange = {()=>setSelectAll(!selectAll)}/>
                                        </Box>

                                    </TableCell>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Office
                                    </TableCell>
                                    <TableCell>
                                        Year
                                    </TableCell>
                                    <TableCell>
                                        Reason
                                    </TableCell>
                                    <TableCell>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.data.map((row,key)=>
                                        <TableRow hover key={key}>
                                            <TableCell align='center'>
                                                <Checkbox checked = {multipleDeleteData.includes(row.work_sched_id)?true:false} onChange = {()=>handleSelectID(row.work_sched_id)}/>
                                            </TableCell><TableCell>
                                                {row.emp_lname}, {row.emp_fname} {row.emp_mname?row.emp_mname.charAt(0)+',':''}
                                            </TableCell>
                                            <TableCell>
                                                {row.dept_title}
                                            </TableCell>
                                            <TableCell>
                                                {row.year}
                                            </TableCell>
                                            <TableCell>
                                                {row.reason}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title='Delete'><IconButton className='custom-iconbutton' color='error' sx={{'&:hover':{color:'#fff',background:red[800]}}} onClick={()=>handleDelete(row)}><DeleteIcon/></IconButton></Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}