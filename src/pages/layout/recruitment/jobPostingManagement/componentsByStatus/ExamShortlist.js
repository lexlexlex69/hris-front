import React, { useState, useContext, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
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
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import PrintIcon from '@mui/icons-material/Print';
import Tooltip from '@mui/material/Tooltip'
import ArrowForward from '@mui/icons-material/ArrowForward';
import GroupIcon from '@mui/icons-material/Group';

import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';
import axios from 'axios';
import moment from 'moment';
import Skeleton from '@mui/material/Skeleton'
import Checkbox from '@mui/material/Checkbox';

import PrintExamShortList from './printables/PrintExamShortList'
import CustomBackdrop from './CustomBackdrop';
import Swal from 'sweetalert2';
import Typography from '@mui/material/Typography'

import CommonModal from '../../../../../common/Modal';
import PrintExamShortListSignatories from './printables/PrintExamShortListSignatories';
import Warnings from './receivingApplicants/Warnings';



const ExamShortlist = ({ data, closeDialog }) => {
    let controller = new AbortController()

    function groupBy(arr, property) {
        return arr.reduce(function (memo, x) {
            if (!memo[x[property]]) { memo[x[property]] = []; }
            memo[x[property]].push(x);
            return memo;
        }, {});
    }


    const componentRef = useRef();

    const handlePrintShortList = () => {
        let notQual = shortList.filter(function (obj) {
            return !attendies.some(function (obj2) {
                return obj.applicant_id === obj2.applicant_id;
            });
        });
        // added the type if attendies or not qual
        let notQualType = notQual.map((item, index) => ({ ...item, type: 'not_qualified' }))
        let attendiesType = attendies.map((item, index) => ({ ...item, type: 'qualified' }))

        setNotQualified(notQualType)
        setAttendies(attendiesType)
        Swal.fire('Processing request . . .')
        Swal.showLoading()
        setTimeout(() => {
            Swal.close()
            handlePrint()
        }, 500)
    }
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [loader, setLoader] = useState(true)
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)
    const [shortList, setShortList] = useState([])

    const [examDates, setExamDates] = useState([])
    const [attendies, setAttendies] = useState([])
    const [notQualified, setNotQualified] = useState([])
    const [posInfo, setPosInfo] = useState('')
    const [signatoriesModal, setSignatoriesModal] = useState(false)
    const [signatoriesData, setSignatoriesData] = useState({
        prepareBy: '',
        prepareByParenthetic: '',
        prepareByPosition: '',
        reviewedBy: '',
        reviewedByParenthetic: '',
        reviewedByPosition: '',
        approvedBy: '',
        approvedByParenthetic: '',
        approvedByPosition: '',

    })

    const getShortList = async (controller) => {
        let res = await axios.get(`/api/recruitment/jobPosting/status/examination/getShortList?vacancyId=${data}`)
        setLoader(false)
        setShortList(res.data.data)
        let groupedBy = groupBy(res.data.data, "exam_date")
        let forAttendies = res.data.data.filter((item, i) => item?.exam_notif === 1)
        setAttendies(forAttendies)
        let examDatesArr = Object.keys(groupedBy).map((item) => { return { date: item } })
        setExamDates(examDatesArr)
    }

    const handleExamDate = (e, index) => {
        let newDates = examDates.map((item, i) => {
            if (i === index) {
                return { ...item, [e.target.name]: e.target.value }
            }
            else {
                return item
            }
        })
        setExamDates(newDates)
    }

    const handleAttendies = (e, index, param) => {
        if (attendies.length === 0) {
            setAttendies(prev => [...prev, param])
        }
        else {
            let checkIfExist = attendies.filter((x, i) => x.applicant_id === param.applicant_id)
            if (checkIfExist.length > 0) {
                let removeItem = attendies.filter((x, i) => x.applicant_id !== param.applicant_id)
                setAttendies(removeItem)
            }
            else {
                setAttendies(prev => [...prev, param])
            }
        }
    }

    const getJobPostInfo = async (controller) => {
        let res = await axios.get(`/api/recruitment/jobPosting/jobVacancyInfo?vacancyId=${data}`, {}, { signal: controller.abort() })
        setPosInfo(res.data)
    }

    const fetchAssignatories = async () => {
        let res = await axios.get(`/api/recruitment/jobPosting/status/examination/get-signatories?vacancyId=${data}`)
        setSignatoriesData({
            preparedBy: res.data?.prep_name,
            preparedByParenthetic: res.data?.prep_pos,
            preparedByPosition: res.data?.prep_title,
            reviewedBy: res.data?.rev_name,
            reviewedByParenthetic: res.data?.rev_pos,
            reviewedByPosition: res.data?.rev_title,
            approvedBy: res.data?.appr_name,
            approvedByParenthetic: res.data?.appr_pos,
            approvedByPosition: res.data?.appr_title,
        })
    }

    useEffect(() => {
        getShortList(controller)
        getJobPostInfo(controller)
        fetchAssignatories()

        return () => controller.abort()
    }, [])
    return (
        <Container sx={{ pt: 2, px: { xs: '', md: 20 } }}>
            <CommonModal open={signatoriesModal} setOpen={setSignatoriesModal} title=''>
                <PrintExamShortListSignatories vacancyId={data} setSignatoriesData={setSignatoriesData} signatoriesData={signatoriesData} setSignatoriesModal={setSignatoriesModal} />
            </CommonModal>
            <CustomBackdrop title="please wait . . ." open={statusBackdrop} />
            <Typography variant="body1" color="primary" align='center'>Examination shortlist</Typography>
            <Box display='flex' justifyContent='flex-end'>
                <Button variant='contained' sx={{ borderRadius: '2rem', mb: 1 }} size="small" startIcon={<GroupIcon />} onClick={() => setSignatoriesModal(true)}>Open Signatories</Button>
            </Box>
            <Card mt={1}>
                <CardContent>
                    <Typography variant="body1" color="success.light" my={1}>SET EXAMINATION DETAILS PER DATE:</Typography>
                    {examDates.map((item, index) => (
                        <Box display='flex' flexDirection='column' gap={1}>
                            <Typography color='warning.main'>Exam Date: {item?.date}</Typography>
                            <Box display='flex' gap={1}>
                                <TextField size='small' label="Mode  of Examination" name="mode_of_exam" onChange={(e) => handleExamDate(e, index)} fullWidth></TextField>
                                <TextField size='small' label="Type of Test" name="type_of_test" onChange={(e) => handleExamDate(e, index)} fullWidth></TextField>
                            </Box>
                        </Box>
                    ))}
                </CardContent>
            </Card>
            <Box display="flex" justifyContent='flex-end'>
                <Box display="flex" sx={{ justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <div style={{ display: 'none' }}>
                        <div ref={componentRef} >
                            <PrintExamShortList data={attendies} notQualified={notQualified} posInfo={posInfo} examDates={examDates} signatoriesData={signatoriesData} />
                        </div>
                    </div>

                    <Tooltip title="Print shortlist">
                        <>
                            <Typography variant='body2' color="primary.light" mr={1}>Print Written examination schedule</Typography>
                            <PrintIcon sx={{ cursor: 'pointer', color: blue[500], '&:hover': { color: blue[800] } }} onClick={handlePrintShortList} />
                        </>
                    </Tooltip>
                </Box>
            </Box>
            <Warnings arr={[{ color: 'primary.light', text: 'Insider applicant' }]} />
            <TableContainer component={Paper} sx={{ mt: 1, maxHeight: '70vh', mt: 2 }}>
                <Table aria-label="shortlist interviewee table" size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ATTENDEE</TableCell>
                            <TableCell align="left">#</TableCell>
                            <TableCell align="left">FIRST NAME</TableCell>
                            <TableCell align="left">MIDDLE NAME</TableCell>
                            <TableCell align="left">LAST NAME</TableCell>
                            <TableCell align="left">EXAM DATE</TableCell>
                            <TableCell align="left">EXAM TIME</TableCell>
                            <TableCell align="left">STATUS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                        <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                        {shortList && shortList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}><Checkbox checked={item?.exam_notif === 1 ? 'checked' : ''} /></TableCell>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}>{index + 1}</TableCell>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}>{item?.fname}</TableCell>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}>{item?.mname}</TableCell>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}>{item?.lname}</TableCell>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}>{item?.exam_date}</TableCell>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}>{moment(item?.exam_time, "HH:mm:ss").format('hh:mm: A')}</TableCell>
                                <TableCell align="left" sx={{ color: item?.employee_id ? 'primary.light' : '' }}>{item?.employee_id ? 'INSIDER APPLICANT' : 'OUTSIDER APPLICANT'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" sx={{ justifyContent: 'flex-end', my: 2 }}>
                <Button variant='contained' color='primary' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({},'INTERVIEW-SHORTLIST', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed to next step/status</Button>
            </Box>
        </Container>
    );
};

export default ExamShortlist;