import React,{useEffect, useState} from 'react';
import {
    Outlet,
    useNavigate
} from "react-router-dom";
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
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CircleIcon from '@mui/icons-material/Circle';

import {blue} from '@mui/material/colors';
import { getTrainerMenus } from './TrainerRequest';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';
import axios from 'axios';
export default function TrainerDashboard(){
    // navigate
    const navigate = useNavigate()
    const [menus,setMenus] = useState([])
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(()=>{
        getTrainerMenus()
        .then(res=>{
            console.log(res.data)
            setMenus(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const [openDrawer,setOpenDrawer] = useState(false)
    const toggleDrawer = (toggle) =>{
        setOpenDrawer(toggle)
    };
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
    const list = () => (
        <Box>
        <List>
            <ListItemButton onClick={() => navigate('')}>
            <ListItemIcon>
                <DashboardIcon sx={{color:'black'}}/>
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
            </ListItemButton>
        </List>
        <Divider />
        <List>
            {
                menus.map((row, index) => (
                <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => navigate(row.uri)}>
                    <ListItemIcon>
                        <CircleIcon sx={{color:blue[800]}}/>
                    </ListItemIcon>
                    <ListItemText primary={row.menu_name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        
        </Box>
    );
    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color='inherit'
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={()=>toggleDrawer(true)}

            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Trainer Dashboard
            </Typography>
            
            <div>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            </div>
            </Toolbar>
        </AppBar>
        <Drawer
            open={openDrawer}
            onClose={()=>toggleDrawer(false)}
        >
            {list()}
        </Drawer>
        <Box>
        <Outlet />
        </Box>
        </Box>
    );
}