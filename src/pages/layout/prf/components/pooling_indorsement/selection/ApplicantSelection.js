import { Fragment, useContext, useEffect, useState } from "react"
import { Box, Button, IconButton, Stack, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Cached as CachedIcon, Preview as PreviewIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, ManageAccounts as ManageAccountsIcon, CancelOutlined as CancelOutlinedIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

import { PrfStateContext } from "../../../PrfProvider"
import { CustomCenterModal, CustomFullDialog, TableContainerComp } from "../../export_components/ExportComp"
import { getAssessedApplicant, getRaterPermission, insertAdditionalRater, reqEndAssessment, } from "../../../axios/prfPooling"
import ViewIAF from "../../../interview_assessment/evaluation_interview_assessment/ViewIAF"

import { setSelectedAApplicant } from "../../../axios/AssessmentStatusRequest"
import ButtonViewPRF from "../../../requestdetails/view/ButtonViewPRF"
import { AppliedInfo } from "../component/ExportComponent"
import NoDataFound from "../../NoDataFound"
import SmallModal from "../../../../custommodal/SmallModal";
import SearchEmployee from "../../../../admin/headofoffice/SearchEmployee";
import { autoCapitalizeFirstLetter } from "../../../../customstring/CustomString";


const tableHeader = [
    { id: 0, headerName: '', width: '10px' },
    { id: 1, headerName: 'NAME', width: '140px' },
    { id: 2, headerName: 'EVALUATE assessment', width: 80 },
]

function ApplicantSelection({ closeModal, requestLogsList }) {
    const { userId, tempReq, assessmentList, setAssessmentList, examList, setExamList, bIList, setBIList, applicantData, setApplicantData } = useContext(PrfStateContext)
    const [loading, setLoading] = useState(true);
    const [applicantAList, setApplicantAList] = useState([]);
    const matches = useMediaQuery('(min-width: 565px)');
    const [hiRecom, setHiRecom] = useState({
        hiring_recom: '', overall_recom: '',
    });
    const [empList, setEmpList] = useState([]);
    const [open, setOpen] = useState(0)
    const [openViewprf, setOpenViewprf] = useState(false);
    const [raterList, setRaterList] = useState([]);
    // const [checkboxList, setCheckboxList] = useState([]);
    const [counter, setCounter] = useState([])
    const [totalSelectedApp, setTotalSelectedApp] = useState(null)

    // Search Interviewer Information
    const [empId, setEmpId] = useState(null);
    const [name, setName] = useState(null);
    const [position, setPosition] = useState(null);

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

    // console.log(requestLogsList)

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
            handleReloadData();
        }
        fetchApplicantAssessment();
    }, [])

    const handleReloadData = () => {
        setLoading(true);
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
        setCounter([])
        enqueueRequest(async () => {
            try {
                const [res1] = await Promise.all([
                    getAssessedApplicant({ prf_id: tempReq.id, user_id: userId, }),
                    // getRaterPermission({ user_id: userId }),
                ])
                setApplicantAList(res1.data.applicant_list)
                setRaterList(res1.data.rater_list)
                setEmpList(res1.data.emp_list)

                const noApp = res1.data.applicant_list.filter((t, tx) => t.remark === 'SELECTED')
                setTotalSelectedApp(noApp.length)
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false)
                Swal.close();
            }
        });
    }

    const handleChangeChecked = (ev, app_id, index) => {
        const { checked } = ev.target;

        console.log(checked, app_id)

        if (checked) {
            setApplicantAList((prev) =>
                prev.map((item, idx) => idx === index ? { ...item, remark: 'SELECTED' } : item)
            )
            setCounter((prev) => [...prev, { app_id }])
        } else {
            setApplicantAList((prev) =>
                prev.map((item, idx) => idx === index ? { ...item, remark: null } : item)
            )

            setCounter((prev) => prev.filter((f) => f.app_id !== app_id))
        }
    };


    const handleViewClick = (ev, type, data) => {
        ev.preventDefault();
        setHiRecom({ hiring_recom: data.hiring_recom, overall_recom: data.overall_recom })
        if (type === 1 || type === 2 || type === 3) {
            setOpen(3)
            setApplicantData(data)
        } else {
            toast.warning('Button. Not Found!');
        }
    }

    const handleViewC = () => {
        setOpen(0)
        setApplicantData({})
        setHiRecom({ hiring_recom: '', overall_recom: '' })
    }

    const btnSelection = (ii) => {
        const fEmp = empList.find((i) => i.emp_id === ii.rater_emp_id)
        let name = fEmp.emp_lname + ', ' + fEmp.emp_fname + ' ' + fEmp.emp_mname[0] + '.'
        switch (ii.rater_lvl) {
            case 'human_resources':
                return {
                    raterLvl: `HR: ${name}`,
                    clickTrig: 3,
                    applicantDetails: ii,
                }
            case 'immediate_head':
                return {
                    raterLvl: `IM: ${name}`,
                    clickTrig: 3,
                    applicantDetails: ii,
                }
            case 'next_level_head':
                return {
                    raterLvl: `NLH: ${name}`,
                    clickTrig: 3,
                    applicantDetails: ii,
                }

            default:
                return {
                    raterLvl: 500,
                    clickTrig: 500,
                    applicantDetails: 'empty',
                }
        }
    }

    // const handleRevertPooling = (ev) => {
    //     ev.preventDefault();

    //     Swal.fire({
    //         title: "Click confirm to continue?",
    //         text: "",
    //         icon: "info",
    //         showCancelButton: true,
    //         cancelButtonColor: "#d33",
    //         confirmButtonColor: "#3085d6",
    //         confirmButtonText: "Submit",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             // revertPoolingApplicant(data)
    //         }
    //     })
    // }

    const handleSubmitSList = (ev) => {
        ev.preventDefault();
        // let t = []
        // checkboxList.forEach(element => {
        //     t.push(element['data'])
        // });

        if (counter.length < tempReq.head_cnt) {
            return toast.warning('Ops, you did not select any applicant');
        }

        const assessment_data = requestLogsList.filter(i => i.request_stat === 'POOLED COMPLETE')

        Swal.fire({
            title: "Click submit to update status, notify applicants with the examination/interview result to continue?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: 'Processing, please wait . . .',
                    icon: 'info'
                })
                Swal.showLoading()
                enqueueRequest(async () => {
                    try {
                        const res = await setSelectedAApplicant({ data: applicantAList, user_id: userId, assessment_date_started: assessment_data.pop() });
                        if (res.data.status === 200) {
                            toast.success(res.data.message)
                            if (res.data.action_upt) {
                                closeModal();
                            }
                        }
                        if (res.data.status === 500) { toast.error(res.data.message) }
                    } catch (error) {
                        toast.error(error.message);
                    } finally {
                        Swal.close();
                    }
                })
            }
        })
    }

    const handleAddNewInterviewer = (ev) => {
        ev.preventDefault();
        setOpen(100);
    }

    const handleSearchEmp = (data) => {
        console.log(data)
        setEmpId(data.id);
        setName(autoCapitalizeFirstLetter(data.fname + ' ' + (data.mname ? data.mname.charAt(0) + '. ' : ' ' + ' ') + data.lname));
        setPosition(data.position_name)
    }

    const handleInsertInterviewer = (ev) => {
        ev.preventDefault();

        if (empId === 0 || name === '' || position === '') {
            return toast.warning('Ops, you did not select any applicant');
        }

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
                insertAdditionalRater({
                    emp_id: empId,
                    prf_data: tempReq,
                    rater_lvl: 'next_level_head',
                }).then((res) => {
                    if (res.data.status === 500) { toast.error(res.data.message) }
                    if (res.data.status === 200) {
                        toast.success(res.data.message)
                        if (res.data.action_upt) {
                            setEmpId(0);
                            setName('');
                            setPosition('');
                            setOpen(0);
                            handleReloadData();
                        }
                    }
                }).catch((err) => {
                    toast.error(err.message)
                })
            }
        })
    }

    const handleEndAssessment = (ev) => {
        ev.preventDefault();

        Swal.fire({
            title: "Are you sure you want to end assessment?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                reqEndAssessment({ prf_data: tempReq }).then((res) => {
                    if (res.data.status === 500) { toast.error(res.data.message) }
                    if (res.data.status === 200) {
                        toast.success(res.data.message)
                        if (res.data.action_upt) {
                            closeModal();
                        }
                    }
                }).catch((err) => {
                    toast.error(err.message)
                })
            }
        })
    }

    // const handleRemoveChecked = () => {
    //     // setCheckboxList([])
    //     setCounter([])
    // }

    if (loading) {
        return null
    }

    return (
        <>
            <Fragment>
                <CustomFullDialog id="assessed-applicant" openG={open === 1 || open === 2 || open === 3} handleCloseG={handleViewC} comptitle="" compSize="" minWidthP={"60%"}>
                    {open === 1 || open === 2 || open === 3 && (<ViewIAF applicantData={applicantData} disabledToggler={true} hiRecom={hiRecom} />)}
                </CustomFullDialog>

                <CustomCenterModal compSize={'30%'} comptitle={'Add next interviewer'} handleCloseBTN={() => setOpen(0)} matches={matches} openner={open === 100 || open === 101}>
                    <Stack direction={'column'} gap={1} sx={{ width: '100%' }}>
                        <Box>
                            <Button variant="contained" size="small" color="secondary" onClick={() => setOpen(101)}> Search employee </Button>
                        </Box>
                        <hr />
                        <Box sx={{ marginBottom: '1rem' }}>
                            {(!name || !position || !empId) ? <>
                                No data found
                            </> : <>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {name}
                                </Typography>
                                <Typography variant="subtitle2">
                                    {position}
                                </Typography>
                            </>}
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <Button variant="contained" color="success" size="small" onClick={(ev) => handleInsertInterviewer(ev)}> Confirm </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button variant="contained" size="small" color="error" onClick={() => setOpen(0)}> Close </Button>
                        </Box>
                    </Stack>
                </CustomCenterModal>

                <SmallModal open={open === 101} close={() => setOpen(100)} title='Searching Employee'>
                    <Box sx={{ m: 1 }}>
                        <SearchEmployee close={() => setOpen(100)} handleSearchData={handleSearchEmp} />
                    </Box>
                </SmallModal>
            </Fragment>

            <Stack gap={2}>
                <Stack spacing={1}>
                    <AppliedInfo tempReq={tempReq} />
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <ButtonViewPRF open={openViewprf} handleClickOpen={() => setOpenViewprf(true)} handleClose={() => setOpenViewprf(false)} id={'as-id'} minWidth={'65%'} />
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" onClick={handleReloadData} size="small">
                                <CachedIcon />
                            </IconButton>
                        </Box>
                        <Stack direction='row' spacing={2} alignItems={'end'}>
                            {/* {totalSelectedApp !== tempReq.head_cnt &&
                                <Tooltip title="Re-select Applicant">
                                    <IconButton className="custom-iconbutton" color="primary" aria-label="unchecked table data" onClick={handleRemoveChecked} size="small">
                                        <CheckBoxOutlineBlankIcon />
                                    </IconButton>
                                </Tooltip>
                            } */}
                            <Typography variant="body1" fontWeight={500}>
                                Head Count: {tempReq.head_cnt}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        {requestLogsList[requestLogsList.length - 1].request_stat === 'POOLED COMPLETE' &&
                            <Button variant="contained" endIcon={<ManageAccountsIcon />} size="small" color="info" onClick={(ev) => handleAddNewInterviewer(ev)}> Add Interviewer </Button>
                        }
                        {/* {requestLogsList[requestLogsList.length - 1].request_stat === 'ON-HOLD' && (
                            <Button variant="contained" size="small" color="warning" onClick={(ev) => handleRevertPooling(ev)}> Revert Pooling Applicant </Button>
                        )} */}
                    </Box>
                </Stack>
                <TableContainerComp>
                    <TableHead>
                        <TableRow>
                            {tableHeader.map((i, indx) => (
                                <TableCell key={i.id + indx} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: i.width, backgroundColor: "#1565C0 !important" }}>
                                    {i.headerName.toUpperCase()}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(applicantAList).length > 0 ?
                            <>
                                {applicantAList.map((it, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                <Stack gap={1} alignItems='center' justifyContent="center">
                                                    {requestLogsList[requestLogsList.length - 1].request_stat === 'SELECTION COMPLETE' ?
                                                        <input
                                                            type="checkbox"
                                                            name="checkbox-aa-option"
                                                            id={it.app_id}
                                                            readOnly
                                                            checked={it.remark === 'SELECTED'}
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                        :
                                                        <input
                                                            type="checkbox"
                                                            name="checkbox-aa-option"
                                                            id={it.app_id}
                                                            readOnly
                                                            disabled={(!counter.some(c => c.app_id === it.app_id) && tempReq.head_cnt === counter.length) || totalSelectedApp === tempReq.head_cnt ? true : false}
                                                            checked={it.remark === 'SELECTED'}
                                                            onClick={(ev) => handleChangeChecked(ev, it.app_id, index)}
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                    }
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: it.remark === 'SELECTED' ? 'bold' : 'normal', color: it.remark === 'SELECTED' ? 'forestgreen' : 'black' }}>
                                                {it.lname.toUpperCase() + ", " + it.fname.toUpperCase() + ' ' + it.mname[0].toUpperCase() + "."}

                                                <Box>
                                                    <Link to={`../../recruitment/evaluate-pds/${it.app_id}:${it.is_employee === 0 ? 'applicant' : 'employee'}`} target={"_blank"}>
                                                        View PDS
                                                    </Link>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack gap={1} sx={{ overflowY: 'scroll', height: '135px' }}>
                                                    {raterList.filter((m) => m.id === it.id).map((ii) => {
                                                        const getBtn = btnSelection(ii);
                                                        return (
                                                            getBtn.raterLvl !== 500 && (<Button variant="contained" color={ii.assessed_at === null ? 'warning' : 'primary'} size="small" onClick={(ev) => handleViewClick(ev, getBtn.clickTrig, getBtn.applicantDetails)}> {getBtn.raterLvl}  </Button>)
                                                        )
                                                    })}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </>
                            :
                            <NoDataFound spanNo={Object.keys(tableHeader).length} />
                        }
                    </TableBody>
                </TableContainerComp>
                <Box>
                    {raterList.filter((f) => f.assessed_at === null).length > 0 ? <>
                        <Button variant="contained" disabled sx={{ float: 'right', clear: 'both' }}> Pending </Button>
                    </> : <>
                        {requestLogsList[requestLogsList.length - 1].request_stat === 'POOLED COMPLETE' && (
                            <Button variant='contained' sx={{ float: 'right', clear: 'both' }} onClick={(ev) => handleEndAssessment(ev)} > End Assessment </Button>
                        )}
                    </>}

                    {totalSelectedApp !== tempReq.head_cnt ? <>
                        {requestLogsList[requestLogsList.length - 1].request_stat === 'ASSESSMENT COMPLETE' && (<>
                            <Tooltip title="Notify and complete selection of applicant">
                                <Button variant='contained' color="success" startIcon={<NotificationsIcon />} sx={{ float: 'right', clear: 'both' }} onClick={(ev) => handleSubmitSList(ev)}> submit </Button>
                            </Tooltip>
                        </>)}
                    </> : <>
                        <Button variant='contained' disabled sx={{ float: 'right', clear: 'both' }}> PENDING </Button>
                    </>}
                </Box>
            </Stack>
        </>
    )
}

export default ApplicantSelection
