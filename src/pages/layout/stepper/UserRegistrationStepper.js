import React,{useEffect,useState,useRef} from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { Container } from "@mui/material";

import AccountVerification from '../userregistration/AccountVerification';
import UserInformation from "../userregistration/UserInformation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

// email validator
import * as EmailValidator from 'email-validator';

//sweetalert2
import Swal from 'sweetalert2';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// images
import BL from '../../../assets/img/bl.png'

// axios request
import { saveUserInformation,verifyUserAccount,loginRequest } from "./UserRegistrationRequest";

// use login redux
import { getLoginVerified } from "../../../redux/slice/emailVerificationSlice";

export default function UserRegistrationStepper(){
  console.log('rendered')
    const [activeStep, setActiveStep] = React.useState(0);
    const email = useSelector((state)=>state.emailVerification.email)
    const verified = useSelector((state)=>state.emailVerification.isVerified)
    const dispatch = useDispatch(); 
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // appbar ref
    const appbarRef = useRef(null)
    const [appbarState, setAppbarState] = useState('')
    // navigate
    const navigate = useNavigate()

    
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const resendCode = () => {
      alert('Code Resend')
    }
    const steps = [
        {
          label: 'User Information',
          content:
            <UserInformation
            handleNext = {handleNext}
            />
        },
        {
          label: 'Account Verification',
          content:
          <AccountVerification
            resendCode = {resendCode}
            handleBack = {handleBack}
          />
        }
      ];
      useEffect(() => {
        setAppbarState(appbarRef.current.clientHeight)
        console.log(appbarRef.current.clientHeight)
    }, [appbarRef])
    return(
      <React.Fragment>
      <AppBar position="static" ref={appbarRef}>
            <Toolbar sx={{ p: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <img src={BL} alt="" width={70} sx={{ m: 1 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Human Resource Information System
                </Typography>
                <Button color="inherit" onClick = {() => {
                  window.location.href = "/"
                }}>Login</Button>
            </Toolbar>
        </AppBar>
      <Container maxWidth = "sm">
        <Stepper activeStep={activeStep} orientation="vertical" sx={{'paddingTop':'20px'}}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {/* <Typography>{step.description}</Typography> */}
                {step.content}
                {/* <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Verify' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box> */}
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
        </Container>
      </React.Fragment>

    )
}