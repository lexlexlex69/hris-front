import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch } from "@mui/material";
import { Search as SearchIcon, } from "@mui/icons-material";




export const buildTree = (department, divisions, sections, units) => {
  const divisionsMap = divisions.reduce((acc, div) => {
    if (div.div_name !== 'N/A') {
      acc[div.id] = { ...div, name: div.div_name, code: div.div_code, lvl: div.lvl, children: [] };
    }
    return acc;
  }, {});

  const sectionsMap = sections.reduce((acc, sec) => {
    if (sec.sec_name !== 'N/A') {
      acc[sec.id] = { ...sec, name: sec.sec_name, code: sec.sec_code, lvl: sec.lvl, children: [] };
    }
    return acc;
  }, {});

  units.forEach(unit => {
    if (unit.unit_name !== 'N/A' && sectionsMap[unit.fr_key]) {
      sectionsMap[unit.fr_key].children.push({ ...unit, id: unit.id, name: unit.unit_name, code: unit.unit_code, lvl: unit.lvl, children: [] });
    }
  });

  Object.values(sectionsMap).forEach(section => {
    if (divisionsMap[section.fr_key]) {
      divisionsMap[section.fr_key].children.push(section);
    }
  });

  // Sorting children at each level
  Object.values(sectionsMap).forEach(section => {
    section.children.sort((a, b) => a.code - b.code);
  });

  Object.values(divisionsMap).forEach(division => {
    division.children.sort((a, b) => a.code - b.code);
  });

  const departmentNode = {
    id: department.id,
    name: department.dept_title,
    dept_code: department.dept_code,
    execs_legis: department.execs_legis,
    short_name: department.short_name,
    lvl: 1,
    children: Object.values(divisionsMap).sort((a, b) => a.code - b.code)
  };

  return departmentNode;
};




export const buildTreeNA = (department, divisions, sections, units) => {
  const divisionsMap = divisions.reduce((acc, div) => {
    // if (div.div_name !== 'N/A') {
    acc[div.id] = { ...div, name: div.div_name, code: div.div_code, lvl: div.lvl, children: [] };
    // }
    return acc;
  }, {});

  const sectionsMap = sections.reduce((acc, sec) => {
    // if (sec.sec_name !== 'N/A') {
    acc[sec.id] = { ...sec, name: sec.sec_name, code: sec.sec_code, lvl: sec.lvl, children: [] };
    // }
    return acc;
  }, {});

  units.forEach(unit => {
    // if (unit.unit_name !== 'N/A' && sectionsMap[unit.fr_key]) {
    sectionsMap[unit.fr_key].children.push({ ...unit, id: unit.id, name: unit.unit_name, code: unit.unit_code, lvl: unit.lvl, children: [] });
    // }
  });

  Object.values(sectionsMap).forEach(section => {
    if (divisionsMap[section.fr_key]) {
      divisionsMap[section.fr_key].children.push(section);
    }
  });

  // Sorting children at each level
  Object.values(sectionsMap).forEach(section => {
    section.children.sort((a, b) => a.code - b.code);
  });

  Object.values(divisionsMap).forEach(division => {
    division.children.sort((a, b) => a.code - b.code);
  });

  const departmentNode = {
    id: department.id,
    name: department.dept_title,
    dept_code: department.dept_code,
    execs_legis: department.execs_legis,
    short_name: department.short_name,
    lvl: 1,
    children: Object.values(divisionsMap).sort((a, b) => a.code - b.code)
  };

  return departmentNode;
};


export function HeaderSearchDept({ children, deptList, selectedDept, handleSelectDept, handleSearchBtn, switchTogg, handleToggleNA }) {
  return (
    <Stack direction='row' spacing={1} sx={{ margin: "10px 0px", alignItems: 'center' }}>
      <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ width: '20rem' }}>
          <FormControl fullWidth>
            <InputLabel id="dept-selector" size="small"> Select a Department </InputLabel>
            <Select sx={{ whiteSpace: "nowrap!important", overflow: "hidden", textOverflow: "ellipsis !important", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }} name="dept_selector" labelId="dept-selector" label="Select a Department" variant="outlined" size="small"
              value={selectedDept} onChange={(ev) => handleSelectDept(ev)} >
              {deptList.map((item, index) => (
                <MenuItem key={"dept-" + item.id + index} value={item.dept_code}>
                  {item.dept_title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: "2px", flexDirection: "row" }}>
          <Button variant="contained" onClick={handleSearchBtn} >
            <SearchIcon />
          </Button>
        </Box>
        <Box>
          {children}
        </Box>
      </Stack>
      <Box sx={{ flex: '1 1 auto' }} />
      <Box>
        <FormControlLabel sx={{ display: 'block', }}
          control={<Switch checked={switchTogg} onChange={(ev) => handleToggleNA(ev)} name="na" color="primary" />}
          label="Show N/A"
        />
      </Box>
    </Stack>
  )
}