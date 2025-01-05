import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red, yellow } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Swal from 'sweetalert2'

// mui icons
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CachedIcon from '@mui/icons-material/Cached'
import ErrorIcon from '@mui/icons-material/Error'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Sk from './Sk'
import { getSpecialSkillsOthers, getSpecialSkillsOthersUpdates, handleUpdate, handleDeleteLocal, handleUndo } from './Controller'
import AddSpecialSkills from './AddSpecialSkills'
import AddRecognition from './AddRecognition'
import AddOrganization from './AddOrganization'

import UpdateSpecialSkills from './UpdateSpecialSkills'
import UpdateRecognition from './UpdateRecognition'
import UpdateOrganization from './UpdateOrganization'
import TableUpdates from './TableUpdates'

import CustomRemove from '../../customComponents/CustomRemove';
import CustomDeleteIcon from '../../customComponents/CustomDeleteIcon';
import CustomEditIcon from '../../customComponents/CustomEditIcon';

import ReloadTable from '../../../../../assets/img/reloadingtable.svg'

function SkillsOthers() {
    const pdsParam = useParams()
    const [loader, setLoader] = useState(false)
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // updates states

    const [updates, setUpdates] = useState('')

    // special skills states
    const [specialSkills, setSpecialSkills] = useState([])
    const [specialSkillsUpdates, setSpecialSkillsUpdates] = useState([])
    const [specialSkillsRecord, setSpecialSkillsRecord] = useState([])
    const [specialSkillsDefault, setSpecialSkillsDefault] = useState([])

    // modal states update special skills
    const firstRenderSpecialSkills = useRef(true)
    const [updateSpecialSkillsState, setUpdateSpecialSkillsState] = useState('')
    const [updateSpecialSkillsTrigger, setUpdateSpecialSkillsTrigger] = useState(false)
    const [openUpdateSpecialSkills, setOpenUpdateSpecialSkills] = useState(false);
    const handleOpenUpdateSpecialSkillsModal = (data) => {
        setUpdateSpecialSkillsState(data)
        setUpdateSpecialSkillsTrigger(true)
    }
    const handleCloseUpdateSpecialSkillsModal = () => {
        setUpdateSpecialSkillsTrigger(false)
        setOpenUpdateSpecialSkills(false)
    };
    // recognition
    const [recognition, setRecognition] = useState([])
    const [recognitionUpdates, setRecognitionUpdates] = useState([])
    const [recognitionRecord, setRecognitionRecord] = useState([])
    const [recognitionDefault, setRecognitionDefault] = useState([])

    // modal states update recognition
    const firstRenderRecognition = useRef(true)
    const [updateRecognitionState, setUpdateRecognitionState] = useState('')
    const [updateRecognitionTrigger, setUpdateRecognitionTrigger] = useState(false)
    const [openUpdateRecognition, setOpenUpdateRecognition] = useState(false);
    const handleOpenUpdateRecognitionModal = (data) => {
        setUpdateRecognitionState(data)
        setUpdateRecognitionTrigger(true)
    }
    const handleCloseUpdateRecognitionModal = () => {
        setUpdateRecognitionTrigger(false)
        setOpenUpdateRecognition(false)
    };
    // organization
    const [organization, setOrganization] = useState([])
    const [organizationUpdates, setOrganizationUpdates] = useState([])
    const [organizationRecord, setOrganizationRecord] = useState([])
    const [organizationDefault, setOrganizationDefault] = useState([])

    // modal states update recognition
    const firstRenderOrganization = useRef(true)
    const [updateOrganizationState, setUpdateOrganizationState] = useState('')
    const [updateOrganizationTrigger, setUpdateOrganizationTrigger] = useState(false)
    const [openUpdateOrganization, setOpenUpdateOrganization] = useState(false);
    const handleOpenUpdateOrganizationModal = (data) => {
        setUpdateOrganizationState(data)
        setUpdateOrganizationTrigger(true)
    }
    const handleCloseUpdateOrganizationModal = () => {
        setUpdateOrganizationTrigger(false)
        setOpenUpdateOrganization(false)
    };
    // ---------------------------------
    // modal states
    // special skills
    const [openSpecialSkills, setOpenSpecialSkills] = useState(false);
    const handleOpenSpecialSkills = () => setOpenSpecialSkills(true);
    const handleCloseSpecialSkills = () => setOpenSpecialSkills(false);

    // recognition
    const [openRecognition, setOpenRecoginition] = useState(false);
    const handleOpenRecognition = () => setOpenRecoginition(true);
    const handleCloseRecognition = () => setOpenRecoginition(false);


    // organization
    const [openOrganization, setOpenOrganization] = useState(false);
    const handleOpenOrganization = () => setOpenOrganization(true);
    const handleCloseOrganization = () => setOpenOrganization(false);

    //  modal state table updates
    const [openTableModal, setOpenTableModal] = useState(false);
    const hOpenTableModal = () => setOpenTableModal(true)
    const hCloseTableModal = () => setOpenTableModal(false);

    // functions

    const handleReloadTable = () => {
        Swal.fire({
            text: 'reloading the table . . .',
            icon: 'info',
            allowOutsideClick: false,
        })
        Swal.showLoading()
        let controller = new AbortController()
        getSpecialSkillsOthersUpdates(pdsParam.id, setSpecialSkills, setRecognition, setOrganization, setLoader, controller, setUpdates, setSpecialSkillsDefault, setRecognitionDefault, setOrganizationDefault, setSpecialSkillsRecord, setRecognitionRecord, setOrganizationRecord)
    }
    useEffect(() => {
        let controller = new AbortController()
        if (localStorage.getItem('hris_roles') === '1' && pdsParam.id) {
            getSpecialSkillsOthersUpdates(pdsParam.id, setSpecialSkills, setRecognition, setOrganization, setLoader, controller, setUpdates, setSpecialSkillsDefault, setRecognitionDefault, setOrganizationDefault, setSpecialSkillsRecord, setRecognitionRecord, setOrganizationRecord)
        }
        else {
            getSpecialSkillsOthersUpdates(pdsParam.id, setSpecialSkills, setRecognition, setOrganization, setLoader, controller, setUpdates, setSpecialSkillsDefault, setRecognitionDefault, setOrganizationDefault, setSpecialSkillsRecord, setRecognitionRecord, setOrganizationRecord)
            // getSpecialSkillsOthers('', setSpecialSkills, setRecognition, setOrganization, setLoader, controller)
        }
        // clean up
        return () => {
            controller.abort()
        }
    }, [])

    useEffect(() => {
        if (firstRenderSpecialSkills.current) {
            firstRenderSpecialSkills.current = false
        }
        else {
            if (updateSpecialSkillsTrigger) {
                setOpenUpdateSpecialSkills(true)
            }
        }
    }, [updateSpecialSkillsTrigger])

    useEffect(() => {
        if (firstRenderRecognition.current) {
            firstRenderRecognition.current = false
        }
        else {
            if (updateRecognitionTrigger) {
                setOpenUpdateRecognition(true)
            }
        }
    }, [updateRecognitionTrigger])

    useEffect(() => {
        if (firstRenderOrganization.current) {
            firstRenderOrganization.current = false
        }
        else {
            if (updateOrganizationTrigger) {
                setOpenUpdateOrganization(true)
            }
        }
    }, [updateOrganizationTrigger])

    return (
        <Grid container spacing={1}>
            {/* special skills add modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openSpecialSkills}
                onClose={handleCloseSpecialSkills}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openSpecialSkills}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            height: 'auto',
                            transform: 'translate(-50%, -50%)',
                            width: matches ? '20rem' : '40rem',
                            // bgcolor: 'background.paper',
                            bgcolor: 'background.paper',
                            borderRadius: '1rem',
                            boxShadow: 24,
                            px: 2,
                            pt: 1,
                            pb: 4,
                        }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD SPECIAL SKILLS</Typography></Box>
                        <AddSpecialSkills handleClose={handleCloseSpecialSkills} specialSkills={specialSkills} setSpecialSkills={setSpecialSkills} specialSkillsRecord={specialSkillsRecord} setSpecialSkillsRecord={setSpecialSkillsRecord} />
                    </Box>
                </Fade>
            </Modal>
            {/*  */}
            {/* special recognition */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openRecognition}
                onClose={handleCloseRecognition}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openRecognition}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            height: 'auto',
                            transform: 'translate(-50%, -50%)',
                            width: matches ? '20rem' : '40rem',
                            // bgcolor: 'background.paper',
                            bgcolor: 'background.paper',
                            borderRadius: '1rem',
                            boxShadow: 24,
                            px: 2,
                            pt: 1,
                            pb: 4,
                        }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD DISTINCTION/RECOGNITION</Typography></Box>
                        <AddRecognition handleClose={handleCloseRecognition} recognition={recognition} setRecognition={setRecognition} recognitionRecord={recognitionRecord} setRecognitionRecord={setRecognitionRecord} />
                    </Box>
                </Fade>
            </Modal>
            {/*  */}
            {/* add organization */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openOrganization}
                onClose={handleCloseOrganization}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openOrganization}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            height: 'auto',
                            transform: 'translate(-50%, -50%)',
                            width: matches ? '20rem' : '40rem',
                            // bgcolor: 'background.paper',
                            bgcolor: 'background.paper',
                            borderRadius: '1rem',
                            boxShadow: 24,
                            px: 2,
                            pt: 1,
                            pb: 4,
                        }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD ASSOCIATION/ORGANIZATION</Typography></Box>
                        <AddOrganization handleClose={handleCloseOrganization} recognition={organization} setRecognition={setOrganization} recognitionRecord={organizationRecord} setRecognitionRecord={setOrganizationRecord} />
                    </Box>
                </Fade>
            </Modal>
            {/*  */}
            {/* special skills update modal */}
            <Modal
                aria-labelledby="transition-modal-add-child"
                aria-describedby="transition-modal-add-child"
                open={openUpdateSpecialSkills}
                onClose={handleCloseUpdateSpecialSkillsModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                sx={{ zIndex: 999 }}
            >
                <Fade in={openUpdateSpecialSkills}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '80%' : '60%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE SPECIAL SKILLS</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateSpecialSkillsModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <UpdateSpecialSkills data={updateSpecialSkillsState} handleClose={handleCloseUpdateSpecialSkillsModal} specialSkills={specialSkills} setSpecialSkills={setSpecialSkills} specialSkillsRecord={specialSkillsRecord} setSpecialSkillsRecord={setSpecialSkillsRecord} />
                    </Box>
                </Fade>
            </Modal>
            {/* recognition update modal */}
            <Modal
                aria-labelledby="transition-modal-add-child"
                aria-describedby="transition-modal-add-child"
                open={openUpdateRecognition}
                onClose={handleCloseUpdateRecognitionModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                sx={{ zIndex: 999 }}
            >
                <Fade in={openUpdateRecognition}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '80%' : '60%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE RECOGNITION</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateRecognitionModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <UpdateRecognition data={updateRecognitionState} handleClose={handleCloseUpdateRecognitionModal} recognition={recognition} setRecognition={setRecognition} recognitionRecord={recognitionRecord} setRecognitionRecord={setRecognitionRecord} />
                    </Box>
                </Fade>
            </Modal>
            {/* organization update modal */}
            <Modal
                aria-labelledby="transition-modal-add-child"
                aria-describedby="transition-modal-add-child"
                open={openUpdateOrganization}
                onClose={handleCloseUpdateOrganizationModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                sx={{ zIndex: 999 }}
            >
                <Fade in={openUpdateOrganization}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '80%' : '60%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE ORGANIZATION</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateOrganizationModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <UpdateOrganization data={updateOrganizationState} handleClose={handleCloseUpdateOrganizationModal} organization={organization} setOrganization={setOrganization} organizationRecord={organizationRecord} setOrganizationRecord={setOrganizationRecord} />
                    </Box>
                </Fade>
            </Modal>
            {/* tables updates modal */}
            <Modal
                sx={{ zIndex: 999 }}
                aria-labelledby="transition-modal-add-child"
                aria-describedby="transition-modal-add-child"
                open={openTableModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openTableModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        height: '80%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '80%' : '95%',
                        // bgcolor: 'background.paper',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        px: 2,
                        pt: 1,
                        pb: 4,
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{localStorage.getItem('hris_roles') !== '1' && !pdsParam.id && updates.length > 0 ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <TableUpdates handleClose={hCloseTableModal} updates={updates} setUpdates={setUpdates} specialSkills={specialSkills} recognition={recognition} organization={organization} pdsParam={pdsParam.id || ''} />
                    </Box>
                </Fade>
            </Modal>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip title="reload tables">
                    <CachedIcon className='reloader-icons' fontSize='large' onClick={handleReloadTable} />
                </Tooltip>
                {localStorage.getItem('hris_roles') === '1' && pdsParam.id && updates.length > 0 ? (
                    <Button variant="contained" onClick={hOpenTableModal} color="warning" className='pending-updates-btn' startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}> {matches ? 'UPDATES' : (<b>Check Table  Updates</b>)}</Button>
                ) : null}
                {!pdsParam.id && updates.length > 0 ?
                    (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <Button variant="contained" className='pending-updates-btn' onClick={hOpenTableModal} color="warning" startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />} > {matches ? 'PENDING' : 'Pending  Updates'}</Button>
                        </Box>
                    ) : null}
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                {loader ? (
                    <Fade in>
                        <div>
                            {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                <Tooltip title="add special skills" placement="top">
                                    <Button size="small" variant="contained" className='add-record-btn' sx={{ mb: 1 }} onClick={handleOpenSpecialSkills}><AddIcon /></Button>
                                </Tooltip>
                            )}
                            <TableContainer component={Paper} sx={{ maxHeight: '20rem', height: '20rem' }}>
                                <Table aria-label="simple table" size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                                    <Typography className='table-font-size'>
                                                    </Typography>
                                                </TableCell>
                                            )}
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                                <Typography className='table-font-size'>
                                                    SPECIAL SKILLS
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {specialSkills && specialSkills.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item.isNew ? blue[300] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null }}
                                            >
                                                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                                    <TableCell sx={{ bgcolor: '#fff', display: 'flex', justifyContent: 'flex-end' }}>
                                                        {item.isNew || item.isDelete || item.isUpdated ? (
                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, specialSkills, setSpecialSkills, specialSkillsRecord, setSpecialSkillsRecord, specialSkillsDefault)} />
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="Edit record">
                                                                    <CustomEditIcon onClick={() => handleOpenUpdateSpecialSkillsModal(item)} />
                                                                </Tooltip>
                                                                <Tooltip title="Delete record">
                                                                    <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, specialSkillsRecord, setSpecialSkillsRecord, specialSkills, setSpecialSkills)} />
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                )}
                                                <TableCell component="th" scope="row" className='table-font-size' width="80%">
                                                    <b>{item.description}</b>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                    <Button variant='contained' color="success" size="small" sx={{ color: '#fff', borderRadius: '2rem', mr: 1 }} onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), specialSkillsRecord, setSpecialSkillsRecord, 1, setSpecialSkills, specialSkillsDefault)}> Submit</Button>
                                )}
                            </Box>
                        </div>
                    </Fade>
                ) : (<Sk />)}

            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                {loader ?
                    (
                        <Fade in>
                            <div>
                                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                    <Tooltip title="add recognition" placement="top">
                                        <Button size="small" variant="contained" className='add-record-btn' sx={{ mb: 1 }} onClick={handleOpenRecognition}><AddIcon /></Button>
                                    </Tooltip>
                                )}
                                <TableContainer component={Paper} sx={{ maxHeight: '20rem', height: '20rem' }}>
                                    <Table aria-label="simple table" size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                                        <Typography className='table-font-size'>
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                                    <Typography className='table-font-size'>
                                                        NON-ACADEMIC DISTINCTIONS/RECOGNITION
                                                    </Typography>
                                                </TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recognition && recognition.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item.isNew ? blue[300] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null }}
                                                >
                                                    {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                                        <TableCell sx={{ bgcolor: '#fff', display: 'flex', justifyContent: 'flex-end' }}>
                                                            {item.isNew || item.isDelete || item.isUpdated ? (
                                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, recognition, setRecognition, recognitionRecord, setRecognitionRecord, recognitionDefault)} />
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    <Tooltip title="Edit record">
                                                                        <CustomEditIcon onClick={() => handleOpenUpdateRecognitionModal(item)} />
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete record">
                                                                        <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, recognitionRecord, setRecognitionRecord, recognition, setRecognition)} />
                                                                    </Tooltip>
                                                                </Box>
                                                            )}
                                                        </TableCell>
                                                    )}
                                                    <TableCell component="th" scope="row" className='table-font-size'>
                                                        <b>{item.description}</b>
                                                    </TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                        <Button variant='contained' color="success" size="small" sx={{ color: '#fff', borderRadius: '2rem', mr: 1 }} onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), recognitionRecord, setRecognitionRecord, 2, setRecognition, recognitionDefault)}> Submit</Button>
                                    )}
                                </Box>
                            </div>
                        </Fade>
                    )
                    :
                    (<Sk />)}

            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                {loader ? (
                    <Fade in>
                        <div>
                            {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                <Tooltip title="add organization" placement="top">
                                    <Button size="small" variant="contained" className='add-record-btn' sx={{ mb: 1 }} onClick={handleOpenOrganization}><AddIcon /></Button>
                                </Tooltip>
                            )}
                            <TableContainer component={Paper} sx={{ maxHeight: '20rem', height: '20rem' }}>
                                <Table aria-label="simple table" size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                                <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                                    <Typography className='table-font-size'>
                                                    </Typography>
                                                </TableCell>
                                            )}
                                            <TableCell className='cgb-color-table' sx={{ color: '#fff' }}>
                                                <Typography className='table-font-size'>
                                                    MEMBER IN ASSOCIATION/ORGANIZATION
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {organization && organization.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item.isNew ? blue[300] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null }}
                                            >
                                                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                                    <TableCell sx={{ bgcolor: '#fff', display: 'flex', justifyContent: 'flex-end' }}>
                                                        {item.isNew || item.isDelete || item.isUpdated ? (
                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, organization, setOrganization, organizationRecord, setOrganizationRecord, organizationDefault)} />
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="Edit record">
                                                                    <CustomEditIcon onClick={() => handleOpenUpdateOrganizationModal(item)} />
                                                                </Tooltip>
                                                                <Tooltip title="Delete record">
                                                                    <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, organizationRecord, setOrganizationRecord, organization, setOrganization)} />
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                )}
                                                <TableCell component="th" scope="row" className='table-font-size'>
                                                    <b>{item.description}</b>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                    <Button variant='contained' color="success" sx={{ color: '#fff', borderRadius: '2rem', mr: 1 }} size="small" onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), organizationRecord, setOrganizationRecord, 3, setOrganization, organizationDefault)}> Submit</Button>
                                )}
                            </Box>
                        </div>
                    </Fade>
                )
                    : (
                        <Sk />
                    )}
            </Grid>
        </Grid>
    )
}

export default React.memo(SkillsOthers)