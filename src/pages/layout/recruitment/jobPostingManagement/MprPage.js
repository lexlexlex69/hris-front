import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import 'animate.css';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPesoSign } from '@fortawesome/free-solid-svg-icons'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


import axios from 'axios';
import FormLabel from '@mui/material/FormLabel'



const MprPage = ({ mprData, setMprData, positionId }) => {

    const handleChangeInput = (e) => {
        setMprData({ ...mprData, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        setMprData({ ...mprData, position_id: positionId })
        console.log('asdasdas')
    },[positionId])

    return (
        <>
            <FormControl fullWidth>
                <InputLabel id="BUDGET-simple-select-label">BUDGET</InputLabel>
                <Select
                    labelId="BUDGET-simple-select-label"
                    id="BUDGET-simple-select"
                    label="BUDGET"
                    size='small'
                    name="budget"
                    value={mprData.budget}
                    onChange={handleChangeInput}
                >
                    <MenuItem value={0}>NONE</MenuItem>
                    <MenuItem value={1}>Budgeted</MenuItem>
                    <MenuItem value={2}>Unbidgeted</MenuItem>
                </Select>
            </FormControl>
            <CreatableSelect
                placeholder="EMPLOYMENT STATUS"
                menuPortalTarget={document.body}
                value={mprData.employment_status}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                onChange={(newValue, actionMeta) => {
                    setMprData({ ...mprData, employment_status: newValue })
                }}
                options={[
                    { label: 'NONE', value: 0 },
                    { label: 'CASUAL', value: 1 },
                    { label: 'JOB ORDER', value: 2 },
                    { label: 'COS', value: 3 },
                ]}
            />
            <TextField fullWidth label="PROPOSED RATE" variant="outlined" size="small" helperText="Field is required."
                name="proposed_rate"
                value={mprData.proposed_rate}
                onChange={handleChangeInput}
            />
            <TextField fullWidth label="HEAD COUNT" variant="outlined" size="small" helperText="Field is required."
                name="head_count"
                value={mprData.head_count}
                onChange={handleChangeInput}
            />
            <TextField fullWidth label="DATE REQUESTED" type="date" variant="outlined" size="small" helperText="Field is required." focused
                name="date_requested"
                value={mprData.date_requested}
                onChange={handleChangeInput}
            />
            <TextField fullWidth label="DATE NEEDED" type="date" variant="outlined" size="small" helperText="Field is required." focused
                name="date_needed"
                value={mprData.date_needed}
                onChange={handleChangeInput}
            />
            <CreatableSelect
                placeholder="MPR JUSTIFICATION"
                // isClearable
                value={mprData.mpr_justification}
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                onChange={(newValue, actionMeta) => {
                    setMprData({ ...mprData, mpr_justification: newValue })
                }}
                options={[
                    { label: 'NONE', value: 0 },
                    { label: 'New Position', value: 1 },
                    { label: 'Additional HC', value: 2 },
                    { label: 'Replacement', value: 3 },
                    { label: 'Upgrade', value: 4 },
                ]}
            />
            <TextField fullWidth label="MPR DETAILS" multiline rows={2} variant="outlined" size="small" helperText="Field is required."
                name="mpr_details"
                value={mprData.mpr_details}
                onChange={handleChangeInput}
            />
            <TextField fullWidth label="DUTIES AND RESPONSIBILITIES" multiline rows={2} variant="outlined" size="small" helperText="Field is required."
                name="mpr_duties"
                value={mprData.mpr_duties}
                onChange={handleChangeInput}
            />
            <TextField fullWidth label="MPR QUALIFICATIONS" multiline rows={2} variant="outlined" size="small" helperText="Field is required."
                name="mpr_qualification"
                value={mprData.mpr_qualification}
                onChange={handleChangeInput}
            />
        </>
    );
};

export default MprPage;