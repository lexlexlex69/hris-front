import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Container,
  Stack,
  Typography,
  Box,
  Button,
  IconButton,
  Backdrop,
  CircularProgress,
  Divider,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Pagination,
  Card,
  CardContent,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  useMediaQuery,
  Tooltip,
  Grid,
  Input,
} from "@mui/material";
import {
  Cached as CachedIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Print as PrintIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ButtonViewPRF from "../requestdetails/view/ButtonViewPRF";
import {
  CustomCenterModal,
  TableContainerComp,
} from "../components/export_components/ExportComp";
import { getAssessedApplicant } from "../axios/prfPooling";
import { PrfStateContext } from "../PrfProvider";
import { AppliedInfo } from "../components/pooling_indorsement/component/ExportComponent";
import NoDataFound from "../components/NoDataFound";
import SummaryCandidates from "./process_document/SummaryCandidates";
import {
  getUploadedLetterhead,
  setSelectedRaterAssessment,
  uploadLetterhead,
} from "./DocRequest";
import { autoCapitalizeFirstLetter } from "../../customstring/CustomString";
import { getFileAPI } from "../../../../viewfile/ViewFileRequest";
import { SearchEmployeeModal } from "./component/SearchEmployee";
import PrintPreviewButton from "../../../../components/prf/PrintPreviewButton";

const tableHeadD = [
  { id: 1, headerName: "#", width: "20px" },
  { id: 2, headerName: "name", width: "80px" },
  { id: 3, headerName: "email address", width: "100px" },
  { id: 4, headerName: "cell./tel. #", width: "50px" },
  { id: 5, headerName: "remarks", width: "50px" },
  // { id: 6, headerName: "evaluate assessment", width: "220px" },
];

const tableSelectRecAc = [
  { id: 1, headerName: "#", width: "20px" },
  { id: 2, headerName: "Name", width: "100px" },
  { id: 3, headerName: "action", width: "80px" },
];

function Indorsement({ closeModal, data }) {
  const { tempReq } = useContext(PrfStateContext);
  // console.table("tempReq", tempReq);
  console.table("data", data);

  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 565px)");
  const letterHeadName = "summcand_letterhead";
  const letterFootName = "summcand_letterfoot";

  const [letterHeadFileName, setLetterHeadFileName] = useState(null);
  const [letterHeadsc, setLetterHeadsc] = useState(null);
  const [letterFootsc, setLetterFootsc] = useState(null);

  const [applicantList, setApplicantList] = useState([]);
  const [raterAssessmentList, setRaterAssessmentList] = useState([]);
  const [raterInfoList, setRaterInfoList] = useState([]);
  const [uniqueRaterList, setUniqueRaterList] = useState([]);
  const [selectedRtrRecomAct, setSelectedRtrRecomAct] = useState({});

  const [loader, setLoader] = useState(true);
  const [openPRF, setOpenPRF] = useState(false);
  const [open, setOpen] = useState(null);
  const [letterHeadID, setLetterHeadID] = useState("");

  // for pagination
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 5;
  let controller = new AbortController();

  const popoverSumm = usePopover();

  useEffect(() => {
    if (Object.keys(tempReq).length > 0) {
      fetchAssessedApplicant();
    } else {
      toast.warning("Ops, something went wrong!");
      return navigate("/hris");
    }
  }, []);

  const fetchAssessedApplicant = () => {
    getAssessedApplicant({ prf_id: tempReq.id })
      .then((res) => {
        if (res.data.status === 500) {
          return toast.error(res.data.message);
        }
        if (res.data.status === 200) {
          setApplicantList(res.data.applicant_list);
          console.log("applicantList", res.data.applicant_list);
          setRaterInfoList(res.data.emp_list);
          setRaterAssessmentList(res.data.rater_list);
        }

        return getUploadedLetterhead({ file_name: letterHeadName });
      })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id);
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterHeadsc(res);
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              });
            });
        }

        return getUploadedLetterhead({ file_name: letterFootName });
      })
      .then((res) => {
        if (res.data) {
          setLetterHeadID(res.data.file_id);
          getFileAPI(res.data.file_id)
            .then((res) => {
              setLetterFootsc(res);
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: err,
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleReloadData = async () => {
    setLoader(true);
    setApplicantList([]);
    setRaterInfoList([]);
    setRaterAssessmentList([]);
    setUniqueRaterList([]);
    setOpenPRF(false);
    setOpen(null);

    fetchAssessedApplicant();
  };

  const handleAction = (ev, it, action) => {
    ev.preventDefault();
    switch (action) {
      case "summary_candidates":
        let lo = 0;
        let lst = [];
        setLoader(true);
        applicantList.forEach((element) => {
          if (element.is_employee === 1) {
            axios
              .post(
                `/api/pds/print/getEducation${
                  element.app_id
                    ? `?id=${element.app_id}&&category=employee`
                    : ""
                }`
              )
              .then((res) => {
                element.education = res.data.education;
                return axios.post(
                  `/api/pds/print/getEligibility${
                    element.app_id
                      ? `?id=${element.app_id}&&category=employee`
                      : ""
                  }`
                );
              })
              .then((res) => {
                element.eligibility = res.data.eligibility;
                return axios.post(
                  `/api/pds/print/getWorkExp${
                    element.app_id
                      ? `?id=${element.app_id}&&category=employee`
                      : ""
                  }`
                );
              })
              .then((res) => {
                element.work_experience = res.data.work_experience;
              })
              .catch((err) => {
                toast.error(err.message);
              })
              .finally(() => {
                lst.push(element);
                lo += 1;
                if (lo === applicantList.length) {
                  setLoader(false);
                }
              });
          } else {
            axios
              .post(
                `/api/pds/print/getEducation${
                  element.app_id
                    ? `?id=${element.app_id}&&category=applicant`
                    : ""
                }`
              )
              .then((res) => {
                element.education = res.data.education;

                return axios.post(
                  `/api/pds/print/getEligibility${
                    element.app_id
                      ? `?id=${element.app_id}&&category=applicant`
                      : ""
                  }`
                );
              })
              .then((res) => {
                element.eligibility = res.data.eligibility;

                return axios.post(
                  `/api/pds/print/getWorkExp${
                    element.app_id
                      ? `?id=${element.app_id}&&category=applicant`
                      : ""
                  }`
                );
              })
              .then((res) => {
                element.work_experience = res.data.work_experience;
              })
              .catch((err) => {
                toast.error(err.message);
              })
              .finally(() => {
                lst.push(element);
                console.log("lst", lst);
                lo += 1;
                if (lo === applicantList.length) {
                  setLoader(false);
                }
              });
          }
        });
        setApplicantList(lst);

        setOpen(action);
        break;
      case "select_assessment":
        // console.log(raterInfoList)
        const resData = getUniqueEmployees(raterInfoList);
        console.log("resData", resData);
        setUniqueRaterList(resData);
        console.log("uniqueRaterList", uniqueRaterList);
        setOpen(action);
        break;

      default:
        toast.warning("Error, action not found!");
        break;
    }
  };

  const handleSubmitIndorsement = () => {
    Swal.fire({
      title: "Click continue, if you are done with the preparation?",
      text: "",
      icon: "info",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Continue",
    }).then((result) => {
      if (result.isConfirmed) {
        submitData();
      }
    });
  };

  const submitData = async () => {
    try {
      const [res] = await Promise.all([
        axios.post(
          "api/prf/indorsement/complete-preparation",
          { prf_data: tempReq },
          { signal: controller.signal }
        ),
      ]);
      if (res.data.status === 500) {
        toast.error(res.data.message);
      }
      if (res.data.status === 200) {
        toast.success(res.data.message);
        closeModal();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const handleEvaluateApplicant = (ev, i) => {
  //     ev.preventDefault();
  //     let t = raterAssessmentList.filter(d => d.rater_emp_id === i.emp_id)
  //     setTemp(t)

  //     setOpenViewprf('evaluate_applicant')
  // }

  const btnSelection = (ii) => {
    const fEmp = raterInfoList.find((i) => i.emp_id === ii.rater_emp_id);
    // let mname = fEmp.emp_mname ? fEmp.emp_mname[0] : ''
    // let name = fEmp.emp_lname + ', ' + fEmp.emp_fname + ' ' + mname + '.'
    let name = fEmp.emp_lname + ", " + fEmp.emp_fname;
    switch (ii.rater_lvl) {
      case "human_resources":
        return {
          raterLvl: `HR: ${name}`,
          clickTrig: 1,
          applicantDetails: ii,
        };
      case "immediate_head":
        return {
          raterLvl: `IM: ${name}`,
          clickTrig: 1,
          applicantDetails: ii,
        };
      case "next_level_head":
        return {
          raterLvl: `NLH: ${name}`,
          clickTrig: 1,
          applicantDetails: ii,
        };

      default:
        return {
          raterLvl: 500,
          clickTrig: 500,
          applicantDetails: "empty",
        };
    }
  };

  const handleSelectedRater = (ev, i) => {
    const { value } = ev.target;
    setSelectedRtrRecomAct({
      [value]: { test: "dummy" },
      data: { id: i.id, empID: i.emp_id },
    });
  };

  const handleSaveSelectedRater = () => {
    if (selectedRtrRecomAct.length === 0) {
      toast.error("Please select at least one rater!");
      return;
    }

    const t_data = {
      prf_id: tempReq.id,
      selected_rater: selectedRtrRecomAct.data,
    };

    Swal.fire({
      title: "Click continue to save selected interviewer/rater?",
      text: "",
      icon: "info",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Continue",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedRaterAssessment(t_data)
          .then((res) => {
            if (res.data.status === 500) {
              toast.error(res.data.message);
            }
            if (res.data.status === 200) {
              toast.success(res.data.message);
              setRaterAssessmentList(res.data.rater_list);
            }
          })
          .catch((err) => {
            toast.error(err.message);
          });
      }
    });
  };

  const handleFileHead = (e) => {
    var file = e.target.files[0];
    setLetterHeadFileName(file.name);
    var extension = file.name.split(".").pop().toLowerCase();

    // console.log(file)

    if (["pdf", "png", "jpg", "jpeg"].includes(extension)) {
      // handleFileUpload(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLetterHeadsc(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setLetterHeadsc(null);
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        html: "Please upload Image file.",
      });
    }
  };

  const handleFileFoot = (e) => {
    var file = e.target.files[0];
    setLetterHeadFileName(file.name);
    var extension = file.name.split(".").pop().toLowerCase();

    // console.log(file)

    if (["pdf", "png", "jpg", "jpeg"].includes(extension)) {
      // handleFileUpload(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLetterFootsc(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setLetterFootsc(null);
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        html: "Please upload Image file.",
      });
    }
  };

  // const handleFileUpload = (file) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //         setLetterHeadsc(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  // };

  const handleSaveLetterHead = (ev) => {
    ev.preventDefault();
    // console.log(letterHeadsc)

    const file_data = { file: letterHeadsc };
    uploadLetterhead({ file_data, file_name: letterHeadName })
      .then((r) => {
        if (r.data.status === 200) {
          toast.success(r.data.message);
        } else {
          toast.error(r.message || "An error occurred");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "An error occurred");
      });
  };

  const handleSaveLetterFoot = (ev) => {
    ev.preventDefault();

    const file_data = { file: letterFootsc };
    uploadLetterhead({ file_data, file_name: letterFootName })
      .then((r) => {
        if (r.data.status === 200) {
          toast.success(r.data.message);
        } else {
          toast.error(r.message || "An error occurred");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "An error occurred");
      });
  };

  return (
    <>
      <>
        <CustomCenterModal
          compSize={"40%"}
          comptitle={"Modal settings"}
          handleCloseBTN={() => setOpen("")}
          matches={matches}
          openner={
            open === "select_assessment" ||
            open === "letterhead_summ" ||
            open === "letterfoot_summ"
          }
        >
          {open === "letterhead_summ" && (
            <Letterhead
              letterHeadFileName={letterHeadFileName}
              letterHeadFile={letterHeadsc}
              handleFile={handleFileHead}
              handleSaveLetterHead={(ev) => handleSaveLetterHead(ev)}
              handleCloseLetterHead={() => setOpen("")}
            />
          )}
          {open === "letterfoot_summ" && (
            <Letterhead
              letterHeadFileName={letterHeadFileName}
              letterHeadFile={letterFootsc}
              handleFile={handleFileFoot}
              handleSaveLetterHead={(ev) => handleSaveLetterFoot(ev)}
              handleCloseLetterHead={() => setOpen("")}
            />
          )}

          {open === "select_assessment" && (
            <Card>
              <CardContent>
                <TableContainerComp maxHeight={"250px"} height={"250px"}>
                  <TableHead>
                    <TableRow>
                      {tableSelectRecAc.map((u) => (
                        <TableCell
                          sx={{
                            textAlign: "center",
                            color: "#FFF",
                            fontWeight: "bold",
                            backgroundColor: "#1565C0 !important",
                            textTransform: "uppercase",
                            width: u.width,
                          }}
                        >
                          {" "}
                          {u.headerName}{" "}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loader ? (
                      Array.from(Array(5)).map((i, ix) => (
                        <TableRow key={ix}>
                          {Array.from(Array(3)).map((j, jx) => (
                            <TableCell component={"th"} scope="row" key={jx}>
                              <Skeleton
                                variant="text"
                                width={""}
                                height={45}
                                animation="wave"
                                sx={{ borderRadius: 0 }}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : uniqueRaterList.length > 0 ? (
                      uniqueRaterList.map((i, ix) => {
                        if (ix !== 0) {
                          return (
                            <TableRow key={`rater-${i.id}`}>
                              <TableCell sx={{ textAlign: "center" }}>
                                {ix}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {autoCapitalizeFirstLetter(
                                  i.emp_lname || "N/A"
                                )}
                                ,{" "}
                                {autoCapitalizeFirstLetter(
                                  i.emp_fname || "N/A"
                                )}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <input
                                  style={{ width: "20px", height: "20px" }}
                                  type="radio"
                                  name="rater-radio-selection"
                                  value={i.id}
                                  checked={
                                    selectedRtrRecomAct[i.id] !== undefined
                                  }
                                  onChange={(ev) => handleSelectedRater(ev, i)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <NoDataFound spanNo={tableSelectRecAc.length} />
                    )}
                  </TableBody>
                </TableContainerComp>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen("")}
                  sx={{ padding: "auto 5px" }}
                >
                  {" "}
                  back{" "}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleSaveSelectedRater()}
                  sx={{ padding: "auto 5px" }}
                >
                  {" "}
                  save{" "}
                </Button>
              </CardActions>
            </Card>
          )}
        </CustomCenterModal>
      </>
      <Card>
        <CardContent>
          <Stack gap={2}>
            <Stack spacing={1}>
              <AppliedInfo tempReq={tempReq} />
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <ButtonViewPRF
                  open={openPRF}
                  handleClickOpen={() => setOpenPRF(true)}
                  handleClose={() => setOpenPRF(false)}
                  id={"a-id"}
                  minWidth={"65%"}
                />
              </Box>
              <PrintPreviewButton />

              {/* {loader ? (
                <>
                  <Skeleton
                    variant="text"
                    width={"100%"}
                    height={55}
                    animation="wave"
                    sx={{ borderRadius: 0, marginRight: "0" }}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ display: "flex" }}>
                    <Box>
                      <IconButton
                        className="custom-iconbutton"
                        color="primary"
                        aria-label="reload table data"
                        onClick={handleReloadData}
                        size="small"
                      >
                        <CachedIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ flex: "1 1 auto" }} />

                    <Tooltip title="Print Preview" placement="top" arrow>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PrintIcon />}
                        onClick={(ev) =>
                          handleAction(ev, "", "summary_candidates")
                        }
                      >
                        {" "}
                        Summary of Candidates{" "}
                      </Button>
                    </Tooltip>
                    {data.signings
                      .filter((o) => o.id_pr_form === tempReq.id)
                      .some((m) => m.request_stat === "SELECTION COMPLETE") && (
                      <>
                        &nbsp;
                        <Tooltip
                          title="Selection of Interviewer/Rater"
                          placement="top"
                          arrow
                        >
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<AssessmentIcon />}
                            onClick={(ev) =>
                              handleAction(ev, "", "select_assessment")
                            }
                          >
                            {" "}
                            Recommended Action{" "}
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "end", gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SettingsIcon />}
                      onClick={() => setOpen("letterfoot_summ")}
                      size="small"
                      color="secondary"
                    >
                      {" "}
                      LetterFoot{" "}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SettingsIcon />}
                      onClick={() => setOpen("letterhead_summ")}
                      size="small"
                      color="secondary"
                    >
                      {" "}
                      Letterhead{" "}
                    </Button>
                  </Box>
                </>
              )} */}
            </Stack>
            <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
            <Box>
              <TableContainerComp maxHeight={"300px"} height={"300px"}>
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
                  ) : applicantList.length > 0 ? (
                    applicantList.map((i, indx) => (
                      <TableRow key={"applicants-" + indx}>
                        <TableCell> {indx + 1} </TableCell>
                        <TableCell
                          sx={{ color: i.remark === "SELECTED" ? "green" : "" }}
                        >
                          {" "}
                          {i.lname ? autoCapitalizeFirstLetter(i.lname) : "N/A"}
                          ,{" "}
                          {i.fname ? autoCapitalizeFirstLetter(i.fname) : "N/A"}{" "}
                          {i.mname
                            ? autoCapitalizeFirstLetter(i.mname[0])
                            : "N/A"}{" "}
                        </TableCell>
                        <TableCell> {i.emailadd} </TableCell>
                        <TableCell>
                          {i.cpno ? i.cpno : i.telno ? i.telno : "N/A"}
                        </TableCell>
                        <TableCell> {i.remark} </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <NoDataFound spanNo={tableHeadD.length} />
                  )}
                </TableBody>
              </TableContainerComp>
              {/* <Box sx={{ mt: 1 }}>
                                <Pagination shape="rounded" count={Math.ceil(total / perPage)} page={page} color="primary" onChange={(ev, v) => handlePaginate(ev, v)} />
                            </Box> */}
            </Box>
          </Stack>
        </CardContent>
        <CardActions
          sx={{ padding: "8px 16px 16px 16px", justifyContent: "end" }}
        >
          {data.signings
            .filter((op) => op.id_pr_form === tempReq.id)
            .some((m) => m.request_stat === "INDORSEMENT COMPLETE") ? (
            <Button variant="contained" disabled>
              {" "}
              Pending{" "}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmitIndorsement}
            >
              {" "}
              complete Indorsement{" "}
            </Button>
          )}
        </CardActions>
      </Card>
      <Divider sx={{ margin: "1rem 0" }} />
      {loader ? (
        <></>
      ) : (
        <>
          <CustomCenterModal
            compSize={"60%"}
            comptitle={""}
            matches={matches}
            handleCloseBTN={() => setOpen("")}
            openner={open === "summary_candidates"}
          >
            {applicantList.length !== 0 && (
              <>
                <SummaryCandidates
                  // ref={summaryRef}
                  applicantList={applicantList}
                  prfData={tempReq}
                  raterList={raterAssessmentList}
                  raterInfo={raterInfoList}
                  letterHead={letterHeadsc}
                  letterFoot={letterFootsc}
                />
              </>
            )}
          </CustomCenterModal>
        </>
      )}
    </>
  );
}

export default Indorsement;
// ///////////////////-----------------------------------------------------------------------------------------------------------
function usePopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return { id, open, anchorEl, handleOpen, handleClose };
}

function getUniqueEmployees(empList) {
  console.log("empList", empList);
  const uniqueEmpIds = new Set();
  return empList.filter((employee) => {
    if (!uniqueEmpIds.has(employee.emp_id)) {
      uniqueEmpIds.add(employee.emp_id);
      console.log("employee", employee);
      return true;
    }
    return false;
  });
}

const Letterhead = React.memo(
  ({
    letterHeadFile,
    letterHeadFileName,
    handleFile,
    handleSaveLetterHead,
    handleCloseLetterHead,
  }) => {
    return (
      <>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span>{letterHeadFileName}</span>
            <label
              htmlFor={"contained-button-file"}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Input
                accept="image/*,.pdf"
                id={"contained-button-file"}
                hidden
                type="file"
                onChange={(value) => handleFile(value)}
              />
              <Tooltip title="Upload Letter Head">
                <IconButton
                  color="primary"
                  className="custom-iconbutton"
                  component="span"
                >
                  <UploadIcon />
                </IconButton>
              </Tooltip>
            </label>
          </Grid>
          <Grid item xs={12}>
            <img
              src={letterHeadFile}
              width="100%"
              height="100%"
              alt="Image file"
            />
          </Grid>
          <Grid item xs={12}>
            <hr />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button
              variant="contained"
              color="success"
              className="custom-roundbutton"
              size="small"
              onClick={handleSaveLetterHead}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              className="custom-roundbutton"
              size="small"
              onClick={handleCloseLetterHead}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
);
