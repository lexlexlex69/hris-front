import { Grid, Typography,Box,InputLabel ,MenuItem ,FormControl, Button  } from '@mui/material';
import React,{useEffect, useState} from 'react';
import moment from 'moment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {getApplicLeaveRecords, getEmpApplicLeaveRecords, recomputeEmpApplicLeaveRecords } from '../LeaveApplicationRequest';
import Swal from 'sweetalert2';
import { auditLogs } from '../../../auditlogs/Request';
import { api_url } from '../../../../../request/APIRequestURL';
import { APILoading } from '../../../apiresponse/APIResponse';
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
        var data = {
            key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
            year:selectedYear,
            emp_no:props.info.id_no,
            api_url:api_url+'/getApplicLeaveRecords'
        }
        Swal.fire({
            icon:'info',
            title:'Retrieving records',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        getEmpApplicLeaveRecords(data)
        .then(res=>{
            console.log(res.data)
                // Swal.close();
            var status;
            if(res.data.response){
                setData(res.data.response)
                status = 'FOUND';
                Swal.close();

            }else{
                setData([])
                status = 'NOT FOUND';
                Swal.fire({
                    icon:'warning',
                    title:'Record not found !'
                })
            }
        }).catch(err=>{
            console.log(err)
            Swal.close();

        })
    },[])
    const handleYear = (event) => {
        setSelectedYear(event.target.value);
    };
    const submit = (event) =>{
        event.preventDefault();
        var data = {
            key:'b9e1f8a0553623f1:639a3e:17f68ea536b',
            year:selectedYear,
            emp_no:props.info.id_no,
            api_url:api_url+'/getApplicLeaveRecords'
        }
        Swal.fire({
            icon:'info',
            title:'Retrieving records',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        getEmpApplicLeaveRecords(data)
        .then(res=>{
            console.log(res.data)
                // Swal.close();
            var status;
            if(res.data.response){
                setData(res.data.response)
                status = 'FOUND';
                Swal.close();

            }else{
                setData([])
                status = 'NOT FOUND';
                Swal.fire({
                    icon:'warning',
                    title:'Record not found !'
                })
            }
            // var action_dtl = 'YEAR = '+selectedYear+' | STATUS = '+status;

            // var data2 = {
            //     action:'VIEW LEAVE LEDGER',
            //     action_dtl:action_dtl,
            //     module:'ONLINE LEAVE'
            // }
            // auditLogs(data2)
            // .then(res=>{
            //     // console.log(res.data)
            // }).catch(err=>{
            //     console.log(err)
            // })
        }).catch(err=>{
            console.log(err)
            Swal.close();

        })
    }
    const recomputeBal = async () =>{
        APILoading('info','Recomputing Balance','Please wait');
        var vlBeginBal = data[0].bal_vl;
        var slBeginBal = data[0].bal_sl;
        var newLedger = [data[0]];
        newLedger.push()
        var i=1;
        for(i;i<data.length;i++){
            switch(data[i].type){
                //Earned Leave, add 
                case 1:
                    vlBeginBal+=data[i].earned_vl;
                    slBeginBal+=data[i].earned_sl;
                    data[i].bal_vl = vlBeginBal.toFixed(3);
                    data[i].bal_sl = slBeginBal.toFixed(3);
                    newLedger.push(data[i]);
                break;
                //Approved leave, deduct
                case 2:
                    vlBeginBal-=data[i].absent_vl;
                    slBeginBal-=data[i].absent_sl;
                    data[i].bal_vl = vlBeginBal.toFixed(3);
                    data[i].bal_sl = slBeginBal.toFixed(3);
                    newLedger.push(data[i]);
                break;
                //Disapproved leave, no deduction
                case 3:
                    data[i].bal_vl = vlBeginBal.toFixed(3);
                    data[i].bal_sl = slBeginBal.toFixed(3);
                    newLedger.push(data[i]);
                break;
                //Tardiness / Undertime, deduct
                case 4:
                    vlBeginBal-=data[i].undertime;
                    data[i].bal_vl = vlBeginBal.toFixed(3);
                    data[i].bal_sl = slBeginBal.toFixed(3);
                    newLedger.push(data[i]);
                break;
                case 5:
                    vlBeginBal=data[i].bal_vl;
                    slBeginBal=data[i].bal_sl;
                    data[i].bal_vl = vlBeginBal.toFixed(3);
                    data[i].bal_sl = slBeginBal.toFixed(3);
                    newLedger.push(data[i]);
                break;
            }
        }
        try{
            var t_data = {
                data:newLedger,
                year:selectedYear
            }
            const res = await recomputeEmpApplicLeaveRecords(t_data);
            if(res.data.status === 200){
                setData(res.data.data)
                Swal.fire({
                    icon:'success',
                    message:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    message:res.data.message
                })
            }
        }catch(err){
            Swal.fire({
                icon:'error',
                title:err
            })
        }
    }
    return(
        <Grid container spacing={2}>
            {/* <Grid item xs={12}>
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
                
            </Grid> */}
            {/* <Grid item xs={12}>
                <Button variant='outlined' onClick={recomputeBal}>Recompute Balance</Button>
            </Grid> */}
            <Grid item xs={12}>
                <table className='table table-bordered' style={{fontSize:'.7rem',textAlign:'center',verticalAlign:'middle'}}>
                    <thead style={{position:'sticky',top:'65px',background:'#fff'}}>
                        <tr style={{verticalAlign:'middle'}}>
                            <th rowSpan={2}>
                                Period <br/>
                                (Inclusive Dates)
                            </th>
                            <th colSpan={4}>
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
                            <th>Type of Leave</th>
                            <th>Days</th>
                            <th>Hours</th>
                            <th>Minutes</th>
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
                                <tr key={key}>
                                    <td>
                                        {data.inclusive_dates} 
                                    </td>
                                    <td>
                                        {data.type_of_leave}
                                    </td>
                                    <td>
                                        {data.days>0?data.days:''}
                                    </td>
                                    <td>
                                        {data.hours>0?data.hours:''}
                                    </td>
                                    <td>
                                        {data.mins>0?data.mins:''}
                                    </td>
                                    <td>
                                        
                                    </td>
                                    <td>
                                        {data.earned_vl > 0 ? data.earned_vl :'-'}
                                    </td>
                                    <td>
                                        {/* {data.wpay_vl} */}
                                        {data.absent_vl>0?data.absent_vl:''}
                                    </td>
                                    <td>
                                        {/* {data.balance_vl} */}
                                        {data.bal_vl}
                                    </td>
                                    <td>
                                        {/* {data.vl_wopay > 0 ? data.vl_wopay :'-'} */}
                                        {data.absent_vl_wopay > 0 ? data.absent_vl_wopay :'-'}
                                    </td>
                                    <td>
                                        {data.earned_sl > 0 ? data.earned_sl :'-'}
                                    </td>
                                    <td>
                                        {/* {data.wpay_sl} */}
                                        {data.wpay_sl}
                                    </td>
                                    <td>
                                        {/* {data.balance_sl} */}
                                        {data.bal_sl}
                                    </td>
                                    <td>
                                        {/* {data.sl_wopay > 0 ? data.sl_wopay :'-'} */}
                                        {data.absent_sl_wopay > 0 ? data.absent_sl_wopay :'-'}
                                    </td>
                                    <td>
                                        {data.action}
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