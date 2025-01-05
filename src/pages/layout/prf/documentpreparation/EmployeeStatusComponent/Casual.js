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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material"
import {
  CalendarMonthOutlined,
  ChecklistOutlined,
  Settings as SettingsIcon,
  SettingsSuggestOutlined,
} from "@mui/icons-material"
import { toast } from "react-toastify"

import { PrfStateContext } from "../../PrfProvider"
import {
  casualCheckList,
  CheckList,
  convertToWord,
  Letterhead,
  saveChecklistFunction,
  saveLetterheadFunction,
  SendSetRequirement,
  tableHeadD,
} from "../ProcessDocument"
import {
  CustomCenterModal,
  phpPesoIntFormater,
  TableContainerComp,
} from "../../components/export_components/ExportComp"
import {
  autoCapitalizeFirstLetter,
  formatDateToWorded,
  formatName,
} from "../../../customstring/CustomString"
import { usePopover } from "../../../custompopover/UsePopover"
import EnDocument from "../process_document/EnDocument"
import { useReactToPrint } from "react-to-print"
import { getPrfSignatories, getUploadedLetterhead } from "../DocRequest"
import Swal from "sweetalert2"
import { getFileAPI } from "../../../../../viewfile/ViewFileRequest"
import toWords from "number-to-words/src/toWords"
import { isEmptyObject } from "jquery"
import { updateSalaryValue } from "../../axios/prfRequest"

function Casual({ applicantList, setApplicantList, loader }) {
  const { tempReq, applicantData, setApplicantData, deptData, openedPR } =
    useContext(PrfStateContext)
  const matches = useMediaQuery("(min-width: 565px)")
  const popover = usePopover()
  const printRef = useRef()
  const [indexes, setIndexes] = useState(null)

  const [open, setOpen] = useState(null)
  const [letterHead, setLetterHead] = useState(null)
  const [letterFoot, setLetterFoot] = useState(null)

  const [tData, setTData] = useState({})
  const [modalTitle, setModalTitle] = useState("")
  const [letterHeadID, setLetterHeadID] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [salaryData, setSalaryData] = useState(null)
  const [salaryToggler, setSalaryToggler] = useState(false)
  const [cData, setCData] = useState(null)
  const [signatories, setSignatories] = useState(null)

  const [letterheadLoader, setLetterheadLoader] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpdatedData()
  }, [])

  useEffect(() => {
    if (open === null && modalTitle === "") {
      setModalTitle("")
      setOpen(null)
    }
  }, [open])

  useEffect(() => {
    console.log(cData)
  }, [cData])

  const fetchUpdatedData = async () => {
    getUploadedLetterhead({ file_name: "employment_notice" })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id)
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterHead(res)
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              })
            })
        }

        // return getPrfSignatories2({ signatory_category: 'employment notice', signatory_slug: 'city_mayor' })
        return getUploadedLetterhead({ file_name: "employment_notice_foot" })
      })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id)
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterFoot(res)
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              })
            })
        }

        return getPrfSignatories({ prfData: tempReq })
      })
      .then((res) => {
        if (res.status === 200) {
          setSignatories(res.data)
        }
      })
      // .then((res) => {
      //     if (res.data.status === 500) { toast.warning(res.data.message); }
      //     if (res.data.status === 200) {
      //         setSignatories((prev) => ({
      //             ...prev, city_mayor: res.data.data,
      //         }));
      //     }
      //     return getPrfSignatories2({ signatory_category: 'employment notice', signatory_slug: 'city_administrator' })
      // })
      // .then((res) => {
      //     if (res.data.status === 500) { toast.warning(res.data.message); }
      //     if (res.data.status === 200) {
      //         setSignatories((prev) => ({
      //             ...prev, city_administrator: res.data.data,
      //         }))
      //     }
      // })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLetterheadLoader(true)
        setLoading(false)
      })

    /**
            Get the signatories of the employment notice
         */

    // const [res1, res2] = await Promise.all([
    //     getPrfSignatories2({ signatory_category: 'employment notice', signatory_slug: 'city_mayor' }),
    //     getPrfSignatories2({ signatory_category: 'employment notice', signatory_slug: 'city_administrator' }),
    // ]);

    // console.log(res1, res2);
    // setSignatories({
    //     city_mayor: res1.data.data,
    //     city_administrator: res2.data.data,
    // });

    convertToWord(tempReq, setSalaryData)
    console.log("salaryData", salaryData)
  }

  const handleAction = (ev, type, data, index) => {
    ev.preventDefault()

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
    console.log("cData", cData)

    switch (type) {
      case "view-hr-copy":
        if (hasNoAppointmentDate) {
          return toast.warning("Applicant does not have appointment date set!")
        }
        setOpen(type)
        break
      case "view-applicant-copy":
        if (hasNoAppointmentDate) {
          return toast.warning("Applicant does not have appointment date set!")
        }
        setOpen(type)
        break
      case "appointment-date":
        setModalTitle("Appointment settings")
        setOpen(type)
        setAppointmentDate(JSON.parse(data.appoint_date))
        break
      case "requirement-checklist":
        setOpen(type)
        setModalTitle(" Requirement checklist")
        break
      case "letterhead":
        setOpen(type)
        setModalTitle("Letterhead settings")
        break
      case "letterfoot":
        setOpen(type)
        setModalTitle("Letterfoot settings")
        break
      case "casual-salary-setting":
        setModalTitle("Salary setting")
        setSalaryToggler(false)
        setOpen(type)
        break

      default:
        toast.error("Error! Action not found!")
        break
    }
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
  const handlePrint = useReactToPrint({
    content: () => {
      if (printRef.current) {
        return printRef.current
      }
      return null
    },
  })

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
  }

  const handleSaveLetterhead = (ev, data, type) => {
    ev.preventDefault()
    const file_data = { file: data }
    const file_name = type
    if (data === null) {
      return toast.warning("Error! No uploaded file!")
    }

    // console.log(data, type)

    saveLetterheadFunction({ file_data, file_name })
    // res.then((r) => {
    //     console.log(r)
    // }).catch((error) => toast.error(error.message)).finally(() => Swal.close())
  }

  const salaryDatasalaryData = (ev) => {
    const { value } = ev.target
    console.log(ev, value)
    console.log("value", value)
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
            open === "appointment-date" ||
            open === "requirement-checklist" ||
            open === "letterhead" ||
            open === "letterfoot" ||
            open === "casual-salary-setting"
          }
          comptitle={modalTitle}
          compSize={"40%"}
          handleCloseBTN={() => handleCloseModal()}
        >
          {open === "letterhead" && (
            <>
              <Letterhead
                letterHeadFile={letterHead}
                handleSaveLetterHead={handleSaveLetterhead}
                handleCloseLetterHead={() => handleCloseModal()}
                type={"employment_notice"}
              />
            </>
          )}

          {open === "letterfoot" && (
            <>
              <Letterhead
                letterHeadFile={letterFoot}
                handleSaveLetterHead={handleSaveLetterhead}
                handleCloseLetterHead={() => handleCloseModal()}
                type={"employment_notice_foot"}
              />
            </>
          )}

          {open === "appointment-date" && (
            <>
              <SendSetRequirement
                type={"casual"}
                date={appointmentDate}
                setDate={setAppointmentDate}
                closeModal={() => handleCloseModal()}
                prfData={tempReq}
                appData={applicantData}
                setAppList={setApplicantList}
              />
            </>
          )}

          {open === "requirement-checklist" && (
            <>
              <CheckList
                checkList={casualCheckList}
                type={"casual"}
                handleClickSave={handleClickSaveRequirement}
                data={applicantData}
                compiledData={cData}
              />
            </>
          )}

          {open === "casual-salary-setting" && (
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
                        <MenuItem value={salaryData.salaryData.step1}>
                          {" "}
                          STEP 1 -{" "}
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
        </CustomCenterModal>

        {/* printing */}
        {open === 3 && (
          <>
            <Card>
              <CardContent>
                <Box sx={{ margin: "2rem 0" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handlePrint()}
                  >
                    {" "}
                    Print All{" "}
                  </Button>
                </Box>
                {applicantList.length !== 0 && (
                  <EnDocument
                    ref={printRef}
                    data={tData}
                    letterHead={letterHead}
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}
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
              <Grid item xs={12} lg={8}>
                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={popover.handleOpen}
                >
                  {" "}
                  employment notice{" "}
                </Button>
              </Grid>
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
                      onClick={(ev) =>
                        handleAction(ev, "casual-salary-setting")
                      }
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
                selected applicants to finalize the employment notice.
              </Alert>
              {letterheadLoader && !letterHead && (
                <>
                  <Alert severity="warning">
                    No letterhead found. Please upload the letterhead for the
                    employment notice.
                  </Alert>
                </>
              )}
            </Stack>

            <Menu
              id="basic-menu"
              anchorEl={popover.anchorEl}
              open={popover.open}
              onClose={popover.handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={(ev) => handleAction(ev, "view-hr-copy")}>
                Print View
              </MenuItem>
              {/* <MenuItem onClick={(ev) => handleAction(ev, 'view-applicant-copy')}>View Applicant Copy</MenuItem> */}
              <MenuItem onClick={(ev) => handleAction(ev, "letterhead")}>
                Letterhead
              </MenuItem>
              <MenuItem onClick={(ev) => handleAction(ev, "letterfoot")}>
                Letterfoot
              </MenuItem>
              {/* <MenuItem onClick={(ev) => handleEN(ev, 4)}>Specific date</MenuItem> */}
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
                {loader ? (
                  Array.from(Array(5)).map((item, index) => (
                    <TableRow key={index}>
                      {Array.from(Array(5)).map((item2, index2) => (
                        <TableCell component="th" scope="row" key={index2}>
                          <Skeleton
                            variant="text"
                            width=""
                            height={45}
                            animation="wave"
                            sx={{ borderRadius: 0 }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <>
                    {applicantList.map((i, indx) => (
                      <TableRow key={"applicants-" + indx}>
                        <TableCell
                          sx={{ color: i.appoint_date ? "black" : "red" }}
                        >
                          {i.appoint_date
                            ? formatDateToWorded(i.appoint_date)
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
                            <Tooltip title="Date of appointment" arrow>
                              <Button
                                startIcon={<CalendarMonthOutlined />}
                                variant="contained"
                                size="small"
                                onClick={(ev) =>
                                  handleAction(ev, "appointment-date", i, indx)
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
                                    "requirement-checklist",
                                    i,
                                    indx
                                  )
                                }
                              >
                                Requirement
                              </Button>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
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
        openner={open === "view-hr-copy" || open === "view-applicant-copy"}
        handleCloseBTN={() => handleCloseModal()}
        comptitle={""}
        compSize={"60%"}
      >
        {/* <Card>
                <CardContent> */}
        {open === "view-hr-copy" ? (
          <>
            <EnDocument
              ref={printRef}
              letterHead={letterHead}
              letterFoot={letterFoot}
              data={cData}
              checkList={casualCheckList}
              type={1}
              signatories={signatories}
            />
          </>
        ) : (
          // open === 'view-applicant-copy' ? <>
          //     <EnDocument ref={printRef} letterHead={letterHead} data={cData} checkList={casualCheckList} type={0} />
          // </>
          // :
          <></>
        )}
        {/* </CardContent>
            </Card> */}
      </CustomCenterModal>
    </>
  )
}

export default Casual
