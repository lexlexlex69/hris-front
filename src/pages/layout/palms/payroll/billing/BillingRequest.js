import axios from "axios";
import { api_url } from "../../../../../request/APIRequestURL";

export function getLoanTypes() {
  return axios.request({
    method: "POST",
    url: "api/payroll/getLoanTypes",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000", // Specify the origin if needed
    },
  });
}
export function postBilling(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/postBilling",
  });
}
export function getEmpBilling(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/getEmpBilling",
  });
}
export function updateEmpBilling(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/updateEmpBilling",
  });
}
export function deleteEmpBilling(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/deleteEmpBilling",
  });
}
export function getBillingData(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/getBillingData",
  });
}
export function getEmpListBillIDs(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/getEmpListBillIDs",
  });
}
export function updateEmpBillIDs(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/updateEmpBillIDs",
  });
}
export function updateEmpBillingID(data) {
  return axios.request({
    method: "POST",
    data: data,
    url: "api/payroll/updateEmpBillingID",
  });
}
export function tempLoanTypes() {
  return [
    {
      loan_code: "10",
      loan_desc: "PAG-IBIG HOUSING LOAN",
      abbr_name: "HOUSING LOAN",
      type: "2",
    },
    {
      loan_code: "16",
      loan_desc: "GSIS ENHANCED SALARY LOAN - OLD",
      abbr_name: "ESL OLD",
      type: "2",
    },
    {
      loan_code: "2",
      loan_desc: "PAG-IBIG CALAMITY LOAN",
      abbr_name: "HDMF CAL",
      type: "2",
    },
    {
      loan_code: "20",
      loan_desc: "OTHER PAYABLES - GSIS PS",
      abbr_name: "GSIS PS",
      type: "3",
    },
    {
      loan_code: "21",
      loan_desc: "OTHER PAYABLES - GSIS GS",
      abbr_name: "GSIS GS",
      type: "3",
    },
    {
      loan_code: "24",
      loan_desc: "KADIWA BIRTHDAY REGALO",
      abbr_name: "KADIWA",
      type: "2",
    },
    {
      loan_code: "28",
      loan_desc: "GSIS POLICY LOAN REGULAR",
      abbr_name: "PLRG",
      type: "2",
    },
    {
      loan_code: "29",
      loan_desc: "GSIS POLICY LOAN OPTIONAL",
      abbr_name: "PLOPT",
      type: "2",
    },
    {
      loan_code: "3",
      loan_desc: "GSIS CONSOLIDATED LOAN",
      abbr_name: "CONSOLOAN",
      type: "2",
    },
    {
      loan_code: "30",
      loan_desc: "GSIS POLICY LOAN REGULAR - OLD ACCOUNTS",
      abbr_name: "PLRG OLD",
      type: "2",
    },
    {
      loan_code: "32",
      loan_desc: "GSIS POLICY LOAN OPTIONAL - OLD ACCOUNTS",
      abbr_name: "PLOPT OLD",
      type: "2",
    },
    {
      loan_code: "33",
      loan_desc: "GSIS EMERGENCY LOAN - OLD ACCOUNTS",
      abbr_name: "EMRGYLN OLD",
      type: "2",
    },
    {
      loan_code: "34",
      loan_desc: "GSIS EDUC ASSISTANCE - OLD ACCOUNTS",
      abbr_name: "EDUC_ASST OLD",
      type: "2",
    },
    {
      loan_code: "35",
      loan_desc: "GSIS CONSOLIDATED LOAN - OLD",
      abbr_name: "CONSO OLD",
      type: "2",
    },
    {
      loan_code: "37",
      loan_desc: "GSIS E-CARD PLUS - OLD ACCOUNTS",
      abbr_name: "E-CARD OLD",
      type: "2",
    },
    {
      loan_code: "38",
      loan_desc: "GSIS SOS LOAN - OLD",
      abbr_name: "SOS OLD",
      type: "2",
    },
    {
      loan_code: "4",
      loan_desc: "DBP LOAN",
      abbr_name: "DBP",
      type: "2",
    },
    {
      loan_code: "42",
      loan_desc: "PROVIDENT REGULAR LOAN I",
      abbr_name: "PROV L 1",
      type: "2",
    },
    {
      loan_code: "46",
      loan_desc: "GSIS CASH ADVANCE - OLD ACCOUNT",
      abbr_name: "CASH ADVANCE",
      type: "2",
    },
    {
      loan_code: "48",
      loan_desc: "GSIS CEAP - OLD ACCOUNTS",
      abbr_name: "GSIS CEAP - OLD",
      type: "2",
    },
    {
      loan_code: "51",
      loan_desc: "NETWORK BANK LOAN",
      abbr_name: "NETWORK",
      type: "2",
    },
    {
      loan_code: "52",
      loan_desc: "CHILD SUPPORT - MILA BUSICO",
      abbr_name: "CHILD SUPPORT",
      type: "2",
    },
    {
      loan_code: "53",
      loan_desc: "SUNLIFE OF CANADA",
      abbr_name: "SUNLIFE",
      type: "2",
    },
    {
      loan_code: "54",
      loan_desc: "GSIS REAL ESTATE LOAN",
      abbr_name: "REL",
      type: "2",
    },
    {
      loan_code: "57",
      loan_desc: "NHMF LOAN",
      abbr_name: "NHMF",
      type: "2",
    },
    {
      loan_code: "58",
      loan_desc: "PAG-IBIG MP2",
      abbr_name: "HDMF MP2",
      type: "1",
    },
    {
      loan_code: "6",
      loan_desc: "GSIS EDUC ASSISTANCE",
      abbr_name: "EDUC_ ASST.",
      type: "2",
    },
    {
      loan_code: "60",
      loan_desc: "GSIS CEAP",
      abbr_name: "CEAP",
      type: "2",
    },
    {
      loan_code: "61",
      loan_desc: "GSIS UOLI PREMIUM",
      abbr_name: "OPT_LIFE",
      type: "1",
    },
    {
      loan_code: "63",
      loan_desc: "PROVIDENT REGULAR LOAN II",
      abbr_name: "PROV L 2",
      type: "2",
    },
    {
      loan_code: "64",
      loan_desc: "OTHER PAYABLES - GSIS MPL DEFICIENT",
      abbr_name: "GSIS MPL DEF.",
      type: "3",
    },
    {
      loan_code: "66",
      loan_desc: "PROVIDENT MEMBERSHIP",
      abbr_name: "MEMBERSHIP",
      type: "3",
    },
    {
      loan_code: "7",
      loan_desc: "GSIS EMERGENCY LOAN",
      abbr_name: "EMRGYLN",
      type: "2",
    },
    {
      loan_code: "71",
      loan_desc: "COA DISALLOWANCE",
      abbr_name: "COA DIS",
      type: "3",
    },
    {
      loan_code: "72",
      loan_desc: "GSIS GFAL",
      abbr_name: "",
      type: "2",
    },
    {
      loan_code: "73",
      loan_desc: "LANDBANK",
      abbr_name: "LBP",
      type: "2",
    },
    {
      loan_code: "74",
      loan_desc: "BCGEA",
      abbr_name: "BCGEA",
      type: "2",
    },
    {
      loan_code: "75",
      loan_desc: "PROVIDENT LOAN DELINQUENT",
      abbr_name: "PROV DEL",
      type: "2",
    },
    {
      loan_code: "76",
      loan_desc: "GSIS COMPUTER LOAN ",
      abbr_name: "COMP. LOAN",
      type: "2",
    },
    {
      loan_code: "77",
      loan_desc: "GSIS MPL",
      abbr_name: "GSIS MPL",
      type: "2",
    },
    {
      loan_code: "78",
      loan_desc: "SSS DEDUCTION",
      abbr_name: "SSS DEC.",
      type: "3",
    },
    {
      loan_code: "9",
      loan_desc: "PAG-IBIG MULTI PURPOSE LOAN",
      abbr_name: "MPL HDMF",
      type: "2",
    },
  ];
}
