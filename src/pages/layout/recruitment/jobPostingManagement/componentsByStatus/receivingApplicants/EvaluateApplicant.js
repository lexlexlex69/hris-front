import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';


import { toast } from 'react-toastify'
import axios from 'axios';
import Swal from 'sweetalert2';

import PrintPds from '../../../../pds/customComponents/PrintPds';
import Typography from '@mui/material/Typography'
import { useRef } from 'react';

const ViewPds = () => {

    const { id } = useParams();
    const [applicantType, setApplicantType] = useState('')
    const [ids, setIds] = useState('')
    const location = useLocation();

    // backdrop
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };

    const [vacancyId, setVacancyId] = useState('')
    const [personalInfo, setPersonalInfo] = useState('')
    const [address, setAddress] = useState('')
    const [family, setFamily] = useState('')
    const [children, setChildren] = useState('')
    const [education, setEducation] = useState('')
    const [eligibility, setEligibility] = useState('')
    const [workExp, setWorkExp] = useState('')
    const [voluntary, setVoluntary] = useState('')
    const [training, setTraining] = useState('')
    const [specialSkills, setSpecialSkills] = useState('')
    const [recognition, setRecognition] = useState('')
    const [organization, setOrganization] = useState('')
    const [nNumberOthers, setNNumberOthers] = useState(0)
    const [references, setReferences] = useState('')
    const [_34_40, set_34_40] = useState('')

    const [educationPreferences, setEducationPreferences] = useState([])
    const [eligibilityPreferences, setEligibilityPreferences] = useState([])
    const [trainingsPreferences, setTrainingsPreferences] = useState([])
    const [workExperincePreferences, setWorkExperiencePreferences] = useState([])

    useEffect(() => {
        let ids = id?.split(':')[0]
        setVacancyId(ids.split('_')[1])
        ids = ids.split('_')[0]
        setIds(ids)
        let category = id?.split(':')[1]
        setApplicantType(category)
        axios.post(`/api/pds/print/getPersonalInformation`, { category: category, id: ids })
            .then(res => {
                setPersonalInfo(res.data.personal_information)
                setAddress(res.data.address)
                return axios.post(`/api/pds/print/getFamilyBackground`, { category: category, id: ids })
            })
            .then(res => {
                setFamily(res.data.family)
                setChildren(res.data.children)
                return axios.post(`/api/pds/print/getEligibility`, { category: category, id: ids })
            })
            .then(res => {
                setEligibility(res.data.eligibility)
                return axios.post(`/api/pds/print/getEducation`, { category: category, id: ids })
            })
            .then(res => {
                setEducation(res.data.education)
                return axios.post(`/api/pds/print/getWorkExp`, { category: category, id: ids })
            })
            .then(res => {
                setWorkExp(res.data.work_experience)
                return axios.post(`/api/pds/print/getVoluntary`, { category: category, id: ids })
            })
            .then(res => {
                setVoluntary(res.data.voluntary)
                return axios.post(`/api/pds/print/getTraining`, { category: category, id: ids })
            })
            .then(res => {
                setTraining(res.data.training)
                return axios.post(`/api/pds/print/getSpecialSkills`, { category: category, id: ids })
            })
            .then(res => {
                let ss = res.data.skills.filter(item => item.typeid === 1)
                let r = res.data.skills.filter(item => item.typeid === 2)
                let o = res.data.skills.filter(item => item.typeid === 3)
                let temph = [o.length, ss.length, r.length]
                temph = temph.sort()
                setSpecialSkills(ss)
                setRecognition(r)
                setOrganization(o)
                setNNumberOthers(temph[2])
                set_34_40(res.data._34_40)
                setReferences(res.data.reference)
                handleClose()
            })
            .catch(err => {
                toast.error(err.message)
            })
    }, [])

    const fetchApplicantPreferences = async () => {
        let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/getApplicantPreferences`, { applicant_type: applicantType, applicant_id: ids, vacancy_id: vacancyId })
        console.log(res)

        setEducationPreferences(res.data.filter((item => item.pref_type === 'Education')))
        setEligibilityPreferences(res.data.filter((item => item.pref_type === 'Eligibility')))
        setTrainingsPreferences(res.data.filter((item => item.pref_type === 'Trainings')))
        setWorkExperiencePreferences(res.data.filter((item => item.pref_type === 'Experience')))
    }

    useEffect(() => {
        if (applicantType) {
            fetchApplicantPreferences()
        }
    }, [applicantType])
    return (
        <Box sx={{ px: { xs: '0px', md: '100px' } }} >
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="body1" color="#fff" sx={{ mt: 1 }}>Fetching Applicants Data. Please wait . . .</Typography>
                </Box>
            </Backdrop>
            <Box>  
                <PrintPds educationPreferences={educationPreferences} eligibilityPreferences={eligibilityPreferences} trainingsPreferences={trainingsPreferences} workExperincePreferences={workExperincePreferences} personalInfo={personalInfo || ''} address={address || ''} family={family || ''} children={children || ''} education={education || ''} eligibility={eligibility || ''} workExp={workExp || ''} voluntary={voluntary || ''} training={training || ''} specialSkills={specialSkills || ''} recognition={recognition || ''} organization={organization || ''} references={references || ''} nNumberOthers={nNumberOthers || ''} _34_40={_34_40 || ''} vacancy_id={vacancyId} applicant_type={applicantType} /> 
            </Box>
        </Box>
    );
};

export default ViewPds;