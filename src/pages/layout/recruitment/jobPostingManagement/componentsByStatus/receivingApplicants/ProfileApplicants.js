import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import CustomBackdrop from '../CustomBackdrop';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography'
import { ArrowForward } from '@mui/icons-material';

const ProfileApplicants = ({ data, handleCloseModal, employee, applicant, setEmployee, setApplicant }) => {
    console.log(data)
    const [profile, setProfile] = useState({
        id: '',
        evalEducation: '',
        evalExperience: '',
        evalTraining: ''
    })

    const [backdropState, setBackdropState] = useState(false)

    const [loader, setLoader] = useState(true)

    const handleChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const getProfileInfo = async () => {
        setLoader(true)
        let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/getProfileInfo`, { data: data })
        setLoader(false)
        setProfile(prev => ({
            ...prev,
            id: res.data.id,
            evalEducation: res.data.eval_education,
            evalExperience: res.data.eval_experience,
            evalTraining: res.data.eval_training,
        }))
    }

    const handleUpdate = async () => {
        setBackdropState(true)
        let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/updateProfileInfo`, { data: profile })
        setBackdropState(false)
        if (res.data.status === 200) {
            handleCloseModal(false)
            if (data.xType === 'Employee') {
                let ratedEmployee = employee.map((item, i) => item.applicant_id === data.applicant_id ? ({ ...item, eval_education: Number(profile.evalEducation), eval_experience: Number(profile.evalExperience), eval_training: Number(profile.evalTraining) }) : item)
                setEmployee(ratedEmployee)
            }
            else if (data.xType === 'Applicant') {
                let ratedApplicant = applicant.map((item, i) => item.applicant_id === data.applicant_id ? ({ ...item, eval_education: Number(profile.evalEducation), eval_experience: Number(profile.evalExperience), eval_training: Number(profile.evalTraining) }) : item)
                setApplicant(ratedApplicant)
            }
        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
    }
    useEffect(() => {
        let controller = new AbortController()
        getProfileInfo()
        return (() => controller.abort())
    }, [])
    return (
        <>
            <CustomBackdrop open={backdropState} title="Saving/Updating" />
            <Typography variant="body1" color="primary" align='center'>Rating based in relative fitness</Typography>
            <Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2, justifyContent: { xs: '', md: 'center' } }}>
                <TextField
                    id=""
                    label="Education"
                    value={profile.evalEducation}
                    type="number"
                    fullWidth
                    name="evalEducation"
                    onChange={handleChange}
                    disabled={loader}
                />
                <TextField
                    id=""
                    fullWidth
                    label="Experience"
                    value={profile.evalExperience}
                    type="number"
                    name="evalExperience"
                    onChange={handleChange}
                    disabled={loader}
                />
                <TextField
                    id=""
                    fullWidth
                    label="Training"
                    value={profile.evalTraining}
                    type="number"
                    name="evalTraining"
                    onChange={handleChange}
                    disabled={loader}
                />
            </Box>
            <Box display='flex' justifyContent="flex-end" mt={2}>
                <Button variant='contained' color='success' sx={{ borderRadius: '2rem' }} startIcon={<ArrowForward />} onClick={handleUpdate}>Save</Button>
            </Box>
        </>
    );
};

export default ProfileApplicants;