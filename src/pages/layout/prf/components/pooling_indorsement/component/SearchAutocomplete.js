import { Autocomplete, CircularProgress, createFilterOptions, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";


let filterTimeout = null
const filter = createFilterOptions();

const SearchAutocomplete = ({ url, optionTitle, componentTitle, title, setTitle, defaultValue }) => {
    const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
    const [optionsAutocomplete, setOptionsAutocomplete] = React.useState([]);
    const [loading, setLoading] = React.useState(false)

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
        <>
            <Autocomplete
                id={componentTitle}
                sx={{ width: '100%' }}
                size="small"
                open={openAutocomplete}
                onOpen={() => {
                    setOpenAutocomplete(true);
                }}
                defaultValue={defaultValue ? { [optionTitle]: defaultValue } : null}
                onClose={() => {
                    setOpenAutocomplete(false);
                }}
                onChange={(e, value) => {
                    if (!value) {
                        setTitle('')
                    }
                    else {
                        let tokenize = value[optionTitle].split("[ADD]")
                        if (tokenize.length > 1) {
                            let tokenizeTrimmed = tokenize[1].trim()
                            setTitle(tokenizeTrimmed)
                        }
                        else {
                            setTitle(value[optionTitle])
                        }
                    }

                }}
                isOptionEqualToValue={(option, value) => option[optionTitle] === value[optionTitle]}
                getOptionLabel={(option) => option[optionTitle]}
                options={optionsAutocomplete}
                loading={loading}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option[optionTitle]);
                    if (inputValue !== '' && !isExisting && !loading) {
                        filtered.push({
                            inputValue,
                            [optionTitle]: `[ADD] ${inputValue}`,
                        });
                    }

                    return filtered;
                }}
                renderInput={(params) => (
                    <TextField
                        // required
                        size="small"
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
        </>
    )
}

export default SearchAutocomplete