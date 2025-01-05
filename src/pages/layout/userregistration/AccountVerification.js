import React, { useEffect } from "react";
import { Box, Tooltip, TextField, Button } from '@mui/material'
import { verifyUserAccount } from "./stepper/UserRegistrationRequest";
import { getLoginVerified } from "../../../redux/slice/emailVerificationSlice";
import Swal from "sweetalert2";
import {toast} from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from '@mui/icons-material/Check';
import CachedIcon from '@mui/icons-material/Cached';
import { resendVerificationCode } from "./stepper/UserRegistrationRequest";
export default function AccountVerification(props) {
    /**
     * variable for Account Verification Component
     */
    const [code, setCode] = React.useState('');
    const [timer, setTimer] = React.useState(60);
    const data = useSelector((state) => state.userRegistration.userinfo)
    const dispatch = useDispatch();
    const handleCodeChange = (event) => {
        setCode(event.target.value)
    }
    const confirm = () => {
        Swal.fire({
            text:'processing, please wait . . . ',
            icon:'info'
        })
        Swal.showLoading()
        if (code.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Please input a valid code!'
            })
        } else {
            var data2 = {
                username: data.username,
                code: code
            }
            verifyUserAccount(data2)
                .then((response) => {
                    Swal.close()
                    if (response.data.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Successfully verified !',
                            html: 'Logging in to your account now...',
                            allowOutsideClick: false,
                            showConfirmButton: false,
                        })
                        Swal.showLoading()
                        setTimeout(() =>
                            dispatch(getLoginVerified({ username: data.username, password: data.password }))
                            ,
                            3000
                        )
                    } else {
                    Swal.close()
                    toast.error(response.data.message)

                    }
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    const resendCode = () => {
        Swal.fire({
            icon: 'info',
            title: 'Please wait',
            html: 'Sending email verification code...',
            allowOutsideClick: false,
            showConfirmButton: false,
        })
        Swal.showLoading();
        resendVerificationCode(data.email)
            .then((response) => {
                setTimer(60)
                if (response.data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: response.data.message,
                        html: 'Please check your inbox now.'
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: response.data.message,
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    const countDown = () => {
        console.log('countdown')
        if (timer !== 0) {
            setTimeout(() => {
                setTimer(timer - 1)
            }, 1000)
        }
    }
    useEffect(() => {
        countDown()
    }, [timer])

    return (
        <React.Fragment>
            <Box>
                <Tooltip title="Verification Code you recieved from your email" placement="top">
                    <TextField label="Verification Code" variant='outlined' value={code} fullWidth onChange={handleCodeChange} required />
                </Tooltip>
            </Box>
            <Box sx={{ mb: 2 }}>
                <div>
                    <Button
                        variant="contained"
                        onClick={confirm}
                        color='success'
                        sx={{ mt: 1, mr: 1 }}
                    >
                        <CheckIcon /> &nbsp;
                        Confirm
                    </Button>

                    <Button
                        onClick={props.handleBack}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={resendCode}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={timer !== 0 ? true : false}
                    >
                        <CachedIcon /> &nbsp;
                        Resend Code {timer !== 0 ? 'in ' + timer + ' sec.' : ''}
                    </Button>
                </div>
            </Box>

        </React.Fragment>
    )
}