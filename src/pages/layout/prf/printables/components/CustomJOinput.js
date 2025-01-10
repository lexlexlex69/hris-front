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
  // const [tempSelect, setTempSelect] = useState(
  //   prfData ? prfData.SummaryOfCandidPrfDetails.sal_value : 0
  // )
  prfData && console.log(prfData.SummaryOfCandidPrfDetails.job_desc)

  // console.log(dataList)
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setPrfData((prevDetails) => ({
  //     ...prevDetails,
  //     essentials: { ...prevDetails.essentials, [name]: value },
  //   }));
  // };
  // const handleApplyChange = (e) => {
  //   e.preventDefault();
  //   setPrfData((prev) => ({
  //     ...prev,
  //     essentials: tempData,
  //   }));
  // };

  // const handleSaveSalarySetting = (e) => {
  //   setSalaryToggler((prev) => !prev)
  //   e.preventDefault()
  //   setPrfData((prevDetails) => ({
  //     ...prevDetails,
  //     SummaryOfCandidPrfDetails: {
  //       ...prevDetails.SummaryOfCandidPrfDetails,
  //       sal_value: tempSelect,
  //     },
  //   }))
  // }
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
            {prfData &&
              JSON.parse(prfData.SummaryOfCandidPrfDetails.job_desc).map(
                (item, index) => (
                  <li>
                    <input
                      type="text"
                      name=""
                      id=""
                      value={item}
                      //                 onChange={() => setPrfData(prev =>({
                      //   ...prev,
                      //   SummaryOfCandidPrfDetails: {
                      //     ...prev.SummaryOfCandidPrfDetails,
                      //     job_desc:
                      //   },
                      // }))}
                    />{" "}
                    <button>Remove</button>
                  </li>
                )
              )}
          </ol>
        </>
      </div>
    </div>
  )
}

export default CustomJOinput
