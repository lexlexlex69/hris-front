import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress'

import axios from 'axios';
import { toast } from 'react-toastify';

let filterTimeout = null

const filter = createFilterOptions();

const PlantillaCasualSelect = ({ url, optionTitle, componentTitle, setTitle, defaultValue, defaultPosition, field }) => {
    const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
    const [optionsAutocomplete, setOptionsAutocomplete] = React.useState([]);
    const [loading, setLoading] = useState(false)

    const handleSetOptions = (value) => {
        setLoading(true)
        clearTimeout(filterTimeout)
        if (value.replace(/\s+/g, '').length === 0) return false
        filterTimeout = setTimeout(() => {
            axios.post(url, {
                data: value
            })
                .then(res => {
                    console.log(res)
                    setOptionsAutocomplete(res.data);
                    setLoading(false)
                })
                .catch(err => toast.error(err.message))
        }, 1000)
    }

    React.useEffect(() => {
        if (!openAutocomplete) {
            setOptionsAutocomplete([]);
        }
    }, [openAutocomplete]);


    return (
        <Autocomplete
            id={componentTitle}
            sx={{ width: '100%' }}
            open={openAutocomplete}
            onOpen={() => {
                setOpenAutocomplete(true);
            }}
            defaultValue={defaultValue ? { [optionTitle]: defaultPosition } : null}
            onClose={() => {
                setOpenAutocomplete(false);
            }}
            onChange={(e, value) => {
                console.log(value)
                if (!value) {
                    setTitle(prev => ({ ...prev, field: defaultValue }))
                }
                else {
                    setTitle(prev => ({ ...prev, [field]: value?.id }))
                }

            }}
            isOptionEqualToValue={(option, value) => option[optionTitle] === value[optionTitle]}
            getOptionLabel={(option) => option[optionTitle]}
            options={optionsAutocomplete}
            loading={loading}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                return filtered;
            }}
            renderInput={(params) => (
                <TextField
                    required
                    {...params}
                    label={componentTitle}
                    onChange={(value) => handleSetOptions(value.target.value)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                >
                </TextField>
            )}
        />
    );
};

export default PlantillaCasualSelect;