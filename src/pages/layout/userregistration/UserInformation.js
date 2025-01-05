import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import {Typography,Popover} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { saveUserInformation } from './stepper/UserRegistrationRequest';
import { setInfo, getInfo } from '../../../redux/slice/userRegistrationSlice';
// import { viewFilesUsingPathOnly } from '../pds/customFunctions/CustomFunctions';
import PrivacyNotice from '../../../common/PrivacyNotice';
import EmojiSymbolsIcon from '@mui/icons-material/EmojiSymbols';
// email validator
// import * as EmailValidator from 'email-validator';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

export default function UserInformation(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(prev => !prev)
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const userData = useSelector(state => state.userRegistration.userinfo)
    const [data, setData] = React.useState({
        username: '',
        fname: '',
        mname: '',
        lname: '',
        password: '',
        email: '',
        birth_date: '',
        mobile_number: '',
        disabled: false,
        is_employee: false,
    })

    const [privacyCheck, setPrivacyCheck] = useState(false)
    const [privacyModal, setPrivacyModal] = useState(false)

    const handleOpenPrivacyModal = (e) => {
        e.preventDefault()
        if (data.username.length < 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Username must atleast have 5 characters!'
            })
        }
        else if (data.password.length < 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Password must atleast have 5 characters!'
            })
        }
        else {
            setPrivacyModal(true) // get privacy notice when clicking continue

        }
    }

    const handleClosePrivacyModal = () => {
        setPrivacyModal(false)
        setPrivacyCheck(false)
    }



    useEffect(() => {
        if (Object.keys(userData).length === 0 && userData.constructor === Object) {
            // setData({...data,username:userData.username,
            //     fname:userData.fname,
            //     mname:userData.mname,
            //     lname:userData.lname,
            //     password:userData.password,
            //     email:userData.email,
            //     disabled:true})
        } else {
            setData({
                ...data,
                username: userData.username,
                fname: userData.fname,
                mname: userData.mname,
                lname: userData.lname,
                password: userData.password,
                email: userData.email,
                birth_date: userData.birth_date,
                mobile_number: userData.mobile_number,
                disabled: true
            })
        }
    }, [data, userData])


    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value })
    }


    const handleNext = () => {
        if (!privacyCheck) {
            toast.warning('Button is disabled')
            return
        }

        if (data.disabled == false) {
            Swal.fire({
                icon: 'info',
                title: 'Please Wait',
                html: 'Sending email verification code...',
                // allowOutsideClick: false,
                showConfirmButton: false,
            })
            Swal.showLoading()

            /**
             * save user information to DB
             */
            saveUserInformation(data)
                .then((response) => {
                    if (response.data.status === 'success') {
                        setData({ ...data, disabled: true })
                        dispatch(setInfo(data))
                        props.handleNext();
                        setPrivacyModal(false)
                        Swal.close();
                    } else if (response.data.status === 'email_used') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            html: response.data.message
                        })
                    } else if (response.data.status === 'user_exist') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            html: response.data.message,
                            footer: 'Already have an account ? <a href="/hris"> Click here to login</a>'
                        })
                    }
                    else if (response.data.status === 'employee_no_account') {
                        Swal.fire({
                            icon: 'warning',
                            title: 'User account not found!',
                            html: 'Employee exist but no user account found, please contact system administrator!',
                        })
                    }
                    else if (response.data.status === 'employee_not_exist') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Employee not found!',
                            html: 'Sorry, system tried to look for your account but found nothing, please contact system administrator! <br/> <a href="https://forms.gle/LtZ18PsFC7YAxYKb6" target="_BLANK">click here to submit issues and concern</a>',
                        })
                    }
                    else if (response.data.status === 'account_exist') {
                        Swal.fire({
                            title: 'Account exist?',
                            text: "Do you wish to login now?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, Proceed!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire({
                                    text: 'Trying to login...',
                                    icon: 'info'
                                })
                                Swal.showLoading()
                                localStorage.setItem('hris_token', response.data.token)
                                localStorage.setItem('hris_name', response.data.name)
                                localStorage.setItem('hris_roles', response.data.roles)
                                localStorage.setItem('hris_employee_id', response.data.employee_id)
                                localStorage.setItem('id', response.data.id)
                                navigate(`/${process.env.REACT_APP_HOST}/homepage`)
                                dispatch(getInfo())
                            }
                        })
                    }
                    else if (response.data.status === 'account_created') {
                        Swal.fire({
                            icon: 'success',
                            title: "Notice!",
                            html: 'This user is already an employee of CGB.',
                        })
                        setData({ ...data, disabled: true })
                        dispatch(setInfo(data))
                        props.handleNext();
                    }
                }).catch((error) => {
                    toast.error(error)
                    Swal.close();
                })

        } else {
            props.handleNext();
        }

    }
    const [captchaValue, setcaptchaValue] = React.useState(null)
    const handleReCAPTHA = (value) => {
        setcaptchaValue(value)
    }
    const [anchorType,setAnchorType] = useState('')
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event,type) => {
        setAnchorType(type)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const handleAppend = (char)=>{
        console.log(anchorType)
        switch(anchorType){
            case 'fname':
                var temp = {...data};
                temp.fname=temp.fname+char
                setData(temp)
                break;
            case 'mname':
                var temp = {...data};
                temp.mname=temp.mname+char
                setData(temp)
                break;
            case 'lname':
                var temp = {...data};
                temp.lname=temp.lname+char
                setData(temp)
                break;
        }
    }
    return (
        <React.Fragment>
            <PrivacyNotice open={privacyModal} privacyCheck={privacyCheck} setPrivacyCheck={setPrivacyCheck} handleClose={handleClosePrivacyModal} handleNext={handleNext} />
            <form onSubmit={handleOpenPrivacyModal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <TextField label="Username" variant='outlined' fullWidth required value={data.username} name="username" onChange={handleChange} disabled={data.disabled} />
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                >
                    <Box sx={{display:'flex',gap:1,p:1}}>
                        <Tooltip title='Uppercase enye'><Button variant='contained' onClick={()=>handleAppend('Ñ')}>Ñ</Button></Tooltip>
                        <Tooltip title='Lowercase enye'><Button variant='contained' sx={{textTransform:'lowercase'}} onClick={()=>handleAppend('ñ')}>ñ</Button></Tooltip>
                    </Box>

                </Popover>
                <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                    <TextField label="First Name" variant='outlined' fullWidth required value={data.fname} name="fname" onChange={handleChange} disabled={data.disabled}/>
                    <Tooltip title='Click to insert enye character'><IconButton color='info' aria-describedby={id} onClick={(event)=>handleClick(event,'fname')} className='custom-iconbutton'><EmojiSymbolsIcon/></IconButton></Tooltip>
                </Box>

                <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                    <TextField label="Middle Name" variant='outlined' fullWidth required value={data.mname} name="mname" onChange={handleChange} disabled={data.disabled} />
                    <Tooltip title='Click to insert enye character'><IconButton color='info' aria-describedby={id} onClick={(event)=>handleClick(event,'mname')} className='custom-iconbutton'><EmojiSymbolsIcon/></IconButton></Tooltip>
                </Box>
                
                <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                    <TextField label="Last Name" variant='outlined' fullWidth required value={data.lname} name="lname" onChange={handleChange} disabled={data.disabled} />
                    <Tooltip title='Click to insert enye character'><IconButton color='info' aria-describedby={id} onClick={(event)=>handleClick(event,'lname')} className='custom-iconbutton'><EmojiSymbolsIcon/></IconButton></Tooltip>
                </Box>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        required
                        name="password"
                        onChange={handleChange}
                        disabled={data.disabled}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                <TextField label="Date of Birth" variant='outlined' fullWidth type="date" focused value={data.birth_date} required name="birth_date" onChange={handleChange} disabled={data.disabled} />
                <TextField label="Mobile number" variant='outlined' fullWidth value={data.mobile_number} required name="mobile_number" onChange={handleChange} disabled={data.disabled} />
                <Tooltip title="Where Verification Code will be sent" placement="top">
                    <TextField label="Email Address" type='email' variant='outlined' fullWidth required value={data.email} name="email" onChange={handleChange} disabled={data.disabled} />
                </Tooltip>
                <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    // sitekey="6Ldkhw4iAAAAAFa4V4m6UxBTz7jVeTBpn19ft_RV"
                    onChange={handleReCAPTHA}
                />
                <FormControlLabel control={<Checkbox checked={data.is_employee} />} label="Are you a CGB employee/worker?" onChange={() => setData({ ...data, is_employee: !data.is_employee })} />
                {/* onChange={() => setData({ ...data, is_employee: !data.is_employee })}  */}
                {data.is_employee && <Alert severity="info" className='animate__animated animate__fadeIn'>Enabling this will check if you have an existing account.</Alert>}
                <Box sx={{ mb: 2 }}>
                    <div>
                        <Button
                            variant="contained"
                            type='submit'

                            sx={{ mt: 1, mr: 1 }}
                            disabled={captchaValue === null ? true : false}
                        >
                            Continue
                        </Button>
                        <Button
                            disabled={true}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            Back
                        </Button>
                    </div>
                </Box>
            </form>
        </React.Fragment>
    )
}