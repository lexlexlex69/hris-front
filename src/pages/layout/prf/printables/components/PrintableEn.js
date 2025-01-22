import React from "react";
import { usePrfData } from "../context/PrintableDataProvider";
import { toWords } from "number-to-words";
import { phpPesoIntFormater } from "../../components/export_components/ExportComp";
import moment from "moment";
import {
  autoCapitalizeFirstLetter,
  formatName,
} from "../../../customstring/CustomString";
import PrintableTemplate from "./PrintableTemplate";
import { casualCheckList } from "../../documentpreparation/ProcessDocument";
import { Skeleton } from "@mui/material";

function PrintableEn() {
  const { prfData, forDesignHeader, forDesignFooter, designPreview } =
    usePrfData();
  return (
    <>
      {prfData ? (
        prfData.SummaryOfCandidApplicantDetails.map((item, index) => (
          <React.Fragment key={index}>
            <PrintableTemplate
              designPreview={designPreview}
              forDesignHeader={forDesignHeader}
              forDesignFooter={forDesignFooter}
              index={index}
              footerLabel={true}
            >
              <div className="prf_printable_content_page_title customSpace">
                <p>EMPLOYMENT NOTICE</p>
                <p className="customFont-12">
                  {moment().format("MMMM DD YYYY")}
                </p>
              </div>
              <p
                className="customFont-12"
                style={{ fontWeight: "600", marginBottom: "20px" }}
              >
                To:{"   "}
                {"MR/MS. "}
                {formatName(
                  item.fname,
                  item.mname,
                  item.lname,
                  item.extname,
                  0
                ).toUpperCase() || "APPLICANT NAME NOT FOUND"}
              </p>
              <span
                className="customSpace customFont-11"
                style={{ textIndent: "2em", display: "block" }}
              >
                We would like to inform you that you are hired as a{" "}
                <strong>
                  {prfData.SummaryOfCandidPrfDetails.position_title}
                </strong>{" "}
                on a{" "}
                <strong>{prfData.SummaryOfCandidPrfDetails.emp_stat}</strong>{" "}
                status to be assigned at the{" "}
                <strong>{prfData.SummaryOfCandidPrfDetails.office_dept}</strong>{" "}
                with salary grade{" "}
                <strong>{prfData.SummaryOfCandidPrfDetails.pay_sal}</strong>{" "}
                <strong>
                  (SG {prfData.SummaryOfCandidPrfDetails.pay_sal})
                </strong>{" "}
                equivalent to a monthly basic pay of{" "}
                <strong>
                  {autoCapitalizeFirstLetter(
                    toWords(prfData.SummaryOfCandidPrfDetails.sal_value)
                  )}
                </strong>{" "}
                <strong>
                  (
                  {phpPesoIntFormater.format(
                    prfData.SummaryOfCandidPrfDetails.sal_value
                  )}
                  )
                </strong>
                . Please submit the following requirements for the processing of
                your casual appointment:
              </span>
              {/* <span>
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
              </span> */}
              <div>
                <ol className="customOL customFont-12">
                  {casualCheckList.map((item) => (
                    <li>{item.label}</li>
                  ))}
                </ol>
              </div>
              <span
                className="customFont-11"
                style={{
                  marginBottom: "40px",
                  textIndent: "2em",
                  display: "block",
                }}
              >
                Kindly <strong>submit your complete requirements</strong> to the
                City Human Resource Management Department (CHRMD). The effective
                date of your appointment is{" "}
                <strong style={{ textDecoration: "underline" }}>
                  {moment(JSON.parse(item.appoint_date)).format(
                    "MMMM DD, YYYY"
                  )}
                </strong>{" "}
                thus, you are advised to report to CHRMD on the said date.
              </span>

              <div className="printableSignContainer">
                <div className="printableSignContent">
                  <strong className="customFont-11">
                    {prfData
                      ? prfData.signatory && prfData.signatory.mayor.auth_name
                      : ""}
                  </strong>
                  <p className="customFont-11">
                    {prfData
                      ? prfData.signatory && prfData.signatory.mayor.position
                      : ""}
                  </p>
                </div>
              </div>
              {/* <div>
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
              </div> */}
            </PrintableTemplate>
          </React.Fragment>
        ))
      ) : (
        <Skeleton
          variant="rounded"
          width={780}
          height={1100}
          sx={{ bgcolor: "grey.100" }}
        />
      )}
    </>
  );
}

export default PrintableEn;
