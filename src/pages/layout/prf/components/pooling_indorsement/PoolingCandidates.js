import { Fragment, useContext, useEffect, useState } from "react"
import { PrfStateContext } from "../../PrfProvider"

import { Avatar, AvatarGroup, Box, Button, Card, CardActionArea, CardActions, CardContent, Chip, Divider, Fade, FormControl, IconButton, ListItem, Popover, Popper, Skeleton, Stack, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { blue, deepPurple, indigo, lime, purple, red, teal } from "@mui/material/colors";
import { ArrowForward as ArrowForwardIcon, Cached as CachedIcon, DescriptionOutlined as DescriptionOutlinedIcon, DeleteOutlineOutlined as DeleteOutlineOutlinedIcon, Settings as SettingsIcon } from '@mui/icons-material';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

import { CustomCenterModal, CustomDialog, TableContainerComp } from "../export_components/ExportComp"
import { deleteApplicant, getApplicantList, reqAssessment, updateShortlistDatetime } from "../../axios/prfPooling"
import ButtonViewPRF from "../../requestdetails/view/ButtonViewPRF"
import { AppliedInfo } from "./component/ExportComponent"
import NoDataFound from "../NoDataFound"
import { handleSendNotif } from "./component/SendMail"
import PoolApp from "./PoolApp"

import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

const tablePoolColumns = [
    { id: 'date', headerName: 'ASSESSMENT DATE', width: '100px' },
    { id: "name", headerName: "APPLICANT NAME", width: '140px' },
    { id: "human_resources", headerName: "HUMAN RESOURCE", width: '100px' },
    { id: "immediate_head", headerName: "IMMEDIATE HEAD", width: '120px' },
    { id: "next_lvl_head", headerName: "NEXT LEVEL HEAD", width: '100px' },
    { id: "actions", headerName: "ACTIONS", width: '80px' },
]

function PoolingCandidates({ closeModal }) {
    const { tempReq, userId, applicantData, setApplicantData, applicantList, setApplicantList, } = useContext(PrfStateContext)
    const matches = useMediaQuery('(min-width: 565px)');
    const [tableColData, setTableColData] = useState(tablePoolColumns)
    const [loading, setLoading] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);
    const [appData, setAppData] = useState({})

    const [open, setOpen] = useState(false)
    const [openViewprf, setOpenViewprf] = useState(false)
    const [openNLH, setOpenNLH] = useState(false);
    const [openNotice, setOpenNotice] = useState(null);
    const [anchorElNLH, setAnchorElNLH] = useState(null);
    let controller = new AbortController();

    const [requestQueue, setRequestQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false);
    const showToast = (promise, successMessage, errorMessage) => {
        toast.promise(promise, { pending: 'Processing request...', success: successMessage || 'Operation successful!', error: errorMessage || 'Something went wrong!' });
    };
    const processQueue = async () => {
        if (processingQueue || requestQueue.length === 0) return;
        setProcessingQueue(true);
        const currentRequest = requestQueue[0];
        try {
            await showToast(currentRequest(), 'Request processed successfully!', 'Error processing request.');
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

    useEffect(() => {
        fetchData()
    }, [])

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
            const [response1,] = await Promise.all([
                getApplicantList(tempReq.id),
            ])
            setApplicantList(response1.data.data)
        } catch (e) {
            console.error('Error fetching data:', e);
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
    }

    const handlePoolO = () => {
        setOpen(true)
    }
    const handlePoolC = () => {
        setOpen(false)
        fetchData()
    }

    const handleActionBtn = (ev, type, it) => {
        ev.preventDefault();
        switch (type) {
            case 2:
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonColor: "#d33",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                    if (result.isConfirmed) {
                        enqueueRequest(async () => {
                            try {
                                const res = await deleteApplicant({ remove: it });
                                if (res.data.status === 500) { toast.error(res.data.message) }
                                if (res.data.status === 200) {
                                    // toast.success(res.data.message)
                                    fetchData();
                                }
                            } catch (error) {
                                toast.error(error.message);
                            }
                        });
                    }
                });
                break;
            case 99:
                if (applicantList.prf_iafs.length === 0) {
                    return toast.warning('Please pool / add an applicant first inorder to start the assessment')
                }

                Swal.fire({
                    title: "Click submit to continue?",
                    text: "",
                    icon: "info",
                    showCancelButton: true,
                    cancelButtonColor: "#d33",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Submit",
                }).then((result) => {
                    if (result.isConfirmed) {
                        enqueueRequest(async () => {
                            try {
                                const result = await reqAssessment({ tempReq, userId: userId });
                                if (result.data.status === 200) {
                                    closeModal()
                                } else {
                                    toast.error(result.data.message);
                                }
                            } catch (error) {
                                toast.error(error.message);
                            }
                        });
                    }
                });
                break;

            default:
                toast.warning('Error! Action not found!')
                break;
        }
    }

    // const [tempNotice, setTempNotice] = useState([]);
    // const handleAssessmentDatetime = (ev) => {
    //     ev.preventDefault();
    //     console.log(applicantList)

    //     let f = []
    //     if (tempNotice.length === 0) {
    //         applicantList.prf_iafs.forEach(element => {
    //             let checkmname = element.mname ? element.mname : '';
    //             f.push({
    //                 id: element.id,
    //                 lname: element.lname,
    //                 fname: element.fname,
    //                 mname: element.mname,
    //                 mname_ini: checkmname,
    //                 cpno: element.cpno,
    //                 telno: element.telno,
    //                 emailadd: element.emailadd,
    //                 applicant_id: element.app_id,
    //                 app_type: element.app_type,
    //                 rad_address: element.resident_address,
    //                 rad_city: element.radCity,
    //                 pad_address: element.permanent_address,
    //                 pad_city: element.padCity,
    //                 datetime_assessment: '',
    //             })
    //         });
    //         // setTempNotice(f)
    //     } else {
    //         applicantList.prf_iafs.forEach(element => {
    //             let checkmname = element.mname ? element.mname : '';
    //             f.push({
    //                 id: element.id,
    //                 lname: element.lname,
    //                 fname: element.fname,
    //                 mname: element.mname,
    //                 mname_ini: checkmname,
    //                 cpno: element.cpno,
    //                 telno: element.telno,
    //                 emailadd: element.emailadd,
    //                 applicant_id: element.app_id,
    //                 app_type: element.app_type,
    //                 rad_address: element.resident_address,
    //                 rad_city: element.radCity,
    //                 pad_address: element.permanent_address,
    //                 pad_city: element.padCity,
    //                 datetime_assessment: element.datetime_assessment,
    //             })
    //         });
    //     }
    //     setTempNotice(f)

    //     setOpenNotice('assessment-notice')
    // }
    const handleSend = async () => {
        let x = [];
        applicantList.prf_iafs.forEach(element => {
            if (element.datetime_assessment === '') {
                x.push({ error: 'datetime not set' })
            }
        });
        if (x.length > 0) {
            return toast.warning('Ops, please fill in each date time');
        }

        console.log(applicantList.prf_iafs, x)

        Swal.fire({
            title: "Click submit to continue?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                handleSendNotif(applicantList.prf_iafs, tempReq, null, 'api/prf/pooling-applicants/send-notification')
                // .then((res) => {
                //     if (res.data.status === 500) { toast.error(res.data.message) }
                //     if (res.data.status === 200) { toast.success(res.data.message) }
                // })
                // .catch((error) => {
                //     toast.error(error.message)
                // })
            }
        });
    }
    const handleSaveAsDatetime = async () => {
        let x = [];
        applicantList.prf_iafs.forEach(element => {
            if (element.datetime_assessment === '') {
                x.push({ error: 'datetime not set' })
            }
        });
        if (x.length > 0) {
            return toast.warning('Ops, please fill in each date time');
        }

        // console.log(applicantList.prf_iafs, x)

        Swal.fire({
            title: "Click submit to continue?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                updateShortlistDatetime({ applicant_list: applicantList, prf_data: tempReq }, controller).then((res) => {
                    if (res.data.status === 500) { toast.error(res.data.message) }
                    if (res.data.status === 200) { toast.success(res.data.message) }
                }).catch((error) => {
                    toast.error(error.message)
                })
            }
        });
    }

    const handleReloadData = () => {
        fetchData();
    }

    const handlePopoverOpen = (event, node) => {
        setAnchorEl(event.currentTarget);
        setAppData(node);
    };
    const handlePopoverClose = () => { setAnchorEl(null); setAppData({}); };
    const openHovPop = Boolean(anchorEl);

    const handleClickNLH = (event, it) => {
        setAnchorElNLH(event.currentTarget);
        setOpenNLH((previousOpen) => !previousOpen);

        if (anchorElNLH) {
            setAppData(it)
        } else {
            setAppData({})
        }
    };

    const canBeOpenNLH = openNLH && Boolean(anchorElNLH);
    const idNLH = canBeOpenNLH ? 'transition-popper' : undefined;

    if (loading) {
        return null
    }

    return (
        <>
            {/* MODALs */}
            <Fragment>
                <CustomDialog matches={matches} openner={open} handleCloseBTN={handlePoolC} comptitle={"Pooling of candidates"} compSize="230px">
                    <PoolApp closeModal={handlePoolC} />
                </CustomDialog>
                <PopoverApplicantInfo open={openHovPop} anchor={anchorEl} closeBtn={handlePopoverClose} data={appData} />
                <PopoverNLHComponent open={openNLH} anchor={anchorElNLH} closeBtn={handlePopoverClose} data={appData} list={applicantList.rater_info} />

                {/* <CustomCenterModal openner={openNotice === 'assessment-notice'} matches={matches} handleCloseBTN={() => setOpenNotice(null)} comptitle={'Assessment notice setting'} compSize={'40%'}>
                    {openNotice === 'assessment-notice' && (<>
                        <Stack spacing={2} sx={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 28rem)' }}>
                            {tempNotice.map((i, ix) => {
                                return (
                                    <Box key={ix} sx={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr', gap: '0.25rem', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem!important' }}>
                                        <Typography variant="body2" sx={{ textTransform: 'uppercase' }}> {i.lname + ', ' + i.fname}: </Typography>
                                        <TextField
                                            id={`datetime-${ix}`}
                                            label="Datetime"
                                            size="small"
                                            variant="standard"
                                            type="datetime-local"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                min: new Date().toISOString().slice(0, 16),
                                                step: 900,
                                            }}
                                            step={300}
                                            onChange={(e) => {
                                                const selectedDate = new Date(e.target.value);
                                                const dayOfWeek = selectedDate.getDay();

                                                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                                                    const updatedNotice = [...tempNotice];
                                                    updatedNotice[ix].datetime_assessment = e.target.value;
                                                    setTempNotice(updatedNotice);
                                                }
                                            }}
                                            value={i.datetime_assessment || ''}
                                        />
                                    </Box>
                                )
                            })}
                        </Stack>
                        <hr style={{ margin: '2rem 0' }} />
                        <Grid2 container spacing={1}>
                            <Grid2 item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Button endIcon={<ArrowForwardIcon />} variant="contained" size="small" color="secondary" onClick={() => handleSend()}> Send notification </Button>
                                </FormControl>
                            </Grid2>
                            <Grid2 item xs={12} lg={3}>
                                <FormControl fullWidth>
                                    <Button variant="contained" size="small" color="success" onClick={() => handleSaveAsDatetime()}> Save </Button>
                                </FormControl>
                            </Grid2>
                            <Grid2 item xs={12} lg={3}>
                                <FormControl fullWidth>
                                    <Button variant="contained" size="small" color="error" onClick={() => setOpenNotice(null)}> Cancel </Button>
                                </FormControl>
                            </Grid2>
                        </Grid2>
                    </>
                    )}
                </CustomCenterModal> */}
            </Fragment>

            {loading ? <>
                <Stack gap={1}>
                    <Skeleton variant="rectangle" width="100%" height={50} sx={{ margin: "0px" }} animation="pulse" />
                    <Skeleton variant="rectangle" width="100%" height={180} sx={{ margin: "0px" }} animation="pulse" />
                    <Skeleton variant="rectangle" width="100%" height={200} sx={{ margin: "0px" }} animation="pulse" />
                </Stack>
            </> :
                <Card>
                    <CardContent>
                        <Grid2 container spacing={1}>
                            <Grid2 item xs={12}>
                                <Stack spacing={1}>
                                    <AppliedInfo tempReq={tempReq} />
                                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                        <ButtonViewPRF open={openViewprf} handleClickOpen={() => setOpenViewprf(true)} handleClose={() => setOpenViewprf(false)} id={'pc-id'} minWidth={'65%'} />
                                    </Box>
                                    <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />
                                    <Box>
                                        <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" size="small" onClick={handleReloadData}>
                                            <CachedIcon />
                                        </IconButton>
                                        <Button endIcon={<SettingsIcon />} variant="contained" onClick={handlePoolO} sx={{ float: "right" }} color="secondary"> Applicant Setting </Button>
                                    </Box>
                                </Stack>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TableContainerComp>
                                    <TableHead key={'tabler-header'}>
                                        <TableRow>
                                            {tableColData.map((i, indx) => (
                                                <TableCell key={i.id + indx} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: i.width, backgroundColor: "#1565C0 !important" }}>
                                                    {i.headerName}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody key={'table-body'}>
                                        {Object.keys(applicantList.prf_iafs).length > 0 ? (
                                            <>
                                                {applicantList.prf_iafs.map((it, index) => (
                                                    <TableRow key={"applicant-list-" + it.id + index}>
                                                        <TableCell>
                                                            <TextField
                                                                id={`datetime-${it}`}
                                                                label="Datetime"
                                                                size="small"
                                                                variant="standard"
                                                                type="datetime-local"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                inputProps={{
                                                                    min: new Date().toISOString().slice(0, 16),
                                                                    step: 900,
                                                                }}
                                                                step={300}
                                                                // onChange={(e) => {
                                                                //     const selectedDate = new Date(e.target.value);
                                                                //     const dayOfWeek = selectedDate.getDay();

                                                                //     if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                                                                //         const dataList = [...applicantList];
                                                                //         const applicantIndex = dataList.prf_iafs.findIndex(applicant => applicant.id === it.id);
                                                                //         console.log(applicantIndex)
                                                                //         dataList.prf_iafs[applicantIndex].datetime_assessment = e.target.value;
                                                                //         setApplicantList(dataList);
                                                                //     }
                                                                // }}
                                                                onChange={(e) => {
                                                                    const selectedDate = new Date(e.target.value);
                                                                    const dayOfWeek = selectedDate.getDay();

                                                                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                                                                        setApplicantList(prevList => {
                                                                            const updatedList = { ...prevList };
                                                                            const applicantIndex = updatedList.prf_iafs.findIndex(applicant => applicant.id === it.id);
                                                                            if (applicantIndex !== -1) {
                                                                                updatedList.prf_iafs[applicantIndex] = {
                                                                                    ...updatedList.prf_iafs[applicantIndex],
                                                                                    datetime_assessment: e.target.value
                                                                                };
                                                                            }
                                                                            return updatedList;
                                                                        });
                                                                    }
                                                                }}

                                                                value={it.datetime_assessment || ''}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography aria-owns={openHovPop ? 'mouse-over-popover' : undefined} aria-haspopup="true"
                                                                onMouseEnter={(ev) => handlePopoverOpen(ev, it)}
                                                                onMouseLeave={handlePopoverClose}
                                                                sx={{ textDecoration: "none", color: "cornflowerblue" }}
                                                                variant="subtitle2"
                                                            >
                                                                {it.lname.toUpperCase() + ", " + it.fname.toUpperCase() + ' '}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '13px' }}>
                                                            {applicantList.rater_info.filter(ob => ob.rater_lvl === 'human_resources').filter(mn => mn.prf_applicant_id === it.id).map(f => (
                                                                <>
                                                                    {f.lname}
                                                                    {f.extname === null || f.extname === undefined || f.extname === "" ? "" : " " + f.extname}
                                                                    {", " + f.fname + " "}
                                                                    {f.mname ? f.mname[0] + '.' : ''}
                                                                </>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '13px' }}>
                                                            {applicantList.rater_info.filter(ob => ob.rater_lvl === 'immediate_head').filter(mn => mn.prf_applicant_id === it.id).map(f => (
                                                                <>
                                                                    {f.lname}
                                                                    {f.extname === null || f.extname === undefined || f.extname === "" ? "" : " " + f.extname}
                                                                    {", " + f.fname + " "}
                                                                    {f.mname ? f.mname[0] + '.' : ''}
                                                                </>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell>
                                                            <AvatarGroup max={3} aria-describedby={idNLH} onMouseEnter={(ev) => handleClickNLH(ev, it)} onMouseLeave={handleClickNLH}>
                                                                {applicantList.rater_info.filter(ob => ob.rater_lvl === 'next_level_head').filter(mn => mn.prf_applicant_id === it.id).map(f => (
                                                                    <Avatar alt={f.lname + ', ' + f.fname} src="/broken-image.jpg" sx={{ fontSize: '16px' }}>
                                                                        {f.fname ? f.fname[0] : '⁐'}
                                                                        {f.lname ? f.lname[0] : '⁐'}
                                                                    </Avatar>
                                                                ))}
                                                            </AvatarGroup>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                                                <Box>
                                                                    <Link to={`../recruitment/evaluate-pds/${it.app_id}:${it.is_employee === 1 ? 'employee' : 'applicant'}`} target={"_blank"} rel="noopener noreferrer" sx={{ textDecoration: "none", }}>
                                                                        <Tooltip title="View PDS">
                                                                            <IconButton type="button" className="custom-iconbutton" color='info'>
                                                                                <DescriptionOutlinedIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Link>
                                                                </Box>
                                                                <Box>
                                                                    <Tooltip title="Remove Applicant">
                                                                        <IconButton type="button" className="custom-iconbutton" color='error' onClick={(ev) => handleActionBtn(ev, 2, it)}>
                                                                            <DeleteOutlineOutlinedIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        ) : (
                                            <NoDataFound spanNo={Object.keys(tableColData).length} />
                                        )}
                                    </TableBody>
                                </TableContainerComp>
                            </Grid2>
                            <Grid2 item xs={12} lg={12}>
                                <Stack direction={'row'} sx={{ flexWrap: 'wrap', }}>
                                    {/* <Button variant="contained" color="warning" size="small" sx={{ borderRadius: '2rem' }} onClick={(ev) => handleAssessmentDatetime(ev)} disabled={applicantList.prf_iafs.length <= 0}> set assessment datetime </Button> */}
                                    <Button variant="contained" color="warning" size="small" sx={{ borderRadius: '2rem' }} onClick={(ev) => handleSend()} disabled={applicantList.prf_iafs.length <= 0}> send datetime </Button>
                                    &nbsp;
                                    <Button variant="contained" size="small" color="primary" onClick={() => handleSaveAsDatetime()}> Save </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button variant="contained" color="success" onClick={(ev) => handleActionBtn(ev, 99)} disabled={applicantList.prf_iafs.length <= 0}> Start Assessment </Button>
                                </Stack>
                            </Grid2>
                        </Grid2 >
                    </CardContent>
                </Card>
            }

        </>
    )
}

export default PoolingCandidates

export function PopoverApplicantInfo({ open, anchor, closeBtn, data }) {
    return (
        <Popover id="mouse-over-popover" sx={{ pointerEvents: 'none', }}
            open={open} anchorEl={anchor}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
            transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            onClose={closeBtn} disableRestoreFocus
        >
            <Box sx={{ p: 2 }}>
                {(data && anchor) && (
                    <Stack spacing={1}>
                        <Box>
                            <Typography variant="subtitle1">
                                Email:
                            </Typography>
                            <ul style={{ margin: 0, }}>
                                <li> {data.emailadd} </li>
                            </ul>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">
                                Cellphone Number / Telephone Number:
                            </Typography>
                            <ul style={{ margin: 0, }}>
                                <li> {data.cpno} </li>
                                <li> {data.telno} </li>
                            </ul>
                        </Box>
                    </Stack>
                )}
            </Box>
        </Popover>
    )
}

export function PopoverNLHComponent({ open, anchor, closeBtn, data, list }) {
    return (
        <Popover id="mouse-over-popover" sx={{ pointerEvents: 'none', }}
            open={open} anchorEl={anchor}
            anchorOrigin={{ vertical: 'center', horizontal: 'left', }}
            transformOrigin={{ vertical: 'center', horizontal: 'right', }}
            onClose={closeBtn} disableRestoreFocus
        >
            <Box sx={{ p: 2 }}>
                {(data && anchor) && (
                    <ul style={{ margin: 0, }}>
                        {list.filter(ob => ob.rater_lvl === 'next_level_head').filter(m => m.prf_applicant_id === data.id).map(f => (
                            <li alt={f.lname + ', ' + f.fname} src="/broken-image.jpg" >
                                {f.fname ? f.fname + ' ' : 'N/A '}
                                {f.mname ? f.mname[0] + '. ' : 'N/A '}
                                {f.lname ? f.lname : 'N/A'}
                            </li>
                        ))}
                    </ul>
                )}
            </Box>
        </Popover>
    )
}