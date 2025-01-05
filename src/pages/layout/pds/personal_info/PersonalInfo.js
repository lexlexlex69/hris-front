import React, { useEffect, useState, useRef } from 'react'
import { useParams } from "react-router-dom";
import { blue, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress'
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { toast } from 'react-toastify'

// mui icons
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import HelpIcon from '@mui/icons-material/Help';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// redux
import { useDispatch } from 'react-redux'
import { pdsCommon } from '../../../../redux/slice/pdsCommon';

// external imports function
import { handleUpdate, employeePersonalwithUpdate, confirmUpdate, getEmploymentStatus, fetchMetaTags, fetchEmpMetaTags, submitUpdateMetaTags } from './Controller'
// external imports global functions
import { checkChangedInputs, filterFalsyValues } from '../customFunctions/CustomFunctions'
// external imports
import AddressModalReworked from './AddressModalReworked';
import SkeletonLoader from '../customComponents/SkeletonLoader';
import EmploymentStatus from './EmploymentStatus'
import { Autocomplete, IconButton } from '@mui/material';
import SmallModal from '../../custommodal/SmallModal';
import Swal from 'sweetalert2';
import { APILoading } from '../../apiresponse/APIResponse';

// address


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
const defaultTooltip = createTheme({
  components:{
    MuiTooltip:{
      styleOverrides:{
        tooltip:{
          border:'none'
        }
      }
    }
  }
})

function PersonalInfo() {
  // use params
  let pdsParam = useParams()
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  // redux
  const dispatch = useDispatch()

  // component states
  const [personal, setPersonal] = useState('')
  const [toCompare, setToCompare] = useState('')
  // components state and refs
  const lname = useRef('')
  const fname = useRef('')
  const mname = useRef('')
  const extname = useRef('')
  const dob = useRef('')
  const baddress = useRef('')
  const sex = useRef('')
  const civilstatus = useRef('')
  const citizenship = useRef('')
  const dual_citizenship = useRef('')
  const height = useRef('')
  const weight = useRef('')
  const bloodtype = useRef('')
  const gsisno = useRef('')
  const pag_ibig = useRef('')
  const philhealth = useRef('')
  const sssno = useRef('')
  const tin = useRef('')
  const telno = useRef('')
  const cpno = useRef('')
  const emailadd = useRef('')
  const radVillage = useRef('')
  const radStreet = useRef('')
  const radUnit = useRef('')
  const radZip = useRef('')
  const padVillage = useRef('')
  const padStreet = useRef('')
  const padUnit = useRef('')
  const padZip = useRef('')
  const [radRegion, setRadRegion] = useState(null)
  const [radProvince, setRadProvince] = useState(null)
  const [radCity, setRadCity] = useState(null)
  const [radBrgy, setRadBrgy] = useState(null)
  const [padRegion, setPadRegion] = useState(null)
  const [padProvince, setPadProvince] = useState(null)
  const [padCity, setPadCity] = useState(null)
  const [padBrgy, setPadBrgy] = useState(null)

  // employment status
  const [employmentStatus, setEmploymentStatus] = useState('')
  const [openEmploymentModal, setOpenEmploymentModal] = useState(false);
  const handleOpenEmploymentModal = () => setOpenEmploymentModal(true);
  const handleCloseEmploymentModal = () => setOpenEmploymentModal(false);
  // modal states
  const [openModal, setOpenModal] = useState(false);
  const [toUpdateState, setToUpdateState] = useState({
    old: '',
    new: {
      employee_id: '',
      id: '',
      new_value: '',
      old_value: '',
      row_index: 0,
      status: 0,
      table_field: '',
      table_name: ''
    }
  })

  const [openAddressModal, setOpenAddressModal] = useState(false);
  const handleOpenAddressModal = () => setOpenAddressModal(true);
  const handleCloseAddressModal = () => setOpenAddressModal(false);

  // functions
  const handleSubmitUpdate = () => {
    let filterFalsyValuesObj = {
      lname: checkChangedInputs(personal.lname, lname.current.value),
      fname: checkChangedInputs(personal.fname, fname.current.value),
      mname: checkChangedInputs(personal.mname, mname.current.value),
      extname: checkChangedInputs(personal.extname, extname.current.value),
      dob: checkChangedInputs(personal.dob, dob.current.value),
      baddress: checkChangedInputs(personal.baddress, baddress.current.value),
      sex: checkChangedInputs(personal.sex, sex.current.value),
      civilstatus: checkChangedInputs(personal.civilstatus, civilstatus.current.value),
      citizenship: checkChangedInputs(personal.citizenship, citizenship.current.value),
      dual_citizenship: checkChangedInputs(personal.dual_citizenship, dual_citizenship.current.value),
      height: checkChangedInputs(personal.height, height.current.value),
      weight: checkChangedInputs(personal.weight, weight.current.value),
      bloodtype: checkChangedInputs(personal.bloodtype, bloodtype.current.value),
      gsisno: checkChangedInputs(personal.gsisno, gsisno.current.value),
      pag_ibig: checkChangedInputs(personal.pag_ibig, pag_ibig.current.value),
      philhealth: checkChangedInputs(personal.philhealth, philhealth.current.value),
      sssno: checkChangedInputs(personal.sssno, sssno.current.value),
      tin: checkChangedInputs(personal.tin, tin.current.value),
      telno: checkChangedInputs(personal.telno, telno.current.value),
      cpno: checkChangedInputs(personal.cpno, cpno.current.value),
      emailadd: checkChangedInputs(personal.emailadd, emailadd.current.value, true),
      radRegion: checkChangedInputs(personal.radRegion, radRegion),
      radProvince: checkChangedInputs(personal.radProvince, radProvince),
      radCity: checkChangedInputs(personal.radCity, radCity),
      radBrgy: checkChangedInputs(personal.radBrgy, radBrgy),
      radVillage: checkChangedInputs(personal.radVillage, radVillage.current.value),
      radStreet: checkChangedInputs(personal.radStreet, radStreet.current.value),
      radUnit: checkChangedInputs(personal.radUnit, radUnit.current.value),
      radZip: checkChangedInputs(personal.radZip, radZip.current.value),
      padRegion: checkChangedInputs(personal.padRegion, padRegion),
      padProvince: checkChangedInputs(personal.padProvince, padProvince),
      padCity: checkChangedInputs(personal.padCity, padCity),
      padBrgy: checkChangedInputs(personal.padBrgy, padBrgy),
      padVillage: checkChangedInputs(personal.padVillage, padVillage.current.value),
      padStreet: checkChangedInputs(personal.padStreet, padStreet.current.value),
      padUnit: checkChangedInputs(personal.padUnit, padUnit.current.value),
      padZip: checkChangedInputs(personal.padZip, padZip.current.value),
    }
    // console.log('falsy',filterFalsyValuesObj)
    let filteredInputs = filterFalsyValues(filterFalsyValuesObj)
    // console.log('filtered',filteredInputs)
    if (Object.keys(filteredInputs).length === 0) {
      toast.warning('Nothing to update')
      return
    }
    handleUpdate('', filteredInputs, personal, {
      lname: lname,
      fname: fname,
      mname: mname,
      extname: extname,
      dob: dob,
      baddress: baddress,
      sex: sex,
      civilstatus: civilstatus,
      citizenship: citizenship,
      dual_citizenship: dual_citizenship,
      height: height,
      weight: weight,
      bloodtype: bloodtype,
      gsisno: gsisno,
      pag_ibig: pag_ibig,
      philhealth: philhealth,
      sssno: sssno,
      tin: tin,
      telno: telno,
      cpno: cpno,
      emailadd: emailadd,
      radRegion: radRegion,
      radProvince: radProvince,
      radCity: radCity,
      radBrgy: radBrgy,
      radVillage: radVillage,
      radStreet: radStreet,
      radUnit: radUnit,
      radZip: radZip,
      padProvince: padProvince,
      padCity: padCity,
      padBrgy: padBrgy,
      padVillage: padVillage,
      padStreet: padStreet,
      padUnit: padUnit,
      padZip: padZip
    }, handleReload)
    // handleUpdate 3rd param is used to make the inputs value back to the default value after the update submittion
  }

  const handleOpenModal = (latest, id, reff) => {
    setToUpdateState({
      data: latest,
      reff: reff
    })
    setOpenModal(true)
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleReload = () => {
    let controller = new AbortController()
    employeePersonalwithUpdate(pdsParam.id, setPersonal, setToCompare, controller)
  }

  useEffect(() => {
    let controller = new AbortController()
    if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
      employeePersonalwithUpdate(pdsParam.id, setPersonal, setToCompare, controller)
      getEmploymentStatus(pdsParam.id, setEmploymentStatus)
    }
    else {
      employeePersonalwithUpdate('', setPersonal, setToCompare, controller)
    }

  }, [dispatch, pdsParam])

  /**
  Fetch meta tags
   */
  const [metaTagsData,setMetaTagsData] = useState([])
  const [metaTags,setMetaTags] = useState('')
  useEffect(()=>{
    fetchMetaTags(setMetaTagsData,setMetaTags,setDefaultMetaTags,pdsParam.id)

    // async function fetchData(){
    //   // const res = await 
    //   // setMetaTagsData(res.data)

      
    //   // const res2 = await fetchEmpMetaTags();
    //   // setMetaTags(res2.data.data.meta_tags)
    //   // let temp = res2.data.data.meta_tags.split(',');
    //   // let arr = res.data.filter(el=>temp.includes(el.meta_name))
    //   // setDefaultMetaTags(arr)
    // }
    // fetchData()
    // console.log(meta_tags.data)
  },[])
  const [openUpdateMetaTags,setOpenUpdateMetaTags] = useState(false)
  const [selectedMetaTags,setSelectedMetaTags] = useState([]);
  const [defaultMetaTags,setDefaultMetaTags] = useState([]);
  const handleOpenUpdateMetaTags = () => {
    setOpenUpdateMetaTags(true)
    setSelectedMetaTags(defaultMetaTags)
  }
  const handleCloseUpdateMetaTags = () => {
    setOpenUpdateMetaTags(false)
  }
  const handleSubmitMetaTags = () => {
    submitUpdateMetaTags(selectedMetaTags,setMetaTags,handleCloseUpdateMetaTags,metaTagsData,setDefaultMetaTags)
  }
  return (
    <Grid container sx={{ px: matches ? 0 : 20 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} >
        {/* modal for confirming */}
        <Modal
          sx={{ zIndex: 1000 }}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: matches ? '90%' : '40%',
              bgcolor: 'background.paper',
              borderRadius: '1rem',
              boxShadow: 24,
              px: 0,
              pb: 4,
              pt: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {pdsCommon.load ? (<LinearProgress />) : null}
              <Box sx={{ pt: 1, px: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Typography sx={{ textAlign: 'left', color: '#A1A2A3' }}>OLD ENTRY</Typography>
                    <Typography sx={{ bgcolor: red[500], color: '#fff', p: 1, textAlign: 'center' }}>{toUpdateState.data ? toUpdateState.data.old_value === '' ? (<>&nbsp;</>) : toUpdateState.data.old_value : '-'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Typography sx={{ textAlign: 'left', color: '#A1A2A3' }}>NEW ENTRY</Typography>
                    <Typography sx={{ flex: 1, bgcolor: blue[500], color: '#fff', p: 1, textAlign: 'center' }}>{toUpdateState.data ? toUpdateState.data.new_value === '' ? (<>&nbsp;</>) : toUpdateState.data.new_value : '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="contained" color="primary" size="small" sx={{ color: '#fff' }} startIcon={<CheckCircleOutlineIcon />} onClick={() => confirmUpdate(toUpdateState, toCompare, setToCompare, handleCloseModal, personal, setPersonal)}>Confirm</Button>
                  <Button startIcon={<RemoveIcon />} variant="contained" color="error" size="small" onClick={handleCloseModal}>close</Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
        {/* employment status modal */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openEmploymentModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openEmploymentModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: matches ? '90%' : '70%',
              bgcolor: 'background.paper',
              // borderBottomLeftRadius: '1rem',
              // borderBottomRightRadius: '1rem',
              borderRadius: '1rem',
              boxShadow: 24,
              px: 2,
              pb: 2,
              pt: 2,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: '#fff', border: 0, mt: -3, p: 2, pt: .5, borderRadius: '.5rem', borderBottomLeftRadius: 0, display: 'flex', alignItems: 'flex-start' }}><Typography variant='p' sx={{ color: '#5a5a5a' }}>EMPLOYMENT INFORMATION</Typography></Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'none', border: 0, mt: '-3rem', p: 1, borderRadius: '.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <Tooltip title="close modal">
                  <HighlightOffIcon fontSize='large' onClick={handleCloseEmploymentModal} sx={{ cursor: 'pointer', color: red[200] }} />
                </Tooltip>
              </Box>
              <EmploymentStatus data={employmentStatus || ''} />
            </Box>
          </Fade>
        </Modal>
        {!personal ? (
          <SkeletonLoader />
        ) : (
          <Fade in>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ThemeProvider theme={Tooltiptheme}>
                {!matches && <Typography variant="body2" color="#fff" sx={{ bgcolor: 'primary.main', p: .5, px: 1, borderRadius: .5, mb: 1 }}>PERSONAL INFORMATION</Typography>}
                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? (
                  <Button variant="contained" startIcon={<CloudSyncIcon fontSize='large' />} color="warning" onClick={handleOpenEmploymentModal}>Update Employment Details to Lyxis</Button>
                ) : null}
                <Box sx={{ display: 'flex', gap: matches ? 5 : 2, flexDirection: matches ? 'column' : 'row', justifyContent: matches ? 'none' : 'center' }}>
                  <Tooltip title={toCompare.lname ? toCompare.lname.new_value : ''} open placement='top-end' arrow>
                    <TextField variant="outlined" label="SURNAME" size="small" defaultValue={personal.lname} inputProps={{ sx: { textTransform: 'uppercase' } }} fullWidth focused inputRef={lname} sx={{ bgcolor: toCompare.lname ? '#ffcf4a' : null }} onClick={() => toCompare.lname && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.lname, personal.id, lname) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.fname ? toCompare.fname.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="FIRST NAME" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} defaultValue={personal.fname} fullWidth focused inputRef={fname} sx={{ bgcolor: toCompare.fname ? '#ffcf4a' : null }} onClick={() => toCompare.fname && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.fname, personal.id, fname) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.mname ? toCompare.mname.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="MIDDLE NAME" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} defaultValue={personal.mname} fullWidth focused inputRef={mname} sx={{ bgcolor: toCompare.mname ? '#ffcf4a' : null }} onClick={() => toCompare.mname && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.mname, personal.id, mname) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.extname ? toCompare.extname.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="EXTENSION" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} defaultValue={personal.extname} fullWidth focused inputRef={extname} sx={{ bgcolor: toCompare.extname ? '#ffcf4a' : null }} onClick={() => toCompare.extname && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.extname, personal.id, extname) : null} />
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: matches ? 5 : 2, flexDirection: matches ? 'column' : 'row', justifyContent: matches ? 'center' : 'center' }}>
                  <Tooltip title={toCompare.dob ? toCompare.dob.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="DATE OF BIRTH" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} fullWidth type='date' defaultValue={personal.dob} focused inputRef={dob} sx={{ bgcolor: toCompare.dob ? '#ffcf4a' : null }} onClick={() => toCompare.dob && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.dob, personal.id, dob) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.baddress ? toCompare.baddress.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="PLACE OF BIRTH" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} fullWidth defaultValue={personal.baddress} focused inputRef={baddress} sx={{ bgcolor: toCompare.baddress ? '#ffcf4a' : null }} onClick={() => toCompare.baddress && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.baddress, personal.id, baddress) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.sex ? toCompare.sex.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="SEX" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} fullWidth defaultValue={personal.sex} focused inputRef={sex} sx={{ bgcolor: toCompare.sex ? '#ffcf4a' : null }} onClick={() => toCompare.sex && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.sex, personal.id, sex) : null} select >
                      <MenuItem value='MALE'>
                        MALE
                      </MenuItem>
                      <MenuItem value='FEMALE'>
                        FEMALE
                      </MenuItem>
                    </TextField>
                  </Tooltip>
                  <Tooltip title={toCompare.civilstatus ? toCompare.civilstatus.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="CIVIL STATUS" size="small" fullWidth defaultValue={personal.civilstatus} focused inputRef={civilstatus} sx={{ bgcolor: toCompare.civilstatus ? '#ffcf4a' : null }} onClick={() => toCompare.civilstatus && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.civilstatus, personal.id, civilstatus) : null} select>
                      <MenuItem value='MARRIED'>
                        MARRIED
                      </MenuItem>
                      <MenuItem value='WIDOWED'>
                        WIDOWED
                      </MenuItem>
                      <MenuItem value='SEPARATED'>
                        SEPARATED
                      </MenuItem>
                      <MenuItem value='DIVORCED'>
                        DIVORCED
                      </MenuItem>
                      <MenuItem value='SINGLE'>
                        SINGLE
                      </MenuItem>
                    </TextField>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: matches ? 5 : 2, flexDirection: matches ? 'column' : 'row', justifyContent: matches ? 'center' : 'center' }}>
                  <Tooltip title={toCompare.citizenship ? toCompare.citizenship.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="CITIZENSHIP" size="small" fullWidth defaultValue={personal.citizenship} focused inputRef={citizenship} sx={{ bgcolor: toCompare.citizenship ? '#ffcf4a' : null }} onClick={() => toCompare.citizenship && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.citizenship, personal.id, citizenship) : null} select >
                      <MenuItem value='FILIPINO'>
                        FILIPINO
                      </MenuItem>
                      <MenuItem value='NONE'>
                        NONE
                      </MenuItem>
                    </TextField>
                  </Tooltip>
                  <Tooltip title={toCompare.dual_citizenship ? toCompare.dual_citizenship.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="DUAL CITIZENSHIP" size="small" fullWidth defaultValue={personal.dual_citizenship} focused inputRef={dual_citizenship} sx={{ bgcolor: toCompare.dual_citizenship ? '#ffcf4a' : null }} onClick={() => toCompare.dual_citizenship && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.dual_citizenship, personal.id, dual_citizenship) : null} select >
                      <MenuItem value='NONE'>
                        NONE
                      </MenuItem>
                      <MenuItem value='BY BIRTH'>
                        BY BIRTH
                      </MenuItem>
                      <MenuItem value='BY NATURALIZATION'>
                        BY NATURALIZATION
                      </MenuItem>
                    </TextField>
                  </Tooltip>
                  <Tooltip title={toCompare.height ? toCompare.height.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="HEIGHT (m)" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} fullWidth defaultValue={personal.height} focused inputRef={height} sx={{ bgcolor: toCompare.height ? '#ffcf4a' : null }} onClick={() => toCompare.height && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.height, personal.id, height) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.weight ? toCompare.weight.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="WEIGHT (kg)" size="small" inputProps={{ sx: { textTransform: 'uppercase' } }} fullWidth defaultValue={personal.weight} focused inputRef={weight} sx={{ bgcolor: toCompare.weight ? '#ffcf4a' : null }} onClick={() => toCompare.weight && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.weight, personal.id, weight) : null} />
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: matches ? 5 : 2, flexDirection: matches ? 'column' : 'row', justifyContent: matches ? 'center' : 'center' }}>
                  <Tooltip title={toCompare.bloodtype ? toCompare.bloodtype.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="BLOOD TYPE" size="small" fullWidth defaultValue={personal.bloodtype} focused inputRef={bloodtype} sx={{ bgcolor: toCompare.bloodtype ? '#ffcf4a' : null }} onClick={() => toCompare.bloodtype && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.bloodtype, personal.id, bloodtype) : null} select>
                      <MenuItem value='A+'>
                        A+
                      </MenuItem>
                      <MenuItem value='A-'>
                        A-
                      </MenuItem>
                      <MenuItem value='B+'>
                        B+
                      </MenuItem>
                      <MenuItem value='B-'>
                        B-
                      </MenuItem>
                      <MenuItem value='O+'>
                        O+
                      </MenuItem>
                      <MenuItem value='O-'>
                        O-
                      </MenuItem>
                      <MenuItem value='AB+'>
                        AB+
                      </MenuItem>
                      <MenuItem value='AB-'>
                        AB-
                      </MenuItem>
                    </TextField>
                  </Tooltip>
                  <Tooltip title={toCompare.gsisno ? toCompare.gsisno.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" inputProps={{ sx: { textTransform: 'uppercase' } }} label="GSIS ID NO." fullWidth size="small" defaultValue={personal.gsisno} focused inputRef={gsisno} sx={{ bgcolor: toCompare.gsisno ? '#ffcf4a' : null }} onClick={() => toCompare.gsisno && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.gsisno, personal.id, gsisno) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.pag_ibig ? toCompare.pag_ibig.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" inputProps={{ sx: { textTransform: 'uppercase' } }} label="PAG-IBIG ID NO." fullWidth size="small" defaultValue={personal.pag_ibig} focused inputRef={pag_ibig} sx={{ bgcolor: toCompare.pag_ibig ? '#ffcf4a' : null }} onClick={() => toCompare.pag_ibig && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.pag_ibig, personal.id, pag_ibig) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.philhealth ? toCompare.philhealth.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" inputProps={{ sx: { textTransform: 'uppercase' } }} label="PHILHEALTH NO." fullWidth size="small" defaultValue={personal.philhealth} focused inputRef={philhealth} sx={{ bgcolor: toCompare.philhealth ? '#ffcf4a' : null }} onClick={() => toCompare.philhealth && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.philhealth, personal.id, philhealth) : null} />
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: matches ? 5 : 2, flexDirection: matches ? 'column' : 'row', justifyContent: matches ? 'none' : 'center' }}>
                  <Tooltip title={toCompare.sssno ? toCompare.sssno.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" inputProps={{ sx: { textTransform: 'uppercase' } }} label="SSS NO." fullWidth size="small" defaultValue={personal.sssno} focused inputRef={sssno} sx={{ bgcolor: toCompare.sssno ? '#ffcf4a' : null }} onClick={() => toCompare.sssno && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.sssno, personal.id, sssno) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.tin ? toCompare.tin.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" inputProps={{ sx: { textTransform: 'uppercase' } }} label="TIN" fullWidth size="small" defaultValue={personal.tin} focused inputRef={tin} sx={{ bgcolor: toCompare.tin ? '#ffcf4a' : null }} onClick={() => toCompare.tin && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.tin, personal.id, tin) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.telno ? toCompare.telno.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" inputProps={{ sx: { textTransform: 'uppercase' } }} label="TELEPHONE NO." fullWidth size="small" defaultValue={personal.telno} focused inputRef={telno} sx={{ bgcolor: toCompare.telno ? '#ffcf4a' : null }} onClick={() => toCompare.telno && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.telno, personal.id, telno) : null} />
                  </Tooltip>
                  <Tooltip title={toCompare.cpno ? toCompare.cpno.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" inputProps={{ sx: { textTransform: 'uppercase' } }} label="MOBILE NO." fullWidth size="small" type='number' defaultValue={personal.cpno} focused inputRef={cpno} sx={{ bgcolor: toCompare.cpno ? '#ffcf4a' : null }} onClick={() => toCompare.cpno && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.cpno, personal.id, cpno) : null} />
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: matches ? 5 : 2, flexDirection: matches ? 'column' : 'row', justifyContent: matches ? 'none' : 'flex-start' }}>
                  <Tooltip title={toCompare.emailadd ? toCompare.emailadd.new_value : ''} arrow open placement='top-end'>
                    <TextField variant="outlined" label="EMAIL ADDRESS (if any)" fullWidth size="small" defaultValue={personal.emailadd} focused inputRef={emailadd} sx={{ bgcolor: toCompare.emailadd ? '#ffcf4a' : null, width: matches?'100%':'24%' }} onClick={() => toCompare.emailadd && localStorage.getItem('hris_roles') === '1' && pdsParam.id ? handleOpenModal(toCompare.emailadd, personal.id, emailadd) : null} />
                  </Tooltip>
                  {/* start Meta tags div */}
                  <ThemeProvider theme={defaultTooltip}>
                  <TextField label='Meta Tags' value = {metaTags} InputLabelProps={{shrink:true}} InputProps={{
                    readOnly:true,
                    endAdornment:
                    <InputAdornment position="end">
                      <Tooltip title='Update meta tags'><IconButton onClick={handleOpenUpdateMetaTags}><EditIcon fontSize='small' color='success'/></IconButton></Tooltip>
                      <Tooltip title={<Box><Typography sx={{fontSize:'.9rem'}}>Keywords that best described yourself. For training selection purposes. This will not reflect when printing your PDS.</Typography></Box>}><HelpIcon fontSize='small' color='info' sx={{'&:hover':{cursor:'question'}}}/></Tooltip>
                    </InputAdornment>
                  }} size='small' sx={{width:matches?'100%':'24%'}} required/>
                  </ThemeProvider>
                  {/* Update meta tags modal */}
                  <SmallModal open = {openUpdateMetaTags} close = {handleCloseUpdateMetaTags} title='Updating Meta Tags'>
                    <Box sx={{m:1}}>
                      <Box>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        value = {selectedMetaTags}
                        onChange = {(event,newVal)=>{
                          setSelectedMetaTags(newVal)
                        }}
                        options={metaTagsData}
                        getOptionLabel={(option) => option.meta_name}
                        // sx={{width:'24%'}}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Meta Tags" />}
                        multiple
                      />
                      </Box>
                      <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                        <Button variant='contained' className='custom-roundbutton' color='success' onClick={handleSubmitMetaTags} disabled={selectedMetaTags.length>0?false:true}>Submit Update</Button>
                      </Box>
                    </Box>
                  </SmallModal>
                  {/* start Meta tags div */}

                  
                </Box>
                
                <AddressModalReworked
                  msx={{ marginTop: matches ? '1rem' : '2rem' }}
                  personal={personal}
                  radRegion={radRegion}
                  setRadRegion={setRadRegion}
                  radProvince={radProvince}
                  setRadProvince={setRadProvince}
                  radCity={radCity}
                  setRadCity={setRadCity}
                  radBrgy={radBrgy}
                  setRadBrgy={setRadBrgy}
                  radVillage={radVillage}
                  radStreet={radStreet}
                  radUnit={radUnit}
                  radZip={radZip}
                  padRegion={padRegion}
                  setPadRegion={setPadRegion}
                  padProvince={padProvince}
                  setPadProvince={setPadProvince}
                  padCity={padCity}
                  setPadCity={setPadCity}
                  padBrgy={padBrgy}
                  setPadBrgy={setPadBrgy}
                  padVillage={padVillage}
                  padStreet={padStreet}
                  padUnit={padUnit}
                  padZip={padZip}
                  toCompare={toCompare}
                  handleOpenModal={handleOpenModal}
                  pdsParam={pdsParam.id || ''}
                />

                {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" sx={{ mt: 1, borderRadius: '2rem' }} color="success" onClick={handleSubmitUpdate}>Submit update</Button>
                  </Box>
                )}
              </ThemeProvider>
            </Box>
          </Fade>
        )}

      </Grid>
    </Grid >
  )
}

export default PersonalInfo