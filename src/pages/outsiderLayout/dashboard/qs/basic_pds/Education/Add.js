import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// import PropTypes from 'prop-types';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForward from '@mui/icons-material/ArrowForward';

import axios from 'axios';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import moment from 'moment'

import CustomBackdrop from '../../CustomBackdrop';

import { PdsContext } from '../../../applicantPds/MyContext';
import ApplicantPdsSelect from '../../ApplicantPdsSelect';
import { Close } from '@mui/icons-material';

const Add = ({ education, setEducation, handleClose, total, setTotal }) => {

    const { contextId } = useContext(PdsContext) || '' // temporary contextId
    const [inputState, setInputState] = useState({
        elevel: '',
        nschool: '',
        degreecourse: '',
        yeargrad: '',
        gradelevel: '',
        datefrom: '',
        dateto: '',
        honor: '',
        highest: '',
        file_path: ''
    })

    const [imgPreview, setImgPreview] = useState('')

    const handleChange = (e) => {
        setInputState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleUpload = (e) => {
        setInputState(prev => ({ ...prev, file_path: e.target.files[0] }))
        setImgPreview(URL.createObjectURL(e.target.files[0]))
    }

    // backdrop states
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const handleOpenBackdrop = () => setOpenBackdrop(true)
    const handleCloseBackdrop = () => setOpenBackdrop(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
       
        if (inputState.file_path) {
            const allowedExt = ['jpg', 'png', 'jpeg', 'pdf']
            if (!allowedExt.includes(inputState.file_path.name.slice((Math.max(0, inputState.file_path.name.lastIndexOf(".")) || Infinity) + 1))) {
                toast.warning('Invalid file extension')
                return
            }
        }
        let formData = new FormData()

        if (!inputState.file_path) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Continue without attaching a file",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue?'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    handleOpenBackdrop()
                    Swal.showLoading()
                    formData.append('elevel', inputState.elevel)
                    formData.append('nschool', inputState.nschool)
                    formData.append('gradelevel', inputState.gradelevel)
                    formData.append('degreecourse', inputState.degreecourse)
                    formData.append('yeargrad', inputState.yeargrad)
                    formData.append('datefrom', moment(inputState.datefrom.$d).format('YYYY-MM-DD'))
                    formData.append('dateto', moment(inputState.dateto.$d).format('YYYY-MM-DD'))
                    formData.append('honor', inputState.honor)
                    formData.append('highest', inputState.highest)
                    formData.append('file_path', '')
                    formData.append('contextId', contextId)  // temporary contextId
                    let res = await axios.post(`/api/recruitment/applicant/pds/Education/submitEducation`, formData)
                    handleCloseBackdrop()
                    Swal.close()
                    if (res.data.status === 200) {
                        let tempEducation = education.map(x => x)
                        tempEducation.unshift({
                            id: res.data.id,
                            elevel: inputState.elevel,
                            nschool: inputState.nschool,
                            gradelevel: inputState.gradelevel,
                            degreecourse: inputState.degreecourse,
                            yeargrad: inputState.yeargrad,
                            datefrom: moment(inputState.datefrom.$d).format('YYYY-MM-DD'),
                            dateto: moment(inputState.dateto.$d).format('YYYY-MM-DD'),
                            honor: inputState.honor,
                            highest: inputState.highest,
                            file_path: inputState.file_path ? URL.createObjectURL(inputState.file_path) : '',
                            isNew: true
                        })
                        tempEducation = tempEducation.slice(0, 5)
                        setEducation(tempEducation)
                        toast.success('Entry saved!',{autoClose:1000})
                        handleClose()
                        if (total % 5 == 0)
                            setTotal(prev => prev + 1)
                    }
                }
            })
        }
        else {
            handleOpenBackdrop()
            formData.append('elevel', inputState.elevel)
            formData.append('nschool', inputState.nschool)
            formData.append('gradelevel', inputState.gradelevel)
            formData.append('degreecourse', inputState.degreecourse)
            formData.append('yeargrad', inputState.yeargrad)
            formData.append('datefrom',moment(inputState.datefrom.$d).format('YYYY-MM-DD'))
            formData.append('dateto', moment(inputState.dateto.$d).format('YYYY-MM-DD'))
            formData.append('honor', inputState.honor)
            formData.append('highest', inputState.highest)
            formData.append('file_path', inputState.file_path)
            formData.append('contextId', contextId)  // temporary contextId
            let res = await axios.post(`/api/recruitment/applicant/pds/Education/submitEducation`, formData)
            Swal.close()
            handleCloseBackdrop()
            if (res.data.status === 200) {
                let tempEducation = education.map(x => x)
                tempEducation.unshift({
                    id: res.data.id,
                    elevel: inputState.elevel,
                    nschool: inputState.nschool,
                    gradelevel: inputState.gradelevel,
                    degreecourse: inputState.degreecourse,
                    yeargrad: inputState.yeargrad,
                    datefrom: moment(inputState.datefrom.$d).format('YYYY-MM-DD'),
                    dateto: moment(inputState.dateto.$d).format('YYYY-MM-DD'),
                    honor: inputState.honor,
                    highest: inputState.highest,
                    file_path: URL.createObjectURL(inputState.file_path),
                    isNew: true
                })
                tempEducation = tempEducation.slice(0, 5)
                setEducation(tempEducation)
                toast.success('Entry saved!',{autoClose:1000})
                handleClose()
                if (total % 5 == 0)
                    setTotal(prev => prev + 1)
            }
        }

    }

    return (
        <Container >
            <CustomBackdrop open={openBackdrop} handleOpen={handleOpenBackdrop} handleClose={handleCloseBackdrop} />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100vh - 66px)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="level-simple-select-label">Level</InputLabel>
                        <Select
                            labelId="level-simple-select-label"
                            id="level-simple-select"
                            label="Level"
                            size='small'
                            name="elevel"
                            onChange={handleChange}
                            value={inputState.elevel}
                        >
                            <MenuItem value='ELEMENTARY'>ELEMENTARY</MenuItem>
                            <MenuItem value='SECONDARY'>SECONDARY</MenuItem>
                            <MenuItem value='VOCATIONAL/TRADE COURSE'>VOCATIONAL/TRADE COURSE</MenuItem>
                            <MenuItem value='COLLEGE'>COLLEGE</MenuItem>
                            <MenuItem value='GRADUATE STUDIES'>GRADUATE STUDIES</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id=""
                        label="Name of School"
                        fullWidth
                        size='small'
                        name="nschool"
                        onChange={handleChange}
                        value={inputState.nschool}
                    />
                    <TextField
                        id=""
                        label="Grade Level"
                        fullWidth
                        size='small'
                        name="gradelevel"
                        onChange={handleChange}
                        value={inputState.gradelevel}
                    />
                    <ApplicantPdsSelect size='small' componentTitle='BASIC EDUCATION/DEGREE/COURSE' optionTitle='course_name' setTitle={setInputState} title='degreecourse' url='/api/pds/education/add/autoCompele' />
                    <Typography variant="body1" color="initial" align='center'>Period Attendance</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker
                                views={['year', 'month']}
                                label="FROM"
                                minDate={dayjs('2012-03-01')}
                                maxDate={dayjs('2023-06-01')}
                                name="datefrom"
                                fullWidth
                                onChange={(newValue) => {
                                    setInputState(prev => ({ ...prev, datefrom: newValue }))
                                }}
                                value={inputState.datefrom}
                                renderInput={(params) => <TextField fullWidth required size='small' {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker
                                views={['year', 'month']}
                                label="TO"
                                minDate={dayjs('2012-03-01')}
                                maxDate={dayjs(moment(new Date()).format('YYYY-MM-DD'))}
                                name="dateto"
                                fullWidth
                                onChange={(newValue) => {
                                    console.log(newValue)
                                    setInputState(prev => ({ ...prev, dateto: newValue }))
                                }}
                                value={inputState.dateto}
                                renderInput={(params) => <TextField fullWidth required {...params} size='small' helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <TextField
                        id=""
                        label="Higest level/units earned"
                        fullWidth
                        size='small'
                        type='number'
                        name="highest"
                        onChange={handleChange}
                        value={inputState.highest}
                    />
                    <TextField
                        id=""
                        label="Year Graduated"
                        fullWidth
                        size='small'
                        type='number'
                        name="yeargrad"
                        onChange={handleChange}
                        value={inputState.yeargrad}
                    />
                    <TextField
                        id=""
                        label="Scholarship/Academic honors received"
                        fullWidth
                        size='small'
                        name="honor"
                        onChange={handleChange}
                        value={inputState.honor}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between',flexDirection:'column' }}>
                    {inputState.file_path?.name && (
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Typography variant="body1" color="initial">{inputState.file_path?.name?.length > 20 ? <>. . .{inputState.file_path?.name?.slice(inputState.file_path?.name?.length - 15, -1)}</> : inputState.file_path?.name}</Typography>
                                <Close sx={{ bgcolor: 'error.main', color: '#fff', borderRadius: '100%', fontSize: 20, ml: 1, cursor: 'pointer' }} onClick={() => setInputState(prev => ({ ...prev, file_path: '' }))} />
                            </Box>
                        )}
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" component="label" startIcon={<AttachFileIcon />} sx={{ borderRadius: '2rem' }} >
                                Upload file
                                <input hidden accept="image/*" type="file" onChange={handleUpload} />
                            </Button>
                        </Box>
                    </Box>
                    {/* <img src={imgPreview} /> */}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flex: 1, justifyContent: 'flex-end', pb: 2 }}>
                    <Button variant="contained" color="primary" sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} type="submit">
                        Submit
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default React.memo(Add);
