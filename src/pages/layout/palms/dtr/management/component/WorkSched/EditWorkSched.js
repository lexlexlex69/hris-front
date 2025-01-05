import { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Divider, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { Upload as UploadIcon } from '@mui/icons-material';
import Swal from "sweetalert2";
import { upsertWorkSched } from "../../WorkScheduleRequest";
import { APIError, APISuccess } from "../../../../../customstring/CustomString";
import { APILoading } from "../../../../../apiresponse/APIResponse";

export function EditWorkSched({ workSched, setWorkSched, holidaysData, setHolidaysData, workScheduleDataAPI, setWorkScheduleDataAPI, selectedWorkSchedule, setSelectedWorkSchedule }) {
    const [tempData, setTempData] = useState({
        worksched_id: '',
        holidays_id: '',
        file_id: '',  
        whrs_code: '',
        whrs_desc: '',
        time_in: '',  
        break_out: '',
        break_in: '',
        time_out: '',
    })
    const [uploadID, setUploadID] = useState(null)
    const [uploadedFileName, setUploadedFileName] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)

    const [selectWorkSched, setSelectWorkSched] = useState(null)

    // useEffect(() => {
    //     // workScheduleData
    // }, [])
    useEffect(() => {
        console.log(tempData)
    }, [tempData])
    useEffect(() => {
        if (selectWorkSched) {
            const tempWorkSched = workSched.find(sched => sched.worksched_id === selectWorkSched)
            setTempData({
                worksched_id: tempWorkSched.worksched_id,
                holidays_id: tempWorkSched.holidays_id,
                file_id: tempWorkSched.file_id,
                whrs_code: tempWorkSched.whrs_code,
                whrs_desc: tempWorkSched.whrs_desc,
                time_in: tempWorkSched.time_in,
                break_out: tempWorkSched.break_out,
                break_in: tempWorkSched.break_in,
                time_out: tempWorkSched.time_out,
            })
        }
    }, [selectWorkSched])

    const handlePostWorkSched = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (tempData.whrs_desc === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill up description!',
            })
            return
        }

        if (tempData.time_in === '' && tempData.break_out === '' && tempData.break_in === '' && tempData.time_out === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please fill up all the required fields!',
            })
            return
        }

        console.log(tempData)

        Swal.fire({
            title: 'Are you sure?',
            text: "Click submit to continue",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Submit',
        })
            .then(async res => {
                if (res.isConfirmed) {
                    var t_data = {
                        'worksched_id': tempData.worksched_id,
                        'whrs_code': tempData.whrs_code,
                        'whrs_desc': tempData.whrs_desc,
                        'time_in': tempData.time_in,
                        'break_out': tempData.break_out,
                        'break_in': tempData.break_in,
                        'time_out': tempData.time_out,
                        'file_id': tempData.file_id,
                        'holidays_id': tempData.holidays_id,
                    }

                    APILoading('info', 'Updating Work Schedule', 'Please wait...')
                    await upsertWorkSched({data: t_data})
                        .then(res => {
                            console.log(res)
                            if (res.data.status === 200) {
                                APISuccess('Success', res.data.message)
                                setWorkSched(res.data.data)
                            } else {
                                APIError('Error processing request', res.data.message)
                            }
                        })
                        .catch(err => {
                            APIError('Error', err)
                        })
                }
            })

    }
    // const handleSelectedWorkSched = (val) => {
    //     setSelectedWorkSchedule(val);
    // }

    const handleUpdateWorkSched = (data) => {
        setTempData((prev) => ({ ...prev, ...data }))
    }

    const handleFile = (e) => {
        var file = e.target.files[0].name;
        setUploadedFileName(file)
        var extension = file.split('.').pop();
        if (extension === 'PDF' || extension === 'pdf' || extension === 'PNG' || extension === 'png' || extension === 'JPG' || extension === 'jpg' || extension === 'JPEG' || extension === 'jpeg') {

            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);

            fileReader.onload = (event) => {
                file = fileReader.result;
                setUploadedFile(file)
            }
        } else {
            file = '';
            setUploadedFile(file)

            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                html: 'Please upload Image file.'
            })
        }
    }

    return (<>
        <Stack spacing={2} sx={{ padding: 2 }}>
            <form onSubmit={handlePostWorkSched}>
                <Grid container spacing={1}>
                    {/* <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-work-schedule"
                            options={workScheduleData}
                            getOptionLabel={(option) => {
                                const timeFormat = "hh:mm A";
                                const time1 = option.whrs_time1 ? moment(option.whrs_time1, "HH:mm").format(timeFormat) : '';
                                const time2 = option.whrs_time2 ? moment(option.whrs_time2, "HH:mm").format(timeFormat) : '';
                                const time3 = option.whrs_time3 ? moment(option.whrs_time3, "HH:mm").format(timeFormat) : '';
                                const time4 = option.whrs_time4 ? moment(option.whrs_time4, "HH:mm").format(timeFormat) : '';

                                let label = `(${option.whrs_code}) `;

                                if (time1 && time2 && time3 && time4) {
                                    label += `${time1} - ${time2} to ${time3} - ${time4}`;
                                } else if (time1 && time4 && !time3 && !time2) {
                                    label += `${time1} to ${time4}`;
                                } else if (time1 && time2 && !time3 && !time4) {
                                    label += `${time1} to ${time2}`;
                                } else if (time3 && time4 && !time1 && !time2) {
                                    label += `${time3} to ${time4}`;
                                } else if (time2 && time3 && !time1 && !time4) {
                                    label += `${time2} to ${time3}`;
                                } else if (time1 && time3 && !time2 && !time4) {
                                    label += `${time1} to ${time3}`;
                                } else if (time2 && time4 && !time1 && !time3) {
                                    label += `${time2} to ${time4}`;
                                } else if (time1 && !time2 && !time3 && !time4) {
                                    label += `${time1}`;
                                } else if (!time1 && time2 && !time3 && !time4) {
                                    label += `${time2}`;
                                } else if (!time1 && !time2 && time3 && !time4) {
                                    label += `${time3}`;
                                } else if (!time1 && !time2 && !time3 && time4) {
                                    label += `${time4}`;
                                }

                                return label;
                            }}
                            isOptionEqualToValue={(option, value) => option.whrs_desc === value.whrs_desc || option.whrs_code === value.whrs_code}
                            fullWidth
                            size="small"
                            value={selectedWorkSchedule}
                            onChange={(event, newValue) => {
                                handleSelectedWorkSched(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ zIndex: 999 }}
                                    label="Select Preset Schedule"
                                    required
                                />
                            )}
                        />
                    </Grid> */}
                    <Grid item xs={12}> 
                        {workSched.length === 0 ? <Typography>No Work Schedule Found</Typography> : <>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Created work schedule</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectWorkSched || 0}
                                    label="Created work schedule"
                                    onChange={e => setSelectWorkSched(e.target.value)}
                                >
                                    <MenuItem value={0}>None</MenuItem>
                                    {workSched.map((ws, index) => (
                                        <MenuItem key={index} value={ws.worksched_id}>
                                            {ws.whrs_desc}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                        }
                    </Grid>
                    <Grid item xs={12}>
                    <Box sx={{marginTop: 2, marginBottom: 2}}>
                        <Divider />
                    </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Description"
                            fullWidth
                            value={tempData?.whrs_desc || ''}
                            onChange={e => handleUpdateWorkSched({ whrs_desc: e.target.value })}
                        />
                    </Grid>

                    {/* holidays select if needed */}
                    <Grid item xs={12}>
                        {holidaysData.length === 0 ?
                            <Typography align='center' variant='caption' sx={{ padding: 2 }} >No holidays found</Typography>
                            :
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Holiday (Optional)</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={tempData?.holidays_id || 0}
                                    label="Select Holiday (Optional)"
                                    onChange={e => handleUpdateWorkSched({ holidays_id: e.target.value })}
                                >
                                    <MenuItem value={0}>None</MenuItem>
                                    {holidaysData.map((holiday, index) => (
                                        <MenuItem key={index} value={holiday.holidays_id}>
                                            {holiday.holiday_desc + ' - ' + holiday.date_from + ' to ' + holiday.date_to}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                    </Grid>

                    {/* file upload */}
                    <Grid item xs={12}>
                        <Box sx={{ border: '1px rgba(0, 0, 0, 0.23) solid', borderRadius: '4px', padding: '5px' }}>
                            <label htmlFor={"contained-button-file"} style={{ display: 'flex' }}>
                                <span>{uploadedFileName}</span>
                                <Input accept="image/*,.pdf" id={"contained-button-file"} type="file" onChange={(value) => handleFile(value)} hidden />
                                {!uploadedFileName ?
                                    <span>
                                        Upload file Memo
                                    </span>
                                    : <span></span>
                                }
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Tooltip title='Upload Letter Head'>
                                    <IconButton color='primary' className='custom-iconbutton' component="span"><UploadIcon /></IconButton>
                                </Tooltip>
                            </label>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        {/* <input
                            required
                            type="time"
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                            value={tempData?.time_in || ''}
                            onChange={(e) => {
                                const time = e.target.value;
                                const [hours, minutes] = time.split(':');
                                const roundedMinutes = Math.round(minutes / 5) * 5;
                                const formattedMinutes = roundedMinutes.toString().padStart(2, '0');
                                const formattedTime = `${hours}:${formattedMinutes}`;
                                handleUpdateWorkSched({ time_in: formattedTime });
                            }}
                            step="300"
                        /> */}

                        {/* <input type="time" step={300} /> */}

                        <TextField
                            // required
                            label="Time In"
                            id="time"
                            type="time"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            step="300"
                            inputProps={{
                                step: 300,
                            }}
                            value={tempData?.time_in || ''}
                            onChange={e => handleUpdateWorkSched({ time_in: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            // required
                            label="Break out"
                            type="time"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300,
                                onInput: (e) => {
                                    const time = e.target.value;
                                    const [hours, minutes] = time.split(':');
                                    const roundedMinutes = Math.round(minutes / 5) * 5;
                                    const formattedMinutes = roundedMinutes.toString().padStart(2, '0');
                                    e.target.value = `${hours}:${formattedMinutes}`;
                                }
                            }}
                            value={tempData?.break_out || ''}
                            onChange={e => handleUpdateWorkSched({ break_out: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            // required
                            label="Break in"
                            type="time"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300,
                                onInput: (e) => {
                                    const time = e.target.value;
                                    const [hours, minutes] = time.split(':');
                                    const roundedMinutes = Math.round(minutes / 5) * 5;
                                    const formattedMinutes = roundedMinutes.toString().padStart(2, '0');
                                    e.target.value = `${hours}:${formattedMinutes}`;
                                }
                            }}
                            value={tempData?.break_in || ''}
                            onChange={e => handleUpdateWorkSched({ break_in: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            // required
                            label="Time out"
                            type="time"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300,
                                onInput: (e) => {
                                    const time = e.target.value;
                                    const [hours, minutes] = time.split(':');
                                    const roundedMinutes = Math.round(minutes / 5) * 5;
                                    const formattedMinutes = roundedMinutes.toString().padStart(2, '0');
                                    e.target.value = `${hours}:${formattedMinutes}`;
                                }
                            }}
                            value={tempData?.time_out || ''}
                            onChange={e => handleUpdateWorkSched({ time_out: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button variant="contained" color="success" type="submit"> Save </Button>
                    </Grid>
                </Grid>
            </form>
        </Stack>
    </>
    )
}