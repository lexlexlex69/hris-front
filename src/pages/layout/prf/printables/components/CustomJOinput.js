import React, { useState } from "react"
import "./CustomInput.css"
import { usePrfData } from "../context/PrintableDataProvider"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { phpPesoIntFormater } from "../../components/export_components/ExportComp"
import { toWords } from "number-to-words"

function CustomJOinput({ title, dataList }) {
  const { setPrfData, handleRowClick, prfData } = usePrfData()
  const [salaryToggler, setSalaryToggler] = useState(false)
  const [testSelect, setTestSelect] = useState("blue")
  const [jobDesc, setJobDesc] = useState(
    prfData && prfData.SummaryOfCandidPrfDetails
  )
  // const [tempSelect, setTempSelect] = useState(
  //   prfData ? prfData.SummaryOfCandidPrfDetails.sal_value : 0
  // )
  jobDesc && console.log(jobDesc)
  const handleEmployerChange = (index, value) => {
    // Create a copy of the current state
    const updatedArr = [...jobDesc.job_desc]
    console.log("updatedArr", updatedArr)
    // Update the specific employer's value
    updatedArr[index] = value

    // // Set the new state with the updated employer list
    setJobDesc((prevState) => ({
      ...prevState,
      job_desc: updatedArr,
    }))
  }

  return (
    <div className="PRF_CustomInput">
      <div className="PRF_CustomInput_Header">{title}</div>
      <div className="PRF_CustomInput_Body">
        <>
          <input type="text" name="" id="" />
          <button></button>
          {/* after nako mefetch ang prfdata, dapat convert nako ang job_desc into array then replace ang data sulod sa job_desc into the new array,

for changing data and save, dapat direct change ang array, for saving ky dapat ma convert ang katong array into string */}
          <ol>
            {jobDesc &&
              jobDesc.job_desc.map((item, index) => (
                <li>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={item}
                    onChange={(e) =>
                      handleEmployerChange(index, e.target.value)
                    }
                  />{" "}
                  <button>Remove</button>
                </li>
              ))}
          </ol>
        </>
      </div>
    </div>
  )
}

export default CustomJOinput
