import React, { useEffect, useState, useRef, useContext } from 'react';
import { blue, red } from '@mui/material/colors'
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton'
import Card from '@mui/material/Card';
import ArrowForward from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField'


import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';

import TransferSvg from '../../../../../assets/img/transfer.svg'
import TransferSuccess from '../../../../../assets/img/transferSuccess.svg'

import Warnings from './receivingApplicants/Warnings';
import { handleChangeStatus } from './Controller';
import { RecruitmentContext } from '../RecruitmentContext';
import CustomBackdrop from './CustomBackdrop';
import Form33A from './printables/Form33A';
import CertificationAssumptionToDuty from './printables/CertificationAssumptionToDuty'
import AothOfOffice from './printables/AothOfOffce';
import Certification from './printables/Certification';
import Pdf from './printables/Pdf';
import Tooltip from '@mui/material/Tooltip'





const IssuanceAppointment = ({ data, closeDialog }) => {

    // stepper
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    // printing states
    const [form33Adata, setForm33AData] = useState({})
    const [catd, setCatd] = useState({})
    const [oathOfOffice, setOathOfOffice] = useState({})
    const [certification, setCertification] = useState('')
    const [plantillaPdf, setPlantillaPdf] = useState('')
    const [form33AdditionalData, setForm33AdditonalData] = useState({
        nature: '',
        vice: '',
        page: ''
    })

    const handleChangeForm33A = (e) => {
        setForm33AdditonalData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // printing
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const componentRefPDf = useRef();
    const handlePrintPdf = useReactToPrint({
        content: () => componentRefPDf.current,
    });

    const componentRefCATD = useRef();
    const handlePrintCATD = useReactToPrint({
        content: () => componentRefCATD.current,
    });

    const componentRefOO = useRef();
    const handlePrintOO = useReactToPrint({
        content: () => componentRefOO.current,
    });

    const componentRefCert = useRef();
    const handlePrintCert = useReactToPrint({
        content: () => componentRefCert.current,
    });


    const [list, setList] = useState([])
    const [loader, setLoader] = useState(true)
    const [appointed, setAppointed] = useState('')

    // for backdrop status
    const [statusBackdrop, setStatusBackdrop] = useState(false)
    const { handleVacancyStatusContext } = useContext(RecruitmentContext)

    // for revoke password modal
    const [revokeModal, setRevokeModal] = useState(false)
    const handleOpenRevokeModal = () => setRevokeModal(true)
    const [revokePassword, setRevokePassword] = useState('')
    const [revokePasswordLoader, setRevokePasswordLoader] = useState(false)
    const [revokeError, setRevokeError] = useState({
        error: false,
        message: ''
    })

    const [form33Tooltip, setForm33Tooltip] = useState(false)

    // for transferring data
    const textPopUpData = ['Transferring Personal information', 'Transeferring educational background', 'Transferring work experience', 'Transferring Eligibility', 'Transferring voluntary works', 'Transferring Trainings']
    const [textPopUp, setTextPopUp] = useState('')
    const [textPopUpCount, setTextPopUpCount] = useState(0)
    const [transferError, setTransferError] = useState(false)
    const [transferSuccess, setTransferSuccess] = useState(false)
    const transferDataRef = useRef(true)

    // specify date for appointed applicant
    const [openAssignDate, setOpenAssignDate] = useState(false)
    // for menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // transfering information
    const [transferReadyModal, setTransferReadyModal] = useState(false)

    const handleTransferData = async () => {
        setActiveStep(0)
        let personalInformation = await axios.post(`api/recruitment/jobPosting/status/issuance-appointment/transferApplicantToEmployee`, {vacancyId:data, appointed, category: 'personal_information' })
        console.log(personalInformation)
        if (personalInformation.data.status === 500) {
            setTransferError(true)
            return
        }
        else if (personalInformation.data.status === 200) {
            setTransferSuccess(true)
        }
    }
    useEffect(() => {
        if (transferReadyModal) {
            handleTransferData()
        }
    }, [transferReadyModal])
    // printing functions

    const handlePrintFn = async (category) => {
        Swal.fire({
            text: 'Processing, please wait ...',
            icon: 'warning'
        })
        Swal.showLoading()
        if (category === 'Form33A') {
            let res = await axios.post(`/api/recruitment/jobPosting/status/issuance-appointment/printForms`, { vacancyId: data, category: category, profile_id: appointed.profile_id })
            console.log('from33a', res)
            Swal.close()
            setForm33AData(res.data)
            handlePrint()
        }
        if (category === 'Pdf') {
            console.log(data)
            let fetchPlantilla = await axios.post(`/api/recruitment/jobPosting/status/issuance-appointment/printForms`, { vacancyId: data, category: category })
            console.log(fetchPlantilla)
            if (fetchPlantilla.data.status === 500) {
                toast.error(fetchPlantilla.data.message)
                Swal.close()
                return
            }

            setPlantillaPdf({
                ...plantillaPdf,
                plantilla_id: fetchPlantilla.data[0].plantillaId,
                position_name: fetchPlantilla.data[0].position_name,
                item_number: fetchPlantilla.data[0].new_item_no,
                sg: fetchPlantilla.data[0].plantilla_sg,
                step: fetchPlantilla.data[0].plantilla_step,
                qs: fetchPlantilla.data[0].qs,
                dept_title: fetchPlantilla.data[0].dept_title,
                lgu_type: fetchPlantilla.data[0].lgu_type,
                lgu_class: fetchPlantilla.data[0].lgu_class,
                agency_name: fetchPlantilla.data[0].agency_name,
                dept_id: fetchPlantilla.data[0].dept_id,
                dept_title: fetchPlantilla.data[0].dept_title,
                dept_branch: fetchPlantilla.data[0].dept_branch,
                place_of_work: fetchPlantilla.data[0].place_of_work,
                present_appro_act: fetchPlantilla.data[0].present_appro_act,
                previous_appro_act: fetchPlantilla.data[0].previous_appro_act,
                other_compensation: fetchPlantilla.data[0].other_compensation,
                immediate_visor: fetchPlantilla.data[0].immediate_visor,
                next_higher_visor: fetchPlantilla.data[0].supervised_positions,
                supervised_positions: fetchPlantilla.data[0].supervised_positions,
                supervised_item_no: fetchPlantilla.data[0].supervised_item_no,
                machine_equipment: fetchPlantilla.data[0].machine_equipment,
                internal_executive: fetchPlantilla.data[0].internal_executive,
                internal_executive_a: fetchPlantilla.data[0].internal_executive === 1 || fetchPlantilla.data[0].internal_executive === 3 ? true : false,
                internal_executive_b: fetchPlantilla.data[0].internal_executive === 2 || fetchPlantilla.data[0].internal_executive === 3 ? true : false,
                internal_supervisor: fetchPlantilla.data[0].internal_supervisor,
                internal_supervisor_a: fetchPlantilla.data[0].internal_supervisor === 1 || fetchPlantilla.data[0].internal_supervisor === 3 ? true : false,
                internal_supervisor_b: fetchPlantilla.data[0].internal_supervisor === 2 || fetchPlantilla.data[0].internal_supervisor === 3 ? true : false,
                internal_non_supervisor: fetchPlantilla.data[0].internal_non_supervisor,
                internal_non_supervisor_a: fetchPlantilla.data[0].internal_non_supervisor === 1 || fetchPlantilla.data[0].internal_non_supervisor === 3 ? true : false,
                internal_non_supervisor_b: fetchPlantilla.data[0].internal_non_supervisor === 2 || fetchPlantilla.data[0].internal_non_supervisor === 3 ? true : false,
                internal_staff: fetchPlantilla.data[0].internal_staff,
                internal_staff_a: fetchPlantilla.data[0].internal_staff === 1 || fetchPlantilla.data[0].internal_staff === 3 ? true : false,
                internal_staff_b: fetchPlantilla.data[0].internal_staff === 2 || fetchPlantilla.data[0].internal_staff === 3 ? true : false,
                external_gen_public: fetchPlantilla.data[0].external_gen_public,
                external_gen_public_a: fetchPlantilla.data[0].external_gen_public === 1 || fetchPlantilla.data[0].external_gen_public === 3 ? true : false,
                external_gen_public_b: fetchPlantilla.data[0].external_gen_public === 2 || fetchPlantilla.data[0].external_gen_public === 3 ? true : false,
                external_other_agency: fetchPlantilla.data[0].external_other_agency,
                external_other_agency_a: fetchPlantilla.data[0].external_other_agency === 1 || fetchPlantilla.data[0].external_other_agency === 3 ? true : false,
                external_other_agency_b: fetchPlantilla.data[0].external_other_agency === 2 || fetchPlantilla.data[0].external_other_agency === 3 ? true : false,
                external_other_specify: fetchPlantilla.data[0].external_other_specify,
                work_office: fetchPlantilla.data[0].work_office,
                work_office_a: fetchPlantilla.data[0].work_office === 1 || fetchPlantilla.data[0].work_office === 3 ? true : false,
                work_office_b: fetchPlantilla.data[0].work_office === 2 || fetchPlantilla.data[0].work_office === 3 ? true : false,
                work_field: fetchPlantilla.data[0].work_field,
                work_field_a: fetchPlantilla.data[0].work_field === 1 || fetchPlantilla.data[0].work_field === 3 ? true : false,
                work_field_b: fetchPlantilla.data[0].work_field === 2 || fetchPlantilla.data[0].work_field === 3 ? true : false,
                work_others: fetchPlantilla.data[0].work_others,
                desc_unit_section: fetchPlantilla.data[0].desc_unit_section,
                desc_job_summary: fetchPlantilla.data[0].desc_job_summary,
                core_competency: fetchPlantilla.data[0].core_competency,
                core_level: fetchPlantilla.data[0].core_level,
                leader_competency: fetchPlantilla.data[0].leader_competency,
                leader_level: fetchPlantilla.data[0].leader_level,
                technical_percent: fetchPlantilla.data[0].technical_percent,
                technical_competency: fetchPlantilla.data[0].technical_competency,
                technical_level: fetchPlantilla.data[0].technical_level,
            })
            Swal.close()
            handlePrintPdf()
        }
        if (category === 'CATD') {
            let res = await axios.post(`/api/recruitment/jobPosting/status/issuance-appointment/printForms`, { vacancyId: data, category: category })
            console.log(res)
            Swal.close()
            setCatd(res.data)
            handlePrintCATD()
        }
        if (category === 'OathOffice') {
            let res = await axios.post(`/api/recruitment/jobPosting/status/issuance-appointment/printForms`, { vacancyId: data, category: category, appointed: appointed })
            console.log('oath',res)
            Swal.close()
            setOathOfOffice(res.data)
            handlePrintOO()
        }
        if (category === 'certification') {
            let res = await axios.post(`/api/recruitment/jobPosting/status/issuance-appointment/printForms`, { vacancyId: data, category: category, appointed: appointed })
            console.log('certification',res)
            Swal.close()
            setCertification(res.data)
            handlePrintCert()
        }
    }

    const getAppointees = async () => {
        let res = await axios.get(`api/recruitment/jobPosting/status/issuance-appointment/getIssuanceAppointment?vacancyId=${data}`, {}, { signal: controller.signal })
        setLoader(false)
        // check if someone already appointed
        let tempRes = res.data.data.filter(item => item.is_appoint === 1)
        if (tempRes.length > 0) {
            setAppointed(tempRes[0])
        }
        setList(res.data.data)
    }

    const [modalAssignDateData, setModalAssignDateData] = useState('')
    const [assignDate, setAssignDate] = useState('')
    const appointToPosition = async (item) => {
        Swal.fire({
            text: `Appoint "${item?.fname + ' ' + item?.mname + ' ' + item?.lname}" !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setModalAssignDateData(item)
                setOpenAssignDate(true)
            }
        })
    }

    const handleSubmitToAppoint = async (e) => {
        e.preventDefault()
        if (!assignDate) {
            toast.warning('Assign date!')
            return
        }
        Swal.fire({
            text: 'Appointing applicant',
            icon: 'info'
        })
        Swal.showLoading()
        let nonAppointee = [...list].filter(x => x.profile_id !== modalAssignDateData.profile_id)
        let res = await axios.post(`api/recruitment/jobPosting/status/issuance-appointment/appointApplicant`, { data: modalAssignDateData, non_appointee: nonAppointee, vacancy_id: data, assign_date: assignDate })
        Swal.close()
        if (res.data.status === 200) {
            toast.success('Applicant successfully appointed to position!')
        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        let tempList = list.filter(item => item.profile_id === res.data.id)
        setAppointed(tempList[0])
        setOpenAssignDate(false)
    }

    const submitRevokeAppointment = async (e) => {
        e.preventDefault()
        setRevokePasswordLoader(true)
        setRevokeError({
            error: false,
            message: ''
        })
        let res = await axios.post(`/api/recruitment/jobPosting/status/issuance-appointment/revokeAppointment`, { password: revokePassword, appointed: appointed })
        setRevokePasswordLoader(false)
        if (res.data.status === 500) {
            setRevokeError({
                error: true,
                message: res.data.message
            })
        }
        else if (res.data.status === 200) {
            toast.success('sucessfully REVOKED!')
            setRevokeError({
                error: false,
                message: ''
            })
            setRevokeModal(false)
            getAppointees()
            setAppointed('')
        }
        setRevokePassword('')
    }


    let controller = new AbortController()
    useEffect(() => {
        getAppointees()
        return () => controller.abort()
    }, [])

    useEffect(() => {
        let timer = ''
        if (textPopUpCount > 3) {
            setTextPopUpCount(0)
        }
        else {
            timer = setTimeout(() => {
                setTextPopUp(textPopUpData[textPopUpCount])
                setTextPopUpCount(prev => prev + 1)
            }, 3900);
        }
        return (() => clearTimeout(timer))
    }, [textPopUpCount])

    useEffect(() => {
        if (transferDataRef.current) {
            transferDataRef.current = false
        }
        else {
            if (!transferReadyModal) {
                setTransferError(false)
                setTransferSuccess(false)
            }
        }

    }, [transferReadyModal])
    return (
        <Container sx={{ pt: 2, px: { xs: '', md: '' } }}>
            <CustomBackdrop title='processing, please wait . . . ' open={statusBackdrop} />
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    <Form33A appointed={appointed} form33Adata={form33Adata || ''} form33AdditionalData={form33AdditionalData} />
                </div>
            </div>
            <div style={{ display: 'none' }}>
                <div ref={componentRefPDf}>
                    <Pdf appointed={appointed} data={plantillaPdf || ''} />
                </div>
            </div>
            <div style={{ display: 'none' }}>
                <div ref={componentRefCATD}>
                    <CertificationAssumptionToDuty appointed={appointed} catd={catd || ''} />
                </div>
            </div>

            <div style={{ display: 'none' }}>
                <div ref={componentRefOO}>
                    <AothOfOffice appointed={appointed} oathOfOffice={oathOfOffice || ''} />
                </div>
            </div>

            <div style={{ display: 'none' }}>
                <div ref={componentRefCert}>
                    <Certification appointed={appointed} certification={certification || ''} />
                </div>
            </div>
            {/* modal for specifying date when appointed */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openAssignDate}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openAssignDate}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: '1.5rem',
                        boxShadow: 24,
                        p: 2,
                        px: 4
                    }}>
                        <Box display='flex' justifyContent='flex-end'><CloseIcon color='error' sx={{ cursor: 'pointer' }} onClick={() => setOpenAssignDate(false)} /></Box>
                        <form onSubmit={handleSubmitToAppoint}>
                            <TextField
                                id=""
                                label="SPECIFY NEWLY HIRED VISIT DATE"
                                fullWidth
                                focused
                                type='date'
                                required
                                value={assignDate}
                                onChange={(e) => setAssignDate(e.target.value)}
                                sx={{ mt: 3 }}
                            />
                            <Box display='flex' justifyContent='flex-end' mt={2}>
                                <Button type='submit' variant='contained' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }}>Submit</Button>
                            </Box>
                        </form>

                    </Box>
                </Fade>
            </Modal>

            {/* revoke modal */}
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={revokeModal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={revokeModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: '2rem',
                            boxShadow: 24,
                            p: 4,
                            pt: 2,
                        }}>
                            <Box display='flex' justifyContent='flex-end'>
                                <CancelIcon sx={{ fontSize: 40, cursor: 'pointer' }} color="error" onClick={() => setRevokeModal(false)} />
                            </Box>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                Please submit your password for verification.
                            </Typography>
                            <form onSubmit={submitRevokeAppointment} >
                                <TextField
                                    sx={{ mt: 2 }}
                                    variant='outlined'
                                    id=""
                                    label="Password"
                                    required
                                    value={revokePassword}
                                    placeholder='type password'
                                    onChange={(e) => setRevokePassword(e.target.value)}
                                    helperText={revokeError.error ? revokeError?.message : false}
                                    error={revokeError?.error}
                                    fullWidth
                                />
                                <Box display="flex" justifyContent='flex-start' mt={2}>
                                    <Button type='submit' color="error" variant='contained' startIcon={revokePasswordLoader ? <CircularProgress sx={{ color: '#fff' }} size={25} /> : <PriorityHighIcon />} sx={{ borderRadius: '2rem' }}>Revoke</Button>
                                </Box>
                            </form>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            {/* transfer modal */}
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={transferReadyModal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={transferReadyModal}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: 350, md: 500 },
                            bgcolor: 'background.paper',
                            borderRadius: '2rem',
                            boxShadow: `5px 5px 10px ${transferError ? 'red' : 'gray'}`,
                            p: 4,
                            pt: 2,
                            pb: 2,
                        }}>
                            <CustomBackdrop title='processing, please wait . . . ' open={statusBackdrop} />
                            <Box display='flex' justifyContent='flex-end'>
                                <CancelIcon sx={{ fontSize: 40, cursor: 'pointer' }} color="error" onClick={() => setTransferReadyModal(false)} />
                            </Box>
                            <Typography color="primary" sx={{ mt: 2 }} align="center">
                                Please wait, The system is transferring informations from appplicant to employee table.
                            </Typography>
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                                    {transferError && (
                                        <Card className="animate__animated animate__bounceIn" raised sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'error.main' }}>
                                            <ErrorIcon sx={{ fontSize: '3rem', color: '#fff' }} />
                                            <Typography variant='h6' align='center' color='#fff'>
                                                Something went wrong!
                                            </Typography>
                                            <br />
                                            <Typography variant="body1" align='center' color="#fff">Changes are not applied.</Typography>
                                        </Card>

                                    )}
                                    {!transferError && !transferSuccess && <Typography variant="h5" align='center' color="#fff" sx={{ WebkitTextStroke: '1px black' }} className="transfer-blinker"><b>{textPopUp}</b></Typography>}
                                </Box>
                                <Box sx={{ height: '25rem' }}>
                                    {!transferSuccess && <img src={TransferSvg} width="100%" />}
                                    {transferSuccess && <img src={TransferSuccess} width="100%" />}
                                </Box>

                                <Box display='flex' justifyContent='center'>
                                    {transferSuccess && <Button variant='contained' color="success" sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({},'TO-CLOSE', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop)}>Data transfer success</Button>}
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            <Typography variant="body1" color="primary" align='center'> Issuance of appointment</Typography>
            {appointed ? (
                <Box display="flex" sx={{ flexDirection: 'column' }}>
                    <Box display='flex' justifyContent="space-between" mt={1}>
                        <Box flex={2}>
                            <Typography variant="body1" align="right" sx={{ mt: 1, color: 'success.main' }}><b>APPOINTED APPLICANT FOR THE POSITION</b></Typography>
                        </Box>
                        <Box flex={1} display="flex" justifyContent="flex-end">
                            <Button onClick={() => handleOpenRevokeModal()} variant='contained' color="error" sx={{ borderRadius: '2rem' }} startIcon={<DoDisturbIcon />}>REVOKE</Button>
                        </Box>
                    </Box>
                    <Box display="flex" sx={{ justifyContent: 'center', mt: 1, alignItems: 'center' }}>
                        <Typography variant="h5" color="initial" sx={{ ml: 1, letterSpacing: 2, color: 'primary.main', fontWeight: 700 }}>{appointed?.fname} {appointed?.mname} {appointed?.lname}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body1" color="#BEBEBE" align="center" letterSpacing={5} mt="30px" ><LocalPrintshopIcon /> PRINTABLES</Typography>
                    </Box>
                    <Box display="flex" sx={{ justifyContent: 'center', mb: '30px', mt: '10px', gap: '10px', flexDirection: { xs: 'column', md: 'row' } }}>
                        <Tooltip
                            open={form33Tooltip}
                            title={
                                <Box sx={{ p: 2 }}>
                                    <Box display='flex' justifyContent='flex-end'><CloseIcon sx={{ color: 'error.main', cursor: 'pointer' }} onClick={() => setForm33Tooltip(false)} /></Box>
                                    <Typography variant="body2" color="initial" gutterBottom>Provide this data to proceed printing.</Typography>
                                    <TextField
                                        id=""
                                        label="Nature of appointment"
                                        size='small'
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        name="nature"
                                        value={form33AdditionalData.nature}
                                        onChange={handleChangeForm33A}
                                    />
                                    <TextField
                                        id=""
                                        label="Appointment vice"
                                        size='small'
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        name="vice"
                                        value={form33AdditionalData.vice}
                                        onChange={handleChangeForm33A}
                                    />
                                    <TextField
                                        id=""
                                        label="Page number"
                                        fullWidth
                                        size='small'
                                        name='page'
                                        value={form33AdditionalData.page}
                                        onChange={handleChangeForm33A}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button variant='contained' sx={{ mt: 2 }} onClick={() => handlePrintFn('Form33A')}>Print</Button>
                                </Box>
                            }
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: '#fff',
                                        '& .MuiTooltip-arrow': {
                                            color: 'primary.light',
                                        },
                                        border: `2px solid ${blue[500]}`,
                                    },
                                },
                            }}
                            arrow>
                            <Button variant="contained" color="primary" size='small' onClick={() => setForm33Tooltip(true)} >
                                CS Form No. 33 - A
                            </Button>
                        </Tooltip>
                        <Button variant="contained" color="primary" size='small' onClick={() => handlePrintFn('Pdf')} >
                            Position Descripton Form
                        </Button>
                        <Button variant="contained" color="primary" size='small' onClick={() => handlePrintFn('CATD')}>
                            Certification of Assumption To Duty
                        </Button>
                        <Button variant="contained" color="primary" size='small' onClick={() => handlePrintFn('OathOffice')}>
                            Oath of Office
                        </Button>
                        <Button variant="contained" color="primary" size='small' onClick={() => handlePrintFn('certification')}>
                            Certification
                        </Button>
                    </Box>
                    <Box display="flex" sx={{ justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant='contained' color='info' endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} onClick={e => handleChangeStatus({},'CLOSED', data, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop, setTransferReadyModal, appointed)}>CLOSE POSITION</Button>
                    </Box>
                </Box>
            ) : (
                <>
                    <Warnings arr={[{ color: 'primary.light', text: 'Insider applicant' }]} />
                    <TableContainer component={Paper} sx={{ maxHeight: '70vh', mt: 1 }}>
                        <Table aria-label="issuance-appointment table" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>#</TableCell>
                                    <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>FIRST NAME</TableCell>
                                    <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>MIDDLE NAME</TableCell>
                                    <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>LAST NAME</TableCell>
                                    <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }} align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loader ? (
                                    <>
                                        {Array.from(Array(5)).map((item, index) => (
                                            <TableRow >
                                                <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                <TableCell align="left"><Skeleton variant="text" width="" height="" animation="pulse" /></TableCell>
                                                <TableCell align="left">
                                                    <Skeleton variant="text" width="" height="" animation="pulse" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {list && list.length === 0 && (
                                            <TableRow>
                                                <TableCell sx={{ bgcolor: red[500], color: '#fff' }} align='center' colSpan={5}>
                                                    empty
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {list && list.map((item, index) => (
                                            <Fade in key={item?.profile_id}>
                                                <TableRow >
                                                    <TableCell sx={{ bgcolor: item?.employee_id ? blue[500] : '', color: item?.employee_id ? '#fff' : '' }} align="left">{index + 1}</TableCell>
                                                    <TableCell sx={{ bgcolor: item?.employee_id ? blue[500] : '', color: item?.employee_id ? '#fff' : '' }} align="left">{item?.fname}</TableCell>
                                                    <TableCell sx={{ bgcolor: item?.employee_id ? blue[500] : '', color: item?.employee_id ? '#fff' : '' }} align="left">{item?.mname}</TableCell>
                                                    <TableCell sx={{ bgcolor: item?.employee_id ? blue[500] : '', color: item?.employee_id ? '#fff' : '' }} align="left">{item?.lname}</TableCell>
                                                    <TableCell align="left">
                                                        <Box display="flex" sx={{ justifyContent: 'flex-end' }}>
                                                            <Button startIcon={<PersonIcon />} sx={{ borderRadius: '2rem' }} variant='contained' onClick={() => appointToPosition(item)}>Appoint</Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))}
                                    </>
                                )}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
};

export default IssuanceAppointment;