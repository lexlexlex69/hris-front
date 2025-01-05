import React, { useState, useEffect, useRef } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import { red, yellow } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SearchIcon from '@mui/icons-material/Search';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { useParams, useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { getEmployees, getEmployeesPaginate, getOffices, EmployeeMainSearch, clearFilters, handleActive, checkDetails, handleRevoke, handleViewFile, handleInactiveDateEffective, handleAddToEmployeeTable } from './Controller'
import TransferOffice from './TransferOffice'
import ViewHistory from './ViewHistory'
import ActiveInactiveUpload from './ActiveInactiveUpload';
import CommonModal from '../../../../common/Modal';
import AddEmployee from './AddEmployee';


import { toast } from 'react-toastify'
import { OutlinedInput } from '@mui/material';
import OrgStruc from './OrgStruc';

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
    },
});

function EmployeeManagementMain() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // 
    const empParam = useParams()
    const navigate = useNavigate()
    const ProfileTheme = createTheme({
        palette: {
            white: '#fff',
        },
    })

    const [employees, setEmployees] = useState([])
    const [office, setOffice] = useState('')
    const [name, setName] = useState('')
    const [position, setPosition] = useState('')
    const [loadOffices, setLoadOffices] = useState('')
    const [loader, setLoader] = useState(false)
    const [active, setActive] = useState('')
    // pagination
    const perPage = 10
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0)
    const handleChange = (event, value) => {
        if (value === page) {
            return
        }
        setPage(value);
        setEmployees([])
        getEmployeesPaginate(setEmployees, setLoader, perPage, setTotalPage, value, office, position, name, active)
    };

    // add employee modal

    const [addEmployeeModal, setAddEmployeeModal] = useState(false)

    // org struct modal
    const [openOrgStruc, setOpenOrgStruc] = useState(false)

    // transfer office modal
    const transferRef = useRef(true)
    const [openTransfer, setOpenTransfer] = useState(false);
    const [handleTransferTrigger, setHandleTransferTrigger] = useState(false)
    const [handleTransferData, setHandleTransferData] = useState('')

    // view history reassignment modal
    const historyRef = useRef(true)
    const [openHistory, setOpenHistory] = useState(false);
    const [handleHistoryTrigger, setHandleHistoryTrigger] = useState(false)
    const [handleHistoryData, setHandleHistoryData] = useState('')

    // active / inactive modal
    const activeRef = useRef(true)
    const [openActive, setOpenActive] = useState(false);
    const [handleActiveTrigger, setHandleActiveTrigger] = useState(false)
    const [handleActiveData, setHandleActiveData] = useState('')
    const [dateInactiveEffective, setDateInactiveEffective] = useState('')

    // tooltip
    const [openTooltip, setOpenTooltip] = useState(false);
    const handleTooltipClose = () => {
        setOpenTooltip(false);
    };
    const handleTooltipOpen = () => {
        setOpenTooltip(true);
    };

    // functions

    // open transfer
    const handleOpenTransfer = (item) => {
        setHandleTransferData(item)
        setHandleTransferTrigger(true)
        console.log(item)
    };
    // close transfer
    const handleCloseTransfer = () => {
        setHandleTransferTrigger(false)
        setOpenTransfer(false)
    };
    // open history
    const handleOpenHistory = (item) => {
        setHandleHistoryData(item)
        setHandleHistoryTrigger(true)
        console.log(item)
    };
    // close history
    const handleCloseHistory = () => {
        setHandleHistoryTrigger(false)
        setOpenHistory(false)
    };

    // open active
    const handleOpenActive = (item) => {
        setHandleActiveData(item)
        setHandleActiveTrigger(true)
        console.log(item)
    };
    // close active
    const handleCloseActive = () => {
        setHandleActiveTrigger(false)
        setOpenActive(false)
    };


    useEffect(() => {
        if (empParam.id) {
            return
        }
        setPage(1)
        getOffices(setLoadOffices, setLoader)
        getEmployees(setEmployees, setLoader, page, perPage, setTotalPage)
    }, [])

    // for transfer office 
    useEffect(() => {
        if (transferRef.current) {
            transferRef.current = false
        }
        else {
            if (handleTransferTrigger) {
                setOpenTransfer(true)
            }
        }
    }, [handleTransferTrigger])

    // for view history
    useEffect(() => {
        if (historyRef.current) {
            historyRef.current = false
        }
        else {
            if (handleHistoryTrigger) {
                setOpenHistory(true)
            }
        }
    }, [handleHistoryTrigger])

    // for view active/inactive upload file
    useEffect(() => {
        if (activeRef.current) {
            activeRef.current = false
        }
        else {
            if (handleActiveTrigger) {
                setOpenActive(true)
            }
        }
    }, [handleActiveTrigger])


    return (
        <>
            {/* modal for tranfer office */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openTransfer}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openTransfer}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '90%' : '40%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        px: 4,
                        py: 2
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>RE-ASSIGN OFFICE</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseTransfer} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <TransferOffice offices={loadOffices || ''} item={handleTransferData || ''} handleCloseTransfer={handleCloseTransfer} employees={employees} setEmployees={setEmployees} />
                    </Box>
                </Fade>
            </Modal>

            {/* add employee modal */}
            <CommonModal open={addEmployeeModal} title="ADD EMPLOYEE" setOpen={setAddEmployeeModal} >
                <AddEmployee loadOffices={loadOffices} closeModal={setAddEmployeeModal} setEmployees={setEmployees} employees={employees} setTotalPage={setTotalPage} totalPage={totalPage} page={page} setPage={setPage} perPage={perPage} />
            </CommonModal>
            {/* modal for view history */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openHistory}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openHistory}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '90%' : '70%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        px: 4,
                        py: 2
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>OFFICE RE-ASSIGNMENT HISTORY</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseHistory} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <ViewHistory item={handleHistoryData || ''} />
                    </Box>
                </Fade>
            </Modal>
            {/* modal for upload when clicking update status */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openActive}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openActive}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '90%' : '40%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        px: 4,
                        py: 2
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>Upload Attachment/memo</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseActive} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <ActiveInactiveUpload data={handleActiveData} employees={employees || []} setEmployees={setEmployees || ''} handleCloseActive={handleCloseActive}/>
                    </Box>
                </Fade>
            </Modal>

            <CommonModal open={openOrgStruc} setOpen={setOpenOrgStruc} customWidth='90%'>
                <OrgStruc />
            </CommonModal>
            <Box sx={{ flex: 1, px: 2 }}>
                <Box mb={2}>
                    <Button variant='contained' color="warning" sx={{ borderRadius: '2rem' }} startIcon={<CorporateFareIcon />} onClick={() => setOpenOrgStruc(true)}>
                        Office structure plotting
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, gap: 1, alignItems: 'center', alignItems: 'flex-end', flexDirection: matches ? 'column' : 'row' }}>
                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 2 }}>
                        <Tooltip title="ADD EMPLOYEE INFO">
                            <Button variant='contained' color="success" sx={{ borderRadius: '2rem' }} startIcon={<AddIcon />} onClick={() => setAddEmployeeModal(true)}>
                                Employee info
                            </Button>
                        </Tooltip>
                    </Box>
                    <Tooltip title="clear all filters">
                        <FilterAltOffIcon fontSize="medium" onClick={() => clearFilters(setOffice, setPosition, setName, setActive)} sx={{ color: 'error.main', cursor: 'pointer', alignSelf: 'center' }} />
                    </Tooltip>
                    <Box sx={{ width: matches ? '100%' : '15%' }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">OFFICE</InputLabel>
                            <Select
                                size="small"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={office}
                                variant="outlined"
                                label="OFFICE"
                                onChange={(e) => setOffice(e.target.value)}
                            >
                                {loadOffices && loadOffices.map((item, index) => (
                                    <MenuItem key={index} value={item.dept_code}>{item.dept_title}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: matches ? '100%' : '15%' }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">STATUS</InputLabel>
                            <Select
                                size="small"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={position}
                                variant="outlined"
                                label="STATUS"
                                defaultValue=''
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                <MenuItem value={1}>PERMANENT</MenuItem>
                                <MenuItem value={2}>TEMPORARY</MenuItem>
                                <MenuItem value={3}>PRESIDENTIAL APPOINTEE</MenuItem>
                                <MenuItem value={4}>CO-TERMINOS</MenuItem>
                                <MenuItem value={5}>CONTRACTUAL</MenuItem>
                                <MenuItem value={6}>CASUAL</MenuItem>
                                <MenuItem value={7}>JOB ORDER</MenuItem>
                                <MenuItem value={8}>CONSULTANT</MenuItem>
                                <MenuItem value={9}>CONTRACT OF SERVICE</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField variant="outlined" label="NAME" sx={{ width: matches ? '100%' : '16%' }} value={name} size="small" onChange={(e) => setName(e.target.value)}></TextField>
                    <Box sx={{ width: matches ? '100%' : '16%' }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-active">ACTIVE/INACTIVE</InputLabel>
                            <Select
                                size="small"
                                labelId="demo-simple-select-active"
                                id="demo-simple-select-active"
                                value={active}
                                variant="outlined"
                                label="ACTIVE/INACTIVE"
                                defaultValue='active'
                                onChange={(e) => setActive(e.target.value)}
                            >
                                <MenuItem value='active'>ACTIVE</MenuItem>
                                <MenuItem value='inactive'>INACTIVE</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: matches ? '100%' : 'auto', display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="search">
                            <SearchIcon color='primary' sx={{ fontSize: 35, cursor: 'pointer' }} onClick={() => EmployeeMainSearch(office, position, name, active, perPage, setLoader, setTotalPage, setEmployees, setPage)} />
                        </Tooltip>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="employee table">
                        <caption>TOTAL ROWS: {totalPage}</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell className="cgb-color-table" sx={{ color: '#fff' }}>Name</TableCell>
                                <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="left">Mother Office</TableCell>
                                <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="left">Office assigned</TableCell>
                                <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="left">Employment status</TableCell>
                                <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loader ? (
                                <>
                                    {
                                        employees.map((row, index) => (
                                            <Fade in key={index}>
                                                <TableRow
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: row?.employee_id ? '' : '2px solid red', bgcolor: row?.re_assign?.length > 0 && row?.re_assign[row?.re_assign?.length - 1].old_dept_id !== row?.re_assign[row?.re_assign?.length - 1].new_dept_id ? yellow[300] : 'none', cursor: row?.re_assign?.length > 0 ? 'pointer' : null }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <NoMaxWidthTooltip
                                                            placement='top-end'
                                                            arrow
                                                            componentsProps={{
                                                                tooltip: {
                                                                    sx: {
                                                                        bgcolor: 'primary.light',
                                                                        '& .MuiTooltip-arrow': {
                                                                            color: 'primary.light',
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                            title={
                                                                <Box sx={{ width: 'auto' }}>
                                                                    <Box sx={{ display: 'flex' }}>
                                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <AccountCircleIcon sx={{ color: '#fff', fontSize: 90 }} />
                                                                            {row.inactive === 1 ? (
                                                                                <Typography align='center' color='error' sx={{ bgcolor: '#fff', p: .5, borderRadius: '.2rem' }}><b>INACTIVE</b></Typography>
                                                                            ) : null}
                                                                        </Box>
                                                                        {row.inactive === 1 ? (
                                                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center', mt: 1 }}>
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%', px: 1 }}>
                                                                                    <Typography align='center'>Applied:</Typography>
                                                                                    <Typography align='center'>{row.date_inactive_apply}</Typography>
                                                                                </Box>
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%', px: 1, alignItems: 'center' }}>
                                                                                    <Typography align='center'>Effective: </Typography>
                                                                                    <Typography align='center'>{row.date_inactive_effective ? row.date_inactive_effective : (
                                                                                        <TextField type="date" label="date effective" InputProps={{ inputProps: { sx: { color: '#fff' } } }} focused variant='outlined' value={dateInactiveEffective} onChange={(e) => handleInactiveDateEffective(row.emp_no, e.target.value, setDateInactiveEffective, employees, setEmployees)} />
                                                                                    )}</Typography>
                                                                                </Box>
                                                                                <Button sx={{ mt: 1 }} variant="contained" color="warning" onClick={() => handleViewFile(row.ids, 'dashboard/employee_management/viewAttachFileActive')}>view attachment</Button>
                                                                            </Box>
                                                                        ) : null}
                                                                    </Box>
                                                                    <ThemeProvider theme={ProfileTheme} >
                                                                        <TableContainer sx={{ mt: 2 }}>
                                                                            <Table size="small">
                                                                                <TableHead>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    <TableRow>
                                                                                        <TableCell><Typography variant="body1" color="white">Gender</Typography> </TableCell>
                                                                                        <TableCell><Typography variant="body1" color="white">{row.sex}</Typography></TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell><Typography variant="body1" color="white">BIO ID</Typography></TableCell>
                                                                                        <TableCell><Typography variant="body1" color="white">{row.bio_id}</Typography></TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell><Typography variant="body1" color="white">Date of Birth</Typography></TableCell>
                                                                                        <TableCell><Typography variant="body1" color="white">{row.dob}</Typography></TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell><Typography variant="body1" color="white">Birth Address</Typography></TableCell>
                                                                                        <TableCell><Typography variant="body1" color="white">{row.baddress}</Typography></TableCell>
                                                                                    </TableRow>
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    </ThemeProvider>
                                                                </Box>
                                                            }
                                                        >
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Typography sx={{ cursor: 'pointer', width: '100%' }}>
                                                                    {row.emp_fname} {row.emp_mname} {row.emp_lname}
                                                                </Typography>
                                                            </Box>
                                                        </NoMaxWidthTooltip>
                                                    </TableCell>
                                                    <TableCell align="left">{row.dept_title}</TableCell>
                                                    <TableCell align="left">{row?.re_assign?.length > 0 && loadOffices ? loadOffices.find(x => x.dept_code === row.re_assign[row?.re_assign?.length - 1].new_dept_id).dept_title : row.dept_title}</TableCell>
                                                    <TableCell align="left">{row.emp_type && row.emp_type === 1 ? 'PERMANENT' : row.emp_type && row.emp_type === 2 ? 'TEMPORARY' : row.emp_type && row.emp_type === 3 ? 'PRESIDENTIAL APPOINTEE' : row.emp_type && row.emp_type === 4 ? 'CO-TERMINOS' : row.emp_type && row.emp_type === 5 ? 'CONTRACTUAL' : row.emp_type && row.emp_type === 6 ? 'CASUAL' : row.emp_type && row.emp_type === 7 ? 'JOB ORDER' : row.emp_type && row.emp_type === 8 ? 'CONSULTANT' : row.emp_type && row.emp_type === 9 ? 'CONTRACT OF SERVICE' : null}</TableCell>
                                                    <TableCell align="right" sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                                                        {!row?.employee_id && (
                                                            <Tooltip title="Add to employee table">
                                                                <IconButton aria-label="" sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }} onClick={() => handleAddToEmployeeTable(row, employees, setEmployees)} >
                                                                    <PersonAddIcon fontSize="medium" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}

                                                        <Tooltip title="active/inactive">
                                                            <Switch checked={row.inactive === 1 ? false : true} onChange={() => handleOpenActive(row)} />
                                                        </Tooltip>
                                                        <Tooltip title="re-assign office">
                                                            <IconButton aria-label="" sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }} onClick={() => handleOpenTransfer(row)} >
                                                                <TransferWithinAStationIcon fontSize="medium" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {row?.re_assign?.length > 0 && row.re_assign[row?.re_assign?.length - 1].old_dept_id !== row.re_assign[row?.re_assign?.length - 1].new_dept_id ? (
                                                            <Tooltip title="view history">
                                                                <HistoryToggleOffIcon onClick={() => handleOpenHistory(row)} fontSize="large" color="primary" />
                                                            </Tooltip>
                                                        ) : null}
                                                        {row?.re_assign?.length > 0 && row?.re_assign[row?.re_assign?.length - 1].old_dept_id !== row?.re_assign[row?.re_assign?.length - 1].new_dept_id ? (
                                                            <Tooltip title="revoke">
                                                                <SettingsBackupRestoreIcon onClick={() => handleRevoke(row, employees, setEmployees)} fontSize="large" color="error" />
                                                            </Tooltip>
                                                        ) : null}
                                                    </TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))
                                    }
                                </>
                            ) : (
                                <>
                                    {Array.from(Array(10)).map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ display: 'flex' }}>
                                                <AccountCircleIcon sx={{ color: 'primary.main', mr: 1 }} /> <Skeleton height={30} width='100%' />
                                            </TableCell>
                                            <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                            <TableCell align="left"><Skeleton height={35} width='100%' /></TableCell>
                                            <TableCell align="right"><Skeleton height={35} width='100%' /></TableCell>
                                            <TableCell width="15%" align="center" >
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-evenly', width: '100%' }}>
                                                    <Skeleton variant="circular" width={35} height={35} />
                                                    <Skeleton variant="circular" width={35} height={35} />
                                                    <Skeleton variant="circular" width={35} height={35} />
                                                </Box>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack spacing={1} sx={{ mt: 1 }}>
                    <Pagination varaint="contained" count={Math.ceil(totalPage / perPage)} page={page} onChange={handleChange} />
                </Stack>
            </Box>
        </>
    )
}

export default EmployeeManagementMain