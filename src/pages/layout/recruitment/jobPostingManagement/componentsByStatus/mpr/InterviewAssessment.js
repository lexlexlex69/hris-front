import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography'
import { Skeleton, Box, Button, Card, Tooltip } from '@mui/material';

import axios from 'axios';
import { toast } from 'react-toastify';
import { Print } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import InterviewAssessmentFormPrint from './InterviewAssessmentFormPrint';
// context

const InterviewAssessment = ({ data }) => {
    const [interviewer, setInterviewer] = useState([])
    const [loader, setLoader] = useState(true)
    async function getInterviewMprData() {
        try {
            let res = await axios.get(`/api/recruitment/mpr/job-posting/receiving/cs/casual-applicants-individual-interview-result?applicant_id=${data?.applicant_id ? data?.applicant_id : data?.employee_id}&&vacancy_id=${data?.vacancy_id}`)
            if (res.data?.length) {
                setInterviewer(res.data.sort())
            }
            setLoader(false)
        }
        catch (Err) {
            toast.error(Err.message)
        }

    }
    useEffect(() => {
        getInterviewMprData()
    }, [])
    return (
        <div style={{ height: '80vh', overflowY: 'scroll' }}>
            <Typography variant="body2" color="primary">Fetching interviewer data for:</Typography>
            <Typography variant="body1" color="primary">{data?.info?.fname} {data?.info?.mname} {data?.info?.lname}</Typography>
            {loader ? (
                <Box display="flex" flexDirection='column' mt={1}>
                    <Box display='flex' justifyContent='flex-end'>
                        <Skeleton height={40} width='20%' />
                    </Box>
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                </Box>
            ) : (
                <Box mt={2}>
                    <Box display='flex' justifyContent='flex-end' mb={2}>
                        {interviewer.length === 0 ? '' : (
                            <Tooltip title="Print Assessment Form">
                                <Print sx={{ fontSize: 40, color: 'primary.main', border: `2px solid ${blue[500]}`, borderRadius: 1, p: .5, cursor: 'pointer' }} />
                            </Tooltip>
                        )}
                    </Box>
                    {interviewer.length > 0 && interviewer.map((item) => (
                        <Card sx={{ my: 1, p: 2, bgcolor: item?.done_rate ? 'primary.main' : 'error.light' }}>
                            <Box>
                                <Box display='flex' justifyContent='space-between' mb={1}>
                                    <Typography align='center' variant="body2" color='#fff'>{item?.type === 'hr' ? 'HUMAN RESOURCE' : item?.type === 'im' ? 'IMMEDIATE HEAD' : item?.type === 'nlh' ? 'NEXT LEVEL HEAD' : ''}</Typography>
                                    <Typography align='center' color='#fff' variant="body2"> RATED: {item?.done_rate ? 'YES' : 'NO'} </Typography>
                                </Box>
                                <Typography align='center' color='#fff' variant="body1"> {item?.fname} {item?.mname} {item?.lname} </Typography>
                            </Box>
                        </Card>
                    ))}
                    {interviewer.length === 0 ? (
                        <Box display="flex" flexDirection='column' mt={1}>
                            <Box display='flex' justifyContent='flex-end'>
                                <Skeleton height={40} sx={{ bgcolor: 'error.main' }} animation={false} width='20%' />
                            </Box>
                            <Skeleton height={40} sx={{ bgcolor: 'error.main' }} animation={false} />
                            <Skeleton height={40} sx={{ bgcolor: 'error.main' }} animation={false} />
                            <Skeleton height={40} sx={{ bgcolor: 'error.main' }} animation={false} />
                            <Typography variant="body1" color="error" align='center'>No result</Typography>
                        </Box>
                    ) : ''}
                </Box>
            )}
            <InterviewAssessmentFormPrint applicantData={data} interviewerData={interviewer} />
        </div>
    );
};

export default InterviewAssessment;