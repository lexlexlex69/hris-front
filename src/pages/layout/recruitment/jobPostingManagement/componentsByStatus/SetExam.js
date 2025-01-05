import React, { useState, useContext, useEffect } from 'react';
import Button from '@mui/material/Button'
import { orange, red } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import AddIcon from '@mui/icons-material/Add'
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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fab from '@mui/material/Fab';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';

import ArrowForward from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';

import CustomBackdrop from './CustomBackdrop';
import Warnings from './receivingApplicants/Warnings';

import axios from 'axios'



const SetExam = ({ data, closeDialog }) => {

    const [loader, setLoader] = useState(true)
    let controller = new AbortController()
    // for backdrop status
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const [statusNotifBackdrop, setStatusNotifBackdrop] = useState(false)
    // 
    const [placeDate, setPlaceDate] = useState([
        {
            id: 1,
            place: '',
            date: ''
        }
    ])
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)
    const [defaultList, setDefaultList] = useState([])
    const [list, setList] = useState([])
    const perPage = 5
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [venue, setVenue] = useState([])

    const handleChange = (e, index) => {
        let newPlaceDate = placeDate.map((item, i) => {
            if (i === index) {
                return { ...item, [e.target.name]: e.target.value }
            }
            else {
                return item
            }
        })
        setPlaceDate(newPlaceDate)
    }

    const handlePlaceDateInput = (e, index) => {
        let newList = list.map((item, i) => {
            if (i === index) {
                return { ...item, placeDate: e.target.value }
            }
            else return item
        })
        setList(newList)
    }

    const handleTime = (e, index) => {
        let newList = list.map((item, i) => {
            if (i === index) {
                return { ...item, time: e.target.value }
            }
            else return item
        })
        setList(newList)
    }

    const handleAddPlaceDate = () => {
        if (placeDate.length > 4) {
            toast.warning('Limit to 5 only!')
            return
        }
        setPlaceDate(prev => [...prev, { id: prev[prev.length - 1]?.id + 1, place: '', date: '' }])
    }

    const handleRemoveItem = (e, index) => {
        let selectedPlaceDate = placeDate[index]
        if (placeDate.length === 1) {
            return
        }
        let newList = list.map((item, i) => {
            if (item.placeDate.place === selectedPlaceDate.place && item.placeDate.date === selectedPlaceDate.date) {
                return { ...item, placeDate: {} }
            }
            else return item
        })

        let newDefaultList = defaultList.map((item, i) => {
            if (item.placeDate.place === selectedPlaceDate.place && item.placeDate.date === selectedPlaceDate.date) {
                return { ...item, placeDate: {} }
            }
            else return item
        })

        let newPlaceDate = placeDate.filter((item, i) => i !== index)
        setPlaceDate(newPlaceDate)
        setList(newList)
        setDefaultList(newDefaultList)
    }

    const handleSendNotif = async () => {

        let filteredList = list.filter((item => {
            if (item.time && item.placeDate.place && item.placeDate.date) {
                return item
            }
        }))
        if (filteredList.length === 0) {
            toast.warning('Time, place and date is required.')
            return
        }
        // checking if place and date are filled
        filteredList.forEach((item, i) => {
            if (!item.placeDate.place || !item.placeDate.date) {
                toast.warning('Place and date are required fields.')
                return
            }
        })
        console.log(filteredList)
        Swal.fire({
            title: "Send Notification?",
            html: filteredList.length !== list.length ? "<p>Some candidates' venues weren't set. <br/>They may be taken off the list as a result of this. Continue?</p>" : "",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setStatusNotifBackdrop(true)
                let res = await axios.post(`/api/recruitment/jobPosting/status/examination/sendNotif`, { data: data, examinees: filteredList })
                setStatusNotifBackdrop(false)
                if (res.data.status === 200) {
                    let idsArr = res.data.sent_ids
                    let newDefaultList = defaultList.filter(item => !idsArr.includes(item.profile_id))
                    setDefaultList(newDefaultList.slice(0, perPage))
                    setList(newDefaultList.slice(0, perPage))
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
            }
        })

    }

    const handlePaginate = (e, v) => {
        let startPage = (v - 1) * perPage
        let endPage = (v - 1) + perPage
        setPage(v)
        let newList = defaultList.slice(startPage, endPage)
        setList(newList)
    }

    const getExaminees = async (controller) => {
        setLoader(true)
        try {
            let res = await axios.get(`/api/recruitment/jobPosting/status/examination/getShortListSetExam?vacancyId=${data}`)
            setLoader(false)
            let newList = res.data.data.map((item, i) => {
                return { ...item, placeDate: '', time: '', id: item?.employee_id ? item?.employee_id : item?.applicant_id }
            })
            setDefaultList(newList) // for all list holder
            setList(newList.slice(0, perPage)) // for current page items holder
            setTotal(newList.length) // used in pagination pager
        }
        catch (err) {
            toast.error(err.message)
        }

    }

    const fetchVenue = async (controller) => {
        const res = await axios.post(`/api/recruitment/jobPosting/getVenue`, {}, { signal: controller.signal })
        setVenue(res.data)
    }

    useEffect(() => {
        getExaminees(controller)
        fetchVenue(controller)

        return () => controller.abort()
    }, [])
    return (
        <Grid container sx={{ p: 1, pt: 2 }} spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomBackdrop title='please wait . . . ' open={statusNotifBackdrop} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomBackdrop title='please wait . . . ' open={statusBackdrop} />
                <Box display="flex" sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Button variant='contained' sx={{ borderRadius: '2rem' }} endIcon={<AddIcon />} onClick={handleAddPlaceDate}> Place Date</Button>
                </Box>
                {placeDate.map((item, index) => (
                    <Card className="animate__animated animate__fadeInDown animate__faster" sx={{ m: 1 }}>
                        <CardContent>
                            <Box display="flex" my="" sx={{ flexDirection: 'column', m: 0, p: 0, alignItems: 'flex-start' }} key={index}>
                                <Box display="flex" sx={{ justifyContent: 'space-between', width: '100%', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" color="warning.main" sx={{ p: .5, borderRadius: .5 }}>Venue [ {item?.id} ]</Typography>
                                    <CloseIcon color='error' sx={{ cursor: 'pointer' }} onClick={(e) => handleRemoveItem(e, index)} />
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
                                        type="date"
                                        size='small'
                                        name="date"
                                        value={item?.date}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
                <Warnings arr={[
                    {
                        color: 'primary.light',
                        text: 'insider applicants'
                    }
                ]} />
                <TableContainer component={Paper} sx={{ mt: 1, height: '350px', maxHeight: '350px' }}>
                    <Table aria-label="set-exam table" size='small' stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className='cgb-color-table'>
                                    <Typography variant="body2" color="#fff">Fullname</Typography>
                                </TableCell>
                                <TableCell className='cgb-color-table'>
                                    <Typography variant="body2" color="#fff">Time</Typography>
                                </TableCell>
                                <TableCell className='cgb-color-table'>
                                    <Typography variant="body2" color="#fff">Venue</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loader ? (
                                <>
                                    {Array.from(Array(5)).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton variant="text" width="" height={35} animation="pulse" /></TableCell>
                                            <TableCell><Skeleton variant="text" width="" height={35} animation="pulse" /></TableCell>
                                            <TableCell><Skeleton variant="text" width="" height={35} animation="pulse" /></TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {list && list.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">
                                                <Typography variant="body2" sx={{ color: item?.employee_id ? 'primary.light' : '', height: '100%', width: '100%', borderRadius: .5, flex: 1 }}>{item?.fname} {item?.mname} {item?.lname}</Typography>
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
                                                        label=" "
                                                        size='small'
                                                        value={item.placeDate}
                                                        onChange={(e) => handlePlaceDateInput(e, index)}
                                                    >
                                                        {placeDate.map((item, i) => (
                                                            <MenuItem key={i} value={item} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Box display="flex" sx={{ justifyContent: 'center', width: '100%', bgcolor: 'primary.light', p: 1, borderRadius: .5 }}>
                                                                    <Typography variant='body2' color="#fff">Venue [ {i + 1} ]</Typography>
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}
                            {!loader && list && list.length === 0 && (
                                <TableRow>
                                    <TableCell sx={{ bgcolor: red[500], color: '#fff' }} colSpan={3} align='center'>empty</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {list && list.length !== 0 && (
                    <Pagination page={page} count={Math.ceil(total / perPage)} color="primary" sx={{ mt: 1 }} onChange={handlePaginate} />
                )
                }
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Box sx={{ mt: 1 }}>
                        <Button variant="contained" color='warning' disabled={list.length > 0 ? false : true} sx={{ borderRadius: '2rem' }} size="small" onClick={handleSendNotif} startIcon={<SendIcon />}>Send Notifications / For interview</Button>
                    </Box>
                    <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant='contained' color='info' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({applicant:list,defaultList:defaultList}, 'EXAM-SHORTLIST', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Proceed to next step/status</Button>
                    </Box>
                </Box>

            </Grid>
        </Grid>
    );
};

export default SetExam;