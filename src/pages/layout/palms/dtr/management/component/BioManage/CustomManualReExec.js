import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useBio } from "../../context/BioManageProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { generateDateRange } from "../../util/datetimeformat";
import { CustomCenterModal } from "../../../../../prf/components/export_components/ExportComp";

function CustomManualReExec() {
  const { handleCloseModal, open, modalTitle, modalOpener, getExecData } =
    useBio();
  const handleClick = () => {
    modalOpener("Manual Re-Exec");
  };
  return (
    <>
      <CustomModalManualReExec
        openner={open}
        modalTitle={modalTitle}
        comptitle={modalTitle}
        handleCloseBTN={handleCloseModal}
        // data={notificationData}
        getExecData={getExecData}
      />
      <Button variant="contained" onClick={handleClick}>
        Manual Re-Exec
      </Button>
    </>
  );
}

function CustomModalManualReExec({
  openner,
  modalTitle,
  comptitle,
  handleCloseBTN,
  getExecData,
}) {
  const matches = useMediaQuery("(min-width: 565px)");
  const { handleClickOpenModalReExec } = useBio();
  // console.log(data)

  const [payload, setPayload] = useState({
    device_id: null,
    datestart: null,
    dateend: null,
  });
  const [checked, setChecked] = React.useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  console.log(payload);

  const defaultProps = {
    options: getExecData,
    getOptionLabel: (option) => option.device_name,
  };

  const handleSubmit = () => {
    const formattedPayload = [
      {
        device_id: payload.device_id.device_id,
        dates: generateDateRange(
          payload.datestart ? format(payload.datestart, "yyyy-MM-dd") : "",
          payload.dateend ? format(payload.dateend, "yyyy-MM-dd") : ""
        ),
      },
    ];

    console.log(formattedPayload);
    handleClickOpenModalReExec(formattedPayload);
  };

  useEffect(() => {
    setPayload({ device_id: null, datestart: null, dateend: null });
  }, [openner]);
  useEffect(() => {
    setPayload((prev) => ({ ...prev, datestart: null, dateend: null }));
  }, [checked]);

  return (
    <CustomCenterModal
      key={"open1"}
      compSize={"30%"}
      matches={matches}
      openner={openner && modalTitle === "Manual Re-Exec"}
      comptitle={comptitle}
      handleCloseBTN={handleCloseBTN}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <Autocomplete
              {...defaultProps}
              id="controlled-demo"
              required
              value={payload.device_id}
              onChange={(event, newValue) => {
                setPayload((prev) => ({
                  ...prev,
                  device_id: newValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Devices"
                  variant="outlined"
                  error={!payload.device_id}
                  helperText={!payload.device_id ? "Device is required" : ""}
                />
              )}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={handleChange}
                  name="gilad"
                />
              }
              label="Date Range"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <MobileDatePicker
                  label={checked ? "Date Start" : "Date"}
                  inputFormat="MM/dd/yyyy"
                  value={payload.datestart}
                  onChange={(newValue) => {
                    setPayload((prev) => ({
                      ...prev,
                      datestart: newValue,
                      dateend: !checked ? newValue : prev.dateend, // Update dateend if checked
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ flex: 1 }}
                      error={!payload.datestart}
                      helperText={
                        !payload.datestart ? "Start date is required" : ""
                      }
                    />
                  )}
                />
                {checked && (
                  <MobileDatePicker
                    sx={{ flex: 1 }}
                    label="Date End"
                    inputFormat="MM/dd/yyyy"
                    value={payload.dateend}
                    onChange={(newValue) => {
                      setPayload((prev) => ({ ...prev, dateend: newValue }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ flex: 1 }}
                        error={!payload.dateend}
                        helperText={
                          !payload.dateend ? "End date is required" : ""
                        }
                      />
                    )}
                  />
                )}
              </Box>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={handleCloseBTN}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Re-Execute
          </Button>
        </Box>
      </Box>
    </CustomCenterModal>
  );
}

export default CustomManualReExec;
