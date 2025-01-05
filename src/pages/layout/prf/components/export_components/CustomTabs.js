import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

function CustomTabs({ tabsArr, tabsLabel, children, height }) {
  const [value, setValue] = useState(tabsArr[0].value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', height: height ? height : "500px" }}>
      <Tabs value={value} onChange={handleChange} aria-label={tabsLabel} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {tabsArr.map((tab) => (
          <Tab value={tab.value} label={tab.label} key={tab.value} />
        ))}
      </Tabs>
      <Box sx={{ p: 3 }}>
        {React.Children.map(children, (child) =>
          child.props.tabValue === value ? child : null
        )}
      </Box>
    </Box>
  );
}

export default CustomTabs;
