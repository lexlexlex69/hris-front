import React from "react";
import { usePrfData } from "../context/PrintableDataProvider";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import { formatName } from "../../../customstring/CustomString";
import PrintableTemplate from "./PrintableTemplate";

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
                Resource Management Department (CHRMD). The effective date of
                your appointment is{" "}
                {moment(JSON.parse(item.appoint_date)).format("MMMM DD, YYYY")}{" "}
                thus, you are advised to report to CHRMD on the said date.
              </span>

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
                    ? prfData.signatory && prfData.signatory.admin.assigned_for
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
