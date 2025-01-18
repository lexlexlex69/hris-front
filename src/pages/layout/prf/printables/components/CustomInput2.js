import React, { useState } from "react"
import "./CustomInput2.css"
import { usePrfData } from "../context/PrintableDataProvider"
import { FormControlLabel, Radio, RadioGroup } from "@mui/material"

function CustomInput2({ title, forRecommendedBy, recommendedByChange }) {
  forRecommendedBy && console.log("forRecommendedBy", forRecommendedBy)
  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body2">
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={
            forRecommendedBy &&
            forRecommendedBy.find((item) => item.rater_remark === "selected")
              .rater_emp_id
          }
          // onChange={handleChange}
          onChange={recommendedByChange}
        >
          {forRecommendedBy &&
            forRecommendedBy.map((item, index) => (
              <FormControlLabel
                value={item.rater_emp_id}
                control={<Radio />}
                label={` ${item.lname}
                ${", "}
                ${item.fname}`}
              />
            ))}
        </RadioGroup>
        {/* {forRecommendedBy &&
          forRecommendedBy.map((item, index) => (
            <div key={index}>
              <input
                id={item.rater_emp_id}
                type="radio"
                value=""
                name="default-radio"
                // className="custom-radio-group-input"
                checked={item.rater_remark === "selected"}
                onChange={() => recommendedByChange(item.rater_emp_id)}
              />
              <label
                htmlFor={item.rater_emp_id}
                className="custom-radio-group-label"
              >
                {item.lname}
                {", "}
                {item.fname}
              </label>
            </div>
          ))} */}
      </div>
    </div>
  )
}

export default CustomInput2
