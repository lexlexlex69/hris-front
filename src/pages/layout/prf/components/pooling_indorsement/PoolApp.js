import { Fragment, useContext, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

import { Autocomplete, Box, Button, Card, CardActions, CardContent, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputLabel, MenuItem, Pagination, Paper, Radio, RadioGroup, Select, Skeleton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography } from "@mui/material"
import { PersonSearch as PersonSearchIcon } from '@mui/icons-material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { isEmptyObject } from "jquery";

import { getEmpList, insertPooledApp } from "../../axios/prfPooling"

import { PrfStateContext } from "../../PrfProvider"
import { CustomFullDialog } from "../export_components/ExportComp";
import ButtonViewPRF from "../../requestdetails/view/ButtonViewPRF";
import ApplicantSearch from "./component/ApplicantSearch";
import { AppliedInfo } from "./component/ExportComponent";
import { handleSendNotif } from "./component/SendMail"
import NoDataFound from "../NoDataFound";
import { autoCapitalizeFirstLetter } from "../../../customstring/CustomString"

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const columnPooling = [
    { id: 1, label: 'FULL NAME' },
    { id: 2, label: 'EMAIL ADDRESS' },
    { id: 3, label: 'CELL #' },
    { id: 4, label: 'TELEPHONE' },
    { id: 5, label: 'APPLICANT TYPE' },
    { id: 6, label: 'ACTIONS' },
]

function PoolApp({ closeModal }) {
    const { matches, tempReq, tempStorage } = useContext(PrfStateContext)
    const [requestQueue, setRequestQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false);
    const [hrisPersonnel, setHrisPersonnel] = useState([])
    const [selectedRater, setSelectedRater] = useState({
        human_resources: {},
        immediate_head: {},
    })
    const [selectedNextLvl, setSelectedNextLvl] = useState([])
    const [loading, setLoading] = useState(true)
    // const [clickToggler1, setClickToggler1] = useState(false)
    // const [clickToggler2, setClickToggler2] = useState(false)

    const [open, setOpen] = useState(0)
    const [tempCandidates, setTempCandidates] = useState([])
    const [selectedCandidates, setSelectedCandidates] = useState(() => {
        const savedContent = localStorage.getItem('selectedCandidates')
        return savedContent ? JSON.parse(savedContent) : [];
    })
    const [openViewprf, setOpenViewprf] = useState(false)
    // const [sentToggler, setSentToggler] = useState(true)
    let controller = new AbortController();


    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        localStorage.setItem('selectedCandidates', JSON.stringify(selectedCandidates))
    }, [selectedCandidates])

    const processQueue = async () => {
        if (processingQueue || requestQueue.length === 0) return;
        setProcessingQueue(true);
        const currentRequest = requestQueue[0];
        try {
            await currentRequest();
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

    // for pagination
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const perPage = 5

    // const handleEditToggler = (type) => {
    //     if (type === 1) {
    //         setClickToggler2(!clickToggler2)
    //     } else if (type === 2) {
    //         setClickToggler1(!clickToggler1)
    //     }
    // }

    const handleInputChange = (e, rowIndex, columnName) => {
        // const newData = [...dataaa];
        // // on going fix ← 

        // // newData[rowIndex][columnName] = e.target.value;
        // // newData.data[rowIndex][columnName] = e.target.value;

        // // const test = dataaa.filter((i, indx) => indx === rowIndex)
        // // const test = setSelectedCandidates((prev, index) => [...prev, prev.data: ])


        // console.log(dataaa, columnName, objectArr, test)
        // // setSelectedCandidates(newData);

        // const handleInputChange = (e, rowIndex, columnName) => {
        const updatedCandidates = [...selectedCandidates];
        updatedCandidates[rowIndex].data[columnName] = e.target.value;
        setSelectedCandidates(updatedCandidates);
        // };

    };

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
                getEmpList({ dept_title: tempReq.office_dept }),
            ])
            if (response1.data.status === 500) { toast.error(response1.data.message) }
            setHrisPersonnel(response1.data.data)
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


    const handleSubmitRaterCandidates = (ev) => {
        ev.preventDefault();
        if ((selectedRater.human_resources === undefined || selectedRater.human_resources === null) || (selectedRater.immediate_head === undefined || selectedRater.immediate_head === null)) {
            return toast.warning('Please fill in fields')
        } else {
            if ((Object.keys(selectedRater.human_resources).length <= 0) || (Object.keys(selectedRater.immediate_head).length <= 0)) {
                return toast.warning('Please fill in fields')
            }
            if (selectedCandidates.length <= 0) {
                return toast.warning('Please add/search for candidates.')
            }
        }

        // if (sentToggler) {
        //     return toast.warning('To continue, please send notification for the candidates.')
        // }

        var payload = {}
        payload.prf_details = tempReq
        payload.human_resources = selectedRater.human_resources
        payload.immediate_head = selectedRater.immediate_head
        payload.next_lvl_head = selectedNextLvl

        let extractList = []
        selectedCandidates.forEach(element => {
            extractList.push(element.data)
        });

        payload.candidates = extractList
        //   payload.applicant_list = selectedApplicant
        //   payload.employee_list = selectedEmployee

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
                        const result = await insertPooledApp(payload);
                        if (result.data.status === 200) {
                            toast.success(result.data.message);
                            localStorage.removeItem('selectedCandidates');
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
    }

    // const handlePaginationPage = (ev, v) => {
    // }

    const handleRemoveSC = (ev, it, idx) => {
        ev.preventDefault();
        const r = selectedCandidates.filter((f, index) => index !== idx);
        setSelectedCandidates(r)
    }

    const handleSend = (ev) => {
        ev.preventDefault();

        let f = []
        selectedCandidates.forEach(element => {
            f.push({ cname: element.data.cname, cpno: element.data.cpno, telno: element.data.telno, emailadd: element.data.emailadd, applicant_id: element.data.applicant_id, app_type: element.data.app_type })
        });

        handleSendNotif(f, tempReq)
    }


    return (
        <>
            {/* MODALs */}
            <Fragment>
                <CustomFullDialog id={'test'} openG={open === 1} handleCloseG={() => setOpen(0)} comptitle={''} compSize={''} minWidthP={'65%'}>
                    {open === 1 ? <>
                        <ApplicantSearch tempReq={tempReq} selectedList={selectedCandidates} setSelectedList={setSelectedCandidates} />
                    </> : <>
                    </>
                    }
                </CustomFullDialog>
            </Fragment>

            {loading ? (
                <Stack gap={1}>
                    <Skeleton variant="rectangle" width="100%" height={50} sx={{ margin: "0px" }} animation="pulse" />
                    <Skeleton variant="rectangle" width="100%" height={180} sx={{ margin: "0px" }} animation="pulse" />
                    <Skeleton variant="rectangle" width="100%" height={200} sx={{ margin: "0px" }} animation="pulse" />
                </Stack>
            ) : (
                <>
                    <Card>
                        <CardContent variant="outlined">
                            <Grid container spacing={2} sx={{ px: 2, py: 1 }}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <AppliedInfo tempReq={tempReq} />
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                        <ButtonViewPRF open={openViewprf} handleClickOpen={() => setOpenViewprf(true)} handleClose={() => setOpenViewprf(false)} id={'pa-id'} minWidth={'65%'} />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Typography variant="body1" fontWeight={600} color="initial" align="center" sx={{ p: 1 }}> Assigning of Rater </Typography>
                                    <Stack spacing={1}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormLabel required> Human Resource </FormLabel>
                                            <Autocomplete disablePortal id="combo-box-employee" size="small"
                                                onChange={(event, newValue) => { setSelectedRater({ ...selectedRater, human_resources: newValue }); }}
                                                getOptionLabel={(opt) => opt.lname + ', ' + opt.fname + ' ' + opt.mname + ' - ' + opt.position_name}
                                                options={hrisPersonnel.hr_personnel}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Box>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormLabel required> Immediate Head </FormLabel>
                                            <Autocomplete disablePortal id="combo-box-employee" size="small"
                                                onChange={(event, newValue) => { setSelectedRater({ ...selectedRater, immediate_head: newValue }); }}
                                                getOptionLabel={(opt) => opt.lname + ', ' + opt.fname + ' ' + opt.mname + ' - ' + opt.position_name}
                                                options={hrisPersonnel.dept_personnel}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Box>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormLabel required> Next Level Head </FormLabel>
                                            <Autocomplete multiple id="tags-standard" limitTags={8} size="small"
                                                options={hrisPersonnel.dept_personnel}
                                                getOptionLabel={(opt) => opt.lname + ', ' + opt.fname + ' ' + opt.mname + ' - ' + opt.position_name}
                                                renderInput={(params) => (<TextField {...params} variant="outlined" />)}
                                                getOptionDisabled={(option) => option === selectedRater.immediate_head}
                                                renderTags={(value, getTagProps) => value.map((option, index) => {
                                                    const { key, ...tagProps } = getTagProps({ index });
                                                    return (
                                                        <Chip variant="outlined" label={option.lname + ', ' + option.fname + ' ' + option.mname[0] + '. '} key={key} {...tagProps} />
                                                    );
                                                })
                                                }
                                                onChange={(event, newValue) => { setSelectedNextLvl({ ...selectedNextLvl, newValue }) }}
                                            />
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Card variant="outlined" sx={{ padding: '0px' }}>
                                        <Box>
                                            <Typography variant="body1" fontWeight={600} color="initial" align="center" sx={{ p: 1 }}> INTERNAL/EXTERNAL </Typography>
                                        </Box>
                                        <CardContent sx={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                            <Box>
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                <Button variant="contained" endIcon={<PersonSearchIcon />} onClick={() => setOpen(1)} color="secondary"> Search Candidates </Button>
                                            </Box>
                                            <TableContainer component={Paper} sx={{ height: '300px', maxHeight: '350px' }}>
                                                <Table aria-label="internal list table" size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            {columnPooling.map((o, indx) => (
                                                                <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}> {o.label} </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {!isEmptyObject(selectedCandidates) ?
                                                            <>
                                                                {selectedCandidates.map((o, indx) => (
                                                                    <TableRow key={'table-' + o.data['app_type'] + indx}>
                                                                        <TableCell>
                                                                            <Link to={`../recruitment/evaluate-pds/${o.data.applicant_id}:${o.data.app_type}`} target={"_blank"}>
                                                                                {autoCapitalizeFirstLetter(o.data.cname)}
                                                                            </Link>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div>{o.data.emailadd || 'None'}</div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div> {o.data.cpno || 'None'} </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div> {o.data.telno || 'None'} </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div> {o.data.app_type || 'None'} </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Button variant="contained" color="error" size="small" onClick={(ev) => handleRemoveSC(ev, o, indx)} > remove </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </>
                                                            :
                                                            <NoDataFound spanNo={Object.keys(columnPooling).length} />
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Stack sx={{ mt: 1 }}>
                                                {/* <Pagination count={Math.ceil(total / perPage)} page={page} onChange={(ev, v) => handlePaginationPage(ev, v)}></Pagination> */}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Box>
                                        <Button variant="contained" color="success" onClick={(ev) => handleSubmitRaterCandidates(ev)}>
                                            Submit Candidates and rater
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid >
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    )
}

export default PoolApp
