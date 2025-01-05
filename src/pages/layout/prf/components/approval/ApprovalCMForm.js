import { Fragment, useContext, useEffect, useState } from "react"
import PrfProvider, { PrfStateContext } from "../../PrfProvider"
import ModuleHeaderText from "../../../moduleheadertext/ModuleHeaderText"
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { isEmptyObject } from "jquery"
import moment from "moment"
// import { CustomDialog, CustomRemark } from "../../requestdetails/RequestDetails"
import NoDataFound from "../NoDataFound"
import { getDept, getDeptOrg, getNatReqData, getOfficeDeptData, getPositionList, reqAppUserAuthority, reqApprovalData } from "../../axios/prfRequest"
import SignRequestForm from "../signature/SignRequestForm"

// import { grey } from "@mui/material/colors"
import {
    Search as SearchIcon, ChevronRight as ChevronRightIcon, Close as CloseIcon, Feed as FeedIcon, Person as PersonIcon, Draw as DrawIcon, Article as ArticleIcon,
    Edit as EditIcon, Chair as ChairIcon, Delete as DeleteIcon, RestartAlt as RestartAltIcon, Preview as PreviewIcon, Cached as CachedIcon,
} from "@mui/icons-material";
import { CustomAddRemark, CustomDialog, CustomRemark, SearchFilComponent, TableContainerComp } from "../export_components/ExportComp"
import DashboardLoading from "../../../loader/DashboardLoading"
import ViewRequestForm from "../../requestdetails/view/ViewRequestForm"
import RequestStatModal from "../export_components/RequestStatModal"

// import {
//   Search as SearchIcon, ChevronRight as ChevronRightIcon, Close as CloseIcon, Feed as FeedIcon, Person as PersonIcon, Draw as DrawIcon, Article as ArticleIcon,
//   Edit as EditIcon, Chair as ChairIcon, Delete as DeleteIcon, RestartAlt as RestartAltIcon, Preview as PreviewIcon, Cached as CachedIcon,
// } from "@mui/icons-material";

function ApprovalCMForm() {
    return (
        <PrfProvider>
            <ApprovalFormCMCVM />
        </PrfProvider>
    )
}

export default ApprovalCMForm

function ApprovalFormCMCVM() {
    const {
        matches, userId, setUserId, colData, rowData, setRowData, requestDataForm, setRequestDataForm, signedBy, setSignedBy,
        requestSignsViewer, setRequestSignsViewer, noDataFound, setNoDataFound, empStat, setEmpStat,
        natureReq, errors, setErrors, dateToday, setDataToNull, deptOrg, setDeptOrg, colDataQS,
        rowDataQS, setRowDataQs, tempStorage, setTempStorage, posTitle, setPosTitle, qsState, setQsState, isLoading, setIsLoading,
        signedByHeadReq, setSignedByHeadReq, signedByAvail, setSignedByAvail, signedByRevBy, setSignedByRevBy, signedByAppvl, setSignedByAppvl,
        postsPerPage, offSet, setOffSet, searchValue, setSearchValue, tempt, setTempt, deptData, tempReq, setTempReq, tempSign, setTempSign,
        signPermApproval, setSignPermApproval,
    } = useContext(PrfStateContext)

    const [dataFiltered, setDataFiltered] = useState([])
    const [searchTable, setSearchTable] = useState("")
    const [selectedTable, setSelectedTable] = useState("")

    const [empStatTable, setEmpStatTable] = useState("")
    const [deptTable, setDeptTable] = useState("")

    const [empStatMenu, setEmpStatMenu] = useState([])
    const [deptMenu, setDeptMenu] = useState([])
    const [userAccSign, setUserAccSign] = useState({
        ocmSignatory: { id: 1, perm: false, title: "OCM", },
        ocvmSignatory: { id: 2, perm: false, title: "OCVM", }
    })
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setDataToNull();
        fetchData();
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
            const [response1, response2, response3, response6,] = await Promise.all([
                reqApprovalData(userId),
                reqAppUserAuthority(userId),
                getOfficeDeptData(),
                getDeptOrg({ user_id: userId, }),
                // getNatReqData(),
            ])
            setRowData(response1.data.data)
            setUserAccSign({
                ocmSignatory: { id: 1, perm: response2.data.user_acc_ocm, title: response2.data.dept_title, },
                ocvmSignatory: { id: 2, perm: response2.data.user_acc_ocvm, title: response2.data.dept_title, },
            })
            setTempStorage(draft => { draft.office_dept = response3.data.data; draft.dept_code = response3.data.dept; draft.emp_name = response3.data.emp_name; draft.pos = response3.data.all.position_name; draft.esig = response3.data.esig; })
            if (response2.data.user_acc_ocm || response2.data.user_acc_ocvm) { setSignPermApproval(true) }
            setDeptOrg(response6.data.data)
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

    const handleReloadData = () => {
        Swal.fire({
            icon: "info",
            title: "reloading the table...",
            timer: 2000,
            showConfirmButton: false,
        })
        const resPRDet = reqApprovalData(userId)
        resPRDet.then((result) => { setRowData(result.data.data); }).catch((error) => { toast.error(error.message); })
    }

    const handleModalO = (ev, item) => {
        ev.preventDefault();
        setOpen1(true)
        console.log(item)
        setRequestDataForm(draft => {
            draft.req_by_id = item.req_by_id;
            draft.avail_app_id = item.avail_app_id;
            draft.rev_by_id = item.rev_by_id;
            draft.approval_id = item.approval_id;

            draft.remarks = item.remarks;
            draft.id_pr_form = item.id;
            draft.prf_no = item.prf_no;
        })

        setTempStorage(draft => { draft.tempRequester = "approved"; })
        setRequestSignsViewer(draft => { draft.req_by_id = true; draft.avail_app_id = true; draft.rev_by_id = true; draft.approval_id = true; })
    }

    const handleModalC = () => {
        setOpen1(false)
        setDataToNull()
        setRequestSignsViewer(draft => { draft.req_by_id = false; draft.avail_app_id = false; draft.rev_by_id = false; draft.approval_id = false; })
        setTempStorage(draft => { draft.tempRequester = "" })
    }

    const handleReadModalO = (ev, item) => {
        ev.preventDefault()
        setTempReq(item)
        setTempSign(tempStorage)
        setOpen2(true)
    }
    const handleReadModalC = () => {
        setDataToNull()
        setOpen2(false)
    }


    useEffect(() => {
        if (!isEmptyObject(rowData.data)) {
            setDataFiltered(rowData.data)

            // FILTER DATA TO BE UNIQUE FOR SELECTION MENU
            const grp1 = rowData.data.map(obj => obj.emp_stat)
            const grp2 = rowData.data.map(obj => obj.office_dept)
            setEmpStatMenu(grp1.filter((q, idx) => grp1.indexOf(q) === idx))
            setDeptMenu(grp2.filter((q, idx) => grp2.indexOf(q) === idx))
            setNoDataFound(false)
        }
        else {
            setNoDataFound(true);
        }
    }, [rowData])


    const handleSearchBtn = (e) => {
        e.preventDefault()
        if (selectedTable !== "") {
            const filterRes = rowData.data.filter((it) => { return it.office_dept === selectedTable })
            setDataFiltered(filterRes);
        }
        if (searchTable !== "") {
            const filteredResult = rowData.data.filter((item) => { return Object.values(item).join('').toLowerCase().includes(searchTable.toLowerCase()) })
            setDataFiltered(filteredResult);
        }
    }
    // useEffect(() => {
    //     if (searchTable === "" || deptTable === "" || empStatTable === "") {
    //         setDataFiltered(rowData.data)
    //     }
    // }, [searchTable])
    useEffect(() => {
        if (searchTable === "" || selectedTable === "") {
            setDataFiltered(rowData.data)
        }
    }, [searchTable, selectedTable])

    return (
        <>
            {tempStorage.dept_code === 1 || tempStorage.dept_code === 56 ? (
                <Box sx={{ margin: "0 10px 10px 10px" }}>
                    {loading ? (
                        <>
                            <DashboardLoading />
                        </>
                    ) : (
                        <>
                            <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF) - REVIEW AND APPROVAL" />
                            <Box sx={{ margin: "10px 0px" }}>
                                <Grid2 container spacing={2}>
                                    <Grid2 item xs={12} sm={12} md={12} lg={12}>
                                        <SearchFilComponent handleReloadData={handleReloadData} data={rowData.data} selectedRef={selectedTable} setSelectedRef={setSelectedTable} searchRef={searchTable} setSearchRef={setSearchTable} handleSearchRef={handleSearchBtn} />
                                    </Grid2>
                                    <Grid2 item xs={12} sm={12} md={12} lg={12}>
                                        {/* <PrfDataTable data={dataFiltered} signings={rowData.signings} noDataFound={noDataFound} colData={colData}>
                                    </PrfDataTable> */}
                                        <TableContainerComp>
                                            <TableHead>
                                                <TableRow>
                                                    {colData.map((column, index) => (
                                                        <TableCell key={column.id + index} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: column.width, backgroundColor: "#1565C0 !important" }}>
                                                            {column.headerName}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {!noDataFound && (
                                                    <>
                                                        {Object.keys(dataFiltered).length === 0 && (
                                                            <NoDataFound spanNo={Object.keys(colData).length} />
                                                        )}
                                                        {dataFiltered.map((item, index) => (
                                                            <TableRow key={"prf-detail" + index}>
                                                                <TableCell align="center">
                                                                    {item.prf_no}
                                                                </TableCell>
                                                                <TableCell align="center">
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
                                                                    <Grid2 container spacing={2}>
                                                                        <Grid2>
                                                                            <Tooltip title="View">
                                                                                <IconButton className="custom-iconbutton" color="primary" onClick={(ev) => handleReadModalO(ev, item)}> <PreviewIcon /> </IconButton>
                                                                            </Tooltip>
                                                                        </Grid2>
                                                                        {rowData.signings.filter(o => o.pr_signs_id === item.tbl_signings_id).reverse()[0].request_stat === "CANCELLED" ? (
                                                                            <Grid2>
                                                                                <FormControl fullWidth>
                                                                                    <IconButton className="custom-iconbutton" color="success" disabled> <ChairIcon /> </IconButton>
                                                                                </FormControl>
                                                                            </Grid2>
                                                                        ) : (
                                                                            <>
                                                                                <Grid2>
                                                                                    {typeof (item.approval_id) !== "number" ? (
                                                                                        <FormControl fullWidth>
                                                                                            {userAccSign.ocmSignatory.perm && (
                                                                                                <Box>
                                                                                                    <Tooltip title={userAccSign.ocmSignatory.title + ' - APPROVAL'}>
                                                                                                        <IconButton className="custom-iconbutton" color="secondary" onClick={(ev) => handleModalO(ev, item)}> <ChairIcon /> </IconButton>
                                                                                                    </Tooltip>
                                                                                                </Box>
                                                                                            )}
                                                                                            {userAccSign.ocvmSignatory.perm && (
                                                                                                <Box>
                                                                                                    <Tooltip title={userAccSign.ocvmSignatory.title + ' - APPROVAL'}>
                                                                                                        <IconButton className="custom-iconbutton" color="success" onClick={(ev) => handleModalO(ev, item)}> <ChairIcon /> </IconButton>
                                                                                                    </Tooltip>
                                                                                                </Box>
                                                                                            )}
                                                                                        </FormControl>
                                                                                    ) : (
                                                                                        <>
                                                                                            <FormControl fullWidth>
                                                                                                <IconButton className="custom-iconbutton" color="success" disabled> <ChairIcon /> </IconButton>
                                                                                            </FormControl>
                                                                                        </>
                                                                                    )}
                                                                                </Grid2>
                                                                            </>
                                                                        )}
                                                                    </Grid2>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
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
                </Box>
            ) : (
                <Box sx={{ margin: "0 10px 10px 10px", textAlign: 'center', height: "80VH", alignContent: "center", }}>
                    <Typography variant="h4"> 403 FORBIDDEN </Typography>
                </Box>
            )}

            <Fragment>
                <CustomDialog matches={matches} openner={open1} handleCloseBTN={handleModalC} comptitle="Review and Approval" compSize="215px">
                    <SignRequestForm handleClosingButton={handleModalC} handleRelD={handleReloadData} />
                </CustomDialog>

                <CustomDialog matches={matches} openner={open2} handleCloseBTN={handleReadModalC} comptitle="Request Details - Viewing" compSize="255px">
                    <ViewRequestForm />
                </CustomDialog>
            </Fragment>
        </>
    )
}