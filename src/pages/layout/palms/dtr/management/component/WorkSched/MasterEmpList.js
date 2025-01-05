import { Fragment, useEffect, useState } from "react"
import { Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, List, ListItemButton, ListItemText, MenuItem, Paper, Select, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Box, Stack, styled } from "@mui/system"
import { blue } from "@mui/material/colors"
import { Search as SearchIcon, Edit as EditIcon } from "@mui/icons-material"


import { usePopover } from "../../../../../custompopover/UsePopover"
import SmallModal from "../../../../../custommodal/SmallModal"
import { toast } from "react-toastify"
import moment from "moment"
import Swal from "sweetalert2"
import { APILoading } from "../../../../../apiresponse/APIResponse"
import { APIError, APISuccess, formatName } from "../../../../../customstring/CustomString"
import { postDTRSchedule } from "../../WorkScheduleRequest"

export function MasterEmpList({ empWorkSchedList, deptTemplateData, workSched, empStatus, requestData, setEmpWorkSchedList, setDeptTemplateData, }) {
    const [selectedEmp, setSelectedEmp] = useState(null)
    const [selectedIDS, setSelectedIDS] = useState(null)
    const [selectTemplate, setSelectTemplate] = useState(null)
    const [selectedEmpStat, setSelectedEmpStat] = useState('All')
    const [selectedEmpDataS, setSelectedEmpDataS] = useState(null)

    const [searchVal, setSearchVal] = useState('')
    const [open, setOpen] = useState(false)
    const [editTogglee, setEditTogglee] = useState(false)
    const [openDept, setOpenDept] = useState(false)

    const [filterEmpDTR, setFilterEmpDTR] = useState([])
    const [updatedWorkSched, setUpdatedWorkSched] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: blue[900],
            color: '#fff',
            fontSize: matches ? '.7rem' : '.8rem',
            padding: 10
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: matches ? '.6rem' : '.8rem',
            padding: 10
        },
    }));

    // const popover = usePopover();
    useEffect(() => {
        var filteredEmp = [];
        if (!selectTemplate) {
            filteredEmp = empWorkSchedList.filter(emp => emp.template_id === selectTemplate)
            if (!selectedEmpStat) {
                var list = [];
                list = filteredEmp.filter(emp => emp.status === selectedEmpStat);
                filteredEmp = list;
            }
            console.log(filteredEmp)

            setFilterEmpDTR(filteredEmp)
        } else {
            setFilterEmpDTR([])
        }
    }, [selectTemplate])
    // useEffect(() => {

    // }, [searchVal])

    const handleSelectEmp = (emp) => {
        console.log(emp, emp.schedule.sort((a, b) => a.date.localeCompare(b.date)))
        setSelectedEmp(() => ({ ...emp, schedule: emp.schedule.sort((a, b) => a.date.localeCompare(b.date)) }))
        setSelectedIDS(emp.id)
    }

    // const filteredEmployees = empWorkSchedList.filter(emp =>
    //     emp.name.toLowerCase().includes(searchVal.toLowerCase())
    // )

    const handleEdit = (sched) => {
        setOpen(true)
        console.log(sched)
        setSelectedEmpDataS(sched)
    }

    const workschedData = (sched) => {
        if (sched.worksched_id === null) {
            // console.log(sched.worksched_id === null, sched.template_id !== null, sched.template_id, sched.worksched_id)
            if (sched.template_id !== null) {
                var temp = deptTemplateData.find(temp => temp.template_id === sched.template_id)
                return temp.template_name
            } else {
                var temp = workSched.find(sched => sched.worksched_id === sched.worksched_id)
                return temp.whrs_desc
            }
        } else {
            var temp = workSched.find(sched => sched.worksched_id === sched.worksched_id)
            return temp.whrs_desc
        }
    }

    const handleFilterSearchEmpList = () => {
        var filteredEmp = [];
        // console.log(empWorkSchedList, selectTemplate, selectedEmpStat)
        if (selectTemplate !== null) {
            filteredEmp = empWorkSchedList.filter(emp => emp.template_id === selectTemplate)
            if (selectedEmpStat === 'All') {
                return setFilterEmpDTR(filteredEmp);
            }

            if (selectedEmpStat !== null || selectedEmpStat !== undefined) {
                var list = [];
                list = filteredEmp.filter(emp => String(emp.emp_status) === String(selectedEmpStat));
                // console.log(list)
                return setFilterEmpDTR(list);
            }

            return setFilterEmpDTR(filteredEmp);
        } else {
            setFilterEmpDTR([]);
            return toast.warning('No data found!');
        }
    }

    const handleFindTemplate = () => {
        if (selectedEmpDataS) {
            if (selectedEmpDataS.template_id !== null) {
                // console.log(deptTemplateData.find(item => item.template_id === selectedEmpDataS.template_id))
                return deptTemplateData.find(item => item.template_id === selectedEmpDataS.template_id)
            }
        }
    }
    const handleFindWorkSched = () => {
        if (selectedEmpDataS) {
            if (selectedEmpDataS.worksched_id !== null) {
                // console.log(workSched, workSched.find(item => item.worksched_id === selectedEmpDataS.worksched_id))
                return workSched.find(item => item.worksched_id === selectedEmpDataS.worksched_id)
            }
        }
    }

    const handleSaveWorkSched = () => {
        if (!selectedEmpDataS) {
            return toast.warning('Please select employee!')
        }

        var t_data = {
            type: 0,
            emp_no: selectedEmpDataS.emp_no,
            worksched_id: updatedWorkSched,
            date: selectedEmpDataS.date,
            year: requestData.year,
            from: requestData.from,
            to: requestData.to,
            dept_code: requestData.dept_code,
            is_active: requestData.is_active,
        }

        Swal.fire({
            title: 'Update Work Schedule?',
            text: "Click Yes to continue",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                APILoading('info', 'Updating Work Schedule...', 'Please wait...')
                postDTRSchedule(t_data)
                    .then(res => {
                        console.log(res)
                        if (res.data.status === 200) {
                            const parseData = res.data.data.map(item => ({
                                ...item, /* schedule: JSON.parse(item.schedule), */ name: formatName(item.fname, item.mname, item.lname, item.extname, 1),
                            }));
                            setEmpWorkSchedList(parseData)
                            setDeptTemplateData(res.data.template_data)
                            APISuccess('Success', res.data.message)
                        } else {
                            APIError('Error', res.data.message)
                        }
                    })
                    .catch(err => {
                        APIError('Error', err.message)
                        console.log(err)
                    })
            }
        })
    }

    const handleDeptUpWorkSched = () => {
        let emp_no_list = [];
        console.log(empWorkSchedList, selectedEmpDataS)
        if (selectedEmpStat === 'All') {
            empWorkSchedList.map(emp => emp_no_list.push(emp.emp_no))
        }

        if (selectedEmpStat !== 'All') {
            let list = empWorkSchedList.filter(emp => String(emp.emp_status) === String(selectedEmpStat));
            list.map(emp => emp_no_list.push(emp.emp_no))
        }

        var t_data = {
            type: 1,
            emp_no: emp_no_list,
            worksched_id: updatedWorkSched,
            date: selectedDate,

            year: requestData.year,
            from: requestData.from,
            to: requestData.to,
            dept_code: requestData.dept_code,
            is_active: requestData.is_active,
        }

        console.log(t_data)

        Swal.fire({
            title: 'Update Work Schedule?',
            text: "Click Yes to continue",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(res => {
            if (res.isConfirmed) {
                APILoading('info', 'Updating Work Schedule...', 'Please wait...')
                postDTRSchedule(t_data)
                    .then(res => {
                        if (res.data.status === 200) {
                            if (res.data.total_failed > 0) {
                                APIError('Failed to add work schedule', res.data.failed_records)
                            } else if (res.data.total_processed > 0) {
                                const parseData = res.data.data.data.map(item => ({
                                    ...item, /* schedule: JSON.parse(item.schedule), */ name: formatName(item.fname, item.mname, item.lname, item.extname, 1),
                                }));
                                setEmpWorkSchedList(parseData)
                                setDeptTemplateData(res.data.data.template_data)
                                APISuccess('Successfully added work schedule', 'Total processed: ' + res.data.total_processed)
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        APIError('Error', err.message)
                    })
            }
        })
    }

    return (
        <Stack sx={{ gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                {empWorkSchedList.length === 0 ?
                    <Box sx={{ flexGrow: 1, flex: '1 1 auto', textAlign: 'center' }}>
                        <Typography variant="caption" align="center"> No Data Found </Typography>
                    </Box>
                    :
                    <>
                        <Box sx={{ mb: 2 }}>
                            <FormControl sx={{ width: 300 }} size="small">
                                <InputLabel>Select Template</InputLabel>
                                <Select
                                    value={selectTemplate}
                                    onChange={(e) => setSelectTemplate(e.target.value)}
                                    label="Select Template"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {deptTemplateData.map((temp, ix) => (
                                        <MenuItem key={ix} value={temp.template_id}>{temp.template_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl sx={{ width: 300 }} size="small">
                                <InputLabel>Employment Status</InputLabel>
                                <Select
                                    value={selectedEmpStat}
                                    onChange={(e) => setSelectedEmpStat(e.target.value)}
                                    label="Select Employment Status"
                                >
                                    <MenuItem value="All"><em>All</em></MenuItem>
                                    {empStatus.map((empStat, ix) => (
                                        <MenuItem value={empStat.code}>{empStat.description}</MenuItem>
                                    ))}
                                    {/* <MenuItem value="Regular">Regular</MenuItem>
                                <MenuItem value="Probationary">Probationary</MenuItem>
                                <MenuItem value="Contractual">Contractual</MenuItem>
                                <MenuItem value="Project Based">Project Based</MenuItem> */}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Button variant="contained" color="info" onClick={() => handleFilterSearchEmpList()} startIcon={<SearchIcon />}> filter </Button>
                        </Box>
                    </>
                }
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                {(filterEmpDTR.length > 0 && empWorkSchedList.length > 0) &&
                    <>
                        <Paper sx={{ p: 1, overflowY: 'scroll', minHeight: '50vh', maxHeight: '60vh' }}>
                            {/* <TextField
                                label='Filter Employee'
                                type='text'
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                                placeholder="Firstname | Lastname"
                            /> */}
                            <Typography sx={{ color: '#fff', fontSize: '.9rem', mt: 1, background: blue[900], p: 1 }}>
                                Employee List {/* ({filteredEmployees.length}) */}
                            </Typography>
                            <List sx={{ width: 340 }}>
                                {filterEmpDTR.map((emp, ix) => (
                                    <ListItemButton
                                        key={ix}
                                        dense
                                        selected={selectedIDS === emp.id}
                                        onClick={() => handleSelectEmp(emp)}
                                        sx={{
                                            py: 1,
                                            borderRadius: '4px',
                                            mb: 0.5,
                                            '&:hover': {
                                                background: blue[100],
                                                transition: 'background-color 0.2s'
                                            },
                                            '&.Mui-selected': {
                                                background: blue[200],
                                                '&:hover': {
                                                    background: blue[300]
                                                }
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={emp.name}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontSize: '0.9rem',
                                                    fontWeight: selectedIDS === emp.id ? 600 : 400
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                        <Paper sx={{ p: 1, flexGrow: 1, flex: '1 1 auto', position: 'relative', overflowY: 'scroll', minHeight: '50vh', maxHeight: '60vh' }}>
                            {!selectedEmp ? (
                                <Typography variant="caption">Select an employee to view schedule</Typography>
                            ) : selectedEmp.schedule.length === 0 ? (
                                <Typography variant="caption">No work schedule found</Typography>
                            ) : (
                                <TableContainer style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell> Date </StyledTableCell>
                                                <StyledTableCell> Day Name </StyledTableCell>
                                                <StyledTableCell> Work Schedule </StyledTableCell>
                                                <StyledTableCell> Action </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody sx={{}}>
                                            {selectedEmp.schedule.map((sched, ix) => (
                                                <TableRow key={ix}>
                                                    <TableCell>
                                                        <Typography variant="caption" key={ix}>{sched.date}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption">
                                                            {new Date(sched.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" sx={{ fontDecoration: 'underline', color: 'cornflowerblue', fontWeight: 'bold' }}>
                                                            {workschedData(sched)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton aria-label="edit" className="custom-iconbutton" color="info" onClick={() => handleEdit(sched)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                                // <TableRow key={ix}>
                                                //     <TableCell>
                                                //         <Typography variant="caption" key={ix}>{sched.date}</Typography>
                                                //     </TableCell>
                                                //     <TableCell>
                                                //         <Typography variant="caption"> {moment(sched.date).format('dddd')} </Typography>
                                                //     </TableCell>
                                                //     <TableCell >
                                                //         <Typography variant="caption" sx={{ fontDecoration: 'underline', color: 'cornflowerblue', fontWeight: 'bold' }} >
                                                //             {workschedData(sched)}
                                                //         </Typography>
                                                //     </TableCell>
                                                //     <TableCell>
                                                //         <IconButton aria-label="edit" className="custom-iconbutton" color="info" onClick={() => handleEdit(sched)}>
                                                //             <EditIcon />
                                                //         </IconButton>
                                                //     </TableCell>
                                                // </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </>
                }
            </Box>

            {(empWorkSchedList.length > 0) && (
                <Box>
                    <Button variant="contained" onClick={() => { setOpenDept(true) }}> Update Dept Work Schedule </Button>
                </Box>
            )}


            <Fragment>
                <SmallModal open={openDept} close={() => setOpenDept(false)}>
                    <Stack spacing={2} sx={{ marginBottom: '1rem' }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="select-to-be-updated-work-schedule">Select to be updated work schedule</InputLabel>
                            <Select
                                labelId="select-to-be-updated-work-schedule"
                                value={updatedWorkSched}
                                label="Select to be updated work schedule"
                                onChange={(e) => setUpdatedWorkSched(e.target.value)}
                            >
                                {workSched.map((template) => (
                                    <MenuItem value={template.worksched_id}>{template.worksched_id + ' - ' + template.whrs_desc}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Select Employment Status</InputLabel>
                            <Select
                                value={selectedEmpStat}
                                onChange={(e) => setSelectedEmpStat(e.target.value)}
                                label="Select Employment Status"
                            >
                                <MenuItem value="All"><em>All</em></MenuItem>
                                {empStatus.map((empStat, ix) => (
                                    <MenuItem value={empStat.code}>{empStat.description}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    label="Select date"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </Stack>

                    <Box>
                        <Button variant="contained" onClick={() => { handleDeptUpWorkSched() }}> Update Dept Work Schedule </Button>
                    </Box>
                </SmallModal>
                <SmallModal open={open} close={() => setOpen(false)} title="Edit Work Schedule" >
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Date: {moment(selectedEmpDataS?.date).format('MMMM DD, YYYY')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                            Current Template Work Schedule:
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'cornflowerblue', fontWeight: 'bold' }}>
                            {'(' + handleFindTemplate()?.template_id + ') - ' + handleFindTemplate()?.template_name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                            New Work Schedule:
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'cornflowerblue', fontWeight: 'bold' }}>
                            {console.log(workSched)}
                            {editTogglee ?
                                <Select
                                    size="small"
                                    value={updatedWorkSched}
                                    onChange={(e) => setUpdatedWorkSched(e.target.value)}
                                >
                                    {workSched.map((template) => (
                                        <MenuItem value={template.worksched_id}>{template.worksched_id + ' - ' + template.whrs_desc}</MenuItem>
                                    ))}
                                </Select>
                                :
                                selectedEmpDataS?.worksched_id === null ?
                                    ' None '
                                    :
                                    handleFindWorkSched()?.worksched_id + ' - ' + handleFindWorkSched()?.whrs_desc
                            }

                        </Typography>
                    </Box>

                    <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                        {editTogglee ?
                            <>
                                <Button variant="contained" color="success" onClick={() => handleSaveWorkSched()}> Save </Button>
                                <Button variant="contained" color="error" onClick={() => setEditTogglee(false)}> Cancel </Button>
                            </>
                            :
                            <Button variant="contained" onClick={() => setEditTogglee(true)} > Edit </Button>
                        }
                    </Box>
                </SmallModal>
            </Fragment>
        </Stack>
    )
}

const EditWorkSchedule = () => {
    return (<>
    </>
    )
}