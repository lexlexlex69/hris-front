import React, { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import { orange } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import addressJson from '../../../../../../address.json'
import { Alert } from '@mui/material';


const Address = ({
    // radRegion, setRadRegion, radProvince, setRadProvince, radCity, setRadCity, radBrgy, setRadBrgy, radUnit, setRadUnit, radVillage, setRadVillage, radStreet, setRadStreet, radZip, setRadZip,
    // padRegion, setPadRegion, padProvince, setPadProvince, padCity, setPadCity, padBrgy, setPadBrgy, padUnit, setPadUnit, padVillage, setPadVillage, padStreet, setPadStreet, padZip, setPadZip
    addressState, setAddressState, addressDefault, sameAddress, setSameAddress, update, setUpdate
}) => {
    const renderCheck = useRef(true)
    const [regionItems, setRegionItems] = useState([])
    const [provinceItems, setProvinceItems] = useState([])
    const [cityItems, setCityItems] = useState([])
    const [barItems, setBarItems] = useState([])
    const [regionItemsP, setRegionItemsP] = useState([])
    const [provinceItemsP, setProvinceItemsP] = useState([])
    const [cityItemsP, setCityItemsP] = useState([])
    const [barItemsP, setBarItemsP] = useState([])

    const padRegion = useRef(null)
    const padProvince = useRef(null)
    const padCity = useRef(null)
    const padBrgy = useRef(null)

    const updateRef = useRef(true)

    const handleChange = (e) => {
        setAddressState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    useEffect(() => {
        if (updateRef.current) {
            updateRef.current = false
        }
        else {
            if (update) {
                setAddressState({
                    radRegion: '',
                    radProvince: '',
                    radCity: '',
                    radBrgy: '',
                    radUnit: '',
                    radStreet: '',
                    radZip: '',
                    radVillage: '',
                    padRegion: '',
                    padProvince: '',
                    padCity: '',
                    padBrgy: '',
                    padUnit: '',
                    padStreet: '',
                    padVillage: '',
                    padZip: '',
                })
            }
        }
    }, [update])

    useEffect(() => {
        let regions = []
        for (let x in addressJson) {
            regions.push(x)
        }
        setRegionItems(regions)
        setRegionItemsP(regions)
    }, [])

    useEffect(() => {
        if (addressState.radRegion) {
            setAddressState(prev => ({ ...prev, radProvince: '' }))
            setAddressState(prev => ({ ...prev, radCity: '' }))
            setAddressState(prev => ({ ...prev, radBrgy: '' }))
            let province = []
            for (let x in addressJson[addressState.radRegion].province_list) {
                province.push(x)
            }
            setProvinceItems(province)
        }
    }, [addressState.radRegion])


    useEffect(() => {
        if (addressState.radProvince) {
            setAddressState(prev => ({ ...prev, radCity: '' }))
            setAddressState(prev => ({ ...prev, radBrgy: '' }))
            let city = []
            for (let x in addressJson[addressState.radRegion].province_list[addressState.radProvince].municipality_list) {
                city.push(x)
            }
            setCityItems(city)
        }
    }, [addressState.radProvince])

    useEffect(() => {
        if (addressState.radCity) {
            let bar = []
            Object.values(addressJson[addressState.radRegion].province_list[addressState.radProvince].municipality_list[addressState.radCity].barangay_list).every(x => {
                bar.push(x)
                return true
            })
            setBarItems(bar)
        }
    }, [addressState.radCity])


    useEffect(() => {
        if (addressState.padRegion) {
            setAddressState(prev => ({ ...prev, padProvince: '' }))
            setAddressState(prev => ({ ...prev, padCity: '' }))
            setAddressState(prev => ({ ...prev, padBrgy: '' }))
            let province = []
            for (let x in addressJson[addressState.padRegion].province_list) {
                province.push(x)
            }
            setProvinceItemsP(province)
        }

    }, [addressState.padRegion])

    useEffect(() => {
        if (addressState.padProvince && !sameAddress) {
            setAddressState(prev => ({ ...prev, padCity: '' }))
            setAddressState(prev => ({ ...prev, padBrgy: '' }))
            let city = []
            for (let x in addressJson[addressState.padRegion].province_list[addressState.padProvince].municipality_list) {
                city.push(x)
            }
            setCityItemsP(city)
        }
    }, [addressState.padProvince, sameAddress])


    useEffect(() => {
        if (addressState.padCity && !sameAddress) {
            let bar = []
            Object.values(addressJson[addressState.padRegion].province_list[addressState.padProvince].municipality_list[addressState.padCity].barangay_list).every(x => {
                bar.push(x)
                return true
            })
            setBarItemsP(bar)
        }
    }, [addressState.padCity, sameAddress])


    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button variant="contained" color={update ? "error" : "warning"} sx={{ borderRadius: '2rem',width:{xs:'100%',md:'30%'},mb:2 }} startIcon={update ? <CloseIcon /> : <EditIcon />} onClick={() => setUpdate(prev => !prev)}>
                    {update ? 'Cancel' : 'Update address'}
                </Button>
            </Box>
            <Typography variant="body1" sx={{ color: 'warning.main' }}>RESIDENTIAL ADDRESS</Typography>
            {update ? (
                <Box sx={{ display: 'flex', gap: 2, mt: 1,flexDirection:{xs:'column',md:'row'} }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">REGION</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="REGION"
                            name="radRegion"
                            value={addressState.radRegion}
                            onChange={handleChange}
                        >
                            {regionItems && regionItems.map((item, i) => (
                                <MenuItem value={item} key={i}>{item}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">PROVINCE</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="radProvince"
                            label="PROVINCE"
                            value={addressState.radProvince}
                            onChange={handleChange}
                        >
                            {provinceItems && provinceItems.map((item, i) => (
                                <MenuItem value={item} key={i}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">CITY</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="CITY"
                            name="radCity"
                            value={addressState.radCity}
                            onChange={handleChange}
                        >
                            {cityItems && cityItems.map((item, i) => (
                                <MenuItem value={item} key={i}>{item}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">BARANGAY</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="BARANGAY"
                            name="radBrgy"
                            value={addressState.radBrgy}
                            onChange={handleChange}
                        >
                            {barItems && barItems.map((item, i) => (
                                <MenuItem value={item} key={i}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, mt: 1,flexDirection:{xs:'column',md:'row'} }}>
                    <TextField
                        id=""
                        label="REGION"
                        fullWidth
                        disabled
                        value={addressDefault?.radRegion}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="PROVINCE"
                        disabled
                        value={addressDefault?.radProvince}
                    />
                    <TextField
                        id=""
                        label="CITY"
                        fullWidth
                        disabled
                        value={addressDefault?.radCity}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="BARANGAY"
                        value={addressDefault?.radBrgy}
                        disabled
                    />
                </Box>
            )}
            {update ? (
                <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'space-between',flexDirection:{xs:'column',md:'row'} }}>
                    <TextField
                    fullWidth
                        id=""
                        label="SUBDIVISION/VILLAGE"
                        name="radVillage"
                        value={addressState.radVillage}
                        onChange={handleChange}

                    />
                    <TextField
                    fullWidth
                        id=""
                        label="STREET"
                        name="radStreet"
                        value={addressState.radStreet}
                        onChange={handleChange}
                    />

                    <TextField
                    fullWidth
                        id=""
                        label="HOUSE / BLOCK NO."
                        name="radUnit"
                        value={addressState.radUnit}
                        onChange={handleChange}

                    />
                    <TextField
                    fullWidth
                        id=""
                        label="ZIPCODE"
                        name="radZip"
                        value={addressState.radZip}
                        onChange={handleChange}

                    />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, mt: 2,flexDirection:{xs:'column',md:'row'} }}>
                    <TextField
                        id=""
                        label="VILLAGE/SUBDIVISION"
                        fullWidth
                        disabled
                        value={addressDefault?.radVillage}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="STREET"
                        disabled
                        value={addressDefault?.radStreet}
                    />
                    <TextField
                        id=""
                        label="HOUSE / BLOCK NO."
                        fullWidth
                        disabled
                        value={addressDefault?.radUnit}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="ZIPCODE"
                        value={addressDefault?.radZip}
                        disabled
                    />
                </Box>
            )}
            {update ? (
                <FormControlLabel
                fullWidth
                    label="Same as residential address"
                    control={
                        <Checkbox
                            value=""
                            checked={sameAddress}
                            onChange={e => setSameAddress(prev => !prev)}
                            color="primary"
                        />
                    }
                />
            ) : null}

            <Typography variant="body1" sx={{ color: 'warning.main', mt: 2 }}>PERMANENT ADDRESS</Typography>
            {update ? (
                <>
                    {sameAddress ? <Alert severity='info' className='animate__animated animate__fadeIn'>Copied residential address to permanent address!</Alert> : null}
                    <Box sx={{ display: 'flex', gap: 2, mt: 1,flexDirection:{xs:'column',md:'row'} }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">REGION</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="REGION"
                                name="padRegion"
                                disabled={sameAddress}
                                inputRef={padRegion}
                                value={addressState.padRegion}
                                onChange={handleChange}
                            >
                                {regionItemsP && regionItemsP.map((item, i) => (
                                    <MenuItem value={item} key={i}>{item}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">PROVINCE</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="PROVINCE"
                                name="padProvince"
                                disabled={sameAddress}
                                inputRef={padProvince}
                                value={addressState.padProvince}
                                onChange={handleChange}
                            >
                                {provinceItemsP && provinceItemsP.map((item, i) => (
                                    <MenuItem value={item} key={i}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">CITY</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="CITY"
                                inputRef={padCity}
                                disabled={sameAddress}
                                name="padCity"
                                value={addressState.padCity}
                                onChange={handleChange}
                            >
                                {cityItemsP && cityItemsP.map((item, i) => (
                                    <MenuItem value={item} key={i}>{item}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">BARANGAY</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="BARANGAY"
                                name="padBrgy"
                                inputRef={padBrgy}
                                disabled={sameAddress}
                                value={addressState.padBrgy}
                                onChange={handleChange}
                            >
                                {barItemsP && barItemsP.map((item, i) => (
                                    <MenuItem value={item} key={i}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, mt: 1,flexDirection:{xs:'column',md:'row'} }}>
                    <TextField
                        id=""
                        label="REGION"
                        fullWidth
                        disabled
                        value={addressDefault?.padRegion}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="PROVINCE"
                        disabled
                        value={addressDefault?.padProvince}
                    />
                    <TextField
                        id=""
                        label="CITY"
                        fullWidth
                        disabled
                        value={addressDefault?.padCity}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="BARANGAY"
                        value={addressDefault?.padBrgy}
                        disabled
                    />
                </Box>
            )}

            {update ? (
                <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'space-between',flexDirection:{xs:'column',md:'row'} }}>
                    <TextField
                    fullWidth
                        id=""
                        label="SUBDIVISION/VILLAGE"
                        name="padVillage"
                        disabled={sameAddress}
                        value={addressState.padVillage}
                        onChange={handleChange}

                    />
                    <TextField
                    fullWidth
                        id=""
                        label="STREET"
                        name="padStreet"
                        disabled={sameAddress}
                        value={addressState.padStreet}
                        onChange={handleChange}
                    />

                    <TextField
                    fullWidth
                        id=""
                        label="HOUSE / BLOCK NO."
                        name="padUnit"
                        disabled={sameAddress}
                        value={addressState.padUnit}
                        onChange={handleChange}

                    />
                    <TextField
                    fullWidth
                        id=""
                        label="ZIPCODE"
                        name="padZip"
                        disabled={sameAddress}
                        value={addressState.padZip}
                        onChange={handleChange}

                    />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, mt: 2,flexDirection:{xs:'column',md:'row'} }}>
                    <TextField
                        id=""
                        label="VILLAGE/SUBDIVISION"
                        fullWidth
                        disabled
                        value={addressDefault?.padVillage}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="STREET"
                        disabled
                        value={addressDefault?.padStreet}
                    />
                    <TextField
                        id=""
                        label="HOUSE / BLOCK NO."
                        fullWidth
                        disabled
                        value={addressDefault?.padUnit}
                    />
                    <TextField
                        fullWidth
                        id=""
                        label="ZIPCODE"
                        value={addressDefault?.padZip}
                        disabled
                    />
                </Box>
            )}

        </Box>
    );
};

export default Address;