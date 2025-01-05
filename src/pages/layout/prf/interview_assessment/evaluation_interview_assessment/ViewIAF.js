import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Container, Paper, Stack, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { questionsDataIAF } from "../qualifications_competencies/QualificationsCompetencies"

import { grey, red } from '@mui/material/colors';
import { Fragment, useEffect, useState } from "react";
import { getBIAssessment, getExamResult, getInterviewAssessment } from "../../axios/prfPooling";
import { toast } from "react-toastify";
import { isEmptyObject } from "jquery";
import { Link } from "react-router-dom";
import { QCBody, QCHeader } from "../component/QCComponent";
import { ExamOption, ExamRemark } from "../component/ExamComponent";
import { BIOtherRemarks, BIPotentialStrengths, BIRedFlags } from "../component/BIComponent";
import ViewHiRe from "../background_investigation/ViewHiRe";

const steppers = [
  ['Qualifications and Competencies', 'Background Investigation',],
  ['Qualifications and Competencies', 'Examination', 'Background Investigation',],
]

function ViewIAF({ applicantData, disabledToggler, hiRecom = {}, }) {
  const [loading, setLoading] = useState(true)
  const [tempInt, setTempInt] = useState([]);
  const [tempExam, setTempExam] = useState('0');
  const [tempExamRes, setTempExamRes] = useState([]);
  const [tempBInv, setTempBInv] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

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


  // console.log(applicantData)
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
          // console.log(res.data.exam_res)
          if (!isEmptyObject(res.data.exam_res) || res.data.exam_res !== '') {
            setTempExam('1')
          } else {
            setTempExam('0')
          }
        }
        if (res2.data.status === 200) {
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
        // console.log(tempInt, tempExamRes, tempBInv)
        setLoading(false)
      }
    })
  }

  // if (loading) {
  //   return null
  // }



  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

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

  const handleClickStep = (ev, step) => {
    ev.preventDefault();
    setActiveStep(step)
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
      <>
        <Container>
          <Stack direction="row" sx={{ margin: "2rem 0rem 1.75rem 0rem" }}>
            <Stack gap={0}>
              <Typography variant="body1" fontWeight={500}> Candidate name: {applicantData.lname.toUpperCase() + ", " + applicantData.fname.toUpperCase() + ' ' + applicantData.mname[0].toUpperCase() + "."} </Typography>
              <Typography variant="body1" fontWeight={500}> Position Applied For: {applicantData.position_title} </Typography>
              <Typography variant="body1" fontWeight={500}> Area of Assignment:  </Typography>
              <ul>
                <li> {applicantData.div_name} </li>
                <li> {applicantData.sec_name} </li>
                <li> {applicantData.unit_name} </li>
              </ul>
            </Stack>
            <Box sx={{ flex: '1 1 auto' }} />
            {/* <Button variant="contained" color="info" type="button" size="small" sx={{ width: "100%" }}> */}
            <Box>
              <Link to={`../../recruitment/evaluate-pds/${applicantData.app_id}:${applicantData.is_employee === 1 ? 'employee' : 'applicant'}`} target={"_blank"} rel="noopener noreferrer" sx={{ textDecoration: "none", }}>
                View PDS
              </Link>
            </Box>
            {/* </Button> */}
          </Stack>

          <Box sx={{ paddingTop: '1rem', paddingBottom: '1rem', height: '80vh' }}>
            <Box sx={{ marginBottom: '1rem' }}>
              {tempExam && (
                <Stepper activeStep={activeStep}>
                  {steppers[Number(tempExam)].map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps} sx={{ cursor: 'pointer' }} onClick={(ev) => handleClickStep(ev, index)}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              )}
            </Box>

            {/* {console.log(steppers[Number(tempExam)].length)} */}
            <Box>
              {steppers[Number(tempExam)].length === 2 && (
                <>
                  {activeStep + 1 === 1 ? (
                    <QualificationCompetencyComp examSelector={tempInt} disabled={disabledToggler} />
                  ) : activeStep + 1 === 2 ? (
                    <BackgroundInvComp BIData={tempBInv} disabled={disabledToggler} />
                  ) : (
                    <></>
                  )}
                </>
              )}
              {steppers[Number(tempExam)].length === 3 && (
                <>
                  {activeStep + 1 === 1 ? (
                    <QualificationCompetencyComp examSelector={tempInt} disabled={disabledToggler} />
                  ) : activeStep + 1 === 2 ? (
                    <ExamComp tempExamRes={tempExamRes} disabled={disabledToggler} />
                  ) : activeStep + 1 === 3 ? (
                    <BackgroundInvComp BIData={tempBInv} disabled={disabledToggler} />
                  ) : (
                    <></>
                  )}
                </>
              )}


              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 6, }}>
                <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} > Back </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep + 1 < steppers[Number(tempExam)].length ? (
                  <Button onClick={handleNext}> Next </Button>
                ) : (
                  <Button onClick={handleReset}>Reset</Button>
                )}
              </Box>

              {Object.keys(hiRecom).length > 0 && (
                !(hiRecom.overall_recom === '' || hiRecom.overall_recom === null) && (
                  <Box sx={{ padding: '1rem 0rem 2rem 0rem' }}>
                    <ViewHiRe data={hiRecom} disabled={disabledToggler} />
                  </Box>
                )
              )}

              {/* <iframe src={`../homepage/recruitment/evaluate-pds/${applicantData.app_id}:${applicantData.is_employee === 1 ? 'employee' : 'applicant'}`} title="Applicant View PDS" loading="lazy" style={{ height: "500px", width: "100%" }}></iframe> */}
            </Box>
          </Box >
        </Container >
      </>
    )
  )
}

export default ViewIAF

function QualificationCompetencyComp({ examSelector, disabled }) {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Stack gap={2}>
            <QCHeader />
            <QCBody selectedValue={examSelector} disabledTog={disabled} />
          </Stack >
        </CardContent>
      </Card >
    </>
  )
}

function ExamComp({ tempExamRes, disabled }) {
  return (
    <Card>
      <CardContent>
        <Stack gap={2}>
          <ExamOption examSelector={tempExamRes.exam_result} disabledTog={disabled} />
          <ExamRemark examRemark={tempExamRes.exam_remark} disabledTog={disabled} />
        </Stack>
      </CardContent>
    </Card>
  )
}

function BackgroundInvComp({ BIData, disabled }) {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Stack gap={2}>
            <BIPotentialStrengths potentialData={BIData.potential_strengths} disabledTog={disabled} />
            <BIRedFlags redFlagsData={BIData.red_flags} disabledTog={disabled} />
            <BIOtherRemarks otherData={BIData} disabledTog={disabled} />
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}