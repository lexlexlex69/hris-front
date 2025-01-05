import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';

import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Skeleton from '@mui/material/Skeleton'



const Qs = ({ id: positionId }) => {
    const [loader, setLoader] = useState(true)
    const [isQs, setIsQs] = useState(false)
    const [inputState, setInputState] = useState({
        position_id: positionId,
        sg: '',
        step: '',
        level: 'first Level',
        education: '',
        experience: '',
        training: '',
        eligibility: '',
        competency: '',
        created_at: '',
        updated_at: '',
        position_code: '',
        preferences:''
    })

    const handleChangeInput = (e) => {
        setInputState({ ...inputState, [e.target.name]: e.target.value })
    }

    const fetchQs = async (controller) => {
        try {
            let qs = await axios.post(`/api/recruitment/qs/getQs`, { position_id: positionId }, { signal: controller.signal })
            console.log(qs)
            setLoader(false)
            if (qs.data.status === 200) {
                setIsQs(true)
                setInputState({
                    id: qs.data.qs.id,
                    position_id: positionId,
                    position_code: qs.data.qs.position_id,
                    sg: qs.data.qs.sg,
                    step: qs.data.qs.step,
                    level: qs.data.qs.level,
                    education: qs.data.qs.education,
                    experience: qs.data.qs.experience,
                    training: qs.data.qs.training,
                    eligibility: qs.data.qs.eligibility,
                    competency: qs.data.qs.competency,
                    preferences: qs.data.qs.preferences
                })
            }
        }
        catch (err) {
            toast.error(err.message)
            setLoader(false)
        }

    }

    const handleSubmit = async () => {
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        try {
            let submitQs = await axios.post(`/api/recruitment/qs/updateQs`, inputState)
            console.log(submitQs)
            Swal.close()
            if (submitQs.data.status === 200) {
                toast.success('Added/Updated')
            }
            if (submitQs.data.status === 500) {
                toast.error(submitQs.data.message)
            }
        }
        catch (err) {
            toast.error(err.message)
            Swal.close()
        }

    }

    useEffect(() => {
        let controller = new AbortController()
        fetchQs(controller)
        return () => controller.abort()
    }, [])

    return (
        <Box sx={{ flexGrow: 1, pt: 1 }}>
            <CssBaseline/>
            {loader ? (
                <Box sx={{ px: 5, display: 'flex', flexDirection: 'column', gap: 5, mt: 3 }}>
                    <Skeleton variant="text" width="" />
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Skeleton variant="text" width="20%" height="" animation="pulse" />
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ width: '100%' }}>
                        {!isQs && <Alert severity="warning" fullWidth>Position doesn't have entry for qs yet</Alert>}
                    </Box>
                    {/* <TextField
                        id=""
                        label="Salary grade"
                        fullWidth
                        name='sg'
                        size='small'
                        type='number'
                        value={inputState.sg}
                        onChange={handleChangeInput}
                    /> */}
                    <TextField
                        id=""
                        label="Education"
                        size='small'
                        fullWidth
                        name='education'
                        value={inputState.education}
                        onChange={handleChangeInput}
                    />
                    <TextField
                        id=""
                        label="Training"
                        size='small'
                        fullWidth
                        name='training'
                        value={inputState.training}
                        onChange={handleChangeInput}
                    />
                    <TextField
                        id=""
                        label="Experience"
                        size='small'
                        fullWidth
                        name='experience'
                        value={inputState.experience}
                        onChange={handleChangeInput}
                    />
                    <TextField
                        id=""
                        label="Eligibility"
                        size='small'
                        fullWidth
                        name='eligibility'
                        value={inputState.eligibility}
                        onChange={handleChangeInput}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Level</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                        size='small'
                        label="Level"
                            name='level'
                            value={inputState.level}
                            onChange={handleChangeInput}
                        >
                            <MenuItem value="1st Level">First Level</MenuItem>
                            <MenuItem value="2nd Level">Second Level</MenuItem>
                            <MenuItem value="3rd Level">Third Level</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id=""
                        label="Competency"
                        size='small'
                        fullWidth
                        name='competency'
                        multiline
                        rows={3}
                        value={inputState.competency}
                        onChange={handleChangeInput}
                    />
                     <TextField
                        id=""
                        label="Preferences"
                        size='small'
                        fullWidth
                        multiline
                        rows={3}
                        name='preferences'
                        value={inputState.preferences}
                        onChange={handleChangeInput}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Button variant="contained" startIcon={<ArrowForwardIcon />} color="primary" sx={{ borderRadius: '2rem' }} onClick={handleSubmit}>
                            save changes
                        </Button>
                    </Box>
                </Box>
            )}


        </Box>
    );
};

export default Qs;