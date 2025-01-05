import React from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper, Typography } from '@mui/material';

const CscForm1 = () => {
    return (
        <Box sx={{ px: 2 }}>
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography variant="body1" color="initial">CS Form No. 1</Typography>
                    <Typography variant="body1" color="initial" sx={{ lineHeight: .5 }}>Revised 2018</Typography>
                </Box>
                <Box>
                    <Typography variant="body1" color="initial" sx={{ border: '1px solid black', p: '5px 0px 0px 20px' }}>For Use of Regulated Agencies Only</Typography>
                </Box>
            </Box>
            <Box>
                <Box>
                    <Typography variant="body1" color="initial" align="center">APPOINTMENT TRANSMITTAL AND ACTION FORM</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="initial">AGENCY: <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></Typography>
                    <Typography variant="body1" color="initial">CSC FO In-charge: <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography variant="body2" color="initial">(1) Fill-out the data needed in the form completely and accurately.</Typography>
                    <Typography variant="body2" color="initial">(2) Do not abbreviate entries in the form.</Typography>
                    <Typography variant="body2" color="initial">(3) Accomplished the Checklist of Common Requirements and sign the certification.</Typography>
                    <Typography variant="body2" sx={{ width: '800px' }} color="initial">(4) Submit the duly accomplished form in electronic and printed copy (2 copies) to the CSC Field Office-In-Charge Together with the original copies of appointments and supporting documents.</Typography>
                </Box>
                <Box>
                    <Box sx={{ border: '1px solid black' }}>
                        <Typography variant="body1" color="initial" sx={{ borderBottom: '1px solid black' }}>For CSC RO/FO's Use:</Typography>
                        <Typography variant="body1" color="initial" sx={{ height: '50px' }}>Date Received:</Typography>
                    </Box>
                </Box>
            </Box>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                      <TableRow className='recruitment-print-table-tr' >
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' rowSpan={2}>
                            No.
                        </TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' colSpan={4} align="center">NAME OF THE APPOINTEE/S</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' rowSpan={2} align="center">POSITION TITLE <br></br> <Typography className='recruitment-print-table-title' variant="body2" color="initial">(indicate parenthetical title, if applicable)</Typography></TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' rowSpan={2} align="center">SALARY/JOB/PAY GRADE</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' rowSpan={2} align="center">EMPLOYMENT STATUS</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' rowSpan={2} align="center">PERIOD OF EMPLOYMENT <br></br> <Typography className='recruitment-print-table-title' variant="body2" color="initial">(for Temporary,Casual/Contract Appointments) <br></br>(mm/dd/yyyy to mm/dd/yyyy)</Typography></TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' rowSpan={2} align="center">NATURE OF APPOINTMENT</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' rowSpan={2} align="center">DATE OF ISSUANCE <br></br> (mm/dd/yyyy)</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' align="center" colSpan={2}>PUBLICATION</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' align="center" colSpan={3}>CSC ACTION</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td' align="center" rowSpan={2}>Agency Receiving Officer</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>Last Name</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>First Name</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>Name Extension (Jr. / II)</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>Middle Name</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>DATE <Typography className='recruitment-print-table-title' variant="body2" color="initial">indicate period of publication <br></br> (mm/dd/yyyy) to (mm/dd/yyyy)</Typography></TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>MODE <Typography className='recruitment-print-table-title' variant="body2" color="initial">(CSC Bulletin of Vacant Positions, Agency Website, Newspaper, etc)</Typography></TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>A- Approved <br></br> or D - Disapproved or <br></br> N- Noted</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>Date of Action <br></br>(mm/dd/yyyy)</TableCell>
                        <TableCell className='recruitment-print-table-title recruitment-print-table-td'>Date of Release <br></br>(mm/dd/yyyy)</TableCell>
                      </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CscForm1;