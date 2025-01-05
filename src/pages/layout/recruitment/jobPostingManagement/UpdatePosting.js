import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AsyncSelect from 'react-select/async';
import InputAdornment from '@mui/material/InputAdornment'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import 'animate.css';
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPesoSign } from '@fortawesome/free-solid-svg-icons'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


import axios from 'axios';

import MprPage from './MprPage'
import MprReplacementPage from './MprReplacementPage'
import Skeleton from '@mui/material/Skeleton'
import JobPostingSelect from './JobPostingSelect';
import moment from 'moment'
import Typography from '@mui/material/Typography'

let filterTimeout = null
function UpdatePosting({data, pos, setPos, handleCloseDialog }) {

    // backdrop
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    // 
    // states
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
        employment_status: ''
    })

    const [replacementData, setReplacementData] = useState({
        mprNo: '',
        mprId: '',
        headCount: '',
        newHeadCount: ''
    })

    const [positionId, setPositionId] = useState('')
    const selectRef = useRef(null)
    const empStatusRef = useRef(true)

    const [isMpr, setIsMpr] = useState(false)
    const [isNewMpr, setIsNewMpr] = useState(2)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!inputData.competency && !inputData.education && !inputData.eligibility && !inputData.experience && !inputData.training && !inputData.level) {
            toast.warning('Please make sure position Qualification standard is filled at Positions module!')
            return
        }
        setOpen(true)
        let newMpr = { ...mprData }
        newMpr.employment_status = mprData.employment_status.value
        newMpr.position_id = mprData.position_id.value
        newMpr.mpr_justification = mprData.mpr_justification.value
        let res = await axios.post(`/api/recruitment/jobposting/addPositionForPosting`, { data: inputData, mpr: inputData.emp_status === 'JO' || inputData.emp_status === 'COS' ? isNewMpr === 0 ? newMpr : 0 : 0, replacement: inputData.emp_status === 'JO' || inputData.emp_status === 'COS' ? isNewMpr === 1 ? replacementData : 0 : 0 })
        setOpen(false)
        if (res.data.status === 401) {
            setValiderror(res.data.error)
        }
        if (res.data.status === 200) {
            let newPos = pos.map(x => x)
            newPos.unshift({
                job_vacancies_id: res.data.id,
                closing_date: inputData.closing_date,
                competency: inputData.competency,
                education: inputData.education,
                eligibility: inputData.eligibility,
                emp_status: inputData.emp_status,
                experience: inputData.experience,
                expiry_date: inputData.expiry_date,
                is_appointed: 0,
                is_hidden: 0,
                monthly_salary: inputData.monthly_salary,
                mpr_id: null,
                place_of_assignment: inputData.place_of_assignment,
                plantilla_id: inputData.plantilla_id,
                plantilla_no: inputData.plantilla_no,
                position_title: inputData.position_title,
                posted_by: res.data.posted_by,
                posting_date: inputData.posting_date,
                remarks: null,
                expiry_date: moment(inputData.posting_date).add(9, 'M'),
                plantilla_sg: inputData.sg,
                training: inputData.training,
                vacancy_status: 'PENDING'
            })
            setPos(newPos)
            handleCloseDialog()
        }
    }

    // emp status didUpdate

    useEffect(async () => {
        setIsNewMpr(null)
        if (empStatusRef.current) {
            empStatusRef.current = false
        }
        else {
            if (inputData.emp_status === 'JO' || inputData.emp_status === 'COS') {
                setIsMpr(true)
            }
            else {
                setIsMpr(false)
            }
            setInputData({
                ...inputData,
                plantilla_id: '',
                position_title: '',
                plantilla_no: '',
                sg: '',
                monthly_salary: '',
                education: '',
                training: '',
                experience: '',
                eligibility: '',
                competency: '',
                level: '',
                place_of_assignment: '',
                dept_title: '',
                status: '',
            })
        }
    }, [inputData.emp_status])

    useEffect(() => {
        if (inputData.plantilla_no) {
            console.log('adad')
        }
    }, [inputData])

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
                        {/* <MenuItem value='JO'>JO</MenuItem>
                        <MenuItem value='COS'>COS</MenuItem>
                        <MenuItem value='CA'>CASUAL</MenuItem> */}
                    </Select>
                </FormControl>

                {/* <TextField fullWidth value={inputData.plantilla_no} label="PLANTILLA NO." variant="outlined" size="small" error={validError.plantilla_no ? true : false} /> */}
                <JobPostingSelect componentTitle='PLANTILLA NUMBER' size='small' url='/api/recruitment/jobposting/getPlantillaAutocomplete' optionTitle='new_item_no' title={inputData?.plantilla_no} setTitle={setInputData} setLoader={setLoaderInputs} />

                <Box sx={{ width: '100%' }}>
                    {/* <AsyncSelect
                        ref={selectRef}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        // cacheOptions
                        placeholder="POSITION TITLE"
                        value={positionId}
                        loadOptions={loadOptions}
                        defaultOptions={false}
                        onInputChange={handleInputChange}
                        onChange={SeletedOption}
                    /> */}
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

                {isMpr && (<Box sx={{ position: 'relative', overflowY: 'hidden', width: '100%' }}>
                    <Box className="animate__animated animate__slideInDown animate_duration job-posting-mpr">
                        <Alert severity='info' sx={{ width: '100%', mb: 1, display: 'flex', justifyContent: 'center' }} >MAN POWER REQUEST</Alert>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Employment Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={isNewMpr}
                                label="Employment Status"
                                size='small'
                                onChange={e => setIsNewMpr(e.target.value)}
                            >
                                <MenuItem value={0}>new MPR</MenuItem>
                                <MenuItem value={1}>Replacement</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ position: 'relative', overflowY: 'hidden', width: '100%', mb: 1, display: 'flex', p: 2 }} >
                            {isNewMpr === 0 ? (
                                <Card raised className="animate__animated animate__slideInDown animate_duration job-posting-mpr" sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <MprPage mprData={mprData} setMprData={setMprData} positionId={positionId} />
                                </Card>
                            ) : isNewMpr === 1 ? (
                                <Card raised className="animate__animated animate__slideInDown animate_duration job-posting-mpr" sx={{ p: 2, width: '100%' }}>
                                    <MprReplacementPage replacementData={replacementData} setReplacementData={setReplacementData} />
                                </Card>
                            ) : null}
                        </Box>
                    </Box>
                </Box>)}
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                    <Button variant="contained" sx={{ borderRadius: '2rem' }} type="submit" endIcon={<ArrowForwardIcon />}>Submit Position</Button>
                </Box>
            </form>
        </Box>
    )
}

export default UpdatePosting