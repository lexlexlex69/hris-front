import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Container, FormControl, FormGroup, FormLabel, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Fragment, useContext, useEffect, useMemo, useState } from "react"
import { PrfStateContext } from "../PrfProvider"
import { getBIAssessment, getExamResult, getInterviewAssessment, insertHiringRecom, updateBIAssessment, updateExamResult, updateInterviewAssessment } from "../axios/prfPooling"
import { isEmptyObject } from "jquery"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { QCBody, QCHeader } from "./component/QCComponent"
import { ExamOption, ExamRemark } from "./component/ExamComponent"
import { BIOtherRemarks, BIPotentialStrengths, BIRedFlags } from "./component/BIComponent"
import ViewHiRe from "./background_investigation/ViewHiRe"

let steppers = []

function AssessedApplicant({ closeModal, applicantData, type }) {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const [tempInt, setTempInt] = useState([]);
    const [tempExam, setTempExam] = useState(false);
    const [tempExamRes, setTempExamRes] = useState([]);
    const [tempBInv, setTempBInv] = useState([]);
    const [hiRecom, setHiRecom] = useState({
        hiring_recom: '', overall_recom: '',
    });

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
        if (applicantData.rater_id) {
            handleReloadData()
        }
    }, [applicantData])

    const handleReloadData = () => {
        setLoading(true)
        enqueueRequest(async () => {
            try {
                const [res, res2, res3] = await Promise.all([
                    getInterviewAssessment(applicantData, applicantData.id),
                    getExamResult(applicantData, applicantData.id),
                    getBIAssessment(applicantData, applicantData.id, applicantData.rater_id)
                ])

                if (res.data.status === 200) {
                    if (!isEmptyObject(res.data.interview_res)) {
                        setTempInt({
                            radio_qualifications1: res.data.interview_res.qua_comp1,
                            radio_qualifications2: res.data.interview_res.qua_comp2,
                            radio_qualifications3: res.data.interview_res.qua_comp3,
                            radio_qualifications4: res.data.interview_res.qua_comp4,
                            radio_qualifications5: res.data.interview_res.qua_comp5,
                            radio_qualifications6: res.data.interview_res.qua_comp6,
                            radio_qualifications7: res.data.interview_res.qua_comp7,
                            radio_qualifications8: res.data.interview_res.qua_comp8,
                            radio_qualifications9: res.data.interview_res.qua_comp9,
                            radio_qualifications10: res.data.interview_res.overall_rate,
                        })
                    }
                    // console.log(res.data.exam_res, isEmptyObject(res.data.exam_res), res.data.exam_res === '', res.data.exam_res === undefined, res.data.exam_res === null)
                    if (isEmptyObject(res.data.exam_res) || res.data.exam_res === '') {
                        setTempExam(false)
                    } else {
                        setTempExam(true)
                    }
                }
                if (res2.data.status === 200) {
                    // if (!isEmptyObject(res2.data.exam_res) || !res2.data.exam_res) {
                    // } else {
                    // }
                    setTempExamRes({
                        exam_result: res2.data.exam_res.exam_result,
                        exam_remark: res2.data.exam_res.exam_remark,
                    })
                }
                if (res3.data.status === 200) {
                    setTempBInv({
                        potential_strengths: res3.data.bi_res.potential_strengths,
                        red_flags: res3.data.bi_res.red_flags,
                        other_remarks: res3.data.bi_res.other_remarks,
                        remark: res3.data.bi_res.remark,
                    })
                }
            } catch (err) {
                toast.error(err.message)
            }
            finally {
                setLoading(false)
                // handleSetStep();
            }
        })
    }

    useEffect(() => {
        // console.log(tempExam, tempExamRes, type)
        if (type) {
            // HUMAN RESOURCES
            if (tempExam) {
                steppers = ['Qualifications and Competencies', 'Examination', 'Background Investigation',]
                // setActiveStep(3)
            } else {
                steppers = ['Qualifications and Competencies', 'Background Investigation',]
                // setActiveStep(2)
            }
        } else {
            // IMMEDIATE HEAD OR NEXT LEVEL HEAD
            if (tempExam) {
                // setActiveStep(4)
                steppers = ['Qualifications and Competencies', 'Examination', 'Background Investigation', 'Hiring Recommendation',]
            } else {
                steppers = ['Qualifications and Competencies', 'Background Investigation', 'Hiring Recommendation',]
                // setActiveStep(3)
            }
        }
    }, [tempExam])

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleClickStep = (ev, step) => {
        ev.preventDefault();
        setActiveStep(step)
    }

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };


    const handleSubmitChanges = (ev, type) => {
        ev.preventDefault();
        ev.stopPropagation();
        let payload = {}

        switch (type) {
            case 1:
                // qualification and competencies
                payload.prf_data = applicantData;
                payload.rating1 = tempInt.radio_qualifications1;
                payload.rating2 = tempInt.radio_qualifications2;
                payload.rating3 = tempInt.radio_qualifications3;
                payload.rating4 = tempInt.radio_qualifications4;
                payload.rating5 = tempInt.radio_qualifications5;
                payload.rating6 = tempInt.radio_qualifications6;
                payload.rating7 = tempInt.radio_qualifications7;
                payload.rating8 = tempInt.radio_qualifications8;
                payload.rating9 = tempInt.radio_qualifications9;
                payload.rating10 = tempInt.radio_qualifications10;

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
                        enqueueRequest(async () => {
                            try {
                                const res = await updateInterviewAssessment(payload, applicantData.id);
                                if (res.data.status === 200) { toast.success(res.data.message) }
                                if (res.data.status === 500) { toast.error(res.data.message) }
                                handleReloadData();
                            } catch (error) {
                                toast.error(error.message)
                            }
                        })
                    }
                });
                break;
            case 2:
                // examination
                payload.prf_data = applicantData;
                payload.exam_result = tempExamRes.exam_result
                payload.exam_remark = tempExamRes.exam_remark

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
                        enqueueRequest(async () => {
                            try {
                                const res = await updateExamResult(payload, applicantData.id);
                                if (res.data.status === 200) { toast.success(res.data.message) }
                                if (res.data.status === 500) { toast.error(res.data.message) }
                                handleReloadData();
                            } catch (error) {
                                toast.error(error.message)
                            }
                        })
                    }
                });
                break;
            case 3:
                // background investigation
                payload.potential_strengths = tempBInv.potential_strengths
                payload.red_flags = tempBInv.red_flags
                payload.other_remarks = tempBInv.other_remarks
                payload.remark = tempBInv.remark
                payload.data = applicantData

                if (!tempBInv.other_remarks || !tempBInv.potential_strengths || !tempBInv.red_flags) {
                    return toast.warning("Please fill in the fields that are required")
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
                        // submitDataBI(payload);
                        enqueueRequest(async () => {
                            try {
                                const res = await updateBIAssessment(payload);
                                if (res.data.status === 200) { toast.success(res.data.message) }
                                if (res.data.status === 500) { toast.error(res.data.message) }
                                handleReloadData();
                            } catch (error) {
                                toast.error(error.message)
                            }
                        })
                    }
                });
                break;
            case 4:
                if (!hiRecom.overall_recom || !hiRecom.hiring_recom) {
                    return toast.warning('Please select an option for overall recommendation.')
                }

                payload.data = applicantData;
                payload.hiring_recom = hiRecom.hiring_recom;
                payload.overall_recom = hiRecom.overall_recom;

                Swal.fire({
                    title: "Are you done with your assessment?",
                    text: "",
                    icon: "info",
                    showCancelButton: true,
                    cancelButtonColor: "#d33",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Submit",
                }).then((result) => {
                    if (result.isConfirmed) {
                        enqueueRequest(async () => {
                            try {
                                const res = await insertHiringRecom(payload, applicantData.rater_id);
                                if (res.data.status === 200) {
                                    toast.success(res.data.message)
                                    closeModal();
                                } else {
                                    toast.error(res.data.message)
                                }
                            } catch (error) {
                                toast.error(error.message);
                            }
                        });
                    }
                });
                break;

            default:
                toast.warning('Ops, something went wrong!')
                break;
        }
    }

    return (
        loading ? (
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading} >
                <Stack gap={2} justifyContent='center' alignItems='center' >
                    <CircularProgress color="inherit" />
                    <Box>
                        Fetching data. please wait...
                    </Box>
                </Stack>
            </Backdrop>
        ) : (
            <Box sx={{ width: '100%', height: '80vh', padding: '0' }}>
                <Container sx={{ marginBottom: "2rem" }}>
                    <Stepper activeStep={activeStep}>
                        {steppers.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps} sx={{ cursor: 'pointer' }} onClick={(ev) => handleClickStep(ev, index)}>
                                    <StepLabel {...labelProps}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {/* )} */}
                </Container>
                <Container>
                    {type === true ?
                        steppers.length === 3 ?
                            // ['Qualifications and Competencies', 'Examination', 'Background Investigation',]
                            // :
                            // ['Qualifications and Competencies', 'Background Investigation',]
                            <>
                                {activeStep + 1 === 1 ? (
                                    <QualificationCompetencyComp examSelector={tempInt} setExamSelector={setTempInt} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 1)} />
                                ) : activeStep + 1 === 2 ? (
                                    <ExamComp tempExamRes={tempExamRes} setTempExamRes={setTempExamRes} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 2)} />
                                ) : activeStep + 1 === 3 ? (
                                    <BackgroundInvComp BIData={tempBInv} setBIData={setTempBInv} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 3)} />
                                ) : (
                                    <></>
                                )}
                            </>
                            :
                            <>
                                {activeStep + 1 === 1 ? (
                                    <QualificationCompetencyComp examSelector={tempInt} setExamSelector={setTempInt} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 1)} />
                                ) : activeStep + 1 === 2 ? (
                                    <BackgroundInvComp BIData={tempBInv} setBIData={setTempBInv} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 3)} />
                                ) : (
                                    <></>
                                )}
                            </>
                        :
                        steppers.length === 4 ?
                            // ['Qualifications and Competencies', 'Examination', 'Background Investigation', 'Hiring Recommendation',]
                            // :
                            // ['Qualifications and Competencies', 'Background Investigation', 'Hiring Recommendation',]
                            <>
                                {activeStep + 1 === 1 ? (
                                    <QualificationCompetencyComp examSelector={tempInt} setExamSelector={setTempInt} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 1)} />
                                ) : activeStep + 1 === 2 ? (
                                    <ExamComp tempExamRes={tempExamRes} setTempExamRes={setTempExamRes} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 2)} />
                                ) : activeStep + 1 === 3 ? (
                                    <BackgroundInvComp BIData={tempBInv} setBIData={setTempBInv} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 3)} />
                                ) : activeStep + 1 === 4 ? (
                                    <ViewHiRe data={hiRecom} setData={setHiRecom} disabled={false}  >
                                        <Box sx={{ float: "right", clear: "both" }}>
                                            <Button variant="contained" color="success" onClick={(ev) => handleSubmitChanges(ev, 4)} > Submit </Button>
                                        </Box>
                                    </ViewHiRe>
                                ) : (
                                    <></>
                                )}
                            </>
                            :
                            <>
                                {activeStep + 1 === 1 ? (
                                    <QualificationCompetencyComp examSelector={tempInt} setExamSelector={setTempInt} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 1)} />
                                ) : activeStep + 1 === 2 ? (
                                    <BackgroundInvComp BIData={tempBInv} setBIData={setTempBInv} applicantData={applicantData} handleReloadData={handleReloadData} handleSubmitBTN={(ev) => handleSubmitChanges(ev, 3)} />
                                ) : activeStep + 1 === 3 ? (
                                    <ViewHiRe data={hiRecom} setData={setHiRecom} disabled={false}  >
                                        <Box sx={{ float: "right", clear: "both" }}>
                                            <Button variant="contained" color="success" onClick={(ev) => handleSubmitChanges(ev, 4)} > Submit </Button>
                                        </Box>
                                    </ViewHiRe>
                                ) : (
                                    <></>
                                )}
                            </>
                    }

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 6 }}>
                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} > Back </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {activeStep + 1 < steppers.length ? (
                            <Button onClick={handleNext}> Next </Button>
                        ) : (
                            <Button onClick={handleReset}>Reset</Button>
                        )}
                    </Box>
                </Container>
            </Box >
        )
    )
}

export default AssessedApplicant

function QualificationCompetencyComp({ examSelector, setExamSelector, applicantData, handleReloadData, handleSubmitBTN }) {
    const handleChange = (ev) => {
        const { value, name, id } = ev.target
        console.log(value, name, id)
        setExamSelector({ ...examSelector, [name]: value });
    }
    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Grid2 container spacing={2}>
                        <Grid2 item xs={12} lg={12}>
                            <QCHeader />
                        </Grid2>
                        <Grid2 item xs={12} lg={12}>
                            <QCBody selectedValue={examSelector} handleChange={handleChange} disabledTog={false} />
                        </Grid2>
                        <Grid2 item xs={12} lg={12}>
                            <Box>
                                <Button variant="contained" color="success" sx={{ float: "right", }} onClick={handleSubmitBTN}> Update </Button>
                            </Box>
                        </Grid2>
                    </Grid2 >
                </CardContent>
            </Card >
        </>
    )
}

function ExamComp({ tempExamRes, setTempExamRes, applicantData, handleReloadData, handleSubmitBTN }) {
    const handleChangeExamRes = (ev) => {
        const { value } = ev.target
        setTempExamRes({ ...tempExamRes, exam_result: value })
    }
    const handleChangeExamRem = (ev) => {
        const { value } = ev.target
        setTempExamRes({ ...tempExamRes, exam_remark: value })
    }
    return (
        <Card>
            <CardContent>
                <Stack gap={2}>
                    <Box>
                        <ExamOption examSelector={tempExamRes.exam_result} handleChange={handleChangeExamRes} disabledTog={false} />
                    </Box>
                    <Stack>
                        <ExamRemark examRemark={tempExamRes.exam_remark} handleChange={handleChangeExamRem} disabledTog={false} />
                    </Stack>
                </Stack>

                <Stack gap={1} direction="row" justifyContent='end' sx={{ padding: '1rem 0rem', }}>
                    <Button variant="contained" color="success" onClick={handleSubmitBTN}> Update </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

function BackgroundInvComp({ BIData, setBIData, applicantData, handleReloadData, handleSubmitBTN }) {
    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Grid2 container spacing={2}>
                        <BIPotentialStrengths potentialData={BIData.potential_strengths} handleChange={(ev) => setBIData({ ...BIData, potential_strengths: ev.target.value })} disabledTog={false} />
                        <BIRedFlags redFlagsData={BIData.red_flags} handleChange={(ev) => setBIData({ ...BIData, red_flags: ev.target.value })} disabledTog={false} />
                        <BIOtherRemarks otherData={BIData} setOtherData={setBIData} disabledTog={false} />

                        <Grid2 item xs={12} lg={12}>
                            <Box>
                                <Button variant="contained" color="success" sx={{ float: "right", clear: "both" }} onClick={handleSubmitBTN}> Update </Button>
                            </Box>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </>
    )
}
