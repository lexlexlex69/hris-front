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
  let applicantCount = 0;

  const lastChunkReader = (arr, firstPcondi, otherPcondi) => {
    if (arr.length === 1) {
      return arr[arr.length - 1].length >= firstPcondi;
    } else {
      return arr[arr.length - 1].length >= otherPcondi;
    }
  };

  // make this function para sa last page readerist ahahha,
  // function (chunkstate, first page limit, other page limit){
  //   if chunkstate.length is equal to 1
  //     chunkstate[0].lenth === first page limit
  //   else  chunkstate[chunkState.lenth - 1] === other page limit

  // }

  // console.log("lastChunkReader", lastChunkReader(chunkState, 2))

  const JOLastChunk = chunkState && lastChunkReader(chunkState, 3, 4);
  const lastIndex = chunkState && chunkState.length + 1;
  return (
    <>
      {dataLoaded && (
        <>
          <style type="text/css">
            {"@media print{@page {size: landscape}}"}
          </style>
          {chunkState &&
            chunkState.map((item, index) => (
              <React.Fragment key={index + 1}>
                <PrintableTemplate
                  designPreview={designPreview}
                  forDesignHeader={forDesignHeader}
                  forDesignFooter={forDesignFooter}
                  index={index + 1}
                  noHeader={true}
                  JOSettings={{ index, chunkState }}
                  lastChunkReader={lastChunkReader}
                >
                  <div className="fontArial textCenter">
                    {index === 0 && (
                      <>
                        <p className="customFont-12">
                          Republic of the Philippines
                        </p>
                        <p className="customFont-13 boldText">
                          CITY GOVERNMENT OF BUTUAN
                        </p>
                        <p className="customFont-12">Butuan City</p>
                        <p
                          style={{ fontSize: "21px" }}
                          className="underlineText boldText"
                        >
                          JOB ORDER
                        </p>
                        <div className="Dflex textLeft ">
                          <p
                            className="customFont-13 "
                            style={{ width: "14%" }}
                          >
                            Office
                          </p>{" "}
                          <p className="customFont-13 boldText">
                            : CITY ACCOUNTING OFFICE
                          </p>
                        </div>
                        <div className="Dflex textLeft">
                          <p
                            className="customFont-13 "
                            style={{ width: "14%" }}
                          >
                            Funding/Charges
                          </p>{" "}
                          <p className="customFont-13 ">: CITY ACCOUNTING </p>
                        </div>
                      </>
                    )}
                  </div>
                  <table
                    style={{ fontSize: "12px", width: "100%" }}
                    className="fontArial"
                  >
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

                      {item.map((item, index) => {
                        applicantCount += 1;
                        return (
                          <tr key={index}>
                            <td
                              style={{
                                border: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              {applicantCount}.
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
                                  <li
                                    key={index}
                                    className="customFont-9 fontArial"
                                  >
                                    {item}
                                  </li>
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
                                fontWeight: "bold",
                                border: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              {item.appoint_date
                                ? moment(
                                    JSON.parse(item.appoint_date)[0]
                                  ).format("MMMM DD, YYYY")
                                : "NO DATE FOUND"}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {item.appoint_date
                                ? moment(
                                    JSON.parse(item.appoint_date)[1]
                                  ).format("MMMM DD, YYYY")
                                : "NO DATE FOUND"}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                textAlign: "center",
                              }}
                            ></td>
                          </tr>
                        );
                      })}
                      {/* ))} */}
                    </tbody>
                  </table>
                  {index === chunkState.length - 1 &&
                    !JOLastChunk &&
                    prfData && <JOlower data={prfData} />}
                </PrintableTemplate>
              </React.Fragment>
            ))}
          {JOLastChunk && (
            <React.Fragment>
              <style type="text/css">
                {"@media print{@page {size: landscape}}"}
              </style>
              <PrintableTemplate
                designPreview={designPreview}
                forDesignHeader={forDesignHeader}
                forDesignFooter={forDesignFooter}
                index={lastIndex}
                noHeader={true}
                JOSettings={{ lastIndex, chunkState }}
                lastPage={true}
                lastChunkReader={lastChunkReader}
              >
                <JOlower data={prfData} />
              </PrintableTemplate>
            </React.Fragment>
          )}
        </>
      )}
    </>
  );
}

const JOlower = ({ data }) => {
  console.log("jolowerdata", data);
  return (
    <div className="customFont-9 fontArial" style={{ marginTop: "20px" }}>
      <p>Republic of the Philippines</p>
      <ul>
        {JSON.parse(data.SummaryOfCandidPrfDetails.terms_condi).map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>
      <div className="Dflex space-between textCenter">
        <div>
          <p className="customSpace-50">Prepared by:</p>
          <p className="customFont-11 boldText">
            {data.signatory.dept_head.assigned_by}
          </p>
          <p>{data.signatory.dept_head.position_name}</p>
          <p>{data.signatory.dept_head.position}</p>
        </div>
        <div>
          <p className="customSpace-50">Recommending Approval:</p>
          <p className="customFont-11 boldText">
            {data.signatory.accounting.assigned_by}
          </p>
          <p>{data.signatory.accounting.position_name}</p>
          <p>{data.signatory.accounting.position}</p>
        </div>
        <div>
          <p className="customSpace-50">Approved:</p>
          <p className="customFont-11 boldText">
            {data.signatory.mayor.auth_name}
          </p>
          <p>{data.signatory.mayor.position}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableJo;
