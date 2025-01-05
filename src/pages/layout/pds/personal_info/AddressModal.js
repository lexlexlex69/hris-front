import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// address
import addressJson from '../address2.json'

// mui icons
import SaveAltIcon from '@mui/icons-material/SaveAlt';

function AddressModal({ personal, handleClose, addressRef }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [current, setCurrent] = useState(false)
    const [region, setRegion] = useState('')
    const [province, setProvince] = useState(personal.radProvince)
    const [provinceList, setProvinceList] = useState([])
    const [city, setCity] = useState(personal.radCity)
    const [cityList, setCityList] = useState([])
    const [barangay, setBarangay] = useState(personal.radBrgy)
    const [barangayList, setBarangayList] = useState([])
    const [village, setVillage] = useState(personal.radVillage)
    const [street, setStreet] = useState(personal.radStreet)
    const [radUnit, setRadUnit] = useState(personal.radUnit)
    const [radZip, setRadZip] = useState(personal.radZip)

    const [pRegion, setPRegion] = useState('')
    const [pProvince, setPProvince] = useState(personal.padProvince)
    const [pProvinceList, setPProvinceList] = useState([])
    const [pCity, setPCity] = useState(personal.padCity)
    const [pCityList, setPCityList] = useState([])
    const [pBarangay, setPBarangay] = useState(personal.padBrgy)
    const [pBarangayList, setPBarangayList] = useState([])
    const [pVillage, setPVillage] = useState(personal.padVillage)
    const [pStreet, setPStreet] = useState(personal.padStreet)
    const [padUnit, setPadUnit] = useState(personal.padUnit)
    const [padZip, setPadZip] = useState(personal.padZip)

    // functions
    const handleSubmit = (e) => {
        console.log(province)
        console.log(city)
        console.log(barangay)
        e.preventDefault()
        if (current) {
            addressRef.radProvince.current.value = province
            addressRef.radCity.current.value = city
            addressRef.radBrgy.current.value = barangay
            addressRef.radStreet.current.value = street
            addressRef.radVillage.current.value = village
            addressRef.radUnit.current.value = radUnit
            addressRef.radZip.current.value = radZip
            addressRef.padProvince.current.value = province
            addressRef.padCity.current.value = city
            addressRef.padBrgy.current.value = barangay
            addressRef.padStreet.current.value = street
            addressRef.padVillage.current.value = village
            addressRef.padUnit.current.value = radUnit
            addressRef.padZip.current.value = radZip
        }
        else {
            addressRef.radProvince.current.value = province
            addressRef.radCity.current.value = city
            addressRef.radBrgy.current.value = barangay
            addressRef.radStreet.current.value = street
            addressRef.radVillage.current.value = village
            addressRef.radUnit.current.value = radUnit
            addressRef.radZip.current.value = radZip
            addressRef.padProvince.current.value = pProvince
            addressRef.padCity.current.value = pCity
            addressRef.padBrgy.current.value = pBarangay
            addressRef.padStreet.current.value = pStreet
            addressRef.padVillage.current.value = pVillage
            addressRef.padUnit.current.value = padUnit
            addressRef.padZip.current.value = padZip
        }
        handleClose()
    }

    useEffect(() => {
        if (!current) {
            setPProvince('')
            setPCity('')
            setPBarangay('')
            setPVillage('')
            setPStreet('')
            setPadUnit('')
            setPadZip('')
        }
    }, [current])


    useEffect(() => {
        let provinces = []
        for (let x in addressJson) {
            for (let y in addressJson[x].province_list) {
                provinces.push(y)
            }
        }
        setProvinceList(provinces)
        setPProvinceList(provinces)
    }, [])

    useEffect(() => {
        if (province) {
            let selectedRegion = ''
            for (let x in addressJson) {
                for (let y in addressJson[x].province_list) {
                    if (y === province) {
                        setRegion(x)
                        selectedRegion = x
                        break
                    }
                }
            }
            let cities = []
            for (let y in addressJson[selectedRegion].province_list[province].municipality_list) {
                cities.push(y)
            }
            setCityList(cities)
        }
    }, [province])

    useEffect(() => {
        if (pProvince) {
            let selectedRegion = ''
            for (let x in addressJson) {
                for (let y in addressJson[x].province_list) {
                    if (y === pProvince) {
                        setPRegion(x)
                        selectedRegion = x
                        break
                    }
                }
            }
            let cities = []
            for (let y in addressJson[selectedRegion].province_list[pProvince].municipality_list) {
                cities.push(y)
            }
            setPCityList(cities)
        }
    }, [pProvince])

    useEffect(() => {

        if (city) {
            if (region) {
                let barangay = []
                addressJson[region].province_list[province].municipality_list[city].barangay_list.forEach(item => {
                    barangay.push(item)
                    ////console.log('adad')
                })
                // addressJson[region].province_list[province].municipality_list[city].barangay_list.map(item => {
                //     barangay.push(item)
                // })
                ////console.log(barangay)
                setBarangayList(barangay)
            }
        }

    }, [city])

    useEffect(() => {
        if (pCity) {
            if (pRegion) {
                ////console.log(pCity, pRegion, pProvince)
                let barangay = []
                // addressJson[pRegion].province_list[pProvince].municipality_list[pCity].barangay_list.forEach(item => {
                //     barangay.push(item)
                // })
                addressJson[pRegion].province_list[pProvince].municipality_list[pCity].barangay_list.map(item => {
                    barangay.push(item)
                })
                ////console.log(barangay)
                setPBarangayList(barangay)
            }
        }

    }, [pCity])

    useEffect(() => {
        if (current) {
            setPProvince(province)
            setPRegion(region)
            setPCity(city)
            setPBarangay(barangay)
            setPVillage(village)
            setPStreet(street)
            setPadUnit(radUnit)
            setPadZip(radZip)
        }
    }, [current])

    return (
        <Box sx={{ height: '100%', overflowY: matches ? 'scroll' : 'none' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 1, }} >
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>

                    <Typography sx={{ color: 'primary.main', mb: 1 }}>RESIDENTIAL ADDRESS</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Province</InputLabel>
                            <Select
                                required
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                label="Province"
                            >
                                <MenuItem disabled value={province}>{province}</MenuItem>
                                {provinceList && provinceList.map((item, index) => (
                                    <MenuItem  key={index} value={item + ""}> {item + ""} </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">City</InputLabel>
                            <Select
                                required
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                label="City"
                            >
                                <MenuItem disabled value={city}>{city}</MenuItem>
                                {cityList && cityList.map((item, index) => (
                                    <MenuItem key={index} value={item + ""}> {item + ""} </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Barangay</InputLabel>
                            <Select
                                required
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={barangay}
                                onChange={(e) => setBarangay(e.target.value)}
                                label="Barangay"
                            >
                                <MenuItem disabled value={barangay}>{barangay}</MenuItem>
                                {barangayList && barangayList.map((item, index) => (
                                    <MenuItem key={index} value={item + ""}> {item + ""} </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Subdivision/Village" value={village} onChange={(e) => setVillage(e.target.value)}></TextField>
                        <TextField fullWidth label="Street" value={street} onChange={(e) => setStreet(e.target.value)}></TextField>
                        <TextField fullWidth label="House/Block/Lot No." value={radUnit} onChange={(e) => setRadUnit(e.target.value)} ></TextField>
                        <TextField fullWidth label="Zipcode" value={radZip} onChange={(e) => setRadZip(e.target.value)} ></TextField>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={current} />} onChange={() => setCurrent(!current)} label="same as current address" />
                    </FormGroup>
                </Box>

                <Box>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexDirection: 'column' }}>
                        <Typography sx={{ color: 'primary.main', mb: 1 }}>PERMANENT ADDRESS</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Province</InputLabel>
                                <Select
                                    required
                                    disabled={current}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={pProvince}
                                    onChange={(e) => setPProvince(e.target.value)}
                                    label="Province"
                                >
                                    <MenuItem disabled value={pProvince}>{pProvince}</MenuItem>
                                    {pProvinceList && pProvinceList.map((item, index) => (
                                        <MenuItem key={index} value={item + ""}> {item + ""} </MenuItem>

                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">City</InputLabel>
                                <Select
                                    required
                                    disabled={current}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={pCity}
                                    onChange={(e) => setPCity(e.target.value)}
                                    label="City"
                                >
                                    <MenuItem disabled value={pCity}>{pCity}</MenuItem>
                                    {pCityList && pCityList.map((item, index) => (
                                        <MenuItem key={index} value={item + ""}> {item + ""} </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Barangay</InputLabel>
                                <Select
                                    required
                                    disabled={current}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={pBarangay}
                                    onChange={(e) => setPBarangay(e.target.value)}
                                    label="Barangay"
                                >
                                    <MenuItem disabled value={pBarangay}>{pBarangay}</MenuItem>
                                    {pBarangayList && pBarangayList.map((item, index) => (
                                        <MenuItem key={index} value={item + ""}> {item + ""} </MenuItem>

                                    ))}
                                </Select>
                            </FormControl>
                            <TextField disabled={current} fullWidth label="Subdivision/Village" value={pVillage} onChange={(e) => setPVillage(e.target.value)}></TextField>
                            <TextField disabled={current} fullWidth label="Street" value={pStreet} onChange={(e) => setPStreet(e.target.value)}></TextField>
                            <TextField disabled={current} fullWidth label="House/Block/Lot No." value={padUnit} onChange={(e) => setPadUnit(e.target.value)} ></TextField>
                            <TextField disabled={current} fullWidth label="Zipcode" value={padZip} onChange={(e) => setPadZip(e.target.value)} ></TextField>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Button variant="contained" type="submit" color="primary" startIcon={<SaveAltIcon />}>Save info</Button>
                    {/* <Button variant="contained" color="error" onClick={handleClose}>Close</Button> */}
                </Box>
            </form>
        </Box>
    )
}

export default AddressModal