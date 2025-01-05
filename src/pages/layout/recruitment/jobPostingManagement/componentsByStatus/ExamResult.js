import React, { useState, useContext, useEffect } from 'react';
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { orange, blue, green, red } from '@mui/material/colors'
import Box from '@mui/material/Box'

import TextField from '@mui/material/TextField'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Skeleton from '@mui/material/Skeleton'
import Pagination from '@mui/material/Pagination'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';

import ArrowForward from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';
import CustomBackdrop from './CustomBackdrop';

import axios from 'axios';
import { Fade } from '@mui/material';


const ExamResult = ({ data, closeDialog }) => {

    const [loader, setLoader] = useState(true)
    const [defaultList, setDefaultList] = useState([])
    const [list, setList] = useState([])
    // for backdrop status
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)

    // front end pagination
    const perPage = 5
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const handlePaginate = (e, v) => {
        let startPage = (v - 1) * perPage
        let endPage = (v - 1) + perPage
        setPage(v)
        let newList = defaultList.slice(startPage, endPage)
        setList(newList)
    }

    const handleChangeScore = (e, index) => {
        let newList = list.map((item, i) => index === i ? ({ ...item, exam_score: e.target.value }) : item)
        setList(newList)
    }

    const handleChangeRemarks = (e, index) => {
        let newList = list.map((item, i) => index === i ? ({ ...item, exam_remarks: e.target.value }) : item)
        setList(newList)
    }

    const handleSendNotif = async () => {
        Swal.fire({
            text: "Send Notification?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let toSendList = list.filter((item, i) => {
                    if (item.exam_score && item.exam_remarks) {
                        return item
                    }
                })
                if (toSendList.length === 0) {
                    toast.warning('Nothing to update!')
                    return
                }
                setStatusBackdrop(true)
                let res = await axios.post(`/api/recruitment/jobPosting/status/examination/sendNotifExamResult`, { data: toSendList })
                console.log(res)
                setStatusBackdrop(false)
                if (res.data.status === 200) {
                    let idsArr = res.data.sent_ids
                    // let newDefaultList = defaultList.filter(item => !idsArr.includes(item.profile_id))
                    // setDefaultList(newDefaultList.slice(0, perPage))
                    // setList(newDefaultList.slice(0, perPage))
                    toast.success('Notification sent!')
                    // setPage(1)
                    // setTotal(newDefaultList.length)
                }
            }
        })
    }

    const handleSetIndividual = async (item) => {
        if (!item.exam_score || !item.exam_remarks) {
            toast.warning('Please fill the required input to proceed! Thank you!')
            return
        }
        setStatusBackdrop(true)
        try {
            let res = await axios.post(`/api/recruitment/jobPosting/status/examination/setIndividualResult`, item)
            console.log(res)
            if (res.data.status === 200) {
                toast.success('Setting result for this applicant complete!')
            }
            if (res.data.status === 500) {
                toast.error(res.data.message)
                return
            }
            setStatusBackdrop(false)
        }
        catch (err) {
            toast.error(err.message)
            setStatusBackdrop(false)
        }
    }

    let controller = new AbortController()

    const getListForExamResult = async (controller) => {
        try {
            let res = await axios.get(`/api/recruitment/jobPosting/status/examination/getListForExamResult?vacancyId=${data}`, {}, { signal: controller.signal })
            console.log(res)
            let newList = res.data.data.map((item, i) => ({ ...item, exam_score: item?.exam_score, exam_remarks: item?.exam_remarks, exam_results: item?.exam_results }))
            console.log(newList)
            setLoader(false)
            setDefaultList(newList)
            setTotal(newList.length)
            setList(newList.slice(0, perPage))
        }
        catch (err) {
            toast.error(err.message)
        }

    }
    useEffect(() => {
        getListForExamResult(controller)
        return () => controller.abort()
    }, [])
    return (
        <Container sx={{ py: 2 }}>
            <Alert severity='info'>Set examination results.</Alert>
            <CustomBackdrop title='please wait . . . ' open={statusBackdrop} />
            <TableContainer component={Paper} sx={{ mt: 1,height:'300px',maxHeight:'300px' }}>
                <Table aria-label="simple table" size='small' stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>FULL NAME</TableCell>
                            <TableCell align="left">RATING</TableCell>
                            <TableCell align="left">REMARKS</TableCell>
                            <TableCell align="left">ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(perPage)).map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell align="left" sx={{ bgcolor: item?.employee_id ? 'primary.light' : '', color: item?.employee_id ? '#fff' : '', fontWeight: item?.notified ? 'none' : 'bold' }}>
                                            <Skeleton variant="text" width="" height={35} animation="pulse" />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Skeleton variant="text" width="" height={35} animation="pulse" />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Skeleton variant="text" width="" height={35} animation="pulse" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width="" height={35} animation="pulse" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {list.length === 0 && (
                                    <TableRow >
                                        <TableCell align="center" sx={{ bgcolor: red[500], color: '#fff' }} colSpan={4}>
                                            empty
                                        </TableCell>
                                    </TableRow>
                                )}
                                {list && list.map((item, i) => (
                                    <Fade in key={item.profile_id}>
                                        <TableRow >
                                            <TableCell align="left" sx={{ bgcolor: item?.employee_id ? 'primary.light' : '', color: item?.employee_id ? '#fff' : '', fontWeight: item?.notified ? 'none' : 'bold' }}>
                                                {item?.fname} {item?.mname} {item?.lname}
                                            </TableCell>
                                            <TableCell align="left">
                                                <TextField
                                                    fullWidth
                                                    id=""
                                                    label=" "
                                                    size='small'
                                                    type='number'
                                                    value={item.exam_score}
                                                    onChange={(e) => handleChangeScore(e, i)}
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                <TextField
                                                    fullWidth
                                                    id=""
                                                    label=" "
                                                    size='small'
                                                    value={item.exam_remarks}
                                                    onChange={(e) => handleChangeRemarks(e, i)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex">
                                                    <Tooltip title={`Set exam result to ${item.fname} ${item.mname} ${item.lname}`}>
                                                        <CheckIcon sx={{ border: `2px solid ${blue[500]}`, borderRadius: .5, padding: .2, fontSize: 25, cursor: 'pointer', color: blue[500], '&:hover': { border: `2px solid ${blue[800]}`, color: blue[800] } }} onClick={() => handleSetIndividual(item)} />
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
            {list.length !== 0 && (
                <Pagination sx={{ mt: 1 }} page={page} count={Math.ceil(total / perPage)} color='primary' onChange={handlePaginate} />
            )}

            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box display="flex" sx={{ justifyContent: 'flex-start', mt: 2 }}>
                    <Button variant='contained' color='warning' startIcon={<SendIcon />} sx={{ borderRadius: '2rem' }} onClick={handleSendNotif}>Send notification</Button>
                </Box>
                <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant='contained' color='info' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus('INTERVIEW-SHORTLIST', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed to next step/status</Button>
                </Box>
            </Box>

        </Container>
    );
};

export default ExamResult;