import React,{useEffect, useState} from 'react';
import {Grid,Typography,Skeleton,Box,Button,Tooltip, Table, TableHead, TableRow, TableCell, TableBody, TableFooter} from '@mui/material';
import { getRequestedEarnedLeaveInfo, submitRequestedEarnedLeave } from '../LeaveApplicationRequest';
import { toast } from 'react-toastify';
import moment from 'moment';
import SendIcon from '@mui/icons-material/Send';
import { getDTRAPIForDailyEarn, getEarnTable } from '../EarnLeave/EarnLeaveRequest';
import {blue} from '@mui/material/colors'
import Swal from 'sweetalert2';
import { api_url } from '../../../../../request/APIRequestURL';
import { auditLogs } from '../../../auditlogs/Request';
const RequestDailytEarnedLeave = (props)=>{
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    const [toEarned,setToEarned] = useState()
    const [toEarnedVL,setToEarnedVL] = useState()
    const [toEarnedSL,setToEarnedSL] = useState()
    const [pendingData,setPendingData] = useState([])
    const [currDate,setCurrDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [loadingText,setLoadingText] = useState('')
    const [dailyBasisVal,setDailyBasisVal] = useState('');
    const [totalLWOP,setTotalLWOP] = useState(0)
    useEffect(async()=>{
        var t_absent = 0;
        var t_lwopay = 0;
        setLoadingText('Loading info...')
        console.log(moment(currDate).endOf('month').format('DD'))
        /**
         * Check if end of the month
         */
        if(moment(currDate).startOf('month').format('DD') === moment(currDate).format('DD')){
            setIsLoading(0);
            setToEarned(0)
            Swal.fire({
                icon:'error',
                title:'Oops...',
                html:"Can't request earn leaves on the first day of the month"
            })
        }else{  
            if(moment(currDate).endOf('month').format('DD') === moment(currDate).format('DD')){
            console.log('equal')
            var t_t_data = {
                monthname:moment(currDate).format('MMMM'),
                year:moment(currDate).format('YYYY')
            }
            const t_data = await getRequestedEarnedLeaveInfo(t_t_data)
            .then(res=>{
                if(res.data.status === 200){
                    console.log(res.data)
                    setData(res.data)
                    if(res.data.date === currDate){
                        toast.warning('Already requested!')
                        setPendingData(res.data.pending_data)
                        setIsLoading(false)

                    }else{
                        // setLoadingText('Fetching Earned leave info...')
                        setLoadingText('Calculating daily earned leave. Please wait...')
            
                        return res.data
                    }
                }else{
                    toast.warning('You have pending request !')
                    setPendingData(res.data.pending_data)
                    setIsLoading(false)
                }
            })
            .catch(err=>{
                console.log(err)
                setIsLoading(false)
            })
            console.log(t_data)
            if(t_data){
                var from = t_data.date?moment(t_data.date).add('1','days').format('YYYY-MM-DD'):moment(currDate).startOf('month').format('YYYY-MM-DD');
                var t_data2 = {
                    emp_id:t_data.emp_no,
                    from:from,
                    to:moment(currDate).subtract('1','days').format('YYYY-MM-DD'),
                    api_url:api_url+'/getempDtr2'
                }
                console.log(t_data2)
                // setLoadingText('Fetching DTR info...')


                await getDTRAPIForDailyEarn(t_data2)
                .then(res=>{
                console.log(res.data.data.response)
                if(res.data.data.response.length>0){

                    res.data.data.response.forEach(el=>{
                        if(parseInt(el.absent_day)>0){
                            t_absent++;
                        }
                        if(el.sched_in.includes('W/O Pay') && el.sched_out.includes('W/O Pay')){
                            t_lwopay++;
                        }
                    })

                    return getEarnTable();
                }else{
                    
                    setToEarned(0);
                    setToEarnedVL(0);
                    setToEarnedSL(0);
                    return null;
                }
                }).then(res=>{

                    console.log(res.data.daily)
                    console.log(t_absent)
                    setTotalLWOP(t_lwopay)
                    if(res){
                        if(t_absent>0){
                            setToEarned(0);
                            setToEarnedVL(0);
                            setToEarnedSL(0);
                            setIsLoading(false)

                            Swal.fire({
                                icon:'info',
                                title:'Oops...',
                                html:'Please file late filing on '+t_absent+' absent day/s'
                            })
                        }else{      
                            var t_arr = res.data.daily.filter((el)=>{
                                return el.days === 30-t_lwopay
                            })
                            console.log(t_data)
                            setDailyBasisVal(t_arr[0].vl)
                            setToEarned((t_arr[0].vl-(t_data.pending_data.length>0?t_data.pending_data[0].daily_basis_value:0)).toFixed(3));
                            setIsLoading(false)
                        }
                        
                    }
                    
                })
            }
        }else{
            var t_t_data = {
                monthname:moment(currDate).format('MMMM'),
                year:moment(currDate).format('YYYY')
            }
            console.log(t_t_data)
            const t_data = await getRequestedEarnedLeaveInfo(t_t_data)
            
            .then(res=>{
                console.log(res.data)

                if(res.data.status === 200){
                    setData(res.data)
                    if(res.data.date === currDate && res.data.app_status !== 'DISAPPROVED'){
                        toast.warning('Already requested!')
                        setPendingData(res.data.pending_data)
                        setIsLoading(false)

                    }else{
                        // setLoadingText('Fetching Earned leave info...')
                        setLoadingText('Calculating daily earned leave. Please wait...')
                        setPendingData(res.data)

                        return res.data
                    }
                }else{
                    if(res.data.date === currDate){
                        toast.warning('You have pending request !')
                        setPendingData(res.data.pending_data)
                        setIsLoading(false)
                    }
                    
                }
            })
            .catch(err=>{
                console.log(err)
                setIsLoading(false)
            })
            console.log(t_data)
            if(t_data){
                /**
                 * 
                 Check if same month and year from previous earning
                 */
                if(moment(t_data.date).format('M') === moment(currDate).format('M') && moment(t_data.date).format('YYYY') === moment(currDate).format('YYYY') && t_data.app_status !== 'DISAPPROVED'){
                    var from = moment(t_data.date).add('1','days').format('YYYY-MM-DD');
                    var t_data2 = {
                        emp_id:t_data.emp_no,
                        from:from,
                        // to:currDate
                        to:moment(currDate).subtract('1','days').format('YYYY-MM-DD'),
                        api_url:api_url+'/getempDtr2'
                    }
                    console.log(t_data2)
                    // setLoadingText('Fetching DTR info...')


                    await getDTRAPIForDailyEarn(t_data2)
                    .then(res=>{
                    console.log(res.data)
                    if(res.data.code !== '301'){

                        res.data.data.response.forEach(el=>{
                            if(parseInt(el.absent_day)>0){
                                t_absent++;
                            }
                            if(el.sched_in.includes('W/O Pay') && el.sched_out.includes('W/O Pay')){
                                t_lwopay++;
                            }
                        })
                        console.log(t_absent)
                        return getEarnTable();
                    }else{
                        setToEarned(0);
                        return null;
                    }
                    }).then(res=>{
                        setTotalLWOP(t_lwopay)
                        console.log(res)
                        if(res){
                            if(t_absent>0){
                                setToEarned(0);
                                setIsLoading(false)

                                Swal.fire({
                                    icon:'info',
                                    title:'Oops...',
                                    html:'Please file late filing on '+t_absent+' absent day/s or Please contact HR to update your DTR'
                                })
                            }else{
                                var t_arr = res.data.daily.filter((el)=>{
                                return el.days === (parseInt(moment(currDate).subtract('1','days').format('DD'))-t_lwopay)
                                })
                                console.log(t_data)
                                setDailyBasisVal(t_arr[0].vl)
                                setToEarned((t_arr[0].vl-(t_data.pending_data.length>0?t_data.pending_data[0].daily_basis_value:0)).toFixed(3))
                                setIsLoading(false)
                            }
                            
                        }else{
                            setToEarned(0);
                            setIsLoading(false)
                        }
                        
                    })
                }else{
                     // var from = t_data.date?moment(t_data.date).add('1','days').format('YYYY-MM-DD'):currDate;
                    var from = moment(currDate).startOf('month').format('YYYY-MM-DD');
                    var t_data2 = {
                        emp_id:t_data.emp_no,
                        from:from,
                        // to:currDate
                        to:moment(currDate).subtract('1','days').format('YYYY-MM-DD'),
                        api_url:api_url+'/getempDtr2'
                    }
                    console.log(t_data2)
                    // setLoadingText('Fetching DTR info...')


                    await getDTRAPIForDailyEarn(t_data2)
                    .then(res=>{
                    console.log(res.data)
                    if(res.data.code === '301'){
                        Swal.fire({
                            icon:'error',
                            title:'Oops...',
                            html:'DTR not updated. Please contact HR'
                        })
                        setToEarned(0);
                        return null;
                    }else{
                        if(res.data.data.response.length>0){
                            res.data.data.response.forEach(el=>{
                                if(parseInt(el.absent_day)>0){
                                    t_absent++;
                                }
                                if(el.sched_in.includes('W/O Pay') && el.sched_out.includes('W/O Pay')){
                                    t_lwopay++;
                                }
                            })
                            console.log(t_absent)
                            return getEarnTable();
                        }else{
                            setToEarned(0);
                            return null;
                        }
                    }
                    }).then(res=>{
                        setTotalLWOP(t_lwopay)

                        if(res){
                            if(t_absent>0){
                                setToEarned(0);
                                setIsLoading(false)

                                Swal.fire({
                                    icon:'info',
                                    title:'Oops...',
                                    html:'Please file late filing on '+t_absent+' absent day/s'
                                })
                            }else{
                                var t_arr = res.data.daily.filter((el)=>{
                                    return el.days === (parseInt(moment(currDate).subtract('1','days').format('DD'))-t_lwopay)
                                })
                                var t_arr_sl = res.data.daily.filter((el)=>{
                                    return el.days === (parseInt(moment(currDate).subtract('1','days').format('DD')))
                                })
                                console.log(t_data)
                                setDailyBasisVal(t_arr[0].vl)
                                setToEarned((t_arr[0].vl).toFixed(3))
                                setToEarnedVL((t_arr[0].vl).toFixed(3))
                                setToEarnedSL((t_arr_sl[0].sl).toFixed(3))
                                setIsLoading(false)
                            }
                        }
                        
                    })
                }
            }
        }
        }
        
        
        
    },[])
    const handleSubmitRequest = ()=>{
        Swal.fire({
            icon:'info',
            title:'Submitting request',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();

        var t_data = {
            to_earned:toEarned,
            to_earned_vl:toEarnedVL,
            to_earned_sl:toEarnedSL,
            date_earned:currDate,
            daily_basis:dailyBasisVal
        }
        console.log(t_data)
        submitRequestedEarnedLeave(t_data)
        .then(res=>{
            if(res.data.status === 200){
                props.close()
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
            Swal.close();
        })
        
        // console.log(t_data)
    }
    return(
        <Grid container>
            
            {
                isLoading
                ?
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                    <Typography sx={{textAlign:'center'}}>{loadingText}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant='rounded' height={40} animation='wave'/>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant='rounded' height={40} animation='wave'/>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Skeleton sx={{borderRadius:'20px'}} variant='rounded' height={40} width={70} animation='wave'/>
                    </Grid>
                    
                </Grid>
                :
                pendingData.length>0
                ?
                <Grid container>
                    <Grid item xs={12} sx={{p:1}}>
                        <Typography sx={{fontSize:'1.2rem'}}>Date requested: <strong><em>{moment(pendingData[0].date_earned).format('MMMM DD, YYYY')} </em></strong></Typography>
                        <Typography>Status: <strong style={{color:pendingData[0].status?pendingData[0].status===
                    'APPROVED'?'green':'red':''}}><em>{pendingData[0].status} </em></strong></Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        
                                    </TableCell>
                                    <TableCell align='right'>
                                        To Earned
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        VL
                                    </TableCell>
                                    <TableCell align='right'>
                                        {pendingData[0].vl_earned}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        SL
                                    </TableCell>
                                    <TableCell align='right'>
                                        {pendingData[0].sl_earned}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Remarks
                                    </TableCell>
                                    <TableCell align='right'>
                                        {pendingData[0].remarks}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {/* <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                        <Typography><strong>VL:</strong> <em>{pendingData[0].vl_earned}</em></Typography>
                        <Typography><strong>SL:</strong> <em>{pendingData[0].sl_earned}</em></Typography>
                        </Box> */}
                    </Grid>
                </Grid>
                :
                <Grid container>
                {
                    data.sl_earned
                    ?
                    <Grid item xs={12} sx={{p:1}}>
                    <Typography sx={{textAlign:'right',background: blue[600],color: '#fff',padding:'5px',borderTopLeftRadius: '20px',borderBottomLeftRadius: '20px'}}>Last date requested: <strong><em>{data.date? moment(data.date).format('MMMM DD, YYYY'):'N/A'}</em></strong></Typography>
                    {/* <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',background:'#006d7e',padding:'5px',color:'#fff'}}>
                    <Typography><strong>VL earned:</strong> <em>{data.vl_earned? data.vl_earned:'N/A'}</em></Typography>
                    <Typography><strong>SL earned:</strong> <em>{data.sl_earned? data.sl_earned:'N/A'}</em></Typography>
                    </Box> */}
                    <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        
                                    </TableCell>
                                    <TableCell align='right'>
                                        Earned
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        VL
                                    </TableCell>
                                    <TableCell align='right'>
                                        {data.vl_earned}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        SL
                                    </TableCell>
                                    <TableCell align='right'>
                                        {data.sl_earned}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Remarks
                                    </TableCell>
                                    <TableCell align='right'>
                                        {data.remarks}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                </Grid>
                    :
                    null

                }
                
                <Grid item xs={12} sx={{p:1}}>
                    <Typography sx={{textAlign:'right',background: blue[900],color: '#fff',padding:'5px',borderTopLeftRadius: '20px',borderBottomLeftRadius: '20px'}}><strong><em>{moment(currDate).format('MMMM DD, YYYY')} </em></strong></Typography>
                    {/* <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',background:'#ededed',padding:'5px'}}>
                    <Typography><strong>VL:</strong> <em>{toEarned} <span style={{color:'green'}}>({(parseFloat(toEarned)+props.balance[0].vl_bal).toFixed(3)})</span></em></Typography>
                    <Typography><strong>SL:</strong> <em>{toEarned}<span style={{color:'green'}}> ({(parseFloat(toEarned)+props.balance[0].sl_bal).toFixed(3)})</span></em></Typography>
                    </Box> */}
                    <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        
                                    </TableCell>
                                    <TableCell align='right'>
                                        To Earned
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        VL
                                    </TableCell>
                                    <TableCell align='right'>
                                        {toEarnedVL}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        SL
                                    </TableCell>
                                    <TableCell align='right'>
                                        {toEarnedSL}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell style={{color:'red'}}>
                                        <em>Leave W/Out Pay</em>
                                    </TableCell>
                                    <TableCell align='right' style={{color:'red'}}>
                                        {totalLWOP}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                    <Tooltip  title='Submit request'><span><Button className='custom-roundbutton' onClick={handleSubmitRequest} disabled = {toEarned === 0?true:false}><SendIcon/></Button></span></Tooltip>
                </Grid>
                </Grid>
            }
            
        </Grid>
    )


}

export default RequestDailytEarnedLeave