import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import InfoIcon from '@mui/icons-material/Info';
import Av from '../../../../assets/img/avatar.png'
import { Skeleton } from '@mui/material';

const EmployeeCard = ({ data, onClick, link }) => {
    return (
        <Card sx={{ maxWidth: '80%', m: 'auto', my: 1, minHeight: '220px', display: 'flex', flexDirection: 'column' }} elevation={5}>
            <Box height="110px" width="100%" display='flex' justifyContent='center' aligndatas='center' sx={{ bgcolor: blue[300], position: 'relative', pt: .5 }}>
                <Tooltip arrow title={
                    (
                        <TableContainer component={Paper} sx={{ boxShadow: `2px 3px 3px ${blue[500]}` }}>
                            <Table size="small" aria-label="simple table">
                                <TableBody>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">Employee status</TableCell>
                                        <TableCell align="right">{data?.emp_type === 1 ? 'PERMANENT' : null}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">Office assigned</TableCell>
                                        <TableCell align="right">{data?.dept_title}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">Actl Salary</TableCell>
                                        <TableCell align="right">{data?.actl_salary}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">Auth Salary</TableCell>
                                        <TableCell align="right">{data?.auth_salary}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                } placement="top-end"
                    sx={{ position: 'absolute', bottom: 5, right: 5 }}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: 'transparent',
                                '& .MuiTooltip-arrow': {
                                    color: '#fff',
                                },
                            },
                        },
                    }}
                >
                    <Box><InfoIcon sx={{ color: '#fff', cursor: 'pointer' }} /></Box>
                </Tooltip>
                <Box sx={{ borderRadius: '100%', position: 'relative', height: '90px', width: '90px' }}>
                    <img src={Av} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
            </Box>
            <CardContent sx={{ padding: 0 }}>
                <Typography gutterBottom variant={(data?.fname + data?.mname + data?.lname).length > 10 ? "body2" : "body2"} align='center' component="div" fontWeight={500} color="primary" sx={{ px: { xs: 3, sm: 5, md: .5, lg: .5 } }}>
                    {!data?.fname && !data?.lname ? (<Skeleton variant='text' width='80%' sx={{ m: 'auto' }} />) : <>
                        {data?.fname + ' ' + data?.mname + ' ' + data?.lname}
                    </>}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center', flex: 1, aligndatas: 'flex-end', position: 'relative' }}>
                <Box sx={{ position: 'absolute', bottom: 0,width:'100%' }}>
                    {link}
                </Box>
                {/* <Button variant='contained' sx={{ borderRadius: '2rem', position: 'absolute', bottom: 10 }} size="small" onClick={() => onClick()}>view pds</Button> */}
            </CardActions>
        </Card>
    );
};

export default EmployeeCard;