import React, { useEffect, useCallback, useState, useRef, useContext } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import { blue } from '@mui/material/colors';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

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
import DnDcomponent from './DnDcomponent';
import DndcomponentIPCR from './DndcomponentIPCR';
import Swal from 'sweetalert2';

import { TablePositionHistoryContext } from '../TablePositionHistoryContext';




const ApplyPosition = ({ data, handleClose, pos, setPos }) => {
    // table context
    const { setTableContext } = useContext(TablePositionHistoryContext)
    const [loader, setLoader] = useState(true)
    const [hasRelated, setHasRelated] = useState(false)
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
    const [applicationLetter, setApplicationLetter] = useState('')
    const [ipcr, setIpcr] = useState('')
    const collectRef = useRef(true)
    const collectTriggerRef = useRef(true)
    const handleCollect = () => {
        setCollectTrigger(true)
    }


    const fetchEducation = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategory?tableName=education`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, education: false }))
        if (res.data.status === 200) {
            setEducation(res.data.data)
        }
        if (res.data.status === 203) {
            toast.warning('No record found!')
        }
    }

    const fetchEligibility = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategory?tableName=eligibility`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, eligibility: false }))
        if (res.data.status === 200) {
            setEligibility(res.data.data)
        }
        if (res.data.status === 203) {
            toast.warning('No record found!')
        }
    }

    const fetchWorkExp = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategory?tableName=employment`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, workExp: false }))
        if (res.data.status === 200) {
            setWorkExp(res.data.data)
        }
        if (res.data.status === 203) {
            toast.warning('No record found!')
        }
    }

    const fetchTraining = async () => {
        let res = await axios.get(`/api/recruitment/applicant/dashboard/getApplicantPreferencesByCategory?tableName=training`)
        console.log(res)
        setTableLoaders(prev => ({ ...prev, training: false }))
        if (res.data.status === 200) {
            setTraining(res.data.data)
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
                Swal.close()
                if (res.data || res.data.lenght) {
                    // handleClose()
                    // handleSubmitWithoutPreferences()
                    Swal.close()
                    setHasRelated(true)
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

    const checkApplicationLetter = () => { // application file checker
        let flag = 1
        if (!applicationLetter) {
            flag = -1
        }
        else {
            let ext = applicationLetter.name.slice((Math.max(0, applicationLetter.name.lastIndexOf(".")) || Infinity) + 1)
            if (ext !== 'pdf') {
                console.log('not pdf')
                flag = 0
            }
        }
        return flag
    }

    const checkIpcr = () => {
        let flag = 1
        if (ipcr) {
            let ext = ipcr.name.slice((Math.max(0, ipcr.name.lastIndexOf(".")) || Infinity) + 1)
            if (ext !== 'pdf') {
                console.log('not pdf')
                flag = 0
            }
        }
        return flag
    }

    const handleSubmitWithoutPreferences = async () => {
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()

        if (checkApplicationLetter() === -1) {
            toast.warning('Application letter is required!')
            return
        }
        else if (checkApplicationLetter() === 0) {
            toast.warning('Appication letter must be a pdf file!')
            return
        }
        if (checkIpcr() === 0) {
            toast.warning('IPCR must be a pdf file!')
            return
        }

        let res = await axios.post(`/api/recruitment/applicant/dashboard/SubmitWithoutPreferences`, {
            vacancyId: data.job_vacancies_id,
        })
        console.log(res)
        Swal.close()
        if (res.data.status === 200) {
            toast.success('Applied successfuly!')
            handleClose()
            setTableContext()
            let newPos = pos.filter(item => item.id !== data.id)
            setPos(newPos)
        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
    }

    const handleSubmit = async () => {
        if (checkApplicationLetter() === -1) {
            toast.warning('Application letter is required!')
            return
        }
        else if (checkApplicationLetter() === 0) {
            toast.warning('Appication letter must be a pdf file!')
            return
        }
        if (checkIpcr() === 0) {
            toast.warning('IPCR must be a pdf file!')
            return
        }
        Swal.fire({
            text: "Continue submitting!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'CONTINIE'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let postFormData = new FormData()
                postFormData.append('vacancyId', data.job_vacancies_id)
                postFormData.append('data', JSON.stringify(collectedStates))
                postFormData.append('applicationLetter', applicationLetter)
                postFormData.append('ipcr', ipcr)

                if ((collectedStates.education.length === 0 || !collectedStates.education) && (collectedStates.eligibility.length === 0 || !collectedStates.eligibility) && (collectedStates.training.length === 0 || !collectedStates.training) && (collectedStates.workExp.length === 0 || !collectedStates.workExp)) {
                    toast.warning('Check items related to position!')
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You don't have entry for some category, are you sure you to continue?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, continue'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                text: 'Processing request . . .',
                                icon: 'info'
                            })
                            Swal.showLoading()
                            let res = await axios.post(`/api/recruitment/applicant/dashboard/SubmitPreferences`, postFormData)
                            console.log(res)
                            Swal.close()
                            if (res.data.status === 200) {
                                toast.success('Applied successfuly!')
                                handleClose()
                                setTableContext()
                                let newPos = pos.filter(item => item.id !== data.id)
                                setPos(newPos)
                            }
                            if (res.data.status === 500) {
                                toast.error(res.data.message)
                            }
                        }
                    })
                }
                else {
                    Swal.fire({
                        text: 'Processing request . . .',
                        icon: 'info'
                    })
                    Swal.showLoading()
                    let res = await axios.post(`/api/recruitment/applicant/dashboard/SubmitPreferences`, postFormData)
                    console.log(res)
                    Swal.close()
                    if (res.data.status === 200) {
                        toast.success('Applied successfuly!')
                        handleClose()
                        setTableContext()
                        let newPos = pos.filter(item => item.id !== data.id)
                        setPos(newPos)
                    }
                    if (res.data.status === 500) {
                        toast.error(res.data.message)
                    }
                }

            }
        })

    }

    function setApplicationLetterValidate(param) {
        let name = param.name
        let lastDot = name.lastIndexOf('.')
        let ext = name.substring(lastDot + 1)
        let allowExt = ['jpg', 'jpeg', 'png', 'pdf']
        if (!allowExt.includes(ext)) {
            toast.error(`${ext} is not allowed!`)
            return
        }
        else {
            setApplicationLetter(param)
        }
    }

    function setIpcrValidate(param) {
        let name = param.name
        let lastDot = name.lastIndexOf('.')
        let ext = name.substring(lastDot + 1)
        let allowExt = ['jpg', 'jpeg', 'png', 'pdf']
        if (!allowExt.includes(ext)) {
            toast.error(`.${ext} is not allowed!`)
            return
        }
        else {
            setIpcr(param)
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
            handleSubmit()
        }
    }, [submitTrigger])

    useEffect(() => {
        let controller = new AbortController()
        checkVacancyPreferences(controller)
        return () => controller.abort()
    }, [])

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 'calc(100vh - 80px)', mt: hasRelated ? '60px' : 0 }}>
            <Box display='flex' flexDirection='column' alignItems='flex-end' justifyContent='flex-end' mt={1} mb={2} flex={1}>
                <Box display='flex' alignItems='flex-end' justifyContent='center' gap={2} width='100%'>
                    <DnDcomponent title="Application letter" setAction={setApplicationLetterValidate} fileName={applicationLetter} />
                    <DndcomponentIPCR title="(Optional) IPCR" setAction={setIpcrValidate} fileName={ipcr} />
                </Box>
            </Box>
            {hasRelated ? (
                <Box>
                    <Alert severity='info' size="small" >
                        <Typography variant="p" color="initial">Add relative items for this position</Typography>
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
                            <Box display='flex' gap={1}>
                                {cardsEnabler.education && (
                                    <Card variant="outlined" sx={{ mt: 1, flex: 1 }}>
                                        <CardHeader
                                            sx={{ bgcolor: blue[500], color: '#fff' }}
                                            title="Education List Related to position"
                                            avatar={<SchoolIcon />}
                                        />
                                        <CardContent>
                                            <Typography variant="body2" color="primary" align='right'>No. rows: {education?.length}</Typography>
                                            <EducationTable data={education} loader={tableLoaders.education} vacancyId={data.job_vacancies_id} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                                        </CardContent>
                                    </Card>
                                )}
                                {cardsEnabler.eligibility && (
                                    <Card variant="outlined" sx={{ mt: 1, flex: 1 }}>
                                        <CardHeader
                                            sx={{ bgcolor: blue[500], color: '#fff' }}
                                            title="Eligibility List Related to position"
                                            avatar={<ArticleIcon />}
                                        />
                                        <CardContent>
                                            <Typography variant="body2" color="primary" align='right'>No. rows: {eligibility?.length}</Typography>
                                            <EligibilityTable data={eligibility} loader={tableLoaders.eligibility} vacancyId={data.job_vacancies_id} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                            <Box display='flex' gap={1}>
                                {cardsEnabler.workExp && (
                                    <Card variant="outlined" sx={{ mt: 1, flex: 1 }}>
                                        <CardHeader
                                            sx={{ bgcolor: blue[500], color: '#fff' }}
                                            title="Work Experience List Related to position"
                                            avatar={<WorkIcon />}
                                        />
                                        <CardContent>
                                            <Typography variant="body2" color="primary" align='right'>No. rows: {workExp?.length}</Typography>
                                            <WorkExpTable data={workExp} loader={tableLoaders.workExp} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                                        </CardContent>
                                    </Card>
                                )}
                                {cardsEnabler.training && (
                                    <Card variant="outlined" sx={{ mt: 1, flex: 1 }}>
                                        <CardHeader
                                            sx={{ bgcolor: blue[500], color: '#fff' }}
                                            title="Trainings List Related to position"
                                            avatar={<WorkspacePremiumIcon />}
                                        />
                                        <CardContent>
                                            <Typography variant="body2" color="primary" align='right'>No. rows: {training?.length}</Typography>
                                            <TrainingTable data={training} loader={tableLoaders.training} setCollectedStates={setCollectedStates} collectTrigger={collectTrigger} setCollectTrigger={setCollectTrigger} />
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', mr: 2, pb: 2 }}>
                                <Button variant="contained" color="primary" sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} onClick={handleCollect}>
                                    Apply Position
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box display='flex' flex={1} justifyContent='flex-end' alignItems='flex-end'>
                    <Button variant='contained' size='large' sx={{ borderRadius: '.5rem' }} onClick={handleSubmitWithoutPreferences}>
                        Apply Position
                    </Button>
                </Box>
            )}

        </Container>
    );
};

export default ApplyPosition;