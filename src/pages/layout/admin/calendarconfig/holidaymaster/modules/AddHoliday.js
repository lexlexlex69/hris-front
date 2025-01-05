import { useContext, useEffect } from "react"
import { HolidayMasterContext } from "../Context"
import DatePicker from "react-multi-date-picker"
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material"
import { width } from "@fortawesome/free-solid-svg-icons/fa0"
import Swal from "sweetalert2"
import { addHoliday } from "../../Request/HolidayRequest"
import { toast } from "react-toastify"
import { isEmptyObject } from "jquery"
import { APIError, APISuccess } from "../../../../customstring/CustomString"
import { auditLogs } from "../../../../auditlogs/Request"


export function AddHoliday() {
    const { open, setOpen, holidayMasterData, setHolidayMasterData, tempData, setTempData } = useContext(HolidayMasterContext)

    useEffect(() => {
        if (tempData) {
            console.log(tempData)
        }
    }, [tempData])
    const handleAdd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // if (tempData) {
        //     return toast.error("Please fill up the form")
        // }
        if (isEmptyObject(tempData) || tempData.startDate === null || tempData.endDate === null || tempData.description === null || tempData.coverage === null || tempData.type === null) {
            return toast.error("Please fill up the form")
        }
        const t_data = {
            year: parseInt(tempData.year),
            date_from: tempData.startDate.format("YYYY-MM-DD"),
            date_to: tempData.endDate.format("YYYY-MM-DD"),
            holiday_desc: tempData.description,
            type: parseInt(tempData.type),
            cover: parseInt(tempData.coverage),
        }
        Swal.fire({
            title: 'Click submit to continue?',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                var logs = {
                    action: 'ADD HOLIDAY MASTER FILE',
                    action_dtl: 'HOLIDAY MASTER FILE ADDED: ' + JSON.stringify(t_data),
                    module: 'HOLIDAYS MASTER FILE'
                }
                auditLogs(logs)
                await addHoliday(t_data)
                    .then(res => {
                        if (res.data.status === 200) {
                            APISuccess('Added Holiday', res.data.message)
                            setTempData({})
                            setHolidayMasterData((prev) => ({ ...prev, allHolidays: res.data.data }));
                        } else {
                            APIError('Error adding holiday', res.data.message)
                        }
                    })
                    .catch(err => {
                        APIError('Error adding holiday', err.message)
                    })
            }
        })
    }

    return (
        <form onSubmit={handleAdd}>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12}>
                    <InputLabel >Holiday Date Range</InputLabel>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Year"
                                type="number"
                                required
                                InputProps={{
                                    inputProps: {
                                        min: 1900,
                                        max: 9999
                                    }
                                }}
                                onChange={(e) => setTempData({ ...tempData, year: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FormControl fullWidth>
                                <DatePicker
                                    required
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        height: '56px', // Matches MUI default height
                                        padding: '16.5px 14px'
                                    }}
                                    label="Start Date"
                                    value={tempData.startDate ?? ''}
                                    fullWidth
                                    disabled={!tempData.year}
                                    onChange={(newValue) => setTempData({
                                        ...tempData,
                                        startDate: newValue,
                                        endDate: newValue
                                    })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FormControl fullWidth>
                                <DatePicker
                                    required
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        height: '56px',
                                        padding: '16.5px 14px'
                                    }}
                                    label="End Date"
                                    value={tempData.endDate ?? ''}
                                    fullWidth
                                    disabled={!tempData.year}
                                    onChange={(newValue) => setTempData({ ...tempData, endDate: newValue })}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Holiday Description"
                        required
                        onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <FormLabel>Type of Holiday</FormLabel>
                        <Select
                            // defaultValue="1"
                            required
                            onChange={(e) => setTempData({ ...tempData, type: e.target.value })}
                        >
                            <MenuItem value="1">Legal Non-working Holiday</MenuItem>
                            <MenuItem value="2">Legal Working</MenuItem>
                            <MenuItem value="3">Special Non-working</MenuItem>
                            <MenuItem value="4">Special Working</MenuItem>
                            <MenuItem value="5">Whole Day Work Suspension</MenuItem>
                            <MenuItem value="6">AM Work Suspension</MenuItem>
                            <MenuItem value="7">PM Work Suspension</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <FormLabel>Coverage</FormLabel>
                        <Select
                            // defaultValue="1"
                            required
                            onChange={(e) => setTempData({ ...tempData, coverage: e.target.value })}
                        >
                            <MenuItem value="1">National</MenuItem>
                            <MenuItem value="2">Local</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                        Add Holiday
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}