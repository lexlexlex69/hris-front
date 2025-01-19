import React, { useEffect, useState } from "react"
import CustomInputTemplate from "./CustomInputTemplate"
import {
  Box,
  Button,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { usePrfData } from "../context/PrintableDataProvider"
import { formatName } from "../../../customstring/CustomString"
import { CustomCenterModal } from "../../components/export_components/ExportComp"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}))

function CustomNoeInput({ title, process }) {
  const [data, setData] = useState()
  const [addressData, setaddressData] = useState([])
  const [signatory, setSignatory] = useState([])
  const [open, setOpen] = useState(false)
  const [openId, setOpenId] = useState()
  const { prfData } = usePrfData()

  const getAddressById = (ids) => {
    console.log("addressid", ids)
    if (!ids) {
      console.log("cant proceed")
    } else {
      const data =
        ids && addressData && addressData.find((item) => item.id === ids)
      console.log("dataaddress", data)
      return data ? data : null // Returns the address if found, otherwise null
    }
  }

  console.log("addressData.length", addressData.length > 0)

  const mergedData =
    data &&
    data.map((user) => {
      const userAddress = addressData.find((addr) => addr?.id === user?.id)
      return {
        ...user,
        perma: userAddress?.permaAddress || "No address available",
        resi: userAddress?.resiAddress || "No address available",
      }
    })

  console.log("mergedData", mergedData)
  useEffect(() => {
    prfData && setData(prfData.SummaryOfCandidApplicantDetails)
    prfData && setaddressData(prfData.address)
    process === "atr" && prfData && setSignatory(prfData.signatory?.dept_head)
  }, [prfData])
  return (
    <>
      <CustomModalNoe
        openner={open}
        comptitle={"Edit Details"}
        handleCloseBTN={() => {
          setOpen(false)
          setOpenId()
        }}
        data={data}
        openId={openId}
        addressData={addressData}
        signatory={signatory}
        process={process}
      />
      <CustomInputTemplate title={title}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          {mergedData &&
            mergedData.map((item, index) => (
              <Item
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(true)
                  setOpenId(item.id)
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
                {process === "atr" && (
                  <Box>
                    <p>Report to:</p>
                    <p
                      style={{
                        textWrap: "wrap",
                        textAlign: "right",
                        width: "80%",
                      }}
                    >
                      {signatory?.assigned_by}
                      {signatory?.position}
                    </p>
                  </Box>
                )}
                <Box>
                  <p>Address:</p>

                  <p
                    style={{
                      textWrap: "wrap",
                      textAlign: "right",
                      width: "80%",
                    }}
                  >
                    {`${item.perma} ${item.perma && item.resi && ","} ${
                      item.resi
                    }`}
                  </p>
                </Box>
              </Item>
            ))}
        </Stack>
      </CustomInputTemplate>
    </>
  )
}

const CustomModalNoe = ({
  openner,
  comptitle,
  handleCloseBTN,
  openId,
  data,
  addressData,
  signatory,
  process,
}) => {
  const matches = useMediaQuery("(min-width: 565px)")
  const [currentName, setCurrentName] = useState()
  const [currentAddress, setCurrentAddress] = useState()
  const [currentSignatory, setCurrentSignatory] = useState()
  const { setPrfData } = usePrfData()
  console.log("currentApplicantname", currentName)
  console.log("currentApplicant", currentAddress)

  const currentSetter = () => {
    setCurrentName(data.find((item) => item.id === openId))
    setCurrentAddress(addressData.find((item) => item?.id === openId))
    process === "atr" && setCurrentSignatory(signatory)
  }

  const fieldName = [
    { key: "fname", label: "First Name" },
    { key: "lname", label: "Last Name" },
    { key: "mname", label: "Middle Name" },
    { key: "extname", label: "Extension" },
  ]

  const fieldAddress = [
    { key: "resiAddress", label: "Residential Address" },
    { key: "permaAddress", label: "Permanent Address" },
  ]

  const fieldSignatory = [
    { key: "assigned_by", label: "Report To" },
    { key: "position", label: "Position" },
  ]
  useEffect(() => {
    data && addressData && openId && currentSetter()
  }, [openId])
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
        {process === "atr" &&
          fieldSignatory.map((item) => (
            <TextField
              id="outlined-basic"
              label={item.label}
              variant="outlined"
              sx={{ width: "100%" }}
              value={currentSignatory ? currentSignatory[item.key] : ""}
              onChange={(e) =>
                setCurrentSignatory((prev) => ({
                  ...prev,
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
              e.preventDefault()
              setPrfData((prev) => ({
                ...prev,
                SummaryOfCandidApplicantDetails:
                  prev.SummaryOfCandidApplicantDetails.map((item) =>
                    item.id === openId ? currentName : item
                  ),

                address:
                  currentAddress &&
                  prev.address.find((item) => item?.id === openId)
                    ? prev.address.map((item) =>
                        item?.id === openId ? currentAddress : item
                      )
                    : [...prev.address, currentAddress],
                signatory: {
                  ...prev.signatory,
                  dept_head: currentSignatory,
                },
              }))
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </CustomCenterModal>
  )
}
export default CustomNoeInput
