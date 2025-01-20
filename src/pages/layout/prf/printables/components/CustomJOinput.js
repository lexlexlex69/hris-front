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

const CustomModalJo = ({ openner, comptitle, handleCloseBTN }) => {
  const matches = useMediaQuery("(min-width: 565px)");

  const {
    closeModal,
    handleRowClick,
    fetchEmployeeByName,
    employeeList,
    handleModalRowClick,
    modalTitle,
  } = usePrfData();

  const [name, setName] = useState();
  const [tempData, setTempData] = useState({});
  tempData && console.log("viewlist tempdata", tempData);

  return (
    <CustomCenterModal
      key={"open1"}
      matches={matches}
      openner={openner}
      comptitle={comptitle}
      compSize={"40%"}
      handleCloseBTN={handleCloseBTN}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "15px" }}
        >
          <TextField
            id="outlined-basic"
            label={"Employee Name (first name / last name)"}
            variant="outlined"
            sx={{ width: "100%" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button variant="contained" onClick={() => fetchEmployeeByName(name)}>
            Search
          </Button>
        </Box>
        <Box>
          <Stack
            direction="column"
            // justifyContent="center"
            alignItems="center"
            spacing={1}
            overflow={"auto"}
            sx={{ maxHeight: "50vh", marginTop: "10px" }}
          >
            {employeeList &&
              employeeList.map((item, index) => (
                <Item
                  key={index}
                  sx={{
                    // display: "flex",
                    // flexDirection: "column",
                    cursor: "pointer",
                    backgroundColor:
                      tempData.id == item.id ? "#f2f2f2" : "none",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "1rem",
                  }}
                  onClick={() => setTempData(item)}
                >
                  <Typography sx={{ fontWeight: "600" }}>
                    {item.fname} {!item.mname && !item.mname} {item.lname}{" "}
                    {!item.extname && item.extname}
                  </Typography>

                  <Typography>{item.position_name}</Typography>

                  <Typography>{item.dept_title}</Typography>
                </Item>
              ))}
          </Stack>
          {/* <p
            key={index}
            onClick={() => setTempData(item)}
            style={{
              backgroundColor:
                tempData & (tempData.id == item.id) ? "red" : "blue",
            }}
          >
            {item.fname} {!item.mname && !item.mname} {item.lname}{" "}
            {!item.extname && item.extname} {item.position_name}{" "}
            {item.dept_title}
          </p> */}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={handleCloseBTN}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              if (comptitle && comptitle === "PREPARED BY") {
                handleModalRowClick(
                  {
                    prepared_by: `${tempData.fname} ${tempData.mname} ${tempData.lname} ${tempData.extname}`,
                    prepared_by_position: tempData.position_name,
                  },
                  comptitle
                );
              } else if (comptitle && comptitle === "ENDORSED BY") {
                handleModalRowClick(
                  {
                    endorsed_by: `${tempData.fname} ${tempData.mname} ${tempData.lname} ${tempData.extname}`,
                    endorsed_by_position: tempData.position_name,
                    endorsed_by_department: tempData.dept_title,
                  },
                  comptitle
                );
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </CustomCenterModal>
  );
};

export default CustomJOinput;
