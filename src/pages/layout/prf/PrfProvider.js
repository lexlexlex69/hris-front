import React, { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useImmer } from "use-immer";
import {
  tableEvalColumns,
  tableHeadColumns,
  tableQSColumns,
} from "./components/TableHeadAtt";
import moment from "moment";
import { getDept, getNatReqData, getPositionList } from "./axios/prfRequest";
import { toast } from "react-toastify";

// Create context for PrfStateContext
export const PrfStateContext = createContext(null);

const PrfProvider = ({ children }) => {
  const matches = useMediaQuery("(min-width:65%)");
  const [userId, setUserId] = useState(
    localStorage.getItem("hris_employee_id")
  );

  const [applicantData, setApplicantData] = useState({});
  const [applicantList, setApplicantList] = useState([]);
  const [assessmentList, setAssessmentList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [bIList, setBIList] = useState([]);
  const [assessmentStatus, setAssessmentStatus] = useState([]);

  const [loading, setLoading] = useState(true);
  const [colData, setColData] = useState(tableHeadColumns);
  const [rowData, setRowData] = useState([]);
  const [colDataQS, setColDataQS] = useState(tableQSColumns);
  const [rowDataQS, setRowDataQs] = useState([]);
  const [requestDataForm, setRequestDataForm] = useImmer({
    prf_no: null, //int
    office_dept: null, //string
    div_id: null, //id
    sec_id: null, //id
    unit_id: null, //id
    head_cnt: null, //int
    pay_sal: null, //int
    position: null, //string
    date_requested: null, //date
    date_needed: null, //date
    nature_req: [], //array text
    emp_stat: null, //string
    justification: null, //text
    job_summary: [], //id
    qs_educ_id: [], //id
    qs_elig_id: [], //id
    qs_expe_id: [], //id
    qs_tech_skll_id: [], //id
    qs_train_id: [], //id
    qs_other_id: null, //text

    id_pr_form: null,
    req_by_id: null,
    avail_app_id: null,
    rev_by_id: null,
    approval_id: null,
    remarks: null,
  });
  const [signedBy, setSignedBy] = useImmer({
    requester: false,
    availability: false,
    reviewed: false,
    approved: false,
  });
  const [deptData, setDeptData] = useState([]);
  const [tempt, setTempt] = useState([]);
  const [signedByHeadReq, setSignedByHeadReq] = useImmer({
    office_dept: null,
    emp_name: null,
    date: null,
    time: null,
    esig: null,
    trig: false,
    request_stat: null,
  });
  const [signedByAvail, setSignedByAvail] = useImmer({
    office_dept: null,
    emp_name: null,
    date: null,
    time: null,
    esig: null,
    trig: false,
    request_stat: null,
  });
  const [signedByRevBy, setSignedByRevBy] = useImmer({
    office_dept: null,
    emp_name: null,
    date: null,
    time: null,
    esig: null,
    trig: false,
    request_stat: null,
  });
  const [signedByAppvl, setSignedByAppvl] = useImmer({
    office_dept: null,
    emp_name: null,
    date: null,
    time: null,
    esig: null,
    trig: false,
    pos: null,
    request_stat: null,
  });
  const [requestSignsViewer, setRequestSignsViewer] = useImmer({
    req_by_id: false,
    avail_app_id: false,
    rev_by_id: false,
    approval_id: false,
  });

  const [noDataFound, setNoDataFound] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const dateToday = moment().format("L");
  const [tempStorage, setTempStorage] = useImmer({
    head_signer: false,
    tempRequester: "",
    dept_code: null,
    office_dept: "",
    emp_name: "",
    pos: "",
    esig: "",
  });
  const [signPermHR, setSignPermHR] = useState(false);
  const [signPermB, setSignPermB] = useState(false);
  const [signPermApproval, setSignPermApproval] = useState(false);

  // temporary container for request details
  const [tempReq, setTempReq] = useState({});
  const [tempSign, setTempSign] = useState({});

  // Dropdown menu data {
  const [empStat, setEmpStat] = useState([]);
  const [natureReq, setNatureReq] = useState([]);
  const [deptOrg, setDeptOrg] = useState({});
  const [posTitle, setPosTitle] = useState([]);
  const [qsState, setQsState] = useImmer([]);
  // }

  const [errors, setErrors] = useState([]);

  // Pagination {
  const postsPerPage = 15;
  const [offSet, setOffSet] = useState(0);
  const [searchValue, setSearchValue] = useState(null);
  // }

  // IAF {
  const [openedPR, setOpenedPR] = useState(null);
  // }

  //for printables summary of candidates
  const [summaryOfCandid, setSummaryOfCandid] = useState(null);
  useEffect(() => {
    fetchDataPDList();
  }, []);
  const fetchDataPDList = async () => {
    try {
      const [response1, response2, response3] = await Promise.all([
        getPositionList(),
        getDept(),
        getNatReqData(),
      ]);
      setPosTitle(response1.data.data);
      setDeptData(response2.data.data);
      setNatureReq(response3.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setDataToNull = () => {
    setErrors([]);
    setRequestDataForm((draft) => {
      draft.prf_no = "";
      draft.office_dept = "";
      draft.div_id = "";
      draft.sec_id = "";
      draft.unit_id = "";
      draft.head_cnt = "";
      draft.pay_sal = "";
      draft.position = {};
      draft.date_requested = "";
      draft.date_needed = "";
      draft.nature_req = [];
      draft.emp_stat = "";
      draft.justification = "";
      draft.job_summary = [];
      draft.qs_educ_id = [];
      draft.qs_elig_id = [];
      draft.qs_expe_id = [];
      draft.qs_tech_skll_id = [];
      draft.qs_train_id = [];
      draft.qs_other_id = "";

      draft.id_pr_form = "";
      draft.req_by_id = "";
      draft.avail_app_id = "";
      draft.rev_by_id = "";
      draft.approval_id = "";
      draft.remarks = "";
    });
    setRequestSignsViewer((draft) => {
      draft.req_by_id = false;
      draft.avail_app_id = false;
      draft.rev_by_id = false;
      draft.approval_id = false;
    });
    setSignedBy((draft) => {
      draft.requester = false;
      draft.availability = false;
      draft.reviewed = false;
      draft.approved = false;
    });
    setSignedByHeadReq((draft) => {
      draft.office_dept = "";
      draft.emp_name = "";
      draft.date = "";
      draft.time = "";
      draft.request_stat = "";
      draft.add_remarks = "";
      draft.esig = "";
      draft.trig = false;
      draft.request_stat = "";
    });
    setSignedByAvail((draft) => {
      draft.office_dept = "";
      draft.emp_name = "";
      draft.date = "";
      draft.time = "";
      draft.request_stat = "";
      draft.add_remarks = "";
      draft.esig = "";
      draft.trig = false;
      draft.request_stat = "";
    });
    setSignedByRevBy((draft) => {
      draft.office_dept = "";
      draft.emp_name = "";
      draft.date = "";
      draft.time = "";
      draft.request_stat = "";
      draft.add_remarks = "";
      draft.esig = "";
      draft.trig = false;
      draft.request_stat = "";
    });
    setSignedByAppvl((draft) => {
      draft.office_dept = "";
      draft.emp_name = "";
      draft.date = "";
      draft.time = "";
      draft.request_stat = "";
      draft.add_remarks = "";
      draft.esig = "";
      draft.trig = false;
      draft.request_stat = "";
    });
    setTempt([]);
  };

  const contextValues = {
    matches,
    userId,
    setUserId,
    colData,
    rowData,
    setRowData,
    requestDataForm,
    setRequestDataForm,
    signedBy,
    setSignedBy,
    requestSignsViewer,
    setRequestSignsViewer,
    noDataFound,
    setNoDataFound,
    empStat,
    setEmpStat,
    applicantList,
    setApplicantList,
    natureReq,
    setNatureReq,
    errors,
    setErrors,
    dateToday,
    setDataToNull,
    deptOrg,
    setDeptOrg,
    colDataQS,
    rowDataQS,
    setRowDataQs,
    tempStorage,
    setTempStorage,
    posTitle,
    setPosTitle,
    qsState,
    setQsState,
    isLoading,
    setIsLoading,
    signedByHeadReq,
    setSignedByHeadReq,
    signedByAvail,
    setSignedByAvail,
    signedByRevBy,
    setSignedByRevBy,
    signedByAppvl,
    setSignedByAppvl,
    postsPerPage,
    offSet,
    setOffSet,
    searchValue,
    setSearchValue,
    tempt,
    setTempt,
    deptData,
    setDeptData,
    tempReq,
    setTempReq,
    tempSign,
    setTempSign,
    signPermHR,
    setSignPermHR,
    signPermB,
    setSignPermB,
    signPermApproval,
    setSignPermApproval,
    openedPR,
    setOpenedPR,

    applicantData,
    setApplicantData,
    assessmentList,
    setAssessmentList,
    examList,
    setExamList,
    bIList,
    setBIList,
    assessmentStatus,
    setAssessmentStatus,
    fetchDataPDList,
  };

  if (loading) {
    return null;
  }

  return (
    <PrfStateContext.Provider value={contextValues}>
      {children}
    </PrfStateContext.Provider>
  );
};

export default PrfProvider;
