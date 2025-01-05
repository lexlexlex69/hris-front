import { Autocomplete, Box, Chip, createFilterOptions, FormControl, FormHelperText, FormLabel, InputLabel, Select, TextField } from "@mui/material";


export function TextFieldRD({ readOnly, shrinkInput, name, label, placeholder, value, onchange, type, error, required }) {
  return (
    <FormControl fullWidth>
      <TextField
        inputProps={{
          readOnly: readOnly || false,
          min: type === 'number' ? 0 : undefined
        }}
        InputLabelProps={{ shrink: shrinkInput || false, }}
        type={type || 'text'}
        // error={error}
        // helperText={error}
        name={name}
        label={label}
        variant="outlined"
        placeholder={placeholder || ''}
        value={value}
        onChange={onchange}
        required={required || false}
      />
      <FormHelperText sx={{ color: error ? 'error.main' : 'text.secondary' }}>
        {error}
      </FormHelperText>
    </FormControl>
  )
}

export function SelectFieldRD({ name, id, label, error, value, onchange, children, color, disabled, size, required }) {
  return (
    <>
      <FormControl fullWidth >
        <InputLabel id={id} required size={size}> {label} </InputLabel>
        <Select
          name={name}
          labelId={id}
          label={label}
          variant="outlined"
          value={value}
          disabled={disabled || false}
          onChange={onchange}
          required={true}
          size={size}
          sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
        >
          {children}
        </Select>
      </FormControl>
      <FormHelperText sx={{ color: color }}>
        {error}
      </FormHelperText>
    </>
  )
}

export function TextAreaRD({ label, value, onchange, rows, maxRows, }) {
  return (
    <>
      <FormControl fullWidth>
        <FormLabel>
          {label}
        </FormLabel>
        <TextField
          value={value}
          onChange={onchange}
          margin="normal"
          variant="outlined"
          multiline={true}
          rows={rows}
          maxRows={maxRows}
        />
      </FormControl>
    </>
  )
}

export function SimpleAutocomplete({ error, id, oninputchange, onchange, getoptionlabel, inputvalue, option, renderinput, renderoption, color, value, name, size }) {
  return (
    <>
      <FormControl fullWidth>
        <Autocomplete id={id}
          size={size || 'normal'}
          value={value}
          onInputChange={oninputchange}
          onChange={onchange}
          getOptionLabel={getoptionlabel}
          inputValue={inputvalue}
          options={option}
          renderInput={renderinput}
          renderOption={renderoption}
          required
          name={name}
        />
      </FormControl>
      <FormHelperText sx={{ color: color }}>
        {error}
      </FormHelperText>
    </>
  )
}

export function SimpleAutocompleteChip({ options, getoptionlabel, getoptionkey, onchange, renderinput, error, value, }) {
  return (
    <>
      <FormControl fullWidth>
        <Autocomplete disablePortal multiple
          value={value}
          options={options}
          getOptionLabel={getoptionlabel}
          getOptionKey={getoptionkey}
          onChange={onchange}
          renderInput={renderinput}
          required
        />
      </FormControl>
      <FormHelperText sx={{ color: error ? 'error.main' : 'text.secondary' }}>
        {error}
      </FormHelperText>
    </>
  )
}



const filter = createFilterOptions();

export function JobSummaryAutocomplete({ jobSummValue, setJobSummValue, posTitle, requestDataForm }) {
  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setJobSummValue(prevValue => [...prevValue, newValue]);
    } else if (newValue && newValue.inputValue) {
      setJobSummValue(prevValue => [...prevValue, newValue.inputValue]);
    } else {
      setJobSummValue(newValue);
    }
  };

  const handleFilterOptions = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some(option => inputValue === option.job_summ);

    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        job_summ: `Add "${inputValue}"`,
      });
    }

    return filtered;
  };

  return (
    <FormControl>
      <Autocomplete
        disablePortal
        multiple
        size="small"
        id="job_summ"
        disableClearable
        value={jobSummValue}
        onChange={handleChange}
        filterOptions={handleFilterOptions}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={posTitle.categories.job_summary}
        getOptionDisabled={(option) => jobSummValue.includes(option)}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          if (option.inputValue) return option.inputValue;
          return option.job_summ;
        }}
        renderOption={(props, option) => (
          <li {...props}>
            {option.job_summ}
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.job_summ || option}
              {...getTagProps({ index })}
              disabled={index === 0}
            />
          ))
        }
        disabled={!requestDataForm.position}
        slotProps={{ popper: { sx: { zIndex: 2500 } } }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select additional job summary"
            onKeyDown={(event) => {
              if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft') {
                event.stopPropagation();
              }
            }}
          />
        )}
      />
    </FormControl>
  );
}

{/* <FormControl fullWidth>
    <Autocomplete disablePortal multiple size="small" id='job_summ' disableClearable
        options={posTitle.categories.job_summary}
        value={jobSummValue}
        disabled={!requestData.position}
        onChange={(ev, newValue) => { setEducQSValue([...educQS, ...newValue.filter((option) => educQS.indexOf(option) === -1),]); }}
        getOptionDisabled={(option) => option === jobSummValue[0]}
        getOptionLabel={(data) => data.job_summ}
        renderInput={(params) => <TextField {...params} label={"Select additional job summary"} onKeyDown={(event) => { if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft') { event.stopPropagation() } }} />}
        renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
                <>
                    {index === 0 ? (
                        <Chip label={option.job_summ} {...getTagProps({ index })} disabled={true} />
                    ) : (
                        <Chip label={option.job_summ} {...getTagProps({ index })} disabled={false} />
                    )}
                </>
            ))
        }
        slotProps={{ popper: { sx: { zIndex: 2500 } } }}
    />
</FormControl> */}

export function SearchCreateAutocomplete({ value, setValue, option, disabled, id, name, label, error, helperText, }) {
  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setValue(prevValue => [...prevValue, newValue]);
    } else if (newValue && newValue.inputValue) {
      setValue(prevValue => [...prevValue, newValue.inputValue]);
    } else {
      setValue(newValue);
    }
  };

  const handleFilterOptions = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some(option => inputValue === option[name]);

    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        [name]: `Add "${inputValue}"`,
      });
    }

    return filtered;
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        // limitTags={1}
        handleHomeEndKeys
        disableClearable
        disablePortal
        selectOnFocus
        clearOnBlur
        multiple
        size="small"
        id={id}
        value={value}
        onChange={handleChange}
        filterOptions={handleFilterOptions}
        options={option}
        getOptionDisabled={(option) => value.includes(option)}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          if (option.inputValue) return option.inputValue;
          return option[name];
        }}
        renderOption={(props, option) => (
          <li {...props}>
            {option[name]}
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip label={option[name] || option} {...getTagProps({ index })} disabled={index === 0} />
          ))
        }
        disabled={disabled}
        slotProps={{ popper: { sx: { zIndex: 2500 } } }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label={!label ? '' : `Select additional ${label.toLowerCase()}`}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft') {
                event.stopPropagation();
              }
            }}
          />
        )}
      />
      <FormHelperText sx={{ color: error ? 'error.main' : 'text.secondary' }}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
}


export function SearchCreateAutocompleteWOD({ value, setValue, option, disabled, id, name, label, error, helperText, inputValue, setInputValue }) {
  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setValue(prevValue => [...prevValue, newValue]);
    } else if (newValue && newValue.inputValue) {
      setValue(prevValue => [...prevValue, newValue.inputValue]);
    } else {
      setValue(newValue);
    }
  };

  const handleFilterOptions = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some(option => inputValue === option[name]);

    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        [name]: `Add "${inputValue}"`,
      });
    }

    return filtered;
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        // limitTags={1}
        handleHomeEndKeys
        disableClearable
        disablePortal
        selectOnFocus
        clearOnBlur
        multiple
        size="small"
        id={id}
        value={value}
        onChange={handleChange}
        filterOptions={handleFilterOptions}
        options={option}
        getOptionDisabled={(option) => value.includes(option)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          if (option.inputValue) return option.inputValue;
          return option[name];
        }}
        renderOption={(props, option) => (
          <li {...props}>
            {option[name]}
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip label={option[name] || option} {...getTagProps({ index })} />
          ))
        }
        disabled={disabled}
        slotProps={{ popper: { sx: { zIndex: 2500 } } }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label={!label ? '' : `Select additional ${label.toLowerCase()}`}
          // onKeyDown={(event) => {
          //   if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft') {
          //     event.stopPropagation();
          //   }
          // }}
          />
        )}
      />
      <FormHelperText sx={{ color: error ? 'error.main' : 'text.secondary' }}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
}




export function CustomAutocomplete({ id, label, options, value, onChange, error, disabled, helperText, }) {
  return (
    <FormControl fullWidth error={error}>
      <Autocomplete
        limitTags={1}
        disablePortal={true}
        multiple
        size="small"
        id={id}
        options={options}
        value={value}
        onChange={onChange}
        disableClearable
        getOptionLabel={(data) => data.category}
        getOptionDisabled={(option) => value.includes(option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Select additional ${label.toLowerCase()}`}
            onKeyDown={(event) => {
              if (['Backspace', 'Delete', 'ArrowLeft'].includes(event.key)) {
                event.stopPropagation();
              }
            }}
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              key={option.category}
              label={option.category}
              {...getTagProps({ index })}
              disabled={index === 0}
            />
          ))
        }
        slotProps={{ popper: { sx: { zIndex: 2500 } } }}
        disabled={disabled}
      />
      <FormHelperText sx={{ color: error ? 'error.main' : 'text.secondary' }}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
}