import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AsyncCreatableSelect from 'react-select/async-creatable';

// import PropTypes from 'prop-types';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForward from '@mui/icons-material/ArrowForward';

import axios from 'axios';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import CustomBackdrop from '../../CustomBackdrop';

import { PdsContext } from '../../../applicantPds/MyContext';
import { Close } from '@mui/icons-material';

let filterTimeout = null
const Add = ({ trainings, setTrainings, handleClose, total, setTotal }) => {
    const { contextId } = useContext(PdsContext) || '' // temporary contextId

    const [isPresent, setIsPresent] = useState(false)
    const [inputState, setInputState] = useState({
        datefrom: '',
        dateto: '',
        positiontitle: '',
        agency: '',
        salary: '',
        salgrade: '',
        status: '',
        govt: '',
        appt_id: '',
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

    // functions
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
                    formData.append('datefrom', inputState.datefrom)
                    formData.append('dateto', isPresent ? 'Present' : inputState.dateto)
                    formData.append('positiontitle', inputState.positiontitle)
                    formData.append('agency', inputState.agency)
                    formData.append('salary', inputState.salary)
                    formData.append('salgrade', inputState.salgrade)
                    formData.append('status', inputState.status)
                    formData.append('govt', inputState.govt)
                    formData.append('appt_id', inputState.appt_id)
                    formData.append('file_path', '')
                    formData.append('contextId', contextId)  // temporary contextId
                    let res = await axios.post(`/api/recruitment/applicant/pds/WorkExp/submitWorkExp`, formData)
                    Swal.close()
                    handleCloseBackdrop()
                    if (res.data.status === 200) {
                        let tempTrainings = trainings.map(x => x)
                        tempTrainings.unshift({
                            id: res.data.id,
                            datefrom: inputState.datefrom,
                            dateto: isPresent ? 'Present' : inputState.dateto,
                            positiontitle: inputState.positiontitle,
                            agency: inputState.agency,
                            salary: inputState.salary,
                            salgrade: inputState.salgrade,
                            status: inputState.status,
                            govt: inputState.govt,
                            appt_id: inputState.appt_id,
                            file_path: inputState.appt_id ? URL.createObjectURL(inputState.file_path) : '',
                            isNew: true
                        })
                        tempTrainings = tempTrainings.slice(0, 5)
                        setTrainings(tempTrainings)
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
            formData.append('datefrom', inputState.datefrom)
            formData.append('dateto', isPresent ? 'Present' : inputState.dateto)
            formData.append('positiontitle', inputState.positiontitle)
            formData.append('agency', inputState.agency)
            formData.append('salary', inputState.salary)
            formData.append('salgrade', inputState.salgrade)
            formData.append('status', inputState.status)
            formData.append('govt', inputState.govt)
            formData.append('appt_id', inputState.appt_id)
            formData.append('file_path', inputState.file_path)
            formData.append('contextId', contextId)  // temporary contextId
            let res = await axios.post(`/api/recruitment/applicant/pds/WorkExp/submitWorkExp`, formData)
            Swal.close()
            handleCloseBackdrop()
            if (res.data.status === 200) {
                let tempTrainings = trainings.map(x => x)
                tempTrainings.unshift({
                    id: res.data.id,
                    datefrom: inputState.datefrom,
                    dateto: isPresent ? 'Present' : inputState.dateto,
                    positiontitle: inputState.positiontitle,
                    agency: inputState.agency,
                    salary: inputState.salary,
                    salgrade: inputState.salgrade,
                    status: inputState.status,
                    govt: inputState.govt,
                    appt_id: inputState.appt_id,
                    file_path: URL.createObjectURL(inputState.file_path),
                    isNew: true
                })
                tempTrainings = tempTrainings.slice(0, 5)
                setTrainings(tempTrainings)
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
                    <Typography variant="body1" color="initial" align='center' sx={{ color: 'primary.main' }}>INCLUSIVE DATES</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            id=""
                            label="Date from"
                            fullWidth
                            size='small'
                            type='date'
                            name="datefrom"
                            onChange={handleChange}
                            value={inputState.datefrom}
                            required
                            focused
                        />
                        <TextField
                            id=""
                            label="Date to"
                            fullWidth
                            size='small'
                            type='date'
                            focused
                            name="dateto"
                            onChange={handleChange}
                            value={inputState.dateto}
                            disabled={isPresent}
                            required
                        />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked checked={isPresent} />} onChange={e => setIsPresent(prev => !prev)} label="Present" />
                        </FormGroup>
                    </Box>
                    <TextField
                        id=""
                        label="POSITION TITLE
                        (Write in full/Do not abbreviate)"
                        fullWidth
                        size='small'
                        name="positiontitle"
                        onChange={handleChange}
                        value={inputState.positiontitle}
                    />
                    <TextField
                        id=""
                        label="DEPARTMENT/AGENCY/OFFICE/COMPANY
                        (Write in full/Do not abbreviate)"
                        fullWidth
                        size='small'
                        name="agency"
                        onChange={handleChange}
                        value={inputState.agency}
                    />
                    <TextField
                        id=""
                        label="MONTHLY SALARY"
                        fullWidth
                        size='small'
                        name="salary"
                        type='number'
                        onChange={handleChange}
                        value={inputState.salary}
                    />
                    <TextField
                        id=""
                        label="SALARY/JOB/PAY GRADE(if applicable) & STEP (Formal*00-0)/INCREMENT"
                        fullWidth
                        size='small'
                        name="salgrade"
                        onChange={handleChange}
                        value={inputState.salgrade}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="emp_status-simple-select-label">EMPLOYMENT STATUS</InputLabel>
                        <Select
                            labelId="emp_status-select-label"
                            id="emp_status-select"
                            value={inputState.status}
                            name="status"
                            size='small'
                            label="EMPLOYMENT STATUS"
                            onChange={handleChange}
                        >
                            <MenuItem value="RE">Permanent</MenuItem>
                            <MenuItem value="TE">Temporary</MenuItem>
                            <MenuItem value="PA">Presidential Appointee</MenuItem>
                            <MenuItem value="CT">Co-Terminos</MenuItem>
                            <MenuItem value="CN">Contractual</MenuItem>
                            <MenuItem value="CS">Casual</MenuItem>
                            <MenuItem value="JO">Job Order</MenuItem>
                            <MenuItem value="CO">Consultant</MenuItem>
                            <MenuItem value="COS">Contract of Service</MenuItem>
                            <MenuItem value="EL">Elective</MenuItem>
                            <MenuItem value="HN">Honorarium</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="govt-simple-select-label">GOVERNMENT SERVICE</InputLabel>
                        <Select
                            labelId="govt-select-label"
                            id="govt-select"
                            name="govt"
                            size='small'
                            onChange={handleChange}
                            value={inputState.govt}
                            label="STATUS OF APPOINTMENT"
                        >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={0}>NO</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        {inputState?.file_path?.name && (
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Typography variant="body1" color="initial">{inputState.file_path?.name?.length > 20 ? <>. . .{inputState.file_path?.name?.slice(inputState.file_path?.name?.length - 15, -1)}</> : inputState.file_path?.name}</Typography>
                                <Close sx={{ bgcolor: 'error.main', color: '#fff', borderRadius: '100%', fontSize: 20, ml: 1, cursor: 'pointer' }} onClick={() => setInputState(prev => ({ ...prev, file_path: '' }))} />
                            </Box>
                        )}
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" component="label" color='primary' startIcon={<AttachFileIcon />} sx={{ borderRadius: '2rem' }} >
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
