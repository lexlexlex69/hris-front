import React,{useEffect, useState} from 'react';
import Logo from '../../../.././assets/img/bl.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography,Box, TextField, IconButton, Tooltip, Paper, TableContainer, TableRow, Table, TableHead, TableBody } from '@mui/material';
import {blue,red,orange,green} from '@mui/material/colors';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

import './MRATU.css';
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
    // backgroundColor: blue[900],
    // color:theme.palette.common.white,
    fontSize: '.8rem',
    fontWeight:'bold',
    padding:6,
    },
    [`&.${tableCellClasses.body}`]: {
    // fontSize: matches?10:13,
    fontSize: '.7rem',
    // color: grey[800],
    textTransform:'uppercase',
    },
}));
export const MRATUView = React.forwardRef((props,ref)=>{
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const handleUpdateRow = (item,val)=>{
        let temp = [...props.data];
        let index = temp.findIndex(el=>el.emp_no === item.emp_no);
        temp[index].remarks_text = val.target.value
        props.updateData(temp)
    }
    const [editable,setEditable] = useState(false);
    const [tempData,setTempData] = useState([])
    useEffect(()=>{
        props.data.forEach(el => {
            let sl_text = '';
            let vl_text = '';
            let slp_text = '';
            let remarks_text = '';
            let wopay_text = '';
            el.sl_wpay_arr.forEach((el2,key)=>{
                if(key === 0){
                    sl_text+=moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }else{
                    sl_text+=','+moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }
            })
            el.vl_wpay_arr.forEach((el2,key)=>{
                if(key === 0){
                    vl_text+=moment(el2.date).format('D');
                }else{
                    vl_text+=','+moment(el2.date).format('D');
                }
            })
            el.slp_arr.forEach((el2,key)=>{
                if(key === 0){
                    slp_text+=moment(el2.date).format('D');
                }else{
                    slp_text+=','+moment(el2.date).format('D');
                }
            })
            el.cto_arr.forEach((el2,key)=>{
                if(key === 0){
                    remarks_text+='CTO - '+moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }else{
                    remarks_text+=','+moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }
            })
            el.sl_wopay_arr.forEach((el2,key)=>{
                if(key === 0){
                    wopay_text+='\nSL - '+moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }else{
                    wopay_text+=','+moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }
            })
            el.vl_wopay_arr.forEach((el2,key)=>{
                if(key === 0){
                    wopay_text+='\nVL - '+moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }else{
                    wopay_text+=','+moment(el2.date).format('D')+(el2.period !== 'NONE' ? '('+el2.period+')':'');
                }
            })
            el.sl = sl_text
            el.vl = vl_text
            el.slp = slp_text
            el.remarks_text = remarks_text + wopay_text
        });
        setTempData(props.data)
    },[])
    const handleEditRow = (row,key) => {
        let temp = [...tempData];
        temp[key].editable = true;
        props.updateData(temp);
    }
    const handleSaveRow = (row,key) =>{

    }
    const handleCancelRow = (row,key) => {
        let temp = [...props.data];
        temp[key].editable = false;
        props.updateData(temp); 
    }
    const handleEditData = (val,name,key) => {
        let temp = [...tempData];
        temp[key][name] = val.target.value;
        setTempData(temp);
        props.updateData(temp);
    }
    return (
        <div>
            <Grid container >
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer sx={{maxHeight:'60dvh'}}>
                            <Table>
                                <TableHead sx={{position:'sticky',background:'#fff',top:0,zIndex:1}}>
                                    <TableRow >
                                        <StyledTableCell rowSpan={2} sx={{fontWeight:'bold !important', fontSize:'.8rem'}}>
                                            No.
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan={2} align='center' sx={{fontWeight:'bold !important', fontSize:'.8rem'}}>
                                            Name of Employee
                                        </StyledTableCell>
                                        <StyledTableCell colSpan={5} align='center' sx={{fontWeight:'bold !important', fontSize:'.8rem'}}>
                                            Tardiness
                                        </StyledTableCell>
                                        <StyledTableCell colSpan={5} align='center' sx={{fontWeight:'bold !important', fontSize:'.8rem'}}>
                                            Undertime
                                        </StyledTableCell>
                                        <StyledTableCell colSpan={4} align='center' sx={{fontWeight:'bold !important', fontSize:'.8rem'}}>
                                            Leave of Absences
                                        </StyledTableCell>
                                        <StyledTableCell align='center' sx={{fontWeight:'bold !important', fontSize:'.8rem'}}>
                                            Remarks
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell>
                                            
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Days
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Hrs.
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Min.
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Freq.
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Total *(day)
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Days
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Hrs.
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Min.
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Freq.
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            Total *(day)
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            SL
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            VL/FL
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            SLP
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            No. of Days W/O Pay
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.data.map((row,key)=>
                                            <TableRow key={key} hover >
                                                <StyledTableCell align='center'>
                                                    {key+1}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                <span>
                                                {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}</span>
                                                </StyledTableCell>
                                                {
                                                tableData2(row,'late_days',key,handleEditData)
                                                }
                                                {
                                                tableData2(row,'late_hours',key,handleEditData)
                                                }
                                                {
                                                tableData2(row,'late_minutes',key,handleEditData)
                                                }
                                                <StyledTableCell align='center'>
                                                {
                                                    row.editable
                                                    ?
                                                    <input type='number' value = {row.late_freq} onChange={(val)=>handleEditData(val,'late_freq',key)} style={{width:40}}/>
                                                    :
                                                    row.late_freq>0
                                                    ?
                                                    <span style={{color:row.late_freq>=10?'red':'blue'}}>
                                                    {row.late_freq}x
                                                    </span>
                                                    :
                                                    null
                                                }
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                {
                                                    row.editable
                                                    ?
                                                    <input type='number' value = {row.total_late_deduct} onChange={(val)=>handleEditData(val,'total_late_deduct',key)} style={{width:60}}/>
                                                    :
                                                    parseFloat(row.total_late_deduct)>0
                                                    ?
                                                    row.total_late_deduct
                                                    :
                                                    '-'
                                                }
                                                </StyledTableCell>
                                                {
                                                tableData2(row,'undertime_days',key,handleEditData)
                                                }
                                                {
                                                tableData2(row,'undertime_hours',key,handleEditData)
                                                }
                                                {
                                                tableData2(row,'undertime_minutes',key,handleEditData)
                                                }
                                                <StyledTableCell align='center'>
                                                {
                                                    row.editable
                                                    ?
                                                    <input type='number' value = {row.undertime_freq} onChange={(val)=>handleEditData(val,'undertime_freq',key)} style={{width:40}}/>
                                                    :
                                                    row.undertime_freq>0
                                                    ?
                                                    <span style={{color:row.undertime_freq>=10?'red':'blue'}} >
                                                    {row.undertime_freq}x
                                                    </span>
                                                    :
                                                    null
                                                }
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                {
                                                    row.editable
                                                    ?
                                                    <input type='number' value = {row.total_undertime_deduct} onChange={(val)=>handleEditData(val,'total_undertime_deduct',key)} style={{width:60}}/>
                                                    :
                                                    parseFloat(row.total_undertime_deduct)>0
                                                    ?
                                                    row.total_undertime_deduct
                                                    
                                                    :'-'
                                                }
                                                </StyledTableCell>
                                                {/* Start SL*/}
                                                <StyledTableCell align='center'>
                                                {
                                                    row.editable
                                                    ?
                                                    <input type='text' value = {row.sl} onChange={(val)=>handleEditData(val,'sl',key)} style={{width:60}}/>
                                                    :
                                                    row.sl
                                                    ?
                                                    row.sl
                                                    :
                                                    null
                                                }
                                                </StyledTableCell>
                                                {/* End SL*/}

                                                {/* Start VL/FL */}
                                                <StyledTableCell align='center'>
                                                    {
                                                    row.editable
                                                    ?
                                                    <input type='text' value = {row.vl} onChange={(val)=>handleEditData(val,'vl',key)} style={{width:60}}/>
                                                    :
                                                    row.vl
                                                    ?
                                                    row.vl
                                                    :
                                                    null
                                                }
                                                    
                                                </StyledTableCell>
                                                {/* End VL/FL */}

                                                {/* Start SLP */}
                                                <StyledTableCell align='center'>
                                                    {
                                                        row.editable
                                                        ?
                                                        <input type='text' value = {row.slp} onChange={(val)=>handleEditData(val,'slp',key)} style={{width:60}}/>
                                                        :
                                                        row.slp
                                                        ?
                                                        row.slp
                                                        :
                                                        null
                                                    }
                                                    
                                                </StyledTableCell>
                                                {/* End SLP */}
                                                    {
                                                    tableData2(row,'days_with_out_pay',key,handleEditData)
                                                    }
                                                <StyledTableCell align='center'>
                                                    {
                                                        <Box>
                                                        {
                                                            row.editable
                                                            ?
                                                            <textarea  type = 'text' style={{width:'90%'}} value={row.remarks_text} onChange={(val)=>(handleEditData(val,'remarks_text',key))}/>
                                                            :
                                                            row.remarks_text
                                                        }
                                                        

                                                        </Box>
                                                    } 
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {
                                                        row.editable
                                                        ?
                                                        <Box>
                                                        {/* <Tooltip title='Save'>
                                                        <IconButton color='success' onClick={()=>handleSaveRow(row,key)}><SaveIcon/></IconButton>
                                                        </Tooltip> */}
                                                        <Tooltip title='Close'>
                                                        <IconButton color='error' onClick={()=>handleCancelRow(row,key)}><CloseIcon/></IconButton>
                                                        </Tooltip>
                                                        </Box>
                                                        :
                                                        <Tooltip title='Edit row'>
                                                        <IconButton color='info' onClick={()=>handleEditRow(row,key)}><EditIcon/></IconButton>
                                                        </Tooltip>

                                                    }
                                                    
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
            <div id='table' style={{maxHeight:'60dvh',overflow:'auto'}}>
                <table className='mratu-custom-table' >
                <thead style={{position:'sticky',top:0,zIndex:1}}>
                <tr className='mratu-custom-header'>
                    <td align='center'>
                        No.
                    </td>
                    <td align='center' style={{textTransform:'uppercase'}}>
                        Name of Employee
                    </td>
                    <td colSpan={5} align='center' style={{textTransform:'uppercase'}}>
                        Tardiness
                    </td>
                    <td colSpan={5} align='center' style={{textTransform:'uppercase'}}>
                        Undertime
                    </td>
                    <td colSpan={4} align='center' style={{textTransform:'uppercase'}}>
                        Leave of Absences
                    </td>
                    <td align='center' style={{textTransform:'uppercase'}}>
                        Remarks
                    </td>
                    <td>
                    </td>
                </tr>
                
                <tr className='mratu-custom-center-tr' style={{background:'#fff'}}>
                        <td/>
                        <td/>
                        <td style={{width:40}}>
                            Days
                        </td>
                        <td style={{width:40}}>
                            Hrs.
                        </td>
                        <td style={{width:40}}>
                            Min.
                        </td>
                        <td style={{width:40}}>
                            Freq.
                        </td>
                        <td style={{width:60}}>
                            Total *(day)
                        </td>
                        <td style={{width:40}}>
                            Days
                        </td>
                        <td style={{width:40}}>
                            Hrs.
                        </td>
                        <td style={{width:40}}>
                            Min.
                        </td>
                        <td style={{width:40}}>
                            Freq.
                        </td>
                        <td style={{width:60}}>
                            Total *(day)
                        </td>
                        <td style={{width:40}}>
                            SL
                        </td>
                        <td style={{width:40}}>
                            VL/FL
                        </td>
                        <td style={{width:40}}>
                            SLP
                        </td>
                        <td>
                            No. of Days W/O Pay
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                
            <tbody>
                {
                    props.data.map((row,key)=>
                        <tr key={key} hover >
                            <td align='center'>
                                {key+1}
                            </td>
                            <td>
                            <span>
                            {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}</span>
                            </td>
                            {
                            tableData(row,'late_days',key,handleEditData)
                            }
                            {
                            tableData(row,'late_hours',key,handleEditData)
                            }
                            {
                            tableData(row,'late_minutes',key,handleEditData)
                            }
                            <td align='center'>
                            {
                                row.editable
                                ?
                                <input type='number' value = {row.late_freq} onChange={(val)=>handleEditData(val,'late_freq',key)} style={{width:40}}/>
                                :
                                row.late_freq>0
                                ?
                                <span style={{color:row.late_freq>=10?'red':'blue'}}>
                                {row.late_freq}x
                                </span>
                                :
                                null
                            }
                            </td>
                            <td align='center'>
                            {
                                row.editable
                                ?
                                <input type='number' value = {row.total_late_deduct} onChange={(val)=>handleEditData(val,'total_late_deduct',key)} style={{width:60}}/>
                                :
                                parseFloat(row.total_late_deduct)>0
                                ?
                                row.total_late_deduct
                                :
                                '-'
                            }
                            </td>
                            {
                            tableData(row,'undertime_days',key,handleEditData)
                            }
                            {
                            tableData(row,'undertime_hours',key,handleEditData)
                            }
                            {
                            tableData(row,'undertime_minutes',key,handleEditData)
                            }
                            <td align='center'>
                            {
                                row.editable
                                ?
                                <input type='number' value = {row.undertime_freq} onChange={(val)=>handleEditData(val,'undertime_freq',key)} style={{width:40}}/>
                                :
                                row.undertime_freq>0
                                ?
                                <span style={{color:row.undertime_freq>=10?'red':'blue'}} >
                                {row.undertime_freq}x
                                </span>
                                :
                                null
                            }
                            </td>
                            <td align='center'>
                            {
                                row.editable
                                ?
                                <input type='number' value = {row.total_undertime_deduct} onChange={(val)=>handleEditData(val,'total_undertime_deduct',key)} style={{width:60}}/>
                                :
                                parseFloat(row.total_undertime_deduct)>0
                                ?
                                row.total_undertime_deduct
                                
                                :'-'
                            }
                            </td>
                            {/* Start SL*/}
                            <td align='center'>
                            {
                                row.editable
                                ?
                                <input type='text' value = {row.sl} onChange={(val)=>handleEditData(val,'sl',key)} style={{width:60}}/>
                                :
                                row.sl
                                ?
                                row.sl
                                :
                                null
                            }
                                {/* {
                                    row.sl
                                } */}
                                {/* {
                                    row.sl_wpay_arr.length !==0 || row.sl_wopay_arr.length !==0
                                    ?
                                    <span>
                                        {
                                            row.sl_wpay_arr.map((row2,key2)=>
                                                key2===row.sl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        {
                                            row.sl_wopay_arr.length !==0
                                            ?
                                                row.sl_wpay_arr.length !==0
                                                ?
                                                ','
                                                :null
                                            :null
                                        }
                                        {
                                            row.sl_wopay_arr.map((row2,key2)=>
                                                key2===row.sl_wopay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        </span>

                                    :
                                    null
                                } */}
                            </td>
                            {/* End SL*/}

                            {/* Start VL/FL */}
                            <td align='center'>
                                {
                                row.editable
                                ?
                                <input type='text' value = {row.vl} onChange={(val)=>handleEditData(val,'vl',key)} style={{width:60}}/>
                                :
                                row.vl
                                ?
                                row.vl
                                :
                                null
                            }
                                {/* {
                                    row.vl_wpay_arr.length !==0
                                    ?
                                        <span>
                                        {
                                            row.vl_wpay_arr.map((row2,key2)=>
                                                key2===row.vl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        {row.fl_wpay_arr.length !==0 ? ',':null}
                                        </span>

                                    :
                                    null
                                }
                                {
                                    row.fl_wpay_arr.length !==0
                                    ?
                                        <span>

                                        {
                                            row.fl_wpay_arr.map((row2,key2)=>
                                                key2===row.fl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        </span>

                                    :
                                    null
                                } */}
                                
                            </td>
                            {/* End VL/FL */}

                            {/* Start SLP */}
                            <td align='center'>
                                 {
                                    row.editable
                                    ?
                                    <input type='text' value = {row.slp} onChange={(val)=>handleEditData(val,'slp',key)} style={{width:60}}/>
                                    :
                                    row.slp
                                    ?
                                    row.slp
                                    :
                                    null
                                }
                                {/* {
                                    row.slp_arr.length !==0
                                    ?
                                        <span>
                                        {
                                            row.slp_arr.map((row2,key2)=>
                                                key2===row.slp_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        </span>

                                    :
                                    null
                                } */}
                            </td>
                            {/* End SLP */}

                            {/* <td align='center'>
                                {
                                    row.sl_wpay_arr.length !==0 || row.sl_wopay_arr.length !==0
                                    ?
                                        <span>
                                        SL -&nbsp;
                                        {
                                            row.sl_wpay_arr.map((row2,key2)=>
                                                key2===row.sl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        {
                                            row.sl_wopay_arr.length !==0
                                            ?
                                                row.sl_wpay_arr.length !==0
                                                ?
                                                ','
                                                :null
                                            :null
                                        }
                                        {
                                            row.sl_wopay_arr.map((row2,key2)=>
                                                key2===row.sl_wopay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                                
                                {
                                    row.vl_wpay_arr.length !==0
                                    ?
                                        <span>
                                        VL -&nbsp;
                                        {
                                            row.vl_wpay_arr.map((row2,key2)=>
                                                key2===row.vl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                                {
                                    row.fl_wpay_arr.length !==0
                                    ?
                                        <span>
                                        FL -&nbsp;
                                        {
                                            row.fl_wpay_arr.map((row2,key2)=>
                                                key2===row.fl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                                {
                                    row.slp_arr.length !==0
                                    ?
                                        <span>
                                        SLP -&nbsp;
                                        {
                                            row.slp_arr.map((row2,key2)=>
                                                key2===row.slp_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                                
                                {
                                    row.cto_arr.length !==0
                                    ?
                                        <span>
                                        CTO -&nbsp;
                                        {
                                            row.cto_arr.map((row2,key2)=>
                                                key2===row.cto_arr.length-1
                                                ?
                                                <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                            </td> */}
                            {/* <td align='center'> */}
                                {
                                tableData(row,'days_with_out_pay',key,handleEditData)
                                }
                                {/* {row.days_with_pay>0?row.days_with_pay:''} */}
                                {/* {
                                    row.days_with_out_pay>0
                                    ?
                                    <span>{row.days_with_out_pay}</span>
                                    :
                                    null
                                } */}
                            {/* </td> */}
                            <td align='center'>
                                {
                                    <Box>
                                    {/* {
                                        row.days_with_out_pay>0
                                        ?
                                            <Box>
                                            <span>{row.days_with_out_pay} day/s w/out pay - </span>

                                            {
                                                row.sl_wopay_arr.length>0
                                                ?
                                                <span>SL(
                                                {
                                                    row.sl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                )
                                                </span>
                                                :
                                                null
                                            }
                                            
                                            {
                                                row.vl_wopay_arr.length>0
                                                ?
                                                <span>VL(
                                                {
                                                    row.vl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                )
                                                </span>
                                                :
                                                null
                                            }
                                            

                                            </Box>
                                        :
                                        null
                                    } */}
                                    {/* {
                                    row.cto_arr.length !==0
                                    ?
                                        <span>
                                        CTO -&nbsp;
                                        {
                                            row.cto_arr.map((row2,key2)=>
                                                key2===row.cto_arr.length-1
                                                ?
                                                <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        </span>

                                    :
                                    null
                                } */}
                                {/* {
                                        row.days_with_out_pay>0
                                        ?
                                            <Box>
                                            <span>{row.days_with_out_pay} {row.days_with_out_pay>1?'days':'day'} w/out pay </span><br/>

                                            {
                                                row.sl_wopay_arr.length>0
                                                ?
                                                <span>SL - &nbsp;
                                                {
                                                    row.sl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                
                                                </span>
                                                :
                                                null
                                            }
                                            
                                            {
                                                row.vl_wopay_arr.length>0
                                                ?
                                                <span><br/>VL (
                                                {
                                                    row.vl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                )
                                                </span>
                                                :
                                                null
                                            }
                                            

                                            </Box>
                                        :
                                        null
                                    } */}
                                {/* <br/> */}
                                    {/* <TextField type='text' multiline fullWidth value = {row.remarks_text} onChange={(val)=>(handleUpdateRow(row,val))}/> */}
                                    {
                                        row.editable
                                        ?
                                        <textarea  type = 'text' style={{width:'90%'}} value={row.remarks_text} onChange={(val)=>(handleEditData(val,'remarks_text',key))}/>
                                        :
                                        row.remarks_text
                                    }
                                    

                                    </Box>
                                } 
                            </td>
                            <td align='center'>
                                {
                                    row.editable
                                    ?
                                    <Box>
                                    {/* <Tooltip title='Save'>
                                    <IconButton color='success' onClick={()=>handleSaveRow(row,key)}><SaveIcon/></IconButton>
                                    </Tooltip> */}
                                    <Tooltip title='Close'>
                                    <IconButton color='error' onClick={()=>handleCancelRow(row,key)}><CloseIcon/></IconButton>
                                    </Tooltip>
                                    </Box>
                                    :
                                    <Tooltip title='Edit row'>
                                    <IconButton color='info' onClick={()=>handleEditRow(row,key)}><EditIcon/></IconButton>
                                    </Tooltip>

                                }
                                
                            </td>
                        </tr>
                    )
                }
            </tbody>
            </table>

            </div>
        </div>
    )
})
export default MRATUView
const tableData = (row,name,key,handleEditData)=>{
    return (
        <td align='center'>
        {
            row.editable
            ?
            <input type='number' value = {row[name]} onChange={(val)=>handleEditData(val,name,key)} style={{width:40}}/>
            :
            row[name]>0
            ?
            row[name]
            :
            null
        }
        </td>
    )
}
const tableData2 = (row,name,key,handleEditData)=>{
    return (
        <StyledTableCell align='center'>
        {
            row.editable
            ?
            <input type='number' value = {row[name]} onChange={(val)=>handleEditData(val,name,key)} style={{width:40}}/>
            :
            row[name]>0
            ?
            row[name]
            :
            null
        }
        </StyledTableCell>
    )
} 
