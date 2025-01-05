import React from 'react';
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const PrintIssuanceShortlist = ({ data }) => {
    return (
        <Box sx={{ mt: '50px' }}>
            <Typography variant="body1" color="initial" align="center">
                Short list of applicants for Issuance of appointment
            </Typography>
            <Box display="" sx={{ width: '90%', m: 'auto', mt: '20px' }}>
                <TableContainer>
                    <Table aria-label="simple table" size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>FIRST NAME</TableCell>
                                <TableCell>MIDDLE NAME</TableCell>
                                <TableCell>LAST NAME</TableCell>
                                <TableCell>APPLICANT STATUS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.map((item, index) => (
                                <TableRow>
                                    <TableCell component="th" scope="row">{index + 1}.</TableCell>
                                    <TableCell component="th" scope="row">{item.fname}</TableCell>
                                    <TableCell align="left">{item.mname}</TableCell>
                                    <TableCell align="left">{item.lname}</TableCell>
                                    <TableCell align="left">{item?.employee_id ? 'CGB EMPLOYEE' : 'OUTSIDER'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default PrintIssuanceShortlist;