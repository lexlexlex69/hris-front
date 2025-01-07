import React, { useState } from "react";
import "./CustomInput.css";
import { usePrfData } from "../context/PrintableDataProvider";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import { toWords } from "number-to-words";

function CustomSelect({ title, tab, names, value }) {
  const { setPrfData, handleRowClick, prfData } = usePrfData();
  const [salaryToggler, setSalaryToggler] = useState(false);
  const [testSelect, setTestSelect] = useState("blue");
  const [tempSelect, setTempSelect] = useState(
    prfData ? prfData.SummaryOfCandidPrfDetails.sal_value : 0
  );
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setPrfData((prevDetails) => ({
  //     ...prevDetails,
  //     essentials: { ...prevDetails.essentials, [name]: value },
  //   }));
  // };
  // const handleApplyChange = (e) => {
  //   e.preventDefault();
  //   setPrfData((prev) => ({
  //     ...prev,
  //     essentials: tempData,
  //   }));
  // };

  const handleSaveSalarySetting = (e) => {
    setSalaryToggler((prev) => !prev);
    e.preventDefault();
    setPrfData((prevDetails) => ({
      ...prevDetails,
      SummaryOfCandidPrfDetails: {
        ...prevDetails.SummaryOfCandidPrfDetails,
        sal_value: tempSelect,
      },
    }));
  };
  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body">
        <>
          <div></div>
          <div>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "1rem" }}>
                  Current Salary:{" "}
                  {phpPesoIntFormater.format(
                    prfData &&
                      prfData &&
                      prfData.SummaryOfCandidPrfDetails.sal_value
                  )}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem" }}>
                  Word Format:{" "}
                  {toWords(
                    prfData ? prfData.SummaryOfCandidPrfDetails.sal_value : 0
                  )}
                </Typography>
              </Grid>
              {salaryToggler ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" size="small">
                      {" "}
                      Update step{" "}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={tempSelect}
                      label="Update step"
                      size="small"
                      // onChange={handleUpdateStepValue}
                    >
                      <MenuItem value={prfData && prfData.sgData.step1}>
                        {" "}
                        STEP 1 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step1
                        )}
                      </MenuItem>
                      <MenuItem value={prfData && prfData.sgData.step2}>
                        {" "}
                        STEP 2 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step2
                        )}
                      </MenuItem>
                      <MenuItem value={prfData && prfData.sgData.step3}>
                        {" "}
                        STEP 3 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step3
                        )}
                      </MenuItem>
                      <MenuItem value={prfData && prfData.sgData.step4}>
                        {" "}
                        STEP 4 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step4
                        )}
                      </MenuItem>
                      <MenuItem value={prfData && prfData.sgData.step5}>
                        {" "}
                        STEP 5 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step5
                        )}
                      </MenuItem>
                      <MenuItem value={prfData && prfData.sgData.step6}>
                        {" "}
                        STEP 6 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step6
                        )}
                      </MenuItem>
                      <MenuItem value={prfData && prfData.sgData.step7}>
                        {" "}
                        STEP 7 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step7
                        )}
                      </MenuItem>
                      <MenuItem value={prfData && prfData.sgData.step8}>
                        {" "}
                        STEP 8 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step8
                        )}
                      </MenuItem>
                    </Select>
                    <select
                      // labelId="demo-simple-select-label"
                      // id="demo-simple-select"
                      value={tempSelect}
                      // label="Update step"
                      // size="small"
                      onChange={(e) => setTempSelect(e.target.value)}
                    >
                      <option value={prfData && prfData.sgData.step1}>
                        {" "}
                        STEP 1 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step1
                        )}
                      </option>
                      <option value={prfData && prfData.sgData.step2}>
                        {" "}
                        STEP 2 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step2
                        )}
                      </option>
                      <option value={prfData && prfData.sgData.step3}>
                        {" "}
                        STEP 3 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step3
                        )}
                      </option>
                      <option value={prfData && prfData.sgData.step4}>
                        {" "}
                        STEP 4 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step4
                        )}
                      </option>
                      <option value={prfData && prfData.sgData.step5}>
                        {" "}
                        STEP 5 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step5
                        )}
                      </option>
                      <option value={prfData && prfData.sgData.step6}>
                        {" "}
                        STEP 6 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step6
                        )}
                      </option>
                      <option value={prfData && prfData.sgData.step7}>
                        {" "}
                        STEP 7 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step7
                        )}
                      </option>
                      <option value={prfData && prfData.sgData.step8}>
                        {" "}
                        STEP 8 -{" "}
                        {phpPesoIntFormater.format(
                          prfData && prfData.sgData.step8
                        )}
                      </option>
                    </select>
                  </FormControl>
                </Grid>
              ) : (
                <></>
              )}
              <Grid item xs={12}>
                <hr />
              </Grid>
              <Grid item xs={12}>
                {!salaryToggler ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setSalaryToggler((prev) => !prev)}
                  >
                    {" "}
                    Update{" "}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={(ev) => handleSaveSalarySetting(ev)}
                  >
                    {" "}
                    Save{" "}
                  </Button>
                )}
              </Grid>
            </Grid>
          </div>
        </>
      </div>
    </div>
  );
}

export default CustomSelect;
