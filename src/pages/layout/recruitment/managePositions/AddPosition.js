import React, { useRef, useState } from 'react'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import { toast } from 'react-toastify'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

let debouncer = null
let debouncerCode = null

const AddPosition = ({ positions, setPositions, handleCloseAddPosition }) => {
    // backdrop
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    // refs
    const [positionTitle, setPositionTitle] = useState('')
    const [positionDescription, setPositionDescription] = useState('')
    const [positionCode, setPositionCode] = useState('')
    const [positionRemarks, setPositionRemarks] = useState('')
    const [positionChecker, setPositionChecker] = useState()
    const [positionError, setPositionError] = useState()
    const [positionLoader, setPositionLoader] = useState()
    const [positionCodeStatus, setPositionCodeStatus] = useState('')


    const handleChangePosition = (e) => {
        let trimmed = e.target.value.split(' ').join('').toLowerCase()
        clearTimeout(debouncer)
        setPositionLoader(true)
        setPositionError('')
        debouncer = setTimeout(async () => {
            let res = await axios.post(`/api/recruitment/positionChecker`, { data: trimmed })
            setPositionLoader(false)
            if (!res.data) {
                setPositionChecker(true)
                setPositionTitle(e.target.value)
                setPositionError('')
            }
            else {
                setPositionChecker(false)
                setPositionError('Position title exist!')
            }
        }, 500)
    }


    const handleAddPosition = async (e) => {
        e.preventDefault()
        if (!positionChecker) {
            toast.warning('Position title exist!')
            return
        }
        if (positionCodeStatus !== '200') {
            toast.warning('Position code is not valid!')
            return
        }
        setOpen(true)

        let data = {
            positionTitle: positionTitle,
            positionDescription: positionDescription,
            positionRemarks: positionRemarks,
            positionCode: positionCode
        }

        try {
            let res = await axios.post(`/api/recruitment/addNewPosition`, data)
            console.log(res)
            if (res.data.status === 200) {
                handleCloseAddPosition()
                setOpen(false)
                let defaultPositions = positions
                defaultPositions.unshift({
                    id: res.data.inserted_data?.id,
                    position_name: res.data.inserted_data?.position_name,
                    code: res.data.inserted_data?.code,
                    description: res.data.inserted_data?.description,
                    remarks: res.data.inserted_data?.remarks,
                    service_type: res.data.inserted_data?.service_type,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                setPositions(defaultPositions.slice(0, 10))
                toast.success('position added')
            }
        }
        catch (err) {
            setOpen(false)
            toast.error(err.message)
        }

    }

    const onChangePositionCode = async (e) => {
        clearTimeout(debouncerCode)
        setPositionCodeStatus('typing')
        debouncerCode = setTimeout(async () => {
            let res = await axios.post(`/api/recruitment/checkPositionCode`, { data: e.target.value })
            if (res.data.status === 200) {
                setPositionCodeStatus('200')
                setPositionCode(e.target.value)
            }
            else if (res.data.status === 500) {
                setPositionCodeStatus('500')
            }
        }, 500)
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, width: '39.5%', background: 'RGBA(59,154,255,0.76)' }}
                open={open}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <form onSubmit={(e) => handleAddPosition(e)}>
                <Box sx={{ padding: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl variant="outlined" fullWidth

                    >
                        <InputLabel htmlFor="outlined-adornment-password">POSITION TITLE</InputLabel>
                        <OutlinedInput
                            required
                            error={positionError ? true : false}
                            onChange={handleChangePosition}
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
                        fullWidth
                        id=""
                        label="POSITION DESCRIPTION"
                        value={positionDescription}
                        onChange={(e) => setPositionDescription(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="POSITION REMARKS"
                        value={positionRemarks}
                        onChange={(e) => setPositionRemarks(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="POSITION CODE (OPTIONAL, used for lexis data)"
                        // value={positionCode}
                        color={positionCodeStatus === 'typing' ? 'warning' : positionCodeStatus === '500' ? 'error' : positionCodeStatus === '200' ? 'success' : ''}
                        helperText={positionCodeStatus === 'typing' ? 'Checking for duplicate position code . . .' : positionCodeStatus === '500' ? 'Position code exist!' : positionCodeStatus === '200' ? 'submit to continue' : ''}
                        // onChange={(e) => setPositionCode(e.target.value)}
                        onChange={onChangePositionCode}
                    />
                    <Box display="" mx="" my="" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" type='submit' sx={{ borderRadius: '2rem', mt: 1, position: 'absolute', bottom: 20, right: 40, fontSize: { xs: '12px', md: '' } }} endIcon={<ArrowForwardIcon />}>
                            submit position
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box >
    );
};

export default AddPosition;