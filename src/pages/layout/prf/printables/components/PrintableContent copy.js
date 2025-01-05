import React, { forwardRef } from "react";
import PrintableHeader from "./PrintableHeader";
import SummaryOfCandidBody1 from "./SummaryOfCandidBody1";

const PrintableContent = forwardRef(({ data }, ref) => {
  console.log(data);
  // const chunkArray = (array, size) => {
  //   const result = [];
  //   for (let i = 0; i < array.length; i += size) {
  //     result.push(array.slice(i, i + size));
  //   }
  //   return result;
  // };

  const finalData =
    data &&
    data.data.SummaryOfCandidApplicantDetails.map((item) => {
      const assessment = data.data.SummaryOfCandidFindings.filter(
        (finding) => item.app_id === finding.app_id
      );
      const recom = data.data.SummaryOfCandidFindings.find(
        (rec) => rec.rater_remark === "selected" && rec.app_id === item.app_id
      );
      return {
        item,
        assessment,
        recom,
      };
    });
  console.log("finalData", finalData);

  const chunkArray = (array, firstElementCount, otherElementCount) => {
    const result = [];

    // Add the first chunk with `firstElementCount`
    if (firstElementCount > 0) {
      result.push(array.slice(0, firstElementCount));
    }

    // Add the remaining chunks with `otherElementCount`
    for (let i = firstElementCount; i < array.length; i += otherElementCount) {
      result.push(array.slice(i, i + otherElementCount));
    }

    return result;
  };
  const chunks = chunkArray(finalData, 3, 4);
  console.log("chunks", chunks);
  return (
    <>
      <div
        className="prf_printable_content"
        // style={{ height: "100%" }}
        ref={ref}
      >
        {chunks &&
          chunks.map((item, index) => (
            <div className="page" key={index}>
              <table className="testtable">
                <thead>
                  <PrintableHeader
                    headerURL={data ? data.data.header[0].image_path : ""}
                    type="header"
                  />
                </thead>
                <tbody>
                  <div style={{ backgroundColor: "blue", height: "100%" }}>
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
                                <td>sdfsdf</td>
                                <td>PRF Number</td>
                                <td>sdfsdf</td>
                              </tr>
                              <tr>
                                <td>Division - Section</td>
                                <td colSpan={3}>sdfsdf</td>
                              </tr>
                              <tr>
                                <td>Department</td>
                                <td colSpan={3}>sdfsdf</td>
                              </tr>
                              <tr>
                                <td>Qualification Standards</td>
                                <td>sdfsdf</td>
                                <td colSpan={2}>sdfsdf</td>
                              </tr>
                              <tr>
                                <td>Education</td>
                                <td>asdfasdf</td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr>
                                <td>Training</td>
                                <td>asdfasdf</td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr>
                                <td>Experience</td>
                                <td>asdfasdf</td>
                                <td colSpan={2}></td>
                              </tr>
                              <tr>
                                <td>Eligibility</td>
                                <td>asdfasdf</td>
                                <td colSpan={2}></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                    <SummaryOfCandidBody1 data={item ? item : ""} />
                    {index === chunks.length - 1 && (
                      <>
                        <div className="printableEssentials">
                          <div>
                            <p>Prepared by:</p>

                            <p>test</p>
                            <p>position</p>
                          </div>
                          <div>
                            <p>Prepared by:</p>

                            <p>test</p>
                            <p>position</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </tbody>
                <tfoot>
                  <PrintableHeader
                    headerURL={data ? data.data.footer[0].image_path : ""}
                    type="footer"
                  />
                </tfoot>
              </table>
            </div>
            // <div className="prf_printable_content_page  " key={index}>
            //   <table style={{ height: "100%" }}>
            //     <thead>
            //       <tr>
            //         <td>
            //           <PrintableHeader
            //             headerURL={data ? data.data.header[0].image_path : ""}
            //             type="header"
            //           />
            //         </td>
            //       </tr>
            //     </thead>
            //     <tbody style={{ flex: 1, backgroundColor: "green" }}>
            //       <div style={{ backgroundColor: "blue", height: "100%" }}>
            //         {index === 0 && (
            //           <>
            //             <div className="prf_printable_content_page_title">
            //               <p>SUMMARY OF SHORTLISTED CANDIDATES</p>
            //             </div>
            //             <div className="PrintableSummaryOfCandidBody">
            //               <table className="">
            //                 <tbody>
            //                   <tr>
            //                     <td>Position/Job Title</td>
            //                     <td>sdfsdf</td>
            //                     <td>PRF Number</td>
            //                     <td>sdfsdf</td>
            //                   </tr>
            //                   <tr>
            //                     <td>Division - Section</td>
            //                     <td colSpan={3}>sdfsdf</td>
            //                   </tr>
            //                   <tr>
            //                     <td>Department</td>
            //                     <td colSpan={3}>sdfsdf</td>
            //                   </tr>
            //                   <tr>
            //                     <td>Qualification Standards</td>
            //                     <td>sdfsdf</td>
            //                     <td colSpan={2}>sdfsdf</td>
            //                   </tr>
            //                   <tr>
            //                     <td>Education</td>
            //                     <td>asdfasdf</td>
            //                     <td colSpan={2}></td>
            //                   </tr>
            //                   <tr>
            //                     <td>Training</td>
            //                     <td>asdfasdf</td>
            //                     <td colSpan={2}></td>
            //                   </tr>
            //                   <tr>
            //                     <td>Experience</td>
            //                     <td>asdfasdf</td>
            //                     <td colSpan={2}></td>
            //                   </tr>
            //                   <tr>
            //                     <td>Eligibility</td>
            //                     <td>asdfasdf</td>
            //                     <td colSpan={2}></td>
            //                   </tr>
            //                 </tbody>
            //               </table>
            //             </div>
            //           </>
            //         )}
            //         <SummaryOfCandidBody1 data={item ? item : ""} />
            //         {index === chunks.length - 1 && (
            //           <>
            //             <table>
            //               <tbody>
            //                 <tr>
            //                   <td>Prepared by:</td>
            //                   <td>Endorsed by:</td>
            //                 </tr>
            //                 <tr>
            //                   <td>
            //                     <input type="text" />
            //                     <p>Position</p>
            //                   </td>
            //                   <td>
            //                     <input type="text" />
            //                     <p>Position</p>
            //                     <p>Department</p>
            //                   </td>
            //                 </tr>
            //               </tbody>
            //             </table>
            //           </>
            //         )}
            //       </div>
            //     </tbody>
            //     <tfoot
            //       style={{
            //         pageBreakAfter: "always",
            //       }}
            //     >
            //       <tr>
            //         <td>
            //           <PrintableHeader
            //             headerURL={data ? data.data.footer[0].image_path : ""}
            //             type="footer"
            //           />
            //         </td>
            //       </tr>
            //     </tfoot>
            //   </table>
            // </div>
          ))}
      </div>
    </>
  );
});

export default PrintableContent;
