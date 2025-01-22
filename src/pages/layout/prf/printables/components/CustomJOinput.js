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
  IconButton,
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
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CustomCenterModal,
  phpPesoIntFormater,
} from "../../components/export_components/ExportComp";
import { toWords } from "number-to-words";
import CustomInputTemplate from "./CustomInputTemplate";
import { Item } from "./CustomNoeInput";

function CustomJOinput({ title, objectName }) {
  const { setPrfData, handleRowClick, prfData } = usePrfData();
  const [inputState, setInputState] = useState("");
  const [objectState, setObjectState] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("prfDatajo", prfData);
    prfData &&
      setObjectState(JSON.parse(prfData.SummaryOfCandidPrfDetails[objectName]));
  }, [prfData]);

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
        <CustomModalJo
          openner={open}
          comptitle={`Edit ${title}`}
          handleCloseBTN={() => {
            setOpen(false);
          }}
          objectName={objectName}
          objectState={objectState}
          setObjectState={setObjectState}
          handleJobDescChange={handleJobDescChange}
          handleDeleteJobDesc={handleDeleteJobDesc}
        />
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
          sx={{ width: "100%" }}
        >
          Edit {title}
        </Button>
      </>
    </CustomInputTemplate>
  );
}

const CustomModalJo = ({
  openner,
  comptitle,
  handleCloseBTN,
  objectState,
  setObjectState,
  handleJobDescChange,
  handleDeleteJobDesc,
  objectName,
}) => {
  const matches = useMediaQuery("(min-width: 565px)");

  const {
    closeModal,
    handleRowClick,
    fetchEmployeeByName,
    employeeList,
    handleModalRowClick,
    modalTitle,
    setPrfData,
  } = usePrfData();

  const [name, setName] = useState();
  const [tempData, setTempData] = useState({});
  const [inputState, setInputState] = useState("");

  tempData && console.log("viewlist tempdata", tempData);

  const handleAddItem = () => {
    if (inputState.trim() === "") return;
    setObjectState([...objectState, inputState]);
    setInputState("");
  };

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
        <TextField
          id="outlined-basic"
          label={`Add item`}
          variant="outlined"
          sx={{ width: "100%" }}
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddItem}>
          Add
        </Button>
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "15px" }}
        ></Box>
        <Box>
          <Stack
            direction="column"
            // justifyContent="center"
            alignItems="center"
            spacing={1}
            overflow={"auto"}
            sx={{ maxHeight: "50vh", marginTop: "10px" }}
          >
            {objectState &&
              objectState.map((item, index) => (
                <Item
                  sx={{
                    display: "flex",
                    margin: "10px 0px",
                    alignItems: "center",
                    gap: "15px",
                    width: "100%",
                  }}
                >
                  <h5 style={{ margin: "0px", width: "30px" }}>{index + 1}</h5>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    sx={{ flex: 1 }}
                    multiline
                    maxRows={4}
                    value={item}
                    onChange={(e) => handleJobDescChange(index, e.target.value)}
                  />
                  <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={() => handleDeleteJobDesc(index)}
                  >
                    <DeleteIcon sx={{ color: "#ff7272" }} />
                  </IconButton>
                </Item>
              ))}
          </Stack>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={handleCloseBTN}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
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
            Save
          </Button>
        </Box>
      </Box>
    </CustomCenterModal>
  );
};

export default CustomJOinput;
