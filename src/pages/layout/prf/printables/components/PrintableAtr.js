import React from "react";
import { usePrfData } from "../context/PrintableDataProvider";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import {
  autoCapitalizeFirstLetter,
  formatName,
  formatNameAbbreviation,
} from "../../../customstring/CustomString";
import PrintableTemplate from "./PrintableTemplate";

function PrintableAtr() {
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
              <div className="prf_printable_content_page_title customSpace-50">
                <p>ADVICE TO REPORT</p>
                <p>{moment().format("DD MMMM YYYY")}</p>
              </div>
              <div className="customSpace">
                <p className=" customFont-12">
                  {formatName(
                    item.fname,
                    item.mname,
                    item.lname,
                    item.extname,
                    0
                  ) || "APPLICANT NAME NOT FOUND"}
                </p>

                <p className=" customFont-12">Address</p>
              </div>
              <p className="customSpace customFont-12">
                Dear Mr./Ms. {item.lname},
              </p>

              <p className="customSpace customFont-12">
                We would like to inform you that you are hired as a{" "}
                {prfData.SummaryOfCandidPrfDetails.position_title} under a{" "}
                {prfData.SummaryOfCandidPrfDetails.emp_stat} status at the{" "}
                {prfData.SummaryOfCandidPrfDetails.office_dept} (
                {prfData.SummaryOfCandidPrfDetails.short_name}) with a
                compensation of{" "}
                {autoCapitalizeFirstLetter(
                  toWords(prfData.SummaryOfCandidPrfDetails.sal_value)
                )}{" "}
                (
                {phpPesoIntFormater.format(
                  prfData.SummaryOfCandidPrfDetails.sal_value
                )}
                ) effective
                {moment(JSON.parse(item.appoint_date)[0]).format(
                  "MMMM DD, YYYY"
                )}{" "}
                to $
                {moment(JSON.parse(item.appoint_date)[1]).format(
                  "MMMM DD, YYYY"
                )}{" "}
                unless sooner terminated.
              </p>
              <p className="customFont-12" style={{ marginBottom: "40px" }}>
                Further, you are directed to report to{" "}
                {prfData
                  ? prfData.signatory && prfData.signatory.dept_head.assigned_by
                  : ""}
                ,
                {prfData
                  ? prfData.signatory && prfData.signatory.dept_head.position
                  : ""}
                , for the specific details of your job assignment. You are
                expected to perform your duties with utmost degree of excellence
                and dedication.
              </p>
              <div className="customSpace customFont-12">
                <strong>
                  {prfData
                    ? prfData.signatory && prfData.signatory.hr.assigned_by
                    : ""}
                </strong>
                <p className="customFont-12">
                  {prfData
                    ? prfData.signatory &&
                      prfData.signatory.hr.position_name
                        .slice(
                          0,
                          prfData.signatory.hr.position_name.indexOf("(")
                        )
                        .trim()
                    : ""}
                </p>
                <p className="customFont-12 customSpace-50">
                  {prfData
                    ? prfData.signatory &&
                      prfData.signatory.hr.position_name
                        .slice(prfData.signatory.hr.position_name.indexOf("("))
                        .trim()
                    : ""}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <div style={{ width: "40%" }}>
                    <p className="customFont-12">Acknowledged by:</p>
                    <div className="customBlank"></div>
                    <p className="customFont-12">
                      Signature over Printed Name:
                    </p>
                    <div className="customFont-12 Dflex">
                      <div style={{ width: "20%" }}>Date:</div>
                      <div
                        style={{ width: "80%" }}
                        className="customBlank"
                      ></div>
                    </div>
                  </div>
                </div>
                {/* <p>
                  {prfData
                    ? prfData.signatory &&
                      prfData.signatory.hr.position_name
                        .slice(parenthesisIndex)
                        .trim()
                    : ""}
                </p> */}
              </div>
            </PrintableTemplate>
          </React.Fragment>
        ))}
    </>
  );
}

export default PrintableAtr;
