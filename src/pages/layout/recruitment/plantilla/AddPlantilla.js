import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AsyncSelect from 'react-select/async';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import ArrowForward from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'

import axios from 'axios'
import { toast } from 'react-toastify'

import PlantillaPositionSelect from './PlantillaPositionSelect';

let itemTimeout = null
const AddPlantilla = ({ plantilla, setPlantilla, handleClose }) => {

    // backdrop
    const [open, setOpen] = React.useState(false);
    const handleCloseBD = () => {
        setOpen(false);
    };
    // 
    const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })
    const reactSelectRef = useRef(null)
    const [inputState, setInputState] = useState({
        dept_id: '',
        division_id: 0,
        section_id: 0,
        position_id: '',
        old_item_no: '',
        new_item_no: '',
        remarks: '',
        // sg: '',
        step: 0,
        employment_status_code: 'RE'
    })

    const [itemNumberChecker, setItemNumberChecker] = useState('')
    const [itemNumberLoader, setItemNumberLoader] = useState(false)
    const [itemNumberError, setItemNumberError] = useState('')

    const [sg, setSg] = useState('')
    const [selectedSg, setSelectedSg] = useState('')
    const [step, setStep] = useState('')
    const [stepList, setStepList] = useState([])

    const handleChangeInput = (e) => {
        setInputState({ ...inputState, [e.target.name]: e.target.value })
    }
    const handleChangeItemNo = async (e) => {
        clearTimeout(itemTimeout)
        setItemNumberLoader(true)
        setItemNumberError('')
        itemTimeout = setTimeout(async () => {
            let res = await axios.post(`/api/recruitment/plantilla/itemNumberChecker`, { data: e.target.value })
            setItemNumberLoader(false)
            if (res.data.status === 203) {
                setItemNumberError(res.data.message)
                setItemNumberChecker(false)
            }
            else if (res.data.status === 200) {
                setItemNumberError('')
                setItemNumberChecker(true)
            }
            else if (res.data.status === 500) {
                setItemNumberError(res.data.message)
                setItemNumberChecker(false)
            }
        }, 500)
        setItemNumberChecker('')
        setInputState(prev => ({ ...prev, new_item_no: e.target.value }))
    }
    const [officeList, setOfficeList] = useState([])

    const fetchOffices = async (controller) => {
        let offices = await axios.get(`/api/recruitment/plantilla/getOffices`, {}, { signal: controller.signal })
        if (offices.data.status === 200) {
            setOfficeList(offices.data.dept)
            setSg(offices.data.curr_sg)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!itemNumberChecker) {
            toast.warning('Item number taken!')
            return
        }
        setOpen(true)
        inputState.sg = selectedSg
        inputState.step = step

        let submitPlantilla = await axios.post(`/api/recruitment/plantilla/addPlantilla`, inputState)
        if (submitPlantilla.data.status === 200) {
            toast.success('Plantilla saved.')
            handleClose()
            // setOpen(true)
            let newPlantilla = plantilla
            newPlantilla.unshift({
                id: submitPlantilla.data.plantilla_inserted?.id,
                dept_id: submitPlantilla.data.plantilla_inserted?.dept_id,
                dept_title: submitPlantilla.data.plantilla_inserted?.dept_title,
                division_id: submitPlantilla.data.plantilla_inserted?.division_id,
                section_id: submitPlantilla.data.plantilla_inserted?.section_id,
                position_id: submitPlantilla.data.plantilla_inserted?.position_id,
                old_item_no: submitPlantilla.data.plantilla_inserted?.old_item_no,
                position_name: submitPlantilla.data.plantilla_inserted?.position_name,
                remarks: submitPlantilla.data.plantilla_inserted?.remarks,
                new_item_no: submitPlantilla.data.plantilla_inserted?.new_item_no,
                sg: submitPlantilla.data.plantilla_inserted?.sg,
                step: submitPlantilla.data.plantilla_inserted?.step,
                employment_status_code: submitPlantilla.data.plantilla_inserted?.employment_status_code,
            })
            newPlantilla = newPlantilla.slice(0, 10)
            setPlantilla(newPlantilla)
        }
    }
    // fetch Offices
    useEffect(() => {
        let controller = new AbortController()
        fetchOffices(controller)
        return () => controller.abort()
    }, [])

    useEffect(() => {
        if (selectedSg) {
            let arraySteps = [
                { step: 1, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step1 },
                { step: 2, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step2 },
                { step: 3, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step3 },
                { step: 4, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step4 },
                { step: 5, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step5 },
                { step: 6, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step6 },
                { step: 7, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step7 },
                { step: 8, value: sg?.find((x) => x.sg === parseInt(selectedSg))?.step8 },
            ]

            setStepList(arraySteps)
        }
    }, [selectedSg])
    return (
        <form onSubmit={handleSubmit}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, width: '39.5vw', background: 'RGBA(59,154,255,0.76)' }}
                open={open}
            // onClick={handleCloseBD}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{ flexGrow: 1, p: 2, py: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    id=""
                    label="Old Item number"
                    fullWidth
                    value={inputState.old_item_no}
                    name='old_item_no'
                    onChange={handleChangeInput}
                />
                <FormControl variant="outlined" fullWidth

                >
                    <InputLabel htmlFor="outlined-adornment-password">New item number</InputLabel>
                    <OutlinedInput
                        error={itemNumberError ? true : false}
                        onChange={handleChangeItemNo}
                        id="outlined-adornment-password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                >
                                    {itemNumberLoader ? < CircularProgress size={30} /> : itemNumberChecker === true ? <CheckIcon /> : itemNumberChecker === false ? <CloseIcon /> : ''}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="New item number"
                    />
                    {itemNumberError && <FormHelperText>
                        <Typography variant="body2" color="error">
                            {itemNumberError}
                        </Typography>
                    </FormHelperText>}

                </FormControl>
                <Box sx={{ width: '100%' }}>
                    <PlantillaPositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/plantilla/AutoCompletePositions' setTitle={setInputState} />
                    {/* <AsyncSelect
                        ref={reactSelectRef}
                        placeholder="Position Title"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        cacheOptions
                        value={titleState}
                        loadOptions={loadOptions}
                        defaultOptions={false}
                        onInputChange={handleInputChange}
                        onChange={SeletedOption}
                    /> */}
                </Box>
                <FormControl fullWidth>
                    <InputLabel id="office-simple-select-label">Office</InputLabel>
                    <Select
                        labelId="office-simple-select-label"
                        id="office-simple-select"
                        label="Office"
                        value={inputState.dept_id}
                        name='dept_id'
                        onChange={handleChangeInput}
                        required
                    >
                        {officeList && officeList.map(item => (
                            <MenuItem key={item.id} value={item.id}>{item.dept_title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Employment Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Employment Status"
                        value={inputState.employment_status_code}
                        name='employment_status_code'
                        onChange={handleChangeInput}
                        required
                    >
                        <MenuItem value='RE'>PERMANENT</MenuItem>
                        {/* <MenuItem value='TE'>Temporary</MenuItem>
                        <MenuItem value='PA'></MenuItem>
                        <MenuItem value='CT'>Co-terminos</MenuItem>
                        <MenuItem value='CN'>Contractual</MenuItem>
                        <MenuItem value='CS'>Casual</MenuItem>
                        <MenuItem value='JO'>Job-Order</MenuItem>
                        <MenuItem value='CO'>Co</MenuItem>
                        <MenuItem value='COS'>Contract of Service</MenuItem> */}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Salary Grade</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Salary Grade"
                        value={selectedSg}
                        name='employment_status_code'
                        onChange={(e) => setSelectedSg(e.target.value)}
                        required
                    >
                        {sg && sg.map((item) => (
                            <MenuItem value={item.sg}>{item.sg}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Step</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Step"
                        value={step}
                        name='employment_status_code'
                        onChange={(e) => setStep(e.target.value)}
                        required
                    >
                        {stepList && stepList.map((item, index) => (
                            <MenuItem key={index} value={item.step}>
                                <Box display='flex' justifyContent="space-between">
                                    <Typography variant="body1" color="initial" sx={{ bgcolor: 'warning.main', px: 2, borderRadius: '2px', color: '#fff' }}>Step {item.step}</Typography>
                                    <Typography variant="body1" color="initial" sx={{ color: 'error.main', px: 2, borderRadius: '2px' }}>{f.format(item.value)}</Typography>
                                </Box>

                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    id=""
                    label="remarks"
                    fullWidth
                    value={inputState.remarks}
                    name='remarks'
                    onChange={handleChangeInput}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} type='submit'>
                        Submit Plantilla
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default AddPlantilla;