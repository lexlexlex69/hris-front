import React,{useEffect,useState,useRef,useMemo} from "react";
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
// import { getLogin } from "../../../redux/slice/login";
import { getLoginVerified } from "../../../redux/slice/emailVerificationSlice";

export default function JobApplicationStepper(){
  console.log('rerendered')
    const [activeStep, setActiveStep] = React.useState(0);
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
    /**
     * variable for user information component
     */
     const username = React.useRef(null);
     const fname = React.useRef(null);
     const mname = React.useRef(null);
     const lname = React.useRef(null);
     const password = React.useRef(null);
     const email = React.useRef(null);
    /**
     * 
     * set user information data
     */
    const handleUserInfoDataChange = (event) => {
      [event.target.name].current = event.target.value
    }

    /**
     * variable for Account Verification Component
     */
    const [code,setCode] = React.useState('');

    const handleCodeChange = (event) =>{
      setCode(event.target.value)
    }
    // const handleNext = () => {
    //   /**
    //    * If active step was User Information
    //    */
    //   if(activeStep === 0){
    //     /**
    //      * check if required data was empty
    //      */
    //     if(username.length ===0 || fname.length ===0 ||lname.length ===0 ||email.length ===0 ||password.length ===0){
    //       Swal.fire({
    //         icon:'warning',
    //         title:'Please input all required field !'
    //       })
    //     }else{
    //       /**
    //        * validate username and password length
    //        */
    //       if(username.length<5){
    //         Swal.fire({
    //           icon:'warning',
    //           title:'Username must atleast have 5 characters!'
    //         })
    //       }
    //       else if(password.length<5){
    //         Swal.fire({
    //           icon:'warning',
    //           title:'Password must atleast have 5 characters!'
    //         })
    //       }
    //       else{
    //         /**
    //          * If all field was fill out
    //          */
            
    //         /**
    //          * check if email was valid
    //          */
    //         if(EmailValidator.validate(email)){
    //           /**
    //            * check if has already click continue base on disable boolean value
    //            */
    //           if(disabled == false){
    //             Swal.fire({
    //               title: 'Do you want to save the changes?',
    //               showDenyButton: true,
    //               showCancelButton: true,
    //               confirmButtonText: 'Save',
    //               denyButtonText: `Don't save`,
    //             }).then((result) => {
    //               /**
    //                * if click save
    //                */
    //               if (result.isConfirmed) {
    //                 Swal.fire({
    //                   icon:'info',
    //                   title:'Please Wait',
    //                   html:'Sending email verification code...',
    //                   allowOutsideClick: false,
    //                   showConfirmButton:false,
    //                 })
    //                 Swal.showLoading()
    //                 /**
    //                  * save user information to DB
    //                  */
    //                 saveUserInformation(data)
    //                 .then((response) => {
    //                   if(response.data.status === 'success'){
    //                     setData({...data,disabled:true})
    //                     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //                     Swal.close();
    //                   }else if(response.data.status === 'email_used'){
    //                     Swal.fire({
    //                       icon:'error',
    //                       title:'Oops...',
    //                       html:response.data.message
    //                     })
    //                   }else{
    //                     Swal.fire({
    //                       icon:'error',
    //                       title:'Oops...',
    //                       html:response.data.message,
    //                       footer: 'Already have an account ? <a href="/"> Click here to login</a>'
    //                     })
    //                   }
    //                 }).catch((error) => {
    //                   console.log(error)
    //                 })
                  
    //               } else if (result.isDenied) {
    //                 Swal.fire('Changes are not saved', '', 'info')
    //               }
    //             })
    //           }else{
    //             setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //           }
    //         }else{
    //           Swal.fire({
    //             icon:'warning',
    //             title:'Please input a valid email address !'
    //           })
    //         }
    //       }
          
    //     }
    //   }
    //   if(activeStep === 1){
    //     if(code.length === 0){
    //       Swal.fire({
    //         icon:'warning',
    //         title:'Please input a valid code!'
    //       })
    //     }else{
    //       var data2 = {
    //         username:data.username,
    //         code:code
    //       }
    //       verifyUserAccount(data2)
    //       .then((response) => {
    //         console.log(response.data)
    //         if(response.data.status ==='success'){
    //           Swal.fire({
    //             icon:'success',
    //             title:'Successfully verified !',
    //             html:'Logging in to your account...',
    //             allowOutsideClick: false,
    //             showConfirmButton:false,
    //           })
    //           Swal.showLoading()
    //           // Swal.fire({
    //           //   icon:'success',
    //           //   title:'Successfully verified ! Redirecting to login page.'
    //           // })
    //           setTimeout(() =>
    //             dispatch(getLoginVerified({ username: data.username, password: data.password, navigate: navigate }))
    //             ,
    //             3000
    //           )
    //         }else{
    //           Swal.fire({
    //             icon:'error',
    //             title:response.data.message
    //           })

    //         }
    //       }).catch((error) => {
    //         console.log(error)
    //       })
    //     }
    //   }
        
    // };

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
            activeStep = {activeStep}
            username = {username}
            fname = {fname}
            mname = {mname}
            lname = {lname}
            password = {password}
            email = {email}
            handleUserInfoDataChange = {handleUserInfoDataChange}
            />
        },
        {
          label: 'Account Verification',
          content:
          <AccountVerification
            resendCode = {resendCode}
            handleCodeChange = {handleCodeChange}
            code = {code}
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
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      // onClick={handleNext}
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
        </Container>
      </React.Fragment>

    )
}