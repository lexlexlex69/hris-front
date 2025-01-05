import React, { useState } from 'react';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'
import EditIcon from '@mui/icons-material/Edit'
import { toast } from 'react-toastify';
import axios from 'axios';
import CustomBackdrop from '../jobPostingManagement/componentsByStatus/CustomBackdrop'

let debounceCode = null
let debouncer = null
const UpdatePosition = ({ data, positions, setPositions, handleClose }) => {
    const [positionCodeStatus, setPositionCodeStatus] = useState('')
    const [positionChecker, setPositionChecker] = useState(true)
    const [positionLoader, setPositionLoader] = useState(false)
    const [positionError, setPositionError] = useState('')
    const [position, setPosition] = useState({
        id: data.id,
        code: data.code,
        description: data.description,
        position_name: data.position_name,
        remarks: data.remarks,
        service_type: data.service_type,
        created_at: data.created_at,
        updated_at: data.updated_at
    })
    const [backdropState, setBackdropState] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (positionCodeStatus !== '200') {
            toast.warning('position code is not valid!')
            return
        }
        if (!positionChecker) {
            toast.warning('position title is not valid!')
            return
        }
        setBackdropState(true)
        try {
            let update = await axios.post(`/api/recruitment/updatePosition`, position)
            setBackdropState(false)
            if (update.data.status === 200) {
                toast.success('position updated.')
                let updatedPositions = positions.map(item => item.id === position.id ? {
                    ...item,
                    code: position.code,
                    position_name: position.position_name,
                    description: position.description,
                    remarks: position.remarks,
                    service_type: position.service_type,
                    created_at: update.data.date_created,
                    updated_at: new Date(),
                } : item)
                setPositions(updatedPositions)
                handleClose()
            }
            else if (update.data.status === 500) {
                toast.error(update.data.message)
            }

        }
        catch (err) {
            toast.error(err)
            setBackdropState(false)
        }
    }

    const handleChange = (e) => {
        setPosition(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleCheckPositionCode = (e) => {
        setPosition(prev => ({ ...prev, code: e.target.value }))
        if (e.target.value === data.code) {
            setPositionCodeStatus('200')
            return
        }
        setPositionCodeStatus('typing')
        clearTimeout(debounceCode)
        debounceCode = setTimeout(async () => {
            let res = await axios.post(`/api/recruitment/checkPositionCode`, { data: e.target.value })
            if (res.data.status === 200) {
                setPositionCodeStatus('200')
            }
            else if (res.data.status === 500) {
                setPositionCodeStatus('500')
            }
        }, 500)
    }

    const handleChangePosition = (e) => {
        let trimmed = e.target.value.split(' ').join('').toLowerCase()
        setPosition(prev => ({ ...prev, position_name: e.target.value }))
        clearTimeout(debouncer)
        setPositionLoader(true)
        if (e.target.value === data.position_name) {
            setPositionLoader(false)
            setPositionChecker(true)
            return
        }
        setPositionError('')
        debouncer = setTimeout(async () => {
            let res = await axios.post(`/api/recruitment/positionChecker`, { data: trimmed })
            setPositionLoader(false)
            if (!res.data) {
                setPositionChecker(true)
                setPositionError('')
            }
            else {
                setPositionChecker(false)
                setPositionError('Position title exist!')
            }
        }, 500)
    }
    return (
        <form onSubmit={handleSubmit} >
            <CustomBackdrop open={backdropState} title="Updating position, please wait . . ." />
            <Box display="flex" flexDirection="column" gap={2} p={2}>
                <FormControl variant="outlined" fullWidth

                >
                    <InputLabel htmlFor="outlined-adornment-password">POSITION TITLE</InputLabel>
                    <OutlinedInput
                        required
                        error={positionError ? true : false}
                        onChange={handleChangePosition}
                        value={position.position_name}
                        id="outlined-adornment-password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                >
                                    {positionLoader ? < CircularProgress size={30} /> : positionChecker === true ? <CheckIcon /> : positionChecker === false ? <CloseIcon /> : ''}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="POSITION TITLE"
                    />
                    {positionError && <FormHelperText>
                        <Typography variant="body2" color="error">
                            {positionError}
                        </Typography>
                    </FormHelperText>}

                </FormControl>

                <TextField
                    id=""
                    label="Description"
                    name="description"
                    value={position.description}
                    onChange={handleChange}
                />
                <TextField
                    id=""
                    label="Remarks"
                    name="remarks"
                    value={position.remarks}
                    onChange={handleChange}
                />
                <TextField
                    id=""
                    label="Position code"
                    name="code"
                    value={position.code}
                    color={positionCodeStatus === 'typing' ? 'warning' : positionCodeStatus === '500' ? 'error' : positionCodeStatus === '200' ? 'success' : ''}
                    onChange={handleCheckPositionCode}
                    helperText={positionCodeStatus === 'typing' ? 'Checking for duplicate position code . . .' : positionCodeStatus === '500' ? 'Position code exist!' : positionCodeStatus === '200' ? 'submit to continue' : ''}
                />
                <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
                    <Button type='submit' variant="contained" color="warning" startIcon={<EditIcon />} sx={{ borderRadius: '2rem' }}>
                        Update position
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default UpdatePosition;