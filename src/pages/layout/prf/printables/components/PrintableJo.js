import React from "react";
import { usePrfData } from "../context/PrintableDataProvider";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import { formatName } from "../../../customstring/CustomString";
import PrintableTemplate from "./PrintableTemplate";

function PrintableJo() {
  const {
    chunkState,
    prfData,
    forDesignHeader,
    forDesignFooter,
    designPreview,
  } = usePrfData();

  let dataLoaded = chunkState && prfData && prfData.signatory;
  return (
    <>
      {dataLoaded && (
        <>
          {chunkState &&
            chunkState.map((item, index) => (
              <React.Fragment key={index}>
                <PrintableTemplate
                  designPreview={designPreview}
                  forDesignHeader={forDesignHeader}
                  forDesignFooter={forDesignFooter}
                  index={index}
                  footerLabel={"en"}
                >
                  <div className="prf_printable_content_page_title">
                    {index === 0 && (
                      <>
                        <p>Republic of the Philippines</p>
                        <p>CITY GOVERNMENT OF BUTUAN</p>
                        <p>Butuan City</p>
                        <p>JOB ORDER</p>
                        <span>
                          <p>Office:</p> <p>CITY ACCOUNTING OFFICE</p>
                        </span>
                        <span>
                          <p>Funding/Charges:</p> <p>CITY ACCOUNTING </p>
                        </span>
                      </>
                    )}
                  </div>
                  <table style={{ fontSize: "12px", width: "100%" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                            width: "120px",
                          }}
                          colSpan={2}
                          rowSpan={2}
                        >
                          {" "}
                          NAME{" "}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                          rowSpan={2}
                        >
                          {" "}
                          POSITION{" "}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                          rowSpan={2}
                        >
                          {" "}
                          JOB DESCRIPTION{" "}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                          rowSpan={2}
                        >
                          {" "}
                          DAILY WAGE{" "}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                          rowSpan={1}
                          colSpan={2}
                        >
                          {" "}
                          PERIOD OF EMPLOYMENT{" "}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                          rowSpan={2}
                        >
                          {" "}
                          ACKNOWLEDGEMENT
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          FROM{" "}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "rgb(189,214,238)",
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          TO{" "}
                        </td>
                      </tr>
                      {/* {result && result.map((item, ix) => ( */}

                      {item.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            1.
                          </td>
                          <td
                            style={{
                              textAlign: "left",
                              fontWeight: "bold",
                              border: "1px solid black",
                              textAlign: "left",
                            }}
                          >
                            {formatName(
                              item.fname,
                              item.mname,
                              item.lname,
                              item.extname,
                              2
                            ) || "APPLICANT NAME NOT FOUND"}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            {item.position_title || "NO POSITION TITLE FOUND"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            <ul style={{ margin: 0 }}>
                              {JSON.parse(
                                prfData.SummaryOfCandidPrfDetails.job_desc
                              ).map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </td>
                          <td
                            style={{
                              fontWeight: "bold",
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            {(prfData.SummaryOfCandidPrfDetails.pay_sal &&
                              phpPesoIntFormater.format(
                                prfData.SummaryOfCandidPrfDetails.pay_sal
                              )) ||
                              "0.00"}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            {item.appoint_date
                              ? moment(JSON.parse(item.appoint_date)[0]).format(
                                  "MMMM DD, YYYY"
                                )
                              : "NO DATE FOUND"}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          >
                            {item.appoint_date
                              ? moment(JSON.parse(item.appoint_date)[1]).format(
                                  "MMMM DD, YYYY"
                                )
                              : "NO DATE FOUND"}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              textAlign: "center",
                            }}
                          ></td>
                        </tr>
                      ))}
                      {/* ))} */}
                    </tbody>
                  </table>
                  {index === chunkState.length - 1 && (
                    <>
                      <p>Republic of the Philippines</p>
                      <ul>
                        {JSON.parse(
                          prfData.SummaryOfCandidPrfDetails.terms_condi
                        ).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>

                      <div>
                        <p>Prepared by:</p>
                        <p>{prfData.signatory.dept_head.assigned_by}</p>
                        <p>{prfData.signatory.dept_head.position_name}</p>
                        <p>{prfData.signatory.dept_head.position}</p>
                      </div>
                      <div>
                        <p>Recommending Approval:</p>
                        <p>{prfData.signatory.accounting.assigned_by}</p>
                        <p>{prfData.signatory.accounting.position_name}</p>
                        <p>{prfData.signatory.accounting.position}</p>
                      </div>
                      <div>
                        <p>Approved:</p>
                        <p>{prfData.signatory.mayor.auth_name}</p>
                        <p>{prfData.signatory.mayor.position}</p>
                      </div>
                    </>
                  )}
                  <div
                    style={{
                      display: "flex",
                      fontSize: "9px",
                      marginTop: "1rem",
                    }}
                  >
                    <div>CHRMO.02/AKP</div>
                    <div style={{ flex: "1 1 auto" }}></div>
                    <div>
                      Page {index + 1} of {chunkState.length}
                    </div>
                  </div>
                </PrintableTemplate>
              </React.Fragment>
            ))}
        </>
      )}
    </>
  );
}

export default PrintableJo;
