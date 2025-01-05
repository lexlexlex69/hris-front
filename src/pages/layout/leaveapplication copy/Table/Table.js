import { Box, Grid,Typography } from '@mui/material';
import React,{useEffect, useState} from 'react';
import moment from 'moment';
export default function Table(props){
    const [total,setTotal] = useState('')
    useEffect(()=>{
        var total_applied = 0;
        props.data.forEach(el =>{
            var days_applied = el.days_hours_applied-el.days_without_pay
            total_applied = total_applied + days_applied
        })
        setTotal(total_applied)
    },[])
    return(
        <Grid item xs={12} >
            <Typography sx={{textAlign:'center',background: '#d14300',color: '#fff',padding: '10px'}}>{props.name}</Typography>

            <Box sx={{maxHeight:'50vh',overflowY:'scroll'}}>
            <table className='table table-bordered table-striped'>
                    <thead style={{position:'sticky',top:'0',background:'white'}}>
                        <tr>
                            <th>Month</th>
                            <th>Type of Leave</th>
                            <th>No. of {props.applied_header} applied</th>
                            <th>Balance Before</th>
                            <th>Balance After</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.map((data,key)=>
                            <tr key={key}>
                                {
                                    key === 0
                                    ?
                                    <>
                                        <td>{data.month}</td>
                                        <td>{data.leave_type_name}</td>
                                        <td>{data.days_hours_applied-data.days_without_pay}</td>
                                        <td>{data.bal_before_process}</td>
                                        <td>{data.bal_after_process}</td>
                                    </>
                                    :
                                    props.data[key].month === props.data[key-1].month
                                        ?
                                        <>
                                        <td></td>
                                        <td>{data.leave_type_name}</td>
                                        <td>{data.days_hours_applied-data.days_without_pay}</td>
                                        <td>{data.bal_before_process}</td>
                                        <td>{data.bal_after_process}</td>
                                        </>
                                        :
                                        <>
                                        <td>{data.month}</td>
                                        <td>{data.leave_type_name}</td>
                                        <td>{data.days_hours_applied-data.days_without_pay}</td>
                                        <td>{data.bal_before_process}</td>
                                        <td>{data.bal_after_process}</td>
                                    </>


                                    
                                }
                                
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2} style={{textAlign:'right',fontWeight:'bold'}}>Total {props.applied_header} Applied</td>
                            <td style={{color:'green',fontWeight:'bold'}}>{total}</td>
                            <td style={{textAlign:'right',fontWeight:'bold'}}>Available Balance</td>
                            <td style={{color:'green',fontWeight:'bold'}}>{props.bal}</td>
                        </tr>
                    </tfoot>
                </table>
            </Box>
                
            </Grid>

    )
}