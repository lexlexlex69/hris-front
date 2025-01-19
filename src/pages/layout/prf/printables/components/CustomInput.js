import React, { useState } from "react"
import "./CustomInput.css"
import { usePrfData } from "../context/PrintableDataProvider"
import { Box, Button, TextField, useMediaQuery } from "@mui/material"
import { CustomCenterModal } from "../../components/export_components/ExportComp"

function CustomInput({
  title,
  tab,
  names,
  value,
  forRecommendedBy,
  recommendedByChange,
}) {
  value && console.log(value)
  names && console.log(names.byName)
  const { setPrfData, handleViewClick } = usePrfData()
  const [open, setOpen] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPrfData((prevDetails) => ({
      ...prevDetails,
      essentials: { ...prevDetails.essentials, [name]: value },
    }))
  }
  const handleApplyChange = (e) => {
    e.preventDefault()
    setPrfData((prev) => ({
      ...prev,
      essentials: tempData,
    }))
  }
  return (
    <>
      <CustomModalSummary
        openner={open}
        comptitle={title}
        handleCloseBTN={() => {
          setOpen(false)
        }}
      />
      <div className="PRF_CustomInput">
        <div className="PRF_CustomInput_Header">{title}</div>
        <div className="PRF_CustomInput_Body">
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
          <div>
            {title !== "SALARY" && (
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  // handleViewClick(title)
                  setOpen(true)
                }}
              >
                {" "}
                View List
              </Button>
            )}
            {/* {title !== "SALARY" && (
                <button
                className="PRF_CustomInput_Button"
                onClick={handleApplyChange}
                >
                Apply
                </button>
                )} */}
          </div>
        </div>
      </div>
    </>
  )
}

const CustomModalSummary = ({ openner, comptitle, handleCloseBTN }) => {
  const matches = useMediaQuery("(min-width: 565px)")

  const {
    closeModal,
    handleRowClick,
    fetchEmployeeByName,
    employeeList,
    handleModalRowClick,
    modalTitle,
  } = usePrfData()

  const [name, setName] = useState()
  const [tempData, setTempData] = useState({})
  tempData && console.log("viewlist tempdata", tempData)
  // const forHandleClickRow = (data) => {
  //   if (modalTitle && modalTitle === "PREPARED BY") {
  //     handleModalRowClick({
  //       prepared_by: `${data.fname} ${data.mname} ${data.lname} ${data.extname}`,
  //       prepared_by_position: data.position_name,
  //     })
  //   } else if (modalTitle && modalTitle === "ENDORSED BY") {
  //     handleModalRowClick({
  //       endorsed_by: `${data.fname} ${data.mname} ${data.lname} ${data.extname}`,
  //       endorsed_by_position: data.position_name,
  //       endorsed_by_department: data.dept_title,
  //     })
  //   }
  // }

  const currentSetter = () => {
    // setCurrentName(data.find((item) => item.id === openId))
    // setCurrentAddress(addressData.find((item) => item?.id === openId))
    // process === "atr" && setCurrentSignatory(signatory)
  }

  // useEffect(() => {
  //   data && addressData && openId && currentSetter()
  // }, [openId])
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
        <Box>
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
          {employeeList &&
            employeeList.map((item, index) => (
              <p
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
              </p>
            ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={handleCloseBTN}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault()
              if (comptitle && comptitle === "PREPARED BY") {
                handleModalRowClick(
                  {
                    prepared_by: `${tempData.fname} ${tempData.mname} ${tempData.lname} ${tempData.extname}`,
                    prepared_by_position: tempData.position_name,
                  },
                  comptitle
                )
              } else if (comptitle && comptitle === "ENDORSED BY") {
                handleModalRowClick(
                  {
                    endorsed_by: `${tempData.fname} ${tempData.mname} ${tempData.lname} ${tempData.extname}`,
                    endorsed_by_position: tempData.position_name,
                    endorsed_by_department: tempData.dept_title,
                  },
                  comptitle
                )
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </CustomCenterModal>
  )
}

export default CustomInput
