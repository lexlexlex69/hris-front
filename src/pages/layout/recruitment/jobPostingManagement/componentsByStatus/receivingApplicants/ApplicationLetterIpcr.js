import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { viewFilesUsingPathOnly } from '../../../../pds/customFunctions/CustomFunctions';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ApplicationLetterIpcr = ({ data }) => {

    const [loader, setLoader] = useState(true)
    const [profile, setProfile] = useState('')
    const getApplicationLetterIpcr = async (controller) => {
        let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/getApplicationLetterIpcr`, data, { signal: controller.abort() })
        setLoader(false)
        console.log(res)
        setProfile(res.data)
    }

    useEffect(() => {
        let controller = new AbortController()
        getApplicationLetterIpcr(controller)
        return (() => controller.abort())
    }, [])
    return (
        <Box display='flex' justifyContent='center' gap={2}>
            <Button variant='contained' onClick={() => viewFilesUsingPathOnly(profile?.application_letter_path,'/api/recruitment/jobPosting/status/receiving-applicants/viewApplicationLetterIpcr')} size='large' startIcon={loader ? <CircularProgress size={25} sx={{ color: '#fff' }} /> : profile?.application_letter_path ? <CheckIcon /> : <CloseIcon />} disabled={!profile?.application_letter_path ? true : false}>Application letter</Button>
            <Button variant='contained' onClick={() => viewFilesUsingPathOnly(profile?.ipcr_path,'/api/recruitment/jobPosting/status/receiving-applicants/viewApplicationLetterIpcr')} size='large' startIcon={loader ? <CircularProgress size={25} sx={{ color: '#fff' }} /> : profile?.ipcr_path ? <CheckIcon /> : <CloseIcon />} disabled={!profile?.ipcr_path ? true : false}>IPCR</Button>
        </Box>
    );
};

export default ApplicationLetterIpcr;