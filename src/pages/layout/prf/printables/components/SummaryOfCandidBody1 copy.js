import React from "react";
import "./PrintableSummaryOfCandidBody.css";

function SummaryOfCandidBody1({ data }) {
  return (
    <>
      <div className="PrintableSummaryOfCandidBody">
        <div>
          {/* for table2 */}
          <table>
            <thead>
              <tr>
                <th>CANDIDATE DETAILS</th>
                <th>GENERAL FINDINGS</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, index) => (
                  <tr key={index} className="prf_printable_innerTableRow">
                    <td
                      style={{
                        verticalAlign: "top",
                        width: "100%",
                      }}
                      className="noBorder"
                    >
                      <tr>
                        <td>Name:</td>
                        <td>test name</td>
                      </tr>
                      {/* for education */}
                      <tr>
                        <td>Education:</td>
                      </tr>
                      <tr>
                        <td>
                          <ul>
                            <li>bachelor sdfsdfsdf</li>
                          </ul>
                        </td>
                      </tr>
                      {/* for education */}
                      {/* for trainings */}
                      <tr>
                        <td>Trainings:</td>
                      </tr>
                      <tr>
                        <td>
                          <ul>
                            <li>bachelor sdfsdfsdf</li>
                          </ul>
                        </td>
                      </tr>
                      {/* for trainings */}
                      {/* for eligibility */}
                      <tr>
                        <td>Eligibility:</td>
                      </tr>
                      <tr>
                        <td>
                          <ul>
                            <li>bachelor sdfsdfsdf</li>
                          </ul>
                        </td>
                      </tr>
                      {/* for eligibility */}
                    </td>
                    <td
                      style={{
                        verticalAlign: "top",
                        width: "100%",
                      }}
                      className="noBorder2"
                    >
                      {/* for education */}
                      <tr>
                        <td>Assessment:</td>
                      </tr>
                      <tr>
                        <td>
                          <ul>
                            <li>bachelor sdfsdfsdf</li>
                            <li>bachelor sdfsdfsdf</li>
                            <li>bachelor sdfsdfsdf</li>
                          </ul>
                        </td>
                      </tr>
                      {/* for education */}
                      {/* for trainings */}
                      <tr className="topBorder">
                        <td>Recommended Action:</td>
                      </tr>
                      <tr>
                        <td>
                          <ul>
                            <li>bachelor sdfsdfsdf</li>
                          </ul>
                        </td>
                      </tr>
                      {/* for trainings */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* for prepared by */}
        </div>
      </div>
    </>
  );
}

export default SummaryOfCandidBody1;
