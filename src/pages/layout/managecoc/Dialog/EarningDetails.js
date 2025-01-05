import React,{useEffect, useState} from 'react';
import {Box,Grid,Typography,Paper,TableContainer,TableHead,Table,TableRow,TableCell,TableBody,TableFooter} from '@mui/material';
import moment from 'moment';
import {green} from '@mui/material/colors';
import { formatTimeWithPeriod, truncateToDecimals } from '../../customstring/CustomString';

export default function EarningDetails(props){

    const [weekDaysEarnedWpayData,setWeekDaysEarnedWpayData] = useState([]);
    const [weekDaysEarnedCOCData,setWeekDaysEarnedCOCData] = useState([]);
    const [weekEndsEarnedWpayData,setWeekEndsEarnedWpayData] = useState([]);
    const [weekEndsEarnedCOCData,setWeekEndsEarnedCOCData] = useState([]);
    const [holidaysEarnedCOCData,setHolidaysEarnedCOCData] = useState([]);
    const [totalWeekDaysWpay,setTotalWeekDaysWpay] = useState(0);
    const [totalWeekDaysCOC,setTotalWeekDaysCOC] = useState(0);
    const [totalWeekEndsWpay,setTotalWeekEndsWpay] = useState(0);
    const [totalWeekEndsCOC,setTotalWeekEndsCOC] = useState(0);
    const [totalHolidaysCOC,setTotalHolidaysCOC] = useState(0);
    const [loadingData,setLoadingData] = useState(true)
    const [overAllCOC,setOverAllCOC] = useState(0)

    useEffect(()=>{
        
        var dtl = JSON.parse(props.data.earning_details)
        // var t_total = dtl.total_weekdays_coc+dtl.total_weekdays_wpay+dtl.total_weekends_coc+dtl.total_weekends_wpay;
        /**
        Total coc to earned
         */
        setOverAllCOC(props.data.earned)

        /**
        weekdays with pay
         */
        setWeekDaysEarnedWpayData(dtl.weekdays_wpay)
        setTotalWeekDaysWpay(dtl.total_weekdays_wpay)

         /**
        weekdays coc
         */
        setWeekDaysEarnedCOCData(dtl.weekdays_coc)
        setTotalWeekDaysCOC(dtl.total_weekdays_coc)

        /**
        weekends with pay
         */
        setWeekEndsEarnedWpayData(dtl.weekends_wpay)
        setTotalWeekEndsWpay(dtl.total_weekends_wpay)

        /**
        weekends coc
         */
        setWeekEndsEarnedCOCData(dtl.weekends_coc)
        setTotalWeekEndsCOC(dtl.total_weekends_coc)
        
        /**
        holidays coc
         */
        setHolidaysEarnedCOCData(dtl.holidays_coc)
        setTotalHolidaysCOC(dtl.total_holidays_coc)
        // console.log(dtl)
        // console.log(props.data)

    },[])
    const formatTime = (time)=>{
        return formatTimeWithPeriod(time)
        if(time){
            if(time.length !==0){
                var date = new Date();
                var t_time = time.split(':');
                
                date.setHours(t_time[0],t_time[1],t_time[2])
                return moment(date).format('h:mm a')
            }else{
                return null;
            }
        }else{
            return null;
        }
        
    }
    const formatDate = (date)=>{
        if(date.length !==0){
            return moment(date).format('MMMM DD,YYYY')
        }else{
            return null
        }
    }
    const totalEarn = (data,type)=>{
        var t_count=0;
        /**
        0 - weekdays coc , 1 - weekdays with pay, 2 - weekends coc, 3 - weekends with pay
         */
        data.forEach(el=>{
            t_count+=truncateToDecimals(el.earned/60)
        })
        if(type === 0){
            if(t_count>0){
                var total  = truncateToDecimals(t_count*1)
                return truncateToDecimals(t_count)+ ' x 1 = '+total;
            }else{
                return 0;
            }
        }
        if(type === 1){
            var weekdays_wpay_cfactor = props.data.weekdays_wpay_cfactor
           
            if(t_count>0){
                var total  = truncateToDecimals(t_count)*weekdays_wpay_cfactor
                return truncateToDecimals(t_count)+ ' x '+weekdays_wpay_cfactor+' = '+total;
            }else{
                return 0;
            }
            
        }
        
        if(type=== 2){
            var weekends_wpay_cfactor = props.data.weekends_wpay_cfactor
           
            if(t_count>0){
                var total  = truncateToDecimals(t_count)*weekends_wpay_cfactor
                return truncateToDecimals(t_count)+ ' x '+weekends_wpay_cfactor+' = '+total;
            }else{
                return 0;
            }
        }
        if(type=== 3){
            var weekends_coc_cfactor = props.data.weekends_coc_cfactor
           
            if(t_count>0){
                var total  = truncateToDecimals(t_count*weekends_coc_cfactor)
                return truncateToDecimals(t_count)+ ' x '+weekends_coc_cfactor+' = '+total;
            }else{
                return 0;
            }
        }
       
    }
    return (
        <Box id='earn-coc'>
            <Grid container sx={{p:2}}>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography className='header-text1'>Month : {props.data.period_date_text}</Typography>
                    <Typography sx={{background: green[800],color: '#fff',padding: '5px 10px',borderTopLeftRadius: '20px',borderBottomLeftRadius: '20px'}}>Total COC to be earned : {overAllCOC} HRS.</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>Weekdays Time Schedule</Typography>
                    <Grid item container row>  
                    <Typography>From :{props.data.weekdays_from?formatTime(props.data.weekdays_from):'N/A'}</Typography>
                    
                    <Typography sx={{ml:2}}>To :{props.data.weekdays_to?formatTime(props.data.weekdays_to):'N/A'}</Typography>

                    <Typography sx={{ml:2}}>Max OT W/Pay: {props.data.weekdays_max_ot?props.data.weekdays_max_ot+' hrs.':'N/A'}</Typography>
                    
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                <Typography className='header-text'>Weekdays</Typography>
                <Paper sx={{p:1}}>
                    <Grid item container sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={12}>
                        <Typography className='header-text2'>With Pay : {totalWeekDaysWpay>0?(totalWeekDaysWpay/60).toFixed(2)+' (*'+props.data.weekdays_wpay_cfactor+' = '+((totalWeekDaysWpay/60)*props.data.weekdays_wpay_cfactor).toFixed(2)+') hrs':'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                        <TableCell>
                                            Time In
                                        </TableCell>
                                        <TableCell>
                                            Break Out
                                        </TableCell>
                                        <TableCell>
                                            Break In
                                        </TableCell>
                                        <TableCell>
                                            Time Out
                                        </TableCell>
                                        <TableCell>
                                            Hour/s Earned
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        weekDaysEarnedWpayData.length === 0
                                        ?
                                        <TableRow>
                                            <TableCell colSpan={6} align='center'>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                        :
                                        weekDaysEarnedWpayData.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <TableCell>
                                                    {formatDate(row.date)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {(row.earned/60).toFixed(2)} */}
                                                    {truncateToDecimals(row.earned/60)}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                        Total Hour/s
                                        </TableCell>
                                        <TableCell>
                                            <strong>{totalEarn(weekDaysEarnedWpayData,1)}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        </Paper>
                        </Grid>
                        
                    </Grid>
                    <Grid item container sx={{display:'flex',flexDirection:'row',mt:1}}>
                        <Grid item xs={12}>
                        <Typography className='header-text2'>COC: {totalWeekDaysCOC>0?truncateToDecimals(totalWeekDaysCOC)+' hrs':'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                        <TableCell>
                                            Time In
                                        </TableCell>
                                        <TableCell>
                                            Break Out
                                        </TableCell>
                                        <TableCell>
                                            Break In
                                        </TableCell>
                                        <TableCell>
                                            Time Out
                                        </TableCell>
                                        <TableCell>
                                            Hour/s Earned
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        weekDaysEarnedCOCData.length === 0
                                        ?
                                        <TableRow>
                                            <TableCell colSpan={6} align='center'>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                        :
                                        weekDaysEarnedCOCData.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <TableCell>
                                                    {formatDate(row.date)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {(row.earned/60).toFixed(2)} */}
                                                    {truncateToDecimals(row.earned/60)}

                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                        Total Hour/s
                                        </TableCell>
                                        <TableCell>
                                            <strong>{totalEarn(weekDaysEarnedCOCData,0)}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        </Paper>
                        </Grid>
                        
                    </Grid>
                </Paper>
                </Grid>

                {/* Weekends */}
                <Grid item xs={12} sx={{mt:3}}>
                <hr/>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Weekends Time Schedule</Typography>
                    <Grid item container row> 
                    <Typography>From: {props.data.weekends_from?formatTime(props.data.weekends_from):'N/A'}</Typography>
                    
                    <Typography sx={{ml:2}}>To: {props.data.weekends_to?formatTime(props.data.weekends_to):'N/A'}</Typography>

                    <Typography sx={{ml:2}}>Max OT W/Pay: {props.data.weekends_max_ot?props.data.weekends_max_ot+' hrs.':'N/A'}</Typography>
                    
                    </Grid>
                </Grid>
                
                <Grid item xs={12}>
                <Typography className='header-text'>Weekends</Typography>
                <Paper sx={{p:1}}>
                    <Grid item container sx={{display:'flex',flexDirection:'row'}}>
                        <Grid item xs={12}>
                        <Typography className='header-text2'>With Pay : {totalWeekEndsWpay>0?(totalWeekEndsWpay/60).toFixed(2)+' (*1.5 = '+((totalWeekEndsWpay)*1.25).toFixed(2)+') hrs':'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                        <TableCell>
                                            Time In
                                        </TableCell>
                                        <TableCell>
                                            Break Out
                                        </TableCell>
                                        <TableCell>
                                            Break In
                                        </TableCell>
                                        <TableCell>
                                            Time Out
                                        </TableCell>
                                        <TableCell>
                                            Hour/s Earned
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        weekEndsEarnedWpayData.length === 0
                                        ?
                                        <TableRow>
                                            <TableCell colSpan={6} align='center'>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                        :
                                        weekEndsEarnedWpayData.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <TableCell>
                                                    {formatDate(row.date)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {(row.earned/60).toFixed(2)} */}
                                                    {truncateToDecimals(row.earned/60)}

                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                        Total Hour/s
                                        </TableCell>
                                        <TableCell>
                                            <strong>{totalEarn(weekEndsEarnedWpayData,2)}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        </Paper>
                        </Grid>
                        
                    </Grid>
                    <Grid item container sx={{display:'flex',flexDirection:'row',mt:1}}>
                        <Grid item xs={12}>
                        <Typography className='header-text2'>COC: {totalWeekEndsCOC>0?totalWeekEndsCOC.toFixed(2)+' hrs':'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                        <TableCell>
                                            Time In
                                        </TableCell>
                                        <TableCell>
                                            Break Out
                                        </TableCell>
                                        <TableCell>
                                            Break In
                                        </TableCell>
                                        <TableCell>
                                            Time Out
                                        </TableCell>
                                        <TableCell>
                                            Hour/s Earned
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        weekEndsEarnedCOCData.length === 0
                                        ?
                                        <TableRow>
                                            <TableCell colSpan={6} align='center'>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                        :
                                        weekEndsEarnedCOCData.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <TableCell>
                                                    {formatDate(row.date)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {(row.earned/60).toFixed(2)} */}
                                                    {truncateToDecimals(row.earned/60)}

                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                        Total Hour/s
                                        </TableCell>
                                        <TableCell>
                                            <strong>{totalEarn(weekEndsEarnedCOCData,3)}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        </Paper>
                        </Grid>

                        
                        
                    </Grid>
                </Paper>
                </Grid>
                    {/* End weekends */}
            
                    {/* Holidays */}
                <Grid item xs={12} sx={{mt:3}}>
                <hr/>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Holidays Time Schedule</Typography>
                    <Grid item container row> 
                    <Typography>From: {props.data.holidays_from?formatTime(props.data.holidays_from):'N/A'}</Typography>
                    
                    <Typography sx={{ml:2}}>To: {props.data.holidays_to?formatTime(props.data.holidays_to):'N/A'}</Typography>

                    </Grid>
                </Grid>
                <Grid item xs={12}>
                <Typography className='header-text'>Holidays</Typography>
                <Paper sx={{p:1}}>
                    <Grid item container sx={{display:'flex',flexDirection:'row',mt:1}}>
                        <Grid item xs={12}>
                        <Typography className='header-text2'>COC: {totalHolidaysCOC>0?totalHolidaysCOC.toFixed(2)+' hrs':'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                        <TableContainer sx={{maxHeight:'50vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                        <TableCell>
                                            Time In
                                        </TableCell>
                                        <TableCell>
                                            Break Out
                                        </TableCell>
                                        <TableCell>
                                            Break In
                                        </TableCell>
                                        <TableCell>
                                            Time Out
                                        </TableCell>
                                        <TableCell>
                                            Hour/s Earned
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        holidaysEarnedCOCData.length === 0
                                        ?
                                        <TableRow>
                                            <TableCell colSpan={6} align='center'>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                        :
                                        holidaysEarnedCOCData.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <TableCell>
                                                    {formatDate(row.date)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.break_in)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(row.time_out)}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {(row.earned/60).toFixed(2)} */}
                                                    {truncateToDecimals(row.earned/60)}

                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                                <TableFooter sx={{position:'sticky',bottom:0,background:'#fff'}}>
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                        Total Hour/s
                                        </TableCell>
                                        <TableCell>
                                            <strong>{totalEarn(holidaysEarnedCOCData,3)}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        </Paper>
                        </Grid>
                    </Grid>

                        
                </Paper>
                </Grid>
            {/* End Holidays */}
            </Grid>
        </Box>
    )
}