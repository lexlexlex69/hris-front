import React, { useState, useContext, useEffect, useRef } from 'react';
import Container from '@mui/material/Container'
import { blue } from '@mui/material/colors'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import PrintIcon from '@mui/icons-material/Print';
import Tooltip from '@mui/material/Tooltip'
import ArrowForward from '@mui/icons-material/ArrowForward';
import Skeleton from '@mui/material/Skeleton'
import Fade from '@mui/material/Fade'

import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';
import CustomBackdrop from './CustomBackdrop'

import PrintInterviewShortList from './printables/PrintInterviewShortlist';

import { useReactToPrint } from 'react-to-print';

import axios from 'axios'
import moment from 'moment';
import Swal from 'sweetalert2';
import { CircularProgress, Typography, TextField } from '@mui/material';
import { toast } from 'react-toastify';


let controller = new AbortController()

let timerr = null

const InterviewShortlist = ({ data, closeDialog }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [examDates, setExamDates] = useState('')
    const [examDatesList, setExamDatesList] = useState([])

    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)
    const [positionInfo, setPositionInfo] = useState('')
    const [list, setList] = useState([])
    const [loader, setLoader] = useState(true)

    let controller = new AbortController()

    const getShortList = async () => {
        try {
            let res = await axios.get(`/api/recruitment/jobPosting/status/set-interview/getShortlist?vacancyId=${data}`, {}, { controller: controller.signal })
            console.log('shortlist', res)
            setList(res.data.data)
            let examDatesList = res.data.data.map((item) => item.exam_date)
            let uniqueDates = examDatesList.filter((item, i, ar) => ar.indexOf(item) === i)
            setExamDatesList(uniqueDates)
            setLoader(false)
        }
        catch (err) {
            toast.error(err.message)
        }

    }

    const handlePrintSLU = async () => {
        Swal.fire({
            text: 'Processing request, please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.get(`/api/recruitment/jobPosting/status/set-interview/getQs?vacancyId=${data}`)
        Swal.close()
        setPositionInfo(res.data)
        handlePrint()
    }

    const handlePerformance = (e, item) => {
        clearTimeout(timerr)
        timerr = setTimeout(() => {
            let newList = list.map((x, i) => x.profile_id === item.profile_id ? ({ ...x, performance: e.target.value }) : x)
            setList(newList)
        }, 500)
    }


    useEffect(() => {
        getShortList()
        // clean up
        return (() => controller.abort())
    }, [])

    // useEffect(() => {
    //     handleGetExamDates()
    // }, [])

    return (
        <Container sx={{ pt: 2, px: { xs: '', md: 20 } }}>
            <div style={{ display: 'none' }}>
                <div ref={componentRef} >
                    <PrintInterviewShortList positionInfo={positionInfo} data={list} examDates={examDates} />
                </div>
            </div>
            <Box display='flex'>
                <Typography variant="body2" color="initial">
                    Exam dates list: &nbsp;</Typography> {examDatesList.map((item, i) => <Typography variant="body2" color="primary" >{moment(item).format('MMM DD,YYYY')}{examDatesList.length > 1 && i !== examDatesList.length - 1 && <span style={{ color: 'black' }}>, &nbsp;</span>}</Typography>)}
            </Box>
            <Box display='flex' justifyContent='flex-end'>
                <TextField
                    id=""
                    label="Examination Date"
                    value={examDates}
                    onChange={(e) => setExamDates(e.target.value)}
                    size='small'
                    sx={{ mb: 1 }}
                />
            </Box>

            <CustomBackdrop open={statusBackdrop} title="please wait . . ." />
            {loader && (
                <Box display='flex' alignItems='center'>
                    <CircularProgress size={20} />
                    <Typography variant='body1' ml={1} color='primary'>Fetching data for each applicant, this may take a while . . .</Typography>
                </Box>
            )}
            <Box display="flex" sx={{ justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
                <Box flex={2}>
                    <Typography variant="body1" color="primary" align='right'>Short list of interviewees</Typography>
                </Box>
                <Box display="flex" sx={{ justifyContent: 'flex-end', alignItems: 'center', p: 1, flex: 1 }}>
                    <Tooltip title="Print shortlist">
                        <PrintIcon sx={{ cursor: 'pointer', color: blue[500], '&:hover': { color: blue[800] } }} onClick={handlePrintSLU} />
                    </Tooltip>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 1, maxHeight: '60vh' }}>
                <Table aria-label="shortlist interviewee table" stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" rowSpan={2} sx={{ bgcolor: 'primary.dark', color: '#fff' }}>NAME</TableCell>
                            <TableCell align="center" colSpan={5} sx={{ bgcolor: 'primary.dark', color: '#fff' }}>Actual Qualification</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>EDUCATION</TableCell>
                            <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>TRAININGS</TableCell>
                            <TableCell align="left" sx={{ bgcolor: 'primary.light' }} >WORK EXPERIENCE</TableCell>
                            <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>ELIGIBILITY</TableCell>
                            <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>PERFORMANCE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="center"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {list && list.map((item, index) => (
                                    <Fade in key={index} >
                                        <TableRow>
                                            <TableCell align="center" sx={{verticalAlign:'top'}}>
                                             <Typography sx={{ fontSize: '.6rem' }} color="initial">{item?.fname} {item?.mname} {item?.lname}</Typography>
                                            </TableCell>
                                            <TableCell sx={{verticalAlign:'top'}}>
                                                <Table>
                                                    <TableBody>
                                                        {item?.preferences?.map((item2, index2) => (
                                                            <Box key={index2}>
                                                                {item2.pref_type === 'Education' && item2.title && (
                                                                    <TableRow >
                                                                        <TableCell sx={{ border: 'none' }}>
                                                                            <Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </Box>

                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                            <TableCell sx={{verticalAlign:'top'}}>
                                                <Table>
                                                    <TableBody>
                                                        {item?.preferences?.map((item2, index2) => (
                                                            <Box key={index2}>
                                                                {item2.pref_type === 'Trainings' && item2.title && (
                                                                    <TableRow >
                                                                        <TableCell sx={{ border: 'none' }}>
                                                                            <Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </Box>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                            <TableCell sx={{verticalAlign:'top'}}>
                                                <Table>
                                                    <TableBody>
                                                        {item?.preferences?.sort((a,b) => a?.datefrom ? new Date(a?.datefrom) < new Date(b?.datefrom) ? 1 : -1 : a)?.map((item2, index2) => (
                                                            <Box key={index2}>
                                                                {item2.pref_type === 'Experience' && item2.title && (
                                                                    <TableRow >
                                                                        <TableCell sx={{ border: 'none' }}>
                                                                            <Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </Box>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                            <TableCell sx={{verticalAlign:'top'}}>
                                                <Table>
                                                    <TableBody>
                                                        {item?.preferences?.map((item2, index2) => (
                                                            <Box key={index2}>
                                                                {item2.pref_type === 'Eligibility' && item2.title && (
                                                                    <TableRow>
                                                                        <TableCell sx={{ border: 'none' }}>
                                                                            <Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </Box>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableCell>
                                            <TableCell sx={{ verticalAlign: 'top' }}>
                                                <TextField label="Write something . . ." autoComplete='OFF' onChange={(e) => handlePerformance(e, item)}></TextField>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 2, mb: 2 }}>
                <Button variant='contained' color='info' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({},'SET-INTERVIEW', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed to next step/status</Button>
            </Box>
        </Container>
    );
};

export default InterviewShortlist;