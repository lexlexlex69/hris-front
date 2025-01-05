import { Fragment, createRef, forwardRef, useContext, useEffect, useMemo, useRef, useState, } from "react";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { Search as SearchIcon, ChevronRight as ChevronRightIcon, Close as CloseIcon, Feed as FeedIcon, Person as PersonIcon, Draw as DrawIcon, Article as ArticleIcon, Edit as EditIcon, Chair as ChairIcon, Delete as DeleteIcon, RestartAlt as RestartAltIcon, Preview as PreviewIcon, Cached as CachedIcon } from "@mui/icons-material";
import { Box, Button, Container, Dialog, Fade, FormLabel, FormControl, InputLabel, MenuItem, Paper, Select, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Grid, IconButton, Stepper, Step, Modal, StepLabel, Tooltip, InputAdornment, Popper, List, ListItem, Popover, Fab, } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Swal from "sweetalert2";
import { GETPRFNOTEST, deleteDetails, getDeptOrg, getDetails, getEmpStatData, getNatReqData, getOfficeDeptData, getPositionsData, getQS, insertDetails, requestingHeadSigner } from "../axios/prfRequest";

import { toast } from "react-toastify";
import moment from "moment";
import NoDataFound from "../components/NoDataFound";
import { isEmptyObject } from "jquery";
import { Transition, MyCustomDialog, CustomDialog, CustomRemark, CustomAddRemark, TableContainerComp, SearchComponent } from "../components/export_components/ExportComp";
import RequestForm from "./add/RequestForm";
import PrfProvider, { PrfStateContext } from "../PrfProvider";
import ViewRequestForm from "./view/ViewRequestForm";
import SignRequestForm from "../components/signature/SignRequestForm";
import EditRequestForm from "./edit/EditRequestForm";
import DashboardLoading from "../../loader/DashboardLoading";
import RequestStatModal from "../components/export_components/RequestStatModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import ViewRequestForm2 from "./view/ViewRequestForm2";



function RequestDetails() {
    return (
        <PrfProvider>
            <PersonnelRequestForm />
        </PrfProvider>
    );
}

function PersonnelRequestForm() {
    const {
        matches, userId, colData, rowData, setRowData, requestDataForm, setRequestDataForm, signedBy, setSignedBy,
        requestSignsViewer, setRequestSignsViewer, noDataFound, setNoDataFound, empStat, setEmpStat,
        natureReq, errors, setErrors, dateToday, setDataToNull, deptOrg, setDeptOrg, colDataQS,
        rowDataQS, setRowDataQs, tempStorage, setTempStorage, posTitle, setPosTitle, qsState, setQsState, postsPerPage, offSet, setOffSet,
        searchValue, setSearchValue, deptData, tempReq, setTempReq, tempSign, setTempSign, fetchDataPDList,
    } = useContext(PrfStateContext)

    // const navigate = useNavigate()
    // const [printId, setPrintId] = useState(null)

    let stepErrors = [];
    const [requestQueue, setRequestQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false);

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

    // Search Positions {
    // const [posts, setPosts] = useState([]);
    // const [page, setPage] = useState(0);
    // const postsPerPage = 10;
    // const numberOfPostsVisited = page * postsPerPage;
    // const totalPages = Math.ceil(posts.length / postsPerPage);
    // const changePage = ({ selected }) => {
    //     setPage(selected);
    // };
    // }

    const handleReloadData = () => {
        setNoDataFound(true)
        Swal.fire({
            icon: "info",
            title: "reloading the table...",
            timer: 2000,
            showConfirmButton: false,
        })
        enqueueRequest(async () => {
            try {
                const result = await fetchPrDetails({ user_id: userId });
                setRowData(result.data.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                Swal.close();
                setNoDataFound(false)
            }
        });
    }


    const [open1, setOpen1] = useState(false)
    const handleAddReqOpen = () => {
        setRequestDataForm(draft => { draft.office_dept = tempStorage.office_dept; draft.date_requested = dateToday; })
        setOpen1(true)
    }
    const handleAddReqClose = () => {
        setOpen1(false)
        setDataToNull()
    }
    const handleAddReqSubmit = (ev) => {
        ev.preventDefault()
        var payload = {}
        if (!requestDataForm.div_id) { stepErrors.errDiv = "Division is required"; }
        if (!requestDataForm.sec_id) { stepErrors.errSect = "Section is required"; }
        if (!requestDataForm.unit_id) { stepErrors.errUnit = "Unit is required"; }
        if (!requestDataForm.head_cnt) { stepErrors.errHead = "Head Count is required"; }
        if (!requestDataForm.pay_sal) { stepErrors.errPay = "Pay/Salary Grade is required"; }
        if (!requestDataForm.position) { stepErrors.errPosTitle = "Position/Functional Title is required"; }
        if (!requestDataForm.date_needed) { stepErrors.errDateNd = "Date Needed is required"; }
        if (!requestDataForm.emp_stat) { stepErrors.errEmpStat = "Employment Status is required"; }
        if (requestDataForm.nature_req.length === 0 || requestDataForm.nature_req === undefined) { stepErrors.errNat = "Nature of Request is required"; }
        if (requestDataForm.qs_educ_id.length === 0 || requestDataForm.qs_educ_id === undefined) { stepErrors.errQSEd = "Education is required"; }
        if (requestDataForm.qs_elig_id.length === 0 || requestDataForm.qs_elig_id === undefined) { stepErrors.errQSEl = "Eligibility is required"; }
        if (requestDataForm.qs_expe_id.length === 0 || requestDataForm.qs_expe_id === undefined) { stepErrors.errQSEx = "Experience is required"; }
        if (requestDataForm.qs_tech_skll_id.length === 0 || requestDataForm.qs_tech_skll_id === undefined) { stepErrors.errQSTech = "Technical Skills is required"; }
        if (requestDataForm.qs_train_id.length === 0 || requestDataForm.qs_train_id === undefined) { stepErrors.errQSTrng = "Training is required"; }

        if (Object.keys(stepErrors).length > 0) {
            toast.error("Please fill in the fields that are required")
            return setErrors(stepErrors);
        }

        payload.prf_no = requestDataForm.prf_no
        payload.office_dept = requestDataForm.office_dept
        payload.div_id = requestDataForm.div_id
        payload.sec_id = requestDataForm.sec_id
        payload.unit_id = requestDataForm.unit_id
        payload.head_cnt = requestDataForm.head_cnt
        payload.pay_sal = requestDataForm.pay_sal
        payload.position = requestDataForm.position
        payload.date_requested = requestDataForm.date_requested
        payload.date_needed = requestDataForm.date_needed
        payload.nature_req = requestDataForm.nature_req
        payload.emp_stat = requestDataForm.emp_stat
        payload.justification = requestDataForm.justification
        payload.job_summary = requestDataForm.job_summary
        payload.qs_educ_id = requestDataForm.qs_educ_id
        payload.qs_elig_id = requestDataForm.qs_elig_id
        payload.qs_expe_id = requestDataForm.qs_expe_id
        payload.qs_tech_skll_id = requestDataForm.qs_tech_skll_id
        payload.qs_train_id = requestDataForm.qs_train_id
        payload.qs_other_id = requestDataForm.qs_other_id
        payload.user_id = userId

        console.log(payload)

        // Submission
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
                        const response = await insertDetails(payload);
                        if (response.data.status === 200 || response.data.status === 201) {
                            setOpen1(false);
                            setDataToNull();
                            const resPRDet = await fetchPrDetails({ user_id: userId });
                            setRowData(resPRDet.data.data);
                            fetchDataPDList();
                            toast.success(response.data.message);
                        } else {
                            toast.error(response.data.message);
                        }
                    } catch (error) {
                        toast.error(error.message);
                    }
                });
            }
        });
    }
    const [open4, setOpen4] = useState(false)
    const handleEditO = (ev, item) => {
        ev.preventDefault()
        setOpen4(true)
        setTempReq(item)
        setTempSign(tempStorage)
    }
    const handleEditC = () => {
        setOpen4(false)
        setDataToNull()
    }
    const [open3, setOpen3] = useState(false)
    const handleSignedO = (ev, item) => {
        ev.preventDefault()
        setOpen3(true)
        setRequestDataForm(draft => {
            draft.req_by_id = item.req_by_id;
            draft.avail_app_id = item.avail_app_id;
            draft.rev_by_id = item.rev_by_id;
            draft.approval_id = item.approval_id;

            draft.remarks = item.remarks;
            draft.id_pr_form = item.id;
            draft.prf_no = item.prf_no;
        })
        setRequestSignsViewer(draft => { draft.req_by_id = true })
        setTempStorage(draft => { draft.tempRequester = "requester" })
    }
    const handleSignedC = () => {
        setOpen3(false)
        setDataToNull()
        setRequestSignsViewer(draft => { draft.req_by_id = false })
        setTempStorage(draft => { draft.tempRequester = "" })
    }

    const [open2, setOpen2] = useState(false)
    const handleReadModalO = (ev, item) => {
        ev.preventDefault();
        setTempReq(item)
        setTempSign(tempStorage)
        setOpen2(true)
    }

    const handleDeleteClick = (ev, item) => {
        ev.preventDefault()
        setNoDataFound(true)
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
                        const response = await deleteDetails(item.id);
                        setRowData([]);
                        if (response.data.status === 200) {
                            toast.success(response.data.message)
                        } else {
                            toast.error(response.data.message);
                        }
                        handleReloadData();
                    } catch (error) {
                        toast.error(error.message);
                    }
                    // finally {
                    //     setNoDataFound(false)
                    // }
                })
            }
        });
    }

    const [searchRef, setSearchRef] = useState("")
    const [dataFiltered, setDataFiltered] = useState([])
    const handleSearchBtn = () => {
        if (searchRef !== "") {
            const filteredResult = rowData.data.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchRef.toLowerCase())
            })
            setDataFiltered(filteredResult);
        } else { setDataFiltered(rowData.data) }
    }

    useEffect(() => {
        if (searchRef === "") { setDataFiltered(rowData.data) }
    }, [searchRef])
    useEffect(() => {
        if (isEmptyObject(rowData.data) || rowData.data === undefined) { setNoDataFound(true); }
        else { setNoDataFound(false); setDataFiltered(rowData.data); }
    }, [rowData])



    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setDataToNull()
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
                const [response2, response3, response5, response6, response7, response8,] = await Promise.all([
                    fetchPrDetails({ user_id: userId }),
                    requestingHeadSigner(userId),
                    // getNatReqData(),
                    getEmpStatData(),
                    getOfficeDeptData(),
                    getDeptOrg({ user_id: userId, }),
                    getQS(),
                ])

                setRowData(response2.data.data);
                setTempStorage(draft => { draft.head_signer = response3.data.sign })
                setEmpStat(response5.data.data);
                setTempStorage(draft => { draft.office_dept = response6.data.data; draft.dept_code = response6.data.dept; draft.emp_name = response6.data.emp_name; draft.esig = response6.data.esig; })
                setDeptOrg(response7.data.data)
                setQsState(response8.data.data)


                setRequestDataForm(draft => { draft.date_requested = dateToday; })
            } catch (error) {
                console.error('Error fetching data:', error);
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
        };
        fetchData();
    }, []);

    return (
        <>
            <Box sx={{ margin: "0 10px 10px 10px" }}>
                {loading ? (
                    <>
                        <DashboardLoading />
                    </>
                ) : (
                    <>
                        <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF)" />
                        <Box sx={{ margin: "10px 0px" }}>
                            <Grid2 container spacing={2}>
                                <Grid2 item xs={12} sm={12} md={12} lg={12}>
                                    <Grid2 container justifyContent={"space-between"}>
                                        <Grid2 item xs={12} lg={6}>
                                            <SearchComponent handleReload={handleReloadData} searchRef={searchRef} setSearchRef={setSearchRef} handleSearchBtn={handleSearchBtn} />
                                        </Grid2>
                                        <Grid2 item xs={12} lg={6}>
                                            <Button variant="contained" onClick={handleAddReqOpen}>
                                                ADD REQUEST
                                            </Button>
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <TableContainerComp height="90vh">
                                        <TableHead>
                                            <TableRow>
                                                {colData.map((column, index) => (
                                                    <TableCell key={column.id + index} colSpan={column.colspan} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: column.width, backgroundColor: "#1565C0 !important" }} >
                                                        {column.headerName}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {!noDataFound && (
                                                <>
                                                    {Object.keys(dataFiltered).length < 1 ? (
                                                        <NoDataFound spanNo={Object.keys(colData).length} />
                                                    ) : (
                                                        <>
                                                            {dataFiltered.map((item, index) => (
                                                                <TableRow key={"prf-detail" + index}>
                                                                    <TableCell align="center">
                                                                        {item.prf_no}
                                                                    </TableCell>
                                                                    <TableCell align="">
                                                                        <RequestStatModal deptData={deptData} signings={rowData.signings} items={item} />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {item.date_requested}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {moment(item.date_needed).format("L")}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {item.office_dept}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {item.emp_stat}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <CustomRemark value={item.remarks} />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Grid2 container spacing={1}>
                                                                            <Grid2 item>
                                                                                <Tooltip title="View Personnel Request">
                                                                                    <IconButton className="custom-iconbutton" color="info" onClick={(e) => handleReadModalO(e, item)}> <PreviewIcon /> </IconButton>
                                                                                </Tooltip>
                                                                            </Grid2>
                                                                            <Grid2 item>
                                                                                {rowData.signings.filter(o => o.id_pr_form === item.id).reverse()[0].request_stat === "DISAPPROVED" || rowData.signings.filter(o => o.id_pr_form === item.id).reverse()[0].request_stat === "CANCELLED" || rowData.signings.filter(o => o.id_pr_form === item.id).reverse()[0].request_stat === "Signatory for the Head of Requesting Department/Office" ? (
                                                                                    <>
                                                                                        <Tooltip title="Delete">
                                                                                            <IconButton className="custom-iconbutton" color="error" onClick={(ev) => handleDeleteClick(ev, item)}>
                                                                                                <DeleteIcon />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Tooltip title="Delete" disabled>
                                                                                            <IconButton className="custom-iconbutton" color="warning">
                                                                                                <DeleteIcon />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </>
                                                                                )}
                                                                            </Grid2>
                                                                            <Grid2 item>
                                                                                {rowData.signings.filter(o => o.id_pr_form === item.id).reverse()[0].request_stat === "RETURNED FOR REVISION" ? (
                                                                                    <>
                                                                                        <Tooltip title="Edit">
                                                                                            <IconButton className="custom-iconbutton" color="warning" onClick={(ev) => handleEditO(ev, item)}>
                                                                                                <EditIcon />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Tooltip title="Edit" disabled={item.approval_id || item.rev_by_id || item.avail_app_id || item.req_by_id}>
                                                                                            <IconButton className="custom-iconbutton" color="warning" onClick={(ev) => handleEditO(ev, item)}>
                                                                                                <EditIcon />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </>
                                                                                )}
                                                                            </Grid2>
                                                                            {tempStorage.head_signer && (
                                                                                <Grid2 item>
                                                                                    <Tooltip title="Signature for the Head Department" disabled={item.approval_id || item.rev_by_id || item.avail_app_id || item.req_by_id}>
                                                                                        <IconButton className="custom-iconbutton" color="primary" onClick={(ev) => handleSignedO(ev, item)}>
                                                                                            <ChairIcon />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Grid2>
                                                                            )}
                                                                        </Grid2>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {noDataFound && (
                                                <>
                                                    <NoDataFound spanNo={Object.keys(colData).length} />
                                                </>
                                            )}
                                        </TableBody>
                                        {/* <TablePagination
                                                rowsPerPageOptions={[10, 25, 100]}
                                                component="div"
                                                count={rows.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                /> */}
                                    </TableContainerComp>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </>
                )}
            </Box >
            <Fragment>
                <CustomDialog matches={matches} openner={open1} handleCloseBTN={handleAddReqClose} comptitle="Personnel Request Form" compSize="250px">
                    <RequestForm />
                    <Grid container spacing={2} mt={1} justifyContent="end">
                        <Grid item>
                            <Button onClick={(ev) => handleAddReqSubmit(ev)} variant="contained">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CustomDialog>
                <CustomDialog matches={matches} openner={open2} handleCloseBTN={() => { setOpen2(false) }} comptitle="Personnel Request Form - Viewing" compSize="335px">
                    <ViewRequestForm />
                </CustomDialog>
                <CustomDialog matches={matches} openner={open3} handleCloseBTN={handleSignedC} comptitle="Personnel Request Form - Signatory of Department Head" compSize="535px">
                    <SignRequestForm handleClosingButton={handleSignedC} handleRelD={handleReloadData} />
                </CustomDialog>
                <CustomDialog matches={matches} openner={open4} handleCloseBTN={handleEditC} comptitle="Personnel Request Form - Editing" compSize="325px">
                    <EditRequestForm handleEditC={handleEditC} />
                </CustomDialog>
            </Fragment>
        </>
    )
}

export const fetchPrDetails = async (userId) => {
    try {
        const response = await getDetails(userId);
        return response
    }
    catch (error) {
        console.log(error)
        toast.error(error.message)
    }
};

export default RequestDetails;
