import React, { useState } from "react";
import "./CustomInput2.css";
import { usePrfData } from "../context/PrintableDataProvider";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

function CustomInput2({ title, forRecommendedBy, recommendedByChange }) {
  forRecommendedBy && console.log("forRecommendedBy", forRecommendedBy);

  const currentSelected =
    forRecommendedBy &&
    forRecommendedBy.find((item) => item.rater_remark === "selected")
      .rater_emp_id;
  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body2">
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={currentSelected}
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
                sx={{
                  color:
                    currentSelected === item.rater_emp_id
                      ? "#1976d2"
                      : "inherit",
                }}
              />
            ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default CustomInput2;
