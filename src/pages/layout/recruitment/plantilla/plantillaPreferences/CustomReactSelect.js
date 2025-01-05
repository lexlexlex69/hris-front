import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import Button from '@mui/material/Button'
import AsyncSelect from 'react-select/async';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


let filterTimeout = null

const CustomReactSelect = ({ apiAddress, label, value, category, positionId, isRequired, setForceFetchItems, setIsRequiredDisabler }) => {

    const [titleState, setTitleState] = useState([])
    const selectRef = useRef(null)

    // react select only
    const loadOptions = (inputValue, callback) => {
        clearTimeout(filterTimeout)
        filterTimeout = setTimeout(() => {
            axios.post(`/api/${apiAddress}`, {
                data: inputValue,
                category: category
            })
                .then(res => {
                    callback(res.data.map(i => ({
                        label: i[label],
                        value: i[value],
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

    const SeletedOption = (param) => {
        const newValue = param
        setTitleState(newValue);
    }

    // 


    const handleSubmit = async () => {
        if (titleState.length === 0) {
            toast.warning('Select a value!')
            return false
        }
        else {
            Swal.fire({
                title: 'Processing request . . .',
                icon: 'info'
            })
            Swal.showLoading()
            try {
                let submitPointSystem = await axios.post(`/api/recruitment/submitEntriesForPointSystem`, { data: titleState, category: category, id: positionId })
                Swal.close()
                if (submitPointSystem.data.status === 200) {
                    setTitleState([])
                    setForceFetchItems(prev => !prev)
                    setIsRequiredDisabler(false)
                }
                else {
                    toast.error(submitPointSystem.data)
                }
            }
            catch (err) {
                toast.error(err.message)
            }
        }
    }

    return (
        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ width: '100%', flex: 1 }}>
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
                    isMulti
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
                <Button disabled={!isRequired} variant="contained" color="primary" onClick={handleSubmit} endIcon={<ArrowForwardIcon />} sx={{ borderRadius: '2rem' }}>
                    Submit
                </Button>
            </Box>

        </Box>


    );
};

export default CustomReactSelect;