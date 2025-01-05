import React,{useEffect, useState,memo } from 'react';
import {Paper,TableContainer,Table,TableHead,TableRow,TableBody,TextField} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {blue,red,orange} from '@mui/material/colors'
import {toast} from 'react-toastify';
export function DeptSlot(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [deptInfo,setDeptInfo] = useState([])
    const [remainingSlot,setRemainingSlot] = useState(0);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?13:15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?12:14,
        },
    }));
    useEffect(()=>{
        setDeptInfo(props.deptInfo)
        console.log('render')
    },[props.deptInfo])
    const handleUpdateRemainingSlot = (value)=>{
        if(value.target.value !== ''){
            var remaining = parseInt(value.target.value)+parseInt(remainingSlot)
            setRemainingSlot(remaining)
        }
    }
    const handleRemainingSlot = () =>{
        var temp = 0;
        deptInfo.forEach(el=>{
            if(el.slot){
                temp+=parseInt(el.slot)
            }
        })
        var remaining = props.participants - temp
        setRemainingSlot(remaining)
    }
    const handleSetSlot = (value,index,total_selected)=>{
        /**
         * Check if selected from shortlist is greater than or equal to input
         */
        if(value.target.value > total_selected){
            if(total_selected === 0){
                toast.warning('No selected shortlist from this department')
            }else{
                toast.warning('Slot must be equal or less than to the selected shortlist')
            }
        }else{
            if(value.target.value === ''){
                var temp = [...deptInfo];
                temp[index].slot = value.target.value;
                setDeptInfo(temp)
    
                var remaining = 0+remainingSlot
                setRemainingSlot(remaining)
            }else{
                if(props.participants <= 0){
                    toast.warning('Please input first the number of props.participants')
                    document.getElementById('number-props.participants').focus();
                }else{
                    console.log(remainingSlot)

                    if(value.target.value > remainingSlot){
                        toast.warning('Remaining slot: ' +remainingSlot)
                        var temp = [...deptInfo];
                        temp[index].slot = remainingSlot;
                        setDeptInfo(temp)
                        
                    }else{
                        var temp = [...deptInfo];
                        temp[index].slot = value.target.value;
                        setDeptInfo(temp)
                    }
                    
                }
            }
        }
    }
    return(
    <Paper>
                <TableContainer sx={{ maxHeight: '60vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Department Name</StyledTableCell>
                            <StyledTableCell align="right">Match</StyledTableCell>
                            <StyledTableCell align="right">Selected From Shortlist</StyledTableCell>
                            <StyledTableCell align="right">Slot Allocation</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            deptInfo.map((row,key)=>
                                <TableRow key ={key}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.dept_name}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="right">
                                        {row.total_search}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="right">
                                        {row.total_selected}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="right">
                                        {/* <TextField label={row.dept_name+' Slot'} type='number' value ={row.slot} onChange = {(value)=>handleSetSlot(value,key,row.total_selected)} onBlur = {handleRemainingSlot} onFocus={(value)=>handleUpdateRemainingSlot(value)} InputProps={{inputProps: {inputMode: 'numeric', pattern: '[0-9]*',min:0}}} disabled = {row.total_selected === 0 ? true:false}/> */}
                                         <TextField label={row.dept_name+' Slot'} type='number' value ={row.slot} onChange = {(value)=>handleSetSlot(value,key,row.total_selected)} InputProps={{inputProps: {inputMode: 'numeric', pattern: '[0-9]*',min:0}}} disabled = {row.total_selected === 0 ? true:false}/>
                                    </StyledTableCell>
                                </TableRow>
                            )
                        }
                        <TableRow></TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
    )
    
}
export default memo(DeptSlot);