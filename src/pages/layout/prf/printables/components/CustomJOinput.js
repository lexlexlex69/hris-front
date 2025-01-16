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
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  CustomCenterModal,
  phpPesoIntFormater,
} from "../../components/export_components/ExportComp";
import { toWords } from "number-to-words";
import CustomInputTemplate from "./CustomInputTemplate";

function CustomJOinput({ title, objectName }) {
  const { setPrfData, handleRowClick, prfData } = usePrfData();
  const [inputState, setInputState] = useState("");
  const [objectState, setObjectState] = useState();
  const [open, setOpen] = useState();
  const matches = useMediaQuery("(min-width: 565px)");

  useEffect(() => {
    console.log("prfDatajo", prfData);
    prfData &&
      setObjectState(JSON.parse(prfData.SummaryOfCandidPrfDetails[objectName]));
  }, [prfData]);

  // const [tempSelect, setTempSelect] = useState(
  //   prfData ? prfData.SummaryOfCandidPrfDetails.sal_value : 0
  // )
  console.log("objectState", objectState);

  const handleAddItem = () => {
    if (inputState.trim() === "") return;
    setObjectState([...objectState, inputState]);
    setInputState("");
  };
  const handleJobDescChange = (index, value) => {
    // Create a copy of the current state
    const updatedArr = [...objectState];
    console.log("updatedArr", updatedArr);
    // Update the specific employer's value
    updatedArr[index] = value;
    console.log("updatedArr", updatedArr);

    // // // Set the new state with the updated employer list
    setObjectState(updatedArr);
  };

  const handleDeleteJobDesc = (index) => {
    const updatedArr = [...objectState];
    updatedArr.splice(index, 1);
    setObjectState(updatedArr);
  };

  return (
    <CustomInputTemplate title={title}>
      <>
        <input
          type="text"
          name=""
          id=""
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          open modsal
        </button>
        <CustomCenterModal
          key={"open1"}
          matches={matches}
          openner={open}
          comptitle={"asdfsadf"}
          compSize={"40%"}
          handleCloseBTN={() => setOpen(false)}
        >
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            sx={{ width: "100%" }}
          />
        </CustomCenterModal>
        <button onClick={handleAddItem}>Add</button>
        <ol>
          {objectState &&
            objectState.map((item, index) => (
              <li key={index}>
                <input
                  type="text"
                  name=""
                  id=""
                  value={item}
                  onChange={(e) => handleJobDescChange(index, e.target.value)}
                />{" "}
                <button onClick={() => handleDeleteJobDesc(index)}>
                  Remove
                </button>
              </li>
            ))}
        </ol>

        <button
          onClick={() => {
            setPrfData((prev) => ({
              ...prev,
              SummaryOfCandidPrfDetails: {
                ...prev.SummaryOfCandidPrfDetails,
                [objectName]: JSON.stringify(objectState),
              },
            }));
          }}
        >
          apply changes
        </button>
      </>
    </CustomInputTemplate>
  );
}

export default CustomJOinput;
