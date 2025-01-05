import React, { useState, useEffect, useRef } from 'react'
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
import PlantillaPositionSelect from './PlantillaPositionSelect';

import CommonBackdrop from '../../../../common/Backdrop';

import moment from 'moment';
import axios from 'axios'
import { toast } from 'react-toastify';

const UpdatePlantillaCasual = ({ data, setPlantillaCs, handleClose, plantillaCs }) => {
    let currYear = moment().year()
    const currSgRef = useRef(true)
    const proposeSgRef = useRef(true)
    const [plantillaInput, setPlantillaInput] = useState({
        dept_id: data.dept_id,
        curr_authorized_year: data.curr_authorized_year ? data.curr_authorized_year : moment(),
        propose_budget_year: data.propose_budget_year ? data.propose_budget_year : moment().year(currYear + 1),
        sequence: data.sequence,
        position_id: data.position_id,
        date_assumption_position: data.date_assumption_position,
        curr_authorized_sg: data.curr_authorized_sg,
        curr_authorized_step: data.curr_authorized_step,
        curr_authorized_amount: data.curr_authorized_amount,
        propose_budget_sg: data.propose_budget_sg,
        propose_budget_step: data.propose_budget_step,
        propose_budget_amount: data.propose_budget_amount,
    })
    const [sg, setSg] = useState([])
    const [proposeSg, setProposeSg] = useState([])
    const [stepList, setStepList] = useState([])
    const [proposeStepList, setProposeStepList] = useState([])

    const [cbd, setCbd] = useState(false)
    const [plantillaOffices, setPlantillaOffices] = useState([])

    const onChangeInput = (e) => {
        setPlantillaInput(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const submitPlantillaCasual = async (e) => {
        e.preventDefault()
        setCbd(true)
        let upload = {
            plantilla_id: data.plantilla_id,
            curr_authorized_year: plantillaInput.curr_authorized_year ? moment(plantillaInput.curr_authorized_year, "YYYY-MM-DD").format('YYYY-MM-DD') : null,
            propose_budget_year: plantillaInput.propose_budget_year ? moment(plantillaInput.propose_budget_year, "YYYY-MM-DD").format('YYYY-MM-DD') : null,
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
        }
        let res = await axios.post(`/api/recruitment/plantilla-casual/update-plantilla-casual`, upload)
        console.log(res)
        if (res.data.status === 200) {
            upload.position_name = res.data.pos?.position_name
            upload.dept_title = res.data.pos?.dept_title
            let updatedPlantilla = plantillaCs.map((item) => {
                if (item.plantilla_id === upload.plantilla_id) {
                    return upload
                }
                else {
                    return item
                }
            })
            setPlantillaCs(updatedPlantilla)
            handleClose()
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
            if (currSgRef.current)
                currSgRef.current = false
            else {
                setPlantillaInput(prev => ({ ...prev, curr_authorized_step: '' }))
                setPlantillaInput(prev => ({ ...prev, curr_authorized_amount: '' }))
            }

            setStepList(arraySteps)
        }
    }, [data.curr_authorized_sg, plantillaInput.curr_authorized_sg])

    useEffect(() => {
        if (plantillaInput.curr_authorized_step) {
            let filteredSg = sg?.filter((item) => item.sg === plantillaInput.curr_authorized_sg)
            console.log(filteredSg)
            if (filteredSg.length > 0 && filteredSg[0][`step${plantillaInput.curr_authorized_step}`]) {
                setPlantillaInput(prev => ({ ...prev, curr_authorized_amount: filteredSg[0][`step${plantillaInput.curr_authorized_step}`] }))
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
            if (proposeSgRef.current)
                proposeSgRef.current = false
            else {
                setPlantillaInput(prev => ({ ...prev, propose_budget_step: '' }))
                setPlantillaInput(prev => ({ ...prev, propose_budget_amount: '' }))
            }
            setProposeStepList(arraySteps)
        }
    }, [data.propose_budget_sg, plantillaInput.propose_budget_sg])

    useEffect(() => {
        if (plantillaInput.propose_budget_step) {
            let filteredSg = proposeSg?.filter((item) => item.sg === plantillaInput.propose_budget_sg)
            console.log(filteredSg)
            if (filteredSg.length > 0 && filteredSg[0][`step${plantillaInput.propose_budget_step}`]) {
                setPlantillaInput(prev => ({ ...prev, propose_budget_amount: filteredSg[0][`step${plantillaInput.propose_budget_step}`] }))
            }
        }
    }, [plantillaInput.propose_budget_step])

    useEffect(() => {
        fetchOffices()
    }, [])
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
                            renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
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
                    <PlantillaPositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/plantilla/AutoCompletePositions' setTitle={setPlantillaInput} defaultPosition={data.position_name} />
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
                            name='curr_authorized_sg'
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
                            name='curr_authorized_step'
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
                <Box display='flex' justifyContent='flex-end'>
                    <Button type='submit' variant='contained' color='warning' startIcon={<ArrowForward />} sx={{ mt: 2, borderRadius: '2rem' }}>UPDATE</Button>
                </Box>
            </form>
        </Box>
    );
};

export default UpdatePlantillaCasual;