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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


import axios from 'axios';
import FormLabel from '@mui/material/FormLabel'


let filterTimeout = null
const MprReplacementPage = ({replacementData,setReplacementData}) => {
    const [titleState, setTitleState] = useState([])
    const selectRef = useRef(null)
    const [loadSearch,setLoadSearch] = useState(false)

    // react select only
    const loadOptions = (inputValue, callback) => {
        clearTimeout(filterTimeout)
        filterTimeout = setTimeout(() => {
            axios.post(`/api/recruitment/jobposting/searchMprReplacement`, {
                // data: inputValue,
                // category: category
            })
                .then(res => {
                    callback(res.data.map(i => ({
                        label: i.mpr_no,
                        value: i.id,
                        key: i.id
                    })))
                })
                .catch(err => toast.error(err.message))
        }, 500);
    };

    const handleInputChange = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '');
        return inputValue;
    };

    const SeletedOption = async (param) => {
        setLoadSearch(true)
        const newValue = param
        console.log(param)
        setTitleState(newValue);
        let res = await axios.post(`/api/recruitment/jobposting/getMprById`, { id: newValue.value })
        setLoadSearch(false)
        setReplacementData({
            mprNo: res.data.mpr_no,
            mprId: res.data.id,
            headCount: res.data.head_count,
            newHeadCount: ''
        })
        console.log(res)
    }

    return (
        <>
            <AsyncSelect
                ref={selectRef}
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                cacheOptions
                value={titleState}
                loadOptions={loadOptions}
                defaultOptions={false}
                onInputChange={handleInputChange}
                onChange={SeletedOption}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 1 }}>
                <TextField
                    id=""
                    size='small'
                    label="Head Count"
                    value={replacementData.headCount}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {loadSearch ? (<CircularProgress size={20} />) : (<AccountCircleIcon />)}
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    id=""
                    size='small'
                    disabled={loadSearch}
                    label="set New Head Count"
                    value={replacementData.newHeadCount}
                    onChange={(e) => setReplacementData({...replacementData,newHeadCount:e.target.value})}
                />
            </Box>
        </>
    );
};

export default MprReplacementPage;