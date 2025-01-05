import React, { useEffect, useCallback } from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Fade, Button,InputAdornment,Divider,Modal,FormControl,FormGroup,FormControlLabel,Select,MenuItem,InputLabel,Checkbox  } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// redux
import { useSelector, useDispatch } from 'react-redux'
// import {getApplicantPdsPersonal} from '../../../../redux/slice/applicantPdsSlice'
import {getApplicantPdsPersonal,updateApplicantPdsPersonal} from './ApplicantPersoanlInforRequest';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
const address = require('../../../../address.json');

function ApplicantPersonalInfo() {
  const [loading,setLoading] = React.useState(true);
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: matches? 300:400,
      bgcolor: 'background.paper',
      border: '2px solid #fff',
      borderRadius:3,
      boxShadow: 24,
      p: 4,
    };
  // redux
  const dispatch = useDispatch()
  const { param } = useSelector(state => state.routeParam)
  const [currentData,setCurrentData] = React.useState({
    lname:'',
    fname:'',
    mname:'',
    extname:'',
    dob:'',
    baddress:'',
    sex:'',
    civilstatus:'',
    citizenship:'',
    height:'',
    weight:'',
    bloodtype:'',
    gsisno:'',
    pag_ibig:'',
    philhealth:'',
    sssno:'',
    tin:'',
    agency_employee_no:'',
    radZip:'',
    radUnit:'',
    radStreet:'',
    radVillage:'',
    radBrgy:'',
    radCity:'',
    rad_district:'',
    padUnit:'',
    padStreet:'',
    padVillage:'',
    padBrgy:'',
    padCity:'',
    padProvince:'',
    padZip:'',
    radProvince:'',
    pad_district:'',

  });
  const [data,setData] = React.useState({
    lname:'',
    fname:'',
    mname:'',
    extname:'',
    dob:'',
    baddress:'',
    sex:'',
    civilstatus:'',
    citizenship:'',
    height:'',
    weight:'',
    bloodtype:'',
    gsisno:'',
    pag_ibig:'',
    philhealth:'',
    sssno:'',
    tin:'',
    agency_employee_no:'',
    radZip:'',
    radUnit:'',
    radStreet:'',
    radVillage:'',
    radBrgy:'',
    radCity:'',
    rad_district:'',
    padUnit:'',
    padStreet:'',
    padVillage:'',
    padBrgy:'',
    padCity:'',
    padProvince:'',
    padZip:'',
    radProvince:'',
    pad_district:'',

  });
  const handleSetDataChange = (event) => {
    setData({...data,[event.target.name]:event.target.value})
  }
  const [region,setRegion] = React.useState([]);
  useEffect(() => {
    // console.log(address)
    var regionName = [];
    var provName = [];
    var muni_city = [];
    var brgy = [];
    for(var reg in address){
      //  console.log(address[key].region_name)
      regionName.push({region_name:address[reg].region_name,key:reg})
    }
    regionName.sort((a, b) => {
      let fa = a.key.toLowerCase(),
          fb = b.key.toLowerCase();
  
      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
  });
    setRegion(regionName)
    // console.log(address["01"].province_list)
    
    // for(var prov in address["01"].province_list){
    //   provName.push({province_name:prov,key:prov})
    // }
    // for(var municipality in address["01"].province_list["ILOCOS NORTE"].municipality_list){
    //   muni_city.push({municipality:municipality})
    // }
    // for(var b = 0; b<address["01"].province_list["ILOCOS NORTE"].municipality_list["BACARRA"].barangay_list.length;b++){
    //   brgy.push({barangay:address["01"].province_list["ILOCOS NORTE"].municipality_list["BACARRA"].barangay_list[b]})
    // }
    // for(var barangay in address["01"].province_list["ILOCOS NORTE"].municipality_list["BACARRA"].barangay_list){
    //   // for(var br in barangay){
    //   //   brgy.push({barangay:br})
    //   // }
    //   console.log(barangay)
    // }
    getApplicantPdsPersonal()
    .then((response)=>{
      setLoading(false)
      if(response.data.length !==0){
        setCurrentData({...data,
          lname:response.data.lname !== null ? response.data.lname :'',
          fname:response.data.fname !== null ? response.data.fname :'',
          mname:response.data.mname !== null ? response.data.mname :'',
          extname:response.data.extname !== null ? response.data.extname :'',
          dob:response.data.dob !== null ? response.data.dob :'',
          baddress:response.data.baddress !== null ? response.data.baddress :'',
          sex:response.data.sex !== null ? response.data.sex :'',
          civilstatus:response.data.civilstatus !== null ? response.data.civilstatus :'',
          citizenship:response.data.citizenship !== null ? response.data.citizenship :'',
          height:response.data.height !== null ? response.data.height :'',
          weight:response.data.weight !== null ? response.data.weight :'',
          bloodtype:response.data.bloodtype !== null ? response.data.bloodtype :'',
          gsisno:response.data.gsisno !== null ? response.data.gsisno :'',
          pag_ibig:response.data.pag_ibig !== null ? response.data.pag_ibig :'',
          philhealth:response.data.civilstatus !== null ? response.data.philhealth :'',
          sssno:response.data.sssno !== null ? response.data.sssno :'',
          tin:response.data.tin !== null ? response.data.tin :'',
          radZip:response.data.radZip !== null ? response.data.radZip :'',
          radUnit:response.data.radUnit !== null ? response.data.radUnit :'',
          radStreet:response.data.radStreet !== null ? response.data.radStreet :'',
          radVillage:response.data.radVillage !== null ? response.data.radVillage :'',
          radBrgy:response.data.radBrgy !== null ? response.data.radBrgy :'',
          radCity:response.data.radCity !== null ? response.data.radCity :'',
          rad_district:response.data.rad_district !== null ? response.data.rad_district :'',
          padUnit:response.data.padUnit !== null ? response.data.padUnit :'',
          padStreet:response.data.padStreet !== null ? response.data.padStreet :'',
          padVillage:response.data.padVillage !== null ? response.data.padVillage :'',
          padBrgy:response.data.padBrgy !== null ? response.data.padBrgy :'',
          padCity:response.data.padCity !== null ? response.data.padCity :'',
          padProvince:response.data.padProvince !== null ? response.data.padProvince :'',
          padZip:response.data.padZip !== null ? response.data.padZip :'',
          radProvince:response.data.radProvince !== null ? response.data.radProvince :'',
          pad_district:response.data.pad_district !== null ? response.data.pad_district :'',
        })
        setData({...data,
          lname:response.data.lname !== null ? response.data.lname :'',
          fname:response.data.fname !== null ? response.data.fname :'',
          mname:response.data.mname !== null ? response.data.mname :'',
          extname:response.data.extname !== null ? response.data.extname :'',
          dob:response.data.dob !== null ? response.data.dob :'',
          baddress:response.data.baddress !== null ? response.data.baddress :'',
          sex:response.data.sex !== null ? response.data.sex :'',
          civilstatus:response.data.civilstatus !== null ? response.data.civilstatus :'',
          citizenship:response.data.citizenship !== null ? response.data.citizenship :'',
          height:response.data.height !== null ? response.data.height :'',
          weight:response.data.weight !== null ? response.data.weight :'',
          bloodtype:response.data.bloodtype !== null ? response.data.bloodtype :'',
          gsisno:response.data.gsisno !== null ? response.data.gsisno :'',
          pag_ibig:response.data.pag_ibig !== null ? response.data.pag_ibig :'',
          philhealth:response.data.civilstatus !== null ? response.data.philhealth :'',
          sssno:response.data.sssno !== null ? response.data.sssno :'',
          tin:response.data.tin !== null ? response.data.tin :'',
          radZip:response.data.radZip !== null ? response.data.radZip :'',
          radUnit:response.data.radUnit !== null ? response.data.radUnit :'',
          radStreet:response.data.radStreet !== null ? response.data.radStreet :'',
          radVillage:response.data.radVillage !== null ? response.data.radVillage :'',
          radBrgy:response.data.radBrgy !== null ? response.data.radBrgy :'',
          radCity:response.data.radCity !== null ? response.data.radCity :'',
          rad_district:response.data.rad_district !== null ? response.data.rad_district :'',
          padUnit:response.data.padUnit !== null ? response.data.padUnit :'',
          padStreet:response.data.padStreet !== null ? response.data.padStreet :'',
          padVillage:response.data.padVillage !== null ? response.data.padVillage :'',
          padBrgy:response.data.padBrgy !== null ? response.data.padBrgy :'',
          padCity:response.data.padCity !== null ? response.data.padCity :'',
          padProvince:response.data.padProvince !== null ? response.data.padProvince :'',
          padZip:response.data.padZip !== null ? response.data.padZip :'',
          radProvince:response.data.radProvince !== null ? response.data.radProvince :'',
          pad_district:response.data.pad_district !== null ? response.data.pad_district :'',
        })
      }
    }).catch((error)=>{
      console.log(error)
    })
  }, [])
  const submitUpdate = () => {
    // if(JSON.stringify(data) === JSON.stringify(currentData)){
    //   toast.warning('No changes were made.')
    // }else{
    // }
  if(data.fname.length ===0 || data.lname.length ===0){
    toast.warning('Surname and First Name is required.')
  }else{
    if(isSameAddress){
      setData({...data,
        padZip:data.radZip,
        padUnit:data.radUnit,
        padStreet:data.radStreet,
        padVillage:data.radVillage,
        padProvince:data.radProvince,
        padCity:data.radCity,
        padBrgy:data.radBrgy
      })
    }
    Swal.fire({
      icon:'info',
      title:'Updating info',
      html:'Please wait..'
    })
    Swal.showLoading();
    var data2 = {
      data:data,
      is_same_addres:isSameAddress
    }
    updateApplicantPdsPersonal(data2)
    .then((response)=>{
      Swal.close()
      if(response.data.status === 'success'){
        // setData({...data,
        //   lname:response.data.lname !== null ? response.data.lname :'',
        //   fname:response.data.fname !== null ? response.data.fname :'',
        //   mname:response.data.mname !== null ? response.data.mname :'',
        //   extname:response.data.extname !== null ? response.data.extname :'',
        //   dob:response.data.dob !== null ? response.data.dob :'',
        //   baddress:response.data.baddress !== null ? response.data.baddress :'',
        //   sex:response.data.sex !== null ? response.data.sex :'',
        //   civilstatus:response.data.civilstatus !== null ? response.data.civilstatus :'',
        //   citizenship:response.data.citizenship !== null ? response.data.citizenship :'',
        //   height:response.data.height !== null ? response.data.height :'',
        //   weight:response.data.weight !== null ? response.data.weight :'',
        //   bloodtype:response.data.bloodtype !== null ? response.data.bloodtype :'',
        //   gsisno:response.data.gsisno !== null ? response.data.gsisno :'',
        //   pag_ibig:response.data.pag_ibig !== null ? response.data.pag_ibig :'',
        //   philhealth:response.data.civilstatus !== null ? response.data.philhealth :'',
        //   sssno:response.data.sssno !== null ? response.data.sssno :'',
        //   tin:response.data.tin !== null ? response.data.tin :'',
        //   radZip:response.data.radZip !== null ? response.data.radZip :'',
        //   radUnit:response.data.radUnit !== null ? response.data.radUnit :'',
        //   radStreet:response.data.radStreet !== null ? response.data.radStreet :'',
        //   radVillage:response.data.radVillage !== null ? response.data.radVillage :'',
        //   radBrgy:response.data.radBrgy !== null ? response.data.radBrgy :'',
        //   radCity:response.data.radCity !== null ? response.data.radCity :'',
        //   rad_district:response.data.rad_district !== null ? response.data.rad_district :'',
        //   padUnit:response.data.padUnit !== null ? response.data.padUnit :'',
        //   padStreet:response.data.padStreet !== null ? response.data.padStreet :'',
        //   padVillage:response.data.padVillage !== null ? response.data.padVillage :'',
        //   padBrgy:response.data.padBrgy !== null ? response.data.padBrgy :'',
        //   padCity:response.data.padCity !== null ? response.data.padCity :'',
        //   padProvince:response.data.padProvince !== null ? response.data.padProvince :'',
        //   padZip:response.data.padZip !== null ? response.data.padZip :'',
        //   radProvince:response.data.radProvince !== null ? response.data.radProvince :'',
        //   pad_district:response.data.pad_district !== null ? response.data.pad_district :'',
        // })
        toast.success(response.data.message)
      }else if(response.data.status === 'neutral'){
        toast.warning(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    }).catch((error)=>{
      console.log(error)
    })
  }
}
  const [selectedregion,setSelectedRegion] = React.useState('')
  const [selectedprovince,setSelectedProvince] = React.useState('')
  const [selectedmunicity,setSelectedMunicity] = React.useState('')
  const [selectedbarangay,setSelectedBarangay] = React.useState('')

  const [province,setProvince] = React.useState([])
  const [municity,setMunicity] = React.useState([])
  const [barangay,setBarangay] = React.useState([])

  const handleRegionChange = (value) =>{
    var provName = []
    for(var prov in address[value.target.value].province_list){
      provName.push({province_name:prov})
    }
    setSelectedRegion(value.target.value)
    setSelectedProvince('')
    setProvince(provName)
    
    setMunicity([])
    setSelectedMunicity('')
    setBarangay([])
    setSelectedBarangay('')

  }
  const handleProvinceChange = (value) =>{
    // console.log(value.target.value.province_name)
    var muni_city = []
    for(var municipality in address[selectedregion].province_list[value.target.value].municipality_list){
      muni_city.push({muni_city:municipality})
    }
    setSelectedProvince(value.target.value)
    setSelectedMunicity('')
    setMunicity(muni_city)
    setBarangay([])
    setSelectedBarangay('')
  }
  const handleMunicityChange = (value) =>{
    var brgy = []
    for(var b = 0; b<address[selectedregion].province_list[selectedprovince].municipality_list[value.target.value].barangay_list.length;b++){
      brgy.push({barangay:address[selectedregion].province_list[selectedprovince].municipality_list[value.target.value].barangay_list[b]})
    }
    setSelectedMunicity(value.target.value)
    setBarangay(brgy)
    setSelectedBarangay('')
  }
  const handleBarangayChange = (value) => {
    setSelectedBarangay(value.target.value)
  }
  const [addressModalOpen,setaddressModalOpen] = React.useState(false);
  const [addressType,setAddressType] = React.useState('');
  const [isSameAddress,setIsSameAddress] = React.useState(false);
  // const handleClosePaddress = () =>{

  // }
  const handleOpenAddressModal = (type) => {
    setAddressType(type)
    setaddressModalOpen(true)
  }
  const handleSaveAddress = () => {
    if(addressType ==='paddress'){
      setaddressModalOpen(false)
      setData({...data,padProvince:selectedprovince,padCity:selectedmunicity,padBrgy:selectedbarangay})
    }else{
      setaddressModalOpen(false)
      setData({...data,radProvince:selectedprovince,radCity:selectedmunicity,radBrgy:selectedbarangay})
    }
  }
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Typography variant="h5" sx={{'textAlign':'center','margin':'20px','color':'#2196F3'}} >Personal Information</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} >
          {loading ? (
              <Stack spacing={3}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="text" width='40%' />
                  <Skeleton variant="text" width='60%' />
                </Box>
              </Stack>
            ) : (
          <Fade in>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column', bgcolor: '#fff', p: 2, borderRadius: '.5rem' }}>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                <TextField
                label="SURNAME"
                fullWidth
                name="lname"
                value ={data.lname}
                onChange={handleSetDataChange}
                />  

                <TextField
                label="FIRST NAME"
                fullWidth
                name="fname"
                value ={data.fname}
                onChange={handleSetDataChange}
                />

                <TextField
                label="MIDDLE NAME"
                fullWidth
                name="mname"
                value ={data.mname}
                onChange={handleSetDataChange}
                />
                <TextField
                label="NAME EXTENSION"
                fullWidth
                name="extname"
                value ={data.extname}
                onChange={handleSetDataChange}
                />  
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                <TextField
                label="DATE OF BIRTH"
                type="date"
                InputLabelProps={{ shrink: true }} 
                fullWidth
                name="dob"
                value ={data.dob}
                onChange={handleSetDataChange}/>

                <TextField
                label="PLACE OF BIRTH"
                fullWidth
                name="baddress"
                value ={data.baddress}
                onChange={handleSetDataChange}/>

                <FormControl fullWidth>
                <InputLabel id="select-sex">SEX</InputLabel>
                <Select
                  labelId="select-sex"
                  id="select-sex"
                  // defaultValue = {data.sex}
                  value={data.sex}
                  name="sex"
                  label="SEX"
                  onChange={handleSetDataChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                </FormControl>

                <FormControl fullWidth>
                <InputLabel id="select-civil-status">CIVIL STATUS</InputLabel>
                <Select
                  labelId="select-sex-civil-status"
                  id="select-sex-civil-status"
                  value={data.civilstatus}
                  name="civilstatus"
                  label="CIVIL STATUS"
                  onChange={handleSetDataChange}
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Separated">Separated</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
                </FormControl>

              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
              <TextField
                label="CITIZENSHIP"
                fullWidth
                name="citizenship"
                value ={data.citizenship}
                onChange={handleSetDataChange}/>

              <TextField
                label="HEIGHT (meters)"
                fullWidth
                type="number"
                name="height"
                InputProps={{
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                }}
                value ={data.height}
                onChange={handleSetDataChange}/>

              <TextField
                label="WEIGHT (kg)"
                fullWidth
                type="number"
                name="weight"
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                value ={data.weight}
                onChange={handleSetDataChange}/>

              <TextField
                label="BLOOD TYPE"
                fullWidth
                name="bloodtype"
                value ={data.bloodtype}
                onChange={handleSetDataChange}/>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
              <TextField
                label="GISIS NO."
                fullWidth
                name="gsisno"
                value ={data.gsisno}
                onChange={handleSetDataChange}/>

              <TextField
                label="PAG-IBIG NO.."
                fullWidth
                name="pag_ibig"
                value ={data.pag_ibig}
                onChange={handleSetDataChange}/>
              
              <TextField
                label="PHILHEALTH NO.."
                fullWidth
                name="philhealth"
                value ={data.philhealth}
                onChange={handleSetDataChange}/>

              <TextField
                label="SSS NO."
                fullWidth
                name="sssno"
                value ={data.sssno}
                onChange={handleSetDataChange}/>

              <TextField
                label="TIN NO."
                fullWidth
                name="tin"
                value ={data.tin}
                onChange={handleSetDataChange}/>
              
              <TextField
                label="AGENCY EMPLOYEE NUMBER"
                fullWidth
                name="agency_employee_no"
                value ={data.agency_employee_no}
                onChange={handleSetDataChange}/>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                <Typography>Residential Address</Typography>
                <TextField
                label="Zip code"
                fullWidth
                name="radZip"
                value ={data.radZip}
                onChange={handleSetDataChange}/>

                <TextField
                label="House/Block/Lot No."
                fullWidth
                name="radUnit"
                value ={data.radUnit}
                onChange={handleSetDataChange}/>

                <TextField
                label="Street"
                fullWidth
                name="radStreet"
                value ={data.radStreet}
                onChange={handleSetDataChange}/>

                <TextField
                label="Subdivision/Village"
                fullWidth
                name="radVillage"
                value ={data.radVillage}
                onChange={handleSetDataChange}/>

                <TextField
                label="Barangay"
                fullWidth
                name="radBrgy"
                value ={data.radBrgy}
                disabled
                onChange={handleSetDataChange}/>

                <TextField
                label="City/Municipality"
                fullWidth
                name="radCity"
                value ={data.radCity}
                disabled
                onChange={handleSetDataChange}/>

                <TextField
                label="Province"
                fullWidth
                name="radProvince"
                value ={data.radProvince}
                disabled
                onChange={handleSetDataChange}/>
              </Box>
              <Button variant='outlined' onClick = {()=>handleOpenAddressModal('raddress')}>Update Residential Address</Button>
              <Divider />

              <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                <Typography>Permanent Address</Typography>

                <TextField
                label="Zip code"
                fullWidth
                name="padZip"
                value ={data.padZip}
                onChange={handleSetDataChange}
                disabled={isSameAddress?true:false}
                />

                <TextField
                label="House/Block/Lot No."
                fullWidth
                name="padUnit"
                value ={data.padUnit}
                onChange={handleSetDataChange}
                disabled={isSameAddress?true:false}
                />

                <TextField
                label="Street"
                fullWidth
                name="padStreet"
                value ={data.padStreet}
                onChange={handleSetDataChange}
                disabled={isSameAddress?true:false}
                />

                <TextField
                label="Subdivision/Village"
                fullWidth
                name="padVillage"
                value ={data.padVillage}
                onChange={handleSetDataChange}
                disabled={isSameAddress?true:false}
                />

                <TextField
                label="Barangay"
                fullWidth
                name="padBrgy"
                value ={data.padBrgy}
                disabled/>

                <TextField
                label="City/Municipality"
                fullWidth
                name="padCity"
                value ={data.padCity}
                disabled/>

                <TextField
                label="Province"
                fullWidth
                name="padProvince"
                value ={data.padProvince}
                disabled/>
              </Box>
              <FormGroup >
                <FormControlLabel sx={{color:'#2484ff'}} control={<Checkbox size="small" onChange={()=>setIsSameAddress(!isSameAddress)}/>} label="Same as Residential Addres" />
              </FormGroup>
              <Button variant='outlined' onClick = {()=>handleOpenAddressModal('paddress')} disabled={isSameAddress?true:false}>Update Permanent Address</Button>

              <Button variant='contained' onClick = {submitUpdate}>Save Changes</Button>
            </Box>
          </Fade>)}
      </Grid>

    {/* Update Permanent Address Modal */}

    <Modal
        open={addressModalOpen}
        onClose={()=> setaddressModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
          <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
              Updating {addressType === 'paddress'? 'Permanent':'Residential'} Address
          </Typography>
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <FormControl fullWidth>
                  <InputLabel id="select-region-name">REGION</InputLabel>
                  <Select
                    labelId="select-region-name"
                    id="select-region-name"
                    value={selectedregion}
                    name="region"
                    label="REGION"
                    onChange={handleRegionChange}
                  >
                    {region.map((data,key)=>
                      <MenuItem value={data.key} key = {key}>{data.region_name}</MenuItem>
                    )}
                  </Select>
                  </FormControl>

                  <FormControl fullWidth>
                  <InputLabel id="select-province-name">PROVINCE</InputLabel>
                  <Select
                    labelId="select-province-name"
                    id="select-province-name"
                    value={selectedprovince}
                    name="province"
                    label="PROVINCE"
                    onChange={handleProvinceChange}
                  >
                    {province.map((data,key)=>
                      <MenuItem value={data.province_name} key = {key}>{data.province_name}</MenuItem>
                    )}
                  </Select>
                  </FormControl>
                  
                  <FormControl fullWidth>
                  <InputLabel id="select-munity-name">CITY/MUNICIPALITY</InputLabel>
                  <Select
                    labelId="select-munity-name"
                    id="select-munity-name"
                    value={selectedmunicity}
                    name="province"
                    label="CITY/MUNICIPALITY"
                    onChange={handleMunicityChange}
                  >
                    {municity.map((data,key)=>
                      <MenuItem value={data.muni_city} key = {key}>{data.muni_city}</MenuItem>
                    )}
                  </Select>
                  </FormControl>

                  <FormControl fullWidth>
                  <InputLabel id="select-barangay-name">BARANGAY</InputLabel>
                  <Select
                    labelId="select-barangay-name"
                    id="select-barangay-name"
                    value={selectedbarangay}
                    name="barangay"
                    label="BARANGAY"
                    onChange={handleBarangayChange}
                  >
                    {barangay.map((data,key)=>
                      <MenuItem value={data.barangay} key = {key}>{data.barangay}</MenuItem>
                    )}
                  </Select>
                  </FormControl>
                   </Box>
                  </Grid>
              </Grid>

              
          <Typography id="modal-modal-description" sx={{ mt: 2}}>
          
          </Typography>
          {/* <Button variant="contained" color="success" size="large" fullWidth ><CheckIcon/> &nbsp; Confirm Update</Button>
          <br/>
          <Button variant="contained" color="error" size="large" fullWidth ><CancelIcon/> &nbsp; Cancel</Button> */}
          <Box sx={{display:'flex',justifyContent:'space-between',flexDirection:matches?'column':'row'}}>
          <Button variant="contained" color="success" sx={{mt:2}} startIcon={<CheckIcon/>} onClick = {handleSaveAddress}>Save Changes</Button>
          <Button variant="contained" size="small"color="error" sx={{mt:2}} startIcon={<CancelIcon/>} onClick = {() => setaddressModalOpen(false)}>Cancel</Button>
          </Box>

          </Box>
    </Modal>
          
    </Grid>
  )
}

export default ApplicantPersonalInfo