import React, { useEffect, useState } from "react";
import CustomTableBio from "./component/BioManage/CustomTableBio";
import CustomFab from "./component/BioManage/CustomFab";
import CustomAutoComplete from "./component/BioManage/CustomAutoComplete";
import CustomManualReExec from "./component/BioManage/CustomManualReExec";
import { Box } from "@mui/material";
import CustomFabHistory from "./component/BioManage/CustomFabHistory";

function BioManagement() {
  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Box sx={{ padding: "20px" }}>
        <Box
          sx={{
            margin: "15px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <CustomAutoComplete />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <CustomManualReExec />
            <CustomFabHistory />
            <CustomFab />
          </Box>
        </Box>
        <CustomTableBio />
      </Box>
    </Box>
  );
}

export default BioManagement;
