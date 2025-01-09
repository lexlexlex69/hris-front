import React from "react";
import { usePrfData } from "../context/PrintableDataProvider";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import { formatName } from "../../../customstring/CustomString";
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

              <p>Dear Mr./Ms. Cruz ,</p>
              <span>
                {`We would like to inform you that you are hired as a  ${
                  prfData.SummaryOfCandidPrfDetails.position_title
                } on a ${
                  prfData.SummaryOfCandidPrfDetails.emp_stat
                } status at the ${
                  prfData.SummaryOfCandidPrfDetails.office_dept
                } with a compensation of(${toWords(
                  prfData.SummaryOfCandidPrfDetails.sal_value
                )} (${phpPesoIntFormater.format(
                  prfData.SummaryOfCandidPrfDetails.sal_value
                )}) effective ${moment(JSON.parse(item.appoint_date)[0]).format(
                  "MMMM DD, YYYY"
                )} to ${moment(JSON.parse(item.appoint_date)[1]).format(
                  "MMMM DD, YYYY"
                )} unless sooner terminated.`}
              </span>

              <p>
                {`Further, you are directed to report to ${
                  prfData
                    ? prfData.signatory &&
                      prfData.signatory.dept_head.assigned_by
                    : ""
                },${
                  prfData
                    ? prfData.signatory && prfData.signatory.dept_head.position
                    : ""
                }, for the specific details of your job assignment. You are expected to perform your duties with utmost degree of excellence and dedication.`}
              </p>
              <div>
                <p>
                  {prfData
                    ? prfData.signatory && prfData.signatory.hr.assigned_by
                    : ""}
                </p>
                <p>
                  {prfData
                    ? prfData.signatory && prfData.signatory.hr.position_name
                    : ""}
                </p>
              </div>
            </PrintableTemplate>
          </React.Fragment>
        ))}
    </>
  );
}

export default PrintableAtr;
