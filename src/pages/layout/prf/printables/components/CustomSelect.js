import React, { useEffect, useState } from "react";
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
import { autoCapitalizeFirstLetter } from "../../../customstring/CustomString";

function CustomSelect({ title, tab, names, value }) {
  const { setPrfData, handleRowClick, prfData } = usePrfData();
  const [salaryToggler, setSalaryToggler] = useState(false);
  const [testSelect, setTestSelect] = useState("blue");
  const [tempSelect, setTempSelect] = useState();

  useEffect(() => {
    prfData && setTempSelect(prfData.SummaryOfCandidPrfDetails.sal_value);
  }, [prfData]);
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  padding: "0px 10px",
                }}
              >
                <Typography sx={{ fontSize: "1rem" }}>
                  <span style={{ display: "flex", gap: "10px" }}>
                    Current Salary:{" "}
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        margin: "0px",
                      }}
                    >
                      {phpPesoIntFormater.format(
                        prfData &&
                          prfData &&
                          prfData.SummaryOfCandidPrfDetails.sal_value
                      )}
                    </p>
                  </span>
                  <p
                    style={{
                      fontSize: ".7rem",
                      fontWeight: "600",
                      color: "#707070de",
                      margin: "0px",
                    }}
                  >
                    {autoCapitalizeFirstLetter(
                      toWords(
                        prfData
                          ? prfData.SummaryOfCandidPrfDetails.sal_value
                          : 0
                      )
                    )}
                  </p>
                </Typography>
              </div>
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
                      // label="Update step"
                      // size="small"
                      onChange={(e) => setTempSelect(e.target.value)}
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
                  </FormControl>
                </Grid>
              ) : (
                <></>
              )}

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
