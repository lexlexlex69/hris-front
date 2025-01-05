import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { blue, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Fade from '@mui/material/Fade';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Backdrop from '@mui/material/Backdrop';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Swal from 'sweetalert2';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

import AccountCircle from '@mui/icons-material/AccountCircle';

// components
import CreateAccount from './ForgotPassword';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// images
import BL from '../../assets/img/bl.png'
import HRIS from '../../assets/img/hris.svg'
import Comb from '../../assets/img/comb.svg'
import But from '../../assets/img/bbb.png'
// mui icons
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import WorkIcon from '@mui/icons-material/Work';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getLogin } from '../../redux/slice/login';

// toastify 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Loginpage() {
    // create new account modal state
    const [openCreateModal, setOpenCreateModal] = React.useState(false);
    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const [forgotPassModal, setForgotPassModal] = useState(false)
    const handleCloseForgotModal = () => setForgotPassModal(false)
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // appbar ref
    const appbarRef = useRef(null)
    const [appbarState, setAppbarState] = useState('')
    // navigate
    const navigate = useNavigate()
    // redux
    const dispatch = useDispatch()
    const loginRedux = useSelector(state => state.login)
    // login state
    const [login, setLogin] = useState({
        username: '',
        password: ''
    })
    const fucosPasswordRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const loginOnChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value })
    }

    const handleLogin = (e) => {
        e.preventDefault()
        dispatch(getLogin({ username: login.username, password: login.password, navigate: navigate }))
    }

    return (
        <Box sx={{ flexGrow: 1, height: 'calc(100vh - 66px)', position: 'relative' }}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openCreateModal}
                // onClose={handleCloseCreateModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openCreateModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '90%' : '30%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                    }}>
                        <CreateAccount onClose={handleCloseCreateModal} />
                    </Box>
                </Fade>
            </Modal>
            {/* forgot password */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={forgotPassModal}
                onClose={handleCloseForgotModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={forgotPassModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '90%' : '30%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                    }}>
                        <CreateAccount onClose={handleCloseForgotModal} />
                    </Box>
                </Fade>
            </Modal>
            <AppBar position="static" ref={appbarRef}>
                <Toolbar sx={{ p: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <img src={BL} alt="" width={50} sx={{ m: 1 }} />
                    <Typography variant="h5" component="div" sx={{ flex: 1, fontSize: matches ? '1rem' : null }}>
                        Human Resource Information System
                    </Typography>
                </Toolbar>
            </AppBar>
            <CssBaseline />
            <Grid container sx={{ height: '100%', width: '100%', backgroundImage: 'linear-gradient(#fff, #4ba3c7,#0093c4)', m: 0, p: 0 }} >
                {matches ? null : (
                    <Box sx={{ background: `url('${Comb}')`, height: '100%', width: '100%', backgroundSize: '100%', backgroundRepeat: 'no-repeat', objectFit: 'contain', zIndex: 40, position: 'absolute', opacity: .2 }} />
                )}
                {matches ? null : (
                    <Grid item xs={12} sm={12} md={8} lg={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
                        <img src={HRIS} alt="hris svg" width="40%" style={{ zIndex: 50 }} className='animate__animated animate__fadeIn' />
                        <Box sx={{ zIndex: 60 }}>
                            <Typography sx={{ bgcolor: blue[700], borderRadius: '2rem' }} onClick={() => navigate(`/${process.env.REACT_APP_HOST}/recruitment`)}>
                                <Typography variant="h5" sx={{ color: '#fff', letterSpacing: '.3rem', '&:hover': { bgcolor: '#fff', color: 'primary.main', cursor: 'pointer', transform: 'translate(-10px,-10px)' }, transition: 'all .2s', p: 2, borderRadius: '2rem' }}>HRIS job portal</Typography>
                            </Typography>
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12} sm={12} md={4} lg={4} sx={{ bgcolor: '#fff', zIndex: 100, height: '100%', position: 'relative', borderTopLeftRadius: '-150%' }}>
                    {loginRedux.loading ? (
                        <Box sx={{ width: '100%', position: 'absolute' }}>
                            <LinearProgress sx={{ mt: 0, zIndex: 150, color: 'red', height: 5, width: '100%' }} variant='query' />
                        </Box>
                    ) : null}
                    <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: matches ? '100%' : '100%' }}>
                        <Box sx={{ p: 1, mt: 2 }} className="flex-column">
                            <img src={But} alt="" width="60%" style={{ marginTop: matches ? '2rem' : '1rem' }} />
                            <Typography variant='h6' sx={{ textAlign: 'center', color: blue[500], width: '100%', mt: 1 }}>City Government of Butuan <br></br>Human Resource Information System</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                            {loginRedux.login.validation_error ? (
                                <>
                                    <Fade in>
                                        <Typography sx={{ textAlign: 'center', bgcolor: red[500], color: '#fff' }}>{loginRedux.login.validation_error.username}</Typography>
                                    </Fade>
                                    <Fade in>
                                        <Typography sx={{ textAlign: 'center', bgcolor: red[500], color: '#fff' }}>{loginRedux.login.validation_error.password}</Typography>
                                    </Fade>
                                </>
                            ) : null}
                            {loginRedux.login.status === 401 ? (
                                <Fade in>
                                    <Typography sx={{ textAlign: 'center', bgcolor: red[500], color: '#fff' }}>{loginRedux.login.message}</Typography>
                                </Fade>
                            ) : null}
                        </Box>
                        <form onSubmit={handleLogin}>
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', mt: 2 }}>
                                <Paper
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <IconButton aria-label="menu">
                                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    </IconButton>
                                    <InputBase
                                        size='small'
                                        fullWidth
                                        required
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Username"
                                        name="username"
                                        inputProps={{ 'aria-label': 'username' }}
                                        value={login.username}
                                        onChange={loginOnChange}
                                    />
                                </Paper>
                                <Paper
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <IconButton aria-label="menu" onFocus={() => fucosPasswordRef.current.focus()}>
                                        <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    </IconButton>
                                    <InputBase
                                        size='small'
                                        name="password"
                                        inputRef={fucosPasswordRef}
                                        fullWidth
                                        required
                                        sx={{ ml: 1, flex: 1 }}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        inputProps={{ 'aria-label': 'password' }}
                                        value={login.password}
                                        onChange={loginOnChange}
                                    />
                                    <IconButton aria-label="password" onClick={() => setShowPassword(prev => !prev)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </Paper>
                                <Typography variant="body1" color="error" mt={2} align='center' sx={{ cursor: 'pointer' }} onClick={() => setForgotPassModal(true)}>Forgot password?</Typography>
                                <Box sx={{ width: '100%', mt: 1, mb: 1, display: 'flex', justifyContent: 'center' }}>
                                    <Button type="submit" variant="contained" sx={{ borderRadius: '2rem', width: '80%' }} size="large"><b>Login</b></Button>
                                </Box>
                            </Box>
                        </form>
                        <Box sx={{ display: 'flex', mt: 1, cursor: 'pointer', justifyContent: 'center', width: '100%', gap: 1 }}>
                            {matches ? (
                                <Button variant='contained' size={matches ? 'small' : 'medium'} sx={{ borderRadius: '2rem', zIndex: 60, bgcolor: '#fff', color: 'primary.main', '&:hover': { color: '#fff', bgcolor: blue[800] }, transition: 'all .3s' }} startIcon={<WorkIcon />} >{matches ? 'vacant positions' : 'Check vacant positions'} </Button>
                            ) : null}
                            <Button variant='contained' size={matches ? 'small' : 'medium'} color="success" sx={{ borderRadius: '2rem' }} onClick={() => {
                                Swal.fire({
                                    text: 'redirecting to user-registration',
                                    icon: 'info'
                                })
                                Swal.showLoading()
                                setTimeout(() => {
                                    Swal.close()
                                    navigate('user-registration')
                                }, 1000)
                            }}>create account</Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer />
        </Box>
    )
}

export default Loginpage