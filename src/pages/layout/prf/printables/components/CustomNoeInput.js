import React, { useEffect, useState } from "react";
import CustomInputTemplate from "./CustomInputTemplate";
import {
  Box,
  Button,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { usePrfData } from "../context/PrintableDataProvider";
import { formatName } from "../../../customstring/CustomString";
import { CustomCenterModal } from "../../components/export_components/ExportComp";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function CustomNoeInput({ title }) {
  const [data, setData] = useState();
  const [addressData, setaddressData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState();
  const { prfData } = usePrfData();

  const getAddressById = (id) => {
    const data = addressData.find((item) => item.id === id);
    console.log("dataaddress", data);
    return data ? data : null; // Returns the address if found, otherwise null
  };

  const getNameById = (id) => {
    const currentName = data.find((item) => item.id === id);
    return currentName;
  };
  useEffect(() => {
    prfData && setData(prfData.SummaryOfCandidApplicantDetails);
    prfData && setaddressData(prfData.address);
  }, [prfData]);
  return (
    <>
      <CustomModalNoe
        openner={open}
        comptitle={"Edit Address"}
        handleCloseBTN={() => {
          setOpen(false);
          setOpenId();
        }}
        data={data}
        openId={openId}
        addressData={addressData}
      />
      <CustomInputTemplate title={title}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          {data &&
            data.map((item, index) => (
              <Item
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(true);
                  setOpenId(item.id);
                }}
              >
                <Box>
                  <p>Name:</p>
                  <p>
                    {formatName(
                      item.fname,
                      item.mname,
                      item.lname,
                      item.extname,
                      0
                    ) || "APPLICANT NAME NOT FOUND"}
                  </p>
                </Box>
                <Box>
                  <p>Address:</p>
                  <p>
                    {getAddressById(item.id)
                      ? `${getAddressById(item.id).resiAddress || ""} ${
                          getAddressById(item.id).permaAddress & ", "
                        } ${getAddressById(item.id).permaAddress || ""}`
                      : "No Data"}
                  </p>
                </Box>
              </Item>
            ))}
        </Stack>
      </CustomInputTemplate>
    </>
  );
}

const CustomModalNoe = ({
  openner,
  comptitle,
  handleCloseBTN,
  openId,
  data,
  addressData,
}) => {
  const matches = useMediaQuery("(min-width: 565px)");
  const [currentName, setCurrentName] = useState();
  const [currentAddress, setCurrentAddress] = useState();
  const { setPrfData } = usePrfData();
  console.log("currentApplicantname", currentName);
  console.log("currentApplicant", currentAddress);

  const currentSetter = () => {
    setCurrentName(data.find((item) => item.id === openId));
    setCurrentAddress(addressData.find((item) => item.id === openId));
  };

  const fieldName = [
    { key: "fname", label: "First Name" },
    { key: "lname", label: "Last Name" },
    { key: "mname", label: "Middle Name" },
    { key: "extname", label: "Extension" },
  ];

  const fieldAddress = [
    { key: "resiAddress", label: "Residential Address" },
    { key: "permaAddress", label: "Permanent Address" },
  ];

  useEffect(() => {
    data && addressData && openId && currentSetter();
  }, [openId]);
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
        {fieldName.map((item) => (
          <TextField
            id="outlined-basic"
            label={item.label}
            variant="outlined"
            sx={{ width: "100%" }}
            value={currentName ? currentName[item.key] : ""}
            onChange={(e) =>
              setCurrentName((prev) => ({
                ...prev,
                [item.key]: e.target.value,
              }))
            }
          />
        ))}
        {fieldAddress.map((item) => (
          <TextField
            id="outlined-basic"
            label={item.label}
            variant="outlined"
            sx={{ width: "100%" }}
            value={currentAddress ? currentAddress[item.key] : ""}
            onChange={(e) =>
              setCurrentAddress((prev) => ({
                ...prev,
                id: openId,
                [item.key]: e.target.value,
              }))
            }
          />
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={handleCloseBTN}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              setPrfData((prev) => ({
                ...prev,
                SummaryOfCandidApplicantDetails:
                  prev.SummaryOfCandidApplicantDetails.map((item) =>
                    item.id === openId ? currentName : item
                  ),

                address: prev.address.find((item) => item.id === openId)
                  ? prev.address.map((item) =>
                      item.id === openId ? currentAddress : item
                    )
                  : [...prev.address, currentAddress],
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
export default CustomNoeInput;
