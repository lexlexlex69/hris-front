import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red, yellow } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// mui icons
import ErrorIcon from '@mui/icons-material/Error'
import CachedIcon from '@mui/icons-material/Cached'
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// external imports functions
import { getEmployeeReferences, handleUpdate, handleDeleteLocal, handleUndo, getReferencesUpdates } from './Controller'
// external imports components
import Add from './Add';
import Update from './Update'
import TableUpdates from './TableUpdates'
import CustomDeleteIcon from '../../customComponents/CustomDeleteIcon'
import CustomEditIcon from '../../customComponents/CustomEditIcon'
import CustomRemove from '../../customComponents/CustomRemove'
import SkeletonLoader from '../../customComponents/SkeletonLoader'

// external imports global function 

function References() {
    // pdsParam
    const pdsParam = useParams()
    // loader
    const [loader, setLoader] = useState(false)
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // local Component states
    const [referenceCounter, setReferenceCounter] = useState(0) // added this state to check if there are always three entries in references, ex: when deleting, count will be n - 1, when adding count will be n + 1, so if add button is clicked, it checks if there are always three items  in the references table
    const [references, setReferences] = useState([])
    const [referencesUpdates, setReferencesUpdates] = useState([])
    const [referencesRecord, setReferencesRecord] = useState([])
    const [defaultState, setDefaultState] = useState([])
    // modal states
    //  ---- add modal
    const [openAddModal, setOpenAddModal] = useState(false);
    const handleOpenAddModal = () => {
        if (referenceCounter >= 3) {
            toast.warn('You already have three references. \n You cannot add more.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { width: '100%' }
            });
        }
        else {
            setOpenAddModal(true)
        }
    }
    const handleCloseAddModal = () => setOpenAddModal(false);

    // modal states update children
    const firstRender = useRef(true)
    const [updateRecordState, setUpdateRecordState] = useState('')
    const [updateRecordTrigger, setUpdateRecordTrigger] = useState(false)
    const [openUpdateRecord, setOpenUpdateRecord] = useState(false);
    const handleOpenUpdateRecordModal = (data) => {
        setUpdateRecordState(data)
        setUpdateRecordTrigger(true)
    }
    const handleCloseUpdateRecordModal = () => {
        setOpenUpdateRecord(false)
        setUpdateRecordTrigger(false)
    };

    // functions

    //  modal state table updates
    const [openTableModal, setOpenTableModal] = useState(false);
    const hOpenTableModal = () => setOpenTableModal(true)
    const hCloseTableModal = () => setOpenTableModal(false);

    //   reload table
    const handleReloadTable = () => {
        Swal.fire({
            text: 'reloading the table . . .',
            icon: 'info',
            allowOutsideClick: false,
        })
        Swal.showLoading()
        setReferencesRecord([])
        let controller = new AbortController()
        getReferencesUpdates(pdsParam.id, setReferences, controller, setReferencesUpdates, setDefaultState, setLoader, setReferenceCounter)
    }

    useEffect(() => {
        const controller = new AbortController()
        if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
            //console.log('yes')
            getReferencesUpdates(pdsParam.id, setReferences, controller, setReferencesUpdates, setDefaultState, setLoader, setReferenceCounter)
        }
        else {
            getReferencesUpdates('', setReferences, controller, setReferencesUpdates, setDefaultState, setLoader, setReferenceCounter)
        }
    }, [])

    // when update button is click
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        }
        else {
            if (updateRecordTrigger) {
                setOpenUpdateRecord(true)
            }
        }
    }, [updateRecordTrigger])
    return (
        <Grid container spacing={1}>
            {/* add modal */}
            <Modal
                aria-labelledby="transition-modal-add-record"
                aria-describedby="transition-modal-add-record"
                open={openAddModal}
                sx={{ zIndex: 1000 }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
            >
                <Fade in={openAddModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '80%' : '50%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        p: 4,
                        pt: 1
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD NEW REFERENCE</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseAddModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <Add handleClose={handleCloseAddModal} references={references} setReferences={setReferences} referencesRecord={referencesRecord} setReferencesRecord={setReferencesRecord} setCounter={setReferenceCounter} />
                    </Box>
                </Fade>
            </Modal>
            {/*  */}
            {/* update modal */}
            {/* Update Record */}
            <Modal
                aria-labelledby="transition-modal-add-child"
                aria-describedby="transition-modal-add-child"
                open={openUpdateRecord}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                sx={{ zIndex: 999 }}
            >
                <Fade in={openUpdateRecord}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: matches ? '80%' : '80%',
                        bgcolor: 'background.paper',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE REFERENCE</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={handleCloseUpdateRecordModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <Update data={updateRecordState} handleClose={handleCloseUpdateRecordModal} references={references} setReferences={setReferences} referencesRecord={referencesRecord} setReferencesRecord={setReferencesRecord} />
                    </Box>
                </Fade>
            </Modal>
            {/*  */}
            {/* update table modal */}
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
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{!pdsParam.id && localStorage.getItem('hris_roles') !== '1' && referencesUpdates.length > 0 ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                            <Tooltip title="close modal">
                                <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
                            </Tooltip>
                        </Box>
                        <TableUpdates handleClose={hCloseTableModal} references={references} setReferences={setReferences} referencesUpdates={referencesUpdates || []} setReferencesUpdates={setReferencesUpdates} pdsParam={pdsParam || ''} />
                    </Box>
                </Fade>
            </Modal>
            <Typography sx={{ p: 1, color: '#fff', mb: 1, bgcolor: '#62757f', width: '100%' }}>REFERENCES (Person not related by consanguinity or affinity to applicant/appointee)</Typography>
            {!loader ? (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <SkeletonLoader />
                </Grid>
            ) : (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="body2" sx={{color:'warning.main'}}>If you want to add more than one reference, please add them all before submitting to avoid overwriting previous entered information.</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1,mt:1 }}>
                        <Box sx={{ flex: 1 }}>
                            <Tooltip title="reload table">
                                <CachedIcon fontSize='large' className='reloader-icons' onClick={handleReloadTable} />
                            </Tooltip>
                        </Box>
                        {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }} className="side-add-button">
                                {pdsParam.id && localStorage.getItem('hris_roles') === '1' && referencesUpdates.length > 0 ? (
                                    <Button variant="contained" className='pending-updates-btn' onClick={hOpenTableModal} color="warning" startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                                        {matches ? 'UPDATES' : (<b>check available table updates</b>)}
                                    </Button>
                                ) : null}
                            </Box>
                        ) : null}
                        {!pdsParam.id && referencesUpdates.length > 0 ? (
                            <Box>
                                <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                                    {matches ? 'PENDING' : (<b>Pending Updates</b>)}
                                </Button>
                            </Box>
                        ) : null}
                        {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? null : (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} className="side-add-button">
                                <Tooltip title="add new record" placement="top">
                                    <Button variant='contained' className='add-record-btn' color="primary" onClick={handleOpenAddModal}> <AddIcon />add</Button>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='cgb-color-table'> <Typography className='table-font-size'></Typography> </TableCell>
                                    <TableCell className='cgb-color-table'> <Typography className='table-font-size'></Typography> </TableCell>
                                    <TableCell className='cgb-color-table'> <Typography className='table-font-size'>NAME</Typography> </TableCell>
                                    <TableCell className='cgb-color-table' align="right"><Typography className='table-font-size'>ADDRESS</Typography> </TableCell>
                                    <TableCell className='cgb-color-table' align="right"><Typography className='table-font-size'>TEL NO.</Typography> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {references && references.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item.isNew ? blue[300] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null }}
                                    >
                                        {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                            <TableCell sx={{ bgcolor: '#fff' }}>
                                                {item.isNew || item.isDelete || item.isUpdated ? (
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: 'auto' }}>
                                                        <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, references, setReferences, referencesRecord, setReferencesRecord, defaultState, setReferenceCounter)} />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', width: 'auto' }}>
                                                        <Tooltip title="Edit record" onClick={() => handleOpenUpdateRecordModal(item)}>
                                                            <CustomEditIcon />
                                                        </Tooltip>
                                                        <Tooltip title="Delete record">
                                                            <CustomDeleteIcon onClick={() => handleDeleteLocal(item, index, referencesRecord, setReferencesRecord, references, setReferences, setReferenceCounter)} />
                                                        </Tooltip>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {item.RefName}
                                        </TableCell>
                                        <TableCell align="right">
                                            {item.RefAddress}
                                        </TableCell>
                                        <TableCell align="right">
                                            {item.RefTel}
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Button variant='contained' color="success" sx={{ color: '#fff', mb: 2, borderRadius: '2rem' }} onClick={() => handleUpdate(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), referencesRecord, setReferencesRecord, setReferences, defaultState)}> Submit update</Button>
                        </Box>
                    )}
                </Grid>
            )}

        </Grid>
    )
}

export default React.memo(References)