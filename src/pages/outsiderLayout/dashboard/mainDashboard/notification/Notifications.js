import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import { blue, red, orange } from '@mui/material/colors';

import EmailIcon from '@mui/icons-material/Email';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import WorkIcon from '@mui/icons-material/Work';
import CssBaseline from '@mui/material/CssBaseline';

import moment from 'moment'

import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import ChatIcon from '@mui/icons-material/Chat';
import DoneAllIcon from '@mui/icons-material/DoneAll';


import { getApplicantNotifications, markAsRead } from './Controller';
import NotifMenu from './NotifMenu';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import { Alert } from '@mui/lab';





const Notifications = () => {

    const [examState, setExamState] = useState([])
    const [interviewState, setInterviewState] = useState([])
    const [appointed, setAppointed] = useState([])
    const [review, setReview] = useState([])
    const [remarks, setRemarks] = useState([])
    const [loader, setLoader] = useState(false)
    const [notifLoaders, setNotifLoaders] = useState({
        exam: true,
        interview: true,
        lackingDocs: true,
        appointed: true
    })
    const [markReadLoader, setMarkReadLoader] = useState('')

    useEffect(() => {
        let controller = new AbortController()
        getApplicantNotifications(setExamState, setInterviewState, setRemarks, setAppointed, setReview, setLoader, setNotifLoaders, controller)
        return () => controller.abort()
    }, [])

    return (
        <Card raised sx={{ flex: 1 }}>
            <Alert severity='info'>please check your email address for additional information. Thank you!</Alert>
            <CardContent sx={{ display: 'flex', justifyContent: 'flex-end', gap: { xs: 1, md: 5 } }}>
                <Box display="" mx="" my="" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <NotifMenu icon={notifLoaders.appointed ? (<CircularProgress size={30} />) : (<WorkIcon />)} title="Examinations" badgeContent={appointed && appointed.length} appointed={false} >
                        {markReadLoader && (<LinearProgress />)}
                        {appointed && appointed.map((item, index) => (
                            <div key={index}>
                                {index === 0 && (
                                    <Typography fontSize='12px' pl='15px' color="warning.main">Check your email address for more information.</Typography>
                                )}
                                <MenuItem sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: markReadLoader === item.id ? 'space-between' : 'flex-end', width: '100%' }}>
                                        {markReadLoader === item.id ? <CircularProgress size={25} /> : null}
                                        <FormControlLabel control={<Checkbox size='small' />} label="mark as read" onChange={e => markAsRead(e, item, 'appoint', appointed, setAppointed, setMarkReadLoader)} />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, width: '100%', borderRadius: '5px' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <DoneAllIcon sx={{ color: 'success.main', }} />
                                            <Typography variant="body1" sx={{ ml: 1, display: 'flex', color: 'success.main', textAlign: 'left' }}>You are appointed as  </Typography>
                                        </Box>
                                        <Typography variant="body1" color="initial" sx={{ ml: 1, display: 'flex', color: 'success.main', }}> Position: {item?.position_name} </Typography>
                                        <Typography variant="body1" color="initial" sx={{ ml: 1, display: 'flex', color: 'success.main', color: 'success.main', }}> item number : {item?.plantilla_no} </Typography>
                                    </Box>
                                </MenuItem>
                                {appointed.length > 1 && index !== appointed.length - 1 ? <Divider /> : null}
                            </div>
                        ))}
                    </NotifMenu>
                    <Typography variant="body1" color="initial" sx={{ display: { xs: 'none', md: 'block' } }}>Appointment</Typography>
                </Box>
                <Box display="" mx="" my="" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} >
                    <NotifMenu icon={notifLoaders.exam ? (<CircularProgress size={30} />) : (<EmailIcon />)} title="Examinations" badgeContent={examState && examState.length} loader={loader} >
                        {markReadLoader && (<LinearProgress />)}
                        {examState && examState.map((item, index) => (
                            <div key={index}>
                                {index === 0 && (
                                    <Typography fontSize='12px' pl='15px' color="warning.main">Check your email address for more information.</Typography>
                                )}
                                <MenuItem sx={{ width: { xs: '200px', md: '300px' }, overflowX: 'hidden' }} >
                                    <Box display="flex" flexDirection="column" justifyContent="flex-start">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <FormControlLabel control={<Checkbox size='small' />} label="mark as read" onChange={e => markAsRead(e, item, 'exam', examState, setExamState, setMarkReadLoader)} />
                                        </Box>
                                        <Box sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                            <Typography variant="body2" color="initial" textAlign='justify' >
                                                You have an upcoming examination for position {item?.position_name}, plantilla number: {item?.plantilla_no}, {item?.employment_status}, on {item?.exam_date}, {item?.exam_date} at {item?.exam_venue}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>

                                {examState.length > 1 && index !== examState.length - 1 ? <Divider /> : null}
                            </div>
                        ))}
                    </NotifMenu>
                    <Typography variant="body1" color="initial" sx={{ display: { xs: 'none', md: 'block' } }}>Examinations</Typography>
                </Box>
                <Box display="" mx="" my="" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <NotifMenu icon={notifLoaders.exam ? (<CircularProgress size={30} />) : (<InterpreterModeIcon />)} title="Interview" badgeContent={interviewState.length} loader={loader} >
                        {interviewState && interviewState.map((item, index) => (
                            <div key={index}>
                                {index === 0 && (
                                    <Typography fontSize='12px' pl='15px' color="warning.main">Check your email address for more information.</Typography>
                                )}
                                <MenuItem sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                                    <Box display="flex" flexDirection="column" justifyContent="flex-start" sx={{ width: { xs: '200px', md: '300px' } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                                            <FormControlLabel control={<Checkbox size='small' />} label="mark as read" onChange={e => markAsRead(e, item, 'interview', examState, setExamState, setMarkReadLoader)} />
                                        </Box>
                                        <Box sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                            <Typography variant="body2" color="initial" textAlign='justify' >
                                                You have an upcoming interview for position {item?.position_name}, plantilla number: {item?.plantilla_no}, {item?.employment_status}, on {item?.exam_date}, {item?.exam_date} at {item?.exam_venue}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                                {interviewState.length > 1 && index !== interviewState.length - 1 ? <Divider /> : null}
                            </div>
                        ))}
                    </NotifMenu>
                    <Typography variant="body1" color="initial" sx={{ display: { xs: 'none', md: 'block' } }}>Interviews</Typography>
                </Box>
                <Box display="" mx="" my="" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <NotifMenu icon={notifLoaders.exam ? (<CircularProgress size={30} />) : (<AssignmentLateIcon />)} title="Remarks" badgeContent={remarks && remarks.length} loader={loader} >
                        {markReadLoader && (<LinearProgress />)}
                        {remarks && remarks.map((item, index) => (
                            <div key={index}>
                                <CssBaseline>
                                    <MenuItem sx={{ display: 'flex', flexDirection: 'column', gap: .5, bgcolor: item.is_lacking === 1 ? red[300] : null, color: item.is_lacking === 1 ? '#fff' : null, width: { xs: 300, md: 400 }, '&:hover': { bgcolor: item.is_lacking === 1 ? red[500] : null } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                                            <FormControlLabel control={<Checkbox size='small' />} label="mark as read" onChange={e => markAsRead(e, item, 'remarks', remarks, setRemarks, setMarkReadLoader)} />
                                        </Box>
                                        <Box sx={{ width: { xs: 300, md: 400 }, px: 2, position: 'relative' }}>
                                            <Typography variant="body2" color="initial" sx={{ whiteSpace: 'pre-wrap', color: item.is_lacking === 1 ? '#fff' : null, mb: 1 }}>POSITION: {item.position_title}</Typography>
                                            <Card>
                                                <CardContent sx={{ py: .5 }}>
                                                    <Typography variant="body2" color="initial">{item.is_lacking === 1 && '[Lacking Document]'}</Typography>
                                                    {item?.remarks?.split('[REASON]').length > 0 ? item?.remarks?.split('[REASON]').map((item, index) => (
                                                        <Typography variant="body2" color="initial" sx={{ whiteSpace: 'pre-wrap', my: .5 }}>{index === 1 && 'REASON:'}{item}</Typography>
                                                    )) : item?.remarks}
                                                </CardContent>
                                            </Card>

                                        </Box>
                                    </MenuItem>
                                    {remarks.length > 1 && index !== remarks.length - 1 ? <Divider /> : null}
                                </CssBaseline>

                            </div>
                        ))}
                    </NotifMenu>
                </Box>
            </CardContent>
        </Card >
    );
};

export default Notifications;