import React, { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import {orange} from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// address
import addressJson from '../address2.json'

function AddressModalReworked({msx, personal, toCompare, handleOpenModal, pdsParam, radRegion, setRadRegion, radProvince, setRadProvince, radCity, setRadCity, radBrgy, setRadBrgy, radVillage, setRadVillage, radStreet, radUnit, radZip, padRegion, setPadRegion, padProvince, setPadProvince, padCity, setPadCity, padBrgy, setPadBrgy, padVillage, padUnit, padStreet, padZip }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [sameAddress, setSameAddress] = useState(false)
    const renderCheck = useRef(true)
    const [regionItems, setRegionItems] = useState([])
    const [provinceItems, setProvinceItems] = useState([])
    const [cityItems, setCityItems] = useState([])
    const [barItems, setBarItems] = useState([])
    const [regionItemsP, setRegionItemsP] = useState([])
    const [provinceItemsP, setProvinceItemsP] = useState([])
    const [cityItemsP, setCityItemsP] = useState([])
    const [barItemsP, setBarItemsP] = useState([])

    const [toUpdate, setToUpdate] = useState(false)
    const [toUpdate2, setToUpdate2] = useState(false)

    useEffect(() => {
        if (sameAddress) {
            setToUpdate2(false)
            setPadRegion(radRegion)
            setPadProvince(radProvince)
            setPadCity(radCity)
            setPadBrgy(radBrgy)
            padVillage.current.value = radVillage.current.value
            padStreet.current.value = radStreet.current.value
            padUnit.current.value = radUnit.current.value
            padZip.current.value = radZip.current.value
        }
        else {
        }
    }, [sameAddress])

    useEffect(() => {
        let regions = []
        for (let x in addressJson) {
            regions.push(x)
        }
        setRegionItems(regions)
        setRegionItemsP(regions)
    }, [])

    useEffect(() => {
        if (renderCheck.current) {
            renderCheck.current = false
        }
        else {
            if (!toUpdate) {
                setRadRegion(null)
                setRadProvince(null)
                setRadCity(null)
                setRadBrgy(null)
                radStreet.current.value = personal.radStreet
                radVillage.current.value = personal.radVillage
                radUnit.current.value = personal.radUnit
                radZip.current.value = personal.radZip
            }
        }

    }, [toUpdate])

    useEffect(() => {
        if (radRegion) {
            setRadProvince('')
            setRadCity('')
            setRadBrgy('')
            let province = []
            for (let x in addressJson[radRegion].province_list) {
                province.push(x)
            }
            setProvinceItems(province)
        }
    }, [radRegion])

    useEffect(() => {
        if (padRegion && !sameAddress) {
            setPadProvince('')
            setPadCity('')
            setPadBrgy('')
            let province = []
            for (let x in addressJson[padRegion].province_list) {
                province.push(x)
            }
            setProvinceItemsP(province)
        }

    }, [padRegion, sameAddress])

    useEffect(() => {
        if (radProvince) {
            setRadCity('')
            setRadBrgy('')
            let city = []
            for (let x in addressJson[radRegion].province_list[radProvince].municipality_list) {
                city.push(x)
            }
            setCityItems(city)
        }
    }, [radProvince])

    useEffect(() => {
        if (padProvince && !sameAddress) {
            setPadCity('')
            setPadBrgy('')
            let city = []
            for (let x in addressJson[padRegion].province_list[padProvince].municipality_list) {
                city.push(x)
            }
            setCityItemsP(city)
        }
    }, [padProvince, sameAddress])

    useEffect(() => {
        if (radCity) {
            let bar = []
            Object.values(addressJson[radRegion].province_list[radProvince].municipality_list[radCity].barangay_list).every(x => {
                bar.push(x)
                return true
            })
            setBarItems(bar)
        }
    }, [radCity])

    useEffect(() => {
        if (padCity && !sameAddress) {
            let bar = []
            Object.values(addressJson[padRegion].province_list[padProvince].municipality_list[padCity].barangay_list).every(x => {
                bar.push(x)
                return true
            })
            setBarItemsP(bar)
        }
    }, [padCity, sameAddress])
    return (
        <div style={{...msx}}>
            {matches ? (<hr />) : null}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', flex: 1 }}>
                    <Typography variant='body1' sx={{ color: 'warning.main',border:`1px dashed ${orange[800]}`,p:.5 }} align="center" gutterBottom>RESIDENTIAL ADDRESS</Typography>
                </Box>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                    <Button startIcon={<EditIcon />} variant="contained" sx={{borderRadius:'2rem'}} color={toUpdate ? 'error' : 'warning'} onClick={() => setToUpdate(prev => !prev)}>{toUpdate ? 'Cancel' : matches ? 'Update' : 'Update Residential Address'}</Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: matches ? 5 : 5, mt: matches ? 5 : 5 }}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', gap: matches ? 5 : 2 }}>
                    <Tooltip title={toCompare.radRegion ? toCompare.radRegion.new_value : ''} open placement="top-end" arrow>
                        {toUpdate ? (
                            <TextField select value={radRegion} fullWidth label='region' onChange={(e) => setRadRegion(e.target.value)} size="small">
                                <MenuItem value={null}></MenuItem>
                                {regionItems && regionItems.map((item, i) => (
                                    <MenuItem key={i} value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField disabled={toUpdate ? false : true} value={personal.radRegion || ''} fullWidth label='region' size="small" onClick={() => toCompare.radRegion && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.radRegion, personal.id, setRadRegion) : null} sx={{ bgcolor: toCompare.radRegion ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>
                    <Tooltip title={toCompare.radProvince ? toCompare.radProvince.new_value : ''} open placement="top-end" arrow size="small">
                        {toUpdate ? (
                            <TextField select value={radProvince} fullWidth label='province' onChange={(e) => setRadProvince(e.target.value)} size="small" >
                                <MenuItem value={null}></MenuItem>
                                {radRegion && provinceItems && provinceItems.map((item, i) => (
                                    <MenuItem key={i} value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField disabled={toUpdate ? false : true} value={personal.radProvince || ''} fullWidth label='province' size="small" onClick={() => toCompare.radProvince && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.radProvince, personal.id, setRadProvince) : null} sx={{ bgcolor: toCompare.radProvince ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>
                    <Tooltip title={toCompare.radCity ? toCompare.radCity.new_value : ''} open placement="top-end" arrow >
                        {toUpdate ? (
                            <TextField select value={radCity} fullWidth label='City' onChange={(e) => setRadCity(e.target.value)} size="small">
                                <MenuItem value={null}></MenuItem>
                                {radProvince && cityItems && cityItems.map((item, i) => (
                                    <MenuItem key={i} value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField disabled={toUpdate ? false : true} value={personal.radCity || ''} fullWidth label='City' size="small" onClick={() => toCompare.radCity && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.radCity, personal.id, setRadCity) : null} sx={{ bgcolor: toCompare.radCity ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>
                    <Tooltip title={toCompare.radBrgy ? toCompare.radBrgy.new_value : ''} open placement="top-end" arrow >
                        {toUpdate ? (
                            <TextField select value={radBrgy} fullWidth label='barangay' onChange={(e) => setRadBrgy(e.target.value)} size="small">
                                <MenuItem value={null}></MenuItem>
                                {radCity && barItems && barItems.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField disabled={toUpdate ? false : true} value={personal.radBrgy || ''} fullWidth label='barangay' size="small" onClick={() => toCompare.radBrgy && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.radBrgy, personal.id, setRadBrgy) : null} sx={{ bgcolor: toCompare.radBrgy ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>

                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', gap: matches ? 5 : 2 }}>
                    <Tooltip title={toCompare.radVillage ? toCompare.radVillage.new_value : ''} open placement="top-end" arrow>
                        <TextField defaultValue={personal.radVillage || ''} focused inputRef={radVillage} disabled={toUpdate ? false : true} fullWidth label='Subdivision/Village' size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.radVillage ? handleOpenModal(toCompare.radVillage, personal.id, radVillage) : null} sx={{ bgcolor: toCompare.radVillage ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                    <Tooltip title={toCompare.radStreet ? toCompare.radStreet.new_value : ''} open placement="top-end" arrow size="small">
                        <TextField defaultValue={personal.radStreet || ''} focused inputRef={radStreet} disabled={toUpdate ? false : true} fullWidth label='Street' size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.radStreet ? handleOpenModal(toCompare.radStreet, personal.id, radStreet) : null} sx={{ bgcolor: toCompare.radStreet ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                    <Tooltip title={toCompare.radUnit ? toCompare.radUnit.new_value : ''} open placement="top-end" arrow >
                        <TextField defaultValue={personal.radUnit || ''} focused inputRef={radUnit} disabled={toUpdate ? false : true} fullWidth label='House/Block No.' size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.radUnit ? handleOpenModal(toCompare.radUnit, personal.id, radUnit) : null} sx={{ bgcolor: toCompare.radUnit ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                    <Tooltip title={toCompare.radZip ? toCompare.radZip.new_value : ''} open placement="top-end" arrow >
                        <TextField defaultValue={personal.radZip || ''} focused inputRef={radZip} disabled={toUpdate ? false : true} fullWidth label='Zipcode' type="number" size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.radZip ? handleOpenModal(toCompare.radZip, personal.id, radZip) : null} sx={{ bgcolor: toCompare.radZip ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {toUpdate ? (<FormControlLabel control={<Checkbox checked={sameAddress} />} onChange={() => setSameAddress(prev => !prev)} label="Same as residential address" />) : ''}
                </Box>
            </Box>
            {/* ------------------------------------------------------------------------------ permanent */}
            {matches ? (<hr />) : null}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 5 }}>
                <Box sx={{ display: 'flex', flex: 1 }}>
                    <Typography variant='body1' sx={{ color: 'warning.main',border:`1px dashed ${orange[800]}`,p:.5 }} align="center" gutterBottom>PERMANENT ADDRESS</Typography>
                </Box>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                    <Button startIcon={<EditIcon />} variant="contained" sx={{borderRadius:'2rem'}} disabled={sameAddress} color={toUpdate2 ? 'error' : 'warning'} onClick={() => setToUpdate2(prev => !prev)}>{toUpdate2 ? 'Cancel' : matches ? 'Update' : 'Update Permanent Address'}</Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: matches ? 5 : 5, mt: matches ? 5 : 5 }}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', gap: matches ? 5 : 2 }}>
                    <Tooltip title={toCompare.padRegion ? toCompare.padRegion.new_value : ''} open placement="top-end" arrow>
                        {toUpdate2 ? (
                            <TextField select value={padRegion} fullWidth label='region' onChange={(e) => setPadRegion(e.target.value)} size="small">
                                <MenuItem value={null}></MenuItem>
                                {regionItemsP && regionItemsP.map((item, i) => (
                                    <MenuItem key={i} value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField value={personal.padRegion || ''} disabled={sameAddress ? true : toUpdate2 ? false : true } fullWidth label='region' size="small" onClick={() => toCompare.padRegion && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.padRegion, personal.id, setPadRegion) : null} sx={{ bgcolor: toCompare.padRegion ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>
                    <Tooltip title={toCompare.padProvince ? toCompare.padProvince.new_value : ''} open placement="top-end" arrow size="small">
                        {toUpdate2 ? (
                            <TextField select value={padProvince} fullWidth label='province' onChange={(e) => setPadProvince(e.target.value)} size="small" >
                                <MenuItem value={null}></MenuItem>
                                {padRegion && provinceItemsP && provinceItemsP.map((item, i) => (
                                    <MenuItem key={i} value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField value={personal.padProvince || ''} disabled={sameAddress ? true : toUpdate2 ? false : true } fullWidth label='province' size="small" onClick={() => toCompare.padProvince && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.padProvince, personal.id, setPadProvince) : null} sx={{ bgcolor: toCompare.padProvince ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>
                    <Tooltip title={toCompare.padCity ? toCompare.padCity.new_value : ''} open placement="top-end" arrow >
                        {toUpdate2 ? (
                            <TextField select value={padCity} fullWidth label='City' onChange={(e) => setPadCity(e.target.value)} size="small">
                                <MenuItem value={null}></MenuItem>
                                {padProvince && cityItemsP && cityItemsP.map((item, i) => (
                                    <MenuItem key={i} value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField value={personal.padCity || ''} disabled={sameAddress ? true : toUpdate2 ? false : true } fullWidth label='City' size="small" onClick={() => toCompare.padCity && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.padCity, personal.id, setPadCity) : null} sx={{ bgcolor: toCompare.padCity ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>
                    <Tooltip title={toCompare.padBrgy ? toCompare.padBrgy.new_value : ''} open placement="top-end" arrow >
                        {toUpdate2 ? (
                            <TextField select value={padBrgy} fullWidth label='barangay' onChange={(e) => setPadBrgy(e.target.value)} size="small">
                                <MenuItem value={null}></MenuItem>
                                {padCity && barItemsP && barItemsP.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField value={personal.padBrgy || ''} disabled={sameAddress ? true : toUpdate2 ? false : true } fullWidth label='barangay' size="small" onClick={() => toCompare.padBrgy && localStorage.getItem('hris_roles') === '1' && pdsParam ? handleOpenModal(toCompare.padBrgy, personal.id, setPadBrgy) : null} sx={{ bgcolor: toCompare.padBrgy ? '#ffcf4a' : 'null' }} />
                        )}
                    </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', gap: matches ? 5 : 2 }}>
                    <Tooltip title={toCompare.padVillage ? toCompare.padVillage.new_value : ''} open placement="top-end" arrow>
                        <TextField defaultValue={personal.padVillage || ''} focused inputRef={padVillage} disabled={toUpdate2 ? false : true} fullWidth label='Subdivision/Village' size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.padVillage ? handleOpenModal(toCompare.padVillage, personal.id, padVillage) : null} sx={{ bgcolor: toCompare.padVillage ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                    <Tooltip title={toCompare.padStreet ? toCompare.padStreet.new_value : ''} open placement="top-end" arrow size="small">
                        <TextField defaultValue={personal.padStreet || ''} focused inputRef={padStreet} disabled={toUpdate2 ? false : true} fullWidth label='Street' size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.padStreet ? handleOpenModal(toCompare.padStreet, personal.id, padStreet) : null} sx={{ bgcolor: toCompare.padStreet ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                    <Tooltip title={toCompare.padUnit ? toCompare.padUnit.new_value : ''} open placement="top-end" arrow >
                        <TextField defaultValue={personal.padUnit || ''} focused inputRef={padUnit} disabled={toUpdate2 ? false : true} fullWidth label='House/Block No.' size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.padUnit ? handleOpenModal(toCompare.padUnit, personal.id, padUnit) : null} sx={{ bgcolor: toCompare.padUnit ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                    <Tooltip title={toCompare.padZip ? toCompare.padZip.new_value : ''} open placement="top-end" arrow >
                        <TextField defaultValue={personal.padZip || ''} focused inputRef={padZip} disabled={toUpdate2 ? false : true} fullWidth label='Zipcode' type="number" size="small" onClick={() => pdsParam && localStorage.getItem('hris_roles') === '1' && toCompare.padZip ? handleOpenModal(toCompare.padZip, personal.id, padZip) : null} sx={{ bgcolor: toCompare.padZip ? '#ffcf4a' : 'null' }} />
                    </Tooltip>
                </Box>
            </Box>
        </div>
    )
}

export default React.memo(AddressModalReworked)