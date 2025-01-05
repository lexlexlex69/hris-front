import React from 'react'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// toastify 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import HowToRegIcon from '@mui/icons-material/HowToReg';

// components
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// images
import BL from '../../assets/img/bl.png'
// mui icons
import { handleRegister } from './Controller';
import RecruitmentMain from './RecruitmentMain';


// toastify 
import 'react-toastify/dist/ReactToastify.css';
import UnderDevWrapper from '../layout/dashboard/UnderDevWrapper';



const themeColor = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#059fd6',
    },
    success: {
      // This is green.A700 as hex.
      main: '#65a618',
    },
    lightText: {
      main: '#a3a2a0'
    },
    navyBlue: {
      main: '#202A44'
    }
  },
});

function Recruitment() {
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // navigate
  const navigate = useNavigate()
  return (
    <ThemeProvider theme={themeColor}>
      <Box sx={{ flexGrow: 1, height: matches ? 'calc(100vh - 66px)' : 'auto' }}>
        <AppBar position="static">
          <Toolbar sx={{ p: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <img src={BL} alt="" width={50} sx={{ m: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: matches ? '1rem' : null }}>
              Human Resource Information System
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant='contained' size="large" sx={{ borderRadius: '2rem', bgcolor: '#fff', color: 'primary.main', '&:hover': { color: '#fff', bgcolor: 'navyBlue.main' } }} startIcon={<HowToRegIcon />} onClick={() => handleRegister(navigate)}>register</Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Alert severity="warning">
          Before applying for any open positions with CGB, you must have a Hris account. To create one, click the "REGISTER" icon in the upper right corner of your page.
        </Alert>
        <Box sx={{ width: '100%', px: { xs: 3, md: 5 } }}>
          <UnderDevWrapper title='These features are not yet available for use.' >
            <Box p={2}>
              <RecruitmentMain />
            </Box>
          </UnderDevWrapper>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default Recruitment