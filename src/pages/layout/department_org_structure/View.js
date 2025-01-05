import { Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, Typography, useMediaQuery } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDept } from "../prf/axios/prfRequest";
import ModuleHeaderText from "../moduleheadertext/ModuleHeaderText";
import { Search as SearchIcon, } from "@mui/icons-material";
import { getDeptOrgStruct2 } from "./api/departmentRequest";
import { toast } from "react-toastify";
import { buildTree, buildTreeNA, HeaderSearchDept } from "./api/component";
import { isEmptyObject } from "jquery";
// import "./department_style.css"

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

  if (loading) {
    return null
  }

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

  const [selectedNode, setSelectedNode] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeCode, setNodeCode] = useState(null);
  const [tempTreeD, setTempTreeD] = useState([])

  const [togglerDeptNA, setTogglerDeptNA] = useState(false)
  const [treeLoading, setTreeLoading] = useState(true)

  const [changes, setChanges] = useState({
    updatedNodes: [],
    newNodes: [],
    deletedNodes: []
  });

  const [testChanges, setTestChanges] = useState({
    updatedNodes: [],
    newNodes: [],
    deletedNodes: [],
  });

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
    setTreeLoading(true)
    setTestChanges((prevChanges) => ({
      updatedNodes: [],
      newNodes: [],
      deletedNodes: [],
    }))
    handleReloadData()
  }
  const handleSelectDept = (ev) => {
    setTreeData([])
    setSelectedDept(ev.target.value)
  }




  const handleNodeDoubleClick = (node) => {
    setSelectedNode(node);

    setNodeName(node.name);
    setNodeCode(node.code);
    setEditModalOpen(true);
  };
  const handleNodeClick = (e, node) => {
    e.preventDefault();
  };
  const updateTreeNode = (node, id, newName, newCode) => {
    if (node.id === id) {
      return { ...node, name: newName.toUpperCase(), code: newCode };
    } else if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => updateTreeNode(child, id, newName, newCode)),
      };
    }
    return node;
  };
  const deleteTreeNode = (node, idToDelete) => {
    if (node.id === idToDelete) {
      return null;
    } else if (node.children) {
      const filteredChildren = node.children
        .map((child) => deleteTreeNode(child, idToDelete))
        .filter((child) => child !== null);

      return { ...node, children: filteredChildren };
    }
    return node;
  };
  const addChildNode = (node, parentId, newChildNode) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newChildNode],
      };
    } else if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => addChildNode(child, parentId, newChildNode)),
      };
    }
    return node;
  };


  const handleEditNode = () => {
    if (!selectedNode) return;

    const updatedTreeData = updateTreeNode(treeData, selectedNode.id, nodeName, nodeCode);
    setTreeData(updatedTreeData);

    setTestChanges((prevChanges) => ({
      ...prevChanges, updatedNodes: [...prevChanges.updatedNodes, { id: selectedNode.id, newName: nodeName.toUpperCase(), code: nodeCode, lvl: selectedNode.lvl }]
    }))

    // Track updated node
    setChanges((prevChanges) => ({
      ...prevChanges,
      updatedNodes: [...prevChanges.updatedNodes, { ...selectedNode, name: nodeName, code: nodeCode }],
    }));

    setEditModalOpen(false);
  };
  const handleDeleteNode = () => {
    if (!selectedNode) return;

    const updatedTreeData = deleteTreeNode(treeData, selectedNode.id);
    setTreeData(updatedTreeData);

    setTestChanges((prevChanges) => ({
      ...prevChanges, deletedNodes: [...prevChanges.deletedNodes, { id: selectedNode.id, lvl: selectedNode.lvl }]
    }))

    // Track deleted node with additional identifiers if necessary
    setChanges((prevChanges) => ({
      ...prevChanges,
      deletedNodes: [...prevChanges.deletedNodes, {
        id: selectedNode.id,
        fr_key: selectedNode.fr_key,
        div_id: selectedNode.div_id,
        sec_id: selectedNode.sec_id,
        unit_id: selectedNode.unit_id,
      }],
    }));

    setEditModalOpen(false);
  };
  const handleAddChildNode = () => {
    if (!selectedNode) return;

    let newChildNode = {}
    newChildNode.id = Math.random();
    newChildNode.under_id = selectedNode.id;
    newChildNode.name = 'New Child Node';
    newChildNode.code = null;
    newChildNode.lvl = selectedNode.lvl + 1;

    const updatedTreeData = addChildNode(treeData, selectedNode.id, newChildNode);
    setTreeData(updatedTreeData);

    setTestChanges((prevChanges) => ({
      ...prevChanges,
      newNodes: [...prevChanges.newNodes, { id: newChildNode.id, name: newChildNode.name.toUpperCase(), under_id: newChildNode.under_id, lvl: selectedNode.lvl + 1 }]
    }))

    // Track new node
    setChanges((prevChanges) => ({
      ...prevChanges,
      newNodes: [...prevChanges.newNodes, newChildNode],
    }));

    setEditModalOpen(false);
    setSelectedNode(null)
  };


  // // Function to render tree nodes recursively
  const renderTree = (node) => (
    <li key={node.name + node.code + node.id} className="tree-li">
      <a href="#" className="tree-link" onClick={(e) => handleNodeClick(e, node)} onDoubleClick={() => handleNodeDoubleClick(node)}>
        <span className="tree-span">{node.name}</span>
      </a>
      {node.children && node.children.length > 0 && (
        <ul className="tree-ul">
          {node.children.map((child) => renderTree(child))}
        </ul>
      )}
    </li>
  );

  // const handleSubmitChanges = () => {
  //   // console.log('Submitting changes to Laravel DB:', testChanges);

  //   // const prepareData = (node) => {
  //   //     const preparedNode = {
  //   //         id: node.id,
  //   //         name: node.name,
  //   //         code: node.code,
  //   //         fr_key: node.fr_key, // Include fr_key for consistency
  //   //         children: node.children ? node.children.map(prepareData) : []
  //   //     };
  //   //     return preparedNode;
  //   // };

  //   // const department = prepareData(treeData);

  //   // const changesPayload = {
  //   //     department,
  //   //     updatedNodes: changes.updatedNodes.map(node => ({
  //   //         id: node.id,
  //   //         fr_key: node.fr_key,
  //   //         div_name: node.div_name || node.name, // Adjust for updated names
  //   //         div_code: node.code,
  //   //         sec_name: node.sec_name || node.name,
  //   //         sec_code: node.code,
  //   //         unit_name: node.unit_name || node.name,
  //   //         uni_code: node.code
  //   //     })),
  //   //     newNodes: changes.newNodes.map(node => ({
  //   //         under_id: node.under_id,
  //   //         name: node.name,
  //   //         code: node.code,
  //   //         div_name: node.div_name || node.name,
  //   //         sec_name: node.sec_name || node.name,
  //   //         unit_name: node.unit_name || node.name,
  //   //     })),
  //   //     deletedNodes: changes.deletedNodes.map(node => ({
  //   //         id: node.id,
  //   //         fr_key: node.fr_key,
  //   //         div_name: node.div_name || node.name,
  //   //         sec_name: node.sec_name || node.name,
  //   //         unit_name: node.unit_name || node.name,
  //   //     }))
  //   // };

  //   Swal.fire({
  //     title: "Click submit to continue?",
  //     icon: "info",
  //     showCancelButton: true,
  //     cancelButtonColor: "#d33",
  //     confirmButtonColor: "#3085d6",
  //     confirmButtonText: "Submit",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       enqueueRequest(async () => {
  //         try {
  //           const res = await updateDeptOrgStruct(testChanges);
  //           // console.log(res);
  //           if (res.data.status === 200) {
  //             toast.success(res.data.message);
  //           } else {
  //             toast.error(res.data.message);
  //           }
  //           setTestChanges((prevChanges) => ({
  //             updatedNodes: [],
  //             newNodes: [],
  //             deletedNodes: [],
  //           }))
  //           handleReloadData();
  //         } catch (error) {
  //           toast.error(error.message);
  //         }
  //       });
  //     }
  //   });
  // };

  const handleReloadData = () => {
    // enqueueRequest(async () => {
    //     try {
    //         const result = await getDeptOrgStruct2({ 'dept_code': selectedDept });
    //         const { divisions, sections, units } = result.data.data;
    //         const department = deptData.find(dept => dept.dept_code === selectedDept);
    //         const tree = buildTree(department, divisions, sections, units);
    //         // console.log(tree)
    //         setTreeData(tree)
    //     } catch (error) {
    //         toast.error(error.message);
    //     }
    // });
    enqueueRequest(async () => {
      try {
        const result = await getDeptOrgStruct2({ 'dept_code': selectedDept });
        const { divisions, sections, units } = result.data.data;
        setTempTreeD(result.data.data)
        const department = deptData.find(dept => dept.dept_code === selectedDept);
        let tree = [];
        console.log(togglerDeptNA)
        switch (togglerDeptNA) {
          case true:
            tree = buildTreeNA(department, divisions, sections, units); // tree wo NA
            setTreeData(tree)
            break;
          case false:
            tree = buildTree(department, divisions, sections, units); // tree w NA
            setTreeData(tree)
            break;
          default:
            toast.warning('Ops, something went wrong!');
            break;
        }

      } catch (error) {
        toast.error(error.message);
      } finally {
        setTreeLoading(false)
      }
    });
  }

  const handleToggleNA = (ev) => {
    setTogglerDeptNA(!togglerDeptNA)
  }

  return (
    <>
      {!loading ?
        <Box sx={{ margin: "0 10px 10px 10px" }}>
          <ModuleHeaderText title="DEPARTMENT ORGANIZATION STRUCTURE" />
          <HeaderSearchDept deptList={deptData} selectedDept={selectedDept} handleSearchBtn={handleSearchBtn} handleSelectDept={handleSelectDept} switchTogg={togglerDeptNA} handleToggleNA={handleToggleNA}></HeaderSearchDept>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            {treeLoading && isEmptyObject(treeData) ? (
              <>
                <Typography variant="subtitle1" textAlign="center" fontWeight="normal">
                  Click on the Search button to display department organization structure.
                </Typography>
              </>
            ) : (
              <>
                <Box>
                  <div className="tree">
                    <ul className="tree-ul">{renderTree(treeData)}</ul>
                  </div>
                </Box>
              </>
            )}
          </Box>
        </Box>
        :
        <Typography variant="h6" align="center">
          No Data Found
        </Typography>
      }
    </>
  )
}


// const buildTree = (department, divisions, sections, units) => {
//   const divisionsMap = divisions.reduce((acc, div) => {
//     if (div.div_name !== 'N/A') {
//       acc[div.id] = { ...div, name: div.div_name, code: div.div_code, lvl: div.lvl, children: [] };
//     }
//     return acc;
//   }, {});

//   const sectionsMap = sections.reduce((acc, sec) => {
//     if (sec.sec_name !== 'N/A') {
//       acc[sec.id] = { ...sec, name: sec.sec_name, code: sec.sec_code, lvl: sec.lvl, children: [] };
//     }
//     return acc;
//   }, {});

//   units.forEach(unit => {
//     if (unit.unit_name !== 'N/A' && sectionsMap[unit.fr_key]) {
//       sectionsMap[unit.fr_key].children.push({ ...unit, id: unit.id, name: unit.unit_name, code: unit.unit_code, lvl: unit.lvl, children: [] });
//     }
//   });

//   Object.values(sectionsMap).forEach(section => {
//     if (divisionsMap[section.fr_key]) {
//       divisionsMap[section.fr_key].children.push(section);
//     }
//   });

//   // Sorting children at each level
//   Object.values(sectionsMap).forEach(section => {
//     section.children.sort((a, b) => a.code - b.code);
//   });

//   Object.values(divisionsMap).forEach(division => {
//     division.children.sort((a, b) => a.code - b.code);
//   });

//   const departmentNode = {
//     id: department.id,
//     name: department.dept_title,
//     dept_code: department.dept_code,
//     execs_legis: department.execs_legis,
//     short_name: department.short_name,
//     lvl: 1,
//     children: Object.values(divisionsMap).sort((a, b) => a.code - b.code)
//   };

//   return departmentNode;
// };

// const buildTree = (department, divisions, sections, units) => {
//   const divisionsMap = divisions.reduce((acc, div) => {
//     if (div.div_name !== 'N/A') {
//       acc[div.id] = { ...div, name: div.div_name, code: div.div_code, lvl: div.lvl, children: [] };
//     }
//     return acc;
//   }, {});

//   const sectionsMap = sections.reduce((acc, sec) => {
//     if (sec.sec_name !== 'N/A') {
//       acc[sec.id] = { ...sec, name: sec.sec_name, code: sec.sec_code, lvl: sec.lvl, children: [] };
//     }
//     return acc;
//   }, {});

//   units.forEach(unit => {
//     if (unit.unit_name !== 'N/A' && sectionsMap[unit.fr_key]) {
//       sectionsMap[unit.fr_key].children.push({ ...unit, id: unit.id, name: unit.unit_name, code: unit.unit_code, lvl: unit.lvl, children: [] });
//     }
//   });

//   Object.values(sectionsMap).forEach(section => {
//     if (divisionsMap[section.fr_key]) {
//       divisionsMap[section.fr_key].children.push(section);
//     }
//   });

//   // Sorting children at each level
//   Object.values(sectionsMap).forEach(section => {
//     section.children.sort((a, b) => a.code - b.code);
//   });

//   Object.values(divisionsMap).forEach(division => {
//     division.children.sort((a, b) => a.code - b.code);
//   });

//   const departmentNode = {
//     id: department.id,
//     name: department.dept_title,
//     dept_code: department.dept_code,
//     execs_legis: department.execs_legis,
//     short_name: department.short_name,
//     lvl: 1,
//     children: Object.values(divisionsMap).sort((a, b) => a.code - b.code)
//   };

//   return departmentNode;
// };