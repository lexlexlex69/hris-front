import React, { useState } from "react"
import "./CustomInput.css"
import { usePrfData } from "../context/PrintableDataProvider"
import { Button, TextField } from "@mui/material"

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
                handleViewClick(title)
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
  )
}

export default CustomInput
