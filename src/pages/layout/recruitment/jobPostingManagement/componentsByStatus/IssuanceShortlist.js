import React, { useState, useContext, useEffect, useRef } from 'react';
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { blue, red } from '@mui/material/colors'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert';

import ArrowForward from '@mui/icons-material/ArrowForward';

import PrintIcon from '@mui/icons-material/Print';
import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';
import CustomBackdrop from './CustomBackdrop';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton'

import PrintIssuanceShortlist from './printables/PrintIssuanceShortlist';
import Typography from '@mui/material/Typography'


const IssuanceShortlist = ({ data, closeDialog }) => {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)
    const [shortList, setShortList] = useState([])
    const [loader, setLoader] = useState(true)


    let controller = new AbortController()

    const getIssuanceShortList = async () => {
        let res = await axios.get(`/api/recruitment/jobPosting/status/issuance-appointment/getIssuanceAppointment?vacancyId=${data}`, {}, { signal: controller.abort() })
        setShortList(res.data.data)
        setLoader(false)
    }

    useEffect(() => {
        getIssuanceShortList()
    }, [])

    return (
        <Container sx={{ py: 2, px: { xs: '', md: '' } }}>
            <div style={{ display: 'none' }}>
                <div ref={componentRef} >
                    <PrintIssuanceShortlist data={shortList} />
                </div>
            </div>
            <CustomBackdrop title='please wait . . . ' open={statusBackdrop} />
            <Box display="flex" sx={{ justifyContent: 'space-between', gap: 1 }}>
                <Box flex={2}>
                    <Typography variant="body1" color="primary" align='right'>Short list for issuance of appointment</Typography>
                </Box>
                <Box display="flex" sx={{ justifyContent: 'flex-end', alignItems: 'center', p: 1, flex: 1 }}>
                    <Tooltip title="Print shortlist">
                        <PrintIcon sx={{ cursor: 'pointer', color: blue[500], '&:hover': { color: blue[800] } }} onClick={handlePrint} />
                    </Tooltip>
                </Box>
            </Box>
            <TableContainer sx={{ maxHeight: '70vh' }}>
                <Table aria-label="issuance-short-list-table" size='small' stickyHeader>
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{bgcolor:'primary.main',color:'#fff'}} align="left">#</TableCell>
                            <TableCell sx={{bgcolor:'primary.main',color:'#fff'}} align="left">FIRST NAME</TableCell>
                            <TableCell sx={{bgcolor:'primary.main',color:'#fff'}} align="left">MIDDLE NAME</TableCell>
                            <TableCell sx={{bgcolor:'primary.main',color:'#fff'}} align="left">LAST NAME</TableCell>
                            <TableCell sx={{bgcolor:'primary.main',color:'#fff'}} align="left">APPLICANT STATUS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(10)).map((x, i) => (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {shortList && shortList.map((item, index) => (
                                    <Fade in key={index}>
                                        <TableRow >
                                            <TableCell component="th" scope="row">{index + 1}</TableCell>
                                            <TableCell align="left">{item?.fname}</TableCell>
                                            <TableCell align="left">{item?.mname}</TableCell>
                                            <TableCell align="left">{item?.lname}</TableCell>
                                            <TableCell align="left">{item?.employee_id ? 'CGB EMPLOYEE' : 'OUTSIDER'}</TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 2 }}>
                <Button variant='contained' color='info' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({},'ISSUANCE-APPOINTMENT', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed to next step/status</Button>
            </Box>
        </Container>
    );
};

export default IssuanceShortlist;