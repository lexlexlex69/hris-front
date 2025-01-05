import React from 'react'
import {Box, TextField,Tooltip} from '@mui/material'
import { useSelector,useDispatch } from 'react-redux'
import {setEmail} from '../../.././redux/slice/emailVerificationSlice'

export default function EmailVerification(){
    const email = useSelector((state)=>state.emailVerification.email)
    const dispatch = useDispatch()
    return(
        <Box>
            <Tooltip title="Where Verification Code will be sent" placement="top">
                <TextField label="Active Email Address" variant='outlined' value = {email} fullWidth onChange = {
                    (val) => dispatch(setEmail(val))}/>
            </Tooltip>
        </Box>
    )
}