import { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { PrfStateContext } from "../../PrfProvider";
import {
  reqSignedByHeadDept,
  reqStatusApi,
  requestSignedDetails,
} from "../../axios/prfRequest";
import { toast } from "react-toastify";
import moment from "moment";
import Swal from "sweetalert2";

import DummySign from "../../../../../assets/img/dummy/sample_signature.png";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PageLoader from "../export_components/PageLoader";

const color = red[500];
const colorUp = green[700];
const colorDown = red[700];

const MyCustomDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  minHeight: "100%",
  // "& .MuiStack-root": {
  //   height: "100%",
  //   minHeight: "100%",
  // },
}));

const MyCustomCard = styled("div")(({ theme }) => ({
  border: "1px solid #ADADAD",
  padding: "5px",
  borderRadius: "5px",
  height: "10rem",
  width: "100%",
  // maxWidth: "530px",
  position: "relative",
}));

const MyCustomCardText = styled("i")(({ theme }) => ({
  color: "#706F6F",
  position: "absolute",
  top: "-14px",
  left: "10px",
  padding: "0px 5px",
  backgroundColor: "#fff",
  display: "block",
}));

const CustomStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "end",
  height: "100%",
}));

const skele = [
  { id: 1, variant: "rectangular", width: 0, height: 200, sizing: 6 },
  { id: 2, variant: "rectangular", width: 0, height: 200, sizing: 6 },
  { id: 3, variant: "rectangular", width: 0, height: 200, sizing: 6 },
  { id: 4, variant: "rectangular", width: 0, height: 200, sizing: 6 },
];

function SignRequestForm({ handleClosingButton, handleRelD }) {
  const {
    userId,
    requestDataForm,
    setRequestDataForm,
    signedBy,
    setSignedBy,
    requestSignsViewer,
    dateToday,
    tempStorage,
    signedByHeadReq,
    setSignedByHeadReq,
    signedByAvail,
    setSignedByAvail,
    signedByRevBy,
    setSignedByRevBy,
    signedByAppvl,
    setSignedByAppvl,
    tempt,
    setTempt,
    signPermB,
    signPermHR,
    signPermApproval,
  } = useContext(PrfStateContext);
  const [rsFilterData, setRSFilterData] = useState([]);
  const [reqStatChoices, setReqStatChoices] = useState([]);
  const [reqStatBtn, setReqStatBtn] = useState("");
  const [showRemark, setShowRemark] = useState(false);
  const [addRemark, setAddRemark] = useState("");
  const [loading, setLoading] = useState(true);
  var payload = {};

  const handleReqSignStat = (ev) => {
    if (
      tempStorage.tempRequester === "requester" ||
      tempStorage.tempRequester === "availability" ||
      tempStorage.tempRequester === "reviewed" ||
      tempStorage.tempRequester === "approved"
    ) {
      if (signedBy[tempStorage.tempRequester]) {
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
            console.log(tempt, userId);
            reqSignedByHeadDept(userId, tempt)
              .then((response) => {
                if (response.data.status === 200) {
                  console.log(response);
                  toast.success(response.data.message);
                  handleClosingButton();
                  handleRelD();
                }
                if (response.data.status === 500) {
                  toast.error(response.data.message);
                }
              })
              .catch((response) => {
                toast.error(response.message);
              });
          }
        });
      } else {
        if (!reqStatBtn) {
          toast.error("Ops, something went wrong!");
        } else {
          // console.log(tempt)
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
              console.log(tempt);
              reqSignedByHeadDept(userId, tempt)
                .then((response) => {
                  console.log(response);
                  toast.success(response.data.message);
                  handleClosingButton();
                  handleRelD();
                })
                .catch((response) => {
                  console.log(response);
                  toast.error(response.message);
                });
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    console.log("useEffect1 From signRequest");
    setTempt({ ...tempt, remarks: requestDataForm.remarks });
  }, [requestDataForm.remarks]);
  useEffect(() => {
    console.log("useEffect2 From signRequest");
    setTempt({ ...tempt, add_remark: addRemark });
  }, [addRemark]);

  useEffect(() => {
    if (typeof requestDataForm.id_pr_form === "number") {
      var result = fetchSignedDetails({
        id_pr_form: requestDataForm.id_pr_form,
      });
      result
        .then((r) => {
          const res = r.data;
          console.log(r);
          setSignedByHeadReq((draft) => {
            draft.office_dept = res.req_by_data.office_dept;
            draft.emp_name = res.req_by_data.emp_name;
            draft.date = res.req_by_data.date;
            draft.time = res.req_by_data.time;
            draft.esig = res.req_by_data.esig;
            draft.trig = res.req_by_data.trig;
            draft.request_stat = res.req_by_data.request_stat;
          });
          setSignedByAvail((draft) => {
            draft.office_dept = res.avail_app_data.office_dept;
            draft.emp_name = res.avail_app_data.emp_name;
            draft.date = res.avail_app_data.date;
            draft.time = res.avail_app_data.time;
            draft.request_stat = res.avail_app_data.request_stat;
            draft.add_remarks = res.avail_app_data.add_remarks;
            draft.esig = res.avail_app_data.esig;
            draft.trig = res.avail_app_data.trig;
          });
          setSignedByRevBy((draft) => {
            draft.office_dept = res.rev_by_data.office_dept;
            draft.emp_name = res.rev_by_data.emp_name;
            draft.date = res.rev_by_data.date;
            draft.time = res.rev_by_data.time;
            draft.request_stat = res.rev_by_data.request_stat;
            draft.add_remarks = res.rev_by_data.add_remarks;
            draft.esig = res.rev_by_data.esig;
            draft.trig = res.rev_by_data.trig;
          });
          setSignedByAppvl((draft) => {
            draft.office_dept = res.approval_data.office_dept;
            draft.emp_name = res.approval_data.emp_name;
            draft.date = res.approval_data.date;
            draft.time = res.approval_data.time;
            draft.esig = res.approval_data.esig;
            draft.trig = res.approval_data.trig;
            draft.pos = res.approval_data.pos;
            draft.request_stat = res.approval_data.request_stat;
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [requestDataForm.id_pr_form]);

  useEffect(() => {
    reqStatChoices
      .filter((obj) => obj.choices === reqStatBtn)
      .map((filtered) => setShowRemark(filtered.remark_bool));
    console.log("useEffect3 From signRequest");
    payload.head_signer = null;
    if (reqStatBtn === "APPROVED") {
      if (signPermB) {
        payload.head_signer = "CBD";
      }
      if (signPermHR) {
        payload.head_signer = "CHRMD";
      }
      if (signPermApproval) {
        payload.head_signer = "LEADER";
      }
      payload.bool = true;
      payload.name = userId;
      payload.request_stat = reqStatBtn;
      payload.date = dateToday;
      payload.time = moment().format("LT");
      payload.dept_code = tempStorage.dept_code;
      payload.remarks = requestDataForm.remarks;
      payload.id_pr_form = requestDataForm.id_pr_form;
      payload.prf_no = requestDataForm.prf_no;
      payload.add_remark = null;
      payload.esig = null;

      setTempt(payload);
      setSignedBy({ ...signedBy, [tempStorage.tempRequester]: true });
    } else if (reqStatBtn === "DISAPPROVED") {
      if (signPermB) {
        payload.head_signer = "CBD";
      }
      if (signPermHR) {
        payload.head_signer = "CHRMD";
      }
      if (signPermApproval) {
        payload.head_signer = "LEADER";
      }
      payload.bool = true;
      payload.name = userId;
      payload.request_stat = reqStatBtn;
      payload.date = dateToday;
      payload.time = moment().format("LT");
      payload.dept_code = tempStorage.dept_code;
      payload.remarks = requestDataForm.remarks;
      payload.id_pr_form = requestDataForm.id_pr_form;
      payload.prf_no = requestDataForm.prf_no;
      payload.add_remark = null;
      payload.esig = null;

      setTempt(payload);
      setSignedBy({ ...signedBy, [tempStorage.tempRequester]: true });
    } else {
      payload.bool = false;
      payload.add_remark = addRemark;
      payload.name = userId;
      payload.request_stat = reqStatBtn;
      payload.date = dateToday;
      payload.time = moment().format("LT");
      payload.dept_code = tempStorage.dept_code;
      payload.remarks = requestDataForm.remarks;
      payload.id_pr_form = requestDataForm.id_pr_form;
      payload.prf_no = requestDataForm.prf_no;
      payload.esig = null;

      setTempt(payload);
      setSignedBy({ ...signedBy, [tempStorage.tempRequester]: false });
    }
  }, [reqStatBtn]);

  useEffect(() => {
    if (tempStorage.tempRequester === "requester") {
      const filterData = reqStatChoices.filter((o) => o.choices === "APPROVED");
      // console.log(filterData)
      setRSFilterData(filterData);
    } else {
      setRSFilterData(reqStatChoices);
    }
  }, [reqStatChoices]);

  useEffect(() => {
    fetchChoicesStat();
  }, []);
  const fetchChoicesStat = async () => {
    try {
      const response = await reqStatusApi(userId);
      setReqStatChoices(response.data.data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return loading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        margin: "4rem 0rem",
        width: "100%",
      }}
    >
      <Container>
        <PageLoader skele={skele} spacing={1} />
      </Container>
    </Box>
  ) : (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <TextField
            id="prf-no-id"
            variant="outlined"
            sx={{ float: "right" }}
            label="PRF Number"
            value={requestDataForm.prf_no}
          />
        </Box>
      </Grid>
      {requestSignsViewer.req_by_id && (
        <>
          <Grid
            item
            xs={12}
            lg={
              requestSignsViewer.approval_id
                ? 6
                : requestSignsViewer.rev_by_id
                ? 6
                : requestSignsViewer.avail_app_id
                ? 6
                : requestSignsViewer.req_by_id
                ? 12
                : 6
            }
          >
            <SignComp forLabel="Requested by">
              {signedBy[tempStorage.tempRequester] &&
                tempStorage.tempRequester === "requester" && (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ margin: "auto" }}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "70px" }}
                      ></Stack>
                      <FormLabel>
                        {tempStorage.emp_name +
                          " " +
                          tempt.date +
                          "/" +
                          tempt.time}
                      </FormLabel>
                    </Box>
                  </Box>
                )}
              {signedByHeadReq.trig && (
                <>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ margin: "auto" }}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "70px" }}
                      >
                        {/* <img src={signedByHeadReq.esig} loading="lazy" /> */}
                        {/* {console.log(signedByHeadReq)} */}
                        {signedByHeadReq.request_stat === "APPROVED" ? (
                          <ThumbUpIcon sx={{ color: colorUp }} />
                        ) : signedByHeadReq.request_stat === "DISAPPROVED" ? (
                          <ThumbDownIcon sx={{ color: colorDown }} />
                        ) : (
                          <Typography variant="body1" fontWeight={600}>
                            {" "}
                            {signedByHeadReq.request_stat}{" "}
                          </Typography>
                        )}
                      </Stack>
                      <FormLabel>
                        <Typography variant="body1" sx={{ color: "#000" }}>
                          {signedByHeadReq.emp_name +
                            " " +
                            signedByHeadReq.date +
                            "/" +
                            signedByHeadReq.time}
                        </Typography>
                      </FormLabel>
                    </Box>
                  </Box>
                </>
              )}
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  fontWeight: "900",
                  fontSize: "14px",
                  lineHeight: "0.6",
                }}
              >
                {signedByHeadReq.trig ? (
                  <>{signedByHeadReq.office_dept}</>
                ) : (
                  <>
                    {signedBy[tempStorage.tempRequester] &&
                    tempStorage.tempRequester === "requester" ? (
                      <> {tempStorage.office_dept} </>
                    ) : (
                      <> HEAD OF THE REQUESTING OFFICE / DEPARTMENT </>
                    )}
                  </>
                )}
              </Typography>
            </SignComp>
          </Grid>
        </>
      )}
      {requestSignsViewer.avail_app_id && (
        <>
          <Grid
            item
            xs={12}
            lg={
              requestSignsViewer.approval_id
                ? 6
                : requestSignsViewer.rev_by_id
                ? 6
                : requestSignsViewer.avail_app_id
                ? 6
                : 12
            }
          >
            <SignComp forLabel="Availability of Appropriation">
              {signedBy[tempStorage.tempRequester] &&
                tempStorage.tempRequester === "availability" && (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ margin: "auto" }}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "70px" }}
                      ></Stack>
                      <FormLabel>
                        {tempStorage.emp_name +
                          " " +
                          tempt.date +
                          "/" +
                          tempt.time}
                      </FormLabel>
                    </Box>
                  </Box>
                )}
              {signedByAvail.trig && (
                <>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ margin: "auto" }}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "70px" }}
                      >
                        {/* <img src={signedByAvail.esig} loading="lazy" /> */}
                        {/* {console.log(signedByAvail.request_stat)} */}
                        {signedByAvail.request_stat === "APPROVED" ? (
                          <ThumbUpIcon sx={{ color: colorUp }} />
                        ) : signedByAvail.request_stat === "DISAPPROVED" ? (
                          <ThumbDownIcon sx={{ color: colorDown }} />
                        ) : (
                          <Typography variant="body1" fontWeight={600}>
                            {" "}
                            {signedByAvail.request_stat}{" "}
                          </Typography>
                        )}
                      </Stack>
                      <FormLabel>
                        <Typography variant="body1" sx={{ color: "#000" }}>
                          {signedByAvail.emp_name +
                            " " +
                            signedByAvail.date +
                            "/" +
                            signedByAvail.time}
                        </Typography>
                      </FormLabel>
                    </Box>
                  </Box>
                </>
              )}
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  fontWeight: "900",
                  fontSize: "14px",
                  lineHeight: "0.6",
                }}
              >
                {signedByAvail.trig ? (
                  <>{signedByAvail.office_dept}</>
                ) : (
                  <>
                    {signedBy[tempStorage.tempRequester] &&
                    tempStorage.tempRequester === "availability" ? (
                      <> {tempStorage.office_dept} </>
                    ) : (
                      <> CITY BUDGET OFFICER </>
                    )}
                  </>
                )}
              </Typography>
            </SignComp>
          </Grid>
        </>
      )}
      {requestSignsViewer.rev_by_id && (
        <>
          <Grid
            item
            xs={12}
            lg={
              requestSignsViewer.approval_id
                ? 6
                : requestSignsViewer.rev_by_id
                ? 12
                : 6
            }
          >
            <SignComp forLabel="Reviewed by">
              {signedBy[tempStorage.tempRequester] &&
                tempStorage.tempRequester === "reviewed" && (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ margin: "auto" }}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "70px" }}
                      ></Stack>
                      <FormLabel>
                        {tempStorage.emp_name +
                          " " +
                          tempt.date +
                          "/" +
                          tempt.time}
                      </FormLabel>
                    </Box>
                  </Box>
                )}
              {signedByRevBy.trig && (
                <>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ margin: "auto" }}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "70px" }}
                      >
                        {/* <img src={signedByRevBy.esig} loading="lazy" /> */}
                        {/* {console.log(signedByRevBy.request_stat)} */}
                        {signedByRevBy.request_stat === "APPROVED" ? (
                          <ThumbUpIcon sx={{ color: colorUp }} />
                        ) : signedByRevBy.request_stat === "DISAPPROVED" ? (
                          <ThumbDownIcon sx={{ color: colorDown }} />
                        ) : (
                          <Typography variant="body1" fontWeight={600}>
                            {" "}
                            {signedByRevBy.request_stat}{" "}
                          </Typography>
                        )}
                      </Stack>
                      <FormLabel>
                        <Typography variant="body1" sx={{ color: "#000" }}>
                          {signedByRevBy.emp_name +
                            " " +
                            signedByRevBy.date +
                            "/" +
                            signedByRevBy.time}
                        </Typography>
                      </FormLabel>
                    </Box>
                  </Box>
                </>
              )}
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  fontWeight: "900",
                  fontSize: "14px",
                  lineHeight: "0.6",
                }}
              >
                CITY HUMAN RESOURCE MANAGEMENT OFFICER
              </Typography>
              {signedByRevBy.trig ? (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      textAlign: "center",
                      marginTop: "0px",
                      fontSize: "13px",
                    }}
                  >
                    {signedByRevBy.office_dept}
                  </Typography>
                </>
              ) : (
                <>
                  {signedBy[tempStorage.tempRequester] &&
                  tempStorage.tempRequester === "reviewed" ? (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textAlign: "center",
                          marginTop: "0px",
                          fontSize: "13px",
                        }}
                      >
                        {tempStorage.office_dept}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textAlign: "center",
                          marginTop: "0px",
                          fontSize: "13px",
                        }}
                      >
                        City Human Resource Management Department (CHRMD)
                      </Typography>
                    </>
                  )}
                </>
              )}
            </SignComp>
          </Grid>
        </>
      )}
      {requestSignsViewer.approval_id && (
        <>
          <Grid item xs={12} lg={6}>
            <SignComp forLabel="Approval">
              {signedBy[tempStorage.tempRequester] &&
                tempStorage.tempRequester === "approved" && (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ margin: "auto" }}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "70px" }}
                      ></Stack>
                      <FormLabel>
                        <Typography variant="body1" sx={{ color: "#000" }}>
                          {tempStorage.emp_name +
                            " " +
                            tempt.date +
                            "/" +
                            tempt.time}
                        </Typography>
                      </FormLabel>
                    </Box>
                  </Box>
                )}
              {signedByAppvl.trig ? (
                <>
                  <Box>
                    {/* <img src={signedByAppvl.esig} loading="lazy" /> */}
                    {/* {console.log(signedByAppvl.request_stat)} */}
                    {signedByAppvl.request_stat === "APPROVED" ? (
                      <ThumbUpIcon sx={{ colorUp }} />
                    ) : signedByAppvl.request_stat === "DISAPPROVED" ? (
                      <ThumbDownIcon sx={{ colorDown }} />
                    ) : (
                      <Typography variant="body1" fontWeight={600}>
                        {" "}
                        {signedByAppvl.request_stat}{" "}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: "center",
                      fontWeight: "900",
                      fontSize: "14px",
                      lineHeight: "0.6",
                    }}
                  >
                    {signedByAppvl.pos}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      textAlign: "center",
                      marginTop: "0px",
                      fontSize: "13px",
                    }}
                  >
                    {signedByAppvl.office_dept}
                  </Typography>
                </>
              ) : (
                <>
                  {signedBy[tempStorage.tempRequester] &&
                  tempStorage.tempRequester === "approved" ? (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textAlign: "center",
                          fontWeight: "900",
                          fontSize: "14px",
                          lineHeight: "0.6",
                        }}
                      >
                        {tempStorage.pos}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textAlign: "center",
                          marginTop: "0px",
                          fontSize: "13px",
                        }}
                      >
                        {tempStorage.office_dept}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textAlign: "center",
                          fontWeight: "900",
                          fontSize: "14px",
                          lineHeight: "0.6",
                        }}
                      >
                        CITY MAYOR / CITY VICE MAYOR
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textAlign: "center",
                          marginTop: "0px",
                          fontSize: "13px",
                        }}
                      >
                        Office of the City Mayor (OCM) / Office of the City Vice
                        Mayor (OCVM)
                      </Typography>
                    </>
                  )}
                </>
              )}
            </SignComp>
          </Grid>
        </>
      )}
      <Grid item xs={12} mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth>
              <FormLabel>
                <Typography variant="h5" sx={{ fontWeight: "900" }}>
                  Remarks:
                </Typography>
              </FormLabel>
              <TextField
                value={requestDataForm.remarks}
                onChange={(ev) =>
                  setRequestDataForm((draft) => {
                    draft.remarks = ev.target.value;
                  })
                }
                mt={1}
                variant="outlined"
                multiline={true}
                rows={4}
                maxRows={4}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Request Status</FormLabel>
                <Select
                  variant="outlined"
                  value={reqStatBtn}
                  onChange={(ev) => setReqStatBtn(ev.target.value)}
                >
                  {rsFilterData.map((value, index) => (
                    <MenuItem
                      key={"req-stat-menu-" + index}
                      value={value.choices}
                    >
                      {value.choices}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {showRemark === 1 && (
                <FormControl fullWidth>
                  <TextField
                    value={addRemark}
                    onChange={(ev) => setAddRemark(ev.target.value)}
                    label="Remarks for request status"
                    mt={1}
                    variant="outlined"
                    multiline={true}
                    rows={3}
                    maxRows={6}
                  />
                </FormControl>
              )}
              <Box>
                <Button
                  variant="contained"
                  sx={{ float: "right" }}
                  onClick={(ev) => {
                    handleReqSignStat(ev);
                  }}
                >
                  {" "}
                  Submit{" "}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function SignComp({ children, forLabel }) {
  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Box sx={{ width: "535px" }}>
        <MyCustomCard>
          <MyCustomCardText>{forLabel}</MyCustomCardText>
          <CustomStack>{children}</CustomStack>
        </MyCustomCard>
        {/* <FormHelperText sx={{ color: color }}>
                {errors.errReqBy}
            </FormHelperText> */}
      </Box>
    </Stack>
  );
}

export const fetchSignedDetails = async (data) => {
  try {
    const response = await requestSignedDetails(data);
    return response;
  } catch (response) {
    toast.error(response.message);
  }
};

export default SignRequestForm;
