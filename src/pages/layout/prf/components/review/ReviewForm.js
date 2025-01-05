import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Badge, Box, Button, Fab, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { getDeptOrg, getEmpStatData, getNatReqData, getOfficeDeptData, getPRReviewApproval, getPositionList, getQS, requestHeadRevSigner } from '../../axios/prfRequest'
// import { CustomDialog, CustomRemark } from '../../requestdetails/RequestDetails'
import moment from 'moment'
import { toast } from 'react-toastify'
import { isEmptyObject } from 'jquery'
import {
  Search as SearchIcon, ChevronRight as ChevronRightIcon, Close as CloseIcon, Feed as FeedIcon, Person as PersonIcon, Draw as DrawIcon, Article as ArticleIcon,
  Edit as EditIcon, Chair as ChairIcon, Delete as DeleteIcon, RestartAlt as RestartAltIcon, Preview as PreviewIcon, Cached as CachedIcon,
} from "@mui/icons-material";
import Swal from 'sweetalert2'
import { CustomAddRemark, CustomDialog, CustomRemark, SearchFilComponent, TableContainerComp } from '../export_components/ExportComp'
import ModuleHeaderText from '../../../moduleheadertext/ModuleHeaderText'
import ViewRequestForm from '../../requestdetails/view/ViewRequestForm'
import RequestStatModal from '../export_components/RequestStatModal'
import PrfProvider, { PrfStateContext } from '../../PrfProvider'
import { APILoading } from '../../../apiresponse/APIResponse'
import SignRequestForm from '../signature/SignRequestForm'
import NoDataFound from '../NoDataFound'


function ReviewForm() {
  return (
    <PrfProvider>
      <ReviewFormComp />
    </PrfProvider>
  )
}

function ReviewFormComp() {
  const {
    matches, userId, setUserId, colData, rowData, setRowData, requestDataForm, setRequestDataForm, signedBy, setSignedBy,
    requestSignsViewer, setRequestSignsViewer, noDataFound, setNoDataFound, empStat, setEmpStat,
    natureReq, errors, setErrors, dateToday, setDataToNull, deptOrg, setDeptOrg, colDataQS,
    rowDataQS, setRowDataQs, tempStorage, setTempStorage, posTitle, setPosTitle, qsState, setQsState, isLoading, setIsLoading,
    signedByHeadReq, setSignedByHeadReq, signedByAvail, setSignedByAvail, signedByRevBy, setSignedByRevBy, signedByAppvl, setSignedByAppvl,
    postsPerPage, offSet, setOffSet, searchValue, setSearchValue, tempt, setTempt, deptData, tempReq, setTempReq, tempSign, setTempSign,
    signPermB, setSignPermB, signPermHR, setSignPermHR,
  } = useContext(PrfStateContext)

  const [open1, setOpen1] = useState(false) // CHRMD
  const [open2, setOpen2] = useState(false) // CBD
  const [open3, setOpen3] = useState(false)

  const [searchTable, setSearchTable] = useState("")
  const [selectedTable, setSelectedTable] = useState("")
  const [dataFiltered, setDataFiltered] = useState([])

  // CHRMD
  const handleCHRMDO = (e, item) => {
    e.preventDefault()
    setOpen1(true)

    setRequestDataForm(draft => {
      draft.req_by_id = item.req_by_id;
      draft.avail_app_id = item.avail_app_id;
      draft.rev_by_id = item.rev_by_id;
      draft.approval_id = item.approval_id;

      draft.remarks = item.remarks;
      draft.id_pr_form = item.id;
      draft.prf_no = item.prf_no;
    })

    setRequestSignsViewer(draft => { draft.req_by_id = true; draft.avail_app_id = true; draft.rev_by_id = true; draft.approval_id = false })
    setTempStorage(draft => { draft.tempRequester = "reviewed" })
  }
  const handleCHRMDC = () => {
    setOpen1(false)
    setDataToNull()
    setRequestSignsViewer(draft => { draft.req_by_id = false; draft.avail_app_id = false; draft.rev_by_id = false; draft.approval_id = false; })
    setTempStorage(draft => { draft.tempRequester = "" })
  }

  // CBD
  const handleCBDO = (e, item) => {
    e.preventDefault()
    setOpen2(true)

    // console.log(item)
    setRequestDataForm(draft => {
      draft.req_by_id = item.req_by_id;
      draft.avail_app_id = item.avail_app_id;
      draft.rev_by_id = item.rev_by_id;
      draft.approval_id = item.approval_id;

      draft.remarks = item.remarks;
      draft.id_pr_form = item.id;
      draft.prf_no = item.prf_no;
    })

    setRequestSignsViewer(draft => { draft.req_by_id = true; draft.avail_app_id = true; draft.rev_by_id = false; draft.approval_id = false })
    setTempStorage(draft => { draft.tempRequester = "availability" })
  }
  const handleCBDC = () => {
    setOpen2(false)
    setDataToNull()
    setRequestSignsViewer(draft => { draft.req_by_id = false; draft.avail_app_id = false; })
    setTempStorage(draft => { draft.tempRequester = "" })
  }

  const handleReloadData = () => {
    Swal.fire({
      icon: "info",
      title: "reloading the table...",
      timer: 2000,
      showConfirmButton: false,
    })
    const revPRData = fetchRAData()
    revPRData.then((result) => {
      setRowData(result.data.data)
      Swal.close();
    }).catch((error) => {
      toast.error(error.message)
      Swal.close();
    })
  }

  const handleViewO = (e, item) => {
    e.preventDefault()
    setTempReq(item)
    setTempSign(tempStorage)
    setOpen3(true)
  }
  const handleViewC = () => { setOpen3(false) }



  useEffect(() => {
    if (searchTable === "" || selectedTable === "") {
      setDataFiltered(rowData.data)
    }
  }, [searchTable, selectedTable])
  useEffect(() => {
    if (isEmptyObject(rowData.data)) {
      setNoDataFound(true);
    }
    else {
      setNoDataFound(false);
      setDataFiltered(rowData.data);
    }
  }, [rowData])

  const handleSearchBtn = (e) => {
    e.preventDefault();
    if (selectedTable !== "") {
      const filterRes = rowData.data.filter((it) => { return it.office_dept === selectedTable })
      setDataFiltered(filterRes);
    }
    if (searchTable !== "") {
      const filteredResult = rowData.data.filter((item) => { return Object.values(item).join('').toLowerCase().includes(searchTable.toLowerCase()) })
      setDataFiltered(filteredResult);
    }
  }

  // API
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setDataToNull();
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
        const [response2, response3, response4, response6, response7, response8,] = await Promise.all([
          fetchRAData(),
          requestHeadRevSigner(userId),
          getQS(),
          // getNatReqData(),
          getEmpStatData(),
          getOfficeDeptData(),
          getDeptOrg({ user_id: userId, }),
        ])

        setRowData(response2.data.data);
        var i = response3.data
        if (i['chrmd-sign']) { setSignPermHR(i['chrmd-sign']) }
        if (i['cbd-sign']) { setSignPermB(i['cbd-sign']) }
        setQsState(response4.data.data)
        setEmpStat(response6.data.data);
        setTempStorage(draft => { draft.office_dept = response7.data.data; draft.dept_code = response7.data.dept; draft.emp_name = response7.data.emp_name; draft.esig = response7.data.esig; })
        setDeptOrg(response8.data.data)


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
  }, [])

  if (loading) {
    return null;
  }

  return (
    <>
      <Box sx={{ margin: "0 10px 10px 10px" }}>
        <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF) - REVIEW AND APPROVAL" />
        <Box sx={{ margin: "10px 0px" }}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={12} md={12} lg={12}>
              <SearchFilComponent handleReloadData={handleReloadData} data={rowData.data} selectedRef={selectedTable} setSelectedRef={setSelectedTable} searchRef={searchTable} setSearchRef={setSearchTable} handleSearchRef={handleSearchBtn} />
            </Grid2>
            <Grid2 item xs={12}>
              <Grid2 item xs={12}>
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
                          <NoDataFound spanNo={7} />
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
                              {/* {item.approval_id}  {console.log()} */}
                              <Grid2 container spacing={1}>
                                <Grid2>
                                  <Box>
                                    <Tooltip title="View">
                                      <IconButton className="custom-iconbutton" color="primary" onClick={(ev) => handleViewO(ev, item)}> <PreviewIcon /> </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Grid2>
                                {rowData.signings.filter(o => o.id_pr_form === item.id).reverse()[0].request_stat === "CANCELLED" ? (
                                  <Grid2>
                                    <Box>
                                      <IconButton disabled className="custom-iconbutton" color="secondary"> <ChairIcon /> </IconButton>
                                    </Box>
                                  </Grid2>
                                ) : (
                                  <>
                                    <Grid2>
                                      <Box>
                                        {signPermHR && (
                                          typeof (item.rev_by_id) !== 'number' ?
                                            <Tooltip title="CHRMD" disabled={item.rev_by_id}>
                                              <IconButton className="custom-iconbutton" color="secondary" onClick={(e) => handleCHRMDO(e, item)}> <ChairIcon /> </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="CHRMD" disabled>
                                              <IconButton className="custom-iconbutton" color="secondary" onClick={(e) => handleCHRMDO(e, item)}> <ChairIcon /> </IconButton>
                                            </Tooltip>
                                        )}
                                      </Box>
                                    </Grid2>
                                    <Grid2>
                                      <Box>
                                        {signPermB && (
                                          typeof (item.avail_app_id) !== 'number' ?
                                            <Tooltip title="CBD" disabled={item.avail_app_id}>
                                              <IconButton className="custom-iconbutton" color="success" onClick={(e) => handleCBDO(e, item)}> <ChairIcon /> </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="CBD" disabled>
                                              <IconButton className="custom-iconbutton" color="success" onClick={(e) => handleCBDO(e, item)}> <ChairIcon /> </IconButton>
                                            </Tooltip>
                                        )}
                                      </Box>
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
                        <NoDataFound spanNo={7} />
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
          </Grid2>
        </Box >
      </Box >
      <Fragment>
        <CustomDialog matches={matches} openner={open1} handleCloseBTN={handleCHRMDC} comptitle="Review and Approval - CHRMD" compSize="300px">
          <SignRequestForm handleClosingButton={handleCHRMDC} handleRelD={handleReloadData} />
        </CustomDialog>
        <CustomDialog matches={matches} openner={open2} handleCloseBTN={handleCBDC} comptitle='Review and Approval - CBD' compSize="270px">
          <SignRequestForm handleClosingButton={handleCBDC} handleRelD={handleReloadData} />
        </CustomDialog>
        <CustomDialog matches={matches} openner={open3} handleCloseBTN={handleViewC} comptitle="Request Details - Viewing" compSize="255px">
          <ViewRequestForm />
        </CustomDialog>
      </Fragment>
    </>
  )
}

export const fetchRAData = async () => {
  try {
    const response = await getPRReviewApproval();
    return response
  } catch (response) {
    toast.error(response.message);
  }
};

export default ReviewForm