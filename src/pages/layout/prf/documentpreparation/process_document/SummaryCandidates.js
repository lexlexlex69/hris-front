import {
  Box,
  Button,
  CircularProgress,
  Input,
  Stack,
  Tooltip,
} from "@mui/material";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Print as PrintIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { isEmptyObject } from "jquery";

import { PrfStateContext } from "../../PrfProvider";
import {
  autoCapitalizeFirstLetter,
  formatName,
  formatPositionName,
} from "../../../customstring/CustomString";
// import './style/summaryCandidates.css'
import { CheckLetterHF } from "./component";
import { useReactToPrint } from "react-to-print";
import { SearchEmployeeModal } from "../component/SearchEmployee";
import { toast } from "react-toastify";

export const SummaryCandidates = React.forwardRef((props, ref) => {
  console.log("props for summary applist", props.applicantList);
  console.log("props for summary prfdata", props.prfData);
  console.log("props for summary raterlist", props.raterList);
  console.log("props for summary raterinfo", props.raterInfo);
  console.log("props for summary head", props.letterHead);
  console.log("props for summary foot", props.letterFoot);

  const { tempReq, deptData, natureReq, posTitle } =
    useContext(PrfStateContext);
  console.log(
    "summary post",
    posTitle.categories.education.filter((opt) =>
      JSON.parse(tempReq.qs_educ_id).includes(opt.id)
    )
  );
  console.log("tempReq", tempReq);
  console.log("posTitle", posTitle);
  const [editToggler, setEditToggler] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prfInfo, setPrfInfo] = useState(null);
  const [prepBy, setPrepBy] = useState({
    name: "DUMMY NAME",
    positionDesignation: "DUMMY POSITION",
  });
  const [endorsedBy, setEndorsedBy] = useState({
    name: "DUMMY NAME",
    positionTitle: "DUMMY POSITION",
    departmentOffice: "DUMMY DEPARTMENT",
  });
  const printRef = useRef();
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setLoading(false);
    console.log(props);
    // if (!props.)
  }, []);

  useEffect(() => {
    if (tempReq) {
      const divname = tempReq.div_name ? tempReq.div_name + " - " : "";
      const secname = tempReq.sec_name ? tempReq.sec_name : "";
      let parseData = {
        position: tempReq.position_title,
        prf_no: tempReq.prf_no,
        name_div_sec: divname + secname,
        name_dept: tempReq.office_dept,
        qs_educ: posTitle.categories.education.filter((opt) =>
          JSON.parse(tempReq.qs_educ_id).includes(opt.id)
        ),
        qs_trai: posTitle.categories.training.filter((opt) =>
          JSON.parse(tempReq.qs_train_id).includes(opt.id)
        ),
        qs_expe: posTitle.categories.experience.filter((opt) =>
          JSON.parse(tempReq.qs_expe_id).includes(opt.id)
        ),
        qs_elig: posTitle.categories.eligibility.filter((opt) =>
          JSON.parse(tempReq.qs_elig_id).includes(opt.id)
        ),
      };
      setPrfInfo(parseData);
    }
  }, [tempReq, posTitle.categories]);

  const getRaterName = (data) => {
    if (props.raterInfo.length > 0) {
      let name =
        props.raterInfo.filter((ob) => ob.emp_id === data)[0].emp_lname +
        ", " +
        props.raterInfo.filter((ob) => ob.emp_id === data)[0].emp_fname;
      return name;
    } else {
      return;
    }
  };

  const handleEdit = () => {
    setEditToggler(true);
  };
  // const handlePrint = useReactToPrint({
  //     content: () => printRef.current,
  //     documentTitle: 'Summary of Candidates',
  //     onAfterPrint: () => setEditToggler(false)
  // })

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Summary of Candidates",
    onAfterPrint: () => setEditToggler(false),
    // pageStyle: `
    //   @page {
    //     size: auto;
    //     margin: 0;
    //   }
    //   @media print {
    //     body {
    //       margin: 0;
    //     }
    //     .print-content {
    //       position: relative;
    //       padding-bottom: 100px; /* Adjust this value to control the space between content and footer */
    //     }
    //     .print-footer {
    //       position: absolute;
    //       bottom: 0;
    //       width: 100%;
    //     }
    //   }
    // `
  });

  const handleSave = () => {
    // set to process the data for the prf

    setEditToggler(false);
  };
  const handleCancel = () => {
    setEditToggler(false);
  };

  const handleSearch = (data) => {
    var cname = formatName(data.fname, data.mname, data.lname, data.extname, 0);
    if (open === "pr") {
      let position = formatPositionName(data.position_name);
      console.log(position);
      setPrepBy((prev) => ({
        name: cname,
        positionDesignation: position.props.children[0],
        empid: data.id,
        fname: data.fname,
        mname: data.mname,
        lname: data.lname,
        extname: data.extname,
      }));
      toast.success("Signatory added successfully");
    } else if (open === "en") {
      setEndorsedBy((prev) => ({
        name: cname,
        positionTitle: data.position_name,
        departmentOffice: data.dept_title,
        empid: data.id,
        fname: data.fname,
        mname: data.mname,
        lname: data.lname,
        extname: data.extname,
      }));
      toast.success("Signatory added successfully");
    } else {
      toast.error("An error occurred");
    }
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size="30px" />
        </Box>
      ) : (
        <>
          {editToggler ? (
            <>
              <Box sx={{ display: "flex", margin: "1rem 0", gap: "0.5rem" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  {" "}
                  Save{" "}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  {" "}
                  Cancel{" "}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", margin: "1rem 0", gap: "0.5rem" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  {" "}
                  Edit{" "}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                >
                  {" "}
                  Print{" "}
                </Button>
              </Box>
            </>
          )}

          <Stack sx={{ display: "flex", gap: "0.5rem", flexDirection: "row" }}>
            <Tooltip title="Signatories" placement="top" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<SettingsIcon />}
                onClick={() => setOpen("pr")}
              >
                {" "}
                Prepared By{" "}
              </Button>
            </Tooltip>
            <Tooltip title="Signatories" placement="top" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<SettingsIcon />}
                onClick={() => setOpen("en")}
              >
                {" "}
                Endorsed By{" "}
              </Button>
            </Tooltip>
          </Stack>

          <SearchEmployeeModal
            open={open !== null}
            setOpen={() => setOpen(null)}
            setStateData={handleSearch}
          />

          <Box
            ref={printRef}
            sx={{
              display: "block",
              minHeight: "100vh",
              width: "100%",
              overflowX: "scroll",
              position: "relative",
            }}
          >
            {!isEmptyObject(props.applicantList) && (
              <table style={{ position: "relative" }}>
                <thead>
                  <CheckLetterHF
                    letterData={props.letterHead}
                    classname={"print-header"}
                    imgstyle={{ width: "100%" }}
                    letterName={"Letter head"}
                  />
                </thead>
                <tbody>
                  <Box
                    className="print-content"
                    sx={{ padding: "0 4rem 1rem 4rem" }}
                  >
                    <Box sx={{ fontSize: "13px", fontFamily: "Cambria" }}>
                      <Box
                        textAlign={"center"}
                        sx={{
                          fontWeight: "bold",
                          padding: "10px 0px",
                          fontSize: "14px",
                        }}
                      >
                        {" "}
                        SUMMARY OF SHORTLISTED CANDIDATES{" "}
                      </Box>
                      <Box sx={{ marginBottom: "2rem" }}>
                        <table style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th style={{ width: "24%", padding: "0px" }}></th>
                              <th style={{ width: "40%", padding: "0px" }}></th>
                              <th style={{ width: "20%", padding: "0px" }}></th>
                              <th style={{ width: "20%", padding: "0px" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {!isEmptyObject(prfInfo) ? (
                              <>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Position/Job Title{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={1}
                                  >
                                    {" "}
                                    {prfInfo.position}{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    PRF Number{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    {prfInfo.prf_no}{" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Division - Section{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={3}
                                  >
                                    {prfInfo.name_div_sec}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Department{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={3}
                                  >
                                    {" "}
                                    {autoCapitalizeFirstLetter(
                                      String(prfInfo.name_dept)
                                    )}{" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Qualification Standards{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={1}
                                  >
                                    {" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Education:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    dfdf
                                    {prfInfo.qs_educ.length > 0 &&
                                      prfInfo.qs_educ.map(
                                        (i, idx) => i.category
                                      )}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Training:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {prfInfo.qs_trai.length > 0 &&
                                      prfInfo.qs_trai.map(
                                        (i, idx) => i.category
                                      )}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Experience:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {prfInfo.qs_expe.length > 0 &&
                                      prfInfo.qs_expe.map(
                                        (i, idx) => i.category
                                      )}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Eligibility:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {prfInfo.qs_elig.length > 0 &&
                                      prfInfo.qs_elig.map(
                                        (i, idx) => i.category
                                      )}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Position/Job Title{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={1}
                                  >
                                    {" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    PRf Number{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Division - Section{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={3}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Department{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={3}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Qualification Standards{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Education:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Training:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Experience:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "end",
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                    Eligibility:{" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {" "}
                                  </td>
                                  <td
                                    style={{
                                      borderSpacing: "0",
                                      border: "1px solid black",
                                      padding: "4px 8px",
                                    }}
                                    colSpan={2}
                                  >
                                    {" "}
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </Box>
                      <Box>
                        {!isEmptyObject(props.applicantList) && (
                          <table style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <td
                                  style={{
                                    backgroundColor: "rgb(217,217,217)",
                                    borderSpacing: "0",
                                    border: "1px solid black",
                                    padding: "4px 8px",
                                    width: "50%",
                                    textAlign: "center",
                                    fontWeight: "700",
                                  }}
                                >
                                  {" "}
                                  CANDIDATE DETAILS{" "}
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "rgb(217,217,217)",
                                    borderSpacing: "0",
                                    border: "1px solid black",
                                    padding: "4px 8px",
                                    width: "50%",
                                    textAlign: "center",
                                    fontWeight: "700",
                                  }}
                                >
                                  {" "}
                                  GENERAL FINDINGS{" "}
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {props.applicantList.length <= 0 ? (
                                <>
                                  <tr>
                                    <td
                                      style={{
                                        borderSpacing: "0",
                                        border: "1px solid black",
                                        padding: "2px 8px 2px",
                                        verticalAlign: "top",
                                      }}
                                      rowSpan={2}
                                    >
                                      <Stack spacing={2}>
                                        <Box>Name:</Box>
                                        <Box>Education:</Box>
                                        <Box>Trainings:</Box>
                                        <Box>Eligibility:</Box>
                                      </Stack>
                                    </td>
                                    <td
                                      style={{
                                        borderSpacing: "0",
                                        border: "1px solid black",
                                        padding: "2px 8px 2px",
                                        verticalAlign: "top",
                                      }}
                                    >
                                      <Box sx={{ fontWeight: "600" }}>
                                        {" "}
                                        Assessment:{" "}
                                      </Box>
                                      <Box> </Box>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderSpacing: "0",
                                        border: "1px solid black",
                                        padding: "2px 8px 2px",
                                        verticalAlign: "top",
                                      }}
                                    >
                                      <Box sx={{ fontWeight: "600" }}>
                                        {" "}
                                        Recommended Action:{" "}
                                      </Box>
                                      <Box> </Box>
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  {props.applicantList.map((i, index) => (
                                    <Fragment key={i.id + index}>
                                      <tr
                                        style={
                                          index === 2
                                            ? { pageBreakBefore: "always" }
                                            : index - 2 === 3
                                            ? { pageBreakBefore: "always" }
                                            : {}
                                        }
                                      >
                                        <td
                                          style={{
                                            borderSpacing: "0",
                                            border: "1px solid black",
                                            padding: "2px 8px 2px",
                                            verticalAlign: "top",
                                          }}
                                          rowSpan={2}
                                        >
                                          <Stack spacing={1}>
                                            <Box>
                                              Name:{" "}
                                              {`${autoCapitalizeFirstLetter(
                                                i.lname
                                              )}, ${autoCapitalizeFirstLetter(
                                                i.fname
                                              )} ${
                                                i.mname
                                                  ? autoCapitalizeFirstLetter(
                                                      i.mname
                                                    )
                                                  : "N/A"
                                              }`}
                                            </Box>
                                            <Box>
                                              Education:
                                              <ul style={{ marginBottom: "0" }}>
                                                <li>
                                                  {!i.education ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      {i.education.length >
                                                      0 ? (
                                                        <>
                                                          {i.education[0]
                                                            .degreecourse
                                                            ? autoCapitalizeFirstLetter(
                                                                i.education[0]
                                                                  .degreecourse
                                                              )
                                                            : "None"}
                                                          {i.education[0]
                                                            .nschool
                                                            ? " - " +
                                                              autoCapitalizeFirstLetter(
                                                                i.education[0]
                                                                  .nschool
                                                              )
                                                            : " None"}
                                                          {i.education[0]
                                                            .gradelevel
                                                            ? ", " +
                                                              autoCapitalizeFirstLetter(
                                                                i.education[0]
                                                                  .gradelevel
                                                              )
                                                            : " None"}
                                                          {i.education[0]
                                                            .highest
                                                            ? ", " +
                                                              i.education[0]
                                                                .highest
                                                            : ""}
                                                        </>
                                                      ) : (
                                                        "N/A"
                                                      )}
                                                    </>
                                                  )}
                                                </li>
                                              </ul>
                                            </Box>
                                            <Box>
                                              Trainings:
                                              <ul style={{ marginBottom: "0" }}>
                                                <li>
                                                  {!i.work_experience ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      {i.work_experience
                                                        .length > 0 ? (
                                                        <>
                                                          {i.work_experience[0]
                                                            .positiontitle
                                                            ? autoCapitalizeFirstLetter(
                                                                i
                                                                  .work_experience[0]
                                                                  .positiontitle
                                                              )
                                                            : "None"}
                                                          {i.work_experience[0]
                                                            .agency
                                                            ? " - " +
                                                              autoCapitalizeFirstLetter(
                                                                i
                                                                  .work_experience[0]
                                                                  .agency
                                                              )
                                                            : " None"}
                                                        </>
                                                      ) : (
                                                        "N/A"
                                                      )}
                                                    </>
                                                  )}
                                                </li>
                                              </ul>
                                            </Box>
                                            <Box>
                                              Eligibility:
                                              <ul style={{ marginBottom: "0" }}>
                                                <li>
                                                  {!i.eligibility ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      {i.eligibility.length >
                                                      0 ? (
                                                        <>
                                                          {i.eligibility[0]
                                                            .title
                                                            ? autoCapitalizeFirstLetter(
                                                                i.eligibility[0]
                                                                  .title
                                                              )
                                                            : "None"}
                                                          {i.eligibility[0]
                                                            .rating
                                                            ? " - " +
                                                              i.eligibility[0]
                                                                .rating
                                                            : " None"}
                                                          {i.eligibility[0]
                                                            .licenseno
                                                            ? ", " +
                                                              i.eligibility[0]
                                                                .licenseno
                                                            : " None"}
                                                        </>
                                                      ) : (
                                                        "N/A"
                                                      )}
                                                    </>
                                                  )}
                                                </li>
                                              </ul>
                                            </Box>
                                          </Stack>
                                        </td>
                                        <td
                                          style={{
                                            borderSpacing: "0",
                                            border: "1px solid black",
                                            padding: "2px 8px 2px",
                                            verticalAlign: "top",
                                          }}
                                        >
                                          <Box sx={{ fontWeight: "600" }}>
                                            {" "}
                                            Assessment:{" "}
                                          </Box>
                                          <Box>
                                            {props.raterList.length > 0 ? (
                                              <ul style={{ marginBottom: "0" }}>
                                                {props.raterList
                                                  .filter((h) => h.id === i.id)
                                                  .map((m) => (
                                                    <li>
                                                      {autoCapitalizeFirstLetter(
                                                        getRaterName(
                                                          m.rater_emp_id
                                                        )
                                                      )}{" "}
                                                      -{" "}
                                                      {m.potential_strengths ||
                                                        "None"}
                                                      , {m.red_flags || " None"}
                                                    </li>
                                                  ))}
                                              </ul>
                                            ) : (
                                              <> None </>
                                            )}
                                          </Box>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            borderSpacing: "0",
                                            border: "1px solid black",
                                            padding: "2px 8px 2px",
                                            verticalAlign: "top",
                                          }}
                                        >
                                          <Box sx={{ fontWeight: "600" }}>
                                            {" "}
                                            Recommended Action:{" "}
                                          </Box>
                                          <Box>
                                            {props.raterList.length > 0 ? (
                                              <ul style={{ marginBottom: "0" }}>
                                                {props.raterList
                                                  .filter(
                                                    (h) =>
                                                      h.id === i.id &&
                                                      h.rater_remark ===
                                                        "selected"
                                                  )
                                                  .map((m) => (
                                                    <li>
                                                      {autoCapitalizeFirstLetter(
                                                        getRaterName(
                                                          m.rater_emp_id
                                                        )
                                                      )}{" "}
                                                      -{" "}
                                                      {m.hiring_recom
                                                        ? m.hiring_recom
                                                        : "No comment"}
                                                      , {m.overall_recom}
                                                    </li>
                                                  ))}
                                              </ul>
                                            ) : (
                                              <> None </>
                                            )}
                                          </Box>
                                        </td>
                                      </tr>
                                    </Fragment>
                                  ))}
                                </>
                              )}
                            </tbody>
                          </table>
                        )}
                      </Box>
                      <br />

                      <Box>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                          }}
                        >
                          <Box>
                            <Box>Prepared by:</Box>
                            <Box sx={{ height: "3rem" }}></Box>
                            <Box textAlign={"center"} sx={{ width: "75%" }}>
                              <Box
                                sx={{
                                  borderBottom: "1px solid black",
                                  lineHeight: "12px",
                                }}
                              >
                                {editToggler ? (
                                  <Input
                                    value={prepBy.name}
                                    onChange={(e) =>
                                      setPrepBy({
                                        ...prepBy,
                                        name: e.target.value,
                                      })
                                    }
                                    sx={{
                                      padding: "5px",
                                      fontSize: "10px",
                                      width: "100%",
                                    }}
                                  />
                                ) : (
                                  prepBy.name.toUpperCase()
                                )}
                              </Box>
                              <Box
                                sx={{
                                  lineHeight: 1,
                                  fontSize:
                                    endorsedBy.positionTitle.length > 50
                                      ? "9px"
                                      : "10px",
                                }}
                              >
                                {prepBy.positionDesignation.toUpperCase()}
                              </Box>
                            </Box>
                          </Box>
                          <Box>
                            <Box>Endorsed by:</Box>
                            <Box sx={{ height: "3rem" }}></Box>
                            <Box textAlign={"center"} sx={{ width: "90%" }}>
                              <Box
                                sx={{
                                  borderBottom: "1px solid black",
                                  lineHeight: "12px",
                                }}
                              >
                                {editToggler ? (
                                  <Input
                                    value={endorsedBy.name}
                                    onChange={(e) =>
                                      setEndorsedBy({
                                        ...endorsedBy,
                                        name: e.target.value,
                                      })
                                    }
                                    sx={{
                                      padding: "5px",
                                      fontSize: "10px",
                                      width: "100%",
                                    }}
                                  />
                                ) : (
                                  endorsedBy.name.toUpperCase()
                                )}
                              </Box>
                              <Box
                                sx={{
                                  fontSize:
                                    endorsedBy.positionTitle.length > 50
                                      ? "9px"
                                      : "10px",
                                }}
                              >
                                <Box sx={{ lineHeight: 1 }}>
                                  {endorsedBy.positionTitle.toUpperCase()}
                                </Box>
                                <Box sx={{ lineHeight: 1 }}>
                                  {endorsedBy.departmentOffice}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </tbody>
                <tfoot>
                  <CheckLetterHF
                    letterData={props.letterFoot}
                    classname={"print-footer"}
                    imgstyle={{ width: "100%" }}
                    letterName={"Letter foot"}
                  />
                </tfoot>
              </table>
            )}
          </Box>
        </>
      )}
    </>
  );
});

export default SummaryCandidates;
