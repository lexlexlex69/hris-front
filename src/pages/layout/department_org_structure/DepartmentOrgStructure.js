import { createContext, useContext, useEffect, useState } from "react";
import { Backdrop, Box, Button, Card, CardContent, Container, DialogActions, DialogContent, DialogTitle, Divider, Fade, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Modal, Select, Stack, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import ModuleHeaderText from "../moduleheadertext/ModuleHeaderText";
import Swal from "sweetalert2";
import { getDept } from "../prf/axios/prfRequest";
import { toast } from "react-toastify";
import "./department_style.css"
import { getDeptOrgStruct2, updateDeptOrgStruct } from "./api/departmentRequest";
import { buildTree, buildTreeNA, HeaderSearchDept } from "./api/component";
import { isEmptyObject } from "jquery";
import axios from "axios";
import CustomDisplayDataTable from "../prf/components/export_components/CustomDisplayDataTable";

const DeptOrgStateContext = createContext(null);

const deptColumns = [
    { id: 'id', label: 'ID' },
    { id: 'dept_title', label: 'Department' },
    { id: 'div_name', label: 'Division' },
    { id: 'sec_name', label: 'Section' },
    { id: 'unit_name', label: 'Unit' },
]

function DepartmentOrgStructure() {
    const matches = useMediaQuery('(min-width:65%)');
    const [userId, setUserId] = useState(localStorage.getItem('hris_employee_id'));
    const [deptData, setDeptData] = useState([])
    const [loading, setLoading] = useState(true);
    const [tabledData, setTabledData] = useState([])
    let controller = new AbortController();

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
                const [response1, response2] = await Promise.all([
                    getDept(),
                    axios.get(`api/department-organization-structure/get-tabled-dept-org`, {}, { signal: controller.signal }),
                ])

                setDeptData(response1.data.data)
                setTabledData(response2.data.data)
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
        matches, userId, deptData, loading, tabledData
    }

    return (
        <DeptOrgStateContext.Provider value={contextValues}>
            <DeptComponent />
        </DeptOrgStateContext.Provider>
    )
}

export default DepartmentOrgStructure

function DeptComponent() {
    const { matches, userId, deptData, loading, tabledData, } = useContext(DeptOrgStateContext)
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

    const [filterTabledData, setFilterTabledData] = useState([])

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
        newChildNode.under_id = selectedNode.lvl === 1 ? selectedNode.dept_code : selectedNode.id;
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

    const handleSubmitChanges = () => {
        Swal.fire({
            title: "Click submit to continue?",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                enqueueRequest(async () => {
                    try {
                        const res = await updateDeptOrgStruct(testChanges);
                        // console.log(res);
                        if (res.data.status === 200) {
                            toast.success(res.data.message);
                        } else {
                            toast.error(res.data.message);
                        }
                        setTestChanges((prevChanges) => ({
                            updatedNodes: [],
                            newNodes: [],
                            deletedNodes: [],
                        }))
                        handleReloadData();
                    } catch (error) {
                        toast.error(error.message);
                    }
                });
            }
        });
    };

    const handleReloadData = () => {
        enqueueRequest(async () => {
            try {
                const [result,] = await Promise.all([
                    getDeptOrgStruct2({ 'dept_code': selectedDept }),
                ]);

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
                        console.log(tree)
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

        let filtered = tabledData.filter((i) => i.dept_code === selectedDept)
        setFilterTabledData(filtered)
    }

    const handleToggleNA = (ev) => {
        setTogglerDeptNA(!togglerDeptNA)
    }

    return (
        <>
            <Box sx={{ margin: "0 10px 10px 10px" }}>
                <ModuleHeaderText title="DEPARTMENT ORGANIZATION STRUCTURE" />
                <HeaderSearchDept deptList={deptData} selectedDept={selectedDept} handleSearchBtn={handleSearchBtn} handleSelectDept={handleSelectDept} switchTogg={togglerDeptNA} handleToggleNA={handleToggleNA}>
                    {(!isEmptyObject(treeData)) && (selectedDept) ?
                        <Box>
                            <Button variant="contained" color="success" onClick={handleSubmitChanges}>
                                Submit changes
                            </Button>
                        </Box>
                        :
                        <></>
                    }
                </HeaderSearchDept>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    {!treeLoading && !isEmptyObject(treeData) ? (
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
                {Object.keys(filterTabledData).length > 0 &&
                    <>
                        <br />
                        <Box>
                            <CustomDisplayDataTable columns={deptColumns} rows={filterTabledData} />
                        </Box>

                    </>
                }
            </Box>

            <Modal aria-labelledby="edit-modal-title" aria-describedby="edit-modal-description" open={editModalOpen} onClose={() => setEditModalOpen(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, }} >
                <Fade in={editModalOpen}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <DialogTitle id="edit-modal-title">Edit Node</DialogTitle>
                        <Divider />
                        <DialogContent>
                            <TextField label="Node Name" variant="outlined" fullWidth sx={{ mb: 2, mt: 2 }} value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
                            <TextField label="Node Code" variant="outlined" fullWidth sx={{ mb: 2, mt: 2 }} type="number" value={nodeCode} onChange={(e) => setNodeCode(e.target.value)} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditNode} color="primary" variant="contained" sx={{ mr: 2 }}> Save </Button>
                            <Button onClick={handleDeleteNode} color="error" variant="contained" sx={{ mr: 2 }}> Delete </Button>
                            <Button onClick={handleAddChildNode} color="primary" variant="contained"> Add Child </Button>
                        </DialogActions>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

