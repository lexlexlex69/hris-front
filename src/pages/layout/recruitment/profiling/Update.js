import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery, Typography } from '@mui/material';

import CommonBackdrop from '../../../../common/Backdrop';

import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit'
import { toast } from 'react-toastify';

const Update = ({ data, profiling, setProfiling, handleClose }) => {
    const [commmonBackDrop, setCommonBackDrop] = useState(false)
    const [inputData, setInputState] = useState({
        employee_id: '',
        applicant_id: '',
        review_notif: '',
        review_result: '',
        review_remarks: '',
        exam_notif: '',
        exam_date: '',
        exam_time: '',
        exam_venue: '',
        exam_score: '',
        exam_results: '',
        exam_remarks: '',
        interview_notif: '',
        interview_date: '',
        interview_time: '',
        interview_venue: '',
        interview_total: '',
        interview_average: '',
        interview_ranking: '',
        interview_result: '',
        is_appoint: '',
    })

    const handleChange = (e) => {
        setInputState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    useEffect(() => {
        setInputState({
            employee_id: data.employee_id,
            applicant_id: data.applicant_id,
            review_notif: data.review_notif,
            review_result: data.review_result,
            review_remarks: data.review_remarks,
            exam_notif: data.exam_notif,
            exam_date: data.exam_date,
            exam_time: data.exam_time,
            exam_venue: data.exam_venue,
            exam_score: data.exam_score,
            exam_results: data.exam_results,
            exam_remarks: data.exam_remarks,
            interview_notif: data.interview_notif,
            interview_date: data.interview_date,
            interview_time: data.interview_time,
            interview_venue: data.interview_venue,
            interview_total: data.interview_total,
            interview_average: data.interview_average,
            interview_ranking: data.interview_ranking,
            interview_results: data.interview_results,
            is_appoint: data.is_appoint,
        })
    }, [data])

    const handleUpdate = async () => {
        setCommonBackDrop(true)
        let res = await axios.post(`/api/recruitment/profiling/updateProfiling`, { data: inputData, id: data.id })
        if (res.data.status === 200) {
            let updatedProfiling = profiling.map((item) => item.id === data.id ? ({
                ...item,
                employee_id: inputData.employee_id,
                applicant_id: inputData.applicant_id,
                review_notif: inputData.review_notif,
                review_result: inputData.review_result,
                review_remarks: inputData.review_remarks,
                exam_notif: inputData.exam_notif,
                exam_date: inputData.exam_date,
                exam_time: inputData.exam_time,
                exam_venue: inputData.exam_venue,
                exam_score: inputData.exam_score,
                exam_results: inputData.exam_results,
                exam_remarks: inputData.exam_remarks,
                interview_notif: inputData.interview_notif,
                interview_date: inputData.interview_date,
                interview_time: inputData.interview_time,
                interview_venue: inputData.interview_venue,
                interview_total: inputData.interview_total,
                interview_average: inputData.interview_average,
                interview_ranking: inputData.interview_ranking,
                interview_results: inputData.interview_results,
                is_appoint: inputData.is_appoint,
            }) : item)

            setProfiling(updatedProfiling)
            handleClose()
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        setCommonBackDrop(false)
    }
    return (
        <Container sx={{ pt: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <CommonBackdrop open={commmonBackDrop} title='Processing, please wait . . .' />
            <TextField
                id=""
                label="Employee Id"
                value={inputData?.employee_id}
                disabled
            />
            <TextField
                id=""
                label="Applicant Id"
                value={inputData?.applicant_id}
                disabled
            />
            <Typography variant="body1" color="primary">REVIEW</Typography>
            <Box display="flex" sx={{ gap: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-review_notif-select-label">REVIEW NOTIF</InputLabel>
                    <Select
                        labelId="demo-review_notif-select-label"
                        id="demo-review_notif-select"
                        label="REVIEW NOTIF"
                        value={inputData?.review_notif}
                        fullWidth
                        name="review_notif"
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    id=""
                    label="Review result"
                    value={inputData?.review_result}
                    name="review_result"
                    fullWidth
                    onChange={handleChange}
                />
            </Box>
            <Typography variant="body1" color="primary">EXAMINATION</Typography>
            <Box display="flex" sx={{ gap: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-review_notif-select-label">EXAM NOTIF</InputLabel>
                    <Select
                        labelId="demo-review_notif-select-label"
                        id="demo-review_notif-select"
                        label="EXAM NOTIF"
                        name="exam_notif"
                        value={inputData?.exam_notif}
                        fullWidth
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    id=""
                    fullWidth
                    label="Exam date"
                    value={inputData?.exam_date}
                    name="exam_date"
                    focused
                    onChange={handleChange}
                    type='date'
                />
                <TextField
                    id=""
                    fullWidth
                    label="Exam time"
                    name="exam_time"
                    onChange={handleChange}
                    focused
                    type='time'
                    value={inputData?.exam_time}
                />
            </Box>
            <TextField
                id=""
                label="Exam venue"
                onChange={handleChange}
                fullWidth
                name="exam_venue"
                value={inputData?.exam_venue}
            />
            <Box display="flex" sx={{ gap: 1 }}>

                <TextField
                    id=""
                    onChange={handleChange}
                    fullWidth
                    label="Exam score"
                    name="exam_score"
                    value={inputData?.exam_score}
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-review_notif-select-label">EXAM RESULT</InputLabel>
                    <Select
                        labelId="demo-review_notif-select-label"
                        id="demo-review_notif-select"
                        label="EXAM RESULT"
                        name="exam_results"
                        value={inputData?.exam_results}
                        fullWidth
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>PASSED</MenuItem>
                        <MenuItem value={0}>FAILED</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Typography variant="body1" color="primary">INTERVIEW</Typography>
            <Box display="flex" sx={{ gap: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-review_notif-select-label">INTERVIEW NOTIF</InputLabel>
                    <Select
                        labelId="demo-review_notif-select-label"
                        id="demo-review_notif-select"
                        label="INTERVIEW NOTIF"
                        name="interview_notif"
                        value={inputData?.interview_notif}
                        fullWidth
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    id=""
                    name="interview_date"
                    type='date'
                    onChange={handleChange}
                    focused
                    label="Interview date"
                    value={inputData?.interview_date}
                    fullWidth
                />
                <TextField
                    id=""
                    name="interview_time"
                    type='time'
                    onChange={handleChange}
                    focused
                    label="Interview time"
                    value={inputData?.interview_time}
                    fullWidth
                />

            </Box>
            <TextField
                id=""
                name="interview_venue"
                label="Interview venue"
                onChange={handleChange}
                value={inputData?.interview_venue}
                fullWidth
            />
            <Box display="flex" sx={{ gap: 1 }}>
                <TextField
                    id=""
                    label="Interview total"
                    name="interview_total"
                    onChange={handleChange}
                    value={inputData?.interview_total}
                    fullWidth
                />
                <TextField
                    id=""
                    label="Interview average"
                    name="interview_average"
                    onChange={handleChange}
                    value={inputData?.interview_average}
                    fullWidth
                />
                <TextField
                    id=""
                    label="Interview ranking"
                    name="interview_ranking"
                    onChange={handleChange}
                    value={inputData?.interview_ranking}
                    fullWidth
                />
                <TextField
                    id=""
                    label="Interview results"
                    name="interview_results"
                    onChange={handleChange}
                    value={inputData?.interview_results}
                    fullWidth
                />
            </Box>
            <FormControl fullWidth>
                <InputLabel id="demo-is_appoint-select-label">APPOINTED</InputLabel>
                <Select
                    labelId="demo-is_appoint-select-label"
                    id="demo-is_appoint-select"
                    label="APPOINTED"
                    name="is_appoint"
                    value={inputData?.is_appoint}
                    fullWidth
                    onChange={handleChange}
                >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                </Select>
            </FormControl>
            {/* <Card raised sx={{ p: 1 }}>
                <Typography variant="body1" color="primary">Interview Panel</Typography>
                <CardContent>
                    {data?.interview_panels && JSON.parse(data?.interview_panels).map((item, index) => (
                        <Typography sx={{ bgcolor: 'primary.main', my: 1, p: 1, borderRadius: .5, color: '#fff' }} align="center">{item.fname} {item.mname} {item.lname}</Typography>
                    ))}
                </CardContent>
            </Card> */}
            <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 1 }}>
                <Button variant="contained" color="warning" startIcon={<EditIcon />} onClick={handleUpdate}>
                    Update
                </Button>
            </Box>
        </Container>
    );
};

export default Update;