import React, { useState, useEffect,useRef } from 'react'
import {
    Outlet,
    useNavigate
} from "react-router-dom";
// mui components
import { blue, red, green, yellow } from '@mui/material/colors'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import Swal from 'sweetalert2'
import axios from 'axios'

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// icons

// mui icons
import DashboardIcon from '@mui/icons-material/Dashboard';

// image
import Logo from '../../assets/img/bl.png'
import Va from '../../assets/img/avatar.png'
// redux
import { useDispatch, useSelector } from 'react-redux'
// redux actions
import { darkmode } from '../../redux/slice/darkmodeSlice'

// toastify sample tanggalonun ni joe
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useIdleTimer } from 'react-idle-timer'

//
import { getHasPDS } from '../.././redux/slice/userInformationSlice'
import { impersonateLogin } from '../layout/admin/impersonate/ImpersonateRequest';
function OutsiderLayout() {
    // navigate
    const navigate = useNavigate()
    // darkmode redux
    const darkmodeRedux = useSelector(state => state.darkmode.value)
    const dispatch = useDispatch()
    // apbar states
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // idle modal
    const logoutRef = useRef(true)
    const [logoutCounter, setLogoutCounter] = useState(20)
    const [openIdleModal, setOpenIdleModal] = useState(false);
    const handleOpenIdleModal = () => setOpenIdleModal(true);
    const handleCloseIdleModal = () => {
        setLogoutCounter(20)
        setOpenIdleModal(false)
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    // apbar states

    // drawer
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [pdsList, setPdsList] = useState(false); // list items state
    const handlePdsList = () => {
        setPdsList(!pdsList);
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    const handleLogoutMasquerade = () =>{
        Swal.fire({
            icon:'info',
            title:'Logging out masquerade',
            html:'Please wait...' 
        })
        Swal.showLoading();
        var t_data = {
            username:localStorage.getItem('masquerading_username'),
            password:'impersonatePassw0rd'
        }
        impersonateLogin(t_data)
        .then(res=>{
            if(res.data.status === 200){
                const data = res.data;
                Swal.fire({
                    icon:'success',
                    title:'Logging in back',
                    html:'Redirecting to dashboard. Please wait...' 
                })
                Swal.showLoading();
                localStorage.removeItem('is_masquerade')
                localStorage.removeItem('masquerading_username')
                localStorage.setItem('hris_token', data.token)
                localStorage.setItem('hris_name', data.name)
                localStorage.setItem('hris_roles', data.roles)
                if (data.user_type === 0) {
                    localStorage.setItem('hris_applicant_id', data.applicant_id)
                    localStorage.setItem('hris_applicant_fname', data.fname)
                    localStorage.setItem('hris_applicant_mname', data.mname)
                    localStorage.setItem('hris_applicant_lname', data.lname)
                } else {
                    localStorage.setItem('hris_employee_id', data.employee_id)
                }
                localStorage.setItem('id', data.id)
              
                setInterval(function(){
                    // navigate(`/${process.env.REACT_APP_HOST}/homepage`)
                    // window.open(`/${process.env.REACT_APP_HOST}/homepage`)
                    // window.close();
                    window.location.href = `/${process.env.REACT_APP_HOST}/homepage`;
                    // window.location.reload(`/${process.env.REACT_APP_HOST}/homepage`)
                },3000)
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: '100%' }}
            role="presentation"
            // onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Divider />
            <List>
                <ListItem button onClick={() => navigate('')}>
                    <ListItemIcon>
                        <DashboardIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                    <ListItemText primary={'Dashboard'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                </ListItem>
            </List>
            <Divider />
            {
                localStorage.getItem('is_masquerade')
                ?
                <ListItem button onClick={handleLogoutMasquerade}>
                    <ListItemIcon>
                        <LogoutOutlinedIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                    <ListItemText primary={'Logout Masquerade'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                </ListItem>
                :
                null 
            }
        </Box>
    );

    // react timer
    const handleOnIdle = event => {
        setOpenIdleModal(true)
        handleLogout()
    }

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 20,
        // onIdle: handleOnIdle,
        // onActive: handleOnActive,
        // onAction: handleOnAction,
        debounce: 500
    })

    // drawer
    const handleLogout = () => {
        Swal.fire({
            title: 'Logging-out . . .',
            icon: 'warning'
        })
        Swal.showLoading()
        axios.post('api/hrisLogout')
            .then(res => {
                Swal.close()
                console.log(res)
                if (res.data.status === 200) {
                    localStorage.removeItem('hris_roles')
                    localStorage.removeItem('hris_stepper')
                    localStorage.removeItem('hris_employee_id')
                    localStorage.removeItem('hris_name')
                    localStorage.removeItem('hris_token')
                    localStorage.removeItem('applicant_temp_id')
                    localStorage.removeItem('hris_applicant_fname')
                    localStorage.removeItem('hris_applicant_lname')
                    localStorage.removeItem('hris_applicant_mname')
                    localStorage.removeItem('id')
                    localStorage.removeItem('hris_applicant_id')
                    window.location.href = '/hris'
                }
            })
            .catch(err => {
                Swal.close()
            })
    }
    const hasPDS = useSelector(state => state.userInformation.hasPDS)
    useEffect(() => {
        // dispatch(getHasPDS())
    }, [dispatch])
    return (
        <Box sx={{ flexGrow: 1, bgcolor: darkmodeRedux ? '#3A3B3C' : null, height: '100%' }} className="darkmodeTransition">
            <AppBar position="static" sx={{ bgcolor: darkmodeRedux ? '#242526' : blue[500] }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer('left', true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src={Logo} alt="" width={40} height={40} onClick={() => { window.location.href = '/homepage' }} />
                    <Typography variant={matches ? 'p' : 'h6'} component="div" sx={{ flexGrow: 1, ml: 1 }}>
                        Human Resource Information System
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <FormGroup>
                            <FormControlLabel control={<Switch />} label={matches ? '' : 'Darkmode'} onChange={() => dispatch(darkmode())} />
                        </FormGroup> */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* <small><b>{ matches ? localStorage.getItem('hris_name')[0] :localStorage.getItem('hris_name')}</b></small> */}
                        </Box>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <Box sx={{ pl: 5, pr: 1, mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <img src={Va} alt="" width={50} />
                            </Box>
                            <Typography sx={{ px: 2, bgcolor: blue[500], color: '#fff' }}><small>{localStorage.getItem('hris_name')}</small></Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                                {hasPDS
                                    ?
                                    <MenuItem onClick={() => navigate('my-profile')}>
                                        My Profile
                                    </MenuItem>
                                    :
                                    ''
                                }

                                {/* <MenuItem onClick={handleClose}>Manage accounts</MenuItem> */}
                                <MenuItem onClick={handleLogout}>
                                    <Typography sx={{ color: red[500] }} >Logout</Typography>
                                </MenuItem>
                            </Box>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                {list('left')}
            </Drawer>
            <Box sx={{ py: 1 }}>
                <Outlet />
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default OutsiderLayout