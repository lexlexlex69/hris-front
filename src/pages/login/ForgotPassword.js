import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import { blue, red, green, yellow } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForward from '@mui/icons-material/ArrowForward';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux'
import { getInfo } from '../../redux/slice/userInformationSlice';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';


function CreateAccount(props) {
    // media query
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [loader, setLoader] = useState(false)
    const [accountState, setAccountState] = useState({
        username: '',
        dob: '',
        emailadd: ''
    })

    const [errors, setErrors] = useState('')

    const handleChange = (e) => {
        setAccountState({ ...accountState, [e.target.name]: e.target.value })
    }

    const handleForgot = async (e) => {
        e.preventDefault()
        setErrors('')
        setLoader(true)
        let res = await axios.get('/sanctum/csrf-cookie')
        try {
            let forgot = await axios.post(`/api/forgotPassword`, accountState)
            setLoader(false)
            if (forgot.data.status === 500) {
                setErrors(forgot.data.message)
            }
            if(forgot.data.status === 200)
            {
                toast.success('Please check your email address for your new password. Thank you')
                props.onClose()
            }
        }
        catch (err) {
            toast.error(err.message)
        }

    }
    return (
        <Grid container>
            <Grid iitem xs={12} sm={12} md={12} lg={12}>
                <Box sx={{ p: 4, pt: 0 }}>
                <Box pb={2}>
                    {loader && <LinearProgress />}
                </Box>
                    <Box display='flex' justifyContent='flex-end' mb={2}>
                        <CloseIcon color='error' onClick={props.onClose} />
                    </Box>
                    <form onSubmit={handleForgot}>
                        <Typography variant="body1" color="error" >{errors}</Typography>
                        {errors && <Typography variant='body2' color='error' gutterBottom>please contact HR assigned personnel for this matter. Thank you.</Typography>}
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', marginBottom: '2rem' }}>
                            <TextField variant="outlined" required label="username" name='username' onChange={handleChange} fullWidth></TextField>
                            <TextField variant="outlined" required label="Date of Birth (dd/mm/yyyy)" name='dob' type="date" focused onChange={handleChange} fullWidth></TextField>
                            <TextField variant="outlined" type="email" required label="email address" name='email' onChange={handleChange} fullWidth></TextField>
                        </Box>
                        <Box display='flex' justifyContent='flex-end'>
                        <Button variant='contained' type='submit' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }}>Submit</Button>
                        </Box>
                    </form>
                </Box>
            </Grid>
        </Grid>
    )
}

export default CreateAccount