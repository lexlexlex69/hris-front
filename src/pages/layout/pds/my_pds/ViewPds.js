import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { useParams, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import { useReactToPrint } from 'react-to-print';

// images
import { blue, green, red, yellow } from '@mui/material/colors'
// mui icons
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';

// redux
import { useSelector } from 'react-redux'

// components
import PersonalInfo from '../personal_info/PersonalInfo'
import FamilyBackground from '../family_background/FamilyBackground'
import EducBackground from '../educ_background/EducBackground'
import Eligibility from '../eligibility/Eligibility'
import WorkExperience from '../work_experience/WorkExperience'
import VoluntaryWork from '../voluntary_work/VoluntaryWork'
import Trainings from '../trainings/Trainings'
import OtherInfo from '../other_info/OtherInfo';
import PrintPds from '../customComponents/PrintPds';
import Warning from '../customComponents/Warning';
import axios from 'axios';
import { toast } from 'react-toastify';

// icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WorkIcon from '@mui/icons-material/Work';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

import PrivacyNotice from '../../../../common/PrivacyNotice';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Swal from 'sweetalert2'

const steps = [
    {
        label: 'I. PERSONAL INFORMATION',
        content: <PersonalInfo />,
        icon: <AccountBoxIcon fontSize="large" />
    },
    {
        label: 'II. FAMILY BACKGROUND',
        content: <FamilyBackground />,
        icon: <FamilyRestroomIcon fontSize="large" />
    },
    {
        label: 'III. EDUCATIONAL BACKGROUND',
        content: <EducBackground />,
        icon: <SchoolIcon fontSize="large" />
    },
    {
        label: 'IV. ELIGIBILITY',
        content: <Eligibility />,
        icon: <ArticleIcon fontSize="large" />
    },
    {
        label: 'V. WORK EXPERIENCE',
        content: <WorkExperience />,
        icon: <WorkIcon fontSize="large" />
    },
    {
        label: 'VI. VOLUNTARY WORK ON INVOLMENT IN CIVIC/NON-GOVERNMENT/PEOPLE/VOLUNTARY ORGANIZATION/S',
        content: <VoluntaryWork />,
        icon: <VolunteerActivismIcon fontSize="large" />
    },
    {
        label: 'VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAM ATTENDED',
        content: <Trainings />,
        icon: <WorkspacePremiumIcon fontSize="large" />
    },
    {
        label: 'VIII. OTHER INFORMATION',
        content: <OtherInfo />,
        icon: <HelpOutlineIcon fontSize="large" />
    },
];

function ViewPds() {
    // modal
    const navigate = useNavigate()
    const pdsParam = useParams()
    // for privacy modal
    const [openPrivacy, setOpenPrivacy] = useState(false)
    const [privacyCheck, setPrivacyCheck] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [showMessage, setShowMessage] = useState(false)
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

    const divRef = useRef(null)
    const componentRef = useRef();
    const [personalInfo, setPersonalInfo] = useState('')
    const [address, setAddress] = useState('')
    const [family, setFamily] = useState('')
    const [children, setChildren] = useState('')
    const [education, setEducation] = useState('')
    const [defaultEducation, setDefaultEducation] = useState('')
    const [eligibility, setEligibility] = useState('')
    const [workExp, setWorkExp] = useState('')
    const [voluntary, setVoluntary] = useState('')
    const [training, setTraining] = useState('')
    const [specialSkills, setSpecialSkills] = useState('')
    const [recognition, setRecognition] = useState('')
    const [organization, setOrganization] = useState('')
    const [govId, setGovId] = useState('')
    const [nNumberOthers, setNNumberOthers] = useState(0)
    const [references, setReferences] = useState('')
    const [_34_40, set_34_40] = useState('')

    // functions

    const handleClosePrivacy = () => {
        navigate(-1)
    }

    const handleSubmitPrivacy = async () => {
        let controller = new AbortController()
        Swal.fire({
            text: 'Saving request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/user/confirmPrivacyChecker`)
        Swal.close()
        if (res.data.status === 200) {
            setOpenPrivacy(false)
            toast.success('Privacy Notice confirmed!')
            privacyChecker(controller)
        }
        else {
            toast.success(res.data.message)
        }
    }
    // 

    const handleOpen = () => {
        localStorage.setItem('first_open_pds', 0)
        setOpen(true)
    };
    const handleClose = () => {
        if (showMessage) {
            localStorage.setItem('first_open_pds', 1)
        }
        setOpen(false)
    };


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

    const printTrigger = () => {
        Swal.fire({
            text: "When printing your personal data sheet, please select 'legal paper size' in your printer's print dialog box.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: 'Processing, please wait . . .',
                    icon: 'info'
                })
                Swal.showLoading()
                axios.post(`/api/pds/print/getPersonalInformation${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    .then(res => {
                        setPersonalInfo(res.data.personal_information)
                        setAddress(res.data.address)
                        return axios.post(`/api/pds/print/getFamilyBackground${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        setFamily(res.data.family)
                        setChildren(res.data.children)
                        return axios.post(`/api/pds/print/getEligibility${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        setEligibility(res.data.eligibility)
                        return axios.post(`/api/pds/print/getEducation${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        let sortedList = res.data.education.sort((a, b) => a.order - b.order)
                        let elem = sortedList.filter(item => item.elevel.toUpperCase() === 'ELEMENTARY')[0] || []
                        let second = sortedList.filter(item => item.elevel.toUpperCase() === 'SECONDARY')[0] || []
                        let voca = sortedList.filter(item => item.elevel.toUpperCase() === 'VOCATIONAL/TRADE COURSE')[0] || []
                        let col = sortedList.filter(item => item.elevel.toUpperCase() === 'COLLEGE').slice(0, 3) || []
                        let gradStud = sortedList.filter(item => item.elevel.toUpperCase() === 'GRADUATE STUDIES')[0] || []
                        let defaultEduc = [0]
                        defaultEduc = defaultEduc.concat(elem,second, voca, col, gradStud)
                        setDefaultEducation(defaultEduc)
                        let sortedList2 = sortedList.filter(item => !defaultEduc.map(b => b.id).includes(item.id))
                        setEducation(sortedList2)
                        return axios.post(`/api/pds/print/getWorkExp${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        setWorkExp(res.data.work_experience)
                        return axios.post(`/api/pds/print/getVoluntary${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        setVoluntary(res.data.voluntary)
                        return axios.post(`/api/pds/print/getTraining${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        setTraining(res.data.training)
                        return axios.post(`/api/pds/print/getSpecialSkills${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        let ss = res.data.skills.filter(item => item.typeid === 1)
                        let r = res.data.skills.filter(item => item.typeid === 2)
                        let o = res.data.skills.filter(item => item.typeid === 3)
                        let temph = [o.length, ss.length, r.length]
                        setSpecialSkills(ss)
                        setRecognition(r)
                        setOrganization(o)
                        setNNumberOthers(temph.sort()[2])
        
                        set_34_40(res.data._34_40)
                        setReferences(res.data.reference)
                        Swal.close()
                        return axios.post(`/api/pds/print/getGovId${pdsParam.id ? `?id=${pdsParam.id}&&category=employee`:''}`)
                    })
                    .then(res => {
                        setGovId(res.data.gov_id)
                        if (res.data.status === 200) {
                            setGovId(res.data.gov_id)
                        }
                        else if (res.data.status === 500) {
                            setGovId('')
                        }
                        handlePrint()
                    })
                    .catch(err => {
                        toast.error(err.message)
                    })
            }
          })

      
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleStepper = (index) => { // sunod pa gamiton
        //    to work dri na area, check if there are unsaved changes first before going to next tab
        setActiveStep(index)
        localStorage.setItem('hris_stepper', index)
    }

    const privacyChecker = async (controller) => {
        let res = await axios.get(`/api/user/getPrivacyChecker`, { signal: controller.abort() })
        if (res.data === 0) {
            setOpenPrivacy(true)
        }
        else {
            if (localStorage.getItem('first_open_pds') === '0' || !localStorage.getItem('first_open_pds')) {
                handleOpen()
            }
        }
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

    useEffect(() => {
        let controller = new AbortController()
        if (!pdsParam.id) {
            privacyChecker(controller)
        }
    }, [pdsParam.id])

    console.log('param',pdsParam.id)

    return (
        <Box sx={{ maxWidth: '100%', px: 2 }} ref={divRef}>
            <PrivacyNotice open={openPrivacy} privacyCheck={privacyCheck} setPrivacyCheck={setPrivacyCheck} handleClose={handleClosePrivacy} handleNext={handleSubmitPrivacy} />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '90%' : '60%',
                        bgcolor: 'background.paper',
                        borderRadius: '2rem',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography sx={{ color: 'primary.main', mt: 1, lineHeight: '3rem' }} id="transition-modal-title" variant="h5" component="h2" align="center">
                            Changes made to the pds won't take effect right away. Only after the administrator's permission will it reflect.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={showMessage} />} onChange={() => setShowMessage(prev => !prev)} label="Do not show this message again!" />
                            </FormGroup>
                            <Button variant="contained" sx={{ borderRadius: '2rem', width: '40%' }} onClick={handleClose}>Got it</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            {showUp ? (
                <Tooltip title="Scroll to top">
                    <ArrowUpwardIcon onClick={handleScrollTop} sx={{ zIndex: 700, position: 'fixed', right: { xs: 3, md: 10 }, bottom: { xs: '5%', md: '10%' }, p: 1, cursor: 'pointer', bgcolor: blue[500], opacity: .5, '&:hover': { opacity: 1, color: '#fff' }, transition: 'all .2s', borderRadius: '100%', fontSize: { xs: 40, md: 40 } }} />
                </Tooltip>
            ) : null}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box display='flex' flexDirection='column' gap={1} mb={1}>
                    <Warning title="Make sure to submit your changes!" color={red[200]} />
                    <Warning title="Do not leave any field blank or empty. Use N/A if not applicable." color={red[200]} />
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Tooltip title="Printing of pds will be available soon">
                        <Button variant='contained' color="success" sx={{ borderRadius: '2rem' }} className='cgb-color-bg-yellow' onClick={printTrigger} startIcon={<ArrowCircleDownIcon />}>print Pds </Button>
                    </Tooltip>
                    {/* onClick={printTrigger} */}
                </Box>
                <Box sx={{ display: 'none' }}>
                    <Box ref={componentRef}>
                        <PrintPds personalInfo={personalInfo || ''} address={address || ''} family={family || ''} children={children || ''} education={education || ''} eligibility={eligibility || ''} workExp={workExp || ''} voluntary={voluntary || ''} training={training || ''} specialSkills={specialSkills || ''} recognition={recognition || ''} organization={organization || ''} references={references || ''} nNumberOthers={nNumberOthers || ''} _34_40={_34_40 || ''} govId={govId} defaultEducation={defaultEducation} />
                    </Box>
                </Box>
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
                                <Button onClick={handleNextWeb} sx={{ mr: 1 }} disabled={activeStepWeb === steps.length - 1 ? true : false}>
                                    Next
                                </Button>
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

export default ViewPds