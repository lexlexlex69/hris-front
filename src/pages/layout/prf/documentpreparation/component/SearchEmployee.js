import { Box, Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import MediumModal from "../../../custommodal/MediumModal";
import { formatName } from "../../../customstring/CustomString";

export function SearchEmployeeModal({ open, setOpen, setStateData }) {
  const [searchData, setSearchData] = React.useState("");
  const [resultData, setResultData] = React.useState("");
  // const [open, setOpen] = useState(false)
  const submitSearch = (value) => {
    // event.preventDefault();
    searchEmployeeRequest(value)
      .then((respo) => {
        const data = respo.data;
        setResultData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const selectRow = (data) => {
    // console.log(data)
    // var name = formatName(data.fname, data.mname, data.lname, data.extname, 0)
    // setStateData((prev) => ({ name: name, position: data.position_name, empid: data.id, fname: data.fname, mname: data.mname, lname: data.lname, extname: data.extname }))
    setStateData(data);
    // props.setEmpid(data.id)
    // props.handleSearchData(data)
    // props.close()
  };
  return (
    <Box>
      {typeof open !== "undefined" && (
        <MediumModal open={open} close={setOpen}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="e.g. lastname,firstname"
                  fullWidth
                  required
                  onChange={(value) => submitSearch(value.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ float: "right" }}
                  type="submit"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
          {Array.isArray(resultData) && resultData.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <small
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  fontSize: "12px",
                }}
              >
                <em>
                  * click row to select <strong>Employee ID</strong>
                </em>
              </small>
              <Box sx={{ maxHeight: "40vh", overflowY: "scroll" }}>
                <table
                  className="table table-bordered table-hover"
                  style={{ marginTop: "5px" }}
                >
                  <thead
                    style={{
                      position: "sticky",
                      top: "-3px",
                      background: "#fff",
                    }}
                  >
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultData.map((data, key) => (
                      <tr
                        key={key}
                        onClick={() => selectRow(data)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{data.id}</td>
                        <td>{data.fname + " " + data.lname}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          )}
        </MediumModal>
      )}
    </Box>
  );
}

export function searchEmployeeRequest(data) {
  return axios.request({
    method: "POST",
    data: {
      data: data,
    },
    url: "api/employee/searchEmployee",
  });
}
