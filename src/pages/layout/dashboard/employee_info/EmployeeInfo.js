import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { blue, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButon from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import GroupsIcon from '@mui/icons-material/Groups';
import Pagination from '@mui/material/Pagination';
import { TransitionProps } from '@mui/material/transitions';

import moment from 'moment';
import { toast } from 'react-toastify'

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// images
import Av from '../../../../assets/img/avatar.png'
// mui icons
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BugReportIcon from '@mui/icons-material/BugReport';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import StorageIcon from '@mui/icons-material/Storage';
import CachedIcon from '@mui/icons-material/Cached';
import EventIcon from '@mui/icons-material/Event';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import InfoIcon from '@mui/icons-material/Info';
import { TextField } from '@mui/material';

import CheckUpdates from './CheckUpdates';

import { getEmployeeUpdateCount, handleNavigate, handleNextPrev, getEmployeeUpdateCountSearchName } from './Controller'
import Fab from '@mui/material/Fab'
import Divider from '@mui/material/Divider'
import Swal from 'sweetalert2';
import axios from 'axios';
import { api_url } from '../../../../request/APIRequestURL';
import { evaluationDaysLeft } from '../../customstring/CustomString';
import { ListItemIcon } from '@mui/material';
import { APILoading } from '../../apiresponse/APIResponse';
import { Search } from '@mui/icons-material';



const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -5,
        top: 25,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function EmployeeInfo() {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchName, setSearchName] = useState("")
    const navigate = useNavigate()
    // menu 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        // searchNameRef.current.focus()
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // menu recruitment notif
    const [AnchorElRec, setAnchorElRec] = useState(null);
    const openRec = Boolean(AnchorElRec);
    const handleClickRec = (event) => {
        setAnchorElRec(event.currentTarget);
    };
    const handleCloseRec = () => {
        setAnchorElRec(null);
    };

    // component state
    const [info, setInfo] = useState('')
    const [updateName, setUpdateName] = useState('')
    const [updates, setUpdates] = useState('')
    const [issues, setIssues] = useState('')
    const [interview, setInterview] = useState('')
    const [limit, setLimit] = useState(1)
    const [total, setTotal] = useState(0)
    const [pdsTotalBadge, setPdsTotalBadge] = useState(0)
    const [pic, setPic] = useState('')
    const [pdsLoader, setPdsLoader] = useState(true)
    const [pdsUpdateLoader, setPdsUpdateLoader] = useState(false)
    // to update modal
    const [openUpdates, setOpenUpdates] = React.useState(false);
    const handleOpenUpdates = (row, tableName) => {
        console.log(row, tableName)
        setUpdateName(tableName)
        setHandleUpdatesData({
            row: row,
            tableName: tableName
        })
        setHandleUpdatesTrigger(true)
    };
    const [handleUpdatesData, setHandleUpdatesData] = useState('')
    const [handleUpdatesTrigger, setHandleUpdatesTrigger] = useState(false)
    const updatesRef = useRef(true)
    const handleCloseUpdates = () => {
        setHandleUpdatesTrigger(false)
        setOpenUpdates(false)
    };

    const [issueModal, setIssueModal] = useState(false)
    const handleOpenIssue = () => setIssueModal(true)
    const handleCloseIssue = () => setIssueModal(false)
    const nextPrevRef = useRef(true)

    // functions

    const handlePaginate = (e, v) => {
        handleNextPrev(setUpdates, setInfo, setIssues, v, setPdsLoader, searchName)
        setLimit(v)
    }

    // updates use effect
    useEffect(() => {
        if (updatesRef.current) {
            updatesRef.current = false
        }
        else {
            if (handleUpdatesTrigger) {
                setOpenUpdates(true)
            }
        }
    }, [handleUpdatesTrigger])
    const [hasTrainingDeptNotif, setHasTrainingDeptNotif] = useState(false)
    const [totalTrainingDeptNotif, setTotalTrainingDeptNotif] = useState(0)
    const [traineeEvaluationData, setTraineeEvaluationData] = useState([])
    const [commonNotificationsData, setCommonNotificationsData] = useState([])
    useEffect(async () => {
        /**
        Check if has permission to dept trainee nomination approval
         */

        try {
            let check = await axios.get(`/api/training/getDeptNominationNotif`)
            // console.log(check)
            setHasTrainingDeptNotif(check.data.check)
            setTotalTrainingDeptNotif(check.data.total)

            let traineeEvaluation = await axios.get(`/api/training/getTraineeEvaluationNotif`)
            // console.log(traineeEvaluation)
            setTraineeEvaluationData(traineeEvaluation.data.data)

            let res = await axios.get(`/api/employee/getCommonNotifications`)
            // console.log(traineeEvaluation)
            setCommonNotificationsData(res.data.data)


        } catch (e) {
            toast.error(e.message)
        }
    }, [])
    const handleReloadPdsUpdate = async () => {
        setPdsUpdateLoader(true)
        setSearchName("")
        try {
            let updateCount = await axios.post(`/api/dashboard/employee_info/getEmployeeUpdateCount?limit=${limit}`)
            console.log('Update count', updateCount)
            setPdsUpdateLoader(false)
            if (updateCount.data.status === 200) {
                let newUpdates = updateCount.data.updates.map((item, index) => ({ ...item, fullName: item?.fname + ' ' + item?.mname + ' ' + item?.lname }))
                setUpdates(newUpdates)
                setTotal(updateCount.data.total)
            }
        }
        catch (e) {
            toast.error(e.message)
        }
    }
    const handleViewTrainingNotif = (e) => {
        e.preventDefault();
        // api_url
        window.location.href = `/${process.env.REACT_APP_HOST}/homepage/trainee-nom-approval`;
    }
    const handleViewTraineeEvaluation = (e) => {
        e.preventDefault();
        // api_url
        window.location.href = `/${process.env.REACT_APP_HOST}/homepage/trainee-evaluation`;
    }
    const handleClickCommonNotif = (item) => {
        //mark notif as read
        APILoading('info', 'Redirecting to page', 'Please wait...')
        axios.post('/api/employee/readNotifications', { notifications_id: item.notifications_id })
            .then(res => {
                if (res.data.status === 200) {
                    Swal.close();
                    window.location.href = `/${process.env.REACT_APP_HOST}/homepage/${item.link}`;
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: 'Something went wrong'
                    })
                }
            })
        // api_url
    }
    // fetch data
    useEffect(() => {
        getEmployeeUpdateCount(setUpdates, setInfo, setTotal, setPdsTotalBadge, setIssues, setInterview, limit, setPic)
    }, [])

    // next or prev
    // useEffect(() => {
    //     if (nextPrevRef.current) {
    //         nextPrevRef.current = false
    //     }
    //     else {
    //         console.log(limit)
    //         handleNextPrev(setUpdates, setInfo, setIssues, limit, setPdsLoader, searchName)
    //     }
    // }, [limit])
    const [anchorElNotifications, setAnchorElTraineeEvaluation] = React.useState(null);

    const handleClickTraineeEvaluation = (event) => {
        setAnchorElTraineeEvaluation(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setAnchorElTraineeEvaluation(null);
    };

    const openNotifications = Boolean(anchorElNotifications);
    const notificationsID = openNotifications ? 'simple-popover' : undefined;
    return (
        <Card raised>
            <Dialog
                fullScreen
                open={openUpdates}
                sx={{ height: '100vh', zIndex: 1300 }}
                onClose={handleCloseUpdates}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseUpdates}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            close
                        </Typography>
                        {/* onClick={() => handleOpenUpdates(item, )}> */}

                        <Typography variant='p' sx={{ color: '#fff' }}>{updateName === 'hris_employee' ? 'PERSONAL INFORMATION' : updateName === 'hris_employee_address' ? 'ADDRESS' : updateName === 'hris_employee_children' ? 'EMPLOYEE CHILDREN' : updateName === 'hris_employee_education' ? 'EDUCATIONAL BACKGROUND' : updateName === 'hris_employee_employment' ? 'WORK EXPERIENCE' : updateName === 'hris_employee_others' ? 'OTHER INFORMATION' : updateName === 'hris_employee_reference' ? 'REFERENCES' : updateName === 'hris_employee_voluntary' ? 'VOLUNTARY WORKS' : updateName === 'hris_employee_eligibility' ? 'CAREER AND SERVICES' : updateName === 'hris_employee_training' ? 'TRAININGS' : updateName === 'hris_employee_34_40' ? 'ITEMS 34 to 40' : updateName === 'hris_employee_family' ? 'FAMILY BACKGROUND' : updateName === 'hris_employee_govid' ? 'GOVERNMENT ID' : ''}</Typography>
                    </Toolbar>
                </AppBar>
                <Box display="" p={1} >
                    <CheckUpdates data={handleUpdatesData} handleCloseUpdates={handleCloseUpdates} />
                </Box>
            </Dialog>
            {/* modal for issues */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={issueModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={issueModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        height: '80%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '80%' : '95%',
                        // bgcolor: 'background.paper',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        px: 2,
                        pt: 1,
                        pb: 4,
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>Issues/Concerns</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseIssue} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <Box sx={{ p: 2, height: '100%' }}>
                            <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
                                <Table sx={{ width: '100%' }} size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>#</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>Date</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>Employee Name</TableCell>
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>Concern</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {issues && issues.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{moment(item.created_at).format('MMM DD, YYYY')}</TableCell>
                                                <TableCell>{item.added_by}</TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {item.user_concern}
                                                    </Typography>
                                                    <Typography sx={{ bgcolor: 'success.main', color: '#fff', p: 1 }}>
                                                        fix:  {item.dev_feedback ? item.dev_feedback : '-'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <CardContent>
                <Box className={matches ? 'flex-column-flex-start' : 'flex-row-flex-start flex-item-start'} sx={{ position: 'relative', gap: { xs: 0, md: 5 } }}>
                    <Box className='flex-column-flex-start' sx={{ gap: 1 }}>
                        <Box className='flex-row-flex-start' sx={{ gap: 2, flex: 1, width: { xs: '100%', md: '100%' }, alignItems: 'flex-start', borderBottom: '1px solid #BEBEBE', pb: 2 }}>
                            {pic ? (
                                <Box sx={{ height: 80, width: 80, borderRadius: '100%', backgroundImage: `url(${pic})`, backgroundSize: '100% 100%', objectFit: 'cover' }} />
                            ) : (
                                <Skeleton variant="circular" width={120} height={120} animation="pulse" />
                            )}
                            <Box className='flex-column-flex-start' sx={{ flex: 1, gap: .5 }} >
                                {info.fname ? (
                                    <Fade in>
                                        <Typography sx={{ px: 1, color: 'primary.main', borderRadius: '.5rem' }}>First name: {info.fname}</Typography>
                                    </Fade>
                                ) : (
                                    <Skeleton width='90%' heigth={40} />
                                )}
                                {info.mname ? (
                                    <Fade in>
                                        <Typography sx={{ px: 1, color: 'primary.main', borderRadius: '.5rem' }}>Middle name: {info.mname}</Typography>
                                    </Fade>
                                ) : (
                                    <Skeleton width='80%' heigth={40} />
                                )}
                                {info.lname ? (
                                    <Fade in>
                                        <Typography sx={{ px: 1, color: 'primary.main', borderRadius: '.5rem' }}>Last name: {info.lname}</Typography>
                                    </Fade>
                                ) : (
                                    <Skeleton width='70%' heigth={40} />
                                )}
                                <Button disabled={info ? false : true} variant="contained" size='medium' sx={{ mt: 1, borderRadius: '2rem', width: { xs: '100%', md: 'auto' } }} onClick={() => handleNavigate(localStorage.getItem('hris_employee_id'), 'employee', navigate)}>view pds</Button>
                            </Box>
                        </Box>
                        <Box display="flex" sx={{ width: '100%', display: 'flex', gap: 1 }}>
                            {/* employee notifications area */}
                            <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'center', gap: .5 }}>
                                <Tooltip title="Feature comming soon!">
                                    <IconButton onClick={() => {
                                        if (!interview?.data || interview?.data === 0) {
                                            toast.warning('No current interviewee for you.')
                                        }
                                        else {
                                            Swal.fire({
                                                text: 'Redirecting . . .',
                                                icon: 'info'
                                            })
                                            Swal.showLoading()
                                            setTimeout(() => {
                                                Swal.close()
                                                navigate('panel')
                                            }, 1000)
                                        }
                                    }
                                    } aria-label="interview" sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }} >
                                        <StyledBadge badgeContent={interview?.data} color="error" >
                                            {!interview.hasOwnProperty("data") ? <CircularProgress sx={{ color: '#fff' }} size={25} /> : <GroupsIcon sx={{ color: '#fff' }} />}
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="body2" color="primary">Interview Panel</Typography>
                            </Box>

                            {
                                hasTrainingDeptNotif
                                    ?
                                    totalTrainingDeptNotif > 0
                                        ?
                                        // <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} >
                                        //     <Tooltip title="New training available">
                                        //         <Badge badgeContent={totalTrainingDeptNotif} color="primary">
                                        //             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        //                     <CircleNotificationsIcon color="warning" sx={{ fontSize: matches ? 40 : 40, cursor: 'pointer' }} onClick={handleViewTrainingNotif} />
                                        //                     <Typography align="center" sx={{ color: '#5c5c5c' }}> Training </Typography>
                                        //                 </Box>
                                        //         </Badge>
                                        //     </Tooltip>
                                        // </Box>
                                        <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'center', gap: .5 }}>
                                            <Tooltip title="New training available">
                                                <Badge badgeContent={totalTrainingDeptNotif} color="primary">
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                        <CircleNotificationsIcon color="warning" sx={{ fontSize: matches ? 40 : 40, cursor: 'pointer' }} onClick={handleViewTrainingNotif} />
                                                    </Box>
                                                </Badge>
                                            </Tooltip>
                                            <Typography variant="body2" color="primary">New Training</Typography>
                                        </Box>
                                        :
                                        null
                                    :
                                    null
                            }
                            {
                                traineeEvaluationData.length > 0 || commonNotificationsData.length > 0
                                    ?
                                    <>
                                        <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'center', gap: .5 }}>
                                            <Tooltip title="New Notification">
                                                <Badge badgeContent={traineeEvaluationData.length + commonNotificationsData.length} color="primary" id='trainee-evaluation-id' onClick={handleClickTraineeEvaluation}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                        <NotificationsIcon color="warning" sx={{ fontSize: matches ? 40 : 40, cursor: 'pointer' }} />
                                                    </Box>
                                                </Badge>
                                            </Tooltip>
                                            <Typography variant="body2" color="primary">Notifications</Typography>
                                        </Box>
                                        <Popover
                                            id={notificationsID}
                                            open={openNotifications}
                                            anchorEl={anchorElNotifications}
                                            onClose={handleCloseNotifications}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <Box>
                                                <List>
                                                    {
                                                        commonNotificationsData.map((item, key) =>
                                                            <ListItem disablePadding key={key}>
                                                                <ListItemButon onClick={() => handleClickCommonNotif(item)}>
                                                                    <ListItemIcon>
                                                                        <MessageIcon color='info' />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={item.message} />
                                                                </ListItemButon>
                                                            </ListItem>
                                                        )
                                                    }
                                                    {
                                                        traineeEvaluationData.map((item, key) =>
                                                            <ListItem disablePadding key={key}>
                                                                <Tooltip title='Click to proceed to evaluation page'>
                                                                    <ListItemButon onClick={handleViewTraineeEvaluation}>
                                                                        <ListItemIcon>
                                                                            <InfoIcon color='info' />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={`Trainee evaluation: ${item.training_name}`} secondary={<Box>Evaluated: {item.evaluated} | To Evaluate: {item.not_evaluated} | Evaluation Date: {evaluationDaysLeft(item.period_to)}</Box>} />
                                                                    </ListItemButon>
                                                                </Tooltip>

                                                            </ListItem>

                                                        )
                                                    }

                                                </List>
                                            </Box>
                                        </Popover>
                                    </>
                                    :
                                    null
                            }

                            {/* recruitment notifs */}
                            {/* <Box paddingLeft='10px' display="flex" alignItems="center" flexDirection="column">
                                {issues ? (
                                    <Badge badgeContent={issues.length} color="primary">
                                        <GroupsIcon color="primary" sx={{ fontSize: matches ? 40 : 40, cursor: 'pointer' }} onClick={handleClickRec} />
                                    </Badge>
                                ) : (
                                    <CircularProgress size={matches ? 40 : 40} />
                                )}
                                <Typography align="center" sx={{ color: '#5c5c5c' }}>Recruitment</Typography>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={AnchorElRec}
                                    open={openRec}
                                    onClose={handleCloseRec}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>My account</MenuItem>
                                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                                </Menu>
                            </Box> */}
                            {/* recruitment notifs */}
                        </Box>
                    </Box>
                    {localStorage.getItem('hris_roles') === '1' ? (
                        <Box sx={{ flex: 1, width: '100%', display: 'flex', gap: 3, mt: matches ? 2 : 0, justifyContent: matches ? 'space-between' : 'space-evenly', alignItems: 'flex-start', height: '100%' }}>
                            <Box>
                                {issues ? (
                                    <Badge badgeContent={issues.length} color="primary">
                                        <BugReportIcon color="error" sx={{ fontSize: matches ? 40 : 40, cursor: 'pointer' }} onClick={handleOpenIssue} />
                                    </Badge>
                                ) : (
                                    <CircularProgress size={matches ? 40 : 40} />
                                )}

                                <Typography align="center" sx={{ color: '#5c5c5c' }}>Bugs</Typography>
                            </Box>
                            <Box>
                                <Tooltip title="lyxis to hris collection/backup of personnel" placement="top">
                                    <Badge badgeContent={0} color="primary">
                                        <StorageIcon color="primary" sx={{ fontSize: matches ? 40 : 40, cursor: 'pointer' }} />
                                    </Badge>
                                </Tooltip>
                                <Typography align="center" sx={{ color: '#5c5c5c' }}>Lyxs</Typography>
                            </Box>
                            <Box>
                                <Badge badgeContent={4} color="primary">
                                    <CircularProgress size={matches ? 40 : 40} />
                                </Badge>
                                <Typography align="center" sx={{ color: '#5c5c5c' }}>Lyxs Notif</Typography>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} >
                                    <Tooltip title="check employee with pds updates">
                                        <Badge badgeContent={pdsTotalBadge} color="primary">
                                            {pdsTotalBadge ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                    <CircleNotificationsIcon color="warning" sx={{ fontSize: matches ? 40 : 40, cursor: 'pointer' }} onClick={handleClick} />
                                                    <Typography align="center" sx={{ color: '#5c5c5c' }}> {matches ? 'pds' : 'pds updates'} </Typography>
                                                </Box>
                                            ) : (
                                                <CircularProgress size={matches ? 40 : 40} />
                                            )}
                                        </Badge>
                                    </Tooltip>
                                </Box>
                                <Menu
                                    sx={{ height: 'auto', overflowY: 'scroll', zindex: 999 }}
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {!pdsLoader ? (
                                        <LinearProgress sx={{ mx: 2 }} />
                                    ) : null}

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 2, paddingTop: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, zIndex: 100 }}>
                                            <TextField  focused variant='outlined' placeholder='search last name' size='small' onChange={(e) => setSearchName(e.target.value)} value={searchName} />
                                            <Search sx={{ fontSize: 36, cursor: 'pointer', color: 'primary.main' }} onClick={() => getEmployeeUpdateCountSearchName(setUpdates, limit, setPdsLoader, searchName, setTotal)} />
                                        </Box>
                                        <Box display='flex' justifyContent='flex-end'>
                                            <CachedIcon sx={{ mr: 2, cursor: 'pointer' }} color="primary" fontSize="large" onClick={() => handleReloadPdsUpdate()} className={pdsUpdateLoader ? `btn-reloader-active` : ''} />
                                        </Box>
                                    </Box>
                                    {updates && updates.map((item, index) => (
                                        <Box>
                                            <MenuItem key={item.employee_id} sx={{ display: 'flex', flexDirection: matches ? 'row' : 'row', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, minWidth: { xs: '300px', md: 'auto' } }} >
                                                <Box sx={{ display: 'flex', gap: 1, mr: { xs: '', md: 2 }, flex: 1, alignItems: 'center' }}>
                                                    <AccountCircleIcon sx={{ color: blue[500] }} />
                                                    <Box>
                                                        <Typography color="primary" variant='body2' sx={{ fontSize: { xs: '10px', md: '12px' } }}>{matches ? item?.fullName?.slice(0, 20) + '...' : item?.fullName}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end', pl: 2, flex: 1 }}>
                                                    <Button variant="contained" sx={{ borderRadius: '2rem' }} size="small" startIcon={<VisibilityIcon />} onClick={() => handleNavigate(item.employee_id, 'admin', navigate)}> pds</Button>
                                                    <Tooltip
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: 'transparent',
                                                                    '& .MuiTooltip-arrow': {
                                                                        color: 'warning.main',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        title={
                                                            <Box sx={{ bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 1, p: 1, borderRadius: '1rem', boxShadow: '3px 5px 5px 1px gray' }}>
                                                                <Typography variant="body1" align="center" sx={{ color: blue[500] }}>modules with updates</Typography>
                                                                {item && item.updates.map((item, index) => (
                                                                    <Button key={index} variant="contained" color="warning" sx={{ display: 'flex', justifyContent: 'center', borderRadius: '2rem' }} onClick={() => handleOpenUpdates(item, item.table_name)}>
                                                                        {item.table_name === 'hris_employee' ?
                                                                            'Personal Information' : item.table_name === 'hris_employee_address' ?
                                                                                'Pds Address' : item.table_name === 'hris_employee_children' ?
                                                                                    'Children' : item.table_name === 'hris_employee_education' ?
                                                                                        'Educational Background' : item.table_name === 'hris_employee_employment' ?
                                                                                            'Work experience' : item.table_name === 'hris_employee_others' ?
                                                                                                'Skills set, etc.' : item.table_name === 'hris_employee_reference' ?
                                                                                                    'Employee References' : item.table_name === 'hris_employee_voluntary' ?
                                                                                                        'Voluntary Works' : item.table_name === 'hris_employee_eligibility' ?
                                                                                                            'Eligibility' : item.table_name === 'hris_employee_training' ?
                                                                                                                'Trainings' : item.table_name === 'hris_employee_34_40' ?
                                                                                                                    'Items 34 to 40' : item.table_name === 'hris_employee_family' ?
                                                                                                                        'Family Background' : item.table_name === 'hris_employee_govid' ?
                                                                                                                            'Government ID' : item.table_name}
                                                                    </Button>
                                                                ))}
                                                            </Box>
                                                        } placement={matches ? 'bottom' : 'right'} arrow>
                                                        <AppRegistrationIcon sx={{ color: 'warning.main' }} />
                                                    </Tooltip>
                                                </Box>
                                            </MenuItem>
                                        </Box>
                                    ))}
                                    <Box display='flex' justifyContent='center' sx={{ mt: 1 }}>
                                        <Pagination color='primary' page={limit} count={Math.ceil(total / 10)} onChange={handlePaginate} />
                                    </Box>
                                </Menu>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ flex: 1, display: 'flex', width: matches ? '100%' : 'auto' }}>
                            <TableContainer sx={{ mr: matches ? 0 : 5, mt: matches ? 2 : 0 }}>
                                <Table aria-label="employment details table" size="small">
                                    <TableBody>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Date Employed</TableCell>
                                            <TableCell align="left">{info.date_hired ? moment(info.date_hired).format('MMM-DD-YYYY') : (<Skeleton variant='text' width='70%' />)}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Office Assigned</TableCell>
                                            <TableCell align="left">{info.dept_title ? info.dept_title : (<Skeleton variant='text' width='70%' />)}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left" width="40%">Employment Status</TableCell>
                                            <TableCell align="left" width="40%">{info.emp_type ? (
                                                <>
                                                    {info.emp_type === 1 ? 'PERMANENT' :
                                                        info.emp_type === 2 ? 'TEMPORARY' :
                                                            info.emp_type === 3 ? 'PRESIDENTIAL APPOINTEES' :
                                                                info.emp_type === 4 ? 'CO-TERMINOS' :
                                                                    info.emp_type === 5 ? 'PERMANENT' : null
                                                    }
                                                </>
                                            ) : (<Skeleton variant='text' width='70%' />)}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left" width="40%">Contact No.</TableCell>
                                            <TableCell align="left" width="60%">{info.cpno ? info.cp : (<Skeleton variant='text' width='70%' />)}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left" width="40%">Email Add</TableCell>
                                            <TableCell align="left" width="60%">{info.emailadd ? info.emailadd : (<Skeleton variant='text' width='70%' />)}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">Last Login</TableCell>
                                            <TableCell align="left"> {info.updated_at ? moment(info.updated_at).format('MMM-DD-YYYY hh:mm a') : (<Skeleton variant='text' width='70%' />)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card >
    )
}

export default EmployeeInfo