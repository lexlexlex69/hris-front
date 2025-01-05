import { Box, Button, CircularProgress, Stack } from "@mui/material";
import moment from "moment";
import { isEmptyObject } from "jquery";
import React, { useEffect, useRef, useState } from "react";

import {
  autoCapitalizeFirstLetter,
  formatName,
} from "../../../customstring/CustomString";
import { CheckLetterHF } from "./component";
import { useReactToPrint } from "react-to-print";
import { Print as PrintIcon } from "@mui/icons-material";

export const EnDocument = React.forwardRef((props, ref) => {
  console.log("props.data", props.data);
  const testphpFormatComma = new Intl.NumberFormat("en-us", {
    currency: "PHP",
  });
  const date = moment().format("MMMM DD YYYY");
  const printRef = useRef();

  const [signatories, setSignatories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editToggler, setEditToggler] = useState(false);

  useEffect(() => {
    setSignatories({
      city_mayor_name: props.data.signatories.mayor.auth_name,
      city_mayor_pos: props.data.signatories.mayor.position,
      city_admin_name: props.data.signatories.admin.assigned_by,
      city_admin_pos: props.data.signatories.admin.position,
    });

    setLoading(false);
  }, []);

  const handleSave = () => {
    setEditToggler(!editToggler);
  };
  const handleEdit = () => {
    setEditToggler(!editToggler);
  };
  const handleCancel = () => {
    setEditToggler(!editToggler);
  };

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: "Employment Notice",
    onAfterPrint: () => console.log("Print complete"),
    removeAfterPrint: true,
  });

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size="30px" />
            {/* {!isEmptyObject(result) && (
          result.failedData.length > 0 ? <Box sx={{ marginLeft: '10px' }}> Failed to retrieve personal information </Box> : null
        )} */}
          </Box>
        </>
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
                  sx={{ marginLeft: "0.5rem" }}
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
                  startIcon={<PrintIcon />}
                  variant="contained"
                  color="warning"
                  onClick={handlePrint}
                >
                  {" "}
                  Print{" "}
                </Button>
              </Box>
            </>
          )}

          <Stack
            ref={ref}
            sx={{
              display: "flex",
              gap: 2,
              "media print": { display: "block", gap: 0 },
            }}
          >
            {!isEmptyObject(props.data) &&
              props.data.applicantList.map((item, index) => (
                <>
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
                      margin: "0rem 2rem",
                      "@media print": {
                        pageBreakBefore: index === 0 ? "auto" : "always",
                        borderRadius: "0",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <CheckLetterHF
                      letterData={props.letterHead}
                      classname={"print-header"}
                      imgstyle={{ width: "100%" }}
                      letterName={"Letter head"}
                    />

                    <Box
                      sx={{
                        margin: "0rem 4rem 1rem 2.75rem",
                        "@media print": { position: "relative", zIndex: "10" },
                      }}
                    >
                      <EnContent
                        appointDate={JSON.parse(item.appoint_date) ?? ""}
                        assignDept={props.data.prfData.office_dept ?? ""}
                        cityMayorName={
                          props.data.signatories
                            ? signatories.city_mayor_name.toUpperCase()
                            : ""
                        }
                        cityMayorPos={
                          props.data.signatories
                            ? signatories.city_mayor_pos
                            : ""
                        }
                        cityAdminName={
                          props.data.signatories
                            ? signatories.city_admin_name.toUpperCase()
                            : ""
                        }
                        cityAdminPos={
                          props.data.signatories
                            ? signatories.city_admin_pos
                            : ""
                        }
                        date={date ?? ""}
                        salaryGrade={props.data.salaryData.sg ?? ""}
                        salaryGradeWord={
                          props.data.salaryData.formattedWords ?? ""
                        }
                        equivSalaryGrade={props.data.salaryData.sgValue ?? ""}
                        hrAcronym={"CHRMD"}
                        phpFormatComma={testphpFormatComma}
                        positionTitle={props.data.prfData.position_title ?? ""}
                        submitHR={"City Human Resource Management Department"}
                        toName={
                          formatName(
                            item.fname,
                            item.mname,
                            item.lname,
                            item.extname,
                            0
                          ) || "APPLICANT NAME NOT FOUND"
                        }
                        prfNo={props.data.prfData.prf_no ?? ""}
                        checklist={props.checkList}
                        type={props.type}
                      />
                    </Box>

                    <Box
                      className="footer"
                      sx={{
                        "@media print": {
                          position: "fixed",
                          bottom: "0",
                          left: "0",
                          zIndex: "-1",
                        },
                      }}
                    >
                      <CheckLetterHF
                        letterData={props.letterFoot}
                        classname={"print-footer"}
                        imgstyle={{ width: "100%" }}
                        letterName={"Letter foot"}
                      />
                    </Box>
                  </Box>
                </>
              ))}
          </Stack>
        </>
      )}
    </>
  );
});

export default EnDocument;

const EnContent = ({
  date,
  toName,
  positionTitle,
  salaryGrade,
  salaryGradeWord,
  phpFormatComma,
  equivSalaryGrade,
  assignDept,
  appointDate,
  submitHR,
  hrAcronym,
  cityAdminName,
  cityAdminPos,
  cityMayorName,
  cityMayorPos,
  prfNo,
  checklist,
  type,
}) => {
  return (
    <div style={{ fontFamily: "Cambria" }}>
      <div style={{ textAlign: "center", lineHeight: "15px" }}>
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          EMPLOYMENT NOTICE
        </div>
        <div style={{ fontSize: "15px" }}>{date}</div>
      </div>
      <br />
      <div
        style={{
          lineHeight: "15px",
          textAlign: "justify",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "15px" }}>
          TO:&emsp;&nbsp;{toName}
        </div>
        <br />
        <p style={{ margin: "0", fontSize: "13px" }}>
          &emsp;&emsp;&ensp;&ensp;We would like to inform you that you are hired
          as a
          <span style={{ fontWeight: "bold" }}>
            {" "}
            {positionTitle.toUpperCase()}{" "}
          </span>
          on a<span style={{ fontWeight: "bold" }}> Casual </span>status to be
          assigned at the
          <span style={{ fontWeight: "bold" }}> {assignDept} </span>with
          <span style={{ fontWeight: "bold" }}>
            {" "}
            salary grade {salaryGrade} (SG {salaryGrade}){" "}
          </span>
          equivalent to a monthly basic pay of
          <span style={{ fontWeight: "bold" }}>
            {" "}
            ({salaryGradeWord}) (Php {phpFormatComma.format(equivSalaryGrade)}
            .00)
          </span>
          . Please submit the following requirements for the processing of your
          casual appointment:
        </p>
        <br />
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginLeft: "1rem",
          }}
        >
          <tbody>
            {checklist.map((item, index) => (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "0rem",
                    verticalAlign: "top",
                  }}
                >
                  {index + 1 + "."}
                </td>
                <td style={{ textAlign: "left", padding: "0 0 0 0.2rem" }}>
                  {item.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <p style={{ fontSize: "13px" }}>
          &emsp;&emsp;&emsp;Kindly
          <span style={{ fontWeight: "bold" }}>
            {" "}
            submit your complete requirements{" "}
          </span>
          to the {autoCapitalizeFirstLetter(submitHR)} ({hrAcronym}). The
          effective date of your appointment is
          <u style={{ fontWeight: "bold" }}>
            {" "}
            {moment(appointDate).format("MMMM DD, YYYY")}{" "}
          </u>
          thus, you are advised to report to {hrAcronym} on the said date.
        </p>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 auto" }}></div>
          <div style={{ width: "60%", fontWeight: "bold" }}>
            <br />
            <br />
            <div>
              <div style={{ display: "inline-block" }}>
                {cityMayorName}
                <div style={{ textAlign: "center", fontWeight: "normal" }}>
                  {cityMayorPos}
                </div>
              </div>
            </div>
            <br />
            <br />
            {type === 1 && (
              <>
                <div>For the Mayor:</div>
                <br />
                <br />
                <br />
                <br />
                <div>
                  <div style={{ display: "inline-block", textAlign: "center" }}>
                    {cityAdminName}
                    <div style={{ textAlign: "center", fontWeight: "normal" }}>
                      {cityAdminPos}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Box sx={{ marginTop: "4rem" }}></Box>
        <Box sx={{ lineHeight: 1 }}>
          <div style={{ fontSize: "8px" }}>PRF# {prfNo}</div>
          <div style={{ fontSize: "8px" }}>CHRMO.02/KJDM</div>
        </Box>
      </div>
    </div>
  );
};
