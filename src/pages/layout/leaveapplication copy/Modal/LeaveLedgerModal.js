import { Grid, Typography,Box,InputLabel ,MenuItem ,FormControl, Button  } from '@mui/material';
import React,{useEffect, useState} from 'react';
import moment from 'moment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {getApplicLeaveRecords } from '../LeaveApplicationRequest';
import Swal from 'sweetalert2';
import { auditLogs } from '../../auditlogs/Request';
export default function LeaveLedgerModal(props){
    const [data,setData] = useState([]);
    const [year,setYear] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    useEffect(()=>{
        let year = parseInt(moment(new Date()).format('YYYY'))
        let start = 0;
        let temp_year = [];
        while(start < 3){
            temp_year.push(year-start);
            start++;
        }
        setYear(temp_year)
    },[])
    const handleYear = (event) => {
        setSelectedYear(event.target.value);
    };
    const submit = (event) =>{
        event.preventDefault();
        var data = {
            key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
            year:selectedYear,
            emp_no:props.info.id_no
        }
        Swal.fire({
            icon:'info',
            title:'Retrieving records',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        getApplicLeaveRecords(data)
        .then(res=>{
            console.log(res.data)
                // Swal.close();

            if(res.data.response.length !==0){
                setData(res.data.response)
                Swal.close();

            }else{
                Swal.fire({
                    icon:'warning',
                    title:'Record not found !'
                })
            }
            var action_dtl = 'YEAR = '+selectedYear;

            var data2 = {
                action:'VIEW LEAVE LEDGER',
                action_dtl:action_dtl,
                module:'ONLINE LEAVE'
            }
            auditLogs(data2)
            .then(res=>{
                // console.log(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            console.log(err)
            Swal.close();

        })
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
            <form onSubmit={submit}>

                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <FormControl sx={{width:'200px'}}>
                        <InputLabel id="demo-simple-select-label">Year</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedYear}
                        label="Year"
                        onChange={handleYear}
                        required
                        >
                        {
                            year.map((data,key)=>
                                <MenuItem key = {key} value={data}>{data}</MenuItem>
                            )
                        }
                        </Select>
                    </FormControl>
                    &nbsp;
                    <Button variant='outlined' type='submit'>
                        submit
                    </Button>
                </Box>
            </form>
                
            </Grid>
            
            <Grid item xs={12}>
                <table className='table table-bordered' style={{fontSize:'.7rem',textAlign:'center',verticalAlign:'middle'}}>
                    <thead style={{position:'sticky',top:'65px',background:'#fff'}}>
                        <tr style={{verticalAlign:'middle'}}>
                            <th rowSpan={2}>
                                Period <br/>
                                (Inclusive Dates)
                            </th>
                            <th rowSpan={2}>
                                PARTICULARS <br/>
                                (Type of Leave, No of days/hours/minutes)

                            </th>
                            <th rowSpan={2}>
                                CONTROL NO
                            </th>
                            <th colSpan={4}>
                                VACATION LEAVE
                            </th>
                            <th colSpan={4}>
                                SICK LEAVE
                            </th>
                            <th rowSpan={2}>
                            DATE & ACTION TAKEN ON APPLICATION FOR LEAVE

                            </th>
                        </tr>
                        <tr style={{verticalAlign:'middle'}}>
                            <th>EARNED</th>
                            <th>ABSENCE UT/T WITH PAY</th>
                            <th>BALANCE</th>
                            <th style={{color:'red'}}>ABSENCE UT/T W/O PAY</th>
                            <th>EARNED</th>
                            <th>ABSENCE UT/T WITH PAY</th>
                            <th>BALANCE</th>
                            <th style={{color:'red'}}>ABSENCE UT/T W/O PAY</th>
                        </tr>
                    </thead>
                    <tbody style={{verticalAlign:'middle'}}>
                        {data.length !==0
                            ?
                            data.map((data,key)=>
                                <tr key={key} style={{
                                    color:
                                    data.particular.search('TARDINESS')
                                    !== -1
                                    ||
                                    data.particular.search('Tardiness')
                                    !== -1
                                    ||
                                    data.particular.search('Lates')
                                    !== -1
                                    ||
                                    data.particular.length === 0
                                    ?
                                        'red'
                                    :
                                        data.rec_type === '2' || data.rec_type === '3'
                                        ? 'green'
                                            :
                                            data.rec_type === '5'
                                            ?
                                            'blue'
                                            :
                                            'auto'
                                    }}>
                                    <td>
                                        {data.rec_date} 
                                    </td>
                                    <td>
                                        {data.particular}
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        {data.earned_vl > 0 ? data.earned_vl :'-'}
                                    </td>
                                    <td>
                                        {data.absences_vl}
                                    </td>
                                    <td>
                                        {data.balance_vl}
                                    </td>
                                    <td>
                                        {data.vl_wopay > 0 ? data.vl_wopay :'-'}
                                    </td>
                                    <td>
                                        {data.earned_sl > 0 ? data.earned_sl :'-'}
                                    </td>
                                    <td>
                                        {data.absences_sl}
                                    </td>
                                    <td>
                                        {data.balance_sl}
                                    </td>
                                    <td>
                                        {data.sl_wopay > 0 ? data.sl_wopay :'-'}
                                    </td>
                                </tr>
                            )
                            :
                            <tr>
                                <td colSpan={12}>
                                    No Data Available ...
                                </td>
                            </tr>
                        }
                       
                    </tbody>
                </table>
            </Grid>
        </Grid>
    )
}