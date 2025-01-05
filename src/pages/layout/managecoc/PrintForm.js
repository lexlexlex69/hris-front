import { Grid, Typography,Box } from '@mui/material'
import moment from 'moment';
import React, { useEffect,useState } from 'react'
import './ManageCOC.css';
import { truncateToDecimals } from '../customstring/CustomString';
export const PrintForm = React.forwardRef((props,ref)=>{
    const [rows,setRows] = useState([])

    useEffect(()=>{
        var t_minus = props.employeeInfo.ledger.length;
        var len = 10-t_minus
        var temp = [...rows]
        for(let i=1;i<len;i++){
            temp.push(
                <tr style={{height:'40px'}}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>
            )
        }
        setRows(temp)
        console.log(props)
    },[])
    const formatPos = (val)=>{
        if(val){
            if(val.includes('(')){
                var t_arr = val.split('(');
                return <span>{t_arr[0]} <br/> ({t_arr[1]}</span>;
            }else{
                return val;
            }
        }else{
            return val;
        }
        
    }
    return(
        <div ref={ref}>
        <Box sx={{border:'solid 1px',p:2}} className='div-border'>
        <Grid container >
            <Grid item xs={12}>
                <Typography sx={{float:'right',fontSize:'14px'}}>Joint CSC-DBM No. 2, series of 2004</Typography>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                    <Typography sx={{border:'solid 3px',padding:'10px 30px',fontWeight:'bold',fontSize:'20px'}}>Certificate of COC Earned</Typography>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{padding:'50px 80px',lineHeight:3}}>This certificate entitles Mr./Ms.<span style={{marginLeft:'10px',marginRight:'10px',borderBottom:'solid 1px',padding:'0 20px',fontWeight:'bold'}}>{props.employeeInfo.data.fname} {props.employeeInfo.data.mname?props.employeeInfo.data.mname.charAt(0)+'. ':''} {props.employeeInfo.data.lname}</span> to
                <span>
                <span style={{borderBottom:'solid 1px',padding:'0 10px',fontWeight:'bold',marginLeft:'10px',marginRight:'10px'}}>{truncateToDecimals(props.hours)} hrs.</span> for the Month of <span style={{borderBottom:'solid 1px',fontWeight:'bold',padding:'0 10px'}}>{(moment(props.dateEarned).format('MMMM')).toUpperCase()}</span> Compensatory Overtime Credits.</span>
                </Typography>
            </Grid>
            {/* <Grid item xs={12}>
                <Typography sx={{padding:'0 50px'}}><span style={{marginLeft:'20px',borderBottom:'solid 1px',padding:'0 20px',fontWeight:'bold'}}>{props.hours} hrs.</span> for the month of <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{(moment(props.dateEarned).format('MMMM YYYY')).toUpperCase()}</span> Compensatory Overtime Credits</Typography>
            </Grid> */}
            <Grid item xs={12} sx={{marginTop:'100px'}}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                    <Box sx={{textAlign:'center',marginRight:'40px'}}>
                        <Typography sx={{fontWeight:'bold'}}>ENGR. RONNIE VICENTE C. LAGNADA</Typography>
                        <Typography>City Mayor/Authorized Representative</Typography>

                    </Box>

                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography>Date Issued: <span style ={{borderBottom:'solid 1px',fontWeight:'bold'}}> {(moment(new Date()).format('MMMM DD, YYYY')).toUpperCase()}</span></Typography>
                <Typography>Valid Until: <span style ={{marginLeft:'14px',borderBottom:'solid 1px',fontWeight:'bold'}}> {(moment(props.dateEarned).format('MMMM')).toUpperCase()} {parseInt(moment(props.dateEarned).format('YYYY'))+1}</span></Typography>
            </Grid>
        </Grid>
        </Box>
            <Typography sx={{textAlign:'center',fontSize:'14px'}}>Front</Typography>
        <Box id='pagebreak' className='div-border'>
            {/* <table className='table table-bordered' style={{textAlign:'center'}}>
                    <thead>
                        <tr sx={{verticalAlign:'middle'}}>
                            <th>No. of Hours of Earned <br/> COCs/Beginning Balance</th>
                            <th>Date of CTO</th>
                            <th>Use COCs</th>
                            <th>Remaining COCs</th>
                            <th>Remarks</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td> FEBRUARY 2022 <br/> 24 HOURS</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>MARCH 11,2022</td>
                            <td> 8.00</td>
                            <td> 16.00</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>MARCH 25,2022</td>
                            <td> 8.00</td>
                            <td> 8.00</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td> MARCH 2022 <br/> 16 HOURS</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={5}>
                                <Grid container>
                                    <Grid item xs={6} sx={{textAlign:'left'}}>
                                        <Typography>Approved by:</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign:'left'}}>
                                        Claimed by:
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign:'center',marginTop:'30px'}}>
                                        <span style={{borderBottom:'solid 1px'}}>OWEN M. DUCENA, MPA</span>
                                        <Typography>Department Head</Typography>
                                        <Typography>____________________</Typography>
                                        <Typography>Date</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign:'center',marginTop:'30px'}}>
                                        <span style={{borderBottom:'solid 1px'}}>RHEYCONN S. LUMAIN</span>
                                        <Typography>HRMA II</Typography>
                                        <Typography>____________________</Typography>
                                        <Typography>Date</Typography>
                                    </Grid>
                                </Grid>
                            </td>
                        </tr>
                    </tbody>
                    
            </table> */}

            <table className='table table-bordered' style={{textAlign:'center'}}>
                    <thead>
                        <tr sx={{verticalAlign:'middle'}}>
                            <th>No. of Hours of Earned <br/> COCs/Beginning Balance</th>
                            <th>Date of CTO</th>
                            <th>Use COCs</th>
                            <th>Remaining COCs</th>
                            <th>Remarks</th>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            props.employeeInfo.ledger.map((row,key)=>
                                <tr key ={key}>
                                    {
                                        row.month_name === null
                                        ?
                                        <td></td>
                                        :
                                        <td>
                                        <strong>{row.month_name} {row.year}
                                        <br/>{row.beginning_balance?row.beginning_balance+' HOURS':''}
                                        </strong>
                                        </td>
                                    }
                                        
                                    <td>
                                        {row.date_of_cto?moment(row.date_of_cto).format('MMMM DD,YYYY'):''}
                                    </td>
                                    <td>
                                        {row.used_coc}
                                    </td>
                                    <td>
                                        {row.remaining_coc.toFixed(3)} HRS
                                    </td>
                                    <td>
                                        {row.remarks}
                                    </td>

                                </tr>
                            )
                        }
                        {
                            <tr>
                                <td>
                                <strong>
                                {props.earnedInfo.month_name} {props.earnedInfo.year}
                                        <br/>{props.earnedInfo.beginning_balance?parseFloat(props.earnedInfo.beginning_balance).toFixed(3):null} HOURS
                                </strong>
                                </td>
                                <td></td>
                                <td></td>
                                <td>{props.earnedInfo.remaining_coc?parseFloat(props.earnedInfo.remaining_coc).toFixed(3):null} hrs
                                </td>
                                <td></td>

                            </tr>
                        }
                        {
                            rows
                        }
                        <tr>
                            <td colSpan={5}>
                                <Grid container>
                                    <Grid item xs={6} sx={{textAlign:'left'}}>
                                        <Typography>Approved by:</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign:'left'}}>
                                        Claimed by:
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign:'center',marginTop:'30px'}}>
                                        <span style={{borderBottom:'solid 1px'}}>OWEN M. DUCENA, MPA</span>
                                        <Typography>Department Head</Typography>
                                        <Typography>____________________</Typography>
                                        <Typography>Date</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign:'center',marginTop:'30px'}}>
                                        <span style={{borderBottom:'solid 1px'}}>{props.employeeInfo.data.fname} {props.employeeInfo.data.mname?props.employeeInfo.data.mname.charAt(0)+'.':' '} {props.employeeInfo.data.lname}</span>
                                        <Typography>{formatPos(props.employeeInfo.data.position_name)}</Typography>
                                        <Typography>____________________</Typography>
                                        <Typography>Date</Typography>
                                    </Grid>
                                </Grid>
                            </td>
                        </tr>
                    </tbody>
                    
            </table>
            <Typography sx={{textAlign:'center',fontSize:'14px'}}>Back</Typography>

        </Box>
        </div>
    )
})