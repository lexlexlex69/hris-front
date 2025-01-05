import { Fragment, useContext, useEffect, useState } from "react";
import PrfProvider, { PrfStateContext } from "./PrfProvider";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  Preview as PreviewIcon,
  Assessment as AssessmentIcon,
  AssignmentTurnedInOutlined as AssignmentTurnedInIcon,
  NoteAltOutlined as NoteAltIcon,
  ContactPageOutlined as ContactPageIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Feed as FeedIcon,
} from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import DashboardLoading from "../loader/DashboardLoading";
import ModuleHeaderText from "../moduleheadertext/ModuleHeaderText";
import RequestStatModal from "./components/export_components/RequestStatModal";
import NoDataFound from "./components/NoDataFound";
import {
  CustomDialog,
  CustomPopover,
  SearchFilComponent,
  TableContainerComp,
} from "./components/export_components/ExportComp";

import axios from "axios";
import { isEmptyObject } from "jquery";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ProcessDocument from "./documentpreparation/ProcessDocument";
import ApplicantSelection from "./components/pooling_indorsement/selection/ApplicantSelection";
import TasRequestStatus from "./documentpreparation/TasRequestStatus";
import Indorsement from "./documentpreparation/Indorsement";

function PersonnelRequest() {
  return (
    <PrfProvider>
      <PersonnelRequestPage />
    </PrfProvider>
  );
}

export default PersonnelRequest;

const tableHeadColumns = [
  { field: "prf_no", headerName: "PRF NO.", width: "90px" },
  { field: "status", headerName: "STATUS", width: "300px" },
  { field: "office_dept", headerName: "OFFICE/DEPARTMENT" },
  { field: "head_cnt", headerName: "HEAD COUNT" },
  { field: "pay_sal", headerName: "PAY/SALARY GRADE" },
  { field: "nature_req", headerName: "NATURE OF REQUEST", width: "165px" },
  { field: "date_requested", headerName: "DATE REQUESTED" },
  { field: "date_needed", headerName: "DATE NEEDED" },
  { field: "emp_status", headerName: "EMPLOYEE STATUS" },
  { field: "actions", headerName: "ACTIONS", width: "150px" },
];

function PersonnelRequestPage() {
  const {
    tempReq,
    setTempReq,
    setOpenedPR,
    openedPR,
    noDataFound,
    setNoDataFound,
    deptData,
    natureReq,
    matches,
  } = useContext(PrfStateContext);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refSelector, setRefSelector] = useState("");
  const [refSearch, setRefSearch] = useState("");
  const [requestLogs, setRequestLogs] = useState([]);

  const [open, setOpen] = useState(0);

  let controller = new AbortController();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refSearch === "" || refSelector === "") {
      setFilteredData(rowData.data);
    }
  }, [refSearch, refSelector]);

  useEffect(() => {
    if (isEmptyObject(rowData.data)) {
      setNoDataFound(true);
    } else {
      setNoDataFound(false);
      setFilteredData(rowData.data);
    }
  }, [rowData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        axios.post(
          "api/prf-tracker/get-prf-list",
          {},
          { signal: controller.signal }
        ),
      ]);
      if (res.data.status === 500) {
        toast.error(res.data.message);
      }
      if (res.data.status === 200) {
        setRowData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReloadData = () => {
    fetchData();
  };

  const handleCloseModal = () => {
    setOpen(0);
    fetchData();
  };

  const handleSearchBtn = (e) => {
    e.preventDefault();
    if (refSelector !== "") {
      const filterRes = rowData.data.filter((it) => {
        return it.office_dept === refSelector;
      });
      setFilteredData(filterRes);
    }
    if (refSearch !== "") {
      const filteredResult = rowData.data.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(refSearch.toLowerCase());
      });
      setFilteredData(filteredResult);
    }
  };

  const handleClick = (ev, it, action, emp_stat) => {
    ev.preventDefault();
    const f = rowData.signings.filter((m) => m.id_pr_form === it.id);
    setRequestLogs(f);
    setOpenedPR(emp_stat);
    console.log("it", it);

    setTempReq(it);
    switch (action) {
      case "view":
        setOpen(1);
        break;
      case "indorsement":
        setOpen(2);
        break;
      case "requirement":
        setOpen(3);
        break;
      case "assessment":
        setOpen(4);
        break;
      case "tas":
        setOpen(5);
        break;

      default:
        toast.warning("Error, action not found!");
        break;
    }
  };

  return (
    <Box sx={{ margin: "0 10px 10px 10px" }}>
      {loading ? (
        <DashboardLoading />
      ) : (
        <>
          <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF) - Document Process" />
          <Box sx={{ margin: "10px 0px" }}>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} lg={12}>
                <SearchFilComponent
                  handleReloadData={handleReloadData}
                  data={rowData.data}
                  selectedRef={refSelector}
                  setSelectedRef={setRefSelector}
                  searchRef={refSearch}
                  setSearchRef={setRefSearch}
                  handleSearchRef={handleSearchBtn}
                />
              </Grid2>
              <Grid2 item xs={12}>
                <TableContainerComp>
                  <TableHead>
                    <TableRow>
                      {tableHeadColumns.map((column, index) => (
                        <TableCell
                          key={column.headerName + "-" + index}
                          sx={{
                            textAlign: "center",
                            color: "#FFF",
                            fontWeight: "bolder",
                            fontSize: "12px",
                            width: column.width,
                            backgroundColor: "#1565C0 !important",
                          }}
                        >
                          {column.headerName}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noDataFound || filteredData.length <= 0 ? (
                      <NoDataFound spanNo={tableHeadColumns.length} />
                    ) : (
                      filteredData.map((it, idx) => (
                        <TableRow key={"table-body-" + idx}>
                          <TableCell sx={{ fontSize: "12px" }}>
                            {it.prf_no}
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            <RequestStatModal
                              deptData={deptData}
                              signings={rowData.signings}
                              items={it}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }} align="center">
                            {it.office_dept}
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            {it.head_cnt}
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            {it.pay_sal}
                            {/* {phpPesoIntFormater.format(it.pay_sal)} */}
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            <Stack spacing={1}>
                              {natureReq
                                .filter((opt) =>
                                  JSON.parse(it.nature_req).includes(opt.id)
                                )
                                .map((ii, indx) => {
                                  return (
                                    <Chip
                                      disableRipple
                                      disableFocusRipple
                                      disableTouchRipple
                                      disableElevation
                                      label={ii.category_name}
                                      variant="outlined"
                                      color="default"
                                      size="small"
                                      sx={{
                                        fontSize: "12px",
                                        padding: "2px 0px",
                                        height: "auto",
                                        width: "100%",
                                        "& .MuiChip-label": {
                                          display: "block",
                                          whiteSpace: "normal",
                                        },
                                      }}
                                    />
                                  );
                                })}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            {moment(it.date_requested).format("L")}
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            {moment(it.date_needed).format("L")}
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            {it.emp_stat}
                          </TableCell>
                          <TableCell sx={{ fontSize: "12px" }}>
                            <Stack gap={1} direction="row" flexWrap={"wrap"}>
                              <Box>
                                <Link
                                  to={`view-prf/${it.id}`}
                                  target={"_blank"}
                                  rel="noopener noreferrer"
                                  sx={{ textDecoration: "none" }}
                                >
                                  <Tooltip title="View Personnel Request" arrow>
                                    <IconButton
                                      type="button"
                                      className="custom-iconbutton"
                                      color="primary"
                                    >
                                      <PreviewIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Link>
                              </Box>
                              {it.req_by_id !== null &&
                                it.avail_app_id !== null &&
                                it.rev_by_id !== null &&
                                it.approval_id !== null &&
                                (rowData.signings
                                  .filter((op) => op.id_pr_form === it.id)
                                  .some(
                                    (m) =>
                                      m.request_stat === "CLOSED" ||
                                      m.request_stat === "DISAPPROVED" ||
                                      m.request_stat === "CANCELLED"
                                  ) ? (
                                  <></>
                                ) : (
                                  <Box>
                                    <Tooltip title="CHRMD TAS" arrow>
                                      <IconButton
                                        type="button"
                                        className="custom-iconbutton"
                                        color="info"
                                        onClick={(ev) =>
                                          handleClick(ev, it, "tas")
                                        }
                                      >
                                        <FeedIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                ))}

                              {rowData.signings
                                .filter((op) => op.id_pr_form === it.id)
                                .reverse()[0].request_stat === "ON-HOLD" ? (
                                <></>
                              ) : (
                                <>
                                  {rowData.signings
                                    .filter((op) => op.id_pr_form === it.id)
                                    .reverse()[0].request_stat ===
                                  "POOLED COMPLETE" ? (
                                    <Box>
                                      <Tooltip
                                        title="Applicant interview assessment"
                                        arrow
                                      >
                                        <IconButton
                                          type="button"
                                          className="custom-iconbutton"
                                          color="secondary"
                                          onClick={(ev) =>
                                            handleClick(ev, it, "assessment")
                                          }
                                        >
                                          <ContactPageIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ) : (
                                    <></>
                                  )}
                                  {rowData.signings
                                    .filter((op) => op.id_pr_form === it.id)
                                    .reverse()[0].request_stat ===
                                  "ASSESSMENT COMPLETE" ? (
                                    <Box>
                                      <Tooltip
                                        title="Applicant selection"
                                        arrow
                                      >
                                        <IconButton
                                          type="button"
                                          className="custom-iconbutton"
                                          color="secondary"
                                          onClick={(ev) =>
                                            handleClick(ev, it, "assessment")
                                          }
                                        >
                                          <ContactPageIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ) : (
                                    <></>
                                  )}
                                  {/* ///dri ang target */}
                                  {rowData.signings
                                    .filter((op) => op.id_pr_form === it.id)
                                    .some(
                                      (m) =>
                                        m.request_stat === "SELECTION COMPLETE"
                                    ) ? (
                                    <Box>
                                      <Tooltip
                                        title="Indorsement Process"
                                        arrow
                                      >
                                        <IconButton
                                          type="button"
                                          className="custom-iconbutton"
                                          color="warning"
                                          onClick={(ev) =>
                                            handleClick(ev, it, "indorsement")
                                          }
                                        >
                                          <NoteAltIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ) : (
                                    <></>
                                  )}
                                  {rowData.signings
                                    .filter((op) => op.id_pr_form === it.id)
                                    .some(
                                      (m) =>
                                        m.request_stat ===
                                        "INDORSEMENT COMPLETE"
                                    ) ? (
                                    <Box>
                                      <Tooltip title="Document Process" arrow>
                                        <IconButton
                                          type="button"
                                          className="custom-iconbutton"
                                          color="info"
                                          onClick={(ev) =>
                                            handleClick(
                                              ev,
                                              it,
                                              "requirement",
                                              it.emp_stat
                                            )
                                          }
                                        >
                                          <AssignmentTurnedInIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </TableContainerComp>
              </Grid2>
            </Grid2>
          </Box>
        </>
      )}
      <Fragment>
        <CustomDialog
          matches={matches}
          openner={open > 0}
          handleCloseBTN={() => {
            setOpen(0);
          }}
          comptitle=""
          compSize=""
        >
          {open === 1 ? (
            <>Page Not Found</>
          ) : open === 2 ? (
            <>
              <Indorsement closeModal={handleCloseModal} data={rowData} />
            </>
          ) : open === 3 ? (
            <>
              <ProcessDocument closeModal={handleCloseModal} data={rowData} />
            </>
          ) : open === 4 ? (
            <>
              <ApplicantSelection
                closeModal={handleCloseModal}
                requestLogsList={requestLogs}
              />
            </>
          ) : open === 5 ? (
            <>
              <TasRequestStatus
                requestLogsList={requestLogs}
                setRequestLogsList={setRequestLogs}
              />
            </>
          ) : (
            <></>
          )}
        </CustomDialog>
      </Fragment>
    </Box>
  );
}
