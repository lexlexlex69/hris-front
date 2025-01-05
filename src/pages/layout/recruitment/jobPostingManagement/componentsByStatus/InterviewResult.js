import React, { useState, useContext, useEffect, useRef } from 'react';
import { blue, red } from '@mui/material/colors'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Pagination from '@mui/material/Pagination'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'

import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import axios from 'axios'
import Swal from 'sweetalert2';

import ArrowForward from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check'

import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';
import CustomBackdrop from './CustomBackdrop';

import BBIRatingForm from './printables/BBIRatingForm';
import ConcensusRatingForm from './printables/ConcensusRatingForm';
import ConsensusGroupRating from './interview/ConsensusGroupRating';
import ManualRateApplicant from './interview/ManualRateApplicant';
import ComparativeAssessment from './interview/ComparativeAssessment';
import ComparativeAttested from './interview/ComparativeAttested';
import ComparativeAssessmentSignatories from './interview/ComparativeAssessmentSignatories';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '1rem',
    p: 4,
};

const styleManualRating = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '90%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '1rem',
    p: 4,
}

const InterviewResult = ({ data, closeDialog }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // printing
    const [printData, setPrintData] = useState('')
    const componentRef = useRef()
    const componentRefConcensus = useRef()
    const componentRefConcensusGroup = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handlePrintConcensus = useReactToPrint({
        content: () => componentRefConcensus.current,
    });
    const handlePrintConcensusGroup = useReactToPrint({
        content: () => componentRefConcensusGroup.current,
    });

    const [consensusState, setConsensusState] = useState([])
    // 

    let controller = new AbortController()
    const [list, setList] = useState([])
    const [defaultList, setDefaultList] = useState([])
    const [loader, setLoader] = useState(true)
    // for backdrop status
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)

    // comparative assessment report
    const [comparativeModal, setComparativeModal] = useState(false)
    const [comparativeData, setComparativeData] = useState('')

    const [comparativeAttested, setComparativeAttested] = useState([
        {
            name: '',
            office: '',
            designation: '',
            head: ''
        },
        {
            name: '',
            office: '',
            designation: '',
            head: ''
        },
        {
            name: '',
            office: '',
            designation: '',
            head: ''
        },
        {
            name: '',
            office: '',
            designation: '',
            head: ''
        },
        {
            name: '',
            office: '',
            designation: '',
            head: ''
        }
    ])
    const [comparativePrepared, setComparativePrepared] = useState({
        name: '',
        office: '',
        designation: '',
        head: ''
    })
    const [comparativeCertified, setComparativeCertified] = useState({
        name: '',
        office: '',
        designation: '',
        head: ''
    })

    const [comparativeApprove, setComparativeApprove] = useState({
        name: ''
    })

    const [signatoriesBackDrop, setSignatoriesBackDrop] = useState(false)
    const handleSetSignatories = async () => {
        const toStore = {
            vacancyId: data,
            prepName: comparativePrepared.name,
            prepOffice: comparativePrepared.office,
            prepDesignation: comparativePrepared.designation,
            prepHead: comparativePrepared.head,
            certName: comparativeCertified.head,
            certOffice: comparativeCertified.office,
            certDesignation: comparativeCertified.designation,
            certHead: comparativeCertified.head,
        }
        setSignatoriesBackDrop(true)
        let res = await axios.post(`/api/recruitment/jobPosting/status/interview-result/store-signatories`, toStore)
        console.log(res)
        if (res.data.status === 200) {

        }
        else if (res.data.status === 500) {
            toast.error(res.data.message, { autoClose: 1000 })
        }
        setSignatoriesBackDrop(false)
    }

    // consensus modal
    const [consensusModal, setConsensusModal] = useState(false)
    const handleCloseConsensus = () => setConsensusModal(false)
    const handleAttestedChange = (e, index) => {
        setComparativeAttested(prev => [...prev, { [e.target.name]: e.target.value }])
        let newAttested = comparativeAttested.map((item, i) => i === index ? ({ ...item, [e.target.name]: e.target.value }) : item)
        setComparativeAttested(newAttested)
    }
    // 

    const handleOpenComparative = async () => {
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/recruitment/jobPosting/status/interview-result/getComparativeAssessment`, { vacancy_id: data })
        Swal.close()
        setComparativeData(res.data)
        setComparativeModal(true)
    }
    const handleCloseComparative = () => setComparativeModal(false)

    // for modal
    const [openModal, setOpenModal] = React.useState(false);
    const [modalPrintableData, setModalPrintableData] = useState('')
    const [consensusRatingGroupPrintData, setConsensusRatingGroupPrintData] = useState('')
    const handleOpenModal = (item) => {
        setModalPrintableData(item)
        setOpenModal(true)
    };
    const handleCloseModal = () => setOpenModal(false);

    const [openModalManualRating, setOpenModalManualRating] = React.useState(false);
    const [ModalManualRatingData, setModalManualRatingData] = useState('')
    const handleOpenModalManualRating = (id) => {
        setModalManualRatingData(id)
        setOpenModalManualRating(true);
    }
    const handleCloseModalManualRating = () => setOpenModalManualRating(false);
    // pagination
    const perPage = 5
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const handlePaginate = (e, v) => {
        if (page === v) {
            return
        }
        let pageStart = (v - 1) * perPage
        let pageEnd = v * perPage
        if (defaultList.length < pageEnd) {
            pageEnd = defaultList.length
        }
        setList(defaultList.slice(pageStart, pageEnd))
        setPage(v)
    }

    // menu 
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [menuProfileId, setMenuProfileId] = useState('')
    const handleClickMenu = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuProfileId(id)
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSendNotif = async () => {

    }

    const getInterviewResult = async () => {
        try {
            let res = await axios.get(`/api/recruitment/jobPosting/status/set-interview/getInterviewResult?vacancyId=${data}`, {}, { signal: controller.signal })
            // calculate total interview score for each panelist for overall rating
            let newList = res.data.data.map((item, index) => {
                let total = 0
                let ave = 0
                if (item?.interviewers?.length > 0) {
                    item?.interviewers.forEach((x, i) => {
                        total = total + (((x?.coaching_result / item?.interviewers.length) + (x?.delivering_service / item?.interviewers.length) + (x?.exemplifying_integrity / item?.interviewers.length) + (x?.high_performance_organization / item?.interviewers.length) + (x?.leading_change / item?.interviewers.length) + (x?.solving_problems / item?.interviewers.length) + (x?.strategic_creativity / item?.interviewers.length) + (x?.working_relationship / item?.interviewers.length)))
                    })
                    ave = ave + total / 8
                    let exam_rate = item?.exam_score * .20
                    let bbi_rate = (((ave) / 5) * .5) * 100
                    let total_score = item.eval_education + item.eval_experience + item.eval_training + exam_rate + bbi_rate
                    return { ...item, interview_total: ave, exam_rate: exam_rate, bbi_rate: bbi_rate, total_score: total_score }
                }
                else {
                    return item
                }

            })
            let sortedList = newList.sort(function (a, b) {
                return a.total_score > b.total_score
            })

            let rakingList = sortedList.map((x, i) => ({ ...x, ranking: i + 1 }))

            setDefaultList(rakingList)
            setList(rakingList.slice(0, perPage))
            setTotal(rakingList.length)
            setLoader(false)
        }
        catch (error) {
            toast.error(error)
        }

    }

    const getInterviweersInfo = async (printFunction) => {
        Swal.fire({
            text: 'Request processing... please wait',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/recruitment/jobPosting/status/set-interview/getInterviweersInfo`, { profile_id: modalPrintableData?.profile_id, vacancy_id: data })
        setConsensusState(res.data.intervieweers)
        let toPrint2 = res.data.applicant_profile
        toPrint2.profile = { ...modalPrintableData }
        setPrintData(toPrint2)
        if (printFunction && typeof (printFunction) === 'function') {
            Swal.close()
            setTimeout(() => printFunction(), 500)
        }
    }

    const printConsensusGroupRating = async () => {
        Swal.fire({
            text: 'Request processing... please wait',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/recruitment/jobPosting/status/interview-result/printCensusGroupRating`, { vacancy_id: data })
        Swal.close()
        let printDataFilter = res.data.summary.filter((elem) => {
            return defaultList.some((x) => x.profile_id === elem.profile_id)
        })
        let newData = printDataFilter.map(item => {
            let newObj = {}
            Object.keys(item).forEach(x => {
                if (x !== 'profile_id' || x !== 'panels') {
                    newObj[x] = item[x] / item['panels']
                }
            })
            newObj['profile_id'] = item.profile_id
            newObj['panels'] = item.panels
            return newObj
        })
        let vancancyAndSummary = {
            vacancy_info: res.data.vacancy_info,
            summary: newData
        }
        setConsensusModal(true)
        setConsensusRatingGroupPrintData(vancancyAndSummary)
    }

    useEffect(() => {
        getInterviewResult()
        return () => controller.abort()
    }, [])

    return (
        <Container sx={{ py: 2, px: { xs: '', md: '' } }}>
            <CustomBackdrop title='Setting signatories . . . ' open={signatoriesBackDrop} />
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    <BBIRatingForm consensusStatus={consensusState || ''} printData={printData} />
                </div>
            </div>
            <div style={{ display: 'none' }}>
                <div ref={componentRefConcensus}>
                    <ConcensusRatingForm consensusStatus={consensusState || ''} printData={printData} />
                </div>
            </div>

            {/* printables modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Box sx={style}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a', fontSize: matches ? '.8rem' : '1rem' }}>PRINTABLES</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <Box display='flex' sx={{ gap: 2, flexDirection: 'column', alignItems: 'center' }}>
                            <Button variant="contained" color="primary" sx={{ width: '90%' }} startIcon={<DownloadIcon />} onClick={() => getInterviweersInfo(handlePrint)}>
                                behavioral-based interview (bbi) rating form
                            </Button>
                            <Button variant="contained" color="primary" sx={{ width: '90%' }} startIcon={<DownloadIcon />} onClick={() => getInterviweersInfo(handlePrintConcensus)}>
                                concensus rating form
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* manual rating modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModalManualRating}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModalManualRating}>
                    <Box sx={styleManualRating}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a', fontSize: matches ? '.8rem' : '1rem' }}>Manual Rating</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseModalManualRating} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <ManualRateApplicant interviewerInfo={ModalManualRatingData} list={list || ''} setList={setList} setInterviewerInfo={setModalManualRatingData} />
                    </Box>
                </Fade>
            </Modal>

            {/* comparative assessment */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={comparativeModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={comparativeModal}>
                    <Box sx={styleManualRating}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a', fontSize: matches ? '.8rem' : '1rem' }}>Comparative Assessment</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseComparative} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <ComparativeAssessment dataVacancy={data} approved={comparativeApprove} prepared={comparativePrepared} certified={comparativeCertified} attestedDefault={comparativeAttested} interviewerInfo={ModalManualRatingData} comparativeData={comparativeData} setInterviewerInfo={setModalManualRatingData} defaultList={defaultList} />
                    </Box>
                </Fade>
            </Modal>

            {/* consensus */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={consensusModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={consensusModal}>
                    <Box sx={styleManualRating}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a', fontSize: matches ? '.8rem' : '1rem' }}>Comparative Assessment</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseConsensus} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <ConsensusGroupRating consensusStatus={consensusState || ''} printData={consensusRatingGroupPrintData} defaultList={defaultList} />
                    </Box>
                </Fade>
            </Modal>
            <Box sx={{ width: '100%' }}>
                <Alert severity='info'
                    action={
                        <Box display='flex' gap={1}>
                            <Button variant='contained' color="primary" size="small" onClick={printConsensusGroupRating}>
                                {!matches && <LocalPrintshopIcon sx={{ mr: 1 }} />}

                                {matches ? <Typography variant={matches ? 'body2' : 'body2'}> {matches ? 'Group rating' : 'Consensus group rating'}</Typography> : <Typography variant={matches ? 'body2' : 'body2'}>Consensus group rating</Typography>}
                            </Button>
                            <Button variant='contained' color="primary" size="small" onClick={handleOpenComparative}>
                                {!matches && <LocalPrintshopIcon sx={{ mr: 1 }} />}
                                {matches ? <Typography variant={matches ? 'body2' : 'body2'}> {matches ? 'Assess- ment' : 'Assessment'}</Typography> : <Typography variant={matches ? 'body2' : 'body2'}>Comparative assessment</Typography>}

                            </Button>
                        </Box>
                    }
                >Interview results</Alert>
            </Box>

            <CustomBackdrop title='please wait . . . ' open={statusBackdrop} />
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table aria-label="simple table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">FULL NAME</TableCell>
                            <TableCell align="left">RATING</TableCell>
                            <TableCell align="left">RAKING</TableCell>
                            <TableCell align="right">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, index) => (
                                    <TableRow>
                                        {Array.from(Array(4)).map((x, i) => (
                                            <TableCell>
                                                <Skeleton variant="text" width="" height="" animation="pulse" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                {list && list.length === 0 && (
                                    <TableRow>
                                        <TableCell sx={{ bgcolor: red[500], color: '#fff' }} align='center' colSpan={4}>
                                            empty
                                        </TableCell>
                                    </TableRow>
                                )}
                                {list && list.sort((a, b) => a.total_score < b.total_score ? 1 : -1)?.map((item, i) => (
                                    <Fade in key={item.id}>
                                        <TableRow>
                                            <TableCell align="left">
                                                {item.fname} {item.mname} {item.lname}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="body1" color="initial">{item?.total_score?.toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="body1" color="initial">{((page - 1) * perPage) + (i + 1)}</Typography>
                                            </TableCell>
                                            <TableCell align="right" >
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Tooltip title="Printables">
                                                        <LocalPrintshopIcon onClick={() => handleOpenModal(item)} sx={{ border: `2px solid ${blue[500]}`, color: blue[500], p: .2, borderRadius: .5, '&:hover': { border: `2px solid ${blue[800]}`, color: blue[800] }, fontSize: 25, cursor: 'pointer' }} />
                                                    </Tooltip>
                                                    <Tooltip title="Rate Manually">
                                                        <EditIcon onClick={(e) => handleClickMenu(e, item.profile_id)} sx={{ border: `2px solid ${blue[500]}`, color: blue[500], p: .2, borderRadius: .5, '&:hover': { border: `2px solid ${blue[800]}`, color: blue[800] }, fontSize: 25, cursor: 'pointer' }} />
                                                    </Tooltip>
                                                    {item.profile_id === menuProfileId &&
                                                        (
                                                            <Menu
                                                                id="basic-menu"
                                                                anchorEl={anchorEl}
                                                                open={openMenu}
                                                                onClose={handleCloseMenu}
                                                                MenuListProps={{
                                                                    'aria-labelledby': 'basic-button',
                                                                }}
                                                            >
                                                                {item?.interviewers?.map((x, i2) => (
                                                                    <MenuItem onClick={() => handleOpenModalManualRating({
                                                                        interviewee: item,
                                                                        interviewer: x,
                                                                        itemIndex: i,
                                                                        interviewerIndex: i2
                                                                    })}>
                                                                        <Typography sx={{ color: x?.is_rated ? red[300] : '' }} variant="body1" fontWeight={400} color="initial">
                                                                            {x?.fname} {x?.mname} {x?.lname}
                                                                        </Typography>
                                                                    </MenuItem>
                                                                ))}
                                                            </Menu>
                                                        )}

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
            {list && list.length !== 0 && (
                <Pagination sx={{ mt: 1 }} page={page} count={Math.ceil(total / perPage)} color='primary' size='small' onChange={handlePaginate} />
            )}

            <Box display="flex" sx={{ justifyContent: 'flex-end' }}>
                {/* <Button variant='contained' color='primary' startIcon={<CheckIcon />} sx={{ borderRadius: '2rem' }} onClick={handleSendNotif}>for issuance of appointment</Button> */}
            </Box>
            <ComparativeAssessmentSignatories comparativePrepared={comparativePrepared} setComparativePrepared={setComparativePrepared} comparativeCertified={comparativeCertified} setComparativeCertified={setComparativeCertified} data={data} handleSetSignatories={handleSetSignatories} />
            <ComparativeAttested comparativeAttested={comparativeAttested} setComparativeAttested={setComparativeAttested} handleAttestedChange={handleAttestedChange} comparativeApprove={comparativeApprove} setComparativeApprove={setComparativeApprove} data={data} />
            <Box display='flex' justifyContent="flex-end">
                <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant='contained' color='info' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({ list: list }, 'ISSUANCE-SHORTLIST', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed to next step/status</Button>
                </Box>
            </Box>
        </Container>
    );
};

export default InterviewResult;