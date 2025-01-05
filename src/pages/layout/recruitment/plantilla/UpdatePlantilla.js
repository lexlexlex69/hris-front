import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AsyncSelect from 'react-select/async';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PlantillaPositionSelect from './PlantillaPositionSelect';

import axios from 'axios'
import { toast } from 'react-toastify'

import ArrowForward from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'


const UpdatePlantilla = ({ plantillaInfo, plantilla, setPlantilla, handleClose }) => {
    // backdrop
    console.log(plantillaInfo)
    const [open, setOpen] = React.useState(false);
    // 

    const [sgList, setSgList] = useState([])
    const [stepList, setStepList] = useState([])
    const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })

    const [inputState, setInputState] = useState({
        position_name: plantillaInfo.position_name,
        id: plantillaInfo.id,
        dept_id: plantillaInfo.dept_id,
        division_id: plantillaInfo.division_id,
        section_id: plantillaInfo.section_id,
        position_id: plantillaInfo.pos_position_id,
        position_code: plantillaInfo.position_code,
        old_item_no: plantillaInfo.old_item_no,
        new_item_no: plantillaInfo.new_item_no,
        sg: plantillaInfo.sg,
        step: plantillaInfo.step,
        employee_id: plantilla.employee_id ? plantilla.employee_id : 0,
        employment_status_code: plantillaInfo.employment_status_code
    })

    const handleChangeInput = (e) => {
        setInputState({ ...inputState, [e.target.name]: e.target.value })
    }
    const [officeList, setOfficeList] = useState([])

    // react select only
    const fetchOffices = async (controller) => {
        let offices = await axios.get(`/api/recruitment/plantilla/getOffices`, {}, { signal: controller.signal })
        if (offices.data.status === 200) {
            setOfficeList(offices.data.dept)
            setSgList(offices.data.curr_sg)
        }
        else if (offices.data.status === 500) {
            toast.error(offices.data.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setOpen(true)
        let submitPlantilla = await axios.post(`/api/recruitment/plantilla/updatePlantilla`, inputState)
        if (submitPlantilla.data.status === 200) {
            toast.success('Plantilla updated.')
            let newPlantilla = plantilla.map(item => item.id === plantillaInfo.id ? {
                ...item,
                position_name: inputState.position_name,
                dept_id: inputState.dept_id,
                division_id: inputState.division_id,
                section_id: inputState.section_id,
                pos_position_id: inputState.position_id,
                position_id: inputState.position_id,
                position_code: submitPlantilla.data.new_position_code,
                old_item_no: inputState.old_item_no,
                new_item_no: inputState.new_item_no,
                sg: inputState.sg,
                step: inputState.step,
                employment_status_code: inputState.employment_status_code
            } : item)
            setPlantilla(newPlantilla)
            handleClose()
        }
        else if (submitPlantilla.data.status === 500) {
            toast.error('Ops! Someting went wrong.')
        }
    }
    // fetch Offices
    useEffect(() => {
        let controller = new AbortController()
        fetchOffices(controller)
        // fetchPosition(controller)
        return () => controller.abort()
    }, [])

    // sg step useEffect
    useEffect(() => {
        if (inputState.sg) {
            let arraySteps = [
                { step: 1, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step1 },
                { step: 2, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step2 },
                { step: 3, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step3 },
                { step: 4, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step4 },
                { step: 5, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step5 },
                { step: 6, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step6 },
                { step: 7, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step7 },
                { step: 8, value: sgList?.find((x) => x.sg === parseInt(inputState.sg))?.step8 },
            ]
            setStepList(arraySteps)
        }
    }, [sgList,inputState.sg])
    return (
        <form onSubmit={handleSubmit}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, width: '39.5vw', background: 'RGBA(59,154,255,0.76)' }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{ flexGrow: 1, p: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    id=""
                    label="Old Item number"
                    fullWidth
                    value={inputState.old_item_no}
                    name='old_item_no'
                    onChange={handleChangeInput}
                />
                <TextField
                    id=""
                    label="New Item number"
                    fullWidth
                    value={inputState.new_item_no}
                    name='new_item_no'
                    onChange={handleChangeInput}
                    required
                />
                <Box sx={{ width: '100%' }}>
                    <PlantillaPositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/plantilla/AutoCompletePositions' setTitle={setInputState} defaultValue={plantillaInfo.pos_position_id} defaultPosition={plantillaInfo.position_name} />
                </Box>
                <FormControl fullWidth>
                    <InputLabel id="office-simple-select-label">Office</InputLabel>
                    <Select
                        labelId="office-simple-select-label"
                        id="office-simple-select"
                        label="Office"
                        value={inputState.dept_id}
                        name='dept_id'
                        defaultValue=''
                        onChange={handleChangeInput}
                        required
                        size='small'
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
                        size='small'
                    >
                        <MenuItem value='RE'>Regular Employee</MenuItem>
                        <MenuItem value='TE'>Temporary</MenuItem>
                        <MenuItem value='PA'></MenuItem>
                        <MenuItem value='CT'>Co-terminos</MenuItem>
                        <MenuItem value='CN'>Contractual</MenuItem>
                        <MenuItem value='CS'>Casual</MenuItem>
                        <MenuItem value='JO'>Job-Order</MenuItem>
                        <MenuItem value='CO'>Co</MenuItem>
                        <MenuItem value='COS'>Contract of Service</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Salary Grade</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Salary Grade"
                        value={inputState.sg}
                        name='sg'
                        onChange={handleChangeInput}
                        required
                        size='small'
                    >
                        {sgList && sgList.map((item) => (
                            <MenuItem key={item.sg} value={item.sg}>{item.sg}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Step</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Step"
                        value={inputState.step}
                        name='step'
                        onChange={handleChangeInput}
                        required
                        size='small'
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="warning" endIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} type='submit'>
                        Update Plantilla
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default React.memo(UpdatePlantilla);