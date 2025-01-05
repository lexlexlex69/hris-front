import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// import PropTypes from 'prop-types';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Close } from '@mui/icons-material';

import axios from 'axios';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import CustomBackdrop from '../../CustomBackdrop';

import { PdsContext } from '../../../applicantPds/MyContext';
import ApplicantPdsSelect from '../../ApplicantPdsSelect';


let filterTimeout = null
const Add = ({ eligibility, setEligibility, handleClose, total, setTotal }) => {

    const { contextId } = useContext(PdsContext) || '' // temporary contextId
    const [inputState, setInputState] = useState({
        title: '',
        rating: '',
        dateofexam: '',
        placeofexam: '',
        licenseno: '',
        dateissue: '',
        file_path: ''
    })
    const [others, setOthers] = useState(false)
    const [othersData, setOthersData] = useState('')
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

    // functions for react select
    const loadOptions = (inputValue, callback) => {
        clearTimeout(filterTimeout)
        if (inputValue.replace(/\s+/g, '').length === 0) return false
        filterTimeout = setTimeout(() => {
            axios.post(`/api/pds/eligibility/add/autoComplete`, {
                data: inputValue
            })
                .then(res => {
                    callback(res.data.map(i => ({
                        label: i.elig_title,
                        value: i.elig_title,
                        key: i.id
                    })))
                })
                .catch(err => toast.error(err.message))
        }, 1000)
    }

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
                    formData.append('title', inputState.title)
                    formData.append('rating', inputState.rating)
                    formData.append('dateofexam', inputState.dateofexam)
                    formData.append('placeofexam', inputState.placeofexam)
                    formData.append('licenseno', inputState.licenseno)
                    formData.append('dateissue', others ? othersData : inputState.dateissue)
                    formData.append('file_path', '')
                    formData.append('contextId', contextId)  // temporary contextId

                    let res = await axios.post(`/api/recruitment/applicant/pds/Eligibility/submitEligibility`, formData)
                    handleCloseBackdrop()
                    Swal.close()
                    if (res.data.status === 200) {
                        let tempEducation = eligibility.map(x => x)
                        tempEducation.unshift({
                            id: res.data.id,
                            title: inputState.title,
                            rating: inputState.rating,
                            dateofexam: inputState.dateofexam,
                            placeofexam: inputState.placeofexam,
                            licenseno: inputState.licenseno,
                            dateissue: others ? othersData : inputState.dateissue,
                            file_path: inputState.file_path ? URL.createObjectURL(inputState.file_path) : '',
                            isNew: true
                        })
                        tempEducation = tempEducation.slice(0, 5)
                        setEligibility(tempEducation)
                        toast.success('Entry saved!', { autoClose: 1000 })
                        handleClose()
                        if (total % 5 == 0)
                            setTotal(prev => prev + 1)
                    }
                }
            })
        }
        else {
            handleOpenBackdrop()
            formData.append('title', inputState.title)
            formData.append('rating', inputState.rating)
            formData.append('dateofexam', inputState.dateofexam)
            formData.append('placeofexam', inputState.placeofexam)
            formData.append('licenseno', inputState.licenseno)
            formData.append('dateissue', others ? othersData : inputState.dateissue)
            formData.append('file_path', inputState.file_path)
            formData.append('contextId', contextId)  // temporary contextId
            let res = await axios.post(`/api/recruitment/applicant/pds/Eligibility/submitEligibility`, formData)
            Swal.close()
            handleCloseBackdrop()
            if (res.data.status === 200) {
                let tempEducation = eligibility.map(x => x)
                tempEducation.unshift({
                    id: res.data.id,
                    title: inputState.title,
                    rating: inputState.rating,
                    dateofexam: inputState.dateofexam,
                    placeofexam: inputState.placeofexam,
                    licenseno: inputState.licenseno,
                    dateissue: others ? othersData : inputState.dateissue,
                    file_path: URL.createObjectURL(inputState.file_path),
                    isNew: true
                })
                tempEducation = tempEducation.slice(0, 5)
                setEligibility(tempEducation)
                toast.success('Entry saved!', { autoClose: 1000 })
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
                    <ApplicantPdsSelect url='/api/pds/eligibility/add/autoComplete' componentTitle='CAREER SERVICE' optionTitle='elig_title' title='title' setTitle={setInputState} size='small' />
                    <TextField
                        id=""
                        label="Rating"
                        fullWidth
                        size='small'
                        name="rating"
                        onChange={handleChange}
                        value={inputState.rating}
                        required
                    />

                    <Typography variant="body1" color="initial" align='center'>Period Attendance</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'row', md: 'column' } }}>
                        <TextField
                            id=""
                            label="Date of examination / conferment"
                            fullWidth
                            size='small'
                            type='date'
                            name="dateofexam"
                            onChange={handleChange}
                            value={inputState.dateofexam}
                            required
                            focused
                        />
                        <TextField
                            id=""
                            label="Place of examination"
                            fullWidth
                            size='small'
                            focused
                            name="placeofexam"
                            onChange={handleChange}
                            value={inputState.placeofexam}
                        />
                    </Box>
                    <Typography variant="body1" color="initial" align='center'>License (if applicable)</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'row', md: 'column' } }}>
                        <TextField
                            id=""
                            label="Number"
                            fullWidth
                            size='small'
                            name="licenseno"
                            onChange={handleChange}
                            value={inputState.licenseno}
                            focused
                            required
                        />
                        <Box display='flex' gap={1}>
                            {others ? (
                                <TextField
                                    id=""
                                    label="Others (specify e.g. N/A or PRESENT)"
                                    fullWidth
                                    size='small'
                                    focused
                                    name="othersData"
                                    onChange={(e) => setOthersData(e.target.value)}
                                    value={othersData}
                                    required
                                />
                            )
                                : (
                                    <TextField
                                        id=""
                                        label="Date of Validity"
                                        fullWidth
                                        size='small'
                                        focused
                                        type='date'
                                        name="dateissue"
                                        onChange={handleChange}
                                        value={inputState.dateissue}
                                        required
                                    />
                                )}


                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={others} />} onClick={() => setOthers(prev => !prev)} label="Others" />
                            </FormGroup>
                        </Box>

                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
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
