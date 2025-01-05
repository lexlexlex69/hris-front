import { useState, useContext, useEffect } from 'react';
import { HolidayMasterContext } from "../Context";
import { updateHoliday } from "../../Request/HolidayRequest";
import { APISuccess, APIError } from "../../../../customstring/CustomString";
import { auditLogs } from '../../../../auditlogs/Request';
import { Box, LinearProgress, Typography, Grid, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, MenuItem, InputLabel, TextField, Button, Stack, Pagination } from '@mui/material';
import DatePicker from 'react-multi-date-picker';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export function EditHoliday() {
    const { tempData, setTempData, holidayMasterData, setHolidayMasterData, setStatus, status } = useContext(HolidayMasterContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItem, setCurrentItem] = useState(0);
    const itemsPerPage = 1;

    // const [formData, setFormData] = useState({
    //     holidays_id: tempData.holidays_id,
    //     holiday_desc: tempData.holiday_desc,
    //     date_from: tempData.date_from,
    //     date_to: tempData.date_to,
    //     year: tempData.year
    // });

    // useEffect(() => {
    //     console.log(tempData)
    // }, [tempData]);
    // useEffect(() => {
    //     console.log(currentItem, currentPage)
    // }, [currentItem, currentPage])

    if (status === 'edit-loading') {
        setTimeout(() => {
            setStatus(null)
        }, 2000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const response = await updateHoliday(formData);
            // if (response.status === 200) {
            //     APISuccess('Holiday Updated', 'Holiday has been updated successfully');
            //     // onSuccess();
            //     // var logs = {
            //     //     action: 'DELETE HOLIDAY MASTER FILE',
            //     //     action_dtl: 'HOLIDAY MASTER FILE DELETED - ' + JSON.stringify(t_data),
            //     //     module: 'HOLIDAYS MASTER FILE'
            //     // }
            //     // auditLogs(logs)
            // } else {
            //     APIError('Update Failed', response.message);
            // }
        } catch (error) {
            APIError('Error', error.message);
        }
    };
    const totalPages = Math.ceil(tempData.length / itemsPerPage);
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        setCurrentItem(page - 1);
    };
    const handleNext = () => {
        if (currentItem < tempData.length - 1) {
            setCurrentItem(prev => prev + 1);
            setCurrentPage(prev => prev + 1);
        }
    };
    const handlePrevious = () => {
        if (currentItem > 0) {
            setCurrentItem(prev => prev - 1);
            setCurrentPage(prev => prev - 1);
        }
    };
    const handleUpdate = () => {
        let err = 0;
        tempData.forEach(element => {
            if (!element.holiday_desc) {
                err = err + 1;
            }
            if (!element.date_from) {
                err = err + 1;
            }
            if (!element.date_to) {
                err = err + 1;
            }
            if (!element.year) {
                err = err + 1;
            }
            if (!element.cover) {
                err = err + 1;
            }
            if (!element.type) {
                err = err + 1;
            }
        });

        if (err > 0) {
            return toast.error('Please fill up all required fields');
        }

        // updateHoliday(data)
        Swal.fire({
            title: 'Click submit to continue',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Submit'
        }).then(async (result) => {
            if (result.isConfirmed) {
                var logs = {
                    action: 'UPDATE HOLIDAY MASTER FILE',
                    action_dtl: 'HOLIDAY MASTER FILE UPDATED: ' + JSON.stringify(tempData),
                    module: 'HOLIDAYS MASTER FILE'
                }
                auditLogs(logs)
                await updateHoliday(tempData)
                    .then(res => {
                        if (res.data.status === 200) {
                            console.log(res)
                            APISuccess('Updated Holiday', res.data.message)
                            // setTempData({})
                            setHolidayMasterData((prev) => ({ ...prev, allHolidays: res.data.data }));

                            if (res.data.results.length > 0) {
                                var notUpdated = res.data.results.filter(element => element.updated === false).map(element => element.data['holiday_desc']).join(', ');
                                Swal.fire('Warning updated holiday', `The following holidays were not updated: ${notUpdated}`, 'warning');
                            }
                        } else {
                            APIError('Error updating holiday', res.data.message)
                        }
                    })
                    .catch(err => {
                        APIError('Error updating holiday', err.message)
                    })
            }
        })
    }
    return (<>
        {status === 'edit-loading' ?
            <Box sx={{ width: '100%', height: 'auto' }}>
                <Typography variant='caption' sx={{ textAlign: 'center' }}> Fetching data.Please wait... </Typography>
                <LinearProgress />
            </Box>
            :
            <>
                {/* <form onSubmit={handleSubmit}> */}
                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item xs={12}>
                        <InputLabel >Holiday Date Range</InputLabel>
                        <Grid container spacing={2}>
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
                                        value={tempData[currentItem].date_from ?? ''}
                                        fullWidth
                                        onChange={(newValue) => {
                                            const updatedData = [...tempData];
                                            updatedData[currentItem] = {
                                                ...updatedData[currentItem],
                                                date_from: newValue,
                                                date_to: newValue
                                            };
                                            setTempData(updatedData);
                                        }}
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
                                        value={tempData[currentItem].date_to ?? ''}
                                        fullWidth
                                        onChange={(newValue) => {
                                            const updatedData = [...tempData];
                                            updatedData[currentItem] = {
                                                ...updatedData[currentItem],
                                                date_to: newValue
                                            };
                                            setTempData(updatedData);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Year"
                            type="number"
                            value={tempData[currentItem].year ?? ''}
                            required
                            InputProps={{
                                inputProps: {
                                    min: 1900,
                                    max: 9999
                                }
                            }}
                            onChange={(e) => {
                                const updatedData = [...tempData];
                                updatedData[currentItem] = {
                                    ...updatedData[currentItem],
                                    year: e.target.value
                                };
                                setTempData(updatedData);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Holiday Description"
                            required
                            value={tempData[currentItem].holiday_desc ?? ''}
                            onChange={(e) => {
                                const updatedData = [...tempData];
                                updatedData[currentItem] = {
                                    ...updatedData[currentItem],
                                    holiday_desc: e.target.value
                                };
                                setTempData(updatedData);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <FormLabel>Type of Holiday</FormLabel>
                            <Select
                                // defaultValue="1"
                                value={String(tempData[currentItem].type ?? '')}
                                required
                                onChange={(e) => {
                                    const updatedData = [...tempData];
                                    updatedData[currentItem] = {
                                        ...updatedData[currentItem],
                                        type: e.target.value
                                    };
                                    setTempData(updatedData);
                                }}
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
                                value={String(tempData[currentItem].cover ?? '')}
                                required
                                onChange={(e) => {
                                    const updatedData = [...tempData];
                                    updatedData[currentItem] = {
                                        ...updatedData[currentItem],
                                        cover: e.target.value
                                    };
                                    setTempData(updatedData);
                                }}
                            >
                                <MenuItem value="1">National</MenuItem>
                                <MenuItem value="2">Local</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="secondary" type="submit"> Update Holiday </Button>
                        </Grid> */}
                </Grid>
                {/* </form> */}
                <Box sx={{ padding: '0 16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="secondary" onClick={() => handleUpdate()} > Update Holiday </Button>
                </Box>
                <Stack spacing={2} direction="row" justifyContent="center" mt={2}>
                    <Button
                        variant="contained"
                        onClick={handlePrevious}
                        disabled={currentItem === 0}
                    >
                        Previous
                    </Button>

                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />

                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={currentItem === tempData.length - 1}
                    >
                        Next
                    </Button>
                </Stack>
            </>
        }
    </>
    );
}
