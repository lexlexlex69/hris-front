import React from "react";
import "./PrintableSummaryOfCandidBody.css";
import { capitalizeWords } from "../Utils";

function SummaryOfCandidBody1({ data }) {
  console.log(data);
  return (
    <>
      <div className="PrintableSummaryOfCandidBody">
        {/* for table2 */}
        <table>
          <thead>
            <tr>
              <th>CANDIDATE DETAILS</th>
              <th>GENERAL FINDINGS</th>
            </tr>
          </thead>
          <tbody style={{ height: "100px" }}>
            {data &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className="innerBoxStyle"
                  style={{ verticalAlign: "top" }}
                >
                  <td>
                    <div style={{ height: "100%" }}>
                      <p>
                        Name:{" "}
                        {`${item.item.lname}, ${item.item.fname} ${item.item.mname}`}
                      </p>
                      <p>Education:</p>
                      <ul>
                        <li>
                          {item.item.degreecourse
                            ? capitalizeWords(item.item.degreecourse)
                            : "N/A"}{" "}
                          {` - `}
                          {item.item.nschool
                            ? capitalizeWords(item.item.nschool)
                            : "N/A"}{" "}
                          {` , level(`}
                          {item.item.elevel
                            ? `${capitalizeWords(item.item.elevel)})`
                            : "N/A)"}{" "}
                        </li>
                      </ul>
                      <p>Trainings:</p>
                      <ul>
                        <li>
                          {item.item.positiontitle
                            ? capitalizeWords(item.item.positiontitle)
                            : "N/A"}{" "}
                          {` - `}
                          {item.item.agency
                            ? capitalizeWords(item.item.agency)
                            : "N/A"}{" "}
                        </li>
                      </ul>
                      <p>Eligilibity:</p>
                      <ul>
                        <li>
                          {item.item.title
                            ? capitalizeWords(item.item.title)
                            : "N/A"}{" "}
                          {` - `}
                          {item.item.rating
                            ? capitalizeWords(item.item.rating)
                            : "N/A"}{" "}
                          {` , `}
                          {item.item.licenseno
                            ? `${capitalizeWords(item.item.licenseno)})`
                            : "N/A"}{" "}
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td>
                    <div style={{ height: "100%" }}>
                      <p>Assessment:</p>
                      <ul>
                        {item.assessment.map((item, index) => {
                          return (
                            <li key={index}>
                              {item.lname},{item.fname} -{" "}
                              {item.potential_strengths
                                ? item.potential_strengths
                                : "None"}
                              , {item.red_flags ? item.red_flags : "None"}{" "}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div
                      style={{ height: "30%", borderTop: "1px solid black" }}
                    >
                      <p>Recommended Action:</p>
                      <ul>
                        <li key={index}>
                          {item.recom.lname},{item.recom.fname} -{" "}
                          {item.recom.hiring_recom
                            ? item.recom.hiring_recom
                            : "No Comment"}
                          ,{" "}
                          {item.recom.overall_recom
                            ? item.recom.overall_recom
                            : "No Comment"}{" "}
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* for prepared by */}
      </div>
    </>
  );
}

export default SummaryOfCandidBody1;
