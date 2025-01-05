import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Modal, Backdrop, Fade } from '@mui/material'
import { blue, red, yellow, orange } from '@mui/material/colors'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// moment
import moment from 'moment'
import Swal from 'sweetalert2'
// controller
import { getEmployeeWithUpdates, deleteChildLocal, onChangeLocal, handleSubmit, confirmUpdate, handleUndo } from './Controller';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// redux
// mui Icons
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveIcon from '@mui/icons-material/Remove';
// import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


// external components
import AddChild from './AddChild';
import UpdateChild from './UpdateChild';
import TableUpdates2 from './TableUpdates2';
import CustomEditIcon from '../customComponents/CustomEditIcon';
import CustomDeleteIcon from '../customComponents/CustomDeleteIcon';
import CustomRemove from '../customComponents/CustomRemove';
import SkeletonLoader from '../customComponents/SkeletonLoader';

const Tooltiptheme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: '#fff',
          bottom: -10,
          right: 0,
          border: `2px solid #b91400`,
        },
        popper: {
          zIndex: 700 + '!important',
        }
      },
    },
  },
});

const FamilyBackground = () => {
  // use params
  const pdsParam = useParams()
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // redux
  // loader
  const [loader, setLoader] = useState(false)
  // component local states
  const [familyState, setFamilyState] = useState({
    children: [],
    father_extn: '',
    father_fname: '',
    father_mname: '',
    father_surname: '',
    mother_surname: '',
    mother_fname: '',
    mother_lname: '',
    mother_maiden: '',
    mother_mname: '',
    mother_extn: '',
    spouse_extn: '',
    spouse_fname: '',
    spouse_mname: '',
    spouse_surname: '',
    occupation: '',
    employeer_name: '',
    emp_address: '',
    tel_no: '',
  })
  const [toUpdate, setToUpdate] = useState('')
  const [children, setChildren] = useState([]) // localstate to store changes in the children table: add, delete, update
  const [defaultState, setDefaultState] = useState([])
  const [childrenDefault, setChildrenDefault] = useState([])
  const [childrenwithUpdates, setChildrenwithUpdates] = useState([]) // if axios request for updates of the fields in the hris_info_update has children to update data, it will store here, use for accepting the updates
  const [withUpdates, setWithUpdates] = useState('')
  const [toConfirm, setToConfirm] = useState('')

  // modal states
  const modalUpdateRef = useRef(true) // stops the modal to open in first render
  const [modalUpdateState, setModalUpdateState] = useState('') // state to store the 'to update record' to trigger the modal opening using useEffect: use in children table
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false) // triggers the modal to open using useEffect : used in children table
  // modal state opening confirm modal
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleOpenConfirmModal = (old, latest) => {
    setToConfirm(latest)
    setOpenConfirmModal(true)
  }
  const handleCloseConfirmModal = () => setOpenConfirmModal(false);
  // modal states adding children
  const [openChildrenModal, setOpenChildrenModal] = useState(false);
  const handleOpenChildrenModal = () => setOpenChildrenModal(true)
  const handleCloseChildrenModal = () => setOpenChildrenModal(false);
  // modal states updating children
  const [openUpdateChild, setOpenUpdateChild] = useState(false);
  const hOpenUpdateChild = (item) => {
    setModalUpdateState(item)
    setModalUpdateOpen(true)
  };
  const hCloseUpdateChild = () => {
    setModalUpdateOpen(false)
    setOpenUpdateChild(false)
  };
  //  modal state table updates
  const [openTableModal, setOpenTableModal] = useState(false);
  const hOpenTableModal = () => setOpenTableModal(true)
  const hCloseTableModal = () => setOpenTableModal(false);

  // onChange local state at the same time will populate the toUpdate object to determine which inputs has/have changes
  const onChangeLocal = (e, status) => {
    setFamilyState({ ...familyState, [e.target.name]: e.target.value })
    setToUpdate({
      ...toUpdate, [e.target.name]: e.target.value,
      //  {
      // old_value: e.target.defaultValue,
      // status: status
      // }
    })
  }

  // reload data
  const handleReloadTable = () => {
    Swal.fire({
      text: 'reloading data . . .',
      icon: 'info',
      allowOutsideClick: false,
    })
    Swal.showLoading()
    let controller = new AbortController()
    getEmployeeWithUpdates(pdsParam.id, setFamilyState, setWithUpdates, setChildrenwithUpdates, setChildrenDefault, setDefaultState, setLoader, controller)
  }
  // 

  useEffect(() => {
    if (modalUpdateRef.current) { // if update button clicked, useEffect triggers the event to open the modal, but doesnt open during the first load
      modalUpdateRef.current = false
    }
    else {
      if (modalUpdateOpen) {
        setOpenUpdateChild(true) // sets the modal to open
      }
    }
  }, [modalUpdateOpen])

  useEffect(() => {
    let controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      getEmployeeWithUpdates(pdsParam.id, setFamilyState, setWithUpdates, setChildrenwithUpdates, setChildrenDefault, setDefaultState, setLoader, controller)
    }
    else {
      getEmployeeWithUpdates('', setFamilyState, setWithUpdates, setChildrenwithUpdates, setChildrenDefault, setDefaultState, setLoader, controller)
    }

    return () => controller.abort()
  }, [pdsParam.id])

  return (
    <Grid container sx={{ px: matches ? 0 : 20 }}>
      {/* modal for confirming */}
      <Modal
        sx={{ zIndex: 999 }}
        aria-labelledby="transition-modal-confirm-update"
        aria-describedby="transition-modal-confirm-update"
        open={openConfirmModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openConfirmModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '80%' : '40%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            px: 4,
            pb: 4,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: matches ? 'column' : 'row', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                <Typography sx={{ textAlign: 'left', color: '#A1A2A3' }}>OLD ENTRY</Typography>
                <Typography sx={{ bgcolor: red[500], color: '#fff', p: 1, textAlign: 'center' }}>{toConfirm && toConfirm.old_value}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                <Typography sx={{ textAlign: 'left', color: '#A1A2A3' }}>NEW ENTRY</Typography>
                <Typography sx={{ flex: 1, bgcolor: blue[500], color: '#fff', p: 1, textAlign: 'center' }}>{toConfirm && toConfirm.new_value}</Typography>
              </Box>
            </Box>
            <hr />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => confirmUpdate(toConfirm, familyState, setFamilyState, withUpdates, setWithUpdates, handleCloseConfirmModal)}>Confirm</Button>
              <Button variant="contained" color="error" size="small" startIcon={<RemoveIcon />} onClick={handleCloseConfirmModal}>Close</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* modal for adding child */}
      <Modal
        aria-labelledby="transition-modal-add-child"
        aria-describedby="transition-modal-add-child"
        open={openChildrenModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openChildrenModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '80%' : '40%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 4,
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>ADD CHILD INFORMATION</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={handleCloseChildrenModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <AddChild familyState={familyState} setFamilyState={setFamilyState} handleClose={handleCloseChildrenModal} children={children} setChildren={setChildren} />
          </Box>
        </Fade>
      </Modal>
      {/* update child */}
      <Modal
        aria-labelledby="transition-modal-update-child"
        aria-describedby="transition-modal-update-child"
        open={openUpdateChild}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openUpdateChild}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: matches ? '80%' : '40%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 4,
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>UPDATE CHILD INFORMATION</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={hCloseUpdateChild} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <UpdateChild data={modalUpdateState} familyState={familyState} setFamilyState={setFamilyState} toUpdate={toUpdate} setToUpdate={setToUpdate} handleClose={hCloseUpdateChild} children={children} setChildren={setChildren} />
          </Box>
        </Fade>
      </Modal>
      {/* modal for update table */}
      <Modal
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
            width: matches ? '80%' : '90%',
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            boxShadow: 24,
            px: 2,
            pt: 1,
            pb: 4,
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>{localStorage.getItem('hris_roles') !== '1' && !pdsParam.id ? 'PENDING UPDATES' : 'CHECK TABLE UPDATES'}</Typography></Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="close modal">
                <HighlightOffIcon fontSize='large' onClick={hCloseTableModal} sx={{ cursor: 'pointer', color: red[200] }} />
              </Tooltip>
            </Box>
            <TableUpdates2 familyState={familyState} setFamilyState={setFamilyState} children={familyState.children || []} childrenwithUpdates={childrenwithUpdates || ''} setChildrenwithUpdates={setChildrenwithUpdates || ''} pdsParam={pdsParam || ''} />
          </Box>
        </Fade>
      </Modal>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 3, flexDirection: 'column', bgcolor: '#fff', p: 0, borderRadius: '.5rem' }} >
        {!loader ? (
          <SkeletonLoader />
        ) : (
          <Fade in>
            <Box>
              {!matches && <Typography variant="body2" color="#fff" sx={{ bgcolor: 'primary.main', p: .5, px: 1, borderRadius: .5, mb: 1 }}>FAMILY BACKGROUND</Typography>}
              <ThemeProvider theme={Tooltiptheme}>
                <Card sx={{ boxShadow: 'none' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', mt: .5 }}>
                      <Tooltip title={withUpdates.spouse_surname ? withUpdates.spouse_surname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="SPOUSE'S SURNAME" inputProps={{ sx: { textTransform: 'uppercase' }, readOnly: pdsParam.id && localStorage.getItem('hris_roles') === '1' ? true : false }} sx={{ bgcolor: withUpdates.spouse_surname && withUpdates.spouse_surname.status !== 1 ? '#ffcf4a' : null }} onClick={(e) => withUpdates.spouse_surname && withUpdates.spouse_surname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.spouse_surname) : null} size="small" fullWidth value={familyState.spouse_surname} name="spouse_surname" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.spouse_fname ? withUpdates.spouse_fname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="SPOUSE'S FIRST NAME" inputProps={{ sx: { textTransform: 'uppercase' }, readOnly: pdsParam.id && localStorage.getItem('hris_roles') === '1' ? true : false }} sx={{ bgcolor: withUpdates.spouse_fname && withUpdates.spouse_fname.status !== 1 ? '#ffcf4a' : null }} onClick={(e) => withUpdates.spouse_fname && withUpdates.spouse_fname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.spouse_fname) : null} size="small" fullWidth value={familyState.spouse_fname} name="spouse_fname" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.spouse_mname ? withUpdates.spouse_mname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="SPOUSE'S MIDDLENAME" inputProps={{ sx: { textTransform: 'uppercase' } }} onClick={(e) => withUpdates.spouse_mname && withUpdates.spouse_mname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.spouse_mname) : null} sx={{ bgcolor: withUpdates.spouse_mname && withUpdates.spouse_mname.status !== 1 ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.spouse_mname} name="spouse_mname" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.spouse_extn ? withUpdates.spouse_extn.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="SPOUSE'S NAME EXTENSION" inputProps={{ sx: { textTransform: 'uppercase' } }} onClick={(e) => withUpdates.spouse_mname && withUpdates.spouse_extn.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.spouse_extn) : null} sx={{ bgcolor: withUpdates.spouse_extn && withUpdates.spouse_extn.status !== 1 ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.spouse_extn} name="spouse_extn" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ mt: 1, boxShadow: 'none' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', mt: .5 }}>
                      <Tooltip title={withUpdates.occupation ? withUpdates.occupation.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="OCCUPATION" inputProps={{ sx: { textTransform: 'uppercase' }, readOnly: pdsParam.id && localStorage.getItem('hris_roles') === '1' ? true : false }} sx={{ bgcolor: withUpdates.occupation && withUpdates.occupation.status !== 1 ? '#ffcf4a' : null }} onClick={(e) => withUpdates.occupation && withUpdates.occupation.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.occupation) : null} size="small" fullWidth value={familyState.occupation} name="occupation" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.employeer_name ? withUpdates.employeer_name.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="EMPLOYER/BUSINESS NAME" inputProps={{ sx: { textTransform: 'uppercase' }, readOnly: pdsParam.id && localStorage.getItem('hris_roles') === '1' ? true : false }} sx={{ bgcolor: withUpdates.employeer_name && withUpdates.employeer_name.status !== 1 ? '#ffcf4a' : null }} onClick={(e) => withUpdates.employeer_name && withUpdates.employeer_name.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.employeer_name) : null} size="small" fullWidth value={familyState.employeer_name} name="employeer_name" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.emp_address ? withUpdates.emp_address.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="BUSINESS ADDRESS" inputProps={{ sx: { textTransform: 'uppercase' } }} onClick={(e) => withUpdates.emp_address && withUpdates.emp_address.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.emp_address) : null} sx={{ bgcolor: withUpdates.emp_address && withUpdates.emp_address.status !== 1 ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.emp_address} name="emp_address" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.tel_no ? withUpdates.tel_no.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' label="TELEPHONE NO." inputProps={{ sx: { textTransform: 'uppercase' } }} onClick={(e) => withUpdates.tel_no && withUpdates.tel_no.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.tel_no) : null} sx={{ bgcolor: withUpdates.tel_no && withUpdates.tel_no.status !== 1 ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.tel_no} name="tel_no" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ boxShadow: 'none' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                      <Tooltip title={withUpdates.father_surname ? withUpdates.father_surname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="FATHER'S SURNAME" sx={{ bgcolor: withUpdates.father_surname && withUpdates.father_surname.status !== 1 ? '#ffcf4a' : null }} onClick={(e) => withUpdates.father_surname && withUpdates.father_surname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.father_surname) : null} size="small" fullWidth value={familyState.father_surname} name="father_surname" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.father_fname ? withUpdates.father_fname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="FATHER'S FIRSTNAME" sx={{ bgcolor: withUpdates.father_fname ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.father_fname} name="father_fname" onClick={(e) => withUpdates.father_fname && withUpdates.father_fname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.father_fname) : null} focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.father_mname ? withUpdates.father_mname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="FATHER'S MIDDLENAME" sx={{ bgcolor: withUpdates.father_mname ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.father_mname} onClick={(e) => withUpdates.father_mname && withUpdates.father_mname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.father_mname) : null} name="father_mname" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.father_extn ? withUpdates.father_extn.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="FATHER'S EXTENSION" sx={{ bgcolor: withUpdates.father_extn ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.father_extn} onClick={(e) => withUpdates.father_extn && withUpdates.father_extn.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.father_extn) : null} name="father_extn" focused onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ mb: 1, boxShadow: 'none' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                      <Tooltip title={withUpdates.mother_maiden ? withUpdates.mother_maiden.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="MOTHER'S MAIDEN" sx={{ bgcolor: withUpdates.mother_maiden ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.mother_maiden} focused name="mother_maiden" onClick={(e) => withUpdates.mother_maiden && withUpdates.mother_maiden.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.mother_maiden) : null} onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.mother_lname ? withUpdates.mother_lname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="MOTHER'S SURNAME" sx={{ bgcolor: withUpdates.mother_lname ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.mother_lname} focused name="mother_lname" onClick={(e) => withUpdates.mother_lname && withUpdates.mother_lname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.mother_lname) : null} onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.mother_fname ? withUpdates.mother_fname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="MOTHER'S FIRSTNAME" sx={{ bgcolor: withUpdates.mother_fname ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.mother_fname} focused name="mother_fname" onClick={(e) => withUpdates.mother_fname && withUpdates.mother_fname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.mother_fname) : null} onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                      <Tooltip title={withUpdates.mother_mname ? withUpdates.mother_mname.new_value : ''} arrow open placement='top-end'>
                        <TextField variant='outlined' inputProps={{ sx: { textTransform: 'uppercase' } }} label="MOTHER'S MIDDLENAME" sx={{ bgcolor: withUpdates.mother_mname ? '#ffcf4a' : null }} size="small" fullWidth value={familyState.mother_mname} focused name="mother_mname" onClick={(e) => withUpdates.mother_mname && withUpdates.mother_mname.status !== 1 && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenConfirmModal(e.target.value, withUpdates.mother_mname) : null} onChange={(e) => onChangeLocal(e, '0', '0')} />
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
                <Box>
                  {pdsParam.id && localStorage.getItem('hris_roles') === '1' && childrenwithUpdates.length > 0 ? (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }} className="side-add-button">
                      <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />}>
                        {matches ? 'UPDATES' : (<b>check available table updates</b>)}
                      </Button>
                    </Box>
                  ) : null}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!pdsParam.id && childrenwithUpdates.length > 0 ? (
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }} className="side-add-button">
                        <Button variant="contained" className='pending-updates-btn' color="warning" onClick={hOpenTableModal} startIcon={<ErrorIcon fontSize='large' className="pulsive-button" />} >
                          {matches ? 'PENDING' : (<b>PENDING UPDATES</b>)}
                        </Button>
                      </Box>
                    ) : null}
                    {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? null : (
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }} className="side-add-button">
                        <Tooltip title="add new child" placement='top'>
                          <Button variant="contained" className='add-record-btn' onClick={handleOpenChildrenModal}><AddIcon />ADD</Button>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', mt: 1 }}>
                    <TableContainer component={Paper} sx={{ mb: 1, maxHeight: '33rem' }}>
                      <Table aria-label="children table" size="small" stickyHeader>
                        <TableHead sx={{ bgcolor: blue[800] }}>
                          <TableRow>
                            {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                              <TableCell className='cgb-color-table' width={'10%'} align="center"></TableCell>
                            )}
                            <TableCell className='cgb-color-table' width={'50%'} align="center">
                              <Typography className='table-font-size'>CHILD NAME</Typography>
                            </TableCell>
                            <TableCell className='cgb-color-table' width={'40%'} align="center"><Typography className='table-font-size'>DATE OF BIRTH</Typography></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {familyState.children && familyState.children.map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: item.isNew ? blue[100] : item.isDelete ? red[300] : item.isUpdated ? yellow[500] : null }}

                            >
                              {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                                <TableCell align="center" sx={{ bgcolor: '#fff' }}>
                                  {item.isNew || item.isDelete || item.isUpdated ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                      <CustomRemove color={item.isNew ? blue[700] : item.isDelete ? red[700] : item.isUpdated ? yellow[700] : null} onClick={() => handleUndo(item, children, setChildren, familyState, setFamilyState, childrenDefault)} />
                                    </Box>
                                  ) : (
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                      <Tooltip title="edit row">
                                        <CustomEditIcon onClick={() => hOpenUpdateChild(item)} sx={{ color: item.isUpdated ? '#fff' : '#5c5c5c', cursor: 'pointer' }} />
                                      </Tooltip>
                                      <Tooltip title="delete row">
                                        <CustomDeleteIcon onClick={() => deleteChildLocal(item, index, familyState, setFamilyState, children, setChildren)} />
                                      </Tooltip>
                                    </Box>
                                  )}
                                </TableCell>
                              )}
                              <TableCell component="th" scope="row" align="center" sx={{ color: '#5c5c5c' }}>
                                <b>{item.child_name}</b>
                              </TableCell>
                              <TableCell align="center" sx={{ color: '#5c5c5c' }}><b>{moment(item.dob).format('MMM DD, YYYY')}</b></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </ThemeProvider>
              {pdsParam.id && localStorage.getItem('hris_roles') === '1' ? null : (
                <Box className="side-add-button">
                  <Button variant="contained" sx={{ mt: 1, borderRadius: '2rem' }} color="success" onClick={() => handleSubmit(pdsParam.id ? pdsParam.id : localStorage.getItem('hris_employee_id'), toUpdate, setToUpdate, children, setChildren, familyState, setFamilyState, childrenDefault, defaultState, handleReloadTable)} >Submit update</Button>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default FamilyBackground
