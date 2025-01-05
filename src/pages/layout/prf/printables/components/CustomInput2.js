import React, { useState } from "react";
import "./CustomInput2.css";
import { usePrfData } from "../context/PrintableDataProvider";

function CustomInput2({
  title,
  forRecommendedBy,
  recommendedByChange,
  // tab,
  // names,
  // value,
  // forRecommendedBy,
  // recommendedByChange,
}) {
  // value && console.log(value);
  // names && console.log(names.byName);
  // const { setPrfData } = usePrfData();

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setPrfData((prevDetails) => ({
  //     ...prevDetails,
  //     essentials: { ...prevDetails.essentials, [name]: value },
  //   }));
  // };
  // const handleApplyChange = (e) => {
  //   e.preventDefault();
  //   setPrfData((prev) => ({
  //     ...prev,
  //     essentials: tempData,
  //   }));
  // };
  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body2">
        {forRecommendedBy &&
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
          ))}
      </div>
    </div>
  );
}

export default CustomInput2;
