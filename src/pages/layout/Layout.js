import React, { useState, useEffect, useRef } from 'react'
import {
    Outlet,
    useNavigate
} from "react-router-dom";
// mui components
import { blue, red, green, yellow, grey } from '@mui/material/colors'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// icons
// mui icons
import CircleIcon from '@mui/icons-material/Circle';
import DraftsIcon from '@mui/icons-material/Drafts';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArticleIcon from '@mui/icons-material/Article';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import CommentIcon from '@mui/icons-material/Comment';
import SettingsIcon from '@mui/icons-material/Settings';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import Swal from 'sweetalert2'
import axios from 'axios'
// image
import Logo from '../../assets/img/bl.png'
import LogoSvg from '../../assets/img/bl.svg'
import Va from '../../assets/img/avatar.png'
import LogoutLogo from '../../assets/img/logout.svg'
// redux
import { useDispatch, useSelector } from 'react-redux'
// redux actions
import { darkmode } from '../../redux/slice/darkmodeSlice'

// toastify sample tanggalonun ni joe
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLogout } from '../.././redux/slice/logout'

// get user menu request
import { getUserMenus } from '../layout/dashboard/menurequest/MenuRequest'

import { useIdleTimer } from 'react-idle-timer'
import Badge from '@mui/material/Badge';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { impersonateLogin } from './admin/impersonate/ImpersonateRequest';
import {createTheme, ThemeProvider, styled } from '@mui/material/styles';

const menuTheme = createTheme({
  typography: {
    // fontSize:14,
    fontFamily:'latoreg',
    // color:'grey'
  }
});
const style = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bgcolor: 'background.paper',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(59, 110, 226, 0.7)',
    p: 4,
};

const bugs = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Layout() {
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

    // concerns modal
    const [openConcerns, setOpenConcerns] = useState(false);
    const handleOpenConcerns = () => setOpenConcerns(true);
    const handleCloseConcerns = () => setOpenConcerns(false);
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
    const [recruitmentList, setRecruitmentList] = useState(false); // list items state
    const [selfServicePortalList, setSelfServicePortalList] = useState(false); // list items state
    const [myModuleList, setMyModuleList] = useState(false); // list items state
    const [adminMenuList, setAdminMenuList] = useState(false); // list items state
    const [reportsMenuList, setReportsMenuList] = useState(false); // list items state
    const handlePdsList = () => {
        setPdsList(!pdsList);
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };


    const [myModuleMenu, setMyModuleMenu] = useState([])
    const [selfServiceMenu, setSelfServiceMenu] = useState([])
    const [adminMenu, setAdminMenu] = useState([])
    const [reportsMenu, setReportsMenu] = useState([])
    const [recruitmentMenu, setRecruitmentMenu] = useState([])
    const [masterFilesMenu, setMasterFilesMenu] = useState([])
    const [concernModule, setConcernModule] = useState('')
    const [concernText, setConcernText] = useState('')
    const [groupMenus, setGroupMenus] = useState([])
    // const [adminGroupMenus, setAdminGroupMenus] = useState([])
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
    useEffect(() => {
        getUserMenus()
            .then((response) => {
                // console.log(response.data)
                const temp = [...new Set(response.data.menus.filter(item => item.group_menu && item.location == 'DASHBOARD'))];
                const uniqueGroupMenu = [...new Set(temp.map(item => item.group_menu))];
                var temp_g_menus = [];
                uniqueGroupMenu.sort().forEach(el => {
                    if(el) {
                        temp_g_menus.push({
                            menu_name: el,
                            is_open: false,
                        })
                    }
                })
                setGroupMenus(temp_g_menus);
                var sorted = response.data.menus.sort((a, b) => {
                    // converting to uppercase to have case-insensitive comparison
                    const name1 = a.menu_name.toUpperCase();
                    const name2 = b.menu_name.toUpperCase();

                    let comparison = 0;

                    if (name1 > name2) {
                        comparison = 1;
                    } else if (name1 < name2) {
                        comparison = -1;
                    }
                    return comparison;
                });
                // const adminTemp = [...new Set(response.data.menus.filter(item => item.group_menu && item.location == 'ADMIN'))];
                // const uniqueAdminGroupMenu = [...new Set(adminTemp.map(item => item.group_menu))];
                // const temp_admin_menus = [];
                // uniqueAdminGroupMenu.sort().forEach(el => {
                //     if(el) {
                //         temp_admin_menus.push({
                //             menu_name: el,
                //             is_open: false,
                //         })
                //     }
                // })
                // setAdminGroupMenus(temp_admin_menus);
                var dashboard_menu = [];
                var self_service_menu = [];
                var admin_menu = [];
                var reports_menu = [];
                var recruitment_menu = [];
                var master_files_menu = [];
                sorted.forEach(el => {
                    switch (el.location) {
                        case 'SELF-SERVICE-PORTAL':
                            self_service_menu.push(el);
                            break;
                        case 'DASHBOARD':
                            dashboard_menu.push(el);
                            break;
                        case 'ADMIN':
                            admin_menu.push(el);
                            break;
                        case 'REPORTS':
                            reports_menu.push(el);
                            break;
                        case 'RECRUITMENT':
                            recruitment_menu.push(el)
                            break;
                        case 'MASTER-FILES':
                            master_files_menu.push(el)
                            break;
                    }
                })
                // console.log(dashboard_menu)
                setMyModuleMenu(dashboard_menu)
                setSelfServiceMenu(self_service_menu)
                setAdminMenu(admin_menu)
                setReportsMenu(reports_menu)
                setRecruitmentMenu(recruitment_menu)
                setMasterFilesMenu(master_files_menu)
                // setMyModuleMenu(response.data)
            }).catch((error) => {
                toast.error(error)
            })
    }, [])
    const selfServiceIcon = (menu_name) => {
        switch (menu_name) {
            case 'Online Application':
                return (
                    <ListItemIcon>
                        <DraftsIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                );
                break;
            case 'Daily Time Record':
                return (
                    <ListItemIcon>
                        <AccessTimeFilledIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                );
                break;
            case 'Online Leave Application / CTO':
                return (
                    <ListItemIcon>
                        <StickyNote2Icon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                );
                break;
            case 'COC/CTO':
                return (
                    <ListItemIcon>
                        <DocumentScannerIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                );
                break;
            case 'Pass Slip / Undertime Permit':
                return (
                    <ListItemIcon>
                        <ArticleIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                );
                break;
            case 'Pass Slip / Undertime Permit':
                return (
                    <ListItemIcon>
                        <LocalAtmIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                );
                break;
            default:
                return null;

        }
    }
    const handleGroupMenuOpen = (index) => {
        var temp = [...groupMenus];
        temp[index].is_open = !temp[index].is_open;
        setGroupMenus(temp)
    }
    // const handleAdminGroupMenuOpen = (index) => {
    //     var temp = [...adminGroupMenus];
    //     temp[index].is_open = !temp[index].is_open;
    //     setAdminGroupMenus(temp)
    // }
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: '100%' }}
            role="presentation"
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Divider />
            <ThemeProvider theme={menuTheme}>
            <List>
                <ListItem button onClick={() => navigate('')}>
                    <ListItemIcon>
                        <DashboardIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                    
                    <ListItemText primary={'Dashboard'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => navigate('view-pds')}>
                    <ListItemIcon>
                        <ContactPageIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItemIcon>
                    <ListItemText primary={'My PDS'} sx={{ color: darkmodeRedux ? '#242526' : '#242526'}} />
                </ListItem>
            </List>
            {selfServiceMenu.length !== 0
                ?
                <>
                    <ListItem button onClick={() => setSelfServicePortalList(!selfServicePortalList)}>
                        <ListItemIcon>
                            {/* <InboxIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} /> */}
                            <AssignmentIndIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        </ListItemIcon>
                        
                        <ListItemText primary={'Self Service Portal'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        {selfServicePortalList ? <ExpandLess sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} /> : <ExpandMore sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />}
                    </ListItem>
                    <Collapse in={selfServicePortalList} timeout="auto" unmountOnExit>
                        {selfServiceMenu.map((data, key) =>
                            <List component="div" disablePadding key={key}>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(data.uri,{
                                                                replace:true,
                                                                state:{
                                                                    perm_id:data.perm_menu_id
                                                                }
                                                            })}>
                                    {/* <ListItemIcon>
                                    <FilePresentIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                </ListItemIcon> */}
                                    {/* {selfServiceIcon(data.menu_name)} */}
                                    <ListItemText primary={data.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                </ListItemButton>
                                <Divider />
                            </List>
                        )}
                    </Collapse>
                </>
                :
                null
            }
            {myModuleMenu.length !== 0
                ?
                <>
                    <ListItem button onClick={() => setMyModuleList(!myModuleList)}>
                        <ListItemIcon>
                            <BadgeIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        </ListItemIcon>
                        <ListItemText primary={'My Module'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        {myModuleList ? <ExpandLess sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} /> : <ExpandMore sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />}
                    </ListItem>
                    <Collapse in={myModuleList} timeout="auto" unmountOnExit>
                        {
                            groupMenus.map((row, index) =>
                                <Box sx={{ ml: 2 }} key={index}>

                                    <List component="div" disablePadding key={index} >
                                        <ListItem button onClick={() => handleGroupMenuOpen(index)}>
                                            <ListItemIcon>
                                                <CircleIcon sx={{ color: blue[300], fontSize: '15px' }} />
                                                {/* <ViewModuleIcon sx={{ color: blue[800], fontSize: '15px' }} /> */}
                                            </ListItemIcon>
                                            <ListItemText primary={row.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                            {row.is_open ? <ExpandLess sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} /> : <ExpandMore sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />}
                                        </ListItem>
                                    </List>
                                    <Collapse in={row.is_open} timeout="auto" unmountOnExit>
                                        {
                                            myModuleMenu.map((data, key) =>
                                                row.menu_name === data.group_menu
                                                    ?
                                                    <List component="div" disablePadding key={key}>
                                                        {
                                                            data.pending
                                                            ?
                                                            <>
                                                            <Badge color="error" badgeContent={data.pending} sx={{position: 'absolute',top: '15px',left: '15px'}}            anchorOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'left',
                                                                }} max={99}>
                                                                
                                                            </Badge>
                                                            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(data.uri,{
                                                                replace:true,
                                                                state:{
                                                                    perm_id:data.perm_menu_id
                                                                }
                                                            })}>
                                                                    <ListItemText primary={data.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                                                </ListItemButton>
                                                            </>
                                                            :
                                                            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(data.uri,{
                                                                replace:true,
                                                                state:{
                                                                    perm_id:data.perm_menu_id
                                                                }
                                                            })}>
                                                                <ListItemText primary={data.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                                            </ListItemButton>
                                                        }
                                                        
                                                        
                                                        <Divider />
                                                    </List>
                                                    :
                                                    null
                                            )
                                        }
                                    </Collapse>
                                </Box>
                            )
                        }

                    </Collapse>
                </>
                :
                null}
            {reportsMenu.length !== 0
                ?
                <>
                    <ListItem button onClick={() => setReportsMenuList(!reportsMenuList)}>
                        <ListItemIcon>
                            <QueryStatsOutlinedIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        </ListItemIcon>
                        <ListItemText primary={'Reports'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        {reportsMenuList ? <ExpandLess sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} /> : <ExpandMore sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />}
                    </ListItem>
                    <Collapse in={reportsMenuList} timeout="auto" unmountOnExit>
                        {reportsMenu.map((data, key) =>
                            <List component="div" disablePadding key={key}>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(data.uri)}>
                                    <ListItemText primary={data.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                </ListItemButton>
                                <Divider />
                            </List>
                        )}
                    </Collapse>
                </>
                :
                null
            }
            {/* <List>
                {myModuleMenu.map((item,key)=>
                    <ListItem button onClick={() => navigate(item.uri)} key = {key}>
                        <ListItemIcon>
                            <InboxIcon sx={{ color: blue[800] }} />
                        </ListItemIcon>
                        <ListItemText primary={item.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItem>
                )}
            </List> */}
            {adminMenu.length !== 0
                ?
                <>
                    <ListItem button onClick={() => setAdminMenuList(!adminMenuList)}>
                        <ListItemIcon>
                            <AdminPanelSettingsIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        </ListItemIcon>
                        <ListItemText primary={'Admin'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        {adminMenuList ? <ExpandLess sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} /> : <ExpandMore sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />}
                    </ListItem>
                    {/* <Collapse in={adminMenuList} timeout="auto" unmountOnExit>
                        {
                            adminGroupMenus.map((row, index) =>
                                <Box sx={{ ml: 2 }} key={index}>
                                    <List component="div" disablePadding>
                                        <ListItem button onClick={() => handleAdminGroupMenuOpen(index)}>
                                            <ListItemIcon>
                                                <CircleIcon sx={{ color: blue[300], fontSize: '15px' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={row.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                            {row.is_open ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                    </List>
                                    <Collapse in={row.is_open} timeout="auto" unmountOnExit>
                                        {
                                            adminMenu.map((data, key) =>
                                                row.menu_name === data.group_menu
                                                    ?
                                                    <List component="div" disablePadding key={key}>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(data.uri)}>
                                                            <ListItemText primary={data.menu_name} />
                                                        </ListItemButton>
                                                        <Divider />
                                                    </List>
                                                    : null
                                            )
                                        }
                                    </Collapse>
                                </Box>
                            )
                        }
                    </Collapse> */}
                    <Collapse in={adminMenuList} timeout="auto" unmountOnExit>
                        {adminMenu.map((data, key) =>
                            <List component="div" disablePadding key={key}>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(data.uri)}>
                                    <ListItemIcon>
                                        <SupervisedUserCircleIcon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={data.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                </ListItemButton>
                                <Divider />
                            </List>
                        )}
                    </Collapse>
                </>
                :
                null}
            <Divider />

            <Divider />
            {recruitmentMenu.length > 0 ?
                <>
                    <ListItem button onClick={() => setRecruitmentList(!recruitmentList)}>
                        <ListItemIcon>
                            <PersonAddAlt1Icon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        </ListItemIcon>
                        <ListItemText primary={'Recruitment'} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        {recruitmentList ? <ExpandLess sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} /> : <ExpandMore sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />}
                    </ListItem>
                    <Collapse in={recruitmentList} timeout="auto" unmountOnExit>
                        {recruitmentMenu.map((data, key) =>
                            <List component="div" disablePadding key={key}>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(data.uri)}>
                                    <ListItemText primary={data.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                                </ListItemButton>
                                <Divider />
                            </List>
                        )}
                    </Collapse>
                </> : null}
            <Divider />
            {masterFilesMenu.length > 0 ?
                <>
                    <ListItem button onClick={() => navigate(masterFilesMenu[0]?.uri)}>
                        <ListItemIcon>
                            <PersonAddAlt1Icon sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                        </ListItemIcon>
                        <ListItemText primary={masterFilesMenu[0]?.menu_name} sx={{ color: darkmodeRedux ? '#242526' : '#242526' }} />
                    </ListItem>
                </> : null}
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
            </ThemeProvider>
        </Box>
    );

    // react timer
    const handleOnIdle = event => {
        setOpenIdleModal(true)
    }

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 25,
        onIdle: handleOnIdle,
        // onActive: handleOnActive,
        // onAction: handleOnAction,
        debounce: 500
    })

    const handleLogout = () => {
        Swal.fire({
            title: 'Logging-out . . .',
            icon: 'warning'
        })
        Swal.showLoading()
        axios.post('api/hrisLogout')
            .then(res => {
                Swal.close()
                if (res.data.status === 200) {
                    localStorage.removeItem('is_masquerade')
                    localStorage.removeItem('masquerading_username')
                    localStorage.removeItem('hris_roles')
                    localStorage.removeItem('hris_stepper')
                    localStorage.removeItem('hris_employee_id')
                    localStorage.removeItem('hris_name')
                    localStorage.removeItem('hris_token')
                    window.location.href = `/${process.env.REACT_APP_HOST}`
                }
            })
            .catch(err => {
                Swal.close()
            })
    }

    const submitConcerns = (e) => {
        Swal.fire('submitting concern, please wait . . .')
        Swal.showLoading()
        e.preventDefault()
        axios.post(`/api/bugs/addBugs`, { data: concernModule + '/ ' + concernText })
            .then(res => {
                Swal.close()
                if (res.data.status === 200) {
                    toast.success('Concern submitted! Thankyou!')
                    setConcernModule('')
                    setConcernText('')
                    handleCloseConcerns()
                }
            })
            .catch(err => {
                Swal.close()
                toast.error(err.message)
            })
    }

    // drawer

    // auto logout useEffect
    useEffect(() => {
        let timerLogout = ''
        if (openIdleModal) {
            if (logoutCounter < 1) {
                axios.post(`/api/hrisLogout`)
                    .then(res => {
                        if (res.data.status === 200) {
                            localStorage.removeItem('hris_employee_id')
                            localStorage.removeItem('hris_name')
                            localStorage.removeItem('hris_stepper')
                            localStorage.removeItem('hris_roles')
                            localStorage.removeItem('hris_token')
                            window.location.href = `/${process.env.REACT_APP_HOST}`
                        }
                    })
                    .catch(err => {
                        toast.error(err.message)
                    })
            }
            else {
                timerLogout = setTimeout(() => {
                    setLogoutCounter(prev => prev - 1)
                }, 1000)
            }
        }

        return () => {
            clearTimeout(timerLogout);
        }

    }, [logoutCounter, openIdleModal])
    return (
        <Box sx={{ flexGrow: 1, bgcolor: darkmodeRedux ? '#3A3B3C' : null, height: '100%' }} className="darkmodeTransition">
            <Modal
                open={openIdleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Card raised sx={{ p: 2 }}>
                        <Typography id="modal-modal-description" sx={{ mt: 2, color: 'warning.main' }} align="center">
                            IDLE ACCOUNT for 20 minutes. <br />
                            For security reasons, your Account will automatically logout within . . .
                        </Typography>
                        <Typography id="modal-modal-title" variant={logoutCounter <= 10 ? 'h1' : 'h4'} align="center" sx={{ color: logoutCounter <= 10 ? red[500] : 'none' }}>
                            {logoutCounter}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="error" onClick={handleCloseIdleModal} >cancel</Button>
                        </Box>
                    </Card>
                </Box>
            </Modal>
            {/* modal concerns */}
            <Modal
                open={openConcerns}
                onClose={handleCloseConcerns}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={bugs}>
                    <form onSubmit={submitConcerns}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            For Issues and concerns, please fill the form.
                        </Typography>
                        <TextField label="module name" fullWidth value={concernModule} required onChange={(e) => setConcernModule(e.target.value)} />
                        <Typography id="modal-modal-title" variant="h6" component="h4" color="warning.main">
                            Module name, ex: Pds/Educational background
                        </Typography>
                        <TextField label="Issue" fullWidth value={concernText} required onChange={(e) => setConcernText(e.target.value)} />
                        <Typography id="modal-modal-title" variant="h6" component="h4" color="warning.main">
                            Type what issue you found.
                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2" align="right">
                            Thankyou!
                        </Typography>
                        <Button variant='contained' type="submit" fullWidth>Submit</Button>
                    </form>
                </Box>
            </Modal>
            <AppBar position="fixed" sx={{ bgcolor: darkmodeRedux ? '#242526' : blue[500], zIndex: 990 }}>
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
                    <img src={Logo} alt="" width={40} height={40} />
                    <Typography variant={matches ? 'p' : 'h6'} component="div" sx={{ flexGrow: 1, ml: 1 }}>
                        {matches ? 'HRIS' : 'Human Resource Information System'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="contained" sx={{ mr: matches ? 1 : 3 }} size={matches ? 'small' : ''} color="error" onClick={handleOpenConcerns} > <CommentIcon sx={{ mr: 1 }} /> {!matches ? 'Issues/Concerns' : ''}</Button>
                        {/* <FormGroup>
                            <FormControlLabel control={<Switch />} label={matches ? '' : 'Darkmode'} onChange={() => dispatch(darkmode())} />
                        </FormGroup> */}
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            {/* <AccountCircle /> */}
                            <Avatar {...stringAvatar(localStorage.getItem('hris_name'))} />
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
                                <MenuItem onClick={() => navigate('my-profile')}>
                                    My Profile
                                </MenuItem>
                                <MenuItem onClick={handleClose}>Manage accounts</MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <Typography sx={{ color: red[500] }}>Logout</Typography>
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
            <Box sx={{ py: 1, marginTop: matches ? '64px' : '66px' }}>
                <Outlet />
                <ToastContainer autoClose={1500} />
            </Box>
        </Box>
    )
}

export default Layout
function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}
function stringAvatar(name) {
    if (!name) {
        localStorage.removeItem('hris_roles')
        localStorage.removeItem('hris_stepper')
        localStorage.removeItem('hris_employee_id')
        localStorage.removeItem('hris_name')
        localStorage.removeItem('hris_token')
        window.location.href = `/${process.env.REACT_APP_HOST}`
    }
    var trimName = name?.trim();
    var initial = trimName?.split(' ');
    var len = initial?.length;
    return {
        sx: {
            bgcolor: stringToColor(trimName),
        },
        children: `${initial[0][0]}${initial[len - 1][0]}`,
    };
}