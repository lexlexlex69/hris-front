import { Autocomplete, Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Send as SendIcon, Update as UpdateIcon } from '@mui/icons-material';
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { APILoading } from "../../../../apiresponse/APIResponse";
import { getWorkScheduleAPI } from "../WorkScheduleRequest";
import { getEmpDTRPerOffices } from "../DTRManagementRequests";
import { api_url } from "../../../../../../request/APIRequestURL";
import Grid2 from "@mui/material/Unstable_Grid2";
import WorkSchedEmpList from "./WorkSchedEmpList";
import moment from "moment";


export function WorkSchedEditCalendar({ officesData, actions }) {
    // const [selectedOffice, setSelectedOffice] = useState(null)
    // const [periodFrom, setPeriodFrom] = useState('')
    // const [periodTo, setPeriodTo] = useState('')
    const [periodMY, setPeriodMY] = useState('')
    const [selectedOffice, setSelectedOffice] = useState(officesData?.[0] || null)
    const [selectedWorkSchedule, setSelectedWorkSchedule] = useState(null)
    const [workScheduleData, setWorkScheduleData] = useState([])
    const [empData, setEmpData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        var t_data = {
            api_url: api_url
        }
        getWorkScheduleAPI(t_data)
            .then((res) => {
                console.log(res)
                // setWorkScheduleData(res.data.response.sort((a, b) => Number(a.whrs_code) - Number(b.whrs_code)))
                const sortedSchedules = res.data.response.sort((a, b) => Number(a.whrs_code) - Number(b.whrs_code));
                setWorkScheduleData(sortedSchedules);
                const defaultSchedule = sortedSchedules.find(schedule => schedule.whrs_code === '1');
                if (defaultSchedule) {
                    setSelectedWorkSchedule(defaultSchedule);
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message)
            })
            .finally(() => {
                setLoading(false)
            })

        console.log(actions)
    }, [])
    useEffect(() => {
        if (officesData?.length > 0) {
            setSelectedOffice(officesData[0])
        }
    }, [officesData])
    const handleProceed = async (e, val) => {
        e.preventDefault();
        e.stopPropagation();

        // console.log(periodMY)
        const firstDay = new Date(periodMY + '-01')
        const lastDay = new Date(periodMY.split('-')[0], periodMY.split('-')[1], 0)
        // console.log(firstDay, lastDay)

        const periodFrom = firstDay.toISOString().split('T')[0]
        const periodTo = lastDay.toISOString().split('T')[0]

        try {
            var t_data = {
                dept_code: selectedOffice.dept_code,
                from: periodFrom,
                to: periodTo
            }
            APILoading('info', 'Processing request', 'Please wait...');
            const res = await getEmpDTRPerOffices(t_data)
            if (res.data.data.length > 0) {
                setEmpData(res.data.data)
                Swal.close();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No list of employee found'
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: err
            });
        }
    }
    const handleSelectedWorkSched = (val) => {
        setSelectedWorkSchedule(val);
    }

    return (<>
        {loading ?
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={30} />
            </Box>
            :
            <Box sx={{ height: '80dvh', overflowY: 'scroll', padding: '0.5rem 1rem' }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <form onSubmit={handleProceed} style={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '5px' }}>
                                <Typography variant="caption"> By Department: </Typography>
                                <Autocomplete
                                    disablePortal
                                    id={"combo-box-offices"}
                                    options={officesData}
                                    getOptionLabel={(option) => option.dept_title}
                                    isOptionEqualToValue={(option, value) => option.dept_title === value.dept_title}
                                    // sx={{ minWidth: 300,maxWidth:'100%'}}
                                    fullWidth
                                    size="small"
                                    value={selectedOffice}
                                    onChange={(event, newValue) => {
                                        setSelectedOffice(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} sx={{ zIndex: 999 }} label='' required />}
                                />
                            </Box>
                            <Box>
                                <Typography variant="caption"> Date: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                {/* <TextField type='date' label='From' InputLabelProps={{ shrink: true }} value={periodFrom} onChange={(val) => setPeriodFrom(val.target.value)} required size="small" />
                            <TextField type='date' label='To' InputLabelProps={{ shrink: true }} value={periodTo} onChange={(val) => setPeriodTo(val.target.value)} required size="small" /> */}
                                <TextField type='month' label='Month, Year' InputLabelProps={{ shrink: true }} value={periodMY} onChange={(val) => setPeriodMY(val.target.value)} required size="small" />
                                {/* <TextField type='year' label='To' InputLabelProps={{ shrink: true }} value={periodTo} onChange={(val) => setPeriodTo(val.target.value)} required size="small" inputProps={{ min: '1900', max: '2100' }} /> */}

                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button variant="contained" type="submit" className="custom-roundbutton" sx={{ pl: 5, pr: 5 }} endIcon={<SendIcon />}>Proceed</Button>
                            </Box>
                        </form>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            <Typography variant="caption">Work Schedule:</Typography>
                            {/* {!selectedWorkSchedule ? null :
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    <Typography variant="caption"> Time in {selectedWorkSchedule.whrs_time1 ? selectedWorkSchedule.whrs_time1 : 'N/A'}</Typography>
                                    <Typography variant="caption"> Break out {selectedWorkSchedule.whrs_time2 ? selectedWorkSchedule.whrs_time2 : 'N/A'}</Typography>
                                    <Typography variant="caption"> Break in {selectedWorkSchedule.whrs_time3 ? selectedWorkSchedule.whrs_time3 : 'N/A'}</Typography>
                                    <Typography variant="caption"> Time out {selectedWorkSchedule.whrs_time4 ? selectedWorkSchedule.whrs_time4 : 'N/A'}</Typography>
                                </Box>
                            } */}
                            {/* <Autocomplete
                                disablePortal
                                id="combo-box-work-schedule"
                                options={workScheduleData}
                                getOptionLabel={(option) => `(${option.whrs_code}) ${option.whrs_time1 ? option.whrs_time1 + ' -' : ''} ${option.whrs_time2 ? moment(option.whrs_time2).format("LT") + ' -' : ''} ${option.whrs_time3} - ${option.whrs_time4}` || ''}
                                isOptionEqualToValue={(option, value) => option.whrs_desc === value.whrs_desc || option.whrs_code === value.whrs_code}
                                fullWidth
                                size="small"
                                value={selectedWorkSchedule}
                                onChange={(event, newValue) => {
                                    handleSelectedWorkSched(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} sx={{ zIndex: 999 }} label='' required />}
                            /> */}

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
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {empData?.length > 0 ?
                            <WorkSchedEmpList periodMY={periodMY} data={empData} setData={setEmpData} actions={actions} deptCode={selectedOffice?.dept_code} workScheduleData={workScheduleData} selectedWorkSchedule={selectedWorkSchedule} />
                            :
                            null
                        }
                    </Grid>
                </Grid>
            </Box>
        }
    </>
    )
}

export default WorkSchedEditCalendar