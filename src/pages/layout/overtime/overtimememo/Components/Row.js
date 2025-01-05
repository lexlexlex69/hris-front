import React,{memo} from 'react';
import {TextField,TableRow,TableCell,Checkbox} from '@mui/material';
import { formatExtName } from '../../../customstring/CustomString';
const Row  = memo(({...props})=>{
    return(
        <TableRow key={props.row.emp_no} id={props.row.emp_no}>
            <TableCell>
                {props.row.emp_fname} {props.row.emp_mname? props.row.emp_mname.charAt(0)+'.':' '} {props.row.emp_lname} {formatExtName(props.row.emp_extname)}
            </TableCell>
            <TableCell align='center'>
                <TextField label='Hours' InputLabelProps={{shrink:true}} type='number' value = {props.weekdays} onChange = {(value)=>props.handleWeekdays(props.row.emp_no,value)}/>
            </TableCell>
            <TableCell align='center'>
                <TextField label='Hours' InputLabelProps={{shrink:true}} type='number' value = {props.weekends} onChange = {(value)=>props.handleWeekends(props.row.emp_no,value)}/>
            </TableCell>
            <TableCell align='center'>
                <Checkbox checked={props.row?.is_selected?true:false} onChange ={()=>props.handleSelected(props.row.emp_no)}/>
            </TableCell>
        </TableRow>
    )
})

export default Row