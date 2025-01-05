import { React, useState, useRef, useContext } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import { handleChangeStatusMpr } from '../Controller'
import { RecruitmentContext } from '../../RecruitmentContext';
import CustomBackdrop from '../CustomBackdrop';
import Warnings from '../receivingApplicants/Warnings';

const sample = [{
    name: ' Sample 1 sample middlename sample lastname',
},
{
    name: ' Sample 2 sample middlename sample lastname',
},
{
    name: ' Sample 3 sample middlename sample lastname',
}
]

let controller = new AbortController()
const MprCasualPending = ({ data, closeDialog, vacancyStatus }) => {
    console.log(data)
    // context for handling changes to status when clicking proceed to next status
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)

    // backdrop
    const [statusBackdrop, setStatusBackdrop] = useState(false)

    return (
        <Box height='100%' width='100%'>
            <CustomBackdrop open={statusBackdrop} title='Processing request. . . ' /> 
            <Typography variant="body2" color="initial" gutterBottom sx={{ color: 'primary.main', textAlign: 'center', width: '100%' }}>CASUAL POOLING</Typography>
            <Typography variant="body2" gutterBottom color="initial" sx={{ color: 'primary.main', width: '100%' }}>INTERNAL EMPLOYEES</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }} className='cgb-color-table'>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sample && sample.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display='flex' justifyContent='space-between'>
                <Button variant='contained' color='warning' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem', mt: 2 }}>Send Notifications</Button>
                <Button variant='contained' color='primary' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem', mt: 2 }} onClick={() => handleChangeStatusMpr({}, 'RECEIVING','PENDING', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed next step / status</Button>
            </Box>
        </Box>
    );
};

export default MprCasualPending;