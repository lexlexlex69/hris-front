import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDept } from "../../prf/axios/prfRequest";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { Search as SearchIcon, } from "@mui/icons-material";
import { getDeptOrgStruct2 } from "./departmentRequest";
import { toast } from "react-toastify";

const DeptOrgStateContext = createContext(null);

function View() {
  const matches = useMediaQuery('(min-width:65%)');
  const [userId, setUserId] = useState(localStorage.getItem('hris_employee_id'));
  const [deptData, setDeptData] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      Swal.fire({
        title: 'Loading...',
        icon: "info",
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });
      try {
        const [response1] = await Promise.all([
          getDept(),
        ])
        setDeptData(response1.data.data)
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the data.',
          allowOutsideClick: true,
          showCancelButton: true,
          showConfirmButton: true,
        });
      } finally {
        setLoading(false);
        Swal.close();
      }
    };
    fetchData();
  }, []);

  const contextValues = {
    matches, userId, deptData, loading, setLoading,
  }

  return (
    <DeptOrgStateContext.Provider value={contextValues}>
      <ViewDeptComponent />
    </DeptOrgStateContext.Provider>
  )
}

export default View


function ViewDeptComponent() {
  const { matches, userId, deptData, loading, setLoading, } = useContext(DeptOrgStateContext)
  const [selectedDept, setSelectedDept] = useState(null)
  const [treeData, setTreeData] = useState([])
  const [requestQueue, setRequestQueue] = useState([]);
  const [processingQueue, setProcessingQueue] = useState(false);
  const [searchTrig, setSearchTrig] = useState(true)

  const processQueue = async () => {
    if (processingQueue || requestQueue.length === 0) return;
    setProcessingQueue(true);
    const currentRequest = requestQueue[0];
    try {
      await currentRequest();
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setRequestQueue(prevQueue => prevQueue.slice(1));
      setProcessingQueue(false);
    }
  };
  useEffect(() => {
    if (!processingQueue) {
      processQueue();
    }
  }, [requestQueue, processingQueue]);
  const enqueueRequest = (requestFn) => {
    setRequestQueue(prevQueue => [...prevQueue, requestFn]);
  };

  const handleSearchBtn = () => {
    if (selectedDept === null) {
      return toast.info('Please select a department')
    }
    setLoading(true)
    enqueueRequest(async () => {
      try {
        const result = await getDeptOrgStruct2({ 'dept_code': selectedDept });
        const { divisions, sections, units } = result.data.data;
        const department = deptData.find(dept => dept.dept_code === selectedDept);
        const tree = buildTree(department, divisions, sections, units);

        setTreeData(tree)
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false)
        setSearchTrig(false)
      }
    });
  }

  const handleSelectDept = (ev) => {
    setTreeData([])
    setSelectedDept(ev.target.value)
    setSearchTrig(true)
  }

  if (loading) {
    return null
  }

  // // Function to render tree nodes recursively
  const renderTree = (node) => (
    <li key={node.name + node.code + node.id} className="tree-li">
      <div href="#" className="tree-link">
        <span className="tree-span">{node.name}</span>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="tree-ul">
          {node.children.map((child) => renderTree(child))}
        </ul>
      )}
    </li>
  );


  // const handleReloadData = () => {
  //   enqueueRequest(async () => {
  //     try {
  //       const result = await getDeptOrgStruct2({ 'dept_code': selectedDept });
  //       const { divisions, sections, units } = result.data.data;
  //       const department = deptData.find(dept => dept.dept_code === selectedDept);
  //       const tree = buildTree(department, divisions, sections, units);
  //       // console.log(tree)
  //       setTreeData(tree)
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   });
  // }

  // useEffect(() => {
  //   if (!searchTrig) {
  //   } else {
  //     setSearchTrig(true)
  //   }
  // }, [selectedDept])

  return (
    <>
      <Box sx={{ margin: "0 10px 10px 10px" }}>
        <ModuleHeaderText title="DEPARTMENT ORGANIZATION STRUCTURE" />
        <Box sx={{ margin: "10px 0px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} lg={4}>
                  <FormControl fullWidth>
                    <InputLabel id="dept-selector" size="small"> Select a Department </InputLabel>
                    <Select sx={{ whiteSpace: "nowrap !important", overflow: "hidden", textOverflow: "ellipsis !important" }} name="dept_selector" labelId="dept-selector" label="Select a Department" variant="outlined" size="small"
                      value={selectedDept}
                      onChange={(ev) => handleSelectDept(ev)}
                    >
                      {deptData.map((item, index) => (
                        <MenuItem key={"dept-" + item.id + index} value={item.dept_code}>
                          {item.dept_title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Box sx={{ display: "flex", gap: "2px", flexDirection: "row" }}>
                    <Button variant="contained" onClick={handleSearchBtn} >
                      <SearchIcon />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {searchTrig ? (
          <></>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              {treeData && selectedDept !== null ? (
                <Box>
                  <div className="tree">
                    <ul className="tree-ul">{renderTree(treeData)}</ul>
                  </div>
                </Box>
              ) : (
                <>
                  <Typography variant="subtitle1" textAlign="center" fontWeight="normal">
                    Click on the Search button to display department organization structure.
                  </Typography>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  )
}


const buildTree = (department, divisions, sections, units) => {
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