import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import axios from 'axios';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress'

let filterTimeout = null

const filter = createFilterOptions();

const JobPostingSelect = ({ url, optionTitle, componentTitle, title, setTitle, defaultValue, size, setLoader }) => {
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
                    setOptionsAutocomplete(res.data);
                    setLoading(false)
                    console.log(res.data)
                })
                .catch(err => toast.error(err.message))
        }, 1000)

    }

    const handleChangePlantillaNo = async (e, value) => {
        console.log(e)
        console.log(value)
        setLoader(true)
        let finalValue = ''
        if (!value) {
            setTitle(prev => ({ ...prev, [title]: '' }))
        }
        else {
            console.log(value)
            let tokenize = value[optionTitle].split("[ADD]")
            if (tokenize.length > 1) {
                let tokenizeTrimmed = tokenize[1].trim()
                finalValue = tokenizeTrimmed
                setTitle(prev => ({ ...prev, [title]: tokenizeTrimmed, plantilla_no: value?.new_item_no,plantilla_id:value?.id }))
            }
            else {
                setTitle(prev => ({ ...prev, [title]: value[optionTitle], plantilla_no: value?.new_item_no,plantilla_id:value?.id }))
                finalValue = value[optionTitle]
            }
        }

        try {
            let res = await axios.post(`/api/recruitment/jobposting/getJobPostingByPlantillaNo`, { data: finalValue })
            console.log(res)
            setLoader(false)
            setTitle(prev => ({
                ...prev,
                position_id: res.data.position_id,
                position_title: res.data.position_name,
                sg: res?.data?.plantilla_sg,
                step: res?.data?.plantilla_step,
                monthly_salary: res?.data?.monthly_salary ? res?.data?.monthly_salary['step' + res?.data?.plantilla_step] : null,
                education: res.data.education,
                training: res.data.training,
                experience: res.data.experience,
                eligibility: res.data.eligibility,
                competency: res.data.competency,
                dept_title: res.data.dept_title,
                level: res.data.level
            }))
        }
        catch (err) {
            console.log(err.message)
        }

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
            defaultValue={defaultValue ? { [optionTitle]: defaultValue } : null}
            onClose={() => {
                setOpenAutocomplete(false);
            }}
            size={size === 'small' ? 'small' : ''}
            onChange={handleChangePlantillaNo}
            isOptionEqualToValue={(option, value) => option[optionTitle] === value[optionTitle]}
            getOptionLabel={(option) => option[optionTitle]}
            options={optionsAutocomplete}
            loading={loading}
            // filterOptions={(options, params) => {
            //     const filtered = filter(options, params);

            //     const { inputValue } = params;
            //     // Suggest the creation of a new value
            //     const isExisting = options.some((option) => inputValue === option[optionTitle]);
            //     if (inputValue !== '' && !isExisting && !loading) {
            //         filtered.push({
            //             inputValue,
            //             [optionTitle]: `[ADD] ${inputValue}`,
            //         });
            //     }

            //     return filtered;
            // }}
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
                />
            )}
        />
    );
};

export default JobPostingSelect;