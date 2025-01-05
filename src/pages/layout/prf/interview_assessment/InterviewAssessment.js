import { Fragment, useContext, useEffect, useState } from "react"
import PrfProvider, { PrfStateContext } from "../PrfProvider"
import DashboardLoading from "../../loader/DashboardLoading"
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText"
import { Badge, Box, Button, IconButton, TableBody, TableCell, TableHead, TableRow, Tooltip, useMediaQuery } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import Swal from "sweetalert2"
import { getApprovedPRAx, getAssessmentList } from "../axios/prfPooling"
import { CustomDialog, CustomFullDialog, CustomRemark, SearchComponent, TableContainerComp } from "../components/export_components/ExportComp"
import { Preview as PreviewIcon } from "@mui/icons-material";
import { isEmptyObject } from "jquery"
import NoDataFound from "../components/NoDataFound"
import RequestStatModal from "../components/export_components/RequestStatModal"
import moment from "moment"
import { lime, purple } from "@mui/material/colors"
import { toast } from "react-toastify"
import Assessment from "./Assessment"
import axios from "axios"
import ViewRequestForm from "../requestdetails/view/ViewRequestForm"
import { checkPermission, checkRolePermission } from "../../permissionrequest/permissionRequest"
import { useNavigate } from "react-router-dom"

const color2 = purple[600];
const color3 = lime[600];

function InterviewAssessment() {
    return (
        <>
            <PrfProvider>
                <IntAssessComp />
            </PrfProvider>
        </>
    )
}

export default InterviewAssessment

function IntAssessComp() {
    const { rowData, setRowData, setDataToNull, deptData, userId, colData, setApplicantList, noDataFound, setNoDataFound, setOpenedPR, openedPR, tempReq, setTempReq, assessmentList, setAssessmentList, examList, setExamList, bIList, setBIList, assessmentStatus, setAssessmentStatus, } = useContext(PrfStateContext)
    const matches = useMediaQuery('(min-width:600px)');
    const [loading, setLoading] = useState(true)
    const [dataFiltered, setDataFiltered] = useState([])
    const [searchRef, setSearchRef] = useState('')
    const [requestQueue, setRequestQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false);

    const [open1, setOpen1] = useState(false)
    // const [open2, setOpen2] = useState(false)
    const [open, setOpen] = useState(0)


    // const [indorsePerm, setIndorsePerm] = useState(false)
    // const [raterLevel, setRaterLevel] = useState([])
    const [listData, setListData] = useState([])
    let controller = new AbortController();

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

    useEffect(() => {
        checkPermission(809) // assessment role
            .then((res) => {
                if (res.data === 1) {
                    fetchData();
                    // checkRolePermission(67).then((res1) => {
                    //     console.log(res1)
                    //     if (res1.data === 1) {
                    //         setIndorsePerm(true)
                    //     }
                    // })
                    // fetchPerm();
                } else {
                    toast.warning('Ops, something went wrong!')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (searchRef === "") { setDataFiltered(rowData.data) }
    }, [searchRef])
    useEffect(() => {
        if (isEmptyObject(rowData.data) || rowData.data === undefined) { setNoDataFound(true); }
        else { setNoDataFound(false); setDataFiltered(rowData.data); }
    }, [rowData])

    const handleActionBtn = (e, type, i) => {
        e.preventDefault();
        switch (type) {
            case 'POOLED COMPLETE':
                setOpen1(true)
                setTempReq(i)
                break;
            case 'VIEW':
                setOpen(1)
                setTempReq(i)
                break;

            default:
                toast.warning('Error! action not found!')
                break;
        }
    }
    const handleCloseAssess = () => {
        setNoDataFound(true)
        setDataToNull()
        handleReloadData()
        setOpen1(false)
    }
    // const handleIndorseC = () => {
    //     setNoDataFound(true)
    //     setDataToNull();
    //     handleReloadData();
    //     setOpen2(false);
    // }

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
            const [res1] = await Promise.all([
                axios.get('api/prf/interview-assessment/get-assigned-assessment', {}, { signal: controller.signal }),
            ]);
            setRowData(res1.data.data);
            // setRaterLevel(res1.data.rater_lvl);

            res1.data.data.data.map(element => fetchBadgeData(element.id));
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
    }

    const fetchBadgeData = async (id_prf) => {
        try {
            const [res] = await Promise.all([getAssessmentList({ user_id: userId, prf_id: id_prf })]);
            setListData((prevData) => [...prevData, res.data.data.prf_iafs]);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleSearchBtn = () => {
        const filteredResult = searchRef !== ""
            ? rowData.data.filter((item) =>
                Object.values(item).some(val =>
                    val.toString().toLowerCase().includes(searchRef.toLowerCase())
                )
            )
            : rowData.data;
        setDataFiltered(filteredResult);
    }

    const handleReloadData = () => {
        setLoading(true);
        setRowData([]);
        setDataFiltered([]);
        setListData([]);
        enqueueRequest(fetchData);
    }

    return (
        <>
            <Box sx={{ margin: "0 10px 10px 10px" }}>
                {loading ? (
                    <DashboardLoading />
                ) : (
                    <>
                        <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF) - INTERVIEW ASSESSMENT" />
                        <Box sx={{ margin: "10px 0px" }}>
                            <Grid2 container spacing={2}>
                                <Grid2 item xs={12} lg={12}>
                                    <Grid2 container spacing={2} justifyContent="space-between" alignItems="center">
                                        <Grid2 item xs={12} lg={6}>
                                            <SearchComponent handleReload={handleReloadData} searchRef={searchRef} setSearchRef={setSearchRef} handleSearchBtn={handleSearchBtn} />
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                                <Grid2 item xs={12} lg={12}>
                                    <TableContainerComp>
                                        <TableHead key={'tabler-header'}>
                                            <TableRow>
                                                {colData.map((column, index) => (
                                                    <TableCell key={column.headerName + '-' + index} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: column.width, backgroundColor: "#1565C0 !important" }}>
                                                        {column.headerName}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody key={'table-body'}>
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
                                                                        <Grid2 container spacing={1} alignItems="center" justifyContent="center">
                                                                            <Grid2 item>
                                                                                <Tooltip title="View">
                                                                                    <IconButton className="custom-iconbutton" color="info" onClick={(e) => handleActionBtn(e, 'VIEW', item)}> <PreviewIcon /> </IconButton>
                                                                                </Tooltip>
                                                                            </Grid2>
                                                                            <Grid2 item>
                                                                                {rowData.signings.filter(o => o.id_pr_form === item.id).reverse()[0].request_stat === "POOLED COMPLETE" ? <>
                                                                                    {listData.filter(data => data[0]?.prf_id === item.id).map((assessments, indx) => (
                                                                                        <Badge key={indx} color="primary" badgeContent={assessments.length}>
                                                                                            <Button variant="contained" sx={{ backgroundColor: color2 }} onClick={(e) => handleActionBtn(e, 'POOLED COMPLETE', item)}>
                                                                                                assessment
                                                                                            </Button>
                                                                                        </Badge>
                                                                                    ))}
                                                                                </> : <>
                                                                                    <Button disabled variant="contained" sx={{ backgroundColor: color2 }}> PENDING </Button>
                                                                                </>
                                                                                }
                                                                            </Grid2>
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
                                    </TableContainerComp>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </>
                )}
            </Box >
            <Fragment>
                <CustomFullDialog id="custom-dialog-assessment-id" openG={open1} handleCloseG={handleCloseAssess} comptitle="" compSize="" minWidthP={matches ? '60%' : '100%'} >
                    <Assessment closeModal={handleCloseAssess} />
                </CustomFullDialog>
                {open === 1 &&
                    <CustomDialog matches={matches} openner={open === 1} handleCloseBTN={() => { setOpen(0) }} comptitle="" compSize="">
                        <ViewRequestForm />
                    </CustomDialog>
                }
            </Fragment>
        </>
    )
}
