import React from "react"
import { usePrfData } from "../context/PrintableDataProvider"
import PrintableTemplate from "./PrintableTemplate"
import { capitalizeWords } from "../Utils"
import { arrayDisplay } from "./PrintableContent"
import SummaryOfCandidBody1 from "./SummaryOfCandidBody1"

function PrintableSummaryOfCandid() {
  const {
    chunkState,
    prfData,
    parsedData,
    forDesignHeader,
    forDesignFooter,
    designPreview,
  } = usePrfData()
  return (
    <>
      {chunkState &&
        chunkState.map((item, index) => (
          <React.Fragment key={index} className="page">
            <PrintableTemplate
              designPreview={designPreview}
              forDesignHeader={forDesignHeader}
              forDesignFooter={forDesignFooter}
              index={index}
            >
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
                              ? prfData.SummaryOfCandidPrfDetails.position_title
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
                                  prfData.SummaryOfCandidPrfDetails.office_dept
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
            </PrintableTemplate>
          </React.Fragment>
        ))}
    </>
  )
}

export default PrintableSummaryOfCandid
