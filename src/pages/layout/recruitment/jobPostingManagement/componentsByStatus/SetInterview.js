import React, { useState, useContext, useEffect, useRef } from 'react';
import Button from '@mui/material/Button'
import { orange, red } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import TextField from '@mui/material/TextField'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Skeleton from '@mui/material/Skeleton'
import Pagination from '@mui/material/Pagination'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel'
import Fade from '@mui/material/Fade'

import ArrowForward from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add'

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';

import CustomBackdrop from './CustomBackdrop';

import axios from 'axios';
import Fab from '@mui/material/Fab'
import Divider from '@mui/material/Divider'
import Warnings from './receivingApplicants/Warnings';


let timer = null

const SetInterview = ({ data, closeDialog }) => {

    const [list, setList] = useState([])
    const listRef = useRef(true)
    const [listTrigger, setListTrigger] = useState(false)
    const [panelCheckerTrigger, setPanelCheckerTrigger] = useState(false)
    let controller = new AbortController()
    // for backdrop status
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    // 
    const [placeDate, setPlaceDate] = useState([
        {
            id: Math.random().toString(36).slice(2, 7),
            place: '',
            date: '',
            panels: []
        }
    ])
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)
    const [placeDateInputValue, setPlaceDateInputValue] = useState([])

    const [loader, setLoader] = useState(true)
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const [panelList, setPanelList] = useState([])
    const [defaultList, setDefaultList] = useState([])
    const [time, setTime] = useState('')
    const [panelLoader, setPanelLoader] = useState(true)
    const [venue, setVenue] = useState([])

    // pagination
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const perPage = 5

    const [defaultPanels, setDefaultPanels] = useState([{}])

    const handlePaginate = (e, v) => { // frontend pagination
        console.log(v)
        if (page === v) {
            return
        }
        let pageStart = (v - 1) * perPage
        let pageEnd = v * perPage
        if (defaultList.length < pageEnd) {
            pageEnd = defaultList.length
        }
        setList(defaultList.slice(pageStart, pageEnd))
        setPage(v)
    }

    const handleChange = (e, index) => {
        let newPlaceDate = placeDate.map((item, i) => {
            if (i === index)
                return { ...item, [e.target.name]: e.target.value }
            else
                return item
        })
        setPlaceDate(newPlaceDate)
    }

    const handlePlaceDateInput = (e, index) => {
        let newList = list.map((item, i) => {
            if (i === index)
                return { ...item, placeDate: e.target.value }
            else
                return item
        })
        setList(newList)
    }

    const handleTime = (e, index) => {
        let newList = list.map((item, i) => {
            if (i === index)
                return { ...item, time: e.target.value }
            else
                return item
        })
        setList(newList)
    }

    const handleAddPlaceDate = () => {
        if (placeDate.length > 4) {
            toast.warning('Limit to 5 only!')
            return
        }
        setPlaceDate(prev => [...prev, { place: '', date: '', id: Math.random().toString(36).slice(2, 7), panels: defaultPanels }])
    }

    const handleRemoveItem = (e, index, item) => {
        console.log(item)
        if (placeDate.length === 1) {
            return
        }
        let newPlaceDate = placeDate.filter((x, i) => x.id !== item.id)
        setPlaceDate(newPlaceDate)
    }

    const handleStorePanels = (e, v, index) => {
        let newPlaceDate = placeDate.map((item, i) => {
            if (i === index) {
                // to change original panelist in List array to be equal to the panelist in venue and date panelist
                let newList = list.map((x, xI) => {
                    if (x.place === item.place && x.date === item.date) {
                        return { ...x, placeDate: { ...x.placeDate, panels: item.panels } }
                    }
                    else {
                        return x
                    }
                })
                setList(newList)
                // 

                return { ...item, panels: v }
            }
            else return item
        })
        setPlaceDate(newPlaceDate)
    }

    const checkIfEqual = () => { // check if items panels are equal with venue and date panels
        placeDate.map((item, index) => {
            let newList = list.map((x, i) => {
                if (x.placeDate.place === item.place && x.placeDate.date === item.date) {
                    if (x?.placeDate?.panels?.length !== item?.panels?.length) {
                        return { ...x, placeDate: { ...x.placeDate, panels: {} } }
                    }
                    else {
                        return x
                    }
                }
                else {
                    return x
                }
            })
            setList(newList)
            setPanelCheckerTrigger(true)
        })
    }


    const fetchPanel = async (controller) => {
        let res = await axios.post(`/api/recruitment/jobPosting/status/set-interview/fetchPanelist`, { vacancy_id: data })
        console.log('panel', res)
        console.log('list', list)
        setDefaultPanels(res.data.panel_lists)
        setPlaceDate(prev => [{ ...prev, panels: res.data.panel_lists }])
        setPanelLoader(false)
    }

    const getInterviewees = async () => {
        let res = await axios.get(`/api/recruitment/jobPosting/status/set-interview/getShortlist?vacancyId=${data}`, {}, { signal: controller.signal })
        console.log('interviewees', res)
        let newList = res.data.data.map((item, index) => ({ ...item, time: '', placeDate: {} }))
        setDefaultList(newList)
        setTotal(newList.length)
        setLoader(false)
        setList(newList.slice(0, perPage))
        console.log(newList)
        setListTrigger(prev => !prev)
    }

    const fetchVenue = async (controller) => {
        const res = await axios.post(`/api/recruitment/jobPosting/getVenue`, {}, { signal: controller.signal })
        console.log(res)
        setVenue(res.data)
    }

    const handleSendNotif = async () => {
        let listToSend = list.filter((item, index) => {
            if (item?.placeDate?.date && item?.placeDate?.place && item?.placeDate?.panels.length > 0)
                return item
        })

        if (listToSend.length === 0) {
            toast.warning('Check if Items are filled!')
            return
        }

        listToSend.forEach((item, i) => {
            if (!item.placeDate.place || !item.placeDate.date || item?.placeDate?.panels.length <= 0) {
                toast.warning('Place, date and panels are required fields.')
                return
            }
        })

        Swal.fire({
            title: "Send Notification?",
            html: listToSend.length !== list.length ? "<p>Some candidates' venues weren't set. <br/>They may be taken off the list as a result of this. Continue?</p>" : "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let flag = false

                setStatusBackdrop(true)
                let res = await axios.post(`/api/recruitment/jobPosting/status/set-interview/sendNotif`, { data: listToSend, vacancy_id: data })
                console.log(res)
                setStatusBackdrop(false)
                if (res.data.status === 200) {
                    let idsArr = res.data.sent_ids
                    toast.success('Notification sent!')
                    let newDefault = defaultList.filter((item, i) => !idsArr.includes(item.profile_id))

                    setDefaultList(newDefault)
                    setTotal(newDefault.length)
                    setList(newDefault.slice(0, perPage))
                }
                setStatusBackdrop(false)
            }
        })
    }

    useEffect(() => { // effect to check of venue and date panels were change, if so, clicking send notif without setting the venue and date for each item affected will throw a warning
        if (panelCheckerTrigger) {
            handleSendNotif()
            setPanelCheckerTrigger(false)
        }

    }, [panelCheckerTrigger])


    useEffect(() => {
        getInterviewees(controller)
        fetchVenue(controller)
        return () => controller.abort()
    }, [])

    useEffect(() => {
        if (listRef.current) {
            listRef.current = false
        }
        else {
            fetchPanel(controller)
            return () => controller.abort()
        }

    }, [listTrigger])

    return (
        <Grid container sx={{ p: 1, pt: 2 }} spacing={2}>
            <CustomBackdrop title='please wait . . . ' open={statusBackdrop} />
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <Typography variant="body1" color="initial" sx={{ width: '100%', bgcolor: '#BEBEBE', p: .5, pl: 1, color: '#fff', mt: 2 }}>PANELIST</Typography>

                {!panelLoader ? (
                    <>
                        {defaultPanels && defaultPanels.map((item, i) => (
                            <Box display="flex" sx={{ my: 1 }}>
                                <AccountCircleIcon color={item?.is_chairman ? 'primary' : ''} />
                                <Typography variant="body2" color="initial" sx={{ ml: 1 }}>{item.fname} {item.mname} {item.lname}</Typography>
                            </Box>
                        ))}
                    </>
                ) : (
                    <Box>
                        {Array.from(Array(4)).map((item, i) => (
                            <Skeleton variant="text" width="" height={40} animation="pulse" />
                        ))}
                    </Box>
                )}
                <Divider
                    variant="fullWidth"
                    orientation="horizontal"

                />

                <Box display="flex" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mt: 1 }}>
                    <Button variant='contained' endIcon={<AddIcon />} sx={{ borderRadius: '2rem' }} onClick={handleAddPlaceDate}>Place and Date</Button>
                </Box>
                {placeDate.map((item, index) => (
                    <Card className="animate__animated animate__fadeInDown animate__faster" sx={{ m: .5 }} raised>
                        <CardContent>
                            <Box display="flex" my="" sx={{ flexDirection: 'column', m: 0, p: 0, alignItems: 'flex-start' }} key={index}>
                                <Box display="flex" sx={{ justifyContent: 'space-between', width: '100%', alignItems: 'center', mb: 1 }}>
                                    <IconButton size='small' color="primary">
                                        <Typography variant="body2" color="warning.main">VENUE [ {index + 1} ]</Typography>
                                    </IconButton>
                                    <CancelIcon color='error' sx={{ cursor: 'pointer' }} onClick={(e) => handleRemoveItem(e, index, item)} />
                                </Box>
                                <Box display="flex" sx={{ gap: 1, my: 2, alignItems: 'center', flexDirection: 'row', m: 0, p: 0, width: '100%' }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="venue">Venue</InputLabel>
                                        <Select
                                            labelId="venue"
                                            id="venue"
                                            label="Venue"
                                            size='small'
                                            name="place"
                                            fullWidth
                                            value={item?.place}
                                            onChange={(e) => handleChange(e, index)}
                                        >
                                            {venue && venue.map((item, index) => (
                                                <MenuItem key={item.id} value={item.venue_name}>{item.venue_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        id=""
                                        label="DATE"
                                        focused
                                        value={item.date}
                                        type="date"
                                        size='small'
                                        name="date"
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </Box>
                                <Typography variant="body2" color="warning.main" sx={{ mt: 1, pl: .5 }}>SET PANELS</Typography>
                                <Box display="flex" sx={{ gap: 1, width: '100%' }}>
                                    <Autocomplete
                                        onChange={(e, v) => handleStorePanels(e, v, index)}
                                        multiple
                                        fullWidth
                                        options={defaultPanels}
                                        getOptionLabel={(option) => option.fname + ' ' + option.mname + ' ' + option.lname}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label=""
                                                placeholder="panel"
                                            />
                                        )}
                                        value={item.panels}
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} height="100%">
                <Warnings arr={[
                    { color: 'primary.light', text: 'Insider applicant' }
                ]} />
                <TableContainer component={Paper} sx={{ height: '350px', maxHeight: '350px' }}>
                    <Table aria-label="set-exam table" size='small' stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>FULLNAME</TableCell>
                                <TableCell align="left">SET TIME</TableCell>
                                <TableCell align="left">SET PLACE AND DATE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loader ? (<>
                                {Array.from(Array(5)).map(x => (
                                    <TableRow>
                                        {Array.from(Array(3)).map(y => (
                                            <TableCell>
                                                <Skeleton variant="text" width="" height={35} animation="pulse" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>) : (
                                <>
                                    {list.length === 0 && (
                                        <TableRow >
                                            <TableCell sx={{ bgcolor: red[500], color: '#fff' }} align="center" colSpan={3}>No data</TableCell>
                                        </TableRow>
                                    )}
                                    {list && list.map((item, index) => (
                                        <Fade in key={item.profile_id}>
                                            <TableRow >
                                                <TableCell align="left">
                                                    <Typography variant='body2' sx={{ color: item?.employee_id ? 'primary.light' : '' }}>
                                                        {item.fname} {item.mname} {item.lname}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        size='small'
                                                        fullWidth
                                                        id=""
                                                        label=" "
                                                        type='time'
                                                        value={item.time}
                                                        onChange={(e) => handleTime(e, index)}
                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <FormControl fullWidth>
                                                        <Select
                                                            defaultValue=''
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            size='small'
                                                            value={list[index].placeDate}
                                                            onChange={(e) => handlePlaceDateInput(e, index)}
                                                        >
                                                            {placeDate.map((x, i) => (
                                                                <MenuItem key={i} value={x} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <Box display="flex" sx={{ bgcolor: 'primary.light', borderRadius: .5, p: 1 }}>
                                                                        <Typography variant='body2' color="#fff" align='center'>VENUE [ {i + 1} ]</Typography>
                                                                    </Box>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                        </Fade>
                                    ))}
                                </>
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>
                {list.length !== 0 && (
                    <Pagination page={page} count={Math.ceil(total / perPage)} color="primary" sx={{ mt: 1 }} onChange={handlePaginate} />
                )}
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color='warning' sx={{ borderRadius: '2rem' }} size="small" onClick={checkIfEqual} startIcon={<SendIcon />}>Send Notifications / interview result</Button>
                    </Box>
                    <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant='contained' color='info' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({
                            applicant: list,
                            defaultList: defaultList
                        }, 'INTERVIEW-RESULT', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed to next step/status</Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default SetInterview;