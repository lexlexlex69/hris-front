import React, { Fragment, useContext, useEffect, useRef, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material"
import {
  CalendarMonthOutlined,
  ChecklistOutlined,
  Search as SearchIcon,
  Settings as SettingsIcon,
  SettingsSuggestOutlined,
} from "@mui/icons-material"

import { PrfStateContext } from "../../PrfProvider"
import {
  CustomCenterModal,
  phpPesoIntFormater,
  TableContainerComp,
} from "../../components/export_components/ExportComp"
import {
  CheckList,
  convertToWord,
  cosCheckList,
  Letterhead,
  saveChecklistFunction,
  saveLetterheadFunction,
  SendSetRequirement,
  tableHeadD,
} from "../ProcessDocument"
import {
  autoCapitalizeFirstLetter,
  formatDateToWorded,
  formatName,
} from "../../../customstring/CustomString"
import { usePopover } from "../../../custompopover/UsePopover"
import { useReactToPrint } from "react-to-print"
import { toast } from "react-toastify"
import { getFileAPI } from "../../../../../viewfile/ViewFileRequest"
import { getPrfSignatories, getUploadedLetterhead } from "../DocRequest"
import { isEmptyObject } from "jquery"

import Swal from "sweetalert2"
import toWords from "number-to-words/src/toWords"
import NoeDocument from "../process_document/NoeDocument"
import AtrDocument from "../process_document/AtrDocument"
import { updateSalaryValue } from "../../axios/prfRequest"

function ContractOfService({ applicantList, setApplicantList }) {
  const { tempReq, applicantData, setApplicantData, deptData, openedPR } =
    useContext(PrfStateContext)
  const [indexes, setIndexes] = useState(null)

  const [letterHeadID, setLetterHeadID] = useState(null)
  const [modalTitle, setModalTitle] = useState("")
  const [open, setOpen] = useState(null)
  const [letterheadATR, setLetterheadATR] = useState(null)
  const [letterheadNOE, setLetterheadNOE] = useState(null)
  const [letterfootATR, setLetterfootATR] = useState(null)
  const [letterfootNOE, setLetterfootNOE] = useState(null)
  const [atrAppointDate, setAtrAppointDate] = useState({
    startDate: "",
    endDate: "",
  })
  const [salaryData, setSalaryData] = useState(null)
  const [salaryToggler, setSalaryToggler] = useState(false)
  const [cData, setCData] = useState(null)
  const [letterheadLoader, setLetterheadLoader] = useState(false)
  const [loading, setLoading] = useState(true)

  const [signatories, setSignatories] = useState(null)

  const matches = useMediaQuery("(min-width: 565px)")
  const popover1 = usePopover()
  const popover2 = usePopover()
  const atrRef = useRef()
  const noeRef = useRef()

  useEffect(() => {
    fetchUpdatedData()
  }, [])

  useEffect(() => {
    console.log(signatories)
  }, [signatories])

  const fetchUpdatedData = () => {
    // getPrfSignatories({ dept_code: requestData }).then((r) => {
    //     setAtrJobAssignment(r.data)
    // })
    // console.log(tempReq.pay_sal, tempReq)

    getUploadedLetterhead({ file_name: "advice_to_report_lh" })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id)
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterheadATR(res)
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              })
            })
        }

        return getUploadedLetterhead({ file_name: "notice_of_employment_lh" })
      })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id)
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterheadNOE(res)
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              })
            })
        }

        return getUploadedLetterhead({ file_name: "advice_to_report_lf" })
        // return getPrfSignatories2({ signatory_category: 'advice to report', signatory_slug: 'city_human_resource' })
      })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id)
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterfootATR(res)
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              })
            })
        }

        return getUploadedLetterhead({ file_name: "notice_of_employment_lf" })
      })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id)
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterfootNOE(res)
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              })
            })
        }

        // for getting the signatories in advice to report and notice of employment
        return getPrfSignatories({ prfData: tempReq })
      })
      .then((res) => {
        // if (res.data.status === 500) { toast.error(res.data.message); }
        if (res.status === 200) {
          setSignatories(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.message)
      })
      .finally(() => {
        setLetterheadLoader(true)
        setLoading(false)
      })

    console.log("tempReq salary", tempReq)

    convertToWord(tempReq, setSalaryData)
  }

  const handleATRPrint = useReactToPrint({
    content: () => {
      if (atrRef.current) {
        return atrRef.current
      }
      return null
    },
  })
  const handleNOEPrint = useReactToPrint({
    content: () => {
      if (noeRef.current) {
        return noeRef.current
      }
      return null
    },
  })

  const handleAction = (ev, type, data, index) => {
    ev.preventDefault()
    // console.log(type, data, index, tempReq)

    const hasNoAppointmentDate = applicantList.some(
      (element) =>
        element.appoint_date === null ||
        element.appoint_date === "" ||
        !element.appoint_date
    )

    setIndexes(index)
    setApplicantData(data)

    setCData((prev) => ({
      ...prev,
      prfData: tempReq,
      applicantData: data,
      salaryData: salaryData,
      applicantList: applicantList,
      signatories: signatories,
    }))

    if (hasNoAppointmentDate) {
      return toast.warning("Applicant does not have appointment date set!")
    }

    switch (type) {
      case "noe-view-hr-copy":
        setOpen(type)
        break
      case "noe-view-applicant-copy":
        setOpen(type)
        break
      case "atr-view":
        setOpen(type)
        break

      case "cos-appointment-date":
        setModalTitle("Appointment setting")
        setOpen(type)
        // setAtrAppointDate({ startDate: '', endDate: '' })
        // console.log(data.appoint_date, !data.appoint_date)
        if (data.appoint_date !== null) {
          let temp = JSON.parse(data.appoint_date)
          setAtrAppointDate({ startDate: temp[0], endDate: temp[1] })
        } else {
          setAtrAppointDate({ startDate: "", endDate: "" })
        }
        break

      case "cos-requirement-checklist":
        setModalTitle("Requirement checklist")
        setOpen(type)
        break

      case "cos-h-appointment-date":
        setModalTitle("Appointment setting")
        setOpen(type)
        break

      case "cos-h-requirement-checklist":
        setModalTitle("Requirement checklist")
        setOpen(type)
        break

      case "atr-letterhead":
        setOpen(type)
        // setLetterheadATR(null)
        setModalTitle("Letterhead settings")
        break
      case "atr-letterfoot":
        setOpen(type)
        // setLetterfootATR(null)
        setModalTitle("Letterhead settings")
        break
      case "noe-letterhead":
        setOpen(type)
        // setLetterheadNOE(null)
        setModalTitle("Letterhead settings")
        break
      case "noe-letterfoot":
        setOpen(type)
        // setLetterfootNOE(null)
        setModalTitle("Letterhead settings")
        break

      case "atr-signatory":
        break
      // case 'atr-view':
      //     break;
      case "noe-signatory":
        break
      // case 'noe-view':
      //     break;

      case "atr-print":
        break
      case "noe-print":
        break

      case "cos-salary-setting":
        setModalTitle("Salary setting")
        setOpen(type)
        break

      case "cos-h-salary-setting":
        setModalTitle("Salary setting")
        setOpen(type)
        break

      default:
        toast.warning("Error! Action not found!")
        break
    }
  }

  const handleClickSaveRequirement = (ev, list) => {
    ev.preventDefault()
    let t_data = {}

    const updatedListTerms = applicantList.map((item, idx) =>
      idx === indexes ? { ...item, doc_requirement: list } : item
    )
    const updatedData = updatedListTerms.filter(
      (ev, index) => index === indexes
    )
    setApplicantList(updatedListTerms)

    t_data = {
      prfData: tempReq,
      updatedData,
    }

    // console.log(t_data)

    saveChecklistFunction(t_data, setApplicantList)
    // res.then((r) => {
    //     console.log(r);

    //     if (r.data.status === 500) toast.error(r.data.message);
    //     if (r.data.status === 400) toast.error(r.data.message);
    //     if (r.data.status === 200) {
    //         toast.success(r.data.message);
    //         // fetchData();
    //     }
    // }).catch((error) => toast.error(error.message)).finally(() => Swal.close());
  }

  const handleSaveLetterhead = (ev, data, type) => {
    ev.preventDefault()
    const file_data = { file: data }
    const file_name = type
    if (data === null) {
      return toast.warning("Error! No uploaded file!")
    }

    saveLetterheadFunction({ file_data, file_name })
  }

  const handleUpdateStepValue = (ev) => {
    const { value } = ev.target
    // console.log(tempReq)

    let fword = autoCapitalizeFirstLetter(`${toWords(value)} pesos`)
    let svalue = value

    setSalaryData((prev) => ({
      ...prev,
      sgValue: svalue,
      formattedWords: fword,
    }))
  }
  const handleSaveSalarySetting = (ev) => {
    ev.preventDefault()

    /**
            validation of the salary value
         */
    if (salaryData.sgValue <= 0) {
      return toast.warning("Error! Invalid salary value!")
    }

    Swal.fire("Processing request . . .")
    Swal.showLoading()
    updateSalaryValue({ sgValue: salaryData.sgValue, prf_id: tempReq.id })
      .then((res) => {
        if (res.data.status === 500) {
          toast.error(res.data.message)
        }
        if (res.data.status === 200) {
          toast.success(res.data.message)
        }
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => Swal.close())

    setSalaryToggler((prev) => !prev)
  }

  const handleCloseModal = () => {
    setOpen(null)
    setModalTitle("")
  }

  return (
    <>
      <Fragment>
        <CustomCenterModal
          key={"open1"}
          matches={matches}
          openner={
            open === "cos-appointment-date" ||
            open === "cos-requirement-checklist" ||
            open === "cos-h-appointment-date" ||
            open === "cos-h-requirement-checklist" ||
            open === "atr-letterhead" ||
            open === "noe-letterhead" ||
            open === "atr-letterfoot" ||
            open === "noe-letterfoot" ||
            open === "cos-salary-setting" ||
            open === "cos-h-salary-setting"
          }
          comptitle={modalTitle}
          compSize={"40%"}
          handleCloseBTN={() => handleCloseModal()}
        >
          {open === "cos-appointment-date" && (
            <>
              <SendSetRequirement
                type={"cos"}
                date={atrAppointDate}
                setDate={setAtrAppointDate}
                closeModal={() => handleCloseModal()}
                prfData={tempReq}
                appData={applicantData}
                setAppList={setApplicantList}
              />
            </>
          )}
          {open === "cos-requirement-checklist" && (
            <>
              <CheckList
                checkList={cosCheckList}
                type={"cos"}
                handleClickSave={handleClickSaveRequirement}
                data={applicantData}
                compiledData={cData}
              />
            </>
          )}

          {open === "cos-h-appointment-date" && <></>}
          {open === "cos-h-requirement-checklist" && <></>}

          {open === "atr-letterhead" && (
            <>
              <Letterhead
                letterHeadFile={letterheadATR}
                handleSaveLetterHead={handleSaveLetterhead}
                handleCloseLetterHead={() => handleCloseModal()}
                type={"advice_to_report_lh"}
              />
            </>
          )}
          {open === "noe-letterhead" && (
            <>
              <Letterhead
                letterHeadFile={letterheadNOE}
                handleSaveLetterHead={handleSaveLetterhead}
                handleCloseLetterHead={() => handleCloseModal()}
                type={"notice_of_employment_lh"}
              />
            </>
          )}

          {open === "atr-letterfoot" && (
            <>
              <Letterhead
                letterHeadFile={letterfootATR}
                handleSaveLetterHead={handleSaveLetterhead}
                handleCloseLetterHead={() => handleCloseModal()}
                type={"advice_to_report_lf"}
              />
            </>
          )}
          {open === "noe-letterfoot" && (
            <>
              <Letterhead
                letterHeadFile={letterfootNOE}
                handleSaveLetterHead={handleSaveLetterhead}
                handleCloseLetterHead={() => handleCloseModal()}
                type={"notice_of_employment_lf"}
              />
            </>
          )}

          {open === "noe-signatory" && (
            <>
              {/* <Grid container spacing={1}> */}
              {/* <Grid item xs={12}> */}
              {/* <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>CHRMD Department Head Signatory By:</Typography> */}
              {/* </Grid> */}
              {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
              {/* <Typography> */}
              {/* </Typography> */}
              {/* <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick={() => handleSetSignatories(12, 'atr')}><EditIcon /></IconButton></Tooltip> */}
              {/* </Grid> */}
              {/* <Grid item xs={12}> */}
              {/* <hr /> */}
              {/* </Grid> */}
              {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}> */}
              {/* <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={() => setOpen(0)}>Cancel</Button> */}
              {/* </Grid> */}
              {/* </Grid> */}
            </>
          )}
          {open === "atr-signatory" && (
            <>
              {/* <Grid container spacing={1}> */}
              {/* <Grid item xs={12}> */}
              {/* <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>CHRMD Department Head Signatory By:</Typography> */}
              {/* </Grid> */}
              {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
              {/* <Typography> */}
              {/* </Typography> */}
              {/* <Tooltip title='Update'><IconButton color='success' className='custom-iconbutton' onClick={() => handleSetSignatories(12, 'atr')}><EditIcon /></IconButton></Tooltip> */}
              {/* </Grid> */}
              {/* <Grid item xs={12}> */}
              {/* <hr /> */}
              {/* </Grid> */}
              {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}> */}
              {/* <Button variant='contained' color='error' className='custom-roundbutton' size='small' onClick={() => setOpen(0)}>Cancel</Button> */}
              {/* </Grid> */}
              {/* </Grid> */}
            </>
          )}

          {open === "cos-salary-setting" && (
            <>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: "1rem" }}>
                    Current Salary:{" "}
                    {phpPesoIntFormater.format(salaryData.sgValue)}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem" }}>
                    Word Format: {salaryData.formattedWords}
                  </Typography>
                </Grid>
                {salaryToggler ? (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label" size="small">
                        {" "}
                        Update step{" "}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={salaryData.sgValue}
                        label="Update step"
                        size="small"
                        onChange={handleUpdateStepValue}
                      >
                        {/* {salaryData ? <> */}
                        <MenuItem value={salaryData.salaryData.step1}>
                          {" "}
                          STEP 1 ?-{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step1
                          )}
                        </MenuItem>
                        <MenuItem value={salaryData.salaryData.step2}>
                          {" "}
                          STEP 2 -{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step2
                          )}
                        </MenuItem>
                        <MenuItem value={salaryData.salaryData.step3}>
                          {" "}
                          STEP 3 -{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step3
                          )}
                        </MenuItem>
                        <MenuItem value={salaryData.salaryData.step4}>
                          {" "}
                          STEP 4 -{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step4
                          )}
                        </MenuItem>
                        <MenuItem value={salaryData.salaryData.step5}>
                          {" "}
                          STEP 5 -{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step5
                          )}
                        </MenuItem>
                        <MenuItem value={salaryData.salaryData.step6}>
                          {" "}
                          STEP 6 -{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step6
                          )}
                        </MenuItem>
                        <MenuItem value={salaryData.salaryData.step7}>
                          {" "}
                          STEP 7 -{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step7
                          )}
                        </MenuItem>
                        <MenuItem value={salaryData.salaryData.step8}>
                          {" "}
                          STEP 8 -{" "}
                          {phpPesoIntFormater.format(
                            salaryData.salaryData.step8
                          )}
                        </MenuItem>
                        {/* </> : <></>} */}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  <></>
                )}
                <Grid item xs={12}>
                  <hr />
                </Grid>
                <Grid item xs={12}>
                  {!salaryToggler ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => setSalaryToggler((prev) => !prev)}
                    >
                      {" "}
                      Update{" "}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={(ev) => handleSaveSalarySetting(ev)}
                    >
                      {" "}
                      Save{" "}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </>
          )}
          {open === "cos-h-salary-setting" && <>'test 2'</>}
        </CustomCenterModal>

        {/* printing views */}
        {/* {open === 2 && <>
                <Box sx={{ margin: '2rem 0' }}>
                    <Button variant="contained" color="info" size="small" onClick={() => handleATRPrint()}> Print All </Button>
                </Box>
                {applicantList.length !== 0 && (
                    <AtrDocument letterHead={letterHeadatr} signatory={signatoryAtr} letterHHSize={''} prfInfo={tempReq} wordedSalary={formatedWordSalary} sgValue={sgValue} directedTo={atrJobAssignment} appList={applicantList} ref={atrRef} refComponent={atrRef} />
                )}
            </>
            }
            {open === 1 && <>
                <Box sx={{ margin: '2rem 0' }}>
                    <Button variant="contained" color="info" size="small" onClick={() => handleNOEPrint()}> Print All </Button>
                </Box>
                {applicantList.length !== 0 && (
                    <NoeDocument letterHead={letterHeadnoe} signatory={signatoryNoe} letterHHSize={''} prfInfo={tempReq} sgValue={sgValue} wordedSalary={formatedWordSalary} appList={applicantList} refComponent={noeRef} />
                )}
            </>
            } */}
      </Fragment>
      {loading ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack spacing={1} justifyContent="center">
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="30px" />
              </Box>
              <Typography variant="caption" sx={{ display: "inline" }}>
                {" "}
                Fetching data...{" "}
              </Typography>
            </Stack>
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                lg={8}
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-start",
                  alignItems: "baseline",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={popover1.handleOpen}
                >
                  {" "}
                  notice of employment{" "}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={popover2.handleOpen}
                >
                  {" "}
                  advice to report{" "}
                </Button>
              </Grid>
              {/* <Grid item xs={12} lg={4}>
                    </Grid> */}
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  alignItems: "baseline",
                  justifyContent: "flex-end",
                }}
              >
                <Box>
                  <Tooltip title="Setting" arrow>
                    <Button
                      startIcon={<SettingsSuggestOutlined />}
                      variant="contained"
                      color="info"
                      onClick={(ev) => handleAction(ev, "cos-salary-setting")}
                    >
                      Salary
                    </Button>
                  </Tooltip>
                </Box>
                {!isEmptyObject(salaryData) && (
                  <Typography variant="caption" sx={{ display: "inline" }}>
                    {" "}
                    Currently set Salary:{" "}
                    {phpPesoIntFormater.format(salaryData.sgValue)}{" "}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Stack spacing={1} sx={{ margin: "1rem 0 0" }}>
              <Alert severity="info">
                Please update the step value for the salary (if needed) of the
                selected applicants to finalize the notice of employment.
              </Alert>
              {letterheadLoader && (!letterheadATR || !letterheadNOE) && (
                <>
                  <Alert severity="warning">
                    Some letterhead are not found. Please upload the letterhead
                    for the notice of employment and advice to report.
                  </Alert>
                </>
              )}
            </Stack>

            <Menu
              id="basic-menu"
              anchorEl={popover1.anchorEl}
              open={popover1.open}
              onClose={popover1.handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              {/* NOE */}
              <MenuItem onClick={(ev) => handleAction(ev, "noe-view-hr-copy")}>
                Print View
              </MenuItem>
              {/* <MenuItem onClick={(ev) => handleAction(ev, 'noe-view-applicant-copy')}>View Applicant Copy</MenuItem> */}
              <MenuItem onClick={(ev) => handleAction(ev, "noe-letterhead")}>
                Letterhead
              </MenuItem>
              <MenuItem onClick={(ev) => handleAction(ev, "noe-letterfoot")}>
                Letterfoot
              </MenuItem>
              {/* <MenuItem onClick={(ev) => handleAction(ev, 'noe-signatory')}>Signatories</MenuItem> */}
            </Menu>

            <Menu
              id="basic-menu"
              anchorEl={popover2.anchorEl}
              open={popover2.open}
              onClose={popover2.handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              {/* ATR */}
              <MenuItem onClick={(ev) => handleAction(ev, "atr-view")}>
                Print View
              </MenuItem>
              <MenuItem onClick={(ev) => handleAction(ev, "atr-letterhead")}>
                Letterhead
              </MenuItem>
              <MenuItem onClick={(ev) => handleAction(ev, "atr-letterfoot")}>
                Letterfoot
              </MenuItem>
              {/* <MenuItem onClick={(ev) => handleAction(ev, 'atr-letterhead')}>Signatories</MenuItem> */}
            </Menu>
          </Box>

          <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />

          <Box>
            <TableContainerComp height={"320px"} maxHeight={"300px"}>
              <TableHead>
                <TableRow>
                  {tableHeadD.map((column, index) => (
                    <TableCell
                      key={column.headerName + "-" + index}
                      sx={{
                        textAlign: "center",
                        color: "#FFF",
                        fontWeight: "bold",
                        width: column.width,
                        backgroundColor: "#1565C0 !important",
                      }}
                    >
                      {column.headerName.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {applicantList.map((i, index) => (
                  <TableRow key={"applicants-" + index}>
                    <TableCell sx={{ color: i.appoint_date ? "black" : "red" }}>
                      {i.appoint_date
                        ? JSON.parse(i.appoint_date).map((d, dx) =>
                            dx === 0
                              ? formatDateToWorded(d)
                              : ` - ${formatDateToWorded(d)}`
                          )
                        : "Unset"}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {autoCapitalizeFirstLetter(
                        formatName(i.fname, i.mname, i.lname, i.extname, 0)
                      ) || "N/A"}{" "}
                    </TableCell>
                    <TableCell> {i.emailadd} </TableCell>
                    <TableCell> {i.cpno ? i.cpno : i.telno} </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        {openedPR === "Contract of Service" && (
                          <>
                            <Tooltip title="Date of appointment" arrow>
                              <Button
                                startIcon={<CalendarMonthOutlined />}
                                variant="contained"
                                size="small"
                                onClick={(ev) =>
                                  handleAction(
                                    ev,
                                    "cos-appointment-date",
                                    i,
                                    index
                                  )
                                }
                              >
                                Appointment
                              </Button>
                            </Tooltip>
                            <Tooltip title="Checklist setting" arrow>
                              <Button
                                startIcon={<ChecklistOutlined />}
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={(ev) =>
                                  handleAction(
                                    ev,
                                    "cos-requirement-checklist",
                                    i,
                                    index
                                  )
                                }
                              >
                                Requirement
                              </Button>
                            </Tooltip>
                          </>
                        )}

                        {openedPR === "COS - Honorarium" && (
                          <>
                            <Tooltip title="Date of appointment" arrow>
                              <Button
                                startIcon={<CalendarMonthOutlined />}
                                variant="contained"
                                size="small"
                                onClick={(ev) =>
                                  handleAction(
                                    ev,
                                    "cos-h-appointment-date",
                                    i,
                                    index
                                  )
                                }
                              >
                                Appointment
                              </Button>
                            </Tooltip>
                            {/* <Button variant="contained" size="small" onClick={(ev) => handleAction(ev, 'cos-h-appointment-date', i, index)}>Appointment Date</Button> */}
                            {/* <Button variant="contained" size="small" color="secondary" onClick={(ev) => handleAction(ev, 'cos-h-requirement-checklist', i, index)}>Requirement CheckList</Button> */}
                            <Tooltip title="Checklist setting" arrow>
                              <Button
                                startIcon={<ChecklistOutlined />}
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={(ev) =>
                                  handleAction(
                                    ev,
                                    "cos-h-requirement-checklist",
                                    i,
                                    index
                                  )
                                }
                              >
                                Requirement
                              </Button>
                            </Tooltip>
                            {/* <Tooltip title="Setting" arrow>
                                            <Button startIcon={<SettingsSuggestOutlined />} variant='contained' size='small' color='info' onClick={(ev) => handleAction(ev, 'cos-h-salary-setting', i, index)}>
                                                Salary
                                            </Button>
                                        </Tooltip> */}
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainerComp>
            {/* <Box sx={{ mt: 1 }}>
                <Pagination shape="rounded" count={Math.ceil(total / perPage)} page={page} color='primary' onChange={(ev, v) => handlePaginate(ev)} />
            </Box> */}
          </Box>
        </>
      )}

      <CustomCenterModal
        key={"open2"}
        matches={matches}
        openner={
          open === "noe-view-hr-copy" ||
          open === "noe-view-applicant-copy" ||
          open === "atr-view"
        }
        comptitle={""}
        compSize={"60%"}
        handleCloseBTN={() => handleCloseModal()}
      >
        {/* <Card>
                <CardContent sx={{ overflow: 'scroll', position: 'relative' }}> */}
        {open === "noe-view-hr-copy" && (
          <>
            <NoeDocument
              ref={noeRef}
              type={"hr"}
              letterhead={letterheadNOE}
              letterfoot={letterfootNOE}
              data={cData}
              checkList={cosCheckList}
            />
          </>
        )}
        {open === "noe-view-applicant-copy" && (
          <>
            <NoeDocument
              ref={noeRef}
              type={"app"}
              letterhead={letterheadNOE}
              letterfoot={letterfootNOE}
              data={cData}
              checkList={cosCheckList}
            />
          </>
        )}
        {open === "atr-view" && (
          <>
            <AtrDocument
              ref={atrRef}
              letterhead={letterheadATR}
              letterfoot={letterfootATR}
              data={cData}
              checkList={cosCheckList}
            />
          </>
        )}
        {/* </CardContent>
            </Card> */}
      </CustomCenterModal>
    </>
  )
}

export default ContractOfService
