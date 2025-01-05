import React, { useState, useRef, useEffect } from 'react'
import 'animate.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { orange } from '@mui/material/colors';

import { toast } from 'react-toastify'
import axios from 'axios'

import AttachmentIcon from '@mui/icons-material/Attachment';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import CommonBackdrop from '../../../../common/Backdrop';
import MprPositionSelect from './MprPositionSelect';
import MprPlantillaOfficeSelect from './MprPlantillaOfficeSelect';

let mprNumberTimer = null
const AddMpr = ({ handleClose, mpr, setMpr, setTotal }) => {

    const budgetRef = useRef()
    const [mprData, setMprData] = useState({
        casual_plantilla_id: '',
        mpr_no: '',
        dept_id: '',
        div_id: '',
        sect_id: '',
        position_id: '',
        date_requested: '',
        date_needed: '',
        budget: '',
        head_count: '',
        proposed_rate: '',
        employment_status: '',
        employment_status_others: '',
        mpr_justification: '',
        mpr_justification_others: '',
        mpr_details: '',
        mpr_duties: '',
        mpr_qualification: '',
        mpr_justification: '',
        employment_status: '',
    })
    const [mprNumberLoader, setMprNumberLoader] = useState(false)
    const [mprNumberChecker, setMprNumberChecker] = useState('')
    const [mprNumberError, setMprNumberError] = useState('')
    const mprRef = useRef(null)

    const [cbd, setCbd] = useState(false)
    const [mprOfficeList, setMprOfficeList] = useState([])

    // functions
    const mprOnchangeState = (e) => {
        setMprData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const fetchOffices = async () => {
        let controller = new AbortController()
        let res = await axios.get(`/api/recruitment/plantilla/getOffices`, { signal: controller.signal })
        setMprOfficeList(res.data.dept)
    }

    const submitMpr = async (e) => {
        e.preventDefault()
        setCbd(true)
        if (!mprData.budget) {
            toast.warning('provide value to bugdet')
            setCbd(false)
            return
        }
        if (!mprData.employment_status) {
            toast.warning('provide value to status')
            setCbd(false)
            return
        }
        if (!mprData.mpr_justification) {
            toast.warning('provide value to justification')
            setCbd(false)
            return
        }
        if (!mprNumberChecker) {
                mprRef.current.focus()
                setMprData(prev => ({ ...prev, mpr_no: '' }))
                setCbd(false)
                return
        }

        let data = {
            plantilla_casual_id: mprData.casual_plantilla_id,
            mpr_no: mprData.mpr_no,
            dept_id: mprData.dept_id,
            div_id: mprData.div_id,
            sect_id: mprData.sect_id,
            position_id: mprData.position_id,
            date_requested: mprData.date_requested,
            date_needed: mprData.date_needed,
            budget: mprData.budget,
            head_count: mprData.head_count,
            proposed_rate: mprData.proposed_rate,
            employment_status: mprData.employment_status,
            employment_status_others: mprData.employment_status_others,
            status_others: mprData.status_others,
            mpr_justification: mprData.mpr_justification,
            mpr_justification_others: mprData.mpr_justification_others,
            mpr_details: mprData.mpr_details,
            mpr_duties: mprData.mpr_duties,
            mpr_qualification: mprData.mpr_qualification,
            employment_status: mprData.employment_status,
        }
        let res = await axios.post(`/api/recruitment/mpr/add-mpr`, data)
        console.log(res)
        if (res.data.status === 200) {
            let addedMpr = [...mpr]
            addedMpr.unshift({
                mpr_no: mprData.mpr_no,
                dept_id: mprData.dept_id,
                div_id: mprData.div_id,
                sect_id: mprData.sect_id,
                dept_title: res.data.dept,
                position_name: res.data.pos,
                position_id: mprData.position_id,
                date_requested: mprData.date_requested,
                date_needed: mprData.date_needed,
                budget: mprData.budget,
                head_count: mprData.head_count,
                proposed_rate: mprData.proposed_rate,
                employment_status: parseInt(mprData.employment_status),
                status_others: mprData.employment_status_others,
                mpr_justification: parseInt(mprData.mpr_justification),
                mpr_justification_others: mprData.mpr_justification_others,
                mpr_details: mprData.mpr_details,
                mpr_duties: mprData.mpr_duties,
                mpr_qualification: mprData.mpr_qualification,
            })
            setMpr(addedMpr.slice(0, 5))
            setTotal(prev => prev + 1)
            handleClose()
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        setCbd(false)
    }

    const handleCheckMprNumber = async (e) => {
        clearTimeout(mprNumberTimer)
        setMprData(prev => ({...prev, [e.target.name]: e.target.value }))
        setMprNumberLoader(true)
        setMprNumberError('')
        mprNumberTimer = setTimeout(async () => {
            let res = await axios.get(`/api/recruitment/mpr/check-mpr-exist?data=${e.target.value}`)
            if (res.data.status === 200) {
                setMprNumberChecker(true)
                setMprNumberError('')
            }
            else if (res.data.status === 203) {
                setMprNumberChecker(false)
                setMprNumberError(res.data.message)
            }
            else if (res.data.status === 500) {
                setMprNumberChecker(false)
                setMprNumberError(res.data.message)
            }
            setMprNumberLoader(false)
        }, 500)
    }

    useEffect(() => {
        fetchOffices()
    }, [])

    const fetchPlantilla = async () => {
        // setMprData(prev => ({ ...prev, proposed_rate: '', position_id: '' }))
        let res = await axios.post(`/api/recruitment/plantilla-casual/search-plantilla-casual`, { plantilla_id: mprData.casual_plantilla_id })
        console.log(res)
        setMprData(prev => ({ ...prev, proposed_rate: res.data.propose_budget_amount }))
    }

    // mpr position side effect when employment status === 1
    const firstRenderPosition = useRef(true) // dont run useEffect when first render
    useEffect(() => {
        if (firstRenderPosition.current) {
            firstRenderPosition.current = false
        }
        else {
            if (mprData.position_id && mprData.employment_status === '1') {
                fetchPlantilla()
            }
        }

    }, [mprData.position_id])

    const firstRenderEmploymentStatus = useRef(true)  // dont run useEffect when first render
    useEffect(() => {
        if (firstRenderEmploymentStatus.current) {
            firstRenderEmploymentStatus.current = false
        }
        else {
            if (mprData.employment_status !== '1') {
                setMprData(prev => ({ ...prev, proposed_rate: '', dept_id: '', position_id: '', casual_plantilla_id: '' }))
            }
        }

    }, [mprData.employment_status])


    return (
        <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', bottom: 0, right: 0, height: '100%', width: '100%' }}>
                <CommonBackdrop open={cbd} title="processing request, please wait . . ." />
            </Box>
            <form onSubmit={submitMpr}>
                <Box sx={{ position: 'relative', width: '100%', p: 2 }}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Mpr number</InputLabel>
                        <OutlinedInput
                        inputRef={mprRef}
                            error={mprNumberError ? true : false}
                            name='mpr_no'
                            value={mprData.mpr_no}
                            required
                            onChange={handleCheckMprNumber}
                            id="outlined-adornment-password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                    >
                                        {mprNumberLoader ? < CircularProgress size={30} /> : mprNumberChecker === true ? <CheckIcon /> : mprNumberChecker === false ? '' : ''}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Mpr number"
                        />
                        {mprNumberError && <FormHelperText>
                            <Typography variant="body2" color="error">
                                {mprNumberError}
                            </Typography>
                        </FormHelperText>}

                    </FormControl>

                    <Box display='flex' gap={1} mt={2}>
                        <TextField required type='date' label="Date requested" name='date_requested' value={mprData.date_requested} onChange={mprOnchangeState} focused fullWidth></TextField>
                        <TextField required type='date' label="Date needed" name='date_needed' value={mprData.date_needed} onChange={mprOnchangeState} focused fullWidth></TextField>
                    </Box>
                    <Box display='flex' gap={1} mt={2}>
                        <FormControl fullWidth sx={{ border: !mprData.budget ? `2px solid ${orange[500]}` : '', p: 1, borderRadius: 1 }}>
                            <FormLabel id="budget-row-radio-buttons-group-label">BUDGET</FormLabel>
                            <RadioGroup
                                row
                                ref={budgetRef}
                                aria-labelledby="budget-row-radio-buttons-group-label"
                                name="budget"
                                value={mprData.budget}
                                onChange={mprOnchangeState}
                            >
                                <FormControlLabel value={1} control={<Radio />} label="Budgeted" />
                                <FormControlLabel value={0} control={<Radio />} label="Unbudgeted" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Box display='flex' gap={1} mt={2}>
                        <FormControl sx={{ border: !mprData.employment_status ? `2px solid ${orange[500]}` : '', p: 1, borderRadius: 1 }} fullWidth>
                            <FormLabel id="budget-row-radio-buttons-group-label">STATUS</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="budget-row-radio-buttons-group-label"
                                name="employment_status"
                                value={mprData.employment_status}
                                onChange={mprOnchangeState}
                            >
                                <FormControlLabel value={1} required control={<Radio />} label="Casual" />
                                <FormControlLabel value={2} control={<Radio />} label="Job Order" />
                                <FormControlLabel value={3} control={<Radio />} label="COS" />
                                <FormControlLabel value={4} control={<Radio />} label="Others" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    {mprData.employment_status !== '1' &&
                        <TextField required sx={{ mt: 2 }} label="Requesting Office / Division" fullWidth name='dept_id'
                            select
                            defaultValue=' '
                            value={mprData.dept_id}
                            onChange={mprOnchangeState}>
                            {mprOfficeList.length > 0 && mprOfficeList.map((item, i) => (
                                <MenuItem key={i} value={item?.dept_code}>
                                    {item?.dept_title}
                                </MenuItem>
                            ))}
                        </TextField>
                    }

                    {mprData.employment_status === '4' && <TextField label="specify" InputProps={{ sx: { border: `1px solid ${orange[500]}`, '&:hover': { border: `1px solid ${orange[500]}` } } }} value={mprData.employment_status_others} name='employment_status_others' onChange={mprOnchangeState} fullWidth></TextField>}
                    {mprData.employment_status === '1' &&
                        <>
                            <Box mt={2}>
                                <MprPlantillaOfficeSelect componentTitle='PLANTILLA CASUAL REFERENCE OFFICE NAME' optionTitle='dept_title' field_id='dept_id' field_name='dept_title' url='/api/recruitment/mpr/auto-complete-plantilla-casual-office' setTitle={setMprData} />
                            </Box>
                            {mprData.dept_id &&
                                <Box mt={2}>
                                    <MprPositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/mpr/auto-complete-positions-department' postData={mprData.dept_id} postDataField='dept_id' setTitle={setMprData} />
                                </Box>
                            }

                        </>
                    }
                    {mprData.employment_status !== '1' &&
                        <Box mt={2}>
                            <MprPositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/plantilla/AutoCompletePositions' setTitle={setMprData} />
                        </Box>
                    }

                    <Box display='flex' gap={1} mt={2}>
                        <TextField
                            id=""
                            fullWidth
                            required
                            name='head_count'
                            value={mprData.head_count}
                            onChange={mprOnchangeState}
                            label="Head count"

                        />
                        <TextField
                            id=""
                            fullWidth
                            required
                            name='proposed_rate'
                            value={mprData.proposed_rate}
                            onChange={mprOnchangeState}
                            label="Proposed rate (monthly)"

                        />
                    </Box>
                    <Box display='flex' gap={1} mt={2}>
                        <FormControl sx={{ border: !mprData.mpr_justification ? `2px solid ${orange[500]}` : '', p: 1, borderRadius: 1, width: '100%' }}>
                            <FormLabel id="mpr_justification-row-radio-buttons-group-label">Justification</FormLabel>
                            <Typography variant="body1" fontSize={'10px'} sx={{ color: 'warning.main' }}>( please attach necessary supporting documents per guidelines )</Typography>
                            <Button variant="contained" component="label" startIcon={<AttachmentIcon />}>
                                Upload attachment
                                <input hidden accept="image/*" multiple type="file" />
                            </Button>
                            <RadioGroup
                                row
                                aria-labelledby="mpr_justification-row-radio-buttons-group-label"
                                name="mpr_justification"
                                value={mprData.mpr_justification}
                                onChange={mprOnchangeState}
                            >
                                <FormControlLabel value={1} componentsProps={{
                                    typography: {
                                        fontSize: '12px'
                                    }
                                }} sx={{ fontSize: '10px' }} control={<Radio />} label="New Position" />
                                <FormControlLabel componentsProps={{
                                    typography: {
                                        fontSize: '12px'
                                    }
                                }} value={2} control={<Radio />} label="Additional HC" />
                                <FormControlLabel componentsProps={{
                                    typography: {
                                        fontSize: '12px'
                                    }
                                }} value={3} control={<Radio />} label="Replacement" />
                                <FormControlLabel componentsProps={{
                                    typography: {
                                        fontSize: '12px'
                                    }
                                }} value={4} control={<Radio />} label="Upgrade" />
                                <FormControlLabel componentsProps={{
                                    typography: {
                                        fontSize: '12px'
                                    }
                                }} value={5} control={<Radio />} label="Others" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    {mprData.mpr_justification === '5' && <TextField label="SPECIFY" InputProps={{ sx: { border: `1px solid ${orange[500]}`, '&:hover': { border: `1px solid ${orange[500]}` } } }} value={mprData.mpr_justification_others} name='mpr_justification_others' onChange={mprOnchangeState} fullWidth></TextField>}
                    <TextField required multiline name='mpr_details' value={mprData.mpr_details} onChange={mprOnchangeState} label="DETAILS" rows={3} sx={{ mt: 2 }} fullWidth />
                    <TextField required multiline name='mpr_duties' value={mprData.mpr_duties} onChange={mprOnchangeState} label="DUTIES AND RESPONSIBILITIES" rows={3} sx={{ mt: 2 }} fullWidth />
                    <TextField required multiline name='mpr_qualification' value={mprData.mpr_qualification} onChange={mprOnchangeState} label="QUALIFICATIONS" rows={3} sx={{ mt: 2 }} fullWidth />
                    <Box display='flex' justifyContent='flex-end'>
                        <Button sx={{ mt: 2, borderRadius: '2rem' }} type='submit' variant='contained' startIcon={<ArrowForward />}>Submit</Button>
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

export default AddMpr;