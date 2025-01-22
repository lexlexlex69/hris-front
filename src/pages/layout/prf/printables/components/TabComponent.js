import React, { useState } from "react";
import "./TabComponent.css"; // Import the CSS file
import DiamondIcon from "@mui/icons-material/Diamond";
import StyleIcon from "@mui/icons-material/Style";
import CustomInput from "./CustomInput";
import { usePrfData } from "../context/PrintableDataProvider";
import CustomInput2 from "./CustomInput2";
import CustomInput3 from "./CustomInput3";
import CustomSelect from "./CustomSelect";
import CustomJOinput from "./CustomJOinput";
import CustomNoeInput from "./CustomNoeInput";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs } from "@mui/material";
import CustomFooterInput from "./CustomFooterInput";

const TabComponent = ({ process }) => {
  const {
    prfData,
    recommendedByChange,
    forRecommendedBy,
    forDesignHeader,
    forDesignFooter,
    headerImg,
    footerImg,
  } = usePrfData();

  prfData && console.log("prfData", prfData);

  console.log("forRecommendedBy", forRecommendedBy);

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="full width tabs example"
          height="500px"
        >
          <Tab
            icon={<DiamondIcon />}
            iconPosition="start"
            label="Essentials"
            value="1"
          />
          <Tab
            icon={<StyleIcon />}
            disabled={process === "jo"}
            iconPosition="start"
            label="Design"
            value="2"
          />
        </Tabs>
        <Box
          sx={{
            backgroundColor: "white",
            height: "84vh",
            overflow: "auto",
            borderRight: "2px solid #d1d1d1",
            paddingBottom: "30px",
          }}
        >
          <TabPanel value="1">
            <div className="tab-content-body">
              {process === "summaryofcandid" && (
                <>
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
                            department:
                              prfData.essentials.endorsed_by_department,
                          }
                        : ""
                    }
                  />
                  <CustomInput2
                    title={"Recommended By:"}
                    forRecommendedBy={forRecommendedBy ? forRecommendedBy : ""}
                    recommendedByChange={recommendedByChange}
                  />
                </>
              )}

              {/* <CustomInput title={"SALARY"} tab={"Essentials"} /> */}
              {process !== "summaryofcandid" && process !== "jo" && (
                <>
                  <CustomSelect title={"SALARY"} />
                  {process === "en" && (
                    <CustomFooterInput
                      title={"Footer Title"}
                      defaultValue={"CHRMO.02/KJDM"}
                    />
                  )}
                </>
              )}
              {process === "jo" && (
                <>
                  <CustomJOinput
                    title={"Job Description"}
                    objectName="job_desc"
                  />
                  <CustomJOinput
                    title={"Terms and Conditions"}
                    objectName="terms_condi"
                  />
                  <CustomFooterInput
                    title={"Footer Title"}
                    defaultValue={"CHRMO.02/AKP"}
                  />
                </>
              )}
              {(process === "noe" || process === "atr") && (
                <>
                  <CustomNoeInput
                    title={"Applicants Details"}
                    process={process}
                  />
                </>
              )}
              {process === "atr" && (
                <>
                  <CustomInput
                    title={"Report To"}
                    tab={"Essentials"}
                    names={{
                      byName: "assigned_by",
                      position: "position",
                    }}
                    value={
                      prfData
                        ? {
                            byName: prfData.signatory?.dept_head.assigned_by,
                            position: prfData.signatory?.dept_head.position,
                          }
                        : ""
                    }
                  />
                </>
              )}
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="tab-content-body">
              <CustomInput3
                title={"HEADER"}
                imgUrl={forDesignHeader}
                designPreview={headerImg ? headerImg.preview : ""}
              />
              <CustomInput3
                title={"FOOTER"}
                imgUrl={forDesignFooter}
                designPreview={footerImg ? footerImg.preview : ""}
              />
            </div>
          </TabPanel>
        </Box>
      </TabContext>
    </>
  );
};

export default TabComponent;
