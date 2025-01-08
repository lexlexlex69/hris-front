import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import logo from "../../../../../assets/img/bbb.png";
import moment from "moment";
import {
  formatName,
  formatNameAbbreviation,
  formatPositionName,
} from "../../../customstring/CustomString";
import axios from "axios";
import { Check, Print as PrintIcon } from "@mui/icons-material";
import { isEmptyObject } from "jquery";
import { useReactToPrint } from "react-to-print";
import { CheckLetterHF } from "./component";

export const AtrDocument = React.forwardRef((props, ref) => {
  const [editToggler, setEditToggler] = useState(false);
  const [editableContent, setEditableContent] = useState({});
  const testphpFormatComma = new Intl.NumberFormat("en-us", {
    currency: "PHP",
  });
  const date = moment().format("DD MMMM YYYY");
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});
  const [reportToDetails, setReportToDetails] = useState({});
  const [prepBySignatories, setPrepBySignatories] = useState({
    name: "DUMMY NAME",
    positionDesignation: "DUMMY POSITION DESIGNATION",
    positionTitle: "DUMMY POSITION TITLE",
  });

  useEffect(() => {
    setEditToggler(false);
    let requestCount = 0;
    let successCount = 0;
    let failedCount = 0;
    const newResult = { successData: [], failedData: [] };

    props.data.applicantList.forEach((i, ix) => {
      axios
        .post(
          `/api/pds/print/getPersonalInformation${
            i.prf_applicant_id
              ? `?id=${i.prf_applicant_id}&&category=${
                  i.is_employee === 1 ? "employee" : "applicant"
                }`
              : ""
          }`
        )
        .then((res) => {
          const personalInformation = {
            ...res.data.personal_information,
            appoint_date: JSON.parse(i.appoint_date),
          };
          newResult.successData.push(personalInformation);
          successCount++;
        })
        .catch((err) => {
          newResult.failedData.push(i);
          failedCount++;
        })
        .finally(() => {
          requestCount++;
          if (requestCount === props.data.applicantList.length) {
            setResult(newResult);
            setLoading(false);
          }
        });
    });

    console.log("atr cdata", {
      cname: props.data.signatories.dept_head["assigned_by"],
      dept: props.data.signatories.dept_head["position"],
    });
    // information for report to details office or department
    setReportToDetails({
      cname: props.data.signatories.dept_head["assigned_by"],
      dept: props.data.signatories.dept_head["position"],
    });

    var formattedPos = formatPositionName(
      props.data.signatories.hr["position_name"]
    );
    setPrepBySignatories({
      name: props.data.signatories.hr["assigned_by"],
      positionDesignation: formattedPos.props.children[0],
      positionTitle: "(" + formattedPos.props.children[4],
    });
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('ATR_prepBy', JSON.stringify(prepBy))
  // }, [prepBy])

  const handleEdit = () => {
    setEditToggler(true);
    setEditableContent(
      result.successData.map((item) => ({
        fname: item.fname,
        mname: item.mname,
        lname: item.lname,
        extname: item.extname,
        rAddress: item.rAddress,
        paddress: item.paddress,
        tname: item.tname,
      }))
    );
  };

  const handleSave = () => {
    setEditToggler(false);
    setResult((prev) => ({
      ...prev,
      successData: prev.successData.map((item, index) => ({
        ...item,
        fname: editableContent[index].fname,
        mname: editableContent[index].mname,
        lname: editableContent[index].lname,
        extname: editableContent[index].extname,
        rAddress: editableContent[index].rAddress,
        paddress: editableContent[index].paddress,
        tname: editableContent[index].tname,
      })),
    }));
  };

  const handleCancel = () => {
    setEditToggler(false);
  };

  const handleContentChange = (index, field, value) => {
    setEditableContent((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  // // Get the height of the .content class
  // const contentHeight = document.querySelector('.content').offsetHeight;
  // console.log('Content Height:', contentHeight);

  // // Get the height of the .header class
  // const headerHeight = document.querySelector('.header').offsetHeight;
  // console.log('Header Height:', headerHeight);

  // // Get the height of the .body class
  // const bodyHeight = document.querySelector('.body').offsetHeight;
  // console.log('Body Height:', bodyHeight);

  // // Get the height of the .footer-contents class
  // const footerContentsHeight = document.querySelector('.footer-contents').offsetHeight;
  // console.log('Footer Contents Height:', footerContentsHeight);

  // // Get the height of the .footer-border class
  // const footerBorderHeight = document.querySelector('.footer-border').offsetHeight;
  // console.log('Footer Border Height:', footerBorderHeight);
  console.log(props, ref);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => {
      return componentRef.current;
    },
    documentTitle: "Advice to Report",
    onAfterPrint: () => console.log("Print complete"),
    removeAfterPrint: true,
  });

  useImperativeHandle(ref, () => ({
    handlePrint,
  }));

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
          {!isEmptyObject(result) &&
            (result.failedData.length > 0 ? (
              <Box sx={{ marginLeft: "10px" }}>
                {" "}
                Failed to retrieve personal information{" "}
              </Box>
            ) : null)}
        </Box>
      ) : (
        <Box>
          {editToggler && (
            <Box sx={{ display: "flex", margin: "1rem 0", gap: "0.5rem" }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                {" "}
                Save{" "}
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
                {" "}
                Cancel{" "}
              </Button>
            </Box>
          )}

          {!editToggler && (
            <Box sx={{ display: "flex", margin: "1rem 0", gap: "0.5rem" }}>
              <Button variant="contained" color="primary" onClick={handleEdit}>
                {" "}
                Edit{" "}
              </Button>
              <Button
                startIcon={<PrintIcon />}
                variant="contained"
                color="warning"
                onClick={handlePrint}
              >
                {" "}
                Print{" "}
              </Button>
            </Box>
          )}

          <Box
            ref={componentRef}
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              "media print": {
                display: "block",
              },
            }}
          >
            {!isEmptyObject(result) && (
              <>
                {console.log(result.successData)}
                {result.successData.map((item, ix) => (
                  <Box
                    key={"content-" + ix}
                    sx={{
                      position: "relative",
                      fontFamily: "Cambria",
                      lineHeight: "1",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
                      "@media print": {
                        pageBreakBefore: ix === 0 ? "auto" : "always",
                        borderRadius: "0",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {/* {props.letterhead ? <>No Letter Head Found </> : <>
                    <Box className="header">
                      <img src={props.letterhead} style={{ width: '100%' }} alt="Letter head" />
                    </Box>
                  </>
                  } */}
                    <CheckLetterHF
                      letterData={props.letterhead}
                      classname={"header"}
                      imgstyle={{ width: "100%" }}
                      letterName={"Letter Head"}
                    />

                    <Box
                      className="body"
                      sx={{
                        fontSize: "12px",
                        margin: "2rem 4rem",
                        position: "relative",
                        "@media print": {
                          margin: "0 6rem 0",
                          zIndex: "9999",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: "center",
                          marginBottom: "2rem",
                        }}
                      >
                        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                          ADVICE TO REPORT
                        </div>
                        <div style={{ fontWeight: "bold" }}>{date}</div>
                      </Box>

                      {editToggler && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            marginTop: "1rem",
                          }}
                        >
                          <TextField
                            value={editableContent[ix].fname}
                            onChange={(e) =>
                              handleContentChange(ix, "fname", e.target.value)
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            label="First Name"
                            size="small"
                          />

                          <TextField
                            value={editableContent[ix].mname}
                            onChange={(e) =>
                              handleContentChange(ix, "mname", e.target.value)
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            label="Middle Name"
                            size="smaill"
                          />

                          <TextField
                            value={editableContent[ix].lname}
                            onChange={(e) =>
                              handleContentChange(ix, "lname", e.target.value)
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            label="Last Name"
                            size="small"
                          />

                          <TextField
                            value={editableContent[ix].extname}
                            onChange={(e) =>
                              handleContentChange(ix, "extname", e.target.value)
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            label="Extension Name"
                            size="small"
                          />

                          <TextField
                            value={editableContent[ix].rAddress}
                            onChange={(e) =>
                              handleContentChange(
                                ix,
                                "rAddress",
                                e.target.value
                              )
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            label="Residential Address"
                            size="small"
                          />

                          <TextField
                            value={editableContent[ix].paddress}
                            onChange={(e) =>
                              handleContentChange(
                                ix,
                                "paddress",
                                e.target.value
                              )
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            label={
                              <Typography variant="caption">
                                Permanent Address
                              </Typography>
                            }
                            size="small"
                          />

                          {/* salary data in words format */}
                          {/* <TextField
                          value={editableContent[ix].email}
                          onChange={(e) => handleContentChange(ix, 'email', e.target.value)}
                          sx={{ '& .MuiInputBase-input': { } }}
                          variant="outlined"
                          label="Email Address"
                          size="small"
                        /> */}

                          {/* Directed to */}
                          <TextField
                            label={
                              <Typography variant="caption">
                                Report To
                              </Typography>
                            }
                            value={reportToDetails.cname}
                            onChange={(e) =>
                              setReportToDetails({
                                ...reportToDetails,
                                cname: e.target.value,
                              })
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            size="small"
                          />
                          <TextField
                            label={
                              <Typography variant="caption">
                                Report to Department
                              </Typography>
                            }
                            value={reportToDetails.dept}
                            onChange={(e) =>
                              setReportToDetails({
                                ...reportToDetails,
                                dept: e.target.value,
                              })
                            }
                            sx={{ "& .MuiInputBase-input": {} }}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      )}

                      {!editToggler && (
                        <>
                          <Box sx={{ marginBottom: "2rem" }}>
                            <Box
                              sx={{
                                fontWeight: "bold",
                                textTransform: "uppercase",
                              }}
                            >
                              {formatName(
                                item.fname,
                                item.mname,
                                item.lname,
                                item.extname,
                                0
                              ) || "APPLICANT NAME NOT FOUND"}
                            </Box>
                            <Box sx={{ textTransform: "capitalize" }}>
                              {`${
                                item.rAddress === null ||
                                item.rAddress === undefined ||
                                item.rAddress === "" ||
                                !item.rAddress
                                  ? ""
                                  : item.rAddress
                              }`}
                            </Box>
                            <Box>
                              {" "}
                              {`${item.paddress ? item.paddress : ""}`}{" "}
                            </Box>
                          </Box>

                          <Box sx={{ marginBottom: "1rem" }}>
                            Dear{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {" "}
                              Mr./Ms. {`${item.lname}`}{" "}
                            </span>
                            ,
                          </Box>

                          {/* Body Content */}
                          <Box
                            sx={{ marginBottom: "1rem", textAlign: "justify" }}
                          >
                            We would like to inform you that you are hired as an{" "}
                            {props.data.prfData["position_title"]} under a{" "}
                            {props.data.prfData["emp_stat"]} status at the{" "}
                            {props.data.prfData["office_dept"]} (
                            {props.data.prfData["short_name"]}) with a
                            compensation of{" "}
                            {props.data.salaryData["formattedWords"]} (Php
                            {testphpFormatComma.format(
                              props.data.salaryData["sgValue"]
                            )}
                            ) effective{" "}
                            {moment(item.appoint_date[0]).format(
                              "MMMM DD, YYYY"
                            )}{" "}
                            to{" "}
                            {moment(item.appoint_date[1]).format(
                              "MMMM DD, YYYY"
                            )}{" "}
                            unless sooner terminated.
                          </Box>
                          <Box
                            sx={{ marginBottom: "2rem", textAlign: "justify" }}
                          >
                            Further, you are directed to report to{" "}
                            {reportToDetails.cname}, {reportToDetails.dept}, for
                            the specific details of your job assignment. You are
                            expected to perform your duties with utmost degree
                            of excellence and dedication.
                          </Box>

                          {/* CHRMD DH SIGNATORY */}
                          <Stack sx={{ marginBottom: "3rem" }}>
                            <Box sx={{ fontWeight: "bold" }}>
                              {prepBySignatories.name}
                            </Box>
                            <Box>{prepBySignatories.positionDesignation}</Box>
                            <Box>{prepBySignatories.positionTitle}</Box>
                          </Stack>

                          {/* APPLICANT SIGNATORY */}
                          <Box sx={{ display: "flex", justifyContent: "end" }}>
                            <Box sx={{ width: "250px" }}>
                              <div>Acknowledged by: </div>
                              <br />
                              <div>
                                ____________________________________________
                              </div>
                              <div>Signature over Printed Name</div>
                              <br />
                              <span>Date:</span>{" "}
                              _________________________________
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>

                    {/* <Box className="footer" sx={{
                    '@media print': { position: 'fixed', bottom: '0', left: '0', zIndex: '-1' }
                  }}
                  >
                    <img src={props.letterfoot} style={{ width: '100%' }} alt="Letter foot" />
                  </Box> */}
                    <CheckLetterHF
                      letterData={props.letterfoot}
                      classname={"footer"}
                      boxstyle={{
                        "@media print": {
                          position: "fixed",
                          bottom: "0",
                          left: "0",
                          zIndex: "-1",
                        },
                      }}
                      imgstyle={{ width: "100%" }}
                      letterName={"Letter Foot"}
                    />
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
});

export default AtrDocument;
