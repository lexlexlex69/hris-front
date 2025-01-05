import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';

// images
import { blue, green, red } from '@mui/material/colors'
// mui icons

// redux
import { useSelector } from 'react-redux'

// components
import PersonalInformation from './personalInformation/PersonalInformation';
import FamilyBackground from './familiyBackground/FamilyBackground';
import Education from '../qs/basic_pds/Education/Education';
import Eligibility from '../qs/basic_pds/Eligibility/Eligibility'
import Voluntary from './voluntaryWorks/Voluntary'
import WorkExp from '../qs/basic_pds/WorkExp/WorkExp'
import Trainings from '../qs/basic_pds/Trainings/Trainings'
import SkillsHobbies from './OtherInfo/SkillsHobbies/SkillsHobbies';
import OtherInfo from './OtherInfo/OtherInfo';

// icons
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ParaglidingIcon from '@mui/icons-material/Paragliding';
import Alert from '@mui/material/Alert';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Swal from 'sweetalert2'
import axios from 'axios'

import { PdsContext } from './MyContext';
import { CircularProgress, MenuItem } from '@mui/material';

import { read, utils, writeFile, writeFileXLSX } from 'xlsx';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const steps = [
    {
        label: 'I PERSONAL INFORMATION',
        content: <PersonalInformation />,
        icon: <AccountBoxIcon fontSize="large" />
    },
    {
        label: 'II FAMILY BACKGROUND',
        content: <FamilyBackground />,
        icon: <FamilyRestroomIcon fontSize="large" />
    },
    {
        label: 'III. EDUCATIONAL BACKGROUND',
        content: <Education />,
        icon: <SchoolIcon fontSize="large" />
    },
    {
        label: 'IV. ELIGIBILITY',
        content: <Eligibility />,
        icon: <ArticleIcon fontSize="large" />
    },
    {
        label: 'V. WORK EXPERIENCE',
        content: <WorkExp />,
        icon: <WorkIcon fontSize="large" />
    },
    {
        label: 'VI. VOLUNTARY WORK ON INVOLMENT IN CIVIC/NON-GOVERNMENT/PEOPLE/VOLUNTARY ORGANIZATION/S',
        content: <Voluntary />,
        icon: <VolunteerActivismIcon fontSize="large" />
    },
    {
        label: 'VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAM ATTENDED',
        content: <Trainings />,
        icon: <WorkspacePremiumIcon fontSize="large" />
    },
    {
        label: 'VIII SKILLS AND HOBBIES',
        content: <OtherInfo />,
        icon: <ParaglidingIcon fontSize="large" />
    },
];

function ApplicantPds({ setApplicantStatus }) {
    // for context
    const [contextId, setContextId] = useState(parseInt(localStorage.getItem('applicant_temp_id')) || '')
    const [applicantStatusContext, setApplicantStatusContext] = useState('')
    const [applicantStatusContextLoader, setApplicantStatusContextLoader] = useState(false)
    const handleContextId = (param) => setContextId(param)
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // redux
    const darkmodeRedux = useSelector(state => state.darkmode.value)

    // stepper
    const [activeStep, setActiveStep] = useState(0);
    const [showUp, setShowUp] = useState(false)
    // web stepper
    const [activeStepWeb, setActiveStepWeb] = useState(0)

    // exporting states
    const [exportLoad, setExportLoad] = useState(false)

    // functions
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        localStorage.setItem('hris_stepper', activeStep + 1)
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        localStorage.setItem('hris_stepper', activeStep - 1)
    };
    // stepper web
    const handleNextWeb = () => {
        const newActiveStep = activeStepWeb + 1;
        setActiveStepWeb(newActiveStep);
        localStorage.setItem('hris_stepper', activeStep + 1)
    };

    const handleBackWeb = () => {
        setActiveStepWeb((prevActiveStep) => prevActiveStep - 1);
        localStorage.setItem('hris_stepper', activeStepWeb - 1)
    };

    const handleStepWeb = (step) => () => {
        setActiveStepWeb(step);
    };

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleStepper = (index) => { // sunod pa gamiton
        setActiveStep(index)
        localStorage.setItem('hris_stepper', index)
    }

    const handleNewApplicant = () => {

        Swal.fire({
            title: 'Proceed creation of new applicant?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: 'applicant info.',
                    icon: 'info'
                })
                Swal.showLoading()

                setTimeout(() => {
                    Swal.close()
                    setContextId('')
                    localStorage.removeItem('applicant_temp_id')
                    setActiveStepWeb(0)
                }, 500)
            }
        })
    }

    // function exporting data
    const handleExport = async () => {
        setExportLoad(true)
        let res = await axios.get(`/api/recruitment/applicant/pds/ExportPds`)
        setExportLoad(false)
        const profiling = utils.json_to_sheet(res.data.profiling);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, profiling, "Applicant Profiling");
        writeFileXLSX(wb, `Hris_profiling_${moment(new Date()).format('MMM-DD-YY h:m:s a')}.xlsx`);
    }


    useEffect(() => {
        const handleScroll = () => {
            if (Number(window.scrollY) > (window.innerHeight / 2)) {
                setShowUp(true)
            }
            else {
                setShowUp(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return (() => window.removeEventListener('scroll', handleScroll))
    }, [])

    // fetch applicant status and save to context

    const fetchApplicantStatusForContext = async (controller) => {
        let res = await axios.get('/api/recruitment/applicant/dashboard/checkApplicantStatus', {}, { signal: controller.signal })
        setApplicantStatusContextLoader(true)
        setApplicantStatusContext(res.data.status)
    }
    useEffect(() => {
        let controller = new AbortController()
        fetchApplicantStatusForContext(controller)
    }, [])

    // open modal

    return (
        <PdsContext.Provider value={{ contextId, handleContextId, applicantStatusContext, setApplicantStatusContext }} >
            <Box sx={{ display: 'flex', gap: 1 }}>
                {applicantStatusContext === 3 && <>
                    {contextId ? (
                        <Alert
                            sx={{ flex: 1 }}
                            severity='error'
                            action={
                                <Button variant='contained' color="error" size="small" onClick={handleNewApplicant}>
                                    new applicant
                                </Button>
                            }
                        >
                            Applicant still connected!
                        </Alert>
                    ) : (
                        <Alert
                            sx={{ flex: 1 }}
                        >
                            You can input new applicant now.
                        </Alert>
                    )}
                    <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={handleExport} startIcon={exportLoad ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faFileExcel} />}>
                        Export
                    </Button>
                </>
                }

            </Box>
            <Box sx={{ maxWidth: '100%', px: 2, pt: 2 }}>
                {showUp ? (
                    <Tooltip title="Scroll to top">
                        <ArrowUpwardIcon onClick={handleScrollTop} sx={{fontSize:{xs:40,md:50}, zIndex: 700, position: 'fixed', right: 3, bottom: 3, p: 1, cursor: 'pointer', bgcolor: blue[500], opacity: .5, '&:hover': { opacity: 1, color: '#fff', boxShadow: `1px 3px 3px black` }, transition: 'all .2s', borderRadius: '100%', zIndex: 2000 }} />
                    </Tooltip>
                ) : null}
                {applicantStatusContextLoader &&
                    <>
                        {!matches ? (
                            <React.Fragment>
                                {/* web stepper */}
                                <Stepper nonLinear activeStep={activeStepWeb} sx={{ mx: 10 }}>
                                    {steps.map((stepper, index) => (
                                        <Tooltip title={stepper.label} arrow placement='top-end'>

                                            <Step key={stepper.label} >
                                                <StepButton color="inherit" onClick={handleStepWeb(index)} sx={{ mb: 0 }}>
                                                    <small>
                                                        {stepper.icon}
                                                    </small>
                                                </StepButton>
                                            </Step>
                                        </Tooltip>
                                    ))}
                                </Stepper>
                                <div>
                                    <React.Fragment>
                                        {activeStepWeb !== steps.length &&
                                            (
                                                <>
                                                    {steps[activeStepWeb].content}
                                                </>
                                            )}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'flex-start', px: 20 }}>
                                            <Button
                                                color="inherit"
                                                disabled={activeStepWeb === 0}
                                                onClick={handleBackWeb}
                                                sx={{ mr: 1 }}
                                            >
                                                Back
                                            </Button>
                                            <Box />
                                            {activeStepWeb === steps.length - 1 ? null :
                                                (
                                                    <Button onClick={handleNextWeb} sx={{ mr: 1 }} disabled={activeStepWeb === steps.length - 1 ? true : false}>
                                                        Next
                                                    </Button>
                                                )}
                                        </Box>
                                    </React.Fragment>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {/* mobile stepper */}
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel
                                            >
                                                <Typography sx={{ color: '#fff', px: 1, py: .5, bgcolor: '#62757f', cursor: 'pointer' }} onClick={() => handleStepper(index)} className={darkmodeRedux ? 'cgb-color-bg-dblue' : 'cgb-color-bg-blue'}>{step.label}</Typography>

                                            </StepLabel>
                                            <StepContent TransitionProps={{ unmountOnExit: true }}>
                                                <Box>{step.content}</Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <div>
                                                        {index === steps.length - 1 ? null : (
                                                            <Button
                                                                variant="contained"
                                                                onClick={handleNext}
                                                                sx={{ mt: 1, mr: 1 }}
                                                            >
                                                                {index === steps.length - 1 ? 'Finish' : 'Next'}
                                                            </Button>
                                                        )}

                                                        <Button
                                                            disabled={index === 0}
                                                            variant="outlined"
                                                            onClick={handleBack}
                                                            color="error"
                                                            sx={{ mt: 1, mr: 1 }}
                                                        >
                                                            Back
                                                        </Button>
                                                    </div>
                                                </Box>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                                {activeStep === steps.length && (
                                    <Paper square elevation={0} sx={{ p: 3 }}>
                                        <Typography>All steps completed - you&apos;re finished</Typography>
                                    </Paper>
                                )}
                            </React.Fragment>
                        )
                        }
                    </>}

            </Box >
        </PdsContext.Provider>
    )
}

export default React.memo(ApplicantPds)