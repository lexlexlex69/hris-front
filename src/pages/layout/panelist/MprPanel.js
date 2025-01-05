import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Skeleton, Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { blue, orange } from '@mui/material/colors';
import { Assessment, RateReview } from '@mui/icons-material';
import BlockIcon from '@mui/icons-material/Block';
import { Tooltip } from '@mui/material';
import CommonDialog from '../../../common/CommonDialog'
import InterviewAssessmentForm from './InterviewAssessmentForm';
import Warning from '../pds/customComponents/Warning';
import Warnings from '../recruitment/jobPostingManagement/componentsByStatus/receivingApplicants/Warnings';

const MprPanel = () => {
    const [assessment, setAssessment] = useState([])
    const [tableLoader, setTableLoader] = useState(true)

    const [interviewAssessmentDialog, setInterviewAssessmentDialog] = useState(false)
    const [interviewAssessmentData, setInterviewAssessmentData] = useState({})

    function handleOpenAssessment(item) {
        setInterviewAssessmentData(item)
        setInterviewAssessmentDialog(true)
        console.log(item)
    }

    async function fetchMprInterviewee() {
        let res = await axios.get(`/api/recruitment/mpr-panelist/mpr-interviewee`)
        console.log(res)
        setTableLoader(false)
        setAssessment(res.data?.emp)
    }

    useEffect(() => {
        fetchMprInterviewee()
    }, [])
    return (
        <Box>
            <CommonDialog open={interviewAssessmentDialog} handleClose={() => setInterviewAssessmentDialog(false)} title='INTERVIEW ASSESSMENT FORM' customWidth="80%">
                <InterviewAssessmentForm data={interviewAssessmentData} setAssessment={setAssessment} assessment={assessment} handleClose={() => setInterviewAssessmentDialog(false)} />
            </CommonDialog>
            <Warnings arr={[
                { text: 'Waiting for upper level to rate.', color: '#DDE6ED' },
                { text: 'Rated', color: orange[300], textDefault: true }
            ]} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="mpr interviewee table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" width='15%'>ASSESMENT TYPE</TableCell>
                            <TableCell align="left">POSITION NAME</TableCell>
                            <TableCell align="left">APPLICANT NAME</TableCell>
                            <TableCell align="right" width='5%'>ASSESSMENT FORM</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableLoader ? (
                            <>
                                {Array.from(Array(5)).map((x, i) => (
                                    <TableRow key={i}>
                                        {Array.from(Array(4)).map((y, i2) => (
                                            <TableCell key={i2}><Skeleton variant='text' ></Skeleton></TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                            </>
                        )}
                        {assessment && assessment.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item?.done_rate ? orange[200] : item?.can_rate ? '' : '#DDE6ED' }}
                            >
                                <TableCell width='15%' sx={{ color: item.can_rate ? '' : '#fff' }} align='left'>
                                    <Typography variant="body1" color="initial" align='center' sx={{ border: `3px solid ${item.can_rate ? blue[500] : '#526D82'}`, p: 1, borderRadius: 1, bgcolor: '#fff', color: item?.can_rate ? blue[500] : '#526D82' }}>
                                        {item.type === 'hr' ? 'Human resource' : item.type === 'im' ? 'Immediate head' : item.type === 'nlh' ? 'Next level head' : ''}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ color: item.can_rate ? '' : '#526D82' }} align="left">{item.position_name}</TableCell>
                                <TableCell sx={{ color: item.can_rate ? '' : '#526D82' }} align="left">{item.fname} {item.mname} {item.lname}</TableCell>
                                <TableCell sx={{ color: item.can_rate ? '' : '#526D82' }} align="right" width="20%">
                                    {item.can_rate ? (<>
                                        <Button variant='contained' startIcon={<Assessment />} onClick={() => handleOpenAssessment(item)}>assessment form</Button>
                                    </>
                                    ) : (
                                        <Tooltip title={`Rating will be availabe after ${item.type === 'im' ? 'Human resource rater is done rating.' : item.type === 'nlh' ? 'Immediate Head is done rating' : ''}`}>
                                            <BlockIcon sx={{ fontSize: 30 }} />
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MprPanel;