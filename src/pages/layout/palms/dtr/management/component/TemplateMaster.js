import React, { Fragment, useEffect, useState } from "react"

import { Autocomplete, Box, Button, Divider, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Radio, RadioGroup, Select, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import Swal from "sweetalert2"
import { isEmptyObject } from "jquery"
import moment from "moment"
import { toast } from "react-toastify"

import { getDepartmentDTRTemplates, getEmpStatus, getHolidaySchedule, getWorkScheduleAPI } from "../WorkScheduleRequest"
import { APILoading } from "../../../../apiresponse/APIResponse"
import { APIError, APISuccess, formatName } from "../../../../customstring/CustomString"
import MediumModal from "../../../../custommodal/MediumModal"
import { EditWorkSched } from "./WorkSched/EditWorkSched"
import { api_url } from "../../../../../../request/APIRequestURL"
import { MasterEmpList } from "./WorkSched/MasterEmpList"

export function TemplateMaster({ officesData }) {
    // const [calendarData, setCalendarData] = React.useState([])
    const [workSched, setWorkSched] = React.useState([])
    const [holidaysData, setHolidaysData] = React.useState([])
    const [open, setOpen] = useState(null)
    const [yearRef, setYearRef] = React.useState(null)
    const [monthRef, setMonthRef] = useState(null)
    const [workScheduleDataAPI, setWorkScheduleDataAPI] = useState([])
    const [empStatus, setEmpStatus] = useState([])

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))

    const [selectedWorkSchedule, setSelectedWorkSchedule] = useState(null)
    const [selectedOffice, setSelectedOffice] = useState(null)
    const [selectIsActive, setSelectIsActive] = useState(0)

    const [empWorkSchedList, setEmpWorkSchedList] = useState([])
    const [requestData, setRequestData] = useState({})

    useEffect(() => {
        var t_data = {
            api_url: api_url
        }
        getWorkScheduleAPI(t_data)
            .then(res => {
                if (res.status === 200) {
                    const sortedSchedules = res.data.response.sort((a, b) => Number(a.whrs_code) - Number(b.whrs_code));
                    setWorkScheduleDataAPI(sortedSchedules);
                    const defaultSchedule = sortedSchedules.find(schedule => schedule.whrs_code === '1');
                    if (defaultSchedule) {
                        setSelectedWorkSchedule(defaultSchedule);
                    }
                } else {
                    APIError('Error', res.message)
                }
                return getEmpStatus();
            })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    setEmpStatus(res.data)
                } else {
                    APIError('Error', res.message)
                }
            })
            .catch(err => {
                console.log(err)
                APIError('Error', err.message)
            })
    }, [])
    useEffect(() => {
        console.log(empWorkSchedList)
    }, [empWorkSchedList])

    const handleYearSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        var t_data = {
            year: yearRef
        }
        APILoading('info', 'Fetching data. . . ', 'Please wait...')
        await getHolidaySchedule(t_data)
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    setWorkSched(res.data.dates)
                    setHolidaysData(res.data.holiday_sched)
                    // setYearRef(null)
                } else {
                    APIError('Error', res.data.message)
                }
            })
            .catch(err => {
                console.log(err)
                APIError('Error', err.message)
            })
            .finally(() => {
                Swal.close()
            })
    }

    const [deptTemplateData, setDeptTemplateData] = useState([])
    const handleFetchData = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!yearRef) {
            toast.warning('Please select year first.')
            return;
        }
        if (monthRef === null || monthRef === undefined || monthRef === '') {
            toast.warning('Please select month first.')
            return;
        }
        if (!selectedOffice) {
            toast.warning('Please select office first.')
            return;
        }

        console.log(yearRef, monthRef, selectedOffice)

        var t_data = {
            year: yearRef,
            from: yearRef + '-' + (monthRef + 1) + '-01',
            to: yearRef + '-' + (monthRef + 1) + '-' + moment(new Date(yearRef, (monthRef + 1), 0)).format('DD'),
            dept_code: selectedOffice.dept_code,
            is_active: selectIsActive
        }
        setRequestData(t_data)
        // console.log(t_data)
        APILoading('info', 'Fetching data. . . ', 'Please wait...');
        Swal.showLoading();

        await getDepartmentDTRTemplates(t_data)
            .then(res => {
                console.log(res)
                if (res.status === 200) {
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
                console.log(err)
                APIError('Error', err.message)
            })
    }

    return (<>
        <Grid container spacing={1}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                <form onSubmit={handleYearSubmit}>
                    {/* {console.log(isEmptyObject(workSched) || isEmptyObject(holidaysData), isEmptyObject(workSched), isEmptyObject(holidaysData))} */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: '10px' }}>
                        <Button variant="contained" onClick={() => setOpen('edit-sched-temp')} disabled={isEmptyObject(workSched) && isEmptyObject(holidaysData)}>
                            Edit Schedule Template
                        </Button>
                        <TextField
                            required
                            label="Enter Year"
                            variant="outlined"
                            size="small"
                            sx={{ width: matches ? '100%' : '150px' }}
                            value={yearRef || ''}
                            onChange={(e) => setYearRef(e.target.value)}
                            placeholder={"ex. " + moment().format('YYYY')}
                        />

                        <Button variant="outlined" type="submit" fullWidth={matches}>
                            <SearchIcon />
                        </Button>
                    </Box>
                </form>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                {workSched.length === 0 ?
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>No Data Found</Box>
                    :
                    <Stack sx={{ gap: '5px' }}>
                        <form style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }} onSubmit={handleFetchData}>
                            <Box>
                                <Autocomplete
                                    disablePortal
                                    id={"combo-box-offices"}
                                    options={officesData}
                                    getOptionLabel={(option) => option.dept_title}
                                    isOptionEqualToValue={(option, value) => option.dept_title === value.dept_title}
                                    sx={{ minWidth: 300, maxWidth: '100%' }}
                                    // fullWidth
                                    size="small"
                                    value={selectedOffice}
                                    onChange={(event, newValue) => {
                                        setSelectedOffice(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label='Select Office' required />}
                                />
                            </Box>
                            <Box>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={selectIsActive}
                                        onChange={(e) => setSelectIsActive(e.target.value)}
                                    >
                                        <FormControlLabel value={0} control={<Radio />} label="Active" />
                                        <FormControlLabel value={1} control={<Radio />} label="In-active" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Autocomplete
                                    size="small"
                                    sx={{ width: 220 }}
                                    options={Array.from({ length: 12 }, (_, i) => ({
                                        value: i,
                                        label: moment().month(i).format('MMMM')
                                    }))}
                                    value={monthRef !== null ? {
                                        value: monthRef,
                                        label: moment().month(monthRef).format('MMMM')
                                    } : null}
                                    onChange={(_, newValue) => setMonthRef(newValue ? newValue.value : null)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Month"
                                            required
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                />

                                <Button variant="contained" type="submit"> Fetch Details </Button>
                            </Box>
                        </form>
                        <Box sx={{ margin: '10px 0px' }}>
                            <Divider />
                        </Box>
                        <Box>
                            <MasterEmpList {... { empWorkSchedList, deptTemplateData, workSched, empStatus, requestData, setEmpWorkSchedList, setDeptTemplateData }} />
                        </Box>
                    </Stack>
                }
            </Grid>
        </Grid>
        {/* calendarData={calendarData} setCalendarData={setCalendarData} holidaysData={holidaysData} setHolidaysData={setHolidaysData} workScheduleData={workScheduleData} setWorkScheduleData={setWorkScheduleData} selectedWorkSchedule={selectedWorkSchedule} setSelectedWorkSchedule={setSelectedWorkSchedule} */}
        <Fragment>
            <MediumModal open={open === 'edit-sched-temp'} title="Add Schedule Template" close={() => setOpen(null)}>
                <EditWorkSched {...{ workSched, setWorkSched, holidaysData, setHolidaysData, workScheduleDataAPI, setWorkScheduleDataAPI, selectedWorkSchedule, setSelectedWorkSchedule, deptTemplateData }} />
            </MediumModal>
        </Fragment>
    </>
    )
}
