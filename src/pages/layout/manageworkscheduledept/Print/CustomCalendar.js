import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
export const CustomCalendar = ({days,monthName,schedule}) => {
    useEffect(()=>{
        console.log(schedule)
    },[])
    const [header,setHeader] = useState(moment.weekdays())
    const checkTime = (date) => {
        let arr = schedule.filter(el=>moment(el.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'));
        if(arr.length>0){
            return (
                <>
                <br/>
                <small style={{color:red[800],textTransform:'uppercase'}}>{arr[0].time}</small>
                </>
            )
        }else{
            return null
        }
    }
    return(
        <Box>
        <Box sx={{display:'flex',justifyContent:'center',p:1}}>
            <Typography>{monthName}</Typography>
        </Box>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                        header.map((data,key)=>{
                            return(
                                <TableCell align='center' key={key} sx={{background:blue[800],color:'#fff'}}>{data}</TableCell>
                            )
                        })
                    }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        days.map((item,key)=>{
                            return(
                                <TableRow>
                                    <TableCell align='center'>
                                            {
                                            item.map((item2,key2)=>{
                                            return (
                                                item2.dayname === 'sun'
                                                ?
                                                <>
                                                {item2.day}
                                                {checkTime(item2.date)}
                                                </>
                                                :
                                                ''
                                                
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell align='center'>
                                            {
                                            item.map((item2,key2)=>{
                                            return (
                                                item2.dayname === 'mon'
                                                ?
                                                <>
                                                {item2.day}
                                                {checkTime(item2.date)}
                                                </>
                                                :
                                                ''
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell align='center'>
                                            {
                                            item.map((item2,key2)=>{
                                            return (
                                                item2.dayname === 'tue'
                                                ?
                                                <>
                                                {item2.day}
                                                {checkTime(item2.date)}
                                                </>
                                                :
                                                ''
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell align='center'>
                                            {
                                            item.map((item2,key2)=>{
                                            return (
                                                item2.dayname === 'wed'
                                                ?
                                                <>
                                                {item2.day}
                                                {checkTime(item2.date)}
                                                </>
                                                :
                                                ''
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell align='center'>
                                            {
                                            item.map((item2,key2)=>{
                                            return (
                                                item2.dayname === 'thu'
                                                ?
                                                <>
                                                {item2.day}
                                                {checkTime(item2.date)}
                                                </>
                                                :
                                                ''
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell align='center'>
                                            {
                                            item.map((item2,key2)=>{
                                            return (
                                                item2.dayname === 'fri'
                                                ?
                                                <>
                                                {item2.day}
                                                {checkTime(item2.date)}
                                                </>
                                                :
                                                ''
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell align='center'>
                                            {
                                            item.map((item2,key2)=>{
                                            return (
                                                item2.dayname === 'sat'
                                                ?
                                                <React.Fragment key={key}>
                                                {item2.day}
                                                {checkTime(item2.date)}
                                                </React.Fragment>
                                                :
                                                ''
                                            )
                                        })}
                                    </TableCell>
                                </TableRow>
                            )
                            
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
        </Box>
    ) 
} 