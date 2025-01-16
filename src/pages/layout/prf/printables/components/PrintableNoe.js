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

  const getAddressById = (id, arr) => {
    const data = arr.find((item) => item.id === id);
    console.log("dataaddress1", data);
    return data ? data : null; // Returns the address if found, otherwise null
  };
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
              </div>
              <p className="customSpace customFont-12">
                {moment().format("DD MMMM YYYY")}
              </p>
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
                {getAddressById(item.id, prfData.address) && (
                  <>
                    {
                      <>
                        <p className=" customFont-12">
                          {getAddressById(item.id, prfData.address).resiAddress}
                        </p>
                        <p className=" customFont-12">
                          {
                            getAddressById(item.id, prfData.address)
                              .permaAddress
                          }
                        </p>
                      </>
                    }
                  </>
                )}
              </div>
              <p className="customSpace customFont-12">Dear Mr./Ms.:</p>
              <p className="customSpace customFont-12">Greetings!</p>
              <span className="customFont-12 customSpace">
                We are happy to inform that you have been selected for the
                position of{" "}
                <strong>
                  {prfData.SummaryOfCandidPrfDetails.position_title}
                </strong>{" "}
                under the{" "}
                <strong>{prfData.SummaryOfCandidPrfDetails.office_dept}</strong>
                . The said position shall be under a{" "}
                <strong>{prfData.SummaryOfCandidPrfDetails.emp_stat}</strong>{" "}
                status with a <strong>gross monthly compensation</strong> of{" "}
                <strong>
                  {phpPesoIntFormater.format(
                    prfData.SummaryOfCandidPrfDetails.sal_value
                  )}
                </strong>{" "}
                effective after compliance of the pre-employment requirements:
              </span>
              <table
                className="customFont-12 "
                style={{ borderCollapse: "collapse" }}
              >
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
              <p
                className="customFont-9"
                sx={{ fontSize: "10px", fontStyle: "italic" }}
              >
                *Professionals who are subject to the professional tax
                imposition pursuant to Section 139 of the Local Government Code
                are exempt from paying this fee
              </p>
              <p
                className="customFont-9 customSpace"
                sx={{ fontSize: "10px", fontStyle: "italic" }}
              >
                **Shall be complied upon receipt of approved Contract and
                Indorsement signed by the City Treasurer’s Department
              </p>

              <p
                className="customFont-12 customSpace"
                sx={{ margin: "1rem 0" }}
              >
                Kindly{" "}
                <strong>
                  submit your complete requirements inside a white long folder
                  with plastic cover
                </strong>{" "}
                to the Talent Acquisition Section - City Human Resource
                Management Department (CHRMD).
              </p>

              <p className="customFont-12" style={{ marginBottom: "40px" }}>
                We are looking forward to having you on our team.
              </p>

              <div>
                <strong className="customFont-12">
                  {prfData
                    ? prfData.signatory && prfData.signatory.mayor.auth_name
                    : ""}
                </strong>
                <p className="customFont-12">
                  {prfData
                    ? prfData.signatory && prfData.signatory.mayor.position
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
