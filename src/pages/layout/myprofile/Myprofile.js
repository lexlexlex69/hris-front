import React, { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { Modal, Grid, Box, Card, CardContent, Typography, TextField, Tooltip, Skeleton, Fade, Button, Checkbox, FormGroup, FormControlLabel, CssBaseline } from '@mui/material'
// images
import Avatr from '../../../assets/img/avatar.png'
import { blue, green, red } from '@mui/material/colors'
// redux
import { useSelector, useDispatch } from 'react-redux'
// actions
// import { getEmployees } from '../../../redux/slice/profilesSlice'
import { getProfile } from '../../../redux/slice/profileSlice'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EditIcon from '@mui/icons-material/Edit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getInfo } from '../../../redux/slice/userInformationSlice'
// toastify
import { toast } from 'react-toastify';
import { updateUserPassword, getUserProfile, handleUpdatePicture, getPic } from './Controller'
import Swal from 'sweetalert2'
import { formatAddress } from '../customstring/CustomString'

function Myprofile() {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches ? 300 : 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
    };
    // redux
    const darkmodeRedux = useSelector(state => state.darkmode)
    const dispatch = useDispatch()

    // modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [loader, setLoader] = useState(true)
    const [profile, setProfile] = useState('')
    const [pic, setPic] = useState('')
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [file, setFile] = useState(null)
    const passwordUpdate = useSelector(state => state.userInformation.updatePasswordSuccess)
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        getUserProfile(setProfile, setLoader)
        getPic(setPic)
    }, [])

    const handleUpdatePassword = () => {
        if (oldPassword.length === 0) {
            toast.warning('Please input old password.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else if (newPassword !== confirmPassword) {
            toast.warning('New password and confirm password not match. Please try again.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else if (newPassword.length < 5) {
            toast.warning('New Password must have atleast 8 characters.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            Swal.fire({
                title: 'Please wait...',
                allowEscapeKey: false,
                allowOutsideClick: false
            })
            Swal.showLoading()
            updateUserPassword({ old_password: oldPassword, new_password: newPassword })
                .then((response) => {
                    if (response.data.status === 'success') {
                        /**
                         * reset form fields
                         */
                        setOldPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                        setShowOldPassword(false)
                        setShowNewPassword(false)
                        setOpen(false)
                        toast.success('Password successfully updated.');
                    } else {
                        toast.error('Current password not match. Please try again.', {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true, 
                            draggable: true,
                            progress: undefined,
                        });
                    }
                    Swal.close()
                }).catch((error) => {
                    toast.error(error)
                })
        }
    }

    return (
        <>
            <CssBaseline />
            <Grid container sx={{ height: 'calc(100vh - 68px)', p: 2 }} spacing={2}>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <Card raised sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 1, alignItems: 'center', width: '100%', height: '100%' }}>
                        {!profile ? (
                            <React.Fragment>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="circular" width={120} height={120} />
                                    </Box>
                                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <Skeleton variant="text" width={50} />
                                    </Box>
                                </Box>
                                <Skeleton variant="text" width={'80%'} />
                                <Skeleton variant="text" width={'70%'} />
                                <Skeleton variant="text" width={'90%'} />
                            </React.Fragment>
                        ) : (
                            <Fade in >
                                <Box>
                                    <Box>
                                        <Box className='flex-column' sx={{ height: '100%', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 3 }}>
                                                <Box sx={{ borderRadius: '100%', overflow: 'hidden', height: { xs: 150, md: 150 }, width: { xs: 150, md: 150 } }}>
                                                    <img src={pic} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                                    {/* <img src={pic} alt="" height="200" width="200" style={{ borderRadius: '100%', boxShadow: '2px 3px 4px #5c5c5c', overflow: 'hidden' }} /> */}
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'column', width: '100%', flex: 1 }}>
                                                {file &&
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <Typography variant="body1" color="initial">
                                                            {`...${file.name.slice(-10)}`}
                                                        </Typography>
                                                        <IconButton aria-label="delete">
                                                            <CloseIcon size='small' color='error' onClick={e => setFile('')} />
                                                        </IconButton>
                                                    </Box>
                                                }
                                                {!file &&
                                                    <Tooltip title="update/upload picture">
                                                        <Button
                                                            component="label"
                                                            sx={{ bgcolor: 'none', '&:hover': { bgcolor: '#EBEBEB' } }}
                                                        >
                                                            <AddAPhotoIcon fontSize="medium" />
                                                            <input
                                                                accept='image/*'
                                                                type="file"
                                                                hidden
                                                                onChange={(e) => setFile(e.target.files[0])}
                                                            />
                                                        </Button>
                                                    </Tooltip>
                                                }

                                                {file ? (
                                                    <Button variant="outlined" startIcon={<EditIcon />} color="warning" size="small" sx={{ borderRadius: '2rem' }} onClick={() => handleUpdatePicture(file, setPic, setFile)}>
                                                        Update
                                                    </Button>
                                                ) : null}

                                            </Box>
                                            <Box sx={{display:'flex',alignItems:'center'}}>
                                                <Tooltip title='Username'><IconButton color='info'><AccountCircleIcon/></IconButton></Tooltip>
                                                <Typography sx={{color:blue[800],fontSize:'.8rem',fontWeight:600}}>
                                                {profile.username}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <hr />
                                    <Box className='flex-row'>
                                        <Box className='flex-column' sx={{ pl: 2, alignItems: 'center', gap: .5, mt: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Typography variant="body1" align='center' sx={{ color: darkmodeRedux ? '#242526' : blue[800] }} className='fontLato'><small>{profile.dept_title}</small></Typography>
                                            </Box>
                                            <Box className='flex-row-space-between' sx={{ gap: 1 }}>
                                                <PersonIcon fontSize="small" color="primary" />
                                                <Typography variant="p" sx={{ color: blue[500] }} className='fontLato'><small><b>{profile.fname} {profile.mname} {profile.lname}</b></small></Typography>
                                            </Box>
                                            <Box className='flex-row-space-between' sx={{ gap: 1 }}>
                                                <EmailIcon fontSize="small" color="primary" sx={{ flex: 1 }} />
                                                <Typography variant="p" sx={{ color: blue[500] }} className='fontLato'><small><b>{profile.emailadd ? profile.emailadd : '-'}</b></small></Typography>
                                            </Box>
                                            <Box className='flex-row-space-between' sx={{ gap: 1 }}>
                                                <LocalPhoneIcon fontSize="small" color="primary" />
                                                <Typography variant="p" sx={{ color: blue[500] }} className='fontLato'><small><b>{profile.cpno}</b></small></Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Fade>
                        )}
                        {profile ? (
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
                                <Button variant="contained" color="warning" size="large" sx={{ borderRadius: '2rem' }} onClick={handleOpen}><EditIcon /> &nbsp; Update Password</Button>
                            </Box>
                        ) : (
                            <Skeleton variant="text" width={'70%'} height={80} />
                        )}

                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={9} lg={9}>
                    <Card raised className='flex-row' sx={{ p: 1, height: '100%', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', flex: 1, flexDirection: matches ? 'column' : 'row' }}>
                            <Box className='flex-column' sx={{ pl: 2, alignItems: 'flex-start', gap: 1, flex: 1, justifyContent: 'flex-start' }}>
                                {loader ? (
                                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Skeleton variant="text" width={'90%'} />
                                        <Skeleton variant="text" width={'90%'} />
                                        <Skeleton variant="text" width={'70%'} />
                                        <Skeleton variant="text" width={'90%'} />
                                        <Skeleton variant="text" width={'90%'} />
                                        <Skeleton variant="text" width={'70%'} />
                                        <Skeleton variant="text" width={'70%'} />
                                        <Skeleton variant="text" width={'90%'} />
                                        <Skeleton variant="text" width={'90%'} />
                                        <Skeleton variant="text" width={'90%'} />
                                    </Box>
                                ) : (
                                    <React.Fragment>
                                        {/* <TextField variant='filled' size="small" label="Firstname" fullWidth name="fname" value={profile.profile.fname} disabled sx={{bgcolor:'#f0f0f0 !important'}}/> */}

                                        <Grid container spacing={3} sx={{ 'padding': '10px 0 10px 0' }}>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>First Name</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.fname}
                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Middle Name</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.mname}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Last Name</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.lname}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Ext. Name</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.extname}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Date of Birth</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.dob}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Place of Birth</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.baddress}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Civil Status</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.civilstatus}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Mobile No.</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.cpno}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Email Address</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.emailadd}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Height</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.height}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Weight</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.weight} kg.

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>GSIS No.</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.gsisno}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Pag-Ibig No.</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.pag_ibig}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>PhilHealth No.</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.philhealth}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>SSS No.</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.sssno}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>TIN</small>
                                                    </Typography>

                                                    <Typography>
                                                        {profile.tin}

                                                    </Typography>

                                                </Typography>
                                            </Grid>


                                            <Grid item xs={6} md={12}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Temporary Address</small>
                                                    </Typography>

                                                    <Typography>
                                                        {/* {profile.rAddress} */}

                                                        {`${formatAddress(profile.radUnit)} ${formatAddress(profile.radStreet)}, ${formatAddress(profile.radVillage)}, ${formatAddress(profile.radBrgy)}, ${formatAddress(profile.radCity)}, ${formatAddress(profile.radProvince)}`}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} md={12}>
                                                <Typography variant="h6" component="h2">
                                                    <Typography sx={{ 'color': '#2196F3' }}>
                                                        <small>Permanent Address</small>
                                                    </Typography>

                                                    <Typography>
                                                        {/* {profile.paddress} */}
                                                        {`${formatAddress(profile.padUnit)} ${formatAddress(profile.padStreet)}, ${formatAddress(profile.padVillage)}, ${formatAddress(profile.padBrgy)}, ${formatAddress(profile.padCity)}, ${formatAddress(profile.padProvince)}`}

                                                    </Typography>

                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>
                                )}
                            </Box>
                        </Box>
                    </Card>

                    {/* <Button onClick={handleOpen}>Open modal</Button> */}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" sx={{ 'textAlign': 'center', 'paddingBottom': '20px', 'color': '#2196F3' }} variant="h6" component="h2">
                                Updating Password
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <TextField variant="outlined" type={showOldPassword ? "text" : "password"} fullWidth label='Current Password' value={oldPassword} onChange={(val) =>
                                        setOldPassword(val.target.value)
                                    } />
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox onChange={() => setShowOldPassword(!showOldPassword)} />} label="Show Password"></FormControlLabel>
                                    </FormGroup>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField variant="outlined" type={showNewPassword ? "text" : "password"} fullWidth label='New Password' value={newPassword} onChange={(val) =>
                                        setNewPassword(val.target.value)
                                    } />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField variant="outlined" type={showNewPassword ? "text" : "password"} fullWidth label='Confirm New Password' value={confirmPassword} onChange={(val) =>
                                        setConfirmPassword(val.target.value)
                                    } />
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox onChange={() => setShowNewPassword(!showNewPassword)} />} label="Show Password"></FormControlLabel>
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                            </Typography>
                            {/* <Button variant="contained" color="success" size="large" fullWidth ><CheckIcon/> &nbsp; Confirm Update</Button>
                    <br/>
                    <Button variant="contained" color="error" size="large" fullWidth ><CancelIcon/> &nbsp; Cancel</Button> */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: matches ? 'column' : 'row' }}>
                                <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleUpdatePassword}><CheckIcon /> &nbsp; Confirm Update</Button>
                                <Button variant="contained" size="small" color="error" sx={{ mt: 2 }} onClick={handleClose}><CancelIcon /> &nbsp;Cancel</Button>
                            </Box>

                        </Box>
                        {/* <ToastContainer /> */}

                    </Modal>
                </Grid>
            </Grid >
        </>
    )
}

export default Myprofile