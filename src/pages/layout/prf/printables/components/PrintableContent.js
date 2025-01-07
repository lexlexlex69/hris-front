import React, { forwardRef, useEffect, useState } from "react";
import PrintableHeader from "./PrintableHeader";
import SummaryOfCandidBody1 from "./SummaryOfCandidBody1";
import { capitalizeWords } from "../Utils";
import { usePrfData } from "../context/PrintableDataProvider";
import PrintableHeaderContainer from "./PrintableHeaderContainer";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import { formatName } from "../../../customstring/CustomString";

const PrintableContent = forwardRef((props, ref) => {
  const {
    chunkState,
    prfData,
    parsedData,
    forDesignHeader,
    forDesignFooter,
    designPreview,
  } = usePrfData();
  console.log("chunkState", chunkState);
  console.log("designPreview", designPreview);
  const arrayDisplay = (array) => {
    return array.map((item, index) => (
      <React.Fragment key={index}>
        {item}
        {array.length > 1 && !(array.length - 1 === index) && `, `}
      </React.Fragment>
    ));
  };
  return (
    <>
      <div className="prf_printable_content" ref={ref}>
        {props.process === "summaryofcandid" && (
          <>
            {chunkState &&
              chunkState.map((item, index) => (
                <div className="page" key={index}>
                  <PrintableHeaderContainer
                    designPreview={designPreview}
                    forDesign={forDesignHeader}
                    type="header"
                  />

                  <div className="page-body">
                    {index === 0 && (
                      <>
                        <div className="prf_printable_content_page_title">
                          <p>SUMMARY OF SHORTLISTED CANDIDATES</p>
                        </div>
                        <div className="PrintableSummaryOfCandidBody">
                          <table className="">
                            <tbody>
                              <tr>
                                <td>Position/Job Title</td>
                                <td>
                                  {prfData
                                    ? prfData.SummaryOfCandidPrfDetails
                                        .position_title
                                    : "N/A"}
                                </td>
                                <td>PRF Number</td>
                                <td>
                                  {prfData
                                    ? prfData.SummaryOfCandidPrfDetails.prf_no
                                    : "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td>Division - Section</td>
                                <td colSpan={3}>
                                  {prfData
                                    ? prfData.SummaryOfCandidPrfDetails.div_name
                                    : "N/A"}
                                  {"-"}
                                  {prfData
                                    ? prfData.SummaryOfCandidPrfDetails.sec_name
                                    : "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td>Department</td>
                                <td colSpan={3}>
                                  {prfData
                                    ? capitalizeWords(
                                        prfData.SummaryOfCandidPrfDetails
                                          .office_dept
                                      )
                                    : "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td>Qualification Standards</td>
                                <td></td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr>
                                <td>Education</td>
                                <td>
                                  {parsedData.educ
                                    ? arrayDisplay(parsedData.educ)
                                    : "N/A"}
                                </td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr>
                                <td>Training</td>
                                <td>
                                  {parsedData.train
                                    ? arrayDisplay(parsedData.train)
                                    : "N/A"}
                                </td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr>
                                <td>Experience</td>
                                <td>
                                  {parsedData.expe
                                    ? arrayDisplay(parsedData.expe)
                                    : "N/A"}
                                </td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr>
                                <td>Eligibility</td>
                                <td>
                                  {parsedData.elig
                                    ? arrayDisplay(parsedData.elig)
                                    : "N/A"}
                                </td>
                                <td colSpan={2}></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                    <SummaryOfCandidBody1 data={item ? item : ""} />
                    {index === chunkState.length - 1 && (
                      <>
                        <div className="printableEssentials">
                          <div>
                            <p>Prepared by:</p>

                            <p>{prfData.essentials.prepared_by}</p>
                            <p>{prfData.essentials.prepared_by_position}</p>
                          </div>
                          <div>
                            <p>Prepared by:</p>

                            <p>{prfData.essentials.endorsed_by}</p>
                            <p>{prfData.essentials.endorsed_by_position}</p>
                            <p>{prfData.essentials.endorsed_by_department}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <PrintableHeaderContainer
                    designPreview={designPreview}
                    forDesign={forDesignFooter}
                    type="footer"
                  />
                </div>
              ))}
          </>
        )}
        {props.process === "en" && (
          <>
            {prfData &&
              prfData.SummaryOfCandidApplicantDetails.map((item, index) => (
                <div className="page" key={index}>
                  <PrintableHeaderContainer
                    designPreview={designPreview}
                    forDesign={forDesignHeader}
                    type="header"
                  />

                  <div className="page-body">
                    <div className="prf_printable_content_page_title">
                      <p>EMPLOYMENT NOTICE</p>
                      <p>{moment().format("MMMM DD YYYY")}</p>
                    </div>
                    <p>
                      To:{" "}
                      {formatName(
                        item.fname,
                        item.mname,
                        item.lname,
                        item.extname,
                        0
                      ) || "APPLICANT NAME NOT FOUND"}
                    </p>
                    <span>
                      {`We would like to inform you that you are hired as a  ${
                        prfData.SummaryOfCandidPrfDetails.position_title
                      } on a ${
                        prfData.SummaryOfCandidPrfDetails.emp_stat
                      } status to be assigned at the ${
                        prfData.SummaryOfCandidPrfDetails.office_dept
                      } with salary grade ${
                        prfData.SummaryOfCandidPrfDetails.pay_sal
                      } (SG ${
                        prfData.SummaryOfCandidPrfDetails.pay_sal
                      }) equivalent to a monthly basic pay of (${toWords(
                        prfData.SummaryOfCandidPrfDetails.sal_value
                      )}) (${phpPesoIntFormater.format(
                        prfData.SummaryOfCandidPrfDetails.sal_value
                      )}). Please submit the following requirements for the processing of your casual appointment:`}
                    </span>
                    <div>
                      <ol>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                        <li>{`3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)`}</li>
                      </ol>
                    </div>
                    <span>
                      Kindly submit your complete requirements to the City Human
                      Resource Management Department (CHRMD). The effective date
                      of your appointment is{" "}
                      {moment(JSON.parse(item.appoint_date)).format(
                        "MMMM DD, YYYY"
                      )}{" "}
                      thus, you are advised to report to CHRMD on the said date.
                    </span>

                    <div>
                      <p>
                        {prfData
                          ? prfData.signatory &&
                            prfData.signatory.mayor.auth_name
                          : ""}
                      </p>
                      <p>
                        {prfData
                          ? prfData.signatory &&
                            prfData.signatory.mayor.position
                          : ""}
                      </p>
                      <p>For the Mayor:</p>
                    </div>
                    <div>
                      <p>
                        {prfData
                          ? prfData.signatory &&
                            prfData.signatory.admin.assigned_for
                          : ""}
                      </p>
                      <p>
                        {prfData
                          ? prfData.signatory &&
                            prfData.signatory.admin.position
                          : ""}
                      </p>
                    </div>
                  </div>
                  <PrintableHeaderContainer
                    designPreview={designPreview}
                    forDesign={forDesignFooter}
                    type="footer"
                  />
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
});

export default PrintableContent;
