import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// import PropTypes from 'prop-types';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForward from '@mui/icons-material/ArrowForward';

import axios from 'axios';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import CustomBackdrop from '../../CustomBackdrop';

import { PdsContext } from '../../../applicantPds/MyContext';
import ApplicantPdsSelect from '../../ApplicantPdsSelect';
import { Close } from '@mui/icons-material';

let filterTimeout = null
const Add = ({ trainings, setTrainings, handleClose, total, setTotal }) => {

    const { contextId } = useContext(PdsContext) || '' // temporary contextId

    const [inputState, setInputState] = useState({
        title: '',
        datefrom: '',
        dateto: '',
        nohours: '',
        conducted: '',
        typeLD: '',
        file_path: ''
    })

    const [others, setOthers] = useState(false)
    const [othersData, setOthersData] = useState('')

    // backdrop states
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const handleOpenBackdrop = () => setOpenBackdrop(true)
    const handleCloseBackdrop = () => setOpenBackdrop(false)

    const [imgPreview, setImgPreview] = useState('')

    const handleChange = (e) => {
        setInputState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleUpload = (e) => {
        setInputState(prev => ({ ...prev, file_path: e.target.files[0] }))
        setImgPreview(URL.createObjectURL(e.target.files[0]))
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
                confirmButtonText: 'Continue?!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    handleOpenBackdrop()
                    let formData = new FormData()
                    formData.append('title', inputState.title)
                    formData.append('datefrom', inputState.datefrom)
                    formData.append('dateto', inputState.dateto)
                    formData.append('nohours', inputState.nohours)
                    formData.append('conducted', inputState.conducted)
                    formData.append('typeLD', others ? othersData : inputState.typeLD)
                    formData.append('file_path', '')
                    formData.append('contextId', contextId)  // temporary contextId

                    let res = await axios.post(`/api/recruitment/applicant/pds/Trainings/submitTrainings`, formData)
                    Swal.close()
                    handleCloseBackdrop()
                    if (res.data.status === 200) {
                        let tempTrainings = trainings.map(x => x)
                        tempTrainings.unshift({
                            id: res.data.id,
                            title: inputState.title,
                            datefrom: inputState.datefrom,
                            dateto: inputState.dateto,
                            nohours: inputState.nohours,
                            conducted: inputState.conducted,
                            typeLD: others ? othersData : inputState.typeLD,
                            file_path: inputState.file_path ? URL.createObjectURL(inputState.file_path) : '',
                            isNew: true
                        })
                        tempTrainings = tempTrainings.slice(0, 5)
                        setTrainings(tempTrainings)
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
            let formData = new FormData()
            formData.append('title', inputState.title)
            formData.append('datefrom', inputState.datefrom)
            formData.append('dateto', inputState.dateto)
            formData.append('nohours', inputState.nohours)
            formData.append('conducted', inputState.conducted)
            formData.append('typeLD', others ? othersData : inputState.typeLD)
            formData.append('file_path', inputState.file_path)
            formData.append('contextId', contextId)  // temporary contextId
            let res = await axios.post(`/api/recruitment/applicant/pds/Trainings/submitTrainings`, formData)
            Swal.close()
            handleCloseBackdrop()
            if (res.data.status === 200) {
                let tempTrainings = trainings.map(x => x)
                tempTrainings.unshift({
                    id: res.data.id,
                    title: inputState.title,
                    datefrom: inputState.datefrom,
                    dateto: inputState.dateto,
                    nohours: inputState.nohours,
                    conducted: inputState.conducted,
                    typeLD: others ? othersData : inputState.typeLD,
                    file_path: inputState.file_path ? URL.createObjectURL(inputState.file_path) : '',
                    isNew: true
                })
                tempTrainings = tempTrainings.slice(0, 5)
                setTrainings(tempTrainings)
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
                    <ApplicantPdsSelect componentTitle='TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS' optionTitle='title_of_training' url='/api/pds/trainings/add/AutoComplete' title='title' setTitle={setInputState} size='small' />
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
                            required
                        />
                    </Box>
                    <TextField
                        id=""
                        label="No. of hours"
                        fullWidth
                        size='small'
                        type='number'
                        name="nohours"
                        onChange={handleChange}
                        value={inputState.nohours}
                        required
                    />
                    <Box display='flex' gap={1}>
                        {others ? (
                            <TextField
                                id=""
                                label="Other Type LD"
                                fullWidth
                                size='small'
                                name="others"
                                required
                                onChange={(e) => setOthersData(e.target.value)}
                                value={othersData}
                            />
                        ) : (
                            <FormControl fullWidth>
                                <InputLabel id="typeLD-simple-select-label">Type LD</InputLabel>
                                <Select
                                    labelId="typeLD-simple-select-label"
                                    id="typeLD-simple-select"
                                    name="typeLD"
                                    label="Type LD"
                                    onChange={handleChange}
                                    value={inputState.typeLD}
                                    size='small'
                                    required
                                >
                                    <MenuItem value='MANAGERIAL'>MANAGERIAL</MenuItem>
                                    <MenuItem value='SUPERVISORY'>SUPERVISORY</MenuItem>
                                    <MenuItem value='TECHNICAL'>TECHNICAL</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={others} />} onClick={() => setOthers(prev => !prev)} label="Others" />
                        </FormGroup>
                    </Box>

                    <TextField
                        id=""
                        label="Conducted by"
                        fullWidth
                        size='small'
                        name="conducted"
                        onChange={handleChange}
                        value={inputState.conducted}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        {inputState?.file_path?.name && (
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Typography variant="body1" color="initial">{inputState.file_path?.name?.length > 20 ? <>. . .{inputState.file_path?.name?.slice(inputState.file_path?.name?.length - 15, -1)}</> : inputState.file_path?.name}</Typography>
                                <Close sx={{ bgcolor: 'error.main', color: '#fff', borderRadius: '100%', fontSize: 20, ml: 1, cursor: 'pointer' }} onClick={() => setInputState(prev => ({ ...prev, file_path: '' }))} />
                            </Box>
                        )}
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color='primary' component="label" startIcon={<AttachFileIcon />} sx={{ borderRadius: '2rem' }} >
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
