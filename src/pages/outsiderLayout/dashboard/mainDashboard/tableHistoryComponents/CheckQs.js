import React, { useEffect, useCallback, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import { blue, orange } from '@mui/material/colors';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'

import ArrowForward from '@mui/icons-material/ArrowForward'
import Skeleton from '@mui/material/Skeleton'
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import axios from 'axios';
import { toast } from 'react-toastify'

import EducationTable from './tables/EducationTable';
import EligibilityTable from './tables/EligibilityTable';
import WorkExpTable from './tables/WorkExpTable';
import TrainingTable from './tables/TrainingTable';
import BaseTable from './tables/BaseTable';
import Swal from 'sweetalert2';




const ApplyPosition = ({ data, handleClose }) => {
    const [loader, setLoader] = useState(true)
    const [cardsEnabler, setCardsEnabler] = useState({
        education: false,
        eligibility: false,
        workExp: false,
        training: false
    })
    const [tableLoaders, setTableLoaders] = useState({
        education: true,
        eligibility: true,
        workExp: true,
        training: true
    })
    const [education, setEducation] = useState([])
    const [educationPref, setEducationPref] = useState([])
    const [eligibility, setEligibility] = useState([])
    const [workExp, setWorkExp] = useState([])
    const [training, setTraining] = useState([])

    const [collectedStates, setCollectedStates] = useState({
        education: '',
        eligibility: '',
        workExp: '',
        training: ''
    })
    const [collectTrigger, setCollectTrigger] = useState(false)
    const [submitTrigger, setSubmitTrigger] = useState(false)
    const collectRef = useRef(true)
    const collectTriggerRef = useRef(true)
    const handleCollect = () => {
        setCollectTrigger(true)
    }


    const fetchEducation = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategoryForHistoryTable?tableName=hris_applicant_education`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, education: false }))
        if (res.data.status === 200) {
            let newEducationData = res.data.data.map(item => {
                let flag = 0
                res.data.data_preferences.map(item2 => {
                    if (item.id === item2.type_id) {
                        flag = 1
                    }
                })
                if (flag === 1)
                    return { ...item, isChecked: true }
                else
                    return item
            })
            setEducation(newEducationData)
        }
        if (res.data.status === 203) {
            toast.warning('No record found!')
        }
    }

    const fetchEligibility = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategoryForHistoryTable?tableName=hris_applicant_eligibility`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, eligibility: false }))
        if (res.data.status === 200) {
            let newEligibility = res.data.data.map(item => {
                let flag = 0
                res.data.data_preferences.map(item2 => {
                    if (item.id === item2.type_id) {
                        flag = 1
                    }
                })
                if (flag === 1)
                    return { ...item, isChecked: true }
                else
                    return item
            })
            setEligibility(newEligibility)
        }
        if (res.data.status === 203) {
            toast.warning('No record found!')
        }
    }

    const fetchWorkExp = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategoryForHistoryTable?tableName=hris_applicant_employment`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, workExp: false }))
        if (res.data.status === 200) {
            let newWorkExp = res.data.data.map(item => {
                let flag = 0
                res.data.data_preferences.map(item2 => {
                    if (item.id === item2.type_id) {
                        flag = 1
                    }
                })
                if (flag === 1)
                    return { ...item, isChecked: true }
                else
                    return item
            })
            setWorkExp(newWorkExp)
        }
        if (res.data.status === 203) {
            toast.warning('No record found!')
        }
    }

    const fetchTraining = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategoryForHistoryTable?tableName=hris_applicant_training`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, training: false }))
        if (res.data.status === 200) {
            let newTraining = res.data.data.map(item => {
                let flag = 0
                res.data.data_preferences.map(item2 => {
                    if (item.id === item2.type_id) {
                        flag = 1
                    }
                })
                if (flag === 1)
                    return { ...item, isChecked: true }
                else
                    return item
            })
            setTraining(newTraining)
        }
        if (res.data.status === 203) {
            toast.warning('No record found!')
        }
    }

    const checkVacancyPreferences = async (controller) => {
        Swal.fire({
            text: 'Checking Requirements for the position, please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()

        let timeoutPromise = new Promise((res, rej) => {
            setTimeout(async () => {
                let res = await axios.post(`/api/recruitment/applicant/dashboard/vacantPosition/checkVacancyPreferences`, { id: data.job_vacancies_id }, { signal: controller.signal })
                setLoader(false)
                console.log(res)
                if (!res.data || res.data.length === 0) {
                    handleClose()
                    handleSubmitWithoutPreferences()
                    Swal.close()
                }
                else {
                    Swal.close()
                    res.data.map(x => {
                        switch (x.pref_type) {
                            case 'Education': {
                                setCardsEnabler(prev => ({ ...prev, education: true }))
                                fetchEducation()
                                break
                            }
                            case 'Eligibility': {
                                setCardsEnabler(prev => ({ ...prev, eligibility: true }))
                                fetchEligibility()
                                break
                            }
                            case 'Experience': {
                                setCardsEnabler(prev => ({ ...prev, workExp: true }))
                                fetchWorkExp()
                                break
                            }
                            case 'Trainings': {
                                setCardsEnabler(prev => ({ ...prev, training: true }))
                                fetchTraining()
                                break
                            }
                            default: return
                        }
                    })
                }
                // res()
            }, [500])
        })
    }

    const handleSubmitWithoutPreferences = async () => {

        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/recruitment/applicant/dashboard/SubmitWithoutPreferences`, {
            vacancyId: data.job_vacancies_id,
        })
        console.log(res)
        Swal.close()
        if (res.data.status === 200) {
            toast.success('Applied successfuly!')
            handleClose()
        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
    }

    const handleSubmitUpdate = async () => {
        if ((collectedStates.education.length === 0 || !collectedStates.education) && (collectedStates.eligibility.length === 0 || !collectedStates.eligibility) && (collectedStates.training.length === 0 || !collectedStates.training) && (collectedStates.workExp.length === 0 || !collectedStates.workExp)) {
            toast.warning('Check items related to position!')
        }
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/recruitment/applicant/dashboard/SubmitUpdatedPreferences`, {
            vacancyId: data.job_vacancies_id,
            data: collectedStates
        })
        console.log(res)
        Swal.close()
        if (res.data.status === 200) {
            toast.success('Qualification Standard updated!')
            handleClose()
        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
    }

    useEffect(() => {
        if (collectTriggerRef.current) {
            collectTriggerRef.current = false
        }
        else {
            if (collectTrigger)
                setSubmitTrigger(prev => !prev)
        }
    }, [collectTrigger])

    useEffect(() => {
        if (collectRef.current)
            collectRef.current = false
        else {
            handleSubmitUpdate()
        }
    }, [submitTrigger])

    useEffect(() => {
        let controller = new AbortController()
        checkVacancyPreferences(controller)
        return () => controller.abort()
    }, [])

    return (
        <Container sx={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
            <Alert severity='warning' size="small" >
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="p" color="initial">Update items you include for this position.</Typography>
                </Box>
            </Alert>
            {loader ? (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around', flexDirection: 'column' }}>
                    <Box>
                        <Skeleton variant="rectangle" width="100%" height={50} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                    </Box>
                    <Box>
                        <Skeleton variant="rectangle" width="100%" height={50} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                    </Box>
                    <Box>
                        <Skeleton variant="rectangle" width="100%" height={50} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                    </Box>
                    <Box>
                        <Skeleton variant="rectangle" width="100%" height={50} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                        <Skeleton variant="text" width="100%" height={20} animation="pulse" />
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-around', gap: 2 }}>
                    {cardsEnabler.education && (
                        <Card variant="outlined" sx={{ mt: 1 }}>
                            <CardHeader
                                sx={{ bgcolor: orange[200], color: '#fff' }}
                                title="Education List Related to position"
                                avatar={<SchoolIcon />}
                            />
                            <CardContent>
                                <Typography variant="body1" color="primary" align='right'>No. rows: {education?.length}</Typography>
                                <EducationTable data={education} loader={tableLoaders.education} vacancyId={data.job_vacancies_id} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                            </CardContent>
                        </Card>
                    )}
                    {cardsEnabler.eligibility && (
                        <Card variant="outlined">
                            <CardHeader
                                sx={{ bgcolor: orange[300], color: '#fff' }}
                                title="Eligibility List Related to position"
                                avatar={<ArticleIcon />}

                            />
                            <CardContent>
                                <Typography variant="body1" color="primary" align='right'>No. rows: {eligibility?.length}</Typography>
                                <EligibilityTable data={eligibility} loader={tableLoaders.eligibility} vacancyId={data.job_vacancies_id} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                            </CardContent>
                        </Card>
                    )}

                    {cardsEnabler.workExp && (
                        <Card variant="outlined" sx={{ mt: 1 }}>
                            <CardHeader
                                sx={{ bgcolor: orange[400], color: '#fff' }}
                                title="Work Experience List Related to position"
                                avatar={<WorkIcon />}
                            />
                            <CardContent>
                                <Typography variant="body1" color="primary" align='right'>No. rows: {workExp?.length}</Typography>
                                <WorkExpTable data={workExp} loader={tableLoaders.workExp} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                            </CardContent>
                        </Card>
                    )}
                    {cardsEnabler.training && (
                        <Card variant="outlined" sx={{ mt: 1 }}>
                            <CardHeader
                                sx={{ bgcolor: orange[500], color: '#fff' }}
                                title="Trainings List Related to position"
                                avatar={<WorkspacePremiumIcon />}
                            />
                            <CardContent>
                                <Typography variant="body1" color="primary" align='right'>No. rows: {training?.length}</Typography>
                                <TrainingTable data={training} loader={tableLoaders.training} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                            </CardContent>
                        </Card>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', mr: 2, pb: 2 }}>
                        <Button variant="contained" color="warning" sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} onClick={handleCollect}>
                            Update / Submit
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default ApplyPosition;