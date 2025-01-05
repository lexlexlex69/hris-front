import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ArrowForward from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import moment from 'moment';
import axios from 'axios'
import { toast } from 'react-toastify';

import CommonBackdrop from '../../../../common/Backdrop';
import PlantillaPositionSelect from './PlantillaPositionSelect';

const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })


const AddPlantillaCasual = ({ setPlantillaCs, handleCloseAdd }) => {
    const currYear = moment().year()
    const [plantillaInput, setPlantillaInput] = useState({
        dept_id: '',
        curr_authorized_year: moment(),
        propose_budget_year: moment().year(currYear + 1),
        sequence: '',
        position_id: '',
        date_assumption_position: '',
        curr_authorized_sg: '',
        curr_authorized_step: '',
        curr_authorized_amount: '',
        propose_budget_sg: '',
        propose_budget_step: '',
        propose_budget_amount: '',
        revise_budget_year: '',
        revise_budget_sg: '',
        revise_budget_amount: '',
        revise_budget_step: '',
    })

    const [sg, setSg] = useState([])
    const [proposeSg, setProposeSg] = useState([])
    const [reviseSg, setReviseSg] = useState([])
    const [stepList, setStepList] = useState([])
    const [proposeStepList, setProposeStepList] = useState([])
    const [reviseStepList, setReviseStepList] = useState([])

    const [cbd, setCbd] = useState(false)
    const [plantillaOffices, setPlantillaOffices] = useState([])

    const onChangeInput = (e) => {
        setPlantillaInput(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const submitPlantillaCasual = async (e) => {
        e.preventDefault()
        setCbd(true)
        let data = {
            curr_authorized_year: plantillaInput.curr_authorized_year ? moment(plantillaInput.curr_authorized_year, "YYYY-MM-DD").format('YYYY-MM-DD') : null,
            propose_budget_year: plantillaInput.propose_budget_year ? moment(plantillaInput.propose_budget_year, "YYYY-MM-DD").format('YYYY-MM-DD') : null,
            revise_budget_year: plantillaInput.revise_budget_year ? moment(plantillaInput.revise_budget_year, "YYYY-MM-DD").format('YYYY-MM-DD') : null,
            sequence: plantillaInput.sequence,
            dept_id: plantillaInput.dept_id,
            position_id: plantillaInput.position_id,
            date_assumption_position: plantillaInput.date_assumption_position,
            curr_authorized_sg: plantillaInput.curr_authorized_sg,
            curr_authorized_step: plantillaInput.curr_authorized_step,
            curr_authorized_amount: plantillaInput.curr_authorized_amount,
            propose_budget_sg: plantillaInput.propose_budget_sg,
            propose_budget_step: plantillaInput.propose_budget_step,
            propose_budget_amount: plantillaInput.propose_budget_amount,
            revise_budget_sg: plantillaInput.revise_budget_sg,
            revise_budget_step: plantillaInput.revise_budget_step,
            revise_budget_amount: plantillaInput.revise_budget_amount,
        }
        let res = await axios.post(`/api/recruitment/plantilla-casual/add-plantilla-casual`, data)
        console.log(res)
        if (res.data.status === 200) {
            data.position_name = res.data.pos?.position_name
            data.dept_title = res.data.pos?.dept_title
            setPlantillaCs(prev => [data, ...prev])
            handleCloseAdd()
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        setCbd(false)
    }

    const fetchOffices = async () => { // fetch offices and salary grades
        let controller = new AbortController()
        let offices = await axios.get(`/api/recruitment/plantilla/getOffices`, {}, { signal: controller.signal })
        console.log(offices)
        if (offices.data.status === 200) {
            setPlantillaOffices(offices.data.dept)
            setSg(offices.data.curr_sg)
            setProposeSg(offices.data.curr_sg)
            setReviseSg(offices.data.curr_sg)
        }
    }

    // current
    // if sg is selected load the steps and amount
    useEffect(() => {
        if (plantillaInput.curr_authorized_sg) {
            let arraySteps = [
                { step: 1, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step1 },
                { step: 2, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step2 },
                { step: 3, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step3 },
                { step: 4, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step4 },
                { step: 5, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step5 },
                { step: 6, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step6 },
                { step: 7, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step7 },
                { step: 8, value: sg?.find((x) => x.sg === parseInt(plantillaInput.curr_authorized_sg))?.step8 },
            ]
            setStepList(arraySteps)
        }
    }, [plantillaInput.curr_authorized_sg])

    useEffect(() => {
        if (plantillaInput.curr_authorized_step) {
            let filteredSg = sg?.filter((item) => item.sg === plantillaInput.curr_authorized_sg)
            console.log(filteredSg)
            if (filteredSg.length > 0 && filteredSg[0][`step${plantillaInput.curr_authorized_step}`]) {
                setPlantillaInput(prev => ({ ...prev, curr_authorized_amount: filteredSg[0][`step${plantillaInput.curr_authorized_step}`] }))
            }
            else {
                toast.warning('Selected step doesnt exist!')
            }
        }
    }, [plantillaInput.curr_authorized_step])

    // propose
    // if sg is selected load the steps and amount
    useEffect(() => {
        if (plantillaInput.propose_budget_sg) {
            let arraySteps = [
                { step: 1, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step1 },
                { step: 2, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step2 },
                { step: 3, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step3 },
                { step: 4, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step4 },
                { step: 5, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step5 },
                { step: 6, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step6 },
                { step: 7, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step7 },
                { step: 8, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.propose_budget_sg))?.step8 },
            ]
            setProposeStepList(arraySteps)
        }
    }, [plantillaInput.propose_budget_sg])


    useEffect(() => {
        if (plantillaInput.propose_budget_step) {
            let filteredSg = proposeSg?.filter((item) => item.sg === plantillaInput.propose_budget_sg)
            console.log(filteredSg)
            if (filteredSg.length > 0 && filteredSg[0][`step${plantillaInput.propose_budget_step}`]) {
                setPlantillaInput(prev => ({ ...prev, propose_budget_amount: filteredSg[0][`step${plantillaInput.propose_budget_step}`] }))
            }
            else {
                toast.warning('Selected step doesnt exist!')
            }
        }
    }, [plantillaInput.propose_budget_step])

    
    useEffect(() => {
        if (plantillaInput.revise_budget_sg) {
            let arraySteps = [
                { step: 1, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step1 },
                { step: 2, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step2 },
                { step: 3, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step3 },
                { step: 4, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step4 },
                { step: 5, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step5 },
                { step: 6, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step6 },
                { step: 7, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step7 },
                { step: 8, value: proposeSg?.find((x) => x.sg === parseInt(plantillaInput.revise_budget_sg))?.step8 },
            ]
            setReviseStepList(arraySteps)
        }
    }, [plantillaInput.revise_budget_sg])

    
    useEffect(() => {
        if (plantillaInput.revise_budget_step) {
            let filteredSg = reviseSg?.filter((item) => item.sg === plantillaInput.revise_budget_sg)
            console.log(filteredSg)
            if (filteredSg.length > 0 && filteredSg[0][`step${plantillaInput.revise_budget_step}`]) {
                setPlantillaInput(prev => ({ ...prev, revise_budget_amount: filteredSg[0][`step${plantillaInput.revise_budget_step}`] }))
            }
            else {
                toast.warning('Selected step doesnt exist!')
            }
        }
    }, [plantillaInput.revise_budget_step])

    useEffect(() => {
        fetchOffices()
    }, [])

    // interchange between propose and revise inputs when adding plantilla casual
    useEffect(() => {
        if (plantillaInput.revise_budget_year) {
            setPlantillaInput(prev => ({ ...prev, propose_budget_year: null }))
        }
    }, [plantillaInput.revise_budget_year])
    useEffect(() => {
        if (plantillaInput.propose_budget_year) {
            setPlantillaInput(prev => ({ ...prev, revise_budget_year: null }))
        }
    }, [plantillaInput.propose_budget_year])
    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <CommonBackdrop open={cbd} title='Processing request . . .' />
            <form onSubmit={submitPlantillaCasual}>
                <Box display='flex' gap={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            views={['year']}
                            label="CURRENT AUTHORIZED YEAR"
                            value={plantillaInput.curr_authorized_year}
                            onChange={(newValue) => {
                                setPlantillaInput(prev => ({ ...prev, curr_authorized_year: newValue }))
                            }}
                            renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                        />
                        <DatePicker
                            views={['year']}
                            label="PROPOSED BUDGET YEAR"
                            value={plantillaInput.propose_budget_year}
                            onChange={(newValue) => {
                                setPlantillaInput(prev => ({ ...prev, propose_budget_year: newValue }))
                            }}
                            renderInput={(params) => <TextField required={!plantillaInput.propose_budget_year && !plantillaInput.revise_budget_year ? true : false} fullWidth {...params} helperText={null} />}
                        />
                        <DatePicker
                            views={['year']}
                            label="REVISE BUDGET YEAR"
                            value={plantillaInput.revise_budget_year}
                            onChange={(newValue) => {
                                setPlantillaInput(prev => ({ ...prev, revise_budget_year: newValue }))
                            }}
                            renderInput={(params) => <TextField required={!plantillaInput.propose_budget_year && !plantillaInput.revise_budget_year ? true : false} fullWidth {...params} helperText={null} />}
                        />
                    </LocalizationProvider>
                </Box>
                <TextField label="SEQUENCE" name='sequence' value={plantillaInput.sequence} onChange={onChangeInput} fullWidth sx={{ mt: 2 }} />
                <TextField required sx={{ mt: 2 }} label="OFFICE" fullWidth name='dept_id'
                    select
                    defaultValue=' '
                    value={plantillaInput.dept_id}
                    onChange={onChangeInput}>
                    {plantillaOffices.length > 0 && plantillaOffices.map((item, i) => (
                        <MenuItem key={i} value={item?.dept_code}>
                            {item?.dept_title}
                        </MenuItem>
                    ))}
                </TextField>
                <Box sx={{ mt: 2 }}>
                    <PlantillaPositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/plantilla/AutoCompletePositions' setTitle={setPlantillaInput} />
                </Box>
                <TextField label="DATE ASSUMPTION TO PRESENT POSITION" focused type='date' sx={{ mt: 2 }} name='date_assumption_position' value={plantillaInput.date_assumption_position} onChange={onChangeInput} fullWidth />
                <Box display='flex' gap={1}>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="demo-simple-select-label">Current Authorized Salary Grade</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Current Authorized Salary Grade"
                            value={plantillaInput.curr_authorized_sg}
                            name='employment_status_code'
                            onChange={(e) => setPlantillaInput(prev => ({ ...prev, curr_authorized_sg: e.target.value }))}
                            required
                        >
                            {sg && sg.map((item) => (
                                <MenuItem value={item.sg}>{item.sg}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="demo-simple-select-label">Current Authorized Step</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Current Authorized Step"
                            value={plantillaInput.curr_authorized_step}
                            name='curr_authorized_step'
                            onChange={(e) => setPlantillaInput(prev => ({ ...prev, curr_authorized_step: e.target.value }))}
                            required
                        >
                            {stepList && stepList.map((item, index) => (
                                <MenuItem key={index} value={item.step}>
                                    <Box display='flex' justifyContent="space-between">
                                        <Typography variant="body1" color="initial">Step {item.step}</Typography>
                                    </Box>

                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <TextField label="CURRENT AUTHORIZED RATE AMOUNT" sx={{ mt: 2 }} name='curr_authorized_amount' value={plantillaInput.curr_authorized_amount} onChange={onChangeInput} fullWidth />
                {plantillaInput.propose_budget_year ? (
                    <>
                        <Box display='flex' gap={1}>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="demo-simple-select-label">Propose Salary Grade</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Propose Salary Grade"
                                    value={plantillaInput.propose_budget_sg}
                                    name='employment_status_code'
                                    onChange={(e) => setPlantillaInput(prev => ({ ...prev, propose_budget_sg: e.target.value }))}
                                    required
                                >
                                    {proposeSg && proposeSg.map((item) => (
                                        <MenuItem value={item.sg}>{item.sg}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="demo-simple-select-label">Propose Step</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Propose Step"
                                    value={plantillaInput.propose_budget_step}
                                    name='propose_budget_step'
                                    onChange={(e) => setPlantillaInput(prev => ({ ...prev, propose_budget_step: e.target.value }))}
                                    required
                                >
                                    {proposeStepList && proposeStepList.map((item, index) => (
                                        <MenuItem key={index} value={item.step}>
                                            <Box display='flex' justifyContent="space-between">
                                                <Typography variant="body1" color="initial">Step {item.step}</Typography>
                                            </Box>

                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <TextField label="PROPOSED RATE AMOUNT" sx={{ mt: 2 }} name='propose_budget_amount' value={plantillaInput.propose_budget_amount} onChange={onChangeInput} fullWidth />
                    </>
                ) : ''}

                {plantillaInput.revise_budget_year ? (<>

                    <Box display='flex' gap={1}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="demo-simple-select-label">Revise Salary Grade</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Propose Salary Grade"
                                value={plantillaInput.revise_budget_sg}
                                name='revise_budget_sg'
                                onChange={(e) => setPlantillaInput(prev => ({ ...prev, revise_budget_sg: e.target.value }))}
                                required
                            >
                                {reviseSg && reviseSg.map((item) => (
                                    <MenuItem value={item.sg}>{item.sg}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="demo-simple-select-label">Revise Step</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Propose Step"
                                value={plantillaInput.revise_budget_step}
                                name='revise_budget_step'
                                onChange={(e) => setPlantillaInput(prev => ({ ...prev, revise_budget_step: e.target.value }))}
                                required
                            >
                                {reviseStepList && reviseStepList.map((item, index) => (
                                    <MenuItem key={index} value={item.step}>
                                        <Box display='flex' justifyContent="space-between">
                                            <Typography variant="body1" color="initial">Step {item.step}</Typography>
                                        </Box>

                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField label="REVISE BUDGET AMOUNT" sx={{ mt: 2 }} name='revise_budget_amount' value={plantillaInput.revise_budget_amount} onChange={onChangeInput} fullWidth />
                </>) : ''}

                <Box display='flex' justifyContent='flex-end'>
                    <Button type='submit' variant='contained' startIcon={<ArrowForward />} sx={{ mt: 2, borderRadius: '2rem' }}>SUBMIT</Button>
                </Box>
            </form>
        </Box>
    );
};

export default AddPlantillaCasual;