import React, { useState } from "react";
import "./TabComponent.css"; // Import the CSS file
import DiamondIcon from "@mui/icons-material/Diamond";
import StyleIcon from "@mui/icons-material/Style";
import CustomInput from "./CustomInput";
import { usePrfData } from "../context/PrintableDataProvider";

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState("essentials");
  const { prfData, recommendedByChange, forRecommendedBy } = usePrfData();

  prfData && console.log(prfData.SummaryOfCandidFindings);

  console.log("forRecommendedBy", forRecommendedBy);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <button
          onClick={() => handleTabClick("essentials")}
          className={`tab-button ${activeTab === "essentials" ? "active" : ""}`}
        >
          <DiamondIcon />
          Essentials
        </button>
        <button
          onClick={() => handleTabClick("design")}
          className={`tab-button ${activeTab === "design" ? "active" : ""}`}
        >
          <StyleIcon />
          Design
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "essentials" && (
          <div className="tab-content-body">
            <CustomInput
              title={"PREPARED BY"}
              tab={"Essentials"}
              names={{
                byName: "prepared_by",
                position: "prepared_by_position",
              }}
              value={
                prfData
                  ? {
                      byName: prfData.essentials.prepared_by,
                      position: prfData.essentials.prepared_by_position,
                    }
                  : ""
              }
            />
            <CustomInput
              title={"ENDORSED BY"}
              tab={"Essentials"}
              names={{
                byName: "endorsed_by",
                position: "endorsed_by_position",
                department: "endorsed_by_department",
              }}
              value={
                prfData
                  ? {
                      byName: prfData.essentials.endorsed_by,
                      position: prfData.essentials.endorsed_by_position,
                      department: prfData.essentials.endorsed_by_department,
                    }
                  : ""
              }
            />
            <CustomInput
              title={"RECOMMENDED BY"}
              tab={"Essentials"}
              forRecommendedBy={forRecommendedBy}
              recommendedByChange={recommendedByChange}
            />
            <CustomInput title={"SALARY"} tab={"Essentials"} />
          </div>
        )}
        {activeTab === "design" && (
          <div className="tab-content-body">
            {/* <h2>Design</h2>
            <p>This is the content for the Design tab.</p> */}
            <CustomInput title={"HEADER"} tab={"design"} />
            <CustomInput title={"FOOTER"} tab={"design"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
