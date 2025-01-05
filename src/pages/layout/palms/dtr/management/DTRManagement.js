import { Alert, Autocomplete, Box, Button, Divider, Grid, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { blue, red, green, orange } from '@mui/material/colors'
import { useNavigate } from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";
import { checkPermission } from "../../../permissionrequest/permissionRequest";
import DashboardLoading from "../../../loader/DashboardLoading";
import ModuleHeaderText from "../../../moduleheadertext/ModuleHeaderText";
import { getAllBioDevices, getEmpDTRPerOffices, getEmpListPerOffices, getOfficeList, reExecAllBioLogs, reExecBioLogs } from "./DTRManagementRequests";
import { APILoading } from "../../../apiresponse/APIResponse";
import Swal from "sweetalert2";
import { EmpList } from "./component/EmpList";
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SmallModal from "../../../custommodal/SmallModal";
import { ReExecute } from "./component/ReExecute";
import { APIError, UnderDevelopmentStat } from "../../../customstring/CustomString";
import { EditCalendar, Send as SendIcon, CalendarMonth } from "@mui/icons-material";
import FullModal from "../../../custommodal/FullModal";
import WorkSchedEditCalendar from "./component/WorkSchedEditCalendar";
import { TemplateMaster } from "./component/TemplateMaster";
export const DTRManagement = () => {
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading, setIsLoading] = useState(true)
    const [officesData, setOfficesData] = useState([])
    const [selectedOffice, setSelectedOffice] = useState(null)
    const [periodFrom, setPeriodFrom] = useState('')
    const [periodTo, setPeriodTo] = useState('')
    const [data, setData] = useState([])
    const [actions, setActions] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [bioDevicesData, setBioDevicesData] = useState([])
    // const [failedBioDevices, setFailedBioDevices] = useState(() => {
    //     return JSON.parse(localStorage.getItem('failedBioDevices')) || []
    // })
    const [workSchedToggle, setWorkSchedToggle] = useState(false)
    const [open, setOpen] = useState(null)

    useEffect(() => {
        checkPermission(78)
            .then((response) => {
                if (response.data) {
                    _init();
                } else {
                    navigate(`/${process.env.REACT_APP_HOST}`)
                }
            })
            .catch((error) => {
                toast.error(error.message)
                console.log(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])
    const _init = async () => {
        const res = await getOfficeList();
        if (res.data.data) {
            setOfficesData(JSON.parse(res.data.data.offices))
            setActions(JSON.parse(res.data.data.actions))
            setIsAdmin(res.data.data.admin)
            if (res.data.data.admin) {
                _getBioDevices();
            }
        }
        console.log(res.data)
    }
    const _getBioDevices = async () => {
        const res = await getAllBioDevices();
        // console.log(res.data)
        setBioDevicesData(res.data.data)
    }
    const handleChangeOffice = (val) => {
        setSelectedOffice(val)
    }
    const handleProceed = async (e) => {
        e.preventDefault();
        try {
            var t_data = {
                dept_code: selectedOffice.dept_code,
                from: periodFrom,
                to: periodTo
            }
            APILoading('info', 'Processing request', 'Please wait...');
            // const res = await getEmpListPerOffices(t_data);
            const res = await getEmpDTRPerOffices(t_data)
            if (res.data.data.length > 0) {
                setData(res.data.data)
                Swal.close();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No list of employee found'
                })
            }
            // console.log(res.data);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: err
            })
        }
    }
    const [openReExec, setOpenReExec] = useState(false)
    const handleReExec = () => {
        setOpenReExec(true)
    }
    const handleReExecAllBio = async () => {
        // Validate date range
        if (!periodFrom || !periodTo) {
            Swal.fire({
                icon: 'error',
                title: 'Please select a valid date range',
            });
            return;
        }

        if (new Date(periodFrom) > new Date(periodTo)) {
            Swal.fire({
                icon: 'error',
                title: 'The "From" date cannot be greater than the "To" date',
            });
            return;
        }

        // Show loading indicator
        Swal.fire('Please wait... Re-executing bio devices, You can close this window while it processes');
        Swal.showLoading();

        var t_data = {
            list_device_id: bioDevicesData,
            from: periodFrom,
            to: periodTo,
        }

        reExecAllBioLogs(t_data)
            .then(res => {
                console.log(res.data)
                if (res.data.status === 200) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: err
                })
            })
            .finally(() => {
                Swal.close();
            })

        // try {
        //     // // Process bio devices
        //     // const failedDevices = await Promise.all(
        //     //     bioDevicesData.map(async (bioDevice) => {
        //     //         const t_data = {
        //     //             device_id: bioDevice.id,
        //     //             from: periodFrom,
        //     //             to: periodTo
        //     //         };

        //     //         try {
        //     //             await reExecBioLogs(t_data);
        //     //             toast.success(`Re-execution request sent for device: ${bioDevice.id}`);
        //     //             return null; // Successful device, return null to filter it out
        //     //         } catch (error) {
        //     //             console.error(`Error re-executing bio logs for device ${bioDevice.id}: `, error);
        //     //             return bioDevice; // Failed device, return it to the failedDevices array
        //     //         }
        //     //     })
        //     // );

        //     // setFailedBioDevices(failedDevices.filter(Boolean)); // Filter out successful devices
        //     // localStorage.setItem('failedBioDevices', JSON.stringify(failedDevices.filter(Boolean)));

        //     // // Display success or error message
        //     // if (failedDevices.length > 0) {
        //     //     toast.error(`Some bio devices failed to re-execute. Check the failed devices list.`);
        //     // } else {
        //     //     toast.success(`All bio devices re-execution requests sent successfully.`);
        //     // }
        // } catch (error) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: error.message
        //     });
        // } finally {
        //     Swal.close();
        // }
    };
    return (
        <React.Fragment>
            {
                isLoading
                    ?
                    <Box sx={{ margin: '5px 10px 10px 10px' }}>
                        <DashboardLoading actionButtons={1} />
                    </Box>
                    :
                    <Box sx={{ margin: '5px 10px 10px 10px' }}>
                        <form onSubmit={handleProceed} style={{ width: '100%' }}>
                            <Grid container spacing={1} sx={{ p: 1 }}>
                                {/* <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title = 'DTR Management'/>
                        </Grid> */}

                                <Grid item xs={12}>
                                    <UnderDevelopmentStat />
                                </Grid>

                                <Grid item xs={12} md={12} lg={6}>
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
                                            handleChangeOffice(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label='Office' required />}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        <TextField type='date' label='From' InputLabelProps={{ shrink: true }} value={periodFrom} onChange={(val) => setPeriodFrom(val.target.value)} required size="small" />
                                        <TextField type='date' label='To' InputLabelProps={{ shrink: true }} value={periodTo} onChange={(val) => setPeriodTo(val.target.value)} required size="small" />
                                        <Button variant="contained" type="submit" className="custom-roundbutton" endIcon={<SendIcon />} sx={{ pl: 5, pr: 5 }}>Proceed</Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {
                                            isAdmin
                                                ?
                                                <Button variant="contained" color="secondary" sx={{ pl: 3, pr: 3 }} className="custom-roundbutton" endIcon={<CloudSyncIcon />} onClick={handleReExec}>Re-Exec</Button>
                                                :
                                                null
                                        }
                                        {
                                            actions.some(el => el === "EXECUTEALL")
                                                ?
                                                <Button variant="contained" color="secondary" sx={{ pl: 3, pr: 3 }} className="custom-roundbutton" endIcon={<CloudSyncIcon />} onClick={handleReExecAllBio}>Re-Exec All Bio Devices</Button>
                                                :
                                                null
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    {
                                        actions.some(el => el === 'WORK_SCHED_EVENTS')
                                            ?
                                            <>
                                                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                                    <Typography variant="subtitle2"> Work Schedule: </Typography>
                                                    <Button variant="contained" color="primary" className="custom-roundbutton" startIcon={<CalendarMonth />} onClick={() => setOpen('work-sched-temp-master')}> Template Master </Button>
                                                    {/* <Button variant="contained" color="info" className="custom-roundbutton" startIcon={<EditCalendar />} onClick={() => setWorkSchedToggle(true)}>Updating</Button> */}
                                                </Stack>
                                            </>
                                            :
                                            null
                                    }
                                </Grid>
                            </Grid>
                        </form>
                        <Box sx={{ margin: '0.5rem 0' }}>
                            <Divider />
                        </Box>
                        {
                            data.length > 0
                                ?
                                (
                                    <EmpList from={periodFrom} to={periodTo} data={data} setData={setData} actions={actions} deptCode={selectedOffice?.dept_code} />
                                )
                                :
                                null
                        }
                    </Box>

            }
            <SmallModal open={openReExec} close={() => setOpenReExec(false)} title='Re execute bio logs retrieval'>
                <ReExecute list={bioDevicesData} close={() => setOpenReExec(false)} />
            </SmallModal>
            {/* <FullModal open={workSchedToggle} close={() => setWorkSchedToggle(false)} title="Work schedule updating">
                <WorkSchedEditCalendar officesData={officesData} actions={actions} />
            </FullModal> */}
            <FullModal open={open === 'work-sched-temp-master'} close={() => setOpen(null)} title="Work schedule template master">
                <TemplateMaster officesData={officesData} />
            </FullModal>
        </React.Fragment>
    )
}