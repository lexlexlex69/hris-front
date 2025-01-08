import React from "react";
import { usePrfData } from "../context/PrintableDataProvider";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import { formatName } from "../../../customstring/CustomString";
import PrintableTemplate from "./PrintableTemplate";
import { cosCheckList } from "../../documentpreparation/ProcessDocument";

function PrintableNoe() {
  const { prfData, forDesignHeader, forDesignFooter, designPreview } =
    usePrfData();
  return (
    <>
      {prfData &&
        prfData.SummaryOfCandidApplicantDetails.map((item, index) => (
          <React.Fragment key={index}>
            <PrintableTemplate
              designPreview={designPreview}
              forDesignHeader={forDesignHeader}
              forDesignFooter={forDesignFooter}
              index={index}
            >
              <div className="prf_printable_content_page_title">
                <p>NOTICE OF EMPLOYMENT</p>
                <p>{moment().format("MMMM DD YYYY")}</p>
              </div>
              <p>
                {formatName(
                  item.fname,
                  item.mname,
                  item.lname,
                  item.extname,
                  0
                ) || "APPLICANT NAME NOT FOUND"}
              </p>
              <p>Greetings!</p>
              <span>
                {`We are happy to inform that you have been selected for the position of  ${
                  prfData.SummaryOfCandidPrfDetails.position_title
                } under the ${
                  prfData.SummaryOfCandidPrfDetails.office_dept
                }. The said position shall be under a ${
                  prfData.SummaryOfCandidPrfDetails.emp_stat
                } status with a gross monthly compensation of ${phpPesoIntFormater.format(
                  prfData.SummaryOfCandidPrfDetails.sal_value
                )} effective after compliance of the pre-employment requirements:`}
              </span>
              <table style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        verticalAlign: "top",
                        border: "1px solid black",
                        width: "50%",
                      }}
                    >
                      {" "}
                      ORIGINAL{" "}
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        verticalAlign: "top",
                        border: "1px solid black",
                        width: "50%",
                      }}
                    >
                      {" "}
                      PHOTOCOPY{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        verticalAlign: "top",
                        padding: "0.3rem",
                      }}
                    >
                      <ol
                        style={{
                          textAlign: "left",
                          paddingLeft: "20px",
                          marginBottom: "0px",
                        }}
                      >
                        {cosCheckList.map(
                          (it, itx) =>
                            it.type === "original" && <li>{it.label}</li>
                        )}
                      </ol>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        verticalAlign: "top",
                        padding: "0.3rem",
                      }}
                    >
                      <ol
                        style={{
                          textAlign: "left",
                          paddingLeft: "20px",
                          marginBottom: "0px",
                        }}
                      >
                        {cosCheckList.map(
                          (it, itx) =>
                            it.type === "photocopy" && <li>{it.label}</li>
                        )}
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p sx={{ fontSize: "10px", fontStyle: "italic" }}>
                *Professionals who are subject to the professional tax
                imposition pursuant to Section 139 of the Local Government Code
                are exempt from paying this fee
              </p>
              <p sx={{ fontSize: "10px", fontStyle: "italic" }}>
                **Shall be complied upon receipt of approved Contract and
                Indorsement signed by the City Treasurer’s Department
              </p>

              <p sx={{ margin: "1rem 0" }}>
                Kindly{" "}
                <strong>
                  submit your complete requirements inside a white long folder
                  with plastic cover
                </strong>{" "}
                to the Talent Acquisition Section - City Human Resource
                Management Department (CHRMD).
              </p>

              <p sx={{ marginBottom: "1rem" }}>
                We are looking forward to having you on our team.
              </p>

              <div>
                <p>
                  {prfData
                    ? prfData.signatory && prfData.signatory.mayor.auth_name
                    : ""}
                </p>
                <p>
                  {prfData
                    ? prfData.signatory && prfData.signatory.mayor.position
                    : ""}
                </p>
                <p>For the Mayor:</p>
              </div>
              <div>
                <p>
                  {prfData
                    ? prfData.signatory && prfData.signatory.admin.assigned_by
                    : ""}
                </p>
                <p>
                  {prfData
                    ? prfData.signatory && prfData.signatory.admin.position
                    : ""}
                </p>
              </div>
            </PrintableTemplate>
          </React.Fragment>
        ))}
    </>
  );
}

export default PrintableNoe;
