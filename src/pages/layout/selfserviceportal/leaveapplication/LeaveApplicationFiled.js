import Swal from "sweetalert2";
import { APILoading } from "../../apiresponse/APIResponse";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { Autocomplete, Box, Checkbox, Divider, FormControl, FormControlLabel, Grid, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getEmpListPerOffices, getOffices } from "./LeaveApplicationRequest";
import { formatName } from "../../customstring/CustomString";


export default function LeaveApplicationFiled() {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [deptData, setDeptData] = useState([]);
    const [empStatusData, setEmpStatusData] = useState([]);
    const [empList, setEmpList] = useState([]);

    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    useEffect(() => {
        getOffices()
            .then(res => {
                console.log(res);
                setDeptData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    useEffect(() => {
        if (isLoading) {
            Swal.fire({
                title: 'Please wait...',
                text: 'Fetching data...',
                icon: 'info',
                showCancelButton: false,
                showConfirmButton: false
            })
            // APILoading('info', 'Please wait...', 'Fetching data...');
            return;
        } else {
            Swal.close();
        }
    }, [isLoading])

    useEffect(() => {
        if (!selectedDept) return;
        console.log(selectedDept, selectedStatus);

        if (selectedDept) {
            const timer = setTimeout(() => {
                setIsLoading(true);
                console.log("Fetching employee data... selectedDept: " + selectedDept.dept_code);

                var t_data = { dept_code: selectedDept.dept_code };
                getEmpListPerOffices(t_data)
                    .then(res => {
                        console.log(res);
                        setEmpStatusData([]);
                        if (res.status === 200) {
                            setEmpList(res.data)
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: res.message,
                            });
                        }
                    })
                    .catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: err.message,
                        });
                        return;
                    })
                    .finally(() => {
                        setIsLoading(false);
                    })
            }, 500);

            return () => clearTimeout(timer);
        }

        if (!selectedStatus) return;

    }, [selectedDept, selectedStatus]);


    const handleToggle = (emp) => () => {
        // onSelect(emp);
        console.log(emp);
    };

    return (<>
        <Stack spacing={2} sx={{ p: 2 }}>
            <Box>
                <ModuleHeaderText title="Application for Filed Leave" />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Autocomplete
                    disablePortal
                    id={"combo-box-offices"}
                    options={deptData}
                    getOptionLabel={(option) => option.dept_title}
                    isOptionEqualToValue={(option, value) => option.dept_title === value.dept_title}
                    sx={{ minWidth: 500, maxWidth: '100%' }}
                    // fullWidth
                    size="small"
                    value={selectedDept}
                    onChange={(event, newValue) => {
                        setSelectedDept(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label='Select Department' required />}
                />
                <Box sx={{ flex: '1 1 auto' }} />
                <FormControl sx={{ minWidth: 300, maxWidth: '100%' }} size="small">
                    <InputLabel id="demo-simple-select-label">Select Employee Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedStatus}
                        label="Employee Status"
                        onChange={(event) => setSelectedStatus(event.target.value)}
                    >
                        <MenuItem value={""}>None</MenuItem>
                        {empStatusData.map((item, index) => {
                            return (<MenuItem key={index} value={item.emp_status}>{item.emp_status}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <Divider />
            </Box>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    {selectedDept && (
                        <EmployeeListSelect
                            empList={empList}
                            status={selectedStatus}
                            onSelect={handleToggle}
                        />
                    )}
                </Grid>
                <Grid item xs={8}>
                    <LeaveFiledListViewer />
                </Grid>
            </Grid>
        </Stack>

    </>
    )
}

function EmployeeListSelect({ empList, status, onSelect }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleListItemClick = (e, emp) => {
        e.preventDefault();

        console.log(emp);
        setSelectedIndex(emp.id);
    }

    return (<>

        <Paper sx={{ height: '70vh', overflowY: 'scroll' }}>
            {empList.map((emp) => (
                <List component="nav" aria-label="employee list">
                    <ListItemButton
                        selected={selectedIndex === emp.id}
                        onClick={(e) => handleListItemClick(e, emp)}
                    >
                        <ListItemText primary={formatName(emp.fname, emp.mname, emp.lname, emp.extname, 0)} />
                    </ListItemButton>
                </List>
            ))}
        </Paper>
    </>
    )
}

function LeaveFiledListViewer() {
    return (<>

    </>
    )
}