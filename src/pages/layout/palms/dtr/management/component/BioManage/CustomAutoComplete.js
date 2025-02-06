import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { useBio } from "../../context/BioManageProvider";
import { monthList, yearlist } from "../../util/datetimeformat";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";

export default function CustomAutoComplete() {
  const {
    getExecData,
    getExecDataError,
    selectDevice,
    setSelectDevice,
    date,
    setDate,
    autoCompleteDeviceLoading,
    handleDisplay,
  } = useBio();
  // console.log("autoCompleteDeviceLoading", autoCompleteDeviceLoading);
  const defaultPropsYear = {
    options: yearlist,
    getOptionLabel: (option) => option.toString(),
  };
  const defaultPropsMonth = {
    options: monthList,
    getOptionLabel: (option) => option.label,
  };

  const defaultProps = {
    options: getExecData,
    getOptionLabel: (option) => option.device_name,
  };

  return (
    <Stack direction="row" spacing={1} sx={{ width: "auto" }}>
      <Autocomplete
        sx={{ width: "180px" }}
        {...defaultPropsMonth}
        id="controlled-demo"
        value={date?.month}
        onChange={(event, newValue) => {
          setDate((prev) => ({ ...prev, month: newValue }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Month"
            variant="outlined"
            size="small"
          />
        )}
      />
      <Autocomplete
        sx={{ width: "180px" }}
        {...defaultPropsYear}
        id="controlled-demo"
        value={date?.year}
        onChange={(event, newValue) => {
          setDate((prev) => ({ ...prev, year: newValue }));
        }}
        renderInput={(params) => (
          <TextField {...params} label="Year" variant="outlined" size="small" />
        )}
      />
      <Autocomplete
        sx={{ width: "300px" }}
        {...defaultProps}
        id="controlled-demo"
        value={selectDevice ? selectDevice : null}
        disabled={autoCompleteDeviceLoading || getExecDataError}
        autoCompleteDeviceLoading={autoCompleteDeviceLoading}
        onChange={(event, newValue) => {
          setSelectDevice(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Devices"
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {autoCompleteDeviceLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
      />
      <Button
        variant="contained"
        onClick={handleDisplay}
        size="small"
        disabled={!selectDevice}
      >
        Display
      </Button>
    </Stack>
  );
}
