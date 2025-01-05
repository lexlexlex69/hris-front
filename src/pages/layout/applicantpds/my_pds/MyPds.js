import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { Grid, Box, Card, CardContent, Typography, Tooltip, CssBaseline, Button, TextField } from '@mui/material'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';

// images
import { blue, green, red } from '@mui/material/colors'
// mui icons
import PersonPinIcon from '@mui/icons-material/PersonPin';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SchoolIcon from '@mui/icons-material/School';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const steps = [
    {
        label: 'I. PERSONAL INFORMATION',
        content: <PersonalInfo />
    },
    {
        label: 'II. FAMILY BACKGROUND',
        content: <FamilyBackground />
    },
    {
        label: 'III. EDUCATIONAL BACKGROUND',
        content: <EducBackground/>
    },
    {
        label: 'IV. ELIGIBILITY',
        content: <Eligibility/>
    },
    {
        label: 'V. WORK EXPERIENCE',
        content: <WorkExperience/>
    },
    {
        label: 'VI. VOLUNTARY WORK ON INVOLMENT IN CIVIC/NON-GOVERNMENT/PEOPLE/VOLUNTARY ORGANIZATION/S',
        content: <VoluntaryWork/>
    },
    {
        label: 'VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAM ATTENDED',
        content: <Trainings/>
    },
    {
        label: 'VIII. OTHER INFORMATION',
        content: <OtherInfo/>
    },
];

function MyPds() {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // redux
    const darkmodeRedux = useSelector(state => state.darkmode.value)
    // redux
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    return (
        <Box sx={{ maxWidth: '100%', px: 2 }}>
            <Button variant='contained'><SimCardDownloadIcon/>&nbsp;Download Pds </Button>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography variant="caption" sx={{ color: darkmodeRedux ? '#fff' : '#242526' }}>Last step</Typography>
                                ) : null
                            }
                        >
                            <Typography sx={{ color: darkmodeRedux ? '#fff' : '#242526' }}>{step.label}</Typography>
                        </StepLabel>
                        <StepContent>
                            <Box>{step.content}</Box>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
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
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    )
}

export default MyPds