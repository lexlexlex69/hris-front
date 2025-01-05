import { Autocomplete, Box, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, InputAdornment, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Fragment, useState, useMemo, useEffect } from "react";
import { Search as SearchIcon, Update as UpdateIcon } from "@mui/icons-material";
import moment from "moment";
import { blue, grey } from '@mui/material/colors';

import { formatName, isValidTime, StyledTableCell } from "../../../../customstring/CustomString";
import { getWorkSched, updateDTRSchedule } from "../WorkScheduleRequest";
import { toast } from "react-toastify";
import { ProcessType } from "./ProcessType";
import Swal from "sweetalert2";


export function WorkSchedEmpList({ periodMY, data, setData, actions, deptCode, workScheduleData, selectedWorkSchedule }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [empSelectedData, setEmpSelectedData] = useState(null);
    // const [empSelectedWorkSched, setEmpSelectedWorkSched] = useState(null);
    const [loading, setLoading] = useState(true)
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectedEmployeeList, setSelectedEmployeeList] = useState([]);
    const [open, setOpen] = useState(false)
    const [processType, setProcessType] = useState(0);
    const [daysList, setDaysList] = useState();
    const [selectedDay, setSelectedDay] = useState('');
    const [year, month] = periodMY.split('-').map(Number);
    const [isHoliday, setIsHoliday] = useState(null);

    // useEffect(() => {
    //     console.log(selectedEmployees)
    // }, [selectedEmployees])

    useEffect(() => {
        try {
            if (periodMY) {
                const daysInMonth = new Date(year, month, 0).getDate();
                const daysList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                setDaysList(daysList);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [periodMY]);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;

        return data.filter(item => {
            const searchFields = {
                fullName: formatName(item.fname, item.mname, item.lname, item.extname, 0),
                empNo: String(item.emp_no || ''),
                firstName: String(item.fname || ''),
                middleName: String(item.mname || ''),
                lastName: String(item.lname || ''),
                extName: String(item.extname || '')
            };

            const search = searchTerm.toLowerCase().trim();

            return Object.values(searchFields).some(field =>
                field.toLowerCase().includes(search)
            );
        });
    }, [data, searchTerm]);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setPage(0);
    };
    // const isRectified = (row, nature) => {
    //     return JSON.parse(row.rectified_logs).includes(nature);
    // }
    const handleCheckboxChange = (event, row) => {
        event.stopPropagation();
        setSelectedEmployees(prev => {
            if (event.target.checked) {
                return [...prev, row.id];
            }
            return prev.filter(id => id !== row.id);
        });
    };

    const handleRowClick = (row) => {
        setSelectedRow(row)
        console.log(row)

        if (row.details) {
            console.log(JSON.parse(row.details))
        }
        setEmpSelectedData(row);

        // let year = periodMY.split('-')[0]
        // let month = periodMY.split('-')[1]

        // var t_data = {
        //     emp_id: row.id,
        //     year: year,
        //     year2: year
        // }

        // getWorkSched(t_data)
        //     .then(res => {
        //         console.log(res)
        //         if (res.status === 200) {
        //             let data = res.data.data[0]
        //             data.rest_days = JSON.parse(res.data.data[0].rest_days)
        //             data.working_days = JSON.parse(res.data.data[0].working_days)
        //             setEmpSelectedWorkSched(data)
        //         } else {
        //             toast.error('Ops, something went wrong!')
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
    }

    const handleProcessType = () => {
        if (!selectedDay) {
            toast.error('Please select a day');
            return;
        }
        const employeesToProcess = data.filter(emp => selectedEmployees.includes(emp.id));
        setSelectedEmployeeList(employeesToProcess)
        setOpen(true)
    };

    const handleProcessSubmit = () => {
        console.log(processType, selectedDay, selectedWorkSchedule)
        var t_data = {}

        if (parseInt(processType) === 1) {
            if (selectedEmployeeList.length === 0) {
                toast.error('Please select at least one employee');
                return;
            }
        } else if (parseInt(processType) === 0) {
            if (data.length === 0) {
                toast.error('Please select at least one employee');
                return;
            }

        }

        if (isHoliday) {
            if (parseInt(processType) === 1) {
                t_data = {
                    is_holiday: true,
                    day_type: 3,
                    emp_list: selectedEmployeeList,
                    work_sched: selectedWorkSchedule,
                    day: selectedDay,
                    sched_in: 'NATIONAL',
                    sched_out: 'HOLIDAY',
                    date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
                }
            } else if (parseInt(processType) === 0) {
                t_data = {
                    is_holiday: true,
                    day_type: 3,
                    emp_list: data,
                    work_sched: selectedWorkSchedule,
                    day: selectedDay,
                    sched_in: 'NATIONAL',
                    sched_out: 'HOLIDAY',
                    date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
                }
            }
        } else {
            if (parseInt(processType) === 1) {
                t_data = {
                    is_holiday: false,
                    work_sched: selectedWorkSchedule,
                    emp_list: selectedEmployeeList,
                    day: selectedDay,
                    day_type: 1,
                    date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
                }
            } else if (parseInt(processType) === 0) {
                t_data = {
                    is_holiday: false,
                    work_sched: selectedWorkSchedule,
                    emp_list: data,
                    day_type: 1,
                    day: selectedDay,
                    date: `${year}-${month.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
                }
            }
        }


        Swal.fire({
            icon: 'question',
            title: 'Confirm update?',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Please wait...');
                    Swal.showLoading();
                    updateDTRSchedule(t_data)
                        .then(res => {
                            console.log(res)

                            if (res.status === 200) {
                                toast.success('Successfully processed')
                            } else {
                                toast.error('Ops, something went wrong!')
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            Swal.close();
                        })
                }
            })

    }

    return (
        <Fragment>
            <ProcessType openProcessType={open} setOpenProcessType={() => setOpen(false)} handleProcessDTR={handleProcessSubmit} processType={processType} setProcessType={setProcessType} />

            {loading ?
                null
                :
                <Box sx={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption">Day to Update:</Typography>
                        <FormControl sx={{ width: '25ch' }}>
                            <Select
                                size="small"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedDay || ''} // Add fallback for empty value
                                // label="Select Day"
                                placeholder="Select Day"
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                {daysList.map(day => (
                                    <MenuItem key={day} value={day}>
                                        {day + ' - ' + moment(month + '-' + day + '-' + year).format('dddd')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isHoliday}
                                    onChange={(e) => setIsHoliday(e.target.checked)}
                                />
                            }
                            label="Holiday"
                        />
                    </Box>
                </Box>
            }

            <Card>
                <CardContent sx={{ overflowY: 'scroll' }}>
                    <Grid2 container spacing={1}>
                        <Grid2 item xs={12}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'baseline' }}>
                                <Button variant="contained" size="small" startIcon={<UpdateIcon />} sx={{ fontSize: '.7rem' }} onClick={handleProcessType} className="custom-roundbutton">Process</Button>
                                <Typography variant="caption">Selected no.: {selectedEmployees.length}</Typography>
                            </Box>
                        </Grid2>
                        <Grid2 item xs={4} sx={{}}>
                            <TextField
                                label="Search Employee"
                                size="small"
                                type="search"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e, e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Search by name or employee number"
                            />

                            <Paper sx={{ height: 'auto' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell colSpan={2} sx={{ padding: '0.3rem' }}>Employee Name</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentPageData.map((row) => (
                                                <TableRow
                                                    key={row.id}
                                                    onClick={() => handleRowClick(row)}
                                                    hover
                                                    selected={selectedRow?.id === row.id}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <StyledTableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedEmployees.includes(row.id)}
                                                            onChange={(e) => handleCheckboxChange(e, row)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">
                                                        {formatName(row.fname, row.mname, row.lname, row.extname, 0)}
                                                    </StyledTableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={filteredData.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[5]}
                                />
                            </Paper>
                        </Grid2>
                        <Grid2 item xs={8}>
                            <Box>
                                {!empSelectedData ? null :
                                    <>
                                        {/* <Paper>
                                            <TableContainer sx={{ maxHeight: '65vh', minHeight: '65vh' }}>
                                                <Table stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>
                                                                Date
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Schedule In
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Schedule Out
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Time In
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Break Out
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Break In
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                Time Out
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                Late <br />
                                                                (minute/s)
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                Late Undertime <br />
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                Undertime <br />
                                                                (minute/s)
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            JSON.parse(empSelectedData.details).length > 0
                                                                ?
                                                                JSON.parse(empSelectedData.details).map((item, key) => {
                                                                    return (
                                                                        <TableRow key={key} sx={{ '&:hover': { background: grey[300] } }}>
                                                                            <StyledTableCell>
                                                                                {moment(item.date, 'YYYY-MM-DD').format('MM-DD-YYYY')}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ textTransform: 'uppercase', color: isValidTime(item.sched_in) ? 'black' : item.day_type === 0 ? blue[800] : 'red' }}>
                                                                                {isValidTime(item.sched_in) ? moment(item.sched_in, 'HH:mm').format('hh:mm A') : item.sched_in}
                                                                            </StyledTableCell>

                                                                            <StyledTableCell sx={{ textTransform: 'uppercase', color: isValidTime(item.sched_in) ? 'black' : item.day_type === 0 ? blue[800] : 'red' }}>
                                                                                {isValidTime(item.sched_out) ? moment(item.sched_out, 'HH:mm').format('hh:mm A') : item.sched_out}
                                                                            </StyledTableCell>

                                                                            <StyledTableCell sx={{ fontWeight: isRectified(item, 'Time In') ? 'bold' : 'normal' }}>
                                                                                {isValidTime(item.time_in) ? moment(item.time_in, 'HH:mm').format('hh:mm A') : item.time_in}
                                                                            </StyledTableCell>

                                                                            <StyledTableCell sx={{ fontWeight: isRectified(item, 'Break Out') ? 'bold' : 'normal' }}>
                                                                                {isValidTime(item.break_out) ? moment(item.break_out, 'HH:mm').format('hh:mm A') : item.break_out}
                                                                            </StyledTableCell>

                                                                            <StyledTableCell sx={{ fontWeight: isRectified(item, 'Break In') ? 'bold' : 'normal' }}>
                                                                                {isValidTime(item.break_in) ? moment(item.break_in, 'HH:mm').format('hh:mm A') : item.break_in}
                                                                            </StyledTableCell>

                                                                            <StyledTableCell sx={{ fontWeight: isRectified(item, 'Time Out') ? 'bold' : 'normal' }}>
                                                                                {isValidTime(item.time_out) ? moment(item.time_out, 'HH:mm').format('hh:mm A') : item.time_out}
                                                                            </StyledTableCell>

                                                                            <StyledTableCell align="center">
                                                                                {item.late > 0 ? item.late : '-'}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align="center">
                                                                                {item.late_undertime > 0 ? item.late_undertime : '-'}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align="center">
                                                                                {item.undertime > 0 ? item.undertime : '-'}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align="center">
                                                                                <Button variant="contained" size="small" startIcon={<UpdateIcon/>}>ReProcess</Button> 
                                                                                <Button variant="contained" size="small" startIcon={<HistoryToggleOffIcon />} onClick={() => handleViewRawLogs(item)} className="custom-roundbutton">Logs</Button> 
                                                                            </StyledTableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                                :
                                                                <TableRow>
                                                                    <StyledTableCell colSpan={9} align="center">No Employee Selected</StyledTableCell>
                                                                </TableRow>
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper> */}
                                    </>
                                }
                            </Box>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </Fragment>
    );
}

export default WorkSchedEmpList;