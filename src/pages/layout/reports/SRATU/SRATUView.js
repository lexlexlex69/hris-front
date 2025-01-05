import React,{useEffect, useState} from 'react';
import Logo from '../../../.././assets/img/bl.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography,Box, Tooltip, IconButton } from '@mui/material';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';

import moment from 'moment';
import './SRATU.css';
import { formatWithCommas } from '../../customstring/CustomString';
import Swal from 'sweetalert2';
export const SRATUView = React.forwardRef((props,ref)=>{
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [months,setMonths] = useState([]);
    const [year,setYear] = useState('');
    const [data,setData] = useState([]);
    useEffect(()=>{
        // console.log(props.data)
        var t_date = [];
        var year;
        if(props.date.length !==0){
            props.date.forEach(el=>{
            t_date.push(el.format('MMMM'));
            year = el.format('YYYY')
            })

            var t_new_arr = [... new Set(t_date)]
            // console.log(t_new_arr);
            setMonths(t_new_arr);
            setYear(year);
        }
        
    },[props.date])
    // useEffect(()=>{
    //     console.log(props.data)
    //     setData(props.data)
    // },[props.data])
    const handleChangeTotalAbsentDays = (val,key)=>{
        var temp = [...props.data];
        temp[key].total_absent = val.target.value
        // temp[key].total = parseFloat(val.target.value*1440) + parseFloat(temp[key].total_late_undertime_hours?temp[key].total_late_undertime_hours*60:0) + parseFloat(temp[key].total_late_undertime_minutes?temp[key].total_late_undertime_minutes:0)
        props.setData(temp)
    }
    const handleChangeTotalUndertimeHrs = (val,key)=>{
        var temp = [...props.data];
        temp[key].total_late_undertime_hours = val.target.value
        temp[key].total = parseFloat(val.target.value*60) + parseFloat(temp[key].total_late_undertime_minutes?temp[key].total_late_undertime_minutes:0)
        props.setData(temp)
    }
    const handleChangeTotalUndertimeMins = (val,key)=>{
        var temp = [...props.data];
        temp[key].total_late_undertime_minutes = val.target.value
        temp[key].total = parseFloat(val.target.value) + parseFloat(temp[key].total_late_undertime_hours?temp[key].total_late_undertime_hours*60:0)
        props.setData(temp)
    }
    const beforePrint = () => {
        if(props.letterHead){
            noticeBeforePrint()
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                text:'Please upload first a Letterhead ! Click settings Icon to Configure'
            })
        }
    }
    const noticeBeforePrint = () => {
        Swal.fire({
            icon:'info',
            title:'Notice',
            text:'Recommended paper (A4,Folio,Long). Please adjust margin if necessary.',
            confirmButtonText:"Proceed",
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                props.print();
            }
        })
    }
    return (
        <div id='sratu'>
            {/* <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:''}}>
                <div style={{paddingRight:'20px'}}>
                    <img src={Logo} alt="" width={70} height={70} />
                </div>
                <div>
                <p style={{textAlign:'center',lineHeight:'15px'}}>
                    <span style={{fontSize:'.9rem'}}>Republic of the Philippines</span> <br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>CITY HUMAN RESOURCE MANAGEMENT OFFICE</span><br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Butuan City</span> <br/><br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>SUMMARY REPORT ON ABSENCES, TARDINESS AND UNDERTIME (SRATU)</span><br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>PERIOD OF {months.map((row,key)=><span key={key}>{row}</span>)} <u>{year}</u>
                    </span>
                    <br/>
                    
                </p>
                </div>

            </div> */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'5px'}}>
                <Typography sx={{color:blue[600],fontSize:'1rem',textTransform:'uppercase',fontStyle:'italic',fontWeight:'bold'}}>{props.empStatus}</Typography>
                <Tooltip title={`Print ${props.empStatus} report`}><IconButton color='primary' onClick = {beforePrint} className='custom-iconbutton'><PrintIcon/></IconButton></Tooltip>
                </div>

                <table className='sratu-custom-table'>
                    <thead>
                        <tr className='sratu-custom-header'>
                            <th rowSpan={2}>
                                No.
                            </th>
                            <th rowSpan={2}>
                                NAME OF EMPLOYEE
                            </th>
                            <th rowSpan={2}>
                                Monthly Rate
                            </th>
                            <th rowSpan={2}>
                                Daily Rate
                            </th>
                            <th colSpan={4}>
                                ABSENCES, TARDINESS, UNDERTIME
                            </th>
                            <th rowSpan={2}>
                                REMARKS
                            </th>
                        </tr>
                        <tr style={{background:'#e3bfff',textAlign:'center'}}>
                            <th>
                                Days
                            </th>
                            <th>
                                Hrs.
                            </th>
                            <th>
                                Min.
                            </th>
                            <th>
                                TOTAL
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((row,key)=>
                                <tr key={key} style={{textAlign:'center'}}>
                                    <td>
                                        {key+1}
                                    </td>
                                    <td align='left'>
                                        {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                    </td>
                                    <td>
                                        {formatWithCommas((row.rate/12).toFixed(2))}
                                    </td>
                                    <td>
                                        {formatWithCommas(((row.rate/12)/22).toFixed(2))}
                                    </td>
                                    <td>
                                        {/* {row.total_absent>0?row.total_absent:null} */}
                                        {/* {row.total_absent} */}
                                        <input type = 'number' value={row.total_absent} style={{borderColor: '#fff',borderStyle: 'none',textAlign:'center'}} onChange = {(val)=>handleChangeTotalAbsentDays(val,key)}/>
                                    </td>
                                    <td>
                                        {/* {row.total_late_undertime_hours>0?row.total_late_undertime_hours:null} */}
                                        <input type = 'number' value={row.total_late_undertime_hours} style={{borderColor: '#fff',borderStyle: 'none',textAlign:'center'}} onChange = {(val)=>handleChangeTotalUndertimeHrs(val,key)}/>
                                    </td>
                                    <td>
                                        {/* {row.total_late_undertime_minutes>0?row.total_late_undertime_minutes:null} */}
                                        <input type = 'number' value={row.total_late_undertime_minutes} style={{borderColor: '#fff',borderStyle: 'none',textAlign:'center'}} onChange = {(val)=>handleChangeTotalUndertimeMins(val,key)}/>
                                    </td>
                                    <td>
                                        {row.total>0?row.total+' min/s':null}
                                        {/* <input type = 'number' value={row.total} style={{borderColor: '#fff',borderStyle: 'none',textAlign:'center'}} onChange = {(val)=>handleChangeTotal(val,key)}/> */}
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
        </div>
    )
})
export default SRATUView;