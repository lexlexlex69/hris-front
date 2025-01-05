import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Box, Card, CardContent, Typography, TextField, Fade, Button } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
import Tooltip from '@mui/material/Tooltip';
import 'react-calendar/dist/Calendar.css';
import CalendarEvents from './calendarEvents/CalendarEvents';
// components
import UnderDevWrapper from './UnderDevWrapper'
import SelfServicePortal from './self-service-portal/SelfServicePortal';

import EmployeeManagement from './employee_management/EmployeeManagement';
import EmployeeInfo from './employee_info/EmployeeInfo';
import DataAnalytics from './data_analytics/DataAnalytics';
import RecruitmentMain from '../../recruitmentExternal/RecruitmentMain';
import MainDashboard from '../../outsiderLayout/dashboard/mainDashboard/MainDashboard';
// spring
import { useSpring, animated } from 'react-spring'

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// mui icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
// images
import Av from '../../../assets/img/avatar.png'
// mui icons
import DraftsIcon from '@mui/icons-material/Drafts';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CampaignIcon from '@mui/icons-material/Campaign';

import { getInfo } from '../../../redux/slice/userInformationSlice'
import DeclinePdspdates from './declinedPdsUpdates/DeclinePdspdates';
import { Announcements } from './announcements/Announcements';

function Dashboard(props) {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // redux
    const dispatch = useDispatch()
    const darkmodeRedux = useSelector(state => state.darkmode)
    const [sampleValue, setSampleValue] = useState(0)
    const userinfo = useSelector(state => state.login)

    const [moduleOpener, setModuleOpener] = useState({
        recruitment: false,
        employeeManagement: false,
        dataAnalytics: false,
    })
 

    return (
        <Fade in >
            <Grid container spacing={1} sx={{ px: 1 }} className='darkmodeTransition' >
                <Grid item xs={12} sm={12} md={8} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <EmployeeInfo />
                    {localStorage.getItem('hris_roles') === '1' ? (
                        <Card sx={{ p: 1, px: 2 }} raised>
                            <Box display="flex" justifyContent='space-between'>
                                <Typography color="#5C5C5C"><b>Employee Management</b></Typography>
                                <Box>
                                    {moduleOpener.employeeManagement ?
                                        (
                                            <Tooltip title="hide module">
                                                <VisibilityIcon sx={{ cursor: 'pointer' }} color="primary" onClick={() => setModuleOpener(prev => ({ ...prev, employeeManagement: !prev.employeeManagement }))} />
                                            </Tooltip>
                                        ) :
                                        (
                                            <Tooltip title="show module">
                                                <VisibilityOffIcon sx={{ cursor: 'pointer' }} color="primary" onClick={() => setModuleOpener(prev => ({ ...prev, employeeManagement: !prev.employeeManagement }))} />
                                            </Tooltip>
                                        )}
                                </Box>
                            </Box>
                            <CardContent>
                                {moduleOpener.employeeManagement &&
                                    <Fade in>
                                        <div>
                                            <EmployeeManagement />
                                        </div>
                                    </Fade>
                                }
                            </CardContent>
                        </Card>
                    ) : null}
                    {/* <UnderDevWrapper> */}
                        <Card sx={{ p: 1, px: 2 }} raised>
                            <Box display="flex" justifyContent='space-between'>
                                <Typography color="#5C5C5C"><b>CGB Careers</b></Typography>
                                <Box>
                                    {moduleOpener.recruitment ?
                                        (
                                            <Tooltip title="hide module">
                                                <VisibilityIcon sx={{ cursor: 'pointer' }} color="primary" onClick={() => setModuleOpener(prev => ({ ...prev, recruitment: !prev.recruitment }))} />
                                            </Tooltip>
                                        ) :
                                        (
                                            <Tooltip title="show module">
                                                <VisibilityOffIcon sx={{ cursor: 'pointer' }} color="primary" onClick={() => setModuleOpener(prev => ({ ...prev, recruitment: !prev.recruitment }))} />
                                            </Tooltip>
                                        )}
                                </Box>
                            </Box>
                            <CardContent>
                                {moduleOpener.recruitment &&
                                    <Fade in>
                                        <div>
                                            <MainDashboard />
                                        </div>
                                    </Fade>
                                }
                            </CardContent>
                        </Card>
                    {/* </UnderDevWrapper> */}
                    {localStorage.getItem('hris_roles') === '1' ? (
                        <Card sx={{ p: 1, px: 2 }} raised>
                            <Box display="flex" justifyContent='space-between'>
                                <Typography color="#5C5C5C"><b>Data Analytics</b></Typography>
                                <Box>
                                    {moduleOpener.dataAnalytics ?
                                        (
                                            <Tooltip title="hide module">
                                                <VisibilityIcon sx={{ cursor: 'pointer' }} color="primary" onClick={() => setModuleOpener(prev => ({ ...prev, dataAnalytics: !prev.dataAnalytics }))} />
                                            </Tooltip>
                                        ) :
                                        (
                                            <Tooltip title="show module">
                                                <VisibilityOffIcon sx={{ cursor: 'pointer' }} color="primary" onClick={() => setModuleOpener(prev => ({ ...prev, dataAnalytics: !prev.dataAnalytics }))} />
                                            </Tooltip>
                                        )}
                                </Box>
                            </Box>
                            <CardContent>
                                {moduleOpener.dataAnalytics &&
                                    <Fade in>
                                        <div>
                                            <DataAnalytics />
                                        </div>
                                    </Fade>
                                }
                            </CardContent>
                        </Card>
                    ) : null}

                    <SelfServicePortal />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* <UnderDevWrapper> */}
                    <DeclinePdspdates />
                    <Announcements/>
                    {/* </UnderDevWrapper> */}
                    {/* <UnderDevWrapper> */}
                    <Card raised sx={{ mt: 2 }}>
                        <Typography color="#5C5C5C" sx={{ p: 1 }}><b>Calendar of Activities</b></Typography>
                        <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                            {/* <Box sx={{ gap: 1, overflowY: 'scroll', height: '25rem', width: '100%' }}> */}
                            <CalendarEvents />
                            {/* </Box> */}
                        </CardContent>
                    </Card>
                    
                </Grid>
            </Grid>
        </Fade>
    )
}

export default Dashboard