import { Fragment, useContext, useEffect, useState } from "react"
import { Box, Button, IconButton, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

import {
  Search as SearchIcon, ChevronRight as ChevronRightIcon, Close as CloseIcon, Feed as FeedIcon, Person as PersonIcon, Draw as DrawIcon, Article as ArticleIcon, Edit as EditIcon, Chair as ChairIcon, Delete as DeleteIcon, RestartAlt as RestartAltIcon, Preview as PreviewIcon, Cached as CachedIcon, AddCircleRounded as AddCircleRoundedIcon,
} from "@mui/icons-material"
import { deepPurple, indigo, lime, orange, purple, red, teal } from "@mui/material/colors"
import { toast } from "react-toastify"
import { isEmptyObject } from "jquery"
import Swal from "sweetalert2"
import moment from "moment"

import NoDataFound from "../NoDataFound"
import PrfProvider, { PrfStateContext } from "../../PrfProvider"
import {
  CustomAddRemark, CustomCMDialog, CustomDialog, CustomRemark,
  SearchFilComponent, TableContainerComp
} from "../export_components/ExportComp"
import ModuleHeaderText from "../../../moduleheadertext/ModuleHeaderText"
import { getAllApprovedPRAx, getUserPerm } from "../../axios/prfPooling"
import ViewRequestForm from "../../requestdetails/view/ViewRequestForm"
import DashboardLoading from "../../../loader/DashboardLoading"
import RequestStatModal from "../export_components/RequestStatModal"
import PoolingCandidates from "./PoolingCandidates"

const color1 = orange[700];
const color2 = purple[600];
const color3 = teal[500];
const color4 = deepPurple['A400'];
const color5 = red[800]
const color6 = lime[500]

// const actionStatusSteps = [
//   { id: 1, action_name: "Pooling", color: color1, status: 'APPROVED' },
//   { id: 2, action_name: "Evaluation", color: color2, status: 'POOLED COMPLETE' },
//   { id: 3, action_name: "Indorsement", color: color4, status: 'INDORSEMENT' },
// ]

function PoolingPage() {
  return (
    <PrfProvider>
      <PoolingFormComp />
    </PrfProvider>
  )
}

export default PoolingPage

function PoolingFormComp() {
  const { matches, userId, setUserId, colData, rowData, setRowData, requestDataForm, setRequestDataForm, requestSignsViewer, noDataFound, setNoDataFound, setDataToNull, colDataQS, deptData, openedPR, setOpenedPR, tempSign, setTempSign, tempReq, setTempReq, tempStorage, natureReq } = useContext(PrfStateContext)
  const [loading, setLoading] = useState(true)
  const [dataFiltered, setDataFiltered] = useState([])
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  // const [open2, setOpen2] = useState(false)
  // const [accessPermQ, setAccessPermQ] = useState(false)

  const [searchRef, setSearchRef] = useState("")
  const [selectRef, setSelectRef] = useState("")

  const removeDisapprovedData = (signingRef, dataRef) => {
    if (!signingRef || !dataRef) { return }
    let x = signingRef.filter(h => h.request_stat === 'DISAPPROVED').map(y => dataRef.filter(s => s.id !== y.id_pr_form))
    return x.pop()
  }

  useEffect(() => {
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
        const [response1] = await Promise.all([
          getAllApprovedPRAx(),
        ])
        setRowData(response1.data.data)
        let t = removeDisapprovedData(response1.data.data.signings, response1.data.data.data);
        setDataFiltered(t);
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
    fetchData()
  }, [])

  const handleReloadData = () => {
    Swal.fire({
      icon: "info",
      title: "reloading the table...",
      timer: 2000,
      showConfirmButton: false,
    })
    const revPRData = getAllApprovedPRAx()
    revPRData.then((result) => {
      setRowData(result.data.data)
      Swal.close();
    }).catch((error) => {
      toast.error(error.message)
      Swal.close();
    })
  }

  const handleActionBtn = (e, type, i) => {
    e.preventDefault()
    switch (type) {
      case 'APPROVED':
        setOpen1(true)
        setOpenedPR(i.id_pr_form)
        setTempReq(i)
        break;
      case 'VIEW':
        setTempReq(i)
        setTempSign(tempStorage)
        setOpen(true)
        break;

      default:
        toast.warning('Error! action not found!')
        break;
    }
  }

  const handleEvalC = () => {
    setOpen1(false)
    setOpenedPR("")
    setDataToNull()
    handleReloadData()
  }
  const handleViewC = () => {
    setOpen(false)
    setDataToNull()
  }
  // const handleIndorseC = () => {
  //   setOpen2(false)
  //   setDataToNull()
  // }

  const handleSearchBtn = (ev) => {
    ev.preventDefault();

    if (selectRef !== "") {
      const filterRes = rowData.data.filter((it) => { return it.office_dept === selectRef })
      setDataFiltered(filterRes);
    }
    if (searchRef !== "") {
      const filteredResult = rowData.data.filter((item) => { return Object.values(item).join('').toLowerCase().includes(searchRef.toLowerCase()) })
      setDataFiltered(filteredResult);
    }
  }
  useEffect(() => {
    if (isEmptyObject(rowData.data)) {
      setNoDataFound(true);
    }
    else {
      setNoDataFound(false);
      setDataFiltered(rowData.data);
    }
  }, [rowData])
  useEffect(() => {
    if (searchRef === "" || selectRef === "") {
      setDataFiltered(rowData.data)
    }
  }, [searchRef, selectRef])

  return (
    <>
      {/* MODALS */}
      <Fragment>
        <CustomDialog matches={matches} openner={open} handleCloseBTN={handleViewC} comptitle="Request Details - Viewing" compSize="255px">
          <ViewRequestForm />
        </CustomDialog>
        <CustomDialog matches={matches} openner={open1} handleCloseBTN={handleEvalC} comptitle="Pooling of the candidates" compSize="270px">
          <PoolingCandidates closeModal={handleEvalC} />
        </CustomDialog>
      </Fragment>


      <Box sx={{ margin: "0 10px 10px 10px" }}>
        {loading ? (
          <>
            <DashboardLoading />
          </>
        ) : (
          <>
            <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF) - POOLING APPLICANTS" />
            <Box sx={{ margin: "10px 0px" }}>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12} lg={12}>
                  <Grid2 container spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid2 item xs={12} lg={6}>
                      <SearchFilComponent handleReloadData={handleReloadData} data={rowData.data} selectedRef={selectRef} setSelectedRef={setSelectRef} searchRef={searchRef} setSearchRef={setSearchRef} handleSearchRef={handleSearchBtn} />
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
                      {!noDataFound ? (
                        <>
                          {Object.keys(dataFiltered).length === 0 && (
                            <NoDataFound spanNo={Object.keys(colData).length} />
                          )}
                          {dataFiltered.map((i, index) => (
                            <TableRow key={"prf-detail" + index}>
                              <TableCell align="center">
                                {i.prf_no}
                              </TableCell>
                              <TableCell align="center">
                                <RequestStatModal deptData={deptData} signings={rowData.signings} items={i} />
                              </TableCell>
                              <TableCell align="center">
                                {i.date_requested}
                              </TableCell>
                              <TableCell align="center">
                                {moment(i.date_needed).format("L")}
                              </TableCell>
                              <TableCell align="center">
                                {i.office_dept}
                              </TableCell>
                              <TableCell align="center">
                                {i.emp_stat}
                              </TableCell>
                              <TableCell>
                                <CustomRemark value={i.remarks} />
                              </TableCell>
                              <TableCell align="center">
                                <Grid2 container alignItems="center" justifyContent="center" spacing={1}>
                                  <Grid2 item>
                                    <Box>
                                      <Tooltip title="View">
                                        <IconButton className="custom-iconbutton" color="primary" onClick={(ev) => handleActionBtn(ev, 'VIEW', i)} > <PreviewIcon /> </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Grid2>
                                  {rowData.signings.filter(o => o.id_pr_form === i.id).reverse()[0].request_stat === "APPROVED" ? (
                                    <Grid2 item>
                                      <Box>
                                        <Button variant="contained" sx={{ backgroundColor: color1 }} onClick={(e) => handleActionBtn(e, 'APPROVED', i)} > POOLING </Button>
                                      </Box>
                                    </Grid2>
                                  ) : (
                                    <Grid2 item>
                                      <Box>
                                        <Button disabled variant="contained" sx={{ backgroundColor: color1 }} > PENDING </Button>
                                      </Box>
                                    </Grid2>
                                  )}
                                </Grid2>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <NoDataFound spanNo={Object.keys(colData).length} />
                      )}
                    </TableBody>
                  </TableContainerComp>
                </Grid2>
              </Grid2>
            </Box>
          </>
        )}
      </Box >
    </>
  )
}