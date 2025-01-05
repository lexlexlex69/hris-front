import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { orange } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import 'animate.css';
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPesoSign } from '@fortawesome/free-solid-svg-icons'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


import axios from 'axios';

// import MprPositionSelect from './MprPositionSelect';
import Skeleton from '@mui/material/Skeleton'
import JobPostingSelect from './JobPostingSelect';
import MprSelect from './MprSelect';
import moment from 'moment'
import Typography from '@mui/material/Typography'





let filterTimeout = null
function AddPosition({ pos, setPos, handleCloseDialog, setMprSubmitTrigger }) {

    // backdrop
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };


    const budgetRef = useRef(null)
    // 
    // plantilla permanent states
    const [validError, setValiderror] = useState({})
    const [inputData, setInputData] = useState({
        plantilla_id: '',
        position_title: '',
        plantilla_no: '',
        sg: '',
        monthly_salary: '',
        posting_date: '',
        closing_date: '',
        education: '',
        training: ' ',
        experience: '',
        eligibility: '',
        competency: '',
        place_of_assignment: '',
        dept_title: '',
        status: '',
        level: '',
        expiry_date: '',
        emp_status: '',
        position_id: '',
    });
    const [loaderInputs, setLoaderInputs] = useState(false)

    const [mprNo, setMprNo] = useState({
        mpr_no: ''
    })

    const empStatusRef = useRef(true)

    // mpr states
    const [mprData, setMprData] = useState({
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
        status_others: '',
        mpr_justification: '',
        mpr_details: '',
        mpr_duties: '',
        mpr_qualification: '',
        mpr_justification: '',
        employment_status: '',
        posting_date: '',
        end_date: ''
    })


    const [mprAutoFill, setMprAutoFill] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // permanent
        if (inputData.emp_status === 'RE') {
            if (!inputData.competency && !inputData.education && !inputData.eligibility && !inputData.experience && !inputData.training && !inputData.level) {
                toast.warning('Please make sure position Qualification standard is filled at Positions module!')
                return
            }
            setOpen(true)
            let res = await axios.post(`/api/recruitment/jobposting/addPositionForPosting`, { data: inputData, category: 'permanent' })
            console.log(res)
            setOpen(false)
            if (res.data.status === 401) {
                setValiderror(res.data.error)
            }
            if (res.data.status === 200) {
                // let newPos = pos.map(x => x)
                // newPos.unshift({
                //     job_vacancies_id: res.data.id,
                //     closing_date: inputData.closing_date,
                //     qs: {
                //         experience: inputData.experience,
                //         eligibility: inputData.eligibility,
                //         competency: inputData.competency,
                //         education: inputData.education,
                //         level: inputData.level,
                //         training: inputData.training,
                //     },
                //     emp_status: inputData.emp_status,
                //     expiry_date: inputData.expiry_date,
                //     is_appointed: 0,
                //     is_hidden: 0,
                //     monthly_salary: inputData.monthly_salary,
                //     mpr_id: null,
                //     dept_title: inputData.dept_title,
                //     plantilla_id: inputData.plantilla_id,
                //     plantilla_item: inputData.plantilla_no,
                //     position_name: inputData.position_title,
                //     posted_by: res.data.posted_by,
                //     posting_date: inputData.posting_date,
                //     remarks: null,
                //     expiry_date: moment(inputData.posting_date).add(9, 'M'),
                //     plantilla_sg: inputData.sg,
                //     vacancy_status: 'PENDING'
                // })
                setMprSubmitTrigger(prev => !prev)
                // setPos(newPos.slice(0, 5))
                handleCloseDialog()
            }
        }
        // mpr
        else if (inputData.emp_status === 'PRF') {
            setOpen(true)
            let tempMprAutoFill = { ...mprAutoFill }
            tempMprAutoFill.posting_date = inputData.posting_date
            tempMprAutoFill.closing_date = inputData.closing_date
            tempMprAutoFill.employment_status = tempMprAutoFill.employment_status === 1 ? 'CS' : tempMprAutoFill.employment_status === 2 ? 'JO' : tempMprAutoFill.employment_status === 3 ? 'COS' : ''
            let res = await axios.post(`/api/recruitment/jobposting/addPositionForPosting`, { data: tempMprAutoFill, category: 'mpr' })
            if (res.data.status === 200) {
                setMprSubmitTrigger(prev => !prev)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            setOpen(false)
            handleCloseDialog()
        }

    }

    const fetchMpr = async (mpr) => {
        console.log(mpr)
        setLoaderInputs(true)
        let res = await axios.post(`/api/recruitment/mpr/search-mpr`, { mpr_no: mpr })
        console.log(res)
        setMprAutoFill(res.data)
        setLoaderInputs(false)
    }

    // emp status didUpdate
    useEffect(() => {
        fetchMpr(mprNo.mpr_no)
    }, [mprNo.mpr_no])


    return (
        <Box sx={{ height: 'calc(100%-66px)', overflowY: 'scroll', p: 2, width: '100%', position: 'relative' }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', background: 'RGBA(59,154,255,0.76)' }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">EMPLOYMENT STATUS</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue=''
                        value={inputData.emp_status}
                        label="EMPLOYMENT STATUS"
                        size='small'
                        onChange={e => setInputData({ ...inputData, emp_status: e.target.value })}
                    >
                        <MenuItem value='RE'>PERMANENT</MenuItem>
                        <MenuItem value='PRF'>PERSONNEL REQUEST FORM</MenuItem>
                    </Select>
                </FormControl>
                {inputData.emp_status === 'RE' ? (
                    <>
                        <JobPostingSelect componentTitle='PLANTILLA NUMBER' size='small' url='/api/recruitment/jobposting/getPlantillaAutocomplete' optionTitle='new_item_no' title={inputData?.plantilla_no} setTitle={setInputData} setLoader={setLoaderInputs} />
                        <Box sx={{ width: '100%' }}>
                            {loaderInputs ?
                                <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                                <TextField fullWidth value={inputData.position_title} label="POSITION TITLE" variant="outlined" size="small" error={validError.position_title ? true : false} />
                            }
                        </Box>

                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.sg} label="SALARY/JOB/PAY GRADE" variant="outlined" size="small" />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.step} label="STEP" variant="outlined" size="small" />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField required fullWidth value={inputData.monthly_salary} label="MONTHLY SALARY" variant="outlined" size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={faPesoSign} /></InputAdornment>,
                                }}
                            />
                        }
                        <Alert severity='info' sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>QUALIFICATION STANDARD</Alert>
                        {(!inputData.competency && !inputData.education && !inputData.eligibility && !inputData.experience && !inputData.training && !inputData.level) &&
                            <Typography variant="body2" color="error">Please fill Qualification Standards at Positions Module!</Typography>}
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.education} disabled label="EDUCATION" variant="outlined" size="small" error={inputData.education ? false : true} helperText={inputData.education ? '' : 'Field is required.'} />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.training} disabled label="TRAINING" variant="outlined" size="small" error={inputData.training ? false : true} helperText={inputData.training ? '' : 'Field is required.'} />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.experience} disabled label="EXPERIENCE" variant="outlined" size="small" error={inputData.experience ? false : true} helperText={inputData.experience ? '' : 'Field is required.'} />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.eligibility} disabled label="ELIGIBILITY" variant="outlined" size="small" error={inputData.eligibility ? false : true} helperText={inputData.eligibility ? '' : 'Field is required.'} />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.competency} disabled label="COMPETENCY" variant="outlined" size="small" error={inputData.competency ? false : true} helperText={inputData.competency ? '' : 'Field is required.'} />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.level} disabled label="LEVEL" variant="outlined" size="small" error={inputData.level ? false : true} helperText={inputData.level ? '' : 'Field is required.'} />
                        }
                        {loaderInputs ?
                            <Skeleton variant="text" width="100%" height={25} animation="pulse" /> :
                            <TextField fullWidth value={inputData.dept_title} label="PLACE OF ASSIGNMENT" variant="outlined" size="small" />
                        }

                        <TextField required fullWidth value={inputData.posting_date} onChange={e => setInputData({ ...inputData, posting_date: e.target.value })} type="date" label="PUBLICATION DATE" focused variant="outlined" size="small" />
                        <TextField required fullWidth value={inputData.closing_date} onChange={e => setInputData({ ...inputData, closing_date: e.target.value })} type="date" label="PUBLICATION END-DATE" focused variant="outlined" size="small" />
                    </>
                ) : inputData.emp_status === 'PRF' ? (
                    <>
                        <MprSelect componentTitle='MPR NO' optionTitle='mpr_no' url='/api/recruitment/mpr/auto-complete' setTitle={setMprNo} />
                        <Typography variant="body1" sx={{ color: 'warning.main' }} fontSize={'12px'} align='center'>AUTO FILL ITEMS BASE ON MPR NUMBER</Typography>
                        {loaderInputs ?
                            <><Skeleton variant='text' width='100%' height={35} /></> :
                            <TextField
                                fullWidth
                                label="REQUESTING OFFICE / DIVISION"
                                focused
                                value={mprAutoFill?.dept_title}
                            />
                        }

                        <Box display='flex' gap={1} width='100%'>
                            {loaderInputs ?
                                <><Skeleton variant='text' width='100%' height={35} /></> :
                                <TextField
                                    fullWidth
                                    label="DATE REQUESTED"
                                    focused
                                    value={moment(mprAutoFill?.date_requested, "MMM-DD-YYYY").format("MMM DD, YYYY")}
                                />
                            }
                            {loaderInputs ?
                                <><Skeleton variant='text' width='100%' height={35} /></> :
                                <TextField
                                    fullWidth
                                    label="DATE NEEDED"
                                    focused
                                    value={moment(mprAutoFill?.date_needed, "MMM-DD-YYYY").format("MMM DD, YYYY")}
                                />
                            }

                        </Box>
                        <Box display='flex' gap={1} width='100%'>
                            {loaderInputs ?
                                <><Skeleton variant='text' width='100%' height={35} /></> :
                                <TextField
                                    fullWidth
                                    label="BUDGET"
                                    focused
                                    value={mprAutoFill?.budget === '1' ? 'Budgeted' : 'Unbudgeted'}
                                />
                            }
                            {loaderInputs ?
                                <><Skeleton variant='text' width='100%' height={35} /></> :
                                <TextField
                                    fullWidth
                                    label="STATUS"
                                    focused
                                    value={mprAutoFill?.employment_status}
                                />
                            }

                        </Box>
                        {loaderInputs ?
                            <><Skeleton variant='text' width='100%' height={35} /></> :
                            <TextField
                                fullWidth
                                label="POSITION"
                                focused
                                value={mprAutoFill?.position_name}
                            />
                        }

                        <Box display='flex' gap={1} width='100%'>
                            {loaderInputs ?
                                <><Skeleton variant='text' width='100%' height={35} /></> :
                                <TextField
                                    fullWidth
                                    label="HEAD COUNT"
                                    focused
                                    value={mprAutoFill?.head_count}
                                />
                            }
                            {loaderInputs ?
                                <><Skeleton variant='text' width='100%' height={35} /></> :
                                <TextField
                                    fullWidth
                                    label="PROPOSED RATE"
                                    focused
                                    value={mprAutoFill?.proposed_rate}
                                />
                            }

                        </Box>
                        {loaderInputs ?
                            <><Skeleton variant='text' width='100%' height={35} /></> :
                            <TextField
                                fullWidth
                                label="JUSTIFICATION"
                                focused
                                value={mprAutoFill?.mpr_justification_others ? mprAutoFill?.mpr_justification_others : mprAutoFill.mpr_justification === 1 ? 'NEW POSITION' : mprAutoFill.mpr_justification === 2 ? 'ADDITIONAL HC' : mprAutoFill.mpr_justification === 3 ? 'REPLACEMENT' : mprAutoFill.mpr_justification === 4 ? 'UPGRADE' : ''}
                            />
                        }
                        {loaderInputs ?
                            <><Skeleton variant='text' width='100%' height={35} /></> :
                            <TextField
                                fullWidth
                                label="DETAILS"
                                multiline
                                focused
                                value={mprAutoFill?.mpr_details}
                                rows={3}
                            />
                        }
                        {loaderInputs ?
                            <><Skeleton variant='text' width='100%' height={35} /></> :
                            <TextField
                                fullWidth
                                label="DUTIES AND RESPONSIBILITIES"
                                multiline
                                focused
                                rows={3}
                                value={mprAutoFill?.mpr_duties}
                            />
                        }
                        {loaderInputs ?
                            <><Skeleton variant='text' width='100%' height={35} /></> :
                            <TextField
                                fullWidth
                                label="QUALIFICATIONS"
                                multiline
                                focused
                                rows={3}
                                value={mprAutoFill?.mpr_qualification}
                            />
                        }

                        <TextField required fullWidth value={inputData.posting_date} onChange={e => setInputData({ ...inputData, posting_date: e.target.value })} type="date" label="PUBLICATION DATE" focused variant="outlined" />
                        <TextField required fullWidth value={inputData.closing_date} onChange={e => setInputData({ ...inputData, closing_date: e.target.value })} type="date" label="PUBLICATION END-DATE" focused variant="outlined" />
                    </>
                ) : (
                    <Typography align='left'>SELECT TYPE OF EMPLOYMENT</Typography>
                )}

                {inputData.emp_status &&
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <Button variant="contained" sx={{ borderRadius: '2rem' }} type="submit" endIcon={<ArrowForwardIcon />}>Submit Position</Button>
                    </Box>
                }
            </form>
        </Box>
    )
}

export default AddPosition