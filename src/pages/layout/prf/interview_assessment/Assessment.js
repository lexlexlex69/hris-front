import { PrfStateContext } from "../PrfProvider"
import { Fragment, useContext, useEffect, useState } from "react"
import { Avatar, AvatarGroup, Box, Button, FormControl, IconButton, Stack, styled, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Cached as CachedIcon } from "@mui/icons-material";
import { CustomDialog, CustomFullDialog, TableContainerComp } from "../components/export_components/ExportComp"
import { tableEvalColumns } from "../components/TableHeadAtt"
import NoDataFound from "../components/NoDataFound"
import { indigo, purple } from "@mui/material/colors"
import { toast } from "react-toastify"
import { isEmptyObject } from "jquery"
import { PopoverApplicantInfo } from "../components/pooling_indorsement/PoolingCandidates"
import QualificationsCompetencies from "./qualifications_competencies/QualificationsCompetencies"
import BackgroundInvestigation from "./background_investigation/BackgroundInvestigation"
import { getAssessmentList, updateApplicantAssessed } from "../axios/prfPooling"
import CommonModal from "../../../../common/Modal"
import ExamIAF from "./evaluation_interview_assessment/ExamIAF"
import { checkAssessmentStatusReq } from "../axios/AssessmentStatusRequest"
import Swal from "sweetalert2";
import AssessedApplicant from "./AssessedApplicant";
import ViewIAF from "./evaluation_interview_assessment/ViewIAF";
import { AppliedInfo } from "../components/pooling_indorsement/component/ExportComponent";
import ButtonViewPRF from "../requestdetails/view/ButtonViewPRF";
import axios from "axios";

const color1 = indigo[600];
const color2 = purple[600];

function Assessment({ closeModal }) {
    const { tempReq, applicantList, setApplicantList, userId, matches, applicantData, setApplicantData, assessmentList, setAssessmentList, examList, setExamList, bIList, setBIList, assessmentStatus, setAssessmentStatus, raterIAInfo, setRaterIAInfo, } = useContext(PrfStateContext)
    const [tableColData, setTableColData] = useState(tableEvalColumns)

    const [appData, setAppData] = useState({})
    const [anchorEl, setAnchorEl] = useState(null);
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    const [doneOpen, setDoneOpen] = useState(false)
    const [openView, setOpenView] = useState(false)
    const [lvlKey, setLvlKey] = useState(false)
    const [openViewprf, setOpenViewprf] = useState(false)

    const [requestQueue, setRequestQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false);
    const processQueue = async () => {
        if (processingQueue || requestQueue.length === 0) return;
        setProcessingQueue(true);
        const currentRequest = requestQueue[0];
        try {
            await currentRequest();
        } catch (error) {
            console.error('Error processing request:', error);
        } finally {
            setRequestQueue(prevQueue => prevQueue.slice(1));
            setProcessingQueue(false);
        }
    };
    useEffect(() => {
        if (!processingQueue) {
            processQueue();
        }
    }, [requestQueue, processingQueue]);
    const enqueueRequest = (requestFn) => {
        setRequestQueue(prevQueue => [...prevQueue, requestFn]);
    };


    useEffect(() => {
        const fetchApplicantAssessment = async () => {
            Swal.fire({
                title: 'Loading...',
                icon: "info",
                text: 'Please wait while we fetch the data.',
                allowOutsideClick: false,
                showCancelButton: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });
            fetchAllData();
        }
        fetchApplicantAssessment();
    }, [])

    const fetchAllData = () => {
        enqueueRequest(async () => {
            try {
                const [res1] = await Promise.all([
                    getAssessmentList({ user_id: userId, prf_id: tempReq.id }),
                ])

                setApplicantList(res1.data.data)
                setAssessmentList(res1.data.interviewed_data)
                setExamList(res1.data.exam_data)
                setBIList(res1.data.bi_data)
            } catch (error) {
                toast.error(error.message);
            } finally {
                // setAPICheck(false)
                Swal.close();
            }
        });
    }


    const handleActionBtn = (e, type, it) => {
        e.preventDefault();
        if (String(it.rater_lvl) === 'human_resources') {
            setLvlKey(true)
        } else {
            setLvlKey(false)
        }
        setApplicantData(it)
        switch (type) {
            case 2:
                // INTERVIEW ASSESSMENT
                setOpen1(true)
                break;
            case 3:
                // BACKGROUND INVESTIGATION
                setOpen2(true)
                break;
            case 4:
                // EXAMINATION ASSESSMENT <- INTERVIEW ASSESSMENT
                setOpen3(true)
                break;

            case 10:
                // view assessment
                setOpenView(true)
                break;

            case 100:
                setDoneOpen(true)
                break;

            case 999:
                // ASSESSMENT ASSESSED AT UPDATER 
                if (!it) { return toast.error('Ops, something went wrong!') }
                Swal.fire({
                    title: "Click submit to continue?",
                    text: "",
                    icon: "info",
                    showCancelButton: true,
                    cancelButtonColor: "#d33",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Submit",
                }).then((result) => {
                    if (result.isConfirmed) {
                        submitCompletedAssessment(it)
                    }
                });
                break;

            default:
                toast.warning('Error! Action not found!')
                break;
        }
    }

    const submitCompletedAssessment = (item) => {
        enqueueRequest(async () => {
            try {
                const res = await updateApplicantAssessed({ data: item });
                if (res.data.status === 200) {
                    toast.success(res.data.message);
                    handleReloadData();
                }
                else {
                    toast.error(res.data.message)
                }
            } catch (error) {
                toast.error(error.message);
            }
        })
    }

    const handleReloadData = () => {
        Swal.fire({
            title: 'Loading...',
            icon: "info",
            text: 'Please wait while we fetch the data.',
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        })
        fetchAllData();
    }

    const handleRevAC = () => {
        setDoneOpen(false);
        setApplicantData({});
        handleReloadData();
    }
    const handleInvAssess = () => {
        setOpen1(false)
        setAppData({})
        handleReloadData();
    }
    const handleBgInv = () => {
        setOpen2(false)
        setAppData({})
        handleReloadData();
    }
    const handleExamC = () => {
        setOpen3(false)
        setAppData({})
        handleReloadData();
    }

    const handlePopoverOpen = (event, node) => {
        setAnchorEl(event.currentTarget);
        setAppData(node);
    };

    const handlePopoverClose = () => { setAnchorEl(null); setAppData({}); };
    const openHovPop = Boolean(anchorEl);

    return (
        <>
            <Stack gap={2}>
                <Stack spacing={1}>
                    <AppliedInfo tempReq={tempReq} />
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <ButtonViewPRF open={openViewprf} handleClickOpen={() => setOpenViewprf(true)} handleClose={() => setOpenViewprf(false)} id={'a-id'} minWidth={'65%'} />
                    </Box>
                    <Box>
                        <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" onClick={handleReloadData} size="small">
                            <CachedIcon />
                        </IconButton>
                    </Box>
                </Stack>
                <Box>
                    <TableContainerComp maxHeight={'auto'} height={'500px'}>
                        <TableHead key={'tabler-header'}>
                            <TableRow>
                                {tableColData.map((i, indx) => (
                                    <TableCell key={i.id + indx} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: i.width, backgroundColor: "#1565C0 !important" }}>
                                        {i.headerName}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody key={'table-body'}>
                            <>
                                {!isEmptyObject(applicantList) && (
                                    <>
                                        {applicantList.prf_iafs.length <= 0 ?
                                            <NoDataFound spanNo={Object.keys(tableColData).length} />
                                            :
                                            applicantList.prf_iafs.map((it, index) => (
                                                <TableRow key={"applicant-list-" + it.id + index}>
                                                    <TableCell>
                                                        <Typography aria-owns={openHovPop ? 'mouse-over-popover' : undefined} aria-haspopup="true"
                                                            onMouseEnter={(ev) => handlePopoverOpen(ev, it)}
                                                            onMouseLeave={handlePopoverClose}
                                                            sx={{ textDecoration: "none", color: "cornflowerblue" }}
                                                        >
                                                            {it.lname.toUpperCase() + ", " + it.fname.toUpperCase() + ' ' + it.mname[0].toUpperCase() + "."}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                                            <FormControl fullWidth>
                                                                <Button variant="contained" color="info" type="button" size="small" onClick={(ev) => handleActionBtn(ev, 10, it)}>
                                                                    Evaluate Applicant
                                                                </Button>
                                                            </FormControl>

                                                            <FormControl fullWidth sx={{ gap: '5px' }}>
                                                                {applicantList.rater_info.filter(ob => ob.prf_applicant_id === it.id && Number(userId) === ob.emp_id && ob.id === it.rater_id).map((i, index) => {
                                                                    const assessedInterview = assessmentList.find(io => io.id === i.assessed_int_id);
                                                                    const assessedExam = examList.find(oi => oi.id === i.assessed_exam_id);
                                                                    const assessedBackgroundInvestigation = bIList.find(on => on.id === i.assessed_bi_id);

                                                                    return (<>
                                                                        {i.exam_opt === 1 && (
                                                                            assessedExam === undefined ?
                                                                                <Button key={index} variant="contained" sx={{ backgroundColor: 'rgb(145,200,169)' }} size="small" onClick={(ev) => handleActionBtn(ev, 4, it)}>
                                                                                    Assess Examination
                                                                                </Button>
                                                                                :
                                                                                <Button variant="contained" size="small" disabled>
                                                                                    Exam {assessedExam.exam_result}
                                                                                </Button>
                                                                        )}



                                                                        {!assessedInterview ? <>
                                                                            <Button key={index} variant="contained" color="primary" size="small" onClick={(ev) => handleActionBtn(ev, 2, it)}>
                                                                                Assess Interview
                                                                            </Button>
                                                                        </> : <>
                                                                        </>}

                                                                        {!assessedBackgroundInvestigation ? <>
                                                                            <Button key={index} variant="contained" color="secondary" size="small" onClick={(ev) => handleActionBtn(ev, 3, it)}>
                                                                                Assess Background Investigation
                                                                            </Button>
                                                                        </> : <></>}

                                                                        {assessedInterview && assessedBackgroundInvestigation ? <>
                                                                            {i.assessed_at ?
                                                                                <Button key={index} variant="contained" color="primary" size="small" disabled>
                                                                                    Assessment Complete
                                                                                </Button>
                                                                                :
                                                                                <Button key={index} variant="contained" color="warning" size="small" onClick={(ev) => handleActionBtn(ev, 100, it)}>
                                                                                    Review Assessment
                                                                                </Button>
                                                                            }
                                                                        </> : <>
                                                                        </>}
                                                                    </>)
                                                                })}
                                                            </FormControl >
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </>
                                )}
                            </>
                        </TableBody>
                    </TableContainerComp>
                </Box>
            </Stack >
            <Fragment>
                <CustomDialog matches={matches} openner={open1} handleCloseBTN={handleInvAssess} comptitle="" compSize="">
                    <QualificationsCompetencies closeModal={handleInvAssess} />
                </CustomDialog>
                <CustomDialog matches={matches} openner={open2} handleCloseBTN={handleBgInv} comptitle="" compSize="">
                    <BackgroundInvestigation closeModal={handleBgInv} />
                </CustomDialog>
                <CommonModal open={open3} setOpen={handleExamC} title="Examination" customWidth={"auto"}>
                    <ExamIAF closeModal={handleExamC} />
                </CommonModal>
                <PopoverApplicantInfo open={openHovPop} anchor={anchorEl} closeBtn={handlePopoverClose} data={appData} />
                <CustomFullDialog id="assessed-applicant-id" openG={doneOpen} handleCloseG={handleRevAC} comptitle="" compSize="" minWidthP={"60%"}>
                    <AssessedApplicant closeModal={handleRevAC} applicantData={applicantData} type={lvlKey} />
                </CustomFullDialog>
                <CustomFullDialog id="view-assessment" openG={openView} handleCloseG={(ev) => { setOpenView(false) }} comptitle="" compSize="" minWidthP={"60%"}>
                    <ViewIAF applicantData={applicantData} disabledToggler={true} />
                </CustomFullDialog>
            </Fragment>
        </>
    )
}

export default Assessment
