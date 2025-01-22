import React, { useState } from "react";
import "./CustomInput.css";
import { usePrfData } from "../context/PrintableDataProvider";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CustomCenterModal } from "../../components/export_components/ExportComp";
import { Item } from "./CustomNoeInput";

function CustomInput({ title, names, value }) {
  value && console.log(value);
  names && console.log(names.byName);
  const { setPrfData, handleViewClick } = usePrfData();
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (title === "Report To") {
      setPrfData((prevDetails) => ({
        ...prevDetails,
        signatory: {
          ...prevDetails.signatory,
          dept_head: {
            ...prevDetails.signatory.dept_head,
            [name]: value,
          },
        },
      }));
    } else {
      setPrfData((prevDetails) => ({
        ...prevDetails,
        essentials: { ...prevDetails.essentials, [name]: value },
      }));
    }
  };

  return (
    <>
      <CustomModalSummary
        openner={open}
        comptitle={title}
        handleCloseBTN={() => {
          setOpen(false);
        }}
      />
      <div className="PRF_CustomInput">
        <div className="PRF_CustomInput_Header">{title}</div>
        <div className="PRF_CustomInput_Body">
          {title === "Report To" ? (
            <>
              <TextField
                id="outlined-basic"
                label={"Name"}
                variant="outlined"
                sx={{ width: "100%" }}
                name={names ? names.byName : ""}
                value={value ? value.byName : ""}
                onChange={handleInputChange}
              />

              <TextField
                id="outlined-basic"
                label={"Position"}
                variant="outlined"
                sx={{ width: "100%" }}
                name={names ? names.position : ""}
                value={value ? value.position : ""}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <TextField
                id="outlined-basic"
                label={"Name"}
                variant="outlined"
                sx={{ width: "100%" }}
                name={names ? names.byName : ""}
                value={value ? value.byName : ""}
                onChange={handleInputChange}
              />

              <TextField
                id="outlined-basic"
                label={"Position"}
                variant="outlined"
                sx={{ width: "100%" }}
                name={names ? names.position : ""}
                value={value ? value.position : ""}
                onChange={handleInputChange}
              />

              {title === "ENDORSED BY" && (
                <TextField
                  id="outlined-basic"
                  label={"Department"}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  name={names ? names.department : ""}
                  value={value ? value.department : ""}
                  onChange={handleInputChange}
                />
              )}
            </>
          )}

          <div>
            {title !== "SALARY" && (
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  setOpen(true);
                }}
              >
                {" "}
                View List
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const CustomModalSummary = ({ openner, comptitle, handleCloseBTN }) => {
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
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={handleCloseBTN}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
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
              } else if (comptitle && comptitle === "Report To") {
                handleModalRowClick(
                  {
                    assigned_by: `${tempData.fname} ${tempData.mname} ${tempData.lname} ${tempData.extname}`,
                    position: tempData.position_name,
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

export default CustomInput;
