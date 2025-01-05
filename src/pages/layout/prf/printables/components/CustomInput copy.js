import React, { useState } from "react";
import "./CustomInput.css";
import { usePrfData } from "../context/PrintableDataProvider";

function CustomInput({
  title,
  tab,
  names,
  value,
  forRecommendedBy,
  recommendedByChange,
}) {
  value && console.log(value);
  names && console.log(names.byName);
  const { setPrfData } = usePrfData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrfData((prevDetails) => ({
      ...prevDetails,
      essentials: { ...prevDetails.essentials, [name]: value },
    }));
  };
  const handleApplyChange = (e) => {
    e.preventDefault();
    setPrfData((prev) => ({
      ...prev,
      essentials: tempData,
    }));
  };
  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body">
        {tab === "Essentials" ? (
          <>
            <div>
              <label htmlFor="">Name:</label>

              <input
                type="text"
                placeholder="Type Here..."
                name={names ? names.byName : ""}
                value={value ? value.byName : ""}
                onChange={handleInputChange}
              />

              {/* {title !== "SALARY" && (
                <button className="PRF_CustomInput_Button">View List</button>
              )} */}
            </div>
            <div>
              <label htmlFor="">Position:</label>

              <input
                type="text"
                placeholder="Type Here..."
                name={names ? names.position : ""}
                value={value ? value.position : ""}
                onChange={handleInputChange}
              />
            </div>
            {title === "ENDORSED BY" && (
              <div>
                <label htmlFor="">Department:</label>
                <input
                  type="text"
                  placeholder="Type Here..."
                  name={names ? names.department : ""}
                  value={value ? value.department : ""}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div>
              {title !== "SALARY" && (
                <button className="PRF_CustomInput_Button">View List</button>
              )}
              {title !== "SALARY" && (
                <button
                  className="PRF_CustomInput_Button"
                  onClick={handleApplyChange}
                >
                  Apply
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="PRF_CustomInput_Design_Container">
              <div className="PRF_CustomInput_Design_Image_Container">
                <h3>NO IMAGE</h3>
              </div>
              <div className="PRF_CustomInput_Design_Input">
                <div>
                  <h6 className="PRF_CustomInput_Design_Input_Department">
                    {" "}
                    Department:
                  </h6>
                  <h5>CICTD</h5>
                </div>
                <div>
                  <button className="PRF_CustomInput_Button">UPLOAD</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomInput;
