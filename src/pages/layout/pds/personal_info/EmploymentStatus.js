import React, { useEffect, useCallback, useState, useRef } from 'react'
import { useParams } from "react-router-dom";
import { blue, green, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';


import { toast } from 'react-toastify'

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import {continueUpdateToLyxs} from './Controller'

function EmploymentStatus({ data }) {
    return (
        <Box sx={{ mt: 1 }}>
            <TableContainer sx={{ bgcolor: 'background.paper' }}>
                <Table size="small" className="personal-information-employment-status-table">
                    <TableBody>
                        <TableRow size="small">
                            <TableCell className='cgb-color-table-lightblue' width="15%">First Name</TableCell>
                            <TableCell className='cgb-color-table-lightblue' width="15%">Middle Name</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Last Name</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Date Hired</TableCell>
                        </TableRow>
                        <TableRow size="small">
                            <TableCell>{data.fname}</TableCell>
                            <TableCell>{data.mname}</TableCell>
                            <TableCell>{data.lname}</TableCell>
                            <TableCell>{data.date_hired}</TableCell>
                        </TableRow>
                        <TableRow size="small">
                            <TableCell className='cgb-color-table-lightblue'>Birth Date</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Birth Place</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Sex</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Civil Status</TableCell>
                        </TableRow>
                        <TableRow size="small">
                            <TableCell>{data.dob}</TableCell>
                            <TableCell>{data.baddress}</TableCell>
                            <TableCell>{data.sex}</TableCell>
                            <TableCell>{data.civilstatus}</TableCell>
                        </TableRow>
                        <TableRow size="small">
                            <TableCell className='cgb-color-table-lightblue' width="15%">Residential Address</TableCell>
                            <TableCell className='cgb-color-table-lightblue' width="15%">Permanent Address</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Policy No</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>T.I.N.</TableCell>
                        </TableRow>
                        <TableRow size="small">
                            <TableCell>{data.radUnit},{data.radStreet},{data.radVillage},{data.radBrgy},{data.radCity},{data.radProvince}</TableCell>
                            <TableCell>{data.padUnit},{data.padStreet},{data.padVillage},{data.padBrgy},{data.padCity},{data.padProvince}</TableCell>
                            <TableCell>{data.gsis_no}</TableCell>
                            <TableCell>{data.tin}</TableCell>
                        </TableRow>
                        <TableRow size="small">
                            <TableCell className='cgb-color-table-lightblue'>Pagibig No</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Philhealth No</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>E-Mail Address</TableCell>
                            <TableCell className='cgb-color-table-lightblue'>Mobile No</TableCell>
                        </TableRow>
                        <TableRow size="small">
                            <TableCell>{data.pag_ibig}</TableCell>
                            <TableCell>{data.philhealth}</TableCell>
                            <TableCell>{data.emailadd}</TableCell>
                            <TableCell>{data.cpno}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" sx={{mt:2}} fullWidth onClick={() => continueUpdateToLyxs(data)}>Continue to update</Button>
        </Box>
    )
}

export default EmploymentStatus