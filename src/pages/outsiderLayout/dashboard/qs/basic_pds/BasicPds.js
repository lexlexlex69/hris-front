import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import Grid from '@mui/material/Grid';
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
import Education from './Education/Education';
import Eligibility from './Eligibility/Eligibility'
import WorkExp from './WorkExp/WorkExp'
import Trainings from './Trainings/Trainings'

// icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EastIcon from '@mui/icons-material/East';
import Alert from '@mui/material/Alert';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Swal from 'sweetalert2'
import axios from 'axios'


const steps = [
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
        label: 'VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAM ATTENDED',
        content: <Trainings />,
        icon: <WorkspacePremiumIcon fontSize="large" />
    },
];

function BasicPds({ setApplicantStatus }) {

    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // redux
    const darkmodeRedux = useSelector(state => state.darkmode.value)

    // stepper
    const [activeStep, setActiveStep] = useState(localStorage.getItem('hris_stepper') ? Number(localStorage.getItem('hris_stepper')) : 0);
    const [showUp, setShowUp] = useState(false)
    // web stepper
    const [activeStepWeb, setActiveStepWeb] = useState(localStorage.getItem('hris_stepper') ? Number(localStorage.getItem('hris_stepper')) : 0)

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

    const handleFinishStep = async () => {
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info',
            allowOutsideClick: false
        })
        Swal.showLoading()

        let res = await axios.post(`/api/recruitment/qs/doneQsBasics`)

        if (res.data.status === 200) {
            setApplicantStatus(1)
        }

        if (res.data.status === 500) {

        }

        Swal.close()

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

    // open modal

    return (
        <Box sx={{ maxWidth: '100%', px: 2 }}>
            {showUp ? (
                <Tooltip title="Scroll to top">
                    <ArrowUpwardIcon onClick={handleScrollTop} sx={{ zIndex: 700, position: 'fixed', right: 3, bottom: 3, p: 1, cursor: 'pointer', bgcolor: blue[500], opacity: .5, '&:hover': { opacity: 1, color: '#fff', boxShadow: `1px 3px 3px black` }, transition: 'all .2s', borderRadius: '.5rem', zIndex: 2000 }} />
                </Tooltip>
            ) : null}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', mb: .5 }}>
                <Alert severity="warning" sx={{ width: '100%' }}>Please fill-up the following, for us to determine, which position suits you. Thank you!</Alert>
            </Box>
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

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {activeStepWeb === steps.length - 1 ? (
                                        <Button variant='contained' endIcon={<EastIcon />} onClick={handleFinishStep}> Finished this step, Proceed</Button>
                                    ) : null}
                                </Box>

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



        </Box >
    )
}

export default React.memo(BasicPds)