import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import axios from 'axios';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress'

let filterTimeout = null

const filter = createFilterOptions();

const CollapsePositionSelect = ({ url, optionTitle, componentTitle, setTitle, defaultValue, defaultPosition, nCollapse, uuid }) => {
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
            defaultValue={defaultPosition ? { [optionTitle]: defaultPosition } : null}
            onClose={() => {
                setOpenAutocomplete(false);
            }}
            onChange={(e, value) => {
                console.log(value)
                if (!value) {
                    if (!nCollapse || !Array.isArray(nCollapse)) {
                        setTitle(prev => ({ ...prev, position_id: value?.code, position_name: value?.position_name }))
                    }
                    else {
                        let temp = Array.isArray(nCollapse) && nCollapse.map((item) => item.uuid === uuid ? ({ ...item, position_id: defaultPosition }) : item)
                        setTitle(temp)
                    }
                }
                else {
                    if (!nCollapse || !Array.isArray(nCollapse)) {
                        setTitle(prev => ({ ...prev, position_id: value?.code, position_name: value?.position_name }))
                    }
                    else {
                        let temp = Array.isArray(nCollapse) && nCollapse.map((item) => item.uuid === uuid ? ({ ...item, position_id: value?.code }) : item)
                        setTitle(temp)
                    }
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
                    fullWidth
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
                />
            )}
        />
    );
};

export default CollapsePositionSelect;