import React from "react";
import { usePrfData } from "../context/PrintableDataProvider";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import {
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
              <div className="prf_printable_content_page_title">
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

              <span
                className="customSpace customFont-12"
                style={{ marginBottom: "40px" }}
              >
                We would like to inform you that you are hired as a{" "}
                {prfData.SummaryOfCandidPrfDetails.position_title} under a{" "}
                {prfData.SummaryOfCandidPrfDetails.emp_stat} status at the{" "}
                {prfData.SummaryOfCandidPrfDetails.office_dept}{" "}
                {formatNameAbbreviation(
                  prfData.SummaryOfCandidPrfDetails.office_dept
                )}{" "}
                with a compensation of{" "}
                {toWords(prfData.SummaryOfCandidPrfDetails.sal_value)} (
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
              </span>
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
                <p className="customFont-12">
                  {prfData
                    ? prfData.signatory &&
                      prfData.signatory.hr.position_name
                        .slice(prfData.signatory.hr.position_name.indexOf("("))
                        .trim()
                    : ""}
                </p>
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
