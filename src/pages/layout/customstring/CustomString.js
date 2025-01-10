import { isValid } from "date-fns"
import moment from "moment"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { blue, grey } from "@mui/material/colors"
import { styled } from "@mui/material/styles"
import Swal from "sweetalert2"
import ReactPanZoom from "react-image-pan-zoom-rotate"
import { Alert } from "@mui/material"
export const API_KEY = process.env.REACT_APP_KEY

export function autoCapitalizeFirstLetter(string) {
  var t = string.split(" ")
  // return t;
  var f = ""
  t.forEach((el, key) => {
    if (key === t.length - 1) {
      f = f + el.charAt(0).toUpperCase() + el.substring(1).toLowerCase()
    } else {
      f = f + el.charAt(0).toUpperCase() + el.substring(1).toLowerCase() + " "
    }
  })
  return f
}
export function truncateToDecimals(num, dec = 2) {
  const calcDec = Math.pow(10, dec)
  return Math.trunc(num * calcDec) / calcDec
}
export function formatExtName(val) {
  var ext_names = [
    "JR.",
    "JR",
    "SR",
    "SR.",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
  ]
  if (val) {
    if (ext_names.includes(val.toUpperCase())) {
      return val + "."
    } else {
      return ""
    }
  }
  return ""
}
export function truncateToDecimalsCOC(num, dec = 2) {
  // const calcDec = Math.pow(10, dec);
  // return Math.trunc(num * calcDec) / calcDec;
  if (num) {
    return parseFloat(num).toFixed(3)
  } else {
    return null
  }
}
export function formatTimeWithoutPeriod(time) {
  if (time) {
    if (time.trim().length > 0) {
      /**
            Check if valid time
            */
      var is_valid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
        moment(time.trim(), "H:mm").format("H:mm")
      )
      if (is_valid) {
        return moment(time, ["hh:mm"]).format("hh:mm")
      } else {
        return time
      }
    } else {
      return null
    }
  } else {
    return null
  }
}
export function formatLogs(time) {
  var is_valid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
    moment(time, "H:mm").format("H:mm")
  )
  if (is_valid) {
    return moment(time, "H:m").format("hh:mm A")
  }
  return
}
export function formatTimeWithPeriod(time) {
  if (time) {
    if (time.trim().length > 0) {
      /**
            Check if valid time
            */
      var is_valid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
        moment(time.trim(), "H:mm").format("H:mm")
      )
      if (is_valid) {
        return moment(time, ["hh:mma"]).format("hh:mma")
      } else {
        return time
      }
    } else {
      return null
    }
  } else {
    return null
  }
}
export function formatPositionName(name) {
  if (name) {
    if (name.trim().length > 0) {
      if (name.length > 50) {
        if (name.includes("(")) {
          var temp = name.split("(")
          return (
            <span style={{ fontSize: ".8rem" }}>
              {temp[0]} <br />({temp[1]}
            </span>
          )
        } else {
          return <span style={{ fontSize: ".8rem" }}>{name}</span>
        }
      } else {
        return name
      }
    } else {
      return null
    }
  } else {
    return null
  }
}
export function formatDefaultPositionName(name) {
  if (name) {
    if (name.trim().length > 0) {
      if (name.includes("(")) {
        var temp = name.split("(")
        return (
          <p style={{ lineHeight: 1 }}>
            {temp[0]} <br />({temp[1]}
          </p>
        )
      } else {
        return <p>{name}</p>
      }
    } else {
      return null
    }
  } else {
    return null
  }
}
export function formatDeptName(name) {
  if (name) {
    if (name.trim().length > 0) {
      if (name.length > 36) {
        return <span style={{ fontSize: ".8rem" }}>{name}</span>
      } else {
        return name
      }
    } else {
      return null
    }
  } else {
    return null
  }
}
export function formatFullname(name) {
  if (name) {
    if (name.trim().length > 0) {
      var arr = name.split(" ")
      return (
        <span>
          {arr[2]}, {arr[0]}, {arr[1]}
        </span>
      )
    } else {
      return null
    }
  } else {
    return null
  }
}
export function formatMiddlename(name) {
  if (name) {
    return name.charAt(0).toUpperCase() + "."
  } else {
    return ""
  }
}
export function formatOfficeName(text) {
  if (text) {
    if (text.length > 40) {
      if (text.length > 50) {
        return <span style={{ fontSize: "9px" }}>{text.toUpperCase()}</span>
      } else {
        return <span style={{ fontSize: "10px" }}>{text.toUpperCase()}</span>
      }
    } else {
      return text.toUpperCase()
    }
  } else {
    return null
  }
}
export function formatDatePeriod(date1, date2) {
  if (moment(date1).format("MMMM") === moment(date2).format("MMMM")) {
    return moment(date1).format("MMMM DD - ") + moment(date2).format("DD, YYYY")
  } else {
    return (
      moment(date1).format("MMMM DD - ") + moment(date2).format("MMMM DD, YYYY")
    )
  }
}
export function formatDeptWithChar(dept) {
  if (dept.includes("(")) {
    var temp = dept.split("(")
    return <span style={{ fontSize: ".6rem" }}>{"(" + temp[1]}</span>
  } else {
    return null
  }
}
export function formatAddress(string) {
  if (string) {
    if (string.includes("n/a") || string.includes("N/A")) {
      return ""
    } else {
      return string
    }
  } else {
    return ""
  }
}
export function evaluationDaysLeftNumber(date) {
  /**
   * implementation of LAP/SAP/REAP 1 day after 10 workings days after the training
   */
  console.log(moment(date).businessAdd(11).format("YYYY-MM-DD"))
  console.log(moment().format("YYYY-MM-DD"))
  return moment(date).businessAdd(10)
  var d_range = 90

  /**
   * 15 days period for submission of LAP/SAP/REAP, 90+15=105
   */
  var u_range = 105

  var curr_date = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD")
  var e_date = moment(date, "YYYY-MM-DD")
    .add(d_range, "days")
    .format("YYYY-MM-DD")
  var e_date2 = moment(date, "YYYY-MM-DD")
    .add(d_range, "days")
    .format("MMMM DD,YYYY")

  /**
   * evaluation until closed
   */
  var until_date = moment(date, "YYYY-MM-DD")
    .add(u_range, "days")
    .format("YYYY-MM-DD")

  /**
   * remaining days until evaluation
   */
  var d_left = moment(date, "YYYY-MM-DD")
    .add(d_range, "days")
    .diff(curr_date, "days")
  /**
   * remaining days until evaluation closed
   */
  var r_left = moment(until_date).diff(curr_date, "days") + 1
  return r_left
}
export function evaluationDaysLeftNumberForReports(date) {
  /**
   * implementation of LAP/SAP/REAP 90 days
   */
  var d_range = 90

  /**
   * 15 days period for submission of LAP/SAP/REAP, 90+15=105
   */
  var u_range = 104

  var curr_date = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD")
  var e_date = moment(date, "YYYY-MM-DD")
    .add(d_range, "days")
    .format("YYYY-MM-DD")
  var e_date2 = moment(date, "YYYY-MM-DD")
    .add(d_range, "days")
    .format("MMMM DD,YYYY")

  /**
   * evaluation until closed
   */
  var until_date = moment(date, "YYYY-MM-DD")
    .add(u_range, "days")
    .format("YYYY-MM-DD")

  /**
   * remaining days until evaluation
   */
  var d_left = moment(date, "YYYY-MM-DD")
    .add(d_range, "days")
    .diff(curr_date, "days")
  /**
   * remaining days until evaluation closed
   */
  var r_left = moment(until_date).diff(curr_date, "days") + 1
  return r_left
}
// export function evaluationDaysLeft(date){
//         /**
//          * implementation of LAP/SAP/REAP 90 days
//          */
//         var d_range = parseInt(moment(date).businessAdd(10).format('D'));

//         /**
//          * 15 days period for submission of LAP/SAP/REAP, 90+15=105
//          */
//         var u_range = 105;

//         var curr_date = moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD');
//         var e_date = moment(date,'YYYY-MM-DD').add(d_range,'days').format('YYYY-MM-DD')
//         var e_date2 = moment(date,'YYYY-MM-DD').add(d_range,'days').format('MMMM DD,YYYY')

//         /**
//          * evaluation until closed
//          */
//         var until_date = moment(date,'YYYY-MM-DD').businessAdd(11).add(u_range,'days').format('YYYY-MM-DD');

//         /**
//          * remaining days until evaluation
//          */
//         var d_left = (moment(date,'YYYY-MM-DD').add(d_range,'days')).diff(curr_date,'days')
//         /**
//          * remaining days until evaluation closed
//          */
//         var r_left = (moment(until_date).diff(curr_date,'days'))+1
//         if(curr_date < e_date){
//             return <em>{e_date2} (<span style={{color:'red',fontWeight:'bold'}}>{d_left} {d_left>1?'day/s':'day'} left</span>)</em>
//         }else if(curr_date >= e_date && curr_date <=until_date){
//             return <em>Evaluation until: <span style={{color:'red',fontWeight:'bold'}}>{moment(until_date).format('MMMM DD,YYYY')}</span> <br/><span style={{color:'red',fontWeight:'bold'}}>({r_left} {r_left>1?'day/s':'day'} left)</span></em>
//         }else{
//             return <em style={{color:'red'}}><strong style={{textTransform:'uppercase'}}>Evaluation closed</strong> <br/>(close on: {moment(until_date).format('MMMM DD,YYYY')})</em>
//         }

// }
export function evaluationDaysLeft(date) {
  /**
   * evaluation of trainee 11 working days after training
   */
  let start = moment(date).businessAdd(11)

  let deadline = moment(date).businessAdd(11).add(105, "days")

  if (moment().format("YYYY-MM-DD") >= moment(start).format("YYYY-MM-DD")) {
    if (moment().format("YYYY-MM-DD") > moment(deadline).format("YYYY-MM-DD")) {
      return (
        <em>
          Evaluation Deadline:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            {moment(deadline).format("MMMM DD, YYYY")} (Overdue)
          </span>
        </em>
        // <em><span style={{color:'red',fontWeight:'bold'}}>EVALUATION CLOSED</span><br/>
        // Closed On: <span style={{color:'red',fontWeight:'bold'}}>{moment(deadline).format('MMMM DD, YYYY')}</span></em>
      )
    } else {
      return (
        <em>
          Evaluation Deadline:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            {moment(deadline).format("MMMM DD, YYYY")}
          </span>
        </em>
      )
    }
  } else if (
    moment().format("YYYY-MM-DD") < moment(start).format("YYYY-MM-DD")
  ) {
    return (
      <em>
        Evaluation Start:{" "}
        <span style={{ color: "green", fontWeight: "bold" }}>
          {moment(start).format("MMMM DD, YYYY")}
        </span>
      </em>
    )
  }
}
export function formatManualInputPosition(string) {
  if (string) {
    if (string.includes("(")) {
      let arr = string.split("(")
      return (
        <span>
          <strong>
            <u>{arr[0].toUpperCase()}</u>
          </strong>{" "}
          <br />
          {`${arr[1].replace(")", "")}`}
        </span>
      )
    } else {
      return (
        <strong>
          <u>{string?.toUpperCase()}</u>
        </strong>
      )
    }
  } else {
    return string
  }
}
export function formatTwoDateToText(date1, date2) {
  if (
    moment(date1).format("YYYY-MM-DD") === moment(date2).format("YYYY-MM-DD")
  ) {
    return moment(date1).format("MMMM DD, YYYY")
  } else if (
    moment(date1).format("YYYY-MM") === moment(date2).format("YYYY-MM")
  ) {
    return `${moment(date1).format("MMMM DD")}-${moment(date2).format(
      "DD, YYYY"
    )}`
  } else {
    if (moment(date1).format("YYYY") === moment(date2).format("YYYY")) {
      return `${moment(date1).format("MMMM DD")} - ${moment(date2).format(
        "MMMM DD, YYYY"
      )}`
    } else {
      return `${moment(date1).format("MMMM DD, YYYY")} - ${moment(date2).format(
        "MMMM DD, YYYY"
      )}`
    }
  }
}
export function formatTwoDateToTextPayroll(date1, date2) {
  if (
    moment(date1).format("YYYY-MM-DD") === moment(date2).format("YYYY-MM-DD")
  ) {
    return moment(date1).format("MMMM DD, YYYY")
  } else if (
    moment(date1).format("YYYY-MM") === moment(date2).format("YYYY-MM")
  ) {
    return (
      <span>
        {moment(date1).format("MMMM")} {moment(date1).format("DD")}-
        {moment(date2).format("D, YYYY")}
      </span>
    )
  } else {
    if (moment(date1).format("YYYY") === moment(date2).format("YYYY")) {
      return `${moment(date1).format("MMMM DD")} - ${moment(date2).format(
        "MMMM DD, YYYY"
      )}`
    } else {
      return `${moment(date1).format("MMMM DD, YYYY")} - ${moment(date2).format(
        "MMMM DD, YYYY"
      )}`
    }
  }
}
export function formatTwoDateToTextShort(date1, date2) {
  if (
    moment(date1).format("YYYY-MM-DD") === moment(date2).format("YYYY-MM-DD")
  ) {
    return moment(date1).format("MMM. DD, YYYY")
  } else if (
    moment(date1).format("YYYY-MM") === moment(date2).format("YYYY-MM")
  ) {
    return `${moment(date1).format("MMM. DD")}-${moment(date2).format(
      "DD, YYYY"
    )}`
  } else {
    if (moment(date1).format("YYYY") === moment(date2).format("YYYY")) {
      return `${moment(date1).format("MMM. DD")} - ${moment(date2).format(
        "MMM. DD, YYYY"
      )}`
    } else {
      return `${moment(date1).format("MMM. DD, YYYY")} - ${moment(date2).format(
        "MMM. DD, YYYY"
      )}`
    }
  }
}
export function formatLeavePosition(val) {
  if (val) {
    if (val.trim().length > 0) {
      if (val.length > 50) {
        if (val.includes("(")) {
          var temp = val.split("(")
          return (
            <span style={{ borderBottom: "solid 1px", fontSize: ".7rem" }}>
              {temp[0]} <br />({temp[1]}
            </span>
          )
        } else {
          return (
            <span style={{ borderBottom: "solid 1px", fontSize: ".7rem" }}>
              {val}
            </span>
          )
        }
      } else {
        return <span style={{ borderBottom: "solid 1px" }}>{val}</span>
      }
    } else {
      return null
    }
  } else {
    return null
  }
}
export function isValidTime(time) {
  return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
    moment(time, "H:mm").format("H:mm")
  )
}
export function formatWithCommas(x) {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  } else {
    return ""
  }
}
export function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[800],
    color: theme.palette.common.white,
    // fontSize: matches?12:15,
  },
  [`&.${tableCellClasses.body}`]: {
    // fontSize: matches?10:13,
  },
}))
export const StyledTableCellSmall = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[900],
    color: theme.palette.common.white,
    fontSize: ".8rem",
    fontWeight: "bold",
    padding: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    // fontSize: matches?10:13,
    fontSize: ".7rem",
    color: grey[800],
    textTransform: "uppercase",
  },
}))
export const StyledTableCellLedger = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[800],
    color: theme.palette.common.white,
    fontSize: ".7rem",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    // fontSize: matches?10:13,
    fontSize: ".7rem",
    color: grey[800],
    textTransform: "uppercase",
    padding: 5,
  },
}))
export const StyledTableCellSmallPayroll = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[800],
    color: theme.palette.common.white,
    fontSize: ".7rem",
    fontWeight: "bold",
    padding: 2,
  },
  [`&.${tableCellClasses.body}`]: {
    // fontSize: matches?10:13,
    fontSize: ".7rem",
    color: grey[800],
    textTransform: "uppercase",
  },
}))
export const StyledTableCellPayroll = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[900],
    // backgroundColor: grey[200],
    color: theme.palette.common.white,
    fontSize: ".7rem",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: ".7rem",
    padding: 10,
    fontWeight: "light",
  },
  [`&.${tableCellClasses.footer}`]: {
    fontSize: ".7rem",
    padding: 10,
  },
}))
export const StyledTableCellPayrollSetup = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[900],
    // backgroundColor: grey[200],
    color: theme.palette.common.white,
    fontSize: ".8rem",
    padding: 8,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: ".8rem",
    padding: 8,
    fontWeight: "light",
  },
  [`&.${tableCellClasses.footer}`]: {
    fontSize: ".7rem",
    padding: 10,
  },
}))
export const StyledTableCellPayrollDtl = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[700],
    // backgroundColor: grey[200],
    color: theme.palette.common.white,
    fontSize: ".8rem",
    padding: 8,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: ".7rem",
    padding: 5,
    fontWeight: "light",
  },
  [`&.${tableCellClasses.footer}`]: {
    fontSize: ".7rem",
    padding: 10,
  },
}))
export function APISuccess(title, text) {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    timer: 1000,
    showConfirmButton: false,
  })
}
export function APIError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
  })
}
export function APIWarning(title, text) {
  Swal.fire({
    icon: "warning",
    title: title,
    text: text,
  })
}
export function formatEmptyNumber(number, val) {
  if (parseFloat(number) > 0) {
    return formatWithCommas(parseFloat(number).toFixed(2))
  } else {
    return "-"
  }
}
export function formatName(fname, mname, lname, extname, type) {
  if (type === 1) {
    return `${lname} ${formatExtName(extname)}, ${fname} ${formatMiddlename(
      mname
    )} `
  } else if (type === 2) {
    return `${lname} ${formatExtName(extname)}, ${fname}, ${formatMiddlename(
      mname
    )} `
  } else {
    return `${fname} ${formatMiddlename(mname)} ${lname} ${formatExtName(
      extname
    )}`
  }
}
export function FilePanZoom(img, alt) {
  // console.log(img.img)
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: "80vh",
      }}
    >
      <ReactPanZoom image={img.img} alt={alt} />
    </div>
  )
}
export function UnderDevelopmentStat() {
  return (
    <Alert severity="info">
      This module is under development. All functionality will be available
      soon.
    </Alert>
  )
}
export function compLateUT(type, m_salary) {
  let val = 0
  switch (type) {
    case "days":
      var per_day = parseFloat(m_salary) / 22
      val = truncateToDecimals(per_day)
      break
    case "hours":
      var per_day = parseFloat(m_salary) / 22
      var per_hour = per_day / 8
      val = truncateToDecimals(per_hour)
      break
    case "minutes":
      var per_day = parseFloat(m_salary) / 22
      var per_hour = per_day / 8
      var per_minute = per_hour / 60
      val = truncateToDecimals(per_minute)
      break
  }
  return val
}

export function formatDateToWorded(date) {
  return moment(date).format("MMMM  DD, YYYY")
}

export function formatNameAbbreviation(data) {
  let abbrev = ""
  const words = data.split(" ")
  words.forEach((word) => {
    abbrev += word[0].toUpperCase()
  })
  return abbrev
}
