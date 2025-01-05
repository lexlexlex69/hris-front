import React,{useEffect, useState,memo } from 'react';
import { Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green,orange} from '@mui/material/colors';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { hrdcUpdateSlot } from '../TraineeApprovalHRDCRequest';

function UpdateSlotModal(props){
// media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[900],
        color: theme.palette.common.white,
        fontSize: matches?12:15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?11:13,
        },
    }));
    const [deptInfo,setDeptInfo] = useState([])
    useEffect(()=>{
        // console.log(props.deptInfo)
        var temp = [];
        var new_arr = JSON.parse(props.deptInfo[0].shortlist_details).filter((el)=>{
            return el.slot !==0;
        })
        new_arr.forEach(el => {
            var count = 0;
            props.currUpdateTraineeData.forEach(el2=>{
                if(el.dept_name === el2.short_name && el2.selected){
                    count++;
                }
            })
            el.total_selected = count;
        });
        setDeptInfo(new_arr)
        console.log(props.currUpdateTraineeData)

    },[])
    const handleUpdateSlot = (value,index,total_selected)=>{
        var temp = [...deptInfo];
        temp[index].slot = value.target.value;
        setDeptInfo(temp)
    }
    const [remainingSlot,setRemainingSlot] = useState(0);
 
    const handleSave = (event)=>{
        event.preventDefault();
        var temp = 0;
        var t_arr = [...deptInfo];
        t_arr.forEach(el=>{
            var t_slot = document.getElementById(el.dept_name).value;
            el.slot = t_slot;
            temp+=parseInt(t_slot);
        })
        if(temp>props.selectedTraining.participants){
            Swal.fire({
                icon:'warning',
                title:'Oops... !',
                html:'Total slot must not exceed to the number of participants. Please review again the slot allocation.'
            })
        }else{
            var data2 = {
                data:t_arr,
                training_details_id:props.selectedTraining.training_details_id
            }
            console.log(data2)

            hrdcUpdateSlot(data2)
            .then(res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    props.setDeptInfo(res.data.dept_info)
                    props.close();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        }
        
    }
    return(
        <form onSubmit={handleSave}>
        <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12}>
            <TextField label = 'Participants' defaultValue = {props.selectedTraining.participants} fullWidth InputLabelProps={{shrink:true}} InputProps={{inputProps:{readOnly:true}}}/>
            </Grid>

            <Grid item xs={12}>
                <TableContainer sx={{maxHeight:'50vh'}}>
                <Table stickyHeader>
                    <TableHead>
                        <StyledTableCell>Department</StyledTableCell>
                        <StyledTableCell>Your total current selected</StyledTableCell>
                        <StyledTableCell>Slot</StyledTableCell>
                    </TableHead>
                    <TableBody>
                        {
                            deptInfo.map((row,key)=>
                                <TableRow key = {key} hover>
                                    <StyledTableCell>{row.dept_name}</StyledTableCell>
                                    <StyledTableCell>{row.total_selected}</StyledTableCell>
                                    <StyledTableCell>
                                    {/* <TextField label={row.dept_name+' Slot'} type='number' value = {row.slot} fullWidth onChange = {(value)=>handleUpdateSlot(value,key,row.total_selected)} InputProps={{inputProps:{min:row.total_selected}}} required/> */}
                                    <TextField label={row.dept_name+' Slot'} type='number' defaultValue = {row.slot} fullWidth id={row.dept_name} InputProps={{inputProps:{min:row.total_selected}}} required/>
                                    </StyledTableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button variant='contained' color='success' className='custom-roundbutton' type='submit'>Save</Button>
            </Grid>
        </Grid>
        </form>
    )
}
export default memo(UpdateSlotModal)